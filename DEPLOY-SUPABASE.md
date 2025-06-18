# 🚀 Deploy Guide - mTOR-Evolution com Supabase

## 📋 Pré-requisitos

1. **Conta no Supabase** - [supabase.com](https://supabase.com)
2. **Conta no Railway** (backend) - [railway.app](https://railway.app)
3. **Conta no Netlify** (frontend) - [netlify.com](https://netlify.com)

## 🗄️ 1. Configurar Supabase

### Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Configure:
   - **Name**: `mtor-evolution`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
5. Clique em "Create new project"

### Passo 2: Executar Migrações

1. No dashboard do Supabase, vá em **SQL Editor**
2. Execute as migrações na seguinte ordem:

```sql
-- 1. Primeiro, execute: create_users_table.sql
-- 2. Depois: create_clientes_table.sql  
-- 3. Em seguida: create_protocolos_table.sql
-- 4. Por último: insert_default_users.sql
-- 5. Finalmente: insert_sample_clientes.sql
```

### Passo 3: Obter Credenciais

1. Vá em **Settings** → **API**
2. Anote:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Vá em **Settings** → **Database**
4. Anote a **Connection String**:
   ```
   postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
   ```

## 🔧 2. Deploy do Backend (Railway)

### Passo 1: Conectar Repositório

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Conecte seu repositório

### Passo 2: Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```bash
# Database Supabase
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[sua-senha-supabase]

# JWT Configuration
JWT_SECRET=mtor-evolution-supabase-2024-super-secret-jwt-key-production-ready-minimum-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Frontend URL (será atualizada após deploy do frontend)
FRONTEND_URL=https://mtor-evolution.netlify.app

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Logging
LOG_LEVEL=INFO
SHOW_SQL=false

# Port (Railway define automaticamente)
PORT=8080
```

### Passo 3: Deploy

1. O Railway fará o deploy automaticamente
2. Anote a URL do backend: `https://[projeto].railway.app`
3. Teste o health check: `https://[projeto].railway.app/api/v1/health`

## 🎨 3. Deploy do Frontend (Netlify)

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
# API Backend
VITE_API_BASE_URL=https://[seu-backend].railway.app/api/v1

# Supabase (opcional para futuras funcionalidades)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Environment
VITE_NODE_ENV=production
```

### Passo 4: Deploy

1. Clique em "Deploy site"
2. Aguarde o build completar
3. Anote a URL: `https://[nome-do-site].netlify.app`

## 🔄 4. Atualizar CORS no Backend

Após o deploy do frontend:

1. Volte ao Railway
2. Atualize a variável `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://[seu-site].netlify.app
   ```
3. O backend será redployado automaticamente

## ✅ 5. Testar a Aplicação

### Verificar Backend
1. Acesse: `https://[backend-url].railway.app/api/v1/health`
2. Deve retornar: `{"status":"UP","database":"CONNECTED"}`

### Verificar Frontend
1. Acesse: `https://[frontend-url].netlify.app`
2. Teste login com:
   - **Admin**: `admin@mtor.com` / `admin123`
   - **Coach**: `coach@mtor.com` / `coach123`
   - **Cliente**: `cliente@mtor.com` / `cliente123`

### Verificar Supabase
1. No dashboard do Supabase, vá em **Table Editor**
2. Verifique se as tabelas foram criadas:
   - `users` (com 3 usuários padrão)
   - `clientes` (com 5 clientes de exemplo)
   - `protocolos` (vazia inicialmente)

## 🔒 6. Configurações de Segurança

### Supabase RLS
- ✅ Row Level Security habilitado em todas as tabelas
- ✅ Políticas configuradas para ADMIN/COACH
- ✅ Usuários só acessam seus próprios dados

### JWT
- ✅ Chave secreta segura (256+ bits)
- ✅ Tokens com expiração de 24h
- ✅ Refresh tokens com 7 dias

### HTTPS
- ✅ Railway e Netlify fornecem HTTPS automático
- ✅ Certificados SSL renovados automaticamente

## 📊 7. Monitoramento

### Health Checks
- **Backend**: `https://[backend]/api/v1/health`
- **Frontend**: Verificação automática no app
- **Supabase**: Dashboard com métricas em tempo real

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
   DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
   ```

3. **Migrações não executadas**
   - Execute manualmente no SQL Editor do Supabase
   - Verifique se as tabelas foram criadas

4. **Login não funciona**
   - Verifique se os usuários padrão foram criados
   - Teste no SQL Editor: `SELECT * FROM users;`

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

- [ ] Projeto Supabase criado
- [ ] Migrações executadas no Supabase
- [ ] Backend deployado no Railway
- [ ] Frontend deployado no Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Health check funcionando
- [ ] Login testado com usuários padrão
- [ ] HTTPS habilitado
- [ ] RLS funcionando no Supabase

🎉 **Parabéns! Sua aplicação está online com Supabase!**

## 🔗 Links Úteis

- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Netlify Docs](https://docs.netlify.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)