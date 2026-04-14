import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
    }, 15000);

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
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError(t('auth.login_error'));
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#1a1a1a' }}>{t('auth.login')}</h2>
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
            {loading ? t('auth.logging_in') : t('auth.login')}
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
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: type, // 'talent' or 'agency'
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert(t('auth.signup_success'));
      navigate('/login');
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#1a1a1a' }}>
          {type === 'talent' ? t('auth.talent_signup') : t('auth.agency_signup')}
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
            style={{ width: '100%', marginTop: '0.5rem', opacity: agreed && !loading ? 1 : 0.6 }}
            disabled={!agreed || loading}
          >
            {loading ? t('auth.sending') : t('auth.signup_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};
