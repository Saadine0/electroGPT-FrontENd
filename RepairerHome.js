import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RepairerHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Optional illustration placeholder */}
      <View style={styles.illustrationContainer}>
        <Ionicons name="hammer-outline" size={100} color="#6C63FF" />
      </View>

      <Text style={styles.greeting}>Welcome back, Repairer!</Text>
      <Text style={styles.subtitle}>Check new job offers and manage your tasks</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RepairerOffersScreen')}
      >
        <Text style={styles.buttonText}>View Offers</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  illustrationContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#667085',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RepairerHome;
