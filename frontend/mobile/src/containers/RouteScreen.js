import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from 'native-base';
import SimpleHeader from '../components/SimpleHeader';
import Markdown from '../components/Markdown';
import TwoLevelDynamicListStore from '../stores/TwoLevelDynamicListStore';
import alpinebook from '../connectors/Alpinebook';
import styles from '../styles/Styles';

@observer
class RouteScreen extends Component {
    componentWillMount() {
        this.store = new TwoLevelDynamicListStore();
    }

    componentDidMount() {
        const routeId = this.props.navigation.state.params.id;

        this.store.setLevel1DataLoader(() => {
            alpinebook.getRoute(routeId,
                (result) => {
                    this.store.setLevel1DataObject(result);
                },
                this.store.abortLevel1
            );
        });

        this.store.loadLevel1Data();
    }

    render() {
        const { navigation } = this.props;
        const route = this.store.leve1Data;

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={'Маршрут'}
                />
                {this.store.leve1FetchingInProgress ?
                    <View style={styles.container}>
                        <ActivityIndicator size='large' color='gray' />
                    </View>
                    :
                    this.store.leve1Loaded ?
                        <ScrollView>
                            <Markdown>{
                                `## ${route.mountain.name}\n` +
                                `#### ${route.complexity} к.т. ${route.name}\n\n` +
                                `${route.description}`
                            }</Markdown>
                        </ScrollView>
                        :
                        <View />}
            </Container>);
    }
}

export default RouteScreen;
