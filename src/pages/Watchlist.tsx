import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  CircleDot,
  Search,
  Trash2,
} from "lucide-react";
import { EmptyState } from "../components/Shell";
import {
  MockStrip,
  WorkspaceHeading,
} from "../components/ResearchUI";
import { companies, number, signed } from "../data/mock";
import type { ResearchState } from "../hooks/useResearch";

export function Watchlist({ research }: { research: ResearchState }) {
  const savedCompanies = useMemo(
    () =>
      research.watchlist
        .map((id) => companies.find((company) => company.id === id))
        .filter((company) => company !== undefined),
    [research.watchlist],
  );

  return (
    <div className="page workspace-page">
      <WorkspaceHeading
        eyebrow="WATCHLIST"
        title="我的自選"
        description="把想持續研究的公司集中管理；收藏只保存在這個瀏覽器。"
        actions={
          <Link className="button primary" to="/explore">
            <Search size={15} /> 尋找公司
          </Link>
        }
      />
      <MockStrip>收藏狀態是真實操作紀錄；行情與財務數值仍為介面示意</MockStrip>
      <section className="panel watchlist-workspace">
        <div className="panel-heading">
          <div>
            <CircleDot size={18} />
            <h2>自選清單</h2>
          </div>
          <span className="subtle">
            {savedCompanies.length} 家公司 · 更新後立即保存
          </span>
        </div>
        {savedCompanies.length === 0 ? (
          <div className="watchlist-empty">
            <EmptyState icon={Bookmark} title="自選清單目前是空的">
              從公司探索加入關注的公司，這裡會保留你的選擇。
            </EmptyState>
            <div className="empty-actions">
              <button
                className="button secondary"
                onClick={() => research.toggleWatch("2303")}
              >
                <Bookmark size={15} /> 加入聯電示例
              </button>
              <Link className="button primary" to="/explore">
                前往公司探索 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="watch-company-list">
            {savedCompanies.map((company) => (
              <article className="watch-company-card" key={company.id}>
                <div className="watch-company-main">
                  <span className="company-monogram mono">{company.id}</span>
                  <div>
                    <h3>{company.name}</h3>
                    <p>
                      {company.exchange} · {company.industry}
                    </p>
                  </div>
                </div>
                <dl className="watch-metrics">
                  <div>
                    <dt>營收年增率</dt>
                    <dd
                      className={
                        company.metrics.revenueGrowth >= 0 ? "up mono" : "down mono"
                      }
                    >
                      {signed(company.metrics.revenueGrowth, 1)}%
                    </dd>
                  </div>
                  <div>
                    <dt>營業利益率</dt>
                    <dd className="mono">
                      {number(company.metrics.operatingMargin, 1)}%
                    </dd>
                  </div>
                  <div>
                    <dt>負債比率</dt>
                    <dd className="mono">{number(company.metrics.debtRatio, 1)}%</dd>
                  </div>
                </dl>
                <div className="watch-company-actions">
                  {company.available ? (
                    <Link
                      className="button compact primary"
                      to={"/company/" + company.id + "/overview"}
                    >
                      繼續研究 <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="tag">資料準備中</span>
                  )}
                  <button
                    className="icon-button"
                    onClick={() => research.toggleWatch(company.id)}
                    aria-label={"從自選移除" + company.name}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <details className="workspace-details">
          <summary>自選資料與保存說明</summary>
          <p>
            自選清單儲存在目前瀏覽器，不會同步到其他裝置。示意財務數值不能作為真實分析結果。
          </p>
        </details>
      </section>
    </div>
  );
}
