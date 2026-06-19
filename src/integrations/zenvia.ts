import { z } from "zod";
import type { IntegrationConfig } from "../types";

const causeSchema = z.object({
  channelErrorCode: z.string().optional(),
  reason: z.string().optional(),
  details: z.string().optional(),
}).passthrough();

const buttonContextSchema = z.object({
  type: z.string().optional(),
  payload: z.string().optional(),
}).passthrough();

const messageStatusSchema = z.object({
  code: z.string(),
  timestamp: z.string(),
  channel: z.string().optional(),
  description: z.string().optional(),
  direction: z.enum(["IN", "OUT"]).optional(),
  causes: z.array(causeSchema).optional(),
  context: z.object({ button: buttonContextSchema.optional() }).passthrough().optional(),
  channelData: z.object({
    sms: z.object({ carrier: z.string().optional() }).passthrough().optional(),
    rcs: z.object({ realChannel: z.string().optional() }).passthrough().optional(),
    email: z.object({
      clientInfo: z.object({
        machineOpen: z.boolean().optional(),
        userAgent: z.string().optional(),
        sourceIp: z.string().optional(),
        url: z.string().optional(),
      }).passthrough().optional(),
    }).passthrough().optional(),
  }).passthrough().optional(),
  details: z.object({
    file: z.object({
      url: z.string().optional(),
      name: z.string().optional(),
      sizeBytes: z.number().optional(),
      mimeType: z.string().optional(),
    }).passthrough().optional(),
  }).passthrough().optional(),
}).passthrough();

const contentSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  payload: z.string().optional(),
}).passthrough();

const visitorSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userName: z.string().optional(),
  picture: z.string().optional(),
}).passthrough();

const sourceSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  url: z.string().optional(),
  text: z.string().optional(),
  user: z.string().optional(),
  timestamp: z.string().optional(),
}).passthrough();

const referralSchema = z.object({
  headline: z.string().optional(),
  body: z.string().optional(),
  source: sourceSchema.optional(),
  ctwaId: z.string().optional(),
}).passthrough();

const messageObjectSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  direction: z.enum(["IN", "OUT"]),
  channel: z.string(),
  contents: z.array(contentSchema),
  timestamp: z.string().optional(),
  visitor: visitorSchema.optional(),
  referral: referralSchema.optional(),
  idRef: z.string().optional(),
}).passthrough();

const messageEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  subscriptionId: z.string(),
  type: z.literal("MESSAGE"),
  channel: z.string(),
  direction: z.enum(["IN", "OUT"]),
  message: messageObjectSchema,
}).passthrough();

const statusMessageObjectSchema = z.object({
  id: z.string().optional(),
  externalId: z.string().optional(),
  contentIndex: z.number().optional(),
  direction: z.enum(["IN", "OUT"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
}).passthrough();

const messageStatusEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  subscriptionId: z.string(),
  type: z.literal("MESSAGE_STATUS"),
  channel: z.string(),
  messageId: z.string(),
  contentIndex: z.number().optional(),
  message: statusMessageObjectSchema.optional(),
  messageStatus: messageStatusSchema,
}).passthrough();

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
