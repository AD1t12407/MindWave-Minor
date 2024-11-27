import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Footer from "../constants/Footer";

const HomePage = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef(null);
  const navigation = useNavigation();

  const loadSound = async () => {
    const { sound: loadedSound } = await Audio.Sound.createAsync(
      require("../assets/ambient_music.mp3"), // Replace with your music file path
      { shouldPlay: true, isLooping: isLooping }
    );
    setSound(loadedSound);
    soundRef.current = loadedSound;

    loadedSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);
        setIsPlaying(status.isPlaying);
      }
    });
  };

  const playMusic = async () => {
    if (!sound) {
      await loadSound();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(true);
  };

  const pauseMusic = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onSliderValueChange = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
    setPosition(value);
  };

  const openProfile = () => {
    navigation.navigate("UserSettingsPage"); // Navigate to UserProfile component
  };

  return (
    <LinearGradient
      colors={["#3B1E58", "#000", "#000"]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>MindWave</Text>
        <TouchableOpacity onPress={openProfile} style={styles.profileButton}>
          <Ionicons 
            name="person-circle-outline" // User profile icon
            size={50} // Adjust size as needed
            color="#FFF" // Icon color
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require("../assets/background.jpg")} // Replace with your album art
          style={styles.albumArt}
        />
        <Text style={styles.trackTitle}>Curated Ambient Music</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={onSliderValueChange}
            minimumTrackTintColor="#1E90FF"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1E90FF"
          />
        </View>
        <View style={styles.controls}>
          <GradientButton onPress={stopMusic} icon="stop-outline" />
          <GradientButton
            onPress={isPlaying ? pauseMusic : playMusic}
            icon={isPlaying ? "pause-outline" : "play-outline"}
          />
          <GradientButton
            onPress={toggleLoop}
            icon={isLooping ? "repeat-outline" : "repeat"}
          />
        </View>
      </View>
      <Footer />
    </LinearGradient>
  );
};

const GradientButton = ({ onPress, icon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.gradientButton}>
      <LinearGradient
        colors={["#9B7EBD", "#3B1E54"]}
        style={styles.gradientButtonBackground}
      >
        <Ionicons name={icon} size={24} color="#FFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  albumArt: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  trackTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sliderContainer: {
    width: "90%",
    alignItems: "center",
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  gradientButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  gradientButtonBackground: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePage;
