import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  CircleHelp,
  Compass,
  FileText,
  House,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Company } from "../types";
import { mockOverview, number, signed } from "../data/mock";
import mascot from "../../assets/brand/financial-konjac-mascot-v1.png";

const beforeGroups = [
  {
    title: "研究工作區",
    items: [
      { title: "研究入口", icon: Search, href: "/" },
      { title: "公司探索", icon: Compass, href: "/explore" },
      { title: "我的自選", icon: Bookmark, href: "/watchlist" },
      { title: "市場與產業", icon: BarChart3, href: "/market" },
      { title: "財報／法說行事曆", icon: CalendarDays, href: "/calendar" },
    ],
  },
];
type NavItem = { title: string; icon: LucideIcon; href?: string };
const afterGroups = (companyId: string): { title: string; items: NavItem[] }[] => [
  {
    title: "公司研究",
    items: [
      { title: "公司總覽", icon: House, href: `/company/${companyId}/overview` },
      { title: "股價與技術", icon: ChartNoAxesCombined, href: `/company/${companyId}/technical` },
    ],
  },
  {
    title: "財報分析",
    items: [
      { title: "營運與獲利", icon: TrendingUp, href: `/company/${companyId}/operations` },
      { title: "現金流", icon: Wallet, href: `/company/${companyId}/cash-flow` },
      { title: "財務安全", icon: ShieldCheck, href: `/company/${companyId}/financial-safety` },
      { title: "風險與證據", icon: FileText, href: `/company/${companyId}/risk-evidence` },
    ],
  },
  {
    title: "比較與市場",
    items: [
      { title: "估值與同業", icon: BarChart3, href: `/company/${companyId}/valuation` },
      { title: "籌碼與法人", icon: Users, href: `/company/${companyId}/institutional` },
    ],
  },
];

export function Mascot({ className = "" }: { className?: string }) {
  return (
    <img
      className={`mascot ${className}`}
      src={mascot}
      alt="財報蒟蒻品牌角色"
    />
  );
}

function Sidebar({
  company,
  close,
}: {
  company?: Company;
  close?: () => void;
}) {
  const location = useLocation();
  const quote = mockOverview.quote;
  const change = quote.price - quote.previousClose;
  return (
    <>
      <Link
        className="brand"
        to="/"
        onClick={close}
        aria-label="財報蒟蒻，返回研究入口"
      >
        <span className="brand-symbol">
          <Mascot className="brand-mascot" />
        </span>
        <span>
          <strong>財報蒟蒻</strong>
          <small>台灣 IFRS 財報研究</small>
        </span>
      </Link>
      <div className="sidebar-scroll">
        {company && (
          <>
            <Link className="back-link" to="/" onClick={close}>
              <ArrowLeft size={14} /> 返回研究入口
            </Link>
            <section className="company-card" aria-label="目前研究公司">
              <div className="row-between">
                <span className="eyebrow">目前研究</span>
                <Link to="/" onClick={close}>
                  切換公司
                </Link>
              </div>
              <h2>
                <span className="mono">{company.id}</span> {company.name}
              </h2>
              <p>{company.industry}</p>
              <div className="quote-row">
                <div className="quote">
                  <strong className="mono">{number(quote.price, 2)}</strong>
                  <span>TWD</span>
                </div>
                <div className={change >= 0 ? "up" : "down"}>
                  <span className="mono">
                    {change >= 0 ? "▲" : "▼"} {signed(change, 2)}（
                    {signed((change / quote.previousClose) * 100, 2)}%）
                  </span>
                </div>
              </div>
              <small>{quote.date} 盤後 · 示意行情</small>
            </section>
          </>
        )}
        <nav aria-label="主要導覽">
          {(company ? afterGroups(company.id) : beforeGroups).map((group) => (
            <div className="nav-group" key={group.title}>
              <p className="nav-caption">{group.title}</p>
              {group.items.map(({ title, icon: Icon, href }: NavItem) =>
                href ? (
                  <Link
                    key={title}
                    to={href}
                    onClick={close}
                    className={`nav-item ${location.pathname === href ? "active" : ""}`}
                    aria-current={
                      location.pathname === href ? "page" : undefined
                    }
                  >
                    <Icon size={18} />
                    <span>{title}</span>
                    {location.pathname === href && (
                      <span className="active-dot" />
                    )}
                  </Link>
                ) : (
                  <button
                    key={title}
                    className="nav-item pending"
                    disabled
                    title="後續階段開放"
                  >
                    <Icon size={18} />
                    <span>{title}</span>
                    <small>待開放</small>
                  </button>
                ),
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <Link
          to="/assistant"
          onClick={close}
          className={`assistant-link ${location.pathname === "/assistant" ? "selected" : ""}`}
          aria-current={location.pathname === "/assistant" ? "page" : undefined}
        >
          <Mascot />
          <span>
            <strong>AI 財報助理</strong>
            <small>看懂數字，也看懂原因</small>
          </span>
          <ChevronRight size={16} />
        </Link>
      </div>
    </>
  );
}

export function Shell({
  company,
  title,
  children,
  storageWarning,
}: {
  company?: Company;
  title: string;
  children: ReactNode;
  storageWarning: boolean;
}) {
  const mobileNav = useRef<HTMLDialogElement>(null);
  const help = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => {
    mobileNav.current?.close();
    menuButton.current?.focus();
  };
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${title}｜財報蒟蒻`;
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname, title]);
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        跳至主要內容
      </a>
      <aside className="sidebar desktop-sidebar">
        <Sidebar company={company} />
      </aside>
      <dialog
        ref={mobileNav}
        className="mobile-nav"
        aria-label="導覽選單"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <button
          className="icon-button close-nav"
          onClick={closeMenu}
          aria-label="關閉導覽"
        >
          <X size={19} />
        </button>
        <Sidebar company={company} close={closeMenu} />
      </dialog>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuButton}
              className="icon-button mobile-menu-button"
              onClick={() => mobileNav.current?.showModal()}
              aria-label="開啟導覽選單"
            >
              <Menu size={21} />
            </button>
            <Link to="/">研究工作台</Link>
            <ChevronRight size={13} />
            <span>
              {company ? `${company.id} ${company.name} / ` : ""}
              {title}
            </span>
          </div>
          <div className="topbar-meta">
            <span className="demo-badge">
              <span />
              示意資料
            </span>
            <span className="topbar-note">非即時行情</span>
            <button
              className="icon-button"
              aria-label="資料與使用說明"
              onClick={() => help.current?.showModal()}
            >
              <CircleHelp size={18} />
            </button>
          </div>
        </header>
        {storageWarning && (
          <p className="storage-warning" role="status">
            瀏覽器無法儲存紀錄；目前仍可操作，關閉頁面後可能不會保留。
          </p>
        )}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <span>財報蒟蒻 · 讓財報變得好理解</span>
          <span>學生專題 · 示意資料，非投資建議</span>
        </footer>
      </div>
      <dialog className="help-dialog" ref={help} aria-labelledby="help-title">
        <div className="row-between">
          <h2 id="help-title">關於這份研究工作台</h2>
          <button
            className="icon-button"
            aria-label="關閉說明"
            onClick={() => help.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <p>
          目前提供聯電的介面示範。所有行情、財務數字及結論均為固定測試資料，未串接真實市場、財報或
          AI 服務。
        </p>
        <p>
          最近研究與自選清單只儲存在這個瀏覽器。公司分析頁目前使用固定示意資料，真實內容仍待後端串接。
        </p>
        <button
          className="button primary"
          onClick={() => help.current?.close()}
        >
          了解 <ArrowRight size={16} />
        </button>
      </dialog>
    </div>
  );
}

export function EmptyState({
  title,
  children,
  icon: Icon = Sparkles,
}: {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={23} strokeWidth={1.4} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
