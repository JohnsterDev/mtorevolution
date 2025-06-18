import { mockApiService } from './mockApi';

interface DashboardStats {
  totalClientes: number;
  clientesAtivos: number;
  avaliacoesRecentes: number;
  treinosAtivos: number;
  dietasAtivas: number;
  protocolosAtivos: number;
}

interface PerformanceData {
  month: string;
  peso: number;
  gordura: number;
  massa: number;
}

interface WorkoutData {
  day: string;
  treinos: number;
  calorias: number;
}

interface ActivityData {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
  clienteNome?: string;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clientes = await mockApiService.getClientes(0, 1000);
    const protocolos = await mockApiService.getProtocolos(0, 1000);
    
    return {
      totalClientes: clientes.totalElements,
      clientesAtivos: clientes.content.filter(c => c.status === 'ATIVO').length,
      avaliacoesRecentes: Math.floor(clientes.totalElements * 0.3), // 30% have recent evaluations
      treinosAtivos: Math.floor(clientes.totalElements * 0.8), // 80% have active workouts
      dietasAtivas: Math.floor(clientes.totalElements * 0.9), // 90% have active diets
      protocolosAtivos: protocolos.content.filter(p => p.status === 'ATIVO').length,
    };
  }

  async getPerformanceData(clienteId?: string, months = 6): Promise<PerformanceData[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock performance data
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return monthNames.map((month, index) => ({
      month,
      peso: 75 - index * 0.8, // Gradual weight loss
      gordura: 12 - index * 0.3, // Gradual fat loss
      massa: 63 - index * 0.1, // Slight muscle loss (normal during cut)
    }));
  }

  async getWorkoutData(clienteId?: string, days = 7): Promise<WorkoutData[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock workout data for the week
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    return dayNames.map((day, index) => ({
      day,
      treinos: index === 6 ? 0 : Math.floor(Math.random() * 2) + 1, // Sunday rest
      calorias: index === 6 ? 0 : Math.floor(Math.random() * 200) + 300,
    }));
  }

  async getRecentActivities(limit = 10): Promise<ActivityData[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock recent activities
    const activities = [
      {
        id: '1',
        tipo: 'avaliacao',
        descricao: 'Nova avaliação física registrada',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        clienteNome: 'João Silva'
      },
      {
        id: '2',
        tipo: 'treino',
        descricao: 'Treino de força completado',
        data: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        clienteNome: 'Maria Santos'
      },
      {
        id: '3',
        tipo: 'dieta',
        descricao: 'Nova dieta criada',
        data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        clienteNome: 'Pedro Oliveira'
      },
      {
        id: '4',
        tipo: 'cliente',
        descricao: 'Novo cliente cadastrado',
        data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        clienteNome: 'Ana Costa'
      },
    ];
    
    return activities.slice(0, limit);
  }

  async getProgressData(clienteId?: string): Promise<{
    forca: number;
    resistencia: number;
    flexibilidade: number;
    composicao: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock progress data
    return {
      forca: 85,
      resistencia: 72,
      flexibilidade: 68,
      composicao: 91,
    };
  }

  async getClienteOverview(clienteId: string): Promise<{
    ultimaAvaliacao: string;
    proximoTreino: string;
    dietaAtual: string;
    protocoloAtivo: string;
    evolucaoUltimoMes: {
      peso: number;
      gordura: number;
      massa: number;
    };
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock client overview
    return {
      ultimaAvaliacao: '15/12/2024',
      proximoTreino: 'Treino A - Peito e Tríceps',
      dietaAtual: 'Dieta de Definição - 2000 kcal',
      protocoloAtivo: 'Hipertrofia Intermediária',
      evolucaoUltimoMes: {
        peso: -1.2, // kg
        gordura: -0.8, // %
        massa: 0.3, // kg
      },
    };
  }
}

export const dashboardService = new DashboardService();