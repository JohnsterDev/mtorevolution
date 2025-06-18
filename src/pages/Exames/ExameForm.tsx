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
  TestTube, 
  Calendar,
  FileText,
  Upload,
  X,
  Plus,
  Microscope,
  AlertTriangle,
  Clock,
  Stethoscope
} from 'lucide-react';
import { Exame, TipoExame, Laboratorio } from '../../types/exame';
import { Cliente } from '../../types';
import { exameService } from '../../services/exame';
import { clienteService } from '../../services/cliente';
import toast from 'react-hot-toast';

interface ExameFormData {
  clienteId: string;
  tipoExameId: string;
  laboratorioId: string;
  medicoSolicitante: string;
  dataColeta: string;
  dataResultado?: string;
  status: 'SOLICITADO' | 'AGENDADO' | 'COLETADO' | 'PROCESSANDO' | 'CONCLUIDO' | 'CANCELADO' | 'REAGENDADO';
  prioridade: 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';
  resultados: Array<{
    parametro: string;
    valor: string | number;
    unidade: string;
    valorReferencia: string;
    status: 'NORMAL' | 'ALTERADO' | 'CRITICO';
    observacao?: string;
  }>;
  observacoes?: string;
  observacoesMedicas?: string;
  proximoExame?: string;
}

export function ExameForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposExame, setTiposExame] = useState<TipoExame[]>([]);
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue
  } = useForm<ExameFormData>({
    defaultValues: {
      resultados: [],
      status: 'SOLICITADO',
      prioridade: 'NORMAL'
    }
  });

  const { fields: resultadoFields, append: appendResultado, remove: removeResultado } = useFieldArray({
    control,
    name: 'resultados'
  });

  const watchedTipoExame = watch('tipoExameId');
  const watchedStatus = watch('status');

  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadExame();
    }
  }, [id]);

  useEffect(() => {
    if (watchedTipoExame && !isEditing) {
      loadParametrosExame(watchedTipoExame);
    }
  }, [watchedTipoExame, isEditing]);

  const loadInitialData = async () => {
    try {
      const [clientesData, tiposData, laboratoriosData] = await Promise.all([
        clienteService.getAll(0, 1000),
        exameService.getTiposExame(),
        exameService.getLaboratorios()
      ]);
      
      setClientes(clientesData.content.filter(c => c.status === 'ATIVO'));
      setTiposExame(tiposData);
      setLaboratorios(laboratoriosData);
    } catch (error) {
      toast.error('Erro ao carregar dados iniciais');
    }
  };

  const loadExame = async () => {
    try {
      const exame = await exameService.getById(id!);
      
      reset({
        clienteId: exame.clienteId,
        tipoExameId: exame.tipoExame.id,
        laboratorioId: exame.laboratorio.id,
        medicoSolicitante: exame.medicoSolicitante,
        dataColeta: exame.dataColeta.split('T')[0],
        dataResultado: exame.dataResultado?.split('T')[0],
        status: exame.status,
        prioridade: exame.prioridade,
        resultados: exame.resultados,
        observacoes: exame.observacoes || '',
        observacoesMedicas: exame.observacoesMedicas || '',
        proximoExame: exame.proximoExame?.split('T')[0]
      });
      
      setUploadedFiles(exame.arquivos.map(a => a.url));
    } catch (error) {
      toast.error('Erro ao carregar exame');
      navigate('/exames');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadParametrosExame = async (tipoExameId: string) => {
    const tipoExame = tiposExame.find(t => t.id === tipoExameId);
    if (!tipoExame) return;

    // Mock parameters based on exam type
    const parametrosPadrao = {
      '1': [ // Hemograma
        { parametro: 'Hemoglobina', unidade: 'g/dL', valorReferencia: '12.0 - 16.0' },
        { parametro: 'Hematócrito', unidade: '%', valorReferencia: '36.0 - 48.0' },
        { parametro: 'Leucócitos', unidade: '/mm³', valorReferencia: '4000 - 11000' },
        { parametro: 'Plaquetas', unidade: '/mm³', valorReferencia: '150000 - 450000' }
      ],
      '2': [ // Glicemia
        { parametro: 'Glicose', unidade: 'mg/dL', valorReferencia: '70 - 99' }
      ],
      '3': [ // Perfil Lipídico
        { parametro: 'Colesterol Total', unidade: 'mg/dL', valorReferencia: '< 200' },
        { parametro: 'HDL', unidade: 'mg/dL', valorReferencia: '> 40' },
        { parametro: 'LDL', unidade: 'mg/dL', valorReferencia: '< 130' },
        { parametro: 'Triglicérides', unidade: 'mg/dL', valorReferencia: '< 150' }
      ]
    };

    const parametros = parametrosPadrao[tipoExameId as keyof typeof parametrosPadrao] || [];
    
    // Clear existing results and add default parameters
    setValue('resultados', []);
    parametros.forEach(param => {
      appendResultado({
        parametro: param.parametro,
        valor: '',
        unidade: param.unidade,
        valorReferencia: param.valorReferencia,
        status: 'NORMAL'
      });
    });
  };

  const onSubmit = async (data: ExameFormData) => {
    setLoading(true);
    try {
      const tipoExame = tiposExame.find(t => t.id === data.tipoExameId);
      const laboratorio = laboratorios.find(l => l.id === data.laboratorioId);
      const cliente = clientes.find(c => c.id === data.clienteId);
      
      if (!tipoExame || !laboratorio || !cliente) {
        throw new Error('Dados incompletos');
      }

      const exameData = {
        ...data,
        tipoExame,
        laboratorio,
        cliente,
        categoria: {
          id: '1',
          nome: tipoExame.categoria,
          cor: '#6366f1',
          icone: 'test-tube',
          descricao: tipoExame.categoria
        },
        arquivos: uploadedFiles.map((url, index) => ({
          id: index.toString(),
          nome: `arquivo_${index + 1}.pdf`,
          tipo: 'PDF' as const,
          url,
          tamanho: 0,
          dataUpload: new Date().toISOString(),
          checksum: '',
          criptografado: true
        })),
        valoresReferencia: [],
        alertas: data.resultados
          .filter(r => r.status === 'ALTERADO' || r.status === 'CRITICO')
          .map((r, index) => ({
            id: index.toString(),
            tipo: r.status as 'ALTERADO' | 'CRITICO',
            parametro: r.parametro,
            valor: r.valor,
            mensagem: `${r.parametro}: ${r.status.toLowerCase()}`,
            dataAlerta: new Date().toISOString(),
            visualizado: false
          }))
      };

      if (isEditing) {
        await exameService.update(id!, exameData);
        toast.success('Exame atualizado com sucesso');
      } else {
        await exameService.create(exameData);
        toast.success('Exame criado com sucesso');
      }
      navigate('/exames');
    } catch (error: any) {
      const errorMessage = error.message || 
                          (isEditing ? 'Erro ao atualizar exame' : 'Erro ao criar exame');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const url = await exameService.uploadArquivo(id || 'temp', file);
      setUploadedFiles(prev => [...prev, url]);
      toast.success('Arquivo enviado com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clienteOptions = [
    { value: '', label: 'Selecione um cliente' },
    ...clientes.map(c => ({ value: c.id, label: c.nome }))
  ];

  const tipoExameOptions = [
    { value: '', label: 'Selecione o tipo de exame' },
    ...tiposExame.map(t => ({ value: t.id, label: t.nome }))
  ];

  const laboratorioOptions = [
    { value: '', label: 'Selecione um laboratório' },
    ...laboratorios.map(l => ({ value: l.id, label: l.nome }))
  ];

  const statusOptions = [
    { value: 'SOLICITADO', label: 'Solicitado' },
    { value: 'AGENDADO', label: 'Agendado' },
    { value: 'COLETADO', label: 'Coletado' },
    { value: 'PROCESSANDO', label: 'Processando' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'REAGENDADO', label: 'Reagendado' }
  ];

  const prioridadeOptions = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  const statusResultadoOptions = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ALTERADO', label: 'Alterado' },
    { value: 'CRITICO', label: 'Crítico' }
  ];

  if (initialLoading) {
    return (
      <Layout title={isEditing ? 'Editar Exame' : 'Novo Exame'}>
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
    <Layout title={isEditing ? 'Editar Exame' : 'Novo Exame'}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
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
              {isEditing ? 'Editar Exame' : 'Novo Exame Médico'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditing ? 'Atualize as informações do exame' : 'Registre um novo exame laboratorial'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select
                  label="Cliente"
                  options={clienteOptions}
                  {...register('clienteId', {
                    required: 'Cliente é obrigatório',
                  })}
                  error={errors.clienteId?.message}
                  className="focus-ring"
                />

                <Select
                  label="Tipo de Exame"
                  options={tipoExameOptions}
                  {...register('tipoExameId', {
                    required: 'Tipo de exame é obrigatório',
                  })}
                  error={errors.tipoExameId?.message}
                  className="focus-ring"
                />

                <Select
                  label="Laboratório"
                  options={laboratorioOptions}
                  {...register('laboratorioId', {
                    required: 'Laboratório é obrigatório',
                  })}
                  error={errors.laboratorioId?.message}
                  className="focus-ring"
                />

                <Input
                  label="Médico Solicitante"
                  {...register('medicoSolicitante', {
                    required: 'Médico solicitante é obrigatório',
                  })}
                  error={errors.medicoSolicitante?.message}
                  placeholder="Dr. João Silva - CRM 123456"
                  className="focus-ring"
                />

                <Input
                  label="Data da Coleta"
                  type="datetime-local"
                  {...register('dataColeta', {
                    required: 'Data da coleta é obrigatória',
                  })}
                  error={errors.dataColeta?.message}
                  className="focus-ring"
                />

                {watchedStatus === 'CONCLUIDO' && (
                  <Input
                    label="Data do Resultado"
                    type="datetime-local"
                    {...register('dataResultado')}
                    className="focus-ring"
                  />
                )}

                <Select
                  label="Status"
                  options={statusOptions}
                  {...register('status', {
                    required: 'Status é obrigatório',
                  })}
                  error={errors.status?.message}
                  className="focus-ring"
                />

                <Select
                  label="Prioridade"
                  options={prioridadeOptions}
                  {...register('prioridade', {
                    required: 'Prioridade é obrigatória',
                  })}
                  error={errors.prioridade?.message}
                  className="focus-ring"
                />

                <Input
                  label="Próximo Exame"
                  type="date"
                  {...register('proximoExame')}
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Resultados */}
          {(watchedStatus === 'CONCLUIDO' || resultadoFields.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <TestTube className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Resultados do Exame
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => appendResultado({
                      parametro: '',
                      valor: '',
                      unidade: '',
                      valorReferencia: '',
                      status: 'NORMAL'
                    })}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Resultado
                  </Button>
                </div>

                <div className="space-y-6">
                  {resultadoFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Parâmetro {index + 1}
                        </h4>
                        {resultadoFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResultado(index)}
                            className="text-red-600 hover:bg-red-100 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input
                          label="Parâmetro"
                          {...register(`resultados.${index}.parametro`, {
                            required: 'Parâmetro é obrigatório',
                          })}
                          error={errors.resultados?.[index]?.parametro?.message}
                          placeholder="Ex: Hemoglobina"
                          className="focus-ring"
                        />

                        <Input
                          label="Valor"
                          {...register(`resultados.${index}.valor`, {
                            required: 'Valor é obrigatório',
                          })}
                          error={errors.resultados?.[index]?.valor?.message}
                          placeholder="Ex: 14.2"
                          className="focus-ring"
                        />

                        <Input
                          label="Unidade"
                          {...register(`resultados.${index}.unidade`, {
                            required: 'Unidade é obrigatória',
                          })}
                          error={errors.resultados?.[index]?.unidade?.message}
                          placeholder="Ex: g/dL"
                          className="focus-ring"
                        />

                        <Input
                          label="Valor de Referência"
                          {...register(`resultados.${index}.valorReferencia`, {
                            required: 'Valor de referência é obrigatório',
                          })}
                          error={errors.resultados?.[index]?.valorReferencia?.message}
                          placeholder="Ex: 12.0 - 16.0"
                          className="focus-ring"
                        />

                        <Select
                          label="Status"
                          options={[{ value: '', label: 'Selecione' }, ...statusResultadoOptions]}
                          {...register(`resultados.${index}.status`, {
                            required: 'Status é obrigatório',
                          })}
                          error={errors.resultados?.[index]?.status?.message}
                          className="focus-ring"
                        />

                        <div className="md:col-span-1 lg:col-span-1">
                          <Textarea
                            label="Observação"
                            rows={2}
                            {...register(`resultados.${index}.observacao`)}
                            placeholder="Observações sobre este resultado..."
                            className="focus-ring"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Upload de Arquivos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Arquivos do Exame
                </h3>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anexar Resultados
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Clique para fazer upload</span> ou arraste arquivos
                        </p>
                        <p className="text-xs text-gray-500">PDF, DICOM, Imagens (MAX. 50MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.dcm,.dicom,.jpg,.jpeg,.png,.gif"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                      />
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <span className="text-sm text-blue-800 dark:text-blue-300 truncate">
                            {file.split('/').pop()}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Observações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Observações
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea
                  label="Observações Gerais"
                  rows={4}
                  {...register('observacoes')}
                  placeholder="Observações sobre o exame, preparação, etc."
                  className="focus-ring"
                />

                <Textarea
                  label="Observações Médicas"
                  rows={4}
                  {...register('observacoesMedicas')}
                  placeholder="Interpretação médica dos resultados..."
                  className="focus-ring"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end space-x-4"
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/exames')}
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
              {isEditing ? 'Atualizar' : 'Salvar'} Exame
            </Button>
          </motion.div>
        </form>
      </div>
    </Layout>
  );
}