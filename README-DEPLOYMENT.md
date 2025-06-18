# mTOR-Evolution - Guia de Deploy

## 🚀 Opções de Banco de Dados Online Gratuito

### 1. **Supabase** (Recomendado)
- **Vantagens**: PostgreSQL gratuito, 500MB, backup automático, interface web
- **Limite**: 500MB de armazenamento, 2GB de transferência/mês
- **Setup**:
  1. Acesse [supabase.com](https://supabase.com)
  2. Crie uma conta e novo projeto
  3. Copie a URL de conexão PostgreSQL
  4. Configure as variáveis de ambiente

```bash
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[your-password]
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

### 2. **Neon** 
- **Vantagens**: PostgreSQL serverless, 3GB gratuito, branching
- **Limite**: 3GB de armazenamento
- **Setup**: Similar ao Supabase

### 3. **PlanetScale**
- **Vantagens**: MySQL compatível, branching, 5GB gratuito
- **Limite**: 5GB de armazenamento, 1 bilhão de reads/mês
- **Nota**: Requer mudança do dialeto para MySQL

### 4. **Railway**
- **Vantagens**: PostgreSQL + deploy da aplicação, $5 crédito mensal
- **Limite**: Baseado em créditos ($5/mês gratuito)

### 5. **Aiven**
- **Vantagens**: PostgreSQL gerenciado, 1 mês gratuito
- **Limite**: Trial de 30 dias

## 🔧 Configuração para Produção

### Variáveis de Ambiente Necessárias

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
DDL_AUTO=update

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Logging
LOG_LEVEL=INFO
SHOW_SQL=false
H2_CONSOLE_ENABLED=false
```

## 🌐 Deploy do Backend

### Opção 1: Railway (Recomendado)
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Opção 2: Render
1. Conecte o repositório
2. Configure build command: `mvn clean package -DskipTests`
3. Configure start command: `java -jar target/mtor-evolution-2.0.0.jar`

### Opção 3: Heroku
```bash
# Criar Procfile
echo "web: java -jar target/mtor-evolution-2.0.0.jar" > Procfile

# Deploy
heroku create mtor-evolution-backend
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set DATABASE_URL=your_database_url
git push heroku main
```

## 🎨 Deploy do Frontend

### Opção 1: Vercel (Recomendado)
1. Conecte o repositório GitHub
2. Configure build command: `npm run build`
3. Configure output directory: `dist`
4. Configure variável: `VITE_API_BASE_URL=https://your-backend-url.com/api/v1`

### Opção 2: Netlify
1. Conecte o repositório
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure redirects para SPA

### Opção 3: GitHub Pages
```bash
npm run build
# Configure GitHub Pages para servir da pasta dist
```

## 🐳 Deploy com Docker

### Docker Compose Completo
```bash
# Clone o repositório
git clone <your-repo>
cd mtor-evolution

# Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie os serviços
docker-compose up -d

# Verifique os logs
docker-compose logs -f
```

## 📊 Monitoramento

### Health Checks
- Backend: `https://your-backend-url.com/api/v1/health`
- Frontend: Verificação automática de conectividade

### Logs
```bash
# Docker
docker-compose logs backend

# Railway/Render
# Use o dashboard da plataforma
```

## 🔒 Segurança em Produção

### Checklist de Segurança
- [ ] JWT secret com pelo menos 256 bits
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente
- [ ] Logs de SQL desabilitados
- [ ] H2 Console desabilitado
- [ ] Variáveis de ambiente seguras
- [ ] Backup do banco configurado

### Configurações Recomendadas
```yaml
# application-prod.yml
spring:
  jpa:
    show-sql: false
  h2:
    console:
      enabled: false

logging:
  level:
    org.hibernate.SQL: WARN
    org.springframework.security: WARN
```

## 🚀 Script de Deploy Automatizado

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy do mTOR-Evolution..."

# Build do frontend
echo "📦 Building frontend..."
npm install
npm run build

# Build do backend
echo "🔨 Building backend..."
mvn clean package -DskipTests

# Deploy (exemplo para Railway)
echo "🌐 Deploying to production..."
railway up

echo "✅ Deploy concluído!"
echo "🔗 Backend: https://your-backend-url.com"
echo "🔗 Frontend: https://your-frontend-url.com"
```

## 📝 Notas Importantes

1. **Supabase é a opção mais recomendada** para iniciantes
2. **Railway** oferece a melhor experiência para deploy completo
3. **Sempre use HTTPS** em produção
4. **Configure backups** regulares do banco
5. **Monitore os logs** para identificar problemas
6. **Use variáveis de ambiente** para configurações sensíveis

## 🆘 Troubleshooting

### Problemas Comuns
1. **CORS Error**: Verifique `FRONTEND_URL` no backend
2. **Database Connection**: Verifique `DATABASE_URL` e credenciais
3. **JWT Error**: Verifique `JWT_SECRET` (mínimo 256 bits)
4. **Build Error**: Verifique versões do Java (17) e Node (18+)

### Comandos Úteis
```bash
# Verificar saúde do backend
curl https://your-backend-url.com/api/v1/health

# Verificar logs do Docker
docker-compose logs backend

# Restart dos serviços
docker-compose restart
```