import { observable, computed, action } from 'mobx';
import autobind from 'autobind-decorator';
import {Alert, ListView} from "react-native";

@autobind
class RoutesStore {
    @observable
    searchActive = false;

    @observable
    regions = [
        '{region_id: 1, region: "Тянь-Шань", inProgress: false}',
        '{region_id: 2, region: "Памир", inProgress: true}'
    ];

    @observable
    regionsFetchingInProgress = true;

    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => true //r1.inProgress !== r2.inProgress
    });

    @computed
    get dataSource() {
        return this.ds.cloneWithRows(this.regions.slice());
    }

    setAreasFetchingInProgress(val) {
        this.regions[0] = '!!!';
    }

    setRegionsFetchingInProgress(val) {
        this.regionsFetchingInProgress = val;
    }

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }
}

export default new RoutesStore();