import { z } from "zod";
import type { IntegrationConfig } from "../types";

const notificationSchema = z.object({
  resource: z.string(),
  user_id: z.number(),
  topic: z.string(),
  application_id: z.number(),
  attempts: z.number(),
  sent: z.string(),
  received: z.string(),
  _id: z.string().optional(),
  id: z.string().optional(),
  actions: z.array(z.string()).optional(),
}).passthrough();

const config: IntegrationConfig = {
  name: "mercadolivre",
  rules: {
    maxResponseTimeMs: 500,
    requiredHeaders: [],
    expectedMethods: ["POST"],
    maxPayloadSizeKb: 512,
    mustReturnStatus: 200,
  },
  schema: notificationSchema,
};

export default config;
