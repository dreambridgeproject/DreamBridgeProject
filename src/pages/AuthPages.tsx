import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const LoginPage: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (role: 'talent' | 'agency') => {
    login(role);
    navigate('/mypage');
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>ログイン</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => handleLogin('talent')}>志望者としてログイン (Demo)</button>
          <button className="btn btn-outline" onClick={() => handleLogin('agency')}>事務所としてログイン (Demo)</button>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSignup = () => {
    login(type as 'talent' | 'agency');
    navigate('/mypage');
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '400px' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {type === 'talent' ? '志望者登録' : '事務所登録'}
        </h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <input type="email" placeholder="メールアドレス" style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} required />
          <input type="password" placeholder="パスワード" style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} required />
          <button className="btn btn-primary" type="submit">登録する</button>
        </form>
      </div>
    </div>
  );
};
