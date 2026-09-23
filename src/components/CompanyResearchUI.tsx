import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  ChevronDown,
  Database,
  FileSearch,
  Minus,
} from "lucide-react";
import type { Company } from "../types";
import type { ResearchMetric } from "../data/companyResearch";
import { growthRate, number, signed } from "../data/mock";

export function CompanyContextBar({
  company,
  period,
}: {
  company: Company;
  period: string;
}) {
  return (
    <section className="company-context-bar" aria-label="研究資料基準">
      <div>
        <span>研究公司</span>
        <strong>
          <span className="mono">{company.id}</span> {company.name}
        </strong>
      </div>
      <div>
        <span>資料期間</span>
        <strong>{period}</strong>
      </div>
      <div>
        <span>資料狀態</span>
        <strong>Demo Mock · 尚未連接真實資料</strong>
      </div>
    </section>
  );
}

export function formatMetric(metric: ResearchMetric, value: number) {
  return number(value, metric.decimals);
}

export function metricDelta(metric: ResearchMetric) {
  const current = metric.values.at(-1)?.value ?? 0;
  const previous = metric.values.at(-2)?.value ?? 0;
  if (metric.changeMode === "percent") return growthRate(current, previous);
  return current - previous;
}

export function ResearchKpiCard({ metric }: { metric: ResearchMetric }) {
  const current = metric.values.at(-1)?.value ?? 0;
  const previous = metric.values.at(-2)?.value ?? 0;
  const delta = metricDelta(metric);
  const positive = (delta ?? 0) > 0;
  const negative = (delta ?? 0) < 0;
  const suffix =
    metric.changeMode === "percent"
      ? "%"
      : metric.changeMode === "point"
        ? "百分點"
        : metric.unit;
  const deltaDigits =
    metric.changeMode === "percent" ? 1 : Math.min(metric.decimals, 2);
  return (
    <article className="research-kpi-card">
      <div className="row-between">
        <h2>{metric.label}</h2>
        <span className="subtle">示意數值</span>
      </div>
      <div className="research-kpi-value">
        <strong className="mono">{formatMetric(metric, current)}</strong>
        <span>{metric.unit}</span>
      </div>
      <div className="research-kpi-comparison">
        <span className={positive ? "up" : negative ? "down" : ""}>
          {positive ? (
            <ArrowUpRight size={14} />
          ) : negative ? (
            <ArrowDownRight size={14} />
          ) : (
            <Minus size={14} />
          )}
          {delta === null ? "不適用" : `${signed(delta, deltaDigits)}${suffix}`}
        </span>
        <small>
          前期 {formatMetric(metric, previous)} {metric.unit}
        </small>
      </div>
    </article>
  );
}

export function ResearchMetricChart({ metric }: { metric: ResearchMetric }) {
  const values = metric.values.map((point) => point.value);
  const rawMin = Math.min(...values, 0);
  const rawMax = Math.max(...values, 0);
  const padding = Math.max((rawMax - rawMin) * 0.15, 1);
  const min = rawMin < 0 ? rawMin - padding : 0;
  const max = rawMax + padding;
  const range = max - min || 1;
  const left = 58;
  const top = 18;
  const width = 520;
  const height = 190;
  const xFor = (index: number) =>
    left + (index / Math.max(metric.values.length - 1, 1)) * width;
  const yFor = (value: number) => top + ((max - value) / range) * height;
  const points = metric.values
    .map((point, index) => `${xFor(index)},${yFor(point.value)}`)
    .join(" ");
  const zeroY = yFor(0);

  return (
    <svg
      className="research-metric-chart"
      viewBox="0 0 640 260"
      role="img"
      aria-label={`${metric.label}趨勢，${metric.values
        .map((point) => `${point.period} ${formatMetric(metric, point.value)} ${metric.unit}`)
        .join("，")}`}
    >
      {[0, 1, 2, 3].map((index) => {
        const value = min + ((max - min) / 3) * (3 - index);
        const y = top + (height / 3) * index;
        return (
          <g key={index}>
            <line x1={left} x2={left + width} y1={y} y2={y} className="chart-grid-line" />
            <text x={left - 10} y={y + 4} textAnchor="end" className="axis-label">
              {number(value, metric.decimals > 0 ? 1 : 0)}
            </text>
          </g>
        );
      })}
      {min < 0 && max > 0 && (
        <line x1={left} x2={left + width} y1={zeroY} y2={zeroY} className="chart-zero-line" />
      )}
      <polyline points={points} className="research-line" />
      {metric.values.map((point, index) => {
        const current = index === metric.values.length - 1;
        return (
          <g key={point.period}>
            <circle
              cx={xFor(index)}
              cy={yFor(point.value)}
              r={current ? 5 : 4}
              className={current ? "research-point current" : "research-point"}
            />
            <text x={xFor(index)} y={height + top + 25} textAnchor="middle" className="axis-label">
              {point.period}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MetricValueStrip({ metric }: { metric: ResearchMetric }) {
  return (
    <div className="metric-value-strip" aria-label={`${metric.label}各期數值`}>
      {metric.values.map((point, index) => (
        <div className={index === metric.values.length - 1 ? "current" : ""} key={point.period}>
          <span>{point.period}</span>
          <strong className="mono">{formatMetric(metric, point.value)}</strong>
          <small>{metric.unit}</small>
        </div>
      ))}
    </div>
  );
}

export function ResearchDisclosureStack({
  metric,
  note,
  children,
  groupName,
}: {
  metric: ResearchMetric;
  note: string;
  children?: ReactNode;
  groupName: string;
}) {
  return (
    <section className="research-disclosures" aria-label="完整資料與來源">
      <details name={groupName}>
        <summary>
          <Calculator size={16} />
          <span>指標定義與計算方式</span>
          <small>按需查看</small>
          <ChevronDown size={15} />
        </summary>
        <div>
          <p>{metric.formula}</p>
          <p>{metric.note}</p>
        </div>
      </details>
      <details name={groupName}>
        <summary>
          <Database size={16} />
          <span>完整數據</span>
          <small>{metric.values.length} 期示意資料</small>
          <ChevronDown size={15} />
        </summary>
        <div className="table-scroll">
          <table>
            <caption>{metric.label}・{metric.unit}・Demo Mock</caption>
            <thead>
              <tr>
                <th scope="col">期間</th>
                {metric.values.map((point) => (
                  <th scope="col" key={point.period}>{point.period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{metric.shortLabel}</th>
                {metric.values.map((point) => (
                  <td className="mono" key={point.period}>{formatMetric(metric, point.value)}</td>
                ))}
              </tr>
            </tbody>
          </table>
          {children}
        </div>
      </details>
      <details name={groupName}>
        <summary>
          <FileSearch size={16} />
          <span>資料來源與驗證狀態</span>
          <small>尚未驗證</small>
          <ChevronDown size={15} />
        </summary>
        <div>
          <p>{note}</p>
          <p>目前沒有原始文件 ID、PDF 頁碼或 Guardian 結果，不能把示意數值描述成真實分析。</p>
        </div>
      </details>
    </section>
  );
}
