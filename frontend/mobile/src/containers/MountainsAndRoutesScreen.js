import React, { Component } from 'react';
import { Container } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import SimpleHeader from '../components/SimpleHeader';
import alpinebook from '../connectors/Alpinebook';

class MountainsAndRoutesScreen extends Component {
    componentWillMount() {
        const { mountainsAndRoutesStore } = this.props.screenProps.stores;
        const areaId = this.props.navigation.state.params.record.id;
        this.store = mountainsAndRoutesStore.getStore(areaId);
    }

    componentDidMount() {
        const areaId = this.props.navigation.state.params.record.id;

        this.dynamicList.setLevel1DataLoader(
            () => {
                alpinebook.getMountains(areaId,
                    (result) => {
                        this.dynamicList.setLevel1Data(result);
                    },
                    this.dynamicList.abortLevel1
                );
            }
        );

        this.dynamicList.setLevel2DataLoader((id, index) => {
            alpinebook.getRoutes(id,
                (result) => {
                    this.dynamicList.setLevel2Data(id, index, result);
                },
                () => {
                    this.dynamicList.abortLevel2(index);
                }
            );
        });

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
                    store={this.store}
                    viewType={'mountains'}
                />
            </Container>
        );
    }
}

export default MountainsAndRoutesScreen;
