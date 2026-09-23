import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChartNoAxesCombined,
  CircleDollarSign,
  Gauge,
} from "lucide-react";
import {
  MiniTrend,
  MockStrip,
  SegmentedTabs,
  WorkspaceHeading,
} from "../components/ResearchUI";
import {
  mockMarketIndices,
  mockSectors,
  number,
  signed,
} from "../data/mock";

type MarketTab = "overview" | "sectors" | "fundamentals";

export function Market() {
  const [tab, setTab] = useState<MarketTab>("overview");
  const advancing = mockSectors.reduce((sum, item) => sum + item.advance, 0);
  const declining = mockSectors.reduce((sum, item) => sum + item.decline, 0);
  return (
    <div className="page workspace-page">
      <WorkspaceHeading
        eyebrow="MARKET & INDUSTRY"
        title="市場與產業"
        description="先看市場與產業的相對位置，再決定下一家公司要研究什麼。"
      />
      <MockStrip>固定盤後情境，不代表今日行情；更新時間與來源尚未串接</MockStrip>
      <SegmentedTabs
        label="市場分析"
        value={tab}
        onChange={setTab}
        items={[
          { value: "overview", label: "大盤概況" },
          { value: "sectors", label: "產業表現" },
          { value: "fundamentals", label: "資料覆蓋" },
        ]}
      />
      {tab === "overview" && (
        <>
          <section className="market-index-grid" aria-label="大盤指標">
            {mockMarketIndices.map((index) => {
              const positive = index.changePercent >= 0;
              return (
                <article className="panel market-index-card" key={index.id}>
                  <div className="row-between">
                    <span className="market-card-icon">
                      {index.id === "turnover" ? (
                        <CircleDollarSign size={18} />
                      ) : (
                        <ChartNoAxesCombined size={18} />
                      )}
                    </span>
                    <span className="tag">Mock</span>
                  </div>
                  <p>{index.name}</p>
                  <div className="market-index-value">
                    <strong className="mono">
                      {number(index.value, index.id === "turnover" ? 0 : 2)}
                    </strong>
                    <span>{index.unit}</span>
                  </div>
                  <div className="market-index-bottom">
                    <span className={positive ? "up" : "down"}>
                      {positive ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      <span className="mono">
                        {signed(index.changePercent, 2)}%
                      </span>
                    </span>
                    <MiniTrend
                      values={index.trend}
                      direction={positive ? "up" : "down"}
                    />
                  </div>
                </article>
              );
            })}
          </section>
          <section className="panel breadth-panel">
            <div className="panel-heading">
              <div>
                <Gauge size={19} />
                <h2>市場廣度</h2>
              </div>
              <span className="subtle">示意公司家數</span>
            </div>
            <div className="breadth-content">
              <div>
                <strong className="mono">{advancing}</strong>
                <span>上漲</span>
              </div>
              <div
                className="breadth-bar"
                aria-label={"上漲 " + advancing + " 家，下跌 " + declining + " 家"}
              >
                <span
                  className="advance"
                  style={{ width: (advancing / (advancing + declining)) * 100 + "%" }}
                />
              </div>
              <div>
                <strong className="mono">{declining}</strong>
                <span>下跌</span>
              </div>
            </div>
          </section>
        </>
      )}
      {tab === "sectors" && (
        <section className="panel sector-panel">
          <div className="panel-heading">
            <div>
              <BarChart3 size={19} />
              <h2>重點產業表現</h2>
            </div>
            <span className="subtle">固定示意排序</span>
          </div>
          <div className="sector-list">
            {mockSectors.map((sector) => {
              const positive = sector.changePercent >= 0;
              return (
                <article className="sector-row" key={sector.id}>
                  <span className="sector-rank mono">
                    {String(mockSectors.indexOf(sector) + 1).padStart(2, "0")}
                  </span>
                  <div className="sector-name">
                    <strong>{sector.name}</strong>
                    <small>
                      上漲 {sector.advance} · 下跌 {sector.decline}
                    </small>
                  </div>
                  <div className="sector-balance" aria-hidden="true">
                    <span
                      style={{
                        width:
                          (sector.advance / (sector.advance + sector.decline)) *
                            100 +
                          "%",
                      }}
                    />
                  </div>
                  <strong className={positive ? "up mono" : "down mono"}>
                    {positive ? "▲ " : "▼ "}
                    {signed(sector.changePercent, 2)}%
                  </strong>
                </article>
              );
            })}
          </div>
        </section>
      )}
      {tab === "fundamentals" && (
        <section className="panel sector-panel">
          <div className="panel-heading">
            <div>
              <Building2 size={19} />
              <h2>產業財報覆蓋狀態</h2>
            </div>
            <span className="tag">待資料核對</span>
          </div>
          <p className="section-note">
            僅呈現未來介面的資料覆蓋方式，不代表各產業實際公告完成率。
          </p>
          <div className="coverage-list">
            {mockSectors.map((sector) => (
              <div className="coverage-row" key={sector.id}>
                <span>{sector.name}</span>
                <div className="coverage-track" aria-hidden="true">
                  <span style={{ width: sector.reportCoverage + "%" }} />
                </div>
                <strong className="mono">{sector.reportCoverage}%</strong>
              </div>
            ))}
          </div>
          <div className="data-requirement">
            <Activity size={20} />
            <div>
              <strong>正式比較前需要一致的資料基準</strong>
              <p>產業分類、公司樣本、財報期間與公告完成率都需由真實資料來源提供。</p>
            </div>
          </div>
        </section>
      )}
      <details className="workspace-details panel">
        <summary>資料範圍、分類與延遲說明</summary>
        <p>
          本頁目前沒有即時或延遲行情來源。正式上線前需確認授權、更新頻率、產業分類及異常值處理方式。
        </p>
      </details>
    </div>
  );
}
