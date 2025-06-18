import { User, Cliente, Protocolo, AuthResponse, LoginRequest, RegisterRequest, PaginatedResponse } from '../types';

// Mock data storage using localStorage
class MockStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Users
  getUsers(): User[] {
    return this.getItem('mtor_users', this.getDefaultUsers());
  }

  setUsers(users: User[]): void {
    this.setItem('mtor_users', users);
  }

  // Clientes
  getClientes(): Cliente[] {
    return this.getItem('mtor_clientes', this.getDefaultClientes());
  }

  setClientes(clientes: Cliente[]): void {
    this.setItem('mtor_clientes', clientes);
  }

  // Protocolos
  getProtocolos(): Protocolo[] {
    return this.getItem('mtor_protocolos', this.getDefaultProtocolos());
  }

  setProtocolos(protocolos: Protocolo[]): void {
    this.setItem('mtor_protocolos', protocolos);
  }

  // Auth
  getCurrentUser(): User | null {
    return this.getItem('mtor_current_user', null);
  }

  setCurrentUser(user: User | null): void {
    this.setItem('mtor_current_user', user);
  }

  getToken(): string | null {
    return this.getItem('mtor_token', null);
  }

  setToken(token: string | null): void {
    this.setItem('mtor_token', token);
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@mtor.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Treinador Principal',
        email: 'coach@mtor.com',
        role: 'COACH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Cliente Teste',
        email: 'cliente@mtor.com',
        role: 'CLIENTE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private getDefaultClientes(): Cliente[] {
    return [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-1111',
        dataNascimento: '1990-05-15',
        genero: 'MASCULINO',
        modalidade: 'Musculação',
        objetivo: 'Ganho de massa muscular',
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria.santos@email.com',
        telefone: '(11) 99999-2222',
        dataNascimento: '1985-08-22',
        genero: 'FEMININO',
        modalidade: 'Crossfit',
        objetivo: 'Perda de peso e condicionamento',
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        telefone: '(11) 99999-3333',
        dataNascimento: '1992-12-10',
        genero: 'MASCULINO',
        modalidade: 'Natação',
        objetivo: 'Melhora da resistência cardiovascular',
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        nome: 'Ana Costa',
        email: 'ana.costa@email.com',
        telefone: '(11) 99999-4444',
        dataNascimento: '1988-03-18',
        genero: 'FEMININO',
        modalidade: 'Pilates',
        objetivo: 'Fortalecimento do core e flexibilidade',
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        nome: 'Carlos Mendes',
        email: 'carlos.mendes@email.com',
        telefone: '(11) 99999-5555',
        dataNascimento: '1995-11-07',
        genero: 'MASCULINO',
        modalidade: 'Funcional',
        objetivo: 'Condicionamento geral',
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private getDefaultProtocolos(): Protocolo[] {
    return [
      {
        id: '1',
        nome: 'Treino Iniciante - Corpo Inteiro',
        descricao: 'Protocolo completo para iniciantes focado em movimentos básicos e desenvolvimento de força base.',
        tipo: 'PRE_DEFINIDO',
        nivel: 'INICIANTE',
        duracaoSemanas: 8,
        objetivo: 'Condicionamento geral e aprendizado de movimentos',
        observacoes: 'Foque na execução correta dos movimentos',
        exercicios: [
          {
            id: '1',
            nome: 'Agachamento',
            grupoMuscular: 'PERNAS',
            series: 3,
            repeticoes: '12-15',
            carga: 0,
            descanso: 60,
            observacoes: 'Mantenha o core contraído'
          },
          {
            id: '2',
            nome: 'Flexão de braço',
            grupoMuscular: 'PEITO',
            series: 3,
            repeticoes: '8-12',
            carga: 0,
            descanso: 60,
            observacoes: 'Pode fazer apoiado nos joelhos se necessário'
          }
        ],
        anexos: [],
        links: ['https://youtube.com/watch?v=exemplo'],
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        nome: 'Hipertrofia Intermediária',
        descricao: 'Programa de hipertrofia com divisão por grupos musculares para praticantes intermediários.',
        tipo: 'PRE_DEFINIDO',
        nivel: 'INTERMEDIARIO',
        duracaoSemanas: 12,
        objetivo: 'Ganho de massa muscular',
        observacoes: 'Aumente a carga progressivamente',
        exercicios: [
          {
            id: '3',
            nome: 'Supino reto',
            grupoMuscular: 'PEITO',
            series: 4,
            repeticoes: '8-10',
            carga: 60,
            descanso: 90,
            observacoes: 'Controle a descida'
          },
          {
            id: '4',
            nome: 'Agachamento livre',
            grupoMuscular: 'PERNAS',
            series: 4,
            repeticoes: '10-12',
            carga: 80,
            descanso: 120,
            observacoes: 'Desça até 90 graus'
          }
        ],
        anexos: [],
        links: [],
        status: 'ATIVO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}

// Mock API service
class MockApiService {
  private storage = new MockStorage();
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Simulate network delay
  private async simulateDelay(): Promise<void> {
    await this.delay(Math.random() * 500 + 200); // 200-700ms delay
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await this.simulateDelay();
    
    const users = this.storage.getUsers();
    const user = users.find(u => u.email === credentials.email);
    
    // Simple password check (in real app, this would be hashed)
    const validCredentials = {
      'admin@mtor.com': 'admin123',
      'coach@mtor.com': 'coach123',
      'cliente@mtor.com': 'cliente123'
    };

    if (!user || validCredentials[credentials.email as keyof typeof validCredentials] !== credentials.password) {
      throw new Error('Email ou senha incorretos');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const refreshToken = `mock_refresh_${user.id}_${Date.now()}`;

    this.storage.setCurrentUser(user);
    this.storage.setToken(token);

    return {
      token,
      refreshToken,
      user
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await this.simulateDelay();
    
    const users = this.storage.getUsers();
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email já está em uso');
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.storage.setUsers(users);

    const token = `mock_token_${newUser.id}_${Date.now()}`;
    const refreshToken = `mock_refresh_${newUser.id}_${Date.now()}`;

    this.storage.setCurrentUser(newUser);
    this.storage.setToken(token);

    return {
      token,
      refreshToken,
      user: newUser
    };
  }

  async refreshToken(): Promise<AuthResponse> {
    await this.simulateDelay();
    
    const user = this.storage.getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const refreshToken = `mock_refresh_${user.id}_${Date.now()}`;

    this.storage.setToken(token);

    return {
      token,
      refreshToken,
      user
    };
  }

  async logout(): Promise<void> {
    await this.simulateDelay();
    this.storage.setCurrentUser(null);
    this.storage.setToken(null);
  }

  // Cliente methods
  async getClientes(page = 0, size = 10, search?: string): Promise<PaginatedResponse<Cliente>> {
    await this.simulateDelay();
    
    let clientes = this.storage.getClientes();
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      clientes = clientes.filter(c => 
        c.nome.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.modalidade.toLowerCase().includes(searchLower)
      );
    }

    const start = page * size;
    const end = start + size;
    const content = clientes.slice(start, end);

    return {
      content,
      totalElements: clientes.length,
      totalPages: Math.ceil(clientes.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= clientes.length
    };
  }

  async getClienteById(id: string): Promise<Cliente> {
    await this.simulateDelay();
    
    const clientes = this.storage.getClientes();
    const cliente = clientes.find(c => c.id === id);
    
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    
    return cliente;
  }

  async createCliente(clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    await this.simulateDelay();
    
    const clientes = this.storage.getClientes();
    
    if (clientes.find(c => c.email === clienteData.email)) {
      throw new Error('Email já está em uso');
    }

    const newCliente: Cliente = {
      ...clienteData,
      id: (clientes.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clientes.push(newCliente);
    this.storage.setClientes(clientes);

    return newCliente;
  }

  async updateCliente(id: string, clienteData: Partial<Cliente>): Promise<Cliente> {
    await this.simulateDelay();
    
    const clientes = this.storage.getClientes();
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Cliente não encontrado');
    }

    const updatedCliente = {
      ...clientes[index],
      ...clienteData,
      updatedAt: new Date().toISOString(),
    };

    clientes[index] = updatedCliente;
    this.storage.setClientes(clientes);

    return updatedCliente;
  }

  async deleteCliente(id: string): Promise<void> {
    await this.simulateDelay();
    
    const clientes = this.storage.getClientes();
    const filteredClientes = clientes.filter(c => c.id !== id);
    
    if (filteredClientes.length === clientes.length) {
      throw new Error('Cliente não encontrado');
    }
    
    this.storage.setClientes(filteredClientes);
  }

  async updateClienteStatus(id: string, status: 'ATIVO' | 'INATIVO'): Promise<Cliente> {
    return this.updateCliente(id, { status });
  }

  // Protocolo methods
  async getProtocolos(page = 0, size = 10, search?: string, tipo?: string): Promise<PaginatedResponse<Protocolo>> {
    await this.simulateDelay();
    
    let protocolos = this.storage.getProtocolos();
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      protocolos = protocolos.filter(p => 
        p.nome.toLowerCase().includes(searchLower) ||
        p.descricao.toLowerCase().includes(searchLower) ||
        p.objetivo.toLowerCase().includes(searchLower)
      );
    }

    if (tipo && tipo !== 'TODOS') {
      protocolos = protocolos.filter(p => p.tipo === tipo);
    }

    const start = page * size;
    const end = start + size;
    const content = protocolos.slice(start, end);

    return {
      content,
      totalElements: protocolos.length,
      totalPages: Math.ceil(protocolos.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= protocolos.length
    };
  }

  async getProtocoloById(id: string): Promise<Protocolo> {
    await this.simulateDelay();
    
    const protocolos = this.storage.getProtocolos();
    const protocolo = protocolos.find(p => p.id === id);
    
    if (!protocolo) {
      throw new Error('Protocolo não encontrado');
    }
    
    return protocolo;
  }

  async createProtocolo(protocoloData: Omit<Protocolo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Protocolo> {
    await this.simulateDelay();
    
    const protocolos = this.storage.getProtocolos();

    const newProtocolo: Protocolo = {
      ...protocoloData,
      id: (protocolos.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    protocolos.push(newProtocolo);
    this.storage.setProtocolos(protocolos);

    return newProtocolo;
  }

  async updateProtocolo(id: string, protocoloData: Partial<Protocolo>): Promise<Protocolo> {
    await this.simulateDelay();
    
    const protocolos = this.storage.getProtocolos();
    const index = protocolos.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Protocolo não encontrado');
    }

    const updatedProtocolo = {
      ...protocolos[index],
      ...protocoloData,
      updatedAt: new Date().toISOString(),
    };

    protocolos[index] = updatedProtocolo;
    this.storage.setProtocolos(protocolos);

    return updatedProtocolo;
  }

  async deleteProtocolo(id: string): Promise<void> {
    await this.simulateDelay();
    
    const protocolos = this.storage.getProtocolos();
    const filteredProtocolos = protocolos.filter(p => p.id !== id);
    
    if (filteredProtocolos.length === protocolos.length) {
      throw new Error('Protocolo não encontrado');
    }
    
    this.storage.setProtocolos(filteredProtocolos);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    await this.simulateDelay();
    return true;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.storage.getCurrentUser();
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  isAuthenticated(): boolean {
    return !!(this.storage.getCurrentUser() && this.storage.getToken());
  }
}

export const mockApiService = new MockApiService();