import React from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { Check, Zap, Award, Building2, CreditCard } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { role } = useUser();
  const { t } = useLanguage();

  const isTalent = role === 'talent';

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('sub.title')}</h1>
        <div style={{ 
          display: 'inline-block',
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid #10b981', 
          padding: '0.5rem 1.5rem', 
          borderRadius: '2rem',
          color: '#10b981',
          fontSize: '0.875rem',
          fontWeight: 800,
          marginBottom: '1.5rem'
        }}>
          {t('sub.beta_notice')}
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{t('sub.beta_desc')}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        maxWidth: isTalent ? '800px' : '1200px',
        margin: '0 auto'
      }}>
        {isTalent ? (
          <>
            <div style={planCardStyle}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sub.free_plan')}</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>¥0</div>
              <ul style={featureListStyle}>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> Profile Creation</li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> Receive Offers</li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> Unlimited Chat</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} disabled>{t('sub.current_plan')}</button>
            </div>

            <div style={{ ...planCardStyle, opacity: 0.6 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sub.premium_plan')}</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>¥980 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ month</span></div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} disabled>{t('sub.coming_soon')}</button>
            </div>
          </>
        ) : (
          <>
            <div style={planCardStyle}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sub.agency_free')}</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>¥0</div>
              <ul style={featureListStyle}>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> <strong>Up to 3 offers/mo</strong></li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> Talent Search</li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> Basic Chat</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} disabled>{t('sub.current_plan')}</button>
            </div>

            <div style={{ ...planCardStyle, opacity: 0.6 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sub.agency_standard')}</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>¥19,800 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ month</span></div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} disabled>{t('sub.coming_soon')}</button>
            </div>
          </>
        )}
      </div>

      <div style={{ 
        marginTop: '4rem', 
        textAlign: 'center', 
        padding: '3rem 2rem', 
        backgroundColor: 'var(--surface)', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>{t('sub.payment_methods')}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', color: 'var(--text-main)', opacity: 0.6 }}>
          <div style={paymentIconStyle}><CreditCard size={24} /><span style={{ fontSize: '0.75rem' }}>Card</span></div>
          <div style={paymentIconStyle}><Zap size={24} /><span style={{ fontSize: '0.75rem' }}>PayPay</span></div>
          <div style={paymentIconStyle}><Award size={24} /><span style={{ fontSize: '0.75rem' }}>Carrier</span></div>
          <div style={paymentIconStyle}><div style={{ fontWeight: 800 }}>Pay</div><span style={{ fontSize: '0.75rem' }}>Apple/Google</span></div>
          <div style={paymentIconStyle}><Building2 size={24} /><span style={{ fontSize: '0.75rem' }}>Bank</span></div>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          ※ Currently in Beta. Stripe integration for secure payments coming soon at official release.
        </p>
      </div>
    </div>
  );
};

const paymentIconStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.8 };
const planCardStyle: React.CSSProperties = { backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' };
const featureListStyle: React.CSSProperties = { listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-main)' };
const featureItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' };

export default SubscriptionPage;
