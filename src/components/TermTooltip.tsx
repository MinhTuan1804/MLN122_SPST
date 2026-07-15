import React from "react";

const TERMS: Record<string, string> = {
  "năm lịch sử":
    "Tiến trình thời gian của trò chơi. Mỗi lượt đại diện cho một khoảng thời gian lịch sử.",
  "tích lũy tư bản":
    "Tổng tài sản (Capital) đại diện cho sức mạnh kinh tế của phe Tư bản. Mục tiêu là tối đa hóa chỉ số này.",
  "ngân quỹ tư bản":
    "Tổng tài sản (Capital) đại diện cho sức mạnh kinh tế của phe Tư bản. Mục tiêu là tối đa hóa chỉ số này.",
  capital:
    "Tổng tài sản (Capital) đại diện cho sức mạnh kinh tế của phe Tư bản. Mục tiêu là tối đa hóa chỉ số này.",
  "tư bản bất biến":
    "Tư bản bất biến (c): Giá trị tư liệu sản xuất (máy móc, nhà xưởng). Tăng năng suất nhưng đòi hỏi chi phí bảo trì.",
  "tư bản bất biến (c)":
    "Tư bản bất biến (c): Giá trị tư liệu sản xuất (máy móc, nhà xưởng). Tăng năng suất nhưng đòi hỏi chi phí bảo trì.",
  "máy móc & vật tư":
    "Giá trị tư liệu sản xuất (máy móc, nhà xưởng). Tăng năng suất nhưng đòi hỏi chi phí bảo trì.",
  "tư bản khả biến":
    "Tư bản khả biến (v): Quỹ lương trả cho công nhân. Là cơ sở để bóc lột Giá trị thặng dư.",
  "tư bản khả biến (v)":
    "Tư bản khả biến (v): Quỹ lương trả cho công nhân. Là cơ sở để bóc lột Giá trị thặng dư.",
  "quỹ lương công nhân":
    "Quỹ lương trả cho công nhân. Là cơ sở để bóc lột Giá trị thặng dư.",
  "giá trị sức lao động":
    "Tư bản khả biến (v): Quỹ lương trả cho công nhân. Nền tảng duy trì mức sống và sức khỏe của công nhân.",
  "quỹ tiêu dùng":
    "Lương trả cho công nhân. Nền tảng duy trì mức sống và sức khỏe của công nhân.",
  "giá trị thặng dư":
    "Phần lợi nhuận dư ra sau khi trừ chi phí nhân công. Dùng để tái đầu tư và gia tăng Tư bản.",
  "giá trị thặng dư (m)":
    "Phần lợi nhuận dư ra sau khi trừ chi phí nhân công. Dùng để tái đầu tư và gia tăng Tư bản.",
  "thặng dư tạo ra":
    "Phần lợi nhuận dư ra sau khi trừ chi phí nhân công. Dùng để tái đầu tư và gia tăng Tư bản.",
  "surplus value":
    "Phần lợi nhuận dư ra sau khi trừ chi phí nhân công. Dùng để tái đầu tư và gia tăng Tư bản.",
  "tỷ suất bóc lột":
    "Tỷ suất Giá trị thặng dư (m'). Cho biết Tư bản bóc lột bao nhiêu phần trăm từ lao động thặng dư của công nhân.",
  "tỷ suất bóc lột (m')":
    "Tỷ suất Giá trị thặng dư (m'). Cho biết Tư bản bóc lột bao nhiêu phần trăm từ lao động thặng dư của công nhân.",
  "tỷ suất thặng dư":
    "Tỷ suất Giá trị thặng dư (m'). Cho biết Tư bản bóc lột bao nhiêu phần trăm từ lao động thặng dư của công nhân.",
  "tỷ suất thặng dư (m')":
    "Tỷ suất Giá trị thặng dư (m'). Cho biết Tư bản bóc lột bao nhiêu phần trăm từ lao động thặng dư của công nhân.",
  "tỷ suất lợi nhuận":
    "Tỷ suất lợi nhuận (p') = m / (c + v). Đo lường hiệu quả sinh lời trên tổng tư bản đầu tư. Thường giảm khi máy móc (c) tăng nhanh hơn nhân công (v) (Quy luật tỷ suất lợi nhuận có xu hướng giảm).",
  "tỷ suất lợi nhuận (p')":
    "Tỷ suất lợi nhuận (p') = m / (c + v). Đo lường hiệu quả sinh lời trên tổng tư bản đầu tư. Thường giảm khi máy móc (c) tăng nhanh hơn nhân công (v) (Quy luật tỷ suất lợi nhuận có xu hướng giảm).",
  "áp bức giai cấp":
    "Mức độ bóc lột. Chỉ số này càng cao, Tư bản càng lời nhưng Mâu thuẫn sẽ tăng rất nhanh.",
  "mức khai thác":
    "Mức độ bóc lột công nhân. Chỉ số này càng cao, lợi nhuận càng lớn nhưng nguy cơ Bãi công càng cao.",
  "cấu tạo hữu cơ":
    "Tỷ lệ giữa máy móc (c) và nhân công (v). Tỷ lệ cao nghĩa là dùng nhiều máy móc hơn người, tăng lợi nhuận dài hạn nhưng dễ gây phẫn nộ.",
  "quỹ tương tế":
    "Ngân quỹ (Union Fund) của Công đoàn dùng để mua thẻ và duy trì các cuộc bãi công.",
  "quỹ công đoàn":
    "Ngân quỹ (Union Fund) của Công đoàn dùng để mua thẻ, tài trợ sự kiện và duy trì bãi công.",
  "union fund":
    "Ngân quỹ (Union Fund) của Công đoàn dùng để mua thẻ và duy trì các cuộc bãi công.",
  "xung đột":
    "Mức độ căng thẳng (Conflict Rate). Khi chỉ số này >= 75%, bãi công (Strike) sẽ bùng nổ.",
  "căng thẳng":
    "Mức độ căng thẳng (Conflict Rate). Khi chỉ số này >= 75%, bãi công (Strike) sẽ bùng nổ.",
  "conflict rate":
    "Mức độ căng thẳng (Conflict Rate). Khi chỉ số này >= 75%, bãi công (Strike) sẽ bùng nổ.",
  "ý thức giai cấp":
    "Sự giác ngộ của công nhân. Giảm sự bóc lột của Tư bản và tăng tiền đóng góp Quỹ Công đoàn. Nếu đạt 100% sẽ khởi nghĩa.",
  "mạng lưới đoàn kết":
    "Khả năng liên kết công nhân. Tăng tiền đóng góp Quỹ Công đoàn và tự sinh lời quỹ mỗi lượt.",
  "sức khỏe":
    "Thể trạng của công nhân. Nếu giảm xuống 0, phong trào đấu tranh sẽ sụp đổ.",
  health:
    "Thể trạng của công nhân. Nếu giảm xuống 0, phong trào đấu tranh sẽ sụp đổ.",
  "độc quyền thị trường":
    "Tỷ lệ phần trăm thị phần sản xuất dệt mà nhà tư bản cần chiếm lĩnh (đạt tối thiểu 65%) ở lượt 15 để khẳng định vị thế độc quyền kiểm soát giá cả.",
  "thị phần":
    "Độ bao phủ thị trường của Tư bản. Ảnh hưởng trực tiếp đến doanh thu và uy tín.",
  "ngân quỹ tích lũy (capital)":
    "Tổng tài sản (Capital) đại diện cho sức mạnh kinh tế của phe Tư bản. Mục tiêu là tối đa hóa chỉ số này.",
  "ngân quỹ tích lũy":
    "Tổng tài sản (Capital) đại diện cho sức mạnh kinh tế của phe Tư bản. Mục tiêu là tối đa hóa chỉ số này.",
  "tích lũy vốn":
    "Tổng tài sản (Capital) đại diện cho sức mạnh kinh tế của phe Tư bản. Mục tiêu là tối đa hóa chỉ số này.",
  "máy móc & thiết bị (c)":
    "Tư bản bất biến (c): Giá trị tư liệu sản xuất (máy móc, nhà xưởng). Tăng năng suất nhưng đòi hỏi chi phí bảo trì.",
  "chi phí quỹ lương (v)":
    "Tư bản khả biến (v): Quỹ lương trả cho công nhân. Là cơ sở để bóc lột Giá trị thặng dư.",
  "chi phí quỹ lương":
    "Tư bản khả biến (v): Quỹ lương trả cho công nhân. Là cơ sở để bóc lột Giá trị thặng dư.",
  "thị phần sản xuất":
    "Độ bao phủ thị trường của Tư bản. Ảnh hưởng trực tiếp đến doanh thu và uy tín.",
  "mức độ mâu thuẫn":
    "Mức độ căng thẳng (Conflict Rate). Khi chỉ số này >= 75%, bãi công (Strike) sẽ bùng nổ.",
  "danh tiếng xã hội":
    "Độ tín nhiệm trước Nghị viện và giới tư bản lân cận, quyết định khả năng thương lượng xã hội.",
  "danh tiếng":
    "Độ tín nhiệm trước Nghị viện và giới tư bản lân cận, quyết định khả năng thương lượng xã hội.",
  "quỹ đấu tranh công đoàn":
    "Ngân quỹ (Union Fund) của Công đoàn dùng để mua thẻ, tài trợ sự kiện và duy trì bãi công.",
  "sức khỏe công nhân":
    "Thể trạng của công nhân. Nếu giảm xuống 0, phong trào đấu tranh sẽ sụp đổ.",
  "sức khỏe cn":
    "Thể trạng của công nhân. Nếu giảm xuống 0, phong trào đấu tranh sẽ sụp đổ.",
  "mạng lưới":
    "Khả năng liên kết công nhân. Tăng tiền đóng góp Quỹ Công đoàn và tự sinh lời quỹ mỗi lượt.",
  "Ý thức đấu tranh":
    "Sự giác ngộ của công nhân. Giảm sự bóc lột của Tư bản và tăng tiền đóng góp Quỹ Công đoàn. Nếu đạt 100% sẽ khởi nghĩa.",
};

interface TermTooltipProps {
  text: string;
  className?: string;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({
  text,
  className,
}) => {
  // Extract all keys, sort by length descending to match longer phrases first
  const keys = Object.keys(TERMS).sort((a, b) => b.length - a.length);
  // Escape parentheses for regex
  const escapedKeys = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escapedKeys.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        if (TERMS[lowerPart]) {
          return (
            <span
              key={i}
              className={`relative group/term inline-block cursor-help ${className || "text-amber-500/90 hover:text-amber-400"} underline decoration-dotted decoration-amber-500/50 underline-offset-2`}
            >
              {part}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs font-sans text-paper-aged bg-[#1C1814] border border-leather-brown/40 rounded-lg shadow-xl opacity-0 group-hover/term:opacity-100 pointer-events-none transition-opacity z-[100] text-center leading-relaxed font-normal">
                {TERMS[lowerPart]}
                {/* Pointer arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#1C1814] border-t-4 border-x-transparent border-x-4 border-b-0" />
              </span>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};
