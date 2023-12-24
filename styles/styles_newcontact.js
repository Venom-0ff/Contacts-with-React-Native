import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        padding: 25,
        height: '100%',
        backgroundColor: '#fff'
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 20,
        textAlign: 'center',
    },
    deleteButton: {
        width: 40,
        height: 40,
        marginRight: '5%',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 10,
        width: '35%',
        elevation: 5,
        borderRadius: 25,
        marginVertical: 20,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    row: {
        width: '90%',
        marginTop: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    sectionText: {
        fontSize: 18,
    },
    contactText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contactTextRow: {
        marginTop: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        padding: 9,
        fontSize: 18,
        elevation: 5,
        width: '100%',
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#eee',
    },
    picContainer: {
        elevation: 5,
        borderWidth: 1.5,
        borderRadius: 100,
        alignSelf: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 120,
        height: 120,
        padding: 33,
        borderRadius: 100,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 100,
    },
});