import React from 'react';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { Title, Icon, Content, List, ListItem, Text, Separator } from 'native-base';
import { TouchableOpacity, View, ActivityIndicator, ListView, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';
import MountainsAndRoutesScreen from './MountainsAndRoutesScreen';

@observer
class AreasList extends React.Component {
    render() {
        const { regionId, store, navigation } = this.props;
        let areas = store.getAreas(regionId);

        return areas ?
            <Content style={{marginLeft: 23}}>{
                areas.map((area) =>
                    <TouchableOpacity onPress={() => navigation.navigate('MountainsAndRoutes', {area})}
                                      style={{marginTop: 13}}
                                      key={area.area_id}>
                        <Text>{area.area}</Text>
                    </TouchableOpacity>
                )}
            </Content> : null
    }
}

@observer
class RegionsList extends React.Component {
    render() {
        const { store, navigation } = this.props;
        return <ListView dataSource={store.regionsDataSource}
                         enableEmptySections={true}
                         renderRow={(rowData, sectionID, rowID) => {
                             let rec = JSON.parse(rowData);
                             return !rec.dataLoaded ?
                                 <ListItem>
                                     <Body>
                                         <TouchableOpacity onPress={() => {store.loadAreas(rowID, rec.region_id)}}>
                                             <Text style={{fontSize: 15}}>{rec.region}</Text>
                                         </TouchableOpacity>
                                     </Body>
                                     <Right>
                                         {rec.inProgress ?
                                             <ActivityIndicator size='small' color='gray' animating={true}/>
                                             :
                                             <Icon name='arrow-down'/>}
                                     </Right>
                                 </ListItem>
                                 :
                                 <ListItem>
                                     <Body>
                                         <Text style={{fontSize: 15, color: 'grey'}}>{rec.region}</Text>
                                         <AreasList regionId={rec.region_id} store={store} navigation={navigation}/>
                                     </Body>
                                 </ListItem>
                         }}
        />
    }
}

@observer
class RegionsAndAreasScreen extends React.Component {
    componentDidMount() {
        const store = this.props.screenProps.stores.regionsAndAreasStore;
        store.loadRegions();
    }

    render() {
        const store = this.props.screenProps.stores.regionsAndAreasStore;
        const { navigation } = this.props;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {navigation.navigate('DrawerOpen')}}>
                            <Icon name='menu' style={styles.headerIcon}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.headerText}>{store.searchActive ? 'Поиск' : 'Регионы'}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={store.toggleSearchActive}>
                            <Icon name='search' style={styles.headerIcon}/>
                        </Button>
                    </Right>
                </Header>
                {store.regionsFetchingInProgress ?
                    <View style={styles.container}><ActivityIndicator size='large' color='gray' animating={true}/></View>
                    :
                    <Content>
                        <RegionsList store={store} navigation={navigation}/>
                    </Content>}
            </Container>
        )
    }
}

RegionsAndAreasScreen.navigationOptions = () => {
    return {
        title: 'Горы и маршруты'
    };
};

const RegionsAndAreasScreenNavigator = StackNavigator (
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