import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MeditationFooter from '../constants/MeditationFooter';

const Meditation = () => {
  return (
    <>
    <View style={styles.container}>
      <Text style={styles.text}>Let's Meditate!</Text>
      
    </View>
    <MeditationFooter />
    </>
  );
};

// Define styles properly
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#000', // Set solid black background
  },
  text: {
    fontSize: 32, // Adjust font size for a heading effect
    color: '#FFFFFF', // Set text color to white
    fontWeight: 'bold', // Make text bold
    marginBottom: 20, // Space between text and footer
  },
});

export default Meditation;
