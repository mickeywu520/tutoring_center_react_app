# 🔧 Tailwind CSS v4 配置修復

## 問題
您遇到的錯誤是因為 Tailwind CSS v4 的配置方式與 v3 不同。

## 修復內容

### 1. 更新 `src/index.css`
```css
@import "tailwindcss";

/* 添加了 CSS 變數支援 brand 顏色 */
@layer base {
  :root {
    --brand-primary: #1D4ED8;
    --brand-secondary: #10B981;
    --brand-accent: #4AB7E0;
    --brand-background: #F8FAFC;
    --brand-surface: #FFFFFF;
    --brand-text: #1F2937;
    --brand-text-light: #6B7280;
  }
}
```

### 2. 恢復標準 `tailwind.config.js`
- 使用標準的 Tailwind v3/v4 兼容配置
- 保留所有 brand 顏色定義

### 3. 修正 `postcss.config.js`
- 使用 `@tailwindcss/postcss` plugin

### 4. 更新 `vite.config.ts`
- 移除不兼容的 Tailwind Vite plugin
- 保持標準 PostCSS 處理

## 測試步驟

1. 重啟開發服務器:
```bash
cd frontend
npm run dev
```

2. 檢查瀏覽器控制台是否還有錯誤

3. 測試 brand 顏色是否正常顯示

## 如果仍有問題

如果還有問題，請嘗試:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```