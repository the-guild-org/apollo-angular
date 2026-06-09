import { TextDecoder, TextEncoder } from 'util';
import { parseJSON } from '../utils/index.cjs';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

it('support // comments', () => {
  expect(
    parseJSON(
      'file.json',
      `
    {
      "foo": {
        // "baz": true,
        "bar": true
      }
    }
  `,
    ),
  ).toEqual({
    foo: {
      bar: true,
    },
  });
});

it('support /* */ comments', () => {
  expect(
    parseJSON(
      'file.json',
      `
    {
      "foo": {
        /* "baz": true, */
        "bar": true
      }
    }
  `,
    ),
  ).toEqual({
    foo: {
      bar: true,
    },
  });
});
