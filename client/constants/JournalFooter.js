import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const JournalFooter = () => {
  const [activeTab, setActiveTab] = useState('MoodTracker');
  const navigation = useNavigation();

  const handlePress = (tab) => {
    setActiveTab(tab);

    // Navigate based on the tab pressed
    switch (tab) {
      case 'MoodTracker':
        navigation.navigate('MoodTracker'); // Replace with your screen name
        break;
      case 'JournalNotes':
        navigation.navigate('JournalNotes'); // Replace with your screen name
        break;
      case 'JournalReflections':
        navigation.navigate('JournalReflections'); // Replace with your screen name
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.footer}>
      {/* Mood Tracker Tab */}
      <TouchableOpacity onPress={() => handlePress('MoodTracker')}>
        <MaterialCommunityIcons
          name="emoticon-happy-outline"
          size={32}
          color={activeTab === 'MoodTracker' ? '#1E90FF' : '#ffffff'}
        />
      </TouchableOpacity>

      {/* Journal Tab */}
      <TouchableOpacity onPress={() => handlePress('JournalNotes')}>
        <Entypo
          name="open-book"
          size={32}
          color={activeTab === 'JournalNotes' ? '#1E90FF' : '#ffffff'}
        />
      </TouchableOpacity>

      {/* Reflections Tab */}
      <TouchableOpacity onPress={() => handlePress('JournalReflections')}>
        <MaterialCommunityIcons
          name="thought-bubble-outline"
          size={32}
          color={activeTab === 'JournalReflections' ? '#1E90FF' : '#ffffff'}
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
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
});

export default JournalFooter;
