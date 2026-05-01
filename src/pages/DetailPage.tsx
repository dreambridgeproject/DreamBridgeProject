import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { 
  Heart, MapPin, ChevronLeft, ShieldCheck, 
  Lock, Image, Video, Music, Instagram, Twitter
} from 'lucide-react';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ type: 'talent' | 'agency'; id: string }>();
  const { currentUser, role, likes, toggleLike, sendOffer, offers, checkOfferLimit } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkLimit = async () => {
      const reached = await checkOfferLimit();
      setIsLimitReached(reached);
    };
    if (role === 'agency') checkLimit();
  }, [role, checkOfferLimit]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) {
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-main)' }}>{t('mypage.loading')}</div>;
  if (!profile) return <div className="container" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-main)' }}>{t('search.no_results')}</div>;

  const isLiked = likes.includes(profile.id);
  const existingOffer = offers.find(o => 
    (o.senderId === currentUser?.id && o.receiverId === profile.id) || 
    (o.senderId === profile.id && o.receiverId === currentUser?.id)
  );

  const isTalentDetail = profile.role === 'talent';
  
  // Restricted offer for free agencies
  const canSendOffer = role === 'talent' || (role === 'agency' && (currentUser as any)?.plan !== 'free');

  const handleOffer = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!canSendOffer) return;
    if (existingOffer) return;
    if (isLimitReached) {
      alert('今月のオファー送信上限（3件）に達しました。');
      return;
    }
    sendOffer(profile.id);
    alert(t('detail.offer_sent'));
    setIsLimitReached(true);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ChevronLeft size={20} /> {t('detail.back')}
      </button>

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        gap: '2.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left: Main Image & Actions */}
        <div style={{ width: isMobile ? '100%' : '400px', flexShrink: 0 }}>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <img 
              src={profile.avatar_url || 'https://via.placeholder.com/400'} 
              alt={profile.name} 
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
            {profile.verification_status === 'verified' && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--accent)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={14} /> {t('detail.verified')}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => toggleLike(profile.id)}
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
                disabled={!!existingOffer || !canSendOffer || isLimitReached}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', opacity: (existingOffer || !canSendOffer || isLimitReached) ? 0.6 : 1 }}
              >
                {!canSendOffer && <Lock size={20} />} {existingOffer ? t('detail.offered') : isLimitReached ? '上限に達しました' : t('detail.send_offer')}
              </button>
              {(!canSendOffer || isLimitReached) && (
                <p style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', color: 'var(--accent)' }}>
                  {isLimitReached ? '今月のオファー上限（3件）に達しています' : t('detail.restricted_offer')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Profile Details */}
        <div style={{ flex: 1, backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', color: 'var(--text-main)', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem' }}>{profile.full_name || profile.name}</h1>
            {profile.verification_status === 'verified' && <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />}
          </div>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MapPin size={20} /> {profile.location || t('mypage.location')}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {profile.genres?.map(g => (
              <span key={g} style={{ backgroundColor: 'var(--background)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', border: '1px solid var(--border)', fontWeight: 600 }}>
                {g}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section>
              <h2 style={sectionTitleStyle}>{t('detail.bio_title')}</h2>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.bio || t('detail.no_bio')}</p>
            </section>

            {isTalentDetail && (
              <section>
                <h2 style={sectionTitleStyle}>{t('detail.specs_title')}</h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {profile.age && <div><label style={labelStyle}>{t('detail.age')}</label><p style={valueStyle}>{profile.age}{t('mypage.age')}</p></div>}
                  {profile.height && <div><label style={labelStyle}>{t('detail.height')}</label><p style={valueStyle}>{profile.height}{t('mypage.height')}</p></div>}
                  {profile.weight && <div><label style={labelStyle}>{t('detail.weight')}</label><p style={valueStyle}>{profile.weight}{t('mypage.weight')}</p></div>}
                  {profile.hobbies && <div><label style={labelStyle}>{t('detail.hobbies')}</label><p style={valueStyle}>{profile.hobbies}</p></div>}
                  {profile.skills && <div><label style={labelStyle}>{t('detail.skills')}</label><p style={valueStyle}>{profile.skills}</p></div>}
                </div>
              </section>
            )}

            {/* Media Gallery */}
            {(profile.photos?.length > 0 || profile.videos?.length > 0 || profile.audios?.length > 0) && (
              <section>
                <h2 style={sectionTitleStyle}>{t('detail.media_title')}</h2>
                
                {profile.photos?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={mediaSubTitleStyle}><Image size={16} /> {t('detail.photos')}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {profile.photos.map((p, i) => (
                        <img key={i} src={p} alt="" style={{ height: '120px', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      ))}
                    </div>
                  </div>
                )}

                {profile.videos?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem', opacity: 0.6 }}>
                    <h4 style={mediaSubTitleStyle}><Video size={16} /> {t('detail.videos')}</h4>
                    <p style={{ fontSize: '0.875rem', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                      {t('mypage.coming_soon_official')}
                    </p>
                  </div>
                )}

                {profile.audios?.length > 0 && (
                  <div style={{ opacity: 0.6 }}>
                    <h4 style={mediaSubTitleStyle}><Music size={16} /> {t('detail.audios')}</h4>
                    <p style={{ fontSize: '0.875rem', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                      {t('mypage.coming_soon_official')}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* SNS Links */}
            {(profile.instagram_url || profile.x_url) && (
              <section>
                <h2 style={sectionTitleStyle}>{t('detail.sns_title')}</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {profile.instagram_url && (
                    <a href={`https://instagram.com/${profile.instagram_url}`} target="_blank" rel="noreferrer" style={snsButtonStyle}>
                      <Instagram size={20} /> {t('detail.sns_instagram')}
                    </a>
                  )}
                  {profile.x_url && (
                    <a href={`https://twitter.com/${profile.x_url}`} target="_blank" rel="noreferrer" style={snsButtonStyle}>
                      <Twitter size={20} /> {t('detail.sns_x')}
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  marginBottom: '1rem',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '0.5rem',
  color: 'var(--accent)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const labelStyle: React.CSSProperties = { fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', whiteSpace: 'nowrap' };
const valueStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: 600 };
const mediaSubTitleStyle: React.CSSProperties = { fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const snsButtonStyle: React.CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '0.5rem', 
  padding: '0.75rem 1.25rem', 
  borderRadius: 'var(--radius-sm)', 
  backgroundColor: 'var(--background)', 
  border: '1px solid var(--border)', 
  color: 'var(--text-main)', 
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontWeight: 600
};

export default DetailPage;
