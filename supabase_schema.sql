-- DreamBridge Project - Full Supabase Schema

-- 1. Profiles Table (Extending default auth.users)
-- Note: This assumes the profiles table might already exist, so we use IF NOT EXISTS or ALTER
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'talent', -- talent, agency, casting
    bio TEXT,
    location TEXT,
    age INTEGER,
    birth_date DATE,
    height INTEGER,
    weight INTEGER,
    genres TEXT[] DEFAULT '{}',
    hobbies TEXT,
    skills TEXT,
    website_url TEXT,
    instagram_url TEXT,
    x_url TEXT,
    photos TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    audios TEXT[] DEFAULT '{}',
    plan TEXT DEFAULT 'free',
    verification_status TEXT DEFAULT 'none', -- none, reviewing, verified, rejected
    verification_doc_url TEXT,
    skill_review_status TEXT DEFAULT 'none', -- none, reviewing, approved, rejected
    boosted_until TIMESTAMP WITH TIME ZONE, -- paid PR exposure window; independent of verification/skill review, never affects sort order
    parental_consent_name TEXT,
    parental_consent_contact TEXT,
    blocked_user_ids UUID[] DEFAULT '{}',
    favorite_ids UUID[] DEFAULT '{}',
    reported_by_ids UUID[] DEFAULT '{}',
    affiliation_status TEXT DEFAULT 'unaffiliated',
    agency_id UUID REFERENCES public.profiles(id),
    accept_external_offers BOOLEAN DEFAULT true,
    skill_tags TEXT[] DEFAULT '{}',
    company_description TEXT,
    contact_info TEXT,
    past_works TEXT,
    representative_name TEXT,
    gender TEXT DEFAULT 'none',
    is_banned BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 10. Reports Table
    CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, resolved, dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Indices for Reports
    CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_id);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

    -- 8. Analytics/Log Tables (from previous setup)

CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    sender_role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, declined
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message TEXT,
    mediator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    unread BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Invitations Table (Agency inviting talent)
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, expired
    pre_filled_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    casting_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    skill_tags TEXT[] DEFAULT '{}',
    reward TEXT,
    location TEXT,
    deadline TEXT,
    description TEXT,
    status TEXT DEFAULT 'open', -- open, closed
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    talent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- offer_received, offer_approved, offer_declined, new_message
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- 8. Analytics/Log Tables (from previous setup)
CREATE TABLE IF NOT EXISTS public.view_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_id UUID NOT NULL,
    viewer_role TEXT NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    search_params JSONB NOT NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.action_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_offers_sender ON public.offers(sender_id);
CREATE INDEX IF NOT EXISTS idx_offers_receiver ON public.offers(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_offer ON public.messages(offer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_casting ON public.jobs(casting_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications(job_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 9. Storage Buckets Setup
-- Note: Run these in the Supabase SQL Editor if they are not automatically created.
-- Buckets are managed in the 'storage' schema.

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('audios', 'audios', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false) ON CONFLICT (id) DO NOTHING;

-- Storage Policies

-- Avatars/Photos/Videos/Audios: Everyone can view, owner can upload/delete
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'photos', 'videos', 'audios'));

CREATE POLICY "Users can upload own media" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id IN ('avatars', 'photos', 'videos', 'audios') 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own media" ON storage.objects FOR DELETE 
USING (
    bucket_id IN ('avatars', 'photos', 'videos', 'audios') 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Verification Docs: Only owner can upload, only owner and admins can view
CREATE POLICY "Users can upload own verification docs" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'verification-docs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own verification docs" ON storage.objects FOR SELECT 
USING (
    bucket_id = 'verification-docs' 
    AND (
        (storage.foldername(name))[1] = auth.uid()::text 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
);

-- Helper: looks up the caller's own role without going through RLS again
-- (SECURITY DEFINER bypasses RLS, which avoids infinite recursion when a
-- policy on profiles needs to check the requester's own role).
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Basic Policies (Simplified for development)
-- Profile: talent profiles are only visible to agencies/casting companies (and the talent themselves);
-- agency/casting profiles remain public so talents can browse them.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Role-based profile visibility" ON public.profiles;
CREATE POLICY "Role-based profile visibility" ON public.profiles FOR SELECT USING (
    auth.uid() = id
    OR role != 'talent'
    OR public.get_my_role() IN ('agency', 'casting')
);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Offers: Involved parties can view
CREATE POLICY "Users can view offers they are part of" ON public.offers FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR auth.uid() = mediator_id);

-- Messages: Involved parties can view/send
CREATE POLICY "Users can view messages in their offers" ON public.messages FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.offers 
    WHERE id = offer_id AND (auth.uid() = sender_id OR auth.uid() = receiver_id OR auth.uid() = mediator_id)
));

-- Notifications: Only owner can view/edit
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- TRIGGERS FOR NOTIFICATIONS

-- Trigger for new offer
CREATE OR REPLACE FUNCTION public.handle_new_offer_notification()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        NEW.receiver_id,
        'offer_received',
        '新しいオファーが届きました',
        'スカウトが届いています。詳細を確認しましょう。',
        '/offers'
    );

    IF NEW.mediator_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            NEW.mediator_id,
            'offer_received',
            '所属タレントへのオファーが届きました',
            '制作会社から所属タレントへのオファーが届いています。内容を確認しましょう。',
            '/agency/talents'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_offer
AFTER INSERT ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.handle_new_offer_notification();

-- Trigger for new job application (notifies the casting company that posted the job)
CREATE OR REPLACE FUNCTION public.handle_new_application_notification()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_casting_id UUID;
BEGIN
    SELECT casting_id INTO v_casting_id FROM public.jobs WHERE id = NEW.job_id;

    IF v_casting_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            v_casting_id,
            'application_received',
            '新しい応募が届きました',
            '投稿した案件に応募がありました。内容を確認しましょう。',
            '/jobs/manage'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_job_application
AFTER INSERT ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.handle_new_application_notification();

-- Trigger for offer status change
CREATE OR REPLACE FUNCTION public.handle_offer_status_notification()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            NEW.sender_id,
            'offer_approved',
            'オファーが承認されました',
            '送信したオファーが承認されました。チャットを開始しましょう。',
            '/offers'
        );
    ELSIF OLD.status = 'pending' AND NEW.status = 'declined' THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            NEW.sender_id,
            'offer_declined',
            'オファーが見送られました',
            '送信したオファーが見送られました。',
            '/offers'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_offer_status_change
AFTER UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.handle_offer_status_notification();

-- Trigger for new message
CREATE OR REPLACE FUNCTION public.handle_new_message_notification()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    receiver_id UUID;
BEGIN
    -- Find the other party in the offer
    SELECT 
        CASE 
            WHEN sender_id = NEW.sender_id THEN receiver_id 
            ELSE sender_id 
        END INTO receiver_id
    FROM public.offers
    WHERE id = NEW.offer_id;

    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        receiver_id,
        'new_message',
        '新しいメッセージ',
        '新着メッセージがあります: ' || left(NEW.text, 30),
        '/chat/' || NEW.offer_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.handle_new_message_notification();

-- 11. Attendance / No-show Trust Score
-- Confirmed engagement date, recorded when an offer is approved (covers both
-- scout offers and job-application approvals, since both end up as an
-- 'approved' row in public.offers).
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
-- Set true by the daily survey-generation job once attendance_surveys rows
-- exist for this offer, so the cron query is a plain indexed filter instead
-- of a NOT EXISTS subquery.
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS survey_generated BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_offers_survey_pending ON public.offers(scheduled_at) WHERE status = 'approved' AND survey_generated = false;

-- Trust score aggregates (kept denormalized on profiles so reads stay a
-- simple flag/number lookup, matching verification_status/skill_review_status).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS attendance_score NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS attendance_survey_count INTEGER NOT NULL DEFAULT 0;

-- One row per party per confirmed offer (bidirectional: each side rates the other).
-- Unanswered rows (response IS NULL) are excluded from scoring entirely --
-- accuracy over track-record padding.
CREATE TABLE IF NOT EXISTS public.attendance_surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL,
    respondent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- asked to answer
    subject_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,    -- being rated
    token UUID DEFAULT gen_random_uuid() NOT NULL,
    response TEXT CHECK (response IN ('attended', 'no_show')), -- NULL = not yet answered
    responded_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_surveys_token ON public.attendance_surveys(token);
CREATE INDEX IF NOT EXISTS idx_attendance_surveys_offer ON public.attendance_surveys(offer_id);
CREATE INDEX IF NOT EXISTS idx_attendance_surveys_subject ON public.attendance_surveys(subject_id);

ALTER TABLE public.attendance_surveys ENABLE ROW LEVEL SECURITY;

-- Writes only ever happen through respond_to_attendance_survey() (SECURITY
-- DEFINER below) or the service-role cron job that generates surveys --
-- there is deliberately no INSERT/UPDATE policy here, same approach as
-- notifications being written only via SECURITY DEFINER triggers.
CREATE POLICY "Users can view surveys addressed to them" ON public.attendance_surveys FOR SELECT
USING (auth.uid() = respondent_id);

-- Records a survey response by token (works for both the anonymous one-click
-- email link and a logged-in in-app tap -- token is the sole auth), then
-- recalculates the subject's trust score from all answered surveys.
CREATE OR REPLACE FUNCTION public.respond_to_attendance_survey(p_token UUID, p_response TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_subject_id UUID;
BEGIN
    IF p_response NOT IN ('attended', 'no_show') THEN
        RETURN false;
    END IF;

    UPDATE public.attendance_surveys
    SET response = p_response, responded_at = NOW()
    WHERE token = p_token AND response IS NULL AND expires_at > NOW()
    RETURNING subject_id INTO v_subject_id;

    IF v_subject_id IS NULL THEN
        RETURN false;
    END IF;

    UPDATE public.profiles SET
        attendance_survey_count = (
            SELECT COUNT(*) FROM public.attendance_surveys
            WHERE subject_id = v_subject_id AND response IS NOT NULL
        ),
        attendance_score = (
            SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE response = 'attended') / COUNT(*), 1)
            FROM public.attendance_surveys
            WHERE subject_id = v_subject_id AND response IS NOT NULL
        )
    WHERE id = v_subject_id;

    RETURN true;
END;
$$;

-- Must be callable by unauthenticated visitors following an email link.
GRANT EXECUTE ON FUNCTION public.respond_to_attendance_survey(UUID, TEXT) TO anon, authenticated;

-- 12. Per-user chat hiding ("delete chat" in the UI)
-- Hiding is local to the user who deletes it -- the other party (and any
-- mediator) still sees the thread, and messages/attendance_surveys tied to
-- the offer are untouched, since they're evidence for trust & safety and
-- the no-show scoring pipeline.
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS hidden_by UUID[] NOT NULL DEFAULT '{}';

-- SECURITY DEFINER so hiding doesn't depend on whatever UPDATE policy offers
-- has in prod (that policy isn't tracked in this file -- see notification
-- bug debug notes on schema drift). Only lets a caller add themselves, and
-- only if they're actually a party to the offer.
CREATE OR REPLACE FUNCTION public.hide_chat(p_offer_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.offers
    SET hidden_by = array_append(hidden_by, auth.uid())
    WHERE id = p_offer_id
      AND (auth.uid() = sender_id OR auth.uid() = receiver_id OR auth.uid() = mediator_id)
      AND NOT (auth.uid() = ANY(hidden_by));

    RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.hide_chat(UUID) TO authenticated;

-- 13. Deal Confirmation ("案件成立")
-- offers.status = 'approved' only means the casting/agency side picked this
-- candidate and a chat was opened -- it says nothing about whether the job
-- actually got locked in. A talent can be 'approved' into several chats at
-- once and only really go with one of them, so approved alone isn't a safe
-- signal to feed the no-show survey below. This adds an explicit, mutual
-- confirmation step: both actual negotiating parties (sender_id and
-- receiver_id -- NOT the mediator, who isn't the one doing the job) must
-- independently confirm before a chat counts as a real, finalized job.
-- Scoped to job-tied chats only (job_id IS NOT NULL); job-less scouting
-- chats (e.g. an agency courting a talent for representation) have no
-- shoot date or attendance concept, so this doesn't apply to them.
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS deal_confirmed_by UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS deal_confirmed_at TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE FUNCTION public.confirm_deal(p_offer_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sender_id UUID;
    v_receiver_id UUID;
    v_confirmed_by UUID[];
BEGIN
    UPDATE public.offers
    SET deal_confirmed_by = array_append(deal_confirmed_by, auth.uid())
    WHERE id = p_offer_id
      AND status = 'approved'
      AND job_id IS NOT NULL
      AND (auth.uid() = sender_id OR auth.uid() = receiver_id)
      AND NOT (auth.uid() = ANY(deal_confirmed_by))
    RETURNING sender_id, receiver_id, deal_confirmed_by INTO v_sender_id, v_receiver_id, v_confirmed_by;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    IF v_sender_id = ANY(v_confirmed_by) AND v_receiver_id = ANY(v_confirmed_by) THEN
        UPDATE public.offers SET deal_confirmed_at = NOW() WHERE id = p_offer_id AND deal_confirmed_at IS NULL;
    END IF;

    RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.confirm_deal(UUID) TO authenticated;

-- Re-scope the no-show survey pipeline to confirmed deals only, so chats
-- that got superseded (talent went with a different offer and never
-- confirmed this one) never get surveyed and never wrongly ding anyone's
-- attendance_score. Replaces the index from section 11.
DROP INDEX IF EXISTS idx_offers_survey_pending;
CREATE INDEX IF NOT EXISTS idx_offers_survey_pending ON public.offers(scheduled_at)
    WHERE status = 'approved' AND survey_generated = false AND deal_confirmed_at IS NOT NULL;
