import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const HomeScreen = ({ navigation, screenProps }) => (
    <View style={styles.container}>
        <Text style={styles.welcome}>
            Вас приветствует Alpinebook v{screenProps.version}!
        </Text>
        <Text style={styles.instructions}>
            Оставайтесь с нами, скоро этим можно будет пользоваться :)
        </Text>
        <Text style={styles.instructions}>
            Чтобы увидеть меню, свайпните слева направо
        </Text>
    </View>
);

HomeScreen.navigationOptions = {
    title: 'О программе'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
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