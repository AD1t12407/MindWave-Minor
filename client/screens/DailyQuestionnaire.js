import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For next icon

const DailyQuestionnaire = () => {
  const [response, setResponse] = useState("");
  const [mood, setMood] = useState(null);
  const [arousal, setArousal] = useState(2); // Arousal range: 0-5
  const [valence, setValence] = useState(0); // Valence range: -5 to 5
  const [dominance, setDominance] = useState(2); // Dominance range: 0-5
  const navigation = useNavigation();

  const handleAnalyze = async () => {
    if (!response.trim()) {
      console.error("Input cannot be empty");
      return;
    }

    try {
      const result = await axios.post("http://localhost:3000/mood_text", {
        text: response,
      });
      setMood(result.data.mood);
    } catch (error) {
      console.error("Error analyzing mood:", error.message);
    }
  };

  const handleNext = () => {
    if (!response.trim()) {
      console.error("Input cannot be empty");
      return;
    }
    navigation.navigate("HomePage");
  };

  const interpretEmotion = () => {
    if (arousal >= 3 && valence >= 0 && dominance >= 3) {
      return "Emotion detected: Excited, Positive, and Confident.";
    } else if (arousal < 3 && valence < 0 && dominance < 3) {
      return "Emotion detected: Calm, Negative, and Submissive.";
    } else if (arousal >= 3 && valence < 0 && dominance < 3) {
      return "Emotion detected: Stressed, Negative, and Submissive.";
    } else if (arousal < 3 && valence >= 0 && dominance >= 3) {
      return "Emotion detected: Calm, Positive, and Confident.";
    }
    return "Emotion undetermined";
  };

  return (
    <LinearGradient
      colors={["#3B1E54", "#000", "#000"]}
      style={styles.container}
    >
      <Text style={styles.title}>
        How was your day? </Text>

      <TextInput
        style={styles.input}
        placeholder="Type your response here"
        placeholderTextColor="#aaa"
        value={response}
        onChangeText={setResponse}
        multiline
      />

      {mood && <Text style={styles.moodText}>Detected Mood: {mood}</Text>}

      <Text style={styles.label}>Arousal</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5}
        value={arousal}
        onValueChange={setArousal}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />
      <Text style={styles.rangeText}>Arousal Level: {arousal}</Text>

      <Text style={styles.label}>Valence</Text>
      <Slider
        style={styles.slider}
        minimumValue={-5}
        maximumValue={5}
        value={valence}
        onValueChange={setValence}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />
      <Text style={styles.rangeText}>Valence Level: {valence}</Text>

      <Text style={styles.label}>Dominance</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5}
        value={dominance}
        onValueChange={setDominance}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />
      <Text style={styles.rangeText}>Dominance Level: {dominance}</Text>

      <Text style={styles.emotionText}>{interpretEmotion()}</Text>

      <View style={styles.buttonContainer}>
        {/* Analyze Button */}
        <Pressable style={styles.button} onPress={handleAnalyze}>
          <LinearGradient
            colors={["#9B7EBD", "#3B1E54"]}
            style={styles.buttonBackground}
          >
            <Text style={styles.buttonText}>Analyze</Text>
          </LinearGradient>
        </Pressable>

        {/* Next Button with Icon */}
        <Pressable style={styles.button} onPress={handleNext}>
          <LinearGradient
            colors={["#9B7EBD", "#3B1E54"]}
            style={[styles.buttonBackground, styles.nextButton]}
          >
            <View style={styles.nextButtonContent}>
              <Text style={styles.buttonText}>Next </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 15,
  },
  rangeText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  emotionText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    height: 50,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  nextButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});



export default DailyQuestionnaire;
