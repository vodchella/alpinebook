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

    searchMountains(query, areaId, onOk, onFail) {
        if (areaId === 1) {
            // Это отладочная заглушка
            // TODO: Убрать после переезда на свой сервер
            const strForDebug = `areas/5/mountains?search=${query}`;
            requestAlpinebook(strForDebug, onOk, onFail, (result) => result);
        } else {
            const queryStr = areaId ?
                                `areas/${areaId}/mountains?search=${query}`
                                :
                                `mountains?search=${query}`;
                                requestAlpinebook(queryStr, onOk, onFail, (result) => result);
        }
    }

    getRoutes(mountainId, onOk, onFail) {
        requestAlpinebook(`mountains/${mountainId}/routes`, onOk, onFail, (result) =>
             jsonArrayToListData(result, 'route_id', 'route')
        );
    }
}

export default new Alpinebook();
