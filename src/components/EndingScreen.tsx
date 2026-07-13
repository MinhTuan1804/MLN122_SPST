import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { RotateCcw, Award, AlertTriangle, Scale, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EndingScreen: React.FC = () => {
  const {
    phase,
    endingType,
    restartGame,
    faction,
    currentTurnState
  } = useGameStore();

  const isEnding = phase === 'ending' && endingType !== null;

  useEffect(() => {
    if (isEnding) {
      // Trigger confetti if it is a positive outcome for the player's faction
      const isWinner = 
        (faction === 'capitalist' && endingType === 'victory_empire') ||
        (faction === 'worker' && endingType === 'labor_triumph') ||
        (endingType === 'compromise');
      
      if (isWinner) {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
      }
    }
  }, [isEnding, endingType, faction]);

  if (!isEnding) return null;

  const getEndingDetails = () => {
    switch (endingType) {
      case 'victory_empire':
        return {
          title: 'ĐẾ CHẾ CÔNG NGHIỆP THẮNG THẾ',
          icon: <Award className="w-16 h-16 text-brass-polished" />,
          color: 'text-brass-polished border-brass-polished/30',
          desc: 'Xưởng dệt của bạn vươn lên thành một trong những đế chế sản xuất dệt bông lớn nhất Lancashire. Lợi nhuận tích lũy dồi dào, máy móc chạy ngày đêm và vị thế giai cấp tư bản của bạn vững như bàn thạch.',
          question: '"Phát triển thành công nhưng đã trả giá gì?"',
        };
      case 'capitalist_doom':
        return {
          title: 'SỤP ĐỔ VÌ LÒNG THAM',
          icon: <AlertTriangle className="w-16 h-16 text-red-500" />,
          color: 'text-red-500 border-red-500/30',
          desc: 'Tỷ lệ khai thác thặng dư vượt quá giới hạn chịu đựng. Đỉnh điểm là một cuộc bãi công lớn làm tê liệt chuỗi bán hàng, tiếp theo là cháy lò dệt dập tắt hoàn toàn dòng vốn đầu tư. Xưởng dệt rơi vào phá sản.',
          question: '"Lợi nhuận không đi cùng ổn định?"',
        };
      case 'labor_triumph':
        return {
          title: 'CÔNG ĐOÀN THẮNG THẾ',
          icon: <Award className="w-16 h-16 text-iron-cold" />,
          color: 'text-iron-cold border-iron-cold/30',
          desc: 'Thông qua sự tổ chức chặt chẽ của mạng lưới liên kết và quỹ tương tế vững mạnh, công nhân dệt buộc ban quản lý ký cam kết tôn trọng mức lương tối thiểu và bảo đảm vệ sinh nhà xưởng.',
          question: '"Tổ chức tạo ra thay đổi thật?"',
        };
      case 'unorganized_rebellion':
        return {
          title: 'NỔI DẬY TỰ PHÁT THẤT BẠI',
          icon: <Flame className="w-16 h-16 text-red-600 animate-pulse" />,
          color: 'text-red-600 border-red-600/30',
          desc: 'Áp lực vận hành của máy móc và xung đột đạt đỉnh điểm, gây ra cuộc nổi bùng phát đập phá tự phát. Tuy nhiên, do thiếu quỹ công đoàn duy trì và kế hoạch dài hạn, quân đội hoàng gia đã can thiệp dập tắt đám đông.',
          question: '"Phẫn nộ không tổ chức dễ bị dập tắt?"',
        };
      case 'compromise':
      default:
        return {
          title: 'THỎA HIỆP LỊCH SỬ',
          icon: <Scale className="w-16 h-16 text-[#D4AF37]" />,
          color: 'text-brass-polished border-[#D4AF37]/30',
          desc: 'Cuộc đấu tranh dai dẳng kết thúc bằng một sự dung hòa lịch sử. Chủ xưởng chấp nhận cắt giảm bớt giờ làm theo quy định luật pháp, trong khi công đoàn cam kết không đình công tự phát nhằm bảo đảm thị phần dệt.',
          question: '"Đây có phải kết thúc thật sự?"',
        };
    }
  };

  const details = getEndingDetails();

  const getVideoBg = () => {
    if (endingType === 'victory_empire') return '/assets/videos/Capitalist%20Victory.mp4';
    if (endingType === 'labor_triumph') return '/assets/videos/Worker%20Victory.mp4';
    if (endingType === 'capitalist_doom' || endingType === 'unorganized_rebellion') {
      return '/assets/videos/Strike%20Event.mp4';
    }
    return null;
  };
  const videoSrc = getVideoBg();

  return (
    <div className="fixed inset-0 bg-[#0C0907]/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-md select-none">
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
        />
      )}
      <div className="w-full max-w-xl bg-[#1C1814]/95 backdrop-blur-md woodcut-border p-8 rounded-xl shadow-2xl space-y-6 text-center relative z-10">
        
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-leather-brown/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-leather-brown/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-leather-brown/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-leather-brown/40" />

        {/* Ending Icon */}
        <div className="flex justify-center pt-2">
          {details.icon}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-paper-aged/50">Kết Cục Đạt Được (Năm {currentTurnState.year})</span>
          <h2 className={`text-2xl md:text-3xl font-serif tracking-wide font-bold ${details.color.split(' ')[0]}`}>
            {details.title}
          </h2>
        </div>

        {/* Ending Image / Video */}
        <div className="w-full h-36 rounded border border-leather-brown/20 overflow-hidden bg-black/30 relative">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              playsInline
              className="w-full h-full object-cover filter sepia contrast-110 brightness-75"
            />
          ) : (
            <img
              src={endingType === 'victory_empire' || endingType === 'compromise' ? '/assets/images/woodcut_capitalist_mill.png' : '/assets/images/woodcut_workers_rebel.png'}
              alt="Ending scene"
              className="w-full h-full object-cover filter sepia contrast-110 brightness-75"
            />
          )}
        </div>

        {/* Ending Description */}
        <p className="text-xs md:text-sm text-paper-aged/85 leading-relaxed font-sans max-w-md mx-auto">
          {details.desc}
        </p>

        {/* Marxist Open Question Epilogue */}
        <div className="py-4 border-t border-b border-leather-brown/15">
          <span className="text-[10px] uppercase font-mono tracking-wider text-paper-aged/40 block mb-1">
            Câu hỏi lịch sử mở
          </span>
          <p className="text-lg md:text-xl font-serif text-brass-polished italic font-semibold">
            {details.question}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={restartGame}
            className="px-6 py-2.5 bg-leather-brown text-paper-aged font-serif font-bold uppercase tracking-wider rounded border border-leather-brown hover:bg-leather-brown/80 active:scale-95 transition-all text-xs flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-4 h-4" /> Quay lại Màn hình chính
          </button>
        </div>

      </div>
    </div>
  );
};
