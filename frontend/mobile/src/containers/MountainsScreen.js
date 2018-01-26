import React from 'react';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { Title, Icon, Content, List, ListItem, Text, Separator } from 'native-base';
import { TouchableOpacity, View, ActivityIndicator, ListView, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';


@observer
class MountainsScreen extends React.Component {
    componentDidMount() {
        setTimeout( () => {
            const store = this.props.screenProps.stores.routes;
            store.setRegionsFetchingInProgress(false);
        }, 1000);
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

        let regions = [
            {region_id: 1, region: 'Тянь-Шань'},
            {region_id: 2, region: 'Памир'},
        ];

        let areas_1 = [
            {area_id: 1, area: 'Заилийский Алатау'},
            {area_id: 2, area: 'Тенгри-Таг'},
        ];

        let areas_2 = [
            {area_id: 3, area: 'Заалайский хребет'},
        ];

        let mountains_1 = [
            {mountain_id: 1, mountain: 'Амангельды'},
            {mountain_id: 2, mountain: 'Маншук Маметовой'},
            {mountain_id: 3, mountain: 'Талгар'},
        ];

        let mountains_2 = [
            {mountain_id: 1, mountain: 'Чапаева'},
            {mountain_id: 2, mountain: 'Хан-Тенгри'},
        ];

        let mountains_3 = [
            {mountain_id: 1, mountain: 'Курумды'},
            {mountain_id: 2, mountain: 'Ленина'},
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
                {store.regionsFetchingInProgress ? <View style={styles.container}><ActivityIndicator size='large' color='gray' animating={true}/></View> :
                <Content>
                    <ListView dataSource={store.dataSource}
                              enableEmptySections={true}
                              renderRow={(item) =>
                                  <ListItem>
                                      <Body>
                                          <TouchableOpacity onPress={() => {store.setAreasFetchingInProgress(true)}}>
                                              <Text style={{fontSize: 15}}>{item}</Text>
                                          </TouchableOpacity>
                                      </Body>
                                      <Right>
                                          {/*item.inProgress ? <ActivityIndicator size='small' color='gray' animating={true}/> :
                                              <Icon name='arrow-down'/>*/}
                                      </Right>
                                  </ListItem>
                              }
                    />
                </Content> }
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