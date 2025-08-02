# Cloudflare Workers API

這是補習班補課管理系統的後端 API，基於 Cloudflare Workers 和 D1 資料庫。

## 目錄結構

```
api/
├── src/
│   ├── index.js      # Workers 入口點
│   ├── auth.js       # JWT 認證工具
│   └── crypto.js     # 密碼加密工具
├── wrangler.toml     # Cloudflare Workers 配置
├── schema.sql        # D1 資料庫結構
└── README.md         # 本文件
```

## 部署步驟

### 1. 安裝 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登入 Cloudflare

```bash
wrangler login
```

### 3. 配置 wrangler.toml

複製 `wrangler.toml.example` 文件並重命名為 `wrangler.toml`：

```bash
cp wrangler.toml.example wrangler.toml
```

編輯 `wrangler.toml` 文件，設置以下變數：

- `JWT_SECRET`: 用於 JWT 簽名的密鑰
- `database_name`: 您的 D1 資料庫名稱
- `database_id`: 您的 D1 資料庫 ID

### 4. 創建 D1 資料庫

```bash
wrangler d1 create tutoring-center-db
```

將返回的資料庫 ID 更新到 `wrangler.toml` 文件中。

### 5. 創建資料表

```bash
wrangler d1 execute tutoring-center-db --file schema.sql
```

### 6. 部署 Workers

```bash
wrangler deploy
```

## 本地開發

### 1. 啟動本地開發伺服器

```bash
wrangler dev
```

這將在 `http://localhost:8787` 啟動本地開發伺服器。

### 2. 本地資料庫開發

```bash
wrangler dev --d1 tutoring-center-db
```

## 環境變數

在 `wrangler.toml` 中設定以下環境變數：

- `JWT_SECRET`: 用於 JWT 簽名的密鑰

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

| 欄位名稱 | 說明 |
|---------|------|
| id | PRIMARY KEY |
| name | 用戶名稱 |
| username | 登入帳號 |
| password_hash | 密碼雜湊 |
| role | 'admin'、'teacher'、'student' |

### Courses（課程表）

| 欄位名稱 | 說明 |
|---------|------|
| id | PRIMARY KEY |
| name | 課程名稱 |
| teacher_id | 任課老師 |
| room | 教室 |

### Schedules（課表表）

| 欄位名稱 | 說明 |
|---------|------|
| id | PRIMARY KEY |
| student_id | 學生 ID |
| course_id | 課程 ID |
| start_time | 開始時間 |
| end_time | 結束時間 |
| status | 'scheduled'、'leave_requested'、'rescheduled' |

### Reschedules（補課紀錄表）

| 欄位名稱 | 說明 |
|---------|------|
| id | PRIMARY KEY |
| student_id | 學生 ID |
| original_schedule_id | 原課程排程 ID |
| rescheduled_schedule_id | 補課排程 ID |
| created_at | 建立時間 |
