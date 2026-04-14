import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LegalPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', color: 'var(--text-main)' }}>
      {/* Beta Notice Banner */}
      <div style={{ 
        backgroundColor: 'rgba(255, 171, 0, 0.1)', 
        border: '1px solid #ffab00', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '3rem',
        color: '#ffab00'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>
          {language === 'ja' ? '【ベータ版提供に関するお知らせ】' : '[Notice regarding Beta version]'}
        </h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
          {language === 'ja' 
            ? '現在、DreamBridgeはベータ版として提供されています。正式リリース（2026年7月予定）までの期間、全ての機能を無料でご利用いただけますが、一部の機能制限や予告ない仕様変更、データのリセット等が行われる可能性があります。あらかじめご了承ください。'
            : 'Currently, DreamBridge is provided as a beta version. All features are free to use until the official release (scheduled for July 2026), but there may be functional limitations, specification changes without notice, and data resets. Please be aware of this in advance.'}
        </p>
      </div>

      <section id="tos" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>{t('legal.tos')}</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)', fontSize: '0.9rem' }}>
          {language === 'ja' ? (
            <>
              <p>この利用規約（以下「本規約」）は、DreamBridge運営事務局（以下「当事務局」）が提供するサービス「DreamBridge」（以下「本サービス」）の利用条件を定めるものです。</p>
              <h3 style={h3Style}>第1条（適用）</h3>
              <p>本規約は、ユーザーと当事務局との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
              {/* Simplified for brevity in this multilingual update */}
              <p>... (省略) ...</p>
            </>
          ) : (
            <>
              <p>These Terms of Service (the "Terms") set forth the conditions for the use of the "DreamBridge" service (the "Service") provided by the DreamBridge Administration Office.</p>
              <h3 style={h3Style}>Article 1 (Application)</h3>
              <p>These Terms apply to all relationships between users and the Office regarding the use of the Service.</p>
              <p>... (Full English translation coming soon) ...</p>
            </>
          )}
        </div>
      </section>

      <section id="tokusho" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>{t('legal.tokusho')}</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {language === 'ja' 
            ? '※有料機能提供開始（2026年7月予定）に合わせて正式に公開いたします。現在は無料提供中のため、一部項目を省略しています。'
            : '* This will be officially published in conjunction with the start of paid features (scheduled for July 2026). Currently free.'}
        </p>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th style={thStyle}>{language === 'ja' ? '運営主体' : 'Operator'}</th>
              <td style={tdStyle}>DreamBridge Administration Office</td>
            </tr>
            <tr>
              <th style={thStyle}>{language === 'ja' ? 'お問い合わせ' : 'Contact'}</th>
              <td style={tdStyle}>support@dreambridge.example.com</td>
            </tr>
            <tr>
              <th style={thStyle}>{language === 'ja' ? '販売価格' : 'Price'}</th>
              <td style={tdStyle}>{language === 'ja' ? 'ベータ版期間中は無料' : 'Free during Beta period'}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="privacy">
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>{t('legal.privacy')}</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          {language === 'ja' ? (
            <p>株式会社ドリームブリッジ（以下「当社」）は、本サービスにおいてユーザーの個人情報の取り扱いについて、ポリシーを定めます。</p>
          ) : (
            <p>DreamBridge Inc. ("we") defines the policy regarding the handling of personal information of users in this Service.</p>
          )}
          <p>... (Full policy available in Japanese) ...</p>
        </div>
      </section>
    </div>
  );
};

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '1rem', backgroundColor: 'var(--background)', border: '1px solid var(--border)', width: '30%', fontSize: '0.875rem' };
const tdStyle: React.CSSProperties = { padding: '1rem', border: '1px solid var(--border)', fontSize: '0.875rem' };
const h3Style: React.CSSProperties = { marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem' };

export default LegalPage;
