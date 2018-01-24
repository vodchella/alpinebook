import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import HomeScreen from './containers/HomeScreen';
import RoutesScreenNavigator from './containers/RoutesScreen';
import SummitsScreenNavigator from './containers/SummitsScreen';
import routesStore from './stores/RoutesStore';


const RootDrawer = DrawerNavigator (
    {
        Home: { screen: HomeScreen },
        Routes: { screen: RoutesScreenNavigator },
        Summits: { screen: SummitsScreenNavigator }
    },
    { initialRouteName: 'Home' }
);

export default class Alpinebook extends React.Component {
  render() {
      return (
          <RootDrawer screenProps={
              {
                  version: '0.01',
                  stores: {
                      routes: routesStore
                  }
              }
          }/>
      );
  }
}
