import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import { Content, Text } from 'native-base';

@observer
class Level2List extends React.Component {
    render() {
        const { id, store, navigation } = this.props;
        const data = store.getLevel2Array(id);

        return data ?
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
            </Content> : null;
    }
}

export default Level2List;
