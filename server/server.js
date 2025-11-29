// server/server.js
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;
const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this";
const JWT_EXPIRES_IN = "7d";

const app = express();
app.use(cors()); // in production, restrict origin
app.use(express.json());

// Helper: read/write users file
function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// On startup ensure demo users exist (with name)
function ensureDemoUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    const demo = [
      { name: "Demo One", email: "demo1@example.com", password: "pass123" },
      { name: "Demo Two", email: "demo2@example.com", password: "pass123" },
      { name: "Demo Three", email: "demo3@example.com", password: "pass123" },
    ];

    const users = demo.map((u) => {
      const salt = bcrypt.genSaltSync(10);
      return {
        id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
        name: u.name,
        email: u.email,
        passwordHash: bcrypt.hashSync(u.password, salt),
        createdAt: new Date().toISOString(),
      };
    });

    saveUsers(users);
    console.log("Created users.json with demo users:", users.map((u) => u.email));
  } else {
    console.log("users.json already exists — keeping existing users.");
  }
}

ensureDemoUsers();

/**
 * Utility: create JWT
 * include minimal public info (id, email, name) so frontend can show name without extra call
 */
function createToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name || "" };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Middleware: authenticate via Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing Authorization header" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Malformed Authorization header" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * POST /api/signup
 * body: { name, email, password }
 */
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password required" });

  const users = loadUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: "User already exists" });

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const user = {
    id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const token = createToken(user);
  res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email } });
});

/**
 * POST /api/login
 * body: { email, password }
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = createToken(user);
  res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email } });
});

/**
 * GET /api/me
 * headers: Authorization: Bearer <token>
 */
app.get("/api/me", authMiddleware, (req, res) => {
  const users = loadUsers();
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
});

/**
 * Simple protected demo endpoint
 */
app.get("/api/protected-data", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    message: `Hello ${req.user.name || req.user.email}! This is protected demo data.`,
    now: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Auth demo server running on http://localhost:${PORT}`);
  console.log("POST /api/signup  {name,email,password}");
  console.log("POST /api/login   {email,password}");
  console.log("GET  /api/me      Authorization: Bearer <token>");
});
