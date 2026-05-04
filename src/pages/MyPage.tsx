import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { 
  LogOut, Edit, MapPin, Search, Star, MessageSquare,
  Image, Shield, 
  CreditCard, ExternalLink, Save, X, Camera, Plus, Trash2, Instagram, Twitter
} from 'lucide-react';

const MyPage: React.FC = () => {
  const { currentUser, role, user, loading: userLoading, logout, updateProfile } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    bio: '',
    location: '',
    age: '',
    height: '',
    weight: '',
    hobbies: '',
    skills: '',
    website_url: '',
    instagram_url: '',
    x_url: '',
    genres: [] as string[]
  });

  // Handle redirection in useEffect, not in render
  React.useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  // Wait for loading to finish before checking user
  if (userLoading) {
    return <div style={{ padding: '5rem', textAlign: 'center' }}>{t('mypage.loading')}</div>;
  }

  if (!user) {
    return null; // Return null instead of navigating during render
  }

  const isAdmin = user?.email === 'admin@dreambridge.jp' || user?.email?.includes('admin@');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const startEditing = () => {
    setEditData({
      full_name: currentUser?.full_name || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || '',
      age: currentUser?.age?.toString() || '',
      height: currentUser?.height?.toString() || '',
      weight: currentUser?.weight?.toString() || '',
      hobbies: currentUser?.hobbies || '',
      skills: currentUser?.skills || '',
      website_url: currentUser?.website_url || '',
      instagram_url: currentUser?.instagram_url || '',
      x_url: currentUser?.x_url || '',
      genres: currentUser?.genres || []
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    console.log('Attempting to save profile...', editData);
    try {
      const updates: any = {
        full_name: editData.full_name,
        bio: editData.bio,
        location: editData.location,
        genres: editData.genres
      };

      if (isTalent) {
        updates.age = parseInt(editData.age) || null;
        updates.height = parseInt(editData.height) || null;
        updates.weight = parseInt(editData.weight) || null;
        updates.hobbies = editData.hobbies;
        updates.skills = editData.skills;
      }

      await updateProfile(updates);
      setIsEditing(false);
      console.log('Profile saved successfully');
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      alert(t('mypage.save_error') + '\n' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file: File, bucket: string, field: 'photos' | 'videos' | 'audios' | 'avatar_url') => {
    setLoading(true);
    console.log(`Uploading to ${bucket}, updating field ${field}...`);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error details:', JSON.stringify(uploadError));
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('Generated Public URL:', publicUrl);

      if (field === 'avatar_url') {
        await updateProfile({ avatar_url: publicUrl });
      } else {
        const currentList = currentUser?.[field] || [];
        await updateProfile({ [field]: [...currentList, publicUrl] });
      }
      alert(t('mypage.upload_success'));
    } catch (error: any) {
      console.error('Full upload process error:', error);
      alert('Upload Error: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (url: string, field: 'photos' | 'videos' | 'audios') => {
    if (!window.confirm(t('mypage.delete_confirm'))) return;
    const newList = (currentUser?.[field] || []).filter(item => item !== url);
    await updateProfile({ [field]: newList } as any);
  };

  const isTalent = role === 'talent';
  const isAgency = role === 'agency';
  const talentGenreOptions = ['アイドル', 'モデル', '俳優', '歌手', 'ダンサー', 'インフルエンサー', '声優', 'クリエイター', 'ライバー'];
  const agencyGenreOptions = ['アイドル', 'モデル', '俳優', '歌手', '声優', 'インフルエンサー', 'クリエイター', '舞台', '映像'];
  const genreOptions = isTalent ? talentGenreOptions : agencyGenreOptions;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Quick Access Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(isTalent ? '/search/agencies' : '/search/talent')}
          style={quickLinkStyle}
        >
          <Search size={24} />
          <span>{isTalent ? t('mypage.search_agency') : t('mypage.search_talent')}</span>
        </button>
        <button 
          onClick={() => navigate('/chat')}
          style={quickLinkStyle}
        >
          <MessageSquare size={24} />
          <span>{t('mypage.chat_offers')}</span>
        </button>
        <button 
          onClick={() => navigate('/favorites')}
          style={quickLinkStyle}
        >
          <Star size={24} />
          <span>{t('mypage.favorites')}</span>
        </button>
        {isAgency && (
          <button 
            onClick={() => navigate('/subscription')}
            style={{ ...quickLinkStyle, border: '1px solid var(--accent)', background: 'rgba(212, 175, 55, 0.1)' }}
          >
            <CreditCard size={24} color="var(--accent)" />
            <span style={{ color: 'var(--accent)' }}>{t('mypage.plan_mgmt')}</span>
          </button>
        )}
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            style={{ ...quickLinkStyle, border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <Shield size={24} color="#ef4444" />
            <span style={{ color: '#ef4444' }}>{t('mypage.admin')}</span>
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(1rem, 5vw, 2rem)', boxShadow: 'var(--shadow)', marginBottom: '2rem', border: '1px solid var(--border)', position: 'relative' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: '2rem', 
          alignItems: window.innerWidth < 768 ? 'center' : 'flex-start' 
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '120px', height: '120px', borderRadius: isTalent ? '50%' : 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--background)', border: '4px solid var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Plus size={40} color="var(--text-muted)" />
              )}
            </div>
            <button onClick={() => avatarInputRef.current?.click()} style={cameraButtonStyle}><Camera size={16} /></button>
            <input type="file" ref={avatarInputRef} onChange={e => e.target.files?.[0] && uploadMedia(e.target.files[0], 'avatars', 'avatar_url')} accept="image/*" style={{ display: 'none' }} />
          </div>

          <div style={{ flex: 1, minWidth: '250px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '100%' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <input type="text" placeholder={isTalent ? t('mypage.full_name') : t('mypage.agency_name')} value={editData.full_name} onChange={e => setEditData({...editData, full_name: e.target.value})} style={inputStyle} />
                      <input type="text" placeholder={isTalent ? t('mypage.location_label') : t('mypage.hq_label')} value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} style={inputStyle} />
                    </div>
                    {isTalent && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <input type="number" placeholder={t('detail.age')} value={editData.age} onChange={e => setEditData({...editData, age: e.target.value})} style={inputStyle} />
                        <input type="number" placeholder={t('detail.height')} value={editData.height} onChange={e => setEditData({...editData, height: e.target.value})} style={inputStyle} />
                        <input type="number" placeholder={t('detail.weight')} value={editData.weight} onChange={e => setEditData({...editData, weight: e.target.value})} style={inputStyle} />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.75rem', width: '100%', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t('mypage.genres')}:</span>
                      {genreOptions.map(genre => (
                        <label key={genre} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={editData.genres.includes(genre)} 
                            onChange={e => {
                              const newList = e.target.checked ? [...editData.genres, genre] : editData.genres.filter(g => g !== genre);
                              setEditData({...editData, genres: newList});
                            }}
                          /> {genre}
                        </label>
                      ))}
                    </div>
                    {isTalent ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" placeholder={t('detail.hobbies')} value={editData.hobbies} onChange={e => setEditData({...editData, hobbies: e.target.value})} style={inputStyle} />
                        <input type="text" placeholder={t('detail.skills')} value={editData.skills} onChange={e => setEditData({...editData, skills: e.target.value})} style={inputStyle} />
                      </div>
                    ) : (
                      <input type="url" placeholder={t('mypage.website_url')} value={(editData as any).website_url || ''} onChange={e => setEditData({...editData, website_url: e.target.value} as any)} style={inputStyle} />
                    )}
                    <textarea placeholder={isTalent ? t('mypage.bio_placeholder_talent') : t('mypage.bio_placeholder_agency')} value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} style={{ ...inputStyle, minHeight: '120px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Instagram size={18} /><input type="text" placeholder="Instagram ID" value={editData.instagram_url} onChange={e => setEditData({...editData, instagram_url: e.target.value})} style={inputStyle} /></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Twitter size={18} /><input type="text" placeholder="X ID" value={editData.x_url} onChange={e => setEditData({...editData, x_url: e.target.value})} style={inputStyle} /></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>{currentUser?.full_name || currentUser?.name || t('mypage.no_name')}</h1>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '1rem', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.875rem', 
                      marginBottom: '1rem',
                      justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
                    }}>
                      <span><MapPin size={14} /> {currentUser?.location || t('mypage.not_set')}</span>
                      {isTalent && currentUser?.age && <span>{currentUser.age}{t('mypage.age')}</span>}
                      {isTalent && currentUser?.height && <span>{currentUser.height}{t('mypage.height')}</span>}
                      {isTalent && currentUser?.weight && <span>{currentUser.weight}{t('mypage.weight')}</span>}
                      {isAgency && currentUser?.website_url && (
                        <a href={currentUser.website_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ExternalLink size={14} /> {t('mypage.official_site')}
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {currentUser?.genres?.map(g => (
                        <span key={g} style={{ backgroundColor: 'var(--accent)', color: 'var(--secondary)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>{g}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{currentUser?.bio || t('mypage.no_bio')}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {currentUser?.instagram_url && <a href={`https://instagram.com/${currentUser.instagram_url}`} target="_blank" rel="noreferrer"><Instagram size={20} color="var(--text-main)" /></a>}
                      {currentUser?.x_url && <a href={`https://twitter.com/${currentUser.x_url}`} target="_blank" rel="noreferrer"><Twitter size={20} color="var(--text-main)" /></a>}
                    </div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}><Save size={16} /> {t('mypage.save')}</button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><X size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={startEditing} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><Edit size={16} /> {t('mypage.edit')}</button>
                    <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}><LogOut size={16} /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SNS Share Section */}
      <div style={{ ...cardStyle, marginBottom: '2rem', border: '2px solid var(--accent)', background: 'linear-gradient(135deg, var(--surface) 0%, rgba(212, 175, 55, 0.05) 100%)' }}>
        <h2 style={cardTitleStyle}><Star size={20} /> {t('mypage.share_sns')}</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {t('mypage.share_desc')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              const shareUrl = window.location.origin + `/detail/${role}/${user?.id}`;
              const text = encodeURIComponent(`I'm active on DreamBridge! Check out my profile!\n`);
              window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
            }}
            className="btn" 
            style={{ backgroundColor: '#1DA1F2', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <Twitter size={18} /> {t('mypage.share_x')}
          </button>

          <button 
            onClick={async () => {
              const shareUrl = window.location.origin + `/detail/${role}/${user?.id}`;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: 'DreamBridge Profile',
                    text: 'Check out my profile!',
                    url: shareUrl,
                  });
                } catch (err) {
                  console.log('Share failed', err);
                }
              } else {
                navigator.clipboard.writeText(shareUrl);
                alert('URL copied! Please paste it in your Instagram story.');
              }
            }}
            className="btn" 
            style={{ backgroundColor: '#E4405F', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <Instagram size={18} /> {t('mypage.share_insta')}
          </button>

          <button 
            onClick={() => {
              const shareUrl = window.location.origin + `/detail/${role}/${user?.id}`;
              navigator.clipboard.writeText(shareUrl);
              alert('Profile URL copied!');
            }}
            className="btn btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <ExternalLink size={18} /> {t('mypage.copy_url')}
          </button>
        </div>
      </div>

      {/* Media Portfolio */}
      {isTalent && (
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}><Image size={20} /> {t('mypage.portfolio')}</h2>
          
          {/* Photos */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('mypage.photos')}</span>
              <button onClick={() => photoInputRef.current?.click()} style={addMediaBtnStyle}><Plus size={14} /> {t('mypage.add')}</button>
              <input type="file" ref={photoInputRef} onChange={e => e.target.files?.[0] && uploadMedia(e.target.files[0], 'avatars', 'photos')} accept="image/*" style={{ display: 'none' }} />
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {currentUser?.photos?.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <button onClick={() => deleteMedia(url, 'photos')} style={deleteBtnStyle}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Videos & Audios (Disabled during Beta to preserve storage) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', opacity: 0.6 }}>
            <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('mypage.videos')}</h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('mypage.coming_soon_official')}</p>
            </div>
            <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('mypage.audios')}</h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('mypage.coming_soon_official')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer (Simplified) */}
      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.6 }}>
        <p style={{ fontSize: '0.75rem' }}>© 2026 DreamBridge</p>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = { backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: '2rem' };
const quickLinkStyle: React.CSSProperties = { 
  backgroundColor: 'var(--surface)', 
  borderRadius: 'var(--radius-md)', 
  padding: '1.25rem 0.5rem', 
  border: '1px solid var(--border)', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: '0.75rem', 
  cursor: 'pointer',
  transition: 'transform 0.2s, background-color 0.2s',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--text-main)',
  boxShadow: 'var(--shadow-sm)'
};
const cardTitleStyle: React.CSSProperties = { fontSize: '1.125rem', marginBottom: '1.25rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const inputStyle: React.CSSProperties = { padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', fontSize: '0.9375rem', backgroundColor: 'var(--background)', color: 'var(--text-main)' };
const cameraButtonStyle: React.CSSProperties = { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--accent)', color: 'var(--secondary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' };
const addMediaBtnStyle: React.CSSProperties = { backgroundColor: 'var(--accent)', color: 'var(--secondary)', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' };
const deleteBtnStyle: React.CSSProperties = { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

export default MyPage;
