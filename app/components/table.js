import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { addObserver, removeObserver } from '@ember/object/observers';

export default class TableComponent extends Component {
  @service quotes;
  @tracked table;
  @tracked params;

  constructor() {
    super(...arguments);
    this.table = this.args.table;
    this.params = this.args;
  }

  @action registerListener() {
    addObserver(this, 'params.quote', this, 'invest');
  }

  @action unregisterListener(element) {
    removeObserver(this, 'params.quote', this, 'invest');
  }

  @action
  invest() {
    var totalInvested = 0.0;
    var lpQuantity = 0.0;
    var lastPriceBreakeven = 0.0;
    for (var tskey in this.table) {
      let row = this.table[tskey];
      let price = this.quotes.convert(row.price, this.params.quote, tskey);
      if (price <= lastPriceBreakeven) {
        set(row, 'price_warning', true);
      } else {
        set(row, 'price_warning', false);
      }

      const invested = parseFloat(row.invested);
      if (!isNaN(invested)) {
        totalInvested += invested;
        lpQuantity += invested / price;
      }
      // const dailyApr = Math.pow(1 + row.apy, 1 / 365) - 1;
      const dailyProfit = lpQuantity * row.daily_apr;
      lpQuantity += dailyProfit;
      const lpQuantityUsd = lpQuantity * price;
      var roi = 0.0;
      var drawdownBreakeven = 0.0;
      var priceBreakeven = 0.0;
      if (totalInvested > 0) {
        roi = lpQuantityUsd / totalInvested - 1;
        drawdownBreakeven = (lpQuantityUsd - totalInvested) / lpQuantityUsd;
        priceBreakeven = price * (1 - drawdownBreakeven);
        if (drawdownBreakeven <= 0) {
          drawdownBreakeven = '';
          priceBreakeven = '';
        } else {
          lastPriceBreakeven = priceBreakeven;
        }
      }
      // set(row, 'daily_apr', dailyApr);
      set(row, 'lp_quantity', lpQuantity);
      set(row, 'lp_quantity_usd', lpQuantityUsd);
      set(row, 'roi', roi);
      set(row, 'drawdown_breakeven', drawdownBreakeven);
      set(row, 'price_breakeven', priceBreakeven);
      set(this.table, tskey, row);
    }
    // set(model, 'table', table);
  }
}
