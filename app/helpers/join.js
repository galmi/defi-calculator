import { helper } from '@ember/component/helper';

export default helper(function join(args /*, named*/) {
  const [arr, separator] = args;
  return arr.join(separator);
});
