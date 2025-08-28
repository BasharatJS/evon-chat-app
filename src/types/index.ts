// Basic types for frontend-only chat app

export interface User {
  id: string;
  uid?: string;
  name: string;
  displayName?: string;
  email: string;
  avatar?: string;
  photoURL?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isEdited?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  lastMessageTime?: Date;
  updatedAt?: Date;
  type?: 'private' | 'group';
  groupImage?: string;
  participantDetails?: ChatParticipant[];
}

export interface TypingIndicator {
  userId: string;
  chatId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ChatParticipant {
  uid: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  isTyping?: boolean;
}