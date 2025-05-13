import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { config } from './config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Aichat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const uid = await AsyncStorage.getItem('uid');
      if (uid) setUserId(uid);
      else Alert.alert('Error', 'User ID not found. Please log in again.');
    };
    fetchUserId();

    (async () => {
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (mediaStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
        Alert.alert('Permission required', 'We need permissions to access your camera and gallery.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    const token = await AsyncStorage.getItem('token');
    if (!token || !userId) {
      Alert.alert('Error', 'Missing token or user ID');
      return;
    }

    const userMessage = { type: 'user', text: message || '[Image]' };
    setChatMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('uid', userId);

      if (selectedImage) {
        const uri = selectedImage.uri;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          name: filename,
          type,
        });
      }

      const response = await axios.post(`${config.BASE_URL}/api/assistant/chat`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const aiResponse = { type: 'assistant', text: response.data.response };
      setChatMessages((prev) => [...prev, aiResponse]);
      setSelectedImage(null);
    } catch (error) {
      console.error('Send Error:', error);
      Alert.alert('Error', 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.user : styles.assistant,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerText}>🧠 AI Assistant</Text>

          <FlatList
            data={chatMessages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.chatContainer}
          />

          {selectedImage && (
            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <Icon name="image" size={24} color="#007BFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
              <Icon name="photo-camera" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.sendContent}>
                <Icon name="send" size={18} color="#fff" style={{ marginRight: 5 }} />
                <Text style={styles.sendButtonText}>Send</Text>
              </View>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#F8F9FA' },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
    textAlign: 'center',
    color: '#343a40',
  },
  chatContainer: {
    paddingBottom: 100, // Ensure the bottom area has enough space for the input bar and button
  },
  messageContainer: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 15,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    color: '#212529',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1fcd3',
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#e4e6eb',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ced4da',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  sendContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 12,
  },
});

export default Aichat;
