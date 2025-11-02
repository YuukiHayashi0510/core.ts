import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { failure, isFailure, isSuccess, success } from "./result.ts";

describe("Result module", () => {
  describe("success", () => {
    describe("happy path", () => {
      it("should create a success result with the given value", () => {
        const result = success(42);
        assertEquals(result.data, 42);
      });
    });

    describe("edge case testing", () => {
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
