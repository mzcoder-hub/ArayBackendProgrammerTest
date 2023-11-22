// cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache();

module.exports = {
  deleteCache: (key) => {
    cache.del(String(key));
  },
  getFromCache: (key) => {
    const value = cache.get(String(key));
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  addToCache: (key, value) => {
    const stringValue = JSON.stringify(value);
    cache.set(String(key), stringValue);
  },
};
