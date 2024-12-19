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
import Meditation from '../screens/Meditation';
import AffirmationsScreen from '../screens/AffirmationsScreen';
import JournalScreen from '../screens/JournalScreen';
import FirstQuestionnaire from '../screens/FirstQuestionnaire';
import MeditationTimer from '../screens/MeditationTimer';
import MoodTracker from '../screens/MoodTracker'; // New MoodTracker screen
import JournalNotes from '../screens/JournalNotes'; // New JournalNotes screen
import JournalReflections from '../screens/JournalReflections'; // New JournalReflection screen
import UserSettingsPage from '../screens/UserSettingsPage';
import RunThrough from '../screens/RunThrough';
import { MoodProvider } from "../constants/MoodContext";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <MoodProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="RunThrough" component={RunThrough} />
                <Stack.Screen name="Onboarding" component={OnBoarding} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="FirstQuestionnaire" component={FirstQuestionnaire} />
                <Stack.Screen name="DailyQuestionnaire" component={DailyQuestionnaire} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="UserSettingsPage" component={UserSettingsPage} />
                <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="Meditation" component={Meditation} />
                <Stack.Screen name="MeditationTimer" component={MeditationTimer} />
                <Stack.Screen name="Affirmations" component={AffirmationsScreen} />
                <Stack.Screen name="JournalScreen" component={JournalScreen} />
                
                
                <Stack.Screen name="MoodTracker" component={MoodTracker} /> 
                <Stack.Screen name="JournalNotes" component={JournalNotes} /> 
                <Stack.Screen name="JournalReflections" component={JournalReflections} /> 
            </Stack.Navigator>
        </NavigationContainer>
        </MoodProvider>
    );
};

export default AppNavigator;
