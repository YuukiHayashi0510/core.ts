/**
 * Checks if a value is considered "empty".
 * A value is considered empty if it is:
 * - null or undefined
 * - an empty string
 * - the boolean false
 * - NaN (for numbers)
 * - BigInt(0)
 * - an empty symbol (Symbol())
 * - an empty array
 * - an object with no own enumerable properties
 *
 * @param value The value to check.
 * @returns true if the value is empty, false otherwise.
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  switch (typeof value) {
    case "string":
      return value.length === 0;
    case "boolean":
      return value === false;
    case "number":
      return isNaN(value);
    case "bigint":
      return BigInt(0) === value;
    case "symbol":
      return Symbol.prototype.toString.call(value) === "Symbol()";
    case "object":
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return Object.keys(value).length === 0;
    default:
      return false;
  }
}

/**
 * Checks if a value is not considered "empty".
 * See isEmpty for definition of "empty".
 * @param value The value to check.
 * @returns true if the value is not empty, false otherwise.
 */
export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

/**
 * Checks if any of the provided values are empty.
 * See isEmpty for definition of "empty".
 *
 * @param values The values to check.
 * @returns true if any value is empty, false otherwise.
 */
export function isAnyEmpty(...values: unknown[]): boolean {
  return values.some(isEmpty);
}

/**
 * Checks if all of the provided values are empty.
 * See isEmpty for definition of "empty".
 * @param values The values to check.
 * @returns true if all values are empty, false otherwise.
 */
export function isAllEmpty(...values: unknown[]): boolean {
  return values.every(isEmpty);
}
