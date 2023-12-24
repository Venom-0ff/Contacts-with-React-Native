import React, { useState, useEffect } from 'react';
import { FlatList, LogBox, ToastAndroid, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { child, get, ref } from 'firebase/database';

import ContactItem from './ContactItem';
import { styles } from '../styles/styles';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);


const MainScreen = ({ navigation }) => {
    const [contactsList, setContactsList] = useState([]);

    const showToast = (msg) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    };

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = () => {
        get(child(ref(database), `users/${auth.currentUser.uid}/contacts`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let data = [];
                    snapshot.forEach((contact) => {
                        data.push({
                            key: parseInt(contact.key),
                            image: contact.val().profile_picture === undefined ? '' : contact.val().profile_picture,
                            firstName: contact.val().first_name,
                            lastName: contact.val().last_name === undefined ? '' : contact.val().last_name,
                            phone: contact.val().phone === undefined ? '' : contact.val().phone,
                            email: contact.val().email === undefined ? '' : contact.val().email
                        });
                    });
                    setContactsList(data);
                    console.log('Data fetched successfully');
                } else {
                    console.log('No data available');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const addContactHandler = (contactId, contactImage, contactFirstName, contactLastName, contactPhone, contactEmail) => {
        setContactsList((contactsList) =>
            [
                ...contactsList,
                {
                    key: contactId,
                    image: contactImage,
                    firstName: contactFirstName,
                    lastName: contactLastName,
                    phone: contactPhone,
                    email: contactEmail
                }
            ]
        );
    };

    const updateContactHandler = (contactId, contactImage, contactFirstName, contactLastName, contactPhone, contactEmail) => {
        const arr = [...contactsList];
        const index = arr.findIndex((contact) => contact.key === contactId);
        arr[index] = {
            key: contactId,
            image: contactImage,
            firstName: contactFirstName,
            lastName: contactLastName,
            phone: contactPhone,
            email: contactEmail
        };
        setContactsList(arr);
    };

    const deleteContactHandler = (contactId) => {
        setContactsList(contactsList.filter((contact) => contact.key !== contactId));
    };

    const editContact = async (contactId) => {
        const c = contactsList.filter((contact) => contact.key === contactId);
        navigation.navigate('EditContact', {
            id: c[0].key,
            image: c[0].image,
            first: c[0].firstName,
            last: c[0].lastName,
            phone: c[0].phone,
            email: c[0].email,
            onGoBack: updateContactHandler,
            onDelete: deleteContactHandler
        });
    };

    const onSignOut = () => {
        signOut(auth)
            .then(() => {
                showToast('Logged out successfully!');
            })
            .catch((error) => {
                showToast('Log out failed!');
                console.log(error.message);
            });
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.logOutButton} onPress={onSignOut}>
                    <Text style={styles.logOutText}>Log Out</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.screen}>
            <FlatList
                data={contactsList}
                renderItem={
                    contactData => (
                        <ContactItem
                            id={contactData.item.key}
                            onPress={editContact}
                            image={contactData.item.image}
                            firstName={contactData.item.firstName}
                            lastName={contactData.item.lastName}
                            phone={contactData.item.phone}
                            email={contactData.item.email}
                        />
                    )
                }
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('NewContact', { onGoBack: addContactHandler })}>
                <MaterialIcons name='add' size={40} color='black' />
            </TouchableOpacity>
        </View>
    );
}

export default MainScreen;