// backend/server.js
// ✅ Paste this FULL file exactly (it removes duplicate connectDB declarations)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./db/connect");

const aiRoutes = require("./routes/aiRoutes");
const userRoutes = require("./routes/userRoutes");
const promptRoutes = require("./routes/promptRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(helmet());

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((s) => s.trim()),
       methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    credentials: true,
  })
);

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/admin", adminRoutes);

const PORT = Number(process.env.PORT || 8081);

connectDB()
  .then(() => {
    console.log(" DB ready, starting server...");
    app.listen(PORT, () => console.log(` API running on :${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connect failed:", err.message);
    process.exit(1);
  });
