# Playwright MCP - Servidor Remoto SSE

Este projeto expõe as ferramentas do Playwright MCP via **SSE (Server-Sent Events)** para acesso remoto.

## 🚀 Deploy Rápido

### Vercel (Recomendado)

1. **Instale a CLI da Vercel:**
```bash
npm install -g vercel
```

2. **Faça login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **URL será gerada automaticamente:**
```
https://seu-projeto.vercel.app
```

## 🔧 Uso Local

1. **Instale as dependências:**
```bash
npm install
```

2. **Rode o servidor:**
```bash
node api/sse.js
```

3. **Acesse:**
- Health check: http://localhost:3000
- Endpoint SSE: http://localhost:3000/sse
- Lista de tools: http://localhost:3000/tools

## 📡 Conectando ao Servidor Remoto

### No Claude Desktop

Edite `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright-remote": {
      "url": "https://seu-projeto.vercel.app/sse",
      "transport": "sse"
    }
  }
}
```

### No Cursor

Edite as configurações do MCP e adicione:

```json
{
  "mcp": {
    "servers": {
      "playwright-remote": {
        "url": "https://seu-projeto.vercel.app/sse",
        "transport": "sse"
      }
    }
  }
}
```

## 🛠️ Ferramentas Disponíveis

O servidor expõe todas as ferramentas do Playwright MCP:
- `navigate` - Navegar para URLs
- `screenshot` - Capturar screenshots
- `click` - Clicar em elementos
- `fill` - Preencher formulários
- `evaluate` - Executar JavaScript
- E muitas outras...

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` (opcional):

```env
PORT=3000
NODE_ENV=production
```

## ⚠️ Limitações da Vercel

- **Timeout:** 60s por request (tier Pro)
- **Stateless:** Cada request é independente
- **Recomendação:** Para testes longos, use Railway ou Render

## 🔄 Alternativas de Deploy

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render

1. Conecte seu repositório GitHub
2. Configure como "Web Service"
3. Start Command: `node api/sse.js`

## 📚 Documentação

- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Vercel Docs](https://vercel.com/docs)
