import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email wajib diisi';
    if (!password) newErrors.password = 'Password wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Gagal', result.message || 'Terjadi kesalahan');
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'manager') {
      setEmail('manager@soerbaja45.com');
      setPassword('Manager123');
    } else {
      setEmail('budi@soerbaja45.com');
      setPassword('Karyawan123');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>KPI Management System</Text>
          <Text style={styles.subtitle}>Soerbaja 45 Printing</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="email@soerbaja45.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock"
            error={errors.password}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <View style={styles.demoButtons}>
              <Button
                title="Manager"
                onPress={() => fillDemoCredentials('manager')}
                variant="secondary"
                style={styles.demoButton}
              />
              <Button
                title="Karyawan"
                onPress={() => fillDemoCredentials('karyawan')}
                variant="secondary"
                style={styles.demoButton}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Soerbaja 45 Printing</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  demoSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default LoginScreen;

