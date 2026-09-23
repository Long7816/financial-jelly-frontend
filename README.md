# 財報蒟蒻前端

React + TypeScript + Vite。依 Stitch 第四版的資訊層級與既有 Warm Editorial Konjac 色票，建立可操作的財報研究工作台。

目前完成範圍：

- 研究入口：搜尋、搜尋無結果／未開放狀態、最近研究、自選增刪。
- 公司探索：搜尋、產業與財務面向篩選、排序、自選同步與資料覆蓋狀態。
- 我的自選：本機收藏、空狀態與跨頁保存；不顯示只為開發期存在的資料狀態分類。
- 市場與產業：大盤概況、產業表現及資料覆蓋三個示意分頁。
- 財報／法說行事曆：近期清單、月曆、事件類型及只看自選篩選。
- 輸入公司後工作台：公司總覽、股價與技術、營運與獲利、現金流、財務安全、風險與證據、估值與同業、籌碼與法人，共八個可操作頁面。
- 一致的分析結構：最多三項首屏 KPI、單一主圖、常用指標切換、五期數值帶，以及預設收合的公式、完整數據與來源狀態。
- 估值頁包含明確標成 Mock 的同業比較；法人頁提供 5／20／60 日與 1 年示意區間切換。
- AI 統一頁：所有入口都前往 `/#/assistant`；第一個代表問題可展示固定 Mock 計算、公式與限制，其他問題仍維持待串接狀態。
- 桌機與手機導覽、鍵盤頁籤、重新整理與錯誤路由處理。
- 示意財務與行情有明確標記；最近研究與自選為本瀏覽器的實際操作紀錄。

AI 回答服務、真實行情、原始財報引用與 Guardian 尚未串接。本階段完成的是前端 UI 與示意互動，不代表真實財報分析或整個專題 Demo 已完成。

產品頁面、互動與視覺需求請看 [前端規格](./FRONTEND_SPEC.md)。

## 在 VS Code 開啟

1. 開啟 VS Code。
2. 選擇「File → Open Folder」。
3. 選擇本專案的 `frontend` 資料夾。
4. 開啟 VS Code 內建終端機。

## 本機開發

需要符合目前 Vite engines 的 Node.js 版本（本次使用 Node.js 24.16.0）。

```bash
npm ci
npm run dev
```

依終端機顯示的網址，在瀏覽器查看網站。搜尋 `2303` 或 `聯電`，點「進入研究」，或直接使用研究入口的聯電示範卡。

## 正式建置

```bash
npm run build
npm run preview
```

正式輸出會放在 `dist` 資料夾。

## 發布到 GitHub Pages

完整流程請看 [GitHub Pages 部署說明](./docs/github-pages-workflow.md)。

採用 HashRouter 與相對資源路徑，為 GitHub Pages 專案子目錄預備；本階段尚未推送或部署。前端不可保存 API Key；`.env.example` 只預留公開後端網址。

## 驗收測試

```bash
npm run typecheck
npx playwright install chromium --no-shell
npm test
```

測試使用 Chromium 的 headless 模式，涵蓋桌機與手機模擬。若已有 `npm run dev -- --port 5173 --strictPort` 執行中，測試會使用它。

## 檔案分工

- `src/App.tsx`：網址與頁面切換。
- `src/components/Shell.tsx`：共同側欄、公司卡、資料標示及手機選單。
- `src/pages/`：研究入口、公司探索、自選、市場、行事曆、八個公司研究頁與統一 AI 頁。
- `src/components/ResearchUI.tsx`：輸入公司前頁面的共用標題、Mock 標示、指標卡與頁籤。
- `src/data/mock.ts`、`src/data/companyResearch.ts`：明確標記的固定示意資料及計算函式。
- `src/types.ts`：財務資料與候選 Agent 契約。
- `src/styles.css`：既有暖色設計、元件樣式與響應式規則。
- `tests/acceptance.spec.ts`：桌機與手機驗收流程。

最新狀態請看 [開發進度與驗收](./docs/development-progress.md)、[投資人使用體驗審核](./docs/investor-ux-audit-2026-09-23.md) 及 [V4 設計索引](./STITCH_V4_SCREEN_MAP.md)。
