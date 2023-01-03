import { Router } from "express";
import connectDB from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const db = await connectDB();
  const { rows } = await db.query("select * from hello");
  res.send(rows);
});

export default router;
