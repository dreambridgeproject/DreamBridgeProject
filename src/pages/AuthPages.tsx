import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
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
      setError('サーバーからの応答が一定時間を超えました。Supabaseが再開中（Resuming）の可能性があります。数分待ってからページをリロードして再試行してください。');
    }, 15000);

    try {
      console.log('Attempting login for:', email);
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (loginError) {
        console.error('Login error:', loginError);
        setError(`ログイン失敗: ${loginError.message}`);
        setLoading(false);
      } else if (data.user) {
        console.log('Login successful');
        navigate('/mypage');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Unexpected login error:', err);
      setError('予期せぬエラーが発生しました。接続設定を確認してください。');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>ログイン</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="メールアドレス" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="パスワード" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%' }} 
            required 
          />
          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          アカウントをお持ちでない方は<br />
          <Link to="/" style={{ color: 'var(--accent)' }}>トップページ</Link>から登録してください
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
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
      alert('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。');
      navigate('/login');
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {type === 'talent' ? '志望者登録' : '事務所登録'}
        </h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder="メールアドレス" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="パスワード" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%' }} 
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
            <label htmlFor="tos-agree" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <Link to="/legal#tos" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>利用規約</Link>
              および
              <Link to="/legal#privacy" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>プライバシーポリシー</Link>
              に同意します。
            </label>
          </div>

          <button 
            className="btn btn-primary" 
            type="submit" 
            style={{ width: '100%', marginTop: '0.5rem', opacity: agreed && !loading ? 1 : 0.6 }}
            disabled={!agreed || loading}
          >
            {loading ? '送信中...' : '同意して登録する'}
          </button>
        </form>
      </div>
    </div>
  );
};
