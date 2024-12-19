import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
/*import Voice from 'react-native-voice';*/
import SignatureScreen from 'react-native-signature-canvas';
import * as Animatable from 'react-native-animatable';

const JournalNotes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [footerVisible, setFooterVisible] = useState(true);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const signatureRef = useRef();

  useEffect(() => {
    /*Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = (error) => console.error('Speech error:', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };*/
  }, []);

  const getTextStyle = () => ({
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine: underline ? 'underline' : 'none',
  });

  const handleSave = () => {
    const date = new Date();
    Alert.alert('Note saved successfully!', `Saved on: ${date.toLocaleString()}`);
    setTitle('');
    setContent('');
    setBold(false);
    setItalic(false);
    setUnderline(false);
    setSelectedImage(null);
    setRecordedText('');
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setContent((prev) => prev + `\n![Image](${result.assets[0].uri})`);
    }
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSpeechResults = (event) => {
    const speechText = event.value[0];
    setRecordedText(speechText);
    setContent((prev) => prev + `\n${speechText}`);
  };

  const handleSignature = (signature) => {
    setContent((prev) => prev + `\n![Signature](${signature})`);
    setDrawingMode(false);
  };

  const toggleFooter = () => setFooterVisible(!footerVisible);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Animatable.View animation="fadeInUp" duration={800}>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter your title here"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.contentInput, getTextStyle()]}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#aaa"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </Animatable.View>

        {/* Image and Signature Display */}
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        {drawingMode && (
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            backgroundColor="#121212"
            penColor="#fff"
            descriptionText="Draw your signature"
            style={styles.signature}
          />
        )}
        {recordedText && <Text style={styles.recordedText}>{recordedText}</Text>}
      </ScrollView>

      {/* Text Formatting Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarButton, bold && styles.toolbarButtonSelected]}
          onPress={() => setBold(!bold)}
        >
          <Text style={[styles.toolbarText, { fontWeight: 'bold' }]}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolbarButton, italic && styles.toolbarButtonSelected]}
          onPress={() => setItalic(!italic)}
        >
          <Text style={[styles.toolbarText, { fontStyle: 'italic' }]}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolbarButton, underline && styles.toolbarButtonSelected]}
          onPress={() => setUnderline(!underline)}
        >
          <Text style={[styles.toolbarText, { textDecorationLine: 'underline' }]}>U</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Actions */}
      <Animatable.View
        style={[styles.footer, footerVisible ? {} : styles.footerMinimized]}
        animation="slideInUp"
      >
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleFooter}>
            <MaterialCommunityIcons name="close" size={24} color="#f1f1f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleImagePicker}>
            <MaterialCommunityIcons name="camera" size={24} color="#f1f1f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setDrawingMode(!drawingMode)}>
            <MaterialCommunityIcons name="pencil" size={24} color="#f1f1f1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={recording ? stopRecording : startRecording}
          >
            <MaterialCommunityIcons name="microphone" size={24} color={recording ? '#FF5252' : '#f1f1f1'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop:50,
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
  image: {
    width: '100%',
    height: 200,
    marginVertical: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a3d',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  footerMinimized: {
    height: 0,
    opacity: 0,
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
  recordedText: {
    color: '#f1f1f1',
    marginTop: 10,
  },
  signature: { height: 300, marginVertical: 15 ,borderColor:"#121212"},
  recordedText: { color: '#f1f1f1', marginTop: 10, fontStyle: 'italic' },
});

export default JournalNotes;
