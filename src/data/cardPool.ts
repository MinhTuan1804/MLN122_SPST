import type { Card } from '../types/economy';

export const capitalistCards: Card[] = [
  {
    id: 'cap_new_machinery',
    faction: 'capitalist',
    name: 'Dây Chuyền Mới',
    description: 'Đầu tư lắp đặt máy dệt cơ khí tự động. Giảm nhu cầu lao động thủ công.',
    effects: {
      constantCapital: 1200,
      variableCapital: -400,
      workerHealth: -10,
      conflictRate: 15,
      marketShare: 10,
    },
    weight: 100,
    minTurn: 0,
    tier: 1,
    tags: ['machinery'],
    strategySummary: 'Tăng tự động hóa (c tăng, v giảm) giúp tăng thị phần nhưng tăng mâu thuẫn.'
  },
  {
    id: 'cap_marketing',
    faction: 'capitalist',
    name: 'Quảng Cáo Rầm Rộ',
    description: 'Quảng bá sản phẩm xưởng dệt trên các mặt báo lớn ở Luân Đôn và Manchester.',
    effects: {
      capital: -800,
      marketShare: 15,
      reputation: 10,
    },
    weight: 90,
    minTurn: 0,
    tier: 1,
    tags: ['marketing'],
    strategySummary: 'Đầu tư tiền để gia tăng thị phần xưởng dệt và uy tín của chủ xưởng.'
  },
  {
    id: 'cap_bribe_parliament',
    faction: 'capitalist',
    name: 'Lót Tay Nghị Viện',
    description: 'Tài trợ cho chiến dịch tranh cử của Nghị sĩ để bảo vệ quyền lợi xưởng dệt.',
    effects: {
      capital: -1200,
      reputation: 15,
      conflictRate: -10,
    },
    weight: 70,
    minTurn: 2,
    tier: 2,
    tags: ['marketing'],
    strategySummary: 'Vận động chính trường giúp tăng danh tiếng và giảm nhẹ mâu thuẫn xã hội.'
  },
  {
    id: 'cap_cut_wages',
    faction: 'capitalist',
    name: 'Cắt Giảm Lương',
    description: 'Giảm đơn giá công nhật để bảo toàn tỷ suất lợi nhuận trong mùa khó khăn.',
    effects: {
      variableCapital: -500,
      workerHealth: -15,
      conflictRate: 25,
      reputation: -15,
    },
    weight: 100,
    minTurn: 0,
    tier: 1,
    tags: ['exploitation'],
    strategySummary: 'Tiết kiệm lớn quỹ lương (v giảm) nhưng tăng mạnh mâu thuẫn và hại sức khỏe công nhân.'
  },
  {
    id: 'cap_increase_hours',
    faction: 'capitalist',
    name: 'Tăng Giờ Làm Việc',
    description: 'Kéo dài ca làm việc từ 12 giờ lên 14 giờ mỗi ngày để tăng tổng sản lượng.',
    effects: {
      workerHealth: -20,
      conflictRate: 20,
      marketShare: 5,
      reputation: -10,
    },
    weight: 90,
    minTurn: 1,
    tier: 2,
    tags: ['exploitation'],
    strategySummary: 'Tăng cường bóc lột thời gian giúp tăng sản lượng nhẹ nhưng làm công nhân suy kiệt.'
  },
  {
    id: 'cap_improve_mill',
    faction: 'capitalist',
    name: 'Cải Thiện Nhà Xưởng',
    description: 'Lắp thêm cửa thông gió và dọn dẹp bụi bông để xoa dịu làn sóng phẫn nộ.',
    effects: {
      capital: -1000,
      constantCapital: 300,
      workerHealth: 15,
      conflictRate: -15,
      reputation: 10,
    },
    weight: 80,
    minTurn: 0,
    tier: 1,
    tags: ['machinery'],
    strategySummary: 'Đầu tư cải thiện môi trường làm việc để giảm mâu thuẫn và hồi phục sức khỏe công nhân.'
  },
  {
    id: 'cap_steam_upgrade',
    faction: 'capitalist',
    name: 'Động Cơ Hơi Nước Watt',
    description: 'Nâng cấp toàn bộ hệ thống trục quay sang động cơ hơi nước công suất lớn.',
    effects: {
      constantCapital: 2000,
      variableCapital: -300,
      workerHealth: -12,
      marketShare: 15,
    },
    weight: 60,
    minTurn: 5,
    tier: 5,
    tags: ['machinery'],
    strategySummary: 'Hiện đại hóa máy móc lớn (c tăng, v giảm) giúp bứt phá thị phần và giảm lệ thuộc nhân công.'
  },
  {
    id: 'cap_pinkerton_guards',
    faction: 'capitalist',
    name: 'Thuê Cai Lộ Tuần Tra',
    description: 'Tăng cường lực lượng kiểm soát an ninh tại cổng xưởng dệt để ngăn rò rỉ truyền đơn.',
    effects: {
      capital: -500,
      conflictRate: -20,
      classConsciousness: -10,
    },
    weight: 70,
    minTurn: 3,
    tier: 3,
    tags: ['exploitation'],
    strategySummary: 'Chi ngân quỹ kiểm soát an ninh giúp dập tắt mâu thuẫn và hạn chế ý thức giác ngộ.'
  },
  {
    id: 'cap_foreign_labor',
    faction: 'capitalist',
    name: 'Thuê Nhân Công Ngoài',
    description: 'Tuyển mộ lao động giá rẻ từ hạt Yorkshire để phá vỡ thế độc quyền đàm phán lương.',
    effects: {
      variableCapital: -300,
      conflictRate: 12,
      workerHealth: -5,
      marketShare: 5,
    },
    weight: 80,
    minTurn: 1,
    tier: 2,
    tags: ['exploitation'],
    strategySummary: 'Giảm bớt chi phí lương thông qua lao động nhập cư, đổi lại mâu thuẫn xưởng dệt tăng nhẹ.'
  },
  {
    id: 'cap_factory_insurance',
    faction: 'capitalist',
    name: 'Bảo Hiểm Hỏa Hoạn',
    description: 'Mua chứng chỉ bảo hiểm nhà xưởng từ các quỹ tài chính Luân Đôn để phòng ngừa rủi ro đập phá.',
    effects: {
      capital: -400,
      reputation: 8,
      conflictRate: -5,
    },
    weight: 70,
    minTurn: 2,
    tier: 2,
    tags: ['machinery'],
    strategySummary: 'Chi quỹ phòng ngừa tổn thất tài sản, gia tăng danh tiếng quản lý an toàn.'
  },
  {
    id: 'cap_share_profit',
    faction: 'capitalist',
    name: 'Chia Phần Trăm Thặng Dư',
    description: 'Thử nghiệm cơ chế chia thưởng nhỏ theo năng suất để xoa dịu phong trào công đoàn.',
    effects: {
      capital: -800,
      conflictRate: -18,
      reputation: 15,
      workerHealth: 10,
    },
    weight: 60,
    minTurn: 3,
    tier: 3,
    tags: ['marketing'],
    strategySummary: 'Trích một phần nhỏ lợi ích kinh tế để xoa dịu đấu tranh và tăng uy tín xã hội.'
  },
  {
    id: 'cap_child_labor',
    faction: 'capitalist',
    name: 'Lao Động Trẻ Em',
    description: 'Tuyển trẻ mồ côi dọn dẹp bông vụn dưới gầm máy dệt trục quay với thù lao cực thấp.',
    effects: {
      variableCapital: -350,
      workerHealth: -15,
      conflictRate: 15,
      reputation: -15,
    },
    weight: 90,
    minTurn: 0,
    tier: 1,
    tags: ['exploitation'],
    strategySummary: 'Khai thác triệt để sức lao động giá trẻ để giảm quỹ lương, bị xã hội lên án dữ dội.'
  },
  {
    id: 'cap_scientific_management',
    faction: 'capitalist',
    name: 'Định Mức Bấm Giờ',
    description: 'Áp dụng đo lường thời gian thao tác để tối ưu hóa công suất quay máy dệt cơ học.',
    effects: {
      constantCapital: 400,
      variableCapital: -200,
      conflictRate: 8,
      marketShare: 8,
    },
    weight: 70,
    minTurn: 4,
    tier: 4,
    tags: ['machinery'],
    strategySummary: 'Tăng cường kỷ luật thao tác để tăng hiệu suất máy móc và thị phần, tăng mâu thuẫn nhẹ.'
  },
  {
    id: 'cap_philanthropy',
    faction: 'capitalist',
    name: 'Tài Trợ Xây Nhà Thờ',
    description: 'Quyên góp tiền cho nhà thờ địa phương để dạy công nhân đức tính phục tùng, nhẫn nhịn.',
    effects: {
      capital: -600,
      reputation: 15,
      conflictRate: -8,
      classConsciousness: -8,
    },
    weight: 80,
    minTurn: 2,
    tier: 2,
    tags: ['marketing'],
    strategySummary: 'Dùng tôn giáo để xoa dịu đấu tranh, hạn chế ý thức giác ngộ và nâng cao danh tiếng.'
  },
  {
    id: 'cap_electric_loom',
    faction: 'capitalist',
    name: 'Máy Dệt Điện',
    description: 'Nâng cấp lên máy dệt chạy bằng điện từ, tự động hóa cao nhất thời bấy giờ.',
    effects: {
      constantCapital: 1800,
      marketShare: 12,
      conflictRate: 8,
    },
    weight: 60,
    minTurn: 6,
    tier: 5,
    tags: ['machinery'],
    strategySummary: 'Bứt phá thị phần bằng tự động hóa điện năng, tăng mạnh giá trị máy móc.'
  },
  {
    id: 'cap_time_motion',
    faction: 'capitalist',
    name: 'Phân Tích Thao Tác',
    description: 'Thuê kỹ sư tối ưu hóa từng cử động của công nhân để tăng hiệu suất cắt giảm dư thừa.',
    effects: {
      constantCapital: 300,
      variableCapital: -150,
      marketShare: 6,
    },
    weight: 80,
    minTurn: 3,
    tier: 3,
    tags: ['machinery'],
    strategySummary: 'Khoa học quản lý giúp tối ưu tư bản và tăng nhẹ sức cạnh tranh.'
  },
  {
    id: 'cap_blacklist',
    faction: 'capitalist',
    name: 'Danh Sách Đen',
    description: 'Trao đổi danh sách những kẻ cầm đầu đình công với các chủ xưởng khác để cấm cửa chúng.',
    effects: {
      conflictRate: -15,
      classConsciousness: -12,
      reputation: -10,
    },
    weight: 75,
    minTurn: 4,
    tier: 4,
    tags: ['exploitation'],
    strategySummary: 'Đàn áp triệt để mầm mống chống đối, đổi lại bằng việc suy giảm uy tín.'
  },
  {
    id: 'cap_piece_rate',
    faction: 'capitalist',
    name: 'Khoán Theo Sản Phẩm',
    description: 'Trả lương theo số lượng thành phẩm thay vì trả theo giờ, vắt kiệt sức lao động.',
    effects: {
      workerHealth: -8,
      marketShare: 8,
      conflictRate: 10,
    },
    weight: 85,
    minTurn: 2,
    tier: 2,
    tags: ['exploitation'],
    strategySummary: 'Thúc đẩy năng suất tối đa thông qua áp lực, đánh đổi bằng sức khỏe và sự phẫn nộ.'
  },
  {
    id: 'cap_trade_fair',
    faction: 'capitalist',
    name: 'Hội Chợ Thương Mại',
    description: 'Tổ chức triển lãm sản phẩm dệt may xa xỉ thu hút giới quý tộc tham gia.',
    effects: {
      capital: -700,
      marketShare: 18,
      reputation: 8,
    },
    weight: 70,
    minTurn: 5,
    tier: 5,
    tags: ['marketing'],
    strategySummary: 'Tốn kém ngân quỹ lớn để thu về thị phần khổng lồ và đánh bóng tên tuổi.'
  },
  {
    id: 'cap_newspaper_ad',
    faction: 'capitalist',
    name: 'Quảng Cáo Báo Chí',
    description: 'Mua các trang quảng cáo lớn trên tờ The Times để định hình xu hướng tiêu dùng.',
    effects: {
      capital: -500,
      marketShare: 10,
      reputation: 12,
    },
    weight: 90,
    minTurn: 2,
    tier: 2,
    tags: ['marketing'],
    strategySummary: 'Chiến dịch truyền thông nhằm kích cầu và củng cố danh tiếng thương hiệu.'
  },
  {
    id: 'cap_technical_school',
    faction: 'capitalist',
    name: 'Trường Kỹ Thuật',
    description: 'Tài trợ mở trường đào tạo kỹ năng nghề cho thợ dệt, giúp họ vận hành máy phức tạp.',
    effects: {
      capital: -800,
      constantCapital: 400,
      workerHealth: 8,
      classConsciousness: 5,
    },
    weight: 65,
    minTurn: 3,
    tier: 3,
    tags: ['education', 'machinery'],
    strategySummary: 'Nâng cao trình độ công nhân (tăng ý thức), giúp vận hành máy móc an toàn hơn.'
  }
];

export const workerCards: Card[] = [
  {
    id: 'wrk_secret_pamphlet',
    faction: 'worker',
    name: 'Truyền Đơn Bí Mật',
    description: 'Phân phát truyền đơn kêu gọi công nhân đoàn kết đòi quyền lợi lúc tan ca.',
    effects: {
      classConsciousness: 15,
      solidarityNetwork: 10,
      conflictRate: 5,
    },
    weight: 100,
    minTurn: 0,
    tier: 1,
    tags: ['reformist'],
    strategySummary: 'Tuyên truyền rải truyền đơn giúp gia tăng mạnh ý thức đấu tranh và mạng lưới liên kết.'
  },
  {
    id: 'wrk_mutual_fund',
    faction: 'worker',
    name: 'Quỹ Tương Trợ',
    description: 'Quyên góp một phần lương nhỏ để lập quỹ hỗ trợ các gia đình công nhân ốm đau.',
    effects: {
      unionFund: 400,
      workerHealth: 10,
      solidarityNetwork: 10,
    },
    weight: 90,
    minTurn: 0,
    tier: 1,
    tags: ['mutualaid'],
    strategySummary: 'Góp quỹ giúp bảo vệ sức khỏe công nhân, tích lũy Quỹ để chuẩn bị đối đầu lâu dài.'
  },
  {
    id: 'wrk_connect_neighbors',
    faction: 'worker',
    name: 'Kết Nối Xưởng Bạn',
    description: 'Tạo liên kết với công nhân các xưởng dệt lân cận để chuẩn bị hành động chung.',
    effects: {
      solidarityNetwork: 15,
      classConsciousness: 5,
      conflictRate: 10,
    },
    weight: 80,
    minTurn: 0,
    tier: 1,
    tags: ['mutualaid'],
    strategySummary: 'Mở rộng mạng lưới đoàn kết liên xưởng dệt, tăng sức ép xung đột lên chủ xưởng.'
  },
  {
    id: 'wrk_warning_strike',
    faction: 'worker',
    name: 'Đình Công Cảnh Cáo',
    description: 'Tổ chức bãi công ngắn hạn trong 1 ngày để gửi tối hậu thư lên ban quản lý.',
    effects: {
      conflictRate: 20,
      marketShare: -10,
      solidarityNetwork: 10,
      unionFund: -200,
    },
    weight: 70,
    minTurn: 1,
    tier: 2,
    tags: ['militant'],
    strategySummary: 'Đình công ngắn làm sụt giảm thị phần của chủ xưởng, tiêu hao chút Quỹ công đoàn.'
  },
  {
    id: 'wrk_negotiations',
    faction: 'worker',
    name: 'Thương Lượng Ôn Hòa',
    description: 'Cử đại diện gặp chủ xưởng dệt để đàm phán tăng lương cơ bản.',
    effects: {
      conflictRate: -15,
      variableCapital: 300,
      classConsciousness: 10,
    },
    weight: 85,
    minTurn: 0,
    tier: 1,
    tags: ['reformist'],
    strategySummary: 'Đàm phán ôn hòa đòi tăng lương cơ bản (v tăng) và xoa dịu mâu thuẫn xã hội.'
  },
  {
    id: 'wrk_sabotage_gears',
    faction: 'worker',
    name: 'Phá Hủy Trục Quay',
    description: 'Bí mật làm hỏng trục quay bánh răng của máy dệt để phản đối sa thải công nhân.',
    effects: {
      constantCapital: -600,
      conflictRate: 25,
      marketShare: -8,
      classConsciousness: 12,
    },
    weight: 60,
    minTurn: 3,
    tier: 3,
    tags: ['militant'],
    strategySummary: 'Phá hoại máy móc (c giảm) làm sụt giảm trực tiếp tư bản của chủ, khơi dậy ý chí.'
  },
  {
    id: 'wrk_underground_press',
    faction: 'worker',
    name: 'Nhà In Bí Mật',
    description: 'Góp vốn thành lập nhà in độc lập để phát hành tờ báo tiếng nói giai cấp lao động.',
    effects: {
      unionFund: -300,
      classConsciousness: 20,
      solidarityNetwork: 15,
    },
    weight: 60,
    minTurn: 4,
    tier: 4,
    tags: ['reformist'],
    strategySummary: 'Chi quỹ lập nhà in riêng giúp tăng vượt trội ý thức giác ngộ và mạng lưới đoàn kết.'
  },
  {
    id: 'wrk_strike_all',
    faction: 'worker',
    name: 'Tổng Bãi Công Xưởng',
    description: 'Hạ còi, ngừng lò dệt toàn phần. Chấp nhận hy sinh thu nhập để đòi hỏi quyền lợi cốt lõi.',
    effects: {
      conflictRate: 35,
      marketShare: -20,
      unionFund: -500,
      workerHealth: -5,
      solidarityNetwork: 20,
    },
    weight: 50,
    minTurn: 6,
    tier: 5,
    tags: ['militant'],
    strategySummary: 'Hành động tối cao! Đánh sập thị phần của chủ xưởng, đòi hỏi tiêu tốn nhiều Quỹ công đoàn.'
  },
  {
    id: 'wrk_press_expose',
    faction: 'worker',
    name: 'Tố Cáo Báo Chí',
    description: 'Viết thư tố cáo điều kiện bụi bông và bóc lột trẻ em gửi tới báo chí tự do.',
    effects: {
      reputation: -15,
      classConsciousness: 12,
      solidarityNetwork: 8,
    },
    weight: 80,
    minTurn: 2,
    tier: 2,
    tags: ['reformist'],
    strategySummary: 'Hủy hoại danh tiếng xã hội của chủ xưởng dệt dệt, khơi gợi ý thức công lý cho công nhân.'
  },
  {
    id: 'wrk_coop_store',
    faction: 'worker',
    name: 'Cửa Hàng Hợp Tác Xã',
    description: 'Mua sỉ nhu yếu phẩm để bán lại cho công nhân với giá gốc không lợi nhuận.',
    effects: {
      unionFund: -300,
      workerHealth: 12,
      solidarityNetwork: 15,
    },
    weight: 70,
    minTurn: 3,
    tier: 3,
    tags: ['mutualaid'],
    strategySummary: 'Trích quỹ hỗ trợ đời sống, giúp hồi phục sức khỏe công nhân và thắt chặt đoàn kết.'
  },
  {
    id: 'wrk_petition_parliament',
    faction: 'worker',
    name: 'Thỉnh Nguyện Nghị Viện',
    description: 'Ký tên tập thể gửi thỉnh nguyện thư đòi siết chặt giám sát Luật nhà máy mới.',
    effects: {
      unionFund: -150,
      reputation: -5,
      conflictRate: -10,
      classConsciousness: 8,
    },
    weight: 85,
    minTurn: 1,
    tier: 2,
    tags: ['reformist'],
    strategySummary: 'Gửi thỉnh nguyện thư giúp hạ nhiệt mâu thuẫn xã hội và tăng uy thế công đoàn.'
  },
  {
    id: 'wrk_go_slow',
    faction: 'worker',
    name: 'Đấu Tranh Lãn Công',
    description: 'Thống nhất làm việc chậm rãi, tỉ mỉ đúng kỹ thuật để giảm sản lượng xuất xưởng của chủ.',
    effects: {
      marketShare: -5,
      conflictRate: 10,
      workerHealth: 5,
      classConsciousness: 8,
    },
    weight: 80,
    minTurn: 2,
    tier: 2,
    tags: ['militant'],
    strategySummary: 'Chậm nhịp sản xuất để bào mòn thị phần của chủ xưởng mà không lo bị khép tội bãi công.'
  },
  {
    id: 'wrk_strike_picket',
    faction: 'worker',
    name: 'Hàng Rào Bãi Công',
    description: 'Lập chốt ngăn chặn những kẻ phản bội tìm cách chui vào làm việc thế chân lúc đình công.',
    effects: {
      conflictRate: 18,
      marketShare: -12,
      solidarityNetwork: 12,
      unionFund: -100,
    },
    weight: 70,
    minTurn: 4,
    tier: 4,
    tags: ['militant'],
    strategySummary: 'Bảo vệ thành quả đình công, tăng đoàn kết và gia tăng áp lực đình trệ sản xuất.'
  },
  {
    id: 'wrk_education_circle',
    faction: 'worker',
    name: 'Lớp Học Ánh Sáng',
    description: 'Tổ chức lớp học xóa mù chữ và bình luận thời sự xã hội cho thợ dệt sau giờ làm.',
    effects: {
      unionFund: -150,
      classConsciousness: 15,
      solidarityNetwork: 10,
    },
    weight: 85,
    minTurn: 1,
    tier: 2,
    tags: ['reformist'],
    strategySummary: 'Nâng cao dân trí công đoàn giúp nâng tầm ý thức giai cấp và thắt chặt tình liên đới.'
  },
  {
    id: 'wrk_sick_fund',
    faction: 'worker',
    name: 'Quỹ Ốm Đau',
    description: 'Trích quỹ công đoàn để chi trả viện phí cho các anh em công nhân bị tai nạn lao động.',
    effects: {
      unionFund: -200,
      workerHealth: 18,
      solidarityNetwork: 8,
    },
    weight: 85,
    minTurn: 1,
    tier: 2,
    tags: ['mutualaid'],
    strategySummary: 'Dùng quỹ bảo trợ sức khỏe, một phần không thể thiếu để duy trì cuộc chiến lâu dài.'
  },
  {
    id: 'wrk_housing_coop',
    faction: 'worker',
    name: 'Nhà Ở Hợp Tác',
    description: 'Cùng nhau thuê lại khu tập thể, cải tạo vệ sinh phòng dịch tả và chia sẻ chi phí.',
    effects: {
      unionFund: -400,
      workerHealth: 15,
      solidarityNetwork: 12,
    },
    weight: 60,
    minTurn: 4,
    tier: 4,
    tags: ['mutualaid'],
    strategySummary: 'Khoản đầu tư lớn vì cộng đồng, cải thiện mạnh mẽ sức khỏe và mạng lưới tương trợ.'
  },
  {
    id: 'wrk_march_parliament',
    faction: 'worker',
    name: 'Tuần Hành Nghị Viện',
    description: 'Tổ chức biểu tình quy mô lớn kéo lên London yêu cầu thông qua đạo luật giới hạn giờ làm.',
    effects: {
      conflictRate: 22,
      classConsciousness: 10,
      solidarityNetwork: 8,
    },
    weight: 70,
    minTurn: 5,
    tier: 5,
    tags: ['militant'],
    strategySummary: 'Phô trương sức mạnh bạo liệt, khuấy động mạnh mẽ tình hình chính trị xã hội.'
  },
  {
    id: 'wrk_barricade',
    faction: 'worker',
    name: 'Dựng Chướng Ngại',
    description: 'Chặn đường vận chuyển than và nguyên liệu bông vào xưởng dệt.',
    effects: {
      conflictRate: 28,
      marketShare: -15,
      unionFund: -300,
    },
    weight: 65,
    minTurn: 6,
    tier: 5,
    tags: ['militant'],
    strategySummary: 'Hành động chặn đứng kinh tế của chủ, đánh đổi bằng quỹ công đoàn để duy trì chốt chặn.'
  },
  {
    id: 'wrk_legal_defense',
    faction: 'worker',
    name: 'Quỹ Pháp Lý',
    description: 'Thuê luật sư bảo vệ cho các lãnh đạo công đoàn bị bắt giữ vô cớ.',
    effects: {
      unionFund: -250,
      conflictRate: -12,
      classConsciousness: 10,
    },
    weight: 80,
    minTurn: 3,
    tier: 3,
    tags: ['reformist'],
    strategySummary: 'Bảo vệ phong trào thông qua pháp luật, giảm nhẹ đối đầu trực diện.'
  },
  {
    id: 'wrk_worker_newspaper',
    faction: 'worker',
    name: 'Báo Công Nhân',
    description: 'In ấn bản tin phát hàng tuần phơi bày mặt trái của giới chủ xưởng.',
    effects: {
      unionFund: -200,
      classConsciousness: 18,
      reputation: -8,
    },
    weight: 75,
    minTurn: 4,
    tier: 4,
    tags: ['reformist'],
    strategySummary: 'Vũ khí tư tưởng lợi hại, lan tỏa ý thức đấu tranh và bóc trần bộ mặt giới chủ.'
  },
  {
    id: 'wrk_literacy_campaign',
    faction: 'worker',
    name: 'Chiến Dịch Xóa Mù Chữ',
    description: 'Dạy chữ cái và cách đọc văn bản luật cơ bản cho toàn bộ thành viên.',
    effects: {
      unionFund: -200,
      classConsciousness: 20,
      solidarityNetwork: 12,
    },
    weight: 80,
    minTurn: 2,
    tier: 2,
    tags: ['education', 'reformist'],
    strategySummary: 'Khai trí công nhân, tạo nền tảng vững chắc nhất cho ý thức và tinh thần đoàn kết.'
  }
];

export const cardPool: Card[] = [...capitalistCards, ...workerCards];

// Apply Foil (+50% all effects) to a card
export function applyFoilToCard(card: Card): Card {
  const boostedEffects: Partial<Record<keyof import('../types/economy').TurnState, number>> = {};
  for (const [key, val] of Object.entries(card.effects)) {
    if (typeof val === 'number') {
      boostedEffects[key as keyof import('../types/economy').TurnState] = Math.round(val * 1.5);
    }
  }
  return { ...card, effects: boostedEffects, isFoil: true };
}

// Shop odds based on player level (Tiers 1 to 5 probabilities)
export function getShopOdds(level: number): [number, number, number, number, number] {
  switch (level) {
    case 3: return [75, 25, 0, 0, 0];
    case 4: return [55, 30, 15, 0, 0];
    case 5: return [45, 33, 20, 2, 0];
    case 6: return [35, 35, 25, 5, 0];
    case 7: return [20, 30, 35, 14, 1];
    case 8: return [15, 20, 35, 25, 5];
    case 9: return [10, 15, 30, 30, 15];
    default: return [100, 0, 0, 0, 0];
  }
}

export function getRandomCards(faction: 'capitalist' | 'worker', currentTurn: number, playerLevel: number = 3): Card[] {
  const odds = getShopOdds(playerLevel);
  const selected: Card[] = [];
  const factionPool = cardPool.filter(c => c.faction === faction && currentTurn >= c.minTurn);

  for (let i = 0; i < 3; i++) {
    // 1. Roll for tier
    const roll = Math.random() * 100;
    let targetTier = 1;
    let sum = 0;
    for (let t = 0; t < 5; t++) {
      sum += odds[t];
      if (roll <= sum) {
        targetTier = t + 1;
        break;
      }
    }

    // 2. Filter pool by target tier and exclude already selected cards
    let validPool = factionPool.filter(c => c.tier === targetTier && !selected.find(s => s.id === c.id));

    // Fallback: if no valid card in that tier, grab any available card not selected
    if (validPool.length === 0) {
      validPool = factionPool.filter(c => !selected.find(s => s.id === c.id));
    }
    
    // If we've run out of all cards (unlikely but safe check)
    if (validPool.length === 0) break;

    // 3. Pick card from validPool using weights
    const totalWeight = validPool.reduce((wSum, c) => wSum + c.weight, 0);
    let randomVal = Math.random() * totalWeight;
    
    let chosenIdx = 0;
    for (let k = 0; k < validPool.length; k++) {
      randomVal -= validPool[k].weight;
      if (randomVal <= 0) {
        chosenIdx = k;
        break;
      }
    }
    
    // 4. Roll for Foil (8% chance)
    let chosenCard = validPool[chosenIdx];
    if (Math.random() < 0.08) {
      chosenCard = applyFoilToCard(chosenCard);
    }

    selected.push(chosenCard);
  }

  return selected;
}
