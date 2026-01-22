import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Loading from '../components/common/Loading';

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

