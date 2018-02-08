import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import { Content } from 'native-base';
import ArrayDataStore from '../stores/ArrayDataStore';
import SearchResultHint from './SearchResultHint';
import styles from '../styles/Styles';

@observer
class MountainSearchList extends Component {
    componentWillMount() {
        this.store = new ArrayDataStore();
    }

    render() {
        const { navigation } = this.props;
        const { query } = navigation.state.params;

        return (
            <Content>
                <SearchResultHint query={query} />
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
