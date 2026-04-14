import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, Filter, Star, User, Users, Camera, Video, Music, Palette, Tv } from 'lucide-react';
import type { Profile } from '../types';

interface SearchPageProps {
  type: 'talent' | 'agency';
}

const SearchPage: React.FC<SearchPageProps> = ({ type }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const initialGenre = 'すべて';
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);

  const talentGenres = [
    { key: 'すべて', label: t('genre.all') },
    { key: 'アイドル', label: t('genre.idol') },
    { key: 'モデル', label: t('genre.model') },
    { key: '俳優', label: t('genre.actor') },
    { key: '歌手', label: t('genre.singer') },
    { key: 'ダンサー', label: t('genre.dancer') },
    { key: 'インフルエンサー', label: t('genre.influencer') },
    { key: '声優', label: t('genre.voice') },
    { key: 'クリエイター', label: t('genre.creator') },
    { key: 'ライバー', label: t('genre.liver') }
  ];

  const agencyGenres = [
    { key: 'すべて', label: t('genre.all') },
    { key: '芸能', label: t('genre.agency_talent') },
    { key: 'モデル', label: t('genre.model') },
    { key: '音楽', label: t('genre.agency_music') },
    { key: '俳優', label: t('genre.actor') },
    { key: 'インフルエンサー', label: t('genre.influencer') }
  ];

  const genres = type === 'talent' ? talentGenres : agencyGenres;

  const fetchUsers = async () => {
    setLoading(true);
    let q = supabase
      .from('profiles')
      .select('*')
      .eq('role', type);

    if (selectedGenre !== 'すべて') {
      q = q.contains('genres', [selectedGenre]);
    }

    const { data, error } = await q.order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setResults(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [type, selectedGenre]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', type)
      .ilike('full_name', `%${query}%`);

    if (!error) {
      setResults(data as Profile[]);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
          {type === 'talent' ? <Users size={32} /> : <User size={32} />}
          {type === 'talent' ? t('mypage.search_talent') : t('mypage.search_agency')}
        </h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={type === 'talent' ? t('search.placeholder_talent') : t('search.placeholder_agency')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '1rem', color: 'var(--text-main)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>{t('search.search_btn')}</button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', whiteSpace: 'nowrap' }}>
          {genres.map(genre => (
            <button 
              key={genre.key}
              onClick={() => setSelectedGenre(genre.key)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '2rem',
                border: '1px solid var(--border)',
                backgroundColor: selectedGenre === genre.key ? 'var(--accent)' : 'var(--surface)',
                color: selectedGenre === genre.key ? 'var(--secondary)' : 'var(--text-main)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-main)' }}>{t('mypage.loading')}</div>
      ) : results.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {results.map(user => (
            <Link key={user.id} to={`/detail/${type}/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={cardStyle}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={user.avatar_url || 'https://via.placeholder.com/300'} 
                    alt={user.name} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid var(--border)' }} 
                  />
                  {user.photos?.length > 0 && (
                    <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Camera size={12} /> {user.photos.length}
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem', color: 'var(--text-main)' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{user.full_name || user.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {user.genres?.slice(0, 3).map(g => (
                      <span key={g} style={{ backgroundColor: 'var(--background)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}>{g}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {user.location || 'Unknown'}</span>
                    {user.age && <span>{user.age}{t('mypage.age')}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>{t('search.no_results')}</p>
        </div>
      )}
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border)',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  height: '100%'
};

export default SearchPage;
