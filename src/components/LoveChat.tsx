import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircleHeart, 
  Send, 
  Smile, 
  Heart, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  User, 
  Flame 
} from 'lucide-react';
import { ChatMessage, CoupleData } from '../types';
import { sound } from '../services/sound';
import { firebaseService } from '../services/firebase';

interface LoveChatProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  couple: CoupleData;
  activeRole: 'boy' | 'girl';
}

const QUICK_NOTES = [
  'Nhớ người yêu quá đi mất! 💖',
  'Hôm nay em ăn cơm chưa nè? 🍱',
  'Yêu nửa kia nhất trên đời! 🌸',
  'Muốn ôm một cái thật chặt ghê! 🤗',
  'Tối nay mình đi hẹn hò nha! 🧋',
  'Ngủ sớm đi nhé, mơ về nhau nha! 🌙✨',
];

const STICKERS = ['💖', '💌', '🌹', '🍫', '🧸', '💍', '👩‍❤️‍💋‍👨', '🍓', '🎀', '🍦', '🍰', '🌸'];

export const LoveChat: React.FC<LoveChatProps> = ({
  messages,
  setMessages,
  couple,
  activeRole,
}) => {
  const [inputText, setInputText] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Firestore real-time listener if available
  useEffect(() => {
    if (firebaseService.isInitialized) {
      const unsubscribe = firebaseService.listenToMessages(couple.coupleCode, (cloudMsgs) => {
        if (cloudMsgs && cloudMsgs.length > 0) {
          setMessages(cloudMsgs);
          localStorage.setItem('love_app_messages', JSON.stringify(cloudMsgs));
        }
      });
      return () => unsubscribe();
    }
  }, [couple.coupleCode]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sound.playMessageSent();

    const senderProfile = activeRole === 'boy' ? couple.boy : couple.girl;

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: activeRole,
      senderName: senderProfile.nickname,
      text,
      timestamp: Date.now(),
      read: true,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem('love_app_messages', JSON.stringify(updated));

    if (firebaseService.isInitialized) {
      try {
        await firebaseService.sendMessage(couple.coupleCode, newMsg);
      } catch (err) {
        console.warn('Firebase message sync error:', err);
      }
    }

    if (!textToSend) setInputText('');
    setShowStickerPicker(false);
  };

  const handleSendSticker = (sticker: string) => {
    sound.playPop();
    handleSendMessage(sticker);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold border border-pink-200">
          <MessageCircleHeart className="w-4 h-4 text-rose-500" />
          <span>Hòm Thư Tình & Nhắn Tin Yêu Thương</span>
        </div>
        <h2 className="font-['Dancing_Script'] text-3xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          Lời Nhắn Gửi Trao Nửa Kia
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Nhắn gửi những lời dặn dò dịu dàng, nụ hôn và tâm sự nhỏ mỗi ngày.
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-pink-200 shadow-xl overflow-hidden flex flex-col h-[650px] max-h-[80vh]">
        
        {/* Chat Top Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img
                src={couple.boy.avatar}
                alt="Boy"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
              />
              <img
                src={couple.girl.avatar}
                alt="Girl"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-400 shadow"
              />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">
                Phòng trò chuyện: {couple.boy.nickname} & {couple.girl.nickname}
              </h4>
              <p className="text-[11px] text-pink-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Mã kết nối: <span className="font-mono font-bold">{couple.coupleCode}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-gray-500">Đang gửi với vai:</span>
            <div className="text-xs font-bold text-rose-600">
              {activeRole === 'boy' ? `🐻 ${couple.boy.nickname}` : `🐱 ${couple.girl.nickname}`}
            </div>
          </div>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-pink-50/30 to-white/60">
          {messages.length === 0 ? (
            <div className="text-center py-20 text-gray-400 space-y-2">
              <Heart className="w-10 h-10 text-pink-300 mx-auto animate-pulse" />
              <p className="text-sm">Chưa có tin nhắn nào. Hãy gửi lời chào ngọt ngào đầu tiên!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === activeRole;
              const avatar = msg.sender === 'boy' ? couple.boy.avatar : couple.girl.avatar;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={avatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-pink-200 shrink-0"
                    />
                  )}

                  <div className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-gray-400 font-semibold px-1">
                      {msg.senderName}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm sm:text-base leading-relaxed break-words ${
                        isMe
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none shadow-pink-200'
                          : 'bg-white text-gray-800 border border-pink-100 rounded-bl-none shadow-pink-50'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className={`flex items-center gap-1 text-[10px] text-gray-400 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-rose-500" />}
                    </div>
                  </div>

                  {isMe && (
                    <img
                      src={avatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-rose-400 shrink-0"
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Love Notes Bar */}
        <div className="px-3 py-2 bg-pink-50/70 border-t border-pink-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-pink-600 shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3" /> Gợi ý:
          </span>
          {QUICK_NOTES.map((note, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(note)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-pink-700 border border-pink-200 hover:bg-pink-100 shrink-0 transition"
            >
              {note}
            </button>
          ))}
        </div>

        {/* Sticker Popup */}
        {showStickerPicker && (
          <div className="p-3 bg-white border-t border-pink-100 grid grid-cols-6 gap-2 animate-fade-in">
            {STICKERS.map((stk, idx) => (
              <button
                key={idx}
                onClick={() => handleSendSticker(stk)}
                className="w-10 h-10 rounded-xl hover:bg-pink-100 flex items-center justify-center text-2xl transition hover:scale-125"
              >
                {stk}
              </button>
            ))}
          </div>
        )}

        {/* Message Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-pink-100 flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setShowStickerPicker(!showStickerPicker);
            }}
            className="p-2 rounded-full text-pink-500 hover:bg-pink-50 hover:text-rose-600 transition"
            title="Thả sticker tình yêu"
          >
            <Smile className="w-6 h-6" />
          </button>

          <input
            type="text"
            placeholder={`Gửi lời yêu thương đến ${activeRole === 'boy' ? couple.girl.nickname : couple.boy.nickname}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-full border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/40"
          />

          <button
            onClick={() => handleSendMessage()}
            className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition"
            title="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

