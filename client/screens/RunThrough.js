import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const slides = [
  {
    title: "Welcome to MindWave!",
    description: "Explore how your brain activity is used to enhance your emotional well-being.",
    colors: ["#3B1E54", "#1E1E2A"],
    image: require("../assets/slide1.png"), // Replace with your image paths
  },
  {
    title: "How it Works: EEG Input",
    description: "We use EEG devices to capture brain activity, which provides insights into your mental state.",
    colors: ["#4E41B0", "#1F1C47"],
    image: require("../assets/slide2.png"),
  },
  {
    title: "Understanding AVD",
    description: "From EEG data, we calculate Arousal, Valence, and Dominance (AVD) to understand your emotions better.",
    colors: ["#6A23A6", "#321D5E"],
    image: require("../assets/slide3.png"),
  },
  {
    title: "Emotion Detection",
    description: "AVD values help us identify emotions like happiness, relaxation, stress, and more in real time.",
    colors: ["#964FB0", "#452E6C"],
    image: require("../assets/slide4.png"),
  },
  {
    title: "Adaptive Music Player",
    description: "Using your current mood, we recommend personalized music to uplift or calm you.",
    colors: ["#9E7FB3", "#5A397B"],
    image: require("../assets/slide5.png"),
  },
  {
    title: "Adaptive Journal Suggestions",
    description: "We suggest journaling practices tailored to your emotions for mental clarity and growth.",
    colors: ["#9B7EBD", "#3B1E54"],
    image: require("../assets/slide6.png"),
  },
  {
    title: "Start Your Journey!",
    description: "Begin your journey towards emotional well-being with Moodify!",
    colors: ["#3B1E54", "#1E1E2A"],
    image: require("../assets/slide7.png"),
  },
];

const RunThrough = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      fadeOut(() => {
        setCurrentSlide(currentSlide + 1);
        fadeIn();
      });
    } else {
      // Navigate to Onboarding after the last slide
      navigation.navigate("Onboarding");
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
    });
  };

  return (
    <LinearGradient
      colors={slides[currentSlide].colors}
      style={styles.container}
    >
      <Text style={styles.title}>{slides[currentSlide].title}</Text>
      <Text style={styles.description}>{slides[currentSlide].description}</Text>
      
      <Animated.Image
        source={slides[currentSlide].image}
        style={[styles.image, { opacity: fadeAnim }]}
        onLoad={fadeIn} // Ensures fade-in when the image is first loaded
      />

      <Pressable style={styles.arrowButton} onPress={handleNextSlide}>
        <Ionicons name="arrow-forward" size={32} color="#FFF" />
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 30,
  },
  arrowButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6A23A6",
    borderRadius: 50,
  },
});

export default RunThrough;
