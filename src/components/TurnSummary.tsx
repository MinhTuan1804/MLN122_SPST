import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { cardPool } from '../data/cardPool';
import { TermTooltip } from './TermTooltip';
import { getInitialTurnState } from '../logic/economyFormulas';
import { ArrowRight, Layers, TrendingUp, Settings, Link as LinkIcon, Megaphone, Handshake, Flame, Landmark, BookOpen, Zap } from 'lucide-react';
import type { TurnState } from '../types/economy';
import { playHoverSound, playClickSound } from '../utils/audioEffects';

const HISTORICAL_QUOTES = [
  "Lịch sử của tất cả các xã hội từ trước đến nay là lịch sử đấu tranh giai cấp. — Karl Marx",
  "Tư bản sinh ra rỉ máu và nhơ nhớp từ mọi lỗ chân lông. — Karl Marx",
  "Tài sản của giai cấp này được xây dựng trên sự bần cùng của giai cấp khác.",
  "Máy móc không làm giảm giờ làm việc, nó chỉ tối đa hóa khối lượng bóc lột.",
  "Bãi công không chỉ vì bánh mì, mà còn vì nhân phẩm con người.",
  "Chủ xưởng coi công nhân không bằng một cỗ máy, bởi máy móc hỏng thì phải tốn tiền sửa.",
  "Lợi ích kinh tế — động lực phát triển xã hội hay nguồn gốc mâu thuẫn giai cấp sâu sắc?"
];

export const TurnSummary: React.FC = () => {
  const {
    phase,
    faction,
    playerSelectedCardId,
    opponentSelectedCardId,
    turnHistory,
    currentTurnState,
    completeTurnSummary,
    getActiveSynergies,
    academicMode,
  } = useGameStore();

  // Randomize quote per turn
  const randomQuote = useMemo(() => {
    return HISTORICAL_QUOTES[Math.floor(Math.random() * HISTORICAL_QUOTES.length)];
  }, [currentTurnState.turnNumber]);

  if (phase !== 'summary') return null;

  const isCapitalist = faction === 'capitalist';

  // Get selected cards
  const pCard = cardPool.find(c => c.id === playerSelectedCardId);
  const oCard = cardPool.find(c => c.id === opponentSelectedCardId);

  // Get previous state to calculate deltas
  const prevState = turnHistory.length >= 2 
    ? turnHistory[turnHistory.length - 2] 
    : getInitialTurnState();

  const getDelta = (key: keyof TurnState) => {
    return currentTurnState[key] - prevState[key];
  };

  const mPrime = currentTurnState.variableCapital > 0 ? Math.round((currentTurnState.surplusValue / currentTurnState.variableCapital) * 100) : 0;
  const prevMPrime = prevState.variableCapital > 0 ? Math.round((prevState.surplusValue / prevState.variableCapital) * 100) : 0;
  const deltaMPrime = mPrime - prevMPrime;

  const pPrime = (currentTurnState.constantCapital + currentTurnState.variableCapital) > 0 
    ? Math.round((currentTurnState.surplusValue / (currentTurnState.constantCapital + currentTurnState.variableCapital)) * 100) 
    : 0;
  const prevPPrime = (prevState.constantCapital + prevState.variableCapital) > 0 
    ? Math.round((prevState.surplusValue / (prevState.constantCapital + prevState.variableCapital)) * 100) 
    : 0;
  const deltaPPrime = pPrime - prevPPrime;

  const getDeltaClass = (val: number, key: string) => {
    const isBad = (isCapitalist && key === 'conflictRate') || (!isCapitalist && (key === 'conflictRate' || key === 'mPrime'));
    if (val > 0) return isBad ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold';
    if (val < 0) return isBad ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
    return 'text-paper-aged/40';
  };

  const formatDelta = (val: number) => {
    if (val > 0) return `+${val.toLocaleString()}`;
    if (val < 0) return val.toLocaleString();
    return '0';
  };

  const getSynergyIcon = (tag: string) => {
    switch (tag) {
      case 'machinery':
        return <Settings className="w-4 h-4 text-amber-500" />;
      case 'exploitation':
        return <LinkIcon className="w-4 h-4 text-red-500" />;
      case 'marketing':
        return <Megaphone className="w-4 h-4 text-purple-500" />;
      case 'mutualaid':
        return <Handshake className="w-4 h-4 text-emerald-500" />;
      case 'militant':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'reformist':
        return <Landmark className="w-4 h-4 text-blue-500" />;
      case 'education':
        return <BookOpen className="w-4 h-4 text-zinc-400" />;
      default:
        return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  // Indicators list to show in table
  const indicatorItems = isCapitalist
    ? [
        { label: 'Ngân quỹ tích lũy (Capital)', academic: 'ΔTích lũy tư bản', value: currentTurnState.capital, delta: getDelta('capital'), unit: ' £', key: 'capital' },
        { label: 'Máy móc & Thiết bị (c)', academic: 'Δc (Tư bản bất biến)', value: currentTurnState.constantCapital, delta: getDelta('constantCapital'), unit: ' £', key: 'constantCapital' },
        { label: 'Chi phí Quỹ lương (v)', academic: 'Δv (Tư bản khả biến)', value: currentTurnState.variableCapital, delta: getDelta('variableCapital'), unit: ' £', key: 'variableCapital' },
        { label: 'Thị phần sản xuất', academic: 'ΔThị phần', value: currentTurnState.marketShare, delta: getDelta('marketShare'), unit: '%', key: 'marketShare' },
        { label: 'Mức độ mâu thuẫn', academic: 'ΔTỷ lệ xung đột', value: currentTurnState.conflictRate, delta: getDelta('conflictRate'), unit: '%', key: 'conflictRate' },
        { label: 'Danh tiếng xã hội', academic: 'ΔDanh tiếng xưởng', value: currentTurnState.reputation, delta: getDelta('reputation'), unit: '%', key: 'reputation' },
        { label: 'Tỷ suất thặng dư (m\')', academic: 'm\' (Tỷ suất bóc lột)', value: mPrime, delta: deltaMPrime, unit: '%', key: 'mPrime' },
        { label: 'Tỷ suất lợi nhuận (p\')', academic: 'p\' (Tỷ suất lợi nhuận)', value: pPrime, delta: deltaPPrime, unit: '%', key: 'pPrime' },
      ]
    : [
        { label: 'Quỹ đấu tranh công đoàn', academic: 'ΔQuỹ Công đoàn', value: currentTurnState.unionFund, delta: getDelta('unionFund'), unit: ' £', key: 'unionFund' },
        { label: 'Sức khỏe Công nhân', academic: 'ΔSức khỏe (Lao động)', value: currentTurnState.workerHealth, delta: getDelta('workerHealth'), unit: '%', key: 'workerHealth' },
        { label: 'Mức độ mâu thuẫn', academic: 'ΔTỷ lệ xung đột', value: currentTurnState.conflictRate, delta: getDelta('conflictRate'), unit: '%', key: 'conflictRate' },
        { label: 'Ý thức đấu tranh', academic: 'ΔÝ thức công đoàn', value: currentTurnState.classConsciousness, delta: getDelta('classConsciousness'), unit: '%', key: 'classConsciousness' },
        { label: 'Mạng lưới đoàn kết', academic: 'ΔĐoàn kết liên xưởng', value: currentTurnState.solidarityNetwork, delta: getDelta('solidarityNetwork'), unit: '%', key: 'solidarityNetwork' },
        { label: 'Tỷ suất thặng dư (m\')', academic: 'm\' (Tỷ suất bóc lột)', value: mPrime, delta: deltaMPrime, unit: '%', key: 'mPrime' },
      ];

  const activeSynergies = getActiveSynergies();

  const themeColors = isCapitalist
    ? {
        accent: 'text-brass-polished border-brass-polished/20',
        bg: 'bg-brass-polished/10',
        border: 'border-brass-polished',
        button: 'bg-brass-polished text-wood-dark hover:brightness-110'
      }
    : {
        accent: 'text-iron-cold border-iron-cold/20',
        bg: 'bg-iron-cold/10',
        border: 'border-iron-cold',
        button: 'bg-iron-cold text-paper-aged hover:bg-iron-cold/80'
      };

  return (
    <div className="fixed inset-0 bg-[#0C0907]/90 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-[#1C1814] woodcut-border p-6 rounded-xl shadow-2xl space-y-5 max-h-[95vh] overflow-y-auto relative text-left">
        
        {/* Decorative borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-leather-brown/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-leather-brown/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-leather-brown/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-leather-brown/40" />

        {/* Title */}
        <div className="text-center border-b border-leather-brown/10 pb-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-paper-aged/50">Lượt {currentTurnState.turnNumber - 1} Hoàn Tất</span>
          <h2 className="text-xl md:text-2xl font-serif text-brass-polished font-bold tracking-wider">
            TÓM TẮT KẾT QUẢ VẬN HÀNH
          </h2>
        </div>

        {/* Selected Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Player Card */}
          <div className="p-4 rounded-lg bg-wood-dark/40 border border-leather-brown/15 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono text-paper-aged/40 block mb-1">Quyết sách của bạn:</span>
              <h4 className="font-serif font-bold text-base text-brass-polished">{pCard?.name || 'Không rõ'}</h4>
              <p className="text-xs text-paper-aged/70 mt-1.5 italic font-sans leading-relaxed">
                "{pCard?.description || 'N/A'}"
              </p>
            </div>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-leather-brown/20 bg-wood-dark/50 text-paper-aged/50 mt-3 self-start">
              Phe Ta
            </span>
          </div>

          {/* Opponent Card */}
          <div className="p-4 rounded-lg bg-wood-dark/40 border border-leather-brown/15 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono text-paper-aged/40 block mb-1">Hành động của Đối thủ:</span>
              <h4 className="font-serif font-bold text-base text-iron-cold">{oCard?.name || 'Không rõ'}</h4>
              <p className="text-xs text-paper-aged/70 mt-1.5 italic font-sans leading-relaxed">
                "{oCard?.description || 'N/A'}"
              </p>
            </div>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-leather-brown/20 bg-wood-dark/50 text-paper-aged/50 mt-3 self-start">
              Đối thủ (AI)
            </span>
          </div>
        </div>

        {/* Indicators Table */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase font-mono tracking-wider text-brass-polished flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Biến động chỉ số chính:
          </h4>
          <div className="bg-wood-dark/20 border border-leather-brown/10 rounded-lg overflow-visible font-sans">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-wood-dark/50 border-b border-leather-brown/10 text-paper-aged/60 font-serif text-[10px] uppercase tracking-wider rounded-t-lg">
                  <th className="py-2.5 px-4">Chỉ số</th>
                  <th className="py-2.5 px-4 text-right">Trạng thái mới</th>
                  <th className="py-2.5 px-4 text-right">Thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leather-brown/10">
                {indicatorItems.map((item) => (
                  <tr key={item.key} className="hover:bg-wood-dark/10">
                    <td className="py-2 px-4 font-sans text-paper-aged/80">
                      <TermTooltip text={academicMode ? item.academic : item.label} />
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-semibold text-paper-aged">
                      {item.value.toLocaleString()}{item.unit}
                    </td>
                    <td className={`py-2 px-4 text-right font-mono ${getDeltaClass(item.delta, item.key)}`}>
                      {formatDelta(item.delta)}{item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Synergies Activated */}
        {activeSynergies.length > 0 && (
          <div className="mb-6 bg-wood-dark/40 border border-brass-polished/20 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-paper-aged mb-3 font-serif flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brass-polished" /> Trường phái đang hoạt động:
              </h4>
            <div className="grid grid-cols-1 gap-2">
              {activeSynergies.map((syn, idx) => (
                <div key={idx} className="bg-brass-polished/5 border border-brass-polished/20 p-2.5 rounded-lg flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-leather-brown/20 bg-wood-dark/40 flex items-center justify-center shrink-0">
                    {getSynergyIcon(syn.tag)}
                  </div>
                  <div className="text-left">
                    <span className="font-serif text-xs font-bold text-brass-polished">{syn.name}</span>
                    <span className="text-[10px] text-paper-aged/85 block font-sans">{syn.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Quote */}
        <div className="mb-6 text-center italic text-xs md:text-sm text-paper-aged/50 font-serif max-w-sm mx-auto leading-relaxed">
          "{randomQuote}"
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              playClickSound();
              completeTurnSummary();
            }}
            onMouseEnter={playHoverSound}
            className={`w-full py-3 rounded-lg font-serif font-bold uppercase tracking-wider transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 border border-leather-brown/30 ${themeColors.button}`}
          >
            Tiếp Tục Lượt Tiếp Theo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
