import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { addObserver, removeObserver } from '@ember/object/observers';
import { set } from '@ember/object';

export default class TableMainComponent extends Component {
  originalModel;
  @tracked model;
  @tracked filter = '';
  @tracked chains = [];
  @tracked sortKey = 'totalDaily';
  @tracked sortDirection = 'desc';
  @tracked sort_totalApy = 'sort';
  @tracked sort_totalDaily = 'sort-down';
  @tracked sort_totalTVL = 'sort';

  constructor() {
    super(...arguments);
    this.model = this.args.model;
    this.originalModel = structuredClone(this.args.model);
    this.sortModel();
  }

  @action
  sort(key) {
    this.sort_totalApy = 'sort';
    this.sort_totalDaily = 'sort';
    this.sort_totalTVL = 'sort';
    if (this.sortKey !== key) {
      this.sortKey = key;
      this.sortDirection = 'asc';
      this['sort_' + key] = 'sort-up';
    } else {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
        this['sort_' + key] = 'sort-down';
      } else {
        this.sortDirection = 'asc';
        this['sort_' + key] = 'sort-up';
      }
    }
    this.sortModel();
  }

  sortModel() {
    const compare = (a, b) => {
      if (a[this.sortKey] < b[this.sortKey]) {
        if (this.sortDirection === 'asc') {
          return -1;
        }
        if (this.sortDirection === 'desc') {
          return 1;
        }
      }
      if (a[this.sortKey] > b[this.sortKey]) {
        if (this.sortDirection === 'asc') {
          return 1;
        }
        if (this.sortDirection === 'desc') {
          return -1;
        }
      }
      return 0;
    };
    var data = structuredClone(this.model.data);
    data.sort(compare);
    set(this.model, 'data', data);
  }

  @action registerListener() {
    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'filter', this, 'filterModel');
    // eslint-disable-next-line ember/no-observers
    addObserver(this, 'chains', this, 'filterModel');
  }

  @action unregisterListener(element) {
    removeObserver(this, 'filter', this, 'filterModel');
    removeObserver(this, 'chains', this, 'filterModel');
  }

  filterModel() {
    var filtered = [];
    for (var item of this.originalModel.data) {
      if (
        this.chains &&
        this.chains.length > 0 &&
        !this.chains.includes(item.chain)
      ) {
        continue;
      }
      var assets = item.assets.join(' ');
      if (
        assets.length > 0 &&
        this.filter.length > 0 &&
        !assets.match(new RegExp(`${this.filter}`, 'i'))
      ) {
        continue;
      }
      filtered.push(item);
    }
    set(this.model, 'data', filtered);
    this.sortModel();
  }
}
