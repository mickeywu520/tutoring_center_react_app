declare const googleSheetsService: {
  getStudents: () => Promise<any[]>;
  getCourses: () => Promise<any[]>;
  addMakeupRequest: (studentId: string, originalCourseId: string, makeupCourseId: string, reason: string) => Promise<any>;
  [key: string]: any;
};

export default googleSheetsService;