import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import styles from '../styles/Styles';

@observer
class AttachmentsList extends Component {
    render() {
        const { data } = this.props;

        return data && data.length ?
            <View />
            :
            <View style={styles.container}>
                <Text style={styles.inactiveText}>Вложения отсутствуют</Text>
            </View>;
    }
}

export default AttachmentsList;
