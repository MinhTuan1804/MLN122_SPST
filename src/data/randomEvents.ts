import type { HistoricalEvent } from '../types/economy';

export interface EventChoice {
  faction: 'capitalist' | 'worker';
  text: string;
  effects: Partial<Record<string, number>>;
}

export interface GameEvent extends HistoricalEvent {
  id: string;
  isHistorical: boolean;
  triggerTurn?: number; // If set, triggers EXACTLY at this turn
  choices?: EventChoice[];
}

export const historicalEvents: GameEvent[] = [
  {
    id: 'hist_luddites',
    year: 1811,
    title: 'Khởi Nghĩa Luddite: Phá Hủy Máy Móc',
    description: 'Phong trào phá hoại máy dệt bùng phát dữ dội. Công nhân coi máy móc tự động là cướp đi cơm áo của gia đình họ.',
    effects: {},
    details: 'Vào đầu thế kỷ 19, những người thợ dệt thủ công dưới sự dẫn dắt của thủ lĩnh huyền thoại Ned Ludd đã bí mật đột nhập các xí nghiệp dệt đêm khuya để đập phá các khung cửi chạy bằng hơi nước. Đối với họ, chiếc máy dệt không chỉ là công cụ sản xuất mới, mà là biểu tượng của sự thất nghiệp và suy giảm giá trị lao động thủ công.',
    isHistorical: true,
    triggerTurn: 3,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Thuê cai lộ tuần tra và lính gác vũ trang gác đêm bảo vệ máy móc.',
        effects: { capital: -600, constantCapital: 300, conflictRate: 15 }
      },
      {
        faction: 'capitalist',
        text: 'B. Nhượng bộ đàm phán, cam kết không sa thải công nhân dệt thủ công.',
        effects: { variableCapital: 300, conflictRate: -15, reputation: 15 }
      },
      {
        faction: 'worker',
        text: 'A. Đột nhập ban đêm đập phá máy dệt, làm hỏng cọc trục quay cơ học.',
        effects: { constantCapital: -1000, conflictRate: 20, classConsciousness: 15, workerHealth: -5 }
      },
      {
        faction: 'worker',
        text: 'B. Thu thập chữ ký, soạn thỉnh nguyện thư gửi lên Nghị viện cải cách.',
        effects: { solidarityNetwork: 15, classConsciousness: 10, conflictRate: 5, unionFund: -150 }
      }
    ]
  },
  {
    id: 'hist_poor_law',
    year: 1834,
    title: 'Đạo Luật Cứu Trợ Người Nghèo Sửa Đổi',
    description: 'Chính phủ ban hành luật cứu trợ mới, buộc những người thất nghiệp phải vào nhà tế bần (workhouses) khắc nghiệt.',
    effects: {},
    details: 'Đạo luật cứu tế mới năm 1834 chấm dứt trợ cấp tiền mặt trực tiếp cho người nghèo tại gia. Để nhận được cứu tế, người nghèo buộc phải chuyển vào trong các "nhà công ích" với điều kiện sống khổ cực, lao động nặng nhọc và bị chia rẽ gia đình. Luật này nhằm ép buộc lao động giá rẻ gia nhập thị trường bằng mọi giá.',
    isHistorical: true,
    triggerTurn: 6,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Ủng hộ đạo luật mới, tận dụng sức ép để hạ giá lương công dệt ngày.',
        effects: { variableCapital: -300, reputation: -10, conflictRate: 20 }
      },
      {
        faction: 'capitalist',
        text: 'B. Lập quỹ từ thiện riêng tại xưởng để cứu tế công nhân khó khăn.',
        effects: { capital: -800, workerHealth: 15, reputation: 15, conflictRate: -10 }
      },
      {
        faction: 'worker',
        text: 'A. Tuyên truyền phát truyền đơn phẫn nộ chống lại các nhà tế bần.',
        effects: { classConsciousness: 20, conflictRate: 15, solidarityNetwork: 10 }
      },
      {
        faction: 'worker',
        text: 'B. Trích quỹ tương tế để lập kho thóc chia sẻ cho thành viên thất nghiệp.',
        effects: { unionFund: -400, workerHealth: 15, solidarityNetwork: 15 }
      }
    ]
  },
  {
    id: 'hist_ten_hours_act',
    year: 1847,
    title: 'Đạo Luật 10 Giờ Được Thông Qua',
    description: 'Nghị viện Anh giới hạn thời gian làm việc của phụ nữ và trẻ em dưới 18 tuổi tại các xí nghiệp dệt tối đa 10 giờ/ngày.',
    effects: {},
    details: 'Sau nhiều thập kỷ đấu tranh bền bỉ của các nghiệp đoàn công nhân và sự ủng hộ từ một số chính trị gia nhân đạo, Đạo luật 10 Giờ (Ten Hours Act 1847) chính thức có hiệu lực. Đây là bước ngoặt lớn đầu tiên đánh dấu sự can thiệp của luật pháp bang vào giới hạn thời gian bóc lột sức lao động của chủ tư bản.',
    isHistorical: true,
    triggerTurn: 9,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Chia ca làm việc xen kẽ mập mờ để lách luật, giữ nguyên giờ làm.',
        effects: { capital: 400, conflictRate: 20, reputation: -15 }
      },
      {
        faction: 'capitalist',
        text: 'B. Tuân thủ tuyệt đối, tập trung đầu tư công nghệ hơi nước tăng năng suất.',
        effects: { constantCapital: 1000, capital: -500, workerHealth: 15, reputation: 15 }
      },
      {
        faction: 'worker',
        text: 'A. Lập ban giám sát nội bộ xưởng dệt, báo cáo vi phạm lên Thanh tra.',
        effects: { reputation: -15, classConsciousness: 15, workerHealth: 10 }
      },
      {
        faction: 'worker',
        text: 'B. Góp tiền lập lớp học văn hóa buổi tối nâng cao dân trí công đoàn.',
        effects: { unionFund: -300, classConsciousness: 20, solidarityNetwork: 15 }
      }
    ]
  },
  {
    id: 'hist_preston_strike',
    year: 1853,
    title: 'Đại Đình Công Preston',
    description: 'Hơn 20,000 công nhân dệt tại Preston bãi công suốt 28 tuần đòi tăng lương 10% và giảm giờ làm.',
    effects: {},
    details: 'Cuộc bãi công lịch sử tại Preston kéo dài từ năm 1853 đến 1854 đã làm tê liệt toàn bộ ngành dệt của vùng Lancashire. Công nhân được hỗ trợ quỹ tương tế từ khắp cả nước gửi về. Dù cuối cùng phải nhượng bộ do cạn kiệt tài chính, cuộc đấu tranh đã chứng tỏ sức mạnh tổ chức khổng lồ của các nghiệp đoàn sơ khai.',
    isHistorical: true,
    triggerTurn: 12,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Đóng cửa nhà xưởng toàn phần (Lockout) để triệt tiêu tài chính công nhân.',
        effects: { capital: -1000, marketShare: -10, conflictRate: 25 }
      },
      {
        faction: 'capitalist',
        text: 'B. Chấp nhận thỏa hiệp tăng lương 5% để sớm khôi phục sản xuất.',
        effects: { variableCapital: 400, conflictRate: -20, reputation: 10 }
      },
      {
        faction: 'worker',
        text: 'A. Kéo dài bãi công, kêu gọi quyên góp tài trợ liên vùng toàn quốc.',
        effects: { solidarityNetwork: 20, unionFund: -500, conflictRate: 15, variableCapital: 200 }
      },
      {
        faction: 'worker',
        text: 'B. Đồng ý đàm phán nhận tăng lương 3% để bảo toàn quỹ tương tế.',
        effects: { variableCapital: 150, conflictRate: -15, unionFund: 100 }
      }
    ]
  },
  {
    id: 'hist_panic_1857',
    year: 1857,
    title: 'Khủng Hoảng Tài Chính Toàn Cầu 1857',
    description: 'Bong bóng tài chính Mỹ đổ vỡ lan sang Anh quốc. Giá bông biến động mạnh, thị trường dệt may rơi vào suy thoái sâu.',
    effects: {},
    details: 'Khủng hoảng 1857 là một trong những cuộc khủng hoảng kinh tế thế giới đầu tiên mang tính chu kỳ của chủ nghĩa tư bản hiện đại. Xuất phát từ sự sụp đổ hệ thống ngân hàng Mỹ, làn sóng rút tiền tràn sang Luân Đôn, khiến hàng loạt xí nghiệp phá sản, tỷ lệ thất nghiệp tăng vọt và thị trường tiêu thụ co hẹp trầm trọng.',
    isHistorical: true,
    triggerTurn: 14,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Sa thải 30% nhân sự và hạ 10% lương để phòng thủ tài chính.',
        effects: { variableCapital: -600, constantCapital: -400, conflictRate: 25, workerHealth: -15 }
      },
      {
        faction: 'capitalist',
        text: 'B. Không sa thải, chấp nhận gánh lỗ đầu tư ngắn hạn giữ chân thợ dệt.',
        effects: { capital: -1500, reputation: 20, conflictRate: -10, workerHealth: 10 }
      },
      {
        faction: 'worker',
        text: 'A. Kêu gọi tuần hành phản đối làn sóng cắt giảm việc làm tại thị trấn.',
        effects: { conflictRate: 30, solidarityNetwork: 15, unionFund: -300 }
      },
      {
        faction: 'worker',
        text: 'B. Rút quỹ nghiệp đoàn hỗ trợ lương thực vượt khủng hoảng lương.',
        effects: { unionFund: -500, workerHealth: 15, solidarityNetwork: 15 }
      }
    ]
  }
];

export const randomEvents: GameEvent[] = [
  {
    id: 'rand_cotton_shortage',
    year: 1825,
    title: 'Nguồn Cung Bông Thô Gián Đoạn',
    description: 'Thời tiết xấu ở các đồn điền miền Nam nước Mỹ khiến giá nguyên liệu bông tăng vọt.',
    effects: {},
    isHistorical: false,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Mua bông chất lượng thấp từ vùng khác để cắt giảm chi phí nguyên liệu.',
        effects: { constantCapital: 150, capital: -200, reputation: -5 }
      },
      {
        faction: 'capitalist',
        text: 'B. Chấp nhận chi giá cao mua bông thô loại tốt từ cảng Liverpool.',
        effects: { constantCapital: 400, capital: -450, reputation: 5 }
      },
      {
        faction: 'worker',
        text: 'A. Chấp nhận giảm bớt ca sản xuất để chia sẻ gánh nặng với xưởng.',
        effects: { variableCapital: -100, conflictRate: -8 }
      },
      {
        faction: 'worker',
        text: 'B. Kiên quyết phản đối cắt giảm giờ làm, yêu cầu giữ nguyên ca.',
        effects: { conflictRate: 15, solidarityNetwork: 5 }
      }
    ]
  },
  {
    id: 'rand_boiler_explosion',
    year: 1830,
    title: 'Nổ Lò Hơi Nhà Máy',
    description: 'Một nồi hơi cũ phát nổ tại xưởng dệt khiến máy móc bị hỏng nặng và một số công nhân bị thương.',
    effects: {},
    isHistorical: false,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Nhanh chóng sửa chữa thiết bị và bồi thường hỗ trợ công nhân gặp nạn.',
        effects: { capital: -350, constantCapital: -200, workerHealth: -5, conflictRate: 5 }
      },
      {
        faction: 'capitalist',
        text: 'B. Từ chối bồi thường, chỉ chi tiền thay thế nồi hơi bị vỡ.',
        effects: { constantCapital: -400, workerHealth: -15, conflictRate: 20, reputation: -10 }
      },
      {
        faction: 'worker',
        text: 'A. Phát động quyên góp bánh mì nội bộ để tương tế gia đình nạn nhân.',
        effects: { unionFund: -100, workerHealth: 5, solidarityNetwork: 12 }
      },
      {
        faction: 'worker',
        text: 'B. Tổ chức tuần hành đòi chủ xưởng chuẩn hóa an toàn kỹ thuật lò hơi.',
        effects: { classConsciousness: 15, conflictRate: 15 }
      }
    ]
  },
  {
    id: 'rand_cholera_outbreak',
    year: 1832,
    title: 'Dịch Tả Cholera Hoành Hành',
    description: 'Dịch tả bùng phát tại khu ổ chuột phía đông Manchester, nơi ở của phần lớn công nhân xưởng.',
    effects: {},
    isHistorical: false,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Mua xà phòng sát trùng cấp cho công nhân và dọn dẹp vệ sinh nhà trọ.',
        effects: { capital: -250, workerHealth: -5, conflictRate: -5, reputation: 5 }
      },
      {
        faction: 'capitalist',
        text: 'B. Coi như đây là bệnh dịch cá nhân của công nhân, không can dự.',
        effects: { workerHealth: -20, conflictRate: 12 }
      },
      {
        faction: 'worker',
        text: 'A. Thiết lập mạng lưới tương trợ y tế, phân chia thuốc men trong tổ chức.',
        effects: { unionFund: -150, workerHealth: -3, solidarityNetwork: 15 }
      },
      {
        faction: 'worker',
        text: 'B. Đấu tranh đòi chủ xưởng đầu tư bể lọc nước sạch đầu nguồn nhà máy.',
        effects: { conflictRate: 12, classConsciousness: 10 }
      }
    ]
  },
  {
    id: 'rand_parliament_inspection',
    year: 1840,
    title: 'Thanh Tra Nhà Máy Của Chính Phủ',
    description: 'Đoàn thanh tra của Nghị viện đến kiểm tra đột xuất điều kiện làm việc của trẻ em tại xưởng dệt.',
    effects: {},
    isHistorical: false,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Hối lộ kín cho thanh tra viên để che giấu vi phạm số giờ ca làm.',
        effects: { capital: -250, reputation: 5 }
      },
      {
        faction: 'capitalist',
        text: 'B. Nhận lỗi phạt hành chính và chi tiền bảo dưỡng cải thiện xưởng.',
        effects: { capital: -450, constantCapital: 200, reputation: -10, conflictRate: -5 }
      },
      {
        faction: 'worker',
        text: 'A. Cử người lén gặp thanh tra tố cáo sự thật về điều kiện bóc lột.',
        effects: { reputation: -15, classConsciousness: 12, conflictRate: 5 }
      },
      {
        faction: 'worker',
        text: 'B. Im lặng để giữ hòa khí, tránh việc chủ xưởng sa thải thanh trừng.',
        effects: { solidarityNetwork: -5 }
      }
    ]
  },
  {
    id: 'rand_overseas_order',
    year: 1845,
    title: 'Đơn Hàng Lớn Từ Thuộc Địa',
    description: 'Xưởng dệt nhận được hợp đồng xuất khẩu vải quy mô lớn sang thị trường Ấn Độ thuộc Anh.',
    effects: {},
    isHistorical: false,
    choices: [
      {
        faction: 'capitalist',
        text: 'A. Huy động tối đa công suất, ép tăng ca dệt liên tiếp để hoàn thành.',
        effects: { capital: 1200, workerHealth: -10, conflictRate: 12, marketShare: 10 }
      },
      {
        faction: 'capitalist',
        text: 'B. Chỉ nhận đơn hàng quy mô vừa phải, bảo vệ guồng máy.',
        effects: { capital: 700, marketShare: 5 }
      },
      {
        faction: 'worker',
        text: 'A. Yêu cầu chủ xưởng chi thêm phụ cấp tăng năng suất cho thợ dệt.',
        effects: { variableCapital: 200, conflictRate: 10 }
      },
      {
        faction: 'worker',
        text: 'B. Tổ chức thương lượng giao kèo không làm ca đêm quá công suất.',
        effects: { classConsciousness: 10, solidarityNetwork: 8 }
      }
    ]
  }
];

/**
 * Returns the event triggered on a specific turn.
 * Every 3 turns (3, 6, 9, 12, 15), returns the corresponding historical event.
 * In other turns, has a 25% chance to return a random minor event.
 */
export const getEventForTurn = (turn: number): GameEvent | null => {
  const majorEvent = historicalEvents.find(e => e.triggerTurn === turn);
  if (majorEvent) return majorEvent;

  // Non-major turn: 25% chance of a random event (updated from 15%)
  if (Math.random() < 0.25) {
    const idx = Math.floor(Math.random() * randomEvents.length);
    return randomEvents[idx];
  }

  return null;
}
