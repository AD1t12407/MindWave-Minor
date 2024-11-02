import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";

const JournalScreen = () => {
  const [mood, setMood] = useState("");
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const moods = ["😄", "😐", "😢", "😡", "😴"];

  // Fetch last 7 entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:3000/home"); // replace with actual backend URL
      const data = await response.json();
      const formattedEntries = data.map((item) => ({
        mood: item.mood,
        entry: item.text,
        date: new Date(item.date).toDateString(),
        id: Math.random().toString(), // unique ID for FlatList
      }));
      setEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleAddEntry = () => {
    if (mood && entry && selectedDate) {
      const newEntry = {
        mood,
        entry,
        date: selectedDate,
        id: Math.random().toString(),
      };
      setEntries([newEntry, ...entries]); // prepend new entry
      setMood("");
      setEntry("");
      setSelectedDate("");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date.toDateString());
    hideDatePicker();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardMood}>{item.mood}</Text>
      <Text style={styles.cardEntry}>{item.entry}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker & Journal</Text>

      <View style={styles.moodSelector}>
        <Text style={styles.moodText}>Select your mood:</Text>
        <View style={styles.moodIcons}>
          {moods.map((emoji) => (
            <TouchableOpacity key={emoji} onPress={() => setMood(emoji)}>
              <Text
                style={[styles.moodIcon, mood === emoji && styles.selectedMood]}
              >
                {emoji}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your journal entry..."
          value={entry}
          onChangeText={setEntry}
          multiline
        />
        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
          <Text style={styles.dateButtonText}>
            {selectedDate || "Select Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Icon name="add-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.entriesList}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 60,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  moodSelector: {
    marginBottom: 20,
    alignItems: "center",
  },
  moodText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  moodIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  moodIcon: {
    fontSize: 36,
    marginHorizontal: 5,
  },
  selectedMood: {
    borderColor: "#1E90FF",
    borderWidth: 2,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#1E90FF",
  },
  addButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  entriesList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardMood: {
    color: "#1E90FF",
    fontSize: 24,
    fontWeight: "bold",
  },
  cardEntry: {
    color: "#fff",
    marginTop: 4,
  },
  cardDate: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
});

export default JournalScreen;
