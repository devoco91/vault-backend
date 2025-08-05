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
  "https://vault-software.vercel.app",
  "https://www.vault-software.vercel.app",
  "https://www.vaultsoftware.cloud",
   "https://vaultsoftware.cloud",
  "http://localhost:3000"
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

// health check
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => res.send("Welcome to Vault Backend!"));
app.use("/api/contact", contactRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
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
