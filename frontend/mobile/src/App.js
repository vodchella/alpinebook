import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import HomeScreen from './containers/HomeScreen';
import MountainsScreenNavigator from './containers/MountainsScreen';
import SummitsScreenNavigator from './containers/SummitsScreen';
import mountainsStore from './stores/MountainsStore';


const RootDrawer = DrawerNavigator (
    {
        Home: { screen: HomeScreen },
        Routes: { screen: MountainsScreenNavigator },
        Summits: { screen: SummitsScreenNavigator }
    },
    { initialRouteName: 'Routes' }
);

export default class Alpinebook extends React.Component {
  render() {
      return (
          <RootDrawer screenProps={
              {
                  version: '0.01',
                  stores: {
                      routes: mountainsStore
                  }
              }
          }/>
      );
  }
}
