import React from 'react';
import { Container, Content, Header, Left, Body, Right, Title, Icon, Button } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import styles from '../styles/Styles';

const MountainsAndRoutesScreen = ({ navigation }) => (
    <Container>
        <Header>
            <Left style={styles.headerLeftWithoutRight}>
                <Button transparent onPress={() => {navigation.goBack(null)}}>
                    <Icon name='arrow-back' style={styles.headerIcon}/>
                </Button>
            </Left>
            <Body >
                <Title style={styles.headerText}>{navigation.state.params.area.area}</Title>
            </Body>
        </Header>
        <TwoLevelDynamicList/>
    </Container>
);

export default MountainsAndRoutesScreen;