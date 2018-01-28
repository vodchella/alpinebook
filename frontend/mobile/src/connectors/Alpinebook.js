import { requestAlpinebook } from '../utils/Http';

class Alpinebook {
    getRegions(onOk, onFail) {
        requestAlpinebook('regions', onOk, onFail);
    }

    getAreas(regionId, onOk, onFail) {
        requestAlpinebook(`regions/${regionId}/areas`, onOk, onFail);
    }
}

export default new Alpinebook();