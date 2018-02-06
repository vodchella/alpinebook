import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import ArrayDataStore from '../stores/ArrayDataStore';

@observer
class MountainSearchList extends Component {
    componentWillMount() {
        this.store = new ArrayDataStore();
    }

    render() {
        return (
            <View>
                <Text>{JSON.stringify(this.store.data)}</Text>
            </View>
        );
    }
}

export default MountainSearchList;
