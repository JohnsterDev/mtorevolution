import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { Input, Select } from '../../components/UI/Input';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Activity, 
  TrendingUp, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AvaliacaoFisica } from '../../types/avaliacao';
import { avaliacaoFisicaService } from '../../services/avaliacaoFisica';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export function AvaliacoesList() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'TODOS' | 'AGENDADA' | 'REALIZADA' | 'CANCELADA'>('TODOS');
  const [filterTipo, setFilterTipo] = useState<'TODOS' | 'INICIAL' | 'REAVALIACAO' | 'CONTROLE'>('TODOS');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    realizadas: 0,
    agendadas: 0,
    mediaImc: 0,
    mediaPercentualGordura: 0,
    proximasReavaliacoes: 0
  });

  useEffect(() => {
    loadAvaliacoes();
    loadStats();
  }, [currentPage, search, filterStatus, filterTipo]);

  const loadAvaliacoes = async () => {
    try {
      setLoading(true);
      const response = await avaliacaoFisicaService.getAll(currentPage, 10, undefined, search);
      
      let filteredContent = response.content;
      
      if (filterStatus !== 'TODOS') {
        filteredContent = filteredContent.filter(a => a.status === filterStatus);
      }
      
      if (filterTipo !== 'TODOS') {
        filteredContent = filteredContent.filter(a => a.tipo === filterTipo);
      }
      
      setAvaliacoes(filteredContent);
      setTotalPages(Math.ceil(filteredContent.length / 10));
    } catch (error) {
      toast.error('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await avaliacaoFisicaService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await avaliacaoFisicaService.delete(id);
        toast.success('Avaliação excluída com sucesso');
        loadAvaliacoes();
        loadStats();
      } catch (error) {
        toast.error('Erro ao excluir avaliação');
      }
    }
  };

  const handleExportPdf = async (id: string) => {
    try {
      const blob = await avaliacaoFisicaService.exportToPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avaliacao-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Relatório exportado com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      AGENDADA: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      REALIZADA: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      CANCELADA: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle }
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getTipoBadge = (tipo: string) => {
    const colors = {
      INICIAL: 'bg-blue-100 text-blue-800',
      REAVALIACAO: 'bg-purple-100 text-purple-800',
      CONTROLE: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[tipo as keyof typeof colors]}`}>
        {tipo}
      </span>
    );
  };

  const statsCards = [
    {
      title: 'Total de Avaliações',
      value: stats.total,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Realizadas',
      value: stats.realizadas,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Agendadas',
      value: stats.agendadas,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      change: '+5%'
    },
    {
      title: 'Próximas Reavaliações',
      value: stats.proximasReavaliacoes,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      change: '+3%'
    },
    {
      title: 'IMC Médio',
      value: stats.mediaImc,
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      suffix: 'kg/m²'
    },
    {
      title: '% Gordura Médio',
      value: stats.mediaPercentualGordura,
      icon: TrendingUp,
      color: 'from-pink-500 to-pink-600',
      suffix: '%'
    }
  ];

  return (
    <Layout title="Avaliações Físicas">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Avaliações Físicas
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Acompanhe a evolução física dos seus atletas com avaliações detalhadas
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/avaliacoes/relatorios">
              <Button variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
            </Link>
            <Link to="/avaliacoes/nova">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Nova Avaliação
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                      {stat.suffix && <span className="text-sm text-gray-500 ml-1">{stat.suffix}</span>}
                    </p>
                    {stat.change && (
                      <div className="flex items-center mt-2">
                        <span className="text-sm font-medium text-green-600">
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por cliente, tipo ou observações..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    options={[
                      { value: 'TODOS', label: 'Todos os status' },
                      { value: 'AGENDADA', label: 'Agendadas' },
                      { value: 'REALIZADA', label: 'Realizadas' },
                      { value: 'CANCELADA', label: 'Canceladas' }
                    ]}
                    className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>
                <Select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value as any)}
                  options={[
                    { value: 'TODOS', label: 'Todos os tipos' },
                    { value: 'INICIAL', label: 'Inicial' },
                    { value: 'REAVALIACAO', label: 'Reavaliação' },
                    { value: 'CONTROLE', label: 'Controle' }
                  ]}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Avaliações Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {avaliacoes.map((avaliacao, index) => (
                <motion.div
                  key={avaliacao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full hover:shadow-2xl transition-all duration-300 group">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(avaliacao.status)}
                            {getTipoBadge(avaliacao.tipo)}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {avaliacao.cliente?.nome}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(avaliacao.dataAvaliacao), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{avaliacao.cliente?.genero}</span>
                        </div>
                      </div>

                      {/* Métricas Principais */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.peso}</p>
                          <p className="text-xs text-gray-500">kg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.imc}</p>
                          <p className="text-xs text-gray-500">IMC</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.composicaoCorporal.percentualGordura}%</p>
                          <p className="text-xs text-gray-500">Gordura</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.composicaoCorporal.massaMagra}</p>
                          <p className="text-xs text-gray-500">Massa Magra</p>
                        </div>
                      </div>

                      {/* Objetivo */}
                      <div className="mb-4 flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objetivo:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {avaliacao.anamnese.objetivo_principal}
                        </p>
                      </div>

                      {/* Próxima Avaliação */}
                      {avaliacao.proximaAvaliacao && (
                        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                              Próxima: {format(new Date(avaliacao.proximaAvaliacao), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2 mt-auto">
                        <Link to={`/avaliacoes/${avaliacao.id}`} className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full hover:bg-blue-100 hover:text-blue-600">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                        <Link to={`/avaliacoes/${avaliacao.id}/editar`} className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full hover:bg-green-100 hover:text-green-600">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportPdf(avaliacao.id)}
                          className="hover:bg-purple-100 hover:text-purple-600"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(avaliacao.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 px-6 py-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Página {currentPage + 1} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}