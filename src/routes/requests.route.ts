import { Router } from "express";
import type { Request, Response } from "express";
import { storage } from "@/services/storage.service";

const router = Router();

router.get("/requests", (req: Request, res: Response) => {
  const { integration, passed, limit } = req.query;

  const filters: Parameters<typeof storage.list>[0] = {};

  if (typeof integration === "string") {
    filters.integration = integration;
  }

  if (passed === "true") filters.passed = true;
  else if (passed === "false") filters.passed = false;

  if (typeof limit === "string") {
    filters.limit = parseInt(limit, 10) || 50;
  }

  const requests = storage.list(filters);
  res.json({ count: requests.length, data: requests });
});

router.get("/requests/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const request = storage.getById(id);

  if (!request) {
    res.status(404).json({ error: "Requisição não encontrada" });
    return;
  }

  res.json(request);
});

export default router;
