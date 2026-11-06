export interface PartnerProfile {
  name: string;
  nickname: string;
  avatar: string;
  birthday: string;
  zodiac: string;
  quote: string;
  gender: 'boy' | 'girl';
}

export interface CoupleData {
  boy: PartnerProfile;
  girl: PartnerProfile;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  coverImage?: string;
  coupleCode: string;
  passcode?: string;
  theme: string;
  googleUser?: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
  } | null;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  mood: string;
  photos: string[];
  author: 'boy' | 'girl' | 'both';
  likes: number;
  likedBy?: string[];
  createdAt: number;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string; // MM-DD or YYYY-MM-DD
  meaning: string;
  activity: string;
  category: 'valentine' | 'milestone' | 'custom';
  icon: string;
  targetDays?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'boy' | 'girl';
  senderName: string;
  text: string;
  mediaUrl?: string;
  sticker?: string;
  timestamp: number;
  read: boolean;
}

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
  frameStyle: 'polaroid' | 'heart' | 'vintage' | 'minimal';
  likes: number;
  createdAt: number;
}

export interface LoveLetter {
  id: string;
  sender: 'boy' | 'girl';
  senderName: string;
  title: string;
  content: string;
  sealColor: string;
  unlockDate?: string; // YYYY-MM-DD (e.g. only open on Valentine or 1-year anniversary)
  isOpened: boolean;
  createdAt: number;
}
