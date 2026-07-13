import React from 'react';
import { useGameStore } from '../store/gameStore';
import { cardPool } from '../data/cardPool';
import { Settings, Link as LinkIcon, Megaphone, Handshake, Flame, Landmark, BookOpen, Zap } from 'lucide-react';

const SYNERGY_THRESHOLDS = [2, 4, 6];

const TAG_DEFINITIONS: Record<string, { label: string; icon: React.ReactNode; colors: string; comboIcon: React.ReactNode }> = {
  // Capitalist
  machinery:    { label: 'Cơ Khí Hóa', icon: <Settings className="w-5 h-5 text-amber-500" />, colors: 'from-amber-700 to-yellow-600',   comboIcon: <Settings className="w-4 h-4" /> },
  exploitation: { label: 'Bóc Lột',    icon: <LinkIcon className="w-5 h-5 text-red-500" />, colors: 'from-red-700 to-rose-600',       comboIcon: <LinkIcon className="w-4 h-4" /> },
  marketing:    { label: 'Thương Mại', icon: <Megaphone className="w-5 h-5 text-purple-500" />, colors: 'from-purple-700 to-indigo-600',  comboIcon: <Megaphone className="w-4 h-4" /> },
  // Worker
  mutualaid:    { label: 'Tương Trợ',  icon: <Handshake className="w-5 h-5 text-emerald-500" />, colors: 'from-emerald-700 to-teal-600',  comboIcon: <Handshake className="w-4 h-4" /> },
  militant:     { label: 'Bạo Động',   icon: <Flame className="w-5 h-5 text-orange-500" />, colors: 'from-orange-700 to-red-600',    comboIcon: <Flame className="w-4 h-4" /> },
  reformist:    { label: 'Cải Cách',   icon: <Landmark className="w-5 h-5 text-blue-500" />, colors: 'from-blue-700 to-cyan-600',     comboIcon: <Landmark className="w-4 h-4" /> },
  // Cross
  education:    { label: 'Giáo Dục',   icon: <BookOpen className="w-5 h-5 text-zinc-400" />, colors: 'from-zinc-400 to-slate-300',    comboIcon: <BookOpen className="w-4 h-4" /> },
};

export const TraitBar: React.FC = () => {
  const { faction, pickedCardIds, getActiveSynergies } = useGameStore();

  if (!faction) return null;

  // Compute tag counts from picked cards
  const counts: Record<string, number> = {};
  pickedCardIds.forEach(id => {
    const card = cardPool.find(c => c.id === id);
    if (card?.tags) {
      card.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    }
  });

  const activeTags = Object.keys(counts)
    .filter(tag => counts[tag] > 0 && TAG_DEFINITIONS[tag])
    .map(tag => ({ tag, count: counts[tag], def: TAG_DEFINITIONS[tag] }))
    .sort((a, b) => b.count - a.count);

  const hasTraits = activeTags.length > 0;
  if (!hasTraits) return null;
  
  const activeSynergies = getActiveSynergies();

  return (
    <div className="hidden lg:flex flex-col gap-2 w-full select-none">
      <div className="text-[10px] uppercase font-mono tracking-widest text-paper-aged/50 mb-1 pl-1">
        Trường Phái &amp; Combo
      </div>

      {activeTags.map(({ tag, count, def }) => {
        let activeTierIndex = -1;
        for (let i = SYNERGY_THRESHOLDS.length - 1; i >= 0; i--) {
          if (count >= SYNERGY_THRESHOLDS[i]) { activeTierIndex = i; break; }
        }
        const nextThreshold = activeTierIndex < 2
          ? SYNERGY_THRESHOLDS[activeTierIndex + 1]
          : SYNERGY_THRESHOLDS[2];
        const isActive = activeTierIndex >= 0;
        
        // Find if there's a synergy active for this tag specifically
        const synergy = activeSynergies.find(syn => syn.tag === tag);

        return (
          <div
            key={tag}
            className={`flex flex-col gap-2 p-1.5 rounded-lg border transition-all ${
              isActive
                ? 'bg-[#1C1814]/90 border-leather-brown/40 shadow-lg'
                : 'bg-black/40 border-transparent opacity-75 grayscale'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Trait Icon */}
              <div className={`relative flex items-center justify-center w-8 h-8 rounded shrink-0 overflow-hidden ${
                isActive ? 'border-[1.5px] border-amber-700/50 shadow-md' : 'border border-zinc-700 opacity-60 grayscale'
              }`}>
                {def.icon}
              </div>

              {/* Trait info */}
              <div className="flex flex-col flex-1">
                <span className={`text-xs font-bold font-serif ${isActive ? 'text-paper-aged' : 'text-paper-aged/60'}`}>
                  {def.label}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-brass-polished' : 'text-paper-aged/50'}`}>
                    {count}
                  </span>
                  <span className="text-[9px] text-paper-aged/40">/ {nextThreshold}</span>
                </div>
              </div>

              {/* Tier dots */}
              <div className="flex gap-0.5 items-end h-full py-1 pr-1">
                {SYNERGY_THRESHOLDS.map((_t, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full ${
                      idx <= activeTierIndex
                        ? `h-3 bg-gradient-to-b ${def.colors}`
                        : 'h-1.5 bg-leather-brown/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Show Combo Name if active */}
            {synergy && (
              <div className="mt-1 pt-1.5 border-t border-leather-brown/15 flex items-start gap-1.5">
                <span className="text-amber-500 shrink-0 mt-0.5">{def.comboIcon}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-serif text-amber-400 leading-tight">
                    {synergy.name}
                  </span>
                  <span className="text-[9px] text-paper-aged/60 font-sans leading-tight mt-0.5">
                    {synergy.desc.replace(/\[COMBO\]\s*/g, '')}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Show Cross-faction / Multi-tag Combos */}
      {activeSynergies.filter(syn => syn.tag.includes('+') || syn.tag === 'education').map(syn => (
         <div
           key={syn.name}
           className="flex items-start gap-2 p-1.5 rounded-lg border bg-[#1C1814]/90 border-amber-500/30 shadow-lg"
         >
           <div className="relative flex items-center justify-center w-8 h-8 rounded shrink-0 overflow-hidden border-[1.5px] border-amber-700/50">
             <Zap className="w-4 h-4 text-amber-400" />
           </div>
           <div className="flex flex-col flex-1">
             <span className="text-[10px] font-bold font-serif text-amber-400 leading-tight">
               {syn.name}
             </span>
             <span className="text-[9px] text-paper-aged/60 font-sans leading-tight mt-0.5">
               {syn.desc.replace(/\[(COMBO|LIÊN PHE)\]\s*/g, '')}
             </span>
           </div>
         </div>
      ))}
    </div>
  );
};
