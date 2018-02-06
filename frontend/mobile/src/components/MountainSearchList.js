import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import { Body, Right, Icon, Content, Item, Text } from 'native-base';
import ArrayDataStore from '../stores/ArrayDataStore';
import styles from '../styles/Styles';

@observer
class MountainSearchList extends Component {
    componentWillMount() {
        this.store = new ArrayDataStore();
    }

    render() {
        return (
            <Content>
                <Item style={{ alignItems: 'center' }}>
                    <Text>dsdsd</Text>
                </Item>
            {this.store.fetchingInProgress ?
                <View style={styles.container}>
                    <ActivityIndicator size='large' color='gray' />
                </View>
                :
                this.store.dataLoaded ?
                    <View />
                    :
                    <View />}
            </Content>
        );
    }
}

export default MountainSearchList;
