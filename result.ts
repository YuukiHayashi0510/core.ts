// Unique symbol to tag the result types
const TAG: unique symbol = Symbol("ResultTag");

// Define the Success and Failure types
type Success<T> = { data: T } & { [TAG]: "success" };
type Failure<E extends Error> = { error: E } & { [TAG]: "failure" };

/**
 * Result<T, E>
 *
 * A discriminated union representing either a successful value or a
 * failure error. Implemented as:
 *  - Success<T> = { data: T, [TAG]: "success" }
 *  - Failure<E> = { error: E, [TAG]: "failure" }
 *
 * Keep this as the single source of truth for the Result shape so IDEs and
 * `deno doc` pick up accurate documentation.
 */
export type Result<T, E extends Error> = Success<T> | Failure<E>;

/**
 * AsyncResult<T, E>
 *
 * A Promise that resolves to a Result. Useful for async APIs that prefer
 * explicit result values over throwing exceptions.
 *
 * Equivalent to: Promise<Result<T, E>>
 */
export type AsyncResult<T, E extends Error> = Promise<Result<T, E>>;

/**
 * Create a success result.
 *
 * Example:
 * ```ts
 * const r = success(42); // { data: 42, [TAG]: "success" }
 * ```
 *
 * @param value The value to include in the success result.
 * @returns Success<T>
 */
export function success<T>(value: T): Success<T> {
  return { data: value, [TAG]: "success" };
}

/**
 * Create a failure result.
 *
 * Example:
 * ```ts
 * const r = failure(new Error("bad")); // { error: Error, [TAG]: "failure" }
 * ```
 *
 * @param value The error to include in the failure result.
 * @returns Failure<E>
 */
export function failure<E extends Error>(value: E): Failure<E> {
  return { error: value, [TAG]: "failure" };
}

/**
 * Type guard: isSuccess(result)
 *
 * Narrows a Result<T, E> to Success<T>.
 *
 * @param result The result to check.
 * @returns true if result is Success<T>
 */
export function isSuccess<T, E extends Error>(
  result: Result<T, E>,
): result is Success<T> {
  return result[TAG] === "success";
}

/**
 * Type guard: isFailure(result)
 *
 * Narrows a Result<T, E> to Failure<E>.
 *
 * @param result The result to check.
 * @returns true if result is Failure<E>
 */
export function isFailure<T, E extends Error>(
  result: Result<T, E>,
): result is Failure<E> {
  return result[TAG] === "failure";
}

/**
 * Wrap an async function call into an AsyncResult.
 * @param fn The async function to call.
 * @param cleanup Optional cleanup function to call after completion.
 * @returns {AsyncResult<T, E>} The result of the async call wrapped in an AsyncResult.
 */
export function wrapAsyncCall<T, E extends Error>(
  fn: () => Promise<T>,
  cleanup?: () => void,
): AsyncResult<T, E> {
  return fn()
    .then(success)
    .catch(failure)
    .finally(cleanup);
}
