import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Check,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  MockStrip,
  SegmentedTabs,
  WorkspaceHeading,
} from "../components/ResearchUI";
import { companies, number, signed } from "../data/mock";
import type { ResearchState } from "../hooks/useResearch";

type MetricFilter = "all" | "growth" | "profit" | "safety";

export function Explore({ research }: { research: ResearchState }) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [industry, setIndustry] = useState("全部產業");
  const [metric, setMetric] = useState<MetricFilter>("all");
  const [sort, setSort] = useState("代號");
  const industries = [
    "全部產業",
    ...new Set(companies.map((item) => item.industry.split("・")[0])),
  ];
  const results = useMemo(() => {
    const normalized = query.trim().normalize("NFKC").toLocaleLowerCase();
    const filtered = companies.filter((company) => {
      const matchesQuery =
        !normalized ||
        (company.id + company.name + company.fullName)
          .toLocaleLowerCase()
          .includes(normalized);
      const matchesIndustry =
        industry === "全部產業" || company.industry.startsWith(industry);
      return matchesQuery && matchesIndustry;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "營收年增率")
        return b.metrics.revenueGrowth - a.metrics.revenueGrowth;
      if (sort === "營業利益率")
        return b.metrics.operatingMargin - a.metrics.operatingMargin;
      return a.id.localeCompare(b.id);
    });
  }, [industry, query, sort]);

  return (
    <div className="page workspace-page">
      <WorkspaceHeading
        eyebrow="COMPANY DISCOVERY"
        title="公司探索"
        description="用公司、產業與財務面向縮小研究範圍，再進入個股工作台。"
      />
      <MockStrip>篩選數值為介面示意，正式資料來源與期間尚未串接</MockStrip>
      <section className="panel discovery-controls" aria-label="公司篩選">
        <div className="discovery-search">
          <Search size={18} />
          <label className="sr-only" htmlFor="explore-query">
            搜尋公司
          </label>
          <input
            id="explore-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="輸入股票代號或公司名稱"
          />
          {query && (
            <button aria-label="清除搜尋" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          )}
        </div>
        <label className="compact-field">
          <span>產業</span>
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          >
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="compact-field">
          <span>排序</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>代號</option>
            <option>營收年增率</option>
            <option>營業利益率</option>
          </select>
        </label>
      </section>
      <section className="panel discovery-panel">
        <div className="panel-heading discovery-heading">
          <div>
            <SlidersHorizontal size={18} />
            <h2>探索結果</h2>
            <span className="count-badge">{results.length}</span>
          </div>
          <span className="subtle">依條件縮小研究範圍</span>
        </div>
        <SegmentedTabs
          label="財務面向"
          value={metric}
          onChange={setMetric}
          items={[
            { value: "all", label: "全部" },
            { value: "growth", label: "成長" },
            { value: "profit", label: "獲利" },
            { value: "safety", label: "財務安全" },
          ]}
        />
        <div className="company-table" role="table" aria-label="公司探索結果">
          <div className="company-table-head" role="row">
            <span role="columnheader">公司</span>
            <span role="columnheader">產業／資料</span>
            <span role="columnheader">
              {metric === "profit"
                ? "營業利益率"
                : metric === "safety"
                  ? "負債比率"
                  : "營收年增率"}
            </span>
            <span role="columnheader">操作</span>
          </div>
          {results.map((company) => {
            const saved = research.watchlist.includes(company.id);
            const metricValue =
              metric === "profit"
                ? company.metrics.operatingMargin
                : metric === "safety"
                  ? company.metrics.debtRatio
                  : company.metrics.revenueGrowth;
            const metricClass =
              metric === "safety" ? "" : metricValue >= 0 ? "up" : "down";
            return (
              <div className="company-table-row" role="row" key={company.id}>
                <div className="company-cell" role="cell">
                  <span className="company-monogram mono">{company.id}</span>
                  <div>
                    <strong>{company.name}</strong>
                    <small>{company.fullName}</small>
                  </div>
                </div>
                <div className="company-meta-cell" role="cell">
                  <strong>{company.industry}</strong>
                  <small>
                    {company.exchange} · {company.latestReport} ·{" "}
                    {company.coverage}
                  </small>
                </div>
                <div role="cell">
                  <strong
                    className={["mono", "metric-number", metricClass].join(" ")}
                  >
                    {metric === "safety"
                      ? number(metricValue, 1)
                      : signed(metricValue, 1)}
                    %
                  </strong>
                  <small className="table-caption">Demo Mock</small>
                </div>
                <div className="table-actions" role="cell">
                  <button
                    className={[
                      "icon-button",
                      saved ? "saved" : "",
                    ].join(" ")}
                    onClick={() => research.toggleWatch(company.id)}
                    aria-label={
                      saved
                        ? "從自選移除" + company.name
                        : "將" + company.name + "加入自選"
                    }
                    aria-pressed={saved}
                  >
                    {saved ? <Check size={16} /> : <Bookmark size={16} />}
                  </button>
                  {company.available ? (
                    <Link
                      className="button compact primary"
                      to={"/company/" + company.id + "/overview"}
                    >
                      進入研究 <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="tag">資料準備中</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {results.length === 0 && (
          <div className="inline-empty">
            <Search size={22} />
            <strong>沒有符合條件的公司</strong>
            <button
              onClick={() => {
                setQuery("");
                setIndustry("全部產業");
              }}
            >
              清除篩選
            </button>
          </div>
        )}
        <details className="workspace-details">
          <summary>指標定義與比較限制</summary>
          <p>
            本頁數值僅為介面測試。正式比較前必須確認產業、期間、幣別、合併基礎與科目定義一致。
          </p>
        </details>
      </section>
    </div>
  );
}
