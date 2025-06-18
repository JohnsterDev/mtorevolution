import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Dna, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/UI/Button';
import { AnimatedInput } from '../../components/UI/AnimatedInput';
import { GlassCard } from '../../components/UI/GlassCard';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const formValues = watch();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    if (!data.email || !data.password) {
      setLoginError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setLoginError(null);
    
    try {
      await login(data.email, data.password);
      
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'coach' | 'cliente') => {
    const credentials = {
      admin: { email: 'admin@mtor.com', password: 'admin123' },
      coach: { email: 'coach@mtor.com', password: 'coach123' },
      cliente: { email: 'cliente@mtor.com', password: 'cliente123' }
    };
    
    setValue('email', credentials[role].email);
    setValue('password', credentials[role].password);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <LoadingSpinner size="lg" color="text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4 z-10"
      >
        <GlassCard className="overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Dna className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              mTOR-Evolution
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 mt-2"
            >
              Potencialize sua evolução
            </motion.p>
          </div>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 mb-6"
          >
            <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Contas para Teste
            </h3>
            <div className="space-y-2">
              {[
                { role: 'admin', label: 'Administrador', email: 'admin@mtor.com', password: 'admin123' },
                { role: 'coach', label: 'Treinador', email: 'coach@mtor.com', password: 'coach123' },
                { role: 'cliente', label: 'Cliente', email: 'cliente@mtor.com', password: 'cliente123' },
              ].map((account, index) => (
                <motion.button
                  key={account.email}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  type="button"
                  onClick={() => fillDemoCredentials(account.role as any)}
                  className="w-full text-left text-xs text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 p-2 rounded-lg transition-all duration-200 flex items-center justify-between"
                >
                  <div>
                    <strong>{account.label}:</strong> {account.email}
                    <div className="text-xs opacity-75">Senha: {account.password}</div>
                  </div>
                  <span className="text-xs opacity-60">Clique para preencher</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Error Message */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-300">{loginError}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AnimatedInput
                label="Email"
                type="email"
                icon={<Mail className="w-5 h-5" />}
                autoComplete="email"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                error={errors.email?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AnimatedInput
                label="Senha"
                type="password"
                icon={<Lock className="w-5 h-5" />}
                autoComplete="current-password"
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 3,
                    message: 'Senha deve ter pelo menos 3 caracteres',
                  },
                })}
                error={errors.password?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Lembrar de mim
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Esqueceu a senha?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                loading={loading}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="text-white" />
                    <span className="ml-2">Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Cadastre-se
              </Link>
            </p>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}