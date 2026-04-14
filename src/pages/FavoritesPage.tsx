import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { mockTalents, mockAgencies } from '../data/mock';
import { MapPin, Trash2 } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { likes, toggleLike } = useUser();
  const { t } = useLanguage();

  const favoriteTalents = mockTalents.filter(t => likes.includes(t.id));
  const favoriteAgencies = mockAgencies.filter(a => likes.includes(a.id));

  const renderCard = (item: any, type: 'talent' | 'agency') => {
    const isTalent = type === 'talent';
    return (
      <div key={item.id} style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: 'var(--radius-md)', 
        overflow: 'hidden', 
        boxShadow: 'var(--shadow)',
        position: 'relative',
        border: '1px solid var(--border)'
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
              backgroundColor: 'var(--surface)', 
              borderRadius: '50%', 
              padding: '0.5rem',
              color: 'var(--error)',
              boxShadow: 'var(--shadow)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div style={{ padding: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{item.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} /> {isTalent ? item.region : item.location}
          </p>
          <Link 
            to={`/detail/${type}/${item.id}`} 
            className="btn btn-outline" 
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', textAlign: 'center', display: 'block', textDecoration: 'none' }}
          >
            {t('fav.view_detail')}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>{t('fav.title')}</h1>

      {favoriteTalents.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('fav.talent_section')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {favoriteTalents.map(t => renderCard(t, 'talent'))}
          </div>
        </section>
      )}

      {favoriteAgencies.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('fav.agency_section')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {favoriteAgencies.map(a => renderCard(a, 'agency'))}
          </div>
        </section>
      )}

      {likes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          {t('fav.no_favs')}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
