import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Install Expo Linear Gradient

const OnBoarding = ({ navigation }) => {
    return (
        <LinearGradient 
            colors={['#3B1E54', '#000', '#000']} // Smoother, darker gradient
            style={styles.container}
        >
            <View style={styles.overlay}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
                <Text style={styles.title}>MINDWAVE</Text>
                <Text style={styles.subtitle}>Tune Your Health with EEG Beats</Text>

                {/* Login Button */}
                <Pressable 
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <LinearGradient
                        colors={['#9B7EBD', '#3B1E54']} // Brighter gradient for better contrast
                        style={styles.buttonBackground}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </LinearGradient>
                </Pressable>

                {/* Sign-Up Button */}
                <Pressable 
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={[styles.buttonText, styles.signupText]}>Sign Up Free</Text>
                </Pressable>
            </View>
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
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Subtle background overlay
        padding: 30,
        borderRadius: 20,
        width: '100%',
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
        resizeMode: 'contain',
        marginBottom:-80,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    subtitle: {
        color: '#A0C4FF',
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: 0.8,
        lineHeight: 24,
    },
    loginButton: {
        width: '100%',
        height: 55,
        marginBottom: 20,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8, // For Android shadow
    },
    signupButton: {
        width: '100%',
        height: 55,
        borderRadius: 30,
        borderColor: '#3B1E54',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    signupText: {
        color: '#9B7EBD',
    },
});

export default OnBoarding;
