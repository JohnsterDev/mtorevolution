import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { ArrowLeft, Send, Eye, Copy, Star, Clock, Target, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProtocoloPreDefinido {
  id: string;
  nome: string;
  descricao: string;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  duracaoSemanas: number;
  objetivo: string;
  exercicios: number;
  popularidade: number;
  preview: string[];
}

const protocolosPreDefinidos: ProtocoloPreDefinido[] = [
  {
    id: '1',
    nome: 'Treino Iniciante - Corpo Inteiro',
    descricao: 'Protocolo completo para iniciantes focado em movimentos básicos e desenvolvimento de força base.',
    nivel: 'INICIANTE',
    duracaoSemanas: 8,
    objetivo: 'Condicionamento geral e aprendizado de movimentos',
    exercicios: 12,
    popularidade: 95,
    preview: ['Agachamento', 'Flexão de braço', 'Prancha', 'Remada com elástico']
  },
  {
    id: '2',
    nome: 'Hipertrofia Intermediária',
    descricao: 'Programa de hipertrofia com divisão por grupos musculares para praticantes intermediários.',
    nivel: 'INTERMEDIARIO',
    duracaoSemanas: 12,
    objetivo: 'Ganho de massa muscular',
    exercicios: 24,
    popularidade: 88,
    preview: ['Supino reto', 'Agachamento livre', 'Puxada frontal', 'Desenvolvimento militar']
  },
  {
    id: '3',
    nome: 'Força Avançada - Powerlifting',
    descricao: 'Protocolo avançado focado nos três movimentos do powerlifting com periodização.',
    nivel: 'AVANCADO',
    duracaoSemanas: 16,
    objetivo: 'Desenvolvimento de força máxima',
    exercicios: 18,
    popularidade: 76,
    preview: ['Agachamento', 'Supino', 'Levantamento terra', 'Acessórios específicos']
  },
  {
    id: '4',
    nome: 'Condicionamento Funcional',
    descricao: 'Treino funcional com movimentos compostos para melhora do condicionamento físico.',
    nivel: 'INTERMEDIARIO',
    duracaoSemanas: 10,
    objetivo: 'Condicionamento físico e mobilidade',
    exercicios: 20,
    popularidade: 82,
    preview: ['Burpees', 'Kettlebell swing', 'Mountain climbers', 'Turkish get-up']
  },
  {
    id: '5',
    nome: 'Perda de Peso - HIIT',
    descricao: 'Protocolo de alta intensidade combinando exercícios de força e cardio para queima de gordura.',
    nivel: 'INICIANTE',
    duracaoSemanas: 6,
    objetivo: 'Perda de peso e definição',
    exercicios: 16,
    popularidade: 91,
    preview: ['Jumping jacks', 'Agachamento jump', 'Prancha dinâmica', 'Sprint no lugar']
  },
  {
    id: '6',
    nome: 'Força e Potência - Atletas',
    descricao: 'Programa específico para atletas focado em desenvolvimento de força e potência explosiva.',
    nivel: 'AVANCADO',
    duracaoSemanas: 14,
    objetivo: 'Performance atlética',
    exercicios: 22,
    popularidade: 79,
    preview: ['Power clean', 'Agachamento jump', 'Arremesso de medicine ball', 'Pliometria']
  }
];

export function ProtocolosPreDefinidos() {
  const navigate = useNavigate();
  const [selectedProtocolo, setSelectedProtocolo] = useState<string | null>(null);

  const handleSendProtocolo = (protocoloId: string) => {
    // TODO: Implementar modal para selecionar cliente
    toast.success('Funcionalidade de envio será implementada');
  };

  const handleCopyProtocolo = (protocoloId: string) => {
    // TODO: Implementar cópia do protocolo para personalização
    toast.success('Protocolo copiado para personalização');
    navigate('/protocolos/novo', { state: { copyFrom: protocoloId } });
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'INICIANTE':
        return 'from-green-500 to-emerald-500';
      case 'INTERMEDIARIO':
        return 'from-yellow-500 to-orange-500';
      case 'AVANCADO':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getNivelBadge = (nivel: string) => {
    const colors = {
      INICIANTE: 'bg-green-100 text-green-800 border-green-200',
      INTERMEDIARIO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      AVANCADO: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[nivel as keyof typeof colors]}`;
  };

  return (
    <Layout title="Protocolos Pré-definidos">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/protocolos')}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Protocolos Pré-definidos
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Selecione e envie protocolos testados e aprovados
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total de Protocolos', value: protocolosPreDefinidos.length, icon: Target, color: 'from-blue-500 to-blue-600' },
            { label: 'Iniciante', value: protocolosPreDefinidos.filter(p => p.nivel === 'INICIANTE').length, icon: Users, color: 'from-green-500 to-green-600' },
            { label: 'Intermediário', value: protocolosPreDefinidos.filter(p => p.nivel === 'INTERMEDIARIO').length, icon: Target, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Avançado', value: protocolosPreDefinidos.filter(p => p.nivel === 'AVANCADO').length, icon: Star, color: 'from-red-500 to-red-600' },
          ].map((stat, index) => (
            <GlassCard key={stat.label} className="text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Protocolos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {protocolosPreDefinidos.map((protocolo, index) => (
            <motion.div
              key={protocolo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="h-full hover:shadow-2xl transition-all duration-300 group">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                        {protocolo.nome}
                      </h3>
                      <span className={getNivelBadge(protocolo.nivel)}>
                        {protocolo.nivel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{protocolo.popularidade}%</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {protocolo.descricao}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{protocolo.duracaoSemanas}</p>
                      <p className="text-xs text-gray-500">semanas</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{protocolo.exercicios}</p>
                      <p className="text-xs text-gray-500">exercícios</p>
                    </div>
                    <div className="text-center">
                      <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{protocolo.popularidade}%</p>
                      <p className="text-xs text-gray-500">aprovação</p>
                    </div>
                  </div>

                  {/* Objetivo */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objetivo:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{protocolo.objetivo}"</p>
                  </div>

                  {/* Preview */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exercícios principais:</p>
                    <div className="flex flex-wrap gap-2">
                      {protocolo.preview.map((exercicio, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-lg"
                        >
                          {exercicio}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProtocolo(protocolo.id)}
                      className="flex-1 hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyProtocolo(protocolo.id)}
                      className="flex-1 hover:bg-green-100 hover:text-green-600"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Personalizar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendProtocolo(protocolo.id)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Não encontrou o que procura?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Crie um protocolo personalizado do zero ou personalize um dos nossos modelos pré-definidos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/protocolos/novo')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Protocolo Personalizado
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/protocolos')}
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  Ver Todos os Protocolos
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}