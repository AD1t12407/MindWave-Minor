import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigation = useNavigation();

  const handlePress = (tab) => {
    setActiveTab(tab);

    // Navigate based on the tab pressed
    switch (tab) {
      case 'Meditation':
        navigation.navigate('Meditation');
        break;
      case 'Chat':
        navigation.navigate('Chat');
        break;
      case 'BrainGames':
        navigation.navigate('BrainGames');
        break;
      case 'Songs':
        navigation.navigate('PlaylistScreen');
        break;
      case 'JournalScreen':
        navigation.navigate('JournalScreen');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => handlePress('Songs')}>
        <Ionicons
          name="musical-notes-outline"
          size={28}
          color={activeTab === 'Songs' ? '#1E90FF' : '#fff'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Chat')}>
        <Ionicons
          name="chatbubble-outline"
          size={28}
          color={activeTab === 'Chat' ? '#1E90FF' : '#fff'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('BrainGames')}>
        <MaterialCommunityIcons
          name="brain"
          size={28}
          color={activeTab === 'BrainGames' ? '#1E90FF' : '#fff'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Meditation')}>
        <MaterialCommunityIcons
          name="meditation"
          size={28}
          color={activeTab === 'Meditate' ? '#1E90FF' : '#fff'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('JournalScreen')}>
        <Ionicons
          name="newspaper-outline"
          size={28}
          color={activeTab === 'JournalScreen' ? '#1E90FF' : '#fff'}
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

export default Footer;
