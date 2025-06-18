import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout/Layout';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/UI/Table';
import { Plus, Search, Edit, Trash2, Eye, Send, Filter, FileText, Dumbbell, Users, Target } from 'lucide-react';
import { Protocolo } from '../../types';
import { protocoloService } from '../../services/protocolo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export function ProtocolosList() {
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'TODOS' | 'PRE_DEFINIDO' | 'PERSONALIZADO'>('TODOS');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadProtocolos();
  }, [currentPage, search, filterType]);

  const loadProtocolos = async () => {
    try {
      setLoading(true);
      const response = await protocoloService.getAll(currentPage, 10, search, filterType);
      setProtocolos(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Erro ao carregar protocolos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este protocolo?')) {
      try {
        await protocoloService.delete(id);
        toast.success('Protocolo excluído com sucesso');
        loadProtocolos();
      } catch (error) {
        toast.error('Erro ao excluir protocolo');
      }
    }
  };

  const handleSendToClient = async (protocoloId: string) => {
    // TODO: Implementar modal para selecionar cliente e enviar protocolo
    toast.success('Funcionalidade de envio será implementada');
  };

  const getTypeBadge = (tipo: string) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
    
    if (tipo === 'PRE_DEFINIDO') {
      return `${baseClasses} bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200`;
    }
    return `${baseClasses} bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200`;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    if (status === 'ATIVO') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const statsCards = [
    {
      title: 'Total de Protocolos',
      value: protocolos.length,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Pré-definidos',
      value: protocolos.filter(p => p.tipo === 'PRE_DEFINIDO').length,
      icon: Dumbbell,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Personalizados',
      value: protocolos.filter(p => p.tipo === 'PERSONALIZADO').length,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Ativos',
      value: protocolos.filter(p => p.status === 'ATIVO').length,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <Layout title="Protocolos de Treino">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Protocolos de Treino
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Gerencie protocolos pré-definidos e crie treinos personalizados
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/protocolos/pre-definidos">
              <Button variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600">
                <Dumbbell className="w-4 h-4 mr-2" />
                Pré-definidos
              </Button>
            </Link>
            <Link to="/protocolos/novo">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Protocolo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 pointer-events-none" />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar protocolos por nome, tipo ou nível..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:border-indigo-500 focus:ring-indigo-500/20 focus:outline-none"
                >
                  <option value="TODOS">Todos os tipos</option>
                  <option value="PRE_DEFINIDO">Pré-definidos</option>
                  <option value="PERSONALIZADO">Personalizados</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard padding="none" className="overflow-hidden">
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Nome</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Tipo</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Nível</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Duração</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Criado em</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {protocolos.map((protocolo, index) => (
                      <motion.tr
                        key={protocolo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
                      >
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{protocolo.nome}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {protocolo.descricao}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getTypeBadge(protocolo.tipo)}>
                            {protocolo.tipo === 'PRE_DEFINIDO' ? 'Pré-definido' : 'Personalizado'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200">
                            {protocolo.nivel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {protocolo.duracaoSemanas} semanas
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadge(protocolo.status)}>
                            {protocolo.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(protocolo.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link to={`/protocolos/${protocolo.id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link to={`/protocolos/${protocolo.id}/editar`}>
                              <Button variant="ghost" size="sm" className="hover:bg-green-100 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendToClient(protocolo.id)}
                              className="hover:bg-purple-100 hover:text-purple-600"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(protocolo.id)}
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
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
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}