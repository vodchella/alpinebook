import React from 'react';
import { Container, Content, Header, Left, Body, Right, Title, Icon, Button } from 'native-base';
import TwoLevelDynamicList from '../components/TwoLevelDynamicList';
import styles from '../styles/Styles';
import alpinebook from '../connectors/Alpinebook';

class MountainsAndRoutesScreen extends React.Component {
    componentDidMount() {
        this.dynamicList.setLevel1DataLoader(() => {
            alpinebook.getRegions((result) => {
                let arr = [];
                result.map((region) => {
                    let item = {};
                    item.id = region.region_id;
                    item.name = region.region;
                    arr.push(item);
                });
                this.dynamicList.setLevel1Data(arr);
            });
        });
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