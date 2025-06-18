import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { Input, Select } from '../../components/UI/Input';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Cliente } from '../../types';
import { clienteService } from '../../services/cliente';
import toast from 'react-hot-toast';

interface ClienteFormData {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: 'MASCULINO' | 'FEMININO';
  modalidade: string;
  objetivo: string;
  status: 'ATIVO' | 'INATIVO';
}

export function ClienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClienteFormData>();

  useEffect(() => {
    if (isEditing) {
      loadCliente();
    }
  }, [id]);

  const loadCliente = async () => {
    try {
      const cliente = await clienteService.getById(id!);
      reset({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        dataNascimento: cliente.dataNascimento.split('T')[0], // Extract date part
        genero: cliente.genero,
        modalidade: cliente.modalidade,
        objetivo: cliente.objetivo,
        status: cliente.status,
      });
    } catch (error) {
      toast.error('Erro ao carregar cliente');
      navigate('/clientes');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ClienteFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await clienteService.update(id!, data);
        toast.success('Cliente atualizado com sucesso');
      } else {
        await clienteService.create(data);
        toast.success('Cliente criado com sucesso');
      }
      navigate('/clientes');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          (isEditing ? 'Erro ao atualizar cliente' : 'Erro ao criar cliente');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generoOptions = [
    { value: '', label: 'Selecione o gênero' },
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMININO', label: 'Feminino' },
  ];

  const statusOptions = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
  ];

  if (initialLoading) {
    return (
      <Layout title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}>
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
    <Layout title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/clientes')}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditing ? 'Atualize as informações do cliente' : 'Cadastre um novo atleta'}
            </p>
          </div>
        </motion.div>

        {/* Form */}
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
                Informações Pessoais
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome completo"
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres',
                    },
                  })}
                  error={errors.nome?.message}
                  className="focus-ring"
                />

                <Input
                  label="Email"
                  type="email"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  error={errors.email?.message}
                  className="focus-ring"
                />

                <Input
                  label="Telefone"
                  type="tel"
                  {...register('telefone', {
                    required: 'Telefone é obrigatório',
                  })}
                  error={errors.telefone?.message}
                  placeholder="(11) 99999-9999"
                  className="focus-ring"
                />

                <Input
                  label="Data de nascimento"
                  type="date"
                  {...register('dataNascimento', {
                    required: 'Data de nascimento é obrigatória',
                  })}
                  error={errors.dataNascimento?.message}
                  className="focus-ring"
                />

                <Select
                  label="Gênero"
                  options={generoOptions}
                  {...register('genero', {
                    required: 'Gênero é obrigatório',
                  })}
                  error={errors.genero?.message}
                  className="focus-ring"
                />

                <Input
                  label="Modalidade"
                  {...register('modalidade', {
                    required: 'Modalidade é obrigatória',
                  })}
                  error={errors.modalidade?.message}
                  placeholder="Ex: Musculação, Crossfit, Natação..."
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

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/clientes')}
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
                  {isEditing ? 'Atualizar' : 'Criar'} Cliente
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}