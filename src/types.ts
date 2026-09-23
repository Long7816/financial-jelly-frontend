export interface Company {
  id: string;
  name: string;
  fullName: string;
  industry: string;
  available: boolean;
}

export interface DiscoveryCompany extends Company {
  exchange: "上市" | "上櫃";
  latestReport: string;
  coverage: "示意資料" | "資料準備中";
  metrics: {
    revenueGrowth: number;
    operatingMargin: number;
    debtRatio: number;
  };
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  changePercent: number;
  unit: "點" | "億元";
  trend: number[];
}

export interface SectorSnapshot {
  id: string;
  name: string;
  changePercent: number;
  advance: number;
  decline: number;
  reportCoverage: number;
}

export type EventType = "財報公告" | "法說會" | "除權息";

export interface ResearchEvent {
  id: string;
  date: string;
  companyId: string;
  companyName: string;
  type: EventType;
  session: "盤前" | "盤中" | "盤後" | "未定";
  status: "示意排程" | "待資料核對";
}

/** 金額統一使用新台幣百萬元；EPS 為元，比率為百分比。 */
export interface FinancialPeriod {
  year: number;
  revenue: number;
  operatingMargin: number;
  netIncome: number;
  eps: number;
  operatingCashFlow: number;
  debtRatio: number;
}

export interface CompanyOverview {
  companyId: string;
  dataMode: "mock" | "live";
  financialBasis: "annual-consolidated";
  financialUnit: "TWD_million";
  quote: {
    price: number;
    previousClose: number;
    date: string;
    status: "close" | "delayed";
  };
  periods: FinancialPeriod[];
  source: {
    label: string;
    documentId: string | null;
    pdfPage: number | null;
    verified: boolean;
  };
}

export type ResourceState<T> =
  | { status: "idle" | "loading" }
  | { status: "success"; data: T }
  | { status: "insufficient_data" | "conflict" | "error"; message: string };

export interface AssistantRequest {
  question: string;
  companyId?: string;
  years?: number[];
}

export interface Evidence {
  documentId: string;
  companyId: string;
  year: number;
  page: number | null;
  pageType: "pdf" | "printed";
  excerpt: string;
}

// 前端候選契約：尚待組員確認，不代表已有後端服務。
export interface AssistantAnswer {
  dataMode: "mock" | "live";
  parsed: {
    companyId: string | null;
    years: number[];
    items: string[];
    intent: string;
  };
  route: "nl2sql" | "note-rag" | "hybrid";
  answer: string;
  evidence: Evidence[];
  calculations: {
    formula: string;
    inputs: Record<string, number>;
    result: number;
    unit: string;
  }[];
  verification: {
    status: "passed" | "insufficient_data" | "conflict" | "needs_review";
    message: string;
  };
}
