import { describe, it } from "@std/testing/bdd";
import { assert, assertEquals, assertExists } from "@std/assert";
import { isFailure, isSuccess, wrapAsyncCall } from "./result.ts";

describe("wrapAsyncCall", () => {
  it("should wrap a successful async call", async () => {
    const result = await wrapAsyncCall(() => Promise.resolve(42));

    assertExists(result);
    assert(isSuccess(result));
    assertEquals(result.data, 42);
  });

  it("should handle Error instances", async () => {
    const expectedError = new Error("test error");
    const result = await wrapAsyncCall(() => Promise.reject(expectedError));

    assertExists(result);
    assert(isFailure(result));
    assertEquals(result.error, expectedError);
  });

  it("should convert non-Error thrown values to Error", async () => {
    const result = await wrapAsyncCall(() => Promise.reject("string error"));

    assertExists(result);
    assert(isFailure(result));
    assert(result.error instanceof Error);
    assertEquals(result.error.message, "string error");
  });

  it("should call cleanup function on success", async () => {
    let cleanupCalled = false;
    const cleanup = () => {
      cleanupCalled = true;
    };

    const result = await wrapAsyncCall(() => Promise.resolve(42), cleanup);

    assert(cleanupCalled);
    assert(isSuccess(result));
  });

  it("should call cleanup function on failure", async () => {
    let cleanupCalled = false;
    const cleanup = () => {
      cleanupCalled = true;
    };

    const result = await wrapAsyncCall(
      () => Promise.reject(new Error("test")),
      cleanup,
    );

    assert(cleanupCalled);
    assert(isFailure(result));
  });

  it("should call cleanup function exactly once", async () => {
    let cleanupCallCount = 0;
    const cleanup = () => {
      cleanupCallCount++;
    };

    await wrapAsyncCall(() => Promise.resolve(42), cleanup);

    assertEquals(cleanupCallCount, 1);
  });
});
