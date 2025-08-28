'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat } from '@/types';

interface ChatHeaderProps {
  chat: Chat | null;
  currentUserId?: string;
  onSidebarToggle: () => void;
}

export default function ChatHeader({ chat, currentUserId, onSidebarToggle }: ChatHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  if (!chat) {
    return (
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-gray-500">Select a chat</h2>
        </div>
      </div>
    );
  }

  // Get chat display info
  const getChatInfo = () => {
    if (chat.type === 'group') {
      return {
        name: chat.name || 'Group Chat',
        subtitle: `${chat.participants.length} members`,
        avatar: chat.groupImage
      };
    } else {
      const otherParticipant = chat.participantDetails?.find(p => p.uid !== currentUserId);
      return {
        name: otherParticipant?.displayName || 'Unknown User',
        subtitle: 'Online', // You can enhance this with real online status
        avatar: otherParticipant?.photoURL
      };
    }
  };

  const chatInfo = getChatInfo();

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 relative">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Chat Avatar */}
        <motion.button
          onClick={() => setShowInfo(!showInfo)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {chatInfo.avatar ? (
            <img
              src={chatInfo.avatar}
              alt={chatInfo.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {chatInfo.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {chat.type === 'private' && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </motion.button>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {chatInfo.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {chatInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Video Call */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </motion.button>

        {/* Voice Call */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </motion.button>

        {/* More Options */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </motion.button>
      </div>

      {/* Chat Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-full right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-6"
          >
            <div className="text-center mb-6">
              {chatInfo.avatar ? (
                <img
                  src={chatInfo.avatar}
                  alt={chatInfo.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {chatInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900">
                {chatInfo.name}
              </h3>
              <p className="text-gray-500">{chatInfo.subtitle}</p>
            </div>

            {chat.type === 'group' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Members</h4>
                {chat.participantDetails?.map((participant) => (
                  <div key={participant.uid} className="flex items-center space-x-3">
                    {participant.photoURL ? (
                      <img
                        src={participant.photoURL}
                        alt={participant.displayName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {participant.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {participant.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for closing info panel */}
      {showInfo && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowInfo(false)}
        />
      )}
    </div>
  );
}