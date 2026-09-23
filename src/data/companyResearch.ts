export type ChangeMode = "percent" | "point" | "absolute";

export interface MetricPoint {
  period: string;
  value: number;
}

export interface ResearchMetric {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  decimals: number;
  changeMode: ChangeMode;
  values: MetricPoint[];
  note: string;
  formula: string;
}

export interface ResearchWorkspaceConfig {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  periodLabel: string;
  kpiMetricIds: string[];
  metrics: ResearchMetric[];
  detailNote: string;
}

const annual = (values: number[]): MetricPoint[] =>
  values.map((value, index) => ({ period: String(2020 + index), value }));

const recentDays = (values: number[]): MetricPoint[] =>
  values.map((value, index) => ({ period: ["03/21", "03/24", "03/25", "03/26", "03/27"][index], value }));

export const overviewMetrics: ResearchMetric[] = [
  {
    id: "revenue",
    label: "營業收入",
    shortLabel: "營收",
    unit: "百萬元",
    decimals: 0,
    changeMode: "percent",
    values: annual([176821, 213011, 278705, 222533, 232580]),
    note: "顯示年度合併營業收入；變動原因需搭配損益表與附註確認。",
    formula: "營收年增率＝（本期營收－前期營收）÷｜前期營收｜× 100%",
  },
  {
    id: "netIncome",
    label: "稅後純益",
    shortLabel: "純益",
    unit: "百萬元",
    decimals: 0,
    changeMode: "percent",
    values: annual([29400, 55700, 87100, 61400, 51000]),
    note: "歸屬口徑仍待正式資料契約確認，目前只示範資訊層級。",
    formula: "純益年增率＝（本期純益－前期純益）÷｜前期純益｜× 100%",
  },
  {
    id: "eps",
    label: "每股盈餘（EPS）",
    shortLabel: "EPS",
    unit: "元",
    decimals: 2,
    changeMode: "percent",
    values: annual([2.42, 4.48, 7.01, 4.93, 4.09]),
    note: "EPS 需確認加權平均流通在外股數與稀釋效果。",
    formula: "基本 EPS＝歸屬母公司普通股股東之損益÷加權平均流通在外股數",
  },
  {
    id: "operatingCashFlow",
    label: "營業活動現金流量",
    shortLabel: "營業現金流",
    unit: "百萬元",
    decimals: 0,
    changeMode: "percent",
    values: annual([58000, 80000, 123000, 87200, 90800]),
    note: "單一年度現金流可能受營運資金與一次性項目影響。",
    formula: "取自合併現金流量表之營業活動淨現金流量",
  },
];

export const operationsConfig: ResearchWorkspaceConfig = {
  id: "operations",
  eyebrow: "OPERATIONS & PROFITABILITY",
  title: "營運與獲利",
  description: "用同一張五年圖切換成長、利潤率與股東報酬指標。",
  periodLabel: "2020—2024 年度合併",
  kpiMetricIds: ["revenue", "operatingIncome", "netIncome"],
  detailNote: "產品組合、售價、成本與產能利用率等原因，必須等附註或法說證據串接後再說明。",
  metrics: [
    overviewMetrics[0],
    {
      id: "operatingIncome",
      label: "營業利益",
      shortLabel: "營業利益",
      unit: "百萬元",
      decimals: 0,
      changeMode: "percent",
      values: annual([23872, 51759, 104302, 56078, 52097]),
      note: "營業利益反映本業結果；正式數值需確認損益表科目與期間口徑。",
      formula: "營業利益＝營業毛利－營業費用（依財報表達口徑）",
    },
    overviewMetrics[1],
    {
      id: "grossMargin",
      label: "毛利率",
      shortLabel: "毛利率",
      unit: "%",
      decimals: 1,
      changeMode: "point",
      values: annual([22.1, 33.3, 45.1, 34.9, 32.4]),
      note: "只描述比率變化，不直接歸因於售價、成本或產品組合。",
      formula: "毛利率＝營業毛利÷營業收入×100%",
    },
    {
      id: "operatingMargin",
      label: "營業利益率",
      shortLabel: "營益率",
      unit: "%",
      decimals: 1,
      changeMode: "point",
      values: annual([13.5, 24.3, 37.4, 25.2, 22.4]),
      note: "營業利益率反映本業獲利占營收比例，仍需查看費用結構。",
      formula: "營業利益率＝營業利益÷營業收入×100%",
    },
    {
      id: "netMargin",
      label: "稅後純益率",
      shortLabel: "純益率",
      unit: "%",
      decimals: 1,
      changeMode: "point",
      values: annual([16.6, 26.1, 31.3, 27.6, 21.9]),
      note: "包含業外與所得稅影響，不能等同營業利益率。",
      formula: "稅後純益率＝稅後純益÷營業收入×100%",
    },
    overviewMetrics[2],
    {
      id: "roe",
      label: "股東權益報酬率（ROE）",
      shortLabel: "ROE",
      unit: "%",
      decimals: 1,
      changeMode: "point",
      values: annual([7.6, 12.8, 19.6, 13.1, 10.5]),
      note: "正式計算需使用期初與期末平均權益並確認歸屬口徑。",
      formula: "ROE＝歸屬母公司稅後純益÷平均歸屬母公司權益×100%",
    },
  ],
};

export const cashFlowConfig: ResearchWorkspaceConfig = {
  id: "cash-flow",
  eyebrow: "CASH FLOW",
  title: "現金流",
  description: "比較獲利、營業現金流與資本支出，不把單一數字當成結論。",
  periodLabel: "2020—2024 年度合併",
  kpiMetricIds: ["operatingCashFlow", "freeCashFlow", "capitalExpenditure"],
  detailNote: "自由現金流採用本頁明示公式；正式資料必須確認資本支出的科目來源。",
  metrics: [
    overviewMetrics[3],
    {
      id: "investingCashFlow",
      label: "投資活動現金流量",
      shortLabel: "投資現金流",
      unit: "百萬元",
      decimals: 0,
      changeMode: "absolute",
      values: annual([-39000, -47000, -55000, -50000, -52000]),
      note: "負值通常表示投資活動淨流出，但仍需展開明細判斷資本支出、投資或處分影響。",
      formula: "取自合併現金流量表之投資活動淨現金流量",
    },
    {
      id: "financingCashFlow",
      label: "籌資活動現金流量",
      shortLabel: "籌資現金流",
      unit: "百萬元",
      decimals: 0,
      changeMode: "absolute",
      values: annual([-9000, -16000, -23000, -12000, -18000]),
      note: "籌資現金流包含借款、還款、股利與權益交易，正負值本身不代表好壞。",
      formula: "取自合併現金流量表之籌資活動淨現金流量",
    },
    {
      id: "freeCashFlow",
      label: "自由現金流",
      shortLabel: "自由現金流",
      unit: "百萬元",
      decimals: 0,
      changeMode: "percent",
      values: annual([18000, 35000, 70000, 39200, 41800]),
      note: "本頁暫採營業現金流減資本支出，其他定義可能不同。",
      formula: "自由現金流＝營業活動現金流量－資本支出",
    },
    {
      id: "capitalExpenditure",
      label: "資本支出",
      shortLabel: "資本支出",
      unit: "百萬元",
      decimals: 0,
      changeMode: "percent",
      values: annual([40000, 45000, 53000, 48000, 49000]),
      note: "正式資料需界定購置不動產、廠房及設備等現金流科目。",
      formula: "資本支出＝指定投資活動現金流出科目之合計絕對值",
    },
    overviewMetrics[1],
    {
      id: "cashConversion",
      label: "營業現金流／稅後純益",
      shortLabel: "現金轉換",
      unit: "倍",
      decimals: 2,
      changeMode: "absolute",
      values: annual([1.97, 1.44, 1.41, 1.42, 1.78]),
      note: "比值受營運資金與非現金項目影響，不宜單期判斷。",
      formula: "現金轉換倍數＝營業活動現金流量÷稅後純益",
    },
  ],
};

export const safetyConfig: ResearchWorkspaceConfig = {
  id: "financial-safety",
  eyebrow: "FINANCIAL POSITION",
  title: "財務安全",
  description: "以流動性、槓桿與利息負擔呈現財務結構，不產生安全評分。",
  periodLabel: "2020—2024 年度合併",
  kpiMetricIds: ["currentRatio", "debtRatio", "interestCoverage"],
  detailNote: "正式判讀還需要借款到期、受限資產、承諾事項與利率風險等附註證據。",
  metrics: [
    {
      id: "currentRatio",
      label: "流動比率",
      shortLabel: "流動比率",
      unit: "%",
      decimals: 0,
      changeMode: "point",
      values: annual([176, 193, 214, 228, 219]),
      note: "流動比率只反映報導日的流動資產與流動負債關係。",
      formula: "流動比率＝流動資產÷流動負債×100%",
    },
    {
      id: "quickRatio",
      label: "速動比率",
      shortLabel: "速動比率",
      unit: "%",
      decimals: 0,
      changeMode: "point",
      values: annual([137, 151, 170, 184, 176]),
      note: "速動資產定義需在資料契約中固定，避免不同來源不可比。",
      formula: "速動比率＝速動資產÷流動負債×100%",
    },
    {
      id: "debtRatio",
      label: "負債占資產比率",
      shortLabel: "負債比率",
      unit: "%",
      decimals: 1,
      changeMode: "point",
      values: annual([36.2, 35.6, 32.4, 31.8, 32.8]),
      note: "比率高低需結合產業特性、借款條件與現金部位。",
      formula: "負債比率＝負債總額÷資產總額×100%",
    },
    {
      id: "interestCoverage",
      label: "利息保障倍數",
      shortLabel: "利息保障",
      unit: "倍",
      decimals: 1,
      changeMode: "absolute",
      values: annual([14.2, 24.8, 39.6, 28.4, 23.1]),
      note: "正式計算需統一息前稅前利益與利息費用定義。",
      formula: "利息保障倍數＝息前稅前利益÷利息費用",
    },
    {
      id: "cash",
      label: "現金及約當現金",
      shortLabel: "現金",
      unit: "百萬元",
      decimals: 0,
      changeMode: "percent",
      values: annual([91000, 115000, 173000, 151000, 148000]),
      note: "現金部位不等同可自由運用資金，仍需檢查受限資產。",
      formula: "取自合併資產負債表之現金及約當現金",
    },
    {
      id: "borrowings",
      label: "計息借款",
      shortLabel: "計息借款",
      unit: "百萬元",
      decimals: 0,
      changeMode: "percent",
      values: annual([70000, 75000, 64000, 59000, 62000]),
      note: "示意值只用於呈現現金與借款趨勢；正式口徑需納入流動與非流動借款。",
      formula: "計息借款＝短期借款＋長期借款流動部分＋長期借款（依資料契約）",
    },
  ],
};

export const valuationConfig: ResearchWorkspaceConfig = {
  id: "valuation",
  eyebrow: "VALUATION & PEERS",
  title: "估值與同業",
  description: "標明價格日期與計算基準，只呈現倍數，不判定高估或低估。",
  periodLabel: "價格日期 2025/03/31 · 示意行情",
  kpiMetricIds: ["pe", "pb", "yield"],
  detailNote: "同業比較需先統一產業、價格日期、財報期間與獲利口徑，目前未連接正式市場資料。",
  metrics: [
    {
      id: "pe",
      label: "本益比（P/E）",
      shortLabel: "P/E",
      unit: "倍",
      decimals: 1,
      changeMode: "absolute",
      values: annual([14.2, 13.8, 11.4, 15.6, 11.1]),
      note: "以示意期末股價除以當年度 EPS；不同價格基準不可直接比較。",
      formula: "P/E＝指定日期股價÷每股盈餘",
    },
    {
      id: "pb",
      label: "股價淨值比（P/B）",
      shortLabel: "P/B",
      unit: "倍",
      decimals: 2,
      changeMode: "absolute",
      values: annual([1.72, 1.83, 2.14, 1.64, 1.49]),
      note: "每股淨值口徑與股價日期均需明確標記。",
      formula: "P/B＝指定日期股價÷每股淨值",
    },
    {
      id: "yield",
      label: "現金股息殖利率",
      shortLabel: "殖利率",
      unit: "%",
      decimals: 2,
      changeMode: "point",
      values: annual([4.1, 5.2, 5.8, 6.3, 6.7]),
      note: "示意值不代表已宣告或實際配發股利。",
      formula: "現金股息殖利率＝每股現金股利÷指定日期股價×100%",
    },
    overviewMetrics[2],
  ],
};

export const institutionalConfig: ResearchWorkspaceConfig = {
  id: "institutional",
  eyebrow: "INSTITUTIONAL FLOW",
  title: "籌碼與法人",
  description: "觀察不同期間的法人買賣超，不把資金流向解讀成買賣訊號。",
  periodLabel: "示意區間截至 2025/03/31",
  kpiMetricIds: ["foreign", "trust", "dealer"],
  detailNote: "法人資料需標示交易日、單位與是否包含自營商避險；目前數值僅用於介面測試。",
  metrics: [
    {
      id: "foreign",
      label: "外資買賣超",
      shortLabel: "外資",
      unit: "張",
      decimals: 0,
      changeMode: "absolute",
      values: recentDays([3200, -1800, 4600, 2100, -900]),
      note: "正值代表示意買超、負值代表示意賣超，不構成方向判斷。",
      formula: "外資買賣超＝買進張數－賣出張數",
    },
    {
      id: "trust",
      label: "投信買賣超",
      shortLabel: "投信",
      unit: "張",
      decimals: 0,
      changeMode: "absolute",
      values: recentDays([420, 680, -210, 350, 190]),
      note: "需與正式交易所資料及交易日核對。",
      formula: "投信買賣超＝買進張數－賣出張數",
    },
    {
      id: "dealer",
      label: "自營商買賣超",
      shortLabel: "自營商",
      unit: "張",
      decimals: 0,
      changeMode: "absolute",
      values: recentDays([-140, 320, 180, -260, 90]),
      note: "自營商自行買賣與避險口徑需分開呈現。",
      formula: "自營商買賣超＝買進張數－賣出張數",
    },
    {
      id: "total",
      label: "三大法人合計",
      shortLabel: "法人合計",
      unit: "張",
      decimals: 0,
      changeMode: "absolute",
      values: recentDays([3480, -800, 4570, 2190, -620]),
      note: "合計數仍需保留各法人明細，不可單獨作為結論。",
      formula: "三大法人合計＝外資＋投信＋自營商買賣超",
    },
  ],
};

export const technicalSeries = [
  { date: "03/18", open: 44.1, high: 44.8, low: 43.9, close: 44.5, volume: 42 },
  { date: "03/19", open: 44.6, high: 45.1, low: 44.2, close: 44.3, volume: 38 },
  { date: "03/20", open: 44.2, high: 44.9, low: 44.0, close: 44.8, volume: 46 },
  { date: "03/21", open: 44.9, high: 45.4, low: 44.7, close: 45.2, volume: 51 },
  { date: "03/24", open: 45.1, high: 45.6, low: 44.8, close: 45.0, volume: 43 },
  { date: "03/25", open: 45.0, high: 45.5, low: 44.7, close: 45.4, volume: 48 },
  { date: "03/26", open: 45.5, high: 45.9, low: 45.2, close: 45.7, volume: 55 },
  { date: "03/27", open: 45.8, high: 46.0, low: 45.1, close: 45.3, volume: 61 },
  { date: "03/28", open: 45.2, high: 45.8, low: 45.0, close: 45.6, volume: 52 },
  { date: "03/31", open: 45.5, high: 45.9, low: 45.3, close: 45.6, volume: 49 },
];
