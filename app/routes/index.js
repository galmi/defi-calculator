import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { chains } from '../static/chains';
import RSVP from 'rsvp';

export default class IndexRoute extends Route {
  @service beefy;
  async model() {
    return RSVP.hash({
      data: this.beefy.all(),
      chains: chains,
    });
  }
}
