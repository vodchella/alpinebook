import React from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon, Content, List, ListItem, Text, Separator } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';


@observer
class MountainsScreen extends React.Component {
    render() {
        const store = this.props.screenProps.stores.routes;
        const { navigation } = this.props;

        var testItems = [
            { type: 'region', name: 'Тянь-Шань' },
            { type: 'area', name: 'Заилийский Алатау' },
            { type: 'mountain', name: 'Амангельды' },
            { type: 'mountain', name: 'Маншук Маметовой' },
            { type: 'mountain', name: 'Талгар' },
            { type: 'area', name: 'Тенгри-Таг' },
            { type: 'mountain', name: 'Чапаева' },
            { type: 'mountain', name: 'Хан-Тенгри' },
            { type: 'region', name: 'Памир' },
            { type: 'area', name: 'Заалайский хребет' },
            { type: 'mountain', name: 'Курумды' },
            { type: 'mountain', name: 'Ленина' },
        ];

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {navigation.navigate('DrawerOpen')}}>
                            <Icon name='menu' style={styles.headerIcon}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.headerText}>{store.searchActive ? 'Поиск' : 'Горы'}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={store.toggleSearchActive}>
                            <Icon name='search' style={styles.headerIcon}/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List dataArray={testItems}
                          renderRow={(item) => {
                              if (item.type === 'region') {
                                  return <ListItem itemHeader><Text>{item.name}</Text></ListItem>
                              } else if (item.type === 'area') {
                                  return <Separator><Text>{item.name}</Text></Separator>
                              } else {
                                  return <ListItem><Text>{item.name}</Text></ListItem>
                              }
                          }}
                    />
                </Content>
            </Container>
        )
    }
}

MountainsScreen.navigationOptions = () => {
    return {
        title: 'Горы и маршруты'
    };
};

const MountainsScreenNavigator = StackNavigator (
    { MountainsScreen: { screen: MountainsScreen } },
    {
        headerMode: 'none',
        navigationOptions: () => ({ initialRouteName: 'MountainsScreen' })
    }
);


export default MountainsScreenNavigator;