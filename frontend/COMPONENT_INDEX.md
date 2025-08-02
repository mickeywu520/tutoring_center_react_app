# 組件索引

## 組件層次結構

### 應用層級
```
App.tsx (根組件)
├── AuthProvider (認證提供者)
├── Router (路由器)
└── AppContent
    ├── Routes
    │   ├── /login → LoginPage
    │   ├── /test-sheets → TestCloudflareConnection
    │   ├── /test-cloudflare → CloudflareTest
    │   ├── /debug-sheets → DebugCloudflare
    │   └── / → PrivateRoute(Layout(DashboardPage))
    └── useIdleTimer (閒置計時器)
```

### 頁面組件 (`src/pages/`)

#### LoginPage.tsx
- **功能**: 用戶登入界面
- **狀態**: username, password, error
- **依賴**: useAuth, useNavigate
- **樣式**: Tailwind CSS響應式設計

#### DashboardPage.tsx
- **功能**: 主儀表板頁面
- **組件**: FullCalendar日曆
- **插件**: dayGridPlugin, timeGridPlugin
- **樣式**: 自定義日曆樣式

### 佈局組件 (`src/components/`)

#### Layout.tsx
- **功能**: 主佈局容器
- **狀態**: sidebarOpen (側邊欄開關)
- **子組件**: Sidebar
- **響應式**: 移動端漢堡菜單

#### Sidebar.tsx
- **功能**: 側邊欄導航
- **依賴**: useAuth
- **圖標**: FiHome, FiCalendar, FiLogOut, FiMenu, FiX
- **功能**: 登出、導航、響應式收合

### Cloudflare API 組件

#### CloudflareTest.tsx
- **功能**: 完整的 Cloudflare API 測試界面
- **狀態**: students, courses, loading, error
- **服務**: cloudflareService
- **功能**: 讀取學生和課程數據

#### TestCloudflareConnection.tsx
- **功能**: Cloudflare API 連接測試
- **狀態**: connectionStatus, data, loading
- **服務**: cloudflareService
- **功能**: 連接狀態檢查和基本功能測試

#### DebugCloudflare.tsx
- **功能**: Cloudflare API 調試工具
- **狀態**: 多種測試狀態
- **功能**: 
  - 登入測試
  - 數據獲取測試
  - JWT Token 測試
  - 錯誤調試

## Context和Hook

### AuthContext.tsx
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```
- **狀態**: isAuthenticated
- **方法**: login, logout
- **存儲**: localStorage

### useIdleTimer.tsx
```typescript
useIdleTimer(timeout: number, onIdle: () => void)
```
- **功能**: 監控用戶活動
- **事件**: mousedown, mousemove, keypress, scroll, touchstart
- **超時**: 可配置超時時間

## 服務層

### cloudflareService.js
- **功能**: Cloudflare Workers API 集成
- **方法**: 
  - login(username, password)
  - getStudents()
  - getCourses()
  - getSchedule()
  - getMakeupRecords()
  - getMealRecords()
  - addMakeupRequest()

### auth.js
- **功能**: JWT Token 管理
- **方法**:
  - setToken(token)
  - getToken()
  - removeToken()
  - isTokenValid()

## 組件使用指南

### 1. 添加新頁面
```typescript
// 1. 創建頁面組件
const NewPage = () => {
  return <div>新頁面內容</div>;
};

// 2. 在App.tsx中添加路由
<Route path="/new-page" element={
  <PrivateRoute>
    <Layout>
      <NewPage />
    </Layout>
  </PrivateRoute>
} />
```

### 2. 添加側邊欄項目
```typescript
// 在Sidebar.tsx中添加新的導航項
<li>
  <a href="/new-page" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
    <FiNewIcon className="w-5 h-5" />
    <span className="ml-3">新頁面</span>
  </a>
</li>
```

### 3. 創建新的 Cloudflare API 組件
```typescript
import cloudflareService from '../services/cloudflareService';

const NewCloudflareComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await cloudflareService.getStudents();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // 組件JSX
  );
};
```

## 樣式指南

### Tailwind CSS類別
- **主要色彩**: `bg-brand-primary`, `text-brand-primary`
- **佈局**: `container`, `mx-auto`, `px-4`
- **響應式**: `sm:`, `md:`, `lg:`, `xl:`
- **間距**: `p-4`, `m-4`, `space-y-4`

### 自定義CSS變數
```css
var(--brand-primary)
var(--brand-secondary)
var(--brand-accent)
var(--brand-background)
var(--brand-surface)
var(--brand-text)
var(--brand-text-light)
```

## 最佳實踐

### 1. 組件結構
- 使用函數組件和Hooks
- 保持組件單一職責
- 適當的狀態管理

### 2. 錯誤處理
- 使用try-catch包裝異步操作
- 提供用戶友好的錯誤信息
- 適當的loading狀態

### 3. 性能優化
- 使用React.memo適當優化
- 避免不必要的重新渲染
- 合理使用useEffect依賴

### 4. 類型安全
- 為所有props定義TypeScript接口
- 使用適當的類型註解
- 避免使用any類型
