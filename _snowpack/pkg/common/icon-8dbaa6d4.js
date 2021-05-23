import { r as react } from './index-404563d3.js';
import { c as createCommonjsModule, a as commonjsGlobal } from './_commonjsHelpers-798ad6a7.js';

// Number assertions
function isNumber(value) {
  return typeof value === "number";
}
function isNotNumber(value) {
  return typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isFunction(value) {
  return typeof value === "function";
} // Generic assertions

function isObject(value) {
  var type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}
function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0;
}
function isNull(value) {
  return value == null;
} // String assertions

function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}
function isCssVar(value) {
  return /^var\(--.+\)$/.test(value);
} // Empty assertions
var __DEV__ = "production" !== "production";
function isRefObject(val) {
  return "current" in val;
}

var lodash_mergewith = createCommonjsModule(function (module, exports) {
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeMax = Math.max,
    nativeNow = Date.now;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = mergeWith;
});

function omit(object, keys) {
  var result = {};
  Object.keys(object).forEach(key => {
    if (keys.includes(key)) return;
    result[key] = object[key];
  });
  return result;
}
function pick(object, keys) {
  var result = {};
  keys.forEach(key => {
    if (key in object) {
      result[key] = object[key];
    }
  });
  return result;
}
function split(object, keys) {
  var picked = {};
  var omitted = {};
  Object.keys(object).forEach(key => {
    if (keys.includes(key)) {
      picked[key] = object[key];
    } else {
      omitted[key] = object[key];
    }
  });
  return [picked, omitted];
}
/**
 * Get value from a deeply nested object using a string path.
 * Memoizes the value.
 * @param obj - the object
 * @param path - the string path
 * @param def  - the fallback value
 */

function get(obj, path, fallback, index) {
  var key = typeof path === "string" ? path.split(".") : [path];

  for (index = 0; index < key.length; index += 1) {
    if (!obj) break;
    obj = obj[key[index]];
  }

  return obj === undefined ? fallback : obj;
}
var memoize = fn => {
  var cache = new WeakMap();

  var memoizedFn = (obj, path, fallback, index) => {
    if (typeof obj === "undefined") {
      return fn(obj, path, fallback);
    }

    if (!cache.has(obj)) {
      cache.set(obj, new Map());
    }

    var map = cache.get(obj);

    if (map.has(path)) {
      return map.get(path);
    }

    var value = fn(obj, path, fallback, index);
    map.set(path, value);
    return value;
  };

  return memoizedFn;
};
var memoizedGet = memoize(get);

/**
 * Returns the items of an object that meet the condition specified in a callback function.
 *
 * @param object the object to loop through
 * @param fn The filter function
 */
function objectFilter(object, fn) {
  var result = {};
  Object.keys(object).forEach(key => {
    var value = object[key];
    var shouldPass = fn(value, key, object);

    if (shouldPass) {
      result[key] = value;
    }
  });
  return result;
}
var filterUndefined = object => objectFilter(object, val => val !== null && val !== undefined);
var objectKeys = obj => Object.keys(obj);
/**
 * Object.entries polyfill for Nodev10 compatibility
 */

var fromEntries = entries => entries.reduce((carry, _ref) => {
  var [key, value] = _ref;
  carry[key] = value;
  return carry;
}, {});

function getOwnerDocument(node) {
  var _node$ownerDocument;

  return node instanceof Element ? (_node$ownerDocument = node.ownerDocument) != null ? _node$ownerDocument : document : document;
}
function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
var isBrowser = canUseDOM();
var dataAttr = condition => condition ? "" : undefined;
var ariaAttr = condition => condition ? true : undefined;
var cx = function cx() {
  for (var _len = arguments.length, classNames = new Array(_len), _key = 0; _key < _len; _key++) {
    classNames[_key] = arguments[_key];
  }

  return classNames.filter(Boolean).join(" ");
};
function getActiveElement(node) {
  var doc = getOwnerDocument(node);
  return doc == null ? void 0 : doc.activeElement;
}
function contains(parent, child) {
  if (!parent) return false;
  return parent === child || parent.contains(child);
}
/**
 * Get the normalized event key across all browsers
 * @param event keyboard event
 */

function normalizeEventKey(event) {
  var {
    key,
    keyCode
  } = event;
  var isArrowKey = keyCode >= 37 && keyCode <= 40 && key.indexOf("Arrow") !== 0;
  var eventKey = isArrowKey ? "Arrow" + key : key;
  return eventKey;
}
function getRelatedTarget(event) {
  var _event$target, _ref, _event$relatedTarget;

  var target = (_event$target = event.target) != null ? _event$target : event.currentTarget;
  var activeElement = getActiveElement(target);
  var originalTarget = event.nativeEvent.explicitOriginalTarget;
  return (_ref = (_event$relatedTarget = event.relatedTarget) != null ? _event$relatedTarget : originalTarget) != null ? _ref : activeElement;
}
function isRightClick(event) {
  return event.button !== 0;
}

/* eslint-disable no-nested-ternary */
function runIfFn(valueOrFn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}
function callAllHandlers() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return function func(event) {
    fns.some(fn => {
      fn == null ? void 0 : fn(event);
      return event == null ? void 0 : event.defaultPrevented;
    });
  };
}
function once(fn) {
  var result;
  return function func() {
    if (fn) {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      result = fn.apply(this, args);
      fn = null;
    }

    return result;
  };
}
var noop = () => {};
var warn = once(options => () => {
  var {
    condition,
    message
  } = options;

  if (condition && __DEV__) {
    console.warn(message);
  }
});

var promiseMicrotask = callback => {
  Promise.resolve().then(callback);
};

var scheduleMicrotask =  typeof queueMicrotask === "function" ? queueMicrotask : promiseMicrotask;
var pipe = function pipe() {
  for (var _len6 = arguments.length, fns = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    fns[_key6] = arguments[_key6];
  }

  return v => fns.reduce((a, b) => b(a), v);
};

var analyzeCSSValue = value => {
  var num = parseFloat(value.toString());
  var unit = value.toString().replace(String(num), "");
  return {
    unitless: !unit,
    value: num,
    unit
  };
};

var px = value => {
  if (value == null) return value;
  var {
    unitless
  } = analyzeCSSValue(value);
  return unitless || isNumber(value) ? value + "px" : value;
};
var tokenToCSSVar = (scale, value) => theme => {
  var valueStr = String(value);
  var key = scale ? scale + "." + valueStr : valueStr;
  return isObject(theme.__cssMap) && key in theme.__cssMap ? theme.__cssMap[key].varRef : value;
};
function createTransform(options) {
  var {
    scale,
    transform,
    compose
  } = options;

  var fn = (value, theme) => {
    var _transform;

    var _value = tokenToCSSVar(scale, value)(theme);

    var result = (_transform = transform == null ? void 0 : transform(_value, theme)) != null ? _transform : _value;

    if (compose) {
      result = compose(result, theme);
    }

    return result;
  };

  return fn;
}

function toConfig(scale, transform) {
  return property => {
    var result = {
      property,
      scale
    };
    result.transform = createTransform({
      scale,
      transform
    });
    return result;
  };
}

var getRtl = (_ref) => {
  var {
    rtl,
    ltr
  } = _ref;
  return theme => theme.direction === "rtl" ? rtl : ltr;
};

function logical(options) {
  var {
    property,
    scale,
    transform
  } = options;
  return {
    scale,
    property: getRtl(property),
    transform: scale ? createTransform({
      scale,
      compose: transform
    }) : transform
  };
}

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function fractionalValue(value) {
  return !isNumber(value) || value > 1 ? value : value * 100 + "%";
}

var t = {
  borderWidths: toConfig("borderWidths"),
  borderStyles: toConfig("borderStyles"),
  colors: toConfig("colors"),
  borders: toConfig("borders"),
  radii: toConfig("radii", px),
  space: toConfig("space", px),
  spaceT: toConfig("space", px),
  prop: (property, scale, transform) => _extends({
    property,
    scale
  }, scale && {
    transform: createTransform({
      scale,
      transform
    })
  }),
  sizes: toConfig("sizes", px),
  sizesT: toConfig("sizes", fractionalValue),
  shadows: toConfig("shadows"),
  logical
};

function _wrapRegExp(re, groups) { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = _wrapNativeSuper(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } _inherits(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (typeof args[args.length - 1] !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var directionMap = {
  "to-t": "to top",
  "to-tr": "to top right",
  "to-r": "to right",
  "to-br": "to bottom right",
  "to-b": "to bottom",
  "to-bl": "to bottom left",
  "to-l": "to left",
  "to-tl": "to top left"
};
var valueSet = new Set(Object.values(directionMap));
var globalSet = new Set(["none", "-moz-initial", "inherit", "initial", "revert", "unset"]);

var trimSpace = str => str.trim();

function parseGradient(value, theme) {
  var _regex$exec$groups, _regex$exec;

  if (value == null || globalSet.has(value)) return value;

  var regex = /*#__PURE__*/_wrapRegExp(/(^[\x2DA-Za-z]+)\(((.*))\)/g, {
    type: 1,
    values: 2
  });

  var {
    type,
    values
  } = (_regex$exec$groups = (_regex$exec = regex.exec(value)) == null ? void 0 : _regex$exec.groups) != null ? _regex$exec$groups : {};
  if (!type || !values) return value;

  var _type = type.includes("-gradient") ? type : type + "-gradient";

  var [maybeDirection, ...stops] = values.split(",").map(trimSpace).filter(Boolean);
  if ((stops == null ? void 0 : stops.length) === 0) return value;
  var direction = maybeDirection in directionMap ? directionMap[maybeDirection] : maybeDirection;
  stops.unshift(direction);

  var _values = stops.map(stop => {
    // if stop is valid shorthand direction, return it
    if (valueSet.has(stop)) return stop; // color stop could be `red.200 20%` based on css gradient spec

    var [_color, _stop] = stop.split(" "); // else, get and transform the color token or css value

    var key = "colors." + _color;
    var color = key in theme.__cssMap ? theme.__cssMap[key].varRef : _color;
    return _stop ? [color, _stop].join(" ") : color;
  });

  return _type + "(" + _values.join(", ") + ")";
}
var gradientTransform = (value, theme) => parseGradient(value, theme != null ? theme : {});

function bgClipTransform(value) {
  return value === "text" ? {
    color: "transparent",
    backgroundClip: "text"
  } : {
    backgroundClip: value
  };
}

var background = {
  bg: t.colors("background"),
  bgColor: t.colors("backgroundColor"),
  background: t.colors("background"),
  backgroundColor: t.colors("backgroundColor"),
  backgroundImage: true,
  backgroundSize: true,
  backgroundPosition: true,
  backgroundRepeat: true,
  backgroundAttachment: true,
  backgroundBlendMode: true,
  backgroundClip: {
    transform: bgClipTransform
  },
  bgImage: t.prop("backgroundImage"),
  bgImg: t.prop("backgroundImage"),
  bgBlendMode: t.prop("backgroundBlendMode"),
  bgSize: t.prop("backgroundSize"),
  bgPosition: t.prop("backgroundPosition"),
  bgPos: t.prop("backgroundPosition"),
  bgRepeat: t.prop("backgroundRepeat"),
  bgAttachment: t.prop("backgroundAttachment"),
  bgGradient: {
    property: "backgroundImage",
    transform: gradientTransform
  },
  bgClip: {
    transform: bgClipTransform
  }
};

var border = {
  border: t.borders("border"),
  borderWidth: t.borderWidths("borderWidth"),
  borderStyle: t.borderStyles("borderStyle"),
  borderColor: t.colors("borderColor"),
  borderRadius: t.radii("borderRadius"),
  borderTop: t.borders("borderTop"),
  borderBlockStart: t.borders("borderBlockStart"),
  borderTopLeftRadius: t.radii("borderTopLeftRadius"),
  borderStartStartRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderTopLeftRadius",
      rtl: "borderTopRightRadius"
    }
  }),
  borderEndStartRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderBottomLeftRadius",
      rtl: "borderBottomRightRadius"
    }
  }),
  borderTopRightRadius: t.radii("borderTopRightRadius"),
  borderStartEndRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderTopRightRadius",
      rtl: "borderTopLeftRadius"
    }
  }),
  borderEndEndRadius: t.logical({
    scale: "radii",
    property: {
      ltr: "borderBottomRightRadius",
      rtl: "borderBottomLeftRadius"
    }
  }),
  borderRight: t.borders("borderRight"),
  borderInlineEnd: t.borders("borderInlineEnd"),
  borderBottom: t.borders("borderBottom"),
  borderBlockEnd: t.borders("borderBlockEnd"),
  borderBottomLeftRadius: t.radii("borderBottomLeftRadius"),
  borderBottomRightRadius: t.radii("borderBottomRightRadius"),
  borderLeft: t.borders("borderLeft"),
  borderInlineStart: {
    property: "borderInlineStart",
    scale: "borders"
  },
  borderInlineStartRadius: t.logical({
    scale: "radii",
    property: {
      ltr: ["borderTopLeftRadius", "borderBottomLeftRadius"],
      rtl: ["borderTopRightRadius", "borderBottomRightRadius"]
    }
  }),
  borderInlineEndRadius: t.logical({
    scale: "radii",
    property: {
      ltr: ["borderTopRightRadius", "borderBottomRightRadius"],
      rtl: ["borderTopLeftRadius", "borderBottomLeftRadius"]
    }
  }),
  borderX: t.borders(["borderLeft", "borderRight"]),
  borderInline: t.borders("borderInline"),
  borderY: t.borders(["borderTop", "borderBottom"]),
  borderBlock: t.borders("borderBlock"),
  borderTopWidth: t.borderWidths("borderTopWidth"),
  borderBlockStartWidth: t.borderWidths("borderBlockStartWidth"),
  borderTopColor: t.colors("borderTopColor"),
  borderBlockStartColor: t.colors("borderBlockStartColor"),
  borderTopStyle: t.borderStyles("borderTopStyle"),
  borderBlockStartStyle: t.borderStyles("borderBlockStartStyle"),
  borderBottomWidth: t.borderWidths("borderBottomWidth"),
  borderBlockEndWidth: t.borderWidths("borderBlockEndWidth"),
  borderBottomColor: t.colors("borderBottomColor"),
  borderBlockEndColor: t.colors("borderBlockEndColor"),
  borderBottomStyle: t.borderStyles("borderBottomStyle"),
  borderBlockEndStyle: t.borderStyles("borderBlockEndStyle"),
  borderLeftWidth: t.borderWidths("borderLeftWidth"),
  borderInlineStartWidth: t.borderWidths("borderInlineStartWidth"),
  borderLeftColor: t.colors("borderLeftColor"),
  borderInlineStartColor: t.colors("borderInlineStartColor"),
  borderLeftStyle: t.borderStyles("borderLeftStyle"),
  borderInlineStartStyle: t.borderStyles("borderInlineStartStyle"),
  borderRightWidth: t.borderWidths("borderRightWidth"),
  borderInlineEndWidth: t.borderWidths("borderInlineEndWidth"),
  borderRightColor: t.colors("borderRightColor"),
  borderInlineEndColor: t.colors("borderInlineEndColor"),
  borderRightStyle: t.borderStyles("borderRightStyle"),
  borderInlineEndStyle: t.borderStyles("borderInlineEndStyle"),
  borderTopRadius: t.radii(["borderTopLeftRadius", "borderTopRightRadius"]),
  borderBottomRadius: t.radii(["borderBottomLeftRadius", "borderBottomRightRadius"]),
  borderLeftRadius: t.radii(["borderTopLeftRadius", "borderBottomLeftRadius"]),
  borderRightRadius: t.radii(["borderTopRightRadius", "borderBottomRightRadius"])
};
Object.assign(border, {
  rounded: border.borderRadius,
  roundedTop: border.borderTopRadius,
  roundedTopLeft: border.borderTopLeftRadius,
  roundedTopRight: border.borderTopRightRadius,
  roundedTopStart: border.borderStartStartRadius,
  roundedTopEnd: border.borderStartEndRadius,
  roundedBottom: border.borderBottomRadius,
  roundedBottomLeft: border.borderBottomLeftRadius,
  roundedBottomRight: border.borderBottomRightRadius,
  roundedBottomStart: border.borderEndStartRadius,
  roundedBottomEnd: border.borderEndEndRadius,
  roundedLeft: border.borderLeftRadius,
  roundedRight: border.borderRightRadius,
  roundedStart: border.borderInlineStartRadius,
  roundedEnd: border.borderInlineEndRadius,
  borderStart: border.borderInlineStart,
  borderEnd: border.borderInlineEnd,
  borderTopStartRadius: border.borderStartStartRadius,
  borderTopEndRadius: border.borderStartEndRadius,
  borderBottomStartRadius: border.borderEndStartRadius,
  borderBottomEndRadius: border.borderEndEndRadius,
  borderStartRadius: border.borderInlineStartRadius,
  borderEndRadius: border.borderInlineEndRadius,
  borderStartWidth: border.borderInlineStartWidth,
  borderEndWidth: border.borderInlineEndWidth,
  borderStartColor: border.borderInlineStartColor,
  borderEndColor: border.borderInlineEndColor,
  borderStartStyle: border.borderInlineStartStyle,
  borderEndStyle: border.borderInlineEndStyle
});
/**
 * The prop types for border properties listed above
 */

var color = {
  color: t.colors("color"),
  textColor: t.colors("color"),
  opacity: true,
  fill: t.colors("fill"),
  stroke: t.colors("stroke")
};

var reverse = {
  "row-reverse": {
    space: "--chakra-space-x-reverse",
    divide: "--chakra-divide-x-reverse"
  },
  "column-reverse": {
    space: "--chakra-space-y-reverse",
    divide: "--chakra-divide-y-reverse"
  }
};
var owlSelector = "& > :not(style) ~ :not(style)";
var flexbox = {
  alignItems: true,
  alignContent: true,
  justifyItems: true,
  justifyContent: true,
  flexWrap: true,
  flexDirection: {
    transform(value) {
      var _reverse$value;

      var {
        space,
        divide
      } = (_reverse$value = reverse[value]) != null ? _reverse$value : {};
      var result = {
        flexDirection: value
      };
      if (space) result[space] = 1;
      if (divide) result[divide] = 1;
      return result;
    }

  },
  spaceX: {
    static: {
      [owlSelector]: {
        marginInlineStart: "calc(var(--chakra-space-x) * calc(1 - var(--chakra-space-x-reverse)))",
        marginInlineEnd: "calc(var(--chakra-space-x) * var(--chakra-space-x-reverse))"
      }
    },
    transform: createTransform({
      scale: "space",
      transform: value => value !== null ? {
        "--chakra-space-x": value
      } : null
    })
  },
  spaceY: {
    static: {
      [owlSelector]: {
        marginTop: "calc(var(--chakra-space-y) * calc(1 - var(--chakra-space-y-reverse)))",
        marginBottom: "calc(var(--chakra-space-y) * var(--chakra-space-y-reverse))"
      }
    },
    transform: createTransform({
      scale: "space",
      transform: value => value != null ? {
        "--chakra-space-y": value
      } : null
    })
  },
  flex: true,
  flexFlow: true,
  flexGrow: true,
  flexShrink: true,
  flexBasis: t.sizes("flexBasis"),
  justifySelf: true,
  alignSelf: true,
  order: true,
  placeItems: true,
  placeContent: true,
  placeSelf: true,
  flexDir: t.prop("flexDirection")
};

var grid = {
  gridGap: t.space("gridGap"),
  gridColumnGap: t.space("gridColumnGap"),
  gridRowGap: t.space("gridRowGap"),
  gridColumn: true,
  gridRow: true,
  gridAutoFlow: true,
  gridAutoColumns: true,
  gridColumnStart: true,
  gridColumnEnd: true,
  gridRowStart: true,
  gridRowEnd: true,
  gridAutoRows: true,
  gridTemplate: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
  gridTemplateAreas: true,
  gridArea: true
};

var layout = {
  width: t.sizesT("width"),
  inlineSize: t.sizesT("inlineSize"),
  height: t.sizes("height"),
  blockSize: t.sizes("blockSize"),
  boxSize: t.sizes(["width", "height"]),
  minWidth: t.sizes("minWidth"),
  minInlineSize: t.sizes("minInlineSize"),
  minHeight: t.sizes("minHeight"),
  minBlockSize: t.sizes("minBlockSize"),
  maxWidth: t.sizes("maxWidth"),
  maxInlineSize: t.sizes("maxInlineSize"),
  maxHeight: t.sizes("maxHeight"),
  maxBlockSize: t.sizes("maxBlockSize"),
  d: t.prop("display"),
  overflow: true,
  overflowX: true,
  overflowY: true,
  display: true,
  verticalAlign: true,
  boxSizing: true
};
Object.assign(layout, {
  w: layout.width,
  h: layout.height,
  minW: layout.minWidth,
  maxW: layout.maxWidth,
  minH: layout.minHeight,
  maxH: layout.maxHeight
});
/**
 * Types for layout related CSS properties
 */

var floatTransform = (value, theme) => {
  var map = {
    left: "right",
    right: "left"
  };
  return theme.direction === "rtl" ? map[value] : value;
};

var srOnly = {
  border: "0px",
  clip: "rect(0, 0, 0, 0)",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: "0px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "absolute"
};
var srFocusable = {
  position: "static",
  width: "auto",
  height: "auto",
  clip: "auto",
  padding: "0",
  margin: "0",
  overflow: "visible",
  whiteSpace: "normal"
};

var getWithPriority = (theme, key, styles) => {
  var result = {};
  var obj = memoizedGet(theme, key, {});

  for (var prop in obj) {
    var isInStyles = prop in styles && styles[prop] != null;
    if (!isInStyles) result[prop] = obj[prop];
  }

  return result;
};

var others = {
  animation: true,
  appearance: true,
  visibility: true,
  userSelect: true,
  pointerEvents: true,
  cursor: true,
  resize: true,
  objectFit: true,
  objectPosition: true,
  float: {
    property: "float",
    transform: floatTransform
  },
  willChange: true,
  filter: true,
  clipPath: true,
  srOnly: {
    transform(value) {
      if (value === true) return srOnly;
      if (value === "focusable") return srFocusable;
      return {};
    }

  },
  layerStyle: {
    processResult: true,
    transform: (value, theme, styles) => getWithPriority(theme, "layerStyles." + value, styles)
  },
  textStyle: {
    processResult: true,
    transform: (value, theme, styles) => getWithPriority(theme, "textStyles." + value, styles)
  },
  apply: {
    processResult: true,
    transform: (value, theme, styles) => getWithPriority(theme, value, styles)
  }
};

var position = {
  position: true,
  pos: t.prop("position"),
  zIndex: t.prop("zIndex", "zIndices"),
  inset: t.spaceT(["top", "right", "bottom", "left"]),
  insetX: t.spaceT(["left", "right"]),
  insetInline: t.spaceT("insetInline"),
  insetY: t.spaceT(["top", "bottom"]),
  insetBlock: t.spaceT("insetBlock"),
  top: t.spaceT("top"),
  insetBlockStart: t.spaceT("insetBlockStart"),
  bottom: t.spaceT("bottom"),
  insetBlockEnd: t.spaceT("insetBlockEnd"),
  left: t.spaceT("left"),
  insetInlineStart: t.logical({
    scale: "space",
    property: {
      ltr: "left",
      rtl: "right"
    }
  }),
  right: t.spaceT("right"),
  insetInlineEnd: t.logical({
    scale: "space",
    property: {
      ltr: "right",
      rtl: "left"
    }
  })
};
Object.assign(position, {
  insetStart: position.insetInlineStart,
  insetEnd: position.insetInlineEnd
});
/**
 * Types for position CSS properties
 */

var shadow = {
  boxShadow: t.shadows("boxShadow"),
  textShadow: t.shadows("textShadow")
};
Object.assign(shadow, {
  shadow: shadow.boxShadow
});
/**
 * Types for box and text shadow properties
 */

var space = {
  margin: t.spaceT("margin"),
  marginTop: t.spaceT("marginTop"),
  marginBlockStart: t.spaceT("marginBlockStart"),
  marginRight: t.spaceT("marginRight"),
  marginInlineEnd: t.spaceT("marginInlineEnd"),
  marginBottom: t.spaceT("marginBottom"),
  marginBlockEnd: t.spaceT("marginBlockEnd"),
  marginLeft: t.spaceT("marginLeft"),
  marginInlineStart: t.spaceT("marginInlineStart"),
  marginX: t.spaceT(["marginInlineStart", "marginInlineEnd"]),
  marginInline: t.spaceT("marginInline"),
  marginY: t.spaceT(["marginTop", "marginBottom"]),
  marginBlock: t.spaceT("marginBlock"),
  padding: t.space("padding"),
  paddingTop: t.space("paddingTop"),
  paddingBlockStart: t.space("paddingBlockStart"),
  paddingRight: t.space("paddingRight"),
  paddingBottom: t.space("paddingBottom"),
  paddingBlockEnd: t.space("paddingBlockEnd"),
  paddingLeft: t.space("paddingLeft"),
  paddingInlineStart: t.space("paddingInlineStart"),
  paddingInlineEnd: t.space("paddingInlineEnd"),
  paddingX: t.space(["paddingInlineStart", "paddingInlineEnd"]),
  paddingInline: t.space("paddingInline"),
  paddingY: t.space(["paddingTop", "paddingBottom"]),
  paddingBlock: t.space("paddingBlock")
};
Object.assign(space, {
  m: space.margin,
  mt: space.marginTop,
  mr: space.marginRight,
  me: space.marginInlineEnd,
  marginEnd: space.marginInlineEnd,
  mb: space.marginBottom,
  ml: space.marginLeft,
  ms: space.marginInlineStart,
  marginStart: space.marginInlineStart,
  mx: space.marginX,
  my: space.marginY,
  p: space.padding,
  pt: space.paddingTop,
  py: space.paddingY,
  px: space.paddingX,
  pb: space.paddingBottom,
  pl: space.paddingLeft,
  ps: space.paddingInlineStart,
  paddingStart: space.paddingInlineStart,
  pr: space.paddingRight,
  pe: space.paddingInlineEnd,
  paddingEnd: space.paddingInlineEnd
});
/**
 * Types for space related CSS properties
 */

var typography = {
  fontFamily: t.prop("fontFamily", "fonts"),
  fontSize: t.prop("fontSize", "fontSizes", px),
  fontWeight: t.prop("fontWeight", "fontWeights"),
  lineHeight: t.prop("lineHeight", "lineHeights"),
  letterSpacing: t.prop("letterSpacing", "letterSpacings"),
  textAlign: true,
  fontStyle: true,
  wordBreak: true,
  overflowWrap: true,
  textOverflow: true,
  textTransform: true,
  whiteSpace: true,
  textDecoration: true,
  textDecor: {
    property: "textDecoration"
  },
  noOfLines: {
    static: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      //@ts-ignore
      WebkitLineClamp: "var(--chakra-line-clamp)"
    },
    property: "--chakra-line-clamp"
  },
  isTruncated: {
    transform(value) {
      if (value === true) {
        return {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        };
      }
    }

  }
};
/**
 * Types for typography related CSS properties
 */

/**
 * The parser configuration for common outline properties
 */

var outline = {
  outline: true,
  outlineOffset: true,
  outlineColor: t.colors("outlineColor"),
  ringColor: t.prop("--chakra-ring-color", "colors"),
  ringOffsetWidth: t.prop("--chakra-ring-offset"),
  ringOffsetColor: t.prop("--chakra-ring-offset-color", "colors"),
  ringWidth: t.prop("--chakra-ring-offset"),
  ringInset: t.prop("--chakra-ring-inset")
};

var list = {
  listStyleType: true,
  listStylePosition: true,
  listStylePos: t.prop("listStylePosition"),
  listStyleImage: true,
  listStyleImg: t.prop("listStyleImage")
};

var transition = {
  transition: true,
  transitionDuration: t.prop("transitionDuration", "transition.duration"),
  transitionProperty: t.prop("transitionProperty", "transition.property"),
  transitionTimingFunction: t.prop("transitionTimingFunction", "transition.easing")
};

var templates = {
  auto: "var(--chakra-transform)",
  "auto-gpu": "var(--chakra-transform-gpu)"
};

var degreeTransform = value => {
  if (isCssVar(value) || value == null) return value;
  return isNumber(value) ? value + "deg" : value;
};

var transform = {
  transform: {
    property: "transform",

    transform(value) {
      var _templates$value;

      return (_templates$value = templates[value]) != null ? _templates$value : value;
    }

  },
  transformOrigin: true,
  translateX: t.spaceT("--chakra-translate-x"),
  translateY: t.spaceT("--chakra-translate-y"),
  rotateX: {
    property: "--chakra-rotate-x",
    transform: degreeTransform
  },
  rotateY: {
    property: "--chakra-rotate-y",
    transform: degreeTransform
  },
  skewX: {
    property: "--chakra-skew-x",
    transform: degreeTransform
  },
  skewY: {
    property: "--chakra-skew-y",
    transform: degreeTransform
  }
};

/**
 * Expands an array or object syntax responsive style.
 *
 * @example
 * expandResponsive({ mx: [1, 2] })
 * // or
 * expandResponsive({ mx: { base: 1, sm: 2 } })
 *
 * // => { mx: 1, "@media(min-width:<sm>)": { mx: 2 } }
 */

var expandResponsive = styles => theme => {
  /**
   * Before any style can be processed, the user needs to call `toCSSVar`
   * which analyzes the theme's breakpoint and appends a `__breakpoints` property
   * to the theme with more details of the breakpoints.
   *
   * To learn more, go here: packages/utils/src/responsive.ts #analyzeBreakpoints
   */
  if (!theme.__breakpoints) return styles;
  var {
    isResponsive,
    toArrayValue,
    media: medias
  } = theme.__breakpoints;
  var computedStyles = {};

  for (var key in styles) {
    var value = runIfFn(styles[key], theme);
    if (value == null) continue; // converts the object responsive syntax to array syntax

    value = isObject(value) && isResponsive(value) ? toArrayValue(value) : value;

    if (!Array.isArray(value)) {
      computedStyles[key] = value;
      continue;
    }

    var queries = value.slice(0, medias.length).length;

    for (var index = 0; index < queries; index += 1) {
      var media = medias == null ? void 0 : medias[index];

      if (!media) {
        computedStyles[key] = value[index];
        continue;
      }

      computedStyles[media] = computedStyles[media] || {};

      if (value[index] == null) {
        continue;
      }

      computedStyles[media][key] = value[index];
    }
  }

  return computedStyles;
};

var group = {
  hover: selector => selector + ":hover &, " + selector + "[data-hover] &",
  focus: selector => selector + ":focus &, " + selector + "[data-focus] &",
  active: selector => selector + ":active &, " + selector + "[data-active] &",
  disabled: selector => selector + ":disabled &, " + selector + "[data-disabled] &",
  invalid: selector => selector + ":invalid &, " + selector + "[data-invalid] &",
  checked: selector => selector + ":checked &, " + selector + "[data-checked] &",
  indeterminate: selector => selector + ":indeterminate &, " + selector + "[aria-checked=mixed] &, " + selector + "[data-indeterminate] &",
  readOnly: selector => selector + ":read-only &, " + selector + "[readonly] &, " + selector + "[data-read-only] &",
  expanded: selector => selector + ":read-only &, " + selector + "[aria-expanded=true] &, " + selector + "[data-expanded] &"
};

var toGroup = fn => merge(fn, "[role=group]", "[data-group]", ".group");

var merge = function merge(fn) {
  for (var _len = arguments.length, selectors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    selectors[_key - 1] = arguments[_key];
  }

  return selectors.map(fn).join(", ");
};

var pseudoSelectors = {
  /**
   * Styles for CSS selector `&:hover`
   */
  _hover: "&:hover, &[data-hover]",

  /**
   * Styles for CSS Selector `&:active`
   */
  _active: "&:active, &[data-active]",

  /**
   * Styles for CSS selector `&:focus`
   *
   */
  _focus: "&:focus, &[data-focus]",

  /**
   * Styles for the highlighted state.
   */
  _highlighted: "&[data-highlighted]",

  /**
   * Styles to apply when a child of this element has received focus
   * - CSS Selector `&:focus-within`
   */
  _focusWithin: "&:focus-within",
  _focusVisible: "&:focus-visible",

  /**
   * Styles to apply when this element is disabled. The passed styles are applied to these CSS selectors:
   * - `&[aria-disabled=true]`
   * - `&:disabled`
   * - `&[data-disabled]`
   */
  _disabled: "&[disabled], &[aria-disabled=true], &[data-disabled]",

  /**
   * Styles for CSS Selector `&:readonly`
   */
  _readOnly: "&[aria-readonly=true], &[readonly], &[data-readonly]",

  /**
   * Styles for CSS selector `&::before`
   *
   * NOTE:When using this, ensure the `content` is wrapped in a backtick.
   * @example
   * ```jsx
   * <Box _before={{content:`""` }}/>
   * ```
   */
  _before: "&::before",

  /**
   * Styles for CSS selector `&::after`
   *
   * NOTE:When using this, ensure the `content` is wrapped in a backtick.
   * @example
   * ```jsx
   * <Box _after={{content:`""` }}/>
   * ```
   */
  _after: "&::after",
  _empty: "&:empty",

  /**
   * Styles to apply when the ARIA attribute `aria-expanded` is `true`
   * - CSS selector `&[aria-expanded=true]`
   */
  _expanded: "&[aria-expanded=true], &[data-expanded]",

  /**
   * Styles to apply when the ARIA attribute `aria-checked` is `true`
   * - CSS selector `&[aria-checked=true]`
   */
  _checked: "&[aria-checked=true], &[data-checked]",

  /**
   * Styles to apply when the ARIA attribute `aria-grabbed` is `true`
   * - CSS selector `&[aria-grabbed=true]`
   */
  _grabbed: "&[aria-grabbed=true], &[data-grabbed]",

  /**
   * Styles for CSS Selector `&[aria-pressed=true]`
   * Typically used to style the current "pressed" state of toggle buttons
   */
  _pressed: "&[aria-pressed=true], &[data-pressed]",

  /**
   * Styles to apply when the ARIA attribute `aria-invalid` is `true`
   * - CSS selector `&[aria-invalid=true]`
   */
  _invalid: "&[aria-invalid=true], &[data-invalid]",

  /**
   * Styles for the valid state
   * - CSS selector `&[data-valid], &[data-state=valid]`
   */
  _valid: "&[data-valid], &[data-state=valid]",

  /**
   * Styles for CSS Selector `&[aria-busy=true]` or `&[data-loading=true]`.
   * Useful for styling loading states
   */
  _loading: "&[data-loading], &[aria-busy=true]",

  /**
   * Styles to apply when the ARIA attribute `aria-selected` is `true`
   *
   * - CSS selector `&[aria-selected=true]`
   */
  _selected: "&[aria-selected=true], &[data-selected]",

  /**
   * Styles for CSS Selector `[hidden=true]`
   */
  _hidden: "&[hidden], &[data-hidden]",

  /**
   * Styles for CSS Selector `&:-webkit-autofill`
   */
  _autofill: "&:-webkit-autofill",

  /**
   * Styles for CSS Selector `&:nth-child(even)`
   */
  _even: "&:nth-of-type(even)",

  /**
   * Styles for CSS Selector `&:nth-child(odd)`
   */
  _odd: "&:nth-of-type(odd)",

  /**
   * Styles for CSS Selector `&:first-of-type`
   */
  _first: "&:first-of-type",

  /**
   * Styles for CSS Selector `&:last-of-type`
   */
  _last: "&:last-of-type",

  /**
   * Styles for CSS Selector `&:not(:first-of-type)`
   */
  _notFirst: "&:not(:first-of-type)",

  /**
   * Styles for CSS Selector `&:not(:last-of-type)`
   */
  _notLast: "&:not(:last-of-type)",

  /**
   * Styles for CSS Selector `&:visited`
   */
  _visited: "&:visited",

  /**
   * Used to style the active link in a navigation
   * Styles for CSS Selector `&[aria-current=page]`
   */
  _activeLink: "&[aria-current=page]",

  /**
   * Styles to apply when the ARIA attribute `aria-checked` is `mixed`
   * - CSS selector `&[aria-checked=mixed]`
   */
  _indeterminate: "&:indeterminate, &[aria-checked=mixed], &[data-indeterminate]",

  /**
   * Styles to apply when parent is hovered
   */
  _groupHover: toGroup(group.hover),

  /**
   * Styles to apply when parent is focused
   */
  _groupFocus: toGroup(group.focus),

  /**
   * Styles to apply when parent is active
   */
  _groupActive: toGroup(group.active),

  /**
   * Styles to apply when parent is disabled
   */
  _groupDisabled: toGroup(group.disabled),

  /**
   * Styles to apply when parent is invalid
   */
  _groupInvalid: toGroup(group.invalid),

  /**
   * Styles to apply when parent is checked
   */
  _groupChecked: toGroup(group.checked),

  /**
   * Styles for CSS Selector `&::placeholder`.
   */
  _placeholder: "&::placeholder",

  /**
   * Styles for CSS Selector `&:fullscreen`.
   */
  _fullScreen: "&:fullscreen",

  /**
   * Styles for CSS Selector `&::selection`
   */
  _selection: "&::selection",

  /**
   * Styles for CSS Selector `[dir=rtl] &`
   * It is applied when any parent element has `dir="rtl"`
   */
  _rtl: "[dir=rtl] &",

  /**
   * Styles for CSS Selector `@media (prefers-color-scheme: dark)`
   * used when the user has requested the system
   * use a light or dark color theme.
   */
  _mediaDark: "@media (prefers-color-scheme: dark)",

  /**
   * Styles for when `.dark` is applied to any parent of
   * this component or element.
   */
  _dark: ".dark &, [data-theme=dark] &"
};
var pseudoPropNames = objectKeys(pseudoSelectors);

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var systemProps = lodash_mergewith({}, background, border, color, flexbox, layout, outline, grid, others, position, shadow, space, typography, transform, list, transition);
var layoutSystem = lodash_mergewith({}, space, layout, flexbox, grid, position);
var layoutPropNames = objectKeys(layoutSystem);
var propNames = [...objectKeys(systemProps), ...pseudoPropNames];

var styleProps = _extends$1({}, systemProps, pseudoSelectors);

var isStyleProp = prop => prop in styleProps;

var isCSSVariableTokenValue = (key, value) => key.startsWith("--") && isString(value) && !isCssVar(value);

var resolveTokenValue = (theme, value) => {
  var _ref, _getVar2;

  if (value == null) return value;

  var getVar = val => {
    var _theme$__cssMap, _theme$__cssMap$val;

    return (_theme$__cssMap = theme.__cssMap) == null ? void 0 : (_theme$__cssMap$val = _theme$__cssMap[val]) == null ? void 0 : _theme$__cssMap$val.varRef;
  };

  var getValue = val => {
    var _getVar;

    return (_getVar = getVar(val)) != null ? _getVar : val;
  };

  var valueSplit = value.split(",").map(v => v.trim());
  var [tokenValue, fallbackValue] = valueSplit;
  value = (_ref = (_getVar2 = getVar(tokenValue)) != null ? _getVar2 : getValue(fallbackValue)) != null ? _ref : getValue(value);
  return value;
};

function getCss(options) {
  var {
    configs = {},
    pseudos = {},
    theme
  } = options;

  var css = function css(stylesOrFn, nested) {
    if (nested === void 0) {
      nested = false;
    }

    var _styles = runIfFn(stylesOrFn, theme);

    var styles = expandResponsive(_styles)(theme);
    var computedStyles = {};

    for (var key in styles) {
      var _config$transform, _config, _config2, _config3, _config4;

      var valueOrFn = styles[key];
      /**
       * allows the user to pass functional values
       * boxShadow: theme => `0 2px 2px ${theme.colors.red}`
       */

      var value = runIfFn(valueOrFn, theme);
      /**
       * converts pseudo shorthands to valid selector
       * "_hover" => "&:hover"
       */

      if (key in pseudos) {
        key = pseudos[key];
      }
      /**
       * allows the user to use theme tokens in css vars
       * { --banner-height: "sizes.md" } => { --banner-height: "var(--chakra-sizes-md)" }
       *
       * You can also provide fallback values
       * { --banner-height: "sizes.no-exist, 40px" } => { --banner-height: "40px" }
       */


      if (isCSSVariableTokenValue(key, value)) {
        value = resolveTokenValue(theme, value);
      }

      var config = configs[key];

      if (config === true) {
        config = {
          property: key
        };
      }

      if (isObject(value)) {
        var _computedStyles$key;

        computedStyles[key] = (_computedStyles$key = computedStyles[key]) != null ? _computedStyles$key : {};
        computedStyles[key] = lodash_mergewith({}, computedStyles[key], css(value, true));
        continue;
      }

      var rawValue = (_config$transform = (_config = config) == null ? void 0 : _config.transform == null ? void 0 : _config.transform(value, theme, _styles)) != null ? _config$transform : value;
      /**
       * Used for `layerStyle`, `textStyle` and `apply`. After getting the
       * styles in the theme, we need to process them since they might
       * contain theme tokens.
       *
       * `processResult` is the config property we pass to `layerStyle`, `textStyle` and `apply`
       */

      rawValue = (_config2 = config) != null && _config2.processResult ? css(rawValue, true) : rawValue;
      /**
       * allows us define css properties for RTL and LTR.
       *
       * const marginStart = {
       *   property: theme => theme.direction === "rtl" ? "marginRight": "marginLeft",
       * }
       */

      var configProperty = runIfFn((_config3 = config) == null ? void 0 : _config3.property, theme);

      if (!nested && (_config4 = config) != null && _config4.static) {
        var staticStyles = runIfFn(config.static, theme);
        computedStyles = lodash_mergewith({}, computedStyles, staticStyles);
      }

      if (configProperty && Array.isArray(configProperty)) {
        for (var property of configProperty) {
          computedStyles[property] = rawValue;
        }

        continue;
      }

      if (configProperty) {
        if (configProperty === "&" && isObject(rawValue)) {
          computedStyles = lodash_mergewith({}, computedStyles, rawValue);
        } else {
          computedStyles[configProperty] = rawValue;
        }

        continue;
      }

      if (isObject(rawValue)) {
        computedStyles = lodash_mergewith({}, computedStyles, rawValue);
        continue;
      }

      computedStyles[key] = rawValue;
    }

    return computedStyles;
  };

  return css;
}
var css = styles => theme => {
  var cssFn = getCss({
    theme,
    pseudos: pseudoSelectors,
    configs: systemProps
  });
  return cssFn(styles);
};

/**
 * Thank you @markdalgleish for this piece of art!
 */

function resolveReference(operand) {
  if (isObject(operand) && operand.reference) {
    return operand.reference;
  }

  return String(operand);
}

var toExpression = function toExpression(operator) {
  for (var _len = arguments.length, operands = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    operands[_key - 1] = arguments[_key];
  }

  return operands.map(resolveReference).join(" " + operator + " ").replace(/calc/g, "");
};

var _add = function add() {
  for (var _len2 = arguments.length, operands = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    operands[_key2] = arguments[_key2];
  }

  return "calc(" + toExpression("+", ...operands) + ")";
};

var _subtract = function subtract() {
  for (var _len3 = arguments.length, operands = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    operands[_key3] = arguments[_key3];
  }

  return "calc(" + toExpression("-", ...operands) + ")";
};

var _multiply = function multiply() {
  for (var _len4 = arguments.length, operands = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    operands[_key4] = arguments[_key4];
  }

  return "calc(" + toExpression("*", ...operands) + ")";
};

var _divide = function divide() {
  for (var _len5 = arguments.length, operands = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    operands[_key5] = arguments[_key5];
  }

  return "calc(" + toExpression("/", ...operands) + ")";
};

var _negate = x => {
  var value = resolveReference(x);

  if (value != null && !Number.isNaN(parseFloat(value))) {
    return String(value).startsWith("-") ? String(value).slice(1) : "-" + value;
  }

  return _multiply(value, -1);
};

var calc = Object.assign(x => ({
  add: function add() {
    for (var _len6 = arguments.length, operands = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      operands[_key6] = arguments[_key6];
    }

    return calc(_add(x, ...operands));
  },
  subtract: function subtract() {
    for (var _len7 = arguments.length, operands = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      operands[_key7] = arguments[_key7];
    }

    return calc(_subtract(x, ...operands));
  },
  multiply: function multiply() {
    for (var _len8 = arguments.length, operands = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      operands[_key8] = arguments[_key8];
    }

    return calc(_multiply(x, ...operands));
  },
  divide: function divide() {
    for (var _len9 = arguments.length, operands = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      operands[_key9] = arguments[_key9];
    }

    return calc(_divide(x, ...operands));
  },
  negate: () => calc(_negate(x)),
  toString: () => x.toString()
}), {
  add: _add,
  subtract: _subtract,
  multiply: _multiply,
  divide: _divide,
  negate: _negate
});

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        before = _this.prepend ? _this.container.firstChild : _this.before;
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? "production" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

var e = "-ms-";
var r = "-moz-";
var a = "-webkit-";
var c = "comm";
var n = "rule";
var t$1 = "decl";
var i = "@import";
var p = "@keyframes";
var k = Math.abs;
var d = String.fromCharCode;
function m(e2, r2) {
  return (((r2 << 2 ^ z(e2, 0)) << 2 ^ z(e2, 1)) << 2 ^ z(e2, 2)) << 2 ^ z(e2, 3);
}
function g(e2) {
  return e2.trim();
}
function x(e2, r2) {
  return (e2 = r2.exec(e2)) ? e2[0] : e2;
}
function y(e2, r2, a2) {
  return e2.replace(r2, a2);
}
function j(e2, r2) {
  return e2.indexOf(r2);
}
function z(e2, r2) {
  return e2.charCodeAt(r2) | 0;
}
function C(e2, r2, a2) {
  return e2.slice(r2, a2);
}
function A(e2) {
  return e2.length;
}
function M(e2) {
  return e2.length;
}
function O(e2, r2) {
  return r2.push(e2), e2;
}
function S(e2, r2) {
  return e2.map(r2).join("");
}
var q = 1;
var B = 1;
var D = 0;
var E = 0;
var F = 0;
var G = "";
function H(e2, r2, a2, c2, n2, t2, s2) {
  return {value: e2, root: r2, parent: a2, type: c2, props: n2, children: t2, line: q, column: B, length: s2, return: ""};
}
function I(e2, r2, a2) {
  return H(e2, r2.root, r2.parent, a2, r2.props, r2.children, 0);
}
function J() {
  return F;
}
function K() {
  F = E > 0 ? z(G, --E) : 0;
  if (B--, F === 10)
    B = 1, q--;
  return F;
}
function L() {
  F = E < D ? z(G, E++) : 0;
  if (B++, F === 10)
    B = 1, q++;
  return F;
}
function N() {
  return z(G, E);
}
function P() {
  return E;
}
function Q(e2, r2) {
  return C(G, e2, r2);
}
function R(e2) {
  switch (e2) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function T(e2) {
  return q = B = 1, D = A(G = e2), E = 0, [];
}
function U(e2) {
  return G = "", e2;
}
function V(e2) {
  return g(Q(E - 1, _(e2 === 91 ? e2 + 2 : e2 === 40 ? e2 + 1 : e2)));
}
function X(e2) {
  while (F = N())
    if (F < 33)
      L();
    else
      break;
  return R(e2) > 2 || R(F) > 3 ? "" : " ";
}
function Z(e2, r2) {
  while (--r2 && L())
    if (F < 48 || F > 102 || F > 57 && F < 65 || F > 70 && F < 97)
      break;
  return Q(e2, P() + (r2 < 6 && N() == 32 && L() == 32));
}
function _(e2) {
  while (L())
    switch (F) {
      case e2:
        return E;
      case 34:
      case 39:
        return _(e2 === 34 || e2 === 39 ? e2 : F);
      case 40:
        if (e2 === 41)
          _(e2);
        break;
      case 92:
        L();
        break;
    }
  return E;
}
function ee(e2, r2) {
  while (L())
    if (e2 + F === 47 + 10)
      break;
    else if (e2 + F === 42 + 42 && N() === 47)
      break;
  return "/*" + Q(r2, E - 1) + "*" + d(e2 === 47 ? e2 : L());
}
function re(e2) {
  while (!R(N()))
    L();
  return Q(e2, E);
}
function ae(e2) {
  return U(ce("", null, null, null, [""], e2 = T(e2), 0, [0], e2));
}
function ce(e2, r2, a2, c2, n2, t2, s2, u2, i2) {
  var f2 = 0;
  var o2 = 0;
  var l2 = s2;
  var v2 = 0;
  var h2 = 0;
  var p2 = 0;
  var b2 = 1;
  var w2 = 1;
  var $2 = 1;
  var k2 = 0;
  var m2 = "";
  var g2 = n2;
  var x2 = t2;
  var j2 = c2;
  var z2 = m2;
  while (w2)
    switch (p2 = k2, k2 = L()) {
      case 34:
      case 39:
      case 91:
      case 40:
        z2 += V(k2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        z2 += X(p2);
        break;
      case 92:
        z2 += Z(P() - 1, 7);
        continue;
      case 47:
        switch (N()) {
          case 42:
          case 47:
            O(te(ee(L(), P()), r2, a2), i2);
            break;
          default:
            z2 += "/";
        }
        break;
      case 123 * b2:
        u2[f2++] = A(z2) * $2;
      case 125 * b2:
      case 59:
      case 0:
        switch (k2) {
          case 0:
          case 125:
            w2 = 0;
          case 59 + o2:
            if (h2 > 0 && A(z2) - l2)
              O(h2 > 32 ? se(z2 + ";", c2, a2, l2 - 1) : se(y(z2, " ", "") + ";", c2, a2, l2 - 2), i2);
            break;
          case 59:
            z2 += ";";
          default:
            O(j2 = ne(z2, r2, a2, f2, o2, n2, u2, m2, g2 = [], x2 = [], l2), t2);
            if (k2 === 123)
              if (o2 === 0)
                ce(z2, r2, j2, j2, g2, t2, l2, u2, x2);
              else
                switch (v2) {
                  case 100:
                  case 109:
                  case 115:
                    ce(e2, j2, j2, c2 && O(ne(e2, j2, j2, 0, 0, n2, u2, m2, n2, g2 = [], l2), x2), n2, x2, l2, u2, c2 ? g2 : x2);
                    break;
                  default:
                    ce(z2, j2, j2, j2, [""], x2, l2, u2, x2);
                }
        }
        f2 = o2 = h2 = 0, b2 = $2 = 1, m2 = z2 = "", l2 = s2;
        break;
      case 58:
        l2 = 1 + A(z2), h2 = p2;
      default:
        if (b2 < 1) {
          if (k2 == 123)
            --b2;
          else if (k2 == 125 && b2++ == 0 && K() == 125)
            continue;
        }
        switch (z2 += d(k2), k2 * b2) {
          case 38:
            $2 = o2 > 0 ? 1 : (z2 += "\f", -1);
            break;
          case 44:
            u2[f2++] = (A(z2) - 1) * $2, $2 = 1;
            break;
          case 64:
            if (N() === 45)
              z2 += V(L());
            v2 = N(), o2 = A(m2 = z2 += re(P())), k2++;
            break;
          case 45:
            if (p2 === 45 && A(z2) == 2)
              b2 = 0;
        }
    }
  return t2;
}
function ne(e2, r2, a2, c2, t2, s2, u2, i2, f2, o2, l2) {
  var v2 = t2 - 1;
  var h2 = t2 === 0 ? s2 : [""];
  var p2 = M(h2);
  for (var b2 = 0, w2 = 0, $2 = 0; b2 < c2; ++b2)
    for (var d2 = 0, m2 = C(e2, v2 + 1, v2 = k(w2 = u2[b2])), x2 = e2; d2 < p2; ++d2)
      if (x2 = g(w2 > 0 ? h2[d2] + " " + m2 : y(m2, /&\f/g, h2[d2])))
        f2[$2++] = x2;
  return H(e2, r2, a2, t2 === 0 ? n : i2, f2, o2, l2);
}
function te(e2, r2, a2) {
  return H(e2, r2, a2, c, d(J()), C(e2, 2, -2), 0);
}
function se(e2, r2, a2, c2) {
  return H(e2, r2, a2, t$1, C(e2, 0, c2), C(e2, c2 + 1, -1), c2);
}
function ue(c2, n2) {
  switch (m(c2, n2)) {
    case 5103:
      return a + "print-" + c2 + c2;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return a + c2 + c2;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return a + c2 + r + c2 + e + c2 + c2;
    case 6828:
    case 4268:
      return a + c2 + e + c2 + c2;
    case 6165:
      return a + c2 + e + "flex-" + c2 + c2;
    case 5187:
      return a + c2 + y(c2, /(\w+).+(:[^]+)/, a + "box-$1$2" + e + "flex-$1$2") + c2;
    case 5443:
      return a + c2 + e + "flex-item-" + y(c2, /flex-|-self/, "") + c2;
    case 4675:
      return a + c2 + e + "flex-line-pack" + y(c2, /align-content|flex-|-self/, "") + c2;
    case 5548:
      return a + c2 + e + y(c2, "shrink", "negative") + c2;
    case 5292:
      return a + c2 + e + y(c2, "basis", "preferred-size") + c2;
    case 6060:
      return a + "box-" + y(c2, "-grow", "") + a + c2 + e + y(c2, "grow", "positive") + c2;
    case 4554:
      return a + y(c2, /([^-])(transform)/g, "$1" + a + "$2") + c2;
    case 6187:
      return y(y(y(c2, /(zoom-|grab)/, a + "$1"), /(image-set)/, a + "$1"), c2, "") + c2;
    case 5495:
    case 3959:
      return y(c2, /(image-set\([^]*)/, a + "$1$`$1");
    case 4968:
      return y(y(c2, /(.+:)(flex-)?(.*)/, a + "box-pack:$3" + e + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + a + c2 + c2;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return y(c2, /(.+)-inline(.+)/, a + "$1$2") + c2;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (A(c2) - 1 - n2 > 6)
        switch (z(c2, n2 + 1)) {
          case 109:
            if (z(c2, n2 + 4) !== 45)
              break;
          case 102:
            return y(c2, /(.+:)(.+)-([^]+)/, "$1" + a + "$2-$3$1" + r + (z(c2, n2 + 3) == 108 ? "$3" : "$2-$3")) + c2;
          case 115:
            return ~j(c2, "stretch") ? ue(y(c2, "stretch", "fill-available"), n2) + c2 : c2;
        }
      break;
    case 4949:
      if (z(c2, n2 + 1) !== 115)
        break;
    case 6444:
      switch (z(c2, A(c2) - 3 - (~j(c2, "!important") && 10))) {
        case 107:
          return y(c2, ":", ":" + a) + c2;
        case 101:
          return y(c2, /(.+:)([^;!]+)(;|!.+)?/, "$1" + a + (z(c2, 14) === 45 ? "inline-" : "") + "box$3$1" + a + "$2$3$1" + e + "$2box$3") + c2;
      }
      break;
    case 5936:
      switch (z(c2, n2 + 11)) {
        case 114:
          return a + c2 + e + y(c2, /[svh]\w+-[tblr]{2}/, "tb") + c2;
        case 108:
          return a + c2 + e + y(c2, /[svh]\w+-[tblr]{2}/, "tb-rl") + c2;
        case 45:
          return a + c2 + e + y(c2, /[svh]\w+-[tblr]{2}/, "lr") + c2;
      }
      return a + c2 + e + c2 + c2;
  }
  return c2;
}
function ie(e2, r2) {
  var a2 = "";
  var c2 = M(e2);
  for (var n2 = 0; n2 < c2; n2++)
    a2 += r2(e2[n2], n2, e2, r2) || "";
  return a2;
}
function fe(e2, r2, a2, s2) {
  switch (e2.type) {
    case i:
    case t$1:
      return e2.return = e2.return || e2.value;
    case c:
      return "";
    case n:
      e2.value = e2.props.join(",");
  }
  return A(a2 = ie(e2.children, s2)) ? e2.return = e2.value + "{" + a2 + "}" : "";
}
function oe(e2) {
  var r2 = M(e2);
  return function(a2, c2, n2, t2) {
    var s2 = "";
    for (var u2 = 0; u2 < r2; u2++)
      s2 += e2[u2](a2, c2, n2, t2) || "";
    return s2;
  };
}
function le(e2) {
  return function(r2) {
    if (!r2.root) {
      if (r2 = r2.return)
        e2(r2);
    }
  };
}
function ve(c2, s2, u2, i2) {
  if (!c2.return)
    switch (c2.type) {
      case t$1:
        c2.return = ue(c2.value, c2.length);
        break;
      case p:
        return ie([I(y(c2.value, "@", "@" + a), c2, "")], i2);
      case n:
        if (c2.length)
          return S(c2.props, function(n2) {
            switch (x(n2, /(::plac\w+|:read-\w+)/)) {
              case ":read-only":
              case ":read-write":
                return ie([I(y(n2, /:(read-\w+)/, ":" + r + "$1"), c2, "")], i2);
              case "::placeholder":
                return ie([I(y(n2, /:(plac\w+)/, ":" + a + "input-$1"), c2, ""), I(y(n2, /:(plac\w+)/, ":" + r + "$1"), c2, ""), I(y(n2, /:(plac\w+)/, e + "input-$1"), c2, "")], i2);
            }
            return "";
          });
    }
}

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

function memoize$1(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch (R(character)) {
      case 0:
        // &\f
        if (character === 38 && N() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += re(E - 1);
        break;

      case 2:
        parsed[index] += V(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = N() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += d(character);
    }
  } while (character = L());

  return parsed;
};

var getRules = function getRules(value, points) {
  return U(toRules(T(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // .length indicates if this rule contains pseudo or not
  !element.length) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};

var defaultStylisPlugins = [ve];

var createCache = function createCache(options) {
  var key = options.key;

  if ( key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }
      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  var inserted = {}; // $FlowFixMe

  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' '); // $FlowFixMe

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  {
    var currentSheet;
    var finalizingPlugins = [fe,  le(function (rule) {
      currentSheet.insert(rule);
    })];
    var serializer = oe(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return ie(ae(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

function _extends$2() {
  _extends$2 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$2.apply(this, arguments);
}

var isBrowser$1 = "object" !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser$1 === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */memoize$1(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        }

        break;
      }
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {

      styles += strings[i];
    }
  }


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = murmur2(styles) + identifierName;

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

var EmotionCacheContext = /* #__PURE__ */react.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */createCache({
  key: 'css'
}) : null);
var CacheProvider = EmotionCacheContext.Provider;

var withEmotionCache = function withEmotionCache(func) {
  // $FlowFixMe
  return /*#__PURE__*/react.forwardRef(function (props, ref) {
    // the cache will never be null in the browser
    var cache = react.useContext(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

var ThemeContext = /* #__PURE__ */react.createContext({});

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    return mergedTheme;
  }

  return _extends$2({}, outerTheme, theme);
};

var createCacheWithTheme = /* #__PURE__ */weakMemoize(function (outerTheme) {
  return weakMemoize(function (theme) {
    return getTheme(outerTheme, theme);
  });
});
var ThemeProvider = function ThemeProvider(props) {
  var theme = react.useContext(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/react.createElement(ThemeContext.Provider, {
    value: theme
  }, props.children);
};

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _extends.apply(this, arguments);
}

module.exports = _extends;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

/**
 * Carefully selected html elements for chakra components.
 * This is mostly for `chakra.<element>` syntax.
 */
var domElements = ["a", "b", "article", "aside", "blockquote", "button", "caption", "cite", "circle", "code", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "img", "input", "kbd", "label", "li", "main", "mark", "nav", "ol", "p", "path", "pre", "q", "rect", "s", "svg", "section", "select", "strong", "small", "span", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "tr", "ul"];
function omitThemingProps(props) {
  return omit(props, ["styleConfig", "size", "variant", "colorScheme"]);
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */memoize$1(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

var testOmitPropsOnStringTag = isPropValid;

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
  var shouldForwardProp;

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  return shouldForwardProp;
};

var createStyled = function createStyled(tag, options) {

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      styles.push.apply(styles, args);
    } else {

      styles.push(args[0][0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {

        styles.push(args[i], args[0][i]);
      }
    } // $FlowFixMe: we need to cast StatelessFunctionalComponent to our PrivateStyledComponent class


    var Styled = withEmotionCache(function (props, cache, ref) {
      var finalTag = shouldUseAs && props.as || baseTag;
      var className = '';
      var classInterpolations = [];
      var mergedProps = props;

      if (props.theme == null) {
        mergedProps = {};

        for (var key in props) {
          mergedProps[key] = props[key];
        }

        mergedProps.theme = react.useContext(ThemeContext);
      }

      if (typeof props.className === 'string') {
        className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }

      var serialized = serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
      var rules = insertStyles(cache, serialized, typeof finalTag === 'string');
      className += cache.key + "-" + serialized.name;

      if (targetClassName !== undefined) {
        className += " " + targetClassName;
      }

      var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(finalTag) : defaultShouldForwardProp;
      var newProps = {};

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue;

        if ( // $FlowFixMe
        finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }

      newProps.className = className;
      newProps.ref = ref;
      var ele = /*#__PURE__*/react.createElement(finalTag, newProps);

      return ele;
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && "production" !== 'production') {
          return 'NO_COMPONENT_SELECTOR';
        } // $FlowFixMe: coerce undefined to string


        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      return createStyled(nextTag, _extends$2({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      })).apply(void 0, styles);
    };

    return Styled;
  };
};

var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

var newStyled = createStyled.bind();
tags.forEach(function (tagName) {
  // $FlowFixMe: we can ignore this because its exposed type is defined by the CreateStyled type
  newStyled[tagName] = newStyled(tagName);
});

/**
 * List of props for emotion to omit from DOM.
 * It mostly consists of Chakra props
 */

var allPropNames = new Set([...propNames, "textStyle", "layerStyle", "apply", "isTruncated", "noOfLines", "focusBorderColor", "errorBorderColor", "as", "__css", "css", "sx"]);
/**
 * htmlWidth and htmlHeight is used in the <Image />
 * component to support the native `width` and `height` attributes
 *
 * https://github.com/chakra-ui/chakra-ui/issues/149
 */

var validHTMLProps = new Set(["htmlWidth", "htmlHeight", "htmlSize"]);
var shouldForwardProp = prop => validHTMLProps.has(prop) || !allPropNames.has(prop);

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Style resolver function that manages how style props are merged
 * in combination with other possible ways of defining styles.
 *
 * For example, take a component defined this way:
 * ```jsx
 * <Box fontSize="24px" sx={{ fontSize: "40px" }}></Box>
 * ```
 *
 * We want to manage the priority of the styles properly to prevent unwanted
 * behaviors. Right now, the `sx` prop has the highest priority so the resolved
 * fontSize will be `40px`
 */
var toCSSObject = (_ref) => {
  var {
    baseStyle
  } = _ref;
  return props => {
    var {
      css: cssProp,
      __css,
      sx
    } = props,
        rest = _objectWithoutPropertiesLoose(props, ["theme", "css", "__css", "sx"]);

    var styleProps = objectFilter(rest, (_, prop) => isStyleProp(prop));
    var finalStyles = Object.assign({}, __css, baseStyle, styleProps, sx);
    var computedCSS = css(finalStyles)(props.theme);
    return cssProp ? [computedCSS, cssProp] : computedCSS;
  };
};
function styled(component, options) {
  var _ref2 = options != null ? options : {},
      {
    baseStyle
  } = _ref2,
      styledOptions = _objectWithoutPropertiesLoose(_ref2, ["baseStyle"]);

  if (!styledOptions.shouldForwardProp) {
    styledOptions.shouldForwardProp = shouldForwardProp;
  }

  var styleObject = toCSSObject({
    baseStyle
  });
  return newStyled(component, styledOptions)(styleObject);
}
var chakra = styled;
domElements.forEach(tag => {
  chakra[tag] = chakra(tag);
});

/**
 * All credit goes to Chance (Reach UI), Haz (Reakit) and (fluentui)
 * for creating the base type definitions upon which we improved on
 */
function forwardRef(component) {
  return /*#__PURE__*/react.forwardRef(component);
}

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

function _objectWithoutPropertiesLoose$1(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var fallbackIcon = {
  path: /*#__PURE__*/react.createElement("g", {
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/react.createElement("path", {
    strokeLinecap: "round",
    fill: "none",
    d: "M9,9a3,3,0,1,1,4,2.829,1.5,1.5,0,0,0-1,1.415V14.25"
  }), /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    strokeLinecap: "round",
    d: "M12,17.25a.375.375,0,1,0,.375.375A.375.375,0,0,0,12,17.25h0"
  }), /*#__PURE__*/react.createElement("circle", {
    fill: "none",
    strokeMiterlimit: "10",
    cx: "12",
    cy: "12",
    r: "11.25"
  })),
  viewBox: "0 0 24 24"
};
var Icon = /*#__PURE__*/forwardRef((props, ref) => {
  var {
    as: element,
    viewBox,
    color = "currentColor",
    focusable = false,
    children,
    className,
    __css
  } = props,
      rest = _objectWithoutPropertiesLoose$1(props, ["as", "viewBox", "color", "focusable", "children", "className", "__css"]);

  var _className = cx("chakra-icon", className);

  var styles = _extends$3({
    w: "1em",
    h: "1em",
    display: "inline-block",
    lineHeight: "1em",
    flexShrink: 0,
    color
  }, __css);

  var shared = {
    ref,
    focusable,
    className: _className,
    __css: styles
  };

  var _viewBox = viewBox != null ? viewBox : fallbackIcon.viewBox;
  /**
   * If you're using an icon library like `react-icons`.
   * Note: anyone passing the `as` prop, should manage the `viewBox` from the external component
   */


  if (element && typeof element !== "string") {
    return /*#__PURE__*/react.createElement(chakra.svg, _extends$3({
      as: element
    }, shared, rest));
  }

  var _path = children != null ? children : fallbackIcon.path;

  return /*#__PURE__*/react.createElement(chakra.svg, _extends$3({
    verticalAlign: "middle",
    viewBox: _viewBox
  }, shared, rest), _path);
});

export { contains as A, isRefObject as B, isEmptyObject as C, pipe as D, cx as E, omitThemingProps as F, chakra as G, dataAttr as H, Icon as I, scheduleMicrotask as J, ariaAttr as K, isRightClick as L, normalizeEventKey as M, isNull as N, getRelatedTarget as O, split as P, layoutPropNames as Q, StyleSheet as S, ThemeContext as T, _extends$2 as _, fromEntries as a, isObject as b, isNotNumber as c, isBrowser as d, isArray as e, forwardRef as f, getOwnerDocument as g, calc as h, isNumber as i, withEmotionCache as j, insertStyles as k, isFunction as l, ThemeProvider as m, noop as n, objectKeys as o, pick as p, memoizedGet as q, runIfFn as r, serializeStyles as s, css as t, lodash_mergewith as u, filterUndefined as v, warn as w, omit as x, callAllHandlers as y, getActiveElement as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi04ZGJhYTZkNC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvdXRpbHMvZGlzdC9lc20vYXNzZXJ0aW9uLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC5tZXJnZXdpdGgvaW5kZXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9vYmplY3QuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9kb20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9mdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY3JlYXRlLXRyYW5zZm9ybS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vcHJvcC1jb25maWcuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3V0aWxzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS91dGlscy9wYXJzZS1ncmFkaWVudC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2JhY2tncm91bmQuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9ib3JkZXIuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9jb2xvci5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2ZsZXhib3guanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9ncmlkLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvbGF5b3V0LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvb3RoZXJzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvcG9zaXRpb24uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9zaGFkb3cuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9zcGFjZS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3R5cG9ncmFwaHkuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9vdXRsaW5lLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvbGlzdC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3RyYW5zaXRpb24uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy90cmFuc2Zvcm0uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2V4cGFuZC1yZXNwb25zaXZlLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9wc2V1ZG9zLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9zeXN0ZW0uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2Nzcy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY3JlYXRlLXRoZW1lLXZhcnMvY2FsYy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9zaGVldC9kaXN0L2Vtb3Rpb24tc2hlZXQuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGlzL2Rpc3Qvc3R5bGlzLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi93ZWFrLW1lbW9pemUvZGlzdC93ZWFrLW1lbW9pemUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vbWVtb2l6ZS9kaXN0L2Vtb3Rpb24tbWVtb2l6ZS5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9jYWNoZS9kaXN0L2Vtb3Rpb24tY2FjaGUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi91dGlscy9kaXN0L2Vtb3Rpb24tdXRpbHMuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vaGFzaC9kaXN0L2hhc2guYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vdW5pdGxlc3MvZGlzdC91bml0bGVzcy5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9zZXJpYWxpemUvZGlzdC9lbW90aW9uLXNlcmlhbGl6ZS5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9yZWFjdC9kaXN0L2Vtb3Rpb24tZWxlbWVudC1hODMwOTA3MC5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2V4dGVuZHMuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zeXN0ZW0vZGlzdC9lc20vc3lzdGVtLnV0aWxzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL2lzLXByb3AtdmFsaWQvZGlzdC9lbW90aW9uLWlzLXByb3AtdmFsaWQuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vc3R5bGVkL2Jhc2UvZGlzdC9lbW90aW9uLXN0eWxlZC1iYXNlLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL3N0eWxlZC9kaXN0L2Vtb3Rpb24tc3R5bGVkLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3lzdGVtL2Rpc3QvZXNtL3Nob3VsZC1mb3J3YXJkLXByb3AuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zeXN0ZW0vZGlzdC9lc20vc3lzdGVtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3lzdGVtL2Rpc3QvZXNtL2ZvcndhcmQtcmVmLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvaWNvbi9kaXN0L2VzbS9pY29uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE51bWJlciBhc3NlcnRpb25zXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc05vdE51bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8IE51bWJlci5pc05hTih2YWx1ZSkgfHwgIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHZhbHVlIC0gcGFyc2VGbG9hdCh2YWx1ZSkgKyAxID49IDA7XG59IC8vIEFycmF5IGFzc2VydGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHlBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwO1xufSAvLyBGdW5jdGlvbiBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIjtcbn0gLy8gR2VuZXJpYyBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn0gLy8gT2JqZWN0IGFzc2VydGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlID09PSBcImZ1bmN0aW9uXCIpICYmICFpc0FycmF5KHZhbHVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5T2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc05vdEVtcHR5T2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiAhaXNFbXB0eU9iamVjdCh2YWx1ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsO1xufSAvLyBTdHJpbmcgYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNDc3NWYXIodmFsdWUpIHtcbiAgcmV0dXJuIC9edmFyXFwoLS0uK1xcKSQvLnRlc3QodmFsdWUpO1xufSAvLyBFbXB0eSBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgcmV0dXJuIGlzRW1wdHlBcnJheSh2YWx1ZSk7XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHJldHVybiBpc0VtcHR5T2JqZWN0KHZhbHVlKTtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IFwiXCIpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgdmFyIF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCI7XG5leHBvcnQgdmFyIF9fVEVTVF9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVmT2JqZWN0KHZhbCkge1xuICByZXR1cm4gXCJjdXJyZW50XCIgaW4gdmFsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5wdXRFdmVudCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgaXNPYmplY3QodmFsdWUpICYmIGlzT2JqZWN0KHZhbHVlLnRhcmdldCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3NlcnRpb24uanMubWFwIiwiLyoqXG4gKiBMb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBPcGVuSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL29wZW5qc2Yub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgU3ltYm9sID0gcm9vdC5TeW1ib2wsXG4gICAgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheSxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZCxcbiAgICBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KSxcbiAgICBvYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlLFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2UsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFzc2lnblZhbHVlYCBleGNlcHQgdGhhdCBpdCBkb2Vzbid0IGFzc2lnblxuICogYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmICgodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhZXEob2JqZWN0W2tleV0sIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKG9iamVjdCA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJhc2VGb3Ioc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsdWUpKSB7XG4gICAgICBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICAgID8gY3VzdG9taXplcihzYWZlR2V0KG9iamVjdCwga2V5KSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgICB9XG4gICAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9LCBrZXlzSW4pO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZU1lcmdlYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIG1lcmdlcyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBtZXJnZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIG1lcmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIG1lcmdlRnVuYywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgdmFyIG9ialZhbHVlID0gc2FmZUdldChvYmplY3QsIGtleSksXG4gICAgICBzcmNWYWx1ZSA9IHNhZmVHZXQoc291cmNlLCBrZXkpLFxuICAgICAgc3RhY2tlZCA9IHN0YWNrLmdldChzcmNWYWx1ZSk7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBzdGFja2VkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgID8gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICA6IHVuZGVmaW5lZDtcblxuICB2YXIgaXNDb21tb24gPSBuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIHZhciBpc0FyciA9IGlzQXJyYXkoc3JjVmFsdWUpLFxuICAgICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgaXNCdWZmZXIoc3JjVmFsdWUpLFxuICAgICAgICBpc1R5cGVkID0gIWlzQXJyICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKTtcblxuICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyIHx8IGlzQnVmZiB8fCBpc1R5cGVkKSB7XG4gICAgICBpZiAoaXNBcnJheShvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlT2JqZWN0KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGNvcHlBcnJheShvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0J1ZmYpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZUJ1ZmZlcihzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc1R5cGVkKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVUeXBlZEFycmF5KHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXdWYWx1ZSA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHNyY1ZhbHVlKSB8fCBpc0FyZ3VtZW50cyhzcmNWYWx1ZSkpIHtcbiAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICBpZiAoaXNBcmd1bWVudHMob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdG9QbGFpbk9iamVjdChvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNPYmplY3Qob2JqVmFsdWUpIHx8IGlzRnVuY3Rpb24ob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gaW5pdENsb25lT2JqZWN0KHNyY1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaXNDb21tb24pIHtcbiAgICAvLyBSZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBzdGFjay5zZXQoc3JjVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICBtZXJnZUZ1bmMobmV3VmFsdWUsIHNyY1ZhbHVlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIHN0YWNrWydkZWxldGUnXShzcmNWYWx1ZSk7XG4gIH1cbiAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGJhc2VSZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIG1ldGhvZHMgbGlrZSBgXy5mb3JJbmAgYW5kIGBfLmZvck93bmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAsIHVubGVzcyBga2V5YCBpcyBcIl9fcHJvdG9fX1wiIG9yIFwiY29uc3RydWN0b3JcIi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHNhZmVHZXQob2JqZWN0LCBrZXkpIHtcbiAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyAmJiB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdFtrZXldO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHBsYWluIG9iamVjdCBmbGF0dGVuaW5nIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZ1xuICoga2V5ZWQgcHJvcGVydGllcyBvZiBgdmFsdWVgIHRvIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBwbGFpbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgcGxhaW4gb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBuZXcgRm9vKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIF8udG9QbGFpbk9iamVjdChuZXcgRm9vKSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfVxuICovXG5mdW5jdGlvbiB0b1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHZhbHVlLCBrZXlzSW4odmFsdWUpKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCwgdHJ1ZSkgOiBiYXNlS2V5c0luKG9iamVjdCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5tZXJnZWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY3VzdG9taXplcmAgd2hpY2hcbiAqIGlzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgbWVyZ2VkIHZhbHVlcyBvZiB0aGUgZGVzdGluYXRpb24gYW5kIHNvdXJjZVxuICogcHJvcGVydGllcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGAsIG1lcmdpbmcgaXMgaGFuZGxlZCBieSB0aGVcbiAqIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGludm9rZWQgd2l0aCBzaXggYXJndW1lbnRzOlxuICogKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBzb3VyY2VzIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSkge1xuICogICBpZiAoXy5pc0FycmF5KG9ialZhbHVlKSkge1xuICogICAgIHJldHVybiBvYmpWYWx1ZS5jb25jYXQoc3JjVmFsdWUpO1xuICogICB9XG4gKiB9XG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbMV0sICdiJzogWzJdIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogWzNdLCAnYic6IFs0XSB9O1xuICpcbiAqIF8ubWVyZ2VXaXRoKG9iamVjdCwgb3RoZXIsIGN1c3RvbWl6ZXIpO1xuICogLy8gPT4geyAnYSc6IFsxLCAzXSwgJ2InOiBbMiwgNF0gfVxuICovXG52YXIgbWVyZ2VXaXRoID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyKSB7XG4gIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIpO1xufSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VXaXRoO1xuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBtZXJnZVdpdGggfSBmcm9tIFwibG9kYXNoLm1lcmdld2l0aFwiO1xuZXhwb3J0IGZ1bmN0aW9uIG9taXQob2JqZWN0LCBrZXlzKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleXMuaW5jbHVkZXMoa2V5KSkgcmV0dXJuO1xuICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBpY2sob2JqZWN0LCBrZXlzKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdChvYmplY3QsIGtleXMpIHtcbiAgdmFyIHBpY2tlZCA9IHt9O1xuICB2YXIgb21pdHRlZCA9IHt9O1xuICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBwaWNrZWRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbWl0dGVkW2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gW3BpY2tlZCwgb21pdHRlZF07XG59XG4vKipcbiAqIEdldCB2YWx1ZSBmcm9tIGEgZGVlcGx5IG5lc3RlZCBvYmplY3QgdXNpbmcgYSBzdHJpbmcgcGF0aC5cbiAqIE1lbW9pemVzIHRoZSB2YWx1ZS5cbiAqIEBwYXJhbSBvYmogLSB0aGUgb2JqZWN0XG4gKiBAcGFyYW0gcGF0aCAtIHRoZSBzdHJpbmcgcGF0aFxuICogQHBhcmFtIGRlZiAgLSB0aGUgZmFsbGJhY2sgdmFsdWVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCwgZmFsbGJhY2ssIGluZGV4KSB7XG4gIHZhciBrZXkgPSB0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIiA/IHBhdGguc3BsaXQoXCIuXCIpIDogW3BhdGhdO1xuXG4gIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGtleS5sZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBpZiAoIW9iaikgYnJlYWs7XG4gICAgb2JqID0gb2JqW2tleVtpbmRleF1dO1xuICB9XG5cbiAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkID8gZmFsbGJhY2sgOiBvYmo7XG59XG5leHBvcnQgdmFyIG1lbW9pemUgPSBmbiA9PiB7XG4gIHZhciBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbiAgdmFyIG1lbW9pemVkRm4gPSAob2JqLCBwYXRoLCBmYWxsYmFjaywgaW5kZXgpID0+IHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIGZuKG9iaiwgcGF0aCwgZmFsbGJhY2spO1xuICAgIH1cblxuICAgIGlmICghY2FjaGUuaGFzKG9iaikpIHtcbiAgICAgIGNhY2hlLnNldChvYmosIG5ldyBNYXAoKSk7XG4gICAgfVxuXG4gICAgdmFyIG1hcCA9IGNhY2hlLmdldChvYmopO1xuXG4gICAgaWYgKG1hcC5oYXMocGF0aCkpIHtcbiAgICAgIHJldHVybiBtYXAuZ2V0KHBhdGgpO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IGZuKG9iaiwgcGF0aCwgZmFsbGJhY2ssIGluZGV4KTtcbiAgICBtYXAuc2V0KHBhdGgsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgcmV0dXJuIG1lbW9pemVkRm47XG59O1xuZXhwb3J0IHZhciBtZW1vaXplZEdldCA9IG1lbW9pemUoZ2V0KTtcbi8qKlxuICogR2V0IHZhbHVlIGZyb20gZGVlcGx5IG5lc3RlZCBvYmplY3QsIGJhc2VkIG9uIHBhdGhcbiAqIEl0IHJldHVybnMgdGhlIHBhdGggdmFsdWUgaWYgbm90IGZvdW5kIGluIG9iamVjdFxuICpcbiAqIEBwYXJhbSBwYXRoIC0gdGhlIHN0cmluZyBwYXRoIG9yIHZhbHVlXG4gKiBAcGFyYW0gc2NhbGUgLSB0aGUgc3RyaW5nIHBhdGggb3IgdmFsdWVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2l0aERlZmF1bHQocGF0aCwgc2NhbGUpIHtcbiAgcmV0dXJuIG1lbW9pemVkR2V0KHNjYWxlLCBwYXRoLCBwYXRoKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpdGVtcyBvZiBhbiBvYmplY3QgdGhhdCBtZWV0IHRoZSBjb25kaXRpb24gc3BlY2lmaWVkIGluIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIG9iamVjdCB0aGUgb2JqZWN0IHRvIGxvb3AgdGhyb3VnaFxuICogQHBhcmFtIGZuIFRoZSBmaWx0ZXIgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdEZpbHRlcihvYmplY3QsIGZuKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgdmFyIHNob3VsZFBhc3MgPSBmbih2YWx1ZSwga2V5LCBvYmplY3QpO1xuXG4gICAgaWYgKHNob3VsZFBhc3MpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCB2YXIgZmlsdGVyVW5kZWZpbmVkID0gb2JqZWN0ID0+IG9iamVjdEZpbHRlcihvYmplY3QsIHZhbCA9PiB2YWwgIT09IG51bGwgJiYgdmFsICE9PSB1bmRlZmluZWQpO1xuZXhwb3J0IHZhciBvYmplY3RLZXlzID0gb2JqID0+IE9iamVjdC5rZXlzKG9iaik7XG4vKipcbiAqIE9iamVjdC5lbnRyaWVzIHBvbHlmaWxsIGZvciBOb2RldjEwIGNvbXBhdGliaWxpdHlcbiAqL1xuXG5leHBvcnQgdmFyIGZyb21FbnRyaWVzID0gZW50cmllcyA9PiBlbnRyaWVzLnJlZHVjZSgoY2FycnksIF9yZWYpID0+IHtcbiAgdmFyIFtrZXksIHZhbHVlXSA9IF9yZWY7XG4gIGNhcnJ5W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIGNhcnJ5O1xufSwge30pO1xuLyoqXG4gKiBHZXQgdGhlIENTUyB2YXJpYWJsZSByZWYgc3RvcmVkIGluIHRoZSB0aGVtZVxuICovXG5cbmV4cG9ydCB2YXIgZ2V0Q1NTVmFyID0gKHRoZW1lLCBzY2FsZSwgdmFsdWUpID0+IHtcbiAgdmFyIF90aGVtZSRfX2Nzc01hcCQkdmFyUiwgX3RoZW1lJF9fY3NzTWFwJDtcblxuICByZXR1cm4gKF90aGVtZSRfX2Nzc01hcCQkdmFyUiA9IChfdGhlbWUkX19jc3NNYXAkID0gdGhlbWUuX19jc3NNYXBbc2NhbGUgKyBcIi5cIiArIHZhbHVlXSkgPT0gbnVsbCA/IHZvaWQgMCA6IF90aGVtZSRfX2Nzc01hcCQudmFyUmVmKSAhPSBudWxsID8gX3RoZW1lJF9fY3NzTWFwJCR2YXJSIDogdmFsdWU7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JqZWN0LmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcldpbmRvdyhub2RlKSB7XG4gIHZhciBfZ2V0T3duZXJEb2N1bWVudCRkZWYsIF9nZXRPd25lckRvY3VtZW50O1xuXG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgRWxlbWVudCA/IChfZ2V0T3duZXJEb2N1bWVudCRkZWYgPSAoX2dldE93bmVyRG9jdW1lbnQgPSBnZXRPd25lckRvY3VtZW50KG5vZGUpKSA9PSBudWxsID8gdm9pZCAwIDogX2dldE93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpICE9IG51bGwgPyBfZ2V0T3duZXJEb2N1bWVudCRkZWYgOiB3aW5kb3cgOiB3aW5kb3c7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJEb2N1bWVudChub2RlKSB7XG4gIHZhciBfbm9kZSRvd25lckRvY3VtZW50O1xuXG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgRWxlbWVudCA/IChfbm9kZSRvd25lckRvY3VtZW50ID0gbm9kZS5vd25lckRvY3VtZW50KSAhPSBudWxsID8gX25vZGUkb3duZXJEb2N1bWVudCA6IGRvY3VtZW50IDogZG9jdW1lbnQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FuVXNlRE9NKCkge1xuICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cuZG9jdW1lbnQgJiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xufVxuZXhwb3J0IHZhciBpc0Jyb3dzZXIgPSBjYW5Vc2VET00oKTtcbmV4cG9ydCB2YXIgZGF0YUF0dHIgPSBjb25kaXRpb24gPT4gY29uZGl0aW9uID8gXCJcIiA6IHVuZGVmaW5lZDtcbmV4cG9ydCB2YXIgYXJpYUF0dHIgPSBjb25kaXRpb24gPT4gY29uZGl0aW9uID8gdHJ1ZSA6IHVuZGVmaW5lZDtcbmV4cG9ydCB2YXIgY3ggPSBmdW5jdGlvbiBjeCgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNsYXNzTmFtZXMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgY2xhc3NOYW1lc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBjbGFzc05hbWVzLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKTtcbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aXZlRWxlbWVudChub2RlKSB7XG4gIHZhciBkb2MgPSBnZXRPd25lckRvY3VtZW50KG5vZGUpO1xuICByZXR1cm4gZG9jID09IG51bGwgPyB2b2lkIDAgOiBkb2MuYWN0aXZlRWxlbWVudDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb250YWlucyhwYXJlbnQsIGNoaWxkKSB7XG4gIGlmICghcGFyZW50KSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBwYXJlbnQgPT09IGNoaWxkIHx8IHBhcmVudC5jb250YWlucyhjaGlsZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkRG9tRXZlbnQodGFyZ2V0LCBldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICB9O1xufVxuLyoqXG4gKiBHZXQgdGhlIG5vcm1hbGl6ZWQgZXZlbnQga2V5IGFjcm9zcyBhbGwgYnJvd3NlcnNcbiAqIEBwYXJhbSBldmVudCBrZXlib2FyZCBldmVudFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVFdmVudEtleShldmVudCkge1xuICB2YXIge1xuICAgIGtleSxcbiAgICBrZXlDb2RlXG4gIH0gPSBldmVudDtcbiAgdmFyIGlzQXJyb3dLZXkgPSBrZXlDb2RlID49IDM3ICYmIGtleUNvZGUgPD0gNDAgJiYga2V5LmluZGV4T2YoXCJBcnJvd1wiKSAhPT0gMDtcbiAgdmFyIGV2ZW50S2V5ID0gaXNBcnJvd0tleSA/IFwiQXJyb3dcIiArIGtleSA6IGtleTtcbiAgcmV0dXJuIGV2ZW50S2V5O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlbGF0ZWRUYXJnZXQoZXZlbnQpIHtcbiAgdmFyIF9ldmVudCR0YXJnZXQsIF9yZWYsIF9ldmVudCRyZWxhdGVkVGFyZ2V0O1xuXG4gIHZhciB0YXJnZXQgPSAoX2V2ZW50JHRhcmdldCA9IGV2ZW50LnRhcmdldCkgIT0gbnVsbCA/IF9ldmVudCR0YXJnZXQgOiBldmVudC5jdXJyZW50VGFyZ2V0O1xuICB2YXIgYWN0aXZlRWxlbWVudCA9IGdldEFjdGl2ZUVsZW1lbnQodGFyZ2V0KTtcbiAgdmFyIG9yaWdpbmFsVGFyZ2V0ID0gZXZlbnQubmF0aXZlRXZlbnQuZXhwbGljaXRPcmlnaW5hbFRhcmdldDtcbiAgcmV0dXJuIChfcmVmID0gKF9ldmVudCRyZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldCkgIT0gbnVsbCA/IF9ldmVudCRyZWxhdGVkVGFyZ2V0IDogb3JpZ2luYWxUYXJnZXQpICE9IG51bGwgPyBfcmVmIDogYWN0aXZlRWxlbWVudDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1JpZ2h0Q2xpY2soZXZlbnQpIHtcbiAgcmV0dXJuIGV2ZW50LmJ1dHRvbiAhPT0gMDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRvbS5qcy5tYXAiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiwgaXNOdW1iZXIsIF9fREVWX18sIF9fVEVTVF9fIH0gZnJvbSBcIi4vYXNzZXJ0aW9uXCI7XG5leHBvcnQgZnVuY3Rpb24gcnVuSWZGbih2YWx1ZU9yRm4pIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWVPckZuKSA/IHZhbHVlT3JGbiguLi5hcmdzKSA6IHZhbHVlT3JGbjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYWxsQWxsSGFuZGxlcnMoKSB7XG4gIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgZm5zW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gZnVuYyhldmVudCkge1xuICAgIGZucy5zb21lKGZuID0+IHtcbiAgICAgIGZuID09IG51bGwgPyB2b2lkIDAgOiBmbihldmVudCk7XG4gICAgICByZXR1cm4gZXZlbnQgPT0gbnVsbCA/IHZvaWQgMCA6IGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgfSk7XG4gIH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2FsbEFsbCgpIHtcbiAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICBmbnNbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBtZXJnZWRGbihhcmcpIHtcbiAgICBmbnMuZm9yRWFjaChmbiA9PiB7XG4gICAgICBmbiA9PSBudWxsID8gdm9pZCAwIDogZm4oYXJnKTtcbiAgICB9KTtcbiAgfTtcbn1cbmV4cG9ydCB2YXIgY29tcG9zZSA9IGZ1bmN0aW9uIGNvbXBvc2UoZm4xKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBmbnNbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gIH1cblxuICByZXR1cm4gZm5zLnJlZHVjZSgoZjEsIGYyKSA9PiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGYxKGYyKC4uLmFyZ3VtZW50cykpO1xuICB9LCBmbjEpO1xufTtcbmV4cG9ydCBmdW5jdGlvbiBvbmNlKGZuKSB7XG4gIHZhciByZXN1bHQ7XG4gIHJldHVybiBmdW5jdGlvbiBmdW5jKCkge1xuICAgIGlmIChmbikge1xuICAgICAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0ID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICBmbiA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbmV4cG9ydCB2YXIgbm9vcCA9ICgpID0+IHt9O1xuZXhwb3J0IHZhciB3YXJuID0gb25jZShvcHRpb25zID0+ICgpID0+IHtcbiAgdmFyIHtcbiAgICBjb25kaXRpb24sXG4gICAgbWVzc2FnZVxuICB9ID0gb3B0aW9ucztcblxuICBpZiAoY29uZGl0aW9uICYmIF9fREVWX18pIHtcbiAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gIH1cbn0pO1xuZXhwb3J0IHZhciBlcnJvciA9IG9uY2Uob3B0aW9ucyA9PiAoKSA9PiB7XG4gIHZhciB7XG4gICAgY29uZGl0aW9uLFxuICAgIG1lc3NhZ2VcbiAgfSA9IG9wdGlvbnM7XG5cbiAgaWYgKGNvbmRpdGlvbiAmJiBfX0RFVl9fKSB7XG4gICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgfVxufSk7XG5cbnZhciBwcm9taXNlTWljcm90YXNrID0gY2FsbGJhY2sgPT4ge1xuICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydCB2YXIgc2NoZWR1bGVNaWNyb3Rhc2sgPSBfX1RFU1RfXyA/IGZuID0+IGZuKCkgOiB0eXBlb2YgcXVldWVNaWNyb3Rhc2sgPT09IFwiZnVuY3Rpb25cIiA/IHF1ZXVlTWljcm90YXNrIDogcHJvbWlzZU1pY3JvdGFzaztcbmV4cG9ydCB2YXIgcGlwZSA9IGZ1bmN0aW9uIHBpcGUoKSB7XG4gIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW42KSwgX2tleTYgPSAwOyBfa2V5NiA8IF9sZW42OyBfa2V5NisrKSB7XG4gICAgZm5zW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG4gIH1cblxuICByZXR1cm4gdiA9PiBmbnMucmVkdWNlKChhLCBiKSA9PiBiKGEpLCB2KTtcbn07XG5cbnZhciBkaXN0YW5jZTFEID0gKGEsIGIpID0+IE1hdGguYWJzKGEgLSBiKTtcblxudmFyIGlzUG9pbnQgPSBwb2ludCA9PiBcInhcIiBpbiBwb2ludCAmJiBcInlcIiBpbiBwb2ludDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlKGEsIGIpIHtcbiAgaWYgKGlzTnVtYmVyKGEpICYmIGlzTnVtYmVyKGIpKSB7XG4gICAgcmV0dXJuIGRpc3RhbmNlMUQoYSwgYik7XG4gIH1cblxuICBpZiAoaXNQb2ludChhKSAmJiBpc1BvaW50KGIpKSB7XG4gICAgdmFyIHhEZWx0YSA9IGRpc3RhbmNlMUQoYS54LCBiLngpO1xuICAgIHZhciB5RGVsdGEgPSBkaXN0YW5jZTFEKGEueSwgYi55KTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHhEZWx0YSAqKiAyICsgeURlbHRhICoqIDIpO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mdW5jdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBpc051bWJlciwgaXNPYmplY3QgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuXG52YXIgYW5hbHl6ZUNTU1ZhbHVlID0gdmFsdWUgPT4ge1xuICB2YXIgbnVtID0gcGFyc2VGbG9hdCh2YWx1ZS50b1N0cmluZygpKTtcbiAgdmFyIHVuaXQgPSB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoU3RyaW5nKG51bSksIFwiXCIpO1xuICByZXR1cm4ge1xuICAgIHVuaXRsZXNzOiAhdW5pdCxcbiAgICB2YWx1ZTogbnVtLFxuICAgIHVuaXRcbiAgfTtcbn07XG5cbmV4cG9ydCB2YXIgcHggPSB2YWx1ZSA9PiB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdmFsdWU7XG4gIHZhciB7XG4gICAgdW5pdGxlc3NcbiAgfSA9IGFuYWx5emVDU1NWYWx1ZSh2YWx1ZSk7XG4gIHJldHVybiB1bml0bGVzcyB8fCBpc051bWJlcih2YWx1ZSkgPyB2YWx1ZSArIFwicHhcIiA6IHZhbHVlO1xufTtcbmV4cG9ydCB2YXIgdG9rZW5Ub0NTU1ZhciA9IChzY2FsZSwgdmFsdWUpID0+IHRoZW1lID0+IHtcbiAgdmFyIHZhbHVlU3RyID0gU3RyaW5nKHZhbHVlKTtcbiAgdmFyIGtleSA9IHNjYWxlID8gc2NhbGUgKyBcIi5cIiArIHZhbHVlU3RyIDogdmFsdWVTdHI7XG4gIHJldHVybiBpc09iamVjdCh0aGVtZS5fX2Nzc01hcCkgJiYga2V5IGluIHRoZW1lLl9fY3NzTWFwID8gdGhlbWUuX19jc3NNYXBba2V5XS52YXJSZWYgOiB2YWx1ZTtcbn07XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNmb3JtKG9wdGlvbnMpIHtcbiAgdmFyIHtcbiAgICBzY2FsZSxcbiAgICB0cmFuc2Zvcm0sXG4gICAgY29tcG9zZVxuICB9ID0gb3B0aW9ucztcblxuICB2YXIgZm4gPSAodmFsdWUsIHRoZW1lKSA9PiB7XG4gICAgdmFyIF90cmFuc2Zvcm07XG5cbiAgICB2YXIgX3ZhbHVlID0gdG9rZW5Ub0NTU1ZhcihzY2FsZSwgdmFsdWUpKHRoZW1lKTtcblxuICAgIHZhciByZXN1bHQgPSAoX3RyYW5zZm9ybSA9IHRyYW5zZm9ybSA9PSBudWxsID8gdm9pZCAwIDogdHJhbnNmb3JtKF92YWx1ZSwgdGhlbWUpKSAhPSBudWxsID8gX3RyYW5zZm9ybSA6IF92YWx1ZTtcblxuICAgIGlmIChjb21wb3NlKSB7XG4gICAgICByZXN1bHQgPSBjb21wb3NlKHJlc3VsdCwgdGhlbWUpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIGZuO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3JlYXRlLXRyYW5zZm9ybS5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVUcmFuc2Zvcm0gfSBmcm9tIFwiLi9jcmVhdGUtdHJhbnNmb3JtXCI7XG5leHBvcnQgZnVuY3Rpb24gdG9Db25maWcoc2NhbGUsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gcHJvcGVydHkgPT4ge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBwcm9wZXJ0eSxcbiAgICAgIHNjYWxlXG4gICAgfTtcbiAgICByZXN1bHQudHJhbnNmb3JtID0gY3JlYXRlVHJhbnNmb3JtKHtcbiAgICAgIHNjYWxlLFxuICAgICAgdHJhbnNmb3JtXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxudmFyIGdldFJ0bCA9IChfcmVmKSA9PiB7XG4gIHZhciB7XG4gICAgcnRsLFxuICAgIGx0clxuICB9ID0gX3JlZjtcbiAgcmV0dXJuIHRoZW1lID0+IHRoZW1lLmRpcmVjdGlvbiA9PT0gXCJydGxcIiA/IHJ0bCA6IGx0cjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpY2FsKG9wdGlvbnMpIHtcbiAgdmFyIHtcbiAgICBwcm9wZXJ0eSxcbiAgICBzY2FsZSxcbiAgICB0cmFuc2Zvcm1cbiAgfSA9IG9wdGlvbnM7XG4gIHJldHVybiB7XG4gICAgc2NhbGUsXG4gICAgcHJvcGVydHk6IGdldFJ0bChwcm9wZXJ0eSksXG4gICAgdHJhbnNmb3JtOiBzY2FsZSA/IGNyZWF0ZVRyYW5zZm9ybSh7XG4gICAgICBzY2FsZSxcbiAgICAgIGNvbXBvc2U6IHRyYW5zZm9ybVxuICAgIH0pIDogdHJhbnNmb3JtXG4gIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9wLWNvbmZpZy5qcy5tYXAiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5pbXBvcnQgeyBpc051bWJlciB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5pbXBvcnQgeyBjcmVhdGVUcmFuc2Zvcm0sIHB4IGFzIHB4VHJhbnNmb3JtIH0gZnJvbSBcIi4uL2NyZWF0ZS10cmFuc2Zvcm1cIjtcbmltcG9ydCB7IGxvZ2ljYWwsIHRvQ29uZmlnIH0gZnJvbSBcIi4uL3Byb3AtY29uZmlnXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90eXBlc1wiO1xuXG5mdW5jdGlvbiBmcmFjdGlvbmFsVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuICFpc051bWJlcih2YWx1ZSkgfHwgdmFsdWUgPiAxID8gdmFsdWUgOiB2YWx1ZSAqIDEwMCArIFwiJVwiO1xufVxuXG5leHBvcnQgdmFyIHQgPSB7XG4gIGJvcmRlcldpZHRoczogdG9Db25maWcoXCJib3JkZXJXaWR0aHNcIiksXG4gIGJvcmRlclN0eWxlczogdG9Db25maWcoXCJib3JkZXJTdHlsZXNcIiksXG4gIGNvbG9yczogdG9Db25maWcoXCJjb2xvcnNcIiksXG4gIGJvcmRlcnM6IHRvQ29uZmlnKFwiYm9yZGVyc1wiKSxcbiAgcmFkaWk6IHRvQ29uZmlnKFwicmFkaWlcIiwgcHhUcmFuc2Zvcm0pLFxuICBzcGFjZTogdG9Db25maWcoXCJzcGFjZVwiLCBweFRyYW5zZm9ybSksXG4gIHNwYWNlVDogdG9Db25maWcoXCJzcGFjZVwiLCBweFRyYW5zZm9ybSksXG4gIHByb3A6IChwcm9wZXJ0eSwgc2NhbGUsIHRyYW5zZm9ybSkgPT4gX2V4dGVuZHMoe1xuICAgIHByb3BlcnR5LFxuICAgIHNjYWxlXG4gIH0sIHNjYWxlICYmIHtcbiAgICB0cmFuc2Zvcm06IGNyZWF0ZVRyYW5zZm9ybSh7XG4gICAgICBzY2FsZSxcbiAgICAgIHRyYW5zZm9ybVxuICAgIH0pXG4gIH0pLFxuICBzaXplczogdG9Db25maWcoXCJzaXplc1wiLCBweFRyYW5zZm9ybSksXG4gIHNpemVzVDogdG9Db25maWcoXCJzaXplc1wiLCBmcmFjdGlvbmFsVmFsdWUpLFxuICBzaGFkb3dzOiB0b0NvbmZpZyhcInNoYWRvd3NcIiksXG4gIGxvZ2ljYWxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJmdW5jdGlvbiBfd3JhcFJlZ0V4cChyZSwgZ3JvdXBzKSB7IF93cmFwUmVnRXhwID0gZnVuY3Rpb24gX3dyYXBSZWdFeHAocmUsIGdyb3VwcykgeyByZXR1cm4gbmV3IEJhYmVsUmVnRXhwKHJlLCB1bmRlZmluZWQsIGdyb3Vwcyk7IH07IHZhciBfUmVnRXhwID0gX3dyYXBOYXRpdmVTdXBlcihSZWdFeHApOyB2YXIgX3N1cGVyID0gUmVnRXhwLnByb3RvdHlwZTsgdmFyIF9ncm91cHMgPSBuZXcgV2Vha01hcCgpOyBmdW5jdGlvbiBCYWJlbFJlZ0V4cChyZSwgZmxhZ3MsIGdyb3VwcykgeyB2YXIgX3RoaXMgPSBfUmVnRXhwLmNhbGwodGhpcywgcmUsIGZsYWdzKTsgX2dyb3Vwcy5zZXQoX3RoaXMsIGdyb3VwcyB8fCBfZ3JvdXBzLmdldChyZSkpOyByZXR1cm4gX3RoaXM7IH0gX2luaGVyaXRzKEJhYmVsUmVnRXhwLCBfUmVnRXhwKTsgQmFiZWxSZWdFeHAucHJvdG90eXBlLmV4ZWMgPSBmdW5jdGlvbiAoc3RyKSB7IHZhciByZXN1bHQgPSBfc3VwZXIuZXhlYy5jYWxsKHRoaXMsIHN0cik7IGlmIChyZXN1bHQpIHJlc3VsdC5ncm91cHMgPSBidWlsZEdyb3VwcyhyZXN1bHQsIHRoaXMpOyByZXR1cm4gcmVzdWx0OyB9OyBCYWJlbFJlZ0V4cC5wcm90b3R5cGVbU3ltYm9sLnJlcGxhY2VdID0gZnVuY3Rpb24gKHN0ciwgc3Vic3RpdHV0aW9uKSB7IGlmICh0eXBlb2Ygc3Vic3RpdHV0aW9uID09PSBcInN0cmluZ1wiKSB7IHZhciBncm91cHMgPSBfZ3JvdXBzLmdldCh0aGlzKTsgcmV0dXJuIF9zdXBlcltTeW1ib2wucmVwbGFjZV0uY2FsbCh0aGlzLCBzdHIsIHN1YnN0aXR1dGlvbi5yZXBsYWNlKC9cXCQ8KFtePl0rKT4vZywgZnVuY3Rpb24gKF8sIG5hbWUpIHsgcmV0dXJuIFwiJFwiICsgZ3JvdXBzW25hbWVdOyB9KSk7IH0gZWxzZSBpZiAodHlwZW9mIHN1YnN0aXR1dGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7IHZhciBfdGhpcyA9IHRoaXM7IHJldHVybiBfc3VwZXJbU3ltYm9sLnJlcGxhY2VdLmNhbGwodGhpcywgc3RyLCBmdW5jdGlvbiAoKSB7IHZhciBhcmdzID0gW107IGFyZ3MucHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpOyBpZiAodHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSAhPT0gXCJvYmplY3RcIikgeyBhcmdzLnB1c2goYnVpbGRHcm91cHMoYXJncywgX3RoaXMpKTsgfSByZXR1cm4gc3Vic3RpdHV0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpOyB9KTsgfSBlbHNlIHsgcmV0dXJuIF9zdXBlcltTeW1ib2wucmVwbGFjZV0uY2FsbCh0aGlzLCBzdHIsIHN1YnN0aXR1dGlvbik7IH0gfTsgZnVuY3Rpb24gYnVpbGRHcm91cHMocmVzdWx0LCByZSkgeyB2YXIgZyA9IF9ncm91cHMuZ2V0KHJlKTsgcmV0dXJuIE9iamVjdC5rZXlzKGcpLnJlZHVjZShmdW5jdGlvbiAoZ3JvdXBzLCBuYW1lKSB7IGdyb3Vwc1tuYW1lXSA9IHJlc3VsdFtnW25hbWVdXTsgcmV0dXJuIGdyb3VwczsgfSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7IH0gcmV0dXJuIF93cmFwUmVnRXhwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHsgdmFyIF9jYWNoZSA9IHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBNYXAoKSA6IHVuZGVmaW5lZDsgX3dyYXBOYXRpdmVTdXBlciA9IGZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHsgaWYgKENsYXNzID09PSBudWxsIHx8ICFfaXNOYXRpdmVGdW5jdGlvbihDbGFzcykpIHJldHVybiBDbGFzczsgaWYgKHR5cGVvZiBDbGFzcyAhPT0gXCJmdW5jdGlvblwiKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBpZiAodHlwZW9mIF9jYWNoZSAhPT0gXCJ1bmRlZmluZWRcIikgeyBpZiAoX2NhY2hlLmhhcyhDbGFzcykpIHJldHVybiBfY2FjaGUuZ2V0KENsYXNzKTsgX2NhY2hlLnNldChDbGFzcywgV3JhcHBlcik7IH0gZnVuY3Rpb24gV3JhcHBlcigpIHsgcmV0dXJuIF9jb25zdHJ1Y3QoQ2xhc3MsIGFyZ3VtZW50cywgX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yKTsgfSBXcmFwcGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBXcmFwcGVyLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyByZXR1cm4gX3NldFByb3RvdHlwZU9mKFdyYXBwZXIsIENsYXNzKTsgfTsgcmV0dXJuIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7IF9jb25zdHJ1Y3QgPSBSZWZsZWN0LmNvbnN0cnVjdDsgfSBlbHNlIHsgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyB2YXIgYSA9IFtudWxsXTsgYS5wdXNoLmFwcGx5KGEsIGFyZ3MpOyB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7IHZhciBpbnN0YW5jZSA9IG5ldyBDb25zdHJ1Y3RvcigpOyBpZiAoQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihpbnN0YW5jZSwgQ2xhc3MucHJvdG90eXBlKTsgcmV0dXJuIGluc3RhbmNlOyB9OyB9IHJldHVybiBfY29uc3RydWN0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVGdW5jdGlvbihmbikgeyByZXR1cm4gRnVuY3Rpb24udG9TdHJpbmcuY2FsbChmbikuaW5kZXhPZihcIltuYXRpdmUgY29kZV1cIikgIT09IC0xOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIGRpcmVjdGlvbk1hcCA9IHtcbiAgXCJ0by10XCI6IFwidG8gdG9wXCIsXG4gIFwidG8tdHJcIjogXCJ0byB0b3AgcmlnaHRcIixcbiAgXCJ0by1yXCI6IFwidG8gcmlnaHRcIixcbiAgXCJ0by1iclwiOiBcInRvIGJvdHRvbSByaWdodFwiLFxuICBcInRvLWJcIjogXCJ0byBib3R0b21cIixcbiAgXCJ0by1ibFwiOiBcInRvIGJvdHRvbSBsZWZ0XCIsXG4gIFwidG8tbFwiOiBcInRvIGxlZnRcIixcbiAgXCJ0by10bFwiOiBcInRvIHRvcCBsZWZ0XCJcbn07XG52YXIgdmFsdWVTZXQgPSBuZXcgU2V0KE9iamVjdC52YWx1ZXMoZGlyZWN0aW9uTWFwKSk7XG52YXIgZ2xvYmFsU2V0ID0gbmV3IFNldChbXCJub25lXCIsIFwiLW1vei1pbml0aWFsXCIsIFwiaW5oZXJpdFwiLCBcImluaXRpYWxcIiwgXCJyZXZlcnRcIiwgXCJ1bnNldFwiXSk7XG5cbnZhciB0cmltU3BhY2UgPSBzdHIgPT4gc3RyLnRyaW0oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR3JhZGllbnQodmFsdWUsIHRoZW1lKSB7XG4gIHZhciBfcmVnZXgkZXhlYyRncm91cHMsIF9yZWdleCRleGVjO1xuXG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IGdsb2JhbFNldC5oYXModmFsdWUpKSByZXR1cm4gdmFsdWU7XG5cbiAgdmFyIHJlZ2V4ID0gLyojX19QVVJFX18qL193cmFwUmVnRXhwKC8oXltcXHgyREEtWmEtel0rKVxcKCgoLiopKVxcKS9nLCB7XG4gICAgdHlwZTogMSxcbiAgICB2YWx1ZXM6IDJcbiAgfSk7XG5cbiAgdmFyIHtcbiAgICB0eXBlLFxuICAgIHZhbHVlc1xuICB9ID0gKF9yZWdleCRleGVjJGdyb3VwcyA9IChfcmVnZXgkZXhlYyA9IHJlZ2V4LmV4ZWModmFsdWUpKSA9PSBudWxsID8gdm9pZCAwIDogX3JlZ2V4JGV4ZWMuZ3JvdXBzKSAhPSBudWxsID8gX3JlZ2V4JGV4ZWMkZ3JvdXBzIDoge307XG4gIGlmICghdHlwZSB8fCAhdmFsdWVzKSByZXR1cm4gdmFsdWU7XG5cbiAgdmFyIF90eXBlID0gdHlwZS5pbmNsdWRlcyhcIi1ncmFkaWVudFwiKSA/IHR5cGUgOiB0eXBlICsgXCItZ3JhZGllbnRcIjtcblxuICB2YXIgW21heWJlRGlyZWN0aW9uLCAuLi5zdG9wc10gPSB2YWx1ZXMuc3BsaXQoXCIsXCIpLm1hcCh0cmltU3BhY2UpLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKChzdG9wcyA9PSBudWxsID8gdm9pZCAwIDogc3RvcHMubGVuZ3RoKSA9PT0gMCkgcmV0dXJuIHZhbHVlO1xuICB2YXIgZGlyZWN0aW9uID0gbWF5YmVEaXJlY3Rpb24gaW4gZGlyZWN0aW9uTWFwID8gZGlyZWN0aW9uTWFwW21heWJlRGlyZWN0aW9uXSA6IG1heWJlRGlyZWN0aW9uO1xuICBzdG9wcy51bnNoaWZ0KGRpcmVjdGlvbik7XG5cbiAgdmFyIF92YWx1ZXMgPSBzdG9wcy5tYXAoc3RvcCA9PiB7XG4gICAgLy8gaWYgc3RvcCBpcyB2YWxpZCBzaG9ydGhhbmQgZGlyZWN0aW9uLCByZXR1cm4gaXRcbiAgICBpZiAodmFsdWVTZXQuaGFzKHN0b3ApKSByZXR1cm4gc3RvcDsgLy8gY29sb3Igc3RvcCBjb3VsZCBiZSBgcmVkLjIwMCAyMCVgIGJhc2VkIG9uIGNzcyBncmFkaWVudCBzcGVjXG5cbiAgICB2YXIgW19jb2xvciwgX3N0b3BdID0gc3RvcC5zcGxpdChcIiBcIik7IC8vIGVsc2UsIGdldCBhbmQgdHJhbnNmb3JtIHRoZSBjb2xvciB0b2tlbiBvciBjc3MgdmFsdWVcblxuICAgIHZhciBrZXkgPSBcImNvbG9ycy5cIiArIF9jb2xvcjtcbiAgICB2YXIgY29sb3IgPSBrZXkgaW4gdGhlbWUuX19jc3NNYXAgPyB0aGVtZS5fX2Nzc01hcFtrZXldLnZhclJlZiA6IF9jb2xvcjtcbiAgICByZXR1cm4gX3N0b3AgPyBbY29sb3IsIF9zdG9wXS5qb2luKFwiIFwiKSA6IGNvbG9yO1xuICB9KTtcblxuICByZXR1cm4gX3R5cGUgKyBcIihcIiArIF92YWx1ZXMuam9pbihcIiwgXCIpICsgXCIpXCI7XG59XG5leHBvcnQgdmFyIGdyYWRpZW50VHJhbnNmb3JtID0gKHZhbHVlLCB0aGVtZSkgPT4gcGFyc2VHcmFkaWVudCh2YWx1ZSwgdGhlbWUgIT0gbnVsbCA/IHRoZW1lIDoge30pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtZ3JhZGllbnQuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHsgZ3JhZGllbnRUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vdXRpbHMvcGFyc2UtZ3JhZGllbnRcIjtcblxuZnVuY3Rpb24gYmdDbGlwVHJhbnNmb3JtKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gXCJ0ZXh0XCIgPyB7XG4gICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgICBiYWNrZ3JvdW5kQ2xpcDogXCJ0ZXh0XCJcbiAgfSA6IHtcbiAgICBiYWNrZ3JvdW5kQ2xpcDogdmFsdWVcbiAgfTtcbn1cblxuZXhwb3J0IHZhciBiYWNrZ3JvdW5kID0ge1xuICBiZzogdC5jb2xvcnMoXCJiYWNrZ3JvdW5kXCIpLFxuICBiZ0NvbG9yOiB0LmNvbG9ycyhcImJhY2tncm91bmRDb2xvclwiKSxcbiAgYmFja2dyb3VuZDogdC5jb2xvcnMoXCJiYWNrZ3JvdW5kXCIpLFxuICBiYWNrZ3JvdW5kQ29sb3I6IHQuY29sb3JzKFwiYmFja2dyb3VuZENvbG9yXCIpLFxuICBiYWNrZ3JvdW5kSW1hZ2U6IHRydWUsXG4gIGJhY2tncm91bmRTaXplOiB0cnVlLFxuICBiYWNrZ3JvdW5kUG9zaXRpb246IHRydWUsXG4gIGJhY2tncm91bmRSZXBlYXQ6IHRydWUsXG4gIGJhY2tncm91bmRBdHRhY2htZW50OiB0cnVlLFxuICBiYWNrZ3JvdW5kQmxlbmRNb2RlOiB0cnVlLFxuICBiYWNrZ3JvdW5kQ2xpcDoge1xuICAgIHRyYW5zZm9ybTogYmdDbGlwVHJhbnNmb3JtXG4gIH0sXG4gIGJnSW1hZ2U6IHQucHJvcChcImJhY2tncm91bmRJbWFnZVwiKSxcbiAgYmdJbWc6IHQucHJvcChcImJhY2tncm91bmRJbWFnZVwiKSxcbiAgYmdCbGVuZE1vZGU6IHQucHJvcChcImJhY2tncm91bmRCbGVuZE1vZGVcIiksXG4gIGJnU2l6ZTogdC5wcm9wKFwiYmFja2dyb3VuZFNpemVcIiksXG4gIGJnUG9zaXRpb246IHQucHJvcChcImJhY2tncm91bmRQb3NpdGlvblwiKSxcbiAgYmdQb3M6IHQucHJvcChcImJhY2tncm91bmRQb3NpdGlvblwiKSxcbiAgYmdSZXBlYXQ6IHQucHJvcChcImJhY2tncm91bmRSZXBlYXRcIiksXG4gIGJnQXR0YWNobWVudDogdC5wcm9wKFwiYmFja2dyb3VuZEF0dGFjaG1lbnRcIiksXG4gIGJnR3JhZGllbnQ6IHtcbiAgICBwcm9wZXJ0eTogXCJiYWNrZ3JvdW5kSW1hZ2VcIixcbiAgICB0cmFuc2Zvcm06IGdyYWRpZW50VHJhbnNmb3JtXG4gIH0sXG4gIGJnQ2xpcDoge1xuICAgIHRyYW5zZm9ybTogYmdDbGlwVHJhbnNmb3JtXG4gIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1iYWNrZ3JvdW5kLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgYm9yZGVyID0ge1xuICBib3JkZXI6IHQuYm9yZGVycyhcImJvcmRlclwiKSxcbiAgYm9yZGVyV2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyV2lkdGhcIiksXG4gIGJvcmRlclN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlclN0eWxlXCIpLFxuICBib3JkZXJDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJDb2xvclwiKSxcbiAgYm9yZGVyUmFkaXVzOiB0LnJhZGlpKFwiYm9yZGVyUmFkaXVzXCIpLFxuICBib3JkZXJUb3A6IHQuYm9yZGVycyhcImJvcmRlclRvcFwiKSxcbiAgYm9yZGVyQmxvY2tTdGFydDogdC5ib3JkZXJzKFwiYm9yZGVyQmxvY2tTdGFydFwiKSxcbiAgYm9yZGVyVG9wTGVmdFJhZGl1czogdC5yYWRpaShcImJvcmRlclRvcExlZnRSYWRpdXNcIiksXG4gIGJvcmRlclN0YXJ0U3RhcnRSYWRpdXM6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwicmFkaWlcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBcImJvcmRlclRvcExlZnRSYWRpdXNcIixcbiAgICAgIHJ0bDogXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiXG4gICAgfVxuICB9KSxcbiAgYm9yZGVyRW5kU3RhcnRSYWRpdXM6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwicmFkaWlcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIixcbiAgICAgIHJ0bDogXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiXG4gICAgfVxuICB9KSxcbiAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IHQucmFkaWkoXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiKSxcbiAgYm9yZGVyU3RhcnRFbmRSYWRpdXM6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwicmFkaWlcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsXG4gICAgICBydGw6IFwiYm9yZGVyVG9wTGVmdFJhZGl1c1wiXG4gICAgfVxuICB9KSxcbiAgYm9yZGVyRW5kRW5kUmFkaXVzOiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInJhZGlpXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiLFxuICAgICAgcnRsOiBcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIlxuICAgIH1cbiAgfSksXG4gIGJvcmRlclJpZ2h0OiB0LmJvcmRlcnMoXCJib3JkZXJSaWdodFwiKSxcbiAgYm9yZGVySW5saW5lRW5kOiB0LmJvcmRlcnMoXCJib3JkZXJJbmxpbmVFbmRcIiksXG4gIGJvcmRlckJvdHRvbTogdC5ib3JkZXJzKFwiYm9yZGVyQm90dG9tXCIpLFxuICBib3JkZXJCbG9ja0VuZDogdC5ib3JkZXJzKFwiYm9yZGVyQmxvY2tFbmRcIiksXG4gIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IHQucmFkaWkoXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCIpLFxuICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogdC5yYWRpaShcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCIpLFxuICBib3JkZXJMZWZ0OiB0LmJvcmRlcnMoXCJib3JkZXJMZWZ0XCIpLFxuICBib3JkZXJJbmxpbmVTdGFydDoge1xuICAgIHByb3BlcnR5OiBcImJvcmRlcklubGluZVN0YXJ0XCIsXG4gICAgc2NhbGU6IFwiYm9yZGVyc1wiXG4gIH0sXG4gIGJvcmRlcklubGluZVN0YXJ0UmFkaXVzOiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInJhZGlpXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogW1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIl0sXG4gICAgICBydGw6IFtcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIl1cbiAgICB9XG4gIH0pLFxuICBib3JkZXJJbmxpbmVFbmRSYWRpdXM6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwicmFkaWlcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBbXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCJdLFxuICAgICAgcnRsOiBbXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiXVxuICAgIH1cbiAgfSksXG4gIGJvcmRlclg6IHQuYm9yZGVycyhbXCJib3JkZXJMZWZ0XCIsIFwiYm9yZGVyUmlnaHRcIl0pLFxuICBib3JkZXJJbmxpbmU6IHQuYm9yZGVycyhcImJvcmRlcklubGluZVwiKSxcbiAgYm9yZGVyWTogdC5ib3JkZXJzKFtcImJvcmRlclRvcFwiLCBcImJvcmRlckJvdHRvbVwiXSksXG4gIGJvcmRlckJsb2NrOiB0LmJvcmRlcnMoXCJib3JkZXJCbG9ja1wiKSxcbiAgYm9yZGVyVG9wV2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyVG9wV2lkdGhcIiksXG4gIGJvcmRlckJsb2NrU3RhcnRXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJCbG9ja1N0YXJ0V2lkdGhcIiksXG4gIGJvcmRlclRvcENvbG9yOiB0LmNvbG9ycyhcImJvcmRlclRvcENvbG9yXCIpLFxuICBib3JkZXJCbG9ja1N0YXJ0Q29sb3I6IHQuY29sb3JzKFwiYm9yZGVyQmxvY2tTdGFydENvbG9yXCIpLFxuICBib3JkZXJUb3BTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJUb3BTdHlsZVwiKSxcbiAgYm9yZGVyQmxvY2tTdGFydFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlckJsb2NrU3RhcnRTdHlsZVwiKSxcbiAgYm9yZGVyQm90dG9tV2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyQm90dG9tV2lkdGhcIiksXG4gIGJvcmRlckJsb2NrRW5kV2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyQmxvY2tFbmRXaWR0aFwiKSxcbiAgYm9yZGVyQm90dG9tQ29sb3I6IHQuY29sb3JzKFwiYm9yZGVyQm90dG9tQ29sb3JcIiksXG4gIGJvcmRlckJsb2NrRW5kQ29sb3I6IHQuY29sb3JzKFwiYm9yZGVyQmxvY2tFbmRDb2xvclwiKSxcbiAgYm9yZGVyQm90dG9tU3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyQm90dG9tU3R5bGVcIiksXG4gIGJvcmRlckJsb2NrRW5kU3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyQmxvY2tFbmRTdHlsZVwiKSxcbiAgYm9yZGVyTGVmdFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlckxlZnRXaWR0aFwiKSxcbiAgYm9yZGVySW5saW5lU3RhcnRXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJJbmxpbmVTdGFydFdpZHRoXCIpLFxuICBib3JkZXJMZWZ0Q29sb3I6IHQuY29sb3JzKFwiYm9yZGVyTGVmdENvbG9yXCIpLFxuICBib3JkZXJJbmxpbmVTdGFydENvbG9yOiB0LmNvbG9ycyhcImJvcmRlcklubGluZVN0YXJ0Q29sb3JcIiksXG4gIGJvcmRlckxlZnRTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJMZWZ0U3R5bGVcIiksXG4gIGJvcmRlcklubGluZVN0YXJ0U3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVySW5saW5lU3RhcnRTdHlsZVwiKSxcbiAgYm9yZGVyUmlnaHRXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJSaWdodFdpZHRoXCIpLFxuICBib3JkZXJJbmxpbmVFbmRXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJJbmxpbmVFbmRXaWR0aFwiKSxcbiAgYm9yZGVyUmlnaHRDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJSaWdodENvbG9yXCIpLFxuICBib3JkZXJJbmxpbmVFbmRDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJJbmxpbmVFbmRDb2xvclwiKSxcbiAgYm9yZGVyUmlnaHRTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJSaWdodFN0eWxlXCIpLFxuICBib3JkZXJJbmxpbmVFbmRTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJJbmxpbmVFbmRTdHlsZVwiKSxcbiAgYm9yZGVyVG9wUmFkaXVzOiB0LnJhZGlpKFtcImJvcmRlclRvcExlZnRSYWRpdXNcIiwgXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiXSksXG4gIGJvcmRlckJvdHRvbVJhZGl1czogdC5yYWRpaShbXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIl0pLFxuICBib3JkZXJMZWZ0UmFkaXVzOiB0LnJhZGlpKFtcImJvcmRlclRvcExlZnRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJdKSxcbiAgYm9yZGVyUmlnaHRSYWRpdXM6IHQucmFkaWkoW1wiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiXSlcbn07XG5PYmplY3QuYXNzaWduKGJvcmRlciwge1xuICByb3VuZGVkOiBib3JkZXIuYm9yZGVyUmFkaXVzLFxuICByb3VuZGVkVG9wOiBib3JkZXIuYm9yZGVyVG9wUmFkaXVzLFxuICByb3VuZGVkVG9wTGVmdDogYm9yZGVyLmJvcmRlclRvcExlZnRSYWRpdXMsXG4gIHJvdW5kZWRUb3BSaWdodDogYm9yZGVyLmJvcmRlclRvcFJpZ2h0UmFkaXVzLFxuICByb3VuZGVkVG9wU3RhcnQ6IGJvcmRlci5ib3JkZXJTdGFydFN0YXJ0UmFkaXVzLFxuICByb3VuZGVkVG9wRW5kOiBib3JkZXIuYm9yZGVyU3RhcnRFbmRSYWRpdXMsXG4gIHJvdW5kZWRCb3R0b206IGJvcmRlci5ib3JkZXJCb3R0b21SYWRpdXMsXG4gIHJvdW5kZWRCb3R0b21MZWZ0OiBib3JkZXIuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyxcbiAgcm91bmRlZEJvdHRvbVJpZ2h0OiBib3JkZXIuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMsXG4gIHJvdW5kZWRCb3R0b21TdGFydDogYm9yZGVyLmJvcmRlckVuZFN0YXJ0UmFkaXVzLFxuICByb3VuZGVkQm90dG9tRW5kOiBib3JkZXIuYm9yZGVyRW5kRW5kUmFkaXVzLFxuICByb3VuZGVkTGVmdDogYm9yZGVyLmJvcmRlckxlZnRSYWRpdXMsXG4gIHJvdW5kZWRSaWdodDogYm9yZGVyLmJvcmRlclJpZ2h0UmFkaXVzLFxuICByb3VuZGVkU3RhcnQ6IGJvcmRlci5ib3JkZXJJbmxpbmVTdGFydFJhZGl1cyxcbiAgcm91bmRlZEVuZDogYm9yZGVyLmJvcmRlcklubGluZUVuZFJhZGl1cyxcbiAgYm9yZGVyU3RhcnQ6IGJvcmRlci5ib3JkZXJJbmxpbmVTdGFydCxcbiAgYm9yZGVyRW5kOiBib3JkZXIuYm9yZGVySW5saW5lRW5kLFxuICBib3JkZXJUb3BTdGFydFJhZGl1czogYm9yZGVyLmJvcmRlclN0YXJ0U3RhcnRSYWRpdXMsXG4gIGJvcmRlclRvcEVuZFJhZGl1czogYm9yZGVyLmJvcmRlclN0YXJ0RW5kUmFkaXVzLFxuICBib3JkZXJCb3R0b21TdGFydFJhZGl1czogYm9yZGVyLmJvcmRlckVuZFN0YXJ0UmFkaXVzLFxuICBib3JkZXJCb3R0b21FbmRSYWRpdXM6IGJvcmRlci5ib3JkZXJFbmRFbmRSYWRpdXMsXG4gIGJvcmRlclN0YXJ0UmFkaXVzOiBib3JkZXIuYm9yZGVySW5saW5lU3RhcnRSYWRpdXMsXG4gIGJvcmRlckVuZFJhZGl1czogYm9yZGVyLmJvcmRlcklubGluZUVuZFJhZGl1cyxcbiAgYm9yZGVyU3RhcnRXaWR0aDogYm9yZGVyLmJvcmRlcklubGluZVN0YXJ0V2lkdGgsXG4gIGJvcmRlckVuZFdpZHRoOiBib3JkZXIuYm9yZGVySW5saW5lRW5kV2lkdGgsXG4gIGJvcmRlclN0YXJ0Q29sb3I6IGJvcmRlci5ib3JkZXJJbmxpbmVTdGFydENvbG9yLFxuICBib3JkZXJFbmRDb2xvcjogYm9yZGVyLmJvcmRlcklubGluZUVuZENvbG9yLFxuICBib3JkZXJTdGFydFN0eWxlOiBib3JkZXIuYm9yZGVySW5saW5lU3RhcnRTdHlsZSxcbiAgYm9yZGVyRW5kU3R5bGU6IGJvcmRlci5ib3JkZXJJbmxpbmVFbmRTdHlsZVxufSk7XG4vKipcbiAqIFRoZSBwcm9wIHR5cGVzIGZvciBib3JkZXIgcHJvcGVydGllcyBsaXN0ZWQgYWJvdmVcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Ym9yZGVyLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgY29sb3IgPSB7XG4gIGNvbG9yOiB0LmNvbG9ycyhcImNvbG9yXCIpLFxuICB0ZXh0Q29sb3I6IHQuY29sb3JzKFwiY29sb3JcIiksXG4gIG9wYWNpdHk6IHRydWUsXG4gIGZpbGw6IHQuY29sb3JzKFwiZmlsbFwiKSxcbiAgc3Ryb2tlOiB0LmNvbG9ycyhcInN0cm9rZVwiKVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbG9yLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZVRyYW5zZm9ybSB9IGZyb20gXCIuLi9jcmVhdGUtdHJhbnNmb3JtXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG52YXIgcmV2ZXJzZSA9IHtcbiAgXCJyb3ctcmV2ZXJzZVwiOiB7XG4gICAgc3BhY2U6IFwiLS1jaGFrcmEtc3BhY2UteC1yZXZlcnNlXCIsXG4gICAgZGl2aWRlOiBcIi0tY2hha3JhLWRpdmlkZS14LXJldmVyc2VcIlxuICB9LFxuICBcImNvbHVtbi1yZXZlcnNlXCI6IHtcbiAgICBzcGFjZTogXCItLWNoYWtyYS1zcGFjZS15LXJldmVyc2VcIixcbiAgICBkaXZpZGU6IFwiLS1jaGFrcmEtZGl2aWRlLXktcmV2ZXJzZVwiXG4gIH1cbn07XG52YXIgb3dsU2VsZWN0b3IgPSBcIiYgPiA6bm90KHN0eWxlKSB+IDpub3Qoc3R5bGUpXCI7XG5leHBvcnQgdmFyIGZsZXhib3ggPSB7XG4gIGFsaWduSXRlbXM6IHRydWUsXG4gIGFsaWduQ29udGVudDogdHJ1ZSxcbiAganVzdGlmeUl0ZW1zOiB0cnVlLFxuICBqdXN0aWZ5Q29udGVudDogdHJ1ZSxcbiAgZmxleFdyYXA6IHRydWUsXG4gIGZsZXhEaXJlY3Rpb246IHtcbiAgICB0cmFuc2Zvcm0odmFsdWUpIHtcbiAgICAgIHZhciBfcmV2ZXJzZSR2YWx1ZTtcblxuICAgICAgdmFyIHtcbiAgICAgICAgc3BhY2UsXG4gICAgICAgIGRpdmlkZVxuICAgICAgfSA9IChfcmV2ZXJzZSR2YWx1ZSA9IHJldmVyc2VbdmFsdWVdKSAhPSBudWxsID8gX3JldmVyc2UkdmFsdWUgOiB7fTtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIGZsZXhEaXJlY3Rpb246IHZhbHVlXG4gICAgICB9O1xuICAgICAgaWYgKHNwYWNlKSByZXN1bHRbc3BhY2VdID0gMTtcbiAgICAgIGlmIChkaXZpZGUpIHJlc3VsdFtkaXZpZGVdID0gMTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gIH0sXG4gIHNwYWNlWDoge1xuICAgIHN0YXRpYzoge1xuICAgICAgW293bFNlbGVjdG9yXToge1xuICAgICAgICBtYXJnaW5JbmxpbmVTdGFydDogXCJjYWxjKHZhcigtLWNoYWtyYS1zcGFjZS14KSAqIGNhbGMoMSAtIHZhcigtLWNoYWtyYS1zcGFjZS14LXJldmVyc2UpKSlcIixcbiAgICAgICAgbWFyZ2luSW5saW5lRW5kOiBcImNhbGModmFyKC0tY2hha3JhLXNwYWNlLXgpICogdmFyKC0tY2hha3JhLXNwYWNlLXgtcmV2ZXJzZSkpXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyYW5zZm9ybTogY3JlYXRlVHJhbnNmb3JtKHtcbiAgICAgIHNjYWxlOiBcInNwYWNlXCIsXG4gICAgICB0cmFuc2Zvcm06IHZhbHVlID0+IHZhbHVlICE9PSBudWxsID8ge1xuICAgICAgICBcIi0tY2hha3JhLXNwYWNlLXhcIjogdmFsdWVcbiAgICAgIH0gOiBudWxsXG4gICAgfSlcbiAgfSxcbiAgc3BhY2VZOiB7XG4gICAgc3RhdGljOiB7XG4gICAgICBbb3dsU2VsZWN0b3JdOiB7XG4gICAgICAgIG1hcmdpblRvcDogXCJjYWxjKHZhcigtLWNoYWtyYS1zcGFjZS15KSAqIGNhbGMoMSAtIHZhcigtLWNoYWtyYS1zcGFjZS15LXJldmVyc2UpKSlcIixcbiAgICAgICAgbWFyZ2luQm90dG9tOiBcImNhbGModmFyKC0tY2hha3JhLXNwYWNlLXkpICogdmFyKC0tY2hha3JhLXNwYWNlLXktcmV2ZXJzZSkpXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyYW5zZm9ybTogY3JlYXRlVHJhbnNmb3JtKHtcbiAgICAgIHNjYWxlOiBcInNwYWNlXCIsXG4gICAgICB0cmFuc2Zvcm06IHZhbHVlID0+IHZhbHVlICE9IG51bGwgPyB7XG4gICAgICAgIFwiLS1jaGFrcmEtc3BhY2UteVwiOiB2YWx1ZVxuICAgICAgfSA6IG51bGxcbiAgICB9KVxuICB9LFxuICBmbGV4OiB0cnVlLFxuICBmbGV4RmxvdzogdHJ1ZSxcbiAgZmxleEdyb3c6IHRydWUsXG4gIGZsZXhTaHJpbms6IHRydWUsXG4gIGZsZXhCYXNpczogdC5zaXplcyhcImZsZXhCYXNpc1wiKSxcbiAganVzdGlmeVNlbGY6IHRydWUsXG4gIGFsaWduU2VsZjogdHJ1ZSxcbiAgb3JkZXI6IHRydWUsXG4gIHBsYWNlSXRlbXM6IHRydWUsXG4gIHBsYWNlQ29udGVudDogdHJ1ZSxcbiAgcGxhY2VTZWxmOiB0cnVlLFxuICBmbGV4RGlyOiB0LnByb3AoXCJmbGV4RGlyZWN0aW9uXCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxleGJveC5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGdyaWQgPSB7XG4gIGdyaWRHYXA6IHQuc3BhY2UoXCJncmlkR2FwXCIpLFxuICBncmlkQ29sdW1uR2FwOiB0LnNwYWNlKFwiZ3JpZENvbHVtbkdhcFwiKSxcbiAgZ3JpZFJvd0dhcDogdC5zcGFjZShcImdyaWRSb3dHYXBcIiksXG4gIGdyaWRDb2x1bW46IHRydWUsXG4gIGdyaWRSb3c6IHRydWUsXG4gIGdyaWRBdXRvRmxvdzogdHJ1ZSxcbiAgZ3JpZEF1dG9Db2x1bW5zOiB0cnVlLFxuICBncmlkQ29sdW1uU3RhcnQ6IHRydWUsXG4gIGdyaWRDb2x1bW5FbmQ6IHRydWUsXG4gIGdyaWRSb3dTdGFydDogdHJ1ZSxcbiAgZ3JpZFJvd0VuZDogdHJ1ZSxcbiAgZ3JpZEF1dG9Sb3dzOiB0cnVlLFxuICBncmlkVGVtcGxhdGU6IHRydWUsXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IHRydWUsXG4gIGdyaWRUZW1wbGF0ZVJvd3M6IHRydWUsXG4gIGdyaWRUZW1wbGF0ZUFyZWFzOiB0cnVlLFxuICBncmlkQXJlYTogdHJ1ZVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdyaWQuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBsYXlvdXQgPSB7XG4gIHdpZHRoOiB0LnNpemVzVChcIndpZHRoXCIpLFxuICBpbmxpbmVTaXplOiB0LnNpemVzVChcImlubGluZVNpemVcIiksXG4gIGhlaWdodDogdC5zaXplcyhcImhlaWdodFwiKSxcbiAgYmxvY2tTaXplOiB0LnNpemVzKFwiYmxvY2tTaXplXCIpLFxuICBib3hTaXplOiB0LnNpemVzKFtcIndpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgbWluV2lkdGg6IHQuc2l6ZXMoXCJtaW5XaWR0aFwiKSxcbiAgbWluSW5saW5lU2l6ZTogdC5zaXplcyhcIm1pbklubGluZVNpemVcIiksXG4gIG1pbkhlaWdodDogdC5zaXplcyhcIm1pbkhlaWdodFwiKSxcbiAgbWluQmxvY2tTaXplOiB0LnNpemVzKFwibWluQmxvY2tTaXplXCIpLFxuICBtYXhXaWR0aDogdC5zaXplcyhcIm1heFdpZHRoXCIpLFxuICBtYXhJbmxpbmVTaXplOiB0LnNpemVzKFwibWF4SW5saW5lU2l6ZVwiKSxcbiAgbWF4SGVpZ2h0OiB0LnNpemVzKFwibWF4SGVpZ2h0XCIpLFxuICBtYXhCbG9ja1NpemU6IHQuc2l6ZXMoXCJtYXhCbG9ja1NpemVcIiksXG4gIGQ6IHQucHJvcChcImRpc3BsYXlcIiksXG4gIG92ZXJmbG93OiB0cnVlLFxuICBvdmVyZmxvd1g6IHRydWUsXG4gIG92ZXJmbG93WTogdHJ1ZSxcbiAgZGlzcGxheTogdHJ1ZSxcbiAgdmVydGljYWxBbGlnbjogdHJ1ZSxcbiAgYm94U2l6aW5nOiB0cnVlXG59O1xuT2JqZWN0LmFzc2lnbihsYXlvdXQsIHtcbiAgdzogbGF5b3V0LndpZHRoLFxuICBoOiBsYXlvdXQuaGVpZ2h0LFxuICBtaW5XOiBsYXlvdXQubWluV2lkdGgsXG4gIG1heFc6IGxheW91dC5tYXhXaWR0aCxcbiAgbWluSDogbGF5b3V0Lm1pbkhlaWdodCxcbiAgbWF4SDogbGF5b3V0Lm1heEhlaWdodFxufSk7XG4vKipcbiAqIFR5cGVzIGZvciBsYXlvdXQgcmVsYXRlZCBDU1MgcHJvcGVydGllc1xuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1sYXlvdXQuanMubWFwIiwiaW1wb3J0IHsgbWVtb2l6ZWRHZXQgYXMgZ2V0IH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcblxudmFyIGZsb2F0VHJhbnNmb3JtID0gKHZhbHVlLCB0aGVtZSkgPT4ge1xuICB2YXIgbWFwID0ge1xuICAgIGxlZnQ6IFwicmlnaHRcIixcbiAgICByaWdodDogXCJsZWZ0XCJcbiAgfTtcbiAgcmV0dXJuIHRoZW1lLmRpcmVjdGlvbiA9PT0gXCJydGxcIiA/IG1hcFt2YWx1ZV0gOiB2YWx1ZTtcbn07XG5cbnZhciBzck9ubHkgPSB7XG4gIGJvcmRlcjogXCIwcHhcIixcbiAgY2xpcDogXCJyZWN0KDAsIDAsIDAsIDApXCIsXG4gIHdpZHRoOiBcIjFweFwiLFxuICBoZWlnaHQ6IFwiMXB4XCIsXG4gIG1hcmdpbjogXCItMXB4XCIsXG4gIHBhZGRpbmc6IFwiMHB4XCIsXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLFxuICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiXG59O1xudmFyIHNyRm9jdXNhYmxlID0ge1xuICBwb3NpdGlvbjogXCJzdGF0aWNcIixcbiAgd2lkdGg6IFwiYXV0b1wiLFxuICBoZWlnaHQ6IFwiYXV0b1wiLFxuICBjbGlwOiBcImF1dG9cIixcbiAgcGFkZGluZzogXCIwXCIsXG4gIG1hcmdpbjogXCIwXCIsXG4gIG92ZXJmbG93OiBcInZpc2libGVcIixcbiAgd2hpdGVTcGFjZTogXCJub3JtYWxcIlxufTtcblxudmFyIGdldFdpdGhQcmlvcml0eSA9ICh0aGVtZSwga2V5LCBzdHlsZXMpID0+IHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICB2YXIgb2JqID0gZ2V0KHRoZW1lLCBrZXksIHt9KTtcblxuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBpc0luU3R5bGVzID0gcHJvcCBpbiBzdHlsZXMgJiYgc3R5bGVzW3Byb3BdICE9IG51bGw7XG4gICAgaWYgKCFpc0luU3R5bGVzKSByZXN1bHRbcHJvcF0gPSBvYmpbcHJvcF07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IHZhciBvdGhlcnMgPSB7XG4gIGFuaW1hdGlvbjogdHJ1ZSxcbiAgYXBwZWFyYW5jZTogdHJ1ZSxcbiAgdmlzaWJpbGl0eTogdHJ1ZSxcbiAgdXNlclNlbGVjdDogdHJ1ZSxcbiAgcG9pbnRlckV2ZW50czogdHJ1ZSxcbiAgY3Vyc29yOiB0cnVlLFxuICByZXNpemU6IHRydWUsXG4gIG9iamVjdEZpdDogdHJ1ZSxcbiAgb2JqZWN0UG9zaXRpb246IHRydWUsXG4gIGZsb2F0OiB7XG4gICAgcHJvcGVydHk6IFwiZmxvYXRcIixcbiAgICB0cmFuc2Zvcm06IGZsb2F0VHJhbnNmb3JtXG4gIH0sXG4gIHdpbGxDaGFuZ2U6IHRydWUsXG4gIGZpbHRlcjogdHJ1ZSxcbiAgY2xpcFBhdGg6IHRydWUsXG4gIHNyT25seToge1xuICAgIHRyYW5zZm9ybSh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSByZXR1cm4gc3JPbmx5O1xuICAgICAgaWYgKHZhbHVlID09PSBcImZvY3VzYWJsZVwiKSByZXR1cm4gc3JGb2N1c2FibGU7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gIH0sXG4gIGxheWVyU3R5bGU6IHtcbiAgICBwcm9jZXNzUmVzdWx0OiB0cnVlLFxuICAgIHRyYW5zZm9ybTogKHZhbHVlLCB0aGVtZSwgc3R5bGVzKSA9PiBnZXRXaXRoUHJpb3JpdHkodGhlbWUsIFwibGF5ZXJTdHlsZXMuXCIgKyB2YWx1ZSwgc3R5bGVzKVxuICB9LFxuICB0ZXh0U3R5bGU6IHtcbiAgICBwcm9jZXNzUmVzdWx0OiB0cnVlLFxuICAgIHRyYW5zZm9ybTogKHZhbHVlLCB0aGVtZSwgc3R5bGVzKSA9PiBnZXRXaXRoUHJpb3JpdHkodGhlbWUsIFwidGV4dFN0eWxlcy5cIiArIHZhbHVlLCBzdHlsZXMpXG4gIH0sXG4gIGFwcGx5OiB7XG4gICAgcHJvY2Vzc1Jlc3VsdDogdHJ1ZSxcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZSwgdGhlbWUsIHN0eWxlcykgPT4gZ2V0V2l0aFByaW9yaXR5KHRoZW1lLCB2YWx1ZSwgc3R5bGVzKVxuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3RoZXJzLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgcG9zaXRpb24gPSB7XG4gIHBvc2l0aW9uOiB0cnVlLFxuICBwb3M6IHQucHJvcChcInBvc2l0aW9uXCIpLFxuICB6SW5kZXg6IHQucHJvcChcInpJbmRleFwiLCBcInpJbmRpY2VzXCIpLFxuICBpbnNldDogdC5zcGFjZVQoW1widG9wXCIsIFwicmlnaHRcIiwgXCJib3R0b21cIiwgXCJsZWZ0XCJdKSxcbiAgaW5zZXRYOiB0LnNwYWNlVChbXCJsZWZ0XCIsIFwicmlnaHRcIl0pLFxuICBpbnNldElubGluZTogdC5zcGFjZVQoXCJpbnNldElubGluZVwiKSxcbiAgaW5zZXRZOiB0LnNwYWNlVChbXCJ0b3BcIiwgXCJib3R0b21cIl0pLFxuICBpbnNldEJsb2NrOiB0LnNwYWNlVChcImluc2V0QmxvY2tcIiksXG4gIHRvcDogdC5zcGFjZVQoXCJ0b3BcIiksXG4gIGluc2V0QmxvY2tTdGFydDogdC5zcGFjZVQoXCJpbnNldEJsb2NrU3RhcnRcIiksXG4gIGJvdHRvbTogdC5zcGFjZVQoXCJib3R0b21cIiksXG4gIGluc2V0QmxvY2tFbmQ6IHQuc3BhY2VUKFwiaW5zZXRCbG9ja0VuZFwiKSxcbiAgbGVmdDogdC5zcGFjZVQoXCJsZWZ0XCIpLFxuICBpbnNldElubGluZVN0YXJ0OiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInNwYWNlXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogXCJsZWZ0XCIsXG4gICAgICBydGw6IFwicmlnaHRcIlxuICAgIH1cbiAgfSksXG4gIHJpZ2h0OiB0LnNwYWNlVChcInJpZ2h0XCIpLFxuICBpbnNldElubGluZUVuZDogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJzcGFjZVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwicmlnaHRcIixcbiAgICAgIHJ0bDogXCJsZWZ0XCJcbiAgICB9XG4gIH0pXG59O1xuT2JqZWN0LmFzc2lnbihwb3NpdGlvbiwge1xuICBpbnNldFN0YXJ0OiBwb3NpdGlvbi5pbnNldElubGluZVN0YXJ0LFxuICBpbnNldEVuZDogcG9zaXRpb24uaW5zZXRJbmxpbmVFbmRcbn0pO1xuLyoqXG4gKiBUeXBlcyBmb3IgcG9zaXRpb24gQ1NTIHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9zaXRpb24uanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBzaGFkb3cgPSB7XG4gIGJveFNoYWRvdzogdC5zaGFkb3dzKFwiYm94U2hhZG93XCIpLFxuICB0ZXh0U2hhZG93OiB0LnNoYWRvd3MoXCJ0ZXh0U2hhZG93XCIpXG59O1xuT2JqZWN0LmFzc2lnbihzaGFkb3csIHtcbiAgc2hhZG93OiBzaGFkb3cuYm94U2hhZG93XG59KTtcbi8qKlxuICogVHlwZXMgZm9yIGJveCBhbmQgdGV4dCBzaGFkb3cgcHJvcGVydGllc1xuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFkb3cuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBzcGFjZSA9IHtcbiAgbWFyZ2luOiB0LnNwYWNlVChcIm1hcmdpblwiKSxcbiAgbWFyZ2luVG9wOiB0LnNwYWNlVChcIm1hcmdpblRvcFwiKSxcbiAgbWFyZ2luQmxvY2tTdGFydDogdC5zcGFjZVQoXCJtYXJnaW5CbG9ja1N0YXJ0XCIpLFxuICBtYXJnaW5SaWdodDogdC5zcGFjZVQoXCJtYXJnaW5SaWdodFwiKSxcbiAgbWFyZ2luSW5saW5lRW5kOiB0LnNwYWNlVChcIm1hcmdpbklubGluZUVuZFwiKSxcbiAgbWFyZ2luQm90dG9tOiB0LnNwYWNlVChcIm1hcmdpbkJvdHRvbVwiKSxcbiAgbWFyZ2luQmxvY2tFbmQ6IHQuc3BhY2VUKFwibWFyZ2luQmxvY2tFbmRcIiksXG4gIG1hcmdpbkxlZnQ6IHQuc3BhY2VUKFwibWFyZ2luTGVmdFwiKSxcbiAgbWFyZ2luSW5saW5lU3RhcnQ6IHQuc3BhY2VUKFwibWFyZ2luSW5saW5lU3RhcnRcIiksXG4gIG1hcmdpblg6IHQuc3BhY2VUKFtcIm1hcmdpbklubGluZVN0YXJ0XCIsIFwibWFyZ2luSW5saW5lRW5kXCJdKSxcbiAgbWFyZ2luSW5saW5lOiB0LnNwYWNlVChcIm1hcmdpbklubGluZVwiKSxcbiAgbWFyZ2luWTogdC5zcGFjZVQoW1wibWFyZ2luVG9wXCIsIFwibWFyZ2luQm90dG9tXCJdKSxcbiAgbWFyZ2luQmxvY2s6IHQuc3BhY2VUKFwibWFyZ2luQmxvY2tcIiksXG4gIHBhZGRpbmc6IHQuc3BhY2UoXCJwYWRkaW5nXCIpLFxuICBwYWRkaW5nVG9wOiB0LnNwYWNlKFwicGFkZGluZ1RvcFwiKSxcbiAgcGFkZGluZ0Jsb2NrU3RhcnQ6IHQuc3BhY2UoXCJwYWRkaW5nQmxvY2tTdGFydFwiKSxcbiAgcGFkZGluZ1JpZ2h0OiB0LnNwYWNlKFwicGFkZGluZ1JpZ2h0XCIpLFxuICBwYWRkaW5nQm90dG9tOiB0LnNwYWNlKFwicGFkZGluZ0JvdHRvbVwiKSxcbiAgcGFkZGluZ0Jsb2NrRW5kOiB0LnNwYWNlKFwicGFkZGluZ0Jsb2NrRW5kXCIpLFxuICBwYWRkaW5nTGVmdDogdC5zcGFjZShcInBhZGRpbmdMZWZ0XCIpLFxuICBwYWRkaW5nSW5saW5lU3RhcnQ6IHQuc3BhY2UoXCJwYWRkaW5nSW5saW5lU3RhcnRcIiksXG4gIHBhZGRpbmdJbmxpbmVFbmQ6IHQuc3BhY2UoXCJwYWRkaW5nSW5saW5lRW5kXCIpLFxuICBwYWRkaW5nWDogdC5zcGFjZShbXCJwYWRkaW5nSW5saW5lU3RhcnRcIiwgXCJwYWRkaW5nSW5saW5lRW5kXCJdKSxcbiAgcGFkZGluZ0lubGluZTogdC5zcGFjZShcInBhZGRpbmdJbmxpbmVcIiksXG4gIHBhZGRpbmdZOiB0LnNwYWNlKFtcInBhZGRpbmdUb3BcIiwgXCJwYWRkaW5nQm90dG9tXCJdKSxcbiAgcGFkZGluZ0Jsb2NrOiB0LnNwYWNlKFwicGFkZGluZ0Jsb2NrXCIpXG59O1xuT2JqZWN0LmFzc2lnbihzcGFjZSwge1xuICBtOiBzcGFjZS5tYXJnaW4sXG4gIG10OiBzcGFjZS5tYXJnaW5Ub3AsXG4gIG1yOiBzcGFjZS5tYXJnaW5SaWdodCxcbiAgbWU6IHNwYWNlLm1hcmdpbklubGluZUVuZCxcbiAgbWFyZ2luRW5kOiBzcGFjZS5tYXJnaW5JbmxpbmVFbmQsXG4gIG1iOiBzcGFjZS5tYXJnaW5Cb3R0b20sXG4gIG1sOiBzcGFjZS5tYXJnaW5MZWZ0LFxuICBtczogc3BhY2UubWFyZ2luSW5saW5lU3RhcnQsXG4gIG1hcmdpblN0YXJ0OiBzcGFjZS5tYXJnaW5JbmxpbmVTdGFydCxcbiAgbXg6IHNwYWNlLm1hcmdpblgsXG4gIG15OiBzcGFjZS5tYXJnaW5ZLFxuICBwOiBzcGFjZS5wYWRkaW5nLFxuICBwdDogc3BhY2UucGFkZGluZ1RvcCxcbiAgcHk6IHNwYWNlLnBhZGRpbmdZLFxuICBweDogc3BhY2UucGFkZGluZ1gsXG4gIHBiOiBzcGFjZS5wYWRkaW5nQm90dG9tLFxuICBwbDogc3BhY2UucGFkZGluZ0xlZnQsXG4gIHBzOiBzcGFjZS5wYWRkaW5nSW5saW5lU3RhcnQsXG4gIHBhZGRpbmdTdGFydDogc3BhY2UucGFkZGluZ0lubGluZVN0YXJ0LFxuICBwcjogc3BhY2UucGFkZGluZ1JpZ2h0LFxuICBwZTogc3BhY2UucGFkZGluZ0lubGluZUVuZCxcbiAgcGFkZGluZ0VuZDogc3BhY2UucGFkZGluZ0lubGluZUVuZFxufSk7XG4vKipcbiAqIFR5cGVzIGZvciBzcGFjZSByZWxhdGVkIENTUyBwcm9wZXJ0aWVzXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYWNlLmpzLm1hcCIsImltcG9ydCB7IHB4IH0gZnJvbSBcIi4uL2NyZWF0ZS10cmFuc2Zvcm1cIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgdHlwb2dyYXBoeSA9IHtcbiAgZm9udEZhbWlseTogdC5wcm9wKFwiZm9udEZhbWlseVwiLCBcImZvbnRzXCIpLFxuICBmb250U2l6ZTogdC5wcm9wKFwiZm9udFNpemVcIiwgXCJmb250U2l6ZXNcIiwgcHgpLFxuICBmb250V2VpZ2h0OiB0LnByb3AoXCJmb250V2VpZ2h0XCIsIFwiZm9udFdlaWdodHNcIiksXG4gIGxpbmVIZWlnaHQ6IHQucHJvcChcImxpbmVIZWlnaHRcIiwgXCJsaW5lSGVpZ2h0c1wiKSxcbiAgbGV0dGVyU3BhY2luZzogdC5wcm9wKFwibGV0dGVyU3BhY2luZ1wiLCBcImxldHRlclNwYWNpbmdzXCIpLFxuICB0ZXh0QWxpZ246IHRydWUsXG4gIGZvbnRTdHlsZTogdHJ1ZSxcbiAgd29yZEJyZWFrOiB0cnVlLFxuICBvdmVyZmxvd1dyYXA6IHRydWUsXG4gIHRleHRPdmVyZmxvdzogdHJ1ZSxcbiAgdGV4dFRyYW5zZm9ybTogdHJ1ZSxcbiAgd2hpdGVTcGFjZTogdHJ1ZSxcbiAgdGV4dERlY29yYXRpb246IHRydWUsXG4gIHRleHREZWNvcjoge1xuICAgIHByb3BlcnR5OiBcInRleHREZWNvcmF0aW9uXCJcbiAgfSxcbiAgbm9PZkxpbmVzOiB7XG4gICAgc3RhdGljOiB7XG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wiLFxuICAgICAgZGlzcGxheTogXCItd2Via2l0LWJveFwiLFxuICAgICAgV2Via2l0Qm94T3JpZW50OiBcInZlcnRpY2FsXCIsXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIFdlYmtpdExpbmVDbGFtcDogXCJ2YXIoLS1jaGFrcmEtbGluZS1jbGFtcClcIlxuICAgIH0sXG4gICAgcHJvcGVydHk6IFwiLS1jaGFrcmEtbGluZS1jbGFtcFwiXG4gIH0sXG4gIGlzVHJ1bmNhdGVkOiB7XG4gICAgdHJhbnNmb3JtKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICB0ZXh0T3ZlcmZsb3c6IFwiZWxsaXBzaXNcIixcbiAgICAgICAgICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn07XG4vKipcbiAqIFR5cGVzIGZvciB0eXBvZ3JhcGh5IHJlbGF0ZWQgQ1NTIHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHlwb2dyYXBoeS5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG4vKipcbiAqIFRoZSBwYXJzZXIgY29uZmlndXJhdGlvbiBmb3IgY29tbW9uIG91dGxpbmUgcHJvcGVydGllc1xuICovXG5cbmV4cG9ydCB2YXIgb3V0bGluZSA9IHtcbiAgb3V0bGluZTogdHJ1ZSxcbiAgb3V0bGluZU9mZnNldDogdHJ1ZSxcbiAgb3V0bGluZUNvbG9yOiB0LmNvbG9ycyhcIm91dGxpbmVDb2xvclwiKSxcbiAgcmluZ0NvbG9yOiB0LnByb3AoXCItLWNoYWtyYS1yaW5nLWNvbG9yXCIsIFwiY29sb3JzXCIpLFxuICByaW5nT2Zmc2V0V2lkdGg6IHQucHJvcChcIi0tY2hha3JhLXJpbmctb2Zmc2V0XCIpLFxuICByaW5nT2Zmc2V0Q29sb3I6IHQucHJvcChcIi0tY2hha3JhLXJpbmctb2Zmc2V0LWNvbG9yXCIsIFwiY29sb3JzXCIpLFxuICByaW5nV2lkdGg6IHQucHJvcChcIi0tY2hha3JhLXJpbmctb2Zmc2V0XCIpLFxuICByaW5nSW5zZXQ6IHQucHJvcChcIi0tY2hha3JhLXJpbmctaW5zZXRcIilcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vdXRsaW5lLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgbGlzdCA9IHtcbiAgbGlzdFN0eWxlVHlwZTogdHJ1ZSxcbiAgbGlzdFN0eWxlUG9zaXRpb246IHRydWUsXG4gIGxpc3RTdHlsZVBvczogdC5wcm9wKFwibGlzdFN0eWxlUG9zaXRpb25cIiksXG4gIGxpc3RTdHlsZUltYWdlOiB0cnVlLFxuICBsaXN0U3R5bGVJbWc6IHQucHJvcChcImxpc3RTdHlsZUltYWdlXCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlzdC5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIHRyYW5zaXRpb24gPSB7XG4gIHRyYW5zaXRpb246IHRydWUsXG4gIHRyYW5zaXRpb25EdXJhdGlvbjogdC5wcm9wKFwidHJhbnNpdGlvbkR1cmF0aW9uXCIsIFwidHJhbnNpdGlvbi5kdXJhdGlvblwiKSxcbiAgdHJhbnNpdGlvblByb3BlcnR5OiB0LnByb3AoXCJ0cmFuc2l0aW9uUHJvcGVydHlcIiwgXCJ0cmFuc2l0aW9uLnByb3BlcnR5XCIpLFxuICB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb246IHQucHJvcChcInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvblwiLCBcInRyYW5zaXRpb24uZWFzaW5nXCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNpdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBpc0Nzc1ZhciwgaXNOdW1iZXIgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xudmFyIHRlbXBsYXRlcyA9IHtcbiAgYXV0bzogXCJ2YXIoLS1jaGFrcmEtdHJhbnNmb3JtKVwiLFxuICBcImF1dG8tZ3B1XCI6IFwidmFyKC0tY2hha3JhLXRyYW5zZm9ybS1ncHUpXCJcbn07XG5cbnZhciBkZWdyZWVUcmFuc2Zvcm0gPSB2YWx1ZSA9PiB7XG4gIGlmIChpc0Nzc1Zhcih2YWx1ZSkgfHwgdmFsdWUgPT0gbnVsbCkgcmV0dXJuIHZhbHVlO1xuICByZXR1cm4gaXNOdW1iZXIodmFsdWUpID8gdmFsdWUgKyBcImRlZ1wiIDogdmFsdWU7XG59O1xuXG5leHBvcnQgdmFyIHRyYW5zZm9ybSA9IHtcbiAgdHJhbnNmb3JtOiB7XG4gICAgcHJvcGVydHk6IFwidHJhbnNmb3JtXCIsXG5cbiAgICB0cmFuc2Zvcm0odmFsdWUpIHtcbiAgICAgIHZhciBfdGVtcGxhdGVzJHZhbHVlO1xuXG4gICAgICByZXR1cm4gKF90ZW1wbGF0ZXMkdmFsdWUgPSB0ZW1wbGF0ZXNbdmFsdWVdKSAhPSBudWxsID8gX3RlbXBsYXRlcyR2YWx1ZSA6IHZhbHVlO1xuICAgIH1cblxuICB9LFxuICB0cmFuc2Zvcm1PcmlnaW46IHRydWUsXG4gIHRyYW5zbGF0ZVg6IHQuc3BhY2VUKFwiLS1jaGFrcmEtdHJhbnNsYXRlLXhcIiksXG4gIHRyYW5zbGF0ZVk6IHQuc3BhY2VUKFwiLS1jaGFrcmEtdHJhbnNsYXRlLXlcIiksXG4gIHJvdGF0ZVg6IHtcbiAgICBwcm9wZXJ0eTogXCItLWNoYWtyYS1yb3RhdGUteFwiLFxuICAgIHRyYW5zZm9ybTogZGVncmVlVHJhbnNmb3JtXG4gIH0sXG4gIHJvdGF0ZVk6IHtcbiAgICBwcm9wZXJ0eTogXCItLWNoYWtyYS1yb3RhdGUteVwiLFxuICAgIHRyYW5zZm9ybTogZGVncmVlVHJhbnNmb3JtXG4gIH0sXG4gIHNrZXdYOiB7XG4gICAgcHJvcGVydHk6IFwiLS1jaGFrcmEtc2tldy14XCIsXG4gICAgdHJhbnNmb3JtOiBkZWdyZWVUcmFuc2Zvcm1cbiAgfSxcbiAgc2tld1k6IHtcbiAgICBwcm9wZXJ0eTogXCItLWNoYWtyYS1za2V3LXlcIixcbiAgICB0cmFuc2Zvcm06IGRlZ3JlZVRyYW5zZm9ybVxuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNmb3JtLmpzLm1hcCIsImltcG9ydCB7IGlzT2JqZWN0LCBydW5JZkZuIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbi8qKlxuICogRXhwYW5kcyBhbiBhcnJheSBvciBvYmplY3Qgc3ludGF4IHJlc3BvbnNpdmUgc3R5bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGV4cGFuZFJlc3BvbnNpdmUoeyBteDogWzEsIDJdIH0pXG4gKiAvLyBvclxuICogZXhwYW5kUmVzcG9uc2l2ZSh7IG14OiB7IGJhc2U6IDEsIHNtOiAyIH0gfSlcbiAqXG4gKiAvLyA9PiB7IG14OiAxLCBcIkBtZWRpYShtaW4td2lkdGg6PHNtPilcIjogeyBteDogMiB9IH1cbiAqL1xuXG5leHBvcnQgdmFyIGV4cGFuZFJlc3BvbnNpdmUgPSBzdHlsZXMgPT4gdGhlbWUgPT4ge1xuICAvKipcbiAgICogQmVmb3JlIGFueSBzdHlsZSBjYW4gYmUgcHJvY2Vzc2VkLCB0aGUgdXNlciBuZWVkcyB0byBjYWxsIGB0b0NTU1ZhcmBcbiAgICogd2hpY2ggYW5hbHl6ZXMgdGhlIHRoZW1lJ3MgYnJlYWtwb2ludCBhbmQgYXBwZW5kcyBhIGBfX2JyZWFrcG9pbnRzYCBwcm9wZXJ0eVxuICAgKiB0byB0aGUgdGhlbWUgd2l0aCBtb3JlIGRldGFpbHMgb2YgdGhlIGJyZWFrcG9pbnRzLlxuICAgKlxuICAgKiBUbyBsZWFybiBtb3JlLCBnbyBoZXJlOiBwYWNrYWdlcy91dGlscy9zcmMvcmVzcG9uc2l2ZS50cyAjYW5hbHl6ZUJyZWFrcG9pbnRzXG4gICAqL1xuICBpZiAoIXRoZW1lLl9fYnJlYWtwb2ludHMpIHJldHVybiBzdHlsZXM7XG4gIHZhciB7XG4gICAgaXNSZXNwb25zaXZlLFxuICAgIHRvQXJyYXlWYWx1ZSxcbiAgICBtZWRpYTogbWVkaWFzXG4gIH0gPSB0aGVtZS5fX2JyZWFrcG9pbnRzO1xuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB7fTtcblxuICBmb3IgKHZhciBrZXkgaW4gc3R5bGVzKSB7XG4gICAgdmFyIHZhbHVlID0gcnVuSWZGbihzdHlsZXNba2V5XSwgdGhlbWUpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSBjb250aW51ZTsgLy8gY29udmVydHMgdGhlIG9iamVjdCByZXNwb25zaXZlIHN5bnRheCB0byBhcnJheSBzeW50YXhcblxuICAgIHZhbHVlID0gaXNPYmplY3QodmFsdWUpICYmIGlzUmVzcG9uc2l2ZSh2YWx1ZSkgPyB0b0FycmF5VmFsdWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBjb21wdXRlZFN0eWxlc1trZXldID0gdmFsdWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgcXVlcmllcyA9IHZhbHVlLnNsaWNlKDAsIG1lZGlhcy5sZW5ndGgpLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBxdWVyaWVzOyBpbmRleCArPSAxKSB7XG4gICAgICB2YXIgbWVkaWEgPSBtZWRpYXMgPT0gbnVsbCA/IHZvaWQgMCA6IG1lZGlhc1tpbmRleF07XG5cbiAgICAgIGlmICghbWVkaWEpIHtcbiAgICAgICAgY29tcHV0ZWRTdHlsZXNba2V5XSA9IHZhbHVlW2luZGV4XTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbXB1dGVkU3R5bGVzW21lZGlhXSA9IGNvbXB1dGVkU3R5bGVzW21lZGlhXSB8fCB7fTtcblxuICAgICAgaWYgKHZhbHVlW2luZGV4XSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb21wdXRlZFN0eWxlc1ttZWRpYV1ba2V5XSA9IHZhbHVlW2luZGV4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29tcHV0ZWRTdHlsZXM7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhwYW5kLXJlc3BvbnNpdmUuanMubWFwIiwiaW1wb3J0IHsgb2JqZWN0S2V5cyB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG52YXIgZ3JvdXAgPSB7XG4gIGhvdmVyOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmhvdmVyICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWhvdmVyXSAmXCIsXG4gIGZvY3VzOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmZvY3VzICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWZvY3VzXSAmXCIsXG4gIGFjdGl2ZTogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjphY3RpdmUgJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtYWN0aXZlXSAmXCIsXG4gIGRpc2FibGVkOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmRpc2FibGVkICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWRpc2FibGVkXSAmXCIsXG4gIGludmFsaWQ6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6aW52YWxpZCAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1pbnZhbGlkXSAmXCIsXG4gIGNoZWNrZWQ6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6Y2hlY2tlZCAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1jaGVja2VkXSAmXCIsXG4gIGluZGV0ZXJtaW5hdGU6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6aW5kZXRlcm1pbmF0ZSAmLCBcIiArIHNlbGVjdG9yICsgXCJbYXJpYS1jaGVja2VkPW1peGVkXSAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1pbmRldGVybWluYXRlXSAmXCIsXG4gIHJlYWRPbmx5OiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOnJlYWQtb25seSAmLCBcIiArIHNlbGVjdG9yICsgXCJbcmVhZG9ubHldICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLXJlYWQtb25seV0gJlwiLFxuICBleHBhbmRlZDogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjpyZWFkLW9ubHkgJiwgXCIgKyBzZWxlY3RvciArIFwiW2FyaWEtZXhwYW5kZWQ9dHJ1ZV0gJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtZXhwYW5kZWRdICZcIlxufTtcblxudmFyIHRvR3JvdXAgPSBmbiA9PiBtZXJnZShmbiwgXCJbcm9sZT1ncm91cF1cIiwgXCJbZGF0YS1ncm91cF1cIiwgXCIuZ3JvdXBcIik7XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGZuKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzZWxlY3RvcnMgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIHNlbGVjdG9yc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3JzLm1hcChmbikuam9pbihcIiwgXCIpO1xufTtcblxuZXhwb3J0IHZhciBwc2V1ZG9TZWxlY3RvcnMgPSB7XG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBzZWxlY3RvciBgJjpob3ZlcmBcbiAgICovXG4gIF9ob3ZlcjogXCImOmhvdmVyLCAmW2RhdGEtaG92ZXJdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOmFjdGl2ZWBcbiAgICovXG4gIF9hY3RpdmU6IFwiJjphY3RpdmUsICZbZGF0YS1hY3RpdmVdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIHNlbGVjdG9yIGAmOmZvY3VzYFxuICAgKlxuICAgKi9cbiAgX2ZvY3VzOiBcIiY6Zm9jdXMsICZbZGF0YS1mb2N1c11cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciB0aGUgaGlnaGxpZ2h0ZWQgc3RhdGUuXG4gICAqL1xuICBfaGlnaGxpZ2h0ZWQ6IFwiJltkYXRhLWhpZ2hsaWdodGVkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCBoYXMgcmVjZWl2ZWQgZm9jdXNcbiAgICogLSBDU1MgU2VsZWN0b3IgYCY6Zm9jdXMtd2l0aGluYFxuICAgKi9cbiAgX2ZvY3VzV2l0aGluOiBcIiY6Zm9jdXMtd2l0aGluXCIsXG4gIF9mb2N1c1Zpc2libGU6IFwiJjpmb2N1cy12aXNpYmxlXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoaXMgZWxlbWVudCBpcyBkaXNhYmxlZC4gVGhlIHBhc3NlZCBzdHlsZXMgYXJlIGFwcGxpZWQgdG8gdGhlc2UgQ1NTIHNlbGVjdG9yczpcbiAgICogLSBgJlthcmlhLWRpc2FibGVkPXRydWVdYFxuICAgKiAtIGAmOmRpc2FibGVkYFxuICAgKiAtIGAmW2RhdGEtZGlzYWJsZWRdYFxuICAgKi9cbiAgX2Rpc2FibGVkOiBcIiZbZGlzYWJsZWRdLCAmW2FyaWEtZGlzYWJsZWQ9dHJ1ZV0sICZbZGF0YS1kaXNhYmxlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6cmVhZG9ubHlgXG4gICAqL1xuICBfcmVhZE9ubHk6IFwiJlthcmlhLXJlYWRvbmx5PXRydWVdLCAmW3JlYWRvbmx5XSwgJltkYXRhLXJlYWRvbmx5XVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBzZWxlY3RvciBgJjo6YmVmb3JlYFxuICAgKlxuICAgKiBOT1RFOldoZW4gdXNpbmcgdGhpcywgZW5zdXJlIHRoZSBgY29udGVudGAgaXMgd3JhcHBlZCBpbiBhIGJhY2t0aWNrLlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqc3hcbiAgICogPEJveCBfYmVmb3JlPXt7Y29udGVudDpgXCJcImAgfX0vPlxuICAgKiBgYGBcbiAgICovXG4gIF9iZWZvcmU6IFwiJjo6YmVmb3JlXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIHNlbGVjdG9yIGAmOjphZnRlcmBcbiAgICpcbiAgICogTk9URTpXaGVuIHVzaW5nIHRoaXMsIGVuc3VyZSB0aGUgYGNvbnRlbnRgIGlzIHdyYXBwZWQgaW4gYSBiYWNrdGljay5cbiAgICogQGV4YW1wbGVcbiAgICogYGBganN4XG4gICAqIDxCb3ggX2FmdGVyPXt7Y29udGVudDpgXCJcImAgfX0vPlxuICAgKiBgYGBcbiAgICovXG4gIF9hZnRlcjogXCImOjphZnRlclwiLFxuICBfZW1wdHk6IFwiJjplbXB0eVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGUgQVJJQSBhdHRyaWJ1dGUgYGFyaWEtZXhwYW5kZWRgIGlzIGB0cnVlYFxuICAgKiAtIENTUyBzZWxlY3RvciBgJlthcmlhLWV4cGFuZGVkPXRydWVdYFxuICAgKi9cbiAgX2V4cGFuZGVkOiBcIiZbYXJpYS1leHBhbmRlZD10cnVlXSwgJltkYXRhLWV4cGFuZGVkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGUgQVJJQSBhdHRyaWJ1dGUgYGFyaWEtY2hlY2tlZGAgaXMgYHRydWVgXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2FyaWEtY2hlY2tlZD10cnVlXWBcbiAgICovXG4gIF9jaGVja2VkOiBcIiZbYXJpYS1jaGVja2VkPXRydWVdLCAmW2RhdGEtY2hlY2tlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhlIEFSSUEgYXR0cmlidXRlIGBhcmlhLWdyYWJiZWRgIGlzIGB0cnVlYFxuICAgKiAtIENTUyBzZWxlY3RvciBgJlthcmlhLWdyYWJiZWQ9dHJ1ZV1gXG4gICAqL1xuICBfZ3JhYmJlZDogXCImW2FyaWEtZ3JhYmJlZD10cnVlXSwgJltkYXRhLWdyYWJiZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmW2FyaWEtcHJlc3NlZD10cnVlXWBcbiAgICogVHlwaWNhbGx5IHVzZWQgdG8gc3R5bGUgdGhlIGN1cnJlbnQgXCJwcmVzc2VkXCIgc3RhdGUgb2YgdG9nZ2xlIGJ1dHRvbnNcbiAgICovXG4gIF9wcmVzc2VkOiBcIiZbYXJpYS1wcmVzc2VkPXRydWVdLCAmW2RhdGEtcHJlc3NlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhlIEFSSUEgYXR0cmlidXRlIGBhcmlhLWludmFsaWRgIGlzIGB0cnVlYFxuICAgKiAtIENTUyBzZWxlY3RvciBgJlthcmlhLWludmFsaWQ9dHJ1ZV1gXG4gICAqL1xuICBfaW52YWxpZDogXCImW2FyaWEtaW52YWxpZD10cnVlXSwgJltkYXRhLWludmFsaWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgdGhlIHZhbGlkIHN0YXRlXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2RhdGEtdmFsaWRdLCAmW2RhdGEtc3RhdGU9dmFsaWRdYFxuICAgKi9cbiAgX3ZhbGlkOiBcIiZbZGF0YS12YWxpZF0sICZbZGF0YS1zdGF0ZT12YWxpZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCZbYXJpYS1idXN5PXRydWVdYCBvciBgJltkYXRhLWxvYWRpbmc9dHJ1ZV1gLlxuICAgKiBVc2VmdWwgZm9yIHN0eWxpbmcgbG9hZGluZyBzdGF0ZXNcbiAgICovXG4gIF9sb2FkaW5nOiBcIiZbZGF0YS1sb2FkaW5nXSwgJlthcmlhLWJ1c3k9dHJ1ZV1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhlIEFSSUEgYXR0cmlidXRlIGBhcmlhLXNlbGVjdGVkYCBpcyBgdHJ1ZWBcbiAgICpcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbYXJpYS1zZWxlY3RlZD10cnVlXWBcbiAgICovXG4gIF9zZWxlY3RlZDogXCImW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0sICZbZGF0YS1zZWxlY3RlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYFtoaWRkZW49dHJ1ZV1gXG4gICAqL1xuICBfaGlkZGVuOiBcIiZbaGlkZGVuXSwgJltkYXRhLWhpZGRlbl1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6LXdlYmtpdC1hdXRvZmlsbGBcbiAgICovXG4gIF9hdXRvZmlsbDogXCImOi13ZWJraXQtYXV0b2ZpbGxcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6bnRoLWNoaWxkKGV2ZW4pYFxuICAgKi9cbiAgX2V2ZW46IFwiJjpudGgtb2YtdHlwZShldmVuKVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpudGgtY2hpbGQob2RkKWBcbiAgICovXG4gIF9vZGQ6IFwiJjpudGgtb2YtdHlwZShvZGQpXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOmZpcnN0LW9mLXR5cGVgXG4gICAqL1xuICBfZmlyc3Q6IFwiJjpmaXJzdC1vZi10eXBlXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOmxhc3Qtb2YtdHlwZWBcbiAgICovXG4gIF9sYXN0OiBcIiY6bGFzdC1vZi10eXBlXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOm5vdCg6Zmlyc3Qtb2YtdHlwZSlgXG4gICAqL1xuICBfbm90Rmlyc3Q6IFwiJjpub3QoOmZpcnN0LW9mLXR5cGUpXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOm5vdCg6bGFzdC1vZi10eXBlKWBcbiAgICovXG4gIF9ub3RMYXN0OiBcIiY6bm90KDpsYXN0LW9mLXR5cGUpXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOnZpc2l0ZWRgXG4gICAqL1xuICBfdmlzaXRlZDogXCImOnZpc2l0ZWRcIixcblxuICAvKipcbiAgICogVXNlZCB0byBzdHlsZSB0aGUgYWN0aXZlIGxpbmsgaW4gYSBuYXZpZ2F0aW9uXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmW2FyaWEtY3VycmVudD1wYWdlXWBcbiAgICovXG4gIF9hY3RpdmVMaW5rOiBcIiZbYXJpYS1jdXJyZW50PXBhZ2VdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoZSBBUklBIGF0dHJpYnV0ZSBgYXJpYS1jaGVja2VkYCBpcyBgbWl4ZWRgXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2FyaWEtY2hlY2tlZD1taXhlZF1gXG4gICAqL1xuICBfaW5kZXRlcm1pbmF0ZTogXCImOmluZGV0ZXJtaW5hdGUsICZbYXJpYS1jaGVja2VkPW1peGVkXSwgJltkYXRhLWluZGV0ZXJtaW5hdGVdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHBhcmVudCBpcyBob3ZlcmVkXG4gICAqL1xuICBfZ3JvdXBIb3ZlcjogdG9Hcm91cChncm91cC5ob3ZlciksXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHBhcmVudCBpcyBmb2N1c2VkXG4gICAqL1xuICBfZ3JvdXBGb2N1czogdG9Hcm91cChncm91cC5mb2N1cyksXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHBhcmVudCBpcyBhY3RpdmVcbiAgICovXG4gIF9ncm91cEFjdGl2ZTogdG9Hcm91cChncm91cC5hY3RpdmUpLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBwYXJlbnQgaXMgZGlzYWJsZWRcbiAgICovXG4gIF9ncm91cERpc2FibGVkOiB0b0dyb3VwKGdyb3VwLmRpc2FibGVkKSxcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gcGFyZW50IGlzIGludmFsaWRcbiAgICovXG4gIF9ncm91cEludmFsaWQ6IHRvR3JvdXAoZ3JvdXAuaW52YWxpZCksXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHBhcmVudCBpcyBjaGVja2VkXG4gICAqL1xuICBfZ3JvdXBDaGVja2VkOiB0b0dyb3VwKGdyb3VwLmNoZWNrZWQpLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjo6cGxhY2Vob2xkZXJgLlxuICAgKi9cbiAgX3BsYWNlaG9sZGVyOiBcIiY6OnBsYWNlaG9sZGVyXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOmZ1bGxzY3JlZW5gLlxuICAgKi9cbiAgX2Z1bGxTY3JlZW46IFwiJjpmdWxsc2NyZWVuXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOjpzZWxlY3Rpb25gXG4gICAqL1xuICBfc2VsZWN0aW9uOiBcIiY6OnNlbGVjdGlvblwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgW2Rpcj1ydGxdICZgXG4gICAqIEl0IGlzIGFwcGxpZWQgd2hlbiBhbnkgcGFyZW50IGVsZW1lbnQgaGFzIGBkaXI9XCJydGxcImBcbiAgICovXG4gIF9ydGw6IFwiW2Rpcj1ydGxdICZcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYEBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspYFxuICAgKiB1c2VkIHdoZW4gdGhlIHVzZXIgaGFzIHJlcXVlc3RlZCB0aGUgc3lzdGVtXG4gICAqIHVzZSBhIGxpZ2h0IG9yIGRhcmsgY29sb3IgdGhlbWUuXG4gICAqL1xuICBfbWVkaWFEYXJrOiBcIkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3Igd2hlbiBgLmRhcmtgIGlzIGFwcGxpZWQgdG8gYW55IHBhcmVudCBvZlxuICAgKiB0aGlzIGNvbXBvbmVudCBvciBlbGVtZW50LlxuICAgKi9cbiAgX2Rhcms6IFwiLmRhcmsgJiwgW2RhdGEtdGhlbWU9ZGFya10gJlwiXG59O1xuZXhwb3J0IHZhciBwc2V1ZG9Qcm9wTmFtZXMgPSBvYmplY3RLZXlzKHBzZXVkb1NlbGVjdG9ycyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wc2V1ZG9zLmpzLm1hcCIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCB7IG1lcmdlV2l0aCwgb2JqZWN0S2V5cyB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5pbXBvcnQgeyBiYWNrZ3JvdW5kLCBib3JkZXIsIGNvbG9yLCBmbGV4Ym94LCBncmlkLCBsYXlvdXQsIGxpc3QsIG90aGVycywgb3V0bGluZSwgcG9zaXRpb24sIHNoYWRvdywgc3BhY2UsIHRyYW5zZm9ybSwgdHJhbnNpdGlvbiwgdHlwb2dyYXBoeSB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgcHNldWRvUHJvcE5hbWVzLCBwc2V1ZG9TZWxlY3RvcnMgfSBmcm9tIFwiLi9wc2V1ZG9zXCI7XG5leHBvcnQgdmFyIHN5c3RlbVByb3BzID0gbWVyZ2VXaXRoKHt9LCBiYWNrZ3JvdW5kLCBib3JkZXIsIGNvbG9yLCBmbGV4Ym94LCBsYXlvdXQsIG91dGxpbmUsIGdyaWQsIG90aGVycywgcG9zaXRpb24sIHNoYWRvdywgc3BhY2UsIHR5cG9ncmFwaHksIHRyYW5zZm9ybSwgbGlzdCwgdHJhbnNpdGlvbik7XG52YXIgbGF5b3V0U3lzdGVtID0gbWVyZ2VXaXRoKHt9LCBzcGFjZSwgbGF5b3V0LCBmbGV4Ym94LCBncmlkLCBwb3NpdGlvbik7XG5leHBvcnQgdmFyIGxheW91dFByb3BOYW1lcyA9IG9iamVjdEtleXMobGF5b3V0U3lzdGVtKTtcbmV4cG9ydCB2YXIgcHJvcE5hbWVzID0gWy4uLm9iamVjdEtleXMoc3lzdGVtUHJvcHMpLCAuLi5wc2V1ZG9Qcm9wTmFtZXNdO1xuXG52YXIgc3R5bGVQcm9wcyA9IF9leHRlbmRzKHt9LCBzeXN0ZW1Qcm9wcywgcHNldWRvU2VsZWN0b3JzKTtcblxuZXhwb3J0IHZhciBpc1N0eWxlUHJvcCA9IHByb3AgPT4gcHJvcCBpbiBzdHlsZVByb3BzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtLmpzLm1hcCIsImltcG9ydCB7IGlzT2JqZWN0LCBtZXJnZVdpdGggYXMgbWVyZ2UsIHJ1bklmRm4sIGlzQ3NzVmFyLCBpc1N0cmluZyB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5pbXBvcnQgeyBleHBhbmRSZXNwb25zaXZlIH0gZnJvbSBcIi4vZXhwYW5kLXJlc3BvbnNpdmVcIjtcbmltcG9ydCB7IHBzZXVkb1NlbGVjdG9ycyB9IGZyb20gXCIuL3BzZXVkb3NcIjtcbmltcG9ydCB7IHN5c3RlbVByb3BzIGFzIHN5c3RlbVByb3BDb25maWdzIH0gZnJvbSBcIi4vc3lzdGVtXCI7XG5cbnZhciBpc0NTU1ZhcmlhYmxlVG9rZW5WYWx1ZSA9IChrZXksIHZhbHVlKSA9PiBrZXkuc3RhcnRzV2l0aChcIi0tXCIpICYmIGlzU3RyaW5nKHZhbHVlKSAmJiAhaXNDc3NWYXIodmFsdWUpO1xuXG52YXIgcmVzb2x2ZVRva2VuVmFsdWUgPSAodGhlbWUsIHZhbHVlKSA9PiB7XG4gIHZhciBfcmVmLCBfZ2V0VmFyMjtcblxuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHZhbHVlO1xuXG4gIHZhciBnZXRWYXIgPSB2YWwgPT4ge1xuICAgIHZhciBfdGhlbWUkX19jc3NNYXAsIF90aGVtZSRfX2Nzc01hcCR2YWw7XG5cbiAgICByZXR1cm4gKF90aGVtZSRfX2Nzc01hcCA9IHRoZW1lLl9fY3NzTWFwKSA9PSBudWxsID8gdm9pZCAwIDogKF90aGVtZSRfX2Nzc01hcCR2YWwgPSBfdGhlbWUkX19jc3NNYXBbdmFsXSkgPT0gbnVsbCA/IHZvaWQgMCA6IF90aGVtZSRfX2Nzc01hcCR2YWwudmFyUmVmO1xuICB9O1xuXG4gIHZhciBnZXRWYWx1ZSA9IHZhbCA9PiB7XG4gICAgdmFyIF9nZXRWYXI7XG5cbiAgICByZXR1cm4gKF9nZXRWYXIgPSBnZXRWYXIodmFsKSkgIT0gbnVsbCA/IF9nZXRWYXIgOiB2YWw7XG4gIH07XG5cbiAgdmFyIHZhbHVlU3BsaXQgPSB2YWx1ZS5zcGxpdChcIixcIikubWFwKHYgPT4gdi50cmltKCkpO1xuICB2YXIgW3Rva2VuVmFsdWUsIGZhbGxiYWNrVmFsdWVdID0gdmFsdWVTcGxpdDtcbiAgdmFsdWUgPSAoX3JlZiA9IChfZ2V0VmFyMiA9IGdldFZhcih0b2tlblZhbHVlKSkgIT0gbnVsbCA/IF9nZXRWYXIyIDogZ2V0VmFsdWUoZmFsbGJhY2tWYWx1ZSkpICE9IG51bGwgPyBfcmVmIDogZ2V0VmFsdWUodmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3NzKG9wdGlvbnMpIHtcbiAgdmFyIHtcbiAgICBjb25maWdzID0ge30sXG4gICAgcHNldWRvcyA9IHt9LFxuICAgIHRoZW1lXG4gIH0gPSBvcHRpb25zO1xuXG4gIHZhciBjc3MgPSBmdW5jdGlvbiBjc3Moc3R5bGVzT3JGbiwgbmVzdGVkKSB7XG4gICAgaWYgKG5lc3RlZCA9PT0gdm9pZCAwKSB7XG4gICAgICBuZXN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgX3N0eWxlcyA9IHJ1bklmRm4oc3R5bGVzT3JGbiwgdGhlbWUpO1xuXG4gICAgdmFyIHN0eWxlcyA9IGV4cGFuZFJlc3BvbnNpdmUoX3N0eWxlcykodGhlbWUpO1xuICAgIHZhciBjb21wdXRlZFN0eWxlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIHN0eWxlcykge1xuICAgICAgdmFyIF9jb25maWckdHJhbnNmb3JtLCBfY29uZmlnLCBfY29uZmlnMiwgX2NvbmZpZzMsIF9jb25maWc0O1xuXG4gICAgICB2YXIgdmFsdWVPckZuID0gc3R5bGVzW2tleV07XG4gICAgICAvKipcbiAgICAgICAqIGFsbG93cyB0aGUgdXNlciB0byBwYXNzIGZ1bmN0aW9uYWwgdmFsdWVzXG4gICAgICAgKiBib3hTaGFkb3c6IHRoZW1lID0+IGAwIDJweCAycHggJHt0aGVtZS5jb2xvcnMucmVkfWBcbiAgICAgICAqL1xuXG4gICAgICB2YXIgdmFsdWUgPSBydW5JZkZuKHZhbHVlT3JGbiwgdGhlbWUpO1xuICAgICAgLyoqXG4gICAgICAgKiBjb252ZXJ0cyBwc2V1ZG8gc2hvcnRoYW5kcyB0byB2YWxpZCBzZWxlY3RvclxuICAgICAgICogXCJfaG92ZXJcIiA9PiBcIiY6aG92ZXJcIlxuICAgICAgICovXG5cbiAgICAgIGlmIChrZXkgaW4gcHNldWRvcykge1xuICAgICAgICBrZXkgPSBwc2V1ZG9zW2tleV07XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIGFsbG93cyB0aGUgdXNlciB0byB1c2UgdGhlbWUgdG9rZW5zIGluIGNzcyB2YXJzXG4gICAgICAgKiB7IC0tYmFubmVyLWhlaWdodDogXCJzaXplcy5tZFwiIH0gPT4geyAtLWJhbm5lci1oZWlnaHQ6IFwidmFyKC0tY2hha3JhLXNpemVzLW1kKVwiIH1cbiAgICAgICAqXG4gICAgICAgKiBZb3UgY2FuIGFsc28gcHJvdmlkZSBmYWxsYmFjayB2YWx1ZXNcbiAgICAgICAqIHsgLS1iYW5uZXItaGVpZ2h0OiBcInNpemVzLm5vLWV4aXN0LCA0MHB4XCIgfSA9PiB7IC0tYmFubmVyLWhlaWdodDogXCI0MHB4XCIgfVxuICAgICAgICovXG5cblxuICAgICAgaWYgKGlzQ1NTVmFyaWFibGVUb2tlblZhbHVlKGtleSwgdmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcmVzb2x2ZVRva2VuVmFsdWUodGhlbWUsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbmZpZyA9IGNvbmZpZ3Nba2V5XTtcblxuICAgICAgaWYgKGNvbmZpZyA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgcHJvcGVydHk6IGtleVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHZhciBfY29tcHV0ZWRTdHlsZXMka2V5O1xuXG4gICAgICAgIGNvbXB1dGVkU3R5bGVzW2tleV0gPSAoX2NvbXB1dGVkU3R5bGVzJGtleSA9IGNvbXB1dGVkU3R5bGVzW2tleV0pICE9IG51bGwgPyBfY29tcHV0ZWRTdHlsZXMka2V5IDoge307XG4gICAgICAgIGNvbXB1dGVkU3R5bGVzW2tleV0gPSBtZXJnZSh7fSwgY29tcHV0ZWRTdHlsZXNba2V5XSwgY3NzKHZhbHVlLCB0cnVlKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmF3VmFsdWUgPSAoX2NvbmZpZyR0cmFuc2Zvcm0gPSAoX2NvbmZpZyA9IGNvbmZpZykgPT0gbnVsbCA/IHZvaWQgMCA6IF9jb25maWcudHJhbnNmb3JtID09IG51bGwgPyB2b2lkIDAgOiBfY29uZmlnLnRyYW5zZm9ybSh2YWx1ZSwgdGhlbWUsIF9zdHlsZXMpKSAhPSBudWxsID8gX2NvbmZpZyR0cmFuc2Zvcm0gOiB2YWx1ZTtcbiAgICAgIC8qKlxuICAgICAgICogVXNlZCBmb3IgYGxheWVyU3R5bGVgLCBgdGV4dFN0eWxlYCBhbmQgYGFwcGx5YC4gQWZ0ZXIgZ2V0dGluZyB0aGVcbiAgICAgICAqIHN0eWxlcyBpbiB0aGUgdGhlbWUsIHdlIG5lZWQgdG8gcHJvY2VzcyB0aGVtIHNpbmNlIHRoZXkgbWlnaHRcbiAgICAgICAqIGNvbnRhaW4gdGhlbWUgdG9rZW5zLlxuICAgICAgICpcbiAgICAgICAqIGBwcm9jZXNzUmVzdWx0YCBpcyB0aGUgY29uZmlnIHByb3BlcnR5IHdlIHBhc3MgdG8gYGxheWVyU3R5bGVgLCBgdGV4dFN0eWxlYCBhbmQgYGFwcGx5YFxuICAgICAgICovXG5cbiAgICAgIHJhd1ZhbHVlID0gKF9jb25maWcyID0gY29uZmlnKSAhPSBudWxsICYmIF9jb25maWcyLnByb2Nlc3NSZXN1bHQgPyBjc3MocmF3VmFsdWUsIHRydWUpIDogcmF3VmFsdWU7XG4gICAgICAvKipcbiAgICAgICAqIGFsbG93cyB1cyBkZWZpbmUgY3NzIHByb3BlcnRpZXMgZm9yIFJUTCBhbmQgTFRSLlxuICAgICAgICpcbiAgICAgICAqIGNvbnN0IG1hcmdpblN0YXJ0ID0ge1xuICAgICAgICogICBwcm9wZXJ0eTogdGhlbWUgPT4gdGhlbWUuZGlyZWN0aW9uID09PSBcInJ0bFwiID8gXCJtYXJnaW5SaWdodFwiOiBcIm1hcmdpbkxlZnRcIixcbiAgICAgICAqIH1cbiAgICAgICAqL1xuXG4gICAgICB2YXIgY29uZmlnUHJvcGVydHkgPSBydW5JZkZuKChfY29uZmlnMyA9IGNvbmZpZykgPT0gbnVsbCA/IHZvaWQgMCA6IF9jb25maWczLnByb3BlcnR5LCB0aGVtZSk7XG5cbiAgICAgIGlmICghbmVzdGVkICYmIChfY29uZmlnNCA9IGNvbmZpZykgIT0gbnVsbCAmJiBfY29uZmlnNC5zdGF0aWMpIHtcbiAgICAgICAgdmFyIHN0YXRpY1N0eWxlcyA9IHJ1bklmRm4oY29uZmlnLnN0YXRpYywgdGhlbWUpO1xuICAgICAgICBjb21wdXRlZFN0eWxlcyA9IG1lcmdlKHt9LCBjb21wdXRlZFN0eWxlcywgc3RhdGljU3R5bGVzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZ1Byb3BlcnR5ICYmIEFycmF5LmlzQXJyYXkoY29uZmlnUHJvcGVydHkpKSB7XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IG9mIGNvbmZpZ1Byb3BlcnR5KSB7XG4gICAgICAgICAgY29tcHV0ZWRTdHlsZXNbcHJvcGVydHldID0gcmF3VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZ1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChjb25maWdQcm9wZXJ0eSA9PT0gXCImXCIgJiYgaXNPYmplY3QocmF3VmFsdWUpKSB7XG4gICAgICAgICAgY29tcHV0ZWRTdHlsZXMgPSBtZXJnZSh7fSwgY29tcHV0ZWRTdHlsZXMsIHJhd1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21wdXRlZFN0eWxlc1tjb25maWdQcm9wZXJ0eV0gPSByYXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNPYmplY3QocmF3VmFsdWUpKSB7XG4gICAgICAgIGNvbXB1dGVkU3R5bGVzID0gbWVyZ2Uoe30sIGNvbXB1dGVkU3R5bGVzLCByYXdWYWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb21wdXRlZFN0eWxlc1trZXldID0gcmF3VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXB1dGVkU3R5bGVzO1xuICB9O1xuXG4gIHJldHVybiBjc3M7XG59XG5leHBvcnQgdmFyIGNzcyA9IHN0eWxlcyA9PiB0aGVtZSA9PiB7XG4gIHZhciBjc3NGbiA9IGdldENzcyh7XG4gICAgdGhlbWUsXG4gICAgcHNldWRvczogcHNldWRvU2VsZWN0b3JzLFxuICAgIGNvbmZpZ3M6IHN5c3RlbVByb3BDb25maWdzXG4gIH0pO1xuICByZXR1cm4gY3NzRm4oc3R5bGVzKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3MuanMubWFwIiwiLyoqXG4gKiBUaGFuayB5b3UgQG1hcmtkYWxnbGVpc2ggZm9yIHRoaXMgcGllY2Ugb2YgYXJ0IVxuICovXG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5cbmZ1bmN0aW9uIHJlc29sdmVSZWZlcmVuY2Uob3BlcmFuZCkge1xuICBpZiAoaXNPYmplY3Qob3BlcmFuZCkgJiYgb3BlcmFuZC5yZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gb3BlcmFuZC5yZWZlcmVuY2U7XG4gIH1cblxuICByZXR1cm4gU3RyaW5nKG9wZXJhbmQpO1xufVxuXG52YXIgdG9FeHByZXNzaW9uID0gZnVuY3Rpb24gdG9FeHByZXNzaW9uKG9wZXJhdG9yKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgb3BlcmFuZHNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIG9wZXJhbmRzLm1hcChyZXNvbHZlUmVmZXJlbmNlKS5qb2luKFwiIFwiICsgb3BlcmF0b3IgKyBcIiBcIikucmVwbGFjZSgvY2FsYy9nLCBcIlwiKTtcbn07XG5cbnZhciBfYWRkID0gZnVuY3Rpb24gYWRkKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgb3BlcmFuZHNbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuXG4gIHJldHVybiBcImNhbGMoXCIgKyB0b0V4cHJlc3Npb24oXCIrXCIsIC4uLm9wZXJhbmRzKSArIFwiKVwiO1xufTtcblxudmFyIF9zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KCkge1xuICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgb3BlcmFuZHNbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgfVxuXG4gIHJldHVybiBcImNhbGMoXCIgKyB0b0V4cHJlc3Npb24oXCItXCIsIC4uLm9wZXJhbmRzKSArIFwiKVwiO1xufTtcblxudmFyIF9tdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KCkge1xuICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgb3BlcmFuZHNbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgfVxuXG4gIHJldHVybiBcImNhbGMoXCIgKyB0b0V4cHJlc3Npb24oXCIqXCIsIC4uLm9wZXJhbmRzKSArIFwiKVwiO1xufTtcblxudmFyIF9kaXZpZGUgPSBmdW5jdGlvbiBkaXZpZGUoKSB7XG4gIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcbiAgICBvcGVyYW5kc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICB9XG5cbiAgcmV0dXJuIFwiY2FsYyhcIiArIHRvRXhwcmVzc2lvbihcIi9cIiwgLi4ub3BlcmFuZHMpICsgXCIpXCI7XG59O1xuXG52YXIgX25lZ2F0ZSA9IHggPT4ge1xuICB2YXIgdmFsdWUgPSByZXNvbHZlUmVmZXJlbmNlKHgpO1xuXG4gIGlmICh2YWx1ZSAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSkuc3RhcnRzV2l0aChcIi1cIikgPyBTdHJpbmcodmFsdWUpLnNsaWNlKDEpIDogXCItXCIgKyB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBfbXVsdGlwbHkodmFsdWUsIC0xKTtcbn07XG5cbmV4cG9ydCB2YXIgY2FsYyA9IE9iamVjdC5hc3NpZ24oeCA9PiAoe1xuICBhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW42KSwgX2tleTYgPSAwOyBfa2V5NiA8IF9sZW42OyBfa2V5NisrKSB7XG4gICAgICBvcGVyYW5kc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICAgIH1cblxuICAgIHJldHVybiBjYWxjKF9hZGQoeCwgLi4ub3BlcmFuZHMpKTtcbiAgfSxcbiAgc3VidHJhY3Q6IGZ1bmN0aW9uIHN1YnRyYWN0KCkge1xuICAgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjcpLCBfa2V5NyA9IDA7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICAgIG9wZXJhbmRzW19rZXk3XSA9IGFyZ3VtZW50c1tfa2V5N107XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGMoX3N1YnRyYWN0KHgsIC4uLm9wZXJhbmRzKSk7XG4gIH0sXG4gIG11bHRpcGx5OiBmdW5jdGlvbiBtdWx0aXBseSgpIHtcbiAgICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW44KSwgX2tleTggPSAwOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgICBvcGVyYW5kc1tfa2V5OF0gPSBhcmd1bWVudHNbX2tleThdO1xuICAgIH1cblxuICAgIHJldHVybiBjYWxjKF9tdWx0aXBseSh4LCAuLi5vcGVyYW5kcykpO1xuICB9LFxuICBkaXZpZGU6IGZ1bmN0aW9uIGRpdmlkZSgpIHtcbiAgICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW45KSwgX2tleTkgPSAwOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG4gICAgICBvcGVyYW5kc1tfa2V5OV0gPSBhcmd1bWVudHNbX2tleTldO1xuICAgIH1cblxuICAgIHJldHVybiBjYWxjKF9kaXZpZGUoeCwgLi4ub3BlcmFuZHMpKTtcbiAgfSxcbiAgbmVnYXRlOiAoKSA9PiBjYWxjKF9uZWdhdGUoeCkpLFxuICB0b1N0cmluZzogKCkgPT4geC50b1N0cmluZygpXG59KSwge1xuICBhZGQ6IF9hZGQsXG4gIHN1YnRyYWN0OiBfc3VidHJhY3QsXG4gIG11bHRpcGx5OiBfbXVsdGlwbHksXG4gIGRpdmlkZTogX2RpdmlkZSxcbiAgbmVnYXRlOiBfbmVnYXRlXG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbGMuanMubWFwIiwiLypcblxuQmFzZWQgb2ZmIGdsYW1vcidzIFN0eWxlU2hlZXQsIHRoYW5rcyBTdW5pbCDinaTvuI9cblxuaGlnaCBwZXJmb3JtYW5jZSBTdHlsZVNoZWV0IGZvciBjc3MtaW4tanMgc3lzdGVtc1xuXG4tIHVzZXMgbXVsdGlwbGUgc3R5bGUgdGFncyBiZWhpbmQgdGhlIHNjZW5lcyBmb3IgbWlsbGlvbnMgb2YgcnVsZXNcbi0gdXNlcyBgaW5zZXJ0UnVsZWAgZm9yIGFwcGVuZGluZyBpbiBwcm9kdWN0aW9uIGZvciAqbXVjaCogZmFzdGVyIHBlcmZvcm1hbmNlXG5cbi8vIHVzYWdlXG5cbmltcG9ydCB7IFN0eWxlU2hlZXQgfSBmcm9tICdAZW1vdGlvbi9zaGVldCdcblxubGV0IHN0eWxlU2hlZXQgPSBuZXcgU3R5bGVTaGVldCh7IGtleTogJycsIGNvbnRhaW5lcjogZG9jdW1lbnQuaGVhZCB9KVxuXG5zdHlsZVNoZWV0Lmluc2VydCgnI2JveCB7IGJvcmRlcjogMXB4IHNvbGlkIHJlZDsgfScpXG4tIGFwcGVuZHMgYSBjc3MgcnVsZSBpbnRvIHRoZSBzdHlsZXNoZWV0XG5cbnN0eWxlU2hlZXQuZmx1c2goKVxuLSBlbXB0aWVzIHRoZSBzdHlsZXNoZWV0IG9mIGFsbCBpdHMgY29udGVudHNcblxuKi9cbi8vICRGbG93Rml4TWVcbmZ1bmN0aW9uIHNoZWV0Rm9yVGFnKHRhZykge1xuICBpZiAodGFnLnNoZWV0KSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiB0YWcuc2hlZXQ7XG4gIH0gLy8gdGhpcyB3ZWlyZG5lc3MgYnJvdWdodCB0byB5b3UgYnkgZmlyZWZveFxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLm93bmVyTm9kZSA9PT0gdGFnKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICByZXR1cm4gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICB0YWcuc2V0QXR0cmlidXRlKCdkYXRhLWVtb3Rpb24nLCBvcHRpb25zLmtleSk7XG5cbiAgaWYgKG9wdGlvbnMubm9uY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHRhZy5zZXRBdHRyaWJ1dGUoJ25vbmNlJywgb3B0aW9ucy5ub25jZSk7XG4gIH1cblxuICB0YWcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgdGFnLnNldEF0dHJpYnV0ZSgnZGF0YS1zJywgJycpO1xuICByZXR1cm4gdGFnO1xufVxuXG52YXIgU3R5bGVTaGVldCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFN0eWxlU2hlZXQob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLl9pbnNlcnRUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgICB2YXIgYmVmb3JlO1xuXG4gICAgICBpZiAoX3RoaXMudGFncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYmVmb3JlID0gX3RoaXMucHJlcGVuZCA/IF90aGlzLmNvbnRhaW5lci5maXJzdENoaWxkIDogX3RoaXMuYmVmb3JlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmVmb3JlID0gX3RoaXMudGFnc1tfdGhpcy50YWdzLmxlbmd0aCAtIDFdLm5leHRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRhZywgYmVmb3JlKTtcblxuICAgICAgX3RoaXMudGFncy5wdXNoKHRhZyk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNTcGVlZHkgPSBvcHRpb25zLnNwZWVkeSA9PT0gdW5kZWZpbmVkID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA6IG9wdGlvbnMuc3BlZWR5O1xuICAgIHRoaXMudGFncyA9IFtdO1xuICAgIHRoaXMuY3RyID0gMDtcbiAgICB0aGlzLm5vbmNlID0gb3B0aW9ucy5ub25jZTsgLy8ga2V5IGlzIHRoZSB2YWx1ZSBvZiB0aGUgZGF0YS1lbW90aW9uIGF0dHJpYnV0ZSwgaXQncyB1c2VkIHRvIGlkZW50aWZ5IGRpZmZlcmVudCBzaGVldHNcblxuICAgIHRoaXMua2V5ID0gb3B0aW9ucy5rZXk7XG4gICAgdGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcjtcbiAgICB0aGlzLnByZXBlbmQgPSBvcHRpb25zLnByZXBlbmQ7XG4gICAgdGhpcy5iZWZvcmUgPSBudWxsO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFN0eWxlU2hlZXQucHJvdG90eXBlO1xuXG4gIF9wcm90by5oeWRyYXRlID0gZnVuY3Rpb24gaHlkcmF0ZShub2Rlcykge1xuICAgIG5vZGVzLmZvckVhY2godGhpcy5faW5zZXJ0VGFnKTtcbiAgfTtcblxuICBfcHJvdG8uaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0KHJ1bGUpIHtcbiAgICAvLyB0aGUgbWF4IGxlbmd0aCBpcyBob3cgbWFueSBydWxlcyB3ZSBoYXZlIHBlciBzdHlsZSB0YWcsIGl0J3MgNjUwMDAgaW4gc3BlZWR5IG1vZGVcbiAgICAvLyBpdCdzIDEgaW4gZGV2IGJlY2F1c2Ugd2UgaW5zZXJ0IHNvdXJjZSBtYXBzIHRoYXQgbWFwIGEgc2luZ2xlIHJ1bGUgdG8gYSBsb2NhdGlvblxuICAgIC8vIGFuZCB5b3UgY2FuIG9ubHkgaGF2ZSBvbmUgc291cmNlIG1hcCBwZXIgc3R5bGUgdGFnXG4gICAgaWYgKHRoaXMuY3RyICUgKHRoaXMuaXNTcGVlZHkgPyA2NTAwMCA6IDEpID09PSAwKSB7XG4gICAgICB0aGlzLl9pbnNlcnRUYWcoY3JlYXRlU3R5bGVFbGVtZW50KHRoaXMpKTtcbiAgICB9XG5cbiAgICB2YXIgdGFnID0gdGhpcy50YWdzW3RoaXMudGFncy5sZW5ndGggLSAxXTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgaXNJbXBvcnRSdWxlID0gcnVsZS5jaGFyQ29kZUF0KDApID09PSA2NCAmJiBydWxlLmNoYXJDb2RlQXQoMSkgPT09IDEwNTtcblxuICAgICAgaWYgKGlzSW1wb3J0UnVsZSAmJiB0aGlzLl9hbHJlYWR5SW5zZXJ0ZWRPcmRlckluc2Vuc2l0aXZlUnVsZSkge1xuICAgICAgICAvLyB0aGlzIHdvdWxkIG9ubHkgY2F1c2UgcHJvYmxlbSBpbiBzcGVlZHkgbW9kZVxuICAgICAgICAvLyBidXQgd2UgZG9uJ3Qgd2FudCBlbmFibGluZyBzcGVlZHkgdG8gYWZmZWN0IHRoZSBvYnNlcnZhYmxlIGJlaGF2aW9yXG4gICAgICAgIC8vIHNvIHdlIHJlcG9ydCB0aGlzIGVycm9yIGF0IGFsbCB0aW1lc1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiWW91J3JlIGF0dGVtcHRpbmcgdG8gaW5zZXJ0IHRoZSBmb2xsb3dpbmcgcnVsZTpcXG5cIiArIHJ1bGUgKyAnXFxuXFxuYEBpbXBvcnRgIHJ1bGVzIG11c3QgYmUgYmVmb3JlIGFsbCBvdGhlciB0eXBlcyBvZiBydWxlcyBpbiBhIHN0eWxlc2hlZXQgYnV0IG90aGVyIHJ1bGVzIGhhdmUgYWxyZWFkeSBiZWVuIGluc2VydGVkLiBQbGVhc2UgZW5zdXJlIHRoYXQgYEBpbXBvcnRgIHJ1bGVzIGFyZSBiZWZvcmUgYWxsIG90aGVyIHJ1bGVzLicpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYWxyZWFkeUluc2VydGVkT3JkZXJJbnNlbnNpdGl2ZVJ1bGUgPSB0aGlzLl9hbHJlYWR5SW5zZXJ0ZWRPcmRlckluc2Vuc2l0aXZlUnVsZSB8fCAhaXNJbXBvcnRSdWxlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzU3BlZWR5KSB7XG4gICAgICB2YXIgc2hlZXQgPSBzaGVldEZvclRhZyh0YWcpO1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyB0aGlzIGlzIHRoZSB1bHRyYWZhc3QgdmVyc2lvbiwgd29ya3MgYWNyb3NzIGJyb3dzZXJzXG4gICAgICAgIC8vIHRoZSBiaWcgZHJhd2JhY2sgaXMgdGhhdCB0aGUgY3NzIHdvbid0IGJlIGVkaXRhYmxlIGluIGRldnRvb2xzXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUocnVsZSwgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgIS86KC1tb3otcGxhY2Vob2xkZXJ8LW1zLWlucHV0LXBsYWNlaG9sZGVyfC1tb3otcmVhZC13cml0ZXwtbW96LXJlYWQtb25seSl7Ly50ZXN0KHJ1bGUpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlIHdhcyBhIHByb2JsZW0gaW5zZXJ0aW5nIHRoZSBmb2xsb3dpbmcgcnVsZTogXFxcIlwiICsgcnVsZSArIFwiXFxcIlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0YWcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocnVsZSkpO1xuICAgIH1cblxuICAgIHRoaXMuY3RyKys7XG4gIH07XG5cbiAgX3Byb3RvLmZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHRoaXMudGFncy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgIHJldHVybiB0YWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWcpO1xuICAgIH0pO1xuICAgIHRoaXMudGFncyA9IFtdO1xuICAgIHRoaXMuY3RyID0gMDtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB0aGlzLl9hbHJlYWR5SW5zZXJ0ZWRPcmRlckluc2Vuc2l0aXZlUnVsZSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gU3R5bGVTaGVldDtcbn0oKTtcblxuZXhwb3J0IHsgU3R5bGVTaGVldCB9O1xuIiwidmFyIGUgPSBcIi1tcy1cIjtcbnZhciByID0gXCItbW96LVwiO1xudmFyIGEgPSBcIi13ZWJraXQtXCI7XG52YXIgYyA9IFwiY29tbVwiO1xudmFyIG4gPSBcInJ1bGVcIjtcbnZhciB0ID0gXCJkZWNsXCI7XG52YXIgcyA9IFwiQHBhZ2VcIjtcbnZhciB1ID0gXCJAbWVkaWFcIjtcbnZhciBpID0gXCJAaW1wb3J0XCI7XG52YXIgZiA9IFwiQGNoYXJzZXRcIjtcbnZhciBvID0gXCJAdmlld3BvcnRcIjtcbnZhciBsID0gXCJAc3VwcG9ydHNcIjtcbnZhciB2ID0gXCJAZG9jdW1lbnRcIjtcbnZhciBoID0gXCJAbmFtZXNwYWNlXCI7XG52YXIgcCA9IFwiQGtleWZyYW1lc1wiO1xudmFyIGIgPSBcIkBmb250LWZhY2VcIjtcbnZhciB3ID0gXCJAY291bnRlci1zdHlsZVwiO1xudmFyICQgPSBcIkBmb250LWZlYXR1cmUtdmFsdWVzXCI7XG52YXIgayA9IE1hdGguYWJzO1xudmFyIGQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuZnVuY3Rpb24gbShlMiwgcjIpIHtcbiAgcmV0dXJuICgoKHIyIDw8IDIgXiB6KGUyLCAwKSkgPDwgMiBeIHooZTIsIDEpKSA8PCAyIF4geihlMiwgMikpIDw8IDIgXiB6KGUyLCAzKTtcbn1cbmZ1bmN0aW9uIGcoZTIpIHtcbiAgcmV0dXJuIGUyLnRyaW0oKTtcbn1cbmZ1bmN0aW9uIHgoZTIsIHIyKSB7XG4gIHJldHVybiAoZTIgPSByMi5leGVjKGUyKSkgPyBlMlswXSA6IGUyO1xufVxuZnVuY3Rpb24geShlMiwgcjIsIGEyKSB7XG4gIHJldHVybiBlMi5yZXBsYWNlKHIyLCBhMik7XG59XG5mdW5jdGlvbiBqKGUyLCByMikge1xuICByZXR1cm4gZTIuaW5kZXhPZihyMik7XG59XG5mdW5jdGlvbiB6KGUyLCByMikge1xuICByZXR1cm4gZTIuY2hhckNvZGVBdChyMikgfCAwO1xufVxuZnVuY3Rpb24gQyhlMiwgcjIsIGEyKSB7XG4gIHJldHVybiBlMi5zbGljZShyMiwgYTIpO1xufVxuZnVuY3Rpb24gQShlMikge1xuICByZXR1cm4gZTIubGVuZ3RoO1xufVxuZnVuY3Rpb24gTShlMikge1xuICByZXR1cm4gZTIubGVuZ3RoO1xufVxuZnVuY3Rpb24gTyhlMiwgcjIpIHtcbiAgcmV0dXJuIHIyLnB1c2goZTIpLCBlMjtcbn1cbmZ1bmN0aW9uIFMoZTIsIHIyKSB7XG4gIHJldHVybiBlMi5tYXAocjIpLmpvaW4oXCJcIik7XG59XG52YXIgcSA9IDE7XG52YXIgQiA9IDE7XG52YXIgRCA9IDA7XG52YXIgRSA9IDA7XG52YXIgRiA9IDA7XG52YXIgRyA9IFwiXCI7XG5mdW5jdGlvbiBIKGUyLCByMiwgYTIsIGMyLCBuMiwgdDIsIHMyKSB7XG4gIHJldHVybiB7dmFsdWU6IGUyLCByb290OiByMiwgcGFyZW50OiBhMiwgdHlwZTogYzIsIHByb3BzOiBuMiwgY2hpbGRyZW46IHQyLCBsaW5lOiBxLCBjb2x1bW46IEIsIGxlbmd0aDogczIsIHJldHVybjogXCJcIn07XG59XG5mdW5jdGlvbiBJKGUyLCByMiwgYTIpIHtcbiAgcmV0dXJuIEgoZTIsIHIyLnJvb3QsIHIyLnBhcmVudCwgYTIsIHIyLnByb3BzLCByMi5jaGlsZHJlbiwgMCk7XG59XG5mdW5jdGlvbiBKKCkge1xuICByZXR1cm4gRjtcbn1cbmZ1bmN0aW9uIEsoKSB7XG4gIEYgPSBFID4gMCA/IHooRywgLS1FKSA6IDA7XG4gIGlmIChCLS0sIEYgPT09IDEwKVxuICAgIEIgPSAxLCBxLS07XG4gIHJldHVybiBGO1xufVxuZnVuY3Rpb24gTCgpIHtcbiAgRiA9IEUgPCBEID8geihHLCBFKyspIDogMDtcbiAgaWYgKEIrKywgRiA9PT0gMTApXG4gICAgQiA9IDEsIHErKztcbiAgcmV0dXJuIEY7XG59XG5mdW5jdGlvbiBOKCkge1xuICByZXR1cm4geihHLCBFKTtcbn1cbmZ1bmN0aW9uIFAoKSB7XG4gIHJldHVybiBFO1xufVxuZnVuY3Rpb24gUShlMiwgcjIpIHtcbiAgcmV0dXJuIEMoRywgZTIsIHIyKTtcbn1cbmZ1bmN0aW9uIFIoZTIpIHtcbiAgc3dpdGNoIChlMikge1xuICAgIGNhc2UgMDpcbiAgICBjYXNlIDk6XG4gICAgY2FzZSAxMDpcbiAgICBjYXNlIDEzOlxuICAgIGNhc2UgMzI6XG4gICAgICByZXR1cm4gNTtcbiAgICBjYXNlIDMzOlxuICAgIGNhc2UgNDM6XG4gICAgY2FzZSA0NDpcbiAgICBjYXNlIDQ3OlxuICAgIGNhc2UgNjI6XG4gICAgY2FzZSA2NDpcbiAgICBjYXNlIDEyNjpcbiAgICBjYXNlIDU5OlxuICAgIGNhc2UgMTIzOlxuICAgIGNhc2UgMTI1OlxuICAgICAgcmV0dXJuIDQ7XG4gICAgY2FzZSA1ODpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgMzQ6XG4gICAgY2FzZSAzOTpcbiAgICBjYXNlIDQwOlxuICAgIGNhc2UgOTE6XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlIDQxOlxuICAgIGNhc2UgOTM6XG4gICAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIFQoZTIpIHtcbiAgcmV0dXJuIHEgPSBCID0gMSwgRCA9IEEoRyA9IGUyKSwgRSA9IDAsIFtdO1xufVxuZnVuY3Rpb24gVShlMikge1xuICByZXR1cm4gRyA9IFwiXCIsIGUyO1xufVxuZnVuY3Rpb24gVihlMikge1xuICByZXR1cm4gZyhRKEUgLSAxLCBfKGUyID09PSA5MSA/IGUyICsgMiA6IGUyID09PSA0MCA/IGUyICsgMSA6IGUyKSkpO1xufVxuZnVuY3Rpb24gVyhlMikge1xuICByZXR1cm4gVShZKFQoZTIpKSk7XG59XG5mdW5jdGlvbiBYKGUyKSB7XG4gIHdoaWxlIChGID0gTigpKVxuICAgIGlmIChGIDwgMzMpXG4gICAgICBMKCk7XG4gICAgZWxzZVxuICAgICAgYnJlYWs7XG4gIHJldHVybiBSKGUyKSA+IDIgfHwgUihGKSA+IDMgPyBcIlwiIDogXCIgXCI7XG59XG5mdW5jdGlvbiBZKGUyKSB7XG4gIHdoaWxlIChMKCkpXG4gICAgc3dpdGNoIChSKEYpKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIE8ocmUoRSAtIDEpLCBlMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBPKFYoRiksIGUyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBPKGQoRiksIGUyKTtcbiAgICB9XG4gIHJldHVybiBlMjtcbn1cbmZ1bmN0aW9uIFooZTIsIHIyKSB7XG4gIHdoaWxlICgtLXIyICYmIEwoKSlcbiAgICBpZiAoRiA8IDQ4IHx8IEYgPiAxMDIgfHwgRiA+IDU3ICYmIEYgPCA2NSB8fCBGID4gNzAgJiYgRiA8IDk3KVxuICAgICAgYnJlYWs7XG4gIHJldHVybiBRKGUyLCBQKCkgKyAocjIgPCA2ICYmIE4oKSA9PSAzMiAmJiBMKCkgPT0gMzIpKTtcbn1cbmZ1bmN0aW9uIF8oZTIpIHtcbiAgd2hpbGUgKEwoKSlcbiAgICBzd2l0Y2ggKEYpIHtcbiAgICAgIGNhc2UgZTI6XG4gICAgICAgIHJldHVybiBFO1xuICAgICAgY2FzZSAzNDpcbiAgICAgIGNhc2UgMzk6XG4gICAgICAgIHJldHVybiBfKGUyID09PSAzNCB8fCBlMiA9PT0gMzkgPyBlMiA6IEYpO1xuICAgICAgY2FzZSA0MDpcbiAgICAgICAgaWYgKGUyID09PSA0MSlcbiAgICAgICAgICBfKGUyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDkyOlxuICAgICAgICBMKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgcmV0dXJuIEU7XG59XG5mdW5jdGlvbiBlZShlMiwgcjIpIHtcbiAgd2hpbGUgKEwoKSlcbiAgICBpZiAoZTIgKyBGID09PSA0NyArIDEwKVxuICAgICAgYnJlYWs7XG4gICAgZWxzZSBpZiAoZTIgKyBGID09PSA0MiArIDQyICYmIE4oKSA9PT0gNDcpXG4gICAgICBicmVhaztcbiAgcmV0dXJuIFwiLypcIiArIFEocjIsIEUgLSAxKSArIFwiKlwiICsgZChlMiA9PT0gNDcgPyBlMiA6IEwoKSk7XG59XG5mdW5jdGlvbiByZShlMikge1xuICB3aGlsZSAoIVIoTigpKSlcbiAgICBMKCk7XG4gIHJldHVybiBRKGUyLCBFKTtcbn1cbmZ1bmN0aW9uIGFlKGUyKSB7XG4gIHJldHVybiBVKGNlKFwiXCIsIG51bGwsIG51bGwsIG51bGwsIFtcIlwiXSwgZTIgPSBUKGUyKSwgMCwgWzBdLCBlMikpO1xufVxuZnVuY3Rpb24gY2UoZTIsIHIyLCBhMiwgYzIsIG4yLCB0MiwgczIsIHUyLCBpMikge1xuICB2YXIgZjIgPSAwO1xuICB2YXIgbzIgPSAwO1xuICB2YXIgbDIgPSBzMjtcbiAgdmFyIHYyID0gMDtcbiAgdmFyIGgyID0gMDtcbiAgdmFyIHAyID0gMDtcbiAgdmFyIGIyID0gMTtcbiAgdmFyIHcyID0gMTtcbiAgdmFyICQyID0gMTtcbiAgdmFyIGsyID0gMDtcbiAgdmFyIG0yID0gXCJcIjtcbiAgdmFyIGcyID0gbjI7XG4gIHZhciB4MiA9IHQyO1xuICB2YXIgajIgPSBjMjtcbiAgdmFyIHoyID0gbTI7XG4gIHdoaWxlICh3MilcbiAgICBzd2l0Y2ggKHAyID0gazIsIGsyID0gTCgpKSB7XG4gICAgICBjYXNlIDM0OlxuICAgICAgY2FzZSAzOTpcbiAgICAgIGNhc2UgOTE6XG4gICAgICBjYXNlIDQwOlxuICAgICAgICB6MiArPSBWKGsyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDk6XG4gICAgICBjYXNlIDEwOlxuICAgICAgY2FzZSAxMzpcbiAgICAgIGNhc2UgMzI6XG4gICAgICAgIHoyICs9IFgocDIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgOTI6XG4gICAgICAgIHoyICs9IFooUCgpIC0gMSwgNyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgY2FzZSA0NzpcbiAgICAgICAgc3dpdGNoIChOKCkpIHtcbiAgICAgICAgICBjYXNlIDQyOlxuICAgICAgICAgIGNhc2UgNDc6XG4gICAgICAgICAgICBPKHRlKGVlKEwoKSwgUCgpKSwgcjIsIGEyKSwgaTIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHoyICs9IFwiL1wiO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxMjMgKiBiMjpcbiAgICAgICAgdTJbZjIrK10gPSBBKHoyKSAqICQyO1xuICAgICAgY2FzZSAxMjUgKiBiMjpcbiAgICAgIGNhc2UgNTk6XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHN3aXRjaCAoazIpIHtcbiAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgY2FzZSAxMjU6XG4gICAgICAgICAgICB3MiA9IDA7XG4gICAgICAgICAgY2FzZSA1OSArIG8yOlxuICAgICAgICAgICAgaWYgKGgyID4gMCAmJiBBKHoyKSAtIGwyKVxuICAgICAgICAgICAgICBPKGgyID4gMzIgPyBzZSh6MiArIFwiO1wiLCBjMiwgYTIsIGwyIC0gMSkgOiBzZSh5KHoyLCBcIiBcIiwgXCJcIikgKyBcIjtcIiwgYzIsIGEyLCBsMiAtIDIpLCBpMik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDU5OlxuICAgICAgICAgICAgejIgKz0gXCI7XCI7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIE8oajIgPSBuZSh6MiwgcjIsIGEyLCBmMiwgbzIsIG4yLCB1MiwgbTIsIGcyID0gW10sIHgyID0gW10sIGwyKSwgdDIpO1xuICAgICAgICAgICAgaWYgKGsyID09PSAxMjMpXG4gICAgICAgICAgICAgIGlmIChvMiA9PT0gMClcbiAgICAgICAgICAgICAgICBjZSh6MiwgcjIsIGoyLCBqMiwgZzIsIHQyLCBsMiwgdTIsIHgyKTtcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN3aXRjaCAodjIpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgMTAwOlxuICAgICAgICAgICAgICAgICAgY2FzZSAxMDk6XG4gICAgICAgICAgICAgICAgICBjYXNlIDExNTpcbiAgICAgICAgICAgICAgICAgICAgY2UoZTIsIGoyLCBqMiwgYzIgJiYgTyhuZShlMiwgajIsIGoyLCAwLCAwLCBuMiwgdTIsIG0yLCBuMiwgZzIgPSBbXSwgbDIpLCB4MiksIG4yLCB4MiwgbDIsIHUyLCBjMiA/IGcyIDogeDIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNlKHoyLCBqMiwgajIsIGoyLCBbXCJcIl0sIHgyLCBsMiwgdTIsIHgyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZjIgPSBvMiA9IGgyID0gMCwgYjIgPSAkMiA9IDEsIG0yID0gejIgPSBcIlwiLCBsMiA9IHMyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNTg6XG4gICAgICAgIGwyID0gMSArIEEoejIpLCBoMiA9IHAyO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGIyIDwgMSkge1xuICAgICAgICAgIGlmIChrMiA9PSAxMjMpXG4gICAgICAgICAgICAtLWIyO1xuICAgICAgICAgIGVsc2UgaWYgKGsyID09IDEyNSAmJiBiMisrID09IDAgJiYgSygpID09IDEyNSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoejIgKz0gZChrMiksIGsyICogYjIpIHtcbiAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgJDIgPSBvMiA+IDAgPyAxIDogKHoyICs9IFwiXFxmXCIsIC0xKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNDQ6XG4gICAgICAgICAgICB1MltmMisrXSA9IChBKHoyKSAtIDEpICogJDIsICQyID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNjQ6XG4gICAgICAgICAgICBpZiAoTigpID09PSA0NSlcbiAgICAgICAgICAgICAgejIgKz0gVihMKCkpO1xuICAgICAgICAgICAgdjIgPSBOKCksIG8yID0gQShtMiA9IHoyICs9IHJlKFAoKSkpLCBrMisrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0NTpcbiAgICAgICAgICAgIGlmIChwMiA9PT0gNDUgJiYgQSh6MikgPT0gMilcbiAgICAgICAgICAgICAgYjIgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICByZXR1cm4gdDI7XG59XG5mdW5jdGlvbiBuZShlMiwgcjIsIGEyLCBjMiwgdDIsIHMyLCB1MiwgaTIsIGYyLCBvMiwgbDIpIHtcbiAgdmFyIHYyID0gdDIgLSAxO1xuICB2YXIgaDIgPSB0MiA9PT0gMCA/IHMyIDogW1wiXCJdO1xuICB2YXIgcDIgPSBNKGgyKTtcbiAgZm9yICh2YXIgYjIgPSAwLCB3MiA9IDAsICQyID0gMDsgYjIgPCBjMjsgKytiMilcbiAgICBmb3IgKHZhciBkMiA9IDAsIG0yID0gQyhlMiwgdjIgKyAxLCB2MiA9IGsodzIgPSB1MltiMl0pKSwgeDIgPSBlMjsgZDIgPCBwMjsgKytkMilcbiAgICAgIGlmICh4MiA9IGcodzIgPiAwID8gaDJbZDJdICsgXCIgXCIgKyBtMiA6IHkobTIsIC8mXFxmL2csIGgyW2QyXSkpKVxuICAgICAgICBmMlskMisrXSA9IHgyO1xuICByZXR1cm4gSChlMiwgcjIsIGEyLCB0MiA9PT0gMCA/IG4gOiBpMiwgZjIsIG8yLCBsMik7XG59XG5mdW5jdGlvbiB0ZShlMiwgcjIsIGEyKSB7XG4gIHJldHVybiBIKGUyLCByMiwgYTIsIGMsIGQoSigpKSwgQyhlMiwgMiwgLTIpLCAwKTtcbn1cbmZ1bmN0aW9uIHNlKGUyLCByMiwgYTIsIGMyKSB7XG4gIHJldHVybiBIKGUyLCByMiwgYTIsIHQsIEMoZTIsIDAsIGMyKSwgQyhlMiwgYzIgKyAxLCAtMSksIGMyKTtcbn1cbmZ1bmN0aW9uIHVlKGMyLCBuMikge1xuICBzd2l0Y2ggKG0oYzIsIG4yKSkge1xuICAgIGNhc2UgNTEwMzpcbiAgICAgIHJldHVybiBhICsgXCJwcmludC1cIiArIGMyICsgYzI7XG4gICAgY2FzZSA1NzM3OlxuICAgIGNhc2UgNDIwMTpcbiAgICBjYXNlIDMxNzc6XG4gICAgY2FzZSAzNDMzOlxuICAgIGNhc2UgMTY0MTpcbiAgICBjYXNlIDQ0NTc6XG4gICAgY2FzZSAyOTIxOlxuICAgIGNhc2UgNTU3MjpcbiAgICBjYXNlIDYzNTY6XG4gICAgY2FzZSA1ODQ0OlxuICAgIGNhc2UgMzE5MTpcbiAgICBjYXNlIDY2NDU6XG4gICAgY2FzZSAzMDA1OlxuICAgIGNhc2UgNjM5MTpcbiAgICBjYXNlIDU4Nzk6XG4gICAgY2FzZSA1NjIzOlxuICAgIGNhc2UgNjEzNTpcbiAgICBjYXNlIDQ1OTk6XG4gICAgY2FzZSA0ODU1OlxuICAgIGNhc2UgNDIxNTpcbiAgICBjYXNlIDYzODk6XG4gICAgY2FzZSA1MTA5OlxuICAgIGNhc2UgNTM2NTpcbiAgICBjYXNlIDU2MjE6XG4gICAgY2FzZSAzODI5OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGMyO1xuICAgIGNhc2UgNTM0OTpcbiAgICBjYXNlIDQyNDY6XG4gICAgY2FzZSA0ODEwOlxuICAgIGNhc2UgNjk2ODpcbiAgICBjYXNlIDI3NTY6XG4gICAgICByZXR1cm4gYSArIGMyICsgciArIGMyICsgZSArIGMyICsgYzI7XG4gICAgY2FzZSA2ODI4OlxuICAgIGNhc2UgNDI2ODpcbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgYzIgKyBjMjtcbiAgICBjYXNlIDYxNjU6XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIFwiZmxleC1cIiArIGMyICsgYzI7XG4gICAgY2FzZSA1MTg3OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIHkoYzIsIC8oXFx3KykuKyg6W15dKykvLCBhICsgXCJib3gtJDEkMlwiICsgZSArIFwiZmxleC0kMSQyXCIpICsgYzI7XG4gICAgY2FzZSA1NDQzOlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyBcImZsZXgtaXRlbS1cIiArIHkoYzIsIC9mbGV4LXwtc2VsZi8sIFwiXCIpICsgYzI7XG4gICAgY2FzZSA0Njc1OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyBcImZsZXgtbGluZS1wYWNrXCIgKyB5KGMyLCAvYWxpZ24tY29udGVudHxmbGV4LXwtc2VsZi8sIFwiXCIpICsgYzI7XG4gICAgY2FzZSA1NTQ4OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyB5KGMyLCBcInNocmlua1wiLCBcIm5lZ2F0aXZlXCIpICsgYzI7XG4gICAgY2FzZSA1MjkyOlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyB5KGMyLCBcImJhc2lzXCIsIFwicHJlZmVycmVkLXNpemVcIikgKyBjMjtcbiAgICBjYXNlIDYwNjA6XG4gICAgICByZXR1cm4gYSArIFwiYm94LVwiICsgeShjMiwgXCItZ3Jvd1wiLCBcIlwiKSArIGEgKyBjMiArIGUgKyB5KGMyLCBcImdyb3dcIiwgXCJwb3NpdGl2ZVwiKSArIGMyO1xuICAgIGNhc2UgNDU1NDpcbiAgICAgIHJldHVybiBhICsgeShjMiwgLyhbXi1dKSh0cmFuc2Zvcm0pL2csIFwiJDFcIiArIGEgKyBcIiQyXCIpICsgYzI7XG4gICAgY2FzZSA2MTg3OlxuICAgICAgcmV0dXJuIHkoeSh5KGMyLCAvKHpvb20tfGdyYWIpLywgYSArIFwiJDFcIiksIC8oaW1hZ2Utc2V0KS8sIGEgKyBcIiQxXCIpLCBjMiwgXCJcIikgKyBjMjtcbiAgICBjYXNlIDU0OTU6XG4gICAgY2FzZSAzOTU5OlxuICAgICAgcmV0dXJuIHkoYzIsIC8oaW1hZ2Utc2V0XFwoW15dKikvLCBhICsgXCIkMSRgJDFcIik7XG4gICAgY2FzZSA0OTY4OlxuICAgICAgcmV0dXJuIHkoeShjMiwgLyguKzopKGZsZXgtKT8oLiopLywgYSArIFwiYm94LXBhY2s6JDNcIiArIGUgKyBcImZsZXgtcGFjazokM1wiKSwgL3MuKy1iW147XSsvLCBcImp1c3RpZnlcIikgKyBhICsgYzIgKyBjMjtcbiAgICBjYXNlIDQwOTU6XG4gICAgY2FzZSAzNTgzOlxuICAgIGNhc2UgNDA2ODpcbiAgICBjYXNlIDI1MzI6XG4gICAgICByZXR1cm4geShjMiwgLyguKyktaW5saW5lKC4rKS8sIGEgKyBcIiQxJDJcIikgKyBjMjtcbiAgICBjYXNlIDgxMTY6XG4gICAgY2FzZSA3MDU5OlxuICAgIGNhc2UgNTc1MzpcbiAgICBjYXNlIDU1MzU6XG4gICAgY2FzZSA1NDQ1OlxuICAgIGNhc2UgNTcwMTpcbiAgICBjYXNlIDQ5MzM6XG4gICAgY2FzZSA0Njc3OlxuICAgIGNhc2UgNTUzMzpcbiAgICBjYXNlIDU3ODk6XG4gICAgY2FzZSA1MDIxOlxuICAgIGNhc2UgNDc2NTpcbiAgICAgIGlmIChBKGMyKSAtIDEgLSBuMiA+IDYpXG4gICAgICAgIHN3aXRjaCAoeihjMiwgbjIgKyAxKSkge1xuICAgICAgICAgIGNhc2UgMTA5OlxuICAgICAgICAgICAgaWYgKHooYzIsIG4yICsgNCkgIT09IDQ1KVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDEwMjpcbiAgICAgICAgICAgIHJldHVybiB5KGMyLCAvKC4rOikoLispLShbXl0rKS8sIFwiJDFcIiArIGEgKyBcIiQyLSQzJDFcIiArIHIgKyAoeihjMiwgbjIgKyAzKSA9PSAxMDggPyBcIiQzXCIgOiBcIiQyLSQzXCIpKSArIGMyO1xuICAgICAgICAgIGNhc2UgMTE1OlxuICAgICAgICAgICAgcmV0dXJuIH5qKGMyLCBcInN0cmV0Y2hcIikgPyB1ZSh5KGMyLCBcInN0cmV0Y2hcIiwgXCJmaWxsLWF2YWlsYWJsZVwiKSwgbjIpICsgYzIgOiBjMjtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSA0OTQ5OlxuICAgICAgaWYgKHooYzIsIG4yICsgMSkgIT09IDExNSlcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSA2NDQ0OlxuICAgICAgc3dpdGNoICh6KGMyLCBBKGMyKSAtIDMgLSAofmooYzIsIFwiIWltcG9ydGFudFwiKSAmJiAxMCkpKSB7XG4gICAgICAgIGNhc2UgMTA3OlxuICAgICAgICAgIHJldHVybiB5KGMyLCBcIjpcIiwgXCI6XCIgKyBhKSArIGMyO1xuICAgICAgICBjYXNlIDEwMTpcbiAgICAgICAgICByZXR1cm4geShjMiwgLyguKzopKFteOyFdKykoO3whLispPy8sIFwiJDFcIiArIGEgKyAoeihjMiwgMTQpID09PSA0NSA/IFwiaW5saW5lLVwiIDogXCJcIikgKyBcImJveCQzJDFcIiArIGEgKyBcIiQyJDMkMVwiICsgZSArIFwiJDJib3gkM1wiKSArIGMyO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSA1OTM2OlxuICAgICAgc3dpdGNoICh6KGMyLCBuMiArIDExKSkge1xuICAgICAgICBjYXNlIDExNDpcbiAgICAgICAgICByZXR1cm4gYSArIGMyICsgZSArIHkoYzIsIC9bc3ZoXVxcdystW3RibHJdezJ9LywgXCJ0YlwiKSArIGMyO1xuICAgICAgICBjYXNlIDEwODpcbiAgICAgICAgICByZXR1cm4gYSArIGMyICsgZSArIHkoYzIsIC9bc3ZoXVxcdystW3RibHJdezJ9LywgXCJ0Yi1ybFwiKSArIGMyO1xuICAgICAgICBjYXNlIDQ1OlxuICAgICAgICAgIHJldHVybiBhICsgYzIgKyBlICsgeShjMiwgL1tzdmhdXFx3Ky1bdGJscl17Mn0vLCBcImxyXCIpICsgYzI7XG4gICAgICB9XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIGMyICsgYzI7XG4gIH1cbiAgcmV0dXJuIGMyO1xufVxuZnVuY3Rpb24gaWUoZTIsIHIyKSB7XG4gIHZhciBhMiA9IFwiXCI7XG4gIHZhciBjMiA9IE0oZTIpO1xuICBmb3IgKHZhciBuMiA9IDA7IG4yIDwgYzI7IG4yKyspXG4gICAgYTIgKz0gcjIoZTJbbjJdLCBuMiwgZTIsIHIyKSB8fCBcIlwiO1xuICByZXR1cm4gYTI7XG59XG5mdW5jdGlvbiBmZShlMiwgcjIsIGEyLCBzMikge1xuICBzd2l0Y2ggKGUyLnR5cGUpIHtcbiAgICBjYXNlIGk6XG4gICAgY2FzZSB0OlxuICAgICAgcmV0dXJuIGUyLnJldHVybiA9IGUyLnJldHVybiB8fCBlMi52YWx1ZTtcbiAgICBjYXNlIGM6XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICBjYXNlIG46XG4gICAgICBlMi52YWx1ZSA9IGUyLnByb3BzLmpvaW4oXCIsXCIpO1xuICB9XG4gIHJldHVybiBBKGEyID0gaWUoZTIuY2hpbGRyZW4sIHMyKSkgPyBlMi5yZXR1cm4gPSBlMi52YWx1ZSArIFwie1wiICsgYTIgKyBcIn1cIiA6IFwiXCI7XG59XG5mdW5jdGlvbiBvZShlMikge1xuICB2YXIgcjIgPSBNKGUyKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEyLCBjMiwgbjIsIHQyKSB7XG4gICAgdmFyIHMyID0gXCJcIjtcbiAgICBmb3IgKHZhciB1MiA9IDA7IHUyIDwgcjI7IHUyKyspXG4gICAgICBzMiArPSBlMlt1Ml0oYTIsIGMyLCBuMiwgdDIpIHx8IFwiXCI7XG4gICAgcmV0dXJuIHMyO1xuICB9O1xufVxuZnVuY3Rpb24gbGUoZTIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHIyKSB7XG4gICAgaWYgKCFyMi5yb290KSB7XG4gICAgICBpZiAocjIgPSByMi5yZXR1cm4pXG4gICAgICAgIGUyKHIyKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiB2ZShjMiwgczIsIHUyLCBpMikge1xuICBpZiAoIWMyLnJldHVybilcbiAgICBzd2l0Y2ggKGMyLnR5cGUpIHtcbiAgICAgIGNhc2UgdDpcbiAgICAgICAgYzIucmV0dXJuID0gdWUoYzIudmFsdWUsIGMyLmxlbmd0aCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBwOlxuICAgICAgICByZXR1cm4gaWUoW0koeShjMi52YWx1ZSwgXCJAXCIsIFwiQFwiICsgYSksIGMyLCBcIlwiKV0sIGkyKTtcbiAgICAgIGNhc2UgbjpcbiAgICAgICAgaWYgKGMyLmxlbmd0aClcbiAgICAgICAgICByZXR1cm4gUyhjMi5wcm9wcywgZnVuY3Rpb24objIpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoeChuMiwgLyg6OnBsYWNcXHcrfDpyZWFkLVxcdyspLykpIHtcbiAgICAgICAgICAgICAgY2FzZSBcIjpyZWFkLW9ubHlcIjpcbiAgICAgICAgICAgICAgY2FzZSBcIjpyZWFkLXdyaXRlXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGllKFtJKHkobjIsIC86KHJlYWQtXFx3KykvLCBcIjpcIiArIHIgKyBcIiQxXCIpLCBjMiwgXCJcIildLCBpMik7XG4gICAgICAgICAgICAgIGNhc2UgXCI6OnBsYWNlaG9sZGVyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGllKFtJKHkobjIsIC86KHBsYWNcXHcrKS8sIFwiOlwiICsgYSArIFwiaW5wdXQtJDFcIiksIGMyLCBcIlwiKSwgSSh5KG4yLCAvOihwbGFjXFx3KykvLCBcIjpcIiArIHIgKyBcIiQxXCIpLCBjMiwgXCJcIiksIEkoeShuMiwgLzoocGxhY1xcdyspLywgZSArIFwiaW5wdXQtJDFcIiksIGMyLCBcIlwiKV0sIGkyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGhlKGUyKSB7XG4gIHN3aXRjaCAoZTIudHlwZSkge1xuICAgIGNhc2UgbjpcbiAgICAgIGUyLnByb3BzID0gZTIucHJvcHMubWFwKGZ1bmN0aW9uKHIyKSB7XG4gICAgICAgIHJldHVybiBTKFcocjIpLCBmdW5jdGlvbihyMywgYTIsIGMyKSB7XG4gICAgICAgICAgc3dpdGNoICh6KHIzLCAwKSkge1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgcmV0dXJuIEMocjMsIDEsIEEocjMpKTtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICBjYXNlIDQzOlxuICAgICAgICAgICAgY2FzZSA2MjpcbiAgICAgICAgICAgIGNhc2UgMTI2OlxuICAgICAgICAgICAgICByZXR1cm4gcjM7XG4gICAgICAgICAgICBjYXNlIDU4OlxuICAgICAgICAgICAgICBpZiAoYzJbKythMl0gPT09IFwiZ2xvYmFsXCIpXG4gICAgICAgICAgICAgICAgYzJbYTJdID0gXCJcIiwgYzJbKythMl0gPSBcIlxcZlwiICsgQyhjMlthMl0sIGEyID0gMSwgLTEpO1xuICAgICAgICAgICAgY2FzZSAzMjpcbiAgICAgICAgICAgICAgcmV0dXJuIGEyID09PSAxID8gXCJcIiA6IHIzO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgc3dpdGNoIChhMikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgIGUyID0gcjM7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gTShjMikgPiAxID8gXCJcIiA6IHIzO1xuICAgICAgICAgICAgICAgIGNhc2UgKGEyID0gTShjMikgLSAxKTpcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYTIgPT09IDIgPyByMyArIGUyICsgZTIgOiByMyArIGUyO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcjM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cbn1cbmV4cG9ydCB7ZiBhcyBDSEFSU0VULCBjIGFzIENPTU1FTlQsIHcgYXMgQ09VTlRFUl9TVFlMRSwgdCBhcyBERUNMQVJBVElPTiwgdiBhcyBET0NVTUVOVCwgYiBhcyBGT05UX0ZBQ0UsICQgYXMgRk9OVF9GRUFUVVJFX1ZBTFVFUywgaSBhcyBJTVBPUlQsIHAgYXMgS0VZRlJBTUVTLCB1IGFzIE1FRElBLCByIGFzIE1PWiwgZSBhcyBNUywgaCBhcyBOQU1FU1BBQ0UsIHMgYXMgUEFHRSwgbiBhcyBSVUxFU0VULCBsIGFzIFNVUFBPUlRTLCBvIGFzIFZJRVdQT1JULCBhIGFzIFdFQktJVCwgayBhcyBhYnMsIFQgYXMgYWxsb2MsIE8gYXMgYXBwZW5kLCBQIGFzIGNhcmV0LCBKIGFzIGNoYXIsIEYgYXMgY2hhcmFjdGVyLCBHIGFzIGNoYXJhY3RlcnMsIHogYXMgY2hhcmF0LCBCIGFzIGNvbHVtbiwgUyBhcyBjb21iaW5lLCB0ZSBhcyBjb21tZW50LCBlZSBhcyBjb21tZW50ZXIsIGFlIGFzIGNvbXBpbGUsIEkgYXMgY29weSwgVSBhcyBkZWFsbG9jLCBzZSBhcyBkZWNsYXJhdGlvbiwgViBhcyBkZWxpbWl0LCBfIGFzIGRlbGltaXRlciwgWiBhcyBlc2NhcGluZywgZCBhcyBmcm9tLCBtIGFzIGhhc2gsIHJlIGFzIGlkZW50aWZpZXIsIGogYXMgaW5kZXhvZiwgRCBhcyBsZW5ndGgsIHEgYXMgbGluZSwgeCBhcyBtYXRjaCwgb2UgYXMgbWlkZGxld2FyZSwgaGUgYXMgbmFtZXNwYWNlLCBMIGFzIG5leHQsIEggYXMgbm9kZSwgY2UgYXMgcGFyc2UsIE4gYXMgcGVlaywgRSBhcyBwb3NpdGlvbiwgdWUgYXMgcHJlZml4LCB2ZSBhcyBwcmVmaXhlciwgSyBhcyBwcmV2LCB5IGFzIHJlcGxhY2UsIG5lIGFzIHJ1bGVzZXQsIGxlIGFzIHJ1bGVzaGVldCwgaWUgYXMgc2VyaWFsaXplLCBNIGFzIHNpemVvZiwgUSBhcyBzbGljZSwgZmUgYXMgc3RyaW5naWZ5LCBBIGFzIHN0cmxlbiwgQyBhcyBzdWJzdHIsIFIgYXMgdG9rZW4sIFcgYXMgdG9rZW5pemUsIFkgYXMgdG9rZW5pemVyLCBnIGFzIHRyaW0sIFggYXMgd2hpdGVzcGFjZX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV3b2dJQ0oyWlhKemFXOXVJam9nTXl3S0lDQWljMjkxY21ObGN5STZJRnNpTDJodmJXVXZjblZ1Ym1WeUwzZHZjbXN2Ylc5dVpYa3ZiVzl1WlhrdmJtOWtaVjl0YjJSMWJHVnpMM04wZVd4cGN5OWthWE4wTDNOMGVXeHBjeTV0YW5NaVhTd0tJQ0FpYldGd2NHbHVaM01pT2lBaVFVRkJRU3hKUVVGSkxFbEJRVVU3UVVGQlR5eEpRVUZKTEVsQlFVVTdRVUZCVVN4SlFVRkpMRWxCUVVVN1FVRkJWeXhKUVVGSkxFbEJRVVU3UVVGQlR5eEpRVUZKTEVsQlFVVTdRVUZCVHl4SlFVRkpMRWxCUVVVN1FVRkJUeXhKUVVGSkxFbEJRVVU3UVVGQlVTeEpRVUZKTEVsQlFVVTdRVUZCVXl4SlFVRkpMRWxCUVVVN1FVRkJWU3hKUVVGSkxFbEJRVVU3UVVGQlZ5eEpRVUZKTEVsQlFVVTdRVUZCV1N4SlFVRkpMRWxCUVVVN1FVRkJXU3hKUVVGSkxFbEJRVVU3UVVGQldTeEpRVUZKTEVsQlFVVTdRVUZCWVN4SlFVRkpMRWxCUVVVN1FVRkJZU3hKUVVGSkxFbEJRVVU3UVVGQllTeEpRVUZKTEVsQlFVVTdRVUZCYVVJc1NVRkJTU3hKUVVGRk8wRkJRWFZDTEVsQlFVa3NTVUZCUlN4TFFVRkxPMEZCUVVrc1NVRkJTU3hKUVVGRkxFOUJRVTg3UVVGQllTeFhRVUZYTEVsQlFVVXNTVUZCUlR0QlFVRkRMRk5CUVZNc1UwRkJSeXhKUVVGRkxFVkJRVVVzU1VGQlJTeFBRVUZMTEVsQlFVVXNSVUZCUlN4SlFVRkZMRTlCUVVzc1NVRkJSU3hGUVVGRkxFbEJRVVVzVDBGQlN5eEpRVUZGTEVWQlFVVXNTVUZCUlR0QlFVRkJPMEZCUVVjc1YwRkJWeXhKUVVGRk8wRkJRVU1zVTBGQlR5eEhRVUZGTzBGQlFVRTdRVUZCVHl4WFFVRlhMRWxCUVVVc1NVRkJSVHRCUVVGRExGTkJRVThzVFVGQlJTeEhRVUZGTEV0QlFVc3NUMEZCU1N4SFFVRkZMRXRCUVVjN1FVRkJRVHRCUVVGRkxGZEJRVmNzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRlBMRWRCUVVVc1VVRkJVU3hKUVVGRk8wRkJRVUU3UVVGQlJ5eFhRVUZYTEVsQlFVVXNTVUZCUlR0QlFVRkRMRk5CUVU4c1IwRkJSU3hSUVVGUk8wRkJRVUU3UVVGQlJ5eFhRVUZYTEVsQlFVVXNTVUZCUlR0QlFVRkRMRk5CUVU4c1IwRkJSU3hYUVVGWExFMUJRVWM3UVVGQlFUdEJRVUZGTEZkQlFWY3NTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGUExFZEJRVVVzVFVGQlRTeEpRVUZGTzBGQlFVRTdRVUZCUnl4WFFVRlhMRWxCUVVVN1FVRkJReXhUUVVGUExFZEJRVVU3UVVGQlFUdEJRVUZQTEZkQlFWY3NTVUZCUlR0QlFVRkRMRk5CUVU4c1IwRkJSVHRCUVVGQk8wRkJRVThzVjBGQlZ5eEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRlBMRWRCUVVVc1MwRkJTeXhMUVVGSE8wRkJRVUU3UVVGQlJTeFhRVUZYTEVsQlFVVXNTVUZCUlR0QlFVRkRMRk5CUVU4c1IwRkJSU3hKUVVGSkxFbEJRVWNzUzBGQlN6dEJRVUZCTzBGQlFVa3NTVUZCU1N4SlFVRkZPMEZCUVVVc1NVRkJTU3hKUVVGRk8wRkJRVVVzU1VGQlNTeEpRVUZGTzBGQlFVVXNTVUZCU1N4SlFVRkZPMEZCUVVVc1NVRkJTU3hKUVVGRk8wRkJRVVVzU1VGQlNTeEpRVUZGTzBGQlFVY3NWMEZCVnl4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTzBGQlFVTXNVMEZCVFN4RFFVRkRMRTlCUVUwc1NVRkJSU3hOUVVGTExFbEJRVVVzVVVGQlR5eEpRVUZGTEUxQlFVc3NTVUZCUlN4UFFVRk5MRWxCUVVVc1ZVRkJVeXhKUVVGRkxFMUJRVXNzUjBGQlJTeFJRVUZQTEVkQlFVVXNVVUZCVHl4SlFVRkZMRkZCUVU4N1FVRkJRVHRCUVVGSkxGZEJRVmNzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRlBMRVZCUVVVc1NVRkJSU3hIUVVGRkxFMUJRVXNzUjBGQlJTeFJRVUZQTEVsQlFVVXNSMEZCUlN4UFFVRk5MRWRCUVVVc1ZVRkJVenRCUVVGQk8wRkJRVWNzWVVGQldUdEJRVUZETEZOQlFVODdRVUZCUVR0QlFVRkZMR0ZCUVZrN1FVRkJReXhOUVVGRkxFbEJRVVVzU1VGQlJTeEZRVUZGTEVkQlFVVXNSVUZCUlN4TFFVRkhPMEZCUVVVc1RVRkJSeXhMUVVGSkxFMUJRVWs3UVVGQlJ5eFJRVUZGTEVkQlFVVTdRVUZCU1N4VFFVRlBPMEZCUVVFN1FVRkJSU3hoUVVGWk8wRkJRVU1zVFVGQlJTeEpRVUZGTEVsQlFVVXNSVUZCUlN4SFFVRkZMRTlCUVVzN1FVRkJSU3hOUVVGSExFdEJRVWtzVFVGQlNUdEJRVUZITEZGQlFVVXNSMEZCUlR0QlFVRkpMRk5CUVU4N1FVRkJRVHRCUVVGRkxHRkJRVms3UVVGQlF5eFRRVUZQTEVWQlFVVXNSMEZCUlR0QlFVRkJPMEZCUVVjc1lVRkJXVHRCUVVGRExGTkJRVTg3UVVGQlFUdEJRVUZGTEZkQlFWY3NTVUZCUlN4SlFVRkZPMEZCUVVNc1UwRkJUeXhGUVVGRkxFZEJRVVVzU1VGQlJUdEJRVUZCTzBGQlFVY3NWMEZCVnl4SlFVRkZPMEZCUVVNc1ZVRkJUenRCUVVGQkxGTkJRVkU3UVVGQlFTeFRRVUZQTzBGQlFVRXNVMEZCVHp0QlFVRkJMRk5CUVZFN1FVRkJRU3hUUVVGUk8wRkJRVWNzWVVGQlR6dEJRVUZCTEZOQlFVODdRVUZCUVN4VFFVRlJPMEZCUVVFc1UwRkJVVHRCUVVGQkxGTkJRVkU3UVVGQlFTeFRRVUZSTzBGQlFVRXNVMEZCVVR0QlFVRkJMRk5CUVZFN1FVRkJRU3hUUVVGVE8wRkJRVUVzVTBGQlVUdEJRVUZCTEZOQlFWTTdRVUZCU1N4aFFVRlBPMEZCUVVFc1UwRkJUenRCUVVGSExHRkJRVTg3UVVGQlFTeFRRVUZQTzBGQlFVRXNVMEZCVVR0QlFVRkJMRk5CUVZFN1FVRkJRU3hUUVVGUk8wRkJRVWNzWVVGQlR6dEJRVUZCTEZOQlFVODdRVUZCUVN4VFFVRlJPMEZCUVVjc1lVRkJUenRCUVVGQk8wRkJRVVVzVTBGQlR6dEJRVUZCTzBGQlFVVXNWMEZCVnl4SlFVRkZPMEZCUVVNc1UwRkJUeXhKUVVGRkxFbEJRVVVzUjBGQlJTeEpRVUZGTEVWQlFVVXNTVUZCUlN4TFFVRkhMRWxCUVVVc1IwRkJSVHRCUVVGQk8wRkJRVWNzVjBGQlZ5eEpRVUZGTzBGQlFVTXNVMEZCVHl4SlFVRkZMRWxCUVVjN1FVRkJRVHRCUVVGRkxGZEJRVmNzU1VGQlJUdEJRVUZETEZOQlFVOHNSVUZCUlN4RlFVRkZMRWxCUVVVc1IwRkJSU3hGUVVGRkxFOUJRVWtzUzBGQlJ5eExRVUZGTEVsQlFVVXNUMEZCU1N4TFFVRkhMRXRCUVVVc1NVRkJSVHRCUVVGQk8wRkJRVXNzVjBGQlZ5eEpRVUZGTzBGQlFVTXNVMEZCVHl4RlFVRkZMRVZCUVVVc1JVRkJSVHRCUVVGQk8wRkJRVXNzVjBGQlZ5eEpRVUZGTzBGQlFVTXNVMEZCVFN4SlFVRkZPMEZCUVVrc1VVRkJSeXhKUVVGRk8wRkJRVWM3UVVGQlFUdEJRVUZUTzBGQlFVMHNVMEZCVHl4RlFVRkZMRTFCUVVjc1MwRkJSeXhGUVVGRkxFdEJRVWNzU1VGQlJTeExRVUZITzBGQlFVRTdRVUZCU1N4WFFVRlhMRWxCUVVVN1FVRkJReXhUUVVGTk8wRkJRVWtzV1VGQlR5eEZRVUZGTzBGQlFVRXNWMEZCVXp0QlFVRkZMRlZCUVVVc1IwRkJSeXhKUVVGRkxFbEJRVWM3UVVGQlJ6dEJRVUZCTEZkQlFWYzdRVUZCUlN4VlFVRkZMRVZCUVVVc1NVRkJSenRCUVVGSE8wRkJRVUU3UVVGQll5eFZRVUZGTEVWQlFVVXNTVUZCUnp0QlFVRkJPMEZCUVVjc1UwRkJUenRCUVVGQk8wRkJRVVVzVjBGQlZ5eEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRk5MRVZCUVVVc1RVRkJSenRCUVVGSkxGRkJRVWNzU1VGQlJTeE5RVUZKTEVsQlFVVXNUMEZCU3l4SlFVRkZMRTFCUVVrc1NVRkJSU3hOUVVGSkxFbEJRVVVzVFVGQlNTeEpRVUZGTzBGQlFVYzdRVUZCVFN4VFFVRlBMRVZCUVVVc1NVRkJSU3hOUVVGTExFMUJRVVVzUzBGQlJ5eFBRVUZMTEUxQlFVa3NUMEZCU3p0QlFVRkJPMEZCUVVzc1YwRkJWeXhKUVVGRk8wRkJRVU1zVTBGQlRUdEJRVUZKTEZsQlFVODdRVUZCUVN4WFFVRlJPMEZCUVVVc1pVRkJUenRCUVVGQkxGZEJRVTg3UVVGQlFTeFhRVUZSTzBGQlFVY3NaVUZCVHl4RlFVRkZMRTlCUVVrc1RVRkJTU3hQUVVGSkxFdEJRVWNzUzBGQlJUdEJRVUZCTEZkQlFWRTdRVUZCUnl4WlFVRkhMRTlCUVVrN1FVRkJSeXhaUVVGRk8wRkJRVWM3UVVGQlFTeFhRVUZYTzBGQlFVYzdRVUZCU1R0QlFVRkJPMEZCUVUwc1UwRkJUenRCUVVGQk8wRkJRVVVzV1VGQldTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRk5PMEZCUVVrc1VVRkJSeXhMUVVGRkxFMUJRVWtzUzBGQlJ6dEJRVUZITzBGQlFVRXNZVUZCWXl4TFFVRkZMRTFCUVVrc1MwRkJSeXhOUVVGSkxGRkJRVTA3UVVGQlJ6dEJRVUZOTEZOQlFVMHNUMEZCU3l4RlFVRkZMRWxCUVVVc1NVRkJSU3hMUVVGSExFMUJRVWtzUlVGQlJTeFBRVUZKTEV0QlFVY3NTMEZCUlR0QlFVRkJPMEZCUVVzc1dVRkJXU3hKUVVGRk8wRkJRVU1zVTBGQlRTeERRVUZETEVWQlFVVTdRVUZCU3p0QlFVRkpMRk5CUVU4c1JVRkJSU3hKUVVGRk8wRkJRVUU3UVVGQlJ5eFpRVUZaTEVsQlFVVTdRVUZCUXl4VFFVRlBMRVZCUVVVc1IwRkJSeXhKUVVGSExFMUJRVXNzVFVGQlN5eE5RVUZMTEVOQlFVTXNTMEZCU1N4TFFVRkZMRVZCUVVVc1MwRkJSeXhIUVVGRkxFTkJRVU1zU1VGQlJ6dEJRVUZCTzBGQlFVa3NXVUZCV1N4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlR0QlFVRkRMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZITEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRk5CUVUwN1FVRkJSU3haUVVGUExFdEJRVVVzU1VGQlJTeExRVUZGTzBGQlFVRXNWMEZCVlR0QlFVRkJMRmRCUVZFN1FVRkJRU3hYUVVGUk8wRkJRVUVzVjBGQlVUdEJRVUZITEdOQlFVY3NSVUZCUlR0QlFVRkhPMEZCUVVFc1YwRkJWenRCUVVGQkxGZEJRVTg3UVVGQlFTeFhRVUZSTzBGQlFVRXNWMEZCVVR0QlFVRkhMR05CUVVjc1JVRkJSVHRCUVVGSE8wRkJRVUVzVjBGQlZ6dEJRVUZITEdOQlFVY3NSVUZCUlN4TlFVRkpMRWRCUVVVN1FVRkJSenRCUVVGQkxGZEJRV003UVVGQlJ5eG5Ra0ZCVHp0QlFVRkJMR1ZCUVZVN1FVRkJRU3hsUVVGUk8wRkJRVWNzWTBGQlJTeEhRVUZITEVkQlFVY3NTMEZCU1N4TlFVRkxMRWxCUVVVc1MwRkJSenRCUVVGSE8wRkJRVUU3UVVGQll5eHJRa0ZCUnp0QlFVRkJPMEZCUVVrN1FVRkJRU3hYUVVGWExFMUJRVWs3UVVGQlJTeFhRVUZGTEZGQlFVc3NSVUZCUlN4TlFVRkhPMEZCUVVFc1YwRkJUeXhOUVVGSk8wRkJRVUVzVjBGQlR6dEJRVUZCTEZkQlFWRTdRVUZCUlN4blFrRkJUenRCUVVGQkxHVkJRVkU3UVVGQlFTeGxRVUZQTzBGQlFVa3NhVUpCUVVVN1FVRkJRU3hsUVVGUExFdEJRVWM3UVVGQlJTeG5Ra0ZCUnl4TFFVRkZMRXRCUVVjc1JVRkJSU3hOUVVGSE8wRkJRVVVzWjBKQlFVVXNTMEZCUlN4TFFVRkhMRWRCUVVjc1MwRkJSU3hMUVVGSkxFbEJRVVVzU1VGQlJTeExRVUZGTEV0QlFVY3NSMEZCUnl4RlFVRkZMRWxCUVVVc1MwRkJTU3hOUVVGSkxFdEJRVWtzU1VGQlJTeEpRVUZGTEV0QlFVVXNTVUZCUnp0QlFVRkhPMEZCUVVFc1pVRkJWenRCUVVGSExHdENRVUZITzBGQlFVRTdRVUZCV1N4alFVRkZMRXRCUVVVc1IwRkJSeXhKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1MwRkJSU3hKUVVGSExFdEJRVVVzU1VGQlJ5eExRVUZITzBGQlFVY3NaMEpCUVVjc1QwRkJTVHRCUVVGSkxHdENRVUZITEU5QlFVazdRVUZCUlN4dFFrRkJSeXhKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJRVHRCUVVGUkxIZENRVUZQTzBGQlFVRXNkVUpCUVZFN1FVRkJRU3gxUWtGQlV6dEJRVUZCTEhWQ1FVRlRPMEZCUVVrc2RVSkJRVWNzU1VGQlJTeEpRVUZGTEVsQlFVVXNUVUZCUnl4RlFVRkZMRWRCUVVjc1NVRkJSU3hKUVVGRkxFbEJRVVVzUjBGQlJTeEhRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1MwRkJSU3hKUVVGSExFdEJRVWNzUzBGQlJ5eEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRXRCUVVVc1MwRkJSVHRCUVVGSE8wRkJRVUU3UVVGQll5eDFRa0ZCUnl4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFTkJRVU1zUzBGQlNTeEpRVUZGTEVsQlFVVXNTVUZCUlR0QlFVRkJPMEZCUVVFN1FVRkJTU3hoUVVGRkxFdEJRVVVzUzBGQlJTeEhRVUZGTEV0QlFVVXNTMEZCUlN4SFFVRkZMRXRCUVVVc1MwRkJSU3hKUVVGSExFdEJRVVU3UVVGQlJUdEJRVUZCTEZkQlFWYzdRVUZCUnl4aFFVRkZMRWxCUVVVc1JVRkJSU3hMUVVGSExFdEJRVVU3UVVGQlFUdEJRVUZWTEZsQlFVY3NTMEZCUlR0QlFVRkZMR05CUVVjc1RVRkJSenRCUVVGSkxHTkJRVVU3UVVGQlFTeHRRa0ZCVlN4TlFVRkhMRTlCUVVzc1VVRkJTeXhMUVVGSExFOUJRVXM3UVVGQlNUdEJRVUZCTzBGQlFWTXNaMEpCUVU4c1RVRkJSeXhGUVVGRkxFdEJRVWNzUzBGQlJUdEJRVUZCTEdWQlFWRTdRVUZCUnl4cFFrRkJSU3hMUVVGRkxFbEJRVVVzU1VGQlJ5eFBRVUZITEUxQlFVczdRVUZCU1R0QlFVRkJMR1ZCUVZjN1FVRkJSeXhsUVVGRkxGRkJRVTBzUjBGQlJTeE5RVUZITEV0QlFVY3NTVUZCUlN4TFFVRkZPMEZCUVVVN1FVRkJRU3hsUVVGWE8wRkJRVWNzWjBKQlFVY3NVVUZCVFR0QlFVRkhMRzlDUVVGSExFVkJRVVU3UVVGQlN5eHBRa0ZCUlN4TFFVRkpMRXRCUVVVc1JVRkJSU3hMUVVGRkxFMUJRVWNzUjBGQlJ5eFBRVUZOTzBGQlFVazdRVUZCUVN4bFFVRlhPMEZCUVVjc1owSkJRVWNzVDBGQlNTeE5RVUZKTEVWQlFVVXNUMEZCU1R0QlFVRkZMRzFDUVVGRk8wRkJRVUU3UVVGQlFUdEJRVUZITEZOQlFVODdRVUZCUVR0QlFVRkZMRmxCUVZrc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRk8wRkJRVU1zVFVGQlNTeExRVUZGTEV0QlFVVTdRVUZCUlN4TlFVRkpMRXRCUVVVc1QwRkJTU3hKUVVGRkxFdEJRVVVzUTBGQlF6dEJRVUZKTEUxQlFVa3NTMEZCUlN4RlFVRkZPMEZCUVVjc1YwRkJVU3hMUVVGRkxFZEJRVVVzUzBGQlJTeEhRVUZGTEV0QlFVVXNSMEZCUlN4TFFVRkZMRWxCUVVVc1JVRkJSVHRCUVVGRkxHRkJRVkVzUzBGQlJTeEhRVUZGTEV0QlFVVXNSVUZCUlN4SlFVRkZMRXRCUVVVc1IwRkJSU3hMUVVGRkxFVkJRVVVzUzBGQlJTeEhRVUZGTEU5QlFVc3NTMEZCUlN4SlFVRkZMRXRCUVVVc1NVRkJSU3hGUVVGRk8wRkJRVVVzVlVGQlJ5eExRVUZGTEVWQlFVVXNTMEZCUlN4SlFVRkZMRWRCUVVVc1RVRkJSeXhOUVVGSkxFdEJRVVVzUlVGQlJTeEpRVUZGTEZGQlFVOHNSMEZCUlR0QlFVRkxMRmRCUVVVc1VVRkJTenRCUVVGRkxGTkJRVThzUlVGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4UFFVRkpMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJUdEJRVUZCTzBGQlFVY3NXVUZCV1N4SlFVRkZMRWxCUVVVc1NVRkJSVHRCUVVGRExGTkJRVThzUlVGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SFFVRkZMRVZCUVVVc1RVRkJTeXhGUVVGRkxFbEJRVVVzUjBGQlJTeExRVUZKTzBGQlFVRTdRVUZCUnl4WlFVRlpMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZQTEVWQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1IwRkJSU3hGUVVGRkxFbEJRVVVzUjBGQlJTeExRVUZITEVWQlFVVXNTVUZCUlN4TFFVRkZMRWRCUVVVc1MwRkJTVHRCUVVGQk8wRkJRVWNzV1VGQldTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VlFVRlBMRVZCUVVVc1NVRkJSVHRCUVVGQkxGTkJRVk03UVVGQlN5eGhRVUZQTEVsQlFVVXNWMEZCVXl4TFFVRkZPMEZCUVVFc1UwRkJUenRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZMTEdGQlFVOHNTVUZCUlN4TFFVRkZPMEZCUVVFc1UwRkJUenRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJTeXhoUVVGUExFbEJRVVVzUzBGQlJTeEpRVUZGTEV0QlFVVXNTVUZCUlN4TFFVRkZPMEZCUVVFc1UwRkJUenRCUVVGQkxGTkJRVlU3UVVGQlN5eGhRVUZQTEVsQlFVVXNTMEZCUlN4SlFVRkZMRXRCUVVVN1FVRkJRU3hUUVVGUE8wRkJRVXNzWVVGQlR5eEpRVUZGTEV0QlFVVXNTVUZCUlN4VlFVRlJMRXRCUVVVN1FVRkJRU3hUUVVGUE8wRkJRVXNzWVVGQlR5eEpRVUZGTEV0QlFVVXNSVUZCUlN4SlFVRkZMR3RDUVVGcFFpeEpRVUZGTEdGQlFWY3NTVUZCUlN4bFFVRmhPMEZCUVVFc1UwRkJUenRCUVVGTExHRkJRVThzU1VGQlJTeExRVUZGTEVsQlFVVXNaVUZCWVN4RlFVRkZMRWxCUVVVc1pVRkJZeXhOUVVGSk8wRkJRVUVzVTBGQlR6dEJRVUZMTEdGQlFVOHNTVUZCUlN4TFFVRkZMRWxCUVVVc2JVSkJRV2xDTEVWQlFVVXNTVUZCUlN3MlFrRkJORUlzVFVGQlNUdEJRVUZCTEZOQlFVODdRVUZCU3l4aFFVRlBMRWxCUVVVc1MwRkJSU3hKUVVGRkxFVkJRVVVzU1VGQlJTeFZRVUZUTEdOQlFWazdRVUZCUVN4VFFVRlBPMEZCUVVzc1lVRkJUeXhKUVVGRkxFdEJRVVVzU1VGQlJTeEZRVUZGTEVsQlFVVXNVMEZCVVN4dlFrRkJhMEk3UVVGQlFTeFRRVUZQTzBGQlFVc3NZVUZCVHl4SlFVRkZMRk5CUVU4c1JVRkJSU3hKUVVGRkxGTkJRVkVzVFVGQlNTeEpRVUZGTEV0QlFVVXNTVUZCUlN4RlFVRkZMRWxCUVVVc1VVRkJUeXhqUVVGWk8wRkJRVUVzVTBGQlR6dEJRVUZMTEdGQlFVOHNTVUZCUlN4RlFVRkZMRWxCUVVVc2MwSkJRWEZDTEU5QlFVc3NTVUZCUlN4UlFVRk5PMEZCUVVFc1UwRkJUenRCUVVGTExHRkJRVThzUlVGQlJTeEZRVUZGTEVWQlFVVXNTVUZCUlN4blFrRkJaU3hKUVVGRkxFOUJRVTBzWlVGQll5eEpRVUZGTEU5QlFVMHNTVUZCUlN4TlFVRkpPMEZCUVVFc1UwRkJUenRCUVVGQkxGTkJRVlU3UVVGQlN5eGhRVUZQTEVWQlFVVXNTVUZCUlN4eFFrRkJiMElzU1VGQlJUdEJRVUZCTEZOQlFXdENPMEZCUVVzc1lVRkJUeXhGUVVGRkxFVkJRVVVzU1VGQlJTeHhRa0ZCYjBJc1NVRkJSU3huUWtGQll5eEpRVUZGTEdsQ1FVRm5RaXhqUVVGaExHRkJRVmNzU1VGQlJTeExRVUZGTzBGQlFVRXNVMEZCVHp0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZMTEdGQlFVOHNSVUZCUlN4SlFVRkZMRzFDUVVGclFpeEpRVUZGTEZWQlFWRTdRVUZCUVN4VFFVRlBPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlN5eFZRVUZITEVWQlFVVXNUVUZCUnl4SlFVRkZMRXRCUVVVN1FVRkJSU3huUWtGQlR5eEZRVUZGTEVsQlFVVXNTMEZCUlR0QlFVRkJMR1ZCUVZNN1FVRkJTU3huUWtGQlJ5eEZRVUZGTEVsQlFVVXNTMEZCUlN4UFFVRkxPMEZCUVVjN1FVRkJRU3hsUVVGWE8wRkJRVWtzYlVKQlFVOHNSVUZCUlN4SlFVRkZMRzlDUVVGdFFpeFBRVUZMTEVsQlFVVXNXVUZCWVN4SlFVRkhMRWRCUVVVc1NVRkJSU3hMUVVGRkxFMUJRVWtzVFVGQlNTeFBRVUZMTEZsQlFWVTdRVUZCUVN4bFFVRlBPMEZCUVVrc2JVSkJRVTBzUTBGQlF5eEZRVUZGTEVsQlFVVXNZVUZCVnl4SFFVRkhMRVZCUVVVc1NVRkJSU3hYUVVGVkxHMUNRVUZyUWl4TlFVRkhMRXRCUVVVN1FVRkJRVHRCUVVGRk8wRkJRVUVzVTBGQlZ6dEJRVUZMTEZWQlFVY3NSVUZCUlN4SlFVRkZMRXRCUVVVc1QwRkJTenRCUVVGSk8wRkJRVUVzVTBGQlZ6dEJRVUZMTEdOQlFVOHNSVUZCUlN4SlFVRkZMRVZCUVVVc1RVRkJSeXhKUVVGSExFVkJRVU1zUlVGQlJTeEpRVUZGTEdsQ1FVRmxPMEZCUVVFc1lVRkJWenRCUVVGSkxHbENRVUZQTEVWQlFVVXNTVUZCUlN4TFFVRkpMRTFCUVVrc1MwRkJSenRCUVVGQkxHRkJRVTg3UVVGQlNTeHBRa0ZCVHl4RlFVRkZMRWxCUVVVc2VVSkJRWGRDTEU5QlFVc3NTVUZCUnl4SFFVRkZMRWxCUVVVc1VVRkJUU3hMUVVGSExGbEJRVlVzVFVGQlNTeFpRVUZoTEVsQlFVVXNWMEZCV1N4SlFVRkZMR0ZCUVZjN1FVRkJRVHRCUVVGRk8wRkJRVUVzVTBGQlZ6dEJRVUZMTEdOQlFVOHNSVUZCUlN4SlFVRkZMRXRCUVVVN1FVRkJRU3hoUVVGVk8wRkJRVWtzYVVKQlFVOHNTVUZCUlN4TFFVRkZMRWxCUVVVc1JVRkJSU3hKUVVGRkxITkNRVUZ4UWl4UlFVRk5PMEZCUVVFc1lVRkJUenRCUVVGSkxHbENRVUZQTEVsQlFVVXNTMEZCUlN4SlFVRkZMRVZCUVVVc1NVRkJSU3h6UWtGQmNVSXNWMEZCVXp0QlFVRkJMR0ZCUVU4N1FVRkJSeXhwUWtGQlR5eEpRVUZGTEV0QlFVVXNTVUZCUlN4RlFVRkZMRWxCUVVVc2MwSkJRWEZDTEZGQlFVMDdRVUZCUVR0QlFVRkZMR0ZCUVU4c1NVRkJSU3hMUVVGRkxFbEJRVVVzUzBGQlJUdEJRVUZCTzBGQlFVVXNVMEZCVHp0QlFVRkJPMEZCUVVVc1dVRkJXU3hKUVVGRkxFbEJRVVU3UVVGQlF5eE5RVUZKTEV0QlFVVTdRVUZCUnl4TlFVRkpMRXRCUVVVc1JVRkJSVHRCUVVGSExGZEJRVkVzUzBGQlJTeEhRVUZGTEV0QlFVVXNTVUZCUlR0QlFVRkpMRlZCUVVjc1IwRkJSU3hIUVVGRkxFdEJRVWNzU1VGQlJTeEpRVUZGTEU5QlFVazdRVUZCUnl4VFFVRlBPMEZCUVVFN1FVRkJSU3haUVVGWkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VlFVRlBMRWRCUVVVN1FVRkJRU3hUUVVGWE8wRkJRVUVzVTBGQlR6dEJRVUZGTEdGQlFVOHNSMEZCUlN4VFFVRlBMRWRCUVVVc1ZVRkJVU3hIUVVGRk8wRkJRVUVzVTBGQlZ6dEJRVUZGTEdGQlFVMDdRVUZCUVN4VFFVRlJPMEZCUVVVc1UwRkJSU3hSUVVGTkxFZEJRVVVzVFVGQlRTeExRVUZMTzBGQlFVRTdRVUZCU3l4VFFVRlBMRVZCUVVVc1MwRkJSU3hIUVVGSExFZEJRVVVzVlVGQlV5eFBRVUZKTEVkQlFVVXNVMEZCVHl4SFFVRkZMRkZCUVUwc1RVRkJTU3hMUVVGRkxFMUJRVWs3UVVGQlFUdEJRVUZITEZsQlFWa3NTVUZCUlR0QlFVRkRMRTFCUVVrc1MwRkJSU3hGUVVGRk8wRkJRVWNzVTBGQlR5eFRRVUZUTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJReXhSUVVGSkxFdEJRVVU3UVVGQlJ5eGhRVUZSTEV0QlFVVXNSMEZCUlN4TFFVRkZMRWxCUVVVN1FVRkJTU3haUVVGSExFZEJRVVVzU1VGQlJ5eEpRVUZGTEVsQlFVVXNTVUZCUlN4UFFVRkpPMEZCUVVjc1YwRkJUenRCUVVGQk8wRkJRVUU3UVVGQlJ5eFpRVUZaTEVsQlFVVTdRVUZCUXl4VFFVRlBMRk5CUVZNc1NVRkJSVHRCUVVGRExGRkJRVWNzUTBGQlF5eEhRVUZGTzBGQlFVc3NWVUZCUnl4TFFVRkZMRWRCUVVVN1FVRkJUeXhYUVVGRk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVa3NXVUZCV1N4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRk8wRkJRVU1zVFVGQlJ5eERRVUZETEVkQlFVVTdRVUZCVHl4WlFVRlBMRWRCUVVVN1FVRkJRU3hYUVVGWE8wRkJRVVVzVjBGQlJTeFRRVUZQTEVkQlFVY3NSMEZCUlN4UFFVRk5MRWRCUVVVN1FVRkJVVHRCUVVGQkxGZEJRVmM3UVVGQlJTeGxRVUZQTEVkQlFVY3NRMEZCUXl4RlFVRkZMRVZCUVVVc1IwRkJSU3hQUVVGTkxFdEJRVWtzVFVGQlNTeEpRVUZITEVsQlFVVXNUVUZCU3p0QlFVRkJMRmRCUVZFN1FVRkJSU3haUVVGSExFZEJRVVU3UVVGQlR5eHBRa0ZCVHl4RlFVRkZMRWRCUVVVc1QwRkJUeXhUUVVGVExFbEJRVVU3UVVGQlF5eHZRa0ZCVHl4RlFVRkZMRWxCUVVVN1FVRkJRU3h0UWtGQk9FSTdRVUZCUVN4dFFrRkJhVUk3UVVGQll5eDFRa0ZCVHl4SFFVRkhMRU5CUVVNc1JVRkJSU3hGUVVGRkxFbEJRVVVzWlVGQll5eE5RVUZKTEVsQlFVVXNUMEZCVFN4SlFVRkZMRTFCUVVzN1FVRkJRU3h0UWtGQlR6dEJRVUZuUWl4MVFrRkJUeXhIUVVGSExFTkJRVU1zUlVGQlJTeEZRVUZGTEVsQlFVVXNZMEZCWVN4TlFVRkpMRWxCUVVVc1lVRkJXU3hKUVVGRkxFdEJRVWtzUlVGQlJTeEZRVUZGTEVsQlFVVXNZMEZCWVN4TlFVRkpMRWxCUVVVc1QwRkJUU3hKUVVGRkxFdEJRVWtzUlVGQlJTeEZRVUZGTEVsQlFVVXNZMEZCWVN4SlFVRkZMR0ZCUVZrc1NVRkJSU3hOUVVGTE8wRkJRVUU3UVVGQlJ5eHRRa0ZCVFR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGUExGbEJRVmtzU1VGQlJUdEJRVUZETEZWQlFVOHNSMEZCUlR0QlFVRkJMRk5CUVZjN1FVRkJSU3hUUVVGRkxGRkJRVTBzUjBGQlJTeE5RVUZOTEVsQlFVc3NVMEZCVXl4SlFVRkZPMEZCUVVNc1pVRkJUeXhGUVVGRkxFVkJRVVVzUzBGQlNTeFRRVUZUTEVsQlFVVXNTVUZCUlN4SlFVRkZPMEZCUVVNc2EwSkJRVThzUlVGQlJTeEpRVUZGTzBGQlFVRXNhVUpCUVZNN1FVRkJSeXh4UWtGQlR5eEZRVUZGTEVsQlFVVXNSMEZCUlN4RlFVRkZPMEZCUVVFc2FVSkJRVk03UVVGQlFTeHBRa0ZCVHp0QlFVRkJMR2xDUVVGUk8wRkJRVUVzYVVKQlFWRTdRVUZCUVN4cFFrRkJVVHRCUVVGSkxIRkNRVUZQTzBGQlFVRXNhVUpCUVU4N1FVRkJSeXhyUWtGQlJ5eEhRVUZGTEVWQlFVVXNVVUZCU3p0QlFVRlRMRzFDUVVGRkxFMUJRVWNzU1VGQlJ5eEhRVUZGTEVWQlFVVXNUVUZCUnl4UFFVRkxMRVZCUVVVc1IwRkJSU3hMUVVGSExFdEJRVVVzUjBGQlJUdEJRVUZCTEdsQ1FVRlRPMEZCUVVjc2NVSkJRVThzVDBGQlNTeEpRVUZGTEV0QlFVYzdRVUZCUVR0QlFVRlZMSE5DUVVGUE8wRkJRVUVzY1VKQlFWRTdRVUZCUlN4MVFrRkJSVHRCUVVGRkxIbENRVUZQTEVWQlFVVXNUVUZCUnl4SlFVRkZMRXRCUVVjN1FVRkJRU3h4UWtGQlR5eE5RVUZGTEVWQlFVVXNUVUZCUnp0QlFVRkJMSEZDUVVGUE8wRkJRVVVzZVVKQlFVOHNUMEZCU1N4SlFVRkZMRXRCUVVVc1MwRkJSU3hMUVVGRkxFdEJRVVU3UVVGQlFUdEJRVUZWTEhsQ1FVRlBPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFWYzdJaXdLSUNBaWJtRnRaWE1pT2lCYlhRcDlDZz09XG4iLCJ2YXIgd2Vha01lbW9pemUgPSBmdW5jdGlvbiB3ZWFrTWVtb2l6ZShmdW5jKSB7XG4gIC8vICRGbG93Rml4TWUgZmxvdyBkb2Vzbid0IGluY2x1ZGUgYWxsIG5vbi1wcmltaXRpdmUgdHlwZXMgYXMgYWxsb3dlZCBmb3Igd2Vha21hcHNcbiAgdmFyIGNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcbiAgICBpZiAoY2FjaGUuaGFzKGFyZykpIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHJldHVybiBjYWNoZS5nZXQoYXJnKTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gZnVuYyhhcmcpO1xuICAgIGNhY2hlLnNldChhcmcsIHJldCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdlYWtNZW1vaXplO1xuIiwiZnVuY3Rpb24gbWVtb2l6ZShmbikge1xuICB2YXIgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgIGlmIChjYWNoZVthcmddID09PSB1bmRlZmluZWQpIGNhY2hlW2FyZ10gPSBmbihhcmcpO1xuICAgIHJldHVybiBjYWNoZVthcmddO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vaXplO1xuIiwiaW1wb3J0IHsgU3R5bGVTaGVldCB9IGZyb20gJ0BlbW90aW9uL3NoZWV0JztcbmltcG9ydCB7IGRlYWxsb2MsIGFsbG9jLCBuZXh0LCB0b2tlbiwgZnJvbSwgcGVlaywgZGVsaW1pdCwgaWRlbnRpZmllciwgcG9zaXRpb24sIHN0cmluZ2lmeSwgQ09NTUVOVCwgcnVsZXNoZWV0LCBtaWRkbGV3YXJlLCBwcmVmaXhlciwgc2VyaWFsaXplLCBjb21waWxlIH0gZnJvbSAnc3R5bGlzJztcbmltcG9ydCAnQGVtb3Rpb24vd2Vhay1tZW1vaXplJztcbmltcG9ydCAnQGVtb3Rpb24vbWVtb2l6ZSc7XG5cbnZhciBsYXN0ID0gZnVuY3Rpb24gbGFzdChhcnIpIHtcbiAgcmV0dXJuIGFyci5sZW5ndGggPyBhcnJbYXJyLmxlbmd0aCAtIDFdIDogbnVsbDtcbn07XG5cbnZhciB0b1J1bGVzID0gZnVuY3Rpb24gdG9SdWxlcyhwYXJzZWQsIHBvaW50cykge1xuICAvLyBwcmV0ZW5kIHdlJ3ZlIHN0YXJ0ZWQgd2l0aCBhIGNvbW1hXG4gIHZhciBpbmRleCA9IC0xO1xuICB2YXIgY2hhcmFjdGVyID0gNDQ7XG5cbiAgZG8ge1xuICAgIHN3aXRjaCAodG9rZW4oY2hhcmFjdGVyKSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICAvLyAmXFxmXG4gICAgICAgIGlmIChjaGFyYWN0ZXIgPT09IDM4ICYmIHBlZWsoKSA9PT0gMTIpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIG5vdCAxMDAlIGNvcnJlY3QsIHdlIGRvbid0IGFjY291bnQgZm9yIGxpdGVyYWwgc2VxdWVuY2VzIGhlcmUgLSBsaWtlIGZvciBleGFtcGxlIHF1b3RlZCBzdHJpbmdzXG4gICAgICAgICAgLy8gc3R5bGlzIGluc2VydHMgXFxmIGFmdGVyICYgdG8ga25vdyB3aGVuICYgd2hlcmUgaXQgc2hvdWxkIHJlcGxhY2UgdGhpcyBzZXF1ZW5jZSB3aXRoIHRoZSBjb250ZXh0IHNlbGVjdG9yXG4gICAgICAgICAgLy8gYW5kIHdoZW4gaXQgc2hvdWxkIGp1c3QgY29uY2F0ZW5hdGUgdGhlIG91dGVyIGFuZCBpbm5lciBzZWxlY3RvcnNcbiAgICAgICAgICAvLyBpdCdzIHZlcnkgdW5saWtlbHkgZm9yIHRoaXMgc2VxdWVuY2UgdG8gYWN0dWFsbHkgYXBwZWFyIGluIGEgZGlmZmVyZW50IGNvbnRleHQsIHNvIHdlIGp1c3QgbGV2ZXJhZ2UgdGhpcyBmYWN0IGhlcmVcbiAgICAgICAgICBwb2ludHNbaW5kZXhdID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlZFtpbmRleF0gKz0gaWRlbnRpZmllcihwb3NpdGlvbiAtIDEpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAyOlxuICAgICAgICBwYXJzZWRbaW5kZXhdICs9IGRlbGltaXQoY2hhcmFjdGVyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDpcbiAgICAgICAgLy8gY29tbWFcbiAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gNDQpIHtcbiAgICAgICAgICAvLyBjb2xvblxuICAgICAgICAgIHBhcnNlZFsrK2luZGV4XSA9IHBlZWsoKSA9PT0gNTggPyAnJlxcZicgOiAnJztcbiAgICAgICAgICBwb2ludHNbaW5kZXhdID0gcGFyc2VkW2luZGV4XS5sZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgLy8gZmFsbHRocm91Z2hcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGFyc2VkW2luZGV4XSArPSBmcm9tKGNoYXJhY3Rlcik7XG4gICAgfVxuICB9IHdoaWxlIChjaGFyYWN0ZXIgPSBuZXh0KCkpO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuXG52YXIgZ2V0UnVsZXMgPSBmdW5jdGlvbiBnZXRSdWxlcyh2YWx1ZSwgcG9pbnRzKSB7XG4gIHJldHVybiBkZWFsbG9jKHRvUnVsZXMoYWxsb2ModmFsdWUpLCBwb2ludHMpKTtcbn07IC8vIFdlYWtTZXQgd291bGQgYmUgbW9yZSBhcHByb3ByaWF0ZSwgYnV0IG9ubHkgV2Vha01hcCBpcyBzdXBwb3J0ZWQgaW4gSUUxMVxuXG5cbnZhciBmaXhlZEVsZW1lbnRzID0gLyogI19fUFVSRV9fICovbmV3IFdlYWtNYXAoKTtcbnZhciBjb21wYXQgPSBmdW5jdGlvbiBjb21wYXQoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC50eXBlICE9PSAncnVsZScgfHwgIWVsZW1lbnQucGFyZW50IHx8IC8vIC5sZW5ndGggaW5kaWNhdGVzIGlmIHRoaXMgcnVsZSBjb250YWlucyBwc2V1ZG8gb3Igbm90XG4gICFlbGVtZW50Lmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IGVsZW1lbnQudmFsdWUsXG4gICAgICBwYXJlbnQgPSBlbGVtZW50LnBhcmVudDtcbiAgdmFyIGlzSW1wbGljaXRSdWxlID0gZWxlbWVudC5jb2x1bW4gPT09IHBhcmVudC5jb2x1bW4gJiYgZWxlbWVudC5saW5lID09PSBwYXJlbnQubGluZTtcblxuICB3aGlsZSAocGFyZW50LnR5cGUgIT09ICdydWxlJykge1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgfSAvLyBzaG9ydC1jaXJjdWl0IGZvciB0aGUgc2ltcGxlc3QgY2FzZVxuXG5cbiAgaWYgKGVsZW1lbnQucHJvcHMubGVuZ3RoID09PSAxICYmIHZhbHVlLmNoYXJDb2RlQXQoMCkgIT09IDU4XG4gIC8qIGNvbG9uICovXG4gICYmICFmaXhlZEVsZW1lbnRzLmdldChwYXJlbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIGlmIHRoaXMgaXMgYW4gaW1wbGljaXRseSBpbnNlcnRlZCBydWxlICh0aGUgb25lIGVhZ2VybHkgaW5zZXJ0ZWQgYXQgdGhlIGVhY2ggbmV3IG5lc3RlZCBsZXZlbClcbiAgLy8gdGhlbiB0aGUgcHJvcHMgaGFzIGFscmVhZHkgYmVlbiBtYW5pcHVsYXRlZCBiZWZvcmVoYW5kIGFzIHRoZXkgdGhhdCBhcnJheSBpcyBzaGFyZWQgYmV0d2VlbiBpdCBhbmQgaXRzIFwicnVsZSBwYXJlbnRcIlxuXG5cbiAgaWYgKGlzSW1wbGljaXRSdWxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZml4ZWRFbGVtZW50cy5zZXQoZWxlbWVudCwgdHJ1ZSk7XG4gIHZhciBwb2ludHMgPSBbXTtcbiAgdmFyIHJ1bGVzID0gZ2V0UnVsZXModmFsdWUsIHBvaW50cyk7XG4gIHZhciBwYXJlbnRSdWxlcyA9IHBhcmVudC5wcm9wcztcblxuICBmb3IgKHZhciBpID0gMCwgayA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFyZW50UnVsZXMubGVuZ3RoOyBqKyssIGsrKykge1xuICAgICAgZWxlbWVudC5wcm9wc1trXSA9IHBvaW50c1tpXSA/IHJ1bGVzW2ldLnJlcGxhY2UoLyZcXGYvZywgcGFyZW50UnVsZXNbal0pIDogcGFyZW50UnVsZXNbal0gKyBcIiBcIiArIHJ1bGVzW2ldO1xuICAgIH1cbiAgfVxufTtcbnZhciByZW1vdmVMYWJlbCA9IGZ1bmN0aW9uIHJlbW92ZUxhYmVsKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQudHlwZSA9PT0gJ2RlY2wnKSB7XG4gICAgdmFyIHZhbHVlID0gZWxlbWVudC52YWx1ZTtcblxuICAgIGlmICggLy8gY2hhcmNvZGUgZm9yIGxcbiAgICB2YWx1ZS5jaGFyQ29kZUF0KDApID09PSAxMDggJiYgLy8gY2hhcmNvZGUgZm9yIGJcbiAgICB2YWx1ZS5jaGFyQ29kZUF0KDIpID09PSA5OCkge1xuICAgICAgLy8gdGhpcyBpZ25vcmVzIGxhYmVsXG4gICAgICBlbGVtZW50W1wicmV0dXJuXCJdID0gJyc7XG4gICAgICBlbGVtZW50LnZhbHVlID0gJyc7XG4gICAgfVxuICB9XG59O1xudmFyIGlnbm9yZUZsYWcgPSAnZW1vdGlvbi1kaXNhYmxlLXNlcnZlci1yZW5kZXJpbmctdW5zYWZlLXNlbGVjdG9yLXdhcm5pbmctcGxlYXNlLWRvLW5vdC11c2UtdGhpcy10aGUtd2FybmluZy1leGlzdHMtZm9yLWEtcmVhc29uJztcblxudmFyIGlzSWdub3JpbmdDb21tZW50ID0gZnVuY3Rpb24gaXNJZ25vcmluZ0NvbW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gISFlbGVtZW50ICYmIGVsZW1lbnQudHlwZSA9PT0gJ2NvbW0nICYmIGVsZW1lbnQuY2hpbGRyZW4uaW5kZXhPZihpZ25vcmVGbGFnKSA+IC0xO1xufTtcblxudmFyIGNyZWF0ZVVuc2FmZVNlbGVjdG9yc0FsYXJtID0gZnVuY3Rpb24gY3JlYXRlVW5zYWZlU2VsZWN0b3JzQWxhcm0oY2FjaGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCwgY2hpbGRyZW4pIHtcbiAgICBpZiAoZWxlbWVudC50eXBlICE9PSAncnVsZScpIHJldHVybjtcbiAgICB2YXIgdW5zYWZlUHNldWRvQ2xhc3NlcyA9IGVsZW1lbnQudmFsdWUubWF0Y2goLyg6Zmlyc3R8Om50aHw6bnRoLWxhc3QpLWNoaWxkL2cpO1xuXG4gICAgaWYgKHVuc2FmZVBzZXVkb0NsYXNzZXMgJiYgY2FjaGUuY29tcGF0ICE9PSB0cnVlKSB7XG4gICAgICB2YXIgcHJldkVsZW1lbnQgPSBpbmRleCA+IDAgPyBjaGlsZHJlbltpbmRleCAtIDFdIDogbnVsbDtcblxuICAgICAgaWYgKHByZXZFbGVtZW50ICYmIGlzSWdub3JpbmdDb21tZW50KGxhc3QocHJldkVsZW1lbnQuY2hpbGRyZW4pKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVuc2FmZVBzZXVkb0NsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAodW5zYWZlUHNldWRvQ2xhc3MpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBwc2V1ZG8gY2xhc3MgXFxcIlwiICsgdW5zYWZlUHNldWRvQ2xhc3MgKyBcIlxcXCIgaXMgcG90ZW50aWFsbHkgdW5zYWZlIHdoZW4gZG9pbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLiBUcnkgY2hhbmdpbmcgaXQgdG8gXFxcIlwiICsgdW5zYWZlUHNldWRvQ2xhc3Muc3BsaXQoJy1jaGlsZCcpWzBdICsgXCItb2YtdHlwZVxcXCIuXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxudmFyIGlzSW1wb3J0UnVsZSA9IGZ1bmN0aW9uIGlzSW1wb3J0UnVsZShlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50LnR5cGUuY2hhckNvZGVBdCgxKSA9PT0gMTA1ICYmIGVsZW1lbnQudHlwZS5jaGFyQ29kZUF0KDApID09PSA2NDtcbn07XG5cbnZhciBpc1ByZXBlbmRlZFdpdGhSZWd1bGFyUnVsZXMgPSBmdW5jdGlvbiBpc1ByZXBlbmRlZFdpdGhSZWd1bGFyUnVsZXMoaW5kZXgsIGNoaWxkcmVuKSB7XG4gIGZvciAodmFyIGkgPSBpbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKCFpc0ltcG9ydFJ1bGUoY2hpbGRyZW5baV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59OyAvLyB1c2UgdGhpcyB0byByZW1vdmUgaW5jb3JyZWN0IGVsZW1lbnRzIGZyb20gZnVydGhlciBwcm9jZXNzaW5nXG4vLyBzbyB0aGV5IGRvbid0IGdldCBoYW5kZWQgdG8gdGhlIGBzaGVldGAgKG9yIGFueXRoaW5nIGVsc2UpXG4vLyBhcyB0aGF0IGNvdWxkIHBvdGVudGlhbGx5IGxlYWQgdG8gYWRkaXRpb25hbCBsb2dzIHdoaWNoIGluIHR1cm4gY291bGQgYmUgb3ZlcmhlbG1pbmcgdG8gdGhlIHVzZXJcblxuXG52YXIgbnVsbGlmeUVsZW1lbnQgPSBmdW5jdGlvbiBudWxsaWZ5RWxlbWVudChlbGVtZW50KSB7XG4gIGVsZW1lbnQudHlwZSA9ICcnO1xuICBlbGVtZW50LnZhbHVlID0gJyc7XG4gIGVsZW1lbnRbXCJyZXR1cm5cIl0gPSAnJztcbiAgZWxlbWVudC5jaGlsZHJlbiA9ICcnO1xuICBlbGVtZW50LnByb3BzID0gJyc7XG59O1xuXG52YXIgaW5jb3JyZWN0SW1wb3J0QWxhcm0gPSBmdW5jdGlvbiBpbmNvcnJlY3RJbXBvcnRBbGFybShlbGVtZW50LCBpbmRleCwgY2hpbGRyZW4pIHtcbiAgaWYgKCFpc0ltcG9ydFJ1bGUoZWxlbWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZWxlbWVudC5wYXJlbnQpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiYEBpbXBvcnRgIHJ1bGVzIGNhbid0IGJlIG5lc3RlZCBpbnNpZGUgb3RoZXIgcnVsZXMuIFBsZWFzZSBtb3ZlIGl0IHRvIHRoZSB0b3AgbGV2ZWwgYW5kIHB1dCBpdCBiZWZvcmUgcmVndWxhciBydWxlcy4gS2VlcCBpbiBtaW5kIHRoYXQgdGhleSBjYW4gb25seSBiZSB1c2VkIHdpdGhpbiBnbG9iYWwgc3R5bGVzLlwiKTtcbiAgICBudWxsaWZ5RWxlbWVudChlbGVtZW50KTtcbiAgfSBlbHNlIGlmIChpc1ByZXBlbmRlZFdpdGhSZWd1bGFyUnVsZXMoaW5kZXgsIGNoaWxkcmVuKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJgQGltcG9ydGAgcnVsZXMgY2FuJ3QgYmUgYWZ0ZXIgb3RoZXIgcnVsZXMuIFBsZWFzZSBwdXQgeW91ciBgQGltcG9ydGAgcnVsZXMgYmVmb3JlIHlvdXIgb3RoZXIgcnVsZXMuXCIpO1xuICAgIG51bGxpZnlFbGVtZW50KGVsZW1lbnQpO1xuICB9XG59O1xuXG52YXIgZGVmYXVsdFN0eWxpc1BsdWdpbnMgPSBbcHJlZml4ZXJdO1xuXG52YXIgY3JlYXRlQ2FjaGUgPSBmdW5jdGlvbiBjcmVhdGVDYWNoZShvcHRpb25zKSB7XG4gIHZhciBrZXkgPSBvcHRpb25zLmtleTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAha2V5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGhhdmUgdG8gY29uZmlndXJlIGBrZXlgIGZvciB5b3VyIGNhY2hlLiBQbGVhc2UgbWFrZSBzdXJlIGl0J3MgdW5pcXVlIChhbmQgbm90IGVxdWFsIHRvICdjc3MnKSBhcyBpdCdzIHVzZWQgZm9yIGxpbmtpbmcgc3R5bGVzIHRvIHlvdXIgY2FjaGUuXFxuXCIgKyBcIklmIG11bHRpcGxlIGNhY2hlcyBzaGFyZSB0aGUgc2FtZSBrZXkgdGhleSBtaWdodCBcXFwiZmlnaHRcXFwiIGZvciBlYWNoIG90aGVyJ3Mgc3R5bGUgZWxlbWVudHMuXCIpO1xuICB9XG5cbiAgaWYgKCBrZXkgPT09ICdjc3MnKSB7XG4gICAgdmFyIHNzclN0eWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdHlsZVtkYXRhLWVtb3Rpb25dOm5vdChbZGF0YS1zXSlcIik7IC8vIGdldCBTU1JlZCBzdHlsZXMgb3V0IG9mIHRoZSB3YXkgb2YgUmVhY3QncyBoeWRyYXRpb25cbiAgICAvLyBkb2N1bWVudC5oZWFkIGlzIGEgc2FmZSBwbGFjZSB0byBtb3ZlIHRoZW0gdG8odGhvdWdoIG5vdGUgZG9jdW1lbnQuaGVhZCBpcyBub3QgbmVjZXNzYXJpbHkgdGhlIGxhc3QgcGxhY2UgdGhleSB3aWxsIGJlKVxuICAgIC8vIG5vdGUgdGhpcyB2ZXJ5IHZlcnkgaW50ZW50aW9uYWxseSB0YXJnZXRzIGFsbCBzdHlsZSBlbGVtZW50cyByZWdhcmRsZXNzIG9mIHRoZSBrZXkgdG8gZW5zdXJlXG4gICAgLy8gdGhhdCBjcmVhdGluZyBhIGNhY2hlIHdvcmtzIGluc2lkZSBvZiByZW5kZXIgb2YgYSBSZWFjdCBjb21wb25lbnRcblxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoc3NyU3R5bGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgLy8gd2Ugd2FudCB0byBvbmx5IG1vdmUgZWxlbWVudHMgd2hpY2ggaGF2ZSBhIHNwYWNlIGluIHRoZSBkYXRhLWVtb3Rpb24gYXR0cmlidXRlIHZhbHVlXG4gICAgICAvLyBiZWNhdXNlIHRoYXQgaW5kaWNhdGVzIHRoYXQgaXQgaXMgYW4gRW1vdGlvbiAxMSBzZXJ2ZXItc2lkZSByZW5kZXJlZCBzdHlsZSBlbGVtZW50c1xuICAgICAgLy8gd2hpbGUgd2Ugd2lsbCBhbHJlYWR5IGlnbm9yZSBFbW90aW9uIDExIGNsaWVudC1zaWRlIGluc2VydGVkIHN0eWxlcyBiZWNhdXNlIG9mIHRoZSA6bm90KFtkYXRhLXNdKSBwYXJ0IGluIHRoZSBzZWxlY3RvclxuICAgICAgLy8gRW1vdGlvbiAxMCBjbGllbnQtc2lkZSBpbnNlcnRlZCBzdHlsZXMgZGlkIG5vdCBoYXZlIGRhdGEtcyAoYnV0IGltcG9ydGFudGx5IGRpZCBub3QgaGF2ZSBhIHNwYWNlIGluIHRoZWlyIGRhdGEtZW1vdGlvbiBhdHRyaWJ1dGVzKVxuICAgICAgLy8gc28gY2hlY2tpbmcgZm9yIHRoZSBzcGFjZSBlbnN1cmVzIHRoYXQgbG9hZGluZyBFbW90aW9uIDExIGFmdGVyIEVtb3Rpb24gMTAgaGFzIGluc2VydGVkIHNvbWUgc3R5bGVzXG4gICAgICAvLyB3aWxsIG5vdCByZXN1bHQgaW4gdGhlIEVtb3Rpb24gMTAgc3R5bGVzIGJlaW5nIGRlc3Ryb3llZFxuICAgICAgdmFyIGRhdGFFbW90aW9uQXR0cmlidXRlID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZW1vdGlvbicpO1xuXG4gICAgICBpZiAoZGF0YUVtb3Rpb25BdHRyaWJ1dGUuaW5kZXhPZignICcpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcycsICcnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzdHlsaXNQbHVnaW5zID0gb3B0aW9ucy5zdHlsaXNQbHVnaW5zIHx8IGRlZmF1bHRTdHlsaXNQbHVnaW5zO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGlmICgvW15hLXotXS8udGVzdChrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbW90aW9uIGtleSBtdXN0IG9ubHkgY29udGFpbiBsb3dlciBjYXNlIGFscGhhYmV0aWNhbCBjaGFyYWN0ZXJzIGFuZCAtIGJ1dCBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgd2FzIHBhc3NlZFwiKTtcbiAgICB9XG4gIH1cblxuICB2YXIgaW5zZXJ0ZWQgPSB7fTsgLy8gJEZsb3dGaXhNZVxuXG4gIHZhciBjb250YWluZXI7XG4gIHZhciBub2Rlc1RvSHlkcmF0ZSA9IFtdO1xuXG4gIHtcbiAgICBjb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lciB8fCBkb2N1bWVudC5oZWFkO1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoIC8vIHRoaXMgbWVhbnMgd2Ugd2lsbCBpZ25vcmUgZWxlbWVudHMgd2hpY2ggZG9uJ3QgaGF2ZSBhIHNwYWNlIGluIHRoZW0gd2hpY2hcbiAgICAvLyBtZWFucyB0aGF0IHRoZSBzdHlsZSBlbGVtZW50cyB3ZSdyZSBsb29raW5nIGF0IGFyZSBvbmx5IEVtb3Rpb24gMTEgc2VydmVyLXJlbmRlcmVkIHN0eWxlIGVsZW1lbnRzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInN0eWxlW2RhdGEtZW1vdGlvbl49XFxcIlwiICsga2V5ICsgXCIgXFxcIl1cIiksIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICB2YXIgYXR0cmliID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWVtb3Rpb25cIikuc3BsaXQoJyAnKTsgLy8gJEZsb3dGaXhNZVxuXG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGF0dHJpYi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpbnNlcnRlZFthdHRyaWJbaV1dID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbm9kZXNUb0h5ZHJhdGUucHVzaChub2RlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBfaW5zZXJ0O1xuXG4gIHZhciBvbW5pcHJlc2VudFBsdWdpbnMgPSBbY29tcGF0LCByZW1vdmVMYWJlbF07XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBvbW5pcHJlc2VudFBsdWdpbnMucHVzaChjcmVhdGVVbnNhZmVTZWxlY3RvcnNBbGFybSh7XG4gICAgICBnZXQgY29tcGF0KCkge1xuICAgICAgICByZXR1cm4gY2FjaGUuY29tcGF0O1xuICAgICAgfVxuXG4gICAgfSksIGluY29ycmVjdEltcG9ydEFsYXJtKTtcbiAgfVxuXG4gIHtcbiAgICB2YXIgY3VycmVudFNoZWV0O1xuICAgIHZhciBmaW5hbGl6aW5nUGx1Z2lucyA9IFtzdHJpbmdpZnksIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgaWYgKCFlbGVtZW50LnJvb3QpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICBjdXJyZW50U2hlZXQuaW5zZXJ0KGVsZW1lbnRbXCJyZXR1cm5cIl0pO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQudmFsdWUgJiYgZWxlbWVudC50eXBlICE9PSBDT01NRU5UKSB7XG4gICAgICAgICAgLy8gaW5zZXJ0IGVtcHR5IHJ1bGUgaW4gbm9uLXByb2R1Y3Rpb24gZW52aXJvbm1lbnRzXG4gICAgICAgICAgLy8gc28gQGVtb3Rpb24vamVzdCBjYW4gZ3JhYiBga2V5YCBmcm9tIHRoZSAoSlMpRE9NIGZvciBjYWNoZXMgd2l0aG91dCBhbnkgcnVsZXMgaW5zZXJ0ZWQgeWV0XG4gICAgICAgICAgY3VycmVudFNoZWV0Lmluc2VydChlbGVtZW50LnZhbHVlICsgXCJ7fVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gOiBydWxlc2hlZXQoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIGN1cnJlbnRTaGVldC5pbnNlcnQocnVsZSk7XG4gICAgfSldO1xuICAgIHZhciBzZXJpYWxpemVyID0gbWlkZGxld2FyZShvbW5pcHJlc2VudFBsdWdpbnMuY29uY2F0KHN0eWxpc1BsdWdpbnMsIGZpbmFsaXppbmdQbHVnaW5zKSk7XG5cbiAgICB2YXIgc3R5bGlzID0gZnVuY3Rpb24gc3R5bGlzKHN0eWxlcykge1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZShjb21waWxlKHN0eWxlcyksIHNlcmlhbGl6ZXIpO1xuICAgIH07XG5cbiAgICBfaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0KHNlbGVjdG9yLCBzZXJpYWxpemVkLCBzaGVldCwgc2hvdWxkQ2FjaGUpIHtcbiAgICAgIGN1cnJlbnRTaGVldCA9IHNoZWV0O1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBzZXJpYWxpemVkLm1hcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGN1cnJlbnRTaGVldCA9IHtcbiAgICAgICAgICBpbnNlcnQ6IGZ1bmN0aW9uIGluc2VydChydWxlKSB7XG4gICAgICAgICAgICBzaGVldC5pbnNlcnQocnVsZSArIHNlcmlhbGl6ZWQubWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHN0eWxpcyhzZWxlY3RvciA/IHNlbGVjdG9yICsgXCJ7XCIgKyBzZXJpYWxpemVkLnN0eWxlcyArIFwifVwiIDogc2VyaWFsaXplZC5zdHlsZXMpO1xuXG4gICAgICBpZiAoc2hvdWxkQ2FjaGUpIHtcbiAgICAgICAgY2FjaGUuaW5zZXJ0ZWRbc2VyaWFsaXplZC5uYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBjYWNoZSA9IHtcbiAgICBrZXk6IGtleSxcbiAgICBzaGVldDogbmV3IFN0eWxlU2hlZXQoe1xuICAgICAga2V5OiBrZXksXG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIG5vbmNlOiBvcHRpb25zLm5vbmNlLFxuICAgICAgc3BlZWR5OiBvcHRpb25zLnNwZWVkeSxcbiAgICAgIHByZXBlbmQ6IG9wdGlvbnMucHJlcGVuZFxuICAgIH0pLFxuICAgIG5vbmNlOiBvcHRpb25zLm5vbmNlLFxuICAgIGluc2VydGVkOiBpbnNlcnRlZCxcbiAgICByZWdpc3RlcmVkOiB7fSxcbiAgICBpbnNlcnQ6IF9pbnNlcnRcbiAgfTtcbiAgY2FjaGUuc2hlZXQuaHlkcmF0ZShub2Rlc1RvSHlkcmF0ZSk7XG4gIHJldHVybiBjYWNoZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNhY2hlO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn0iLCJ2YXIgaXNCcm93c2VyID0gXCJvYmplY3RcIiAhPT0gJ3VuZGVmaW5lZCc7XG5mdW5jdGlvbiBnZXRSZWdpc3RlcmVkU3R5bGVzKHJlZ2lzdGVyZWQsIHJlZ2lzdGVyZWRTdHlsZXMsIGNsYXNzTmFtZXMpIHtcbiAgdmFyIHJhd0NsYXNzTmFtZSA9ICcnO1xuICBjbGFzc05hbWVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKHJlZ2lzdGVyZWRbY2xhc3NOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZWdpc3RlcmVkU3R5bGVzLnB1c2gocmVnaXN0ZXJlZFtjbGFzc05hbWVdICsgXCI7XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYXdDbGFzc05hbWUgKz0gY2xhc3NOYW1lICsgXCIgXCI7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJhd0NsYXNzTmFtZTtcbn1cbnZhciBpbnNlcnRTdHlsZXMgPSBmdW5jdGlvbiBpbnNlcnRTdHlsZXMoY2FjaGUsIHNlcmlhbGl6ZWQsIGlzU3RyaW5nVGFnKSB7XG4gIHZhciBjbGFzc05hbWUgPSBjYWNoZS5rZXkgKyBcIi1cIiArIHNlcmlhbGl6ZWQubmFtZTtcblxuICBpZiAoIC8vIHdlIG9ubHkgbmVlZCB0byBhZGQgdGhlIHN0eWxlcyB0byB0aGUgcmVnaXN0ZXJlZCBjYWNoZSBpZiB0aGVcbiAgLy8gY2xhc3MgbmFtZSBjb3VsZCBiZSB1c2VkIGZ1cnRoZXIgZG93blxuICAvLyB0aGUgdHJlZSBidXQgaWYgaXQncyBhIHN0cmluZyB0YWcsIHdlIGtub3cgaXQgd29uJ3RcbiAgLy8gc28gd2UgZG9uJ3QgaGF2ZSB0byBhZGQgaXQgdG8gcmVnaXN0ZXJlZCBjYWNoZS5cbiAgLy8gdGhpcyBpbXByb3ZlcyBtZW1vcnkgdXNhZ2Ugc2luY2Ugd2UgY2FuIGF2b2lkIHN0b3JpbmcgdGhlIHdob2xlIHN0eWxlIHN0cmluZ1xuICAoaXNTdHJpbmdUYWcgPT09IGZhbHNlIHx8IC8vIHdlIG5lZWQgdG8gYWx3YXlzIHN0b3JlIGl0IGlmIHdlJ3JlIGluIGNvbXBhdCBtb2RlIGFuZFxuICAvLyBpbiBub2RlIHNpbmNlIGVtb3Rpb24tc2VydmVyIHJlbGllcyBvbiB3aGV0aGVyIGEgc3R5bGUgaXMgaW5cbiAgLy8gdGhlIHJlZ2lzdGVyZWQgY2FjaGUgdG8ga25vdyB3aGV0aGVyIGEgc3R5bGUgaXMgZ2xvYmFsIG9yIG5vdFxuICAvLyBhbHNvLCBub3RlIHRoYXQgdGhpcyBjaGVjayB3aWxsIGJlIGRlYWQgY29kZSBlbGltaW5hdGVkIGluIHRoZSBicm93c2VyXG4gIGlzQnJvd3NlciA9PT0gZmFsc2UgKSAmJiBjYWNoZS5yZWdpc3RlcmVkW2NsYXNzTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgIGNhY2hlLnJlZ2lzdGVyZWRbY2xhc3NOYW1lXSA9IHNlcmlhbGl6ZWQuc3R5bGVzO1xuICB9XG5cbiAgaWYgKGNhY2hlLmluc2VydGVkW3NlcmlhbGl6ZWQubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjdXJyZW50ID0gc2VyaWFsaXplZDtcblxuICAgIGRvIHtcbiAgICAgIHZhciBtYXliZVN0eWxlcyA9IGNhY2hlLmluc2VydChzZXJpYWxpemVkID09PSBjdXJyZW50ID8gXCIuXCIgKyBjbGFzc05hbWUgOiAnJywgY3VycmVudCwgY2FjaGUuc2hlZXQsIHRydWUpO1xuXG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgIH0gd2hpbGUgKGN1cnJlbnQgIT09IHVuZGVmaW5lZCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGdldFJlZ2lzdGVyZWRTdHlsZXMsIGluc2VydFN0eWxlcyB9O1xuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9nYXJ5Y291cnQvbXVybXVyaGFzaC1qc1xuLy8gUG9ydGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FhcHBsZWJ5L3NtaGFzaGVyL2Jsb2IvNjFhMDUzMGYyODI3N2YyZTg1MGJmYzM5NjAwY2U2MWQwMmI1MThkZS9zcmMvTXVybXVySGFzaDIuY3BwI0wzNy1MODZcbmZ1bmN0aW9uIG11cm11cjIoc3RyKSB7XG4gIC8vICdtJyBhbmQgJ3InIGFyZSBtaXhpbmcgY29uc3RhbnRzIGdlbmVyYXRlZCBvZmZsaW5lLlxuICAvLyBUaGV5J3JlIG5vdCByZWFsbHkgJ21hZ2ljJywgdGhleSBqdXN0IGhhcHBlbiB0byB3b3JrIHdlbGwuXG4gIC8vIGNvbnN0IG0gPSAweDViZDFlOTk1O1xuICAvLyBjb25zdCByID0gMjQ7XG4gIC8vIEluaXRpYWxpemUgdGhlIGhhc2hcbiAgdmFyIGggPSAwOyAvLyBNaXggNCBieXRlcyBhdCBhIHRpbWUgaW50byB0aGUgaGFzaFxuXG4gIHZhciBrLFxuICAgICAgaSA9IDAsXG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xuXG4gIGZvciAoOyBsZW4gPj0gNDsgKytpLCBsZW4gLT0gNCkge1xuICAgIGsgPSBzdHIuY2hhckNvZGVBdChpKSAmIDB4ZmYgfCAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDggfCAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDE2IHwgKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCAyNDtcbiAgICBrID1cbiAgICAvKiBNYXRoLmltdWwoaywgbSk6ICovXG4gICAgKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoayA+Pj4gMTYpICogMHhlOTk1IDw8IDE2KTtcbiAgICBrIF49XG4gICAgLyogayA+Pj4gcjogKi9cbiAgICBrID4+PiAyNDtcbiAgICBoID1cbiAgICAvKiBNYXRoLmltdWwoaywgbSk6ICovXG4gICAgKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoayA+Pj4gMTYpICogMHhlOTk1IDw8IDE2KSBeXG4gICAgLyogTWF0aC5pbXVsKGgsIG0pOiAqL1xuICAgIChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUgKyAoKGggPj4+IDE2KSAqIDB4ZTk5NSA8PCAxNik7XG4gIH0gLy8gSGFuZGxlIHRoZSBsYXN0IGZldyBieXRlcyBvZiB0aGUgaW5wdXQgYXJyYXlcblxuXG4gIHN3aXRjaCAobGVuKSB7XG4gICAgY2FzZSAzOlxuICAgICAgaCBePSAoc3RyLmNoYXJDb2RlQXQoaSArIDIpICYgMHhmZikgPDwgMTY7XG5cbiAgICBjYXNlIDI6XG4gICAgICBoIF49IChzdHIuY2hhckNvZGVBdChpICsgMSkgJiAweGZmKSA8PCA4O1xuXG4gICAgY2FzZSAxOlxuICAgICAgaCBePSBzdHIuY2hhckNvZGVBdChpKSAmIDB4ZmY7XG4gICAgICBoID1cbiAgICAgIC8qIE1hdGguaW11bChoLCBtKTogKi9cbiAgICAgIChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUgKyAoKGggPj4+IDE2KSAqIDB4ZTk5NSA8PCAxNik7XG4gIH0gLy8gRG8gYSBmZXcgZmluYWwgbWl4ZXMgb2YgdGhlIGhhc2ggdG8gZW5zdXJlIHRoZSBsYXN0IGZld1xuICAvLyBieXRlcyBhcmUgd2VsbC1pbmNvcnBvcmF0ZWQuXG5cblxuICBoIF49IGggPj4+IDEzO1xuICBoID1cbiAgLyogTWF0aC5pbXVsKGgsIG0pOiAqL1xuICAoaCAmIDB4ZmZmZikgKiAweDViZDFlOTk1ICsgKChoID4+PiAxNikgKiAweGU5OTUgPDwgMTYpO1xuICByZXR1cm4gKChoIF4gaCA+Pj4gMTUpID4+PiAwKS50b1N0cmluZygzNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG11cm11cjI7XG4iLCJ2YXIgdW5pdGxlc3NLZXlzID0ge1xuICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogMSxcbiAgYm9yZGVySW1hZ2VPdXRzZXQ6IDEsXG4gIGJvcmRlckltYWdlU2xpY2U6IDEsXG4gIGJvcmRlckltYWdlV2lkdGg6IDEsXG4gIGJveEZsZXg6IDEsXG4gIGJveEZsZXhHcm91cDogMSxcbiAgYm94T3JkaW5hbEdyb3VwOiAxLFxuICBjb2x1bW5Db3VudDogMSxcbiAgY29sdW1uczogMSxcbiAgZmxleDogMSxcbiAgZmxleEdyb3c6IDEsXG4gIGZsZXhQb3NpdGl2ZTogMSxcbiAgZmxleFNocmluazogMSxcbiAgZmxleE5lZ2F0aXZlOiAxLFxuICBmbGV4T3JkZXI6IDEsXG4gIGdyaWRSb3c6IDEsXG4gIGdyaWRSb3dFbmQ6IDEsXG4gIGdyaWRSb3dTcGFuOiAxLFxuICBncmlkUm93U3RhcnQ6IDEsXG4gIGdyaWRDb2x1bW46IDEsXG4gIGdyaWRDb2x1bW5FbmQ6IDEsXG4gIGdyaWRDb2x1bW5TcGFuOiAxLFxuICBncmlkQ29sdW1uU3RhcnQ6IDEsXG4gIG1zR3JpZFJvdzogMSxcbiAgbXNHcmlkUm93U3BhbjogMSxcbiAgbXNHcmlkQ29sdW1uOiAxLFxuICBtc0dyaWRDb2x1bW5TcGFuOiAxLFxuICBmb250V2VpZ2h0OiAxLFxuICBsaW5lSGVpZ2h0OiAxLFxuICBvcGFjaXR5OiAxLFxuICBvcmRlcjogMSxcbiAgb3JwaGFuczogMSxcbiAgdGFiU2l6ZTogMSxcbiAgd2lkb3dzOiAxLFxuICB6SW5kZXg6IDEsXG4gIHpvb206IDEsXG4gIFdlYmtpdExpbmVDbGFtcDogMSxcbiAgLy8gU1ZHLXJlbGF0ZWQgcHJvcGVydGllc1xuICBmaWxsT3BhY2l0eTogMSxcbiAgZmxvb2RPcGFjaXR5OiAxLFxuICBzdG9wT3BhY2l0eTogMSxcbiAgc3Ryb2tlRGFzaGFycmF5OiAxLFxuICBzdHJva2VEYXNob2Zmc2V0OiAxLFxuICBzdHJva2VNaXRlcmxpbWl0OiAxLFxuICBzdHJva2VPcGFjaXR5OiAxLFxuICBzdHJva2VXaWR0aDogMVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdW5pdGxlc3NLZXlzO1xuIiwiaW1wb3J0IGhhc2hTdHJpbmcgZnJvbSAnQGVtb3Rpb24vaGFzaCc7XG5pbXBvcnQgdW5pdGxlc3MgZnJvbSAnQGVtb3Rpb24vdW5pdGxlc3MnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnQGVtb3Rpb24vbWVtb2l6ZSc7XG5cbnZhciBJTExFR0FMX0VTQ0FQRV9TRVFVRU5DRV9FUlJPUiA9IFwiWW91IGhhdmUgaWxsZWdhbCBlc2NhcGUgc2VxdWVuY2UgaW4geW91ciB0ZW1wbGF0ZSBsaXRlcmFsLCBtb3N0IGxpa2VseSBpbnNpZGUgY29udGVudCdzIHByb3BlcnR5IHZhbHVlLlxcbkJlY2F1c2UgeW91IHdyaXRlIHlvdXIgQ1NTIGluc2lkZSBhIEphdmFTY3JpcHQgc3RyaW5nIHlvdSBhY3R1YWxseSBoYXZlIHRvIGRvIGRvdWJsZSBlc2NhcGluZywgc28gZm9yIGV4YW1wbGUgXFxcImNvbnRlbnQ6ICdcXFxcMDBkNyc7XFxcIiBzaG91bGQgYmVjb21lIFxcXCJjb250ZW50OiAnXFxcXFxcXFwwMGQ3JztcXFwiLlxcbllvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoaXMgaGVyZTpcXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9UZW1wbGF0ZV9saXRlcmFscyNFUzIwMThfcmV2aXNpb25fb2ZfaWxsZWdhbF9lc2NhcGVfc2VxdWVuY2VzXCI7XG52YXIgVU5ERUZJTkVEX0FTX09CSkVDVF9LRVlfRVJST1IgPSBcIllvdSBoYXZlIHBhc3NlZCBpbiBmYWxzeSB2YWx1ZSBhcyBzdHlsZSBvYmplY3QncyBrZXkgKGNhbiBoYXBwZW4gd2hlbiBpbiBleGFtcGxlIHlvdSBwYXNzIHVuZXhwb3J0ZWQgY29tcG9uZW50IGFzIGNvbXB1dGVkIGtleSkuXCI7XG52YXIgaHlwaGVuYXRlUmVnZXggPSAvW0EtWl18Xm1zL2c7XG52YXIgYW5pbWF0aW9uUmVnZXggPSAvX0VNT18oW15fXSs/KV8oW15dKj8pX0VNT18vZztcblxudmFyIGlzQ3VzdG9tUHJvcGVydHkgPSBmdW5jdGlvbiBpc0N1c3RvbVByb3BlcnR5KHByb3BlcnR5KSB7XG4gIHJldHVybiBwcm9wZXJ0eS5jaGFyQ29kZUF0KDEpID09PSA0NTtcbn07XG5cbnZhciBpc1Byb2Nlc3NhYmxlVmFsdWUgPSBmdW5jdGlvbiBpc1Byb2Nlc3NhYmxlVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG59O1xuXG52YXIgcHJvY2Vzc1N0eWxlTmFtZSA9IC8qICNfX1BVUkVfXyAqL21lbW9pemUoZnVuY3Rpb24gKHN0eWxlTmFtZSkge1xuICByZXR1cm4gaXNDdXN0b21Qcm9wZXJ0eShzdHlsZU5hbWUpID8gc3R5bGVOYW1lIDogc3R5bGVOYW1lLnJlcGxhY2UoaHlwaGVuYXRlUmVnZXgsICctJCYnKS50b0xvd2VyQ2FzZSgpO1xufSk7XG5cbnZhciBwcm9jZXNzU3R5bGVWYWx1ZSA9IGZ1bmN0aW9uIHByb2Nlc3NTdHlsZVZhbHVlKGtleSwgdmFsdWUpIHtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlICdhbmltYXRpb24nOlxuICAgIGNhc2UgJ2FuaW1hdGlvbk5hbWUnOlxuICAgICAge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKGFuaW1hdGlvblJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gsIHAxLCBwMikge1xuICAgICAgICAgICAgY3Vyc29yID0ge1xuICAgICAgICAgICAgICBuYW1lOiBwMSxcbiAgICAgICAgICAgICAgc3R5bGVzOiBwMixcbiAgICAgICAgICAgICAgbmV4dDogY3Vyc29yXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHAxO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICBpZiAodW5pdGxlc3Nba2V5XSAhPT0gMSAmJiAhaXNDdXN0b21Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdmFsdWUgKyAncHgnO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGNvbnRlbnRWYWx1ZVBhdHRlcm4gPSAvKGF0dHJ8Y291bnRlcnM/fHVybHwoKChyZXBlYXRpbmctKT8obGluZWFyfHJhZGlhbCkpfGNvbmljKS1ncmFkaWVudClcXCh8KG5vLSk/KG9wZW58Y2xvc2UpLXF1b3RlLztcbiAgdmFyIGNvbnRlbnRWYWx1ZXMgPSBbJ25vcm1hbCcsICdub25lJywgJ2luaXRpYWwnLCAnaW5oZXJpdCcsICd1bnNldCddO1xuICB2YXIgb2xkUHJvY2Vzc1N0eWxlVmFsdWUgPSBwcm9jZXNzU3R5bGVWYWx1ZTtcbiAgdmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG4gIHZhciBoeXBoZW5QYXR0ZXJuID0gLy0oLikvZztcbiAgdmFyIGh5cGhlbmF0ZWRDYWNoZSA9IHt9O1xuXG4gIHByb2Nlc3NTdHlsZVZhbHVlID0gZnVuY3Rpb24gcHJvY2Vzc1N0eWxlVmFsdWUoa2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgPT09ICdjb250ZW50Jykge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgfHwgY29udGVudFZhbHVlcy5pbmRleE9mKHZhbHVlKSA9PT0gLTEgJiYgIWNvbnRlbnRWYWx1ZVBhdHRlcm4udGVzdCh2YWx1ZSkgJiYgKHZhbHVlLmNoYXJBdCgwKSAhPT0gdmFsdWUuY2hhckF0KHZhbHVlLmxlbmd0aCAtIDEpIHx8IHZhbHVlLmNoYXJBdCgwKSAhPT0gJ1wiJyAmJiB2YWx1ZS5jaGFyQXQoMCkgIT09IFwiJ1wiKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3Ugc2VlbSB0byBiZSB1c2luZyBhIHZhbHVlIGZvciAnY29udGVudCcgd2l0aG91dCBxdW90ZXMsIHRyeSByZXBsYWNpbmcgaXQgd2l0aCBgY29udGVudDogJ1xcXCJcIiArIHZhbHVlICsgXCJcXFwiJ2BcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByb2Nlc3NlZCA9IG9sZFByb2Nlc3NTdHlsZVZhbHVlKGtleSwgdmFsdWUpO1xuXG4gICAgaWYgKHByb2Nlc3NlZCAhPT0gJycgJiYgIWlzQ3VzdG9tUHJvcGVydHkoa2V5KSAmJiBrZXkuaW5kZXhPZignLScpICE9PSAtMSAmJiBoeXBoZW5hdGVkQ2FjaGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBoeXBoZW5hdGVkQ2FjaGVba2V5XSA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKFwiVXNpbmcga2ViYWItY2FzZSBmb3IgY3NzIHByb3BlcnRpZXMgaW4gb2JqZWN0cyBpcyBub3Qgc3VwcG9ydGVkLiBEaWQgeW91IG1lYW4gXCIgKyBrZXkucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKS5yZXBsYWNlKGh5cGhlblBhdHRlcm4sIGZ1bmN0aW9uIChzdHIsIF9jaGFyKSB7XG4gICAgICAgIHJldHVybiBfY2hhci50b1VwcGVyQ2FzZSgpO1xuICAgICAgfSkgKyBcIj9cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgaW50ZXJwb2xhdGlvbikge1xuICBpZiAoaW50ZXJwb2xhdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgaWYgKGludGVycG9sYXRpb24uX19lbW90aW9uX3N0eWxlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgaW50ZXJwb2xhdGlvbi50b1N0cmluZygpID09PSAnTk9fQ09NUE9ORU5UX1NFTEVDVE9SJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgc2VsZWN0b3JzIGNhbiBvbmx5IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBAZW1vdGlvbi9iYWJlbC1wbHVnaW4uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVycG9sYXRpb247XG4gIH1cblxuICBzd2l0Y2ggKHR5cGVvZiBpbnRlcnBvbGF0aW9uKSB7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICB7XG4gICAgICAgIGlmIChpbnRlcnBvbGF0aW9uLmFuaW0gPT09IDEpIHtcbiAgICAgICAgICBjdXJzb3IgPSB7XG4gICAgICAgICAgICBuYW1lOiBpbnRlcnBvbGF0aW9uLm5hbWUsXG4gICAgICAgICAgICBzdHlsZXM6IGludGVycG9sYXRpb24uc3R5bGVzLFxuICAgICAgICAgICAgbmV4dDogY3Vyc29yXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGlvbi5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGludGVycG9sYXRpb24uc3R5bGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGludGVycG9sYXRpb24ubmV4dDtcblxuICAgICAgICAgIGlmIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIG5vdCB0aGUgbW9zdCBlZmZpY2llbnQgdGhpbmcgZXZlciBidXQgdGhpcyBpcyBhIHByZXR0eSByYXJlIGNhc2VcbiAgICAgICAgICAgIC8vIGFuZCB0aGVyZSB3aWxsIGJlIHZlcnkgZmV3IGl0ZXJhdGlvbnMgb2YgdGhpcyBnZW5lcmFsbHlcbiAgICAgICAgICAgIHdoaWxlIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY3Vyc29yID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5leHQubmFtZSxcbiAgICAgICAgICAgICAgICBzdHlsZXM6IG5leHQuc3R5bGVzLFxuICAgICAgICAgICAgICAgIG5leHQ6IGN1cnNvclxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBuZXh0ID0gbmV4dC5uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdHlsZXMgPSBpbnRlcnBvbGF0aW9uLnN0eWxlcyArIFwiO1wiO1xuXG4gICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgaW50ZXJwb2xhdGlvbi5tYXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3R5bGVzICs9IGludGVycG9sYXRpb24ubWFwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdHlsZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3JlYXRlU3RyaW5nRnJvbU9iamVjdChtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgaW50ZXJwb2xhdGlvbik7XG4gICAgICB9XG5cbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICB7XG4gICAgICAgIGlmIChtZXJnZWRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIHByZXZpb3VzQ3Vyc29yID0gY3Vyc29yO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBpbnRlcnBvbGF0aW9uKG1lcmdlZFByb3BzKTtcbiAgICAgICAgICBjdXJzb3IgPSBwcmV2aW91c0N1cnNvcjtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRnVuY3Rpb25zIHRoYXQgYXJlIGludGVycG9sYXRlZCBpbiBjc3MgY2FsbHMgd2lsbCBiZSBzdHJpbmdpZmllZC5cXG4nICsgJ0lmIHlvdSB3YW50IHRvIGhhdmUgYSBjc3MgY2FsbCBiYXNlZCBvbiBwcm9wcywgY3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgY3NzIGNhbGwgbGlrZSB0aGlzXFxuJyArICdsZXQgZHluYW1pY1N0eWxlID0gKHByb3BzKSA9PiBjc3NgY29sb3I6ICR7cHJvcHMuY29sb3J9YFxcbicgKyAnSXQgY2FuIGJlIGNhbGxlZCBkaXJlY3RseSB3aXRoIHByb3BzIG9yIGludGVycG9sYXRlZCBpbiBhIHN0eWxlZCBjYWxsIGxpa2UgdGhpc1xcbicgKyBcImxldCBTb21lQ29tcG9uZW50ID0gc3R5bGVkKCdkaXYnKWAke2R5bmFtaWNTdHlsZX1gXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBbXTtcbiAgICAgICAgdmFyIHJlcGxhY2VkID0gaW50ZXJwb2xhdGlvbi5yZXBsYWNlKGFuaW1hdGlvblJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gsIHAxLCBwMikge1xuICAgICAgICAgIHZhciBmYWtlVmFyTmFtZSA9IFwiYW5pbWF0aW9uXCIgKyBtYXRjaGVkLmxlbmd0aDtcbiAgICAgICAgICBtYXRjaGVkLnB1c2goXCJjb25zdCBcIiArIGZha2VWYXJOYW1lICsgXCIgPSBrZXlmcmFtZXNgXCIgKyBwMi5yZXBsYWNlKC9eQGtleWZyYW1lcyBhbmltYXRpb24tXFx3Ky8sICcnKSArIFwiYFwiKTtcbiAgICAgICAgICByZXR1cm4gXCIke1wiICsgZmFrZVZhck5hbWUgKyBcIn1cIjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZWQubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignYGtleWZyYW1lc2Agb3V0cHV0IGdvdCBpbnRlcnBvbGF0ZWQgaW50byBwbGFpbiBzdHJpbmcsIHBsZWFzZSB3cmFwIGl0IHdpdGggYGNzc2AuXFxuXFxuJyArICdJbnN0ZWFkIG9mIGRvaW5nIHRoaXM6XFxuXFxuJyArIFtdLmNvbmNhdChtYXRjaGVkLCBbXCJgXCIgKyByZXBsYWNlZCArIFwiYFwiXSkuam9pbignXFxuJykgKyAnXFxuXFxuWW91IHNob3VsZCB3cmFwIGl0IHdpdGggYGNzc2AgbGlrZSB0aGlzOlxcblxcbicgKyAoXCJjc3NgXCIgKyByZXBsYWNlZCArIFwiYFwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gIH0gLy8gZmluYWxpemUgc3RyaW5nIHZhbHVlcyAocmVndWxhciBzdHJpbmdzIGFuZCBmdW5jdGlvbnMgaW50ZXJwb2xhdGVkIGludG8gY3NzIGNhbGxzKVxuXG5cbiAgaWYgKHJlZ2lzdGVyZWQgPT0gbnVsbCkge1xuICAgIHJldHVybiBpbnRlcnBvbGF0aW9uO1xuICB9XG5cbiAgdmFyIGNhY2hlZCA9IHJlZ2lzdGVyZWRbaW50ZXJwb2xhdGlvbl07XG4gIHJldHVybiBjYWNoZWQgIT09IHVuZGVmaW5lZCA/IGNhY2hlZCA6IGludGVycG9sYXRpb247XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0Zyb21PYmplY3QobWVyZ2VkUHJvcHMsIHJlZ2lzdGVyZWQsIG9iaikge1xuICB2YXIgc3RyaW5nID0gJyc7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdHJpbmcgKz0gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgb2JqW2ldKSArIFwiO1wiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBfa2V5IGluIG9iaikge1xuICAgICAgdmFyIHZhbHVlID0gb2JqW19rZXldO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAocmVnaXN0ZXJlZCAhPSBudWxsICYmIHJlZ2lzdGVyZWRbdmFsdWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdHJpbmcgKz0gX2tleSArIFwie1wiICsgcmVnaXN0ZXJlZFt2YWx1ZV0gKyBcIn1cIjtcbiAgICAgICAgfSBlbHNlIGlmIChpc1Byb2Nlc3NhYmxlVmFsdWUodmFsdWUpKSB7XG4gICAgICAgICAgc3RyaW5nICs9IHByb2Nlc3NTdHlsZU5hbWUoX2tleSkgKyBcIjpcIiArIHByb2Nlc3NTdHlsZVZhbHVlKF9rZXksIHZhbHVlKSArIFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoX2tleSA9PT0gJ05PX0NPTVBPTkVOVF9TRUxFQ1RPUicgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IHNlbGVjdG9ycyBjYW4gb25seSBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggQGVtb3Rpb24vYmFiZWwtcGx1Z2luLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZVswXSA9PT0gJ3N0cmluZycgJiYgKHJlZ2lzdGVyZWQgPT0gbnVsbCB8fCByZWdpc3RlcmVkW3ZhbHVlWzBdXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCB2YWx1ZS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGlmIChpc1Byb2Nlc3NhYmxlVmFsdWUodmFsdWVbX2ldKSkge1xuICAgICAgICAgICAgICBzdHJpbmcgKz0gcHJvY2Vzc1N0eWxlTmFtZShfa2V5KSArIFwiOlwiICsgcHJvY2Vzc1N0eWxlVmFsdWUoX2tleSwgdmFsdWVbX2ldKSArIFwiO1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaW50ZXJwb2xhdGVkID0gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgdmFsdWUpO1xuXG4gICAgICAgICAgc3dpdGNoIChfa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdhbmltYXRpb24nOlxuICAgICAgICAgICAgY2FzZSAnYW5pbWF0aW9uTmFtZSc6XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gcHJvY2Vzc1N0eWxlTmFtZShfa2V5KSArIFwiOlwiICsgaW50ZXJwb2xhdGVkICsgXCI7XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIF9rZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFVOREVGSU5FRF9BU19PQkpFQ1RfS0VZX0VSUk9SKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gX2tleSArIFwie1wiICsgaW50ZXJwb2xhdGVkICsgXCJ9XCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RyaW5nO1xufVxuXG52YXIgbGFiZWxQYXR0ZXJuID0gL2xhYmVsOlxccyooW15cXHM7XFxue10rKVxccyooO3wkKS9nO1xudmFyIHNvdXJjZU1hcFBhdHRlcm47XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHNvdXJjZU1hcFBhdHRlcm4gPSAvXFwvXFwqI1xcc3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvblxcL2pzb247XFxTK1xccytcXCpcXC8vZztcbn0gLy8gdGhpcyBpcyB0aGUgY3Vyc29yIGZvciBrZXlmcmFtZXNcbi8vIGtleWZyYW1lcyBhcmUgc3RvcmVkIG9uIHRoZSBTZXJpYWxpemVkU3R5bGVzIG9iamVjdCBhcyBhIGxpbmtlZCBsaXN0XG5cblxudmFyIGN1cnNvcjtcbnZhciBzZXJpYWxpemVTdHlsZXMgPSBmdW5jdGlvbiBzZXJpYWxpemVTdHlsZXMoYXJncywgcmVnaXN0ZXJlZCwgbWVyZ2VkUHJvcHMpIHtcbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiBhcmdzWzBdICE9PSBudWxsICYmIGFyZ3NbMF0uc3R5bGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYXJnc1swXTtcbiAgfVxuXG4gIHZhciBzdHJpbmdNb2RlID0gdHJ1ZTtcbiAgdmFyIHN0eWxlcyA9ICcnO1xuICBjdXJzb3IgPSB1bmRlZmluZWQ7XG4gIHZhciBzdHJpbmdzID0gYXJnc1swXTtcblxuICBpZiAoc3RyaW5ncyA9PSBudWxsIHx8IHN0cmluZ3MucmF3ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdHJpbmdNb2RlID0gZmFsc2U7XG4gICAgc3R5bGVzICs9IGhhbmRsZUludGVycG9sYXRpb24obWVyZ2VkUHJvcHMsIHJlZ2lzdGVyZWQsIHN0cmluZ3MpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHN0cmluZ3NbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcihJTExFR0FMX0VTQ0FQRV9TRVFVRU5DRV9FUlJPUik7XG4gICAgfVxuXG4gICAgc3R5bGVzICs9IHN0cmluZ3NbMF07XG4gIH0gLy8gd2Ugc3RhcnQgYXQgMSBzaW5jZSB3ZSd2ZSBhbHJlYWR5IGhhbmRsZWQgdGhlIGZpcnN0IGFyZ1xuXG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgc3R5bGVzICs9IGhhbmRsZUludGVycG9sYXRpb24obWVyZ2VkUHJvcHMsIHJlZ2lzdGVyZWQsIGFyZ3NbaV0pO1xuXG4gICAgaWYgKHN0cmluZ01vZGUpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHN0cmluZ3NbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKElMTEVHQUxfRVNDQVBFX1NFUVVFTkNFX0VSUk9SKTtcbiAgICAgIH1cblxuICAgICAgc3R5bGVzICs9IHN0cmluZ3NbaV07XG4gICAgfVxuICB9XG5cbiAgdmFyIHNvdXJjZU1hcDtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHN0eWxlcyA9IHN0eWxlcy5yZXBsYWNlKHNvdXJjZU1hcFBhdHRlcm4sIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgc291cmNlTWFwID0gbWF0Y2g7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG4gIH0gLy8gdXNpbmcgYSBnbG9iYWwgcmVnZXggd2l0aCAuZXhlYyBpcyBzdGF0ZWZ1bCBzbyBsYXN0SW5kZXggaGFzIHRvIGJlIHJlc2V0IGVhY2ggdGltZVxuXG5cbiAgbGFiZWxQYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG4gIHZhciBpZGVudGlmaWVyTmFtZSA9ICcnO1xuICB2YXIgbWF0Y2g7IC8vIGh0dHBzOi8vZXNiZW5jaC5jb20vYmVuY2gvNWI4MDljMmNmMjk0OTgwMGEwZjYxZmI1XG5cbiAgd2hpbGUgKChtYXRjaCA9IGxhYmVsUGF0dGVybi5leGVjKHN0eWxlcykpICE9PSBudWxsKSB7XG4gICAgaWRlbnRpZmllck5hbWUgKz0gJy0nICsgLy8gJEZsb3dGaXhNZSB3ZSBrbm93IGl0J3Mgbm90IG51bGxcbiAgICBtYXRjaFsxXTtcbiAgfVxuXG4gIHZhciBuYW1lID0gaGFzaFN0cmluZyhzdHlsZXMpICsgaWRlbnRpZmllck5hbWU7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyAkRmxvd0ZpeE1lIFNlcmlhbGl6ZWRTdHlsZXMgdHlwZSBkb2Vzbid0IGhhdmUgdG9TdHJpbmcgcHJvcGVydHkgKGFuZCB3ZSBkb24ndCB3YW50IHRvIGFkZCBpdClcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHN0eWxlczogc3R5bGVzLFxuICAgICAgbWFwOiBzb3VyY2VNYXAsXG4gICAgICBuZXh0OiBjdXJzb3IsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIllvdSBoYXZlIHRyaWVkIHRvIHN0cmluZ2lmeSBvYmplY3QgcmV0dXJuZWQgZnJvbSBgY3NzYCBmdW5jdGlvbi4gSXQgaXNuJ3Qgc3VwcG9zZWQgdG8gYmUgdXNlZCBkaXJlY3RseSAoZS5nLiBhcyB2YWx1ZSBvZiB0aGUgYGNsYXNzTmFtZWAgcHJvcCksIGJ1dCByYXRoZXIgaGFuZGVkIHRvIGVtb3Rpb24gc28gaXQgY2FuIGhhbmRsZSBpdCAoZS5nLiBhcyB2YWx1ZSBvZiBgY3NzYCBwcm9wKS5cIjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIHN0eWxlczogc3R5bGVzLFxuICAgIG5leHQ6IGN1cnNvclxuICB9O1xufTtcblxuZXhwb3J0IHsgc2VyaWFsaXplU3R5bGVzIH07XG4iLCJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCBmb3J3YXJkUmVmLCB1c2VDb250ZXh0LCBjcmVhdGVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNyZWF0ZUNhY2hlIGZyb20gJ0BlbW90aW9uL2NhY2hlJztcbmltcG9ydCBfZXh0ZW5kcyBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9leHRlbmRzJztcbmltcG9ydCB3ZWFrTWVtb2l6ZSBmcm9tICdAZW1vdGlvbi93ZWFrLW1lbW9pemUnO1xuaW1wb3J0IGhvaXN0Tm9uUmVhY3RTdGF0aWNzIGZyb20gJy4uL2lzb2xhdGVkLWhvaXN0LW5vbi1yZWFjdC1zdGF0aWNzLWRvLW5vdC11c2UtdGhpcy1pbi15b3VyLWNvZGUvZGlzdC9lbW90aW9uLXJlYWN0LWlzb2xhdGVkLWhvaXN0LW5vbi1yZWFjdC1zdGF0aWNzLWRvLW5vdC11c2UtdGhpcy1pbi15b3VyLWNvZGUuYnJvd3Nlci5lc20uanMnO1xuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZFN0eWxlcywgaW5zZXJ0U3R5bGVzIH0gZnJvbSAnQGVtb3Rpb24vdXRpbHMnO1xuaW1wb3J0IHsgc2VyaWFsaXplU3R5bGVzIH0gZnJvbSAnQGVtb3Rpb24vc2VyaWFsaXplJztcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIEVtb3Rpb25DYWNoZUNvbnRleHQgPSAvKiAjX19QVVJFX18gKi9jcmVhdGVDb250ZXh0KCAvLyB3ZSdyZSBkb2luZyB0aGlzIHRvIGF2b2lkIHByZWNvbnN0cnVjdCdzIGRlYWQgY29kZSBlbGltaW5hdGlvbiBpbiB0aGlzIG9uZSBjYXNlXG4vLyBiZWNhdXNlIHRoaXMgbW9kdWxlIGlzIHByaW1hcmlseSBpbnRlbmRlZCBmb3IgdGhlIGJyb3dzZXIgYW5kIG5vZGVcbi8vIGJ1dCBpdCdzIGFsc28gcmVxdWlyZWQgaW4gcmVhY3QgbmF0aXZlIGFuZCBzaW1pbGFyIGVudmlyb25tZW50cyBzb21ldGltZXNcbi8vIGFuZCB3ZSBjb3VsZCBoYXZlIGEgc3BlY2lhbCBidWlsZCBqdXN0IGZvciB0aGF0XG4vLyBidXQgdGhpcyBpcyBtdWNoIGVhc2llciBhbmQgdGhlIG5hdGl2ZSBwYWNrYWdlc1xuLy8gbWlnaHQgdXNlIGEgZGlmZmVyZW50IHRoZW1lIGNvbnRleHQgaW4gdGhlIGZ1dHVyZSBhbnl3YXlcbnR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyAvKiAjX19QVVJFX18gKi9jcmVhdGVDYWNoZSh7XG4gIGtleTogJ2Nzcydcbn0pIDogbnVsbCk7XG52YXIgQ2FjaGVQcm92aWRlciA9IEVtb3Rpb25DYWNoZUNvbnRleHQuUHJvdmlkZXI7XG5cbnZhciB3aXRoRW1vdGlvbkNhY2hlID0gZnVuY3Rpb24gd2l0aEVtb3Rpb25DYWNoZShmdW5jKSB7XG4gIC8vICRGbG93Rml4TWVcbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKGZ1bmN0aW9uIChwcm9wcywgcmVmKSB7XG4gICAgLy8gdGhlIGNhY2hlIHdpbGwgbmV2ZXIgYmUgbnVsbCBpbiB0aGUgYnJvd3NlclxuICAgIHZhciBjYWNoZSA9IHVzZUNvbnRleHQoRW1vdGlvbkNhY2hlQ29udGV4dCk7XG4gICAgcmV0dXJuIGZ1bmMocHJvcHMsIGNhY2hlLCByZWYpO1xuICB9KTtcbn07XG5cbnZhciBUaGVtZUNvbnRleHQgPSAvKiAjX19QVVJFX18gKi9jcmVhdGVDb250ZXh0KHt9KTtcbnZhciB1c2VUaGVtZSA9IGZ1bmN0aW9uIHVzZVRoZW1lKCkge1xuICByZXR1cm4gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xufTtcblxudmFyIGdldFRoZW1lID0gZnVuY3Rpb24gZ2V0VGhlbWUob3V0ZXJUaGVtZSwgdGhlbWUpIHtcbiAgaWYgKHR5cGVvZiB0aGVtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBtZXJnZWRUaGVtZSA9IHRoZW1lKG91dGVyVGhlbWUpO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgKG1lcmdlZFRoZW1lID09IG51bGwgfHwgdHlwZW9mIG1lcmdlZFRoZW1lICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KG1lcmdlZFRoZW1lKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignW1RoZW1lUHJvdmlkZXJdIFBsZWFzZSByZXR1cm4gYW4gb2JqZWN0IGZyb20geW91ciB0aGVtZSBmdW5jdGlvbiwgaS5lLiB0aGVtZT17KCkgPT4gKHt9KX0hJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlZFRoZW1lO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgKHRoZW1lID09IG51bGwgfHwgdHlwZW9mIHRoZW1lICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHRoZW1lKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUaGVtZVByb3ZpZGVyXSBQbGVhc2UgbWFrZSB5b3VyIHRoZW1lIHByb3AgYSBwbGFpbiBvYmplY3QnKTtcbiAgfVxuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgb3V0ZXJUaGVtZSwgdGhlbWUpO1xufTtcblxudmFyIGNyZWF0ZUNhY2hlV2l0aFRoZW1lID0gLyogI19fUFVSRV9fICovd2Vha01lbW9pemUoZnVuY3Rpb24gKG91dGVyVGhlbWUpIHtcbiAgcmV0dXJuIHdlYWtNZW1vaXplKGZ1bmN0aW9uICh0aGVtZSkge1xuICAgIHJldHVybiBnZXRUaGVtZShvdXRlclRoZW1lLCB0aGVtZSk7XG4gIH0pO1xufSk7XG52YXIgVGhlbWVQcm92aWRlciA9IGZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcbiAgdmFyIHRoZW1lID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xuXG4gIGlmIChwcm9wcy50aGVtZSAhPT0gdGhlbWUpIHtcbiAgICB0aGVtZSA9IGNyZWF0ZUNhY2hlV2l0aFRoZW1lKHRoZW1lKShwcm9wcy50aGVtZSk7XG4gIH1cblxuICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoVGhlbWVDb250ZXh0LlByb3ZpZGVyLCB7XG4gICAgdmFsdWU6IHRoZW1lXG4gIH0sIHByb3BzLmNoaWxkcmVuKTtcbn07XG5mdW5jdGlvbiB3aXRoVGhlbWUoQ29tcG9uZW50KSB7XG4gIHZhciBjb21wb25lbnROYW1lID0gQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xuXG4gIHZhciByZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIocHJvcHMsIHJlZikge1xuICAgIHZhciB0aGVtZSA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbiAgICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCBfZXh0ZW5kcyh7XG4gICAgICB0aGVtZTogdGhlbWUsXG4gICAgICByZWY6IHJlZlxuICAgIH0sIHByb3BzKSk7XG4gIH07IC8vICRGbG93Rml4TWVcblxuXG4gIHZhciBXaXRoVGhlbWUgPSAvKiNfX1BVUkVfXyovZm9yd2FyZFJlZihyZW5kZXIpO1xuICBXaXRoVGhlbWUuZGlzcGxheU5hbWUgPSBcIldpdGhUaGVtZShcIiArIGNvbXBvbmVudE5hbWUgKyBcIilcIjtcbiAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKFdpdGhUaGVtZSwgQ29tcG9uZW50KTtcbn1cblxuLy8gdGh1cyB3ZSBvbmx5IG5lZWQgdG8gcmVwbGFjZSB3aGF0IGlzIGEgdmFsaWQgY2hhcmFjdGVyIGZvciBKUywgYnV0IG5vdCBmb3IgQ1NTXG5cbnZhciBzYW5pdGl6ZUlkZW50aWZpZXIgPSBmdW5jdGlvbiBzYW5pdGl6ZUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICByZXR1cm4gaWRlbnRpZmllci5yZXBsYWNlKC9cXCQvZywgJy0nKTtcbn07XG5cbnZhciB0eXBlUHJvcE5hbWUgPSAnX19FTU9USU9OX1RZUEVfUExFQVNFX0RPX05PVF9VU0VfXyc7XG52YXIgbGFiZWxQcm9wTmFtZSA9ICdfX0VNT1RJT05fTEFCRUxfUExFQVNFX0RPX05PVF9VU0VfXyc7XG52YXIgY3JlYXRlRW1vdGlvblByb3BzID0gZnVuY3Rpb24gY3JlYXRlRW1vdGlvblByb3BzKHR5cGUsIHByb3BzKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBwcm9wcy5jc3MgPT09ICdzdHJpbmcnICYmIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGEgY3NzIGRlY2xhcmF0aW9uXG4gIHByb3BzLmNzcy5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3RyaW5ncyBhcmUgbm90IGFsbG93ZWQgYXMgY3NzIHByb3AgdmFsdWVzLCBwbGVhc2Ugd3JhcCBpdCBpbiBhIGNzcyB0ZW1wbGF0ZSBsaXRlcmFsIGZyb20gJ0BlbW90aW9uL3JlYWN0JyBsaWtlIHRoaXM6IGNzc2BcIiArIHByb3BzLmNzcyArIFwiYFwiKTtcbiAgfVxuXG4gIHZhciBuZXdQcm9wcyA9IHt9O1xuXG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCBrZXkpKSB7XG4gICAgICBuZXdQcm9wc1trZXldID0gcHJvcHNba2V5XTtcbiAgICB9XG4gIH1cblxuICBuZXdQcm9wc1t0eXBlUHJvcE5hbWVdID0gdHlwZTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcigpO1xuXG4gICAgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAvLyBjaHJvbWVcbiAgICAgIHZhciBtYXRjaCA9IGVycm9yLnN0YWNrLm1hdGNoKC9hdCAoPzpPYmplY3RcXC58TW9kdWxlXFwufCkoPzpqc3h8Y3JlYXRlRW1vdGlvblByb3BzKS4qXFxuXFxzK2F0ICg/Ok9iamVjdFxcLnwpKFtBLVpdW0EtWmEtejAtOSRdKykgLyk7XG5cbiAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgLy8gc2FmYXJpIGFuZCBmaXJlZm94XG4gICAgICAgIG1hdGNoID0gZXJyb3Iuc3RhY2subWF0Y2goLy4qXFxuKFtBLVpdW0EtWmEtejAtOSRdKylALyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBuZXdQcm9wc1tsYWJlbFByb3BOYW1lXSA9IHNhbml0aXplSWRlbnRpZmllcihtYXRjaFsxXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld1Byb3BzO1xufTtcbnZhciBFbW90aW9uID0gLyogI19fUFVSRV9fICovd2l0aEVtb3Rpb25DYWNoZShmdW5jdGlvbiAocHJvcHMsIGNhY2hlLCByZWYpIHtcbiAgdmFyIGNzc1Byb3AgPSBwcm9wcy5jc3M7IC8vIHNvIHRoYXQgdXNpbmcgYGNzc2AgZnJvbSBgZW1vdGlvbmAgYW5kIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgY3NzIHByb3Agd29ya3NcbiAgLy8gbm90IHBhc3NpbmcgdGhlIHJlZ2lzdGVyZWQgY2FjaGUgdG8gc2VyaWFsaXplU3R5bGVzIGJlY2F1c2UgaXQgd291bGRcbiAgLy8gbWFrZSBjZXJ0YWluIGJhYmVsIG9wdGltaXNhdGlvbnMgbm90IHBvc3NpYmxlXG5cbiAgaWYgKHR5cGVvZiBjc3NQcm9wID09PSAnc3RyaW5nJyAmJiBjYWNoZS5yZWdpc3RlcmVkW2Nzc1Byb3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICBjc3NQcm9wID0gY2FjaGUucmVnaXN0ZXJlZFtjc3NQcm9wXTtcbiAgfVxuXG4gIHZhciB0eXBlID0gcHJvcHNbdHlwZVByb3BOYW1lXTtcbiAgdmFyIHJlZ2lzdGVyZWRTdHlsZXMgPSBbY3NzUHJvcF07XG4gIHZhciBjbGFzc05hbWUgPSAnJztcblxuICBpZiAodHlwZW9mIHByb3BzLmNsYXNzTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjbGFzc05hbWUgPSBnZXRSZWdpc3RlcmVkU3R5bGVzKGNhY2hlLnJlZ2lzdGVyZWQsIHJlZ2lzdGVyZWRTdHlsZXMsIHByb3BzLmNsYXNzTmFtZSk7XG4gIH0gZWxzZSBpZiAocHJvcHMuY2xhc3NOYW1lICE9IG51bGwpIHtcbiAgICBjbGFzc05hbWUgPSBwcm9wcy5jbGFzc05hbWUgKyBcIiBcIjtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkID0gc2VyaWFsaXplU3R5bGVzKHJlZ2lzdGVyZWRTdHlsZXMsIHVuZGVmaW5lZCwgdHlwZW9mIGNzc1Byb3AgPT09ICdmdW5jdGlvbicgfHwgQXJyYXkuaXNBcnJheShjc3NQcm9wKSA/IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KSA6IHVuZGVmaW5lZCk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgc2VyaWFsaXplZC5uYW1lLmluZGV4T2YoJy0nKSA9PT0gLTEpIHtcbiAgICB2YXIgbGFiZWxGcm9tU3RhY2sgPSBwcm9wc1tsYWJlbFByb3BOYW1lXTtcblxuICAgIGlmIChsYWJlbEZyb21TdGFjaykge1xuICAgICAgc2VyaWFsaXplZCA9IHNlcmlhbGl6ZVN0eWxlcyhbc2VyaWFsaXplZCwgJ2xhYmVsOicgKyBsYWJlbEZyb21TdGFjayArICc7J10pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBydWxlcyA9IGluc2VydFN0eWxlcyhjYWNoZSwgc2VyaWFsaXplZCwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKTtcbiAgY2xhc3NOYW1lICs9IGNhY2hlLmtleSArIFwiLVwiICsgc2VyaWFsaXplZC5uYW1lO1xuICB2YXIgbmV3UHJvcHMgPSB7fTtcblxuICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChwcm9wcywga2V5KSAmJiBrZXkgIT09ICdjc3MnICYmIGtleSAhPT0gdHlwZVByb3BOYW1lICYmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nIHx8IGtleSAhPT0gbGFiZWxQcm9wTmFtZSkpIHtcbiAgICAgIG5ld1Byb3BzW2tleV0gPSBwcm9wc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIG5ld1Byb3BzLnJlZiA9IHJlZjtcbiAgbmV3UHJvcHMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICB2YXIgZWxlID0gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQodHlwZSwgbmV3UHJvcHMpO1xuXG4gIHJldHVybiBlbGU7XG59KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgRW1vdGlvbi5kaXNwbGF5TmFtZSA9ICdFbW90aW9uQ3NzUHJvcEludGVybmFsJztcbn1cblxuZXhwb3J0IHsgQ2FjaGVQcm92aWRlciBhcyBDLCBFbW90aW9uIGFzIEUsIFRoZW1lQ29udGV4dCBhcyBULCBUaGVtZVByb3ZpZGVyIGFzIGEsIHdpdGhUaGVtZSBhcyBiLCBjcmVhdGVFbW90aW9uUHJvcHMgYXMgYywgaGFzT3duUHJvcGVydHkgYXMgaCwgdXNlVGhlbWUgYXMgdSwgd2l0aEVtb3Rpb25DYWNoZSBhcyB3IH07XG4iLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZXh0ZW5kcztcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJpbXBvcnQgeyBpc1N0cmluZywgb21pdCwgX19ERVZfXyB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5cbi8qKlxuICogQ2FyZWZ1bGx5IHNlbGVjdGVkIGh0bWwgZWxlbWVudHMgZm9yIGNoYWtyYSBjb21wb25lbnRzLlxuICogVGhpcyBpcyBtb3N0bHkgZm9yIGBjaGFrcmEuPGVsZW1lbnQ+YCBzeW50YXguXG4gKi9cbmV4cG9ydCB2YXIgZG9tRWxlbWVudHMgPSBbXCJhXCIsIFwiYlwiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImJsb2NrcXVvdGVcIiwgXCJidXR0b25cIiwgXCJjYXB0aW9uXCIsIFwiY2l0ZVwiLCBcImNpcmNsZVwiLCBcImNvZGVcIiwgXCJkZFwiLCBcImRpdlwiLCBcImRsXCIsIFwiZHRcIiwgXCJmaWVsZHNldFwiLCBcImZpZ2NhcHRpb25cIiwgXCJmaWd1cmVcIiwgXCJmb290ZXJcIiwgXCJmb3JtXCIsIFwiaDFcIiwgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcImg2XCIsIFwiaGVhZGVyXCIsIFwiaHJcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImtiZFwiLCBcImxhYmVsXCIsIFwibGlcIiwgXCJtYWluXCIsIFwibWFya1wiLCBcIm5hdlwiLCBcIm9sXCIsIFwicFwiLCBcInBhdGhcIiwgXCJwcmVcIiwgXCJxXCIsIFwicmVjdFwiLCBcInNcIiwgXCJzdmdcIiwgXCJzZWN0aW9uXCIsIFwic2VsZWN0XCIsIFwic3Ryb25nXCIsIFwic21hbGxcIiwgXCJzcGFuXCIsIFwic3ViXCIsIFwic3VwXCIsIFwidGFibGVcIiwgXCJ0Ym9keVwiLCBcInRkXCIsIFwidGV4dGFyZWFcIiwgXCJ0Zm9vdFwiLCBcInRoXCIsIFwidGhlYWRcIiwgXCJ0clwiLCBcInVsXCJdO1xuZXhwb3J0IGZ1bmN0aW9uIG9taXRUaGVtaW5nUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIG9taXQocHJvcHMsIFtcInN0eWxlQ29uZmlnXCIsIFwic2l6ZVwiLCBcInZhcmlhbnRcIiwgXCJjb2xvclNjaGVtZVwiXSk7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1RhZyh0YXJnZXQpIHtcbiAgcmV0dXJuIGlzU3RyaW5nKHRhcmdldCkgJiYgKF9fREVWX18gPyB0YXJnZXQuY2hhckF0KDApID09PSB0YXJnZXQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgOiB0cnVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXNwbGF5TmFtZShwcmltaXRpdmUpIHtcbiAgcmV0dXJuIGlzVGFnKHByaW1pdGl2ZSkgPyBcImNoYWtyYS5cIiArIHByaW1pdGl2ZSA6IGdldENvbXBvbmVudE5hbWUocHJpbWl0aXZlKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZShwcmltaXRpdmUpIHtcbiAgcmV0dXJuIChfX0RFVl9fID8gaXNTdHJpbmcocHJpbWl0aXZlKSAmJiBwcmltaXRpdmUgOiBmYWxzZSkgfHwgIWlzU3RyaW5nKHByaW1pdGl2ZSkgJiYgcHJpbWl0aXZlLmRpc3BsYXlOYW1lIHx8ICFpc1N0cmluZyhwcmltaXRpdmUpICYmIHByaW1pdGl2ZS5uYW1lIHx8IFwiQ2hha3JhQ29tcG9uZW50XCI7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW0udXRpbHMuanMubWFwIiwiaW1wb3J0IG1lbW9pemUgZnJvbSAnQGVtb3Rpb24vbWVtb2l6ZSc7XG5cbnZhciByZWFjdFByb3BzUmVnZXggPSAvXigoY2hpbGRyZW58ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUx8a2V5fHJlZnxhdXRvRm9jdXN8ZGVmYXVsdFZhbHVlfGRlZmF1bHRDaGVja2VkfGlubmVySFRNTHxzdXBwcmVzc0NvbnRlbnRFZGl0YWJsZVdhcm5pbmd8c3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nfHZhbHVlTGlua3xhY2NlcHR8YWNjZXB0Q2hhcnNldHxhY2Nlc3NLZXl8YWN0aW9ufGFsbG93fGFsbG93VXNlck1lZGlhfGFsbG93UGF5bWVudFJlcXVlc3R8YWxsb3dGdWxsU2NyZWVufGFsbG93VHJhbnNwYXJlbmN5fGFsdHxhc3luY3xhdXRvQ29tcGxldGV8YXV0b1BsYXl8Y2FwdHVyZXxjZWxsUGFkZGluZ3xjZWxsU3BhY2luZ3xjaGFsbGVuZ2V8Y2hhclNldHxjaGVja2VkfGNpdGV8Y2xhc3NJRHxjbGFzc05hbWV8Y29sc3xjb2xTcGFufGNvbnRlbnR8Y29udGVudEVkaXRhYmxlfGNvbnRleHRNZW51fGNvbnRyb2xzfGNvbnRyb2xzTGlzdHxjb29yZHN8Y3Jvc3NPcmlnaW58ZGF0YXxkYXRlVGltZXxkZWNvZGluZ3xkZWZhdWx0fGRlZmVyfGRpcnxkaXNhYmxlZHxkaXNhYmxlUGljdHVyZUluUGljdHVyZXxkb3dubG9hZHxkcmFnZ2FibGV8ZW5jVHlwZXxmb3JtfGZvcm1BY3Rpb258Zm9ybUVuY1R5cGV8Zm9ybU1ldGhvZHxmb3JtTm9WYWxpZGF0ZXxmb3JtVGFyZ2V0fGZyYW1lQm9yZGVyfGhlYWRlcnN8aGVpZ2h0fGhpZGRlbnxoaWdofGhyZWZ8aHJlZkxhbmd8aHRtbEZvcnxodHRwRXF1aXZ8aWR8aW5wdXRNb2RlfGludGVncml0eXxpc3xrZXlQYXJhbXN8a2V5VHlwZXxraW5kfGxhYmVsfGxhbmd8bGlzdHxsb2FkaW5nfGxvb3B8bG93fG1hcmdpbkhlaWdodHxtYXJnaW5XaWR0aHxtYXh8bWF4TGVuZ3RofG1lZGlhfG1lZGlhR3JvdXB8bWV0aG9kfG1pbnxtaW5MZW5ndGh8bXVsdGlwbGV8bXV0ZWR8bmFtZXxub25jZXxub1ZhbGlkYXRlfG9wZW58b3B0aW11bXxwYXR0ZXJufHBsYWNlaG9sZGVyfHBsYXlzSW5saW5lfHBvc3RlcnxwcmVsb2FkfHByb2ZpbGV8cmFkaW9Hcm91cHxyZWFkT25seXxyZWZlcnJlclBvbGljeXxyZWx8cmVxdWlyZWR8cmV2ZXJzZWR8cm9sZXxyb3dzfHJvd1NwYW58c2FuZGJveHxzY29wZXxzY29wZWR8c2Nyb2xsaW5nfHNlYW1sZXNzfHNlbGVjdGVkfHNoYXBlfHNpemV8c2l6ZXN8c2xvdHxzcGFufHNwZWxsQ2hlY2t8c3JjfHNyY0RvY3xzcmNMYW5nfHNyY1NldHxzdGFydHxzdGVwfHN0eWxlfHN1bW1hcnl8dGFiSW5kZXh8dGFyZ2V0fHRpdGxlfHRyYW5zbGF0ZXx0eXBlfHVzZU1hcHx2YWx1ZXx3aWR0aHx3bW9kZXx3cmFwfGFib3V0fGRhdGF0eXBlfGlubGlzdHxwcmVmaXh8cHJvcGVydHl8cmVzb3VyY2V8dHlwZW9mfHZvY2FifGF1dG9DYXBpdGFsaXplfGF1dG9Db3JyZWN0fGF1dG9TYXZlfGNvbG9yfGZhbGxiYWNrfGluZXJ0fGl0ZW1Qcm9wfGl0ZW1TY29wZXxpdGVtVHlwZXxpdGVtSUR8aXRlbVJlZnxvbnxvcHRpb258cmVzdWx0c3xzZWN1cml0eXx1bnNlbGVjdGFibGV8YWNjZW50SGVpZ2h0fGFjY3VtdWxhdGV8YWRkaXRpdmV8YWxpZ25tZW50QmFzZWxpbmV8YWxsb3dSZW9yZGVyfGFscGhhYmV0aWN8YW1wbGl0dWRlfGFyYWJpY0Zvcm18YXNjZW50fGF0dHJpYnV0ZU5hbWV8YXR0cmlidXRlVHlwZXxhdXRvUmV2ZXJzZXxhemltdXRofGJhc2VGcmVxdWVuY3l8YmFzZWxpbmVTaGlmdHxiYXNlUHJvZmlsZXxiYm94fGJlZ2lufGJpYXN8Ynl8Y2FsY01vZGV8Y2FwSGVpZ2h0fGNsaXB8Y2xpcFBhdGhVbml0c3xjbGlwUGF0aHxjbGlwUnVsZXxjb2xvckludGVycG9sYXRpb258Y29sb3JJbnRlcnBvbGF0aW9uRmlsdGVyc3xjb2xvclByb2ZpbGV8Y29sb3JSZW5kZXJpbmd8Y29udGVudFNjcmlwdFR5cGV8Y29udGVudFN0eWxlVHlwZXxjdXJzb3J8Y3h8Y3l8ZHxkZWNlbGVyYXRlfGRlc2NlbnR8ZGlmZnVzZUNvbnN0YW50fGRpcmVjdGlvbnxkaXNwbGF5fGRpdmlzb3J8ZG9taW5hbnRCYXNlbGluZXxkdXJ8ZHh8ZHl8ZWRnZU1vZGV8ZWxldmF0aW9ufGVuYWJsZUJhY2tncm91bmR8ZW5kfGV4cG9uZW50fGV4dGVybmFsUmVzb3VyY2VzUmVxdWlyZWR8ZmlsbHxmaWxsT3BhY2l0eXxmaWxsUnVsZXxmaWx0ZXJ8ZmlsdGVyUmVzfGZpbHRlclVuaXRzfGZsb29kQ29sb3J8Zmxvb2RPcGFjaXR5fGZvY3VzYWJsZXxmb250RmFtaWx5fGZvbnRTaXplfGZvbnRTaXplQWRqdXN0fGZvbnRTdHJldGNofGZvbnRTdHlsZXxmb250VmFyaWFudHxmb250V2VpZ2h0fGZvcm1hdHxmcm9tfGZyfGZ4fGZ5fGcxfGcyfGdseXBoTmFtZXxnbHlwaE9yaWVudGF0aW9uSG9yaXpvbnRhbHxnbHlwaE9yaWVudGF0aW9uVmVydGljYWx8Z2x5cGhSZWZ8Z3JhZGllbnRUcmFuc2Zvcm18Z3JhZGllbnRVbml0c3xoYW5naW5nfGhvcml6QWR2WHxob3Jpek9yaWdpblh8aWRlb2dyYXBoaWN8aW1hZ2VSZW5kZXJpbmd8aW58aW4yfGludGVyY2VwdHxrfGsxfGsyfGszfGs0fGtlcm5lbE1hdHJpeHxrZXJuZWxVbml0TGVuZ3RofGtlcm5pbmd8a2V5UG9pbnRzfGtleVNwbGluZXN8a2V5VGltZXN8bGVuZ3RoQWRqdXN0fGxldHRlclNwYWNpbmd8bGlnaHRpbmdDb2xvcnxsaW1pdGluZ0NvbmVBbmdsZXxsb2NhbHxtYXJrZXJFbmR8bWFya2VyTWlkfG1hcmtlclN0YXJ0fG1hcmtlckhlaWdodHxtYXJrZXJVbml0c3xtYXJrZXJXaWR0aHxtYXNrfG1hc2tDb250ZW50VW5pdHN8bWFza1VuaXRzfG1hdGhlbWF0aWNhbHxtb2RlfG51bU9jdGF2ZXN8b2Zmc2V0fG9wYWNpdHl8b3BlcmF0b3J8b3JkZXJ8b3JpZW50fG9yaWVudGF0aW9ufG9yaWdpbnxvdmVyZmxvd3xvdmVybGluZVBvc2l0aW9ufG92ZXJsaW5lVGhpY2tuZXNzfHBhbm9zZTF8cGFpbnRPcmRlcnxwYXRoTGVuZ3RofHBhdHRlcm5Db250ZW50VW5pdHN8cGF0dGVyblRyYW5zZm9ybXxwYXR0ZXJuVW5pdHN8cG9pbnRlckV2ZW50c3xwb2ludHN8cG9pbnRzQXRYfHBvaW50c0F0WXxwb2ludHNBdFp8cHJlc2VydmVBbHBoYXxwcmVzZXJ2ZUFzcGVjdFJhdGlvfHByaW1pdGl2ZVVuaXRzfHJ8cmFkaXVzfHJlZlh8cmVmWXxyZW5kZXJpbmdJbnRlbnR8cmVwZWF0Q291bnR8cmVwZWF0RHVyfHJlcXVpcmVkRXh0ZW5zaW9uc3xyZXF1aXJlZEZlYXR1cmVzfHJlc3RhcnR8cmVzdWx0fHJvdGF0ZXxyeHxyeXxzY2FsZXxzZWVkfHNoYXBlUmVuZGVyaW5nfHNsb3BlfHNwYWNpbmd8c3BlY3VsYXJDb25zdGFudHxzcGVjdWxhckV4cG9uZW50fHNwZWVkfHNwcmVhZE1ldGhvZHxzdGFydE9mZnNldHxzdGREZXZpYXRpb258c3RlbWh8c3RlbXZ8c3RpdGNoVGlsZXN8c3RvcENvbG9yfHN0b3BPcGFjaXR5fHN0cmlrZXRocm91Z2hQb3NpdGlvbnxzdHJpa2V0aHJvdWdoVGhpY2tuZXNzfHN0cmluZ3xzdHJva2V8c3Ryb2tlRGFzaGFycmF5fHN0cm9rZURhc2hvZmZzZXR8c3Ryb2tlTGluZWNhcHxzdHJva2VMaW5lam9pbnxzdHJva2VNaXRlcmxpbWl0fHN0cm9rZU9wYWNpdHl8c3Ryb2tlV2lkdGh8c3VyZmFjZVNjYWxlfHN5c3RlbUxhbmd1YWdlfHRhYmxlVmFsdWVzfHRhcmdldFh8dGFyZ2V0WXx0ZXh0QW5jaG9yfHRleHREZWNvcmF0aW9ufHRleHRSZW5kZXJpbmd8dGV4dExlbmd0aHx0b3x0cmFuc2Zvcm18dTF8dTJ8dW5kZXJsaW5lUG9zaXRpb258dW5kZXJsaW5lVGhpY2tuZXNzfHVuaWNvZGV8dW5pY29kZUJpZGl8dW5pY29kZVJhbmdlfHVuaXRzUGVyRW18dkFscGhhYmV0aWN8dkhhbmdpbmd8dklkZW9ncmFwaGljfHZNYXRoZW1hdGljYWx8dmFsdWVzfHZlY3RvckVmZmVjdHx2ZXJzaW9ufHZlcnRBZHZZfHZlcnRPcmlnaW5YfHZlcnRPcmlnaW5ZfHZpZXdCb3h8dmlld1RhcmdldHx2aXNpYmlsaXR5fHdpZHRoc3x3b3JkU3BhY2luZ3x3cml0aW5nTW9kZXx4fHhIZWlnaHR8eDF8eDJ8eENoYW5uZWxTZWxlY3Rvcnx4bGlua0FjdHVhdGV8eGxpbmtBcmNyb2xlfHhsaW5rSHJlZnx4bGlua1JvbGV8eGxpbmtTaG93fHhsaW5rVGl0bGV8eGxpbmtUeXBlfHhtbEJhc2V8eG1sbnN8eG1sbnNYbGlua3x4bWxMYW5nfHhtbFNwYWNlfHl8eTF8eTJ8eUNoYW5uZWxTZWxlY3Rvcnx6fHpvb21BbmRQYW58Zm9yfGNsYXNzfGF1dG9mb2N1cyl8KChbRGRdW0FhXVtUdF1bQWFdfFtBYV1bUnJdW0lpXVtBYV18eCktLiopKSQvOyAvLyBodHRwczovL2VzYmVuY2guY29tL2JlbmNoLzViZmVlNjhhNGNkN2U2MDA5ZWY2MWQyM1xuXG52YXIgaXNQcm9wVmFsaWQgPSAvKiAjX19QVVJFX18gKi9tZW1vaXplKGZ1bmN0aW9uIChwcm9wKSB7XG4gIHJldHVybiByZWFjdFByb3BzUmVnZXgudGVzdChwcm9wKSB8fCBwcm9wLmNoYXJDb2RlQXQoMCkgPT09IDExMVxuICAvKiBvICovXG4gICYmIHByb3AuY2hhckNvZGVBdCgxKSA9PT0gMTEwXG4gIC8qIG4gKi9cbiAgJiYgcHJvcC5jaGFyQ29kZUF0KDIpIDwgOTE7XG59XG4vKiBaKzEgKi9cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGlzUHJvcFZhbGlkO1xuIiwiaW1wb3J0IF9leHRlbmRzIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgY3JlYXRlRWxlbWVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpc1Byb3BWYWxpZCBmcm9tICdAZW1vdGlvbi9pcy1wcm9wLXZhbGlkJztcbmltcG9ydCB7IHdpdGhFbW90aW9uQ2FjaGUsIFRoZW1lQ29udGV4dCB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IGdldFJlZ2lzdGVyZWRTdHlsZXMsIGluc2VydFN0eWxlcyB9IGZyb20gJ0BlbW90aW9uL3V0aWxzJztcbmltcG9ydCB7IHNlcmlhbGl6ZVN0eWxlcyB9IGZyb20gJ0BlbW90aW9uL3NlcmlhbGl6ZSc7XG5cbnZhciB0ZXN0T21pdFByb3BzT25TdHJpbmdUYWcgPSBpc1Byb3BWYWxpZDtcblxudmFyIHRlc3RPbWl0UHJvcHNPbkNvbXBvbmVudCA9IGZ1bmN0aW9uIHRlc3RPbWl0UHJvcHNPbkNvbXBvbmVudChrZXkpIHtcbiAgcmV0dXJuIGtleSAhPT0gJ3RoZW1lJztcbn07XG5cbnZhciBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AgPSBmdW5jdGlvbiBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AodGFnKSB7XG4gIHJldHVybiB0eXBlb2YgdGFnID09PSAnc3RyaW5nJyAmJiAvLyA5NiBpcyBvbmUgbGVzcyB0aGFuIHRoZSBjaGFyIGNvZGVcbiAgLy8gZm9yIFwiYVwiIHNvIHRoaXMgaXMgY2hlY2tpbmcgdGhhdFxuICAvLyBpdCdzIGEgbG93ZXJjYXNlIGNoYXJhY3RlclxuICB0YWcuY2hhckNvZGVBdCgwKSA+IDk2ID8gdGVzdE9taXRQcm9wc09uU3RyaW5nVGFnIDogdGVzdE9taXRQcm9wc09uQ29tcG9uZW50O1xufTtcbnZhciBjb21wb3NlU2hvdWxkRm9yd2FyZFByb3BzID0gZnVuY3Rpb24gY29tcG9zZVNob3VsZEZvcndhcmRQcm9wcyh0YWcsIG9wdGlvbnMsIGlzUmVhbCkge1xuICB2YXIgc2hvdWxkRm9yd2FyZFByb3A7XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wID0gb3B0aW9ucy5zaG91bGRGb3J3YXJkUHJvcDtcbiAgICBzaG91bGRGb3J3YXJkUHJvcCA9IHRhZy5fX2Vtb3Rpb25fZm9yd2FyZFByb3AgJiYgb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wID8gZnVuY3Rpb24gKHByb3BOYW1lKSB7XG4gICAgICByZXR1cm4gdGFnLl9fZW1vdGlvbl9mb3J3YXJkUHJvcChwcm9wTmFtZSkgJiYgb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wKHByb3BOYW1lKTtcbiAgICB9IDogb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzaG91bGRGb3J3YXJkUHJvcCAhPT0gJ2Z1bmN0aW9uJyAmJiBpc1JlYWwpIHtcbiAgICBzaG91bGRGb3J3YXJkUHJvcCA9IHRhZy5fX2Vtb3Rpb25fZm9yd2FyZFByb3A7XG4gIH1cblxuICByZXR1cm4gc2hvdWxkRm9yd2FyZFByb3A7XG59O1xuXG52YXIgSUxMRUdBTF9FU0NBUEVfU0VRVUVOQ0VfRVJST1IgPSBcIllvdSBoYXZlIGlsbGVnYWwgZXNjYXBlIHNlcXVlbmNlIGluIHlvdXIgdGVtcGxhdGUgbGl0ZXJhbCwgbW9zdCBsaWtlbHkgaW5zaWRlIGNvbnRlbnQncyBwcm9wZXJ0eSB2YWx1ZS5cXG5CZWNhdXNlIHlvdSB3cml0ZSB5b3VyIENTUyBpbnNpZGUgYSBKYXZhU2NyaXB0IHN0cmluZyB5b3UgYWN0dWFsbHkgaGF2ZSB0byBkbyBkb3VibGUgZXNjYXBpbmcsIHNvIGZvciBleGFtcGxlIFxcXCJjb250ZW50OiAnXFxcXDAwZDcnO1xcXCIgc2hvdWxkIGJlY29tZSBcXFwiY29udGVudDogJ1xcXFxcXFxcMDBkNyc7XFxcIi5cXG5Zb3UgY2FuIHJlYWQgbW9yZSBhYm91dCB0aGlzIGhlcmU6XFxuaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvVGVtcGxhdGVfbGl0ZXJhbHMjRVMyMDE4X3JldmlzaW9uX29mX2lsbGVnYWxfZXNjYXBlX3NlcXVlbmNlc1wiO1xuXG52YXIgY3JlYXRlU3R5bGVkID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVkKHRhZywgb3B0aW9ucykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmICh0YWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgYXJlIHRyeWluZyB0byBjcmVhdGUgYSBzdHlsZWQgZWxlbWVudCB3aXRoIGFuIHVuZGVmaW5lZCBjb21wb25lbnQuXFxuWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBpbXBvcnQgaXQuJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGlzUmVhbCA9IHRhZy5fX2Vtb3Rpb25fcmVhbCA9PT0gdGFnO1xuICB2YXIgYmFzZVRhZyA9IGlzUmVhbCAmJiB0YWcuX19lbW90aW9uX2Jhc2UgfHwgdGFnO1xuICB2YXIgaWRlbnRpZmllck5hbWU7XG4gIHZhciB0YXJnZXRDbGFzc05hbWU7XG5cbiAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgIGlkZW50aWZpZXJOYW1lID0gb3B0aW9ucy5sYWJlbDtcbiAgICB0YXJnZXRDbGFzc05hbWUgPSBvcHRpb25zLnRhcmdldDtcbiAgfVxuXG4gIHZhciBzaG91bGRGb3J3YXJkUHJvcCA9IGNvbXBvc2VTaG91bGRGb3J3YXJkUHJvcHModGFnLCBvcHRpb25zLCBpc1JlYWwpO1xuICB2YXIgZGVmYXVsdFNob3VsZEZvcndhcmRQcm9wID0gc2hvdWxkRm9yd2FyZFByb3AgfHwgZ2V0RGVmYXVsdFNob3VsZEZvcndhcmRQcm9wKGJhc2VUYWcpO1xuICB2YXIgc2hvdWxkVXNlQXMgPSAhZGVmYXVsdFNob3VsZEZvcndhcmRQcm9wKCdhcycpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdHlsZXMgPSBpc1JlYWwgJiYgdGFnLl9fZW1vdGlvbl9zdHlsZXMgIT09IHVuZGVmaW5lZCA/IHRhZy5fX2Vtb3Rpb25fc3R5bGVzLnNsaWNlKDApIDogW107XG5cbiAgICBpZiAoaWRlbnRpZmllck5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGVzLnB1c2goXCJsYWJlbDpcIiArIGlkZW50aWZpZXJOYW1lICsgXCI7XCIpO1xuICAgIH1cblxuICAgIGlmIChhcmdzWzBdID09IG51bGwgfHwgYXJnc1swXS5yYXcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGVzLnB1c2guYXBwbHkoc3R5bGVzLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgYXJnc1swXVswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoSUxMRUdBTF9FU0NBUEVfU0VRVUVOQ0VfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXMucHVzaChhcmdzWzBdWzBdKTtcbiAgICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgICAgIHZhciBpID0gMTtcblxuICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBhcmdzWzBdW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKElMTEVHQUxfRVNDQVBFX1NFUVVFTkNFX0VSUk9SKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0eWxlcy5wdXNoKGFyZ3NbaV0sIGFyZ3NbMF1baV0pO1xuICAgICAgfVxuICAgIH0gLy8gJEZsb3dGaXhNZTogd2UgbmVlZCB0byBjYXN0IFN0YXRlbGVzc0Z1bmN0aW9uYWxDb21wb25lbnQgdG8gb3VyIFByaXZhdGVTdHlsZWRDb21wb25lbnQgY2xhc3NcblxuXG4gICAgdmFyIFN0eWxlZCA9IHdpdGhFbW90aW9uQ2FjaGUoZnVuY3Rpb24gKHByb3BzLCBjYWNoZSwgcmVmKSB7XG4gICAgICB2YXIgZmluYWxUYWcgPSBzaG91bGRVc2VBcyAmJiBwcm9wcy5hcyB8fCBiYXNlVGFnO1xuICAgICAgdmFyIGNsYXNzTmFtZSA9ICcnO1xuICAgICAgdmFyIGNsYXNzSW50ZXJwb2xhdGlvbnMgPSBbXTtcbiAgICAgIHZhciBtZXJnZWRQcm9wcyA9IHByb3BzO1xuXG4gICAgICBpZiAocHJvcHMudGhlbWUgPT0gbnVsbCkge1xuICAgICAgICBtZXJnZWRQcm9wcyA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgICAgIG1lcmdlZFByb3BzW2tleV0gPSBwcm9wc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVyZ2VkUHJvcHMudGhlbWUgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcHJvcHMuY2xhc3NOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICBjbGFzc05hbWUgPSBnZXRSZWdpc3RlcmVkU3R5bGVzKGNhY2hlLnJlZ2lzdGVyZWQsIGNsYXNzSW50ZXJwb2xhdGlvbnMsIHByb3BzLmNsYXNzTmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLmNsYXNzTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IHByb3BzLmNsYXNzTmFtZSArIFwiIFwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VyaWFsaXplZCA9IHNlcmlhbGl6ZVN0eWxlcyhzdHlsZXMuY29uY2F0KGNsYXNzSW50ZXJwb2xhdGlvbnMpLCBjYWNoZS5yZWdpc3RlcmVkLCBtZXJnZWRQcm9wcyk7XG4gICAgICB2YXIgcnVsZXMgPSBpbnNlcnRTdHlsZXMoY2FjaGUsIHNlcmlhbGl6ZWQsIHR5cGVvZiBmaW5hbFRhZyA9PT0gJ3N0cmluZycpO1xuICAgICAgY2xhc3NOYW1lICs9IGNhY2hlLmtleSArIFwiLVwiICsgc2VyaWFsaXplZC5uYW1lO1xuXG4gICAgICBpZiAodGFyZ2V0Q2xhc3NOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xhc3NOYW1lICs9IFwiIFwiICsgdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluYWxTaG91bGRGb3J3YXJkUHJvcCA9IHNob3VsZFVzZUFzICYmIHNob3VsZEZvcndhcmRQcm9wID09PSB1bmRlZmluZWQgPyBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AoZmluYWxUYWcpIDogZGVmYXVsdFNob3VsZEZvcndhcmRQcm9wO1xuICAgICAgdmFyIG5ld1Byb3BzID0ge307XG5cbiAgICAgIGZvciAodmFyIF9rZXkgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKHNob3VsZFVzZUFzICYmIF9rZXkgPT09ICdhcycpIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmICggLy8gJEZsb3dGaXhNZVxuICAgICAgICBmaW5hbFNob3VsZEZvcndhcmRQcm9wKF9rZXkpKSB7XG4gICAgICAgICAgbmV3UHJvcHNbX2tleV0gPSBwcm9wc1tfa2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuZXdQcm9wcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICBuZXdQcm9wcy5yZWYgPSByZWY7XG4gICAgICB2YXIgZWxlID0gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoZmluYWxUYWcsIG5ld1Byb3BzKTtcblxuICAgICAgcmV0dXJuIGVsZTtcbiAgICB9KTtcbiAgICBTdHlsZWQuZGlzcGxheU5hbWUgPSBpZGVudGlmaWVyTmFtZSAhPT0gdW5kZWZpbmVkID8gaWRlbnRpZmllck5hbWUgOiBcIlN0eWxlZChcIiArICh0eXBlb2YgYmFzZVRhZyA9PT0gJ3N0cmluZycgPyBiYXNlVGFnIDogYmFzZVRhZy5kaXNwbGF5TmFtZSB8fCBiYXNlVGFnLm5hbWUgfHwgJ0NvbXBvbmVudCcpICsgXCIpXCI7XG4gICAgU3R5bGVkLmRlZmF1bHRQcm9wcyA9IHRhZy5kZWZhdWx0UHJvcHM7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9yZWFsID0gU3R5bGVkO1xuICAgIFN0eWxlZC5fX2Vtb3Rpb25fYmFzZSA9IGJhc2VUYWc7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9zdHlsZXMgPSBzdHlsZXM7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9mb3J3YXJkUHJvcCA9IHNob3VsZEZvcndhcmRQcm9wO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHlsZWQsICd0b1N0cmluZycsIHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgaWYgKHRhcmdldENsYXNzTmFtZSA9PT0gdW5kZWZpbmVkICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gJ05PX0NPTVBPTkVOVF9TRUxFQ1RPUic7XG4gICAgICAgIH0gLy8gJEZsb3dGaXhNZTogY29lcmNlIHVuZGVmaW5lZCB0byBzdHJpbmdcblxuXG4gICAgICAgIHJldHVybiBcIi5cIiArIHRhcmdldENsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFN0eWxlZC53aXRoQ29tcG9uZW50ID0gZnVuY3Rpb24gKG5leHRUYWcsIG5leHRPcHRpb25zKSB7XG4gICAgICByZXR1cm4gY3JlYXRlU3R5bGVkKG5leHRUYWcsIF9leHRlbmRzKHt9LCBvcHRpb25zLCBuZXh0T3B0aW9ucywge1xuICAgICAgICBzaG91bGRGb3J3YXJkUHJvcDogY29tcG9zZVNob3VsZEZvcndhcmRQcm9wcyhTdHlsZWQsIG5leHRPcHRpb25zLCB0cnVlKVxuICAgICAgfSkpLmFwcGx5KHZvaWQgMCwgc3R5bGVzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFN0eWxlZDtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVN0eWxlZDtcbiIsImltcG9ydCAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzJztcbmltcG9ydCAncmVhY3QnO1xuaW1wb3J0ICdAZW1vdGlvbi9pcy1wcm9wLXZhbGlkJztcbmltcG9ydCBjcmVhdGVTdHlsZWQgZnJvbSAnLi4vYmFzZS9kaXN0L2Vtb3Rpb24tc3R5bGVkLWJhc2UuYnJvd3Nlci5lc20uanMnO1xuaW1wb3J0ICdAZW1vdGlvbi9yZWFjdCc7XG5pbXBvcnQgJ0BlbW90aW9uL3V0aWxzJztcbmltcG9ydCAnQGVtb3Rpb24vc2VyaWFsaXplJztcblxudmFyIHRhZ3MgPSBbJ2EnLCAnYWJicicsICdhZGRyZXNzJywgJ2FyZWEnLCAnYXJ0aWNsZScsICdhc2lkZScsICdhdWRpbycsICdiJywgJ2Jhc2UnLCAnYmRpJywgJ2JkbycsICdiaWcnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2JyJywgJ2J1dHRvbicsICdjYW52YXMnLCAnY2FwdGlvbicsICdjaXRlJywgJ2NvZGUnLCAnY29sJywgJ2NvbGdyb3VwJywgJ2RhdGEnLCAnZGF0YWxpc3QnLCAnZGQnLCAnZGVsJywgJ2RldGFpbHMnLCAnZGZuJywgJ2RpYWxvZycsICdkaXYnLCAnZGwnLCAnZHQnLCAnZW0nLCAnZW1iZWQnLCAnZmllbGRzZXQnLCAnZmlnY2FwdGlvbicsICdmaWd1cmUnLCAnZm9vdGVyJywgJ2Zvcm0nLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZCcsICdoZWFkZXInLCAnaGdyb3VwJywgJ2hyJywgJ2h0bWwnLCAnaScsICdpZnJhbWUnLCAnaW1nJywgJ2lucHV0JywgJ2lucycsICdrYmQnLCAna2V5Z2VuJywgJ2xhYmVsJywgJ2xlZ2VuZCcsICdsaScsICdsaW5rJywgJ21haW4nLCAnbWFwJywgJ21hcmsnLCAnbWFycXVlZScsICdtZW51JywgJ21lbnVpdGVtJywgJ21ldGEnLCAnbWV0ZXInLCAnbmF2JywgJ25vc2NyaXB0JywgJ29iamVjdCcsICdvbCcsICdvcHRncm91cCcsICdvcHRpb24nLCAnb3V0cHV0JywgJ3AnLCAncGFyYW0nLCAncGljdHVyZScsICdwcmUnLCAncHJvZ3Jlc3MnLCAncScsICdycCcsICdydCcsICdydWJ5JywgJ3MnLCAnc2FtcCcsICdzY3JpcHQnLCAnc2VjdGlvbicsICdzZWxlY3QnLCAnc21hbGwnLCAnc291cmNlJywgJ3NwYW4nLCAnc3Ryb25nJywgJ3N0eWxlJywgJ3N1YicsICdzdW1tYXJ5JywgJ3N1cCcsICd0YWJsZScsICd0Ym9keScsICd0ZCcsICd0ZXh0YXJlYScsICd0Zm9vdCcsICd0aCcsICd0aGVhZCcsICd0aW1lJywgJ3RpdGxlJywgJ3RyJywgJ3RyYWNrJywgJ3UnLCAndWwnLCAndmFyJywgJ3ZpZGVvJywgJ3dicicsIC8vIFNWR1xuJ2NpcmNsZScsICdjbGlwUGF0aCcsICdkZWZzJywgJ2VsbGlwc2UnLCAnZm9yZWlnbk9iamVjdCcsICdnJywgJ2ltYWdlJywgJ2xpbmUnLCAnbGluZWFyR3JhZGllbnQnLCAnbWFzaycsICdwYXRoJywgJ3BhdHRlcm4nLCAncG9seWdvbicsICdwb2x5bGluZScsICdyYWRpYWxHcmFkaWVudCcsICdyZWN0JywgJ3N0b3AnLCAnc3ZnJywgJ3RleHQnLCAndHNwYW4nXTtcblxudmFyIG5ld1N0eWxlZCA9IGNyZWF0ZVN0eWxlZC5iaW5kKCk7XG50YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgLy8gJEZsb3dGaXhNZTogd2UgY2FuIGlnbm9yZSB0aGlzIGJlY2F1c2UgaXRzIGV4cG9zZWQgdHlwZSBpcyBkZWZpbmVkIGJ5IHRoZSBDcmVhdGVTdHlsZWQgdHlwZVxuICBuZXdTdHlsZWRbdGFnTmFtZV0gPSBuZXdTdHlsZWQodGFnTmFtZSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbmV3U3R5bGVkO1xuIiwiaW1wb3J0IHsgcHJvcE5hbWVzIH0gZnJvbSBcIkBjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbVwiO1xuLyoqXG4gKiBMaXN0IG9mIHByb3BzIGZvciBlbW90aW9uIHRvIG9taXQgZnJvbSBET00uXG4gKiBJdCBtb3N0bHkgY29uc2lzdHMgb2YgQ2hha3JhIHByb3BzXG4gKi9cblxudmFyIGFsbFByb3BOYW1lcyA9IG5ldyBTZXQoWy4uLnByb3BOYW1lcywgXCJ0ZXh0U3R5bGVcIiwgXCJsYXllclN0eWxlXCIsIFwiYXBwbHlcIiwgXCJpc1RydW5jYXRlZFwiLCBcIm5vT2ZMaW5lc1wiLCBcImZvY3VzQm9yZGVyQ29sb3JcIiwgXCJlcnJvckJvcmRlckNvbG9yXCIsIFwiYXNcIiwgXCJfX2Nzc1wiLCBcImNzc1wiLCBcInN4XCJdKTtcbi8qKlxuICogaHRtbFdpZHRoIGFuZCBodG1sSGVpZ2h0IGlzIHVzZWQgaW4gdGhlIDxJbWFnZSAvPlxuICogY29tcG9uZW50IHRvIHN1cHBvcnQgdGhlIG5hdGl2ZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBhdHRyaWJ1dGVzXG4gKlxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoYWtyYS11aS9jaGFrcmEtdWkvaXNzdWVzLzE0OVxuICovXG5cbnZhciB2YWxpZEhUTUxQcm9wcyA9IG5ldyBTZXQoW1wiaHRtbFdpZHRoXCIsIFwiaHRtbEhlaWdodFwiLCBcImh0bWxTaXplXCJdKTtcbmV4cG9ydCB2YXIgc2hvdWxkRm9yd2FyZFByb3AgPSBwcm9wID0+IHZhbGlkSFRNTFByb3BzLmhhcyhwcm9wKSB8fCAhYWxsUHJvcE5hbWVzLmhhcyhwcm9wKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNob3VsZC1mb3J3YXJkLXByb3AuanMubWFwIiwiZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IHt9OyB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7IHZhciBrZXksIGk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZUtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5pbXBvcnQgeyBjc3MsIGlzU3R5bGVQcm9wIH0gZnJvbSBcIkBjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbVwiO1xuaW1wb3J0IHsgb2JqZWN0RmlsdGVyIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCBfc3R5bGVkIGZyb20gXCJAZW1vdGlvbi9zdHlsZWRcIjtcbmltcG9ydCB7IHNob3VsZEZvcndhcmRQcm9wIH0gZnJvbSBcIi4vc2hvdWxkLWZvcndhcmQtcHJvcFwiO1xuaW1wb3J0IHsgZG9tRWxlbWVudHMgfSBmcm9tIFwiLi9zeXN0ZW0udXRpbHNcIjtcblxuLyoqXG4gKiBTdHlsZSByZXNvbHZlciBmdW5jdGlvbiB0aGF0IG1hbmFnZXMgaG93IHN0eWxlIHByb3BzIGFyZSBtZXJnZWRcbiAqIGluIGNvbWJpbmF0aW9uIHdpdGggb3RoZXIgcG9zc2libGUgd2F5cyBvZiBkZWZpbmluZyBzdHlsZXMuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRha2UgYSBjb21wb25lbnQgZGVmaW5lZCB0aGlzIHdheTpcbiAqIGBgYGpzeFxuICogPEJveCBmb250U2l6ZT1cIjI0cHhcIiBzeD17eyBmb250U2l6ZTogXCI0MHB4XCIgfX0+PC9Cb3g+XG4gKiBgYGBcbiAqXG4gKiBXZSB3YW50IHRvIG1hbmFnZSB0aGUgcHJpb3JpdHkgb2YgdGhlIHN0eWxlcyBwcm9wZXJseSB0byBwcmV2ZW50IHVud2FudGVkXG4gKiBiZWhhdmlvcnMuIFJpZ2h0IG5vdywgdGhlIGBzeGAgcHJvcCBoYXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgc28gdGhlIHJlc29sdmVkXG4gKiBmb250U2l6ZSB3aWxsIGJlIGA0MHB4YFxuICovXG5leHBvcnQgdmFyIHRvQ1NTT2JqZWN0ID0gKF9yZWYpID0+IHtcbiAgdmFyIHtcbiAgICBiYXNlU3R5bGVcbiAgfSA9IF9yZWY7XG4gIHJldHVybiBwcm9wcyA9PiB7XG4gICAgdmFyIHtcbiAgICAgIGNzczogY3NzUHJvcCxcbiAgICAgIF9fY3NzLFxuICAgICAgc3hcbiAgICB9ID0gcHJvcHMsXG4gICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShwcm9wcywgW1widGhlbWVcIiwgXCJjc3NcIiwgXCJfX2Nzc1wiLCBcInN4XCJdKTtcblxuICAgIHZhciBzdHlsZVByb3BzID0gb2JqZWN0RmlsdGVyKHJlc3QsIChfLCBwcm9wKSA9PiBpc1N0eWxlUHJvcChwcm9wKSk7XG4gICAgdmFyIGZpbmFsU3R5bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgX19jc3MsIGJhc2VTdHlsZSwgc3R5bGVQcm9wcywgc3gpO1xuICAgIHZhciBjb21wdXRlZENTUyA9IGNzcyhmaW5hbFN0eWxlcykocHJvcHMudGhlbWUpO1xuICAgIHJldHVybiBjc3NQcm9wID8gW2NvbXB1dGVkQ1NTLCBjc3NQcm9wXSA6IGNvbXB1dGVkQ1NTO1xuICB9O1xufTtcbmV4cG9ydCBmdW5jdGlvbiBzdHlsZWQoY29tcG9uZW50LCBvcHRpb25zKSB7XG4gIHZhciBfcmVmMiA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fSxcbiAgICAgIHtcbiAgICBiYXNlU3R5bGVcbiAgfSA9IF9yZWYyLFxuICAgICAgc3R5bGVkT3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYyLCBbXCJiYXNlU3R5bGVcIl0pO1xuXG4gIGlmICghc3R5bGVkT3B0aW9ucy5zaG91bGRGb3J3YXJkUHJvcCkge1xuICAgIHN0eWxlZE9wdGlvbnMuc2hvdWxkRm9yd2FyZFByb3AgPSBzaG91bGRGb3J3YXJkUHJvcDtcbiAgfVxuXG4gIHZhciBzdHlsZU9iamVjdCA9IHRvQ1NTT2JqZWN0KHtcbiAgICBiYXNlU3R5bGVcbiAgfSk7XG4gIHJldHVybiBfc3R5bGVkKGNvbXBvbmVudCwgc3R5bGVkT3B0aW9ucykoc3R5bGVPYmplY3QpO1xufVxuZXhwb3J0IHZhciBjaGFrcmEgPSBzdHlsZWQ7XG5kb21FbGVtZW50cy5mb3JFYWNoKHRhZyA9PiB7XG4gIGNoYWtyYVt0YWddID0gY2hha3JhKHRhZyk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbS5qcy5tYXAiLCIvKipcbiAqIEFsbCBjcmVkaXQgZ29lcyB0byBDaGFuY2UgKFJlYWNoIFVJKSwgSGF6IChSZWFraXQpIGFuZCAoZmx1ZW50dWkpXG4gKiBmb3IgY3JlYXRpbmcgdGhlIGJhc2UgdHlwZSBkZWZpbml0aW9ucyB1cG9uIHdoaWNoIHdlIGltcHJvdmVkIG9uXG4gKi9cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmRSZWYoY29tcG9uZW50KSB7XG4gIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuZm9yd2FyZFJlZihjb21wb25lbnQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9yd2FyZC1yZWYuanMubWFwIiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IHt9OyB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7IHZhciBrZXksIGk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZUtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5pbXBvcnQgeyBjaGFrcmEsIGZvcndhcmRSZWYgfSBmcm9tIFwiQGNoYWtyYS11aS9zeXN0ZW1cIjtcbmltcG9ydCB7IGN4LCBfX0RFVl9fIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xudmFyIGZhbGxiYWNrSWNvbiA9IHtcbiAgcGF0aDogLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIHtcbiAgICBzdHJva2U6IFwiY3VycmVudENvbG9yXCIsXG4gICAgc3Ryb2tlV2lkdGg6IFwiMS41XCJcbiAgfSwgLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwYXRoXCIsIHtcbiAgICBzdHJva2VMaW5lY2FwOiBcInJvdW5kXCIsXG4gICAgZmlsbDogXCJub25lXCIsXG4gICAgZDogXCJNOSw5YTMsMywwLDEsMSw0LDIuODI5LDEuNSwxLjUsMCwwLDAtMSwxLjQxNVYxNC4yNVwiXG4gIH0pLCAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChcInBhdGhcIiwge1xuICAgIGZpbGw6IFwiY3VycmVudENvbG9yXCIsXG4gICAgc3Ryb2tlTGluZWNhcDogXCJyb3VuZFwiLFxuICAgIGQ6IFwiTTEyLDE3LjI1YS4zNzUuMzc1LDAsMSwwLC4zNzUuMzc1QS4zNzUuMzc1LDAsMCwwLDEyLDE3LjI1aDBcIlxuICB9KSwgLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjaXJjbGVcIiwge1xuICAgIGZpbGw6IFwibm9uZVwiLFxuICAgIHN0cm9rZU1pdGVybGltaXQ6IFwiMTBcIixcbiAgICBjeDogXCIxMlwiLFxuICAgIGN5OiBcIjEyXCIsXG4gICAgcjogXCIxMS4yNVwiXG4gIH0pKSxcbiAgdmlld0JveDogXCIwIDAgMjQgMjRcIlxufTtcbmV4cG9ydCB2YXIgSWNvbiA9IC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKChwcm9wcywgcmVmKSA9PiB7XG4gIHZhciB7XG4gICAgYXM6IGVsZW1lbnQsXG4gICAgdmlld0JveCxcbiAgICBjb2xvciA9IFwiY3VycmVudENvbG9yXCIsXG4gICAgZm9jdXNhYmxlID0gZmFsc2UsXG4gICAgY2hpbGRyZW4sXG4gICAgY2xhc3NOYW1lLFxuICAgIF9fY3NzXG4gIH0gPSBwcm9wcyxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShwcm9wcywgW1wiYXNcIiwgXCJ2aWV3Qm94XCIsIFwiY29sb3JcIiwgXCJmb2N1c2FibGVcIiwgXCJjaGlsZHJlblwiLCBcImNsYXNzTmFtZVwiLCBcIl9fY3NzXCJdKTtcblxuICB2YXIgX2NsYXNzTmFtZSA9IGN4KFwiY2hha3JhLWljb25cIiwgY2xhc3NOYW1lKTtcblxuICB2YXIgc3R5bGVzID0gX2V4dGVuZHMoe1xuICAgIHc6IFwiMWVtXCIsXG4gICAgaDogXCIxZW1cIixcbiAgICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxuICAgIGxpbmVIZWlnaHQ6IFwiMWVtXCIsXG4gICAgZmxleFNocmluazogMCxcbiAgICBjb2xvclxuICB9LCBfX2Nzcyk7XG5cbiAgdmFyIHNoYXJlZCA9IHtcbiAgICByZWYsXG4gICAgZm9jdXNhYmxlLFxuICAgIGNsYXNzTmFtZTogX2NsYXNzTmFtZSxcbiAgICBfX2Nzczogc3R5bGVzXG4gIH07XG5cbiAgdmFyIF92aWV3Qm94ID0gdmlld0JveCAhPSBudWxsID8gdmlld0JveCA6IGZhbGxiYWNrSWNvbi52aWV3Qm94O1xuICAvKipcbiAgICogSWYgeW91J3JlIHVzaW5nIGFuIGljb24gbGlicmFyeSBsaWtlIGByZWFjdC1pY29uc2AuXG4gICAqIE5vdGU6IGFueW9uZSBwYXNzaW5nIHRoZSBgYXNgIHByb3AsIHNob3VsZCBtYW5hZ2UgdGhlIGB2aWV3Qm94YCBmcm9tIHRoZSBleHRlcm5hbCBjb21wb25lbnRcbiAgICovXG5cblxuICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChjaGFrcmEuc3ZnLCBfZXh0ZW5kcyh7XG4gICAgICBhczogZWxlbWVudFxuICAgIH0sIHNoYXJlZCwgcmVzdCkpO1xuICB9XG5cbiAgdmFyIF9wYXRoID0gY2hpbGRyZW4gIT0gbnVsbCA/IGNoaWxkcmVuIDogZmFsbGJhY2tJY29uLnBhdGg7XG5cbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9SZWFjdC5jcmVhdGVFbGVtZW50KGNoYWtyYS5zdmcsIF9leHRlbmRzKHtcbiAgICB2ZXJ0aWNhbEFsaWduOiBcIm1pZGRsZVwiLFxuICAgIHZpZXdCb3g6IF92aWV3Qm94XG4gIH0sIHNoYXJlZCwgcmVzdCksIF9wYXRoKTtcbn0pO1xuXG5pZiAoX19ERVZfXykge1xuICBJY29uLmRpc3BsYXlOYW1lID0gXCJJY29uXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEljb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pY29uLmpzLm1hcCJdLCJuYW1lcyI6WyJnbG9iYWwiLCJweFRyYW5zZm9ybSIsImdldCIsIl9leHRlbmRzIiwibWVyZ2VXaXRoIiwibWVyZ2UiLCJzeXN0ZW1Qcm9wQ29uZmlncyIsInQiLCJtZW1vaXplIiwidG9rZW4iLCJwZWVrIiwiaWRlbnRpZmllciIsInBvc2l0aW9uIiwiZGVsaW1pdCIsImZyb20iLCJuZXh0IiwiZGVhbGxvYyIsImFsbG9jIiwicHJlZml4ZXIiLCJzdHJpbmdpZnkiLCJydWxlc2hlZXQiLCJtaWRkbGV3YXJlIiwic2VyaWFsaXplIiwiY29tcGlsZSIsImlzQnJvd3NlciIsInVuaXRsZXNzIiwiaGFzaFN0cmluZyIsImNyZWF0ZUNvbnRleHQiLCJmb3J3YXJkUmVmIiwidXNlQ29udGV4dCIsImNyZWF0ZUVsZW1lbnQiLCJfc3R5bGVkIiwiUmVhY3QuZm9yd2FyZFJlZiIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIiwiUmVhY3QuY3JlYXRlRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDTyxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDaEMsRUFBRSxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUNuQyxDQUFDO0FBQ00sU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ25DLEVBQUUsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUlEO0FBQ08sU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQy9CLEVBQUUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFJRDtBQUNPLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUNsQyxFQUFFLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBQ3JDLENBQUM7QUFRRDtBQUNPLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUNoQyxFQUFFLElBQUksSUFBSSxHQUFHLE9BQU8sS0FBSyxDQUFDO0FBQzFCLEVBQUUsT0FBTyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFDTSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7QUFDckMsRUFBRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFD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QWdCLENBQUM7QUFDOUQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDekIsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQztBQUMxQixFQUFFLE9BQU8sS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDN0IsRUFBRSxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLElBQUksUUFBUSxDQUFDO0FBQ25ELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxFQUFFO0FBQzlELElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLEVBQUUsSUFBSSxL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QUNuQyxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSTtBQUNyQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPO0FBQ25DLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNNLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbkMsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSTtBQUN0QixJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUN2QixNQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsS0FBSztBQUNMLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ00sU0FBUyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNwQyxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNuQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSTtBQUNyQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM1QixNQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsS0FBSyxNQUFNO0FBQ1gsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFB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QUcsRUFBRSxFQUFFLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxFQUFFLEVBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxPQUFPLFlBQVksS0FBSyxVQUFVLEVBQUUsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUM5N0M7QUFDQSxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxPQUFPLFVBQVUsS0FBSyxVQUFVLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsb0RBQW9ELENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsRUFBRSxlQUFlLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFLalk7QUFDQSxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsb0RBQW9ELENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUUsRUFBRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsT0FBTyxHQUFHLEVBQUUsT0FBTyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sZUFBZSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDdnZCO0FBQ0EsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLHlCQUF5QixFQUFFLEVBQUUsRUFBRSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEdBQUcsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDbGE7QUFDQSxTQUFTLHlCQUF5QixHQUFHLEVBQUUsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFB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O0FBQ0EsRUFBRSxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hGLENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxJQUFJLEdBQUcsU0FBUyxHQUFHLEdBQUc7QUFDMUIsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxTQUFTLEdBQUcsU0FBUyxRQUFRLEdBQUc7QUFDcEMsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxTQUFTLEdBQUcsU0FBUyxRQUFRLEdBQUc7QUFD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LElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDNUIsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDZixFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25CLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ25CLEVBQUUsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekMsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3ZCLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVB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QUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDUixFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDaEQsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUks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QUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3BGLE1BQU0sSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEUsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDeEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzVCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUVBLEdBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBQ0QsU0FBUyxFQUFFLENB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QjtBQUNBO0FBQ0E7QUFDQSxFQUFFQSxXQUFTLEtBQUssS0FBSyxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQ3RFLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBQ3BELEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDckQsSUFBSSxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFDN0I7QUFDQSxJQUFJLEdBQUc7QUFDUCxNQUFNLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLE9BQU8sR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoSDtBQUNBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDN0IsS0FBSyxRQUFRLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDcEMsR0FBRztBQUNIOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1o7QUFDQSxFQUFFLElBQUksQ0FBQztBQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDWCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3ZCO0FBQ0EsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTtBQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUMvSSxJQUFJLENBQUM7QUFDTDtBQUNBLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVELElBQUksQ0FBQztBQUNMO0FBQ0EsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2IsSUFBSSxDQUFDO0FBQ0w7QUFDQSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDM0Q7QUFDQSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RCxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsUUFBUSxHQUFHO0FBQ2IsSUFBSSxLQUFLLENBQUM7QUFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDaEQ7QUFDQSxJQUFJLEtBQUssQ0FBQztBQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUMvQztBQUNBLElBQUksS0FBSyxDQUFDO0FBQ1YsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJ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QUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVB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
