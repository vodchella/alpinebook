import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import { Text, Badge } from 'native-base';
import ListItemHint from './ListItemHint';
import ls from '../styles/ListStyles';

const badgeColor = complexity => {
    let color = '#477EEA';
    if (complexity) {
        const num = parseInt(complexity.slice(0, 1), 10);
        if (num >= 5) {
            color = '#DA4437';
        } else if (num >= 3) {
            color = '#EFB406';
        }
    }
    return color;
};

@observer
class MountainRoutesList extends Component {
    render() {
        const { data, navigation } = this.props;

        return data.length ?
            <View style={ls.list}>
                {data.map((item) =>
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate('Route', { id: item.id })}
                        style={ls.listTouchableOpacity}
                    >
                        <Badge
                            style={{
                                borderRadius: 5,
                                height: 25,
                                width: 45,
                                alignSelf: 'center',
                                backgroundColor: badgeColor(item.complexity)
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
                    </TouchableOpacity>)
                }
            </View>
            :
            <ListItemHint caption={'Нет данных'} />;
    }
}

export default MountainRoutesList;
