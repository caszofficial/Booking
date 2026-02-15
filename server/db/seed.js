import { pool } from "../src/db.js";

async function seed() {
  try {
    await pool.query("BEGIN");
    await pool.query("INSERT INTO resources (name) VALUES ($1) ON CONFLICT DO NOTHING", ["Sala 1"]);
    await pool.query("INSERT INTO resources (name) VALUES ($1) ON CONFLICT DO NOTHING", ["Sala 2"]);
    await pool.query("INSERT INTO resources (name) VALUES ($1) ON CONFLICT DO NOTHING", ["Cancha A"]);
    await pool.query("COMMIT");
    console.log("✅ Seed ok (resources).");
  } catch (e) {
    await pool.query("ROLLBACK");
    console.error("❌ Seed failed:", e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
seed();
