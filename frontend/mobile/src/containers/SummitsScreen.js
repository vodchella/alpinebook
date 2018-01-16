import React from 'react';
import { View, Text } from 'react-native';

const SummitsScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Восхождения</Text>
    </View>
);

SummitsScreen.navigationOptions = {
    title: 'Восхождения'
};

export default SummitsScreen;