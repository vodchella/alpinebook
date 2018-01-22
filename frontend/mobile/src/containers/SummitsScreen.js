import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../styles/Styles';

const SummitsScreen = ({ navigation, screenProps }) => (
    <View style={styles.container}>
        <Text>Восхождения</Text>
    </View>
);

SummitsScreen.navigationOptions = {
    title: 'Восхождения'
};

const SummitsScreenWrapper = StackNavigator (
    { SummitsScreen: { screen: SummitsScreen } },
    { navigationOptions: () => ({ initialRouteName: 'SummitsScreen' }) }
);

export default SummitsScreenWrapper;