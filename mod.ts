/**
 * core
 *
 * Barrel module: re-exports the public API of the package. Detailed
 * documentation and examples live in the implementation files (e.g.
 * `./result.ts`) so IDEs and `deno doc` can surface accurate information.
 *
 * @module core
 */
export {
  type AsyncResult,
  failure,
  isFailure,
  isSuccess,
  type Result,
  success,
  wrapAsyncCall,
} from "./result.ts";
