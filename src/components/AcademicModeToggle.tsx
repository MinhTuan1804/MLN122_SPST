import React from 'react';
import { useGameStore } from '../store/gameStore';
import { HelpCircle } from 'lucide-react';

export const AcademicModeToggle: React.FC = () => {
  const { academicMode, toggleAcademicMode, faction } = useGameStore();



  return (
    <div className="flex items-center gap-3 bg-wood-dark/60 p-2.5 rounded-lg border border-paper-aged/10 glass-panel">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-xs md:text-sm font-bold uppercase tracking-wider text-paper-aged/90">Chế độ Học thuật</span>
          <div className="relative group">
            <HelpCircle className="w-3.5 h-3.5 text-paper-aged/50 cursor-help hover:text-paper-aged" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-[#231E19] border border-leather-brown text-paper-aged rounded shadow-xl text-[10px] leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
              Kích hoạt để xem giải thích học thuyết của Các Mác về Giá Trị Thặng Dư, Cấu Tạo Hữu Cơ Tư Bản và chỉ số chi tiết.
            </div>
          </div>
        </div>
        <span className="text-[10px] text-paper-aged/50">Hiện phân rã công thức & thuật ngữ gốc</span>
      </div>

      <button
        onClick={toggleAcademicMode}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-leather-brown focus:ring-offset-2 focus:ring-offset-wood-dark ${
          academicMode ? (faction === 'capitalist' ? 'bg-brass-polished' : 'bg-iron-cold') : 'bg-stone-700'
        }`}
        aria-label="Toggle Academic Mode"
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-wood-dark shadow ring-0 transition duration-200 ease-in-out ${
            academicMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
