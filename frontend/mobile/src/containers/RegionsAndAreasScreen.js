import React, { Component } from 'react';
import {
    Container, Header, Left, Body, Right, Button, Title, Icon
} from 'native-base';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';
import MountainsAndRoutesScreen from './MountainsAndRoutesScreen';
import MountainSearchScreen from './MountainSearchScreen';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import MountainSearchHeader from '../components/MountainSearchHeader';
import alpinebook from '../connectors/Alpinebook';

@observer
class RegionsAndAreasScreen extends Component {
    componentDidMount() {
        this.dynamicList.setLevel1DataLoader(() => {
            alpinebook.getRegions(
                (result) => {
                    this.dynamicList.setLevel1Data(result);
                },
                this.dynamicList.abortLevel1
            );
        });

        this.dynamicList.setLevel2DataLoader((id, index) => {
            alpinebook.getAreas(id,
                (result) => {
                    this.dynamicList.setLevel2Data(id, index, result);
                },
                () => {
                    this.dynamicList.abortLevel2(index);
                }
            );
        });

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
                    <MountainSearchHeader
                        navigation={navigation}
                        onClose={store.toggleSearchActive}
                    />
                    : 
                    <Header>
                        <Left>
                            <Button
                                transparent
                                onPress={() => { navigation.navigate('DrawerOpen'); }}
                            >
                                <Icon name='menu' style={styles.headerIcon} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={styles.headerText}>Регионы</Title>
                        </Body>
                        <Right>
                            <Button
                                transparent
                                onPress={store.toggleSearchActive}
                            >
                                <Icon name='search' style={styles.headerIcon} />
                            </Button>
                        </Right>
                    </Header>}
                    <TwoLevelDynamicList
                        ref={(ref) => { this.dynamicList = ref; }}
                        navigation={navigation}
                        store={store.listStore}
                    />
            </Container>
        );
    }
}

RegionsAndAreasScreen.navigationOptions = { title: 'Горы и маршруты' };

const RegionsAndAreasScreenNavigator = StackNavigator(
    {
        RegionsAndAreas: { screen: RegionsAndAreasScreen },
        MountainsAndRoutes: { screen: MountainsAndRoutesScreen },
        MountainSearch: { screen: MountainSearchScreen }
    },
    {
        headerMode: 'none',
        navigationOptions: () => ({ initialRouteName: 'RegionsAndAreas' })
    }
);


export default RegionsAndAreasScreenNavigator;
