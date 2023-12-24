import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        padding: '5%',
        paddingTop: 5,
        height: '100%',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '40%',
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    addButton: {
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        elevation: 2,
        borderRadius: 100,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'papayawhip',
    },
    logOutButton: {
        paddingRight: '5%',
    },
    logOutText: {
        color: 'red',
        fontSize: 17,
        fontWeight: 'bold',
    },
    button: {
        elevation: 10,
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.25,
    },
    contact: {
        padding: 10,
        width: '98%',
        elevation: 5,
        borderRadius: 15,
        marginVertical: 8,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: '#eee',
    },
    contactName: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    contactEmail: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    input: {
        padding: 9,
        fontSize: 18,
        elevation: 5,
        width: '90%',
        borderRadius: 15,
        marginVertical: 12,
        alignSelf: 'center',
        backgroundColor: '#eee',
    },
    passwordInput: {
        width: '90%',
        fontSize: 18,
    },
    passwordInputContainer: {
        padding: 9,
        fontSize: 18,
        elevation: 5,
        width: '90%',
        borderRadius: 15,
        marginVertical: 12,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: '#eee',
        alignContent: 'space-between'
    },
    picContainer: {
        marginRight: 30,
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 100,
    },
    icon: {
        width: 80,
        height: 80,
        padding: 20,
        borderRadius: 100,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
});