import React from 'react';
import { useGameStore } from '../store/gameStore';

export const ConflictSceneFallback2D: React.FC = () => {
  const { currentTurnState, phase, isStrikeActive } = useGameStore();
  const isResolving = phase === 'resolve';
  const { organicComposition, conflictRate } = currentTurnState;

  // Compute animation speeds and positions based on economy parameters
  // Gear rotation speed: faster when conflict rate is high, hyper-speed during resolve
  const gearSpeed = isResolving ? 8 : (1 + (conflictRate / 10));
  
  // Worker scale: organicComposition increases, machines replace workers (crowd shrinks)
  // Base organicComposition is 1.5. If it goes up to 4.0, workerCount/scale drops.
  const workerScale = Math.max(0.3, 1.5 / Math.max(1, organicComposition));
  
  // Conflict glow color: shifts to deep red when conflict rate is high
  const redIntensity = Math.min(255, Math.round((conflictRate / 100) * 200 + 55));
  const glowColor = `rgba(${redIntensity}, 40, 30, ${0.1 + (conflictRate / 100) * 0.4})`;

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-xl border border-paper-aged/15 overflow-hidden bg-[#15110E] shadow-inner select-none flex flex-col items-center justify-center"
      style={{
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.8), 0 0 20px ${isResolving ? 'rgba(200, 62, 45, 0.2)' : 'rgba(0,0,0,0)'}`,
        transition: 'box-shadow 0.5s ease'
      }}
    >
      {/* Background steam boiler grid or Strike Video */}
      {isStrikeActive ? (
        <video
          src="/assets/videos/Strike%20Event.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,30,20,0.15)_0%,rgba(10,5,2,0.6)_100%)]" />
      )}
      
      {/* Background smoke rising */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-[20%] w-12 h-24 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 left-[50%] w-16 h-32 bg-red-500/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-[75%] w-10 h-20 bg-stone-500/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* SVG Canvas */}
      <svg className="w-full h-full z-10" viewBox="0 0 200 80">
        {/* Separator lines or mechanical rods */}
        <line x1="0" y1="65" x2="200" y2="65" stroke="#3A322A" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* --- LEFT SIDE: CAPITALIST MACHINERY --- */}
        <g transform={`translate(${isResolving ? 70 : 45}, 38)`} className="transition-all duration-700 ease-in-out">
          {/* Machine shadow glowing red based on pressure */}
          <circle cx="0" cy="0" r="24" fill={glowColor} className="transition-all duration-500 blur-sm" />
          
          {/* Main Gear 1 */}
          <g>
            <style>
              {`
                @keyframes spin-gear-1 {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .spinning-gear-1 {
                  transform-origin: 0px 0px;
                  animation: spin-gear-1 ${10 / gearSpeed}s linear infinite;
                }
              `}
            </style>
            <g className="spinning-gear-1">
              {/* Outer teeth (simplified) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect
                  key={angle}
                  x="-4"
                  y="-16"
                  width="8"
                  height="32"
                  fill="#D4AF37"
                  opacity="0.85"
                  transform={`rotate(${angle})`}
                  rx="1"
                />
              ))}
              {/* Main Wheel */}
              <circle cx="0" cy="0" r="13" fill="#B89B30" stroke="#8E5E38" strokeWidth="1.5" />
              {/* Spoke cutouts */}
              <circle cx="0" cy="0" r="8" fill="#15110E" />
              {[0, 60, 120].map((angle) => (
                <line
                  key={angle}
                  x1="-10"
                  y1="0"
                  x2="10"
                  y2="0"
                  stroke="#B89B30"
                  strokeWidth="2"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle cx="0" cy="0" r="4.5" fill="#D4AF37" />
              <circle cx="0" cy="0" r="1.5" fill="#15110E" />
            </g>
          </g>

          {/* Secondary Interlocking Gear 2 */}
          <g transform="translate(23, -15)">
            <style>
              {`
                @keyframes spin-gear-2 {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(-360deg); }
                }
                .spinning-gear-2 {
                  transform-origin: 0px 0px;
                  animation: spin-gear-2 ${6 / gearSpeed}s linear infinite;
                }
              `}
            </style>
            <g className="spinning-gear-2">
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={angle}
                  x="-2"
                  y="-10"
                  width="4"
                  height="20"
                  fill="#8E5E38"
                  opacity="0.75"
                  transform={`rotate(${angle})`}
                  rx="0.5"
                />
              ))}
              <circle cx="0" cy="0" r="8" fill="#A47B56" stroke="#2B251F" strokeWidth="1" />
              <circle cx="0" cy="0" r="2" fill="#2B251F" />
            </g>
          </g>

          {/* Label Capitalist Side */}
          <text x="-25" y="-22" fill="#D4AF37" fontSize="5" fontFamily="serif" letterSpacing="0.5" opacity="0.8">
            MACHINERY & CAPITAL
          </text>
        </g>

        {/* --- MIDDLE: SPARK & STEAM CONFLICT IMPACT --- */}
        {isResolving && (
          <g transform="translate(100, 35)">
            <circle cx="0" cy="0" r="8" fill="rgba(200, 62, 45, 0.4)" className="animate-ping" />
            {/* Sparks */}
            <path
              d="M -10 -5 L 10 5 M -5 10 L 5 -10 M -8 8 L 8 -8 M 0 -12 L 0 12"
              stroke="#D4AF37"
              strokeWidth="1.5"
              className="animate-pulse"
            />
            {/* Steam labels */}
            <text x="0" y="-12" fill="#C83E2D" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              SURPLUS VALUE RESOLVING
            </text>
          </g>
        )}

        {/* --- RIGHT SIDE: WORKER LEADERSHIP --- */}
        <g transform={`translate(${isResolving ? 125 : 150}, 42) scale(${workerScale})`} className="transition-all duration-700 ease-in-out">
          {/* Glow backdrop indicating unity or tension */}
          <circle cx="0" cy="-6" r="22" fill={`rgba(200, 62, 45, ${conflictRate / 400})`} className="blur-md transition-all duration-500" />

          {/* Crowd of workers */}
          {/* Row 1 (Back) */}
          <g opacity="0.5" transform="translate(0, 0)">
            <circle cx="-16" cy="-8" r="4.5" fill="#4B5358" />
            <path d="M -21 -3 Q -21 5 -11 5 Q -11 5 -11 -3 Z" fill="#4B5358" />

            <circle cx="16" cy="-8" r="4.5" fill="#4B5358" />
            <path d="M 11 -3 Q 11 5 21 5 Q 21 5 21 -3 Z" fill="#4B5358" />
          </g>

          {/* Row 2 (Middle) */}
          <g opacity="0.8" transform="translate(0, 2)">
            <circle cx="-9" cy="-7" r="5" fill="#3D454A" />
            <path d="M -15 -2 Q -15 8 -3 8 Q -3 8 -3 -2 Z" fill="#3D454A" />

            <circle cx="9" cy="-7" r="5" fill="#3D454A" />
            <path d="M 3 -2 Q 3 8 15 8 Q 15 8 15 -2 Z" fill="#3D454A" />
          </g>

          {/* Leader (Front Center) */}
          <g transform="translate(0, 4)">
            {/* Health alert: if health is low, leader looks weary (shifted color) */}
            <circle cx="0" cy="-8" r="5.5" fill={conflictRate > 50 ? '#A62B1D' : '#E4D5B7'} stroke="#2B251F" strokeWidth="1" />
            {/* Body */}
            <path d="M -7 -2 Q -7 10 7 10 Q 7 10 7 -2 Z" fill={conflictRate > 50 ? '#A62B1D' : '#3E352F'} stroke="#2B251F" strokeWidth="1" />
            
            {/* Raised Hand holding flag */}
            <line x1="3" y1="-3" x2="8" y2="-17" stroke="#E4D5B7" strokeWidth="1.5" />
            {/* Red Rebel Banner */}
            <path
              d="M 8 -17 L 22 -19 L 20 -12 L 8 -14 Z"
              fill={conflictRate > 35 ? '#C83E2D' : '#8E5E38'}
              stroke="#2B251F"
              strokeWidth="0.8"
            />
          </g>

          {/* Label Worker Side */}
          <text x="-25" y="-26" fill="#4B5358" fontSize="5" fontFamily="serif" letterSpacing="0.5" opacity="0.8">
            ORGANIZED WORKERS
          </text>
        </g>
      </svg>

      {/* Realtime conflict percentage alert bar */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-paper-aged/50 z-20">
        <span>CẤU TẠO HỮU CƠ CƠ KHÍ: oc = {organicComposition.toFixed(2)}</span>
        <span className="text-fire-rebellion animate-pulse">TỶ LỆ XUNG ĐỘT GIAI CẤP: {conflictRate}%</span>
      </div>
    </div>
  );
};
