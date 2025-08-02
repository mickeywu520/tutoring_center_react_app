import { useState } from 'react';
import cloudflareService from '../services/cloudflareService';

const TestCloudflareConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  // 登入測試
  const testLogin = async () => {
    setLoading(true);
    setResult('正在測試登入...\n');

    try {
      const data = await cloudflareService.login(username, password);
      setResult(prev => prev + `✅ 登入成功！\n用戶名: ${data.user.username}\n角色: ${data.user.role}\nToken: ${data.token.substring(0, 20)}...\n`);
    } catch (error) {
      console.error('登入測試失敗:', error);
      setResult(prev => prev + `❌ 登入失敗：${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  // 測試獲取課表
  const testGetSchedule = async () => {
    setLoading(true);
    setResult(prev => prev + '\n正在測試獲取課表...\n');

    try {
      const schedule = await cloudflareService.getSchedule();
      setResult(prev => prev + `✅ 課表獲取成功！\n取得 ${schedule.length} 筆資料\n\n資料內容：\n${JSON.stringify(schedule, null, 2)}\n`);
    } catch (error) {
      console.error('課表獲取失敗:', error);
      setResult(prev => prev + `❌ 課表獲取失敗：${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  // 測試獲取用戶列表（管理員功能）
  const testGetUsers = async () => {
    setLoading(true);
    setResult(prev => prev + '\n正在測試獲取用戶列表...\n');

    try {
      const users = await cloudflareService.getUsers();
      setResult(prev => prev + `✅ 用戶列表獲取成功！\n取得 ${users.length} 筆資料\n\n資料內容：\n${JSON.stringify(users, null, 2)}\n`);
    } catch (error) {
      console.error('用戶列表獲取失敗:', error);
      setResult(prev => prev + `❌ 用戶列表獲取失敗：${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  // 測試所有功能
  const testAll = async () => {
    await testLogin();
    await testGetSchedule();
    await testGetUsers();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎉 Cloudflare API 連接測試</h1>
      
      {/* 登入表單 */}
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

      {/* 測試按鈕 */}
      <div className="space-x-4 mb-6 text-center">
        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '🔑 測試登入'}
        </button>
        
        <button
          onClick={testGetSchedule}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '📅 測試獲取課表'}
        </button>
        
        <button
          onClick={testGetUsers}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '👥 測試獲取用戶列表'}
        </button>
        
        <button
          onClick={testAll}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? '測試中...' : '🚀 測試所有功能'}
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
          資料存儲在 Cloudflare D1 資料庫中。
          請確保已在 .env 文件中正確設定 REACT_APP_API_BASE_URL。
        </p>
      </div>
    </div>
  );
};

export default TestCloudflareConnection;
