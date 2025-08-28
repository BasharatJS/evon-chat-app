'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const { chatId } = params;
  
  // Zustand state
  const {
    isAuthenticated,
    currentUser,
    activeChat,
    chats,
    setActiveChat,
    sendMessage,
    logout
  } = useChatStore();

  // Local state for message input
  const [message, setMessage] = useState('');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, currentUser, router]);

  // Find and set the active chat based on chatId
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setActiveChat(chat);
      } else {
        // If chat not found, redirect to chat dashboard
        router.push('/dashboard/chat');
      }
    }
  }, [chatId, chats, setActiveChat, router]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tomato-500"></div>
      </div>
    );
  }

  // Show loading if chat is not found yet
  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tomato-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
        <button
          onClick={() => router.push('/dashboard/chat')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
            <span className="text-white font-semibold">
              {getInitials(activeChat.name)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>

        {/* Logout button */}
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeChat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900">Start your conversation</h3>
              <p className="text-gray-500 mt-2">Send a message to {activeChat.name}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.senderId === currentUser.id
                      ? 'bg-gradient-to-r from-tomato-500 to-amber-500 text-white rounded-br-lg'
                      : 'bg-white text-gray-900 rounded-bl-lg border'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.senderId === currentUser.id ? 'text-white opacity-70' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-tomato-300 focus:outline-none focus:ring-4 focus:ring-tomato-500/20"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-xl transition-all duration-200 ${
              message.trim()
                ? 'bg-gradient-to-r from-tomato-500 to-amber-500 text-white hover:from-tomato-600 hover:to-amber-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}