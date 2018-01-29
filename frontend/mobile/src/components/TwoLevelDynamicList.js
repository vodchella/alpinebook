import React from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react/native';
import { View, ListView, ActivityIndicator, Alert } from 'react-native';
import { observable, computed } from 'mobx';
import styles from '../styles/Styles';

@autobind
class TwoLevelDynamicListStore {
    @observable
    leve1Data = [];

    @observable
    leve1FetchingInProgress = false;

    leve1Loaded = false;

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
}

@observer
class TwoLevelDynamicList extends React.Component {

    store = new TwoLevelDynamicListStore();

    render() {
        const { navigation } = this.props;

        return this.store.leve1FetchingInProgress ?
                    <View style={styles.container}><ActivityIndicator size='large' color='gray' animating={true}/></View>
                    :
                    this.store.leve1Loaded ?
                        <Content>
                            <ListView
                                dataSource={[
                                    '{"id": 1, "name": "Item1", "inProgress": false, "dataLoaded": false}',
                                    '{"id": 2, "name": "Item2", "inProgress": false, "dataLoaded": false}'
                                ]}
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