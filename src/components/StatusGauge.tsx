import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { TurnState } from '../types/economy';

interface StatusGaugeProps {
  label: string;
  value: number; // 0 - 100
  type: 'economic' | 'pressure' | 'social';
  icon: React.ReactNode;
  previewValue?: number; // Predicted value on card hover
  previewState?: TurnState | null; // Predicted state on card hover
}

export const StatusGauge: React.FC<StatusGaugeProps> = ({ label, value, type, icon, previewValue, previewState }) => {
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

  const getGaugeColor = () => {
    if (type === 'pressure') {
      if (value < 40) return '#10B981'; // Green
      if (value < 75) return '#D4AF37'; // Amber
      return '#EF4444'; // Red
    }
    // For economic and social, higher is better
    if (value > 65) return '#10B981';
    if (value > 35) return '#D4AF37';
    return '#EF4444';
  };

  const getPreviewColor = () => {
    if (previewValue === undefined) return '#D4AF37';
    if (type === 'pressure') {
      return (previewValue || 0) > value ? '#EF4444' : '#10B981'; // Red if tension rises, green if drops
    }
    return (previewValue || 0) > value ? '#10B981' : '#EF4444'; // Green if stats rise, red if drop
  };

  const getNeedleColor = () => {
    if (hasPreview) {
      return getPreviewColor();
    }
    return getGaugeColor();
  };

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

  const getGaugeBorder = () => {
    if (faction === 'capitalist') return 'border-brass-polished text-brass-polished';
    return 'border-iron-cold text-paper-aged';
  };

  // Generate Marxist Academic Tooltip explanation
  const getAcademicTooltip = () => {
    const { constantCapital, variableCapital, surplusValue, organicComposition, conflictRate, workerHealth, classConsciousness, unionFund, capital, marketShare, reputation } = currentTurnState;
    
    switch (type) {
      case 'economic':
        if (faction === 'capitalist') {
          const capScore = Math.round(Math.min(100, (capital / 15000) * 50));
          const mktScore = marketShare;
          const currentCalc = Math.round(capScore * 0.6 + mktScore * 0.4);
          
          return (
            <div className="text-left space-y-1.5 text-[10px] sm:text-xs">
              <p className="font-serif border-b border-brass-polished/30 pb-1 text-brass-polished font-bold">Kinh Tế (Tư Bản)</p>
              <p className="font-semibold text-brass-polished/90">Công thức: (Điểm Vốn × 60%) + (Thị phần × 40%)</p>
              <div className="bg-[#15110E] p-1.5 rounded border border-leather-brown/10 font-mono text-[9px] leading-tight space-y-0.5 text-paper-aged/80">
                <p>• Điểm Vốn = Min(100, ({capital} / 15000) × 50) = {capScore}%</p>
                <p>• Thị phần = {mktScore}%</p>
                <p className="text-amber-400">• Hiện tại: ({capScore}% × 0.6) + ({mktScore}% × 0.4) = {currentCalc}%</p>
                {previewState && (
                  <>
                    <p className="border-t border-leather-brown/10 mt-1 pt-1 text-paper-aged/40">Dự kiến sau khi chọn thẻ:</p>
                    <p>• Vốn: {previewState.capital} £ → {Math.round(Math.min(100, (previewState.capital / 15000) * 50))}%</p>
                    <p>• Thị phần: {previewState.marketShare}%</p>
                    <p className="text-red-400">• Dự kiến: ({Math.round(Math.min(100, (previewState.capital / 15000) * 50))}% × 0.6) + ({previewState.marketShare}% × 0.4) = {previewValue}%</p>
                  </>
                )}
              </div>
              <p className="text-[9px] text-paper-aged/50 leading-normal">
                W = c + v + m. Giá trị thặng dư (m = {surplusValue} £) được tích lũy trực tiếp vào Tư bản.
              </p>
            </div>
          );
        } else {
          const fundScore = Math.round(Math.min(100, (unionFund / 3000) * 60));
          const solidarityScore = currentTurnState.solidarityNetwork;
          const currentCalc = Math.round(fundScore * 0.5 + solidarityScore * 0.5);
          
          return (
            <div className="text-left space-y-1.5 text-[10px] sm:text-xs">
              <p className="font-serif border-b border-iron-cold/30 pb-1 text-iron-cold font-bold">Kinh Tế (Công Nhân)</p>
              <p className="font-semibold text-iron-cold/90">Công thức: (Điểm Quỹ × 50%) + (Đoàn kết × 50%)</p>
              <div className="bg-[#15110E] p-1.5 rounded border border-leather-brown/10 font-mono text-[9px] leading-tight space-y-0.5 text-paper-aged/80">
                <p>• Điểm Quỹ = Min(100, ({unionFund} / 3000) × 60) = {fundScore}%</p>
                <p>• Đoàn kết = {solidarityScore}%</p>
                <p className="text-emerald-400">• Hiện tại: ({fundScore}% × 0.5) + ({solidarityScore}% × 0.5) = {currentCalc}%</p>
                {previewState && (
                  <>
                    <p className="border-t border-leather-brown/10 mt-1 pt-1 text-paper-aged/40">Dự kiến sau khi chọn thẻ:</p>
                    <p>• Quỹ: {previewState.unionFund} £ → {Math.round(Math.min(100, (previewState.unionFund / 3000) * 60))}%</p>
                    <p>• Đoàn kết: {previewState.solidarityNetwork}%</p>
                    <p className="text-emerald-400">• Dự kiến: ({Math.round(Math.min(100, (previewState.unionFund / 3000) * 60))}% × 0.5) + ({previewState.solidarityNetwork}% × 0.5) = {previewValue}%</p>
                  </>
                )}
              </div>
            </div>
          );
        }
      case 'pressure': {
        const orgCompScore = Math.round(Math.min(100, (organicComposition / 3.0) * 50));
        const conflictScore = conflictRate;
        const currentCalc = Math.round(orgCompScore * 0.4 + conflictScore * 0.6);
        
        return (
          <div className="text-left space-y-1.5 text-[10px] sm:text-xs">
            <p className="font-serif border-b border-fire-rebellion/30 pb-1 text-fire-rebellion font-bold">Áp Lực Hệ Thống & Đấu Tranh</p>
            <p className="font-semibold text-fire-rebellion/90">Công thức: (Điểm Máy móc × 40%) + (Xung đột × 60%)</p>
            <div className="bg-[#15110E] p-1.5 rounded border border-leather-brown/10 font-mono text-[9px] leading-tight space-y-0.5 text-paper-aged/80">
              <p>• oc = c / v = {organicComposition.toFixed(2)} (c = {constantCapital} £, v = {variableCapital} £)</p>
              <p>• Điểm Máy móc = Min(100, (oc / 3.0) × 50) = {orgCompScore}%</p>
              <p>• Xung đột = {conflictScore}%</p>
              <p className="text-red-400">• Hiện tại: ({orgCompScore}% × 0.4) + ({conflictScore}% × 0.6) = {currentCalc}%</p>
              {previewState && (
                <>
                  <p className="border-t border-leather-brown/10 mt-1 pt-1 text-paper-aged/40">Dự kiến sau khi chọn thẻ:</p>
                  <p>• oc mới: {previewState.organicComposition.toFixed(2)} (c = {previewState.constantCapital} £, v = {previewState.variableCapital} £) → {Math.round(Math.min(100, (previewState.organicComposition / 3.0) * 50))}%</p>
                  <p>• Xung đột mới: {previewState.conflictRate}%</p>
                  <p className="text-red-400">• Dự kiến: ({Math.round(Math.min(100, (previewState.organicComposition / 3.0) * 50))}% × 0.4) + ({previewState.conflictRate}% × 0.6) = {previewValue}%</p>
                </>
              )}
            </div>
          </div>
        );
      }
      case 'social':
        if (faction === 'capitalist') {
          return (
            <div className="text-left space-y-1.5 text-[10px] sm:text-xs">
              <p className="font-serif border-b border-brass-polished/30 pb-1 text-brass-polished font-bold">Uy Tín Giai Cấp Thống Trị</p>
              <p className="font-semibold text-brass-polished/90">Công thức: Xã hội = Danh tiếng</p>
              <div className="bg-[#15110E] p-1.5 rounded border border-leather-brown/10 font-mono text-[9px] leading-tight space-y-0.5 text-paper-aged/80">
                <p>• Danh tiếng chủ xưởng = {reputation}%</p>
                {previewState && (
                  <p className="text-amber-400">• Dự kiến: {previewState.reputation}%</p>
                )}
              </div>
            </div>
          );
        } else {
          const healthScore = workerHealth;
          const consciousnessScore = classConsciousness;
          const currentCalc = Math.round(healthScore * 0.6 + consciousnessScore * 0.4);
          
          return (
            <div className="text-left space-y-1.5 text-[10px] sm:text-xs">
              <p className="font-serif border-b border-iron-cold/30 pb-1 text-iron-cold font-bold">Sức Bền & Ý Thức Giai Cấp</p>
              <p className="font-semibold text-iron-cold/90">Công thức: (Sức khỏe × 60%) + (Ý thức × 40%)</p>
              <div className="bg-[#15110E] p-1.5 rounded border border-leather-brown/10 font-mono text-[9px] leading-tight space-y-0.5 text-paper-aged/80">
                <p>• Sức khỏe công nhân = {healthScore}%</p>
                <p>• Ý thức giai cấp = {consciousnessScore}%</p>
                <p className="text-emerald-400">• Hiện tại: ({healthScore}% × 0.6) + ({consciousnessScore}% × 0.4) = {currentCalc}%</p>
                {previewState && (
                  <>
                    <p className="border-t border-leather-brown/10 mt-1 pt-1 text-paper-aged/40">Dự kiến sau khi chọn thẻ:</p>
                    <p>• Sức khỏe: {previewState.workerHealth}%</p>
                    <p>• Ý thức: {previewState.classConsciousness}%</p>
                    <p className="text-emerald-400">• Dự kiến: ({previewState.workerHealth}% × 0.6) + ({previewState.classConsciousness}% × 0.4) = {previewValue}%</p>
                  </>
                )}
              </div>
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
