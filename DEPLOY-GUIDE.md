# 🚀 Guia de Deploy - mTOR-Evolution

## 📋 Pré-requisitos

1. **Banco de Dados Online** (escolha uma opção):
   - ✅ **Supabase** (Recomendado) - PostgreSQL gratuito
   - ✅ **Neon** - PostgreSQL serverless
   - ✅ **Railway** - PostgreSQL + deploy
   - ✅ **PlanetScale** - MySQL compatível

2. **Plataformas de Deploy**:
   - **Backend**: Railway, Render, Heroku
   - **Frontend**: Vercel, Netlify, GitHub Pages

## 🗄️ 1. Configurar Banco de Dados

### Opção A: Supabase (Recomendado)

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e novo projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection String** (URI)
5. Anote as credenciais:
   ```
   Host: db.xxx.supabase.co
   Database: postgres
   Username: postgres
   Password: [sua-senha]
   Port: 5432
   ```

### Opção B: Neon

1. Acesse [neon.tech](https://neon.tech)
2. Crie conta e projeto
3. Copie a connection string
4. Formato: `postgresql://user:pass@host/dbname`

## 🔧 2. Deploy do Backend

### Opção A: Railway (Recomendado)

1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Selecione o repositório
4. Configure as variáveis de ambiente:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[sua-senha-supabase]
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
DDL_AUTO=update

# JWT
JWT_SECRET=mtor-evolution-super-secret-key-change-this-in-production-256-bits-minimum
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Frontend
FRONTEND_URL=https://[seu-frontend].vercel.app

# Environment
SPRING_PROFILES_ACTIVE=prod
LOG_LEVEL=INFO
SHOW_SQL=false
H2_CONSOLE_ENABLED=false
```

5. Deploy automático será iniciado
6. Anote a URL do backend: `https://[projeto].railway.app`

### Opção B: Render

1. Acesse [render.com](https://render.com)
2. Conecte GitHub
3. Crie **Web Service**
4. Configure:
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/mtor-evolution-2.0.0.jar`
   - **Environment**: Java 17
5. Adicione as mesmas variáveis de ambiente

## 🎨 3. Deploy do Frontend

### Opção A: Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Conecte GitHub
3. Selecione o repositório
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Adicione variável de ambiente:
   ```bash
   VITE_API_BASE_URL=https://[seu-backend].railway.app/api/v1
   ```
6. Deploy automático
7. Anote a URL: `https://[projeto].vercel.app`

### Opção B: Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Conecte GitHub
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Adicione variável de ambiente:
   ```bash
   VITE_API_BASE_URL=https://[seu-backend].railway.app/api/v1
   ```

## 🔄 4. Atualizar CORS no Backend

Após deploy do frontend, atualize a variável `FRONTEND_URL` no backend:

```bash
FRONTEND_URL=https://[seu-projeto].vercel.app
```

## ✅ 5. Testar a Aplicação

### Verificar Backend
1. Acesse: `https://[backend-url]/api/v1/health`
2. Deve retornar: `{"status":"UP","database":"CONNECTED"}`

### Verificar Frontend
1. Acesse: `https://[frontend-url]`
2. Teste login com:
   - **Admin**: `admin@mtor.com` / `admin123`
   - **Coach**: `coach@mtor.com` / `coach123`
   - **Cliente**: `cliente@mtor.com` / `cliente123`

## 🔒 6. Configurações de Segurança

### JWT Secret
Gere uma chave segura:
```bash
# Exemplo de chave segura (256+ bits)
JWT_SECRET=mtor-evolution-2024-super-secret-jwt-key-production-ready-minimum-256-bits-security
```

### HTTPS
- ✅ Railway e Vercel fornecem HTTPS automático
- ✅ Certificados SSL renovados automaticamente

## 📊 7. Monitoramento

### Health Checks
- **Backend**: `https://[backend]/api/v1/health`
- **Frontend**: Verificação automática no app

### Logs
- **Railway**: Dashboard → Logs
- **Vercel**: Dashboard → Functions → Logs

## 🚨 8. Troubleshooting

### Problemas Comuns

1. **CORS Error**
   ```bash
   # Verifique se FRONTEND_URL está correto no backend
   FRONTEND_URL=https://[seu-frontend].vercel.app
   ```

2. **Database Connection Error**
   ```bash
   # Verifique DATABASE_URL
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

3. **JWT Error**
   ```bash
   # Verifique se JWT_SECRET tem pelo menos 256 bits
   JWT_SECRET=sua-chave-super-secreta-com-pelo-menos-256-bits
   ```

4. **Build Error**
   ```bash
   # Verifique versões
   Java: 17+
   Node: 18+
   Maven: 3.6+
   ```

### Comandos Úteis

```bash
# Testar backend local
curl https://[backend-url]/api/v1/health

# Verificar logs Railway
railway logs

# Rebuild Vercel
vercel --prod
```

## 🎯 9. URLs Finais

Após o deploy completo, você terá:

- **Frontend**: `https://[projeto].vercel.app`
- **Backend**: `https://[projeto].railway.app`
- **Database**: Supabase Dashboard
- **Health Check**: `https://[backend]/api/v1/health`

## 📝 10. Checklist Final

- [ ] Banco de dados configurado (Supabase/Neon)
- [ ] Backend deployado (Railway/Render)
- [ ] Frontend deployado (Vercel/Netlify)
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Health check funcionando
- [ ] Login testado com usuários padrão
- [ ] HTTPS habilitado
- [ ] Monitoramento configurado

🎉 **Parabéns! Sua aplicação está online e funcionando!**