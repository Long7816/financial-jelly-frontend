import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  History,
  Search,
  X,
  BookOpen,
  FileCheck2,
  Layers3,
} from "lucide-react";
import { companies, searchCompanies } from "../data/mock";
import type { ResearchState } from "../hooks/useResearch";
import { EmptyState } from "../components/Shell";

export function Gateway({ research }: { research: ResearchState }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const results = searchCompanies(query);
  const hasQuery = query.trim().length > 0;
  const chooseQuery = (value: string) => {
    setQuery(value);
    setSubmitted(false);
    input.current?.focus();
  };
  const saved = research.watchlist.includes("2303");
  return (
    <div className="page gateway-page">
      <section className="search-hero" aria-labelledby="gateway-title">
        <span className="section-kicker">
          <BookOpen size={14} /> 從一家公司，開始理解財報
        </span>
        <h1 id="gateway-title">
          今天想研究<span>哪一家公司？</span>
        </h1>
        <p className="hero-description">
          從營運、現金流到財報附註，讓每一個數字都有脈絡。
        </p>
        <form
          className="company-search"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            const availableMatches = results.filter(
              (company) => company.available,
            );
            if (availableMatches.length === 1) {
              navigate(`/company/${availableMatches[0].id}/overview`);
            }
          }}
          role="search"
          aria-label="搜尋研究公司"
        >
          <Search size={22} aria-hidden="true" />
          <label className="sr-only" htmlFor="company-query">
            公司名稱或股票代號
          </label>
          <input
            id="company-query"
            ref={input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSubmitted(false);
            }}
            placeholder="輸入公司名稱或股票代號，例如 2303 聯電"
            autoComplete="off"
            maxLength={80}
            aria-controls="company-results"
          />
          {query && (
            <button
              type="button"
              className="icon-button clear-search"
              aria-label="清除搜尋"
              onClick={() => chooseQuery("")}
            >
              <X size={17} />
            </button>
          )}
        </form>
        <div id="company-results" className="search-results" aria-live="polite">
          {submitted && !hasQuery && (
            <p className="search-message">請先輸入公司名稱或股票代號。</p>
          )}
          {hasQuery && results.length === 0 && (
            <p className="search-message">
              找不到「{query}」。試試股票代號 2303，或公司名稱「聯電」。
            </p>
          )}
          {hasQuery &&
            results.map((company) => (
              <div className="search-result" key={company.id}>
                <div className="result-identity">
                  <span className="company-monogram mono">{company.id}</span>
                  <div>
                    <strong>
                      {company.name} <small>{company.fullName}</small>
                    </strong>
                    <p>
                      {company.industry} <span>·</span>{" "}
                      {company.available
                        ? "2024 年度合併財報・示意資料"
                        : "尚未提供研究資料"}
                    </p>
                  </div>
                </div>
                {company.available ? (
                  <Link
                    className="button primary result-enter"
                    to={`/company/${company.id}/overview`}
                  >
                    進入研究 <ArrowRight size={16} />
                  </Link>
                ) : (
                  <span className="tag">資料準備中</span>
                )}
              </div>
            ))}
        </div>
        <div className="search-chips">
          <span>試著搜尋</span>
          {companies.slice(0, 3).map((company) => (
            <button
              key={company.id}
              onClick={() => chooseQuery(`${company.id}`)}
            >
              <span className="mono">{company.id}</span> {company.name}
            </button>
          ))}
        </div>
        <p className="hero-footnote">
          目前開放聯電示意研究；其他公司將陸續加入。
        </p>
      </section>
      <div className="gateway-panels">
        <section className="panel recent-panel" aria-labelledby="recent-title">
          <div className="panel-heading">
            <div>
              <History size={19} />
              <h2 id="recent-title">最近研究</h2>
            </div>
            <Link className="panel-link" to="/explore">
              公司探索 <ArrowRight size={14} />
            </Link>
          </div>
          {research.recent.length > 0 ? (
            research.recent.map((id) => (
              <Link
                className="research-row"
                to={`/company/${id}/overview`}
                key={id}
              >
                <span className="company-monogram mono">{id}</span>
                <div>
                  <strong>
                    {companies.find((company) => company.id === id)?.name}
                  </strong>
                  <p>2024 年度合併財報 · 示意資料</p>
                </div>
                <span className="row-action">
                  繼續研究 <ArrowRight size={16} />
                </span>
              </Link>
            ))
          ) : (
            <>
              <EmptyState icon={History} title="你的下一個研究，從這裡開始">
                查看公司後，最近研究會自動保留在這裡。
              </EmptyState>
              <Link className="starter-card" to="/company/2303/overview">
                <span className="starter-icon">
                  <Layers3 size={21} />
                </span>
                <div>
                  <strong>先用聯電，走一遍財報研究</strong>
                  <p>公司總覽 · 4 年趨勢 · 五面向摘要</p>
                </div>
                <ArrowRight size={19} />
              </Link>
            </>
          )}
        </section>
        <section
          className="panel watchlist-panel"
          aria-labelledby="watchlist-title"
        >
          <div className="panel-heading">
            <div>
              <Bookmark size={19} />
              <h2 id="watchlist-title">我的自選</h2>
              <span className="count-badge">{research.watchlist.length}</span>
            </div>
            <Link className="panel-link" to="/watchlist">
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>
          {saved ? (
            <div className="watch-row">
              <Link to="/company/2303/overview">
                <span className="company-monogram mono">2303</span>
                <div>
                  <strong>聯電</strong>
                  <p>2024 年度 · 示意研究</p>
                </div>
                <ArrowRight size={16} />
              </Link>
              <button
                className="icon-button saved"
                onClick={() => research.toggleWatch("2303")}
                aria-label="從自選移除聯電"
              >
                <Bookmark size={18} fill="currentColor" />
              </button>
            </div>
          ) : (
            <>
              <EmptyState icon={Bookmark} title="把關注的公司，放在一起">
                加入自選，下次就能快速回到研究。
              </EmptyState>
              <button
                className="button secondary add-watch"
                onClick={() => research.toggleWatch("2303")}
              >
                <Bookmark size={16} /> 將聯電加入自選
              </button>
            </>
          )}
          <p className="local-note">
            <Check size={13} /> 儲存在本機，無須登入
          </p>
        </section>
      </div>
      <section className="panel calendar-preview">
        <div className="panel-heading">
          <div>
            <CalendarDays size={19} />
            <h2>財報與法說日程</h2>
          </div>
          <Link className="panel-link" to="/calendar">
            查看行事曆 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="calendar-empty">
          <span className="date-illustration">
            <CalendarDays size={24} strokeWidth={1.4} />
          </span>
          <div>
            <strong>重要日程，不錯過</strong>
            <p>先查看清楚標記的示意排程；正式事件資料尚未串接。</p>
          </div>
          <FileCheck2 size={27} strokeWidth={1.1} />
        </div>
      </section>
    </div>
  );
}
