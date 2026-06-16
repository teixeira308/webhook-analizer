import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;
