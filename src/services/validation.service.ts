import type { Request } from "express";
import type { IntegrationConfig, WebhookRequest } from "../types";
import { v4 as uuid } from "uuid";
import { logger } from "../utils/logger";

export interface ValidationResult {
  passed: boolean;
  errors: string[];
}

function validateMethod(
  config: IntegrationConfig,
  method: string
): string | null {
  const allowed = config.rules.expectedMethods;
  if (!allowed || allowed.length === 0) return null;
  if (!allowed.includes(method)) {
    return `Método HTTP '${method}' não permitido. Esperado: ${allowed.join(", ")}`;
  }
  return null;
}

function validateHeaders(
  config: IntegrationConfig,
  headers: Record<string, string | string[] | undefined>
): string[] {
  const required = config.rules.requiredHeaders;
  if (!required || required.length === 0) return [];

  const errors: string[] = [];
  for (const header of required) {
    const value = headers[header.toLowerCase()];
    if (!value) {
      errors.push(`Header '${header}' ausente`);
    }
  }
  return errors;
}

function validatePayloadSize(
  config: IntegrationConfig,
  rawBody: string
): string | null {
  const maxKb = config.rules.maxPayloadSizeKb;
  if (!maxKb) return null;

  const sizeKb = Buffer.byteLength(rawBody, "utf-8") / 1024;
  if (sizeKb > maxKb) {
    return `Payload muito grande: ${sizeKb.toFixed(2)}KB (máximo: ${maxKb}KB)`;
  }
  return null;
}

function validateResponseTime(
  config: IntegrationConfig,
  responseTimeMs: number
): string | null {
  const maxMs = config.rules.maxResponseTimeMs;
  if (!maxMs) return null;

  if (responseTimeMs > maxMs) {
    return `Tempo de resposta acima de ${maxMs}ms (${responseTimeMs.toFixed(2)}ms)`;
  }
  return null;
}

function validateBodySchema(
  config: IntegrationConfig,
  body: unknown
): string | null {
  if (!config.schema) return null;

  const result = config.schema.safeParse(body);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return `Schema inválido: ${issues}`;
  }
  return null;
}

export function validateRequest(
  config: IntegrationConfig,
  expressReq: Request,
  rawBody: string,
  responseTimeMs: number
): ValidationResult {
  const errors: string[] = [];

  const methodError = validateMethod(config, expressReq.method);
  if (methodError) errors.push(methodError);

  const headerErrors = validateHeaders(config, expressReq.headers as Record<string, string | string[] | undefined>);
  errors.push(...headerErrors);

  const sizeError = validatePayloadSize(config, rawBody);
  if (sizeError) errors.push(sizeError);

  const timeError = validateResponseTime(config, responseTimeMs);
  if (timeError) errors.push(timeError);

  const schemaError = validateBodySchema(config, expressReq.body);
  if (schemaError) errors.push(schemaError);

  return {
    passed: errors.length === 0,
    errors,
  };
}

export function buildWebhookRecord(
  integration: string,
  expressReq: Request,
  rawBody: string,
  validation: ValidationResult,
  responseTimeMs: number,
  status: number
): WebhookRequest {
  return {
    id: uuid(),
    timestamp: new Date().toISOString(),
    integration,
    method: expressReq.method,
    headers: expressReq.headers as Record<string, string | string[] | undefined>,
    body: expressReq.body,
    payloadSize: Buffer.byteLength(rawBody, "utf-8"),
    responseTimeMs: Math.round(responseTimeMs * 100) / 100,
    status,
    passed: validation.passed,
    errors: validation.errors,
  };
}
