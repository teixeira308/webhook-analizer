import { z } from "zod";
import type { IntegrationConfig } from "../types";

const shopifySchema = z.object({
  id: z.number(),
  topic: z.string(),
  domain: z.string(),
  admin_graphql_api_id: z.string(),
});

const config: IntegrationConfig = {
  name: "shopify",
  rules: {
    maxResponseTimeMs: 1000,
    requiredHeaders: ["x-shopify-hmac-sha256", "x-shopify-topic", "x-shopify-shop-domain"],
    expectedMethods: ["POST"],
    maxPayloadSizeKb: 512,
    mustReturnStatus: 200,
  },
  schema: shopifySchema,
};

export default config;
