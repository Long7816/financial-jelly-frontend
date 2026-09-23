import { useMemo, useState } from "react";
import { BarChart3, Building2, Landmark } from "lucide-react";
import type { Company } from "../types";
import type { ResearchMetric } from "../data/companyResearch";
import {
  CompanyContextBar,
  MetricValueStrip,
  ResearchDisclosureStack,
  ResearchMetricChart,
} from "../components/CompanyResearchUI";
import { SegmentedTabs, WorkspaceHeading } from "../components/ResearchUI";
import { number, signed } from "../data/mock";

type FlowPeriod = "5d" | "20d" | "60d" | "1y";
type FlowOwner = "foreign" | "trust" | "dealer" | "total";

const labels: Record<FlowPeriod, string[]> = {
  "5d": ["03/21", "03/24", "03/25", "03/26", "03/27"],
  "20d": ["第 1 週", "第 2 週", "第 3 週", "第 4 週", "本週"],
  "60d": ["第 1 段", "第 2 段", "第 3 段", "第 4 段", "最近段"],
  "1y": ["Q1", "Q2", "Q3", "Q4", "今年迄今"],
};

const mockFlows: Record<FlowPeriod, Record<Exclude<FlowOwner, "total">, number[]>> = {
  "5d": {
    foreign: [3200, -1800, 4600, 2100, -900],
    trust: [420, 680, -210, 350, 190],
    dealer: [-140, 320, 180, -260, 90],
  },
  "20d": {
    foreign: [6800, -2400, 9200, 3100, -1700],
    trust: [920, 1140, -430, 780, 510],
    dealer: [-360, 620, 440, -510, 230],
  },
  "60d": {
    foreign: [12800, -6300, 17400, 8900, -4200],
    trust: [2100, 2780, -960, 1430, 880],
    dealer: [-840, 1310, 920, -1180, 540],
  },
  "1y": {
    foreign: [28500, -16200, 34600, 21100, -8700],
    trust: [6200, 7440, -2980, 4810, 2570],
    dealer: [-2640, 3820, 2310, -3470, 1290],
  },
};

const ownerMeta: Record<Exclude<FlowOwner, "total">, { label: string; icon: typeof Landmark }> = {
  foreign: { label: "外資", icon: Landmark },
  trust: { label: "投信", icon: Building2 },
  dealer: { label: "自營商", icon: BarChart3 },
};

function buildMetric(period: FlowPeriod, owner: FlowOwner): ResearchMetric {
  const series = mockFlows[period];
  const values =
    owner === "total"
      ? labels[period].map((_, index) =>
          series.foreign[index] + series.trust[index] + series.dealer[index],
        )
      : series[owner];
  const ownerLabel = owner === "total" ? "三大法人合計" : ownerMeta[owner].label;
  return {
    id: owner,
    label: `${ownerLabel}買賣超`,
    shortLabel: ownerLabel,
    unit: "張",
    decimals: 0,
    changeMode: "absolute",
    values: values.map((value, index) => ({ period: labels[period][index], value })),
    note: "正值與負值只表示固定示意情境中的淨買賣超，不構成多空或買賣判斷。",
    formula:
      owner === "total"
        ? "三大法人合計＝外資＋投信＋自營商買賣超"
        : `${ownerLabel}買賣超＝買進張數－賣出張數`,
  };
}

function FlowCard({ owner, period }: { owner: Exclude<FlowOwner, "total">; period: FlowPeriod }) {
  const Icon = ownerMeta[owner].icon;
  const total = mockFlows[period][owner].reduce((sum, value) => sum + value, 0);
  return (
    <article className="research-kpi-card">
      <div className="row-between">
        <h2>{ownerMeta[owner].label}區間買賣超</h2>
        <Icon size={16} />
      </div>
      <div className="research-kpi-value">
        <strong className="mono">{signed(total, 0)}</strong>
        <span>張</span>
      </div>
      <div className="research-kpi-comparison">
        <span className={total > 0 ? "up" : total < 0 ? "down" : ""}>區間合計</span>
        <small>{number(mockFlows[period][owner].length)} 個示意分段</small>
      </div>
    </article>
  );
}

export function Institutional({ company }: { company: Company }) {
  const [period, setPeriod] = useState<FlowPeriod>("5d");
  const [owner, setOwner] = useState<FlowOwner>("total");
  const metric = useMemo(() => buildMetric(period, owner), [period, owner]);
  return (
    <div className="page company-workspace-page">
      <WorkspaceHeading
        eyebrow="INSTITUTIONAL FLOW"
        title="籌碼與法人"
        description="切換觀察區間與法人別，呈現淨買賣超，不產生多空判斷。"
        actions={
          <SegmentedTabs
            label="法人觀察期間"
            value={period}
            onChange={setPeriod}
            items={[
              { value: "5d", label: "5 日" },
              { value: "20d", label: "20 日" },
              { value: "60d", label: "60 日" },
              { value: "1y", label: "1 年" },
            ]}
          />
        }
      />
      <CompanyContextBar company={company} period={`示意區間 · ${period === "1y" ? "1 年" : period.replace("d", " 日")}`} />
      <section className="research-kpi-grid" aria-label="法人區間買賣超">
        {(["foreign", "trust", "dealer"] as const).map((item) => (
          <FlowCard owner={item} period={period} key={item} />
        ))}
      </section>
      <section className="panel metric-workspace-panel">
        <div className="metric-selector-row">
          <div>
            <span className="section-kicker">FLOW TREND</span>
            <h2>{metric.label}</h2>
          </div>
          <SegmentedTabs
            label="法人別"
            value={owner}
            onChange={setOwner}
            items={[
              { value: "total", label: "合計" },
              { value: "foreign", label: "外資" },
              { value: "trust", label: "投信" },
              { value: "dealer", label: "自營商" },
            ]}
          />
        </div>
        <ResearchMetricChart metric={metric} />
        <p className="metric-objective-note">{metric.note}</p>
        <MetricValueStrip metric={metric} />
      </section>
      <ResearchDisclosureStack
        metric={metric}
        note="正式串接需標示交易日、股數或張數單位，並區分自營商自行買賣與避險口徑。"
        groupName="institutional-details"
      />
    </div>
  );
}
