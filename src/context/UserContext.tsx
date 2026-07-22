import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import type { UserRole, Offer, ChatMessage, Notification, Profile } from '../types';
import { supabase } from '../lib/supabase';
import { logAction } from '../lib/analytics';
import type { User } from '@supabase/supabase-js';

interface UserContextType {
  currentUser: Profile | null;
  role: UserRole | null;
  user: User | null;
  loading: boolean;
  profileLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  likes: string[];
  toggleLike: (id: string) => void;
  offers: Offer[];
  sendOffer: (receiverId: string, jobId?: string) => Promise<void>;
  updateOfferStatus: (offerId: string, status: 'approved' | 'declined', scheduledAt?: string) => Promise<void>;
  hideChat: (offerId: string) => Promise<void>;
  messages: ChatMessage[];
  sendMessage: (offerId: string, text: string) => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  checkOfferLimit: () => Promise<boolean>;
  markMessagesAsRead: (offerId: string) => Promise<void>;
  robustInsertOffer: (offerData: any) => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [likes, setLikes] = useState<string[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    if (data) {
      setNotifications(data.map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        timestamp: n.timestamp,
        read: n.read
      })));
    }
  };

  const fetchOffers = async (userId: string, userRole: UserRole) => {
    let query = supabase.from('offers').select('*, job:jobs(title)');

    if (userRole === 'agency') {
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId},mediator_id.eq.${userId}`);
    } else {
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    }

    const { data } = await query.order('timestamp', { ascending: false });
    if (data) {
      setOffers(data.map((o: any) => ({
        id: o.id,
        senderId: o.sender_id,
        receiverId: o.receiver_id,
        senderRole: o.sender_role || 'casting',
        status: o.status,
        timestamp: o.timestamp,
        lastMessage: o.last_message,
        mediatorId: o.mediator_id,
        jobId: o.job_id,
        jobTitle: o.job?.title,
        hiddenBy: o.hidden_by || []
      })));
    }
  };

  const fetchMessages = async (userId: string) => {
    // This is a bit complex since we need messages for all relevant offers
    // For now, let's fetch messages for all offers the user is part of
    const { data: offerData } = await supabase.from('offers').select('id').or(`sender_id.eq.${userId},receiver_id.eq.${userId},mediator_id.eq.${userId}`);
    
    if (offerData && offerData.length > 0) {
      const offerIds = offerData.map(o => o.id);
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .in('offer_id', offerIds)
        .order('timestamp', { ascending: true });
      
      if (msgData) {
        setMessages(msgData.map((m: any) => ({
          id: m.id,
          offerId: m.offer_id,
          senderId: m.sender_id,
          text: m.text,
          timestamp: m.timestamp,
          unread: m.unread
        })));
      }
    }
  };

  const fetchProfile = async (userId: string, metadata?: any, retryCount = 0): Promise<any> => {
    console.log(`Fetching profile for: ${userId} (Attempt: ${retryCount + 1})`);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url')) {
      console.error('Supabase connection not configured correctly.');
      return null;
    }
    
    try {
      const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 15000));
      
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (error && error.code === 'PGRST116') {
        // ... (profile creation logic remains same)
        const rawRole = metadata?.role || 'talent';
        const role: UserRole = (rawRole === 'agency' || rawRole === 'talent' || rawRole === 'casting') ? rawRole as UserRole : 'talent';

        const newProfile = {
          id: userId,
          full_name: metadata?.full_name || metadata?.name || '名前未設定',
          role: role,
          genres: [],
          photos: [],
          videos: [],
          audios: [],
          plan: 'free',
          verification_status: (role === 'agency' || role === 'casting') ? 'reviewing' : 'none',
          blocked_user_ids: [],
          company_description: metadata?.company_description || '',
          contact_info: metadata?.contact_info || '',
          representative_name: metadata?.representative_name || '',
          affiliation_status: metadata?.affiliation_status || (role === 'talent' ? 'unaffiliated' : undefined),
          agency_id: metadata?.agency_id || null,
          accept_external_offers: role === 'talent' ? true : undefined,
          gender: 'none'
        };
        
        const { data: createdData, error: createError } = await supabase.from('profiles').insert(newProfile).select().single();
        if (createError) return newProfile;
        return createdData;
      }

      if (error) throw error;
      return data;
    } catch (err: any) {
      if (err.message === 'TIMEOUT' && retryCount < 1) {
        console.warn('Profile fetch timed out, retrying...');
        return fetchProfile(userId, metadata, retryCount + 1);
      }
      console.error('fetchProfile error:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Use onAuthStateChange for all auth state management
    // This handles both initial session and subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);

      if (session?.user) {
        setUser(session.user);
        // Auth itself is resolved now; don't keep the whole app spinning while
        // the (potentially slow, e.g. DB cold-start) profile fetch runs.
        setLoading(false);
        setProfileLoading(true);
        const profile = await fetchProfile(session.user.id, session.user.user_metadata);
        if (mounted) setProfileLoading(false);
        if (mounted) {
          if (profile?.is_banned) {
            alert('このアカウントは現在ご利用いただけません（退会済み、または利用停止中です）。心当たりがない場合は運営までお問い合わせください。');
            logout();
            return;
          }
          if (profile) {
            setCurrentUser(profile);
            const userRole = profile.role || null;
            setRole(userRole);
            if (profile.favorite_ids) {
              setLikes(profile.favorite_ids);
            }
            if (userRole) {
              fetchOffers(session.user.id, userRole);
              fetchMessages(session.user.id);
              fetchNotifications(session.user.id);
            }
          } else {
            console.warn('Could not load user profile on auth state change (possibly due to database wakeup sleep). Retaining session without profile details.');
          }
        }
      } else if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setUser(null);
          setCurrentUser(null);
          setRole(null);
          setLikes([]);
          setProfileLoading(false);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Realtime notification subscription, kept separate from onAuthStateChange:
  // that callback re-fires on every auth event (token refresh, tab refocus),
  // and re-subscribing a channel with the same topic each time throws
  // "cannot add postgres_changes callbacks ... after subscribe()". Keying
  // this effect on the user id means it subscribes exactly once per session.
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`user_notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const n = payload.new as any;
            const newNotif: Notification = {
              id: n.id,
              userId: n.user_id,
              type: n.type,
              title: n.title,
              message: n.message,
              link: n.link,
              timestamp: n.timestamp,
              read: n.read
            };
            setNotifications(prev => [newNotif, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => n.id === payload.new.id ? {
              ...n,
              read: payload.new.read
            } : n));
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      console.error('No user logged in for updateProfile');
      return;
    }
    
    console.log('Updating profile for:', user.id, updates);
    
    // Ensure we don't accidentally overwrite the role with something null/undefined
    const finalUpdates: any = { ...updates };
    if (currentUser?.role && !finalUpdates.role) {
      finalUpdates.role = currentUser.role;
    }
    // No DB trigger keeps this in sync, so stamp it on every edit ourselves -
    // otherwise "sort by recently updated" never reflects new edits.
    finalUpdates.updated_at = new Date().toISOString();

    // The live DB schema can drift from what the app expects (a field used
    // here but not yet migrated in production, e.g. website_url). Rather than
    // hard-failing the whole save when Supabase reports an unknown column,
    // drop just that column and retry so the rest of the edit still persists.
    let payload: any = { ...finalUpdates };
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 15000));
        const upsertPromise = supabase
          .from('profiles')
          .upsert({ id: user.id, ...payload })
          .select()
          .single();

        const { data, error } = await Promise.race([upsertPromise, timeoutPromise]) as any;

        if (error) {
          const missingColumn = error.message?.match(/Could not find the '([^']+)' column/)?.[1];
          if (missingColumn && missingColumn in payload) {
            console.warn(`Column '${missingColumn}' not found on 'profiles' - dropping it and retrying save.`);
            const { [missingColumn]: _omit, ...rest } = payload;
            payload = rest;
            continue;
          }
          throw error;
        }

        if (data) {
          console.log('Profile updated successfully:', data);
          setCurrentUser(data);
          if (data.role) setRole(data.role); // Sync state role with DB role
        }
        return;
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
    throw new Error('Failed to update profile after removing unrecognized columns');
  };

  const robustInsertOffer = async (offerData: any) => {
    const { data, error } = await supabase.from('offers').insert(offerData).select().single();
    
    if (error && error.message?.includes('column') && error.message?.includes('not found')) {
      console.warn('Offer insert failed due to missing column, retrying with minimal fields...');
      // Strip potentially problematic columns
      const { sender_role, timestamp, last_message, message, ...minimalOffer } = offerData;
      const { data: retryData, error: retryError } = await supabase.from('offers').insert(minimalOffer).select().single();
      if (retryError) throw retryError;
      return retryData;
    }
    
    if (error) throw error;
    return data;
  };

  const sendOffer = async (receiverId: string, jobId?: string) => {
    if (!user) return;
    const newOffer: any = {
      sender_id: user.id,
      receiver_id: receiverId,
      status: 'pending' as const,
      sender_role: role || 'casting',
      timestamp: new Date().toISOString(),
      job_id: jobId || null
    };

    try {
      const data = await robustInsertOffer(newOffer);
      if (data) {
        setOffers(prev => [mapOffer(data), ...prev]);
        logAction(user.id, 'scout_sent', receiverId);
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      throw error;
    }
  };

  // Helper to map DB offer to UI offer
  const mapOffer = (o: any): Offer => ({
    id: o.id,
    senderId: o.sender_id,
    receiverId: o.receiver_id,
    senderRole: o.sender_role || 'casting',
    status: o.status,
    timestamp: o.timestamp,
    lastMessage: o.last_message,
    mediatorId: o.mediator_id,
    jobId: o.job_id,
    scheduledAt: o.scheduled_at,
    hiddenBy: o.hidden_by || []
  });

  const updateOfferStatus = async (offerId: string, status: 'approved' | 'declined', scheduledAt?: string) => {
    const updatePayload: { status: string; scheduled_at?: string } = { status };
    if (status === 'approved' && scheduledAt) updatePayload.scheduled_at = scheduledAt;
    const { error } = await supabase.from('offers').update(updatePayload).eq('id', offerId);
    if (!error) {
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status, ...(scheduledAt ? { scheduledAt } : {}) } : o));
      logAction(user?.id, `offer_${status}`, offerId);
    }
  };

  const hideChat = async (offerId: string) => {
    if (!user) return;
    const { error } = await supabase.rpc('hide_chat', { p_offer_id: offerId });
    if (!error) {
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, hiddenBy: [...(o.hiddenBy || []), user.id] } : o));
    }
  };

  const sendMessage = async (offerId: string, text: string) => {
    if (!user) return;
    await supabase.from('messages').insert({ offer_id: offerId, sender_id: user.id, text });
  };

  const login = (selectedRole: UserRole) => setRole(selectedRole);
  const logout = async () => { await supabase.auth.signOut(); };
  
  const toggleLike = async (id: string) => {
    if (!user) return;
    
    const isLiked = likes.includes(id);
    const newLikes = isLiked ? likes.filter(i => i !== id) : [...likes, id];
    
    setLikes(newLikes);
    logAction(user?.id, isLiked ? 'like_removed' : 'like_added', id);
    
    // Persist to DB
    try {
      await updateProfile({ favorite_ids: newLikes });
    } catch (err) {
      console.error('Failed to persist likes:', err);
      // Fallback: stay in local state
    }
  };
  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const clearNotifications = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const checkOfferLimit = async () => {
    if (!user || (role !== 'agency' && role !== 'casting') || currentUser?.plan !== 'free') return false;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', user.id)
      .gte('timestamp', startOfMonth.toISOString());

    if (error) {
      console.error('Error checking offer limit:', error);
      return false;
    }

    return (count || 0) >= 3;
  };

  const markMessagesAsRead = async (offerId: string) => {
    if (!user) return;
    try {
      await supabase
        .from('messages')
        .update({ unread: false })
        .eq('offer_id', offerId)
        .neq('sender_id', user.id)
        .eq('unread', true);
      
      // Update local state to reflect changes immediately
      setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) => (m.offerId === offerId && m.senderId !== user.id) ? { ...m, unread: false } : m));
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, role, user, loading, profileLoading, login, logout, updateProfile,
      likes, toggleLike, offers, sendOffer, updateOfferStatus, hideChat,
      messages, sendMessage, notifications, markNotificationAsRead, clearNotifications,
      checkOfferLimit, markMessagesAsRead, robustInsertOffer
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
