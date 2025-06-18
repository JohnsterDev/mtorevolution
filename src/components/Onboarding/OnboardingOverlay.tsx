import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { Button } from '../UI/Button';

const onboardingSteps = [
  {
    title: 'Bem-vindo ao mTOR-Evolution!',
    description: 'Potencialize sua evolução atlética com nossa plataforma completa de acompanhamento.',
    target: null,
  },
  {
    title: 'Dashboard Inteligente',
    description: 'Acompanhe seu progresso com gráficos em tempo real e métricas personalizadas.',
    target: '[data-onboarding="dashboard"]',
  },
  {
    title: 'Gestão de Clientes',
    description: 'Gerencie seus atletas de forma eficiente com ferramentas avançadas.',
    target: '[data-onboarding="clientes"]',
  },
  {
    title: 'Avaliações e Treinos',
    description: 'Registre avaliações físicas e crie treinos personalizados.',
    target: '[data-onboarding="avaliacoes"]',
  },
  {
    title: 'Atalhos do Teclado',
    description: 'Use Ctrl+D para Dashboard, Ctrl+C para Clientes, Ctrl+/ para buscar.',
    target: null,
  },
];

export function OnboardingOverlay() {
  const { isOnboardingActive, currentStep, nextStep, prevStep, skipOnboarding } = useOnboarding();

  if (!isOnboardingActive) return null;

  const step = onboardingSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      >
        {/* Spotlight effect */}
        {step.target && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-black/70" />
            <div 
              className="absolute bg-transparent border-4 border-indigo-500 rounded-lg shadow-2xl"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
              }}
            />
          </motion.div>
        )}

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
            <button
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-indigo-600'
                      : index < currentStep
                      ? 'bg-indigo-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {currentStep === onboardingSteps.length - 1 ? 'Finalizar' : 'Próximo'}
                {currentStep < onboardingSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}