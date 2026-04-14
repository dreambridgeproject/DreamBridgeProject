import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import type { Talent, Agency, UserRole, Offer, ChatMessage, Notification, Profile } from '../types';
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
  const [offers, setOffers] = useState<Offer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchProfile = async (userId: string, metadata?: any) => {
    console.log('Fetching profile for:', userId);
    try {
      // Add a simple timeout to the supabase query
      const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 10000));
      
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
          verificationStatus: 'none',
          blockedUserIds: []
        };
        
        const { data: createdData, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        if (createError) {
          console.error('Profile creation error:', createError);
          return { id: userId, ...newProfile } as any;
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
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          const profile = await fetchProfile(session.user.id, session.user.user_metadata);
          if (profile && isMounted) {
            setCurrentUser(profile as any);
            setRole(profile.role as UserRole);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || (event === 'INITIAL_SESSION' && session)) {
        const newUser = session?.user ?? null;
        setUser(newUser);
        
        if (newUser) {
          // Fetch profile in background if we already have a user
          // Don't set loading(true) if it's already finished initializing
          try {
            const profile = await fetchProfile(newUser.id, newUser.user_metadata);
            if (isMounted) {
              setCurrentUser(profile as any);
              setRole(profile?.role as UserRole);
            }
          } finally {
            if (isMounted) setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchInitialData = async () => {
      const { data: offersData } = await supabase.from('offers').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      if (offersData) setOffers(offersData as any);
      const { data: messagesData } = await supabase.from('messages').select('*').in('offer_id', (offersData || []).map(o => o.id));
      if (messagesData) setMessages(messagesData as any);
    };
    fetchInitialData();

    const offersChannel = supabase.channel('public:offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, payload => {
        if (payload.eventType === 'INSERT') setOffers(prev => [...prev, payload.new as any]);
        if (payload.eventType === 'UPDATE') setOffers(prev => prev.map(o => o.id === payload.new.id ? payload.new as any : o));
      }).subscribe();

    const messagesChannel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new as any]);
      }).subscribe();

    return () => {
      offersChannel.unsubscribe();
      messagesChannel.unsubscribe();
    };
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() });
    if (!error) {
      const profile = await fetchProfile(user.id);
      setCurrentUser(profile as any);
    }
  };

  const sendOffer = async (receiverId: string) => {
    if (!user || !role) return;

    if (role === 'agency') {
      const { count } = await supabase.from('offers').select('*', { count: 'exact', head: true }).eq('sender_id', user.id);
      if (count !== null && count >= 3) {
        alert('無料プランの上限（3件）に達しました。審査完了をお待ちください。');
        return;
      }
    }

    const { error } = await supabase.from('offers').insert({ sender_id: user.id, receiver_id: receiverId, status: 'pending' });
    if (error) alert('送信に失敗しました。');
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
  const addNotification = (notif: any) => setNotifications(prev => [{ ...notif, id: Date.now().toString(), timestamp: new Date().toISOString(), read: false }, ...prev]);
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
