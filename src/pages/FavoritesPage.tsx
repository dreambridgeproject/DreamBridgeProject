import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockTalents, mockAgencies } from '../data/mock';
import { MapPin, Trash2 } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { likes, toggleLike } = useUser();

  const favoriteTalents = mockTalents.filter(t => likes.includes(t.id));
  const favoriteAgencies = mockAgencies.filter(a => likes.includes(a.id));

  const renderCard = (item: any, type: 'talent' | 'agency') => {
    const isTalent = type === 'talent';
    return (
      <div key={item.id} style={{ 
        backgroundColor: 'white', 
        borderRadius: 'var(--radius-md)', 
        overflow: 'hidden', 
        boxShadow: 'var(--shadow)',
        position: 'relative'
      }}>
        <div style={{ position: 'relative', paddingTop: '100%' }}>
          <img 
            src={isTalent ? item.icon : item.logo} 
            alt={item.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button 
            onClick={() => toggleLike(item.id)}
            style={{ 
              position: 'absolute', 
              top: '0.5rem', 
              right: '0.5rem', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              padding: '0.5rem',
              color: 'var(--error)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div style={{ padding: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} /> {isTalent ? item.region : item.location}
          </p>
          <Link 
            to={`/detail/${type}/${item.id}`} 
            className="btn btn-outline" 
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}
          >
            詳細を見る
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>お気に入り一覧</h1>

      {favoriteTalents.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>志望者</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {favoriteTalents.map(t => renderCard(t, 'talent'))}
          </div>
        </section>
      )}

      {favoriteAgencies.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>事務所</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {favoriteAgencies.map(a => renderCard(a, 'agency'))}
          </div>
        </section>
      )}

      {likes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          お気に入りはまだありません。
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
