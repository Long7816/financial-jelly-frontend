import { expect, test, type Page } from "@playwright/test";

async function openNavigation(page: Page) {
  const menu = page.getByRole("button", { name: "開啟導覽選單" });
  if (await menu.isVisible()) await menu.click();
}

async function enterCompany(page: Page) {
  await page.goto("/");
  await page.getByRole("textbox", { name: "公司名稱或股票代號" }).fill("2303");
  await page.getByRole("link", { name: "進入研究", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "公司總覽", exact: true }),
  ).toBeVisible();
}

test("搜尋、選定公司、重新整理及返回入口", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /今天想研究\s*哪一家公司？/ }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "目前研究公司" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "搜尋公司", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("textbox", { name: "公司名稱或股票代號" }).press("Enter");
  await expect(page.getByText("請先輸入公司名稱或股票代號。")).toBeVisible();
  const input = page.getByRole("textbox", { name: "公司名稱或股票代號" });
  await input.fill("不存在的公司");
  await expect(
    page.getByText("找不到「不存在的公司」", { exact: false }),
  ).toBeVisible();
  await input.fill("台積電");
  await expect(page.getByText("資料準備中", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "進入研究", exact: true }),
  ).toHaveCount(0);
  await input.fill(" ２３０３ 聯電 ");
  await expect(
    page.getByRole("link", { name: "進入研究", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "進入研究", exact: true }).click();
  await expect(page).toHaveURL(/#\/company\/2303\/overview$/);
  await expect(
    page.getByRole("heading", { name: "公司總覽", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "公司總覽", exact: true }),
  ).toBeVisible();
  await openNavigation(page);
  await expect(
    page.getByRole("region", { name: "目前研究公司" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "切換公司", exact: true }).click();
  await expect(page.getByRole("region", { name: "目前研究公司" })).toHaveCount(
    0,
  );
  await expect(page.getByRole("link", { name: /繼續研究/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("自選在頁面切換及重新整理後保留，可移除", async ({ page }) => {
  await enterCompany(page);
  await page.getByRole("button", { name: "加入自選", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "已加入自選" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: "已加入自選" })).toBeVisible();
  await openNavigation(page);
  await page.getByRole("link", { name: "返回研究入口", exact: true }).click();
  await page.getByRole("button", { name: "從自選移除聯電" }).click();
  await expect(
    page.getByRole("button", { name: "將聯電加入自選" }),
  ).toBeVisible();
});

test("公司總覽指標、頁籤和收合顯示一致資料，缺少證據不宣稱驗證成功", async ({
  page,
}) => {
  await enterCompany(page);
  const kpis = page.getByRole("region", { name: "核心財務指標" });
  await expect(kpis.getByText("232,580", { exact: true })).toBeVisible();
  await expect(kpis.getByText("+4.5%", { exact: true })).toBeVisible();
  await expect(kpis.getByText("51,000", { exact: true })).toBeVisible();
  await expect(page.getByText("本期一句話", { exact: true })).toHaveCount(0);
  await page.getByRole("tab", { name: "營業現金流" }).click();
  await expect(
    page.getByRole("heading", { name: "營業活動現金流量" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "營業現金流" }).press("Home");
  await expect(page.getByRole("tab", { name: "營收" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("table")).not.toBeVisible();
  await page
    .locator("summary")
    .filter({ hasText: "完整數據" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  await page
    .locator("summary")
    .filter({ hasText: "資料來源與驗證狀態" })
    .click();
  await expect(page.getByRole("table")).not.toBeVisible();
  await expect(
    page.getByText("前端固定示意資料", { exact: false }),
  ).toBeVisible();
});

test("輸入公司後八個導覽頁皆可開啟並保留一致資料基準", async ({ page }) => {
  const pages = [
    ["overview", "公司總覽"],
    ["technical", "股價與技術"],
    ["operations", "營運與獲利"],
    ["cash-flow", "現金流"],
    ["financial-safety", "財務安全"],
    ["risk-evidence", "風險與證據"],
    ["valuation", "估值與同業"],
    ["institutional", "籌碼與法人"],
  ] as const;
  for (const [route, title] of pages) {
    await page.goto(`/#/company/2303/${route}`);
    await expect(
      page.getByRole("heading", { level: 1, name: title, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "研究資料基準" }),
    ).toContainText("2303 聯電");
    await expect(page.getByText("Demo Mock · 尚未連接真實資料")).toBeVisible();
    await expect(page.locator(".research-disclosures details")).toHaveCount(3);
    if (route === "risk-evidence") {
      await expect(page.getByText("資料不足")).toHaveCount(3);
    } else {
      await expect(page.locator("svg[role='img']").first()).toBeVisible();
      await expect(page.locator(".metric-value-strip")).toBeVisible();
    }
  }
  await page.goto("/#/company/2303/valuation");
  await expect(page.getByRole("heading", { name: "同業比較基準" })).toBeVisible();
  await expect(page.getByRole("table", { name: "估值與獲利能力同業示意比較" })).toBeVisible();
  await page.goto("/#/company/2303/institutional");
  await page.getByRole("tab", { name: "20 日" }).click();
  await expect(page.getByRole("tab", { name: "20 日" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("region", { name: "研究資料基準" })).toContainText("20 日");

  await page.goto("/#/company/2303/operations");
  await page.getByRole("tab", { name: "ROE" }).click();
  await openNavigation(page);
  await page.getByRole("link", { name: "現金流", exact: true }).click();
  await expect(page.getByRole("tab", { name: "營業現金流" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await openNavigation(page);
  await page.getByRole("link", { name: "財務安全", exact: true }).click();
  await expect(page.getByRole("tab", { name: "流動比率" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("AI 從兩個入口使用同一頁面，不要求先選公司或期間", async ({ page }) => {
  await page.goto("/");
  await openNavigation(page);
  await page.getByRole("link", { name: /AI 財報助理/ }).click();
  await expect(page).toHaveURL(/#\/assistant$/);
  await expect(page.getByLabel("公司", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("期間", { exact: true })).toHaveCount(0);
  const initialTitle = await page
    .getByRole("heading", { level: 2 })
    .innerText();
  await enterCompany(page);
  await openNavigation(page);
  await page.getByRole("link", { name: /AI 財報助理/ }).click();
  await expect(page).toHaveURL(/#\/assistant$/);
  await expect(page.getByLabel("公司", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("期間", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(
    initialTitle,
  );
  await page.getByRole("button", { name: /比較數字/ }).click();
  await expect(page.getByRole("textbox", { name: "財報問題" })).toHaveValue(
    "聯電 2024 年的營收比前一年增加多少？",
  );
  await page.getByRole("button", { name: "送出財報問題" }).click();
  await expect(page.getByRole("status")).toContainText("固定示範回答");
  await expect(
    page.getByRole("region", { name: "固定示範回答預覽" }),
  ).toBeVisible();
  await expect(page.getByText("增加 10,047 百萬元", { exact: false })).toBeVisible();
  await expect(page.getByText("NL2SQL 候選", { exact: false })).toBeVisible();
  await expect(
    page.locator(".assistant-process-row").getByText("尚未執行"),
  ).toHaveCount(1);
});

test("公司探索、自選、市場與行事曆可完成主要操作", async ({ page }) => {
  await page.goto("/#/explore");
  await expect(page.getByRole("heading", { name: "公司探索" })).toBeVisible();
  await page
    .getByRole("button", { name: "將台積電加入自選", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "從自選移除台積電", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.goto("/#/watchlist");
  await expect(page.getByRole("heading", { name: "我的自選" })).toBeVisible();
  await expect(page.getByText("台積電", { exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "可研究" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "資料準備中" })).toHaveCount(0);
  await page
    .getByRole("button", { name: "從自選移除台積電", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "自選清單目前是空的" }),
  ).toBeVisible();

  await page.goto("/#/explore");
  await page
    .getByRole("button", { name: "將聯電加入自選", exact: true })
    .click();

  await page.goto("/#/market");
  await page.getByRole("tab", { name: "產業表現" }).click();
  await expect(
    page.getByRole("heading", { name: "重點產業表現" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "資料覆蓋" }).click();
  await expect(
    page.getByRole("heading", { name: "產業財報覆蓋狀態" }),
  ).toBeVisible();

  await page.goto("/#/calendar");
  await expect(
    page.getByRole("heading", { name: "財報／法說行事曆" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "只看自選", exact: true }).click();
  await expect(page.getByRole("link", { name: "2303 聯電" })).toBeVisible();
  await expect(page.getByRole("link", { name: "2330 台積電" })).toHaveCount(0);
  await page.getByRole("button", { name: "只看自選", exact: true }).click();
  await page.getByRole("tab", { name: "月曆" }).click();
  await expect(page.locator(".month-grid")).toBeVisible();
  await page.getByRole("button", { name: "除權息", exact: true }).click();
  await expect(page.getByText("聯詠", { exact: true })).toBeVisible();
});

test("無效路由及損壞的儲存資料不會產生錯誤公司或白畫面", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("konjac.recent.v1", "{broken");
    localStorage.setItem(
      "konjac.watchlist.v1",
      JSON.stringify(["9999", 2303, null, "2303", "2303"]),
    );
  });
  await page.goto("/#/company/9999/overview");
  await expect(
    page.getByRole("heading", { name: "這家公司還沒有研究資料" }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "目前研究公司" })).toHaveCount(
    0,
  );
  await page.goto("/#/missing-page");
  await expect(
    page.getByRole("heading", { name: "找不到這個頁面" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "返回研究入口", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /今天想研究\s*哪一家公司？/ }),
  ).toBeVisible();
});

test("關閉儲存權限仍可操作並顯示提示", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("storage unavailable");
    };
  });
  await enterCompany(page);
  await expect(page.getByRole("status")).toContainText("瀏覽器無法儲存紀錄");
  await page.getByRole("button", { name: "加入自選", exact: true }).click();
  await expect(page.getByRole("button", { name: "已加入自選" })).toBeVisible();
});

test("主要畫面不水平溢位，手機選單可開啟、Escape 關閉", async ({
  page,
}, testInfo) => {
  for (const route of [
    "/",
    "/#/explore",
    "/#/watchlist",
    "/#/market",
    "/#/calendar",
    "/#/company/2303/overview",
    "/#/company/2303/technical",
    "/#/company/2303/operations",
    "/#/company/2303/cash-flow",
    "/#/company/2303/financial-safety",
    "/#/company/2303/risk-evidence",
    "/#/company/2303/valuation",
    "/#/company/2303/institutional",
    "/#/assistant",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const widths = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(widths.content).toBeLessThanOrEqual(widths.viewport);
  }
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "開啟導覽選單" }).click();
    await expect(page.getByRole("dialog", { name: "導覽選單" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: "導覽選單" }),
    ).not.toBeVisible();
  } else {
    await page.setViewportSize({ width: 1440, height: 720 });
    await page.goto("/#/company/2303/overview");
    const sidebarFits = await page.locator(".desktop-sidebar .sidebar-scroll").evaluate(
      (element) => element.scrollHeight <= element.clientHeight,
    );
    expect(sidebarFits).toBe(true);
    const chart = await page
      .getByRole("img", { name: /2021 至 2024/ })
      .boundingBox();
    expect(chart).not.toBeNull();
    expect(chart!.y + chart!.height).toBeLessThan(900);
    const ai = await page
      .getByRole("link", { name: /AI 財報助理/ })
      .boundingBox();
    expect(ai!.y + ai!.height).toBeLessThanOrEqual(900);
  }
});
