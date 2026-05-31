import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { Briefcase, MapPin, Calendar, Clock, Search, Filter, Plus } from 'lucide-react';
import { SKILL_TAGS } from '../data/mock';
import type { Job, SkillTag } from '../types';
import { supabase } from '../lib/supabase';

const JobsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, currentUser } = useUser();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<SkillTag[]>([]);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterReward, setFilterReward] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const locations = ['東京都', '神奈川県', '大阪府', '愛知県', '福岡県', '北海道', '千葉県', '埼玉県', '兵庫県', '京都府'];

  const fetchJobs = async () => {
    setLoading(true);
    const now = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .gte('deadline', now)
      .order('created_at', { ascending: false });
    
    if (data) {
      const mappedJobs = data.map((j: any) => ({
        id: j.id,
        castingId: j.casting_id,
        title: j.title,
        skillTags: j.skill_tags || [],
        reward: j.reward,
        location: j.location,
        deadline: j.deadline,
        description: j.description,
        status: j.status,
        isPublic: j.is_public,
        createdAt: j.created_at
      }));
      setJobs(mappedJobs);
    }
    if (error) console.error('Error fetching jobs:', error);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => job.skillTags.includes(tag));
    const matchesLocation = !filterLocation || job.location.includes(filterLocation);
    const matchesReward = !filterReward || job.reward.includes(filterReward);
    return matchesSearch && matchesTags && matchesLocation && matchesReward;
  });

  const handleApply = async (jobId: string) => {
    if (!user) {
      alert(t('job.need_login'));
      return;
    }

    if (currentUser?.role !== 'talent') {
      alert(t('job.only_talent'));
      return;
    }

    if (currentUser?.affiliation_status === 'affiliated') {
      alert(t('job.restricted_talent'));
      return;
    }

    setApplyingId(jobId);
    
    const { error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        talent_id: user.id,
        status: 'pending'
      });

    setApplyingId(null);

    if (error) {
      if (error.code === '23505') {
        alert(t('job.already_applied'));
      } else {
        alert(t('job.apply_fail') + ': ' + error.message);
      }
    } else {
      alert(t('job.apply_success'));
    }
  };

  const toggleTag = (tag: SkillTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const isCasting = currentUser?.role === 'casting';
  const isVerified = currentUser?.verification_status === 'verified';

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('job.title')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('job.subtitle')}</p>
        </div>
        {isCasting && (
          <button 
            onClick={() => setShowPostModal(true)}
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> {t('job.post')}
          </button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 992 ? '300px 1fr' : '1fr', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder={t('job.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-main)'
              }} 
            />
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              <MapPin size={18} /> {t('job.filter_area_reward')}
            </div>
            <select 
              value={filterLocation} 
              onChange={e => setFilterLocation(e.target.value)}
              style={{ ...modalInputStyle, marginBottom: '0.75rem', fontSize: '0.875rem' }}
            >
              <option value="">{t('job.filter_all_locations')}</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <input 
              type="text" 
              placeholder={t('job.filter_reward_placeholder')} 
              value={filterReward}
              onChange={e => setFilterReward(e.target.value)}
              style={{ ...modalInputStyle, fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              <Filter size={18} /> {t('job.filter_skill_genre')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SKILL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedTags.includes(tag) ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: selectedTags.includes(tag) ? 'var(--accent)' : 'transparent',
                    color: selectedTags.includes(tag) ? 'var(--secondary)' : 'var(--text-main)',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            { (selectedTags.length > 0 || filterLocation || filterReward) && (
              <button 
                onClick={() => {
                  setSelectedTags([]);
                  setFilterLocation('');
                  setFilterReward('');
                }}
                style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
              >
                {t('job.filter_clear')}
              </button>
            )}
          </div>
        </aside>

        {/* Job List */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>{t('mypage.loading')}</div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)' }}>{t('job.no_jobs')}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  style={{ 
                    backgroundColor: 'var(--surface)', 
                    padding: '1.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>{job.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        {job.skillTags.map(tag => (
                          <span key={tag} style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 800 }}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                      color: '#10b981', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      {t('job.recruiting')}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} /> {t('job.reward_label')}: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{job.reward}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} /> {t('job.location_label')}: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{job.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} /> {t('job.deadline_label')}: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{job.deadline}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(job.id);
                      }}
                      disabled={applyingId === job.id}
                    >
                      {applyingId === job.id ? t('job.applying') : t('job.apply')}
                    </button>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => navigate(`/detail/casting/${job.castingId}`)}
                    >
                      {t('job.view_detail')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showPostModal && <PostJobModal onClose={() => setShowPostModal(false)} onRefresh={fetchJobs} />}
    </div>
  );
};

const PostJobModal: React.FC<{ onClose: () => void, onRefresh: () => void }> = ({ onClose, onRefresh }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    reward: '',
    location: '',
    deadline: '',
    description: '',
    skillTags: [] as SkillTag[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('jobs')
      .insert({
        casting_id: user.id,
        title: formData.title,
        reward: formData.reward,
        location: formData.location,
        deadline: formData.deadline,
        description: formData.description,
        skill_tags: formData.skillTags,
        status: 'open',
        is_public: true
      });

    setLoading(false);
    if (error) {
      alert('投稿に失敗しました: ' + error.message);
    } else {
      alert('案件を投稿しました！');
      onRefresh();
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{t('job.post_title')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder={t('job.form_title')} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={modalInputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" placeholder={t('job.form_reward')} value={formData.reward} onChange={e => setFormData({...formData, reward: e.target.value})} style={modalInputStyle} />
            <input type="text" placeholder={t('job.form_location')} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={modalInputStyle} />
          </div>
          <input type="date" placeholder={t('job.form_deadline')} required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} style={modalInputStyle} />
          <textarea placeholder={t('job.form_description')} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...modalInputStyle, minHeight: '150px' }} />
          
          <div>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>{t('job.form_tags_label')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SKILL_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const newList = formData.skillTags.includes(tag) ? formData.skillTags.filter(t => t !== tag) : [...formData.skillTags, tag];
                    setFormData({...formData, skillTags: newList});
                  }}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '2rem',
                    fontSize: '0.7rem',
                    border: '1px solid',
                    borderColor: formData.skillTags.includes(tag) ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: formData.skillTags.includes(tag) ? 'var(--accent)' : 'transparent',
                    color: formData.skillTags.includes(tag) ? 'var(--secondary)' : 'var(--text-main)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? t('job.posting') : t('job.post_btn')}</button>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>{t('mypage.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalInputStyle = {
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--background)',
  color: 'var(--text-main)',
  width: '100%'
};

export default JobsPage;
