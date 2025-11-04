#!/usr/bin/env node
/**
 * Servidor MCP SSE Remoto para Playwright
 * 
 * Este servidor expõe as ferramentas do Playwright MCP via SSE (Server-Sent Events)
 * permitindo acesso remoto via HTTP/HTTPS.
 */

const express = require('express');
const { createConnection } = require('../index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Playwright MCP SSE Server',
    version: require('../package.json').version
  });
});

// Endpoint SSE principal
app.post('/sse', async (req, res) => {
  console.log('Nova conexão SSE recebida');

  // Configurar headers SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  try {
    // Criar conexão MCP
    const connection = await createConnection();
    
    // Simular stdio via SSE
    const mockStdio = {
      stdin: {
        on: (event, handler) => {
          if (event === 'data') {
            // Processar mensagens do cliente
            req.on('data', (chunk) => {
              handler(chunk);
            });
          }
        }
      },
      stdout: {
        write: (data) => {
          // Enviar resposta via SSE
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
      }
    };

    // Processar mensagem inicial se houver
    if (req.body && Object.keys(req.body).length > 0) {
      const message = JSON.stringify(req.body);
      mockStdio.stdout.write({ type: 'response', data: message });
    }

    // Manter conexão aberta
    req.on('close', () => {
      console.log('Conexão SSE fechada');
      res.end();
    });

  } catch (error) {
    console.error('Erro no servidor SSE:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Endpoint para listar ferramentas disponíveis
app.get('/tools', async (req, res) => {
  try {
    const connection = await createConnection();
    // Aqui você pode implementar lógica para listar as tools
    res.json({ 
      message: 'Ferramentas Playwright MCP disponíveis',
      tools: [
        'navigate',
        'screenshot',
        'click',
        'fill',
        'evaluate',
        // Adicione outras ferramentas conforme necessário
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Playwright MCP SSE Server rodando em http://localhost:${PORT}`);
    console.log(` Endpoint SSE: http://localhost:${PORT}/sse`);
    console.log(` Ferramentas: http://localhost:${PORT}/tools`);
  });
}

module.exports = app;
