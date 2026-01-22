import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, login, logout, isManager, isKaryawan } = useAuthStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isManager: isManager(),
    isKaryawan: isKaryawan(),
  };
};

