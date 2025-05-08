import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Repairer = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      alert('Token missing. Please log in again.');
      return;
    }

    const userMessage = { type: 'user', text: message };
    setChatMessages((prev) => [...prev, userMessage]);
    const uid = await AsyncStorage.getItem('uid');
    console.log('User UID:', uid);

    setMessage('');

    try {
      const response = await axios.post(
        'http://192.168.1.14:3000/api/assistant/chat',
        { message, uid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiResponse = { type: 'assistant', text: response.data.response };
      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('Chat error:', err);
      alert('Failed to send message.');
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.chatContainer}>
          <FlatList
            data={chatMessages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
            inverted // To make new messages appear at the bottom
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    padding: 20, // Some padding to avoid touching the edges
  },
  chatContainer: {
    flex: 1,
    width: '100%', // Make the chat container take the full width
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    height: 40,
  },
});

export default Repairer;
