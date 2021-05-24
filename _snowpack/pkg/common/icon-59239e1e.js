import { r as react } from './index-404563d3.js';
import { c as createCommonjsModule, a as commonjsGlobal } from './_commonjsHelpers-798ad6a7.js';
import { _ as _extends$3 } from './extends-7477639a.js';

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

  return _extends$3({}, outerTheme, theme);
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
      return createStyled(nextTag, _extends$3({}, options, nextOptions, {
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

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

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

  var styles = _extends$2({
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
    return /*#__PURE__*/react.createElement(chakra.svg, _extends$2({
      as: element
    }, shared, rest));
  }

  var _path = children != null ? children : fallbackIcon.path;

  return /*#__PURE__*/react.createElement(chakra.svg, _extends$2({
    verticalAlign: "middle",
    viewBox: _viewBox
  }, shared, rest), _path);
});

export { contains as A, isRefObject as B, isEmptyObject as C, pipe as D, cx as E, omitThemingProps as F, chakra as G, dataAttr as H, Icon as I, scheduleMicrotask as J, ariaAttr as K, isRightClick as L, normalizeEventKey as M, isNull as N, getRelatedTarget as O, split as P, layoutPropNames as Q, StyleSheet as S, ThemeContext as T, fromEntries as a, isObject as b, isNotNumber as c, isBrowser as d, isArray as e, forwardRef as f, getOwnerDocument as g, calc as h, isNumber as i, withEmotionCache as j, insertStyles as k, isFunction as l, ThemeProvider as m, noop as n, objectKeys as o, pick as p, memoizedGet as q, runIfFn as r, serializeStyles as s, css as t, lodash_mergewith as u, filterUndefined as v, warn as w, omit as x, callAllHandlers as y, getActiveElement as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi01OTIzOWUxZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvdXRpbHMvZGlzdC9lc20vYXNzZXJ0aW9uLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC5tZXJnZXdpdGgvaW5kZXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9vYmplY3QuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9kb20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9mdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY3JlYXRlLXRyYW5zZm9ybS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vcHJvcC1jb25maWcuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3V0aWxzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS91dGlscy9wYXJzZS1ncmFkaWVudC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2JhY2tncm91bmQuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9ib3JkZXIuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9jb2xvci5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2ZsZXhib3guanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9ncmlkLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvbGF5b3V0LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvb3RoZXJzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvcG9zaXRpb24uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9zaGFkb3cuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9zcGFjZS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3R5cG9ncmFwaHkuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9vdXRsaW5lLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvbGlzdC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3RyYW5zaXRpb24uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy90cmFuc2Zvcm0uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2V4cGFuZC1yZXNwb25zaXZlLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9wc2V1ZG9zLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9zeXN0ZW0uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2Nzcy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY3JlYXRlLXRoZW1lLXZhcnMvY2FsYy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9zaGVldC9kaXN0L2Vtb3Rpb24tc2hlZXQuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGlzL2Rpc3Qvc3R5bGlzLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi93ZWFrLW1lbW9pemUvZGlzdC93ZWFrLW1lbW9pemUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vbWVtb2l6ZS9kaXN0L2Vtb3Rpb24tbWVtb2l6ZS5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9jYWNoZS9kaXN0L2Vtb3Rpb24tY2FjaGUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vdXRpbHMvZGlzdC9lbW90aW9uLXV0aWxzLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL2hhc2gvZGlzdC9oYXNoLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL3VuaXRsZXNzL2Rpc3QvdW5pdGxlc3MuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vc2VyaWFsaXplL2Rpc3QvZW1vdGlvbi1zZXJpYWxpemUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vcmVhY3QvZGlzdC9lbW90aW9uLWVsZW1lbnQtYTgzMDkwNzAuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3lzdGVtL2Rpc3QvZXNtL3N5c3RlbS51dGlscy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9pcy1wcm9wLXZhbGlkL2Rpc3QvZW1vdGlvbi1pcy1wcm9wLXZhbGlkLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL3N0eWxlZC9iYXNlL2Rpc3QvZW1vdGlvbi1zdHlsZWQtYmFzZS5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9zdHlsZWQvZGlzdC9lbW90aW9uLXN0eWxlZC5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N5c3RlbS9kaXN0L2VzbS9zaG91bGQtZm9yd2FyZC1wcm9wLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3lzdGVtL2Rpc3QvZXNtL3N5c3RlbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N5c3RlbS9kaXN0L2VzbS9mb3J3YXJkLXJlZi5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL2ljb24vZGlzdC9lc20vaWNvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOdW1iZXIgYXNzZXJ0aW9uc1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3ROdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gXCJudW1iZXJcIiB8fCBOdW1iZXIuaXNOYU4odmFsdWUpIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAtIHBhcnNlRmxvYXQodmFsdWUpICsgMSA+PSAwO1xufSAvLyBBcnJheSBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMDtcbn0gLy8gRnVuY3Rpb24gYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59IC8vIEdlbmVyaWMgYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG59IC8vIE9iamVjdCBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT09IFwib2JqZWN0XCIgfHwgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSAmJiAhaXNBcnJheSh2YWx1ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDA7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3RFbXB0eU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgIWlzRW1wdHlPYmplY3QodmFsdWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbDtcbn0gLy8gU3RyaW5nIGFzc2VydGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ3NzVmFyKHZhbHVlKSB7XG4gIHJldHVybiAvXnZhclxcKC0tLitcXCkkLy50ZXN0KHZhbHVlKTtcbn0gLy8gRW1wdHkgYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHJldHVybiBpc0VtcHR5QXJyYXkodmFsdWUpO1xuICBpZiAoaXNPYmplY3QodmFsdWUpKSByZXR1cm4gaXNFbXB0eU9iamVjdCh2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IHZhciBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiO1xuZXhwb3J0IHZhciBfX1RFU1RfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIjtcbmV4cG9ydCBmdW5jdGlvbiBpc1JlZk9iamVjdCh2YWwpIHtcbiAgcmV0dXJuIFwiY3VycmVudFwiIGluIHZhbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0RXZlbnQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIGlzT2JqZWN0KHZhbHVlKSAmJiBpc09iamVjdCh2YWx1ZS50YXJnZXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXNzZXJ0aW9uLmpzLm1hcCIsIi8qKlxuICogTG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgT3BlbkpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9vcGVuanNmLm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGluZmVyIHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3Rvci4gKi9cbnZhciBvYmplY3RDdG9yU3RyaW5nID0gZnVuY1RvU3RyaW5nLmNhbGwoT2JqZWN0KTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXksXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQsXG4gICAgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCksXG4gICAgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZSxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICAgIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlLFxuICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhc3NpZ25WYWx1ZWAgZXhjZXB0IHRoYXQgaXQgZG9lc24ndCBhc3NpZ25cbiAqIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWVxKG9iamVjdFtrZXldLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGFzc2lnblZhbHVlYCBhbmQgYGFzc2lnbk1lcmdlVmFsdWVgIHdpdGhvdXRcbiAqIHZhbHVlIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycgJiYgZGVmaW5lUHJvcGVydHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgICAnZW51bWVyYWJsZSc6IHRydWUsXG4gICAgICAndmFsdWUnOiB2YWx1ZSxcbiAgICAgICd3cml0YWJsZSc6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmIChvYmplY3QgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiYXNlRm9yKHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIoc2FmZUdldChvYmplY3QsIGtleSksIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfSwga2V5c0luKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXJnZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1lcmdlIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIHZhciBvYmpWYWx1ZSA9IHNhZmVHZXQob2JqZWN0LCBrZXkpLFxuICAgICAgc3JjVmFsdWUgPSBzYWZlR2V0KHNvdXJjZSwga2V5KSxcbiAgICAgIHN0YWNrZWQgPSBzdGFjay5nZXQoc3JjVmFsdWUpO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgc3RhY2tlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGlzQ29tbW9uID0gbmV3VmFsdWUgPT09IHVuZGVmaW5lZDtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHNyY1ZhbHVlKSxcbiAgICAgICAgaXNCdWZmID0gIWlzQXJyICYmIGlzQnVmZmVyKHNyY1ZhbHVlKSxcbiAgICAgICAgaXNUeXBlZCA9ICFpc0FyciAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheShzcmNWYWx1ZSk7XG5cbiAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgIGlmIChpc0FyciB8fCBpc0J1ZmYgfHwgaXNUeXBlZCkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNCdWZmKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVCdWZmZXIoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNUeXBlZCkge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lVHlwZWRBcnJheShzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgaWYgKGlzQXJndW1lbnRzKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRvUGxhaW5PYmplY3Qob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KG9ialZhbHVlKSB8fCBpc0Z1bmN0aW9uKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGluaXRDbG9uZU9iamVjdChzcmNWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgc3RhY2suc2V0KHNyY1ZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgbWVyZ2VGdW5jKG5ld1ZhbHVlLCBzcmNWYWx1ZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICB9XG4gIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiAgYGJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUJ1ZmZlcihidWZmZXIsIGlzRGVlcCkge1xuICBpZiAoaXNEZWVwKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZSgpO1xuICB9XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYWxsb2NVbnNhZmUgPyBhbGxvY1Vuc2FmZShsZW5ndGgpIDogbmV3IGJ1ZmZlci5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgPyAobGVuZ3RoLS0sIGN1c3RvbWl6ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBpbmRleCwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgLCB1bmxlc3MgYGtleWAgaXMgXCJfX3Byb3RvX19cIiBvciBcImNvbnN0cnVjdG9yXCIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzYWZlR2V0KG9iamVjdCwga2V5KSB7XG4gIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgJiYgdHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGtleSA9PSAnX19wcm90b19fJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjguMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgfHwgYmFzZUdldFRhZyh2YWx1ZSkgIT0gb2JqZWN0VGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwcm90byA9IGdldFByb3RvdHlwZSh2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBDdG9yID0gaGFzT3duUHJvcGVydHkuY2FsbChwcm90bywgJ2NvbnN0cnVjdG9yJykgJiYgcHJvdG8uY29uc3RydWN0b3I7XG4gIHJldHVybiB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IgaW5zdGFuY2VvZiBDdG9yICYmXG4gICAgZnVuY1RvU3RyaW5nLmNhbGwoQ3RvcikgPT0gb2JqZWN0Q3RvclN0cmluZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmdcbiAqIGtleWVkIHByb3BlcnRpZXMgb2YgYHZhbHVlYCB0byBvd24gcHJvcGVydGllcyBvZiB0aGUgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY29weU9iamVjdCh2YWx1ZSwga2V5c0luKHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ubWVyZ2VgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgIHdoaWNoXG4gKiBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIG1lcmdlZCB2YWx1ZXMgb2YgdGhlIGRlc3RpbmF0aW9uIGFuZCBzb3VyY2VcbiAqIHByb3BlcnRpZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgLCBtZXJnaW5nIGlzIGhhbmRsZWQgYnkgdGhlXG4gKiBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBpbnZva2VkIHdpdGggc2l4IGFyZ3VtZW50czpcbiAqIChvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gc291cmNlcyBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUpIHtcbiAqICAgaWYgKF8uaXNBcnJheShvYmpWYWx1ZSkpIHtcbiAqICAgICByZXR1cm4gb2JqVmFsdWUuY29uY2F0KHNyY1ZhbHVlKTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogWzFdLCAnYic6IFsyXSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IFszXSwgJ2InOiBbNF0gfTtcbiAqXG4gKiBfLm1lcmdlV2l0aChvYmplY3QsIG90aGVyLCBjdXN0b21pemVyKTtcbiAqIC8vID0+IHsgJ2EnOiBbMSwgM10sICdiJzogWzIsIDRdIH1cbiAqL1xudmFyIG1lcmdlV2l0aCA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcikge1xuICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyKTtcbn0pO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlV2l0aDtcbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgbWVyZ2VXaXRoIH0gZnJvbSBcImxvZGFzaC5tZXJnZXdpdGhcIjtcbmV4cG9ydCBmdW5jdGlvbiBvbWl0KG9iamVjdCwga2V5cykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXlzLmluY2x1ZGVzKGtleSkpIHJldHVybjtcbiAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwaWNrKG9iamVjdCwga2V5cykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgZnVuY3Rpb24gc3BsaXQob2JqZWN0LCBrZXlzKSB7XG4gIHZhciBwaWNrZWQgPSB7fTtcbiAgdmFyIG9taXR0ZWQgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgcGlja2VkW2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgb21pdHRlZFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFtwaWNrZWQsIG9taXR0ZWRdO1xufVxuLyoqXG4gKiBHZXQgdmFsdWUgZnJvbSBhIGRlZXBseSBuZXN0ZWQgb2JqZWN0IHVzaW5nIGEgc3RyaW5nIHBhdGguXG4gKiBNZW1vaXplcyB0aGUgdmFsdWUuXG4gKiBAcGFyYW0gb2JqIC0gdGhlIG9iamVjdFxuICogQHBhcmFtIHBhdGggLSB0aGUgc3RyaW5nIHBhdGhcbiAqIEBwYXJhbSBkZWYgIC0gdGhlIGZhbGxiYWNrIHZhbHVlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldChvYmosIHBhdGgsIGZhbGxiYWNrLCBpbmRleCkge1xuICB2YXIga2V5ID0gdHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgPyBwYXRoLnNwbGl0KFwiLlwiKSA6IFtwYXRoXTtcblxuICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBrZXkubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgaWYgKCFvYmopIGJyZWFrO1xuICAgIG9iaiA9IG9ialtrZXlbaW5kZXhdXTtcbiAgfVxuXG4gIHJldHVybiBvYmogPT09IHVuZGVmaW5lZCA/IGZhbGxiYWNrIDogb2JqO1xufVxuZXhwb3J0IHZhciBtZW1vaXplID0gZm4gPT4ge1xuICB2YXIgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG4gIHZhciBtZW1vaXplZEZuID0gKG9iaiwgcGF0aCwgZmFsbGJhY2ssIGluZGV4KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBmbihvYmosIHBhdGgsIGZhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBpZiAoIWNhY2hlLmhhcyhvYmopKSB7XG4gICAgICBjYWNoZS5zZXQob2JqLCBuZXcgTWFwKCkpO1xuICAgIH1cblxuICAgIHZhciBtYXAgPSBjYWNoZS5nZXQob2JqKTtcblxuICAgIGlmIChtYXAuaGFzKHBhdGgpKSB7XG4gICAgICByZXR1cm4gbWFwLmdldChwYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBmbihvYmosIHBhdGgsIGZhbGxiYWNrLCBpbmRleCk7XG4gICAgbWFwLnNldChwYXRoLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBtZW1vaXplZEZuO1xufTtcbmV4cG9ydCB2YXIgbWVtb2l6ZWRHZXQgPSBtZW1vaXplKGdldCk7XG4vKipcbiAqIEdldCB2YWx1ZSBmcm9tIGRlZXBseSBuZXN0ZWQgb2JqZWN0LCBiYXNlZCBvbiBwYXRoXG4gKiBJdCByZXR1cm5zIHRoZSBwYXRoIHZhbHVlIGlmIG5vdCBmb3VuZCBpbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gcGF0aCAtIHRoZSBzdHJpbmcgcGF0aCBvciB2YWx1ZVxuICogQHBhcmFtIHNjYWxlIC0gdGhlIHN0cmluZyBwYXRoIG9yIHZhbHVlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpdGhEZWZhdWx0KHBhdGgsIHNjYWxlKSB7XG4gIHJldHVybiBtZW1vaXplZEdldChzY2FsZSwgcGF0aCwgcGF0aCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlbXMgb2YgYW4gb2JqZWN0IHRoYXQgbWVldCB0aGUgY29uZGl0aW9uIHNwZWNpZmllZCBpbiBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBvYmplY3QgdGhlIG9iamVjdCB0byBsb29wIHRocm91Z2hcbiAqIEBwYXJhbSBmbiBUaGUgZmlsdGVyIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3RGaWx0ZXIob2JqZWN0LCBmbikge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIHZhciBzaG91bGRQYXNzID0gZm4odmFsdWUsIGtleSwgb2JqZWN0KTtcblxuICAgIGlmIChzaG91bGRQYXNzKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgdmFyIGZpbHRlclVuZGVmaW5lZCA9IG9iamVjdCA9PiBvYmplY3RGaWx0ZXIob2JqZWN0LCB2YWwgPT4gdmFsICE9PSBudWxsICYmIHZhbCAhPT0gdW5kZWZpbmVkKTtcbmV4cG9ydCB2YXIgb2JqZWN0S2V5cyA9IG9iaiA9PiBPYmplY3Qua2V5cyhvYmopO1xuLyoqXG4gKiBPYmplY3QuZW50cmllcyBwb2x5ZmlsbCBmb3IgTm9kZXYxMCBjb21wYXRpYmlsaXR5XG4gKi9cblxuZXhwb3J0IHZhciBmcm9tRW50cmllcyA9IGVudHJpZXMgPT4gZW50cmllcy5yZWR1Y2UoKGNhcnJ5LCBfcmVmKSA9PiB7XG4gIHZhciBba2V5LCB2YWx1ZV0gPSBfcmVmO1xuICBjYXJyeVtrZXldID0gdmFsdWU7XG4gIHJldHVybiBjYXJyeTtcbn0sIHt9KTtcbi8qKlxuICogR2V0IHRoZSBDU1MgdmFyaWFibGUgcmVmIHN0b3JlZCBpbiB0aGUgdGhlbWVcbiAqL1xuXG5leHBvcnQgdmFyIGdldENTU1ZhciA9ICh0aGVtZSwgc2NhbGUsIHZhbHVlKSA9PiB7XG4gIHZhciBfdGhlbWUkX19jc3NNYXAkJHZhclIsIF90aGVtZSRfX2Nzc01hcCQ7XG5cbiAgcmV0dXJuIChfdGhlbWUkX19jc3NNYXAkJHZhclIgPSAoX3RoZW1lJF9fY3NzTWFwJCA9IHRoZW1lLl9fY3NzTWFwW3NjYWxlICsgXCIuXCIgKyB2YWx1ZV0pID09IG51bGwgPyB2b2lkIDAgOiBfdGhlbWUkX19jc3NNYXAkLnZhclJlZikgIT0gbnVsbCA/IF90aGVtZSRfX2Nzc01hcCQkdmFyUiA6IHZhbHVlO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9iamVjdC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJXaW5kb3cobm9kZSkge1xuICB2YXIgX2dldE93bmVyRG9jdW1lbnQkZGVmLCBfZ2V0T3duZXJEb2N1bWVudDtcblxuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgPyAoX2dldE93bmVyRG9jdW1lbnQkZGVmID0gKF9nZXRPd25lckRvY3VtZW50ID0gZ2V0T3duZXJEb2N1bWVudChub2RlKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9nZXRPd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAhPSBudWxsID8gX2dldE93bmVyRG9jdW1lbnQkZGVmIDogd2luZG93IDogd2luZG93O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyRG9jdW1lbnQobm9kZSkge1xuICB2YXIgX25vZGUkb3duZXJEb2N1bWVudDtcblxuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgPyAoX25vZGUkb3duZXJEb2N1bWVudCA9IG5vZGUub3duZXJEb2N1bWVudCkgIT0gbnVsbCA/IF9ub2RlJG93bmVyRG9jdW1lbnQgOiBkb2N1bWVudCA6IGRvY3VtZW50O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZURPTSgpIHtcbiAgcmV0dXJuICEhKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbn1cbmV4cG9ydCB2YXIgaXNCcm93c2VyID0gY2FuVXNlRE9NKCk7XG5leHBvcnQgdmFyIGRhdGFBdHRyID0gY29uZGl0aW9uID0+IGNvbmRpdGlvbiA/IFwiXCIgOiB1bmRlZmluZWQ7XG5leHBvcnQgdmFyIGFyaWFBdHRyID0gY29uZGl0aW9uID0+IGNvbmRpdGlvbiA/IHRydWUgOiB1bmRlZmluZWQ7XG5leHBvcnQgdmFyIGN4ID0gZnVuY3Rpb24gY3goKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjbGFzc05hbWVzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGNsYXNzTmFtZXNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gY2xhc3NOYW1lcy5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIik7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZUVsZW1lbnQobm9kZSkge1xuICB2YXIgZG9jID0gZ2V0T3duZXJEb2N1bWVudChub2RlKTtcbiAgcmV0dXJuIGRvYyA9PSBudWxsID8gdm9pZCAwIDogZG9jLmFjdGl2ZUVsZW1lbnQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICBpZiAoIXBhcmVudCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gcGFyZW50ID09PSBjaGlsZCB8fCBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZERvbUV2ZW50KHRhcmdldCwgZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgfTtcbn1cbi8qKlxuICogR2V0IHRoZSBub3JtYWxpemVkIGV2ZW50IGtleSBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4gKiBAcGFyYW0gZXZlbnQga2V5Ym9hcmQgZXZlbnRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRXZlbnRLZXkoZXZlbnQpIHtcbiAgdmFyIHtcbiAgICBrZXksXG4gICAga2V5Q29kZVxuICB9ID0gZXZlbnQ7XG4gIHZhciBpc0Fycm93S2V5ID0ga2V5Q29kZSA+PSAzNyAmJiBrZXlDb2RlIDw9IDQwICYmIGtleS5pbmRleE9mKFwiQXJyb3dcIikgIT09IDA7XG4gIHZhciBldmVudEtleSA9IGlzQXJyb3dLZXkgPyBcIkFycm93XCIgKyBrZXkgOiBrZXk7XG4gIHJldHVybiBldmVudEtleTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWxhdGVkVGFyZ2V0KGV2ZW50KSB7XG4gIHZhciBfZXZlbnQkdGFyZ2V0LCBfcmVmLCBfZXZlbnQkcmVsYXRlZFRhcmdldDtcblxuICB2YXIgdGFyZ2V0ID0gKF9ldmVudCR0YXJnZXQgPSBldmVudC50YXJnZXQpICE9IG51bGwgPyBfZXZlbnQkdGFyZ2V0IDogZXZlbnQuY3VycmVudFRhcmdldDtcbiAgdmFyIGFjdGl2ZUVsZW1lbnQgPSBnZXRBY3RpdmVFbGVtZW50KHRhcmdldCk7XG4gIHZhciBvcmlnaW5hbFRhcmdldCA9IGV2ZW50Lm5hdGl2ZUV2ZW50LmV4cGxpY2l0T3JpZ2luYWxUYXJnZXQ7XG4gIHJldHVybiAoX3JlZiA9IChfZXZlbnQkcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQpICE9IG51bGwgPyBfZXZlbnQkcmVsYXRlZFRhcmdldCA6IG9yaWdpbmFsVGFyZ2V0KSAhPSBudWxsID8gX3JlZiA6IGFjdGl2ZUVsZW1lbnQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNSaWdodENsaWNrKGV2ZW50KSB7XG4gIHJldHVybiBldmVudC5idXR0b24gIT09IDA7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kb20uanMubWFwIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbmltcG9ydCB7IGlzRnVuY3Rpb24sIGlzTnVtYmVyLCBfX0RFVl9fLCBfX1RFU1RfXyB9IGZyb20gXCIuL2Fzc2VydGlvblwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJ1bklmRm4odmFsdWVPckZuKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBpc0Z1bmN0aW9uKHZhbHVlT3JGbikgPyB2YWx1ZU9yRm4oLi4uYXJncykgOiB2YWx1ZU9yRm47XG59XG5leHBvcnQgZnVuY3Rpb24gY2FsbEFsbEhhbmRsZXJzKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGZuc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGZ1bmMoZXZlbnQpIHtcbiAgICBmbnMuc29tZShmbiA9PiB7XG4gICAgICBmbiA9PSBudWxsID8gdm9pZCAwIDogZm4oZXZlbnQpO1xuICAgICAgcmV0dXJuIGV2ZW50ID09IG51bGwgPyB2b2lkIDAgOiBldmVudC5kZWZhdWx0UHJldmVudGVkO1xuICAgIH0pO1xuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxBbGwoKSB7XG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgZm5zW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkRm4oYXJnKSB7XG4gICAgZm5zLmZvckVhY2goZm4gPT4ge1xuICAgICAgZm4gPT0gbnVsbCA/IHZvaWQgMCA6IGZuKGFyZyk7XG4gICAgfSk7XG4gIH07XG59XG5leHBvcnQgdmFyIGNvbXBvc2UgPSBmdW5jdGlvbiBjb21wb3NlKGZuMSkge1xuICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgZm5zW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGZucy5yZWR1Y2UoKGYxLCBmMikgPT4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmMShmMiguLi5hcmd1bWVudHMpKTtcbiAgfSwgZm4xKTtcbn07XG5leHBvcnQgZnVuY3Rpb24gb25jZShmbikge1xuICB2YXIgcmVzdWx0O1xuICByZXR1cm4gZnVuY3Rpb24gZnVuYygpIHtcbiAgICBpZiAoZm4pIHtcbiAgICAgIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNSksIF9rZXk1ID0gMDsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuICAgICAgICBhcmdzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgZm4gPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5leHBvcnQgdmFyIG5vb3AgPSAoKSA9PiB7fTtcbmV4cG9ydCB2YXIgd2FybiA9IG9uY2Uob3B0aW9ucyA9PiAoKSA9PiB7XG4gIHZhciB7XG4gICAgY29uZGl0aW9uLFxuICAgIG1lc3NhZ2VcbiAgfSA9IG9wdGlvbnM7XG5cbiAgaWYgKGNvbmRpdGlvbiAmJiBfX0RFVl9fKSB7XG4gICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICB9XG59KTtcbmV4cG9ydCB2YXIgZXJyb3IgPSBvbmNlKG9wdGlvbnMgPT4gKCkgPT4ge1xuICB2YXIge1xuICAgIGNvbmRpdGlvbixcbiAgICBtZXNzYWdlXG4gIH0gPSBvcHRpb25zO1xuXG4gIGlmIChjb25kaXRpb24gJiYgX19ERVZfXykge1xuICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gIH1cbn0pO1xuXG52YXIgcHJvbWlzZU1pY3JvdGFzayA9IGNhbGxiYWNrID0+IHtcbiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjayk7XG59O1xuXG5leHBvcnQgdmFyIHNjaGVkdWxlTWljcm90YXNrID0gX19URVNUX18gPyBmbiA9PiBmbigpIDogdHlwZW9mIHF1ZXVlTWljcm90YXNrID09PSBcImZ1bmN0aW9uXCIgPyBxdWV1ZU1pY3JvdGFzayA6IHByb21pc2VNaWNyb3Rhc2s7XG5leHBvcnQgdmFyIHBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgIGZuc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICB9XG5cbiAgcmV0dXJuIHYgPT4gZm5zLnJlZHVjZSgoYSwgYikgPT4gYihhKSwgdik7XG59O1xuXG52YXIgZGlzdGFuY2UxRCA9IChhLCBiKSA9PiBNYXRoLmFicyhhIC0gYik7XG5cbnZhciBpc1BvaW50ID0gcG9pbnQgPT4gXCJ4XCIgaW4gcG9pbnQgJiYgXCJ5XCIgaW4gcG9pbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZShhLCBiKSB7XG4gIGlmIChpc051bWJlcihhKSAmJiBpc051bWJlcihiKSkge1xuICAgIHJldHVybiBkaXN0YW5jZTFEKGEsIGIpO1xuICB9XG5cbiAgaWYgKGlzUG9pbnQoYSkgJiYgaXNQb2ludChiKSkge1xuICAgIHZhciB4RGVsdGEgPSBkaXN0YW5jZTFEKGEueCwgYi54KTtcbiAgICB2YXIgeURlbHRhID0gZGlzdGFuY2UxRChhLnksIGIueSk7XG4gICAgcmV0dXJuIE1hdGguc3FydCh4RGVsdGEgKiogMiArIHlEZWx0YSAqKiAyKTtcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnVuY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgaXNOdW1iZXIsIGlzT2JqZWN0IH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcblxudmFyIGFuYWx5emVDU1NWYWx1ZSA9IHZhbHVlID0+IHtcbiAgdmFyIG51bSA9IHBhcnNlRmxvYXQodmFsdWUudG9TdHJpbmcoKSk7XG4gIHZhciB1bml0ID0gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKFN0cmluZyhudW0pLCBcIlwiKTtcbiAgcmV0dXJuIHtcbiAgICB1bml0bGVzczogIXVuaXQsXG4gICAgdmFsdWU6IG51bSxcbiAgICB1bml0XG4gIH07XG59O1xuXG5leHBvcnQgdmFyIHB4ID0gdmFsdWUgPT4ge1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHZhbHVlO1xuICB2YXIge1xuICAgIHVuaXRsZXNzXG4gIH0gPSBhbmFseXplQ1NTVmFsdWUodmFsdWUpO1xuICByZXR1cm4gdW5pdGxlc3MgfHwgaXNOdW1iZXIodmFsdWUpID8gdmFsdWUgKyBcInB4XCIgOiB2YWx1ZTtcbn07XG5leHBvcnQgdmFyIHRva2VuVG9DU1NWYXIgPSAoc2NhbGUsIHZhbHVlKSA9PiB0aGVtZSA9PiB7XG4gIHZhciB2YWx1ZVN0ciA9IFN0cmluZyh2YWx1ZSk7XG4gIHZhciBrZXkgPSBzY2FsZSA/IHNjYWxlICsgXCIuXCIgKyB2YWx1ZVN0ciA6IHZhbHVlU3RyO1xuICByZXR1cm4gaXNPYmplY3QodGhlbWUuX19jc3NNYXApICYmIGtleSBpbiB0aGVtZS5fX2Nzc01hcCA/IHRoZW1lLl9fY3NzTWFwW2tleV0udmFyUmVmIDogdmFsdWU7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zZm9ybShvcHRpb25zKSB7XG4gIHZhciB7XG4gICAgc2NhbGUsXG4gICAgdHJhbnNmb3JtLFxuICAgIGNvbXBvc2VcbiAgfSA9IG9wdGlvbnM7XG5cbiAgdmFyIGZuID0gKHZhbHVlLCB0aGVtZSkgPT4ge1xuICAgIHZhciBfdHJhbnNmb3JtO1xuXG4gICAgdmFyIF92YWx1ZSA9IHRva2VuVG9DU1NWYXIoc2NhbGUsIHZhbHVlKSh0aGVtZSk7XG5cbiAgICB2YXIgcmVzdWx0ID0gKF90cmFuc2Zvcm0gPSB0cmFuc2Zvcm0gPT0gbnVsbCA/IHZvaWQgMCA6IHRyYW5zZm9ybShfdmFsdWUsIHRoZW1lKSkgIT0gbnVsbCA/IF90cmFuc2Zvcm0gOiBfdmFsdWU7XG5cbiAgICBpZiAoY29tcG9zZSkge1xuICAgICAgcmVzdWx0ID0gY29tcG9zZShyZXN1bHQsIHRoZW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHJldHVybiBmbjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZS10cmFuc2Zvcm0uanMubWFwIiwiaW1wb3J0IHsgY3JlYXRlVHJhbnNmb3JtIH0gZnJvbSBcIi4vY3JlYXRlLXRyYW5zZm9ybVwiO1xuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uZmlnKHNjYWxlLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIHByb3BlcnR5ID0+IHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgcHJvcGVydHksXG4gICAgICBzY2FsZVxuICAgIH07XG4gICAgcmVzdWx0LnRyYW5zZm9ybSA9IGNyZWF0ZVRyYW5zZm9ybSh7XG4gICAgICBzY2FsZSxcbiAgICAgIHRyYW5zZm9ybVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbnZhciBnZXRSdGwgPSAoX3JlZikgPT4ge1xuICB2YXIge1xuICAgIHJ0bCxcbiAgICBsdHJcbiAgfSA9IF9yZWY7XG4gIHJldHVybiB0aGVtZSA9PiB0aGVtZS5kaXJlY3Rpb24gPT09IFwicnRsXCIgPyBydGwgOiBsdHI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naWNhbChvcHRpb25zKSB7XG4gIHZhciB7XG4gICAgcHJvcGVydHksXG4gICAgc2NhbGUsXG4gICAgdHJhbnNmb3JtXG4gIH0gPSBvcHRpb25zO1xuICByZXR1cm4ge1xuICAgIHNjYWxlLFxuICAgIHByb3BlcnR5OiBnZXRSdGwocHJvcGVydHkpLFxuICAgIHRyYW5zZm9ybTogc2NhbGUgPyBjcmVhdGVUcmFuc2Zvcm0oe1xuICAgICAgc2NhbGUsXG4gICAgICBjb21wb3NlOiB0cmFuc2Zvcm1cbiAgICB9KSA6IHRyYW5zZm9ybVxuICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJvcC1jb25maWcuanMubWFwIiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IHsgaXNOdW1iZXIgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuaW1wb3J0IHsgY3JlYXRlVHJhbnNmb3JtLCBweCBhcyBweFRyYW5zZm9ybSB9IGZyb20gXCIuLi9jcmVhdGUtdHJhbnNmb3JtXCI7XG5pbXBvcnQgeyBsb2dpY2FsLCB0b0NvbmZpZyB9IGZyb20gXCIuLi9wcm9wLWNvbmZpZ1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXNcIjtcblxuZnVuY3Rpb24gZnJhY3Rpb25hbFZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiAhaXNOdW1iZXIodmFsdWUpIHx8IHZhbHVlID4gMSA/IHZhbHVlIDogdmFsdWUgKiAxMDAgKyBcIiVcIjtcbn1cblxuZXhwb3J0IHZhciB0ID0ge1xuICBib3JkZXJXaWR0aHM6IHRvQ29uZmlnKFwiYm9yZGVyV2lkdGhzXCIpLFxuICBib3JkZXJTdHlsZXM6IHRvQ29uZmlnKFwiYm9yZGVyU3R5bGVzXCIpLFxuICBjb2xvcnM6IHRvQ29uZmlnKFwiY29sb3JzXCIpLFxuICBib3JkZXJzOiB0b0NvbmZpZyhcImJvcmRlcnNcIiksXG4gIHJhZGlpOiB0b0NvbmZpZyhcInJhZGlpXCIsIHB4VHJhbnNmb3JtKSxcbiAgc3BhY2U6IHRvQ29uZmlnKFwic3BhY2VcIiwgcHhUcmFuc2Zvcm0pLFxuICBzcGFjZVQ6IHRvQ29uZmlnKFwic3BhY2VcIiwgcHhUcmFuc2Zvcm0pLFxuICBwcm9wOiAocHJvcGVydHksIHNjYWxlLCB0cmFuc2Zvcm0pID0+IF9leHRlbmRzKHtcbiAgICBwcm9wZXJ0eSxcbiAgICBzY2FsZVxuICB9LCBzY2FsZSAmJiB7XG4gICAgdHJhbnNmb3JtOiBjcmVhdGVUcmFuc2Zvcm0oe1xuICAgICAgc2NhbGUsXG4gICAgICB0cmFuc2Zvcm1cbiAgICB9KVxuICB9KSxcbiAgc2l6ZXM6IHRvQ29uZmlnKFwic2l6ZXNcIiwgcHhUcmFuc2Zvcm0pLFxuICBzaXplc1Q6IHRvQ29uZmlnKFwic2l6ZXNcIiwgZnJhY3Rpb25hbFZhbHVlKSxcbiAgc2hhZG93czogdG9Db25maWcoXCJzaGFkb3dzXCIpLFxuICBsb2dpY2FsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiZnVuY3Rpb24gX3dyYXBSZWdFeHAocmUsIGdyb3VwcykgeyBfd3JhcFJlZ0V4cCA9IGZ1bmN0aW9uIF93cmFwUmVnRXhwKHJlLCBncm91cHMpIHsgcmV0dXJuIG5ldyBCYWJlbFJlZ0V4cChyZSwgdW5kZWZpbmVkLCBncm91cHMpOyB9OyB2YXIgX1JlZ0V4cCA9IF93cmFwTmF0aXZlU3VwZXIoUmVnRXhwKTsgdmFyIF9zdXBlciA9IFJlZ0V4cC5wcm90b3R5cGU7IHZhciBfZ3JvdXBzID0gbmV3IFdlYWtNYXAoKTsgZnVuY3Rpb24gQmFiZWxSZWdFeHAocmUsIGZsYWdzLCBncm91cHMpIHsgdmFyIF90aGlzID0gX1JlZ0V4cC5jYWxsKHRoaXMsIHJlLCBmbGFncyk7IF9ncm91cHMuc2V0KF90aGlzLCBncm91cHMgfHwgX2dyb3Vwcy5nZXQocmUpKTsgcmV0dXJuIF90aGlzOyB9IF9pbmhlcml0cyhCYWJlbFJlZ0V4cCwgX1JlZ0V4cCk7IEJhYmVsUmVnRXhwLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKHN0cikgeyB2YXIgcmVzdWx0ID0gX3N1cGVyLmV4ZWMuY2FsbCh0aGlzLCBzdHIpOyBpZiAocmVzdWx0KSByZXN1bHQuZ3JvdXBzID0gYnVpbGRHcm91cHMocmVzdWx0LCB0aGlzKTsgcmV0dXJuIHJlc3VsdDsgfTsgQmFiZWxSZWdFeHAucHJvdG90eXBlW1N5bWJvbC5yZXBsYWNlXSA9IGZ1bmN0aW9uIChzdHIsIHN1YnN0aXR1dGlvbikgeyBpZiAodHlwZW9mIHN1YnN0aXR1dGlvbiA9PT0gXCJzdHJpbmdcIikgeyB2YXIgZ3JvdXBzID0gX2dyb3Vwcy5nZXQodGhpcyk7IHJldHVybiBfc3VwZXJbU3ltYm9sLnJlcGxhY2VdLmNhbGwodGhpcywgc3RyLCBzdWJzdGl0dXRpb24ucmVwbGFjZSgvXFwkPChbXj5dKyk+L2csIGZ1bmN0aW9uIChfLCBuYW1lKSB7IHJldHVybiBcIiRcIiArIGdyb3Vwc1tuYW1lXTsgfSkpOyB9IGVsc2UgaWYgKHR5cGVvZiBzdWJzdGl0dXRpb24gPT09IFwiZnVuY3Rpb25cIikgeyB2YXIgX3RoaXMgPSB0aGlzOyByZXR1cm4gX3N1cGVyW1N5bWJvbC5yZXBsYWNlXS5jYWxsKHRoaXMsIHN0ciwgZnVuY3Rpb24gKCkgeyB2YXIgYXJncyA9IFtdOyBhcmdzLnB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTsgaWYgKHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gIT09IFwib2JqZWN0XCIpIHsgYXJncy5wdXNoKGJ1aWxkR3JvdXBzKGFyZ3MsIF90aGlzKSk7IH0gcmV0dXJuIHN1YnN0aXR1dGlvbi5hcHBseSh0aGlzLCBhcmdzKTsgfSk7IH0gZWxzZSB7IHJldHVybiBfc3VwZXJbU3ltYm9sLnJlcGxhY2VdLmNhbGwodGhpcywgc3RyLCBzdWJzdGl0dXRpb24pOyB9IH07IGZ1bmN0aW9uIGJ1aWxkR3JvdXBzKHJlc3VsdCwgcmUpIHsgdmFyIGcgPSBfZ3JvdXBzLmdldChyZSk7IHJldHVybiBPYmplY3Qua2V5cyhnKS5yZWR1Y2UoZnVuY3Rpb24gKGdyb3VwcywgbmFtZSkgeyBncm91cHNbbmFtZV0gPSByZXN1bHRbZ1tuYW1lXV07IHJldHVybiBncm91cHM7IH0sIE9iamVjdC5jcmVhdGUobnVsbCkpOyB9IHJldHVybiBfd3JhcFJlZ0V4cC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKSB7IHZhciBfY2FjaGUgPSB0eXBlb2YgTWFwID09PSBcImZ1bmN0aW9uXCIgPyBuZXcgTWFwKCkgOiB1bmRlZmluZWQ7IF93cmFwTmF0aXZlU3VwZXIgPSBmdW5jdGlvbiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKSB7IGlmIChDbGFzcyA9PT0gbnVsbCB8fCAhX2lzTmF0aXZlRnVuY3Rpb24oQ2xhc3MpKSByZXR1cm4gQ2xhc3M7IGlmICh0eXBlb2YgQ2xhc3MgIT09IFwiZnVuY3Rpb25cIikgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gaWYgKHR5cGVvZiBfY2FjaGUgIT09IFwidW5kZWZpbmVkXCIpIHsgaWYgKF9jYWNoZS5oYXMoQ2xhc3MpKSByZXR1cm4gX2NhY2hlLmdldChDbGFzcyk7IF9jYWNoZS5zZXQoQ2xhc3MsIFdyYXBwZXIpOyB9IGZ1bmN0aW9uIFdyYXBwZXIoKSB7IHJldHVybiBfY29uc3RydWN0KENsYXNzLCBhcmd1bWVudHMsIF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3Rvcik7IH0gV3JhcHBlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogV3JhcHBlciwgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihXcmFwcGVyLCBDbGFzcyk7IH07IHJldHVybiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKTsgfVxuXG5mdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkgeyBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7IH0gZWxzZSB7IF9jb25zdHJ1Y3QgPSBmdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgdmFyIGEgPSBbbnVsbF07IGEucHVzaC5hcHBseShhLCBhcmdzKTsgdmFyIENvbnN0cnVjdG9yID0gRnVuY3Rpb24uYmluZC5hcHBseShQYXJlbnQsIGEpOyB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTsgaWYgKENsYXNzKSBfc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIENsYXNzLnByb3RvdHlwZSk7IHJldHVybiBpbnN0YW5jZTsgfTsgfSByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlRnVuY3Rpb24oZm4pIHsgcmV0dXJuIEZ1bmN0aW9uLnRvU3RyaW5nLmNhbGwoZm4pLmluZGV4T2YoXCJbbmF0aXZlIGNvZGVdXCIpICE9PSAtMTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBkaXJlY3Rpb25NYXAgPSB7XG4gIFwidG8tdFwiOiBcInRvIHRvcFwiLFxuICBcInRvLXRyXCI6IFwidG8gdG9wIHJpZ2h0XCIsXG4gIFwidG8tclwiOiBcInRvIHJpZ2h0XCIsXG4gIFwidG8tYnJcIjogXCJ0byBib3R0b20gcmlnaHRcIixcbiAgXCJ0by1iXCI6IFwidG8gYm90dG9tXCIsXG4gIFwidG8tYmxcIjogXCJ0byBib3R0b20gbGVmdFwiLFxuICBcInRvLWxcIjogXCJ0byBsZWZ0XCIsXG4gIFwidG8tdGxcIjogXCJ0byB0b3AgbGVmdFwiXG59O1xudmFyIHZhbHVlU2V0ID0gbmV3IFNldChPYmplY3QudmFsdWVzKGRpcmVjdGlvbk1hcCkpO1xudmFyIGdsb2JhbFNldCA9IG5ldyBTZXQoW1wibm9uZVwiLCBcIi1tb3otaW5pdGlhbFwiLCBcImluaGVyaXRcIiwgXCJpbml0aWFsXCIsIFwicmV2ZXJ0XCIsIFwidW5zZXRcIl0pO1xuXG52YXIgdHJpbVNwYWNlID0gc3RyID0+IHN0ci50cmltKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdyYWRpZW50KHZhbHVlLCB0aGVtZSkge1xuICB2YXIgX3JlZ2V4JGV4ZWMkZ3JvdXBzLCBfcmVnZXgkZXhlYztcblxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBnbG9iYWxTZXQuaGFzKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuXG4gIHZhciByZWdleCA9IC8qI19fUFVSRV9fKi9fd3JhcFJlZ0V4cCgvKF5bXFx4MkRBLVphLXpdKylcXCgoKC4qKSlcXCkvZywge1xuICAgIHR5cGU6IDEsXG4gICAgdmFsdWVzOiAyXG4gIH0pO1xuXG4gIHZhciB7XG4gICAgdHlwZSxcbiAgICB2YWx1ZXNcbiAgfSA9IChfcmVnZXgkZXhlYyRncm91cHMgPSAoX3JlZ2V4JGV4ZWMgPSByZWdleC5leGVjKHZhbHVlKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9yZWdleCRleGVjLmdyb3VwcykgIT0gbnVsbCA/IF9yZWdleCRleGVjJGdyb3VwcyA6IHt9O1xuICBpZiAoIXR5cGUgfHwgIXZhbHVlcykgcmV0dXJuIHZhbHVlO1xuXG4gIHZhciBfdHlwZSA9IHR5cGUuaW5jbHVkZXMoXCItZ3JhZGllbnRcIikgPyB0eXBlIDogdHlwZSArIFwiLWdyYWRpZW50XCI7XG5cbiAgdmFyIFttYXliZURpcmVjdGlvbiwgLi4uc3RvcHNdID0gdmFsdWVzLnNwbGl0KFwiLFwiKS5tYXAodHJpbVNwYWNlKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmICgoc3RvcHMgPT0gbnVsbCA/IHZvaWQgMCA6IHN0b3BzLmxlbmd0aCkgPT09IDApIHJldHVybiB2YWx1ZTtcbiAgdmFyIGRpcmVjdGlvbiA9IG1heWJlRGlyZWN0aW9uIGluIGRpcmVjdGlvbk1hcCA/IGRpcmVjdGlvbk1hcFttYXliZURpcmVjdGlvbl0gOiBtYXliZURpcmVjdGlvbjtcbiAgc3RvcHMudW5zaGlmdChkaXJlY3Rpb24pO1xuXG4gIHZhciBfdmFsdWVzID0gc3RvcHMubWFwKHN0b3AgPT4ge1xuICAgIC8vIGlmIHN0b3AgaXMgdmFsaWQgc2hvcnRoYW5kIGRpcmVjdGlvbiwgcmV0dXJuIGl0XG4gICAgaWYgKHZhbHVlU2V0LmhhcyhzdG9wKSkgcmV0dXJuIHN0b3A7IC8vIGNvbG9yIHN0b3AgY291bGQgYmUgYHJlZC4yMDAgMjAlYCBiYXNlZCBvbiBjc3MgZ3JhZGllbnQgc3BlY1xuXG4gICAgdmFyIFtfY29sb3IsIF9zdG9wXSA9IHN0b3Auc3BsaXQoXCIgXCIpOyAvLyBlbHNlLCBnZXQgYW5kIHRyYW5zZm9ybSB0aGUgY29sb3IgdG9rZW4gb3IgY3NzIHZhbHVlXG5cbiAgICB2YXIga2V5ID0gXCJjb2xvcnMuXCIgKyBfY29sb3I7XG4gICAgdmFyIGNvbG9yID0ga2V5IGluIHRoZW1lLl9fY3NzTWFwID8gdGhlbWUuX19jc3NNYXBba2V5XS52YXJSZWYgOiBfY29sb3I7XG4gICAgcmV0dXJuIF9zdG9wID8gW2NvbG9yLCBfc3RvcF0uam9pbihcIiBcIikgOiBjb2xvcjtcbiAgfSk7XG5cbiAgcmV0dXJuIF90eXBlICsgXCIoXCIgKyBfdmFsdWVzLmpvaW4oXCIsIFwiKSArIFwiKVwiO1xufVxuZXhwb3J0IHZhciBncmFkaWVudFRyYW5zZm9ybSA9ICh2YWx1ZSwgdGhlbWUpID0+IHBhcnNlR3JhZGllbnQodmFsdWUsIHRoZW1lICE9IG51bGwgPyB0aGVtZSA6IHt9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLWdyYWRpZW50LmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGdyYWRpZW50VHJhbnNmb3JtIH0gZnJvbSBcIi4uL3V0aWxzL3BhcnNlLWdyYWRpZW50XCI7XG5cbmZ1bmN0aW9uIGJnQ2xpcFRyYW5zZm9ybSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IFwidGV4dFwiID8ge1xuICAgIGNvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gICAgYmFja2dyb3VuZENsaXA6IFwidGV4dFwiXG4gIH0gOiB7XG4gICAgYmFja2dyb3VuZENsaXA6IHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCB2YXIgYmFja2dyb3VuZCA9IHtcbiAgYmc6IHQuY29sb3JzKFwiYmFja2dyb3VuZFwiKSxcbiAgYmdDb2xvcjogdC5jb2xvcnMoXCJiYWNrZ3JvdW5kQ29sb3JcIiksXG4gIGJhY2tncm91bmQ6IHQuY29sb3JzKFwiYmFja2dyb3VuZFwiKSxcbiAgYmFja2dyb3VuZENvbG9yOiB0LmNvbG9ycyhcImJhY2tncm91bmRDb2xvclwiKSxcbiAgYmFja2dyb3VuZEltYWdlOiB0cnVlLFxuICBiYWNrZ3JvdW5kU2l6ZTogdHJ1ZSxcbiAgYmFja2dyb3VuZFBvc2l0aW9uOiB0cnVlLFxuICBiYWNrZ3JvdW5kUmVwZWF0OiB0cnVlLFxuICBiYWNrZ3JvdW5kQXR0YWNobWVudDogdHJ1ZSxcbiAgYmFja2dyb3VuZEJsZW5kTW9kZTogdHJ1ZSxcbiAgYmFja2dyb3VuZENsaXA6IHtcbiAgICB0cmFuc2Zvcm06IGJnQ2xpcFRyYW5zZm9ybVxuICB9LFxuICBiZ0ltYWdlOiB0LnByb3AoXCJiYWNrZ3JvdW5kSW1hZ2VcIiksXG4gIGJnSW1nOiB0LnByb3AoXCJiYWNrZ3JvdW5kSW1hZ2VcIiksXG4gIGJnQmxlbmRNb2RlOiB0LnByb3AoXCJiYWNrZ3JvdW5kQmxlbmRNb2RlXCIpLFxuICBiZ1NpemU6IHQucHJvcChcImJhY2tncm91bmRTaXplXCIpLFxuICBiZ1Bvc2l0aW9uOiB0LnByb3AoXCJiYWNrZ3JvdW5kUG9zaXRpb25cIiksXG4gIGJnUG9zOiB0LnByb3AoXCJiYWNrZ3JvdW5kUG9zaXRpb25cIiksXG4gIGJnUmVwZWF0OiB0LnByb3AoXCJiYWNrZ3JvdW5kUmVwZWF0XCIpLFxuICBiZ0F0dGFjaG1lbnQ6IHQucHJvcChcImJhY2tncm91bmRBdHRhY2htZW50XCIpLFxuICBiZ0dyYWRpZW50OiB7XG4gICAgcHJvcGVydHk6IFwiYmFja2dyb3VuZEltYWdlXCIsXG4gICAgdHJhbnNmb3JtOiBncmFkaWVudFRyYW5zZm9ybVxuICB9LFxuICBiZ0NsaXA6IHtcbiAgICB0cmFuc2Zvcm06IGJnQ2xpcFRyYW5zZm9ybVxuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFja2dyb3VuZC5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGJvcmRlciA9IHtcbiAgYm9yZGVyOiB0LmJvcmRlcnMoXCJib3JkZXJcIiksXG4gIGJvcmRlcldpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlcldpZHRoXCIpLFxuICBib3JkZXJTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJTdHlsZVwiKSxcbiAgYm9yZGVyQ29sb3I6IHQuY29sb3JzKFwiYm9yZGVyQ29sb3JcIiksXG4gIGJvcmRlclJhZGl1czogdC5yYWRpaShcImJvcmRlclJhZGl1c1wiKSxcbiAgYm9yZGVyVG9wOiB0LmJvcmRlcnMoXCJib3JkZXJUb3BcIiksXG4gIGJvcmRlckJsb2NrU3RhcnQ6IHQuYm9yZGVycyhcImJvcmRlckJsb2NrU3RhcnRcIiksXG4gIGJvcmRlclRvcExlZnRSYWRpdXM6IHQucmFkaWkoXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIpLFxuICBib3JkZXJTdGFydFN0YXJ0UmFkaXVzOiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInJhZGlpXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsXG4gICAgICBydGw6IFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIlxuICAgIH1cbiAgfSksXG4gIGJvcmRlckVuZFN0YXJ0UmFkaXVzOiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInJhZGlpXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCIsXG4gICAgICBydGw6IFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIlxuICAgIH1cbiAgfSksXG4gIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiB0LnJhZGlpKFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIiksXG4gIGJvcmRlclN0YXJ0RW5kUmFkaXVzOiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInJhZGlpXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLFxuICAgICAgcnRsOiBcImJvcmRlclRvcExlZnRSYWRpdXNcIlxuICAgIH1cbiAgfSksXG4gIGJvcmRlckVuZEVuZFJhZGl1czogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJyYWRpaVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIixcbiAgICAgIHJ0bDogXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJcbiAgICB9XG4gIH0pLFxuICBib3JkZXJSaWdodDogdC5ib3JkZXJzKFwiYm9yZGVyUmlnaHRcIiksXG4gIGJvcmRlcklubGluZUVuZDogdC5ib3JkZXJzKFwiYm9yZGVySW5saW5lRW5kXCIpLFxuICBib3JkZXJCb3R0b206IHQuYm9yZGVycyhcImJvcmRlckJvdHRvbVwiKSxcbiAgYm9yZGVyQmxvY2tFbmQ6IHQuYm9yZGVycyhcImJvcmRlckJsb2NrRW5kXCIpLFxuICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiB0LnJhZGlpKFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiKSxcbiAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IHQucmFkaWkoXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiKSxcbiAgYm9yZGVyTGVmdDogdC5ib3JkZXJzKFwiYm9yZGVyTGVmdFwiKSxcbiAgYm9yZGVySW5saW5lU3RhcnQ6IHtcbiAgICBwcm9wZXJ0eTogXCJib3JkZXJJbmxpbmVTdGFydFwiLFxuICAgIHNjYWxlOiBcImJvcmRlcnNcIlxuICB9LFxuICBib3JkZXJJbmxpbmVTdGFydFJhZGl1czogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJyYWRpaVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFtcImJvcmRlclRvcExlZnRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJdLFxuICAgICAgcnRsOiBbXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCJdXG4gICAgfVxuICB9KSxcbiAgYm9yZGVySW5saW5lRW5kUmFkaXVzOiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInJhZGlpXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogW1wiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiXSxcbiAgICAgIHJ0bDogW1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIl1cbiAgICB9XG4gIH0pLFxuICBib3JkZXJYOiB0LmJvcmRlcnMoW1wiYm9yZGVyTGVmdFwiLCBcImJvcmRlclJpZ2h0XCJdKSxcbiAgYm9yZGVySW5saW5lOiB0LmJvcmRlcnMoXCJib3JkZXJJbmxpbmVcIiksXG4gIGJvcmRlclk6IHQuYm9yZGVycyhbXCJib3JkZXJUb3BcIiwgXCJib3JkZXJCb3R0b21cIl0pLFxuICBib3JkZXJCbG9jazogdC5ib3JkZXJzKFwiYm9yZGVyQmxvY2tcIiksXG4gIGJvcmRlclRvcFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlclRvcFdpZHRoXCIpLFxuICBib3JkZXJCbG9ja1N0YXJ0V2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyQmxvY2tTdGFydFdpZHRoXCIpLFxuICBib3JkZXJUb3BDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJUb3BDb2xvclwiKSxcbiAgYm9yZGVyQmxvY2tTdGFydENvbG9yOiB0LmNvbG9ycyhcImJvcmRlckJsb2NrU3RhcnRDb2xvclwiKSxcbiAgYm9yZGVyVG9wU3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyVG9wU3R5bGVcIiksXG4gIGJvcmRlckJsb2NrU3RhcnRTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJCbG9ja1N0YXJ0U3R5bGVcIiksXG4gIGJvcmRlckJvdHRvbVdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlckJvdHRvbVdpZHRoXCIpLFxuICBib3JkZXJCbG9ja0VuZFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlckJsb2NrRW5kV2lkdGhcIiksXG4gIGJvcmRlckJvdHRvbUNvbG9yOiB0LmNvbG9ycyhcImJvcmRlckJvdHRvbUNvbG9yXCIpLFxuICBib3JkZXJCbG9ja0VuZENvbG9yOiB0LmNvbG9ycyhcImJvcmRlckJsb2NrRW5kQ29sb3JcIiksXG4gIGJvcmRlckJvdHRvbVN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlckJvdHRvbVN0eWxlXCIpLFxuICBib3JkZXJCbG9ja0VuZFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlckJsb2NrRW5kU3R5bGVcIiksXG4gIGJvcmRlckxlZnRXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJMZWZ0V2lkdGhcIiksXG4gIGJvcmRlcklubGluZVN0YXJ0V2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVySW5saW5lU3RhcnRXaWR0aFwiKSxcbiAgYm9yZGVyTGVmdENvbG9yOiB0LmNvbG9ycyhcImJvcmRlckxlZnRDb2xvclwiKSxcbiAgYm9yZGVySW5saW5lU3RhcnRDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJJbmxpbmVTdGFydENvbG9yXCIpLFxuICBib3JkZXJMZWZ0U3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyTGVmdFN0eWxlXCIpLFxuICBib3JkZXJJbmxpbmVTdGFydFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlcklubGluZVN0YXJ0U3R5bGVcIiksXG4gIGJvcmRlclJpZ2h0V2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyUmlnaHRXaWR0aFwiKSxcbiAgYm9yZGVySW5saW5lRW5kV2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVySW5saW5lRW5kV2lkdGhcIiksXG4gIGJvcmRlclJpZ2h0Q29sb3I6IHQuY29sb3JzKFwiYm9yZGVyUmlnaHRDb2xvclwiKSxcbiAgYm9yZGVySW5saW5lRW5kQ29sb3I6IHQuY29sb3JzKFwiYm9yZGVySW5saW5lRW5kQ29sb3JcIiksXG4gIGJvcmRlclJpZ2h0U3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyUmlnaHRTdHlsZVwiKSxcbiAgYm9yZGVySW5saW5lRW5kU3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVySW5saW5lRW5kU3R5bGVcIiksXG4gIGJvcmRlclRvcFJhZGl1czogdC5yYWRpaShbXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsIFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIl0pLFxuICBib3JkZXJCb3R0b21SYWRpdXM6IHQucmFkaWkoW1wiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCJdKSxcbiAgYm9yZGVyTGVmdFJhZGl1czogdC5yYWRpaShbXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiXSksXG4gIGJvcmRlclJpZ2h0UmFkaXVzOiB0LnJhZGlpKFtcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIl0pXG59O1xuT2JqZWN0LmFzc2lnbihib3JkZXIsIHtcbiAgcm91bmRlZDogYm9yZGVyLmJvcmRlclJhZGl1cyxcbiAgcm91bmRlZFRvcDogYm9yZGVyLmJvcmRlclRvcFJhZGl1cyxcbiAgcm91bmRlZFRvcExlZnQ6IGJvcmRlci5ib3JkZXJUb3BMZWZ0UmFkaXVzLFxuICByb3VuZGVkVG9wUmlnaHQ6IGJvcmRlci5ib3JkZXJUb3BSaWdodFJhZGl1cyxcbiAgcm91bmRlZFRvcFN0YXJ0OiBib3JkZXIuYm9yZGVyU3RhcnRTdGFydFJhZGl1cyxcbiAgcm91bmRlZFRvcEVuZDogYm9yZGVyLmJvcmRlclN0YXJ0RW5kUmFkaXVzLFxuICByb3VuZGVkQm90dG9tOiBib3JkZXIuYm9yZGVyQm90dG9tUmFkaXVzLFxuICByb3VuZGVkQm90dG9tTGVmdDogYm9yZGVyLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMsXG4gIHJvdW5kZWRCb3R0b21SaWdodDogYm9yZGVyLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLFxuICByb3VuZGVkQm90dG9tU3RhcnQ6IGJvcmRlci5ib3JkZXJFbmRTdGFydFJhZGl1cyxcbiAgcm91bmRlZEJvdHRvbUVuZDogYm9yZGVyLmJvcmRlckVuZEVuZFJhZGl1cyxcbiAgcm91bmRlZExlZnQ6IGJvcmRlci5ib3JkZXJMZWZ0UmFkaXVzLFxuICByb3VuZGVkUmlnaHQ6IGJvcmRlci5ib3JkZXJSaWdodFJhZGl1cyxcbiAgcm91bmRlZFN0YXJ0OiBib3JkZXIuYm9yZGVySW5saW5lU3RhcnRSYWRpdXMsXG4gIHJvdW5kZWRFbmQ6IGJvcmRlci5ib3JkZXJJbmxpbmVFbmRSYWRpdXMsXG4gIGJvcmRlclN0YXJ0OiBib3JkZXIuYm9yZGVySW5saW5lU3RhcnQsXG4gIGJvcmRlckVuZDogYm9yZGVyLmJvcmRlcklubGluZUVuZCxcbiAgYm9yZGVyVG9wU3RhcnRSYWRpdXM6IGJvcmRlci5ib3JkZXJTdGFydFN0YXJ0UmFkaXVzLFxuICBib3JkZXJUb3BFbmRSYWRpdXM6IGJvcmRlci5ib3JkZXJTdGFydEVuZFJhZGl1cyxcbiAgYm9yZGVyQm90dG9tU3RhcnRSYWRpdXM6IGJvcmRlci5ib3JkZXJFbmRTdGFydFJhZGl1cyxcbiAgYm9yZGVyQm90dG9tRW5kUmFkaXVzOiBib3JkZXIuYm9yZGVyRW5kRW5kUmFkaXVzLFxuICBib3JkZXJTdGFydFJhZGl1czogYm9yZGVyLmJvcmRlcklubGluZVN0YXJ0UmFkaXVzLFxuICBib3JkZXJFbmRSYWRpdXM6IGJvcmRlci5ib3JkZXJJbmxpbmVFbmRSYWRpdXMsXG4gIGJvcmRlclN0YXJ0V2lkdGg6IGJvcmRlci5ib3JkZXJJbmxpbmVTdGFydFdpZHRoLFxuICBib3JkZXJFbmRXaWR0aDogYm9yZGVyLmJvcmRlcklubGluZUVuZFdpZHRoLFxuICBib3JkZXJTdGFydENvbG9yOiBib3JkZXIuYm9yZGVySW5saW5lU3RhcnRDb2xvcixcbiAgYm9yZGVyRW5kQ29sb3I6IGJvcmRlci5ib3JkZXJJbmxpbmVFbmRDb2xvcixcbiAgYm9yZGVyU3RhcnRTdHlsZTogYm9yZGVyLmJvcmRlcklubGluZVN0YXJ0U3R5bGUsXG4gIGJvcmRlckVuZFN0eWxlOiBib3JkZXIuYm9yZGVySW5saW5lRW5kU3R5bGVcbn0pO1xuLyoqXG4gKiBUaGUgcHJvcCB0eXBlcyBmb3IgYm9yZGVyIHByb3BlcnRpZXMgbGlzdGVkIGFib3ZlXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJvcmRlci5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGNvbG9yID0ge1xuICBjb2xvcjogdC5jb2xvcnMoXCJjb2xvclwiKSxcbiAgdGV4dENvbG9yOiB0LmNvbG9ycyhcImNvbG9yXCIpLFxuICBvcGFjaXR5OiB0cnVlLFxuICBmaWxsOiB0LmNvbG9ycyhcImZpbGxcIiksXG4gIHN0cm9rZTogdC5jb2xvcnMoXCJzdHJva2VcIilcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xvci5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vY3JlYXRlLXRyYW5zZm9ybVwiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xudmFyIHJldmVyc2UgPSB7XG4gIFwicm93LXJldmVyc2VcIjoge1xuICAgIHNwYWNlOiBcIi0tY2hha3JhLXNwYWNlLXgtcmV2ZXJzZVwiLFxuICAgIGRpdmlkZTogXCItLWNoYWtyYS1kaXZpZGUteC1yZXZlcnNlXCJcbiAgfSxcbiAgXCJjb2x1bW4tcmV2ZXJzZVwiOiB7XG4gICAgc3BhY2U6IFwiLS1jaGFrcmEtc3BhY2UteS1yZXZlcnNlXCIsXG4gICAgZGl2aWRlOiBcIi0tY2hha3JhLWRpdmlkZS15LXJldmVyc2VcIlxuICB9XG59O1xudmFyIG93bFNlbGVjdG9yID0gXCImID4gOm5vdChzdHlsZSkgfiA6bm90KHN0eWxlKVwiO1xuZXhwb3J0IHZhciBmbGV4Ym94ID0ge1xuICBhbGlnbkl0ZW1zOiB0cnVlLFxuICBhbGlnbkNvbnRlbnQ6IHRydWUsXG4gIGp1c3RpZnlJdGVtczogdHJ1ZSxcbiAganVzdGlmeUNvbnRlbnQ6IHRydWUsXG4gIGZsZXhXcmFwOiB0cnVlLFxuICBmbGV4RGlyZWN0aW9uOiB7XG4gICAgdHJhbnNmb3JtKHZhbHVlKSB7XG4gICAgICB2YXIgX3JldmVyc2UkdmFsdWU7XG5cbiAgICAgIHZhciB7XG4gICAgICAgIHNwYWNlLFxuICAgICAgICBkaXZpZGVcbiAgICAgIH0gPSAoX3JldmVyc2UkdmFsdWUgPSByZXZlcnNlW3ZhbHVlXSkgIT0gbnVsbCA/IF9yZXZlcnNlJHZhbHVlIDoge307XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBmbGV4RGlyZWN0aW9uOiB2YWx1ZVxuICAgICAgfTtcbiAgICAgIGlmIChzcGFjZSkgcmVzdWx0W3NwYWNlXSA9IDE7XG4gICAgICBpZiAoZGl2aWRlKSByZXN1bHRbZGl2aWRlXSA9IDE7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICB9LFxuICBzcGFjZVg6IHtcbiAgICBzdGF0aWM6IHtcbiAgICAgIFtvd2xTZWxlY3Rvcl06IHtcbiAgICAgICAgbWFyZ2luSW5saW5lU3RhcnQ6IFwiY2FsYyh2YXIoLS1jaGFrcmEtc3BhY2UteCkgKiBjYWxjKDEgLSB2YXIoLS1jaGFrcmEtc3BhY2UteC1yZXZlcnNlKSkpXCIsXG4gICAgICAgIG1hcmdpbklubGluZUVuZDogXCJjYWxjKHZhcigtLWNoYWtyYS1zcGFjZS14KSAqIHZhcigtLWNoYWtyYS1zcGFjZS14LXJldmVyc2UpKVwiXG4gICAgICB9XG4gICAgfSxcbiAgICB0cmFuc2Zvcm06IGNyZWF0ZVRyYW5zZm9ybSh7XG4gICAgICBzY2FsZTogXCJzcGFjZVwiLFxuICAgICAgdHJhbnNmb3JtOiB2YWx1ZSA9PiB2YWx1ZSAhPT0gbnVsbCA/IHtcbiAgICAgICAgXCItLWNoYWtyYS1zcGFjZS14XCI6IHZhbHVlXG4gICAgICB9IDogbnVsbFxuICAgIH0pXG4gIH0sXG4gIHNwYWNlWToge1xuICAgIHN0YXRpYzoge1xuICAgICAgW293bFNlbGVjdG9yXToge1xuICAgICAgICBtYXJnaW5Ub3A6IFwiY2FsYyh2YXIoLS1jaGFrcmEtc3BhY2UteSkgKiBjYWxjKDEgLSB2YXIoLS1jaGFrcmEtc3BhY2UteS1yZXZlcnNlKSkpXCIsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogXCJjYWxjKHZhcigtLWNoYWtyYS1zcGFjZS15KSAqIHZhcigtLWNoYWtyYS1zcGFjZS15LXJldmVyc2UpKVwiXG4gICAgICB9XG4gICAgfSxcbiAgICB0cmFuc2Zvcm06IGNyZWF0ZVRyYW5zZm9ybSh7XG4gICAgICBzY2FsZTogXCJzcGFjZVwiLFxuICAgICAgdHJhbnNmb3JtOiB2YWx1ZSA9PiB2YWx1ZSAhPSBudWxsID8ge1xuICAgICAgICBcIi0tY2hha3JhLXNwYWNlLXlcIjogdmFsdWVcbiAgICAgIH0gOiBudWxsXG4gICAgfSlcbiAgfSxcbiAgZmxleDogdHJ1ZSxcbiAgZmxleEZsb3c6IHRydWUsXG4gIGZsZXhHcm93OiB0cnVlLFxuICBmbGV4U2hyaW5rOiB0cnVlLFxuICBmbGV4QmFzaXM6IHQuc2l6ZXMoXCJmbGV4QmFzaXNcIiksXG4gIGp1c3RpZnlTZWxmOiB0cnVlLFxuICBhbGlnblNlbGY6IHRydWUsXG4gIG9yZGVyOiB0cnVlLFxuICBwbGFjZUl0ZW1zOiB0cnVlLFxuICBwbGFjZUNvbnRlbnQ6IHRydWUsXG4gIHBsYWNlU2VsZjogdHJ1ZSxcbiAgZmxleERpcjogdC5wcm9wKFwiZmxleERpcmVjdGlvblwiKVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZsZXhib3guanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBncmlkID0ge1xuICBncmlkR2FwOiB0LnNwYWNlKFwiZ3JpZEdhcFwiKSxcbiAgZ3JpZENvbHVtbkdhcDogdC5zcGFjZShcImdyaWRDb2x1bW5HYXBcIiksXG4gIGdyaWRSb3dHYXA6IHQuc3BhY2UoXCJncmlkUm93R2FwXCIpLFxuICBncmlkQ29sdW1uOiB0cnVlLFxuICBncmlkUm93OiB0cnVlLFxuICBncmlkQXV0b0Zsb3c6IHRydWUsXG4gIGdyaWRBdXRvQ29sdW1uczogdHJ1ZSxcbiAgZ3JpZENvbHVtblN0YXJ0OiB0cnVlLFxuICBncmlkQ29sdW1uRW5kOiB0cnVlLFxuICBncmlkUm93U3RhcnQ6IHRydWUsXG4gIGdyaWRSb3dFbmQ6IHRydWUsXG4gIGdyaWRBdXRvUm93czogdHJ1ZSxcbiAgZ3JpZFRlbXBsYXRlOiB0cnVlLFxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiB0cnVlLFxuICBncmlkVGVtcGxhdGVSb3dzOiB0cnVlLFxuICBncmlkVGVtcGxhdGVBcmVhczogdHJ1ZSxcbiAgZ3JpZEFyZWE6IHRydWVcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ncmlkLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgbGF5b3V0ID0ge1xuICB3aWR0aDogdC5zaXplc1QoXCJ3aWR0aFwiKSxcbiAgaW5saW5lU2l6ZTogdC5zaXplc1QoXCJpbmxpbmVTaXplXCIpLFxuICBoZWlnaHQ6IHQuc2l6ZXMoXCJoZWlnaHRcIiksXG4gIGJsb2NrU2l6ZTogdC5zaXplcyhcImJsb2NrU2l6ZVwiKSxcbiAgYm94U2l6ZTogdC5zaXplcyhbXCJ3aWR0aFwiLCBcImhlaWdodFwiXSksXG4gIG1pbldpZHRoOiB0LnNpemVzKFwibWluV2lkdGhcIiksXG4gIG1pbklubGluZVNpemU6IHQuc2l6ZXMoXCJtaW5JbmxpbmVTaXplXCIpLFxuICBtaW5IZWlnaHQ6IHQuc2l6ZXMoXCJtaW5IZWlnaHRcIiksXG4gIG1pbkJsb2NrU2l6ZTogdC5zaXplcyhcIm1pbkJsb2NrU2l6ZVwiKSxcbiAgbWF4V2lkdGg6IHQuc2l6ZXMoXCJtYXhXaWR0aFwiKSxcbiAgbWF4SW5saW5lU2l6ZTogdC5zaXplcyhcIm1heElubGluZVNpemVcIiksXG4gIG1heEhlaWdodDogdC5zaXplcyhcIm1heEhlaWdodFwiKSxcbiAgbWF4QmxvY2tTaXplOiB0LnNpemVzKFwibWF4QmxvY2tTaXplXCIpLFxuICBkOiB0LnByb3AoXCJkaXNwbGF5XCIpLFxuICBvdmVyZmxvdzogdHJ1ZSxcbiAgb3ZlcmZsb3dYOiB0cnVlLFxuICBvdmVyZmxvd1k6IHRydWUsXG4gIGRpc3BsYXk6IHRydWUsXG4gIHZlcnRpY2FsQWxpZ246IHRydWUsXG4gIGJveFNpemluZzogdHJ1ZVxufTtcbk9iamVjdC5hc3NpZ24obGF5b3V0LCB7XG4gIHc6IGxheW91dC53aWR0aCxcbiAgaDogbGF5b3V0LmhlaWdodCxcbiAgbWluVzogbGF5b3V0Lm1pbldpZHRoLFxuICBtYXhXOiBsYXlvdXQubWF4V2lkdGgsXG4gIG1pbkg6IGxheW91dC5taW5IZWlnaHQsXG4gIG1heEg6IGxheW91dC5tYXhIZWlnaHRcbn0pO1xuLyoqXG4gKiBUeXBlcyBmb3IgbGF5b3V0IHJlbGF0ZWQgQ1NTIHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGF5b3V0LmpzLm1hcCIsImltcG9ydCB7IG1lbW9pemVkR2V0IGFzIGdldCB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5cbnZhciBmbG9hdFRyYW5zZm9ybSA9ICh2YWx1ZSwgdGhlbWUpID0+IHtcbiAgdmFyIG1hcCA9IHtcbiAgICBsZWZ0OiBcInJpZ2h0XCIsXG4gICAgcmlnaHQ6IFwibGVmdFwiXG4gIH07XG4gIHJldHVybiB0aGVtZS5kaXJlY3Rpb24gPT09IFwicnRsXCIgPyBtYXBbdmFsdWVdIDogdmFsdWU7XG59O1xuXG52YXIgc3JPbmx5ID0ge1xuICBib3JkZXI6IFwiMHB4XCIsXG4gIGNsaXA6IFwicmVjdCgwLCAwLCAwLCAwKVwiLFxuICB3aWR0aDogXCIxcHhcIixcbiAgaGVpZ2h0OiBcIjFweFwiLFxuICBtYXJnaW46IFwiLTFweFwiLFxuICBwYWRkaW5nOiBcIjBweFwiLFxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgd2hpdGVTcGFjZTogXCJub3dyYXBcIixcbiAgcG9zaXRpb246IFwiYWJzb2x1dGVcIlxufTtcbnZhciBzckZvY3VzYWJsZSA9IHtcbiAgcG9zaXRpb246IFwic3RhdGljXCIsXG4gIHdpZHRoOiBcImF1dG9cIixcbiAgaGVpZ2h0OiBcImF1dG9cIixcbiAgY2xpcDogXCJhdXRvXCIsXG4gIHBhZGRpbmc6IFwiMFwiLFxuICBtYXJnaW46IFwiMFwiLFxuICBvdmVyZmxvdzogXCJ2aXNpYmxlXCIsXG4gIHdoaXRlU3BhY2U6IFwibm9ybWFsXCJcbn07XG5cbnZhciBnZXRXaXRoUHJpb3JpdHkgPSAodGhlbWUsIGtleSwgc3R5bGVzKSA9PiB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgdmFyIG9iaiA9IGdldCh0aGVtZSwga2V5LCB7fSk7XG5cbiAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICB2YXIgaXNJblN0eWxlcyA9IHByb3AgaW4gc3R5bGVzICYmIHN0eWxlc1twcm9wXSAhPSBudWxsO1xuICAgIGlmICghaXNJblN0eWxlcykgcmVzdWx0W3Byb3BdID0gb2JqW3Byb3BdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCB2YXIgb3RoZXJzID0ge1xuICBhbmltYXRpb246IHRydWUsXG4gIGFwcGVhcmFuY2U6IHRydWUsXG4gIHZpc2liaWxpdHk6IHRydWUsXG4gIHVzZXJTZWxlY3Q6IHRydWUsXG4gIHBvaW50ZXJFdmVudHM6IHRydWUsXG4gIGN1cnNvcjogdHJ1ZSxcbiAgcmVzaXplOiB0cnVlLFxuICBvYmplY3RGaXQ6IHRydWUsXG4gIG9iamVjdFBvc2l0aW9uOiB0cnVlLFxuICBmbG9hdDoge1xuICAgIHByb3BlcnR5OiBcImZsb2F0XCIsXG4gICAgdHJhbnNmb3JtOiBmbG9hdFRyYW5zZm9ybVxuICB9LFxuICB3aWxsQ2hhbmdlOiB0cnVlLFxuICBmaWx0ZXI6IHRydWUsXG4gIGNsaXBQYXRoOiB0cnVlLFxuICBzck9ubHk6IHtcbiAgICB0cmFuc2Zvcm0odmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkgcmV0dXJuIHNyT25seTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gXCJmb2N1c2FibGVcIikgcmV0dXJuIHNyRm9jdXNhYmxlO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICB9LFxuICBsYXllclN0eWxlOiB7XG4gICAgcHJvY2Vzc1Jlc3VsdDogdHJ1ZSxcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZSwgdGhlbWUsIHN0eWxlcykgPT4gZ2V0V2l0aFByaW9yaXR5KHRoZW1lLCBcImxheWVyU3R5bGVzLlwiICsgdmFsdWUsIHN0eWxlcylcbiAgfSxcbiAgdGV4dFN0eWxlOiB7XG4gICAgcHJvY2Vzc1Jlc3VsdDogdHJ1ZSxcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZSwgdGhlbWUsIHN0eWxlcykgPT4gZ2V0V2l0aFByaW9yaXR5KHRoZW1lLCBcInRleHRTdHlsZXMuXCIgKyB2YWx1ZSwgc3R5bGVzKVxuICB9LFxuICBhcHBseToge1xuICAgIHByb2Nlc3NSZXN1bHQ6IHRydWUsXG4gICAgdHJhbnNmb3JtOiAodmFsdWUsIHRoZW1lLCBzdHlsZXMpID0+IGdldFdpdGhQcmlvcml0eSh0aGVtZSwgdmFsdWUsIHN0eWxlcylcbiAgfVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW90aGVycy5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIHBvc2l0aW9uID0ge1xuICBwb3NpdGlvbjogdHJ1ZSxcbiAgcG9zOiB0LnByb3AoXCJwb3NpdGlvblwiKSxcbiAgekluZGV4OiB0LnByb3AoXCJ6SW5kZXhcIiwgXCJ6SW5kaWNlc1wiKSxcbiAgaW5zZXQ6IHQuc3BhY2VUKFtcInRvcFwiLCBcInJpZ2h0XCIsIFwiYm90dG9tXCIsIFwibGVmdFwiXSksXG4gIGluc2V0WDogdC5zcGFjZVQoW1wibGVmdFwiLCBcInJpZ2h0XCJdKSxcbiAgaW5zZXRJbmxpbmU6IHQuc3BhY2VUKFwiaW5zZXRJbmxpbmVcIiksXG4gIGluc2V0WTogdC5zcGFjZVQoW1widG9wXCIsIFwiYm90dG9tXCJdKSxcbiAgaW5zZXRCbG9jazogdC5zcGFjZVQoXCJpbnNldEJsb2NrXCIpLFxuICB0b3A6IHQuc3BhY2VUKFwidG9wXCIpLFxuICBpbnNldEJsb2NrU3RhcnQ6IHQuc3BhY2VUKFwiaW5zZXRCbG9ja1N0YXJ0XCIpLFxuICBib3R0b206IHQuc3BhY2VUKFwiYm90dG9tXCIpLFxuICBpbnNldEJsb2NrRW5kOiB0LnNwYWNlVChcImluc2V0QmxvY2tFbmRcIiksXG4gIGxlZnQ6IHQuc3BhY2VUKFwibGVmdFwiKSxcbiAgaW5zZXRJbmxpbmVTdGFydDogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJzcGFjZVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwibGVmdFwiLFxuICAgICAgcnRsOiBcInJpZ2h0XCJcbiAgICB9XG4gIH0pLFxuICByaWdodDogdC5zcGFjZVQoXCJyaWdodFwiKSxcbiAgaW5zZXRJbmxpbmVFbmQ6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwic3BhY2VcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBcInJpZ2h0XCIsXG4gICAgICBydGw6IFwibGVmdFwiXG4gICAgfVxuICB9KVxufTtcbk9iamVjdC5hc3NpZ24ocG9zaXRpb24sIHtcbiAgaW5zZXRTdGFydDogcG9zaXRpb24uaW5zZXRJbmxpbmVTdGFydCxcbiAgaW5zZXRFbmQ6IHBvc2l0aW9uLmluc2V0SW5saW5lRW5kXG59KTtcbi8qKlxuICogVHlwZXMgZm9yIHBvc2l0aW9uIENTUyBwcm9wZXJ0aWVzXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBvc2l0aW9uLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgc2hhZG93ID0ge1xuICBib3hTaGFkb3c6IHQuc2hhZG93cyhcImJveFNoYWRvd1wiKSxcbiAgdGV4dFNoYWRvdzogdC5zaGFkb3dzKFwidGV4dFNoYWRvd1wiKVxufTtcbk9iamVjdC5hc3NpZ24oc2hhZG93LCB7XG4gIHNoYWRvdzogc2hhZG93LmJveFNoYWRvd1xufSk7XG4vKipcbiAqIFR5cGVzIGZvciBib3ggYW5kIHRleHQgc2hhZG93IHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hhZG93LmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgc3BhY2UgPSB7XG4gIG1hcmdpbjogdC5zcGFjZVQoXCJtYXJnaW5cIiksXG4gIG1hcmdpblRvcDogdC5zcGFjZVQoXCJtYXJnaW5Ub3BcIiksXG4gIG1hcmdpbkJsb2NrU3RhcnQ6IHQuc3BhY2VUKFwibWFyZ2luQmxvY2tTdGFydFwiKSxcbiAgbWFyZ2luUmlnaHQ6IHQuc3BhY2VUKFwibWFyZ2luUmlnaHRcIiksXG4gIG1hcmdpbklubGluZUVuZDogdC5zcGFjZVQoXCJtYXJnaW5JbmxpbmVFbmRcIiksXG4gIG1hcmdpbkJvdHRvbTogdC5zcGFjZVQoXCJtYXJnaW5Cb3R0b21cIiksXG4gIG1hcmdpbkJsb2NrRW5kOiB0LnNwYWNlVChcIm1hcmdpbkJsb2NrRW5kXCIpLFxuICBtYXJnaW5MZWZ0OiB0LnNwYWNlVChcIm1hcmdpbkxlZnRcIiksXG4gIG1hcmdpbklubGluZVN0YXJ0OiB0LnNwYWNlVChcIm1hcmdpbklubGluZVN0YXJ0XCIpLFxuICBtYXJnaW5YOiB0LnNwYWNlVChbXCJtYXJnaW5JbmxpbmVTdGFydFwiLCBcIm1hcmdpbklubGluZUVuZFwiXSksXG4gIG1hcmdpbklubGluZTogdC5zcGFjZVQoXCJtYXJnaW5JbmxpbmVcIiksXG4gIG1hcmdpblk6IHQuc3BhY2VUKFtcIm1hcmdpblRvcFwiLCBcIm1hcmdpbkJvdHRvbVwiXSksXG4gIG1hcmdpbkJsb2NrOiB0LnNwYWNlVChcIm1hcmdpbkJsb2NrXCIpLFxuICBwYWRkaW5nOiB0LnNwYWNlKFwicGFkZGluZ1wiKSxcbiAgcGFkZGluZ1RvcDogdC5zcGFjZShcInBhZGRpbmdUb3BcIiksXG4gIHBhZGRpbmdCbG9ja1N0YXJ0OiB0LnNwYWNlKFwicGFkZGluZ0Jsb2NrU3RhcnRcIiksXG4gIHBhZGRpbmdSaWdodDogdC5zcGFjZShcInBhZGRpbmdSaWdodFwiKSxcbiAgcGFkZGluZ0JvdHRvbTogdC5zcGFjZShcInBhZGRpbmdCb3R0b21cIiksXG4gIHBhZGRpbmdCbG9ja0VuZDogdC5zcGFjZShcInBhZGRpbmdCbG9ja0VuZFwiKSxcbiAgcGFkZGluZ0xlZnQ6IHQuc3BhY2UoXCJwYWRkaW5nTGVmdFwiKSxcbiAgcGFkZGluZ0lubGluZVN0YXJ0OiB0LnNwYWNlKFwicGFkZGluZ0lubGluZVN0YXJ0XCIpLFxuICBwYWRkaW5nSW5saW5lRW5kOiB0LnNwYWNlKFwicGFkZGluZ0lubGluZUVuZFwiKSxcbiAgcGFkZGluZ1g6IHQuc3BhY2UoW1wicGFkZGluZ0lubGluZVN0YXJ0XCIsIFwicGFkZGluZ0lubGluZUVuZFwiXSksXG4gIHBhZGRpbmdJbmxpbmU6IHQuc3BhY2UoXCJwYWRkaW5nSW5saW5lXCIpLFxuICBwYWRkaW5nWTogdC5zcGFjZShbXCJwYWRkaW5nVG9wXCIsIFwicGFkZGluZ0JvdHRvbVwiXSksXG4gIHBhZGRpbmdCbG9jazogdC5zcGFjZShcInBhZGRpbmdCbG9ja1wiKVxufTtcbk9iamVjdC5hc3NpZ24oc3BhY2UsIHtcbiAgbTogc3BhY2UubWFyZ2luLFxuICBtdDogc3BhY2UubWFyZ2luVG9wLFxuICBtcjogc3BhY2UubWFyZ2luUmlnaHQsXG4gIG1lOiBzcGFjZS5tYXJnaW5JbmxpbmVFbmQsXG4gIG1hcmdpbkVuZDogc3BhY2UubWFyZ2luSW5saW5lRW5kLFxuICBtYjogc3BhY2UubWFyZ2luQm90dG9tLFxuICBtbDogc3BhY2UubWFyZ2luTGVmdCxcbiAgbXM6IHNwYWNlLm1hcmdpbklubGluZVN0YXJ0LFxuICBtYXJnaW5TdGFydDogc3BhY2UubWFyZ2luSW5saW5lU3RhcnQsXG4gIG14OiBzcGFjZS5tYXJnaW5YLFxuICBteTogc3BhY2UubWFyZ2luWSxcbiAgcDogc3BhY2UucGFkZGluZyxcbiAgcHQ6IHNwYWNlLnBhZGRpbmdUb3AsXG4gIHB5OiBzcGFjZS5wYWRkaW5nWSxcbiAgcHg6IHNwYWNlLnBhZGRpbmdYLFxuICBwYjogc3BhY2UucGFkZGluZ0JvdHRvbSxcbiAgcGw6IHNwYWNlLnBhZGRpbmdMZWZ0LFxuICBwczogc3BhY2UucGFkZGluZ0lubGluZVN0YXJ0LFxuICBwYWRkaW5nU3RhcnQ6IHNwYWNlLnBhZGRpbmdJbmxpbmVTdGFydCxcbiAgcHI6IHNwYWNlLnBhZGRpbmdSaWdodCxcbiAgcGU6IHNwYWNlLnBhZGRpbmdJbmxpbmVFbmQsXG4gIHBhZGRpbmdFbmQ6IHNwYWNlLnBhZGRpbmdJbmxpbmVFbmRcbn0pO1xuLyoqXG4gKiBUeXBlcyBmb3Igc3BhY2UgcmVsYXRlZCBDU1MgcHJvcGVydGllc1xuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZS5qcy5tYXAiLCJpbXBvcnQgeyBweCB9IGZyb20gXCIuLi9jcmVhdGUtdHJhbnNmb3JtXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIHR5cG9ncmFwaHkgPSB7XG4gIGZvbnRGYW1pbHk6IHQucHJvcChcImZvbnRGYW1pbHlcIiwgXCJmb250c1wiKSxcbiAgZm9udFNpemU6IHQucHJvcChcImZvbnRTaXplXCIsIFwiZm9udFNpemVzXCIsIHB4KSxcbiAgZm9udFdlaWdodDogdC5wcm9wKFwiZm9udFdlaWdodFwiLCBcImZvbnRXZWlnaHRzXCIpLFxuICBsaW5lSGVpZ2h0OiB0LnByb3AoXCJsaW5lSGVpZ2h0XCIsIFwibGluZUhlaWdodHNcIiksXG4gIGxldHRlclNwYWNpbmc6IHQucHJvcChcImxldHRlclNwYWNpbmdcIiwgXCJsZXR0ZXJTcGFjaW5nc1wiKSxcbiAgdGV4dEFsaWduOiB0cnVlLFxuICBmb250U3R5bGU6IHRydWUsXG4gIHdvcmRCcmVhazogdHJ1ZSxcbiAgb3ZlcmZsb3dXcmFwOiB0cnVlLFxuICB0ZXh0T3ZlcmZsb3c6IHRydWUsXG4gIHRleHRUcmFuc2Zvcm06IHRydWUsXG4gIHdoaXRlU3BhY2U6IHRydWUsXG4gIHRleHREZWNvcmF0aW9uOiB0cnVlLFxuICB0ZXh0RGVjb3I6IHtcbiAgICBwcm9wZXJ0eTogXCJ0ZXh0RGVjb3JhdGlvblwiXG4gIH0sXG4gIG5vT2ZMaW5lczoge1xuICAgIHN0YXRpYzoge1xuICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICB0ZXh0T3ZlcmZsb3c6IFwiZWxsaXBzaXNcIixcbiAgICAgIGRpc3BsYXk6IFwiLXdlYmtpdC1ib3hcIixcbiAgICAgIFdlYmtpdEJveE9yaWVudDogXCJ2ZXJ0aWNhbFwiLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBXZWJraXRMaW5lQ2xhbXA6IFwidmFyKC0tY2hha3JhLWxpbmUtY2xhbXApXCJcbiAgICB9LFxuICAgIHByb3BlcnR5OiBcIi0tY2hha3JhLWxpbmUtY2xhbXBcIlxuICB9LFxuICBpc1RydW5jYXRlZDoge1xuICAgIHRyYW5zZm9ybSh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgdGV4dE92ZXJmbG93OiBcImVsbGlwc2lzXCIsXG4gICAgICAgICAgd2hpdGVTcGFjZTogXCJub3dyYXBcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICB9XG59O1xuLyoqXG4gKiBUeXBlcyBmb3IgdHlwb2dyYXBoeSByZWxhdGVkIENTUyBwcm9wZXJ0aWVzXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXR5cG9ncmFwaHkuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuLyoqXG4gKiBUaGUgcGFyc2VyIGNvbmZpZ3VyYXRpb24gZm9yIGNvbW1vbiBvdXRsaW5lIHByb3BlcnRpZXNcbiAqL1xuXG5leHBvcnQgdmFyIG91dGxpbmUgPSB7XG4gIG91dGxpbmU6IHRydWUsXG4gIG91dGxpbmVPZmZzZXQ6IHRydWUsXG4gIG91dGxpbmVDb2xvcjogdC5jb2xvcnMoXCJvdXRsaW5lQ29sb3JcIiksXG4gIHJpbmdDb2xvcjogdC5wcm9wKFwiLS1jaGFrcmEtcmluZy1jb2xvclwiLCBcImNvbG9yc1wiKSxcbiAgcmluZ09mZnNldFdpZHRoOiB0LnByb3AoXCItLWNoYWtyYS1yaW5nLW9mZnNldFwiKSxcbiAgcmluZ09mZnNldENvbG9yOiB0LnByb3AoXCItLWNoYWtyYS1yaW5nLW9mZnNldC1jb2xvclwiLCBcImNvbG9yc1wiKSxcbiAgcmluZ1dpZHRoOiB0LnByb3AoXCItLWNoYWtyYS1yaW5nLW9mZnNldFwiKSxcbiAgcmluZ0luc2V0OiB0LnByb3AoXCItLWNoYWtyYS1yaW5nLWluc2V0XCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3V0bGluZS5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGxpc3QgPSB7XG4gIGxpc3RTdHlsZVR5cGU6IHRydWUsXG4gIGxpc3RTdHlsZVBvc2l0aW9uOiB0cnVlLFxuICBsaXN0U3R5bGVQb3M6IHQucHJvcChcImxpc3RTdHlsZVBvc2l0aW9uXCIpLFxuICBsaXN0U3R5bGVJbWFnZTogdHJ1ZSxcbiAgbGlzdFN0eWxlSW1nOiB0LnByb3AoXCJsaXN0U3R5bGVJbWFnZVwiKVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpc3QuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciB0cmFuc2l0aW9uID0ge1xuICB0cmFuc2l0aW9uOiB0cnVlLFxuICB0cmFuc2l0aW9uRHVyYXRpb246IHQucHJvcChcInRyYW5zaXRpb25EdXJhdGlvblwiLCBcInRyYW5zaXRpb24uZHVyYXRpb25cIiksXG4gIHRyYW5zaXRpb25Qcm9wZXJ0eTogdC5wcm9wKFwidHJhbnNpdGlvblByb3BlcnR5XCIsIFwidHJhbnNpdGlvbi5wcm9wZXJ0eVwiKSxcbiAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiB0LnByb3AoXCJ0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb25cIiwgXCJ0cmFuc2l0aW9uLmVhc2luZ1wiKVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYW5zaXRpb24uanMubWFwIiwiaW1wb3J0IHsgaXNDc3NWYXIsIGlzTnVtYmVyIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbnZhciB0ZW1wbGF0ZXMgPSB7XG4gIGF1dG86IFwidmFyKC0tY2hha3JhLXRyYW5zZm9ybSlcIixcbiAgXCJhdXRvLWdwdVwiOiBcInZhcigtLWNoYWtyYS10cmFuc2Zvcm0tZ3B1KVwiXG59O1xuXG52YXIgZGVncmVlVHJhbnNmb3JtID0gdmFsdWUgPT4ge1xuICBpZiAoaXNDc3NWYXIodmFsdWUpIHx8IHZhbHVlID09IG51bGwpIHJldHVybiB2YWx1ZTtcbiAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSA/IHZhbHVlICsgXCJkZWdcIiA6IHZhbHVlO1xufTtcblxuZXhwb3J0IHZhciB0cmFuc2Zvcm0gPSB7XG4gIHRyYW5zZm9ybToge1xuICAgIHByb3BlcnR5OiBcInRyYW5zZm9ybVwiLFxuXG4gICAgdHJhbnNmb3JtKHZhbHVlKSB7XG4gICAgICB2YXIgX3RlbXBsYXRlcyR2YWx1ZTtcblxuICAgICAgcmV0dXJuIChfdGVtcGxhdGVzJHZhbHVlID0gdGVtcGxhdGVzW3ZhbHVlXSkgIT0gbnVsbCA/IF90ZW1wbGF0ZXMkdmFsdWUgOiB2YWx1ZTtcbiAgICB9XG5cbiAgfSxcbiAgdHJhbnNmb3JtT3JpZ2luOiB0cnVlLFxuICB0cmFuc2xhdGVYOiB0LnNwYWNlVChcIi0tY2hha3JhLXRyYW5zbGF0ZS14XCIpLFxuICB0cmFuc2xhdGVZOiB0LnNwYWNlVChcIi0tY2hha3JhLXRyYW5zbGF0ZS15XCIpLFxuICByb3RhdGVYOiB7XG4gICAgcHJvcGVydHk6IFwiLS1jaGFrcmEtcm90YXRlLXhcIixcbiAgICB0cmFuc2Zvcm06IGRlZ3JlZVRyYW5zZm9ybVxuICB9LFxuICByb3RhdGVZOiB7XG4gICAgcHJvcGVydHk6IFwiLS1jaGFrcmEtcm90YXRlLXlcIixcbiAgICB0cmFuc2Zvcm06IGRlZ3JlZVRyYW5zZm9ybVxuICB9LFxuICBza2V3WDoge1xuICAgIHByb3BlcnR5OiBcIi0tY2hha3JhLXNrZXcteFwiLFxuICAgIHRyYW5zZm9ybTogZGVncmVlVHJhbnNmb3JtXG4gIH0sXG4gIHNrZXdZOiB7XG4gICAgcHJvcGVydHk6IFwiLS1jaGFrcmEtc2tldy15XCIsXG4gICAgdHJhbnNmb3JtOiBkZWdyZWVUcmFuc2Zvcm1cbiAgfVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYW5zZm9ybS5qcy5tYXAiLCJpbXBvcnQgeyBpc09iamVjdCwgcnVuSWZGbiB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG4vKipcbiAqIEV4cGFuZHMgYW4gYXJyYXkgb3Igb2JqZWN0IHN5bnRheCByZXNwb25zaXZlIHN0eWxlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBleHBhbmRSZXNwb25zaXZlKHsgbXg6IFsxLCAyXSB9KVxuICogLy8gb3JcbiAqIGV4cGFuZFJlc3BvbnNpdmUoeyBteDogeyBiYXNlOiAxLCBzbTogMiB9IH0pXG4gKlxuICogLy8gPT4geyBteDogMSwgXCJAbWVkaWEobWluLXdpZHRoOjxzbT4pXCI6IHsgbXg6IDIgfSB9XG4gKi9cblxuZXhwb3J0IHZhciBleHBhbmRSZXNwb25zaXZlID0gc3R5bGVzID0+IHRoZW1lID0+IHtcbiAgLyoqXG4gICAqIEJlZm9yZSBhbnkgc3R5bGUgY2FuIGJlIHByb2Nlc3NlZCwgdGhlIHVzZXIgbmVlZHMgdG8gY2FsbCBgdG9DU1NWYXJgXG4gICAqIHdoaWNoIGFuYWx5emVzIHRoZSB0aGVtZSdzIGJyZWFrcG9pbnQgYW5kIGFwcGVuZHMgYSBgX19icmVha3BvaW50c2AgcHJvcGVydHlcbiAgICogdG8gdGhlIHRoZW1lIHdpdGggbW9yZSBkZXRhaWxzIG9mIHRoZSBicmVha3BvaW50cy5cbiAgICpcbiAgICogVG8gbGVhcm4gbW9yZSwgZ28gaGVyZTogcGFja2FnZXMvdXRpbHMvc3JjL3Jlc3BvbnNpdmUudHMgI2FuYWx5emVCcmVha3BvaW50c1xuICAgKi9cbiAgaWYgKCF0aGVtZS5fX2JyZWFrcG9pbnRzKSByZXR1cm4gc3R5bGVzO1xuICB2YXIge1xuICAgIGlzUmVzcG9uc2l2ZSxcbiAgICB0b0FycmF5VmFsdWUsXG4gICAgbWVkaWE6IG1lZGlhc1xuICB9ID0gdGhlbWUuX19icmVha3BvaW50cztcbiAgdmFyIGNvbXB1dGVkU3R5bGVzID0ge307XG5cbiAgZm9yICh2YXIga2V5IGluIHN0eWxlcykge1xuICAgIHZhciB2YWx1ZSA9IHJ1bklmRm4oc3R5bGVzW2tleV0sIHRoZW1lKTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgY29udGludWU7IC8vIGNvbnZlcnRzIHRoZSBvYmplY3QgcmVzcG9uc2l2ZSBzeW50YXggdG8gYXJyYXkgc3ludGF4XG5cbiAgICB2YWx1ZSA9IGlzT2JqZWN0KHZhbHVlKSAmJiBpc1Jlc3BvbnNpdmUodmFsdWUpID8gdG9BcnJheVZhbHVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgY29tcHV0ZWRTdHlsZXNba2V5XSA9IHZhbHVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHF1ZXJpZXMgPSB2YWx1ZS5zbGljZSgwLCBtZWRpYXMubGVuZ3RoKS5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgcXVlcmllczsgaW5kZXggKz0gMSkge1xuICAgICAgdmFyIG1lZGlhID0gbWVkaWFzID09IG51bGwgPyB2b2lkIDAgOiBtZWRpYXNbaW5kZXhdO1xuXG4gICAgICBpZiAoIW1lZGlhKSB7XG4gICAgICAgIGNvbXB1dGVkU3R5bGVzW2tleV0gPSB2YWx1ZVtpbmRleF07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb21wdXRlZFN0eWxlc1ttZWRpYV0gPSBjb21wdXRlZFN0eWxlc1ttZWRpYV0gfHwge307XG5cbiAgICAgIGlmICh2YWx1ZVtpbmRleF0gPT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29tcHV0ZWRTdHlsZXNbbWVkaWFdW2tleV0gPSB2YWx1ZVtpbmRleF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbXB1dGVkU3R5bGVzO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4cGFuZC1yZXNwb25zaXZlLmpzLm1hcCIsImltcG9ydCB7IG9iamVjdEtleXMgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xudmFyIGdyb3VwID0ge1xuICBob3Zlcjogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjpob3ZlciAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1ob3Zlcl0gJlwiLFxuICBmb2N1czogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjpmb2N1cyAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1mb2N1c10gJlwiLFxuICBhY3RpdmU6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6YWN0aXZlICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWFjdGl2ZV0gJlwiLFxuICBkaXNhYmxlZDogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjpkaXNhYmxlZCAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1kaXNhYmxlZF0gJlwiLFxuICBpbnZhbGlkOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmludmFsaWQgJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtaW52YWxpZF0gJlwiLFxuICBjaGVja2VkOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmNoZWNrZWQgJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtY2hlY2tlZF0gJlwiLFxuICBpbmRldGVybWluYXRlOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmluZGV0ZXJtaW5hdGUgJiwgXCIgKyBzZWxlY3RvciArIFwiW2FyaWEtY2hlY2tlZD1taXhlZF0gJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtaW5kZXRlcm1pbmF0ZV0gJlwiLFxuICByZWFkT25seTogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjpyZWFkLW9ubHkgJiwgXCIgKyBzZWxlY3RvciArIFwiW3JlYWRvbmx5XSAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1yZWFkLW9ubHldICZcIixcbiAgZXhwYW5kZWQ6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6cmVhZC1vbmx5ICYsIFwiICsgc2VsZWN0b3IgKyBcIlthcmlhLWV4cGFuZGVkPXRydWVdICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWV4cGFuZGVkXSAmXCJcbn07XG5cbnZhciB0b0dyb3VwID0gZm4gPT4gbWVyZ2UoZm4sIFwiW3JvbGU9Z3JvdXBdXCIsIFwiW2RhdGEtZ3JvdXBdXCIsIFwiLmdyb3VwXCIpO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShmbikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc2VsZWN0b3JzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBzZWxlY3RvcnNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9ycy5tYXAoZm4pLmpvaW4oXCIsIFwiKTtcbn07XG5cbmV4cG9ydCB2YXIgcHNldWRvU2VsZWN0b3JzID0ge1xuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1Mgc2VsZWN0b3IgYCY6aG92ZXJgXG4gICAqL1xuICBfaG92ZXI6IFwiJjpob3ZlciwgJltkYXRhLWhvdmVyXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjphY3RpdmVgXG4gICAqL1xuICBfYWN0aXZlOiBcIiY6YWN0aXZlLCAmW2RhdGEtYWN0aXZlXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBzZWxlY3RvciBgJjpmb2N1c2BcbiAgICpcbiAgICovXG4gIF9mb2N1czogXCImOmZvY3VzLCAmW2RhdGEtZm9jdXNdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgdGhlIGhpZ2hsaWdodGVkIHN0YXRlLlxuICAgKi9cbiAgX2hpZ2hsaWdodGVkOiBcIiZbZGF0YS1oaWdobGlnaHRlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gYSBjaGlsZCBvZiB0aGlzIGVsZW1lbnQgaGFzIHJlY2VpdmVkIGZvY3VzXG4gICAqIC0gQ1NTIFNlbGVjdG9yIGAmOmZvY3VzLXdpdGhpbmBcbiAgICovXG4gIF9mb2N1c1dpdGhpbjogXCImOmZvY3VzLXdpdGhpblwiLFxuICBfZm9jdXNWaXNpYmxlOiBcIiY6Zm9jdXMtdmlzaWJsZVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGlzIGVsZW1lbnQgaXMgZGlzYWJsZWQuIFRoZSBwYXNzZWQgc3R5bGVzIGFyZSBhcHBsaWVkIHRvIHRoZXNlIENTUyBzZWxlY3RvcnM6XG4gICAqIC0gYCZbYXJpYS1kaXNhYmxlZD10cnVlXWBcbiAgICogLSBgJjpkaXNhYmxlZGBcbiAgICogLSBgJltkYXRhLWRpc2FibGVkXWBcbiAgICovXG4gIF9kaXNhYmxlZDogXCImW2Rpc2FibGVkXSwgJlthcmlhLWRpc2FibGVkPXRydWVdLCAmW2RhdGEtZGlzYWJsZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOnJlYWRvbmx5YFxuICAgKi9cbiAgX3JlYWRPbmx5OiBcIiZbYXJpYS1yZWFkb25seT10cnVlXSwgJltyZWFkb25seV0sICZbZGF0YS1yZWFkb25seV1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1Mgc2VsZWN0b3IgYCY6OmJlZm9yZWBcbiAgICpcbiAgICogTk9URTpXaGVuIHVzaW5nIHRoaXMsIGVuc3VyZSB0aGUgYGNvbnRlbnRgIGlzIHdyYXBwZWQgaW4gYSBiYWNrdGljay5cbiAgICogQGV4YW1wbGVcbiAgICogYGBganN4XG4gICAqIDxCb3ggX2JlZm9yZT17e2NvbnRlbnQ6YFwiXCJgIH19Lz5cbiAgICogYGBgXG4gICAqL1xuICBfYmVmb3JlOiBcIiY6OmJlZm9yZVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBzZWxlY3RvciBgJjo6YWZ0ZXJgXG4gICAqXG4gICAqIE5PVEU6V2hlbiB1c2luZyB0aGlzLCBlbnN1cmUgdGhlIGBjb250ZW50YCBpcyB3cmFwcGVkIGluIGEgYmFja3RpY2suXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGpzeFxuICAgKiA8Qm94IF9hZnRlcj17e2NvbnRlbnQ6YFwiXCJgIH19Lz5cbiAgICogYGBgXG4gICAqL1xuICBfYWZ0ZXI6IFwiJjo6YWZ0ZXJcIixcbiAgX2VtcHR5OiBcIiY6ZW1wdHlcIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhlIEFSSUEgYXR0cmlidXRlIGBhcmlhLWV4cGFuZGVkYCBpcyBgdHJ1ZWBcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbYXJpYS1leHBhbmRlZD10cnVlXWBcbiAgICovXG4gIF9leHBhbmRlZDogXCImW2FyaWEtZXhwYW5kZWQ9dHJ1ZV0sICZbZGF0YS1leHBhbmRlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhlIEFSSUEgYXR0cmlidXRlIGBhcmlhLWNoZWNrZWRgIGlzIGB0cnVlYFxuICAgKiAtIENTUyBzZWxlY3RvciBgJlthcmlhLWNoZWNrZWQ9dHJ1ZV1gXG4gICAqL1xuICBfY2hlY2tlZDogXCImW2FyaWEtY2hlY2tlZD10cnVlXSwgJltkYXRhLWNoZWNrZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoZSBBUklBIGF0dHJpYnV0ZSBgYXJpYS1ncmFiYmVkYCBpcyBgdHJ1ZWBcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbYXJpYS1ncmFiYmVkPXRydWVdYFxuICAgKi9cbiAgX2dyYWJiZWQ6IFwiJlthcmlhLWdyYWJiZWQ9dHJ1ZV0sICZbZGF0YS1ncmFiYmVkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJlthcmlhLXByZXNzZWQ9dHJ1ZV1gXG4gICAqIFR5cGljYWxseSB1c2VkIHRvIHN0eWxlIHRoZSBjdXJyZW50IFwicHJlc3NlZFwiIHN0YXRlIG9mIHRvZ2dsZSBidXR0b25zXG4gICAqL1xuICBfcHJlc3NlZDogXCImW2FyaWEtcHJlc3NlZD10cnVlXSwgJltkYXRhLXByZXNzZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoZSBBUklBIGF0dHJpYnV0ZSBgYXJpYS1pbnZhbGlkYCBpcyBgdHJ1ZWBcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbYXJpYS1pbnZhbGlkPXRydWVdYFxuICAgKi9cbiAgX2ludmFsaWQ6IFwiJlthcmlhLWludmFsaWQ9dHJ1ZV0sICZbZGF0YS1pbnZhbGlkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIHRoZSB2YWxpZCBzdGF0ZVxuICAgKiAtIENTUyBzZWxlY3RvciBgJltkYXRhLXZhbGlkXSwgJltkYXRhLXN0YXRlPXZhbGlkXWBcbiAgICovXG4gIF92YWxpZDogXCImW2RhdGEtdmFsaWRdLCAmW2RhdGEtc3RhdGU9dmFsaWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmW2FyaWEtYnVzeT10cnVlXWAgb3IgYCZbZGF0YS1sb2FkaW5nPXRydWVdYC5cbiAgICogVXNlZnVsIGZvciBzdHlsaW5nIGxvYWRpbmcgc3RhdGVzXG4gICAqL1xuICBfbG9hZGluZzogXCImW2RhdGEtbG9hZGluZ10sICZbYXJpYS1idXN5PXRydWVdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoZSBBUklBIGF0dHJpYnV0ZSBgYXJpYS1zZWxlY3RlZGAgaXMgYHRydWVgXG4gICAqXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV1gXG4gICAqL1xuICBfc2VsZWN0ZWQ6IFwiJlthcmlhLXNlbGVjdGVkPXRydWVdLCAmW2RhdGEtc2VsZWN0ZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGBbaGlkZGVuPXRydWVdYFxuICAgKi9cbiAgX2hpZGRlbjogXCImW2hpZGRlbl0sICZbZGF0YS1oaWRkZW5dXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOi13ZWJraXQtYXV0b2ZpbGxgXG4gICAqL1xuICBfYXV0b2ZpbGw6IFwiJjotd2Via2l0LWF1dG9maWxsXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOm50aC1jaGlsZChldmVuKWBcbiAgICovXG4gIF9ldmVuOiBcIiY6bnRoLW9mLXR5cGUoZXZlbilcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6bnRoLWNoaWxkKG9kZClgXG4gICAqL1xuICBfb2RkOiBcIiY6bnRoLW9mLXR5cGUob2RkKVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpmaXJzdC1vZi10eXBlYFxuICAgKi9cbiAgX2ZpcnN0OiBcIiY6Zmlyc3Qtb2YtdHlwZVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpsYXN0LW9mLXR5cGVgXG4gICAqL1xuICBfbGFzdDogXCImOmxhc3Qtb2YtdHlwZVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpub3QoOmZpcnN0LW9mLXR5cGUpYFxuICAgKi9cbiAgX25vdEZpcnN0OiBcIiY6bm90KDpmaXJzdC1vZi10eXBlKVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpub3QoOmxhc3Qtb2YtdHlwZSlgXG4gICAqL1xuICBfbm90TGFzdDogXCImOm5vdCg6bGFzdC1vZi10eXBlKVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjp2aXNpdGVkYFxuICAgKi9cbiAgX3Zpc2l0ZWQ6IFwiJjp2aXNpdGVkXCIsXG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3R5bGUgdGhlIGFjdGl2ZSBsaW5rIGluIGEgbmF2aWdhdGlvblxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJlthcmlhLWN1cnJlbnQ9cGFnZV1gXG4gICAqL1xuICBfYWN0aXZlTGluazogXCImW2FyaWEtY3VycmVudD1wYWdlXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGUgQVJJQSBhdHRyaWJ1dGUgYGFyaWEtY2hlY2tlZGAgaXMgYG1peGVkYFxuICAgKiAtIENTUyBzZWxlY3RvciBgJlthcmlhLWNoZWNrZWQ9bWl4ZWRdYFxuICAgKi9cbiAgX2luZGV0ZXJtaW5hdGU6IFwiJjppbmRldGVybWluYXRlLCAmW2FyaWEtY2hlY2tlZD1taXhlZF0sICZbZGF0YS1pbmRldGVybWluYXRlXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBwYXJlbnQgaXMgaG92ZXJlZFxuICAgKi9cbiAgX2dyb3VwSG92ZXI6IHRvR3JvdXAoZ3JvdXAuaG92ZXIpLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBwYXJlbnQgaXMgZm9jdXNlZFxuICAgKi9cbiAgX2dyb3VwRm9jdXM6IHRvR3JvdXAoZ3JvdXAuZm9jdXMpLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBwYXJlbnQgaXMgYWN0aXZlXG4gICAqL1xuICBfZ3JvdXBBY3RpdmU6IHRvR3JvdXAoZ3JvdXAuYWN0aXZlKSxcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gcGFyZW50IGlzIGRpc2FibGVkXG4gICAqL1xuICBfZ3JvdXBEaXNhYmxlZDogdG9Hcm91cChncm91cC5kaXNhYmxlZCksXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHBhcmVudCBpcyBpbnZhbGlkXG4gICAqL1xuICBfZ3JvdXBJbnZhbGlkOiB0b0dyb3VwKGdyb3VwLmludmFsaWQpLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBwYXJlbnQgaXMgY2hlY2tlZFxuICAgKi9cbiAgX2dyb3VwQ2hlY2tlZDogdG9Hcm91cChncm91cC5jaGVja2VkKSxcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6OnBsYWNlaG9sZGVyYC5cbiAgICovXG4gIF9wbGFjZWhvbGRlcjogXCImOjpwbGFjZWhvbGRlclwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpmdWxsc2NyZWVuYC5cbiAgICovXG4gIF9mdWxsU2NyZWVuOiBcIiY6ZnVsbHNjcmVlblwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjo6c2VsZWN0aW9uYFxuICAgKi9cbiAgX3NlbGVjdGlvbjogXCImOjpzZWxlY3Rpb25cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYFtkaXI9cnRsXSAmYFxuICAgKiBJdCBpcyBhcHBsaWVkIHdoZW4gYW55IHBhcmVudCBlbGVtZW50IGhhcyBgZGlyPVwicnRsXCJgXG4gICAqL1xuICBfcnRsOiBcIltkaXI9cnRsXSAmXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGBAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKWBcbiAgICogdXNlZCB3aGVuIHRoZSB1c2VyIGhhcyByZXF1ZXN0ZWQgdGhlIHN5c3RlbVxuICAgKiB1c2UgYSBsaWdodCBvciBkYXJrIGNvbG9yIHRoZW1lLlxuICAgKi9cbiAgX21lZGlhRGFyazogXCJAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIHdoZW4gYC5kYXJrYCBpcyBhcHBsaWVkIHRvIGFueSBwYXJlbnQgb2ZcbiAgICogdGhpcyBjb21wb25lbnQgb3IgZWxlbWVudC5cbiAgICovXG4gIF9kYXJrOiBcIi5kYXJrICYsIFtkYXRhLXRoZW1lPWRhcmtdICZcIlxufTtcbmV4cG9ydCB2YXIgcHNldWRvUHJvcE5hbWVzID0gb2JqZWN0S2V5cyhwc2V1ZG9TZWxlY3RvcnMpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHNldWRvcy5qcy5tYXAiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5pbXBvcnQgeyBtZXJnZVdpdGgsIG9iamVjdEtleXMgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuaW1wb3J0IHsgYmFja2dyb3VuZCwgYm9yZGVyLCBjb2xvciwgZmxleGJveCwgZ3JpZCwgbGF5b3V0LCBsaXN0LCBvdGhlcnMsIG91dGxpbmUsIHBvc2l0aW9uLCBzaGFkb3csIHNwYWNlLCB0cmFuc2Zvcm0sIHRyYW5zaXRpb24sIHR5cG9ncmFwaHkgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IHBzZXVkb1Byb3BOYW1lcywgcHNldWRvU2VsZWN0b3JzIH0gZnJvbSBcIi4vcHNldWRvc1wiO1xuZXhwb3J0IHZhciBzeXN0ZW1Qcm9wcyA9IG1lcmdlV2l0aCh7fSwgYmFja2dyb3VuZCwgYm9yZGVyLCBjb2xvciwgZmxleGJveCwgbGF5b3V0LCBvdXRsaW5lLCBncmlkLCBvdGhlcnMsIHBvc2l0aW9uLCBzaGFkb3csIHNwYWNlLCB0eXBvZ3JhcGh5LCB0cmFuc2Zvcm0sIGxpc3QsIHRyYW5zaXRpb24pO1xudmFyIGxheW91dFN5c3RlbSA9IG1lcmdlV2l0aCh7fSwgc3BhY2UsIGxheW91dCwgZmxleGJveCwgZ3JpZCwgcG9zaXRpb24pO1xuZXhwb3J0IHZhciBsYXlvdXRQcm9wTmFtZXMgPSBvYmplY3RLZXlzKGxheW91dFN5c3RlbSk7XG5leHBvcnQgdmFyIHByb3BOYW1lcyA9IFsuLi5vYmplY3RLZXlzKHN5c3RlbVByb3BzKSwgLi4ucHNldWRvUHJvcE5hbWVzXTtcblxudmFyIHN0eWxlUHJvcHMgPSBfZXh0ZW5kcyh7fSwgc3lzdGVtUHJvcHMsIHBzZXVkb1NlbGVjdG9ycyk7XG5cbmV4cG9ydCB2YXIgaXNTdHlsZVByb3AgPSBwcm9wID0+IHByb3AgaW4gc3R5bGVQcm9wcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbS5qcy5tYXAiLCJpbXBvcnQgeyBpc09iamVjdCwgbWVyZ2VXaXRoIGFzIG1lcmdlLCBydW5JZkZuLCBpc0Nzc1ZhciwgaXNTdHJpbmcgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuaW1wb3J0IHsgZXhwYW5kUmVzcG9uc2l2ZSB9IGZyb20gXCIuL2V4cGFuZC1yZXNwb25zaXZlXCI7XG5pbXBvcnQgeyBwc2V1ZG9TZWxlY3RvcnMgfSBmcm9tIFwiLi9wc2V1ZG9zXCI7XG5pbXBvcnQgeyBzeXN0ZW1Qcm9wcyBhcyBzeXN0ZW1Qcm9wQ29uZmlncyB9IGZyb20gXCIuL3N5c3RlbVwiO1xuXG52YXIgaXNDU1NWYXJpYWJsZVRva2VuVmFsdWUgPSAoa2V5LCB2YWx1ZSkgPT4ga2V5LnN0YXJ0c1dpdGgoXCItLVwiKSAmJiBpc1N0cmluZyh2YWx1ZSkgJiYgIWlzQ3NzVmFyKHZhbHVlKTtcblxudmFyIHJlc29sdmVUb2tlblZhbHVlID0gKHRoZW1lLCB2YWx1ZSkgPT4ge1xuICB2YXIgX3JlZiwgX2dldFZhcjI7XG5cbiAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiB2YWx1ZTtcblxuICB2YXIgZ2V0VmFyID0gdmFsID0+IHtcbiAgICB2YXIgX3RoZW1lJF9fY3NzTWFwLCBfdGhlbWUkX19jc3NNYXAkdmFsO1xuXG4gICAgcmV0dXJuIChfdGhlbWUkX19jc3NNYXAgPSB0aGVtZS5fX2Nzc01hcCkgPT0gbnVsbCA/IHZvaWQgMCA6IChfdGhlbWUkX19jc3NNYXAkdmFsID0gX3RoZW1lJF9fY3NzTWFwW3ZhbF0pID09IG51bGwgPyB2b2lkIDAgOiBfdGhlbWUkX19jc3NNYXAkdmFsLnZhclJlZjtcbiAgfTtcblxuICB2YXIgZ2V0VmFsdWUgPSB2YWwgPT4ge1xuICAgIHZhciBfZ2V0VmFyO1xuXG4gICAgcmV0dXJuIChfZ2V0VmFyID0gZ2V0VmFyKHZhbCkpICE9IG51bGwgPyBfZ2V0VmFyIDogdmFsO1xuICB9O1xuXG4gIHZhciB2YWx1ZVNwbGl0ID0gdmFsdWUuc3BsaXQoXCIsXCIpLm1hcCh2ID0+IHYudHJpbSgpKTtcbiAgdmFyIFt0b2tlblZhbHVlLCBmYWxsYmFja1ZhbHVlXSA9IHZhbHVlU3BsaXQ7XG4gIHZhbHVlID0gKF9yZWYgPSAoX2dldFZhcjIgPSBnZXRWYXIodG9rZW5WYWx1ZSkpICE9IG51bGwgPyBfZ2V0VmFyMiA6IGdldFZhbHVlKGZhbGxiYWNrVmFsdWUpKSAhPSBudWxsID8gX3JlZiA6IGdldFZhbHVlKHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENzcyhvcHRpb25zKSB7XG4gIHZhciB7XG4gICAgY29uZmlncyA9IHt9LFxuICAgIHBzZXVkb3MgPSB7fSxcbiAgICB0aGVtZVxuICB9ID0gb3B0aW9ucztcblxuICB2YXIgY3NzID0gZnVuY3Rpb24gY3NzKHN0eWxlc09yRm4sIG5lc3RlZCkge1xuICAgIGlmIChuZXN0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgbmVzdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIF9zdHlsZXMgPSBydW5JZkZuKHN0eWxlc09yRm4sIHRoZW1lKTtcblxuICAgIHZhciBzdHlsZXMgPSBleHBhbmRSZXNwb25zaXZlKF9zdHlsZXMpKHRoZW1lKTtcbiAgICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB7fTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzdHlsZXMpIHtcbiAgICAgIHZhciBfY29uZmlnJHRyYW5zZm9ybSwgX2NvbmZpZywgX2NvbmZpZzIsIF9jb25maWczLCBfY29uZmlnNDtcblxuICAgICAgdmFyIHZhbHVlT3JGbiA9IHN0eWxlc1trZXldO1xuICAgICAgLyoqXG4gICAgICAgKiBhbGxvd3MgdGhlIHVzZXIgdG8gcGFzcyBmdW5jdGlvbmFsIHZhbHVlc1xuICAgICAgICogYm94U2hhZG93OiB0aGVtZSA9PiBgMCAycHggMnB4ICR7dGhlbWUuY29sb3JzLnJlZH1gXG4gICAgICAgKi9cblxuICAgICAgdmFyIHZhbHVlID0gcnVuSWZGbih2YWx1ZU9yRm4sIHRoZW1lKTtcbiAgICAgIC8qKlxuICAgICAgICogY29udmVydHMgcHNldWRvIHNob3J0aGFuZHMgdG8gdmFsaWQgc2VsZWN0b3JcbiAgICAgICAqIFwiX2hvdmVyXCIgPT4gXCImOmhvdmVyXCJcbiAgICAgICAqL1xuXG4gICAgICBpZiAoa2V5IGluIHBzZXVkb3MpIHtcbiAgICAgICAga2V5ID0gcHNldWRvc1trZXldO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBhbGxvd3MgdGhlIHVzZXIgdG8gdXNlIHRoZW1lIHRva2VucyBpbiBjc3MgdmFyc1xuICAgICAgICogeyAtLWJhbm5lci1oZWlnaHQ6IFwic2l6ZXMubWRcIiB9ID0+IHsgLS1iYW5uZXItaGVpZ2h0OiBcInZhcigtLWNoYWtyYS1zaXplcy1tZClcIiB9XG4gICAgICAgKlxuICAgICAgICogWW91IGNhbiBhbHNvIHByb3ZpZGUgZmFsbGJhY2sgdmFsdWVzXG4gICAgICAgKiB7IC0tYmFubmVyLWhlaWdodDogXCJzaXplcy5uby1leGlzdCwgNDBweFwiIH0gPT4geyAtLWJhbm5lci1oZWlnaHQ6IFwiNDBweFwiIH1cbiAgICAgICAqL1xuXG5cbiAgICAgIGlmIChpc0NTU1ZhcmlhYmxlVG9rZW5WYWx1ZShrZXksIHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHJlc29sdmVUb2tlblZhbHVlKHRoZW1lLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb25maWcgPSBjb25maWdzW2tleV07XG5cbiAgICAgIGlmIChjb25maWcgPT09IHRydWUpIHtcbiAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgIHByb3BlcnR5OiBrZXlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICB2YXIgX2NvbXB1dGVkU3R5bGVzJGtleTtcblxuICAgICAgICBjb21wdXRlZFN0eWxlc1trZXldID0gKF9jb21wdXRlZFN0eWxlcyRrZXkgPSBjb21wdXRlZFN0eWxlc1trZXldKSAhPSBudWxsID8gX2NvbXB1dGVkU3R5bGVzJGtleSA6IHt9O1xuICAgICAgICBjb21wdXRlZFN0eWxlc1trZXldID0gbWVyZ2Uoe30sIGNvbXB1dGVkU3R5bGVzW2tleV0sIGNzcyh2YWx1ZSwgdHJ1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJhd1ZhbHVlID0gKF9jb25maWckdHJhbnNmb3JtID0gKF9jb25maWcgPSBjb25maWcpID09IG51bGwgPyB2b2lkIDAgOiBfY29uZmlnLnRyYW5zZm9ybSA9PSBudWxsID8gdm9pZCAwIDogX2NvbmZpZy50cmFuc2Zvcm0odmFsdWUsIHRoZW1lLCBfc3R5bGVzKSkgIT0gbnVsbCA/IF9jb25maWckdHJhbnNmb3JtIDogdmFsdWU7XG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgZm9yIGBsYXllclN0eWxlYCwgYHRleHRTdHlsZWAgYW5kIGBhcHBseWAuIEFmdGVyIGdldHRpbmcgdGhlXG4gICAgICAgKiBzdHlsZXMgaW4gdGhlIHRoZW1lLCB3ZSBuZWVkIHRvIHByb2Nlc3MgdGhlbSBzaW5jZSB0aGV5IG1pZ2h0XG4gICAgICAgKiBjb250YWluIHRoZW1lIHRva2Vucy5cbiAgICAgICAqXG4gICAgICAgKiBgcHJvY2Vzc1Jlc3VsdGAgaXMgdGhlIGNvbmZpZyBwcm9wZXJ0eSB3ZSBwYXNzIHRvIGBsYXllclN0eWxlYCwgYHRleHRTdHlsZWAgYW5kIGBhcHBseWBcbiAgICAgICAqL1xuXG4gICAgICByYXdWYWx1ZSA9IChfY29uZmlnMiA9IGNvbmZpZykgIT0gbnVsbCAmJiBfY29uZmlnMi5wcm9jZXNzUmVzdWx0ID8gY3NzKHJhd1ZhbHVlLCB0cnVlKSA6IHJhd1ZhbHVlO1xuICAgICAgLyoqXG4gICAgICAgKiBhbGxvd3MgdXMgZGVmaW5lIGNzcyBwcm9wZXJ0aWVzIGZvciBSVEwgYW5kIExUUi5cbiAgICAgICAqXG4gICAgICAgKiBjb25zdCBtYXJnaW5TdGFydCA9IHtcbiAgICAgICAqICAgcHJvcGVydHk6IHRoZW1lID0+IHRoZW1lLmRpcmVjdGlvbiA9PT0gXCJydGxcIiA/IFwibWFyZ2luUmlnaHRcIjogXCJtYXJnaW5MZWZ0XCIsXG4gICAgICAgKiB9XG4gICAgICAgKi9cblxuICAgICAgdmFyIGNvbmZpZ1Byb3BlcnR5ID0gcnVuSWZGbigoX2NvbmZpZzMgPSBjb25maWcpID09IG51bGwgPyB2b2lkIDAgOiBfY29uZmlnMy5wcm9wZXJ0eSwgdGhlbWUpO1xuXG4gICAgICBpZiAoIW5lc3RlZCAmJiAoX2NvbmZpZzQgPSBjb25maWcpICE9IG51bGwgJiYgX2NvbmZpZzQuc3RhdGljKSB7XG4gICAgICAgIHZhciBzdGF0aWNTdHlsZXMgPSBydW5JZkZuKGNvbmZpZy5zdGF0aWMsIHRoZW1lKTtcbiAgICAgICAgY29tcHV0ZWRTdHlsZXMgPSBtZXJnZSh7fSwgY29tcHV0ZWRTdHlsZXMsIHN0YXRpY1N0eWxlcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWdQcm9wZXJ0eSAmJiBBcnJheS5pc0FycmF5KGNvbmZpZ1Byb3BlcnR5KSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBvZiBjb25maWdQcm9wZXJ0eSkge1xuICAgICAgICAgIGNvbXB1dGVkU3R5bGVzW3Byb3BlcnR5XSA9IHJhd1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWdQcm9wZXJ0eSkge1xuICAgICAgICBpZiAoY29uZmlnUHJvcGVydHkgPT09IFwiJlwiICYmIGlzT2JqZWN0KHJhd1ZhbHVlKSkge1xuICAgICAgICAgIGNvbXB1dGVkU3R5bGVzID0gbWVyZ2Uoe30sIGNvbXB1dGVkU3R5bGVzLCByYXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tcHV0ZWRTdHlsZXNbY29uZmlnUHJvcGVydHldID0gcmF3VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzT2JqZWN0KHJhd1ZhbHVlKSkge1xuICAgICAgICBjb21wdXRlZFN0eWxlcyA9IG1lcmdlKHt9LCBjb21wdXRlZFN0eWxlcywgcmF3VmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29tcHV0ZWRTdHlsZXNba2V5XSA9IHJhd1ZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wdXRlZFN0eWxlcztcbiAgfTtcblxuICByZXR1cm4gY3NzO1xufVxuZXhwb3J0IHZhciBjc3MgPSBzdHlsZXMgPT4gdGhlbWUgPT4ge1xuICB2YXIgY3NzRm4gPSBnZXRDc3Moe1xuICAgIHRoZW1lLFxuICAgIHBzZXVkb3M6IHBzZXVkb1NlbGVjdG9ycyxcbiAgICBjb25maWdzOiBzeXN0ZW1Qcm9wQ29uZmlnc1xuICB9KTtcbiAgcmV0dXJuIGNzc0ZuKHN0eWxlcyk7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3NzLmpzLm1hcCIsIi8qKlxuICogVGhhbmsgeW91IEBtYXJrZGFsZ2xlaXNoIGZvciB0aGlzIHBpZWNlIG9mIGFydCFcbiAqL1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuXG5mdW5jdGlvbiByZXNvbHZlUmVmZXJlbmNlKG9wZXJhbmQpIHtcbiAgaWYgKGlzT2JqZWN0KG9wZXJhbmQpICYmIG9wZXJhbmQucmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIG9wZXJhbmQucmVmZXJlbmNlO1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyhvcGVyYW5kKTtcbn1cblxudmFyIHRvRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIHRvRXhwcmVzc2lvbihvcGVyYXRvcikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIG9wZXJhbmRzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBvcGVyYW5kcy5tYXAocmVzb2x2ZVJlZmVyZW5jZSkuam9pbihcIiBcIiArIG9wZXJhdG9yICsgXCIgXCIpLnJlcGxhY2UoL2NhbGMvZywgXCJcIik7XG59O1xuXG52YXIgX2FkZCA9IGZ1bmN0aW9uIGFkZCgpIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIG9wZXJhbmRzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gIH1cblxuICByZXR1cm4gXCJjYWxjKFwiICsgdG9FeHByZXNzaW9uKFwiK1wiLCAuLi5vcGVyYW5kcykgKyBcIilcIjtcbn07XG5cbnZhciBfc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCgpIHtcbiAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuMyksIF9rZXkzID0gMDsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgIG9wZXJhbmRzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gIH1cblxuICByZXR1cm4gXCJjYWxjKFwiICsgdG9FeHByZXNzaW9uKFwiLVwiLCAuLi5vcGVyYW5kcykgKyBcIilcIjtcbn07XG5cbnZhciBfbXVsdGlwbHkgPSBmdW5jdGlvbiBtdWx0aXBseSgpIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgIG9wZXJhbmRzW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gIH1cblxuICByZXR1cm4gXCJjYWxjKFwiICsgdG9FeHByZXNzaW9uKFwiKlwiLCAuLi5vcGVyYW5kcykgKyBcIilcIjtcbn07XG5cbnZhciBfZGl2aWRlID0gZnVuY3Rpb24gZGl2aWRlKCkge1xuICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgb3BlcmFuZHNbX2tleTVdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgfVxuXG4gIHJldHVybiBcImNhbGMoXCIgKyB0b0V4cHJlc3Npb24oXCIvXCIsIC4uLm9wZXJhbmRzKSArIFwiKVwiO1xufTtcblxudmFyIF9uZWdhdGUgPSB4ID0+IHtcbiAgdmFyIHZhbHVlID0gcmVzb2x2ZVJlZmVyZW5jZSh4KTtcblxuICBpZiAodmFsdWUgIT0gbnVsbCAmJiAhTnVtYmVyLmlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSkge1xuICAgIHJldHVybiBTdHJpbmcodmFsdWUpLnN0YXJ0c1dpdGgoXCItXCIpID8gU3RyaW5nKHZhbHVlKS5zbGljZSgxKSA6IFwiLVwiICsgdmFsdWU7XG4gIH1cblxuICByZXR1cm4gX211bHRpcGx5KHZhbHVlLCAtMSk7XG59O1xuXG5leHBvcnQgdmFyIGNhbGMgPSBPYmplY3QuYXNzaWduKHggPT4gKHtcbiAgYWRkOiBmdW5jdGlvbiBhZGQoKSB7XG4gICAgZm9yICh2YXIgX2xlbjYgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgICAgb3BlcmFuZHNbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FsYyhfYWRkKHgsIC4uLm9wZXJhbmRzKSk7XG4gIH0sXG4gIHN1YnRyYWN0OiBmdW5jdGlvbiBzdWJ0cmFjdCgpIHtcbiAgICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW43KSwgX2tleTcgPSAwOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG4gICAgICBvcGVyYW5kc1tfa2V5N10gPSBhcmd1bWVudHNbX2tleTddO1xuICAgIH1cblxuICAgIHJldHVybiBjYWxjKF9zdWJ0cmFjdCh4LCAuLi5vcGVyYW5kcykpO1xuICB9LFxuICBtdWx0aXBseTogZnVuY3Rpb24gbXVsdGlwbHkoKSB7XG4gICAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuOCksIF9rZXk4ID0gMDsgX2tleTggPCBfbGVuODsgX2tleTgrKykge1xuICAgICAgb3BlcmFuZHNbX2tleThdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FsYyhfbXVsdGlwbHkoeCwgLi4ub3BlcmFuZHMpKTtcbiAgfSxcbiAgZGl2aWRlOiBmdW5jdGlvbiBkaXZpZGUoKSB7XG4gICAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuOSksIF9rZXk5ID0gMDsgX2tleTkgPCBfbGVuOTsgX2tleTkrKykge1xuICAgICAgb3BlcmFuZHNbX2tleTldID0gYXJndW1lbnRzW19rZXk5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FsYyhfZGl2aWRlKHgsIC4uLm9wZXJhbmRzKSk7XG4gIH0sXG4gIG5lZ2F0ZTogKCkgPT4gY2FsYyhfbmVnYXRlKHgpKSxcbiAgdG9TdHJpbmc6ICgpID0+IHgudG9TdHJpbmcoKVxufSksIHtcbiAgYWRkOiBfYWRkLFxuICBzdWJ0cmFjdDogX3N1YnRyYWN0LFxuICBtdWx0aXBseTogX211bHRpcGx5LFxuICBkaXZpZGU6IF9kaXZpZGUsXG4gIG5lZ2F0ZTogX25lZ2F0ZVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jYWxjLmpzLm1hcCIsIi8qXG5cbkJhc2VkIG9mZiBnbGFtb3IncyBTdHlsZVNoZWV0LCB0aGFua3MgU3VuaWwg4p2k77iPXG5cbmhpZ2ggcGVyZm9ybWFuY2UgU3R5bGVTaGVldCBmb3IgY3NzLWluLWpzIHN5c3RlbXNcblxuLSB1c2VzIG11bHRpcGxlIHN0eWxlIHRhZ3MgYmVoaW5kIHRoZSBzY2VuZXMgZm9yIG1pbGxpb25zIG9mIHJ1bGVzXG4tIHVzZXMgYGluc2VydFJ1bGVgIGZvciBhcHBlbmRpbmcgaW4gcHJvZHVjdGlvbiBmb3IgKm11Y2gqIGZhc3RlciBwZXJmb3JtYW5jZVxuXG4vLyB1c2FnZVxuXG5pbXBvcnQgeyBTdHlsZVNoZWV0IH0gZnJvbSAnQGVtb3Rpb24vc2hlZXQnXG5cbmxldCBzdHlsZVNoZWV0ID0gbmV3IFN0eWxlU2hlZXQoeyBrZXk6ICcnLCBjb250YWluZXI6IGRvY3VtZW50LmhlYWQgfSlcblxuc3R5bGVTaGVldC5pbnNlcnQoJyNib3ggeyBib3JkZXI6IDFweCBzb2xpZCByZWQ7IH0nKVxuLSBhcHBlbmRzIGEgY3NzIHJ1bGUgaW50byB0aGUgc3R5bGVzaGVldFxuXG5zdHlsZVNoZWV0LmZsdXNoKClcbi0gZW1wdGllcyB0aGUgc3R5bGVzaGVldCBvZiBhbGwgaXRzIGNvbnRlbnRzXG5cbiovXG4vLyAkRmxvd0ZpeE1lXG5mdW5jdGlvbiBzaGVldEZvclRhZyh0YWcpIHtcbiAgaWYgKHRhZy5zaGVldCkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICByZXR1cm4gdGFnLnNoZWV0O1xuICB9IC8vIHRoaXMgd2VpcmRuZXNzIGJyb3VnaHQgdG8geW91IGJ5IGZpcmVmb3hcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5vd25lck5vZGUgPT09IHRhZykge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgcmV0dXJuIGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgdGFnLnNldEF0dHJpYnV0ZSgnZGF0YS1lbW90aW9uJywgb3B0aW9ucy5rZXkpO1xuXG4gIGlmIChvcHRpb25zLm5vbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICB0YWcuc2V0QXR0cmlidXRlKCdub25jZScsIG9wdGlvbnMubm9uY2UpO1xuICB9XG5cbiAgdGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gIHRhZy5zZXRBdHRyaWJ1dGUoJ2RhdGEtcycsICcnKTtcbiAgcmV0dXJuIHRhZztcbn1cblxudmFyIFN0eWxlU2hlZXQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHlsZVNoZWV0KG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5faW5zZXJ0VGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgdmFyIGJlZm9yZTtcblxuICAgICAgaWYgKF90aGlzLnRhZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGJlZm9yZSA9IF90aGlzLnByZXBlbmQgPyBfdGhpcy5jb250YWluZXIuZmlyc3RDaGlsZCA6IF90aGlzLmJlZm9yZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJlZm9yZSA9IF90aGlzLnRhZ3NbX3RoaXMudGFncy5sZW5ndGggLSAxXS5uZXh0U2libGluZztcbiAgICAgIH1cblxuICAgICAgX3RoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0YWcsIGJlZm9yZSk7XG5cbiAgICAgIF90aGlzLnRhZ3MucHVzaCh0YWcpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzU3BlZWR5ID0gb3B0aW9ucy5zcGVlZHkgPT09IHVuZGVmaW5lZCA/IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgOiBvcHRpb25zLnNwZWVkeTtcbiAgICB0aGlzLnRhZ3MgPSBbXTtcbiAgICB0aGlzLmN0ciA9IDA7XG4gICAgdGhpcy5ub25jZSA9IG9wdGlvbnMubm9uY2U7IC8vIGtleSBpcyB0aGUgdmFsdWUgb2YgdGhlIGRhdGEtZW1vdGlvbiBhdHRyaWJ1dGUsIGl0J3MgdXNlZCB0byBpZGVudGlmeSBkaWZmZXJlbnQgc2hlZXRzXG5cbiAgICB0aGlzLmtleSA9IG9wdGlvbnMua2V5O1xuICAgIHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXI7XG4gICAgdGhpcy5wcmVwZW5kID0gb3B0aW9ucy5wcmVwZW5kO1xuICAgIHRoaXMuYmVmb3JlID0gbnVsbDtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTdHlsZVNoZWV0LnByb3RvdHlwZTtcblxuICBfcHJvdG8uaHlkcmF0ZSA9IGZ1bmN0aW9uIGh5ZHJhdGUobm9kZXMpIHtcbiAgICBub2Rlcy5mb3JFYWNoKHRoaXMuX2luc2VydFRhZyk7XG4gIH07XG5cbiAgX3Byb3RvLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydChydWxlKSB7XG4gICAgLy8gdGhlIG1heCBsZW5ndGggaXMgaG93IG1hbnkgcnVsZXMgd2UgaGF2ZSBwZXIgc3R5bGUgdGFnLCBpdCdzIDY1MDAwIGluIHNwZWVkeSBtb2RlXG4gICAgLy8gaXQncyAxIGluIGRldiBiZWNhdXNlIHdlIGluc2VydCBzb3VyY2UgbWFwcyB0aGF0IG1hcCBhIHNpbmdsZSBydWxlIHRvIGEgbG9jYXRpb25cbiAgICAvLyBhbmQgeW91IGNhbiBvbmx5IGhhdmUgb25lIHNvdXJjZSBtYXAgcGVyIHN0eWxlIHRhZ1xuICAgIGlmICh0aGlzLmN0ciAlICh0aGlzLmlzU3BlZWR5ID8gNjUwMDAgOiAxKSA9PT0gMCkge1xuICAgICAgdGhpcy5faW5zZXJ0VGFnKGNyZWF0ZVN0eWxlRWxlbWVudCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdmFyIHRhZyA9IHRoaXMudGFnc1t0aGlzLnRhZ3MubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIGlzSW1wb3J0UnVsZSA9IHJ1bGUuY2hhckNvZGVBdCgwKSA9PT0gNjQgJiYgcnVsZS5jaGFyQ29kZUF0KDEpID09PSAxMDU7XG5cbiAgICAgIGlmIChpc0ltcG9ydFJ1bGUgJiYgdGhpcy5fYWxyZWFkeUluc2VydGVkT3JkZXJJbnNlbnNpdGl2ZVJ1bGUpIHtcbiAgICAgICAgLy8gdGhpcyB3b3VsZCBvbmx5IGNhdXNlIHByb2JsZW0gaW4gc3BlZWR5IG1vZGVcbiAgICAgICAgLy8gYnV0IHdlIGRvbid0IHdhbnQgZW5hYmxpbmcgc3BlZWR5IHRvIGFmZmVjdCB0aGUgb2JzZXJ2YWJsZSBiZWhhdmlvclxuICAgICAgICAvLyBzbyB3ZSByZXBvcnQgdGhpcyBlcnJvciBhdCBhbGwgdGltZXNcbiAgICAgICAgY29uc29sZS5lcnJvcihcIllvdSdyZSBhdHRlbXB0aW5nIHRvIGluc2VydCB0aGUgZm9sbG93aW5nIHJ1bGU6XFxuXCIgKyBydWxlICsgJ1xcblxcbmBAaW1wb3J0YCBydWxlcyBtdXN0IGJlIGJlZm9yZSBhbGwgb3RoZXIgdHlwZXMgb2YgcnVsZXMgaW4gYSBzdHlsZXNoZWV0IGJ1dCBvdGhlciBydWxlcyBoYXZlIGFscmVhZHkgYmVlbiBpbnNlcnRlZC4gUGxlYXNlIGVuc3VyZSB0aGF0IGBAaW1wb3J0YCBydWxlcyBhcmUgYmVmb3JlIGFsbCBvdGhlciBydWxlcy4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FscmVhZHlJbnNlcnRlZE9yZGVySW5zZW5zaXRpdmVSdWxlID0gdGhpcy5fYWxyZWFkeUluc2VydGVkT3JkZXJJbnNlbnNpdGl2ZVJ1bGUgfHwgIWlzSW1wb3J0UnVsZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1NwZWVkeSkge1xuICAgICAgdmFyIHNoZWV0ID0gc2hlZXRGb3JUYWcodGFnKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgdWx0cmFmYXN0IHZlcnNpb24sIHdvcmtzIGFjcm9zcyBicm93c2Vyc1xuICAgICAgICAvLyB0aGUgYmlnIGRyYXdiYWNrIGlzIHRoYXQgdGhlIGNzcyB3b24ndCBiZSBlZGl0YWJsZSBpbiBkZXZ0b29sc1xuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKHJ1bGUsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICEvOigtbW96LXBsYWNlaG9sZGVyfC1tcy1pbnB1dC1wbGFjZWhvbGRlcnwtbW96LXJlYWQtd3JpdGV8LW1vei1yZWFkLW9ubHkpey8udGVzdChydWxlKSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSB3YXMgYSBwcm9ibGVtIGluc2VydGluZyB0aGUgZm9sbG93aW5nIHJ1bGU6IFxcXCJcIiArIHJ1bGUgKyBcIlxcXCJcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcbiAgICB9XG5cbiAgICB0aGlzLmN0cisrO1xuICB9O1xuXG4gIF9wcm90by5mbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICB0aGlzLnRhZ3MuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG4gICAgICByZXR1cm4gdGFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFnKTtcbiAgICB9KTtcbiAgICB0aGlzLnRhZ3MgPSBbXTtcbiAgICB0aGlzLmN0ciA9IDA7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdGhpcy5fYWxyZWFkeUluc2VydGVkT3JkZXJJbnNlbnNpdGl2ZVJ1bGUgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFN0eWxlU2hlZXQ7XG59KCk7XG5cbmV4cG9ydCB7IFN0eWxlU2hlZXQgfTtcbiIsInZhciBlID0gXCItbXMtXCI7XG52YXIgciA9IFwiLW1vei1cIjtcbnZhciBhID0gXCItd2Via2l0LVwiO1xudmFyIGMgPSBcImNvbW1cIjtcbnZhciBuID0gXCJydWxlXCI7XG52YXIgdCA9IFwiZGVjbFwiO1xudmFyIHMgPSBcIkBwYWdlXCI7XG52YXIgdSA9IFwiQG1lZGlhXCI7XG52YXIgaSA9IFwiQGltcG9ydFwiO1xudmFyIGYgPSBcIkBjaGFyc2V0XCI7XG52YXIgbyA9IFwiQHZpZXdwb3J0XCI7XG52YXIgbCA9IFwiQHN1cHBvcnRzXCI7XG52YXIgdiA9IFwiQGRvY3VtZW50XCI7XG52YXIgaCA9IFwiQG5hbWVzcGFjZVwiO1xudmFyIHAgPSBcIkBrZXlmcmFtZXNcIjtcbnZhciBiID0gXCJAZm9udC1mYWNlXCI7XG52YXIgdyA9IFwiQGNvdW50ZXItc3R5bGVcIjtcbnZhciAkID0gXCJAZm9udC1mZWF0dXJlLXZhbHVlc1wiO1xudmFyIGsgPSBNYXRoLmFicztcbnZhciBkID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbmZ1bmN0aW9uIG0oZTIsIHIyKSB7XG4gIHJldHVybiAoKChyMiA8PCAyIF4geihlMiwgMCkpIDw8IDIgXiB6KGUyLCAxKSkgPDwgMiBeIHooZTIsIDIpKSA8PCAyIF4geihlMiwgMyk7XG59XG5mdW5jdGlvbiBnKGUyKSB7XG4gIHJldHVybiBlMi50cmltKCk7XG59XG5mdW5jdGlvbiB4KGUyLCByMikge1xuICByZXR1cm4gKGUyID0gcjIuZXhlYyhlMikpID8gZTJbMF0gOiBlMjtcbn1cbmZ1bmN0aW9uIHkoZTIsIHIyLCBhMikge1xuICByZXR1cm4gZTIucmVwbGFjZShyMiwgYTIpO1xufVxuZnVuY3Rpb24gaihlMiwgcjIpIHtcbiAgcmV0dXJuIGUyLmluZGV4T2YocjIpO1xufVxuZnVuY3Rpb24geihlMiwgcjIpIHtcbiAgcmV0dXJuIGUyLmNoYXJDb2RlQXQocjIpIHwgMDtcbn1cbmZ1bmN0aW9uIEMoZTIsIHIyLCBhMikge1xuICByZXR1cm4gZTIuc2xpY2UocjIsIGEyKTtcbn1cbmZ1bmN0aW9uIEEoZTIpIHtcbiAgcmV0dXJuIGUyLmxlbmd0aDtcbn1cbmZ1bmN0aW9uIE0oZTIpIHtcbiAgcmV0dXJuIGUyLmxlbmd0aDtcbn1cbmZ1bmN0aW9uIE8oZTIsIHIyKSB7XG4gIHJldHVybiByMi5wdXNoKGUyKSwgZTI7XG59XG5mdW5jdGlvbiBTKGUyLCByMikge1xuICByZXR1cm4gZTIubWFwKHIyKS5qb2luKFwiXCIpO1xufVxudmFyIHEgPSAxO1xudmFyIEIgPSAxO1xudmFyIEQgPSAwO1xudmFyIEUgPSAwO1xudmFyIEYgPSAwO1xudmFyIEcgPSBcIlwiO1xuZnVuY3Rpb24gSChlMiwgcjIsIGEyLCBjMiwgbjIsIHQyLCBzMikge1xuICByZXR1cm4ge3ZhbHVlOiBlMiwgcm9vdDogcjIsIHBhcmVudDogYTIsIHR5cGU6IGMyLCBwcm9wczogbjIsIGNoaWxkcmVuOiB0MiwgbGluZTogcSwgY29sdW1uOiBCLCBsZW5ndGg6IHMyLCByZXR1cm46IFwiXCJ9O1xufVxuZnVuY3Rpb24gSShlMiwgcjIsIGEyKSB7XG4gIHJldHVybiBIKGUyLCByMi5yb290LCByMi5wYXJlbnQsIGEyLCByMi5wcm9wcywgcjIuY2hpbGRyZW4sIDApO1xufVxuZnVuY3Rpb24gSigpIHtcbiAgcmV0dXJuIEY7XG59XG5mdW5jdGlvbiBLKCkge1xuICBGID0gRSA+IDAgPyB6KEcsIC0tRSkgOiAwO1xuICBpZiAoQi0tLCBGID09PSAxMClcbiAgICBCID0gMSwgcS0tO1xuICByZXR1cm4gRjtcbn1cbmZ1bmN0aW9uIEwoKSB7XG4gIEYgPSBFIDwgRCA/IHooRywgRSsrKSA6IDA7XG4gIGlmIChCKyssIEYgPT09IDEwKVxuICAgIEIgPSAxLCBxKys7XG4gIHJldHVybiBGO1xufVxuZnVuY3Rpb24gTigpIHtcbiAgcmV0dXJuIHooRywgRSk7XG59XG5mdW5jdGlvbiBQKCkge1xuICByZXR1cm4gRTtcbn1cbmZ1bmN0aW9uIFEoZTIsIHIyKSB7XG4gIHJldHVybiBDKEcsIGUyLCByMik7XG59XG5mdW5jdGlvbiBSKGUyKSB7XG4gIHN3aXRjaCAoZTIpIHtcbiAgICBjYXNlIDA6XG4gICAgY2FzZSA5OlxuICAgIGNhc2UgMTA6XG4gICAgY2FzZSAxMzpcbiAgICBjYXNlIDMyOlxuICAgICAgcmV0dXJuIDU7XG4gICAgY2FzZSAzMzpcbiAgICBjYXNlIDQzOlxuICAgIGNhc2UgNDQ6XG4gICAgY2FzZSA0NzpcbiAgICBjYXNlIDYyOlxuICAgIGNhc2UgNjQ6XG4gICAgY2FzZSAxMjY6XG4gICAgY2FzZSA1OTpcbiAgICBjYXNlIDEyMzpcbiAgICBjYXNlIDEyNTpcbiAgICAgIHJldHVybiA0O1xuICAgIGNhc2UgNTg6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlIDM0OlxuICAgIGNhc2UgMzk6XG4gICAgY2FzZSA0MDpcbiAgICBjYXNlIDkxOlxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSA0MTpcbiAgICBjYXNlIDkzOlxuICAgICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5mdW5jdGlvbiBUKGUyKSB7XG4gIHJldHVybiBxID0gQiA9IDEsIEQgPSBBKEcgPSBlMiksIEUgPSAwLCBbXTtcbn1cbmZ1bmN0aW9uIFUoZTIpIHtcbiAgcmV0dXJuIEcgPSBcIlwiLCBlMjtcbn1cbmZ1bmN0aW9uIFYoZTIpIHtcbiAgcmV0dXJuIGcoUShFIC0gMSwgXyhlMiA9PT0gOTEgPyBlMiArIDIgOiBlMiA9PT0gNDAgPyBlMiArIDEgOiBlMikpKTtcbn1cbmZ1bmN0aW9uIFcoZTIpIHtcbiAgcmV0dXJuIFUoWShUKGUyKSkpO1xufVxuZnVuY3Rpb24gWChlMikge1xuICB3aGlsZSAoRiA9IE4oKSlcbiAgICBpZiAoRiA8IDMzKVxuICAgICAgTCgpO1xuICAgIGVsc2VcbiAgICAgIGJyZWFrO1xuICByZXR1cm4gUihlMikgPiAyIHx8IFIoRikgPiAzID8gXCJcIiA6IFwiIFwiO1xufVxuZnVuY3Rpb24gWShlMikge1xuICB3aGlsZSAoTCgpKVxuICAgIHN3aXRjaCAoUihGKSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBPKHJlKEUgLSAxKSwgZTIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgTyhWKEYpLCBlMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgTyhkKEYpLCBlMik7XG4gICAgfVxuICByZXR1cm4gZTI7XG59XG5mdW5jdGlvbiBaKGUyLCByMikge1xuICB3aGlsZSAoLS1yMiAmJiBMKCkpXG4gICAgaWYgKEYgPCA0OCB8fCBGID4gMTAyIHx8IEYgPiA1NyAmJiBGIDwgNjUgfHwgRiA+IDcwICYmIEYgPCA5NylcbiAgICAgIGJyZWFrO1xuICByZXR1cm4gUShlMiwgUCgpICsgKHIyIDwgNiAmJiBOKCkgPT0gMzIgJiYgTCgpID09IDMyKSk7XG59XG5mdW5jdGlvbiBfKGUyKSB7XG4gIHdoaWxlIChMKCkpXG4gICAgc3dpdGNoIChGKSB7XG4gICAgICBjYXNlIGUyOlxuICAgICAgICByZXR1cm4gRTtcbiAgICAgIGNhc2UgMzQ6XG4gICAgICBjYXNlIDM5OlxuICAgICAgICByZXR1cm4gXyhlMiA9PT0gMzQgfHwgZTIgPT09IDM5ID8gZTIgOiBGKTtcbiAgICAgIGNhc2UgNDA6XG4gICAgICAgIGlmIChlMiA9PT0gNDEpXG4gICAgICAgICAgXyhlMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA5MjpcbiAgICAgICAgTCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIHJldHVybiBFO1xufVxuZnVuY3Rpb24gZWUoZTIsIHIyKSB7XG4gIHdoaWxlIChMKCkpXG4gICAgaWYgKGUyICsgRiA9PT0gNDcgKyAxMClcbiAgICAgIGJyZWFrO1xuICAgIGVsc2UgaWYgKGUyICsgRiA9PT0gNDIgKyA0MiAmJiBOKCkgPT09IDQ3KVxuICAgICAgYnJlYWs7XG4gIHJldHVybiBcIi8qXCIgKyBRKHIyLCBFIC0gMSkgKyBcIipcIiArIGQoZTIgPT09IDQ3ID8gZTIgOiBMKCkpO1xufVxuZnVuY3Rpb24gcmUoZTIpIHtcbiAgd2hpbGUgKCFSKE4oKSkpXG4gICAgTCgpO1xuICByZXR1cm4gUShlMiwgRSk7XG59XG5mdW5jdGlvbiBhZShlMikge1xuICByZXR1cm4gVShjZShcIlwiLCBudWxsLCBudWxsLCBudWxsLCBbXCJcIl0sIGUyID0gVChlMiksIDAsIFswXSwgZTIpKTtcbn1cbmZ1bmN0aW9uIGNlKGUyLCByMiwgYTIsIGMyLCBuMiwgdDIsIHMyLCB1MiwgaTIpIHtcbiAgdmFyIGYyID0gMDtcbiAgdmFyIG8yID0gMDtcbiAgdmFyIGwyID0gczI7XG4gIHZhciB2MiA9IDA7XG4gIHZhciBoMiA9IDA7XG4gIHZhciBwMiA9IDA7XG4gIHZhciBiMiA9IDE7XG4gIHZhciB3MiA9IDE7XG4gIHZhciAkMiA9IDE7XG4gIHZhciBrMiA9IDA7XG4gIHZhciBtMiA9IFwiXCI7XG4gIHZhciBnMiA9IG4yO1xuICB2YXIgeDIgPSB0MjtcbiAgdmFyIGoyID0gYzI7XG4gIHZhciB6MiA9IG0yO1xuICB3aGlsZSAodzIpXG4gICAgc3dpdGNoIChwMiA9IGsyLCBrMiA9IEwoKSkge1xuICAgICAgY2FzZSAzNDpcbiAgICAgIGNhc2UgMzk6XG4gICAgICBjYXNlIDkxOlxuICAgICAgY2FzZSA0MDpcbiAgICAgICAgejIgKz0gVihrMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA5OlxuICAgICAgY2FzZSAxMDpcbiAgICAgIGNhc2UgMTM6XG4gICAgICBjYXNlIDMyOlxuICAgICAgICB6MiArPSBYKHAyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDkyOlxuICAgICAgICB6MiArPSBaKFAoKSAtIDEsIDcpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIGNhc2UgNDc6XG4gICAgICAgIHN3aXRjaCAoTigpKSB7XG4gICAgICAgICAgY2FzZSA0MjpcbiAgICAgICAgICBjYXNlIDQ3OlxuICAgICAgICAgICAgTyh0ZShlZShMKCksIFAoKSksIHIyLCBhMiksIGkyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB6MiArPSBcIi9cIjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTIzICogYjI6XG4gICAgICAgIHUyW2YyKytdID0gQSh6MikgKiAkMjtcbiAgICAgIGNhc2UgMTI1ICogYjI6XG4gICAgICBjYXNlIDU5OlxuICAgICAgY2FzZSAwOlxuICAgICAgICBzd2l0Y2ggKGsyKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGNhc2UgMTI1OlxuICAgICAgICAgICAgdzIgPSAwO1xuICAgICAgICAgIGNhc2UgNTkgKyBvMjpcbiAgICAgICAgICAgIGlmIChoMiA+IDAgJiYgQSh6MikgLSBsMilcbiAgICAgICAgICAgICAgTyhoMiA+IDMyID8gc2UoejIgKyBcIjtcIiwgYzIsIGEyLCBsMiAtIDEpIDogc2UoeSh6MiwgXCIgXCIsIFwiXCIpICsgXCI7XCIsIGMyLCBhMiwgbDIgLSAyKSwgaTIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA1OTpcbiAgICAgICAgICAgIHoyICs9IFwiO1wiO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBPKGoyID0gbmUoejIsIHIyLCBhMiwgZjIsIG8yLCBuMiwgdTIsIG0yLCBnMiA9IFtdLCB4MiA9IFtdLCBsMiksIHQyKTtcbiAgICAgICAgICAgIGlmIChrMiA9PT0gMTIzKVxuICAgICAgICAgICAgICBpZiAobzIgPT09IDApXG4gICAgICAgICAgICAgICAgY2UoejIsIHIyLCBqMiwgajIsIGcyLCB0MiwgbDIsIHUyLCB4Mik7XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHYyKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIDEwMDpcbiAgICAgICAgICAgICAgICAgIGNhc2UgMTA5OlxuICAgICAgICAgICAgICAgICAgY2FzZSAxMTU6XG4gICAgICAgICAgICAgICAgICAgIGNlKGUyLCBqMiwgajIsIGMyICYmIE8obmUoZTIsIGoyLCBqMiwgMCwgMCwgbjIsIHUyLCBtMiwgbjIsIGcyID0gW10sIGwyKSwgeDIpLCBuMiwgeDIsIGwyLCB1MiwgYzIgPyBnMiA6IHgyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjZSh6MiwgajIsIGoyLCBqMiwgW1wiXCJdLCB4MiwgbDIsIHUyLCB4Mik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGYyID0gbzIgPSBoMiA9IDAsIGIyID0gJDIgPSAxLCBtMiA9IHoyID0gXCJcIiwgbDIgPSBzMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDU4OlxuICAgICAgICBsMiA9IDEgKyBBKHoyKSwgaDIgPSBwMjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChiMiA8IDEpIHtcbiAgICAgICAgICBpZiAoazIgPT0gMTIzKVxuICAgICAgICAgICAgLS1iMjtcbiAgICAgICAgICBlbHNlIGlmIChrMiA9PSAxMjUgJiYgYjIrKyA9PSAwICYmIEsoKSA9PSAxMjUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHoyICs9IGQoazIpLCBrMiAqIGIyKSB7XG4gICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICQyID0gbzIgPiAwID8gMSA6ICh6MiArPSBcIlxcZlwiLCAtMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ0OlxuICAgICAgICAgICAgdTJbZjIrK10gPSAoQSh6MikgLSAxKSAqICQyLCAkMiA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDY0OlxuICAgICAgICAgICAgaWYgKE4oKSA9PT0gNDUpXG4gICAgICAgICAgICAgIHoyICs9IFYoTCgpKTtcbiAgICAgICAgICAgIHYyID0gTigpLCBvMiA9IEEobTIgPSB6MiArPSByZShQKCkpKSwgazIrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNDU6XG4gICAgICAgICAgICBpZiAocDIgPT09IDQ1ICYmIEEoejIpID09IDIpXG4gICAgICAgICAgICAgIGIyID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgcmV0dXJuIHQyO1xufVxuZnVuY3Rpb24gbmUoZTIsIHIyLCBhMiwgYzIsIHQyLCBzMiwgdTIsIGkyLCBmMiwgbzIsIGwyKSB7XG4gIHZhciB2MiA9IHQyIC0gMTtcbiAgdmFyIGgyID0gdDIgPT09IDAgPyBzMiA6IFtcIlwiXTtcbiAgdmFyIHAyID0gTShoMik7XG4gIGZvciAodmFyIGIyID0gMCwgdzIgPSAwLCAkMiA9IDA7IGIyIDwgYzI7ICsrYjIpXG4gICAgZm9yICh2YXIgZDIgPSAwLCBtMiA9IEMoZTIsIHYyICsgMSwgdjIgPSBrKHcyID0gdTJbYjJdKSksIHgyID0gZTI7IGQyIDwgcDI7ICsrZDIpXG4gICAgICBpZiAoeDIgPSBnKHcyID4gMCA/IGgyW2QyXSArIFwiIFwiICsgbTIgOiB5KG0yLCAvJlxcZi9nLCBoMltkMl0pKSlcbiAgICAgICAgZjJbJDIrK10gPSB4MjtcbiAgcmV0dXJuIEgoZTIsIHIyLCBhMiwgdDIgPT09IDAgPyBuIDogaTIsIGYyLCBvMiwgbDIpO1xufVxuZnVuY3Rpb24gdGUoZTIsIHIyLCBhMikge1xuICByZXR1cm4gSChlMiwgcjIsIGEyLCBjLCBkKEooKSksIEMoZTIsIDIsIC0yKSwgMCk7XG59XG5mdW5jdGlvbiBzZShlMiwgcjIsIGEyLCBjMikge1xuICByZXR1cm4gSChlMiwgcjIsIGEyLCB0LCBDKGUyLCAwLCBjMiksIEMoZTIsIGMyICsgMSwgLTEpLCBjMik7XG59XG5mdW5jdGlvbiB1ZShjMiwgbjIpIHtcbiAgc3dpdGNoIChtKGMyLCBuMikpIHtcbiAgICBjYXNlIDUxMDM6XG4gICAgICByZXR1cm4gYSArIFwicHJpbnQtXCIgKyBjMiArIGMyO1xuICAgIGNhc2UgNTczNzpcbiAgICBjYXNlIDQyMDE6XG4gICAgY2FzZSAzMTc3OlxuICAgIGNhc2UgMzQzMzpcbiAgICBjYXNlIDE2NDE6XG4gICAgY2FzZSA0NDU3OlxuICAgIGNhc2UgMjkyMTpcbiAgICBjYXNlIDU1NzI6XG4gICAgY2FzZSA2MzU2OlxuICAgIGNhc2UgNTg0NDpcbiAgICBjYXNlIDMxOTE6XG4gICAgY2FzZSA2NjQ1OlxuICAgIGNhc2UgMzAwNTpcbiAgICBjYXNlIDYzOTE6XG4gICAgY2FzZSA1ODc5OlxuICAgIGNhc2UgNTYyMzpcbiAgICBjYXNlIDYxMzU6XG4gICAgY2FzZSA0NTk5OlxuICAgIGNhc2UgNDg1NTpcbiAgICBjYXNlIDQyMTU6XG4gICAgY2FzZSA2Mzg5OlxuICAgIGNhc2UgNTEwOTpcbiAgICBjYXNlIDUzNjU6XG4gICAgY2FzZSA1NjIxOlxuICAgIGNhc2UgMzgyOTpcbiAgICAgIHJldHVybiBhICsgYzIgKyBjMjtcbiAgICBjYXNlIDUzNDk6XG4gICAgY2FzZSA0MjQ2OlxuICAgIGNhc2UgNDgxMDpcbiAgICBjYXNlIDY5Njg6XG4gICAgY2FzZSAyNzU2OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIHIgKyBjMiArIGUgKyBjMiArIGMyO1xuICAgIGNhc2UgNjgyODpcbiAgICBjYXNlIDQyNjg6XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIGMyICsgYzI7XG4gICAgY2FzZSA2MTY1OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyBcImZsZXgtXCIgKyBjMiArIGMyO1xuICAgIGNhc2UgNTE4NzpcbiAgICAgIHJldHVybiBhICsgYzIgKyB5KGMyLCAvKFxcdyspLisoOlteXSspLywgYSArIFwiYm94LSQxJDJcIiArIGUgKyBcImZsZXgtJDEkMlwiKSArIGMyO1xuICAgIGNhc2UgNTQ0MzpcbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgXCJmbGV4LWl0ZW0tXCIgKyB5KGMyLCAvZmxleC18LXNlbGYvLCBcIlwiKSArIGMyO1xuICAgIGNhc2UgNDY3NTpcbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgXCJmbGV4LWxpbmUtcGFja1wiICsgeShjMiwgL2FsaWduLWNvbnRlbnR8ZmxleC18LXNlbGYvLCBcIlwiKSArIGMyO1xuICAgIGNhc2UgNTU0ODpcbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgeShjMiwgXCJzaHJpbmtcIiwgXCJuZWdhdGl2ZVwiKSArIGMyO1xuICAgIGNhc2UgNTI5MjpcbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgeShjMiwgXCJiYXNpc1wiLCBcInByZWZlcnJlZC1zaXplXCIpICsgYzI7XG4gICAgY2FzZSA2MDYwOlxuICAgICAgcmV0dXJuIGEgKyBcImJveC1cIiArIHkoYzIsIFwiLWdyb3dcIiwgXCJcIikgKyBhICsgYzIgKyBlICsgeShjMiwgXCJncm93XCIsIFwicG9zaXRpdmVcIikgKyBjMjtcbiAgICBjYXNlIDQ1NTQ6XG4gICAgICByZXR1cm4gYSArIHkoYzIsIC8oW14tXSkodHJhbnNmb3JtKS9nLCBcIiQxXCIgKyBhICsgXCIkMlwiKSArIGMyO1xuICAgIGNhc2UgNjE4NzpcbiAgICAgIHJldHVybiB5KHkoeShjMiwgLyh6b29tLXxncmFiKS8sIGEgKyBcIiQxXCIpLCAvKGltYWdlLXNldCkvLCBhICsgXCIkMVwiKSwgYzIsIFwiXCIpICsgYzI7XG4gICAgY2FzZSA1NDk1OlxuICAgIGNhc2UgMzk1OTpcbiAgICAgIHJldHVybiB5KGMyLCAvKGltYWdlLXNldFxcKFteXSopLywgYSArIFwiJDEkYCQxXCIpO1xuICAgIGNhc2UgNDk2ODpcbiAgICAgIHJldHVybiB5KHkoYzIsIC8oLis6KShmbGV4LSk/KC4qKS8sIGEgKyBcImJveC1wYWNrOiQzXCIgKyBlICsgXCJmbGV4LXBhY2s6JDNcIiksIC9zListYlteO10rLywgXCJqdXN0aWZ5XCIpICsgYSArIGMyICsgYzI7XG4gICAgY2FzZSA0MDk1OlxuICAgIGNhc2UgMzU4MzpcbiAgICBjYXNlIDQwNjg6XG4gICAgY2FzZSAyNTMyOlxuICAgICAgcmV0dXJuIHkoYzIsIC8oLispLWlubGluZSguKykvLCBhICsgXCIkMSQyXCIpICsgYzI7XG4gICAgY2FzZSA4MTE2OlxuICAgIGNhc2UgNzA1OTpcbiAgICBjYXNlIDU3NTM6XG4gICAgY2FzZSA1NTM1OlxuICAgIGNhc2UgNTQ0NTpcbiAgICBjYXNlIDU3MDE6XG4gICAgY2FzZSA0OTMzOlxuICAgIGNhc2UgNDY3NzpcbiAgICBjYXNlIDU1MzM6XG4gICAgY2FzZSA1Nzg5OlxuICAgIGNhc2UgNTAyMTpcbiAgICBjYXNlIDQ3NjU6XG4gICAgICBpZiAoQShjMikgLSAxIC0gbjIgPiA2KVxuICAgICAgICBzd2l0Y2ggKHooYzIsIG4yICsgMSkpIHtcbiAgICAgICAgICBjYXNlIDEwOTpcbiAgICAgICAgICAgIGlmICh6KGMyLCBuMiArIDQpICE9PSA0NSlcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAxMDI6XG4gICAgICAgICAgICByZXR1cm4geShjMiwgLyguKzopKC4rKS0oW15dKykvLCBcIiQxXCIgKyBhICsgXCIkMi0kMyQxXCIgKyByICsgKHooYzIsIG4yICsgMykgPT0gMTA4ID8gXCIkM1wiIDogXCIkMi0kM1wiKSkgKyBjMjtcbiAgICAgICAgICBjYXNlIDExNTpcbiAgICAgICAgICAgIHJldHVybiB+aihjMiwgXCJzdHJldGNoXCIpID8gdWUoeShjMiwgXCJzdHJldGNoXCIsIFwiZmlsbC1hdmFpbGFibGVcIiksIG4yKSArIGMyIDogYzI7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgNDk0OTpcbiAgICAgIGlmICh6KGMyLCBuMiArIDEpICE9PSAxMTUpXG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgNjQ0NDpcbiAgICAgIHN3aXRjaCAoeihjMiwgQShjMikgLSAzIC0gKH5qKGMyLCBcIiFpbXBvcnRhbnRcIikgJiYgMTApKSkge1xuICAgICAgICBjYXNlIDEwNzpcbiAgICAgICAgICByZXR1cm4geShjMiwgXCI6XCIsIFwiOlwiICsgYSkgKyBjMjtcbiAgICAgICAgY2FzZSAxMDE6XG4gICAgICAgICAgcmV0dXJuIHkoYzIsIC8oLis6KShbXjshXSspKDt8IS4rKT8vLCBcIiQxXCIgKyBhICsgKHooYzIsIDE0KSA9PT0gNDUgPyBcImlubGluZS1cIiA6IFwiXCIpICsgXCJib3gkMyQxXCIgKyBhICsgXCIkMiQzJDFcIiArIGUgKyBcIiQyYm94JDNcIikgKyBjMjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgNTkzNjpcbiAgICAgIHN3aXRjaCAoeihjMiwgbjIgKyAxMSkpIHtcbiAgICAgICAgY2FzZSAxMTQ6XG4gICAgICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyB5KGMyLCAvW3N2aF1cXHcrLVt0YmxyXXsyfS8sIFwidGJcIikgKyBjMjtcbiAgICAgICAgY2FzZSAxMDg6XG4gICAgICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyB5KGMyLCAvW3N2aF1cXHcrLVt0YmxyXXsyfS8sIFwidGItcmxcIikgKyBjMjtcbiAgICAgICAgY2FzZSA0NTpcbiAgICAgICAgICByZXR1cm4gYSArIGMyICsgZSArIHkoYzIsIC9bc3ZoXVxcdystW3RibHJdezJ9LywgXCJsclwiKSArIGMyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyBjMiArIGMyO1xuICB9XG4gIHJldHVybiBjMjtcbn1cbmZ1bmN0aW9uIGllKGUyLCByMikge1xuICB2YXIgYTIgPSBcIlwiO1xuICB2YXIgYzIgPSBNKGUyKTtcbiAgZm9yICh2YXIgbjIgPSAwOyBuMiA8IGMyOyBuMisrKVxuICAgIGEyICs9IHIyKGUyW24yXSwgbjIsIGUyLCByMikgfHwgXCJcIjtcbiAgcmV0dXJuIGEyO1xufVxuZnVuY3Rpb24gZmUoZTIsIHIyLCBhMiwgczIpIHtcbiAgc3dpdGNoIChlMi50eXBlKSB7XG4gICAgY2FzZSBpOlxuICAgIGNhc2UgdDpcbiAgICAgIHJldHVybiBlMi5yZXR1cm4gPSBlMi5yZXR1cm4gfHwgZTIudmFsdWU7XG4gICAgY2FzZSBjOlxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgY2FzZSBuOlxuICAgICAgZTIudmFsdWUgPSBlMi5wcm9wcy5qb2luKFwiLFwiKTtcbiAgfVxuICByZXR1cm4gQShhMiA9IGllKGUyLmNoaWxkcmVuLCBzMikpID8gZTIucmV0dXJuID0gZTIudmFsdWUgKyBcIntcIiArIGEyICsgXCJ9XCIgOiBcIlwiO1xufVxuZnVuY3Rpb24gb2UoZTIpIHtcbiAgdmFyIHIyID0gTShlMik7XG4gIHJldHVybiBmdW5jdGlvbihhMiwgYzIsIG4yLCB0Mikge1xuICAgIHZhciBzMiA9IFwiXCI7XG4gICAgZm9yICh2YXIgdTIgPSAwOyB1MiA8IHIyOyB1MisrKVxuICAgICAgczIgKz0gZTJbdTJdKGEyLCBjMiwgbjIsIHQyKSB8fCBcIlwiO1xuICAgIHJldHVybiBzMjtcbiAgfTtcbn1cbmZ1bmN0aW9uIGxlKGUyKSB7XG4gIHJldHVybiBmdW5jdGlvbihyMikge1xuICAgIGlmICghcjIucm9vdCkge1xuICAgICAgaWYgKHIyID0gcjIucmV0dXJuKVxuICAgICAgICBlMihyMik7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gdmUoYzIsIHMyLCB1MiwgaTIpIHtcbiAgaWYgKCFjMi5yZXR1cm4pXG4gICAgc3dpdGNoIChjMi50eXBlKSB7XG4gICAgICBjYXNlIHQ6XG4gICAgICAgIGMyLnJldHVybiA9IHVlKGMyLnZhbHVlLCBjMi5sZW5ndGgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgcDpcbiAgICAgICAgcmV0dXJuIGllKFtJKHkoYzIudmFsdWUsIFwiQFwiLCBcIkBcIiArIGEpLCBjMiwgXCJcIildLCBpMik7XG4gICAgICBjYXNlIG46XG4gICAgICAgIGlmIChjMi5sZW5ndGgpXG4gICAgICAgICAgcmV0dXJuIFMoYzIucHJvcHMsIGZ1bmN0aW9uKG4yKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHgobjIsIC8oOjpwbGFjXFx3K3w6cmVhZC1cXHcrKS8pKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCI6cmVhZC1vbmx5XCI6XG4gICAgICAgICAgICAgIGNhc2UgXCI6cmVhZC13cml0ZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBpZShbSSh5KG4yLCAvOihyZWFkLVxcdyspLywgXCI6XCIgKyByICsgXCIkMVwiKSwgYzIsIFwiXCIpXSwgaTIpO1xuICAgICAgICAgICAgICBjYXNlIFwiOjpwbGFjZWhvbGRlclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBpZShbSSh5KG4yLCAvOihwbGFjXFx3KykvLCBcIjpcIiArIGEgKyBcImlucHV0LSQxXCIpLCBjMiwgXCJcIiksIEkoeShuMiwgLzoocGxhY1xcdyspLywgXCI6XCIgKyByICsgXCIkMVwiKSwgYzIsIFwiXCIpLCBJKHkobjIsIC86KHBsYWNcXHcrKS8sIGUgKyBcImlucHV0LSQxXCIpLCBjMiwgXCJcIildLCBpMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBoZShlMikge1xuICBzd2l0Y2ggKGUyLnR5cGUpIHtcbiAgICBjYXNlIG46XG4gICAgICBlMi5wcm9wcyA9IGUyLnByb3BzLm1hcChmdW5jdGlvbihyMikge1xuICAgICAgICByZXR1cm4gUyhXKHIyKSwgZnVuY3Rpb24ocjMsIGEyLCBjMikge1xuICAgICAgICAgIHN3aXRjaCAoeihyMywgMCkpIHtcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgIHJldHVybiBDKHIzLCAxLCBBKHIzKSk7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgY2FzZSA0MzpcbiAgICAgICAgICAgIGNhc2UgNjI6XG4gICAgICAgICAgICBjYXNlIDEyNjpcbiAgICAgICAgICAgICAgcmV0dXJuIHIzO1xuICAgICAgICAgICAgY2FzZSA1ODpcbiAgICAgICAgICAgICAgaWYgKGMyWysrYTJdID09PSBcImdsb2JhbFwiKVxuICAgICAgICAgICAgICAgIGMyW2EyXSA9IFwiXCIsIGMyWysrYTJdID0gXCJcXGZcIiArIEMoYzJbYTJdLCBhMiA9IDEsIC0xKTtcbiAgICAgICAgICAgIGNhc2UgMzI6XG4gICAgICAgICAgICAgIHJldHVybiBhMiA9PT0gMSA/IFwiXCIgOiByMztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHN3aXRjaCAoYTIpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICBlMiA9IHIzO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIE0oYzIpID4gMSA/IFwiXCIgOiByMztcbiAgICAgICAgICAgICAgICBjYXNlIChhMiA9IE0oYzIpIC0gMSk6XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGEyID09PSAyID8gcjMgKyBlMiArIGUyIDogcjMgKyBlMjtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHIzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG59XG5leHBvcnQge2YgYXMgQ0hBUlNFVCwgYyBhcyBDT01NRU5ULCB3IGFzIENPVU5URVJfU1RZTEUsIHQgYXMgREVDTEFSQVRJT04sIHYgYXMgRE9DVU1FTlQsIGIgYXMgRk9OVF9GQUNFLCAkIGFzIEZPTlRfRkVBVFVSRV9WQUxVRVMsIGkgYXMgSU1QT1JULCBwIGFzIEtFWUZSQU1FUywgdSBhcyBNRURJQSwgciBhcyBNT1osIGUgYXMgTVMsIGggYXMgTkFNRVNQQUNFLCBzIGFzIFBBR0UsIG4gYXMgUlVMRVNFVCwgbCBhcyBTVVBQT1JUUywgbyBhcyBWSUVXUE9SVCwgYSBhcyBXRUJLSVQsIGsgYXMgYWJzLCBUIGFzIGFsbG9jLCBPIGFzIGFwcGVuZCwgUCBhcyBjYXJldCwgSiBhcyBjaGFyLCBGIGFzIGNoYXJhY3RlciwgRyBhcyBjaGFyYWN0ZXJzLCB6IGFzIGNoYXJhdCwgQiBhcyBjb2x1bW4sIFMgYXMgY29tYmluZSwgdGUgYXMgY29tbWVudCwgZWUgYXMgY29tbWVudGVyLCBhZSBhcyBjb21waWxlLCBJIGFzIGNvcHksIFUgYXMgZGVhbGxvYywgc2UgYXMgZGVjbGFyYXRpb24sIFYgYXMgZGVsaW1pdCwgXyBhcyBkZWxpbWl0ZXIsIFogYXMgZXNjYXBpbmcsIGQgYXMgZnJvbSwgbSBhcyBoYXNoLCByZSBhcyBpZGVudGlmaWVyLCBqIGFzIGluZGV4b2YsIEQgYXMgbGVuZ3RoLCBxIGFzIGxpbmUsIHggYXMgbWF0Y2gsIG9lIGFzIG1pZGRsZXdhcmUsIGhlIGFzIG5hbWVzcGFjZSwgTCBhcyBuZXh0LCBIIGFzIG5vZGUsIGNlIGFzIHBhcnNlLCBOIGFzIHBlZWssIEUgYXMgcG9zaXRpb24sIHVlIGFzIHByZWZpeCwgdmUgYXMgcHJlZml4ZXIsIEsgYXMgcHJldiwgeSBhcyByZXBsYWNlLCBuZSBhcyBydWxlc2V0LCBsZSBhcyBydWxlc2hlZXQsIGllIGFzIHNlcmlhbGl6ZSwgTSBhcyBzaXplb2YsIFEgYXMgc2xpY2UsIGZlIGFzIHN0cmluZ2lmeSwgQSBhcyBzdHJsZW4sIEMgYXMgc3Vic3RyLCBSIGFzIHRva2VuLCBXIGFzIHRva2VuaXplLCBZIGFzIHRva2VuaXplciwgZyBhcyB0cmltLCBYIGFzIHdoaXRlc3BhY2V9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxld29nSUNKMlpYSnphVzl1SWpvZ015d0tJQ0FpYzI5MWNtTmxjeUk2SUZzaUwyaHZiV1V2Y25WdWJtVnlMM2R2Y21zdmJXOXVaWGt2Ylc5dVpYa3ZibTlrWlY5dGIyUjFiR1Z6TDNOMGVXeHBjeTlrYVhOMEwzTjBlV3hwY3k1dGFuTWlYU3dLSUNBaWJXRndjR2x1WjNNaU9pQWlRVUZCUVN4SlFVRkpMRWxCUVVVN1FVRkJUeXhKUVVGSkxFbEJRVVU3UVVGQlVTeEpRVUZKTEVsQlFVVTdRVUZCVnl4SlFVRkpMRWxCUVVVN1FVRkJUeXhKUVVGSkxFbEJRVVU3UVVGQlR5eEpRVUZKTEVsQlFVVTdRVUZCVHl4SlFVRkpMRWxCUVVVN1FVRkJVU3hKUVVGSkxFbEJRVVU3UVVGQlV5eEpRVUZKTEVsQlFVVTdRVUZCVlN4SlFVRkpMRWxCUVVVN1FVRkJWeXhKUVVGSkxFbEJRVVU3UVVGQldTeEpRVUZKTEVsQlFVVTdRVUZCV1N4SlFVRkpMRWxCUVVVN1FVRkJXU3hKUVVGSkxFbEJRVVU3UVVGQllTeEpRVUZKTEVsQlFVVTdRVUZCWVN4SlFVRkpMRWxCUVVVN1FVRkJZU3hKUVVGSkxFbEJRVVU3UVVGQmFVSXNTVUZCU1N4SlFVRkZPMEZCUVhWQ0xFbEJRVWtzU1VGQlJTeExRVUZMTzBGQlFVa3NTVUZCU1N4SlFVRkZMRTlCUVU4N1FVRkJZU3hYUVVGWExFbEJRVVVzU1VGQlJUdEJRVUZETEZOQlFWTXNVMEZCUnl4SlFVRkZMRVZCUVVVc1NVRkJSU3hQUVVGTExFbEJRVVVzUlVGQlJTeEpRVUZGTEU5QlFVc3NTVUZCUlN4RlFVRkZMRWxCUVVVc1QwRkJTeXhKUVVGRkxFVkJRVVVzU1VGQlJUdEJRVUZCTzBGQlFVY3NWMEZCVnl4SlFVRkZPMEZCUVVNc1UwRkJUeXhIUVVGRk8wRkJRVUU3UVVGQlR5eFhRVUZYTEVsQlFVVXNTVUZCUlR0QlFVRkRMRk5CUVU4c1RVRkJSU3hIUVVGRkxFdEJRVXNzVDBGQlNTeEhRVUZGTEV0QlFVYzdRVUZCUVR0QlFVRkZMRmRCUVZjc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZQTEVkQlFVVXNVVUZCVVN4SlFVRkZPMEZCUVVFN1FVRkJSeXhYUVVGWExFbEJRVVVzU1VGQlJUdEJRVUZETEZOQlFVOHNSMEZCUlN4UlFVRlJPMEZCUVVFN1FVRkJSeXhYUVVGWExFbEJRVVVzU1VGQlJUdEJRVUZETEZOQlFVOHNSMEZCUlN4WFFVRlhMRTFCUVVjN1FVRkJRVHRCUVVGRkxGZEJRVmNzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRlBMRWRCUVVVc1RVRkJUU3hKUVVGRk8wRkJRVUU3UVVGQlJ5eFhRVUZYTEVsQlFVVTdRVUZCUXl4VFFVRlBMRWRCUVVVN1FVRkJRVHRCUVVGUExGZEJRVmNzU1VGQlJUdEJRVUZETEZOQlFVOHNSMEZCUlR0QlFVRkJPMEZCUVU4c1YwRkJWeXhKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZQTEVkQlFVVXNTMEZCU3l4TFFVRkhPMEZCUVVFN1FVRkJSU3hYUVVGWExFbEJRVVVzU1VGQlJUdEJRVUZETEZOQlFVOHNSMEZCUlN4SlFVRkpMRWxCUVVjc1MwRkJTenRCUVVGQk8wRkJRVWtzU1VGQlNTeEpRVUZGTzBGQlFVVXNTVUZCU1N4SlFVRkZPMEZCUVVVc1NVRkJTU3hKUVVGRk8wRkJRVVVzU1VGQlNTeEpRVUZGTzBGQlFVVXNTVUZCU1N4SlFVRkZPMEZCUVVVc1NVRkJTU3hKUVVGRk8wRkJRVWNzVjBGQlZ5eEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRk8wRkJRVU1zVTBGQlRTeERRVUZETEU5QlFVMHNTVUZCUlN4TlFVRkxMRWxCUVVVc1VVRkJUeXhKUVVGRkxFMUJRVXNzU1VGQlJTeFBRVUZOTEVsQlFVVXNWVUZCVXl4SlFVRkZMRTFCUVVzc1IwRkJSU3hSUVVGUExFZEJRVVVzVVVGQlR5eEpRVUZGTEZGQlFVODdRVUZCUVR0QlFVRkpMRmRCUVZjc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZQTEVWQlFVVXNTVUZCUlN4SFFVRkZMRTFCUVVzc1IwRkJSU3hSUVVGUExFbEJRVVVzUjBGQlJTeFBRVUZOTEVkQlFVVXNWVUZCVXp0QlFVRkJPMEZCUVVjc1lVRkJXVHRCUVVGRExGTkJRVTg3UVVGQlFUdEJRVUZGTEdGQlFWazdRVUZCUXl4TlFVRkZMRWxCUVVVc1NVRkJSU3hGUVVGRkxFZEJRVVVzUlVGQlJTeExRVUZITzBGQlFVVXNUVUZCUnl4TFFVRkpMRTFCUVVrN1FVRkJSeXhSUVVGRkxFZEJRVVU3UVVGQlNTeFRRVUZQTzBGQlFVRTdRVUZCUlN4aFFVRlpPMEZCUVVNc1RVRkJSU3hKUVVGRkxFbEJRVVVzUlVGQlJTeEhRVUZGTEU5QlFVczdRVUZCUlN4TlFVRkhMRXRCUVVrc1RVRkJTVHRCUVVGSExGRkJRVVVzUjBGQlJUdEJRVUZKTEZOQlFVODdRVUZCUVR0QlFVRkZMR0ZCUVZrN1FVRkJReXhUUVVGUExFVkJRVVVzUjBGQlJUdEJRVUZCTzBGQlFVY3NZVUZCV1R0QlFVRkRMRk5CUVU4N1FVRkJRVHRCUVVGRkxGZEJRVmNzU1VGQlJTeEpRVUZGTzBGQlFVTXNVMEZCVHl4RlFVRkZMRWRCUVVVc1NVRkJSVHRCUVVGQk8wRkJRVWNzVjBGQlZ5eEpRVUZGTzBGQlFVTXNWVUZCVHp0QlFVRkJMRk5CUVZFN1FVRkJRU3hUUVVGUE8wRkJRVUVzVTBGQlR6dEJRVUZCTEZOQlFWRTdRVUZCUVN4VFFVRlJPMEZCUVVjc1lVRkJUenRCUVVGQkxGTkJRVTg3UVVGQlFTeFRRVUZSTzBGQlFVRXNVMEZCVVR0QlFVRkJMRk5CUVZFN1FVRkJRU3hUUVVGUk8wRkJRVUVzVTBGQlVUdEJRVUZCTEZOQlFWRTdRVUZCUVN4VFFVRlRPMEZCUVVFc1UwRkJVVHRCUVVGQkxGTkJRVk03UVVGQlNTeGhRVUZQTzBGQlFVRXNVMEZCVHp0QlFVRkhMR0ZCUVU4N1FVRkJRU3hUUVVGUE8wRkJRVUVzVTBGQlVUdEJRVUZCTEZOQlFWRTdRVUZCUVN4VFFVRlJPMEZCUVVjc1lVRkJUenRCUVVGQkxGTkJRVTg3UVVGQlFTeFRRVUZSTzBGQlFVY3NZVUZCVHp0QlFVRkJPMEZCUVVVc1UwRkJUenRCUVVGQk8wRkJRVVVzVjBGQlZ5eEpRVUZGTzBGQlFVTXNVMEZCVHl4SlFVRkZMRWxCUVVVc1IwRkJSU3hKUVVGRkxFVkJRVVVzU1VGQlJTeExRVUZITEVsQlFVVXNSMEZCUlR0QlFVRkJPMEZCUVVjc1YwRkJWeXhKUVVGRk8wRkJRVU1zVTBGQlR5eEpRVUZGTEVsQlFVYzdRVUZCUVR0QlFVRkZMRmRCUVZjc1NVRkJSVHRCUVVGRExGTkJRVThzUlVGQlJTeEZRVUZGTEVsQlFVVXNSMEZCUlN4RlFVRkZMRTlCUVVrc1MwRkJSeXhMUVVGRkxFbEJRVVVzVDBGQlNTeExRVUZITEV0QlFVVXNTVUZCUlR0QlFVRkJPMEZCUVVzc1YwRkJWeXhKUVVGRk8wRkJRVU1zVTBGQlR5eEZRVUZGTEVWQlFVVXNSVUZCUlR0QlFVRkJPMEZCUVVzc1YwRkJWeXhKUVVGRk8wRkJRVU1zVTBGQlRTeEpRVUZGTzBGQlFVa3NVVUZCUnl4SlFVRkZPMEZCUVVjN1FVRkJRVHRCUVVGVE8wRkJRVTBzVTBGQlR5eEZRVUZGTEUxQlFVY3NTMEZCUnl4RlFVRkZMRXRCUVVjc1NVRkJSU3hMUVVGSE8wRkJRVUU3UVVGQlNTeFhRVUZYTEVsQlFVVTdRVUZCUXl4VFFVRk5PMEZCUVVrc1dVRkJUeXhGUVVGRk8wRkJRVUVzVjBGQlV6dEJRVUZGTEZWQlFVVXNSMEZCUnl4SlFVRkZMRWxCUVVjN1FVRkJSenRCUVVGQkxGZEJRVmM3UVVGQlJTeFZRVUZGTEVWQlFVVXNTVUZCUnp0QlFVRkhPMEZCUVVFN1FVRkJZeXhWUVVGRkxFVkJRVVVzU1VGQlJ6dEJRVUZCTzBGQlFVY3NVMEZCVHp0QlFVRkJPMEZCUVVVc1YwRkJWeXhKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZOTEVWQlFVVXNUVUZCUnp0QlFVRkpMRkZCUVVjc1NVRkJSU3hOUVVGSkxFbEJRVVVzVDBGQlN5eEpRVUZGTEUxQlFVa3NTVUZCUlN4TlFVRkpMRWxCUVVVc1RVRkJTU3hKUVVGRk8wRkJRVWM3UVVGQlRTeFRRVUZQTEVWQlFVVXNTVUZCUlN4TlFVRkxMRTFCUVVVc1MwRkJSeXhQUVVGTExFMUJRVWtzVDBGQlN6dEJRVUZCTzBGQlFVc3NWMEZCVnl4SlFVRkZPMEZCUVVNc1UwRkJUVHRCUVVGSkxGbEJRVTg3UVVGQlFTeFhRVUZSTzBGQlFVVXNaVUZCVHp0QlFVRkJMRmRCUVU4N1FVRkJRU3hYUVVGUk8wRkJRVWNzWlVGQlR5eEZRVUZGTEU5QlFVa3NUVUZCU1N4UFFVRkpMRXRCUVVjc1MwRkJSVHRCUVVGQkxGZEJRVkU3UVVGQlJ5eFpRVUZITEU5QlFVazdRVUZCUnl4WlFVRkZPMEZCUVVjN1FVRkJRU3hYUVVGWE8wRkJRVWM3UVVGQlNUdEJRVUZCTzBGQlFVMHNVMEZCVHp0QlFVRkJPMEZCUVVVc1dVRkJXU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZOTzBGQlFVa3NVVUZCUnl4TFFVRkZMRTFCUVVrc1MwRkJSenRCUVVGSE8wRkJRVUVzWVVGQll5eExRVUZGTEUxQlFVa3NTMEZCUnl4TlFVRkpMRkZCUVUwN1FVRkJSenRCUVVGTkxGTkJRVTBzVDBGQlN5eEZRVUZGTEVsQlFVVXNTVUZCUlN4TFFVRkhMRTFCUVVrc1JVRkJSU3hQUVVGSkxFdEJRVWNzUzBGQlJUdEJRVUZCTzBGQlFVc3NXVUZCV1N4SlFVRkZPMEZCUVVNc1UwRkJUU3hEUVVGRExFVkJRVVU3UVVGQlN6dEJRVUZKTEZOQlFVOHNSVUZCUlN4SlFVRkZPMEZCUVVFN1FVRkJSeXhaUVVGWkxFbEJRVVU3UVVGQlF5eFRRVUZQTEVWQlFVVXNSMEZCUnl4SlFVRkhMRTFCUVVzc1RVRkJTeXhOUVVGTExFTkJRVU1zUzBGQlNTeExRVUZGTEVWQlFVVXNTMEZCUnl4SFFVRkZMRU5CUVVNc1NVRkJSenRCUVVGQk8wRkJRVWtzV1VGQldTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJUdEJRVUZETEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGSExFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEZOQlFVMDdRVUZCUlN4WlFVRlBMRXRCUVVVc1NVRkJSU3hMUVVGRk8wRkJRVUVzVjBGQlZUdEJRVUZCTEZkQlFWRTdRVUZCUVN4WFFVRlJPMEZCUVVFc1YwRkJVVHRCUVVGSExHTkJRVWNzUlVGQlJUdEJRVUZITzBGQlFVRXNWMEZCVnp0QlFVRkJMRmRCUVU4N1FVRkJRU3hYUVVGUk8wRkJRVUVzVjBGQlVUdEJRVUZITEdOQlFVY3NSVUZCUlR0QlFVRkhPMEZCUVVFc1YwRkJWenRCUVVGSExHTkJRVWNzUlVGQlJTeE5RVUZKTEVkQlFVVTdRVUZCUnp0QlFVRkJMRmRCUVdNN1FVRkJSeXhuUWtGQlR6dEJRVUZCTEdWQlFWVTdRVUZCUVN4bFFVRlJPMEZCUVVjc1kwRkJSU3hIUVVGSExFZEJRVWNzUzBGQlNTeE5RVUZMTEVsQlFVVXNTMEZCUnp0QlFVRkhPMEZCUVVFN1FVRkJZeXhyUWtGQlJ6dEJRVUZCTzBGQlFVazdRVUZCUVN4WFFVRlhMRTFCUVVrN1FVRkJSU3hYUVVGRkxGRkJRVXNzUlVGQlJTeE5RVUZITzBGQlFVRXNWMEZCVHl4TlFVRkpPMEZCUVVFc1YwRkJUenRCUVVGQkxGZEJRVkU3UVVGQlJTeG5Ra0ZCVHp0QlFVRkJMR1ZCUVZFN1FVRkJRU3hsUVVGUE8wRkJRVWtzYVVKQlFVVTdRVUZCUVN4bFFVRlBMRXRCUVVjN1FVRkJSU3huUWtGQlJ5eExRVUZGTEV0QlFVY3NSVUZCUlN4TlFVRkhPMEZCUVVVc1owSkJRVVVzUzBGQlJTeExRVUZITEVkQlFVY3NTMEZCUlN4TFFVRkpMRWxCUVVVc1NVRkJSU3hMUVVGRkxFdEJRVWNzUjBGQlJ5eEZRVUZGTEVsQlFVVXNTMEZCU1N4TlFVRkpMRXRCUVVrc1NVRkJSU3hKUVVGRkxFdEJRVVVzU1VGQlJ6dEJRVUZITzBGQlFVRXNaVUZCVnp0QlFVRkhMR3RDUVVGSE8wRkJRVUU3UVVGQldTeGpRVUZGTEV0QlFVVXNSMEZCUnl4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTMEZCUlN4SlFVRkhMRXRCUVVVc1NVRkJSeXhMUVVGSE8wRkJRVWNzWjBKQlFVY3NUMEZCU1R0QlFVRkpMR3RDUVVGSExFOUJRVWs3UVVGQlJTeHRRa0ZCUnl4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUVR0QlFVRlJMSGRDUVVGUE8wRkJRVUVzZFVKQlFWRTdRVUZCUVN4MVFrRkJVenRCUVVGQkxIVkNRVUZUTzBGQlFVa3NkVUpCUVVjc1NVRkJSU3hKUVVGRkxFbEJRVVVzVFVGQlJ5eEZRVUZGTEVkQlFVY3NTVUZCUlN4SlFVRkZMRWxCUVVVc1IwRkJSU3hIUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTMEZCUlN4SlFVRkhMRXRCUVVjc1MwRkJSeXhKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEV0QlFVVXNTMEZCUlR0QlFVRkhPMEZCUVVFN1FVRkJZeXgxUWtGQlJ5eEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRU5CUVVNc1MwRkJTU3hKUVVGRkxFbEJRVVVzU1VGQlJUdEJRVUZCTzBGQlFVRTdRVUZCU1N4aFFVRkZMRXRCUVVVc1MwRkJSU3hIUVVGRkxFdEJRVVVzUzBGQlJTeEhRVUZGTEV0QlFVVXNTMEZCUlN4SlFVRkhMRXRCUVVVN1FVRkJSVHRCUVVGQkxGZEJRVmM3UVVGQlJ5eGhRVUZGTEVsQlFVVXNSVUZCUlN4TFFVRkhMRXRCUVVVN1FVRkJRVHRCUVVGVkxGbEJRVWNzUzBGQlJUdEJRVUZGTEdOQlFVY3NUVUZCUnp0QlFVRkpMR05CUVVVN1FVRkJRU3h0UWtGQlZTeE5RVUZITEU5QlFVc3NVVUZCU3l4TFFVRkhMRTlCUVVzN1FVRkJTVHRCUVVGQk8wRkJRVk1zWjBKQlFVOHNUVUZCUnl4RlFVRkZMRXRCUVVjc1MwRkJSVHRCUVVGQkxHVkJRVkU3UVVGQlJ5eHBRa0ZCUlN4TFFVRkZMRWxCUVVVc1NVRkJSeXhQUVVGSExFMUJRVXM3UVVGQlNUdEJRVUZCTEdWQlFWYzdRVUZCUnl4bFFVRkZMRkZCUVUwc1IwRkJSU3hOUVVGSExFdEJRVWNzU1VGQlJTeExRVUZGTzBGQlFVVTdRVUZCUVN4bFFVRlhPMEZCUVVjc1owSkJRVWNzVVVGQlRUdEJRVUZITEc5Q1FVRkhMRVZCUVVVN1FVRkJTeXhwUWtGQlJTeExRVUZKTEV0QlFVVXNSVUZCUlN4TFFVRkZMRTFCUVVjc1IwRkJSeXhQUVVGTk8wRkJRVWs3UVVGQlFTeGxRVUZYTzBGQlFVY3NaMEpCUVVjc1QwRkJTU3hOUVVGSkxFVkJRVVVzVDBGQlNUdEJRVUZGTEcxQ1FVRkZPMEZCUVVFN1FVRkJRVHRCUVVGSExGTkJRVTg3UVVGQlFUdEJRVUZGTEZsQlFWa3NTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZPMEZCUVVNc1RVRkJTU3hMUVVGRkxFdEJRVVU3UVVGQlJTeE5RVUZKTEV0QlFVVXNUMEZCU1N4SlFVRkZMRXRCUVVVc1EwRkJRenRCUVVGSkxFMUJRVWtzUzBGQlJTeEZRVUZGTzBGQlFVY3NWMEZCVVN4TFFVRkZMRWRCUVVVc1MwRkJSU3hIUVVGRkxFdEJRVVVzUjBGQlJTeExRVUZGTEVsQlFVVXNSVUZCUlR0QlFVRkZMR0ZCUVZFc1MwRkJSU3hIUVVGRkxFdEJRVVVzUlVGQlJTeEpRVUZGTEV0QlFVVXNSMEZCUlN4TFFVRkZMRVZCUVVVc1MwRkJSU3hIUVVGRkxFOUJRVXNzUzBGQlJTeEpRVUZGTEV0QlFVVXNTVUZCUlN4RlFVRkZPMEZCUVVVc1ZVRkJSeXhMUVVGRkxFVkJRVVVzUzBGQlJTeEpRVUZGTEVkQlFVVXNUVUZCUnl4TlFVRkpMRXRCUVVVc1JVRkJSU3hKUVVGRkxGRkJRVThzUjBGQlJUdEJRVUZMTEZkQlFVVXNVVUZCU3p0QlFVRkZMRk5CUVU4c1JVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeFBRVUZKTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSVHRCUVVGQk8wRkJRVWNzV1VGQldTeEpRVUZGTEVsQlFVVXNTVUZCUlR0QlFVRkRMRk5CUVU4c1JVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEhRVUZGTEVWQlFVVXNUVUZCU3l4RlFVRkZMRWxCUVVVc1IwRkJSU3hMUVVGSk8wRkJRVUU3UVVGQlJ5eFpRVUZaTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGUExFVkJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNSMEZCUlN4RlFVRkZMRWxCUVVVc1IwRkJSU3hMUVVGSExFVkJRVVVzU1VGQlJTeExRVUZGTEVkQlFVVXNTMEZCU1R0QlFVRkJPMEZCUVVjc1dVRkJXU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFZRVUZQTEVWQlFVVXNTVUZCUlR0QlFVRkJMRk5CUVZNN1FVRkJTeXhoUVVGUExFbEJRVVVzVjBGQlV5eExRVUZGTzBGQlFVRXNVMEZCVHp0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGTExHRkJRVThzU1VGQlJTeExRVUZGTzBGQlFVRXNVMEZCVHp0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCU3l4aFFVRlBMRWxCUVVVc1MwRkJSU3hKUVVGRkxFdEJRVVVzU1VGQlJTeExRVUZGTzBGQlFVRXNVMEZCVHp0QlFVRkJMRk5CUVZVN1FVRkJTeXhoUVVGUExFbEJRVVVzUzBGQlJTeEpRVUZGTEV0QlFVVTdRVUZCUVN4VFFVRlBPMEZCUVVzc1lVRkJUeXhKUVVGRkxFdEJRVVVzU1VGQlJTeFZRVUZSTEV0QlFVVTdRVUZCUVN4VFFVRlBPMEZCUVVzc1lVRkJUeXhKUVVGRkxFdEJRVVVzUlVGQlJTeEpRVUZGTEd0Q1FVRnBRaXhKUVVGRkxHRkJRVmNzU1VGQlJTeGxRVUZoTzBGQlFVRXNVMEZCVHp0QlFVRkxMR0ZCUVU4c1NVRkJSU3hMUVVGRkxFbEJRVVVzWlVGQllTeEZRVUZGTEVsQlFVVXNaVUZCWXl4TlFVRkpPMEZCUVVFc1UwRkJUenRCUVVGTExHRkJRVThzU1VGQlJTeExRVUZGTEVsQlFVVXNiVUpCUVdsQ0xFVkJRVVVzU1VGQlJTdzJRa0ZCTkVJc1RVRkJTVHRCUVVGQkxGTkJRVTg3UVVGQlN5eGhRVUZQTEVsQlFVVXNTMEZCUlN4SlFVRkZMRVZCUVVVc1NVRkJSU3hWUVVGVExHTkJRVms3UVVGQlFTeFRRVUZQTzBGQlFVc3NZVUZCVHl4SlFVRkZMRXRCUVVVc1NVRkJSU3hGUVVGRkxFbEJRVVVzVTBGQlVTeHZRa0ZCYTBJN1FVRkJRU3hUUVVGUE8wRkJRVXNzWVVGQlR5eEpRVUZGTEZOQlFVOHNSVUZCUlN4SlFVRkZMRk5CUVZFc1RVRkJTU3hKUVVGRkxFdEJRVVVzU1VGQlJTeEZRVUZGTEVsQlFVVXNVVUZCVHl4alFVRlpPMEZCUVVFc1UwRkJUenRCUVVGTExHRkJRVThzU1VGQlJTeEZRVUZGTEVsQlFVVXNjMEpCUVhGQ0xFOUJRVXNzU1VGQlJTeFJRVUZOTzBGQlFVRXNVMEZCVHp0QlFVRkxMR0ZCUVU4c1JVRkJSU3hGUVVGRkxFVkJRVVVzU1VGQlJTeG5Ra0ZCWlN4SlFVRkZMRTlCUVUwc1pVRkJZeXhKUVVGRkxFOUJRVTBzU1VGQlJTeE5RVUZKTzBGQlFVRXNVMEZCVHp0QlFVRkJMRk5CUVZVN1FVRkJTeXhoUVVGUExFVkJRVVVzU1VGQlJTeHhRa0ZCYjBJc1NVRkJSVHRCUVVGQkxGTkJRV3RDTzBGQlFVc3NZVUZCVHl4RlFVRkZMRVZCUVVVc1NVRkJSU3h4UWtGQmIwSXNTVUZCUlN4blFrRkJZeXhKUVVGRkxHbENRVUZuUWl4alFVRmhMR0ZCUVZjc1NVRkJSU3hMUVVGRk8wRkJRVUVzVTBGQlR6dEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGTExHRkJRVThzUlVGQlJTeEpRVUZGTEcxQ1FVRnJRaXhKUVVGRkxGVkJRVkU3UVVGQlFTeFRRVUZQTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJTeXhWUVVGSExFVkJRVVVzVFVGQlJ5eEpRVUZGTEV0QlFVVTdRVUZCUlN4blFrRkJUeXhGUVVGRkxFbEJRVVVzUzBGQlJUdEJRVUZCTEdWQlFWTTdRVUZCU1N4blFrRkJSeXhGUVVGRkxFbEJRVVVzUzBGQlJTeFBRVUZMTzBGQlFVYzdRVUZCUVN4bFFVRlhPMEZCUVVrc2JVSkJRVThzUlVGQlJTeEpRVUZGTEc5Q1FVRnRRaXhQUVVGTExFbEJRVVVzV1VGQllTeEpRVUZITEVkQlFVVXNTVUZCUlN4TFFVRkZMRTFCUVVrc1RVRkJTU3hQUVVGTExGbEJRVlU3UVVGQlFTeGxRVUZQTzBGQlFVa3NiVUpCUVUwc1EwRkJReXhGUVVGRkxFbEJRVVVzWVVGQlZ5eEhRVUZITEVWQlFVVXNTVUZCUlN4WFFVRlZMRzFDUVVGclFpeE5RVUZITEV0QlFVVTdRVUZCUVR0QlFVRkZPMEZCUVVFc1UwRkJWenRCUVVGTExGVkJRVWNzUlVGQlJTeEpRVUZGTEV0QlFVVXNUMEZCU3p0QlFVRkpPMEZCUVVFc1UwRkJWenRCUVVGTExHTkJRVThzUlVGQlJTeEpRVUZGTEVWQlFVVXNUVUZCUnl4SlFVRkhMRVZCUVVNc1JVRkJSU3hKUVVGRkxHbENRVUZsTzBGQlFVRXNZVUZCVnp0QlFVRkpMR2xDUVVGUExFVkJRVVVzU1VGQlJTeExRVUZKTEUxQlFVa3NTMEZCUnp0QlFVRkJMR0ZCUVU4N1FVRkJTU3hwUWtGQlR5eEZRVUZGTEVsQlFVVXNlVUpCUVhkQ0xFOUJRVXNzU1VGQlJ5eEhRVUZGTEVsQlFVVXNVVUZCVFN4TFFVRkhMRmxCUVZVc1RVRkJTU3haUVVGaExFbEJRVVVzVjBGQldTeEpRVUZGTEdGQlFWYzdRVUZCUVR0QlFVRkZPMEZCUVVFc1UwRkJWenRCUVVGTExHTkJRVThzUlVGQlJTeEpRVUZGTEV0QlFVVTdRVUZCUVN4aFFVRlZPMEZCUVVrc2FVSkJRVThzU1VGQlJTeExRVUZGTEVsQlFVVXNSVUZCUlN4SlFVRkZMSE5DUVVGeFFpeFJRVUZOTzBGQlFVRXNZVUZCVHp0QlFVRkpMR2xDUVVGUExFbEJRVVVzUzBGQlJTeEpRVUZGTEVWQlFVVXNTVUZCUlN4elFrRkJjVUlzVjBGQlV6dEJRVUZCTEdGQlFVODdRVUZCUnl4cFFrRkJUeXhKUVVGRkxFdEJRVVVzU1VGQlJTeEZRVUZGTEVsQlFVVXNjMEpCUVhGQ0xGRkJRVTA3UVVGQlFUdEJRVUZGTEdGQlFVOHNTVUZCUlN4TFFVRkZMRWxCUVVVc1MwRkJSVHRCUVVGQk8wRkJRVVVzVTBGQlR6dEJRVUZCTzBGQlFVVXNXVUZCV1N4SlFVRkZMRWxCUVVVN1FVRkJReXhOUVVGSkxFdEJRVVU3UVVGQlJ5eE5RVUZKTEV0QlFVVXNSVUZCUlR0QlFVRkhMRmRCUVZFc1MwRkJSU3hIUVVGRkxFdEJRVVVzU1VGQlJUdEJRVUZKTEZWQlFVY3NSMEZCUlN4SFFVRkZMRXRCUVVjc1NVRkJSU3hKUVVGRkxFOUJRVWs3UVVGQlJ5eFRRVUZQTzBGQlFVRTdRVUZCUlN4WlFVRlpMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFZRVUZQTEVkQlFVVTdRVUZCUVN4VFFVRlhPMEZCUVVFc1UwRkJUenRCUVVGRkxHRkJRVThzUjBGQlJTeFRRVUZQTEVkQlFVVXNWVUZCVVN4SFFVRkZPMEZCUVVFc1UwRkJWenRCUVVGRkxHRkJRVTA3UVVGQlFTeFRRVUZSTzBGQlFVVXNVMEZCUlN4UlFVRk5MRWRCUVVVc1RVRkJUU3hMUVVGTE8wRkJRVUU3UVVGQlN5eFRRVUZQTEVWQlFVVXNTMEZCUlN4SFFVRkhMRWRCUVVVc1ZVRkJVeXhQUVVGSkxFZEJRVVVzVTBGQlR5eEhRVUZGTEZGQlFVMHNUVUZCU1N4TFFVRkZMRTFCUVVrN1FVRkJRVHRCUVVGSExGbEJRVmtzU1VGQlJUdEJRVUZETEUxQlFVa3NTMEZCUlN4RlFVRkZPMEZCUVVjc1UwRkJUeXhUUVVGVExFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUXl4UlFVRkpMRXRCUVVVN1FVRkJSeXhoUVVGUkxFdEJRVVVzUjBGQlJTeExRVUZGTEVsQlFVVTdRVUZCU1N4WlFVRkhMRWRCUVVVc1NVRkJSeXhKUVVGRkxFbEJRVVVzU1VGQlJTeFBRVUZKTzBGQlFVY3NWMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkJSeXhaUVVGWkxFbEJRVVU3UVVGQlF5eFRRVUZQTEZOQlFWTXNTVUZCUlR0QlFVRkRMRkZCUVVjc1EwRkJReXhIUVVGRk8wRkJRVXNzVlVGQlJ5eExRVUZGTEVkQlFVVTdRVUZCVHl4WFFVRkZPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVWtzV1VGQldTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZPMEZCUVVNc1RVRkJSeXhEUVVGRExFZEJRVVU3UVVGQlR5eFpRVUZQTEVkQlFVVTdRVUZCUVN4WFFVRlhPMEZCUVVVc1YwRkJSU3hUUVVGUExFZEJRVWNzUjBGQlJTeFBRVUZOTEVkQlFVVTdRVUZCVVR0QlFVRkJMRmRCUVZjN1FVRkJSU3hsUVVGUExFZEJRVWNzUTBGQlF5eEZRVUZGTEVWQlFVVXNSMEZCUlN4UFFVRk5MRXRCUVVrc1RVRkJTU3hKUVVGSExFbEJRVVVzVFVGQlN6dEJRVUZCTEZkQlFWRTdRVUZCUlN4WlFVRkhMRWRCUVVVN1FVRkJUeXhwUWtGQlR5eEZRVUZGTEVkQlFVVXNUMEZCVHl4VFFVRlRMRWxCUVVVN1FVRkJReXh2UWtGQlR5eEZRVUZGTEVsQlFVVTdRVUZCUVN4dFFrRkJPRUk3UVVGQlFTeHRRa0ZCYVVJN1FVRkJZeXgxUWtGQlR5eEhRVUZITEVOQlFVTXNSVUZCUlN4RlFVRkZMRWxCUVVVc1pVRkJZeXhOUVVGSkxFbEJRVVVzVDBGQlRTeEpRVUZGTEUxQlFVczdRVUZCUVN4dFFrRkJUenRCUVVGblFpeDFRa0ZCVHl4SFFVRkhMRU5CUVVNc1JVRkJSU3hGUVVGRkxFbEJRVVVzWTBGQllTeE5RVUZKTEVsQlFVVXNZVUZCV1N4SlFVRkZMRXRCUVVrc1JVRkJSU3hGUVVGRkxFbEJRVVVzWTBGQllTeE5RVUZKTEVsQlFVVXNUMEZCVFN4SlFVRkZMRXRCUVVrc1JVRkJSU3hGUVVGRkxFbEJRVVVzWTBGQllTeEpRVUZGTEdGQlFWa3NTVUZCUlN4TlFVRkxPMEZCUVVFN1FVRkJSeXh0UWtGQlRUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRlBMRmxCUVZrc1NVRkJSVHRCUVVGRExGVkJRVThzUjBGQlJUdEJRVUZCTEZOQlFWYzdRVUZCUlN4VFFVRkZMRkZCUVUwc1IwRkJSU3hOUVVGTkxFbEJRVXNzVTBGQlV5eEpRVUZGTzBGQlFVTXNaVUZCVHl4RlFVRkZMRVZCUVVVc1MwRkJTU3hUUVVGVExFbEJRVVVzU1VGQlJTeEpRVUZGTzBGQlFVTXNhMEpCUVU4c1JVRkJSU3hKUVVGRk8wRkJRVUVzYVVKQlFWTTdRVUZCUnl4eFFrRkJUeXhGUVVGRkxFbEJRVVVzUjBGQlJTeEZRVUZGTzBGQlFVRXNhVUpCUVZNN1FVRkJRU3hwUWtGQlR6dEJRVUZCTEdsQ1FVRlJPMEZCUVVFc2FVSkJRVkU3UVVGQlFTeHBRa0ZCVVR0QlFVRkpMSEZDUVVGUE8wRkJRVUVzYVVKQlFVODdRVUZCUnl4clFrRkJSeXhIUVVGRkxFVkJRVVVzVVVGQlN6dEJRVUZUTEcxQ1FVRkZMRTFCUVVjc1NVRkJSeXhIUVVGRkxFVkJRVVVzVFVGQlJ5eFBRVUZMTEVWQlFVVXNSMEZCUlN4TFFVRkhMRXRCUVVVc1IwRkJSVHRCUVVGQkxHbENRVUZUTzBGQlFVY3NjVUpCUVU4c1QwRkJTU3hKUVVGRkxFdEJRVWM3UVVGQlFUdEJRVUZWTEhOQ1FVRlBPMEZCUVVFc2NVSkJRVkU3UVVGQlJTeDFRa0ZCUlR0QlFVRkZMSGxDUVVGUExFVkJRVVVzVFVGQlJ5eEpRVUZGTEV0QlFVYzdRVUZCUVN4eFFrRkJUeXhOUVVGRkxFVkJRVVVzVFVGQlJ6dEJRVUZCTEhGQ1FVRlBPMEZCUVVVc2VVSkJRVThzVDBGQlNTeEpRVUZGTEV0QlFVVXNTMEZCUlN4TFFVRkZMRXRCUVVVN1FVRkJRVHRCUVVGVkxIbENRVUZQTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVmM3SWl3S0lDQWlibUZ0WlhNaU9pQmJYUXA5Q2c9PVxuIiwidmFyIHdlYWtNZW1vaXplID0gZnVuY3Rpb24gd2Vha01lbW9pemUoZnVuYykge1xuICAvLyAkRmxvd0ZpeE1lIGZsb3cgZG9lc24ndCBpbmNsdWRlIGFsbCBub24tcHJpbWl0aXZlIHR5cGVzIGFzIGFsbG93ZWQgZm9yIHdlYWttYXBzXG4gIHZhciBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG4gIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgaWYgKGNhY2hlLmhhcyhhcmcpKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGFyZyk7XG4gICAgfVxuXG4gICAgdmFyIHJldCA9IGZ1bmMoYXJnKTtcbiAgICBjYWNoZS5zZXQoYXJnLCByZXQpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB3ZWFrTWVtb2l6ZTtcbiIsImZ1bmN0aW9uIG1lbW9pemUoZm4pIHtcbiAgdmFyIGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcbiAgICBpZiAoY2FjaGVbYXJnXSA9PT0gdW5kZWZpbmVkKSBjYWNoZVthcmddID0gZm4oYXJnKTtcbiAgICByZXR1cm4gY2FjaGVbYXJnXTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtb2l6ZTtcbiIsImltcG9ydCB7IFN0eWxlU2hlZXQgfSBmcm9tICdAZW1vdGlvbi9zaGVldCc7XG5pbXBvcnQgeyBkZWFsbG9jLCBhbGxvYywgbmV4dCwgdG9rZW4sIGZyb20sIHBlZWssIGRlbGltaXQsIGlkZW50aWZpZXIsIHBvc2l0aW9uLCBzdHJpbmdpZnksIENPTU1FTlQsIHJ1bGVzaGVldCwgbWlkZGxld2FyZSwgcHJlZml4ZXIsIHNlcmlhbGl6ZSwgY29tcGlsZSB9IGZyb20gJ3N0eWxpcyc7XG5pbXBvcnQgJ0BlbW90aW9uL3dlYWstbWVtb2l6ZSc7XG5pbXBvcnQgJ0BlbW90aW9uL21lbW9pemUnO1xuXG52YXIgbGFzdCA9IGZ1bmN0aW9uIGxhc3QoYXJyKSB7XG4gIHJldHVybiBhcnIubGVuZ3RoID8gYXJyW2Fyci5sZW5ndGggLSAxXSA6IG51bGw7XG59O1xuXG52YXIgdG9SdWxlcyA9IGZ1bmN0aW9uIHRvUnVsZXMocGFyc2VkLCBwb2ludHMpIHtcbiAgLy8gcHJldGVuZCB3ZSd2ZSBzdGFydGVkIHdpdGggYSBjb21tYVxuICB2YXIgaW5kZXggPSAtMTtcbiAgdmFyIGNoYXJhY3RlciA9IDQ0O1xuXG4gIGRvIHtcbiAgICBzd2l0Y2ggKHRva2VuKGNoYXJhY3RlcikpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgLy8gJlxcZlxuICAgICAgICBpZiAoY2hhcmFjdGVyID09PSAzOCAmJiBwZWVrKCkgPT09IDEyKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyBub3QgMTAwJSBjb3JyZWN0LCB3ZSBkb24ndCBhY2NvdW50IGZvciBsaXRlcmFsIHNlcXVlbmNlcyBoZXJlIC0gbGlrZSBmb3IgZXhhbXBsZSBxdW90ZWQgc3RyaW5nc1xuICAgICAgICAgIC8vIHN0eWxpcyBpbnNlcnRzIFxcZiBhZnRlciAmIHRvIGtub3cgd2hlbiAmIHdoZXJlIGl0IHNob3VsZCByZXBsYWNlIHRoaXMgc2VxdWVuY2Ugd2l0aCB0aGUgY29udGV4dCBzZWxlY3RvclxuICAgICAgICAgIC8vIGFuZCB3aGVuIGl0IHNob3VsZCBqdXN0IGNvbmNhdGVuYXRlIHRoZSBvdXRlciBhbmQgaW5uZXIgc2VsZWN0b3JzXG4gICAgICAgICAgLy8gaXQncyB2ZXJ5IHVubGlrZWx5IGZvciB0aGlzIHNlcXVlbmNlIHRvIGFjdHVhbGx5IGFwcGVhciBpbiBhIGRpZmZlcmVudCBjb250ZXh0LCBzbyB3ZSBqdXN0IGxldmVyYWdlIHRoaXMgZmFjdCBoZXJlXG4gICAgICAgICAgcG9pbnRzW2luZGV4XSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZWRbaW5kZXhdICs9IGlkZW50aWZpZXIocG9zaXRpb24gLSAxKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcGFyc2VkW2luZGV4XSArPSBkZWxpbWl0KGNoYXJhY3Rlcik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQ6XG4gICAgICAgIC8vIGNvbW1hXG4gICAgICAgIGlmIChjaGFyYWN0ZXIgPT09IDQ0KSB7XG4gICAgICAgICAgLy8gY29sb25cbiAgICAgICAgICBwYXJzZWRbKytpbmRleF0gPSBwZWVrKCkgPT09IDU4ID8gJyZcXGYnIDogJyc7XG4gICAgICAgICAgcG9pbnRzW2luZGV4XSA9IHBhcnNlZFtpbmRleF0ubGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIC8vIGZhbGx0aHJvdWdoXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHBhcnNlZFtpbmRleF0gKz0gZnJvbShjaGFyYWN0ZXIpO1xuICAgIH1cbiAgfSB3aGlsZSAoY2hhcmFjdGVyID0gbmV4dCgpKTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcblxudmFyIGdldFJ1bGVzID0gZnVuY3Rpb24gZ2V0UnVsZXModmFsdWUsIHBvaW50cykge1xuICByZXR1cm4gZGVhbGxvYyh0b1J1bGVzKGFsbG9jKHZhbHVlKSwgcG9pbnRzKSk7XG59OyAvLyBXZWFrU2V0IHdvdWxkIGJlIG1vcmUgYXBwcm9wcmlhdGUsIGJ1dCBvbmx5IFdlYWtNYXAgaXMgc3VwcG9ydGVkIGluIElFMTFcblxuXG52YXIgZml4ZWRFbGVtZW50cyA9IC8qICNfX1BVUkVfXyAqL25ldyBXZWFrTWFwKCk7XG52YXIgY29tcGF0ID0gZnVuY3Rpb24gY29tcGF0KGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQudHlwZSAhPT0gJ3J1bGUnIHx8ICFlbGVtZW50LnBhcmVudCB8fCAvLyAubGVuZ3RoIGluZGljYXRlcyBpZiB0aGlzIHJ1bGUgY29udGFpbnMgcHNldWRvIG9yIG5vdFxuICAhZWxlbWVudC5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdmFsdWUgPSBlbGVtZW50LnZhbHVlLFxuICAgICAgcGFyZW50ID0gZWxlbWVudC5wYXJlbnQ7XG4gIHZhciBpc0ltcGxpY2l0UnVsZSA9IGVsZW1lbnQuY29sdW1uID09PSBwYXJlbnQuY29sdW1uICYmIGVsZW1lbnQubGluZSA9PT0gcGFyZW50LmxpbmU7XG5cbiAgd2hpbGUgKHBhcmVudC50eXBlICE9PSAncnVsZScpIHtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gIH0gLy8gc2hvcnQtY2lyY3VpdCBmb3IgdGhlIHNpbXBsZXN0IGNhc2VcblxuXG4gIGlmIChlbGVtZW50LnByb3BzLmxlbmd0aCA9PT0gMSAmJiB2YWx1ZS5jaGFyQ29kZUF0KDApICE9PSA1OFxuICAvKiBjb2xvbiAqL1xuICAmJiAhZml4ZWRFbGVtZW50cy5nZXQocGFyZW50KSkge1xuICAgIHJldHVybjtcbiAgfSAvLyBpZiB0aGlzIGlzIGFuIGltcGxpY2l0bHkgaW5zZXJ0ZWQgcnVsZSAodGhlIG9uZSBlYWdlcmx5IGluc2VydGVkIGF0IHRoZSBlYWNoIG5ldyBuZXN0ZWQgbGV2ZWwpXG4gIC8vIHRoZW4gdGhlIHByb3BzIGhhcyBhbHJlYWR5IGJlZW4gbWFuaXB1bGF0ZWQgYmVmb3JlaGFuZCBhcyB0aGV5IHRoYXQgYXJyYXkgaXMgc2hhcmVkIGJldHdlZW4gaXQgYW5kIGl0cyBcInJ1bGUgcGFyZW50XCJcblxuXG4gIGlmIChpc0ltcGxpY2l0UnVsZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZpeGVkRWxlbWVudHMuc2V0KGVsZW1lbnQsIHRydWUpO1xuICB2YXIgcG9pbnRzID0gW107XG4gIHZhciBydWxlcyA9IGdldFJ1bGVzKHZhbHVlLCBwb2ludHMpO1xuICB2YXIgcGFyZW50UnVsZXMgPSBwYXJlbnQucHJvcHM7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGsgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhcmVudFJ1bGVzLmxlbmd0aDsgaisrLCBrKyspIHtcbiAgICAgIGVsZW1lbnQucHJvcHNba10gPSBwb2ludHNbaV0gPyBydWxlc1tpXS5yZXBsYWNlKC8mXFxmL2csIHBhcmVudFJ1bGVzW2pdKSA6IHBhcmVudFJ1bGVzW2pdICsgXCIgXCIgKyBydWxlc1tpXTtcbiAgICB9XG4gIH1cbn07XG52YXIgcmVtb3ZlTGFiZWwgPSBmdW5jdGlvbiByZW1vdmVMYWJlbChlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50LnR5cGUgPT09ICdkZWNsJykge1xuICAgIHZhciB2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG5cbiAgICBpZiAoIC8vIGNoYXJjb2RlIGZvciBsXG4gICAgdmFsdWUuY2hhckNvZGVBdCgwKSA9PT0gMTA4ICYmIC8vIGNoYXJjb2RlIGZvciBiXG4gICAgdmFsdWUuY2hhckNvZGVBdCgyKSA9PT0gOTgpIHtcbiAgICAgIC8vIHRoaXMgaWdub3JlcyBsYWJlbFxuICAgICAgZWxlbWVudFtcInJldHVyblwiXSA9ICcnO1xuICAgICAgZWxlbWVudC52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfVxufTtcbnZhciBpZ25vcmVGbGFnID0gJ2Vtb3Rpb24tZGlzYWJsZS1zZXJ2ZXItcmVuZGVyaW5nLXVuc2FmZS1zZWxlY3Rvci13YXJuaW5nLXBsZWFzZS1kby1ub3QtdXNlLXRoaXMtdGhlLXdhcm5pbmctZXhpc3RzLWZvci1hLXJlYXNvbic7XG5cbnZhciBpc0lnbm9yaW5nQ29tbWVudCA9IGZ1bmN0aW9uIGlzSWdub3JpbmdDb21tZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuICEhZWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdjb21tJyAmJiBlbGVtZW50LmNoaWxkcmVuLmluZGV4T2YoaWdub3JlRmxhZykgPiAtMTtcbn07XG5cbnZhciBjcmVhdGVVbnNhZmVTZWxlY3RvcnNBbGFybSA9IGZ1bmN0aW9uIGNyZWF0ZVVuc2FmZVNlbGVjdG9yc0FsYXJtKGNhY2hlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgsIGNoaWxkcmVuKSB7XG4gICAgaWYgKGVsZW1lbnQudHlwZSAhPT0gJ3J1bGUnKSByZXR1cm47XG4gICAgdmFyIHVuc2FmZVBzZXVkb0NsYXNzZXMgPSBlbGVtZW50LnZhbHVlLm1hdGNoKC8oOmZpcnN0fDpudGh8Om50aC1sYXN0KS1jaGlsZC9nKTtcblxuICAgIGlmICh1bnNhZmVQc2V1ZG9DbGFzc2VzICYmIGNhY2hlLmNvbXBhdCAhPT0gdHJ1ZSkge1xuICAgICAgdmFyIHByZXZFbGVtZW50ID0gaW5kZXggPiAwID8gY2hpbGRyZW5baW5kZXggLSAxXSA6IG51bGw7XG5cbiAgICAgIGlmIChwcmV2RWxlbWVudCAmJiBpc0lnbm9yaW5nQ29tbWVudChsYXN0KHByZXZFbGVtZW50LmNoaWxkcmVuKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1bnNhZmVQc2V1ZG9DbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKHVuc2FmZVBzZXVkb0NsYXNzKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgcHNldWRvIGNsYXNzIFxcXCJcIiArIHVuc2FmZVBzZXVkb0NsYXNzICsgXCJcXFwiIGlzIHBvdGVudGlhbGx5IHVuc2FmZSB3aGVuIGRvaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy4gVHJ5IGNoYW5naW5nIGl0IHRvIFxcXCJcIiArIHVuc2FmZVBzZXVkb0NsYXNzLnNwbGl0KCctY2hpbGQnKVswXSArIFwiLW9mLXR5cGVcXFwiLlwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbnZhciBpc0ltcG9ydFJ1bGUgPSBmdW5jdGlvbiBpc0ltcG9ydFJ1bGUoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC50eXBlLmNoYXJDb2RlQXQoMSkgPT09IDEwNSAmJiBlbGVtZW50LnR5cGUuY2hhckNvZGVBdCgwKSA9PT0gNjQ7XG59O1xuXG52YXIgaXNQcmVwZW5kZWRXaXRoUmVndWxhclJ1bGVzID0gZnVuY3Rpb24gaXNQcmVwZW5kZWRXaXRoUmVndWxhclJ1bGVzKGluZGV4LCBjaGlsZHJlbikge1xuICBmb3IgKHZhciBpID0gaW5kZXggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmICghaXNJbXBvcnRSdWxlKGNoaWxkcmVuW2ldKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTsgLy8gdXNlIHRoaXMgdG8gcmVtb3ZlIGluY29ycmVjdCBlbGVtZW50cyBmcm9tIGZ1cnRoZXIgcHJvY2Vzc2luZ1xuLy8gc28gdGhleSBkb24ndCBnZXQgaGFuZGVkIHRvIHRoZSBgc2hlZXRgIChvciBhbnl0aGluZyBlbHNlKVxuLy8gYXMgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSBsZWFkIHRvIGFkZGl0aW9uYWwgbG9ncyB3aGljaCBpbiB0dXJuIGNvdWxkIGJlIG92ZXJoZWxtaW5nIHRvIHRoZSB1c2VyXG5cblxudmFyIG51bGxpZnlFbGVtZW50ID0gZnVuY3Rpb24gbnVsbGlmeUVsZW1lbnQoZWxlbWVudCkge1xuICBlbGVtZW50LnR5cGUgPSAnJztcbiAgZWxlbWVudC52YWx1ZSA9ICcnO1xuICBlbGVtZW50W1wicmV0dXJuXCJdID0gJyc7XG4gIGVsZW1lbnQuY2hpbGRyZW4gPSAnJztcbiAgZWxlbWVudC5wcm9wcyA9ICcnO1xufTtcblxudmFyIGluY29ycmVjdEltcG9ydEFsYXJtID0gZnVuY3Rpb24gaW5jb3JyZWN0SW1wb3J0QWxhcm0oZWxlbWVudCwgaW5kZXgsIGNoaWxkcmVuKSB7XG4gIGlmICghaXNJbXBvcnRSdWxlKGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGVsZW1lbnQucGFyZW50KSB7XG4gICAgY29uc29sZS5lcnJvcihcImBAaW1wb3J0YCBydWxlcyBjYW4ndCBiZSBuZXN0ZWQgaW5zaWRlIG90aGVyIHJ1bGVzLiBQbGVhc2UgbW92ZSBpdCB0byB0aGUgdG9wIGxldmVsIGFuZCBwdXQgaXQgYmVmb3JlIHJlZ3VsYXIgcnVsZXMuIEtlZXAgaW4gbWluZCB0aGF0IHRoZXkgY2FuIG9ubHkgYmUgdXNlZCB3aXRoaW4gZ2xvYmFsIHN0eWxlcy5cIik7XG4gICAgbnVsbGlmeUVsZW1lbnQoZWxlbWVudCk7XG4gIH0gZWxzZSBpZiAoaXNQcmVwZW5kZWRXaXRoUmVndWxhclJ1bGVzKGluZGV4LCBjaGlsZHJlbikpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiYEBpbXBvcnRgIHJ1bGVzIGNhbid0IGJlIGFmdGVyIG90aGVyIHJ1bGVzLiBQbGVhc2UgcHV0IHlvdXIgYEBpbXBvcnRgIHJ1bGVzIGJlZm9yZSB5b3VyIG90aGVyIHJ1bGVzLlwiKTtcbiAgICBudWxsaWZ5RWxlbWVudChlbGVtZW50KTtcbiAgfVxufTtcblxudmFyIGRlZmF1bHRTdHlsaXNQbHVnaW5zID0gW3ByZWZpeGVyXTtcblxudmFyIGNyZWF0ZUNhY2hlID0gZnVuY3Rpb24gY3JlYXRlQ2FjaGUob3B0aW9ucykge1xuICB2YXIga2V5ID0gb3B0aW9ucy5rZXk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgIWtleSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBoYXZlIHRvIGNvbmZpZ3VyZSBga2V5YCBmb3IgeW91ciBjYWNoZS4gUGxlYXNlIG1ha2Ugc3VyZSBpdCdzIHVuaXF1ZSAoYW5kIG5vdCBlcXVhbCB0byAnY3NzJykgYXMgaXQncyB1c2VkIGZvciBsaW5raW5nIHN0eWxlcyB0byB5b3VyIGNhY2hlLlxcblwiICsgXCJJZiBtdWx0aXBsZSBjYWNoZXMgc2hhcmUgdGhlIHNhbWUga2V5IHRoZXkgbWlnaHQgXFxcImZpZ2h0XFxcIiBmb3IgZWFjaCBvdGhlcidzIHN0eWxlIGVsZW1lbnRzLlwiKTtcbiAgfVxuXG4gIGlmICgga2V5ID09PSAnY3NzJykge1xuICAgIHZhciBzc3JTdHlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwic3R5bGVbZGF0YS1lbW90aW9uXTpub3QoW2RhdGEtc10pXCIpOyAvLyBnZXQgU1NSZWQgc3R5bGVzIG91dCBvZiB0aGUgd2F5IG9mIFJlYWN0J3MgaHlkcmF0aW9uXG4gICAgLy8gZG9jdW1lbnQuaGVhZCBpcyBhIHNhZmUgcGxhY2UgdG8gbW92ZSB0aGVtIHRvKHRob3VnaCBub3RlIGRvY3VtZW50LmhlYWQgaXMgbm90IG5lY2Vzc2FyaWx5IHRoZSBsYXN0IHBsYWNlIHRoZXkgd2lsbCBiZSlcbiAgICAvLyBub3RlIHRoaXMgdmVyeSB2ZXJ5IGludGVudGlvbmFsbHkgdGFyZ2V0cyBhbGwgc3R5bGUgZWxlbWVudHMgcmVnYXJkbGVzcyBvZiB0aGUga2V5IHRvIGVuc3VyZVxuICAgIC8vIHRoYXQgY3JlYXRpbmcgYSBjYWNoZSB3b3JrcyBpbnNpZGUgb2YgcmVuZGVyIG9mIGEgUmVhY3QgY29tcG9uZW50XG5cbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHNzclN0eWxlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIC8vIHdlIHdhbnQgdG8gb25seSBtb3ZlIGVsZW1lbnRzIHdoaWNoIGhhdmUgYSBzcGFjZSBpbiB0aGUgZGF0YS1lbW90aW9uIGF0dHJpYnV0ZSB2YWx1ZVxuICAgICAgLy8gYmVjYXVzZSB0aGF0IGluZGljYXRlcyB0aGF0IGl0IGlzIGFuIEVtb3Rpb24gMTEgc2VydmVyLXNpZGUgcmVuZGVyZWQgc3R5bGUgZWxlbWVudHNcbiAgICAgIC8vIHdoaWxlIHdlIHdpbGwgYWxyZWFkeSBpZ25vcmUgRW1vdGlvbiAxMSBjbGllbnQtc2lkZSBpbnNlcnRlZCBzdHlsZXMgYmVjYXVzZSBvZiB0aGUgOm5vdChbZGF0YS1zXSkgcGFydCBpbiB0aGUgc2VsZWN0b3JcbiAgICAgIC8vIEVtb3Rpb24gMTAgY2xpZW50LXNpZGUgaW5zZXJ0ZWQgc3R5bGVzIGRpZCBub3QgaGF2ZSBkYXRhLXMgKGJ1dCBpbXBvcnRhbnRseSBkaWQgbm90IGhhdmUgYSBzcGFjZSBpbiB0aGVpciBkYXRhLWVtb3Rpb24gYXR0cmlidXRlcylcbiAgICAgIC8vIHNvIGNoZWNraW5nIGZvciB0aGUgc3BhY2UgZW5zdXJlcyB0aGF0IGxvYWRpbmcgRW1vdGlvbiAxMSBhZnRlciBFbW90aW9uIDEwIGhhcyBpbnNlcnRlZCBzb21lIHN0eWxlc1xuICAgICAgLy8gd2lsbCBub3QgcmVzdWx0IGluIHRoZSBFbW90aW9uIDEwIHN0eWxlcyBiZWluZyBkZXN0cm95ZWRcbiAgICAgIHZhciBkYXRhRW1vdGlvbkF0dHJpYnV0ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWVtb3Rpb24nKTtcblxuICAgICAgaWYgKGRhdGFFbW90aW9uQXR0cmlidXRlLmluZGV4T2YoJyAnKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXMnLCAnJyk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgc3R5bGlzUGx1Z2lucyA9IG9wdGlvbnMuc3R5bGlzUGx1Z2lucyB8fCBkZWZhdWx0U3R5bGlzUGx1Z2lucztcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBpZiAoL1teYS16LV0vLnRlc3Qoa2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW1vdGlvbiBrZXkgbXVzdCBvbmx5IGNvbnRhaW4gbG93ZXIgY2FzZSBhbHBoYWJldGljYWwgY2hhcmFjdGVycyBhbmQgLSBidXQgXFxcIlwiICsga2V5ICsgXCJcXFwiIHdhcyBwYXNzZWRcIik7XG4gICAgfVxuICB9XG5cbiAgdmFyIGluc2VydGVkID0ge307IC8vICRGbG93Rml4TWVcblxuICB2YXIgY29udGFpbmVyO1xuICB2YXIgbm9kZXNUb0h5ZHJhdGUgPSBbXTtcblxuICB7XG4gICAgY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgfHwgZG9jdW1lbnQuaGVhZDtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKCAvLyB0aGlzIG1lYW5zIHdlIHdpbGwgaWdub3JlIGVsZW1lbnRzIHdoaWNoIGRvbid0IGhhdmUgYSBzcGFjZSBpbiB0aGVtIHdoaWNoXG4gICAgLy8gbWVhbnMgdGhhdCB0aGUgc3R5bGUgZWxlbWVudHMgd2UncmUgbG9va2luZyBhdCBhcmUgb25seSBFbW90aW9uIDExIHNlcnZlci1yZW5kZXJlZCBzdHlsZSBlbGVtZW50c1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdHlsZVtkYXRhLWVtb3Rpb25ePVxcXCJcIiArIGtleSArIFwiIFxcXCJdXCIpLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgdmFyIGF0dHJpYiA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1lbW90aW9uXCIpLnNwbGl0KCcgJyk7IC8vICRGbG93Rml4TWVcblxuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhdHRyaWIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaW5zZXJ0ZWRbYXR0cmliW2ldXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIG5vZGVzVG9IeWRyYXRlLnB1c2gobm9kZSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgX2luc2VydDtcblxuICB2YXIgb21uaXByZXNlbnRQbHVnaW5zID0gW2NvbXBhdCwgcmVtb3ZlTGFiZWxdO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgb21uaXByZXNlbnRQbHVnaW5zLnB1c2goY3JlYXRlVW5zYWZlU2VsZWN0b3JzQWxhcm0oe1xuICAgICAgZ2V0IGNvbXBhdCgpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlLmNvbXBhdDtcbiAgICAgIH1cblxuICAgIH0pLCBpbmNvcnJlY3RJbXBvcnRBbGFybSk7XG4gIH1cblxuICB7XG4gICAgdmFyIGN1cnJlbnRTaGVldDtcbiAgICB2YXIgZmluYWxpemluZ1BsdWdpbnMgPSBbc3RyaW5naWZ5LCBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIGlmICghZWxlbWVudC5yb290KSB7XG4gICAgICAgIGlmIChlbGVtZW50W1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgY3VycmVudFNoZWV0Lmluc2VydChlbGVtZW50W1wicmV0dXJuXCJdKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnZhbHVlICYmIGVsZW1lbnQudHlwZSAhPT0gQ09NTUVOVCkge1xuICAgICAgICAgIC8vIGluc2VydCBlbXB0eSBydWxlIGluIG5vbi1wcm9kdWN0aW9uIGVudmlyb25tZW50c1xuICAgICAgICAgIC8vIHNvIEBlbW90aW9uL2plc3QgY2FuIGdyYWIgYGtleWAgZnJvbSB0aGUgKEpTKURPTSBmb3IgY2FjaGVzIHdpdGhvdXQgYW55IHJ1bGVzIGluc2VydGVkIHlldFxuICAgICAgICAgIGN1cnJlbnRTaGVldC5pbnNlcnQoZWxlbWVudC52YWx1ZSArIFwie31cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IDogcnVsZXNoZWV0KGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBjdXJyZW50U2hlZXQuaW5zZXJ0KHJ1bGUpO1xuICAgIH0pXTtcbiAgICB2YXIgc2VyaWFsaXplciA9IG1pZGRsZXdhcmUob21uaXByZXNlbnRQbHVnaW5zLmNvbmNhdChzdHlsaXNQbHVnaW5zLCBmaW5hbGl6aW5nUGx1Z2lucykpO1xuXG4gICAgdmFyIHN0eWxpcyA9IGZ1bmN0aW9uIHN0eWxpcyhzdHlsZXMpIHtcbiAgICAgIHJldHVybiBzZXJpYWxpemUoY29tcGlsZShzdHlsZXMpLCBzZXJpYWxpemVyKTtcbiAgICB9O1xuXG4gICAgX2luc2VydCA9IGZ1bmN0aW9uIGluc2VydChzZWxlY3Rvciwgc2VyaWFsaXplZCwgc2hlZXQsIHNob3VsZENhY2hlKSB7XG4gICAgICBjdXJyZW50U2hlZXQgPSBzaGVldDtcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgc2VyaWFsaXplZC5tYXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjdXJyZW50U2hlZXQgPSB7XG4gICAgICAgICAgaW5zZXJ0OiBmdW5jdGlvbiBpbnNlcnQocnVsZSkge1xuICAgICAgICAgICAgc2hlZXQuaW5zZXJ0KHJ1bGUgKyBzZXJpYWxpemVkLm1hcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBzdHlsaXMoc2VsZWN0b3IgPyBzZWxlY3RvciArIFwie1wiICsgc2VyaWFsaXplZC5zdHlsZXMgKyBcIn1cIiA6IHNlcmlhbGl6ZWQuc3R5bGVzKTtcblxuICAgICAgaWYgKHNob3VsZENhY2hlKSB7XG4gICAgICAgIGNhY2hlLmluc2VydGVkW3NlcmlhbGl6ZWQubmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgY2FjaGUgPSB7XG4gICAga2V5OiBrZXksXG4gICAgc2hlZXQ6IG5ldyBTdHlsZVNoZWV0KHtcbiAgICAgIGtleToga2V5LFxuICAgICAgY29udGFpbmVyOiBjb250YWluZXIsXG4gICAgICBub25jZTogb3B0aW9ucy5ub25jZSxcbiAgICAgIHNwZWVkeTogb3B0aW9ucy5zcGVlZHksXG4gICAgICBwcmVwZW5kOiBvcHRpb25zLnByZXBlbmRcbiAgICB9KSxcbiAgICBub25jZTogb3B0aW9ucy5ub25jZSxcbiAgICBpbnNlcnRlZDogaW5zZXJ0ZWQsXG4gICAgcmVnaXN0ZXJlZDoge30sXG4gICAgaW5zZXJ0OiBfaW5zZXJ0XG4gIH07XG4gIGNhY2hlLnNoZWV0Lmh5ZHJhdGUobm9kZXNUb0h5ZHJhdGUpO1xuICByZXR1cm4gY2FjaGU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDYWNoZTtcbiIsInZhciBpc0Jyb3dzZXIgPSBcIm9iamVjdFwiICE9PSAndW5kZWZpbmVkJztcbmZ1bmN0aW9uIGdldFJlZ2lzdGVyZWRTdHlsZXMocmVnaXN0ZXJlZCwgcmVnaXN0ZXJlZFN0eWxlcywgY2xhc3NOYW1lcykge1xuICB2YXIgcmF3Q2xhc3NOYW1lID0gJyc7XG4gIGNsYXNzTmFtZXMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICBpZiAocmVnaXN0ZXJlZFtjbGFzc05hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlZ2lzdGVyZWRTdHlsZXMucHVzaChyZWdpc3RlcmVkW2NsYXNzTmFtZV0gKyBcIjtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhd0NsYXNzTmFtZSArPSBjbGFzc05hbWUgKyBcIiBcIjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmF3Q2xhc3NOYW1lO1xufVxudmFyIGluc2VydFN0eWxlcyA9IGZ1bmN0aW9uIGluc2VydFN0eWxlcyhjYWNoZSwgc2VyaWFsaXplZCwgaXNTdHJpbmdUYWcpIHtcbiAgdmFyIGNsYXNzTmFtZSA9IGNhY2hlLmtleSArIFwiLVwiICsgc2VyaWFsaXplZC5uYW1lO1xuXG4gIGlmICggLy8gd2Ugb25seSBuZWVkIHRvIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSByZWdpc3RlcmVkIGNhY2hlIGlmIHRoZVxuICAvLyBjbGFzcyBuYW1lIGNvdWxkIGJlIHVzZWQgZnVydGhlciBkb3duXG4gIC8vIHRoZSB0cmVlIGJ1dCBpZiBpdCdzIGEgc3RyaW5nIHRhZywgd2Uga25vdyBpdCB3b24ndFxuICAvLyBzbyB3ZSBkb24ndCBoYXZlIHRvIGFkZCBpdCB0byByZWdpc3RlcmVkIGNhY2hlLlxuICAvLyB0aGlzIGltcHJvdmVzIG1lbW9yeSB1c2FnZSBzaW5jZSB3ZSBjYW4gYXZvaWQgc3RvcmluZyB0aGUgd2hvbGUgc3R5bGUgc3RyaW5nXG4gIChpc1N0cmluZ1RhZyA9PT0gZmFsc2UgfHwgLy8gd2UgbmVlZCB0byBhbHdheXMgc3RvcmUgaXQgaWYgd2UncmUgaW4gY29tcGF0IG1vZGUgYW5kXG4gIC8vIGluIG5vZGUgc2luY2UgZW1vdGlvbi1zZXJ2ZXIgcmVsaWVzIG9uIHdoZXRoZXIgYSBzdHlsZSBpcyBpblxuICAvLyB0aGUgcmVnaXN0ZXJlZCBjYWNoZSB0byBrbm93IHdoZXRoZXIgYSBzdHlsZSBpcyBnbG9iYWwgb3Igbm90XG4gIC8vIGFsc28sIG5vdGUgdGhhdCB0aGlzIGNoZWNrIHdpbGwgYmUgZGVhZCBjb2RlIGVsaW1pbmF0ZWQgaW4gdGhlIGJyb3dzZXJcbiAgaXNCcm93c2VyID09PSBmYWxzZSApICYmIGNhY2hlLnJlZ2lzdGVyZWRbY2xhc3NOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2FjaGUucmVnaXN0ZXJlZFtjbGFzc05hbWVdID0gc2VyaWFsaXplZC5zdHlsZXM7XG4gIH1cblxuICBpZiAoY2FjaGUuaW5zZXJ0ZWRbc2VyaWFsaXplZC5uYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBzZXJpYWxpemVkO1xuXG4gICAgZG8ge1xuICAgICAgdmFyIG1heWJlU3R5bGVzID0gY2FjaGUuaW5zZXJ0KHNlcmlhbGl6ZWQgPT09IGN1cnJlbnQgPyBcIi5cIiArIGNsYXNzTmFtZSA6ICcnLCBjdXJyZW50LCBjYWNoZS5zaGVldCwgdHJ1ZSk7XG5cbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfSB3aGlsZSAoY3VycmVudCAhPT0gdW5kZWZpbmVkKTtcbiAgfVxufTtcblxuZXhwb3J0IHsgZ2V0UmVnaXN0ZXJlZFN0eWxlcywgaW5zZXJ0U3R5bGVzIH07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2dhcnljb3VydC9tdXJtdXJoYXNoLWpzXG4vLyBQb3J0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYWFwcGxlYnkvc21oYXNoZXIvYmxvYi82MWEwNTMwZjI4Mjc3ZjJlODUwYmZjMzk2MDBjZTYxZDAyYjUxOGRlL3NyYy9NdXJtdXJIYXNoMi5jcHAjTDM3LUw4NlxuZnVuY3Rpb24gbXVybXVyMihzdHIpIHtcbiAgLy8gJ20nIGFuZCAncicgYXJlIG1peGluZyBjb25zdGFudHMgZ2VuZXJhdGVkIG9mZmxpbmUuXG4gIC8vIFRoZXkncmUgbm90IHJlYWxseSAnbWFnaWMnLCB0aGV5IGp1c3QgaGFwcGVuIHRvIHdvcmsgd2VsbC5cbiAgLy8gY29uc3QgbSA9IDB4NWJkMWU5OTU7XG4gIC8vIGNvbnN0IHIgPSAyNDtcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgaGFzaFxuICB2YXIgaCA9IDA7IC8vIE1peCA0IGJ5dGVzIGF0IGEgdGltZSBpbnRvIHRoZSBoYXNoXG5cbiAgdmFyIGssXG4gICAgICBpID0gMCxcbiAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XG5cbiAgZm9yICg7IGxlbiA+PSA0OyArK2ksIGxlbiAtPSA0KSB7XG4gICAgayA9IHN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZiB8IChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgOCB8IChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgMTYgfCAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDI0O1xuICAgIGsgPVxuICAgIC8qIE1hdGguaW11bChrLCBtKTogKi9cbiAgICAoayAmIDB4ZmZmZikgKiAweDViZDFlOTk1ICsgKChrID4+PiAxNikgKiAweGU5OTUgPDwgMTYpO1xuICAgIGsgXj1cbiAgICAvKiBrID4+PiByOiAqL1xuICAgIGsgPj4+IDI0O1xuICAgIGggPVxuICAgIC8qIE1hdGguaW11bChrLCBtKTogKi9cbiAgICAoayAmIDB4ZmZmZikgKiAweDViZDFlOTk1ICsgKChrID4+PiAxNikgKiAweGU5OTUgPDwgMTYpIF5cbiAgICAvKiBNYXRoLmltdWwoaCwgbSk6ICovXG4gICAgKGggJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoaCA+Pj4gMTYpICogMHhlOTk1IDw8IDE2KTtcbiAgfSAvLyBIYW5kbGUgdGhlIGxhc3QgZmV3IGJ5dGVzIG9mIHRoZSBpbnB1dCBhcnJheVxuXG5cbiAgc3dpdGNoIChsZW4pIHtcbiAgICBjYXNlIDM6XG4gICAgICBoIF49IChzdHIuY2hhckNvZGVBdChpICsgMikgJiAweGZmKSA8PCAxNjtcblxuICAgIGNhc2UgMjpcbiAgICAgIGggXj0gKHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmYpIDw8IDg7XG5cbiAgICBjYXNlIDE6XG4gICAgICBoIF49IHN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZjtcbiAgICAgIGggPVxuICAgICAgLyogTWF0aC5pbXVsKGgsIG0pOiAqL1xuICAgICAgKGggJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoaCA+Pj4gMTYpICogMHhlOTk1IDw8IDE2KTtcbiAgfSAvLyBEbyBhIGZldyBmaW5hbCBtaXhlcyBvZiB0aGUgaGFzaCB0byBlbnN1cmUgdGhlIGxhc3QgZmV3XG4gIC8vIGJ5dGVzIGFyZSB3ZWxsLWluY29ycG9yYXRlZC5cblxuXG4gIGggXj0gaCA+Pj4gMTM7XG4gIGggPVxuICAvKiBNYXRoLmltdWwoaCwgbSk6ICovXG4gIChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUgKyAoKGggPj4+IDE2KSAqIDB4ZTk5NSA8PCAxNik7XG4gIHJldHVybiAoKGggXiBoID4+PiAxNSkgPj4+IDApLnRvU3RyaW5nKDM2KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbXVybXVyMjtcbiIsInZhciB1bml0bGVzc0tleXMgPSB7XG4gIGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiAxLFxuICBib3JkZXJJbWFnZU91dHNldDogMSxcbiAgYm9yZGVySW1hZ2VTbGljZTogMSxcbiAgYm9yZGVySW1hZ2VXaWR0aDogMSxcbiAgYm94RmxleDogMSxcbiAgYm94RmxleEdyb3VwOiAxLFxuICBib3hPcmRpbmFsR3JvdXA6IDEsXG4gIGNvbHVtbkNvdW50OiAxLFxuICBjb2x1bW5zOiAxLFxuICBmbGV4OiAxLFxuICBmbGV4R3JvdzogMSxcbiAgZmxleFBvc2l0aXZlOiAxLFxuICBmbGV4U2hyaW5rOiAxLFxuICBmbGV4TmVnYXRpdmU6IDEsXG4gIGZsZXhPcmRlcjogMSxcbiAgZ3JpZFJvdzogMSxcbiAgZ3JpZFJvd0VuZDogMSxcbiAgZ3JpZFJvd1NwYW46IDEsXG4gIGdyaWRSb3dTdGFydDogMSxcbiAgZ3JpZENvbHVtbjogMSxcbiAgZ3JpZENvbHVtbkVuZDogMSxcbiAgZ3JpZENvbHVtblNwYW46IDEsXG4gIGdyaWRDb2x1bW5TdGFydDogMSxcbiAgbXNHcmlkUm93OiAxLFxuICBtc0dyaWRSb3dTcGFuOiAxLFxuICBtc0dyaWRDb2x1bW46IDEsXG4gIG1zR3JpZENvbHVtblNwYW46IDEsXG4gIGZvbnRXZWlnaHQ6IDEsXG4gIGxpbmVIZWlnaHQ6IDEsXG4gIG9wYWNpdHk6IDEsXG4gIG9yZGVyOiAxLFxuICBvcnBoYW5zOiAxLFxuICB0YWJTaXplOiAxLFxuICB3aWRvd3M6IDEsXG4gIHpJbmRleDogMSxcbiAgem9vbTogMSxcbiAgV2Via2l0TGluZUNsYW1wOiAxLFxuICAvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG4gIGZpbGxPcGFjaXR5OiAxLFxuICBmbG9vZE9wYWNpdHk6IDEsXG4gIHN0b3BPcGFjaXR5OiAxLFxuICBzdHJva2VEYXNoYXJyYXk6IDEsXG4gIHN0cm9rZURhc2hvZmZzZXQ6IDEsXG4gIHN0cm9rZU1pdGVybGltaXQ6IDEsXG4gIHN0cm9rZU9wYWNpdHk6IDEsXG4gIHN0cm9rZVdpZHRoOiAxXG59O1xuXG5leHBvcnQgZGVmYXVsdCB1bml0bGVzc0tleXM7XG4iLCJpbXBvcnQgaGFzaFN0cmluZyBmcm9tICdAZW1vdGlvbi9oYXNoJztcbmltcG9ydCB1bml0bGVzcyBmcm9tICdAZW1vdGlvbi91bml0bGVzcyc7XG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdAZW1vdGlvbi9tZW1vaXplJztcblxudmFyIElMTEVHQUxfRVNDQVBFX1NFUVVFTkNFX0VSUk9SID0gXCJZb3UgaGF2ZSBpbGxlZ2FsIGVzY2FwZSBzZXF1ZW5jZSBpbiB5b3VyIHRlbXBsYXRlIGxpdGVyYWwsIG1vc3QgbGlrZWx5IGluc2lkZSBjb250ZW50J3MgcHJvcGVydHkgdmFsdWUuXFxuQmVjYXVzZSB5b3Ugd3JpdGUgeW91ciBDU1MgaW5zaWRlIGEgSmF2YVNjcmlwdCBzdHJpbmcgeW91IGFjdHVhbGx5IGhhdmUgdG8gZG8gZG91YmxlIGVzY2FwaW5nLCBzbyBmb3IgZXhhbXBsZSBcXFwiY29udGVudDogJ1xcXFwwMGQ3JztcXFwiIHNob3VsZCBiZWNvbWUgXFxcImNvbnRlbnQ6ICdcXFxcXFxcXDAwZDcnO1xcXCIuXFxuWW91IGNhbiByZWFkIG1vcmUgYWJvdXQgdGhpcyBoZXJlOlxcbmh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL1RlbXBsYXRlX2xpdGVyYWxzI0VTMjAxOF9yZXZpc2lvbl9vZl9pbGxlZ2FsX2VzY2FwZV9zZXF1ZW5jZXNcIjtcbnZhciBVTkRFRklORURfQVNfT0JKRUNUX0tFWV9FUlJPUiA9IFwiWW91IGhhdmUgcGFzc2VkIGluIGZhbHN5IHZhbHVlIGFzIHN0eWxlIG9iamVjdCdzIGtleSAoY2FuIGhhcHBlbiB3aGVuIGluIGV4YW1wbGUgeW91IHBhc3MgdW5leHBvcnRlZCBjb21wb25lbnQgYXMgY29tcHV0ZWQga2V5KS5cIjtcbnZhciBoeXBoZW5hdGVSZWdleCA9IC9bQS1aXXxebXMvZztcbnZhciBhbmltYXRpb25SZWdleCA9IC9fRU1PXyhbXl9dKz8pXyhbXl0qPylfRU1PXy9nO1xuXG52YXIgaXNDdXN0b21Qcm9wZXJ0eSA9IGZ1bmN0aW9uIGlzQ3VzdG9tUHJvcGVydHkocHJvcGVydHkpIHtcbiAgcmV0dXJuIHByb3BlcnR5LmNoYXJDb2RlQXQoMSkgPT09IDQ1O1xufTtcblxudmFyIGlzUHJvY2Vzc2FibGVWYWx1ZSA9IGZ1bmN0aW9uIGlzUHJvY2Vzc2FibGVWYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJztcbn07XG5cbnZhciBwcm9jZXNzU3R5bGVOYW1lID0gLyogI19fUFVSRV9fICovbWVtb2l6ZShmdW5jdGlvbiAoc3R5bGVOYW1lKSB7XG4gIHJldHVybiBpc0N1c3RvbVByb3BlcnR5KHN0eWxlTmFtZSkgPyBzdHlsZU5hbWUgOiBzdHlsZU5hbWUucmVwbGFjZShoeXBoZW5hdGVSZWdleCwgJy0kJicpLnRvTG93ZXJDYXNlKCk7XG59KTtcblxudmFyIHByb2Nlc3NTdHlsZVZhbHVlID0gZnVuY3Rpb24gcHJvY2Vzc1N0eWxlVmFsdWUoa2V5LCB2YWx1ZSkge1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgJ2FuaW1hdGlvbic6XG4gICAgY2FzZSAnYW5pbWF0aW9uTmFtZSc6XG4gICAgICB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoYW5pbWF0aW9uUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCwgcDEsIHAyKSB7XG4gICAgICAgICAgICBjdXJzb3IgPSB7XG4gICAgICAgICAgICAgIG5hbWU6IHAxLFxuICAgICAgICAgICAgICBzdHlsZXM6IHAyLFxuICAgICAgICAgICAgICBuZXh0OiBjdXJzb3JcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gcDE7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgfVxuXG4gIGlmICh1bml0bGVzc1trZXldICE9PSAxICYmICFpc0N1c3RvbVByb3BlcnR5KGtleSkgJiYgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB2YWx1ZSArICdweCc7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgY29udGVudFZhbHVlUGF0dGVybiA9IC8oYXR0cnxjb3VudGVycz98dXJsfCgoKHJlcGVhdGluZy0pPyhsaW5lYXJ8cmFkaWFsKSl8Y29uaWMpLWdyYWRpZW50KVxcKHwobm8tKT8ob3BlbnxjbG9zZSktcXVvdGUvO1xuICB2YXIgY29udGVudFZhbHVlcyA9IFsnbm9ybWFsJywgJ25vbmUnLCAnaW5pdGlhbCcsICdpbmhlcml0JywgJ3Vuc2V0J107XG4gIHZhciBvbGRQcm9jZXNzU3R5bGVWYWx1ZSA9IHByb2Nlc3NTdHlsZVZhbHVlO1xuICB2YXIgbXNQYXR0ZXJuID0gL14tbXMtLztcbiAgdmFyIGh5cGhlblBhdHRlcm4gPSAvLSguKS9nO1xuICB2YXIgaHlwaGVuYXRlZENhY2hlID0ge307XG5cbiAgcHJvY2Vzc1N0eWxlVmFsdWUgPSBmdW5jdGlvbiBwcm9jZXNzU3R5bGVWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSA9PT0gJ2NvbnRlbnQnKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJyB8fCBjb250ZW50VmFsdWVzLmluZGV4T2YodmFsdWUpID09PSAtMSAmJiAhY29udGVudFZhbHVlUGF0dGVybi50ZXN0KHZhbHVlKSAmJiAodmFsdWUuY2hhckF0KDApICE9PSB2YWx1ZS5jaGFyQXQodmFsdWUubGVuZ3RoIC0gMSkgfHwgdmFsdWUuY2hhckF0KDApICE9PSAnXCInICYmIHZhbHVlLmNoYXJBdCgwKSAhPT0gXCInXCIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBzZWVtIHRvIGJlIHVzaW5nIGEgdmFsdWUgZm9yICdjb250ZW50JyB3aXRob3V0IHF1b3RlcywgdHJ5IHJlcGxhY2luZyBpdCB3aXRoIGBjb250ZW50OiAnXFxcIlwiICsgdmFsdWUgKyBcIlxcXCInYFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJvY2Vzc2VkID0gb2xkUHJvY2Vzc1N0eWxlVmFsdWUoa2V5LCB2YWx1ZSk7XG5cbiAgICBpZiAocHJvY2Vzc2VkICE9PSAnJyAmJiAhaXNDdXN0b21Qcm9wZXJ0eShrZXkpICYmIGtleS5pbmRleE9mKCctJykgIT09IC0xICYmIGh5cGhlbmF0ZWRDYWNoZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGh5cGhlbmF0ZWRDYWNoZVtrZXldID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJVc2luZyBrZWJhYi1jYXNlIGZvciBjc3MgcHJvcGVydGllcyBpbiBvYmplY3RzIGlzIG5vdCBzdXBwb3J0ZWQuIERpZCB5b3UgbWVhbiBcIiArIGtleS5yZXBsYWNlKG1zUGF0dGVybiwgJ21zLScpLnJlcGxhY2UoaHlwaGVuUGF0dGVybiwgZnVuY3Rpb24gKHN0ciwgX2NoYXIpIHtcbiAgICAgICAgcmV0dXJuIF9jaGFyLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9KSArIFwiP1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvY2Vzc2VkO1xuICB9O1xufVxuXG5mdW5jdGlvbiBoYW5kbGVJbnRlcnBvbGF0aW9uKG1lcmdlZFByb3BzLCByZWdpc3RlcmVkLCBpbnRlcnBvbGF0aW9uKSB7XG4gIGlmIChpbnRlcnBvbGF0aW9uID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAoaW50ZXJwb2xhdGlvbi5fX2Vtb3Rpb25fc3R5bGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBpbnRlcnBvbGF0aW9uLnRvU3RyaW5nKCkgPT09ICdOT19DT01QT05FTlRfU0VMRUNUT1InKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBzZWxlY3RvcnMgY2FuIG9ubHkgYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIEBlbW90aW9uL2JhYmVsLXBsdWdpbi4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGlvbjtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZW9mIGludGVycG9sYXRpb24pIHtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHtcbiAgICAgICAgaWYgKGludGVycG9sYXRpb24uYW5pbSA9PT0gMSkge1xuICAgICAgICAgIGN1cnNvciA9IHtcbiAgICAgICAgICAgIG5hbWU6IGludGVycG9sYXRpb24ubmFtZSxcbiAgICAgICAgICAgIHN0eWxlczogaW50ZXJwb2xhdGlvbi5zdHlsZXMsXG4gICAgICAgICAgICBuZXh0OiBjdXJzb3JcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBpbnRlcnBvbGF0aW9uLm5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW50ZXJwb2xhdGlvbi5zdHlsZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBuZXh0ID0gaW50ZXJwb2xhdGlvbi5uZXh0O1xuXG4gICAgICAgICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gbm90IHRoZSBtb3N0IGVmZmljaWVudCB0aGluZyBldmVyIGJ1dCB0aGlzIGlzIGEgcHJldHR5IHJhcmUgY2FzZVxuICAgICAgICAgICAgLy8gYW5kIHRoZXJlIHdpbGwgYmUgdmVyeSBmZXcgaXRlcmF0aW9ucyBvZiB0aGlzIGdlbmVyYWxseVxuICAgICAgICAgICAgd2hpbGUgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBjdXJzb3IgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmV4dC5uYW1lLFxuICAgICAgICAgICAgICAgIHN0eWxlczogbmV4dC5zdHlsZXMsXG4gICAgICAgICAgICAgICAgbmV4dDogY3Vyc29yXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5leHQgPSBuZXh0Lm5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN0eWxlcyA9IGludGVycG9sYXRpb24uc3R5bGVzICsgXCI7XCI7XG5cbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBpbnRlcnBvbGF0aW9uLm1hcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdHlsZXMgKz0gaW50ZXJwb2xhdGlvbi5tYXA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0eWxlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjcmVhdGVTdHJpbmdGcm9tT2JqZWN0KG1lcmdlZFByb3BzLCByZWdpc3RlcmVkLCBpbnRlcnBvbGF0aW9uKTtcbiAgICAgIH1cblxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHtcbiAgICAgICAgaWYgKG1lcmdlZFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgcHJldmlvdXNDdXJzb3IgPSBjdXJzb3I7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGludGVycG9sYXRpb24obWVyZ2VkUHJvcHMpO1xuICAgICAgICAgIGN1cnNvciA9IHByZXZpb3VzQ3Vyc29yO1xuICAgICAgICAgIHJldHVybiBoYW5kbGVJbnRlcnBvbGF0aW9uKG1lcmdlZFByb3BzLCByZWdpc3RlcmVkLCByZXN1bHQpO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdGdW5jdGlvbnMgdGhhdCBhcmUgaW50ZXJwb2xhdGVkIGluIGNzcyBjYWxscyB3aWxsIGJlIHN0cmluZ2lmaWVkLlxcbicgKyAnSWYgeW91IHdhbnQgdG8gaGF2ZSBhIGNzcyBjYWxsIGJhc2VkIG9uIHByb3BzLCBjcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBjc3MgY2FsbCBsaWtlIHRoaXNcXG4nICsgJ2xldCBkeW5hbWljU3R5bGUgPSAocHJvcHMpID0+IGNzc2Bjb2xvcjogJHtwcm9wcy5jb2xvcn1gXFxuJyArICdJdCBjYW4gYmUgY2FsbGVkIGRpcmVjdGx5IHdpdGggcHJvcHMgb3IgaW50ZXJwb2xhdGVkIGluIGEgc3R5bGVkIGNhbGwgbGlrZSB0aGlzXFxuJyArIFwibGV0IFNvbWVDb21wb25lbnQgPSBzdHlsZWQoJ2RpdicpYCR7ZHluYW1pY1N0eWxlfWBcIik7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IFtdO1xuICAgICAgICB2YXIgcmVwbGFjZWQgPSBpbnRlcnBvbGF0aW9uLnJlcGxhY2UoYW5pbWF0aW9uUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCwgcDEsIHAyKSB7XG4gICAgICAgICAgdmFyIGZha2VWYXJOYW1lID0gXCJhbmltYXRpb25cIiArIG1hdGNoZWQubGVuZ3RoO1xuICAgICAgICAgIG1hdGNoZWQucHVzaChcImNvbnN0IFwiICsgZmFrZVZhck5hbWUgKyBcIiA9IGtleWZyYW1lc2BcIiArIHAyLnJlcGxhY2UoL15Aa2V5ZnJhbWVzIGFuaW1hdGlvbi1cXHcrLywgJycpICsgXCJgXCIpO1xuICAgICAgICAgIHJldHVybiBcIiR7XCIgKyBmYWtlVmFyTmFtZSArIFwifVwiO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWF0Y2hlZC5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdga2V5ZnJhbWVzYCBvdXRwdXQgZ290IGludGVycG9sYXRlZCBpbnRvIHBsYWluIHN0cmluZywgcGxlYXNlIHdyYXAgaXQgd2l0aCBgY3NzYC5cXG5cXG4nICsgJ0luc3RlYWQgb2YgZG9pbmcgdGhpczpcXG5cXG4nICsgW10uY29uY2F0KG1hdGNoZWQsIFtcImBcIiArIHJlcGxhY2VkICsgXCJgXCJdKS5qb2luKCdcXG4nKSArICdcXG5cXG5Zb3Ugc2hvdWxkIHdyYXAgaXQgd2l0aCBgY3NzYCBsaWtlIHRoaXM6XFxuXFxuJyArIChcImNzc2BcIiArIHJlcGxhY2VkICsgXCJgXCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgfSAvLyBmaW5hbGl6ZSBzdHJpbmcgdmFsdWVzIChyZWd1bGFyIHN0cmluZ3MgYW5kIGZ1bmN0aW9ucyBpbnRlcnBvbGF0ZWQgaW50byBjc3MgY2FsbHMpXG5cblxuICBpZiAocmVnaXN0ZXJlZCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGludGVycG9sYXRpb247XG4gIH1cblxuICB2YXIgY2FjaGVkID0gcmVnaXN0ZXJlZFtpbnRlcnBvbGF0aW9uXTtcbiAgcmV0dXJuIGNhY2hlZCAhPT0gdW5kZWZpbmVkID8gY2FjaGVkIDogaW50ZXJwb2xhdGlvbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RyaW5nRnJvbU9iamVjdChtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgb2JqKSB7XG4gIHZhciBzdHJpbmcgPSAnJztcblxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0cmluZyArPSBoYW5kbGVJbnRlcnBvbGF0aW9uKG1lcmdlZFByb3BzLCByZWdpc3RlcmVkLCBvYmpbaV0pICsgXCI7XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIF9rZXkgaW4gb2JqKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvYmpbX2tleV07XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkICE9IG51bGwgJiYgcmVnaXN0ZXJlZFt2YWx1ZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN0cmluZyArPSBfa2V5ICsgXCJ7XCIgKyByZWdpc3RlcmVkW3ZhbHVlXSArIFwifVwiO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUHJvY2Vzc2FibGVWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgICAgICBzdHJpbmcgKz0gcHJvY2Vzc1N0eWxlTmFtZShfa2V5KSArIFwiOlwiICsgcHJvY2Vzc1N0eWxlVmFsdWUoX2tleSwgdmFsdWUpICsgXCI7XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfa2V5ID09PSAnTk9fQ09NUE9ORU5UX1NFTEVDVE9SJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgc2VsZWN0b3JzIGNhbiBvbmx5IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBAZW1vdGlvbi9iYWJlbC1wbHVnaW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlWzBdID09PSAnc3RyaW5nJyAmJiAocmVnaXN0ZXJlZCA9PSBudWxsIHx8IHJlZ2lzdGVyZWRbdmFsdWVbMF1dID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHZhbHVlLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgaWYgKGlzUHJvY2Vzc2FibGVWYWx1ZSh2YWx1ZVtfaV0pKSB7XG4gICAgICAgICAgICAgIHN0cmluZyArPSBwcm9jZXNzU3R5bGVOYW1lKF9rZXkpICsgXCI6XCIgKyBwcm9jZXNzU3R5bGVWYWx1ZShfa2V5LCB2YWx1ZVtfaV0pICsgXCI7XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBpbnRlcnBvbGF0ZWQgPSBoYW5kbGVJbnRlcnBvbGF0aW9uKG1lcmdlZFByb3BzLCByZWdpc3RlcmVkLCB2YWx1ZSk7XG5cbiAgICAgICAgICBzd2l0Y2ggKF9rZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FuaW1hdGlvbic6XG4gICAgICAgICAgICBjYXNlICdhbmltYXRpb25OYW1lJzpcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0cmluZyArPSBwcm9jZXNzU3R5bGVOYW1lKF9rZXkpICsgXCI6XCIgKyBpbnRlcnBvbGF0ZWQgKyBcIjtcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgX2tleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVU5ERUZJTkVEX0FTX09CSkVDVF9LRVlfRVJST1IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0cmluZyArPSBfa2V5ICsgXCJ7XCIgKyBpbnRlcnBvbGF0ZWQgKyBcIn1cIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdHJpbmc7XG59XG5cbnZhciBsYWJlbFBhdHRlcm4gPSAvbGFiZWw6XFxzKihbXlxccztcXG57XSspXFxzKig7fCQpL2c7XG52YXIgc291cmNlTWFwUGF0dGVybjtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgc291cmNlTWFwUGF0dGVybiA9IC9cXC9cXCojXFxzc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uXFwvanNvbjtcXFMrXFxzK1xcKlxcLy9nO1xufSAvLyB0aGlzIGlzIHRoZSBjdXJzb3IgZm9yIGtleWZyYW1lc1xuLy8ga2V5ZnJhbWVzIGFyZSBzdG9yZWQgb24gdGhlIFNlcmlhbGl6ZWRTdHlsZXMgb2JqZWN0IGFzIGEgbGlua2VkIGxpc3RcblxuXG52YXIgY3Vyc29yO1xudmFyIHNlcmlhbGl6ZVN0eWxlcyA9IGZ1bmN0aW9uIHNlcmlhbGl6ZVN0eWxlcyhhcmdzLCByZWdpc3RlcmVkLCBtZXJnZWRQcm9wcykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3NbMF0gPT09ICdvYmplY3QnICYmIGFyZ3NbMF0gIT09IG51bGwgJiYgYXJnc1swXS5zdHlsZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBhcmdzWzBdO1xuICB9XG5cbiAgdmFyIHN0cmluZ01vZGUgPSB0cnVlO1xuICB2YXIgc3R5bGVzID0gJyc7XG4gIGN1cnNvciA9IHVuZGVmaW5lZDtcbiAgdmFyIHN0cmluZ3MgPSBhcmdzWzBdO1xuXG4gIGlmIChzdHJpbmdzID09IG51bGwgfHwgc3RyaW5ncy5yYXcgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0cmluZ01vZGUgPSBmYWxzZTtcbiAgICBzdHlsZXMgKz0gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgc3RyaW5ncyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgc3RyaW5nc1swXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKElMTEVHQUxfRVNDQVBFX1NFUVVFTkNFX0VSUk9SKTtcbiAgICB9XG5cbiAgICBzdHlsZXMgKz0gc3RyaW5nc1swXTtcbiAgfSAvLyB3ZSBzdGFydCBhdCAxIHNpbmNlIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCB0aGUgZmlyc3QgYXJnXG5cblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICBzdHlsZXMgKz0gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgYXJnc1tpXSk7XG5cbiAgICBpZiAoc3RyaW5nTW9kZSkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgc3RyaW5nc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoSUxMRUdBTF9FU0NBUEVfU0VRVUVOQ0VfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXMgKz0gc3RyaW5nc1tpXTtcbiAgICB9XG4gIH1cblxuICB2YXIgc291cmNlTWFwO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgc3R5bGVzID0gc3R5bGVzLnJlcGxhY2Uoc291cmNlTWFwUGF0dGVybiwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICBzb3VyY2VNYXAgPSBtYXRjaDtcbiAgICAgIHJldHVybiAnJztcbiAgICB9KTtcbiAgfSAvLyB1c2luZyBhIGdsb2JhbCByZWdleCB3aXRoIC5leGVjIGlzIHN0YXRlZnVsIHNvIGxhc3RJbmRleCBoYXMgdG8gYmUgcmVzZXQgZWFjaCB0aW1lXG5cblxuICBsYWJlbFBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgdmFyIGlkZW50aWZpZXJOYW1lID0gJyc7XG4gIHZhciBtYXRjaDsgLy8gaHR0cHM6Ly9lc2JlbmNoLmNvbS9iZW5jaC81YjgwOWMyY2YyOTQ5ODAwYTBmNjFmYjVcblxuICB3aGlsZSAoKG1hdGNoID0gbGFiZWxQYXR0ZXJuLmV4ZWMoc3R5bGVzKSkgIT09IG51bGwpIHtcbiAgICBpZGVudGlmaWVyTmFtZSArPSAnLScgKyAvLyAkRmxvd0ZpeE1lIHdlIGtub3cgaXQncyBub3QgbnVsbFxuICAgIG1hdGNoWzFdO1xuICB9XG5cbiAgdmFyIG5hbWUgPSBoYXNoU3RyaW5nKHN0eWxlcykgKyBpZGVudGlmaWVyTmFtZTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vICRGbG93Rml4TWUgU2VyaWFsaXplZFN0eWxlcyB0eXBlIGRvZXNuJ3QgaGF2ZSB0b1N0cmluZyBwcm9wZXJ0eSAoYW5kIHdlIGRvbid0IHdhbnQgdG8gYWRkIGl0KVxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgc3R5bGVzOiBzdHlsZXMsXG4gICAgICBtYXA6IHNvdXJjZU1hcCxcbiAgICAgIG5leHQ6IGN1cnNvcixcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiWW91IGhhdmUgdHJpZWQgdG8gc3RyaW5naWZ5IG9iamVjdCByZXR1cm5lZCBmcm9tIGBjc3NgIGZ1bmN0aW9uLiBJdCBpc24ndCBzdXBwb3NlZCB0byBiZSB1c2VkIGRpcmVjdGx5IChlLmcuIGFzIHZhbHVlIG9mIHRoZSBgY2xhc3NOYW1lYCBwcm9wKSwgYnV0IHJhdGhlciBoYW5kZWQgdG8gZW1vdGlvbiBzbyBpdCBjYW4gaGFuZGxlIGl0IChlLmcuIGFzIHZhbHVlIG9mIGBjc3NgIHByb3ApLlwiO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgc3R5bGVzOiBzdHlsZXMsXG4gICAgbmV4dDogY3Vyc29yXG4gIH07XG59O1xuXG5leHBvcnQgeyBzZXJpYWxpemVTdHlsZXMgfTtcbiIsImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIGZvcndhcmRSZWYsIHVzZUNvbnRleHQsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY3JlYXRlQ2FjaGUgZnJvbSAnQGVtb3Rpb24vY2FjaGUnO1xuaW1wb3J0IF9leHRlbmRzIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMnO1xuaW1wb3J0IHdlYWtNZW1vaXplIGZyb20gJ0BlbW90aW9uL3dlYWstbWVtb2l6ZSc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnLi4vaXNvbGF0ZWQtaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MtZG8tbm90LXVzZS10aGlzLWluLXlvdXItY29kZS9kaXN0L2Vtb3Rpb24tcmVhY3QtaXNvbGF0ZWQtaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MtZG8tbm90LXVzZS10aGlzLWluLXlvdXItY29kZS5icm93c2VyLmVzbS5qcyc7XG5pbXBvcnQgeyBnZXRSZWdpc3RlcmVkU3R5bGVzLCBpbnNlcnRTdHlsZXMgfSBmcm9tICdAZW1vdGlvbi91dGlscyc7XG5pbXBvcnQgeyBzZXJpYWxpemVTdHlsZXMgfSBmcm9tICdAZW1vdGlvbi9zZXJpYWxpemUnO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgRW1vdGlvbkNhY2hlQ29udGV4dCA9IC8qICNfX1BVUkVfXyAqL2NyZWF0ZUNvbnRleHQoIC8vIHdlJ3JlIGRvaW5nIHRoaXMgdG8gYXZvaWQgcHJlY29uc3RydWN0J3MgZGVhZCBjb2RlIGVsaW1pbmF0aW9uIGluIHRoaXMgb25lIGNhc2Vcbi8vIGJlY2F1c2UgdGhpcyBtb2R1bGUgaXMgcHJpbWFyaWx5IGludGVuZGVkIGZvciB0aGUgYnJvd3NlciBhbmQgbm9kZVxuLy8gYnV0IGl0J3MgYWxzbyByZXF1aXJlZCBpbiByZWFjdCBuYXRpdmUgYW5kIHNpbWlsYXIgZW52aXJvbm1lbnRzIHNvbWV0aW1lc1xuLy8gYW5kIHdlIGNvdWxkIGhhdmUgYSBzcGVjaWFsIGJ1aWxkIGp1c3QgZm9yIHRoYXRcbi8vIGJ1dCB0aGlzIGlzIG11Y2ggZWFzaWVyIGFuZCB0aGUgbmF0aXZlIHBhY2thZ2VzXG4vLyBtaWdodCB1c2UgYSBkaWZmZXJlbnQgdGhlbWUgY29udGV4dCBpbiB0aGUgZnV0dXJlIGFueXdheVxudHlwZW9mIEhUTUxFbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/IC8qICNfX1BVUkVfXyAqL2NyZWF0ZUNhY2hlKHtcbiAga2V5OiAnY3NzJ1xufSkgOiBudWxsKTtcbnZhciBDYWNoZVByb3ZpZGVyID0gRW1vdGlvbkNhY2hlQ29udGV4dC5Qcm92aWRlcjtcblxudmFyIHdpdGhFbW90aW9uQ2FjaGUgPSBmdW5jdGlvbiB3aXRoRW1vdGlvbkNhY2hlKGZ1bmMpIHtcbiAgLy8gJEZsb3dGaXhNZVxuICByZXR1cm4gLyojX19QVVJFX18qL2ZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgICAvLyB0aGUgY2FjaGUgd2lsbCBuZXZlciBiZSBudWxsIGluIHRoZSBicm93c2VyXG4gICAgdmFyIGNhY2hlID0gdXNlQ29udGV4dChFbW90aW9uQ2FjaGVDb250ZXh0KTtcbiAgICByZXR1cm4gZnVuYyhwcm9wcywgY2FjaGUsIHJlZik7XG4gIH0pO1xufTtcblxudmFyIFRoZW1lQ29udGV4dCA9IC8qICNfX1BVUkVfXyAqL2NyZWF0ZUNvbnRleHQoe30pO1xudmFyIHVzZVRoZW1lID0gZnVuY3Rpb24gdXNlVGhlbWUoKSB7XG4gIHJldHVybiB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XG59O1xuXG52YXIgZ2V0VGhlbWUgPSBmdW5jdGlvbiBnZXRUaGVtZShvdXRlclRoZW1lLCB0aGVtZSkge1xuICBpZiAodHlwZW9mIHRoZW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIG1lcmdlZFRoZW1lID0gdGhlbWUob3V0ZXJUaGVtZSk7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAobWVyZ2VkVGhlbWUgPT0gbnVsbCB8fCB0eXBlb2YgbWVyZ2VkVGhlbWUgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkobWVyZ2VkVGhlbWUpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVGhlbWVQcm92aWRlcl0gUGxlYXNlIHJldHVybiBhbiBvYmplY3QgZnJvbSB5b3VyIHRoZW1lIGZ1bmN0aW9uLCBpLmUuIHRoZW1lPXsoKSA9PiAoe30pfSEnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VkVGhlbWU7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAodGhlbWUgPT0gbnVsbCB8fCB0eXBlb2YgdGhlbWUgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkodGhlbWUpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignW1RoZW1lUHJvdmlkZXJdIFBsZWFzZSBtYWtlIHlvdXIgdGhlbWUgcHJvcCBhIHBsYWluIG9iamVjdCcpO1xuICB9XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBvdXRlclRoZW1lLCB0aGVtZSk7XG59O1xuXG52YXIgY3JlYXRlQ2FjaGVXaXRoVGhlbWUgPSAvKiAjX19QVVJFX18gKi93ZWFrTWVtb2l6ZShmdW5jdGlvbiAob3V0ZXJUaGVtZSkge1xuICByZXR1cm4gd2Vha01lbW9pemUoZnVuY3Rpb24gKHRoZW1lKSB7XG4gICAgcmV0dXJuIGdldFRoZW1lKG91dGVyVGhlbWUsIHRoZW1lKTtcbiAgfSk7XG59KTtcbnZhciBUaGVtZVByb3ZpZGVyID0gZnVuY3Rpb24gVGhlbWVQcm92aWRlcihwcm9wcykge1xuICB2YXIgdGhlbWUgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XG5cbiAgaWYgKHByb3BzLnRoZW1lICE9PSB0aGVtZSkge1xuICAgIHRoZW1lID0gY3JlYXRlQ2FjaGVXaXRoVGhlbWUodGhlbWUpKHByb3BzLnRoZW1lKTtcbiAgfVxuXG4gIHJldHVybiAvKiNfX1BVUkVfXyovY3JlYXRlRWxlbWVudChUaGVtZUNvbnRleHQuUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogdGhlbWVcbiAgfSwgcHJvcHMuY2hpbGRyZW4pO1xufTtcbmZ1bmN0aW9uIHdpdGhUaGVtZShDb21wb25lbnQpIHtcbiAgdmFyIGNvbXBvbmVudE5hbWUgPSBDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgQ29tcG9uZW50Lm5hbWUgfHwgJ0NvbXBvbmVudCc7XG5cbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihwcm9wcywgcmVmKSB7XG4gICAgdmFyIHRoZW1lID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xuICAgIHJldHVybiAvKiNfX1BVUkVfXyovY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9leHRlbmRzKHtcbiAgICAgIHRoZW1lOiB0aGVtZSxcbiAgICAgIHJlZjogcmVmXG4gICAgfSwgcHJvcHMpKTtcbiAgfTsgLy8gJEZsb3dGaXhNZVxuXG5cbiAgdmFyIFdpdGhUaGVtZSA9IC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKHJlbmRlcik7XG4gIFdpdGhUaGVtZS5kaXNwbGF5TmFtZSA9IFwiV2l0aFRoZW1lKFwiICsgY29tcG9uZW50TmFtZSArIFwiKVwiO1xuICByZXR1cm4gaG9pc3ROb25SZWFjdFN0YXRpY3MoV2l0aFRoZW1lLCBDb21wb25lbnQpO1xufVxuXG4vLyB0aHVzIHdlIG9ubHkgbmVlZCB0byByZXBsYWNlIHdoYXQgaXMgYSB2YWxpZCBjaGFyYWN0ZXIgZm9yIEpTLCBidXQgbm90IGZvciBDU1NcblxudmFyIHNhbml0aXplSWRlbnRpZmllciA9IGZ1bmN0aW9uIHNhbml0aXplSWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHJldHVybiBpZGVudGlmaWVyLnJlcGxhY2UoL1xcJC9nLCAnLScpO1xufTtcblxudmFyIHR5cGVQcm9wTmFtZSA9ICdfX0VNT1RJT05fVFlQRV9QTEVBU0VfRE9fTk9UX1VTRV9fJztcbnZhciBsYWJlbFByb3BOYW1lID0gJ19fRU1PVElPTl9MQUJFTF9QTEVBU0VfRE9fTk9UX1VTRV9fJztcbnZhciBjcmVhdGVFbW90aW9uUHJvcHMgPSBmdW5jdGlvbiBjcmVhdGVFbW90aW9uUHJvcHModHlwZSwgcHJvcHMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIHByb3BzLmNzcyA9PT0gJ3N0cmluZycgJiYgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYSBjc3MgZGVjbGFyYXRpb25cbiAgcHJvcHMuY3NzLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdHJpbmdzIGFyZSBub3QgYWxsb3dlZCBhcyBjc3MgcHJvcCB2YWx1ZXMsIHBsZWFzZSB3cmFwIGl0IGluIGEgY3NzIHRlbXBsYXRlIGxpdGVyYWwgZnJvbSAnQGVtb3Rpb24vcmVhY3QnIGxpa2UgdGhpczogY3NzYFwiICsgcHJvcHMuY3NzICsgXCJgXCIpO1xuICB9XG5cbiAgdmFyIG5ld1Byb3BzID0ge307XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwocHJvcHMsIGtleSkpIHtcbiAgICAgIG5ld1Byb3BzW2tleV0gPSBwcm9wc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIG5ld1Byb3BzW3R5cGVQcm9wTmFtZV0gPSB0eXBlO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCk7XG5cbiAgICBpZiAoZXJyb3Iuc3RhY2spIHtcbiAgICAgIC8vIGNocm9tZVxuICAgICAgdmFyIG1hdGNoID0gZXJyb3Iuc3RhY2subWF0Y2goL2F0ICg/Ok9iamVjdFxcLnxNb2R1bGVcXC58KSg/OmpzeHxjcmVhdGVFbW90aW9uUHJvcHMpLipcXG5cXHMrYXQgKD86T2JqZWN0XFwufCkoW0EtWl1bQS1aYS16MC05JF0rKSAvKTtcblxuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAvLyBzYWZhcmkgYW5kIGZpcmVmb3hcbiAgICAgICAgbWF0Y2ggPSBlcnJvci5zdGFjay5tYXRjaCgvLipcXG4oW0EtWl1bQS1aYS16MC05JF0rKUAvKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIG5ld1Byb3BzW2xhYmVsUHJvcE5hbWVdID0gc2FuaXRpemVJZGVudGlmaWVyKG1hdGNoWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3UHJvcHM7XG59O1xudmFyIEVtb3Rpb24gPSAvKiAjX19QVVJFX18gKi93aXRoRW1vdGlvbkNhY2hlKGZ1bmN0aW9uIChwcm9wcywgY2FjaGUsIHJlZikge1xuICB2YXIgY3NzUHJvcCA9IHByb3BzLmNzczsgLy8gc28gdGhhdCB1c2luZyBgY3NzYCBmcm9tIGBlbW90aW9uYCBhbmQgcGFzc2luZyB0aGUgcmVzdWx0IHRvIHRoZSBjc3MgcHJvcCB3b3Jrc1xuICAvLyBub3QgcGFzc2luZyB0aGUgcmVnaXN0ZXJlZCBjYWNoZSB0byBzZXJpYWxpemVTdHlsZXMgYmVjYXVzZSBpdCB3b3VsZFxuICAvLyBtYWtlIGNlcnRhaW4gYmFiZWwgb3B0aW1pc2F0aW9ucyBub3QgcG9zc2libGVcblxuICBpZiAodHlwZW9mIGNzc1Byb3AgPT09ICdzdHJpbmcnICYmIGNhY2hlLnJlZ2lzdGVyZWRbY3NzUHJvcF0gIT09IHVuZGVmaW5lZCkge1xuICAgIGNzc1Byb3AgPSBjYWNoZS5yZWdpc3RlcmVkW2Nzc1Byb3BdO1xuICB9XG5cbiAgdmFyIHR5cGUgPSBwcm9wc1t0eXBlUHJvcE5hbWVdO1xuICB2YXIgcmVnaXN0ZXJlZFN0eWxlcyA9IFtjc3NQcm9wXTtcbiAgdmFyIGNsYXNzTmFtZSA9ICcnO1xuXG4gIGlmICh0eXBlb2YgcHJvcHMuY2xhc3NOYW1lID09PSAnc3RyaW5nJykge1xuICAgIGNsYXNzTmFtZSA9IGdldFJlZ2lzdGVyZWRTdHlsZXMoY2FjaGUucmVnaXN0ZXJlZCwgcmVnaXN0ZXJlZFN0eWxlcywgcHJvcHMuY2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChwcm9wcy5jbGFzc05hbWUgIT0gbnVsbCkge1xuICAgIGNsYXNzTmFtZSA9IHByb3BzLmNsYXNzTmFtZSArIFwiIFwiO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWQgPSBzZXJpYWxpemVTdHlsZXMocmVnaXN0ZXJlZFN0eWxlcywgdW5kZWZpbmVkLCB0eXBlb2YgY3NzUHJvcCA9PT0gJ2Z1bmN0aW9uJyB8fCBBcnJheS5pc0FycmF5KGNzc1Byb3ApID8gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpIDogdW5kZWZpbmVkKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBzZXJpYWxpemVkLm5hbWUuaW5kZXhPZignLScpID09PSAtMSkge1xuICAgIHZhciBsYWJlbEZyb21TdGFjayA9IHByb3BzW2xhYmVsUHJvcE5hbWVdO1xuXG4gICAgaWYgKGxhYmVsRnJvbVN0YWNrKSB7XG4gICAgICBzZXJpYWxpemVkID0gc2VyaWFsaXplU3R5bGVzKFtzZXJpYWxpemVkLCAnbGFiZWw6JyArIGxhYmVsRnJvbVN0YWNrICsgJzsnXSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJ1bGVzID0gaW5zZXJ0U3R5bGVzKGNhY2hlLCBzZXJpYWxpemVkLCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpO1xuICBjbGFzc05hbWUgKz0gY2FjaGUua2V5ICsgXCItXCIgKyBzZXJpYWxpemVkLm5hbWU7XG4gIHZhciBuZXdQcm9wcyA9IHt9O1xuXG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCBrZXkpICYmIGtleSAhPT0gJ2NzcycgJiYga2V5ICE9PSB0eXBlUHJvcE5hbWUgJiYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgfHwga2V5ICE9PSBsYWJlbFByb3BOYW1lKSkge1xuICAgICAgbmV3UHJvcHNba2V5XSA9IHByb3BzW2tleV07XG4gICAgfVxuICB9XG5cbiAgbmV3UHJvcHMucmVmID0gcmVmO1xuICBuZXdQcm9wcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gIHZhciBlbGUgPSAvKiNfX1BVUkVfXyovY3JlYXRlRWxlbWVudCh0eXBlLCBuZXdQcm9wcyk7XG5cbiAgcmV0dXJuIGVsZTtcbn0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBFbW90aW9uLmRpc3BsYXlOYW1lID0gJ0Vtb3Rpb25Dc3NQcm9wSW50ZXJuYWwnO1xufVxuXG5leHBvcnQgeyBDYWNoZVByb3ZpZGVyIGFzIEMsIEVtb3Rpb24gYXMgRSwgVGhlbWVDb250ZXh0IGFzIFQsIFRoZW1lUHJvdmlkZXIgYXMgYSwgd2l0aFRoZW1lIGFzIGIsIGNyZWF0ZUVtb3Rpb25Qcm9wcyBhcyBjLCBoYXNPd25Qcm9wZXJ0eSBhcyBoLCB1c2VUaGVtZSBhcyB1LCB3aXRoRW1vdGlvbkNhY2hlIGFzIHcgfTtcbiIsImZ1bmN0aW9uIF9leHRlbmRzKCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9leHRlbmRzO1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsImltcG9ydCB7IGlzU3RyaW5nLCBvbWl0LCBfX0RFVl9fIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcblxuLyoqXG4gKiBDYXJlZnVsbHkgc2VsZWN0ZWQgaHRtbCBlbGVtZW50cyBmb3IgY2hha3JhIGNvbXBvbmVudHMuXG4gKiBUaGlzIGlzIG1vc3RseSBmb3IgYGNoYWtyYS48ZWxlbWVudD5gIHN5bnRheC5cbiAqL1xuZXhwb3J0IHZhciBkb21FbGVtZW50cyA9IFtcImFcIiwgXCJiXCIsIFwiYXJ0aWNsZVwiLCBcImFzaWRlXCIsIFwiYmxvY2txdW90ZVwiLCBcImJ1dHRvblwiLCBcImNhcHRpb25cIiwgXCJjaXRlXCIsIFwiY2lyY2xlXCIsIFwiY29kZVwiLCBcImRkXCIsIFwiZGl2XCIsIFwiZGxcIiwgXCJkdFwiLCBcImZpZWxkc2V0XCIsIFwiZmlnY2FwdGlvblwiLCBcImZpZ3VyZVwiLCBcImZvb3RlclwiLCBcImZvcm1cIiwgXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJoZWFkZXJcIiwgXCJoclwiLCBcImltZ1wiLCBcImlucHV0XCIsIFwia2JkXCIsIFwibGFiZWxcIiwgXCJsaVwiLCBcIm1haW5cIiwgXCJtYXJrXCIsIFwibmF2XCIsIFwib2xcIiwgXCJwXCIsIFwicGF0aFwiLCBcInByZVwiLCBcInFcIiwgXCJyZWN0XCIsIFwic1wiLCBcInN2Z1wiLCBcInNlY3Rpb25cIiwgXCJzZWxlY3RcIiwgXCJzdHJvbmdcIiwgXCJzbWFsbFwiLCBcInNwYW5cIiwgXCJzdWJcIiwgXCJzdXBcIiwgXCJ0YWJsZVwiLCBcInRib2R5XCIsIFwidGRcIiwgXCJ0ZXh0YXJlYVwiLCBcInRmb290XCIsIFwidGhcIiwgXCJ0aGVhZFwiLCBcInRyXCIsIFwidWxcIl07XG5leHBvcnQgZnVuY3Rpb24gb21pdFRoZW1pbmdQcm9wcyhwcm9wcykge1xuICByZXR1cm4gb21pdChwcm9wcywgW1wic3R5bGVDb25maWdcIiwgXCJzaXplXCIsIFwidmFyaWFudFwiLCBcImNvbG9yU2NoZW1lXCJdKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVGFnKHRhcmdldCkge1xuICByZXR1cm4gaXNTdHJpbmcodGFyZ2V0KSAmJiAoX19ERVZfXyA/IHRhcmdldC5jaGFyQXQoMCkgPT09IHRhcmdldC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSA6IHRydWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKHByaW1pdGl2ZSkge1xuICByZXR1cm4gaXNUYWcocHJpbWl0aXZlKSA/IFwiY2hha3JhLlwiICsgcHJpbWl0aXZlIDogZ2V0Q29tcG9uZW50TmFtZShwcmltaXRpdmUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnROYW1lKHByaW1pdGl2ZSkge1xuICByZXR1cm4gKF9fREVWX18gPyBpc1N0cmluZyhwcmltaXRpdmUpICYmIHByaW1pdGl2ZSA6IGZhbHNlKSB8fCAhaXNTdHJpbmcocHJpbWl0aXZlKSAmJiBwcmltaXRpdmUuZGlzcGxheU5hbWUgfHwgIWlzU3RyaW5nKHByaW1pdGl2ZSkgJiYgcHJpbWl0aXZlLm5hbWUgfHwgXCJDaGFrcmFDb21wb25lbnRcIjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbS51dGlscy5qcy5tYXAiLCJpbXBvcnQgbWVtb2l6ZSBmcm9tICdAZW1vdGlvbi9tZW1vaXplJztcblxudmFyIHJlYWN0UHJvcHNSZWdleCA9IC9eKChjaGlsZHJlbnxkYW5nZXJvdXNseVNldElubmVySFRNTHxrZXl8cmVmfGF1dG9Gb2N1c3xkZWZhdWx0VmFsdWV8ZGVmYXVsdENoZWNrZWR8aW5uZXJIVE1MfHN1cHByZXNzQ29udGVudEVkaXRhYmxlV2FybmluZ3xzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmd8dmFsdWVMaW5rfGFjY2VwdHxhY2NlcHRDaGFyc2V0fGFjY2Vzc0tleXxhY3Rpb258YWxsb3d8YWxsb3dVc2VyTWVkaWF8YWxsb3dQYXltZW50UmVxdWVzdHxhbGxvd0Z1bGxTY3JlZW58YWxsb3dUcmFuc3BhcmVuY3l8YWx0fGFzeW5jfGF1dG9Db21wbGV0ZXxhdXRvUGxheXxjYXB0dXJlfGNlbGxQYWRkaW5nfGNlbGxTcGFjaW5nfGNoYWxsZW5nZXxjaGFyU2V0fGNoZWNrZWR8Y2l0ZXxjbGFzc0lEfGNsYXNzTmFtZXxjb2xzfGNvbFNwYW58Y29udGVudHxjb250ZW50RWRpdGFibGV8Y29udGV4dE1lbnV8Y29udHJvbHN8Y29udHJvbHNMaXN0fGNvb3Jkc3xjcm9zc09yaWdpbnxkYXRhfGRhdGVUaW1lfGRlY29kaW5nfGRlZmF1bHR8ZGVmZXJ8ZGlyfGRpc2FibGVkfGRpc2FibGVQaWN0dXJlSW5QaWN0dXJlfGRvd25sb2FkfGRyYWdnYWJsZXxlbmNUeXBlfGZvcm18Zm9ybUFjdGlvbnxmb3JtRW5jVHlwZXxmb3JtTWV0aG9kfGZvcm1Ob1ZhbGlkYXRlfGZvcm1UYXJnZXR8ZnJhbWVCb3JkZXJ8aGVhZGVyc3xoZWlnaHR8aGlkZGVufGhpZ2h8aHJlZnxocmVmTGFuZ3xodG1sRm9yfGh0dHBFcXVpdnxpZHxpbnB1dE1vZGV8aW50ZWdyaXR5fGlzfGtleVBhcmFtc3xrZXlUeXBlfGtpbmR8bGFiZWx8bGFuZ3xsaXN0fGxvYWRpbmd8bG9vcHxsb3d8bWFyZ2luSGVpZ2h0fG1hcmdpbldpZHRofG1heHxtYXhMZW5ndGh8bWVkaWF8bWVkaWFHcm91cHxtZXRob2R8bWlufG1pbkxlbmd0aHxtdWx0aXBsZXxtdXRlZHxuYW1lfG5vbmNlfG5vVmFsaWRhdGV8b3BlbnxvcHRpbXVtfHBhdHRlcm58cGxhY2Vob2xkZXJ8cGxheXNJbmxpbmV8cG9zdGVyfHByZWxvYWR8cHJvZmlsZXxyYWRpb0dyb3VwfHJlYWRPbmx5fHJlZmVycmVyUG9saWN5fHJlbHxyZXF1aXJlZHxyZXZlcnNlZHxyb2xlfHJvd3N8cm93U3BhbnxzYW5kYm94fHNjb3BlfHNjb3BlZHxzY3JvbGxpbmd8c2VhbWxlc3N8c2VsZWN0ZWR8c2hhcGV8c2l6ZXxzaXplc3xzbG90fHNwYW58c3BlbGxDaGVja3xzcmN8c3JjRG9jfHNyY0xhbmd8c3JjU2V0fHN0YXJ0fHN0ZXB8c3R5bGV8c3VtbWFyeXx0YWJJbmRleHx0YXJnZXR8dGl0bGV8dHJhbnNsYXRlfHR5cGV8dXNlTWFwfHZhbHVlfHdpZHRofHdtb2RlfHdyYXB8YWJvdXR8ZGF0YXR5cGV8aW5saXN0fHByZWZpeHxwcm9wZXJ0eXxyZXNvdXJjZXx0eXBlb2Z8dm9jYWJ8YXV0b0NhcGl0YWxpemV8YXV0b0NvcnJlY3R8YXV0b1NhdmV8Y29sb3J8ZmFsbGJhY2t8aW5lcnR8aXRlbVByb3B8aXRlbVNjb3BlfGl0ZW1UeXBlfGl0ZW1JRHxpdGVtUmVmfG9ufG9wdGlvbnxyZXN1bHRzfHNlY3VyaXR5fHVuc2VsZWN0YWJsZXxhY2NlbnRIZWlnaHR8YWNjdW11bGF0ZXxhZGRpdGl2ZXxhbGlnbm1lbnRCYXNlbGluZXxhbGxvd1Jlb3JkZXJ8YWxwaGFiZXRpY3xhbXBsaXR1ZGV8YXJhYmljRm9ybXxhc2NlbnR8YXR0cmlidXRlTmFtZXxhdHRyaWJ1dGVUeXBlfGF1dG9SZXZlcnNlfGF6aW11dGh8YmFzZUZyZXF1ZW5jeXxiYXNlbGluZVNoaWZ0fGJhc2VQcm9maWxlfGJib3h8YmVnaW58Ymlhc3xieXxjYWxjTW9kZXxjYXBIZWlnaHR8Y2xpcHxjbGlwUGF0aFVuaXRzfGNsaXBQYXRofGNsaXBSdWxlfGNvbG9ySW50ZXJwb2xhdGlvbnxjb2xvckludGVycG9sYXRpb25GaWx0ZXJzfGNvbG9yUHJvZmlsZXxjb2xvclJlbmRlcmluZ3xjb250ZW50U2NyaXB0VHlwZXxjb250ZW50U3R5bGVUeXBlfGN1cnNvcnxjeHxjeXxkfGRlY2VsZXJhdGV8ZGVzY2VudHxkaWZmdXNlQ29uc3RhbnR8ZGlyZWN0aW9ufGRpc3BsYXl8ZGl2aXNvcnxkb21pbmFudEJhc2VsaW5lfGR1cnxkeHxkeXxlZGdlTW9kZXxlbGV2YXRpb258ZW5hYmxlQmFja2dyb3VuZHxlbmR8ZXhwb25lbnR8ZXh0ZXJuYWxSZXNvdXJjZXNSZXF1aXJlZHxmaWxsfGZpbGxPcGFjaXR5fGZpbGxSdWxlfGZpbHRlcnxmaWx0ZXJSZXN8ZmlsdGVyVW5pdHN8Zmxvb2RDb2xvcnxmbG9vZE9wYWNpdHl8Zm9jdXNhYmxlfGZvbnRGYW1pbHl8Zm9udFNpemV8Zm9udFNpemVBZGp1c3R8Zm9udFN0cmV0Y2h8Zm9udFN0eWxlfGZvbnRWYXJpYW50fGZvbnRXZWlnaHR8Zm9ybWF0fGZyb218ZnJ8Znh8Znl8ZzF8ZzJ8Z2x5cGhOYW1lfGdseXBoT3JpZW50YXRpb25Ib3Jpem9udGFsfGdseXBoT3JpZW50YXRpb25WZXJ0aWNhbHxnbHlwaFJlZnxncmFkaWVudFRyYW5zZm9ybXxncmFkaWVudFVuaXRzfGhhbmdpbmd8aG9yaXpBZHZYfGhvcml6T3JpZ2luWHxpZGVvZ3JhcGhpY3xpbWFnZVJlbmRlcmluZ3xpbnxpbjJ8aW50ZXJjZXB0fGt8azF8azJ8azN8azR8a2VybmVsTWF0cml4fGtlcm5lbFVuaXRMZW5ndGh8a2VybmluZ3xrZXlQb2ludHN8a2V5U3BsaW5lc3xrZXlUaW1lc3xsZW5ndGhBZGp1c3R8bGV0dGVyU3BhY2luZ3xsaWdodGluZ0NvbG9yfGxpbWl0aW5nQ29uZUFuZ2xlfGxvY2FsfG1hcmtlckVuZHxtYXJrZXJNaWR8bWFya2VyU3RhcnR8bWFya2VySGVpZ2h0fG1hcmtlclVuaXRzfG1hcmtlcldpZHRofG1hc2t8bWFza0NvbnRlbnRVbml0c3xtYXNrVW5pdHN8bWF0aGVtYXRpY2FsfG1vZGV8bnVtT2N0YXZlc3xvZmZzZXR8b3BhY2l0eXxvcGVyYXRvcnxvcmRlcnxvcmllbnR8b3JpZW50YXRpb258b3JpZ2lufG92ZXJmbG93fG92ZXJsaW5lUG9zaXRpb258b3ZlcmxpbmVUaGlja25lc3N8cGFub3NlMXxwYWludE9yZGVyfHBhdGhMZW5ndGh8cGF0dGVybkNvbnRlbnRVbml0c3xwYXR0ZXJuVHJhbnNmb3JtfHBhdHRlcm5Vbml0c3xwb2ludGVyRXZlbnRzfHBvaW50c3xwb2ludHNBdFh8cG9pbnRzQXRZfHBvaW50c0F0WnxwcmVzZXJ2ZUFscGhhfHByZXNlcnZlQXNwZWN0UmF0aW98cHJpbWl0aXZlVW5pdHN8cnxyYWRpdXN8cmVmWHxyZWZZfHJlbmRlcmluZ0ludGVudHxyZXBlYXRDb3VudHxyZXBlYXREdXJ8cmVxdWlyZWRFeHRlbnNpb25zfHJlcXVpcmVkRmVhdHVyZXN8cmVzdGFydHxyZXN1bHR8cm90YXRlfHJ4fHJ5fHNjYWxlfHNlZWR8c2hhcGVSZW5kZXJpbmd8c2xvcGV8c3BhY2luZ3xzcGVjdWxhckNvbnN0YW50fHNwZWN1bGFyRXhwb25lbnR8c3BlZWR8c3ByZWFkTWV0aG9kfHN0YXJ0T2Zmc2V0fHN0ZERldmlhdGlvbnxzdGVtaHxzdGVtdnxzdGl0Y2hUaWxlc3xzdG9wQ29sb3J8c3RvcE9wYWNpdHl8c3RyaWtldGhyb3VnaFBvc2l0aW9ufHN0cmlrZXRocm91Z2hUaGlja25lc3N8c3RyaW5nfHN0cm9rZXxzdHJva2VEYXNoYXJyYXl8c3Ryb2tlRGFzaG9mZnNldHxzdHJva2VMaW5lY2FwfHN0cm9rZUxpbmVqb2lufHN0cm9rZU1pdGVybGltaXR8c3Ryb2tlT3BhY2l0eXxzdHJva2VXaWR0aHxzdXJmYWNlU2NhbGV8c3lzdGVtTGFuZ3VhZ2V8dGFibGVWYWx1ZXN8dGFyZ2V0WHx0YXJnZXRZfHRleHRBbmNob3J8dGV4dERlY29yYXRpb258dGV4dFJlbmRlcmluZ3x0ZXh0TGVuZ3RofHRvfHRyYW5zZm9ybXx1MXx1Mnx1bmRlcmxpbmVQb3NpdGlvbnx1bmRlcmxpbmVUaGlja25lc3N8dW5pY29kZXx1bmljb2RlQmlkaXx1bmljb2RlUmFuZ2V8dW5pdHNQZXJFbXx2QWxwaGFiZXRpY3x2SGFuZ2luZ3x2SWRlb2dyYXBoaWN8dk1hdGhlbWF0aWNhbHx2YWx1ZXN8dmVjdG9yRWZmZWN0fHZlcnNpb258dmVydEFkdll8dmVydE9yaWdpblh8dmVydE9yaWdpbll8dmlld0JveHx2aWV3VGFyZ2V0fHZpc2liaWxpdHl8d2lkdGhzfHdvcmRTcGFjaW5nfHdyaXRpbmdNb2RlfHh8eEhlaWdodHx4MXx4Mnx4Q2hhbm5lbFNlbGVjdG9yfHhsaW5rQWN0dWF0ZXx4bGlua0FyY3JvbGV8eGxpbmtIcmVmfHhsaW5rUm9sZXx4bGlua1Nob3d8eGxpbmtUaXRsZXx4bGlua1R5cGV8eG1sQmFzZXx4bWxuc3x4bWxuc1hsaW5rfHhtbExhbmd8eG1sU3BhY2V8eXx5MXx5Mnx5Q2hhbm5lbFNlbGVjdG9yfHp8em9vbUFuZFBhbnxmb3J8Y2xhc3N8YXV0b2ZvY3VzKXwoKFtEZF1bQWFdW1R0XVtBYV18W0FhXVtScl1bSWldW0FhXXx4KS0uKikpJC87IC8vIGh0dHBzOi8vZXNiZW5jaC5jb20vYmVuY2gvNWJmZWU2OGE0Y2Q3ZTYwMDllZjYxZDIzXG5cbnZhciBpc1Byb3BWYWxpZCA9IC8qICNfX1BVUkVfXyAqL21lbW9pemUoZnVuY3Rpb24gKHByb3ApIHtcbiAgcmV0dXJuIHJlYWN0UHJvcHNSZWdleC50ZXN0KHByb3ApIHx8IHByb3AuY2hhckNvZGVBdCgwKSA9PT0gMTExXG4gIC8qIG8gKi9cbiAgJiYgcHJvcC5jaGFyQ29kZUF0KDEpID09PSAxMTBcbiAgLyogbiAqL1xuICAmJiBwcm9wLmNoYXJDb2RlQXQoMikgPCA5MTtcbn1cbi8qIForMSAqL1xuKTtcblxuZXhwb3J0IGRlZmF1bHQgaXNQcm9wVmFsaWQ7XG4iLCJpbXBvcnQgX2V4dGVuZHMgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcyc7XG5pbXBvcnQgeyB1c2VDb250ZXh0LCBjcmVhdGVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGlzUHJvcFZhbGlkIGZyb20gJ0BlbW90aW9uL2lzLXByb3AtdmFsaWQnO1xuaW1wb3J0IHsgd2l0aEVtb3Rpb25DYWNoZSwgVGhlbWVDb250ZXh0IH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZFN0eWxlcywgaW5zZXJ0U3R5bGVzIH0gZnJvbSAnQGVtb3Rpb24vdXRpbHMnO1xuaW1wb3J0IHsgc2VyaWFsaXplU3R5bGVzIH0gZnJvbSAnQGVtb3Rpb24vc2VyaWFsaXplJztcblxudmFyIHRlc3RPbWl0UHJvcHNPblN0cmluZ1RhZyA9IGlzUHJvcFZhbGlkO1xuXG52YXIgdGVzdE9taXRQcm9wc09uQ29tcG9uZW50ID0gZnVuY3Rpb24gdGVzdE9taXRQcm9wc09uQ29tcG9uZW50KGtleSkge1xuICByZXR1cm4ga2V5ICE9PSAndGhlbWUnO1xufTtcblxudmFyIGdldERlZmF1bHRTaG91bGRGb3J3YXJkUHJvcCA9IGZ1bmN0aW9uIGdldERlZmF1bHRTaG91bGRGb3J3YXJkUHJvcCh0YWcpIHtcbiAgcmV0dXJuIHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnICYmIC8vIDk2IGlzIG9uZSBsZXNzIHRoYW4gdGhlIGNoYXIgY29kZVxuICAvLyBmb3IgXCJhXCIgc28gdGhpcyBpcyBjaGVja2luZyB0aGF0XG4gIC8vIGl0J3MgYSBsb3dlcmNhc2UgY2hhcmFjdGVyXG4gIHRhZy5jaGFyQ29kZUF0KDApID4gOTYgPyB0ZXN0T21pdFByb3BzT25TdHJpbmdUYWcgOiB0ZXN0T21pdFByb3BzT25Db21wb25lbnQ7XG59O1xudmFyIGNvbXBvc2VTaG91bGRGb3J3YXJkUHJvcHMgPSBmdW5jdGlvbiBjb21wb3NlU2hvdWxkRm9yd2FyZFByb3BzKHRhZywgb3B0aW9ucywgaXNSZWFsKSB7XG4gIHZhciBzaG91bGRGb3J3YXJkUHJvcDtcblxuICBpZiAob3B0aW9ucykge1xuICAgIHZhciBvcHRpb25zU2hvdWxkRm9yd2FyZFByb3AgPSBvcHRpb25zLnNob3VsZEZvcndhcmRQcm9wO1xuICAgIHNob3VsZEZvcndhcmRQcm9wID0gdGFnLl9fZW1vdGlvbl9mb3J3YXJkUHJvcCAmJiBvcHRpb25zU2hvdWxkRm9yd2FyZFByb3AgPyBmdW5jdGlvbiAocHJvcE5hbWUpIHtcbiAgICAgIHJldHVybiB0YWcuX19lbW90aW9uX2ZvcndhcmRQcm9wKHByb3BOYW1lKSAmJiBvcHRpb25zU2hvdWxkRm9yd2FyZFByb3AocHJvcE5hbWUpO1xuICAgIH0gOiBvcHRpb25zU2hvdWxkRm9yd2FyZFByb3A7XG4gIH1cblxuICBpZiAodHlwZW9mIHNob3VsZEZvcndhcmRQcm9wICE9PSAnZnVuY3Rpb24nICYmIGlzUmVhbCkge1xuICAgIHNob3VsZEZvcndhcmRQcm9wID0gdGFnLl9fZW1vdGlvbl9mb3J3YXJkUHJvcDtcbiAgfVxuXG4gIHJldHVybiBzaG91bGRGb3J3YXJkUHJvcDtcbn07XG5cbnZhciBJTExFR0FMX0VTQ0FQRV9TRVFVRU5DRV9FUlJPUiA9IFwiWW91IGhhdmUgaWxsZWdhbCBlc2NhcGUgc2VxdWVuY2UgaW4geW91ciB0ZW1wbGF0ZSBsaXRlcmFsLCBtb3N0IGxpa2VseSBpbnNpZGUgY29udGVudCdzIHByb3BlcnR5IHZhbHVlLlxcbkJlY2F1c2UgeW91IHdyaXRlIHlvdXIgQ1NTIGluc2lkZSBhIEphdmFTY3JpcHQgc3RyaW5nIHlvdSBhY3R1YWxseSBoYXZlIHRvIGRvIGRvdWJsZSBlc2NhcGluZywgc28gZm9yIGV4YW1wbGUgXFxcImNvbnRlbnQ6ICdcXFxcMDBkNyc7XFxcIiBzaG91bGQgYmVjb21lIFxcXCJjb250ZW50OiAnXFxcXFxcXFwwMGQ3JztcXFwiLlxcbllvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoaXMgaGVyZTpcXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9UZW1wbGF0ZV9saXRlcmFscyNFUzIwMThfcmV2aXNpb25fb2ZfaWxsZWdhbF9lc2NhcGVfc2VxdWVuY2VzXCI7XG5cbnZhciBjcmVhdGVTdHlsZWQgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZWQodGFnLCBvcHRpb25zKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKHRhZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBhcmUgdHJ5aW5nIHRvIGNyZWF0ZSBhIHN0eWxlZCBlbGVtZW50IHdpdGggYW4gdW5kZWZpbmVkIGNvbXBvbmVudC5cXG5Zb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIGltcG9ydCBpdC4nKTtcbiAgICB9XG4gIH1cblxuICB2YXIgaXNSZWFsID0gdGFnLl9fZW1vdGlvbl9yZWFsID09PSB0YWc7XG4gIHZhciBiYXNlVGFnID0gaXNSZWFsICYmIHRhZy5fX2Vtb3Rpb25fYmFzZSB8fCB0YWc7XG4gIHZhciBpZGVudGlmaWVyTmFtZTtcbiAgdmFyIHRhcmdldENsYXNzTmFtZTtcblxuICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWRlbnRpZmllck5hbWUgPSBvcHRpb25zLmxhYmVsO1xuICAgIHRhcmdldENsYXNzTmFtZSA9IG9wdGlvbnMudGFyZ2V0O1xuICB9XG5cbiAgdmFyIHNob3VsZEZvcndhcmRQcm9wID0gY29tcG9zZVNob3VsZEZvcndhcmRQcm9wcyh0YWcsIG9wdGlvbnMsIGlzUmVhbCk7XG4gIHZhciBkZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AgPSBzaG91bGRGb3J3YXJkUHJvcCB8fCBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AoYmFzZVRhZyk7XG4gIHZhciBzaG91bGRVc2VBcyA9ICFkZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AoJ2FzJyk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0eWxlcyA9IGlzUmVhbCAmJiB0YWcuX19lbW90aW9uX3N0eWxlcyAhPT0gdW5kZWZpbmVkID8gdGFnLl9fZW1vdGlvbl9zdHlsZXMuc2xpY2UoMCkgOiBbXTtcblxuICAgIGlmIChpZGVudGlmaWVyTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZXMucHVzaChcImxhYmVsOlwiICsgaWRlbnRpZmllck5hbWUgKyBcIjtcIik7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3NbMF0gPT0gbnVsbCB8fCBhcmdzWzBdLnJhdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZXMucHVzaC5hcHBseShzdHlsZXMsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBhcmdzWzBdWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihJTExFR0FMX0VTQ0FQRV9TRVFVRU5DRV9FUlJPUik7XG4gICAgICB9XG5cbiAgICAgIHN0eWxlcy5wdXNoKGFyZ3NbMF1bMF0pO1xuICAgICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGkgPSAxO1xuXG4gICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGFyZ3NbMF1baV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSUxMRUdBTF9FU0NBUEVfU0VRVUVOQ0VfRVJST1IpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3R5bGVzLnB1c2goYXJnc1tpXSwgYXJnc1swXVtpXSk7XG4gICAgICB9XG4gICAgfSAvLyAkRmxvd0ZpeE1lOiB3ZSBuZWVkIHRvIGNhc3QgU3RhdGVsZXNzRnVuY3Rpb25hbENvbXBvbmVudCB0byBvdXIgUHJpdmF0ZVN0eWxlZENvbXBvbmVudCBjbGFzc1xuXG5cbiAgICB2YXIgU3R5bGVkID0gd2l0aEVtb3Rpb25DYWNoZShmdW5jdGlvbiAocHJvcHMsIGNhY2hlLCByZWYpIHtcbiAgICAgIHZhciBmaW5hbFRhZyA9IHNob3VsZFVzZUFzICYmIHByb3BzLmFzIHx8IGJhc2VUYWc7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gJyc7XG4gICAgICB2YXIgY2xhc3NJbnRlcnBvbGF0aW9ucyA9IFtdO1xuICAgICAgdmFyIG1lcmdlZFByb3BzID0gcHJvcHM7XG5cbiAgICAgIGlmIChwcm9wcy50aGVtZSA9PSBudWxsKSB7XG4gICAgICAgIG1lcmdlZFByb3BzID0ge307XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICAgICAgbWVyZ2VkUHJvcHNba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBtZXJnZWRQcm9wcy50aGVtZSA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBwcm9wcy5jbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGdldFJlZ2lzdGVyZWRTdHlsZXMoY2FjaGUucmVnaXN0ZXJlZCwgY2xhc3NJbnRlcnBvbGF0aW9ucywgcHJvcHMuY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcHMuY2xhc3NOYW1lICE9IG51bGwpIHtcbiAgICAgICAgY2xhc3NOYW1lID0gcHJvcHMuY2xhc3NOYW1lICsgXCIgXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXJpYWxpemVkID0gc2VyaWFsaXplU3R5bGVzKHN0eWxlcy5jb25jYXQoY2xhc3NJbnRlcnBvbGF0aW9ucyksIGNhY2hlLnJlZ2lzdGVyZWQsIG1lcmdlZFByb3BzKTtcbiAgICAgIHZhciBydWxlcyA9IGluc2VydFN0eWxlcyhjYWNoZSwgc2VyaWFsaXplZCwgdHlwZW9mIGZpbmFsVGFnID09PSAnc3RyaW5nJyk7XG4gICAgICBjbGFzc05hbWUgKz0gY2FjaGUua2V5ICsgXCItXCIgKyBzZXJpYWxpemVkLm5hbWU7XG5cbiAgICAgIGlmICh0YXJnZXRDbGFzc05hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbGFzc05hbWUgKz0gXCIgXCIgKyB0YXJnZXRDbGFzc05hbWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaW5hbFNob3VsZEZvcndhcmRQcm9wID0gc2hvdWxkVXNlQXMgJiYgc2hvdWxkRm9yd2FyZFByb3AgPT09IHVuZGVmaW5lZCA/IGdldERlZmF1bHRTaG91bGRGb3J3YXJkUHJvcChmaW5hbFRhZykgOiBkZWZhdWx0U2hvdWxkRm9yd2FyZFByb3A7XG4gICAgICB2YXIgbmV3UHJvcHMgPSB7fTtcblxuICAgICAgZm9yICh2YXIgX2tleSBpbiBwcm9wcykge1xuICAgICAgICBpZiAoc2hvdWxkVXNlQXMgJiYgX2tleSA9PT0gJ2FzJykgY29udGludWU7XG5cbiAgICAgICAgaWYgKCAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIGZpbmFsU2hvdWxkRm9yd2FyZFByb3AoX2tleSkpIHtcbiAgICAgICAgICBuZXdQcm9wc1tfa2V5XSA9IHByb3BzW19rZXldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5ld1Byb3BzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICAgIG5ld1Byb3BzLnJlZiA9IHJlZjtcbiAgICAgIHZhciBlbGUgPSAvKiNfX1BVUkVfXyovY3JlYXRlRWxlbWVudChmaW5hbFRhZywgbmV3UHJvcHMpO1xuXG4gICAgICByZXR1cm4gZWxlO1xuICAgIH0pO1xuICAgIFN0eWxlZC5kaXNwbGF5TmFtZSA9IGlkZW50aWZpZXJOYW1lICE9PSB1bmRlZmluZWQgPyBpZGVudGlmaWVyTmFtZSA6IFwiU3R5bGVkKFwiICsgKHR5cGVvZiBiYXNlVGFnID09PSAnc3RyaW5nJyA/IGJhc2VUYWcgOiBiYXNlVGFnLmRpc3BsYXlOYW1lIHx8IGJhc2VUYWcubmFtZSB8fCAnQ29tcG9uZW50JykgKyBcIilcIjtcbiAgICBTdHlsZWQuZGVmYXVsdFByb3BzID0gdGFnLmRlZmF1bHRQcm9wcztcbiAgICBTdHlsZWQuX19lbW90aW9uX3JlYWwgPSBTdHlsZWQ7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9iYXNlID0gYmFzZVRhZztcbiAgICBTdHlsZWQuX19lbW90aW9uX3N0eWxlcyA9IHN0eWxlcztcbiAgICBTdHlsZWQuX19lbW90aW9uX2ZvcndhcmRQcm9wID0gc2hvdWxkRm9yd2FyZFByb3A7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0eWxlZCwgJ3RvU3RyaW5nJywge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICBpZiAodGFyZ2V0Q2xhc3NOYW1lID09PSB1bmRlZmluZWQgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIHJldHVybiAnTk9fQ09NUE9ORU5UX1NFTEVDVE9SJztcbiAgICAgICAgfSAvLyAkRmxvd0ZpeE1lOiBjb2VyY2UgdW5kZWZpbmVkIHRvIHN0cmluZ1xuXG5cbiAgICAgICAgcmV0dXJuIFwiLlwiICsgdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgU3R5bGVkLndpdGhDb21wb25lbnQgPSBmdW5jdGlvbiAobmV4dFRhZywgbmV4dE9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBjcmVhdGVTdHlsZWQobmV4dFRhZywgX2V4dGVuZHMoe30sIG9wdGlvbnMsIG5leHRPcHRpb25zLCB7XG4gICAgICAgIHNob3VsZEZvcndhcmRQcm9wOiBjb21wb3NlU2hvdWxkRm9yd2FyZFByb3BzKFN0eWxlZCwgbmV4dE9wdGlvbnMsIHRydWUpXG4gICAgICB9KSkuYXBwbHkodm9pZCAwLCBzdHlsZXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gU3R5bGVkO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU3R5bGVkO1xuIiwiaW1wb3J0ICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2V4dGVuZHMnO1xuaW1wb3J0ICdyZWFjdCc7XG5pbXBvcnQgJ0BlbW90aW9uL2lzLXByb3AtdmFsaWQnO1xuaW1wb3J0IGNyZWF0ZVN0eWxlZCBmcm9tICcuLi9iYXNlL2Rpc3QvZW1vdGlvbi1zdHlsZWQtYmFzZS5icm93c2VyLmVzbS5qcyc7XG5pbXBvcnQgJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCAnQGVtb3Rpb24vdXRpbHMnO1xuaW1wb3J0ICdAZW1vdGlvbi9zZXJpYWxpemUnO1xuXG52YXIgdGFncyA9IFsnYScsICdhYmJyJywgJ2FkZHJlc3MnLCAnYXJlYScsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2F1ZGlvJywgJ2InLCAnYmFzZScsICdiZGknLCAnYmRvJywgJ2JpZycsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnYnInLCAnYnV0dG9uJywgJ2NhbnZhcycsICdjYXB0aW9uJywgJ2NpdGUnLCAnY29kZScsICdjb2wnLCAnY29sZ3JvdXAnLCAnZGF0YScsICdkYXRhbGlzdCcsICdkZCcsICdkZWwnLCAnZGV0YWlscycsICdkZm4nLCAnZGlhbG9nJywgJ2RpdicsICdkbCcsICdkdCcsICdlbScsICdlbWJlZCcsICdmaWVsZHNldCcsICdmaWdjYXB0aW9uJywgJ2ZpZ3VyZScsICdmb290ZXInLCAnZm9ybScsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkJywgJ2hlYWRlcicsICdoZ3JvdXAnLCAnaHInLCAnaHRtbCcsICdpJywgJ2lmcmFtZScsICdpbWcnLCAnaW5wdXQnLCAnaW5zJywgJ2tiZCcsICdrZXlnZW4nLCAnbGFiZWwnLCAnbGVnZW5kJywgJ2xpJywgJ2xpbmsnLCAnbWFpbicsICdtYXAnLCAnbWFyaycsICdtYXJxdWVlJywgJ21lbnUnLCAnbWVudWl0ZW0nLCAnbWV0YScsICdtZXRlcicsICduYXYnLCAnbm9zY3JpcHQnLCAnb2JqZWN0JywgJ29sJywgJ29wdGdyb3VwJywgJ29wdGlvbicsICdvdXRwdXQnLCAncCcsICdwYXJhbScsICdwaWN0dXJlJywgJ3ByZScsICdwcm9ncmVzcycsICdxJywgJ3JwJywgJ3J0JywgJ3J1YnknLCAncycsICdzYW1wJywgJ3NjcmlwdCcsICdzZWN0aW9uJywgJ3NlbGVjdCcsICdzbWFsbCcsICdzb3VyY2UnLCAnc3BhbicsICdzdHJvbmcnLCAnc3R5bGUnLCAnc3ViJywgJ3N1bW1hcnknLCAnc3VwJywgJ3RhYmxlJywgJ3Rib2R5JywgJ3RkJywgJ3RleHRhcmVhJywgJ3Rmb290JywgJ3RoJywgJ3RoZWFkJywgJ3RpbWUnLCAndGl0bGUnLCAndHInLCAndHJhY2snLCAndScsICd1bCcsICd2YXInLCAndmlkZW8nLCAnd2JyJywgLy8gU1ZHXG4nY2lyY2xlJywgJ2NsaXBQYXRoJywgJ2RlZnMnLCAnZWxsaXBzZScsICdmb3JlaWduT2JqZWN0JywgJ2cnLCAnaW1hZ2UnLCAnbGluZScsICdsaW5lYXJHcmFkaWVudCcsICdtYXNrJywgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLCAnc3RvcCcsICdzdmcnLCAndGV4dCcsICd0c3BhbiddO1xuXG52YXIgbmV3U3R5bGVkID0gY3JlYXRlU3R5bGVkLmJpbmQoKTtcbnRhZ3MuZm9yRWFjaChmdW5jdGlvbiAodGFnTmFtZSkge1xuICAvLyAkRmxvd0ZpeE1lOiB3ZSBjYW4gaWdub3JlIHRoaXMgYmVjYXVzZSBpdHMgZXhwb3NlZCB0eXBlIGlzIGRlZmluZWQgYnkgdGhlIENyZWF0ZVN0eWxlZCB0eXBlXG4gIG5ld1N0eWxlZFt0YWdOYW1lXSA9IG5ld1N0eWxlZCh0YWdOYW1lKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBuZXdTdHlsZWQ7XG4iLCJpbXBvcnQgeyBwcm9wTmFtZXMgfSBmcm9tIFwiQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtXCI7XG4vKipcbiAqIExpc3Qgb2YgcHJvcHMgZm9yIGVtb3Rpb24gdG8gb21pdCBmcm9tIERPTS5cbiAqIEl0IG1vc3RseSBjb25zaXN0cyBvZiBDaGFrcmEgcHJvcHNcbiAqL1xuXG52YXIgYWxsUHJvcE5hbWVzID0gbmV3IFNldChbLi4ucHJvcE5hbWVzLCBcInRleHRTdHlsZVwiLCBcImxheWVyU3R5bGVcIiwgXCJhcHBseVwiLCBcImlzVHJ1bmNhdGVkXCIsIFwibm9PZkxpbmVzXCIsIFwiZm9jdXNCb3JkZXJDb2xvclwiLCBcImVycm9yQm9yZGVyQ29sb3JcIiwgXCJhc1wiLCBcIl9fY3NzXCIsIFwiY3NzXCIsIFwic3hcIl0pO1xuLyoqXG4gKiBodG1sV2lkdGggYW5kIGh0bWxIZWlnaHQgaXMgdXNlZCBpbiB0aGUgPEltYWdlIC8+XG4gKiBjb21wb25lbnQgdG8gc3VwcG9ydCB0aGUgbmF0aXZlIGB3aWR0aGAgYW5kIGBoZWlnaHRgIGF0dHJpYnV0ZXNcbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hha3JhLXVpL2NoYWtyYS11aS9pc3N1ZXMvMTQ5XG4gKi9cblxudmFyIHZhbGlkSFRNTFByb3BzID0gbmV3IFNldChbXCJodG1sV2lkdGhcIiwgXCJodG1sSGVpZ2h0XCIsIFwiaHRtbFNpemVcIl0pO1xuZXhwb3J0IHZhciBzaG91bGRGb3J3YXJkUHJvcCA9IHByb3AgPT4gdmFsaWRIVE1MUHJvcHMuaGFzKHByb3ApIHx8ICFhbGxQcm9wTmFtZXMuaGFzKHByb3ApO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hvdWxkLWZvcndhcmQtcHJvcC5qcy5tYXAiLCJmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IGNzcywgaXNTdHlsZVByb3AgfSBmcm9tIFwiQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtXCI7XG5pbXBvcnQgeyBvYmplY3RGaWx0ZXIgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuaW1wb3J0IF9zdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgc2hvdWxkRm9yd2FyZFByb3AgfSBmcm9tIFwiLi9zaG91bGQtZm9yd2FyZC1wcm9wXCI7XG5pbXBvcnQgeyBkb21FbGVtZW50cyB9IGZyb20gXCIuL3N5c3RlbS51dGlsc1wiO1xuXG4vKipcbiAqIFN0eWxlIHJlc29sdmVyIGZ1bmN0aW9uIHRoYXQgbWFuYWdlcyBob3cgc3R5bGUgcHJvcHMgYXJlIG1lcmdlZFxuICogaW4gY29tYmluYXRpb24gd2l0aCBvdGhlciBwb3NzaWJsZSB3YXlzIG9mIGRlZmluaW5nIHN0eWxlcy5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGFrZSBhIGNvbXBvbmVudCBkZWZpbmVkIHRoaXMgd2F5OlxuICogYGBganN4XG4gKiA8Qm94IGZvbnRTaXplPVwiMjRweFwiIHN4PXt7IGZvbnRTaXplOiBcIjQwcHhcIiB9fT48L0JveD5cbiAqIGBgYFxuICpcbiAqIFdlIHdhbnQgdG8gbWFuYWdlIHRoZSBwcmlvcml0eSBvZiB0aGUgc3R5bGVzIHByb3Blcmx5IHRvIHByZXZlbnQgdW53YW50ZWRcbiAqIGJlaGF2aW9ycy4gUmlnaHQgbm93LCB0aGUgYHN4YCBwcm9wIGhhcyB0aGUgaGlnaGVzdCBwcmlvcml0eSBzbyB0aGUgcmVzb2x2ZWRcbiAqIGZvbnRTaXplIHdpbGwgYmUgYDQwcHhgXG4gKi9cbmV4cG9ydCB2YXIgdG9DU1NPYmplY3QgPSAoX3JlZikgPT4ge1xuICB2YXIge1xuICAgIGJhc2VTdHlsZVxuICB9ID0gX3JlZjtcbiAgcmV0dXJuIHByb3BzID0+IHtcbiAgICB2YXIge1xuICAgICAgY3NzOiBjc3NQcm9wLFxuICAgICAgX19jc3MsXG4gICAgICBzeFxuICAgIH0gPSBwcm9wcyxcbiAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHByb3BzLCBbXCJ0aGVtZVwiLCBcImNzc1wiLCBcIl9fY3NzXCIsIFwic3hcIl0pO1xuXG4gICAgdmFyIHN0eWxlUHJvcHMgPSBvYmplY3RGaWx0ZXIocmVzdCwgKF8sIHByb3ApID0+IGlzU3R5bGVQcm9wKHByb3ApKTtcbiAgICB2YXIgZmluYWxTdHlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCBfX2NzcywgYmFzZVN0eWxlLCBzdHlsZVByb3BzLCBzeCk7XG4gICAgdmFyIGNvbXB1dGVkQ1NTID0gY3NzKGZpbmFsU3R5bGVzKShwcm9wcy50aGVtZSk7XG4gICAgcmV0dXJuIGNzc1Byb3AgPyBbY29tcHV0ZWRDU1MsIGNzc1Byb3BdIDogY29tcHV0ZWRDU1M7XG4gIH07XG59O1xuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlZChjb21wb25lbnQsIG9wdGlvbnMpIHtcbiAgdmFyIF9yZWYyID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9LFxuICAgICAge1xuICAgIGJhc2VTdHlsZVxuICB9ID0gX3JlZjIsXG4gICAgICBzdHlsZWRPcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjIsIFtcImJhc2VTdHlsZVwiXSk7XG5cbiAgaWYgKCFzdHlsZWRPcHRpb25zLnNob3VsZEZvcndhcmRQcm9wKSB7XG4gICAgc3R5bGVkT3B0aW9ucy5zaG91bGRGb3J3YXJkUHJvcCA9IHNob3VsZEZvcndhcmRQcm9wO1xuICB9XG5cbiAgdmFyIHN0eWxlT2JqZWN0ID0gdG9DU1NPYmplY3Qoe1xuICAgIGJhc2VTdHlsZVxuICB9KTtcbiAgcmV0dXJuIF9zdHlsZWQoY29tcG9uZW50LCBzdHlsZWRPcHRpb25zKShzdHlsZU9iamVjdCk7XG59XG5leHBvcnQgdmFyIGNoYWtyYSA9IHN0eWxlZDtcbmRvbUVsZW1lbnRzLmZvckVhY2godGFnID0+IHtcbiAgY2hha3JhW3RhZ10gPSBjaGFrcmEodGFnKTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtLmpzLm1hcCIsIi8qKlxuICogQWxsIGNyZWRpdCBnb2VzIHRvIENoYW5jZSAoUmVhY2ggVUkpLCBIYXogKFJlYWtpdCkgYW5kIChmbHVlbnR1aSlcbiAqIGZvciBjcmVhdGluZyB0aGUgYmFzZSB0eXBlIGRlZmluaXRpb25zIHVwb24gd2hpY2ggd2UgaW1wcm92ZWQgb25cbiAqL1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZFJlZihjb21wb25lbnQpIHtcbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9SZWFjdC5mb3J3YXJkUmVmKGNvbXBvbmVudCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3J3YXJkLXJlZi5qcy5tYXAiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IGNoYWtyYSwgZm9yd2FyZFJlZiB9IGZyb20gXCJAY2hha3JhLXVpL3N5c3RlbVwiO1xuaW1wb3J0IHsgY3gsIF9fREVWX18gfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG52YXIgZmFsbGJhY2tJY29uID0ge1xuICBwYXRoOiAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChcImdcIiwge1xuICAgIHN0cm9rZTogXCJjdXJyZW50Q29sb3JcIixcbiAgICBzdHJva2VXaWR0aDogXCIxLjVcIlxuICB9LCAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChcInBhdGhcIiwge1xuICAgIHN0cm9rZUxpbmVjYXA6IFwicm91bmRcIixcbiAgICBmaWxsOiBcIm5vbmVcIixcbiAgICBkOiBcIk05LDlhMywzLDAsMSwxLDQsMi44MjksMS41LDEuNSwwLDAsMC0xLDEuNDE1VjE0LjI1XCJcbiAgfSksIC8qI19fUFVSRV9fKi9SZWFjdC5jcmVhdGVFbGVtZW50KFwicGF0aFwiLCB7XG4gICAgZmlsbDogXCJjdXJyZW50Q29sb3JcIixcbiAgICBzdHJva2VMaW5lY2FwOiBcInJvdW5kXCIsXG4gICAgZDogXCJNMTIsMTcuMjVhLjM3NS4zNzUsMCwxLDAsLjM3NS4zNzVBLjM3NS4zNzUsMCwwLDAsMTIsMTcuMjVoMFwiXG4gIH0pLCAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChcImNpcmNsZVwiLCB7XG4gICAgZmlsbDogXCJub25lXCIsXG4gICAgc3Ryb2tlTWl0ZXJsaW1pdDogXCIxMFwiLFxuICAgIGN4OiBcIjEyXCIsXG4gICAgY3k6IFwiMTJcIixcbiAgICByOiBcIjExLjI1XCJcbiAgfSkpLFxuICB2aWV3Qm94OiBcIjAgMCAyNCAyNFwiXG59O1xuZXhwb3J0IHZhciBJY29uID0gLyojX19QVVJFX18qL2ZvcndhcmRSZWYoKHByb3BzLCByZWYpID0+IHtcbiAgdmFyIHtcbiAgICBhczogZWxlbWVudCxcbiAgICB2aWV3Qm94LFxuICAgIGNvbG9yID0gXCJjdXJyZW50Q29sb3JcIixcbiAgICBmb2N1c2FibGUgPSBmYWxzZSxcbiAgICBjaGlsZHJlbixcbiAgICBjbGFzc05hbWUsXG4gICAgX19jc3NcbiAgfSA9IHByb3BzLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHByb3BzLCBbXCJhc1wiLCBcInZpZXdCb3hcIiwgXCJjb2xvclwiLCBcImZvY3VzYWJsZVwiLCBcImNoaWxkcmVuXCIsIFwiY2xhc3NOYW1lXCIsIFwiX19jc3NcIl0pO1xuXG4gIHZhciBfY2xhc3NOYW1lID0gY3goXCJjaGFrcmEtaWNvblwiLCBjbGFzc05hbWUpO1xuXG4gIHZhciBzdHlsZXMgPSBfZXh0ZW5kcyh7XG4gICAgdzogXCIxZW1cIixcbiAgICBoOiBcIjFlbVwiLFxuICAgIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsXG4gICAgbGluZUhlaWdodDogXCIxZW1cIixcbiAgICBmbGV4U2hyaW5rOiAwLFxuICAgIGNvbG9yXG4gIH0sIF9fY3NzKTtcblxuICB2YXIgc2hhcmVkID0ge1xuICAgIHJlZixcbiAgICBmb2N1c2FibGUsXG4gICAgY2xhc3NOYW1lOiBfY2xhc3NOYW1lLFxuICAgIF9fY3NzOiBzdHlsZXNcbiAgfTtcblxuICB2YXIgX3ZpZXdCb3ggPSB2aWV3Qm94ICE9IG51bGwgPyB2aWV3Qm94IDogZmFsbGJhY2tJY29uLnZpZXdCb3g7XG4gIC8qKlxuICAgKiBJZiB5b3UncmUgdXNpbmcgYW4gaWNvbiBsaWJyYXJ5IGxpa2UgYHJlYWN0LWljb25zYC5cbiAgICogTm90ZTogYW55b25lIHBhc3NpbmcgdGhlIGBhc2AgcHJvcCwgc2hvdWxkIG1hbmFnZSB0aGUgYHZpZXdCb3hgIGZyb20gdGhlIGV4dGVybmFsIGNvbXBvbmVudFxuICAgKi9cblxuXG4gIGlmIChlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIC8qI19fUFVSRV9fKi9SZWFjdC5jcmVhdGVFbGVtZW50KGNoYWtyYS5zdmcsIF9leHRlbmRzKHtcbiAgICAgIGFzOiBlbGVtZW50XG4gICAgfSwgc2hhcmVkLCByZXN0KSk7XG4gIH1cblxuICB2YXIgX3BhdGggPSBjaGlsZHJlbiAhPSBudWxsID8gY2hpbGRyZW4gOiBmYWxsYmFja0ljb24ucGF0aDtcblxuICByZXR1cm4gLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoY2hha3JhLnN2ZywgX2V4dGVuZHMoe1xuICAgIHZlcnRpY2FsQWxpZ246IFwibWlkZGxlXCIsXG4gICAgdmlld0JveDogX3ZpZXdCb3hcbiAgfSwgc2hhcmVkLCByZXN0KSwgX3BhdGgpO1xufSk7XG5cbmlmIChfX0RFVl9fKSB7XG4gIEljb24uZGlzcGxheU5hbWUgPSBcIkljb25cIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSWNvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWljb24uanMubWFwIl0sIm5hbWVzIjpbImdsb2JhbCIsInB4VHJhbnNmb3JtIiwiZ2V0IiwiX2V4dGVuZHMiLCJtZXJnZVdpdGgiLCJtZXJnZSIsInN5c3RlbVByb3BDb25maWdzIiwidCIsIm1lbW9pemUiLCJ0b2tlbiIsInBlZWsiLCJpZGVudGlmaWVyIiwicG9zaXRpb24iLCJkZWxpbWl0IiwiZnJvbSIsIm5leHQiLCJkZWFsbG9jIiwiYWxsb2MiLCJwcmVmaXhlciIsInN0cmluZ2lmeSIsInJ1bGVzaGVldCIsIm1pZGRsZXdhcmUiLCJzZXJpYWxpemUiLCJjb21waWxlIiwiaXNCcm93c2VyIiwidW5pdGxlc3MiLCJoYXNoU3RyaW5nIiwiY3JlYXRlQ29udGV4dCIsImZvcndhcmRSZWYiLCJ1c2VDb250ZXh0IiwiY3JlYXRlRWxlbWVudCIsIl9zdHlsZWQiLCJSZWFjdC5mb3J3YXJkUmVmIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJSZWFjdC5jcmVhdGVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDTyxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDaEMsRUFBRSxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUNuQyxDQUFDO0FBQ00sU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ25DLEVBQUUsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUlEO0FBQ08sU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQy9CLEVBQUUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFJRDtBQUNPLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUNsQyxFQUFFLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBQ3JDLENBQUM7QUFRRDtBQUNPLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUNoQyxFQUFFLElBQUksSUFBSSxHQUFHLE9BQU8sS0FBSyxDQUFDO0FBQzFCLEVBQUUsT0FBTyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFDTSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7QUFDckMsRUFBRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUlNLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUM5QixFQUFFLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQztBQUN2QixDQUFDO0FBQ0Q7QUFDTyxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDaEMsRUFBRSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztBQUNyRSxDQUFDO0FBQ00sU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ2hDLEVBQUUsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFRTSxJQUFJLE9BQU8sR0FBRyxZQUFvQixLQUFLLFlBQVksQ0FBQztBQUVwRCxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDakMsRUFBRSxPQUFPLFNBQVMsSUFBSSxHQUFHLENBQUM7QUFDMUI7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0FBQzNCO0FBQ0E7QUFDQSxJQUFJLGNBQWMsR0FBRywyQkFBMkIsQ0FBQztBQUNqRDtBQUNBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsR0FBRztBQUNuQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEI7QUFDQTtBQUNBLElBQUksZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUFDeEM7QUFDQTtBQUNBLElBQUksT0FBTyxHQUFHLG9CQUFvQjtBQUNsQyxJQUFJLFFBQVEsR0FBRyxnQkFBZ0I7QUFDL0IsSUFBSSxRQUFRLEdBQUcsd0JBQXdCO0FBQ3ZDLElBQUksT0FBTyxHQUFHLGtCQUFrQjtBQUNoQyxJQUFJLE9BQU8sR0FBRyxlQUFlO0FBQzdCLElBQUksUUFBUSxHQUFHLGdCQUFnQjtBQUMvQixJQUFJLE9BQU8sR0FBRyxtQkFBbUI7QUFDakMsSUFBSSxNQUFNLEdBQUcsNEJBQTRCO0FBQ3pDLElBQUksTUFBTSxHQUFHLGNBQWM7QUFDM0IsSUFBSSxTQUFTLEdBQUcsaUJBQWlCO0FBQ2pDLElBQUksT0FBTyxHQUFHLGVBQWU7QUFDN0IsSUFBSSxTQUFTLEdBQUcsaUJBQWlCO0FBQ2pDLElBQUksUUFBUSxHQUFHLGdCQUFnQjtBQUMvQixJQUFJLFNBQVMsR0FBRyxpQkFBaUI7QUFDakMsSUFBSSxNQUFNLEdBQUcsY0FBYztBQUMzQixJQUFJLFNBQVMsR0FBRyxpQkFBaUI7QUFDakMsSUFBSSxZQUFZLEdBQUcsb0JBQW9CO0FBQ3ZDLElBQUksVUFBVSxHQUFHLGtCQUFrQixDQUFDO0FBQ3BDO0FBQ0EsSUFBSSxjQUFjLEdBQUcsc0JBQXNCO0FBQzNDLElBQUksV0FBVyxHQUFHLG1CQUFtQjtBQUNyQyxJQUFJLFVBQVUsR0FBRyx1QkFBdUI7QUFDeEMsSUFBSSxVQUFVLEdBQUcsdUJBQXVCO0FBQ3hDLElBQUksT0FBTyxHQUFHLG9CQUFvQjtBQUNsQyxJQUFJLFFBQVEsR0FBRyxxQkFBcUI7QUFDcEMsSUFBSSxRQUFRLEdBQUcscUJBQXFCO0FBQ3BDLElBQUksUUFBUSxHQUFHLHFCQUFxQjtBQUNwQyxJQUFJLGVBQWUsR0FBRyw0QkFBNEI7QUFDbEQsSUFBSSxTQUFTLEdBQUcsc0JBQXNCO0FBQ3RDLElBQUksU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFlBQVksR0FBRyxxQkFBcUIsQ0FBQztBQUN6QztBQUNBO0FBQ0EsSUFBSSxZQUFZLEdBQUcsNkJBQTZCLENBQUM7QUFDakQ7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLGtCQUFrQixDQUFDO0FBQ2xDO0FBQ0E7QUFDQSxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDeEIsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUM7QUFDdkQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUM7QUFDbEQsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUM7QUFDbkQsY0FBYyxDQUFDLGVBQWUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7QUFDM0QsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNqQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQztBQUNsRCxjQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQztBQUN4RCxjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQztBQUNyRCxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQztBQUNsRCxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztBQUNsRCxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztBQUNyRCxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztBQUNsRCxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ25DO0FBQ0E7QUFDQSxJQUFJLFVBQVUsR0FBRyxPQUFPQSxjQUFNLElBQUksUUFBUSxJQUFJQSxjQUFNLElBQUlBLGNBQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJQSxjQUFNLENBQUM7QUFDM0Y7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDO0FBQ2pGO0FBQ0E7QUFDQSxJQUFJLElBQUksR0FBRyxVQUFVLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0FBQy9EO0FBQ0E7QUFDQSxJQUFJLFdBQVcsSUFBaUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUM7QUFDeEY7QUFDQTtBQUNBLElBQUksVUFBVSxHQUFHLFdBQVcsSUFBSSxRQUFhLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO0FBQ2xHO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDckU7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHLGFBQWEsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDO0FBQ3REO0FBQ0E7QUFDQSxJQUFJLFFBQVEsSUFBSSxXQUFXO0FBQzNCLEVBQUUsSUFBSTtBQUNOO0FBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNyRjtBQUNBLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ25CLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxPQUFPLFdBQVcsSUFBSSxXQUFXLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0UsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDaEIsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNMO0FBQ0E7QUFDQSxJQUFJLGdCQUFnQixHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNwQyxFQUFFLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDckIsSUFBSSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9DLElBQUksS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsSUFBSSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsR0FBRztBQUNILEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QjtBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDdEIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLEdBQUc7QUFDSCxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ3pCLEVBQUUsT0FBTyxTQUFTLEtBQUssRUFBRTtBQUN6QixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQy9CLEVBQUUsT0FBTyxNQUFNLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDbEMsRUFBRSxPQUFPLFNBQVMsR0FBRyxFQUFFO0FBQ3ZCLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEMsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUztBQUNoQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUztBQUNsQyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25DO0FBQ0E7QUFDQSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1QztBQUNBO0FBQ0EsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUN0QztBQUNBO0FBQ0EsSUFBSSxjQUFjLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQztBQUNoRDtBQUNBO0FBQ0EsSUFBSSxVQUFVLElBQUksV0FBVztBQUM3QixFQUFFLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7QUFDM0YsRUFBRSxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO0FBQzdDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG9CQUFvQixHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7QUFDaEQ7QUFDQTtBQUNBLElBQUksZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRDtBQUNBO0FBQ0EsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUc7QUFDM0IsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO0FBQ2pFLEdBQUcsT0FBTyxDQUFDLHdEQUF3RCxFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUc7QUFDbkYsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLElBQUksTUFBTSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVM7QUFDcEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU07QUFDeEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVU7QUFDaEMsSUFBSSxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsU0FBUztBQUN6RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUM7QUFDekQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU07QUFDaEMsSUFBSSxvQkFBb0IsR0FBRyxXQUFXLENBQUMsb0JBQW9CO0FBQzNELElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNO0FBQzlCLElBQUksY0FBYyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM3RDtBQUNBLElBQUksY0FBYyxJQUFJLFdBQVc7QUFDakMsRUFBRSxJQUFJO0FBQ04sSUFBSSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDbkQsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNyQixJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ2hCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDTDtBQUNBO0FBQ0EsSUFBSSxjQUFjLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUztBQUN6RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRztBQUN4QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3pCO0FBQ0E7QUFDQSxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztBQUNoQyxJQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksVUFBVSxJQUFJLFdBQVc7QUFDN0IsRUFBRSxTQUFTLE1BQU0sR0FBRyxFQUFFO0FBQ3RCLEVBQUUsT0FBTyxTQUFTLEtBQUssRUFBRTtBQUN6QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDMUIsTUFBTSxPQUFPLEVBQUUsQ0FBQztBQUNoQixLQUFLO0FBQ0wsSUFBSSxJQUFJLFlBQVksRUFBRTtBQUN0QixNQUFNLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLEtBQUs7QUFDTCxJQUFJLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQzdCLElBQUksSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUM7QUFDNUIsSUFBSSxNQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNqQyxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUcsQ0FBQztBQUNKLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLE1BQU0sTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDcEQ7QUFDQSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUU7QUFDM0IsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsR0FBRztBQUNyQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekQsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN6QixFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFELEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUN0QixFQUFFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDM0IsRUFBRSxJQUFJLFlBQVksRUFBRTtBQUNwQixJQUFJLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixJQUFJLE9BQU8sTUFBTSxLQUFLLGNBQWMsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQzFELEdBQUc7QUFDSCxFQUFFLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUNoRSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDdEIsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzNCLEVBQUUsT0FBTyxZQUFZLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDN0IsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzNCLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQzdFLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7QUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO0FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFO0FBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLE1BQU0sTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDcEQ7QUFDQSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUU7QUFDM0IsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWMsR0FBRztBQUMxQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVE7QUFDMUIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QztBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ2pCLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNILEVBQUUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDbEMsRUFBRSxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDMUIsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixHQUFHLE1BQU07QUFDVCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxHQUFHO0FBQ0gsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDZCxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxZQUFZLENBQUMsR0FBRyxFQUFFO0FBQzNCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVE7QUFDMUIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QztBQUNBLEVBQUUsT0FBTyxLQUFLLEdBQUcsQ0FBQyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxZQUFZLENBQUMsR0FBRyxFQUFFO0FBQzNCLEVBQUUsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDbEMsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUTtBQUMxQixNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUIsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzNCLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUNEO0FBQ0E7QUFDQSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7QUFDM0MsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLENBQUM7QUFDaEQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDO0FBQ3ZDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQztBQUN2QyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUMzQixFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNoQixNQUFNLE1BQU0sR0FBRyxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3BEO0FBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFO0FBQzNCLElBQUksSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLEdBQUc7QUFDekIsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNoQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUc7QUFDbEIsSUFBSSxNQUFNLEVBQUUsSUFBSSxJQUFJO0FBQ3BCLElBQUksS0FBSyxFQUFFLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQztBQUNqQyxJQUFJLFFBQVEsRUFBRSxJQUFJLElBQUk7QUFDdEIsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjLENBQUMsR0FBRyxFQUFFO0FBQzdCLEVBQUUsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDMUIsRUFBRSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUMxQixFQUFFLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLEVBQUUsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7QUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QjtBQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkIsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRDtBQUNBO0FBQ0EsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0FBQ3pDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsY0FBYyxDQUFDO0FBQzlDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQztBQUNyQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUM7QUFDckMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDeEIsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLEdBQUc7QUFDdEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDO0FBQ2hDLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQzFCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVE7QUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DO0FBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDeEIsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDdkIsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUN2QixFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMzQixFQUFFLElBQUksSUFBSSxZQUFZLFNBQVMsRUFBRTtBQUNqQyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDOUIsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDdkQsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDL0IsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztBQUM5QixNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQ2xCLEtBQUs7QUFDTCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztBQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsQ0FBQztBQUN4QyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7QUFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQy9CLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0FBQ3pDLEVBQUUsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM1QixNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQzFDLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDbEQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQztBQUNqRSxNQUFNLFdBQVcsR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxNQUFNO0FBQ3RELE1BQU0sTUFBTSxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ2pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDN0I7QUFDQSxFQUFFLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxFQUFFO0FBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7QUFDckQsUUFBUSxFQUFFLFdBQVc7QUFDckI7QUFDQSxXQUFXLEdBQUcsSUFBSSxRQUFRO0FBQzFCO0FBQ0EsWUFBWSxNQUFNLEtBQUssR0FBRyxJQUFJLFFBQVEsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUM7QUFDM0Q7QUFDQSxZQUFZLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxJQUFJLEdBQUcsSUFBSSxZQUFZLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDO0FBQ3RGO0FBQ0EsV0FBVyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQztBQUMvQixTQUFTLENBQUMsRUFBRTtBQUNaLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUM5QyxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUM7QUFDckQsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDakQsSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN6QyxFQUFFLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLE9BQU8sS0FBSyxLQUFLLFNBQVMsSUFBSSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQ2pELElBQUksZUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEMsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ2xDLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM1QixFQUFFLE9BQU8sTUFBTSxFQUFFLEVBQUU7QUFDbkIsSUFBSSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDbkMsTUFBTSxPQUFPLE1BQU0sQ0FBQztBQUNwQixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzdDLEVBQUUsSUFBSSxHQUFHLElBQUksV0FBVyxJQUFJLGNBQWMsRUFBRTtBQUM1QyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ2hDLE1BQU0sY0FBYyxFQUFFLElBQUk7QUFDMUIsTUFBTSxZQUFZLEVBQUUsSUFBSTtBQUN4QixNQUFNLE9BQU8sRUFBRSxLQUFLO0FBQ3BCLE1BQU0sVUFBVSxFQUFFLElBQUk7QUFDdEIsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHLE1BQU07QUFDVCxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDeEIsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sR0FBRyxhQUFhLEVBQUUsQ0FBQztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQzNCLEVBQUUsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3JCLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxHQUFHLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDeEQsR0FBRztBQUNILEVBQUUsT0FBTyxDQUFDLGNBQWMsSUFBSSxjQUFjLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMzRCxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7QUFDaEMsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDO0FBQzdELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDN0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMzQyxJQUFJLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLEdBQUc7QUFDSCxFQUFFLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBQzlELEVBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7QUFDakMsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDNUIsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3pCLElBQUksT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsR0FBRztBQUNILEVBQUUsSUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEI7QUFDQSxFQUFFLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQzFCLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxhQUFhLEtBQUssT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ25GLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7QUFDaEUsRUFBRSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDekIsSUFBSSxPQUFPO0FBQ1gsR0FBRztBQUNILEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLFFBQVEsRUFBRSxHQUFHLEVBQUU7QUFDMUMsSUFBSSxLQUFLLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7QUFDakMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM1QixNQUFNLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRixLQUFLO0FBQ0wsU0FBUztBQUNULE1BQU0sSUFBSSxRQUFRLEdBQUcsVUFBVTtBQUMvQixVQUFVLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDO0FBQ3ZGLFVBQVUsU0FBUyxDQUFDO0FBQ3BCO0FBQ0EsTUFBTSxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7QUFDbEMsUUFBUSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzVCLE9BQU87QUFDUCxNQUFNLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNiLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRTtBQUNwRixFQUFFLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0FBQ3JDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0FBQ3JDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEM7QUFDQSxFQUFFLElBQUksT0FBTyxFQUFFO0FBQ2YsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSCxFQUFFLElBQUksUUFBUSxHQUFHLFVBQVU7QUFDM0IsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDO0FBQ3ZFLE1BQU0sU0FBUyxDQUFDO0FBQ2hCO0FBQ0EsRUFBRSxJQUFJLFFBQVEsR0FBRyxRQUFRLEtBQUssU0FBUyxDQUFDO0FBQ3hDO0FBQ0EsRUFBRSxJQUFJLFFBQVEsRUFBRTtBQUNoQixJQUFJLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDakMsUUFBUSxNQUFNLEdBQUcsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3QyxRQUFRLE9BQU8sR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUQ7QUFDQSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDeEIsSUFBSSxJQUFJLEtBQUssSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ3BDLE1BQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDN0IsUUFBUSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzVCLE9BQU87QUFDUCxXQUFXLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDNUMsUUFBUSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLE9BQU87QUFDUCxXQUFXLElBQUksTUFBTSxFQUFFO0FBQ3ZCLFFBQVEsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN6QixRQUFRLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9DLE9BQU87QUFDUCxXQUFXLElBQUksT0FBTyxFQUFFO0FBQ3hCLFFBQVEsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN6QixRQUFRLFFBQVEsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25ELE9BQU87QUFDUCxXQUFXO0FBQ1gsUUFBUSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE9BQU87QUFDUCxLQUFLO0FBQ0wsU0FBUyxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDL0QsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzFCLE1BQU0sSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsUUFBUSxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLE9BQU87QUFDUCxXQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzVELFFBQVEsUUFBUSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxPQUFPO0FBQ1AsS0FBSztBQUNMLFNBQVM7QUFDVCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDdkIsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFFLElBQUksUUFBUSxFQUFFO0FBQ2hCO0FBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0QsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsR0FBRztBQUNILEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUMvQixFQUFFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxlQUFlLEdBQUcsQ0FBQyxjQUFjLEdBQUcsUUFBUSxHQUFHLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUMxRSxFQUFFLE9BQU8sY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDMUMsSUFBSSxjQUFjLEVBQUUsSUFBSTtBQUN4QixJQUFJLFlBQVksRUFBRSxLQUFLO0FBQ3ZCLElBQUksT0FBTyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDN0IsSUFBSSxVQUFVLEVBQUUsSUFBSTtBQUNwQixHQUFHLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDckMsRUFBRSxJQUFJLE1BQU0sRUFBRTtBQUNkLElBQUksT0FBTyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUIsR0FBRztBQUNILEVBQUUsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07QUFDNUIsTUFBTSxNQUFNLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEY7QUFDQSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFO0FBQ3ZDLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuRSxFQUFFLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQzFELEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUU7QUFDN0MsRUFBRSxJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFDaEYsRUFBRSxPQUFPLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDbEMsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDaEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM3QjtBQUNBLEVBQUUsS0FBSyxLQUFLLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNuQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFO0FBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxHQUFHO0FBQ0gsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFO0FBQ3ZELEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDdEIsRUFBRSxNQUFNLEtBQUssTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzFCO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDaEIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM1QjtBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUU7QUFDM0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0I7QUFDQSxJQUFJLElBQUksUUFBUSxHQUFHLFVBQVU7QUFDN0IsUUFBUSxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztBQUNqRSxRQUFRLFNBQVMsQ0FBQztBQUNsQjtBQUNBLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO0FBQ2hDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0wsSUFBSSxJQUFJLEtBQUssRUFBRTtBQUNmLE1BQU0sZUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDN0MsS0FBSyxNQUFNO0FBQ1gsTUFBTSxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWMsQ0FBQyxRQUFRLEVBQUU7QUFDbEMsRUFBRSxPQUFPLFFBQVEsQ0FBQyxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDNUMsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBUSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07QUFDL0IsUUFBUSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVM7QUFDakUsUUFBUSxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQ3BEO0FBQ0EsSUFBSSxVQUFVLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxPQUFPLFVBQVUsSUFBSSxVQUFVO0FBQ3hFLFNBQVMsTUFBTSxFQUFFLEVBQUUsVUFBVTtBQUM3QixRQUFRLFNBQVMsQ0FBQztBQUNsQjtBQUNBLElBQUksSUFBSSxLQUFLLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDaEUsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQ3ZELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNqQixLQUFLO0FBQ0wsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLElBQUksT0FBTyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUU7QUFDN0IsTUFBTSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsTUFBTSxJQUFJLE1BQU0sRUFBRTtBQUNsQixRQUFRLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNwRCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsYUFBYSxDQUFDLFNBQVMsRUFBRTtBQUNsQyxFQUFFLE9BQU8sU0FBUyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUM5QyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFRLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2pDLFFBQVEsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDaEMsUUFBUSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM5QjtBQUNBLElBQUksT0FBTyxNQUFNLEVBQUUsRUFBRTtBQUNyQixNQUFNLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEQsTUFBTSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUM1RCxRQUFRLE1BQU07QUFDZCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDOUIsRUFBRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzFCLEVBQUUsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDO0FBQ3ZCLE1BQU0sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3RELE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ2hDLEVBQUUsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwQyxFQUFFLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDakQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsRUFBRSxJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7QUFDeEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2xDO0FBQ0EsRUFBRSxJQUFJO0FBQ04sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ2hCO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEQsRUFBRSxJQUFJLFFBQVEsRUFBRTtBQUNoQixJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2YsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2xDLEtBQUssTUFBTTtBQUNYLE1BQU0sT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkMsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQ2pDLEVBQUUsT0FBTyxDQUFDLE9BQU8sTUFBTSxDQUFDLFdBQVcsSUFBSSxVQUFVLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0FBQ3pFLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxNQUFNLEVBQUUsQ0FBQztBQUNULENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLEVBQUUsSUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDMUIsRUFBRSxNQUFNLEdBQUcsTUFBTSxJQUFJLElBQUksR0FBRyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDdEQ7QUFDQSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU07QUFDakIsS0FBSyxJQUFJLElBQUksUUFBUTtBQUNyQixPQUFPLElBQUksSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFNBQVMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQzlDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN6QixJQUFJLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLEdBQUc7QUFDSCxFQUFFLElBQUksSUFBSSxHQUFHLE9BQU8sS0FBSyxDQUFDO0FBQzFCLEVBQUUsSUFBSSxJQUFJLElBQUksUUFBUTtBQUN0QixXQUFXLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDL0QsV0FBVyxJQUFJLElBQUksUUFBUSxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUM7QUFDL0MsUUFBUTtBQUNSLElBQUksT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLEdBQUc7QUFDSCxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQztBQUMxQixFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksU0FBUztBQUN2RixPQUFPLEtBQUssS0FBSyxXQUFXO0FBQzVCLE9BQU8sS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3hCLEVBQUUsT0FBTyxDQUFDLENBQUMsVUFBVSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUM1QixFQUFFLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVztBQUN2QyxNQUFNLEtBQUssR0FBRyxDQUFDLE9BQU8sSUFBSSxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFdBQVcsQ0FBQztBQUMzRTtBQUNBLEVBQUUsT0FBTyxLQUFLLEtBQUssS0FBSyxDQUFDO0FBQ3pCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsWUFBWSxDQUFDLE1BQU0sRUFBRTtBQUM5QixFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtBQUN0QixJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3BDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsRUFBRSxPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtBQUMxQyxFQUFFLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEUsRUFBRSxPQUFPLFdBQVc7QUFDcEIsSUFBSSxJQUFJLElBQUksR0FBRyxTQUFTO0FBQ3hCLFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFRLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QjtBQUNBLElBQUksT0FBTyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUU7QUFDN0IsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0wsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZixJQUFJLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckMsSUFBSSxPQUFPLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRTtBQUM1QixNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsS0FBSztBQUNMLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEMsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDOUIsRUFBRSxJQUFJLEdBQUcsS0FBSyxhQUFhLElBQUksT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ2xFLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHLElBQUksV0FBVyxFQUFFO0FBQzFCLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUN4QixFQUFFLElBQUksS0FBSyxHQUFHLENBQUM7QUFDZixNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDckI7QUFDQSxFQUFFLE9BQU8sV0FBVztBQUNwQixJQUFJLElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRTtBQUMzQixRQUFRLFNBQVMsR0FBRyxRQUFRLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ3BEO0FBQ0EsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLE1BQU0sSUFBSSxFQUFFLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDaEMsUUFBUSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixPQUFPO0FBQ1AsS0FBSyxNQUFNO0FBQ1gsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDNUMsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDeEIsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDcEIsSUFBSSxJQUFJO0FBQ1IsTUFBTSxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDbEIsSUFBSSxJQUFJO0FBQ1IsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDbEIsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUMxQixFQUFFLE9BQU8sS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRyxlQUFlLENBQUMsV0FBVyxFQUFFLE9BQU8sU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsZUFBZSxHQUFHLFNBQVMsS0FBSyxFQUFFO0FBQzFHLEVBQUUsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO0FBQ3BFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUM1QixFQUFFLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLGNBQWMsSUFBSSxTQUFTLENBQUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQzNCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN4QixJQUFJLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsRUFBRSxPQUFPLEdBQUcsSUFBSSxPQUFPLElBQUksR0FBRyxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUM7QUFDL0UsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN6QixFQUFFLE9BQU8sT0FBTyxLQUFLLElBQUksUUFBUTtBQUNqQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksZ0JBQWdCLENBQUM7QUFDOUQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDekIsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQztBQUMxQixFQUFFLE9BQU8sS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDN0IsRUFBRSxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLElBQUksUUFBUSxDQUFDO0FBQ25ELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxFQUFFO0FBQzlELElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLEVBQUUsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3RCLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNILEVBQUUsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUM1RSxFQUFFLE9BQU8sT0FBTyxJQUFJLElBQUksVUFBVSxJQUFJLElBQUksWUFBWSxJQUFJO0FBQzFELElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQztBQUNoRCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsZ0JBQWdCLENBQUM7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsRUFBRSxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUN4QixFQUFFLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsY0FBYyxDQUFDLFNBQVMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO0FBQzlFLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQyxDQUFDO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtB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Z0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxXQUFXLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLEdBQUcsRUFBRSxFQUFFLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxFQUFFLEVBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxPQUFPLFlBQVksS0FBSyxVQUFVLEVBQUUsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUM5N0M7QUFDQSxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxPQUFPLFVBQVUsS0FBSyxVQUFVLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsb0RBQW9ELENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsRUFBRSxlQUFlLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFLalk7QUFDQSxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsb0RBQW9ELENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUUsRUFBRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsT0FBTyxHQUFHLEVBQUUsT0FBTyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sZUFBZSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDdnZCO0FBQ0EsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLHlCQUF5QixFQUFFLEVBQUUsRUFBRSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEdBQUcsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLGVBQWUsQ0FBQyxR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QUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRSxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPQSxVQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBS3RULElBQUksV0FBVyxHQUFHQyxnQkFBUyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzVLLElBQUksWUFBWSxHQUFHQSxnQkFBUyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDL0QsSUFBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLFlBQVksRUFBRTtBQUMvQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUM7QUFDeEU7QUFDQSxJQUFJLFVBQVUsR0FBR0QsVUFBUSxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDNUQ7QUFDTyxJQUFJLFdBQVcsR0FBRyxJQUFJ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RyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxTQUFTLEdBQUcsU0FBUyxRQUFRLEdBQUc7QUFDcEMsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxTQUFTLEdBQUcsU0FBUyxRQUFRLEdBQUc7QUFDcEMsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxPQUFPLEdBQUcsU0FBUyxNQUFNLEdBQUc7QUFDaEMsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUNGO0FBQ0EsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJO0FBQ25CLEVBQUUsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEM7QUFDQSxFQUFFLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekQsSUFBSSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2hGLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDO0FBQ0Y7QUFDVSxJQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSztBQUN0QyxFQUFFLEdBQUcsRUFBRSxTQUFTLEdBQUcsR0FBRztBQUN0QixJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3ZHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLEdBQUc7QUFDSCxFQUFFLFFBQVEsRUFBRSxTQUFTLFFBQVEsR0FBRztBQUNoQyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3ZHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzNDLEdBQUc7QUFDSCxFQUFFLFFBQVEsRUFBRSxTQUFTLFFBQVEsR0FBRztBQUNoQyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3ZHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzNDLEdBQUc7QUFDSCxFQUFFLE1BQU0sRUFBRSxTQUFTLE1BQU0sR0FBRztBQUM1QixJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3ZHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLEdBQUc7QUFDSCxFQUFFLE1BQU0sRUFBRSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFO0FBQzlCLENBQUMsQ0FBQyxFQUFFO0FBQ0osRUFBRSxHQUFHLEVBQUUsSUFBSTtBQUNYLEVBQUUsUUFBUSxFQUFFLFNBQVM7QUFDckIsRUFBRSxRQUFRLEVBQUUsU0FBUztBQUNyQixFQUFFLE1BQU0sRUFBRSxPQUFPO0FBQ2pCLEVBQUUsTUFBTSxFQUFFLE9BQU87QUFDakIsQ0FBQzs7QUNwR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUMxQixFQUFFLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtBQUNqQjtBQUNBLElBQUksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3JCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hELElBQUksSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7QUFDbkQ7QUFDQSxNQUFNLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLFNBQVMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO0FBQ3JDLEVBQUUsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRDtBQUNBLEVBQUUsSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUNuQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxHQUFHO0FBQ0g7QUFDQSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakMsRUFBRSxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFDRDtBQUNHLElBQUMsVUFBVSxnQkFBZ0IsWUFBWTtBQUMxQyxFQUFFLFNBQVMsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUMvQixJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyQjtBQUNBLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUNyQyxNQUFNLElBQUksTUFBTSxDQUFDO0FBQ2pCO0FBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNuQyxRQUFRLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDM0UsT0FBTyxNQUFNO0FBQ2IsUUFBUSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDL0QsT0FBTztBQUNQO0FBQ0EsTUFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEQ7QUFDQSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxHQUFHLFlBQW9CLEtBQUssWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDMUcsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQy9CO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDM0IsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDdkMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDbkMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUN2QixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFDcEM7QUFDQSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQzNDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsR0FBRyxDQUFDO0FBQ0o7QUFDQSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN0RCxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFhOUM7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN2QixNQUFNLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQztBQUNBLE1BQU0sSUFBSTtBQUNWO0FBQ0E7QUFDQSxRQUFRLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBSWxCLE9BQU87QUFDUCxLQUFLLE1BQU07QUFDWCxNQUFNLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JELEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2YsR0FBRyxDQUFDO0FBQ0o7QUFDQSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLEdBQUc7QUFDbEM7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3JDLE1BQU0sT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QyxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUtqQixHQUFHLENBQUM7QUFDSjtBQUNBLEVBQUUsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQzs7QUMvSUQsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ2YsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUNuQixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDZixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDZixJQUFJQyxHQUFDLEdBQUcsTUFBTSxDQUFDO0FBR2YsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBTWxCLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQztBQUlyQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2pCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDNUIsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDZixFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25CLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ25CLEVBQUUsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekMsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3ZCLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3ZCLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ2YsRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDbkIsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNmLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ25CLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ25CLEVBQUUsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUN6QixDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNuQixFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUN2QyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUgsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3ZCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFDRCxTQUFTLENBQUMsR0FBRztBQUNiLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxDQUFDLEdBQUc7QUFDYixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFO0FBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNmLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxDQUFDLEdBQUc7QUFDYixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFO0FBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNmLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxDQUFDLEdBQUc7QUFDYixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQixDQUFDO0FBQ0QsU0FBUyxDQUFDLEdBQUc7QUFDYixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDbkIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDZixFQUFFLFFBQVEsRUFBRTtBQUNaLElBQUksS0FBSyxDQUFDLENBQUM7QUFDWCxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQ1gsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLEtBQUssRUFBRTtBQUNYLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLEtBQUssR0FBRyxDQUFDO0FBQ2IsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksS0FBSyxHQUFHLENBQUM7QUFDYixJQUFJLEtBQUssR0FBRztBQUNaLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixJQUFJLEtBQUssRUFBRTtBQUNYLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLEtBQUssRUFBRTtBQUNYLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxLQUFLLEVBQUU7QUFDWCxNQUFNLE9BQU8sQ0FBQyxDQUFDO0FBQ2YsR0FBRztBQUNILEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ2YsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzdDLENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDZixFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNmLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFJRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDZixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNoQixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDZCxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ1Y7QUFDQSxNQUFNLE1BQU07QUFDWixFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDMUMsQ0FBQztBQWVELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDbkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUNwQixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2pFLE1BQU0sTUFBTTtBQUNaLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUNELFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNmLEVBQUUsT0FBTyxDQUFDLEVBQUU7QUFDWixJQUFJLFFBQVEsQ0FBQztBQUNiLE1BQU0sS0FBSyxFQUFFO0FBQ2IsUUFBUSxPQUFPLENBQUMsQ0FBQztBQUNqQixNQUFNLEtBQUssRUFBRSxDQUFDO0FBQ2QsTUFBTSxLQUFLLEVBQUU7QUFDYixRQUFRLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsTUFBTSxLQUFLLEVBQUU7QUFDYixRQUFRLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDckIsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEIsUUFBUSxNQUFNO0FBQ2QsTUFBTSxLQUFLLEVBQUU7QUFDYixRQUFRLENBQUMsRUFBRSxDQUFDO0FBQ1osUUFBUSxNQUFNO0FBQ2QsS0FBSztBQUNMLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNwQixFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDMUIsTUFBTSxNQUFNO0FBQ1osU0FBUyxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQzdDLE1BQU0sTUFBTTtBQUNaLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDUixFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDaEQsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZCxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsRUFBRSxPQUFPLEVBQUU7QUFDWCxJQUFJLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzdCLE1BQU0sS0FBSyxFQUFFLENBQUM7QUFDZCxNQUFNLEtBQUssRUFBRSxDQUFDO0FBQ2QsTUFBTSxLQUFLLEVBQUUsQ0FBQztBQUNkLE1BQU0sS0FBSyxFQUFFO0FBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFD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R0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqQixFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNoRCxJQUFJLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3BGLE1BQU0sSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEUsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDeEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxF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QUFDLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQy9JLElBQUksQ0FBQztBQUNMO0FBQ0EsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLElBQUksVUFBVSxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7QUFDNUQsSUFBSSxDQUFDO0FBQ0w7QUFDQSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixJQUFJLENBQUM7QUFDTDtBQUNBLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUMzRDtBQUNBLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVELEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxRQUFRLEdBQUc7QUFDYixJQUFJLEtBQUssQ0FBQztBQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNoRDtBQUNBLElBQUksS0FBSyxDQUFDO0FBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsSUFBSSxLQUFLLENBQUM7QUFDVixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQyxNQUFNLENBQUM7QUFDUDtBQUNBLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlELEdBQUc7QUFD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SSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLO0FBQ2w4QixRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLEdBQUcsRUFBRSxP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QUcsRUFBRUEsVUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksVUFBVSxNQUFNLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU9BLFVBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDN1Q7QUFDQSxTQUFTOEIsK0JBQTZCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksTUFBTSxJQUFJLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMs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
