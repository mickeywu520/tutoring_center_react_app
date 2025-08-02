-- Users（用戶表）
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student'))
);

-- Courses（課程表）
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    room TEXT,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Schedules（課表表）
CREATE TABLE schedules (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    course_id TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'leave_requested', 'rescheduled')),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Reschedules（補課紀錄表）
CREATE TABLE reschedules (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    original_schedule_id TEXT NOT NULL,
    rescheduled_schedule_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (original_schedule_id) REFERENCES schedules(id),
    FOREIGN KEY (rescheduled_schedule_id) REFERENCES schedules(id)
);

-- 插入初始數據
-- 管理員用戶
INSERT INTO users (id, name, username, password_hash, role) VALUES 
('admin-001', '管理員', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin'); -- 密碼: admin

-- 教師用戶
INSERT INTO users (id, name, username, password_hash, role) VALUES 
('teacher-001', '張老師', 'teacher1', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'teacher'), -- 密碼: admin
('teacher-002', '李老師', 'teacher2', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'teacher'); -- 密碼: admin

-- 學生用戶
INSERT INTO users (id, name, username, password_hash, role) VALUES 
('student-001', '王小明', 'student1', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'student'), -- 密碼: admin
('student-002', '李小華', 'student2', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'student'); -- 密碼: admin

-- 課程
INSERT INTO courses (id, name, teacher_id, room) VALUES 
('course-001', '數學 A 班', 'teacher-001', '教室 1'),
('course-002', '物理實驗', 'teacher-002', '實驗室 1'),
('course-003', '英文會話', 'teacher-001', '教室 2');

-- 課表
INSERT INTO schedules (id, student_id, course_id, start_time, end_time, status) VALUES 
('schedule-001', 'student-001', 'course-001', '2025-07-21T10:00:00', '2025-07-21T12:00:00', 'scheduled'),
('schedule-002', 'student-001', 'course-002', '2025-07-22T14:00:00', '2025-07-22T16:00:00', 'scheduled'),
('schedule-003', 'student-002', 'course-003', '2025-07-24T19:00:00', '2025-07-24T20:30:00', 'scheduled');
