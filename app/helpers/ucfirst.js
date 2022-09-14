import { helper } from '@ember/component/helper';

export default helper(function ucfirst(positional /*, named*/) {
  const [str] = positional;
  return str.charAt(0).toUpperCase() + str.slice(1);
});
