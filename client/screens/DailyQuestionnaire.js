import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; // Import Slider component
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const DailyQuestionnaire = () => {
  const [response, setResponse] = useState("");
  const [mood, setMood] = useState(null);
  const [brainwaveRange, setBrainwaveRange] = useState(0); // Initial brainwave range
  const navigation = useNavigation();

  const handleAnalyze = async () => {
    if (!response.trim()) {
      console.error("Input cannot be empty");
      return;
    }

    try {
      console.log("Analyzing mood..." + response);
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
    if (brainwaveRange > 600 || brainwaveRange < -600) {
      return "Positive Signals detected: High engagement and positive emotional states (e.g., happiness, excitement, deep introspection).";
    } else if (brainwaveRange > -600 && brainwaveRange < 600) {
      return "Negative Signals detected: Mild to moderate negative emotions or cognitive discomfort (e.g., anxiety, stress).";
    } else if (brainwaveRange > -50 && brainwaveRange < 250) {
      return "Neutral Signals detected: Balanced emotional state, indicating normal cognitive processing without extremes.";
    }
    return "Emotion undetermined";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Response:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your response here"
        placeholderTextColor="grey"
        value={response}
        onChangeText={setResponse}
      />

      {mood && <Text style={styles.moodText}>Mood: {mood}</Text>}

      <Text style={styles.label}>Brainwave Range</Text>
      <Slider
        style={styles.slider}
        minimumValue={-1000}
        maximumValue={1000}
        value={brainwaveRange}
        onValueChange={setBrainwaveRange}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#32CD32"
      />
      <Text style={styles.rangeText}>Brainwave Range: {brainwaveRange}</Text>

      <Text style={styles.emotionText}>
        Emotion Result: {interpretEmotion()}
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.buttonText}>Analyze</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  label: {
    color: "white",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "#1C1C1C",
    color: "white",
    borderRadius: 5,
    marginBottom: 20,
  },
  moodText: {
    color: "#FFD700",
    fontSize: 18,
    marginTop: 10,
  },
  slider: {
    width: "80%",
    height: 40,
  },
  rangeText: {
    color: "white",
    fontSize: 14,
    marginVertical: 5,
  },
  emotionText: {
    color: "#FFD700",
    fontSize: 18,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  analyzeButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",

    fontSize: 16,
  },
});

export default DailyQuestionnaire;
