import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Footer from '../constants/Footer'; // Adjust this path if Footer is in a different folder
import Slider from '@react-native-community/slider'; // Corrected import for slider
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

  const onSliderValueChange = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
    setPosition(value);
  };

  return (
    <>
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome back Aditi!</Text>
        
        {/* Album Art */}
        <Image
          source={require('../assets/background.jpg')} // Replace with your album art
          style={styles.albumArt}
        />
        
        {/* Track Title and Artist */}
        <Text style={styles.trackTitle}>Curated Ambient Music</Text>
        

        {/* Slider and Time */}
        <View style={styles.sliderContainer}>
          <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
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

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={stopMusic} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Stop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={playMusic} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleLoop} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{isLooping ? 'Disable Loop' : 'Enable Loop'}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        
      </View>
    </View>
    <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  albumArt: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  artist: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '80%',
    height: 40,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage;
