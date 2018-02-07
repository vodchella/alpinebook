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
    },
    headerLeftWithSearchBar: {
        flex: 0,
        paddingRight: 5
    },

    searchBarText: {
        fontSize: 14
    },

    hintText: {
        fontSize: 10,
        color: 'grey'
    }
});

export default styles;
