import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { toHttpError } from "../utils/errors.js";

export const bookingsRouter = Router();

const createSchema = z.object({
  resourceId: z.number().int().positive(),
  title: z.string().min(1).max(120),
  customerName: z.string().min(1).max(120).optional().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

bookingsRouter.get("/", async (req, res) => {
  const date = req.query.date; 
  const resourceId = req.query.resourceId ? Number(req.query.resourceId) : null;


  const day = typeof date === "string" && date ? date : new Date().toISOString().slice(0, 10);

  const params = [];
  let where = "WHERE start_time >= $1::date AND start_time < ($1::date + interval '1 day')";
  params.push(day);

  if (resourceId) {
    params.push(resourceId);
    where += ` AND resource_id = $${params.length}`;
  }

  const sql = `
    SELECT b.id, b.resource_id, r.name as resource_name, b.title, b.customer_name,
           b.start_time, b.end_time, b.created_at
    FROM bookings b
    JOIN resources r ON r.id = b.resource_id
    ${where}
    ORDER BY b.start_time ASC
  `;

  const { rows } = await pool.query(sql, params);
  res.json({ date: day, items: rows });
});

bookingsRouter.post("/", async (req, res) => {
  try {
    const data = createSchema.parse(req.body);

    const sql = `
      INSERT INTO bookings (resource_id, title, customer_name, start_time, end_time)
      VALUES ($1, $2, $3, $4::timestamptz, $5::timestamptz)
      RETURNING id, resource_id, title, customer_name, start_time, end_time, created_at
    `;

    const values = [
      data.resourceId,
      data.title,
      data.customerName ?? null,
      data.startTime,
      data.endTime,
    ];

    const { rows } = await pool.query(sql, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Body inválido", details: err.errors });
    }
    const http = toHttpError(err);
    res.status(http.status).json({ error: http.message });
  }
});
