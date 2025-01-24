import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from "react-native-calendars";
import Groq from "groq-sdk";

const JournalReflections = () => {
  const [journalEntries, setJournalEntries] = useState([
    { id: "1", title: "Productivity Tips", date: "2024-11-20", response: "" },
    { id: "2", title: "Reflections on Kindness", date: "2024-11-22", response: "" },
  ]);
  const [markedDates, setMarkedDates] = useState({
    "2024-11-20": { marked: true, dotColor: "#FF6347" },
    "2024-11-22": { marked: true, dotColor: "#FF6347" },
  });
  const [mood, setMood] = useState("happy"); // Mood state
  const [response, setResponse] = useState("");  // Groq API response
  const [prompt, setPrompt] = useState("");  // User input for reflection

  const groq = new Groq({
    apiKey: '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',
  });

  // Function to generate mood-based reflection prompt
  const generateMoodPrompt = () => {
    if (mood === "happy" || mood === "excited") {
      return "What made you feel excited or happy today? How can you carry this positivity forward?";
    }
    return "Reflect on how you're feeling right now. What could make you feel better?";
  };

  // Function to call the Groq API
  const fetchReflection = async () => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a thoughtful and insightful AI named Llama. Your task is to generate daily prompts that encourage reflection and mindfulness. Each prompt should:
            1. Be thought-provoking and open-ended to inspire deep thinking.
            2. Encourage self-reflection and personal growth.
            3. Promote mindfulness, gratitude, or introspection.
            4. Avoid being overly prescriptive; let the user’s response guide them.
            5. Ensure the prompt is relevant to daily life and provides a space for emotional processing and mental well-being.`
          },
          { role: "user", content: generateMoodPrompt() },  // Use mood-based prompt
        ],
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      });

      // Log the full API response for debugging
      console.log("Groq API Response:", chatCompletion);

      // Check if the response contains 'choices' before accessing it
      if (
        chatCompletion.data &&
        chatCompletion.data.choices &&
        chatCompletion.data.choices[0] &&
        chatCompletion.data.choices[0].message &&
        chatCompletion.data.choices[0].message.content
      ) {
        setResponse(chatCompletion.data.choices[0].message.content || 'No response');
      } else {
        setResponse('No valid choices found in the response');
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Failed to fetch response. Please try again.');
    }
  };

  // Function to save the reflection as a journal entry
  const handleSaveEntry = () => {
    const newEntry = {
      id: Math.random().toString(),
      title: `Reflection - ${new Date().toISOString().split("T")[0]}`,
      date: new Date().toISOString().split("T")[0],
      response: response, // Save the API response here
    };

    setJournalEntries([...journalEntries, newEntry]);
    setMarkedDates({
      ...markedDates,
      [newEntry.date]: { marked: true, dotColor: "#FF6347" },
    });
  };

  const renderJournalItem = ({ item }) => (
    <View style={styles.journalItem}>
      <Text style={styles.journalTitle}>{item.title}</Text>
      <Text style={styles.journalDate}>{item.date}</Text>
      <Text style={styles.journalResponse}>{item.response}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <View style={styles.headerIcons}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#f1f1f1" />
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="#f1f1f1"
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.featuredTitle}>Learn about mental well-being!</Text>
          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Read more</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Selector */}
        <View style={styles.moodContainer}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodButtons}>
            <Button title="Happy" onPress={() => setMood("happy")} color="#FF6347" />
            <Button title="Excited" onPress={() => setMood("excited")} color="#FF6347" />
            <Button title="Neutral" onPress={() => setMood("neutral")} color="#FF6347" />
          </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            markingType={'simple'}
            theme={{
              backgroundColor: '#1e1e1e',
              calendarBackground: '#1e1e1e',
              textSectionTitleColor: '#d1d1d1',
              selectedDayBackgroundColor: '#FF6347',
              todayTextColor: '#FF6347',
              dayTextColor: '#f1f1f1',
              textDisabledColor: '#444',
              dotColor: '#FF6347',
              arrowColor: '#FF6347',
              monthTextColor: '#f1f1f1',
            }}
          />
        </View>

        {/* Reflection Input and Response */}
        <View style={styles.reflectionContainer}>
          <Text style={styles.sectionTitle}>Generate Reflection</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your reflection prompt"
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
          <Button title="Generate" onPress={fetchReflection} color="#FF6347" />
          <Text style={styles.response}>{response}</Text>
          <Button title="Save Reflection" onPress={handleSaveEntry} color="#FF6347" />
        </View>

        {/* Recent Reflections */}
        <View style={styles.journalSection}>
          <Text style={styles.sectionTitle}>Recent Reflections</Text>
          <FlatList
            data={journalEntries}
            renderItem={renderJournalItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={handleSaveEntry}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FF6347",
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
  },
  featuredSection: {
    padding: 20,
    backgroundColor: "#444",
  },
  featuredTitle: {
    fontSize: 18,
    color: "#fff",
  },
  featuredButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  featuredButtonText: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  moodContainer: {
    padding: 20,
    backgroundColor: "#333",
  },
  moodButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarContainer: {
    padding: 10,
  },
  reflectionContainer: {
    padding: 20,
  },
  input: {
    height: 100,
    borderColor: "#fff",
    borderWidth: 1,
    color: "#fff",
    padding: 10,
    marginBottom: 10,
  },
  response: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  journalSection: {
    padding: 10,
  },
  journalItem: {
    marginRight: 20,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
  },
  journalTitle: {
    color: "#fff",
    fontSize: 18,
  },
  journalDate: {
    color: "#bbb",
  },
  journalResponse: {
    color: "#bbb",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 50,
  },
});

export default JournalReflections;
