import { CoupleData, DiaryEntry, ChatMessage, PhotoMemory, LoveLetter } from '../types';

const STORAGE_KEYS = {
  COUPLE_DATA: 'love_app_couple_data',
  DIARIES: 'love_app_diaries',
  MESSAGES: 'love_app_messages',
  PHOTOS: 'love_app_photos',
  LETTERS: 'love_app_letters',
  ACTIVE_USER_ROLE: 'love_app_active_role', // 'boy' | 'girl'
  MUSIC_PLAYING: 'love_app_music_playing',
  CUSTOM_HOLIDAYS: 'love_app_custom_holidays',
};

// Initial romantic mock couple
export const DEFAULT_COUPLE: CoupleData = {
  boy: {
    name: 'Hoàng Anh',
    nickname: 'Anh Gấu 🐻',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    birthday: '2002-08-15',
    zodiac: 'Sư Tử ♌',
    quote: 'Chỉ cần em cười, thế giới của anh đều rạng rỡ.',
    gender: 'boy',
  },
  girl: {
    name: 'Bảo Ngọc',
    nickname: 'Bé Mèo 🐱',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    birthday: '2003-03-20',
    zodiac: 'Song Ngư ♓',
    quote: 'Bình yên là khi có anh bên cạnh mỗi ngày.',
    gender: 'girl',
  },
  startDate: '2023-10-20', // Default start date
  startTime: '08:00',
  coupleCode: 'LOVE-' + Math.floor(1000 + Math.random() * 9000),
  theme: 'pink',
  googleUser: null,
};

export const DEFAULT_DIARIES: DiaryEntry[] = [
  {
    id: 'diary-1',
    title: 'Ngày đầu tiên chúng mình thuộc về nhau 💖',
    content: 'Buổi tối hôm đó dưới ánh đèn đường lung linh, anh đã nắm lấy tay em và ngỏ lời. Trái tim đập loạn nhịp như muốn nhảy ra ngoài lồng ngực...',
    date: '2023-10-20',
    mood: '🥰',
    photos: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80'
    ],
    author: 'boy',
    likes: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'diary-2',
    title: 'Chuyến du lịch Đà Lạt sương mù 🌸',
    content: 'Hai đứa dậy từ 5h sáng đi săn mây ở đồi Đa Phú. Trời lạnh buốt nhưng được anh kéo tay nhét vào túi áo ấm áp vô cùng. Cùng nhau ăn bánh tráng nướng nóng hổi!',
    date: '2024-02-14',
    mood: '✨',
    photos: [
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80'
    ],
    author: 'girl',
    likes: 8,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: 'diary-3',
    title: 'Một buổi tối mưa và bát mì tôm tình yêu 🍜',
    content: 'Trời mưa to hai đứa không đi chơi được, ở nhà cùng nấu bát mì tôm thêm 2 quả trứng xúc xích, xem phim hoạt hình rồi cười khúc khích cả buổi. Hạnh phúc giản đơn thế thôi!',
    date: '2024-06-18',
    mood: '💖',
    photos: [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
    ],
    author: 'both',
    likes: 12,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  }
];

export const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'boy',
    senderName: 'Anh Gấu 🐻',
    text: 'Em yêu ơi, hôm nay đi làm/học có mệt không nè? Nhớ em quá đi mất! 💖',
    timestamp: Date.now() - 1000 * 60 * 45,
    read: true,
  },
  {
    id: 'msg-2',
    sender: 'girl',
    senderName: 'Bé Mèo 🐱',
    text: 'Em cũng nhớ anh nhìu lắm á! Chiều nay mình đi ăn ốc hay trà sữa nha anh ơi? 🧋🌸',
    timestamp: Date.now() - 1000 * 60 * 30,
    read: true,
  },
  {
    id: 'msg-3',
    sender: 'boy',
    senderName: 'Anh Gấu 🐻',
    text: 'Tuân lệnh công chúa! 5h30 anh qua đón em nha 🛵💨 Yêu em!',
    timestamp: Date.now() - 1000 * 60 * 10,
    read: true,
  }
];

export const DEFAULT_PHOTOS: PhotoMemory[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'Lần đầu hẹn hò đi dạo phố đi bộ 🎈',
    date: '2023-10-25',
    location: 'Hà Nội',
    frameStyle: 'polaroid',
    likes: 10,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
    caption: 'Đón hoàng hôn bên bờ biển cùng em 🌅',
    date: '2024-04-30',
    location: 'Đà Nẵng',
    frameStyle: 'heart',
    likes: 15,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    caption: 'Trà chiều và những nụ cười tỏa nắng ☕',
    date: '2024-08-10',
    location: 'Sài Gòn',
    frameStyle: 'vintage',
    likes: 7,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  }
];

export const DEFAULT_LETTERS: LoveLetter[] = [
  {
    id: 'letter-1',
    sender: 'boy',
    senderName: 'Anh Gấu 🐻',
    title: 'Gửi người con gái anh yêu hơn cả bản thân',
    content: 'Cảm ơn em đã bước vào cuộc đời anh, biến những ngày bình thường thành chuỗi ngày ngập tràn ánh nắng và nụ cười. Dù mai này có sóng gió thế nào, bàn tay này sẽ không bao giờ buông tay em...',
    sealColor: '#ec4899',
    isOpened: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'letter-2',
    sender: 'girl',
    senderName: 'Bé Mèo 🐱',
    title: 'Hòm thư bí mật: Mở khi anh thấy nhớ em 💌',
    content: 'Nếu anh đang mở lá thư này, tức là anh đang rất nhớ em đúng không nè? Nhớ uống đủ nước và đừng thức khuya chơi game nhé! Luôn yêu anh rất nhiềuuu 💖',
    sealColor: '#f43f5e',
    isOpened: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  }
];

// Helper methods to read/write LocalStorage
export const storageService = {
  getCoupleData(): CoupleData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COUPLE_DATA);
      return data ? { ...DEFAULT_COUPLE, ...JSON.parse(data) } : DEFAULT_COUPLE;
    } catch {
      return DEFAULT_COUPLE;
    }
  },

  saveCoupleData(data: CoupleData) {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPLE_DATA, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  },

  getDiaries(): DiaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIARIES);
      return data ? JSON.parse(data) : DEFAULT_DIARIES;
    } catch {
      return DEFAULT_DIARIES;
    }
  },

  saveDiaries(diaries: DiaryEntry[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DIARIES, JSON.stringify(diaries));
    } catch (e) {
      console.error(e);
    }
  },

  getMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  },

  saveMessages(messages: ChatMessage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  },

  getPhotos(): PhotoMemory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return data ? JSON.parse(data) : DEFAULT_PHOTOS;
    } catch {
      return DEFAULT_PHOTOS;
    }
  },

  savePhotos(photos: PhotoMemory[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (e) {
      console.error(e);
    }
  },

  getLetters(): LoveLetter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LETTERS);
      return data ? JSON.parse(data) : DEFAULT_LETTERS;
    } catch {
      return DEFAULT_LETTERS;
    }
  },

  saveLetters(letters: LoveLetter[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
    } catch (e) {
      console.error(e);
    }
  },

  getActiveRole(): 'boy' | 'girl' {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ROLE) as 'boy' | 'girl') || 'boy';
  },

  setActiveRole(role: 'boy' | 'girl') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, role);
  },

  // Export full backup
  exportFullBackup(): string {
    const backup = {
      couple: this.getCoupleData(),
      diaries: this.getDiaries(),
      messages: this.getMessages(),
      photos: this.getPhotos(),
      letters: this.getLetters(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import full backup
  importFullBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.couple) this.saveCoupleData(data.couple);
      if (data.diaries) this.saveDiaries(data.diaries);
      if (data.messages) this.saveMessages(data.messages);
      if (data.photos) this.savePhotos(data.photos);
      if (data.letters) this.saveLetters(data.letters);
      return true;
    } catch {
      return false;
    }
  }
};

