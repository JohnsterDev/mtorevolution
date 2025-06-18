export interface Exame {
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
  tipoExame: TipoExame;
  categoria: CategoriaExame;
  laboratorio: Laboratorio;
  medicoSolicitante: string;
  dataColeta: string;
  dataResultado?: string;
  status: StatusExame;
  prioridade: PrioridadeExame;
  resultados: ResultadoExame[];
  arquivos: ArquivoExame[];
  observacoes?: string;
  observacoesMedicas?: string;
  valoresReferencia: ValorReferencia[];
  alertas: AlertaExame[];
  proximoExame?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TipoExame {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  descricao: string;
  preparacao?: string;
  jejum?: number; // horas
  restricoes?: string[];
  valoresNormais?: Record<string, any>;
}

export interface CategoriaExame {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  descricao: string;
}

export interface Laboratorio {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  website?: string;
  credenciamento: string[];
  especialidades: string[];
  tempoMedioResultado: number; // horas
}

export interface ResultadoExame {
  id: string;
  parametro: string;
  valor: string | number;
  unidade: string;
  valorReferencia: string;
  status: 'NORMAL' | 'ALTERADO' | 'CRITICO';
  observacao?: string;
}

export interface ArquivoExame {
  id: string;
  nome: string;
  tipo: 'PDF' | 'IMAGEM' | 'DICOM' | 'DOCUMENTO';
  url: string;
  tamanho: number;
  dataUpload: string;
  checksum: string;
  criptografado: boolean;
}

export interface ValorReferencia {
  parametro: string;
  genero?: 'MASCULINO' | 'FEMININO';
  idadeMin?: number;
  idadeMax?: number;
  valorMin?: number;
  valorMax?: number;
  valorTexto?: string;
  unidade: string;
  observacao?: string;
}

export interface AlertaExame {
  id: string;
  tipo: 'CRITICO' | 'ALTERADO' | 'ATENCAO';
  parametro: string;
  valor: string | number;
  mensagem: string;
  dataAlerta: string;
  visualizado: boolean;
  acao?: string;
}

export type StatusExame = 
  | 'SOLICITADO'
  | 'AGENDADO'
  | 'COLETADO'
  | 'PROCESSANDO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'REAGENDADO';

export type PrioridadeExame = 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export interface ComparativoExames {
  exameAnterior: Exame;
  exameAtual: Exame;
  diferencas: DiferencaParametro[];
  tendencia: 'MELHORA' | 'PIORA' | 'ESTAVEL';
  alertas: string[];
}

export interface DiferencaParametro {
  parametro: string;
  valorAnterior: string | number;
  valorAtual: string | number;
  diferenca: number;
  percentual: number;
  significativo: boolean;
  tendencia: 'SUBIU' | 'DESCEU' | 'ESTAVEL';
}

export interface RelatorioExame {
  exame: Exame;
  historico: Exame[];
  comparativo?: ComparativoExames;
  graficos: GraficoEvolutivo[];
  recomendacoes: string[];
}

export interface GraficoEvolutivo {
  parametro: string;
  dados: Array<{
    data: string;
    valor: number;
    status: 'NORMAL' | 'ALTERADO' | 'CRITICO';
  }>;
  tendencia: 'CRESCENTE' | 'DECRESCENTE' | 'ESTAVEL';
}

export interface ModeloExame {
  id: string;
  nome: string;
  categoria: string;
  parametros: ParametroModelo[];
  instrucoes: string;
  preparacao: string;
  observacoes?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParametroModelo {
  nome: string;
  tipo: 'NUMERICO' | 'TEXTO' | 'SELECAO' | 'BOOLEANO';
  unidade?: string;
  obrigatorio: boolean;
  valorPadrao?: string | number;
  opcoes?: string[];
  validacao?: {
    min?: number;
    max?: number;
    regex?: string;
  };
}

export interface NotificacaoExame {
  id: string;
  exameId: string;
  clienteId: string;
  tipo: 'RESULTADO_DISPONIVEL' | 'VALOR_ALTERADO' | 'EXAME_AGENDADO' | 'LEMBRETE_COLETA';
  titulo: string;
  mensagem: string;
  dataEnvio: string;
  lida: boolean;
  canais: ('EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP')[];
}

export interface IntegracaoLaboratorio {
  id: string;
  laboratorioId: string;
  tipo: 'HL7' | 'FHIR' | 'API_REST' | 'MANUAL';
  configuracao: Record<string, any>;
  ativo: boolean;
  ultimaSincronizacao?: string;
  status: 'CONECTADO' | 'DESCONECTADO' | 'ERRO';
}

export interface AuditExame {
  id: string;
  exameId: string;
  acao: 'CRIADO' | 'ATUALIZADO' | 'VISUALIZADO' | 'EXCLUIDO' | 'EXPORTADO';
  usuario: string;
  dataAcao: string;
  detalhes: Record<string, any>;
  ip: string;
  userAgent: string;
}