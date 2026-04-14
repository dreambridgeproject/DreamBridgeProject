import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { mockTalents, mockAgencies } from '../data/mock';
import { CheckCircle2, XCircle, Clock, MessageCircle } from 'lucide-react';

const OffersPage: React.FC = () => {
  const { currentUser, offers, updateOfferStatus, role } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  if (!currentUser) return null;

  const sentOffers = offers.filter(o => o.senderId === currentUser.id);
  const receivedOffers = offers.filter(o => o.receiverId === currentUser.id);

  const getPartnerInfo = (offer: any) => {
    const partnerId = offer.senderId === currentUser.id ? offer.receiverId : offer.senderId;
    const isPartnerTalent = offer.senderId === currentUser.id ? (role === 'agency') : (offer.senderRole === 'talent');
    
    const partner = isPartnerTalent 
      ? mockTalents.find(t => t.id === partnerId) 
      : mockAgencies.find(a => a.id === partnerId);
    
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
          src={isPartnerTalent ? (partner as any).icon : (partner as any).logo} 
          alt={partner.name} 
          style={{ width: '60px', height: '60px', borderRadius: isPartnerTalent ? '50%' : 'var(--radius-sm)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{partner.name}</h3>
          <StatusBadge status={offer.status} />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeTab === 'received' && offer.status === 'pending' ? (
            <>
              <button 
                onClick={() => updateOfferStatus(offer.id, 'approved')}
                className="btn" 
                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                {t('offer.approve_btn')}
              </button>
              <button 
                onClick={() => updateOfferStatus(offer.id, 'declined')}
                className="btn" 
                style={{ backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                {t('offer.decline_btn')}
              </button>
            </>
          ) : (
            <Link 
              to={offer.status === 'approved' ? `/chat/${offer.id}` : `/detail/${isPartnerTalent ? 'talent' : 'agency'}/${partner.id}`} 
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {offer.status === 'approved' ? <><MessageCircle size={18} /> {t('chat.talk_tab')}</> : t('fav.view_detail')}
            </Link>
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
    </div>
  );
};

export default OffersPage;
