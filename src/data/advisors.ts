// Advisor data for the Victorian Economy Game
// 8 real historical figures from the Industrial Revolution era (1811–1857)

export type AdvisorFaction = 'capitalist' | 'worker';

export interface AdvisorPassiveEffect {
  // Per-turn bonuses
  marketSharePerTurn?: number;       // e.g. Cobden: +3/turn
  consciousnessPerTurn?: number;     // e.g. Engels: +5/turn
  healthPerTurn?: number;            // e.g. Owen: +4/turn
  solidarityPerTurn?: number;        // e.g. O'Connor (when conflict >= 50)
  solidarityConflictThreshold?: number; // Only apply solidarity bonus above this conflict value

  // Multipliers
  fundContribMultiplier?: number;    // e.g. Doherty: 0.4 → fund income ×1.4
  maintenanceReduction?: number;     // e.g. Arkwright: 0.20 → −20% maintenance
  surplusBonus?: number;             // e.g. Ure: 0.15 → +15% surplus rate
  tagEffectBonus?: number;           // e.g. +0.30 → +30% effect for preferredTags cards (display only hint)

  // Capital windfall (Hudson)
  capitalWindfallAmount?: number;    // £ added every N turns
  capitalWindfallInterval?: number;  // every N turns

  // Reputation loss reduction (Cobden)
  reputationLossReduction?: number;  // 0–1 multiplier, reduces negative reputation effects
}

export interface Advisor {
  id: string;
  name: string;
  title: string;             // Short role description
  years: string;             // e.g. "1732–1792"
  faction: AdvisorFaction;
  quote: string;             // In-game display quote
  historicalNote: string;    // Tooltip / detail panel text
  preferredTags: string[];   // Tags for card recommendation hint
  passiveEffect: AdvisorPassiveEffect;
  accentColor: string;       // Tailwind color class for theming
  imageUrl: string;          // Path to portrait image
}

// ============================================================
// ⚙️ CAPITALIST ADVISORS
// ============================================================
export const capitalistAdvisors: Advisor[] = [
  {
    id: 'adv_arkwright',
    name: 'Richard Arkwright',
    title: 'Cha Đẻ Hệ Thống Nhà Máy',
    years: '1732–1792',
    faction: 'capitalist',
    quote: 'Máy móc là công cụ của tiến bộ; kẻ nào làm chủ chúng, kẻ đó làm chủ thời đại.',
    historicalNote:
      'Arkwright xây dựng xưởng Cromford (1771) — nhà máy sản xuất quy mô lớn đầu tiên thế giới. Ông áp dụng hệ thống ca kíp liên tục và kỷ luật nhà máy hiện đại. Marx coi ông là kiến trúc sư đầu tiên của nền sản xuất tư bản chủ nghĩa.',
    preferredTags: ['machinery'],
    passiveEffect: {
      maintenanceReduction: 0.20,   // −20% maintenance cost
      tagEffectBonus: 0.30,         // +30% for machinery cards (hint only)
    },
    accentColor: 'amber',
    imageUrl: '/assets/advisors/adv_arkwright_portrait_1783961721975.png',
  },
  {
    id: 'adv_ure',
    name: 'Andrew Ure',
    title: 'Triết Gia Tư Bản Nhà Máy',
    years: '1778–1857',
    faction: 'capitalist',
    quote: 'Nhà máy là một cơ thể sống vĩ đại, và người thợ chỉ là một bộ phận trong đó.',
    historicalNote:
      'Ure biện hộ mạnh mẽ cho chế độ nhà máy trong cuốn "Philosophy of Manufactures" (1835), lập luận máy móc giải phóng lao động. Marx đã phê phán trực tiếp luận điểm này trong Tư Bản Luận. Ure là hình mẫu của nhà tư tưởng phục vụ giới chủ.',
    preferredTags: ['exploitation'],
    passiveEffect: {
      surplusBonus: 0.15,           // +15% surplus rate (m')
      tagEffectBonus: 0.25,         // +25% for exploitation cards (hint only)
    },
    accentColor: 'red',
    imageUrl: '/assets/advisors/adv_ure_portrait_1783961747015.png',
  },
  {
    id: 'adv_cobden',
    name: 'Richard Cobden',
    title: 'Nhà Kinh Tế Tự Do Thương Mại',
    years: '1804–1865',
    faction: 'capitalist',
    quote: 'Thương mại tự do là nền hòa bình — vì nó kết nối con người qua lợi ích kinh tế.',
    historicalNote:
      'Cobden đồng sáng lập Liên minh Chống Luật Ngũ Cốc (Anti-Corn Law League). Chiến thắng năm 1846 mở kỷ nguyên tự do thương mại. Trường phái Manchester School của ông chủ trương cạnh tranh thị trường thay vì cưỡng bức trực tiếp.',
    preferredTags: ['marketing'],
    passiveEffect: {
      marketSharePerTurn: 3,        // +3 market share per turn
      reputationLossReduction: 0.50, // reputation losses from exploitation halved
    },
    accentColor: 'sky',
    imageUrl: '/assets/advisors/adv_cobden_portrait_1783961755921.png',
  },
  {
    id: 'adv_hudson',
    name: 'George Hudson',
    title: 'Vua Đường Sắt',
    years: '1800–1871',
    faction: 'capitalist',
    quote: 'Vốn sinh ra vốn. Kẻ khôn ngoan không làm việc — họ để đồng tiền làm việc thay.',
    historicalNote:
      'Hudson kiểm soát 1.450 dặm đường sắt Anh (1/3 tổng quốc gia) vào đỉnh điểm. Ông bị kết tội gian lận năm 1849, minh chứng cho mặt trái của tư bản đầu cơ tài chính. Marx dùng ông như ví dụ về sự sụp đổ tất yếu của tư bản hư huyễn.',
    preferredTags: ['machinery', 'marketing'],
    passiveEffect: {
      capitalWindfallAmount: 600,   // +600£ windfall every 5 turns
      capitalWindfallInterval: 5,
    },
    accentColor: 'yellow',
    imageUrl: '/assets/advisors/adv_hudson_portrait_1783961766451.png',
  },
];

// ============================================================
// ✊ WORKER ADVISORS
// ============================================================
export const workerAdvisors: Advisor[] = [
  {
    id: 'adv_engels',
    name: 'Friedrich Engels',
    title: 'Nhân Chứng Manchester',
    years: '1820–1895',
    faction: 'worker',
    quote: 'Lịch sử toàn bộ xã hội tồn tại cho đến nay là lịch sử của đấu tranh giai cấp.',
    historicalNote:
      'Engels sống ở Manchester 1842–1870, quan sát trực tiếp đời sống công nhân dệt. Cuốn "Điều Kiện Giai Cấp Công Nhân ở Anh" (1845) là tài liệu thực địa đầu tiên về bóc lột công nghiệp. Cùng Marx viết Tuyên Ngôn Cộng Sản (1848).',
    preferredTags: ['reformist', 'education'],
    passiveEffect: {
      consciousnessPerTurn: 5,      // +5 class consciousness per turn
      tagEffectBonus: 0.30,         // +30% for reformist/education cards (hint only)
    },
    accentColor: 'red',
    imageUrl: '/assets/advisors/adv_engels_portrait_1783961705969.png',
  },
  {
    id: 'adv_owen',
    name: 'Robert Owen',
    title: 'Cha Đẻ Phong Trào Hợp Tác Xã',
    years: '1771–1858',
    faction: 'worker',
    quote: 'Hoàn cảnh tạo nên tính cách con người. Hãy thay đổi hoàn cảnh, bạn sẽ thay đổi xã hội.',
    historicalNote:
      'Owen cải thiện điều kiện nhà máy New Lanark (Scotland), lập trường học miễn phí cho công nhân, và sáng lập phong trào hợp tác xã toàn quốc năm 1830. Ông chứng minh năng suất cao không cần bóc lột — một thí nghiệm xã hội chủ nghĩa tiên phong.',
    preferredTags: ['mutualaid'],
    passiveEffect: {
      healthPerTurn: 4,             // +4 worker health per turn
      tagEffectBonus: 0.30,         // +30% for mutualaid cards (hint only)
    },
    accentColor: 'emerald',
    imageUrl: '/assets/advisors/adv_owen_portrait_1783961731010.png',
  },
  {
    id: 'adv_oconnor',
    name: "Feargus O'Connor",
    title: 'Lãnh Tụ Chartist',
    years: '1796–1855',
    faction: 'worker',
    quote: 'Sức mạnh của nhân dân nằm ở sự đoàn kết. Tản mát là thất bại; tập hợp là chiến thắng.',
    historicalNote:
      "O'Connor lãnh đạo Chartists thu thập 3 triệu chữ ký thỉnh nguyện năm 1842. Tờ báo Northern Star của ông đạt 50.000 bản/tuần — lớn nhất nước Anh thời bấy giờ. Phong trào Chartism là cột mốc đầu tiên của nền dân chủ công nhân hiện đại.",
    preferredTags: ['militant'],
    passiveEffect: {
      solidarityPerTurn: 4,              // +4 solidarity when conflict >= threshold
      solidarityConflictThreshold: 50,   // only active when conflict >= 50
      tagEffectBonus: 0.25,              // +25% for militant cards (hint only)
    },
    accentColor: 'orange',
    imageUrl: '/assets/advisors/adv_oconnor_portrait_1783961783473.png',
  },
  {
    id: 'adv_doherty',
    name: 'John Doherty',
    title: 'Người Tiên Phong Công Đoàn Dệt',
    years: '1798–1854',
    faction: 'worker',
    quote: 'Không một người thợ đơn lẻ nào thắng được chủ xưởng. Nhưng mười ngàn thợ đoàn kết có thể thay đổi thế giới.',
    historicalNote:
      'Doherty thành lập Grand General Union of Cotton Spinners (1829) — liên đoàn lao động xuyên địa phương đầu tiên ở Anh. Ông bị bắt năm 1830 nhưng tiếp tục tổ chức từ trong tù. Mô hình nghiệp đoàn của Doherty trở thành nền tảng cho toàn bộ phong trào trade union hiện đại.',
    preferredTags: ['mutualaid', 'reformist'],
    passiveEffect: {
      fundContribMultiplier: 0.40,  // union fund income ×1.4 (+40%)
    },
    accentColor: 'blue',
    imageUrl: '/assets/advisors/adv_doherty_portrait_1783961793728.png',
  },
];

export const allAdvisors: Advisor[] = [...capitalistAdvisors, ...workerAdvisors];

export function getAdvisorsForFaction(faction: AdvisorFaction): Advisor[] {
  return allAdvisors.filter(a => a.faction === faction);
}
