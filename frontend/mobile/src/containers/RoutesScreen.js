import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';


@observer
class RoutesScreen extends React.Component {
    render() {
        const store = this.props.screenProps.stores.routes;
        return (
            <View style={styles.container}>
                <Text>{store.searchActive ? 'Поиск маршрутов' : 'Маршруты'}</Text>
            </View>
        )
    }
}

RoutesScreen.navigationOptions = ({screenProps}) => {
    const store = screenProps.stores.routes;
    return {
        title: 'Маршруты',
        headerRight: (
            <Button title={'Поиск'} onPress={store.toggleSearchActive}/>
        )
    };
};

const RoutesScreenNavigator = StackNavigator (
    { RoutesScreen: { screen: RoutesScreen } },
    { navigationOptions: () => ({ initialRouteName: 'RoutesScreen' }) }
);


export default RoutesScreenNavigator;