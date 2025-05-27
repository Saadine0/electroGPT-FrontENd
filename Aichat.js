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

    // Create user message with both text and image
    const userMessage = { 
      type: 'user', 
      text: message || '', 
      image: selectedImage ? selectedImage.uri : null 
    };
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
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.messageImage} 
          resizeMode="cover"
        />
      )}
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeArea}>
        <Text style={styles.headerText}>🧠 AI Assistant</Text>
        
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            data={chatMessages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.chatContainer}
            style={styles.chatList}
            showsVerticalScrollIndicator={false}
          />

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
            </View>
          )}

          <View style={styles.inputSection}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your message..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={1000}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                  <Icon name="image" size={22} color="#007BFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
                  <Icon name="photo-camera" size={22} color="#007BFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.sendButton, 
                  (!message.trim() && !selectedImage) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={loading || (!message.trim() && !selectedImage)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Icon name="send" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
    textAlign: 'center',
    color: '#343a40',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  chatList: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: '37%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  inputSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    marginBottom: 65, // Account for tab bar height
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ced4da',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 80,
    paddingVertical: 6,
    color: '#212529',
    textAlignVertical: 'center',
  },
  iconButton: {
    marginLeft: 6,
    padding: 6,
  },
  sendButton: {
    backgroundColor: '#28a745',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  messageContainer: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    color: '#212529',
    lineHeight: 20,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1fcd3',
    borderBottomRightRadius: 4,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#e4e6eb',
    borderBottomLeftRadius: 4,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
});

export default Aichat;