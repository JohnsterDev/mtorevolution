# mTOR-Evolution - Fullstack Application

Uma aplicação fullstack completa para acompanhamento de atletas de alta performance, com frontend React e backend Java Spring Boot.

## 🏗️ Arquitetura

### Frontend (React + TypeScript)
- **Framework**: React 18 com TypeScript
- **Styling**: Tailwind CSS com tema escuro
- **Animações**: Framer Motion
- **Roteamento**: React Router
- **Estado**: Context API + Custom Hooks
- **Formulários**: React Hook Form
- **Gráficos**: Recharts
- **Notificações**: React Hot Toast

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Segurança**: Spring Security + JWT
- **Banco de Dados**: H2 (desenvolvimento) / PostgreSQL (produção)
- **ORM**: JPA/Hibernate
- **Documentação**: OpenAPI/Swagger
- **Validação**: Bean Validation

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Java 17+
- Maven 3.6+

### 1. Executar o Backend

```bash
# Navegar para o diretório raiz do projeto
cd /home/project

# Compilar e executar o backend
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 2. Executar o Frontend

```bash
# Em outro terminal, no mesmo diretório
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### 3. Executar Ambos Simultaneamente

```bash
# Instalar concurrently se não tiver
npm install -g concurrently

# Executar frontend e backend juntos
npm run dev:full
```

## 🔐 Autenticação

### Usuários Padrão Criados Automaticamente:

1. **Administrador**
   - Email: `admin@mtor.com`
   - Senha: `admin123`
   - Acesso: Todas as funcionalidades

2. **Treinador**
   - Email: `coach@mtor.com`
   - Senha: `coach123`
   - Acesso: Gestão de clientes e protocolos

3. **Cliente**
   - Email: `cliente@mtor.com`
   - Senha: `cliente123`
   - Acesso: Visualização de dados pessoais

## 📊 Banco de Dados

### Desenvolvimento (H2)
- Console H2: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:mtor_evolution`
- Username: `sa`
- Password: (vazio)

### Produção (PostgreSQL)
Configure as variáveis de ambiente:
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mtor_evolution
SPRING_DATASOURCE_USERNAME=seu_usuario
SPRING_DATASOURCE_PASSWORD=sua_senha
```

## 🛠️ APIs Disponíveis

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout

### Clientes
- `GET /api/v1/clientes` - Listar clientes (paginado)
- `GET /api/v1/clientes/{id}` - Buscar por ID
- `POST /api/v1/clientes` - Criar cliente
- `PUT /api/v1/clientes/{id}` - Atualizar cliente
- `DELETE /api/v1/clientes/{id}` - Excluir cliente
- `PATCH /api/v1/clientes/{id}/status` - Alterar status

### Health Check
- `GET /api/v1/health` - Status da aplicação

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:8080/swagger-ui.html`

## 🔧 Configuração

### Variáveis de Ambiente

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_NODE_ENV=development
```

#### Backend (application.yml)
```yaml
jwt:
  secret: sua-chave-secreta-jwt
  expiration: 86400000 # 24 horas
  refresh-expiration: 604800000 # 7 dias

cors:
  allowed-origins:
    - http://localhost:5173
    - http://localhost:3000
```

## 🏭 Build para Produção

### Frontend
```bash
npm run build:frontend
```

### Backend
```bash
mvn clean package
```

### Ambos
```bash
npm run build:full
```

## 🚀 Deploy

### Frontend
O build do frontend gera arquivos estáticos na pasta `dist/` que podem ser servidos por qualquer servidor web.

### Backend
```bash
# Executar o JAR gerado
java -jar target/mtor-evolution-2.0.0.jar
```

## 🔍 Monitoramento

### Health Checks
- Frontend: Verifica conexão com backend automaticamente
- Backend: Endpoint `/health` com status da aplicação

### Logs
- Frontend: Console do navegador
- Backend: Logs do Spring Boot com nível DEBUG

## 🛡️ Segurança

### JWT
- Tokens com expiração de 24 horas
- Refresh tokens com expiração de 7 dias
- Renovação automática no frontend

### CORS
- Configurado para aceitar requisições do frontend
- Headers de segurança configurados

### Autorização
- Controle de acesso baseado em roles
- Endpoints protegidos por anotações `@PreAuthorize`

## 🧪 Testes

### Frontend
```bash
npm run test
```

### Backend
```bash
mvn test
```

## 📝 Estrutura do Projeto

```
/
├── src/                          # Frontend React
│   ├── components/              # Componentes reutilizáveis
│   ├── pages/                   # Páginas da aplicação
│   ├── hooks/                   # Custom hooks
│   ├── services/                # Serviços de API
│   └── types/                   # Tipos TypeScript
├── src/main/java/               # Backend Java
│   └── com/mtor/evolution/
│       ├── config/              # Configurações
│       ├── controller/          # Controllers REST
│       ├── dto/                 # Data Transfer Objects
│       ├── model/               # Entidades JPA
│       ├── repository/          # Repositórios
│       ├── security/            # Configurações de segurança
│       └── service/             # Serviços de negócio
├── src/main/resources/          # Recursos do backend
├── pom.xml                      # Dependências Maven
├── package.json                 # Dependências NPM
└── README-FULLSTACK.md          # Esta documentação
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**mTOR-Evolution** - Potencialize sua evolução atlética com tecnologia de ponta! 🚀