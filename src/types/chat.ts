import { Chat, Message, TypingIndicator, ChatParticipant } from './index';

export interface CreateChatData {
  name?: string;
  type: 'private' | 'group';
  participants: string[];
  groupImage?: string;
}

export interface SendMessageData {
  chatId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatState {
  activeChat: Chat | null;
  chats: Chat[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  typingUsers: TypingIndicator[];
}

export interface MessageState {
  messages: { [chatId: string]: Message[] };
  loading: boolean;
  hasMore: boolean;
  lastDoc: any;
}

export interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

export interface MessageProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}