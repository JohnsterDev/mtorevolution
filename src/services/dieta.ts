import { 
  Alimento, 
  PlanoAlimentar, 
  DiaAlimentar, 
  Receita, 
  TemplateRefeicao,
  RegistroProgresso,
  RelatorioNutricional,
  PlanoSuplementacao,
  PaginatedResponse 
} from '../types/dieta';

class DietaService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Mock data para demonstração
  private mockAlimentos: Alimento[] = [
    {
      id: '1',
      nome: 'Peito de Frango Grelhado',
      categoria: 'Proteínas',
      marca: 'Sadia',
      porcaoPadrao: 100,
      unidadePadrao: 'g',
      calorias: 165,
      macronutrientes: {
        proteinas: 31,
        carboidratos: 0,
        gorduras: 3.6,
        fibras: 0,
        acucares: 0
      },
      micronutrientes: {
        sodio: 74,
        potassio: 256,
        calcio: 15,
        ferro: 1.04,
        vitaminaC: 0,
        vitaminaD: 0.1
      },
      alergenos: [],
      vegetariano: false,
      vegano: false,
      semGluten: true,
      semLactose: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      nome: 'Arroz Integral Cozido',
      categoria: 'Carboidratos',
      porcaoPadrao: 100,
      unidadePadrao: 'g',
      calorias: 111,
      macronutrientes: {
        proteinas: 2.6,
        carboidratos: 22,
        gorduras: 0.9,
        fibras: 1.8,
        acucares: 0.4
      },
      micronutrientes: {
        sodio: 5,
        potassio: 43,
        calcio: 10,
        ferro: 0.4,
        vitaminaC: 0,
        vitaminaD: 0
      },
      alergenos: [],
      vegetariano: true,
      vegano: true,
      semGluten: true,
      semLactose: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      nome: 'Brócolis Refogado',
      categoria: 'Vegetais',
      porcaoPadrao: 100,
      unidadePadrao: 'g',
      calorias: 34,
      macronutrientes: {
        proteinas: 2.8,
        carboidratos: 7,
        gorduras: 0.4,
        fibras: 2.6,
        acucares: 1.5
      },
      micronutrientes: {
        sodio: 33,
        potassio: 316,
        calcio: 47,
        ferro: 0.73,
        vitaminaC: 89.2,
        vitaminaD: 0
      },
      alergenos: [],
      vegetariano: true,
      vegano: true,
      semGluten: true,
      semLactose: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private mockPlanos: PlanoAlimentar[] = [
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
      nome: 'Plano de Ganho de Massa Muscular',
      objetivo: 'GANHO_MASSA',
      dataInicio: '2024-12-01',
      dataFim: '2025-03-01',
      status: 'ATIVO',
      metasNutricionais: {
        calorias: 2800,
        proteinas: 140,
        carboidratos: 350,
        gorduras: 93,
        fibras: 35,
        agua: 3.5,
        distribuicaoMacros: {
          proteinasPercentual: 20,
          carboidratosPercentual: 50,
          gordurasPercentual: 30
        }
      },
      restricoes: {
        alergias: [],
        intolerancia: ['lactose'],
        restricoesMedicas: [],
        preferenciasAlimentares: ['sem_lactose'],
        alimentosEvitar: ['leite', 'queijo'],
        alimentosPreferidos: ['frango', 'arroz', 'batata_doce']
      },
      configuracoes: {
        numeroRefeicoes: 6,
        intervaloRefeicoes: 3,
        horariosPredefinidos: true,
        permitirSubstituicoes: true,
        considerarSazonalidade: false,
        incluirSuplemetos: true
      },
      observacoes: 'Cliente com objetivo de ganho de massa muscular, treina 5x por semana',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Alimentos
  async getAlimentos(page = 0, size = 20, search?: string, categoria?: string): Promise<PaginatedResponse<Alimento>> {
    await this.delay(300);
    
    let alimentos = [...this.mockAlimentos];
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      alimentos = alimentos.filter(a => 
        a.nome.toLowerCase().includes(searchLower) ||
        a.categoria.toLowerCase().includes(searchLower) ||
        a.marca?.toLowerCase().includes(searchLower)
      );
    }

    if (categoria && categoria !== 'TODAS') {
      alimentos = alimentos.filter(a => a.categoria === categoria);
    }

    const start = page * size;
    const end = start + size;
    const content = alimentos.slice(start, end);

    return {
      content,
      totalElements: alimentos.length,
      totalPages: Math.ceil(alimentos.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= alimentos.length
    };
  }

  async getAlimentoById(id: string): Promise<Alimento> {
    await this.delay(200);
    const alimento = this.mockAlimentos.find(a => a.id === id);
    if (!alimento) throw new Error('Alimento não encontrado');
    return alimento;
  }

  async getAlimentoByCodigoBarras(codigo: string): Promise<Alimento | null> {
    await this.delay(500);
    return this.mockAlimentos.find(a => a.codigoBarras === codigo) || null;
  }

  async createAlimento(alimento: Omit<Alimento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alimento> {
    await this.delay(500);
    const newAlimento: Alimento = {
      ...alimento,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockAlimentos.push(newAlimento);
    return newAlimento;
  }

  // Planos Alimentares
  async getPlanos(page = 0, size = 10, clienteId?: string): Promise<PaginatedResponse<PlanoAlimentar>> {
    await this.delay(400);
    
    let planos = [...this.mockPlanos];
    
    if (clienteId) {
      planos = planos.filter(p => p.clienteId === clienteId);
    }

    const start = page * size;
    const end = start + size;
    const content = planos.slice(start, end);

    return {
      content,
      totalElements: planos.length,
      totalPages: Math.ceil(planos.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= planos.length
    };
  }

  async getPlanoById(id: string): Promise<PlanoAlimentar> {
    await this.delay(300);
    const plano = this.mockPlanos.find(p => p.id === id);
    if (!plano) throw new Error('Plano não encontrado');
    return plano;
  }

  async createPlano(plano: Omit<PlanoAlimentar, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlanoAlimentar> {
    await this.delay(600);
    const newPlano: PlanoAlimentar = {
      ...plano,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockPlanos.push(newPlano);
    return newPlano;
  }

  async updatePlano(id: string, plano: Partial<PlanoAlimentar>): Promise<PlanoAlimentar> {
    await this.delay(500);
    const index = this.mockPlanos.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Plano não encontrado');
    
    this.mockPlanos[index] = {
      ...this.mockPlanos[index],
      ...plano,
      updatedAt: new Date().toISOString()
    };
    
    return this.mockPlanos[index];
  }

  // Dias Alimentares
  async getDiaAlimentar(planoId: string, data: string): Promise<DiaAlimentar | null> {
    await this.delay(300);
    // Mock implementation
    return null;
  }

  async saveDiaAlimentar(diaAlimentar: Omit<DiaAlimentar, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaAlimentar> {
    await this.delay(500);
    return {
      ...diaAlimentar,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Receitas
  async getReceitas(page = 0, size = 12, search?: string, categoria?: string): Promise<PaginatedResponse<Receita>> {
    await this.delay(400);
    // Mock implementation
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size,
      number: page,
      first: true,
      last: true
    };
  }

  async getReceitaById(id: string): Promise<Receita> {
    await this.delay(300);
    throw new Error('Receita não encontrada');
  }

  async createReceita(receita: Omit<Receita, 'id' | 'createdAt' | 'updatedAt'>): Promise<Receita> {
    await this.delay(600);
    return {
      ...receita,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Templates
  async getTemplates(tipo?: string): Promise<TemplateRefeicao[]> {
    await this.delay(300);
    return [];
  }

  async createTemplate(template: Omit<TemplateRefeicao, 'id' | 'createdAt' | 'updatedAt'>): Promise<TemplateRefeicao> {
    await this.delay(400);
    return {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Progresso
  async getRegistrosProgresso(clienteId: string, dataInicio?: string, dataFim?: string): Promise<RegistroProgresso[]> {
    await this.delay(400);
    return [];
  }

  async saveRegistroProgresso(registro: Omit<RegistroProgresso, 'id' | 'createdAt' | 'updatedAt'>): Promise<RegistroProgresso> {
    await this.delay(500);
    return {
      ...registro,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Relatórios
  async gerarRelatorioNutricional(clienteId: string, dataInicio: string, dataFim: string): Promise<RelatorioNutricional> {
    await this.delay(1000);
    
    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      resumo: {
        diasRegistrados: 25,
        aderenciaMedia: 85,
        caloriasMedia: 2650,
        proteinasMedia: 135,
        carboidratosMedia: 320,
        gordurasMedia: 88,
        aguaMedia: 3.2
      },
      tendencias: {
        peso: [
          { data: '2024-12-01', valor: 75.5 },
          { data: '2024-12-15', valor: 76.2 },
          { data: '2024-12-30', valor: 76.8 }
        ],
        calorias: [
          { data: '2024-12-01', valor: 2600 },
          { data: '2024-12-15', valor: 2680 },
          { data: '2024-12-30', valor: 2720 }
        ],
        aderencia: [
          { data: '2024-12-01', valor: 80 },
          { data: '2024-12-15', valor: 85 },
          { data: '2024-12-30', valor: 90 }
        ]
      },
      analises: {
        pontosFortesAlimentacao: [
          'Boa aderência ao plano alimentar',
          'Consumo adequado de proteínas',
          'Hidratação dentro da meta'
        ],
        pontosMelhoriaAlimentacao: [
          'Aumentar consumo de fibras',
          'Melhorar distribuição de carboidratos',
          'Incluir mais vegetais nas refeições'
        ],
        recomendacoes: [
          'Incluir 2 porções extras de vegetais por dia',
          'Consumir carboidratos complexos no pré-treino',
          'Manter regularidade nos horários das refeições'
        ],
        alertas: []
      },
      comparativoMetas: {
        calorias: { meta: 2800, real: 2650, diferenca: -150 },
        proteinas: { meta: 140, real: 135, diferenca: -5 },
        carboidratos: { meta: 350, real: 320, diferenca: -30 },
        gorduras: { meta: 93, real: 88, diferenca: -5 }
      }
    };
  }

  // Utilitários
  async calcularInformacoesNutricionais(itens: any[]): Promise<any> {
    await this.delay(200);
    
    let calorias = 0;
    let proteinas = 0;
    let carboidratos = 0;
    let gorduras = 0;
    let fibras = 0;

    for (const item of itens) {
      const fator = item.quantidade / 100; // Assumindo valores por 100g
      calorias += item.alimento.calorias * fator;
      proteinas += item.alimento.macronutrientes.proteinas * fator;
      carboidratos += item.alimento.macronutrientes.carboidratos * fator;
      gorduras += item.alimento.macronutrientes.gorduras * fator;
      fibras += item.alimento.macronutrientes.fibras * fator;
    }

    return {
      calorias: Math.round(calorias),
      proteinas: Math.round(proteinas * 10) / 10,
      carboidratos: Math.round(carboidratos * 10) / 10,
      gorduras: Math.round(gorduras * 10) / 10,
      fibras: Math.round(fibras * 10) / 10
    };
  }

  async exportarPlano(planoId: string, formato: 'PDF' | 'EXCEL'): Promise<Blob> {
    await this.delay(1500);
    return new Blob(['Mock export content'], { 
      type: formato === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  async importarAlimentos(arquivo: File): Promise<{ sucesso: number; erros: string[] }> {
    await this.delay(2000);
    return {
      sucesso: 150,
      erros: ['Linha 25: Alimento duplicado', 'Linha 67: Informação nutricional inválida']
    };
  }

  // Suplementação
  async getPlanosSuplementacao(clienteId: string): Promise<PlanoSuplementacao[]> {
    await this.delay(300);
    return [];
  }

  async createPlanoSuplementacao(plano: Omit<PlanoSuplementacao, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlanoSuplementacao> {
    await this.delay(500);
    return {
      ...plano,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Estatísticas
  async getStats(): Promise<{
    totalPlanos: number;
    planosAtivos: number;
    totalReceitas: number;
    totalAlimentos: number;
    aderenciaMedia: number;
  }> {
    await this.delay(300);
    
    return {
      totalPlanos: this.mockPlanos.length,
      planosAtivos: this.mockPlanos.filter(p => p.status === 'ATIVO').length,
      totalReceitas: 45,
      totalAlimentos: this.mockAlimentos.length,
      aderenciaMedia: 87
    };
  }
}

export const dietaService = new DietaService();