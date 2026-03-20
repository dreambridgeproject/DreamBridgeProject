export type UserRole = 'talent' | 'agency';

export type Genre = 'アイドル' | 'モデル' | '俳優' | '歌手' | '声優' | 'ダンサー' | 'インフルエンサー' | 'クリエイター' | 'ライバー';

export type AgencyPlan = 'free' | 'standard' | 'pro' | 'enterprise';
export type TalentPlan = 'free' | 'premium';

export interface Talent {
  id: string;
  role: 'talent';
  name: string;
  icon: string;
  age: number;
  region: string;
  skills: string[];
  experience: string;
  genres: Genre[];
  intro: string;
  snsLinks: { platform: string; url: string }[];
  videoUrl?: string;
  plan: TalentPlan; // Added
}

export interface Agency {
  id: string;
  role: 'agency';
  name: string;
  logo: string;
  genres: Genre[];
  location: string;
  foundedYear: number;
  talentCount: number;
  intro: string;
  websiteUrl: string;
  snsLinks: { platform: string; url: string }[];
  plan: AgencyPlan; // Added
  isApproved: boolean; // Added (Admin approval)
  auditions?: { title: string; description: string; deadline: string }[]; // For Enterprise
}

export type OfferStatus = 'pending' | 'approved' | 'declined';

export interface Offer {
  id: string;
  senderId: string;
  receiverId: string;
  senderRole: UserRole;
  status: OfferStatus;
  timestamp: string;
  lastMessage?: string;
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
  type: 'offer_received' | 'offer_approved' | 'offer_declined';
  title: string;
  message: string;
  link: string;
  timestamp: string;
  read: boolean;
}
