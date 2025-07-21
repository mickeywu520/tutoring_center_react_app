// Google Sheets API 服務
// 這是範例程式碼，需要您提供實際的 Sheet ID 和 API Key

const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

class GoogleSheetsService {
  constructor() {
    this.sheetId = SHEET_ID;
    this.apiKey = API_KEY;
  }

  // 讀取指定工作表的所有資料
  async getSheetData(sheetName) {
    try {
      const url = `${BASE_URL}/${this.sheetId}/values/${sheetName}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseSheetData(data.values);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  }

  // 將原始資料轉換為物件陣列
  parseSheetData(values) {
    if (!values || values.length === 0) {
      return [];
    }

    const headers = values[0];
    const rows = values.slice(1);

    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  // 新增資料到工作表
  async appendData(sheetName, data) {
    try {
      const url = `${BASE_URL}/${this.sheetId}/values/${sheetName}:append`;
      const response = await fetch(`${url}?valueInputOption=RAW&key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [data]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error appending data:', error);
      throw error;
    }
  }

  // 更新特定範圍的資料
  async updateData(sheetName, range, data) {
    try {
      const url = `${BASE_URL}/${this.sheetId}/values/${sheetName}!${range}`;
      const response = await fetch(`${url}?valueInputOption=RAW&key=${this.apiKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  // 取得學生資料
  async getStudents() {
    return await this.getSheetData('Students');
  }

  // 取得課程資料
  async getCourses() {
    return await this.getSheetData('Courses');
  }

  // 取得補課記錄
  async getMakeupRecords() {
    return await this.getSheetData('MakeupRecords');
  }

  // 取得餐費記錄
  async getMealRecords() {
    return await this.getSheetData('MealRecords');
  }

  // 新增補課申請
  async addMakeupRequest(studentId, originalCourseId, makeupCourseId, reason) {
    const data = [
      '', // ID (自動產生)
      studentId,
      originalCourseId,
      makeupCourseId,
      new Date().toISOString().split('T')[0], // 今天日期
      'pending', // 狀態
      reason
    ];
    
    return await this.appendData('MakeupRecords', data);
  }

  // 新增餐費記錄
  async addMealRecord(studentId, amount, type, description) {
    const data = [
      '', // ID (自動產生)
      studentId,
      amount,
      type, // 'consume' 或 'topup'
      new Date().toISOString().split('T')[0], // 今天日期
      description
    ];
    
    return await this.appendData('MealRecords', data);
  }
}

// 建立單例
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;