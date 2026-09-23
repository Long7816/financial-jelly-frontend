import { useState } from "react";
import { Bookmark, Check, Info } from "lucide-react";
import type { Company } from "../types";
import { overviewMetrics } from "../data/companyResearch";
import type { ResearchState } from "../hooks/useResearch";
import {
  CompanyContextBar,
  MetricValueStrip,
  ResearchDisclosureStack,
  ResearchKpiCard,
  ResearchMetricChart,
} from "../components/CompanyResearchUI";
import { SegmentedTabs, WorkspaceHeading } from "../components/ResearchUI";

export function Overview({
  company,
  research,
}: {
  company: Company;
  research: ResearchState;
}) {
  const [metricId, setMetricId] = useState("revenue");
  const metric =
    overviewMetrics.find((item) => item.id === metricId) ?? overviewMetrics[0];
  const saved = research.watchlist.includes(company.id);
  return (
    <div className="page company-workspace-page">
      <WorkspaceHeading
        eyebrow="COMPANY RESEARCH"
        title="公司總覽"
        description="先掌握營運、獲利與現金流，再依需要進入各分析頁。"
        actions={
          <button
            className={`button secondary ${saved ? "is-saved" : ""}`}
            onClick={() => research.toggleWatch(company.id)}
            aria-pressed={saved}
          >
            {saved ? <Check size={16} /> : <Bookmark size={16} />}
            {saved ? "已加入自選" : "加入自選"}
          </button>
        }
      />
      <CompanyContextBar company={company} period="2024 年度合併 · 全年累計" />
      <section className="research-kpi-grid" aria-label="核心財務指標">
        {overviewMetrics.slice(0, 3).map((item) => (
          <ResearchKpiCard metric={item} key={item.id} />
        ))}
      </section>
      <section className="panel metric-workspace-panel" aria-label="五年趨勢">
        <div className="metric-selector-row">
          <div>
            <span className="section-kicker">FIVE-YEAR OVERVIEW</span>
            <h2>{metric.label}</h2>
          </div>
          <SegmentedTabs
            label="總覽指標"
            value={metricId}
            onChange={setMetricId}
            items={overviewMetrics.map((item) => ({
              value: item.id,
              label: item.shortLabel,
            }))}
          />
        </div>
        <ResearchMetricChart metric={metric} />
        <p className="metric-objective-note">
          <Info size={15} /> {metric.note}
        </p>
        <MetricValueStrip metric={metric} />
      </section>
      <ResearchDisclosureStack
        metric={metric}
        note="目前為前端固定示意資料，未連接聯電原始財報、PDF 頁碼或驗證服務。"
        groupName="overview-details"
      />
    </div>
  );
}
