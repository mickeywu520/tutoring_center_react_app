# 補習班補課管理系統 (前端)

這是補習班補課管理系統的前端部分，基於 React、TypeScript 和 Vite 構建。

## 功能特色

- 學生課表查看
- 請假申請
- 補課安排
- 管理員後台

## 技術棧

- React 18
- TypeScript
- Vite
- Tailwind CSS
- FullCalendar
- React Router v6

## 開發環境設置

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置環境變數

複製 `.env.example` 文件並重命名為 `.env`：

```bash
cp .env.example .env
```

在 `.env` 文件中設定以下變數：

- `REACT_APP_API_BASE_URL`: Cloudflare Workers API 的基底 URL

### 3. 啟動開發伺服器

```bash
npm run dev
```

這將在 `http://localhost:5173` 啟動開發伺服器。

## 構建和部署

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## Cloudflare 集成

本系統使用 Cloudflare Workers 作為後端 API，並使用 Cloudflare D1 作為資料庫。

### 後端 API 設置

請參閱 `../api/README.md` 了解如何設置和部署 Cloudflare Workers。

### API 服務

前端通過 `src/services/cloudflareService.js` 與後端 API 通信。

## 路由

- `/` - 主頁（儀表板）
- `/login` - 登入頁
- `/test-sheets` - Cloudflare API 連接測試
- `/debug-sheets` - 調試頁面

## 開發指南

### 添加新功能

1. 在 `src/components/` 中創建新組件
2. 在 `src/pages/` 中創建新頁面（如果需要）
3. 在 `src/services/cloudflareService.js` 中添加相應的 API 調用方法
4. 在 `App.tsx` 中添加新路由（如果需要）

### 環境變數

所有環境變數都應以 `REACT_APP_` 開頭，並在 `.env` 文件中定義。

## 部署

前端可以部署到任何支持靜態網站托管的平台，如：

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

### Cloudflare Pages 部署步驟

1. 將代碼推送到 GitHub 倉庫
2. 在 Cloudflare Pages 控制台中創建新項目
3. 選擇您的 GitHub 倉庫
4. 設置構建設置：
   - 框架預設：Vite
   - 根目錄：`frontend`
   - 構建命令：`npm run build`
   - 發布目錄：`dist`
5. 添加環境變數（如果需要）
6. 部署

## 故障排除

### API 連接問題

1. 確保 `.env` 文件中的 `REACT_APP_API_BASE_URL` 設置正確
2. 確保 Cloudflare Workers API 正在運行
3. 檢查瀏覽器控制台中的錯誤信息

### 登入問題

1. 確保用戶名和密碼正確
2. 檢查用戶是否已正確添加到 D1 資料庫
3. 檢查密碼哈希是否正確生成
</content>
