import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { 
  ShieldCheck, ShieldAlert, Check, X, 
  ExternalLink, Building2, Search,
  Calendar, Eye, RefreshCcw, User
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [agencies, setAgencies] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgencies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agency')
      .order('updated_at', { ascending: false });

    if (!error) {
      setAgencies(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'verified' | 'none') => {
    const { error } = await supabase
      .from('profiles')
      .update({ verificationStatus: status })
      .eq('id', id);

    if (error) {
      alert('更新に失敗しました');
    } else {
      setAgencies(prev => prev.map(a => a.id === id ? { ...a, verificationStatus: status } : a));
      alert(status === 'verified' ? '事務所を認証しました' : '認証を解除しました');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={32} color="var(--accent)" /> 管理画面（ベータ）
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>事務所ユーザーの認証・安全性管理</p>
        </div>
        <button onClick={fetchAgencies} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
              <th style={thStyle}>事務所名 / ID</th>
              <th style={thStyle}>地域 / SNS</th>
              <th style={thStyle}>現在のステータス</th>
              <th style={thStyle}>アクション</th>
            </tr>
          </thead>
          <tbody>
            {agencies.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>事務所ユーザーはまだ登録されていません</td></tr>
            ) : (
              agencies.map(agency => (
                <tr key={agency.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={agency.avatar_url || 'https://via.placeholder.com/40'} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{agency.full_name || agency.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{agency.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div>{agency.location || '未設定'}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      {agency.instagram_url && <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>IG</span>}
                      {agency.x_url && <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>X</span>}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    {agency.verificationStatus === 'verified' ? (
                      <span style={badgeStyle('#10b981')}><ShieldCheck size={12} /> 認証済み</span>
                    ) : (
                      <span style={badgeStyle('var(--text-muted)')}><ShieldAlert size={12} /> 未認証</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {agency.verificationStatus !== 'verified' ? (
                        <button 
                          onClick={() => handleUpdateStatus(agency.id, 'verified')} 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          <Check size={14} /> 承認する
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(agency.id, 'none')} 
                          className="btn" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        >
                          <X size={14} /> 解除
                        </button>
                      )}
                      <button 
                        onClick={() => window.open(`/detail/agency/${agency.id}`, '_blank')}
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        プロフィール確認
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '1rem',
  fontSize: '0.875rem',
  color: 'var(--text-muted)',
  fontWeight: 600
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  fontSize: '0.875rem'
};

const badgeStyle = (color: string): React.CSSProperties => ({
  backgroundColor: color + '22',
  color: color,
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem'
});

export default AdminDashboard;
