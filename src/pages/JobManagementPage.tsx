import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { Briefcase, User, Check, X, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Job, Profile } from '../types';

interface ExtendedApplication {
  id: string;
  job_id: string;
  talent_id: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  talent: Profile;
  job: Job;
}

const JobManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, currentUser } = useUser();
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<ExtendedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    // Fetch my jobs
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .eq('casting_id', user.id)
      .order('created_at', { ascending: false });

    if (jobsData) {
      setMyJobs(jobsData.map((j: any) => ({
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
      })));
    }

    // Fetch applications for my jobs
    const { data: appsData } = await supabase
      .from('job_applications')
      .select(`
        *,
        talent:profiles!job_applications_talent_id_fkey(*),
        job:jobs!job_applications_job_id_fkey(*)
      `)
      .order('applied_at', { ascending: false });

    // Filter applications for jobs owned by me manually because Supabase join filtering can be complex
    if (appsData && jobsData) {
      const myJobIds = jobsData.map((j: any) => j.id);
      const filteredApps = appsData
        .filter((app: any) => myJobIds.includes(app.job_id))
        .map((app: any) => ({
          ...app,
          job: {
            id: app.job.id,
            title: app.job.title,
            // ... other fields if needed
          }
        }));
      setApplications(filteredApps);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (appId: string, status: 'approved' | 'rejected', talentId: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', appId);

    if (error) {
      alert(t('job.manage_update_fail') + ': ' + error.message);
    } else {
      if (status === 'approved') {
        // Create an "offer" or "chat room" automatically
        await supabase.from('offers').insert({
          sender_id: user?.id,
          receiver_id: talentId,
          status: 'approved',
          message: t('job.manage_chat_welcome')
        });
        alert(t('job.manage_approve_success'));
      } else {
        alert(t('job.manage_reject_success'));
      }
      fetchData();
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId);

    if (error) {
      alert(t('job.manage_update_fail'));
    } else {
      fetchData();
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('mypage.loading')}</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('job.management')}</h1>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '2rem' }}>
          <button 
            onClick={() => setActiveTab('jobs')}
            style={{ 
              padding: '1rem 0', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'jobs' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'jobs' ? '2px solid var(--accent)' : 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t('job.manage_tab_posted')} ({myJobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('applicants')}
            style={{ 
              padding: '1rem 0', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'applicants' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'applicants' ? '2px solid var(--accent)' : 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t('job.manage_tab_applicants')} ({applications.length})
          </button>
        </div>
      </header>

      {activeTab === 'jobs' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: '1rem' }}>
              {t('job.manage_no_jobs')}
            </div>
          ) : (
            myJobs.map(job => (
              <div key={job.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{job.title}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {t('job.deadline_label')}: {job.deadline} | {t('job.manage_status')}: 
                    <span style={{ color: job.status === 'open' ? '#10b981' : '#ef4444', fontWeight: 700, marginLeft: '0.25rem' }}>
                      {job.status === 'open' ? t('job.manage_recruiting') : t('job.manage_ended')}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleToggleJobStatus(job.id, job.status)} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>
                    {job.status === 'open' ? t('job.manage_stop_btn') : t('job.manage_restart_btn')}
                  </button>
                  <button onClick={() => navigate(`/detail/casting/${job.id}`)} className="btn btn-surface" style={{ fontSize: '0.75rem' }}>
                    {t('job.manage_detail_btn')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: '1rem' }}>
              {t('job.manage_no_applicants')}
            </div>
          ) : (
            applications.map(app => (
              <div key={app.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={app.talent.avatar_url || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{app.talent.full_name || app.talent.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{t('job.manage_target_job')}: {app.job.title}</div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    backgroundColor: app.status === 'approved' ? '#10b98122' : (app.status === 'rejected' ? '#ef444422' : 'var(--background)'),
                    color: app.status === 'approved' ? '#10b981' : (app.status === 'rejected' ? '#ef4444' : 'var(--text-muted)')
                  }}>
                    {app.status === 'pending' ? t('job.manage_status_pending') : (app.status === 'approved' ? t('job.manage_status_approved') : t('job.manage_status_rejected'))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => navigate(`/detail/talent/${app.talent_id}`)} className="btn btn-outline" style={{ flex: 1, fontSize: '0.875rem' }}>
                    <User size={16} /> {t('job.manage_profile_btn')}
                  </button>
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(app.id, 'approved', app.talent_id)} className="btn btn-primary" style={{ flex: 1, fontSize: '0.875rem', backgroundColor: '#10b981' }}>
                        <Check size={16} /> {t('job.manage_approve_btn')}
                      </button>
                      <button onClick={() => handleUpdateStatus(app.id, 'rejected', app.talent_id)} className="btn" style={{ flex: 1, fontSize: '0.875rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <X size={16} /> {t('job.manage_reject_btn')}
                      </button>
                    </>
                  )}
                  {app.status === 'approved' && (
                    <button onClick={() => navigate('/chat')} className="btn btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}>
                      <MessageSquare size={16} /> {t('job.manage_chat_btn')}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;
