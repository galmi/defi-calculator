import { helper } from '@ember/component/helper';

export default helper(function upper(positional /*, named*/) {
  const [str] = positional;
  return str.ucup();
});
