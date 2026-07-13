import React from "react";
import { useGameStore } from "../store/gameStore";
import { Target, CheckCircle2, XCircle } from "lucide-react";
import { TermTooltip } from "./TermTooltip";

export const VictoryTracker: React.FC = () => {
  const { faction, currentTurnState } = useGameStore();
  const {
    capital,
    workerHealth,
    unionFund,
    solidarityNetwork,
    classConsciousness,
    marketShare,
  } = currentTurnState;

  if (!faction) return null;

  const isCapitalist = faction === "capitalist";

  // Goals
  const capCapitalGoal = 25000;
  const capHealthGoal = 45;
  const capMarketShareGoal = 60;

  const wrkFundGoal = 4000;
  const wrkSolidarityGoal = 70;
  const wrkConsciousnessGoal = 75;

  // Percentages for bars
  const capCapitalPercent = Math.min(
    100,
    Math.round((capital / capCapitalGoal) * 100),
  );
  const capHealthPercent = Math.min(
    100,
    Math.round((workerHealth / capHealthGoal) * 100),
  ); // normalized to goal
  const capMarketSharePercent = Math.min(
    100,
    Math.round((marketShare / capMarketShareGoal) * 100),
  );

  const wrkFundPercent = Math.min(
    100,
    Math.round((unionFund / wrkFundGoal) * 100),
  );
  const wrkSolidarityPercent = Math.min(
    100,
    Math.round((solidarityNetwork / wrkSolidarityGoal) * 100),
  );
  const wrkConsciousnessPercent = Math.min(
    100,
    Math.round((classConsciousness / wrkConsciousnessGoal) * 100),
  );

  const capCapitalMet = capital >= capCapitalGoal;
  const capHealthMet = workerHealth >= capHealthGoal;
  const capMarketShareMet = marketShare >= capMarketShareGoal;

  const wrkFundMet = unionFund >= wrkFundGoal;
  const wrkSolidarityMet = solidarityNetwork >= wrkSolidarityGoal;
  const wrkConsciousnessMet = classConsciousness >= wrkConsciousnessGoal;

  const themeColors = isCapitalist
    ? {
        border: "border-brass-polished/20",
        text: "text-brass-polished",
        bg: "bg-brass-polished",
        panelBg: "bg-[#251E19]/70",
      }
    : {
        border: "border-iron-cold/20",
        text: "text-iron-cold",
        bg: "bg-iron-cold",
        panelBg: "bg-[#1C2225]/70",
      };

  return (
    <div
      className={`w-full p-3.5 rounded-xl border ${themeColors.border} ${themeColors.panelBg} glass-panel select-none`}
    >
      <div className="flex items-center gap-1.5 border-b border-leather-brown/10 pb-2 mb-3">
        <Target className={`w-4 h-4 ${themeColors.text}`} />
        <h3 className="font-serif font-bold text-xs uppercase text-paper-aged tracking-wider">
          Chỉ Tiêu Chiến Thắng (Lượt 15)
        </h3>
      </div>

      <div className="flex flex-col gap-3.5">
        {isCapitalist ? (
          <>
            {/* Goal 1: Capital */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-paper-aged/70">
                  <TermTooltip text="Tích lũy vốn" />:{" "}
                  <strong className="text-paper-aged">
                    {capital.toLocaleString()} £
                  </strong>{" "}
                  <span className="text-paper-aged/40">
                    / {capCapitalGoal.toLocaleString()} £
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold shrink-0">
                  {capCapitalPercent}%{" "}
                  {capCapitalMet ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-brass-polished animate-pulse" />
                  )}
                </span>
              </div>
              <div className="w-full bg-wood-dark/60 h-2 rounded-full overflow-hidden p-[1px] border border-leather-brown/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${capCapitalMet ? "bg-emerald-500" : "bg-brass-polished"}`}
                  style={{ width: `${capCapitalPercent}%` }}
                />
              </div>
            </div>

            {/* Goal 2: Worker Health */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-paper-aged/70">
                  <TermTooltip text="Sức khỏe CN" />:{" "}
                  <strong className="text-paper-aged">{workerHealth}%</strong>{" "}
                  <span className="text-paper-aged/40">
                    / tối thiểu {capHealthGoal}%
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold shrink-0">
                  {workerHealth >= capHealthGoal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </span>
              </div>
              <div className="w-full bg-wood-dark/60 h-2 rounded-full overflow-hidden p-[1px] border border-leather-brown/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${capHealthMet ? "bg-emerald-500" : "bg-red-500/70"}`}
                  style={{ width: `${capHealthPercent}%` }}
                />
              </div>
            </div>

            {/* Goal 3: Market Share */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-paper-aged/70">
                  <TermTooltip text="Độc quyền thị trường" />:{" "}
                  <strong className="text-paper-aged">{marketShare}%</strong>{" "}
                  <span className="text-paper-aged/40">
                    / {capMarketShareGoal}%
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold shrink-0">
                  {capMarketSharePercent}%{" "}
                  {capMarketShareMet ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-brass-polished animate-pulse" />
                  )}
                </span>
              </div>
              <div className="w-full bg-wood-dark/60 h-2 rounded-full overflow-hidden p-[1px] border border-leather-brown/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${capMarketShareMet ? "bg-emerald-500" : "bg-brass-polished"}`}
                  style={{ width: `${capMarketSharePercent}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Goal 1: Union Fund */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-paper-aged/70">
                  <TermTooltip text="Quỹ Công đoàn" />:{" "}
                  <strong className="text-paper-aged">
                    {unionFund.toLocaleString()} £
                  </strong>{" "}
                  <span className="text-paper-aged/40">
                    / {wrkFundGoal.toLocaleString()} £
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold shrink-0">
                  {wrkFundPercent}%{" "}
                  {wrkFundMet ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-iron-cold/60 animate-pulse" />
                  )}
                </span>
              </div>
              <div className="w-full bg-wood-dark/60 h-2 rounded-full overflow-hidden p-[1px] border border-leather-brown/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${wrkFundMet ? "bg-emerald-500" : "bg-iron-cold"}`}
                  style={{ width: `${wrkFundPercent}%` }}
                />
              </div>
            </div>

            {/* Goal 2: Solidarity Network */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-paper-aged/70">
                  <TermTooltip text="Mạng lưới" />:{" "}
                  <strong className="text-paper-aged">
                    {solidarityNetwork}%
                  </strong>{" "}
                  <span className="text-paper-aged/40">
                    / {wrkSolidarityGoal}%
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold shrink-0">
                  {wrkSolidarityPercent}%{" "}
                  {wrkSolidarityMet ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-iron-cold/40 animate-pulse" />
                  )}
                </span>
              </div>
              <div className="w-full bg-wood-dark/60 h-2 rounded-full overflow-hidden p-[1px] border border-leather-brown/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${wrkSolidarityMet ? "bg-emerald-500" : "bg-iron-cold"}`}
                  style={{ width: `${wrkSolidarityPercent}%` }}
                />
              </div>
            </div>

            {/* Goal 3: Class Consciousness */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-paper-aged/70">
                  <TermTooltip text="Ý thức đấu tranh" />:{" "}
                  <strong className="text-paper-aged">
                    {classConsciousness}%
                  </strong>{" "}
                  <span className="text-paper-aged/40">
                    / {wrkConsciousnessGoal}%
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold shrink-0">
                  {wrkConsciousnessPercent}%{" "}
                  {wrkConsciousnessMet ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-iron-cold/40 animate-pulse" />
                  )}
                </span>
              </div>
              <div className="w-full bg-wood-dark/60 h-2 rounded-full overflow-hidden p-[1px] border border-leather-brown/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${wrkConsciousnessMet ? "bg-emerald-500" : "bg-iron-cold"}`}
                  style={{ width: `${wrkConsciousnessPercent}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
