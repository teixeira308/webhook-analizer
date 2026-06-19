import express from "express";
import type { Request, Response, NextFunction } from "express";
import { timerMiddleware } from "./middlewares/timer";
import webhookRoute from "./routes/webhook.route";
import requestsRoute from "./routes/requests.route";
import statsRoute from "./routes/stats.route";
import healthRoute from "./routes/health.route";
import documentationRoute from "./routes/documentation.route";
import documentationIndexRoute from "./routes/documentation-index.route";
import documentationMercadolivreRoute from "./routes/documentation-mercadolivre.route";
import { logger } from "./utils/logger";

export function createApp(): express.Application {
  const app = express();

  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      (req as any).rawBody = raw;
      if (raw) {
        try {
          req.body = JSON.parse(raw);
        } catch {
          req.body = raw;
        }
      }
      next();
    });
  });

  app.use(timerMiddleware);

  app.use(webhookRoute);
  app.use(requestsRoute);
  app.use(statsRoute);
  app.use(healthRoute);
  app.use(documentationRoute);
  app.use(documentationIndexRoute);
  app.use(documentationMercadolivreRoute);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Rota não encontrada" });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, "Erro interno");
    res.status(500).json({
      error: "Erro interno do servidor",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  return app;
}
