import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class ViewRoute extends Route {
  @service beefy;
  @service quotes;

  table = {};

  async model(params) {
    this.table = {};
    const data = await this.beefy.get(params.lp_id);

    const pricePromise = this.beefy.price(data.oracleId).then((prices) => {
      for (var item of prices) {
        let ts = item.ts.substr(0, 10);
        if (!this.table[ts]) {
          this.table[ts] = {};
        }
        this.table[ts].price = item.v;
      }
      return this.table;
    });
    const apyPromise = this.beefy.apy(data.id).then((apys) => {
      for (var item of apys) {
        let ts = item.ts.substr(0, 10);
        if (!this.table[ts]) {
          this.table[ts] = {};
        }
        this.table[ts].apy = item.v;
        this.table[ts].daily_apr =
          Math.pow(1 + this.table[ts].apy, 1 / 365) - 1;
      }
      return this.table;
    });
    const apyTvl = this.beefy.tvl(data.id, data.chainId).then((tvls) => {
      for (var item of tvls) {
        let ts = item.ts.substr(0, 10);
        if (!this.table[ts]) {
          this.table[ts] = {};
        }
        this.table[ts].tvl = item.v;
      }
      return this.table;
    });

    await Promise.all([pricePromise, apyPromise, apyTvl]);
    return RSVP.hash({
      data: data,
      table: this.table,
      quotes: this.quotes.quotes(),
      quote: 'USDT',
    });
  }
}
