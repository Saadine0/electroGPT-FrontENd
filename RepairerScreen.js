import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { config } from './config';

export default function RepairersScreen({ navigation }) {
  const [repairers, setRepairers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairers = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/api/auth/repairers`); // use local IP, not localhost
        if (!response.ok) {
          throw new Error('Failed to fetch repairers');
        }
        const data = await response.json();
        setRepairers(data);
      } catch (error) {
        Alert.alert('Error', error.message || 'Something went wrong');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairers();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (repairers.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No repairers found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Repairers</Text>
      <FlatList
        data={repairers}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.role}>Role: {item.role}</Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('Upload',{ repairId: item.uid })}
            >
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
  },
  role: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
