import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import { Content, Text, Left, Body, Badge, ListItem } from 'native-base';
import styles from '../styles/Styles';

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
class Level2RoutesList extends React.Component {


    render() {
        const { id, store, navigation } = this.props;
        const data = store.getLevel2Array(id);

        return data ?
            <Content>{
                data.map((item) =>
                    <ListItem noBorder key={item.id}>
                        <Left style={styles.headerLeftWithoutRight}>
                            <TouchableOpacity onPress={() => store.execOnPressHandler(navigation, item)}>
                                <Badge
                                    style={{
                                        borderRadius: 3,
                                        height: 25,
                                        width: 45,
                                        backgroundColor: badgeColor(item.complexity)
                                    }}
                                >
                                    <Text>{item.complexity}{item.winter_complexity ? '*' : null}</Text>
                                </Badge>
                            </TouchableOpacity>
                        </Left>
                        <Body>
                            <TouchableOpacity onPress={() => store.execOnPressHandler(navigation, item)}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                )}
            </Content> : null;
    }
}

export default Level2RoutesList;
