import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { isAllEmpty, isAnyEmpty, isEmpty, isNotEmpty } from "./empty.ts";

describe("Empty module", () => {
  describe("isEmpty", () => {
    const cases = [
      { value: null, expected: true },
      { value: undefined, expected: true },
      { value: "", expected: true },
      { value: "non-empty", expected: false },
      { value: false, expected: true },
      { value: true, expected: false },
      { value: NaN, expected: true },
      { value: 0, expected: false },
      { value: BigInt(0), expected: true },
      { value: BigInt(10), expected: false },
      { value: Symbol(), expected: true },
      { value: Symbol("desc"), expected: false },
      { value: [], expected: true },
      { value: [1, 2], expected: false },
      { value: {}, expected: true },
      { value: { key: "value" }, expected: false },
    ];

    cases.forEach(({ value, expected }) => {
      it(`should return ${expected} for isEmpty(${String(value)}) typeof ${typeof value}`, () => {
        const result = isEmpty(value);
        assertEquals(result, expected);
      });
    });
  });

  describe("isNotEmpty", () => {
    it("should return the negation of isEmpty", () => {
      const testValues = [null, undefined, "", "text", false, true, [], [1], {}, { a: 1 }];
      testValues.forEach((value) => {
        assertEquals(!isEmpty(value), isNotEmpty(value));
      });
    });
  });

  describe("isAnyEmpty", () => {
    const cases = [
      { values: [1, 2, 3], expected: false },
      { values: [1, null, 3], expected: true },
      { values: ["", "text"], expected: true },
      { values: [true, false], expected: true },
      { values: [{}, { key: "value" }], expected: true },
      { values: [[1], [2, 3]], expected: false },
    ];

    cases.forEach(({ values, expected }) => {
      it(`should return ${expected} for isAnyEmpty(${values})`, () => {
        const result = isAnyEmpty(...values);
        assertEquals(result, expected);
      });
    });
  });

  describe("isAllEmpty", () => {
    const cases = [
        { values: [null, undefined, ""], expected: true },
        { values: [null, "text", ""], expected: false },
        { values: [false, NaN, BigInt(0)], expected: true },
        { values: [false, true, NaN], expected: false },
        { values: [[], {}], expected: true },
        { values: [[], { key: "value" }], expected: false },
      ];

    cases.forEach(({ values, expected }) => {
      it(`should return ${expected} for isAllEmpty(${values})`, () => {
        const result = isAllEmpty(...values);
        assertEquals(result, expected);
      });
    });
  });
});