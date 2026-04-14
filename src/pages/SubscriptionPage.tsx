import React from 'react';
import { useUser } from '../context/UserContext';
import { Check, Zap, Award, Building2, CreditCard } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { role } = useUser();

  const isTalent = role === 'talent';

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>プラン選択</h1>
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
          ベータ期間：フリープラン提供中
        </div>
        <p style={{ color: 'var(--text-muted)' }}>安全なマッチングのため、現在は制限付きのフリープランのみご利用いただけます。</p>
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
            {/* Talent Plans - Stay Free */}
            <div style={planCardStyle}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>フリー</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>¥0</div>
              <ul style={featureListStyle}>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> プロフィール作成</li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> 事務所からのオファー受信</li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> チャット機能（制限なし）</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} disabled>現在のプラン</button>
            </div>

            <div style={{ ...planCardStyle, opacity: 0.6 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>上位表示プラン</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>¥980 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ 月</span></div>
              <p style={{ fontSize: '0.875rem' }}>正式リリース時に提供開始予定</p>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} disabled>近日公開</button>
            </div>
          </>
        ) : (
          <>
            {/* Agency Plans - Restricted */}
            <div style={planCardStyle}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>フリー（ベータ）</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>¥0</div>
              <ul style={featureListStyle}>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> <strong>月間3件までのオファー</strong></li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> 志望者検索機能</li>
                <li style={featureItemStyle}><Check size={18} color="var(--accent)" /> 基本的なチャット機能</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} disabled>現在のプラン</button>
            </div>

            <div style={{ ...planCardStyle, opacity: 0.6 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>スタンダード</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>¥19,800 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ 月</span></div>
              <p style={{ fontSize: '0.875rem' }}>本人確認・審査完了後に開放予定</p>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} disabled>近日公開</button>
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
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>お支払い方法（正式リリース後）</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '2rem', 
          marginBottom: '2rem',
          color: 'var(--text-main)',
          opacity: 0.6
        }}>
          <div style={paymentIconStyle}><CreditCard size={24} /><span style={{ fontSize: '0.75rem' }}>カード</span></div>
          <div style={paymentIconStyle}><Zap size={24} /><span style={{ fontSize: '0.75rem' }}>PayPay</span></div>
          <div style={paymentIconStyle}><Award size={24} /><span style={{ fontSize: '0.75rem' }}>キャリア決済</span></div>
          <div style={paymentIconStyle}><div style={{ fontWeight: 800 }}>Pay</div><span style={{ fontSize: '0.75rem' }}>Apple/Google</span></div>
          <div style={paymentIconStyle}><Building2 size={24} /><span style={{ fontSize: '0.75rem' }}>銀行振込</span></div>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          ※現在ベータ版のため決済は行われません。正式リリース後にStripeを介した安全な決済システムを導入予定です。
        </p>
      </div>
    </div>
  );
};

const paymentIconStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  opacity: 0.8
};

const planCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  borderRadius: 'var(--radius-lg)',
  padding: '2rem',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

const featureListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 2rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const featureItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9375rem'
};

const recommendBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-12px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'var(--accent)',
  color: 'var(--secondary)',
  padding: '0.25rem 1rem',
  borderRadius: '1rem',
  fontSize: '0.75rem',
  fontWeight: 800,
  textTransform: 'uppercase'
};

export default SubscriptionPage;
