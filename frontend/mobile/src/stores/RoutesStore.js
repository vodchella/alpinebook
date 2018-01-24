import { observable } from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class RoutesStore {
    @observable
    searchActive = false;

    toggleSearchActive() {
        this.searchActive = !this.searchActive;
    }
}

export default new RoutesStore();