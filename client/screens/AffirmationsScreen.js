import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; // Fixed missing import
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MeditationFooter from '../constants/MeditationFooter';

// Default affirmations and mood-based affirmations
const affirmations = [
  "I am capable and strong.",
  "Today, I will focus on positivity.",
  "I believe in my ability to overcome challenges.",
  "I am deserving of happiness and love.",
  "Every day is a fresh start.",
  "I am in control of my thoughts and emotions.",
  "I trust myself and my journey.",
  "I am resilient and can handle whatever comes my way.",
];

const moodBasedAffirmations = {
  happy: ["I am grateful for my joy today.", "Happiness is my choice."],
  stressed: ["I breathe deeply and let go of stress.", "Peace flows through me."],
  anxious: ["I release my fears and embrace calm.", "I am safe in this moment."],
};

const AffirmationsScreen = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [userAffirmations, setUserAffirmations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [streak, setStreak] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);

  // Animated value for transition effects
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          headers: {
            Authorization: 'Client-ID NkWSWhSJx9Plwlaxq9vhGq5eORoJdzWq3OfDZmJwReE',
          },
          params: {
            query: 'inspiration',
          },
        });
        setBackgroundImage(response.data.urls.regular);
        fadeIn(); // Fade in the background image
      } catch (error) {
        console.error("Error fetching image: ", error);
      }
    };

    fetchImage();

    const updateStreak = async () => {
      try {
        const today = new Date().toDateString();
        const lastInteraction = await AsyncStorage.getItem('lastInteractionDate');

        if (lastInteraction && new Date(lastInteraction).toDateString() === today) {
          return;
        }

        setStreak((prev) => prev + 1);
        await AsyncStorage.setItem('lastInteractionDate', today);
      } catch (error) {
        console.error("Error updating streak: ", error);
      }
    };

    updateStreak();
  }, []);

  const changeAffirmation = () => {
    const allAffirmations = [...affirmations, ...userAffirmations];
    const randomAffirmation = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
    setCurrentAffirmation(randomAffirmation);
  };

  const downloadImage = async () => {
    if (!backgroundImage) return;

    const fileUri = `${FileSystem.cacheDirectory}affirmation-background.jpg`;
    try {
      await FileSystem.downloadAsync(backgroundImage, fileUri);
      Alert.alert("Download Successful", "The image has been saved.");
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Error downloading image: ", error);
      Alert.alert("Download Failed", "An error occurred while downloading the image.");
    }
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Daily Affirmation",
        body: currentAffirmation,
      },
      trigger: { hour: 9, minute: 0, repeats: true },
    });
    Alert.alert("Reminder Set", "You will receive daily affirmations at 9:00 AM.");
  };

  const selectMoodAffirmation = (mood) => {
    const moodAffirmations = moodBasedAffirmations[mood];
    const randomMoodAffirmation = moodAffirmations[Math.floor(Math.random() * moodAffirmations.length)];
    setCurrentAffirmation(randomMoodAffirmation);
    setSelectedMood(mood);
  };

  const addUserAffirmation = () => {
    if (newAffirmation.trim() === '') {
      Alert.alert("Error", "Affirmation cannot be empty.");
      return;
    }
    setUserAffirmations([...userAffirmations, newAffirmation.trim()]);
    setNewAffirmation('');
    setModalVisible(false);
    Alert.alert("Success", "Affirmation added!");
  };

  return (
    <>
      <Animated.View style={{ ...styles.background, opacity: fadeAnim }}>
        <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
          <View style={styles.container}>
            <Text style={styles.title}>Daily Affirmation</Text>
            <View style={styles.affirmationBox}>
              <Text style={styles.affirmationText}>{currentAffirmation}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.swapButton} onPress={changeAffirmation}>
                  <Ionicons name="swap-horizontal" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={downloadImage}>
                  <Ionicons name="download-outline" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.moodContainer}>
              {Object.keys(moodBasedAffirmations).map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodButton, selectedMood === mood && styles.selectedMood]}
                  onPress={() => selectMoodAffirmation(mood)}
                >
                  <Text style={styles.moodText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={32} color="#fff" />
              <Text style={styles.addButtonText}>Add Affirmation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reminderButton} onPress={scheduleNotification}>
              <MaterialIcons name="notifications-active" size={32} color="#fff" />
              <Text style={styles.reminderText}>Set Daily Reminder</Text>
            </TouchableOpacity>

            <Text style={styles.streakText}>Streak: {streak} days</Text>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Modal for Adding Affirmation */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your affirmation"
              value={newAffirmation}
              onChangeText={setNewAffirmation}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addUserAffirmation}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Footer */}
      <MeditationFooter />
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#3B1E54',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(59, 30, 84, 0.85)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  affirmationBox: {
    backgroundColor: 'rgba(155, 126, 189, 0.9)',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
  },
  affirmationText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
    width: '100%',
  },
  moodButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#5D3EA8',
  },
  selectedMood: {
    backgroundColor: '#F1A661',
  },
  moodText: {
    fontSize: 16,
    color: '#fff',
  },
  addButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  reminderText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  streakText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#5D3EA8',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AffirmationsScreen;
