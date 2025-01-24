import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, Button, Alert, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import MeditationFooter from '../constants/MeditationFooter';
import { Audio } from 'expo-av'; // For playing audio
import axios from 'axios'; // To interact with GPT-4 and Riffusion APIs

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
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [musicUri, setMusicUri] = useState(null); // URI of the generated music
  const [sound, setSound] = useState(); // Audio player state
  const [locationContext, setLocationContext] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to select a location on the map.',
          [{ text: 'OK' }]
        );
      }
    };

    requestLocationPermission();
  }, []);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const apiKey =GOOGLE_API_KEY ;
      const radius = 2000; // 2 km radius
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        const places = data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          type: place.types[0] // Get the primary type of place
        }));


      // Generate location context for music generation
      const placeContext = places
      .slice(0, 5) // Limit to 5 places for prompt
      .map(place => `${place.name} (${place.type})`)
      .join(', ');
    
    setNearbyPlaces(places);
    setLocationContext(placeContext);
    
    // Immediately generate music prompt
    await generateMusicPrompt(latitude, longitude, placeContext);
  }
} catch (error) {
  console.error('Error fetching nearby places:', error);
}
};
    
 

  const handleThemeSelect = (theme) => {
    setLoading(true);
    setSelectedTheme(theme.id); // Highlight the selected theme
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('MeditationTimer', { theme, location: selectedPlace || selectedLocation });
      setSelectedTheme(null); // Reset highlight after navigation
    }, 1000);
  };

  const handleMapSelect = () => {
    setMapVisible(true);
  };

  const handleLocationConfirm = async () => {
    setMapVisible(false);
    if (selectedLocation) {
      fetchNearbyPlaces(selectedLocation.latitude, selectedLocation.longitude);
      await generateMusicPrompt(selectedLocation.latitude, selectedLocation.longitude);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    // Optional: Fetch thematic sounds based on the place type or name
  };

  const generateMusicPrompt = async (latitude, longitude, placeContext) => {
    try {
      // Create a sophisticated prompt for therapeutic music generation
      const prompt = `Create a deeply therapeutic and calming musical composition 
        inspired by the following location context: ${placeContext}. 
        The music should evoke a sense of peace, reflection, and inner tranquility. 
        Consider the ambient sounds, emotional landscape, and subtle textures 
        that might emerge from this specific geographical and cultural setting. 
        Aim for a soundscape that helps listeners meditate, reduce stress, 
        and connect with their inner self, drawing subtle inspirations from the 
        surrounding environment's unique characteristics.`;

      // Send to GPT-4 to refine the prompt
      const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system', 
            content: 'You are a master music prompt engineer specializing in therapeutic soundscapes.'
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${GPT_API_KEY}`,
        }
      });

      const refinedPrompt = gptResponse.data.choices[0].message.content;
      
      // Generate music using Riffusion
      await generateMusicFromPrompt(refinedPrompt);
    } catch (error) {
      console.error('Error generating music prompt:', error);
    }
  };


  const generateMusicFromPrompt = async (prompt) => {
    try {
      // Call Riffusion API to generate music based on GPT-4 prompt
      const riffusionResponse = await axios.post('https://api.replicate.com/v1/predictions', {
        version: 'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05',
        input: { 
          prompt_a: prompt,
          prompt_b: prompt, // Use same prompt for both to maintain consistency
          denoising: 0.75, // Adjust for smoother sound
          seed: Math.floor(Math.random() * 1000000) // Random seed for variation
        },
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_KEY}`,
        }
      });

      const audioUrl = riffusionResponse.data.output.audio;
      setMusicUri(audioUrl);
    } catch (error) {
      console.error('Error generating music:', error);
      Alert.alert('Music Generation Error', 'Could not generate music based on location.');
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
                {selectedLocation && (
                  <Marker coordinate={selectedLocation} />
                )}
              </MapView>
              <View style={styles.mapActions}>
                <Button title="Confirm Location" onPress={handleLocationConfirm} />
                <Button title="Cancel" onPress={() => setMapVisible(false)} color="red" />
              </View>
            </View>
          </Modal>
        )}

        {nearbyPlaces.length > 0 && (
          <FlatList
            data={nearbyPlaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => handlePlaceSelect(item)}
              >
                <Text style={styles.placeName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
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
                  onPress={() => handleThemeSelect(theme)}
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
  placeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  placeName: {
    fontSize: 16,
    color: '#fff',
  },
  musicPlayer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#222',
    borderRadius: 10,
  },
});

export default Meditation;
