import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Server } from 'lucide-react';
import { mockApiService } from '../services/mockApi';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('connected');
  const [showStatus, setShowStatus] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkBackendStatus();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setBackendStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkBackendStatus = async () => {
    if (!isOnline) {
      setBackendStatus('disconnected');
      return;
    }

    try {
      setBackendStatus('checking');
      
      const isHealthy = await mockApiService.healthCheck();
      setBackendStatus(isHealthy ? 'connected' : 'disconnected');
      setLastCheck(new Date());
      
      console.log(`🏥 Mock Backend Health Check: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    } catch (error) {
      console.error('❌ Mock backend health check failed:', error);
      setBackendStatus('disconnected');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    // Only show status briefly when there's an issue or during initial check
    const shouldShow = !isOnline || backendStatus === 'checking';
    setShowStatus(shouldShow);
    
    // Auto-hide after 3 seconds if everything is working
    if (isOnline && backendStatus === 'connected') {
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, backendStatus]);

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        message: 'Sem conexão com a internet',
        color: 'bg-red-500',
        textColor: 'text-white',
        borderColor: 'border-red-600'
      };
    }

    if (backendStatus === 'disconnected') {
      return {
        icon: Server,
        message: 'Sistema offline (modo local)',
        color: 'bg-orange-500',
        textColor: 'text-white',
        borderColor: 'border-orange-600'
      };
    }

    if (backendStatus === 'checking') {
      return {
        icon: AlertCircle,
        message: 'Verificando sistema...',
        color: 'bg-yellow-500',
        textColor: 'text-white',
        borderColor: 'border-yellow-600'
      };
    }

    return {
      icon: CheckCircle,
      message: 'Sistema online (modo local)',
      color: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-600'
    };
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${config.color} ${config.borderColor}`}>
            <config.icon className={`w-5 h-5 ${config.textColor} flex-shrink-0`} />
            <div className="flex-1">
              <span className={`text-sm font-medium ${config.textColor} block`}>
                {config.message}
              </span>
              {lastCheck && backendStatus !== 'checking' && (
                <span className={`text-xs ${config.textColor} opacity-80`}>
                  Última verificação: {lastCheck.toLocaleTimeString()}
                </span>
              )}
            </div>
            {backendStatus === 'disconnected' && (
              <button
                onClick={checkBackendStatus}
                className={`text-xs ${config.textColor} opacity-80 hover:opacity-100 underline`}
              >
                Verificar
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}