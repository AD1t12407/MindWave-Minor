import React from 'react';
import { View, Text } from 'react-native';
import MeditationFooter from '../constants/MeditationFooter'; 



const NatureMeditateScreen = () => {
  return (
    <>
    <View style={{ flex: 1 }}>
      <Text>Let's Meditate with Timer !</Text>
      {/* Place the MeditationFooter outside of the main View to avoid structure issues */}
      
    </View>
    <MeditationFooter />
    </>
  );
};

export default NatureMeditateScreen;
