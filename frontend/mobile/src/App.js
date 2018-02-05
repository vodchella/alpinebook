import React, { Component } from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Root } from 'native-base';
import HomeScreen from './containers/HomeScreen';
import RegionsAndAreasScreenNavigator from './containers/RegionsAndAreasScreen';
import SummitsScreenNavigator from './containers/SummitsScreen';
import regionsAndAreasStore from './stores/RegionsAndAreasStore';
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
    render() {
        regionsAndAreasStore.listStore = new TwoLevelDynamicListStore();

        return (
            <Root>
                <RootDrawer
                    screenProps={{
                        version: '0.01',
                        stores: {
                            regionsAndAreasStore
                        }
                    }}
                />
            </Root>
        );
    }
}
