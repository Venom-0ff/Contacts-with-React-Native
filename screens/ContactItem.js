import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from '../styles/styles';

const ContactItem = (props) => {
    return (
        <TouchableOpacity style={styles.contact} activeOpacity={0.5} onPress={props.onPress.bind(this, props.id)}>
            <View style={styles.picContainer}>
                {props.image === '' && <MaterialCommunityIcons style={[styles.icon, { backgroundColor: `#${(props.id).toString(16).slice(-6)}` }]} name='account' size={40} color='black' />}
                {props.image !== '' && <Image style={styles.image} source={{ uri: props.image }} />}
            </View>
            <View style={{ flexShrink: 1 }}>
                <Text style={styles.contactName}>{props.firstName} {props.lastName}</Text>
                {props.phone !== '' && <Text style={styles.contactEmail}>{props.phone}</Text>}
                {props.email !== '' && <Text style={styles.contactEmail}>{props.email}</Text>}
            </View>
        </TouchableOpacity>
    );
}

export default ContactItem;