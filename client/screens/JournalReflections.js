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
    { id: "1", title: "Productivity Tips", date: "2024-11-20" },
    { id: "2", title: "Reflections on Kindness", date: "2024-11-22" },
  ]);
  const [markedDates, setMarkedDates] = useState({
    "2024-11-20": { marked: true, dotColor: "#FF6347" },
    "2024-11-22": { marked: true, dotColor: "#FF6347" },
  });
  const [prompt, setPrompt] = useState("");  // Input for reflection
  const [response, setResponse] = useState("");  // Groq API response

  const groq = new Groq({
    apiKey: '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',
  });

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
          { role: "user", content: prompt },  // Use prompt for API
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

  const handleNewEntry = () => {
    const newDate = new Date().toISOString().split("T")[0];
    const newEntry = {
      id: Math.random().toString(),
      title: "New Journal Entry",
      date: newDate,
    };

    setJournalEntries([...journalEntries, newEntry]);
    setMarkedDates({
      ...markedDates,
      [newDate]: { marked: true, dotColor: "#FF6347" },
    });
  };

  const renderJournalItem = ({ item }) => (
    <View style={styles.journalItem}>
      <Text style={styles.journalTitle}>{item.title}</Text>
      <Text style={styles.journalDate}>{item.date}</Text>
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

        {/* Your Articles */}
        <View style={styles.journalSection}>
          <Text style={styles.sectionTitle}>Your Diary</Text>
          <FlatList
            data={journalEntries}
            renderItem={renderJournalItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleNewEntry}>
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  reflectionContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: "#FF6347",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    color: "#f1f1f1",
    backgroundColor: "#1e1e1e",
    marginBottom: 10,
  },
  response: {
    marginTop: 10,
    fontSize: 16,
    color: "#f1f1f1",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f1f1f1",
  },
  headerIcons: {
    flexDirection: "row",
  },
  featuredSection: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f1f1f1",
    marginBottom: 10,
  },
  featuredButton: {
    backgroundColor: "#FF6347",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  featuredButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  calendarContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f1f1f1",
    marginBottom: 10,
  },
  journalSection: {
    marginBottom: 20,
  },
  journalItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f1f1f1",
  },
  journalDate: {
    fontSize: 14,
    color: "#f1f1f1",
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
