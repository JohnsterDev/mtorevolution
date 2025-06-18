import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { OnboardingProvider } from './hooks/useOnboarding';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnboardingOverlay } from './components/Onboarding/OnboardingOverlay';
import { ConnectionStatus } from './components/ConnectionStatus';

// Auth Pages
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';

// Dashboard
import { Dashboard } from './pages/Dashboard/Dashboard';

// Clientes
import { ClientesList } from './pages/Clientes/ClientesList';
import { ClienteForm } from './pages/Clientes/ClienteForm';

// Protocolos
import { ProtocolosList } from './pages/Protocolos/ProtocolosList';
import { ProtocoloForm } from './pages/Protocolos/ProtocoloForm';
import { ProtocolosPreDefinidos } from './pages/Protocolos/ProtocolosPreDefinidos';

// Avaliações Físicas
import { AvaliacoesList } from './pages/Avaliacoes/AvaliacoesList';
import { AvaliacaoForm } from './pages/Avaliacoes/AvaliacaoForm';
import { AvaliacaoDetalhes } from './pages/Avaliacoes/AvaliacaoDetalhes';

// Exames Médicos
import { ExamesList } from './pages/Exames/ExamesList';
import { ExameForm } from './pages/Exames/ExameForm';
import { ExameDetalhes } from './pages/Exames/ExameDetalhes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OnboardingProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              {/* Connection Status */}
              <ConnectionStatus />

              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Clientes Routes - Only for ADMIN and COACH */}
                  <Route
                    path="/clientes"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ClientesList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/clientes/novo"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ClienteForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/clientes/:id/editar"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ClienteForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protocolos Routes - Only for ADMIN and COACH */}
                  <Route
                    path="/protocolos"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ProtocolosList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/protocolos/novo"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ProtocoloForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/protocolos/:id/editar"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ProtocoloForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/protocolos/pre-definidos"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ProtocolosPreDefinidos />
                      </ProtectedRoute>
                    }
                  />

                  {/* Avaliações Físicas Routes */}
                  <Route
                    path="/avaliacoes"
                    element={
                      <ProtectedRoute>
                        <AvaliacoesList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/nova"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <AvaliacaoForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/:id"
                    element={
                      <ProtectedRoute>
                        <AvaliacaoDetalhes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/:id/editar"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <AvaliacaoForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Exames Médicos Routes */}
                  <Route
                    path="/exames"
                    element={
                      <ProtectedRoute>
                        <ExamesList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/exames/novo"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ExameForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/exames/:id"
                    element={
                      <ProtectedRoute>
                        <ExameDetalhes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/exames/:id/editar"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <ExameForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Placeholder routes for other modules */}
                  <Route
                    path="/dietas"
                    element={
                      <ProtectedRoute>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 text-center"
                        >
                          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Dietas
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Módulo em desenvolvimento
                          </p>
                        </motion.div>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/treinos"
                    element={
                      <ProtectedRoute>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 text-center"
                        >
                          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Treinos
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Módulo em desenvolvimento
                          </p>
                        </motion.div>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/relatorios"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'COACH']}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 text-center"
                        >
                          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Relatórios
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Módulo em desenvolvimento
                          </p>
                        </motion.div>
                      </ProtectedRoute>
                    }
                  />

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AnimatePresence>

              {/* Onboarding Overlay */}
              <OnboardingOverlay />

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#374151',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;