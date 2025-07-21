import { useState } from 'react';
import modernGoogleSheetsService from '../services/modernGoogleSheetsService';

const TestGoogleSheetsConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 快速測試連接
  const quickTest = async () => {
    setLoading(true);
    setResult('正在測試連接...\n');

    try {
      // 測試讀取 Students 工作表
      console.log('開始測試 Google Sheets 連接...');
      const students = await modernGoogleSheetsService.getStudents();
      
      setResult(prev => prev + `✅ Students 工作表連接成功！\n取得 ${students.length} 筆資料\n\n資料內容：\n${JSON.stringify(students, null, 2)}`);
      
    } catch (error) {
      console.error('連接測試失敗:', error);
      setResult(prev => prev + `❌ 連接失敗：${error.message}\n\n請檢查：\n1. Google Sheets 是否已設為公開\n2. 是否有 Students 工作表\n3. 工作表是否有資料`);
    } finally {
      setLoading(false);
    }
  };

  // 測試所有工作表
  const testAllSheets = async () => {
    setLoading(true);
    setResult('正在測試所有工作表...\n\n');

    const sheets = [
      { name: 'Students', method: 'getStudents' },
      { name: 'Courses', method: 'getCourses' },
      { name: 'MakeupRecords', method: 'getMakeupRecords' },
      { name: 'MealRecords', method: 'getMealRecords' }
    ];

    for (const sheet of sheets) {
      try {
        console.log(`測試 ${sheet.name} 工作表...`);
        const data = await modernGoogleSheetsService[sheet.method]();
        setResult(prev => prev + `✅ ${sheet.name}: 成功 (${data.length} 筆資料)\n`);
      } catch (error) {
        setResult(prev => prev + `❌ ${sheet.name}: 失敗 - ${error.message}\n`);
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
      <h1 className="text-3xl font-bold mb-6 text-center">🎉 Google Sheets 連接測試</h1>
      
      {/* 設定確認 */}
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">✅ 設定確認</h2>
        <ul className="text-sm space-y-1">
          <li>📊 Google Sheets: tutoring_center</li>
          <li>🔗 Sheet ID: 1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk</li>
          <li>🔓 權限: 知道連結的人 (編輯者)</li>
          <li>📋 工作表: Students, Courses, MakeupRecords, MealRecords</li>
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
          我們使用 Google Visualization API 來讀取您的 Google Sheets 資料，
          這種方式不需要 API 金鑰，只要 Google Sheets 設為公開即可。
          如果需要寫入功能，我們可以後續加入 Google Apps Script 或 API 金鑰。
        </p>
      </div>
    </div>
  );
};

export default TestGoogleSheetsConnection;