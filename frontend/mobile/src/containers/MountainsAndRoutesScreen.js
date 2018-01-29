import React from 'react';
import { Alert } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Icon, Button } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import styles from '../styles/Styles';
import alpinebook from '../connectors/Alpinebook';
import { jsonArrayToListData } from '../utils/Arrays';

class MountainsAndRoutesScreen extends React.Component {
    componentDidMount() {
        this.dynamicList.setLevel1DataLoader(() => {
            alpinebook.getRegions((result) => {
                let arr = jsonArrayToListData(result, 'region_id', 'region');
                this.dynamicList.setLevel1Data(arr);
            });
        });

        this.dynamicList.setLevel2DataLoader((id, index) => {
            alpinebook.getAreas(id, (result) => {
                let arr = jsonArrayToListData(result, 'area_id', 'area');
                this.dynamicList.setLevel2Data(id, index, arr);
            });
        });

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
                <Title style={styles.headerText}>{navigation.state.params.area.area}</Title>
                </Body>
            </Header>
            <TwoLevelDynamicList
                ref={(ref) => this.dynamicList = ref}
            />
        </Container>
    }
}

export default MountainsAndRoutesScreen;