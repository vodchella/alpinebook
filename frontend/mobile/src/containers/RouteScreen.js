import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from 'native-base';
import SimpleHeader from '../components/SimpleHeader';
import Markdown from '../components/Markdown';
import alpinebook from '../connectors/Alpinebook';
import styles from '../styles/Styles';

@observer
class RouteScreen extends Component {
    componentWillMount() {
        const { routesStore } = this.props.screenProps.stores;
        const routeId = this.props.navigation.state.params.id;
        this.store = routesStore.getRouteStore(routeId);
    }

    componentDidMount() {
        const routeId = this.props.navigation.state.params.id;

        if (!this.store.dataLoaded && !this.store.fetchingInProgress) {
            this.store.loadData(() => {
                alpinebook.getRoute(routeId,
                    (result) => {
                        this.store.data = result;
                    },
                    this.store.abort
                );
            });
        }
    }

    render() {
        const { navigation } = this.props;
        const route = this.store.data;

        let title = 'Маршрут...';
        let subtitle = '';
        if (this.store.dataLoaded) {
            title = route.mountain.name;
            subtitle = `${route.complexity} к.т. ${route.name}`;
        }

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={title}
                    subtitle={subtitle}
                />
                {this.store.fetchingInProgress ?
                    <View style={styles.container}>
                        <ActivityIndicator size='large' color='gray' />
                    </View>
                    :
                    this.store.dataLoaded ?
                        <ScrollView>
                            <Markdown>{
                                `${route.description || ''}`
                            }</Markdown>
                        </ScrollView>
                        :
                        <View />}
            </Container>);
    }
}

export default RouteScreen;
