import { create } from 'zustand';
import { AuthService } from '@/lib/auth';
import { FirestoreService } from '@/lib/firestore';
import { User, Chat, Message } from '@/types';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Remove duplicate interfaces since we're importing from types

interface ChatState {
  // Auth state
  isAuthenticated: boolean;
  currentUser: User | null;
  
  // UI state
  activeTab: 'chats' | 'users';
  activeChat: Chat | null;
  
  // Data
  onlineUsers: User[];
  chats: Chat[];
  
  // Loading states
  loading: boolean;
  chatsLoading: boolean;
  
  // Unsubscribe functions
  unsubscribeOnlineUsers: (() => void) | null;
  unsubscribeChats: (() => void) | null;
  unsubscribeMessages: (() => void) | null;
  
  // Actions
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  setActiveTab: (tab: 'chats' | 'users') => void;
  setActiveChat: (chat: Chat | null) => void;
  startChat: (user: User) => void;
  sendMessage: (content: string) => Promise<void>;
  loadUserChats: () => Promise<void>;
  loadChatMessages: (chatId: string) => Promise<void>;
  cleanup: () => void;
}

// No more mock data - using real Firestore data

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  currentUser: null,
  activeTab: 'chats',
  activeChat: null,
  onlineUsers: [],
  chats: [],
  loading: false,
  chatsLoading: false,
  unsubscribeOnlineUsers: null,
  unsubscribeChats: null,
  unsubscribeMessages: null,

  // Actions
  loginWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const user = await AuthService.signInWithEmail(email, password);
      set({ 
        isAuthenticated: true, 
        currentUser: user,
        loading: false
      });
      
      // Load user's data
      await get().loadUserChats();
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ loading: true });
      const user = await AuthService.signInWithGoogle();
      set({ 
        isAuthenticated: true, 
        currentUser: user,
        loading: false
      });
      
      // Load user's data
      await get().loadUserChats();
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true });
      const user = await AuthService.signUpWithEmail(email, password, name);
      set({ 
        isAuthenticated: true, 
        currentUser: user,
        loading: false,
        chats: [] // New users start with no chats
      });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { currentUser, cleanup } = get();
      
      // Update offline status FIRST while user is still authenticated
      if (currentUser) {
        try {
          await FirestoreService.updateUserOnlineStatus(currentUser.id, false);
        } catch (error) {
          console.warn('Failed to update offline status:', error);
        }
      }
      
      // Clean up all subscriptions BEFORE clearing state
      cleanup();
      
      // Clear state immediately
      set({ 
        isAuthenticated: false,
        currentUser: null,
        activeChat: null,
        chats: [],
        onlineUsers: [],
        activeTab: 'chats',
        loading: false,
        chatsLoading: false
      });
      
      // Sign out from Firebase (but don't update status again)
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.warn('Firebase signOut error:', error);
      }
      
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, ensure clean state
      const { cleanup } = get();
      cleanup();
      
      set({ 
        isAuthenticated: false,
        currentUser: null,
        activeChat: null,
        chats: [],
        onlineUsers: [],
        activeTab: 'chats',
        loading: false,
        chatsLoading: false
      });
    }
  },

  initializeAuth: () => {
    AuthService.onAuthStateChange(async (user) => {
      // ALWAYS cleanup first to prevent permission errors
      const { cleanup, isAuthenticated: wasAuthenticated } = get();
      
      // Only cleanup if we're transitioning states to prevent interference during manual logout
      if ((!user && wasAuthenticated) || (user && !wasAuthenticated)) {
        cleanup();
      }
      
      if (user) {
        // Check if this is a legitimate login (not during logout process)
        const currentState = get();
        if (currentState.isAuthenticated && !currentState.currentUser) {
          // This might be during logout, skip processing
          return;
        }
        
        set({ 
          isAuthenticated: true, 
          currentUser: user,
          loading: false
        });
        
        // Load user's data with error handling
        try {
          await get().loadUserChats();
        } catch (error) {
          console.warn('Failed to load user chats during auth state change:', error);
        }
        
        // Subscribe to online users with delay and additional checks
        setTimeout(() => {
          const { isAuthenticated, currentUser } = get();
          if (isAuthenticated && currentUser) {
            try {
              const unsubscribe = FirestoreService.subscribeToOnlineUsers((users) => {
                const { currentUser, isAuthenticated } = get();
                // Only process if still authenticated and have current user
                if (isAuthenticated && currentUser) {
                  const filteredUsers = users.filter(u => u.id !== currentUser?.id);
                  set({ onlineUsers: filteredUsers });
                }
              });
              set({ unsubscribeOnlineUsers: unsubscribe });
            } catch (error) {
              console.warn('Failed to subscribe to online users:', error);
            }
          }
        }, 1000);
        
      } else {
        // Only clear state if we were actually authenticated (not during manual logout)
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          set({ 
            isAuthenticated: false,
            currentUser: null,
            activeChat: null,
            chats: [],
            onlineUsers: [],
            activeTab: 'chats',
            loading: false,
            chatsLoading: false
          });
        }
      }
    });
  },
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setActiveChat: async (chat) => {
    set({ activeChat: chat });
    
    // Load messages for the selected chat
    if (chat) {
      await get().loadChatMessages(chat.id);
    }
  },
  
  startChat: async (user) => {
    const { currentUser } = get();
    
    if (!currentUser) return;
    
    try {
      // Check if private chat already exists
      let chatId = await FirestoreService.findPrivateChat(currentUser.id, user.id);
      
      if (!chatId) {
        // Create new private chat
        chatId = await FirestoreService.createChat([currentUser.id, user.id]);
      }
      
      // Find the chat in current chats list or create a temporary one
      const { chats } = get();
      let chat = chats.find(c => c.id === chatId);
      
      if (!chat) {
        // Create temporary chat object
        chat = {
          id: chatId,
          name: user.name,
          participants: [currentUser.id, user.id],
          messages: [],
        };
        
        // Add to chats list
        set({ chats: [...chats, chat] });
      }
      
      set({ activeChat: chat });
      await get().loadChatMessages(chatId);
      
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  },
  
  sendMessage: async (content) => {
    const { activeChat, currentUser } = get();
    if (!activeChat || !content.trim() || !currentUser) return;
    
    try {
      await FirestoreService.sendMessage(activeChat.id, currentUser.id, content.trim());
      // Messages will be updated via real-time listener
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  loadUserChats: async () => {
    const { currentUser, isAuthenticated } = get();
    if (!currentUser || !isAuthenticated) return;
    
    try {
      set({ chatsLoading: true });
      
      // Subscribe to user's chats
      const unsubscribe = FirestoreService.subscribeToUserChats(currentUser.id, (chats) => {
        const { isAuthenticated } = get();
        // Only update if still authenticated
        if (isAuthenticated) {
          set({ chats, chatsLoading: false });
        }
      });
      
      set({ unsubscribeChats: unsubscribe });
      
    } catch (error) {
      console.error('Error loading user chats:', error);
      set({ chatsLoading: false });
    }
  },

  loadChatMessages: async (chatId: string) => {
    const { isAuthenticated } = get();
    if (!isAuthenticated) return;
    
    try {
      // Unsubscribe from previous messages listener
      const { unsubscribeMessages } = get();
      if (unsubscribeMessages) {
        try {
          unsubscribeMessages();
        } catch (error) {
          console.warn('Error unsubscribing from previous messages:', error);
        }
      }
      
      // Subscribe to chat messages
      const unsubscribe = FirestoreService.subscribeToChatMessages(chatId, (messages) => {
        const { chats, activeChat, isAuthenticated } = get();
        
        // Only update if still authenticated
        if (!isAuthenticated) return;
        
        // Update messages in the active chat
        if (activeChat && activeChat.id === chatId) {
          const updatedActiveChat = {
            ...activeChat,
            messages,
            lastMessage: messages[messages.length - 1] || undefined
          };
          set({ activeChat: updatedActiveChat });
        }
        
        // Update messages in chats list
        const updatedChats = chats.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages, lastMessage: messages[messages.length - 1] || undefined }
            : chat
        );
        set({ chats: updatedChats });
      });
      
      set({ unsubscribeMessages: unsubscribe });
      
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  },

  cleanup: () => {
    const { unsubscribeOnlineUsers, unsubscribeChats, unsubscribeMessages } = get();
    
    try {
      if (unsubscribeOnlineUsers) {
        unsubscribeOnlineUsers();
      }
    } catch (error) {
      console.warn('Error unsubscribing from online users:', error);
    }
    
    try {
      if (unsubscribeChats) {
        unsubscribeChats();
      }
    } catch (error) {
      console.warn('Error unsubscribing from chats:', error);
    }
    
    try {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    } catch (error) {
      console.warn('Error unsubscribing from messages:', error);
    }
    
    set({
      unsubscribeOnlineUsers: null,
      unsubscribeChats: null,
      unsubscribeMessages: null,
    });
  },
}));