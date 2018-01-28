import autobind from 'autobind-decorator';
import alpinebook from '../connectors/Alpinebook';
import { observable, computed } from 'mobx';
import { ListView } from 'react-native';
import { modifyJsonInArray } from '../utils/Arrays';

@autobind
class RegionsAndAreasStore {

    /*
     *  Регионы
     */

    @observable
    regions = [];

    @observable
    regionsFetchingInProgress = false;

    regionsLoaded = false;

    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    @computed
    get regionsDataSource() {
        return this.ds.cloneWithRows(this.regions.slice());
    }

    setRegionsFetchingInProgress(val) {
        this.regionsFetchingInProgress = val;
    }

    loadRegions() {
        if (!this.regionsLoaded) {
            this.setRegionsFetchingInProgress(true);
            alpinebook.getRegions(
                onOk = (result) => {
                    result.map((region) => {
                        region.inProgress = false;
                        region.dataLoaded = false;
                        this.regions.push(JSON.stringify(region));
                    });
                    this.regionsLoaded = true;
                    this.setRegionsFetchingInProgress(false);
                },
                onFail = (error) => {
                    this.setRegionsFetchingInProgress(false);
                });
        }
    }

    /*
     *  Области
     */

    areasMap = new Map();

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
        alpinebook.getAreas(regionId,
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

    /*
     *  Поиск
     */

    @observable
    searchActive = false;

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }
}

export default new RegionsAndAreasStore();