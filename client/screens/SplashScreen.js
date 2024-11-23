import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get screen width for animation

const SplashScreen = ({ navigation }) => {
  const wipeAnim = useRef(new Animated.Value(0)).current; // Wipe animation
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in animation for logo

  useEffect(() => {
    // Combine wipe and fade animations
    Animated.sequence([
      // Wipe animation
      Animated.timing(wipeAnim, {
        toValue: width, // Expand horizontally
        duration: 900,
        useNativeDriver: false, // Required for width animation
      }),
      // Fade-in animation for logo
      Animated.timing(fadeAnim, {
        toValue: 5,
        duration: 1600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to Onboarding after the animation sequence
      navigation.navigate('Onboarding');
    });
  }, [wipeAnim, fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      {/* Wipe Effect */}
      <Animated.View
        style={[
          styles.wipeEffect,
          {
            width: wipeAnim, // Animate width dynamically
          },
        ]}
      />

      {/* Logo with Fade-In */}
      <Animated.Image
        source={require('../assets/icon.png')} // Path to your logo
        style={[styles.logo, { opacity: fadeAnim }]} // Apply fade effect
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  wipeEffect: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000', // Wipe effect color
    width: 0, // Start with zero width
    zIndex: 0, // Keep wipe below the logo
  },
  logo: {
    width: 200,
    height: 200,
    zIndex: 1, // Ensure the logo stays above the wipe effect
  },
});

export default SplashScreen;
