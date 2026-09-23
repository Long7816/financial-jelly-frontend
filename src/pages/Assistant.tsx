import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Calculator,
  ChevronRight,
  FileSearch,
  FileText,
  Info,
  Route,
  ShieldQuestion,
  Sparkles,
} from "lucide-react";
import { MockStrip, WorkspaceHeading } from "../components/ResearchUI";
import { Mascot } from "../components/Shell";
import { overviewMetrics } from "../data/companyResearch";
import { growthRate, number } from "../data/mock";

const isRevenueDemoQuestion = (question: string) => {
  const normalized = question.replace(/\s/g, "");
  return (
    normalized.includes("聯電") &&
    normalized.includes("2024") &&
    normalized.includes("營收") &&
    (normalized.includes("前一年") || normalized.includes("2023"))
  );
};

// 無公司前／後共用同一頁。這裡只示範互動與資訊層級，不假裝已執行 Agent。
export function Assistant() {
  const [question, setQuestion] = useState("");
  const [notice, setNotice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const suggestions = [
    "聯電 2024 年的營收比前一年增加多少？",
    "營業現金流和稅後純益有什麼差別？",
    "閱讀財報時，應注意哪些附註風險？",
  ];
  const revenueMetric = overviewMetrics.find((metric) => metric.id === "revenue")!;
  const revenue2023 = revenueMetric.values.find((point) => point.period === "2023")!.value;
  const revenue2024 = revenueMetric.values.find((point) => point.period === "2024")!.value;
  const revenueDifference = revenue2024 - revenue2023;
  const revenueGrowth = growthRate(revenue2024, revenue2023)!;
  const showRevenueDemo = submitted && isRevenueDemoQuestion(question);
  useEffect(() => {
    if (!submitted) return;
    resultRef.current?.scrollIntoView({ block: "start" });
    resultRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  const selectSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
    setNotice("");
    setSubmitted(false);
    document.getElementById("question")?.focus();
  };

  return (
    <div className="page workspace-page assistant-page">
      <WorkspaceHeading
        eyebrow="FINANCIAL ASSISTANT"
        title="AI 財報助理"
        description="先看白話結論，再按需要展開計算、流程與原始證據。"
      />
      <MockStrip>回答服務尚未串接；目前只展示提問與可追溯回答的介面結構</MockStrip>
      <section className="assistant-workspace">
        <div className="assistant-welcome">
          <Mascot />
          <span className="section-kicker">看懂數字，也看懂原因</span>
          <h2>把財報裡的問號，交給蒟蒻。</h2>
          <p>直接用日常用語提問，不必先選公司或期間。</p>
        </div>
        <div className="suggestions" aria-label="提問範例">
          {suggestions.map((suggestion, index) => (
            <button key={suggestion} onClick={() => selectSuggestion(suggestion)}>
              <span className="suggestion-label">
                {(["比較數字", "理解指標", "探索風險"] as const)[index]}
              </span>
              <span>{suggestion}</span>
              <Sparkles size={16} />
            </button>
          ))}
        </div>
        <form
          className="question-form"
          onSubmit={(event) => {
            event.preventDefault();
            const hasQuestion = Boolean(question.trim());
            setSubmitted(hasQuestion);
            setNotice(
              hasQuestion
                ? isRevenueDemoQuestion(question)
                  ? "已載入固定示範回答；這是前端 Mock 計算，不是 AI 或真實財報分析結果。"
                  : "問題已保留。回答服務尚未串接，下方內容是待串接狀態，不是 AI 分析結果。"
                : "請先輸入你想了解的財報問題。",
            );
          }}
        >
          <label className="sr-only" htmlFor="question">
            財報問題
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              setNotice("");
              setSubmitted(false);
            }}
            placeholder="例如：聯電 2024 年營業現金流和稅後純益是否一致？"
            maxLength={2000}
            rows={4}
          />
          <div className="question-actions">
            <span>
              <FileText size={14} /> 正式回答會標示公式、期間與來源
            </span>
            <button className="button primary" type="submit" aria-label="送出財報問題">
              <ArrowUp size={17} /> 送出
            </button>
          </div>
        </form>
        <p className="assistant-notice" role="status">
          {notice || (
            <>
              <Info size={14} /> 不需要先選公司；系統會從問題中解析，無法判斷時再詢問。
            </>
          )}
        </p>

        {submitted && (
          <section
            ref={resultRef}
            tabIndex={-1}
            className="assistant-result-preview"
            aria-label={showRevenueDemo ? "固定示範回答預覽" : "待串接回答預覽"}
          >
            <div className="parsed-slots" aria-label="問題解析結果">
              <span>公司：{showRevenueDemo ? "聯電（2303）" : "待 Agent 解析"}</span>
              <span>期間：{showRevenueDemo ? "2024 對 2023" : "待 Agent 解析"}</span>
              <span>意圖：{showRevenueDemo ? "營收跨期比較" : "待 Agent 解析"}</span>
              <span>路由：{showRevenueDemo ? "NL2SQL 候選" : "尚未決定"}</span>
            </div>
            <div className="assistant-result-grid">
              <article className="panel assistant-answer-placeholder">
                <span className="section-kicker">PLAIN-LANGUAGE ANSWER</span>
                <h3>白話回答</h3>
                {showRevenueDemo ? (
                  <div className="pending-answer mock-calculation-answer">
                    <Calculator size={24} />
                    <div>
                      <strong>固定示範資料顯示營收增加</strong>
                      <p>
                        2024 年營收為 {number(revenue2024)} 百萬元，2023 年為 {number(revenue2023)} 百萬元；增加 {number(revenueDifference)} 百萬元，約 {number(revenueGrowth, 1)}%。
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pending-answer">
                    <FileSearch size={24} />
                    <div>
                      <strong>尚未產生分析結果</strong>
                      <p>串接完成後，這裡會先顯示結論、關鍵數字與資料不足提醒。</p>
                    </div>
                  </div>
                )}
              </article>
              <aside className="panel assistant-process" aria-label="處理流程">
                <h3>處理狀態</h3>
                {[
                  [Route, "問題解析與路由", showRevenueDemo ? "固定樣本" : "尚未執行"],
                  [FileSearch, "數值／附註檢索", showRevenueDemo ? "Mock 數值" : "尚未執行"],
                  [Calculator, "程式計算", showRevenueDemo ? "前端公式" : "尚未執行"],
                  [ShieldQuestion, "證據與答案驗證", "尚未執行"],
                ].map(([Icon, label, status]) => {
                  const StepIcon = Icon as typeof Route;
                  return (
                    <div className="assistant-process-row" key={label as string}>
                      <StepIcon size={16} />
                      <span>{label as string}</span>
                      <small>{status as string}</small>
                    </div>
                  );
                })}
              </aside>
            </div>
            <div className="assistant-disclosures">
              {["計算方式與輸入值", "原始證據與頁碼", "驗證結果與限制"].map(
                (label, index) => (
                  <details key={label}>
                    <summary>
                      {label} <ChevronRight size={15} />
                    </summary>
                    <p>
                      {showRevenueDemo
                        ? index === 0
                          ? `（${number(revenue2024)}－${number(revenue2023)}）÷｜${number(revenue2023)}｜×100%＝${number(revenueGrowth, 1)}%；中間值未先四捨五入。`
                          : index === 1
                            ? "數值來自前端固定 Mock 情境，沒有原始財報文件 ID、PDF 頁碼或附註片段。"
                            : "尚未執行 Guardian 或人工覆核；本示範答案不可當成真實聯電財報結論。"
                        : "等待後端回傳可覆核資料；目前沒有可展示的真實內容。"}
                    </p>
                  </details>
                ),
              )}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
