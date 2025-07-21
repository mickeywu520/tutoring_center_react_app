import React, { useState } from 'react';

const SimpleGoogleSheetsTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 簡單測試 Google Sheets API 連接
  const testConnection = async () => {
    setLoading(true);
    setResult('');

    const SHEET_ID = '1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk';
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

    if (!API_KEY) {
      setResult('❌ 錯誤：請設定 REACT_APP_GOOGLE_API_KEY 環境變數');
      setLoading(false);
      return;
    }

    try {
      // 測試讀取 Students 工作表
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Students?key=${API_KEY}`;
      
      console.log('測試 URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setResult(`✅ 連接成功！\n\n取得資料：\n${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      console.error('連接錯誤:', error);
      setResult(`❌ 連接失敗：${error.message}\n\n請檢查：\n1. API 金鑰是否正確\n2. Google Sheets 是否公開\n3. 是否有 Students 工作表\n4. API 是否已啟用`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Google Sheets API 連接測試</h1>
      
      <div className="mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '測試中...' : '測試連接'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">測試結果：</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">設定檢查清單：</h3>
        <ul className="text-sm space-y-1">
          <li>□ 已建立 Google API 金鑰</li>
          <li>□ 已啟用 Google Sheets API</li>
          <li>□ Google Sheets 已設為公開</li>
          <li>□ 已建立 Students 工作表</li>
          <li>□ 已設定 .env 檔案</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-100 rounded">
        <h3 className="font-semibold mb-2">您的設定：</h3>
        <p className="text-sm">Sheet ID: 1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk</p>
        <p className="text-sm">API Key: {process.env.REACT_APP_GOOGLE_API_KEY ? '已設定 ✅' : '未設定 ❌'}</p>
      </div>
    </div>
  );
};

export default SimpleGoogleSheetsTest;