// 現代化 Google Sheets 服務 (無需 API 金鑰)

class ModernGoogleSheetsService {
  constructor() {
    this.sheetId = '1nzxmByLfUDs34kZavPQgK0Iyyp3Bx4i-PT6-5bDstRk';
    this.sheetName = 'tutoring_center';
  }

  // 方式 1: 使用 Google Visualization API (無需金鑰)
  async getSheetDataViz(sheetName) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      // 移除 Google 的 JSONP 包裝
      const jsonText = text.substring(47).slice(0, -2);
      const data = JSON.parse(jsonText);
      
      return this.parseVizData(data);
    } catch (error) {
      console.error('Error fetching sheet data (Viz API):', error);
      throw error;
    }
  }

  // 方式 2: 使用 CSV 匯出 (無需金鑰)
  async getSheetDataCSV(sheetName) {
    try {
      // 取得工作表的 gid (需要手動設定或動態取得)
      const gid = this.getSheetGid(sheetName);
      const url = `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv&gid=${gid}`;
      
      const response = await fetch(url);
      const csvText = await response.text();
      
      return this.parseCSVData(csvText);
    } catch (error) {
      console.error('Error fetching sheet data (CSV):', error);
      throw error;
    }
  }

  // 方式 3: 嘗試使用 Sheets API v4 (如果有設定金鑰)
  async getSheetDataAPI(sheetName) {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error('No API key provided');
    }

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}?key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseAPIData(data.values);
    } catch (error) {
      console.error('Error fetching sheet data (API):', error);
      throw error;
    }
  }

  // 智能選擇最佳方式
  async getSheetData(sheetName) {
    console.log(`嘗試讀取工作表: ${sheetName}`);

    // 優先順序：Viz API > CSV > API
    try {
      console.log('嘗試方式 1: Google Visualization API (無需金鑰)');
      return await this.getSheetDataViz(sheetName);
    } catch (error) {
      console.log('方式 1 失敗，嘗試方式 2: CSV 匯出');
      
      try {
        return await this.getSheetDataCSV(sheetName);
      } catch (error2) {
        console.log('方式 2 失敗，嘗試方式 3: Sheets API');
        
        return await this.getSheetDataAPI(sheetName);
      }
    }
  }

  // 解析 Google Visualization API 資料
  parseVizData(data) {
    if (!data.table || !data.table.rows) {
      return [];
    }

    const headers = data.table.cols.map(col => col.label || col.id);
    const rows = data.table.rows;

    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const cell = row.c[index];
        obj[header] = cell ? (cell.v || cell.f || '') : '';
      });
      return obj;
    });
  }

  // 解析 CSV 資料
  parseCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    return rows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  }

  // 解析 API 資料
  parseAPIData(values) {
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

  // 取得工作表 GID (需要手動設定)
  getSheetGid(sheetName) {
    const gidMap = {
      'Students': 0,        // 第一個工作表通常是 0
      'Courses': 1,         // 需要實際確認
      'MakeupRecords': 2,   // 需要實際確認
      'MealRecords': 3      // 需要實際確認
    };
    
    return gidMap[sheetName] || 0;
  }

  // 便利方法
  async getStudents() {
    return await this.getSheetData('Students');
  }

  async getCourses() {
    return await this.getSheetData('Courses');
  }

  async getMakeupRecords() {
    return await this.getSheetData('MakeupRecords');
  }

  async getMealRecords() {
    return await this.getSheetData('MealRecords');
  }
}

// 建立單例
const modernGoogleSheetsService = new ModernGoogleSheetsService();
export default modernGoogleSheetsService;