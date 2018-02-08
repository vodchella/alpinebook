import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import { Content, Text } from 'native-base';
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
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <SearchResultHint query={query} />
                {this.store.fetchingInProgress ?
                        <View style={styles.container}>
                            <ActivityIndicator size='large' color='gray' />
                        </View>
                        :
                        this.store.data.length ?
                            <Content>
                                <Text />
                            </Content>
                            :
                            <View style={styles.container}>
                                <Text style={styles.inactiveText}>Нет данных</Text>
                            </View>
                        }
            </View>
        );
    }
}

export default MountainSearchList;
