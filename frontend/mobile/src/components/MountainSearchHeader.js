import React, { Component } from 'react';
import { Header, Left, Button, Icon, Item, Input } from 'native-base';
import { Alert } from 'react-native';
import styles from '../styles/Styles';

class MountainSearchHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { searchText: '' };
    }

    search = () => {
        const { onClose } = this.props;
        onClose();
        Alert.alert('Поиск', this.state.searchText);
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
                    />
                    <Icon name='close' onPress={onClose} />
                </Item>
            </Header>
        );
    }
}

export default MountainSearchHeader;
