import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import MountainRoutesList from './MountainRoutesList';
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
                {this.store.fetchingInProgress ?
                        <View style={styles.container}>
                            <ActivityIndicator size='large' color='gray' />
                        </View>
                        :
                        this.store.data.length ?
                            <ScrollView>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            paddingLeft: 20
                                        }}
                                    >
                                        {this.store.data.map((item) => {
                                            switch (item.t) {
                                                case 'r': return (
                                                    <Text
                                                        key={`${item.t}${item.id}`}
                                                        style={{
                                                            color: 'grey',
                                                            alignSelf: 'flex-start',
                                                            paddingTop: 10
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>);
                                                case 'a': return (
                                                    <Text
                                                        key={`${item.t}${item.id}`}
                                                        style={{
                                                            color: 'grey',
                                                            alignSelf: 'flex-start',
                                                            fontSize: 12,
                                                            paddingLeft: 10,
                                                            paddingBottom: 15
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>);
                                                case 'm': return (
                                                    <View
                                                        key={`${item.t}${item.id}`}
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'column',
                                                            alignSelf: 'flex-start',
                                                            paddingLeft: 10,
                                                            paddingRight: 15,
                                                            paddingBottom: 15,
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            key={`${item.t}${item.id}`}
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <Text>{item.name}</Text>
                                                            <Icon
                                                                name='arrow-down'
                                                                style={{
                                                                    color: 'lightgrey',
                                                                    fontSize: 20
                                                                }}
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
