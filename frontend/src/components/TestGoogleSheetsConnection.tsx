import { useState } from 'react';
import cloudflareService from '../services/cloudflareService';

const TestGoogleSheetsConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 快速測試連接
  const quickTest = async () => {
    setLoading(true);
    setResult('正在測試連接...\n');

    try {
      // 測試讀取學生資料
      console.log('開始測試 Cloudflare API 連接...');
      const students = await cloudflareService.getStudents();
      
      setResult(prev => prev + `✅ 學生資料連接成功！\n取得 ${students.length} 筆資料\n\n資料內容：\n${JSON.stringify(students, null, 2)}`);
      
    } catch (error) {
      console.error('連接測試失敗:', error);
      setResult(prev => prev + `❌ 連接失敗：${error.message}\n\n請檢查：\n1. Cloudflare Workers 是否已正確部署\n2. API_BASE_URL 是否正確設定\n3. 網路連線是否正常`);
    } finally {
      setLoading(false);
    }
  };

  // 測試所有資料
  const testAllSheets = async () => {
    setLoading(true);
    setResult('正在測試所有資料...\n\n');

    const testData = [
      { name: 'Students', method: 'getStudents' },
      { name: 'Courses', method: 'getCourses' },
      { name: 'MakeupRecords', method: 'getMakeupRecords' },
      { name: 'MealRecords', method: 'getMealRecords' }
    ];

    for (const data of testData) {
      try {
        console.log(`測試 ${data.name} 資料...`);
        const result = await cloudflareService[data.method]();
        setResult(prev => prev + `✅ ${data.name}: 成功 (${result.length} 筆資料)\n`);
      } catch (error) {
        setResult(prev => prev + `❌ ${data.name}: 失敗 - ${error.message}\n`);
      }
    }

    setLoading(false);
  };

  // 測試寫入功能 (如果有 API 金鑰)
  const testWrite = async () => {
    setLoading(true);
    setResult('測試寫入功能...\n');

    try {
      // 這裡需要實現寫入功能
      setResult(prev => prev + '⚠️ 寫入功能需要 API 金鑰或 Google Apps Script\n目前只能讀取資料');
    } catch (error) {
      setResult(prev => prev + `❌ 寫入測試失敗：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎉 Cloudflare API 連接測試</h1>
      
      {/* 設定確認 */}
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">✅ 設定確認</h2>
        <ul className="text-sm space-y-1">
          <li>📊 Cloudflare Workers API</li>
          <li>🔗 API_BASE_URL: 請在 .env 文件中設定</li>
          <li>🔒 JWT 認證: 已啟用</li>
          <li>📋 資料表: Users, Courses, Schedules, Reschedules</li>
        </ul>
      </div>

      {/* 測試按鈕 */}
      <div className="space-x-4 mb-6 text-center">
        <button
          onClick={quickTest}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '🚀 快速測試'}
        </button>
        
        <button
          onClick={testAllSheets}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '📊 測試所有工作表'}
        </button>
        
        <button
          onClick={testWrite}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '✏️ 測試寫入'}
        </button>
      </div>

      {/* 結果顯示 */}
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">測試結果：</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}

      {/* 說明 */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-semibold mb-2">💡 說明</h3>
        <p className="text-sm">
          我們現在使用 Cloudflare Workers 作為後端 API，
          資料存儲在 Cloudflare D1 資料庫中，並使用 JWT 進行身份驗證。
          請確保已在 .env 文件中正確設定 REACT_APP_API_BASE_URL。
        </p>
      </div>
    </div>
  );
};

export default TestGoogleSheetsConnection;
