import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { Input, Select, Textarea } from '../../components/UI/Input';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Activity, 
  Camera, 
  Calculator,
  Heart,
  Ruler,
  Target,
  FileText,
  Upload,
  X
} from 'lucide-react';
import { AvaliacaoFisica } from '../../types/avaliacao';
import { Cliente } from '../../types';
import { avaliacaoFisicaService } from '../../services/avaliacaoFisica';
import { clienteService } from '../../services/cliente';
import toast from 'react-hot-toast';

interface AvaliacaoFormData {
  clienteId: string;
  dataAvaliacao: string;
  tipo: 'INICIAL' | 'REAVALIACAO' | 'CONTROLE';
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
  peso: number;
  altura: number;
  
  // Circunferências
  circunferencias: {
    pescoco: number;
    ombro: number;
    braco_relaxado: number;
    braco_contraido: number;
    antebraco: number;
    punho: number;
    peitoral: number;
    cintura: number;
    abdomen: number;
    quadril: number;
    coxa_proximal: number;
    coxa_medial: number;
    coxa_distal: number;
    panturrilha: number;
    tornozelo: number;
  };
  
  // Composição Corporal
  composicaoCorporal: {
    percentualGordura: number;
    massaGorda: number;
    massaMagra: number;
    massaMuscular: number;
    aguaCorporal: number;
    massaOssea: number;
    taxaMetabolica: number;
  };
  
  // Dobras Cutâneas
  dobrasCutaneas: {
    triceps: number;
    biceps: number;
    subescapular: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
    panturrilha: number;
  };
  
  // Testes Físicos
  testesFisicos: {
    flexibilidade: {
      sentar_alcancar: number;
      flexao_ombro: number;
      observacoes: string;
    };
    forca: {
      preensao_manual_direita: number;
      preensao_manual_esquerda: number;
      flexao_braco: number;
      abdominal: number;
      observacoes: string;
    };
    resistencia: {
      vo2_max: number;
      frequencia_cardiaca_repouso: number;
      frequencia_cardiaca_maxima: number;
      teste_cooper: number;
      observacoes: string;
    };
  };
  
  // Pressão Arterial
  pressaoArterial: {
    sistolica: number;
    diastolica: number;
    frequencia_cardiaca: number;
  };
  
  // Anamnese
  anamnese: {
    objetivo_principal: string;
    historico_lesoes: string;
    medicamentos: string;
    restricoes_medicas: string;
    nivel_atividade: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | 'MUITO_INTENSO';
    frequencia_exercicio: number;
    tempo_exercicio: number;
    modalidades_preferidas: string[];
    observacoes_gerais: string;
  };
  
  // Resultados
  resultados: {
    pontos_fortes: string[];
    pontos_melhoria: string[];
    recomendacoes: string[];
  };
  
  observacoes: string;
  proximaAvaliacao: string;
}

export function AvaliacaoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photos, setPhotos] = useState<{
    frente?: string;
    perfil_direito?: string;
    perfil_esquerdo?: string;
    costas?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control
  } = useForm<AvaliacaoFormData>();

  const { fields: pontosFortes, append: appendPontoForte, remove: removePontoForte } = useFieldArray({
    control,
    name: 'resultados.pontos_fortes'
  });

  const { fields: pontosMelhoria, append: appendPontoMelhoria, remove: removePontoMelhoria } = useFieldArray({
    control,
    name: 'resultados.pontos_melhoria'
  });

  const { fields: recomendacoes, append: appendRecomendacao, remove: removeRecomendacao } = useFieldArray({
    control,
    name: 'resultados.recomendacoes'
  });

  const { fields: modalidades, append: appendModalidade, remove: removeModalidade } = useFieldArray({
    control,
    name: 'anamnese.modalidades_preferidas'
  });

  const watchedPeso = watch('peso');
  const watchedAltura = watch('altura');

  useEffect(() => {
    loadClientes();
    if (isEditing) {
      loadAvaliacao();
    }
  }, [id]);

  // Calcular IMC automaticamente
  useEffect(() => {
    if (watchedPeso && watchedAltura) {
      const imc = avaliacaoFisicaService.calcularIMC(watchedPeso, watchedAltura);
      // Note: IMC não está no formulário, seria calculado no backend
    }
  }, [watchedPeso, watchedAltura]);

  const loadClientes = async () => {
    try {
      const response = await clienteService.getAll(0, 1000);
      setClientes(response.content.filter(c => c.status === 'ATIVO'));
    } catch (error) {
      toast.error('Erro ao carregar clientes');
    }
  };

  const loadAvaliacao = async () => {
    try {
      const avaliacao = await avaliacaoFisicaService.getById(id!);
      
      // Transformar dados para o formato do formulário
      reset({
        clienteId: avaliacao.clienteId,
        dataAvaliacao: avaliacao.dataAvaliacao.split('T')[0],
        tipo: avaliacao.tipo,
        status: avaliacao.status,
        peso: avaliacao.peso,
        altura: avaliacao.altura,
        circunferencias: avaliacao.circunferencias,
        composicaoCorporal: avaliacao.composicaoCorporal,
        dobrasCutaneas: avaliacao.dobrasCutaneas || {
          triceps: 0, biceps: 0, subescapular: 0, suprailiaca: 0,
          abdominal: 0, coxa: 0, panturrilha: 0
        },
        testesFisicos: avaliacao.testesFisicos,
        pressaoArterial: avaliacao.pressaoArterial,
        anamnese: avaliacao.anamnese,
        resultados: avaliacao.resultados,
        observacoes: avaliacao.observacoes || '',
        proximaAvaliacao: avaliacao.proximaAvaliacao?.split('T')[0] || ''
      });
      
      setPhotos(avaliacao.fotos);
    } catch (error) {
      toast.error('Erro ao carregar avaliação');
      navigate('/avaliacoes');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: AvaliacaoFormData) => {
    setLoading(true);
    try {
      // Calcular IMC
      const imc = avaliacaoFisicaService.calcularIMC(data.peso, data.altura);
      
      const avaliacaoData = {
        ...data,
        imc,
        fotos: photos
      };

      if (isEditing) {
        await avaliacaoFisicaService.update(id!, avaliacaoData);
        toast.success('Avaliação atualizada com sucesso');
      } else {
        await avaliacaoFisicaService.create(avaliacaoData);
        toast.success('Avaliação criada com sucesso');
      }
      navigate('/avaliacoes');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          (isEditing ? 'Erro ao atualizar avaliação' : 'Erro ao criar avaliação');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (tipo: 'frente' | 'perfil_direito' | 'perfil_esquerdo' | 'costas', file: File) => {
    if (!id && !isEditing) {
      toast.error('Salve a avaliação primeiro para adicionar fotos');
      return;
    }

    setUploadingPhoto(true);
    try {
      const url = await avaliacaoFisicaService.uploadFoto(id!, tipo, file);
      setPhotos(prev => ({ ...prev, [tipo]: url }));
      toast.success('Foto enviada com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const clienteOptions = [
    { value: '', label: 'Selecione um cliente' },
    ...clientes.map(c => ({ value: c.id, label: c.nome }))
  ];

  const tipoOptions = [
    { value: 'INICIAL', label: 'Avaliação Inicial' },
    { value: 'REAVALIACAO', label: 'Reavaliação' },
    { value: 'CONTROLE', label: 'Controle' }
  ];

  const statusOptions = [
    { value: 'AGENDADA', label: 'Agendada' },
    { value: 'REALIZADA', label: 'Realizada' },
    { value: 'CANCELADA', label: 'Cancelada' }
  ];

  const nivelAtividadeOptions = [
    { value: 'SEDENTARIO', label: 'Sedentário' },
    { value: 'LEVE', label: 'Leve' },
    { value: 'MODERADO', label: 'Moderado' },
    { value: 'INTENSO', label: 'Intenso' },
    { value: 'MUITO_INTENSO', label: 'Muito Intenso' }
  ];

  if (initialLoading) {
    return (
      <Layout title={isEditing ? 'Editar Avaliação' : 'Nova Avaliação'}>
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

  return (
    <Layout title={isEditing ? 'Editar Avaliação' : 'Nova Avaliação'}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
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
              {isEditing ? 'Editar Avaliação' : 'Nova Avaliação Física'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditing ? 'Atualize os dados da avaliação física' : 'Registre uma nova avaliação física completa'}
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                <Select
                  label="Cliente"
                  options={clienteOptions}
                  {...register('clienteId', {
                    required: 'Cliente é obrigatório',
                  })}
                  error={errors.clienteId?.message}
                  className="focus-ring"
                />

                <Input
                  label="Data da Avaliação"
                  type="date"
                  {...register('dataAvaliacao', {
                    required: 'Data é obrigatória',
                  })}
                  error={errors.dataAvaliacao?.message}
                  className="focus-ring"
                />

                <Select
                  label="Tipo de Avaliação"
                  options={tipoOptions}
                  {...register('tipo', {
                    required: 'Tipo é obrigatório',
                  })}
                  error={errors.tipo?.message}
                  className="focus-ring"
                />

                <Select
                  label="Status"
                  options={statusOptions}
                  {...register('status', {
                    required: 'Status é obrigatório',
                  })}
                  error={errors.status?.message}
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Dados Antropométricos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Ruler className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dados Antropométricos
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Peso (kg)"
                  type="number"
                  step="0.1"
                  {...register('peso', {
                    required: 'Peso é obrigatório',
                    min: { value: 30, message: 'Peso mínimo 30kg' },
                    max: { value: 300, message: 'Peso máximo 300kg' }
                  })}
                  error={errors.peso?.message}
                  className="focus-ring"
                />

                <Input
                  label="Altura (m)"
                  type="number"
                  step="0.01"
                  {...register('altura', {
                    required: 'Altura é obrigatória',
                    min: { value: 1.0, message: 'Altura mínima 1.0m' },
                    max: { value: 2.5, message: 'Altura máxima 2.5m' }
                  })}
                  error={errors.altura?.message}
                  className="focus-ring"
                />
              </div>

              {/* IMC Calculator */}
              {watchedPeso && watchedAltura && (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-800 dark:text-indigo-300">
                      IMC Calculado: {avaliacaoFisicaService.calcularIMC(watchedPeso, watchedAltura)} kg/m²
                    </span>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Classificação: {avaliacaoFisicaService.classificarIMC(avaliacaoFisicaService.calcularIMC(watchedPeso, watchedAltura))}
                  </p>
                </div>
              )}

              {/* Circunferências */}
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Circunferências (cm)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { key: 'pescoco', label: 'Pescoço' },
                  { key: 'ombro', label: 'Ombro' },
                  { key: 'braco_relaxado', label: 'Braço Relaxado' },
                  { key: 'braco_contraido', label: 'Braço Contraído' },
                  { key: 'antebraco', label: 'Antebraço' },
                  { key: 'punho', label: 'Punho' },
                  { key: 'peitoral', label: 'Peitoral' },
                  { key: 'cintura', label: 'Cintura' },
                  { key: 'abdomen', label: 'Abdômen' },
                  { key: 'quadril', label: 'Quadril' },
                  { key: 'coxa_proximal', label: 'Coxa Proximal' },
                  { key: 'coxa_medial', label: 'Coxa Medial' },
                  { key: 'coxa_distal', label: 'Coxa Distal' },
                  { key: 'panturrilha', label: 'Panturrilha' },
                  { key: 'tornozelo', label: 'Tornozelo' }
                ].map((item) => (
                  <Input
                    key={item.key}
                    label={item.label}
                    type="number"
                    step="0.1"
                    {...register(`circunferencias.${item.key}` as any, {
                      required: `${item.label} é obrigatório`,
                      min: { value: 10, message: 'Valor mínimo 10cm' }
                    })}
                    error={errors.circunferencias?.[item.key as keyof typeof errors.circunferencias]?.message}
                    className="focus-ring"
                  />
                ))}
              </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  label="% Gordura"
                  type="number"
                  step="0.1"
                  {...register('composicaoCorporal.percentualGordura', {
                    required: '% Gordura é obrigatório',
                    min: { value: 3, message: 'Mínimo 3%' },
                    max: { value: 50, message: 'Máximo 50%' }
                  })}
                  error={errors.composicaoCorporal?.percentualGordura?.message}
                  className="focus-ring"
                />

                <Input
                  label="Massa Gorda (kg)"
                  type="number"
                  step="0.1"
                  {...register('composicaoCorporal.massaGorda', {
                    required: 'Massa gorda é obrigatória'
                  })}
                  error={errors.composicaoCorporal?.massaGorda?.message}
                  className="focus-ring"
                />

                <Input
                  label="Massa Magra (kg)"
                  type="number"
                  step="0.1"
                  {...register('composicaoCorporal.massaMagra', {
                    required: 'Massa magra é obrigatória'
                  })}
                  error={errors.composicaoCorporal?.massaMagra?.message}
                  className="focus-ring"
                />

                <Input
                  label="Massa Muscular (kg)"
                  type="number"
                  step="0.1"
                  {...register('composicaoCorporal.massaMuscular', {
                    required: 'Massa muscular é obrigatória'
                  })}
                  error={errors.composicaoCorporal?.massaMuscular?.message}
                  className="focus-ring"
                />

                <Input
                  label="Água Corporal (%)"
                  type="number"
                  step="0.1"
                  {...register('composicaoCorporal.aguaCorporal', {
                    required: 'Água corporal é obrigatória'
                  })}
                  error={errors.composicaoCorporal?.aguaCorporal?.message}
                  className="focus-ring"
                />

                <Input
                  label="Massa Óssea (kg)"
                  type="number"
                  step="0.1"
                  {...register('composicaoCorporal.massaOssea', {
                    required: 'Massa óssea é obrigatória'
                  })}
                  error={errors.composicaoCorporal?.massaOssea?.message}
                  className="focus-ring"
                />

                <Input
                  label="Taxa Metabólica (kcal)"
                  type="number"
                  {...register('composicaoCorporal.taxaMetabolica', {
                    required: 'Taxa metabólica é obrigatória'
                  })}
                  error={errors.composicaoCorporal?.taxaMetabolica?.message}
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Dobras Cutâneas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <Ruler className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dobras Cutâneas (mm)
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { key: 'triceps', label: 'Tríceps' },
                  { key: 'biceps', label: 'Bíceps' },
                  { key: 'subescapular', label: 'Subescapular' },
                  { key: 'suprailiaca', label: 'Supra-ilíaca' },
                  { key: 'abdominal', label: 'Abdominal' },
                  { key: 'coxa', label: 'Coxa' },
                  { key: 'panturrilha', label: 'Panturrilha' }
                ].map((item) => (
                  <Input
                    key={item.key}
                    label={item.label}
                    type="number"
                    step="0.1"
                    {...register(`dobrasCutaneas.${item.key}` as any, {
                      min: { value: 0, message: 'Valor mínimo 0mm' }
                    })}
                    error={errors.dobrasCutaneas?.[item.key as keyof typeof errors.dobrasCutaneas]?.message}
                    className="focus-ring"
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Testes Físicos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Testes Físicos
                </h3>
              </div>

              {/* Flexibilidade */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flexibilidade</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Input
                    label="Sentar e Alcançar (cm)"
                    type="number"
                    step="0.1"
                    {...register('testesFisicos.flexibilidade.sentar_alcancar', {
                      required: 'Teste sentar e alcançar é obrigatório'
                    })}
                    error={errors.testesFisicos?.flexibilidade?.sentar_alcancar?.message}
                    className="focus-ring"
                  />

                  <Input
                    label="Flexão de Ombro (graus)"
                    type="number"
                    {...register('testesFisicos.flexibilidade.flexao_ombro', {
                      required: 'Flexão de ombro é obrigatória'
                    })}
                    error={errors.testesFisicos?.flexibilidade?.flexao_ombro?.message}
                    className="focus-ring"
                  />

                  <Textarea
                    label="Observações"
                    rows={2}
                    {...register('testesFisicos.flexibilidade.observacoes')}
                    className="focus-ring"
                  />
                </div>
              </div>

              {/* Força */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Força</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Input
                    label="Preensão Manual Direita (kg)"
                    type="number"
                    step="0.1"
                    {...register('testesFisicos.forca.preensao_manual_direita', {
                      required: 'Preensão manual direita é obrigatória'
                    })}
                    error={errors.testesFisicos?.forca?.preensao_manual_direita?.message}
                    className="focus-ring"
                  />

                  <Input
                    label="Preensão Manual Esquerda (kg)"
                    type="number"
                    step="0.1"
                    {...register('testesFisicos.forca.preensao_manual_esquerda', {
                      required: 'Preensão manual esquerda é obrigatória'
                    })}
                    error={errors.testesFisicos?.forca?.preensao_manual_esquerda?.message}
                    className="focus-ring"
                  />

                  <Input
                    label="Flexão de Braço (repetições)"
                    type="number"
                    {...register('testesFisicos.forca.flexao_braco', {
                      required: 'Flexão de braço é obrigatória'
                    })}
                    error={errors.testesFisicos?.forca?.flexao_braco?.message}
                    className="focus-ring"
                  />

                  <Input
                    label="Abdominal (repetições)"
                    type="number"
                    {...register('testesFisicos.forca.abdominal', {
                      required: 'Teste abdominal é obrigatório'
                    })}
                    error={errors.testesFisicos?.forca?.abdominal?.message}
                    className="focus-ring"
                  />

                  <div className="md:col-span-2">
                    <Textarea
                      label="Observações"
                      rows={2}
                      {...register('testesFisicos.forca.observacoes')}
                      className="focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Resistência */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resistência</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Input
                    label="VO2 Máx (ml/kg/min)"
                    type="number"
                    step="0.1"
                    {...register('testesFisicos.resistencia.vo2_max')}
                    className="focus-ring"
                  />

                  <Input
                    label="FC Repouso (bpm)"
                    type="number"
                    {...register('testesFisicos.resistencia.frequencia_cardiaca_repouso', {
                      required: 'FC repouso é obrigatória'
                    })}
                    error={errors.testesFisicos?.resistencia?.frequencia_cardiaca_repouso?.message}
                    className="focus-ring"
                  />

                  <Input
                    label="FC Máxima (bpm)"
                    type="number"
                    {...register('testesFisicos.resistencia.frequencia_cardiaca_maxima')}
                    className="focus-ring"
                  />

                  <Input
                    label="Teste Cooper (metros)"
                    type="number"
                    {...register('testesFisicos.resistencia.teste_cooper')}
                    className="focus-ring"
                  />

                  <div className="md:col-span-2">
                    <Textarea
                      label="Observações"
                      rows={2}
                      {...register('testesFisicos.resistencia.observacoes')}
                      className="focus-ring"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Pressão Arterial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
                <Input
                  label="Pressão Sistólica (mmHg)"
                  type="number"
                  {...register('pressaoArterial.sistolica', {
                    required: 'Pressão sistólica é obrigatória',
                    min: { value: 80, message: 'Valor mínimo 80 mmHg' },
                    max: { value: 250, message: 'Valor máximo 250 mmHg' }
                  })}
                  error={errors.pressaoArterial?.sistolica?.message}
                  className="focus-ring"
                />

                <Input
                  label="Pressão Diastólica (mmHg)"
                  type="number"
                  {...register('pressaoArterial.diastolica', {
                    required: 'Pressão diastólica é obrigatória',
                    min: { value: 40, message: 'Valor mínimo 40 mmHg' },
                    max: { value: 150, message: 'Valor máximo 150 mmHg' }
                  })}
                  error={errors.pressaoArterial?.diastolica?.message}
                  className="focus-ring"
                />

                <Input
                  label="Frequência Cardíaca (bpm)"
                  type="number"
                  {...register('pressaoArterial.frequencia_cardiaca', {
                    required: 'Frequência cardíaca é obrigatória',
                    min: { value: 40, message: 'Valor mínimo 40 bpm' },
                    max: { value: 220, message: 'Valor máximo 220 bpm' }
                  })}
                  error={errors.pressaoArterial?.frequencia_cardiaca?.message}
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Anamnese */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Anamnese
                </h3>
              </div>

              <div className="space-y-6">
                <Textarea
                  label="Objetivo Principal"
                  rows={3}
                  {...register('anamnese.objetivo_principal', {
                    required: 'Objetivo principal é obrigatório'
                  })}
                  error={errors.anamnese?.objetivo_principal?.message}
                  placeholder="Descreva o objetivo principal do cliente..."
                  className="focus-ring"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea
                    label="Histórico de Lesões"
                    rows={3}
                    {...register('anamnese.historico_lesoes')}
                    placeholder="Descreva lesões anteriores, cirurgias, etc."
                    className="focus-ring"
                  />

                  <Textarea
                    label="Medicamentos"
                    rows={3}
                    {...register('anamnese.medicamentos')}
                    placeholder="Liste medicamentos em uso"
                    className="focus-ring"
                  />

                  <Textarea
                    label="Restrições Médicas"
                    rows={3}
                    {...register('anamnese.restricoes_medicas')}
                    placeholder="Descreva restrições ou limitações médicas"
                    className="focus-ring"
                  />

                  <div className="space-y-4">
                    <Select
                      label="Nível de Atividade"
                      options={nivelAtividadeOptions}
                      {...register('anamnese.nivel_atividade', {
                        required: 'Nível de atividade é obrigatório'
                      })}
                      error={errors.anamnese?.nivel_atividade?.message}
                      className="focus-ring"
                    />

                    <Input
                      label="Frequência de Exercício (vezes/semana)"
                      type="number"
                      min="0"
                      max="7"
                      {...register('anamnese.frequencia_exercicio', {
                        required: 'Frequência é obrigatória'
                      })}
                      error={errors.anamnese?.frequencia_exercicio?.message}
                      className="focus-ring"
                    />

                    <Input
                      label="Tempo por Sessão (minutos)"
                      type="number"
                      min="0"
                      {...register('anamnese.tempo_exercicio', {
                        required: 'Tempo por sessão é obrigatório'
                      })}
                      error={errors.anamnese?.tempo_exercicio?.message}
                      className="focus-ring"
                    />
                  </div>
                </div>

                {/* Modalidades Preferidas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Modalidades Preferidas
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendModalidade('')}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {modalidades.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <Input
                          placeholder="Ex: Musculação, Corrida, Natação..."
                          {...register(`anamnese.modalidades_preferidas.${index}` as any)}
                          className="flex-1 focus-ring"
                        />
                        {modalidades.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeModalidade(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Observações Gerais"
                  rows={4}
                  {...register('anamnese.observacoes_gerais')}
                  placeholder="Informações adicionais relevantes..."
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Fotos */}
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
                  <div key={item.key} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </label>
                    
                    {photos[item.key as keyof typeof photos] ? (
                      <div className="relative">
                        <img
                          src={photos[item.key as keyof typeof photos]}
                          alt={item.label}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotos(prev => ({ ...prev, [item.key]: undefined }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Clique para enviar</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePhotoUpload(item.key as any, file);
                              }
                            }}
                            disabled={uploadingPhoto}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

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

              <div className="space-y-6">
                {/* Pontos Fortes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pontos Fortes
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendPontoForte('')}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {pontosFortes.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <Input
                          placeholder="Ex: Boa massa muscular, Excelente motivação..."
                          {...register(`resultados.pontos_fortes.${index}` as any)}
                          className="flex-1 focus-ring"
                        />
                        {pontosFortes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePontoForte(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pontos de Melhoria */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pontos de Melhoria
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendPontoMelhoria('')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {pontosMelhoria.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <Input
                          placeholder="Ex: Reduzir percentual de gordura, Melhorar flexibilidade..."
                          {...register(`resultados.pontos_melhoria.${index}` as any)}
                          className="flex-1 focus-ring"
                        />
                        {pontosMelhoria.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePontoMelhoria(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendações */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recomendações
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendRecomendacao('')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {recomendacoes.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <Input
                          placeholder="Ex: Treino de força 4x/semana, Cardio 2x/semana..."
                          {...register(`resultados.recomendacoes.${index}` as any)}
                          className="flex-1 focus-ring"
                        />
                        {recomendacoes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecomendacao(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Observações Finais */}
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
                  Observações Finais
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea
                  label="Observações Gerais"
                  rows={4}
                  {...register('observacoes')}
                  placeholder="Observações adicionais sobre a avaliação..."
                  className="focus-ring"
                />

                <Input
                  label="Próxima Avaliação"
                  type="date"
                  {...register('proximaAvaliacao')}
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex justify-end space-x-4"
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/avaliacoes')}
              className="px-8"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              loading={loading}
              className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Atualizar' : 'Salvar'} Avaliação
            </Button>
          </motion.div>
        </form>
      </div>
    </Layout>
  );
}