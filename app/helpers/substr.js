import { helper } from '@ember/component/helper';

export default helper(function substr(args /*, named*/) {
  const [str, start, end] = args;
  return ('' + str).substr(start, end);
});
