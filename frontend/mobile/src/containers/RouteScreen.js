import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, ActivityIndicator, Dimensions, Text } from 'react-native';
import { Container } from 'native-base';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import AttachmentsList from '../components/AttachmentsList';
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
        showTabs: false,
        title: 'Маршрут...',
        subtitle: ''
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

                        // Отладочная заглушка, потом убрать
                        if (result.id === 5 || result.id === 1) {
                            this.store.data.attachments = [
                                {
                                    id: 1,
                                    name: 'aman_1.jpg',
                                    ext: 'jpg',
                                    path: 'http://alpfederation.ru/api/files/3630'
                                },
                                {
                                    id: 2,
                                    name: 'aman_2.pdf',
                                    ext: 'pdf',
                                    path: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'
                                }
                            ];
                        }

                        this.updateState();
                    },
                    this.store.abort
                );
            });
        } else {
            this.updateState();
        }
    }

    updateState = () => {
        this.setState({
            title: this.store.data.mountain.name,
            subtitle: `${this.store.data.complexity} к.т. ${this.store.data.name}`,
            showTabs: this.store.data.attachments,
            index: this.store.data.description ? 0 : 1
        });
    }

    descriptionScene = () => {
        const route = this.store.data;
        return route.description ?
            <ScrollView>
                <Markdown>{route.description}</Markdown>
            </ScrollView>
            :
            <View style={styles.container}>
                <Text style={styles.inactiveText}>Описание отсутствует</Text>
            </View>;
    }

    attachmentsScene = () => {
        const route = this.store.data;
        return <AttachmentsList data={route.attachments} />;
    }

    handleIndexChange = index => this.setState({ index });

    renderHeader = props => <TabBar {...props} style={styles.tabBar} />;

    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={this.state.title}
                    subtitle={this.state.subtitle}
                />
                {this.store.fetchingInProgress ?
                    <View style={styles.container}>
                        <ActivityIndicator size='large' color='gray' />
                    </View>
                    :
                    this.store.dataLoaded ?
                        this.state.showTabs ?
                            <TabViewAnimated
                                style={{ flex: 1 }}
                                navigationState={this.state}
                                renderHeader={this.renderHeader}
                                onIndexChange={this.handleIndexChange}
                                initialLayout={initialLayout}
                                renderScene={SceneMap({
                                    description: this.descriptionScene,
                                    attachments: this.attachmentsScene
                                })}
                            />
                            :
                            this.descriptionScene()
                        :
                        <View />}
            </Container>);
    }
}

export default RouteScreen;
