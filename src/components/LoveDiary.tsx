import React, { useState } from 'react';
import { 
  BookHeart, 
  Heart, 
  Plus, 
  Calendar, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  Search, 
  Smile, 
  Upload, 
  X,
  MessageSquare
} from 'lucide-react';
import { DiaryEntry, CoupleData } from '../types';
import { sound } from '../services/sound';
import { firebaseService } from '../services/firebase';

interface LoveDiaryProps {
  diaries: DiaryEntry[];
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  couple: CoupleData;
  activeRole: 'boy' | 'girl';
}

const MOODS = [
  { emoji: '🥰', label: 'Ngọt ngào' },
  { emoji: '💖', label: 'Hạnh phúc' },
  { emoji: '🥺', label: 'Xúc động' },
  { emoji: '🌸', label: 'Bình yên' },
  { emoji: '🍜', label: 'Ăn ngon' },
  { emoji: '🏖️', label: 'Du lịch' },
  { emoji: '🎉', label: 'Ăn mừng' },
  { emoji: '✨', label: 'Đặc biệt' },
];

export const LoveDiary: React.FC<LoveDiaryProps> = ({
  diaries,
  setDiaries,
  couple,
  activeRole,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('🥰');
  const [author, setAuthor] = useState<'boy' | 'girl' | 'both'>(activeRole);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image upload from file input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    sound.playPop();
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrls((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    sound.playPop();
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    sound.playSparkle();

    const newDiary: DiaryEntry = {
      id: 'diary-' + Date.now(),
      title: title.trim(),
      content: content.trim(),
      date,
      mood,
      photos: photoUrls,
      author,
      likes: 1,
      createdAt: Date.now(),
    };

    // Update local state
    const updated = [newDiary, ...diaries];
    setDiaries(updated);
    localStorage.setItem('love_app_diaries', JSON.stringify(updated));

    // Sync to Cloud if Firebase is active
    if (firebaseService.isInitialized) {
      try {
        await firebaseService.saveDiary(couple.coupleCode, newDiary);
      } catch (err) {
        console.warn('Could not sync diary to cloud:', err);
      }
    }

    // Reset form
    setTitle('');
    setContent('');
    setPhotoUrls([]);
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  const handleLike = (id: string) => {
    sound.playHeartbeat();
    setDiaries((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      );
      localStorage.setItem('love_app_diaries', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa trang nhật ký này không?')) return;
    sound.playPop();
    const updated = diaries.filter((d) => d.id !== id);
    setDiaries(updated);
    localStorage.setItem('love_app_diaries', JSON.stringify(updated));

    if (firebaseService.isInitialized) {
      try {
        await firebaseService.deleteDiary(couple.coupleCode, id);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const filteredDiaries = diaries.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood ? d.mood === selectedMood : true;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold border border-pink-200">
          <BookHeart className="w-4 h-4 text-rose-500" />
          <span>Nhật Ký Tình Yêu & Kỷ Niệm Của Chúng Mình</span>
        </div>
        <h2 className="font-['Dancing_Script'] text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          Ghi Lại Từng Khoảnh Khắc
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          Mỗi ngày bên nhau là một trang cổ tích. Hãy lưu lại những câu chuyện ngọt ngào, những chuyến đi và nụ cười của hai đứa nhé!
        </p>
      </div>

      {/* Action Bar: Search & New Memory Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-pink-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhật ký kỷ niệm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50"
          />
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-200 hover:scale-[1.02] transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Đóng form' : 'Viết trang mới 💕'}</span>
        </button>
      </div>

      {/* Mood Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            sound.playPop();
            setSelectedMood(null);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
            selectedMood === null
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 text-pink-700 hover:bg-pink-100 border border-pink-200'
          }`}
        >
          Tất cả cảm xúc
        </button>
        {MOODS.map((m) => (
          <button
            key={m.emoji}
            onClick={() => {
              sound.playPop();
              setSelectedMood(m.emoji === selectedMood ? null : m.emoji);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              selectedMood === m.emoji
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-pink-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Add Memory Form Card */}
      {showAddForm && (
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-pink-300 p-6 sm:p-8 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-pink-100">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              Viết Nhật Ký Tình Yêu Mới
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Tiêu đề kỷ niệm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Buổi tối cùng em ngắm mưa..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Ngày diễn ra *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            {/* Mood & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Tâm trạng lúc ấy</label>
                <div className="flex items-center gap-2 mt-1 overflow-x-auto py-1">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m.emoji}
                      onClick={() => {
                        sound.playPop();
                        setMood(m.emoji);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition ${
                        mood === m.emoji
                          ? 'bg-rose-100 border-rose-400 scale-110 shadow-sm'
                          : 'bg-white border-pink-200 hover:bg-pink-50'
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Người viết</label>
                <div className="flex items-center gap-2 mt-1">
                  {[
                    { id: 'boy', label: `🐻 ${couple.boy.nickname}` },
                    { id: 'girl', label: `🐱 ${couple.girl.nickname}` },
                    { id: 'both', label: '💑 Cả hai' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setAuthor(item.id as any)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        author === item.id
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content text */}
            <div>
              <label className="text-xs font-bold text-gray-700">Nội dung câu chuyện *</label>
              <textarea
                rows={4}
                required
                placeholder="Hôm ấy có chuyện gì vui, hai đứa đã làm gì, nói gì với nhau?..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-1 p-3.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 leading-relaxed resize-none"
              />
            </div>

            {/* Photo Attachments */}
            <div>
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Đính kèm ảnh kỷ niệm ({photoUrls.length})</span>
                <label className="cursor-pointer text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </label>

              {photoUrls.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto mt-2 py-2">
                  {photoUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 group border border-pink-200">
                      <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end gap-3 pt-3 border-t border-pink-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-[1.02] transition"
              >
                Lưu vào nhật ký 💖
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Diary Timeline Entries */}
      {filteredDiaries.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-pink-200/60 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-500 mx-auto flex items-center justify-center text-3xl">
            📖
          </div>
          <h4 className="font-bold text-gray-700 text-lg">Chưa tìm thấy trang nhật ký nào</h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Hãy bắt đầu viết lại kỷ niệm đáng nhớ đầu tiên của hai bạn bằng nút "Viết trang mới" ở trên nhé!
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-pink-300 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {filteredDiaries.map((entry) => {
            const authorText =
              entry.author === 'boy'
                ? `🐻 ${couple.boy.nickname}`
                : entry.author === 'girl'
                ? `🐱 ${couple.girl.nickname}`
                : '💑 Cả hai đứa';

            return (
              <div key={entry.id} className="relative group">
                {/* Timeline Heart Node */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center shadow-md shadow-pink-200 text-sm group-hover:scale-125 transition-transform">
                  {entry.mood || '💖'}
                </div>

                {/* Diary Card */}
                <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 sm:p-7 shadow-lg shadow-pink-100/60 transition-all duration-300 hover:shadow-xl hover:border-pink-300">
                  
                  {/* Meta Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 border border-pink-200 text-pink-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {entry.date}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        bởi {authorText}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-gray-300 hover:text-red-500 p-1.5 rounded-full hover:bg-pink-50 transition opacity-0 group-hover:opacity-100"
                      title="Xóa trang nhật ký này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
                    {entry.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>

                  {/* Photos Grid */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
                      {entry.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          className="relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-sm border border-pink-100 group/img cursor-pointer"
                        >
                          <img
                            src={photo}
                            alt="Diary attachment"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom reaction bar */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-pink-100">
                    <button
                      onClick={() => handleLike(entry.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-50 hover:bg-rose-50 border border-pink-200 hover:border-rose-300 text-rose-600 transition active:scale-95 shadow-sm"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>Thả tim ({entry.likes})</span>
                    </button>
                    <span className="text-[11px] text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

