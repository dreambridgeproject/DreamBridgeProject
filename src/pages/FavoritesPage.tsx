import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { MapPin, Trash2, User, Users } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { likes, toggleLike, role } = useUser();
  const { t } = useLanguage();
  const [favoriteProfiles, setFavoriteProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (likes.length === 0) {
        setFavoriteProfiles([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('id', likes);

        if (error) throw error;
        if (data) setFavoriteProfiles(data as Profile[]);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [likes]);

  const favoriteTalents = favoriteProfiles.filter(p => p.role === 'talent');
  const favoriteAgencies = favoriteProfiles.filter(p => p.role === 'agency');
  const favoriteCasting = favoriteProfiles.filter(p => p.role === 'casting');

  const renderCard = (item: Profile) => {
    const type = item.role;
    return (
      <div key={item.id} style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden', 
        boxShadow: 'var(--shadow)',
        position: 'relative',
        border: '1px solid var(--border)',
        height: '100%'
      }}>
        <div style={{ position: 'relative', paddingTop: '100%' }}>
          <img 
            src={item.avatar_url || 'https://via.placeholder.com/300'} 
            alt={item.full_name || item.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button 
            onClick={() => toggleLike(item.id)}
            style={{ 
              position: 'absolute', 
              top: '0.75rem', 
              right: '0.75rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '50%', 
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--error)',
              boxShadow: 'var(--shadow-sm)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: 700 }}>{item.full_name || item.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} /> {item.location || t('mypage.not_set')}
          </p>
          <Link 
            to={`/detail/${type}/${item.id}`} 
            className="btn btn-outline" 
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.8125rem', textAlign: 'center', display: 'block', textDecoration: 'none' }}
          >
            {t('fav.view_detail')}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('fav.title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>保存したプロフィールを一覧で確認できます。</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-main)' }}>{t('mypage.loading')}</div>
      ) : (
        <>
          {favoriteTalents.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} /> {t('fav.talent_section')}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {favoriteTalents.map(t => renderCard(t))}
              </div>
            </section>
          )}

          {favoriteAgencies.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} /> {t('fav.agency_section')}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {favoriteAgencies.map(a => renderCard(a))}
              </div>
            </section>
          )}

          {favoriteCasting.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} /> {t('search.title_casting')}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {favoriteCasting.map(c => renderCard(c))}
              </div>
            </section>
          )}

          {likes.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '8rem 2rem', 
              color: 'var(--text-muted)',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border)'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{t('fav.no_favs')}</p>
              <Link to={role === 'talent' ? '/search/agencies' : '/search/talent'} className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                {role === 'talent' ? t('mypage.search_agency') : t('mypage.search_talent')}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
