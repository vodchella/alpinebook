import autobind from 'autobind-decorator';
import { observable } from 'mobx';

@autobind
class RegionsAndAreasStore {

    /*
     *  Поиск
     */

    @observable
    searchActive = false;

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }
}

export default RegionsAndAreasStore;
