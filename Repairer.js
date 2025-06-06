import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { config } from './config';

const Repairer = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hey, I'm a Repairer!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default Repairer;