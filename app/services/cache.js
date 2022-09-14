import Service from '@ember/service';

export default class CacheService extends Service {
  set(key, value, ttl) {
    const entry = {};
    const expire = Date.now() + ttl * 1000;

    entry.value = value;
    entry.expire = expire;
    localStorage.setItem(key, JSON.stringify(entry));
  }

  get(key) {
    const entry = JSON.parse(localStorage.getItem(key));
    const now = Date.now();

    if (entry) {
      if (entry.expire > now) {
        return entry.value;
      }
      localStorage.removeItem(key);
    }
    return null;
  }
}
