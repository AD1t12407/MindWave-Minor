import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";

const CLIENT_ID = "a64f4b97d5c744f7a4c6ab788b96a6c0";
const CLIENT_SECRET = "60ddee3b502348ca8ce43636c8abdd56";

const PlaylistScreen = () => {
  const [songs, setSongs] = useState([]);
  const [sound, setSound] = useState();
  const [loading, setLoading] = useState(true);
  const [playlistId, setPlaylistId] = useState("");
  const [mood, setMood] = useState("Calming");

  // Fetch Access Token
  const fetchAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token;
  };

  // Fetch Songs Based on Mood
  const fetchMoodSongs = async (currentMood) => {
    try {
      setLoading(true);
      const accessToken = await fetchAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          currentMood || mood
        )}&type=track&limit=30`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
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
      const previewTracks = data.tracks.items
        .filter((track) => track.preview_url)
        .map((track) => ({
          id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          albumCover: track.album.images[0].url,
          previewUrl: track.preview_url,
        }));

      setSongs(previewTracks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mood-based songs:", error);
      setLoading(false);
    }
  };

  // Fetch Playlist by ID
  const fetchPlaylistSongs = async (currentMood) => {
    if (!playlistId) return;
    setLoading(true);
    try {
      const accessToken = await fetchAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch playlist:",
          response.status,
          response.statusText
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      const playlistTracks = data.items
        .filter(
          (item) =>
            item.track &&
            item.track.preview_url &&
            item.track.name.toLowerCase().includes(
              (currentMood || mood).toLowerCase()
            )
        )
        .map((item) => ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists[0].name,
          albumCover: item.track.album.images[0].url,
          previewUrl: item.track.preview_url,
        }));

      setSongs(playlistTracks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      setLoading(false);
    }
  };

  // Play Random Preview
  const playRandomPreview = async () => {
    if (songs.length === 0) return;
    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: randomSong.previewUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
  };

  useEffect(() => {
    fetchMoodSongs();
    return sound ? () => sound.unloadAsync() : undefined;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading Playlist...</Text>
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
      <Icon name="play-circle-outline" size={24} color="#1DB954" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>Mood: {mood || "Sad to Happy"}</Text>

      <TouchableOpacity style={styles.playButton} onPress={playRandomPreview}>
  <Icon name="shuffle" size={28} color="#fff" />
  <Text style={styles.playButtonText}>Shuffle Play</Text>
</TouchableOpacity>

      <FlatList
        data={songs}
        renderItem={({ item }) => <SongCard song={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.songList}
      />

<View style={styles.moodContainer}>
  <TextInput
    style={styles.moodInput}
    placeholder="Enter Mood (e.g., Happy, Relaxing)"
    placeholderTextColor="#888"
    value={mood}
    onChangeText={(text) => setMood(text)}
  />
  <Button title="Fetch" onPress={() => fetchMoodSongs(mood)} color="#1DB954" />
</View>


      <View style={styles.importContainer}>
        <TextInput
          style={styles.playlistInput}
          placeholder="Enter Spotify Playlist ID"
          placeholderTextColor="#888"
          value={playlistId}
          onChangeText={setPlaylistId}
        />
        <Button
          title="Import Playlist"
          onPress={() => fetchPlaylistSongs(mood)}
          color="#1DB954"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
    paddingTop:30
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#1DB954",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginVertical: 20,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  songList: {
    paddingBottom: 20,
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  songArtist: {
    color: "#ccc",
    fontSize: 14,
  },
  importContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
  },
  playlistInput: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginBottom: 20,
  },
  moodInput: {
    flex: 1,
    backgroundColor: "#333",
    padding: 10,
    color: "#fff",
    borderRadius: 8,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
});


export default PlaylistScreen;