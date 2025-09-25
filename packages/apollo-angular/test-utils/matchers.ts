import { expect } from 'vitest';
import { toEmitAnything } from './matchers/toEmitAnything';

expect.extend({
  toEmitAnything,
});
