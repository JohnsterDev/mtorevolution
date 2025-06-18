# 🚀 Deploy Guide - mTOR-Evolution com Railway + Supabase

## 📋 Arquitetura da Solução

- **Frontend**: Netlify (React + Vite)
- **Backend**: Railway (Java Spring Boot)
- **Database**: Supabase (PostgreSQL)

## 🗄️ 1. Configurar Supabase

### Passo 1: Projeto já Configurado
✅ **Projeto**: `sexklcnutdnmrwvarlwk`
✅ **URL**: `https://sexklcnutdnmrwvarlwk.supabase.co`
✅ **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Passo 2: Verificar Migrações
As migrações já foram executadas:
- ✅ `users` table
- ✅ `clientes` table  
- ✅ `protocolos` table
- ✅ Default users
- ✅ Sample data

### Passo 3: Connection String
```
postgresql://postgres:[YOUR-PASSWORD]@db.sexklcnutdnmrwvarlwk.supabase.co:5432/postgres
```

## 🚂 2. Deploy do Backend (Railway)

### Passo 1: Conectar Repositório
1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Conecte seu repositório

### Passo 2: Configurar Variáveis de Ambiente
No Railway, vá em **Variables** e adicione:

```bash
# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Database Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.sexklcnutdnmrwvarlwk.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[sua-senha-supabase]

# JWT Configuration
JWT_SECRET=mtor-evolution-railway-supabase-2024-super-secret-jwt-key-production-ready-minimum-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Frontend URL (será atualizada após deploy do frontend)
FRONTEND_URL=https://mtor-evolution.netlify.app

# Logging
LOG_LEVEL=INFO
SHOW_SQL=false

# Port (Railway define automaticamente)
PORT=8080
```

### Passo 3: Deploy Automático
1. O Railway detectará automaticamente o `railway.json`
2. Build command: `mvn clean package -DskipTests`
3. Start command: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/mtor-evolution-2.0.0.jar`
4. Health check: `/api/v1/health`

## 🌐 3. Deploy do Frontend (Netlify)

### Passo 1: Conectar Repositório
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte seu GitHub
4. Selecione o repositório

### Passo 2: Configurar Build
Configure as seguintes opções:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### Passo 3: Configurar Variáveis de Ambiente
No Netlify, vá em **Site settings** → **Environment variables**:

```bash
# API Backend (Railway)
VITE_API_BASE_URL=https://[seu-backend].railway.app/api/v1

# Supabase
VITE_SUPABASE_URL=https://sexklcnutdnmrwvarlwk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNleGtsY251dGRubXJ3dmFybHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDMwMTEsImV4cCI6MjA2NTY3OTAxMX0.mtGfYofkzgQ2GIZAMXRPqpbNs0puBdzqGlqKuHa7KYk

# Environment
VITE_NODE_ENV=production
```

## 🔄 4. Atualizar CORS no Backend

Após o deploy do frontend:
1. Volte ao Railway
2. Atualize a variável `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://[seu-site].netlify.app
   ```
3. O backend será redployado automaticamente

## ✅ 5. Testar a Aplicação

### Verificar Supabase
1. Dashboard: `https://supabase.com/dashboard/project/sexklcnutdnmrwvarlwk`
2. Verificar tabelas no **Table Editor**
3. Verificar usuários padrão

### Verificar Backend (Railway)
1. Acesse: `https://[backend-url].railway.app/api/v1/health`
2. Deve retornar: `{"status":"UP","database":"CONNECTED"}`

### Verificar Frontend (Netlify)
1. Acesse: `https://[frontend-url].netlify.app`
2. Teste login com:
   - **Admin**: `admin@mtor.com` / `admin123`
   - **Coach**: `coach@mtor.com` / `coach123`
   - **Cliente**: `cliente@mtor.com` / `cliente123`

## 🔒 6. Configurações de Segurança

### Supabase RLS
- ✅ Row Level Security habilitado
- ✅ Políticas configuradas para ADMIN/COACH
- ✅ Usuários só acessam seus próprios dados

### Railway
- ✅ HTTPS automático
- ✅ Variáveis de ambiente seguras
- ✅ Health checks configurados

### Netlify
- ✅ HTTPS automático
- ✅ Headers de segurança
- ✅ Redirects para SPA

## 📊 7. Monitoramento

### Health Checks
- **Backend**: `https://[backend]/api/v1/health`
- **Frontend**: Verificação automática no app
- **Supabase**: Dashboard com métricas

### Logs
- **Railway**: Dashboard → Deployments → Logs
- **Netlify**: Dashboard → Site overview → Functions
- **Supabase**: Dashboard → Logs

## 🚨 8. Troubleshooting

### Problemas Comuns

1. **CORS Error**
   ```bash
   # Verifique FRONTEND_URL no Railway
   FRONTEND_URL=https://[seu-site].netlify.app
   ```

2. **Database Connection Error**
   ```bash
   # Verifique DATABASE_URL no Railway
   DATABASE_URL=postgresql://postgres:[password]@db.sexklcnutdnmrwvarlwk.supabase.co:5432/postgres
   ```

3. **Supabase Connection**
   - Verifique se a senha está correta
   - Teste conexão no Supabase Dashboard

4. **Railway Build Error**
   - Verifique se Java 17 está sendo usado
   - Verifique se `railway.json` está correto

### Comandos Úteis

```bash
# Testar backend
curl https://[backend-url].railway.app/api/v1/health

# Verificar logs Railway
# Acesse o dashboard e vá em Deployments → Logs

# Rebuild Netlify
# No dashboard, clique em "Trigger deploy"
```

## 🎯 9. URLs Finais

Após o deploy completo:

- **Frontend**: `https://[site].netlify.app`
- **Backend**: `https://[projeto].railway.app`
- **Database**: Supabase Dashboard
- **Health Check**: `https://[backend]/api/v1/health`
- **API Docs**: `https://[backend]/swagger-ui.html`

## 📝 10. Checklist Final

- [ ] Supabase configurado e funcionando
- [ ] Migrações executadas
- [ ] Backend deployado no Railway
- [ ] Frontend deployado no Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Health check funcionando
- [ ] Login testado com usuários padrão
- [ ] HTTPS habilitado em todos os serviços
- [ ] RLS funcionando no Supabase

🎉 **Parabéns! Sua aplicação está online com Railway + Supabase!**

## 🔗 Links Úteis

- [Railway Docs](https://docs.railway.app)
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)