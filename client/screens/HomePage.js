import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Footer from '../constants/Footer'; // Adjust this path if Footer is in a different folder
import { Audio } from 'expo-av'; // Ensure you have expo-av installed

const HomePage = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef(null);

  const loadSound = async () => {
    const { sound: loadedSound } = await Audio.Sound.createAsync(
      require('../assets/ambient_music.mp3'), // Replace with your ambient music file path
      {
        shouldPlay: true,
        isLooping: isLooping,
      }
    );
    setSound(loadedSound);
    soundRef.current = loadedSound;

    loadedSound.setOnPlaybackStatusUpdate(status => {
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

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome to Home</Text>
        <Text style={styles.subheading}>
          Discover playlists, chat, and stay updated with the latest news.
        </Text>

        <View style={styles.player}>
          <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={isPlaying ? pauseMusic : playMusic} style={styles.playButton}>
              <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={stopMusic} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleLoop} style={styles.loopButton}>
              <Text style={styles.loopButtonText}>{isLooping ? 'Disable Loop' : 'Enable Loop'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    color: '#1E90FF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  player: {
    alignItems: 'center',
    marginTop: 20,
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
  },
  playButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 10,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loopButton: {
    backgroundColor: '#32CD32',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage;
