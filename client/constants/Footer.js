import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const Footer = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigation = useNavigation(); // Get the navigation prop

  const handlePress = (tab) => {
    setActiveTab(tab);

    // Navigate based on the tab pressed
    switch (tab) {
      case 'Home':
        navigation.navigate('HomePage'); // Navigate to Home Page
        break;
      case 'Chat':
        navigation.navigate('Chat'); // Navigate to Chat Page
        break;
      case 'Songs':
        navigation.navigate('PlaylistScreen'); // Navigate to Playlist Page
        break;
      case 'JournalScreen':
        navigation.navigate('JournalScreen'); // Navigate to News Page
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => handlePress('Home')}>
        <Icon 
          name="home-outline" 
          size={28} 
          color={activeTab === 'Home' ? '#1E90FF' : '#fff'} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Chat')}>
        <Icon 
          name="chatbubble-outline" 
          size={28} 
          color={activeTab === 'Chat' ? '#1E90FF' : '#fff'} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Songs')}>
        <Icon 
          name="musical-notes-outline" 
          size={28} 
          color={activeTab === 'Songs' ? '#1E90FF' : '#fff'} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('JournalScreen')}>
        <Icon 
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
    backgroundColor: '#191414', // Spotify's dark background color
    paddingVertical: 12,
  },
});

export default Footer;
