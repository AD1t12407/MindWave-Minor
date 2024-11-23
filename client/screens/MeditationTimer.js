import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';

const MeditationTimer = ({ route }) => {
  const { theme } = route.params;
  const [time, setTime] = useState(300); // Default 5 minutes (300 seconds)
  const [timerRunning, setTimerRunning] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (timerRunning && time > 0) {
      const timerId = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [timerRunning, time]);

  // Load the audio file based on the selected theme
  const loadSound = async () => {
    const soundFileMap = {
      //mountain: require('../assets/music/mountain.mp3'),
      rain: require('../assets/music/rain.mp3'),
      //fire: require('../assets/music/fire.mp3'),
     //city: require('../assets/music/city.mp3'),
     // farm: require('../assets/music/farm.mp3'),
      //night: require('../assets/music/night.mp3'),
    };

    const { sound } = await Audio.Sound.createAsync(soundFileMap[theme.id]);
    setSound(sound);
  };

  // Start or stop music playback
  const handleTimerToggle = async () => {
    if (timerRunning) {
      setTimerRunning(false);
      if (sound) {
        await sound.pauseAsync();
      }
    } else {
      setTimerRunning(true);
      if (!sound) {
        await loadSound();
      }
      if (sound) {
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
      }
    }
  };

  // Cleanup the sound when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
    setTimerRunning(false);
    if (sound) {
      sound.stopAsync();
    }
  };

  return (
    <ImageBackground source={theme.image} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.timerText}>
          {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
        </Text>
        <TouchableOpacity style={styles.timerButton} onPress={handleTimerToggle}>
          <Text style={styles.buttonText}>{timerRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTimerRunning(false)}>
          <Text style={styles.adjustTimer}>Adjust Timer</Text>
        </TouchableOpacity>
        {!timerRunning && (
          <ScrollView horizontal contentContainerStyle={styles.timeOptions}>
            {[1, 3, 5, 10, 15].map((minutes) => (
              <TouchableOpacity key={minutes} onPress={() => handleTimeSelect(minutes * 60)}>
                <Text style={styles.timeOption}>{minutes} min</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
};

// Define styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    paddingTop: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  adjustTimer: {
    color: '#FFFFFF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  timeOptions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  timeOption: {
    fontSize: 16,
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
});

export default MeditationTimer;
