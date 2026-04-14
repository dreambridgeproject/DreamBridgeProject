import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { 
  Heart, MapPin, ExternalLink, ChevronLeft, ShieldCheck, 
  ShieldAlert, Lock, Image, Video, Music, Instagram, Twitter, MessageSquare
} from 'lucide-react';

const DetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: 'talent' | 'agency'; id: string }>();
  const { currentUser, role, likes, toggleLike, sendOffer, offers } = useUser();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>読み込み中...</div>;
  if (!profile) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>ユーザーが見つかりませんでした。</div>;

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
    sendOffer(profile.id);
    alert('オファーを送信しました！');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ChevronLeft size={20} /> 戻る
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left: Main Image & Actions */}
        <div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <img 
              src={profile.avatar_url || 'https://via.placeholder.com/400'} 
              alt={profile.name} 
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
            {profile.verificationStatus === 'verified' && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--accent)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={14} /> 運営認証済み
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

        {/* Right: Profile Details */}
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem' }}>{profile.full_name || profile.name}</h1>
            {profile.verificationStatus === 'verified' && <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />}
          </div>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MapPin size={20} /> {profile.location || '地域未設定'}
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
              <h2 style={sectionTitleStyle}>紹介・意気込み</h2>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.bio || '自己紹介文がありません。'}</p>
            </section>

            {isTalentDetail && (
              <section>
                <h2 style={sectionTitleStyle}>スペック情報</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {profile.age && <div><label style={labelStyle}>年齢</label><p style={valueStyle}>{profile.age}歳</p></div>}
                  {profile.height && <div><label style={labelStyle}>身長</label><p style={valueStyle}>{profile.height}cm</p></div>}
                  {profile.hobbies && <div><label style={labelStyle}>趣味</label><p style={valueStyle}>{profile.hobbies}</p></div>}
                  {profile.skills && <div><label style={labelStyle}>特技</label><p style={valueStyle}>{profile.skills}</p></div>}
                </div>
              </section>
            )}

            {/* Media Gallery */}
            {(profile.photos?.length > 0 || profile.videos?.length > 0 || profile.audios?.length > 0) && (
              <section>
                <h2 style={sectionTitleStyle}>メディア・ポートフォリオ</h2>
                
                {profile.photos?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={mediaSubTitleStyle}><Image size={16} /> 写真</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {profile.photos.map((p, i) => (
                        <img key={i} src={p} alt="" style={{ height: '120px', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      ))}
                    </div>
                  </div>
                )}

                {profile.videos?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={mediaSubTitleStyle}><Video size={16} /> 動画</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {profile.videos.map((v, i) => (
                        <video key={i} src={v} controls style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }} />
                      ))}
                    </div>
                  </div>
                )}

                {profile.audios?.length > 0 && (
                  <div>
                    <h4 style={mediaSubTitleStyle}><Music size={16} /> 音声</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {profile.audios.map((a, i) => (
                        <audio key={i} src={a} controls style={{ width: '100%' }} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* SNS Links */}
            {(profile.instagram_url || profile.x_url) && (
              <section>
                <h2 style={sectionTitleStyle}>SNSリンク</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {profile.instagram_url && (
                    <a href={`https://instagram.com/${profile.instagram_url}`} target="_blank" rel="noreferrer" style={snsButtonStyle}>
                      <Instagram size={20} /> Instagram
                    </a>
                  )}
                  {profile.x_url && (
                    <a href={`https://twitter.com/${profile.x_url}`} target="_blank" rel="noreferrer" style={snsButtonStyle}>
                      <Twitter size={20} /> X (Twitter)
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

const labelStyle: React.CSSProperties = { fontSize: '0.75rem', color: 'var(--text-muted)' };
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
