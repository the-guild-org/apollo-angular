import 'vitest';
import type { TakeOptions } from '../test-utils/ObservableStream';

interface CustomMatchers<R = unknown> {
  toEmitAnything: (options?: TakeOptions) => Promise<R>;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
