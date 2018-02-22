import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    },

    inactiveText: {
        fontSize: 12,
        color: 'grey'
    },

    searchHint: {
        height: 40,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F2A4'
    },

    tabBar: {
        backgroundColor: '#3F51B5'
    }
});

export default styles;
