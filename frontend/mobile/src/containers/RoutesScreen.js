import React from 'react';
import { View, Text } from 'react-native';
import {StackNavigator} from "react-navigation";

const RoutesScreen = ({ navigation, screenProps }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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