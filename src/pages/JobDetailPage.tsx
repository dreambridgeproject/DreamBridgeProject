import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import type { Job } from '../types';

// Read-only view of a single posted job. Currently linked from the casting
// company's own job management list ("詳細確認"); not the apply flow, which
// stays inline on JobsPage.tsx.
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (data) {
        setJob({
          id: data.id,
          castingId: data.casting_id,
          title: data.title,
          skillTags: data.skill_tags || [],
          reward: data.reward,
          location: data.location,
          deadline: data.deadline,
          description: data.description,
          status: data.status,
          isPublic: data.is_public,
          createdAt: data.created_at
        });
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('mypage.loading')}</div>;
  if (!job) return <div className="container" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-main)' }}>{t('search.no_results')}</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '700px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <ChevronLeft size={18} /> {t('detail.back')}
      </button>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{job.title}</h1>
          <span style={{
            padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700,
            backgroundColor: job.status === 'open' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: job.status === 'open' ? '#10b981' : '#ef4444'
          }}>
            {job.status === 'open' ? t('job.manage_recruiting') : t('job.manage_ended')}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {job.skillTags.map(tag => (
            <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 800 }}>#{tag}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
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

        <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
          {job.description}
        </p>
      </div>
    </div>
  );
};

export default JobDetailPage;
