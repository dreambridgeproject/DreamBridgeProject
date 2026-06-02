import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { Briefcase, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Job } from '../types';

interface UserApplication {
  id: string;
  job_id: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  job: Job;
}

const JobApplicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!user) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('talent_id', user.id)
        .order('applied_at', { ascending: false });

      if (data) {
        setApplications(data.map((app: any) => ({
          ...app,
          job: {
            id: app.job.id,
            title: app.job.title,
            reward: app.job.reward,
            location: app.job.location,
            deadline: app.job.deadline
          }
        })));
      }
      if (error) console.error('Error fetching applications:', error);
      setLoading(false);
    };

    fetchMyApplications();
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('mypage.loading')}</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('job.application_list')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('job.app_subtitle')}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>{t('job.app_no_apps')}</p>
            <button onClick={() => navigate('/jobs')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>{t('job.app_find_btn')}</button>
          </div>
        ) : (
          applications.map(app => (
            <div 
              key={app.id} 
              style={{ 
                backgroundColor: 'var(--surface)', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{app.job.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{t('job.reward_label')}: {app.job.reward}</span>
                  <span>{t('job.location_label')}: {app.job.location}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: app.status === 'approved' ? '#10b981' : (app.status === 'rejected' ? '#ef4444' : 'var(--accent)')
                  }}>
                    {app.status === 'approved' ? <CheckCircle size={16} /> : (app.status === 'rejected' ? <XCircle size={16} /> : <Clock size={16} />)}
                    {app.status === 'approved' ? t('job.app_status_approved') : (app.status === 'rejected' ? t('job.app_status_rejected') : t('job.app_status_pending'))}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {t('job.app_date_label')}: {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {app.status === 'approved' && (
                    <button onClick={() => navigate('/chat')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                      <MessageSquare size={16} /> {t('job.app_chat_btn')}
                    </button>
                  )}
                  <button onClick={() => navigate(`/detail/casting/${app.job_id}`)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    {t('job.app_detail_btn')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;
