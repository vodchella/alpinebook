import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Header, Left, Button, Icon, Item, Input } from 'native-base';
import styles from '../styles/Styles';

@observer
class MountainSearchHeader extends Component {
    render() {
        const { navigation, onClose } = this.props;

        return (
            <Header searchBar rounded>
                <Left style={styles.headerLeftWithSearchBar}>
                    <Button transparent onPress={() => { navigation.navigate('DrawerOpen'); }}>
                        <Icon name='menu' style={styles.headerIcon} />
                    </Button>
                </Left>
                <Item>
                    <Icon name="search" />
                    <Input style={styles.searchBarText} placeholder="Поиск по названию горы" />
                    <Icon name="close" onPress={onClose} />
                </Item>
            </Header>
        );
    }
}

export default MountainSearchHeader;
