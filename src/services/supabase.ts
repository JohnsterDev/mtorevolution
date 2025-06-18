import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types (generated from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          role: 'ADMIN' | 'COACH' | 'CLIENTE';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          role: 'ADMIN' | 'COACH' | 'CLIENTE';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          role?: 'ADMIN' | 'COACH' | 'CLIENTE';
          created_at?: string;
          updated_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          nome: string;
          email: string;
          telefone: string;
          data_nascimento: string;
          genero: 'MASCULINO' | 'FEMININO';
          modalidade: string;
          objetivo: string;
          status: 'ATIVO' | 'INATIVO';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          telefone: string;
          data_nascimento: string;
          genero: 'MASCULINO' | 'FEMININO';
          modalidade: string;
          objetivo: string;
          status?: 'ATIVO' | 'INATIVO';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          telefone?: string;
          data_nascimento?: string;
          genero?: 'MASCULINO' | 'FEMININO';
          modalidade?: string;
          objetivo?: string;
          status?: 'ATIVO' | 'INATIVO';
          created_at?: string;
          updated_at?: string;
        };
      };
      protocolos: {
        Row: {
          id: string;
          nome: string;
          descricao: string;
          tipo: 'PRE_DEFINIDO' | 'PERSONALIZADO';
          nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
          duracao_semanas: number;
          objetivo: string;
          observacoes: string | null;
          exercicios: any;
          anexos: string[];
          links: string[];
          status: 'ATIVO' | 'INATIVO';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao: string;
          tipo: 'PRE_DEFINIDO' | 'PERSONALIZADO';
          nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
          duracao_semanas: number;
          objetivo: string;
          observacoes?: string | null;
          exercicios?: any;
          anexos?: string[];
          links?: string[];
          status?: 'ATIVO' | 'INATIVO';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string;
          tipo?: 'PRE_DEFINIDO' | 'PERSONALIZADO';
          nivel?: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
          duracao_semanas?: number;
          objetivo?: string;
          observacoes?: string | null;
          exercicios?: any;
          anexos?: string[];
          links?: string[];
          status?: 'ATIVO' | 'INATIVO';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}