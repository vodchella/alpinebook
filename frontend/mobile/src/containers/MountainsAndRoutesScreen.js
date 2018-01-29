import React from 'react';
import { Container, Content, Header, Left, Body, Right, Title, Icon, Button } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import styles from '../styles/Styles';
import alpinebook from '../connectors/Alpinebook';

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
        <TwoLevelDynamicList
            ref={(ref) => {
                ref.loadLevel1Data(() => {
                    alpinebook.getRegions(
                        onOk = (result) => {
                            let arr = [];
                            result.map((region) => {
                                let item = {};
                                item.id = region.region_id;
                                item.name = region.region;
                                arr.push(item);
                            });
                            ref.setLevel1Data(arr);
                        });
                });
            }}
        />
    </Container>
);

export default MountainsAndRoutesScreen;