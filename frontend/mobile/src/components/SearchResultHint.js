import React from 'react';
import { Content, Text, Body, Item, Icon } from 'native-base';

const SearchResultHint = ({ query }) => (
    <Content>
        <Body style={{ paddingTop: 5 }}>
            <Item>
                <Icon name='search' style={{ color: 'grey' }} />
                <Text style={{ color: 'grey', fontSize: 12 }}>Результаты поиска по '{query}'</Text>
            </Item>
        </Body>
    </Content>
);

export default SearchResultHint;
