import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles/Styles';

const HomeScreen = ({ screenProps }) => (
    <View style={styles.container}>
        <Text style={_styles.welcome}>
            Вас приветствует Alpinebook v{screenProps.version}!
        </Text>
        <Text style={_styles.instructions}>
            Оставайтесь с нами, скоро этим можно будет пользоваться :)
        </Text>
        <Text style={_styles.instructions}>
            Чтобы увидеть меню, свайпните слева направо
        </Text>
    </View>
);

HomeScreen.navigationOptions = {
    title: 'О программе'
};

const _styles = StyleSheet.create({
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