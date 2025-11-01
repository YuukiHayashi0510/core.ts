import { assertEquals, assertStrictEquals } from "@std/assert";
import { failure, isFailure, isSuccess, success } from "./result.ts";

Deno.test("success() creates a success result with correct data and tag", () => {
  const value = 42;
  const result = success(value);

  // Verify the data property exists and has the correct value
  assertEquals(result.data, value);

  // Verify it's recognized as a success
  assertEquals(isSuccess(result), true);
  assertEquals(isFailure(result), false);
});

Deno.test("success() works with different data types", () => {
  // Test with string
  const stringResult = success("hello");
  assertEquals(stringResult.data, "hello");

  // Test with object
  const objectResult = success({ key: "value" });
  assertEquals(objectResult.data, { key: "value" });

  // Test with null
  const nullResult = success(null);
  assertStrictEquals(nullResult.data, null);

  // Test with undefined
  const undefinedResult = success(undefined);
  assertStrictEquals(undefinedResult.data, undefined);
});

Deno.test("failure() creates a failure result with correct error and tag", () => {
  const error = new Error("test error");
  const result = failure(error);

  // Verify the error property exists and has the correct value
  assertStrictEquals(result.error, error);

  // Verify it's recognized as a failure
  assertEquals(isFailure(result), true);
  assertEquals(isSuccess(result), false);
});

Deno.test("failure() works with custom error types", () => {
  class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "CustomError";
    }
  }

  const customError = new CustomError("custom error message");
  const result = failure(customError);

  assertEquals(result.error, customError);
  assertEquals(result.error.name, "CustomError");
  assertEquals(result.error.message, "custom error message");
});

Deno.test("isSuccess() correctly identifies success results", () => {
  const successResult = success(100);
  const failureResult = failure(new Error("error"));

  assertEquals(isSuccess(successResult), true);
  assertEquals(isSuccess(failureResult), false);
});

Deno.test("isSuccess() enables type narrowing", () => {
  const result = Math.random() > 0.5
    ? success(42)
    : failure(new Error("error"));

  if (isSuccess(result)) {
    // TypeScript should narrow the type to Success<number>
    // We can access .data without type errors
    const data: number = result.data;
    assertEquals(typeof data, "number");
  } else {
    // TypeScript should narrow the type to Failure<Error>
    // We can access .error without type errors
    const error: Error = result.error;
    assertEquals(error instanceof Error, true);
  }
});

Deno.test("isFailure() correctly identifies failure results", () => {
  const successResult = success("test");
  const failureResult = failure(new Error("error"));

  assertEquals(isFailure(failureResult), true);
  assertEquals(isFailure(successResult), false);
});

Deno.test("isFailure() enables type narrowing", () => {
  const result = Math.random() > 0.5
    ? success("hello")
    : failure(new Error("error"));

  if (isFailure(result)) {
    // TypeScript should narrow the type to Failure<Error>
    // We can access .error without type errors
    const error: Error = result.error;
    assertEquals(error instanceof Error, true);
  } else {
    // TypeScript should narrow the type to Success<string>
    // We can access .data without type errors
    const data: string = result.data;
    assertEquals(typeof data, "string");
  }
});

Deno.test("success and failure results are mutually exclusive", () => {
  const successResult = success(123);
  const failureResult = failure(new Error("error"));

  // A success result should not be a failure
  assertEquals(isSuccess(successResult), true);
  assertEquals(isFailure(successResult), false);

  // A failure result should not be a success
  assertEquals(isSuccess(failureResult), false);
  assertEquals(isFailure(failureResult), true);
});
