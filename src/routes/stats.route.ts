import { Router } from "express";
import type { Request, Response } from "express";
import { storage } from "../services/storage.service";

const router = Router();

router.get("/stats", (req: Request, res: Response) => {
  const integration = req.headers["x-integration"] as string | undefined;
  const stats = storage.getStats(integration);
  res.json(stats);
});

router.delete("/stats", (req: Request, res: Response) => {
  const integration = req.headers["x-integration"] as string | undefined;
  const result = storage.clear(integration);

  if (integration) {
    res.json({
      message: `Registros da integração '${integration}' removidos`,
      removed: result.removed,
    });
  } else {
    res.json({
      message: "Todos os registros foram removidos",
      removed: result.removed,
    });
  }
});

export default router;
