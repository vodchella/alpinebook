import React from 'react';
import { View, Text } from 'react-native';

const RoutesScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Маршруты</Text>
    </View>
);

RoutesScreen.navigationOptions = {
    title: 'Маршруты'
};

export default RoutesScreen;