import autobind from 'autobind-decorator';
import TwoLevelDynamicListStore from './TwoLevelDynamicListStore';

@autobind
class MountainsAndRoutesStore {
    constructor() {
        this.map = new Map();
    }

    getStore(id) {
        let store = this.map.get(id);
        if (!store) {
            store = new TwoLevelDynamicListStore(true);
            this.map.set(id, store);
        }
        return store;
    }
}

export default MountainsAndRoutesStore;
