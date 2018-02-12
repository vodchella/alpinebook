import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Container } from 'native-base';
import SimpleHeader from '../components/SimpleHeader';
import MountainSearchList from '../components/MountainSearchList';
import alpinebook from '../connectors/Alpinebook';

@observer
class MountainSearchScreen extends Component {
    componentDidMount() {
        const { query } = this.props.navigation.state.params;

        this.list.store.setLevel1DataLoader(
            () => {
                alpinebook.searchMountains(query, null,
                    (result) => {
                        this.list.store.setLevel1Data(result);
                    },
                    this.list.store.abort
                );
            }
        );

        this.list.store.loadLevel1Data();
    }

    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={'Поиск горы'}
                />
                <MountainSearchList
                    ref={(ref) => { this.list = ref; }}
                    navigation={navigation}
                />
            </Container>
        );
    }
}

export default MountainSearchScreen;
