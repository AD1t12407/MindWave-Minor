// routes/moodRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../database");
const { analyzeSentiment } = require("../utils/sentimentAnalysis");

router.get("/mood", (req, res) => {
  const userId = 1; // Assuming a fixed userId for this example

  db.get(`SELECT currentMood FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const mood = row?.currentMood || "neutral";
    res.json({ mood });
  });
});

router.post("/mood_text", (req, res) => {
  const text = req.body.text;
  console.log(text);
  const mood = analyzeSentiment(text);

  const userId = 1;
  db.run(
    `UPDATE users SET currentMood = ? WHERE id = ?`,
    [mood, userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mood });
    }
  );
});

router.get("/mood:scroller", (req, res) => {
  const selectedMood = req.query.mood;
  const userId = req.user.id;
  db.run(
    `UPDATE users SET currentMood = ? WHERE id = ?`,
    [selectedMood, userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(100);
    }
  );
});

module.exports = router;
