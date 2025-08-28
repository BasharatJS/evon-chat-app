'use client';

import { motion } from 'framer-motion';
import { User } from '@/types';

interface OnlineUsersProps {
  users: User[];
  currentUser: User | null;
  onUserSelect: (user: User) => void;
}

export default function OnlineUsers({ users, currentUser, onUserSelect }: OnlineUsersProps) {
  console.log('OnlineUsers rendered with:', { usersCount: users.length, currentUser: currentUser?.displayName });
  
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="text-gray-500 text-sm mt-1">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-2">
        {users.map((user, index) => (
          <button
            key={user.uid}
            onClick={() => {
              console.log('User clicked:', user.displayName);
              onUserSelect(user);
            }}
            className="w-full p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left border-2 border-transparent hover:border-gray-200"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tomato-500 to-amber-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {user.displayName}
                </h3>
                <p className="text-sm text-green-600 font-medium">Online</p>
              </div>

              {/* Chat icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-tomato-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-tomato-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}