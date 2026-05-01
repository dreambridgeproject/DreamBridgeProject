export type UserRole = 'talent' | 'agency';

export type Genre = 'アイドル' | 'モデル' | '俳優' | '歌手' | '声優' | 'ダンサー' | 'インフルエンサー' | 'クリエイター' | 'ライバー';

export interface Profile {
  id: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  age?: number;
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
  verification_status: 'none' | 'reviewing' | 'verified';
  blocked_user_ids: string[];
}

// Backward compatibility for existing components
export type Talent = Profile;
export type Agency = Profile;

export interface Offer {
  id: string;
  senderId: string;
  receiverId: string;
  senderRole: UserRole;
  status: 'pending' | 'approved' | 'declined';
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
  type: 'offer_received' | 'offer_approved' | 'offer_declined' | 'new_message';
  title: string;
  message: string;
  link: string;
  timestamp: string;
  read: boolean;
}
