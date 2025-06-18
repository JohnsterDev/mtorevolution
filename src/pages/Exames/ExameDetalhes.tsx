import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Share2, 
  Calendar,
  User,
  TestTube,
  Microscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Heart,
  Activity,
  Stethoscope,
  AlertCircle,
  Bell,
  Shield
} from 'lucide-react';
import { Exame, ComparativoExames } from '../../types/exame';
import { exameService } from '../../services/exame';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

export function ExameDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exame, setExame] = useState<Exame | null>(null);
  const [comparativo, setComparativo] = useState<ComparativoExames | null>(null);
  const [historico, setHistorico] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'comparativo' | 'historico'>('detalhes');

  useEffect(() => {
    if (id) {
      loadExame();
    }
  }, [id]);

  const loadExame = async () => {
    try {
      setLoading(true);
      const exameData = await exameService.getById(id!);
      setExame(exameData);

      // Carregar histórico
      const historicoData = await exameService.getHistorico(exameData.clienteId, exameData.tipoExame.nome);
      setHistorico(historicoData);

      // Buscar exame anterior para comparativo
      const exameAnterior = historicoData
        .filter(e => e.id !== id && new Date(e.dataColeta) < new Date(exameData.dataColeta))
        .sort((a, b) => new Date(b.dataColeta).getTime() - new Date(a.dataColeta).getTime())[0];

      if (exameAnterior) {
        const comparativoData = await exameService.getComparativo(id!, exameAnterior.id);
        setComparativo(comparativoData);
      }
    } catch (error) {
      toast.error('Erro ao carregar exame');
      navigate('/exames');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await exameService.exportToPdf(id!);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exame-${exame?.cliente?.nome}-${format(new Date(exame?.dataColeta || ''), 'dd-MM-yyyy')}.pdf`;
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
      CANCELADO: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle }
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4 mr-2" />
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[prioridade as keyof typeof colors]}`}>
        {prioridade}
      </span>
    );
  };

  const getResultadoBadge = (status: string) => {
    const configs = {
      NORMAL: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      ALTERADO: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertTriangle },
      CRITICO: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle }
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getDiferencaIcon = (valor: number) => {
    if (valor > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (valor < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getDiferencaColor = (valor: number) => {
    if (valor === 0) return 'text-gray-500';
    return valor > 0 ? 'text-red-600' : 'text-green-600';
  };

  // Dados para gráfico de evolução
  const evolucaoData = historico.map(h => ({
    data: format(new Date(h.dataColeta), 'dd/MM'),
    ...h.resultados.reduce((acc, r) => {
      acc[r.parametro] = Number(r.valor);
      return acc;
    }, {} as Record<string, number>)
  }));

  if (loading) {
    return (
      <Layout title="Detalhes do Exame">
        <div className="flex items-center justify-center p-12">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!exame) {
    return (
      <Layout title="Exame não encontrado">
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Exame não encontrado
          </h2>
          <Button onClick={() => navigate('/exames')}>
            Voltar para Exames
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes do Exame">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/exames')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {exame.tipoExame.nome}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {exame.cliente?.nome} - {format(new Date(exame.dataColeta), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleExportPdf}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button
              variant="secondary"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Link to={`/exames/${id}/editar`}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'detalhes', label: 'Detalhes', icon: FileText },
                { key: 'comparativo', label: 'Comparativo', icon: TrendingUp, disabled: !comparativo },
                { key: 'historico', label: 'Histórico', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  disabled={tab.disabled}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'detalhes' && (
          <div className="space-y-8">
            {/* Informações Básicas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Informações do Exame
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {getStatusBadge(exame.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {getPrioridadeBadge(exame.prioridade)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prioridade</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{exame.categoria.nome}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categoria</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{exame.tipoExame.codigo}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Código</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Paciente</h4>
                    <p className="text-gray-700 dark:text-gray-300">{exame.cliente?.nome}</p>
                    <p className="text-sm text-gray-500">{exame.cliente?.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Médico Solicitante</h4>
                    <p className="text-gray-700 dark:text-gray-300">{exame.medicoSolicitante}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Laboratório */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Microscope className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Laboratório
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{exame.laboratorio.nome}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{exame.laboratorio.endereco}</p>
                    <p className="text-sm text-gray-500">{exame.laboratorio.telefone}</p>
                    <p className="text-sm text-gray-500">{exame.laboratorio.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Credenciamentos</h4>
                    <div className="flex flex-wrap gap-2">
                      {exame.laboratorio.credenciamento.map((cred, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tempo Médio</h4>
                    <p className="text-2xl font-bold text-indigo-600">{exame.laboratorio.tempoMedioResultado}h</p>
                    <p className="text-sm text-gray-500">Para resultados</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Resultados */}
            {exame.status === 'CONCLUIDO' && exame.resultados.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <TestTube className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Resultados do Exame
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Parâmetro
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Referência
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Observação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {exame.resultados.map((resultado, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {resultado.parametro}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <span className="font-semibold">{resultado.valor}</span> {resultado.unidade}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {resultado.valorReferencia}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getResultadoBadge(resultado.status)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {resultado.observacao || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Alertas */}
            {exame.alertas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Alertas e Observações
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {exame.alertas.map((alerta, index) => (
                      <div key={index} className={`p-4 rounded-xl border ${
                        alerta.tipo === 'CRITICO' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700' :
                        alerta.tipo === 'ALTERADO' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700' :
                        'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            alerta.tipo === 'CRITICO' ? 'bg-red-500' :
                            alerta.tipo === 'ALTERADO' ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}>
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              alerta.tipo === 'CRITICO' ? 'text-red-800 dark:text-red-300' :
                              alerta.tipo === 'ALTERADO' ? 'text-orange-800 dark:text-orange-300' :
                              'text-yellow-800 dark:text-yellow-300'
                            }`}>
                              {alerta.parametro} - {alerta.tipo}
                            </h4>
                            <p className={`text-sm ${
                              alerta.tipo === 'CRITICO' ? 'text-red-700 dark:text-red-400' :
                              alerta.tipo === 'ALTERADO' ? 'text-orange-700 dark:text-orange-400' :
                              'text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {alerta.mensagem}
                            </p>
                            {alerta.acao && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Ação recomendada: {alerta.acao}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Arquivos */}
            {exame.arquivos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Arquivos do Exame
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exame.arquivos.map((arquivo, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {arquivo.nome}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {arquivo.tipo} • {(arquivo.tamanho / 1024).toFixed(1)} KB
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {arquivo.criptografado && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Criptografado
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(arquivo.url, '_blank')}
                            className="hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Observações */}
            {(exame.observacoes || exame.observacoesMedicas) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Observações
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exame.observacoes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Observações Gerais</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {exame.observacoes}
                        </p>
                      </div>
                    )}
                    {exame.observacoesMedicas && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Observações Médicas</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {exame.observacoesMedicas}
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        )}

        {/* Comparativo Tab */}
        {activeTab === 'comparativo' && comparativo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Comparativo com Exame Anterior
                </h3>
                <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  comparativo.tendencia === 'MELHORA' ? 'bg-green-100 text-green-800' :
                  comparativo.tendencia === 'PIORA' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Tendência: {comparativo.tendencia}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Parâmetro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Valor Anterior
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Valor Atual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Diferença
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tendência
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {comparativo.diferencas.map((diferenca, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {diferenca.parametro}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {diferenca.valorAnterior}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {diferenca.valorAtual}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className={`flex items-center gap-1 ${getDiferencaColor(diferenca.diferenca)}`}>
                            {getDiferencaIcon(diferenca.diferenca)}
                            <span className="font-medium">
                              {diferenca.diferenca > 0 ? '+' : ''}{diferenca.diferenca.toFixed(2)}
                            </span>
                            <span className="text-xs">
                              ({diferenca.percentual > 0 ? '+' : ''}{diferenca.percentual.toFixed(1)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            diferenca.tendencia === 'SUBIU' ? 'bg-red-100 text-red-800' :
                            diferenca.tendencia === 'DESCEU' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {diferenca.tendencia}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Histórico Tab */}
        {activeTab === 'historico' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Gráfico de Evolução */}
            {evolucaoData.length > 1 && (
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Evolução dos Parâmetros
                  </h3>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolucaoData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="data" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      {exame.resultados.map((resultado, index) => (
                        <Line
                          key={resultado.parametro}
                          type="monotone"
                          dataKey={resultado.parametro}
                          stroke={`hsl(${index * 60}, 70%, 50%)`}
                          strokeWidth={3}
                          dot={{ fill: `hsl(${index * 60}, 70%, 50%)`, strokeWidth: 2, r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}

            {/* Lista de Histórico */}
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Histórico de Exames
                </h3>
              </div>

              <div className="space-y-4">
                {historico.map((exameHistorico, index) => (
                  <div key={exameHistorico.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {format(new Date(exameHistorico.dataColeta), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {exameHistorico.laboratorio.nome} • {getStatusBadge(exameHistorico.status)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {exameHistorico.resultados.length} parâmetros
                        </span>
                        <Link to={`/exames/${exameHistorico.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}