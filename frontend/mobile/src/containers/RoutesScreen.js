import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../styles/Styles';

const RoutesScreen = ({ navigation, screenProps }) => (
    <View style={styles.container}>
        <Text>Маршруты</Text>
    </View>
);

RoutesScreen.navigationOptions = {
    title: 'Маршруты'
};

const RoutesScreenWrapper = StackNavigator (
    { RoutesScreen: { screen: RoutesScreen } },
    { navigationOptions: () => ({ initialRouteName: 'RoutesScreen' }) }
);

export default RoutesScreenWrapper;