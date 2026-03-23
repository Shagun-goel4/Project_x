import { PrismaClient } from "../generated/prisma/client.ts";
import pkg from "pg";
const { Pool } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
