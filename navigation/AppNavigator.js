import React, { useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';

import { styles } from '../styles/styles';
import MainScreen from '../screens/MainScreen';
import NewContact from '../screens/NewContact';
import EditContact from '../screens/EditContact';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            setIsSignedIn(true);
        } else {
            // User is signed out
            setIsSignedIn(false);
        }
    });

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='LoginScreen'>
                {isSignedIn ? (
                    <>
                        <Stack.Screen
                            name='MainScreen'
                            component={MainScreen}
                            options={{
                                headerTitle: () => <Text style={styles.header}>Contacts</Text>,
                                headerStyle: { backgroundColor: '#eee' },
                            }}
                        />
                        <Stack.Screen
                            name='NewContact'
                            component={NewContact}
                            options={{
                                headerTitle: () => <Text style={styles.header}>New Contact</Text>,
                                headerStyle: { backgroundColor: '#eee' },
                            }}
                        />
                        <Stack.Screen
                            name='EditContact'
                            component={EditContact}
                            options={{
                                headerTitle: () => <Text style={styles.header}>Edit Contact</Text>,
                                headerStyle: { backgroundColor: '#eee' },
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name='RegisterScreen'
                            component={RegisterScreen}
                            options={{
                                headerShown: false,
                                animationTypeForReplace: isSignedIn ? 'push' : 'pop',
                            }}
                        />
                        <Stack.Screen
                            name='LoginScreen'
                            component={LoginScreen}
                            options={{
                                headerShown: false,
                                animationTypeForReplace: isSignedIn ? 'push' : 'pop',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;