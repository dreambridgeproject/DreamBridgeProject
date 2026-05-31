import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { logSearch } from '../lib/analytics';
import { Search, MapPin, User, Users, Camera } from 'lucide-react';
import type { Profile } from '../types';

interface SearchPageProps {
  type: 'talent' | 'agency' | 'casting';
}

const SearchPage: React.FC<SearchPageProps> = ({ type }) => {
  const { t } = useLanguage();
  const { currentUser, role } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    minHeight: '',
    maxHeight: '',
    location: '',
    gender: '',
    affiliation: ''
  });
  
  const initialGenre = 'すべて';
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);

  const locations = ['東京都', '神奈川県', '大阪府', '愛知県', '福岡県', '北海道', '千葉県', '埼玉県', '兵庫県', '京都府'];

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
    { key: 'アイドル', label: t('genre.idol') },
    { key: 'モデル', label: t('genre.model') },
    { key: '俳優', label: t('genre.actor') },
    { key: '歌手', label: t('genre.singer') },
    { key: '声優', label: t('genre.voice') },
    { key: 'インフルエンサー', label: t('genre.influencer') },
    { key: 'クリエイター', label: t('genre.creator') },
    { key: '舞台', label: t('genre.agency_stage') },
    { key: '映像', label: t('genre.agency_movie') }
  ];

  const castingGenres = [
    { key: 'すべて', label: t('genre.all') },
    { key: '映画', label: t('genre.movie') },
    { key: 'ドラマ', label: t('genre.drama') },
    { key: 'CM', label: t('genre.cm') },
    { key: '舞台', label: t('genre.agency_stage') },
    { key: 'Web広告', label: t('genre.web_ad') },
    { key: '雑誌', label: t('genre.magazine') },
    { key: 'イベント', label: t('genre.event') }
  ];

  const genres = type === 'talent' ? talentGenres : (type === 'agency' ? agencyGenres : castingGenres);

  const fetchUsers = async () => {
    setLoading(true);
    console.log(`Searching for ${type} with filters:`, { selectedGenre, ...filters, query });
    
    // Log search for AI analytics (only if agency is searching for talent)
    if (role === 'agency' && type === 'talent') {
      logSearch(currentUser?.id, { selectedGenre, ...filters, query });
    }

    try {
      let q = supabase
        .from('profiles')
        .select('*')
        .eq('role', type);

      if (selectedGenre !== 'すべて') {
        q = q.contains('genres', [selectedGenre]);
      }

      if (query) {
        q = q.ilike('full_name', `%${query}%`);
      }

      if (filters.minAge) q = q.gte('age', parseInt(filters.minAge));
      if (filters.maxAge) q = q.lte('age', parseInt(filters.maxAge));
      if (filters.minHeight) q = q.gte('height', parseInt(filters.minHeight));
      if (filters.maxHeight) q = q.lte('height', parseInt(filters.maxHeight));
      if (filters.location) q = q.eq('location', filters.location);
      if (filters.gender) q = q.eq('gender', filters.gender);
      if (filters.affiliation) q = q.eq('affiliation_status', filters.affiliation);

      const { data, error } = await q.order('id', { ascending: false });

      if (error) {
        console.error('Supabase Search Error:', error);
      } else {
        console.log(`Found ${data?.length || 0} results:`, data);
        setResults(data as Profile[]);
      }
    } catch (err) {
      console.error('Unexpected Search Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [type, selectedGenre, filters.location]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
          {type === 'talent' ? <Users size={32} /> : (type === 'casting' ? <Users size={32} /> : <User size={32} />)}
          {type === 'talent' ? t('mypage.search_talent') : (type === 'casting' ? t('search.title_casting') : t('mypage.search_agency'))}
        </h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          </div>

          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ alignSelf: 'flex-start', background: 'none', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {showFilters ? t('search.filter_close') : t('search.filter_open')}
          </button>

          {showFilters && (
            <div style={{ 
              backgroundColor: 'var(--surface)', 
              padding: '1.5rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {type === 'talent' && (
                <div style={filterGroupStyle}>
                  <label style={filterLabelStyle}>{t('search.gender')}</label>
                  <select 
                    value={filters.gender} 
                    onChange={e => setFilters({...filters, gender: e.target.value})}
                    style={filterInputStyle}
                  >
                    <option value="">{t('genre.all')}</option>
                    <option value="male">{t('search.gender_male')}</option>
                    <option value="female">{t('search.gender_female')}</option>
                    <option value="other">{t('search.gender_other')}</option>
                  </select>
                </div>
              )}

              {type === 'talent' && (
                <div style={filterGroupStyle}>
                  <label style={filterLabelStyle}>{t('mypage.affiliation')}</label>
                  <select 
                    value={filters.affiliation} 
                    onChange={e => setFilters({...filters, affiliation: e.target.value})}
                    style={filterInputStyle}
                  >
                    <option value="">{t('genre.all')}</option>
                    <option value="unaffiliated">{t('search.affiliation_only')}</option>
                    <option value="freelance">{t('mypage.freelance')}</option>
                    <option value="affiliated">{t('mypage.affiliated')}</option>
                  </select>
                </div>
              )}

              {type === 'talent' && (
                <div style={filterGroupStyle}>
                  <label style={filterLabelStyle}>{t('search.age_range')}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="number" placeholder={t('search.min')} value={filters.minAge} onChange={e => setFilters({...filters, minAge: e.target.value})} style={filterInputStyle} />
                    <span>〜</span>
                    <input type="number" placeholder={t('search.max')} value={filters.maxAge} onChange={e => setFilters({...filters, maxAge: e.target.value})} style={filterInputStyle} />
                  </div>
                </div>
              )}
              
              {type === 'talent' && (
                <div style={filterGroupStyle}>
                  <label style={filterLabelStyle}>{t('search.height_range')}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="number" placeholder={t('search.min')} value={filters.minHeight} onChange={e => setFilters({...filters, minHeight: e.target.value})} style={filterInputStyle} />
                    <span>〜</span>
                    <input type="number" placeholder={t('search.max')} value={filters.maxHeight} onChange={e => setFilters({...filters, maxHeight: e.target.value})} style={filterInputStyle} />
                  </div>
                </div>
              )}

              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>{t('job.location_label')}</label>
                <select 
                  value={filters.location} 
                  onChange={e => setFilters({...filters, location: e.target.value})}
                  style={filterInputStyle}
                >
                  <option value="">{t('search.location_all')}</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setFilters({ minAge: '', maxAge: '', minHeight: '', maxHeight: '', location: '', gender: '', affiliation: '' });
                    setSelectedGenre('すべて');
                  }}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', width: '100%' }}
                >
                  {t('search.clear')}
                </button>
              </div>
            </div>
          )}
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
                    alt={user.full_name || user.name} 
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {user.location || t('mypage.not_set')}</span>
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

const filterGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const filterLabelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' };
const filterInputStyle: React.CSSProperties = { padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)', width: '100%' };

export default SearchPage;