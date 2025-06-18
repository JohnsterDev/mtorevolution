import { 
  Exame, 
  TipoExame, 
  Laboratorio, 
  ModeloExame, 
  ComparativoExames, 
  RelatorioExame,
  NotificacaoExame,
  PaginatedResponse 
} from '../types/exame';

class ExameService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Mock data para demonstração
  private mockExames: Exame[] = [
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
      tipoExame: {
        id: '1',
        nome: 'Hemograma Completo',
        codigo: 'HEM001',
        categoria: 'Hematologia',
        descricao: 'Análise completa dos elementos sanguíneos',
        preparacao: 'Jejum de 8 horas',
        jejum: 8,
        restricoes: ['Não consumir álcool 24h antes'],
        valoresNormais: {}
      },
      categoria: {
        id: '1',
        nome: 'Hematologia',
        cor: '#ef4444',
        icone: 'droplet',
        descricao: 'Exames relacionados ao sangue'
      },
      laboratorio: {
        id: '1',
        nome: 'Laboratório Central',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Análises, 123',
        telefone: '(11) 3333-4444',
        email: 'contato@labcentral.com.br',
        website: 'https://labcentral.com.br',
        credenciamento: ['ANVISA', 'SBPC'],
        especialidades: ['Hematologia', 'Bioquímica', 'Microbiologia'],
        tempoMedioResultado: 24
      },
      medicoSolicitante: 'Dr. Carlos Medeiros - CRM 123456',
      dataColeta: '2024-12-15T08:00:00Z',
      dataResultado: '2024-12-16T14:30:00Z',
      status: 'CONCLUIDO',
      prioridade: 'NORMAL',
      resultados: [
        {
          id: '1',
          parametro: 'Hemoglobina',
          valor: 14.2,
          unidade: 'g/dL',
          valorReferencia: '12.0 - 16.0',
          status: 'NORMAL'
        },
        {
          id: '2',
          parametro: 'Hematócrito',
          valor: 42.5,
          unidade: '%',
          valorReferencia: '36.0 - 48.0',
          status: 'NORMAL'
        },
        {
          id: '3',
          parametro: 'Leucócitos',
          valor: 12500,
          unidade: '/mm³',
          valorReferencia: '4000 - 11000',
          status: 'ALTERADO',
          observacao: 'Valor ligeiramente elevado'
        }
      ],
      arquivos: [
        {
          id: '1',
          nome: 'hemograma_joao_silva_20241215.pdf',
          tipo: 'PDF',
          url: 'https://mock-storage.com/exames/1/resultado.pdf',
          tamanho: 245760,
          dataUpload: '2024-12-16T14:30:00Z',
          checksum: 'sha256:abc123...',
          criptografado: true
        }
      ],
      observacoes: 'Paciente em acompanhamento pós-cirúrgico',
      observacoesMedicas: 'Leucocitose leve, compatível com processo inflamatório pós-operatório',
      valoresReferencia: [],
      alertas: [
        {
          id: '1',
          tipo: 'ALTERADO',
          parametro: 'Leucócitos',
          valor: 12500,
          mensagem: 'Leucócitos acima do valor de referência',
          dataAlerta: '2024-12-16T14:30:00Z',
          visualizado: false,
          acao: 'Acompanhar evolução'
        }
      ],
      proximoExame: '2025-01-15',
      createdAt: '2024-12-15T08:00:00Z',
      updatedAt: '2024-12-16T14:30:00Z'
    }
  ];

  private mockTiposExame: TipoExame[] = [
    {
      id: '1',
      nome: 'Hemograma Completo',
      codigo: 'HEM001',
      categoria: 'Hematologia',
      descricao: 'Análise completa dos elementos sanguíneos',
      preparacao: 'Jejum de 8 horas',
      jejum: 8,
      restricoes: ['Não consumir álcool 24h antes']
    },
    {
      id: '2',
      nome: 'Glicemia de Jejum',
      codigo: 'BIO001',
      categoria: 'Bioquímica',
      descricao: 'Dosagem de glicose no sangue',
      preparacao: 'Jejum de 12 horas',
      jejum: 12,
      restricoes: ['Não consumir açúcar 24h antes']
    },
    {
      id: '3',
      nome: 'Perfil Lipídico',
      codigo: 'BIO002',
      categoria: 'Bioquímica',
      descricao: 'Análise de colesterol e triglicérides',
      preparacao: 'Jejum de 12 horas',
      jejum: 12,
      restricoes: ['Dieta leve no dia anterior']
    }
  ];

  private mockLaboratorios: Laboratorio[] = [
    {
      id: '1',
      nome: 'Laboratório Central',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua das Análises, 123',
      telefone: '(11) 3333-4444',
      email: 'contato@labcentral.com.br',
      website: 'https://labcentral.com.br',
      credenciamento: ['ANVISA', 'SBPC'],
      especialidades: ['Hematologia', 'Bioquímica', 'Microbiologia'],
      tempoMedioResultado: 24
    },
    {
      id: '2',
      nome: 'Lab Express',
      cnpj: '98.765.432/0001-10',
      endereco: 'Av. Rápida, 456',
      telefone: '(11) 5555-6666',
      email: 'contato@labexpress.com.br',
      credenciamento: ['ANVISA'],
      especialidades: ['Bioquímica', 'Hormônios'],
      tempoMedioResultado: 12
    }
  ];

  async getAll(
    page = 0, 
    size = 10, 
    clienteId?: string, 
    search?: string,
    status?: string,
    categoria?: string,
    dataInicio?: string,
    dataFim?: string
  ): Promise<PaginatedResponse<Exame>> {
    await this.delay(500);
    
    let exames = [...this.mockExames];
    
    // Filtros
    if (clienteId) {
      exames = exames.filter(e => e.clienteId === clienteId);
    }
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      exames = exames.filter(e => 
        e.tipoExame.nome.toLowerCase().includes(searchLower) ||
        e.cliente?.nome.toLowerCase().includes(searchLower) ||
        e.laboratorio.nome.toLowerCase().includes(searchLower) ||
        e.medicoSolicitante.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'TODOS') {
      exames = exames.filter(e => e.status === status);
    }

    if (categoria && categoria !== 'TODAS') {
      exames = exames.filter(e => e.categoria.nome === categoria);
    }

    if (dataInicio) {
      exames = exames.filter(e => new Date(e.dataColeta) >= new Date(dataInicio));
    }

    if (dataFim) {
      exames = exames.filter(e => new Date(e.dataColeta) <= new Date(dataFim));
    }

    const start = page * size;
    const end = start + size;
    const content = exames.slice(start, end);

    return {
      content,
      totalElements: exames.length,
      totalPages: Math.ceil(exames.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= exames.length
    };
  }

  async getById(id: string): Promise<Exame> {
    await this.delay(300);
    
    const exame = this.mockExames.find(e => e.id === id);
    if (!exame) {
      throw new Error('Exame não encontrado');
    }
    
    return exame;
  }

  async create(exameData: Omit<Exame, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exame> {
    await this.delay(500);
    
    const newExame: Exame = {
      ...exameData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockExames.push(newExame);
    return newExame;
  }

  async update(id: string, exameData: Partial<Exame>): Promise<Exame> {
    await this.delay(500);
    
    const index = this.mockExames.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Exame não encontrado');
    }

    const updatedExame = {
      ...this.mockExames[index],
      ...exameData,
      updatedAt: new Date().toISOString(),
    };

    this.mockExames[index] = updatedExame;
    return updatedExame;
  }

  async delete(id: string): Promise<void> {
    await this.delay(300);
    
    const index = this.mockExames.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Exame não encontrado');
    }
    
    this.mockExames.splice(index, 1);
  }

  async getTiposExame(): Promise<TipoExame[]> {
    await this.delay(300);
    return this.mockTiposExame;
  }

  async getLaboratorios(): Promise<Laboratorio[]> {
    await this.delay(300);
    return this.mockLaboratorios;
  }

  async uploadArquivo(exameId: string, file: File): Promise<string> {
    await this.delay(1000);
    
    // Mock file upload with encryption
    const mockUrl = `https://encrypted-storage.com/exames/${exameId}/${file.name}`;
    
    // Update exam with new file
    const exame = await this.getById(exameId);
    const newFile = {
      id: Date.now().toString(),
      nome: file.name,
      tipo: this.getFileType(file.name),
      url: mockUrl,
      tamanho: file.size,
      dataUpload: new Date().toISOString(),
      checksum: `sha256:${Math.random().toString(36)}`,
      criptografado: true
    };
    
    exame.arquivos.push(newFile);
    await this.update(exameId, { arquivos: exame.arquivos });
    
    return mockUrl;
  }

  private getFileType(fileName: string): 'PDF' | 'IMAGEM' | 'DICOM' | 'DOCUMENTO' {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'PDF';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'IMAGEM';
      case 'dcm': case 'dicom': return 'DICOM';
      default: return 'DOCUMENTO';
    }
  }

  async getComparativo(exameAtualId: string, exameAnteriorId: string): Promise<ComparativoExames> {
    await this.delay(500);
    
    const exameAtual = await this.getById(exameAtualId);
    const exameAnterior = await this.getById(exameAnteriorId);

    // Mock comparison logic
    const diferencas = exameAtual.resultados.map(resultadoAtual => {
      const resultadoAnterior = exameAnterior.resultados.find(r => r.parametro === resultadoAtual.parametro);
      
      if (!resultadoAnterior) {
        return null;
      }

      const valorAtual = Number(resultadoAtual.valor);
      const valorAnterior = Number(resultadoAnterior.valor);
      const diferenca = valorAtual - valorAnterior;
      const percentual = ((diferenca / valorAnterior) * 100);

      return {
        parametro: resultadoAtual.parametro,
        valorAnterior: resultadoAnterior.valor,
        valorAtual: resultadoAtual.valor,
        diferenca,
        percentual,
        significativo: Math.abs(percentual) > 10,
        tendencia: diferenca > 0 ? 'SUBIU' : diferenca < 0 ? 'DESCEU' : 'ESTAVEL'
      };
    }).filter(Boolean) as any[];

    const tendencia = diferencas.some(d => d.significativo && d.tendencia === 'SUBIU') ? 'PIORA' :
                     diferencas.some(d => d.significativo && d.tendencia === 'DESCEU') ? 'MELHORA' : 'ESTAVEL';

    return {
      exameAnterior,
      exameAtual,
      diferencas,
      tendencia,
      alertas: diferencas.filter(d => d.significativo).map(d => `${d.parametro}: ${d.tendencia}`)
    };
  }

  async getHistorico(clienteId: string, tipoExame?: string): Promise<Exame[]> {
    await this.delay(300);
    
    let exames = this.mockExames.filter(e => e.clienteId === clienteId && e.status === 'CONCLUIDO');
    
    if (tipoExame) {
      exames = exames.filter(e => e.tipoExame.nome === tipoExame);
    }
    
    return exames.sort((a, b) => new Date(b.dataColeta).getTime() - new Date(a.dataColeta).getTime());
  }

  async generateRelatorio(exameId: string): Promise<RelatorioExame> {
    await this.delay(1000);
    
    const exame = await this.getById(exameId);
    const historico = await this.getHistorico(exame.clienteId, exame.tipoExame.nome);
    
    // Mock report generation
    const graficos = exame.resultados.map(resultado => ({
      parametro: resultado.parametro,
      dados: historico.map(h => {
        const res = h.resultados.find(r => r.parametro === resultado.parametro);
        return {
          data: h.dataColeta,
          valor: Number(res?.valor || 0),
          status: res?.status || 'NORMAL'
        };
      }),
      tendencia: 'ESTAVEL' as const
    }));

    return {
      exame,
      historico,
      graficos,
      recomendacoes: [
        'Manter acompanhamento médico regular',
        'Repetir exames conforme orientação médica',
        'Observar sinais de alteração'
      ]
    };
  }

  async exportToPdf(exameId: string): Promise<Blob> {
    await this.delay(1000);
    return new Blob(['Mock PDF content for exame ' + exameId], { type: 'application/pdf' });
  }

  async getNotificacoes(clienteId?: string): Promise<NotificacaoExame[]> {
    await this.delay(300);
    
    // Mock notifications
    return [
      {
        id: '1',
        exameId: '1',
        clienteId: '1',
        tipo: 'RESULTADO_DISPONIVEL',
        titulo: 'Resultado de Exame Disponível',
        mensagem: 'O resultado do seu Hemograma Completo já está disponível.',
        dataEnvio: new Date().toISOString(),
        lida: false,
        canais: ['EMAIL', 'PUSH']
      }
    ];
  }

  async marcarNotificacaoLida(notificacaoId: string): Promise<void> {
    await this.delay(200);
    // Mock mark as read
  }

  async getStats(): Promise<{
    total: number;
    pendentes: number;
    concluidos: number;
    alterados: number;
    criticos: number;
    proximosVencimentos: number;
  }> {
    await this.delay(300);
    
    const total = this.mockExames.length;
    const pendentes = this.mockExames.filter(e => ['SOLICITADO', 'AGENDADO', 'COLETADO', 'PROCESSANDO'].includes(e.status)).length;
    const concluidos = this.mockExames.filter(e => e.status === 'CONCLUIDO').length;
    const alterados = this.mockExames.filter(e => e.resultados.some(r => r.status === 'ALTERADO')).length;
    const criticos = this.mockExames.filter(e => e.resultados.some(r => r.status === 'CRITICO')).length;
    const proximosVencimentos = 3; // Mock

    return {
      total,
      pendentes,
      concluidos,
      alterados,
      criticos,
      proximosVencimentos
    };
  }

  // Integração com laboratórios (mock)
  async sincronizarLaboratorio(laboratorioId: string): Promise<void> {
    await this.delay(2000);
    console.log(`Sincronizando com laboratório ${laboratorioId}`);
  }

  async buscarResultadosAutomaticos(): Promise<Exame[]> {
    await this.delay(1500);
    // Mock automatic results fetching
    return [];
  }

  // Conformidade HIPAA/GDPR
  async auditarAcesso(exameId: string, acao: string): Promise<void> {
    await this.delay(100);
    console.log(`Auditoria: ${acao} no exame ${exameId}`);
  }

  async criptografarDados(dados: any): Promise<string> {
    await this.delay(200);
    // Mock encryption
    return btoa(JSON.stringify(dados));
  }

  async descriptografarDados(dadosCriptografados: string): Promise<any> {
    await this.delay(200);
    // Mock decryption
    return JSON.parse(atob(dadosCriptografados));
  }
}

export const exameService = new ExameService();