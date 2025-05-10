import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const user = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button title="Click for AI Chat" onPress={() => navigation.navigate('Aichat')} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Click for Repairer Request" onPress={() => navigation.navigate('Repairers')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

export default user;
