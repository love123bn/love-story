import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FloatingHearts } from './components/FloatingHearts';
import { LoveCounter } from './components/LoveCounter';
import { ValentineCalendar } from './components/ValentineCalendar';
import { LoveDiary } from './components/LoveDiary';
import { LoveCamera } from './components/LoveCamera';
import { LoveChat } from './components/LoveChat';
import { LoveLetters } from './components/LoveLetters';
import { SettingsModal } from './components/SettingsModal';
import { MusicPlayer } from './components/MusicPlayer';
import { storageService } from './services/storage';
import { firebaseService } from './services/firebase';
import { CoupleData, DiaryEntry, PhotoMemory, ChatMessage, LoveLetter } from './types';
import { Heart, Sparkles, Globe, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('counter');
  const [couple, setCouple] = useState<CoupleData>(() => storageService.getCoupleData());
  const [activeRole, setActiveRole] = useState<'boy' | 'girl'>(() => storageService.getActiveRole());
  const [diaries, setDiaries] = useState<DiaryEntry[]>(() => storageService.getDiaries());
  const [photos, setPhotos] = useState<PhotoMemory[]>(() => storageService.getPhotos());
  const [messages, setMessages] = useState<ChatMessage[]>(() => storageService.getMessages());
  const [letters, setLetters] = useState<LoveLetter[]>(() => storageService.getLetters());
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Compute total days together for header badge
  const daysTogether = React.useMemo(() => {
    const start = new Date(`${couple.startDate}T${couple.startTime || '00:00'}:00`).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  }, [couple.startDate, couple.startTime]);

  // Handle active role switch
  const handleRoleChange = (newRole: 'boy' | 'girl') => {
    setActiveRole(newRole);
    storageService.setActiveRole(newRole);
  };

  // Check cloud connection & Firebase initialization
  useEffect(() => {
    const isInit = firebaseService.init();
    setIsCloudSynced(isInit && !!couple.googleUser);

    const unsubAuth = firebaseService.onAuth((user) => {
      if (user) {
        setIsCloudSynced(true);
      }
    });

    return () => unsubAuth();
  }, [couple.googleUser]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#fff0f5] via-[#fff5f7] to-[#fce4ec] selection:bg-pink-300 selection:text-pink-900 overflow-x-hidden font-['Quicksand']">
      
      {/* Interactive Floating Hearts & Petals Background Canvas */}
      <FloatingHearts />

      {/* Top Glass Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        couple={couple}
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
        daysTogether={daysTogether}
        isMusicPlaying={isMusicPlaying}
        toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
        openSettings={() => setIsSettingsOpen(true)}
        openAuthModal={() => setIsSettingsOpen(true)}
        isCloudSynced={isCloudSynced}
      />

      {/* Main Tab Views */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'counter' && (
          <LoveCounter
            couple={couple}
            onEditCouple={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <ValentineCalendar couple={couple} />
        )}

        {activeTab === 'diary' && (
          <LoveDiary
            diaries={diaries}
            setDiaries={setDiaries}
            couple={couple}
            activeRole={activeRole}
          />
        )}

        {activeTab === 'camera' && (
          <LoveCamera
            photos={photos}
            setPhotos={setPhotos}
            couple={couple}
          />
        )}

        {activeTab === 'chat' && (
          <LoveChat
            messages={messages}
            setMessages={setMessages}
            couple={couple}
            activeRole={activeRole}
          />
        )}

        {activeTab === 'letters' && (
          <LoveLetters
            letters={letters}
            setLetters={setLetters}
            couple={couple}
            activeRole={activeRole}
          />
        )}
      </main>

      {/* Ambient Romantic Background Music Player */}
      <MusicPlayer
        isPlaying={isMusicPlaying}
        setIsPlaying={setIsMusicPlaying}
      />

      {/* Settings & Firebase Sync Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        couple={couple}
        setCouple={setCouple}
      />

      {/* Romantic Footer */}
      <footer className="relative z-10 border-t border-pink-200/60 bg-white/40 backdrop-blur-md py-6 text-center text-xs text-pink-700/80 space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-['Dancing_Script'] text-lg font-bold text-rose-600">
          <span>{couple.boy.nickname}</span>
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-heartbeat inline" />
          <span>{couple.girl.nickname}</span>
        </div>
        <p className="text-gray-500 text-[11px]">
          Mỗi giây phút bên em đều là món quà tuyệt vời nhất của cuộc đời anh.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
          <span>Sẵn sàng triển khai 1-click lên GitHub Pages</span>
          <span>•</span>
          <button onClick={() => setIsSettingsOpen(true)} className="underline hover:text-pink-600">
            Cài đặt & Đồng bộ đám mây
          </button>
        </div>
      </footer>

    </div>
  );
}

export default App;
