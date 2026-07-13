import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { FastForward, Swords } from 'lucide-react';

export const AutoResolveOverlay: React.FC = () => {
  const {
    phase,
    playerCards,
    opponentCards,
    playerSelectedCardId,
    opponentSelectedCardId,
    resolveCountdown,
    tickResolveCountdown,
    skipResolve,
    faction
  } = useGameStore();

  const isResolving = phase === 'resolve';

  useEffect(() => {
    let interval: any;
    if (isResolving) {
      interval = setInterval(() => {
        tickResolveCountdown();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResolving, tickResolveCountdown]);

  if (!isResolving) return null;

  const playerCard = playerCards.find(c => c.id === playerSelectedCardId);
  const opponentCard = opponentCards.find(c => c.id === opponentSelectedCardId);

  const getFactionName = (f: string) => {
    return f === 'capitalist' ? 'Nhà Tư Bản' : 'Thủ Lĩnh Công Nhân';
  };

  const getFactionColors = (f: string) => {
    if (f === 'capitalist') return 'text-brass-polished bg-[#2B231C]/90 border-brass-polished/30';
    return 'text-iron-cold bg-[#1C2225]/90 border-iron-cold/30';
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[60] animate-fade-in select-none">
      
      {/* Decorative gears or Victorian borders with glassmorphism */}
      <div className="w-full bg-[#1C1814]/95 backdrop-blur-md woodcut-border p-4 rounded-xl shadow-2xl flex flex-col items-center space-y-4 relative border border-leather-brown/20">
        
        {/* Steam Piston title */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1C1814] px-4 py-1 border border-leather-brown/30 rounded-full font-serif text-xs text-brass-polished flex items-center gap-1.5 shadow-md">
          <Swords className="w-3.5 h-3.5 text-fire-rebellion animate-pulse" /> Auto-Resolve Phase
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 items-stretch text-left">
          {/* Player Choice */}
          {playerCard && (
            <div className={`p-3 rounded-lg border flex flex-col justify-between ${getFactionColors(faction || 'capitalist')}`}>
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider opacity-60">
                  Quyết định của Bạn ({getFactionName(faction || 'capitalist')})
                </span>
                <h4 className="font-serif font-bold text-sm mt-0.5 border-b border-leather-brown/10 pb-1 mb-1">
                  {playerCard.name}
                </h4>
                <p className="text-[11px] text-paper-aged/80 italic font-sans leading-relaxed">
                  "{playerCard.description}"
                </p>
              </div>
            </div>
          )}

          {/* Opponent (AI) Choice */}
          {opponentCard && (
            <div className={`p-3 rounded-lg border flex flex-col justify-between ${getFactionColors(faction === 'capitalist' ? 'worker' : 'capitalist')}`}>
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider opacity-60">
                  Quyết định đối thủ ({getFactionName(faction === 'capitalist' ? 'worker' : 'capitalist')})
                </span>
                <h4 className="font-serif font-bold text-sm mt-0.5 border-b border-leather-brown/10 pb-1 mb-1">
                  {opponentCard.name}
                </h4>
                <p className="text-[11px] text-paper-aged/80 italic font-sans leading-relaxed">
                  "{opponentCard.description}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Counter & Action */}
        <div className="w-full pt-2 border-t border-leather-brown/20 flex flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-sm md:text-base font-mono text-fire-rebellion font-bold animate-pulse">
              Hiệu ứng xung đột diễn ra... {resolveCountdown}s
            </div>
            <p className="text-[10px] text-paper-aged/50 font-sans">
              Quan sát cuộc quyết đấu cơ học 3D nảy lửa ở phía trên.
            </p>
          </div>

          <button
            onClick={skipResolve}
            className="px-4 py-1.5 font-serif text-[10px] font-bold uppercase tracking-wider border border-brass-polished text-brass-polished rounded hover:bg-brass-polished/10 transition-all duration-300 flex items-center gap-1.5 shadow cursor-pointer"
          >
            <FastForward className="w-3 h-3" /> Bỏ qua hoạt cảnh
          </button>
        </div>

      </div>
    </div>
  );
};
