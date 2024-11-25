import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from 'expo-linear-gradient';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const DailyQuestionnaire = () => {
  const [response, setResponse] = useState("");
  const [mood, setMood] = useState(null);
  const [brainwaveRange, setBrainwaveRange] = useState(0);
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
    if (brainwaveRange > 600 || brainwaveRange < -600) {
      return "Positive Signals detected: High engagement and positive emotional states.";
    } else if (brainwaveRange > -600 && brainwaveRange < 600) {
      return "Negative Signals detected: Mild to moderate negative emotions or stress.";
    } else if (brainwaveRange > -50 && brainwaveRange < 250) {
      return "Neutral Signals detected: Balanced emotional state.";
    }
    return "Emotion undetermined";
  };

  return (
      <LinearGradient
            colors={['#001F3F', '#000']}
            style={styles.container}>
        
      <Text style={styles.title}>Daily Questionnaire</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your response here"
        placeholderTextColor="#aaa"
        value={response}
        onChangeText={setResponse}
        multiline
      />

      {mood && <Text style={styles.moodText}>Detected Mood: {mood}</Text>}

      <Text style={styles.label}>Brainwave Range</Text>
      <Slider
        style={styles.slider}
        minimumValue={-1000}
        maximumValue={1000}
        value={brainwaveRange}
        onValueChange={setBrainwaveRange}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />
      <Text style={styles.rangeText}>Brainwave Level: {brainwaveRange}</Text>

      <Text style={styles.emotionText}>{interpretEmotion()}</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.analyzeButton]} onPress={handleAnalyze}>
          <Text style={styles.buttonText}>Analyze</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.nextButton]} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
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
    paddingHorizontal: 20,
    backgroundColor: "#121212", // Dark theme background
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#1C1C1C",
    color: "#FFF",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  moodText: {
    color: "#1E90FF",
    fontSize: 18,
    marginVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
  rangeText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  emotionText: {
    color: "#1E90FF",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: "center",
  },
  analyzeButton: {
    backgroundColor: "#1E90FF",
  },
  nextButton: {
    backgroundColor: "#32CD32",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DailyQuestionnaire;
