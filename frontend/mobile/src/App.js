import React, { Component } from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Root } from 'native-base';
import HomeScreen from './containers/HomeScreen';
import RegionsAndAreasScreenNavigator from './containers/RegionsAndAreasScreen';
import SummitsScreenNavigator from './containers/SummitsScreen';
import RegionsAndAreasStore from './stores/RegionsAndAreasStore';
import RoutesStore from './stores/RoutesStore';
import TwoLevelDynamicListStore from './stores/TwoLevelDynamicListStore';


const RootDrawer = DrawerNavigator(
    {
        Home: { screen: HomeScreen },
        Routes: { screen: RegionsAndAreasScreenNavigator },
        Summits: { screen: SummitsScreenNavigator }
    },
    { initialRouteName: 'Routes' }
);

export default class Alpinebook extends Component {
    componentWillMount() {
        if (!this.regionsAndAreasStore) {
            this.regionsAndAreasStore = new RegionsAndAreasStore();
            this.regionsAndAreasStore.listStore = new TwoLevelDynamicListStore(true);
        }
        if (!this.routesStore) {
            this.routesStore = new RoutesStore();
        }
    }

    render() {
        return (
            <Root>
                <RootDrawer
                    screenProps={{
                        version: '0.01',
                        stores: {
                            regionsAndAreasStore: this.regionsAndAreasStore,
                            routesStore: this.routesStore
                        }
                    }}
                />
            </Root>
        );
    }
}
