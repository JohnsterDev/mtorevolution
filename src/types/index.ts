export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'COACH' | 'CLIENTE';
  createdAt: string;
  updatedAt: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: 'MASCULINO' | 'FEMININO';
  modalidade: string;
  objetivo: string;
  status: 'ATIVO' | 'INATIVO';
  createdAt: string;
  updatedAt: string;
}

export interface AvaliacaoFisica {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  dataAvaliacao: string;
  peso: number;
  altura: number;
  percentualGordura: number;
  massaMuscular: number;
  imc: number;
  circunferencias: {
    braco: number;
    antebraco: number;
    peitoral: number;
    cintura: number;
    quadril: number;
    coxa: number;
    panturrilha: number;
  };
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exame {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  tipoExame: string;
  dataExame: string;
  laboratorio: string;
  resultados: Record<string, any>;
  observacoes?: string;
  arquivoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dieta {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  nome: string;
  objetivo: string;
  dataInicio: string;
  dataFim?: string;
  calorias: number;
  macronutrientes: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  refeicoes: Refeicao[];
  observacoes?: string;
  status: 'ATIVA' | 'INATIVA' | 'PAUSADA';
  createdAt: string;
  updatedAt: string;
}

export interface Refeicao {
  id: string;
  nome: string;
  horario: string;
  alimentos: Alimento[];
}

export interface Alimento {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

export interface Treino {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  nome: string;
  tipo: string;
  dataInicio: string;
  dataFim?: string;
  exercicios: Exercicio[];
  observacoes?: string;
  status: 'ATIVO' | 'INATIVO' | 'PAUSADO';
  createdAt: string;
  updatedAt: string;
}

export interface Exercicio {
  id: string;
  nome: string;
  grupoMuscular: string;
  series: number;
  repeticoes: string;
  carga?: number;
  descanso: number;
  observacoes?: string;
}

export interface Protocolo {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'PRE_DEFINIDO' | 'PERSONALIZADO';
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  duracaoSemanas: number;
  objetivo: string;
  observacoes?: string;
  exercicios: Exercicio[];
  anexos: string[];
  links: string[];
  status: 'ATIVO' | 'INATIVO';
  createdAt: string;
  updatedAt: string;
}

export interface CicloHormonal {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  nome: string;
  dataInicio: string;
  dataFim?: string;
  protocolo: string;
  substancias: Substancia[];
  observacoes?: string;
  status: 'ATIVO' | 'INATIVO' | 'PAUSADO';
  createdAt: string;
  updatedAt: string;
}

export interface Substancia {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  viaAdministracao: string;
  observacoes?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'COACH' | 'CLIENTE';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
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

// Backend DTO interfaces to match Java DTOs
export interface ClienteDto {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: 'MASCULINO' | 'FEMININO';
  modalidade: string;
  objetivo: string;
  status?: 'ATIVO' | 'INATIVO';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'COACH' | 'CLIENTE';
}