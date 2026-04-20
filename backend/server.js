const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let errors = [];

// API to receive errors
app.post("/api/ingest/:projectId", (req, res) => {
  const error = {
    id: errors.length + 1,
    message: req.body.message,
    level: req.body.level || "error",
    timestamp: new Date(),
    resolved: false   // ✅ IMPORTANT FIX
  };
  errors.push(error);
  res.json({ success: true });
});

// API to fetch errors
app.get("/api/errors", (req, res) => {
  res.json(errors);
});

// API to resolve/unresolve error
app.patch("/api/errors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const error = errors.find(e => e.id === id);

  if (error) {
    error.resolved = !error.resolved;
    res.json(error);
  } else {
    res.status(404).send("Error not found");
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});