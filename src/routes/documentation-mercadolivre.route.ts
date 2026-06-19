import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/documentation/mercadolivre", (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mercado Livre Webhook - Documentação</title>
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
  a { color: #58a6ff; }
  strong { color: #f0f6fc; }
</style>
</head>
<body>
<div class="container">

<header>
  <div class="logo">🛒</div>
  <h1>Mercado Livre Webhook</h1>
  <p>API para receber e validar notificações do Mercado Livre</p>
</header>

<section>
  <h2>Visão Geral</h2>
  <p>Esta API recebe webhooks (notificações) enviados pelo <strong>Mercado Livre</strong> quando ocorrem mudanças nos recursos da plataforma — pedidos, itens, perguntas, pagamentos, envios, etc.</p>
  <p>Os payloads são validados conforme as regras da integração: método <code>POST</code>, payload de até 512KB e resposta em até 500ms.</p>
</section>

<section>
  <h2>Como Configurar no Mercado Livre</h2>
  <ol>
    <li>
      Acesse o <a href="http://applications.mercadolibre.com/" target="_blank" rel="noopener">gerenciador de aplicativos</a>
      do Mercado Livre
    </li>
    <li>Selecione seu aplicativo ou crie um novo</li>
    <li>
      Na seção de <strong>Notificações</strong>, configure a <strong>Callback URL</strong>:
      <code>https://webhook-analizer.vercel.app/webhook/mercadolivre</code>
    </li>
    <li>Selecione os <strong>tópicos</strong> desejados e salve</li>
    <li>
      Após configurar, consulte a API para conferir as notificações recebidas:
      <pre style="margin-top: .6rem;"># Listar notificações recebidas do Mercado Livre
curl https://webhook-analizer.vercel.app/requests?integration=mercadolivre

# Ver estatísticas
curl https://webhook-analizer.vercel.app/stats

# Detalhes de uma notificação específica
curl https://webhook-analizer.vercel.app/requests/&lt;id&gt;</pre>
    </li>
  </ol>
</section>

<section>
  <h2>Formato da Notificação</h2>
  <p>O Mercado Livre envia notificações via <strong>HTTP POST</strong> para a Callback URL configurada. O payload segue o formato abaixo:</p>

  <h3>Estrutura Padrão</h3>
  <pre>{
  "_id": "f9f08571-...",
  "resource": "/items/MLA686791111",
  "user_id": 123456789,
  "topic": "items",
  "application_id": 2069392825111111,
  "attempts": 1,
  "sent": "2025-01-21T13:44:33.006Z",
  "received": "2025-01-21T13:44:32.984Z"
}</pre>

  <h3>Campos</h3>
  <table>
    <tr><th>Campo</th><th>Tipo</th><th>Descrição</th></tr>
    <tr><td><code>resource</code></td><td>string</td><td>Caminho do recurso que sofreu alteração</td></tr>
    <tr><td><code>user_id</code></td><td>number</td><td>ID do usuário dono do recurso</td></tr>
    <tr><td><code>topic</code></td><td>string</td><td>Tópico da notificação (items, orders_v2, payments, etc)</td></tr>
    <tr><td><code>application_id</code></td><td>number</td><td>ID do aplicativo configurado</td></tr>
    <tr><td><code>attempts</code></td><td>number</td><td>Número da tentativa de entrega</td></tr>
    <tr><td><code>sent</code></td><td>string</td><td>Timestamp do envio (UTC)</td></tr>
    <tr><td><code>received</code></td><td>string</td><td>Timestamp do recebimento (UTC)</td></tr>
    <tr><td><code>actions</code></td><td>string[]</td><td>Filtros/subtópicos (opcional, ex: ["created"])</td></tr>
  </table>

  <h3>Como consultar o recurso</h3>
  <p>Com o <code>resource</code> recebido, faça uma requisição GET para a API do Mercado Livre:</p>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com$RESOURCE</pre>

  <h3>Regras importantes</h3>
  <ul>
    <li>Responda com <strong>HTTP 200</strong> em até <strong>500ms</strong></li>
    <li>Reenvios acontecem por até <strong>1 hora</strong> (8 tentativas)</li>
    <li>O campo <code>resource</code> de notificações <code>post_purchase</code> inclui o prefixo <code>/post-purchase</code></li>
  </ul>
</section>

<section>
  <h2>Endpoints</h2>

  <div class="endpoint">
    <div><span class="method post">POST</span><span class="path">/webhook/mercadolivre</span></div>
    <div class="desc">Envia uma notificação do Mercado Livre para validação e armazenamento.</div>
    <h3>Headers</h3>
    <table>
      <tr><th>Header</th><th>Descrição</th></tr>
      <tr><td><code>Content-Type</code></td><td><code>application/json</code></td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl -X POST https://webhook-analizer.vercel.app/webhook/mercadolivre \\
  -H "Content-Type: application/json" \\
  -d '{
    "resource": "/orders/2195160686",
    "user_id": 468424240,
    "topic": "orders_v2",
    "application_id": 5503910054141466,
    "attempts": 1,
    "sent": "2025-06-18T12:00:00.000Z",
    "received": "2025-06-18T12:00:00.000Z"
  }'</pre>
    <h3>Resposta (200 - válido)</h3>
    <pre>{
  "id": "abc123",
  "integration": "mercadolivre",
  "passed": true,
  "errors": [],
  "responseTimeMs": 12,
  "status": 200
}</pre>
    <h3>Resposta (400 - inválido)</h3>
    <pre>{
  "id": "def456",
  "integration": "mercadolivre",
  "passed": false,
  "errors": [
    "Body: resource é obrigatório"
  ],
  "responseTimeMs": 3,
  "status": 400
}</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/requests</span></div>
    <div class="desc">Lista notificações recebidas, com filtros opcionais.</div>
    <h3>Query params</h3>
    <table>
      <tr><th>Nome</th><th>Tipo</th><th>Descrição</th></tr>
      <tr><td><code>integration</code></td><td>string</td><td>Filtrar por integração</td></tr>
      <tr><td><code>passed</code></td><td>boolean</td><td><code>true</code> (válidos) ou <code>false</code> (inválidos)</td></tr>
      <tr><td><code>limit</code></td><td>number</td><td>Máximo de resultados (padrão: 50)</td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl "https://webhook-analizer.vercel.app/requests?integration=mercadolivre&passed=true&limit=10"</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/requests/:id</span></div>
    <div class="desc">Retorna os detalhes de uma notificação específica pelo ID.</div>
    <h3>Exemplo</h3>
    <pre>curl https://webhook-analizer.vercel.app/requests/abc123</pre>
  </div>

  <div class="endpoint">
    <div><span class="method get">GET</span><span class="path">/stats</span></div>
    <div class="desc">Estatísticas das notificações recebidas (total, aprovados, rejeitados, etc).</div>
    <h3>Headers</h3>
    <table>
      <tr><th>Header</th><th>Descrição</th></tr>
      <tr><td><code>x-integration</code></td><td>Filtrar por integração (opcional)</td></tr>
    </table>
    <h3>Exemplo</h3>
    <pre>curl -H "x-integration: mercadolivre" https://webhook-analizer.vercel.app/stats</pre>
  </div>

  <div class="endpoint">
    <div><span class="method delete">DELETE</span><span class="path">/stats</span></div>
    <div class="desc">Limpa os registros de notificações armazenados.</div>
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
  Webhook Analyzer &mdash; Documentação focada na integração Mercado Livre
</footer>

</div>
</body>
</html>`);
});

export default router;
