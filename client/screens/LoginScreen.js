import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Handle login logic here
        navigation.navigate('DailyQuestionnaire'); // Navigate to DailyQuestionnaire
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="grey"
                value={username}
                onChangeText={setUsername}
            />

            <Text style={styles.label}>Enter Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="grey"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    label: {
        color: 'white',
        marginBottom: 10,
        fontSize: 16,
    },
    input: {
        width: '80%',
        padding: 10,
        backgroundColor: '#1C1C1C',
        color: 'white',
        borderRadius: 5,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 80,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default LoginScreen;
