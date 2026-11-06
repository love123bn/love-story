import React, { useState } from 'react';
import { 
  Mail, 
  Heart, 
  Lock, 
  Unlock, 
  Plus, 
  Sparkles, 
  Calendar, 
  Clock, 
  Trash2 
} from 'lucide-react';
import { LoveLetter, CoupleData } from '../types';
import { sound } from '../services/sound';

interface LoveLettersProps {
  letters: LoveLetter[];
  setLetters: React.Dispatch<React.SetStateAction<LoveLetter[]>>;
  couple: CoupleData;
  activeRole: 'boy' | 'girl';
}

export const LoveLetters: React.FC<LoveLettersProps> = ({
  letters,
  setLetters,
  couple,
  activeRole,
}) => {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [readingLetter, setReadingLetter] = useState<LoveLetter | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [sealColor, setSealColor] = useState('#f43f5e');

  const handleWriteLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    sound.playSparkle();

    const senderName = activeRole === 'boy' ? couple.boy.nickname : couple.girl.nickname;

    const newLetter: LoveLetter = {
      id: 'letter-' + Date.now(),
      sender: activeRole,
      senderName,
      title: title.trim(),
      content: content.trim(),
      sealColor,
      unlockDate: unlockDate || undefined,
      isOpened: !unlockDate,
      createdAt: Date.now(),
    };

    const updated = [newLetter, ...letters];
    setLetters(updated);
    localStorage.setItem('love_app_letters', JSON.stringify(updated));

    setTitle('');
    setContent('');
    setUnlockDate('');
    setShowWriteModal(false);
  };

  const handleOpenLetter = (letter: LoveLetter) => {
    sound.playPop();

    // Check if locked
    if (letter.unlockDate) {
      const today = new Date().toISOString().split('T')[0];
      if (today < letter.unlockDate) {
        sound.playHeartbeat();
        alert(`Bức thư này được niêm phong kỹ lưỡng! Chỉ có thể mở ra vào ngày: ${letter.unlockDate} 💕 Hãy kiên nhẫn chờ đợi điều bất ngờ nhé!`);
        return;
      }
    }

    sound.playSparkle();

    // Mark as opened
    if (!letter.isOpened) {
      setLetters((prev) => {
        const updated = prev.map((l) =>
          l.id === letter.id ? { ...l, isOpened: true } : l
        );
        localStorage.setItem('love_app_letters', JSON.stringify(updated));
        return updated;
      });
    }

    setReadingLetter(letter);
  };

  const handleDeleteLetter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xóa lá thư này?')) return;
    sound.playPop();
    const updated = letters.filter((l) => l.id !== id);
    setLetters(updated);
    localStorage.setItem('love_app_letters', JSON.stringify(updated));
    if (readingLetter?.id === id) setReadingLetter(null);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold border border-pink-200">
          <Mail className="w-4 h-4 text-rose-500" />
          <span>Hòm Thư Niêm Phong & Lời Hứa Tương Lai</span>
        </div>
        <h2 className="font-['Dancing_Script'] text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          Những Lá Thư Chưa Từng Nói
        </h2>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Viết thư gửi cho đối phương và hẹn ngày mở ra (vào lễ tình nhân, sinh nhật, hoặc khi tròn 1 năm yêu nhau)!
        </p>
      </div>

      {/* Write Letter Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            sound.playPop();
            setShowWriteModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Viết Thư Tình Mới 💌</span>
        </button>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {letters.map((letter) => {
          const isTimeLocked = letter.unlockDate && new Date().toISOString().split('T')[0] < letter.unlockDate;

          return (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className="relative bg-gradient-to-br from-amber-50/70 via-pink-50/50 to-white rounded-3xl p-6 border-2 border-pink-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              {/* Wax Seal Circle */}
              <div
                className="w-12 h-12 rounded-full absolute -top-4 right-6 flex items-center justify-center shadow-lg text-white font-bold group-hover:scale-110 transition-transform"
                style={{ backgroundColor: letter.sealColor || '#f43f5e' }}
              >
                {isTimeLocked ? <Lock className="w-5 h-5" /> : <Heart className="w-5 h-5 fill-white" />}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-600">
                  <Mail className="w-4 h-4 text-pink-400" />
                  <span>Từ: {letter.senderName}</span>
                </div>

                <h3 className="font-['Dancing_Script'] text-2xl font-bold text-gray-800 line-clamp-1">
                  {letter.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 italic font-serif">
                  {isTimeLocked
                    ? '🔒 Lá thư đã được niêm phong cẩn thận. Bạn không thể xem trước nội dung cho tới ngày hẹn!'
                    : letter.content}
                </p>

                <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {letter.unlockDate
                        ? `Mở ngày: ${letter.unlockDate}`
                        : `Viết ngày: ${new Date(letter.createdAt).toLocaleDateString('vi-VN')}`}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteLetter(letter.id, e)}
                    className="p-1 text-gray-300 hover:text-red-500 transition"
                    title="Xóa lá thư này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write Letter Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                Viết Thư Niêm Phong Yêu Thương
              </h3>
              <button
                onClick={() => setShowWriteModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWriteLetter} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Tựa đề lá thư *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Gửi em của 1 năm sau..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  Ngày hẹn mở thư (Tùy chọn - để trống nếu muốn mở bất kỳ lúc nào)
                </label>
                <input
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Nội dung tâm thư *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Viết những điều bạn muốn nhắn nhủ, những lời hứa ngọt ngào nhất..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full mt-1 p-4 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none font-serif leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-[1.02] transition"
                >
                  Niêm phong lá thư 💌
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read Letter Modal */}
      {readingLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-xl w-full bg-[#fdfbf7] border-4 border-amber-200 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <span className="text-xs font-bold text-amber-700 tracking-wider uppercase flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                Lá thư từ {readingLetter.senderName}
              </span>
              <button
                onClick={() => setReadingLetter(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="font-['Dancing_Script'] text-3xl sm:text-4xl font-bold text-gray-900 text-center">
                {readingLetter.title}
              </h2>

              <div className="p-4 sm:p-6 bg-white/70 rounded-2xl border border-amber-100 text-gray-800 font-serif leading-loose text-base sm:text-lg whitespace-pre-line shadow-inner">
                {readingLetter.content}
              </div>

              <div className="text-right font-['Dancing_Script'] text-2xl text-rose-600">
                Mãi yêu em/anh, <br />
                {readingLetter.senderName} 💕
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setReadingLetter(null)}
                className="px-8 py-2 rounded-full text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 shadow transition"
              >
                Gấp thư lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

