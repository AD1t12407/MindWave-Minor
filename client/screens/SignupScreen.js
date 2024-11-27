import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        // Handle signup logic here
        navigation.navigate('FirstQuestionnaire'); // Navigate to FirstQuestionnaire
    };

    return (
        <LinearGradient
            colors={['#3B1E58', '#000','#000']}
            style={styles.container}
        >
            <Text style={styles.title}>Create Account</Text>

            <CustomInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
            />
            <CustomInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
            />
            <CustomInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
            />

            <Pressable style={styles.signupButton} onPress={handleSignup}>
                <LinearGradient
                    colors={['#9B7EBD', '#3B1E54']}
                    style={styles.buttonBackground}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
            </Pressable>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 40,
        textAlign: 'center',
        letterSpacing: 1,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: 14,
        backgroundColor: '#1C1C1C',
        color: '#FFF',
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    signupButton: {
        width: '100%',
        height: 55,
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 10,
    },
    buttonBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default SignupScreen;
