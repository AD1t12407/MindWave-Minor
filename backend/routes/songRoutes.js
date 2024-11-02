// routes/songRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../database");

router.get("/songs", (req, res) => {
  const userId = 1; // Assuming a fixed userId for this example

  // Fetch the current mood of the user from the database
  db.get(`SELECT currentMood FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Determine the track based on mood
    const mood = row?.currentMood || "sad";
    console.log(mood);
    //const mood = "sad";
    const trackPath = path.join(__dirname, "../music", `/${mood}/1.mp3`);

    // Check if the file exists
    if (!fs.existsSync(trackPath)) {
      return res.status(404).json({ error: "Track not found" });
    }

    // Set headers to indicate audio streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename="${mood}.mp3"`);

    // Stream the audio file to the client
    const readStream = fs.createReadStream(trackPath);
    readStream.pipe(res);
  });
});

module.exports = router;
