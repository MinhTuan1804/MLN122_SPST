// Augment data for the Victorian Economy Game
// Inspired by DTCL augment system, themed for 19th century industrial capitalism

export type AugmentTier = 'silver' | 'gold' | 'prismatic';
export type AugmentFaction = 'capitalist' | 'worker';

export interface AugmentEffect {
  bonusCapitalPerTurn?: number;
  bonusUnionFundPerTurn?: number;
  bonusMarketSharePerTurn?: number;
  bonusHealthPerTurn?: number;
  bonusConsciousnessPerTurn?: number;
  bonusSolidarityPerTurn?: number;
  bonusConflictDecayPerTurn?: number;
  immediateCapital?: number;
  immediateUnionFund?: number;
  immediateHealth?: number;
  immediateMarketShare?: number;
  surplusRateMultiplier?: number;
  maintenanceReduction?: number;
  fundContribMultiplier?: number;
  conflictDrainMultiplier?: number;
  interestRateBonus?: number;
  solidarityInterestBonus?: number;
}

export interface Augment {
  id: string;
  name: string;
  description: string;
  historicalNote: string;
  tier: AugmentTier;
  faction: AugmentFaction;
  effect: AugmentEffect;
}

export const capitalistAugments: Augment[] = [
  // SILVER
  {
    id: 'cap_aug_steam_monopoly',
    name: 'Độc Quyền Hơi Nước',
    description: 'Thị phần tự tăng +4/lượt. Sức mạnh hơi nước làm chủ thị trường.',
    historicalNote: 'Bằng sáng chế Watt tạo ra một thế hệ độc quyền công nghiệp.',
    tier: 'silver',
    faction: 'capitalist',
    effect: { bonusMarketSharePerTurn: 4 },
  },
  {
    id: 'cap_aug_iron_ledger',
    name: 'Sổ Cái Sắt',
    description: 'Bảo trì máy móc giảm -20% vĩnh viễn.',
    historicalNote: 'Tư bản Manchester nổi tiếng với kỷ luật tài chính hà khắc.',
    tier: 'silver',
    faction: 'capitalist',
    effect: { maintenanceReduction: 0.20 },
  },
  {
    id: 'cap_aug_colonial_market',
    name: 'Thị Trường Thuộc Địa',
    description: 'Nhận ngay +1,500£ và +5 thị phần từ đơn hàng thuộc địa.',
    historicalNote: 'Đế chế Anh mở ra thị trường tiêu thụ khổng lồ.',
    tier: 'silver',
    faction: 'capitalist',
    effect: { immediateCapital: 1500, immediateMarketShare: 5 },
  },
  {
    id: 'cap_aug_dividend_scheme',
    name: 'Chương Trình Cổ Tức',
    description: 'Lãi suất vốn +2% mỗi lượt thêm vào.',
    historicalNote: 'Công ty cổ phần sinh ra khái niệm cổ tức đều đặn.',
    tier: 'silver',
    faction: 'capitalist',
    effect: { interestRateBonus: 0.02 },
  },
  // GOLD
  {
    id: 'cap_aug_factory_loophole',
    name: 'Kẽ Hở Đạo Luật Xưởng',
    description: 'Thặng dư tăng thêm +20% vĩnh viễn.',
    historicalNote: 'Chủ xưởng tìm mọi cách lách các Factory Acts qua hệ thống ca làm việc phức tạp.',
    tier: 'gold',
    faction: 'capitalist',
    effect: { surplusRateMultiplier: 1.20 },
  },
  {
    id: 'cap_aug_banking_consortium',
    name: 'Tổ Hợp Ngân Hàng',
    description: 'Nhận +3,000£ và lãi suất +3%/lượt.',
    historicalNote: 'Liên minh tư bản công nghiệp và ngân hàng là nền tảng CNTB tài chính.',
    tier: 'gold',
    faction: 'capitalist',
    effect: { immediateCapital: 3000, interestRateBonus: 0.03 },
  },
  {
    id: 'cap_aug_mechanization_drive',
    name: 'Chiến Dịch Cơ Giới Hóa',
    description: '+6 thị phần/lượt và bảo trì giảm -30%.',
    historicalNote: 'Cuộc cách mạng công nghiệp lần 2 đặc trưng bởi cơ giới hóa đại trà.',
    tier: 'gold',
    faction: 'capitalist',
    effect: { bonusMarketSharePerTurn: 6, maintenanceReduction: 0.30 },
  },
  // PRISMATIC
  {
    id: 'cap_aug_robber_baron',
    name: 'Nam Tước Cướp Bóc',
    description: 'Thặng dư +35%, +8 thị phần/lượt. Quyền năng tuyệt đối.',
    historicalNote: '"Robber Baron" — ông trùm tư bản bóc lột không giới hạn.',
    tier: 'prismatic',
    faction: 'capitalist',
    effect: { surplusRateMultiplier: 1.35, bonusMarketSharePerTurn: 8 },
  },
  {
    id: 'cap_aug_invisible_hand',
    name: 'Bàn Tay Vô Hình',
    description: '+5,000£. Bảo trì -40%. Lãi suất +4%/lượt. Thị trường tự điều tiết.',
    historicalNote: 'Adam Smith\'s "invisible hand" — niềm tin tuyệt đối vào thị trường tự do.',
    tier: 'prismatic',
    faction: 'capitalist',
    effect: { immediateCapital: 5000, maintenanceReduction: 0.40, interestRateBonus: 0.04 },
  },
];

export const workerAugments: Augment[] = [
  // SILVER
  {
    id: 'wrk_aug_mutual_society',
    name: 'Hội Tương Trợ',
    description: 'Sức khỏe CN tự phục hồi +3/lượt.',
    historicalNote: 'Friendly Societies — hội tương trợ công nhân nở rộ ở Anh thế kỷ 19.',
    tier: 'silver',
    faction: 'worker',
    effect: { bonusHealthPerTurn: 3 },
  },
  {
    id: 'wrk_aug_chapel_network',
    name: 'Mạng Lưới Nhà Thờ',
    description: 'Đoàn kết +3/lượt và Ý thức giai cấp +2/lượt.',
    historicalNote: 'Nhà thờ Nonconformist là trung tâm tổ chức cộng đồng lao động.',
    tier: 'silver',
    faction: 'worker',
    effect: { bonusSolidarityPerTurn: 3, bonusConsciousnessPerTurn: 2 },
  },
  {
    id: 'wrk_aug_strike_fund',
    name: 'Quỹ Đình Công Đặc Biệt',
    description: 'Nhận ngay +800£ quỹ và đóng góp quỹ tăng +25%.',
    historicalNote: 'Nghiệp đoàn xây dựng quỹ đình công như vũ khí chiến lược chủ chốt.',
    tier: 'silver',
    faction: 'worker',
    effect: { immediateUnionFund: 800, fundContribMultiplier: 1.25 },
  },
  {
    id: 'wrk_aug_peoples_charter',
    name: 'Hiến Chương Nhân Dân',
    description: 'Mâu thuẫn không bào mòn quỹ nhiều: Hao hụt quỹ giảm -30%.',
    historicalNote: 'People\'s Charter 1838 — nền tảng phong trào Chartist.',
    tier: 'silver',
    faction: 'worker',
    effect: { conflictDrainMultiplier: 0.70 },
  },
  // GOLD
  {
    id: 'wrk_aug_general_union',
    name: 'Liên Minh Toàn Quốc',
    description: 'Đoàn kết +5/lượt. Đóng góp quỹ +30%. Nhận ngay +1,200£.',
    historicalNote: 'Grand National Consolidated Trades Union (1834) — liên minh công đoàn đầu tiên.',
    tier: 'gold',
    faction: 'worker',
    effect: { bonusSolidarityPerTurn: 5, fundContribMultiplier: 1.30, immediateUnionFund: 1200 },
  },
  {
    id: 'wrk_aug_red_international',
    name: 'Quốc Tế Đỏ',
    description: 'Ý thức giai cấp +5/lượt. Hao hụt quỹ do Mâu thuẫn giảm -40%.',
    historicalNote: 'First International (1864) — Marx và Engels thống nhất phong trào toàn cầu.',
    tier: 'gold',
    faction: 'worker',
    effect: { bonusConsciousnessPerTurn: 5, conflictDrainMultiplier: 0.60 },
  },
  {
    id: 'wrk_aug_solidarity_economy',
    name: 'Kinh Tế Liên Đới',
    description: 'Lãi đoàn kết +4% quỹ/lượt. Sức khỏe +2/lượt.',
    historicalNote: 'Hợp tác xã Rochdale 1844 — mô hình kinh tế tự quản của công nhân.',
    tier: 'gold',
    faction: 'worker',
    effect: { solidarityInterestBonus: 0.04, bonusHealthPerTurn: 2 },
  },
  // PRISMATIC
  {
    id: 'wrk_aug_commune_spirit',
    name: 'Tinh Thần Công Xã',
    description: 'Ý thức +8/lượt, Đoàn kết +6/lượt, Sức khỏe +3/lượt.',
    historicalNote: 'Công xã Paris 1871 — đỉnh cao phong trào công nhân thế kỷ 19.',
    tier: 'prismatic',
    faction: 'worker',
    effect: { bonusConsciousnessPerTurn: 8, bonusSolidarityPerTurn: 6, bonusHealthPerTurn: 3 },
  },
  {
    id: 'wrk_aug_proletarian_vanguard',
    name: 'Đội Tiên Phong Vô Sản',
    description: '+2,500£ quỹ. Đóng góp quỹ +50%. Hao hụt quỹ do Mâu thuẫn giảm -50%.',
    historicalNote: 'Khái niệm "đội tiên phong" — bộ phận có ý thức cao dẫn dắt đấu tranh.',
    tier: 'prismatic',
    faction: 'worker',
    effect: { immediateUnionFund: 2500, fundContribMultiplier: 1.50, conflictDrainMultiplier: 0.50 },
  },
];

export const allAugments = [...capitalistAugments, ...workerAugments];

/** Get 3 random augments for a faction at a given act */
export function getAugmentChoices(faction: AugmentFaction, act: 1 | 2 | 3): Augment[] {
  const tierMap: Record<number, AugmentTier> = { 1: 'silver', 2: 'gold', 3: 'prismatic' };
  const tier = tierMap[act];
  const pool = (faction === 'capitalist' ? capitalistAugments : workerAugments)
    .filter(a => a.tier === tier);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

