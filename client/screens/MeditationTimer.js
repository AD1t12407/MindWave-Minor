import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { Circle, Svg } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

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

  const loadSound = async () => {
    try {
      const soundFileMap = {
        rain: require('../assets/music/rain.mp3'),
        // Add other themes as needed
      };
      const { sound } = await Audio.Sound.createAsync(soundFileMap[theme.id]);
      setSound(sound);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const handleTimerToggle = async () => {
    if (timerRunning) {
      setTimerRunning(false);
      if (sound) await sound.pauseAsync();
    } else {
      setTimerRunning(true);
      if (!sound) await loadSound();
      if (sound) {
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
      }
    }
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
    setTimerRunning(false);
    if (sound) sound.stopAsync();
  };

  const progress = (time / 300) * 100; // Calculate progress percentage

  return (
    <ImageBackground source={theme.image} style={styles.background}>
      <View style={styles.overlay}>
        <Animatable.View animation="zoomIn" duration={800} style={styles.circularTimerContainer}>
          <Svg width={screenWidth * 0.6} height={screenWidth * 0.6} viewBox="0 0 200 200">
            <Circle cx="100" cy="100" r="90" stroke="#444" strokeWidth="10" fill="none" />
            <Circle
              cx="100"
              cy="100"
              r="90"
              stroke="#9B7EBD"
              strokeWidth="10"
              fill="none"
              strokeDasharray="565.48"
              strokeDashoffset={(565.48 * (100 - progress)) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </Svg>
          <Text style={styles.timerText}>{`${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`}</Text>
        </Animatable.View>

        <TouchableOpacity
          style={styles.timerButton}
          onPress={handleTimerToggle}
          accessible={true}
          accessibilityLabel={timerRunning ? 'Pause Timer' : 'Start Timer'}
        >
          <Text style={styles.buttonText}>{timerRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        {!timerRunning && (
          <Animatable.View animation="fadeInUp" duration={500} style={styles.scrollContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeOptions}
            >
              {[1, 3, 5, 10, 15].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  onPress={() => handleTimeSelect(minutes * 60)}
                  style={styles.timeOption}
                  accessible={true}
                  accessibilityLabel={`Set timer to ${minutes} minutes`}
                >
                  <Text style={styles.timeOptionText}>{minutes} min</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animatable.View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  circularTimerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 42,
    color: '#FFF',
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
  },
  timerButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#9B7EBD',
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
  scrollContainer: {
    marginTop: 20,
    width: '100%',
  },
  timeOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  timeOption: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  timeOptionText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default MeditationTimer;
