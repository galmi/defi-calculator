import Service from '@ember/service';
import axios from 'axios';
import { default as tokens } from '../static/tokens';
import { config as chains } from '../static/chains';
import { service } from '@ember/service';

export default class BeefyService extends Service {
  @service cache;

  data = {};

  async vaults() {
    const vaults = this.cache.get('beefy_vaults');
    if (vaults !== null) {
      this.data = vaults;
      return this.data;
    }
    return axios
      .get(`https://api.beefy.finance/vaults?_=` + Date.now())
      .then((response) => {
        for (var i in response.data) {
          const lp = response.data[i];
          if (lp.status === 'active') {
            var chain = lp.network;
            if (!chain) {
              chain = lp.chain;
            }
            this.data[lp.id] = {
              id: lp.id,
              oracleId: lp.oracleId,
              assets: lp.assets,
              chain: lp.network,
              platform: lp.platformId,
              chainId: chains[chain].chainId,
              name: lp.name,
            };
          }
        }
        console.log(response.data);
        this.cache.set('beefy_vaults', this.data, 60 * 60);
        return this.data;
      });
  }

  async all() {
    await this.vaults();
    const lpsPromise = new Promise((resolve, reject) => {
      axios
        .get(`https://api.beefy.finance/lps/breakdown?_=` + Date.now())
        .then((response) => {
          for (let key in response.data) {
            if (!this.data[key]) {
              continue;
            }
            this.data[key].price = response.data[key].price;
            this.data[key].totalSupply = response.data[key].totalSupply;
            this.data[key].balances = response.data[key].balances;
            this.data[key].tokens = response.data[key].tokens;
          }
          resolve(this.data);
        });
    });
    const apyPromise = new Promise((resolve, reject) => {
      axios
        .get(`https://api.beefy.finance/apy/breakdown?_=` + Date.now())
        .then((response) => {
          for (let key in response.data) {
            if (
              this.data[key]
              // &&
              // response.data[key].vaultApy > 0 &&
              // response.data[key].totalApy > 0
            ) {
              this.data[key].beefyPerformanceFee =
                response.data[key].beefyPerformanceFee;
              this.data[key].lpFee = response.data[key].lpFee;
              this.data[key].Apy = response.data[key].totalApy;
              this.data[key].tradingApr = response.data[key].tradingApr;
              this.data[key].tradingDailyApr = this.data[key].tradingApr / 365;
              this.data[key].vaultApr = response.data[key].vaultApr;
              this.data[key].vaultDailyApr = response.data[key].vaultApr / 365;
              this.data[key].vaultApy = response.data[key].vaultApy;
              this.data[key].totalDaily =
                (this.data[key].tradingDailyApr || 0) +
                (this.data[key].vaultDailyApr || 0);

              this.data[key].totalApy =
                Math.pow(1 + this.data[key].totalDaily, 365) - 1;
            }
          }
          for (let key in this.data) {
            if (!this.data[key].totalApy) {
              delete this.data[key];
            }
          }
          resolve(this.data);
        });
    });
    await Promise.all([lpsPromise, apyPromise]);

    for (var key in this.data) {
      this.data[key].totalTVL =
        this.data[key].price * this.data[key].totalSupply;
    }
    console.log(this.data);
    return Object.values(this.data);
  }

  async get(id) {
    if (!this.data || !this.data[id]) {
      await this.all();
    }
    return this.data[id];
  }

  async price(oracleId) {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 40;
    return axios
      .get(
        `https://data.beefy.finance/price?name=${oracleId}&period=day&from=${from}&to=${to}&limit=40`
      )
      .then((response) => {
        return response.data;
      });
  }

  async apy(id) {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 40;
    return axios
      .get(
        `https://data.beefy.finance/apy?name=${id}&period=day&from=${from}&to=${to}&limit=40`
      )
      .then((response) => {
        return response.data;
      });
  }

  async tvl(id, chainId) {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 40;
    return axios
      .get(
        `https://data.beefy.finance/tvl?name=${id}-${chainId}&period=day&from=${from}&to=${to}&limit=40`
      )
      .then((response) => {
        return response.data;
      });
  }
}
