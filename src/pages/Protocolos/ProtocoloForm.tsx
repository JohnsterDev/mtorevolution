import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { Input, Select, Textarea } from '../../components/UI/Input';
import { ArrowLeft, Plus, Trash2, Upload, Link as LinkIcon, Save, Eye } from 'lucide-react';
import { Protocolo, Exercicio } from '../../types';
import { protocoloService } from '../../services/protocolo';
import toast from 'react-hot-toast';

interface ProtocoloFormData {
  nome: string;
  descricao: string;
  tipo: 'PRE_DEFINIDO' | 'PERSONALIZADO';
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  duracaoSemanas: number;
  objetivo: string;
  observacoes: string;
  exercicios: Exercicio[];
  anexos: string[];
  links: string[];
  status: 'ATIVO' | 'INATIVO';
}

export function ProtocoloForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [uploadingFile, setUploadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<ProtocoloFormData>({
    defaultValues: {
      exercicios: [{ 
        id: '', 
        nome: '', 
        grupoMuscular: '', 
        series: 3, 
        repeticoes: '10-12', 
        carga: 0, 
        descanso: 60, 
        observacoes: '' 
      }],
      anexos: [],
      links: [''],
    }
  });

  const { fields: exercicioFields, append: appendExercicio, remove: removeExercicio } = useFieldArray({
    control,
    name: 'exercicios'
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'links'
  });

  const watchedTipo = watch('tipo');

  useEffect(() => {
    if (isEditing) {
      loadProtocolo();
    }
  }, [id]);

  const loadProtocolo = async () => {
    try {
      const protocolo = await protocoloService.getById(id!);
      reset({
        nome: protocolo.nome,
        descricao: protocolo.descricao,
        tipo: protocolo.tipo,
        nivel: protocolo.nivel,
        duracaoSemanas: protocolo.duracaoSemanas,
        objetivo: protocolo.objetivo,
        observacoes: protocolo.observacoes || '',
        exercicios: protocolo.exercicios || [],
        anexos: protocolo.anexos || [],
        links: protocolo.links || [''],
        status: protocolo.status,
      });
    } catch (error) {
      toast.error('Erro ao carregar protocolo');
      navigate('/protocolos');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ProtocoloFormData) => {
    setLoading(true);
    try {
      // Filter out empty links
      data.links = data.links.filter(link => link.trim() !== '');
      
      if (isEditing) {
        await protocoloService.update(id!, data);
        toast.success('Protocolo atualizado com sucesso');
      } else {
        await protocoloService.create(data);
        toast.success('Protocolo criado com sucesso');
      }
      navigate('/protocolos');
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar protocolo' : 'Erro ao criar protocolo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      // TODO: Implement file upload to server
      // const uploadedUrl = await fileService.upload(file);
      const mockUrl = `https://example.com/files/${file.name}`;
      
      // Add to anexos array
      const currentAnexos = watch('anexos') || [];
      reset({
        ...watch(),
        anexos: [...currentAnexos, mockUrl]
      });
      
      toast.success('Arquivo anexado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer upload do arquivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAnexo = (index: number) => {
    const currentAnexos = watch('anexos') || [];
    const newAnexos = currentAnexos.filter((_, i) => i !== index);
    reset({
      ...watch(),
      anexos: newAnexos
    });
  };

  const tipoOptions = [
    { value: 'PRE_DEFINIDO', label: 'Pré-definido' },
    { value: 'PERSONALIZADO', label: 'Personalizado' },
  ];

  const nivelOptions = [
    { value: 'INICIANTE', label: 'Iniciante' },
    { value: 'INTERMEDIARIO', label: 'Intermediário' },
    { value: 'AVANCADO', label: 'Avançado' },
  ];

  const statusOptions = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
  ];

  const grupoMuscularOptions = [
    { value: 'PEITO', label: 'Peito' },
    { value: 'COSTAS', label: 'Costas' },
    { value: 'OMBROS', label: 'Ombros' },
    { value: 'BRACOS', label: 'Braços' },
    { value: 'PERNAS', label: 'Pernas' },
    { value: 'CORE', label: 'Core/Abdômen' },
    { value: 'CARDIO', label: 'Cardio' },
    { value: 'FUNCIONAL', label: 'Funcional' },
  ];

  if (initialLoading) {
    return (
      <Layout title={isEditing ? 'Editar Protocolo' : 'Novo Protocolo'}>
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
    <Layout title={isEditing ? 'Editar Protocolo' : 'Novo Protocolo'}>
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
              {isEditing ? 'Editar Protocolo' : 'Novo Protocolo'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditing ? 'Atualize as informações do protocolo' : 'Crie um novo protocolo de treino'}
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
                  <Save className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome do Protocolo"
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'Nome deve ter pelo menos 3 caracteres',
                    },
                  })}
                  error={errors.nome?.message}
                  className="focus-ring"
                />

                <Select
                  label="Tipo"
                  options={[{ value: '', label: 'Selecione o tipo' }, ...tipoOptions]}
                  {...register('tipo', {
                    required: 'Tipo é obrigatório',
                  })}
                  error={errors.tipo?.message}
                  className="focus-ring"
                />

                <Select
                  label="Nível"
                  options={[{ value: '', label: 'Selecione o nível' }, ...nivelOptions]}
                  {...register('nivel', {
                    required: 'Nível é obrigatório',
                  })}
                  error={errors.nivel?.message}
                  className="focus-ring"
                />

                <Input
                  label="Duração (semanas)"
                  type="number"
                  min="1"
                  max="52"
                  {...register('duracaoSemanas', {
                    required: 'Duração é obrigatória',
                    min: { value: 1, message: 'Mínimo 1 semana' },
                    max: { value: 52, message: 'Máximo 52 semanas' },
                  })}
                  error={errors.duracaoSemanas?.message}
                  className="focus-ring"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Descrição"
                    rows={3}
                    {...register('descricao', {
                      required: 'Descrição é obrigatória',
                    })}
                    error={errors.descricao?.message}
                    className="focus-ring"
                  />
                </div>

                <Input
                  label="Objetivo"
                  {...register('objetivo', {
                    required: 'Objetivo é obrigatório',
                  })}
                  error={errors.objetivo?.message}
                  placeholder="Ex: Ganho de massa muscular, perda de peso..."
                  className="focus-ring"
                />

                {isEditing && (
                  <Select
                    label="Status"
                    options={statusOptions}
                    {...register('status', {
                      required: 'Status é obrigatório',
                    })}
                    error={errors.status?.message}
                    className="focus-ring"
                  />
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Exercícios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Exercícios
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => appendExercicio({
                    id: '',
                    nome: '',
                    grupoMuscular: '',
                    series: 3,
                    repeticoes: '10-12',
                    carga: 0,
                    descanso: 60,
                    observacoes: ''
                  })}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exercício
                </Button>
              </div>

              <div className="space-y-6">
                {exercicioFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Exercício {index + 1}
                      </h4>
                      {exercicioFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercicio(index)}
                          className="text-red-600 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Input
                        label="Nome do Exercício"
                        {...register(`exercicios.${index}.nome`, {
                          required: 'Nome do exercício é obrigatório',
                        })}
                        error={errors.exercicios?.[index]?.nome?.message}
                        className="focus-ring"
                      />

                      <Select
                        label="Grupo Muscular"
                        options={[{ value: '', label: 'Selecione' }, ...grupoMuscularOptions]}
                        {...register(`exercicios.${index}.grupoMuscular`, {
                          required: 'Grupo muscular é obrigatório',
                        })}
                        error={errors.exercicios?.[index]?.grupoMuscular?.message}
                        className="focus-ring"
                      />

                      <Input
                        label="Séries"
                        type="number"
                        min="1"
                        {...register(`exercicios.${index}.series`, {
                          required: 'Número de séries é obrigatório',
                          min: { value: 1, message: 'Mínimo 1 série' },
                        })}
                        error={errors.exercicios?.[index]?.series?.message}
                        className="focus-ring"
                      />

                      <Input
                        label="Repetições"
                        placeholder="Ex: 10-12, 15, até a falha"
                        {...register(`exercicios.${index}.repeticoes`, {
                          required: 'Repetições são obrigatórias',
                        })}
                        error={errors.exercicios?.[index]?.repeticoes?.message}
                        className="focus-ring"
                      />

                      <Input
                        label="Carga (kg)"
                        type="number"
                        min="0"
                        step="0.5"
                        {...register(`exercicios.${index}.carga`)}
                        className="focus-ring"
                      />

                      <Input
                        label="Descanso (segundos)"
                        type="number"
                        min="0"
                        {...register(`exercicios.${index}.descanso`, {
                          required: 'Tempo de descanso é obrigatório',
                        })}
                        error={errors.exercicios?.[index]?.descanso?.message}
                        className="focus-ring"
                      />

                      <div className="md:col-span-2 lg:col-span-3">
                        <Textarea
                          label="Observações"
                          rows={2}
                          {...register(`exercicios.${index}.observacoes`)}
                          placeholder="Instruções específicas, técnica, etc."
                          className="focus-ring"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Anexos e Links */}
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
                  Anexos e Links
                </h3>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anexar Arquivos
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Clique para fazer upload</span> ou arraste arquivos
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                      />
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {watch('anexos')?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {watch('anexos').map((anexo, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <span className="text-sm text-blue-800 dark:text-blue-300 truncate">
                            {anexo.split('/').pop()}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAnexo(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Links Úteis
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendLink('')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {linkFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          placeholder="https://exemplo.com/video-demonstracao"
                          {...register(`links.${index}`)}
                          className="flex-1 focus-ring"
                        />
                        {linkFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLink(index)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
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
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Observações Gerais
                </h3>
              </div>

              <Textarea
                label="Observações"
                rows={4}
                {...register('observacoes')}
                placeholder="Instruções gerais, precauções, dicas importantes..."
                className="focus-ring"
              />
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
              onClick={() => navigate('/protocolos')}
              className="px-8"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              loading={loading}
              className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isEditing ? 'Atualizar' : 'Criar'} Protocolo
            </Button>
          </motion.div>
        </form>
      </div>
    </Layout>
  );
}