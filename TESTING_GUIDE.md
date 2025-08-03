# 測試指南

本指南將幫助您測試已轉換為Cloudflare方案的補習班補課管理系統。

## 1. 後端 (Cloudflare Workers API) 設置與測試

### 1.1 安裝 Wrangler CLI
```bash
npm install -g wrangler
```

### 1.2 登入 Cloudflare
```bash
wrangler login
```

### 1.3 安裝依賴項
```bash
cd api
npm install
```

### 1.4 配置 wrangler.toml
複製 `api/wrangler.toml.example` 文件並重命名為 `wrangler.toml`：
```bash
cp api/wrangler.toml.example api/wrangler.toml
```

編輯 `api/wrangler.toml` 文件，設置以下變數：
- `JWT_SECRET`: 用於 JWT 簽名的密鑰（可以是任何隨機字符串）
- `database_name`: 您的 D1 資料庫名稱（稍後創建）
- `database_id`: 您的 D1 資料庫 ID（稍後創建）

### 1.5 創建 D1 資料庫
```bash
cd api
wrangler d1 create tutoring-center-db
```

將返回的資料庫資訊更新到 `wrangler.toml` 文件中。

### 1.6 創建資料表
```bash
wrangler d1 execute tutoring-center-db --file schema.sql
```

### 1.7 本地測試
啟動本地開發伺服器：
```bash
wrangler dev
```

這將在 `http://localhost:8787` 啟動本地開發伺服器。

### 1.8 部署到 Cloudflare
```bash
wrangler deploy
```

## 2. 前端設置與測試

### 2.1 安裝依賴
```bash
cd frontend
npm install
```

### 2.2 配置環境變數
複製 `.env.example` 文件並重命名為 `.env`：
```bash
cp .env.example .env
```

如果您在本地運行後端，不需要更改任何內容。如果您部署了後端到Cloudflare，請將 `REACT_APP_API_BASE_URL` 更新為您的 Workers URL。

### 2.3 啟動前端開發伺服器
```bash
npm run dev
```

這將在 `http://localhost:5173` 啟動前端開發伺服器。

## 3. 功能測試

### 3.1 登入測試
1. 打開瀏覽器訪問 `http://localhost:5173`
2. 使用預設帳號登入：
   - 用戶名: `admin`
   - 密碼: `admin`
3. 應該成功登入並跳轉到儀表板頁面

### 3.2 API 連接測試
1. 點擊側邊欄的「Cloudflare API 測試」
2. 點擊「🚀 快速測試」按鈕
3. 應該看到成功獲取學生資料的訊息

### 3.3 完整功能測試
1. 點擊側邊欄的「Cloudflare API 功能測試」
2. 點擊各個測試按鈕：
   - 「測試讀取學生資料」
   - 「測試讀取課程資料」
   - 「測試新增補課申請」
3. 應該能看到相應的數據或成功訊息

### 3.4 調試工具測試
1. 點擊側邊欄的「Cloudflare API 除錯」
2. 點擊各個測試按鈕：
   - 「🔑 測試登入」
   - 「📊 測試所有資料」
   - 「📝 測試 Token」
3. 應該能看到詳細的測試結果

## 4. 故障排除

### 4.1 CORS 錯誤
如果遇到 CORS 錯誤，請確保：
1. 後端 API 正確設置了 CORS 標頭
2. 前端的 `REACT_APP_API_BASE_URL` 設置正確

### 4.2 JWT Token 錯誤
如果遇到 JWT Token 錯誤，請確保：
1. `wrangler.toml` 中的 `JWT_SECRET` 設置正確
2. 重新登入以獲取新的 Token

### 4.3 資料庫連接錯誤
如果遇到資料庫連接錯誤，請確保：
1. D1 資料庫已正確創建
2. `wrangler.toml` 中的資料庫資訊設置正確
3. 資料表已正確創建

## 5. 高級測試

### 5.1 添加新用戶
您可以通過直接操作 D1 資料庫來添加新用戶：
```bash
wrangler d1 execute tutoring-center-db --command "INSERT INTO users (name, username, password_hash, role) VALUES ('測試用戶', 'test', 'test_password_hash', 'student')"
```

### 5.2 測試不同角色
使用不同角色的帳號登入以測試權限控制：
- 管理員: `admin` / `admin`
- 教師: 需要手動添加
- 學生: 需要手動添加

## 6. 性能測試

### 6.1 負載測試
您可以使用工具如 Apache Bench 進行簡單的負載測試：
```bash
ab -n 100 -c 10 http://localhost:8787/api/students
```

### 6.2 響應時間測試
在瀏覽器開發者工具中查看網絡請求的響應時間。

## 7. 安全測試

### 7.1 未授權訪問測試
嘗試在未登入的情況下訪問受保護的 API 端點，應該返回 401 錯誤。

### 7.2 SQL 注入測試
嘗試在輸入字段中輸入惡意代碼，應該被正確處理而不影響系統安全。

## 8. 部署測試

### 8.1 生產環境測試
在部署到生產環境後，進行完整的功能測試以確保一切正常運行。

### 8.2 回滾測試
確保您有回滾計劃，以防部署出現問題。

通過按照這個指南進行測試，您應該能夠驗證系統的所有功能是否正常運行。
