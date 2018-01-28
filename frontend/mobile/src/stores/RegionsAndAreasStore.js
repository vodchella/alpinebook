import { observable, computed } from 'mobx';
import { ListView } from 'react-native';
import { Toast } from 'native-base';
import autobind from 'autobind-decorator';

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

    getErrorFromJson(jsonObject) {
        if (jsonObject.error) {
            let error = jsonObject.error;
            let code = error.code ? `[${error.code}] ` : '';
            let message = error.message || JSON.stringify(error);
            return `${code}${message}`
        } else {
            return 'Неизвестная ошибка';
        }
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

    loadAreas(index, regionId) {
        this.setAreasFetchingInProgress(index, true);
        fetch(`https://1da69b9f-cf2f-4bb4-8785-ed8fb1dde142.mock.pstmn.io/api/v1/regions/${regionId}/areas`)
            .then((response) => {
                const contentType = response.headers.get('Content-Type') || '';
                const isJson = contentType.includes('application/json');

                if (response.ok) {
                    if (isJson) {
                        response.json().then((responseJson) => {
                            this.areasMap.set(regionId, responseJson);
                            this.setAreasDataLoaded(index, true);
                        });
                    }
                } else {
                    if (isJson) {
                        response.json().then((responseJson) => {
                            this.setAreasFetchingInProgress(index, false);
                            Toast.show({
                                text: this.getErrorFromJson(responseJson),
                                type: 'danger',
                                duration: 3000
                            });
                        });
                    }
                }

            })
            .catch((error) => {
                Toast.show({text: error, type: 'danger', duration: 3000});
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