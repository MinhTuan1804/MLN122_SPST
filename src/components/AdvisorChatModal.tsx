import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Send, HelpCircle, Loader2, MessageSquare } from 'lucide-react';
import type { Advisor } from '../data/advisors';

interface AdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisor: Advisor;
}

export const AdvisorChatModal: React.FC<AdvisorChatModalProps> = ({ isOpen, onClose, advisor }) => {
  const {
    currentTurnState,
    faction,
    phase,
    advisorChatHistory,
    advisorChatTokens,
    askAdvisor
  } = useGameStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const history = advisorChatHistory[advisor.id] || [];

  // Add a welcoming greeting message if history is empty
  useEffect(() => {
    if (history.length === 0 && isOpen) {
      const greeting = advisor.quote 
        ? `${advisor.quote} Rất vui được đồng hành cùng bạn. Hãy hỏi tôi bất kỳ điều gì về chiến thuật kinh tế hoặc bối cảnh lịch sử tại Manchester!`
        : `Chào bạn, tôi là cố vấn ${advisor.name}. Tôi sẽ giúp bạn lèo lái qua thời cuộc hỗn loạn này. Hãy hỏi tôi lời khuyên bất cứ lúc nào!`;
      
      // Simulate advisor typing the greeting
      useGameStore.getState().addSystemMessage(advisor.id, greeting);
    }
  }, [isOpen, advisor, history.length]);

  // Scroll to bottom whenever history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    setInput('');
    try {
      await askAdvisor(advisor.id, textToSend);
    } catch (err: any) {
      // Error message is added automatically by askAdvisor as system message
    } finally {
      setLoading(false);
    }
  };

  const isGameplay = phase !== 'onboarding';
  const hasFreeTokens = advisorChatTokens > 0;
  const cost = faction === 'capitalist' ? '150 £' : '40 £';
  const playerMoney = faction === 'capitalist' ? currentTurnState.capital : currentTurnState.unionFund;
  const rawCost = faction === 'capitalist' ? 150 : 40;
  
  const isAffordable = !isGameplay || hasFreeTokens || playerMoney >= rawCost;

  // Preset questions tailored to advisor personality
  const getPresetQuestions = (): string[] => {
    if (faction === 'capitalist') {
      return [
        `Tôi nên làm gì để tối ưu chỉ số ngay lượt này?`,
        `Làm sao để gia tăng lợi nhuận p' hiệu quả nhất?`,
        `Cách kiềm chế mâu thuẫn xã hội khi áp lực dệt tăng?`
      ];
    } else {
      return [
        `Tôi nên tập trung vào Quỹ công đoàn hay Ý thức giai cấp?`,
        `Làm sao để tổ chức bãi công đòi quyền lợi mà giữ sức khỏe?`,
        `Chiến thuật bám sát thế mạnh của ông là gì?`
      ];
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0C0907]/90 flex items-center justify-center p-4 z-[100] animate-fade-in backdrop-blur-sm select-none">
      <div className="w-full max-w-lg h-[80vh] bg-[#1C1814] woodcut-border rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-leather-brown/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-leather-brown/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-leather-brown/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-leather-brown/40" />

        {/* Header */}
        <div className="p-4 border-b border-leather-brown/20 flex justify-between items-center bg-[#15110E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-leather-brown/30 bg-[#251E19] overflow-hidden">
              <img 
                src={advisor.imageUrl} 
                alt={advisor.name}
                className="w-full h-full object-cover scale-105"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-brass-polished uppercase tracking-wider">{advisor.name}</h3>
              <p className="text-[10px] text-paper-aged/60 font-sans italic">{advisor.title}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-paper-aged/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token / Cost Info bar */}
        {isGameplay && (
          <div className="bg-[#28211B] border-b border-leather-brown/10 px-4 py-2 flex items-center justify-between text-[11px] font-sans text-paper-aged/80">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Lượt hỏi miễn phí: <strong className="text-amber-400">{advisorChatTokens}</strong>
              </span>
            </div>
            <div>
              <span>Chi phí câu hỏi kế tiếp: </span>
              <strong className={hasFreeTokens ? 'text-green-500' : 'text-amber-400'}>
                {hasFreeTokens ? 'MIỄN PHÍ' : cost}
              </strong>
            </div>
          </div>
        )}

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#14100D] custom-scrollbar">
          {history.map((msg) => {
            const isPlayer = msg.sender === 'player';
            const isSystem = msg.sender === 'system';
            
            if (isSystem) {
              return (
                <div key={msg.id} className="p-3 bg-red-950/20 border border-red-500/20 rounded text-[11px] text-red-300 font-mono text-left leading-relaxed">
                  {msg.text}
                </div>
              );
            }

            return (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${isPlayer ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
              >
                {!isPlayer && (
                  <div className="w-7 h-7 rounded border border-leather-brown/30 bg-[#251E19] overflow-hidden shrink-0">
                    <img 
                      src={advisor.imageUrl} 
                      className="w-full h-full object-cover"
                      alt={advisor.name}
                    />
                  </div>
                )}
                <div>
                  <div 
                    className={`p-3 rounded-xl border text-xs md:text-sm font-sans leading-relaxed text-left ${
                      isPlayer 
                        ? 'bg-amber-800/10 border-amber-600/30 text-amber-100 rounded-tr-none' 
                        : 'bg-wood-dark/40 border-leather-brown/20 text-paper-aged/90 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-paper-aged/30 font-mono mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
              <div className="w-7 h-7 rounded border border-leather-brown/30 bg-[#251E19] overflow-hidden shrink-0 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              </div>
              <div className="p-2.5 bg-wood-dark/40 border border-leather-brown/20 rounded-xl rounded-tl-none text-[10px] text-paper-aged/50 font-sans animate-pulse">
                Cố vấn đang phân tích chỉ số và soạn câu trả lời...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Questions Area */}
        <div className="px-4 py-2 border-t border-leather-brown/10 bg-[#15110E] flex flex-wrap gap-2 justify-start select-none">
          {getPresetQuestions().map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading || !isAffordable}
              className="text-[10px] px-2.5 py-1.5 rounded bg-[#221B15] border border-leather-brown/20 text-paper-aged/70 hover:text-brass-polished hover:bg-[#2F251C] transition-all disabled:opacity-50 disabled:pointer-events-none text-left flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3 text-brass-polished/70 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-leather-brown/20 bg-[#1C1814] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(input);
            }}
            disabled={loading || !isAffordable}
            placeholder={
              isAffordable 
                ? `Hỏi cố vấn ${advisor.name}...` 
                : `Không đủ tài nguyên để gửi câu hỏi (${cost})`
            }
            className="flex-1 bg-wood-dark/50 border border-leather-brown/30 rounded-lg px-3 py-2 text-xs md:text-sm text-paper-aged placeholder-paper-aged/30 focus:outline-none focus:border-amber-500/50 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading || !isAffordable}
            className={`px-4 py-2 font-serif font-bold text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isAffordable && input.trim()
                ? 'bg-amber-600/20 border border-amber-500/40 text-amber-500 hover:bg-amber-500/30'
                : 'bg-zinc-800/20 border border-zinc-700/30 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {isGameplay && !hasFreeTokens ? `Gửi (-${cost})` : 'Gửi'}
          </button>
        </div>

      </div>
    </div>
  );
};
