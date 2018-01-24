import React from 'react';
import { Container, Header, Left, Body, Right, Title, Icon, Button } from 'native-base';
import { StackNavigator } from 'react-navigation';

const SummitsScreen = ({ navigation }) => (
    <Container>
        <Header>
            <Left>
                <Button transparent onPress={() => {navigation.navigate('DrawerOpen')}}>
                    <Icon name='menu'/>
                </Button>
            </Left>
            <Body>
            <Title>Восхождения</Title>
            </Body>
            <Right/>
        </Header>
    </Container>
);

SummitsScreen.navigationOptions = {
    title: 'Восхождения'
};

const SummitsScreenNavigator = StackNavigator (
    { SummitsScreen: { screen: SummitsScreen } },
    {
        headerMode: 'none',
        navigationOptions: () => ({ initialRouteName: 'SummitsScreen' })
    }
);

export default SummitsScreenNavigator;