import type { IntegrationConfig } from "@/types";
import { IntegrationNotFoundError } from "@/utils/errors";
import { integrations } from "./index";

let registry: Map<string, IntegrationConfig> | null = null;

function buildRegistry(): Map<string, IntegrationConfig> {
  const map = new Map<string, IntegrationConfig>();

  for (const config of integrations) {
    if (!config.name || !config.rules) {
      continue;
    }
    map.set(config.name, config);
  }

  return map;
}

export function getRegistry(): Map<string, IntegrationConfig> {
  if (!registry) {
    registry = buildRegistry();
  }
  return registry;
}

export function getIntegration(name: string): IntegrationConfig {
  const config = getRegistry().get(name);
  if (!config) {
    throw new IntegrationNotFoundError(name);
  }
  return config;
}

export function listIntegrations(): string[] {
  return Array.from(getRegistry().keys());
}

export function resetRegistry(): void {
  registry = null;
}
