// Cloudflare Workers API 服務

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8787';

class CloudflareService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // 設置 JWT Token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 清除 JWT Token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // 通用請求方法
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // 如果有 Token，添加到請求頭
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 登入
  async login(username, password) {
    const data = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  // 取得學生課表
  async getSchedule(studentId = null) {
    const query = studentId ? `?studentId=${studentId}` : '';
    return await this.request(`/api/schedules${query}`);
  }

  // 提交請假申請
  async submitLeave(courseId) {
    return await this.request('/api/leave', {
      method: 'POST',
      body: JSON.stringify({ courseId })
    });
  }

  // 查詢可補課時段
  async getAvailableSlots(courseId) {
    return await this.request(`/api/available-slots?courseId=${courseId}`);
  }

  // 補課申請
  async reschedule(originalCourseId, rescheduledCourseId) {
    return await this.request('/api/reschedule', {
      method: 'POST',
      body: JSON.stringify({ originalCourseId, rescheduledCourseId })
    });
  }

  // 管理員獲取所有用戶資料
  async getUsers() {
    return await this.request('/api/admin/users');
  }

  // 取得學生資料
  async getStudents() {
    // 對於學生角色，這可能需要管理員權限
    // 在實際應用中，可能需要調整這個實現
    return await this.getUsers().then(users => 
      users.filter(user => user.role === 'student')
    );
  }

  // 取得課程資料
  async getCourses() {
    // 這個方法需要一個新的 API 端點來獲取所有課程
    // 暫時返回空數組，需要在後端實現對應的 API
    return [];
  }

  // 取得補課記錄
  async getMakeupRecords() {
    // 這個方法需要一個新的 API 端點來獲取補課記錄
    // 暫時返回空數組，需要在後端實現對應的 API
    return [];
  }

  // 取得餐費記錄
  async getMealRecords() {
    // 這個方法需要一個新的 API 端點來獲取餐費記錄
    // 暫時返回空數組，需要在後端實現對應的 API
    return [];
  }

  // 新增補課申請
  async addMakeupRequest(studentId, originalCourseId, makeupCourseId, reason) {
    // 這個功能已經通過 reschedule 方法實現
    // 這裡保持接口兼容性
    return await this.reschedule(originalCourseId, makeupCourseId);
  }

  // 新增餐費記錄
  async addMealRecord(studentId, amount, type, description) {
    // 餐費記錄功能需要在後端實現對應的 API
    // 暫時拋出錯誤，表示功能未實現
    throw new Error('Meal record functionality not implemented yet');
  }
}

// 建立單例
const cloudflareService = new CloudflareService();
export default cloudflareService;
