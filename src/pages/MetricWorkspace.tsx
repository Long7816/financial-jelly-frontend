import { useEffect, useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import type { Company } from "../types";
import type { ResearchWorkspaceConfig } from "../data/companyResearch";
import {
  CompanyContextBar,
  MetricValueStrip,
  ResearchDisclosureStack,
  ResearchKpiCard,
  ResearchMetricChart,
} from "../components/CompanyResearchUI";
import { SegmentedTabs, WorkspaceHeading } from "../components/ResearchUI";

export function MetricWorkspace({
  company,
  config,
  supplemental,
}: {
  company: Company;
  config: ResearchWorkspaceConfig;
  supplemental?: ReactNode;
}) {
  const [metricId, setMetricId] = useState(config.metrics[0].id);
  useEffect(() => {
    setMetricId(config.metrics[0].id);
  }, [config.id, config.metrics]);
  const metric =
    config.metrics.find((item) => item.id === metricId) ?? config.metrics[0];
  const kpis = config.kpiMetricIds
    .map((id) => config.metrics.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  return (
    <div className="page company-workspace-page">
      <WorkspaceHeading
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
      />
      <CompanyContextBar company={company} period={config.periodLabel} />
      <section className="research-kpi-grid" aria-label={`${config.title}常用指標`}>
        {kpis.map((item) => (
          <ResearchKpiCard metric={item} key={item.id} />
        ))}
      </section>
      <section className="panel metric-workspace-panel">
        <div className="metric-selector-row">
          <div>
            <span className="section-kicker">FIVE-PERIOD TREND</span>
            <h2>{metric.label}</h2>
          </div>
          <SegmentedTabs
            label={`${config.title}指標`}
            value={metricId}
            onChange={setMetricId}
            items={config.metrics.map((item) => ({
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
      {supplemental}
      <ResearchDisclosureStack
        metric={metric}
        note={config.detailNote}
        groupName={`${config.id}-details`}
      />
    </div>
  );
}
