import type { TurnState } from '../types/economy';
import type { AugmentEffect } from '../data/augments';
import type { AdvisorPassiveEffect } from '../data/advisors';

export interface SynergyEffects {
  // === Capitalist ===
  machineryMaintenanceDiscount?: number;  // Machinist: e.g. 0.20 → reduce maintenance cost
  exploitationBonus?: number;             // Hardliner: e.g. 0.15 → add to surplus rate
  healthPenalty?: number;                 // Hardliner: e.g. 2 → reduce worker health per turn
  reputationPenalty?: number;             // Hardliner T2+: reputation decay per turn
  passiveMarketGrowth?: number;           // Commerce: e.g. 5 → marketShare +N per turn
  passiveConflictDecay?: number;          // Commerce T3: conflict -N per turn passively

  // === Worker ===
  passiveHealthRegen?: number;            // Mutualist: e.g. 3 → health +N per turn
  passiveFundBonus?: number;              // Mutualist/Reformist: multiplier on fund contribution (e.g. 0.10)
  passiveSolidarityRegen?: number;        // Mutualist T3: solidarity +N per turn
  strikeVentingBonus?: number;            // Militant: extra conflict relief during strike
  strikeDepreciationPenalty?: number;     // Militant: extra machinery depreciation on strike
  passiveConflictDecayWorker?: number;    // Militant T2: natural conflict decay per turn
  passiveConsciousnessRegen?: number;     // Reformist: consciousness +N per turn
  conflictDrainReduction?: number;        // Reformist T3: reduce union fund drain from conflict (0–1 multiplier)

  // === Combo & Cross-Faction ===
  comboConflictGrowth?: number;           // Sweatshop: conflict +N per turn
  passiveReputationRegen?: number;        // Face of Mercy / Education: reputation +N per turn
  strikeHealthShield?: boolean;           // Red Army: health is not reduced during strikes
  passiveConsciousnessRegenCross?: number; // Education: consciousness +N per turn
  passiveReputationRegenCross?: number;    // Education: reputation +N per turn
  passiveSolidarityRegenCross?: number;    // Education: solidarity +N per turn
}

/**
 * Recalculates the economic variables according to Marxist formulas:
 * - Total value: W = c + v + m
 * - Organic composition of capital: o = c / v
 * - Surplus value rate: m' = m / v * 100%
 * 
 * Also calculates the transition of indicators based on player card selections.
 */
export function calculateTurnResult(
  prev: TurnState,
  capitalistEffects: Partial<Record<keyof TurnState, number>>,
  workerEffects: Partial<Record<keyof TurnState, number>>,
  isStrike = false,
  synergyEffects?: SynergyEffects,
  augmentEffect?: AugmentEffect,
  streakBonus?: { capitalBonus?: number; fundBonus?: number; healthBonus?: number },
  advisorEffect?: AdvisorPassiveEffect
): TurnState {
  const nextTurnNumber = prev.turnNumber + 1;
  const nextYear = prev.year + 2;

  // Merge effects
  const effects = { ...capitalistEffects };
  for (const key in workerEffects) {
    const k = key as keyof TurnState;
    effects[k] = (effects[k] || 0) + (workerEffects[k] || 0);
  }

  // 1. Basic indicators transition (before recalculating formulas)
  let nextC = Math.max(50, prev.constantCapital + (effects.constantCapital || 0));
  let nextV = Math.max(50, prev.variableCapital + (effects.variableCapital || 0));
  
  let nextMarketShare = Math.min(100, Math.max(0, prev.marketShare + (effects.marketShare || 0)));
  let nextReputation = Math.min(100, Math.max(0, prev.reputation + (effects.reputation || 0)));
  
  let nextWorkerHealth = Math.min(100, Math.max(0, prev.workerHealth + (effects.workerHealth || 0)));
  let nextConflictRate = Math.min(100, Math.max(0, prev.conflictRate + (effects.conflictRate || 0)));
  let nextClassConsciousness = Math.min(100, Math.max(0, prev.classConsciousness + (effects.classConsciousness || 0)));
  let nextSolidarityNetwork = Math.min(100, Math.max(0, prev.solidarityNetwork + (effects.solidarityNetwork || 0)));

  // === Apply ALL Passive Synergy Effects ===

  // --- Capitalist Synergies ---
  // Hardliner: Health penalty + reputation penalty per turn
  if (synergyEffects?.healthPenalty) {
    nextWorkerHealth = Math.max(0, nextWorkerHealth - synergyEffects.healthPenalty);
  }
  if (synergyEffects?.reputationPenalty) {
    nextReputation = Math.max(0, nextReputation - synergyEffects.reputationPenalty);
  }
  // Commerce: Passive market share growth per turn
  if (synergyEffects?.passiveMarketGrowth) {
    nextMarketShare = Math.min(100, nextMarketShare + synergyEffects.passiveMarketGrowth);
  }
  // Commerce T3: Passive conflict reduction
  if (synergyEffects?.passiveConflictDecay) {
    nextConflictRate = Math.max(0, nextConflictRate - synergyEffects.passiveConflictDecay);
  }
  // Face of Mercy / Education: Passive reputation regen
  if (synergyEffects?.passiveReputationRegen) {
    nextReputation = Math.min(100, nextReputation + synergyEffects.passiveReputationRegen);
  }
  if (synergyEffects?.passiveReputationRegenCross) {
    nextReputation = Math.min(100, nextReputation + synergyEffects.passiveReputationRegenCross);
  }
  // Sweatshop: Combo conflict growth
  if (synergyEffects?.comboConflictGrowth) {
    nextConflictRate = Math.min(100, nextConflictRate + synergyEffects.comboConflictGrowth);
  }

  // --- Worker Synergies ---
  // Mutualist: Passive health regen per turn
  if (synergyEffects?.passiveHealthRegen) {
    nextWorkerHealth = Math.min(100, nextWorkerHealth + synergyEffects.passiveHealthRegen);
  }
  // Mutualist T3 / Education: Passive solidarity growth
  if (synergyEffects?.passiveSolidarityRegen) {
    nextSolidarityNetwork = Math.min(100, nextSolidarityNetwork + synergyEffects.passiveSolidarityRegen);
  }
  if (synergyEffects?.passiveSolidarityRegenCross) {
    nextSolidarityNetwork = Math.min(100, nextSolidarityNetwork + synergyEffects.passiveSolidarityRegenCross);
  }
  // Militant T2: Natural conflict decay per turn (not only during strikes)
  if (synergyEffects?.passiveConflictDecayWorker) {
    nextConflictRate = Math.max(0, nextConflictRate - synergyEffects.passiveConflictDecayWorker);
  }
  // Reformist / Education: Passive class consciousness growth per turn
  if (synergyEffects?.passiveConsciousnessRegen) {
    nextClassConsciousness = Math.min(100, nextClassConsciousness + synergyEffects.passiveConsciousnessRegen);
  }
  if (synergyEffects?.passiveConsciousnessRegenCross) {
    nextClassConsciousness = Math.min(100, nextClassConsciousness + synergyEffects.passiveConsciousnessRegenCross);
  }

  // If a strike is active, modify stats:
  if (isStrike) {
    // Red Army Combo: Health shield during strike
    if (synergyEffects?.strikeHealthShield) {
      // Revert the workerHealth effects from this turn if it dropped
      nextWorkerHealth = Math.max(nextWorkerHealth, prev.workerHealth);
    }
    // Machinery depreciation: default 5%, +Militant penalty
    const deprRate = 0.95 - (synergyEffects?.strikeDepreciationPenalty || 0);
    nextC = Math.max(50, Math.round(nextC * deprRate));
    
    // Strike tension venting: default 12%, +Militant bonus
    const ventRate = 12 + (synergyEffects?.strikeVentingBonus || 0);
    nextConflictRate = Math.max(0, nextConflictRate - ventRate);
  }

  // 2. Marxist Economics recurrent calculations
  // Organic composition of capital o = c / v
  const organicComposition = nextC / nextV;

  let surplusValue = 0;
  let actualSurplusRate = 0;

  if (!isStrike) {
    // Surplus value rate m'
    // Base rate of surplus value is 120% (1.2)
    const baseSurplusRate = 1.20;
    const healthModifier = nextWorkerHealth / 100;
    const machineryModifier = 1 + Math.log(1 + organicComposition) * 0.3;
    const resistanceModifier = 1 - (nextClassConsciousness * nextConflictRate) / 25000; // max 40% reduction
    
    // Base surplus value rate, modified by Hardliner synergy
    actualSurplusRate = Math.max(0.1, baseSurplusRate * healthModifier * machineryModifier * resistanceModifier + (synergyEffects?.exploitationBonus || 0));
    
    // Surplus value m = v * m'
    surplusValue = nextV * actualSurplusRate;
  }

  // Commodity Social Value W = c + v + m
  const socialValue = nextC + nextV + surplusValue;

  // Market Demand
  const aggregateDemand = Math.max(0, nextV * 1.5 + nextC * 0.2 + (effects.aggregateDemand || 0));

  // Overproduction realization ratio
  const realizationRatio = isStrike ? 1.0 : (socialValue > 0 ? Math.min(1.0, aggregateDemand / socialValue) : 1.0);

  // Capitalist Capital changes:
  // - Increases by realized surplus value m
  // - If isStrike is active, surplusValue is 0, so profit is 0.
  const marketModifier = nextMarketShare / 50; // 50% is baseline (1.0)
  const capitalistProfit = surplusValue * marketModifier * realizationRatio;
  
  // Maintenance cost of machinery: 25% of constant capital, discounted by Machinist synergy
  // Tăng từ 20% → 25% để buộc Tư Bản phải quản lý tốt hơn
  const maintenanceDiscount = synergyEffects?.machineryMaintenanceDiscount || 0;
  const machineryMaintenance = (nextC / 4) * (1 - maintenanceDiscount);

  let nextCapital = prev.capital + capitalistProfit + (effects.capital || 0) - machineryMaintenance; 
  nextCapital = Math.max(0, nextCapital);

  // Worker Union Fund changes:
  // Mutualist/Reformist passiveFundBonus multiplier boosts contribution
  const fundMultiplier = 1 + (synergyEffects?.passiveFundBonus || 0);
  // +30 £ base floor income (đoàn phí cơ bản) không phụ thuộc tổ chức, chỉ bị mất khi strike
  const BASE_UNION_DUES = 30;
  const workerContribution = isStrike ? 0 : (
    nextV * (nextClassConsciousness / 100) * (nextSolidarityNetwork / 100) * 0.15 * fundMultiplier
    + BASE_UNION_DUES
  );
  // Reformist T3: reduce conflict-based fund drain
  // Tăng hệ số từ 1.5 → 2.0 để mâu thuẫn xã hội gây áp lực kinh tế lớn hơn
  const conflictDrainMult = 1 - (synergyEffects?.conflictDrainReduction || 0);
  const conflictDrain = nextConflictRate * 2.0 * conflictDrainMult;
  // Strike fund drain of 200 £
  const strikeFundDrain = isStrike ? 200 : 0;
  let nextUnionFund = prev.unionFund + workerContribution - conflictDrain - strikeFundDrain + (effects.unionFund || 0);
  nextUnionFund = Math.max(0, nextUnionFund);

  // === AUGMENT PASSIVE EFFECTS (applied every turn) ===
  if (augmentEffect) {
    // Per-turn stat bonuses
    nextMarketShare = Math.min(100, nextMarketShare + (augmentEffect.bonusMarketSharePerTurn || 0));
    nextWorkerHealth = Math.min(100, nextWorkerHealth + (augmentEffect.bonusHealthPerTurn || 0));
    nextClassConsciousness = Math.min(100, nextClassConsciousness + (augmentEffect.bonusConsciousnessPerTurn || 0));
    nextSolidarityNetwork = Math.min(100, nextSolidarityNetwork + (augmentEffect.bonusSolidarityPerTurn || 0));
    nextConflictRate = Math.max(0, nextConflictRate - (augmentEffect.bonusConflictDecayPerTurn || 0));
    // Augment: Extra maintenance discount stacking
    const augMaintenanceDiscount = augmentEffect.maintenanceReduction || 0;
    if (augMaintenanceDiscount > 0) {
      // Already paid maintenance above, refund the augment discount
      const refund = machineryMaintenance * augMaintenanceDiscount;
      nextCapital = Math.max(0, nextCapital + refund);
    }
    // Augment: surplus rate multiplier (apply on top of profit)
    if (augmentEffect.surplusRateMultiplier && augmentEffect.surplusRateMultiplier !== 1) {
      const extraProfit = capitalistProfit * (augmentEffect.surplusRateMultiplier - 1);
      nextCapital = Math.max(0, nextCapital + extraProfit);
    }
    // Augment: fund contribution multiplier
    if (augmentEffect.fundContribMultiplier && augmentEffect.fundContribMultiplier !== 1) {
      const extraContrib = workerContribution * (augmentEffect.fundContribMultiplier - 1);
      nextUnionFund = Math.max(0, nextUnionFund + extraContrib);
    }
    // Augment: conflict drain multiplier (reduce drain)
    if (augmentEffect.conflictDrainMultiplier && augmentEffect.conflictDrainMultiplier < 1) {
      // Already drained above, refund excess drain
      const savedDrain = conflictDrain * (1 - augmentEffect.conflictDrainMultiplier);
      nextUnionFund = Math.max(0, nextUnionFund + savedDrain);
    }
    // Augment: Capital interest (% of current capital)
    if (augmentEffect.interestRateBonus) {
      nextCapital = Math.max(0, nextCapital + prev.capital * augmentEffect.interestRateBonus);
    }
    // Augment: Solidarity interest (% of current fund)
    if (augmentEffect.solidarityInterestBonus) {
      nextUnionFund = Math.max(0, nextUnionFund + prev.unionFund * augmentEffect.solidarityInterestBonus);
    }
  }

  // === BASE INTEREST ECONOMY (DTCL-style passive income) ===
  // Capitalist: earn 1.0% interest on capital stockpile each turn (max 400£)
  // Giảm từ 1.5% → 1.0% để ngăn snowball passive thu nhập quá cao
  const baseCapitalInterest = Math.min(400, nextCapital * 0.010);
  nextCapital += baseCapitalInterest;
  // Worker: earn solidarity dues based on consciousness × solidarity (max 120£)
  const baseFundInterest = Math.min(120, (nextClassConsciousness / 100) * (nextSolidarityNetwork / 100) * nextUnionFund * 0.04);
  nextUnionFund += baseFundInterest;

  // === ADVISOR PASSIVE EFFECTS (applied every turn) ===
  if (advisorEffect) {
    // Capitalist advisor: market share growth per turn (Cobden)
    if (advisorEffect.marketSharePerTurn) {
      nextMarketShare = Math.min(100, nextMarketShare + advisorEffect.marketSharePerTurn);
    }
    // Worker advisor: class consciousness per turn (Engels)
    if (advisorEffect.consciousnessPerTurn) {
      nextClassConsciousness = Math.min(100, nextClassConsciousness + advisorEffect.consciousnessPerTurn);
    }
    // Worker advisor: health per turn (Owen)
    if (advisorEffect.healthPerTurn) {
      nextWorkerHealth = Math.min(100, nextWorkerHealth + advisorEffect.healthPerTurn);
    }
    // Worker advisor: solidarity per turn conditional on conflict (O'Connor)
    if (advisorEffect.solidarityPerTurn) {
      const threshold = advisorEffect.solidarityConflictThreshold ?? 0;
      if (nextConflictRate >= threshold) {
        nextSolidarityNetwork = Math.min(100, nextSolidarityNetwork + advisorEffect.solidarityPerTurn);
      }
    }
    // Capitalist advisor: maintenance reduction (Arkwright) — refund on top of synergy
    if (advisorEffect.maintenanceReduction) {
      const refund = machineryMaintenance * advisorEffect.maintenanceReduction;
      nextCapital = Math.max(0, nextCapital + refund);
    }
    // Capitalist advisor: surplus bonus multiplier (Ure)
    if (advisorEffect.surplusBonus) {
      const extraProfit = capitalistProfit * advisorEffect.surplusBonus;
      nextCapital = Math.max(0, nextCapital + extraProfit);
    }
    // Worker advisor: fund contribution multiplier (Doherty)
    if (advisorEffect.fundContribMultiplier) {
      const extraContrib = workerContribution * advisorEffect.fundContribMultiplier;
      nextUnionFund = Math.max(0, nextUnionFund + extraContrib);
    }
    // Capitalist advisor: windfall every N turns (Hudson)
    if (advisorEffect.capitalWindfallAmount && advisorEffect.capitalWindfallInterval) {
      if (prev.turnNumber > 0 && prev.turnNumber % advisorEffect.capitalWindfallInterval === 0) {
        nextCapital = Math.max(0, nextCapital + advisorEffect.capitalWindfallAmount);
      }
    }
  }

  // === STREAK BONUS ===
  if (streakBonus) {
    nextCapital = Math.max(0, nextCapital + (streakBonus.capitalBonus || 0));
    nextUnionFund = Math.max(0, nextUnionFund + (streakBonus.fundBonus || 0));
    nextWorkerHealth = Math.min(100, nextWorkerHealth + (streakBonus.healthBonus || 0));
  }

  return {
    turnNumber: nextTurnNumber,
    year: nextYear,
    capital: Math.round(nextCapital),
    constantCapital: Math.round(nextC),
    variableCapital: Math.round(nextV),
    organicComposition: parseFloat(organicComposition.toFixed(4)),
    surplusValue: Math.round(surplusValue),
    marketShare: Math.round(nextMarketShare),
    reputation: Math.round(nextReputation),
    workerHealth: Math.round(nextWorkerHealth),
    conflictRate: Math.round(nextConflictRate),
    unionFund: Math.round(nextUnionFund),
    classConsciousness: Math.round(nextClassConsciousness),
    solidarityNetwork: Math.round(nextSolidarityNetwork),
    aggregateDemand: Math.round(aggregateDemand),
    socialValue: Math.round(socialValue),
  };
}

/**
 * Returns the default starting state of the economy (Turn 0 / Start of Turn 1)
 */
export function getInitialTurnState(): TurnState {
  return {
    turnNumber: 0,
    year: 1811,
    capital: 10000,
    constantCapital: 3000,
    variableCapital: 2000,
    organicComposition: 1.5, // 3000 / 2000
    surplusValue: 2400,
    marketShare: 50,
    reputation: 50,
    workerHealth: 80,
    conflictRate: 15,
    unionFund: 1000,
    classConsciousness: 10,
    solidarityNetwork: 15,
    aggregateDemand: 4500,
    socialValue: 7400,
  };
}
