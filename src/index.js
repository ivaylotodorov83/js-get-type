/**
 * @file js-get-type
 * @description High-performance, granular JavaScript type-checking utility.
 * Handles primitives, special numeric values, function variants, arrays, error subclasses, and complex objects.
 *
 * @version 1.0.0
 * @author Ivaylo Todorov
 * @license MIT
 *
 * @param {*} x - The value to inspect
 * @returns {string} - The lowercase string representation of the type
 */
export default (x) => {
    if (x === undefined) return 'undefined'
    if (x === null) return 'null'

    const type = typeof x

    switch (type) {
        case 'boolean':
        case 'string':
        case 'bigint':
        case 'symbol':
            return type

        case 'number':
            if (Number.isNaN(x)) return 'nan'
            if (!Number.isFinite(x)) {
                return x > 0 ? 'infinity' : '-infinity'
            }
            return 'number'

        case 'function': {
            try {
                let tag = Object.prototype.toString.call(x)

                switch (tag) {
                    case '[object AsyncFunction]': return 'asyncfunction'
                    case '[object GeneratorFunction]': return 'generatorfunction'
                    case '[object AsyncGeneratorFunction]': return 'asyncgeneratorfunction'
                    default: return 'function'
                }
            } catch {
                return 'function'
            }
        }

        case 'object': {
            try {
                if (Array.isArray(x)) return 'array'

                let tag = Object.prototype.toString.call(x)

                switch (tag) {
                    case '[object Object]': return 'object'
                    case '[object Promise]': return 'promise'
                    case '[object Error]':
                        return x.constructor && x.constructor.name
                            ? x.constructor.name.toLowerCase()
                            : 'error'
                    case '[object Map]': return 'map'
                    case '[object Set]': return 'set'
                    case '[object Date]': return 'date'
                    case '[object RegExp]': return 'regexp'
                    case '[object ArrayBuffer]': return 'arraybuffer'
                    case '[object SharedArrayBuffer]': return 'sharedarraybuffer'
                    case '[object DataView]': return 'dataview'
                    case '[object WeakMap]': return 'weakmap'
                    case '[object WeakSet]': return 'weakset'
                    case '[object WeakRef]': return 'weakref'
                    case '[object Uint8Array]': return 'uint8array'
                    case '[object Uint8ClampedArray]': return 'uint8clampedarray'
                    case '[object Uint16Array]': return 'uint16array'
                    case '[object Uint32Array]': return 'uint32array'
                    case '[object Int8Array]': return 'int8array'
                    case '[object Int16Array]': return 'int16array'
                    case '[object Int32Array]': return 'int32array'
                    case '[object Float32Array]': return 'float32array'
                    case '[object Float64Array]': return 'float64array'
                    case '[object BigInt64Array]': return 'bigint64array'
                    case '[object BigUint64Array]': return 'biguint64array'
                    case '[object Arguments]': return 'arguments'
                    default:
                        return tag.slice(8, -1).toLowerCase()
                }
            } catch {
                return 'object'
            }
        }

        default:
            return type
    }
}
