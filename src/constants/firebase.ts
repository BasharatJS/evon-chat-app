export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  CHATS: 'chats',
  MESSAGES: 'messages',
  PRESENCE: 'presence',
  TYPING: 'typing',
  CONTACT_REQUESTS: 'contactRequests',
  CHAT_INVITES: 'chatInvites',
  UPLOADS: 'uploads',
} as const;

export const FIREBASE_STORAGE_PATHS = {
  CHAT_FILES: 'chat-files',
  PROFILE_PICTURES: 'profile-pictures',
  GROUP_IMAGES: 'group-images',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
} as const;

export const CHAT_TYPES = {
  PRIVATE: 'private',
  GROUP: 'group',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
} as const;

export const PRESENCE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
export const TYPING_TIMEOUT = 3 * 1000; // 3 seconds
export const MESSAGE_PAGE_SIZE = 50;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];