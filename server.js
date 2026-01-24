const express = require("express");
const path = require("path");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check (Render likes this)
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
