import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { config } from './config';
import { Ionicons } from '@expo/vector-icons';

export default function RepairerOffersScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repairId, setRepairId] = useState(null);

  useEffect(() => {
    const fetchRepairerId = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (uid) {
          setRepairId(uid);
          fetchOffers(uid);
        } else {
          Alert.alert('Error', 'Repairer not logged in!');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Failed to load repairer ID:', error);
      }
    };

    fetchRepairerId();
  }, []);

  const fetchOffers = async (repairId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/api/content/offers/${repairId}`);
      if (response.status === 200) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      Alert.alert('Error', 'Could not fetch offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOfferResponse = async (offerId, response) => {
    try {
      const result = await axios.post(`${config.BASE_URL}/api/offers/respond`, {
        offerId,
        repairId,
        response,
      });

      if (result.status === 200) {
        Alert.alert('Success', `Offer ${response}ed successfully!`);
        fetchOffers(repairId);
      }
    } catch (error) {
      console.error('Error responding to offer:', error);
      Alert.alert('Error', 'Could not respond to the offer. Please try again.');
    }
  };

  const renderOffer = ({ item }) => (
    <View style={styles.offerCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="construct-outline" size={24} color="#3A5A40" />
        <Text style={styles.offerTitle}>{item.description}</Text>
      </View>

      <Text style={styles.offerDetails}>Client ID: {item.userId}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleOfferResponse(item.offerId, 'accept')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleOfferResponse(item.offerId, 'reject')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Offers</Text>
      {offers.length === 0 ? (
        <Text style={styles.emptyText}>No offers available at the moment.</Text>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOffer}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F9',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    flex: 1,
  },
  offerDetails: {
    fontSize: 14,
    color: '#667085',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
