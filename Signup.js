import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://192.168.1.14:3000/api/auth/signup', {
        email,
        password,
        role,
        name: firstName,     // Here we send firstName as name
        lastname: lastName,  // Here we send lastName as lastname
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
      <TextInput
        style={styles.input}
        placeholder="Role (admin or vendeur)"
        value={role}
        onChangeText={setRole}
      />
      <Text>City:</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
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
});

export default Signup;
