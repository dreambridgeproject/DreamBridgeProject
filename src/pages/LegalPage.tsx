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
            ? '現在、DreamBridgeはベータ版として提供されています。ベータ版の提供期間中、全ての機能を無料でご利用いただけますが、一部の機能制限や予告ない仕様変更、データのリセット等が行われる可能性があります。あらかじめご了承ください。'
            : 'Currently, DreamBridge is provided as a beta version. All features are free to use during the beta period, but there may be functional limitations, specification changes without notice, and data resets. Please be aware of this in advance.'}
        </p>
      </div>

      <section id="tos" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>{t('legal.tos')}</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)', fontSize: '0.9rem' }}>
          {language === 'ja' ? (
            <>
              <p>この利用規約（以下「本規約」）は、DreamBridge（以下「当サービス」）が提供するサービス「DreamBridge」の利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。</p>
              <h3 style={h3Style}>第1条（適用）</h3>
              <p>本規約は、ユーザーとDreamBridgeとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
              <h3 style={h3Style}>第2条（利用登録）</h3>
              <p>1. 登録希望者がDreamBridgeの定める方法によって利用登録を申請し、DreamBridgeがこれを承認することによって、利用登録が完了するものとします。</p>
              <p>2. ユーザーは、本サービスにプロフィール写真を登録した場合、当該写真が本サービス内において他のユーザーに対して表示されることにあらかじめ同意するものとします。</p>

              <h3 style={h3Style}>第4条（本サービスの提供の停止等）</h3>
              <p>当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
              <ul>
                <li>本サービスに係るコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当サービスが提供が困難と判断した場合</li>
              </ul>

              <h3 style={h3Style}>第5条（サービス内容の変更・終了）</h3>
              <p>当サービスは、ユーザーに通知することなく、本サービスの内容を変更し、または本サービスの提供を中止・終了することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>

              <h3 style={h3Style}>第6条（免責事項）</h3>
              <p>1. 当サービスは、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。</p>
              <p>2. 当サービスは、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当サービスとユーザーとの間の契約（本規約を含みます）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</p>
              <p>3. 前項ただし書に定める場合であっても、当サービスは、当サービスの過失（重過失を除きます）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害について、一切の責任を負いません。</p>

              <h3 style={h3Style}>第7条（投稿コンテンツの権利帰属）</h3>
              <p>1. ユーザーが本サービスを利用して投稿またはアップロードしたテキスト、画像その他のコンテンツ（以下「投稿コンテンツ」）の著作権は、当該ユーザーに帰属します。</p>
              <p>2. ユーザーは、当サービスに対し、本サービスの運営、改善、宣伝等のために必要な範囲で、投稿コンテンツを無償で利用（複製、翻案、公衆送信等を含みます）することを許諾するものとします。</p>

              <h3 style={h3Style}>第8条（準拠法・裁判管轄）</h3>
              <p>1. 本規約の解釈にあたっては、日本法を準拠法とします。</p>
              <p>2. 本サービスに関して紛争が生じた場合には、当サービスの所在地を管轄する裁判所を専属的合意管轄とします。</p>
            </>
          ) : (
            <>
              <p>These Terms of Service (the "Terms") set forth the conditions for the use of the "DreamBridge" service (the "Service") provided by DreamBridge. Registered users shall use the Service in accordance with these Terms.</p>
              <h3 style={h3Style}>Article 1 (Application)</h3>
              <p>These Terms apply to all relationships between users and DreamBridge regarding the use of the Service.</p>
              <h3 style={h3Style}>Article 2 (Registration)</h3>
              <p>1. Registration is completed when an applicant applies for registration by the method prescribed by DreamBridge and DreamBridge approves the application.</p>
              <p>2. By registering a profile picture on this Service, the user consents in advance to the display of said picture to other users within the Service.</p>

              <h3 style={h3Style}>Article 3 (Prohibited Actions)</h3>
              <p>In using the Service, users shall not engage in any of the following acts:</p>
              <ul>
                <li>Acts that violate laws or public order and morals</li>
                <li>Acts related to criminal activities</li>
                <li>Acts that infringe on copyrights, trademarks, or other intellectual property rights (including the act of reposting or publishing screenshots of the Service on external SNS or websites without the permission of the right holder)</li>
                <li>Acts that destroy or interfere with the functions of DreamBridge's or third parties' servers or networks</li>
                <li>Commercial use of information obtained through the Service</li>
                <li>Other acts deemed inappropriate by DreamBridge</li>
              </ul>

              <h3 style={h3Style}>Article 4 (Suspension of the Service)</h3>
              <p>The Service may suspend or interrupt the provision of all or part of the Service without prior notice to users in any of the following cases:</p>
              <ul>
                <li>When performing maintenance, inspection, or updating of computer systems related to the Service</li>
                <li>When provision of the Service becomes difficult due to force majeure such as earthquakes, lightning, fire, power outages, or natural disasters</li>
                <li>When computers or communication lines are stopped due to an accident</li>
                <li>In other cases where the Service deems it difficult to provide the Service</li>
              </ul>

              <h3 style={h3Style}>Article 5 (Change and Termination of Service)</h3>
              <p>The Service may change the contents of the Service or stop or terminate the provision of the Service without notice to users, and shall not be liable for any damages caused to users as a result.</p>

              <h3 style={h3Style}>Article 6 (Disclaimer of Warranties and Liability)</h3>
              <p>1. The Service does not guarantee, either expressly or impliedly, that the Service is free from factual or legal defects (including defects related to safety, reliability, accuracy, completeness, effectiveness, fitness for a particular purpose, security, errors, bugs, or infringement of rights).</p>
              <p>2. The Service shall not be liable for any damages caused to users arising from the Service. However, if the contract between the Service and the user (including these Terms) regarding the Service constitutes a consumer contract as defined in the Consumer Contract Act, this disclaimer shall not apply.</p>
              <p>3. Even in the case stipulated in the proviso of the preceding paragraph, the Service shall not be liable for damages arising from special circumstances among damages caused to users due to default or tort by the Service's negligence (excluding gross negligence).</p>

              <h3 style={h3Style}>Article 7 (Ownership of Posted Content)</h3>
              <p>1. The copyright of text, images, and other content posted or uploaded by users using the Service ("Posted Content") shall belong to the user.</p>
              <p>2. The user grants the Service a free license to use (including reproduction, adaptation, public transmission, etc.) Posted Content to the extent necessary for the operation, improvement, and promotion of the Service.</p>

              <h3 style={h3Style}>Article 8 (Governing Law and Jurisdiction)</h3>
              <p>1. The laws of Japan shall be the governing law for the interpretation of these Terms.</p>
              <p>2. In the event of any dispute regarding the Service, the court having jurisdiction over the location of the Service shall be the exclusive agreed jurisdiction.</p>
            </>
          )}
        </div>
      </section>

      <section id="tokusho" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>{t('legal.tokusho')}</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {language === 'ja' 
            ? '※有料機能提供開始に合わせて正式に公開いたします。現在は無料提供中のため、一部項目を省略しています。'
            : '* This will be officially published in conjunction with the start of paid features. Currently free.'}
        </p>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th style={thStyle}>{language === 'ja' ? '運営主体' : 'Operator'}</th>
              <td style={tdStyle}>DreamBridge</td>
            </tr>
            <tr>
              <th style={thStyle}>{language === 'ja' ? 'お問い合わせ' : 'Contact'}</th>
              <td style={tdStyle}>dreambridge.project.gk@gmail.com</td>
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
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)', fontSize: '0.9rem' }}>
          {language === 'ja' ? (
            <>
              <p>DreamBridge（以下「当サービス」）は、本サービスにおいてユーザーの個人情報の取り扱いについて、以下の通りプライバシーポリシーを定めます。</p>
              
              <h3 style={h3Style}>1. 取得する個人情報の種類</h3>
              <p>当サービスは、以下の情報を取得することがあります。</p>
              <ul>
                <li>氏名、メールアドレス、生年月日</li>
                <li>ログインに関する識別子情報</li>
                <li>Cookie、IPアドレス、閲覧履歴等のサービス利用状況</li>
                <li>本サービス内での行動ログ（プロフィールの閲覧履歴、検索条件、スカウト・マッチングの成約状況等）</li>
              </ul>

              <h3 style={h3Style}>2. 利用目的</h3>
              <p>当サービスが個人情報を収集・利用する目的は以下の通りです。</p>
              <ul>
                <li>本サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                <li>利用状況の分析、統計データの作成、およびサービス向上のため</li>
                <li>AI（人工知能）を活用したレコメンド機能の開発、およびマッチング精度の最適化のため</li>
              </ul>

              <h3 style={h3Style}>3. 第三者提供の有無と条件</h3>
              <p>当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく第三者に個人情報を提供することはありません。</p>
              <ul>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
              </ul>

              <h3 style={h3Style}>4. 情報の管理方法</h3>
              <p>当サービスは、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために、セキュリティシステムの維持・管理体制の整備等、必要かつ適切な措置を講じます。</p>

              <h3 style={h3Style}>5. 開示・訂正・削除の請求方法</h3>
              <p>ユーザーは、当サービスの保有する自己の個人情報について、所定の手続きにより開示、訂正、追加、削除、利用停止を請求することができます。ご希望の場合は、末尾のお問い合わせ窓口までご連絡ください。</p>

              <h3 style={h3Style}>6. Cookie（クッキー）の使用について</h3>
              <p>当サービスは、利便性の向上やトラフィックデータの分析のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることも可能ですが、その場合、サービスの一部が正常に機能しない可能性があります。</p>

              <h3 style={h3Style}>7. 未成年の取り扱い</h3>
              <p>未成年のユーザーが本サービスを利用し、個人情報を提供される場合には、保護者の同意を得た上で行っていただくものとします。</p>

              <h3 style={h3Style}>8. お問い合わせ先</h3>
              <p>本ポリシーに関するお問い合わせは、以下の窓口までお願いいたします。</p>
              <p>メールアドレス：dreambridge.project.gk@gmail.com</p>
            </>
          ) : (
            <>
              <p>DreamBridge ("this Service") defines the policy regarding the handling of personal information of users in this Service as follows.</p>
              
              <h3 style={h3Style}>1. Types of Information Collected</h3>
              <p>The Service may collect the following information:</p>
              <ul>
                <li>Name, email address, date of birth</li>
                <li>Identifier information for login</li>
                <li>Service usage status such as Cookies, IP addresses, and browsing history</li>
                <li>In-service behavioral logs (profile view history, search conditions, scout/matching success status, etc.)</li>
              </ul>

              <h3 style={h3Style}>2. Purpose of Use</h3>
              <p>The purposes for which we collect and use personal information are as follows:</p>
              <ul>
                <li>To provide and operate the Service</li>
                <li>To respond to user inquiries (including identity verification)</li>
                <li>To contact users regarding maintenance, important notices, etc.</li>
                <li>To analyze usage, create statistical data, and improve the Service</li>
                <li>To develop recommendation features using AI (Artificial Intelligence) and optimize matching accuracy</li>
              </ul>

              <h3 style={h3Style}>3. Third-party Provision</h3>
              <p>The Service will not provide personal information to third parties without prior consent, except in the following cases:</p>
              <ul>
                <li>When required by law</li>
                <li>When necessary to protect life, body, or property</li>
                <li>When especially necessary for improving public health or promoting the sound growth of children</li>
              </ul>

              <h3 style={h3Style}>4. Information Management</h3>
              <p>The Service takes necessary and appropriate measures, such as maintaining security systems and developing management structures, to prevent leakage, loss, or damage of personal information.</p>

              <h3 style={h3Style}>5. Disclosure, Correction, and Deletion</h3>
              <p>Users may request disclosure, correction, addition, deletion, or suspension of use of their personal information held by the Service through prescribed procedures. Please contact the inquiry desk below.</p>

              <h3 style={h3Style}>6. Use of Cookies</h3>
              <p>The Service uses Cookies to improve convenience and analyze traffic data. You can disable Cookies through your browser settings, but some parts of the Service may not function properly.</p>

              <h3 style={h3Style}>7. Handling of Minors</h3>
              <p>Minor users must obtain parental consent before using the Service and providing personal information.</p>

              <h3 style={h3Style}>8. Contact Information</h3>
              <p>For inquiries regarding this policy, please contact:</p>
              <p>Email: dreambridge.project.gk@gmail.com</p>
            </>
          )}
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
