// routes/journalRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../database"); // Ensure you're importing the db correctly
const { analyzeSentiment } = require("../utils/sentimentAnalysis");

// POST /journal - Add journal entry and analyze mood
router.post("/journal", (req, res) => {
  console.log(req.body);
  const text = req.body.text;
  console.log(text);
  const mood = analyzeSentiment(text);

  const userId = 1;
  const date = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO journals (userId, date, text, mood) VALUES (?, ?, ?, ?)`,
    [userId, date, text, mood],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ mood });
    }
  );
});

// GET /home - Get last 7 journal entries
router.get("/home", (req, res) => {
  const userId = req.user ? req.user.id : 1; // Dynamic user ID

  db.all(
    `SELECT date, text, mood FROM journals WHERE userId = ? ORDER BY date DESC LIMIT 7`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
