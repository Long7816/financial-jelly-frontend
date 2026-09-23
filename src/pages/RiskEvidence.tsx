import { useState } from "react";
import {
  ChevronDown,
  FileQuestion,
  FileSearch,
  ListChecks,
  Scale,
  ShieldQuestion,
} from "lucide-react";
import type { Company } from "../types";
import { CompanyContextBar } from "../components/CompanyResearchUI";
import { SegmentedTabs, WorkspaceHeading } from "../components/ResearchUI";

type RiskView = "risks" | "evidence" | "verification";

const statusItems = [
  { title: "重大會計估計", note: "尚未連接附註", icon: FileQuestion },
  { title: "或有負債與承諾", note: "尚未連接附註", icon: Scale },
  { title: "會計師查核意見", note: "尚未連接報告", icon: ListChecks },
];

export function RiskEvidence({ company }: { company: Company }) {
  const [view, setView] = useState<RiskView>("risks");
  const labels: Record<RiskView, { title: string; body: string }> = {
    risks: {
      title: "目前無法列出重大風險",
      body: "尚未取得原始財報附註與查核報告，不能用示意內容替代真實風險。",
    },
    evidence: {
      title: "目前沒有可覆核證據",
      body: "正式內容需要文件 ID、年度、章節、PDF 頁碼與原文片段。",
    },
    verification: {
      title: "驗證流程尚未執行",
      body: "只有在取得查詢結果、計算輸入與來源後，才能顯示驗證狀態。",
    },
  };
  return (
    <div className="page company-workspace-page">
      <WorkspaceHeading
        eyebrow="RISKS & EVIDENCE"
        title="風險與證據"
        description="將財報風險、原文證據與驗證狀態分開呈現，避免過度推論。"
      />
      <CompanyContextBar company={company} period="2024 年度合併財報" />
      <section className="risk-status-grid" aria-label="風險資料狀態">
        {statusItems.map(({ title, note, icon: Icon }) => (
          <article className="research-kpi-card" key={title}>
            <div className="row-between"><h2>{title}</h2><Icon size={17} /></div>
            <strong className="risk-pending">資料不足</strong>
            <p>{note}</p>
          </article>
        ))}
      </section>
      <section className="panel risk-evidence-panel">
        <div className="metric-selector-row">
          <div><span className="section-kicker">TRACEABLE REVIEW</span><h2>{labels[view].title}</h2></div>
          <SegmentedTabs
            label="風險與證據檢視"
            value={view}
            onChange={setView}
            items={[
              { value: "risks", label: "重大風險" },
              { value: "evidence", label: "附註證據" },
              { value: "verification", label: "驗證紀錄" },
            ]}
          />
        </div>
        <div className="risk-neutral-empty">
          <ShieldQuestion size={34} strokeWidth={1.4} />
          <h3>{labels[view].title}</h3>
          <p>{labels[view].body}</p>
          <span className="tag">尚未連接資料</span>
        </div>
      </section>
      <section className="research-disclosures" aria-label="風險資料細節">
        <details name="risk-details">
          <summary><FileSearch size={16} /><span>預計檢索範圍</span><small>按需查看</small><ChevronDown size={15} /></summary>
          <div><p>重大會計估計、客戶集中、關係人交易、或有負債、匯率／利率風險、借款與查核意見。</p></div>
        </details>
        <details name="risk-details">
          <summary><FileQuestion size={16} /><span>證據欄位</span><small>尚無資料</small><ChevronDown size={15} /></summary>
          <div><p>正式證據至少包含文件識別、年度、PDF／印刷頁碼、附註章節、原文片段與擷取時間。</p></div>
        </details>
        <details name="risk-details">
          <summary><ShieldQuestion size={16} /><span>驗證狀態與限制</span><small>尚未執行</small><ChevronDown size={15} /></summary>
          <div><p>目前沒有 Guardian 或人工覆核結果；不得顯示任何尚無證據支持的肯定性判斷。</p></div>
        </details>
      </section>
    </div>
  );
}
