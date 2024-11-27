import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

import JournalFooter from '../constants/JournalFooter';

const JournalScreen = () => {
  const navigation = useNavigation();

  // Current date for marking the dot on the calendar
  const currentDate = new Date().toISOString().split('T')[0];

  // Handle footer navigation
  const navigateToJournal = () => {
    navigation.navigate('JournalScreen');
  };

  const navigateToMoodTracker = () => {
    navigation.navigate('MoodTracker');
  };

  const navigateToJournalReflection = () => {
    navigation.navigate('JournalReflections');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Welcome to Your Journal</Text>
        <Text style={styles.subtitle}>Track your mood, reflections, and daily thoughts here.</Text>

        {/* Calendar with dot on today's date */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={{
              [currentDate]: {
                marked: true,
                dotColor: '#D4BEE4', // Bright dot for today's date
                activeOpacity: 0,
              },
            }}
            markingType={'simple'}
            theme={{
              backgroundColor: '#1e1e1e',
              calendarBackground: '#1e1e1e',  // Calendar background
              textSectionTitleColor: '#f1f1f1', // Month title color
              selectedDayBackgroundColor: '#3B1E54', // Selected day background
              selectedDayTextColor: '#000', // Text color for selected day
              todayTextColor: '#9B7EBD', // Today's date text color
              dayTextColor: '#EEEEEE', // Default day text color
              textDisabledColor: '#444', // Disabled day text color
              dotColor: '#9B7EBD', // Default dot color
              arrowColor: '#9B7EBD', // Navigation arrows color
              monthTextColor: '#f1f1f1', // Month name text color
              indicatorColor: '#FF6347', // Indicator under the month name
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>
      </ScrollView>

      {/* Footer component */}
      <JournalFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  scrollViewContainer: {
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f1f1f1', // Light text color
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1a1', // Light grey
    marginBottom: 30,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  calendarContainer: {
    width: '90%',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a', // Dark grey background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default JournalScreen;
