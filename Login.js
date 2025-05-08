import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.14:3000/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { idToken, user } = response.data;
        await AsyncStorage.setItem('token', idToken);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('uid', user.uid); // Save uid here

        if (user.role === 'admin') {
          navigation.navigate('Admin');
        } else if (user.role === 'repairer') {
          navigation.navigate('Repairer');
        } else {
          navigation.navigate('User');
        }
      }
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Try again.');
      console.error('Login error:', error);
    }
  };

  const handleSignupRedirect = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={handleSignupRedirect} style={styles.signupButton}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  signupButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default Login;
