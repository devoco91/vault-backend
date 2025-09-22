// server.js
if (!process.env.FLY_APP_NAME) {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

const allowedOrigins = [
  // "https://vault-software.vercel.app",
  "https://www.vaultsoftware.cloud",
  "http://localhost:3000",
  "https://vaultsoftware.vercel.app",
  "https://www.vaultsoftware.net"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// Welcome
app.get("/", (req, res) => res.send("Welcome to Vault Backend!"));

// API routes
try {
  console.log("Registering contact route: /api/contact");
  app.use("/api/contact", contactRoutes);
} catch (err) {
  console.error("❌ Route registration failed:", err.message);
  process.exit(1);
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global error handler:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

(async () => {
  try {
    console.log("Starting server...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "defined" : "undefined");
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI environment variable");
    }

    await connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start app:", err.message);
    process.exit(1);
  }
})();
