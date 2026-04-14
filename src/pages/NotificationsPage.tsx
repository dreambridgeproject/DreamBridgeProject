import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, CheckCircle2, XCircle, Send, ChevronRight } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, clearNotifications } = useUser();
  const { t } = useLanguage();

  if (!currentUser) return null;

  const myNotifications = notifications.filter(n => n.userId === currentUser.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'offer_received': return <Send size={20} style={{ color: 'var(--accent)' }} />;
      case 'offer_approved': return <CheckCircle2 size={20} style={{ color: '#10b981' }} />;
      case 'offer_declined': return <XCircle size={20} style={{ color: 'var(--error)' }} />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{t('notif.title')}</h1>
        {myNotifications.some(n => !n.read) && (
          <button 
            onClick={clearNotifications}
            style={{ background: 'none', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            {t('notif.mark_read')}
          </button>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {myNotifications.length > 0 ? myNotifications.map(notif => (
          <Link 
            key={notif.id} 
            to={notif.link}
            onClick={() => markNotificationAsRead(notif.id)}
            style={{ 
              display: 'flex', 
              padding: '1.25rem', 
              gap: '1rem', 
              alignItems: 'flex-start', 
              borderBottom: '1px solid var(--border)',
              backgroundColor: notif.read ? 'transparent' : 'rgba(212, 175, 55, 0.05)',
              transition: 'background-color 0.2s',
              textDecoration: 'none'
            }}
          >
            <div style={{ 
              padding: '0.5rem', 
              backgroundColor: 'var(--background)', 
              borderRadius: '50%', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getIcon(notif.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: notif.read ? 600 : 700, color: 'var(--text-main)' }}>{notif.title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(notif.timestamp).toLocaleDateString()} {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{notif.message}</p>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--border)', marginTop: '0.5rem' }} />
          </Link>
        )) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            {t('notif.no_notifs')}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
