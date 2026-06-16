import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError(t('auth.timeout_error'));
    }, 45000);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (loginError) {
        setError(`${t('auth.login_error')}: ${loginError.message}`);
        setLoading(false);
      } else if (data.user) {
        navigate('/mypage');
      }
    } catch {
      clearTimeout(timeoutId);
      setError(t('auth.login_error'));
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#1a1a1a' }}>{t('auth.title_login')}</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder={t('auth.email')} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
            required 
          />
          <input 
            type="password" 
            placeholder={t('auth.password')} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
            required 
          />
          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? t('auth.logging_in') : t('auth.login_btn')}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
          {t('auth.no_account')}<br />
          <Link to="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.from_top')}</Link>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get('invitation');
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  // New fields for Casting
  const [companyName, setCompanyName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [businessContent, setBusinessContent] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Invitation data
  const [invitationData, setInvitationData] = useState<any>(null);

  const [parentalConsent, setParentalConsent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!invitationId) return;
      
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('status', 'pending')
        .single();
      
      if (data) {
        setInvitationData(data);
        setEmail(data.email);
      } else if (error) {
        console.error('Invitation fetch error:', error);
        setError(t('auth.invitation_invalid'));
      }
    };
    
    fetchInvitation();
  }, [invitationId]);

  const resolvedType = invitationId ? 'talent' : type;
  const isTalent = resolvedType === 'talent';
  const isCasting = resolvedType === 'casting';
  const age = birthDate ? Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10) : 20;
  const isMinor = isTalent && birthDate && age < 18;

  const canSubmit = agreed && (!isMinor || parentalConsent) && !loading;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    const signupData: any = {
      role: resolvedType,
      birth_date: isTalent ? birthDate : undefined,
      is_minor: isMinor,
      verification_status: (resolvedType === 'agency' || resolvedType === 'casting') ? 'reviewing' : 'none'
    };

    if (isCasting) {
      signupData.full_name = companyName;
      signupData.representative_name = representativeName;
      signupData.company_description = businessContent;
      signupData.contact_info = contactInfo;
    }

    if (invitationData) {
      signupData.agency_id = invitationData.agency_id;
      signupData.affiliation_status = 'affiliated';
      signupData.full_name = invitationData.name;
    }

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: signupData
      }
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      if (invitationId) {
        await supabase
          .from('invitations')
          .update({ status: 'accepted' })
          .eq('id', invitationId);
      }
      alert(t('auth.signup_success'));
      navigate('/login');
    }
  };

  const getTitle = () => {
    if (invitationId) return t('auth.invitation_title');
    if (type === 'talent') return t('auth.talent_signup');
    if (type === 'agency') return t('auth.agency_signup');
    if (type === 'casting') return t('auth.casting_signup');
    return t('auth.title_signup');
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#1a1a1a' }}>
          {getTitle()}
        </h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder={t('auth.email')} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
            required 
          />
          <input 
            type="password" 
            placeholder={t('auth.password')} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
            required 
          />

          {isTalent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#666', marginLeft: '0.25rem' }}>{t('verify.birth_date')}</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
                required={isTalent}
              />
            </div>
          )}

          {isCasting && (
            <>
              <input 
                type="text" 
                placeholder={t('auth.company_name')} 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
                required={isCasting}
              />
              <input 
                type="text" 
                placeholder={t('auth.representative_name')} 
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
                required={isCasting}
              />
              <textarea 
                placeholder={t('auth.business_content')} 
                value={businessContent}
                onChange={(e) => setBusinessContent(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a', minHeight: '80px', resize: 'vertical' }} 
                required={isCasting}
              />
              <input 
                type="text" 
                placeholder={t('auth.contact_info')} 
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', color: '#1a1a1a' }} 
                required={isCasting}
              />
            </>
          )}

          {isMinor && (
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="parental-consent" 
                  checked={parentalConsent} 
                  onChange={(e) => setParentalConsent(e.target.checked)} 
                  style={{ marginTop: '0.25rem' }}
                  required 
                />
                <label htmlFor="parental-consent" style={{ fontSize: '0.75rem', color: '#1a1a1a', fontWeight: 700, lineHeight: 1.4 }}>
                  {t('auth.minor_consent')}
                </label>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="tos-agree" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)} 
              style={{ marginTop: '0.25rem' }}
              required 
            />
            <label htmlFor="tos-agree" style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.5 }}>
              {language === 'ja' ? (
                <>
                  <Link to="/legal#tos" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.agree_tos')}</Link>
                  {t('auth.agree_and')}
                  <Link to="/legal#privacy" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.agree_privacy')}</Link>
                  {t('auth.agree_to')}
                </>
              ) : (
                <>
                  {t('auth.agree_to')}
                  <Link to="/legal#tos" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.agree_tos')}</Link>
                  {' '}{t('auth.agree_and')}{' '}
                  <Link to="/legal#privacy" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.agree_privacy')}</Link>
                  .
                </>
              )}
            </label>
          </div>

          <button 
            className="btn btn-primary" 
            type="submit" 
            style={{ width: '100%', marginTop: '0.5rem', opacity: canSubmit ? 1 : 0.6 }}
            disabled={!canSubmit}
          >
            {loading ? t('auth.sending') : t('auth.signup_btn')}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.login_link')}</Link>
        </div>
      </div>
    </div>
  );
};
