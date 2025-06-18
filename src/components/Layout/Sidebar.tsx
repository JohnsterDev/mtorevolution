import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  FileText, 
  Utensils, 
  Dumbbell, 
  TestTube, 
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Dna,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useOnboarding } from '../../hooks/useOnboarding';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['ADMIN', 'COACH', 'CLIENTE'], shortcut: 'Ctrl+D' },
  { name: 'Clientes', href: '/clientes', icon: Users, roles: ['ADMIN', 'COACH'], shortcut: 'Ctrl+C' },
  { name: 'Avaliações Físicas', href: '/avaliacoes', icon: Activity, roles: ['ADMIN', 'COACH', 'CLIENTE'], shortcut: 'Ctrl+A' },
  { name: 'Exames', href: '/exames', icon: TestTube, roles: ['ADMIN', 'COACH', 'CLIENTE'], shortcut: 'Ctrl+E' },
  { name: 'Dietas', href: '/dietas', icon: Utensils, roles: ['ADMIN', 'COACH', 'CLIENTE'] },
  { name: 'Treinos', href: '/treinos', icon: Dumbbell, roles: ['ADMIN', 'COACH', 'CLIENTE'], shortcut: 'Ctrl+T' },
  { name: 'Protocolos Hormonais', href: '/protocolos', icon: Shield, roles: ['ADMIN', 'COACH'] },
  { name: 'Relatórios', href: '/relatorios', icon: FileText, roles: ['ADMIN', 'COACH'] },
];

export function Sidebar() {
  const { user, logout, canAccess } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startOnboarding } = useOnboarding();

  const filteredNavigation = navigation.filter(item => canAccess(item.roles));

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center h-16 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
      >
        <Dna className="w-8 h-8 text-white" />
        <span className="ml-2 text-xl font-bold">mTOR-Evolution</span>
      </motion.div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105'
                }`
              }
              data-onboarding={item.name.toLowerCase().replace(' ', '-')}
            >
              <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              <span className="flex-1">{item.name}</span>
              {item.shortcut && (
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.shortcut}
                </span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 border-t border-gray-700"
      >
        {/* User Info */}
        <div className="flex items-center mb-4 p-3 bg-gray-800/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm font-bold">{user?.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-300" />
            )}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </button>

          <button
            onClick={startOnboarding}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <HelpCircle className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
            Tutorial
          </button>
          
          <NavLink
            to="/configuracoes"
            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <Settings className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Configurações
          </NavLink>
          
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform" />
            Sair
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}