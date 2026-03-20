import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Award } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section with Background Image */}
      <section style={{ 
        position: 'relative',
        height: '80vh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1513519107127-1bed33748e4c?auto=format&fit=crop&q=80&w=2070")', // Dramatic Bridge at night
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
        {/* Dark Overlay for Text Readability */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.4) 0%, rgba(2, 6, 23, 0.9) 100%)',
          zIndex: 1
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1.5rem', 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            border: '1px solid var(--accent)', 
            borderRadius: '2rem',
            color: 'var(--accent)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            letterSpacing: '0.1em'
          }}>
            THE NEXT STAR BEGINS HERE
          </div>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 900, 
            marginBottom: '1.5rem', 
            lineHeight: 1.1,
            textShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}>
            夢を橋でつなぐ。<br />
            <span style={{ 
              background: 'linear-gradient(to right, #d4af37, #fde68a, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '4.5rem'
            }}>DreamBridge</span>
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 3rem' }}>
            芸能界への第一歩を誰にでも
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup/talent" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
              志望者として登録
            </Link>
            <Link to="/signup/agency" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
              事務所として登録
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section style={{ padding: '6rem 0', marginTop: '-4rem', position: 'relative', zIndex: 3 }}>
        <div className="container" style={{ 
          backgroundColor: 'var(--surface)', 
          padding: '4rem 3rem', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--accent)' }}>コンセプト</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: 2, marginBottom: '0' }}>
              芸能界を目指す原石と、才能を探す事務所をつなぐプラットフォーム。<br />
              場所や環境にとらわれず、誰しもが平等にチャンスを掴むことができる世界を。<br />
              <span style={{ display: 'block', marginTop: '1.5rem', fontSize: '1.125rem', color: 'var(--text-muted)' }}>
                DreamBridgeは、あなたの「夢」と「機会」を最短距離で結びます。
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4.5rem' }}>
            信頼と安全の<span style={{ color: 'var(--accent)' }}>DreamBridge</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            <div style={{ 
              padding: '2.5rem', 
              backgroundColor: 'var(--surface)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
                <Shield size={48} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>徹底した審査体制</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                登録されている事務所はすべて、公的な運営実態と実績を弊社の専門チームが厳正に審査しています。
              </p>
            </div>
            <div style={{ 
              padding: '2.5rem', 
              backgroundColor: 'var(--surface)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
                <Award size={48} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>公平な機会の提供</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                知名度や居住地に関係なく、純粋な「才能」と「熱意」が評価されるための高度なマッチングアルゴリズム。
              </p>
            </div>
            <div style={{ 
              padding: '2.5rem', 
              backgroundColor: 'var(--surface)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
                <Globe size={48} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>全国ネットワーク</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                都心の主要事務所から地方の特化型エージェンシーまで、日本全国の芸能関係者があなたのプロフィールを注視しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ 
        padding: '8rem 0', 
        textAlign: 'center', 
        background: 'linear-gradient(to top, rgba(30, 58, 138, 0.2), transparent)' 
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>あなたの輝きを、待っている人がいます。</h2>
          <Link to="/signup/talent" className="btn btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.25rem', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}>
            今すぐエントリーする
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
