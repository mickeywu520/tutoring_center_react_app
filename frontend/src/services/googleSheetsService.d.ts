declare const googleSheetsService: {
  getStudents: () => Promise<any[]>;
  getCourses: () => Promise<any[]>;
};

export default googleSheetsService;