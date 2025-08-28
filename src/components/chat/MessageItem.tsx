'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export default function MessageItem({ message, isOwn, showAvatar }: MessageItemProps) {
  const [showOptions, setShowOptions] = useState(false);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for day separator
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0">
            {showAvatar ? (
              message.senderPhoto ? (
                <img
                  src={message.senderPhoto}
                  alt={message.senderName}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {message.senderName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* Sender name (for group chats and non-own messages) */}
          {!isOwn && showAvatar && (
            <span className="text-xs text-gray-500 mb-1 px-1">
              {message.senderName}
            </span>
          )}

          {/* Message bubble */}
          <motion.div
            onHoverStart={() => setShowOptions(true)}
            onHoverEnd={() => setShowOptions(false)}
            className={`relative px-4 py-2 rounded-2xl max-w-full break-words ${
              isOwn
                ? 'bg-gradient-to-r from-tomato-500 to-amber-500 text-white'
                : 'bg-gray-100 text-gray-900'
            } ${
              isOwn
                ? 'rounded-br-lg'
                : 'rounded-bl-lg'
            }`}
          >
            {/* Message content based on type */}
            {message.type === 'text' && (
              <p className="text-sm">{message.content}</p>
            )}
            
            {message.type === 'image' && message.fileUrl && (
              <div className="space-y-2">
                <img
                  src={message.fileUrl}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg"
                />
                {message.content && (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            )}
            
            {message.type === 'file' && (
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isOwn ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.fileName || 'File'}
                  </p>
                  {message.fileSize && (
                    <p className="text-xs opacity-70">
                      {(message.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-1 ${
              isOwn ? 'text-white text-opacity-70' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
              {message.isEdited && (
                <span className="ml-2 italic">edited</span>
              )}
            </div>

            {/* Message options */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`absolute top-0 ${
                    isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
                  } flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1`}
                >
                  {/* React */}
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Reply */}
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>

                  {/* More options for own messages */}
                  {isOwn && (
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}