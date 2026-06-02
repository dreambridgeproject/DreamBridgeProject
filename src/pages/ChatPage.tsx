import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { mockTalents, mockAgencies } from '../data/mock';
import { Send, ChevronLeft, MoreVertical, ClipboardList, MessageSquare } from 'lucide-react';
import OffersPage from './OffersPage';

const ChatPage: React.FC = () => {
  const { offerId } = useParams<{ offerId?: string }>();
  const { currentUser, offers, messages, sendMessage, role, markMessagesAsRead } = useUser();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'offers'>('chats');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom and Mark as Read
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (offerId) {
      markMessagesAsRead(offerId);
    }
  }, [messages, offerId, markMessagesAsRead]);

  if (!currentUser) return null;

  // Find the current chat (offer)
  const currentOffer = offers.find(o => o.id === offerId && o.status === 'approved');
  const chatMessages = messages.filter(m => m.offerId === offerId);

  // Helper to get partner info
  const getPartnerInfo = (offer: any) => {
    // In a 3-party mediated chat:
    // senderId = Casting
    // receiverId = Talent
    // mediatorId = Agency
    
    const partnerId = offer.senderId === currentUser.id ? offer.receiverId : offer.senderId;
    const isPartnerTalent = offer.senderId === currentUser.id ? (role === 'agency' || role === 'casting') : (offer.senderRole === 'talent');
    
    // Simple 2-party fallback
    const partner = isPartnerTalent 
      ? mockTalents.find(t => t.id === partnerId) 
      : mockAgencies.find(a => a.id === partnerId);
    
    // Handle mediated offer (3-party)
    if (offer.mediator_id) {
      const casting = mockAgencies.find(a => a.id === offer.senderId) || mockTalents.find(t => t.id === offer.senderId);
      const talent = mockTalents.find(t => t.id === offer.receiverId);
      const agency = mockAgencies.find(a => a.id === offer.mediator_id);
      
      return { 
        isMediated: true,
        casting,
        talent,
        agency,
        partner: currentUser.id === offer.senderId ? talent : (currentUser.id === offer.receiverId ? casting : { name: `${casting?.name} & ${talent?.name}` })
      };
    }
    
    return { partner, isPartnerTalent, isMediated: false };
  };

  const handleSend = () => {
    if (!inputText.trim() || !offerId) return;
    sendMessage(offerId, inputText);
    setInputText('');
  };

  // If no offerId, show chat list (LINE-like) with tabs
  if (!offerId) {
    const approvedOffers = offers.filter(o => o.status === 'approved');

    return (
      <div className="container" style={{ padding: '1rem 0' }}>
        <div style={{ padding: '0 1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{activeTab === 'chats' ? t('chat.title') : t('nav.offers')}</h1>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1rem', padding: '0 1rem' }}>
          <button 
            onClick={() => setActiveTab('chats')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              background: 'none', 
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'chats' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'chats' ? '2px solid var(--accent)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} /> {t('chat.talk_tab')}
          </button>
          <button 
            onClick={() => setActiveTab('offers')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              background: 'none', 
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'offers' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'offers' ? '2px solid var(--accent)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <ClipboardList size={18} /> {t('chat.history_tab')}
          </button>
        </div>

        <div style={{ padding: '0 1rem' }}>
          {activeTab === 'offers' ? (
            <OffersPage />
          ) : (
            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              {approvedOffers.length > 0 ? approvedOffers.map(offer => {
                const { partner, isPartnerTalent, isMediated }: any = getPartnerInfo(offer);
                if (!partner) return null;
                const lastMsg = messages.filter(m => m.offerId === offer.id).slice(-1)[0];
                const unreadCount = messages.filter(m => m.offerId === offer.id && m.unread && m.senderId !== currentUser.id).length;

                return (
                  <Link key={offer.id} to={`/chat/${offer.id}`} style={{ 
                    display: 'flex', 
                    padding: '1rem', 
                    gap: '1rem', 
                    alignItems: 'center', 
                    borderBottom: '1px solid var(--background)',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
                  >
                    <img 
                      src={isPartnerTalent ? (partner as any).avatar_url : (partner as any).avatar_url} 
                      alt={partner.name} 
                      style={{ width: '56px', height: '56px', borderRadius: (isPartnerTalent || isMediated) ? '50%' : 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{partner.name}</h3>
                          {isMediated && <span style={{ fontSize: '0.6rem', backgroundColor: 'var(--accent)', color: 'var(--secondary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t('chat.mediated_badge')}</span>}
                        </div>
                        {lastMsg && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lastMsg ? lastMsg.text : t('chat.start_chat')}
                        </p>
                        {unreadCount > 0 && (
                          <span style={{ 
                            backgroundColor: 'var(--error)', 
                            color: 'white', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold', 
                            padding: '0.125rem 0.5rem', 
                            borderRadius: '1rem',
                            minWidth: '1.5rem',
                            textAlign: 'center'
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                  {t('chat.no_approved_offers')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Talk screen
  const { partner, isPartnerTalent, isMediated, casting, talent, agency }: any = getPartnerInfo(currentOffer);
  if (!partner) return <div className="container" style={{ color: 'var(--text-main)' }}>{t('chat.not_found')}</div>;

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <header style={{ 
        backgroundColor: 'var(--surface)', 
        padding: '0.75rem 1rem', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/chat" style={{ color: 'var(--text-muted)' }}><ChevronLeft size={24} /></Link>
          <img 
            src={partner.avatar_url || 'https://via.placeholder.com/40'} 
            alt={partner.name} 
            style={{ width: '40px', height: '40px', borderRadius: (isPartnerTalent || isMediated) ? '50%' : 'var(--radius-sm)', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--text-main)', margin: 0 }}>{partner.name}</h2>
            {isMediated && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('chat.mediated_info').replace('{agency}', agency?.name || '').replace('{casting}', casting?.name || '').replace('{talent}', talent?.name || '')}</div>}
          </div>
        </div>
        <button style={{ background: 'none', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}><MoreVertical size={20} /></button>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem 1rem', 
          backgroundColor: 'var(--background)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {chatMessages.map(msg => {
          const isMine = msg.senderId === currentUser.id;
          const isSystem = msg.senderId === 'system';

          // For 3-party, we need to know who sent it
          const sender = isMediated 
            ? (msg.senderId === casting?.id ? casting : (msg.senderId === talent?.id ? talent : agency))
            : partner;

          if (isSystem) {
            return (
              <div key={msg.id} style={{ textAlign: 'center' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.25rem 1rem', borderRadius: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} style={{ 
              display: 'flex', 
              justifyContent: isMine ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '0.5rem'
            }}>
              {!isMine && (
                <img 
                  src={sender?.avatar_url || 'https://via.placeholder.com/32'} 
                  alt="" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginBottom: '4px' }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                {!isMine && isMediated && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: '0.25rem', marginBottom: '0.1rem' }}>{sender?.name}</span>}
                <div style={{ 
                  maxWidth: '70vw',
                  padding: '0.75rem 1rem', 
                  borderRadius: '1.25rem', 
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  backgroundColor: isMine ? 'var(--accent)' : 'var(--surface)',
                  color: isMine ? 'var(--secondary)' : 'var(--text-main)',
                  position: 'relative',
                  borderTopRightRadius: isMine ? '0.25rem' : '1.25rem',
                  borderTopLeftRadius: isMine ? '1.25rem' : '0.25rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {isMine && !msg.unread && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 'bold' }}>{t('chat.read')}</span>
                  )}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div style={{ 
        backgroundColor: 'var(--surface)', 
        padding: '0.75rem 1rem 2rem', 
        borderTop: '1px solid var(--border)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', paddingRight: '60px' }}>
          <textarea 
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('chat.input_placeholder')}
            style={{ 
              flex: 1, 
              padding: '0.75rem 1rem', 
              borderRadius: '1.25rem', 
              border: '1px solid var(--border)', 
              resize: 'none',
              maxHeight: '120px',
              fontSize: '1rem',
              lineHeight: '1.4',
              backgroundColor: 'var(--background)',
              color: 'var(--text-main)'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            style={{ 
              backgroundColor: inputText.trim() ? 'var(--accent)' : 'var(--border)',
              color: 'var(--secondary)', 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
              boxShadow: inputText.trim() ? '0 2px 8px rgba(212, 175, 55, 0.3)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
