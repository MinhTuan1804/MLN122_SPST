import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { Lightbulb, MessageSquare, Compass } from "lucide-react";
import { AdvisorChatModal } from "./AdvisorChatModal";

/**
 * Premium Advisor Dashboard Widget shown in the side panel.
 * Displays advisor avatar, name, title, quote, card recommendation, and quick AI Chat.
 */
export const AdvisorHintBadge: React.FC<{ recommendedCardName?: string }> = ({
  recommendedCardName,
}) => {
  const { activeAdvisor } = useGameStore();
  const [chatOpen, setChatOpen] = useState(false);

  if (!activeAdvisor) return null;

  return (
    <div className="bg-[#1C1814] woodcut-border p-4 rounded-xl shadow-md border border-leather-brown/10 flex flex-col justify-between relative overflow-hidden text-left">
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-leather-brown/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-leather-brown/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-leather-brown/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-leather-brown/30" />

      <h3 className="font-serif font-bold text-xs uppercase text-brass-polished tracking-wider flex items-center gap-1.5 border-b border-leather-brown/10 pb-2 mb-3">
        <Compass className="w-4 h-4 text-amber-500" /> CỐ VẤN CHIẾN THUẬT
      </h3>

      <div className="flex gap-3 items-start">
        {/* Avatar */}
        <div className="w-12 h-12 rounded border border-leather-brown/30 bg-[#251E19] overflow-hidden shrink-0 shadow-md">
          <img
            src={activeAdvisor.imageUrl}
            alt={activeAdvisor.name}
            className="w-full h-full object-cover scale-105"
          />
        </div>

        {/* Advisor Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-sm text-paper-aged uppercase tracking-wide truncate">
            {activeAdvisor.name}
          </h4>
          <p className="text-[10px] text-paper-aged/60 font-sans italic truncate leading-snug">
            {activeAdvisor.title}
          </p>
          <p className="text-[9px] text-paper-aged/40 font-mono tracking-wider mt-0.5">
            {activeAdvisor.years}
          </p>
        </div>
      </div>

      {/* Quote/Historical preference */}
      <div className="mt-3 bg-black/35 border border-leather-brown/5 rounded p-2.5 space-y-2">
        <p className="text-[11px] italic text-paper-aged/80 leading-relaxed font-serif">
          "{activeAdvisor.quote}"
        </p>

        {activeAdvisor.preferredTags.length > 0 && (() => {
          const tagLabels: Record<string, string> = {
            machinery: 'Cơ khí',
            exploitation: 'Bóc lột',
            marketing: 'Thương mại',
            mutualaid: 'Tương trợ',
            militant: 'Đấu tranh',
            reformist: 'Cải cách',
            education: 'Giáo dục'
          };
          return (
            <div className="text-[10px] font-mono text-amber-300/90 flex flex-wrap items-center gap-1 border-t border-leather-brown/5 pt-2">
              <Lightbulb className="w-3.5 h-3.5 fill-amber-500/20 text-amber-400 shrink-0" />
              <span>
                Ưu tiên:{" "}
                <strong className="capitalize">{activeAdvisor.preferredTags.map(t => tagLabels[t] || t).join(" / ")}</strong>
              </span>
            </div>
          );
        })()}

        {recommendedCardName && (
          <div className="text-[10px] font-sans text-emerald-400/95 flex items-center gap-1.5 mt-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>
              Đề xuất lượt này: <strong>{recommendedCardName}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Call to action */}
      <button
        onClick={() => setChatOpen(true)}
        className="w-full mt-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 text-brass-polished text-[10px] font-bold uppercase tracking-wider rounded border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
      >
        <MessageSquare className="w-3.5 h-3.5" /> Trò Chuyện Với Cố Vấn
      </button>

      {chatOpen && (
        <AdvisorChatModal
          isOpen={true}
          onClose={() => setChatOpen(false)}
          advisor={activeAdvisor}
        />
      )}
    </div>
  );
};
