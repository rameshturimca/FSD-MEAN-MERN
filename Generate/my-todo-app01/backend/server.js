const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Serve static files (welcome page)
app.use(express.static(path.join(__dirname, "public")));

// API route for todos
app.get("/api/todos", (req, res) => {
  const todosPath = path.join(__dirname, "data", "todos.json");
  const todos = JSON.parse(fs.readFileSync(todosPath, "utf8"));
  res.json(todos);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
