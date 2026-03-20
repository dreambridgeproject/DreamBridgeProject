import { createContext, useContext, useState, type FC, type ReactNode } from 'react';
import type { Talent, Agency, UserRole, Offer, ChatMessage, Notification } from '../types';
import { mockTalents, mockAgencies } from '../data/mock';

interface UserContextType {
  currentUser: Talent | Agency | null;
  role: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
  likes: string[]; // List of IDs (either talent or agency)
  toggleLike: (id: string) => void;
  offers: Offer[];
  sendOffer: (receiverId: string) => void;
  updateOfferStatus: (offerId: string, status: 'approved' | 'declined') => void;
  messages: ChatMessage[];
  sendMessage: (offerId: string, text: string) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Talent | Agency | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [likes, setLikes] = useState<string[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = (selectedRole: UserRole) => {
    setRole(selectedRole);
    // For prototype, just pick the first one of the role
    if (selectedRole === 'talent') {
      setCurrentUser(mockTalents[0]);
    } else {
      setCurrentUser(mockAgencies[0]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
  };

  const toggleLike = (id: string) => {
    setLikes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const sendOffer = (receiverId: string) => {
    if (!currentUser) return;
    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      senderRole: role!,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setOffers(prev => [...prev, newOffer]);

    // Receiver notification (simulated)
    addNotification({
      userId: receiverId,
      type: 'offer_received',
      title: '新規オファー',
      message: `${currentUser.name}からオファーが届きました！`,
      link: '/offers'
    });
  };

  const updateOfferStatus = (offerId: string, status: 'approved' | 'declined') => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o));
    
    // Notification for the sender
    addNotification({
      userId: offer.senderId,
      type: status === 'approved' ? 'offer_approved' : 'offer_declined',
      title: status === 'approved' ? 'オファー承認' : 'オファー辞退',
      message: `${currentUser?.name}があなたのオファーを${status === 'approved' ? '承認' : '辞退'}しました。`,
      link: status === 'approved' ? `/chat/${offerId}` : '/offers'
    });

    if (status === 'approved') {
      const sysMsg: ChatMessage = {
        id: `msg_sys_${Date.now()}`,
        offerId,
        senderId: 'system',
        text: 'オファーが承認されました。チャットを開始できます！',
        timestamp: new Date().toISOString(),
        unread: true,
      };
      setMessages(prev => [...prev, sysMsg]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sendMessage = (offerId: string, text: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      offerId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      unread: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, lastMessage: text } : o));
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, role, login, logout, 
      likes, toggleLike, 
      offers, sendOffer, updateOfferStatus,
      messages, sendMessage,
      notifications, markNotificationAsRead, clearNotifications
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
