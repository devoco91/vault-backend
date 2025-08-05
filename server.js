// server.js
if (!process.env.FLY_APP_NAME) {
  require("dotenv").config();
}

console.log("Starting server...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "defined" : "undefined");
console.log("MONGO_URI full value:", process.env.MONGO_URI);
console.log("process.env.PORT:", process.env.PORT);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(cors());
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

// connect to database before starting server
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start app due to MongoDB error:", err.message);
    process.exit(1);
  }
})();
