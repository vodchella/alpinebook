import React from 'react';
import { View } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from '../styles/Styles';

const SearchResultHint = ({ query }) => (
    <View style={styles.searchHint}>
        <Icon name='search' style={{ color: 'grey', paddingRight: 5 }} />
        <Text style={styles.inactiveText}>Результаты поиска по '{query}'</Text>
    </View>
);

export default SearchResultHint;
