import React from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View, ListView, ActivityIndicator, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { Title, Icon, Content, List, ListItem, Text } from 'native-base';
import { observable, computed } from 'mobx';
import { modifyJsonInArray } from '../utils/Arrays';
import styles from '../styles/Styles';

@autobind
class TwoLevelDynamicListStore {

    /*
     *  Level 1
     */

    @observable
    leve1Data = [];

    @observable
    leve1FetchingInProgress = false;

    leve1Loaded = false;
    level1DataLoader = undefined;

    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    @computed
    get leve1DataSource() {
        return this.ds.cloneWithRows(this.leve1Data.slice());
    }

    setLeve1FetchingInProgress(val) {
        this.leve1FetchingInProgress = val;
    }

    setLevel1DataLoaded(val) {
        this.leve1Loaded = val;
    }

    setLevel1Data(data) {
        let arr = [];
        data.map((item) => {
            item.inProgress = false;
            item.dataLoaded = false;
            arr.push(JSON.stringify(item))
        });
        this.leve1Data = arr;
    }

    setLevel1DataLoader(loader) {
        this.level1DataLoader = loader;
    }

    loadLevel1Data() {
        if (this.level1DataLoader && !this.leve1Loaded) {
            this.setLeve1FetchingInProgress(true);
            this.level1DataLoader();
            this.setLeve1FetchingInProgress(false);
            this.setLevel1DataLoaded(true);
        }
    }

    /*
     *  Level 2
     */

    level2Map = new Map();
    level2DataLoader = undefined;

    setLevel2FetchingInProgress(index, val) {
        modifyJsonInArray(this.leve1Data, index, (rec) => rec.inProgress = val);
    }

    setLevel2DataLoaded(index, val) {
        modifyJsonInArray(this.leve1Data, index, (rec) => {
            rec.dataLoaded = val;
            rec.inProgress = false;
        });
    }

    getLevel2Array(id) {
        return this.level2Map.get(id);
    }

    setLevel2DataLoader(loader) {
        this.level2DataLoader = loader;
    }
}

@observer
class TwoLevelDynamicList extends React.Component {
    store = new TwoLevelDynamicListStore();

    setLevel1Data = this.store.setLevel1Data;
    setLevel1DataLoader = this.store.setLevel1DataLoader;
    loadLevel1Data = this.store.loadLevel1Data;

    setLevel2DataLoader = this.store.setLevel2DataLoader;

    render() {
        const { navigation } = this.props;

        return this.store.leve1FetchingInProgress ?
                    <View style={styles.container}><ActivityIndicator size='large' color='gray' animating={true}/></View>
                    :
                    this.store.leve1Loaded ?
                        <Content>
                            <ListView
                                dataSource={this.store.leve1DataSource}
                                enableEmptySections={true}
                                renderRow={(rowData, sectionID, rowID) => {
                                    let rec = JSON.parse(rowData);
                                    return !rec.dataLoaded ?
                                        <ListItem>
                                            <Body>
                                                <TouchableOpacity onPress={() => {Alert.alert('this.store.loadAreas(rowID, rec.id)')}}>
                                                    <Text style={{fontSize: 15}}>{rec.name}</Text>
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
                                                <Text style={{fontSize: 15, color: 'grey'}}>{rec.name}</Text>
                                                <ListView>
                                                    <Text>Вместо AreaList</Text>
                                                </ListView>
                                            </Body>
                                        </ListItem>
                                    }}
                            />
                        </Content>
                        :
                        <View/>

    }
}

export default TwoLevelDynamicList;