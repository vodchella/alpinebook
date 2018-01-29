import { requestAlpinebook } from '../utils/Http';
import { jsonArrayToListData } from '../utils/Arrays';

class Alpinebook {
    getRegions(onOk, onFail) {
        requestAlpinebook('regions', onOk, onFail, (result) => {
            return jsonArrayToListData(result, 'region_id', 'region');
        });
    }

    getAreas(regionId, onOk, onFail) {
        requestAlpinebook(`regions/${regionId}/areas`, onOk, onFail, (result) => {
            return jsonArrayToListData(result, 'area_id', 'area');
        });
    }
}

export default new Alpinebook();