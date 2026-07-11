import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { 
  UserPlus, Check, X, 
  ToggleLeft, ToggleRight, 
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile, Invitation, Offer } from '../types';

const AgencyTalentManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [talents, setTalents] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [pendingOffers, setPendingOffers] = useState<(Offer & { sender: Profile, receiver: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'talents' | 'invitations' | 'offers'>('talents');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch affiliated talents
    const { data: talentData } = await supabase
      .from('profiles')
      .select('*')
      .eq('agency_id', user.id);
    
    if (talentData) setTalents(talentData as Profile[]);

    // Fetch pending invitations
    const { data: inviteData } = await supabase
      .from('invitations')
      .select('*')
      .eq('agency_id', user.id)
      .eq('status', 'pending');
    
    if (inviteData) {
      setInvitations(inviteData.map((i: any) => ({
        id: i.id,
        agencyId: i.agency_id,
        email: i.email,
        name: i.name,
        status: i.status,
        preFilledData: i.pre_filled_data,
        createdAt: i.created_at
      })));
    }

    // Fetch mediated offers (pending)
    const { data: offerData } = await supabase
      .from('offers')
      .select(`
        *,
        sender:profiles!offers_sender_id_fkey(*),
        receiver:profiles!offers_receiver_id_fkey(*),
        job:jobs(title)
      `)
      .eq('mediator_id', user.id)
      .eq('status', 'pending');
    
    if (offerData) setPendingOffers(offerData as any);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggleOffers = async (talentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ accept_external_offers: !currentStatus })
      .eq('id', talentId);
    
    if (!error) {
      setTalents(prev => prev.map(t => t.id === talentId ? { ...t, accept_external_offers: !currentStatus } : t));
    }
  };

  const handleApproveOffer = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'approved' })
      .eq('id', offerId);
    
    if (!error) {
      alert(t('agency.offer_approved_msg'));
      fetchData();
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'declined' })
      .eq('id', offerId);
    
    if (!error) {
      alert(t('agency.offer_rejected_msg'));
      fetchData();
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('mypage.loading')}</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('mypage.talent_mgmt')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('mypage.talent_mgmt_desc')}</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={18} /> {t('agency.invite_new')}
        </button>
      </header>

      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem', gap: '2rem' }}>
        <button 
          onClick={() => setActiveTab('talents')}
          style={{ ...tabStyle, color: activeTab === 'talents' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === 'talents' ? '2px solid var(--accent)' : 'none' }}
        >
          {t('agency.tab_talents')} ({talents.length})
        </button>
        <button 
          onClick={() => setActiveTab('invitations')}
          style={{ ...tabStyle, color: activeTab === 'invitations' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === 'invitations' ? '2px solid var(--accent)' : 'none' }}
        >
          {t('agency.tab_invitations')} ({invitations.length})
        </button>
        <button 
          onClick={() => setActiveTab('offers')}
          style={{ ...tabStyle, color: activeTab === 'offers' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === 'offers' ? '2px solid var(--accent)' : 'none' }}
        >
          {t('agency.tab_offers')} ({pendingOffers.length})
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {activeTab === 'talents' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>{t('agency.th_talent_name')}</th>
                <th style={thStyle}>{t('agency.th_genre')}</th>
                <th style={thStyle}>{t('agency.th_accept_job')}</th>
                <th style={thStyle}>{t('agency.th_ops')}</th>
              </tr>
            </thead>
            <tbody>
              {talents.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('agency.no_talents')}</td></tr>
              ) : (
                talents.map(talent => (
                  <tr key={talent.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={talent.avatar_url || 'https://via.placeholder.com/40'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600 }}>{talent.full_name || talent.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>{talent.genres.join(', ') || '-'}</td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => handleToggleOffers(talent.id, !!talent.accept_external_offers)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: talent.accept_external_offers ? '#10b981' : 'var(--text-muted)' }}
                      >
                        {talent.accept_external_offers ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        <span style={{ fontSize: '0.75rem' }}>{talent.accept_external_offers ? t('agency.accepting') : t('agency.stopped')}</span>
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => navigate(`/detail/talent/${talent.id}`)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>{t('agency.detail')}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'invitations' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>{t('agency.th_name')}</th>
                <th style={thStyle}>{t('agency.th_email')}</th>
                <th style={thStyle}>{t('agency.th_invite_date')}</th>
                <th style={thStyle}>{t('agency.th_invite_link')}</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('agency.no_invitations')}</td></tr>
              ) : (
                invitations.map(invite => (
                  <tr key={invite.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>{invite.name}</td>
                    <td style={tdStyle}>{invite.email}</td>
                    <td style={tdStyle}>{new Date(invite.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}/signup/talent?invitation=${invite.id}`;
                          navigator.clipboard.writeText(link);
                          alert(t('agency.copy_success'));
                        }}
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        {t('agency.copy_link')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'offers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {pendingOffers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>{t('agency.no_pending_offers')}</div>
            ) : (
              pendingOffers.map(offer => (
                <div key={offer.id} style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '0.25rem' }}>{t('agency.offer_from_casting')}</div>
                      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{offer.sender.full_name || offer.sender.name}</h3>
                      {(offer as any).job?.title && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>{t('offer.for_job')}: {(offer as any).job.title}</div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <Clock size={14} /> {new Date(offer.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t('agency.target_talent')}</div>
                      <div style={{ fontWeight: 600 }}>{offer.receiver.full_name || offer.receiver.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                      onClick={() => handleApproveOffer(offer.id)}
                      className="btn btn-primary" 
                      style={{ flex: 1, backgroundColor: '#10b981' }}
                    >
                      <Check size={18} /> {t('agency.approve_btn')}
                    </button>
                    <button 
                      onClick={() => handleRejectOffer(offer.id)}
                      className="btn" 
                      style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                    >
                      <X size={18} /> {t('agency.reject_btn')}
                    </button>
                    <button onClick={() => navigate(`/detail/casting/${offer.senderId}`)} className="btn btn-outline" style={{ flex: 1 }}>{t('agency.company_profile')}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)} 
          onSuccess={() => {
            setShowInviteModal(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
};

const InviteModal: React.FC<{ onClose: () => void, onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', genre: 'アイドル' });

  const talentGenres = [
    { key: 'アイドル', label: t('genre.idol') },
    { key: 'モデル', label: t('genre.model') },
    { key: '俳優', label: t('genre.actor') },
    { key: '歌手', label: t('genre.singer') },
    { key: 'ダンサー', label: t('genre.dancer') },
    { key: 'インフルエンサー', label: t('genre.influencer') },
    { key: '声優', label: t('genre.voice') },
    { key: 'クリエイター', label: t('genre.creator') },
    { key: 'ライバー', label: t('genre.liver') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('invitations')
      .insert({
        agency_id: user.id,
        email: formData.email,
        name: formData.name,
        status: 'pending',
        pre_filled_data: { genres: [formData.genre] }
      });

    setLoading(false);
    if (error) {
      alert(t('agency.invite_fail') + ': ' + error.message);
    } else {
      alert(t('agency.invite_success'));
      onSuccess();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{t('agency.invite_modal_title')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>{t('agency.invite_name_label')}</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('agency.invite_email_label')}</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('agency.invite_genre_label')}</label>
            <select value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} style={inputStyle}>
              {talentGenres.map(g => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? t('agency.invite_creating') : t('agency.invite_create_btn')}</button>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>{t('mypage.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const tabStyle: React.CSSProperties = { padding: '1rem 0', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '1rem', fontSize: '0.875rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' };
const inputStyle: React.CSSProperties = { padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', backgroundColor: 'var(--background)', color: 'var(--text-main)' };

export default AgencyTalentManagementPage;
