import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import { useIdleTimer } from './hooks/useIdleTimer';
import TestGoogleSheetsConnection from './components/TestGoogleSheetsConnection';
import DebugGoogleSheets from './components/DebugGoogleSheets';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleIdle = () => {
    if (isAuthenticated) {
      logout();
      alert('由於您已閒置超過10分鐘，系統已自動將您登出。');
      navigate('/login');
    }
  };

  // 10 minutes in milliseconds
  const IDLE_TIMEOUT = 10 * 60 * 1000; 
  useIdleTimer(IDLE_TIMEOUT, handleIdle);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/test-sheets" element={<TestGoogleSheetsConnection />} />
      <Route path="/debug-sheets" element={<DebugGoogleSheets />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
