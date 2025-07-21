import { useState } from 'react';
import modernGoogleSheetsService from '../services/modernGoogleSheetsService';

const ModernGoogleSheetsTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('auto');

  // 測試不同的存取方式
  const testConnection = async (testMethod = 'auto') => {
    setLoading(true);
    setResult('');

    try {
      let data;
      
      switch (testMethod) {
        case 'viz':
          console.log('測試 Google Visualization API');
          data = await modernGoogleSheetsService.getSheetDataViz('Students');
          break;
        case 'csv':
          console.log('測試 CSV 匯出');
          data = await modernGoogleSheetsService.getSheetDataCSV('Students');
          break;
        case 'api':
          console.log('測試 Sheets API v4');
          data = await modernGoogleSheetsService.getSheetDataAPI('Students');
          break;
        default:
          console.log('自動選擇最佳方式');
          data = await modernGoogleSheetsService.getSheetData('Students');
      }
      
      setResult(`✅ 連接成功！使用方式: ${testMethod}\n\n取得 ${data.length} 筆學生資料：\n${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      console.error('連接錯誤:', error);
      setResult(`❌ 連接失敗 (${testMethod})：${error.message}\n\n可能的解決方案：\n1. 確保 Google Sheets 設為公開\n2. 檢查工作表名稱是否為 'Students'\n3. 確認 Sheet ID 正確\n4. 如果使用 API 方式，檢查 API 金鑰`);
    } finally {
      setLoading(false);
    }
  };

  // 測試所有工作表
  const testAllSheets = async () => {
    setLoading(true);
    setResult('');

    const sheets = ['Students', 'Courses', 'MakeupRecords', 'MealRecords'];
    const results = {};

    for (const sheetName of sheets) {
      try {
        console.log(`測試工作表: ${sheetName}`);
        const data = await modernGoogleSheetsService.getSheetData(sheetName);
        results[sheetName] = `✅ 成功 (${data.length} 筆資料)`;
      } catch (error) {
        results[sheetName] = `❌ 失敗: ${error.message}`;
      }
    }

    setResult(`📊 所有工作表測試結果：\n\n${Object.entries(results).map(([sheet, result]) => `${sheet}: ${result}`).join('\n')}`);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">現代化 Google Sheets API 測試</h1>
      
      {/* 測試方式選擇 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">選擇測試方式：</label>
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="border rounded px-3 py-2 mr-4"
        >
          <option value="auto">自動選擇最佳方式</option>
          <option value="viz">Google Visualization API (無需金鑰)</option>
          <option value="csv">CSV 匯出 (無需金鑰)</option>
          <option value="api">Sheets API v4 (需要金鑰)</option>
        </select>
      </div>

      {/* 測試按鈕 */}
      <div className="space-x-4 mb-6">
        <button
          onClick={() => testConnection(method)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '測試中...' : '測試 Students 工作表'}
        </button>
        
        <button
          onClick={testAllSheets}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '測試中...' : '測試所有工作表'}
        </button>
      </div>

      {/* 結果顯示 */}
      {result && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">測試結果：</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {/* 設定說明 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="font-semibold mb-2">🔓 無金鑰方式 (推薦)</h3>
          <ul className="text-sm space-y-1">
            <li>✅ Google Visualization API</li>
            <li>✅ CSV 匯出</li>
            <li>❗ 需要 Google Sheets 設為公開</li>
            <li>❗ 只能讀取，無法寫入</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="font-semibold mb-2">🔑 API 金鑰方式</h3>
          <ul className="text-sm space-y-1">
            <li>✅ 可讀取和寫入</li>
            <li>✅ 更好的安全性</li>
            <li>❗ 需要設定 API 金鑰</li>
            <li>❗ 需要啟用 Sheets API</li>
          </ul>
        </div>
      </div>

      {/* 當前設定 */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">當前設定：</h3>
        <p className="text-sm">Sheet ID: 1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk</p>
        <p className="text-sm">API Key: {process.env.REACT_APP_GOOGLE_API_KEY ? '已設定 ✅' : '未設定 (使用無金鑰方式) ⚠️'}</p>
      </div>

      {/* 下一步建議 */}
      <div className="mt-4 p-4 bg-green-100 rounded">
        <h3 className="font-semibold mb-2">📋 下一步建議：</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>先確保 Google Sheets 設為公開</li>
          <li>建立 Students, Courses, MakeupRecords, MealRecords 工作表</li>
          <li>測試無金鑰存取是否成功</li>
          <li>如果需要寫入功能，再考慮設定 API 金鑰</li>
        </ol>
      </div>
    </div>
  );
};

export default ModernGoogleSheetsTest;