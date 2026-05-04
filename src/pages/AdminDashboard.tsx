import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { mockTalents, mockAgencies } from '../data/mock';
import type { Profile } from '../types';
import { 
  ShieldCheck, ShieldAlert, Check, X, 
  RefreshCcw, Database
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [agencies, setAgencies] = useState<Profile[]>([]);
  const [pending, setPending] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agencies' | 'pending'>('pending');

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all agencies for general management
    const { data: agencyData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agency')
      .order('id', { ascending: false });

    // Fetch all profiles pending review
    const { data: pendingData } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'reviewing')
      .order('id', { ascending: false });

    if (agencyData) setAgencies(agencyData as Profile[]);
    if (pendingData) setPending(pendingData as Profile[]);
    
    setLoading(false);
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      // Create seed profiles
      const seedProfiles = [
        ...mockTalents.map(t => ({ ...t, verification_status: 'verified' })),
        ...mockAgencies.map(a => ({ ...a, verification_status: 'verified' }))
      ];

      for (const profile of seedProfiles) {
        const { error } = await supabase
          .from('profiles')
          .upsert(profile);
        if (error) console.error('Error seeding profile:', error);
      }
      
      alert('サンプルデータを投入しました');
      fetchData();
    } catch (err) {
      console.error('Seed error:', err);
      alert('データ投入中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'verified' | 'none', list: 'agencies' | 'pending') => {
    const { error } = await supabase
      .from('profiles')
      .update({ verification_status: status })
      .eq('id', id);

    if (error) {
      alert(t('admin.update_fail'));
    } else {
      if (list === 'agencies') {
        setAgencies(prev => prev.map(a => a.id === id ? { ...a, verification_status: status } : a));
      } else {
        setPending(prev => prev.filter(p => p.id !== id));
        fetchData(); // Refresh both lists
      }
      alert(status === 'verified' ? t('admin.update_success') : t('admin.revoke_success'));
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', color: 'var(--text-main)' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={32} color="var(--accent)" /> {t('admin.title')}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('admin.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSeedData} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
            <Database size={20} /> サンプルデータ投入
          </button>
          <button onClick={fetchData} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('pending')}
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'pending' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'pending' ? '2px solid var(--accent)' : 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          承認待ち ({pending.length})
        </button>
        <button 
          onClick={() => setActiveTab('agencies')}
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'agencies' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'agencies' ? '2px solid var(--accent)' : 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          登録済み事務所 ({agencies.length})
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {activeTab === 'pending' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>申請者 / ID</th>
                <th style={thStyle}>種類 / 年齢</th>
                <th style={thStyle}>提出書類 / 保護者情報</th>
                <th style={thStyle}>操作</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_pending')}</td></tr>
              ) : (
                pending.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{item.full_name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ textTransform: 'capitalize' }}>{item.role}</div>
                      <div style={{ fontSize: '0.875rem' }}>{item.age || '不明'}歳</div>
                    </td>
                    <td style={tdStyle}>
                      <a 
                        href={(item as any).verification_doc_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: 'var(--accent)', textDecoration: 'underline', display: 'block', marginBottom: '0.25rem' }}
                      >
                        書類を確認する
                      </a>
                      {(item as any).parental_consent_name && (
                        <div style={{ fontSize: '0.75rem', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                          <div>保護者: {(item as any).parental_consent_name}</div>
                          <div>連絡先: {(item as any).parental_consent_contact}</div>
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'verified', 'pending')} 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          <Check size={14} /> 承認
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'none', 'pending')} 
                          className="btn" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        >
                          <X size={14} /> 却下
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>{t('admin.th_name')}</th>
                <th style={thStyle}>{t('admin.th_location')}</th>
                <th style={thStyle}>{t('admin.th_status')}</th>
                <th style={thStyle}>{t('admin.th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {agencies.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_agencies')}</td></tr>
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
                      <div>{agency.location || t('mypage.not_set')}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {agency.instagram_url && <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>IG</span>}
                        {agency.x_url && <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>X</span>}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {agency.verification_status === 'verified' ? (
                        <span style={badgeStyle('#10b981')}><ShieldCheck size={12} /> {t('offer.status_approved')}</span>
                      ) : (
                        <span style={badgeStyle('var(--text-muted)')}><ShieldAlert size={12} /> {t('admin.status_unverified')}</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {agency.verification_status !== 'verified' ? (
                          <button 
                            onClick={() => handleUpdateStatus(agency.id, 'verified', 'agencies')} 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                          >
                            <Check size={14} /> {t('admin.approve')}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateStatus(agency.id, 'none', 'agencies')} 
                            className="btn" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                          >
                            <X size={14} /> {t('admin.unverify')}
                          </button>
                        )}
                        <button 
                          onClick={() => window.open(`/detail/agency/${agency.id}`, '_blank')}
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          {t('fav.view_detail')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '1rem', fontSize: '0.875rem' };
const badgeStyle = (color: string): React.CSSProperties => ({ backgroundColor: color + '22', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' });

export default AdminDashboard;
