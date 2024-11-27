import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MoodTracker =()=> {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [journalEntry, setJournalEntry] = useState("");

  const moods = [
    { id: 'angry', icon: 'emoticon-angry-outline' },
    { id: 'sad', icon: 'emoticon-sad-outline' },
    { id: 'neutral', icon: 'emoticon-neutral-outline' },
    { id: 'happy', icon: 'emoticon-happy-outline' },
    { id: 'excited', icon: 'emoticon-excited-outline' },
  ];

  const factors = [
    'Work', 'Exercise', 'Family', 'Hobbies', 'Finances', 'Sleep', 'Drink', 'Food', 
    'Relationships', 'Education', 'Weather', 'Music', 'Travel', 'Health'
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleFactorToggle = (factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(item => item !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const handleSubmit = () => {
    console.log({
      mood: selectedMood,
      factors: selectedFactors,
      journal: journalEntry,
    });
    alert('Your mood has been saved!');
    // Reset for a new entry
    setSelectedMood(null);
    setSelectedFactors([]);
    setJournalEntry("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodButton,
              selectedMood === mood.id && styles.moodButtonSelected,
            ]}
            onPress={() => handleMoodSelect(mood.id)}
          >
            <MaterialCommunityIcons
              name={mood.icon}
              size={40}
              color={selectedMood === mood.id ? '#ffffff' : '#555555'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitle}>What's affecting your mood?</Text>
      <View style={styles.factorsContainer}>
        {factors.map((factor) => (
          <TouchableOpacity
            key={factor}
            style={[
              styles.factorButton,
              selectedFactors.includes(factor) && styles.factorButtonSelected,
            ]}
            onPress={() => handleFactorToggle(factor)}
          >
            <Text
              style={[
                styles.factorText,
                selectedFactors.includes(factor) && styles.factorTextSelected,
              ]}
            >
              {factor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitle}>Let's write about it</Text>
      <TextInput
        style={styles.textInput}
        placeholder="How is your day going? How has it affected you?"
        placeholderTextColor="#888"
        value={journalEntry}
        onChangeText={setJournalEntry}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Mood</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  moodButton: {
    backgroundColor: '#2e2e3d',
    borderRadius: 50,
    padding: 10,
  },
  moodButtonSelected: {
    backgroundColor: '#3B1E54',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  factorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  factorButton: {
    backgroundColor: '#2e2e3d',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  factorButtonSelected: {
    backgroundColor: '#3B1E54',
  },
  factorText: {
    color: '#cccccc',
  },
  factorTextSelected: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#2e2e3d',
    color: '#ffffff',
    borderRadius: 10,
    padding: 15,
    height: 100,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#3B1E54',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default MoodTracker;