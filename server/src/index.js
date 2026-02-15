import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { resourcesRouter } from "./routes/resources.js";
import { bookingsRouter } from "./routes/bookings.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/resources", resourcesRouter);
app.use("/api/bookings", bookingsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`✅ API running on http://localhost:${port}`));
