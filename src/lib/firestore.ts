import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Chat, Message } from '@/types';
import { FIREBASE_COLLECTIONS } from '@/constants/firebase';

export class FirestoreService {
  // ================== USER OPERATIONS ==================
  
  // Create or update user document
  static async createUserDocument(user: User): Promise<void> {
    const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, user.id);
    
    await setDoc(userRef, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      isOnline: true,
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          isOnline: data.isOnline || false,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Update user online status
  static async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      isOnline,
      lastSeen: serverTimestamp(),
    });
  }

  // Get all online users
  static async getOnlineUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, FIREBASE_COLLECTIONS.USERS);
      const q = query(usersRef, where('isOnline', '==', true));
      const querySnapshot = await getDocs(q);
      
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error getting online users:', error);
      return [];
    }
  }

  // Listen to online users
  static subscribeToOnlineUsers(callback: (users: User[]) => void) {
    const usersRef = collection(db, FIREBASE_COLLECTIONS.USERS);
    const q = query(usersRef, where('isOnline', '==', true));
    
    return onSnapshot(q, (querySnapshot) => {
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      callback(users);
    }, (error) => {
      console.warn('Error in online users listener:', error);
      // Don't callback on error to prevent crashes
    });
  }

  // ================== CHAT OPERATIONS ==================
  
  // Create a new chat
  static async createChat(participants: string[], chatName?: string): Promise<string> {
    const chatRef = await addDoc(collection(db, FIREBASE_COLLECTIONS.CHATS), {
      participants,
      name: chatName || '',
      type: participants.length > 2 ? 'group' : 'private',
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null,
    });
    
    return chatRef.id;
  }

  // Get user's chats
  static async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const chatsRef = collection(db, FIREBASE_COLLECTIONS.CHATS);
      const q = query(
        chatsRef, 
        where('participants', 'array-contains', userId)
        // Remove orderBy to avoid index requirement - we'll sort in JS
      );
      
      const querySnapshot = await getDocs(q);
      const chats: Chat[] = [];
      
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        
        // Get chat name (for private chats, use other participant's name)
        let chatName = data.name;
        if (!chatName && data.participants.length === 2) {
          const otherUserId = data.participants.find((id: string) => id !== userId);
          if (otherUserId) {
            const otherUser = await this.getUserById(otherUserId);
            chatName = otherUser?.name || 'Unknown User';
          }
        }
        
        chats.push({
          id: docSnap.id,
          name: chatName || 'Unnamed Chat',
          participants: data.participants,
          messages: [], // Messages loaded separately
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime?.toDate() || new Date(0),
        });
      }
      
      // Sort chats by lastMessageTime in JavaScript (newest first)
      chats.sort((a, b) => {
        const timeA = a.lastMessageTime || new Date(0);
        const timeB = b.lastMessageTime || new Date(0);
        return timeB.getTime() - timeA.getTime();
      });
      
      return chats;
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  }

  // Listen to user's chats
  static subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void) {
    const chatsRef = collection(db, FIREBASE_COLLECTIONS.CHATS);
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId)
      // Remove orderBy to avoid index requirement - we'll sort in JS
    );
    
    return onSnapshot(q, async (querySnapshot) => {
      const chats: Chat[] = [];
      
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        
        // Get chat name
        let chatName = data.name;
        if (!chatName && data.participants.length === 2) {
          const otherUserId = data.participants.find((id: string) => id !== userId);
          if (otherUserId) {
            const otherUser = await this.getUserById(otherUserId);
            chatName = otherUser?.name || 'Unknown User';
          }
        }
        
        chats.push({
          id: docSnap.id,
          name: chatName || 'Unnamed Chat',
          participants: data.participants,
          messages: [],
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime?.toDate() || new Date(0),
        });
      }
      
      // Sort chats by lastMessageTime in JavaScript (newest first)
      chats.sort((a, b) => {
        const timeA = a.lastMessageTime || new Date(0);
        const timeB = b.lastMessageTime || new Date(0);
        return timeB.getTime() - timeA.getTime();
      });
      
      callback(chats);
    }, (error) => {
      console.warn('Error in user chats listener:', error);
      // Don't callback on error to prevent crashes
    });
  }

  // ================== MESSAGE OPERATIONS ==================
  
  // Send a message
  static async sendMessage(chatId: string, senderId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<void> {
    const messageData = {
      senderId,
      content,
      type,
      timestamp: serverTimestamp(),
    };
    
    // Add message to messages subcollection
    await addDoc(collection(db, `${FIREBASE_COLLECTIONS.CHATS}/${chatId}/${FIREBASE_COLLECTIONS.MESSAGES}`), messageData);
    
    // Update chat's last message
    const chatRef = doc(db, FIREBASE_COLLECTIONS.CHATS, chatId);
    await updateDoc(chatRef, {
      lastMessage: {
        id: '', // Will be updated by trigger
        senderId,
        content,
        timestamp: new Date(),
        type,
      },
      lastMessageTime: serverTimestamp(),
    });
  }

  // Get messages for a chat
  static async getChatMessages(chatId: string, limitCount: number = 50): Promise<Message[]> {
    try {
      const messagesRef = collection(db, `${FIREBASE_COLLECTIONS.CHATS}/${chatId}/${FIREBASE_COLLECTIONS.MESSAGES}`);
      const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(limitCount));
      
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type || 'text',
        });
      });
      
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  // Listen to chat messages
  static subscribeToChatMessages(chatId: string, callback: (messages: Message[]) => void) {
    const messagesRef = collection(db, `${FIREBASE_COLLECTIONS.CHATS}/${chatId}/${FIREBASE_COLLECTIONS.MESSAGES}`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type || 'text',
        });
      });
      callback(messages);
    }, (error) => {
      console.warn('Error in chat messages listener:', error);
      // Don't callback on error to prevent crashes
    });
  }

  // ================== HELPER METHODS ==================
  
  // Check if chat exists between users
  static async findPrivateChat(userId1: string, userId2: string): Promise<string | null> {
    try {
      const chatsRef = collection(db, FIREBASE_COLLECTIONS.CHATS);
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId1),
        where('type', '==', 'private')
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(userId2)) {
          return doc.id;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding private chat:', error);
      return null;
    }
  }
}