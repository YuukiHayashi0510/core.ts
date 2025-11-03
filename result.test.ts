import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { failure, isFailure, isSuccess, success } from "./result.ts";

class CustomError extends Error {}

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
          name: "object value",
          value: { key: "value" },
          description: "will return the same object as data",
        },
        {
          name: "null value",
          value: null,
          description: "will return null as data",
        },
        {
          name: "undefined value",
          value: undefined,
          description: "will return undefined as data",
        },
      ];

      edgeCases.forEach(({ name, value, description }) => {
        it(`should handle ${name} - ${description}`, () => {
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
      const edgeCases = [
        {
          name: "object value",
          error: { message: "custom error occurred" },
          description: "will return the same object as error",
        },
        {
          name: "null value",
          error: null,
          description: "will return null as error",
        },
        {
          name: "undefined value",
          error: undefined,
          description: "will return undefined as error",
        },
        {
          name: "CustomError instance",
          error: new CustomError("custom error occurred"),
          description: "will return the CustomError instance as error",
        },
      ];

      edgeCases.forEach(({ name, error, description }) => {
        it(`should handle ${name} - ${description}`, () => {
          const result = failure(error as Error);
          assertEquals(result.error, error);
        });
      });
    });
  });

  describe("isSuccess", () => {
    describe("happy path", () => {
      const happyCases = [
        {
          name: "on success result",
          result: success(100),
          expected: true,
          description: "should return true for success result",
        },
        {
          name: "on failure result",
          result: failure(new Error("failure")),
          expected: false,
          description: "should return false for failure result",
        },
      ];

      happyCases.forEach(({ name, result, expected, description }) => {
        it(`should handle ${name} - ${description}`, () => {
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
          name: "on failure result",
          result: failure(new Error("failure")),
          expected: true,
          description: "should return true for failure result",
        },
        {
          name: "on success result",
          result: success(100),
          expected: false,
          description: "should return false for success result",
        },
      ];

      happyCases.forEach(({ name, result, expected, description }) => {
        it(`should handle ${name} - ${description}`, () => {
          assertEquals(isFailure(result), expected);
          assertEquals("error" in result, isFailure(result));
        });
      });
    });
  });
});
