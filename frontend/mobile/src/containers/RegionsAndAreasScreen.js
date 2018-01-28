import React from 'react';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { Title, Icon, Content, List, ListItem, Text, Separator } from 'native-base';
import { TouchableOpacity, View, ActivityIndicator, ListView, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';
import styles from '../styles/Styles';

@observer
class AreasList extends React.Component {
    render() {
        const { regionId, store } = this.props;
        let areas = store.getAreas(regionId);

        return areas ?
            <Content style={{marginLeft: 23}}>{
                areas.map((area) =>
                    <TouchableOpacity style={{marginTop: 13}}>
                        <Text>{area.area}</Text>
                    </TouchableOpacity>
                )}
            </Content> : null
    }
}

@observer
class RegionsList extends React.Component {
    render() {
        const { store } = this.props;
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
                                         <AreasList regionId={rec.region_id} store={store}/>
                                     </Body>
                                 </ListItem>
                         }}
        />
    }
}

@observer
class RegionsAndAreasScreen extends React.Component {
    componentDidMount() {
        setTimeout( () => {
            const store = this.props.screenProps.stores.routes;
            store.setRegionsFetchingInProgress(false);
        }, 1000);
    }

    render() {
        const store = this.props.screenProps.stores.routes;
        const { navigation } = this.props;

        let mountains_1 = [
            {mountain_id: 1, mountain: 'Амангельды'},
            {mountain_id: 2, mountain: 'Маншук Маметовой'},
            {mountain_id: 3, mountain: 'Талгар'},
        ];

        let mountains_2 = [
            {mountain_id: 1, mountain: 'Чапаева'},
            {mountain_id: 2, mountain: 'Хан-Тенгри'},
        ];

        let mountains_3 = [
            {mountain_id: 1, mountain: 'Курумды'},
            {mountain_id: 2, mountain: 'Ленина'},
        ];

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
                {store.regionsFetchingInProgress ? <View style={styles.container}><ActivityIndicator size='large' color='gray' animating={true}/></View> :
                <Content>
                    <RegionsList store={store}/>
                </Content> }
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
    { RegionsAndAreasScreen: { screen: RegionsAndAreasScreen } },
    {
        headerMode: 'none',
        navigationOptions: () => ({ initialRouteName: 'RegionsAndAreasScreen' })
    }
);


export default RegionsAndAreasScreenNavigator;