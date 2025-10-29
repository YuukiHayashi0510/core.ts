import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import {
  failure,
  isFailure,
  isSuccess,
  success,
} from "./result.ts";

describe("Result module", () => {
  describe("success", () => {
    it("should create a success result with the given value", () => {
      const result = success(42);
      assertEquals(result.data, 42);
    });
  });

  describe("failure", () => {
    it("should create a failure result with the given error", () => {
      const error = new Error("test error");
      const result = failure(error);
      assertEquals(result.error, error);
      assertEquals(result.error.message, "test error");
    });
  });

  describe("isSuccess", () => {
    it("should return true for success result", () => {
      const result = success(42);
      assertEquals(isSuccess(result), true);
    });

    it("should return false for failure result", () => {
      const result = failure(new Error("test"));
      assertEquals(isSuccess(result), false);
    });
  });

  describe("isFailure", () => {
    it("should return true for failure result", () => {
      const result = failure(new Error("test"));
      assertEquals(isFailure(result), true);
    });

    it("should return false for success result", () => {
      const result = success(42);
      assertEquals(isFailure(result), false);
    });
  });
});
