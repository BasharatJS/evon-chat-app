'use client';

import { motion } from 'framer-motion';
import { Chat } from '@/types';
import ChatItem from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  currentUserId?: string;
}

export default function ChatList({ chats, activeChat, onChatSelect, currentUserId }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">No chats yet</h3>
            <p className="text-gray-500 text-sm mt-1">Start a conversation with someone from the Online tab</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-2">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <ChatItem
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => onChatSelect(chat)}
              currentUserId={currentUserId}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}