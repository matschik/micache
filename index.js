export function createCache({ expireSec } = {}) {
  const cache = {};

  function setCache(key, data) {
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
  const cache = createCache({ expireSec });
  const promisesByCacheKey = {};

  const fetcherWithCache = async (cacheKey, ...args) => {
    const data = await fetcher(...args);
    cache.set(cacheKey, data);
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
    delete promisesByCacheKey[cacheKey];
    return data;
  };
}
