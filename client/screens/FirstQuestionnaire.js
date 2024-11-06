import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,

} from "react-native";
import Slider from "@react-native-community/slider";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import DropDownPicker from 'react-native-dropdown-picker';
import { Switch } from 'react-native-paper'; // Import Switch from react-native-paper
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const FirstQuestionnaire = () => {
  const [response, setResponse] = useState("");
  const [mood, setMood] = useState(null);
  const [brainwaveRange, setBrainwaveRange] = useState(0);
  const [age, setAge] = useState(null);
  const [open, setOpen] = useState(false); 
  const [gender, setGender] = useState(null); // State to hold selected gender
  const [genderOpen, setGenderOpen] = useState(false); 
  const [moodRating, setMoodRating] = useState(1);
  const [moodDescription, setMoodDescription] = useState("");
  const [activityLevel, setActivityLevel] = useState(null); // State to hold selected activity level
  const [activityOpen, setActivityOpen] = useState(false);
  const [heartRate, setHeartRate] = useState("");
  const [eegLevel, setEegLevel] = useState(0);
  const [musicGenres, setMusicGenres] = useState({
    Ambient: false,
    Classical: false,
    Pop: false,
    Jazz: false,
    Rock: false,
    Electronic: false,
    Other: false,
  });
  const [favoriteArtists, setFavoriteArtists] = useState("");
  const [musicBasedOnMood, setMusicBasedOnMood] = useState("");
  const [therapyGoals, setTherapyGoals] = useState({
    Relaxation: false,
    Focus: false,
    Creativity: false,
    EmotionalHealing: false,
    StressRelief: false,
    Other: false,
  });
  const [listeningFrequency, setListeningFrequency] = useState("");

  const navigation = useNavigation();

  const handleAnalyze = async () => {
    if (!response.trim()) {
      console.error("Input cannot be empty");
      return;
    }

    try {
      console.log("Analyzing mood..." + response);
      const result = await axios.post("http://localhost:3000/mood_text", {
        text: response,
      });
      setMood(result.data.mood);
    } catch (error) {
      console.error("Error analyzing mood:", error.message);
    }
  };

    
  // EEG state information
  const eegStates = [
    {
      label: "Not sure",
      frequency: "",
      state: "",
      emotion: ""
    },
    {
      label: "Delta Waves",
      frequency: "0.5 - 4 Hz",
      state: "Deep sleep, relaxation, unconscious states",
      emotion: "Not directly linked to emotions; more about deep rest and recovery."
    },
    {
      label: "Theta Waves",
      frequency: "4 - 8 Hz",
      state: "Light sleep, deep relaxation, creativity, meditative states",
      emotion: "Linked to deep, raw emotions, often subconscious processing."
    },
    {
      label: "Alpha Waves",
      frequency: "8 - 13 Hz",
      state: "Calm, relaxed but alert state, introspection",
      emotion: "Neutral to positive emotional states, common with calmness."
    },
    {
      label: "Beta Waves",
      frequency: "13 - 30 Hz",
      state: "Alertness, active thinking, focused attention; high-beta may indicate stress",
      emotion: "Focused mental activity (low-beta); stress or anxiety (high-beta)"
    },
    {
      label: "Gamma Waves",
      frequency: "30 Hz and above",
      state: "Highly active mental states, problem-solving, complex information processing",
      emotion: "Linked to positive mental states, heightened awareness, and peak experiences."
    }
  ];
  const currentEEG = eegStates[eegLevel];




  const handleNext = () => {
    if (!response.trim()) {
      console.error("Input cannot be empty");
      return;
    }
    navigation.navigate("HomePage");
  };

  const interpretEmotion = () => {
    if (brainwaveRange > 600 || brainwaveRange < -600) {
      return "Positive Signals detected: High engagement and positive emotional states (e.g., happiness, excitement, deep introspection).";
    } else if (brainwaveRange > -600 && brainwaveRange < 600) {
      return "Negative Signals detected: Mild to moderate negative emotions or cognitive discomfort (e.g., anxiety, stress).";
    } else if (brainwaveRange > -50 && brainwaveRange < 250) {
      return "Neutral Signals detected: Balanced emotional state, indicating normal cognitive processing without extremes.";
    }
    return "Emotion undetermined";
  };

  const handleMusicGenreChange = (genre) => {
    setMusicGenres((prevState) => ({
      ...prevState,
      [genre]: !prevState[genre],
    }));
  };

  const handleTherapyGoalChange = (goal) => {
    setTherapyGoals((prevState) => ({
      ...prevState,
      [goal]: !prevState[goal],
    }));
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.header}>User Input Form </Text>

      <Text style={styles.label}>Personal Information</Text>
      <Text style={styles.label}>Age:</Text>
      <DropDownPicker
        open={open}
        value={age}
        items={[
          { label: "Under 18", value: "Under 18" },
          { label: "18-24", value: "18-24" },
          { label: "25-34", value: "25-34" },
          { label: "35-44", value: "35-44" },
          { label: "45-54", value: "45-54" },
          { label: "55-64", value: "55-64" },
          { label: "65+", value: "65+" },
        ]}
        setOpen={setOpen}
        setValue={setAge}
        placeholder="Select Age"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      {/* Gender Dropdown */}
      <Text style={styles.label}>Gender:</Text>
      <DropDownPicker
        open={genderOpen}
        value={gender}
        items={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Non-binary", value: "Non-binary" },
          { label: "Prefer not to say", value: "Prefer not to say" },
        ]}
        setOpen={setGenderOpen}
        setValue={setGender}
        placeholder="Select Gender"
        style={styles.dropdown}
        dropDownContainerStyle={styles.genderDropdownContainer}
      />

      

      <Text style={styles.label}>Current Mood Assessment</Text>
      <Text style={styles.label}>Rate your current mood:</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        value={moodRating}
        onValueChange={setMoodRating}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#32CD32"
      />
      <Text style={styles.rangeText}>Mood Rating: {moodRating}</Text>

      <Text style={styles.label}>Describe your mood in a few words:</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your mood"
        placeholderTextColor="grey"
        value={moodDescription}
        onChangeText={setMoodDescription}
      />

      <Text style={styles.label}>EEG and Heart Rate Information</Text>


      {/* Activity Level Dropdown */}
      <Text style={styles.label}>Select your current activity level:</Text>
      <DropDownPicker
        open={activityOpen}
        value={activityLevel}
        items={[
          { label: "Resting", value: "Resting" },
          { label: "Working/Studying", value: "Working/Studying" },
          { label: "Exercising", value: "Exercising" },
          { label: "Relaxing", value: "Relaxing" },
          { label: "Socializing", value: "Socializing" },
        ]}
        setOpen={setActivityOpen}
        setValue={setActivityLevel}
        placeholder="Select Activity Level"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.label}>Estimated heart rate (bpm):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your heart rate"
        placeholderTextColor="grey"
        value={heartRate}
        onChangeText={setHeartRate}
        keyboardType="numeric"
      />


    <Text style={styles.label}>Current EEG state (if known):</Text>
      <Text style={styles.eegLabel}>{currentEEG.label} ({currentEEG.frequency})</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5}
        step={1}
        value={eegLevel}
        onValueChange={setEegLevel}
        minimumTrackTintColor="#0B60B0"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#0B60B0"
      />
      <View style={styles.sliderLabels}>
        {eegStates.map((state, index) => (
          <Text key={index} style={styles.labelText}>{state.label}</Text>
        ))}
      </View>
      <Text style={styles.description}>State: {currentEEG.state}</Text>
      <Text style={styles.description}>Emotion: {currentEEG.emotion}</Text>



      
      <Text style={styles.label}>Music Preferences</Text>
      <Text style={styles.label}>Preferred music genres:</Text>
      {Object.keys(musicGenres).map((genre) => (
        <View key={genre} style={styles.switchContainer}>
          <Switch
            value={musicGenres[genre]}
            onValueChange={() => handleMusicGenreChange(genre)}
            color="#1E90FF"
          />
          <Text style={styles.switchLabel}>{genre}</Text>
        </View>
      ))}

      <Text style={styles.label}>Favorite artists (separated by commas):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your favorite artists"
        placeholderTextColor="grey"
        value={favoriteArtists}
        onChangeText={setFavoriteArtists}
      />

      <Text style={styles.label}>Music based on mood:</Text>
      <TextInput
        style={styles.input}
        placeholder="Suggestions for music based on mood"
        placeholderTextColor="grey"
        value={musicBasedOnMood}
        onChangeText={setMusicBasedOnMood}
      />

      <Text style={styles.label}>Therapy Goals</Text>
      {Object.keys(therapyGoals).map((goal) => (
        <View key={goal} style={styles.switchContainer}>
          <Switch
            value={therapyGoals[goal]}
            onValueChange={() => handleTherapyGoalChange(goal)}
            color="#1E90FF"
          />
          <Text style={styles.switchLabel}>{goal}</Text>
        </View>
      ))}

      <Text style={styles.label}>Frequency of music listening:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Daily, Weekly"
        placeholderTextColor="grey"
        value={listeningFrequency}
        onChangeText={setListeningFrequency}
      />

      <Text style={styles.label}>Brainwave signal range:</Text>
      <Slider
        style={styles.slider}
        minimumValue={-1000}
        maximumValue={1000}
        value={brainwaveRange}
        onValueChange={setBrainwaveRange}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#32CD32"
      />
      <Text style={styles.rangeText}>Brainwave Range: {brainwaveRange}</Text>

      <Text style={styles.label}>Interpretation of Emotion:</Text>
      <Text style={{ color: '#FFF', fontSize: 16, marginVertical: 10 }}>
            {interpretEmotion()}
        </Text>

      <Pressable style={styles.button} onPress={handleAnalyze}>
        <Text style={styles.buttonText}>Analyze Mood</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
    
        container: {
          flex: 1,
          backgroundColor: "#121212",       // Subtle dark background
          padding: 20,
          paddingTop: 50,
        },
        
        header: {
          fontSize: 26,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 15,
          color: "#FFFFFF",
        },
        
        label: {
          fontSize: 16,
          fontWeight: "600",
          color: "#FFFFFF",                 // Consistent white for labels
          marginBottom: 8,
          textAlign: 'left',
        },
        
        eegLabel: {
          fontSize: 18,
          fontWeight: "700",
          color: "#FFFFFF",
          marginBottom: 10,
          textAlign: "center",
        },
        
        input: {
          borderWidth: 1,
          borderColor: "#444444",           // Dark grey for input borders
          borderRadius: 8,
          padding: 12,
          marginVertical: 10,
          fontSize: 16,
          color: "#E0E0E0",                 // Light text color for readability
          backgroundColor: "#1C1C1C",
        },
        
        dropdown: {
          marginBottom: 20,
          borderRadius: 8,
          backgroundColor: "#1C1C1C",
          zIndex:500,
        },
        
        dropdownContainer: {
          borderColor: "#0B60B0",
          backgroundColor: "#1C1C1C",
          borderRadius: 8,
          position: "absolute",
          width: "100%",
        },
        
        genderDropdownContainer: {
          borderColor: "#0B60B0",
          backgroundColor: "#333333",
          borderRadius: 8,
          zIndex:300,

         
        },
        
        slider: {
          width: "80%",
          alignSelf: "center",
          marginVertical: 20,
        },
        
        sliderLabels: {
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%",
          alignSelf: "center",
          marginBottom: 10,
        },
        
        rangeText: {
          fontSize: 16,
          color: "#FFFFFF",
          marginBottom: 20,
          textAlign: "center",
        },
        
        labelText: {
          fontSize: 14,
          fontWeight: "500",
          color: "#FFFFFF",
        },
        
        description: {
          fontSize: 16,
          color: "#0B60B0",                  // Highlight color for descriptions
          marginVertical: 5,
          textAlign: "center",
        },
        
        switchContainer: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        },
        
        switchLabel: {
          fontSize: 16,
          color: "#FFFFFF",
          marginLeft: 10,
        },
        
        button: {
          backgroundColor: "#0B60B0",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 20,
          alignItems: "center",
          marginVertical: 10,
        },
        
        buttonText: {
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "bold",
        },
      
});
  
  export default FirstQuestionnaire;