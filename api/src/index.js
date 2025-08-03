import { Router } from 'itty-router';
import { json, withContent, withParams } from 'itty-router-extras';
import { createJWT, verifyJWT } from './auth.js';
import { hashPassword, verifyPassword } from './crypto.js';

// 創建路由器
const router = Router();

// CORS 中間件
const cors = (request, env) => {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // 可以添加其他允許的源
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    request.corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    };
  } else {
    request.corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    };
  }
};

// 處理預檢請求
router.options('*', (request) => {
  const headers = request.corsHeaders || {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
  
  return new Response(null, {
    status: 204,
    headers,
  });
});

// 中間件：解析JSON內容
router.all('*', withContent);

// 中間件：驗證JWT Token（用於需要認證的路由）
const withAuth = async (request, env) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    request.user = payload;
  } catch (e) {
    return new Response('Invalid token', { status: 401 });
  }
};

// 中間件：管理員權限驗證
const withAdmin = (request) => {
  if (request.user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }
};

// API路由

// 登入端點
router.post('/api/login', async ({ content }, env) => {
  const { username, password } = content;

  if (!username || !password) {
    return json({ error: 'Username and password are required' }, { status: 400 });
  }

  // 從D1資料庫查詢用戶
  const { results } = await env.DB.prepare(
    'SELECT id, name, username, password_hash, role FROM users WHERE username = ?'
  )
    .bind(username)
    .all();

  if (results.length === 0) {
    return json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const user = results[0];

  // 驗證密碼
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 創建JWT Token
  const token = await createJWT({ id: user.id, role: user.role }, env.JWT_SECRET);

  // 返回Token和用戶信息
  return json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    }
  });
});

// 獲取特定學生課表
router.get('/api/schedules', withAuth, async ({ user, query }, env) => {
  const studentId = query.studentId || user.id;

  // 如果用戶不是管理員，只能查詢自己的課表
  if (user.role !== 'admin' && studentId !== user.id) {
    return json({ error: 'Forbidden' }, { status: 403 });
  }

  // 從D1資料庫查詢課表
  const { results } = await env.DB.prepare(`
    SELECT s.id, s.student_id, s.course_id, s.start_time, s.end_time, s.status,
           c.name as course_name, c.teacher_id, c.room
    FROM schedules s
    JOIN courses c ON s.course_id = c.id
    WHERE s.student_id = ?
    ORDER BY s.start_time
  `)
    .bind(studentId)
    .all();

  return json(results);
});

// 提交請假申請
router.post('/api/leave', withAuth, async ({ content, user }, env) => {
  const { courseId } = content;

  if (!courseId) {
    return json({ error: 'Course ID is required' }, { status: 400 });
  }

  // 更新課表狀態為"已請假"
  const { success } = await env.DB.prepare(
    'UPDATE schedules SET status = ? WHERE student_id = ? AND course_id = ? AND status = ?'
  )
    .bind('leave_requested', user.id, courseId, 'scheduled')
    .run();

  if (!success) {
    return json({ error: 'Failed to submit leave request' }, { status: 500 });
  }

  return json({ success: true, message: 'Leave request submitted successfully' });
});

// 查詢可補課時段
router.get('/api/available-slots', withAuth, async ({ query }, env) => {
  const courseId = query.courseId;

  if (!courseId) {
    return json({ error: 'Course ID is required' }, { status: 400 });
  }

  // 查詢課程信息
  const courseResult = await env.DB.prepare(
    'SELECT teacher_id FROM courses WHERE id = ?'
  )
    .bind(courseId)
    .all();

  if (courseResult.results.length === 0) {
    return json({ error: 'Course not found' }, { status: 404 });
  }

  const teacherId = courseResult.results[0].teacher_id;

  // 查詢相同老師且有空位的課程時段
  const { results } = await env.DB.prepare(`
    SELECT s.id, s.course_id, s.start_time, s.end_time, c.name as course_name, c.room
    FROM schedules s
    JOIN courses c ON s.course_id = c.id
    WHERE c.teacher_id = ? AND s.status = 'scheduled'
    AND s.start_time > datetime('now')
    ORDER BY s.start_time
    LIMIT 20
  `)
    .bind(teacherId)
    .all();

  return json(results);
});

// 補課申請與更新
router.post('/api/reschedule', withAuth, async ({ content, user }, env) => {
  const { originalCourseId, rescheduledCourseId } = content;

  if (!originalCourseId || !rescheduledCourseId) {
    return json({ error: 'Original course ID and rescheduled course ID are required' }, { status: 400 });
  }

  // 開始事務處理
  const statements = [
    // 更新原課程狀態為"已註銷"
    env.DB.prepare(
      'UPDATE schedules SET status = ? WHERE student_id = ? AND course_id = ? AND status = ?'
    ).bind('rescheduled', user.id, originalCourseId, 'leave_requested'),
    
    // 創建補課記錄
    env.DB.prepare(
      'INSERT INTO reschedules (student_id, original_schedule_id, rescheduled_schedule_id, created_at) VALUES (?, ?, ?, ?)'
    ).bind(user.id, originalCourseId, rescheduledCourseId, new Date().toISOString()),
    
    // 更新補課時段狀態
    env.DB.prepare(
      'UPDATE schedules SET student_id = ?, status = ? WHERE course_id = ? AND student_id IS NULL'
    ).bind(user.id, 'scheduled', rescheduledCourseId)
  ];

  const results = await env.DB.batch(statements);
  
  // 檢查所有操作是否成功
  const allSuccess = results.every(result => result.success);
  
  if (!allSuccess) {
    return json({ error: 'Failed to reschedule' }, { status: 500 });
  }

  return json({ success: true, message: 'Reschedule successful' });
});

// 管理員獲取所有用戶資料
router.get('/api/admin/users', withAuth, withAdmin, async (request, env) => {
  const { results } = await env.DB.prepare(
    'SELECT id, name, username, role FROM users ORDER BY name'
  ).all();

  return json(results);
});

// 404處理
router.all('*', () => new Response('Not Found', { status: 404 }));

// 主處理函數
export default {
  async fetch(request, env) {
    // 處理CORS
    cors(request, env);
    
    return router.handle(request, env).then(response => {
      // 添加CORS頭到響應
      if (request.corsHeaders) {
        const headers = new Headers(response.headers);
        Object.entries(request.corsHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
      return response;
    }).catch(err => {
      console.error('Error:', err);
      return new Response('Internal Server Error', { status: 500 });
    });
  }
};
