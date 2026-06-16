import fs from "node:fs";
import path from "node:path";
import type { WebhookRequest, RequestFilters, Stats, IntegrationStats } from "../types";

const DATA_DIR = path.resolve(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  "data"
);
const DATA_FILE = path.join(DATA_DIR, "requests.json");

function ensureDataFile(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    }
    return true;
  } catch {
    return false;
  }
}

function readAll(): WebhookRequest[] {
  if (!ensureDataFile()) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as WebhookRequest[];
  } catch {
    return [];
  }
}

function writeAll(requests: WebhookRequest[]): void {
  if (!ensureDataFile()) return;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2), "utf-8");
  } catch {
    // silent fail — dados em memória perdidos no próximo cold start
  }
}

function computeStats(list: WebhookRequest[]): IntegrationStats {
  if (list.length === 0) {
    return {
      totalRequests: 0,
      successRate: 100,
      averageResponseTime: 0,
      last24Hours: { success: 0, fail: 0 },
    };
  }

  const totalRequests = list.length;
  const passed = list.filter((r) => r.passed).length;
  const successRate = (passed / totalRequests) * 100;
  const averageResponseTime =
    list.reduce((acc, r) => acc + r.responseTimeMs, 0) / totalRequests;

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const last24 = list.filter(
    (r) => new Date(r.timestamp).getTime() >= twentyFourHoursAgo
  );
  const last24Success = last24.filter((r) => r.passed).length;
  const last24Fail = last24.filter((r) => !r.passed).length;

  return {
    totalRequests,
    successRate: Math.round(successRate * 100) / 100,
    averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    last24Hours: {
      success: last24Success,
      fail: last24Fail,
    },
  };
}

export const storage = {
  save(request: WebhookRequest): void {
    const requests = readAll();
    requests.push(request);
    writeAll(requests);
  },

  getById(id: string): WebhookRequest | undefined {
    return readAll().find((r) => r.id === id);
  },

  list(filters: RequestFilters = {}): WebhookRequest[] {
    let requests = readAll();

    if (filters.integration) {
      requests = requests.filter(
        (r) => r.integration === filters.integration
      );
    }

    if (filters.passed !== undefined) {
      requests = requests.filter((r) => r.passed === filters.passed);
    }

    requests.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const limit = filters.limit ?? 50;
    return requests.slice(0, limit);
  },

  getStats(integrationFilter?: string): Stats {
    let requests = readAll();

    if (integrationFilter) {
      requests = requests.filter((r) => r.integration === integrationFilter);
    }

    const byIntegration: Record<string, IntegrationStats> = {};
    const integrations = [...new Set(requests.map((r) => r.integration))];

    for (const name of integrations) {
      const filtered = requests.filter((r) => r.integration === name);
      byIntegration[name] = computeStats(filtered);
    }

    const global = computeStats(requests);

    return {
      ...global,
      byIntegration,
    };
  },

  clear(integrationFilter?: string): { removed: number } {
    let requests = readAll();
    const before = requests.length;

    if (integrationFilter) {
      requests = requests.filter((r) => r.integration !== integrationFilter);
    } else {
      requests = [];
    }

    writeAll(requests);
    return { removed: before - requests.length };
  },
};
