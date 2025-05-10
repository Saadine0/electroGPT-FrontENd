import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { config } from './config';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      alert('Token missing. Please log in again.');
      return;
    }

    try {
      const response = await axios.get(`${config.BASE_URL}/api/profile/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Profile data:', response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Could not load profile.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile data available.</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  const userImage = 'https://media-hosting.imagekit.io/737418b78bdc4250/client-icon-in-logotype-vector.jpg?Expires=1841484855&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=IaVx2sNevjTUorCBDeXtmD1dTwhq9IejBYo16qvXbsOUm9kiWRc5I58bhObF8aBwjuUBpWJOoaP-XmmT8NSY~pFNo5-Ff8Iyocph7xkKom7mB9S0pKJcK0ARt57xv8GfUzGZeX~TaG79zCQndUeetigzKByOSFNo2U1KF42hDDycxZ98g~Qw6UfbQ1YS4~hgVCNlU~1Z~w7vQ0WQwz0VSbsbjKq8zMV5KtrdvUyjb45MkA8FxpmPySpHSq0ccaUnUdZhE-lSYuhsRJzqBy98zOzbSfwKYlEnz~Gr5XnvJWVZk-mTj48QYjbpcVMwNCddRjYpgAzigDTaxG14VhqFHA__'; // Replace with your actual image paths
  const repairerImage = 'https://media-hosting.imagekit.io/d7205cbada854194/software-repair-icon-vector-44887355.jpg?Expires=1841484847&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kTefUefRFY~avb7shGT-90oZiY9VhrMMeHi1dz0vZ6fUp~IYUdb5RVhQlaXDUUpcF4GCTzC3qn8OzHx07AbJrngnkt8qZhX1m~UK8mqcnjGgzU584MSX39~uRmQKWRbRc1cyk9N6gfeXwuV8o7J4FnQCn10t~axh2km8mtL1mAfjRROMoixG95KMr0rxNnAqo6j0XbwwlaiLTGWGWkQH5gRzzjAdQrK1eJb-3nucPk8YhTTzjO~aP8yMrwJQlQBjk4FjSbvhoL0LQleyvXlzmMlVALZAMp8Oax6j-Nx~SNrhYYiVgELo-1eOEdKex68sytO9gGgnBMxVX0f540AqyA__'; // Replace with your actual image paths

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Image
        source={{ uri: profile.role === 'repairer' ? repairerImage : userImage }}
        style={styles.roleImage}
      />

      <Text style={styles.label}>First Name:</Text>
      <Text style={styles.value}>{profile.firstName}</Text>

      <Text style={styles.label}>Last Name:</Text>
      <Text style={styles.value}>{profile.lastName}</Text>

      <Text style={styles.label}>City:</Text>
      <Text style={styles.value}>{profile.city}</Text>

      <Text style={styles.label}>Role:</Text>
      <Text style={styles.value}>{profile.role}</Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#000',
  },
  roleImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});

export default ProfileScreen;
