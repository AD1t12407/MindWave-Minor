import React from 'react';
import { View, Text } from 'react-native';
import MeditationFooter from '../constants/MeditationFooter'; // Ensure the import path is correct

const AffirmationsScreen = () => {
  return (
    <>
    <View style={{ flex: 1 }}>
      <Text>Daily Affirmations Lesgo!</Text>
      {/* Place the MeditationFooter outside of the main View to avoid structure issues */}
      
    </View>
    <MeditationFooter />
    </>

  );
};

export default AffirmationsScreen;
