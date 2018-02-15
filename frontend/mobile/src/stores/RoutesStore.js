import autobind from 'autobind-decorator';
import SimpleDataStore from '../stores/SimpleDataStore';

@autobind
class RoutesStore {
    constructor() {
        this.routesMap = new Map();
    }

    getRouteStore(id) {
        let route = this.routesMap.get(id);
        if (!route) {
            route = new SimpleDataStore();
            this.routesMap.set(id, route);
        }
        return route;
    }
}

export default RoutesStore;
