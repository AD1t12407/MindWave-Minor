import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'; // Imported Feather for share icon
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MeditationFooter from '../constants/MeditationFooter';


const affirmationDictionary = {
  'Self-Love': [
    "I love and accept myself unconditionally.",
    "I am worthy of all the love and happiness in the world.",
    "I honor my body and treat it with kindness.",
    "I am enough just as I am.",
    "I forgive myself for past mistakes and grow from them.",
    "I embrace my uniqueness and value my individuality.",
    "I radiate confidence and positivity.",
    "I am deserving of all the good things that come my way.",
    "I am worthy of love, respect, and all good things life has to offer.",
    "I believe in myself and my abilities."
  ],
  'Gratitude': [
    "I am grateful for the abundance in my life.",
    "Each day, I find something new to be grateful for.",
    "I appreciate the small blessings that make my life beautiful.",
    "I am thankful for my health and well-being.",
    "Gratitude fills my heart and soul every day.",
    "I am thankful for the people who love and support me.",
    "I express my gratitude with a happy heart.",
    "I appreciate the opportunities I have to grow and learn.",
    "I am grateful for every moment of peace and joy in my life.",
    "I acknowledge and appreciate my life's blessings, big and small."
  ],
  'Motivation': [
    "I am driven to achieve my goals and dreams.",
    "Every day, I take positive steps towards my success.",
    "I am focused, determined, and unstoppable.",
    "My passion fuels my ambition to succeed.",
    "I overcome challenges with strength and perseverance.",
    "I have the power to create my own success.",
    "I am constantly learning and growing towards my goals.",
    "I stay motivated and inspired to work towards my dreams.",
    "Every setback is an opportunity to rise stronger.",
    "I believe in my abilities to achieve greatness."
  ],
  'Health & Wellness': [
    "I prioritize my physical and mental health every day.",
    "My body is strong, healthy, and capable of achieving great things.",
    "I make choices that nourish and support my body.",
    "I listen to my body and give it what it needs.",
    "Every day, I am becoming healthier and stronger.",
    "I am grateful for my body's ability to heal and rejuvenate.",
    "I love my body and appreciate its strength and resilience.",
    "I am worthy of feeling vibrant and energized.",
    "My mind and body are in perfect harmony.",
    "I choose to live a healthy, active lifestyle."
  ],
  'Confidence': [
    "I am confident in my abilities and strengths.",
    "I trust myself and my decisions.",
    "I am proud of all I have achieved and excited for what’s ahead.",
    "I radiate confidence in every aspect of my life.",
    "I believe in myself and my potential for success.",
    "I am capable of overcoming any challenge with confidence.",
    "My confidence grows with each step I take.",
    "I trust in my ability to achieve my goals and dreams.",
    "I am proud of who I am and all that I have accomplished.",
    "I embrace new experiences with confidence and enthusiasm."
  ],
  'Positivity': [
    "I choose to focus on the positive aspects of life.",
    "I am in control of my thoughts and emotions.",
    "I embrace each day with a positive attitude.",
    "I see challenges as opportunities to grow and improve.",
    "I spread positivity wherever I go.",
    "I attract positive energy and people into my life.",
    "I am grateful for the good that is already in my life.",
    "I look for the silver lining in every situation.",
    "I choose to see the good in others and myself.",
    "I believe that positive things are always on the way."
  ],
  'Abundance': [
    "I am abundant in all areas of my life.",
    "I attract wealth and prosperity effortlessly.",
    "I deserve to experience abundance and success.",
    "I am open to receiving all the abundance the universe has to offer.",
    "Abundance flows to me freely and easily.",
    "I am grateful for the abundance I currently have in my life.",
    "My thoughts and actions create a life of abundance.",
    "I am worthy of all the wealth, love, and success I desire.",
    "I attract positive opportunities and financial success.",
    "I trust that abundance is always available to me."
  ],
  'Peace & Calm': [
    "I am calm, centered, and at peace with myself.",
    "I let go of stress and embrace tranquility.",
    "I am at peace with my past, present, and future.",
    "I create moments of peace throughout my day.",
    "I trust that everything is unfolding exactly as it should.",
    "I am grounded in the present moment and release worries.",
    "Peace flows through me with every breath I take.",
    "I find peace in the simple moments of life.",
    "I choose to be calm, even in challenging situations.",
    "I am at peace with who I am and where I am in life."
  ],
  'Manifestation': [
    "I am worthy of my dreams and desires.",
    "I am a powerful creator of my reality.",
    "Everything I desire is already on its way to me.",
    "I believe in the power of manifestation and attract what I need.",
    "I am open to receiving everything I have been manifesting.",
    "My desires are in alignment with the universe’s plan for me.",
    "I trust the process of manifestation and surrender to it.",
    "I manifest with love, clarity, and purpose.",
    "The universe is working in my favor to bring my dreams to life.",
    "I manifest abundance and success in all areas of my life."
  ],
  'Success': [
    "I am successful in all that I do.",
    "Success comes easily and effortlessly to me.",
    "I trust in my ability to achieve great things.",
    "Every step I take leads me closer to my goals.",
    "I am confident in my ability to succeed and thrive.",
    "I celebrate every achievement, no matter how small.",
    "Success is my natural state, and I embrace it.",
    "I am grateful for the success that flows into my life.",
    "I am determined, focused, and driven to succeed.",
    "I attract opportunities that lead to success and fulfillment."
  ],
};
const AffirmationsScreen = () => {
  const [currentAffirmations, setCurrentAffirmation] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [userAffirmations, setUserAffirmations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [streak, setStreak] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          headers: { Authorization: 'Client-ID NkWSWhSJx9Plwlaxq9vhGq5eORoJdzWq3OfDZmJwReE' },
          params: { query: 'inspiration' },
        });
        setBackgroundImage(response.data.urls.regular);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    const updateStreak = async () => {
      try {
        const today = new Date().toDateString();
        const lastInteraction = await AsyncStorage.getItem('lastInteractionDate');
        if (lastInteraction && new Date(lastInteraction).toDateString() === today) return;

        setStreak(prev => prev + 1);
        await AsyncStorage.setItem('lastInteractionDate', today);
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    };

    fetchImage();
    updateStreak();
  }, []);

  const handleCategorySelect = category => {
    const affirmations = affirmationDictionary[category];
    if (affirmations && affirmations.length > 0) {
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      setCurrentAffirmation([randomAffirmation]);
    }
  }
  const changeAffirmation = () => {
    const allAffirmations = Object.values(affirmationDictionary).flat().concat(userAffirmations);
    const randomAffirmation = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
    Alert.alert('New Affirmation', randomAffirmation);
  }

  const addUserAffirmation = () => {
    if (!newAffirmation.trim()) {
      Alert.alert('Error', 'Affirmation cannot be empty.');
      return;
    }
    setUserAffirmations(prev => [...prev, newAffirmation.trim()]);
    setNewAffirmation('');
    setModalVisible(false);
    Alert.alert('Success', 'Affirmation added!');
  };

  const scheduleNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Your Daily Affirmation', body: currentAffirmations[0] || '' },
        trigger: { hour: 9, minute: 0, repeats: true },
      });
      Alert.alert('Reminder Set', 'You will receive daily affirmations at 9:00 AM.');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const downloadImage = async () => {
    if (!backgroundImage) return;
    const fileUri = `${FileSystem.cacheDirectory}affirmation-background.jpg`;
    try {
      await FileSystem.downloadAsync(backgroundImage, fileUri);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Download Complete', 'Image saved to cache.');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <>
      <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
        <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
          <View style={styles.overlay}>

            {/* Top Bar ScrollView */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
              style={styles.categoryScrollView}
            >
              {Object.keys(affirmationDictionary).map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
                  onPress={() => handleCategorySelect(category)}
                  accessible
                  accessibilityLabel={`Select ${category} affirmations`}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Display Affirmations */}
            <ScrollView style={styles.affirmationList}>
              {currentAffirmations.map((affirmation, index) => (
                <Text key={index} style={styles.affirmationText}>
                  {affirmation}
                </Text>
              ))}
            </ScrollView>

            <View style={styles.header}>
              <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.footerButton} onPress={changeAffirmation}>
                <Ionicons name="refresh-circle" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={downloadImage}>
                <Ionicons name="download-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={() => Alert.alert('Share', 'Functionality to share the affirmation.')}>
                <Feather name="share-2" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={() => Alert.alert('Like', 'You liked this affirmation.')}>
                <Ionicons name="heart" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={scheduleNotification}>
                <MaterialIcons name="notifications-active" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your affirmation"
              value={newAffirmation}
              onChangeText={setNewAffirmation}
              accessible
              accessibilityLabel="Enter your new affirmation"
            />
            <TouchableOpacity style={styles.modalButton} onPress={addUserAffirmation}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MeditationFooter />
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  categoryScrollView: {
    maxHeight: 50,
    marginVertical: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryButton: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff80',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    borderBottomColor: '#FFD700',
    borderBottomWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  affirmationList: {
    marginVertical: 20,
  },
  affirmationText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 15,
  },
  streakText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#191414',
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AffirmationsScreen;



