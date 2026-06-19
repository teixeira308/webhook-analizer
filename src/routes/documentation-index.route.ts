import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/documentation", (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Webhook Analyzer - Documentação</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6; color: #e6edf3; background: #0d1117; padding: 2rem 1rem;
  }
  .container { max-width: 720px; margin: 0 auto; text-align: center; }
  header { margin-bottom: 2.5rem; }
  header h1 { font-size: 2rem; color: #f0f6fc; margin-bottom: .5rem; }
  header p { color: #8b949e; }
  .cards { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
  .card {
    background: #161b22; border-radius: 8px; padding: 2rem; width: 300px;
    border: 1px solid #30363d; text-decoration: none; color: inherit;
    transition: border-color .2s, transform .2s;
  }
  .card:hover { border-color: #58a6ff; transform: translateY(-2px); }
  .card .icon { font-size: 2.5rem; margin-bottom: .8rem; }
  .card h2 { font-size: 1.2rem; color: #f0f6fc; margin-bottom: .5rem; }
  .card p { color: #8b949e; font-size: .9rem; }
  footer { text-align: center; color: #484f58; font-size: .85rem; margin-top: 3rem; }
</style>
</head>
<body>
<div class="container">

<header>
  <h1>Webhook Analyzer</h1>
  <p>Documentação das integrações disponíveis</p>
</header>

<div class="cards">
  <a href="/documentation/zenvia" class="card">
    <div class="icon">☎️</div>
    <h2>Zenvia Webhook</h2>
    <p>Plataforma de comunicação CPaaS — mensagens WhatsApp, SMS, Email</p>
  </a>
  <a href="/documentation/mercadolivre" class="card">
    <div class="icon">🛒</div>
    <h2>Mercado Livre Webhook</h2>
    <p>Notificações de orders, items, questions, payments, shipments e muito mais</p>
  </a>
</div>

<footer>
  Webhook Analyzer &mdash; Selecione uma integração para ver a documentação completa
</footer>

</div>
</body>
</html>`);
});

export default router;
