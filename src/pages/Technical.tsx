import { useState } from "react";
import { Activity, BarChart3, CandlestickChart, Info } from "lucide-react";
import type { Company } from "../types";
import type { ResearchMetric } from "../data/companyResearch";
import { technicalSeries } from "../data/companyResearch";
import {
  CompanyContextBar,
  MetricValueStrip,
  ResearchDisclosureStack,
  ResearchMetricChart,
} from "../components/CompanyResearchUI";
import { SegmentedTabs, WorkspaceHeading } from "../components/ResearchUI";
import { number, signed } from "../data/mock";

type TechnicalView = "candles" | "volume" | "rsi" | "macd";

const closeMetric: ResearchMetric = {
  id: "close",
  label: "收盤價",
  shortLabel: "收盤價",
  unit: "元",
  decimals: 2,
  changeMode: "absolute",
  values: technicalSeries.slice(-5).map((item) => ({ period: item.date, value: item.close })),
  note: "價格、均線與技術指標均為固定介面測試資料，不代表任何真實交易日。",
  formula: "收盤價取自示意日 K 資料；均線＝指定期間收盤價算術平均。",
};

const technicalMetrics: Record<Exclude<TechnicalView, "candles">, ResearchMetric> = {
  volume: {
    id: "volume",
    label: "成交量",
    shortLabel: "成交量",
    unit: "千張",
    decimals: 0,
    changeMode: "percent",
    values: technicalSeries.slice(-5).map((item) => ({ period: item.date, value: item.volume })),
    note: "成交量需搭配價格、期間與事件觀察，不能單獨推導方向。",
    formula: "成交量＝該交易日已成交股數÷1,000,000（示意換算）",
  },
  rsi: {
    id: "rsi",
    label: "RSI（14）",
    shortLabel: "RSI",
    unit: "",
    decimals: 1,
    changeMode: "absolute",
    values: [52.4, 55.8, 58.1, 54.6, 56.2].map((value, index) => ({
      period: technicalSeries.slice(-5)[index].date,
      value,
    })),
    note: "RSI 只是價格動能指標，本頁不產生超買、超賣或買賣訊號。",
    formula: "RSI＝100－100÷（1＋指定期間平均漲幅÷平均跌幅）",
  },
  macd: {
    id: "macd",
    label: "MACD 柱狀值",
    shortLabel: "MACD",
    unit: "",
    decimals: 2,
    changeMode: "absolute",
    values: [-0.12, -0.05, 0.04, 0.02, 0.08].map((value, index) => ({
      period: technicalSeries.slice(-5)[index].date,
      value,
    })),
    note: "MACD 參數與復權方式需固定後才可重現，目前僅展示介面。",
    formula: "MACD 柱狀值＝DIF－MACD 訊號線；參數暫以 12、26、9 示意",
  },
};

function Candles() {
  const min = Math.min(...technicalSeries.map((item) => item.low)) - 0.3;
  const max = Math.max(...technicalSeries.map((item) => item.high)) + 0.3;
  const left = 52;
  const top = 18;
  const width = 540;
  const height = 190;
  const slot = width / technicalSeries.length;
  const yFor = (value: number) => top + ((max - value) / (max - min)) * height;
  const ma5 = technicalSeries
    .map((_, index) => {
      if (index < 4) return null;
      const window = technicalSeries.slice(index - 4, index + 1);
      return window.reduce((sum, item) => sum + item.close, 0) / window.length;
    })
    .map((value, index) =>
      value === null
        ? null
        : `${left + slot * (index + 0.5)},${yFor(value)}`,
    )
    .filter((value): value is string => value !== null)
    .join(" ");
  return (
    <svg
      className="research-metric-chart candle-chart"
      viewBox="0 0 640 260"
      role="img"
      aria-label={`日 K 線與五日均線示意，${technicalSeries.map((item) => `${item.date} 收盤 ${item.close} 元`).join("，")}`}
    >
      {[0, 1, 2, 3].map((index) => {
        const value = max - ((max - min) / 3) * index;
        const y = top + (height / 3) * index;
        return (
          <g key={index}>
            <line x1={left} x2={left + width} y1={y} y2={y} className="chart-grid-line" />
            <text x={left - 9} y={y + 4} textAnchor="end" className="axis-label">
              {number(value, 1)}
            </text>
          </g>
        );
      })}
      {technicalSeries.map((item, index) => {
        const x = left + slot * (index + 0.5);
        const rising = item.close >= item.open;
        const bodyTop = yFor(Math.max(item.open, item.close));
        const bodyHeight = Math.max(Math.abs(yFor(item.open) - yFor(item.close)), 2);
        return (
          <g key={item.date} className={rising ? "candle rising" : "candle falling"}>
            <line x1={x} x2={x} y1={yFor(item.high)} y2={yFor(item.low)} />
            <rect x={x - 7} y={bodyTop} width="14" height={bodyHeight} />
            {(index % 2 === 0 || index === technicalSeries.length - 1) && (
              <text x={x} y={height + top + 24} textAnchor="middle" className="axis-label">
                {item.date}
              </text>
            )}
          </g>
        );
      })}
      <polyline points={ma5} className="moving-average-line" />
      <g className="chart-legend" aria-hidden="true">
        <line x1="468" x2="490" y1="12" y2="12" className="moving-average-line" />
        <text x="497" y="15">MA5</text>
      </g>
    </svg>
  );
}

export function Technical({ company }: { company: Company }) {
  const [view, setView] = useState<TechnicalView>("candles");
  const current = technicalSeries.at(-1)!;
  const previous = technicalSeries.at(-2)!;
  const change = current.close - previous.close;
  const activeMetric = view === "candles" ? closeMetric : technicalMetrics[view];
  return (
    <div className="page company-workspace-page">
      <WorkspaceHeading
        eyebrow="PRICE & TECHNICAL"
        title="股價與技術"
        description="把價格、成交量與技術指標放在同一時間基準，避免誤讀。"
      />
      <CompanyContextBar company={company} period="2025/03/31 盤後 · 示意行情" />
      <section className="research-kpi-grid" aria-label="股價常用數值">
        <article className="research-kpi-card">
          <div className="row-between"><h2>收盤價</h2><CandlestickChart size={16} /></div>
          <div className="research-kpi-value"><strong className="mono">{number(current.close, 2)}</strong><span>元</span></div>
          <div className="research-kpi-comparison"><span className={change >= 0 ? "up" : "down"}>{signed(change, 2)} 元</span><small>前一示意日</small></div>
        </article>
        <article className="research-kpi-card">
          <div className="row-between"><h2>當日區間</h2><Activity size={16} /></div>
          <div className="research-kpi-value"><strong className="mono">{number(current.low, 2)}–{number(current.high, 2)}</strong><span>元</span></div>
          <div className="research-kpi-comparison"><span>開盤 {number(current.open, 2)}</span><small>Demo Mock</small></div>
        </article>
        <article className="research-kpi-card">
          <div className="row-between"><h2>成交量</h2><BarChart3 size={16} /></div>
          <div className="research-kpi-value"><strong className="mono">{number(current.volume)}</strong><span>千張</span></div>
          <div className="research-kpi-comparison"><span>固定情境</span><small>非即時行情</small></div>
        </article>
      </section>
      <section className="panel metric-workspace-panel">
        <div className="metric-selector-row">
          <div><span className="section-kicker">PRICE WORKSPACE</span><h2>{activeMetric.label}</h2></div>
          <SegmentedTabs
            label="技術圖表"
            value={view}
            onChange={setView}
            items={[
              { value: "candles", label: "K 線／均線" },
              { value: "volume", label: "成交量" },
              { value: "rsi", label: "RSI" },
              { value: "macd", label: "MACD" },
            ]}
          />
        </div>
        {view === "candles" ? <Candles /> : <ResearchMetricChart metric={activeMetric} />}
        <p className="metric-objective-note"><Info size={15} />{activeMetric.note}</p>
        <MetricValueStrip metric={activeMetric} />
      </section>
      <ResearchDisclosureStack
        metric={activeMetric}
        note="正式實作需確認行情來源、延遲時間、復權方式與技術指標參數。"
        groupName="technical-details"
      />
    </div>
  );
}
