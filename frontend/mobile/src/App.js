import React, { Component } from 'react';
import HomeScreen from './containers/HomeScreen';
import RoutesScreenWrapper from './containers/RoutesScreen';
import SummitsScreenWrapper from './containers/SummitsScreen';
import { DrawerNavigator } from 'react-navigation';


const RootDrawer = DrawerNavigator (
    {
        Home: { screen: HomeScreen },
        Routes: { screen: RoutesScreenWrapper },
        Summits: { screen: SummitsScreenWrapper }
    },
    { initialRouteName: 'Home' }
);

export default class Alpinebook extends Component {
  render() {
      return (
          <RootDrawer screenProps={{version: '0.01'}}/>
      );
  }
}
