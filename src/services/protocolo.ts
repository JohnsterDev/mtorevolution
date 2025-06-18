import { mockApiService } from './mockApi';
import { Protocolo, PaginatedResponse } from '../types';

class ProtocoloService {
  async getAll(
    page = 0, 
    size = 10, 
    search?: string, 
    tipo?: 'TODOS' | 'PRE_DEFINIDO' | 'PERSONALIZADO'
  ): Promise<PaginatedResponse<Protocolo>> {
    return mockApiService.getProtocolos(page, size, search, tipo);
  }

  async getById(id: string): Promise<Protocolo> {
    return mockApiService.getProtocoloById(id);
  }

  async create(protocoloData: Omit<Protocolo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Protocolo> {
    return mockApiService.createProtocolo(protocoloData);
  }

  async update(id: string, protocoloData: Partial<Protocolo>): Promise<Protocolo> {
    return mockApiService.updateProtocolo(id, protocoloData);
  }

  async delete(id: string): Promise<void> {
    return mockApiService.deleteProtocolo(id);
  }

  async getByTipo(tipo: 'PRE_DEFINIDO' | 'PERSONALIZADO'): Promise<Protocolo[]> {
    const response = await mockApiService.getProtocolos(0, 1000, undefined, tipo);
    return response.content;
  }

  async updateStatus(id: string, status: 'ATIVO' | 'INATIVO'): Promise<Protocolo> {
    return mockApiService.updateProtocolo(id, { status });
  }

  async sendToClient(protocoloId: string, clienteId: string, observacoes?: string): Promise<void> {
    // Mock implementation - just simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Protocolo ${protocoloId} enviado para cliente ${clienteId}`, { observacoes });
  }

  async copyProtocolo(id: string, newName: string): Promise<Protocolo> {
    const original = await this.getById(id);
    const copy = {
      ...original,
      nome: newName,
      tipo: 'PERSONALIZADO' as const,
    };
    delete (copy as any).id;
    delete (copy as any).createdAt;
    delete (copy as any).updatedAt;
    
    return mockApiService.createProtocolo(copy);
  }

  async getPreDefinidos(): Promise<Protocolo[]> {
    const response = await mockApiService.getProtocolos(0, 1000, undefined, 'PRE_DEFINIDO');
    return response.content;
  }

  async exportToPdf(id: string): Promise<Blob> {
    // Mock PDF export
    await new Promise(resolve => setTimeout(resolve, 1000));
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  }

  async uploadAnexo(protocoloId: string, file: File): Promise<string> {
    // Mock file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `https://mock-storage.com/files/${file.name}`;
  }

  async deleteAnexo(protocoloId: string, anexoUrl: string): Promise<void> {
    // Mock file deletion
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Anexo removido: ${anexoUrl}`);
  }

  async getStats(): Promise<{
    total: number;
    preDefinidos: number;
    personalizados: number;
    ativos: number;
  }> {
    const protocolos = await mockApiService.getProtocolos(0, 1000); // Get all
    const total = protocolos.totalElements;
    const preDefinidos = protocolos.content.filter(p => p.tipo === 'PRE_DEFINIDO').length;
    const personalizados = protocolos.content.filter(p => p.tipo === 'PERSONALIZADO').length;
    const ativos = protocolos.content.filter(p => p.status === 'ATIVO').length;

    return {
      total,
      preDefinidos,
      personalizados,
      ativos
    };
  }
}

export const protocoloService = new ProtocoloService();