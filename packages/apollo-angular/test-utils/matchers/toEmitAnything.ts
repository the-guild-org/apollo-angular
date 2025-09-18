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
