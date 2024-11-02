// sentimentAnalysis.js
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

// list of moods to be used in the app
const moods = ["positive", "negative", "neutral"];
function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  return result.score > 0
    ? "positive"
    : result.score < 0
    ? "negative"
    : "neutral";
}

module.exports = { analyzeSentiment };
