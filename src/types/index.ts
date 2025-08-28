// Basic types for frontend-only chat app

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface Chat {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  lastMessageTime?: Date;
}