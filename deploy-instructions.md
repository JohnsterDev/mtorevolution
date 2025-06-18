# 🚀 Instruções de Deploy para Hostinger

## 📦 Preparação

1. **Execute o build de produção**:
   ```bash
   npm run deploy:build
   ```

2. **Verifique se a pasta `dist/` foi criada** com todos os arquivos

## 📤 Upload para Hostinger

### Passo 1: Acesse o File Manager
1. Faça login no painel da Hostinger
2. Vá em **File Manager**
3. Navegue até a pasta **public_html**

### Passo 2: Limpe a pasta (se necessário)
1. Delete todos os arquivos existentes em `public_html`
2. Mantenha apenas pastas do sistema (como `cgi-bin`)

### Passo 3: Upload dos arquivos
1. **Selecione TODOS os arquivos** da pasta `dist/`
2. **Faça upload** para `public_html`
3. **Certifique-se** que o arquivo `.htaccess` foi enviado

### Passo 4: Configuração final
1. **Edite o arquivo `.env.production`** se necessário
2. **Configure o SSL** no painel da Hostinger
3. **Teste o site** acessando seu domínio

## ✅ Verificação

### Teste básico:
- [ ] Site carrega sem erros
- [ ] Navegação funciona (sem 404)
- [ ] Login funciona com credenciais de teste
- [ ] Responsividade está ok

### Credenciais de teste:
- **Admin**: admin@mtor.com / admin123
- **Coach**: coach@mtor.com / coach123  
- **Cliente**: cliente@mtor.com / cliente123

## 🔧 Configurações Opcionais

### Backend separado:
Se você quiser usar um backend real:
1. Deploy o backend no Railway/Render
2. Atualize `VITE_API_BASE_URL` no `.env.production`
3. Refaça o build e upload

### Domínio personalizado:
1. Configure no painel da Hostinger
2. Aguarde propagação DNS
3. Ative SSL automático

## 🚨 Problemas Comuns

### Página em branco:
- Verifique se todos os arquivos foram enviados
- Confirme se o `.htaccess` está presente

### 404 ao navegar:
- Confirme se o `.htaccess` tem as regras de rewrite
- Verifique se o arquivo foi enviado corretamente

### Erro de CORS:
- Configure o backend para aceitar seu domínio
- Verifique as URLs nas variáveis de ambiente

---

🎉 **Pronto! Sua aplicação está online na Hostinger!**