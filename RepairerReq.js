import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const repairers = [
    { id: '1', name: 'Repairer 1' },
    { id: '2', name: 'Repairer 2' },
    { id: '3', name: 'Repairer 3' },
];

const RepairerReq = () => {
    const handleSelectRepairer = (repairer) => {
        console.log(`Selected: ${repairer.name}`);
        // Add your logic here for selecting a repairer
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hey! Choose one of the repairers:</Text>
            <FlatList
                data={repairers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.repairerButton}
                        onPress={() => handleSelectRepairer(item)}
                    >
                        <Text style={styles.repairerText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    repairerButton: {
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginBottom: 10,
    },
    repairerText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default RepairerReq;