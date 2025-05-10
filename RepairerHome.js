import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RepairerHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hey, I'm a Repairer!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RepairerOffersScreen')}
      >
        <Text style={styles.buttonText}>Request Offer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RepairerHome;
