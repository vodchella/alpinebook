import React, { Component } from 'react';
import HomeScreen from './containers/HomeScreen';
import RoutesScreen from './containers/RoutesScreen';
import SummitsScreen from './containers/SummitsScreen';
import { DrawerNavigator, StackNavigator } from 'react-navigation';


/*
 * DrawerNavigator скрывает заголовки экранов и легально с этим ничего нельзя сделать
 * Поэтому оборачиваем каждый экран в одностраничный StackNavigator, так заголовки видны
 */
const RoutesScreenWrapper = StackNavigator (
    { RoutesScreen: { screen: RoutesScreen } },
    { navigationOptions: ({ navigation }) => ({ initialRouteName: 'RoutesScreen' }) }
);

const SummitsScreenWrapper = StackNavigator (
    { SummitsScreen: { screen: SummitsScreen } },
    { navigationOptions: ({ navigation }) => ({ initialRouteName: 'SummitsScreen' }) }
);


const RootDrawer = DrawerNavigator(
    {
        Home: { screen: HomeScreen },
        Routes: { screen: RoutesScreenWrapper },
        Summits: { screen: SummitsScreenWrapper }
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
