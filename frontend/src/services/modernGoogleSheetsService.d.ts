declare const modernGoogleSheetsService: {
  testConnection: (sheetId?: string) => Promise<any>;
  getSheetData: (sheetId?: string, gid?: string) => Promise<any>;
  parseGoogleSheetsData: (data: any) => any[];
  fetchCSVData: (sheetId: string, gid?: string) => Promise<string>;
  parseCSVToObjects: (csvText: string) => any[];
};

export default modernGoogleSheetsService;