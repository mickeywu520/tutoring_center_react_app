import { useState } from 'react';
import cloudflareService from '../services/cloudflareService';

const DebugCloudflare = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  // 測試登入功能
  const testLogin = async () => {
    setLoading(true);
    setResult('正在測試登入功能...\n\n');

    try {
      const data = await cloudflareService.login(username, password);
      
      setResult(prev => prev + `✅ 登入成功！\n用戶名: ${data.user.username}\n角色: ${data.user.role}\nToken: ${data.token.substring(0, 20)}...\n\n`);
      
      // 測試獲取資料
      try {
        const schedule = await cloudflareService.getSchedule();
        setResult(prev => prev + `📅 課表資料獲取成功！\n資料筆數: ${schedule.length}\n資料內容: ${JSON.stringify(schedule, null, 2)}\n\n`);
      } catch (error) {
        setResult(prev => prev + `❌ 課表資料獲取失敗: ${error.message}\n\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ 登入失敗: ${error.message}\n\n`);
    } finally {
      setLoading(false);
    }
  };

  // 測試獲取所有資料
  const testAllData = async () => {
    setLoading(true);
    setResult('正在測試獲取所有資料...\n\n');

    try {
      // 測試獲取用戶列表
      try {
        const users = await cloudflareService.getUsers();
        setResult(prev => prev + `👥 用戶列表獲取成功！\n資料筆數: ${users.length}\n資料內容: ${JSON.stringify(users, null, 2)}\n\n`);
      } catch (error) {
        setResult(prev => prev + `❌ 用戶列表獲取失敗: ${error.message}\n\n`);
      }
      
      // 測試獲取學生資料
      try {
        const students = await cloudflareService.getStudents();
        setResult(prev => prev + `🎓 學生資料獲取成功！\n資料筆數: ${students.length}\n資料內容: ${JSON.stringify(students, null, 2)}\n\n`);
      } catch (error) {
        setResult(prev => prev + `❌ 學生資料獲取失敗: ${error.message}\n\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ 測試獲取所有資料失敗: ${error.message}\n\n`);
    } finally {
      setLoading(false);
    }
  };

  // 測試 JWT Token
  const testToken = async () => {
    setLoading(true);
    setResult('正在測試 JWT Token...\n\n');

    try {
      const token = cloudflareService.token;
      
      if (token) {
        setResult(prev => prev + `✅ JWT Token 存在！\nToken: ${token.substring(0, 50)}...\n\n`);
      } else {
        setResult(prev => prev + `❌ JWT Token 不存在！\n請先登入以獲取 Token\n\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ JWT Token 測試失敗: ${error.message}\n\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Cloudflare API 除錯工具</h1>
      
      {/* 登入設定 */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">🔐 登入設定</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">用戶名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="用戶名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="密碼"
            />
          </div>
        </div>
      </div>
      
      <div className="space-x-4 mb-6">
        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '測試中...' : '🔑 測試登入'}
        </button>
        
        <button
          onClick={testAllData}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '測試中...' : '📊 測試所有資料'}
        </button>
        
        <button
          onClick={testToken}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '測試中...' : '📝 測試 Token'}
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
          <li>1. Cloudflare Workers API 未正確部署</li>
          <li>2. REACT_APP_API_BASE_URL 設定錯誤</li>
          <li>3. JWT Token 過期或無效</li>
          <li>4. 資料庫連接問題</li>
          <li>5. 網路連線問題</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugCloudflare;
