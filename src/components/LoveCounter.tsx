import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Clock, 
  Calendar, 
  Share2, 
  Flame, 
  Smile, 
  Award, 
  Edit3 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoupleData } from '../types';
import { sound } from '../services/sound';
import { MILESTONE_INTERVALS } from '../constants/holidays';

interface LoveCounterProps {
  couple: CoupleData;
  onEditCouple: () => void;
}

export const LoveCounter: React.FC<LoveCounterProps> = ({ couple, onEditCouple }) => {
  const [timeDiff, setTimeDiff] = useState({
    totalDays: 0,
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [loveActionMessage, setLoveActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const startDateTimeStr = `${couple.startDate}T${couple.startTime || '00:00'}:00`;
      const start = new Date(startDateTimeStr).getTime();
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - start);

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      const startDateObj = new Date(startDateTimeStr);
      const currentDateObj = new Date();

      let years = currentDateObj.getFullYear() - startDateObj.getFullYear();
      let months = currentDateObj.getMonth() - startDateObj.getMonth();
      let days = currentDateObj.getDate() - startDateObj.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDateObj.getFullYear(), currentDateObj.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      setTimeDiff({
        totalDays,
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [couple.startDate, couple.startTime]);

  // Find next milestone
  const nextMilestone = MILESTONE_INTERVALS.find(m => m.days > timeDiff.totalDays) || {
    days: timeDiff.totalDays + 100,
    name: `Kỷ niệm ${timeDiff.totalDays + 100} Ngày`,
    icon: '🎉',
  };

  const prevMilestoneDays = MILESTONE_INTERVALS.filter(m => m.days <= timeDiff.totalDays).pop()?.days || 0;
  const daysIntoMilestone = timeDiff.totalDays - prevMilestoneDays;
  const milestoneSpan = nextMilestone.days - prevMilestoneDays;
  const progressPercent = Math.min(100, Math.max(5, Math.round((daysIntoMilestone / milestoneSpan) * 100)));
  const daysRemaining = nextMilestone.days - timeDiff.totalDays;

  // Heart confetti effect
  const triggerHeartConfetti = () => {
    sound.playSparkle();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#ec4899', '#fda4af', '#ffe4e6'],
      shapes: ['circle'],
    });
  };

  const handleHeartClick = () => {
    sound.playHeartbeat();
    triggerHeartConfetti();
    setLoveActionMessage('💖 Bùm! Hai trái tim đập cùng một nhịp!');
    setTimeout(() => setLoveActionMessage(null), 3000);
  };

  const handleSendKiss = () => {
    sound.playPop();
    setLoveActionMessage(`💋 ${couple.boy.nickname} và ${couple.girl.nickname} đã trao nhau nụ hôn ngọt ngào!`);
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#e11d48', '#fb7185']
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#e11d48', '#fb7185']
    });
    setTimeout(() => setLoveActionMessage(null), 3000);
  };

  const handleSendHug = () => {
    sound.playPop();
    setLoveActionMessage(`🤗 Trao nhau cái ôm ấm áp xua tan mọi mỏi mệt!`);
    setTimeout(() => setLoveActionMessage(null), 3000);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Action Notification Toast */}
      {loveActionMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border-2 border-pink-400 text-pink-700 font-bold px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md animate-bounce">
          {loveActionMessage}
        </div>
      )}

      {/* Hero Love Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-pink-200/80 p-6 sm:p-10 shadow-xl shadow-pink-100/70 text-center transition-all">
        {/* Glow background circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Start Date & Edit Tag */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs sm:text-sm font-semibold shadow-inner">
            <Calendar className="w-4 h-4 text-pink-500" />
            <span>Ngày bắt đầu yêu: {couple.startDate}</span>
          </div>
          <button
            onClick={onEditCouple}
            className="p-1.5 rounded-full hover:bg-pink-100 text-pink-500 transition"
            title="Chỉnh sửa thông tin ngày yêu & avatar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Couple Avatars & Center Beating Heart */}
        <div className="flex items-center justify-center gap-4 sm:gap-10 my-4 sm:my-8">
          
          {/* Boyfriend */}
          <div className="flex flex-col items-center space-y-2 group">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-sky-400 via-pink-400 to-rose-400 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src={couple.boy.avatar}
                  alt={couple.boy.name}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <span className="absolute -bottom-2 bg-sky-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                {couple.boy.zodiac || 'Boy'}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">{couple.boy.nickname}</h3>
            <p className="text-xs text-gray-500 max-w-[120px] sm:max-w-[150px] italic line-clamp-1">
              "{couple.boy.quote || 'Yêu em'}"
            </p>
          </div>

          {/* Interactive Beating Heart Connector */}
          <div className="flex flex-col items-center cursor-pointer select-none" onClick={handleHeartClick}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-pink-400/30 rounded-full animate-ping" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-400/50 hover:scale-110 active:scale-95 transition-transform">
                <Heart className="w-8 h-8 sm:w-9 sm:h-9 text-white fill-white animate-heartbeat" />
              </div>
            </div>
            <span className="text-[11px] text-pink-600 font-bold mt-2 animate-pulse">
              Chạm vào tim 💕
            </span>
          </div>

          {/* Girlfriend */}
          <div className="flex flex-col items-center space-y-2 group">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-rose-400 via-pink-400 to-pink-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src={couple.girl.avatar}
                  alt={couple.girl.name}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <span className="absolute -bottom-2 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                {couple.girl.zodiac || 'Girl'}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">{couple.girl.nickname}</h3>
            <p className="text-xs text-gray-500 max-w-[120px] sm:max-w-[150px] italic line-clamp-1">
              "{couple.girl.quote || 'Yêu anh'}"
            </p>
          </div>

        </div>

        {/* Big Days Counter Number */}
        <div className="my-6">
          <p className="text-sm font-semibold text-pink-500 uppercase tracking-widest mb-1">
            Chúng mình đã bên nhau
          </p>
          <div className="font-['Dancing_Script'] text-6xl sm:text-8xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
            {timeDiff.totalDays.toLocaleString()}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-700 tracking-wide">
            NGÀY YÊU THƯƠNG
          </p>
        </div>

        {/* Detailed Breakdown: Years, Months, Days, Hours, Mins, Secs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-2xl mx-auto my-6">
          {[
            { label: 'Năm', value: timeDiff.years },
            { label: 'Tháng', value: timeDiff.months },
            { label: 'Ngày', value: timeDiff.days },
            { label: 'Giờ', value: timeDiff.hours },
            { label: 'Phút', value: timeDiff.minutes },
            { label: 'Giây', value: timeDiff.seconds, highlight: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-3 border transition-all ${
                item.highlight
                  ? 'bg-rose-50/80 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-white/80 border-pink-100 text-gray-800'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black font-mono">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[11px] text-pink-500 font-semibold tracking-wider uppercase mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Love Interaction Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-pink-100">
          <button
            onClick={handleSendKiss}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-rose-500 hover:bg-rose-600 active:scale-95 text-white shadow-md shadow-rose-300/50 transition"
          >
            <span>💋</span>
            <span>Gửi Nụ Hôn</span>
          </button>
          <button
            onClick={handleSendHug}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-pink-500 hover:bg-pink-600 active:scale-95 text-white shadow-md shadow-pink-300/50 transition"
          >
            <span>🤗</span>
            <span>Gửi Cái Ôm</span>
          </button>
          <button
            onClick={triggerHeartConfetti}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md shadow-amber-300/50 transition"
          >
            <span>✨</span>
            <span>Bắn Pháo Tim</span>
          </button>
        </div>

      </div>

      {/* Milestone Progress Card */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-pink-200/80 p-6 sm:p-8 shadow-lg shadow-pink-100/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{nextMilestone.icon}</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                Cột mốc tiếp theo: {nextMilestone.name}
              </h4>
              <p className="text-xs text-pink-600 font-semibold">
                Còn <span className="font-bold text-rose-600 text-sm">{daysRemaining}</span> ngày nữa!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3.5 bg-pink-100 rounded-full overflow-hidden p-0.5 border border-pink-200">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 font-medium mt-1.5">
          <span>{prevMilestoneDays} Ngày</span>
          <span>Mục tiêu: {nextMilestone.days} Ngày</span>
        </div>
      </div>

    </div>
  );
};

