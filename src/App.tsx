import { useEffect } from "react";
import {
  Link,
  Route,
  Routes,
  matchPath,
  useLocation,
  useParams,
} from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { Shell, EmptyState } from "./components/Shell";
import { Gateway } from "./pages/Gateway";
import { Overview } from "./pages/Overview";
import { Assistant } from "./pages/Assistant";
import { Explore } from "./pages/Explore";
import { Watchlist } from "./pages/Watchlist";
import { Market } from "./pages/Market";
import { Calendar } from "./pages/Calendar";
import { Technical } from "./pages/Technical";
import { MetricWorkspace } from "./pages/MetricWorkspace";
import { RiskEvidence } from "./pages/RiskEvidence";
import { Valuation } from "./pages/Valuation";
import { Institutional } from "./pages/Institutional";
import { companies } from "./data/mock";
import {
  cashFlowConfig,
  operationsConfig,
  safetyConfig,
} from "./data/companyResearch";
import { useResearch, type ResearchState } from "./hooks/useResearch";

function CompanyRoute({ research }: { research: ResearchState }) {
  const { companyId, section } = useParams();
  const company = companies.find(
    (value) => value.id === companyId && value.available,
  );
  useEffect(() => {
    if (company) research.visit(company.id);
  }, [company, research.visit]);
  if (!company) return <NotFound company />;
  if (section === "overview")
    return <Overview company={company} research={research} />;
  if (section === "technical") return <Technical company={company} />;
  if (section === "operations")
    return <MetricWorkspace company={company} config={operationsConfig} />;
  if (section === "cash-flow")
    return <MetricWorkspace company={company} config={cashFlowConfig} />;
  if (section === "financial-safety")
    return <MetricWorkspace company={company} config={safetyConfig} />;
  if (section === "risk-evidence") return <RiskEvidence company={company} />;
  if (section === "valuation") return <Valuation company={company} />;
  if (section === "institutional") return <Institutional company={company} />;
  return <NotFound company />;
}

function NotFound({ company = false }: { company?: boolean }) {
  return (
    <div className="page">
      <section className="panel not-found">
        <EmptyState
          icon={SearchX}
          title={company ? "這家公司還沒有研究資料" : "找不到這個頁面"}
        >
          目前可透過研究入口查看聯電的示意總覽。
        </EmptyState>
        <Link className="button primary" to="/">
          <ArrowLeft size={16} /> 返回研究入口
        </Link>
      </section>
    </div>
  );
}

export function App() {
  const research = useResearch();
  const { pathname } = useLocation();
  const match = matchPath("/company/:companyId/:section", pathname);
  const company = companies.find(
    (value) => value.id === match?.params.companyId && value.available,
  );
  const beforeTitles: Record<string, string> = {
    "/": "研究入口",
    "/explore": "公司探索",
    "/watchlist": "我的自選",
    "/market": "市場與產業",
    "/calendar": "財報／法說行事曆",
    "/assistant": "AI 財報助理",
  };
  const companyTitles: Record<string, string> = {
    overview: "公司總覽",
    technical: "股價與技術",
    operations: "營運與獲利",
    "cash-flow": "現金流",
    "financial-safety": "財務安全",
    "risk-evidence": "風險與證據",
    valuation: "估值與同業",
    institutional: "籌碼與法人",
  };
  const title = company
    ? companyTitles[match?.params.section ?? ""] ?? "頁面未提供"
    : beforeTitles[pathname] ?? "頁面未提供";
  return (
    <Shell
      company={company}
      title={title}
      storageWarning={research.storageWarning}
    >
      <Routes>
        <Route path="/" element={<Gateway research={research} />} />
        <Route path="/explore" element={<Explore research={research} />} />
        <Route path="/watchlist" element={<Watchlist research={research} />} />
        <Route path="/market" element={<Market />} />
        <Route path="/calendar" element={<Calendar research={research} />} />
        <Route path="/company/:companyId/:section" element={<CompanyRoute research={research} />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
