# mTOR-Evolution - Frontend

Uma aplicação React moderna para acompanhamento de atletas de alta performance, integrada com backend Java Spring Boot.

## 🚀 Funcionalidades

### 🎨 Design Moderno
- **Interface Glassmorphism**: Elementos com efeito de vidro e blur
- **Tema Claro/Escuro**: Alternância automática baseada na preferência do sistema
- **Animações Fluidas**: Transições suaves com Framer Motion
- **Responsividade Total**: Adaptação perfeita para todos os dispositivos

### 🔐 Autenticação Avançada
- Login/Registro com validação em tempo real
- Controle de acesso baseado em roles (ADMIN, COACH, CLIENTE)
- Refresh token automático
- Verificação de status de conexão com backend

### 📊 Dashboard Inteligente
- Gráficos interativos em tempo real
- Métricas de performance personalizadas
- Visualizações de progresso com animações
- Atividades recentes com timeline

### ⚡ Experiência do Usuário
- **Onboarding Guiado**: Tutorial interativo para novos usuários
- **Atalhos de Teclado**: Navegação rápida (Ctrl+D, Ctrl+C, etc.)
- **Busca Inteligente**: Pesquisa global com Ctrl+/
- **Notificações Toast**: Feedback visual elegante
- **Status de Conexão**: Indicador visual do status do backend

### 🧠 Branding mTOR-Evolution
- Logo e identidade visual renovados
- Slogan: "Potencialize sua Evolução"
- Paleta de cores gradiente (Indigo → Purple → Pink)
- Tipografia Inter para máxima legibilidade

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Framer Motion** para animações
- **Tailwind CSS** com tema escuro
- **React Router** para navegação
- **React Hook Form** para formulários
- **Recharts** para gráficos interativos
- **React Hot Toast** para notificações
- **Lucide React** para ícones
- **Axios** para requisições HTTP
- **React Intersection Observer** para lazy loading

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend Java Spring Boot rodando na porta 8080

### 1. Clone o repositório:
```bash
git clone <repository-url>
cd mtor-evolution
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

### 4. Edite o arquivo `.env` com suas configurações:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Environment
VITE_NODE_ENV=development

# CORS Configuration
VITE_CORS_ENABLED=true
```

### 5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🔗 Integração com Backend

### Configuração da API
O frontend está configurado para se conectar automaticamente com o backend Java Spring Boot. Certifique-se de que:

1. **Backend está rodando** na porta 8080
2. **CORS está configurado** no backend para aceitar requisições do frontend
3. **Endpoints de autenticação** estão implementados

### Endpoints Principais

#### Autenticação
- `POST /api/v1/auth/login` - Login do usuário
- `POST /api/v1/auth/register` - Registro de novo usuário
- `POST /api/v1/auth/refresh` - Renovação do token
- `POST /api/v1/auth/logout` - Logout do usuário

#### Clientes
- `GET /api/v1/clientes` - Listar clientes (com paginação)
- `GET /api/v1/clientes/{id}` - Buscar cliente por ID
- `POST /api/v1/clientes` - Criar novo cliente
- `PUT /api/v1/clientes/{id}` - Atualizar cliente
- `DELETE /api/v1/clientes/{id}` - Excluir cliente
- `PATCH /api/v1/clientes/{id}/status` - Alterar status do cliente

#### Health Check
- `GET /api/v1/health` - Verificar status do backend

### Headers Obrigatórios
- `Authorization: Bearer {token}` para rotas protegidas
- `Content-Type: application/json`

### Tratamento de Erros
O frontend trata automaticamente:
- **401 Unauthorized**: Redireciona para login
- **403 Forbidden**: Exibe mensagem de acesso negado
- **404 Not Found**: Exibe mensagem de recurso não encontrado
- **422 Validation Error**: Exibe erros de validação
- **500 Internal Server Error**: Exibe mensagem de erro do servidor

### Status de Conexão
O frontend monitora automaticamente:
- **Conexão com internet**: Detecta quando está offline
- **Status do backend**: Verifica se o servidor está respondendo
- **Health check**: Endpoint `/api/v1/health` para verificar saúde do backend

## 🎯 Funcionalidades Principais

### Autenticação e Autorização
- Login com email/senha e validação em tempo real
- Sistema de roles com controle granular de acesso
- Refresh token automático
- Proteção de rotas baseada em permissões

### Dashboard Interativo
- Gráficos de evolução física (peso, gordura, massa muscular)
- Frequência de treinos com visualização semanal
- Progresso geral em formato de pizza
- Timeline de atividades recentes

### Gestão de Clientes (ADMIN/COACH)
- CRUD completo com validação
- Busca e filtros em tempo real
- Controle de status (Ativo/Inativo)
- Paginação otimizada

### Módulos Especializados
- **Avaliações Físicas**: Acompanhamento de medidas corporais
- **Exames**: Gestão de resultados laboratoriais
- **Dietas**: Planejamento nutricional personalizado
- **Treinos**: Programação de exercícios
- **Protocolos Hormonais**: Controle especializado (apenas ADMIN/COACH)
- **Relatórios**: Análises e exportações

## ⌨️ Atalhos de Teclado

- `Ctrl + D`: Ir para Dashboard
- `Ctrl + C`: Ir para Clientes (ADMIN/COACH)
- `Ctrl + A`: Ir para Avaliações
- `Ctrl + T`: Ir para Treinos
- `Ctrl + E`: Ir para Exames
- `Ctrl + /`: Focar na busca

## 🎨 Sistema de Temas

### Tema Claro
- Fundo: Branco com gradientes suaves
- Texto: Cinza escuro para máximo contraste
- Acentos: Gradiente Indigo → Purple

### Tema Escuro
- Fundo: Cinza escuro com transparências
- Texto: Branco/cinza claro
- Acentos: Mesmos gradientes com ajustes de opacidade

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout/         # Layout principal e sidebar
│   ├── UI/             # Componentes de interface
│   └── Onboarding/     # Sistema de tutorial
├── hooks/              # Custom hooks
│   ├── useAuth.tsx     # Autenticação
│   ├── useTheme.tsx    # Controle de tema
│   ├── useOnboarding.tsx # Tutorial guiado
│   └── useKeyboardShortcuts.tsx # Atalhos
├── pages/              # Páginas da aplicação
│   ├── Auth/           # Login e registro
│   ├── Dashboard/      # Dashboard principal
│   └── Clientes/       # Gestão de clientes
├── services/           # Serviços de API
│   ├── api.ts          # Cliente HTTP base
│   ├── auth.ts         # Serviços de autenticação
│   ├── cliente.ts      # Serviços de clientes
│   └── protocolo.ts    # Serviços de protocolos
├── types/              # Definições TypeScript
└── utils/              # Utilitários
```

## 🚀 Performance

### Otimizações
- Lazy loading de componentes
- Intersection Observer para animações
- Debounce em buscas
- Memoização de componentes pesados
- Interceptors para tratamento automático de erros

### Métricas Lighthouse
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 95+

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Linting do código
```

### Convenções
- Componentes em PascalCase
- Hooks com prefixo "use"
- Arquivos de tipos em camelCase
- CSS classes em kebab-case

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Verifique se o backend está configurado para aceitar requisições do frontend
   - Adicione `http://localhost:5173` nas origens permitidas

2. **Backend não conecta**
   - Verifique se o backend está rodando na porta 8080
   - Confirme a URL no arquivo `.env`
   - Verifique o endpoint `/api/v1/health`

3. **Token expirado**
   - O frontend tenta renovar automaticamente
   - Se falhar, redireciona para login

4. **Dados não carregam**
   - Verifique o console do navegador para erros
   - Confirme se os endpoints estão implementados no backend
   - Verifique se o usuário tem as permissões necessárias

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**mTOR-Evolution** - Potencialize sua evolução atlética com tecnologia de ponta! 🚀

### 🔗 Links Úteis
- [Documentação da API](http://localhost:8080/swagger-ui.html)
- [Repositório do Backend](https://github.com/Krygz/mTorEvolution)
- [Guia de Deploy](docs/deploy.md)

### 🧪 Credenciais de Teste
- **Admin**: `admin@mtor.com` / `admin123`
- **Coach**: `coach@mtor.com` / `coach123`
- **Cliente**: `cliente@mtor.com` / `cliente123`