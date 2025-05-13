import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { config } from './config';

export default function RepairersScreen({ navigation }) {
  const [repairers, setRepairers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairers = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/api/auth/repairers`);
        if (!response.ok) {
          throw new Error('Failed to fetch repairers');
        }
        const data = await response.json();
        setRepairers(data);
      } catch (error) {
        Alert.alert('Error', error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRepairers();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (repairers.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No repairers available right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Repairers Near You</Text>

      <FlatList
        data={repairers}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=&background=E5E7EB&color=9CA3AF&rounded=true&size=64`,
              }}
              style={styles.avatar}
            />
            <View style={styles.cardContent}>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>Role: {item.role}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('Upload', { repairId: item.uid })}
              activeOpacity={0.85}
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#e5e7eb',
  },
  cardContent: {
    flex: 1,
  },
  email: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#9ca3af',
  },
  chatButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
