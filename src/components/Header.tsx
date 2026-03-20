import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, notifications } = useUser();

  const unreadNotificationsCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <header style={{ 
      backgroundColor: 'var(--secondary)', 
      borderBottom: '1px solid var(--border)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ 
          fontSize: '1.75rem', 
          fontWeight: 900, 
          color: 'var(--accent)',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(to right, #d4af37, #fde68a, #d4af37)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DreamBridge
        </Link>

        {currentUser ? (
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/notifications" title="通知" style={{ position: 'relative', color: 'var(--text-main)' }}>
              <Bell size={24} />
              {unreadNotificationsCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  right: '-5px', 
                  backgroundColor: 'var(--error)', 
                  color: 'white', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  padding: '2px 5px', 
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>
            <Link to="/mypage" title="マイページ" style={{ 
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '2rem',
              border: '1px solid var(--border)',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}>
              <User size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Menu</span>
            </Link>
          </nav>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '2rem' }}>ログイン</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
