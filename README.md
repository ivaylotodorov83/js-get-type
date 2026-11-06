# js-get-type

A clean, high-performance, and zero-dependency JavaScript type-checking utility.

> **Note:** I didn't build this to compete with anyone — just made it for fun 😊

## Features

- **Blazing Fast:** Optimized for maximum execution speed.
- **Zero Dependencies:** Pure JavaScript with no external dependencies.
- **Granular Detection:** Accurately identifies primitives, objects, arrays, and functions.
- **Safe & Robust:** Handles edge cases like proxies and null-prototype objects reliably.

## Installation

This utility is structured as a modern ES module. You can copy `src/index.js` directly into your project.

```javascript
import getType from './src/index.js';
```

## Usage

```javascript
import getType from './src/index.js';

// Primitives & Special Numbers
getType(undefined);          // 'undefined'
getType(null);               // 'null'
getType(10);                 // 'number'
getType(NaN);                // 'nan'
getType(Infinity);           // 'infinity'
getType(-Infinity);          // '-infinity'
getType('hello');            // 'string'
getType(10n);                // 'bigint'
getType(Symbol('id'));       // 'symbol'

// Functions
getType(function() {});      // 'function'
getType(() => {});           // 'function'
getType(async () => {});     // 'asyncfunction'
getType(function*() {});     // 'generatorfunction'

// Objects & Collections
getType({});                 // 'object'
getType([]);                 // 'array'
getType(new Map());          // 'map'
getType(new Set());          // 'set'
getType(Promise.resolve());  // 'promise'
getType(new Uint8Array());   // 'uint8array'

// Errors
getType(new Error());        // 'error'
getType(new TypeError());    // 'typeerror'
getType(new RangeError());   // 'rangeerror'
```

## Supported Types Reference

| Category | Input Example | Returned String |
| :--- | :--- | :--- |
| **Primitives** | `undefined`, `null`, `true`, `'text'`, `10n`, `Symbol()` | `undefined`, `null`, `boolean`, `string`, `bigint`, `symbol` |
| **Numbers** | `10`, `NaN`, `Infinity`, `-Infinity` | `number`, `nan`, `infinity`, `-infinity` |
| **Functions** | `() => {}`, `async () => {}`, `function*() {}` | `function`, `asyncfunction`, `generatorfunction`, `asyncgeneratorfunction` |
| **Objects** | `{}`, `[]`, `new Map()`, `new Set()`, `/abc/` | `object`, `array`, `map`, `set`, `regexp`, `date`, `promise` |
| **Typed Arrays** | `new Uint8Array()`, `new Float32Array()` | `uint8array`, `float32array`, etc. |
| **Errors** | `new Error()`, `new TypeError()` | `error`, `typeerror`, `rangeerror`, `syntaxerror`, etc. |

## Running Tests

The test suite uses the built-in Node.js test runner (`node:test` and `node:assert`) for development and CI testing.

To run the test suite, use:

```bash
npm test
```

## Requirements

- Node.js `>= 18.0.0` (required **only** for running the test suite).

## License

[MIT](LICENSE)
