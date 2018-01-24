import React from 'react';
import { Container, Header, Left, Body, Right, Button, } from 'native-base';
import { Title, Icon, Content, List, ListItem, Text, Separator } from 'native-base';
import { Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';


@observer
class MountainsScreen extends React.Component {
    showRoutes(mountain) {
        Alert.alert('Show ' + mountain.name)
    }

    render() {
        const store = this.props.screenProps.stores.routes;
        const { navigation } = this.props;

        let testItems = [
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
                              const type = item.type ? item.type : '?';
                              const name = item.name ? item.name : '?';

                              if (type === 'region') {
                                  return <Separator><Text style={{fontSize: 15}}>{name}</Text></Separator>
                              } else if (type === 'area') {
                                  return <Separator><Text style={{fontSize: 10}}>{name}</Text></Separator>
                              } else if (type === 'mountain') {
                                  return <ListItem onPress={() => {this.showRoutes(item)}}>
                                            <Body>
                                                <TouchableOpacity onPress={() => {this.showRoutes(item)}}>
                                                    <Text>{name}</Text>
                                                </TouchableOpacity>
                                            </Body>
                                            <Right><Icon name='arrow-forward'/></Right>
                                         </ListItem>
                              } else {
                                  return null;
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