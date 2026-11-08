import React, { useState } from 'react';
import { Heart, Lock, Sparkles, Delete } from 'lucide-react';
import { sound } from '../services/sound';

interface PasscodeLockProps {
  passcode: string;
  onSuccess: () => void;
  coupleNicknames: string;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({
  passcode,
  onSuccess,
  coupleNicknames,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const handleKeyPress = (num: string) => {
    sound.playPop();
    if (inputCode.length >= 4) return;

    const newCode = inputCode + num;
    setInputCode(newCode);

    if (newCode.length === 4) {
      if (newCode === passcode) {
        sound.playSparkle();
        setTimeout(onSuccess, 300);
      } else {
        sound.playHeartbeat();
        setErrorShake(true);
        setTimeout(() => {
          setErrorShake(false);
          setInputCode('');
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    sound.playPop();
    setInputCode((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#fff0f5] via-[#fce4ec] to-[#f8bbd0] backdrop-blur-md">
      <div className="max-w-sm w-full bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-pink-300 shadow-2xl text-center space-y-6">
        
        {/* Animated Heart Lock Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-pink-400/20 rounded-full animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-300">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="font-['Dancing_Script'] text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Khoảnh Khắc Riêng Tư
          </h2>
          <p className="text-xs text-gray-500">
            Khu vườn tình yêu của <span className="font-bold text-pink-600">{coupleNicknames}</span>
          </p>
        </div>

        {/* 4 Pink Heart PIN Dots */}
        <div className={`flex items-center justify-center gap-4 py-2 ${errorShake ? 'animate-bounce text-red-500' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < inputCode.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isFilled
                    ? 'bg-rose-500 scale-125 shadow-md shadow-rose-300'
                    : 'bg-pink-100 border-2 border-pink-300'
                }`}
              >
                {isFilled && <Heart className="w-2.5 h-2.5 text-white fill-white" />}
              </div>
            );
          })}
        </div>

        {errorShake && (
          <p className="text-xs text-red-500 font-bold animate-pulse">
            Mã khóa chưa đúng rồi nè, thử lại nhé! 🥺
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="w-14 h-14 rounded-full bg-white border border-pink-200 text-gray-800 text-xl font-bold shadow-sm hover:bg-pink-100 hover:border-pink-300 active:scale-95 transition flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 rounded-full bg-white border border-pink-200 text-gray-800 text-xl font-bold shadow-sm hover:bg-pink-100 hover:border-pink-300 active:scale-95 transition flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 active:scale-95 transition flex items-center justify-center"
            title="Xóa số"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-gray-400 italic">
          💡 Gợi ý: Ngày kỷ niệm hoặc ngày sinh nhật bí mật của hai bạn!
        </p>

      </div>
    </div>
  );
};

