import type {
  CompanyOverview,
  DiscoveryCompany,
  MarketIndex,
  ResearchEvent,
  SectorSnapshot,
} from "../types";

// 名稱用於介面搜尋；只有聯電提供本次驗收的示意資料。
export const companies: DiscoveryCompany[] = [
  {
    id: "2303",
    name: "聯電",
    fullName: "聯華電子",
    industry: "半導體・晶圓代工",
    available: true,
    exchange: "上市",
    latestReport: "2024 年度",
    coverage: "示意資料",
    metrics: {
      revenueGrowth: 4.4,
      operatingMargin: 22.4,
      debtRatio: 32.8,
    },
  },
  {
    id: "2330",
    name: "台積電",
    fullName: "台灣積體電路製造",
    industry: "半導體",
    available: false,
    exchange: "上市",
    latestReport: "尚未串接",
    coverage: "資料準備中",
    metrics: {
      revenueGrowth: 8.6,
      operatingMargin: 45.7,
      debtRatio: 28.4,
    },
  },
  {
    id: "2454",
    name: "聯發科",
    fullName: "聯發科技",
    industry: "半導體",
    available: false,
    exchange: "上市",
    latestReport: "尚未串接",
    coverage: "資料準備中",
    metrics: {
      revenueGrowth: 11.2,
      operatingMargin: 18.9,
      debtRatio: 38.1,
    },
  },
  {
    id: "2317",
    name: "鴻海",
    fullName: "鴻海精密",
    industry: "電子製造",
    available: false,
    exchange: "上市",
    latestReport: "尚未串接",
    coverage: "資料準備中",
    metrics: {
      revenueGrowth: 6.1,
      operatingMargin: 3.2,
      debtRatio: 57.6,
    },
  },
  {
    id: "3034",
    name: "聯詠",
    fullName: "聯詠科技",
    industry: "半導體・IC 設計",
    available: false,
    exchange: "上市",
    latestReport: "尚未串接",
    coverage: "資料準備中",
    metrics: {
      revenueGrowth: -2.7,
      operatingMargin: 20.1,
      debtRatio: 31.4,
    },
  },
];

/** 市場資料均為固定 UI 情境，不代表任何日期的真實行情。 */
export const mockMarketIndices: MarketIndex[] = [
  {
    id: "twse",
    name: "臺灣加權指數",
    value: 20436.52,
    changePercent: 0.82,
    unit: "點",
    trend: [42, 47, 45, 53, 51, 59, 64],
  },
  {
    id: "tpex",
    name: "櫃買指數",
    value: 251.84,
    changePercent: -0.43,
    unit: "點",
    trend: [54, 57, 55, 50, 52, 48, 46],
  },
  {
    id: "turnover",
    name: "市場成交值",
    value: 4185,
    changePercent: 6.7,
    unit: "億元",
    trend: [38, 44, 41, 49, 58, 55, 61],
  },
];

export const mockSectors: SectorSnapshot[] = [
  {
    id: "semiconductor",
    name: "半導體",
    changePercent: 1.28,
    advance: 41,
    decline: 24,
    reportCoverage: 78,
  },
  {
    id: "components",
    name: "電子零組件",
    changePercent: 0.46,
    advance: 36,
    decline: 31,
    reportCoverage: 69,
  },
  {
    id: "finance",
    name: "金融",
    changePercent: -0.31,
    advance: 12,
    decline: 19,
    reportCoverage: 83,
  },
  {
    id: "shipping",
    name: "航運",
    changePercent: -1.04,
    advance: 8,
    decline: 17,
    reportCoverage: 64,
  },
];

/** 行事曆內容是介面測試排程，不是公司正式公告。 */
export const mockResearchEvents: ResearchEvent[] = [
  {
    id: "event-1",
    date: "2026-04-08",
    companyId: "2303",
    companyName: "聯電",
    type: "法說會",
    session: "盤後",
    status: "示意排程",
  },
  {
    id: "event-2",
    date: "2026-04-14",
    companyId: "2330",
    companyName: "台積電",
    type: "財報公告",
    session: "盤後",
    status: "待資料核對",
  },
  {
    id: "event-3",
    date: "2026-04-17",
    companyId: "2454",
    companyName: "聯發科",
    type: "法說會",
    session: "盤後",
    status: "示意排程",
  },
  {
    id: "event-4",
    date: "2026-04-23",
    companyId: "2317",
    companyName: "鴻海",
    type: "財報公告",
    session: "未定",
    status: "待資料核對",
  },
  {
    id: "event-5",
    date: "2026-04-28",
    companyId: "3034",
    companyName: "聯詠",
    type: "除權息",
    session: "盤前",
    status: "示意排程",
  },
];

/** 全部數字均為固定 UI 測試資料，不是聯電真實財報或行情。 */
export const mockOverview: CompanyOverview = {
  companyId: "2303",
  dataMode: "mock",
  financialBasis: "annual-consolidated",
  financialUnit: "TWD_million",
  quote: {
    price: 45.6,
    previousClose: 45.05,
    date: "2025/03/31",
    status: "close",
  },
  periods: [
    {
      year: 2021,
      revenue: 213000,
      operatingMargin: 24.3,
      netIncome: 55700,
      eps: 4.48,
      operatingCashFlow: 80000,
      debtRatio: 35.6,
    },
    {
      year: 2022,
      revenue: 278700,
      operatingMargin: 37.4,
      netIncome: 87100,
      eps: 7.01,
      operatingCashFlow: 123000,
      debtRatio: 32.4,
    },
    {
      year: 2023,
      revenue: 222800,
      operatingMargin: 25.2,
      netIncome: 61400,
      eps: 4.93,
      operatingCashFlow: 87200,
      debtRatio: 31.8,
    },
    {
      year: 2024,
      revenue: 232600,
      operatingMargin: 22.4,
      netIncome: 51000,
      eps: 4.09,
      operatingCashFlow: 90800,
      debtRatio: 32.8,
    },
  ],
  source: {
    label: "前端固定示意資料・未經財務覆核",
    documentId: null,
    pdfPage: null,
    verified: false,
  },
};

export function searchCompanies(query: string): DiscoveryCompany[] {
  const normalized = query
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\s+/g, "")
    .replaceAll("台", "臺");
  if (!normalized) return [];
  return companies.filter((company) =>
    `${company.id}${company.name}${company.fullName}`
      .toLocaleLowerCase()
      .replaceAll("台", "臺")
      .includes(normalized),
  );
}

export function growthRate(current: number, previous: number): number | null {
  return previous === 0
    ? null
    : ((current - previous) / Math.abs(previous)) * 100;
}

export const number = (value: number, digits = 0) =>
  value.toLocaleString("zh-TW", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
export const signed = (value: number, digits = 1) =>
  `${value > 0 ? "+" : ""}${number(value, digits)}`;
