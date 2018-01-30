import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles/Styles';

const HomeScreen = ({ screenProps }) => (
    <View style={styles.container}>
        <Text style={thisScreenStyles.welcome}>
            Привет от Alpinebook v{screenProps.version}!
        </Text>
        <Text style={thisScreenStyles.instructions}>
            Оставайся с нами, скоро этим можно будет пользоваться :)
        </Text>
        <Text style={thisScreenStyles.instructions}>
            Чтобы увидеть меню, свайпни слева направо
        </Text>
    </View>
);

HomeScreen.navigationOptions = {
    title: 'О программе'
};

const thisScreenStyles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default HomeScreen;
