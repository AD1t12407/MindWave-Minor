import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, Button, Alert, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import MeditationFooter from '../constants/MeditationFooter';
import { Audio } from 'expo-av';
import axios from 'axios';

const themes = [
  { id: 'mountain', label: 'Mountain', image: require('../assets/themes/mountain.jpg') },
  { id: 'rain', label: 'Rain', image: require('../assets/themes/rain.jpg') },
  { id: 'fire', label: 'Fire', image: require('../assets/themes/fire.jpg') },
  { id: 'city', label: 'City', image: require('../assets/themes/city.jpg') },
  { id: 'farm', label: 'Farm', image: require('../assets/themes/farm.jpg') },
  { id: 'night', label: 'Night', image: require('../assets/themes/night.jpg') },
];

const Meditation = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [musicUri, setMusicUri] = useState(null);
  const [sound, setSound] = useState();

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to select a location on the map.', [{ text: 'OK' }]);
      }
    };
    requestLocationPermission();
  }, []);
// fast api with ngrok 

  const fetchMusicFromLocation = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.post('https://0e71-100-24-73-52.ngrok-free.app/generate-music/', {
        latitude,
        longitude,
      });

      if (response.data && response.data.audio_url) {
        setMusicUri(response.data.audio_url);
      } else {
        Alert.alert('Error', 'Could not fetch music from the server.');
      }
    } catch (error) {
      console.error('Error fetching music:', error);
      Alert.alert('Error', 'Could not fetch music.');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (theme) => {
    setLoading(true);
    setSelectedTheme(theme.id); // Highlight the selected theme
    setTimeout(() => {
      setLoading(false);
      // Navigate to the 'MeditationTimer' screen with selected theme and location
      navigation.navigate('MeditationTimer', { theme, location: selectedLocation });
      setSelectedTheme(null); // Reset highlight after navigation
    }, 1000);
  };

  const handleMapSelect = () => {
    setMapVisible(true);
  };

  const handleLocationConfirm = async () => {
    setMapVisible(false);
    if (selectedLocation) {
      await fetchMusicFromLocation(selectedLocation.latitude, selectedLocation.longitude);
    }
  };

  const playMusic = async () => {
    if (musicUri) {
      const { sound } = await Audio.Sound.createAsync({ uri: musicUri });
      setSound(sound);
      await sound.playAsync();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Choose a Theme to Meditate!</Text>

        <TouchableOpacity style={styles.mapButton} onPress={handleMapSelect}>
          <Text style={styles.mapButtonText}>Select Location on Map</Text>
        </TouchableOpacity>

        {mapVisible && (
          <Modal animationType="slide" visible={mapVisible}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
              >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>
              <View style={styles.mapActions}>
                <Button title="Confirm Location" onPress={handleLocationConfirm} />
                <Button title="Cancel" onPress={() => setMapVisible(false)} color="red" />
              </View>
            </View>
          </Modal>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {themes.map((theme, index) => (
              <Animatable.View
                key={theme.id}
                animation="fadeInUp"
                delay={index * 150}
                style={styles.themeContainer}
              >
                <TouchableOpacity
                  onPress={() => handleThemeSelect(theme)} // Call handleThemeSelect on click
                  activeOpacity={0.8}
                  style={styles.touchableTheme}
                >
                  <Image source={theme.image} style={styles.themeImage} />
                  {selectedTheme === theme.id && <View style={styles.overlay} />}
                  <Text style={styles.imageLabel}>{theme.label}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </ScrollView>
        )}

        {musicUri && (
          <View style={styles.musicPlayer}>
            <Button title="Play Music" onPress={playMusic} />
          </View>
        )}
      </View>
      <MeditationFooter />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mapButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  themeContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    backgroundColor: '#222',
  },
  touchableTheme: {
    position: 'relative',
  },
  themeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageLabel: {
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
  },
  musicPlayer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#222',
    borderRadius: 10,
  },
});

export default Meditation;
