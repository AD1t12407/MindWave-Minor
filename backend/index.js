// server.js
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const db = require("./database");

const moodRoutes = require("./routes/moodRoutes");
const songRoutes = require("./routes/songRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(row);
    }
  );
});
app.use("/", moodRoutes);
app.use("/", songRoutes);
app.use("/", journalRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the database instance
module.exports = db;
