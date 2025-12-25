const cache = new Map();
const DEFAULT_TTL = 60 * 1000; // 1 minute

export const apiCache = {
  get: (key) => {
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    return item.data;
  },
  
  set: (key, data, ttl = DEFAULT_TTL) => {
    cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  },
  
  clear: () => cache.clear(),
};
