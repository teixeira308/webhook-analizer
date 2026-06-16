import { z } from "zod";
import type { IntegrationConfig } from "@/types";

const stripeSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
  created: z.number(),
  livemode: z.boolean(),
  pending_webhooks: z.number(),
  request: z.object({
    id: z.string().nullable(),
    idempotency_key: z.string().nullable(),
  }),
});

const config: IntegrationConfig = {
  name: "stripe",
  rules: {
    maxResponseTimeMs: 1000,
    requiredHeaders: ["stripe-signature"],
    expectedMethods: ["POST"],
    maxPayloadSizeKb: 512,
    mustReturnStatus: 200,
  },
  schema: stripeSchema,
};

export default config;
