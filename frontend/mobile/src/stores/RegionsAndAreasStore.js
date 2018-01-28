import { observable, computed, action } from 'mobx';
import autobind from 'autobind-decorator';
import {Alert, ListView} from "react-native";

@autobind
class RegionsAndAreasStore {
    @observable
    searchActive = false;

    @observable
    regions = [
        '{"region_id": 1, "region": "Тянь-Шань", "inProgress": false, "dataLoaded": false}',
        '{"region_id": 2, "region": "Памир", "inProgress": false, "dataLoaded": false}'
    ];

    @observable
    regionsFetchingInProgress = true;

    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    @computed
    get regionsDataSource() {
        return this.ds.cloneWithRows(this.regions.slice());
    }

    modifyJsonInArray(arr, index, fn) {
        let rec = JSON.parse(arr[index]);
        fn(rec);
        arr[index] = JSON.stringify(rec);
    }

    setAreasFetchingInProgress(index, val) {
        this.modifyJsonInArray(this.regions, index, (rec) => rec.inProgress = val);
    }

    setAreasDataLoaded(index, val) {
        this.modifyJsonInArray(this.regions, index, (rec) => {
            rec.dataLoaded = val;
            rec.inProgress = false;
        });
    }

    loadAreas(index) {
        this.setAreasFetchingInProgress(index, true);
        setTimeout( () => {
            this.setAreasDataLoaded(index, true);
        }, 1000);
    }

    setRegionsFetchingInProgress(val) {
        this.regionsFetchingInProgress = val;
    }

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }
}

export default new RegionsAndAreasStore();