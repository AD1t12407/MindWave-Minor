// dbSetup.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  // Create Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      currentMood TEXT
    )
  `);

  // Create Journals table
  db.run(`
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      date TEXT,
      text TEXT,
      mood TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Insert dummy users
  const users = [
    { username: "arjun_verma", password: "password123", currentMood: "happy" },
    { username: "neha_sharma", password: "password123", currentMood: "calm" },
    {
      username: "rahul_gupta",
      password: "password123",
      currentMood: "neutral",
    },
    { username: "simran_kaur", password: "password123", currentMood: "sad" },
    {
      username: "manoj_singh",
      password: "password123",
      currentMood: "energetic",
    },
  ];

  users.forEach((user) => {
    db.run(
      `
      INSERT INTO users (username, password, currentMood) 
      VALUES (?, ?, ?)
    `,
      [user.username, user.password, user.currentMood]
    );
  });

  // Insert dummy journal entries for each user
  const journals = [
    {
      userId: 1,
      date: "2024-10-20",
      text: "Had a wonderful day at the beach!",
      mood: "happy",
    },
    {
      userId: 2,
      date: "2024-10-21",
      text: "Feeling quite relaxed after yoga.",
      mood: "calm",
    },
    {
      userId: 3,
      date: "2024-10-22",
      text: "Work was uneventful, just an average day.",
      mood: "neutral",
    },
    {
      userId: 4,
      date: "2024-10-23",
      text: "Missed my family today, feeling a bit down.",
      mood: "sad",
    },
    {
      userId: 5,
      date: "2024-10-24",
      text: "Great workout session, full of energy!",
      mood: "energetic",
    },
  ];

  journals.forEach((entry) => {
    db.run(
      `
      INSERT INTO journals (userId, date, text, mood) 
      VALUES (?, ?, ?, ?)
    `,
      [entry.userId, entry.date, entry.text, entry.mood]
    );
  });

  console.log("Database tables and dummy data created successfully.");
});

db.close();
