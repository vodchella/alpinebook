import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import SimpleHeader from '../components/SimpleHeader';
import alpinebook from '../connectors/Alpinebook';

class MountainsAndRoutesScreen extends Component {
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
                <SimpleHeader
                    navigation={navigation}
                    caption={navigation.state.params.record.name}
                />
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
