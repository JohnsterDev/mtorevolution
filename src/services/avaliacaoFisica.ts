import { AvaliacaoFisica, ComparativoAvaliacoes, RelatorioAvaliacao, PaginatedResponse } from '../types';

class AvaliacaoFisicaService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Mock data para demonstração
  private mockAvaliacoes: AvaliacaoFisica[] = [
    {
      id: '1',
      clienteId: '1',
      cliente: {
        id: '1',
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-1111',
        dataNascimento: '1990-05-15',
        genero: 'MASCULINO'
      },
      dataAvaliacao: '2024-12-15',
      tipo: 'INICIAL',
      status: 'REALIZADA',
      peso: 85.5,
      altura: 1.78,
      imc: 27.0,
      circunferencias: {
        pescoco: 38,
        ombro: 118,
        braco_relaxado: 32,
        braco_contraido: 35,
        antebraco: 28,
        punho: 17,
        peitoral: 102,
        cintura: 88,
        abdomen: 92,
        quadril: 98,
        coxa_proximal: 58,
        coxa_medial: 55,
        coxa_distal: 52,
        panturrilha: 38,
        tornozelo: 23
      },
      composicaoCorporal: {
        percentualGordura: 18.5,
        massaGorda: 15.8,
        massaMagra: 69.7,
        massaMuscular: 66.2,
        aguaCorporal: 58.2,
        massaOssea: 3.5,
        taxaMetabolica: 1850
      },
      dobrasCutaneas: {
        triceps: 12,
        biceps: 8,
        subescapular: 15,
        suprailiaca: 18,
        abdominal: 22,
        coxa: 14,
        panturrilha: 10
      },
      testesFisicos: {
        flexibilidade: {
          sentar_alcancar: 25,
          flexao_ombro: 170,
          observacoes: 'Boa flexibilidade geral'
        },
        forca: {
          preensao_manual_direita: 45,
          preensao_manual_esquerda: 42,
          flexao_braco: 25,
          abdominal: 35,
          observacoes: 'Força adequada para o nível'
        },
        resistencia: {
          vo2_max: 42,
          frequencia_cardiaca_repouso: 68,
          frequencia_cardiaca_maxima: 185,
          teste_cooper: 2800,
          observacoes: 'Bom condicionamento cardiovascular'
        }
      },
      pressaoArterial: {
        sistolica: 125,
        diastolica: 80,
        frequencia_cardiaca: 68
      },
      anamnese: {
        objetivo_principal: 'Ganho de massa muscular e redução do percentual de gordura',
        historico_lesoes: 'Lesão no joelho direito em 2020, totalmente recuperado',
        medicamentos: 'Nenhum',
        restricoes_medicas: 'Nenhuma',
        nivel_atividade: 'MODERADO',
        frequencia_exercicio: 4,
        tempo_exercicio: 60,
        modalidades_preferidas: ['Musculação', 'Corrida'],
        observacoes_gerais: 'Motivado e disciplinado'
      },
      fotos: {
        frente: 'https://example.com/foto1.jpg',
        perfil_direito: 'https://example.com/foto2.jpg',
        perfil_esquerdo: 'https://example.com/foto3.jpg',
        costas: 'https://example.com/foto4.jpg'
      },
      resultados: {
        classificacao_imc: 'SOBREPESO',
        classificacao_gordura: 'NORMAL',
        pontos_fortes: ['Boa massa muscular', 'Excelente motivação', 'Sem restrições médicas'],
        pontos_melhoria: ['Reduzir percentual de gordura', 'Melhorar flexibilidade posterior'],
        recomendacoes: ['Treino de força 4x/semana', 'Cardio 2x/semana', 'Dieta hipocalórica']
      },
      observacoes: 'Cliente apresenta bom potencial para atingir seus objetivos',
      proximaAvaliacao: '2025-01-15',
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    }
  ];

  async getAll(page = 0, size = 10, clienteId?: string, search?: string): Promise<PaginatedResponse<AvaliacaoFisica>> {
    await this.delay(500);
    
    let avaliacoes = [...this.mockAvaliacoes];
    
    if (clienteId) {
      avaliacoes = avaliacoes.filter(a => a.clienteId === clienteId);
    }
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      avaliacoes = avaliacoes.filter(a => 
        a.cliente?.nome.toLowerCase().includes(searchLower) ||
        a.tipo.toLowerCase().includes(searchLower) ||
        a.status.toLowerCase().includes(searchLower)
      );
    }

    const start = page * size;
    const end = start + size;
    const content = avaliacoes.slice(start, end);

    return {
      content,
      totalElements: avaliacoes.length,
      totalPages: Math.ceil(avaliacoes.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= avaliacoes.length
    };
  }

  async getById(id: string): Promise<AvaliacaoFisica> {
    await this.delay(300);
    
    const avaliacao = this.mockAvaliacoes.find(a => a.id === id);
    if (!avaliacao) {
      throw new Error('Avaliação não encontrada');
    }
    
    return avaliacao;
  }

  async getByClienteId(clienteId: string): Promise<AvaliacaoFisica[]> {
    await this.delay(300);
    return this.mockAvaliacoes.filter(a => a.clienteId === clienteId);
  }

  async create(avaliacao: Omit<AvaliacaoFisica, 'id' | 'createdAt' | 'updatedAt'>): Promise<AvaliacaoFisica> {
    await this.delay(500);
    
    const newAvaliacao: AvaliacaoFisica = {
      ...avaliacao,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockAvaliacoes.push(newAvaliacao);
    return newAvaliacao;
  }

  async update(id: string, avaliacao: Partial<AvaliacaoFisica>): Promise<AvaliacaoFisica> {
    await this.delay(500);
    
    const index = this.mockAvaliacoes.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Avaliação não encontrada');
    }

    const updatedAvaliacao = {
      ...this.mockAvaliacoes[index],
      ...avaliacao,
      updatedAt: new Date().toISOString(),
    };

    this.mockAvaliacoes[index] = updatedAvaliacao;
    return updatedAvaliacao;
  }

  async delete(id: string): Promise<void> {
    await this.delay(300);
    
    const index = this.mockAvaliacoes.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Avaliação não encontrada');
    }
    
    this.mockAvaliacoes.splice(index, 1);
  }

  async getComparativo(avaliacaoAtualId: string, avaliacaoAnteriorId: string): Promise<ComparativoAvaliacoes> {
    await this.delay(500);
    
    const avaliacaoAtual = await this.getById(avaliacaoAtualId);
    const avaliacaoAnterior = await this.getById(avaliacaoAnteriorId);

    const diferencas = {
      peso: avaliacaoAtual.peso - avaliacaoAnterior.peso,
      percentualGordura: avaliacaoAtual.composicaoCorporal.percentualGordura - avaliacaoAnterior.composicaoCorporal.percentualGordura,
      massaMagra: avaliacaoAtual.composicaoCorporal.massaMagra - avaliacaoAnterior.composicaoCorporal.massaMagra,
      imc: avaliacaoAtual.imc - avaliacaoAnterior.imc,
      circunferencias: Object.keys(avaliacaoAtual.circunferencias).reduce((acc, key) => {
        acc[key] = avaliacaoAtual.circunferencias[key as keyof typeof avaliacaoAtual.circunferencias] - 
                   avaliacaoAnterior.circunferencias[key as keyof typeof avaliacaoAnterior.circunferencias];
        return acc;
      }, {} as Record<string, number>)
    };

    // Determinar evolução baseada em múltiplos fatores
    let pontuacao = 0;
    if (diferencas.percentualGordura < 0) pontuacao += 2; // Redução de gordura é positiva
    if (diferencas.massaMagra > 0) pontuacao += 2; // Ganho de massa magra é positiva
    if (Math.abs(diferencas.peso) <= 2) pontuacao += 1; // Peso estável é bom

    const evolucao: 'POSITIVA' | 'NEGATIVA' | 'ESTAVEL' = 
      pontuacao >= 3 ? 'POSITIVA' : 
      pontuacao <= 1 ? 'NEGATIVA' : 'ESTAVEL';

    return {
      avaliacaoAnterior,
      avaliacaoAtual,
      diferencas,
      evolucao
    };
  }

  async getEvolucao(clienteId: string, startDate?: string, endDate?: string): Promise<{
    peso: Array<{ data: string; valor: number }>;
    percentualGordura: Array<{ data: string; valor: number }>;
    massaMagra: Array<{ data: string; valor: number }>;
    imc: Array<{ data: string; valor: number }>;
  }> {
    await this.delay(500);
    
    const avaliacoes = this.mockAvaliacoes
      .filter(a => a.clienteId === clienteId && a.status === 'REALIZADA')
      .sort((a, b) => new Date(a.dataAvaliacao).getTime() - new Date(b.dataAvaliacao).getTime());

    return {
      peso: avaliacoes.map(a => ({ data: a.dataAvaliacao, valor: a.peso })),
      percentualGordura: avaliacoes.map(a => ({ data: a.dataAvaliacao, valor: a.composicaoCorporal.percentualGordura })),
      massaMagra: avaliacoes.map(a => ({ data: a.dataAvaliacao, valor: a.composicaoCorporal.massaMagra })),
      imc: avaliacoes.map(a => ({ data: a.dataAvaliacao, valor: a.imc })),
    };
  }

  async generateRelatorio(id: string): Promise<RelatorioAvaliacao> {
    await this.delay(1000);
    
    const avaliacao = await this.getById(id);
    const evolucao = await this.getEvolucao(avaliacao.clienteId);
    
    // Buscar avaliação anterior para comparativo
    const avaliacoesCliente = await this.getByClienteId(avaliacao.clienteId);
    const avaliacaoAnterior = avaliacoesCliente
      .filter(a => a.id !== id && new Date(a.dataAvaliacao) < new Date(avaliacao.dataAvaliacao))
      .sort((a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime())[0];

    let comparativo: ComparativoAvaliacoes | undefined;
    if (avaliacaoAnterior) {
      comparativo = await this.getComparativo(id, avaliacaoAnterior.id);
    }

    return {
      avaliacao,
      comparativo,
      graficos: evolucao
    };
  }

  async exportToPdf(id: string): Promise<Blob> {
    await this.delay(1000);
    
    // Mock PDF generation
    const relatorio = await this.generateRelatorio(id);
    return new Blob(['Mock PDF content for avaliação ' + id], { type: 'application/pdf' });
  }

  async uploadFoto(avaliacaoId: string, tipo: 'frente' | 'perfil_direito' | 'perfil_esquerdo' | 'costas', file: File): Promise<string> {
    await this.delay(1000);
    
    // Mock file upload
    const mockUrl = `https://mock-storage.com/avaliacoes/${avaliacaoId}/${tipo}_${file.name}`;
    
    // Update avaliação with photo URL
    const avaliacao = await this.getById(avaliacaoId);
    avaliacao.fotos[tipo] = mockUrl;
    await this.update(avaliacaoId, { fotos: avaliacao.fotos });
    
    return mockUrl;
  }

  async getStats(): Promise<{
    total: number;
    realizadas: number;
    agendadas: number;
    mediaImc: number;
    mediaPercentualGordura: number;
    proximasReavaliacoes: number;
  }> {
    await this.delay(300);
    
    const total = this.mockAvaliacoes.length;
    const realizadas = this.mockAvaliacoes.filter(a => a.status === 'REALIZADA').length;
    const agendadas = this.mockAvaliacoes.filter(a => a.status === 'AGENDADA').length;
    
    const avaliacoesRealizadas = this.mockAvaliacoes.filter(a => a.status === 'REALIZADA');
    const mediaImc = avaliacoesRealizadas.reduce((acc, a) => acc + a.imc, 0) / avaliacoesRealizadas.length;
    const mediaPercentualGordura = avaliacoesRealizadas.reduce((acc, a) => acc + a.composicaoCorporal.percentualGordura, 0) / avaliacoesRealizadas.length;
    
    // Mock próximas reavaliações (próximos 30 dias)
    const proximasReavaliacoes = 5;

    return {
      total,
      realizadas,
      agendadas,
      mediaImc: Number(mediaImc.toFixed(1)),
      mediaPercentualGordura: Number(mediaPercentualGordura.toFixed(1)),
      proximasReavaliacoes
    };
  }

  // Utilitários para cálculos
  calcularIMC(peso: number, altura: number): number {
    return Number((peso / (altura * altura)).toFixed(1));
  }

  classificarIMC(imc: number): string {
    if (imc < 18.5) return 'ABAIXO_PESO';
    if (imc < 25) return 'PESO_NORMAL';
    if (imc < 30) return 'SOBREPESO';
    if (imc < 35) return 'OBESIDADE_I';
    if (imc < 40) return 'OBESIDADE_II';
    return 'OBESIDADE_III';
  }

  classificarPercentualGordura(percentual: number, genero: 'MASCULINO' | 'FEMININO'): string {
    if (genero === 'MASCULINO') {
      if (percentual < 6) return 'MUITO_BAIXO';
      if (percentual < 14) return 'BAIXO';
      if (percentual < 18) return 'NORMAL';
      if (percentual < 25) return 'ALTO';
      return 'MUITO_ALTO';
    } else {
      if (percentual < 16) return 'MUITO_BAIXO';
      if (percentual < 21) return 'BAIXO';
      if (percentual < 25) return 'NORMAL';
      if (percentual < 32) return 'ALTO';
      return 'MUITO_ALTO';
    }
  }
}

export const avaliacaoFisicaService = new AvaliacaoFisicaService();