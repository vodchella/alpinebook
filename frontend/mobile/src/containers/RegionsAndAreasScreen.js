import React from 'react';
import {
    Container, Header, Left, Body, Right, Button, Title, Icon, Item, Input
} from 'native-base';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';
import MountainsAndRoutesScreen from './MountainsAndRoutesScreen';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import alpinebook from '../connectors/Alpinebook';

@observer
class RegionsAndAreasScreen extends React.Component {
    componentDidMount() {
        this.dynamicList.setLevel1DataLoader(
            () => {
                alpinebook.getRegions((result) => {
                    this.dynamicList.setLevel1Data(result);
                });
            },
            () => this.dynamicList.abort
        );

        this.dynamicList.setLevel2DataLoader(
            (id, index) => {
                alpinebook.getAreas(id, (result) => {
                    this.dynamicList.setLevel2Data(id, index, result);
                });
            },
            () => this.dynamicList.abort
        );

        this.dynamicList.setOnPressHandler((navigation, item) => {
            navigation.navigate('MountainsAndRoutes', { record: item });
        });

        this.dynamicList.loadLevel1Data();
    }

    render() {
        const store = this.props.screenProps.stores.regionsAndAreasStore;
        const { navigation } = this.props;

        return (
            <Container>
                {store.searchActive ?
                <Header searchBar rounded>
                    <Left style={styles.headerLeftWithSearchBar}>
                        <Button transparent onPress={() => { navigation.navigate('DrawerOpen'); }}>
                            <Icon name='menu' style={styles.headerIcon} />
                        </Button>
                    </Left>
                    <Item>
                        <Icon name="search" />
                        <Input style={styles.searchBarText} placeholder="Поиск по названию горы" />
                        <Icon name="close" onPress={store.toggleSearchActive} />
                    </Item>
                </Header>
                : 
                <Header>
                    <Left>
                        <Button transparent onPress={() => { navigation.navigate('DrawerOpen'); }}>
                            <Icon name='menu' style={styles.headerIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.headerText}>Регионы</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={store.toggleSearchActive}>
                            <Icon name='search' style={styles.headerIcon} />
                        </Button>
                    </Right>
                </Header>}
                <TwoLevelDynamicList
                    ref={(ref) => { this.dynamicList = ref; }}
                    navigation={navigation}
                />
            </Container>
        );
    }
}

RegionsAndAreasScreen.navigationOptions = { title: 'Горы и маршруты' };

const RegionsAndAreasScreenNavigator = StackNavigator(
    {
        RegionsAndAreas: { screen: RegionsAndAreasScreen },
        MountainsAndRoutes: { screen: MountainsAndRoutesScreen }
    },
    {
        headerMode: 'none',
        navigationOptions: () => ({ initialRouteName: 'RegionsAndAreas' })
    }
);


export default RegionsAndAreasScreenNavigator;
