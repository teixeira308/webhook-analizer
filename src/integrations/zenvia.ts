import { z } from "zod";
import type { IntegrationConfig } from "@/types";

const messageStatusSchema = z.object({
  timestamp: z.string(),
  code: z.enum(["REJECTED", "SENT", "DELIVERED", "NOT_DELIVERED", "READ"]),
  description: z.string().optional(),
  cause: z.string().optional(),
});

const messageBaseSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  direction: z.enum(["IN", "OUT"]),
  channel: z.string(),
  contents: z.array(z.record(z.unknown())),
  visitor: z
    .object({
      name: z.string().optional(),
      avatar: z.string().optional(),
    })
    .optional(),
});

const messageEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.literal("MESSAGE"),
  subscriptionId: z.string(),
  direction: z.string(),
  channel: z.string(),
  message: messageBaseSchema,
});

const messageStatusEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.literal("MESSAGE_STATUS"),
  subscriptionId: z.string(),
  channel: z.string(),
  messageId: z.string(),
  contentIndex: z.number().optional(),
  messageStatus: messageStatusSchema,
});

const zenviaSchema = z.discriminatedUnion("type", [
  messageEventSchema,
  messageStatusEventSchema,
]);

const config: IntegrationConfig = {
  name: "zenvia",
  rules: {
    maxResponseTimeMs: 1000,
    requiredHeaders: ["x-api-token"],
    expectedMethods: ["POST"],
    maxPayloadSizeKb: 512,
    mustReturnStatus: 200,
  },
  schema: zenviaSchema,
};

export default config;
