import { mockApiService } from './mockApi';
import { Cliente, PaginatedResponse } from '../types';

class ClienteService {
  async getAll(page = 0, size = 10, search?: string): Promise<PaginatedResponse<Cliente>> {
    return mockApiService.getClientes(page, size, search);
  }

  async getById(id: string): Promise<Cliente> {
    return mockApiService.getClienteById(id);
  }

  async create(clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    // Transform data to match expected format
    const dto = {
      nome: clienteData.nome,
      email: clienteData.email,
      telefone: clienteData.telefone,
      dataNascimento: clienteData.dataNascimento,
      genero: clienteData.genero,
      modalidade: clienteData.modalidade,
      objetivo: clienteData.objetivo,
      status: clienteData.status || 'ATIVO'
    };
    
    return mockApiService.createCliente(dto);
  }

  async update(id: string, clienteData: Partial<Cliente>): Promise<Cliente> {
    // Transform data to match expected format
    const dto = {
      nome: clienteData.nome,
      email: clienteData.email,
      telefone: clienteData.telefone,
      dataNascimento: clienteData.dataNascimento,
      genero: clienteData.genero,
      modalidade: clienteData.modalidade,
      objetivo: clienteData.objetivo,
      status: clienteData.status
    };
    
    return mockApiService.updateCliente(id, dto);
  }

  async delete(id: string): Promise<void> {
    return mockApiService.deleteCliente(id);
  }

  async updateStatus(id: string, status: 'ATIVO' | 'INATIVO'): Promise<Cliente> {
    return mockApiService.updateClienteStatus(id, status);
  }

  async getByEmail(email: string): Promise<Cliente | null> {
    try {
      const clientes = await mockApiService.getClientes(0, 1000); // Get all to search
      return clientes.content.find(c => c.email === email) || null;
    } catch (error: any) {
      return null;
    }
  }

  async getStats(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    novosUltimoMes: number;
  }> {
    const clientes = await mockApiService.getClientes(0, 1000); // Get all
    const total = clientes.totalElements;
    const ativos = clientes.content.filter(c => c.status === 'ATIVO').length;
    const inativos = clientes.content.filter(c => c.status === 'INATIVO').length;
    
    // Mock: assume 20% are new this month
    const novosUltimoMes = Math.floor(total * 0.2);

    return {
      total,
      ativos,
      inativos,
      novosUltimoMes
    };
  }
}

export const clienteService = new ClienteService();