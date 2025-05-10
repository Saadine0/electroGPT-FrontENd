import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import { config } from './config';

export default function RepairerOffersScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repairId, setRepairId] = useState(null);

  // Get the logged-in repairer's UID
  useEffect(() => {
    const fetchRepairerId = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (uid) {
          setRepairId(uid);
          fetchOffers(uid); // Fetch offers when repairer UID is retrieved
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

  // Fetch the offers from the backend filtered by repairId
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
    // Accept or Reject an offer based on the response
    try {
      const result = await axios.post(`${config.BASE_URL}/api/offers/respond`, {
        offerId,
        repairId,
        response, // 'accept' or 'reject'
      });

      if (result.status === 200) {
        Alert.alert('Success', `Offer ${response}ed successfully!`);
        fetchOffers(repairId); // Refresh the list of offers after responding
      }
    } catch (error) {
      console.error('Error responding to offer:', error);
      Alert.alert('Error', 'Could not respond to the offer. Please try again.');
    }
  };

  const renderOffer = ({ item }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>Description: {item.description}</Text>
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repairer Offers</Text>
      {offers.length === 0 ? (
        <Text>No offers available at the moment.</Text>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOffer}
        />
      )}
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
  offerCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  offerDetails: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
