import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Heart, MessageSquare, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

const BottomNav: React.FC = () => {
  const { role } = useUser();
  const { t } = useLanguage();

  // Show navigation always to ensure user can find legal pages or login
  // But content depends on role
  const searchPath = role === 'agency' ? '/search/talent' : '/search/agencies';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.98)',
      backdropFilter: 'blur(15px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.75rem 0 1.25rem 0',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
    }}>
      <NavLink 
        to={searchPath} 
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        })}
      >
        <Search size={22} />
        <span>{t('nav.search')}</span>
      </NavLink>
      <NavLink 
        to="/favorites" 
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        })}
      >
        <Heart size={22} />
        <span>{t('nav.favorites')}</span>
      </NavLink>
      <NavLink 
        to="/chat" 
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        })}
      >
        <MessageSquare size={22} />
        <span>{t('nav.chat')}</span>
      </NavLink>
      <NavLink 
        to="/mypage" 
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        })}
      >
        <User size={22} />
        <span>{t('nav.mypage')}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
