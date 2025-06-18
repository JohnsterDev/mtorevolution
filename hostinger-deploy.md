# 🚀 Guia de Deploy na Hostinger

## 📋 Pré-requisitos

1. **Conta na Hostinger** com plano que suporte:
   - Hospedagem de sites estáticos
   - Subdomínio ou domínio próprio
   - Acesso ao painel de controle

2. **Backend separado** (se necessário):
   - Railway, Render, ou outro serviço para o backend Java
   - Banco de dados (Supabase recomendado)

## 🔧 Preparação do Projeto

### 1. Configurar Variáveis de Ambiente

Edite o arquivo `.env.production`:

```env
# Substitua pela URL do seu backend
VITE_API_BASE_URL=https://seu-backend.railway.app/api/v1

# Ou se for usar apenas frontend (mock data)
VITE_API_BASE_URL=https://seu-dominio.hostinger.com/api/mock

# Ambiente
VITE_NODE_ENV=production
```

### 2. Build do Projeto

Execute os comandos:

```bash
# Instalar dependências
npm install

# Criar build de produção
npm run build
```

Isso criará a pasta `dist/` com todos os arquivos otimizados.

## 📤 Upload para Hostinger

### Método 1: File Manager (Recomendado)

1. **Acesse o painel da Hostinger**
2. **Vá em "File Manager"**
3. **Navegue até a pasta `public_html`**
4. **Delete todos os arquivos existentes** (se houver)
5. **Faça upload de TODOS os arquivos da pasta `dist/`**
6. **Certifique-se que o arquivo `.htaccess` foi enviado**

### Método 2: FTP

1. **Use um cliente FTP** (FileZilla, WinSCP, etc.)
2. **Conecte com as credenciais da Hostinger**
3. **Navegue até `/public_html/`**
4. **Envie todos os arquivos da pasta `dist/`**

## 🔗 Configuração de Backend

### Opção A: Backend Separado (Recomendado)

1. **Deploy do backend no Railway/Render**:
   ```bash
   # Configure as variáveis no Railway:
   DATABASE_URL=sua-url-supabase
   FRONTEND_URL=https://seu-dominio.hostinger.com
   JWT_SECRET=sua-chave-secreta
   ```

2. **Atualize a URL no frontend**:
   ```env
   VITE_API_BASE_URL=https://seu-backend.railway.app/api/v1
   ```

### Opção B: Mock Data (Apenas Frontend)

Se quiser rodar apenas o frontend com dados simulados:

1. **Crie um arquivo de mock** em `public/api/mock/health`:
   ```json
   {
     "status": "UP",
     "database": "MOCK",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```

2. **Configure a URL**:
   ```env
   VITE_API_BASE_URL=https://seu-dominio.hostinger.com/api/mock
   ```

## ✅ Verificação

### 1. Teste o Site

1. **Acesse seu domínio**: `https://seu-dominio.hostinger.com`
2. **Verifique se carrega corretamente**
3. **Teste a navegação** (deve funcionar sem erros 404)
4. **Teste o login** com as credenciais padrão

### 2. Credenciais de Teste

- **Admin**: `admin@mtor.com` / `admin123`
- **Coach**: `coach@mtor.com` / `coach123`
- **Cliente**: `cliente@mtor.com` / `cliente123`

### 3. Debug de Problemas

Se algo não funcionar:

1. **Verifique o console do navegador** (F12)
2. **Confirme se o `.htaccess` está no lugar certo**
3. **Verifique se todas as URLs estão corretas**
4. **Teste a conectividade com o backend**

## 🔧 Configurações Avançadas

### SSL/HTTPS

A Hostinger geralmente fornece SSL gratuito:
1. **Ative o SSL** no painel de controle
2. **Force HTTPS** nas configurações
3. **Aguarde a propagação** (pode levar até 24h)

### Domínio Personalizado

1. **Configure o domínio** no painel da Hostinger
2. **Atualize os DNS** se necessário
3. **Aguarde a propagação**

### Performance

O `.htaccess` já inclui:
- ✅ Compressão Gzip
- ✅ Cache de arquivos estáticos
- ✅ Headers de segurança

## 🚨 Troubleshooting

### Problema: Página em branco
**Solução**: Verifique se todos os arquivos da pasta `dist/` foram enviados

### Problema: 404 ao navegar
**Solução**: Confirme se o arquivo `.htaccess` está presente e correto

### Problema: Erro de CORS
**Solução**: Configure o backend para aceitar requisições do seu domínio

### Problema: Assets não carregam
**Solução**: Verifique se os caminhos estão corretos e se os arquivos foram enviados

## 📞 Suporte

Se precisar de ajuda:
1. **Verifique os logs** no painel da Hostinger
2. **Contate o suporte** da Hostinger
3. **Consulte a documentação** oficial

---

🎉 **Parabéns! Sua aplicação mTOR-Evolution está online na Hostinger!**