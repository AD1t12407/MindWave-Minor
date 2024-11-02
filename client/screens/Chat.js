import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Groq from 'groq-sdk';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize the Groq client with the API key
  const groq = new Groq({
    apiKey: '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'
  });

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { id: messages.length + 1, text: inputText, sender: 'user' };
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
        const botMessage = { id: messages.length + 2, text: responseContent, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = {
          id: messages.length + 2,
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
          placeholderTextColor="#aaa"
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
  container: { flex: 1, backgroundColor: '#fff' },
  messageList: { padding: 16 },
  userMessage: { alignSelf: 'flex-end', padding: 10, backgroundColor: '#d1e7ff', borderRadius: 10, marginVertical: 5 },
  botMessage: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#ececec', borderRadius: 10, marginVertical: 5 },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { marginLeft: 10, backgroundColor: '#1e90ff', borderRadius: 20, padding: 10 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default Chat;
