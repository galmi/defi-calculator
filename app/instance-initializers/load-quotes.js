export function initialize(applicationInstance) {
  let quotes = applicationInstance.lookup('service:quotes');
  quotes.loadAll();
}

export default {
  initialize,
};
