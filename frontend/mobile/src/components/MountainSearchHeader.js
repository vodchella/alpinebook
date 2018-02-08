import React, { Component } from 'react';
import { Header, Left, Button, Icon, Item, Input } from 'native-base';
import styles from '../styles/Styles';

class MountainSearchHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { searchText: '' };
    }

    componentDidMount() {
        /* eslint-disable no-underscore-dangle */
        this.queryInput._root.focus();
    }

    search = () => {
        const query = this.state.searchText.trim();
        if (query) {
            const { navigation, onClose } = this.props;
            onClose();
            navigation.navigate('MountainSearch', { query });
        }
    };

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
                    <Icon name='search' onPress={this.search} />
                    <Input
                        style={styles.searchBarText}
                        placeholder='Поиск по названию горы'
                        returnKeyType='search'
                        onChangeText={(text) => this.setState({ searchText: text })}
                        onSubmitEditing={this.search}
                        autoCapitalize='none'
                        autoCorrect={false}
                        ref={(ref) => { this.queryInput = ref; }}
                    />
                    <Icon name='close' onPress={onClose} />
                </Item>
            </Header>
        );
    }
}

export default MountainSearchHeader;
