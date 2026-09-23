import { useId } from "react";
import { number } from "../data/mock";
import type { FinancialPeriod } from "../types";

export type AnalysisTab = "growth" | "profit" | "cash" | "safety" | "risk";

const chartConfig = {
  growth: {
    label: "營業收入",
    field: "revenue",
    unit: "百萬元",
    color: "#C28A36",
  },
  profit: {
    label: "營業利益率",
    field: "operatingMargin",
    unit: "%",
    color: "#B85C38",
  },
  cash: {
    label: "營業現金流",
    field: "operatingCashFlow",
    unit: "百萬元",
    color: "#C28A36",
  },
  safety: {
    label: "負債占資產比率",
    field: "debtRatio",
    unit: "%",
    color: "#A88563",
  },
} as const;

export function TrendChart({
  periods,
  tab,
}: {
  periods: FinancialPeriod[];
  tab: Exclude<AnalysisTab, "risk">;
}) {
  const titleId = useId();
  const config = chartConfig[tab];
  const maxValue = Math.max(...periods.map((period) => period[config.field]));
  const step = maxValue > 1000 ? 100000 : 10;
  const ceiling = Math.ceil(maxValue / step) * step;
  const left = 70,
    top = 28,
    plotHeight = 160,
    plotWidth = 420;
  const slot = plotWidth / periods.length;
  return (
    <svg
      className="trend-chart"
      viewBox="0 0 580 230"
      role="img"
      aria-labelledby={titleId}
    >
      <title
        id={titleId}
      >{`${periods[0].year} 至 ${periods.at(-1)?.year} 年${config.label}（${config.unit}，示意資料）。${periods.map((period) => `${period.year} 年 ${number(period[config.field], config.unit === "%" ? 1 : 0)}`).join("；")}`}</title>
      <text x={left} y="13" className="axis-label">
        {config.unit}
      </text>
      {Array.from({ length: 4 }, (_, index) => {
        const value = (ceiling / 3) * index;
        const y = top + plotHeight - (value / ceiling) * plotHeight;
        return (
          <g key={index}>
            <line
              x1={left}
              x2={left + plotWidth + 16}
              y1={y}
              y2={y}
              stroke="#E8DFD1"
              strokeDasharray={index === 0 ? undefined : "3 4"}
            />
            <text
              x={left - 12}
              y={y + 4}
              textAnchor="end"
              className="axis-label"
            >
              {number(value, 0)}
            </text>
          </g>
        );
      })}
      {periods.map((period, index) => {
        const value = period[config.field];
        const height = (value / ceiling) * plotHeight;
        const x = left + slot * (index + 0.5);
        const last = index === periods.length - 1;
        return (
          <g key={period.year}>
            <rect
              x={x - 24}
              y={top + plotHeight - height}
              width="48"
              height={height}
              rx="4"
              fill={last ? "#B85C38" : config.color}
              opacity={last ? 1 : 0.58}
            />
            <text
              x={x}
              y={top + plotHeight - height - 10}
              textAnchor="middle"
              className={`chart-value ${last ? "current" : ""}`}
            >
              {number(value, config.unit === "%" ? 1 : 0)}
              {config.unit === "%" ? "%" : ""}
            </text>
            <text
              x={x}
              y={top + plotHeight + 23}
              textAnchor="middle"
              className={`axis-label ${last ? "current" : ""}`}
            >
              {period.year}
              {last ? " 本期" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
