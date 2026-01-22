import 'dotenv/config';
import express from "express";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import reputationRoutes from "./routes/reputationRoute.js";
// Pour le token JWT
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reputation", reputationRoutes);

export default app;
