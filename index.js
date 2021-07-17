export default function createCache() {
  const cache = {};

  function setCache(key, data, { expireSec } = {}) {
    cache[key] = {
      created: new Date().getTime(),
      expireSec,
      data,
    };
  }

  function getCache(key) {
    if (
      cache[key] &&
      cache[key].expireSec &&
      new Date().getTime() - cache[key].created >= cache[key].expireSec * 1000
    ) {
      deleteKey(key);
    }

    return cache[key]?.data;
  }

  function deleteKey(key) {
    delete cache[key];
  }

  return {
    set: setCache,
    get: getCache,
    delete: deleteKey,
  };
}
