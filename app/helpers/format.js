import { helper } from '@ember/component/helper';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default helper(function format(args /*, named*/) {
  const [num, frac, commas] = args;
  if (commas) {
    return numberWithCommas(num.toFixed(frac));
  } else {
    return num.toFixed(frac);
  }
});
