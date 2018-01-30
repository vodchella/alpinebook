import { requestAlpinebook } from '../utils/Http';
import { jsonArrayToListData } from '../utils/Arrays';

class Alpinebook {
    getRegions(onOk, onFail) {
        requestAlpinebook('regions', onOk, onFail, (result) =>
            jsonArrayToListData(result, 'region_id', 'region')
        );
    }

    getAreas(regionId, onOk, onFail) {
        requestAlpinebook(`regions/${regionId}/areas`, onOk, onFail, (result) =>
            jsonArrayToListData(result, 'area_id', 'area')
        );
    }

    getMountains(areaId, onOk, onFail) {
        requestAlpinebook(`areas/${areaId}/mountains`, onOk, onFail, (result) =>
            jsonArrayToListData(result, 'mountain_id', 'mountain')
        );
    }

    getRoutes(mountainId, onOk, onFail) {
        requestAlpinebook(`mountains/${mountainId}/routes`, onOk, onFail, (result) =>
             jsonArrayToListData(result, 'route_id', 'route')
        );
    }
}

export default new Alpinebook();
