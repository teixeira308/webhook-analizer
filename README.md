# Zenvia Webhook Analyzer

API para receber, validar e monitorar webhooks da [Zenvia](https://www.zenvia.com/).

## Funcionalidades

- Recebe webhooks de eventos **MESSAGE** e **MESSAGE_STATUS** da Zenvia
- Valida payload contra schema, headers obrigatórios (`x-api-token`), método HTTP e tamanho
- Armazena histórico de todos os webhooks recebidos
- Consulta e filtra requisições por integração, status e limite
- Estatísticas de aprovação/rejeição por integração
- Documentação interativa em `/documentation`

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/webhook/zenvia` | Recebe e valida um webhook da Zenvia |
| `GET` | `/requests` | Lista webhooks recebidos |
| `GET` | `/requests/:id` | Detalhes de um webhook |
| `GET` | `/stats` | Estatísticas dos webhooks |
| `DELETE` | `/stats` | Remove registros |
| `GET` | `/health` | Health check |
| `GET` | `/documentation` | Documentação interativa |

### POST /webhook/zenvia

Header obrigatório: `x-api-token`

```json
{
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
}
```

## Como rodar

```bash
# Instalar dependências
npm install

# Desenvolvimento (com hot reload)
npm run dev

# Build
npm run build

# Produção
npm start
```

Acesse `http://localhost:3000`.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Validação:** Zod
- **Logs:** Pino
