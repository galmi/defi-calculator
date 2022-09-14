import { helper } from '@ember/component/helper';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default helper(function perc(args /*, named*/) {
  const [num, frac, commas] = args;
  if (num === '' || num === undefined || isNaN(num) || num == 0.0) {
    return '';
  }
  if (commas) {
    return numberWithCommas((num * 100).toFixed(frac)) + '%';
  } else {
    return (num * 100).toFixed(frac) + '%';
  }
});
