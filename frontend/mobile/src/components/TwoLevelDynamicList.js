import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View, ListView, ActivityIndicator } from 'react-native';
import { Body, Right, Icon, Content, ListItem, Text } from 'native-base';
import Level2List from './Level2List';
import TwoLevelDynamicListStore from '../stores/TwoLevelDynamicListStore';
import styles from '../styles/Styles';

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
