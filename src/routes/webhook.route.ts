import { Router } from "express";
import type { Request, Response } from "express";
import { getIntegration, listIntegrations } from "../integrations/registry";
import { validateRequest, buildWebhookRecord, type ValidationResult } from "../services/validation.service";
import { storage } from "../services/storage.service";
import { getResponseTime } from "../middlewares/timer";
import { logger } from "../utils/logger";
import { IntegrationNotFoundError } from "../utils/errors";

const router = Router();

router.post("/webhook/:integration", async (req: Request, res: Response) => {
  const { integration } = req.params;
  const rawBody = (req as any).rawBody ?? JSON.stringify(req.body);

  logger.info({ integration }, "Webhook recebido");

  let config;
  try {
    config = getIntegration(integration);
  } catch (err) {
    if (err instanceof IntegrationNotFoundError) {
      res.status(404).json({
        error: `Integração '${integration}' não encontrada`,
        availableIntegrations: listIntegrations(),
      });
      return;
    }
    throw err;
  }

  if (integration === "mercadolivre") {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const responseTimeMs = getResponseTime(req);
    const status = 400;
    const validation: ValidationResult = {
      passed: false,
      errors: ["Mercado Livre webhook temporariamente desabilitado"],
    };

    const record = buildWebhookRecord(
      integration,
      req,
      rawBody,
      validation,
      responseTimeMs,
      status
    );

    storage.save(record);

    logger.info({ id: record.id, integration }, "Webhook Mercado Livre rejeitado após 2s");

    res.status(status).json({
      id: record.id,
      integration: record.integration,
      passed: record.passed,
      errors: record.errors,
      responseTimeMs: record.responseTimeMs,
      status,
    });
    return;
  }

  const responseTimeMs = getResponseTime(req);
  const validation = validateRequest(config, req, rawBody, responseTimeMs);
  const status = validation.passed
    ? (config.rules.mustReturnStatus ?? 200)
    : 400;

  const record = buildWebhookRecord(
    integration,
    req,
    rawBody,
    validation,
    responseTimeMs,
    status
  );

  storage.save(record);

  logger.info(
    { id: record.id, passed: record.passed, errors: record.errors },
    "Webhook processado"
  );

  res.status(status).json({
    id: record.id,
    integration: record.integration,
    passed: record.passed,
    errors: record.errors,
    responseTimeMs: record.responseTimeMs,
    status,
  });
});

export default router;
