import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { config } from './config';
import { Picker } from '@react-native-picker/picker';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${config.BASE_URL}/api/auth/signup`, {
        email,
        password,
        role,
        name: firstName,
        lastname: lastName,
        city,
      });

      if (response.status === 201) {
        Alert.alert('Signup Successful', 'You can now log in.');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Signup Failed', error.response?.data?.error || 'Try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>First Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text>Last Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

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

      <Text>Role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select role..." value="" />
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Repairer" value="repairer" />
      </Picker>

      <Text>City:</Text>
      <Picker
        selectedValue={city}
        onValueChange={(itemValue) => setCity(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select city..." value="" />
        <Picker.Item label="Casablanca" value="Casablanca" />
        <Picker.Item label="Fes" value="Fes" />
        <Picker.Item label="Rabat" value="Rabat" />
        <Picker.Item label="Tanger" value="Tanger" />
      </Picker>

      <Button title="Sign Up" onPress={handleSignup} />
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
  picker: {
    height: 50,
    marginBottom: 15,
  },
});

export default Signup;
