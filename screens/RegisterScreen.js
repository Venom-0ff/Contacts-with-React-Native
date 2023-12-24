import React, { useState, } from 'react';
import { Alert, Text, TextInput, ToastAndroid, TouchableOpacity, View, } from 'react-native';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from '../styles/styles';

const RegisterScreen = ({ navigation }) => {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const showToast = (msg) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    };

    const registerWithFirebase = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(registerEmail) === false || registerEmail.length < 4) {
            Alert.alert('Invalid email', 'Please enter an email address.');
            return;
        }

        createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            .then(() => showToast('Registred successfully!'))
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode == 'auth/weak-password') {
                    Alert.alert('Registration failed', 'The password is too weak.');
                }
                else if (errorCode == 'auth/email-already-in-use') {
                    Alert.alert('Registration failed', 'The entered email is already in use.');
                }
                else {
                    Alert.alert(errorMessage);
                }
                console.log(error);
            });
    };

    return (
        <View style={[styles.screen, { paddingTop: '60%' }]}>
            <Text style={styles.header}>Sign Up to Contacts</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setRegisterEmail(value)}
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='email'
                keyboardType='email-address'
                placeholder='Email'
            />
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    onChangeText={(value) => setRegisterPassword(value)}
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
                <TouchableOpacity style={styles.button} onPress={registerWithFirebase}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.text}>OR</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.buttonText}>Sign In Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterScreen;