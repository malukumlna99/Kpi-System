import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DevisiPage from './pages/Devisi';
import KPIPage from './pages/KPI';
import UsersPage from './pages/Users';
import ReportsPage from './pages/Reports';

// Loading component
import Loading from './components/common/Loading';

function App() {
  const { isAuthenticated, loading, initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Layout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Manager Only Routes */}
        {user?.role === 'manager' && (
          <>
            <Route path="devisi" element={<DevisiPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </>
        )}
        
        {/* KPI Routes - Both roles */}
        <Route path="kpi" element={<KPIPage />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
