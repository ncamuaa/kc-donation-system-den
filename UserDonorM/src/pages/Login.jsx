import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export function Login() {
  const { login, authError, authLoading } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
            KC
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Create one
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="rounded-b-none"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="rounded-t-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Error */}
          {authError && (
            <p className="text-sm text-red-600 text-center">{authError}</p>
          )}

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

      </div>
    </div>
  );
}