import autobind from 'autobind-decorator';
import { observable } from 'mobx';

@autobind
class ArrayDataStore {
    @observable
    data = [];

    @observable
    fetchingInProgress = false;

    dataLoaded = false;
    dataLoader = undefined;

    setFetchingInProgress(val) {
        this.fetchingInProgress = val;
    }

    setDataLoaded(val) {
        this.dataLoaded = val;
    }

    setData(data) {
        this.data = data;
        // Порядок вызовов setDataLoaded и setFetchingInProgress важен!
        this.setDataLoaded(true);
        this.setFetchingInProgress(false);
    }

    setDataLoader(loader) {
        this.dataLoader = loader;
    }

    loadData() {
        if (this.dataLoader && !this.dataLoaded) {
            this.setFetchingInProgress(true);
            this.dataLoader();
        }
    }
}

export default ArrayDataStore;
