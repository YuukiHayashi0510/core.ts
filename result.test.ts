import { describe, it } from "@std/testing/bdd";
import { assert, assertEquals, assertExists } from "@std/assert";
import {
  failure,
  isFailure,
  isSuccess,
  success,
  wrapAsyncCall,
} from "./result.ts";

describe("Result module", () => {
  describe("success", () => {
    describe("happy path", () => {
      it("should create a success result with the given value", () => {
        const result = success(42);
        assertEquals(result.data, 42);
      });
    });

    describe("edge case", () => {
      const edgeCases = [
        {
          outline: "object value",
          value: { key: "value" },
          detail: "will return the same object as data",
        },
        {
          outline: "null value",
          value: null,
          detail: "will return null as data",
        },
        {
          outline: "undefined value",
          value: undefined,
          detail: "will return undefined as data",
        },
      ];

      edgeCases.forEach(({ outline, value, detail }) => {
        it(`should handle ${outline} - ${detail}`, () => {
          const result = success(value);
          assertEquals(result.data, value);
        });
      });
    });
  });

  describe("failure", () => {
    describe("happy path", () => {
      it("should create a failure result with the given error", () => {
        const error = new Error("test error");
        const result = failure(error);
        assertEquals(result.error, error);
        assertEquals(result.error.message, "test error");
      });
    });

    describe("edge case", () => {
      class CustomError extends Error {}

      const edgeCases = [
        {
          outline: "object value",
          error: { message: "custom error occurred" } as Error,
          detail: "will return the same object as error",
        },
        {
          outline: "null value",
          error: null as unknown as Error,
          detail: "will return null as error",
        },
        {
          outline: "undefined value",
          error: undefined as unknown as Error,
          detail: "will return undefined as error",
        },
        {
          outline: "CustomError instance",
          error: new CustomError("custom error occurred"),
          detail: "will return the CustomError instance as error",
        },
      ];

      edgeCases.forEach(({ outline, error, detail }) => {
        it(`should handle ${outline} - ${detail}`, () => {
          const result = failure(error);
          assertEquals(result.error, error);
        });
      });
    });
  });

  describe("isSuccess", () => {
    describe("happy path", () => {
      const happyCases = [
        {
          outline: "on success result",
          result: success(100),
          expected: true,
          detail: "should return true for success result",
        },
        {
          outline: "on failure result",
          result: failure(new Error("failure")),
          expected: false,
          detail: "should return false for failure result",
        },
      ];

      happyCases.forEach(({ outline, result, expected, detail }) => {
        it(`should handle ${outline} - ${detail}`, () => {
          assertEquals(isSuccess(result), expected);
          assertEquals("data" in result, isSuccess(result));
        });
      });
    });
  });

  describe("isFailure", () => {
    describe("happy path", () => {
      const happyCases = [
        {
          outline: "on failure result",
          result: failure(new Error("failure")),
          expected: true,
          detail: "should return true for failure result",
        },
        {
          outline: "on success result",
          result: success(100),
          expected: false,
          detail: "should return false for success result",
        },
      ];

      happyCases.forEach(({ outline, result, expected, detail }) => {
        it(`should handle ${outline} - ${detail}`, () => {
          assertEquals(isFailure(result), expected);
          assertEquals("error" in result, isFailure(result));
        });
      });
    });

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
        const result = await wrapAsyncCall(() =>
          Promise.reject("string error")
        );

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
  });
});
