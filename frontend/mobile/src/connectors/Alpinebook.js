import { requestAlpinebook } from '../utils/Http';

class Alpinebook {
    getRegions(onOk, onFail) {
        requestAlpinebook('regions', onOk, onFail);
    }

    getAreas(regionId, onOk, onFail) {
        requestAlpinebook(`regions/${regionId}/areas`, onOk, onFail);
    }

    getMountains(areaId, onOk, onFail) {
        requestAlpinebook(`areas/${areaId}/mountains`, onOk, onFail);
    }

    searchMountains(query, areaId, onOk, onFail) {
        const queryStr = areaId ?
                            `areas/${areaId}/mountains?search=${query}`
                            :
                            `mountains?search=${query}`;
        requestAlpinebook(queryStr, onOk, onFail);
    }

    getRoutes(mountainId, onOk, onFail) {
        requestAlpinebook(`mountains/${mountainId}/routes`, onOk, onFail);
    }

    getRoute(routeId, onOk, onFail) {
        requestAlpinebook(`routes/${routeId}`, onOk, onFail);
    }
}

export default new Alpinebook();
