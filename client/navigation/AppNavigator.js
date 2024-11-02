import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen'; // Adjust the path as necessary
import OnBoarding from '../screens/OnBoarding'; // Adjust the path as necessary
import LoginScreen from '../screens/LoginScreen'; // Adjust the path as necessary
import SignupScreen from '../screens/SignupScreen'; // Adjust the path as necessary
import DailyQuestionnaire from '../screens/DailyQuestionnaire'; // Adjust the path as necessary
import HomePage from '../screens/HomePage'; 
import PlaylistScreen from '../screens/PlaylistScreen';
import Chat from '../screens/Chat';
import JournalScreen from '../screens/JournalScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnBoarding} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="DailyQuestionnaire" component={DailyQuestionnaire} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="JournalScreen" component={JournalScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
