import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Audio } from "expo-av"; // Import Audio from expo-av
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for play/pause icons

const CLIENT_ID = "647fe4e7";

const PlaylistScreen = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("relaxing");
  const [currentSound, setCurrentSound] = useState(null); // To store the current playing sound instance
  const [playingSongId, setPlayingSongId] = useState(null); // To track which song is currently playing

  // Fetch Songs Based on Mood from Jamendo API
  const fetchMoodSongs = async (currentMood) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&tags=${encodeURIComponent(
          currentMood || mood
        )}&limit=100`
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch mood songs:",
          response.status,
          response.statusText
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      const tracks = data.results.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        albumCover: track.image,
        previewUrl: track.audio,
      }));

      setSongs(tracks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mood-based songs:", error);
      setLoading(false);
    }
  };

  // Play or Pause Song
  const togglePlayPause = async (song) => {
    if (playingSongId === song.id) {
      // If the same song is clicked, toggle play/pause
      if (currentSound) {
        await currentSound.stopAsync(); // Stop the current song
        setCurrentSound(null); // Reset the sound state
        setPlayingSongId(null); // Reset the playing song ID
      }
    } else {
      // If a different song is clicked, stop the current one and play the new one
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync(); // Unload the current song
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.previewUrl },
        { shouldPlay: true }
      );
      setCurrentSound(sound); // Store the sound instance
      setPlayingSongId(song.id); // Set the playing song ID
    }
  };

  useEffect(() => {
    fetchMoodSongs();
    return () => {
      if (currentSound) {
        currentSound.unloadAsync(); // Unload sound when the component is unmounted
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9B7EBD" />
        <Text style={styles.loadingText}>Loading Songs...</Text>
      </View>
    );
  }

  const SongCard = ({ song }) => (
    <View style={styles.songCard}>
      <Image source={{ uri: song.albumCover }} style={styles.albumCover} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>{song.artist}</Text>
      </View>
      {/* Play/Pause Button */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => togglePlayPause(song)}
      >
        <Ionicons
          name={playingSongId === song.id ? "pause-circle-outline" : "play-circle-outline"}
          size={32}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>Mood: {mood}</Text>
      <FlatList
        data={songs}
        renderItem={({ item }) => <SongCard song={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.songList}
      />
      <View style={styles.moodContainer}>
        <TextInput
          style={styles.moodInput}
          placeholder="Enter Mood (e.g., Happy, Relaxing)"
          placeholderTextColor="#bbb"
          value={mood}
          onChangeText={(text) => setMood(text)}
        />
        <Button title="Fetch" onPress={() => fetchMoodSongs(mood)} color="#9B7EBD" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop:30,
    backgroundColor: "#121212", // Dark background
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff", // Light text
  },
  songList: {
    paddingBottom: 100,
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#1E1E1E", // Darker background for song cards
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Light text for song title
  },
  songArtist: {
    fontSize: 14,
    color: "#bbb", // Lighter text for artist
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  moodContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  
  },
  moodInput: {
    flex: 1,
    padding: 8,
    marginRight: 8,
    borderColor: "#bbb", // Lighter border color
    borderWidth: 1,
    borderRadius: 4,
    color: "#fff", // Light text color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Dark background while loading
  },
  loadingText: {
    fontSize: 18,
    color: "#9B7EBD", // Accent color for text
  },
});

export default PlaylistScreen;
