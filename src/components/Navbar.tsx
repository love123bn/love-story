import React from 'react';
import { 
  Heart, 
  Calendar, 
  BookHeart, 
  Camera, 
  MessageCircleHeart, 
  Mail, 
  Settings, 
  Music, 
  UserCheck, 
  Cloud, 
  Sparkles 
} from 'lucide-react';
import { CoupleData } from '../types';
import { sound } from '../services/sound';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  couple: CoupleData;
  activeRole: 'boy' | 'girl';
  setActiveRole: (role: 'boy' | 'girl') => void;
  daysTogether: number;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  openSettings: () => void;
  openAuthModal: () => void;
  isCloudSynced: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  couple,
  activeRole,
  setActiveRole,
  daysTogether,
  isMusicPlaying,
  toggleMusic,
  openSettings,
  openAuthModal,
  isCloudSynced,
}) => {
  const tabs = [
    { id: 'counter', label: 'Đếm Ngày', icon: Heart },
    { id: 'calendar', label: 'Lịch Lễ & Kỷ Niệm', icon: Calendar },
    { id: 'diary', label: 'Nhật Ký Tình Yêu', icon: BookHeart },
    { id: 'camera', label: 'Chụp & Album Ảnh', icon: Camera },
    { id: 'chat', label: 'Nhắn Tin', icon: MessageCircleHeart },
    { id: 'letters', label: 'Thư Tình Kỷ Niệm', icon: Mail },
  ];

  const handleTabChange = (tabId: string) => {
    sound.playPop();
    setActiveTab(tabId);
  };

  const handleToggleRole = () => {
    sound.playPop();
    const nextRole = activeRole === 'boy' ? 'girl' : 'boy';
    setActiveRole(nextRole);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-pink-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Counter Badge */}
          <div 
            onClick={() => handleTabChange('counter')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-md shadow-pink-200 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white animate-heartbeat" />
              </div>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 absolute -top-1 -right-1 animate-spin duration-1000" />
            </div>

            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <h1 className="font-['Dancing_Script'] text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Our Love
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-pink-100 text-pink-600 border border-pink-200 shadow-inner">
                  {daysTogether} Ngày
                </span>
              </div>
              <p className="text-[11px] text-pink-400 font-medium">
                {couple.boy.nickname} & {couple.girl.nickname}
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-300/50 scale-[1.02]'
                      : 'text-pink-700/80 hover:text-pink-600 hover:bg-pink-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'fill-white' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Active User Switcher */}
            <button
              onClick={handleToggleRole}
              title={`Đang thao tác với tư cách: ${activeRole === 'boy' ? couple.boy.nickname : couple.girl.nickname}. Nhấn để đổi!`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-pink-50 border border-pink-200 hover:bg-pink-100/80 text-pink-700 transition shadow-sm"
            >
              <img
                src={activeRole === 'boy' ? couple.boy.avatar : couple.girl.avatar}
                alt="Avatar"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-400"
              />
              <span className="hidden sm:inline">
                {activeRole === 'boy' ? '🐻 ' + couple.boy.nickname : '🐱 ' + couple.girl.nickname}
              </span>
            </button>

            {/* Google Sync Pill */}
            <button
              onClick={openAuthModal}
              title={isCloudSynced ? "Đã liên kết Google & đồng bộ đám mây!" : "Nhấn để liên kết Google hoặc thiết lập Firebase Sync"}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm ${
                isCloudSynced
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Cloud className={`w-3.5 h-3.5 ${isCloudSynced ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
              <span className="hidden lg:inline">{isCloudSynced ? 'Đã đồng bộ' : 'Google Sync'}</span>
            </button>

            {/* Music Toggle */}
            <button
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Tắt nhạc nền lãng mạn' : 'Bật nhạc nền lãng mạn'}
              className={`p-2 rounded-full border transition relative shadow-sm ${
                isMusicPlaying
                  ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white border-pink-400 shadow-pink-200'
                  : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
              }`}
            >
              <Music className={`w-4 h-4 ${isMusicPlaying ? 'animate-spin duration-3000' : ''}`} />
              {isMusicPlaying && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={openSettings}
              title="Cài đặt thông tin & dữ liệu"
              className="p-2 rounded-full bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 hover:rotate-45 transition duration-300 shadow-sm"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Tab Bar for Smartphone usability */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-pink-200 px-2 py-1.5 shadow-lg flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
                isActive ? 'text-rose-600 font-bold scale-105' : 'text-pink-400 hover:text-pink-600'
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-pink-100' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-rose-500 text-rose-500' : ''}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

