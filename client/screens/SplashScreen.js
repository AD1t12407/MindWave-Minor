import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the zoom-in animation
    const animation = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    // Start the animation and navigate to Onboarding after completion
    animation.start(() => {
      navigation.navigate('Onboarding'); // Navigate to Onboarding screen
    });
  }, [scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/icon.png')} // Ensure the path is correct
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
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
  logo: {
    width: 300, // Initial size of the logo
    height: 350,
  },
});

export default SplashScreen;
