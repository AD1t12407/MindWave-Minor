import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const JournalNotes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const getTextStyle = () => {
    return {
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      textDecorationLine: underline ? 'underline' : 'none',
    };
  };

  const handleSave = () => {
    console.log('Saving note:', { title, content });
    alert('Note saved successfully!');
    setTitle('');
    setContent('');
    setBold(false);
    setItalic(false);
    setUnderline(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          style={styles.titleInput}
          placeholder="It takes courage to be kind"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.contentInput, getTextStyle()]}
          placeholder="Today, I found myself reflecting on the power of kindness..."
          placeholderTextColor="#aaa"
          value={content}
          onChangeText={setContent}
          multiline
        />
      </ScrollView>

      {/* Text Formatting Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            bold ? styles.toolbarButtonSelected : null,
          ]}
          onPress={() => setBold(!bold)}
        >
          <Text style={[styles.toolbarText, { fontWeight: 'bold' }]}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            italic ? styles.toolbarButtonSelected : null,
          ]}
          onPress={() => setItalic(!italic)}
        >
          <Text style={[styles.toolbarText, { fontStyle: 'italic' }]}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            underline ? styles.toolbarButtonSelected : null,
          ]}
          onPress={() => setUnderline(!underline)}
        >
          <Text style={[styles.toolbarText, { textDecorationLine: 'underline' }]}>
            U
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="close" size={24} color="#f1f1f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="camera" size={24} color="#f1f1f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="pencil" size={24} color="#f1f1f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="microphone" size={24} color="#f1f1f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',  // Dark background
    padding: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f1f1',
    marginBottom: 15,
  },
  contentInput: {
    fontSize: 16,
    color: '#f1f1f1',
    flex: 1,
    paddingBottom: 20,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a3d',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  toolbarButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  toolbarButtonSelected: {
    backgroundColor: '#5a5af5',
    borderRadius: 5,
  },
  toolbarText: {
    fontSize: 18,
    color: '#f1f1f1',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a3d',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  actionButton: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#5a5af5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default JournalNotes;
