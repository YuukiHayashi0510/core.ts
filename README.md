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

// Wrap async calls to handle errors safely
const result = await wrapAsyncCall(async () => {
  await sleep(1000);
  return "Success!";
});

// Type-safe error handling
if (isSuccess(result)) {
  console.log(result.data); // "Success!"
} else {
  console.error(result.error.message);
}
```

## Benchmark

Coming soon...

<!-- TODO: 記載 -->
