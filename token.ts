import * as dotenv from "dotenv";

dotenv.config();
if (!process.env.MFYU_TOKEN) throw new Error("u pmo");
export const TOKEN = process.env.MFYU_TOKEN;
