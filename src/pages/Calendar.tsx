import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  FileBarChart,
  ListFilter,
  Mic2,
  Sparkles,
} from "lucide-react";
import {
  MetricCard,
  MockStrip,
  SegmentedTabs,
  WorkspaceHeading,
} from "../components/ResearchUI";
import { companies, mockResearchEvents } from "../data/mock";
import type { EventType } from "../types";
import type { ResearchState } from "../hooks/useResearch";

type CalendarView = "list" | "month";
type EventFilter = "全部" | EventType;

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
const monthCells = [
  null,
  null,
  null,
  ...Array.from({ length: 30 }, (_, index) => index + 1),
  null,
  null,
];

export function Calendar({ research }: { research: ResearchState }) {
  const [view, setView] = useState<CalendarView>("list");
  const [filter, setFilter] = useState<EventFilter>("全部");
  const [watchOnly, setWatchOnly] = useState(false);
  const visibleEvents = useMemo(
    () =>
      mockResearchEvents.filter(
        (event) =>
          (filter === "全部" || event.type === filter) &&
          (!watchOnly || research.watchlist.includes(event.companyId)),
      ),
    [filter, research.watchlist, watchOnly],
  );
  const count = (type: EventType) =>
    mockResearchEvents.filter((event) => event.type === type).length;
  const eventForDay = (day: number) =>
    visibleEvents.filter(
      (event) => Number(event.date.slice(-2)) === day,
    );
  const companyHref = (companyId: string) => {
    const company = companies.find((item) => item.id === companyId);
    return company?.available
      ? `/company/${companyId}/overview`
      : `/explore?q=${companyId}`;
  };

  return (
    <div className="page workspace-page">
      <WorkspaceHeading
        eyebrow="FINANCIAL CALENDAR"
        title="財報／法說行事曆"
        description="把財報公告、法說會與除權息放在同一個研究時間軸。"
        actions={
          <span className="selection-chip">
            <CalendarDays size={15} /> 示意月份 2026 年 4 月
          </span>
        }
      />
      <MockStrip>所有事件都是介面測試排程，不是公司正式公告</MockStrip>
      <section className="workspace-metrics three" aria-label="事件摘要">
        <MetricCard
          icon={FileBarChart}
          label="財報公告"
          value={count("財報公告")}
          note="示意事件"
          tone="clay"
        />
        <MetricCard
          icon={Mic2}
          label="法說會"
          value={count("法說會")}
          note="示意事件"
        />
        <MetricCard
          icon={Sparkles}
          label="除權息"
          value={count("除權息")}
          note="示意事件"
          tone="amber"
        />
      </section>
      <section className="panel calendar-workspace">
        <div className="calendar-toolbar">
          <SegmentedTabs
            label="行事曆檢視"
            value={view}
            onChange={setView}
            items={[
              { value: "list", label: "近期清單" },
              { value: "month", label: "月曆" },
            ]}
          />
          <div className="event-filters" aria-label="事件類型篩選">
            <ListFilter size={15} />
            {(["全部", "財報公告", "法說會", "除權息"] as EventFilter[]).map(
              (item) => (
                <button
                  key={item}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ),
            )}
            <button
              aria-pressed={watchOnly}
              onClick={() => setWatchOnly((current) => !current)}
            >
              只看自選
            </button>
          </div>
        </div>
        {view === "list" ? (
          <div className="event-list">
            {visibleEvents.map((event) => (
              <article className="event-row" key={event.id}>
                <time dateTime={event.date}>
                  <strong className="mono">{event.date.slice(-2)}</strong>
                  <span>4 月</span>
                </time>
                <span className={["event-type", event.type].join(" ")}>
                  {event.type}
                </span>
                <div className="event-company">
                  <Link to={companyHref(event.companyId)}>
                    <strong>
                    <span className="mono">{event.companyId}</span>{" "}
                    {event.companyName}
                    </strong>
                  </Link>
                  <p>
                    <Clock3 size={13} /> {event.session} · {event.status}
                  </p>
                </div>
                <span className="tag">Demo Mock</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="month-view">
            <div className="month-weekdays">
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="month-grid">
              {monthCells.map((day, index) => (
                <div
                  className={["month-cell", day ? "" : "outside"].join(" ")}
                  key={index}
                >
                  {day && (
                    <>
                      <span className="mono">{day}</span>
                      {eventForDay(day).map((event) => (
                        <Link
                          className="month-event"
                          to={companyHref(event.companyId)}
                          key={event.id}
                        >
                          <strong>{event.companyName}</strong>
                          <small>{event.type}</small>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {visibleEvents.length === 0 && (
          <div className="inline-empty">
            <CalendarDays size={22} />
            <strong>此篩選沒有示意事件</strong>
            <button
              onClick={() => {
                setFilter("全部");
                setWatchOnly(false);
              }}
            >
              清除篩選
            </button>
          </div>
        )}
      </section>
      <details className="workspace-details panel">
        <summary>提醒、時區與來源規則</summary>
        <p>
          正式資料需記錄來源、公告時間、時區與更新時間。提醒功能尚未實作，本頁不會發送通知。
        </p>
      </details>
    </div>
  );
}
