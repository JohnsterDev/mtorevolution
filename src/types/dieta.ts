export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  marca?: string;
  codigoBarras?: string;
  porcaoPadrao: number;
  unidadePadrao: string;
  calorias: number; // por 100g
  macronutrientes: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    fibras: number;
    acucares: number;
  };
  micronutrientes: {
    sodio: number;
    potassio: number;
    calcio: number;
    ferro: number;
    vitaminaC: number;
    vitaminaD: number;
  };
  indiceGlicemico?: number;
  alergenos: string[];
  vegetariano: boolean;
  vegano: boolean;
  semGluten: boolean;
  semLactose: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemRefeicao {
  id: string;
  alimentoId: string;
  alimento: Alimento;
  quantidade: number;
  unidade: string;
  observacoes?: string;
}

export interface Refeicao {
  id: string;
  nome: string;
  tipo: 'CAFE_MANHA' | 'LANCHE_MANHA' | 'ALMOCO' | 'LANCHE_TARDE' | 'JANTAR' | 'CEIA' | 'PRE_TREINO' | 'POS_TREINO';
  horario: string;
  itens: ItemRefeicao[];
  observacoes?: string;
  preparoMinutos?: number;
  dificuldade?: 'FACIL' | 'MEDIO' | 'DIFICIL';
}

export interface PlanoAlimentar {
  id: string;
  clienteId: string;
  cliente?: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    genero: 'MASCULINO' | 'FEMININO';
  };
  nome: string;
  objetivo: 'PERDA_PESO' | 'GANHO_PESO' | 'MANUTENCAO' | 'GANHO_MASSA' | 'DEFINICAO' | 'PERFORMANCE';
  dataInicio: string;
  dataFim?: string;
  status: 'ATIVO' | 'INATIVO' | 'PAUSADO' | 'CONCLUIDO';
  
  // Metas nutricionais
  metasNutricionais: {
    calorias: number;
    proteinas: number; // gramas
    carboidratos: number; // gramas
    gorduras: number; // gramas
    fibras: number; // gramas
    agua: number; // litros
    distribuicaoMacros: {
      proteinasPercentual: number;
      carboidratosPercentual: number;
      gordurasPercentual: number;
    };
  };
  
  // Restrições e preferências
  restricoes: {
    alergias: string[];
    intolerancia: string[];
    restricoesMedicas: string[];
    preferenciasAlimentares: string[];
    alimentosEvitar: string[];
    alimentosPreferidos: string[];
  };
  
  // Configurações
  configuracoes: {
    numeroRefeicoes: number;
    intervaloRefeicoes: number; // horas
    horariosPredefinidos: boolean;
    permitirSubstituicoes: boolean;
    considerarSazonalidade: boolean;
    incluirSuplemetos: boolean;
  };
  
  observacoes?: string;
  observacoesNutricionista?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaAlimentar {
  id: string;
  planoAlimentarId: string;
  data: string;
  refeicoes: Refeicao[];
  aguaConsumida: number; // litros
  observacoes?: string;
  aderencia: number; // 0-100%
  humor?: 'OTIMO' | 'BOM' | 'REGULAR' | 'RUIM' | 'PESSIMO';
  energia?: 'ALTA' | 'MEDIA' | 'BAIXA';
  sintomas?: string[];
  pesoRegistrado?: number;
  fotoProgresso?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Receita {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  tempoPreparo: number; // minutos
  tempoCozimento: number; // minutos
  porcoes: number;
  dificuldade: 'FACIL' | 'MEDIO' | 'DIFICIL';
  
  ingredientes: ItemRefeicao[];
  modoPreparo: string[];
  dicas?: string[];
  
  // Informações nutricionais (calculadas)
  informacoesNutricionais: {
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    fibras: number;
  };
  
  tags: string[];
  foto?: string;
  video?: string;
  
  // Classificações
  vegetariana: boolean;
  vegana: boolean;
  semGluten: boolean;
  semLactose: boolean;
  lowCarb: boolean;
  cetogenica: boolean;
  
  avaliacoes: {
    media: number;
    total: number;
  };
  
  autorId: string;
  publica: boolean;
  aprovada: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRefeicao {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'CAFE_MANHA' | 'LANCHE_MANHA' | 'ALMOCO' | 'LANCHE_TARDE' | 'JANTAR' | 'CEIA' | 'PRE_TREINO' | 'POS_TREINO';
  refeicao: Omit<Refeicao, 'id'>;
  tags: string[];
  publico: boolean;
  autorId: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegistroProgresso {
  id: string;
  clienteId: string;
  data: string;
  peso?: number;
  percentualGordura?: number;
  massaMuscular?: number;
  circunferencias?: {
    cintura: number;
    quadril: number;
    braco: number;
    coxa: number;
  };
  fotos?: {
    frente?: string;
    perfil?: string;
    costas?: string;
  };
  observacoes?: string;
  humor: 'OTIMO' | 'BOM' | 'REGULAR' | 'RUIM' | 'PESSIMO';
  energia: 'ALTA' | 'MEDIA' | 'BAIXA';
  qualidadeSono: 'OTIMA' | 'BOA' | 'REGULAR' | 'RUIM' | 'PESSIMA';
  nivelEstresse: number; // 1-10
  sintomas: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RelatorioNutricional {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumo: {
    diasRegistrados: number;
    aderenciaMedia: number;
    caloriasMedia: number;
    proteinasMedia: number;
    carboidratosMedia: number;
    gordurasMedia: number;
    aguaMedia: number;
  };
  tendencias: {
    peso: Array<{ data: string; valor: number }>;
    calorias: Array<{ data: string; valor: number }>;
    aderencia: Array<{ data: string; valor: number }>;
  };
  analises: {
    pontosFortesAlimentacao: string[];
  pontosMelhoriaAlimentacao: string[];
    recomendacoes: string[];
    alertas: string[];
  };
  comparativoMetas: {
    calorias: { meta: number; real: number; diferenca: number };
    proteinas: { meta: number; real: number; diferenca: number };
    carboidratos: { meta: number; real: number; diferenca: number };
    gorduras: { meta: number; real: number; diferenca: number };
  };
}

export interface Suplemento {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  dosagem: string;
  unidade: string;
  instrucoes: string;
  horarios: string[];
  observacoes?: string;
  ativo: boolean;
}

export interface PlanoSuplementacao {
  id: string;
  clienteId: string;
  nome: string;
  objetivo: string;
  dataInicio: string;
  dataFim?: string;
  suplementos: Suplemento[];
  observacoes?: string;
  status: 'ATIVO' | 'INATIVO' | 'PAUSADO';
  createdAt: string;
  updatedAt: string;
}

export interface ConfiguracaoNotificacao {
  id: string;
  clienteId: string;
  lembreteRefeicoes: boolean;
  horarioLembretes: string[];
  lembreteAgua: boolean;
  intervalosAgua: number; // minutos
  lembreteSuplemetos: boolean;
  notificacaoProgresso: boolean;
  frequenciaProgresso: 'DIARIA' | 'SEMANAL' | 'MENSAL';
  ativa: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}