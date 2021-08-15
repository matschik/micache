export function createCache() {
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

export function createAsyncCache(fetcher, { expireSec } = {}) {
  const cache = createCache();
  const promisesByCacheKey = {};

  const fetcherWithCache = async (cacheKey, ...args) => {
    const data = await fetcher(...args);
    cache.set(cacheKey, data, { expireSec });
    return data;
  };

  return async (...fetcherArgs) => {
    const cacheKey = JSON.stringify(fetcherArgs);

    let data = cache.get(cacheKey);
    if (data) {
      return data;
    }

    if (!promisesByCacheKey[cacheKey]) {
      promisesByCacheKey[cacheKey] = fetcherWithCache(cacheKey, ...fetcherArgs);
    }

    data = await promisesByCacheKey[cacheKey];
    return data;
  };
}
