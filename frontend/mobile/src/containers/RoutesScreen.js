import React from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';


@observer
class RoutesScreen extends React.Component {
    render() {
        const store = this.props.screenProps.stores.routes;
        const { navigation } = this.props;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {navigation.navigate('DrawerOpen')}}>
                            <Icon name='menu' style={styles.headerIcon}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.headerText}>{store.searchActive ? 'Поиск' : 'Маршруты'}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={store.toggleSearchActive}>
                            <Icon name='search' style={styles.headerIcon}/>
                        </Button>
                    </Right>
                </Header>
            </Container>
        )
    }
}

RoutesScreen.navigationOptions = () => {
    return {
        title: 'Маршруты'
    };
};

const RoutesScreenNavigator = StackNavigator (
    { RoutesScreen: { screen: RoutesScreen } },
    {
        headerMode: 'none',
        navigationOptions: () => ({ initialRouteName: 'RoutesScreen' })
    }
);


export default RoutesScreenNavigator;