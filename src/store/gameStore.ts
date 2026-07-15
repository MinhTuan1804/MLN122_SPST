import { create } from 'zustand';
import type { TurnState, Faction, GamePhase, Card } from '../types/economy';
import { calculateTurnResult, getInitialTurnState } from '../logic/economyFormulas';
import type { SynergyEffects } from '../logic/economyFormulas';
import { getRandomCards, cardPool } from '../data/cardPool';
import { getEventForTurn } from '../data/randomEvents';
import type { GameEvent } from '../data/randomEvents';
import type { Augment } from '../data/augments';
import { getAugmentChoices } from '../data/augments';
import type { Advisor } from '../data/advisors';

export interface ChatMessage {
  id: string;
  sender: 'player' | 'advisor' | 'system';
  text: string;
  timestamp: number;
}

export interface ActiveSynergy {
  name: string;
  tag: string;
  level: number;
  desc: string;
  effects: SynergyEffects;
}

interface GameStore {
  // Core game state
  faction: Faction | null;
  phase: GamePhase;
  turnHistory: TurnState[];
  currentTurnState: TurnState;
  
  // Card Picking Phase
  playerCards: Card[]; // 3 options for the player
  opponentCards: Card[]; // 3 options for the AI
  playerSelectedCardId: string | null;
  opponentSelectedCardId: string | null;
  pickedCardIds: string[]; // List of player picked card IDs
  opponentPickedCardIds: string[]; // List of AI picked card IDs
  hoveredCardId: string | null; // ID of card currently hovered in Pick phase
  
  // Event Phase
  currentEvent: GameEvent | null;
  isHistoricalDetailsExpanded: boolean;
  
  // Turn Resolution Phase
  isResolving: boolean;
  resolveCountdown: number;
  skipSimulation: boolean;
  isStrikeActive: boolean; // Active strike state
  
  // UI & Settings
  enable3D: boolean;
  academicMode: boolean;
  endingType: 'victory_empire' | 'capitalist_doom' | 'labor_triumph' | 'unorganized_rebellion' | 'compromise' | null;

  // Augment System
  activeAugment: Augment | null;       // currently chosen augment for this run
  pendingAugments: Augment[];          // 3 choices being presented
  
  // Streak System
  winStreak: number;                   // consecutive turns with net positive key resource
  loseStreak: number;                  // consecutive turns with net negative key resource
  
  // Reroll System
  rerollsUsed: number;                 // how many times player has rerolled this turn
  rerollsMax: number;                  // max rerolls per turn
  // Level System
  playerLevel: number;                 // current player level (3 to 9)
  playerXp: number;                    // current XP

  // Advisor System
  activeAdvisor: Advisor | null;       // chosen historical advisor for this run
  advisorChatHistory: Record<string, ChatMessage[]>; // History: advisorId -> messages
  advisorChatTokens: number;                        // Remaining free chat tokens
  askAdvisor: (advisorId: string, message: string, geminiKey?: string) => Promise<void>;
  addSystemMessage: (advisorId: string, text: string) => void;

  // AI Personality System
  aiPersonality: 'aggressive' | 'defensive' | 'balanced'; // AI play style this match
  
  // Actions
  selectFaction: (faction: Faction) => void;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  startPickPhase: () => void;
  selectCard: (cardId: string) => void;
  setHoveredCardId: (cardId: string | null) => void;
  completeTurnSummary: () => void;
  tickResolveCountdown: () => void;
  skipResolve: () => void;
  selectEventChoice: (choiceEffects: Partial<Record<keyof TurnState, number>>) => void;
  submitLobbyBid: (voteType: 'approve' | 'reject', bidAmount: number, aiVote: 'approve' | 'reject', aiBid: number, chosenEffects: Partial<Record<keyof TurnState, number>>) => void;
  closeEventModal: () => void;
  toggle3D: () => void;
  toggleAcademicMode: () => void;
  restartGame: () => void;
  triggerEndingTest: (ending: 'victory_empire' | 'labor_triumph' | 'capitalist_doom' | 'unorganized_rebellion') => void;
  // Augment
  pickAugment: (augment: Augment) => void;
  // Advisor
  pickAdvisor: (advisor: Advisor) => void;
  // Reroll
  rerollCards: () => void;
  // Leveling
  buyXp: () => void;
  grantXp: (amount: number) => void;
  
  // Helpers
  getActiveSynergies: (pickedOverride?: string[], opponentOverride?: string[], factionOverride?: Faction | null) => ActiveSynergy[];
}

// AI Personality types
export type AIPersonality = 'aggressive' | 'defensive' | 'balanced';

/**
 * Enhanced AI choice using personality + situational awareness.
 * Personality:
 *  - aggressive: maximize damage to opponent's key resource
 *  - defensive: prioritize protecting own weakest stat
 *  - balanced: mix of both
 */
function getAIChoice(
  aiFaction: Faction,
  options: Card[],
  state: TurnState,
  personality: AIPersonality = 'balanced',
  turnHistory: TurnState[] = []
): string {
  if (options.length === 0) return '';

  // Detect trends from last 3 turns
  const recent = turnHistory.slice(-3);
  const conflictTrend = recent.length >= 2
    ? recent[recent.length - 1].conflictRate - recent[0].conflictRate
    : 0;
  const consciousnessTrend = recent.length >= 2
    ? recent[recent.length - 1].classConsciousness - recent[0].classConsciousness
    : 0;

  let bestIdx = 0;
  let bestScore = -Infinity;

  options.forEach((card, idx) => {
    let score = card.weight;
    const e = card.effects;
    const tags = card.tags || [];

    if (aiFaction === 'capitalist') {
      // === Situational: Conflict management ===
      const conflictDanger = state.conflictRate >= 70;
      const conflictWarning = state.conflictRate >= 55;
      if (conflictDanger && e.conflictRate) {
        // PANIC: triple weight for conflict reduction
        score -= e.conflictRate * (personality === 'defensive' ? 4 : 3);
      } else if (conflictWarning && e.conflictRate) {
        score -= e.conflictRate * 2;
      }

      // === Situational: Capital low ===
      if (state.capital < 3000) {
        if (e.capital) score += e.capital * 0.15;
        if (e.marketShare) score += e.marketShare * 2.5;
      } else {
        if (e.capital) score += e.capital * 0.08;
        if (e.marketShare) score += e.marketShare * 1.5;
      }

      // === Situational: Reputation ===
      if (state.reputation < 35 && e.reputation) score += e.reputation * 2;
      else if (e.reputation) score += e.reputation * 0.8;

      // === Machinery investment ===
      if (e.constantCapital) score += e.constantCapital * 0.04;

      // === Personality modifiers ===
      if (personality === 'aggressive') {
        // Aggressive: prefer exploitation tags to pressure workers
        if (tags.includes('exploitation')) score += 15;
        if (e.workerHealth && e.workerHealth < 0) score += Math.abs(e.workerHealth) * 0.5;
      } else if (personality === 'defensive') {
        // Defensive: prefer reducing conflict and protecting reputation
        if (tags.includes('marketing')) score += 12;
        if (e.conflictRate && e.conflictRate < 0) score += Math.abs(e.conflictRate) * 1.5;
      }

      // === React to player trend: worker consciousness rising ===
      if (consciousnessTrend > 10 && tags.includes('marketing')) score += 10;

    } else {
      // === Worker AI ===

      // Situational: health crisis
      if (state.workerHealth < 35) {
        if (e.workerHealth) score += Math.max(0, e.workerHealth) * 4;
      } else if (state.workerHealth < 55) {
        if (e.workerHealth) score += Math.max(0, e.workerHealth) * 2;
      }

      // Fund management
      if (state.unionFund < 500) {
        if (e.unionFund) score += e.unionFund * 0.4;
      } else {
        if (e.unionFund) score += e.unionFund * 0.15;
      }

      // Solidarity and consciousness
      if (e.solidarityNetwork) score += e.solidarityNetwork * 1.8;
      if (e.classConsciousness) score += e.classConsciousness * 1.6;

      // Strike management
      if (state.conflictRate >= 75 && e.conflictRate) score -= e.conflictRate * 2;

      // Personality modifiers
      if (personality === 'aggressive') {
        // Aggressive worker AI: push conflict and consciousness
        if (tags.includes('militant')) score += 15;
        if (e.conflictRate && e.conflictRate > 0) score += e.conflictRate * 0.8;
      } else if (personality === 'defensive') {
        // Defensive: stabilize health and fund
        if (tags.includes('mutualaid')) score += 12;
        if (tags.includes('reformist')) score += 8;
      }

      // React to player trend: capitalist gaining market share
      if (conflictTrend > 8 && tags.includes('reformist')) score += 10;

      // === NEW: Counter high capitalist market share by targeting conflict ===
      if (state.marketShare > 65 && e.conflictRate && e.conflictRate > 0) score += e.conflictRate * 2.5;
      if (state.marketShare > 75 && tags.includes('militant')) score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });

  return options[bestIdx].id;
}

// Check for game-ending conditions
function checkEndings(state: TurnState): GameStore['endingType'] {
  if (state.workerHealth <= 10 || state.conflictRate >= 95) {
    return 'unorganized_rebellion';
  }
  
  if (state.capital <= 1000) {
    return 'capitalist_doom';
  }
  
  if (state.turnNumber >= 15) {
    if (state.capital >= 28000 && state.workerHealth >= 50 && state.marketShare >= 65) {
      return 'victory_empire';
    }
    if (state.unionFund >= 4000 && state.solidarityNetwork >= 70 && state.classConsciousness >= 75 && state.workerHealth >= 30) {
      return 'labor_triumph';
    }
    if (state.workerHealth < 30) {
      return 'capitalist_doom';
    }
    return 'compromise';
  }

  return null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  faction: null,
  phase: 'lobby',
  turnHistory: [],
  currentTurnState: getInitialTurnState(),
  playerCards: [],
  opponentCards: [],
  playerSelectedCardId: null,
  opponentSelectedCardId: null,
  pickedCardIds: [],
  opponentPickedCardIds: [],
  hoveredCardId: null,
  currentEvent: null,
  isHistoricalDetailsExpanded: false,
  isResolving: false,
  resolveCountdown: 4,
  skipSimulation: false,
  isStrikeActive: false,
  enable3D: true,
  academicMode: false,
  endingType: null,
  activeAugment: null,
  pendingAugments: [],
  winStreak: 0,
  loseStreak: 0,
  rerollsUsed: 0,
  rerollsMax: 2,
  playerLevel: 3,
  playerXp: 0,
  activeAdvisor: null,
  advisorChatHistory: {},
  advisorChatTokens: 3,
  aiPersonality: 'balanced' as AIPersonality,

  selectFaction: (faction) => set({ faction, phase: 'onboarding' }),
  
  startOnboarding: () => set({ phase: 'onboarding' }),
  
  completeOnboarding: () => {
    const { startPickPhase } = get();
    // Assign random AI personality for this match
    const personalities: AIPersonality[] = ['aggressive', 'defensive', 'balanced'];
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    set({
      turnHistory: [getInitialTurnState()],
      currentTurnState: getInitialTurnState(),
      isStrikeActive: false,
      pickedCardIds: [],
      hoveredCardId: null,
      aiPersonality: randomPersonality,
    });
    startPickPhase();
  },

  startPickPhase: () => {
    const { faction, currentTurnState, playerLevel } = get();
    if (!faction) return;

    const opFaction = faction === 'capitalist' ? 'worker' : 'capitalist';
    const pCards = getRandomCards(faction, currentTurnState.turnNumber, playerLevel);
    const oCards = getRandomCards(opFaction, currentTurnState.turnNumber, playerLevel);

    set({
      phase: 'pick',
      playerCards: pCards,
      opponentCards: oCards,
      playerSelectedCardId: null,
      opponentSelectedCardId: null,
      hoveredCardId: null,
      currentEvent: null,
      isHistoricalDetailsExpanded: false,
      isResolving: false,
      resolveCountdown: 4,
      skipSimulation: false,
      rerollsUsed: 0,
    });
  },

  selectCard: (cardId) => {
    const { faction, opponentCards, currentTurnState, aiPersonality, turnHistory } = get();
    if (!faction) return;

    const aiFaction = faction === 'capitalist' ? 'worker' : 'capitalist';
    const aiChoiceId = getAIChoice(aiFaction, opponentCards, currentTurnState, aiPersonality, turnHistory);

    set({
      playerSelectedCardId: cardId,
      opponentSelectedCardId: aiChoiceId,
      phase: 'resolve',
      isResolving: true,
      resolveCountdown: 4,
    });
  },

  setHoveredCardId: (cardId) => set({ hoveredCardId: cardId }),

  completeTurnSummary: () => {
    const { currentTurnState, endingType } = get();
    if (endingType) {
      set({ phase: 'ending' });
      return;
    }

    const nextEvent = getEventForTurn(currentTurnState.turnNumber);
    if (nextEvent) {
      set({
        phase: 'event',
        currentEvent: nextEvent,
      });
      return;
    } 
    
    // Check for Augment Phase (Turns 5, 10, 14)
    const augmentRounds = [5, 10, 14];
    if (augmentRounds.includes(currentTurnState.turnNumber)) {
      const act = currentTurnState.turnNumber === 5 ? 1 : (currentTurnState.turnNumber === 10 ? 2 : 3);
      const faction = get().faction;
      if (faction) {
        const choices = getAugmentChoices(faction, act);
        set({
          phase: 'augment',
          pendingAugments: choices
        });
        return;
      }
    }

    get().startPickPhase();
  },

  pickAdvisor: (advisor) => {
    set({ activeAdvisor: advisor });
    get().completeOnboarding();
  },

  pickAugment: (augment: Augment) => {
    // Apply immediate effects
    const { currentTurnState } = get();
    const eff = augment.effect;
    const newState = { ...currentTurnState };
    if (eff.immediateCapital) newState.capital += eff.immediateCapital;
    if (eff.immediateUnionFund) newState.unionFund += eff.immediateUnionFund;
    if (eff.immediateHealth) newState.workerHealth = Math.min(100, newState.workerHealth + eff.immediateHealth);
    if (eff.immediateMarketShare) newState.marketShare = Math.min(100, newState.marketShare + eff.immediateMarketShare);

    set({ 
      activeAugment: augment,
      pendingAugments: [],
      currentTurnState: newState
    });
    get().startPickPhase();
  },

  rerollCards: () => {
    const state = get();
    if (!state.faction || state.rerollsUsed >= state.rerollsMax) return;
    
    // Deduct cost based on faction
    const costCap = 200;
    const costFund = 150;
    const currentTurn = state.currentTurnState;
    let newState = { ...currentTurn };
    
    // Check if enough funds, and deduct
    if (state.faction === 'capitalist') {
      if (currentTurn.capital < costCap) return;
      newState.capital -= costCap;
    } else {
      if (currentTurn.unionFund < costFund) return;
      newState.unionFund -= costFund;
    }
    
    // Generate new cards for both player and opponent
    const pCards = getRandomCards(state.faction, currentTurn.turnNumber, state.playerLevel);
    const opFaction = state.faction === 'capitalist' ? 'worker' : 'capitalist';
    const oCards = getRandomCards(opFaction, currentTurn.turnNumber, state.playerLevel);
    
    set({
      currentTurnState: newState,
      playerCards: pCards,
      opponentCards: oCards,
      rerollsUsed: state.rerollsUsed + 1
    });
  },

  buyXp: () => {
    const state = get();
    if (state.playerLevel >= 9) return; // Max level

    const isCap = state.faction === 'capitalist';
    const costCapital = 800;
    const costUnion = 80;
    
    // Check and deduct cost
    const current = { ...state.currentTurnState };
    if (isCap) {
      if (current.capital < costCapital) return;
      current.capital -= costCapital;
    } else {
      if (current.unionFund < costUnion) return;
      current.unionFund -= costUnion;
    }
    
    set({ currentTurnState: current });
    get().grantXp(4);
  },

  grantXp: (amount) => set((state) => {
    let newXp = state.playerXp + amount;
    let newLevel = state.playerLevel;
    
    // XP Required to reach NEXT level (index is current level)
    const XP_TABLE = [0, 0, 0, 6, 10, 20, 36, 56, 80, 9999];
    
    while (newLevel < 9 && newXp >= XP_TABLE[newLevel]) {
      newXp -= XP_TABLE[newLevel];
      newLevel += 1;
    }

    return {
      playerXp: newXp,
      playerLevel: newLevel
    };
  }),

  getActiveSynergies: (pickedOverride?: string[], opponentOverride?: string[], factionOverride?: Faction | null) => {
    const state = get();
    const activeFaction = factionOverride || state.faction;
    if (!activeFaction) return [];

    const pCardIds = pickedOverride || state.pickedCardIds;
    const oCardIds = opponentOverride || state.opponentPickedCardIds;

    const pickedCards = pCardIds
      .map(id => cardPool.find(c => c.id === id))
      .filter(Boolean) as Card[];

    const opponentPickedCards = oCardIds
      .map(id => cardPool.find(c => c.id === id))
      .filter(Boolean) as Card[];

    const counts: Record<string, number> = {};
    pickedCards.forEach(c => {
      c.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    const opponentCounts: Record<string, number> = {};
    opponentPickedCards.forEach(c => {
      c.tags?.forEach(tag => {
        opponentCounts[tag] = (opponentCounts[tag] || 0) + 1;
      });
    });

    const active: ActiveSynergy[] = [];

    // ============================================================
    // CAPITALIST SYNERGIES (3 Tags, 3 Tiers each)
    // ============================================================
    if (activeFaction === 'capitalist') {

      // --- TAG: machinery → Machinist / Industrial Baron ---
      const machineryCount = counts['machinery'] || 0;
      if (machineryCount >= 6) {
        active.push({
          name: 'Đế Chế Hơi Nước',
          tag: 'machinery', level: 3,
          desc: 'Bảo trì máy móc -50%. Thặng dư tăng thêm +0.10 do cơ giới hóa tối đa.',
          effects: { machineryMaintenanceDiscount: 0.50, exploitationBonus: 0.10 }
        });
      } else if (machineryCount >= 4) {
        active.push({
          name: 'Guồng Cơ Giới',
          tag: 'machinery', level: 2,
          desc: 'Bảo trì máy móc -35%. Thị phần tự tăng +3 mỗi lượt.',
          effects: { machineryMaintenanceDiscount: 0.35, passiveMarketGrowth: 3 }
        });
      } else if (machineryCount >= 2) {
        active.push({
          name: 'Cơ Khí Hóa (Machinist)',
          tag: 'machinery', level: 1,
          desc: 'Bảo trì máy móc -20%.',
          effects: { machineryMaintenanceDiscount: 0.20 }
        });
      }

      // --- TAG: exploitation → Hardliner / Iron Fist ---
      const exploitCount = counts['exploitation'] || 0;
      if (exploitCount >= 6) {
        active.push({
          name: 'Ách Thống Trị',
          tag: 'exploitation', level: 3,
          desc: 'Tỷ suất thặng dư +50%. Sức khỏe CN -6/lượt. Danh tiếng -4/lượt.',
          effects: { exploitationBonus: 0.50, healthPenalty: 6, reputationPenalty: 4 }
        });
      } else if (exploitCount >= 4) {
        active.push({
          name: 'Bàn Tay Sắt',
          tag: 'exploitation', level: 2,
          desc: 'Tỷ suất thặng dư +30%. Sức khỏe CN -4/lượt. Danh tiếng -2/lượt.',
          effects: { exploitationBonus: 0.30, healthPenalty: 4, reputationPenalty: 2 }
        });
      } else if (exploitCount >= 2) {
        active.push({
          name: 'Khai Thác Triệt Để (Hardliner)',
          tag: 'exploitation', level: 1,
          desc: 'Tỷ suất thặng dư +15%. Sức khỏe CN -2/lượt.',
          effects: { exploitationBonus: 0.15, healthPenalty: 2 }
        });
      }

      // --- TAG: marketing → Commerce King ---
      const marketCount = counts['marketing'] || 0;
      if (marketCount >= 6) {
        active.push({
          name: 'Đế Chế Thương Mại',
          tag: 'marketing', level: 3,
          desc: 'Thị phần tự tăng +12/lượt. Mâu thuẫn giảm -3/lượt tự động.',
          effects: { passiveMarketGrowth: 12, passiveConflictDecay: 3 }
        });
      } else if (marketCount >= 4) {
        active.push({
          name: 'Vua Thương Trường',
          tag: 'marketing', level: 2,
          desc: 'Thị phần tự tăng +8/lượt.',
          effects: { passiveMarketGrowth: 8 }
        });
      } else if (marketCount >= 2) {
        active.push({
          name: 'Thương Hiệu Mạnh (Commerce King)',
          tag: 'marketing', level: 1,
          desc: 'Thị phần tự tăng +5/lượt.',
          effects: { passiveMarketGrowth: 5 }
        });
      }

      // === CAPITALIST COMBOS ===
      if (machineryCount >= 2 && exploitCount >= 2) {
        active.push({
          name: 'Nhà Máy Đen',
          tag: 'machinery+exploitation', level: 1,
          desc: '[COMBO] Thặng dư +20%, nhưng Sức khỏe CN -3/lượt và Mâu thuẫn +2/lượt.',
          effects: { exploitationBonus: 0.20, healthPenalty: 3, comboConflictGrowth: 2 }
        });
      }
      if (machineryCount >= 2 && marketCount >= 2) {
        active.push({
          name: 'Nhà Máy Hiện Đại',
          tag: 'machinery+marketing', level: 1,
          desc: '[COMBO] Bảo trì -15%, Thị phần tự tăng +4/lượt.',
          effects: { machineryMaintenanceDiscount: 0.15, passiveMarketGrowth: 4 }
        });
      }
      if (exploitCount >= 2 && marketCount >= 2) {
        active.push({
          name: 'Mặt Nạ Nhân Từ',
          tag: 'exploitation+marketing', level: 1,
          desc: '[COMBO] Danh tiếng tự phục hồi +2/lượt để che đậy bóc lột.',
          effects: { passiveReputationRegen: 2 }
        });
      }

    // ============================================================
    // WORKER SYNERGIES (3 Tags, 3 Tiers each)
    // ============================================================
    } else {

      // --- TAG: mutualaid → Mutualist / Brotherhood ---
      const mutualCount = counts['mutualaid'] || 0;
      if (mutualCount >= 6) {
        active.push({
          name: 'Huynh Đệ Thép (Brotherhood of Steel)',
          tag: 'mutualaid', level: 3,
          desc: 'Sức khỏe hồi +10/lượt. Quỹ công đoàn tích lũy +20%. Đoàn kết +2/lượt.',
          effects: { passiveHealthRegen: 10, passiveFundBonus: 0.20, passiveSolidarityRegen: 2 }
        });
      } else if (mutualCount >= 4) {
        active.push({
          name: 'Mạng Lưới Tương Trợ (Solidarity Net)',
          tag: 'mutualaid', level: 2,
          desc: 'Sức khỏe hồi +6/lượt. Quỹ công đoàn tích lũy +10%.',
          effects: { passiveHealthRegen: 6, passiveFundBonus: 0.10 }
        });
      } else if (mutualCount >= 2) {
        active.push({
          name: 'Đoàn Kết Tương Trợ (Mutualist)',
          tag: 'mutualaid', level: 1,
          desc: 'Sức khỏe công nhân tự hồi phục +3/lượt.',
          effects: { passiveHealthRegen: 3 }
        });
      }

      // --- TAG: militant → Militant / Vanguard ---
      const militantCount = counts['militant'] || 0;
      if (militantCount >= 6) {
        active.push({
          name: 'Làn Sóng Đỏ',
          tag: 'militant', level: 3,
          desc: 'Khi bãi công, mâu thuẫn xả -22%. Mâu thuẫn tự giảm -3/lượt. Máy móc hao mòn thêm 10% khi bãi công.',
          effects: { strikeVentingBonus: 10, passiveConflictDecayWorker: 3, strikeDepreciationPenalty: 0.10 }
        });
      } else if (militantCount >= 4) {
        active.push({
          name: 'Tinh Thần Đấu Tranh',
          tag: 'militant', level: 2,
          desc: 'Khi bãi công, mâu thuẫn xả -18%. Mâu thuẫn tự giảm -2/lượt. Máy móc hao mòn +8% khi bãi công.',
          effects: { strikeVentingBonus: 6, passiveConflictDecayWorker: 2, strikeDepreciationPenalty: 0.08 }
        });
      } else if (militantCount >= 2) {
        active.push({
          name: 'Đấu Tranh Vũ Trang (Militant)',
          tag: 'militant', level: 1,
          desc: 'Khi bãi công, mâu thuẫn xả -15%. Máy móc hao mòn +5% khi bãi công.',
          effects: { strikeVentingBonus: 3, strikeDepreciationPenalty: 0.05 }
        });
      }

      // --- TAG: reformist → Democratic Unionist ---
      const reformCount = counts['reformist'] || 0;
      if (reformCount >= 6) {
        active.push({
          name: 'Con Đường Nghị Viện',
          tag: 'reformist', level: 3,
          desc: 'Ý thức giai cấp +8/lượt. Quỹ công đoàn tích lũy +25%. Chi phí mâu thuẫn giảm 30%.',
          effects: { passiveConsciousnessRegen: 8, passiveFundBonus: 0.25, conflictDrainReduction: 0.30 }
        });
      } else if (reformCount >= 4) {
        active.push({
          name: 'Nghiệp Đoàn Dân Chủ',
          tag: 'reformist', level: 2,
          desc: 'Ý thức giai cấp +5/lượt. Quỹ công đoàn tích lũy +15%. Chi phí mâu thuẫn giảm 15%.',
          effects: { passiveConsciousnessRegen: 5, passiveFundBonus: 0.15, conflictDrainReduction: 0.15 }
        });
      } else if (reformCount >= 2) {
        active.push({
          name: 'Nghiệp Đoàn Cải Cách (Reformist)',
          tag: 'reformist', level: 1,
          desc: 'Ý thức giai cấp tự tăng +3/lượt.',
          effects: { passiveConsciousnessRegen: 3 }
        });
      }

      // === WORKER COMBOS ===
      if (mutualCount >= 2 && militantCount >= 2) {
        active.push({
          name: 'Đoàn Quân Đỏ',
          tag: 'mutualaid+militant', level: 1,
          desc: '[COMBO] Khi bãi công, Sức khỏe CN không bị giảm.',
          effects: { strikeHealthShield: true }
        });
      }
      if (mutualCount >= 2 && reformCount >= 2) {
        active.push({
          name: 'Phong Trào Xã Hội',
          tag: 'mutualaid+reformist', level: 1,
          desc: '[COMBO] Quỹ tích lũy thêm +15%, Ý thức tự tăng +2/lượt.',
          effects: { passiveFundBonus: 0.15, passiveConsciousnessRegen: 2 }
        });
      }
      if (militantCount >= 2 && reformCount >= 2) {
        active.push({
          name: 'Mũi Nhọn Kép',
          tag: 'militant+reformist', level: 1,
          desc: '[COMBO] Xả mâu thuẫn thêm -5% khi đình công, Ý thức tự tăng +3/lượt.',
          effects: { strikeVentingBonus: 5, passiveConsciousnessRegen: 3 }
        });
      }
    }

    // ============================================================
    // CROSS-FACTION SYNERGY
    // ============================================================
    const totalEducation = (counts['education'] || 0) + (opponentCounts['education'] || 0);
    if (totalEducation >= 2) {
      active.push({
        name: 'Khai Sáng Xã Hội',
        tag: 'education', level: 1,
        desc: `[LIÊN PHE] Ý thức giai cấp tự tăng +4/lượt. ${activeFaction === 'capitalist' ? 'Danh tiếng chủ +2/lượt.' : 'Đoàn kết công nhân +2/lượt.'}`,
        effects: { 
          passiveConsciousnessRegenCross: 4, 
          passiveReputationRegenCross: activeFaction === 'capitalist' ? 2 : 0,
          passiveSolidarityRegenCross: activeFaction === 'worker' ? 2 : 0
        }
      });
    }

    return active;
  },


  tickResolveCountdown: () => {
    const { resolveCountdown, skipSimulation } = get();
    if (resolveCountdown <= 1 || skipSimulation) {
      const {
        faction,
        playerSelectedCardId,
        opponentSelectedCardId,
        playerCards,
        opponentCards,
        currentTurnState,
        turnHistory,
        isStrikeActive,
        pickedCardIds,
        opponentPickedCardIds,
        getActiveSynergies
      } = get();

      if (!playerSelectedCardId || !opponentSelectedCardId) return;

      const pCard = playerCards.find(c => c.id === playerSelectedCardId);
      const oCard = opponentCards.find(c => c.id === opponentSelectedCardId);

      const pEffects = pCard?.effects || {};
      const oEffects = oCard?.effects || {};

      const capEffects = faction === 'capitalist' ? pEffects : oEffects;
      const wrkEffects = faction === 'worker' ? pEffects : oEffects;

      // Track player picked card
      const updatedPickedCardIds = [...pickedCardIds, playerSelectedCardId];
      const updatedOpponentPickedCardIds = [...opponentPickedCardIds, opponentSelectedCardId];

      // Calculate synergy effects
      const activeSynergies = getActiveSynergies(updatedPickedCardIds, updatedOpponentPickedCardIds, faction);
      const synergyEffects: SynergyEffects = {};
      activeSynergies.forEach(syn => {
        Object.assign(synergyEffects, syn.effects);
      });

      // Augment and Streak
      const { activeAugment, winStreak, loseStreak, activeAdvisor } = get();
      const augmentEffect = activeAugment?.effect;
      const advisorEffect = activeAdvisor?.passiveEffect;
      const streakBonus = {
        capitalBonus: winStreak >= 3 ? 150 : (loseStreak >= 3 ? 100 : 0),
        fundBonus: winStreak >= 3 ? 100 : (loseStreak >= 3 ? 80 : 0),
      };

      const nextTurnState = calculateTurnResult(currentTurnState, capEffects, wrkEffects, isStrikeActive, synergyEffects, augmentEffect, streakBonus, advisorEffect);

      const ending = checkEndings(nextTurnState);

      // Update streaks
      let nextWinStreak = winStreak;
      let nextLoseStreak = loseStreak;
      if (faction === 'capitalist') {
        if (nextTurnState.capital > currentTurnState.capital) {
          nextWinStreak++; nextLoseStreak = 0;
        } else {
          nextLoseStreak++; nextWinStreak = 0;
        }
      } else {
        if (nextTurnState.unionFund > currentTurnState.unionFund) {
          nextWinStreak++; nextLoseStreak = 0;
        } else {
          nextLoseStreak++; nextWinStreak = 0;
        }
      }

      const nextStrikeActive = nextTurnState.conflictRate >= 75;
      set({
        currentTurnState: nextTurnState,
        turnHistory: [...turnHistory, nextTurnState],
        pickedCardIds: updatedPickedCardIds,
        opponentPickedCardIds: updatedOpponentPickedCardIds,
        isStrikeActive: nextStrikeActive,
        isResolving: false,
        endingType: ending || null,
        phase: 'summary',
        winStreak: nextWinStreak,
        loseStreak: nextLoseStreak,
      });
      // Grant passive XP at the end of resolution
      get().grantXp(2);
    } else {
      set({ resolveCountdown: resolveCountdown - 1 });
    }
  },

  skipResolve: () => {
    set({ skipSimulation: true });
    get().tickResolveCountdown();
  },

  selectEventChoice: (choiceEffects) => {
    const { currentTurnState, turnHistory, isStrikeActive, getActiveSynergies, pickedCardIds, opponentPickedCardIds, faction } = get();

    const activeSynergies = getActiveSynergies(pickedCardIds, opponentPickedCardIds, faction);
    const synergyEffects: SynergyEffects = {};
    activeSynergies.forEach(syn => {
      Object.assign(synergyEffects, syn.effects);
    });

    const { activeAugment, activeAdvisor } = get();
    const augmentEffect = activeAugment?.effect;
    const advisorEffect = activeAdvisor?.passiveEffect;

    const finalStateAfterEvent = calculateTurnResult(currentTurnState, choiceEffects, {}, isStrikeActive, synergyEffects, augmentEffect, undefined, advisorEffect);
    const ending = checkEndings(finalStateAfterEvent);

    const updatedHistory = [...turnHistory];
    if (updatedHistory.length > 0) {
      updatedHistory[updatedHistory.length - 1] = finalStateAfterEvent;
    } else {
      updatedHistory.push(finalStateAfterEvent);
    }

    if (ending) {
      set({
        currentTurnState: finalStateAfterEvent,
        turnHistory: updatedHistory,
        phase: 'ending',
        endingType: ending,
        currentEvent: null,
      });
    } else {
      const nextStrikeActive = finalStateAfterEvent.conflictRate >= 75;
      set({
        currentTurnState: finalStateAfterEvent,
        turnHistory: updatedHistory,
        isStrikeActive: nextStrikeActive,
        currentEvent: null,
      });
      get().startPickPhase();
    }
  },

  submitLobbyBid: (_voteType, bidAmount, _aiVote, aiBid, chosenEffects) => {
    const { currentTurnState, turnHistory, faction, getActiveSynergies, pickedCardIds, opponentPickedCardIds } = get();
    if (!faction) return;

    // 1. Deduct resources from respective sides based on vote bid
    const nextTurnStateWithBids = { ...currentTurnState };
    if (faction === 'capitalist') {
      nextTurnStateWithBids.capital = Math.max(0, nextTurnStateWithBids.capital - bidAmount);
    } else {
      nextTurnStateWithBids.unionFund = Math.max(0, nextTurnStateWithBids.unionFund - bidAmount);
    }

    const aiFaction = faction === 'capitalist' ? 'worker' : 'capitalist';
    if (aiFaction === 'capitalist') {
      nextTurnStateWithBids.capital = Math.max(0, nextTurnStateWithBids.capital - aiBid);
    } else {
      nextTurnStateWithBids.unionFund = Math.max(0, nextTurnStateWithBids.unionFund - aiBid);
    }

    const activeSynergies = getActiveSynergies(pickedCardIds, opponentPickedCardIds, faction);
    const synergyEffects: SynergyEffects = {};
    activeSynergies.forEach(syn => {
      Object.assign(synergyEffects, syn.effects);
    });

    const { activeAugment, activeAdvisor } = get();
    const augmentEffect = activeAugment?.effect;
    const advisorEffect = activeAdvisor?.passiveEffect;

    let finalStateAfterEvent = nextTurnStateWithBids;
    const isStrikeActive = get().isStrikeActive;
    if (_voteType === _aiVote) {
      // Both agreed
      if (_voteType === 'approve') {
        finalStateAfterEvent = calculateTurnResult(nextTurnStateWithBids, chosenEffects, {}, isStrikeActive, synergyEffects, augmentEffect, undefined, advisorEffect);
      }
    } else {
      // Conflict
      if (bidAmount >= aiBid && _voteType === 'approve') {
        finalStateAfterEvent = calculateTurnResult(nextTurnStateWithBids, chosenEffects, {}, isStrikeActive, synergyEffects, augmentEffect, undefined, advisorEffect);
      } else if (aiBid > bidAmount && _aiVote === 'approve') {
        finalStateAfterEvent = calculateTurnResult(nextTurnStateWithBids, chosenEffects, {}, isStrikeActive, synergyEffects, augmentEffect, undefined, advisorEffect);
      }
    }

    // Apply passive effects for this turn even if event rejected
    if (finalStateAfterEvent === nextTurnStateWithBids) {
      finalStateAfterEvent = calculateTurnResult(nextTurnStateWithBids, {}, {}, isStrikeActive, synergyEffects, augmentEffect, undefined, advisorEffect);
    }

    const ending = checkEndings(finalStateAfterEvent);

    const updatedHistory = [...turnHistory];
    if (updatedHistory.length > 0) {
      updatedHistory[updatedHistory.length - 1] = finalStateAfterEvent;
    } else {
      updatedHistory.push(finalStateAfterEvent);
    }

    if (ending) {
      set({
        currentTurnState: finalStateAfterEvent,
        turnHistory: updatedHistory,
        phase: 'ending',
        endingType: ending,
        currentEvent: null,
      });
    } else {
      const nextStrikeActive = finalStateAfterEvent.conflictRate >= 75;
      set({
        currentTurnState: finalStateAfterEvent,
        turnHistory: updatedHistory,
        isStrikeActive: nextStrikeActive,
        currentEvent: null,
      });
      get().startPickPhase();
    }
  },

  closeEventModal: () => {
    const { phase } = get();
    if (phase === 'event') {
      get().startPickPhase();
    }
  },

  toggle3D: () => set((state) => ({ enable3D: !state.enable3D })),
  
  toggleAcademicMode: () => set((state) => ({ academicMode: !state.academicMode })),

  restartGame: () => {
    set({
      faction: null,
      phase: 'lobby',
      turnHistory: [],
      currentTurnState: getInitialTurnState(),
      playerCards: [],
      opponentCards: [],
      playerSelectedCardId: null,
      opponentSelectedCardId: null,
      pickedCardIds: [],
      opponentPickedCardIds: [],
      hoveredCardId: null,
      currentEvent: null,
      isHistoricalDetailsExpanded: false,
      isResolving: false,
      resolveCountdown: 4,
      skipSimulation: false,
      isStrikeActive: false,
      endingType: null,
      activeAdvisor: null,
      advisorChatHistory: {},
      advisorChatTokens: 3,
      aiPersonality: 'balanced',
    });
  },

  triggerEndingTest: (ending) => {
    set({
      phase: 'ending',
      endingType: ending,
    });
  },

  addSystemMessage: (advisorId, text) => {
    const history = get().advisorChatHistory[advisorId] || [];
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'system',
      text,
      timestamp: Date.now(),
    };
    set({
      advisorChatHistory: {
        ...get().advisorChatHistory,
        [advisorId]: [...history, newMsg]
      }
    });
  },

  askAdvisor: async (advisorId, message, geminiKey) => {
    const state = get();
    const history = state.advisorChatHistory[advisorId] || [];
    
    // 1. Check cost if inside gameplay (not onboarding advisor select)
    const isGameplay = state.phase !== 'onboarding';
    let costType: 'capital' | 'unionFund' | null = null;
    let costAmount = 0;

    if (isGameplay) {
      if (state.advisorChatTokens > 0) {
        set({ advisorChatTokens: state.advisorChatTokens - 1 });
      } else {
        if (state.faction === 'capitalist') {
          costType = 'capital';
          costAmount = 150;
          if (state.currentTurnState.capital < costAmount) {
            throw new Error("Không đủ Vốn để chi trả phí tư vấn (Yêu cầu 150 £).");
          }
        } else {
          costType = 'unionFund';
          costAmount = 40;
          if (state.currentTurnState.unionFund < costAmount) {
            throw new Error("Không đủ Quỹ Công Đoàn để chi trả hội phí tư vấn (Yêu cầu 40 £).");
          }
        }
      }
    }

    const playerMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'player',
      text: message,
      timestamp: Date.now(),
    };
    const updatedHistory = [...history, playerMsg];
    
    // Deduct resources
    if (costType && costAmount > 0) {
      const turnState = { ...state.currentTurnState };
      if (costType === 'capital') {
        turnState.capital -= costAmount;
      } else {
        turnState.unionFund -= costAmount;
      }
      set({
        currentTurnState: turnState,
        advisorChatHistory: {
          ...state.advisorChatHistory,
          [advisorId]: updatedHistory
        }
      });
    } else {
      set({
        advisorChatHistory: {
          ...state.advisorChatHistory,
          [advisorId]: updatedHistory
        }
      });
    }

    // Call Gemini 2.5 Flash API
    const activeKey = geminiKey || import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
    
    const { getAdvisorsForFaction } = await import('../data/advisors');
    const allAdvisors = [...getAdvisorsForFaction('capitalist'), ...getAdvisorsForFaction('worker')];
    const advisor = allAdvisors.find(a => a.id === advisorId);
    
    if (!advisor) return;

    const factionLabel = state.faction === 'capitalist' ? 'Nhà Tư Bản' : 'Công Nhân';
    const systemPrompt = `Bạn là cố vấn lịch sử ${advisor.name} (${advisor.title}), thời đại Cách mạng Công nghiệp thế kỷ 19 ở Manchester.
    Hãy nói chuyện và trả lời hoàn toàn bằng tiếng Việt với vai trò là nhân vật này.
    Giọng điệu hội thoại (Style): ${advisor.quote ? `"${advisor.quote}"` : ''}.
    ${advisor.historicalNote ? `Lịch sử về bạn: ${advisor.historicalNote}` : ''}
    
    Thông tin game hiện tại:
    - Phe người chơi: ${factionLabel}
    - Năm lịch sử: ${state.currentTurnState.year}
    - Chỉ số: 
      + Vốn chủ xưởng: ${state.currentTurnState.capital} £
      + Quỹ Công đoàn: ${state.currentTurnState.unionFund} £
      + Sức khỏe công nhân: ${state.currentTurnState.workerHealth}%
      + Mức độ mâu thuẫn xã hội: ${state.currentTurnState.conflictRate}%
      + Thị phần sản xuất: ${state.currentTurnState.marketShare}%
      + Ý thức giai cấp công nhân: ${state.currentTurnState.classConsciousness}%
      + Mạng lưới đoàn kết liên xưởng: ${state.currentTurnState.solidarityNetwork}%
    
    Hãy trả lời cực kỳ ngắn gọn (không quá 2-3 câu ngắn), thực tế, bám sát các chỉ số trên và đưa ra phân tích sắc sảo có ích theo góc nhìn thực tế lịch sử của bạn để hướng dẫn người chơi chơi game tốt hơn.`;

    try {
      const recentHistory = updatedHistory.slice(-6);
      const apiMessages = recentHistory.map(m => ({
        role: m.sender === 'player' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: apiMessages,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300
            }
          })
        }
      );

      // Fallback 1: Try gemini-2.0-flash if gemini-3.1-flash-lite is not found (404)
      if (!response.ok && response.status === 404) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${activeKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: apiMessages,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300
              }
            })
          }
        );
      }

      // Fallback 2: Try gemini-1.5-flash if gemini-2.0-flash is also not found (404)
      if (!response.ok && response.status === 404) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: apiMessages,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300
              }
            })
          }
        );
      }

      if (!response.ok) {
        throw new Error(`Google API returned status ${response.status}`);
      }

      const resData = await response.json();
      const answerText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi tạm thời chưa có câu trả lời, hãy hỏi lại sau.";
      
      const advisorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'advisor',
        text: answerText.trim(),
        timestamp: Date.now(),
      };

      set({
        advisorChatHistory: {
          ...get().advisorChatHistory,
          [advisorId]: [...updatedHistory, advisorMsg]
        }
      });
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'system',
        text: `[Lỗi API]: Không thể kết nối với cố vấn. Vui lòng kiểm tra lại API Key hoặc mạng internet. Chi tiết: ${err.message}`,
        timestamp: Date.now(),
      };
      set({
        advisorChatHistory: {
          ...get().advisorChatHistory,
          [advisorId]: [...updatedHistory, errorMsg]
        }
      });
    }
  },
}));
