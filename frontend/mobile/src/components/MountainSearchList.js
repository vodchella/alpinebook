import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Badge, Icon } from 'native-base';
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
                        //this.store.data.length ?
                        1 === 1 ?
                            <ScrollView>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            paddingLeft: 20,
                                            paddingTop: 10
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'grey',
                                                alignSelf: 'flex-start'
                                            }}
                                        >
                                            Тянь-Шань
                                        </Text>
                                        <Text
                                            style={{
                                                color: 'grey',
                                                alignSelf: 'flex-start',
                                                fontSize: 12,
                                                paddingLeft: 10
                                            }}
                                        >Заилийский алатау</Text>
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignSelf: 'flex-start',
                                                paddingLeft: 10,
                                                paddingTop: 15,
                                                paddingRight: 15,
                                                height: 45,
                                                justifyContent: 'space-between',
                                                width: '100%'
                                            }}
                                        >
                                            <Text>Амангельды</Text>
                                            <Icon
                                                name='arrow-down'
                                                style={{ color: 'lightgrey', fontSize: 20 }}
                                            />
                                        </TouchableOpacity>
                                        {testData.map((item) =>
                                            <TouchableOpacity
                                                key={item.id}
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-start',
                                                    paddingLeft: 10,
                                                    height: 45,
                                                    width: '100%'
                                                }}
                                            >
                                                <Badge
                                                    style={{
                                                        borderRadius: 5,
                                                        height: 25,
                                                        width: 45,
                                                        alignSelf: 'center',
                                                        backgroundColor: '#477EEA'
                                                    }}
                                                >
                                                    <Text>
                                                        {item.complexity}
                                                        {item.winter_complexity ? '*' : null}
                                                    </Text>
                                                </Badge>
                                                <Text
                                                    style={{
                                                        paddingLeft: 20,
                                                        paddingRight: 50,
                                                        alignSelf: 'center'
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>)}
                                    </View>
                            </ScrollView>
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
