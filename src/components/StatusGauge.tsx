import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface StatusGaugeProps {
  label: string;
  value: number; // 0 - 100
  type: 'economic' | 'pressure' | 'social';
  icon: React.ReactNode;
  previewValue?: number; // Predicted value on card hover
}

export const StatusGauge: React.FC<StatusGaugeProps> = ({ label, value, type, icon, previewValue }) => {
  const { faction, currentTurnState, phase } = useGameStore();

  const [displayValue, setDisplayValue] = useState(value);

  // Smoothly animate value changes
  useEffect(() => {
    const startValue = displayValue;
    const duration = 1500; // 1.5s
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (value - startValue) * ease);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  // Normalize rotation: -120 degrees to +120 degrees for the needle
  const minAngle = -120;
  const maxAngle = 120;
  const angle = minAngle + (displayValue / 100) * (maxAngle - minAngle);
  
  const hasPreview = previewValue !== undefined && previewValue !== value;
  const previewAngle = hasPreview ? minAngle + ((previewValue || 0) / 100) * (maxAngle - minAngle) : angle;

  // Generate mathematically precise concentric circular arc path segment
  const getArcPath = (startVal: number, endVal: number, radius: number = 37) => {
    const startAngle = minAngle + (startVal / 100) * (maxAngle - minAngle);
    const endAngle = minAngle + (endVal / 100) * (maxAngle - minAngle);
    
    const radStart = ((startAngle - 90) * Math.PI) / 180;
    const radEnd = ((endAngle - 90) * Math.PI) / 180;
    
    const x1 = 50 + radius * Math.cos(radStart);
    const y1 = 50 + radius * Math.sin(radStart);
    const x2 = 50 + radius * Math.cos(radEnd);
    const y2 = 50 + radius * Math.sin(radEnd);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweepFlag = 1; // clockwise
    
    return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2.toFixed(3)} ${y2.toFixed(3)}`;
  };

  // Sub-labels for better understanding
  const getSubLabel = () => {
    if (type === 'economic') {
      return faction === 'capitalist' ? 'Vốn & Thị phần' : 'Quỹ & Mạng lưới';
    }
    if (type === 'pressure') {
      return 'Xung đột & Máy móc';
    }
    return faction === 'capitalist' ? 'Danh tiếng chủ xưởng' : 'Sức khỏe & Ý thức';
  };

  // Set colors based on gauge type and value
  const getNeedleColor = () => {
    if (type === 'pressure') {
      if (value > 75) return '#C83E2D'; // Dangerous red
      if (value > 45) return '#D4AF37'; // Warning brass
      return '#4B5358'; // Normal iron
    } else {
      if (value < 25) return '#C83E2D'; // Low health/reputation/wealth is bad
      if (value < 55) return '#D4AF37';
      return '#D4AF37'; // Polished brass for good state
    }
  };

  const getGaugeBorder = () => {
    if (faction === 'capitalist') return 'border-brass-polished text-brass-polished';
    return 'border-iron-cold text-paper-aged';
  };

  const getPreviewColor = () => {
    if (previewValue === undefined) return '#D4AF37';
    if (type === 'pressure') {
      return previewValue > value ? '#EF4444' : '#10B981'; // Red if tension rises, green if drops
    }
    return previewValue > value ? '#10B981' : '#EF4444'; // Green if stats rise, red if drop
  };

  // Generate Marxist Academic Tooltip explanation
  const getAcademicTooltip = () => {
    const { constantCapital, variableCapital, surplusValue, organicComposition, conflictRate, workerHealth, classConsciousness, unionFund, capital, marketShare, reputation } = currentTurnState;
    const mPrime = variableCapital > 0 ? Math.round((surplusValue / variableCapital) * 100) : 0;
    
    switch (type) {
      case 'economic':
        if (faction === 'capitalist') {
          return (
            <div className="text-left space-y-1">
              <p className="font-serif border-b border-brass-polished/30 pb-1 text-brass-polished">Tài sản & Thị trường (Tư bản)</p>
              <p><span className="text-brass-polished/80">Tích lũy Tư bản (Capital):</span> {capital} £</p>
              <p><span className="text-brass-polished/80">Thị phần (Market Share):</span> {marketShare}%</p>
              <p className="pt-1 text-xs italic border-t border-brass-polished/20 text-paper-aged/70">
                W = c + v + m. Giá trị thặng dư (m = {surplusValue} £) được tích lũy trực tiếp vào Tư bản.
              </p>
            </div>
          );
        } else {
          return (
            <div className="text-left space-y-1">
              <p className="font-serif border-b border-iron-cold/30 pb-1 text-iron-cold">Quỹ Đấu tranh Công nhân</p>
              <p><span className="text-iron-cold/80">Quỹ Công đoàn (Union Fund):</span> {unionFund} £</p>
              <p><span className="text-iron-cold/80">Mạng lưới Đoàn kết (Solidarity):</span> {currentTurnState.solidarityNetwork}%</p>
              <p className="pt-1 text-xs italic border-t border-iron-cold/20 text-paper-aged/70">
                Nguồn lực tài chính độc lập giúp công nhân duy trì bãi công mà không bị bỏ đói.
              </p>
            </div>
          );
        }
      case 'pressure':
        return (
          <div className="text-left space-y-1">
            <p className="font-serif border-b border-fire-rebellion/30 pb-1 text-fire-rebellion">Áp Lực Hệ Thống & Đấu Tranh</p>
            <p><span className="text-fire-rebellion/80">Cấu tạo hữu cơ tư bản (oc = c/v):</span> {organicComposition.toFixed(2)}</p>
            <p><span className="text-fire-rebellion/80">Tỷ lệ mâu thuẫn (Conflict Rate):</span> {conflictRate}%</p>
            <p className="pt-1 text-xs italic border-t border-fire-rebellion/20 text-paper-aged/70">
              Cấu tạo hữu cơ tăng tức là máy móc (c = {constantCapital} £) thay thế lao động sống (v = {variableCapital} £), đẩy nhanh thất nghiệp và làm gia tăng xung đột.
            </p>
          </div>
        );
      case 'social':
        if (faction === 'capitalist') {
          return (
            <div className="text-left space-y-1">
              <p className="font-serif border-b border-brass-polished/30 pb-1 text-brass-polished">Uy Tín Giai Cấp Thống Trị</p>
              <p><span className="text-brass-polished/80">Danh tiếng chủ xưởng (Reputation):</span> {reputation}/100</p>
              <p className="pt-1 text-xs italic border-t border-brass-polished/20 text-paper-aged/70">
                Độ tín nhiệm trước Nghị viện và giới tư bản lân cận, quyết định khả năng thương lượng xã hội.
              </p>
            </div>
          );
        } else {
          return (
            <div className="text-left space-y-1">
              <p className="font-serif border-b border-iron-cold/30 pb-1 text-iron-cold">Sức Bền & Ý Thức Giai Cấp</p>
              <p><span className="text-iron-cold/80">Sức khỏe công nhân (Health):</span> {workerHealth}/100</p>
              <p><span className="text-iron-cold/80">Ý thức giai cấp (Class Consciousness):</span> {classConsciousness}/100</p>
              <p className="pt-1 text-xs italic border-t border-iron-cold/20 text-paper-aged/70">
                Sức khỏe duy trì lực lượng lao động. Ý thức giai cấp đo lường mức độ nhận thức về sự bóc lột thặng dư (m' = {mPrime}%).
              </p>
            </div>
          );
        }
    }
  };

  const needleColor = getNeedleColor();
  const isHighPressure = type === 'pressure' && value > 70;

  return (
    <div className={`relative flex flex-col items-center p-2 xl:p-3 bg-wood-dark/40 rounded-xl border border-paper-aged/10 glass-panel select-none w-full ${isHighPressure ? 'shake-gentle' : ''}`}>
      {/* Gauge Title */}
      <div className="flex flex-col items-center mb-1 md:mb-2 w-full text-center">
        <div className="flex items-center justify-center gap-1 font-serif text-[11px] sm:text-xs xl:text-sm text-paper-aged/90 whitespace-nowrap">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-[7px] sm:text-[8px] font-sans text-paper-aged/40 mt-0.5 tracking-wide uppercase whitespace-nowrap hidden sm:block">
          {getSubLabel()}
        </span>
      </div>

      {/* SVG Steam Gauge */}
      <div className="relative w-full aspect-square max-w-[140px] flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Dial Background shadow */}
          <circle cx="50" cy="50" r="46" fill="#1C1815" stroke="#3A322A" strokeWidth="2" />
          
          {/* Decorative Copper Ring */}
          <circle cx="50" cy="50" r="43" fill="none" stroke={faction === 'capitalist' ? '#D4AF37' : '#4B5358'} strokeWidth="1" opacity="0.6" />
          
          {/* Gauge Color Arcs */}
          {type === 'pressure' ? (
            <>
              {/* Normal/Safe zone */}
              <path d={getArcPath(0, 65)} fill="none" stroke="#485D5E" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              {/* Warning zone */}
              <path d={getArcPath(65, 85)} fill="none" stroke="#B89B30" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              {/* Danger zone */}
              <path d={getArcPath(85, 100)} fill="none" stroke="#A62B1D" strokeWidth="6.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Danger zone */}
              <path d={getArcPath(0, 30)} fill="none" stroke="#A62B1D" strokeWidth="6.5" strokeLinecap="round" />
              {/* Warning zone */}
              <path d={getArcPath(30, 70)} fill="none" stroke="#B89B30" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              {/* Safe zone */}
              <path d={getArcPath(70, 100)} fill="none" stroke="#485D5E" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            </>
          )}

          {/* Scale Markings */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
            const tickAngle = minAngle + (tick / 100) * (maxAngle - minAngle);
            const rad = (tickAngle - 90) * (Math.PI / 180);
            const x1 = 50 + 36 * Math.cos(rad);
            const y1 = 50 + 36 * Math.sin(rad);
            const x2 = 50 + 40 * Math.cos(rad);
            const y2 = 50 + 40 * Math.sin(rad);
            const isMajor = tick % 20 === 0;

            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#E4D5B7"
                strokeWidth={isMajor ? 1.5 : 0.7}
                opacity={isMajor ? 0.8 : 0.4}
              />
            );
          })}

          {/* Sub-label inside the dial */}
          <text
            x="50"
            y="70"
            fill="#E4D5B7"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
            opacity="0.7"
          >
            {value}%
          </text>

          {/* The Brass Center Bolt */}
          <circle cx="50" cy="50" r="6" fill="#2B251F" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="50" cy="50" r="2.5" fill="#D4AF37" />

          {/* Ghost Needle (Hover preview) */}
          {hasPreview && (
            <g opacity="0.45">
              {/* Shadow */}
              <line
                x1="50"
                y1="50"
                x2={50 + 35 * Math.cos(((previewAngle - 88) * Math.PI) / 180)}
                y2={50 + 35 * Math.sin(((previewAngle - 88) * Math.PI) / 180)}
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
              {/* Line */}
              <line
                x1="50"
                y1="50"
                x2={50 + 34 * Math.cos(((previewAngle - 90) * Math.PI) / 180)}
                y2={50 + 34 * Math.sin(((previewAngle - 90) * Math.PI) / 180)}
                stroke={getPreviewColor()}
                strokeWidth="1.8"
                strokeDasharray="2,2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Needle shadow */}
          <line
            x1="50"
            y1="50"
            x2={50 + 35 * Math.cos(((angle - 88) * Math.PI) / 180)}
            y2={50 + 35 * Math.sin(((angle - 88) * Math.PI) / 180)}
            stroke="#000"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Needle */}
          <line
            x1="50"
            y1="50"
            x2={50 + 34 * Math.cos(((angle - 90) * Math.PI) / 180)}
            y2={50 + 34 * Math.sin(((angle - 90) * Math.PI) / 180)}
            stroke={needleColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Steam puffing particles if pressure is extreme */}
      {isHighPressure && (
        <>
          <div className="absolute top-8 left-6 w-3 h-3 bg-white/20 rounded-full blur-[2px] steam-puff-effect" style={{ animationDelay: '0s' }} />
          <div className="absolute top-10 right-6 w-2 h-2 bg-white/25 rounded-full blur-[2px] steam-puff-effect" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Value Readout Box */}
      <div className={`mt-2 md:mt-3 px-1 md:px-2 py-0.5 md:py-1 font-mono text-xs xl:text-sm rounded border border-paper-aged/10 bg-[#16120F] text-center w-full max-w-[80px] md:max-w-[100px] flex items-center justify-center gap-1 shadow-inner ${
        Math.abs(value - displayValue) > 5 ? 'text-amber-400 font-bold border-amber-500/50 scale-105' : 'text-paper-aged'
      } transition-all duration-100 ${getGaugeBorder()}`}>
        <span>{Math.round(displayValue)}%</span>
        {hasPreview && (
          <span className={`text-[10px] font-bold ${
            type === 'pressure'
              ? ((previewValue || 0) > value ? 'text-red-400' : 'text-emerald-400')
              : ((previewValue || 0) > value ? 'text-emerald-400' : 'text-red-400')
          }`}>
            → {previewValue}%
          </span>
        )}
      </div>

      {/* Tooltip Overlay */}
      {phase !== 'resolve' && (
        <div className="absolute inset-0 z-10 bg-[#1C1814]/95 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 flex items-center justify-center pointer-events-none border border-leather-brown/30 shadow-lg">
          <div className="text-[10px] sm:text-xs font-sans text-paper-aged leading-tight w-full max-h-full overflow-y-auto custom-scrollbar">
            {getAcademicTooltip()}
          </div>
        </div>
      )}
    </div>
  );
};
