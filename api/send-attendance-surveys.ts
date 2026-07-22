import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Runs on a daily Vercel Cron schedule (see vercel.json). For every approved
// AND mutually deal-confirmed offer whose scheduled_at has passed (with a
// 1-day buffer), creates the two attendance_surveys rows (bidirectional), a
// matching in-app notification, and emails each respondent a one-click "did
// they show up?" link. deal_confirmed_at IS NOT NULL excludes chats that got
// superseded (e.g. talent approved into several chats but only confirmed
// one) -- see confirm_deal() in supabase_schema.sql section 13.
//
// Uses the Supabase service role key (server-only env var) so it can bypass
// RLS -- attendance_surveys otherwise has no INSERT policy at all, by design.

const SURVEY_RESPONSE_WINDOW_DAYS = 7;
const SCHEDULED_AT_BUFFER_MS = 24 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const appUrl = process.env.APP_URL;

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !fromEmail || !appUrl) {
    res.status(500).json({ error: 'missing required environment variables' });
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const cutoff = new Date(Date.now() - SCHEDULED_AT_BUFFER_MS).toISOString();
  const { data: dueOffers, error: fetchError } = await supabaseAdmin
    .from('offers')
    .select('id, sender_id, receiver_id')
    .eq('status', 'approved')
    .eq('survey_generated', false)
    .not('deal_confirmed_at', 'is', null)
    .lt('scheduled_at', cutoff);

  if (fetchError) {
    res.status(500).json({ error: fetchError.message });
    return;
  }

  let surveysCreated = 0;
  let emailsSent = 0;
  const errors: string[] = [];

  for (const offer of dueOffers ?? []) {
    const expiresAt = new Date(Date.now() + SURVEY_RESPONSE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const pairs = [
      { respondent_id: offer.sender_id, subject_id: offer.receiver_id },
      { respondent_id: offer.receiver_id, subject_id: offer.sender_id },
    ];

    const { data: surveys, error: insertError } = await supabaseAdmin
      .from('attendance_surveys')
      .insert(pairs.map(p => ({ offer_id: offer.id, ...p, expires_at: expiresAt })))
      .select('id, token, respondent_id');

    if (insertError || !surveys) {
      errors.push(`offer ${offer.id}: ${insertError?.message}`);
      continue;
    }
    surveysCreated += surveys.length;

    for (const survey of surveys) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(survey.respondent_id);
      const email = userData?.user?.email;
      if (!email) continue;

      const attendedLink = `${appUrl}/attendance-response?token=${survey.token}&response=attended`;
      const noShowLink = `${appUrl}/attendance-response?token=${survey.token}&response=no_show`;

      const emailResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: '【DreamBridge】予定の出欠についてお伺いします',
          html: `
            <p>先日確定した予定について、相手は予定通り対応しましたか？</p>
            <p>
              <a href="${attendedLink}" style="display:inline-block;padding:10px 20px;background:#10b981;color:#fff;text-decoration:none;border-radius:6px;margin-right:8px;">はい、対応しました</a>
              <a href="${noShowLink}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px;">いいえ、来ませんでした</a>
            </p>
            <p style="color:#888;font-size:12px;">このリンクは${SURVEY_RESPONSE_WINDOW_DAYS}日間有効です。</p>
          `,
        }),
      });

      if (emailResp.ok) {
        emailsSent += 1;
      } else {
        errors.push(`email to ${email} failed: ${await emailResp.text()}`);
      }

      await supabaseAdmin.from('notifications').insert({
        user_id: survey.respondent_id,
        type: 'attendance_survey',
        title: '出欠アンケートのお願い',
        message: '先日の予定について、相手の出欠を教えてください。',
        link: `/attendance-response?token=${survey.token}`,
      });
    }

    await supabaseAdmin.from('offers').update({ survey_generated: true }).eq('id', offer.id);
  }

  res.status(200).json({ offersProcessed: dueOffers?.length ?? 0, surveysCreated, emailsSent, errors });
}
