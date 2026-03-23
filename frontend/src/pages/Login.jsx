import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Link2 } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Can\'t be empty').email('Invalid email address'),
  password: z.string().min(1, 'Please check again'),
});

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setGlobalError('');
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/links');
    } catch (err) {
      setGlobalError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="flex items-center gap-2 text-primary-600 font-bold text-3xl mb-12">
        <Link2 className="w-10 h-10 p-2 bg-primary-600 text-white rounded-xl shadow-md" />
        <span className="tracking-tight">devlinks</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
          <p className="text-slate-500">Add your details below to get back into the app</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input 
            label="Email address" 
            placeholder="e.g. alex@email.com" 
            icon={Mail} 
            error={errors.email?.message} 
            {...register('email')} 
          />
          
          <Input 
            type="password" 
            label="Password" 
            placeholder="Enter your password" 
            icon={Lock} 
            error={errors.password?.message} 
            {...register('password')} 
          />

          {globalError && <p className="text-red-500 text-sm font-medium animate-fade-in">{globalError}</p>}

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Login
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-500">
          Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Create account</Link>
        </p>
      </div>
    </div>
  );
};
