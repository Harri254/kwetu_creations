import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const hasConnectionString = Boolean(process.env.DATABASE_URL);
const sslDisabled = String(process.env.PGSSLMODE || "").toLowerCase() === "disable";

const pool = new Pool({
  ...(hasConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: sslDisabled ? false : { rejectUnauthorized: false },
      }
    : {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port: process.env.PG_PORT,
      }),
});

pool.on("connect", () => {
  console.log("Connected to database");
});

export default pool;
