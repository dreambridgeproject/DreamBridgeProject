import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Star, ShieldCheck, Zap, 
  MessageSquare, ChevronRight, Play, Camera, Tv, Palette, Mic2
} from 'lucide-react';
// Dramatic night shot of Tower Bridge glowing with golden lights
const heroImageUrl = 'https://images.unsplash.com/photo-1490642914619-7955a3fd483c?auto=format&fit=crop&w=1920&q=80';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--text-main)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '6rem 1rem 4rem',
        textAlign: 'center',
        background: `linear-gradient(rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.6)), url('${heroImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '2px solid var(--accent)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(212, 175, 55, 0.3)',
            color: 'var(--accent)',
            padding: '0.5rem 1.5rem',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            border: '2px solid var(--accent)',
            backdropFilter: 'blur(8px)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {t('landing.beta')}
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            wordBreak: language === 'ja' ? 'keep-all' : 'normal'
          }}>
            {t('landing.hero.title').split(/(ダイレクト|Directly)/).map((part, i) => 
              (part === 'ダイレクト' || part === 'Directly') 
                ? <React.Fragment key={i}><br /><span style={{ color: 'var(--accent)', display: 'inline-block' }}>{part}</span></React.Fragment> 
                : <span key={i} style={{ display: 'inline-block' }}>{part}</span>
            )}
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.25rem)',
            color: '#ffffff',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            padding: '0 1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontWeight: 500,
            wordBreak: language === 'ja' ? 'keep-all' : 'normal',
            overflowWrap: 'anywhere'
          }}>
            {t('landing.hero.subtitle')}
          </p>          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            padding: '0 1rem'
          }}>
            <button 
              onClick={() => navigate('/signup/talent')} 
              className="btn btn-primary" 
              style={{ padding: '1.25rem 2rem', fontSize: '1.125rem', minWidth: '200px', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)' }}
            >
              {t('landing.hero.talent_signup')} <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/signup/agency')} 
              className="btn btn-outline" 
              style={{ padding: '1.25rem 2rem', fontSize: '1.125rem', minWidth: '200px' }}
            >
              {t('landing.hero.agency_signup')}
            </button>
            <button 
              onClick={() => navigate('/signup/casting')} 
              className="btn btn-outline" 
              style={{ padding: '1.25rem 2rem', fontSize: '1.125rem', minWidth: '200px', borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              {t('auth.casting_signup')}
            </button>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>
      </section>

      {/* Target Audience Section */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '3rem' }}>
            {t('landing.audience_title').split(/(才能|機会|talents|opportunities)/).map((part, i) => 
              (part === '才能' || part === '機会' || part === 'talents' || part === 'opportunities') 
                ? <span key={i} style={{ color: 'var(--accent)' }}>{part}</span> 
                : part
            )}
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '1rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              { icon: <Star />, label: t('genre.idol') },
              { icon: <Camera />, label: t('genre.model') },
              { icon: <Play />, label: t('genre.actor') },
              { icon: <Mic2 />, label: t('genre.singer') },
              { icon: <Tv />, label: t('genre.liver') },
              { icon: <Palette />, label: t('genre.creator') },
              { icon: <ShieldCheck />, label: t('landing.genre.talent_agency') },
              { icon: <Zap />, label: t('genre.production') }
            ].map((item, i) => (
              <div key={i} style={{ 
                backgroundColor: 'var(--surface)', 
                padding: '2rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                textAlign: 'center',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>{t('landing.features.title')}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('landing.features.subtitle')}</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={featureCardStyle}>
              <div style={iconBoxStyle}><Zap size={24} /></div>
              <h3 style={{ marginBottom: '1rem' }}>{t('landing.features.direct.title')}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {t('landing.features.direct.desc')}
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={iconBoxStyle}><ShieldCheck size={24} /></div>
              <h3 style={{ marginBottom: '1rem' }}>{t('landing.features.secure.title')}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {t('landing.features.secure.desc')}
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={iconBoxStyle}><MessageSquare size={24} /></div>
              <h3 style={{ marginBottom: '1rem' }}>{t('landing.features.location.title')}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {t('landing.features.location.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beta CTA Section */}
      <section style={{ 
        padding: '6rem 1rem', 
        textAlign: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', marginBottom: '1.5rem' }}>{t('landing.cta.title')}</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            {language === 'ja' ? (
              <>現在、全ての機能を無料でご利用いただけます。<br />この機会にぜひベータ版をお試しください。</>
            ) : t('landing.cta.desc')}
          </p>
          <button 
            onClick={() => navigate('/signup/talent')} 
            className="btn btn-primary" 
            style={{ padding: '1.25rem 3rem', fontSize: '1.125rem', borderRadius: '3rem' }}
          >
            {t('landing.cta.btn')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '4rem 1rem', 
        backgroundColor: 'var(--secondary)', 
        borderTop: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>DreamBridge</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('footer.desc')}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/legal#tos" style={{ color: 'var(--text-main)', fontSize: '0.875rem', textDecoration: 'none' }}>{t('legal.tos')}</Link>
            <Link to="/legal#privacy" style={{ color: 'var(--text-main)', fontSize: '0.875rem', textDecoration: 'none' }}>{t('legal.privacy')}</Link>
            <Link to="/legal#specified" style={{ color: 'var(--text-main)', fontSize: '0.875rem', textDecoration: 'none' }}>{t('legal.tokusho')}</Link>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>© 2026 DreamBridge All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const featureCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--background)',
  padding: '2.5rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'transform 0.3s'
};

const iconBoxStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  backgroundColor: 'rgba(212, 175, 55, 0.1)',
  color: 'var(--accent)',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem'
};

export default LandingPage;
