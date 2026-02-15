import { Router } from "express";
import { pool } from "../db.js";

export const resourcesRouter = Router();

resourcesRouter.get("/", async (_req, res) => {
  const { rows } = await pool.query("SELECT id, name FROM resources ORDER BY id ASC");
  res.json(rows);
});
