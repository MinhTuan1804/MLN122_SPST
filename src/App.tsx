import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore';
import { mapToDisplayIndicators } from './data/displayMapping';
import { StatusGauge } from './components/StatusGauge';
import { AcademicModeToggle } from './components/AcademicModeToggle';
import { OnboardingScene } from './components/OnboardingScene';
import { PickPhase } from './components/PickPhase';
import { AutoResolveOverlay } from './components/AutoResolveOverlay';
import { HistoricalEventModal } from './components/HistoricalEventModal';
import { EndingScreen } from './components/EndingScreen';
import { SettingsModal } from './components/SettingsModal';
import { AugmentModal } from './components/AugmentModal';
import { TraitBar } from './components/TraitBar';
import { ConflictScene } from './3d/ConflictScene';
import { ConflictSceneFallback2D } from './components/ConflictSceneFallback2D';
import { VictoryTracker } from './components/VictoryTracker';
import { TimelineBar } from './components/TimelineBar';
import { TurnSummary } from './components/TurnSummary';
import { GameRulesModal } from './components/GameRulesModal';
import { TermTooltip } from './components/TermTooltip';
import { calculateTurnResult } from './logic/economyFormulas';
import { Settings, Users, Coins, Flame, Handshake, Zap, Sparkles, AlertCircle, AlertTriangle, Briefcase, Volume2, VolumeX, ShoppingBag, BookOpen, ChevronRight, Link as LinkIcon, Megaphone, Landmark, MessageSquare } from 'lucide-react';
import { playHoverSound, playClickSound } from './utils/audioEffects';
import { AdvisorChatModal } from './components/AdvisorChatModal';
import { AdvisorHintBadge } from './components/AdvisorHintBadge';

const App: React.FC = () => {
  const {
    faction,
    phase,
    currentTurnState,
    enable3D,
    academicMode,
    selectFaction,
    isStrikeActive,
    getActiveSynergies,
    hoveredCardId,
    playerCards,
    winStreak,
    loseStreak,
    activeAugment,
    activeAdvisor
  } = useGameStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAdvisorChatOpen, setIsAdvisorChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !audioRef.current.muted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted) {
        if (audioRef.current.currentTime < 3) {
          audioRef.current.currentTime = 3;
        }
        audioRef.current.play().catch(err => console.log('Music play blocked:', err));
      } else {
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    // Attempt autoplay immediately
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (phase === 'ending') {
        audioRef.current.pause();
      } else if (!isMuted) {
        if (audioRef.current.currentTime < 3) {
          audioRef.current.currentTime = 3;
        }
        audioRef.current.play().catch((err) => {
          console.log("Autoplay blocked, waiting for user gesture.", err);
        });
      }
    }

    const enableAudio = () => {
      if (audioRef.current && !isMuted && phase !== 'ending') {
        if (audioRef.current.currentTime < 3) {
          audioRef.current.currentTime = 3;
        }
        audioRef.current.play()
          .then(() => console.log("Audio started playing via interaction."))
          .catch((err) => console.log("Play failed on interaction:", err));
      }
    };

    // Listen to multiple gesture events for unblocking
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('mousedown', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });

    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('mousedown', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, [isMuted, phase]);

  // Register global hover and click sound effects
  useEffect(() => {
    let lastHovered: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const interactive = target.closest('button, a, [role="button"], .cursor-pointer, [data-interactive]');
      if (interactive) {
        if (lastHovered !== interactive) {
          lastHovered = interactive as HTMLElement;
          playHoverSound();
        }
      } else {
        lastHovered = null;
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const interactive = target.closest('button, a, [role="button"], .cursor-pointer, [data-interactive]');
      if (interactive) {
        playClickSound();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Map state to 3 status indicators
  const displayIndicators = mapToDisplayIndicators(currentTurnState, faction || 'capitalist');

  // Preview indicators on card hover
  const hoveredCard = hoveredCardId ? playerCards.find(c => c.id === hoveredCardId) : null;
  const previewState = hoveredCard 
    ? calculateTurnResult(
        currentTurnState,
        faction === 'capitalist' ? hoveredCard.effects : {},
        faction === 'worker' ? hoveredCard.effects : {},
        isStrikeActive
      )
    : null;
  const previewIndicators = previewState 
    ? mapToDisplayIndicators(previewState, faction || 'capitalist')
    : null;

  const demandRatio = currentTurnState.socialValue > 0 ? Math.min(1.0, currentTurnState.aggregateDemand / currentTurnState.socialValue) : 1.0;

  const activeSynergies = getActiveSynergies();

  const getFactionColors = () => {
    if (faction === 'capitalist') {
      return {
        accent: 'text-brass-polished border-brass-polished',
        border: 'woodcut-border-brass',
        glow: 'shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]',
        headerText: 'text-brass-polished',
        panelBg: 'bg-[#29221B]/40',
      };
    }
    return {
      accent: 'text-iron-cold border-iron-cold',
      border: 'woodcut-border-iron',
      glow: 'shadow-[inset_0_0_20px_rgba(75,83,88,0.05)]',
      headerText: 'text-iron-cold',
      panelBg: 'bg-[#202528]/40',
    };
  };

  const theme = getFactionColors();

  // 1. Lobby Phase: Faction Selection
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden select-none">
        {/* Cinematic Lobby Video Background */}
        <video
          src="/assets/videos/Lobby%20Background.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/65 z-0" />
        
        {/* Massive Serif Title */}
        <div className="text-center space-y-3 z-10 max-w-2xl mb-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brass-polished tracking-widest leading-tight uppercase drop-shadow-lg">
            Vòng Xoáy<br />Giá Trị Thặng Dư
          </h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-leather-brown to-transparent w-full" />
          <p className="text-xs md:text-sm font-sans tracking-wide text-paper-aged/60 italic uppercase">
            Manchester Textile Mill Simulator • 19th Century
          </p>
        </div>

        {/* Faction Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full z-10 px-2">
          {/* Capitalist Card */}
          <button
            onClick={() => selectFaction('capitalist')}
            className="text-left bg-[#251E19]/80 border-2 border-leather-brown/30 hover:border-brass-polished rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-brass-polished/5 group focus:outline-none"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brass-polished/10 rounded-lg text-brass-polished border border-brass-polished/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-brass-polished group-hover:brightness-110">
                  Nhà Tư Bản
                </h3>
              </div>
              <p className="text-xs md:text-sm text-paper-aged/80 leading-relaxed font-sans">
                Chủ xưởng dệt quyền uy. Mục tiêu của bạn là tối đa hóa tích lũy tư bản thông qua đổi mới máy móc dệt chạy hơi nước, gia tăng thị phần và duy trì chi phí tối ưu.
              </p>
              <div className="text-[11px] text-paper-aged/50 leading-relaxed pt-2 border-t border-leather-brown/10 font-sans">
                <span className="text-brass-polished font-bold">Chỉ số ưu tiên:</span> Tích lũy tài sản (Capital), Cấu tạo hữu cơ máy móc (c/v), Thị phần thương mại.
              </div>
            </div>
            <div className="w-full text-center py-2 bg-brass-polished text-wood-dark font-serif font-bold uppercase tracking-wider text-xs rounded group-hover:brightness-110 transition-all">
              Tiếp Quản Xưởng Dệt
            </div>
          </button>

          {/* Worker Card */}
          <button
            onClick={() => selectFaction('worker')}
            className="text-left bg-[#1B2124]/85 border-2 border-stone-800 hover:border-iron-cold rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-iron-cold/5 group focus:outline-none"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-iron-cold/10 rounded-lg text-iron-cold border border-iron-cold/20">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-iron-cold group-hover:brightness-110">
                  Thủ Lĩnh Công Nhân
                </h3>
              </div>
              <p className="text-xs md:text-sm text-paper-aged/80 leading-relaxed font-sans">
                Người dẫn dắt công đoàn sơ khai. Mục tiêu của bạn là bảo vệ sức khỏe công nhân, nâng cao ý thức đấu tranh đòi tăng lương, giảm giờ làm và xây dựng quỹ tự lực vững mạnh.
              </p>
              <div className="text-[11px] text-paper-aged/50 leading-relaxed pt-2 border-t border-stone-800 font-sans">
                <span className="text-iron-cold font-bold">Chỉ số ưu tiên:</span> Quỹ tương tế Công đoàn (Union Fund), Sức khỏe (Health), Mạng lưới đoàn kết.
              </div>
            </div>
            <div className="w-full text-center py-2 bg-iron-cold text-wood-dark font-serif font-bold uppercase tracking-wider text-xs rounded group-hover:brightness-110 transition-all">
              Lãnh Đạo Nghiệp Đoàn
            </div>
          </button>
        </div>

        {/* Footer Question */}
        <p className="text-xs text-paper-aged/40 italic text-center mt-12 max-w-lg leading-relaxed z-10">
          "Lợi ích kinh tế — động lực phát triển xã hội hay nguồn gốc mâu thuẫn giai cấp sâu sắc?"
        </p>

        {/* Rules Button */}
        <div className="z-10 mt-6 flex justify-center">
          <button
            onClick={() => setIsRulesOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-wood-dark/80 border border-brass-polished/30 text-brass-polished hover:bg-brass-polished/10 hover:border-brass-polished/60 rounded-lg shadow-lg transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-serif font-bold uppercase tracking-wider text-sm">Luật Chơi</span>
          </button>
        </div>

        {/* Game Rules Modal (rendered in lobby) */}
        <GameRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    );
  }

  // 2. Onboarding Phase (Turn 0)
  if (phase === 'onboarding') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <OnboardingScene />
      </div>
    );
  }

  // 3. Ending Phase
  if (phase === 'ending') {
    return <EndingScreen />;
  }

  // 3. Main Dashboard UI (Turn 1+)
  const mPrime = currentTurnState.variableCapital > 0
    ? Math.round((currentTurnState.surplusValue / currentTurnState.variableCapital) * 100)
    : 0;

  const isHighConflict = currentTurnState.conflictRate >= 80;
  const shakeClass = (isStrikeActive || isHighConflict) ? 'shake-gentle' : '';

  return (
    <>
      <div className={`min-h-screen p-3 md:p-6 flex flex-col justify-between select-none relative pb-24 md:pb-32 transition-colors ${isStrikeActive ? 'bg-red-950/20' : ''} ${shakeClass}`}>
      
      {/* HEADER SECTION */}
      <header className="w-full max-w-none px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center bg-wood-dark/95 p-4 rounded-xl border border-paper-aged/20 shadow-lg gap-4 mb-6 sticky top-4 z-50">
        <div className="flex flex-col text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded border border-leather-brown/30 bg-wood-dark/50 text-paper-aged/70">
              Phe: {faction === 'capitalist' ? 'Nhà Tư Bản' : 'Công Nhân'}
            </span>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded border border-leather-brown/30 bg-[#251E19] text-brass-polished">
              Lượt {currentTurnState.turnNumber} / 15
            </span>
            {activeAugment && (
              <span className={`text-xs uppercase font-mono px-2 py-0.5 rounded border ${activeAugment.tier === 'prismatic' ? 'border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-900/20' : activeAugment.tier === 'gold' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-900/20' : 'border-zinc-400/50 text-zinc-300 bg-zinc-800/20'}`} title={activeAugment.description}>
                Học thuyết: {activeAugment.name}
              </span>
            )}
            {(winStreak >= 3 || loseStreak >= 3) && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border ${winStreak >= 3 ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-red-900/30 text-red-400 border-red-500/30'}`}>
                {winStreak >= 3 ? `${winStreak} WIN STREAK` : `${loseStreak} LOSE STREAK`}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold tracking-wider text-paper-aged mt-1">
            VÒNG XOÁY GIÁ TRỊ THẶNG DƯ
          </h2>
        </div>



        {/* Action controls */}
        <div className="flex items-center gap-4">
          <AcademicModeToggle />
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-lg border border-paper-aged/10 bg-wood-dark/60 text-paper-aged/75 hover:text-paper-aged hover:border-paper-aged/30 glass-panel focus:outline-none transition-colors cursor-pointer"
            title="Bật/Tắt Nhạc Nền"
            aria-label="Toggle Music"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`p-2.5 rounded-lg border border-paper-aged/10 bg-wood-dark/60 text-paper-aged/75 hover:text-paper-aged hover:border-paper-aged/30 glass-panel focus:outline-none transition-colors cursor-pointer`}
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ALERTS SECTION */}
      <div className="w-full max-w-none px-4 md:px-8 space-y-4 mb-6">
        {isStrikeActive && (
          <div className="bg-red-950/80 border-2 border-red-600 text-red-100 p-4 rounded-xl flex items-start gap-3 animate-pulse woodcut-border-iron text-left">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-base md:text-lg">ĐÌNH CÔNG TOÀN PHẦN ĐANG DIỄN RA!</h4>
              <p className="text-xs md:text-sm text-red-200/90 font-sans mt-0.5">
                Công nhân dệt bãi công tập thể. Hoạt động sản xuất bị ngưng trệ: Thặng dư tạo ra = 0, máy móc hao mòn cơ khí (-5% máy móc) và khấu trừ quỹ công đoàn tự động hỗ trợ bãi công.
              </p>
            </div>
          </div>
        )}
        
        {!isStrikeActive && demandRatio < 0.95 && faction === 'capitalist' && (
          <div className="bg-yellow-950/80 border-2 border-yellow-600 text-yellow-100 p-4 rounded-xl woodcut-border-brass flex items-start gap-3 text-left">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-sm md:text-base">KHỦNG HOẢNG THỪA / HÀNG HÓA TỒN KHO!</h4>
              <p className="text-xs md:text-sm text-yellow-200/90 font-sans mt-0.5">
                Lương công nhân quá thấp làm suy giảm sức mua thị trường. Xưởng dệt chỉ tiêu thụ được {Math.round(demandRatio * 100)}% hàng dệt ra. Giá trị thặng dư thực tế nhận được bị giảm mạnh!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DASHBOARD CONTENT GRID */}
      <main className="w-full max-w-none px-4 md:px-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        
        {/* Left Column: TraitBar & Gauges & Victory Tracker */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <TraitBar />
          <VictoryTracker />
          
          {/* Tactical Advisor Sidebar Widget */}
          {activeAdvisor && (() => {
            const recommendedCard = playerCards.find(c =>
              c.tags && activeAdvisor.preferredTags.some(tag => c.tags!.includes(tag))
            );
            return (
              <AdvisorHintBadge recommendedCardName={recommendedCard?.name} />
            );
          })()}
          {/* Gauges Container - Arranged horizontally on large screens to save space */}
          <div className="grid grid-cols-3 gap-1 xl:gap-2 w-full">
            <div className="flex-1 origin-top flex justify-center">
              <StatusGauge
                label="Kinh tế"
                value={displayIndicators.economicPower}
                previewValue={previewIndicators?.economicPower}
                type="economic"
                icon={<Coins className="w-4 h-4 text-brass-polished" />}
              />
            </div>
            <div className="flex-1 origin-top flex justify-center">
              <StatusGauge
                label="Áp lực"
                value={displayIndicators.enginePressure}
                previewValue={previewIndicators?.enginePressure}
                type="pressure"
                icon={<Settings className="w-4 h-4 text-fire-rebellion" />}
              />
            </div>
            <div className="flex-1 origin-top flex justify-center">
              <StatusGauge
                label="Xã hội"
                value={displayIndicators.socialDurability}
                previewValue={previewIndicators?.socialDurability}
                type="social"
                icon={<Users className="w-4 h-4 text-emerald-400" />}
              />
            </div>
          </div>

          {/* Active Synergies (TFT-style Traits) - Upgraded with 3-tier system */}
          <div className="bg-[#1C1814] woodcut-border p-4 rounded-xl shadow-md border border-leather-brown/10 flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-xs uppercase text-brass-polished tracking-wider flex items-center gap-1.5 border-b border-leather-brown/10 pb-2 mb-2">
                <Sparkles className="w-4 h-4 text-brass-polished" /> Trường Phái Kích Hoạt ({activeSynergies.length})
              </h3>
              
              {activeSynergies.length === 0 ? (
                <div className="text-[11px] text-paper-aged/40 italic font-sans py-3 text-center space-y-1">
                  <p>Chưa kích hoạt trường phái nào.</p>
                  <p className="text-paper-aged/30">Chọn ≥2 thẻ cùng nhãn để kích hoạt.</p>
                </div>
              ) : (
                <div className="space-y-4 py-1 h-full overflow-y-auto pr-1 custom-scrollbar">
                  {/* NORMAL SYNERGIES */}
                  {activeSynergies.filter(s => !s.tag.includes('+') && s.tag !== 'education').length > 0 && (
                    <div className="space-y-2.5">
                      {activeSynergies.filter(s => !s.tag.includes('+') && s.tag !== 'education').map((syn, idx) => {
                        const getSynergyIcon = (tag: string) => {
                          switch (tag) {
                            case 'machinery': return <Settings className="w-3.5 h-3.5" />;
                            case 'exploitation': return <LinkIcon className="w-3.5 h-3.5" />;
                            case 'marketing': return <Megaphone className="w-3.5 h-3.5" />;
                            case 'mutualaid': return <Handshake className="w-3.5 h-3.5" />;
                            case 'militant': return <Flame className="w-3.5 h-3.5" />;
                            case 'reformist': return <Landmark className="w-3.5 h-3.5" />;
                            case 'education': return <BookOpen className="w-3.5 h-3.5" />;
                            default: return <Zap className="w-3.5 h-3.5" />;
                          }
                        };
                        const synergyIcon = getSynergyIcon(syn.tag);
                    // Color theme by tag
                    const tagColors: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
                      machinery:   { bg: 'bg-amber-900/20',   border: 'border-amber-700/30',   icon: 'text-amber-400',   badge: 'bg-amber-700/50 text-amber-200' },
                      exploitation:{ bg: 'bg-red-900/20',     border: 'border-red-700/30',     icon: 'text-red-400',     badge: 'bg-red-800/50 text-red-200' },
                      marketing:   { bg: 'bg-sky-900/20',     border: 'border-sky-700/30',     icon: 'text-sky-400',     badge: 'bg-sky-800/50 text-sky-200' },
                      mutualaid:   { bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', icon: 'text-emerald-400', badge: 'bg-emerald-800/50 text-emerald-200' },
                      militant:    { bg: 'bg-orange-900/20',  border: 'border-orange-700/30',  icon: 'text-orange-400',  badge: 'bg-orange-800/50 text-orange-200' },
                      reformist:   { bg: 'bg-violet-900/20',  border: 'border-violet-700/30',  icon: 'text-violet-400',  badge: 'bg-violet-800/50 text-violet-200' },
                      education:   { bg: 'bg-brass-polished/10', border: 'border-brass-polished/30', icon: 'text-brass-polished', badge: 'bg-brass-polished/20 text-brass-polished' },
                    };
                    const colors = tagColors[syn.tag] || { bg: 'bg-wood-dark/40', border: 'border-leather-brown/10', icon: 'text-brass-polished', badge: 'bg-[#251E19] text-brass-polished' };
                    // Level badge label + pip color
                    const levelLabels = ['', 'Cấp I', 'Cấp II', 'Cấp III'];
                    const pipActiveColors: Record<string, string> = {
                      machinery: 'bg-amber-400', exploitation: 'bg-red-400', marketing: 'bg-sky-400',
                      mutualaid: 'bg-emerald-400', militant: 'bg-orange-400', reformist: 'bg-violet-400',
                    };
                    const pipColor = pipActiveColors[syn.tag] || 'bg-brass-polished';
                    return (
                      <div key={idx} className={`${colors.bg} border ${colors.border} p-2.5 rounded-lg flex flex-col text-left`}>
                        {/* Header row: icon + name + level badge */}
                        <span className="font-serif text-xs font-bold text-paper-aged flex justify-between items-center">
                          <span className={`flex items-center gap-1.5 ${colors.icon}`}>
                            {synergyIcon}
                            <span className="text-paper-aged">{syn.name}</span>
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${colors.badge}`}>
                            {levelLabels[syn.level] || `Cấp ${syn.level}`}
                          </span>
                        </span>
                        {/* 3 pip progress indicator */}
                        <div className="flex gap-1 mt-1.5">
                          {[1, 2, 3].map(pip => (
                            <div
                              key={pip}
                              className={`h-1 flex-1 rounded-full ${
                                pip <= syn.level ? pipColor : 'bg-paper-aged/10'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Description */}
                        <span className="text-[10px] text-paper-aged/70 font-sans mt-1.5 leading-relaxed">
                          {syn.desc}
                        </span>
                        {/* Next tier hint (if not max) */}
                        {syn.level < 3 && (
                          <span className="text-[9px] text-paper-aged/30 font-sans mt-1 flex items-center gap-0.5">
                            <ChevronRight className="w-2.5 h-2.5" />
                            Cần thêm {syn.level === 1 ? 2 : 2} thẻ [{syn.tag}] → lên Cấp {syn.level + 1}
                          </span>
                        )}
                        {syn.level === 3 && (
                          <span className="text-[9px] text-brass-polished/50 font-sans mt-1">✦ Đã đạt cấp tối đa</span>
                        )}
                      </div>
                    );
                  })}
                    </div>
                  )}

                  {/* COMBO SYNERGIES */}
                  {activeSynergies.filter(s => s.tag.includes('+')).length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-leather-brown/10">
                      <h4 className="text-[10px] font-bold text-brass-polished/80 uppercase mb-1">Hiệu Ứng Kết Hợp</h4>
                      {activeSynergies.filter(s => s.tag.includes('+')).map((syn, idx) => (
                        <div key={`combo-${idx}`} className="bg-wood-dark/60 border border-fire-rebellion/30 p-2.5 rounded-lg flex flex-col text-left">
                          <span className="font-serif text-xs font-bold text-fire-rebellion flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{syn.name}</span>
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fire-rebellion/20 text-fire-rebellion">COMBO</span>
                          </span>
                          <span className="text-[10px] text-paper-aged/80 font-sans mt-1.5 leading-relaxed">
                            {syn.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CROSS-FACTION SYNERGIES */}
                  {activeSynergies.filter(s => s.tag === 'education').length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-leather-brown/10">
                      <h4 className="text-[10px] font-bold text-brass-polished/80 uppercase mb-1">Trường Phái Liên Phe</h4>
                      {activeSynergies.filter(s => s.tag === 'education').map((syn, idx) => (
                        <div key={`cross-${idx}`} className="bg-brass-polished/10 border border-brass-polished/40 p-2.5 rounded-lg flex flex-col text-left">
                          <span className="font-serif text-xs font-bold text-brass-polished flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{syn.name}</span>
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brass-polished/20 text-brass-polished">CROSS</span>
                          </span>
                          <span className="text-[10px] text-paper-aged/80 font-sans mt-1.5 leading-relaxed">
                            {syn.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right Column: ARENA (3D Scene + Floating UI) */}
        <div className="col-span-12 lg:col-span-9 relative rounded-xl border-2 overflow-hidden flex flex-col min-h-[600px] border-paper-aged/20">
          
          {/* Background Layer: 3D/2D Conflict Scene */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {enable3D ? <ConflictScene /> : <ConflictSceneFallback2D />}
          </div>

          {/* Foreground Layer: Interactive Pick Board & UI */}
          <div className="relative z-10 flex flex-col flex-grow p-4 md:p-6 gap-4">
            {/* Timeline at the top of the board */}
            <div className="w-full max-w-5xl mx-auto">
              <TimelineBar />
            </div>

            <div className="w-full flex-grow flex flex-col justify-center text-center">
              <PickPhase />
              {phase === 'resolve' && (
                <div className="py-12 space-y-4 bg-wood-dark/80 rounded-xl glass-panel inline-block px-12 mx-auto">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fire-rebellion" />
                  <p className="font-serif text-base text-paper-aged animate-pulse">
                    Cơ cấu kinh tế đang chuyển dịch nhịp nhàng theo các quyết định...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* STATS FOOTER (Marxist indicators breakdown) */}
      <footer className="w-full max-w-none rounded-xl border border-leather-brown/40 bg-[#16120F]/95 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.9)] grid grid-cols-2 md:grid-cols-6 text-center font-mono sticky bottom-4 z-50 divide-x divide-y md:divide-y-0 divide-leather-brown/20">
        <div className="p-3 md:p-4 flex flex-col justify-center">
          <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
            <TermTooltip text="NĂM LỊCH SỬ" className="text-paper-aged/50" />
          </span>
          <span className="text-sm md:text-base font-bold text-brass-polished drop-shadow-md">{currentTurnState.year}</span>
        </div>
        
        {faction === 'capitalist' ? (
          <>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? 'TÍCH LŨY TƯ BẢN' : 'NGÂN QUỸ TƯ BẢN'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-paper-aged">{currentTurnState.capital.toLocaleString()} £</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? 'TƯ BẢN BẤT BIẾN (c)' : 'MÁY MÓC & VẬT TƯ'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-paper-aged">{currentTurnState.constantCapital.toLocaleString()} £</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? 'TƯ BẢN KHẢ BIẾN (v)' : 'QUỸ LƯƠNG CÔNG NHÂN'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-paper-aged">{currentTurnState.variableCapital.toLocaleString()} £</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? "TỶ SUẤT THẶNG DƯ (m')" : 'MỨC KHAI THÁC'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-fire-rebellion">{mPrime}%</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center bg-emerald-900/10">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? 'GIÁ TRỊ THẶNG DƯ (m)' : 'THẶNG DƯ TẠO RA'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-emerald-400 drop-shadow-md">+{currentTurnState.surplusValue.toLocaleString()} £</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? 'GIÁ TRỊ SỨC LAO ĐỘNG' : 'QUỸ TIÊU DÙNG'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-paper-aged">{currentTurnState.variableCapital.toLocaleString()} £</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text={academicMode ? "TỶ SUẤT BÓC LỘT (m')" : 'ÁP BỨC GIAI CẤP'} className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-fire-rebellion">{mPrime}%</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text="QUỸ CÔNG ĐOÀN" className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-emerald-400">+{currentTurnState.unionFund.toLocaleString()} £</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text="Ý THỨC GIAI CẤP" className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-cyan-400">{currentTurnState.classConsciousness}%</span>
            </div>
            <div className="p-3 md:p-4 flex flex-col justify-center bg-emerald-900/10">
              <span className="text-[9px] md:text-[10px] text-paper-aged/50 mb-1">
                <TermTooltip text="MẠNG LƯỚI ĐOÀN KẾT" className="text-paper-aged/50" />
              </span>
              <span className="text-sm md:text-base font-bold text-brass-polished drop-shadow-md">{currentTurnState.solidarityNetwork}%</span>
            </div>
          </>
        )}
      </footer>
      </div>

      {/* OVERLAYS & MODALS */}
      <AutoResolveOverlay />
      <HistoricalEventModal />
      <TurnSummary />
      <AugmentModal />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onOpenRules={() => setIsRulesOpen(true)} />
      <GameRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      


      {activeAdvisor && (
        <AdvisorChatModal
          isOpen={isAdvisorChatOpen}
          onClose={() => setIsAdvisorChatOpen(false)}
          advisor={activeAdvisor}
        />
      )}
      
      {/* Background Music Loop */}
      <audio
        ref={audioRef}
        src="/assets/audio/music.mp3"
        autoPlay={true}
        muted={isMuted}
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 3;
        }}
        onPlay={(e) => {
          if (e.currentTarget.currentTime < 3) {
            e.currentTarget.currentTime = 3;
          }
        }}
        onEnded={(e) => {
          e.currentTarget.currentTime = 3;
          e.currentTarget.play().catch(() => {});
        }}
      />
    </>
  );
};

export default App;
