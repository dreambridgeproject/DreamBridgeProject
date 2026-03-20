import type { Talent, Agency, Genre } from '../types';

export const GENRES: Genre[] = [
  'アイドル', 'モデル', '俳優', '歌手', '声優', 'ダンサー', 'インフルエンサー', 'クリエイター', 'ライバー'
];

export const mockTalents: Talent[] = [
  {
    id: 't1',
    role: 'talent',
    name: '田中 あかり',
    icon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    age: 19,
    region: '東京都',
    skills: ['ダンス', '歌唱'],
    experience: '中学生からダンススクールに通っています。',
    genres: ['アイドル', 'ダンサー'],
    intro: '誰かの背中を押せるようなアイドルを目指しています！',
    snsLinks: [{ platform: 'Instagram', url: '#' }, { platform: 'TikTok', url: '#' }],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    plan: 'premium' // 上位表示
  },
  {
    id: 't2',
    role: 'talent',
    name: '佐藤 健太',
    icon: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    age: 23,
    region: '大阪府',
    skills: ['殺陣', 'ピアノ'],
    experience: '小劇場の舞台に3回出演経験があります。',
    genres: ['俳優', 'モデル'],
    intro: '心に響く芝居ができる俳優になりたいです。',
    snsLinks: [{ platform: 'X', url: '#' }],
    plan: 'free'
  },
  {
    id: 't3',
    role: 'talent',
    name: 'リナ',
    icon: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    age: 21,
    region: '福岡県',
    skills: ['語学 (英語)', '編集'],
    experience: 'TikTokでフォロワー10万人。',
    genres: ['インフルエンサー', 'モデル'],
    intro: '等身大の自分を発信して、多くの人にハッピーを届けたいです。',
    snsLinks: [{ platform: 'TikTok', url: '#' }, { platform: 'YouTube', url: '#' }],
    plan: 'free'
  }
];

export const mockAgencies: Agency[] = [
  {
    id: 'a1',
    role: 'agency',
    name: 'スターライト・プロモーション',
    logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop',
    genres: ['アイドル', '歌手', 'モデル'],
    location: '東京都港区',
    foundedYear: 2010,
    talentCount: 45,
    intro: '次世代のスターを育成する総合エンターテインメント事務所です。',
    websiteUrl: 'https://example.com',
    snsLinks: [{ platform: 'Instagram', url: '#' }],
    plan: 'standard',
    isApproved: true // 運営承認済み
  },
  {
    id: 'a2',
    role: 'agency',
    name: 'シアター・ブリッジ',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop',
    genres: ['俳優', '声優', 'クリエイター'],
    location: '東京都渋谷区',
    foundedYear: 2005,
    talentCount: 30,
    intro: '実力派俳優のマネジメントに特化した事務所です。',
    websiteUrl: 'https://example.com',
    snsLinks: [{ platform: 'X', url: '#' }],
    plan: 'pro', // 上位表示
    isApproved: true
  },
  {
    id: 'a3',
    role: 'agency',
    name: 'グローバル・アーツ',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    genres: ['モデル', '俳優'],
    location: '東京都千代田区',
    foundedYear: 2015,
    talentCount: 120,
    intro: '世界を見据えた大手エージェンシー。',
    websiteUrl: 'https://example.com',
    snsLinks: [],
    plan: 'enterprise',
    isApproved: true,
    auditions: [
      { title: '2026年 次世代モデルオーディション', description: '身長170cm以上の方。経験不問。', deadline: '2026/04/30' }
    ]
  },
  {
    id: 'a4',
    role: 'agency',
    name: '個人エージェント (サンプル)',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    genres: ['クリエイター'],
    location: '埼玉県',
    foundedYear: 2023,
    talentCount: 2,
    intro: '個人のエージェントです。',
    websiteUrl: 'https://example.com',
    snsLinks: [],
    plan: 'free', // 無料プラン（オファー不可）
    isApproved: false // 未承認
  }
];
