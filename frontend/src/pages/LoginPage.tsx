import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // --- Mock Login Logic ---
    if (username === 'student' && password === 'password') {
      // In a real app, you'd get a token from the API
      const fakeToken = 'this-is-a-fake-jwt-token';
      login(fakeToken);
      navigate('/');
    } else {
      setError('帳號或密碼錯誤');
    }
    // --- End Mock Login Logic ---
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-gray-100 font-sans">
      <div className="w-full max-w-sm p-8 space-y-8 bg-neutral-white rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-blue-700">補課系統</h1>
            <p className="mt-2 text-neutral-gray-700">學生登入</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="text-sm font-semibold text-neutral-gray-700">帳號</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 bg-neutral-gray-50 border border-neutral-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent transition"
              placeholder="請輸入學生帳號"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-neutral-gray-700">密碼</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 bg-neutral-gray-50 border border-neutral-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent transition"
              placeholder="請輸入密碼"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button type="submit" className="w-full px-4 py-3 font-semibold text-neutral-white bg-primary-blue-500 rounded-lg hover:bg-primary-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue-500 transition-colors duration-300">
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
