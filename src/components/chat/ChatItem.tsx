'use client';

import { motion } from 'framer-motion';
import { Chat } from '@/types';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  currentUserId?: string;
}

export default function ChatItem({ chat, isActive, onClick, currentUserId }: ChatItemProps) {
  // Get chat display name
  const getChatName = () => {
    if (chat.type === 'group') {
      return chat.name || 'Group Chat';
    } else {
      // For private chats, show the other participant's name
      const otherParticipant = chat.participantDetails?.find(p => p.uid !== currentUserId);
      return otherParticipant?.displayName || 'Unknown User';
    }
  };

  // Get chat avatar
  const getChatAvatar = () => {
    if (chat.type === 'group') {
      return chat.groupImage || null;
    } else {
      const otherParticipant = chat.participantDetails?.find(p => p.uid !== currentUserId);
      return otherParticipant?.photoURL || null;
    }
  };

  // Get last message preview
  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return 'No messages yet';
    
    if (chat.lastMessage.type === 'image') return 'Photo';
    if (chat.lastMessage.type === 'file') return 'File';
    
    return chat.lastMessage.content || 'Message';
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    
    return date.toLocaleDateString();
  };

  const chatName = getChatName();
  const chatAvatar = getChatAvatar();
  const lastMessagePreview = getLastMessagePreview();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-3 rounded-xl transition-all duration-200 text-left ${
        isActive
          ? 'bg-gradient-to-r from-tomato-50 to-amber-50 border-2 border-tomato-200'
          : 'hover:bg-gray-50 border-2 border-transparent'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {chatAvatar ? (
            <img
              src={chatAvatar}
              alt={chatName}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {chatName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold truncate ${
              isActive ? 'text-tomato-900' : 'text-gray-900'
            }`}>
              {chatName}
            </h3>
            {chat.lastMessage && (
              <span className={`text-xs ${
                isActive ? 'text-tomato-600' : 'text-gray-500'
              }`}>
                {formatTimestamp(new Date(chat.updatedAt || ''))}
              </span>
            )}
          </div>
          
          <p className={`text-sm truncate mt-1 ${
            isActive ? 'text-tomato-700' : 'text-gray-600'
          }`}>
            {lastMessagePreview}
          </p>
          
          {/* Online indicator for private chats */}
          {chat.type === 'private' && (
            <div className="flex items-center mt-2">
              {chat.participantDetails?.some(p => p.uid !== currentUserId && p.isTyping) ? (
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-tomato-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-tomato-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-tomato-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-tomato-600 ml-1">typing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    chat.participantDetails?.some(p => p.uid !== currentUserId && p.isTyping) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-500">
                    {chat.participantDetails?.some(p => p.uid !== currentUserId && p.isTyping) ? 'Online' : 'Offline'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}