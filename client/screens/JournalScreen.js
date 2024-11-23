import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as Speech from "expo-speech"; // For voice-to-text feature
import { BarChart } from "react-native-chart-kit"; // For mood history visualization
import { Audio } from 'expo-av'; // For audio recording

const JournalScreen = () => {
  const [mood, setMood] = useState("");
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);  // Declare entries state
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Declare state for search query
  const [isRecording, setIsRecording] = useState(false); // State to track if recording
  const [recording, setRecording] = useState(); // State to hold the recording
  const [selectedEntry, setSelectedEntry] = useState(null); // State for selected entry for editing

  const moods = ["😄", "😐", "😢", "😡", "😴"];

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    updateMoodHistory();
  }, [entries]);

  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:3000/home");
      const data = await response.json();
      const formattedEntries = data.map((item) => ({
        mood: item.mood,
        entry: item.text,
        date: new Date(item.date).toDateString(),
        tags: item.tags || [],
        id: Math.random().toString(),
      }));
      setEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const updateMoodHistory = () => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    setMoodData(Object.keys(moodCounts).map((mood) => moodCounts[mood]));
  };

  const handleAddEntry = () => {
    if (mood && entry && selectedDate) {
      const newEntry = {
        id: Math.random().toString(), // Unique ID
        text: entry,
        mood,
        date: selectedDate,
        tags: currentTag ? [currentTag] : [],
      };

      // Update the state
      setEntries((prevEntries) => [newEntry, ...prevEntries]);

      // Clear form
      setMood("");
      setEntry("");
      setSelectedDate("");
      setCurrentTag("");

      console.log("New entry added:", newEntry); // Debugging
    } else {
      Alert.alert("Missing Information", "Please fill out all fields.");
    }
  };

  const handleEditEntry = () => {
    if (selectedEntry && mood && entry && selectedDate) {
      const updatedEntry = {
        ...selectedEntry,
        text: entry,
        mood,
        date: selectedDate,
        tags: currentTag ? [currentTag] : [],
      };

      setEntries((prevEntries) => 
        prevEntries.map((entry) => (entry.id === selectedEntry.id ? updatedEntry : entry))
      );

      // Clear form
      setMood("");
      setEntry("");
      setSelectedDate("");
      setCurrentTag("");
      setSelectedEntry (null); // Reset selected entry after editing

      console.log("Entry updated:", updatedEntry); // Debugging
    } else {
      Alert.alert("Missing Information", "Please fill out all fields.");
    }
  };

  const handleDeleteEntry = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    Alert.alert("Entry Deleted", "Your journal entry has been deleted.");
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

  const handleVoiceInput = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        setIsRecording(true);
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        console.log('Recording started');
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      Alert.alert("Permission Denied", "Please enable microphone access.");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setEntry(`Recorded entry: ${uri}`); // Store the recording URI in the journal entry
    setRecording(undefined); // Clear the recording state
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardMood}>{item.mood}</Text>
      <Text style={styles.cardEntry}>{item.entry}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
      <Text style={styles.cardTags}>
        Tags: {item.tags.length ? item.tags.join(", ") : "None"}
      </Text>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => {
          setSelectedEntry(item);
          setEntry(item.entry);
          setMood(item.mood);
          setSelectedDate(item.date);
          setCurrentTag(item.tags.join(", "));
        }}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
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
                style={[
                  styles.moodIcon,
                  mood === emoji && styles.selectedMood,
                ]}
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
        <TextInput
          style={styles.input}
          placeholder="Add a tag (optional)"
          value={currentTag}
          onChangeText={setCurrentTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={selectedEntry ? handleEditEntry : handleAddEntry}>
          <Icon name="add-circle" size={28} color="#fff" />
          <Text style={styles.addButtonText}>{selectedEntry ? "Update Entry" : "Add Entry"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.voiceInputContainer}>
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={isRecording ? stopRecording : handleVoiceInput}
        >
          <MaterialCommunityIcons name="microphone" size={28} color="#fff" />
          <Text style={styles.voiceButtonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style 
      ={styles.scrollContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search entries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={entries.filter(entry =>
            entry.text.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.entriesList}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.analyticsButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.analyticsButtonText}>View Mood Analytics</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Mood Analytics Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mood Analytics</Text>
            <BarChart
              data={{
                labels: ["😄", "😐", "😢", "😡", "😴"],
                datasets: [
                  {
                    data: moodData,
                  },
                ],
              }}
              width={320}
              height={220}
              yAxisLabel=""
              yAxisInterval={1}
              fromZero={true}
              chartConfig={{
                backgroundColor: "#000000",
                backgroundGradientFrom: "#1e3c72",
                backgroundGradientTo: "#2a5298",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  moodSelector: {
    marginBottom: 20,
  },
  moodText: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  moodIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  moodIcon: {
    fontSize: 30,
    margin: 5,
  },
  selectedMood: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 60,
    borderColor: "#0000",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "#2a2a2a",
    textAlignVertical: "top",
    color: "white",
  },
  dateButton: {
    backgroundColor: "#0B60B0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#0B60B0",
    padding: 10,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  voiceInputContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  voiceButton: {
    backgroundColor: "#0B60B0",
    padding: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  voiceButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "#2a2a2a",
  },
  entriesList: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardMood: {
    fontSize: 24,
    textAlign: "center",
  },
  cardEntry: {
    fontSize: 16,
    marginVertical: 5,
    color: "white",
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  cardTags: {
    fontSize: 14,
    color: "#444",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    color: "#0B60B0",
    fontWeight: "bold",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
  analyticsButton: {
    backgroundColor: "#0B60B0",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  analyticsButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: "#0B60B0",
    marginTop: 5,
    padding: 10,
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: "#fff",
  },
});

export default JournalScreen;