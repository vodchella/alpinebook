import React from 'react';
import { Alert } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Icon, Button } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import styles from '../styles/Styles';
import alpinebook from '../connectors/Alpinebook';

class MountainsAndRoutesScreen extends React.Component {
    componentDidMount() {
        const areaId = this.props.navigation.state.params.record.id;

        this.dynamicList.setLevel1DataLoader(
            onOk = () => {
                alpinebook.getMountains(areaId, (result) => {
                    this.dynamicList.setLevel1Data(result);
                });
            },
            onFail = this.dynamicList.abort
        );

        this.dynamicList.setLevel2DataLoader(
            onOk = (id, index) => {
                alpinebook.getRoutes(id, (result) => {
                    this.dynamicList.setLevel2Data(id, index, result);
                });
            },
            onFail = this.dynamicList.abort
        );

        this.dynamicList.setOnPressHandler(() => {Alert.alert('Ждите', 'Скоро всё будет!')});

        this.dynamicList.loadLevel1Data();
    }

    render() {
        const { navigation } = this.props;

        return <Container>
            <Header>
                <Left style={styles.headerLeftWithoutRight}>
                    <Button transparent onPress={() => {navigation.goBack(null)}}>
                        <Icon name='arrow-back' style={styles.headerIcon}/>
                    </Button>
                </Left>
                <Body >
                    <Title style={styles.headerText}>{navigation.state.params.record.name}</Title>
                </Body>
            </Header>
            <TwoLevelDynamicList
                ref={(ref) => this.dynamicList = ref}
            />
        </Container>
    }
}

export default MountainsAndRoutesScreen;