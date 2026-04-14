import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Building2, Smartphone, Store, 
  CheckCircle2, Plus, ChevronRight, AlertCircle,
  SmartphoneNfc, Zap
} from 'lucide-react';

const PaymentSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'card', name: 'クレジットカード', icon: <CreditCard size={24} />, desc: 'Visa, Mastercard, JCB, AMEX', status: '登録済み' },
    { id: 'bank', name: '銀行振込 (請求書)', icon: <Building2 size={24} />, desc: 'エンタープライズプラン限定', status: '利用不可' },
    { id: 'paypay', name: 'PayPay', icon: <Zap size={24} />, desc: '現在準備中です', status: '近日公開' },
    { id: 'carrier', name: 'キャリア決済', icon: <SmartphoneNfc size={24} />, desc: 'ドコモ, au, SoftBank', status: '未設定' },
    { id: 'apple_google', name: 'Apple / Google Pay', icon: <div style={{ fontWeight: 800 }}>Pay</div>, desc: 'デバイスの生体認証で決済', status: '利用可能' },
    { id: 'conveni', name: 'コンビニ決済', icon: <Store size={24} />, desc: 'セブン, ファミマ, ローソン', status: '都度払い' },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> 戻る
        </button>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>支払い方法の設定</h1>
        <p style={{ color: 'var(--text-muted)' }}>プランの購入や更新に使用する決済手段を管理します。</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            style={{ 
              ...methodItemStyle,
              border: selectedMethod === method.id ? '2px solid var(--accent)' : '1px solid var(--border)',
              backgroundColor: selectedMethod === method.id ? 'rgba(var(--accent-rgb), 0.05)' : 'var(--surface)'
            }}
          >
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'var(--background)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' 
            }}>
              {method.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{method.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{method.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600,
                color: method.status === '登録済み' ? '#10b981' : 'var(--text-muted)'
              }}>
                {method.status}
              </span>
              {method.status === '未登録' || method.status === '未連携' ? (
                <div style={{ color: 'var(--accent)', marginTop: '0.25rem' }}><Plus size={18} /></div>
              ) : (
                <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}><ChevronRight size={18} /></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid #3b82f6', display: 'flex', gap: '1rem' }}>
        <AlertCircle size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.875rem', color: '#1d4ed8', lineHeight: 1.5 }}>
          <strong>セキュリティについて:</strong><br />
          カード番号等の機密情報は暗号化され、ISO 27001認証済みの安全な環境で管理されます。DreamBridgeが直接カード番号を保持することはありません。
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>
        設定を保存する
      </button>
    </div>
  );
};

const methodItemStyle: React.CSSProperties = {
  padding: '1.25rem',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)'
};

export default PaymentSettingsPage;
