import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getAdvisorsForFaction } from '../data/advisors';
import type { Advisor } from '../data/advisors';
import { Star, BookOpen, ChevronRight, Info, MessageSquare } from 'lucide-react';
import { AdvisorChatModal } from './AdvisorChatModal';

const tagTranslations: Record<string, string> = {
  machinery: 'Cơ khí',
  exploitation: 'Bóc lột',
  marketing: 'Thương mại',
  mutualaid: 'Tương trợ',
  militant: 'Đấu tranh',
  reformist: 'Cải cách',
  education: 'Giáo dục',
};

// Passive effect summary renderer (translated to VN)
const EffectSummary: React.FC<{ advisor: Advisor }> = ({ advisor }) => {
  const eff = advisor.passiveEffect;
  const items: string[] = [];

  if (eff.maintenanceReduction)    items.push(`Bảo trì máy −${Math.round(eff.maintenanceReduction * 100)}%`);
  if (eff.surplusBonus)            items.push(`Hiệu suất thặng dư +${Math.round(eff.surplusBonus * 100)}%`);
  if (eff.marketSharePerTurn)      items.push(`Thị phần +${eff.marketSharePerTurn}/lượt`);
  if (eff.reputationLossReduction) items.push(`Tổn thất danh tiếng −${Math.round(eff.reputationLossReduction * 100)}%`);
  if (eff.capitalWindfallAmount)   items.push(`+${eff.capitalWindfallAmount}£ mỗi ${eff.capitalWindfallInterval} lượt`);
  if (eff.consciousnessPerTurn)    items.push(`Ý thức +${eff.consciousnessPerTurn}/lượt`);
  if (eff.healthPerTurn)           items.push(`Sức khỏe CN +${eff.healthPerTurn}/lượt`);
  if (eff.solidarityPerTurn)       items.push(`Đoàn kết +${eff.solidarityPerTurn}/lượt (Mâu thuẫn ≥${eff.solidarityConflictThreshold}%)`);
  if (eff.fundContribMultiplier)   items.push(`Thu nhập Quỹ ×${1 + eff.fundContribMultiplier}`);

  const translatedTags = advisor.preferredTags.map(t => tagTranslations[t] || t);

  return (
    <ul className="space-y-1.5 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-200/90 font-mono">
          <Star className="w-3 h-3 mt-0.5 shrink-0 fill-emerald-400 text-emerald-400" />
          <span className="leading-snug">{item}</span>
        </li>
      ))}
      {translatedTags.length > 0 && (
        <li className="flex items-start gap-1.5 text-xs text-amber-200/90 font-mono pt-1">
          <Star className="w-3 h-3 mt-0.5 shrink-0 fill-amber-400 text-amber-400" />
          <span className="leading-snug">Gợi ý thẻ: {translatedTags.join(', ')}</span>
        </li>
      )}
    </ul>
  );
};

export const AdvisorSelectModal: React.FC = () => {
  const { faction, pickAdvisor } = useGameStore();
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Advisor | null>(null);
  const [chatAdvisor, setChatAdvisor] = useState<Advisor | null>(null);

  if (!faction) return null;

  const advisors = getAdvisorsForFaction(faction);
  const isCapitalist = faction === 'capitalist';

  const accentColorClasses: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
    amber:   { border: 'border-amber-500',   bg: 'bg-amber-950/80',   text: 'text-amber-400',   shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
    red:     { border: 'border-red-500',     bg: 'bg-red-950/80',     text: 'text-red-400',     shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' },
    sky:     { border: 'border-sky-500',     bg: 'bg-sky-950/80',     text: 'text-sky-300',     shadow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]' },
    yellow:  { border: 'border-yellow-500',  bg: 'bg-yellow-950/80',  text: 'text-yellow-400',  shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
    emerald: { border: 'border-emerald-500', bg: 'bg-emerald-950/80', text: 'text-emerald-400', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]' },
    orange:  { border: 'border-orange-500',  bg: 'bg-orange-950/80',  text: 'text-orange-400',  shadow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]' },
    blue:    { border: 'border-blue-500',    bg: 'bg-blue-950/80',    text: 'text-blue-400',    shadow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' },
  };

  const themeAccent = isCapitalist ? 'text-brass-polished font-bold' : 'text-slate-100 font-bold';
  const themeBorder = isCapitalist ? 'border-brass-polished/30' : 'border-slate-500/40';

  const cardBgClass = isCapitalist ? 'bg-[#251E19]/90' : 'bg-[#1B2124]/90';
  const cardBorderClass = isCapitalist ? 'border-leather-brown/30' : 'border-stone-800/80';
  const cardGradientClass = isCapitalist 
    ? 'bg-gradient-to-b from-[#251E19]/95 to-[#201914]' 
    : 'bg-gradient-to-b from-[#1B2124]/95 to-[#15191C]';
  const cardGradFrom = isCapitalist ? 'from-[#251E19]' : 'from-[#1B2124]';
  const backBgStyle = isCapitalist 
    ? { backgroundImage: 'radial-gradient(circle at center, #2E231A/90 0%, #1F1712/95 100%)' }
    : { backgroundImage: 'radial-gradient(circle at center, #1E2528/90 0%, #121618/95 100%)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden bg-transparent">
        
        {/* Header */}
        <div className="text-center mb-6 shrink-0 animate-fade-in">
          <div className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${themeBorder} ${themeAccent} bg-black/30`}>
            <BookOpen className="w-3 h-3" />
            {isCapitalist ? 'Phe Nhà Tư Bản' : 'Phe Lãnh Đạo Công Nhân'}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold woodcut-text uppercase tracking-widest drop-shadow-lg mb-2 text-brass-polished">
            Tuyển Chọn Cố Vấn
          </h2>
          <p className="text-sm text-paper-aged/80 font-sans max-w-2xl mx-auto leading-relaxed">
            Nhấp vào biểu tượng <strong><Info className="w-3.5 h-3.5 inline relative -top-0.5" /> Thông Tin</strong> để lật thẻ và xem tiểu sử. Cố vấn sẽ đồng hành cùng bạn suốt trò chơi.
          </p>
        </div>

        {/* 3D Flashcards Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
            {advisors.map((advisor) => {
              const cc = accentColorClasses[advisor.accentColor] ?? accentColorClasses['amber'];
              const isFlipped = flippedId === advisor.id;
              const isSelected = selected?.id === advisor.id;

              return (
                <div 
                  key={advisor.id} 
                  className={`relative w-full h-[420px] transition-all duration-300 transform preserve-3d cursor-pointer ${
                    isSelected ? 'scale-105 z-10' : 'hover:scale-[1.02]'
                  }`}
                  onClick={() => setSelected(advisor)}
                >
                  <div className={`w-full h-full relative transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* ================= FRONT OF CARD ================= */}
                    <div 
                      className={`absolute inset-0 backface-hidden rounded-2xl border overflow-hidden flex flex-col ${cardBgClass} backdrop-blur-md ${
                        isSelected ? `${cc.border} ${cc.shadow} border-2` : `${cardBorderClass} shadow-lg`
                      }`}
                    >
                      {/* Portrait Image */}
                      <div className="h-[65%] w-full relative">
                        <img 
                          src={advisor.imageUrl} 
                          alt={advisor.name} 
                          className="w-full h-full object-cover sepia-[0.1] brightness-90 contrast-125"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${cardGradFrom} via-transparent to-black/35`}></div>
                        
                        {isSelected && (
                          <div className={`absolute top-3 left-3 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${cc.border} ${cc.text} bg-black/80 backdrop-blur-sm z-10`}>
                            ✓ Đã chọn
                          </div>
                        )}

                        <button 
                          className="absolute top-3 right-3 p-2 bg-black/60 rounded-full border border-white/20 hover:bg-white/20 transition backdrop-blur-md z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedId(isFlipped ? null : advisor.id);
                          }}
                        >
                          <Info className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Info Panel Front */}
                      <div className={`flex-1 p-4 flex flex-col justify-start relative z-10 -mt-8 ${cardGradientClass}`}>
                        <div className="text-[10px] font-mono text-paper-aged/50 uppercase tracking-widest mb-1">
                          {advisor.years}
                        </div>
                        <h3 className={`font-serif font-bold text-xl leading-tight mb-1 ${cc.text}`}>
                          {advisor.name}
                        </h3>
                        <div className="text-xs text-paper-aged/80 font-sans italic border-b border-leather-brown/20 pb-2 mb-2">
                          {advisor.title}
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                           <EffectSummary advisor={advisor} />
                        </div>
                      </div>
                    </div>

                    {/* ================= BACK OF CARD ================= */}
                    <div 
                      className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 p-5 flex flex-col overflow-y-auto custom-scrollbar ${cardBgClass} backdrop-blur-md ${
                        isSelected ? `${cc.border} ${cc.shadow}` : `${cardBorderClass} shadow-lg`
                      }`}
                      style={backBgStyle}
                    >
                      <button 
                        className="absolute top-3 right-3 p-2 bg-black/40 rounded-full border border-white/10 hover:bg-white/20 transition z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlippedId(null);
                        }}
                      >
                        <Info className="w-4 h-4 text-white" />
                      </button>
                      
                      <h3 className={`font-serif font-bold text-lg mb-1 ${cc.text}`}>
                        {advisor.name}
                      </h3>
                      <div className="text-[10px] text-paper-aged/50 font-mono uppercase border-b border-leather-brown/20 pb-3 mb-4">
                        Tiểu Sử Lịch Sử
                      </div>

                      <blockquote className="text-xs text-paper-aged/90 italic font-sans border-l-2 border-leather-brown/40 pl-3 leading-relaxed mb-4">
                        "{advisor.quote}"
                      </blockquote>

                      <div className="text-xs text-paper-aged/80 font-sans leading-relaxed text-justify space-y-2 mb-4">
                        {advisor.historicalNote}
                      </div>

                      <div className="mt-auto pt-3 border-t border-leather-brown/15">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatAdvisor(advisor);
                          }}
                          className="w-full py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-brass-polished font-serif text-[11px] rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Phỏng Vấn Thử
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirm button */}
        <div className="shrink-0 p-4 flex justify-center bg-transparent">
          <button
            onClick={() => selected && pickAdvisor(selected)}
            disabled={!selected}
            className={`
              flex items-center gap-2.5 px-12 py-4 rounded-xl font-serif font-bold uppercase tracking-wider text-base transition-all duration-300
              ${selected
                ? isCapitalist
                  ? 'bg-brass-polished text-[#1C1814] hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(212,175,55,0.45)] border border-amber-300/30'
                  : 'bg-slate-200 text-[#1C1814] hover:bg-white active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-slate-300'
                : 'bg-leather-brown/10 text-paper-aged/20 cursor-not-allowed border border-leather-brown/10'
              }
            `}
          >
            {selected ? (
              <>
                <span>Tuyển {selected.name}</span>
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <span>Vui lòng chọn 1 cố vấn</span>
            )}
          </button>
        </div>

        {chatAdvisor && (
          <AdvisorChatModal
            isOpen={true}
            onClose={() => setChatAdvisor(null)}
            advisor={chatAdvisor}
          />
        )}
        
      </div>
    </div>
  );
};
