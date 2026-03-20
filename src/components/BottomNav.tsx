import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Heart, MessageSquare, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

const BottomNav: React.FC = () => {
  const { currentUser, role } = useUser();

  if (!currentUser) return null;

  const searchPath = role === 'talent' ? '/search/agencies' : '/search/talent';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.75rem 0 1.5rem 0',
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
          transition: 'all 0.3s ease'
        })}
      >
        <Search size={22} style={{ marginBottom: '2px' }} />
        <span>探す</span>
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
          transition: 'all 0.3s ease'
        })}
      >
        <Heart size={22} style={{ marginBottom: '2px' }} />
        <span>お気に入り</span>
      </NavLink>
      <NavLink 
        to="/offers" 
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
          transition: 'all 0.3s ease'
        })}
      >
        <MessageSquare size={22} style={{ marginBottom: '2px' }} />
        <span>オファー</span>
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
          transition: 'all 0.3s ease'
        })}
      >
        <User size={22} style={{ marginBottom: '2px' }} />
        <span>マイページ</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
