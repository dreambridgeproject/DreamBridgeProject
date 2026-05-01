import type { Talent, Agency, Genre } from '../types';

export const GENRES: Genre[] = [
  'アイドル', 'モデル', '俳優', '歌手', '声優', 'ダンサー', 'インフルエンサー', 'クリエイター', 'ライバー'
];

export const mockTalents: Talent[] = [
  {
    id: 't1',
    role: 'talent',
    name: '田中 あかり',
    full_name: '田中 あかり',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    age: 19,
    location: '東京都',
    skills: 'ダンス, 歌唱',
    genres: ['アイドル', 'ダンサー'],
    bio: '誰かの背中を押せるようなアイドルを目指しています！',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop'],
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    audios: [],
    plan: 'premium',
    verification_status: 'verified',
    blocked_user_ids: []
  },
  {
    id: 't2',
    role: 'talent',
    name: '佐藤 健太',
    full_name: '佐藤 健太',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    age: 23,
    location: '大阪府',
    skills: '殺陣, ピアノ',
    genres: ['俳優', 'モデル'],
    bio: '心に響く芝居ができる俳優になりたいです。',
    photos: [],
    videos: [],
    audios: [],
    plan: 'free',
    verification_status: 'none',
    blocked_user_ids: []
  },
  {
    id: 't3',
    role: 'talent',
    name: 'リナ',
    full_name: 'リナ',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    age: 16,
    location: '福岡県',
    skills: '語学 (英語), 編集',
    genres: ['インフルエンサー', 'モデル'],
    bio: '等身大の自分を発信して、多くの人にハッピーを届けたいです。',
    photos: [],
    videos: [],
    audios: [],
    plan: 'free',
    verification_status: 'reviewing',
    blocked_user_ids: []
  }
];

export const mockAgencies: Agency[] = [
  {
    id: 'a1',
    role: 'agency',
    name: 'スターライト・プロモーション',
    full_name: 'スターライト・プロモーション',
    avatar_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop',
    genres: ['アイドル', '歌手', 'モデル'],
    location: '東京都港区',
    bio: '次世代のスターを育成する総合エンターテインメント事務所です。',
    plan: 'standard',
    verification_status: 'verified',
    blocked_user_ids: [],
    photos: [],
    videos: [],
    audios: []
  },
  {
    id: 'a2',
    role: 'agency',
    name: 'シアター・ブリッジ',
    full_name: 'シアター・ブリッジ',
    avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop',
    genres: ['俳優', '声優', 'クリエイター'],
    location: '東京都渋谷区',
    bio: '実力派俳優のマネジメントに特化した事務所です。',
    plan: 'pro',
    verification_status: 'verified',
    blocked_user_ids: [],
    photos: [],
    videos: [],
    audios: []
  },
  {
    id: 'a3',
    role: 'agency',
    name: 'グローバル・アーツ',
    full_name: 'グローバル・アーツ',
    avatar_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    genres: ['モデル', '俳優'],
    location: '東京都千代田区',
    bio: '世界を見据えた大手エージェンシー。',
    plan: 'enterprise',
    verification_status: 'verified',
    blocked_user_ids: [],
    photos: [],
    videos: [],
    audios: []
  },
  {
    id: 'a4',
    role: 'agency',
    name: '個人エージェント (サンプル)',
    full_name: '個人エージェント (サンプル)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    genres: ['クリエイター'],
    location: '埼玉県',
    bio: '個人のエージェントです。',
    plan: 'free',
    verification_status: 'reviewing',
    blocked_user_ids: [],
    photos: [],
    videos: [],
    audios: []
  }
];
