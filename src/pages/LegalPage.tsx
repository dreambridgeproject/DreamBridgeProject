import React from 'react';

const LegalPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      {/* Beta Notice Banner */}
      <div style={{ 
        backgroundColor: 'rgba(255, 171, 0, 0.1)', 
        border: '1px solid #ffab00', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '3rem',
        color: '#ffab00'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>【ベータ版提供に関するお知らせ】</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
          現在、DreamBridgeはベータ版として提供されています。正式リリース（2026年7月予定）までの期間、全ての機能を無料でご利用いただけますが、一部の機能制限や予告ない仕様変更、データのリセット等が行われる可能性があります。あらかじめご了承ください。
        </p>
      </div>

      <section id="tos" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>利用規約（ベータ版）</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)', fontSize: '0.9rem' }}>
          <p>この利用規約（以下「本規約」）は、DreamBridge運営事務局（以下「当事務局」）が提供するサービス「DreamBridge」（以下「本サービス」）の利用条件を定めるものです。</p>

          <h3 style={h3Style}>第1条（適用）</h3>
          <p>本規約は、ユーザーと当事務局との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

          <h3 style={h3Style}>第2条（ユーザー登録とアカウント管理）</h3>
          <p>
            1. 本サービスの利用を希望する者は、本規約に同意の上、当事務局の定める方法によって利用登録を申請するものとします。<br />
            2. ユーザーは、自己の責任においてアカウントおよびパスワードを厳重に管理するものとします。<br />
            3. 未成年者が本サービスを利用する場合、法定代理人（保護者）の同意を必須とします。
          </p>

          <h3 style={h3Style}>第3条（禁止事項）</h3>
          <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>他のユーザーに対する嫌がらせ、誹謗中傷、ストーカー行為</li>
            <li><strong>本サービスを介さず、直接的な契約交渉や取引を行う行為（引き抜き行為の禁止）</strong></li>
            <li>児童ポルノ、性的搾取を目的とした投稿または勧誘行為</li>
            <li>虚偽の情報を登録する行為</li>
            <li>当事務局のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
          </ul>

          <h3 style={h3Style}>第4条（利用料金および支払方法）</h3>
          <p>
            1. ベータ版期間中、本サービスは原則として無料でご利用いただけます。<br />
            2. 正式リリース後の有料プランおよび利用料金については、別途定めるものとし、本サービス上または公式サイトにて告知します。
          </p>

          <h3 style={h3Style}>第5条（ベータ版の免責事項）</h3>
          <p>
            1. 当事務局は、ベータ版の正確性、有用性、安全性等について一切保証しません。<br />
            2. ベータ版の提供期間中、予告なくサービス内容の変更、中断、停止、または登録データの削除を行う場合があります。これらに起因してユーザーに生じた損害について、当事務局は一切の責任を負いません。
          </p>

          <h3 style={h3Style}>第6条（本サービスの提供の停止等）</h3>
          <p>当事務局は、システムの保守点検、火災、停電、天災地変などの不可抗力により、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>

          <h3 style={h3Style}>第7条（免責事項）</h3>
          <p>
            1. 当事務局は、ユーザー間のマッチング、交渉、契約に関して一切の責任を負いません。ユーザー間でトラブルが生じた場合は、当事者間で解決するものとします。<br />
            2. 当事務局は、本サービスに起因してユーザーに生じたあらゆる損害について、当事務局の故意または重過失による場合を除き、一切の責任を負いません。
          </p>

          <h3 style={h3Style}>第8条（規約の変更）</h3>
          <p>当事務局は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>

          <h3 style={h3Style}>第9条（準拠法・裁判管轄）</h3>
          <p>本規約の解釈にあたっては、日本法を準拠法とし、本サービスに関して紛争が生じた場合には、当事務局の所在地を管轄する裁判所を専属的合意管轄とします。</p>
        </div>
      </section>

      <section id="tokusho" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>特定商取引法に基づく表記</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>※有料機能提供開始（2026年7月予定）に合わせて正式に公開いたします。現在は無料提供中のため、一部項目を省略しています。</p>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th style={thStyle}>運営主体</th>
              <td style={tdStyle}>DreamBridge 運営事務局</td>
            </tr>
            <tr>
              <th style={thStyle}>代表責任者</th>
              <td style={tdStyle}>（正式リリース時に公開）</td>
            </tr>
            <tr>
              <th style={thStyle}>所在地</th>
              <td style={tdStyle}>（正式リリース時に公開）</td>
            </tr>
            <tr>
              <th style={thStyle}>お問い合わせ</th>
              <td style={tdStyle}>support@dreambridge.example.com</td>
            </tr>
            <tr>
              <th style={thStyle}>販売価格</th>
              <td style={tdStyle}>ベータ版期間中は無料</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="privacy">
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>プライバシーポリシー</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p>株式会社ドリームブリッジ（以下「当社」）は、本サービスにおいてユーザーの個人情報の取り扱いについて、以下の通りポリシーを定めます。</p>
          
          <h3 style={h3Style}>1. 個人情報の収集</h3>
          <p>当社は、ユーザーがプロフィール作成時に提供する氏名、生年月日、写真、動画、音声、連絡先等の情報を収集します。</p>

          <h3 style={h3Style}>2. 利用目的</h3>
          <p>
            収集した情報は以下の目的で利用します：<br />
            ・ユーザー間のマッチング（オファー送信、オーディション募集）<br />
            ・本人確認および不正利用の防止<br />
            ・カスタマーサポートの提供<br />
            ・サービスの改善および新機能の開発
          </p>

          <h3 style={h3Style}>3. プロフィール情報の取り扱い</h3>
          <p>
            志望者ユーザーのプロフィール（写真、動画、音声を含む）は、本サービスに登録している事務所ユーザーに対してのみ公開されます。
            ただし、未成年ユーザーの情報については、保護者の同意を得た場合に限り、適切な範囲内で公開されます。
          </p>

          <h3 style={h3Style}>4. 未成年ユーザーの保護</h3>
          <p>
            18歳未満のユーザーの登録には保護者の同意を必須としています。
            また、児童ポルノや性的搾取の防止のため、投稿されるコンテンツは厳重に監視され、不適切な内容は削除および通報の対象となります。
          </p>

          <h3 style={h3Style}>5. 第三者提供</h3>
          <p>法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。</p>

          <h3 style={h3Style}>6. お問い合わせ</h3>
          <p>個人情報の取り扱いに関するお問い合わせは、上記特定商取引法に基づく表記のメールアドレスまでご連絡ください。</p>
        </div>
      </section>
    </div>
  );
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '2rem'
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '1rem',
  backgroundColor: 'var(--background)',
  border: '1px solid var(--border)',
  width: '30%',
  fontSize: '0.875rem'
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  border: '1px solid var(--border)',
  fontSize: '0.875rem'
};

const h3Style: React.CSSProperties = {
  marginTop: '2rem',
  marginBottom: '1rem',
  fontSize: '1.25rem'
};

export default LegalPage;
