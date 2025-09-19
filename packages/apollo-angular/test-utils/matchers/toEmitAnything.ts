/**
 * Adapted from
 *  https://github.com/apollographql/apollo-client/blob/1d165ba37eca7e5d667055553aacc4c26be56065/src/testing/matchers/toEmitAnything.ts
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Apollo Graph, Inc. (Formerly Meteor Development Group, Inc.)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { ObservableStream, TakeOptions } from 'test-utils/ObservableStream';
import { RawMatcherFn } from '@vitest/expect';

export const toEmitAnything: RawMatcherFn = async function toEmitAnything(
  actual,
  options?: TakeOptions,
) {
  const stream = actual as ObservableStream<any>;
  const hint = this.utils.matcherHint('toEmitAnything', 'stream');

  try {
    const value = await stream.peek(options);

    return {
      pass: true,
      message: () => {
        return (
          hint +
          '\n\nExpected stream not to emit anything but it did.' +
          '\n\nReceived:\n' +
          this.utils.printReceived(value)
        );
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Timeout waiting for next event') {
      return {
        pass: false,
        message: () => hint + '\n\nExpected stream to emit an event but it did not.',
      };
    } else {
      throw error;
    }
  }
};
