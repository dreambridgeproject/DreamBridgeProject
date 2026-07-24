import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, XCircle, Clock, MessageCircle, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

const OffersPage: React.FC = () => {
  const { currentUser, offers, updateOfferStatus, hideChat, role } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [partnerProfiles, setPartnerProfiles] = useState<Record<string, Profile>>({});
  const [approvingOfferId, setApprovingOfferId] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);

  const confirmDeleteOffer = () => {
    if (deletingOfferId) hideChat(deletingOfferId);
    setDeletingOfferId(null);
  };

  const confirmApproval = (offerId: string) => {
    if (!scheduledDate) return;
    updateOfferStatus(offerId, 'approved', new Date(scheduledDate).toISOString());
    setApprovingOfferId(null);
    setScheduledDate('');
  };

  React.useEffect(() => {
    const fetchPartnerProfiles = async () => {
      if (!currentUser) return;
      const partnerIds = [...new Set(offers.map(o => o.senderId === currentUser.id ? o.receiverId : o.senderId))];
      if (partnerIds.length === 0) return;

      const { data } = await supabase.from('profiles').select('*').in('id', partnerIds);
      if (data) {
        const profileMap = data.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {});
        setPartnerProfiles(profileMap);
      }
    };
    fetchPartnerProfiles();
  }, [offers, currentUser?.id]);

  if (!currentUser) return null;

  // Approved offers move on to the chat list, so they're dropped here to
  // avoid showing the same offer in two places. Manually hidden (declined)
  // offers are also excluded.
  const isVisibleInHistory = (o: any) => o.status !== 'approved' && !o.hiddenBy?.includes(currentUser.id);
  const sentOffers = offers.filter(o => o.senderId === currentUser.id && isVisibleInHistory(o));
  const receivedOffers = offers.filter(o => o.receiverId === currentUser.id && isVisibleInHistory(o));

  const getPartnerInfo = (offer: any) => {
    const partnerId = offer.senderId === currentUser.id ? offer.receiverId : offer.senderId;
    const partner = partnerProfiles[partnerId] || {
      id: partnerId,
      full_name: '名前未設定のユーザー',
      name: '名前未設定のユーザー',
      avatar_url: '',
      role: offer.senderRole || 'casting'
    };
    const isPartnerTalent = partner?.role === 'talent';
    
    return { partner, isPartnerTalent };
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved':
        return <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}><CheckCircle2 size={16} /> {t('offer.status_approved')}</span>;
      case 'declined':
        return <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}><XCircle size={16} /> {t('offer.status_declined')}</span>;
      default:
        return <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}><Clock size={16} /> {t('offer.status_sent')}</span>;
    }
  };

  const renderOfferCard = (offer: any) => {
    const { partner, isPartnerTalent } = getPartnerInfo(offer);
    if (!partner) return null;

    return (
      <div key={offer.id} style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: 'var(--radius-md)', 
        padding: '1.25rem', 
        boxShadow: 'var(--shadow)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: '1px solid var(--border)'
      }}>
        <img 
          src={partner.avatar_url || 'https://via.placeholder.com/60'} 
          alt={partner.full_name || partner.name} 
          style={{ width: '60px', height: '60px', borderRadius: isPartnerTalent ? '50%' : 'var(--radius-sm)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{partner.full_name || partner.name}</h3>
          {offer.jobTitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '0.25rem' }}>{t('offer.for_job')}: {offer.jobTitle}</div>
          )}
          <StatusBadge status={offer.status} />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeTab === 'received' && offer.status === 'pending' ? (
            approvingOfferId === offer.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('offer.schedule_prompt')}</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem' }}
                  />
                  <button
                    onClick={() => confirmApproval(offer.id)}
                    disabled={!scheduledDate}
                    className="btn"
                    style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 0.75rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: scheduledDate ? 'pointer' : 'not-allowed', opacity: scheduledDate ? 1 : 0.6 }}
                  >
                    {t('offer.schedule_confirm')}
                  </button>
                  <button
                    onClick={() => { setApprovingOfferId(null); setScheduledDate(''); }}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    {t('offer.schedule_cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setApprovingOfferId(offer.id)}
                  className="btn"
                  style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                  {role === 'talent'
                    ? (offer.senderRole === 'agency' ? t('scout.approve_btn') : t('direct_offer.approve_btn'))
                    : t('agency_offer.approve_btn')
                  }
                </button>
                <button
                  onClick={() => updateOfferStatus(offer.id, 'declined')}
                  className="btn"
                  style={{ backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                  {t('offer.decline_btn')}
                </button>
              </>
            )
          ) : (
            <Link
              to={offer.status === 'approved' ? `/chat/${offer.id}` : `/detail/${isPartnerTalent ? 'talent' : 'agency'}/${partner.id}`}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {offer.status === 'approved' ? <><MessageCircle size={18} /> {t('chat.talk_tab')}</> : t('fav.view_detail')}
            </Link>
          )}
          {offer.status === 'declined' && (
            <button
              onClick={() => setDeletingOfferId(offer.id)}
              title={t('chat.delete_btn')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', flexShrink: 0 }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('received')}
          style={{ 
            flex: 1, 
            padding: '0.75rem', 
            background: 'none', 
            fontWeight: 700,
            fontSize: '0.875rem',
            color: activeTab === 'received' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'received' ? '2px solid var(--accent)' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          {t('offer.received_tab')} ({receivedOffers.length})
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          style={{ 
            flex: 1, 
            padding: '0.75rem', 
            background: 'none', 
            fontWeight: 700,
            fontSize: '0.875rem',
            color: activeTab === 'sent' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === 'sent' ? '2px solid var(--accent)' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          {t('offer.sent_tab')} ({sentOffers.length})
        </button>
      </div>

      <div>
        {activeTab === 'received' ? (
          receivedOffers.length > 0 ? receivedOffers.map(renderOfferCard) : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>{t('offer.no_offers')}</div>
        ) : (
          sentOffers.length > 0 ? sentOffers.map(renderOfferCard) : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>{t('offer.no_sent_offers')}</div>
        )}
      </div>

      {deletingOfferId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px' }}>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>{t('offer.delete_confirm')}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={confirmDeleteOffer} className="btn btn-primary" style={{ flex: 1, backgroundColor: '#ef4444' }}>
                {t('chat.delete_btn')}
              </button>
              <button onClick={() => setDeletingOfferId(null)} className="btn btn-outline" style={{ flex: 1 }}>
                {t('mypage.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
