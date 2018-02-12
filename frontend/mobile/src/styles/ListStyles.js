import { StyleSheet } from 'react-native';

const listStyles = StyleSheet.create({
    list: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: 20
    },
    listTitleItem: {
        color: 'grey',
        alignSelf: 'flex-start',
        paddingTop: 10
    },
    listSubTitleItem: {
        color: 'grey',
        alignSelf: 'flex-start',
        fontSize: 12,
        paddingLeft: 10,
        paddingBottom: 15
    },
    listItem: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'flex-start',
        paddingLeft: 10,
        paddingRight: 15,
        paddingBottom: 15,
        width: '100%'
    },
    listItemTouchableOpacity: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    listItemRightIcon: {
        color: 'lightgrey',
        fontSize: 20
    }
});

export default listStyles;
