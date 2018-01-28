import { observable, computed } from 'mobx';
import { ListView } from 'react-native';
import { Toast } from 'native-base';
import autobind from 'autobind-decorator';
import { showError, getErrorFromJson } from '../utils/Errors';
import { modifyJsonInArray } from '../utils/Arrays';

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
        fetch(`https://1da69b9f-cf2f-4bb4-8785-ed8fb1dde142.mock.pstmn.io/api/v1/regions/${regionId}/areas`)
            .then((response) => {
                const contentType = response.headers.get('Content-Type') || '';
                const isJson = contentType.includes('application/json');
                let invalidContentType = false;

                if (response.ok) {
                    if (isJson) {
                        response.json().then((responseJson) => {
                            this.areasMap.set(regionId, responseJson);
                            this.setAreasDataLoaded(index, true);
                        });
                    } else {
                        invalidContentType = true;
                    }
                } else {
                    if (isJson) {
                        response.json().then((responseJson) => {
                            this.setAreasFetchingInProgress(index, false);
                            showError(getErrorFromJson(responseJson));
                        });
                    } else {
                        invalidContentType = true;
                    }
                }

                if (invalidContentType) {
                    return Promise.reject(new Error('Invalid content type: ' + contentType));
                }

            })
            .catch((error) => {
                this.setAreasFetchingInProgress(index, false);
                showError(error.message);
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