import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext'; 

export function Register() {
  const { register, authError, authLoading } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    const success = await register(formData.name, formData.email, formData.password);
    if (success) navigate('/');
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
            KC
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Full name"
              className="rounded-b-none"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="rounded-none"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password (min. 8 characters)"
              className="rounded-none"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm password"
              className="rounded-t-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

      </div>
    </div>
  );
}