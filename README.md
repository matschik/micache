# Micache

> Simple cache & caching fetched data strategy

[![npm version](https://badge.fury.io/js/micache.svg)](https://badge.fury.io/js/micache)

## `createCache`

```js
import { createCache } from "micache";

const myCache = createCache();

myCache.set("123", { name: "Denji" });
myCache.get("123"); // { name: "Denji" }

myCache.set("567", { isTemporary: true }, { expireSec: 30 });
myCache.get("567"); // { isTemporary: true }
// 30 seconds later ...
myCache.get("567"); // undefined
```

## `createAsyncCache`

```js
import { createAsyncCache } from "micache";
import redaxios from "redaxios";

const getPrice = createAsyncCache(
  async (fromCoinId, toCoinId) => {
    fromCoinId = fromCoinId.toUpperCase();
    toCoinId = toCoinId.toUpperCase();

    const toAmountRes = await redaxios.get(
      "https://min-api.cryptocompare.com/data/pricemultifull",
      {
        params: {
          fsyms: fromCoinId,
          tsyms: toCoinId,
        },
      }
    );

    const toAmount = toAmountRes.data.RAW[fromCoinId][toCoinId].PRICE;
    const displayAmount = toAmount.toFixed(2);
    return displayAmount;
  },
  { expireSec: 30 }
);

let price = await getPrice("btc", "usd"); // 46201,98
// 30 seconds later ...
price = await getPrice("btc", "usd"); // 46337,73
```
