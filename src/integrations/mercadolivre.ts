import { z } from "zod";
import type { IntegrationConfig } from "../types";

const mercadolivreSchema = z.object({
  resource: z.string(),
  user_id: z.number(),
  topic: z.string(),
  application_id: z.number(),
  attempts: z.number(),
  sent: z.string(),
  received: z.string(),
});

const config: IntegrationConfig = {
  name: "mercadolivre",
  rules: {
    maxResponseTimeMs: 500,
    requiredHeaders: ["x-signature"],
    expectedMethods: ["POST"],
    maxPayloadSizeKb: 256,
    mustReturnStatus: 200,
  },
  schema: mercadolivreSchema,
};

export default config;
