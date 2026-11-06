import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Calendar, 
  Cloud, 
  Download, 
  Upload, 
  Key, 
  Share2, 
  Copy, 
  Check, 
  Globe, 
  HelpCircle, 
  Sparkles, 
  LogOut 
} from 'lucide-react';
import { CoupleData } from '../types';
import { sound } from '../services/sound';
import { storageService } from '../services/storage';
import { firebaseService, getSavedFirebaseConfig, saveCustomFirebaseConfig, FirebaseConfig } from '../services/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleData;
  setCouple: React.Dispatch<React.SetStateAction<CoupleData>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  couple,
  setCouple,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'firebase' | 'backup' | 'github'>('profile');
  const [copiedCode, setCopiedCode] = useState(false);
  const [googleUser, setGoogleUser] = useState(couple.googleUser);
  const [loginLoading, setLoginLoading] = useState(false);

  // Profile fields
  const [boyName, setBoyName] = useState(couple.boy.name);
  const [boyNick, setBoyNick] = useState(couple.boy.nickname);
  const [boyAvatar, setBoyAvatar] = useState(couple.boy.avatar);
  const [boyBirthday, setBoyBirthday] = useState(couple.boy.birthday);
  const [boyZodiac, setBoyZodiac] = useState(couple.boy.zodiac);
  const [boyQuote, setBoyQuote] = useState(couple.boy.quote);

  const [girlName, setGirlName] = useState(couple.girl.name);
  const [girlNick, setGirlNick] = useState(couple.girl.nickname);
  const [girlAvatar, setGirlAvatar] = useState(couple.girl.avatar);
  const [girlBirthday, setGirlBirthday] = useState(couple.girl.birthday);
  const [girlZodiac, setGirlZodiac] = useState(couple.girl.zodiac);
  const [girlQuote, setGirlQuote] = useState(couple.girl.quote);

  const [startDate, setStartDate] = useState(couple.startDate);
  const [coupleCode, setCoupleCode] = useState(couple.coupleCode);

  // Custom Firebase fields
  const savedFbConfig = getSavedFirebaseConfig();
  const [apiKey, setApiKey] = useState(savedFbConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(savedFbConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(savedFbConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(savedFbConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(savedFbConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(savedFbConfig?.appId || '');

  if (!isOpen) return null;

  // Handle avatar image file upload
  const handleAvatarFile = (gender: 'boy' | 'girl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (gender === 'boy') setBoyAvatar(event.target.result as string);
        else setGirlAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    sound.playSparkle();
    const updated: CoupleData = {
      ...couple,
      startDate,
      coupleCode: coupleCode.trim().toUpperCase(),
      boy: {
        ...couple.boy,
        name: boyName.trim(),
        nickname: boyNick.trim(),
        avatar: boyAvatar,
        birthday: boyBirthday,
        zodiac: boyZodiac.trim(),
        quote: boyQuote.trim(),
      },
      girl: {
        ...couple.girl,
        name: girlName.trim(),
        nickname: girlNick.trim(),
        avatar: girlAvatar,
        birthday: girlBirthday,
        zodiac: girlZodiac.trim(),
        quote: girlQuote.trim(),
      },
    };
    setCouple(updated);
    storageService.saveCoupleData(updated);

    if (firebaseService.isInitialized) {
      firebaseService.syncCoupleToCloud(updated.coupleCode, updated);
    }

    alert('Đã cập nhật thông tin thành công! 💕');
    onClose();
  };

  const handleCopyCode = () => {
    sound.playPop();
    navigator.clipboard.writeText(couple.coupleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    sound.playPop();
    try {
      const user = await firebaseService.loginWithGoogle();
      if (user) {
        sound.playSparkle();
        const info = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        };
        setGoogleUser(info);
        const updated = { ...couple, googleUser: info };
        setCouple(updated);
        storageService.saveCoupleData(updated);
        alert(`Đăng nhập Google thành công! Chào ${user.displayName} 💕`);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng nhập Google. Vui lòng kiểm tra lại cấu hình Firebase của bạn!');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    sound.playPop();
    await firebaseService.logout();
    setGoogleUser(null);
    const updated = { ...couple, googleUser: null };
    setCouple(updated);
    storageService.saveCoupleData(updated);
  };

  // Save custom Firebase config
  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSparkle();

    if (!apiKey.trim() || !projectId.trim()) {
      saveCustomFirebaseConfig(null);
      alert('Đã xóa cấu hình Firebase tùy chỉnh. Ứng dụng sẽ hoạt động ở chế độ lưu cục bộ (LocalStorage).');
      return;
    }

    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveCustomFirebaseConfig(config);
    firebaseService.init(config);
    alert('Đã lưu cấu hình Firebase thành công! Bây giờ bạn có thể đăng nhập Google và đồng bộ dữ liệu trực tuyến.');
  };

  // Export JSON
  const handleExportBackup = () => {
    sound.playPop();
    const jsonStr = storageService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `our-love-story-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Import JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const ok = storageService.importFullBackup(event.target.result as string);
        if (ok) {
          sound.playSparkle();
          alert('Khôi phục dữ liệu thành công! Trang web sẽ được tải lại.');
          window.location.reload();
        } else {
          alert('Tệp dữ liệu không hợp lệ!');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h3 className="font-bold text-lg">Cài Đặt & Đồng Bộ Dữ Liệu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-pink-100 bg-pink-50/50 px-4 pt-2 overflow-x-auto">
          {[
            { id: 'profile', label: 'Thông tin cặp đôi', icon: User },
            { id: 'firebase', label: 'Tài khoản Google & Cloud', icon: Cloud },
            { id: 'backup', label: 'Sao lưu & Phục hồi', icon: Download },
            { id: 'github', label: 'Hướng dẫn GitHub', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 ${
                  isActive
                    ? 'border-rose-500 text-rose-600 bg-white rounded-t-xl shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-pink-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Start Date & Couple Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-pink-50/60 border border-pink-200">
                <div>
                  <label className="text-xs font-bold text-gray-700">Ngày bắt đầu yêu *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Mã kết nối hai người (Couple Code)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={coupleCode}
                      onChange={(e) => setCoupleCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-mono font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-100 text-pink-600 transition shrink-0"
                      title="Sao chép mã"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Gửi mã này cho nửa kia để cả hai cùng truy cập và trò chuyện chung!
                  </p>
                </div>
              </div>

              {/* Boyfriend Profile Section */}
              <div className="p-4 rounded-2xl border border-pink-200 space-y-3 bg-white">
                <h4 className="font-bold text-sky-700 text-sm flex items-center gap-2">
                  <span>🐻</span> Thông tin Bạn Trai (Anh)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Họ và tên</label>
                    <input
                      type="text"
                      value={boyName}
                      onChange={(e) => setBoyName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Biệt danh đáng yêu</label>
                    <input
                      type="text"
                      value={boyNick}
                      onChange={(e) => setBoyNick(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Ngày sinh nhật</label>
                    <input
                      type="date"
                      value={boyBirthday}
                      onChange={(e) => setBoyBirthday(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Cung hoàng đạo</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Sư Tử ♌"
                      value={boyZodiac}
                      onChange={(e) => setBoyZodiac(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-600 font-semibold">Câu nói yêu thích / Châm ngôn</label>
                    <input
                      type="text"
                      value={boyQuote}
                      onChange={(e) => setBoyQuote(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <img src={boyAvatar} alt="Boy" className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-300" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 font-semibold">Ảnh đại diện (Link hoặc tải từ máy)</label>
                      <input
                        type="text"
                        value={boyAvatar}
                        onChange={(e) => setBoyAvatar(e.target.value)}
                        placeholder="Dán link ảnh..."
                        className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-xs"
                      />
                    </div>
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200 hover:bg-pink-100 transition shrink-0">
                      Tải ảnh
                      <input type="file" accept="image/*" onChange={(e) => handleAvatarFile('boy', e)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Girlfriend Profile Section */}
              <div className="p-4 rounded-2xl border border-pink-200 space-y-3 bg-white">
                <h4 className="font-bold text-rose-700 text-sm flex items-center gap-2">
                  <span>🐱</span> Thông tin Bạn Gái (Em)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Họ và tên</label>
                    <input
                      type="text"
                      value={girlName}
                      onChange={(e) => setGirlName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Biệt danh đáng yêu</label>
                    <input
                      type="text"
                      value={girlNick}
                      onChange={(e) => setGirlNick(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Ngày sinh nhật</label>
                    <input
                      type="date"
                      value={girlBirthday}
                      onChange={(e) => setGirlBirthday(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold">Cung hoàng đạo</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Song Ngư ♓"
                      value={girlZodiac}
                      onChange={(e) => setGirlZodiac(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-600 font-semibold">Câu nói yêu thích / Châm ngôn</label>
                    <input
                      type="text"
                      value={girlQuote}
                      onChange={(e) => setGirlQuote(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <img src={girlAvatar} alt="Girl" className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-400" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 font-semibold">Ảnh đại diện (Link hoặc tải từ máy)</label>
                      <input
                        type="text"
                        value={girlAvatar}
                        onChange={(e) => setGirlAvatar(e.target.value)}
                        placeholder="Dán link ảnh..."
                        className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 text-xs"
                      />
                    </div>
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200 hover:bg-pink-100 transition shrink-0">
                      Tải ảnh
                      <input type="file" accept="image/*" onChange={(e) => handleAvatarFile('girl', e)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-[1.02] transition"
                >
                  Lưu thay đổi 💕
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: GOOGLE AUTH & FIREBASE */}
          {activeTab === 'firebase' && (
            <div className="space-y-6">
              
              {/* Google Account Status Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 space-y-4">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-rose-500" />
                  Trạng Thái Tài Khoản Google & Đồng Bộ Đám Mây
                </h4>

                {googleUser ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-pink-200">
                    <div className="flex items-center gap-3">
                      <img src={googleUser.photoURL} alt="Google Avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{googleUser.displayName}</div>
                        <div className="text-xs text-gray-500">{googleUser.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleGoogleLogout}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Liên kết tài khoản Google giúp lưu trữ nhật ký, tin nhắn, album ảnh lên đám mây vĩnh viễn và đồng bộ ngay tức thì giữa điện thoại của bạn và người yêu!
                    </p>
                    <button
                      onClick={handleGoogleLogin}
                      disabled={loginLoading}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 transition"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{loginLoading ? 'Đang kết nối...' : 'Đăng nhập bằng tài khoản Google'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Firebase Setup Form */}
              <form onSubmit={handleSaveFirebaseConfig} className="p-5 rounded-2xl border border-pink-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Key className="w-4 h-4 text-pink-500" />
                    Cấu Hình Firebase Của Bạn (Khi triển khai riêng)
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    firebaseService.isInitialized ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {firebaseService.isInitialized ? 'Đang hoạt động' : 'Chưa kích hoạt'}
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Để dự án hoạt động trên GitHub Pages của bạn và lưu vào tài khoản Firebase riêng của bạn, tạo một dự án miễn phí tại <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-rose-600 underline font-semibold">Firebase Console</a>, bật Google Authentication và Cloud Firestore, sau đó dán các thông số vào đây:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700">apiKey</label>
                    <input
                      type="text"
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700">projectId</label>
                    <input
                      type="text"
                      placeholder="love-days-xxxx"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700">authDomain</label>
                    <input
                      type="text"
                      placeholder="love-days-xxxx.firebaseapp.com"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700">appId</label>
                    <input
                      type="text"
                      placeholder="1:123456:web:abcd..."
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-pink-500 text-white hover:bg-pink-600 transition shadow"
                  >
                    Lưu cấu hình Firebase
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 3: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-2">
                <h4 className="font-bold text-gray-800 text-sm">Sao lưu toàn bộ kỷ niệm</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Xuất tất cả số ngày yêu, nhật ký, ảnh và tin nhắn thành 1 file JSON duy nhất để lưu trữ an toàn trong máy tính hoặc gửi qua Zalo/Drive.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Sao Lưu (.JSON)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-2">
                <h4 className="font-bold text-gray-800 text-sm">Khôi phục từ file sao lưu</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Đổi điện thoại hoặc máy tính mới? Hãy chọn file JSON đã sao lưu để phục hồi toàn bộ dữ liệu ngay lập tức.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-pink-700 border border-pink-300 hover:bg-pink-50 transition shadow-sm">
                  <Upload className="w-4 h-4 text-pink-500" />
                  <span>Chọn File Sao Lưu Để Phục Hồi</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: GITHUB DEPLOY GUIDE */}
          {activeTab === 'github' && (
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white space-y-2">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <Globe className="w-5 h-5 text-pink-400" />
                  Cách Đẩy Lên GitHub & Bật Web Miễn Phí (GitHub Pages)
                </h4>
                <p className="text-xs text-gray-300">
                  Dự án đã được cấu hình đường dẫn tương đối (base: './') chuẩn 100% để chạy mượt mà trên GitHub Pages mà không bao giờ bị lỗi trắng trang!
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl border border-pink-200 bg-white">
                <div className="font-bold text-pink-700">Bước 1: Khởi tạo Git & Đẩy code lên GitHub</div>
                <pre className="p-3 bg-gray-900 text-pink-300 rounded-xl text-xs font-mono overflow-x-auto">
{`git init
git add .
git commit -m "Khoi tao web dem ngay yeu nhau"
git branch -M main
git remote add origin https://github.com/TEN_GITHUB/TEN_REPO.git
git push -u origin main`}
                </pre>

                <div className="font-bold text-pink-700">Bước 2: Bật GitHub Pages tự động</div>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Vào repository trên GitHub của bạn &gt; chọn <b>Settings</b>.</li>
                  <li>Chọn mục <b>Pages</b> ở menu bên trái.</li>
                  <li>Ở mục <b>Build and deployment</b> &gt; <b>Source</b>: chọn <b>GitHub Actions</b>.</li>
                  <li>Dự án đã có sẵn file Workflow tự động build và xuất bản trang web sau mỗi lần bạn commit!</li>
                </ul>

                <div className="font-bold text-emerald-600">🎉 Kết quả:</div>
                <p className="text-xs text-gray-600">
                  Trang web của bạn sẽ trực tuyến tại địa chỉ: <br />
                  <code className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-mono font-bold">
                    https://TEN_GITHUB.github.io/TEN_REPO/
                  </code>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
