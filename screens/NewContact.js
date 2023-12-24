import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, ToastAndroid, View, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { auth, database } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set } from 'firebase/database';

import { styles } from '../styles/styles_newcontact';
import { MaterialIcons } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const NewContact = ({ navigation, route }) => {
    const DOC_DIR = FileSystem.documentDirectory;
    const [uid, setUID] = useState(null);
    const id = new Date().getTime();
    const [image, setImage] = useState('');
    const [fName, setfName] = useState('');
    const [lName, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const imgPermaPath = `${DOC_DIR}${id}.jpeg`;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            setUID(user.uid);
        } else {
            // User is signed out
            setUID(null);
        }
    });

    const verifyPermissions = async () => {
        const cameraResult = await ImagePicker.getCameraPermissionsAsync();
        if (cameraResult.status !== 'granted') {
            return askForPermissions();
        }
        return true;
    };

    const askForPermissions = async () => {
        const result = await ImagePicker.requestCameraPermissionsAsync();
        if (result.status !== 'granted') {
            return false;
        }
        return true;
    };

    const showToast = (msg) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    };

    const fNameHandler = (value) => {
        setfName(value);
    };

    const lNameHandler = (value) => {
        setlName(value);
    };

    const emailHandler = (value) => {
        setEmail(value);
    };

    const phoneHandler = (value) => {
        setPhone(value);
    };

    const imageHandler = () => {
        Alert.alert('New Profile Picture', 'Take a new photo or use an existing photo from Gallery?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Take a new photo',
                onPress: takeImage,
            },
            {
                text: 'Choose a photo from Gallery',
                onPress: pickImage,
            }
        ]);
    };

    const addContactHandler = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (fName.length === 0) {
            Alert.alert('Invalid Input', 'Please provide at least the first name of the contact.');
        }
        else if (phone.length === 0 && email.length === 0) {
            Alert.alert('Invalid Input', 'Please provide at least one method of contact.');
        }
        else if (phone.length > 0 && phone.length !== 17) {
            Alert.alert('Invalid Phone', 'Please enter a 10-digit phone number with a country code.');
        }
        else if (email.length > 0 && reg.test(email) === false) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }
        else {
            route.params.onGoBack(id, image === '' ? image : imgPermaPath, fName, lName, phone, email);
            writeUserData();
            navigation.goBack();
        }
    };

    const writeUserData = () => {
        set(ref(database, 'users/' + uid + '/contacts/' + id), {
            first_name: fName,
            last_name: lName,
            phone: phone,
            email: email,
            profile_picture: image === '' ? image : imgPermaPath
        })
            .then(() => {
                showToast('Contact saved!');
            })
            .catch((error) => {
                showToast('Failed to save!');
                console.log(error);
            });
    };

    const onSave = async () => {
        if (image !== '')
            await moveImage();
        addContactHandler();
    };

    const onCancel = () => {
        navigation.goBack();
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
            else {
                showToast('Aborted!');
            }
        } catch (error) {
            console.log('An error occurred on opening image library:');
            console.log(error);
        }
    };

    const openSettings = async () => {
        try {
            if (Platform.OS === 'android') {
                const pkg = Constants.manifest.releaseChannel
                    ? Constants.manifest.android.package
                    : 'host.exp.exponent';

                await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
                    data: 'package:' + pkg,
                });
            }
            if (Platform.OS === 'ios') {
                Linking.openSettings();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const takeImage = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            Alert.alert('Insufficient Permissions!',
                'You need to grant camera permissions to use this app.',
                [
                    {
                        text: 'Go to Settings',
                        onPress: openSettings,
                    },
                    {
                        text: 'Ok',
                    }
                ]
            );
        }
        else {
            try {
                const img = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5
                });

                if (!img.canceled) {
                    setImage(img.assets[0].uri);
                    showToast('Success!');
                }
                else {
                    showToast('Aborted!');
                }
            } catch (error) {
                console.log('An error occurred on opening camera:');
                console.log(error);
            }
        }
    };

    const moveImage = async () => {
        try {
            if (image !== '') {
                await FileSystem.moveAsync({
                    from: image,
                    to: imgPermaPath,
                });
                setImage(imgPermaPath);
            }
        } catch (error) {
            console.log('An error occurred on moving image:');
            console.log(error);
        }
    };

    return (
        <KeyboardAwareScrollView style={styles.screen} resetScrollToCoords={{ x: 0, y: 0 }} enableOnAndroid={true}>
            <TouchableHighlight style={styles.picContainer} underlayColor='lightgrey' onPress={imageHandler}>
                <View>
                    {image === '' && <MaterialIcons style={[styles.icon, { backgroundColor: 'papayawhip' }]} name='add-a-photo' size={50} color='black' />}
                    {image !== '' && <Image style={styles.image} source={{ uri: image }} />}
                </View>
            </TouchableHighlight>
            <View style={styles.row}>
                <Text style={styles.sectionText}>Personal Information</Text>
            </View>
            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='First Name' value={fName} onChangeText={fNameHandler} />
            </View>
            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Last Name' value={lName} onChangeText={lNameHandler} />
            </View>
            <View style={styles.row}>
                <MaskInput style={styles.input} placeholder='Mobile Phone' value={phone} inputMode='tel' onChangeText={(masked) => {
                    phoneHandler(masked);
                }} mask={['+', /\d/, ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} />
            </View>
            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={emailHandler} inputMode='email' />
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default NewContact;