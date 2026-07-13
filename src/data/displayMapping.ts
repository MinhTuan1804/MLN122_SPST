import type { TurnState, Faction } from '../types/economy';

export interface DisplayIndicators {
  economicPower: number;      // 0 - 100
  enginePressure: number;     // 0 - 100
  socialDurability: number;   // 0 - 100
}

/**
 * Maps the core economy variables to 3 display gauges for the HUD.
 * 
 * 💰 Sức mạnh kinh tế:
 *   - Capitalist: capital (relative to a base of 15000) & marketShare
 *   - Worker: unionFund (relative to a base of 3000) & solidarityNetwork
 * 
 * ⚙️ Áp lực guồng máy:
 *   - Common: organicComposition & conflictRate
 * 
 * ✊ Sức bền xã hội:
 *   - Capitalist: reputation
 *   - Worker: workerHealth & classConsciousness
 */
export function mapToDisplayIndicators(state: TurnState, faction: Faction): DisplayIndicators {
  // 1. Economic Power
  let economicPower = 50;
  if (faction === 'capitalist') {
    // Normalised around 15,000 capital and 100% market share
    const capScore = Math.min(100, (state.capital / 15000) * 50);
    const mktScore = state.marketShare; // 0 - 100
    economicPower = Math.round(capScore * 0.6 + mktScore * 0.4);
  } else {
    // Normalised around 3,000 union fund and 100% solidarity network
    const fundScore = Math.min(100, (state.unionFund / 3000) * 60);
    const solidarityScore = state.solidarityNetwork; // 0 - 100
    economicPower = Math.round(fundScore * 0.5 + solidarityScore * 0.5);
  }

  // 2. Engine Pressure (shared by both factions)
  // Normalised around organicComposition = 3 (300%) and conflictRate = 100%
  const orgCompScore = Math.min(100, (state.organicComposition / 3.0) * 50);
  const conflictScore = state.conflictRate; // 0 - 100
  const enginePressure = Math.round(orgCompScore * 0.4 + conflictScore * 0.6);

  // 3. Social Durability
  let socialDurability = 50;
  if (faction === 'capitalist') {
    socialDurability = state.reputation; // 0 - 100
  } else {
    socialDurability = Math.round(state.workerHealth * 0.6 + state.classConsciousness * 0.4); // 0 - 100
  }

  return {
    economicPower: Math.min(100, Math.max(0, economicPower)),
    enginePressure: Math.min(100, Math.max(0, enginePressure)),
    socialDurability: Math.min(100, Math.max(0, socialDurability)),
  };
}
