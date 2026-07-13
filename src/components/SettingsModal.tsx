import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Eye, EyeOff, RotateCcw, BookOpen } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRules: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenRules }) => {
  const {
    enable3D,
    toggle3D,
    academicMode,
    toggleAcademicMode,
    restartGame,
    triggerEndingTest
  } = useGameStore();

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0C0907]/90 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#1C1814] woodcut-border p-6 rounded-xl shadow-2xl relative space-y-5">
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-leather-brown/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-leather-brown/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-leather-brown/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-leather-brown/40" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-paper-aged/50 hover:text-paper-aged transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-serif text-brass-polished border-b border-leather-brown/20 pb-2 tracking-wider font-bold">
          THIẾT LẬP HỆ THỐNG
        </h2>

        {/* Controls */}
        <div className="space-y-4 pt-2">
          {/* 3D Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-sans font-medium text-paper-aged/95">Đồ Họa Conflict Scene 3D</span>
              <span className="text-[10px] text-paper-aged/50">Tắt để tăng hiệu năng (dùng fallback 2D)</span>
            </div>
            <button
              onClick={toggle3D}
              className={`p-2 rounded border transition-colors ${
                enable3D
                  ? 'border-brass-polished text-brass-polished bg-brass-polished/5'
                  : 'border-paper-aged/20 text-paper-aged/40 hover:border-paper-aged/40'
              }`}
            >
              {enable3D ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Academic Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-sans font-medium text-paper-aged/95">Chế Độ Học Thuật</span>
              <span className="text-[10px] text-paper-aged/50">Hiện phân rã công thức & thuật ngữ Các Mác</span>
            </div>
            <button
              onClick={toggleAcademicMode}
              className={`px-3 py-1 text-xs border rounded transition-colors uppercase font-mono ${
                academicMode
                  ? 'border-brass-polished text-brass-polished bg-brass-polished/5'
                  : 'border-paper-aged/20 text-paper-aged/40 hover:border-paper-aged/40'
              }`}
            >
              {academicMode ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Gemini API Key */}
          <div className="flex flex-col gap-1 border-t border-leather-brown/10 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-sans font-medium text-paper-aged/95">Gemini API Key (Gemini 3.1 Flash Lite)</span>
              <span className="text-[9px] text-paper-aged/40">Hội thoại Cố vấn</span>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                const val = e.target.value;
                setApiKey(val);
                localStorage.setItem('gemini_api_key', val);
              }}
              placeholder="Nhập Gemini API Key..."
              className="w-full bg-[#15110E] border border-leather-brown/30 rounded px-2.5 py-1 text-xs text-paper-aged font-mono focus:outline-none focus:border-brass-polished/50 mt-1"
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="p-3 bg-[#15110E] rounded border border-leather-brown/10 text-[10px] text-paper-aged/60 leading-relaxed font-sans text-left">
          <p className="font-semibold text-brass-polished mb-1">Cơ chế kinh tế & công thức:</p>
          <p className="mb-0.5">• W = c + v + m (Giá trị hàng hóa dệt = tư bản bất biến + tư bản khả biến + thặng dư)</p>
          <p className="mb-0.5">• m' = m / v * 100% (Tỷ suất giá trị thặng dư / Mức độ khai thác lao động)</p>
          <p>• oc = c / v (Cấu tạo hữu cơ tư bản. oc tăng tức là sa thải bớt nhân công)</p>
        </div>

        {/* View Rules Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenRules();
            }}
            className="w-full py-2 bg-brass-polished/10 border border-brass-polished/30 hover:bg-brass-polished/20 text-brass-polished font-serif font-bold text-xs rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" /> Xem Luật Chơi & Hướng Dẫn
          </button>
        </div>

        {/* Test Ending Videos Section */}
        <div className="pt-3 border-t border-leather-brown/10 space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-paper-aged/50 block text-left">Xem thử Video Kết Cục</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                triggerEndingTest('victory_empire');
                onClose();
              }}
              className="py-1.5 px-2 bg-brass-polished/10 hover:bg-brass-polished/20 active:bg-brass-polished/35 text-brass-polished border border-brass-polished/30 text-[10px] font-bold uppercase rounded tracking-wide transition-all cursor-pointer"
            >
              Tư Bản Win
            </button>
            <button
              onClick={() => {
                triggerEndingTest('labor_triumph');
                onClose();
              }}
              className="py-1.5 px-2 bg-[#4b5358]/20 hover:bg-[#4b5358]/35 active:bg-[#4b5358]/55 text-iron-cold border border-iron-cold/30 text-[10px] font-bold uppercase rounded tracking-wide transition-all cursor-pointer"
            >
              Công Nhân Win
            </button>
            <button
              onClick={() => {
                triggerEndingTest('capitalist_doom');
                onClose();
              }}
              className="py-1.5 px-2 bg-red-950/20 hover:bg-red-950/30 active:bg-red-950/40 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase rounded tracking-wide transition-all cursor-pointer"
            >
              Tư Bản Thua
            </button>
            <button
              onClick={() => {
                triggerEndingTest('unorganized_rebellion');
                onClose();
              }}
              className="py-1.5 px-2 bg-rose-950/20 hover:bg-rose-950/30 active:bg-rose-950/40 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase rounded tracking-wide transition-all cursor-pointer"
            >
              Công Nhân Thua
            </button>
          </div>
        </div>

        {/* Restart Action */}
        <div className="pt-2 border-t border-leather-brown/20 flex gap-3">
          <button
            onClick={() => {
              restartGame();
              onClose();
            }}
            className="flex-grow py-2 bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 text-red-400 font-serif font-bold text-xs rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Chơi lại từ đầu
          </button>
        </div>

      </div>
    </div>
  );
};
