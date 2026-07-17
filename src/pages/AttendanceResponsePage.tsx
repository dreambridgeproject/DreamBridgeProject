import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

type SurveyResponse = 'attended' | 'no_show';
type PageState = 'awaiting_choice' | 'submitting' | 'done' | 'invalid' | 'error' | 'no_token';

// Public page, reachable without login: the token in the URL is the sole
// authorization. Reached two ways --
//   1. Email one-click link: ?token=...&response=attended|no_show -- submits immediately.
//   2. In-app notification link: ?token=... only -- shows the yes/no question.
const AttendanceResponsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const token = searchParams.get('token');
  const presetResponse = searchParams.get('response') as SurveyResponse | null;
  const [state, setState] = useState<PageState>(token ? 'awaiting_choice' : 'no_token');

  const submit = async (response: SurveyResponse) => {
    if (!token) return;
    setState('submitting');
    const { data, error } = await supabase.rpc('respond_to_attendance_survey', {
      p_token: token,
      p_response: response,
    });
    if (error) {
      setState('error');
    } else {
      setState(data ? 'done' : 'invalid');
    }
  };

  useEffect(() => {
    if (token && presetResponse) {
      submit(presetResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px', textAlign: 'center' }}>
      {state === 'no_token' && <p>{t('attendance.survey_invalid')}</p>}
      {state === 'submitting' && <p>{t('mypage.loading')}</p>}
      {state === 'invalid' && <p>{t('attendance.survey_invalid')}</p>}
      {state === 'error' && <p>{t('attendance.survey_error')}</p>}
      {state === 'done' && (
        <div style={{ color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={40} />
          <p>{t('attendance.survey_thanks')}</p>
        </div>
      )}
      {state === 'awaiting_choice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('attendance.survey_question')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => submit('attended')}
              className="btn"
              style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={18} /> {t('attendance.survey_attended')}
            </button>
            <button
              onClick={() => submit('no_show')}
              className="btn"
              style={{ backgroundColor: 'var(--error)', color: 'white', padding: '0.75rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <XCircle size={18} /> {t('attendance.survey_no_show')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceResponsePage;
