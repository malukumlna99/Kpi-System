import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email wajib diisi';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login gagal');
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'manager') {
      setFormData({ email: 'manager@soerbaja45.com', password: 'Manager123' });
    } else {
      setFormData({ email: 'budi@soerbaja45.com', password: 'Karyawan123' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S45</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">KPI Management System</h1>
            <p className="text-gray-600 mt-2">Soerbaja 45 Printing</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email@soerbaja45.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Masukkan password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Login
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-3 text-center font-semibold">
              Demo Accounts:
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => fillDemoCredentials('manager')}
              >
                Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => fillDemoCredentials('karyawan')}
              >
                Karyawan
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 Soerbaja 45 Printing. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

