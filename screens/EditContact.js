import React, { useState, useEffect } from 'react';
import { Alert, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, ToastAndroid, View, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { auth, database } from '../FirebaseConfig';
import { ref, set, remove } from 'firebase/database';

import { styles } from '../styles/styles_newcontact';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const EditContact = ({ navigation, route }) => {
    const DOC_DIR = FileSystem.documentDirectory;
    const uid = auth.currentUser.uid;
    const id = route.params.id;
    const [image, setImage] = useState('');
    const [fName, setfName] = useState('');
    const [lName, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const imgPermaPath = `${DOC_DIR}${id}.jpeg`;

    useEffect(() => {
        onLoad();
    }, []);

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

    const updateContactHandler = () => {
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
                showToast('Contact updated!');
            })
            .catch((error) => {
                showToast('Failed to update!');
                console.log(error);
            });
    };

    const onCancel = () => {
        navigation.goBack();
    };

    const onUpdate = async () => {
        if (image !== '')
            await moveImage();
        updateContactHandler();
    };

    const deleteUserData = () => {
        remove(ref(database, 'users/' + uid + '/contacts/' + id))
            .then(() => showToast('Contact Deleted!'))
            .catch((error) => {
                showToast('Delete failed!');
                console.log(error);
            });
    };

    const onDelete = async () => {
        try {
            await FileSystem.deleteAsync(`${DOC_DIR}${id}.jpeg`, { idempotent: true });
            deleteUserData();
            route.params.onDelete(id);
            navigation.goBack();
        } catch (error) {
            console.log('An error occurred on deleting contact:');
            console.log(error);
        }
    };

    const confirmDelete = () => {
        Alert.alert('Delete Warning', 'Are you sure you want to delete this contact?', [
            {
                text: 'Delete',
                onPress: onDelete,
                style: 'destructive',
            },
            {
                text: 'Cancel',
                style: 'cancel',
            }
        ])
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
                await FileSystem.deleteAsync(imgPermaPath, { idempotent: true });
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

    const onLoad = async () => {
        setImage(route.params.image);
        setfName(route.params.first);
        setlName(route.params.last);
        setPhone(route.params.phone);
        setEmail(route.params.email);

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                    <MaterialCommunityIcons name='trash-can-outline' size={24} color='red' />
                </TouchableOpacity>
            ),
        });
    };

    return (
        <KeyboardAwareScrollView style={styles.screen} resetScrollToCoords={{ x: 0, y: 0 }} enableOnAndroid={true}>
            <TouchableHighlight style={styles.picContainer} underlayColor='lightgrey' onPress={imageHandler}>
                <View>
                    {image === '' && <MaterialIcons style={[styles.icon, { backgroundColor: `#${(route.params.id).toString(16).slice(-6)}` }]} name='add-a-photo' size={50} color='black' />}
                    {image !== '' && <Image style={styles.image} source={{ uri: image }} />}
                </View>
            </TouchableHighlight>
            <View style={styles.contactTextRow}>
                <Text style={styles.contactText}>{fName} {lName}</Text>
            </View>
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
                <TouchableOpacity style={styles.button} onPress={onUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default EditContact;