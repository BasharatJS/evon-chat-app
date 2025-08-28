'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

export default function ChatDashboard() {
  const router = useRouter();
  
  // Zustand state
  const {
    isAuthenticated,
    currentUser,
    activeTab,
    activeChat,
    onlineUsers,
    chats,
    setActiveTab,
    setActiveChat,
    startChat,
    sendMessage,
    logout
  } = useChatStore();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, currentUser, router]);

  // Local state for message input
  const [message, setMessage] = useState('');

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

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-tomato-500 to-amber-500 bg-clip-text text-transparent">
            EvonChat
          </h1>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getInitials(currentUser.name)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'chats'
                ? 'text-tomato-600 border-b-2 border-tomato-500 bg-tomato-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Chats ({chats.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-tomato-600 border-b-2 border-tomato-500 bg-tomato-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Online ({onlineUsers.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'chats' ? (
            chats.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">No chats yet</h3>
                <p className="text-gray-500 text-sm mt-1">Start a conversation from the Online tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full p-3 rounded-xl transition-all duration-200 text-left border-2 ${
                      activeChat?.id === chat.id
                        ? 'bg-tomato-50 border-tomato-200'
                        : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {getInitials(chat.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Online Users</h3>
              {onlineUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    console.log('Starting chat with:', user.name);
                    startChat(user);
                    setActiveTab('chats'); // Switch to chats tab after starting
                  }}
                  className="w-full p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left border-2 border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-sm text-green-600 font-medium">Online</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-tomato-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-tomato-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setActiveTab('users')}
            className="w-full bg-gradient-to-r from-tomato-500 to-amber-500 text-white py-2 px-4 rounded-xl font-medium hover:from-tomato-600 hover:to-amber-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
          {activeChat ? (
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
          ) : (
            <h1 className="text-xl font-semibold text-gray-500">Select a chat</h1>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeChat ? (
            activeChat.messages.length === 0 ? (
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
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to EvonChat</h3>
                <p className="text-gray-600">Select a user from the Online tab to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeChat && (
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
        )}
      </div>
    </div>
  );
}