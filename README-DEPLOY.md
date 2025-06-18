# 🚀 Deploy Rápido - mTOR-Evolution + Supabase

## ⚡ Deploy em 3 Passos

### 1️⃣ Supabase (2 minutos)
1. Acesse [supabase.com](https://supabase.com) → New Project
2. Nome: `mtor-evolution` → Create
3. SQL Editor → Execute as migrações (arquivos na pasta `supabase/migrations/`)
4. Settings → API → Copie URL e anon key

### 2️⃣ Railway - Backend (3 minutos)
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Adicione variáveis:
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=[sua-senha-supabase]
   JWT_SECRET=mtor-evolution-super-secret-key-2024
   FRONTEND_URL=https://mtor-evolution.netlify.app
   SPRING_PROFILES_ACTIVE=prod
   ```
3. Deploy automático → Anote a URL

### 3️⃣ Netlify - Frontend (2 minutos)
1. [netlify.com](https://netlify.com) → New site from Git
2. Build: `npm run build` | Publish: `dist`
3. Environment variables:
   ```
   VITE_API_BASE_URL=https://[seu-backend].railway.app/api/v1
   VITE_NODE_ENV=production
   ```
4. Deploy → Pronto! 🎉

## 🔐 Login Padrão
- **Admin**: `admin@mtor.com` / `admin123`
- **Coach**: `coach@mtor.com` / `coach123`
- **Cliente**: `cliente@mtor.com` / `cliente123`

## ✅ Verificar
- Backend: `https://[backend].railway.app/api/v1/health`
- Frontend: `https://[site].netlify.app`

**Total: ~7 minutos para estar online! 🚀**