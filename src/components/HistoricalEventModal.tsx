import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ChevronDown, ChevronUp, History, Info, Vote, CheckCircle2 } from 'lucide-react';
import type { TurnState } from '../types/economy';

export const HistoricalEventModal: React.FC = () => {
  const {
    phase,
    currentEvent,
    submitLobbyBid,
    selectEventChoice,
    academicMode,
    faction,
    currentTurnState
  } = useGameStore();

  const [expanded, setExpanded] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'approve' | 'reject' | null>(null);
  const [bidValue, setBidValue] = useState<number>(0);
  const [lobbyResult, setLobbyResult] = useState<string | null>(null);
  const [winningEffects, setWinningEffects] = useState<any>(null);

  if (phase !== 'event' || !currentEvent) return null;

  // Filter choices for the player's faction
  const factionChoices = currentEvent.choices?.filter(c => c.faction === faction) || [];
  const opponentFaction = faction === 'capitalist' ? 'worker' : 'capitalist';
  const opponentChoices = currentEvent.choices?.filter(c => c.faction === opponentFaction) || [];

  const getEventImage = () => {
    const id = currentEvent.id;
    if (id === 'hist_luddites' || id === 'hist_preston_strike' || id === 'rand_strike' || id === 'rand_riot') {
      return '/assets/images/strike_event_bg.png';
    }
    if (id === 'hist_poor_law' || id === 'hist_panic_1857' || id === 'rand_depression' || id === 'rand_cotton_shortage') {
      return '/assets/images/depression_event_bg.png';
    }
    // Default backgrounds
    if (id === 'rand_boiler_explosion' || id === 'rand_cholera_outbreak') {
      return '/assets/images/woodcut_workers_rebel.png';
    }
    if (id === 'hist_ten_hours_act' || id === 'rand_overseas_order' || id === 'rand_parliament_inspection') {
      return '/assets/images/woodcut_capitalist_mill.png';
    }
    return '/assets/images/woodcut_steam_gauge.png';
  };

  const getEffectColor = (val: number, key: string) => {
    const badKeys = ['conflictRate'];
    const isBadKey = badKeys.includes(key);

    if (val > 0) return isBadKey ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold';
    if (val < 0) return isBadKey ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
    return 'text-paper-aged/50';
  };

  const formatEffectLabel = (key: keyof TurnState, val: number) => {
    const prefix = val > 0 ? `+${val}` : `${val}`;
    if (academicMode) {
      switch (key) {
        case 'constantCapital': return `Δc: ${prefix} £`;
        case 'variableCapital': return `Δv: ${prefix} £`;
        case 'surplusValue': return `Δm: ${prefix} £`;
        case 'capital': return `ΔTích lũy: ${prefix} £`;
        case 'unionFund': return `ΔQuỹ công đoàn: ${prefix} £`;
        case 'workerHealth': return `ΔSức khỏe: ${prefix}%`;
        case 'conflictRate': return `ΔMâu thuẫn: ${prefix}%`;
        case 'classConsciousness': return `ΔÝ thức: ${prefix}%`;
        case 'solidarityNetwork': return `ΔĐoàn kết: ${prefix}%`;
        case 'marketShare': return `ΔThị phần: ${prefix}%`;
        case 'reputation': return `ΔDanh tiếng: ${prefix}%`;
        default: return `Δ${String(key)}: ${prefix}`;
      }
    }

    switch (key) {
      case 'constantCapital': return `Vật tư/Nhà xưởng: ${prefix} £`;
      case 'variableCapital': return `Quỹ lương: ${prefix} £`;
      case 'capital': return `Ngân quỹ Tư bản: ${prefix} £`;
      case 'unionFund': return `Quỹ Công đoàn: ${prefix} £`;
      case 'workerHealth': return `Sức khỏe Công nhân: ${prefix}%`;
      case 'conflictRate': return `Mức độ Mâu thuẫn: ${prefix}%`;
      case 'classConsciousness': return `Ý thức giác ngộ: ${prefix}%`;
      case 'solidarityNetwork': return `Đoàn kết công đoàn: ${prefix}%`;
      case 'marketShare': return `Thị phần: ${prefix}%`;
      case 'reputation': return `Danh tiếng xưởng: ${prefix}%`;
      default: return `${String(key)}: ${prefix}`;
    }
  };

  // Parliamentary lobbying calculation
  const handleLobbySubmit = () => {
    if (!selectedVote) return;

    // AI decisions:
    let aiBid = 0;
    let aiVote: 'approve' | 'reject' = 'approve';

    if (opponentFaction === 'capitalist') {
      aiVote = currentTurnState.reputation < 35 ? 'approve' : 'reject';
      if (currentTurnState.capital > 15000) aiBid = 1000;
      else if (currentTurnState.capital > 7000) aiBid = 500;
      else aiBid = 0;
    } else {
      aiVote = currentTurnState.unionFund < 400 ? 'reject' : 'approve';
      if (currentTurnState.unionFund > 2000) aiBid = 400;
      else if (currentTurnState.unionFund > 800) aiBid = 200;
      else aiBid = 0;
    }

    // Determine lobbying duel winner
    let winningVote: 'approve' | 'reject';
    let winnerLabel = '';

    if (selectedVote === aiVote) {
      winningVote = selectedVote;
      winnerLabel = `Cả hai phe đều đạt sự đồng thuận chung! Dự luật đã được bỏ phiếu ${winningVote === 'approve' ? 'THÔNG QUA' : 'BÁC BỎ'}.`;
    } else {
      const playerStrength = bidValue;
      const aiStrength = aiBid;

      if (playerStrength > aiStrength) {
        winningVote = selectedVote;
        winnerLabel = `Bạn giành chiến thắng trong cuộc bỏ phiếu thỉnh nguyện (Sức ép: ${playerStrength} £ vs ${aiStrength} £)!`;
      } else if (aiStrength > playerStrength) {
        winningVote = aiVote;
        winnerLabel = `Đối thủ giành chiến thắng nhờ tài lực vượt trội (Sức ép: ${aiStrength} £ vs ${playerStrength} £)!`;
      } else {
        const coinFlip = Math.random() > 0.5;
        winningVote = coinFlip ? selectedVote : aiVote;
        winnerLabel = `Cân bằng sức ép lực lượng (${playerStrength} £ vs ${aiStrength} £). Nghị viện quyết định ngẫu nhiên: Dự luật ${winningVote === 'approve' ? 'được THÔNG QUA' : 'bị BÁC BỎ'}.`;
      }
    }

    // Resolve choice effects based on winning faction preference
    const winningChoice = winningVote === 'approve'
      ? (factionChoices[0] || opponentChoices[0])
      : (factionChoices[1] || opponentChoices[1]);

    setWinningEffects(winningChoice.effects);
    setLobbyResult(`
      ${winnerLabel}
      - Bạn chọn: ${selectedVote === 'approve' ? 'ỦNG HỘ' : 'PHẢN ĐỐI'} (Đóng góp ${bidValue} £)
      - Đối thủ chọn: ${aiVote === 'approve' ? 'ỦNG HỘ' : 'PHẢN ĐỐI'} (Đóng góp ${aiBid} £)
      - Kết quả cuối cùng: Dự luật ${winningVote === 'approve' ? 'THÔNG QUA' : 'BÁC BỎ'}!
    `);
  };

  const finalizeLobbyTurn = () => {
    if (!selectedVote || !winningEffects) return;

    // Call store action
    let aiBid = 0;
    let aiVote: 'approve' | 'reject' = 'approve';

    if (opponentFaction === 'capitalist') {
      aiVote = currentTurnState.reputation < 35 ? 'approve' : 'reject';
      if (currentTurnState.capital > 15000) aiBid = 1000;
      else if (currentTurnState.capital > 7000) aiBid = 500;
      else aiBid = 0;
    } else {
      aiVote = currentTurnState.unionFund < 400 ? 'reject' : 'approve';
      if (currentTurnState.unionFund > 2000) aiBid = 400;
      else if (currentTurnState.unionFund > 800) aiBid = 200;
      else aiBid = 0;
    }

    submitLobbyBid(selectedVote, bidValue, aiVote, aiBid, winningEffects);
    
    // Clear local states
    setSelectedVote(null);
    setBidValue(0);
    setLobbyResult(null);
    setWinningEffects(null);
  };

  const bidOptions = faction === 'capitalist' ? [0, 500, 1000] : [0, 200, 400];

  return (
    <div className="fixed inset-0 bg-[#0C0907]/90 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-[#1C1814] woodcut-border p-6 rounded-xl shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto relative">
        
        {/* Header Ribbon */}
        <div className="flex items-center gap-2 border-b border-leather-brown/20 pb-3">
          <History className="w-5 h-5 text-brass-polished" />
          <h2 className="text-lg md:text-xl font-serif text-brass-polished tracking-wide font-bold uppercase">
            {factionChoices.length > 0 ? 'PHÁN QUYẾT NGHỊ VIỆN ANH' : 'Biến Cố Bất Ngờ'} {currentEvent.year ? `(${currentEvent.year})` : ''}
          </h2>
        </div>

        {/* Woodcut Illustration */}
        <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-leather-brown/40 relative shadow-inner bg-[#120F0D]">
          <img
            src={getEventImage()}
            alt={currentEvent.title}
            className="w-full h-full object-cover filter contrast-125 brightness-95 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 font-serif text-base md:text-lg text-paper-aged font-bold text-shadow">
            {currentEvent.title}
          </div>
        </div>

        {/* Event Description */}
        <p className="text-xs md:text-sm text-paper-aged/90 leading-relaxed font-sans italic border-l-2 border-brass-polished/50 pl-3 py-1">
          "{currentEvent.description}"
        </p>

        {/* Lobbying Bidding Interface */}
        {factionChoices.length > 0 ? (
          <div className="space-y-4 pt-2">
            {!lobbyResult ? (
              <>
                <h4 className="text-[10px] uppercase font-mono tracking-wider text-brass-polished flex items-center gap-1.5 mb-2">
                  <Vote className="w-3.5 h-3.5" /> Bàn đàm phán thỉnh nguyện thư Nghị viện:
                </h4>

                {/* Vote direction */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedVote('approve')}
                    className={`p-3.5 rounded-lg border text-center transition-all cursor-pointer ${
                      selectedVote === 'approve'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-md font-bold'
                        : 'border-leather-brown/20 bg-[#251E19]/70 text-paper-aged hover:border-emerald-500/50 hover:bg-[#2B231B]'
                    }`}
                  >
                    <span className="block text-xs font-serif uppercase tracking-wider">Lựa chọn A</span>
                    <span className="text-[10px] block mt-1 opacity-80 text-left font-sans line-clamp-2">
                      {factionChoices[0].text}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedVote('reject')}
                    className={`p-3.5 rounded-lg border text-center transition-all cursor-pointer ${
                      selectedVote === 'reject'
                        ? 'border-red-500 bg-red-950/40 text-red-100 shadow-md font-bold'
                        : 'border-leather-brown/20 bg-[#251E19]/70 text-paper-aged hover:border-red-500/50 hover:bg-[#2B231B]'
                    }`}
                  >
                    <span className="block text-xs font-serif uppercase tracking-wider">Lựa chọn B</span>
                    <span className="text-[10px] block mt-1 opacity-80 text-left font-sans line-clamp-2">
                      {factionChoices[1].text}
                    </span>
                  </button>
                </div>

                {/* Vote power bidding */}
                {selectedVote && (
                  <div className="bg-[#15110F] p-4 rounded-lg border border-leather-brown/10 space-y-3 animate-fade-in">
                    <h4 className="text-[10px] uppercase font-mono text-paper-aged/50">
                      Đóng góp tài lực tăng sức nặng lá phiếu:
                    </h4>
                    
                    <div className="flex gap-2 justify-around">
                      {bidOptions.map(val => (
                        <button
                          key={val}
                          onClick={() => setBidValue(val)}
                          className={`px-4 py-2 rounded font-mono text-xs border transition-all cursor-pointer ${
                            bidValue === val
                              ? 'bg-brass-polished text-wood-dark border-brass-polished font-bold'
                              : 'bg-wood-dark border-leather-brown/30 text-paper-aged hover:border-brass-polished/50'
                          }`}
                        >
                          {val === 0 ? 'Thường (0 £)' : `Lobby (+${val} £)`}
                        </button>
                      ))}
                    </div>

                    <div className="text-[10px] text-paper-aged/40 font-sans italic text-center">
                      * Sức ép lớn hơn đối thủ sẽ quyết định phương án được Nghị viện lựa chọn thông qua.
                    </div>
                  </div>
                )}

                {/* Submit Vote Button */}
                <button
                  disabled={!selectedVote}
                  onClick={handleLobbySubmit}
                  className={`w-full py-3 font-serif uppercase tracking-wider rounded font-bold transition-all text-xs ${
                    selectedVote
                      ? 'bg-brass-polished text-wood-dark hover:brightness-110 shadow-lg active:scale-[0.98]'
                      : 'bg-leather-brown/20 text-paper-aged/30 border border-leather-brown/10 cursor-not-allowed'
                  }`}
                >
                  Nộp Thỉnh Nguyện Thư & Bỏ Phiếu
                </button>
              </>
            ) : (
              // Bidding Results State
              <div className="space-y-4 pt-2 animate-fade-in">
                <div className="bg-[#18231C]/60 border border-emerald-800/40 p-4 rounded-lg space-y-3">
                  <h4 className="text-xs uppercase font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> KẾT QUẢ VẬN ĐỘNG NGHỊ VIỆN
                  </h4>
                  <p className="text-xs text-paper-aged/90 leading-relaxed font-sans whitespace-pre-line text-left">
                    {lobbyResult}
                  </p>
                </div>

                {/* Applied effects */}
                <div className="bg-[#15110F] p-4 rounded-lg border border-leather-brown/10 space-y-2">
                  <h4 className="text-[10px] uppercase font-mono text-paper-aged/40 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Chỉ số thay đổi sau luật mới:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                    {Object.entries(winningEffects as Record<string, number>).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-xs">
                        <span className="text-paper-aged/60 font-sans text-left">
                          {formatEffectLabel(key as keyof TurnState, val as number)}
                        </span>
                        <span className={`font-mono ${getEffectColor(val as number, key)}`}>
                          {val as number > 0 ? `+${val}` : val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={finalizeLobbyTurn}
                  className="w-full py-3 bg-brass-polished text-wood-dark font-serif font-bold uppercase tracking-wider rounded shadow hover:brightness-110 active:scale-[0.98] transition-all text-xs"
                >
                  Bắt đầu lượt tiếp theo
                </button>
              </div>
            )}
          </div>
        ) : (
          /* General static event effects (random events fallback) */
          <div className="space-y-4 pt-2">
            <div className="bg-[#15110F] p-4 rounded-lg border border-leather-brown/10 space-y-2">
              <h4 className="text-[10px] uppercase font-mono tracking-wider text-paper-aged/40 flex items-center gap-1">
                <Info className="w-3 h-3 text-brass-polished" /> Tác động lên các chỉ số:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                {Object.entries(currentEvent.effects).map(([key, val]) => {
                  if (val === 0) return null;
                  return (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <span className="text-paper-aged/60 font-sans text-left">
                        {formatEffectLabel(key as keyof TurnState, val as number)}
                      </span>
                      <span className={`font-mono ${getEffectColor(val as number, key)}`}>
                        {val as number > 0 ? `+${val}` : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => selectEventChoice(currentEvent.effects)}
                className="px-6 py-2 bg-brass-polished text-wood-dark font-serif font-bold uppercase tracking-wider rounded shadow hover:brightness-110 active:scale-95 transition-all text-xs"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Expandable History details */}
        {currentEvent.details && (
          <div className="border-t border-leather-brown/15 pt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex justify-between items-center text-xs font-serif text-leather-brown hover:text-brass-polished transition-colors focus:outline-none"
            >
              <span>Xem chi tiết lịch sử bối cảnh</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            {expanded && (
              <p className="mt-2 text-[11px] md:text-xs text-paper-aged/75 leading-relaxed bg-[#16120E] p-3 rounded border border-leather-brown/10 font-sans text-left animate-slide-down">
                {currentEvent.details}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
