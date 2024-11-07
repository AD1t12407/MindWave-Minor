import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  const handleThemeSelect = (theme) => {
    navigation.navigate('MeditationTimer', { theme });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Choose a Theme to Meditate!</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {themes.map((theme) => (
            <TouchableOpacity key={theme.id} onPress={() => handleThemeSelect(theme)} style={styles.themeContainer}>
              <Image source={theme.image} style={styles.themeImage} />
              <Text style={styles.imageLabel}>{theme.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <MeditationFooter />
    </>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  themeContainer: {
    marginBottom: 20,
  },
  themeImage: {
    width: '100%',      // Make image span full width
    height: 200,        // Adjust the height as needed
    borderRadius: 10,
  },
  imageLabel: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Meditation;
