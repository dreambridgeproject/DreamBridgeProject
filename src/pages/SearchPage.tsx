import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockTalents, mockAgencies, GENRES } from '../data/mock';
import { Search as SearchIcon, CheckCircle, Lock } from 'lucide-react';

interface SearchPageProps {
  type: 'talent' | 'agency';
}

const SearchPage: React.FC<SearchPageProps> = ({ type }) => {
  const { currentUser, role } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  const isSearchingTalent = type === 'talent';
  const data = isSearchingTalent ? mockTalents : mockAgencies;

  // Plan-based restrictions for Agencies
  const isAgencyFreePlan = role === 'agency' && (currentUser as any)?.plan === 'free';

  const filteredData = data.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === '' || item.genres.includes(selectedGenre as any);
    const matchRegion = selectedRegion === '' || (isSearchingTalent ? (item as any).region : (item as any).location).includes(selectedRegion);
    
    if (isSearchingTalent && !isAgencyFreePlan) {
      const talent = item as any;
      const matchAge = talent.age >= minAge && talent.age <= maxAge;
      return matchSearch && matchGenre && matchRegion && matchAge;
    }
    
    return matchSearch && matchGenre && matchRegion;
  });

  // Sorting: Premium/Enterprise/PRO plans first
  const sortedData = [...filteredData].sort((a, b) => {
    const getPriority = (item: any) => {
      if (item.plan === 'enterprise' || item.plan === 'pro' || item.plan === 'premium') return 0;
      if (item.plan === 'standard') return 1;
      return 2;
    };
    return getPriority(a) - getPriority(b);
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
        {isSearchingTalent ? '志望者を探す' : '事務所を探す'}
      </h1>

      {/* Search & Filter Bar */}
      <div style={{ 
        backgroundColor: 'var(--surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <SearchIcon size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="名前で検索..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'white' }}
            />
          </div>
          
          <select 
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'white', minWidth: '150px' }}
          >
            <option value="">すべてのジャンル</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input 
            type="text" 
            placeholder="地域 (例: 東京)" 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'white', minWidth: '150px' }}
          />

          {isSearchingTalent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isAgencyFreePlan ? 0.5 : 1, position: 'relative' }}>
              <input 
                type="number" 
                placeholder="最小年齢" 
                disabled={isAgencyFreePlan}
                value={minAge || ''}
                onChange={(e) => setMinAge(Number(e.target.value))}
                style={{ width: '80px', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'white' }}
              />
              <span>〜</span>
              <input 
                type="number" 
                placeholder="最大年齢" 
                disabled={isAgencyFreePlan}
                value={maxAge || ''}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                style={{ width: '80px', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'white' }}
              />
              {isAgencyFreePlan && (
                <Link to="/mypage" style={{ position: 'absolute', top: '-25px', right: 0, fontSize: '0.75rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Lock size={12} /> プランをアップグレードしてフィルターを解除
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid Display */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {sortedData.map(item => (
          <div key={item.id} style={{ 
            backgroundColor: 'var(--surface)', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            border: (item.plan === 'enterprise' || item.plan === 'pro' || item.plan === 'premium') 
              ? '1px solid var(--accent)' 
              : '1px solid var(--border)',
            boxShadow: (item.plan === 'enterprise' || item.plan === 'pro' || item.plan === 'premium') 
              ? '0 0 15px rgba(212, 175, 55, 0.2)' 
              : 'var(--shadow)',
            position: 'relative'
          }}>
            {(item.plan === 'enterprise' || item.plan === 'pro' || item.plan === 'premium') && (
              <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', backgroundColor: 'var(--accent)', color: 'var(--secondary)', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '0.2rem', zIndex: 1 }}>
                PICK UP
              </div>
            )}
            <div style={{ position: 'relative', paddingTop: '100%' }}>
              <img 
                src={isSearchingTalent ? (item as any).icon : (item as any).logo} 
                alt={item.name} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '0.75rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                {item.name}
                {(!isSearchingTalent && (item as any).isApproved) && <CheckCircle size={14} style={{ color: 'var(--accent)' }} />}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {isSearchingTalent ? `${(item as any).age}歳 / ${(item as any).region}` : (item as any).location}
              </p>
              <Link 
                to={`/detail/${type}/${item.id}`} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
              >
                詳細を見る
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
