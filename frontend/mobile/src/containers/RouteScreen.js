import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from 'native-base';
import SimpleHeader from '../components/SimpleHeader';
import Markdown from '../components/Markdown';
import SimpleDataStore from '../stores/SimpleDataStore';
import alpinebook from '../connectors/Alpinebook';
import styles from '../styles/Styles';

@observer
class RouteScreen extends Component {
    componentWillMount() {
        this.store = new SimpleDataStore();
    }

    componentDidMount() {
        const routeId = this.props.navigation.state.params.id;

        this.store.loadData(() => {
            alpinebook.getRoute(routeId,
                (result) => {
                    this.store.data = result;
                },
                this.store.abort
            );
        });
    }

    render() {
        const { navigation } = this.props;
        const route = this.store.data;

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={'Маршрут'}
                />
                {this.store.fetchingInProgress ?
                    <View style={styles.container}>
                        <ActivityIndicator size='large' color='gray' />
                    </View>
                    :
                    this.store.dataLoaded ?
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
