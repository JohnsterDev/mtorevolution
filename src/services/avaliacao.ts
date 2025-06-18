import { AvaliacaoFisica, PaginatedResponse } from '../types';

class AvaliacaoService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getAll(page = 0, size = 10, clienteId?: string): Promise<PaginatedResponse<AvaliacaoFisica>> {
    await this.delay(500);
    
    // Mock data
    const mockAvaliacoes: AvaliacaoFisica[] = [
      {
        id: '1',
        clienteId: '1',
        dataAvaliacao: '2024-12-15',
        peso: 75.5,
        altura: 1.75,
        percentualGordura: 12.5,
        massaMuscular: 62.8,
        imc: 24.6,
        circunferencias: {
          braco: 35,
          antebraco: 28,
          peitoral: 98,
          cintura: 82,
          quadril: 95,
          coxa: 58,
          panturrilha: 38
        },
        observacoes: 'Boa evolução no último mês',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const filteredAvaliacoes = clienteId 
      ? mockAvaliacoes.filter(a => a.clienteId === clienteId)
      : mockAvaliacoes;

    const start = page * size;
    const end = start + size;
    const content = filteredAvaliacoes.slice(start, end);

    return {
      content,
      totalElements: filteredAvaliacoes.length,
      totalPages: Math.ceil(filteredAvaliacoes.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= filteredAvaliacoes.length
    };
  }

  async getById(id: string): Promise<AvaliacaoFisica> {
    await this.delay(300);
    
    // Mock single evaluation
    return {
      id,
      clienteId: '1',
      dataAvaliacao: '2024-12-15',
      peso: 75.5,
      altura: 1.75,
      percentualGordura: 12.5,
      massaMuscular: 62.8,
      imc: 24.6,
      circunferencias: {
        braco: 35,
        antebraco: 28,
        peitoral: 98,
        cintura: 82,
        quadril: 95,
        coxa: 58,
        panturrilha: 38
      },
      observacoes: 'Boa evolução no último mês',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getByClienteId(clienteId: string): Promise<AvaliacaoFisica[]> {
    const response = await this.getAll(0, 1000, clienteId);
    return response.content;
  }

  async create(avaliacao: Omit<AvaliacaoFisica, 'id' | 'createdAt' | 'updatedAt' | 'cliente'>): Promise<AvaliacaoFisica> {
    await this.delay(500);
    
    return {
      ...avaliacao,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(id: string, avaliacao: Partial<AvaliacaoFisica>): Promise<AvaliacaoFisica> {
    await this.delay(500);
    
    const existing = await this.getById(id);
    return {
      ...existing,
      ...avaliacao,
      updatedAt: new Date().toISOString(),
    };
  }

  async delete(id: string): Promise<void> {
    await this.delay(300);
    console.log(`Mock: Deleted avaliacao ${id}`);
  }

  async exportToPdf(id: string): Promise<Blob> {
    await this.delay(1000);
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  }

  async getEvolution(clienteId: string, startDate?: string, endDate?: string): Promise<{
    peso: Array<{ data: string; valor: number }>;
    percentualGordura: Array<{ data: string; valor: number }>;
    massaMuscular: Array<{ data: string; valor: number }>;
    imc: Array<{ data: string; valor: number }>;
  }> {
    await this.delay(500);
    
    // Mock evolution data
    return {
      peso: [
        { data: '2024-11-15', valor: 76.2 },
        { data: '2024-12-15', valor: 75.5 },
      ],
      percentualGordura: [
        { data: '2024-11-15', valor: 13.2 },
        { data: '2024-12-15', valor: 12.5 },
      ],
      massaMuscular: [
        { data: '2024-11-15', valor: 62.1 },
        { data: '2024-12-15', valor: 62.8 },
      ],
      imc: [
        { data: '2024-11-15', valor: 24.9 },
        { data: '2024-12-15', valor: 24.6 },
      ],
    };
  }

  async getStats(): Promise<{
    total: number;
    ultimoMes: number;
    mediaImc: number;
    mediaPercentualGordura: number;
  }> {
    await this.delay(300);
    
    return {
      total: 45,
      ultimoMes: 12,
      mediaImc: 24.2,
      mediaPercentualGordura: 13.8,
    };
  }
}

export const avaliacaoService = new AvaliacaoService();