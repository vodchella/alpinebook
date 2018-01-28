import { observable, computed } from 'mobx';
import { ListView } from 'react-native';
import { Toast } from 'native-base';
import autobind from 'autobind-decorator';
import { showError, getErrorFromJson } from '../utils/Errors';
import { modifyJsonInArray } from '../utils/Arrays';
import { requestAlpinebook } from '../utils/Http';

@autobind
class RegionsAndAreasStore {
    @observable
    searchActive = false;

    @observable
    regions = [
        '{"region_id": 1, "region": "Тянь-Шань", "inProgress": false, "dataLoaded": false}',
        '{"region_id": 2, "region": "Памир", "inProgress": false, "dataLoaded": false}'
    ];
    
    areasMap = new Map();

    @observable
    regionsFetchingInProgress = true;

    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    @computed
    get regionsDataSource() {
        return this.ds.cloneWithRows(this.regions.slice());
    }

    setAreasFetchingInProgress(index, val) {
        modifyJsonInArray(this.regions, index, (rec) => rec.inProgress = val);
    }

    setAreasDataLoaded(index, val) {
        modifyJsonInArray(this.regions, index, (rec) => {
            rec.dataLoaded = val;
            rec.inProgress = false;
        });
    }

    loadAreas(index, regionId) {
        this.setAreasFetchingInProgress(index, true);
        requestAlpinebook(`regions/${regionId}/areas`,
            onOk = (result) => {
                this.areasMap.set(regionId, result);
                this.setAreasDataLoaded(index, true);
            },
            onFail = (error) => {
                this.setAreasFetchingInProgress(index, false);
            });
    }

    getAreas(regionId) {
        return this.areasMap.get(regionId);
    }

    setRegionsFetchingInProgress(val) {
        this.regionsFetchingInProgress = val;
    }

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }
}

export default new RegionsAndAreasStore();