import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      startTime: bigint;
      responseTimeMs: number;
    }
  }
}

export function timerMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.startTime = process.hrtime.bigint();
  next();
}

export function getResponseTime(req: Request): number {
  const diff = process.hrtime.bigint() - req.startTime;
  return Number(diff) / 1_000_000;
}
