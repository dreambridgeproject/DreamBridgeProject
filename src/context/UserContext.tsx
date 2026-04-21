import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import type { UserRole, Offer, ChatMessage, Notification, Profile } from '../types';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserContextType {
  currentUser: Profile | null;
  role: UserRole | null;
  user: User | null;
  loading: boolean;
  login: (role: UserRole) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  likes: string[];
  toggleLike: (id: string) => void;
  offers: Offer[];
  sendOffer: (receiverId: string) => Promise<void>;
  updateOfferStatus: (offerId: string, status: 'approved' | 'declined') => Promise<void>;
  messages: ChatMessage[];
  sendMessage: (offerId: string, text: string) => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [likes, setLikes] = useState<string[]>([]);
  const [offers] = useState<Offer[]>([]);
  const [messages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchProfile = async (userId: string, metadata?: any) => {
    console.log('Fetching profile for:', userId);
    try {
      // Add a simple timeout to the supabase query
      const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 30000));
      
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new one...');
        const rawRole = metadata?.role || 'talent';
        const role: UserRole = (rawRole === 'agency' || rawRole === 'talent') ? rawRole : 'talent';

        const newProfile = {
          id: userId,
          name: metadata?.full_name || metadata?.name || '名前未設定',
          role: role,
          genres: [],
          photos: [],
          videos: [],
          audios: [],
          plan: 'free',
          verificationStatus: 'none'
        };
        
        const { data: createdData, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        if (createError) {
          console.error('Profile creation error:', createError);
          return newProfile as any;
        }
        return createdData;
      }
      return data;
    } catch (err) {
      console.error('fetchProfile unexpected error:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const profile = await fetchProfile(session.user.id, session.user.user_metadata);
          if (mounted) {
            setCurrentUser(profile);
            setRole(profile?.role || null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(setLoading as any === false ? false : false); // Safe way to ensure loading is false
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const profile = await fetchProfile(session.user.id, session.user.user_metadata);
        if (mounted) {
          setCurrentUser(profile);
          setRole(profile?.role || null);
        }
      } else {
        if (mounted) {
          setUser(null);
          setCurrentUser(null);
          setRole(null);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (!error && data) {
      setCurrentUser(data);
    }
  };

  const sendOffer = async (receiverId: string) => {
    if (!user) return;
    await supabase.from('offers').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      status: 'pending'
    });
  };

  const updateOfferStatus = async (offerId: string, status: 'approved' | 'declined') => {
    await supabase.from('offers').update({ status }).eq('id', offerId);
  };

  const sendMessage = async (offerId: string, text: string) => {
    if (!user) return;
    await supabase.from('messages').insert({ offer_id: offerId, sender_id: user.id, text });
  };

  const login = (selectedRole: UserRole) => setRole(selectedRole);
  const logout = async () => { await supabase.auth.signOut(); };
  const toggleLike = (id: string) => setLikes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearNotifications = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <UserContext.Provider value={{ 
      currentUser, role, user, loading, login, logout, updateProfile,
      likes, toggleLike, offers, sendOffer, updateOfferStatus,
      messages, sendMessage, notifications, markNotificationAsRead, clearNotifications
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
