import express from "express";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoute.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

export default app;
