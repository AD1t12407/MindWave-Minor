import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import MeditationFooter from '../constants/MeditationFooter';

const themes = [
  { id: 'mountain', label: 'Mountain', image: require('../assets/themes/mountain.jpg') },
  { id: 'rain', label: 'Rain', image: require('../assets/themes/rain.jpg') },
  { id: 'fire', label: 'Fire', image: require('../assets/themes/fire.jpg') },
  { id: 'city', label: 'City', image: require('../assets/themes/city.jpg') },
  { id: 'farm', label: 'Farm', image: require('../assets/themes/farm.jpg') },
  { id: 'night', label: 'Night', image: require('../assets/themes/night.jpg') },
];

const Meditation = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleThemeSelect = (theme) => {
    setLoading(true);
    setSelectedTheme(theme.id); // Highlight the selected theme
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('MeditationTimer', { theme });
      setSelectedTheme(null); // Reset highlight after navigation
    }, 1000);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Choose a Theme to Meditate!</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {themes.map((theme, index) => (
              <Animatable.View 
                key={theme.id} 
                animation="fadeInUp" 
                delay={index * 150} 
                style={styles.themeContainer}
              >
                <TouchableOpacity
                  onPress={() => handleThemeSelect(theme)}
                  activeOpacity={0.8}
                  style={styles.touchableTheme}
                >
                  <Image source={theme.image} style={styles.themeImage} />
                  {selectedTheme === theme.id && <View style={styles.overlay} />}
                  <Text style={styles.imageLabel}>{theme.label}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </ScrollView>
        )}
      </View>
      <MeditationFooter />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  themeContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    backgroundColor: '#222',
  },
  touchableTheme: {
    position: 'relative',
  },
  themeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageLabel: {
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire parent
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black
    borderRadius: 12,
  },
});

export default Meditation;

