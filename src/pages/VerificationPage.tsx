import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, Upload, CheckCircle2, 
  ChevronRight, AlertCircle, Building2, User, CreditCard
} from 'lucide-react';

const VerificationPage: React.FC = () => {
  const { role, currentUser, loading, updateProfile, user } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    birthDate: '',
    corporateId: '',
    corporateSite: '',
    docUrl: '',
    parentName: '',
    parentContact: ''
  });

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-main)' }}>{t('mypage.loading')}</div>;
  if (!role || !user) {
    navigate('/login');
    return null;
  }

  const isTalent = role === 'talent';
  const age = formData.birthDate ? Math.floor((new Date().getTime() - new Date(formData.birthDate).getTime()) / 3.15576e+10) : 20;
  const isMinor = isTalent && age < 18;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Using avatars bucket for now as we know it exists
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({ ...formData, docUrl: publicUrl });
      alert(t('mypage.upload_success'));
    } catch (error: any) {
      alert('Upload Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updates: any = {
        verification_status: 'reviewing',
        verification_doc_url: formData.docUrl
      };

      if (isTalent && isMinor) {
        updates.parental_consent_name = formData.parentName;
        updates.parental_consent_contact = formData.parentContact;
      }

      await updateProfile(updates);
      setIsSubmitted(true);
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '500px', color: 'var(--text-main)' }}>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
          <CheckCircle2 size={48} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t('verify.success')}</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {t('verify.success_desc')}
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/mypage')} style={{ width: '100%' }}>
          {t('detail.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', color: 'var(--text-main)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> {t('detail.back')}
        </button>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          {isTalent ? t('verify.title_talent') : t('verify.title_agency')}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {isTalent ? t('verify.subtitle_talent') : t('verify.subtitle_agency')}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: '4px', backgroundColor: step >= i ? 'var(--accent)' : 'var(--border)', borderRadius: '2px' }} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div style={stepContainerStyle}>
            <h2 style={stepTitleStyle}>
              {isTalent ? <User size={20} /> : <Building2 size={20} />} 
              {t('verify.step1')}
            </h2>
            {isTalent ? (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t('mypage.full_name')}</label>
                  <input 
                    type="text" 
                    placeholder="名前 太郎" 
                    value={currentUser?.full_name || ''} 
                    style={{ ...inputStyle, opacity: 0.6 }} 
                    disabled 
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t('verify.birth_date')}</label>
                  <input 
                    type="date" 
                    style={inputStyle} 
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    required 
                  />
                </div>
                {isMinor && (
                  <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent)', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '1rem' }}>【未成年の方】保護者の同意が必要です</p>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>保護者氏名</label>
                      <input 
                        type="text" 
                        placeholder="保護者 太郎" 
                        style={inputStyle} 
                        value={formData.parentName}
                        onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                        required 
                      />
                    </div>
                    <div style={{ ...inputGroupStyle, marginBottom: 0 }}>
                      <label style={labelStyle}>保護者の連絡先 (電話番号/メール)</label>
                      <input 
                        type="text" 
                        placeholder="090-xxxx-xxxx" 
                        style={inputStyle} 
                        value={formData.parentContact}
                        onChange={e => setFormData({ ...formData, parentContact: e.target.value })}
                        required 
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t('verify.corporate_id')}</label>
                  <input 
                    type="text" 
                    placeholder="1234567890123" 
                    style={inputStyle} 
                    value={formData.corporateId}
                    onChange={e => setFormData({ ...formData, corporateId: e.target.value })}
                    required 
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t('verify.corporate_site')}</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com" 
                    style={inputStyle} 
                    value={formData.corporateSite}
                    onChange={e => setFormData({ ...formData, corporateSite: e.target.value })}
                    required 
                  />
                </div>
              </>
            )}
            <button type="button" className="btn btn-primary" onClick={() => setStep(2)} style={{ width: '100%', marginTop: '1rem' }}>
              {t('verify.next')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={stepContainerStyle}>
            <h2 style={stepTitleStyle}><FileText size={20} /> {t('verify.step2')}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {isTalent ? t('verify.doc_desc_talent') : t('verify.doc_desc_agency')}
            </p>
            <div 
              style={{ ...uploadBoxStyle, borderColor: formData.docUrl ? '#10b981' : 'var(--border)' }}
              onClick={() => document.getElementById('doc-upload')?.click()}
            >
              {formData.docUrl ? <CheckCircle2 size={32} color="#10b981" /> : <Upload size={32} />}
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {isUploading ? t('auth.sending') : formData.docUrl ? 'アップロード完了' : t('verify.upload_box')}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('verify.upload_hint')}</span>
              <input 
                type="file" 
                id="doc-upload" 
                onChange={handleFileUpload} 
                accept="image/*,application/pdf" 
                style={{ display: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>{t('detail.back')}</button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setStep(3)} 
                disabled={!formData.docUrl || isUploading}
                style={{ flex: 2, opacity: (!formData.docUrl || isUploading) ? 0.6 : 1 }}
              >
                {t('verify.next')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={stepContainerStyle}>
            <h2 style={stepTitleStyle}><CreditCard size={20} /> {t('verify.step3')}</h2>
            <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={reviewItemStyle}>
                <span>{isTalent ? t('verify.review_name_talent') : t('verify.review_name_agency')}</span>
                <strong>{isTalent ? (currentUser?.full_name || t('mypage.not_set')) : (formData.corporateId || 'Sample Co., Ltd.')}</strong>
              </div>
              <div style={reviewItemStyle}>
                <span>{t('verify.review_doc')}</span>
                <strong>{formData.docUrl ? 'uploaded_document' : '未完了'}</strong>
              </div>
              {isMinor && (
                <>
                  <div style={reviewItemStyle}>
                    <span>保護者名</span>
                    <strong>{formData.parentName}</strong>
                  </div>
                  <div style={reviewItemStyle}>
                    <span>保護者連絡先</span>
                    <strong>{formData.parentContact}</strong>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <AlertCircle size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {t('verify.warning')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)} style={{ flex: 1 }}>{t('detail.back')}</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{t('verify.submit')}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const stepContainerStyle: React.CSSProperties = { backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' };
const stepTitleStyle: React.CSSProperties = { fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const inputGroupStyle: React.CSSProperties = { marginBottom: '1.5rem' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)' };
const uploadBoxStyle: React.CSSProperties = { border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'border-color 0.2s ease' };
const reviewItemStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' };

export default VerificationPage;
