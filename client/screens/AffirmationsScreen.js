import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MeditationFooter from '../constants/MeditationFooter';
import axios from 'axios';

const affirmations = [
  "I am capable and strong.",
  "Today, I will focus on positivity.",
  "I believe in my ability to overcome challenges.",
  "I am deserving of happiness and love.",
  "Every day is a fresh start.",
  "I am in control of my thoughts and emotions.",
  "I trust myself and my journey.",
  "I am resilient and can handle whatever comes my way."
];

const AffirmationsScreen = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const changeAffirmation = () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentAffirmation(randomAffirmation);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          headers: {
            Authorization: 'Client-ID NkWSWhSJx9Plwlaxq9vhGq5eORoJdzWq3OfDZmJwReE',
          },
          params: {
            query: 'night sky',
          },
        });
        setBackgroundImage(response.data.urls.regular);
      } catch (error) {
        console.error("Error fetching image: ", error);
      }
    };

    fetchImage();
  }, []);

  const downloadImage = async () => {
    if (!backgroundImage) return;

    const fileUri = `${FileSystem.cacheDirectory}affirmation-background.jpg`;
    try {
      await FileSystem.downloadAsync(backgroundImage, fileUri);
      Alert.alert("Download Successful", "The image has been saved.");
      if (Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Error downloading image: ", error);
      Alert.alert("Download Failed", "An error occurred while downloading the image.");
    }
  };

  return (
    <>
      <ImageBackground source={{ uri: backgroundImage }} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Daily Affirmation</Text>
          <View style={styles.affirmationBox}>
            <Text style={styles.affirmationText}>{currentAffirmation}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.swapButton} onPress={changeAffirmation}>
                <Ionicons name="swap-horizontal" size={32} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={downloadImage}>
                <Ionicons name="download-outline" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
      <MeditationFooter />
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
  },
  affirmationBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  affirmationText: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 32,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    marginTop: 10,
    marginRight:0, // Optional: Add some space above the buttons
  },
  swapButton: {
    backgroundColor: '#00',
    borderRadius: 30,
    padding: 10,
    marginRight: 10, // Adds space between the buttons
  },
  iconButton: {
    backgroundColor: '#00',
    borderRadius: 30,
    padding: 10,
  },
});

export default AffirmationsScreen;


