import React from 'react';
import { Content, Text, Body } from 'native-base';
import styles from '../styles/Styles';

const ListItemHint = ({ caption }) => (
    <Content>
        <Body>
            <Text style={styles.hintText}>{caption}</Text>
        </Body>
    </Content>
);

export default ListItemHint;
