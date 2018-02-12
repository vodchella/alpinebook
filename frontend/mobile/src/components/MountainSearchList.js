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
                            <ScrollView><View style={ls.list}>
                            {this.store.leve1Data.map((item) => {
                                switch (item.t) {
                                    case 'r': return (  // Регион, неактивный заголовок
                                        <Text
                                            key={`${item.t}${item.id}`}
                                            style={ls.listTitleItem}
                                        >
                                            {item.name}
                                        </Text>);
                                    case 'a': return (  // Область, неактивный подзаголовок
                                        <Text
                                            key={`${item.t}${item.id}`}
                                            style={ls.listSubTitleItem}
                                        >
                                            {item.name}
                                        </Text>);
                                    case 'm': return (  // Гора, активный заголовок
                                        <View
                                            key={`${item.t}${item.id}`}
                                            style={ls.listItem}
                                        >
                                            {item.dataLoaded ?
                                                <Text style={{ color: 'grey' }}>{item.name}</Text>
                                                :
                                                <TouchableOpacity
                                                    key={`${item.t}${item.id}`}
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
                                            }
                                            {item.dataLoaded ?
                                                <MountainRoutesList
                                                    navigation={navigation}
                                                    data={this.store.getLevel2Array(item.id)}
                                                />
                                                :
                                                null}
                                        </View>);
                                    default:
                                        return <View key={item.id} />;
                                }
                            })}
                            </View></ScrollView>
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
