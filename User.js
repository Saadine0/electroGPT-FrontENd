import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const UserScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hey there 👋</Text>
      <Text style={styles.subtext}>How can we help you today?</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Aichat')}
        activeOpacity={0.85}
      >
        <Text style={styles.cardTitle}>💬 AI Chat Assistant</Text>
        <Text style={styles.cardSubtitle}>Get instant help from our smart assistant.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Repairers')}
        activeOpacity={0.85}
      >
        <Text style={styles.cardTitle}>🛠 Request a Repairer</Text>
        <Text style={styles.cardSubtitle}>Find trusted professionals near you.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtext: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default UserScreen;
