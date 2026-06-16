import type { ZodTypeAny } from "zod";

export interface IntegrationRules {
  maxResponseTimeMs?: number;
  requiredHeaders?: string[];
  expectedMethods?: string[];
  maxPayloadSizeKb?: number;
  mustReturnStatus?: number;
  payloadValidation?: boolean;
}

export interface IntegrationConfig {
  name: string;
  rules: IntegrationRules;
  schema?: ZodTypeAny;
}

export interface WebhookRequest {
  id: string;
  timestamp: string;
  integration: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  payloadSize: number;
  responseTimeMs: number;
  status: number;
  passed: boolean;
  errors: string[];
}

export interface RequestFilters {
  integration?: string;
  passed?: boolean;
  limit?: number;
}

export interface IntegrationStats {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  last24Hours: {
    success: number;
    fail: number;
  };
}

export interface Stats extends IntegrationStats {
  byIntegration: Record<string, IntegrationStats>;
}
