# Micache ⚡

> Simple cache & caching fetched data strategy

[![npm version](https://badge.fury.io/js/micache.svg)](https://badge.fury.io/js/micache)

🪶 Lightweight, 0% dependencies

## `createCache`

### Simple cache

```js
import { createCache } from "micache";

const myCache = createCache();

myCache.set("123", { name: "Denji" });
myCache.get("123"); // { name: "Denji" }
```

### Cache with expiring keys

```js
import { createCache } from "micache";

const myTemporaryCache = createCache({ expireSec: 30 });

myTemporaryCache.set("567", { name: "Power" });
myTemporaryCache.get("567"); // { name: "Power" }
// 30 seconds later ...
myTemporaryCache.get("567"); // undefined
```

## `createAsyncCache`

```js
import { createAsyncCache } from "micache";
import redaxios from "redaxios";

async function fetchPrice(fromCoinId, toCoinId){
  const response = await redaxios.get(
    "https://min-api.cryptocompare.com/data/pricemultifull",
    {
      params: {
        fsyms: fromCoinId,
        tsyms: toCoinId,
      },
    }
  );

  return response.data.RAW[fromCoinId][toCoinId].PRICE;
}

const getPrice = createAsyncCache(fetchPrice, { expireSec: 30 });

let price = await getPrice("btc", "usd"); // 46201,98
price = await getPrice("btc", "usd"); // very fast with cache => 46201,98
// 30 seconds later ...
price = await getPrice("btc", "usd"); // 46337,73
```
