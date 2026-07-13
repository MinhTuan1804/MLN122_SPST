import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Calendar } from 'lucide-react';

interface TimelineEvent {
  turn: number;
  year: number;
  name: string;
  short: string;
  type: 'event' | 'augment';
}

export const TimelineBar: React.FC = () => {
  const { currentTurnState, faction } = useGameStore();
  const currentTurn = currentTurnState.turnNumber;

  // New combined timeline with both historical events and augments
  const timelineNodes: TimelineEvent[] = [
    { turn: 3, year: 1820, name: 'Luddite Uprising', short: 'SỰ KIỆN', type: 'event' },
    { turn: 5, year: 1826, name: 'Học Thuyết (Bạc/Vàng)', short: 'HỌC THUYẾT 1', type: 'augment' },
    { turn: 6, year: 1829, name: 'Khủng hoảng cơ bản', short: 'SỰ KIỆN', type: 'event' },
    { turn: 8, year: 1835, name: 'Đình công nhỏ', short: 'SỰ KIỆN', type: 'event' },
    { turn: 10, year: 1841, name: 'Học Thuyết (Vàng/Kim Cương)', short: 'HỌC THUYẾT 2', type: 'augment' },
    { turn: 12, year: 1848, name: 'Đỉnh điểm mâu thuẫn', short: 'SỰ KIỆN', type: 'event' },
    { turn: 14, year: 1854, name: 'Học Thuyết (Kim Cương)', short: 'HỌC THUYẾT 3', type: 'augment' },
    { turn: 15, year: 1857, name: 'Khủng hoảng & Kết thúc', short: 'SỰ KIỆN', type: 'event' }
  ];

  const totalTurns = 15;
  const progressPercent = Math.min(100, Math.round((currentTurn / totalTurns) * 100));

  const isCapitalist = faction === 'capitalist';
  const highlightBg = isCapitalist ? 'bg-brass-polished' : 'bg-iron-cold';
  const highlightText = isCapitalist ? 'text-brass-polished' : 'text-iron-cold';
  const activeDotBorder = isCapitalist ? 'border-brass-polished shadow-[0_0_8px_#D4AF37]' : 'border-iron-cold shadow-[0_0_8px_#8F9CA3]';

  return (
    <div className="w-full bg-[#1C1814]/80 p-3 rounded-xl border border-leather-brown/10 glass-panel select-none">
      <div className="flex flex-col space-y-3">
        {/* Timeline Metadata */}
        <div className="flex justify-between items-center text-[10px] md:text-xs">
          <span className="text-paper-aged/50 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5" /> TIẾN TRÌNH LỊCH SỬ (1811 - 1857)
          </span>
          <span className="font-mono text-paper-aged/80">
            Năm <strong className={highlightText}>{currentTurnState.year}</strong> (Lượt {currentTurn}/{totalTurns})
          </span>
        </div>

        {/* ProgressBar & Dots */}
        <div className="relative pt-6 pb-6 px-4">
          {/* Background line */}
          <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-wood-dark/70 rounded-full -translate-y-1/2" />
          
          {/* Active progress line */}
          <div 
            className={`absolute top-1/2 left-4 h-1.5 rounded-full -translate-y-1/2 transition-all duration-500 ${highlightBg}`} 
            style={{ width: `calc(${progressPercent}% - 8px)` }}
          />

          {/* Special Events dots */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 pointer-events-none">
            {/* Start point */}
            <div className="absolute flex flex-col items-center -translate-x-1/2" style={{ left: '0%' }}>
              <div className={`w-3.5 h-3.5 rounded-full border-2 bg-[#1C1814] ${currentTurn >= 0 ? activeDotBorder : 'border-wood-dark'}`} />
              <span className="absolute top-4.5 text-[10px] font-mono font-bold text-paper-aged/60">1811</span>
            </div>

            {/* Event & Augment Markers */}
            {timelineNodes.map((node, idx) => {
              const isActive = currentTurn >= node.turn;
              const isCurrent = currentTurn === node.turn;
              
              const isAugment = node.type === 'augment';
              const augmentColor = 'border-amber-400 shadow-[0_0_12px_#F59E0B] text-amber-400';
              
              // Base colors
              const nodeBorder = isAugment 
                ? (isActive ? augmentColor : 'border-amber-700 bg-[#1C1814]') 
                : (isActive ? `${activeDotBorder} ${isCurrent ? 'bg-wood-dark scale-125' : highlightBg}` : 'border-paper-aged/30 bg-[#1C1814]');
              
              const nodeText = isAugment
                ? (isActive ? 'text-amber-400 font-bold' : 'text-amber-600/80')
                : (isActive ? `${highlightText} font-bold` : 'text-paper-aged/60');

              // Position along the timeline based on turn number
              // 15 turns total. turn 1 is 0%, turn 15 is 100%.
              const positionPercent = ((node.turn - 1) / (totalTurns - 1)) * 100;

              return (
                <div 
                  key={idx} 
                  className={`absolute flex flex-col items-center -translate-x-1/2 ${isAugment ? 'z-10' : 'z-0'}`} 
                  style={{ left: `${positionPercent}%` }} 
                >
                  <div 
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${nodeBorder} ${isAugment && isActive ? 'animate-pulse scale-110' : ''}`}
                    title={node.name}
                  />
                  <span className={`absolute top-4.5 text-[9px] md:text-[10px] font-mono whitespace-nowrap transition-colors ${nodeText}`}>
                    {node.year}
                  </span>
                  <span className={`absolute -top-5 text-[8px] md:text-[9px] tracking-wider uppercase font-sans whitespace-nowrap transition-opacity ${isCurrent || isAugment ? 'opacity-100 font-bold' : 'opacity-80'} ${nodeText}`}>
                    {node.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
