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
        const testData = [
            {
                id: 1,
                name: 'С запада',
                complexity: '1Б'
            },
            {
                id: 5,
                name: 'ЮЗ гребень',
                complexity: '2А'
            },
            {
                id: 2,
                name: 'Восточный гребень',
                complexity: '2Б'
            },
            {
                id: 3,
                name: 'СЗ ребро',
                complexity: '2Б'
            },
            {
                id: 4,
                name: 'Северная стена',
                complexity: '3Б'
            },
            {
                id: 6,
                name: 'тр-с до Маншук Маметовой',
                complexity: '4А'
            }
        ];

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <SearchResultHint query={query} />
                {this.store.leve1FetchingInProgress ?
                        <View style={styles.container}>
                            <ActivityIndicator size='large' color='gray' />
                        </View>
                        :
                        this.store.leve1Data.length ?
                            <ScrollView>
                                    <View style={ls.list}>
                                        {this.store.leve1Data.map((item) => {
                                            switch (item.t) {
                                                case 'r': return (
                                                    <Text
                                                        key={`${item.t}${item.id}`}
                                                        style={ls.listTitleItem}
                                                    >
                                                        {item.name}
                                                    </Text>);
                                                case 'a': return (
                                                    <Text
                                                        key={`${item.t}${item.id}`}
                                                        style={ls.listSubTitleItem}
                                                    >
                                                        {item.name}
                                                    </Text>);
                                                case 'm': return (
                                                    <View
                                                        key={`${item.t}${item.id}`}
                                                        style={ls.listItem}
                                                    >
                                                        <TouchableOpacity
                                                            key={`${item.t}${item.id}`}
                                                            style={ls.listItemTouchableOpacity}
                                                        >
                                                            <Text>{item.name}</Text>
                                                            <Icon
                                                                name='arrow-down'
                                                                style={ls.listItemRightIcon}
                                                            />
                                                        </TouchableOpacity>
                                                        <MountainRoutesList
                                                            navigation={navigation}
                                                            data={testData}
                                                        />
                                                    </View>);
                                                default:
                                                    return <View key={item.id} />;
                                            }
                                        })}
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
