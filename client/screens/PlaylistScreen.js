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
const MOOD_KEYWORD = "sad to positive";

const PlaylistScreen = () => {
  const [songs, setSongs] = useState([]);
  const [sound, setSound] = useState();
  const [loading, setLoading] = useState(true);
  const [playlistId, setPlaylistId] = useState("");

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

  // Fetch Mood-Based Tracks
  const fetchMoodSongs = async () => {
    try {
      const accessToken = await fetchAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          MOOD_KEYWORD
        )}&type=track&limit=30`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Check if the response is OK
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
  const fetchPlaylistSongs = async () => {
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

      // Check if the response is OK
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

      // Log the entire response data to understand its structure
      console.log("Playlist data:", data);

      // Check if items exist and is an array
      if (!data.items || !Array.isArray(data.items)) {
        console.error("No items found or items is not an array:", data.items);
        setLoading(false);
        return;
      }

      const playlistTracks = data.items
        .filter((item) => item.track && item.track.preview_url) // Ensure track exists
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
      <Text style={styles.playlistTitle}>Mood: Sad to Positive</Text>
      <TouchableOpacity style={styles.playButton} onPress={playRandomPreview}>
        <Icon name="shuffle" size={48} color="#1DB954" />
        <Text style={styles.playButtonText}>Shuffle Play</Text>
      </TouchableOpacity>

      <FlatList
        data={songs}
        renderItem={({ item }) => <SongCard song={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.songList}
      />

      {/* Import Playlist Section */}
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
          onPress={fetchPlaylistSongs}
          color="#1DB954"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  playlistTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  playButtonText: {
    color: "#1E90FF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  songList: { paddingBottom: 20 },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  albumCover: { width: 50, height: 50, borderRadius: 5, marginRight: 12 },
  songInfo: { flex: 1 },
  songTitle: { color: "#fff", fontSize: 16 },
  songArtist: { color: "#aaa", fontSize: 14 },
  importContainer: { marginTop: 20 },
  playlistInput: {
    backgroundColor: "#333",
    padding: 10,
    color: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#fff", fontSize: 16, marginTop: 10 },
});

export default PlaylistScreen;
