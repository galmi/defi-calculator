import { helper } from '@ember/component/helper';

export default helper(function fixed(args /*, named*/) {
  const [num, frac] = args;
  if (num === '' || num === undefined || isNaN(num) || num == 0.0) {
    return '';
  }
  return parseFloat(num.toFixed(frac));
});
