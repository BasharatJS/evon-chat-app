import { User } from './index';

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    messages: boolean;
    mentions: boolean;
    sounds: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    readReceipts: boolean;
  };
}

export interface UserProfileData extends User {
  settings: UserSettings;
  blockedUsers: string[];
  friends: string[];
}

export interface UserSearchResult {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isOnline: boolean;
}

export interface ContactRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    displayName: string;
    photoURL?: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}