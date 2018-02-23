import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getIconByContentType } from '../utils/Icons';
import { downloadAndOpenFile } from '../utils/Http';
import ls from '../styles/ListStyles';
import styles from '../styles/Styles';

@observer
class AttachmentsList extends Component {
    render() {
        const { data } = this.props;
        return data && data.length ?
            <ScrollView style={{ paddingTop: 10 }}>
                <View style={ls.list}>
                    {data.map((item) =>
                        <TouchableOpacity
                            key={`${item.name}${Date.now()}`}
                            onPress={() => downloadAndOpenFile(item)}
                            style={ls.listTouchableOpacity}
                        >
                            <Icon
                                name={getIconByContentType(item.content_type)}
                                color='black'
                                size={22}
                                style={{ width: 50 }}
                            />
                            <Text>{item.name}</Text>
                        </TouchableOpacity>)}
                </View>
            </ScrollView>
            :
            <View style={styles.container}>
                <Text style={styles.inactiveText}>Вложения отсутствуют</Text>
            </View>;
    }
}

export default AttachmentsList;
