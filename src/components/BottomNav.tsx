import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Heart, MessageSquare, User, Briefcase } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

const BottomNav: React.FC = () => {
  const { role } = useUser();
  const { t } = useLanguage();

  // Show navigation always to ensure user can find legal pages or login
  // Default to talent search if not a talent (includes agency, casting, and loading/null)
  const searchPath = role === 'talent' ? '/search/agencies' : '/search/talent';

  const navItemStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.25rem',
    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
    fontSize: '0.7rem',
    fontWeight: isActive ? '700' : '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  });

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
      <NavLink to={searchPath} style={navItemStyle}>
        <Search size={22} />
        <span>{t('nav.search')}</span>
      </NavLink>
      <NavLink to="/jobs" style={navItemStyle}>
        <Briefcase size={22} />
        <span>{t('job.title')}</span>
      </NavLink>
      <NavLink to="/favorites" style={navItemStyle}>
        <Heart size={22} />
        <span>{t('nav.favorites')}</span>
      </NavLink>
      <NavLink to="/chat" style={navItemStyle}>
        <MessageSquare size={22} />
        <span>{t('nav.chat')}</span>
      </NavLink>
      <NavLink to="/mypage" style={navItemStyle}>
        <User size={22} />
        <span>{t('nav.mypage')}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
