import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Layout, Search, MessageSquare, Bell, User, Star } from 'lucide-react';

const HistoryPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup with a slight delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const features = [
    { icon: <Layout size={16} />, text: '洗練されたランディングページ' },
    { icon: <User size={16} />, text: '志望者・事務所別の会員登録' },
    { icon: <Search size={16} />, text: 'タレント・事務所の検索機能' },
    { icon: <Star size={16} />, text: 'お気に入り・詳細プロフィール' },
    { icon: <MessageSquare size={16} />, text: 'リアルタイムに近いチャット' },
    { icon: <Bell size={16} />, text: '通知・オファー管理システム' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px', // Above the bottom nav
      right: '20px',
      width: '320px',
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1000,
      padding: '1.5rem',
      animation: 'slideIn 0.5s ease-out'
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--accent)', fontSize: '1.125rem', fontWeight: 700 }}>
          前回までの進捗
        </h3>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex' }}
        >
          <X size={20} />
        </button>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.5 }}>
        DreamBridgeのプロトタイプとして、以下の主要機能を実装しました：
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {features.map((f, i) => (
          <li key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            fontSize: '0.875rem', 
            color: 'var(--text-muted)',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: 'var(--accent)', display: 'flex' }}>{f.icon}</span>
            {f.text}
            <CheckCircle size={14} style={{ marginLeft: 'auto', color: 'var(--success)' }} />
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          ※ UI/UXは「高級感」と「信頼性」をテーマに設計されています。
        </p>
      </div>
    </div>
  );
};

export default HistoryPopup;
