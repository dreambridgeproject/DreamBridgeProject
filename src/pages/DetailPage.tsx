import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { logView } from '../lib/analytics';
import type { Profile } from '../types';
import {
  Heart, MapPin, ChevronLeft, ShieldCheck, Sparkles, Award,
  Lock, Image, Video, Music, Instagram, Twitter, Users
} from 'lucide-react';
import { shouldShowAttendanceScore } from '../lib/attendanceScore';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ type: 'talent' | 'agency' | 'casting'; id: string }>();
  const { currentUser, role, likes, toggleLike, sendOffer, offers, checkOfferLimit, robustInsertOffer } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [agency, setAgency] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [myJobs, setMyJobs] = useState<{ id: string; title: string }[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

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
    if (role === 'agency' || role === 'casting') checkLimit();
  }, [role, checkOfferLimit, offers.length]); // Re-check when offers change

  useEffect(() => {
    const fetchMyJobs = async () => {
      if (role !== 'casting' || !currentUser?.id) return;
      const { data } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('casting_id', currentUser.id)
        .eq('status', 'open');
      if (data) setMyJobs(data as any);
    };
    fetchMyJobs();
  }, [role, currentUser?.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
        
        // Fetch agency if affiliated
        if (data.agency_id) {
          const { data: agencyData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.agency_id)
            .single();
          if (agencyData) setAgency(agencyData as Profile);
        }

        // Log the view for AI analytics
        logView(currentUser?.id, id!, role || 'guest');
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
  const isAffiliated = !!(isTalentDetail && profile.affiliation_status === 'affiliated' && profile.agency_id);
  const isCastingDetail = profile.role === 'casting';
  
  // Restricted offer check - allow all roles during beta (limit handled by isLimitReached)
  const canSendOffer = !!role;
  const isOfferBlockedByAgency = isAffiliated && profile.accept_external_offers === false;

  const handleOffer = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!canSendOffer || isOfferBlockedByAgency) return;
    if (existingOffer) return;
    if (isLimitReached) {
      alert(t('detail.limit_reached'));
      return;
    }

    if (isAffiliated) {
      // Mediated offer
      const newMediatedOffer: any = {
        sender_id: currentUser.id,
        receiver_id: profile.id,
        sender_role: role || 'casting',
        mediator_id: profile.agency_id,
        job_id: selectedJobId || null,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      try {
        await (robustInsertOffer as any)(newMediatedOffer);
        alert(t('offer.send_success'));
        const reached = await checkOfferLimit();
        setIsLimitReached(reached);
      } catch (err: any) {
        alert(t('offer.send_fail') + (err.message ? ': ' + err.message : ''));
      }
    } else {
      try {
        await sendOffer(profile.id, selectedJobId || undefined);
        alert(t('offer.send_success'));
        const reached = await checkOfferLimit();
        setIsLimitReached(reached);
      } catch (err: any) {
        alert(t('offer.send_fail'));
      }
    }
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
            {profile.skill_review_status === 'approved' && (
              <div style={{ position: 'absolute', top: profile.verification_status === 'verified' ? '3rem' : '1rem', right: '1rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={14} /> {t('detail.skill_verified')}
              </div>
            )}
            {shouldShowAttendanceScore(profile) && (
              <div style={{
                position: 'absolute',
                top: `${1 + 2 * ([profile.verification_status === 'verified', profile.skill_review_status === 'approved'].filter(Boolean).length)}rem`,
                right: '1rem', backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}>
                <Award size={14} /> {t('detail.attendance_score')} {profile.attendance_score}%
              </div>
            )}
            {isAffiliated && (
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 700 }}>
                {t('mypage.affiliated')}
              </div>
            )}
          </div>
          {role === 'casting' && isTalentDetail && myJobs.length > 0 && !existingOffer && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>{t('detail.select_job_label')}</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)' }}
              >
                <option value="">{t('detail.select_job_none')}</option>
                {myJobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
          )}
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
                disabled={!!existingOffer || !canSendOffer || isLimitReached || isOfferBlockedByAgency}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', opacity: (existingOffer || !canSendOffer || isLimitReached || isOfferBlockedByAgency) ? 0.6 : 1 }}
              >
                {!canSendOffer && <Lock size={20} />} 
                {existingOffer ? t('detail.offered') : isLimitReached ? t('detail.limit_reached_btn') : isOfferBlockedByAgency ? t('detail.offer_stopped') : isAffiliated ? t('detail.offer_via_agency') : t('detail.send_offer')}
              </button>
              {(!canSendOffer || isLimitReached || isOfferBlockedByAgency) && (
                <p style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', color: 'var(--accent)' }}>
                  {isOfferBlockedByAgency ? t('detail.offer_stopped_desc') : isLimitReached ? t('detail.limit_reached_desc') : t('detail.restricted_offer')}
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
            {profile.skill_review_status === 'approved' && <Sparkles size={24} style={{ color: '#3b82f6' }} />}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} /> {profile.location || t('mypage.location')}
            </p>
            {isAffiliated && agency && (
              <p style={{ color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} /> {agency.full_name || agency.name} {t('detail.affiliated_with')}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {profile.genres?.map(g => (
              <span key={g} style={{ backgroundColor: 'var(--background)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', border: '1px solid var(--border)', fontWeight: 600 }}>
                {g}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {isCastingDetail ? (
              <section>
                <h2 style={sectionTitleStyle}>{t('auth.business_content')}</h2>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.company_description || t('detail.no_bio')}</p>
                <h2 style={{ ...sectionTitleStyle, marginTop: '2rem' }}>{t('auth.contact_info')}</h2>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.contact_info || t('detail.no_bio')}</p>
                <h2 style={{ ...sectionTitleStyle, marginTop: '2rem' }}>{t('auth.past_works')}</h2>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.past_works || t('detail.no_bio')}</p>
              </section>
            ) : (
              <section>
                <h2 style={sectionTitleStyle}>{t(isTalentDetail ? 'detail.bio_title_talent' : 'detail.bio_title_agency')}</h2>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.bio || t('detail.no_bio')}</p>
              </section>
            )}

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
