import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Heart, 
  Sparkles, 
  Plus, 
  Clock, 
  Gift, 
  Compass, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { VALENTINE_HOLIDAYS, MILESTONE_INTERVALS } from '../constants/holidays';
import { CoupleData } from '../types';
import { sound } from '../services/sound';

interface CustomHoliday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  meaning: string;
  category: 'custom';
  icon: string;
}

interface ValentineCalendarProps {
  couple: CoupleData;
}

export const ValentineCalendar: React.FC<ValentineCalendarProps> = ({ couple }) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'valentine' | 'milestones' | 'custom'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customList, setCustomList] = useState<CustomHoliday[]>(() => {
    try {
      const saved = localStorage.getItem('love_app_custom_holidays');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'cust-1',
        name: `Sinh nhật ${couple.boy.nickname} 🎂`,
        date: couple.boy.birthday || '2002-08-15',
        meaning: 'Ngày đặc biệt của chàng trai tuyệt vời nhất thế gian!',
        category: 'custom',
        icon: '👑',
      },
      {
        id: 'cust-2',
        name: `Sinh nhật ${couple.girl.nickname} 🌸`,
        date: couple.girl.birthday || '2003-03-20',
        meaning: 'Ngày công chúa nhỏ đáng yêu chào đời!',
        category: 'custom',
        icon: '🎀',
      },
    ];
  });

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newIcon, setNewIcon] = useState('💖');

  const saveCustomList = (items: CustomHoliday[]) => {
    setCustomList(items);
    localStorage.setItem('love_app_custom_holidays', JSON.stringify(items));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) return;
    sound.playSparkle();

    const newItem: CustomHoliday = {
      id: 'cust-' + Date.now(),
      name: newName.trim(),
      date: newDate,
      meaning: newMeaning.trim() || 'Kỷ niệm ngọt ngào của hai đứa mình',
      category: 'custom',
      icon: newIcon,
    };

    saveCustomList([newItem, ...customList]);
    setNewName('');
    setNewDate('');
    setNewMeaning('');
    setShowAddModal(false);
  };

  const handleDeleteCustom = (id: string) => {
    sound.playPop();
    saveCustomList(customList.filter((item) => item.id !== id));
  };

  // Compute countdowns & combine events
  const allEvents = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // 1. Process Valentine 12 Days (every month on the 14th)
    const valentines = VALENTINE_HOLIDAYS.map((v) => {
      const [m, d] = v.date.split('-').map(Number);
      let targetDate = new Date(currentYear, m - 1, d);
      // If already passed this year, look at next year
      if (targetDate.getTime() < todayTimestamp) {
        targetDate = new Date(currentYear + 1, m - 1, d);
      }
      const diffMs = targetDate.getTime() - todayTimestamp;
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        ...v,
        computedDateStr: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`,
        targetDate,
        daysLeft,
        isToday: daysLeft === 0,
      };
    });

    // 2. Process Milestones
    const startDate = new Date(couple.startDate);
    const milestones = MILESTONE_INTERVALS.map((m, index) => {
      const targetDate = new Date(startDate.getTime() + m.days * 24 * 60 * 60 * 1000);
      const diffMs = targetDate.getTime() - todayTimestamp;
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        id: `milestone-${index}`,
        name: m.name,
        date: targetDate.toISOString().split('T')[0],
        computedDateStr: `${targetDate.getDate()}/${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`,
        meaning: `Cột mốc thiêng liêng: ${m.days} ngày tình yêu được vun đắp từ những điều nhỏ bé nhất.`,
        activity: 'Tổ chức tiệc nhỏ kỷ niệm, ôn lại những bức ảnh và kỷ niệm đã qua!',
        category: 'milestone' as const,
        icon: m.icon,
        targetDate,
        daysLeft,
        isToday: daysLeft === 0,
      };
    });

    // 3. Process Custom holidays
    const customs = customList.map((c) => {
      const parts = c.date.split('-');
      let targetDate = new Date(currentYear, Number(parts[1]) - 1, Number(parts[2]));
      if (targetDate.getTime() < todayTimestamp) {
        targetDate = new Date(currentYear + 1, Number(parts[1]) - 1, Number(parts[2]));
      }
      const diffMs = targetDate.getTime() - todayTimestamp;
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        ...c,
        computedDateStr: `${parts[2]}/${parts[1]}`,
        activity: 'Dành trọn thời gian bên nhau trong ngày đặc biệt này!',
        targetDate,
        daysLeft,
        isToday: daysLeft === 0,
      };
    });

    const combined = [...valentines, ...milestones, ...customs];
    combined.sort((a, b) => a.daysLeft - b.daysLeft);
    return combined;
  }, [couple.startDate, customList]);

  // Filter items
  const filteredEvents = useMemo(() => {
    if (filter === 'upcoming') {
      return allEvents.filter((e) => e.daysLeft >= 0 && e.daysLeft <= 90);
    }
    if (filter === 'valentine') {
      return allEvents.filter((e) => e.category === 'valentine');
    }
    if (filter === 'milestones') {
      return allEvents.filter((e) => e.category === 'milestone');
    }
    if (filter === 'custom') {
      return allEvents.filter((e) => e.category === 'custom');
    }
    return allEvents;
  }, [allEvents, filter]);

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold border border-pink-200">
          <Calendar className="w-4 h-4 text-rose-500" />
          <span>Lịch Các Ngày Lễ Tình Nhân & Kỷ Niệm Yêu Nhau</span>
        </div>
        <h2 className="font-['Dancing_Script'] text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
          Những Ngày Ngọt Ngào Trong Năm
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Bạn có biết mỗi tháng trong năm đều có một ngày Valentine với ý nghĩa riêng không? Cùng theo dõi các ngày lễ và chuẩn bị bất ngờ cho nửa kia nhé!
        </p>
      </div>

      {/* Filter Tabs & Add Custom Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-md p-2 rounded-2xl border border-pink-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'upcoming', label: 'Sắp tới (90 ngày)' },
            { id: 'valentine', label: '12 Ngày Valentine' },
            { id: 'milestones', label: 'Cột mốc yêu nhau' },
            { id: 'custom', label: 'Kỷ niệm riêng' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setFilter(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                filter === tab.id
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'text-pink-700 hover:bg-pink-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm ngày kỷ niệm</span>
        </button>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredEvents.map((item) => {
          const isPassed = item.daysLeft < 0;
          const isToday = item.daysLeft === 0;

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isToday
                  ? 'bg-gradient-to-br from-rose-50 via-white to-pink-50 border-rose-400 ring-2 ring-rose-400/50 shadow-rose-100'
                  : 'bg-white/85 backdrop-blur-md border-pink-200/80 shadow-md shadow-pink-100/50'
              }`}
            >
              {/* Category indicator line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.category === 'valentine'
                    ? 'bg-gradient-to-r from-pink-400 to-rose-500'
                    : item.category === 'milestone'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-purple-400 to-pink-500'
                }`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg leading-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-pink-600">
                        {item.computedDateStr}
                      </span>
                      <span className="text-[11px] text-gray-400 capitalize">
                        {item.category === 'valentine'
                          ? 'Valentine hàng tháng'
                          : item.category === 'milestone'
                          ? 'Cột mốc ngày yêu'
                          : 'Kỷ niệm riêng'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Days remaining badge */}
                <div className="shrink-0 text-right">
                  {isToday ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200">
                      <Sparkles className="w-3.5 h-3.5" /> Hôm nay!
                    </span>
                  ) : isPassed ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                      Đã qua {Math.abs(item.daysLeft)} ngày
                    </span>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 font-medium">Còn</span>
                      <span className="text-lg font-black text-rose-600 font-mono leading-none">
                        {item.daysLeft}
                      </span>
                      <span className="text-[10px] text-gray-500">ngày nữa</span>
                    </div>
                  )}

                  {item.category === 'custom' && (
                    <button
                      onClick={() => handleDeleteCustom(item.id)}
                      className="mt-2 text-gray-400 hover:text-red-500 p-1 transition"
                      title="Xóa ngày này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Meaning & romantic notes */}
              <div className="mt-4 pt-3 border-t border-pink-100 space-y-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-pink-700">Ý nghĩa: </span>
                  {item.meaning}
                </p>
                {item.activity && (
                  <div className="flex items-start gap-1.5 p-2 rounded-xl bg-pink-50/70 text-[12px] text-pink-800 font-medium border border-pink-100">
                    <Gift className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span>Gợi ý: {item.activity}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Anniversary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-pink-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                Thêm Ngày Kỷ Niệm Mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Tên ngày kỷ niệm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kỷ niệm chuyến đi biển đầu tiên 🌊"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">Ngày diễn ra *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Biểu tượng (Icon)</label>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                  >
                    <option value="💖">💖 Trái tim</option>
                    <option value="💍">💍 Nhẫn đôi</option>
                    <option value="🎂">🎂 Sinh nhật</option>
                    <option value="🏖️">🏖️ Du lịch biển</option>
                    <option value="🌹">🌹 Hoa hồng</option>
                    <option value="🎬">🎬 Xem phim</option>
                    <option value="☕">☕ Hẹn hò cà phê</option>
                    <option value="✨">✨ Lấp lánh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Lời nhắn / Ý nghĩa</label>
                <textarea
                  rows={2}
                  placeholder="Nhắc nhở hoặc ghi chú điều muốn làm cùng nhau..."
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:opacity-95 transition"
                >
                  Lưu ngày này 💕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
