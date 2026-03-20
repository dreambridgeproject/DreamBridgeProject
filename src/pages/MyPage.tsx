import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { Talent, Agency } from '../types';
import { LogOut, Edit, MapPin, Search, BarChart3, Star, ShieldCheck, ClipboardList, MessageSquare } from 'lucide-react';

const MyPage: React.FC = () => {
  const { currentUser, role, logout } = useUser();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isTalent = role === 'talent';
  const talent = isTalent ? currentUser as Talent : null;
  const agency = !isTalent ? currentUser as Agency : null;

  const planLabels: Record<string, string> = {
    free: '無料プラン',
    standard: 'スタンダード',
    pro: 'PRO',
    enterprise: 'エンタープライズ',
    premium: 'プレミアム'
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Profile Header */}
      <div style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2rem', 
        boxShadow: 'var(--shadow)',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Plan Badge */}
        <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--accent)', color: 'var(--secondary)', padding: '0.5rem 1.5rem', borderBottomLeftRadius: '1rem', fontWeight: 800, fontSize: '0.875rem' }}>
          {planLabels[currentUser.plan]}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <img 
            src={isTalent ? talent!.icon : agency!.logo} 
            alt={currentUser.name} 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: isTalent ? '50%' : 'var(--radius-md)', 
              objectFit: 'cover',
              border: '4px solid var(--background)'
            }} 
          />
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {currentUser.name}
                  {(!isTalent && agency?.isApproved) && <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />}
                </h1>
                <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <MapPin size={18} /> {isTalent ? talent!.region : agency!.location}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <Edit size={16} /> 編集
                </button>
                <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', fontSize: '0.875rem' }}>
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {currentUser.genres.map(g => (
                <span key={g} style={{ backgroundColor: 'var(--background)', color: 'var(--text-main)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics / Highlights for Paid Plans */}
      {(currentUser.plan !== 'free') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)', textAlign: 'center' }}>
            <BarChart3 size={32} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{isTalent ? 'ピックアップ回数' : 'ライクされた数'}</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{isTalent ? '128' : '45'}</p>
          </div>
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <Star size={32} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>検索順位</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>上位 5%</p>
          </div>
          {!isTalent && (
            <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <MessageSquare size={32} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>残りオファー枠</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{agency!.plan === 'enterprise' || agency!.plan === 'pro' ? '無制限' : '82 / 100'}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <Link 
          to={isTalent ? '/search/agencies' : '/search/talent'} 
          className="btn btn-primary" 
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', fontSize: '1.125rem' }}
        >
          <Search size={24} /> {isTalent ? '事務所を探す' : '志望者を探す'}
        </Link>
        <Link 
          to="/favorites" 
          className="btn btn-outline" 
          style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', fontSize: '1.125rem' }}
        >
          お気に入り一覧
        </Link>
      </div>

      {/* Main Content Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Audition Management for Enterprise */}
        {!isTalent && agency!.plan === 'enterprise' && (
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--accent)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={20} /> オーディション管理
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {agency!.auditions?.map((aud, i) => (
                <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{aud.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>締切: {aud.deadline}</p>
                </div>
              ))}
              <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem' }}>+ 新規投稿</button>
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent)' }}>プロフィール詳細</h2>
          {isTalent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>年齢</label>
                <p>{talent!.age}歳</p>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>志望ジャンル</label>
                <p>{talent!.genres.join(', ')}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>自己紹介</label>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{talent!.intro}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>設立</label>
                  <p>{agency!.foundedYear}年</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>所属人数</label>
                  <p>{agency!.talentCount}名</p>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>紹介文</label>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{agency!.intro}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
