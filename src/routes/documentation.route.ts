import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/documentation/zenvia", (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zenvia Webhook - Documentação</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6; color: #e6edf3; background: #0d1117; padding: 2rem 1rem;
  }
  .container { max-width: 960px; margin: 0 auto; }
  header { text-align: center; margin-bottom: 2.5rem; }
  header h1 { font-size: 2rem; color: #f0f6fc; }
  header p { color: #8b949e; margin-top: .5rem; }
  .logo { font-size: 2.5rem; margin-bottom: .5rem; }
  section { background: #161b22; border-radius: 8px; padding: 1.5rem 2rem; margin-bottom: 1.5rem; border: 1px solid #30363d; }
  h2 { font-size: 1.25rem; color: #f0f6fc; margin-bottom: 1rem; border-bottom: 2px solid #30363d; padding-bottom: .5rem; }
  h3 { font-size: 1rem; color: #79c0ff; margin: 1rem 0 .5rem; }
  .endpoint { background: #0d1117; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; border: 1px solid #30363d; }
  .endpoint:last-child { margin-bottom: 0; }
  .method { display: inline-block; font-weight: 700; font-size: .8rem; padding: 2px 8px; border-radius: 4px; color: #fff; margin-right: .5rem; }
  .method.get { background: #238636; }
  .method.post { background: #1f6feb; }
  .method.delete { background: #da3633; }
  .path { font-family: "SF Mono", "Fira Code", monospace; font-size: .9rem; color: #e6edf3; }
  .desc { margin-top: .4rem; color: #8b949e; font-size: .9rem; }
  pre {
    background: #010409; color: #e6edf3; padding: 1rem; border-radius: 6px;
    font-size: .85rem; overflow-x: auto; margin: .6rem 0; border: 1px solid #30363d;
  }
  code { font-family: "SF Mono", "Fira Code", monospace; background: #161b22; padding: 1px 4px; border-radius: 4px; font-size: .85em; }
  pre code { background: none; padding: 0; }
  ol { padding-left: 1.5rem; font-size: .9rem; }
  ol li { margin-bottom: .8rem; color: #e6edf3; }
  ul { padding-left: 1.25rem; color: #8b949e; font-size: .9rem; }
  li { margin-bottom: .3rem; }
  table { width: 100%; border-collapse: collapse; font-size: .9rem; }
  th, td { text-align: left; padding: .5rem; border-bottom: 1px solid #30363d; }
  th { color: #f0f6fc; font-weight: 600; }
  footer { text-align: center; color: #484f58; font-size: .85rem; margin-top: 2rem; }
  .badge { display: inline-block; background: #21262d; color: #8b949e; font-size: .75rem; padding: 2px 8px; border-radius: 10px; margin: 2px; border: 1px solid #30363d; }
  .schema-table td:first-child { font-family: "SF Mono", "Fira Code", monospace; font-size: .8rem; }
  a { color: #58a6ff; }
  strong { color: #f0f6fc; }
</style>
</head>
<body>
<div class="container">

<header>
  <div class="logo">☎️</div>
  <h1>Zenvia Webhook</h1>
  <p>API para receber e validar webhooks da Zenvia</p>
</header>

<section>
  <h2>Visão Geral</h2>
  <p>Esta API recebe webhooks enviados pela <strong>Zenvia</strong> (plataforma de comunicação CPaaS). Os payloads são validados conforme as regras da integração: método <code>POST</code>, payload de até 512KB e resposta em até 1s.</p>
</section>

<section>
  <h2>Como Testar no Sandbox Zenvia</h2>
  <ol>
    <li>
      Acesse o <a href="https://sandbox.zenvia.com" target="_blank" rel="noopener">Zenvia Sandbox</a>
      e faça login com sua <strong>conta Google</strong>
    </li>
    <li>
      Crie um novo <strong>teste</strong> e selecione o canal desejado
      (WhatsApp, SMS, Email, etc.)
    </li>
    <li>Adicione os <strong>contatos de teste</strong> para o envio</li>
    <li>
      Na seção de <strong>Webhook</strong>, configure a URL:
      <code>https://webhook-analizer.vercel.app/webhook/zenvia</code>
    </li>
    <li><strong>Envie uma mensagem</strong> de teste pelo sandbox</li>
    <li>
      A Zenvia disparará um webhook para a URL configurada.
      Consulte a API para conferir o resultado:
      <pre style="margin-top: .6rem;"># Listar webhooks recebidos da Zenvia
curl https://webhook-analizer.vercel.app/requests?integration=zenvia

# Ver estatísticas
curl https://webhook-analizer.vercel.app/stats

# Detalhes de um webhook específico
curl https://webhook-analizer.vercel.app/requests/&lt;id&gt;</pre>
    </li>
  </ol>
</section>

<section>
  <h2>Webhook — Message Events</h2>
  <p>A Zenvia envia webhooks para os seguintes tipos de evento.
  Documentação oficial:
  <a href="https://zenvia.github.io/zenvia-openapi-spec/v2/#section/MESSAGE" target="_blank" rel="noopener">MESSAGE</a> •
  <a href="https://zenvia.github.io/zenvia-openapi-spec/v2/#section/MESSAGE_STATUS" target="_blank" rel="noopener">MESSAGE_STATUS</a>
  </p>
  <table class="schema-table">
    <tr><th>Tipo</th><th>Descrição</th></tr>
    <tr><td><code>MESSAGE</code></td><td>Notificação de mensagem recebida ou enviada</td></tr>
    <tr><td><code>MESSAGE_STATUS</code></td><td>Atualização de status de uma mensagem (entregue, lida, rejeitada, etc)</td></tr>
  </table>

  <h3>Schema MESSAGE</h3>
  <pre>{
  "id": "string (Event Id)",
  "timestamp": "string &lt;date-time&gt; (Event Timestamp)",
  "subscriptionId": "string (Webhook ID)",
  "type": "MESSAGE",
  "channel": "string (Message Channel)",
  "direction": "IN | OUT",
  "message": {
    "id": "string",
    "from": "string",
    "to": "string",
    "direction": "IN | OUT",
    "channel": "string",
    "contents": [
      { "type": "text", "text": "string", "payload": "string" }
    ],
    "timestamp": "string &lt;date-time&gt;",
    "visitor": {
      "name": "string",
      "firstName": "string",
      "lastName": "string",
      "userName": "string",
      "picture": "string"
    },
    "referral": {
      "headline": "string",
      "body": "string",
      "source": {
        "id": "string",
        "type": "string",
        "url": "string",
        "text": "string",
        "user": "string",
        "timestamp": "string"
      },
      "ctwaId": "string"
    },
    "idRef": "string"
  }
}</pre>

  <h3>Schema MESSAGE_STATUS</h3>
  <pre>{
  "id": "string (Event Id)",
  "timestamp": "string &lt;date-time&gt; (Event Timestamp)",
  "subscriptionId": "string (Webhook ID)",
  "type": "MESSAGE_STATUS",
  "channel": "string (Message Channel)",
  "messageId": "string (Message ID)",
  "contentIndex": 0,
  "message": {
    "id": "string",
    "externalId": "string",
    "contentIndex": 0,
    "direction": "IN | OUT",
    "from": "string",
    "to": "string"
  },
  "messageStatus": {
    "code": "RECORDED | SENT | DELIVERED | READ | REJECTED | NOT_DELIVERED",
    "timestamp": "string &lt;date-time&gt;",
    "channel": "string",
    "description": "string",
    "direction": "IN | OUT",
    "causes": [
      {
        "channelErrorCode": "string",
        "reason": "string",
        "details": "string"
      }
    ],
    "context": {
      "button": { "type": "text", "payload": "string" }
    },
    "channelData": {
      "sms": { "carrier": "VIVO_BR" },
      "rcs": { "realChannel": "sms" },
      "email": {
        "clientInfo": {
          "machineOpen": true,
          "userAgent": "string",
          "sourceIp": "string",
          "url": "string"
        }
      }
    },
    "details": {
      "file": {
        "url": "string",
        "name": "string",
        "sizeBytes": 0,
        "mimeType": "string"
      }
    }
  }
}</pre>

  <h3>Status codes (messageStatus.code)</h3>
  <p>
    <span class="badge">RECORDED</span>
    <span class="badge">SENT</span>
    <span class="badge">DELIVERED</span>
    <span class="badge">READ</span>
    <span class="badge">REJECTED</span>
    <span class="badge">NOT_DELIVERED</span>
  </p>
</section>

<section>
  <h2>Endpoints</h2>

  <div class="endpoint">
    <div><span class="method post">POST</span><span class="path">/webhook/zenvia</span></div>
    <div class="desc">Envia um webhook da Zenvia para validação e armazenamento.</div>
    <h3>Headers</h3>
    <table>
      <tr><th>Header</th><th>Descrição</th></tr>
      <tr><td><code>Content-Type</code></td><td><code>application/json</code></td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl -X POST https://webhook-analizer.vercel.app/webhook/zenvia \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "evt_abc123",
    "timestamp": "2025-06-18T12:00:00.000Z",
    "type": "MESSAGE",
    "subscriptionId": "sub_xyz",
    "direction": "IN",
    "channel": "whatsapp",
    "message": {
      "id": "msg_123",
      "from": "5511999999999",
      "to": "5511888888888",
      "direction": "IN",
      "channel": "whatsapp",
      "contents": [{ "type": "text", "text": "Olá!" }]
    }
  }'</pre>
    <h3>Resposta (200 - válido)</h3>
    <pre>{
  "id": "abc123",
  "integration": "zenvia",
  "passed": true,
  "errors": [],
  "responseTimeMs": 12,
  "status": 200
}</pre>
    <h3>Resposta (400 - inválido)</h3>
    <pre>{
  "id": "def456",
  "integration": "zenvia",
  "passed": false,
  "errors": [
    "Body: tipo de evento inválido"
  ],
  "responseTimeMs": 3,
  "status": 400
}</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/requests</span></div>
    <div class="desc">Lista webhooks recebidos, com filtros opcionais.</div>
    <h3>Query params</h3>
    <table>
      <tr><th>Nome</th><th>Tipo</th><th>Descrição</th></tr>
      <tr><td><code>integration</code></td><td>string</td><td>Filtrar por integração</td></tr>
      <tr><td><code>passed</code></td><td>boolean</td><td><code>true</code> (válidos) ou <code>false</code> (inválidos)</td></tr>
      <tr><td><code>limit</code></td><td>number</td><td>Máximo de resultados (padrão: 50)</td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl "https://webhook-analizer.vercel.app/requests?integration=zenvia&passed=true&limit=10"</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/requests/:id</span></div>
    <div class="desc">Retorna os detalhes de um webhook específico pelo ID.</div>
    <h3>Exemplo</h3>
    <pre>curl https://webhook-analizer.vercel.app/requests/abc123</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/stats</span></div>
    <div class="desc">Estatísticas dos webhooks recebidos (total, aprovados, rejeitados, etc).</div>
    <h3>Headers</h3>
    <table>
      <tr><th>Header</th><th>Descrição</th></tr>
      <tr><td><code>x-integration</code></td><td>Filtrar por integração (opcional)</td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl -H "x-integration: zenvia" https://webhook-analizer.vercel.app/stats</pre>
  </div>

  <div class="endpoint">
    <div><span class="method delete">DELETE</span><span class="path">/stats</span></div>
    <div class="desc">Limpa os registros de webhooks armazenados.</div>
    <h3>Headers</h3>
    <table>
      <tr><th>Header</th><th>Descrição</th></tr>
      <tr><td><code>x-integration</code></td><td>Remove apenas registros da integração (opcional)</td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl -X DELETE https://webhook-analizer.vercel.app/stats</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/health</span></div>
    <div class="desc">Health check do serviço.</div>
    <h3>Exemplo</h3>
    <pre>curl https://webhook-analizer.vercel.app/health</pre>
    <h3>Resposta</h3>
    <pre>{
  "status": "ok",
  "uptime": 3600,
  "version": "1.0.0",
  "timestamp": "2025-06-18T12:00:00.000Z"
}</pre>
  </div>
</section>

<footer>
  Webhook Analyzer &mdash; Documentação focada na integração Zenvia
</footer>

</div>
</body>
</html>`);
});

export default router;
