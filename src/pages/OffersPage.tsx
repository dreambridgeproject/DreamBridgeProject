import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockTalents, mockAgencies } from '../data/mock';
import { CheckCircle2, XCircle, Clock, MessageCircle } from 'lucide-react';

const OffersPage: React.FC = () => {
  const { currentUser, offers, updateOfferStatus, role } = useUser();
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
        return <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}><CheckCircle2 size={16} /> 承認済み</span>;
      case 'declined':
        return <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}><XCircle size={16} /> 辞退済み</span>;
      default:
        return <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}><Clock size={16} /> 送信済み</span>;
    }
  };

  const renderOfferCard = (offer: any) => {
    const { partner, isPartnerTalent } = getPartnerInfo(offer);
    if (!partner) return null;

    return (
      <div key={offer.id} style={{ 
        backgroundColor: 'white', 
        borderRadius: 'var(--radius-md)', 
        padding: '1.25rem', 
        boxShadow: 'var(--shadow)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <img 
          src={isPartnerTalent ? (partner as any).icon : (partner as any).logo} 
          alt={partner.name} 
          style={{ width: '60px', height: '60px', borderRadius: isPartnerTalent ? '50%' : 'var(--radius-sm)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{partner.name}</h3>
          <StatusBadge status={offer.status} />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeTab === 'received' && offer.status === 'pending' ? (
            <>
              <button 
                onClick={() => updateOfferStatus(offer.id, 'approved')}
                className="btn" 
                style={{ backgroundColor: 'var(--success)', color: 'white', padding: '0.5rem 1rem' }}
              >
                承認
              </button>
              <button 
                onClick={() => updateOfferStatus(offer.id, 'declined')}
                className="btn" 
                style={{ backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem 1rem' }}
              >
                辞退
              </button>
            </>
          ) : (
            <Link 
              to={offer.status === 'approved' ? `/chat/${offer.id}` : `/detail/${isPartnerTalent ? 'talent' : 'agency'}/${partner.id}`} 
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem' }}
            >
              {offer.status === 'approved' ? <><MessageCircle size={18} /> チャット</> : '詳細を見る'}
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
            color: activeTab === 'received' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'received' ? '2px solid var(--primary)' : 'none',
            marginBottom: '-2px'
          }}
        >
          届いたオファー ({receivedOffers.length})
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          style={{ 
            flex: 1, 
            padding: '0.75rem', 
            background: 'none', 
            fontWeight: 700,
            fontSize: '0.875rem',
            color: activeTab === 'sent' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'sent' ? '2px solid var(--primary)' : 'none',
            marginBottom: '-2px'
          }}
        >
          送ったオファー ({sentOffers.length})
        </button>
      </div>

      <div>
        {activeTab === 'received' ? (
          receivedOffers.length > 0 ? receivedOffers.map(renderOfferCard) : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>まだオファーはありません。</div>
        ) : (
          sentOffers.length > 0 ? sentOffers.map(renderOfferCard) : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>まだオファーを送っていません。</div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
