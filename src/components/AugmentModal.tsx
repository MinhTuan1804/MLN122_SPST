import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Hexagon, Landmark } from 'lucide-react';
import type { Augment } from '../data/augments';
import { playHoverSound, playClickSound } from '../utils/audioEffects';

export const AugmentModal: React.FC = () => {
  const { phase, pendingAugments, pickAugment, faction } = useGameStore();

  if (phase !== 'augment' || pendingAugments.length === 0) return null;

  const isPrismatic = pendingAugments[0].tier === 'prismatic';
  const isGold = pendingAugments[0].tier === 'gold';
  
  const getThemeColor = () => {
    if (isPrismatic) return 'border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.3)] text-fuchsia-400';
    if (isGold) return 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)] text-yellow-400';
    return 'border-zinc-400/50 shadow-[0_0_30px_rgba(161,161,170,0.3)] text-zinc-300';
  };

  const getTierName = () => {
    if (isPrismatic) return 'HỌC THUYẾT BẬC TỐI THƯỢNG';
    if (isGold) return 'HỌC THUYẾT BẬC VÀNG';
    return 'HỌC THUYẾT BẬC BẠC';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-fade-in">
      <div className={`max-w-5xl w-full bg-[#1C1814] border-2 rounded-xl p-8 flex flex-col items-center relative overflow-hidden ${getThemeColor()}`}>
        
        {/* Glow effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[80px] opacity-20 pointer-events-none ${isPrismatic ? 'bg-fuchsia-600' : isGold ? 'bg-yellow-600' : 'bg-zinc-400'}`}></div>

        <div className="text-center mb-10 relative z-10">
          <h2 className={`font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] mb-2 drop-shadow-md`}>
            {getTierName()}
          </h2>
          <p className="text-paper-aged/70 font-sans text-sm max-w-lg mx-auto">
            Một bước ngoặt lịch sử đang diễn ra. Hãy chọn 1 trong 3 Nâng Cấp vĩnh viễn định hình chiến lược của phe {faction === 'capitalist' ? 'Tư Bản' : 'Công Nhân'} trong phần còn lại của trò chơi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
          {pendingAugments.map((aug, i) => (
            <AugmentCard key={aug.id} augment={aug} index={i} onPick={() => pickAugment(aug)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AugmentCard: React.FC<{ augment: Augment, index: number, onPick: () => void }> = ({ augment, index, onPick }) => {
  const isPrismatic = augment.tier === 'prismatic';
  const isGold = augment.tier === 'gold';
  
  const borderCol = isPrismatic ? 'border-fuchsia-500/30 hover:border-fuchsia-400' : isGold ? 'border-yellow-500/30 hover:border-yellow-400' : 'border-zinc-400/30 hover:border-zinc-300';
  const bgHover = isPrismatic ? 'hover:bg-fuchsia-900/10' : isGold ? 'hover:bg-yellow-900/10' : 'hover:bg-zinc-800/30';
  const titleCol = isPrismatic ? 'text-fuchsia-300' : isGold ? 'text-yellow-300' : 'text-zinc-200';

  return (
    <div 
      className={`relative group bg-[#251E19] rounded-lg p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[340px] transform hover:-translate-y-2 hover:shadow-xl ${borderCol} ${bgHover}`}
      style={{ animationDelay: `${index * 150}ms` }}
      onClick={() => {
        playClickSound();
        onPick();
      }}
      onMouseEnter={playHoverSound}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <Hexagon className={`w-10 h-10 ${titleCol} opacity-80`} strokeWidth={1.5} />
          <span className="text-[10px] uppercase font-mono bg-black/40 px-2 py-1 rounded text-paper-aged/50">Lựa chọn {index + 1}</span>
        </div>
        
        <h3 className={`font-serif text-lg font-bold mb-3 ${titleCol}`}>
          {augment.name}
        </h3>
        
        <p className="text-sm font-sans text-paper-aged/90 leading-relaxed min-h-[60px]">
          {augment.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-leather-brown/20">
        <p className="text-[11px] font-sans text-paper-aged/40 italic flex gap-2 items-start">
          <Landmark className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-50" />
          {augment.historicalNote}
        </p>
      </div>
      
      {/* Pick overlay */}
      <div className={`absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg backdrop-blur-[2px]`}>
        <button className={`px-6 py-2.5 rounded border-2 font-bold uppercase tracking-wider text-sm transition-transform transform scale-90 group-hover:scale-100 ${isPrismatic ? 'border-fuchsia-400 text-fuchsia-100 bg-fuchsia-900/50' : isGold ? 'border-yellow-400 text-yellow-100 bg-yellow-900/50' : 'border-zinc-300 text-zinc-100 bg-zinc-800/50'}`}>
          Chọn Nâng Cấp Này
        </button>
      </div>
    </div>
  );
};

