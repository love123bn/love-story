import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Disc, SkipForward } from 'lucide-react';
import { sound } from '../services/sound';

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PLAYLIST = [
  {
    title: 'A Little Love (Piano Lullaby)',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
  },
  {
    title: 'Sweet Memories (Acoustic Warmth)',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sweet-love-10901.mp3',
  },
  {
    title: 'Romantic Lofi Sunset',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3',
  }
];

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, setIsPlaying }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked without user gesture
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume, isMuted]);

  const togglePlay = () => {
    sound.playPop();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    sound.playPop();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const toggleMute = () => {
    sound.playPop();
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        preload="auto"
        onEnded={handleNextTrack}
      />

      {/* Floating Romantic Music Pill in Bottom Corner */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-30">
        <div className="relative group">
          
          {/* Main Mini Floating Button */}
          <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 shadow-lg shadow-pink-200/50 hover:shadow-xl transition-all">
            <button
              onClick={togglePlay}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform ${
                isPlaying
                  ? 'bg-gradient-to-tr from-pink-500 to-rose-500 animate-spin duration-3000'
                  : 'bg-pink-400 hover:scale-105'
              }`}
              title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc lãng mạn'}
            >
              <Disc className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowControls(!showControls)}
              className="flex flex-col text-left cursor-pointer select-none"
            >
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
                <Music className="w-2.5 h-2.5" /> {isPlaying ? 'Đang phát' : 'Nhạc nền'}
              </span>
              <span className="text-xs font-semibold text-gray-700 max-w-[110px] truncate">
                {currentTrack.title}
              </span>
            </button>

            <button
              onClick={handleNextTrack}
              className="p-1 text-gray-400 hover:text-pink-600 transition"
              title="Bài tiếp theo"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expanded Volume Controls Popup */}
          {showControls && (
            <div className="absolute bottom-full right-0 mb-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-pink-200 shadow-xl w-48 space-y-2 animate-fade-in">
              <div className="text-xs font-bold text-gray-700 truncate">
                🎵 {currentTrack.title}
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-pink-600">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-full accent-pink-500 h-1.5 rounded-lg bg-pink-100 cursor-pointer"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

