import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, Heart, Sparkles, X } from 'lucide-react';
import { sound } from '../services/sound';
import { CoupleData } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, couple }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const webUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(webUrl)}&color=e11d48&bgcolor=fff0f5`;

  const handleCopyLink = () => {
    sound.playPop();
    navigator.clipboard.writeText(webUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-sm w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 text-center space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pink-100 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Mời người ấy cùng vào</span>
          </div>
          <h3 className="font-['Dancing_Script'] text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Chia Sẻ Không Gian Yêu
          </h3>
          <p className="text-xs text-gray-500">
            Quét mã QR bằng camera điện thoại để mở ngay trang web của hai bạn!
          </p>
        </div>

        {/* QR Code Frame */}
        <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 inline-block shadow-inner">
          <img
            src={qrUrl}
            alt="Love QR Code"
            className="w-48 h-48 rounded-xl object-contain mx-auto shadow-sm"
          />
          <div className="mt-2 text-xs font-bold text-pink-700 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{couple.boy.nickname} & {couple.girl.nickname}</span>
          </div>
        </div>

        {/* Couple Code badge */}
        <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-100 text-xs">
          <span className="text-gray-500">Mã kết nối: </span>
          <span className="font-mono font-bold text-rose-600 text-sm">{couple.coupleCode}</span>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Đã sao chép link web! 💕' : 'Sao chép link gửi cho người ấy'}</span>
        </button>

      </div>
    </div>
  );
};
