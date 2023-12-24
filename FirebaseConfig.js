// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBjkFdt9W1TbqF973PPnajzabYTtYLqUtU',
    authDomain: 'contacts-601f5.firebaseapp.com',
    projectId: 'contacts-601f5',
    storageBucket: 'contacts-601f5.appspot.com',
    messagingSenderId: '276038168959',
    appId: '1:276038168959:web:33b9681439e13377ce6a4a',
    databaseURL: 'https://contacts-601f5-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);