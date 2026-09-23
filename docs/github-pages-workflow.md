# VS Code、GitHub 與 GitHub Pages 工作流程

> 2026-09-21 現況：本機已重建第一個前端驗收點。遠端為 `Long7816/financial-jelly-frontend`，Git 目前尚無本機提交；以下發佈步驟是後續流程。目前沒有 `.github/workflows/deploy.yml`，尚未設定自動部署，也尚未推送這次程式。

## 三者分工

- **VS Code**：在本機查看與修改前端檔案，也能使用內建的 Source Control 操作 Git。
- **Git**：記錄檔案的版本與修改歷史。Commit 只會先存在本機。
- **GitHub**：保存遠端 Git Repository，讓程式碼可以備份、協作與觸發自動流程。
- **GitHub Pages**：讀取 GitHub Actions 建置完成的靜態檔案，產生公開網站網址。

不需要安裝名為「VS Code」的外掛。VS Code 已內建基本 Git 功能；GitHub Pull Requests and Issues 外掛只在需要管理 Pull Request 或 Issue 時才有必要。

## 第一次發布

### 1. 在 VS Code 開啟前端資料夾

請開啟 `frontend`，不要直接把含原始財報與標註資料的整個專題資料夾發布成公開網站 Repository。

### 2. 初始化 Git

如果左側 Source Control 顯示「Initialize Repository」，按下它。完成後，VS Code 會開始列出目前新增與修改的檔案。

### 3. 建立第一次 Commit

1. 在 Source Control 檢查變更。
2. 將要保存的檔案加入 Stage。
3. 輸入訊息，例如 `建立財報蒟蒻前端首頁`。
4. 按下 Commit。

### 4. 發布到 GitHub

1. 在 Source Control 選擇 `Publish to GitHub`。
2. 按照 VS Code 提示登入 GitHub。
3. 建議 Repository 名稱使用 `financial-jelly` 或團隊確認的正式名稱。
4. 確認只發布 `frontend` 內的檔案。
5. 選擇公開或私人 Repository。須留意 GitHub Pages 網站本身可能公開顯示。

VS Code 會建立 GitHub Repository、加入名為 `origin` 的遠端位置，並上傳目前 Commit。

### 5. 啟用 GitHub Pages

1. 開啟 GitHub Repository。
2. 前往 `Settings → Pages`。
3. 在 `Build and deployment` 的 Source 選擇 `GitHub Actions`。
4. 回到 `Actions` 頁面查看 `Deploy frontend to GitHub Pages`。
5. 流程完成後，Pages 設定頁會顯示網站網址。

部署階段需新增並驗證 `.github/workflows/deploy.yml`。完成後，才可透過推送 `main` 自動重新建置及發布。

## 之後每天的工作方式

```text
在 VS Code 修改
→ 本機查看 npm run dev
→ Source Control 檢查差異
→ Commit
→ Push / Sync Changes
→ GitHub Actions 自動建置
→ GitHub Pages 更新網站
```

## 常見名詞

- **Repository**：專案的版本庫。
- **Commit**：一次有說明的版本紀錄。
- **Push**：把本機 Commit 上傳到 GitHub。
- **Pull**：把 GitHub 上其他人的更新下載並合併到本機。
- **Branch**：獨立的修改路線；第一版先使用 `main` 即可。
- **GitHub Actions**：GitHub 上的自動工作流程，本專案用它執行安裝、建置與部署。
- **GitHub Pages**：只負責展示建置完成的靜態網站，不是程式碼編輯器。

## 目前限制

- GitHub Pages 只能直接提供靜態前端，不能安全保存模型 API key，也不能直接執行 Python Agent。
- 未來的 Python Agent 需要部署在另一個後端服務，前端再透過 HTTPS JSON API 呼叫。
- API 網址應放在環境變數 `VITE_API_BASE_URL`，API key 不可放入以 `VITE_` 開頭的前端變數。
- 目前使用 React Router 的 `HashRouter`，例如 `/#/company/2303/overview`。井字號後的路徑由前端處理；Vite 使用相對資源路徑，部署前仍須在 GitHub Pages 實際驗證重新整理與資源載入。
