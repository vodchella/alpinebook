import autobind from 'autobind-decorator';
import TwoLevelDynamicListStore from './TwoLevelDynamicListStore';

@autobind
class SimpleDataStore {
    constructor() {
        this.store = new TwoLevelDynamicListStore();
    }

    get fetchingInProgress() {
        return this.store.leve1FetchingInProgress;
    }

    get dataLoaded() {
        return this.store.leve1Loaded;
    }

    get data() {
        return this.store.leve1Data;
    }

    set data(newData) {
        this.store.setLevel1DataObject(newData);
    }

    loadData(loader) {
        this.store.setLevel1DataLoader(loader);
        this.store.loadLevel1Data();
    }

    abort() {
        this.store.abortLevel1();
    }
}

export default SimpleDataStore;
