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
              <p>この利用規約（以下「本規約」）は、DreamBridge（以下「当サービス」）が提供するマッチングプラットフォームの利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。</p>
              
              <h3 style={h3Style}>第1条（適用）</h3>
              <p>本規約は、ユーザーとDreamBridgeとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
              
              <h3 style={h3Style}>第2条（利用登録）</h3>
              <p>1. 登録希望者がDreamBridgeの定める方法によって利用登録を申請し、DreamBridgeがこれを承認することによって、利用登録が完了するものとします。</p>
              <p>2. ユーザーは、本サービスにプロフィール写真を登録した場合、当該写真が本サービス内において他のユーザーに対して表示されることにあらかじめ同意するものとします。</p>

              <h3 style={h3Style}>第3条（案件の性質および雇用契約の禁止）</h3>
              <p>1. 本サービスにおいて掲載および取引が可能な案件は、業務委託契約（出演契約、モデル契約、プロジェクト単位の制作依頼等）に限られるものとします。</p>
              <p>2. 利用者は、本サービスを利用して雇用契約（アルバイト、正社員等の募集）を目的とした求人、応募、勧誘を行うことはできません。当サービスは、利用者間の雇用関係の成立を一切仲介しません。</p>

              <h3 style={h3Style}>第4条（職業紹介・斡旋の否定）</h3>
              <p>1. 本サービスは、利用者間の情報提供およびコミュニケーションの場を提供するプラットフォームであり、当サービスが特定の仕事の獲得、所属、または契約の成立を保証、斡旋、または代行するものではありません。</p>
              <p>2. 当サービスが提供する有料オプション（上位表示等）は、情報の露出を高めるための広告枠の提供であり、特定の利用者への優先的な斡旋を行うものではありません。</p>
              <p>3. 利用者は、自己の責任において相手方と交渉・契約を行うものとし、契約内容の適法性および妥当性について当サービスは一切の責任を負いません。</p>

              <h3 style={h3Style}>第5条（未成年者の利用および免責）</h3>
              <p>1. 未成年者が本サービスを利用する場合、必ず法定代理人（保護者等）の同意を得た上で登録および利用を行うものとします。</p>
              <p>2. 当サービスは、利用者間で行われる契約およびトラブル（報酬の未払い、不当な契約条件、身体的・精神的損害等）について、一切の責任を負いません。未成年ユーザーと相手方との間で生じたトラブルについても同様とします。</p>

              <h3 style={h3Style}>第6条（所属タレントへの接触および引き抜き行為の制限）</h3>
              <p>1. 制作会社および広告会社（以下「キャスティング会員」）は、本サービスにおいて事務所所属ステータスを持つタレント（以下「所属タレント」）に対し、本サービス上の仲介システム（事務所経由オファー）を利用せずに直接連絡を取ることを固く禁じます。</p>
              <p>2. 利用者は、本サービスを通じて知り得た他者の所属タレントに対し、その所属事務所の承諾なく直接契約を求める行為、または他事務所への移籍を促す行為（いわゆる引き抜き行為）を一切行ってはなりません。</p>
              <p>3. 前各項に違反した場合、運営は当該会員のアカウントを予告なく即時停止し、将来にわたる利用を禁止する権利を有します。また、これにより事務所等に損害が生じた場合、当事者間で解決するものとし、当サービスは一切の責任を負いません。</p>

              <h3 style={h3Style}>第7条（禁止事項）</h3>
              <p>利用者は、以下の行為を行ってはなりません。</p>
              <ul>
                <li>虚偽の情報登録</li>
                <li>他者へのなりすまし</li>
                <li>公序良俗に反する行為</li>
                <li>反社会的勢力への利益供与</li>
                <li>法令に違反する求人・勧誘行為</li>
                <li>オーディション・キャスティング等を名目に、レッスン料その他名目を問わず金銭を要求する行為</li>
              </ul>

              <h3 style={h3Style}>第8条（本サービスの提供の停止等）</h3>
              <p>当サービスは、システム保守、天災、事故、その他提供が困難と判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとする。</p>

              <h3 style={h3Style}>第9条（免責事項）</h3>
              <p>1. 当サービスは、本サービスの安全性、正確性、特定の目的への適合性等について、明示的にも黙示的にも保証しておりません。</p>
              <p>2. 当サービスは、利用者間のマッチングおよびその後の取引結果について一切の保証を行わず、生じた損害について責任を負いません。</p>

              <h3 style={h3Style}>第10条（準拠法・裁判管轄）</h3>
              <p>本規約の解釈にあたっては日本法を準拠法とし、紛争が生じた場合には当サービスの所在地を管轄する裁判所を専属的合意管轄とします。</p>

              <h3 style={h3Style}>第11条（不適切行為に対するゼロ・トレランス指針）</h3>
              <p>1. 当サービスは、児童買春、性的な勧誘、ハラスメント、ストーカー行為、および芸能活動を装った不適切な接触を一切許容しません。</p>
              <p>2. 前項に該当する疑いがある行為を発見した場合、当サービスは事前の通知なく当該ユーザーのアカウントを永久停止し、必要に応じてチャットログ等の証拠を速やかに警察等の公的機関へ提供します。</p>
              <p>3. 利用者は、本サービス内での活動が安全管理のために運営によってモニタリングされる場合があることに同意するものとします。</p>
            </>
          ) : (
            <>
              <p>These Terms of Service (the "Terms") set forth the conditions for the use of the "DreamBridge" service (the "Service") provided by DreamBridge. Registered users shall use the Service in accordance with these Terms.</p>
              <h3 style={h3Style}>Article 1 (Application)</h3>
              <p>These Terms apply to all relationships between users and DreamBridge regarding the use of the Service.</p>
              <h3 style={h3Style}>Article 2 (Registration)</h3>
              <p>1. Registration is completed when an applicant applies for registration by the method prescribed by DreamBridge and DreamBridge approves the application.</p>
              <p>2. By registering a profile picture on this Service, the user consents in advance to the display of said picture to other users within the Service.</p>

              <h3 style={h3Style}>Article 3 (Special Provisions Regarding Contact with Affiliated Talents)</h3>
              <p>1. Casting members (production companies, advertising agencies, etc.) are strictly prohibited from contacting talents with "affiliated" status directly without using the mediation system (Offer via Agency) on this Service.</p>
              <p>2. Offers to affiliated talents must always obtain the approval of the agency member managing the talent.</p>
              <p>3. If it is found that a direct contract or contact was made without the agency's approval in violation of the preceding paragraph, DreamBridge reserves the right to immediately suspend the member's account without notice and prohibit future use.</p>

              <h3 style={h3Style}>Article 4 (Prohibited Actions)</h3>
              <p>In using the Service, users shall not engage in any of the following acts:</p>
              <ul>
                <li>Acts that violate laws or public order and morals</li>
                <li>Acts related to criminal activities</li>
                <li>Acts that infringe on copyrights, trademarks, or other intellectual property rights</li>
                <li>Acts that destroy or interfere with the functions of DreamBridge's or third parties' servers or networks</li>
                <li>Direct solicitation or "poaching" of affiliated talents</li>
                <li>Demanding lesson fees or any other payment from talents under the guise of an audition or casting opportunity</li>
                <li>Commercial use of information obtained through the Service</li>
                <li>Other acts deemed inappropriate by DreamBridge</li>
              </ul>

              <h3 style={h3Style}>Article 5 (Suspension of the Service)</h3>
              <p>The Service may suspend or interrupt the provision of all or part of the Service without prior notice to users in any of the following cases:</p>
              <ul>
                <li>When performing maintenance, inspection, or updating of computer systems related to the Service</li>
                <li>When provision of the Service becomes difficult due to force majeure such as earthquakes, lightning, fire, power outages, or natural disasters</li>
                <li>When computers or communication lines are stopped due to an accident</li>
                <li>In other cases where the Service deems it difficult to provide the Service</li>
              </ul>

              <h3 style={h3Style}>Article 6 (Change and Termination of Service)</h3>
              <p>The Service may change the contents of the Service or stop or terminate the provision of the Service without notice to users, and shall not be liable for any damages caused to users as a result.</p>

              <h3 style={h3Style}>Article 7 (Disclaimer of Warranties and Liability)</h3>
              <p>1. The Service does not guarantee, either expressly or impliedly, that the Service is free from factual or legal defects (including defects related to safety, reliability, accuracy, completeness, effectiveness, fitness for a particular purpose, security, errors, bugs, or infringement of rights).</p>
              <p>2. The Service shall not be liable for any damages caused to users arising from the Service. However, if the contract between the Service and the user (including these Terms) regarding the Service constitutes a consumer contract as defined in the Consumer Contract Act, this disclaimer shall not apply.</p>
              <p>3. Even in the case stipulated in the proviso of the preceding paragraph, the Service shall not be liable for damages arising from special circumstances among damages caused to users due to default or tort by the Service's negligence (excluding gross negligence).</p>

              <h3 style={h3Style}>Article 8 (Ownership of Posted Content)</h3>
              <p>1. The copyright of text, images, and other content posted or uploaded by users using the Service ("Posted Content") shall belong to the user.</p>
              <p>2. The user grants the Service a free license to use (including reproduction, adaptation, public transmission, etc.) Posted Content to the extent necessary for the operation, improvement, and promotion of the Service.</p>

              <h3 style={h3Style}>Article 9 (Governing Law and Jurisdiction)</h3>
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
