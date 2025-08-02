# 服務和API索引

## 服務架構概覽

### Cloudflare API 服務層
專案現在使用 Cloudflare Workers 作為後端 API，資料存儲在 Cloudflare D1 資料庫中，並使用 JWT 進行身份驗證。

## 服務文件

### 1. cloudflareService.js (主要服務)
```javascript
// 位置: src/services/cloudflareService.js
// 功能: 與 Cloudflare Workers API 交互
```

#### 主要方法:
- **login(username, password)**: 用戶登入並獲取 JWT Token
- **getStudents()**: 獲取學生數據
- **getCourses()**: 獲取課程數據
- **getSchedule()**: 獲取課表數據
- **getMakeupRecords()**: 獲取補課記錄
- **getMealRecords()**: 獲取用餐記錄
- **addMakeupRequest(studentId, originalScheduleId, rescheduledScheduleId, reason)**: 提交補課申請

#### 配置:
```javascript
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:8787';
```

#### 數據結構:
```javascript
// 學生數據
{
  id: "學生ID",
  name: "學生姓名",
  grade: "年級信息", 
  phone: "電話號碼",
  // ... 其他欄位
}

// 課程數據  
{
  id: "課程ID",
  name: "課程名稱",
  time: "上課時間",
  teacher: "授課教師",
  // ... 其他欄位
}

// 課表數據
{
  id: "課表ID",
  student_id: "學生ID",
  course_id: "課程ID",
  start_time: "開始時間",
  end_time: "結束時間",
  status: "狀態",
  // ... 其他欄位
}
```

### 2. auth.js (認證工具)
```javascript
// 位置: src/services/auth.js
// 功能: JWT Token 管理
```

#### 主要方法:
- **setToken(token)**: 設置 JWT Token
- **getToken()**: 獲取 JWT Token
- **removeToken()**: 移除 JWT Token
- **isTokenValid()**: 檢查 Token 是否有效

## API集成模式

### 1. RESTful API 模式
```javascript
// 優點: 標準化，易於理解和維護
// 缺點: 需要網路連線

const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/students`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  const data = await response.json();
  return data;
};
```

### 2. JWT 認證模式
```javascript
// 優點: 無狀態，可擴展
// 缺點: 需要安全的 Token 管理

// 登入流程:
// 1. 用戶提交登入請求
// 2. 服務端驗證用戶憑證
// 3. 服務端生成 JWT Token
// 4. 客戶端存儲 Token
// 5. 後續請求在 Authorization 標頭中包含 Token
```

## 錯誤處理策略

### 1. 網路錯誤處理
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error('網路請求失敗:', error);
  throw new Error('無法連接到 Cloudflare API');
}
```

### 2. 認證錯誤處理
```javascript
try {
  const data = await fetchData();
  if (!data || data.length === 0) {
    throw new Error('數據為空或格式錯誤');
  }
  return data;
} catch (error) {
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    // Token 過期或無效，重新登入
    removeToken();
    window.location.href = '/login';
  }
  console.error('數據獲取失敗:', error);
  return [];
}
```

### 3. 服務器錯誤處理
```javascript
// 檢查是否為服務器問題
if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
  throw new Error('服務器內部錯誤，請稍後再試');
}
```

## 環境配置

### .env.example 文件
```bash
# Cloudflare API 配置
REACT_APP_API_BASE_URL=http://localhost:8787

# 其他API配置
# (如果需要)
```

### 配置使用
```javascript
// 在服務中使用環境變量
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:8787';
```

## 測試組件對應

### 1. CloudflareTest.tsx
- **服務**: cloudflareService.js
- **功能**: 完整的學生和課程數據展示
- **UI**: 表格形式展示數據

### 2. TestCloudflareConnection.tsx
- **服務**: cloudflareService.js
- **功能**: 連接狀態檢查和基本功能測試
- **UI**: 狀態指示器和測試按鈕

### 3. DebugCloudflare.tsx
- **服務**: cloudflareService.js
- **功能**: 調試和故障排除
- **UI**: 詳細的調試信息和測試選項

## 數據流程

### 1. 組件 → 服務 → API
```
React Component
    ↓ (調用服務方法)
Service Layer  
    ↓ (HTTP請求)
Cloudflare Workers API
    ↓ (返回數據)
Service Layer
    ↓ (解析和格式化)
React Component
    ↓ (更新狀態)
UI Update
```

### 2. 錯誤處理流程
```
API Error
    ↓
Service Layer (捕獲和包裝)
    ↓  
Component (顯示用戶友好信息)
    ↓
UI (錯誤狀態顯示)
```

## 最佳實踐

### 1. 服務設計
- 單一職責原則
- 統一的錯誤處理
- 適當的抽象層級
- 可測試的方法

### 2. API調用
- 使用async/await
- 適當的超時設置
- 重試機制
- 緩存策略

### 3. 數據處理
- 輸入驗證
- 數據清理
- 類型轉換
- 預設值處理

### 4. 安全考量
- JWT Token 保護
- CORS 設置
- 數據驗證
- 權限檢查

## 擴展指南

### 添加新的 Cloudflare API 服務
1. 在 `cloudflareService.js` 中添加新的方法
2. 確保方法使用正確的認證和錯誤處理
3. 添加對應的測試組件
4. 更新環境配置（如果需要）
5. 更新文檔

### 集成其他數據源
1. 創建統一的數據接口
2. 實現適配器模式
3. 保持一致的錯誤處理
4. 添加相應的測試
