import React, { Component } from 'react';
import { Header, Left, Body, Title, Subtitle, Icon, Button } from 'native-base';
import styles from '../styles/Styles';

class SimpleHeader extends Component {
    render() {
        const { navigation, caption, subtitle } = this.props;

        return (
            <Header>
                <Left style={styles.headerLeftWithoutRight}>
                    <Button transparent onPress={() => { navigation.goBack(null); }}>
                        <Icon name='arrow-back' style={styles.headerIcon} />
                    </Button>
                </Left>
                <Body >
                    <Title style={styles.headerText}>{caption}</Title>
                    {subtitle ?
                        <Subtitle>{subtitle}</Subtitle>
                        :
                        null}
                </Body>
            </Header>
        );
    }
}

export default SimpleHeader;
