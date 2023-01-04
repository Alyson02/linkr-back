import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

let chachedDB = null;
let connectionParams = {
  connectionString: process.env.DATABASE_URL,
};

export default async function connectDB() {
  if (chachedDB instanceof pg.Pool) {
    return chachedDB;
  }

  if (process.env.MODE === "PROD") {
    connectionParams.ssl = {
      rejectUnauthorized: false,
    };
  }

  const { Pool } = pg;
  const db = new Pool(connectionParams);

  await db.connect();

  chachedDB = db;

  return db;
}