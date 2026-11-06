import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  Heart, 
  RefreshCw, 
  Upload, 
  Smile, 
  Check, 
  Maximize2 
} from 'lucide-react';
import { PhotoMemory, CoupleData } from '../types';
import { sound } from '../services/sound';

interface LoveCameraProps {
  photos: PhotoMemory[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoMemory[]>>;
  couple: CoupleData;
}

const FILTERS = [
  { id: 'normal', name: 'Tự nhiên', class: '' },
  { id: 'rose', name: 'Hồng pastel 🌸', class: 'contrast-105 saturate-125 sepia-[0.15] hue-rotate-[-10deg]' },
  { id: 'warm', name: 'Ấm áp ☀️', class: 'sepia-[0.3] brightness-105 saturate-125' },
  { id: 'vintage', name: 'Vintage 🎞️', class: 'grayscale-[0.4] contrast-125 brightness-95' },
  { id: 'fairytale', name: 'Mộng mơ ✨', class: 'brightness-110 saturate-150 contrast-95' },
];

export const LoveCamera: React.FC<LoveCameraProps> = ({
  photos,
  setPhotos,
  couple,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedFilter, setSelectedFilter] = useState('rose');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [selectedFrameStyle, setSelectedFrameStyle] = useState<'polaroid' | 'heart' | 'vintage'>('polaroid');
  const [activeTab, setActiveTab] = useState<'camera' | 'album'>('camera');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoMemory | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      sound.playPop();
    } catch (err) {
      alert('Không thể mở camera. Vui lòng cho phép quyền truy cập camera trong trình duyệt hoặc sử dụng tính năng tải ảnh từ máy nhé!');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Flip Camera
  const toggleFacingMode = () => {
    sound.playPop();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // Take Photo with Countdown
  const triggerCapture = () => {
    if (!videoRef.current) return;
    sound.playPop();
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          doSnap();
          return null;
        }
        sound.playPop();
        return prev - 1;
      });
    }, 1000);
  };

  const doSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply mirror flip if user camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Flash animation and shutter sound
    setFlash(true);
    sound.playShutter();
    setTimeout(() => setFlash(false), 200);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    setPhotoCaption(`Khoảnh khắc yêu thương 💕 ${new Date().toLocaleDateString('vi-VN')}`);
  };

  // Upload Photo from File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        setPhotoCaption(`Kỷ niệm đẹp cùng người thương 🌸`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Captured or Uploaded Photo to Album
  const handleSaveToAlbum = () => {
    if (!capturedImage) return;
    sound.playSparkle();

    const newPhoto: PhotoMemory = {
      id: 'photo-' + Date.now(),
      url: capturedImage,
      caption: photoCaption.trim() || 'Kỷ niệm ngọt ngào',
      date: new Date().toISOString().split('T')[0],
      frameStyle: selectedFrameStyle,
      likes: 1,
      createdAt: Date.now(),
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    localStorage.setItem('love_app_photos', JSON.stringify(updated));

    setCapturedImage(null);
    setPhotoCaption('');
    setActiveTab('album');
  };

  const handleLikePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playHeartbeat();
    setPhotos((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      );
      localStorage.setItem('love_app_photos', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có muốn xóa bức ảnh này khỏi album không?')) return;
    sound.playPop();
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('love_app_photos', JSON.stringify(updated));
    if (lightboxPhoto?.id === id) setLightboxPhoto(null);
  };

  const handleDownload = (url: string, name: string) => {
    sound.playPop();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'love-photo'}.jpg`;
    a.click();
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Screen flash on snap */}
      {flash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-200" />
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold border border-pink-200">
          <Camera className="w-4 h-4 text-rose-500" />
          <span>Love Camera & Polaroid Photo Booth</span>
        </div>
        <h2 className="font-['Dancing_Script'] text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          Chụp & Lưu Giữ Khoảnh Khắc
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          Tạo những bức ảnh Polaroid viền hồng siêu dễ thương cùng người ấy ngay trên trình duyệt hoặc thêm ảnh từ máy của bạn!
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-pink-200 shadow-sm">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('camera');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'camera'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'text-pink-700 hover:bg-pink-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Phòng Chụp Ảnh (Photo Booth)</span>
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('album');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'album'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'text-pink-700 hover:bg-pink-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Album Tình Yêu ({photos.length})</span>
          </button>
        </div>
      </div>

      {/* CAMERA TAB */}
      {activeTab === 'camera' && (
        <div className="space-y-6">
          {!capturedImage ? (
            <div className="max-w-2xl mx-auto rounded-3xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 sm:p-8 shadow-xl text-center space-y-5">
              
              {/* Video Viewport */}
              <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-pink-950 flex items-center justify-center shadow-inner group">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${
                        facingMode === 'user' ? '-scale-x-100' : ''
                      } ${FILTERS.find((f) => f.id === selectedFilter)?.class || ''}`}
                    />

                    {/* Cute Frame Overlay */}
                    <div className="absolute inset-4 border-2 border-dashed border-pink-300/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                      <div className="flex justify-between items-center text-white/80 text-xs font-semibold drop-shadow">
                        <span>💖 {couple.boy.nickname} & {couple.girl.nickname}</span>
                        <span>{new Date().toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="text-center text-white/90 text-sm font-bold font-['Dancing_Script'] drop-shadow">
                        Love is in the air ✨
                      </div>
                    </div>

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-8xl font-black text-rose-400 animate-ping font-mono">
                          {countdown}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shadow-inner">
                      <Camera className="w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Bật Camera để chụp ảnh</h4>
                      <p className="text-xs text-pink-200 mt-1 max-w-xs">
                        Tạo dáng cùng người yêu hoặc tự sướng gửi tặng nửa kia những khoảnh khắc đáng yêu nhất!
                      </p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:scale-105 transition"
                    >
                      Bật Camera Ngay 💕
                    </button>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {isCameraActive && (
                <div className="space-y-4">
                  {/* Filter selector */}
                  <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          sound.playPop();
                          setSelectedFilter(f.id);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                          selectedFilter === f.id
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  {/* Shutter Button & Camera tools */}
                  <div className="flex items-center justify-center gap-6 pt-2">
                    <button
                      onClick={toggleFacingMode}
                      title="Đổi camera trước / sau"
                      className="p-3 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition border border-pink-200"
                    >
                      <FlipHorizontal className="w-5 h-5" />
                    </button>

                    <button
                      onClick={triggerCapture}
                      title="Chụp ảnh (3s đếm ngược)"
                      className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 to-rose-600 shadow-xl shadow-rose-300 hover:scale-105 active:scale-95 transition-transform"
                    >
                      <div className="w-full h-full rounded-full border-4 border-white flex items-center justify-center">
                        <Camera className="w-7 h-7 text-white" />
                      </div>
                    </button>

                    <button
                      onClick={stopCamera}
                      title="Tắt camera"
                      className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Or Upload Image option */}
              <div className="pt-4 border-t border-pink-100 flex items-center justify-center">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 transition">
                  <Upload className="w-4 h-4 text-pink-500" />
                  <span>Hoặc chọn ảnh có sẵn từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

            </div>
          ) : (
            /* PREVIEW & POLAROID FRAME CUSTOMIZER */
            <div className="max-w-xl mx-auto rounded-3xl bg-white/95 backdrop-blur-md border border-pink-200 p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
              <h3 className="font-bold text-center text-gray-800 text-lg flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                Thiết Kế Khung Ảnh Polaroid
              </h3>

              {/* Polaroid Frame Preview */}
              <div className="bg-white p-4 sm:p-5 pb-8 sm:pb-10 rounded-2xl shadow-xl border border-pink-100 max-w-sm mx-auto transform hover:rotate-1 transition-transform">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-bold text-rose-600">
                    💖 {couple.boy.nickname} & {couple.girl.nickname}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-['Dancing_Script'] text-xl font-bold text-gray-800 line-clamp-2">
                    {photoCaption || 'Our Sweet Moment 💕'}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">
                    {new Date().toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Caption Input */}
              <div>
                <label className="text-xs font-bold text-gray-700">Dòng chú thích cho bức ảnh:</label>
                <input
                  type="text"
                  placeholder="Ghi lại cảm xúc hoặc kỷ niệm..."
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setCapturedImage(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  Chụp lại
                </button>
                <button
                  onClick={() => handleDownload(capturedImage, photoCaption)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-pink-100 text-pink-700 hover:bg-pink-200 transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh</span>
                </button>
                <button
                  onClick={handleSaveToAlbum}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-[1.02] transition"
                >
                  Lưu vào Album 💕
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ALBUM TAB */}
      {activeTab === 'album' && (
        <div className="space-y-6">
          {photos.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-3xl border border-pink-200/60 p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-500 mx-auto flex items-center justify-center text-3xl">
                📸
              </div>
              <h4 className="font-bold text-gray-700 text-lg">Chưa có bức ảnh nào trong album</h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Hãy chuyển qua tab "Phòng Chụp Ảnh" để lưu lại những khoảnh khắc ngọt ngào đầu tiên nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((item, idx) => {
                const rotationAngles = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];
                const angle = rotationAngles[idx % rotationAngles.length];

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      sound.playPop();
                      setLightboxPhoto(item);
                    }}
                    className={`bg-white p-4 pb-6 rounded-2xl shadow-lg border border-pink-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group ${angle}`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => handleDeletePhoto(item.id, e)}
                          className="p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <p className="font-['Dancing_Script'] text-lg font-bold text-gray-800 line-clamp-1">
                        {item.caption}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                        <span>{item.date}</span>
                        <button
                          onClick={(e) => handleLikePhoto(item.id, e)}
                          className="flex items-center gap-1 text-rose-500 font-bold hover:scale-110 transition active:scale-95"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          <span>{item.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-bold text-gray-800 font-['Dancing_Script'] text-2xl">
                {lightboxPhoto.caption}
              </h3>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-2xl flex items-center justify-center bg-pink-50">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption}
                className="max-h-[65vh] w-auto object-contain rounded-2xl shadow"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500 font-medium">
                Chụp vào ngày: {lightboxPhoto.date}
              </span>
              <button
                onClick={() => handleDownload(lightboxPhoto.url, lightboxPhoto.caption)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 transition shadow-md shadow-rose-200"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh về máy</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

