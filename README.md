# 補習班補課管理系統

這是一個基於 React 和 Cloudflare 技術棧的補習班補課管理系統。

## 專案結構

```
.
├── frontend/          # 前端 React 應用
│   ├── src/           # 前端源碼
│   │   ├── components/ # React 組件
│   │   ├── pages/      # 頁面組件
│   │   ├── services/   # API 服務
│   │   └── ...         # 其他前端文件
│   ├── public/        # 靜態資源
│   ├── package.json   # 前端依賴
│   └── README.md      # 前端說明
├── api/               # Cloudflare Workers 後端 API
│   ├── src/           # Workers 源碼
│   ├── wrangler.toml  # Workers 配置
│   ├── schema.sql     # D1 資料庫結構
│   └── README.md      # 後端說明
├── 補習班補課管理系統_PRD.md  # 產品需求文件
├── 補課系統_建立流程圖.html   # 系統流程圖
└── README.md          # 本文件
```

## 技術棧

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- FullCalendar
- React Router v6

### 後端
- Cloudflare Workers
- Cloudflare D1 (SQLite 資料庫)
- Cloudflare Pages (前端部署)

## 功能特色

- 學生課表查看
- 請假申請
- 補課安排
- 管理員後台
- 身份驗證 (JWT)
- 響應式設計

## 開發環境設置

### 前端設置

1. 安裝依賴：
   ```bash
   cd frontend
   npm install
   ```

2. 配置環境變數：
   ```bash
   cp .env.example .env
   ```
   編輯 `.env` 文件，設置 `REACT_APP_API_BASE_URL`。

3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

### 後端設置

1. 安裝 Wrangler CLI：
   ```bash
   npm install -g wrangler
   ```

2. 登入 Cloudflare：
   ```bash
   wrangler login
   ```

3. 創建 D1 資料庫：
   ```bash
   wrangler d1 create tutoring-center-db
   ```
   將返回的資料庫 ID 更新到 `api/wrangler.toml` 文件中。

4. 創建資料表：
   ```bash
   wrangler d1 execute tutoring-center-db --file api/schema.sql
   ```

5. 啟動本地開發伺服器：
   ```bash
   cd api
   wrangler dev
   ```

## 部署

### 前端部署 (Cloudflare Pages)

1. 將代碼推送到 GitHub 倉庫
2. 在 Cloudflare Pages 控制台中創建新項目
3. 設置構建設置：
   - 框架預設：Vite
   - 根目錄：`frontend`
   - 構建命令：`npm run build`
   - 發布目錄：`dist`

### 後端部署 (Cloudflare Workers)

```bash
cd api
wrangler deploy
```

## API 端點

### 認證
- `POST /api/login` - 使用者登入與 Token 簽發

### 學生/家長功能
- `GET /api/schedules` - 取得特定學生課表
- `POST /api/leave` - 提交請假申請
- `GET /api/available-slots` - 查詢可補課時段
- `POST /api/reschedule` - 補課申請與更新

### 管理員功能
- `GET /api/admin/users` - 管理員獲取所有用戶資料

## 資料庫結構

### Users（用戶表）
- id (PRIMARY KEY)
- name (用戶名稱)
- username (登入帳號)
- password_hash (密碼雜湊)
- role ('admin', 'teacher', 'student')

### Courses（課程表）
- id (PRIMARY KEY)
- name (課程名稱)
- teacher_id (任課老師)
- room (教室)

### Schedules（課表表）
- id (PRIMARY KEY)
- student_id (學生 ID)
- course_id (課程 ID)
- start_time (開始時間)
- end_time (結束時間)
- status ('scheduled', 'leave_requested', 'rescheduled')

### Reschedules（補課紀錄表）
- id (PRIMARY KEY)
- student_id (學生 ID)
- original_schedule_id (原課程排程 ID)
- rescheduled_schedule_id (補課排程 ID)
- created_at (建立時間)

## 開發指南

### 添加新功能

1. 在前端 `frontend/src/components/` 中創建新組件
2. 在前端 `frontend/src/services/cloudflareService.js` 中添加相應的 API 調用方法
3. 在後端 `api/src/index.js` 中添加相應的 API 端點
4. 如果需要新的資料表，在 `api/schema.sql` 中添加相應的結構

### 環境變數

- 前端：所有環境變數都應以 `REACT_APP_` 開頭，並在 `frontend/.env` 文件中定義
- 後端：在 `api/wrangler.toml` 中定義環境變數

## 故障排除

### 前端問題
1. 確保 `.env` 文件中的 `REACT_APP_API_BASE_URL` 設置正確
2. 確保後端 API 正在運行

### 後端問題
1. 確保已正確設置 Cloudflare 認證
2. 確保 D1 資料庫已創建並正確配置

## 許可證

MIT License
