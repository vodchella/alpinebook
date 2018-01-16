import React, { Component } from 'react';
import HomeScreen from './screens/HomeScreen';
import RoutesScreen from './screens/RoutesScreen';
import SummitsScreen from './screens/SummitsScreen';
import { DrawerNavigator, StackNavigator } from 'react-navigation';


/*
 * DrawerNavigator скрывает заголовки экранов и легально с этим ничего нельзя сделать
 * Поэтому оборачиваем каждый экран в одностраничный StackNavigator, так заголовки видны
 */
const routesScreenWrapper = StackNavigator (
    { RoutesScreen: { screen: RoutesScreen } },
    { navigationOptions: ({ navigation }) => ({ initialRouteName: 'RoutesScreen' }) }
);

const summitsScreenWrapper = StackNavigator (
    { SummitsScreen: { screen: SummitsScreen } },
    { navigationOptions: ({ navigation }) => ({ initialRouteName: 'SummitsScreen' }) }
);


const RootDrawer = DrawerNavigator(
    {
        Home: { screen: HomeScreen },
        Routes: { screen: routesScreenWrapper },
        Summits: { screen: summitsScreenWrapper }
    },
    { initialRouteName: 'Home' }
);

export default class Alpinebook extends Component<{}> {
  render() {
      return (
          <RootDrawer/>
      );
  }
}
