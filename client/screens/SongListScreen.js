import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import SongCard from './SongCard';

const SongListScreen = ({ songs, onSongPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <SongCard song={item} onPress={() => onSongPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
});

export default SongListScreen;
