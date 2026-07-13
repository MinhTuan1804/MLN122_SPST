export type Faction = 'capitalist' | 'worker';

export type GamePhase = 'lobby' | 'onboarding' | 'advisor_select' | 'pick' | 'resolve' | 'summary' | 'event' | 'augment' | 'ending';

export interface TurnState {
  turnNumber: number;
  year: number;
  
  // Capitalist Faction variables
  capital: number;             // Total financial assets
  constantCapital: number;     // c - machinery, raw materials
  variableCapital: number;     // v - labor wages
  organicComposition: number;  // c/v - Organic Composition of Capital (oc)
  surplusValue: number;        // m - Surplus Value generated
  marketShare: number;         // 0 - 100%
  reputation: number;          // 0 - 100
  
  // Worker Faction variables
  workerHealth: number;        // 0 - 100
  conflictRate: number;        // 0 - 100
  unionFund: number;           // Total worker fund
  classConsciousness: number;  // 0 - 100
  solidarityNetwork: number;   // 0 - 100
  
  // Shared Market variables
  aggregateDemand: number;
  socialValue: number;         // W = c + v + m (Total value produced)
}

export interface Card {
  id: string;
  faction: Faction;
  name: string;
  description: string;
  effects: Partial<Record<keyof TurnState, number>>;
  weight: number;
  minTurn: number;
  tier?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  strategySummary?: string;
  isFoil?: boolean; // Golden/Foil variant — all effects +50%
}

export interface HistoricalEvent {
  year: number;
  title: string;
  description: string;
  effects: Partial<Record<keyof TurnState, number>>;
  details?: string; // Expanded historical detail
}

export interface GameSession {
  id: string;
  sessionCode: string;
  status: 'waiting' | 'active' | 'finished';
  currentTurn: number;
  phase: GamePhase;
  eraYear: number;
  players: {
    capitalist?: string;
    worker?: string;
  };
}
