import React from 'react';
import { Alert } from 'react-native';
import { Container, Header, Left, Body, Title, Icon, Button } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import styles from '../styles/Styles';
import alpinebook from '../connectors/Alpinebook';

class MountainsAndRoutesScreen extends React.Component {
    componentDidMount() {
        const areaId = this.props.navigation.state.params.record.id;

        this.dynamicList.setLevel1DataLoader(
            () => {
                alpinebook.getMountains(areaId, (result) => {
                    this.dynamicList.setLevel1Data(result);
                });
            },
            () => this.dynamicList.abort
        );

        this.dynamicList.setLevel2DataLoader(
            (id, index) => {
                alpinebook.getRoutes(id, (result) => {
                    this.dynamicList.setLevel2Data(id, index, result);
                });
            },
            () => this.dynamicList.abort
        );

        this.dynamicList.setOnPressHandler(() => { Alert.alert('Ждите', 'Скоро всё будет!'); });

        this.dynamicList.loadLevel1Data();
    }

    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <Header>
                    <Left style={styles.headerLeftWithoutRight}>
                        <Button transparent onPress={() => { navigation.goBack(null); }}>
                            <Icon name='arrow-back' style={styles.headerIcon} />
                        </Button>
                    </Left>
                    <Body >
                        <Title style={styles.headerText}>
                            {navigation.state.params.record.name}
                        </Title>
                    </Body>
                </Header>
                <TwoLevelDynamicList
                    ref={(ref) => { this.dynamicList = ref; }}
                    navigation={navigation}
                    viewType={'mountains'}
                />
            </Container>
        );
    }
}

export default MountainsAndRoutesScreen;
