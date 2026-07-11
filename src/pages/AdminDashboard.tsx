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
  const [castingCompanies, setCastingCompanies] = useState<Profile[]>([]);
  const [pending, setPending] = useState<Profile[]>([]);
  const [skillPending, setSkillPending] = useState<Profile[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [banned, setBanned] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agencies' | 'casting' | 'pending' | 'skills' | 'reports' | 'banned'>('pending');

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all agencies for general management
    const { data: agencyData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agency')
      .eq('is_banned', false)
      .order('id', { ascending: false });

    // Fetch all casting companies
    const { data: castingData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'casting')
      .eq('is_banned', false)
      .order('id', { ascending: false });

    // Fetch all profiles pending review
    const { data: pendingData } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'reviewing')
      .order('id', { ascending: false });

    // Fetch profiles pending skill review
    const { data: skillPendingData } = await supabase
      .from('profiles')
      .select('*')
      .eq('skill_review_status', 'reviewing')
      .order('id', { ascending: false });

    // Fetch reports with profile info
    const { data: reportData } = await supabase
      .from('reports')
      .select('*, reporter:reporter_id(full_name, name), target:target_id(full_name, name, role)')
      .order('created_at', { ascending: false });

    // Fetch banned users
    const { data: bannedData } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_banned', true)
      .order('id', { ascending: false });

    if (agencyData) setAgencies(agencyData as Profile[]);
    if (castingData) setCastingCompanies(castingData as Profile[]);
    if (pendingData) setPending(pendingData as Profile[]);
    if (skillPendingData) setSkillPending(skillPendingData as Profile[]);
    if (reportData) setReports(reportData);
    if (bannedData) setBanned(bannedData as Profile[]);
    
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
      
      alert(t('admin.seed_success_msg'));
      fetchData();
    } catch (err) {
      console.error('Seed error:', err);
      alert(t('admin.seed_error_msg'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'verified' | 'none' | 'rejected', _list: 'agencies' | 'casting' | 'pending') => {
    const { error } = await supabase
      .from('profiles')
      .update({ verification_status: status })
      .eq('id', id);

    if (error) {
      alert(t('admin.update_fail'));
    } else {
      fetchData();
      alert(status === 'verified' ? t('admin.update_success') : t('admin.revoke_success'));
    }
  };

  const handleUpdateSkillStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ skill_review_status: status })
      .eq('id', id);

    if (error) {
      alert(t('admin.update_fail'));
    } else {
      fetchData();
      alert(status === 'approved' ? t('admin.update_success') : t('admin.revoke_success'));
    }
  };

  const handleBanUser = async (id: string, isBanned: boolean) => {
    if (!window.confirm(isBanned ? 'このユーザーを停止（BAN）しますか？' : 'アカウント停止を解除しますか？')) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: isBanned })
      .eq('id', id);

    if (error) {
      alert('操作に失敗しました');
    } else {
      fetchData();
      alert(isBanned ? 'ユーザーを停止しました' : '停止を解除しました');
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', reportId);

    if (error) {
      alert('操作に失敗しました');
    } else {
      fetchData();
      alert('通報を処理しました');
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
            <Database size={20} /> {t('admin.seed_data')}
          </button>
          <button onClick={fetchData} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
          {t('admin.tab_pending')} ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            padding: '1rem 2rem',
            background: 'none',
            border: 'none',
            color: activeTab === 'skills' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'skills' ? '2px solid var(--accent)' : 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          スキル確認 ({skillPending.length})
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
          {t('admin.tab_agencies')} ({agencies.length})
        </button>
        <button 
          onClick={() => setActiveTab('casting')}
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'casting' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'casting' ? '2px solid var(--accent)' : 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {t('admin.tab_casting')} ({castingCompanies.length})
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'reports' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'reports' ? '2px solid var(--accent)' : 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          通報 ({reports.filter(r => r.status === 'pending').length})
        </button>
        <button 
          onClick={() => setActiveTab('banned')}
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'banned' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'banned' ? '2px solid var(--accent)' : 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          停止済み ({banned.length})
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {activeTab === 'pending' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>{t('admin.th_id')}</th>
                <th style={thStyle}>{t('admin.th_type')}</th>
                <th style={thStyle}>{t('admin.th_detail')}</th>
                <th style={thStyle}>{t('admin.th_actions_row')}</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_pending')}</td></tr>
              ) : (
                pending.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{item.full_name || item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ textTransform: 'capitalize', fontWeight: 600, color: item.role === 'casting' ? 'var(--accent)' : 'inherit' }}>{item.role}</div>
                      <div style={{ fontSize: '0.875rem' }}>{(item as any).representative_name || (item.age ? item.age + t('mypage.age') : '')}</div>
                    </td>
                    <td style={tdStyle}>
                      {item.role === 'casting' ? (
                        <div style={{ fontSize: '0.8rem', maxWidth: '300px' }}>
                          <div style={{ fontWeight: 600 }}>{t('admin.biz_content')}:</div>
                          <div style={{ marginBottom: '0.25rem' }}>{item.company_description}</div>
                          <div style={{ fontWeight: 600 }}>{t('admin.contact')}:</div>
                          <div>{item.contact_info}</div>
                        </div>
                      ) : (
                        <>
                          <a 
                            href={(item as any).verification_doc_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: 'var(--accent)', textDecoration: 'underline', display: 'block', marginBottom: '0.25rem' }}
                          >
                            {t('admin.view_doc')}
                          </a>
                          {(item as any).parental_consent_name && (
                            <div style={{ fontSize: '0.75rem', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                              <div>{t('admin.parent')}: {(item as any).parental_consent_name}</div>
                              <div>{t('admin.contact')}: {(item as any).parental_consent_contact}</div>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'verified', 'pending')} 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          <Check size={14} /> {t('admin.approve_btn')}
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'rejected', 'pending')} 
                          className="btn" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        >
                          <X size={14} /> {t('admin.reject_btn')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'skills' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>{t('admin.th_id')}</th>
                <th style={thStyle}>プロフィール</th>
                <th style={thStyle}>{t('admin.th_actions_row')}</th>
              </tr>
            </thead>
            <tbody>
              {skillPending.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_pending')}</td></tr>
              ) : (
                skillPending.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{item.full_name || item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '0.8rem' }}>
                        <div>{t('detail.skills')}: {item.skills || '-'}</div>
                        <div>{t('mypage.genres')}: {item.genres?.join(', ') || '-'}</div>
                        <div>{t('detail.videos')}: {item.videos?.length || 0} / {t('detail.photos')}: {item.photos?.length || 0}</div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleUpdateSkillStatus(item.id, 'approved')}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          <Check size={14} /> {t('admin.approve_btn')}
                        </button>
                        <button
                          onClick={() => handleUpdateSkillStatus(item.id, 'rejected')}
                          className="btn"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        >
                          <X size={14} /> {t('admin.reject_btn')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'reports' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>通報者</th>
                <th style={thStyle}>対象ユーザー</th>
                <th style={thStyle}>理由 / 内容</th>
                <th style={thStyle}>操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>通報はありません</td></tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id} style={{ borderBottom: '1px solid var(--border)', opacity: report.status !== 'pending' ? 0.6 : 1 }}>
                    <td style={tdStyle}>
                      <div>{report.reporter?.full_name || report.reporter?.name || '削除済みユーザー'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{report.reporter_id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{report.target?.full_name || report.target?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{report.target?.role}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700, color: 'var(--error)' }}>{report.reason}</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{report.description}</p>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(report.created_at).toLocaleString()}</div>
                    </td>
                    <td style={tdStyle}>
                      {report.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleBanUser(report.target_id, true)} 
                            className="btn" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white' }}
                          >
                            BAN
                          </button>
                          <button 
                            onClick={() => handleResolveReport(report.id, 'resolved')} 
                            className="btn btn-outline" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                          >
                            解決済みにする
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{report.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'banned' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>ユーザー名</th>
                <th style={thStyle}>ID / 役割</th>
                <th style={thStyle}>操作</th>
              </tr>
            </thead>
            <tbody>
              {banned.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>停止中のユーザーはいません</td></tr>
              ) : (
                banned.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{user.full_name || user.name}</div>
                    </td>
                    <td style={tdStyle}>
                      <div>{user.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{user.role}</div>
                    </td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => handleBanUser(user.id, false)} 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: 'var(--success)', borderColor: 'var(--success)' }}
                      >
                        解除する
                      </button>
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
                <th style={thStyle}>{t('admin.th_location')} / ID</th>
                <th style={thStyle}>{t('admin.th_status')}</th>
                <th style={thStyle}>{t('admin.th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'agencies' ? agencies : castingCompanies).length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_data')}</td></tr>
              ) : (
                (activeTab === 'agencies' ? agencies : castingCompanies).map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={item.avatar_url || 'https://via.placeholder.com/40'} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.full_name || item.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.role === 'casting' ? (item as any).representative_name : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div>{item.location || t('mypage.not_set')}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.id}</div>
                    </td>
                    <td style={tdStyle}>
                      {item.verification_status === 'verified' ? (
                        <span style={badgeStyle('#10b981')}><ShieldCheck size={12} /> {t('offer.status_approved')}</span>
                      ) : (
                        <span style={badgeStyle('var(--text-muted)')}><ShieldAlert size={12} /> {t('admin.status_unverified')}</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {item.verification_status !== 'verified' ? (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'verified', activeTab)} 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                          >
                            <Check size={14} /> {t('admin.approve')}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'none', activeTab)} 
                            className="btn" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                          >
                            <X size={14} /> {t('admin.unverify')}
                          </button>
                        )}
                        <button 
                          onClick={() => window.open(`/detail/${item.role}/${item.id}`, '_blank')}
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
