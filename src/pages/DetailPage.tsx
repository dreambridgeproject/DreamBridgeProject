import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockTalents, mockAgencies } from '../data/mock';
import type { Talent, Agency } from '../types';
import { Heart, MapPin, ExternalLink, ChevronLeft, CheckCircle, Lock, ClipboardList } from 'lucide-react';

const DetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: 'talent' | 'agency'; id: string }>();
  const { currentUser, role, likes, toggleLike, sendOffer, offers } = useUser();
  const navigate = useNavigate();

  const isTalentDetail = type === 'talent';
  const item = isTalentDetail 
    ? mockTalents.find(t => t.id === id) 
    : mockAgencies.find(a => a.id === id);

  if (!item) {
    return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>見つかりませんでした。</div>;
  }

  const isLiked = likes.includes(item.id);
  const existingOffer = offers.find(o => 
    (o.senderId === currentUser?.id && o.receiverId === item.id) || 
    (o.senderId === item.id && o.receiverId === currentUser?.id)
  );

  // Agency specific logic
  const agency = !isTalentDetail ? item as Agency : null;
  const isApproved = agency?.isApproved;
  
  // Restricted offer for free agencies
  const canSendOffer = role === 'talent' || (role === 'agency' && (currentUser as any)?.plan !== 'free');

  const handleOffer = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!canSendOffer) return;
    if (existingOffer) return;
    sendOffer(item.id);
    alert('オファーを送信しました！');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', background: 'none' }}>
        <ChevronLeft size={20} /> 戻る
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left: Image & Actions */}
        <div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <img 
              src={isTalentDetail ? (item as Talent).icon : (item as Agency).logo} 
              alt={item.name} 
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
            {isApproved && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--accent)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={14} /> 運営承認済み
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => toggleLike(item.id)}
              className="btn" 
              style={{ 
                flex: 1, 
                backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)',
                color: isLiked ? 'var(--error)' : 'var(--text-muted)',
                border: isLiked ? '1px solid var(--error)' : '1px solid var(--border)',
                padding: '1rem'
              }}
            >
              <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <div style={{ flex: 3, position: 'relative' }}>
              <button 
                onClick={handleOffer}
                disabled={!!existingOffer || !canSendOffer}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', opacity: (existingOffer || !canSendOffer) ? 0.6 : 1 }}
              >
                {!canSendOffer && <Lock size={20} />} {existingOffer ? 'オファー済み' : 'オファーを送る'}
              </button>
              {!canSendOffer && (
                <p style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', color: 'var(--accent)' }}>
                  スタンダードプラン以上でオファー可能
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem' }}>{item.name}</h1>
            {isApproved && <CheckCircle size={24} style={{ color: 'var(--accent)' }} />}
          </div>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MapPin size={20} /> {isTalentDetail ? (item as Talent).region : (item as Agency).location}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {item.genres.map(g => (
              <span key={g} style={{ backgroundColor: 'var(--background)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
                {g}
              </span>
            ))}
          </div>

          {/* Audition Info for Enterprise Agencies */}
          {!isTalentDetail && (item as Agency).auditions && (item as Agency).auditions!.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)' }}>
              <h3 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ClipboardList size={20} /> 開催中のオーディション
              </h3>
              {(item as Agency).auditions!.map((aud, i) => (
                <div key={i} style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{aud.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{aud.description}</p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>締切: {aud.deadline}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--accent)' }}>
                基本情報
              </h2>
              {isTalentDetail ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>年齢</label>
                    <p style={{ fontSize: '1.125rem' }}>{(item as Talent).age}歳</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>特技</label>
                    <p style={{ fontSize: '1.125rem' }}>{(item as Talent).skills.join(', ')}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>設立</label>
                    <p style={{ fontSize: '1.125rem' }}>{(item as Agency).foundedYear}年</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>所属人数</label>
                    <p style={{ fontSize: '1.125rem' }}>{(item as Agency).talentCount}名</p>
                  </div>
                </div>
              )}
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--accent)' }}>
                紹介文
              </h2>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{item.intro}</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--accent)' }}>
                リンク
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {!isTalentDetail && (
                  <a href={(item as Agency).websiteUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', backgroundColor: 'var(--background)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    公式サイト <ExternalLink size={16} />
                  </a>
                )}
                {item.snsLinks.map((sns, i) => (
                  <a key={i} href={sns.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', backgroundColor: 'var(--background)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {sns.platform} <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
