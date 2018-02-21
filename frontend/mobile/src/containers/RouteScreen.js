import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Container } from 'native-base';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import SimpleHeader from '../components/SimpleHeader';
import Markdown from '../components/Markdown';
import alpinebook from '../connectors/Alpinebook';
import styles from '../styles/Styles';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

@observer
class RouteScreen extends Component {
    state = {
        index: 0,
        routes: [
            { key: 'description', title: 'Описание' },
            { key: 'attachments', title: 'Вложения' },
        ],
    };

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

        const DescriptionScene = () => (
            <ScrollView>
                <Markdown>{`${route.description || ''}`}</Markdown>
            </ScrollView>);
        const AttachmentsScene = () => <Markdown>test</Markdown>;

        const renderScene = SceneMap({
            description: DescriptionScene,
            attachments: AttachmentsScene
        });
        const renderHeader = props => <TabBar {...props} style={styles.tabBar} />;
        const handleIndexChange = index => this.setState({ index });

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
                        <TabViewAnimated
                            style={{ flex: 1 }}
                            navigationState={this.state}
                            renderScene={renderScene}
                            renderHeader={renderHeader}
                            onIndexChange={handleIndexChange}
                            initialLayout={initialLayout}
                        />
                        :
                        <View />}
            </Container>);
    }
}

export default RouteScreen;
