import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import MountainRoutesList from './MountainRoutesList';
import TwoLevelDynamicListStore from '../stores/TwoLevelDynamicListStore';
import SearchResultHint from './SearchResultHint';
import styles from '../styles/Styles';
import ls from '../styles/ListStyles';

@observer
class MountainSearchList extends Component {
    componentWillMount() {
        this.store = new TwoLevelDynamicListStore();
    }

    render() {
        const { navigation } = this.props;
        const { query } = navigation.state.params;

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <SearchResultHint query={query} />
                {this.store.leve1FetchingInProgress ?
                        <View style={styles.container}>
                            <ActivityIndicator size='large' color='gray' />
                        </View>
                        :
                        this.store.leve1Data.length ?
                            <ScrollView style={{ paddingTop: 20 }}>
                                <View style={ls.list}>
                                {this.store.leve1Data.map((item) => (
                                    <View
                                        key={item.id}
                                        style={ls.listItem}
                                    >
                                        {item.dataLoaded ?
                                            <Text style={{ color: 'grey' }}>{item.name}</Text>
                                            :
                                            <View>
                                                <TouchableOpacity
                                                    style={ls.listItemTouchableOpacity}
                                                    onPress={
                                                        () => this.store.loadLevel2Data(item.id,
                                                                                        item.index)
                                                    }
                                                >
                                                    <Text>{item.name}</Text>
                                                    {item.inProgress ?
                                                        <ActivityIndicator
                                                            size='small'
                                                            color='gray'
                                                        />
                                                        :
                                                        <Icon
                                                            name='arrow-down'
                                                            style={ls.listItemRightIcon}
                                                        />}
                                                </TouchableOpacity>
                                                <Text style={styles.inactiveText}>
                                                    {item.region}, {item.area}
                                                </Text>
                                            </View>
                                        }
                                        {item.dataLoaded ?
                                            <MountainRoutesList
                                                navigation={navigation}
                                                data={this.store.getLevel2Array(item.id)}
                                            />
                                            :
                                            null}
                                    </View>
                                ))}
                                </View>
                            </ScrollView>
                            :
                            <View style={styles.container}>
                                <Text style={styles.inactiveText}>Ничего не найдено</Text>
                            </View>
                        }
            </View>
        );
    }
}

export default MountainSearchList;
