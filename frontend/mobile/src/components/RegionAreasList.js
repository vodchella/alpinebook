import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import { Content, Text } from 'native-base';
import ListItemHint from './ListItemHint';

@observer
class RegionAreasList extends Component {
    render() {
        const { store, navigation, data } = this.props;

        return data.length ?
            <Content style={{ marginLeft: 23 }}>{
                data.map((item) =>
                    <TouchableOpacity
                        onPress={() => store.execOnPressHandler(navigation, item)}
                        style={{ marginTop: 16 }}
                        key={item.id}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            </Content>
            :
            <ListItemHint caption={'Нет данных'} />;
    }
}

export default RegionAreasList;
