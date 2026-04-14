import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  PlusCircle, CreditCard, ShieldCheck, FileText, 
  X, ChevronUp, Bell, ShieldAlert
} from 'lucide-react';

const QuickAccessPopup: React.FC = () => {
  const { currentUser, role } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const isTalent = role === 'talent';
  const planName = currentUser.plan === 'free' ? '無料' : 
                   currentUser.plan === 'premium' ? 'プレミアム' :
                   currentUser.plan === 'standard' ? 'スタンダード' : 
                   currentUser.plan === 'pro' ? 'PRO' : 'エンタープライズ';

  const verificationStatus = currentUser.verificationStatus || 'none';

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px', // BottomNav (70px + margin)
      right: '20px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '1rem'
    }}>
      {/* Expanded Menu */}
      {isOpen && (
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid var(--border)',
          width: '260px',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>クイックメニュー</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Plan Info */}
            <Link to="/subscription" onClick={() => setIsOpen(false)} style={menuItemStyle}>
              <div style={iconBoxStyle}><CreditCard size={18} color="var(--accent)" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>プランをアップグレード</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>現在のプラン: {planName}</p>
              </div>
            </Link>

            {/* Payment Settings */}
            <Link to="/payment-settings" onClick={() => setIsOpen(false)} style={menuItemStyle}>
              <div style={iconBoxStyle}><CreditCard size={18} color="var(--accent)" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>支払い方法の確認・変更</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>カード / Apple Payなど</p>
              </div>
            </Link>

            {/* Verification Info */}
            <Link to={verificationStatus === 'none' ? "/verification" : "/mypage"} onClick={() => setIsOpen(false)} style={menuItemStyle}>
              <div style={iconBoxStyle}>
                {verificationStatus === 'verified' ? <ShieldCheck size={18} color="#10b981" /> : <ShieldAlert size={18} color="#f59e0b" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>本人確認・認証状況</p>
                <p style={{ fontSize: '0.7rem', color: verificationStatus === 'verified' ? '#10b981' : '#f59e0b' }}>
                  {verificationStatus === 'verified' ? '認証済み' : verificationStatus === 'reviewing' ? '審査中' : '未完了・要申請'}
                </p>
              </div>
            </Link>

            {/* Admin Dashboard (Temporary) */}
            <Link to="/admin" onClick={() => setIsOpen(false)} style={{ ...menuItemStyle, border: '1px dashed var(--accent)' }}>
              <div style={iconBoxStyle}><ShieldCheck size={18} color="var(--accent)" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>[運営] 申請を管理する</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>事務所の認証審査</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          color: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = isOpen ? 'rotate(45deg) scale(1.1)' : 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(1deg)'}
      >
        {isOpen ? <X size={28} /> : <PlusCircle size={28} />}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  color: 'var(--text-main)',
  backgroundColor: 'rgba(255,255,255,0.03)',
  transition: 'background-color 0.2s ease',
  border: '1px solid transparent'
};

const iconBoxStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  backgroundColor: 'var(--background)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border)'
};

export default QuickAccessPopup;
