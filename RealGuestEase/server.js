// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// --------------------
// ENV SETUP
// --------------------
dotenv.config();

// --------------------
// APP SETUP
// --------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// --------------------
// LOGGING (DEV)
// --------------------
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --------------------
// HEALTH CHECK
// --------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// --------------------
// EMAIL (STUB)
// --------------------
app.post("/send_email", (_req, res) => {
  res.json({
    status: "stub",
    message: "Email endpoint wired",
  });
});

// --------------------
// ADMIN (STUBS)
// --------------------
app.post("/admin/update_booking", (_req, res) => {
  res.json({
    status: "stub",
    message: "Update booking endpoint wired",
  });
});

app.post("/admin/delete_booking", (_req, res) => {
  res.json({
    status: "stub",
    message: "Delete booking endpoint wired",
  });
});

// --------------------
// USER (STUB)
// --------------------
app.post("/delete_user", (_req, res) => {
  res.json({
    status: "stub",
    message: "Delete user endpoint wired",
  });
});

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
