import createCache from "./createCache.js";

export default function createAsyncCache(fetcher, { expireSec, useUniqueKey = false } = {}) {
    const cache = createCache({ expireSec });
    const promisesByCacheKey = {};
  
    const fetcherWithCache = async (cacheKey, ...args) => {
      const data = await fetcher(...args);
      cache.set(cacheKey, data);
      return data;
    };
  
    return async (...fetcherArgs) => {
      let cacheKey = "c"
      if(!useUniqueKey){
        cacheKey = JSON.stringify(fetcherArgs);
      }
  
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