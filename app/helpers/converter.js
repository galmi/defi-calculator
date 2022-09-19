import Helper from '@ember/component/helper';
import { service } from '@ember/service';

export default class Converter extends Helper {
  @service quotes;

  compute([valueUsd, quote, day]) {
    return this.quotes.convert(valueUsd, quote, day);
  }
}
