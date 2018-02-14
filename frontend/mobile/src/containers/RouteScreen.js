import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Container } from 'native-base';
import SimpleHeader from '../components/SimpleHeader';

@observer
class RouteScreen extends Component {
    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={'Маршрут'}
                />
            </Container>
        );
    }
}

export default RouteScreen;
