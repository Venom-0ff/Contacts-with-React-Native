import React, { useState, } from 'react';
import { Alert, Text, TextInput, ToastAndroid, TouchableOpacity, View, } from 'react-native';
import { auth } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from '../styles/styles';

const LoginScreen = ({ navigation }) => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const showToast = (msg) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    };

    const loginWithFirebase = () => {
        if (loginEmail.length === 0) {
            Alert.alert('Invalid email', 'Please enter an email address.');
            return;
        }

        if (loginPassword.length === 0) {
            Alert.alert('Invalid password', 'Please enter a password.');
            return;
        }

        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then(() => showToast('Logged in successfully!'))
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/user-not-found') {
                    Alert.alert('Log in failed', 'User with the entered email doesn\'t exist.');
                }
                else if (errorCode === 'auth/wrong-password') {
                    Alert.alert('Log in failed', 'Password is incorrect.');
                }
                else {
                    Alert.alert(errorMessage);
                }
            });
    };

    return (
        <View style={[styles.screen, { paddingTop: '60%' }]}>
            <Text style={styles.header}>Sign In to Contacts</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setLoginEmail(value)}
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='email'
                keyboardType='email-address'
                placeholder='Email'
            />
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    onChangeText={(value) => setLoginPassword(value)}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={!showPass}
                    autoCompleteType='password'
                    placeholder='Password'
                />
                <MaterialCommunityIcons
                    name={!showPass ? 'eye' : 'eye-off'}
                    size={27} color='gray'
                    onPress={() => setShowPass(!showPass)} />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={loginWithFirebase}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <Text style={styles.text}>OR</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.buttonText}>Register Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;