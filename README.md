# core.ts

My favorite ts utility.

[![Publish](https://github.com/YuukiHayashi0510/core.ts/actions/workflows/publish.yaml/badge.svg)](https://github.com/YuukiHayashi0510/core.ts/actions/workflows/publish.yaml)

## Installation

```sh
npx jsr add @yuukihayashi0510/core
```

Published to [JSR](https://jsr.io/@yuukihayashi0510/core)

## Usage

```ts
import { isSuccess, wrapAsyncCall } from "@yuukihayashi0510/core";

// Simple async function example
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// Success case: Wrap async calls to handle errors safely
const result1 = await wrapAsyncCall(async () => {
  await sleep(1000);
  return "Success!";
});

if (isSuccess(result1)) {
  console.log(result1.data); // "Success!"
} else {
  console.error(result1.error.message);
}

// Failure case: Errors are caught and wrapped in a Failure result
const result2 = await wrapAsyncCall(async () => {
  await sleep(500);
  throw new Error("Something went wrong!");
});

if (isSuccess(result2)) {
  console.log(result2.data);
} else {
  console.error(result2.error.message); // "Something went wrong!"
}

```

## Benchmark

Coming soon...
