declare const googleSheetsService: {
  getStudents: () => Promise<any[]>;
  getCourses: () => Promise<any[]>;
  addMakeupRequest: (data: any) => Promise<any>;
  [key: string]: any;
};

export default googleSheetsService;