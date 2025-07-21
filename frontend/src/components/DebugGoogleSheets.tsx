import { useState } from 'react';

const DebugGoogleSheets = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 直接測試原始 API 回應
  const testRawAPI = async () => {
    setLoading(true);
    setResult('正在檢查原始 API 回應...\n\n');

    const SHEET_ID = '1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk';
    
    try {
      // 測試 Google Visualization API
      const vizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Students`;
      console.log('測試 URL:', vizUrl);
      
      const response = await fetch(vizUrl);
      const text = await response.text();
      
      setResult(prev => prev + `📡 原始回應 (前 500 字元):\n${text.substring(0, 500)}\n\n`);
      
      // 嘗試解析
      if (text.includes('google.visualization.Query.setResponse')) {
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        
        setResult(prev => prev + `📊 解析後的資料結構:\n${JSON.stringify(data, null, 2)}\n\n`);
        
        if (data.table && data.table.cols) {
          setResult(prev => prev + `📋 欄位資訊:\n${data.table.cols.map(col => `- ${col.label || col.id} (${col.type})`).join('\n')}\n\n`);
        }
        
        if (data.table && data.table.rows) {
          setResult(prev => prev + `📈 資料行數: ${data.table.rows.length}\n`);
          if (data.table.rows.length > 0) {
            setResult(prev => prev + `第一行資料: ${JSON.stringify(data.table.rows[0])}\n`);
          }
        }
      } else {
        setResult(prev => prev + '❌ 無法解析 Google Visualization API 回應\n');
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ 錯誤: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  // 測試 CSV 方式
  const testCSV = async () => {
    setLoading(true);
    setResult('正在測試 CSV 匯出...\n\n');

    const SHEET_ID = '1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk';
    
    try {
      // 測試 CSV 匯出 (gid=0 是第一個工作表)
      const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
      console.log('CSV URL:', csvUrl);
      
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      
      setResult(prev => prev + `📄 CSV 內容:\n${csvText}\n\n`);
      
      if (csvText.trim()) {
        const lines = csvText.split('\n').filter(line => line.trim());
        setResult(prev => prev + `📊 CSV 分析:\n- 總行數: ${lines.length}\n- 第一行: ${lines[0]}\n`);
        if (lines.length > 1) {
          setResult(prev => prev + `- 第二行: ${lines[1]}\n`);
        }
      } else {
        setResult(prev => prev + '❌ CSV 內容為空\n');
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ CSV 測試錯誤: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  // 檢查工作表列表
  const checkSheetsList = async () => {
    setLoading(true);
    setResult('正在檢查工作表列表...\n\n');

    const SHEET_ID = '1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk';
    
    try {
      // 嘗試不同的工作表名稱
      const sheetNames = ['Students', 'Sheet1', '工作表1', 'students'];
      
      for (const sheetName of sheetNames) {
        try {
          const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
          const response = await fetch(url);
          const text = await response.text();
          
          if (text.includes('google.visualization.Query.setResponse')) {
            setResult(prev => prev + `✅ 找到工作表: "${sheetName}"\n`);
            
            const jsonText = text.substring(47).slice(0, -2);
            const data = JSON.parse(jsonText);
            
            if (data.table && data.table.rows) {
              setResult(prev => prev + `   - 資料行數: ${data.table.rows.length}\n`);
            }
          } else {
            setResult(prev => prev + `❌ 工作表 "${sheetName}" 不存在或無法存取\n`);
          }
        } catch (error) {
          setResult(prev => prev + `❌ 測試 "${sheetName}" 時發生錯誤: ${error.message}\n`);
        }
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ 檢查工作表列表錯誤: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Google Sheets 除錯工具</h1>
      
      <div className="space-x-4 mb-6">
        <button
          onClick={testRawAPI}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '檢查中...' : '🔍 檢查原始 API'}
        </button>
        
        <button
          onClick={testCSV}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '檢查中...' : '📄 檢查 CSV'}
        </button>
        
        <button
          onClick={checkSheetsList}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '檢查中...' : '📋 檢查工作表'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">除錯結果：</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">💡 可能的問題：</h3>
        <ul className="text-sm space-y-1">
          <li>1. 工作表名稱不是 "Students" (可能是 "Sheet1" 或 "工作表1")</li>
          <li>2. 工作表中沒有資料</li>
          <li>3. 第一行是標題但沒有資料行</li>
          <li>4. Google Sheets 權限設定問題</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugGoogleSheets;