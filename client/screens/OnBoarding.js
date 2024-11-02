import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

const OnBoarding = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo1.png')} style={styles.logo} />
            <Text style={styles.title}>Tune Your Health with EEG Beats</Text>

            <Pressable 
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')} // Navigate to LoginScreen
            >
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable 
                style={styles.signupButton}
                onPress={() => navigation.navigate('Signup')} // Navigate to SignupScreen
            >
                <Text style={styles.buttonText}>Sign up free</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    logo: {
        width: 300,
        height: 350,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    loginButton: {
        width: 300,
        height: 50,
        backgroundColor: '#167CAB',
        borderRadius: 20,
        marginBottom: 20,
        borderColor: '#fff',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupButton: {
        width: 300,
        height: 50,
        backgroundColor: '#000',
        borderRadius: 20,
        borderColor: '#fff',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default OnBoarding;
