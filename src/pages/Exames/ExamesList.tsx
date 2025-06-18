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
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Bell,
  TrendingUp,
  Activity,
  Users,
  AlertCircle,
  Microscope,
  TestTube,
  Heart,
  Brain
} from 'lucide-react';
import { Exame } from '../../types/exame';
import { exameService } from '../../services/exame';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export function ExamesList() {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterCategoria, setFilterCategoria] = useState<string>('TODAS');
  const [filterPrioridade, setFilterPrioridade] = useState<string>('TODAS');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    concluidos: 0,
    alterados: 0,
    criticos: 0,
    proximosVencimentos: 0
  });

  useEffect(() => {
    loadExames();
    loadStats();
  }, [currentPage, search, filterStatus, filterCategoria, filterPrioridade]);

  const loadExames = async () => {
    try {
      setLoading(true);
      const response = await exameService.getAll(
        currentPage, 
        10, 
        undefined, 
        search, 
        filterStatus === 'TODOS' ? undefined : filterStatus,
        filterCategoria === 'TODAS' ? undefined : filterCategoria
      );
      
      let filteredContent = response.content;
      
      if (filterPrioridade !== 'TODAS') {
        filteredContent = filteredContent.filter(e => e.prioridade === filterPrioridade);
      }
      
      setExames(filteredContent);
      setTotalPages(Math.ceil(filteredContent.length / 10));
    } catch (error) {
      toast.error('Erro ao carregar exames');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await exameService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      try {
        await exameService.delete(id);
        toast.success('Exame excluído com sucesso');
        loadExames();
        loadStats();
      } catch (error) {
        toast.error('Erro ao excluir exame');
      }
    }
  };

  const handleExportPdf = async (id: string) => {
    try {
      const blob = await exameService.exportToPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exame-${id}.pdf`;
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
      SOLICITADO: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FileText },
      AGENDADO: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Calendar },
      COLETADO: { bg: 'bg-purple-100', text: 'text-purple-800', icon: TestTube },
      PROCESSANDO: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock },
      CONCLUIDO: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      CANCELADO: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
      REAGENDADO: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Calendar }
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

  const getPrioridadeBadge = (prioridade: string) => {
    const colors = {
      BAIXA: 'bg-gray-100 text-gray-800',
      NORMAL: 'bg-blue-100 text-blue-800',
      ALTA: 'bg-orange-100 text-orange-800',
      URGENTE: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[prioridade as keyof typeof colors]}`}>
        {prioridade}
      </span>
    );
  };

  const getCategoriaIcon = (categoria: string) => {
    const icons = {
      'Hematologia': Heart,
      'Bioquímica': TestTube,
      'Microbiologia': Microscope,
      'Imunologia': Activity,
      'Endocrinologia': Brain,
      'Cardiologia': Heart
    };
    
    return icons[categoria as keyof typeof icons] || TestTube;
  };

  const hasResultadosAlterados = (exame: Exame) => {
    return exame.resultados.some(r => r.status === 'ALTERADO' || r.status === 'CRITICO');
  };

  const statsCards = [
    {
      title: 'Total de Exames',
      value: stats.total,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Pendentes',
      value: stats.pendentes,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      change: '+5%'
    },
    {
      title: 'Concluídos',
      value: stats.concluidos,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Resultados Alterados',
      value: stats.alterados,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      change: '-3%'
    },
    {
      title: 'Críticos',
      value: stats.criticos,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      change: '-1%'
    },
    {
      title: 'Próximos Vencimentos',
      value: stats.proximosVencimentos,
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      change: '+2%'
    }
  ];

  return (
    <Layout title="Exames Médicos">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exames Médicos
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Gerencie exames laboratoriais e acompanhe resultados em tempo real
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/exames/laboratorios">
              <Button variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600">
                <Microscope className="w-4 h-4 mr-2" />
                Laboratórios
              </Button>
            </Link>
            <Link to="/exames/relatorios">
              <Button variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
            </Link>
            <Link to="/exames/novo">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Exame
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
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
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
                  placeholder="Buscar por paciente, tipo de exame, laboratório..."
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
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'TODOS', label: 'Todos os status' },
                      { value: 'SOLICITADO', label: 'Solicitados' },
                      { value: 'AGENDADO', label: 'Agendados' },
                      { value: 'COLETADO', label: 'Coletados' },
                      { value: 'PROCESSANDO', label: 'Processando' },
                      { value: 'CONCLUIDO', label: 'Concluídos' },
                      { value: 'CANCELADO', label: 'Cancelados' }
                    ]}
                    className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>
                <Select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  options={[
                    { value: 'TODAS', label: 'Todas as categorias' },
                    { value: 'Hematologia', label: 'Hematologia' },
                    { value: 'Bioquímica', label: 'Bioquímica' },
                    { value: 'Microbiologia', label: 'Microbiologia' },
                    { value: 'Imunologia', label: 'Imunologia' },
                    { value: 'Endocrinologia', label: 'Endocrinologia' }
                  ]}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
                <Select
                  value={filterPrioridade}
                  onChange={(e) => setFilterPrioridade(e.target.value)}
                  options={[
                    { value: 'TODAS', label: 'Todas as prioridades' },
                    { value: 'BAIXA', label: 'Baixa' },
                    { value: 'NORMAL', label: 'Normal' },
                    { value: 'ALTA', label: 'Alta' },
                    { value: 'URGENTE', label: 'Urgente' }
                  ]}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Exames Grid */}
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
              {exames.map((exame, index) => {
                const CategoriaIcon = getCategoriaIcon(exame.categoria.nome);
                
                return (
                  <motion.div
                    key={exame.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full hover:shadow-2xl transition-all duration-300 group">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`} 
                                 style={{ backgroundColor: exame.categoria.cor + '20' }}>
                              <CategoriaIcon className="w-6 h-6" style={{ color: exame.categoria.cor }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                {exame.tipoExame.nome}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {exame.categoria.nome}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(exame.status)}
                            {getPrioridadeBadge(exame.prioridade)}
                          </div>
                        </div>

                        {/* Patient Info */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {exame.cliente?.nome}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>Coleta: {format(new Date(exame.dataColeta), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                            {exame.dataResultado && (
                              <p>Resultado: {format(new Date(exame.dataResultado), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                            )}
                          </div>
                        </div>

                        {/* Laboratory */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Microscope className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {exame.laboratorio.nome}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Tempo médio: {exame.laboratorio.tempoMedioResultado}h
                          </p>
                        </div>

                        {/* Results Summary */}
                        {exame.status === 'CONCLUIDO' && exame.resultados.length > 0 && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                              Resumo dos Resultados
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-bold text-green-600">
                                  {exame.resultados.filter(r => r.status === 'NORMAL').length}
                                </div>
                                <div className="text-gray-500">Normais</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-orange-600">
                                  {exame.resultados.filter(r => r.status === 'ALTERADO').length}
                                </div>
                                <div className="text-gray-500">Alterados</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-red-600">
                                  {exame.resultados.filter(r => r.status === 'CRITICO').length}
                                </div>
                                <div className="text-gray-500">Críticos</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Alerts */}
                        {hasResultadosAlterados(exame) && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                Resultados alterados detectados
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Doctor */}
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Solicitante:</span> {exame.medicoSolicitante}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 mt-auto">
                          <Link to={`/exames/${exame.id}`} className="flex-1">
                            <Button variant="ghost" size="sm" className="w-full hover:bg-blue-100 hover:text-blue-600">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                          </Link>
                          <Link to={`/exames/${exame.id}/editar`} className="flex-1">
                            <Button variant="ghost" size="sm" className="w-full hover:bg-green-100 hover:text-green-600">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExportPdf(exame.id)}
                            className="hover:bg-purple-100 hover:text-purple-600"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(exame.id)}
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
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