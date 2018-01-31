import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headerIcon: {
        color: 'white'
    },
    headerText: {
        fontSize: 18
    },
    headerLeftWithoutRight: {
        flex: 0,
        paddingRight: 30
    }
});

export default styles;
