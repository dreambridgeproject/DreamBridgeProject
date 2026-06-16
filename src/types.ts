export type UserRole = 'talent' | 'agency' | 'casting';

export type Genre = 'アイドル' | 'モデル' | '俳優' | '歌手' | '声優' | 'ダンサー' | 'インフルエンサー' | 'クリエイター' | 'ライバー' | 'お笑い' | 'アナウンサー' | '文化人' | 'スポーツ選手' | 'MC' | 'ナレーター';

export type AffiliationStatus = 'unaffiliated' | 'affiliated' | 'freelance' | 'reviewing';

export type SkillCategory = '演技' | 'モデル' | '音楽' | '配信' | 'その他';

export type SkillTag = 
  | '俳優' | '声優' | '舞台' 
  | 'ファッション' | '広告' | 'グラビア' 
  | '歌手' | 'アイドル' | 'バンド' 
  | 'ライバー' | 'YouTuber' | 'TikToker' 
  | 'ダンサー' | 'お笑い' | 'アナウンサー';

export interface Profile {
  id: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  age?: number;
  birth_date?: string;
  height?: number;
  weight?: number;
  genres: string[];
  hobbies?: string;
  skills?: string;
  website_url?: string;
  instagram_url?: string;
  x_url?: string;
  photos: string[];
  videos: string[];
  audios: string[];
  plan: 'free' | 'standard' | 'pro' | 'enterprise' | 'premium';
  verification_status: 'none' | 'reviewing' | 'verified' | 'rejected';
  verification_doc_url?: string;
  parental_consent_name?: string;
  parental_consent_contact?: string;
  blocked_user_ids: string[];
  is_banned?: boolean;
  favorite_ids?: string[];
  reported_by_ids?: string[]; // IDs of users who reported this profile
  // New fields for Casting & Agency-Mediation
  affiliation_status?: AffiliationStatus;
  agency_id?: string;
  accept_external_offers?: boolean;
  skill_tags?: SkillTag[];
  company_description?: string;
  contact_info?: string;
  representative_name?: string;
  gender?: 'male' | 'female' | 'other' | 'none';
}

// Backward compatibility for existing components
export type Talent = Profile;
export type Agency = Profile;
export type CastingCompany = Profile;

export interface Job {
  id: string;
  castingId: string;
  title: string;
  skillTags: SkillTag[];
  reward: string;
  location: string;
  deadline: string;
  description: string;
  status: 'open' | 'closed';
  isPublic: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  talentId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface Offer {
  id: string;
  senderId: string;
  receiverId: string;
  senderRole: UserRole;
  status: 'pending' | 'approved' | 'declined';
  timestamp: string;
  lastMessage?: string;
  mediatorId?: string; // Agency ID for mediated offers
}

export interface Invitation {
  id: string;
  agencyId: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'expired';
  preFilledData: Partial<Profile>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  offerId: string;
  senderId: string;
  text: string;
  timestamp: string;
  unread: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'offer_received' | 'offer_approved' | 'offer_declined' | 'new_message';
  title: string;
  message: string;
  link: string;
  timestamp: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  reason: 'inappropriate_content' | 'harassment' | 'scam' | 'offline_meeting' | 'other';
  description: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
