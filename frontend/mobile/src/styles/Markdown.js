import { Platform, StyleSheet } from 'react-native';
import PlatformEnum from '../enums/PlatformEnum';

export default StyleSheet.create({
    listUnorderedItemIcon: {
        marginLeft: 10,
        marginRight: 10,
        ...Platform.select({
            [PlatformEnum.ANDROID]: {
                marginTop: 5
            }
        }),
        ...Platform.select({
            [PlatformEnum.IOS]: {
                lineHeight: 36
            },
            [PlatformEnum.ANDROID]: {
                lineHeight: 30
            }
        })
    },
    listOrderedItemIcon: {
        marginLeft: 10,
        marginRight: 10,
        ...Platform.select({
            [PlatformEnum.ANDROID]: {
                marginTop: 4
            }
        }),
        fontWeight: 'bold',
        ...Platform.select({
            [PlatformEnum.IOS]: {
                lineHeight: 36
            },
            [PlatformEnum.ANDROID]: {
                lineHeight: 30
            }
        })
    },
});
