import autobind from 'autobind-decorator';
import { ListView } from 'react-native';
import { observable, computed } from 'mobx';
import { modifyJsonInArray } from '../utils/Arrays';

@autobind
class TwoLevelDynamicListStore {
    constructor(useJSONStringsAtLevelOne) {
        this.useJSONStringsAtLevelOne = useJSONStringsAtLevelOne;
    }


    /*
     *  Level 1
     */

    @observable
    leve1Data = [];

    @observable
    leve1FetchingInProgress = false;

    leve1Loaded = false;
    level1DataLoader = undefined;

    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    @computed
    get leve1DataSource() {
        return this.ds.cloneWithRows(this.leve1Data.slice());
    }

    setLeve1FetchingInProgress(val) {
        this.leve1FetchingInProgress = val;
    }

    setLevel1DataLoaded(val) {
        this.leve1Loaded = val;
    }

    setLevel1Data(data) {
        this.leve1Data = data.map((item) => {
            const elem = item;
            elem.inProgress = false;
            elem.dataLoaded = false;
            return this.useJSONStringsAtLevelOne ? JSON.stringify(elem) : elem;
        });
        // Порядок вызовов setDataLoaded и setFetchingInProgress важен!
        this.setLevel1DataLoaded(true);
        this.setLeve1FetchingInProgress(false);
    }

    setLevel1DataLoader(loader) {
        this.level1DataLoader = loader;
    }

    loadLevel1Data() {
        if (this.level1DataLoader && !this.leve1Loaded) {
            this.setLeve1FetchingInProgress(true);
            this.level1DataLoader();
        }
    }

    abortLevel1() {
        this.setLeve1FetchingInProgress(false);
    }

    /*
     *  Level 2
     */

    level2Map = new Map();
    level2DataLoader = undefined;
    onPress = undefined;

    setLevel2FetchingInProgress(index, val) {
        modifyJsonInArray(this.leve1Data, index, (rec) => {
            const newRec = rec;
            newRec.inProgress = val;
            return newRec;
        });
    }

    setLevel2DataLoaded(index, val) {
        modifyJsonInArray(this.leve1Data, index, (rec) => {
            const newRec = rec;
            newRec.dataLoaded = val;
            newRec.inProgress = false;
            return newRec;
        });
    }

    getLevel2Array(id) {
        return this.level2Map.get(id);
    }

    setLevel2Data(id, index, data) {
        this.level2Map.set(id, data);
        // Порядок вызовов setDataLoaded и setFetchingInProgress важен!
        this.setLevel2DataLoaded(index, true);
        this.setLevel2FetchingInProgress(index, false);
    }

    setLevel2DataLoader(loader) {
        this.level2DataLoader = loader;
    }

    loadLevel2Data(id, index) {
        if (this.level2DataLoader) {
            this.setLevel2FetchingInProgress(index, true);
            this.level2DataLoader(id, index);
        }
    }

    abortLevel2(index) {
        this.setLevel2FetchingInProgress(index, false);
    }

    /*
     *  Common
     */

    setOnPressHandler(handler) {
        this.onPress = handler;
    }

    execOnPressHandler(navigation, item) {
        if (this.onPress) {
            this.onPress(navigation, item);
        }
    }
}

export default TwoLevelDynamicListStore;
