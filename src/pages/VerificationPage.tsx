import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  ShieldCheck, FileText, Upload, CheckCircle2, 
  ChevronRight, AlertCircle, Building2, User, CreditCard
} from 'lucide-react';

const VerificationPage: React.FC = () => {
  const { role, currentUser, loading } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>読み込み中...</div>;
  if (!role) {
    navigate('/login');
    return null;
  }

  const isTalent = role === 'talent';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
          <CheckCircle2 size={48} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>申請を完了しました</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          ただいま運営事務局にて内容を確認しております。<br />
          通常1〜3営業日以内に審査結果を通知いたします。
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/mypage')} style={{ width: '100%' }}>
          マイページへ戻る
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> 戻る
        </button>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          {isTalent ? '本人確認の申請' : '事務所認証の申請'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {isTalent 
            ? '信頼性向上のため、公的証明書による本人確認を行っています。'
            : 'なりすまし防止と信頼性向上のため、公式認証を行っています。'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: '4px', backgroundColor: step >= i ? 'var(--accent)' : 'var(--border)', borderRadius: '2px' }} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div style={stepContainerStyle}>
            <h2 style={stepTitleStyle}>
              {isTalent ? <User size={20} /> : <Building2 size={20} />} 
              ステップ 1: {isTalent ? '基本情報の確認' : '法人情報の確認'}
            </h2>
            {isTalent ? (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>氏名（本名）</label>
                  <input type="text" placeholder="山田 太郎" defaultValue={currentUser?.full_name} style={inputStyle} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>生年月日</label>
                  <input type="date" style={inputStyle} required />
                </div>
              </>
            ) : (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>法人番号（13桁）</label>
                  <input type="text" placeholder="1234567890123" style={inputStyle} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>公式サイトURL</label>
                  <input type="url" placeholder="https://example.com" style={inputStyle} required />
                </div>
              </>
            )}
            <button type="button" className="btn btn-primary" onClick={() => setStep(2)} style={{ width: '100%', marginTop: '1rem' }}>
              次へ進む
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={stepContainerStyle}>
            <h2 style={stepTitleStyle}><FileText size={20} /> ステップ 2: 書類のアップロード</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {isTalent 
                ? '運転免許証、マイナンバーカード、またはパスポートの写真をアップロードしてください。'
                : '履歴事項全部証明書（発行から3ヶ月以内）の写真をアップロードしてください。'}
            </p>
            <div style={uploadBoxStyle}>
              <Upload size={32} />
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>ファイルを選択またはドラッグ＆ドロップ</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG (最大10MB)</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>戻る</button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 2 }}>次へ進む</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={stepContainerStyle}>
            <h2 style={stepTitleStyle}><CreditCard size={20} /> ステップ 3: 最終確認</h2>
            <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={reviewItemStyle}>
                <span>{isTalent ? '氏名' : '法人名'}</span>
                <strong>{isTalent ? (currentUser?.full_name || '未設定') : '株式会社サンプル'}</strong>
              </div>
              <div style={reviewItemStyle}>
                <span>提出書類</span>
                <strong>{isTalent ? '本人確認書類.jpg' : '履歴事項全部証明書.pdf'}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <AlertCircle size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                記載内容に虚偽がある場合、アカウント停止の対象となります。提出いただいた書類は認証審査以外の目的には使用しません。
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)} style={{ flex: 1 }}>戻る</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>この内容で申請する</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const stepContainerStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  padding: '2rem',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border)'
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '1.5rem'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  marginBottom: '0.5rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--background)',
  color: 'var(--text-main)'
};

const uploadBoxStyle: React.CSSProperties = {
  border: '2px dashed var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '3rem 2rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease'
};

const reviewItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 0',
  borderBottom: '1px solid var(--border)',
  fontSize: '0.875rem'
};

export default VerificationPage;
