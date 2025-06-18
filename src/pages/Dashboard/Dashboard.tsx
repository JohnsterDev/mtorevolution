import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Users, Activity, FileText, TrendingUp, Calendar, Target, Zap, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';

// Mock data for charts
const performanceData = [
  { month: 'Jan', peso: 75, gordura: 12, massa: 63 },
  { month: 'Fev', peso: 74, gordura: 11.5, massa: 62.5 },
  { month: 'Mar', peso: 73, gordura: 11, massa: 62 },
  { month: 'Abr', peso: 72, gordura: 10.5, massa: 61.5 },
  { month: 'Mai', peso: 71, gordura: 10, massa: 61 },
  { month: 'Jun', peso: 70, gordura: 9.5, massa: 60.5 },
];

const workoutData = [
  { day: 'Seg', treinos: 2, calorias: 450 },
  { day: 'Ter', treinos: 1, calorias: 320 },
  { day: 'Qua', treinos: 2, calorias: 480 },
  { day: 'Qui', treinos: 1, calorias: 290 },
  { day: 'Sex', treinos: 2, calorias: 520 },
  { day: 'Sab', treinos: 1, calorias: 380 },
  { day: 'Dom', treinos: 0, calorias: 0 },
];

const progressData = [
  { name: 'Força', value: 85, color: '#6366f1' },
  { name: 'Resistência', value: 72, color: '#8b5cf6' },
  { name: 'Flexibilidade', value: 68, color: '#ec4899' },
  { name: 'Composição', value: 91, color: '#10b981' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

export function Dashboard() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalClientes: 0,
    avaliacoesRecentes: 0,
    treinosAtivos: 0,
    dietasAtivas: 0,
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const timer = setTimeout(() => {
      setStats({
        totalClientes: 45,
        avaliacoesRecentes: 12,
        treinosAtivos: 38,
        dietasAtivas: 42,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isCoachOrAdmin = hasRole('COACH') || hasRole('ADMIN');

  const statsCards = [
    ...(isCoachOrAdmin ? [{
      title: 'Total de Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    }] : []),
    {
      title: isCoachOrAdmin ? 'Avaliações Recentes' : 'Suas Avaliações',
      value: stats.avaliacoesRecentes,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      change: '+8%',
    },
    {
      title: isCoachOrAdmin ? 'Treinos Ativos' : 'Seus Treinos',
      value: stats.treinosAtivos,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
    },
    {
      title: isCoachOrAdmin ? 'Dietas Ativas' : 'Suas Dietas',
      value: stats.dietasAtivas,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      change: '+5%',
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <GlassCard className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-0">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold mb-2"
                  >
                    Bem-vindo, {user?.name}! 🚀
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-indigo-100 text-lg"
                  >
                    {hasRole('CLIENTE') 
                      ? 'Potencialize sua evolução e alcance seus objetivos.'
                      : 'Gerencie seus atletas e monitore o desempenho da equipe.'
                    }
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="hidden md:block"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={ref}>
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.span>
                    </motion.p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evolução Física
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    name="Peso (kg)"
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gordura" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    name="% Gordura"
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="massa" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Massa Muscular (kg)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Workout Frequency Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Frequência de Treinos
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="treinos" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Progresso Geral
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {progressData.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-2"
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <Activity className="w-6 h-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Atividades Recentes
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Activity,
                    title: 'Nova avaliação física registrada',
                    time: 'Há 2 horas',
                    color: 'from-blue-500 to-blue-600',
                  },
                  {
                    icon: Target,
                    title: 'Treino de força completado',
                    time: 'Há 5 horas',
                    color: 'from-green-500 to-green-600',
                  },
                  {
                    icon: FileText,
                    title: 'Nova dieta criada',
                    time: 'Ontem',
                    color: 'from-orange-500 to-orange-600',
                  },
                  {
                    icon: Users,
                    title: 'Novo cliente cadastrado',
                    time: 'Há 2 dias',
                    color: 'from-purple-500 to-purple-600',
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center shadow-lg mr-4`}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}