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
  .schema-table td:first-child { font-family: "SF Mono", "Fira Code", monospace; font-size: .8rem; }
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
  <p>Esta API recebe webhooks (notificações) enviados pelo <strong>Mercado Livre</strong>. As notificações informam em tempo real sobre mudanças nos recursos da plataforma: pedidos, itens, perguntas, pagamentos, envios e muito mais.</p>
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
    <li>Selecione os <strong>tópicos</strong> desejados (orders_v2, items, questions, payments, etc.)</li>
    <li>Salve as configurações</li>
    <li>
      O Mercado Livre começará a enviar notificações para a URL configurada.
      Consulte a API para conferir o resultado:
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
  <h2>Formato das Notificações</h2>
  <p>Todas as notificações do Mercado Livre seguem uma estrutura comum, com poucas variações entre tópicos.</p>

  <h3>Estrutura Padrão (Tópico Geral)</h3>
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

  <h3>Estrutura com Subtópicos</h3>
  <p>Alguns tópicos organizam as notificações em subtópicos (filtros), indicados pelo campo <code>actions</code>.</p>
  <pre>{
  "id": "aaa123bbbbb",
  "resource": "/vis_leads/93a14ee6-...",
  "user_id": 123456789,
  "topic": "vis_leads",
  "actions": ["visit_request"],
  "application_id": 1111111111111111111,
  "attempts": 1,
  "sent": "2017-10-09T13:44:33.006Z",
  "received": "2017-10-09T13:44:32.984Z"
}</pre>
</section>

<section>
  <h2>Tópicos Disponíveis</h2>
  <table class="schema-table">
    <tr><th>Tópico</th><th>Descrição</th><th>Exemplo de Resource</th></tr>
    <tr>
      <td><code>orders_v2</code></td>
      <td>Criação e alterações em vendas confirmadas</td>
      <td><code>/orders/2195160686</code></td>
    </tr>
    <tr>
      <td><code>items</code></td>
      <td>Mudanças em itens publicados</td>
      <td><code>/items/MLA686791111</code></td>
    </tr>
    <tr>
      <td><code>questions</code></td>
      <td>Perguntas e respostas feitas</td>
      <td><code>/questions/5036111111</code></td>
    </tr>
    <tr>
      <td><code>messages</code></td>
      <td>Mensagens de pós-venda (criadas/lidas)</td>
      <td><code>3f6da1e35ac84f70...</code></td>
    </tr>
    <tr>
      <td><code>payments</code></td>
      <td>Pagamentos criados ou com status alterado</td>
      <td><code>/collections/3043111111</code></td>
    </tr>
    <tr>
      <td><code>shipments</code></td>
      <td>Criação e alterações em envios</td>
      <td><code>/shipments/...</code></td>
    </tr>
    <tr>
      <td><code>invoices</code></td>
      <td>Notas fiscais geradas pelo Faturador ML</td>
      <td><code>/users/123/invoices/...</code></td>
    </tr>
    <tr>
      <td><code>price_suggestion</code></td>
      <td>Sugestões de preços</td>
      <td><code>suggestions/items/.../details</code></td>
    </tr>
    <tr>
      <td><code>vis_leads</code></td>
      <td>Leads de imóveis (whatsapp, call, question)</td>
      <td><code>/vis/leads/14b52fd8-...</code></td>
    </tr>
    <tr>
      <td><code>post_purchase</code></td>
      <td>Reclamações e ações em reclamações</td>
      <td><code>/post-purchase/v1/claims/...</code></td>
    </tr>
    <tr>
      <td><code>catalog_item_competition_status</code></td>
      <td>Mudanças de status em competição de catálogo</td>
      <td><code>/items/ITEM_ID/price_to_win</code></td>
    </tr>
    <tr>
      <td><code>catalog_suggestions</code></td>
      <td>Sugestões de produtos para o catálogo (Brand Central)</td>
      <td><code>/catalog_suggestions/...</code></td>
    </tr>
    <tr>
      <td><code>public_offers</code></td>
      <td>Criação ou alteração de ofertas em itens</td>
      <td><code>/seller-promotions/offers/...</code></td>
    </tr>
    <tr>
      <td><code>public_candidates</code></td>
      <td>Itens candidatos a promoções</td>
      <td><code>/seller-promotions/candidates/...</code></td>
    </tr>
    <tr>
      <td><code>fbm_stock_operations</code></td>
      <td>Operações de estoque FBM</td>
      <td><code>/stock/fulfillment/operations/...</code></td>
    </tr>
    <tr>
      <td><code>flex-handshakes</code></td>
      <td>Transferências de pacotes entre transportadoras</td>
      <td><code>/flex/sites/MLA/shipments/.../assignment/v1</code></td>
    </tr>
    <tr>
      <td><code>leads-credits</code></td>
      <td>Créditos aprovados ou rejeitados (veículos e imóveis)</td>
      <td><code>/vis/loan/66e93589-...</code></td>
    </tr>
    <tr>
      <td><code>stock-location</code></td>
      <td>Modificações de estoque em user_products</td>
      <td><code>/user-products/.../stock</code></td>
    </tr>
  </table>
</section>

<section>
  <h2>Exemplos de Notificações por Tópico</h2>

  <h3>orders_v2</h3>
  <pre>{
  "resource": "/orders/2195160686",
  "user_id": 468424240,
  "topic": "orders_v2",
  "application_id": 5503910054141466,
  "attempts": 1,
  "sent": "2019-10-30T16:19:20.129Z",
  "received": "2019-10-30T16:19:20.106Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/orders/$ORDER_ID</pre>

  <h3>items</h3>
  <pre>{
  "resource": "/items/MLA686791111",
  "user_id": 123456789,
  "topic": "items",
  "application_id": 2069392825111111,
  "attempts": 1,
  "sent": "2017-10-09T13:44:33.006Z",
  "received": "2017-10-09T13:44:32.984Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/items/$ITEM_ID</pre>

  <h3>questions</h3>
  <pre>{
  "resource": "/questions/5036111111",
  "user_id": 123456789,
  "topic": "questions",
  "application_id": 2069392825111111,
  "attempts": 1,
  "sent": "2017-10-09T13:51:05.464Z",
  "received": "2017-10-09T13:51:05.438Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/questions/$QUESTION_ID</pre>

  <h3>messages</h3>
  <pre>{
  "id": "5e2827f2-99b7-474e-b68b-6a86e934cc7e",
  "resource": "3f6da1e35ac84f70a24af7360d24c7bc",
  "user_id": 123456789,
  "topic": "messages",
  "actions": ["created"],
  "application_id": 89745685555,
  "attempts": 1,
  "sent": "2017-10-09T13:44:33.006Z",
  "received": "2017-10-09T13:44:32.984Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/messages/$RESOURCE</pre>

  <h3>payments</h3>
  <pre>{
  "resource": "/collections/3043111111",
  "user_id": 123456789,
  "topic": "payments",
  "application_id": 2069392825111111,
  "attempts": 1,
  "sent": "2017-10-09T13:58:22.081Z",
  "received": "2017-10-09T13:58:22.061Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/collections/$PAYMENT_ID</pre>

  <h3>shipments</h3>
  <pre>{
  "resource": "/stock/fulfillment/operations/9876",
  "user_id": 1234,
  "topic": "fbm_stock_operations",
  "application_id": 12341234,
  "attempts": 1,
  "sent": "2017-10-09T13:58:23.347Z",
  "received": "2017-10-09T13:58:23.329Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/$RESOURCE</pre>

  <h3>post_purchase (claims)</h3>
  <pre>{
  "id": "5e2827f2-99b7-474e-b68b-6a86e934cc7e",
  "resource": "/post-purchase/v1/claims/5108684499",
  "user_id": 123456789,
  "topic": "post_purchase",
  "actions": ["claims"],
  "application_id": 89745685555,
  "attempts": 1,
  "sent": "2017-10-09T13:44:33.006Z",
  "received": "2017-10-09T13:44:32.984Z"
}</pre>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  https://api.mercadolibre.com/$RESOURCE</pre>
</section>

<section>
  <h2>Regras Importantes</h2>
  <ul>
    <li><strong>Tempo de resposta:</strong> Responda com HTTP 200 em até <strong>500ms</strong>. Caso contrário, o Mercado Livre fará novas tentativas.</li>
    <li><strong>Retry:</strong> As notificações serão reenviadas por até <strong>1 hora</strong> (8 tentativas). Após esse período, são descartadas.</li>
    <li><strong>Filas:</strong> Recomenda-se usar filas — confirme o recebimento (HTTP 200) imediatamente e consulte a API depois.</li>
    <li><strong>Histórico:</strong> Use a API <code>missed_feeds</code> para recuperar notificações perdidas (até 2 dias).</li>
  </ul>

  <h3>IPs dos Servidores</h3>
  <p>Se você usa filtros de IP, adicione os seguintes endereços:</p>
  <pre>54.88.218.97
18.215.140.160
18.213.114.129
18.206.34.84
35.236.253.169
35.245.91.34
35.245.20.104
35.186.182.146</pre>

  <h3>Consultar Notificações Perdidas</h3>
  <pre>curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' \\
  "https://api.mercadolibre.com/missed_feeds?app_id=$APP_ID"</pre>
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
