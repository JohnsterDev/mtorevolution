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
  Activity,
  Heart,
  Ruler,
  Target,
  Camera,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  BarChart3
} from 'lucide-react';
import { AvaliacaoFisica, ComparativoAvaliacoes } from '../../types/avaliacao';
import { avaliacaoFisicaService } from '../../services/avaliacaoFisica';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import toast from 'react-hot-toast';

export function AvaliacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState<AvaliacaoFisica | null>(null);
  const [comparativo, setComparativo] = useState<ComparativoAvaliacoes | null>(null);
  const [evolucao, setEvolucao] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'comparativo' | 'evolucao'>('detalhes');

  useEffect(() => {
    if (id) {
      loadAvaliacao();
    }
  }, [id]);

  const loadAvaliacao = async () => {
    try {
      setLoading(true);
      const avaliacaoData = await avaliacaoFisicaService.getById(id!);
      setAvaliacao(avaliacaoData);

      // Carregar evolução
      const evolucaoData = await avaliacaoFisicaService.getEvolucao(avaliacaoData.clienteId);
      setEvolucao(evolucaoData);

      // Buscar avaliação anterior para comparativo
      const avaliacoesCliente = await avaliacaoFisicaService.getByClienteId(avaliacaoData.clienteId);
      const avaliacaoAnterior = avaliacoesCliente
        .filter(a => a.id !== id && new Date(a.dataAvaliacao) < new Date(avaliacaoData.dataAvaliacao))
        .sort((a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime())[0];

      if (avaliacaoAnterior) {
        const comparativoData = await avaliacaoFisicaService.getComparativo(id!, avaliacaoAnterior.id);
        setComparativo(comparativoData);
      }
    } catch (error) {
      toast.error('Erro ao carregar avaliação');
      navigate('/avaliacoes');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await avaliacaoFisicaService.exportToPdf(id!);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avaliacao-${avaliacao?.cliente?.nome}-${format(new Date(avaliacao?.dataAvaliacao || ''), 'dd-MM-yyyy')}.pdf`;
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
      AGENDADA: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      REALIZADA: { bg: 'bg-green-100', text: 'text-green-800' },
      CANCELADA: { bg: 'bg-red-100', text: 'text-red-800' }
    };
    
    const config = configs[status as keyof typeof configs];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
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

  const getDiferencaIcon = (valor: number) => {
    if (valor > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (valor < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getDiferencaColor = (valor: number, isGoodWhenNegative = false) => {
    if (valor === 0) return 'text-gray-500';
    if (isGoodWhenNegative) {
      return valor < 0 ? 'text-green-600' : 'text-red-600';
    }
    return valor > 0 ? 'text-green-600' : 'text-red-600';
  };

  // Dados para o gráfico radar
  const radarData = avaliacao ? [
    {
      subject: 'Flexibilidade',
      A: (avaliacao.testesFisicos.flexibilidade.sentar_alcancar / 50) * 100,
      fullMark: 100,
    },
    {
      subject: 'Força',
      A: (avaliacao.testesFisicos.forca.preensao_manual_direita / 80) * 100,
      fullMark: 100,
    },
    {
      subject: 'Resistência',
      A: avaliacao.testesFisicos.resistencia.vo2_max ? (avaliacao.testesFisicos.resistencia.vo2_max / 60) * 100 : 50,
      fullMark: 100,
    },
    {
      subject: 'Composição',
      A: 100 - avaliacao.composicaoCorporal.percentualGordura * 2,
      fullMark: 100,
    },
  ] : [];

  if (loading) {
    return (
      <Layout title="Detalhes da Avaliação">
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

  if (!avaliacao) {
    return (
      <Layout title="Avaliação não encontrada">
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Avaliação não encontrada
          </h2>
          <Button onClick={() => navigate('/avaliacoes')}>
            Voltar para Avaliações
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes da Avaliação">
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
              onClick={() => navigate('/avaliacoes')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Avaliação Física
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {avaliacao.cliente?.nome} - {format(new Date(avaliacao.dataAvaliacao), 'dd/MM/yyyy', { locale: ptBR })}
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
            <Link to={`/avaliacoes/${id}/editar`}>
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
                { key: 'comparativo', label: 'Comparativo', icon: BarChart3, disabled: !comparativo },
                { key: 'evolucao', label: 'Evolução', icon: TrendingUp }
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
                    Informações Básicas
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {getStatusBadge(avaliacao.status)}
                      {getTipoBadge(avaliacao.tipo)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status e Tipo</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.peso} kg</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Peso</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.altura} m</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Altura</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacao.imc}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">IMC</p>
                  </div>
                </div>

                {avaliacao.proximaAvaliacao && (
                  <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium text-indigo-800 dark:text-indigo-300">
                        Próxima Avaliação: {format(new Date(avaliacao.proximaAvaliacao), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Composição Corporal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Composição Corporal
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { label: '% Gordura', value: `${avaliacao.composicaoCorporal.percentualGordura}%`, color: 'from-red-500 to-pink-500' },
                    { label: 'Massa Gorda', value: `${avaliacao.composicaoCorporal.massaGorda} kg`, color: 'from-orange-500 to-red-500' },
                    { label: 'Massa Magra', value: `${avaliacao.composicaoCorporal.massaMagra} kg`, color: 'from-green-500 to-emerald-500' },
                    { label: 'Massa Muscular', value: `${avaliacao.composicaoCorporal.massaMuscular} kg`, color: 'from-blue-500 to-indigo-500' },
                    { label: 'Água Corporal', value: `${avaliacao.composicaoCorporal.aguaCorporal}%`, color: 'from-cyan-500 to-blue-500' },
                    { label: 'Massa Óssea', value: `${avaliacao.composicaoCorporal.massaOssea} kg`, color: 'from-gray-500 to-gray-600' },
                    { label: 'Taxa Metabólica', value: `${avaliacao.composicaoCorporal.taxaMetabolica} kcal`, color: 'from-purple-500 to-indigo-500' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                      <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg mx-auto mb-2`}></div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Gráfico Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Perfil Físico Geral
                  </h3>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>

            {/* Circunferências */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                    <Ruler className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Circunferências (cm)
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(avaliacao.circunferencias).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Testes Físicos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Testes Físicos
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Flexibilidade */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Flexibilidade</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sentar e Alcançar:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.flexibilidade.sentar_alcancar} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Flexão Ombro:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.flexibilidade.flexao_ombro}°</span>
                      </div>
                      {avaliacao.testesFisicos.flexibilidade.observacoes && (
                        <p className="text-xs text-gray-500 mt-2">{avaliacao.testesFisicos.flexibilidade.observacoes}</p>
                      )}
                    </div>
                  </div>

                  {/* Força */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">Força</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Preensão D:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.forca.preensao_manual_direita} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Preensão E:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.forca.preensao_manual_esquerda} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Flexão:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.forca.flexao_braco} rep</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Abdominal:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.forca.abdominal} rep</span>
                      </div>
                    </div>
                  </div>

                  {/* Resistência */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Resistência</h4>
                    <div className="space-y-2">
                      {avaliacao.testesFisicos.resistencia.vo2_max && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">VO2 Máx:</span>
                          <span className="font-medium">{avaliacao.testesFisicos.resistencia.vo2_max} ml/kg/min</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">FC Repouso:</span>
                        <span className="font-medium">{avaliacao.testesFisicos.resistencia.frequencia_cardiaca_repouso} bpm</span>
                      </div>
                      {avaliacao.testesFisicos.resistencia.teste_cooper && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Cooper:</span>
                          <span className="font-medium">{avaliacao.testesFisicos.resistencia.teste_cooper} m</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Pressão Arterial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pressão Arterial e Frequência Cardíaca
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">{avaliacao.pressaoArterial.sistolica}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sistólica (mmHg)</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">{avaliacao.pressaoArterial.diastolica}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Diastólica (mmHg)</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">{avaliacao.pressaoArterial.frequencia_cardiaca}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">FC (bpm)</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Fotos */}
            {(avaliacao.fotos.frente || avaliacao.fotos.perfil_direito || avaliacao.fotos.perfil_esquerdo || avaliacao.fotos.costas) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassCard>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mr-4">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Registro Fotográfico
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { key: 'frente', label: 'Frente' },
                      { key: 'perfil_direito', label: 'Perfil Direito' },
                      { key: 'perfil_esquerdo', label: 'Perfil Esquerdo' },
                      { key: 'costas', label: 'Costas' }
                    ].map((item) => (
                      avaliacao.fotos[item.key as keyof typeof avaliacao.fotos] && (
                        <div key={item.key} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</h4>
                          <img
                            src={avaliacao.fotos[item.key as keyof typeof avaliacao.fotos]}
                            alt={item.label}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      )
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Resultados e Recomendações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <GlassCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Resultados e Recomendações
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pontos Fortes */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">Pontos Fortes</h4>
                    <ul className="space-y-2">
                      {avaliacao.resultados.pontos_fortes.map((ponto, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pontos de Melhoria */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3">Pontos de Melhoria</h4>
                    <ul className="space-y-2">
                      {avaliacao.resultados.pontos_melhoria.map((ponto, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recomendações */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Recomendações</h4>
                    <ul className="space-y-2">
                      {avaliacao.resultados.recomendacoes.map((recomendacao, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {recomendacao}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Observações */}
            {avaliacao.observacoes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <GlassCard>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Observações
                    </h3>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {avaliacao.observacoes}
                  </p>
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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Comparativo com Avaliação Anterior
                </h3>
                <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  comparativo.evolucao === 'POSITIVA' ? 'bg-green-100 text-green-800' :
                  comparativo.evolucao === 'NEGATIVA' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Evolução {comparativo.evolucao}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Peso', atual: comparativo.avaliacaoAtual.peso, anterior: comparativo.avaliacaoAnterior.peso, diferenca: comparativo.diferencas.peso, unit: 'kg', goodWhenNegative: false },
                  { label: '% Gordura', atual: comparativo.avaliacaoAtual.composicaoCorporal.percentualGordura, anterior: comparativo.avaliacaoAnterior.composicaoCorporal.percentualGordura, diferenca: comparativo.diferencas.percentualGordura, unit: '%', goodWhenNegative: true },
                  { label: 'Massa Magra', atual: comparativo.avaliacaoAtual.composicaoCorporal.massaMagra, anterior: comparativo.avaliacaoAnterior.composicaoCorporal.massaMagra, diferenca: comparativo.diferencas.massaMagra, unit: 'kg', goodWhenNegative: false },
                  { label: 'IMC', atual: comparativo.avaliacaoAtual.imc, anterior: comparativo.avaliacaoAnterior.imc, diferenca: comparativo.diferencas.imc, unit: '', goodWhenNegative: false }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{item.label}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Atual:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{item.atual}{item.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Anterior:</span>
                        <span className="text-gray-700 dark:text-gray-300">{item.anterior}{item.unit}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Diferença:</span>
                        <div className="flex items-center gap-1">
                          {getDiferencaIcon(item.diferenca)}
                          <span className={`font-medium ${getDiferencaColor(item.diferenca, item.goodWhenNegative)}`}>
                            {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(1)}{item.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Circunferências Comparativo */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Diferenças nas Circunferências</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(comparativo.diferencas.circunferencias).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getDiferencaIcon(value)}
                        <span className={`font-bold ${getDiferencaColor(value, true)}`}>
                          {value > 0 ? '+' : ''}{value.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Evolução Tab */}
        {activeTab === 'evolucao' && evolucao && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Gráfico de Peso */}
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evolução do Peso
                </h3>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolucao.peso}>
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
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Gráfico de % Gordura */}
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evolução do % de Gordura
                </h3>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolucao.percentualGordura}>
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
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Gráfico de Massa Magra */}
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evolução da Massa Magra
                </h3>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolucao.massaMagra}>
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
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}