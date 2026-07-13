import React from 'react';
import { X, BookOpen, Briefcase, Users, TrendingUp, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GameRulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1C1814] border border-leather-brown/30 w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-leather-brown/20 flex justify-between items-center bg-wood-dark/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brass-polished" />
            <h2 className="text-xl font-serif font-bold text-brass-polished uppercase tracking-widest">Luật Chơi & Hướng Dẫn</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-paper-aged/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar text-paper-aged/90 font-sans text-sm md:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-amber-500 uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Tổng Quan
            </h3>
            <p>
              <strong>Vòng Xoáy Giá Trị Thặng Dư</strong> là tựa game thẻ bài chiến thuật pha trộn yếu tố mô phỏng kinh tế. Bạn sẽ lựa chọn một trong hai phe: <strong>Nhà Tư Bản</strong> hoặc <strong>Thủ Lĩnh Công Nhân</strong> trong bối cảnh Cách Mạng Công Nghiệp thế kỷ 19 tại Manchester. Trò chơi diễn ra qua nhiều vòng (lượt) đại diện cho các mốc thời gian lịch sử. Mỗi lượt bạn sẽ sử dụng tiền để mua các thẻ bài (Nhân sự, Công nghệ, Đạo luật, Chiến lược...) để gia tăng sức mạnh cho phe mình.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3 bg-brass-polished/5 p-4 rounded-xl border border-brass-polished/10">
              <h3 className="text-lg font-serif font-bold text-brass-polished uppercase flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Phe Tư Bản
              </h3>
              <ul className="list-disc list-inside space-y-2 text-paper-aged/80">
                <li><strong>Mục tiêu:</strong> Tối đa hóa lợi nhuận, nâng cấp máy móc và kiểm soát mâu thuẫn xã hội.</li>
                <li><strong>Cách thắng (Lượt 15):</strong> Tích lũy <strong>Vốn ≥ 28,000 £</strong> <em>và</em> duy trì <strong>Sức khỏe công nhân ≥ 50%</strong> <em>và</em> chiếm lĩnh <strong>Thị phần ≥ 65%</strong> để khẳng định độc quyền tư bản.</li>
                <li><strong>Thất bại:</strong> Vốn về 0, hoặc Mâu thuẫn đạt 100 gây bạo loạn mất kiểm soát, hoặc công nhân thắng trước.</li>
                <li><strong>Tài nguyên chính:</strong> £ (Bảng Anh) — tích lũy qua lợi nhuận, thị phần và lãi suất vốn.</li>
              </ul>
            </section>

            <section className="space-y-3 bg-iron-cold/5 p-4 rounded-xl border border-iron-cold/10">
              <h3 className="text-lg font-serif font-bold text-iron-cold uppercase flex items-center gap-2">
                <Users className="w-4 h-4" /> Phe Công Nhân
              </h3>
              <ul className="list-disc list-inside space-y-2 text-paper-aged/80">
                <li><strong>Mục tiêu:</strong> Xây dựng phong trào, bảo vệ đời sống và giác ngộ giai cấp lao động.</li>
                <li><strong>Cách thắng (Lượt 15):</strong> Đạt đồng thời <strong>Quỹ Công đoàn ≥ 4,000 £</strong> + <strong>Mạng lưới Đoàn kết ≥ 70%</strong> + <strong>Ý thức Giai cấp ≥ 75%</strong>.</li>
                <li><strong>Thất bại:</strong> Sức khỏe công nhân về 0, Quỹ công đoàn cạn kiệt, hoặc tư bản thắng trước.</li>
                <li><strong>Tài nguyên chính:</strong> Quỹ Công Đoàn (Union Fund) — tích lũy qua đoàn phí và các thẻ tương trợ.</li>
              </ul>
            </section>
          </div>

          <section className="space-y-3 bg-[#251E19]/30 p-4 rounded-xl border border-leather-brown/15">
            <h3 className="text-lg font-serif font-bold text-amber-500 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Phân Phối Thẻ Bài & Mạ Vàng
            </h3>
            <div className="space-y-3 text-paper-aged/80 text-xs md:text-sm">
              <p><strong>1. Phân Cấp Thẻ Bài (Bậc 1 - 5):</strong> Thẻ bài được phân loại từ Bậc 1 đến Bậc 5 (thể hiện bằng chỉ số bậc ở đầu thẻ). Thẻ bậc càng cao thì hiệu số và năng lực tác động càng lớn. Nâng cấp Level của phe bạn để gia tăng tỉ lệ xuất hiện thẻ bậc cao trong Cửa hàng.</p>
              <p><strong>2. Thẻ Mạ Vàng (Foil - Tỉ lệ 8%):</strong> Mọi thẻ bài khi xuất hiện trong Cửa hàng đều có <strong>8% cơ hội ngẫu nhiên xuất hiện dưới dạng "Mạ Vàng"</strong>. Thẻ Mạ Vàng sẽ **tăng thêm 50% hiệu quả** của toàn bộ các chỉ số có ích (chỉ số thay đổi có lợi cho phe của bạn) của thẻ đó.</p>
              <p><strong>3. Trường Phái Hợp Lực (Combo Tags):</strong> Các thẻ bài mang những nhãn đặc trưng (Cơ khí, Bóc lột, Thương mại, Tương trợ, Đấu tranh, Cải cách, Giáo dục). Sưu tầm và kích hoạt nhiều thẻ có chung nhãn sẽ mở khóa các tầng hợp lực (synergy) cực kỳ mạnh mẽ giúp đảo ngược cục diện trận đấu.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-amber-500 uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Cơ Chế Cốt Lõi
            </h3>
            <div className="space-y-4 text-paper-aged/80">
              <p><strong>1. Cửa Hàng & Mua Thẻ:</strong> Mỗi lượt cửa hàng sẽ đưa ra 3 thẻ ngẫu nhiên. Bạn có thể dùng tiền (hoặc quỹ) để <strong>Làm mới Shop</strong> hoặc <strong>Mua Kinh Nghiệm (XP)</strong> để thăng cấp. Cấp độ càng cao, tỉ lệ xuất hiện thẻ xịn (Bậc 3, 4, 5) càng lớn.</p>
              
              <p><strong>2. Trường Phái Chiến Lược:</strong> Khi bạn mua nhiều thẻ có chung Trường phái (VD: Cơ Khí Hóa, Bạo Động, Tương Trợ...), bạn sẽ kích hoạt các mốc sức mạnh cộng dồn mạnh mẽ. Hãy xây dựng bộ bài có sự gắn kết!</p>
              
              <p><strong>3. Vòng Đấu & Sự Kiện:</strong> Khi hoàn tất việc mua sắm, bạn chọn <strong>Xác nhận kết thúc lượt</strong>. Hệ thống sẽ tự động mô phỏng kinh tế dựa trên các chỉ số hiện tại và thẻ bài bạn đã chọn. Thi thoảng sẽ xuất hiện các <strong>Sự kiện lịch sử</strong> hoặc cơ hội chọn <strong>Học Thuyết (Augment)</strong> giúp định hình lối chơi.</p>
              
              <p><strong>4. Xung Đột & Đình Công:</strong> Chỉ số <strong>Căng thẳng (Conflict)</strong> càng cao, nguy cơ nổ ra bãi công càng lớn. Bãi công sẽ làm ngưng trệ sản xuất, tiêu hao quỹ công đoàn, và có thể dẫn đến bạo loạn nếu không được giải quyết êm thấm.</p>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-leather-brown/20 bg-black/40 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-amber-600/20 hover:bg-amber-500/30 text-amber-500 font-bold uppercase tracking-wider rounded-lg border border-amber-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
