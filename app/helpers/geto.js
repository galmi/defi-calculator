import { helper } from '@ember/component/helper';

export default helper(function geto(args /*, named*/) {
  const [obj, key] = args;
  return obj[key];
});
