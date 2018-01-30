import React from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View, ListView, ActivityIndicator } from 'react-native';
import { Body, Right, Icon, Content, ListItem, Text } from 'native-base';
import { observable, computed } from 'mobx';
import Level2List from './Level2List';
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
        this.leve1Data = data.map((item) => {
            const elem = item;
            elem.inProgress = false;
            elem.dataLoaded = false;
            return JSON.stringify(elem);
        });
        // Порядок вызовов setDataLoaded и setFetchingInProgress важен!
        this.setLevel1DataLoaded(true);
        this.setLeve1FetchingInProgress(false);
    }

    setLevel1DataLoader(loader) {
        this.level1DataLoader = loader;
    }

    loadLevel1Data() {
        if (this.level1DataLoader && !this.leve1Loaded) {
            this.setLeve1FetchingInProgress(true);
            this.level1DataLoader();
        }
    }

    /*
     *  Level 2
     */

    level2Map = new Map();
    level2DataLoader = undefined;
    onPress = undefined;

    setLevel2FetchingInProgress(index, val) {
        modifyJsonInArray(this.leve1Data, index, (rec) => {
            const newRec = rec;
            newRec.inProgress = val;
            return newRec;
        });
    }

    setLevel2DataLoaded(index, val) {
        modifyJsonInArray(this.leve1Data, index, (rec) => {
            const newRec = rec;
            newRec.dataLoaded = val;
            newRec.inProgress = false;
            return newRec;
        });
    }

    getLevel2Array(id) {
        return this.level2Map.get(id);
    }

    setLevel2Data(id, index, data) {
        this.level2Map.set(id, data);
        // Порядок вызовов setDataLoaded и setFetchingInProgress важен!
        this.setLevel2DataLoaded(index, true);
        this.setLevel2FetchingInProgress(index, false);
    }

    setLevel2DataLoader(loader) {
        this.level2DataLoader = loader;
    }

    loadLevel2Data(id, index) {
        if (this.level2DataLoader) {
            this.setLevel2FetchingInProgress(index, true);
            this.level2DataLoader(id, index);
        }
    }

    /*
     *  Common
     */

    setOnPressHandler(handler) {
        this.onPress = handler;
    }

    execOnPressHandler(navigation, item) {
        if (this.onPress) {
            this.onPress(navigation, item);
        }
    }

    abort() {
        this.setLeve1FetchingInProgress(false);
        this.level2Map.forEach((value, key) => {
            const rec = JSON.parse(value);
            rec.inProgress = false;
            this.level2Map.set(key, JSON.stringify(rec));
        });
    }
}

@observer
class TwoLevelDynamicList extends React.Component {
    
    /* eslint-disable react/sort-comp */
    store = new TwoLevelDynamicListStore();

    loadLevel1Data = this.store.loadLevel1Data;
    loadLevel2Data = this.store.loadLevel2Data;
    setLevel1Data = this.store.setLevel1Data;
    setLevel2Data = this.store.setLevel2Data;
    setLevel1DataLoader = this.store.setLevel1DataLoader;
    setLevel2DataLoader = this.store.setLevel2DataLoader;

    setOnPressHandler = this.store.setOnPressHandler;
    abort = this.store.abort;

    render() {
        const { navigation } = this.props;

        /* eslint-disable no-nested-ternary */
        return this.store.leve1FetchingInProgress ?
                    <View style={styles.container}>
                        <ActivityIndicator size='large' color='gray' />
                    </View>
                    :
                    this.store.leve1Loaded ?
                        <Content>
                            <ListView
                                dataSource={this.store.leve1DataSource}
                                renderRow={(rowData, sectionID, rowID) => {
                                    const rec = JSON.parse(rowData);
                                    return !rec.dataLoaded ?
                                        <ListItem>
                                            <Body>
                                                <TouchableOpacity
                                                    onPress={() => this.loadLevel2Data(rec.id,
                                                                                       rowID)}
                                                >
                                                    <Text style={{ fontSize: 15 }}>{rec.name}</Text>
                                                </TouchableOpacity>
                                            </Body>
                                            <Right>
                                                {rec.inProgress ?
                                                    <ActivityIndicator size='small' color='gray' />
                                                    :
                                                    <Icon name='arrow-down' />}
                                            </Right>
                                        </ListItem>
                                        :
                                        <ListItem>
                                            <Body>
                                                <Text style={{ fontSize: 15, color: 'grey' }}>{rec.name}</Text>
                                                <Level2List id={rec.id} store={this.store} navigation={navigation} />
                                            </Body>
                                        </ListItem>;
                                    }}
                            />
                        </Content>
                        :
                        <View />;
    }
}

export default TwoLevelDynamicList;
