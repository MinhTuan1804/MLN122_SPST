import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { TurnState } from '../types/economy';
import { Settings, Zap, ShoppingBag, Handshake, Flame, BookOpen, RefreshCw, HelpCircle, Swords, Shield, Scale } from 'lucide-react';
import { playHoverSound, playClickSound, playCoinSound } from '../utils/audioEffects';
import { getShopOdds } from '../data/cardPool';
import { TermTooltip } from './TermTooltip';


export const PickPhase: React.FC = () => {
  const {
    faction,
    playerCards,
    playerSelectedCardId,
    selectCard,
    academicMode,
    setHoveredCardId,
    rerollCards,
    rerollsUsed,
    rerollsMax,
    currentTurnState,
    playerLevel,
    playerXp,
    buyXp,
    pickedCardIds,
    aiPersonality,
    activeAdvisor,
  } = useGameStore();

  const currentOdds = getShopOdds(playerLevel);

  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);
  const [floats, setFloats] = useState<{id: number, text: string, type: 'xp' | 'reroll', color: string}[]>([]);
  const [isLevelUpFlash, setIsLevelUpFlash] = useState(false);
  const prevLevel = useRef(playerLevel);

  useEffect(() => {
    if (playerLevel > prevLevel.current) {
      setIsLevelUpFlash(true);
      setTimeout(() => setIsLevelUpFlash(false), 800);
    }
    prevLevel.current = playerLevel;
  }, [playerLevel]);

  const addFloat = (text: string, type: 'xp' | 'reroll', color: string) => {
    const id = Date.now() + Math.random();
    setFloats(prev => [...prev, {id, text, type, color}]);
    setTimeout(() => {
      setFloats(prev => prev.filter(t => t.id !== id));
    }, 1200);
  };

  const XP_TABLE = [0, 0, 0, 6, 10, 20, 36, 56, 80, 9999];
  const maxXP = playerLevel < 9 ? XP_TABLE[playerLevel] : 0;
  const xpPercent = playerLevel < 9 ? Math.min(100, (playerXp / maxXP) * 100) : 100;

  if (!faction || playerSelectedCardId) return null;

  const getEffectColor = (val: number, key: string) => {
    const badKeys = ['conflictRate'];
    const isBadKey = badKeys.includes(key);

    if (val > 0) return isBadKey ? 'text-red-400' : 'text-emerald-400';
    if (val < 0) return isBadKey ? 'text-emerald-400' : 'text-red-400';
    return 'text-paper-aged/50';
  };

  const formatEffectLabel = (key: keyof TurnState, val: number) => {
    const prefix = val > 0 ? `+${val}` : `${val}`;
    
    if (academicMode) {
      switch (key) {
        case 'constantCapital': return `Δc (Tư bản bất biến): ${prefix} £`;
        case 'variableCapital': return `Δv (Tư bản khả biến): ${prefix} £`;
        case 'surplusValue': return `Δm (Giá trị thặng dư): ${prefix} £`;
        case 'capital': return `ΔTư bản tích lũy: ${prefix} £`;
        case 'unionFund': return `ΔQuỹ công đoàn: ${prefix} £`;
        case 'workerHealth': return `ΔSức khỏe (Lao động): ${prefix}%`;
        case 'conflictRate': return `ΔTỷ lệ xung đột: ${prefix}%`;
        case 'classConsciousness': return `ΔÝ thức giai cấp: ${prefix}%`;
        case 'solidarityNetwork': return `ΔMạng lưới đoàn kết: ${prefix}%`;
        case 'marketShare': return `ΔThị phần: ${prefix}%`;
        case 'reputation': return `ΔDanh tiếng: ${prefix}%`;
        default: return `Δ${String(key)}: ${prefix}`;
      }
    }

    switch (key) {
      case 'constantCapital': return `Máy móc & Vật tư: ${prefix} £`;
      case 'variableCapital': return `Chi phí Quỹ lương: ${prefix} £`;
      case 'capital': return `Ngân quỹ Tư Bản: ${prefix} £`;
      case 'unionFund': return `Quỹ Công Đoàn: ${prefix} £`;
      case 'workerHealth': return `Sức khỏe Công nhân: ${prefix}%`;
      case 'conflictRate': return `Mức độ Mâu thuẫn: ${prefix}%`;
      case 'classConsciousness': return `Ý thức Công đoàn: ${prefix}%`;
      case 'solidarityNetwork': return `Mạng lưới Đoàn kết: ${prefix}%`;
      case 'marketShare': return `Thị phần Xưởng: ${prefix}%`;
      case 'reputation': return `Danh tiếng Chủ xưởng: ${prefix}%`;
      default: return `${String(key)}: ${prefix}`;
    }
  };

  const getThemeColors = () => {
    if (faction === 'capitalist') {
      return {
        accent: 'border-brass-polished text-brass-polished',
        bg: 'hover:border-brass-polished/60 focus:ring-brass-polished',
        headerBg: 'bg-[#2B231C]',
        selectedBorder: 'border-2 border-brass-polished shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-[#2B231C]/90',
        normalBorder: 'border-leather-brown/30 bg-[#251E19]/80',
        confirmButton: 'bg-brass-polished text-[#1C1814] hover:brightness-110'
      };
    }
    return {
      accent: 'border-iron-cold text-iron-cold',
      bg: 'hover:border-iron-cold/60 focus:ring-iron-cold',
      headerBg: 'bg-[#1C2225]',
      selectedBorder: 'border-2 border-iron-cold shadow-[0_0_15px_rgba(143,156,163,0.3)] bg-[#1C2225]/90',
      normalBorder: 'border-leather-brown/30 bg-[#1D2124]/80',
      confirmButton: 'bg-iron-cold text-paper-aged hover:bg-iron-cold/80'
    };
  };

  const theme = getThemeColors();

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 rounded-2xl transition-colors ${isLevelUpFlash ? 'animate-flash' : ''}`}>
      
      {/* Pick Phase Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-paper-aged font-bold tracking-widest woodcut-text uppercase shadow-black drop-shadow-md">
          {faction === 'capitalist' ? 'Giai đoạn Quyết sách' : 'Kỳ họp Công đoàn'}
        </h2>
        <p className="text-xs text-paper-aged/50 mt-1 max-w-lg mx-auto font-sans mb-2">
          Hãy chọn một thẻ bài chiến thuật bên dưới. Thẻ này sẽ được bổ sung vào bộ bài tích lũy của bạn và quyết định cán cân kinh tế trong lượt này.
        </p>

        {/* AI Personality Badge */}
        {(() => {
          const personalityConfig = {
            aggressive: { label: 'Đối thủ: Hung Hãng', icon: Swords, color: 'text-red-400 border-red-500/30 bg-red-950/20' },
            defensive:  { label: 'Đối thủ: Phòng Thủ',  icon: Shield, color: 'text-blue-400 border-blue-500/30 bg-blue-950/20' },
            balanced:   { label: 'Đối thủ: Cân Bằng',  icon: Scale,  color: 'text-amber-400 border-amber-500/30 bg-amber-950/20' },
          };
          const cfg = personalityConfig[aiPersonality];
          const Icon = cfg.icon;
          return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono mb-3 ${cfg.color}`}>
              <Icon className="w-3 h-3" />
              <span>{cfg.label}</span>
            </div>
          );
        })()}

        {/* SHOP CONTROLS */}
        <div className="max-w-3xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-3 bg-[#1C1814]/80 p-3 rounded-xl border border-leather-brown/20 shadow-lg backdrop-blur-sm">


          {/* LEVEL & XP */}
          <div className="flex-grow w-full md:w-auto flex items-center gap-3 bg-wood-dark/40 px-3 py-2 rounded-lg border border-leather-brown/10">
            <div className="flex flex-col items-center justify-center bg-wood-dark border border-brass-polished/30 rounded w-10 h-10 shadow-inner shrink-0">
              <span className="text-[9px] text-paper-aged/60 leading-none mb-0.5">CẤP</span>
              <span className="text-xl font-serif font-bold text-brass-polished leading-none">{playerLevel}</span>
            </div>
            <div className="flex-grow flex flex-col gap-1.5 min-w-[150px]">
              <div className="flex justify-between text-[10px] font-mono text-paper-aged/80">
                <span>KINH NGHIỆM</span>
                <span className="font-bold">{playerLevel >= 9 ? 'TỐI ĐA' : `${playerXp} / ${maxXP}`}</span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-stretch justify-center gap-2 shrink-0">
            <button
              onClick={() => {
                playCoinSound();
                buyXp();
                addFloat(faction === 'capitalist' ? '-800£' : '-80 Quỹ', 'xp', 'text-red-400');
                addFloat('+4 XP', 'xp', 'text-blue-400 font-bold');
              }}
              onMouseEnter={playHoverSound}
              disabled={playerLevel >= 9 || (faction === 'capitalist' ? currentTurnState.capital < 800 : currentTurnState.unionFund < 80)}
              className={`relative px-4 py-1.5 rounded-lg flex flex-col items-center justify-center text-xs font-mono border transition-all min-w-[140px] ${
                playerLevel >= 9
                ? 'opacity-40 cursor-not-allowed border-leather-brown/10 bg-wood-dark/50 text-paper-aged/30' 
                : 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-500/10 active:scale-95 shadow-inner'
              }`}
            >
              <div className="flex items-center gap-1 font-bold mb-0.5">
                <span className="opacity-80">Mua Kinh Nghiệm</span>
                <span className="font-bold opacity-100">{faction === 'capitalist' ? '800£' : '80 Quỹ'} = 4 XP</span>
              </div>
              
              {/* Floating Texts for XP */}
              {floats.filter(f => f.type === 'xp').map((f, i) => (
                <div key={f.id} className={`absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-float-up ${f.color}`} style={{animationDelay: `${i * 0.1}s`}}>
                  {f.text}
                </div>
              ))}
            </button>

            <button
              onClick={() => {
                playCoinSound();
                rerollCards();
                addFloat(faction === 'capitalist' ? '-200£' : '-15 Quỹ', 'reroll', 'text-amber-500');
              }}
              onMouseEnter={playHoverSound}
              disabled={rerollsUsed >= rerollsMax || (faction === 'capitalist' ? currentTurnState.capital < 200 : currentTurnState.unionFund < 150)}
              className={`relative px-4 py-1.5 rounded-lg flex flex-col items-center justify-center text-xs font-mono border transition-all min-w-[140px] ${
                rerollsUsed >= rerollsMax 
                ? 'opacity-40 cursor-not-allowed border-leather-brown/10 bg-wood-dark/50 text-paper-aged/30' 
                : 'border-brass-polished/30 text-brass-polished bg-amber-950/20 hover:bg-brass-polished/10 active:scale-95 shadow-inner'
              }`}
            >
              <div className="flex items-center gap-1 font-bold mb-0.5">
                <RefreshCw className={`w-3.5 h-3.5 ${rerollsUsed < rerollsMax ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }} />
                LÀM MỚI SHOP
              </div>
              <span className="opacity-70 text-[10px]">
                {faction === 'capitalist' ? '200£' : '150£'} ({rerollsMax - rerollsUsed}/{rerollsMax})
              </span>
            </button>

            {/* Drop Rates Popup */}
            <div className="relative group flex items-center justify-center">
              <button className="w-8 h-8 rounded-full bg-wood-dark/50 border border-leather-brown/30 text-paper-aged/50 hover:text-paper-aged hover:bg-wood-dark hover:border-leather-brown transition-all flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 bg-[#1C1814] border border-leather-brown/30 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                <div className="text-[10px] uppercase font-bold text-paper-aged/70 mb-2 border-b border-leather-brown/20 pb-1.5 text-center">Tỉ lệ xuất hiện</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between items-center"><span className="text-zinc-400">Bậc 1</span><span className="text-paper-aged/80">{currentOdds[0]}%</span></div>
                  <div className="flex justify-between items-center"><span className="text-green-500">Bậc 2</span><span className="text-paper-aged/80">{currentOdds[1]}%</span></div>
                  <div className="flex justify-between items-center"><span className="text-blue-400">Bậc 3</span><span className="text-paper-aged/80">{currentOdds[2]}%</span></div>
                  <div className="flex justify-between items-center"><span className="text-purple-500">Bậc 4</span><span className="text-paper-aged/80">{currentOdds[3]}%</span></div>
                  <div className="flex justify-between items-center"><span className="text-yellow-400">Bậc 5</span><span className="text-paper-aged/80">{currentOdds[4]}%</span></div>
                  <div className="border-t border-leather-brown/20 my-1 pt-1 flex justify-between items-center">
                    <span className="text-amber-400 font-sans font-bold">Mạ Vàng</span>
                    <span className="text-amber-300 font-bold">8%</span>
                  </div>
                </div>
                {/* Triangle pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#1C1814] border-t-8 border-x-transparent border-x-8 border-b-0" />
                {/* Invisible hover bridge */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {playerCards.map((card) => {
          const isSelected = localSelectedId === card.id;
          const isAdvisorRecommended = !!(activeAdvisor && card.tags &&
            activeAdvisor.preferredTags.some(tag => card.tags!.includes(tag)));
          
          const getTierStyle = (tier?: number, selected?: boolean) => {
            const base = selected ? 'border-2' : 'border border-b-4';
            switch (tier) {
              case 5: return `${base} border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]`;
              case 4: return `${base} border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]`;
              case 3: return `${base} border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]`;
              case 2: return `${base} border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]`;
              case 1:
              default: return `${base} border-gray-500`;
            }
          };

          return (
            <button
              key={card.id}
              onClick={() => {
                playClickSound();
                setLocalSelectedId(card.id);
              }}
              onMouseEnter={() => {
                playHoverSound();
                setHoveredCardId(card.id);
              }}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`relative text-left rounded-xl overflow-visible transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group focus:outline-none focus:ring-2 min-h-[290px] cursor-pointer ${
                isSelected ? theme.bg : theme.bg
              } bg-[#251E19]/90 ${getTierStyle(card.tier, isSelected)} ${isSelected ? 'scale-105 z-10' : ''} ${card.isFoil ? 'foil-card' : ''} ${isAdvisorRecommended && !isSelected ? 'ring-1 ring-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.25)]' : ''}`}
            >
              {/* Card Header */}
              <div className={`p-4 border-b border-leather-brown/20 flex justify-between items-start gap-2 rounded-t-xl ${theme.headerBg}`}>
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-1.5 mb-1">
                    <span className="text-[10px] font-mono opacity-60">BẬC {card.tier || 1}</span>
                    {card.isFoil && (
                      <span className="relative group/foil foil-badge text-[9px] font-bold font-mono cursor-help">
                        ✶ MẠ VÀNG
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 p-2 text-[10px] font-sans text-paper-aged bg-[#1C1814] border border-amber-500/30 rounded-lg shadow-xl opacity-0 group-hover/foil:opacity-100 pointer-events-none transition-opacity z-[150] text-center leading-relaxed font-normal normal-case">
                          Tỷ lệ xuất hiện: 8% ngẫu nhiên. Gia tăng 50% toàn bộ hiệu số tích cực của thẻ.
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#1C1814] border-t-4 border-x-transparent border-x-4 border-b-0" />
                        </span>
                      </span>
                    )}
                    {isAdvisorRecommended && (
                      <span className="bg-amber-600/10 border border-amber-500/40 text-amber-400 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse shrink-0">
                        ⭐ CỐ VẤN
                      </span>
                    )}
                  </div>
                  <h3 className={`font-serif font-bold text-base tracking-wide ${card.isFoil ? 'foil-title' : 'text-brass-polished'}`}>
                    {card.name}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-leather-brown/20 bg-wood-dark/50 text-paper-aged/60">
                    {card.faction === 'capitalist' ? 'Tư bản' : 'Công nhân'}
                  </span>
                  {/* Tag badges per tag in the card */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end">
                      {card.tags.map(tag => {
                        const tagMeta: Record<string, { label: string; cls: string; Icon: React.FC<{className?: string}> }> = {
                          machinery:    { label: 'Cơ khí',   cls: 'bg-amber-800/40 text-amber-300 border-amber-700/30',   Icon: Settings },
                          exploitation: { label: 'Bóc lột',  cls: 'bg-red-800/40 text-red-300 border-red-700/30',         Icon: Zap },
                          marketing:    { label: 'Thương mại', cls: 'bg-sky-800/40 text-sky-300 border-sky-700/30',       Icon: ShoppingBag },
                          mutualaid:    { label: 'Tương trợ', cls: 'bg-emerald-800/40 text-emerald-300 border-emerald-700/30', Icon: Handshake },
                          militant:     { label: 'Đấu tranh', cls: 'bg-orange-800/40 text-orange-300 border-orange-700/30', Icon: Flame },
                          reformist:    { label: 'Cải cách', cls: 'bg-violet-800/40 text-violet-300 border-violet-700/30', Icon: BookOpen },
                          education:    { label: 'Giáo dục', cls: 'bg-brass-polished/20 text-brass-polished border-brass-polished/30', Icon: BookOpen },
                        };
                        const meta = tagMeta[tag];
                        if (!meta) return null;
                        const { Icon } = meta;
                        return (
                          <span key={tag} className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${meta.cls}`}>
                            <Icon className="w-2.5 h-2.5" />
                            {meta.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs md:text-sm text-paper-aged/85 leading-relaxed font-sans italic">
                    "<TermTooltip text={card.description} />"
                  </p>
                  
                  {/* Strategy Summary Tooltip */}
                  {card.strategySummary && (
                    <div className="bg-[#16120F]/60 border border-leather-brown/10 p-2.5 rounded text-[11px] text-paper-aged/80 font-sans leading-normal">
                      <span className="text-brass-polished/90 font-serif font-bold block mb-0.5">Mục đích chiến lược:</span>
                      <TermTooltip text={card.strategySummary} />
                    </div>
                  )}
                </div>

                {/* Effect list */}
                <div className="mt-4 pt-4 border-t border-leather-brown/10 space-y-1">
                  <h4 className="text-[10px] uppercase tracking-wider font-mono text-paper-aged/40 mb-1.5">
                    Hệ quả dự đoán:
                  </h4>
                  {Object.entries(card.effects).map(([key, val]) => {
                    if (val === 0) return null;
                    return (
                      <div key={key} className="flex justify-between items-center text-xs">
                        <span className="text-paper-aged/60 font-sans">
                          <TermTooltip text={formatEffectLabel(key as keyof TurnState, val)} />
                        </span>
                        <span className={`font-mono font-bold ${getEffectColor(val, key)}`}>
                          {val > 0 ? `+${val}` : val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm Selection Button */}
      {localSelectedId && (
        <div className="flex justify-center mt-6 animate-fade-in">
          <button
            onClick={() => {
              playClickSound();
              selectCard(localSelectedId);
              setHoveredCardId(null);
            }}
            onMouseEnter={playHoverSound}
            className={`px-8 py-3.5 rounded-lg font-serif font-bold uppercase tracking-wider transition-all text-xs cursor-pointer shadow-lg active:scale-95 border border-leather-brown/30 ${theme.confirmButton}`}
          >
            Xác Nhận Chọn Quyết Sách Này
          </button>
        </div>
      )}
    </div>
  );
};
