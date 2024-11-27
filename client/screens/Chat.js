import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Groq from 'groq-sdk';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize the Groq client (replace API key with a secure method in production)
  const groq = new Groq({
    apiKey: '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'
  });

  // Effect to send a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(), // Use dynamic ID to prevent conflicts
      text: "How are you feeling today? I'm here to help.",
      sender: 'bot',
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = {
        id: Date.now(), // Use dynamic ID to prevent conflicts
        text: inputText,
        sender: 'user'
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputText('');
      setLoading(true);

      try {
        // Send the user's message to the Groq model
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are a compassionate mental health counselor named Theary, engaging empathetically with the user. Respond with empathy, support, and understanding:

              1. Show empathy for the user’s feelings.
              2. Offer encouragement and reassurance.
              3. Suggest mindfulness or relaxation techniques.
              4. Ask open-ended questions to encourage sharing.
              5. Avoid giving medical advice; suggest they seek professional help if needed.`
            },
            { role: "user", content: inputText },
          ],
          model: "llama3-8b-8192",
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null,
        });

        // Collect the response content
        const responseContent = chatCompletion.choices[0].message.content;

        // Create the bot message
        const botMessage = {
          id: Date.now(), // Use dynamic ID to prevent conflicts
          text: responseContent,
          sender: 'bot'
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = {
          id: Date.now(),
          text: "I'm here to support you, even if there was a technical issue. Please share if you're comfortable.",
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#ccc" // Light gray for dark mode
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <Text style={styles.sendButtonText}>{loading ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 36 }, // Black background
  messageList: { padding: 20 },
  welcomeMessage: {
    alignSelf: 'flex-start', 
    padding: 15, 
    backgroundColor: '#333', 
    borderRadius: 10, 
    marginVertical: 5
  },
  userMessage: {
    alignSelf: 'flex-end', 
    padding: 10, 
    backgroundColor: '#9B7EBD', 
    borderRadius: 10, 
    marginVertical: 5 
  }, // Blue user message
  botMessage: {
    alignSelf: 'flex-start', 
    padding: 15, 
    backgroundColor: '#333', 
    borderRadius: 10, 
    marginVertical: 5 
  }, // Dark gray bot message
  messageText: { fontSize: 16, color: '#fff' }, // White text for messages
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#444' }, // Dark gray border
  input: { 
    flex: 1, 
    backgroundColor: '#222', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    color: '#fff' 
  }, // Dark input field with white text
  sendButton: { 
    marginLeft: 10, 
    backgroundColor: '#9B7EBD', 
    borderRadius: 20, 
    padding: 10 
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }, // White text for send button
});

export default Chat;
