import axios from 'axios';
import { get, set } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BeefyService extends Service {
  @service cache;
  @tracked quotePrice = {};
  lastDays = 50;
  loading = false;

  quotes() {
    return ['USDT', 'BTC', 'BNB', 'ETH', 'AVAX', 'MATIC', 'FTM', 'OP'];
  }

  async loadAll() {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    const to = Math.floor(now.getTime());
    const from = to - 60 * 60 * 24 * this.lastDays * 1000;

    this.loading = true;
    let quotes = this.quotes();
    let promises = [];
    for (var i = 1; i < quotes.length; i++) {
      var pairId = quotes[i] + 'USDT';
      const klineCache = this.cache.get('quotes_' + pairId);
      if (klineCache !== null) {
        var data = JSON.parse(klineCache);
        set(this.quotePrice, quotes[i], data);
        continue;
      }
      promises.push(
        ((quote, pairId) => {
          return axios
            .get(
              `https://api.binance.com/api/v3/klines?symbol=${pairId}&interval=1d&startTime=${from}` //&endTime=${to}`
            )
            .then((response) => {
              const key = 'quotes_' + pairId;
              var data = {};
              for (var kline of response.data) {
                data[kline[0]] = kline[4];
              }
              set(this.quotePrice, quote, data);
              this.cache.set(key, JSON.stringify(data), 60 * 60);
              return response;
            });
        })(quotes[i], pairId)
      );
    }
    await Promise.all(promises);
    this.loading = false;
  }

  getValue(base, day) {
    if (base === 'USDT') {
      return 1.0;
    }
    var [year, month, d] = day.split('-');
    var dayDate = Date.UTC(year, month - 1, d, 0, 0, 0, 0);
    const value = get(this.quotePrice, `${base}.${dayDate}`);
    return value;
  }

  convert(valueUsd, quote, day) {
    return parseFloat((valueUsd / this.getValue(quote, day)).toFixed(8));
  }
}
