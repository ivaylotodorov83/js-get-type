import { describe, it } from 'node:test'
import assert from 'node:assert'
import getType from '../src/index.js'

describe('Granular Type Checker Utility', () => {

    // 1. Primitives and special values (undefined, null, booleans, strings, bigint, symbols)
    describe('Primitives & Special Values', () => {
        it('should identify undefined', () => {
            assert.strictEqual(getType(undefined), 'undefined')
        })

        it('should identify null', () => {
            assert.strictEqual(getType(null), 'null')
        })

        it('should identify booleans', () => {
            assert.strictEqual(getType(true), 'boolean')
            assert.strictEqual(getType(false), 'boolean')
        })

        it('should identify strings', () => {
            assert.strictEqual(getType('hello'), 'string')
            assert.strictEqual(getType(''), 'string')
        })

        it('should identify bigints', () => {
            assert.strictEqual(getType(10n), 'bigint')
        })

        it('should identify symbols', () => {
            assert.strictEqual(getType(Symbol('test')), 'symbol')
        })
    })

    // 2. Number variants (standard numbers, NaN, positive and negative infinity)
    describe('Number Variants', () => {
        it('should identify standard numbers', () => {
            assert.strictEqual(getType(42), 'number')
            assert.strictEqual(getType(3.14), 'number')
            assert.strictEqual(getType(-0), 'number')
        })

        it('should identify NaN', () => {
            assert.strictEqual(getType(NaN), 'nan')
            assert.strictEqual(getType(0 / 0), 'nan')
        })

        it('should identify positive and negative infinity', () => {
            assert.strictEqual(getType(Infinity), 'infinity')
            assert.strictEqual(getType(1 / 0), 'infinity')
            assert.strictEqual(getType(-Infinity), '-infinity')
            assert.strictEqual(getType(-1 / 0), '-infinity')
        })
    })

    // 3. Functions and their specific variants (arrow, classes, async, generators)
    describe('Functions & Variants', () => {
        it('should identify standard and arrow functions', () => {
            assert.strictEqual(getType(function() {}), 'function')
            assert.strictEqual(getType(() => {}), 'function')
        })

        it('should identify classes as functions', () => {
            class TestClass {}
            assert.strictEqual(getType(TestClass), 'function')
        })

        it('should identify async functions', () => {
            assert.strictEqual(getType(async function() {}), 'asyncfunction')
            assert.strictEqual(getType(async () => {}), 'asyncfunction')
        })

        it('should identify generator functions', () => {
            assert.strictEqual(getType(function*() {}), 'generatorfunction')
        })

        it('should identify async generator functions', () => {
            assert.strictEqual(getType(async function*() {}), 'asyncgeneratorfunction')
        })
    })

    // 4. Objects, collections, arrays, buffers, and specialized structures
    describe('Objects & Built-in Collections', () => {
        it('should identify plain objects', () => {
            assert.strictEqual(getType({}), 'object')
            assert.strictEqual(getType({ a: 1 }), 'object')
            assert.strictEqual(getType(Object.create(null)), 'object')
        })

        it('should identify arrays and array-like structures', () => {
            assert.strictEqual(getType([]), 'array')
            assert.strictEqual(getType([1, 2, 3]), 'array')

            class CustomArray extends Array {}
            assert.strictEqual(getType(new CustomArray()), 'array')

            function testArgs() {
                assert.strictEqual(getType(arguments), 'arguments')
            }
            testArgs()
        })

        it('should identify generator instances', () => {
            function* genFunc() { yield 1; }
            assert.strictEqual(getType(genFunc()), 'generator')
        })

        it('should identify maps and sets', () => {
            assert.strictEqual(getType(new Map()), 'map')
            assert.strictEqual(getType(new Set()), 'set')
            assert.strictEqual(getType(new WeakMap()), 'weakmap')
            assert.strictEqual(getType(new WeakSet()), 'weakset')
        })

        it('should identify dates and regexps', () => {
            assert.strictEqual(getType(new Date()), 'date')
            assert.strictEqual(getType(/abc/), 'regexp')
        })

        it('should identify promises', () => {
            assert.strictEqual(getType(Promise.resolve()), 'promise')
        })

        it('should identify binary buffers and views (including all TypedArrays)', () => {
            assert.strictEqual(getType(new ArrayBuffer(8)), 'arraybuffer')
            assert.strictEqual(getType(new SharedArrayBuffer(8)), 'sharedarraybuffer')
            assert.strictEqual(getType(new DataView(new ArrayBuffer(8))), 'dataview')

            // Full coverage of all TypedArrays
            assert.strictEqual(getType(new Int8Array()), 'int8array')
            assert.strictEqual(getType(new Uint8Array()), 'uint8array')
            assert.strictEqual(getType(new Uint8ClampedArray()), 'uint8clampedarray')
            assert.strictEqual(getType(new Int16Array()), 'int16array')
            assert.strictEqual(getType(new Uint16Array()), 'uint16array')
            assert.strictEqual(getType(new Int32Array()), 'int32array')
            assert.strictEqual(getType(new Uint32Array()), 'uint32array')
            assert.strictEqual(getType(new Float32Array()), 'float32array')
            assert.strictEqual(getType(new Float64Array()), 'float64array')
            assert.strictEqual(getType(new BigInt64Array()), 'bigint64array')
            assert.strictEqual(getType(new BigUint64Array()), 'biguint64array')
        })

        it('should identify weak refs', () => {
            assert.strictEqual(getType(new WeakRef({})), 'weakref')
        })
    })

    // 5. Built-in error classes (Error subclasses)
    describe('Error Subclasses', () => {
        it('should identify granular error types', () => {
            assert.strictEqual(getType(new Error()), 'error')
            assert.strictEqual(getType(new TypeError()), 'typeerror')
            assert.strictEqual(getType(new RangeError()), 'rangeerror')
            assert.strictEqual(getType(new ReferenceError()), 'referenceerror')
            assert.strictEqual(getType(new SyntaxError()), 'syntaxerror')
            assert.strictEqual(getType(new EvalError()), 'evalerror')
            assert.strictEqual(getType(new URIError()), 'urierror')
            assert.strictEqual(getType(new AggregateError([])), 'aggregateerror')
        })
    })

    // 6. Safety and edge cases (active proxies, revoked proxies, and robustness)
    describe('Safety & Edge Cases', () => {
        it('should handle active proxies transparently', () => {
            const proxyArray = new Proxy([], {})
            const proxyObj = new Proxy({}, {})
            assert.strictEqual(getType(proxyArray), 'array')
            assert.strictEqual(getType(proxyObj), 'object')
        })

        it('should handle revoked proxies safely without crashing', () => {
            const target = {}
            const proxyData = Proxy.revocable(target, {})
            proxyData.revoke()

            assert.strictEqual(getType(proxyData.proxy), 'object')
        })
    })
})
