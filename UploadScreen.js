import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './config';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function UploadScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const { repairId } = route.params;
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (uid) {
          setUserId(uid);
        } else {
          Alert.alert('Session Error', 'User ID not found. Please log in again.');
        }
      } catch (e) {
        console.error('Failed to load user ID:', e);
      }
    };

    fetchUserId();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to upload images.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'We need camera access to take photos.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitForm = async () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please select or take a photo first');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description for this image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const imageUri = image;
      const filename = imageUri.split('/').pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      });

      formData.append('description', description);
      formData.append('userId', userId);
      formData.append('repairId', repairId); 

      const response = await fetch(`${config.BASE_URL}/api/content/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setLoading(false);
        navigation.navigate('SuccessScreen');
      } else {
        throw new Error(result.message || 'Failed to upload');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Upload Failed', 
        'Could not upload your image. Please try again later.',
        [{ text: 'OK', style: 'default' }]
      );
      console.error('Error:', error);
    }
  };

  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Share Photo</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.imageContainer}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={48} color="#A0A0A0" />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </View>

          {!image && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="images-outline" size={22} color="#fff" />
                <Text style={styles.buttonText}>Select Image</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
                <Ionicons name="camera-outline" size={22} color="#fff" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What's in this image?"
              multiline
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!image || !description.trim() || loading) && styles.disabledButton
            ]}
            onPress={submitForm}
            disabled={!image || !description.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.submitIcon} />
                <Text style={styles.submitButtonText}>Upload Image</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingVertical: 5,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: width * 0.85,
    height: width * 0.65,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: width * 0.85,
    height: width * 0.65,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    color: '#A0A0A0',
    fontSize: 15,
  },
  changeImageButton: {
    marginTop: 12,
    padding: 10,
  },
  changeImageText: {
    color: '#6C63FF',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  imageButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 16,
    minHeight: 100,
    backgroundColor: '#F9F9F9',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  submitIcon: {
    marginRight: 8,
  },
});