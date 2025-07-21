import { useState } from 'react';
import googleSheetsService from '../services/googleSheetsService';

const GoogleSheetsTest = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 測試讀取學生資料
  const testGetStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await googleSheetsService.getStudents();
      setStudents(data);
      console.log('Students data:', data);
    } catch (err) {
      setError(`讀取學生資料失敗: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // 測試讀取課程資料
  const testGetCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await googleSheetsService.getCourses();
      setCourses(data);
      console.log('Courses data:', data);
    } catch (err) {
      setError(`讀取課程資料失敗: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // 測試新增補課申請
  const testAddMakeupRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await googleSheetsService.addMakeupRequest(
        '1', // 學生ID
        '1', // 原課程ID
        '2', // 補課課程ID
        '測試補課申請'
      );
      console.log('Add makeup request result:', result);
      alert('補課申請新增成功！');
    } catch (err) {
      setError(`新增補課申請失敗: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Sheets API 測試</h1>
      
      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 載入狀態 */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          載入中...
        </div>
      )}

      {/* 測試按鈕 */}
      <div className="space-x-4 mb-6">
        <button
          onClick={testGetStudents}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          測試讀取學生資料
        </button>
        
        <button
          onClick={testGetCourses}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          測試讀取課程資料
        </button>
        
        <button
          onClick={testAddMakeupRequest}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          測試新增補課申請
        </button>
      </div>

      {/* 學生資料顯示 */}
      {students.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">學生資料</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(students[0]).map(key => (
                    <th key={key} className="px-4 py-2 border-b text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(student).map((value, i) => (
                      <td key={i} className="px-4 py-2 border-b">
                        {String(value || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 課程資料顯示 */}
      {courses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">課程資料</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(courses[0]).map(key => (
                    <th key={key} className="px-4 py-2 border-b text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(course).map((value, i) => (
                      <td key={i} className="px-4 py-2 border-b">
                        {String(value || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 設定說明 */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">設定說明</h3>
        <p className="text-sm text-gray-600">
          請確保已設定以下環境變數：
        </p>
        <ul className="text-sm text-gray-600 mt-2">
          <li>• REACT_APP_GOOGLE_SHEETS_ID</li>
          <li>• REACT_APP_GOOGLE_API_KEY</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          並且 Google Sheets 已正確設定權限和工作表結構。
        </p>
      </div>
    </div>
  );
};

export default GoogleSheetsTest;