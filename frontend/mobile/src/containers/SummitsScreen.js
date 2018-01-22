import React from 'react';
import { View, Text } from 'react-native';
import {StackNavigator} from "react-navigation";

const SummitsScreen = ({ navigation, screenProps }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Восхождения</Text>
    </View>
);

SummitsScreen.navigationOptions = {
    title: 'Восхождения'
};

const SummitsScreenWrapper = StackNavigator (
    { SummitsScreen: { screen: SummitsScreen } },
    { navigationOptions: ({ navigation }) => ({ initialRouteName: 'SummitsScreen' }) }
);

export default SummitsScreenWrapper;