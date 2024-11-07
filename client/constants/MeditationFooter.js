import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const MeditationFooter = () => {
  const [activeTab, setActiveTab] = useState('MeditateTimer');
  const navigation = useNavigation();

  const handlePress = (tab) => {
    setActiveTab(tab);

    // Navigate based on the tab pressed
    switch (tab) {
      case 'Meditation':
        navigation.navigate('Meditation'); // Adjust the screen name as necessary
        break;
      case 'Affirmations':
        navigation.navigate('Affirmations'); // Adjust the screen name as necessary
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => handlePress('Meditation')}>
        <MaterialCommunityIcons
          name="flower-tulip"
          size={32} // Increased icon size for better visibility
          color={activeTab === 'Meditation' ? '#1E90FF' : '#ffffff'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Affirmations')}>
        <Entypo
          name="open-book"
          size={32} // Increased icon size for better visibility
          color={activeTab === 'Affirmations' ? '#1E90FF' : '#ffffff'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#191414',
    paddingVertical: 12,
  },
  
});

export default MeditationFooter;
