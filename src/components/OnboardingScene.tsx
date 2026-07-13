import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowRight, Coins, Users, Settings, AlertTriangle, Landmark, Skull } from 'lucide-react';
import { AdvisorSelectModal } from './AdvisorSelectModal';
import { StatusGauge } from './StatusGauge';
import { mapToDisplayIndicators } from '../data/displayMapping';
import { getInitialTurnState } from '../logic/economyFormulas';

export const OnboardingScene: React.FC = () => {
  const { faction } = useGameStore();
  const [step, setStep] = useState<'intro' | 'rules' | 'advisor'>('intro');
  
  // Starting indicators for onboarding preview
  const initialOnboardState = getInitialTurnState();

  const displayIndicators = mapToDisplayIndicators(initialOnboardState, faction || 'capitalist');

  const getFactionColors = () => {
    if (faction === 'capitalist') {
      return {
        primary: 'text-brass-polished border-brass-polished hover:bg-brass-polished/10',
        bg: 'bg-brass-polished',
        accent: 'border-brass-polished/30',
        cardBg: 'hover:border-brass-polished/50 bg-[#29221B]/60',
      };
    }
    return {
      primary: 'text-iron-cold border-iron-cold hover:bg-iron-cold/10',
      bg: 'bg-iron-cold',
      accent: 'border-iron-cold/30',
      cardBg: 'hover:border-iron-cold/50 bg-[#202528]/60',
    };
  };

  const colors = getFactionColors();

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 max-w-4xl mx-auto">
      
      {/* HUD Bar Preview - Always visible during onboarding */}
      <div className="w-full grid grid-cols-3 gap-3 md:gap-6 mb-8">
        <StatusGauge
          label="Sức mạnh kinh tế"
          value={displayIndicators.economicPower}
          type="economic"
          icon={<Coins className="w-5 h-5 text-brass-polished" />}
        />
        <StatusGauge
          label="Áp lực guồng máy"
          value={displayIndicators.enginePressure}
          type="pressure"
          icon={<Settings className="w-5 h-5 text-fire-rebellion" />}
        />
        <StatusGauge
          label="Sức bền xã hội"
          value={displayIndicators.socialDurability}
          type="social"
          icon={<Users className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Main Interactive Box */}
      <div className="w-full bg-[#1C1814] woodcut-border p-6 md:p-8 rounded-xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-leather-brown/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-leather-brown/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-leather-brown/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-leather-brown/40" />

        {step === 'intro' && (
          <div className="space-y-6 text-left">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-serif text-brass-polished tracking-wide">
                Luật Chơi & Mục Tiêu Trận Đấu
              </h2>
              <p className="text-sm italic text-paper-aged/80 leading-relaxed max-w-2xl mx-auto font-sans mt-2">
                Chào mừng bạn đến với nước Anh thế kỷ 19. Hãy hiểu rõ luật chơi trước khi bước vào xưởng dệt!
              </p>
            </div>

            {/* Faction Rules Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              {/* Capitalist Section */}
              <div className="p-4 rounded-lg bg-[#29221B]/40 border border-brass-polished/20 space-y-2.5">
                <h4 className="font-serif font-bold text-sm text-brass-polished uppercase tracking-wide border-b border-brass-polished/10 pb-1">
                  Phe Nhà Tư Bản (Capitalist)
                </h4>
                <ul className="text-xs text-paper-aged/90 space-y-1.5 list-disc pl-4 font-sans">
                  <li><strong>Mục tiêu:</strong> Tích lũy Vốn ≥ <strong className="text-brass-polished">28,000 £</strong>, duy trì Sức khỏe CN ≥ <strong className="text-brass-polished">50%</strong> <em>và</em> chiếm lĩnh <strong className="text-brass-polished">Thị phần ≥ 65%</strong> ở lượt 15.</li>
                  <li><strong>Chiến thuật:</strong> Đầu tư máy móc hơi nước nâng cao năng suất và bóp nghẹt chi phí quỹ lương để tối đa hóa tỷ suất thặng dư.</li>
                  <li><strong>Rủi ro:</strong> Bóc lột quá mức khiến Sức khỏe công nhân kiệt quệ và làm bùng phát Mâu thuẫn xã hội.</li>
                </ul>
              </div>

              {/* Worker Section */}
              <div className="p-4 rounded-lg bg-[#202528]/40 border border-iron-cold/20 space-y-2.5">
                <h4 className="font-serif font-bold text-sm text-iron-cold uppercase tracking-wide border-b border-iron-cold/10 pb-1">
                  Phe Thủ Lĩnh Công Nhân (Labor Leader)
                </h4>
                <ul className="text-xs text-paper-aged/90 space-y-1.5 list-disc pl-4 font-sans">
                  <li><strong>Mục tiêu:</strong> Tích lũy Quỹ Công đoàn đạt <strong className="text-iron-cold">4,000 £</strong>, Mạng lưới đoàn kết đạt ≥ <strong className="text-iron-cold">70%</strong> và Ý thức giai cấp đạt ≥ <strong className="text-iron-cold">75%</strong> ở lượt 15.</li>
                  <li><strong>Chiến thuật:</strong> Phát truyền đơn tăng ý thức giác ngộ giai cấp, tích lũy quỹ tương tế để bảo vệ sức khỏe và liên kết nghiệp đoàn.</li>
                  <li><strong>Vũ khí:</strong> Sử dụng các cuộc đình công, bãi công để ép chủ xưởng phải nâng cao đơn giá lương cơ bản.</li>
                </ul>
              </div>
            </div>

            {/* Mechanics Guidelines */}
            <div className="p-4 rounded-lg bg-wood-dark/50 border border-leather-brown/15 space-y-3 font-sans text-xs">
              <h4 className="font-serif font-bold text-xs uppercase text-paper-aged/90 tracking-wide border-b border-leather-brown/10 pb-1">
                Các Cơ Chế Cốt Lõi Cần Nhớ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-red-400 font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Đình Công Tự Phát
                  </span>
                  Khi mâu thuẫn xã hội (Áp lực guồng máy) chạm mốc <strong>≥ 75%</strong>, công nhân tự động bãi công làm ngưng trệ hoàn toàn thặng dư (bằng 0) và làm hao mòn máy móc.
                </div>
                <div>
                  <span className="text-yellow-400 font-bold flex items-center gap-1.5 mb-1">
                    <Landmark className="w-3.5 h-3.5 shrink-0" /> Đạo Luật Lịch Sử & Sự Kiện
                  </span>
                  Tại các mốc lượt (3, 6, 9, 12, 15), Nghị viện sẽ đưa ra các Đạo luật lịch sử và đôi khi có những sự kiện ngẫu nhiên ập đến. Mỗi phe sẽ có những chiến lược đối phó riêng rẽ dựa trên nguồn lực của mình.
                </div>
                <div>
                  <span className="text-red-500 font-bold flex items-center gap-1.5 mb-1">
                    <Skull className="w-3.5 h-3.5 shrink-0" /> Thua Cuộc Sớm
                  </span>
                  Nhà Tư Bản phá sản nếu Vốn <strong>≤ 1,000 £</strong>. Nổi dậy vô tổ chức bùng nổ dẫn tới thất bại nếu Sức khỏe công nhân <strong>≤ 10%</strong> hoặc Mâu thuẫn xã hội vượt quá <strong>≥ 95%</strong>.
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setStep('advisor')}
                className={`px-8 py-3.5 font-serif font-bold uppercase tracking-wider border rounded transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer ${colors.primary}`}
              >
                Tiếp tục: Chọn Cố Vấn Lịch Sử <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'advisor' && (
          <div className="absolute inset-0 z-50">
            <AdvisorSelectModal />
          </div>
        )}

      </div>
    </div>
  );
};
