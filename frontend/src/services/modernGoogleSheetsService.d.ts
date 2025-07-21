declare const modernGoogleSheetsService: {
  getSheetData: (sheetName?: string) => Promise<any[]>;
  getSheetDataViz: (sheetName: string) => Promise<any[]>;
  getSheetDataCSV: (sheetName: string) => Promise<any[]>;
  getSheetDataAPI: (sheetName: string) => Promise<any[]>;
  getStudents: () => Promise<any[]>;
  getCourses: () => Promise<any[]>;
  getMakeupRecords: () => Promise<any[]>;
  getMealRecords: () => Promise<any[]>;
  testConnection: (sheetId?: string) => Promise<any>;
  parseGoogleSheetsData: (data: any) => any[];
  fetchCSVData: (sheetId: string, gid?: string) => Promise<string>;
  parseCSVToObjects: (csvText: string) => any[];
  [key: string]: any;
};

export default modernGoogleSheetsService;