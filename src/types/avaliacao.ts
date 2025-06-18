export interface AvaliacaoFisica {
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
  dataAvaliacao: string;
  tipo: 'INICIAL' | 'REAVALIACAO' | 'CONTROLE';
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
  
  // Dados Antropométricos
  peso: number;
  altura: number;
  imc: number;
  
  // Circunferências (em cm)
  circunferencias: {
    pescoco: number;
    ombro: number;
    braco_relaxado: number;
    braco_contraido: number;
    antebraco: number;
    punho: number;
    peitoral: number;
    cintura: number;
    abdomen: number;
    quadril: number;
    coxa_proximal: number;
    coxa_medial: number;
    coxa_distal: number;
    panturrilha: number;
    tornozelo: number;
  };
  
  // Composição Corporal
  composicaoCorporal: {
    percentualGordura: number;
    massaGorda: number;
    massaMagra: number;
    massaMuscular: number;
    aguaCorporal: number;
    massaOssea: number;
    taxaMetabolica: number;
  };
  
  // Dobras Cutâneas (em mm)
  dobrasCutaneas?: {
    triceps: number;
    biceps: number;
    subescapular: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
    panturrilha: number;
  };
  
  // Testes Físicos
  testesFisicos: {
    flexibilidade: {
      sentar_alcancar: number; // cm
      flexao_ombro: number; // graus
      observacoes?: string;
    };
    forca: {
      preensao_manual_direita: number; // kg
      preensao_manual_esquerda: number; // kg
      flexao_braco: number; // repetições
      abdominal: number; // repetições
      observacoes?: string;
    };
    resistencia: {
      vo2_max?: number; // ml/kg/min
      frequencia_cardiaca_repouso: number; // bpm
      frequencia_cardiaca_maxima?: number; // bpm
      teste_cooper?: number; // metros
      observacoes?: string;
    };
  };
  
  // Pressão Arterial
  pressaoArterial: {
    sistolica: number;
    diastolica: number;
    frequencia_cardiaca: number;
  };
  
  // Anamnese
  anamnese: {
    objetivo_principal: string;
    historico_lesoes: string;
    medicamentos: string;
    restricoes_medicas: string;
    nivel_atividade: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | 'MUITO_INTENSO';
    frequencia_exercicio: number; // vezes por semana
    tempo_exercicio: number; // minutos por sessão
    modalidades_preferidas: string[];
    observacoes_gerais: string;
  };
  
  // Fotos
  fotos: {
    frente?: string;
    perfil_direito?: string;
    perfil_esquerdo?: string;
    costas?: string;
    observacoes?: string;
  };
  
  // Resultados e Observações
  resultados: {
    classificacao_imc: 'ABAIXO_PESO' | 'PESO_NORMAL' | 'SOBREPESO' | 'OBESIDADE_I' | 'OBESIDADE_II' | 'OBESIDADE_III';
    classificacao_gordura: 'MUITO_BAIXO' | 'BAIXO' | 'NORMAL' | 'ALTO' | 'MUITO_ALTO';
    pontos_fortes: string[];
    pontos_melhoria: string[];
    recomendacoes: string[];
  };
  
  observacoes?: string;
  proximaAvaliacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComparativoAvaliacoes {
  avaliacaoAnterior: AvaliacaoFisica;
  avaliacaoAtual: AvaliacaoFisica;
  diferencas: {
    peso: number;
    percentualGordura: number;
    massaMagra: number;
    imc: number;
    circunferencias: Record<string, number>;
  };
  evolucao: 'POSITIVA' | 'NEGATIVA' | 'ESTAVEL';
}

export interface RelatorioAvaliacao {
  avaliacao: AvaliacaoFisica;
  comparativo?: ComparativoAvaliacoes;
  graficos: {
    evolucaoPeso: Array<{ data: string; valor: number }>;
    evolucaoGordura: Array<{ data: string; valor: number }>;
    evolucaoMassaMagra: Array<{ data: string; valor: number }>;
  };
}