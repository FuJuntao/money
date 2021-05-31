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

/**
 * The CSS transform order following the upcoming spec from CSSWG
 * translate => rotate => scale => skew
 * @see https://drafts.csswg.org/css-transforms-2/#ctm
 * @see https://www.stefanjudis.com/blog/order-in-css-transformation-transform-functions-vs-individual-transforms/
 */
var transformTemplate = ["rotate(var(--chakra-rotate, 0))", "scaleX(var(--chakra-scale-x, 1))", "scaleY(var(--chakra-scale-y, 1))", "skewX(var(--chakra-skew-x, 0))", "skewY(var(--chakra-skew-y, 0))"];
function getTransformTemplate() {
  return ["translateX(var(--chakra-translate-x, 0))", "translateY(var(--chakra-translate-y, 0))", ...transformTemplate].join(" ");
}
function getTransformGpuTemplate() {
  return ["translate3d(var(--chakra-translate-x, 0), var(--chakra-translate-y, 0), 0)", ...transformTemplate].join(" ");
}
var filterTemplate = {
  "--chakra-blur": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-invert": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-sepia": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-drop-shadow": "var(--chakra-empty,/*!*/ /*!*/)",
  filter: ["var(--chakra-blur)", "var(--chakra-brightness)", "var(--chakra-contrast)", "var(--chakra-grayscale)", "var(--chakra-hue-rotate)", "var(--chakra-invert)", "var(--chakra-saturate)", "var(--chakra-sepia)", "var(--chakra-drop-shadow)"].join(" ")
};
var backdropFilterTemplate = {
  backdropFilter: ["var(--chakra-backdrop-blur)", "var(--chakra-backdrop-brightness)", "var(--chakra-backdrop-contrast)", "var(--chakra-backdrop-grayscale)", "var(--chakra-backdrop-hue-rotate)", "var(--chakra-backdrop-invert)", "var(--chakra-backdrop-opacity)", "var(--chakra-backdrop-saturate)", "var(--chakra-backdrop-sepia)"].join(" "),
  "--chakra-backdrop-blur": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-invert": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-opacity": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
  "--chakra-backdrop-sepia": "var(--chakra-empty,/*!*/ /*!*/)"
};
function getRingTemplate(value) {
  return {
    "--chakra-ring-offset-shadow": "var(--chakra-ring-inset) 0 0 0 var(--chakra-ring-offset-width) var(--chakra-ring-offset-color)",
    "--chakra-ring-shadow": "var(--chakra-ring-inset) 0 0 0 calc(var(--chakra-ring-width) + var(--chakra-ring-offset-width)) var(--chakra-ring-color)",
    "--chakra-ring-width": value,
    boxShadow: ["var(--chakra-ring-offset-shadow)", "var(--chakra-ring-shadow)", "var(--chakra-shadow, 0 0 #0000)"].join(", ")
  };
}
var flexDirectionTemplate = {
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
var spaceXTemplate = {
  [owlSelector]: {
    marginInlineStart: "calc(var(--chakra-space-x) * calc(1 - var(--chakra-space-x-reverse)))",
    marginInlineEnd: "calc(var(--chakra-space-x) * var(--chakra-space-x-reverse))"
  }
};
var spaceYTemplate = {
  [owlSelector]: {
    marginTop: "calc(var(--chakra-space-y) * calc(1 - var(--chakra-space-y-reverse)))",
    marginBottom: "calc(var(--chakra-space-y) * var(--chakra-space-y-reverse))"
  }
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

var analyzeCSSValue = value => {
  var num = parseFloat(value.toString());
  var unit = value.toString().replace(String(num), "");
  return {
    unitless: !unit,
    value: num,
    unit
  };
};

var wrap = str => value => str + "(" + value + ")";

var transformFunctions = {
  filter(value) {
    return value !== "auto" ? value : filterTemplate;
  },

  backdropFilter(value) {
    return value !== "auto" ? value : backdropFilterTemplate;
  },

  ring(value) {
    return getRingTemplate(transformFunctions.px(value));
  },

  bgClip(value) {
    return value === "text" ? {
      color: "transparent",
      backgroundClip: "text"
    } : {
      backgroundClip: value
    };
  },

  transform(value) {
    if (value === "auto") return getTransformTemplate();
    if (value === "auto-gpu") return getTransformGpuTemplate();
    return value;
  },

  px(value) {
    if (value == null) return value;
    var {
      unitless
    } = analyzeCSSValue(value);
    return unitless || isNumber(value) ? value + "px" : value;
  },

  fraction(value) {
    return !isNumber(value) || value > 1 ? value : value * 100 + "%";
  },

  float(value, theme) {
    var map = {
      left: "right",
      right: "left"
    };
    return theme.direction === "rtl" ? map[value] : value;
  },

  degree(value) {
    if (isCssVar(value) || value == null) return value;
    var unitless = isString(value) && !value.endsWith("deg");
    return isNumber(value) || unitless ? value + "deg" : value;
  },

  gradient: gradientTransform,
  blur: wrap("blur"),
  opacity: wrap("opacity"),
  brightness: wrap("brightness"),
  contrast: wrap("contrast"),
  dropShadow: wrap("drop-shadow"),
  grayscale: wrap("grayscale"),
  hueRotate: wrap("hue-rotate"),
  invert: wrap("invert"),
  saturate: wrap("saturate"),
  sepia: wrap("sepia"),

  bgImage(value) {
    if (value == null) return value;
    var prevent = isCSSFunction(value) || globalSet.has(value);
    return !prevent ? "url(" + value + ")" : value;
  },

  outline(value) {
    var isNoneOrZero = String(value) === "0" || String(value) === "none";
    return value !== null && isNoneOrZero ? {
      outline: "2px solid transparent",
      outlineOffset: "2px"
    } : {
      outline: value
    };
  },

  flexDirection(value) {
    var _flexDirectionTemplat;

    var {
      space,
      divide
    } = (_flexDirectionTemplat = flexDirectionTemplate[value]) != null ? _flexDirectionTemplat : {};
    var result = {
      flexDirection: value
    };
    if (space) result[space] = 1;
    if (divide) result[divide] = 1;
    return result;
  }

};

var isCSSFunction = value => {
  return isString(value) && value.includes("(") && value.includes(")");
};

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var t = {
  borderWidths: toConfig("borderWidths"),
  borderStyles: toConfig("borderStyles"),
  colors: toConfig("colors"),
  borders: toConfig("borders"),
  radii: toConfig("radii", transformFunctions.px),
  space: toConfig("space", transformFunctions.px),
  spaceT: toConfig("space", transformFunctions.px),

  degreeT(property) {
    return {
      property,
      transform: transformFunctions.degree
    };
  },

  prop(property, scale, transform) {
    return _extends({
      property,
      scale
    }, scale && {
      transform: createTransform({
        scale,
        transform
      })
    });
  },

  propT(property, transform) {
    return {
      property,
      transform
    };
  },

  sizes: toConfig("sizes", transformFunctions.px),
  sizesT: toConfig("sizes", transformFunctions.fraction),
  shadows: toConfig("shadows"),
  logical,
  blur: toConfig("blur", transformFunctions.blur)
};

var background = {
  background: t.colors("background"),
  backgroundColor: t.colors("backgroundColor"),
  backgroundImage: t.propT("backgroundImage", transformFunctions.bgImage),
  backgroundSize: true,
  backgroundPosition: true,
  backgroundRepeat: true,
  backgroundAttachment: true,
  backgroundClip: {
    transform: transformFunctions.bgClip
  },
  bgSize: t.prop("backgroundSize"),
  bgPosition: t.prop("backgroundPosition"),
  bg: t.colors("background"),
  bgColor: t.colors("backgroundColor"),
  bgPos: t.prop("backgroundPosition"),
  bgRepeat: t.prop("backgroundRepeat"),
  bgAttachment: t.prop("backgroundAttachment"),
  bgGradient: t.propT("backgroundImage", transformFunctions.gradient),
  bgClip: {
    transform: transformFunctions.bgClip
  }
};
Object.assign(background, {
  bgImage: background.backgroundImage,
  bgImg: background.backgroundImage
});

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
  fill: t.colors("fill"),
  stroke: t.colors("stroke")
};

var effect = {
  boxShadow: t.shadows("boxShadow"),
  mixBlendMode: true,
  blendMode: t.prop("mixBlendMode"),
  backgroundBlendMode: true,
  bgBlendMode: t.prop("backgroundBlendMode"),
  opacity: true
};
Object.assign(effect, {
  shadow: effect.boxShadow
});
/**
 * Types for box and text shadow properties
 */

var filter = {
  filter: {
    transform: transformFunctions.filter
  },
  blur: t.blur("--chakra-blur"),
  brightness: t.propT("--chakra-brightness", transformFunctions.brightness),
  contrast: t.propT("--chakra-contrast", transformFunctions.contrast),
  hueRotate: t.degreeT("--chakra-hue-rotate"),
  invert: t.propT("--chakra-invert", transformFunctions.invert),
  saturate: t.propT("--chakra-saturate", transformFunctions.saturate),
  dropShadow: t.propT("--chakra-drop-shadow", transformFunctions.dropShadow),
  backdropFilter: {
    transform: transformFunctions.backdropFilter
  },
  backdropBlur: t.blur("--chakra-backdrop-blur"),
  backdropBrightness: t.propT("--chakra-backdrop-brightness", transformFunctions.brightness),
  backdropContrast: t.propT("--chakra-backdrop-contrast", transformFunctions.contrast),
  backdropHueRotate: t.degreeT("--chakra-backdrop-hue-rotate"),
  backdropInvert: t.propT("--chakra-backdrop-invert", transformFunctions.invert),
  backdropSaturate: t.propT("--chakra-backdrop-saturate", transformFunctions.saturate)
};

var flexbox = {
  alignItems: true,
  alignContent: true,
  justifyItems: true,
  justifyContent: true,
  flexWrap: true,
  flexDirection: {
    transform: transformFunctions.flexDirection
  },
  experimental_spaceX: {
    static: spaceXTemplate,
    transform: createTransform({
      scale: "space",
      transform: value => value !== null ? {
        "--chakra-space-x": value
      } : null
    })
  },
  experimental_spaceY: {
    static: spaceYTemplate,
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
  placeSelf: true
};
Object.assign(flexbox, {
  flexDir: flexbox.flexDirection
});

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

var interactivity = {
  appearance: true,
  cursor: true,
  resize: true,
  userSelect: true,
  pointerEvents: true,
  outline: {
    transform: transformFunctions.outline
  },
  outlineOffset: true,
  outlineColor: t.colors("outlineColor")
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
  overscrollBehavior: true,
  overscrollBehaviorX: true,
  overscrollBehaviorY: true,
  display: true,
  verticalAlign: true,
  boxSizing: true,
  boxDecorationBreak: true,
  float: t.propT("float", transformFunctions.float),
  objectFit: true,
  objectPosition: true,
  visibility: true,
  isolation: true
};
Object.assign(layout, {
  w: layout.width,
  h: layout.height,
  minW: layout.minWidth,
  maxW: layout.maxWidth,
  minH: layout.minHeight,
  maxH: layout.maxHeight,
  overscroll: layout.overscrollBehavior,
  overscrollX: layout.overscrollBehaviorX,
  overscrollY: layout.overscrollBehaviorY
});
/**
 * Types for layout related CSS properties
 */

var list = {
  listStyleType: true,
  listStylePosition: true,
  listStylePos: t.prop("listStylePosition"),
  listStyleImage: true,
  listStyleImg: t.prop("listStyleImage")
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

/**
 * The parser configuration for common outline properties
 */
var ring = {
  ring: {
    transform: transformFunctions.ring
  },
  ringColor: t.colors("--chakra-ring-color"),
  ringOffset: t.prop("--chakra-ring-offset-width"),
  ringOffsetColor: t.colors("--chakra-ring-offset-color"),
  ringInset: t.prop("--chakra-ring-inset")
};

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

var textDecoration = {
  textDecorationColor: t.colors("textDecorationColor"),
  textDecoration: true,
  textDecor: {
    property: "textDecoration"
  },
  textDecorationLine: true,
  textDecorationStyle: true,
  textDecorationThickness: true,
  textUnderlineOffset: true,
  textShadow: t.shadows("textShadow")
};

var transform = {
  clipPath: true,
  transform: t.propT("transform", transformFunctions.transform),
  transformOrigin: true,
  translateX: t.spaceT("--chakra-translate-x"),
  translateY: t.spaceT("--chakra-translate-y"),
  skewX: t.degreeT("--chakra-skew-x"),
  skewY: t.degreeT("--chakra-skew-y"),
  scaleX: t.prop("--chakra-scale-x"),
  scaleY: t.prop("--chakra-scale-y"),
  scale: t.prop(["--chakra-scale-x", "--chakra-scale-y"]),
  rotate: t.degreeT("--chakra-rotate")
};

var transition = {
  transition: true,
  transitionDelay: true,
  animation: true,
  willChange: true,
  transitionDuration: t.prop("transitionDuration", "transition.duration"),
  transitionProperty: t.prop("transitionProperty", "transition.property"),
  transitionTimingFunction: t.prop("transitionTimingFunction", "transition.easing")
};

var typography = {
  fontFamily: t.prop("fontFamily", "fonts"),
  fontSize: t.prop("fontSize", "fontSizes", transformFunctions.px),
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
   * Styles for when `data-theme` is applied to any parent of
   * this component or element.
   */
  _dark: ".chakra-ui-dark &, [data-theme=dark] &, &[data-theme=dark]",

  /**
   * Styles for when `data-theme` is applied to any parent of
   * this component or element.
   */
  _light: ".chakra-ui-light &, [data-theme=light] &, &[data-theme=light]"
};
var pseudoPropNames = objectKeys(pseudoSelectors);

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var systemProps = lodash_mergewith({}, background, border, color, flexbox, layout, filter, ring, interactivity, grid, others, position, effect, space, typography, textDecoration, transform, list, transition);
var layoutSystem = Object.assign({}, space, layout, flexbox, grid, position);
var layoutPropNames = objectKeys(layoutSystem);
var propNames = [...objectKeys(systemProps), ...pseudoPropNames];

var styleProps = _extends$1({}, systemProps, pseudoSelectors);

var isStyleProp = prop => prop in styleProps;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi03ZTRjZjViMS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvdXRpbHMvZGlzdC9lc20vYXNzZXJ0aW9uLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC5tZXJnZXdpdGgvaW5kZXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9vYmplY3QuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9kb20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS91dGlscy9kaXN0L2VzbS9mdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vdXRpbHMvY3JlYXRlLXRyYW5zZm9ybS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vdXRpbHMvcHJvcC1jb25maWcuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3V0aWxzL3RlbXBsYXRlcy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vdXRpbHMvcGFyc2UtZ3JhZGllbnQuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3V0aWxzL3RyYW5zZm9ybS1mdW5jdGlvbnMuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3V0aWxzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvYmFja2dyb3VuZC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2JvcmRlci5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2NvbG9yLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvZWZmZWN0LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvZmlsdGVyLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvZmxleGJveC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL2dyaWQuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2NvbmZpZy9pbnRlcmFjdGl2aXR5LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvbGF5b3V0LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvbGlzdC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL290aGVycy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3Bvc2l0aW9uLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvcmluZy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3NwYWNlLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvdGV4dC1kZWNvcmF0aW9uLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvdHJhbnNmb3JtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbS9kaXN0L2VzbS9jb25maWcvdHJhbnNpdGlvbi5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY29uZmlnL3R5cG9ncmFwaHkuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3BzZXVkb3MuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL3N5c3RlbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vdXRpbHMvZXhwYW5kLXJlc3BvbnNpdmUuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNoYWtyYS11aS9zdHlsZWQtc3lzdGVtL2Rpc3QvZXNtL2Nzcy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N0eWxlZC1zeXN0ZW0vZGlzdC9lc20vY3JlYXRlLXRoZW1lLXZhcnMvY2FsYy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9zaGVldC9kaXN0L2Vtb3Rpb24tc2hlZXQuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGlzL2Rpc3Qvc3R5bGlzLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi93ZWFrLW1lbW9pemUvZGlzdC93ZWFrLW1lbW9pemUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vbWVtb2l6ZS9kaXN0L2Vtb3Rpb24tbWVtb2l6ZS5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9jYWNoZS9kaXN0L2Vtb3Rpb24tY2FjaGUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vdXRpbHMvZGlzdC9lbW90aW9uLXV0aWxzLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL2hhc2gvZGlzdC9oYXNoLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL3VuaXRsZXNzL2Rpc3QvdW5pdGxlc3MuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vc2VyaWFsaXplL2Rpc3QvZW1vdGlvbi1zZXJpYWxpemUuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vcmVhY3QvZGlzdC9lbW90aW9uLWVsZW1lbnQtYTgzMDkwNzAuYnJvd3Nlci5lc20uanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3lzdGVtL2Rpc3QvZXNtL3N5c3RlbS51dGlscy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9pcy1wcm9wLXZhbGlkL2Rpc3QvZW1vdGlvbi1pcy1wcm9wLXZhbGlkLmJyb3dzZXIuZXNtLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BlbW90aW9uL3N0eWxlZC9iYXNlL2Rpc3QvZW1vdGlvbi1zdHlsZWQtYmFzZS5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZW1vdGlvbi9zdHlsZWQvZGlzdC9lbW90aW9uLXN0eWxlZC5icm93c2VyLmVzbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N5c3RlbS9kaXN0L2VzbS9zaG91bGQtZm9yd2FyZC1wcm9wLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjaGFrcmEtdWkvc3lzdGVtL2Rpc3QvZXNtL3N5c3RlbS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL3N5c3RlbS9kaXN0L2VzbS9mb3J3YXJkLXJlZi5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2hha3JhLXVpL2ljb24vZGlzdC9lc20vaWNvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOdW1iZXIgYXNzZXJ0aW9uc1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3ROdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gXCJudW1iZXJcIiB8fCBOdW1iZXIuaXNOYU4odmFsdWUpIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAtIHBhcnNlRmxvYXQodmFsdWUpICsgMSA+PSAwO1xufSAvLyBBcnJheSBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMDtcbn0gLy8gRnVuY3Rpb24gYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59IC8vIEdlbmVyaWMgYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG59IC8vIE9iamVjdCBhc3NlcnRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT09IFwib2JqZWN0XCIgfHwgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSAmJiAhaXNBcnJheSh2YWx1ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDA7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3RFbXB0eU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgIWlzRW1wdHlPYmplY3QodmFsdWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbDtcbn0gLy8gU3RyaW5nIGFzc2VydGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ3NzVmFyKHZhbHVlKSB7XG4gIHJldHVybiAvXnZhclxcKC0tLitcXCkkLy50ZXN0KHZhbHVlKTtcbn0gLy8gRW1wdHkgYXNzZXJ0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHJldHVybiBpc0VtcHR5QXJyYXkodmFsdWUpO1xuICBpZiAoaXNPYmplY3QodmFsdWUpKSByZXR1cm4gaXNFbXB0eU9iamVjdCh2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IHZhciBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiO1xuZXhwb3J0IHZhciBfX1RFU1RfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIjtcbmV4cG9ydCBmdW5jdGlvbiBpc1JlZk9iamVjdCh2YWwpIHtcbiAgcmV0dXJuIFwiY3VycmVudFwiIGluIHZhbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0RXZlbnQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIGlzT2JqZWN0KHZhbHVlKSAmJiBpc09iamVjdCh2YWx1ZS50YXJnZXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXNzZXJ0aW9uLmpzLm1hcCIsIi8qKlxuICogTG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgT3BlbkpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9vcGVuanNmLm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGluZmVyIHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3Rvci4gKi9cbnZhciBvYmplY3RDdG9yU3RyaW5nID0gZnVuY1RvU3RyaW5nLmNhbGwoT2JqZWN0KTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXksXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQsXG4gICAgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCksXG4gICAgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZSxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICAgIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlLFxuICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhc3NpZ25WYWx1ZWAgZXhjZXB0IHRoYXQgaXQgZG9lc24ndCBhc3NpZ25cbiAqIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWVxKG9iamVjdFtrZXldLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGFzc2lnblZhbHVlYCBhbmQgYGFzc2lnbk1lcmdlVmFsdWVgIHdpdGhvdXRcbiAqIHZhbHVlIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycgJiYgZGVmaW5lUHJvcGVydHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgICAnZW51bWVyYWJsZSc6IHRydWUsXG4gICAgICAndmFsdWUnOiB2YWx1ZSxcbiAgICAgICd3cml0YWJsZSc6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmIChvYmplY3QgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiYXNlRm9yKHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIoc2FmZUdldChvYmplY3QsIGtleSksIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfSwga2V5c0luKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXJnZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1lcmdlIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIHZhciBvYmpWYWx1ZSA9IHNhZmVHZXQob2JqZWN0LCBrZXkpLFxuICAgICAgc3JjVmFsdWUgPSBzYWZlR2V0KHNvdXJjZSwga2V5KSxcbiAgICAgIHN0YWNrZWQgPSBzdGFjay5nZXQoc3JjVmFsdWUpO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgc3RhY2tlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGlzQ29tbW9uID0gbmV3VmFsdWUgPT09IHVuZGVmaW5lZDtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHNyY1ZhbHVlKSxcbiAgICAgICAgaXNCdWZmID0gIWlzQXJyICYmIGlzQnVmZmVyKHNyY1ZhbHVlKSxcbiAgICAgICAgaXNUeXBlZCA9ICFpc0FyciAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheShzcmNWYWx1ZSk7XG5cbiAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgIGlmIChpc0FyciB8fCBpc0J1ZmYgfHwgaXNUeXBlZCkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNCdWZmKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVCdWZmZXIoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNUeXBlZCkge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lVHlwZWRBcnJheShzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgaWYgKGlzQXJndW1lbnRzKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRvUGxhaW5PYmplY3Qob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KG9ialZhbHVlKSB8fCBpc0Z1bmN0aW9uKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGluaXRDbG9uZU9iamVjdChzcmNWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgc3RhY2suc2V0KHNyY1ZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgbWVyZ2VGdW5jKG5ld1ZhbHVlLCBzcmNWYWx1ZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICB9XG4gIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiAgYGJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUJ1ZmZlcihidWZmZXIsIGlzRGVlcCkge1xuICBpZiAoaXNEZWVwKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZSgpO1xuICB9XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYWxsb2NVbnNhZmUgPyBhbGxvY1Vuc2FmZShsZW5ndGgpIDogbmV3IGJ1ZmZlci5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgPyAobGVuZ3RoLS0sIGN1c3RvbWl6ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBpbmRleCwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgLCB1bmxlc3MgYGtleWAgaXMgXCJfX3Byb3RvX19cIiBvciBcImNvbnN0cnVjdG9yXCIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzYWZlR2V0KG9iamVjdCwga2V5KSB7XG4gIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgJiYgdHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGtleSA9PSAnX19wcm90b19fJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjguMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgfHwgYmFzZUdldFRhZyh2YWx1ZSkgIT0gb2JqZWN0VGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwcm90byA9IGdldFByb3RvdHlwZSh2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBDdG9yID0gaGFzT3duUHJvcGVydHkuY2FsbChwcm90bywgJ2NvbnN0cnVjdG9yJykgJiYgcHJvdG8uY29uc3RydWN0b3I7XG4gIHJldHVybiB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IgaW5zdGFuY2VvZiBDdG9yICYmXG4gICAgZnVuY1RvU3RyaW5nLmNhbGwoQ3RvcikgPT0gb2JqZWN0Q3RvclN0cmluZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmdcbiAqIGtleWVkIHByb3BlcnRpZXMgb2YgYHZhbHVlYCB0byBvd24gcHJvcGVydGllcyBvZiB0aGUgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY29weU9iamVjdCh2YWx1ZSwga2V5c0luKHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ubWVyZ2VgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgIHdoaWNoXG4gKiBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIG1lcmdlZCB2YWx1ZXMgb2YgdGhlIGRlc3RpbmF0aW9uIGFuZCBzb3VyY2VcbiAqIHByb3BlcnRpZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgLCBtZXJnaW5nIGlzIGhhbmRsZWQgYnkgdGhlXG4gKiBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBpbnZva2VkIHdpdGggc2l4IGFyZ3VtZW50czpcbiAqIChvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gc291cmNlcyBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUpIHtcbiAqICAgaWYgKF8uaXNBcnJheShvYmpWYWx1ZSkpIHtcbiAqICAgICByZXR1cm4gb2JqVmFsdWUuY29uY2F0KHNyY1ZhbHVlKTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogWzFdLCAnYic6IFsyXSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IFszXSwgJ2InOiBbNF0gfTtcbiAqXG4gKiBfLm1lcmdlV2l0aChvYmplY3QsIG90aGVyLCBjdXN0b21pemVyKTtcbiAqIC8vID0+IHsgJ2EnOiBbMSwgM10sICdiJzogWzIsIDRdIH1cbiAqL1xudmFyIG1lcmdlV2l0aCA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcikge1xuICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyKTtcbn0pO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlV2l0aDtcbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgbWVyZ2VXaXRoIH0gZnJvbSBcImxvZGFzaC5tZXJnZXdpdGhcIjtcbmV4cG9ydCBmdW5jdGlvbiBvbWl0KG9iamVjdCwga2V5cykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXlzLmluY2x1ZGVzKGtleSkpIHJldHVybjtcbiAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwaWNrKG9iamVjdCwga2V5cykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgZnVuY3Rpb24gc3BsaXQob2JqZWN0LCBrZXlzKSB7XG4gIHZhciBwaWNrZWQgPSB7fTtcbiAgdmFyIG9taXR0ZWQgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgcGlja2VkW2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgb21pdHRlZFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFtwaWNrZWQsIG9taXR0ZWRdO1xufVxuLyoqXG4gKiBHZXQgdmFsdWUgZnJvbSBhIGRlZXBseSBuZXN0ZWQgb2JqZWN0IHVzaW5nIGEgc3RyaW5nIHBhdGguXG4gKiBNZW1vaXplcyB0aGUgdmFsdWUuXG4gKiBAcGFyYW0gb2JqIC0gdGhlIG9iamVjdFxuICogQHBhcmFtIHBhdGggLSB0aGUgc3RyaW5nIHBhdGhcbiAqIEBwYXJhbSBkZWYgIC0gdGhlIGZhbGxiYWNrIHZhbHVlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldChvYmosIHBhdGgsIGZhbGxiYWNrLCBpbmRleCkge1xuICB2YXIga2V5ID0gdHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgPyBwYXRoLnNwbGl0KFwiLlwiKSA6IFtwYXRoXTtcblxuICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBrZXkubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgaWYgKCFvYmopIGJyZWFrO1xuICAgIG9iaiA9IG9ialtrZXlbaW5kZXhdXTtcbiAgfVxuXG4gIHJldHVybiBvYmogPT09IHVuZGVmaW5lZCA/IGZhbGxiYWNrIDogb2JqO1xufVxuZXhwb3J0IHZhciBtZW1vaXplID0gZm4gPT4ge1xuICB2YXIgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG4gIHZhciBtZW1vaXplZEZuID0gKG9iaiwgcGF0aCwgZmFsbGJhY2ssIGluZGV4KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBmbihvYmosIHBhdGgsIGZhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBpZiAoIWNhY2hlLmhhcyhvYmopKSB7XG4gICAgICBjYWNoZS5zZXQob2JqLCBuZXcgTWFwKCkpO1xuICAgIH1cblxuICAgIHZhciBtYXAgPSBjYWNoZS5nZXQob2JqKTtcblxuICAgIGlmIChtYXAuaGFzKHBhdGgpKSB7XG4gICAgICByZXR1cm4gbWFwLmdldChwYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBmbihvYmosIHBhdGgsIGZhbGxiYWNrLCBpbmRleCk7XG4gICAgbWFwLnNldChwYXRoLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBtZW1vaXplZEZuO1xufTtcbmV4cG9ydCB2YXIgbWVtb2l6ZWRHZXQgPSBtZW1vaXplKGdldCk7XG4vKipcbiAqIEdldCB2YWx1ZSBmcm9tIGRlZXBseSBuZXN0ZWQgb2JqZWN0LCBiYXNlZCBvbiBwYXRoXG4gKiBJdCByZXR1cm5zIHRoZSBwYXRoIHZhbHVlIGlmIG5vdCBmb3VuZCBpbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gcGF0aCAtIHRoZSBzdHJpbmcgcGF0aCBvciB2YWx1ZVxuICogQHBhcmFtIHNjYWxlIC0gdGhlIHN0cmluZyBwYXRoIG9yIHZhbHVlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpdGhEZWZhdWx0KHBhdGgsIHNjYWxlKSB7XG4gIHJldHVybiBtZW1vaXplZEdldChzY2FsZSwgcGF0aCwgcGF0aCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlbXMgb2YgYW4gb2JqZWN0IHRoYXQgbWVldCB0aGUgY29uZGl0aW9uIHNwZWNpZmllZCBpbiBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBvYmplY3QgdGhlIG9iamVjdCB0byBsb29wIHRocm91Z2hcbiAqIEBwYXJhbSBmbiBUaGUgZmlsdGVyIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3RGaWx0ZXIob2JqZWN0LCBmbikge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIHZhciBzaG91bGRQYXNzID0gZm4odmFsdWUsIGtleSwgb2JqZWN0KTtcblxuICAgIGlmIChzaG91bGRQYXNzKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgdmFyIGZpbHRlclVuZGVmaW5lZCA9IG9iamVjdCA9PiBvYmplY3RGaWx0ZXIob2JqZWN0LCB2YWwgPT4gdmFsICE9PSBudWxsICYmIHZhbCAhPT0gdW5kZWZpbmVkKTtcbmV4cG9ydCB2YXIgb2JqZWN0S2V5cyA9IG9iaiA9PiBPYmplY3Qua2V5cyhvYmopO1xuLyoqXG4gKiBPYmplY3QuZW50cmllcyBwb2x5ZmlsbCBmb3IgTm9kZXYxMCBjb21wYXRpYmlsaXR5XG4gKi9cblxuZXhwb3J0IHZhciBmcm9tRW50cmllcyA9IGVudHJpZXMgPT4gZW50cmllcy5yZWR1Y2UoKGNhcnJ5LCBfcmVmKSA9PiB7XG4gIHZhciBba2V5LCB2YWx1ZV0gPSBfcmVmO1xuICBjYXJyeVtrZXldID0gdmFsdWU7XG4gIHJldHVybiBjYXJyeTtcbn0sIHt9KTtcbi8qKlxuICogR2V0IHRoZSBDU1MgdmFyaWFibGUgcmVmIHN0b3JlZCBpbiB0aGUgdGhlbWVcbiAqL1xuXG5leHBvcnQgdmFyIGdldENTU1ZhciA9ICh0aGVtZSwgc2NhbGUsIHZhbHVlKSA9PiB7XG4gIHZhciBfdGhlbWUkX19jc3NNYXAkJHZhclIsIF90aGVtZSRfX2Nzc01hcCQ7XG5cbiAgcmV0dXJuIChfdGhlbWUkX19jc3NNYXAkJHZhclIgPSAoX3RoZW1lJF9fY3NzTWFwJCA9IHRoZW1lLl9fY3NzTWFwW3NjYWxlICsgXCIuXCIgKyB2YWx1ZV0pID09IG51bGwgPyB2b2lkIDAgOiBfdGhlbWUkX19jc3NNYXAkLnZhclJlZikgIT0gbnVsbCA/IF90aGVtZSRfX2Nzc01hcCQkdmFyUiA6IHZhbHVlO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9iamVjdC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJXaW5kb3cobm9kZSkge1xuICB2YXIgX2dldE93bmVyRG9jdW1lbnQkZGVmLCBfZ2V0T3duZXJEb2N1bWVudDtcblxuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgPyAoX2dldE93bmVyRG9jdW1lbnQkZGVmID0gKF9nZXRPd25lckRvY3VtZW50ID0gZ2V0T3duZXJEb2N1bWVudChub2RlKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9nZXRPd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAhPSBudWxsID8gX2dldE93bmVyRG9jdW1lbnQkZGVmIDogd2luZG93IDogd2luZG93O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyRG9jdW1lbnQobm9kZSkge1xuICB2YXIgX25vZGUkb3duZXJEb2N1bWVudDtcblxuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgPyAoX25vZGUkb3duZXJEb2N1bWVudCA9IG5vZGUub3duZXJEb2N1bWVudCkgIT0gbnVsbCA/IF9ub2RlJG93bmVyRG9jdW1lbnQgOiBkb2N1bWVudCA6IGRvY3VtZW50O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZURPTSgpIHtcbiAgcmV0dXJuICEhKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbn1cbmV4cG9ydCB2YXIgaXNCcm93c2VyID0gY2FuVXNlRE9NKCk7XG5leHBvcnQgdmFyIGRhdGFBdHRyID0gY29uZGl0aW9uID0+IGNvbmRpdGlvbiA/IFwiXCIgOiB1bmRlZmluZWQ7XG5leHBvcnQgdmFyIGFyaWFBdHRyID0gY29uZGl0aW9uID0+IGNvbmRpdGlvbiA/IHRydWUgOiB1bmRlZmluZWQ7XG5leHBvcnQgdmFyIGN4ID0gZnVuY3Rpb24gY3goKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjbGFzc05hbWVzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGNsYXNzTmFtZXNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gY2xhc3NOYW1lcy5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIik7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZUVsZW1lbnQobm9kZSkge1xuICB2YXIgZG9jID0gZ2V0T3duZXJEb2N1bWVudChub2RlKTtcbiAgcmV0dXJuIGRvYyA9PSBudWxsID8gdm9pZCAwIDogZG9jLmFjdGl2ZUVsZW1lbnQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICBpZiAoIXBhcmVudCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gcGFyZW50ID09PSBjaGlsZCB8fCBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZERvbUV2ZW50KHRhcmdldCwgZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgfTtcbn1cbi8qKlxuICogR2V0IHRoZSBub3JtYWxpemVkIGV2ZW50IGtleSBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4gKiBAcGFyYW0gZXZlbnQga2V5Ym9hcmQgZXZlbnRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRXZlbnRLZXkoZXZlbnQpIHtcbiAgdmFyIHtcbiAgICBrZXksXG4gICAga2V5Q29kZVxuICB9ID0gZXZlbnQ7XG4gIHZhciBpc0Fycm93S2V5ID0ga2V5Q29kZSA+PSAzNyAmJiBrZXlDb2RlIDw9IDQwICYmIGtleS5pbmRleE9mKFwiQXJyb3dcIikgIT09IDA7XG4gIHZhciBldmVudEtleSA9IGlzQXJyb3dLZXkgPyBcIkFycm93XCIgKyBrZXkgOiBrZXk7XG4gIHJldHVybiBldmVudEtleTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWxhdGVkVGFyZ2V0KGV2ZW50KSB7XG4gIHZhciBfZXZlbnQkdGFyZ2V0LCBfcmVmLCBfZXZlbnQkcmVsYXRlZFRhcmdldDtcblxuICB2YXIgdGFyZ2V0ID0gKF9ldmVudCR0YXJnZXQgPSBldmVudC50YXJnZXQpICE9IG51bGwgPyBfZXZlbnQkdGFyZ2V0IDogZXZlbnQuY3VycmVudFRhcmdldDtcbiAgdmFyIGFjdGl2ZUVsZW1lbnQgPSBnZXRBY3RpdmVFbGVtZW50KHRhcmdldCk7XG4gIHZhciBvcmlnaW5hbFRhcmdldCA9IGV2ZW50Lm5hdGl2ZUV2ZW50LmV4cGxpY2l0T3JpZ2luYWxUYXJnZXQ7XG4gIHJldHVybiAoX3JlZiA9IChfZXZlbnQkcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQpICE9IG51bGwgPyBfZXZlbnQkcmVsYXRlZFRhcmdldCA6IG9yaWdpbmFsVGFyZ2V0KSAhPSBudWxsID8gX3JlZiA6IGFjdGl2ZUVsZW1lbnQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNSaWdodENsaWNrKGV2ZW50KSB7XG4gIHJldHVybiBldmVudC5idXR0b24gIT09IDA7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kb20uanMubWFwIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbmltcG9ydCB7IGlzRnVuY3Rpb24sIGlzTnVtYmVyLCBfX0RFVl9fLCBfX1RFU1RfXyB9IGZyb20gXCIuL2Fzc2VydGlvblwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJ1bklmRm4odmFsdWVPckZuKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBpc0Z1bmN0aW9uKHZhbHVlT3JGbikgPyB2YWx1ZU9yRm4oLi4uYXJncykgOiB2YWx1ZU9yRm47XG59XG5leHBvcnQgZnVuY3Rpb24gY2FsbEFsbEhhbmRsZXJzKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGZuc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGZ1bmMoZXZlbnQpIHtcbiAgICBmbnMuc29tZShmbiA9PiB7XG4gICAgICBmbiA9PSBudWxsID8gdm9pZCAwIDogZm4oZXZlbnQpO1xuICAgICAgcmV0dXJuIGV2ZW50ID09IG51bGwgPyB2b2lkIDAgOiBldmVudC5kZWZhdWx0UHJldmVudGVkO1xuICAgIH0pO1xuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxBbGwoKSB7XG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgZm5zW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkRm4oYXJnKSB7XG4gICAgZm5zLmZvckVhY2goZm4gPT4ge1xuICAgICAgZm4gPT0gbnVsbCA/IHZvaWQgMCA6IGZuKGFyZyk7XG4gICAgfSk7XG4gIH07XG59XG5leHBvcnQgdmFyIGNvbXBvc2UgPSBmdW5jdGlvbiBjb21wb3NlKGZuMSkge1xuICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgZm5zW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIGZucy5yZWR1Y2UoKGYxLCBmMikgPT4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmMShmMiguLi5hcmd1bWVudHMpKTtcbiAgfSwgZm4xKTtcbn07XG5leHBvcnQgZnVuY3Rpb24gb25jZShmbikge1xuICB2YXIgcmVzdWx0O1xuICByZXR1cm4gZnVuY3Rpb24gZnVuYygpIHtcbiAgICBpZiAoZm4pIHtcbiAgICAgIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNSksIF9rZXk1ID0gMDsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuICAgICAgICBhcmdzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgZm4gPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5leHBvcnQgdmFyIG5vb3AgPSAoKSA9PiB7fTtcbmV4cG9ydCB2YXIgd2FybiA9IG9uY2Uob3B0aW9ucyA9PiAoKSA9PiB7XG4gIHZhciB7XG4gICAgY29uZGl0aW9uLFxuICAgIG1lc3NhZ2VcbiAgfSA9IG9wdGlvbnM7XG5cbiAgaWYgKGNvbmRpdGlvbiAmJiBfX0RFVl9fKSB7XG4gICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICB9XG59KTtcbmV4cG9ydCB2YXIgZXJyb3IgPSBvbmNlKG9wdGlvbnMgPT4gKCkgPT4ge1xuICB2YXIge1xuICAgIGNvbmRpdGlvbixcbiAgICBtZXNzYWdlXG4gIH0gPSBvcHRpb25zO1xuXG4gIGlmIChjb25kaXRpb24gJiYgX19ERVZfXykge1xuICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gIH1cbn0pO1xuXG52YXIgcHJvbWlzZU1pY3JvdGFzayA9IGNhbGxiYWNrID0+IHtcbiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjayk7XG59O1xuXG5leHBvcnQgdmFyIHNjaGVkdWxlTWljcm90YXNrID0gX19URVNUX18gPyBmbiA9PiBmbigpIDogdHlwZW9mIHF1ZXVlTWljcm90YXNrID09PSBcImZ1bmN0aW9uXCIgPyBxdWV1ZU1pY3JvdGFzayA6IHByb21pc2VNaWNyb3Rhc2s7XG5leHBvcnQgdmFyIHBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgIGZuc1tfa2V5Nl0gPSBhcmd1bWVudHNbX2tleTZdO1xuICB9XG5cbiAgcmV0dXJuIHYgPT4gZm5zLnJlZHVjZSgoYSwgYikgPT4gYihhKSwgdik7XG59O1xuXG52YXIgZGlzdGFuY2UxRCA9IChhLCBiKSA9PiBNYXRoLmFicyhhIC0gYik7XG5cbnZhciBpc1BvaW50ID0gcG9pbnQgPT4gXCJ4XCIgaW4gcG9pbnQgJiYgXCJ5XCIgaW4gcG9pbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZShhLCBiKSB7XG4gIGlmIChpc051bWJlcihhKSAmJiBpc051bWJlcihiKSkge1xuICAgIHJldHVybiBkaXN0YW5jZTFEKGEsIGIpO1xuICB9XG5cbiAgaWYgKGlzUG9pbnQoYSkgJiYgaXNQb2ludChiKSkge1xuICAgIHZhciB4RGVsdGEgPSBkaXN0YW5jZTFEKGEueCwgYi54KTtcbiAgICB2YXIgeURlbHRhID0gZGlzdGFuY2UxRChhLnksIGIueSk7XG4gICAgcmV0dXJuIE1hdGguc3FydCh4RGVsdGEgKiogMiArIHlEZWx0YSAqKiAyKTtcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnVuY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwiQGNoYWtyYS11aS91dGlsc1wiO1xuZXhwb3J0IHZhciB0b2tlblRvQ1NTVmFyID0gKHNjYWxlLCB2YWx1ZSkgPT4gdGhlbWUgPT4ge1xuICB2YXIgdmFsdWVTdHIgPSBTdHJpbmcodmFsdWUpO1xuICB2YXIga2V5ID0gc2NhbGUgPyBzY2FsZSArIFwiLlwiICsgdmFsdWVTdHIgOiB2YWx1ZVN0cjtcbiAgcmV0dXJuIGlzT2JqZWN0KHRoZW1lLl9fY3NzTWFwKSAmJiBrZXkgaW4gdGhlbWUuX19jc3NNYXAgPyB0aGVtZS5fX2Nzc01hcFtrZXldLnZhclJlZiA6IHZhbHVlO1xufTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2Zvcm0ob3B0aW9ucykge1xuICB2YXIge1xuICAgIHNjYWxlLFxuICAgIHRyYW5zZm9ybSxcbiAgICBjb21wb3NlXG4gIH0gPSBvcHRpb25zO1xuXG4gIHZhciBmbiA9ICh2YWx1ZSwgdGhlbWUpID0+IHtcbiAgICB2YXIgX3RyYW5zZm9ybTtcblxuICAgIHZhciBfdmFsdWUgPSB0b2tlblRvQ1NTVmFyKHNjYWxlLCB2YWx1ZSkodGhlbWUpO1xuXG4gICAgdmFyIHJlc3VsdCA9IChfdHJhbnNmb3JtID0gdHJhbnNmb3JtID09IG51bGwgPyB2b2lkIDAgOiB0cmFuc2Zvcm0oX3ZhbHVlLCB0aGVtZSkpICE9IG51bGwgPyBfdHJhbnNmb3JtIDogX3ZhbHVlO1xuXG4gICAgaWYgKGNvbXBvc2UpIHtcbiAgICAgIHJlc3VsdCA9IGNvbXBvc2UocmVzdWx0LCB0aGVtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICByZXR1cm4gZm47XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGUtdHJhbnNmb3JtLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZVRyYW5zZm9ybSB9IGZyb20gXCIuL2NyZWF0ZS10cmFuc2Zvcm1cIjtcbmV4cG9ydCBmdW5jdGlvbiB0b0NvbmZpZyhzY2FsZSwgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBwcm9wZXJ0eSA9PiB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHByb3BlcnR5LFxuICAgICAgc2NhbGVcbiAgICB9O1xuICAgIHJlc3VsdC50cmFuc2Zvcm0gPSBjcmVhdGVUcmFuc2Zvcm0oe1xuICAgICAgc2NhbGUsXG4gICAgICB0cmFuc2Zvcm1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG52YXIgZ2V0UnRsID0gKF9yZWYpID0+IHtcbiAgdmFyIHtcbiAgICBydGwsXG4gICAgbHRyXG4gIH0gPSBfcmVmO1xuICByZXR1cm4gdGhlbWUgPT4gdGhlbWUuZGlyZWN0aW9uID09PSBcInJ0bFwiID8gcnRsIDogbHRyO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2ljYWwob3B0aW9ucykge1xuICB2YXIge1xuICAgIHByb3BlcnR5LFxuICAgIHNjYWxlLFxuICAgIHRyYW5zZm9ybVxuICB9ID0gb3B0aW9ucztcbiAgcmV0dXJuIHtcbiAgICBzY2FsZSxcbiAgICBwcm9wZXJ0eTogZ2V0UnRsKHByb3BlcnR5KSxcbiAgICB0cmFuc2Zvcm06IHNjYWxlID8gY3JlYXRlVHJhbnNmb3JtKHtcbiAgICAgIHNjYWxlLFxuICAgICAgY29tcG9zZTogdHJhbnNmb3JtXG4gICAgfSkgOiB0cmFuc2Zvcm1cbiAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb3AtY29uZmlnLmpzLm1hcCIsIi8qKlxuICogVGhlIENTUyB0cmFuc2Zvcm0gb3JkZXIgZm9sbG93aW5nIHRoZSB1cGNvbWluZyBzcGVjIGZyb20gQ1NTV0dcbiAqIHRyYW5zbGF0ZSA9PiByb3RhdGUgPT4gc2NhbGUgPT4gc2tld1xuICogQHNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXRyYW5zZm9ybXMtMi8jY3RtXG4gKiBAc2VlIGh0dHBzOi8vd3d3LnN0ZWZhbmp1ZGlzLmNvbS9ibG9nL29yZGVyLWluLWNzcy10cmFuc2Zvcm1hdGlvbi10cmFuc2Zvcm0tZnVuY3Rpb25zLXZzLWluZGl2aWR1YWwtdHJhbnNmb3Jtcy9cbiAqL1xudmFyIHRyYW5zZm9ybVRlbXBsYXRlID0gW1wicm90YXRlKHZhcigtLWNoYWtyYS1yb3RhdGUsIDApKVwiLCBcInNjYWxlWCh2YXIoLS1jaGFrcmEtc2NhbGUteCwgMSkpXCIsIFwic2NhbGVZKHZhcigtLWNoYWtyYS1zY2FsZS15LCAxKSlcIiwgXCJza2V3WCh2YXIoLS1jaGFrcmEtc2tldy14LCAwKSlcIiwgXCJza2V3WSh2YXIoLS1jaGFrcmEtc2tldy15LCAwKSlcIl07XG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNmb3JtVGVtcGxhdGUoKSB7XG4gIHJldHVybiBbXCJ0cmFuc2xhdGVYKHZhcigtLWNoYWtyYS10cmFuc2xhdGUteCwgMCkpXCIsIFwidHJhbnNsYXRlWSh2YXIoLS1jaGFrcmEtdHJhbnNsYXRlLXksIDApKVwiLCAuLi50cmFuc2Zvcm1UZW1wbGF0ZV0uam9pbihcIiBcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNmb3JtR3B1VGVtcGxhdGUoKSB7XG4gIHJldHVybiBbXCJ0cmFuc2xhdGUzZCh2YXIoLS1jaGFrcmEtdHJhbnNsYXRlLXgsIDApLCB2YXIoLS1jaGFrcmEtdHJhbnNsYXRlLXksIDApLCAwKVwiLCAuLi50cmFuc2Zvcm1UZW1wbGF0ZV0uam9pbihcIiBcIik7XG59XG5leHBvcnQgdmFyIGZpbHRlclRlbXBsYXRlID0ge1xuICBcIi0tY2hha3JhLWJsdXJcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtYnJpZ2h0bmVzc1wiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1jb250cmFzdFwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1ncmF5c2NhbGVcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtaHVlLXJvdGF0ZVwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1pbnZlcnRcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtc2F0dXJhdGVcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtc2VwaWFcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtZHJvcC1zaGFkb3dcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIGZpbHRlcjogW1widmFyKC0tY2hha3JhLWJsdXIpXCIsIFwidmFyKC0tY2hha3JhLWJyaWdodG5lc3MpXCIsIFwidmFyKC0tY2hha3JhLWNvbnRyYXN0KVwiLCBcInZhcigtLWNoYWtyYS1ncmF5c2NhbGUpXCIsIFwidmFyKC0tY2hha3JhLWh1ZS1yb3RhdGUpXCIsIFwidmFyKC0tY2hha3JhLWludmVydClcIiwgXCJ2YXIoLS1jaGFrcmEtc2F0dXJhdGUpXCIsIFwidmFyKC0tY2hha3JhLXNlcGlhKVwiLCBcInZhcigtLWNoYWtyYS1kcm9wLXNoYWRvdylcIl0uam9pbihcIiBcIilcbn07XG5leHBvcnQgdmFyIGJhY2tkcm9wRmlsdGVyVGVtcGxhdGUgPSB7XG4gIGJhY2tkcm9wRmlsdGVyOiBbXCJ2YXIoLS1jaGFrcmEtYmFja2Ryb3AtYmx1cilcIiwgXCJ2YXIoLS1jaGFrcmEtYmFja2Ryb3AtYnJpZ2h0bmVzcylcIiwgXCJ2YXIoLS1jaGFrcmEtYmFja2Ryb3AtY29udHJhc3QpXCIsIFwidmFyKC0tY2hha3JhLWJhY2tkcm9wLWdyYXlzY2FsZSlcIiwgXCJ2YXIoLS1jaGFrcmEtYmFja2Ryb3AtaHVlLXJvdGF0ZSlcIiwgXCJ2YXIoLS1jaGFrcmEtYmFja2Ryb3AtaW52ZXJ0KVwiLCBcInZhcigtLWNoYWtyYS1iYWNrZHJvcC1vcGFjaXR5KVwiLCBcInZhcigtLWNoYWtyYS1iYWNrZHJvcC1zYXR1cmF0ZSlcIiwgXCJ2YXIoLS1jaGFrcmEtYmFja2Ryb3Atc2VwaWEpXCJdLmpvaW4oXCIgXCIpLFxuICBcIi0tY2hha3JhLWJhY2tkcm9wLWJsdXJcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtYmFja2Ryb3AtYnJpZ2h0bmVzc1wiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1iYWNrZHJvcC1jb250cmFzdFwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1iYWNrZHJvcC1ncmF5c2NhbGVcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtYmFja2Ryb3AtaHVlLXJvdGF0ZVwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1iYWNrZHJvcC1pbnZlcnRcIjogXCJ2YXIoLS1jaGFrcmEtZW1wdHksLyohKi8gLyohKi8pXCIsXG4gIFwiLS1jaGFrcmEtYmFja2Ryb3Atb3BhY2l0eVwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1iYWNrZHJvcC1zYXR1cmF0ZVwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIixcbiAgXCItLWNoYWtyYS1iYWNrZHJvcC1zZXBpYVwiOiBcInZhcigtLWNoYWtyYS1lbXB0eSwvKiEqLyAvKiEqLylcIlxufTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRSaW5nVGVtcGxhdGUodmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBcIi0tY2hha3JhLXJpbmctb2Zmc2V0LXNoYWRvd1wiOiBcInZhcigtLWNoYWtyYS1yaW5nLWluc2V0KSAwIDAgMCB2YXIoLS1jaGFrcmEtcmluZy1vZmZzZXQtd2lkdGgpIHZhcigtLWNoYWtyYS1yaW5nLW9mZnNldC1jb2xvcilcIixcbiAgICBcIi0tY2hha3JhLXJpbmctc2hhZG93XCI6IFwidmFyKC0tY2hha3JhLXJpbmctaW5zZXQpIDAgMCAwIGNhbGModmFyKC0tY2hha3JhLXJpbmctd2lkdGgpICsgdmFyKC0tY2hha3JhLXJpbmctb2Zmc2V0LXdpZHRoKSkgdmFyKC0tY2hha3JhLXJpbmctY29sb3IpXCIsXG4gICAgXCItLWNoYWtyYS1yaW5nLXdpZHRoXCI6IHZhbHVlLFxuICAgIGJveFNoYWRvdzogW1widmFyKC0tY2hha3JhLXJpbmctb2Zmc2V0LXNoYWRvdylcIiwgXCJ2YXIoLS1jaGFrcmEtcmluZy1zaGFkb3cpXCIsIFwidmFyKC0tY2hha3JhLXNoYWRvdywgMCAwICMwMDAwKVwiXS5qb2luKFwiLCBcIilcbiAgfTtcbn1cbmV4cG9ydCB2YXIgZmxleERpcmVjdGlvblRlbXBsYXRlID0ge1xuICBcInJvdy1yZXZlcnNlXCI6IHtcbiAgICBzcGFjZTogXCItLWNoYWtyYS1zcGFjZS14LXJldmVyc2VcIixcbiAgICBkaXZpZGU6IFwiLS1jaGFrcmEtZGl2aWRlLXgtcmV2ZXJzZVwiXG4gIH0sXG4gIFwiY29sdW1uLXJldmVyc2VcIjoge1xuICAgIHNwYWNlOiBcIi0tY2hha3JhLXNwYWNlLXktcmV2ZXJzZVwiLFxuICAgIGRpdmlkZTogXCItLWNoYWtyYS1kaXZpZGUteS1yZXZlcnNlXCJcbiAgfVxufTtcbnZhciBvd2xTZWxlY3RvciA9IFwiJiA+IDpub3Qoc3R5bGUpIH4gOm5vdChzdHlsZSlcIjtcbmV4cG9ydCB2YXIgc3BhY2VYVGVtcGxhdGUgPSB7XG4gIFtvd2xTZWxlY3Rvcl06IHtcbiAgICBtYXJnaW5JbmxpbmVTdGFydDogXCJjYWxjKHZhcigtLWNoYWtyYS1zcGFjZS14KSAqIGNhbGMoMSAtIHZhcigtLWNoYWtyYS1zcGFjZS14LXJldmVyc2UpKSlcIixcbiAgICBtYXJnaW5JbmxpbmVFbmQ6IFwiY2FsYyh2YXIoLS1jaGFrcmEtc3BhY2UteCkgKiB2YXIoLS1jaGFrcmEtc3BhY2UteC1yZXZlcnNlKSlcIlxuICB9XG59O1xuZXhwb3J0IHZhciBzcGFjZVlUZW1wbGF0ZSA9IHtcbiAgW293bFNlbGVjdG9yXToge1xuICAgIG1hcmdpblRvcDogXCJjYWxjKHZhcigtLWNoYWtyYS1zcGFjZS15KSAqIGNhbGMoMSAtIHZhcigtLWNoYWtyYS1zcGFjZS15LXJldmVyc2UpKSlcIixcbiAgICBtYXJnaW5Cb3R0b206IFwiY2FsYyh2YXIoLS1jaGFrcmEtc3BhY2UteSkgKiB2YXIoLS1jaGFrcmEtc3BhY2UteS1yZXZlcnNlKSlcIlxuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGVtcGxhdGVzLmpzLm1hcCIsImZ1bmN0aW9uIF93cmFwUmVnRXhwKHJlLCBncm91cHMpIHsgX3dyYXBSZWdFeHAgPSBmdW5jdGlvbiBfd3JhcFJlZ0V4cChyZSwgZ3JvdXBzKSB7IHJldHVybiBuZXcgQmFiZWxSZWdFeHAocmUsIHVuZGVmaW5lZCwgZ3JvdXBzKTsgfTsgdmFyIF9SZWdFeHAgPSBfd3JhcE5hdGl2ZVN1cGVyKFJlZ0V4cCk7IHZhciBfc3VwZXIgPSBSZWdFeHAucHJvdG90eXBlOyB2YXIgX2dyb3VwcyA9IG5ldyBXZWFrTWFwKCk7IGZ1bmN0aW9uIEJhYmVsUmVnRXhwKHJlLCBmbGFncywgZ3JvdXBzKSB7IHZhciBfdGhpcyA9IF9SZWdFeHAuY2FsbCh0aGlzLCByZSwgZmxhZ3MpOyBfZ3JvdXBzLnNldChfdGhpcywgZ3JvdXBzIHx8IF9ncm91cHMuZ2V0KHJlKSk7IHJldHVybiBfdGhpczsgfSBfaW5oZXJpdHMoQmFiZWxSZWdFeHAsIF9SZWdFeHApOyBCYWJlbFJlZ0V4cC5wcm90b3R5cGUuZXhlYyA9IGZ1bmN0aW9uIChzdHIpIHsgdmFyIHJlc3VsdCA9IF9zdXBlci5leGVjLmNhbGwodGhpcywgc3RyKTsgaWYgKHJlc3VsdCkgcmVzdWx0Lmdyb3VwcyA9IGJ1aWxkR3JvdXBzKHJlc3VsdCwgdGhpcyk7IHJldHVybiByZXN1bHQ7IH07IEJhYmVsUmVnRXhwLnByb3RvdHlwZVtTeW1ib2wucmVwbGFjZV0gPSBmdW5jdGlvbiAoc3RyLCBzdWJzdGl0dXRpb24pIHsgaWYgKHR5cGVvZiBzdWJzdGl0dXRpb24gPT09IFwic3RyaW5nXCIpIHsgdmFyIGdyb3VwcyA9IF9ncm91cHMuZ2V0KHRoaXMpOyByZXR1cm4gX3N1cGVyW1N5bWJvbC5yZXBsYWNlXS5jYWxsKHRoaXMsIHN0ciwgc3Vic3RpdHV0aW9uLnJlcGxhY2UoL1xcJDwoW14+XSspPi9nLCBmdW5jdGlvbiAoXywgbmFtZSkgeyByZXR1cm4gXCIkXCIgKyBncm91cHNbbmFtZV07IH0pKTsgfSBlbHNlIGlmICh0eXBlb2Ygc3Vic3RpdHV0aW9uID09PSBcImZ1bmN0aW9uXCIpIHsgdmFyIF90aGlzID0gdGhpczsgcmV0dXJuIF9zdXBlcltTeW1ib2wucmVwbGFjZV0uY2FsbCh0aGlzLCBzdHIsIGZ1bmN0aW9uICgpIHsgdmFyIGFyZ3MgPSBbXTsgYXJncy5wdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7IGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdICE9PSBcIm9iamVjdFwiKSB7IGFyZ3MucHVzaChidWlsZEdyb3VwcyhhcmdzLCBfdGhpcykpOyB9IHJldHVybiBzdWJzdGl0dXRpb24uYXBwbHkodGhpcywgYXJncyk7IH0pOyB9IGVsc2UgeyByZXR1cm4gX3N1cGVyW1N5bWJvbC5yZXBsYWNlXS5jYWxsKHRoaXMsIHN0ciwgc3Vic3RpdHV0aW9uKTsgfSB9OyBmdW5jdGlvbiBidWlsZEdyb3VwcyhyZXN1bHQsIHJlKSB7IHZhciBnID0gX2dyb3Vwcy5nZXQocmUpOyByZXR1cm4gT2JqZWN0LmtleXMoZykucmVkdWNlKGZ1bmN0aW9uIChncm91cHMsIG5hbWUpIHsgZ3JvdXBzW25hbWVdID0gcmVzdWx0W2dbbmFtZV1dOyByZXR1cm4gZ3JvdXBzOyB9LCBPYmplY3QuY3JlYXRlKG51bGwpKTsgfSByZXR1cm4gX3dyYXBSZWdFeHAuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyB2YXIgX2NhY2hlID0gdHlwZW9mIE1hcCA9PT0gXCJmdW5jdGlvblwiID8gbmV3IE1hcCgpIDogdW5kZWZpbmVkOyBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyBpZiAoQ2xhc3MgPT09IG51bGwgfHwgIV9pc05hdGl2ZUZ1bmN0aW9uKENsYXNzKSkgcmV0dXJuIENsYXNzOyBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IGlmICh0eXBlb2YgX2NhY2hlICE9PSBcInVuZGVmaW5lZFwiKSB7IGlmIChfY2FjaGUuaGFzKENsYXNzKSkgcmV0dXJuIF9jYWNoZS5nZXQoQ2xhc3MpOyBfY2FjaGUuc2V0KENsYXNzLCBXcmFwcGVyKTsgfSBmdW5jdGlvbiBXcmFwcGVyKCkgeyByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpOyB9IFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IFdyYXBwZXIsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpOyB9OyByZXR1cm4gX3dyYXBOYXRpdmVTdXBlcihDbGFzcyk7IH1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7IGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHsgX2NvbnN0cnVjdCA9IFJlZmxlY3QuY29uc3RydWN0OyB9IGVsc2UgeyBfY29uc3RydWN0ID0gZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7IHZhciBhID0gW251bGxdOyBhLnB1c2guYXBwbHkoYSwgYXJncyk7IHZhciBDb25zdHJ1Y3RvciA9IEZ1bmN0aW9uLmJpbmQuYXBwbHkoUGFyZW50LCBhKTsgdmFyIGluc3RhbmNlID0gbmV3IENvbnN0cnVjdG9yKCk7IGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpOyByZXR1cm4gaW5zdGFuY2U7IH07IH0gcmV0dXJuIF9jb25zdHJ1Y3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7IHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgZGlyZWN0aW9uTWFwID0ge1xuICBcInRvLXRcIjogXCJ0byB0b3BcIixcbiAgXCJ0by10clwiOiBcInRvIHRvcCByaWdodFwiLFxuICBcInRvLXJcIjogXCJ0byByaWdodFwiLFxuICBcInRvLWJyXCI6IFwidG8gYm90dG9tIHJpZ2h0XCIsXG4gIFwidG8tYlwiOiBcInRvIGJvdHRvbVwiLFxuICBcInRvLWJsXCI6IFwidG8gYm90dG9tIGxlZnRcIixcbiAgXCJ0by1sXCI6IFwidG8gbGVmdFwiLFxuICBcInRvLXRsXCI6IFwidG8gdG9wIGxlZnRcIlxufTtcbnZhciB2YWx1ZVNldCA9IG5ldyBTZXQoT2JqZWN0LnZhbHVlcyhkaXJlY3Rpb25NYXApKTtcbmV4cG9ydCB2YXIgZ2xvYmFsU2V0ID0gbmV3IFNldChbXCJub25lXCIsIFwiLW1vei1pbml0aWFsXCIsIFwiaW5oZXJpdFwiLCBcImluaXRpYWxcIiwgXCJyZXZlcnRcIiwgXCJ1bnNldFwiXSk7XG5cbnZhciB0cmltU3BhY2UgPSBzdHIgPT4gc3RyLnRyaW0oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR3JhZGllbnQodmFsdWUsIHRoZW1lKSB7XG4gIHZhciBfcmVnZXgkZXhlYyRncm91cHMsIF9yZWdleCRleGVjO1xuXG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IGdsb2JhbFNldC5oYXModmFsdWUpKSByZXR1cm4gdmFsdWU7XG5cbiAgdmFyIHJlZ2V4ID0gLyojX19QVVJFX18qL193cmFwUmVnRXhwKC8oXltcXHgyREEtWmEtel0rKVxcKCgoLiopKVxcKS9nLCB7XG4gICAgdHlwZTogMSxcbiAgICB2YWx1ZXM6IDJcbiAgfSk7XG5cbiAgdmFyIHtcbiAgICB0eXBlLFxuICAgIHZhbHVlc1xuICB9ID0gKF9yZWdleCRleGVjJGdyb3VwcyA9IChfcmVnZXgkZXhlYyA9IHJlZ2V4LmV4ZWModmFsdWUpKSA9PSBudWxsID8gdm9pZCAwIDogX3JlZ2V4JGV4ZWMuZ3JvdXBzKSAhPSBudWxsID8gX3JlZ2V4JGV4ZWMkZ3JvdXBzIDoge307XG4gIGlmICghdHlwZSB8fCAhdmFsdWVzKSByZXR1cm4gdmFsdWU7XG5cbiAgdmFyIF90eXBlID0gdHlwZS5pbmNsdWRlcyhcIi1ncmFkaWVudFwiKSA/IHR5cGUgOiB0eXBlICsgXCItZ3JhZGllbnRcIjtcblxuICB2YXIgW21heWJlRGlyZWN0aW9uLCAuLi5zdG9wc10gPSB2YWx1ZXMuc3BsaXQoXCIsXCIpLm1hcCh0cmltU3BhY2UpLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKChzdG9wcyA9PSBudWxsID8gdm9pZCAwIDogc3RvcHMubGVuZ3RoKSA9PT0gMCkgcmV0dXJuIHZhbHVlO1xuICB2YXIgZGlyZWN0aW9uID0gbWF5YmVEaXJlY3Rpb24gaW4gZGlyZWN0aW9uTWFwID8gZGlyZWN0aW9uTWFwW21heWJlRGlyZWN0aW9uXSA6IG1heWJlRGlyZWN0aW9uO1xuICBzdG9wcy51bnNoaWZ0KGRpcmVjdGlvbik7XG5cbiAgdmFyIF92YWx1ZXMgPSBzdG9wcy5tYXAoc3RvcCA9PiB7XG4gICAgLy8gaWYgc3RvcCBpcyB2YWxpZCBzaG9ydGhhbmQgZGlyZWN0aW9uLCByZXR1cm4gaXRcbiAgICBpZiAodmFsdWVTZXQuaGFzKHN0b3ApKSByZXR1cm4gc3RvcDsgLy8gY29sb3Igc3RvcCBjb3VsZCBiZSBgcmVkLjIwMCAyMCVgIGJhc2VkIG9uIGNzcyBncmFkaWVudCBzcGVjXG5cbiAgICB2YXIgW19jb2xvciwgX3N0b3BdID0gc3RvcC5zcGxpdChcIiBcIik7IC8vIGVsc2UsIGdldCBhbmQgdHJhbnNmb3JtIHRoZSBjb2xvciB0b2tlbiBvciBjc3MgdmFsdWVcblxuICAgIHZhciBrZXkgPSBcImNvbG9ycy5cIiArIF9jb2xvcjtcbiAgICB2YXIgY29sb3IgPSBrZXkgaW4gdGhlbWUuX19jc3NNYXAgPyB0aGVtZS5fX2Nzc01hcFtrZXldLnZhclJlZiA6IF9jb2xvcjtcbiAgICByZXR1cm4gX3N0b3AgPyBbY29sb3IsIF9zdG9wXS5qb2luKFwiIFwiKSA6IGNvbG9yO1xuICB9KTtcblxuICByZXR1cm4gX3R5cGUgKyBcIihcIiArIF92YWx1ZXMuam9pbihcIiwgXCIpICsgXCIpXCI7XG59XG5leHBvcnQgdmFyIGdyYWRpZW50VHJhbnNmb3JtID0gKHZhbHVlLCB0aGVtZSkgPT4gcGFyc2VHcmFkaWVudCh2YWx1ZSwgdGhlbWUgIT0gbnVsbCA/IHRoZW1lIDoge30pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtZ3JhZGllbnQuanMubWFwIiwiaW1wb3J0IHsgaXNDc3NWYXIsIGlzTnVtYmVyLCBpc1N0cmluZyB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5pbXBvcnQgeyBiYWNrZHJvcEZpbHRlclRlbXBsYXRlLCBmaWx0ZXJUZW1wbGF0ZSwgZ2V0UmluZ1RlbXBsYXRlLCBnZXRUcmFuc2Zvcm1HcHVUZW1wbGF0ZSwgZ2V0VHJhbnNmb3JtVGVtcGxhdGUsIGZsZXhEaXJlY3Rpb25UZW1wbGF0ZSB9IGZyb20gXCIuL3RlbXBsYXRlc1wiO1xuaW1wb3J0IHsgZ3JhZGllbnRUcmFuc2Zvcm0sIGdsb2JhbFNldCB9IGZyb20gXCIuL3BhcnNlLWdyYWRpZW50XCI7XG5cbnZhciBhbmFseXplQ1NTVmFsdWUgPSB2YWx1ZSA9PiB7XG4gIHZhciBudW0gPSBwYXJzZUZsb2F0KHZhbHVlLnRvU3RyaW5nKCkpO1xuICB2YXIgdW5pdCA9IHZhbHVlLnRvU3RyaW5nKCkucmVwbGFjZShTdHJpbmcobnVtKSwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgdW5pdGxlc3M6ICF1bml0LFxuICAgIHZhbHVlOiBudW0sXG4gICAgdW5pdFxuICB9O1xufTtcblxudmFyIHdyYXAgPSBzdHIgPT4gdmFsdWUgPT4gc3RyICsgXCIoXCIgKyB2YWx1ZSArIFwiKVwiO1xuXG5leHBvcnQgdmFyIHRyYW5zZm9ybUZ1bmN0aW9ucyA9IHtcbiAgZmlsdGVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBcImF1dG9cIiA/IHZhbHVlIDogZmlsdGVyVGVtcGxhdGU7XG4gIH0sXG5cbiAgYmFja2Ryb3BGaWx0ZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IFwiYXV0b1wiID8gdmFsdWUgOiBiYWNrZHJvcEZpbHRlclRlbXBsYXRlO1xuICB9LFxuXG4gIHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gZ2V0UmluZ1RlbXBsYXRlKHRyYW5zZm9ybUZ1bmN0aW9ucy5weCh2YWx1ZSkpO1xuICB9LFxuXG4gIGJnQ2xpcCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gXCJ0ZXh0XCIgPyB7XG4gICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgYmFja2dyb3VuZENsaXA6IFwidGV4dFwiXG4gICAgfSA6IHtcbiAgICAgIGJhY2tncm91bmRDbGlwOiB2YWx1ZVxuICAgIH07XG4gIH0sXG5cbiAgdHJhbnNmb3JtKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBcImF1dG9cIikgcmV0dXJuIGdldFRyYW5zZm9ybVRlbXBsYXRlKCk7XG4gICAgaWYgKHZhbHVlID09PSBcImF1dG8tZ3B1XCIpIHJldHVybiBnZXRUcmFuc2Zvcm1HcHVUZW1wbGF0ZSgpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSxcblxuICBweCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdmFsdWU7XG4gICAgdmFyIHtcbiAgICAgIHVuaXRsZXNzXG4gICAgfSA9IGFuYWx5emVDU1NWYWx1ZSh2YWx1ZSk7XG4gICAgcmV0dXJuIHVuaXRsZXNzIHx8IGlzTnVtYmVyKHZhbHVlKSA/IHZhbHVlICsgXCJweFwiIDogdmFsdWU7XG4gIH0sXG5cbiAgZnJhY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gIWlzTnVtYmVyKHZhbHVlKSB8fCB2YWx1ZSA+IDEgPyB2YWx1ZSA6IHZhbHVlICogMTAwICsgXCIlXCI7XG4gIH0sXG5cbiAgZmxvYXQodmFsdWUsIHRoZW1lKSB7XG4gICAgdmFyIG1hcCA9IHtcbiAgICAgIGxlZnQ6IFwicmlnaHRcIixcbiAgICAgIHJpZ2h0OiBcImxlZnRcIlxuICAgIH07XG4gICAgcmV0dXJuIHRoZW1lLmRpcmVjdGlvbiA9PT0gXCJydGxcIiA/IG1hcFt2YWx1ZV0gOiB2YWx1ZTtcbiAgfSxcblxuICBkZWdyZWUodmFsdWUpIHtcbiAgICBpZiAoaXNDc3NWYXIodmFsdWUpIHx8IHZhbHVlID09IG51bGwpIHJldHVybiB2YWx1ZTtcbiAgICB2YXIgdW5pdGxlc3MgPSBpc1N0cmluZyh2YWx1ZSkgJiYgIXZhbHVlLmVuZHNXaXRoKFwiZGVnXCIpO1xuICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgfHwgdW5pdGxlc3MgPyB2YWx1ZSArIFwiZGVnXCIgOiB2YWx1ZTtcbiAgfSxcblxuICBncmFkaWVudDogZ3JhZGllbnRUcmFuc2Zvcm0sXG4gIGJsdXI6IHdyYXAoXCJibHVyXCIpLFxuICBvcGFjaXR5OiB3cmFwKFwib3BhY2l0eVwiKSxcbiAgYnJpZ2h0bmVzczogd3JhcChcImJyaWdodG5lc3NcIiksXG4gIGNvbnRyYXN0OiB3cmFwKFwiY29udHJhc3RcIiksXG4gIGRyb3BTaGFkb3c6IHdyYXAoXCJkcm9wLXNoYWRvd1wiKSxcbiAgZ3JheXNjYWxlOiB3cmFwKFwiZ3JheXNjYWxlXCIpLFxuICBodWVSb3RhdGU6IHdyYXAoXCJodWUtcm90YXRlXCIpLFxuICBpbnZlcnQ6IHdyYXAoXCJpbnZlcnRcIiksXG4gIHNhdHVyYXRlOiB3cmFwKFwic2F0dXJhdGVcIiksXG4gIHNlcGlhOiB3cmFwKFwic2VwaWFcIiksXG5cbiAgYmdJbWFnZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdmFsdWU7XG4gICAgdmFyIHByZXZlbnQgPSBpc0NTU0Z1bmN0aW9uKHZhbHVlKSB8fCBnbG9iYWxTZXQuaGFzKHZhbHVlKTtcbiAgICByZXR1cm4gIXByZXZlbnQgPyBcInVybChcIiArIHZhbHVlICsgXCIpXCIgOiB2YWx1ZTtcbiAgfSxcblxuICBvdXRsaW5lKHZhbHVlKSB7XG4gICAgdmFyIGlzTm9uZU9yWmVybyA9IFN0cmluZyh2YWx1ZSkgPT09IFwiMFwiIHx8IFN0cmluZyh2YWx1ZSkgPT09IFwibm9uZVwiO1xuICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiBpc05vbmVPclplcm8gPyB7XG4gICAgICBvdXRsaW5lOiBcIjJweCBzb2xpZCB0cmFuc3BhcmVudFwiLFxuICAgICAgb3V0bGluZU9mZnNldDogXCIycHhcIlxuICAgIH0gOiB7XG4gICAgICBvdXRsaW5lOiB2YWx1ZVxuICAgIH07XG4gIH0sXG5cbiAgZmxleERpcmVjdGlvbih2YWx1ZSkge1xuICAgIHZhciBfZmxleERpcmVjdGlvblRlbXBsYXQ7XG5cbiAgICB2YXIge1xuICAgICAgc3BhY2UsXG4gICAgICBkaXZpZGVcbiAgICB9ID0gKF9mbGV4RGlyZWN0aW9uVGVtcGxhdCA9IGZsZXhEaXJlY3Rpb25UZW1wbGF0ZVt2YWx1ZV0pICE9IG51bGwgPyBfZmxleERpcmVjdGlvblRlbXBsYXQgOiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgZmxleERpcmVjdGlvbjogdmFsdWVcbiAgICB9O1xuICAgIGlmIChzcGFjZSkgcmVzdWx0W3NwYWNlXSA9IDE7XG4gICAgaWYgKGRpdmlkZSkgcmVzdWx0W2RpdmlkZV0gPSAxO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxufTtcblxudmFyIGlzQ1NTRnVuY3Rpb24gPSB2YWx1ZSA9PiB7XG4gIHJldHVybiBpc1N0cmluZyh2YWx1ZSkgJiYgdmFsdWUuaW5jbHVkZXMoXCIoXCIpICYmIHZhbHVlLmluY2x1ZGVzKFwiKVwiKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFuc2Zvcm0tZnVuY3Rpb25zLmpzLm1hcCIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCB7IGNyZWF0ZVRyYW5zZm9ybSB9IGZyb20gXCIuL2NyZWF0ZS10cmFuc2Zvcm1cIjtcbmltcG9ydCB7IGxvZ2ljYWwsIHRvQ29uZmlnIH0gZnJvbSBcIi4vcHJvcC1jb25maWdcIjtcbmltcG9ydCB7IHRyYW5zZm9ybUZ1bmN0aW9ucyBhcyB0cmFuc2Zvcm1zIH0gZnJvbSBcIi4vdHJhbnNmb3JtLWZ1bmN0aW9uc1wiO1xuZXhwb3J0IHsgdHJhbnNmb3JtcyB9O1xuZXhwb3J0ICogZnJvbSBcIi4vdHlwZXNcIjtcbmV4cG9ydCB2YXIgdCA9IHtcbiAgYm9yZGVyV2lkdGhzOiB0b0NvbmZpZyhcImJvcmRlcldpZHRoc1wiKSxcbiAgYm9yZGVyU3R5bGVzOiB0b0NvbmZpZyhcImJvcmRlclN0eWxlc1wiKSxcbiAgY29sb3JzOiB0b0NvbmZpZyhcImNvbG9yc1wiKSxcbiAgYm9yZGVyczogdG9Db25maWcoXCJib3JkZXJzXCIpLFxuICByYWRpaTogdG9Db25maWcoXCJyYWRpaVwiLCB0cmFuc2Zvcm1zLnB4KSxcbiAgc3BhY2U6IHRvQ29uZmlnKFwic3BhY2VcIiwgdHJhbnNmb3Jtcy5weCksXG4gIHNwYWNlVDogdG9Db25maWcoXCJzcGFjZVwiLCB0cmFuc2Zvcm1zLnB4KSxcblxuICBkZWdyZWVUKHByb3BlcnR5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3BlcnR5LFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1zLmRlZ3JlZVxuICAgIH07XG4gIH0sXG5cbiAgcHJvcChwcm9wZXJ0eSwgc2NhbGUsIHRyYW5zZm9ybSkge1xuICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICBwcm9wZXJ0eSxcbiAgICAgIHNjYWxlXG4gICAgfSwgc2NhbGUgJiYge1xuICAgICAgdHJhbnNmb3JtOiBjcmVhdGVUcmFuc2Zvcm0oe1xuICAgICAgICBzY2FsZSxcbiAgICAgICAgdHJhbnNmb3JtXG4gICAgICB9KVxuICAgIH0pO1xuICB9LFxuXG4gIHByb3BUKHByb3BlcnR5LCB0cmFuc2Zvcm0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvcGVydHksXG4gICAgICB0cmFuc2Zvcm1cbiAgICB9O1xuICB9LFxuXG4gIHNpemVzOiB0b0NvbmZpZyhcInNpemVzXCIsIHRyYW5zZm9ybXMucHgpLFxuICBzaXplc1Q6IHRvQ29uZmlnKFwic2l6ZXNcIiwgdHJhbnNmb3Jtcy5mcmFjdGlvbiksXG4gIHNoYWRvd3M6IHRvQ29uZmlnKFwic2hhZG93c1wiKSxcbiAgbG9naWNhbCxcbiAgYmx1cjogdG9Db25maWcoXCJibHVyXCIsIHRyYW5zZm9ybXMuYmx1cilcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJpbXBvcnQgeyB0LCB0cmFuc2Zvcm1zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGJhY2tncm91bmQgPSB7XG4gIGJhY2tncm91bmQ6IHQuY29sb3JzKFwiYmFja2dyb3VuZFwiKSxcbiAgYmFja2dyb3VuZENvbG9yOiB0LmNvbG9ycyhcImJhY2tncm91bmRDb2xvclwiKSxcbiAgYmFja2dyb3VuZEltYWdlOiB0LnByb3BUKFwiYmFja2dyb3VuZEltYWdlXCIsIHRyYW5zZm9ybXMuYmdJbWFnZSksXG4gIGJhY2tncm91bmRTaXplOiB0cnVlLFxuICBiYWNrZ3JvdW5kUG9zaXRpb246IHRydWUsXG4gIGJhY2tncm91bmRSZXBlYXQ6IHRydWUsXG4gIGJhY2tncm91bmRBdHRhY2htZW50OiB0cnVlLFxuICBiYWNrZ3JvdW5kQ2xpcDoge1xuICAgIHRyYW5zZm9ybTogdHJhbnNmb3Jtcy5iZ0NsaXBcbiAgfSxcbiAgYmdTaXplOiB0LnByb3AoXCJiYWNrZ3JvdW5kU2l6ZVwiKSxcbiAgYmdQb3NpdGlvbjogdC5wcm9wKFwiYmFja2dyb3VuZFBvc2l0aW9uXCIpLFxuICBiZzogdC5jb2xvcnMoXCJiYWNrZ3JvdW5kXCIpLFxuICBiZ0NvbG9yOiB0LmNvbG9ycyhcImJhY2tncm91bmRDb2xvclwiKSxcbiAgYmdQb3M6IHQucHJvcChcImJhY2tncm91bmRQb3NpdGlvblwiKSxcbiAgYmdSZXBlYXQ6IHQucHJvcChcImJhY2tncm91bmRSZXBlYXRcIiksXG4gIGJnQXR0YWNobWVudDogdC5wcm9wKFwiYmFja2dyb3VuZEF0dGFjaG1lbnRcIiksXG4gIGJnR3JhZGllbnQ6IHQucHJvcFQoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgdHJhbnNmb3Jtcy5ncmFkaWVudCksXG4gIGJnQ2xpcDoge1xuICAgIHRyYW5zZm9ybTogdHJhbnNmb3Jtcy5iZ0NsaXBcbiAgfVxufTtcbk9iamVjdC5hc3NpZ24oYmFja2dyb3VuZCwge1xuICBiZ0ltYWdlOiBiYWNrZ3JvdW5kLmJhY2tncm91bmRJbWFnZSxcbiAgYmdJbWc6IGJhY2tncm91bmQuYmFja2dyb3VuZEltYWdlXG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJhY2tncm91bmQuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBib3JkZXIgPSB7XG4gIGJvcmRlcjogdC5ib3JkZXJzKFwiYm9yZGVyXCIpLFxuICBib3JkZXJXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJXaWR0aFwiKSxcbiAgYm9yZGVyU3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyU3R5bGVcIiksXG4gIGJvcmRlckNvbG9yOiB0LmNvbG9ycyhcImJvcmRlckNvbG9yXCIpLFxuICBib3JkZXJSYWRpdXM6IHQucmFkaWkoXCJib3JkZXJSYWRpdXNcIiksXG4gIGJvcmRlclRvcDogdC5ib3JkZXJzKFwiYm9yZGVyVG9wXCIpLFxuICBib3JkZXJCbG9ja1N0YXJ0OiB0LmJvcmRlcnMoXCJib3JkZXJCbG9ja1N0YXJ0XCIpLFxuICBib3JkZXJUb3BMZWZ0UmFkaXVzOiB0LnJhZGlpKFwiYm9yZGVyVG9wTGVmdFJhZGl1c1wiKSxcbiAgYm9yZGVyU3RhcnRTdGFydFJhZGl1czogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJyYWRpaVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLFxuICAgICAgcnRsOiBcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCJcbiAgICB9XG4gIH0pLFxuICBib3JkZXJFbmRTdGFydFJhZGl1czogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJyYWRpaVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiLFxuICAgICAgcnRsOiBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCJcbiAgICB9XG4gIH0pLFxuICBib3JkZXJUb3BSaWdodFJhZGl1czogdC5yYWRpaShcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIpLFxuICBib3JkZXJTdGFydEVuZFJhZGl1czogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJyYWRpaVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIixcbiAgICAgIHJ0bDogXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCJcbiAgICB9XG4gIH0pLFxuICBib3JkZXJFbmRFbmRSYWRpdXM6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwicmFkaWlcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCIsXG4gICAgICBydGw6IFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiXG4gICAgfVxuICB9KSxcbiAgYm9yZGVyUmlnaHQ6IHQuYm9yZGVycyhcImJvcmRlclJpZ2h0XCIpLFxuICBib3JkZXJJbmxpbmVFbmQ6IHQuYm9yZGVycyhcImJvcmRlcklubGluZUVuZFwiKSxcbiAgYm9yZGVyQm90dG9tOiB0LmJvcmRlcnMoXCJib3JkZXJCb3R0b21cIiksXG4gIGJvcmRlckJsb2NrRW5kOiB0LmJvcmRlcnMoXCJib3JkZXJCbG9ja0VuZFwiKSxcbiAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogdC5yYWRpaShcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIiksXG4gIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiB0LnJhZGlpKFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIiksXG4gIGJvcmRlckxlZnQ6IHQuYm9yZGVycyhcImJvcmRlckxlZnRcIiksXG4gIGJvcmRlcklubGluZVN0YXJ0OiB7XG4gICAgcHJvcGVydHk6IFwiYm9yZGVySW5saW5lU3RhcnRcIixcbiAgICBzY2FsZTogXCJib3JkZXJzXCJcbiAgfSxcbiAgYm9yZGVySW5saW5lU3RhcnRSYWRpdXM6IHQubG9naWNhbCh7XG4gICAgc2NhbGU6IFwicmFkaWlcIixcbiAgICBwcm9wZXJ0eToge1xuICAgICAgbHRyOiBbXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiXSxcbiAgICAgIHJ0bDogW1wiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiXVxuICAgIH1cbiAgfSksXG4gIGJvcmRlcklubGluZUVuZFJhZGl1czogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJyYWRpaVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFtcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsIFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIl0sXG4gICAgICBydGw6IFtcImJvcmRlclRvcExlZnRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJdXG4gICAgfVxuICB9KSxcbiAgYm9yZGVyWDogdC5ib3JkZXJzKFtcImJvcmRlckxlZnRcIiwgXCJib3JkZXJSaWdodFwiXSksXG4gIGJvcmRlcklubGluZTogdC5ib3JkZXJzKFwiYm9yZGVySW5saW5lXCIpLFxuICBib3JkZXJZOiB0LmJvcmRlcnMoW1wiYm9yZGVyVG9wXCIsIFwiYm9yZGVyQm90dG9tXCJdKSxcbiAgYm9yZGVyQmxvY2s6IHQuYm9yZGVycyhcImJvcmRlckJsb2NrXCIpLFxuICBib3JkZXJUb3BXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJUb3BXaWR0aFwiKSxcbiAgYm9yZGVyQmxvY2tTdGFydFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlckJsb2NrU3RhcnRXaWR0aFwiKSxcbiAgYm9yZGVyVG9wQ29sb3I6IHQuY29sb3JzKFwiYm9yZGVyVG9wQ29sb3JcIiksXG4gIGJvcmRlckJsb2NrU3RhcnRDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJCbG9ja1N0YXJ0Q29sb3JcIiksXG4gIGJvcmRlclRvcFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlclRvcFN0eWxlXCIpLFxuICBib3JkZXJCbG9ja1N0YXJ0U3R5bGU6IHQuYm9yZGVyU3R5bGVzKFwiYm9yZGVyQmxvY2tTdGFydFN0eWxlXCIpLFxuICBib3JkZXJCb3R0b21XaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJCb3R0b21XaWR0aFwiKSxcbiAgYm9yZGVyQmxvY2tFbmRXaWR0aDogdC5ib3JkZXJXaWR0aHMoXCJib3JkZXJCbG9ja0VuZFdpZHRoXCIpLFxuICBib3JkZXJCb3R0b21Db2xvcjogdC5jb2xvcnMoXCJib3JkZXJCb3R0b21Db2xvclwiKSxcbiAgYm9yZGVyQmxvY2tFbmRDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJCbG9ja0VuZENvbG9yXCIpLFxuICBib3JkZXJCb3R0b21TdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJCb3R0b21TdHlsZVwiKSxcbiAgYm9yZGVyQmxvY2tFbmRTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJCbG9ja0VuZFN0eWxlXCIpLFxuICBib3JkZXJMZWZ0V2lkdGg6IHQuYm9yZGVyV2lkdGhzKFwiYm9yZGVyTGVmdFdpZHRoXCIpLFxuICBib3JkZXJJbmxpbmVTdGFydFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlcklubGluZVN0YXJ0V2lkdGhcIiksXG4gIGJvcmRlckxlZnRDb2xvcjogdC5jb2xvcnMoXCJib3JkZXJMZWZ0Q29sb3JcIiksXG4gIGJvcmRlcklubGluZVN0YXJ0Q29sb3I6IHQuY29sb3JzKFwiYm9yZGVySW5saW5lU3RhcnRDb2xvclwiKSxcbiAgYm9yZGVyTGVmdFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlckxlZnRTdHlsZVwiKSxcbiAgYm9yZGVySW5saW5lU3RhcnRTdHlsZTogdC5ib3JkZXJTdHlsZXMoXCJib3JkZXJJbmxpbmVTdGFydFN0eWxlXCIpLFxuICBib3JkZXJSaWdodFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlclJpZ2h0V2lkdGhcIiksXG4gIGJvcmRlcklubGluZUVuZFdpZHRoOiB0LmJvcmRlcldpZHRocyhcImJvcmRlcklubGluZUVuZFdpZHRoXCIpLFxuICBib3JkZXJSaWdodENvbG9yOiB0LmNvbG9ycyhcImJvcmRlclJpZ2h0Q29sb3JcIiksXG4gIGJvcmRlcklubGluZUVuZENvbG9yOiB0LmNvbG9ycyhcImJvcmRlcklubGluZUVuZENvbG9yXCIpLFxuICBib3JkZXJSaWdodFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlclJpZ2h0U3R5bGVcIiksXG4gIGJvcmRlcklubGluZUVuZFN0eWxlOiB0LmJvcmRlclN0eWxlcyhcImJvcmRlcklubGluZUVuZFN0eWxlXCIpLFxuICBib3JkZXJUb3BSYWRpdXM6IHQucmFkaWkoW1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLCBcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCJdKSxcbiAgYm9yZGVyQm90dG9tUmFkaXVzOiB0LnJhZGlpKFtcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIiwgXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiXSksXG4gIGJvcmRlckxlZnRSYWRpdXM6IHQucmFkaWkoW1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIl0pLFxuICBib3JkZXJSaWdodFJhZGl1czogdC5yYWRpaShbXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLCBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCJdKVxufTtcbk9iamVjdC5hc3NpZ24oYm9yZGVyLCB7XG4gIHJvdW5kZWQ6IGJvcmRlci5ib3JkZXJSYWRpdXMsXG4gIHJvdW5kZWRUb3A6IGJvcmRlci5ib3JkZXJUb3BSYWRpdXMsXG4gIHJvdW5kZWRUb3BMZWZ0OiBib3JkZXIuYm9yZGVyVG9wTGVmdFJhZGl1cyxcbiAgcm91bmRlZFRvcFJpZ2h0OiBib3JkZXIuYm9yZGVyVG9wUmlnaHRSYWRpdXMsXG4gIHJvdW5kZWRUb3BTdGFydDogYm9yZGVyLmJvcmRlclN0YXJ0U3RhcnRSYWRpdXMsXG4gIHJvdW5kZWRUb3BFbmQ6IGJvcmRlci5ib3JkZXJTdGFydEVuZFJhZGl1cyxcbiAgcm91bmRlZEJvdHRvbTogYm9yZGVyLmJvcmRlckJvdHRvbVJhZGl1cyxcbiAgcm91bmRlZEJvdHRvbUxlZnQ6IGJvcmRlci5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzLFxuICByb3VuZGVkQm90dG9tUmlnaHQ6IGJvcmRlci5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgcm91bmRlZEJvdHRvbVN0YXJ0OiBib3JkZXIuYm9yZGVyRW5kU3RhcnRSYWRpdXMsXG4gIHJvdW5kZWRCb3R0b21FbmQ6IGJvcmRlci5ib3JkZXJFbmRFbmRSYWRpdXMsXG4gIHJvdW5kZWRMZWZ0OiBib3JkZXIuYm9yZGVyTGVmdFJhZGl1cyxcbiAgcm91bmRlZFJpZ2h0OiBib3JkZXIuYm9yZGVyUmlnaHRSYWRpdXMsXG4gIHJvdW5kZWRTdGFydDogYm9yZGVyLmJvcmRlcklubGluZVN0YXJ0UmFkaXVzLFxuICByb3VuZGVkRW5kOiBib3JkZXIuYm9yZGVySW5saW5lRW5kUmFkaXVzLFxuICBib3JkZXJTdGFydDogYm9yZGVyLmJvcmRlcklubGluZVN0YXJ0LFxuICBib3JkZXJFbmQ6IGJvcmRlci5ib3JkZXJJbmxpbmVFbmQsXG4gIGJvcmRlclRvcFN0YXJ0UmFkaXVzOiBib3JkZXIuYm9yZGVyU3RhcnRTdGFydFJhZGl1cyxcbiAgYm9yZGVyVG9wRW5kUmFkaXVzOiBib3JkZXIuYm9yZGVyU3RhcnRFbmRSYWRpdXMsXG4gIGJvcmRlckJvdHRvbVN0YXJ0UmFkaXVzOiBib3JkZXIuYm9yZGVyRW5kU3RhcnRSYWRpdXMsXG4gIGJvcmRlckJvdHRvbUVuZFJhZGl1czogYm9yZGVyLmJvcmRlckVuZEVuZFJhZGl1cyxcbiAgYm9yZGVyU3RhcnRSYWRpdXM6IGJvcmRlci5ib3JkZXJJbmxpbmVTdGFydFJhZGl1cyxcbiAgYm9yZGVyRW5kUmFkaXVzOiBib3JkZXIuYm9yZGVySW5saW5lRW5kUmFkaXVzLFxuICBib3JkZXJTdGFydFdpZHRoOiBib3JkZXIuYm9yZGVySW5saW5lU3RhcnRXaWR0aCxcbiAgYm9yZGVyRW5kV2lkdGg6IGJvcmRlci5ib3JkZXJJbmxpbmVFbmRXaWR0aCxcbiAgYm9yZGVyU3RhcnRDb2xvcjogYm9yZGVyLmJvcmRlcklubGluZVN0YXJ0Q29sb3IsXG4gIGJvcmRlckVuZENvbG9yOiBib3JkZXIuYm9yZGVySW5saW5lRW5kQ29sb3IsXG4gIGJvcmRlclN0YXJ0U3R5bGU6IGJvcmRlci5ib3JkZXJJbmxpbmVTdGFydFN0eWxlLFxuICBib3JkZXJFbmRTdHlsZTogYm9yZGVyLmJvcmRlcklubGluZUVuZFN0eWxlXG59KTtcbi8qKlxuICogVGhlIHByb3AgdHlwZXMgZm9yIGJvcmRlciBwcm9wZXJ0aWVzIGxpc3RlZCBhYm92ZVxuICovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ib3JkZXIuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBjb2xvciA9IHtcbiAgY29sb3I6IHQuY29sb3JzKFwiY29sb3JcIiksXG4gIHRleHRDb2xvcjogdC5jb2xvcnMoXCJjb2xvclwiKSxcbiAgZmlsbDogdC5jb2xvcnMoXCJmaWxsXCIpLFxuICBzdHJva2U6IHQuY29sb3JzKFwic3Ryb2tlXCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sb3IuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBlZmZlY3QgPSB7XG4gIGJveFNoYWRvdzogdC5zaGFkb3dzKFwiYm94U2hhZG93XCIpLFxuICBtaXhCbGVuZE1vZGU6IHRydWUsXG4gIGJsZW5kTW9kZTogdC5wcm9wKFwibWl4QmxlbmRNb2RlXCIpLFxuICBiYWNrZ3JvdW5kQmxlbmRNb2RlOiB0cnVlLFxuICBiZ0JsZW5kTW9kZTogdC5wcm9wKFwiYmFja2dyb3VuZEJsZW5kTW9kZVwiKSxcbiAgb3BhY2l0eTogdHJ1ZVxufTtcbk9iamVjdC5hc3NpZ24oZWZmZWN0LCB7XG4gIHNoYWRvdzogZWZmZWN0LmJveFNoYWRvd1xufSk7XG4vKipcbiAqIFR5cGVzIGZvciBib3ggYW5kIHRleHQgc2hhZG93IHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZWZmZWN0LmpzLm1hcCIsImltcG9ydCB7IHQsIHRyYW5zZm9ybXMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgZmlsdGVyID0ge1xuICBmaWx0ZXI6IHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybXMuZmlsdGVyXG4gIH0sXG4gIGJsdXI6IHQuYmx1cihcIi0tY2hha3JhLWJsdXJcIiksXG4gIGJyaWdodG5lc3M6IHQucHJvcFQoXCItLWNoYWtyYS1icmlnaHRuZXNzXCIsIHRyYW5zZm9ybXMuYnJpZ2h0bmVzcyksXG4gIGNvbnRyYXN0OiB0LnByb3BUKFwiLS1jaGFrcmEtY29udHJhc3RcIiwgdHJhbnNmb3Jtcy5jb250cmFzdCksXG4gIGh1ZVJvdGF0ZTogdC5kZWdyZWVUKFwiLS1jaGFrcmEtaHVlLXJvdGF0ZVwiKSxcbiAgaW52ZXJ0OiB0LnByb3BUKFwiLS1jaGFrcmEtaW52ZXJ0XCIsIHRyYW5zZm9ybXMuaW52ZXJ0KSxcbiAgc2F0dXJhdGU6IHQucHJvcFQoXCItLWNoYWtyYS1zYXR1cmF0ZVwiLCB0cmFuc2Zvcm1zLnNhdHVyYXRlKSxcbiAgZHJvcFNoYWRvdzogdC5wcm9wVChcIi0tY2hha3JhLWRyb3Atc2hhZG93XCIsIHRyYW5zZm9ybXMuZHJvcFNoYWRvdyksXG4gIGJhY2tkcm9wRmlsdGVyOiB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1zLmJhY2tkcm9wRmlsdGVyXG4gIH0sXG4gIGJhY2tkcm9wQmx1cjogdC5ibHVyKFwiLS1jaGFrcmEtYmFja2Ryb3AtYmx1clwiKSxcbiAgYmFja2Ryb3BCcmlnaHRuZXNzOiB0LnByb3BUKFwiLS1jaGFrcmEtYmFja2Ryb3AtYnJpZ2h0bmVzc1wiLCB0cmFuc2Zvcm1zLmJyaWdodG5lc3MpLFxuICBiYWNrZHJvcENvbnRyYXN0OiB0LnByb3BUKFwiLS1jaGFrcmEtYmFja2Ryb3AtY29udHJhc3RcIiwgdHJhbnNmb3Jtcy5jb250cmFzdCksXG4gIGJhY2tkcm9wSHVlUm90YXRlOiB0LmRlZ3JlZVQoXCItLWNoYWtyYS1iYWNrZHJvcC1odWUtcm90YXRlXCIpLFxuICBiYWNrZHJvcEludmVydDogdC5wcm9wVChcIi0tY2hha3JhLWJhY2tkcm9wLWludmVydFwiLCB0cmFuc2Zvcm1zLmludmVydCksXG4gIGJhY2tkcm9wU2F0dXJhdGU6IHQucHJvcFQoXCItLWNoYWtyYS1iYWNrZHJvcC1zYXR1cmF0ZVwiLCB0cmFuc2Zvcm1zLnNhdHVyYXRlKVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJpbXBvcnQgeyB0LCB0cmFuc2Zvcm1zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBjcmVhdGVUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vdXRpbHMvY3JlYXRlLXRyYW5zZm9ybVwiO1xuaW1wb3J0IHsgc3BhY2VYVGVtcGxhdGUsIHNwYWNlWVRlbXBsYXRlIH0gZnJvbSBcIi4uL3V0aWxzL3RlbXBsYXRlc1wiO1xuZXhwb3J0IHZhciBmbGV4Ym94ID0ge1xuICBhbGlnbkl0ZW1zOiB0cnVlLFxuICBhbGlnbkNvbnRlbnQ6IHRydWUsXG4gIGp1c3RpZnlJdGVtczogdHJ1ZSxcbiAganVzdGlmeUNvbnRlbnQ6IHRydWUsXG4gIGZsZXhXcmFwOiB0cnVlLFxuICBmbGV4RGlyZWN0aW9uOiB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1zLmZsZXhEaXJlY3Rpb25cbiAgfSxcbiAgZXhwZXJpbWVudGFsX3NwYWNlWDoge1xuICAgIHN0YXRpYzogc3BhY2VYVGVtcGxhdGUsXG4gICAgdHJhbnNmb3JtOiBjcmVhdGVUcmFuc2Zvcm0oe1xuICAgICAgc2NhbGU6IFwic3BhY2VcIixcbiAgICAgIHRyYW5zZm9ybTogdmFsdWUgPT4gdmFsdWUgIT09IG51bGwgPyB7XG4gICAgICAgIFwiLS1jaGFrcmEtc3BhY2UteFwiOiB2YWx1ZVxuICAgICAgfSA6IG51bGxcbiAgICB9KVxuICB9LFxuICBleHBlcmltZW50YWxfc3BhY2VZOiB7XG4gICAgc3RhdGljOiBzcGFjZVlUZW1wbGF0ZSxcbiAgICB0cmFuc2Zvcm06IGNyZWF0ZVRyYW5zZm9ybSh7XG4gICAgICBzY2FsZTogXCJzcGFjZVwiLFxuICAgICAgdHJhbnNmb3JtOiB2YWx1ZSA9PiB2YWx1ZSAhPSBudWxsID8ge1xuICAgICAgICBcIi0tY2hha3JhLXNwYWNlLXlcIjogdmFsdWVcbiAgICAgIH0gOiBudWxsXG4gICAgfSlcbiAgfSxcbiAgZmxleDogdHJ1ZSxcbiAgZmxleEZsb3c6IHRydWUsXG4gIGZsZXhHcm93OiB0cnVlLFxuICBmbGV4U2hyaW5rOiB0cnVlLFxuICBmbGV4QmFzaXM6IHQuc2l6ZXMoXCJmbGV4QmFzaXNcIiksXG4gIGp1c3RpZnlTZWxmOiB0cnVlLFxuICBhbGlnblNlbGY6IHRydWUsXG4gIG9yZGVyOiB0cnVlLFxuICBwbGFjZUl0ZW1zOiB0cnVlLFxuICBwbGFjZUNvbnRlbnQ6IHRydWUsXG4gIHBsYWNlU2VsZjogdHJ1ZVxufTtcbk9iamVjdC5hc3NpZ24oZmxleGJveCwge1xuICBmbGV4RGlyOiBmbGV4Ym94LmZsZXhEaXJlY3Rpb25cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxleGJveC5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGdyaWQgPSB7XG4gIGdyaWRHYXA6IHQuc3BhY2UoXCJncmlkR2FwXCIpLFxuICBncmlkQ29sdW1uR2FwOiB0LnNwYWNlKFwiZ3JpZENvbHVtbkdhcFwiKSxcbiAgZ3JpZFJvd0dhcDogdC5zcGFjZShcImdyaWRSb3dHYXBcIiksXG4gIGdyaWRDb2x1bW46IHRydWUsXG4gIGdyaWRSb3c6IHRydWUsXG4gIGdyaWRBdXRvRmxvdzogdHJ1ZSxcbiAgZ3JpZEF1dG9Db2x1bW5zOiB0cnVlLFxuICBncmlkQ29sdW1uU3RhcnQ6IHRydWUsXG4gIGdyaWRDb2x1bW5FbmQ6IHRydWUsXG4gIGdyaWRSb3dTdGFydDogdHJ1ZSxcbiAgZ3JpZFJvd0VuZDogdHJ1ZSxcbiAgZ3JpZEF1dG9Sb3dzOiB0cnVlLFxuICBncmlkVGVtcGxhdGU6IHRydWUsXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IHRydWUsXG4gIGdyaWRUZW1wbGF0ZVJvd3M6IHRydWUsXG4gIGdyaWRUZW1wbGF0ZUFyZWFzOiB0cnVlLFxuICBncmlkQXJlYTogdHJ1ZVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdyaWQuanMubWFwIiwiaW1wb3J0IHsgdCwgdHJhbnNmb3JtcyB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciBpbnRlcmFjdGl2aXR5ID0ge1xuICBhcHBlYXJhbmNlOiB0cnVlLFxuICBjdXJzb3I6IHRydWUsXG4gIHJlc2l6ZTogdHJ1ZSxcbiAgdXNlclNlbGVjdDogdHJ1ZSxcbiAgcG9pbnRlckV2ZW50czogdHJ1ZSxcbiAgb3V0bGluZToge1xuICAgIHRyYW5zZm9ybTogdHJhbnNmb3Jtcy5vdXRsaW5lXG4gIH0sXG4gIG91dGxpbmVPZmZzZXQ6IHRydWUsXG4gIG91dGxpbmVDb2xvcjogdC5jb2xvcnMoXCJvdXRsaW5lQ29sb3JcIilcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcmFjdGl2aXR5LmpzLm1hcCIsImltcG9ydCB7IHQsIHRyYW5zZm9ybXMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgbGF5b3V0ID0ge1xuICB3aWR0aDogdC5zaXplc1QoXCJ3aWR0aFwiKSxcbiAgaW5saW5lU2l6ZTogdC5zaXplc1QoXCJpbmxpbmVTaXplXCIpLFxuICBoZWlnaHQ6IHQuc2l6ZXMoXCJoZWlnaHRcIiksXG4gIGJsb2NrU2l6ZTogdC5zaXplcyhcImJsb2NrU2l6ZVwiKSxcbiAgYm94U2l6ZTogdC5zaXplcyhbXCJ3aWR0aFwiLCBcImhlaWdodFwiXSksXG4gIG1pbldpZHRoOiB0LnNpemVzKFwibWluV2lkdGhcIiksXG4gIG1pbklubGluZVNpemU6IHQuc2l6ZXMoXCJtaW5JbmxpbmVTaXplXCIpLFxuICBtaW5IZWlnaHQ6IHQuc2l6ZXMoXCJtaW5IZWlnaHRcIiksXG4gIG1pbkJsb2NrU2l6ZTogdC5zaXplcyhcIm1pbkJsb2NrU2l6ZVwiKSxcbiAgbWF4V2lkdGg6IHQuc2l6ZXMoXCJtYXhXaWR0aFwiKSxcbiAgbWF4SW5saW5lU2l6ZTogdC5zaXplcyhcIm1heElubGluZVNpemVcIiksXG4gIG1heEhlaWdodDogdC5zaXplcyhcIm1heEhlaWdodFwiKSxcbiAgbWF4QmxvY2tTaXplOiB0LnNpemVzKFwibWF4QmxvY2tTaXplXCIpLFxuICBkOiB0LnByb3AoXCJkaXNwbGF5XCIpLFxuICBvdmVyZmxvdzogdHJ1ZSxcbiAgb3ZlcmZsb3dYOiB0cnVlLFxuICBvdmVyZmxvd1k6IHRydWUsXG4gIG92ZXJzY3JvbGxCZWhhdmlvcjogdHJ1ZSxcbiAgb3ZlcnNjcm9sbEJlaGF2aW9yWDogdHJ1ZSxcbiAgb3ZlcnNjcm9sbEJlaGF2aW9yWTogdHJ1ZSxcbiAgZGlzcGxheTogdHJ1ZSxcbiAgdmVydGljYWxBbGlnbjogdHJ1ZSxcbiAgYm94U2l6aW5nOiB0cnVlLFxuICBib3hEZWNvcmF0aW9uQnJlYWs6IHRydWUsXG4gIGZsb2F0OiB0LnByb3BUKFwiZmxvYXRcIiwgdHJhbnNmb3Jtcy5mbG9hdCksXG4gIG9iamVjdEZpdDogdHJ1ZSxcbiAgb2JqZWN0UG9zaXRpb246IHRydWUsXG4gIHZpc2liaWxpdHk6IHRydWUsXG4gIGlzb2xhdGlvbjogdHJ1ZVxufTtcbk9iamVjdC5hc3NpZ24obGF5b3V0LCB7XG4gIHc6IGxheW91dC53aWR0aCxcbiAgaDogbGF5b3V0LmhlaWdodCxcbiAgbWluVzogbGF5b3V0Lm1pbldpZHRoLFxuICBtYXhXOiBsYXlvdXQubWF4V2lkdGgsXG4gIG1pbkg6IGxheW91dC5taW5IZWlnaHQsXG4gIG1heEg6IGxheW91dC5tYXhIZWlnaHQsXG4gIG92ZXJzY3JvbGw6IGxheW91dC5vdmVyc2Nyb2xsQmVoYXZpb3IsXG4gIG92ZXJzY3JvbGxYOiBsYXlvdXQub3ZlcnNjcm9sbEJlaGF2aW9yWCxcbiAgb3ZlcnNjcm9sbFk6IGxheW91dC5vdmVyc2Nyb2xsQmVoYXZpb3JZXG59KTtcbi8qKlxuICogVHlwZXMgZm9yIGxheW91dCByZWxhdGVkIENTUyBwcm9wZXJ0aWVzXG4gKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxheW91dC5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIGxpc3QgPSB7XG4gIGxpc3RTdHlsZVR5cGU6IHRydWUsXG4gIGxpc3RTdHlsZVBvc2l0aW9uOiB0cnVlLFxuICBsaXN0U3R5bGVQb3M6IHQucHJvcChcImxpc3RTdHlsZVBvc2l0aW9uXCIpLFxuICBsaXN0U3R5bGVJbWFnZTogdHJ1ZSxcbiAgbGlzdFN0eWxlSW1nOiB0LnByb3AoXCJsaXN0U3R5bGVJbWFnZVwiKVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpc3QuanMubWFwIiwiaW1wb3J0IHsgbWVtb2l6ZWRHZXQgYXMgZ2V0IH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbnZhciBzck9ubHkgPSB7XG4gIGJvcmRlcjogXCIwcHhcIixcbiAgY2xpcDogXCJyZWN0KDAsIDAsIDAsIDApXCIsXG4gIHdpZHRoOiBcIjFweFwiLFxuICBoZWlnaHQ6IFwiMXB4XCIsXG4gIG1hcmdpbjogXCItMXB4XCIsXG4gIHBhZGRpbmc6IFwiMHB4XCIsXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLFxuICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiXG59O1xudmFyIHNyRm9jdXNhYmxlID0ge1xuICBwb3NpdGlvbjogXCJzdGF0aWNcIixcbiAgd2lkdGg6IFwiYXV0b1wiLFxuICBoZWlnaHQ6IFwiYXV0b1wiLFxuICBjbGlwOiBcImF1dG9cIixcbiAgcGFkZGluZzogXCIwXCIsXG4gIG1hcmdpbjogXCIwXCIsXG4gIG92ZXJmbG93OiBcInZpc2libGVcIixcbiAgd2hpdGVTcGFjZTogXCJub3JtYWxcIlxufTtcblxudmFyIGdldFdpdGhQcmlvcml0eSA9ICh0aGVtZSwga2V5LCBzdHlsZXMpID0+IHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICB2YXIgb2JqID0gZ2V0KHRoZW1lLCBrZXksIHt9KTtcblxuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBpc0luU3R5bGVzID0gcHJvcCBpbiBzdHlsZXMgJiYgc3R5bGVzW3Byb3BdICE9IG51bGw7XG4gICAgaWYgKCFpc0luU3R5bGVzKSByZXN1bHRbcHJvcF0gPSBvYmpbcHJvcF07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IHZhciBvdGhlcnMgPSB7XG4gIHNyT25seToge1xuICAgIHRyYW5zZm9ybSh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSByZXR1cm4gc3JPbmx5O1xuICAgICAgaWYgKHZhbHVlID09PSBcImZvY3VzYWJsZVwiKSByZXR1cm4gc3JGb2N1c2FibGU7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gIH0sXG4gIGxheWVyU3R5bGU6IHtcbiAgICBwcm9jZXNzUmVzdWx0OiB0cnVlLFxuICAgIHRyYW5zZm9ybTogKHZhbHVlLCB0aGVtZSwgc3R5bGVzKSA9PiBnZXRXaXRoUHJpb3JpdHkodGhlbWUsIFwibGF5ZXJTdHlsZXMuXCIgKyB2YWx1ZSwgc3R5bGVzKVxuICB9LFxuICB0ZXh0U3R5bGU6IHtcbiAgICBwcm9jZXNzUmVzdWx0OiB0cnVlLFxuICAgIHRyYW5zZm9ybTogKHZhbHVlLCB0aGVtZSwgc3R5bGVzKSA9PiBnZXRXaXRoUHJpb3JpdHkodGhlbWUsIFwidGV4dFN0eWxlcy5cIiArIHZhbHVlLCBzdHlsZXMpXG4gIH0sXG4gIGFwcGx5OiB7XG4gICAgcHJvY2Vzc1Jlc3VsdDogdHJ1ZSxcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZSwgdGhlbWUsIHN0eWxlcykgPT4gZ2V0V2l0aFByaW9yaXR5KHRoZW1lLCB2YWx1ZSwgc3R5bGVzKVxuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3RoZXJzLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgcG9zaXRpb24gPSB7XG4gIHBvc2l0aW9uOiB0cnVlLFxuICBwb3M6IHQucHJvcChcInBvc2l0aW9uXCIpLFxuICB6SW5kZXg6IHQucHJvcChcInpJbmRleFwiLCBcInpJbmRpY2VzXCIpLFxuICBpbnNldDogdC5zcGFjZVQoW1widG9wXCIsIFwicmlnaHRcIiwgXCJib3R0b21cIiwgXCJsZWZ0XCJdKSxcbiAgaW5zZXRYOiB0LnNwYWNlVChbXCJsZWZ0XCIsIFwicmlnaHRcIl0pLFxuICBpbnNldElubGluZTogdC5zcGFjZVQoXCJpbnNldElubGluZVwiKSxcbiAgaW5zZXRZOiB0LnNwYWNlVChbXCJ0b3BcIiwgXCJib3R0b21cIl0pLFxuICBpbnNldEJsb2NrOiB0LnNwYWNlVChcImluc2V0QmxvY2tcIiksXG4gIHRvcDogdC5zcGFjZVQoXCJ0b3BcIiksXG4gIGluc2V0QmxvY2tTdGFydDogdC5zcGFjZVQoXCJpbnNldEJsb2NrU3RhcnRcIiksXG4gIGJvdHRvbTogdC5zcGFjZVQoXCJib3R0b21cIiksXG4gIGluc2V0QmxvY2tFbmQ6IHQuc3BhY2VUKFwiaW5zZXRCbG9ja0VuZFwiKSxcbiAgbGVmdDogdC5zcGFjZVQoXCJsZWZ0XCIpLFxuICBpbnNldElubGluZVN0YXJ0OiB0LmxvZ2ljYWwoe1xuICAgIHNjYWxlOiBcInNwYWNlXCIsXG4gICAgcHJvcGVydHk6IHtcbiAgICAgIGx0cjogXCJsZWZ0XCIsXG4gICAgICBydGw6IFwicmlnaHRcIlxuICAgIH1cbiAgfSksXG4gIHJpZ2h0OiB0LnNwYWNlVChcInJpZ2h0XCIpLFxuICBpbnNldElubGluZUVuZDogdC5sb2dpY2FsKHtcbiAgICBzY2FsZTogXCJzcGFjZVwiLFxuICAgIHByb3BlcnR5OiB7XG4gICAgICBsdHI6IFwicmlnaHRcIixcbiAgICAgIHJ0bDogXCJsZWZ0XCJcbiAgICB9XG4gIH0pXG59O1xuT2JqZWN0LmFzc2lnbihwb3NpdGlvbiwge1xuICBpbnNldFN0YXJ0OiBwb3NpdGlvbi5pbnNldElubGluZVN0YXJ0LFxuICBpbnNldEVuZDogcG9zaXRpb24uaW5zZXRJbmxpbmVFbmRcbn0pO1xuLyoqXG4gKiBUeXBlcyBmb3IgcG9zaXRpb24gQ1NTIHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9zaXRpb24uanMubWFwIiwiaW1wb3J0IHsgdCwgdHJhbnNmb3JtcyB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG4vKipcbiAqIFRoZSBwYXJzZXIgY29uZmlndXJhdGlvbiBmb3IgY29tbW9uIG91dGxpbmUgcHJvcGVydGllc1xuICovXG5leHBvcnQgdmFyIHJpbmcgPSB7XG4gIHJpbmc6IHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybXMucmluZ1xuICB9LFxuICByaW5nQ29sb3I6IHQuY29sb3JzKFwiLS1jaGFrcmEtcmluZy1jb2xvclwiKSxcbiAgcmluZ09mZnNldDogdC5wcm9wKFwiLS1jaGFrcmEtcmluZy1vZmZzZXQtd2lkdGhcIiksXG4gIHJpbmdPZmZzZXRDb2xvcjogdC5jb2xvcnMoXCItLWNoYWtyYS1yaW5nLW9mZnNldC1jb2xvclwiKSxcbiAgcmluZ0luc2V0OiB0LnByb3AoXCItLWNoYWtyYS1yaW5nLWluc2V0XCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmluZy5qcy5tYXAiLCJpbXBvcnQgeyB0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIHNwYWNlID0ge1xuICBtYXJnaW46IHQuc3BhY2VUKFwibWFyZ2luXCIpLFxuICBtYXJnaW5Ub3A6IHQuc3BhY2VUKFwibWFyZ2luVG9wXCIpLFxuICBtYXJnaW5CbG9ja1N0YXJ0OiB0LnNwYWNlVChcIm1hcmdpbkJsb2NrU3RhcnRcIiksXG4gIG1hcmdpblJpZ2h0OiB0LnNwYWNlVChcIm1hcmdpblJpZ2h0XCIpLFxuICBtYXJnaW5JbmxpbmVFbmQ6IHQuc3BhY2VUKFwibWFyZ2luSW5saW5lRW5kXCIpLFxuICBtYXJnaW5Cb3R0b206IHQuc3BhY2VUKFwibWFyZ2luQm90dG9tXCIpLFxuICBtYXJnaW5CbG9ja0VuZDogdC5zcGFjZVQoXCJtYXJnaW5CbG9ja0VuZFwiKSxcbiAgbWFyZ2luTGVmdDogdC5zcGFjZVQoXCJtYXJnaW5MZWZ0XCIpLFxuICBtYXJnaW5JbmxpbmVTdGFydDogdC5zcGFjZVQoXCJtYXJnaW5JbmxpbmVTdGFydFwiKSxcbiAgbWFyZ2luWDogdC5zcGFjZVQoW1wibWFyZ2luSW5saW5lU3RhcnRcIiwgXCJtYXJnaW5JbmxpbmVFbmRcIl0pLFxuICBtYXJnaW5JbmxpbmU6IHQuc3BhY2VUKFwibWFyZ2luSW5saW5lXCIpLFxuICBtYXJnaW5ZOiB0LnNwYWNlVChbXCJtYXJnaW5Ub3BcIiwgXCJtYXJnaW5Cb3R0b21cIl0pLFxuICBtYXJnaW5CbG9jazogdC5zcGFjZVQoXCJtYXJnaW5CbG9ja1wiKSxcbiAgcGFkZGluZzogdC5zcGFjZShcInBhZGRpbmdcIiksXG4gIHBhZGRpbmdUb3A6IHQuc3BhY2UoXCJwYWRkaW5nVG9wXCIpLFxuICBwYWRkaW5nQmxvY2tTdGFydDogdC5zcGFjZShcInBhZGRpbmdCbG9ja1N0YXJ0XCIpLFxuICBwYWRkaW5nUmlnaHQ6IHQuc3BhY2UoXCJwYWRkaW5nUmlnaHRcIiksXG4gIHBhZGRpbmdCb3R0b206IHQuc3BhY2UoXCJwYWRkaW5nQm90dG9tXCIpLFxuICBwYWRkaW5nQmxvY2tFbmQ6IHQuc3BhY2UoXCJwYWRkaW5nQmxvY2tFbmRcIiksXG4gIHBhZGRpbmdMZWZ0OiB0LnNwYWNlKFwicGFkZGluZ0xlZnRcIiksXG4gIHBhZGRpbmdJbmxpbmVTdGFydDogdC5zcGFjZShcInBhZGRpbmdJbmxpbmVTdGFydFwiKSxcbiAgcGFkZGluZ0lubGluZUVuZDogdC5zcGFjZShcInBhZGRpbmdJbmxpbmVFbmRcIiksXG4gIHBhZGRpbmdYOiB0LnNwYWNlKFtcInBhZGRpbmdJbmxpbmVTdGFydFwiLCBcInBhZGRpbmdJbmxpbmVFbmRcIl0pLFxuICBwYWRkaW5nSW5saW5lOiB0LnNwYWNlKFwicGFkZGluZ0lubGluZVwiKSxcbiAgcGFkZGluZ1k6IHQuc3BhY2UoW1wicGFkZGluZ1RvcFwiLCBcInBhZGRpbmdCb3R0b21cIl0pLFxuICBwYWRkaW5nQmxvY2s6IHQuc3BhY2UoXCJwYWRkaW5nQmxvY2tcIilcbn07XG5PYmplY3QuYXNzaWduKHNwYWNlLCB7XG4gIG06IHNwYWNlLm1hcmdpbixcbiAgbXQ6IHNwYWNlLm1hcmdpblRvcCxcbiAgbXI6IHNwYWNlLm1hcmdpblJpZ2h0LFxuICBtZTogc3BhY2UubWFyZ2luSW5saW5lRW5kLFxuICBtYXJnaW5FbmQ6IHNwYWNlLm1hcmdpbklubGluZUVuZCxcbiAgbWI6IHNwYWNlLm1hcmdpbkJvdHRvbSxcbiAgbWw6IHNwYWNlLm1hcmdpbkxlZnQsXG4gIG1zOiBzcGFjZS5tYXJnaW5JbmxpbmVTdGFydCxcbiAgbWFyZ2luU3RhcnQ6IHNwYWNlLm1hcmdpbklubGluZVN0YXJ0LFxuICBteDogc3BhY2UubWFyZ2luWCxcbiAgbXk6IHNwYWNlLm1hcmdpblksXG4gIHA6IHNwYWNlLnBhZGRpbmcsXG4gIHB0OiBzcGFjZS5wYWRkaW5nVG9wLFxuICBweTogc3BhY2UucGFkZGluZ1ksXG4gIHB4OiBzcGFjZS5wYWRkaW5nWCxcbiAgcGI6IHNwYWNlLnBhZGRpbmdCb3R0b20sXG4gIHBsOiBzcGFjZS5wYWRkaW5nTGVmdCxcbiAgcHM6IHNwYWNlLnBhZGRpbmdJbmxpbmVTdGFydCxcbiAgcGFkZGluZ1N0YXJ0OiBzcGFjZS5wYWRkaW5nSW5saW5lU3RhcnQsXG4gIHByOiBzcGFjZS5wYWRkaW5nUmlnaHQsXG4gIHBlOiBzcGFjZS5wYWRkaW5nSW5saW5lRW5kLFxuICBwYWRkaW5nRW5kOiBzcGFjZS5wYWRkaW5nSW5saW5lRW5kXG59KTtcbi8qKlxuICogVHlwZXMgZm9yIHNwYWNlIHJlbGF0ZWQgQ1NTIHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2UuanMubWFwIiwiaW1wb3J0IHsgdCB9IGZyb20gXCIuLi91dGlsc1wiO1xuZXhwb3J0IHZhciB0ZXh0RGVjb3JhdGlvbiA9IHtcbiAgdGV4dERlY29yYXRpb25Db2xvcjogdC5jb2xvcnMoXCJ0ZXh0RGVjb3JhdGlvbkNvbG9yXCIpLFxuICB0ZXh0RGVjb3JhdGlvbjogdHJ1ZSxcbiAgdGV4dERlY29yOiB7XG4gICAgcHJvcGVydHk6IFwidGV4dERlY29yYXRpb25cIlxuICB9LFxuICB0ZXh0RGVjb3JhdGlvbkxpbmU6IHRydWUsXG4gIHRleHREZWNvcmF0aW9uU3R5bGU6IHRydWUsXG4gIHRleHREZWNvcmF0aW9uVGhpY2tuZXNzOiB0cnVlLFxuICB0ZXh0VW5kZXJsaW5lT2Zmc2V0OiB0cnVlLFxuICB0ZXh0U2hhZG93OiB0LnNoYWRvd3MoXCJ0ZXh0U2hhZG93XCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGV4dC1kZWNvcmF0aW9uLmpzLm1hcCIsImltcG9ydCB7IHQsIHRyYW5zZm9ybXMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgdHJhbnNmb3JtID0ge1xuICBjbGlwUGF0aDogdHJ1ZSxcbiAgdHJhbnNmb3JtOiB0LnByb3BUKFwidHJhbnNmb3JtXCIsIHRyYW5zZm9ybXMudHJhbnNmb3JtKSxcbiAgdHJhbnNmb3JtT3JpZ2luOiB0cnVlLFxuICB0cmFuc2xhdGVYOiB0LnNwYWNlVChcIi0tY2hha3JhLXRyYW5zbGF0ZS14XCIpLFxuICB0cmFuc2xhdGVZOiB0LnNwYWNlVChcIi0tY2hha3JhLXRyYW5zbGF0ZS15XCIpLFxuICBza2V3WDogdC5kZWdyZWVUKFwiLS1jaGFrcmEtc2tldy14XCIpLFxuICBza2V3WTogdC5kZWdyZWVUKFwiLS1jaGFrcmEtc2tldy15XCIpLFxuICBzY2FsZVg6IHQucHJvcChcIi0tY2hha3JhLXNjYWxlLXhcIiksXG4gIHNjYWxlWTogdC5wcm9wKFwiLS1jaGFrcmEtc2NhbGUteVwiKSxcbiAgc2NhbGU6IHQucHJvcChbXCItLWNoYWtyYS1zY2FsZS14XCIsIFwiLS1jaGFrcmEtc2NhbGUteVwiXSksXG4gIHJvdGF0ZTogdC5kZWdyZWVUKFwiLS1jaGFrcmEtcm90YXRlXCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNmb3JtLmpzLm1hcCIsImltcG9ydCB7IHQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB2YXIgdHJhbnNpdGlvbiA9IHtcbiAgdHJhbnNpdGlvbjogdHJ1ZSxcbiAgdHJhbnNpdGlvbkRlbGF5OiB0cnVlLFxuICBhbmltYXRpb246IHRydWUsXG4gIHdpbGxDaGFuZ2U6IHRydWUsXG4gIHRyYW5zaXRpb25EdXJhdGlvbjogdC5wcm9wKFwidHJhbnNpdGlvbkR1cmF0aW9uXCIsIFwidHJhbnNpdGlvbi5kdXJhdGlvblwiKSxcbiAgdHJhbnNpdGlvblByb3BlcnR5OiB0LnByb3AoXCJ0cmFuc2l0aW9uUHJvcGVydHlcIiwgXCJ0cmFuc2l0aW9uLnByb3BlcnR5XCIpLFxuICB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb246IHQucHJvcChcInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvblwiLCBcInRyYW5zaXRpb24uZWFzaW5nXCIpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNpdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyB0LCB0cmFuc2Zvcm1zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5leHBvcnQgdmFyIHR5cG9ncmFwaHkgPSB7XG4gIGZvbnRGYW1pbHk6IHQucHJvcChcImZvbnRGYW1pbHlcIiwgXCJmb250c1wiKSxcbiAgZm9udFNpemU6IHQucHJvcChcImZvbnRTaXplXCIsIFwiZm9udFNpemVzXCIsIHRyYW5zZm9ybXMucHgpLFxuICBmb250V2VpZ2h0OiB0LnByb3AoXCJmb250V2VpZ2h0XCIsIFwiZm9udFdlaWdodHNcIiksXG4gIGxpbmVIZWlnaHQ6IHQucHJvcChcImxpbmVIZWlnaHRcIiwgXCJsaW5lSGVpZ2h0c1wiKSxcbiAgbGV0dGVyU3BhY2luZzogdC5wcm9wKFwibGV0dGVyU3BhY2luZ1wiLCBcImxldHRlclNwYWNpbmdzXCIpLFxuICB0ZXh0QWxpZ246IHRydWUsXG4gIGZvbnRTdHlsZTogdHJ1ZSxcbiAgd29yZEJyZWFrOiB0cnVlLFxuICBvdmVyZmxvd1dyYXA6IHRydWUsXG4gIHRleHRPdmVyZmxvdzogdHJ1ZSxcbiAgdGV4dFRyYW5zZm9ybTogdHJ1ZSxcbiAgd2hpdGVTcGFjZTogdHJ1ZSxcbiAgbm9PZkxpbmVzOiB7XG4gICAgc3RhdGljOiB7XG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgIHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wiLFxuICAgICAgZGlzcGxheTogXCItd2Via2l0LWJveFwiLFxuICAgICAgV2Via2l0Qm94T3JpZW50OiBcInZlcnRpY2FsXCIsXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIFdlYmtpdExpbmVDbGFtcDogXCJ2YXIoLS1jaGFrcmEtbGluZS1jbGFtcClcIlxuICAgIH0sXG4gICAgcHJvcGVydHk6IFwiLS1jaGFrcmEtbGluZS1jbGFtcFwiXG4gIH0sXG4gIGlzVHJ1bmNhdGVkOiB7XG4gICAgdHJhbnNmb3JtKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICB0ZXh0T3ZlcmZsb3c6IFwiZWxsaXBzaXNcIixcbiAgICAgICAgICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn07XG4vKipcbiAqIFR5cGVzIGZvciB0eXBvZ3JhcGh5IHJlbGF0ZWQgQ1NTIHByb3BlcnRpZXNcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHlwb2dyYXBoeS5qcy5tYXAiLCJpbXBvcnQgeyBvYmplY3RLZXlzIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbnZhciBncm91cCA9IHtcbiAgaG92ZXI6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6aG92ZXIgJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtaG92ZXJdICZcIixcbiAgZm9jdXM6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6Zm9jdXMgJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtZm9jdXNdICZcIixcbiAgYWN0aXZlOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOmFjdGl2ZSAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1hY3RpdmVdICZcIixcbiAgZGlzYWJsZWQ6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6ZGlzYWJsZWQgJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtZGlzYWJsZWRdICZcIixcbiAgaW52YWxpZDogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjppbnZhbGlkICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWludmFsaWRdICZcIixcbiAgY2hlY2tlZDogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjpjaGVja2VkICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWNoZWNrZWRdICZcIixcbiAgaW5kZXRlcm1pbmF0ZTogc2VsZWN0b3IgPT4gc2VsZWN0b3IgKyBcIjppbmRldGVybWluYXRlICYsIFwiICsgc2VsZWN0b3IgKyBcIlthcmlhLWNoZWNrZWQ9bWl4ZWRdICYsIFwiICsgc2VsZWN0b3IgKyBcIltkYXRhLWluZGV0ZXJtaW5hdGVdICZcIixcbiAgcmVhZE9ubHk6IHNlbGVjdG9yID0+IHNlbGVjdG9yICsgXCI6cmVhZC1vbmx5ICYsIFwiICsgc2VsZWN0b3IgKyBcIltyZWFkb25seV0gJiwgXCIgKyBzZWxlY3RvciArIFwiW2RhdGEtcmVhZC1vbmx5XSAmXCIsXG4gIGV4cGFuZGVkOiBzZWxlY3RvciA9PiBzZWxlY3RvciArIFwiOnJlYWQtb25seSAmLCBcIiArIHNlbGVjdG9yICsgXCJbYXJpYS1leHBhbmRlZD10cnVlXSAmLCBcIiArIHNlbGVjdG9yICsgXCJbZGF0YS1leHBhbmRlZF0gJlwiXG59O1xuXG52YXIgdG9Hcm91cCA9IGZuID0+IG1lcmdlKGZuLCBcIltyb2xlPWdyb3VwXVwiLCBcIltkYXRhLWdyb3VwXVwiLCBcIi5ncm91cFwiKTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoZm4pIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHNlbGVjdG9ycyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgc2VsZWN0b3JzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvcnMubWFwKGZuKS5qb2luKFwiLCBcIik7XG59O1xuXG5leHBvcnQgdmFyIHBzZXVkb1NlbGVjdG9ycyA9IHtcbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIHNlbGVjdG9yIGAmOmhvdmVyYFxuICAgKi9cbiAgX2hvdmVyOiBcIiY6aG92ZXIsICZbZGF0YS1ob3Zlcl1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6YWN0aXZlYFxuICAgKi9cbiAgX2FjdGl2ZTogXCImOmFjdGl2ZSwgJltkYXRhLWFjdGl2ZV1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1Mgc2VsZWN0b3IgYCY6Zm9jdXNgXG4gICAqXG4gICAqL1xuICBfZm9jdXM6IFwiJjpmb2N1cywgJltkYXRhLWZvY3VzXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIHRoZSBoaWdobGlnaHRlZCBzdGF0ZS5cbiAgICovXG4gIF9oaWdobGlnaHRlZDogXCImW2RhdGEtaGlnaGxpZ2h0ZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIGEgY2hpbGQgb2YgdGhpcyBlbGVtZW50IGhhcyByZWNlaXZlZCBmb2N1c1xuICAgKiAtIENTUyBTZWxlY3RvciBgJjpmb2N1cy13aXRoaW5gXG4gICAqL1xuICBfZm9jdXNXaXRoaW46IFwiJjpmb2N1cy13aXRoaW5cIixcbiAgX2ZvY3VzVmlzaWJsZTogXCImOmZvY3VzLXZpc2libGVcIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhpcyBlbGVtZW50IGlzIGRpc2FibGVkLiBUaGUgcGFzc2VkIHN0eWxlcyBhcmUgYXBwbGllZCB0byB0aGVzZSBDU1Mgc2VsZWN0b3JzOlxuICAgKiAtIGAmW2FyaWEtZGlzYWJsZWQ9dHJ1ZV1gXG4gICAqIC0gYCY6ZGlzYWJsZWRgXG4gICAqIC0gYCZbZGF0YS1kaXNhYmxlZF1gXG4gICAqL1xuICBfZGlzYWJsZWQ6IFwiJltkaXNhYmxlZF0sICZbYXJpYS1kaXNhYmxlZD10cnVlXSwgJltkYXRhLWRpc2FibGVkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpyZWFkb25seWBcbiAgICovXG4gIF9yZWFkT25seTogXCImW2FyaWEtcmVhZG9ubHk9dHJ1ZV0sICZbcmVhZG9ubHldLCAmW2RhdGEtcmVhZG9ubHldXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIHNlbGVjdG9yIGAmOjpiZWZvcmVgXG4gICAqXG4gICAqIE5PVEU6V2hlbiB1c2luZyB0aGlzLCBlbnN1cmUgdGhlIGBjb250ZW50YCBpcyB3cmFwcGVkIGluIGEgYmFja3RpY2suXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGpzeFxuICAgKiA8Qm94IF9iZWZvcmU9e3tjb250ZW50OmBcIlwiYCB9fS8+XG4gICAqIGBgYFxuICAgKi9cbiAgX2JlZm9yZTogXCImOjpiZWZvcmVcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1Mgc2VsZWN0b3IgYCY6OmFmdGVyYFxuICAgKlxuICAgKiBOT1RFOldoZW4gdXNpbmcgdGhpcywgZW5zdXJlIHRoZSBgY29udGVudGAgaXMgd3JhcHBlZCBpbiBhIGJhY2t0aWNrLlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqc3hcbiAgICogPEJveCBfYWZ0ZXI9e3tjb250ZW50OmBcIlwiYCB9fS8+XG4gICAqIGBgYFxuICAgKi9cbiAgX2FmdGVyOiBcIiY6OmFmdGVyXCIsXG4gIF9lbXB0eTogXCImOmVtcHR5XCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoZSBBUklBIGF0dHJpYnV0ZSBgYXJpYS1leHBhbmRlZGAgaXMgYHRydWVgXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2FyaWEtZXhwYW5kZWQ9dHJ1ZV1gXG4gICAqL1xuICBfZXhwYW5kZWQ6IFwiJlthcmlhLWV4cGFuZGVkPXRydWVdLCAmW2RhdGEtZXhwYW5kZWRdXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHRoZSBBUklBIGF0dHJpYnV0ZSBgYXJpYS1jaGVja2VkYCBpcyBgdHJ1ZWBcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbYXJpYS1jaGVja2VkPXRydWVdYFxuICAgKi9cbiAgX2NoZWNrZWQ6IFwiJlthcmlhLWNoZWNrZWQ9dHJ1ZV0sICZbZGF0YS1jaGVja2VkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGUgQVJJQSBhdHRyaWJ1dGUgYGFyaWEtZ3JhYmJlZGAgaXMgYHRydWVgXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2FyaWEtZ3JhYmJlZD10cnVlXWBcbiAgICovXG4gIF9ncmFiYmVkOiBcIiZbYXJpYS1ncmFiYmVkPXRydWVdLCAmW2RhdGEtZ3JhYmJlZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCZbYXJpYS1wcmVzc2VkPXRydWVdYFxuICAgKiBUeXBpY2FsbHkgdXNlZCB0byBzdHlsZSB0aGUgY3VycmVudCBcInByZXNzZWRcIiBzdGF0ZSBvZiB0b2dnbGUgYnV0dG9uc1xuICAgKi9cbiAgX3ByZXNzZWQ6IFwiJlthcmlhLXByZXNzZWQ9dHJ1ZV0sICZbZGF0YS1wcmVzc2VkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGUgQVJJQSBhdHRyaWJ1dGUgYGFyaWEtaW52YWxpZGAgaXMgYHRydWVgXG4gICAqIC0gQ1NTIHNlbGVjdG9yIGAmW2FyaWEtaW52YWxpZD10cnVlXWBcbiAgICovXG4gIF9pbnZhbGlkOiBcIiZbYXJpYS1pbnZhbGlkPXRydWVdLCAmW2RhdGEtaW52YWxpZF1cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciB0aGUgdmFsaWQgc3RhdGVcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbZGF0YS12YWxpZF0sICZbZGF0YS1zdGF0ZT12YWxpZF1gXG4gICAqL1xuICBfdmFsaWQ6IFwiJltkYXRhLXZhbGlkXSwgJltkYXRhLXN0YXRlPXZhbGlkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJlthcmlhLWJ1c3k9dHJ1ZV1gIG9yIGAmW2RhdGEtbG9hZGluZz10cnVlXWAuXG4gICAqIFVzZWZ1bCBmb3Igc3R5bGluZyBsb2FkaW5nIHN0YXRlc1xuICAgKi9cbiAgX2xvYWRpbmc6IFwiJltkYXRhLWxvYWRpbmddLCAmW2FyaWEtYnVzeT10cnVlXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiB0aGUgQVJJQSBhdHRyaWJ1dGUgYGFyaWEtc2VsZWN0ZWRgIGlzIGB0cnVlYFxuICAgKlxuICAgKiAtIENTUyBzZWxlY3RvciBgJlthcmlhLXNlbGVjdGVkPXRydWVdYFxuICAgKi9cbiAgX3NlbGVjdGVkOiBcIiZbYXJpYS1zZWxlY3RlZD10cnVlXSwgJltkYXRhLXNlbGVjdGVkXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgW2hpZGRlbj10cnVlXWBcbiAgICovXG4gIF9oaWRkZW46IFwiJltoaWRkZW5dLCAmW2RhdGEtaGlkZGVuXVwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjotd2Via2l0LWF1dG9maWxsYFxuICAgKi9cbiAgX2F1dG9maWxsOiBcIiY6LXdlYmtpdC1hdXRvZmlsbFwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgJjpudGgtY2hpbGQoZXZlbilgXG4gICAqL1xuICBfZXZlbjogXCImOm50aC1vZi10eXBlKGV2ZW4pXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOm50aC1jaGlsZChvZGQpYFxuICAgKi9cbiAgX29kZDogXCImOm50aC1vZi10eXBlKG9kZClcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6Zmlyc3Qtb2YtdHlwZWBcbiAgICovXG4gIF9maXJzdDogXCImOmZpcnN0LW9mLXR5cGVcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6bGFzdC1vZi10eXBlYFxuICAgKi9cbiAgX2xhc3Q6IFwiJjpsYXN0LW9mLXR5cGVcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6bm90KDpmaXJzdC1vZi10eXBlKWBcbiAgICovXG4gIF9ub3RGaXJzdDogXCImOm5vdCg6Zmlyc3Qtb2YtdHlwZSlcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6bm90KDpsYXN0LW9mLXR5cGUpYFxuICAgKi9cbiAgX25vdExhc3Q6IFwiJjpub3QoOmxhc3Qtb2YtdHlwZSlcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6dmlzaXRlZGBcbiAgICovXG4gIF92aXNpdGVkOiBcIiY6dmlzaXRlZFwiLFxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHN0eWxlIHRoZSBhY3RpdmUgbGluayBpbiBhIG5hdmlnYXRpb25cbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCZbYXJpYS1jdXJyZW50PXBhZ2VdYFxuICAgKi9cbiAgX2FjdGl2ZUxpbms6IFwiJlthcmlhLWN1cnJlbnQ9cGFnZV1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gdGhlIEFSSUEgYXR0cmlidXRlIGBhcmlhLWNoZWNrZWRgIGlzIGBtaXhlZGBcbiAgICogLSBDU1Mgc2VsZWN0b3IgYCZbYXJpYS1jaGVja2VkPW1peGVkXWBcbiAgICovXG4gIF9pbmRldGVybWluYXRlOiBcIiY6aW5kZXRlcm1pbmF0ZSwgJlthcmlhLWNoZWNrZWQ9bWl4ZWRdLCAmW2RhdGEtaW5kZXRlcm1pbmF0ZV1cIixcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gcGFyZW50IGlzIGhvdmVyZWRcbiAgICovXG4gIF9ncm91cEhvdmVyOiB0b0dyb3VwKGdyb3VwLmhvdmVyKSxcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gcGFyZW50IGlzIGZvY3VzZWRcbiAgICovXG4gIF9ncm91cEZvY3VzOiB0b0dyb3VwKGdyb3VwLmZvY3VzKSxcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gcGFyZW50IGlzIGFjdGl2ZVxuICAgKi9cbiAgX2dyb3VwQWN0aXZlOiB0b0dyb3VwKGdyb3VwLmFjdGl2ZSksXG5cbiAgLyoqXG4gICAqIFN0eWxlcyB0byBhcHBseSB3aGVuIHBhcmVudCBpcyBkaXNhYmxlZFxuICAgKi9cbiAgX2dyb3VwRGlzYWJsZWQ6IHRvR3JvdXAoZ3JvdXAuZGlzYWJsZWQpLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgdG8gYXBwbHkgd2hlbiBwYXJlbnQgaXMgaW52YWxpZFxuICAgKi9cbiAgX2dyb3VwSW52YWxpZDogdG9Hcm91cChncm91cC5pbnZhbGlkKSxcblxuICAvKipcbiAgICogU3R5bGVzIHRvIGFwcGx5IHdoZW4gcGFyZW50IGlzIGNoZWNrZWRcbiAgICovXG4gIF9ncm91cENoZWNrZWQ6IHRvR3JvdXAoZ3JvdXAuY2hlY2tlZCksXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGAmOjpwbGFjZWhvbGRlcmAuXG4gICAqL1xuICBfcGxhY2Vob2xkZXI6IFwiJjo6cGxhY2Vob2xkZXJcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6ZnVsbHNjcmVlbmAuXG4gICAqL1xuICBfZnVsbFNjcmVlbjogXCImOmZ1bGxzY3JlZW5cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciBDU1MgU2VsZWN0b3IgYCY6OnNlbGVjdGlvbmBcbiAgICovXG4gIF9zZWxlY3Rpb246IFwiJjo6c2VsZWN0aW9uXCIsXG5cbiAgLyoqXG4gICAqIFN0eWxlcyBmb3IgQ1NTIFNlbGVjdG9yIGBbZGlyPXJ0bF0gJmBcbiAgICogSXQgaXMgYXBwbGllZCB3aGVuIGFueSBwYXJlbnQgZWxlbWVudCBoYXMgYGRpcj1cInJ0bFwiYFxuICAgKi9cbiAgX3J0bDogXCJbZGlyPXJ0bF0gJlwiLFxuXG4gIC8qKlxuICAgKiBTdHlsZXMgZm9yIENTUyBTZWxlY3RvciBgQG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylgXG4gICAqIHVzZWQgd2hlbiB0aGUgdXNlciBoYXMgcmVxdWVzdGVkIHRoZSBzeXN0ZW1cbiAgICogdXNlIGEgbGlnaHQgb3IgZGFyayBjb2xvciB0aGVtZS5cbiAgICovXG4gIF9tZWRpYURhcms6IFwiQG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciB3aGVuIGBkYXRhLXRoZW1lYCBpcyBhcHBsaWVkIHRvIGFueSBwYXJlbnQgb2ZcbiAgICogdGhpcyBjb21wb25lbnQgb3IgZWxlbWVudC5cbiAgICovXG4gIF9kYXJrOiBcIi5jaGFrcmEtdWktZGFyayAmLCBbZGF0YS10aGVtZT1kYXJrXSAmLCAmW2RhdGEtdGhlbWU9ZGFya11cIixcblxuICAvKipcbiAgICogU3R5bGVzIGZvciB3aGVuIGBkYXRhLXRoZW1lYCBpcyBhcHBsaWVkIHRvIGFueSBwYXJlbnQgb2ZcbiAgICogdGhpcyBjb21wb25lbnQgb3IgZWxlbWVudC5cbiAgICovXG4gIF9saWdodDogXCIuY2hha3JhLXVpLWxpZ2h0ICYsIFtkYXRhLXRoZW1lPWxpZ2h0XSAmLCAmW2RhdGEtdGhlbWU9bGlnaHRdXCJcbn07XG5leHBvcnQgdmFyIHBzZXVkb1Byb3BOYW1lcyA9IG9iamVjdEtleXMocHNldWRvU2VsZWN0b3JzKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBzZXVkb3MuanMubWFwIiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IHsgbWVyZ2VXaXRoLCBvYmplY3RLZXlzIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCB7IGJhY2tncm91bmQsIGJvcmRlciwgY29sb3IsIGVmZmVjdCwgZmlsdGVyLCBmbGV4Ym94LCBncmlkLCBpbnRlcmFjdGl2aXR5LCBsYXlvdXQsIGxpc3QsIG90aGVycywgcG9zaXRpb24sIHJpbmcsIHNwYWNlLCB0ZXh0RGVjb3JhdGlvbiwgdHJhbnNmb3JtLCB0cmFuc2l0aW9uLCB0eXBvZ3JhcGh5IH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBwc2V1ZG9Qcm9wTmFtZXMsIHBzZXVkb1NlbGVjdG9ycyB9IGZyb20gXCIuL3BzZXVkb3NcIjtcbmV4cG9ydCB2YXIgc3lzdGVtUHJvcHMgPSBtZXJnZVdpdGgoe30sIGJhY2tncm91bmQsIGJvcmRlciwgY29sb3IsIGZsZXhib3gsIGxheW91dCwgZmlsdGVyLCByaW5nLCBpbnRlcmFjdGl2aXR5LCBncmlkLCBvdGhlcnMsIHBvc2l0aW9uLCBlZmZlY3QsIHNwYWNlLCB0eXBvZ3JhcGh5LCB0ZXh0RGVjb3JhdGlvbiwgdHJhbnNmb3JtLCBsaXN0LCB0cmFuc2l0aW9uKTtcbnZhciBsYXlvdXRTeXN0ZW0gPSBPYmplY3QuYXNzaWduKHt9LCBzcGFjZSwgbGF5b3V0LCBmbGV4Ym94LCBncmlkLCBwb3NpdGlvbik7XG5leHBvcnQgdmFyIGxheW91dFByb3BOYW1lcyA9IG9iamVjdEtleXMobGF5b3V0U3lzdGVtKTtcbmV4cG9ydCB2YXIgcHJvcE5hbWVzID0gWy4uLm9iamVjdEtleXMoc3lzdGVtUHJvcHMpLCAuLi5wc2V1ZG9Qcm9wTmFtZXNdO1xuXG52YXIgc3R5bGVQcm9wcyA9IF9leHRlbmRzKHt9LCBzeXN0ZW1Qcm9wcywgcHNldWRvU2VsZWN0b3JzKTtcblxuZXhwb3J0IHZhciBpc1N0eWxlUHJvcCA9IHByb3AgPT4gcHJvcCBpbiBzdHlsZVByb3BzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtLmpzLm1hcCIsImltcG9ydCB7IGlzT2JqZWN0LCBydW5JZkZuIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbi8qKlxuICogRXhwYW5kcyBhbiBhcnJheSBvciBvYmplY3Qgc3ludGF4IHJlc3BvbnNpdmUgc3R5bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGV4cGFuZFJlc3BvbnNpdmUoeyBteDogWzEsIDJdIH0pXG4gKiAvLyBvclxuICogZXhwYW5kUmVzcG9uc2l2ZSh7IG14OiB7IGJhc2U6IDEsIHNtOiAyIH0gfSlcbiAqXG4gKiAvLyA9PiB7IG14OiAxLCBcIkBtZWRpYShtaW4td2lkdGg6PHNtPilcIjogeyBteDogMiB9IH1cbiAqL1xuXG5leHBvcnQgdmFyIGV4cGFuZFJlc3BvbnNpdmUgPSBzdHlsZXMgPT4gdGhlbWUgPT4ge1xuICAvKipcbiAgICogQmVmb3JlIGFueSBzdHlsZSBjYW4gYmUgcHJvY2Vzc2VkLCB0aGUgdXNlciBuZWVkcyB0byBjYWxsIGB0b0NTU1ZhcmBcbiAgICogd2hpY2ggYW5hbHl6ZXMgdGhlIHRoZW1lJ3MgYnJlYWtwb2ludCBhbmQgYXBwZW5kcyBhIGBfX2JyZWFrcG9pbnRzYCBwcm9wZXJ0eVxuICAgKiB0byB0aGUgdGhlbWUgd2l0aCBtb3JlIGRldGFpbHMgb2YgdGhlIGJyZWFrcG9pbnRzLlxuICAgKlxuICAgKiBUbyBsZWFybiBtb3JlLCBnbyBoZXJlOiBwYWNrYWdlcy91dGlscy9zcmMvcmVzcG9uc2l2ZS50cyAjYW5hbHl6ZUJyZWFrcG9pbnRzXG4gICAqL1xuICBpZiAoIXRoZW1lLl9fYnJlYWtwb2ludHMpIHJldHVybiBzdHlsZXM7XG4gIHZhciB7XG4gICAgaXNSZXNwb25zaXZlLFxuICAgIHRvQXJyYXlWYWx1ZSxcbiAgICBtZWRpYTogbWVkaWFzXG4gIH0gPSB0aGVtZS5fX2JyZWFrcG9pbnRzO1xuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB7fTtcblxuICBmb3IgKHZhciBrZXkgaW4gc3R5bGVzKSB7XG4gICAgdmFyIHZhbHVlID0gcnVuSWZGbihzdHlsZXNba2V5XSwgdGhlbWUpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSBjb250aW51ZTsgLy8gY29udmVydHMgdGhlIG9iamVjdCByZXNwb25zaXZlIHN5bnRheCB0byBhcnJheSBzeW50YXhcblxuICAgIHZhbHVlID0gaXNPYmplY3QodmFsdWUpICYmIGlzUmVzcG9uc2l2ZSh2YWx1ZSkgPyB0b0FycmF5VmFsdWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBjb21wdXRlZFN0eWxlc1trZXldID0gdmFsdWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgcXVlcmllcyA9IHZhbHVlLnNsaWNlKDAsIG1lZGlhcy5sZW5ndGgpLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBxdWVyaWVzOyBpbmRleCArPSAxKSB7XG4gICAgICB2YXIgbWVkaWEgPSBtZWRpYXMgPT0gbnVsbCA/IHZvaWQgMCA6IG1lZGlhc1tpbmRleF07XG5cbiAgICAgIGlmICghbWVkaWEpIHtcbiAgICAgICAgY29tcHV0ZWRTdHlsZXNba2V5XSA9IHZhbHVlW2luZGV4XTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbXB1dGVkU3R5bGVzW21lZGlhXSA9IGNvbXB1dGVkU3R5bGVzW21lZGlhXSB8fCB7fTtcblxuICAgICAgaWYgKHZhbHVlW2luZGV4XSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb21wdXRlZFN0eWxlc1ttZWRpYV1ba2V5XSA9IHZhbHVlW2luZGV4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29tcHV0ZWRTdHlsZXM7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhwYW5kLXJlc3BvbnNpdmUuanMubWFwIiwiaW1wb3J0IHsgaXNDc3NWYXIsIGlzT2JqZWN0LCBpc1N0cmluZywgbWVyZ2VXaXRoIGFzIG1lcmdlLCBydW5JZkZuIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCB7IHBzZXVkb1NlbGVjdG9ycyB9IGZyb20gXCIuL3BzZXVkb3NcIjtcbmltcG9ydCB7IHN5c3RlbVByb3BzIGFzIHN5c3RlbVByb3BDb25maWdzIH0gZnJvbSBcIi4vc3lzdGVtXCI7XG5pbXBvcnQgeyBleHBhbmRSZXNwb25zaXZlIH0gZnJvbSBcIi4vdXRpbHMvZXhwYW5kLXJlc3BvbnNpdmVcIjtcblxudmFyIGlzQ1NTVmFyaWFibGVUb2tlblZhbHVlID0gKGtleSwgdmFsdWUpID0+IGtleS5zdGFydHNXaXRoKFwiLS1cIikgJiYgaXNTdHJpbmcodmFsdWUpICYmICFpc0Nzc1Zhcih2YWx1ZSk7XG5cbnZhciByZXNvbHZlVG9rZW5WYWx1ZSA9ICh0aGVtZSwgdmFsdWUpID0+IHtcbiAgdmFyIF9yZWYsIF9nZXRWYXIyO1xuXG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdmFsdWU7XG5cbiAgdmFyIGdldFZhciA9IHZhbCA9PiB7XG4gICAgdmFyIF90aGVtZSRfX2Nzc01hcCwgX3RoZW1lJF9fY3NzTWFwJHZhbDtcblxuICAgIHJldHVybiAoX3RoZW1lJF9fY3NzTWFwID0gdGhlbWUuX19jc3NNYXApID09IG51bGwgPyB2b2lkIDAgOiAoX3RoZW1lJF9fY3NzTWFwJHZhbCA9IF90aGVtZSRfX2Nzc01hcFt2YWxdKSA9PSBudWxsID8gdm9pZCAwIDogX3RoZW1lJF9fY3NzTWFwJHZhbC52YXJSZWY7XG4gIH07XG5cbiAgdmFyIGdldFZhbHVlID0gdmFsID0+IHtcbiAgICB2YXIgX2dldFZhcjtcblxuICAgIHJldHVybiAoX2dldFZhciA9IGdldFZhcih2YWwpKSAhPSBudWxsID8gX2dldFZhciA6IHZhbDtcbiAgfTtcblxuICB2YXIgdmFsdWVTcGxpdCA9IHZhbHVlLnNwbGl0KFwiLFwiKS5tYXAodiA9PiB2LnRyaW0oKSk7XG4gIHZhciBbdG9rZW5WYWx1ZSwgZmFsbGJhY2tWYWx1ZV0gPSB2YWx1ZVNwbGl0O1xuICB2YWx1ZSA9IChfcmVmID0gKF9nZXRWYXIyID0gZ2V0VmFyKHRva2VuVmFsdWUpKSAhPSBudWxsID8gX2dldFZhcjIgOiBnZXRWYWx1ZShmYWxsYmFja1ZhbHVlKSkgIT0gbnVsbCA/IF9yZWYgOiBnZXRWYWx1ZSh2YWx1ZSk7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDc3Mob3B0aW9ucykge1xuICB2YXIge1xuICAgIGNvbmZpZ3MgPSB7fSxcbiAgICBwc2V1ZG9zID0ge30sXG4gICAgdGhlbWVcbiAgfSA9IG9wdGlvbnM7XG5cbiAgdmFyIGNzcyA9IGZ1bmN0aW9uIGNzcyhzdHlsZXNPckZuLCBuZXN0ZWQpIHtcbiAgICBpZiAobmVzdGVkID09PSB2b2lkIDApIHtcbiAgICAgIG5lc3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBfc3R5bGVzID0gcnVuSWZGbihzdHlsZXNPckZuLCB0aGVtZSk7XG5cbiAgICB2YXIgc3R5bGVzID0gZXhwYW5kUmVzcG9uc2l2ZShfc3R5bGVzKSh0aGVtZSk7XG4gICAgdmFyIGNvbXB1dGVkU3R5bGVzID0ge307XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc3R5bGVzKSB7XG4gICAgICB2YXIgX2NvbmZpZyR0cmFuc2Zvcm0sIF9jb25maWcsIF9jb25maWcyLCBfY29uZmlnMywgX2NvbmZpZzQ7XG5cbiAgICAgIHZhciB2YWx1ZU9yRm4gPSBzdHlsZXNba2V5XTtcbiAgICAgIC8qKlxuICAgICAgICogYWxsb3dzIHRoZSB1c2VyIHRvIHBhc3MgZnVuY3Rpb25hbCB2YWx1ZXNcbiAgICAgICAqIGJveFNoYWRvdzogdGhlbWUgPT4gYDAgMnB4IDJweCAke3RoZW1lLmNvbG9ycy5yZWR9YFxuICAgICAgICovXG5cbiAgICAgIHZhciB2YWx1ZSA9IHJ1bklmRm4odmFsdWVPckZuLCB0aGVtZSk7XG4gICAgICAvKipcbiAgICAgICAqIGNvbnZlcnRzIHBzZXVkbyBzaG9ydGhhbmRzIHRvIHZhbGlkIHNlbGVjdG9yXG4gICAgICAgKiBcIl9ob3ZlclwiID0+IFwiJjpob3ZlclwiXG4gICAgICAgKi9cblxuICAgICAgaWYgKGtleSBpbiBwc2V1ZG9zKSB7XG4gICAgICAgIGtleSA9IHBzZXVkb3Nba2V5XTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogYWxsb3dzIHRoZSB1c2VyIHRvIHVzZSB0aGVtZSB0b2tlbnMgaW4gY3NzIHZhcnNcbiAgICAgICAqIHsgLS1iYW5uZXItaGVpZ2h0OiBcInNpemVzLm1kXCIgfSA9PiB7IC0tYmFubmVyLWhlaWdodDogXCJ2YXIoLS1jaGFrcmEtc2l6ZXMtbWQpXCIgfVxuICAgICAgICpcbiAgICAgICAqIFlvdSBjYW4gYWxzbyBwcm92aWRlIGZhbGxiYWNrIHZhbHVlc1xuICAgICAgICogeyAtLWJhbm5lci1oZWlnaHQ6IFwic2l6ZXMubm8tZXhpc3QsIDQwcHhcIiB9ID0+IHsgLS1iYW5uZXItaGVpZ2h0OiBcIjQwcHhcIiB9XG4gICAgICAgKi9cblxuXG4gICAgICBpZiAoaXNDU1NWYXJpYWJsZVRva2VuVmFsdWUoa2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSByZXNvbHZlVG9rZW5WYWx1ZSh0aGVtZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29uZmlnID0gY29uZmlnc1trZXldO1xuXG4gICAgICBpZiAoY29uZmlnID09PSB0cnVlKSB7XG4gICAgICAgIGNvbmZpZyA9IHtcbiAgICAgICAgICBwcm9wZXJ0eToga2V5XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIF9jb21wdXRlZFN0eWxlcyRrZXk7XG5cbiAgICAgICAgY29tcHV0ZWRTdHlsZXNba2V5XSA9IChfY29tcHV0ZWRTdHlsZXMka2V5ID0gY29tcHV0ZWRTdHlsZXNba2V5XSkgIT0gbnVsbCA/IF9jb21wdXRlZFN0eWxlcyRrZXkgOiB7fTtcbiAgICAgICAgY29tcHV0ZWRTdHlsZXNba2V5XSA9IG1lcmdlKHt9LCBjb21wdXRlZFN0eWxlc1trZXldLCBjc3ModmFsdWUsIHRydWUpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciByYXdWYWx1ZSA9IChfY29uZmlnJHRyYW5zZm9ybSA9IChfY29uZmlnID0gY29uZmlnKSA9PSBudWxsID8gdm9pZCAwIDogX2NvbmZpZy50cmFuc2Zvcm0gPT0gbnVsbCA/IHZvaWQgMCA6IF9jb25maWcudHJhbnNmb3JtKHZhbHVlLCB0aGVtZSwgX3N0eWxlcykpICE9IG51bGwgPyBfY29uZmlnJHRyYW5zZm9ybSA6IHZhbHVlO1xuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIGZvciBgbGF5ZXJTdHlsZWAsIGB0ZXh0U3R5bGVgIGFuZCBgYXBwbHlgLiBBZnRlciBnZXR0aW5nIHRoZVxuICAgICAgICogc3R5bGVzIGluIHRoZSB0aGVtZSwgd2UgbmVlZCB0byBwcm9jZXNzIHRoZW0gc2luY2UgdGhleSBtaWdodFxuICAgICAgICogY29udGFpbiB0aGVtZSB0b2tlbnMuXG4gICAgICAgKlxuICAgICAgICogYHByb2Nlc3NSZXN1bHRgIGlzIHRoZSBjb25maWcgcHJvcGVydHkgd2UgcGFzcyB0byBgbGF5ZXJTdHlsZWAsIGB0ZXh0U3R5bGVgIGFuZCBgYXBwbHlgXG4gICAgICAgKi9cblxuICAgICAgcmF3VmFsdWUgPSAoX2NvbmZpZzIgPSBjb25maWcpICE9IG51bGwgJiYgX2NvbmZpZzIucHJvY2Vzc1Jlc3VsdCA/IGNzcyhyYXdWYWx1ZSwgdHJ1ZSkgOiByYXdWYWx1ZTtcbiAgICAgIC8qKlxuICAgICAgICogYWxsb3dzIHVzIGRlZmluZSBjc3MgcHJvcGVydGllcyBmb3IgUlRMIGFuZCBMVFIuXG4gICAgICAgKlxuICAgICAgICogY29uc3QgbWFyZ2luU3RhcnQgPSB7XG4gICAgICAgKiAgIHByb3BlcnR5OiB0aGVtZSA9PiB0aGVtZS5kaXJlY3Rpb24gPT09IFwicnRsXCIgPyBcIm1hcmdpblJpZ2h0XCI6IFwibWFyZ2luTGVmdFwiLFxuICAgICAgICogfVxuICAgICAgICovXG5cbiAgICAgIHZhciBjb25maWdQcm9wZXJ0eSA9IHJ1bklmRm4oKF9jb25maWczID0gY29uZmlnKSA9PSBudWxsID8gdm9pZCAwIDogX2NvbmZpZzMucHJvcGVydHksIHRoZW1lKTtcblxuICAgICAgaWYgKCFuZXN0ZWQgJiYgKF9jb25maWc0ID0gY29uZmlnKSAhPSBudWxsICYmIF9jb25maWc0LnN0YXRpYykge1xuICAgICAgICB2YXIgc3RhdGljU3R5bGVzID0gcnVuSWZGbihjb25maWcuc3RhdGljLCB0aGVtZSk7XG4gICAgICAgIGNvbXB1dGVkU3R5bGVzID0gbWVyZ2Uoe30sIGNvbXB1dGVkU3R5bGVzLCBzdGF0aWNTdHlsZXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnUHJvcGVydHkgJiYgQXJyYXkuaXNBcnJheShjb25maWdQcm9wZXJ0eSkpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgb2YgY29uZmlnUHJvcGVydHkpIHtcbiAgICAgICAgICBjb21wdXRlZFN0eWxlc1twcm9wZXJ0eV0gPSByYXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ1Byb3BlcnR5ID09PSBcIiZcIiAmJiBpc09iamVjdChyYXdWYWx1ZSkpIHtcbiAgICAgICAgICBjb21wdXRlZFN0eWxlcyA9IG1lcmdlKHt9LCBjb21wdXRlZFN0eWxlcywgcmF3VmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXB1dGVkU3R5bGVzW2NvbmZpZ1Byb3BlcnR5XSA9IHJhd1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc09iamVjdChyYXdWYWx1ZSkpIHtcbiAgICAgICAgY29tcHV0ZWRTdHlsZXMgPSBtZXJnZSh7fSwgY29tcHV0ZWRTdHlsZXMsIHJhd1ZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbXB1dGVkU3R5bGVzW2tleV0gPSByYXdWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcHV0ZWRTdHlsZXM7XG4gIH07XG5cbiAgcmV0dXJuIGNzcztcbn1cbmV4cG9ydCB2YXIgY3NzID0gc3R5bGVzID0+IHRoZW1lID0+IHtcbiAgdmFyIGNzc0ZuID0gZ2V0Q3NzKHtcbiAgICB0aGVtZSxcbiAgICBwc2V1ZG9zOiBwc2V1ZG9TZWxlY3RvcnMsXG4gICAgY29uZmlnczogc3lzdGVtUHJvcENvbmZpZ3NcbiAgfSk7XG4gIHJldHVybiBjc3NGbihzdHlsZXMpO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNzcy5qcy5tYXAiLCIvKipcbiAqIFRoYW5rIHlvdSBAbWFya2RhbGdsZWlzaCBmb3IgdGhpcyBwaWVjZSBvZiBhcnQhXG4gKi9cbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZVJlZmVyZW5jZShvcGVyYW5kKSB7XG4gIGlmIChpc09iamVjdChvcGVyYW5kKSAmJiBvcGVyYW5kLnJlZmVyZW5jZSkge1xuICAgIHJldHVybiBvcGVyYW5kLnJlZmVyZW5jZTtcbiAgfVxuXG4gIHJldHVybiBTdHJpbmcob3BlcmFuZCk7XG59XG5cbnZhciB0b0V4cHJlc3Npb24gPSBmdW5jdGlvbiB0b0V4cHJlc3Npb24ob3BlcmF0b3IpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG9wZXJhbmRzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBvcGVyYW5kc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gb3BlcmFuZHMubWFwKHJlc29sdmVSZWZlcmVuY2UpLmpvaW4oXCIgXCIgKyBvcGVyYXRvciArIFwiIFwiKS5yZXBsYWNlKC9jYWxjL2csIFwiXCIpO1xufTtcblxudmFyIF9hZGQgPSBmdW5jdGlvbiBhZGQoKSB7XG4gIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICBvcGVyYW5kc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG5cbiAgcmV0dXJuIFwiY2FsYyhcIiArIHRvRXhwcmVzc2lvbihcIitcIiwgLi4ub3BlcmFuZHMpICsgXCIpXCI7XG59O1xuXG52YXIgX3N1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QoKSB7XG4gIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICBvcGVyYW5kc1tfa2V5M10gPSBhcmd1bWVudHNbX2tleTNdO1xuICB9XG5cbiAgcmV0dXJuIFwiY2FsYyhcIiArIHRvRXhwcmVzc2lvbihcIi1cIiwgLi4ub3BlcmFuZHMpICsgXCIpXCI7XG59O1xuXG52YXIgX211bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkoKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBvcGVyYW5kc1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgcmV0dXJuIFwiY2FsYyhcIiArIHRvRXhwcmVzc2lvbihcIipcIiwgLi4ub3BlcmFuZHMpICsgXCIpXCI7XG59O1xuXG52YXIgX2RpdmlkZSA9IGZ1bmN0aW9uIGRpdmlkZSgpIHtcbiAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuNSksIF9rZXk1ID0gMDsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuICAgIG9wZXJhbmRzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG4gIH1cblxuICByZXR1cm4gXCJjYWxjKFwiICsgdG9FeHByZXNzaW9uKFwiL1wiLCAuLi5vcGVyYW5kcykgKyBcIilcIjtcbn07XG5cbnZhciBfbmVnYXRlID0geCA9PiB7XG4gIHZhciB2YWx1ZSA9IHJlc29sdmVSZWZlcmVuY2UoeCk7XG5cbiAgaWYgKHZhbHVlICE9IG51bGwgJiYgIU51bWJlci5pc05hTihwYXJzZUZsb2F0KHZhbHVlKSkpIHtcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKS5zdGFydHNXaXRoKFwiLVwiKSA/IFN0cmluZyh2YWx1ZSkuc2xpY2UoMSkgOiBcIi1cIiArIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIF9tdWx0aXBseSh2YWx1ZSwgLTEpO1xufTtcblxuZXhwb3J0IHZhciBjYWxjID0gT2JqZWN0LmFzc2lnbih4ID0+ICh7XG4gIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcbiAgICAgIG9wZXJhbmRzW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGMoX2FkZCh4LCAuLi5vcGVyYW5kcykpO1xuICB9LFxuICBzdWJ0cmFjdDogZnVuY3Rpb24gc3VidHJhY3QoKSB7XG4gICAgZm9yICh2YXIgX2xlbjcgPSBhcmd1bWVudHMubGVuZ3RoLCBvcGVyYW5kcyA9IG5ldyBBcnJheShfbGVuNyksIF9rZXk3ID0gMDsgX2tleTcgPCBfbGVuNzsgX2tleTcrKykge1xuICAgICAgb3BlcmFuZHNbX2tleTddID0gYXJndW1lbnRzW19rZXk3XTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FsYyhfc3VidHJhY3QoeCwgLi4ub3BlcmFuZHMpKTtcbiAgfSxcbiAgbXVsdGlwbHk6IGZ1bmN0aW9uIG11bHRpcGx5KCkge1xuICAgIGZvciAodmFyIF9sZW44ID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjgpLCBfa2V5OCA9IDA7IF9rZXk4IDwgX2xlbjg7IF9rZXk4KyspIHtcbiAgICAgIG9wZXJhbmRzW19rZXk4XSA9IGFyZ3VtZW50c1tfa2V5OF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGMoX211bHRpcGx5KHgsIC4uLm9wZXJhbmRzKSk7XG4gIH0sXG4gIGRpdmlkZTogZnVuY3Rpb24gZGl2aWRlKCkge1xuICAgIGZvciAodmFyIF9sZW45ID0gYXJndW1lbnRzLmxlbmd0aCwgb3BlcmFuZHMgPSBuZXcgQXJyYXkoX2xlbjkpLCBfa2V5OSA9IDA7IF9rZXk5IDwgX2xlbjk7IF9rZXk5KyspIHtcbiAgICAgIG9wZXJhbmRzW19rZXk5XSA9IGFyZ3VtZW50c1tfa2V5OV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGMoX2RpdmlkZSh4LCAuLi5vcGVyYW5kcykpO1xuICB9LFxuICBuZWdhdGU6ICgpID0+IGNhbGMoX25lZ2F0ZSh4KSksXG4gIHRvU3RyaW5nOiAoKSA9PiB4LnRvU3RyaW5nKClcbn0pLCB7XG4gIGFkZDogX2FkZCxcbiAgc3VidHJhY3Q6IF9zdWJ0cmFjdCxcbiAgbXVsdGlwbHk6IF9tdWx0aXBseSxcbiAgZGl2aWRlOiBfZGl2aWRlLFxuICBuZWdhdGU6IF9uZWdhdGVcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FsYy5qcy5tYXAiLCIvKlxuXG5CYXNlZCBvZmYgZ2xhbW9yJ3MgU3R5bGVTaGVldCwgdGhhbmtzIFN1bmlsIOKdpO+4j1xuXG5oaWdoIHBlcmZvcm1hbmNlIFN0eWxlU2hlZXQgZm9yIGNzcy1pbi1qcyBzeXN0ZW1zXG5cbi0gdXNlcyBtdWx0aXBsZSBzdHlsZSB0YWdzIGJlaGluZCB0aGUgc2NlbmVzIGZvciBtaWxsaW9ucyBvZiBydWxlc1xuLSB1c2VzIGBpbnNlcnRSdWxlYCBmb3IgYXBwZW5kaW5nIGluIHByb2R1Y3Rpb24gZm9yICptdWNoKiBmYXN0ZXIgcGVyZm9ybWFuY2VcblxuLy8gdXNhZ2VcblxuaW1wb3J0IHsgU3R5bGVTaGVldCB9IGZyb20gJ0BlbW90aW9uL3NoZWV0J1xuXG5sZXQgc3R5bGVTaGVldCA9IG5ldyBTdHlsZVNoZWV0KHsga2V5OiAnJywgY29udGFpbmVyOiBkb2N1bWVudC5oZWFkIH0pXG5cbnN0eWxlU2hlZXQuaW5zZXJ0KCcjYm94IHsgYm9yZGVyOiAxcHggc29saWQgcmVkOyB9Jylcbi0gYXBwZW5kcyBhIGNzcyBydWxlIGludG8gdGhlIHN0eWxlc2hlZXRcblxuc3R5bGVTaGVldC5mbHVzaCgpXG4tIGVtcHRpZXMgdGhlIHN0eWxlc2hlZXQgb2YgYWxsIGl0cyBjb250ZW50c1xuXG4qL1xuLy8gJEZsb3dGaXhNZVxuZnVuY3Rpb24gc2hlZXRGb3JUYWcodGFnKSB7XG4gIGlmICh0YWcuc2hlZXQpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuIHRhZy5zaGVldDtcbiAgfSAvLyB0aGlzIHdlaXJkbmVzcyBicm91Z2h0IHRvIHlvdSBieSBmaXJlZm94XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0ub3duZXJOb2RlID09PSB0YWcpIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHJldHVybiBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHRhZy5zZXRBdHRyaWJ1dGUoJ2RhdGEtZW1vdGlvbicsIG9wdGlvbnMua2V5KTtcblxuICBpZiAob3B0aW9ucy5ub25jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGFnLnNldEF0dHJpYnV0ZSgnbm9uY2UnLCBvcHRpb25zLm5vbmNlKTtcbiAgfVxuXG4gIHRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xuICB0YWcuc2V0QXR0cmlidXRlKCdkYXRhLXMnLCAnJyk7XG4gIHJldHVybiB0YWc7XG59XG5cbnZhciBTdHlsZVNoZWV0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3R5bGVTaGVldChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX2luc2VydFRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgIHZhciBiZWZvcmU7XG5cbiAgICAgIGlmIChfdGhpcy50YWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBiZWZvcmUgPSBfdGhpcy5wcmVwZW5kID8gX3RoaXMuY29udGFpbmVyLmZpcnN0Q2hpbGQgOiBfdGhpcy5iZWZvcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiZWZvcmUgPSBfdGhpcy50YWdzW190aGlzLnRhZ3MubGVuZ3RoIC0gMV0ubmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGFnLCBiZWZvcmUpO1xuXG4gICAgICBfdGhpcy50YWdzLnB1c2godGFnKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1NwZWVkeSA9IG9wdGlvbnMuc3BlZWR5ID09PSB1bmRlZmluZWQgPyBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nIDogb3B0aW9ucy5zcGVlZHk7XG4gICAgdGhpcy50YWdzID0gW107XG4gICAgdGhpcy5jdHIgPSAwO1xuICAgIHRoaXMubm9uY2UgPSBvcHRpb25zLm5vbmNlOyAvLyBrZXkgaXMgdGhlIHZhbHVlIG9mIHRoZSBkYXRhLWVtb3Rpb24gYXR0cmlidXRlLCBpdCdzIHVzZWQgdG8gaWRlbnRpZnkgZGlmZmVyZW50IHNoZWV0c1xuXG4gICAgdGhpcy5rZXkgPSBvcHRpb25zLmtleTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyO1xuICAgIHRoaXMucHJlcGVuZCA9IG9wdGlvbnMucHJlcGVuZDtcbiAgICB0aGlzLmJlZm9yZSA9IG51bGw7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3R5bGVTaGVldC5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmh5ZHJhdGUgPSBmdW5jdGlvbiBoeWRyYXRlKG5vZGVzKSB7XG4gICAgbm9kZXMuZm9yRWFjaCh0aGlzLl9pbnNlcnRUYWcpO1xuICB9O1xuXG4gIF9wcm90by5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQocnVsZSkge1xuICAgIC8vIHRoZSBtYXggbGVuZ3RoIGlzIGhvdyBtYW55IHJ1bGVzIHdlIGhhdmUgcGVyIHN0eWxlIHRhZywgaXQncyA2NTAwMCBpbiBzcGVlZHkgbW9kZVxuICAgIC8vIGl0J3MgMSBpbiBkZXYgYmVjYXVzZSB3ZSBpbnNlcnQgc291cmNlIG1hcHMgdGhhdCBtYXAgYSBzaW5nbGUgcnVsZSB0byBhIGxvY2F0aW9uXG4gICAgLy8gYW5kIHlvdSBjYW4gb25seSBoYXZlIG9uZSBzb3VyY2UgbWFwIHBlciBzdHlsZSB0YWdcbiAgICBpZiAodGhpcy5jdHIgJSAodGhpcy5pc1NwZWVkeSA/IDY1MDAwIDogMSkgPT09IDApIHtcbiAgICAgIHRoaXMuX2luc2VydFRhZyhjcmVhdGVTdHlsZUVsZW1lbnQodGhpcykpO1xuICAgIH1cblxuICAgIHZhciB0YWcgPSB0aGlzLnRhZ3NbdGhpcy50YWdzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBpc0ltcG9ydFJ1bGUgPSBydWxlLmNoYXJDb2RlQXQoMCkgPT09IDY0ICYmIHJ1bGUuY2hhckNvZGVBdCgxKSA9PT0gMTA1O1xuXG4gICAgICBpZiAoaXNJbXBvcnRSdWxlICYmIHRoaXMuX2FscmVhZHlJbnNlcnRlZE9yZGVySW5zZW5zaXRpdmVSdWxlKSB7XG4gICAgICAgIC8vIHRoaXMgd291bGQgb25seSBjYXVzZSBwcm9ibGVtIGluIHNwZWVkeSBtb2RlXG4gICAgICAgIC8vIGJ1dCB3ZSBkb24ndCB3YW50IGVuYWJsaW5nIHNwZWVkeSB0byBhZmZlY3QgdGhlIG9ic2VydmFibGUgYmVoYXZpb3JcbiAgICAgICAgLy8gc28gd2UgcmVwb3J0IHRoaXMgZXJyb3IgYXQgYWxsIHRpbWVzXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJZb3UncmUgYXR0ZW1wdGluZyB0byBpbnNlcnQgdGhlIGZvbGxvd2luZyBydWxlOlxcblwiICsgcnVsZSArICdcXG5cXG5gQGltcG9ydGAgcnVsZXMgbXVzdCBiZSBiZWZvcmUgYWxsIG90aGVyIHR5cGVzIG9mIHJ1bGVzIGluIGEgc3R5bGVzaGVldCBidXQgb3RoZXIgcnVsZXMgaGF2ZSBhbHJlYWR5IGJlZW4gaW5zZXJ0ZWQuIFBsZWFzZSBlbnN1cmUgdGhhdCBgQGltcG9ydGAgcnVsZXMgYXJlIGJlZm9yZSBhbGwgb3RoZXIgcnVsZXMuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9hbHJlYWR5SW5zZXJ0ZWRPcmRlckluc2Vuc2l0aXZlUnVsZSA9IHRoaXMuX2FscmVhZHlJbnNlcnRlZE9yZGVySW5zZW5zaXRpdmVSdWxlIHx8ICFpc0ltcG9ydFJ1bGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTcGVlZHkpIHtcbiAgICAgIHZhciBzaGVldCA9IHNoZWV0Rm9yVGFnKHRhZyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIHVsdHJhZmFzdCB2ZXJzaW9uLCB3b3JrcyBhY3Jvc3MgYnJvd3NlcnNcbiAgICAgICAgLy8gdGhlIGJpZyBkcmF3YmFjayBpcyB0aGF0IHRoZSBjc3Mgd29uJ3QgYmUgZWRpdGFibGUgaW4gZGV2dG9vbHNcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShydWxlLCBzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhLzooLW1vei1wbGFjZWhvbGRlcnwtbXMtaW5wdXQtcGxhY2Vob2xkZXJ8LW1vei1yZWFkLXdyaXRlfC1tb3otcmVhZC1vbmx5KXsvLnRlc3QocnVsZSkpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUgd2FzIGEgcHJvYmxlbSBpbnNlcnRpbmcgdGhlIGZvbGxvd2luZyBydWxlOiBcXFwiXCIgKyBydWxlICsgXCJcXFwiXCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdHIrKztcbiAgfTtcblxuICBfcHJvdG8uZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy50YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuICAgICAgcmV0dXJuIHRhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhZyk7XG4gICAgfSk7XG4gICAgdGhpcy50YWdzID0gW107XG4gICAgdGhpcy5jdHIgPSAwO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHRoaXMuX2FscmVhZHlJbnNlcnRlZE9yZGVySW5zZW5zaXRpdmVSdWxlID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTdHlsZVNoZWV0O1xufSgpO1xuXG5leHBvcnQgeyBTdHlsZVNoZWV0IH07XG4iLCJ2YXIgZSA9IFwiLW1zLVwiO1xudmFyIHIgPSBcIi1tb3otXCI7XG52YXIgYSA9IFwiLXdlYmtpdC1cIjtcbnZhciBjID0gXCJjb21tXCI7XG52YXIgbiA9IFwicnVsZVwiO1xudmFyIHQgPSBcImRlY2xcIjtcbnZhciBzID0gXCJAcGFnZVwiO1xudmFyIHUgPSBcIkBtZWRpYVwiO1xudmFyIGkgPSBcIkBpbXBvcnRcIjtcbnZhciBmID0gXCJAY2hhcnNldFwiO1xudmFyIG8gPSBcIkB2aWV3cG9ydFwiO1xudmFyIGwgPSBcIkBzdXBwb3J0c1wiO1xudmFyIHYgPSBcIkBkb2N1bWVudFwiO1xudmFyIGggPSBcIkBuYW1lc3BhY2VcIjtcbnZhciBwID0gXCJAa2V5ZnJhbWVzXCI7XG52YXIgYiA9IFwiQGZvbnQtZmFjZVwiO1xudmFyIHcgPSBcIkBjb3VudGVyLXN0eWxlXCI7XG52YXIgJCA9IFwiQGZvbnQtZmVhdHVyZS12YWx1ZXNcIjtcbnZhciBrID0gTWF0aC5hYnM7XG52YXIgZCA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5mdW5jdGlvbiBtKGUyLCByMikge1xuICByZXR1cm4gKCgocjIgPDwgMiBeIHooZTIsIDApKSA8PCAyIF4geihlMiwgMSkpIDw8IDIgXiB6KGUyLCAyKSkgPDwgMiBeIHooZTIsIDMpO1xufVxuZnVuY3Rpb24gZyhlMikge1xuICByZXR1cm4gZTIudHJpbSgpO1xufVxuZnVuY3Rpb24geChlMiwgcjIpIHtcbiAgcmV0dXJuIChlMiA9IHIyLmV4ZWMoZTIpKSA/IGUyWzBdIDogZTI7XG59XG5mdW5jdGlvbiB5KGUyLCByMiwgYTIpIHtcbiAgcmV0dXJuIGUyLnJlcGxhY2UocjIsIGEyKTtcbn1cbmZ1bmN0aW9uIGooZTIsIHIyKSB7XG4gIHJldHVybiBlMi5pbmRleE9mKHIyKTtcbn1cbmZ1bmN0aW9uIHooZTIsIHIyKSB7XG4gIHJldHVybiBlMi5jaGFyQ29kZUF0KHIyKSB8IDA7XG59XG5mdW5jdGlvbiBDKGUyLCByMiwgYTIpIHtcbiAgcmV0dXJuIGUyLnNsaWNlKHIyLCBhMik7XG59XG5mdW5jdGlvbiBBKGUyKSB7XG4gIHJldHVybiBlMi5sZW5ndGg7XG59XG5mdW5jdGlvbiBNKGUyKSB7XG4gIHJldHVybiBlMi5sZW5ndGg7XG59XG5mdW5jdGlvbiBPKGUyLCByMikge1xuICByZXR1cm4gcjIucHVzaChlMiksIGUyO1xufVxuZnVuY3Rpb24gUyhlMiwgcjIpIHtcbiAgcmV0dXJuIGUyLm1hcChyMikuam9pbihcIlwiKTtcbn1cbnZhciBxID0gMTtcbnZhciBCID0gMTtcbnZhciBEID0gMDtcbnZhciBFID0gMDtcbnZhciBGID0gMDtcbnZhciBHID0gXCJcIjtcbmZ1bmN0aW9uIEgoZTIsIHIyLCBhMiwgYzIsIG4yLCB0MiwgczIpIHtcbiAgcmV0dXJuIHt2YWx1ZTogZTIsIHJvb3Q6IHIyLCBwYXJlbnQ6IGEyLCB0eXBlOiBjMiwgcHJvcHM6IG4yLCBjaGlsZHJlbjogdDIsIGxpbmU6IHEsIGNvbHVtbjogQiwgbGVuZ3RoOiBzMiwgcmV0dXJuOiBcIlwifTtcbn1cbmZ1bmN0aW9uIEkoZTIsIHIyLCBhMikge1xuICByZXR1cm4gSChlMiwgcjIucm9vdCwgcjIucGFyZW50LCBhMiwgcjIucHJvcHMsIHIyLmNoaWxkcmVuLCAwKTtcbn1cbmZ1bmN0aW9uIEooKSB7XG4gIHJldHVybiBGO1xufVxuZnVuY3Rpb24gSygpIHtcbiAgRiA9IEUgPiAwID8geihHLCAtLUUpIDogMDtcbiAgaWYgKEItLSwgRiA9PT0gMTApXG4gICAgQiA9IDEsIHEtLTtcbiAgcmV0dXJuIEY7XG59XG5mdW5jdGlvbiBMKCkge1xuICBGID0gRSA8IEQgPyB6KEcsIEUrKykgOiAwO1xuICBpZiAoQisrLCBGID09PSAxMClcbiAgICBCID0gMSwgcSsrO1xuICByZXR1cm4gRjtcbn1cbmZ1bmN0aW9uIE4oKSB7XG4gIHJldHVybiB6KEcsIEUpO1xufVxuZnVuY3Rpb24gUCgpIHtcbiAgcmV0dXJuIEU7XG59XG5mdW5jdGlvbiBRKGUyLCByMikge1xuICByZXR1cm4gQyhHLCBlMiwgcjIpO1xufVxuZnVuY3Rpb24gUihlMikge1xuICBzd2l0Y2ggKGUyKSB7XG4gICAgY2FzZSAwOlxuICAgIGNhc2UgOTpcbiAgICBjYXNlIDEwOlxuICAgIGNhc2UgMTM6XG4gICAgY2FzZSAzMjpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgMzM6XG4gICAgY2FzZSA0MzpcbiAgICBjYXNlIDQ0OlxuICAgIGNhc2UgNDc6XG4gICAgY2FzZSA2MjpcbiAgICBjYXNlIDY0OlxuICAgIGNhc2UgMTI2OlxuICAgIGNhc2UgNTk6XG4gICAgY2FzZSAxMjM6XG4gICAgY2FzZSAxMjU6XG4gICAgICByZXR1cm4gNDtcbiAgICBjYXNlIDU4OlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSAzNDpcbiAgICBjYXNlIDM5OlxuICAgIGNhc2UgNDA6XG4gICAgY2FzZSA5MTpcbiAgICAgIHJldHVybiAyO1xuICAgIGNhc2UgNDE6XG4gICAgY2FzZSA5MzpcbiAgICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gVChlMikge1xuICByZXR1cm4gcSA9IEIgPSAxLCBEID0gQShHID0gZTIpLCBFID0gMCwgW107XG59XG5mdW5jdGlvbiBVKGUyKSB7XG4gIHJldHVybiBHID0gXCJcIiwgZTI7XG59XG5mdW5jdGlvbiBWKGUyKSB7XG4gIHJldHVybiBnKFEoRSAtIDEsIF8oZTIgPT09IDkxID8gZTIgKyAyIDogZTIgPT09IDQwID8gZTIgKyAxIDogZTIpKSk7XG59XG5mdW5jdGlvbiBXKGUyKSB7XG4gIHJldHVybiBVKFkoVChlMikpKTtcbn1cbmZ1bmN0aW9uIFgoZTIpIHtcbiAgd2hpbGUgKEYgPSBOKCkpXG4gICAgaWYgKEYgPCAzMylcbiAgICAgIEwoKTtcbiAgICBlbHNlXG4gICAgICBicmVhaztcbiAgcmV0dXJuIFIoZTIpID4gMiB8fCBSKEYpID4gMyA/IFwiXCIgOiBcIiBcIjtcbn1cbmZ1bmN0aW9uIFkoZTIpIHtcbiAgd2hpbGUgKEwoKSlcbiAgICBzd2l0Y2ggKFIoRikpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgTyhyZShFIC0gMSksIGUyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIE8oVihGKSwgZTIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIE8oZChGKSwgZTIpO1xuICAgIH1cbiAgcmV0dXJuIGUyO1xufVxuZnVuY3Rpb24gWihlMiwgcjIpIHtcbiAgd2hpbGUgKC0tcjIgJiYgTCgpKVxuICAgIGlmIChGIDwgNDggfHwgRiA+IDEwMiB8fCBGID4gNTcgJiYgRiA8IDY1IHx8IEYgPiA3MCAmJiBGIDwgOTcpXG4gICAgICBicmVhaztcbiAgcmV0dXJuIFEoZTIsIFAoKSArIChyMiA8IDYgJiYgTigpID09IDMyICYmIEwoKSA9PSAzMikpO1xufVxuZnVuY3Rpb24gXyhlMikge1xuICB3aGlsZSAoTCgpKVxuICAgIHN3aXRjaCAoRikge1xuICAgICAgY2FzZSBlMjpcbiAgICAgICAgcmV0dXJuIEU7XG4gICAgICBjYXNlIDM0OlxuICAgICAgY2FzZSAzOTpcbiAgICAgICAgcmV0dXJuIF8oZTIgPT09IDM0IHx8IGUyID09PSAzOSA/IGUyIDogRik7XG4gICAgICBjYXNlIDQwOlxuICAgICAgICBpZiAoZTIgPT09IDQxKVxuICAgICAgICAgIF8oZTIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgOTI6XG4gICAgICAgIEwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICByZXR1cm4gRTtcbn1cbmZ1bmN0aW9uIGVlKGUyLCByMikge1xuICB3aGlsZSAoTCgpKVxuICAgIGlmIChlMiArIEYgPT09IDQ3ICsgMTApXG4gICAgICBicmVhaztcbiAgICBlbHNlIGlmIChlMiArIEYgPT09IDQyICsgNDIgJiYgTigpID09PSA0NylcbiAgICAgIGJyZWFrO1xuICByZXR1cm4gXCIvKlwiICsgUShyMiwgRSAtIDEpICsgXCIqXCIgKyBkKGUyID09PSA0NyA/IGUyIDogTCgpKTtcbn1cbmZ1bmN0aW9uIHJlKGUyKSB7XG4gIHdoaWxlICghUihOKCkpKVxuICAgIEwoKTtcbiAgcmV0dXJuIFEoZTIsIEUpO1xufVxuZnVuY3Rpb24gYWUoZTIpIHtcbiAgcmV0dXJuIFUoY2UoXCJcIiwgbnVsbCwgbnVsbCwgbnVsbCwgW1wiXCJdLCBlMiA9IFQoZTIpLCAwLCBbMF0sIGUyKSk7XG59XG5mdW5jdGlvbiBjZShlMiwgcjIsIGEyLCBjMiwgbjIsIHQyLCBzMiwgdTIsIGkyKSB7XG4gIHZhciBmMiA9IDA7XG4gIHZhciBvMiA9IDA7XG4gIHZhciBsMiA9IHMyO1xuICB2YXIgdjIgPSAwO1xuICB2YXIgaDIgPSAwO1xuICB2YXIgcDIgPSAwO1xuICB2YXIgYjIgPSAxO1xuICB2YXIgdzIgPSAxO1xuICB2YXIgJDIgPSAxO1xuICB2YXIgazIgPSAwO1xuICB2YXIgbTIgPSBcIlwiO1xuICB2YXIgZzIgPSBuMjtcbiAgdmFyIHgyID0gdDI7XG4gIHZhciBqMiA9IGMyO1xuICB2YXIgejIgPSBtMjtcbiAgd2hpbGUgKHcyKVxuICAgIHN3aXRjaCAocDIgPSBrMiwgazIgPSBMKCkpIHtcbiAgICAgIGNhc2UgMzQ6XG4gICAgICBjYXNlIDM5OlxuICAgICAgY2FzZSA5MTpcbiAgICAgIGNhc2UgNDA6XG4gICAgICAgIHoyICs9IFYoazIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgOTpcbiAgICAgIGNhc2UgMTA6XG4gICAgICBjYXNlIDEzOlxuICAgICAgY2FzZSAzMjpcbiAgICAgICAgejIgKz0gWChwMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA5MjpcbiAgICAgICAgejIgKz0gWihQKCkgLSAxLCA3KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICBjYXNlIDQ3OlxuICAgICAgICBzd2l0Y2ggKE4oKSkge1xuICAgICAgICAgIGNhc2UgNDI6XG4gICAgICAgICAgY2FzZSA0NzpcbiAgICAgICAgICAgIE8odGUoZWUoTCgpLCBQKCkpLCByMiwgYTIpLCBpMik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgejIgKz0gXCIvXCI7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDEyMyAqIGIyOlxuICAgICAgICB1MltmMisrXSA9IEEoejIpICogJDI7XG4gICAgICBjYXNlIDEyNSAqIGIyOlxuICAgICAgY2FzZSA1OTpcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc3dpdGNoIChrMikge1xuICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBjYXNlIDEyNTpcbiAgICAgICAgICAgIHcyID0gMDtcbiAgICAgICAgICBjYXNlIDU5ICsgbzI6XG4gICAgICAgICAgICBpZiAoaDIgPiAwICYmIEEoejIpIC0gbDIpXG4gICAgICAgICAgICAgIE8oaDIgPiAzMiA/IHNlKHoyICsgXCI7XCIsIGMyLCBhMiwgbDIgLSAxKSA6IHNlKHkoejIsIFwiIFwiLCBcIlwiKSArIFwiO1wiLCBjMiwgYTIsIGwyIC0gMiksIGkyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNTk6XG4gICAgICAgICAgICB6MiArPSBcIjtcIjtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgTyhqMiA9IG5lKHoyLCByMiwgYTIsIGYyLCBvMiwgbjIsIHUyLCBtMiwgZzIgPSBbXSwgeDIgPSBbXSwgbDIpLCB0Mik7XG4gICAgICAgICAgICBpZiAoazIgPT09IDEyMylcbiAgICAgICAgICAgICAgaWYgKG8yID09PSAwKVxuICAgICAgICAgICAgICAgIGNlKHoyLCByMiwgajIsIGoyLCBnMiwgdDIsIGwyLCB1MiwgeDIpO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3dpdGNoICh2Mikge1xuICAgICAgICAgICAgICAgICAgY2FzZSAxMDA6XG4gICAgICAgICAgICAgICAgICBjYXNlIDEwOTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgMTE1OlxuICAgICAgICAgICAgICAgICAgICBjZShlMiwgajIsIGoyLCBjMiAmJiBPKG5lKGUyLCBqMiwgajIsIDAsIDAsIG4yLCB1MiwgbTIsIG4yLCBnMiA9IFtdLCBsMiksIHgyKSwgbjIsIHgyLCBsMiwgdTIsIGMyID8gZzIgOiB4Mik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY2UoejIsIGoyLCBqMiwgajIsIFtcIlwiXSwgeDIsIGwyLCB1MiwgeDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmMiA9IG8yID0gaDIgPSAwLCBiMiA9ICQyID0gMSwgbTIgPSB6MiA9IFwiXCIsIGwyID0gczI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA1ODpcbiAgICAgICAgbDIgPSAxICsgQSh6MiksIGgyID0gcDI7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoYjIgPCAxKSB7XG4gICAgICAgICAgaWYgKGsyID09IDEyMylcbiAgICAgICAgICAgIC0tYjI7XG4gICAgICAgICAgZWxzZSBpZiAoazIgPT0gMTI1ICYmIGIyKysgPT0gMCAmJiBLKCkgPT0gMTI1KVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh6MiArPSBkKGsyKSwgazIgKiBiMikge1xuICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAkMiA9IG8yID4gMCA/IDEgOiAoejIgKz0gXCJcXGZcIiwgLTEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0NDpcbiAgICAgICAgICAgIHUyW2YyKytdID0gKEEoejIpIC0gMSkgKiAkMiwgJDIgPSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA2NDpcbiAgICAgICAgICAgIGlmIChOKCkgPT09IDQ1KVxuICAgICAgICAgICAgICB6MiArPSBWKEwoKSk7XG4gICAgICAgICAgICB2MiA9IE4oKSwgbzIgPSBBKG0yID0gejIgKz0gcmUoUCgpKSksIGsyKys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ1OlxuICAgICAgICAgICAgaWYgKHAyID09PSA0NSAmJiBBKHoyKSA9PSAyKVxuICAgICAgICAgICAgICBiMiA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gIHJldHVybiB0Mjtcbn1cbmZ1bmN0aW9uIG5lKGUyLCByMiwgYTIsIGMyLCB0MiwgczIsIHUyLCBpMiwgZjIsIG8yLCBsMikge1xuICB2YXIgdjIgPSB0MiAtIDE7XG4gIHZhciBoMiA9IHQyID09PSAwID8gczIgOiBbXCJcIl07XG4gIHZhciBwMiA9IE0oaDIpO1xuICBmb3IgKHZhciBiMiA9IDAsIHcyID0gMCwgJDIgPSAwOyBiMiA8IGMyOyArK2IyKVxuICAgIGZvciAodmFyIGQyID0gMCwgbTIgPSBDKGUyLCB2MiArIDEsIHYyID0gayh3MiA9IHUyW2IyXSkpLCB4MiA9IGUyOyBkMiA8IHAyOyArK2QyKVxuICAgICAgaWYgKHgyID0gZyh3MiA+IDAgPyBoMltkMl0gKyBcIiBcIiArIG0yIDogeShtMiwgLyZcXGYvZywgaDJbZDJdKSkpXG4gICAgICAgIGYyWyQyKytdID0geDI7XG4gIHJldHVybiBIKGUyLCByMiwgYTIsIHQyID09PSAwID8gbiA6IGkyLCBmMiwgbzIsIGwyKTtcbn1cbmZ1bmN0aW9uIHRlKGUyLCByMiwgYTIpIHtcbiAgcmV0dXJuIEgoZTIsIHIyLCBhMiwgYywgZChKKCkpLCBDKGUyLCAyLCAtMiksIDApO1xufVxuZnVuY3Rpb24gc2UoZTIsIHIyLCBhMiwgYzIpIHtcbiAgcmV0dXJuIEgoZTIsIHIyLCBhMiwgdCwgQyhlMiwgMCwgYzIpLCBDKGUyLCBjMiArIDEsIC0xKSwgYzIpO1xufVxuZnVuY3Rpb24gdWUoYzIsIG4yKSB7XG4gIHN3aXRjaCAobShjMiwgbjIpKSB7XG4gICAgY2FzZSA1MTAzOlxuICAgICAgcmV0dXJuIGEgKyBcInByaW50LVwiICsgYzIgKyBjMjtcbiAgICBjYXNlIDU3Mzc6XG4gICAgY2FzZSA0MjAxOlxuICAgIGNhc2UgMzE3NzpcbiAgICBjYXNlIDM0MzM6XG4gICAgY2FzZSAxNjQxOlxuICAgIGNhc2UgNDQ1NzpcbiAgICBjYXNlIDI5MjE6XG4gICAgY2FzZSA1NTcyOlxuICAgIGNhc2UgNjM1NjpcbiAgICBjYXNlIDU4NDQ6XG4gICAgY2FzZSAzMTkxOlxuICAgIGNhc2UgNjY0NTpcbiAgICBjYXNlIDMwMDU6XG4gICAgY2FzZSA2MzkxOlxuICAgIGNhc2UgNTg3OTpcbiAgICBjYXNlIDU2MjM6XG4gICAgY2FzZSA2MTM1OlxuICAgIGNhc2UgNDU5OTpcbiAgICBjYXNlIDQ4NTU6XG4gICAgY2FzZSA0MjE1OlxuICAgIGNhc2UgNjM4OTpcbiAgICBjYXNlIDUxMDk6XG4gICAgY2FzZSA1MzY1OlxuICAgIGNhc2UgNTYyMTpcbiAgICBjYXNlIDM4Mjk6XG4gICAgICByZXR1cm4gYSArIGMyICsgYzI7XG4gICAgY2FzZSA1MzQ5OlxuICAgIGNhc2UgNDI0NjpcbiAgICBjYXNlIDQ4MTA6XG4gICAgY2FzZSA2OTY4OlxuICAgIGNhc2UgMjc1NjpcbiAgICAgIHJldHVybiBhICsgYzIgKyByICsgYzIgKyBlICsgYzIgKyBjMjtcbiAgICBjYXNlIDY4Mjg6XG4gICAgY2FzZSA0MjY4OlxuICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyBjMiArIGMyO1xuICAgIGNhc2UgNjE2NTpcbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgXCJmbGV4LVwiICsgYzIgKyBjMjtcbiAgICBjYXNlIDUxODc6XG4gICAgICByZXR1cm4gYSArIGMyICsgeShjMiwgLyhcXHcrKS4rKDpbXl0rKS8sIGEgKyBcImJveC0kMSQyXCIgKyBlICsgXCJmbGV4LSQxJDJcIikgKyBjMjtcbiAgICBjYXNlIDU0NDM6XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIFwiZmxleC1pdGVtLVwiICsgeShjMiwgL2ZsZXgtfC1zZWxmLywgXCJcIikgKyBjMjtcbiAgICBjYXNlIDQ2NzU6XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIFwiZmxleC1saW5lLXBhY2tcIiArIHkoYzIsIC9hbGlnbi1jb250ZW50fGZsZXgtfC1zZWxmLywgXCJcIikgKyBjMjtcbiAgICBjYXNlIDU1NDg6XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIHkoYzIsIFwic2hyaW5rXCIsIFwibmVnYXRpdmVcIikgKyBjMjtcbiAgICBjYXNlIDUyOTI6XG4gICAgICByZXR1cm4gYSArIGMyICsgZSArIHkoYzIsIFwiYmFzaXNcIiwgXCJwcmVmZXJyZWQtc2l6ZVwiKSArIGMyO1xuICAgIGNhc2UgNjA2MDpcbiAgICAgIHJldHVybiBhICsgXCJib3gtXCIgKyB5KGMyLCBcIi1ncm93XCIsIFwiXCIpICsgYSArIGMyICsgZSArIHkoYzIsIFwiZ3Jvd1wiLCBcInBvc2l0aXZlXCIpICsgYzI7XG4gICAgY2FzZSA0NTU0OlxuICAgICAgcmV0dXJuIGEgKyB5KGMyLCAvKFteLV0pKHRyYW5zZm9ybSkvZywgXCIkMVwiICsgYSArIFwiJDJcIikgKyBjMjtcbiAgICBjYXNlIDYxODc6XG4gICAgICByZXR1cm4geSh5KHkoYzIsIC8oem9vbS18Z3JhYikvLCBhICsgXCIkMVwiKSwgLyhpbWFnZS1zZXQpLywgYSArIFwiJDFcIiksIGMyLCBcIlwiKSArIGMyO1xuICAgIGNhc2UgNTQ5NTpcbiAgICBjYXNlIDM5NTk6XG4gICAgICByZXR1cm4geShjMiwgLyhpbWFnZS1zZXRcXChbXl0qKS8sIGEgKyBcIiQxJGAkMVwiKTtcbiAgICBjYXNlIDQ5Njg6XG4gICAgICByZXR1cm4geSh5KGMyLCAvKC4rOikoZmxleC0pPyguKikvLCBhICsgXCJib3gtcGFjazokM1wiICsgZSArIFwiZmxleC1wYWNrOiQzXCIpLCAvcy4rLWJbXjtdKy8sIFwianVzdGlmeVwiKSArIGEgKyBjMiArIGMyO1xuICAgIGNhc2UgNDA5NTpcbiAgICBjYXNlIDM1ODM6XG4gICAgY2FzZSA0MDY4OlxuICAgIGNhc2UgMjUzMjpcbiAgICAgIHJldHVybiB5KGMyLCAvKC4rKS1pbmxpbmUoLispLywgYSArIFwiJDEkMlwiKSArIGMyO1xuICAgIGNhc2UgODExNjpcbiAgICBjYXNlIDcwNTk6XG4gICAgY2FzZSA1NzUzOlxuICAgIGNhc2UgNTUzNTpcbiAgICBjYXNlIDU0NDU6XG4gICAgY2FzZSA1NzAxOlxuICAgIGNhc2UgNDkzMzpcbiAgICBjYXNlIDQ2Nzc6XG4gICAgY2FzZSA1NTMzOlxuICAgIGNhc2UgNTc4OTpcbiAgICBjYXNlIDUwMjE6XG4gICAgY2FzZSA0NzY1OlxuICAgICAgaWYgKEEoYzIpIC0gMSAtIG4yID4gNilcbiAgICAgICAgc3dpdGNoICh6KGMyLCBuMiArIDEpKSB7XG4gICAgICAgICAgY2FzZSAxMDk6XG4gICAgICAgICAgICBpZiAoeihjMiwgbjIgKyA0KSAhPT0gNDUpXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMTAyOlxuICAgICAgICAgICAgcmV0dXJuIHkoYzIsIC8oLis6KSguKyktKFteXSspLywgXCIkMVwiICsgYSArIFwiJDItJDMkMVwiICsgciArICh6KGMyLCBuMiArIDMpID09IDEwOCA/IFwiJDNcIiA6IFwiJDItJDNcIikpICsgYzI7XG4gICAgICAgICAgY2FzZSAxMTU6XG4gICAgICAgICAgICByZXR1cm4gfmooYzIsIFwic3RyZXRjaFwiKSA/IHVlKHkoYzIsIFwic3RyZXRjaFwiLCBcImZpbGwtYXZhaWxhYmxlXCIpLCBuMikgKyBjMiA6IGMyO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIDQ5NDk6XG4gICAgICBpZiAoeihjMiwgbjIgKyAxKSAhPT0gMTE1KVxuICAgICAgICBicmVhaztcbiAgICBjYXNlIDY0NDQ6XG4gICAgICBzd2l0Y2ggKHooYzIsIEEoYzIpIC0gMyAtICh+aihjMiwgXCIhaW1wb3J0YW50XCIpICYmIDEwKSkpIHtcbiAgICAgICAgY2FzZSAxMDc6XG4gICAgICAgICAgcmV0dXJuIHkoYzIsIFwiOlwiLCBcIjpcIiArIGEpICsgYzI7XG4gICAgICAgIGNhc2UgMTAxOlxuICAgICAgICAgIHJldHVybiB5KGMyLCAvKC4rOikoW147IV0rKSg7fCEuKyk/LywgXCIkMVwiICsgYSArICh6KGMyLCAxNCkgPT09IDQ1ID8gXCJpbmxpbmUtXCIgOiBcIlwiKSArIFwiYm94JDMkMVwiICsgYSArIFwiJDIkMyQxXCIgKyBlICsgXCIkMmJveCQzXCIpICsgYzI7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIDU5MzY6XG4gICAgICBzd2l0Y2ggKHooYzIsIG4yICsgMTEpKSB7XG4gICAgICAgIGNhc2UgMTE0OlxuICAgICAgICAgIHJldHVybiBhICsgYzIgKyBlICsgeShjMiwgL1tzdmhdXFx3Ky1bdGJscl17Mn0vLCBcInRiXCIpICsgYzI7XG4gICAgICAgIGNhc2UgMTA4OlxuICAgICAgICAgIHJldHVybiBhICsgYzIgKyBlICsgeShjMiwgL1tzdmhdXFx3Ky1bdGJscl17Mn0vLCBcInRiLXJsXCIpICsgYzI7XG4gICAgICAgIGNhc2UgNDU6XG4gICAgICAgICAgcmV0dXJuIGEgKyBjMiArIGUgKyB5KGMyLCAvW3N2aF1cXHcrLVt0YmxyXXsyfS8sIFwibHJcIikgKyBjMjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhICsgYzIgKyBlICsgYzIgKyBjMjtcbiAgfVxuICByZXR1cm4gYzI7XG59XG5mdW5jdGlvbiBpZShlMiwgcjIpIHtcbiAgdmFyIGEyID0gXCJcIjtcbiAgdmFyIGMyID0gTShlMik7XG4gIGZvciAodmFyIG4yID0gMDsgbjIgPCBjMjsgbjIrKylcbiAgICBhMiArPSByMihlMltuMl0sIG4yLCBlMiwgcjIpIHx8IFwiXCI7XG4gIHJldHVybiBhMjtcbn1cbmZ1bmN0aW9uIGZlKGUyLCByMiwgYTIsIHMyKSB7XG4gIHN3aXRjaCAoZTIudHlwZSkge1xuICAgIGNhc2UgaTpcbiAgICBjYXNlIHQ6XG4gICAgICByZXR1cm4gZTIucmV0dXJuID0gZTIucmV0dXJuIHx8IGUyLnZhbHVlO1xuICAgIGNhc2UgYzpcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIGNhc2UgbjpcbiAgICAgIGUyLnZhbHVlID0gZTIucHJvcHMuam9pbihcIixcIik7XG4gIH1cbiAgcmV0dXJuIEEoYTIgPSBpZShlMi5jaGlsZHJlbiwgczIpKSA/IGUyLnJldHVybiA9IGUyLnZhbHVlICsgXCJ7XCIgKyBhMiArIFwifVwiIDogXCJcIjtcbn1cbmZ1bmN0aW9uIG9lKGUyKSB7XG4gIHZhciByMiA9IE0oZTIpO1xuICByZXR1cm4gZnVuY3Rpb24oYTIsIGMyLCBuMiwgdDIpIHtcbiAgICB2YXIgczIgPSBcIlwiO1xuICAgIGZvciAodmFyIHUyID0gMDsgdTIgPCByMjsgdTIrKylcbiAgICAgIHMyICs9IGUyW3UyXShhMiwgYzIsIG4yLCB0MikgfHwgXCJcIjtcbiAgICByZXR1cm4gczI7XG4gIH07XG59XG5mdW5jdGlvbiBsZShlMikge1xuICByZXR1cm4gZnVuY3Rpb24ocjIpIHtcbiAgICBpZiAoIXIyLnJvb3QpIHtcbiAgICAgIGlmIChyMiA9IHIyLnJldHVybilcbiAgICAgICAgZTIocjIpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHZlKGMyLCBzMiwgdTIsIGkyKSB7XG4gIGlmICghYzIucmV0dXJuKVxuICAgIHN3aXRjaCAoYzIudHlwZSkge1xuICAgICAgY2FzZSB0OlxuICAgICAgICBjMi5yZXR1cm4gPSB1ZShjMi52YWx1ZSwgYzIubGVuZ3RoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHA6XG4gICAgICAgIHJldHVybiBpZShbSSh5KGMyLnZhbHVlLCBcIkBcIiwgXCJAXCIgKyBhKSwgYzIsIFwiXCIpXSwgaTIpO1xuICAgICAgY2FzZSBuOlxuICAgICAgICBpZiAoYzIubGVuZ3RoKVxuICAgICAgICAgIHJldHVybiBTKGMyLnByb3BzLCBmdW5jdGlvbihuMikge1xuICAgICAgICAgICAgc3dpdGNoICh4KG4yLCAvKDo6cGxhY1xcdyt8OnJlYWQtXFx3KykvKSkge1xuICAgICAgICAgICAgICBjYXNlIFwiOnJlYWQtb25seVwiOlxuICAgICAgICAgICAgICBjYXNlIFwiOnJlYWQtd3JpdGVcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gaWUoW0koeShuMiwgLzoocmVhZC1cXHcrKS8sIFwiOlwiICsgciArIFwiJDFcIiksIGMyLCBcIlwiKV0sIGkyKTtcbiAgICAgICAgICAgICAgY2FzZSBcIjo6cGxhY2Vob2xkZXJcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gaWUoW0koeShuMiwgLzoocGxhY1xcdyspLywgXCI6XCIgKyBhICsgXCJpbnB1dC0kMVwiKSwgYzIsIFwiXCIpLCBJKHkobjIsIC86KHBsYWNcXHcrKS8sIFwiOlwiICsgciArIFwiJDFcIiksIGMyLCBcIlwiKSwgSSh5KG4yLCAvOihwbGFjXFx3KykvLCBlICsgXCJpbnB1dC0kMVwiKSwgYzIsIFwiXCIpXSwgaTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaGUoZTIpIHtcbiAgc3dpdGNoIChlMi50eXBlKSB7XG4gICAgY2FzZSBuOlxuICAgICAgZTIucHJvcHMgPSBlMi5wcm9wcy5tYXAoZnVuY3Rpb24ocjIpIHtcbiAgICAgICAgcmV0dXJuIFMoVyhyMiksIGZ1bmN0aW9uKHIzLCBhMiwgYzIpIHtcbiAgICAgICAgICBzd2l0Y2ggKHoocjMsIDApKSB7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICByZXR1cm4gQyhyMywgMSwgQShyMykpO1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgIGNhc2UgNDM6XG4gICAgICAgICAgICBjYXNlIDYyOlxuICAgICAgICAgICAgY2FzZSAxMjY6XG4gICAgICAgICAgICAgIHJldHVybiByMztcbiAgICAgICAgICAgIGNhc2UgNTg6XG4gICAgICAgICAgICAgIGlmIChjMlsrK2EyXSA9PT0gXCJnbG9iYWxcIilcbiAgICAgICAgICAgICAgICBjMlthMl0gPSBcIlwiLCBjMlsrK2EyXSA9IFwiXFxmXCIgKyBDKGMyW2EyXSwgYTIgPSAxLCAtMSk7XG4gICAgICAgICAgICBjYXNlIDMyOlxuICAgICAgICAgICAgICByZXR1cm4gYTIgPT09IDEgPyBcIlwiIDogcjM7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBzd2l0Y2ggKGEyKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgZTIgPSByMztcbiAgICAgICAgICAgICAgICAgIHJldHVybiBNKGMyKSA+IDEgPyBcIlwiIDogcjM7XG4gICAgICAgICAgICAgICAgY2FzZSAoYTIgPSBNKGMyKSAtIDEpOlxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhMiA9PT0gMiA/IHIzICsgZTIgKyBlMiA6IHIzICsgZTI7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiByMztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxufVxuZXhwb3J0IHtmIGFzIENIQVJTRVQsIGMgYXMgQ09NTUVOVCwgdyBhcyBDT1VOVEVSX1NUWUxFLCB0IGFzIERFQ0xBUkFUSU9OLCB2IGFzIERPQ1VNRU5ULCBiIGFzIEZPTlRfRkFDRSwgJCBhcyBGT05UX0ZFQVRVUkVfVkFMVUVTLCBpIGFzIElNUE9SVCwgcCBhcyBLRVlGUkFNRVMsIHUgYXMgTUVESUEsIHIgYXMgTU9aLCBlIGFzIE1TLCBoIGFzIE5BTUVTUEFDRSwgcyBhcyBQQUdFLCBuIGFzIFJVTEVTRVQsIGwgYXMgU1VQUE9SVFMsIG8gYXMgVklFV1BPUlQsIGEgYXMgV0VCS0lULCBrIGFzIGFicywgVCBhcyBhbGxvYywgTyBhcyBhcHBlbmQsIFAgYXMgY2FyZXQsIEogYXMgY2hhciwgRiBhcyBjaGFyYWN0ZXIsIEcgYXMgY2hhcmFjdGVycywgeiBhcyBjaGFyYXQsIEIgYXMgY29sdW1uLCBTIGFzIGNvbWJpbmUsIHRlIGFzIGNvbW1lbnQsIGVlIGFzIGNvbW1lbnRlciwgYWUgYXMgY29tcGlsZSwgSSBhcyBjb3B5LCBVIGFzIGRlYWxsb2MsIHNlIGFzIGRlY2xhcmF0aW9uLCBWIGFzIGRlbGltaXQsIF8gYXMgZGVsaW1pdGVyLCBaIGFzIGVzY2FwaW5nLCBkIGFzIGZyb20sIG0gYXMgaGFzaCwgcmUgYXMgaWRlbnRpZmllciwgaiBhcyBpbmRleG9mLCBEIGFzIGxlbmd0aCwgcSBhcyBsaW5lLCB4IGFzIG1hdGNoLCBvZSBhcyBtaWRkbGV3YXJlLCBoZSBhcyBuYW1lc3BhY2UsIEwgYXMgbmV4dCwgSCBhcyBub2RlLCBjZSBhcyBwYXJzZSwgTiBhcyBwZWVrLCBFIGFzIHBvc2l0aW9uLCB1ZSBhcyBwcmVmaXgsIHZlIGFzIHByZWZpeGVyLCBLIGFzIHByZXYsIHkgYXMgcmVwbGFjZSwgbmUgYXMgcnVsZXNldCwgbGUgYXMgcnVsZXNoZWV0LCBpZSBhcyBzZXJpYWxpemUsIE0gYXMgc2l6ZW9mLCBRIGFzIHNsaWNlLCBmZSBhcyBzdHJpbmdpZnksIEEgYXMgc3RybGVuLCBDIGFzIHN1YnN0ciwgUiBhcyB0b2tlbiwgVyBhcyB0b2tlbml6ZSwgWSBhcyB0b2tlbml6ZXIsIGcgYXMgdHJpbSwgWCBhcyB3aGl0ZXNwYWNlfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXdvZ0lDSjJaWEp6YVc5dUlqb2dNeXdLSUNBaWMyOTFjbU5sY3lJNklGc2lMMmh2YldVdmNuVnVibVZ5TDNkdmNtc3ZiVzl1WlhrdmJXOXVaWGt2Ym05a1pWOXRiMlIxYkdWekwzTjBlV3hwY3k5a2FYTjBMM04wZVd4cGN5NXRhbk1pWFN3S0lDQWliV0Z3Y0dsdVozTWlPaUFpUVVGQlFTeEpRVUZKTEVsQlFVVTdRVUZCVHl4SlFVRkpMRWxCUVVVN1FVRkJVU3hKUVVGSkxFbEJRVVU3UVVGQlZ5eEpRVUZKTEVsQlFVVTdRVUZCVHl4SlFVRkpMRWxCUVVVN1FVRkJUeXhKUVVGSkxFbEJRVVU3UVVGQlR5eEpRVUZKTEVsQlFVVTdRVUZCVVN4SlFVRkpMRWxCUVVVN1FVRkJVeXhKUVVGSkxFbEJRVVU3UVVGQlZTeEpRVUZKTEVsQlFVVTdRVUZCVnl4SlFVRkpMRWxCUVVVN1FVRkJXU3hKUVVGSkxFbEJRVVU3UVVGQldTeEpRVUZKTEVsQlFVVTdRVUZCV1N4SlFVRkpMRWxCUVVVN1FVRkJZU3hKUVVGSkxFbEJRVVU3UVVGQllTeEpRVUZKTEVsQlFVVTdRVUZCWVN4SlFVRkpMRWxCUVVVN1FVRkJhVUlzU1VGQlNTeEpRVUZGTzBGQlFYVkNMRWxCUVVrc1NVRkJSU3hMUVVGTE8wRkJRVWtzU1VGQlNTeEpRVUZGTEU5QlFVODdRVUZCWVN4WFFVRlhMRWxCUVVVc1NVRkJSVHRCUVVGRExGTkJRVk1zVTBGQlJ5eEpRVUZGTEVWQlFVVXNTVUZCUlN4UFFVRkxMRWxCUVVVc1JVRkJSU3hKUVVGRkxFOUJRVXNzU1VGQlJTeEZRVUZGTEVsQlFVVXNUMEZCU3l4SlFVRkZMRVZCUVVVc1NVRkJSVHRCUVVGQk8wRkJRVWNzVjBGQlZ5eEpRVUZGTzBGQlFVTXNVMEZCVHl4SFFVRkZPMEZCUVVFN1FVRkJUeXhYUVVGWExFbEJRVVVzU1VGQlJUdEJRVUZETEZOQlFVOHNUVUZCUlN4SFFVRkZMRXRCUVVzc1QwRkJTU3hIUVVGRkxFdEJRVWM3UVVGQlFUdEJRVUZGTEZkQlFWY3NTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGUExFZEJRVVVzVVVGQlVTeEpRVUZGTzBGQlFVRTdRVUZCUnl4WFFVRlhMRWxCUVVVc1NVRkJSVHRCUVVGRExGTkJRVThzUjBGQlJTeFJRVUZSTzBGQlFVRTdRVUZCUnl4WFFVRlhMRWxCUVVVc1NVRkJSVHRCUVVGRExGTkJRVThzUjBGQlJTeFhRVUZYTEUxQlFVYzdRVUZCUVR0QlFVRkZMRmRCUVZjc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFRRVUZQTEVkQlFVVXNUVUZCVFN4SlFVRkZPMEZCUVVFN1FVRkJSeXhYUVVGWExFbEJRVVU3UVVGQlF5eFRRVUZQTEVkQlFVVTdRVUZCUVR0QlFVRlBMRmRCUVZjc1NVRkJSVHRCUVVGRExGTkJRVThzUjBGQlJUdEJRVUZCTzBGQlFVOHNWMEZCVnl4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGUExFZEJRVVVzUzBGQlN5eExRVUZITzBGQlFVRTdRVUZCUlN4WFFVRlhMRWxCUVVVc1NVRkJSVHRCUVVGRExGTkJRVThzUjBGQlJTeEpRVUZKTEVsQlFVY3NTMEZCU3p0QlFVRkJPMEZCUVVrc1NVRkJTU3hKUVVGRk8wRkJRVVVzU1VGQlNTeEpRVUZGTzBGQlFVVXNTVUZCU1N4SlFVRkZPMEZCUVVVc1NVRkJTU3hKUVVGRk8wRkJRVVVzU1VGQlNTeEpRVUZGTzBGQlFVVXNTVUZCU1N4SlFVRkZPMEZCUVVjc1YwRkJWeXhKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZPMEZCUVVNc1UwRkJUU3hEUVVGRExFOUJRVTBzU1VGQlJTeE5RVUZMTEVsQlFVVXNVVUZCVHl4SlFVRkZMRTFCUVVzc1NVRkJSU3hQUVVGTkxFbEJRVVVzVlVGQlV5eEpRVUZGTEUxQlFVc3NSMEZCUlN4UlFVRlBMRWRCUVVVc1VVRkJUeXhKUVVGRkxGRkJRVTg3UVVGQlFUdEJRVUZKTEZkQlFWY3NTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGUExFVkJRVVVzU1VGQlJTeEhRVUZGTEUxQlFVc3NSMEZCUlN4UlFVRlBMRWxCUVVVc1IwRkJSU3hQUVVGTkxFZEJRVVVzVlVGQlV6dEJRVUZCTzBGQlFVY3NZVUZCV1R0QlFVRkRMRk5CUVU4N1FVRkJRVHRCUVVGRkxHRkJRVms3UVVGQlF5eE5RVUZGTEVsQlFVVXNTVUZCUlN4RlFVRkZMRWRCUVVVc1JVRkJSU3hMUVVGSE8wRkJRVVVzVFVGQlJ5eExRVUZKTEUxQlFVazdRVUZCUnl4UlFVRkZMRWRCUVVVN1FVRkJTU3hUUVVGUE8wRkJRVUU3UVVGQlJTeGhRVUZaTzBGQlFVTXNUVUZCUlN4SlFVRkZMRWxCUVVVc1JVRkJSU3hIUVVGRkxFOUJRVXM3UVVGQlJTeE5RVUZITEV0QlFVa3NUVUZCU1R0QlFVRkhMRkZCUVVVc1IwRkJSVHRCUVVGSkxGTkJRVTg3UVVGQlFUdEJRVUZGTEdGQlFWazdRVUZCUXl4VFFVRlBMRVZCUVVVc1IwRkJSVHRCUVVGQk8wRkJRVWNzWVVGQldUdEJRVUZETEZOQlFVODdRVUZCUVR0QlFVRkZMRmRCUVZjc1NVRkJSU3hKUVVGRk8wRkJRVU1zVTBGQlR5eEZRVUZGTEVkQlFVVXNTVUZCUlR0QlFVRkJPMEZCUVVjc1YwRkJWeXhKUVVGRk8wRkJRVU1zVlVGQlR6dEJRVUZCTEZOQlFWRTdRVUZCUVN4VFFVRlBPMEZCUVVFc1UwRkJUenRCUVVGQkxGTkJRVkU3UVVGQlFTeFRRVUZSTzBGQlFVY3NZVUZCVHp0QlFVRkJMRk5CUVU4N1FVRkJRU3hUUVVGUk8wRkJRVUVzVTBGQlVUdEJRVUZCTEZOQlFWRTdRVUZCUVN4VFFVRlJPMEZCUVVFc1UwRkJVVHRCUVVGQkxGTkJRVkU3UVVGQlFTeFRRVUZUTzBGQlFVRXNVMEZCVVR0QlFVRkJMRk5CUVZNN1FVRkJTU3hoUVVGUE8wRkJRVUVzVTBGQlR6dEJRVUZITEdGQlFVODdRVUZCUVN4VFFVRlBPMEZCUVVFc1UwRkJVVHRCUVVGQkxGTkJRVkU3UVVGQlFTeFRRVUZSTzBGQlFVY3NZVUZCVHp0QlFVRkJMRk5CUVU4N1FVRkJRU3hUUVVGUk8wRkJRVWNzWVVGQlR6dEJRVUZCTzBGQlFVVXNVMEZCVHp0QlFVRkJPMEZCUVVVc1YwRkJWeXhKUVVGRk8wRkJRVU1zVTBGQlR5eEpRVUZGTEVsQlFVVXNSMEZCUlN4SlFVRkZMRVZCUVVVc1NVRkJSU3hMUVVGSExFbEJRVVVzUjBGQlJUdEJRVUZCTzBGQlFVY3NWMEZCVnl4SlFVRkZPMEZCUVVNc1UwRkJUeXhKUVVGRkxFbEJRVWM3UVVGQlFUdEJRVUZGTEZkQlFWY3NTVUZCUlR0QlFVRkRMRk5CUVU4c1JVRkJSU3hGUVVGRkxFbEJRVVVzUjBGQlJTeEZRVUZGTEU5QlFVa3NTMEZCUnl4TFFVRkZMRWxCUVVVc1QwRkJTU3hMUVVGSExFdEJRVVVzU1VGQlJUdEJRVUZCTzBGQlFVc3NWMEZCVnl4SlFVRkZPMEZCUVVNc1UwRkJUeXhGUVVGRkxFVkJRVVVzUlVGQlJUdEJRVUZCTzBGQlFVc3NWMEZCVnl4SlFVRkZPMEZCUVVNc1UwRkJUU3hKUVVGRk8wRkJRVWtzVVVGQlJ5eEpRVUZGTzBGQlFVYzdRVUZCUVR0QlFVRlRPMEZCUVUwc1UwRkJUeXhGUVVGRkxFMUJRVWNzUzBGQlJ5eEZRVUZGTEV0QlFVY3NTVUZCUlN4TFFVRkhPMEZCUVVFN1FVRkJTU3hYUVVGWExFbEJRVVU3UVVGQlF5eFRRVUZOTzBGQlFVa3NXVUZCVHl4RlFVRkZPMEZCUVVFc1YwRkJVenRCUVVGRkxGVkJRVVVzUjBGQlJ5eEpRVUZGTEVsQlFVYzdRVUZCUnp0QlFVRkJMRmRCUVZjN1FVRkJSU3hWUVVGRkxFVkJRVVVzU1VGQlJ6dEJRVUZITzBGQlFVRTdRVUZCWXl4VlFVRkZMRVZCUVVVc1NVRkJSenRCUVVGQk8wRkJRVWNzVTBGQlR6dEJRVUZCTzBGQlFVVXNWMEZCVnl4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGTkxFVkJRVVVzVFVGQlJ6dEJRVUZKTEZGQlFVY3NTVUZCUlN4TlFVRkpMRWxCUVVVc1QwRkJTeXhKUVVGRkxFMUJRVWtzU1VGQlJTeE5RVUZKTEVsQlFVVXNUVUZCU1N4SlFVRkZPMEZCUVVjN1FVRkJUU3hUUVVGUExFVkJRVVVzU1VGQlJTeE5RVUZMTEUxQlFVVXNTMEZCUnl4UFFVRkxMRTFCUVVrc1QwRkJTenRCUVVGQk8wRkJRVXNzVjBGQlZ5eEpRVUZGTzBGQlFVTXNVMEZCVFR0QlFVRkpMRmxCUVU4N1FVRkJRU3hYUVVGUk8wRkJRVVVzWlVGQlR6dEJRVUZCTEZkQlFVODdRVUZCUVN4WFFVRlJPMEZCUVVjc1pVRkJUeXhGUVVGRkxFOUJRVWtzVFVGQlNTeFBRVUZKTEV0QlFVY3NTMEZCUlR0QlFVRkJMRmRCUVZFN1FVRkJSeXhaUVVGSExFOUJRVWs3UVVGQlJ5eFpRVUZGTzBGQlFVYzdRVUZCUVN4WFFVRlhPMEZCUVVjN1FVRkJTVHRCUVVGQk8wRkJRVTBzVTBGQlR6dEJRVUZCTzBGQlFVVXNXVUZCV1N4SlFVRkZMRWxCUVVVN1FVRkJReXhUUVVGTk8wRkJRVWtzVVVGQlJ5eExRVUZGTEUxQlFVa3NTMEZCUnp0QlFVRkhPMEZCUVVFc1lVRkJZeXhMUVVGRkxFMUJRVWtzUzBGQlJ5eE5RVUZKTEZGQlFVMDdRVUZCUnp0QlFVRk5MRk5CUVUwc1QwRkJTeXhGUVVGRkxFbEJRVVVzU1VGQlJTeExRVUZITEUxQlFVa3NSVUZCUlN4UFFVRkpMRXRCUVVjc1MwRkJSVHRCUVVGQk8wRkJRVXNzV1VGQldTeEpRVUZGTzBGQlFVTXNVMEZCVFN4RFFVRkRMRVZCUVVVN1FVRkJTenRCUVVGSkxGTkJRVThzUlVGQlJTeEpRVUZGTzBGQlFVRTdRVUZCUnl4WlFVRlpMRWxCUVVVN1FVRkJReXhUUVVGUExFVkJRVVVzUjBGQlJ5eEpRVUZITEUxQlFVc3NUVUZCU3l4TlFVRkxMRU5CUVVNc1MwRkJTU3hMUVVGRkxFVkJRVVVzUzBGQlJ5eEhRVUZGTEVOQlFVTXNTVUZCUnp0QlFVRkJPMEZCUVVrc1dVRkJXU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSVHRCUVVGRExFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkhMRTFCUVVrc1MwRkJSVHRCUVVGRkxFMUJRVWtzUzBGQlJUdEJRVUZGTEUxQlFVa3NTMEZCUlR0QlFVRkZMRTFCUVVrc1MwRkJSVHRCUVVGRkxGTkJRVTA3UVVGQlJTeFpRVUZQTEV0QlFVVXNTVUZCUlN4TFFVRkZPMEZCUVVFc1YwRkJWVHRCUVVGQkxGZEJRVkU3UVVGQlFTeFhRVUZSTzBGQlFVRXNWMEZCVVR0QlFVRkhMR05CUVVjc1JVRkJSVHRCUVVGSE8wRkJRVUVzVjBGQlZ6dEJRVUZCTEZkQlFVODdRVUZCUVN4WFFVRlJPMEZCUVVFc1YwRkJVVHRCUVVGSExHTkJRVWNzUlVGQlJUdEJRVUZITzBGQlFVRXNWMEZCVnp0QlFVRkhMR05CUVVjc1JVRkJSU3hOUVVGSkxFZEJRVVU3UVVGQlJ6dEJRVUZCTEZkQlFXTTdRVUZCUnl4blFrRkJUenRCUVVGQkxHVkJRVlU3UVVGQlFTeGxRVUZSTzBGQlFVY3NZMEZCUlN4SFFVRkhMRWRCUVVjc1MwRkJTU3hOUVVGTExFbEJRVVVzUzBGQlJ6dEJRVUZITzBGQlFVRTdRVUZCWXl4clFrRkJSenRCUVVGQk8wRkJRVWs3UVVGQlFTeFhRVUZYTEUxQlFVazdRVUZCUlN4WFFVRkZMRkZCUVVzc1JVRkJSU3hOUVVGSE8wRkJRVUVzVjBGQlR5eE5RVUZKTzBGQlFVRXNWMEZCVHp0QlFVRkJMRmRCUVZFN1FVRkJSU3huUWtGQlR6dEJRVUZCTEdWQlFWRTdRVUZCUVN4bFFVRlBPMEZCUVVrc2FVSkJRVVU3UVVGQlFTeGxRVUZQTEV0QlFVYzdRVUZCUlN4blFrRkJSeXhMUVVGRkxFdEJRVWNzUlVGQlJTeE5RVUZITzBGQlFVVXNaMEpCUVVVc1MwRkJSU3hMUVVGSExFZEJRVWNzUzBGQlJTeExRVUZKTEVsQlFVVXNTVUZCUlN4TFFVRkZMRXRCUVVjc1IwRkJSeXhGUVVGRkxFbEJRVVVzUzBGQlNTeE5RVUZKTEV0QlFVa3NTVUZCUlN4SlFVRkZMRXRCUVVVc1NVRkJSenRCUVVGSE8wRkJRVUVzWlVGQlZ6dEJRVUZITEd0Q1FVRkhPMEZCUVVFN1FVRkJXU3hqUVVGRkxFdEJRVVVzUjBGQlJ5eEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzUzBGQlJTeEpRVUZITEV0QlFVVXNTVUZCUnl4TFFVRkhPMEZCUVVjc1owSkJRVWNzVDBGQlNUdEJRVUZKTEd0Q1FVRkhMRTlCUVVrN1FVRkJSU3h0UWtGQlJ5eEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlFUdEJRVUZSTEhkQ1FVRlBPMEZCUVVFc2RVSkJRVkU3UVVGQlFTeDFRa0ZCVXp0QlFVRkJMSFZDUVVGVE8wRkJRVWtzZFVKQlFVY3NTVUZCUlN4SlFVRkZMRWxCUVVVc1RVRkJSeXhGUVVGRkxFZEJRVWNzU1VGQlJTeEpRVUZGTEVsQlFVVXNSMEZCUlN4SFFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzUzBGQlJTeEpRVUZITEV0QlFVY3NTMEZCUnl4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFdEJRVVVzUzBGQlJUdEJRVUZITzBGQlFVRTdRVUZCWXl4MVFrRkJSeXhKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVOQlFVTXNTMEZCU1N4SlFVRkZMRWxCUVVVc1NVRkJSVHRCUVVGQk8wRkJRVUU3UVVGQlNTeGhRVUZGTEV0QlFVVXNTMEZCUlN4SFFVRkZMRXRCUVVVc1MwRkJSU3hIUVVGRkxFdEJRVVVzUzBGQlJTeEpRVUZITEV0QlFVVTdRVUZCUlR0QlFVRkJMRmRCUVZjN1FVRkJSeXhoUVVGRkxFbEJRVVVzUlVGQlJTeExRVUZITEV0QlFVVTdRVUZCUVR0QlFVRlZMRmxCUVVjc1MwRkJSVHRCUVVGRkxHTkJRVWNzVFVGQlJ6dEJRVUZKTEdOQlFVVTdRVUZCUVN4dFFrRkJWU3hOUVVGSExFOUJRVXNzVVVGQlN5eExRVUZITEU5QlFVczdRVUZCU1R0QlFVRkJPMEZCUVZNc1owSkJRVThzVFVGQlJ5eEZRVUZGTEV0QlFVY3NTMEZCUlR0QlFVRkJMR1ZCUVZFN1FVRkJSeXhwUWtGQlJTeExRVUZGTEVsQlFVVXNTVUZCUnl4UFFVRkhMRTFCUVVzN1FVRkJTVHRCUVVGQkxHVkJRVmM3UVVGQlJ5eGxRVUZGTEZGQlFVMHNSMEZCUlN4TlFVRkhMRXRCUVVjc1NVRkJSU3hMUVVGRk8wRkJRVVU3UVVGQlFTeGxRVUZYTzBGQlFVY3NaMEpCUVVjc1VVRkJUVHRCUVVGSExHOUNRVUZITEVWQlFVVTdRVUZCU3l4cFFrRkJSU3hMUVVGSkxFdEJRVVVzUlVGQlJTeExRVUZGTEUxQlFVY3NSMEZCUnl4UFFVRk5PMEZCUVVrN1FVRkJRU3hsUVVGWE8wRkJRVWNzWjBKQlFVY3NUMEZCU1N4TlFVRkpMRVZCUVVVc1QwRkJTVHRCUVVGRkxHMUNRVUZGTzBGQlFVRTdRVUZCUVR0QlFVRkhMRk5CUVU4N1FVRkJRVHRCUVVGRkxGbEJRVmtzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTzBGQlFVTXNUVUZCU1N4TFFVRkZMRXRCUVVVN1FVRkJSU3hOUVVGSkxFdEJRVVVzVDBGQlNTeEpRVUZGTEV0QlFVVXNRMEZCUXp0QlFVRkpMRTFCUVVrc1MwRkJSU3hGUVVGRk8wRkJRVWNzVjBGQlVTeExRVUZGTEVkQlFVVXNTMEZCUlN4SFFVRkZMRXRCUVVVc1IwRkJSU3hMUVVGRkxFbEJRVVVzUlVGQlJUdEJRVUZGTEdGQlFWRXNTMEZCUlN4SFFVRkZMRXRCUVVVc1JVRkJSU3hKUVVGRkxFdEJRVVVzUjBGQlJTeExRVUZGTEVWQlFVVXNTMEZCUlN4SFFVRkZMRTlCUVVzc1MwRkJSU3hKUVVGRkxFdEJRVVVzU1VGQlJTeEZRVUZGTzBGQlFVVXNWVUZCUnl4TFFVRkZMRVZCUVVVc1MwRkJSU3hKUVVGRkxFZEJRVVVzVFVGQlJ5eE5RVUZKTEV0QlFVVXNSVUZCUlN4SlFVRkZMRkZCUVU4c1IwRkJSVHRCUVVGTExGZEJRVVVzVVVGQlN6dEJRVUZGTEZOQlFVOHNSVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hQUVVGSkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVXNTVUZCUlR0QlFVRkJPMEZCUVVjc1dVRkJXU3hKUVVGRkxFbEJRVVVzU1VGQlJUdEJRVUZETEZOQlFVOHNSVUZCUlN4SlFVRkZMRWxCUVVVc1NVRkJSU3hIUVVGRkxFVkJRVVVzVFVGQlN5eEZRVUZGTEVsQlFVVXNSMEZCUlN4TFFVRkpPMEZCUVVFN1FVRkJSeXhaUVVGWkxFbEJRVVVzU1VGQlJTeEpRVUZGTEVsQlFVVTdRVUZCUXl4VFFVRlBMRVZCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVVzUjBGQlJTeEZRVUZGTEVsQlFVVXNSMEZCUlN4TFFVRkhMRVZCUVVVc1NVRkJSU3hMUVVGRkxFZEJRVVVzUzBGQlNUdEJRVUZCTzBGQlFVY3NXVUZCV1N4SlFVRkZMRWxCUVVVN1FVRkJReXhWUVVGUExFVkJRVVVzU1VGQlJUdEJRVUZCTEZOQlFWTTdRVUZCU3l4aFFVRlBMRWxCUVVVc1YwRkJVeXhMUVVGRk8wRkJRVUVzVTBGQlR6dEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkxMR0ZCUVU4c1NVRkJSU3hMUVVGRk8wRkJRVUVzVTBGQlR6dEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlN5eGhRVUZQTEVsQlFVVXNTMEZCUlN4SlFVRkZMRXRCUVVVc1NVRkJSU3hMUVVGRk8wRkJRVUVzVTBGQlR6dEJRVUZCTEZOQlFWVTdRVUZCU3l4aFFVRlBMRWxCUVVVc1MwRkJSU3hKUVVGRkxFdEJRVVU3UVVGQlFTeFRRVUZQTzBGQlFVc3NZVUZCVHl4SlFVRkZMRXRCUVVVc1NVRkJSU3hWUVVGUkxFdEJRVVU3UVVGQlFTeFRRVUZQTzBGQlFVc3NZVUZCVHl4SlFVRkZMRXRCUVVVc1JVRkJSU3hKUVVGRkxHdENRVUZwUWl4SlFVRkZMR0ZCUVZjc1NVRkJSU3hsUVVGaE8wRkJRVUVzVTBGQlR6dEJRVUZMTEdGQlFVOHNTVUZCUlN4TFFVRkZMRWxCUVVVc1pVRkJZU3hGUVVGRkxFbEJRVVVzWlVGQll5eE5RVUZKTzBGQlFVRXNVMEZCVHp0QlFVRkxMR0ZCUVU4c1NVRkJSU3hMUVVGRkxFbEJRVVVzYlVKQlFXbENMRVZCUVVVc1NVRkJSU3cyUWtGQk5FSXNUVUZCU1R0QlFVRkJMRk5CUVU4N1FVRkJTeXhoUVVGUExFbEJRVVVzUzBGQlJTeEpRVUZGTEVWQlFVVXNTVUZCUlN4VlFVRlRMR05CUVZrN1FVRkJRU3hUUVVGUE8wRkJRVXNzWVVGQlR5eEpRVUZGTEV0QlFVVXNTVUZCUlN4RlFVRkZMRWxCUVVVc1UwRkJVU3h2UWtGQmEwSTdRVUZCUVN4VFFVRlBPMEZCUVVzc1lVRkJUeXhKUVVGRkxGTkJRVThzUlVGQlJTeEpRVUZGTEZOQlFWRXNUVUZCU1N4SlFVRkZMRXRCUVVVc1NVRkJSU3hGUVVGRkxFbEJRVVVzVVVGQlR5eGpRVUZaTzBGQlFVRXNVMEZCVHp0QlFVRkxMR0ZCUVU4c1NVRkJSU3hGUVVGRkxFbEJRVVVzYzBKQlFYRkNMRTlCUVVzc1NVRkJSU3hSUVVGTk8wRkJRVUVzVTBGQlR6dEJRVUZMTEdGQlFVOHNSVUZCUlN4RlFVRkZMRVZCUVVVc1NVRkJSU3huUWtGQlpTeEpRVUZGTEU5QlFVMHNaVUZCWXl4SlFVRkZMRTlCUVUwc1NVRkJSU3hOUVVGSk8wRkJRVUVzVTBGQlR6dEJRVUZCTEZOQlFWVTdRVUZCU3l4aFFVRlBMRVZCUVVVc1NVRkJSU3h4UWtGQmIwSXNTVUZCUlR0QlFVRkJMRk5CUVd0Q08wRkJRVXNzWVVGQlR5eEZRVUZGTEVWQlFVVXNTVUZCUlN4eFFrRkJiMElzU1VGQlJTeG5Ra0ZCWXl4SlFVRkZMR2xDUVVGblFpeGpRVUZoTEdGQlFWY3NTVUZCUlN4TFFVRkZPMEZCUVVFc1UwRkJUenRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkxMR0ZCUVU4c1JVRkJSU3hKUVVGRkxHMUNRVUZyUWl4SlFVRkZMRlZCUVZFN1FVRkJRU3hUUVVGUE8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCUVN4VFFVRlZPMEZCUVVFc1UwRkJWVHRCUVVGQkxGTkJRVlU3UVVGQlFTeFRRVUZWTzBGQlFVRXNVMEZCVlR0QlFVRkJMRk5CUVZVN1FVRkJRU3hUUVVGVk8wRkJRVUVzVTBGQlZUdEJRVUZCTEZOQlFWVTdRVUZCU3l4VlFVRkhMRVZCUVVVc1RVRkJSeXhKUVVGRkxFdEJRVVU3UVVGQlJTeG5Ra0ZCVHl4RlFVRkZMRWxCUVVVc1MwRkJSVHRCUVVGQkxHVkJRVk03UVVGQlNTeG5Ra0ZCUnl4RlFVRkZMRWxCUVVVc1MwRkJSU3hQUVVGTE8wRkJRVWM3UVVGQlFTeGxRVUZYTzBGQlFVa3NiVUpCUVU4c1JVRkJSU3hKUVVGRkxHOUNRVUZ0UWl4UFFVRkxMRWxCUVVVc1dVRkJZU3hKUVVGSExFZEJRVVVzU1VGQlJTeExRVUZGTEUxQlFVa3NUVUZCU1N4UFFVRkxMRmxCUVZVN1FVRkJRU3hsUVVGUE8wRkJRVWtzYlVKQlFVMHNRMEZCUXl4RlFVRkZMRWxCUVVVc1lVRkJWeXhIUVVGSExFVkJRVVVzU1VGQlJTeFhRVUZWTEcxQ1FVRnJRaXhOUVVGSExFdEJRVVU3UVVGQlFUdEJRVUZGTzBGQlFVRXNVMEZCVnp0QlFVRkxMRlZCUVVjc1JVRkJSU3hKUVVGRkxFdEJRVVVzVDBGQlN6dEJRVUZKTzBGQlFVRXNVMEZCVnp0QlFVRkxMR05CUVU4c1JVRkJSU3hKUVVGRkxFVkJRVVVzVFVGQlJ5eEpRVUZITEVWQlFVTXNSVUZCUlN4SlFVRkZMR2xDUVVGbE8wRkJRVUVzWVVGQlZ6dEJRVUZKTEdsQ1FVRlBMRVZCUVVVc1NVRkJSU3hMUVVGSkxFMUJRVWtzUzBGQlJ6dEJRVUZCTEdGQlFVODdRVUZCU1N4cFFrRkJUeXhGUVVGRkxFbEJRVVVzZVVKQlFYZENMRTlCUVVzc1NVRkJSeXhIUVVGRkxFbEJRVVVzVVVGQlRTeExRVUZITEZsQlFWVXNUVUZCU1N4WlFVRmhMRWxCUVVVc1YwRkJXU3hKUVVGRkxHRkJRVmM3UVVGQlFUdEJRVUZGTzBGQlFVRXNVMEZCVnp0QlFVRkxMR05CUVU4c1JVRkJSU3hKUVVGRkxFdEJRVVU3UVVGQlFTeGhRVUZWTzBGQlFVa3NhVUpCUVU4c1NVRkJSU3hMUVVGRkxFbEJRVVVzUlVGQlJTeEpRVUZGTEhOQ1FVRnhRaXhSUVVGTk8wRkJRVUVzWVVGQlR6dEJRVUZKTEdsQ1FVRlBMRWxCUVVVc1MwRkJSU3hKUVVGRkxFVkJRVVVzU1VGQlJTeHpRa0ZCY1VJc1YwRkJVenRCUVVGQkxHRkJRVTg3UVVGQlJ5eHBRa0ZCVHl4SlFVRkZMRXRCUVVVc1NVRkJSU3hGUVVGRkxFbEJRVVVzYzBKQlFYRkNMRkZCUVUwN1FVRkJRVHRCUVVGRkxHRkJRVThzU1VGQlJTeExRVUZGTEVsQlFVVXNTMEZCUlR0QlFVRkJPMEZCUVVVc1UwRkJUenRCUVVGQk8wRkJRVVVzV1VGQldTeEpRVUZGTEVsQlFVVTdRVUZCUXl4TlFVRkpMRXRCUVVVN1FVRkJSeXhOUVVGSkxFdEJRVVVzUlVGQlJUdEJRVUZITEZkQlFWRXNTMEZCUlN4SFFVRkZMRXRCUVVVc1NVRkJSVHRCUVVGSkxGVkJRVWNzUjBGQlJTeEhRVUZGTEV0QlFVY3NTVUZCUlN4SlFVRkZMRTlCUVVrN1FVRkJSeXhUUVVGUE8wRkJRVUU3UVVGQlJTeFpRVUZaTEVsQlFVVXNTVUZCUlN4SlFVRkZMRWxCUVVVN1FVRkJReXhWUVVGUExFZEJRVVU3UVVGQlFTeFRRVUZYTzBGQlFVRXNVMEZCVHp0QlFVRkZMR0ZCUVU4c1IwRkJSU3hUUVVGUExFZEJRVVVzVlVGQlVTeEhRVUZGTzBGQlFVRXNVMEZCVnp0QlFVRkZMR0ZCUVUwN1FVRkJRU3hUUVVGUk8wRkJRVVVzVTBGQlJTeFJRVUZOTEVkQlFVVXNUVUZCVFN4TFFVRkxPMEZCUVVFN1FVRkJTeXhUUVVGUExFVkJRVVVzUzBGQlJTeEhRVUZITEVkQlFVVXNWVUZCVXl4UFFVRkpMRWRCUVVVc1UwRkJUeXhIUVVGRkxGRkJRVTBzVFVGQlNTeExRVUZGTEUxQlFVazdRVUZCUVR0QlFVRkhMRmxCUVZrc1NVRkJSVHRCUVVGRExFMUJRVWtzUzBGQlJTeEZRVUZGTzBGQlFVY3NVMEZCVHl4VFFVRlRMRWxCUVVVc1NVRkJSU3hKUVVGRkxFbEJRVVU3UVVGQlF5eFJRVUZKTEV0QlFVVTdRVUZCUnl4aFFVRlJMRXRCUVVVc1IwRkJSU3hMUVVGRkxFbEJRVVU3UVVGQlNTeFpRVUZITEVkQlFVVXNTVUZCUnl4SlFVRkZMRWxCUVVVc1NVRkJSU3hQUVVGSk8wRkJRVWNzVjBGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUnl4WlFVRlpMRWxCUVVVN1FVRkJReXhUUVVGUExGTkJRVk1zU1VGQlJUdEJRVUZETEZGQlFVY3NRMEZCUXl4SFFVRkZPMEZCUVVzc1ZVRkJSeXhMUVVGRkxFZEJRVVU3UVVGQlR5eFhRVUZGTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVrc1dVRkJXU3hKUVVGRkxFbEJRVVVzU1VGQlJTeEpRVUZGTzBGQlFVTXNUVUZCUnl4RFFVRkRMRWRCUVVVN1FVRkJUeXhaUVVGUExFZEJRVVU3UVVGQlFTeFhRVUZYTzBGQlFVVXNWMEZCUlN4VFFVRlBMRWRCUVVjc1IwRkJSU3hQUVVGTkxFZEJRVVU3UVVGQlVUdEJRVUZCTEZkQlFWYzdRVUZCUlN4bFFVRlBMRWRCUVVjc1EwRkJReXhGUVVGRkxFVkJRVVVzUjBGQlJTeFBRVUZOTEV0QlFVa3NUVUZCU1N4SlFVRkhMRWxCUVVVc1RVRkJTenRCUVVGQkxGZEJRVkU3UVVGQlJTeFpRVUZITEVkQlFVVTdRVUZCVHl4cFFrRkJUeXhGUVVGRkxFZEJRVVVzVDBGQlR5eFRRVUZUTEVsQlFVVTdRVUZCUXl4dlFrRkJUeXhGUVVGRkxFbEJRVVU3UVVGQlFTeHRRa0ZCT0VJN1FVRkJRU3h0UWtGQmFVSTdRVUZCWXl4MVFrRkJUeXhIUVVGSExFTkJRVU1zUlVGQlJTeEZRVUZGTEVsQlFVVXNaVUZCWXl4TlFVRkpMRWxCUVVVc1QwRkJUU3hKUVVGRkxFMUJRVXM3UVVGQlFTeHRRa0ZCVHp0QlFVRm5RaXgxUWtGQlR5eEhRVUZITEVOQlFVTXNSVUZCUlN4RlFVRkZMRWxCUVVVc1kwRkJZU3hOUVVGSkxFbEJRVVVzWVVGQldTeEpRVUZGTEV0QlFVa3NSVUZCUlN4RlFVRkZMRWxCUVVVc1kwRkJZU3hOUVVGSkxFbEJRVVVzVDBGQlRTeEpRVUZGTEV0QlFVa3NSVUZCUlN4RlFVRkZMRWxCUVVVc1kwRkJZU3hKUVVGRkxHRkJRVmtzU1VGQlJTeE5RVUZMTzBGQlFVRTdRVUZCUnl4dFFrRkJUVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZQTEZsQlFWa3NTVUZCUlR0QlFVRkRMRlZCUVU4c1IwRkJSVHRCUVVGQkxGTkJRVmM3UVVGQlJTeFRRVUZGTEZGQlFVMHNSMEZCUlN4TlFVRk5MRWxCUVVzc1UwRkJVeXhKUVVGRk8wRkJRVU1zWlVGQlR5eEZRVUZGTEVWQlFVVXNTMEZCU1N4VFFVRlRMRWxCUVVVc1NVRkJSU3hKUVVGRk8wRkJRVU1zYTBKQlFVOHNSVUZCUlN4SlFVRkZPMEZCUVVFc2FVSkJRVk03UVVGQlJ5eHhRa0ZCVHl4RlFVRkZMRWxCUVVVc1IwRkJSU3hGUVVGRk8wRkJRVUVzYVVKQlFWTTdRVUZCUVN4cFFrRkJUenRCUVVGQkxHbENRVUZSTzBGQlFVRXNhVUpCUVZFN1FVRkJRU3hwUWtGQlVUdEJRVUZKTEhGQ1FVRlBPMEZCUVVFc2FVSkJRVTg3UVVGQlJ5eHJRa0ZCUnl4SFFVRkZMRVZCUVVVc1VVRkJTenRCUVVGVExHMUNRVUZGTEUxQlFVY3NTVUZCUnl4SFFVRkZMRVZCUVVVc1RVRkJSeXhQUVVGTExFVkJRVVVzUjBGQlJTeExRVUZITEV0QlFVVXNSMEZCUlR0QlFVRkJMR2xDUVVGVE8wRkJRVWNzY1VKQlFVOHNUMEZCU1N4SlFVRkZMRXRCUVVjN1FVRkJRVHRCUVVGVkxITkNRVUZQTzBGQlFVRXNjVUpCUVZFN1FVRkJSU3gxUWtGQlJUdEJRVUZGTEhsQ1FVRlBMRVZCUVVVc1RVRkJSeXhKUVVGRkxFdEJRVWM3UVVGQlFTeHhRa0ZCVHl4TlFVRkZMRVZCUVVVc1RVRkJSenRCUVVGQkxIRkNRVUZQTzBGQlFVVXNlVUpCUVU4c1QwRkJTU3hKUVVGRkxFdEJRVVVzUzBGQlJTeExRVUZGTEV0QlFVVTdRVUZCUVR0QlFVRlZMSGxDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVZjN0lpd0tJQ0FpYm1GdFpYTWlPaUJiWFFwOUNnPT1cbiIsInZhciB3ZWFrTWVtb2l6ZSA9IGZ1bmN0aW9uIHdlYWtNZW1vaXplKGZ1bmMpIHtcbiAgLy8gJEZsb3dGaXhNZSBmbG93IGRvZXNuJ3QgaW5jbHVkZSBhbGwgbm9uLXByaW1pdGl2ZSB0eXBlcyBhcyBhbGxvd2VkIGZvciB3ZWFrbWFwc1xuICB2YXIgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgIGlmIChjYWNoZS5oYXMoYXJnKSkge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgcmV0dXJuIGNhY2hlLmdldChhcmcpO1xuICAgIH1cblxuICAgIHZhciByZXQgPSBmdW5jKGFyZyk7XG4gICAgY2FjaGUuc2V0KGFyZywgcmV0KTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2Vha01lbW9pemU7XG4iLCJmdW5jdGlvbiBtZW1vaXplKGZuKSB7XG4gIHZhciBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgaWYgKGNhY2hlW2FyZ10gPT09IHVuZGVmaW5lZCkgY2FjaGVbYXJnXSA9IGZuKGFyZyk7XG4gICAgcmV0dXJuIGNhY2hlW2FyZ107XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW9pemU7XG4iLCJpbXBvcnQgeyBTdHlsZVNoZWV0IH0gZnJvbSAnQGVtb3Rpb24vc2hlZXQnO1xuaW1wb3J0IHsgZGVhbGxvYywgYWxsb2MsIG5leHQsIHRva2VuLCBmcm9tLCBwZWVrLCBkZWxpbWl0LCBpZGVudGlmaWVyLCBwb3NpdGlvbiwgc3RyaW5naWZ5LCBDT01NRU5ULCBydWxlc2hlZXQsIG1pZGRsZXdhcmUsIHByZWZpeGVyLCBzZXJpYWxpemUsIGNvbXBpbGUgfSBmcm9tICdzdHlsaXMnO1xuaW1wb3J0ICdAZW1vdGlvbi93ZWFrLW1lbW9pemUnO1xuaW1wb3J0ICdAZW1vdGlvbi9tZW1vaXplJztcblxudmFyIGxhc3QgPSBmdW5jdGlvbiBsYXN0KGFycikge1xuICByZXR1cm4gYXJyLmxlbmd0aCA/IGFyclthcnIubGVuZ3RoIC0gMV0gOiBudWxsO1xufTtcblxudmFyIHRvUnVsZXMgPSBmdW5jdGlvbiB0b1J1bGVzKHBhcnNlZCwgcG9pbnRzKSB7XG4gIC8vIHByZXRlbmQgd2UndmUgc3RhcnRlZCB3aXRoIGEgY29tbWFcbiAgdmFyIGluZGV4ID0gLTE7XG4gIHZhciBjaGFyYWN0ZXIgPSA0NDtcblxuICBkbyB7XG4gICAgc3dpdGNoICh0b2tlbihjaGFyYWN0ZXIpKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIC8vICZcXGZcbiAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gMzggJiYgcGVlaygpID09PSAxMikge1xuICAgICAgICAgIC8vIHRoaXMgaXMgbm90IDEwMCUgY29ycmVjdCwgd2UgZG9uJ3QgYWNjb3VudCBmb3IgbGl0ZXJhbCBzZXF1ZW5jZXMgaGVyZSAtIGxpa2UgZm9yIGV4YW1wbGUgcXVvdGVkIHN0cmluZ3NcbiAgICAgICAgICAvLyBzdHlsaXMgaW5zZXJ0cyBcXGYgYWZ0ZXIgJiB0byBrbm93IHdoZW4gJiB3aGVyZSBpdCBzaG91bGQgcmVwbGFjZSB0aGlzIHNlcXVlbmNlIHdpdGggdGhlIGNvbnRleHQgc2VsZWN0b3JcbiAgICAgICAgICAvLyBhbmQgd2hlbiBpdCBzaG91bGQganVzdCBjb25jYXRlbmF0ZSB0aGUgb3V0ZXIgYW5kIGlubmVyIHNlbGVjdG9yc1xuICAgICAgICAgIC8vIGl0J3MgdmVyeSB1bmxpa2VseSBmb3IgdGhpcyBzZXF1ZW5jZSB0byBhY3R1YWxseSBhcHBlYXIgaW4gYSBkaWZmZXJlbnQgY29udGV4dCwgc28gd2UganVzdCBsZXZlcmFnZSB0aGlzIGZhY3QgaGVyZVxuICAgICAgICAgIHBvaW50c1tpbmRleF0gPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2VkW2luZGV4XSArPSBpZGVudGlmaWVyKHBvc2l0aW9uIC0gMSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHBhcnNlZFtpbmRleF0gKz0gZGVsaW1pdChjaGFyYWN0ZXIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA0OlxuICAgICAgICAvLyBjb21tYVxuICAgICAgICBpZiAoY2hhcmFjdGVyID09PSA0NCkge1xuICAgICAgICAgIC8vIGNvbG9uXG4gICAgICAgICAgcGFyc2VkWysraW5kZXhdID0gcGVlaygpID09PSA1OCA/ICcmXFxmJyA6ICcnO1xuICAgICAgICAgIHBvaW50c1tpbmRleF0gPSBwYXJzZWRbaW5kZXhdLmxlbmd0aDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAvLyBmYWxsdGhyb3VnaFxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBwYXJzZWRbaW5kZXhdICs9IGZyb20oY2hhcmFjdGVyKTtcbiAgICB9XG4gIH0gd2hpbGUgKGNoYXJhY3RlciA9IG5leHQoKSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG5cbnZhciBnZXRSdWxlcyA9IGZ1bmN0aW9uIGdldFJ1bGVzKHZhbHVlLCBwb2ludHMpIHtcbiAgcmV0dXJuIGRlYWxsb2ModG9SdWxlcyhhbGxvYyh2YWx1ZSksIHBvaW50cykpO1xufTsgLy8gV2Vha1NldCB3b3VsZCBiZSBtb3JlIGFwcHJvcHJpYXRlLCBidXQgb25seSBXZWFrTWFwIGlzIHN1cHBvcnRlZCBpbiBJRTExXG5cblxudmFyIGZpeGVkRWxlbWVudHMgPSAvKiAjX19QVVJFX18gKi9uZXcgV2Vha01hcCgpO1xudmFyIGNvbXBhdCA9IGZ1bmN0aW9uIGNvbXBhdChlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50LnR5cGUgIT09ICdydWxlJyB8fCAhZWxlbWVudC5wYXJlbnQgfHwgLy8gLmxlbmd0aCBpbmRpY2F0ZXMgaWYgdGhpcyBydWxlIGNvbnRhaW5zIHBzZXVkbyBvciBub3RcbiAgIWVsZW1lbnQubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gZWxlbWVudC52YWx1ZSxcbiAgICAgIHBhcmVudCA9IGVsZW1lbnQucGFyZW50O1xuICB2YXIgaXNJbXBsaWNpdFJ1bGUgPSBlbGVtZW50LmNvbHVtbiA9PT0gcGFyZW50LmNvbHVtbiAmJiBlbGVtZW50LmxpbmUgPT09IHBhcmVudC5saW5lO1xuXG4gIHdoaWxlIChwYXJlbnQudHlwZSAhPT0gJ3J1bGUnKSB7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICBpZiAoIXBhcmVudCkgcmV0dXJuO1xuICB9IC8vIHNob3J0LWNpcmN1aXQgZm9yIHRoZSBzaW1wbGVzdCBjYXNlXG5cblxuICBpZiAoZWxlbWVudC5wcm9wcy5sZW5ndGggPT09IDEgJiYgdmFsdWUuY2hhckNvZGVBdCgwKSAhPT0gNThcbiAgLyogY29sb24gKi9cbiAgJiYgIWZpeGVkRWxlbWVudHMuZ2V0KHBhcmVudCkpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gaWYgdGhpcyBpcyBhbiBpbXBsaWNpdGx5IGluc2VydGVkIHJ1bGUgKHRoZSBvbmUgZWFnZXJseSBpbnNlcnRlZCBhdCB0aGUgZWFjaCBuZXcgbmVzdGVkIGxldmVsKVxuICAvLyB0aGVuIHRoZSBwcm9wcyBoYXMgYWxyZWFkeSBiZWVuIG1hbmlwdWxhdGVkIGJlZm9yZWhhbmQgYXMgdGhleSB0aGF0IGFycmF5IGlzIHNoYXJlZCBiZXR3ZWVuIGl0IGFuZCBpdHMgXCJydWxlIHBhcmVudFwiXG5cblxuICBpZiAoaXNJbXBsaWNpdFJ1bGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmaXhlZEVsZW1lbnRzLnNldChlbGVtZW50LCB0cnVlKTtcbiAgdmFyIHBvaW50cyA9IFtdO1xuICB2YXIgcnVsZXMgPSBnZXRSdWxlcyh2YWx1ZSwgcG9pbnRzKTtcbiAgdmFyIHBhcmVudFJ1bGVzID0gcGFyZW50LnByb3BzO1xuXG4gIGZvciAodmFyIGkgPSAwLCBrID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYXJlbnRSdWxlcy5sZW5ndGg7IGorKywgaysrKSB7XG4gICAgICBlbGVtZW50LnByb3BzW2tdID0gcG9pbnRzW2ldID8gcnVsZXNbaV0ucmVwbGFjZSgvJlxcZi9nLCBwYXJlbnRSdWxlc1tqXSkgOiBwYXJlbnRSdWxlc1tqXSArIFwiIFwiICsgcnVsZXNbaV07XG4gICAgfVxuICB9XG59O1xudmFyIHJlbW92ZUxhYmVsID0gZnVuY3Rpb24gcmVtb3ZlTGFiZWwoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC50eXBlID09PSAnZGVjbCcpIHtcbiAgICB2YXIgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXG4gICAgaWYgKCAvLyBjaGFyY29kZSBmb3IgbFxuICAgIHZhbHVlLmNoYXJDb2RlQXQoMCkgPT09IDEwOCAmJiAvLyBjaGFyY29kZSBmb3IgYlxuICAgIHZhbHVlLmNoYXJDb2RlQXQoMikgPT09IDk4KSB7XG4gICAgICAvLyB0aGlzIGlnbm9yZXMgbGFiZWxcbiAgICAgIGVsZW1lbnRbXCJyZXR1cm5cIl0gPSAnJztcbiAgICAgIGVsZW1lbnQudmFsdWUgPSAnJztcbiAgICB9XG4gIH1cbn07XG52YXIgaWdub3JlRmxhZyA9ICdlbW90aW9uLWRpc2FibGUtc2VydmVyLXJlbmRlcmluZy11bnNhZmUtc2VsZWN0b3Itd2FybmluZy1wbGVhc2UtZG8tbm90LXVzZS10aGlzLXRoZS13YXJuaW5nLWV4aXN0cy1mb3ItYS1yZWFzb24nO1xuXG52YXIgaXNJZ25vcmluZ0NvbW1lbnQgPSBmdW5jdGlvbiBpc0lnbm9yaW5nQ29tbWVudChlbGVtZW50KSB7XG4gIHJldHVybiAhIWVsZW1lbnQgJiYgZWxlbWVudC50eXBlID09PSAnY29tbScgJiYgZWxlbWVudC5jaGlsZHJlbi5pbmRleE9mKGlnbm9yZUZsYWcpID4gLTE7XG59O1xuXG52YXIgY3JlYXRlVW5zYWZlU2VsZWN0b3JzQWxhcm0gPSBmdW5jdGlvbiBjcmVhdGVVbnNhZmVTZWxlY3RvcnNBbGFybShjYWNoZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4LCBjaGlsZHJlbikge1xuICAgIGlmIChlbGVtZW50LnR5cGUgIT09ICdydWxlJykgcmV0dXJuO1xuICAgIHZhciB1bnNhZmVQc2V1ZG9DbGFzc2VzID0gZWxlbWVudC52YWx1ZS5tYXRjaCgvKDpmaXJzdHw6bnRofDpudGgtbGFzdCktY2hpbGQvZyk7XG5cbiAgICBpZiAodW5zYWZlUHNldWRvQ2xhc3NlcyAmJiBjYWNoZS5jb21wYXQgIT09IHRydWUpIHtcbiAgICAgIHZhciBwcmV2RWxlbWVudCA9IGluZGV4ID4gMCA/IGNoaWxkcmVuW2luZGV4IC0gMV0gOiBudWxsO1xuXG4gICAgICBpZiAocHJldkVsZW1lbnQgJiYgaXNJZ25vcmluZ0NvbW1lbnQobGFzdChwcmV2RWxlbWVudC5jaGlsZHJlbikpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdW5zYWZlUHNldWRvQ2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uICh1bnNhZmVQc2V1ZG9DbGFzcykge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlIHBzZXVkbyBjbGFzcyBcXFwiXCIgKyB1bnNhZmVQc2V1ZG9DbGFzcyArIFwiXFxcIiBpcyBwb3RlbnRpYWxseSB1bnNhZmUgd2hlbiBkb2luZyBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuIFRyeSBjaGFuZ2luZyBpdCB0byBcXFwiXCIgKyB1bnNhZmVQc2V1ZG9DbGFzcy5zcGxpdCgnLWNoaWxkJylbMF0gKyBcIi1vZi10eXBlXFxcIi5cIik7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgaXNJbXBvcnRSdWxlID0gZnVuY3Rpb24gaXNJbXBvcnRSdWxlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQudHlwZS5jaGFyQ29kZUF0KDEpID09PSAxMDUgJiYgZWxlbWVudC50eXBlLmNoYXJDb2RlQXQoMCkgPT09IDY0O1xufTtcblxudmFyIGlzUHJlcGVuZGVkV2l0aFJlZ3VsYXJSdWxlcyA9IGZ1bmN0aW9uIGlzUHJlcGVuZGVkV2l0aFJlZ3VsYXJSdWxlcyhpbmRleCwgY2hpbGRyZW4pIHtcbiAgZm9yICh2YXIgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoIWlzSW1wb3J0UnVsZShjaGlsZHJlbltpXSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07IC8vIHVzZSB0aGlzIHRvIHJlbW92ZSBpbmNvcnJlY3QgZWxlbWVudHMgZnJvbSBmdXJ0aGVyIHByb2Nlc3Npbmdcbi8vIHNvIHRoZXkgZG9uJ3QgZ2V0IGhhbmRlZCB0byB0aGUgYHNoZWV0YCAob3IgYW55dGhpbmcgZWxzZSlcbi8vIGFzIHRoYXQgY291bGQgcG90ZW50aWFsbHkgbGVhZCB0byBhZGRpdGlvbmFsIGxvZ3Mgd2hpY2ggaW4gdHVybiBjb3VsZCBiZSBvdmVyaGVsbWluZyB0byB0aGUgdXNlclxuXG5cbnZhciBudWxsaWZ5RWxlbWVudCA9IGZ1bmN0aW9uIG51bGxpZnlFbGVtZW50KGVsZW1lbnQpIHtcbiAgZWxlbWVudC50eXBlID0gJyc7XG4gIGVsZW1lbnQudmFsdWUgPSAnJztcbiAgZWxlbWVudFtcInJldHVyblwiXSA9ICcnO1xuICBlbGVtZW50LmNoaWxkcmVuID0gJyc7XG4gIGVsZW1lbnQucHJvcHMgPSAnJztcbn07XG5cbnZhciBpbmNvcnJlY3RJbXBvcnRBbGFybSA9IGZ1bmN0aW9uIGluY29ycmVjdEltcG9ydEFsYXJtKGVsZW1lbnQsIGluZGV4LCBjaGlsZHJlbikge1xuICBpZiAoIWlzSW1wb3J0UnVsZShlbGVtZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChlbGVtZW50LnBhcmVudCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJgQGltcG9ydGAgcnVsZXMgY2FuJ3QgYmUgbmVzdGVkIGluc2lkZSBvdGhlciBydWxlcy4gUGxlYXNlIG1vdmUgaXQgdG8gdGhlIHRvcCBsZXZlbCBhbmQgcHV0IGl0IGJlZm9yZSByZWd1bGFyIHJ1bGVzLiBLZWVwIGluIG1pbmQgdGhhdCB0aGV5IGNhbiBvbmx5IGJlIHVzZWQgd2l0aGluIGdsb2JhbCBzdHlsZXMuXCIpO1xuICAgIG51bGxpZnlFbGVtZW50KGVsZW1lbnQpO1xuICB9IGVsc2UgaWYgKGlzUHJlcGVuZGVkV2l0aFJlZ3VsYXJSdWxlcyhpbmRleCwgY2hpbGRyZW4pKSB7XG4gICAgY29uc29sZS5lcnJvcihcImBAaW1wb3J0YCBydWxlcyBjYW4ndCBiZSBhZnRlciBvdGhlciBydWxlcy4gUGxlYXNlIHB1dCB5b3VyIGBAaW1wb3J0YCBydWxlcyBiZWZvcmUgeW91ciBvdGhlciBydWxlcy5cIik7XG4gICAgbnVsbGlmeUVsZW1lbnQoZWxlbWVudCk7XG4gIH1cbn07XG5cbnZhciBkZWZhdWx0U3R5bGlzUGx1Z2lucyA9IFtwcmVmaXhlcl07XG5cbnZhciBjcmVhdGVDYWNoZSA9IGZ1bmN0aW9uIGNyZWF0ZUNhY2hlKG9wdGlvbnMpIHtcbiAgdmFyIGtleSA9IG9wdGlvbnMua2V5O1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICFrZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgaGF2ZSB0byBjb25maWd1cmUgYGtleWAgZm9yIHlvdXIgY2FjaGUuIFBsZWFzZSBtYWtlIHN1cmUgaXQncyB1bmlxdWUgKGFuZCBub3QgZXF1YWwgdG8gJ2NzcycpIGFzIGl0J3MgdXNlZCBmb3IgbGlua2luZyBzdHlsZXMgdG8geW91ciBjYWNoZS5cXG5cIiArIFwiSWYgbXVsdGlwbGUgY2FjaGVzIHNoYXJlIHRoZSBzYW1lIGtleSB0aGV5IG1pZ2h0IFxcXCJmaWdodFxcXCIgZm9yIGVhY2ggb3RoZXIncyBzdHlsZSBlbGVtZW50cy5cIik7XG4gIH1cblxuICBpZiAoIGtleSA9PT0gJ2NzcycpIHtcbiAgICB2YXIgc3NyU3R5bGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInN0eWxlW2RhdGEtZW1vdGlvbl06bm90KFtkYXRhLXNdKVwiKTsgLy8gZ2V0IFNTUmVkIHN0eWxlcyBvdXQgb2YgdGhlIHdheSBvZiBSZWFjdCdzIGh5ZHJhdGlvblxuICAgIC8vIGRvY3VtZW50LmhlYWQgaXMgYSBzYWZlIHBsYWNlIHRvIG1vdmUgdGhlbSB0byh0aG91Z2ggbm90ZSBkb2N1bWVudC5oZWFkIGlzIG5vdCBuZWNlc3NhcmlseSB0aGUgbGFzdCBwbGFjZSB0aGV5IHdpbGwgYmUpXG4gICAgLy8gbm90ZSB0aGlzIHZlcnkgdmVyeSBpbnRlbnRpb25hbGx5IHRhcmdldHMgYWxsIHN0eWxlIGVsZW1lbnRzIHJlZ2FyZGxlc3Mgb2YgdGhlIGtleSB0byBlbnN1cmVcbiAgICAvLyB0aGF0IGNyZWF0aW5nIGEgY2FjaGUgd29ya3MgaW5zaWRlIG9mIHJlbmRlciBvZiBhIFJlYWN0IGNvbXBvbmVudFxuXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChzc3JTdHlsZXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAvLyB3ZSB3YW50IHRvIG9ubHkgbW92ZSBlbGVtZW50cyB3aGljaCBoYXZlIGEgc3BhY2UgaW4gdGhlIGRhdGEtZW1vdGlvbiBhdHRyaWJ1dGUgdmFsdWVcbiAgICAgIC8vIGJlY2F1c2UgdGhhdCBpbmRpY2F0ZXMgdGhhdCBpdCBpcyBhbiBFbW90aW9uIDExIHNlcnZlci1zaWRlIHJlbmRlcmVkIHN0eWxlIGVsZW1lbnRzXG4gICAgICAvLyB3aGlsZSB3ZSB3aWxsIGFscmVhZHkgaWdub3JlIEVtb3Rpb24gMTEgY2xpZW50LXNpZGUgaW5zZXJ0ZWQgc3R5bGVzIGJlY2F1c2Ugb2YgdGhlIDpub3QoW2RhdGEtc10pIHBhcnQgaW4gdGhlIHNlbGVjdG9yXG4gICAgICAvLyBFbW90aW9uIDEwIGNsaWVudC1zaWRlIGluc2VydGVkIHN0eWxlcyBkaWQgbm90IGhhdmUgZGF0YS1zIChidXQgaW1wb3J0YW50bHkgZGlkIG5vdCBoYXZlIGEgc3BhY2UgaW4gdGhlaXIgZGF0YS1lbW90aW9uIGF0dHJpYnV0ZXMpXG4gICAgICAvLyBzbyBjaGVja2luZyBmb3IgdGhlIHNwYWNlIGVuc3VyZXMgdGhhdCBsb2FkaW5nIEVtb3Rpb24gMTEgYWZ0ZXIgRW1vdGlvbiAxMCBoYXMgaW5zZXJ0ZWQgc29tZSBzdHlsZXNcbiAgICAgIC8vIHdpbGwgbm90IHJlc3VsdCBpbiB0aGUgRW1vdGlvbiAxMCBzdHlsZXMgYmVpbmcgZGVzdHJveWVkXG4gICAgICB2YXIgZGF0YUVtb3Rpb25BdHRyaWJ1dGUgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1lbW90aW9uJyk7XG5cbiAgICAgIGlmIChkYXRhRW1vdGlvbkF0dHJpYnV0ZS5pbmRleE9mKCcgJykgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1zJywgJycpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHN0eWxpc1BsdWdpbnMgPSBvcHRpb25zLnN0eWxpc1BsdWdpbnMgfHwgZGVmYXVsdFN0eWxpc1BsdWdpbnM7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgaWYgKC9bXmEtei1dLy50ZXN0KGtleSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVtb3Rpb24ga2V5IG11c3Qgb25seSBjb250YWluIGxvd2VyIGNhc2UgYWxwaGFiZXRpY2FsIGNoYXJhY3RlcnMgYW5kIC0gYnV0IFxcXCJcIiArIGtleSArIFwiXFxcIiB3YXMgcGFzc2VkXCIpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpbnNlcnRlZCA9IHt9OyAvLyAkRmxvd0ZpeE1lXG5cbiAgdmFyIGNvbnRhaW5lcjtcbiAgdmFyIG5vZGVzVG9IeWRyYXRlID0gW107XG5cbiAge1xuICAgIGNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyIHx8IGRvY3VtZW50LmhlYWQ7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCggLy8gdGhpcyBtZWFucyB3ZSB3aWxsIGlnbm9yZSBlbGVtZW50cyB3aGljaCBkb24ndCBoYXZlIGEgc3BhY2UgaW4gdGhlbSB3aGljaFxuICAgIC8vIG1lYW5zIHRoYXQgdGhlIHN0eWxlIGVsZW1lbnRzIHdlJ3JlIGxvb2tpbmcgYXQgYXJlIG9ubHkgRW1vdGlvbiAxMSBzZXJ2ZXItcmVuZGVyZWQgc3R5bGUgZWxlbWVudHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwic3R5bGVbZGF0YS1lbW90aW9uXj1cXFwiXCIgKyBrZXkgKyBcIiBcXFwiXVwiKSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHZhciBhdHRyaWIgPSBub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtZW1vdGlvblwiKS5zcGxpdCgnICcpOyAvLyAkRmxvd0ZpeE1lXG5cbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXR0cmliLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGluc2VydGVkW2F0dHJpYltpXV0gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBub2Rlc1RvSHlkcmF0ZS5wdXNoKG5vZGUpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIF9pbnNlcnQ7XG5cbiAgdmFyIG9tbmlwcmVzZW50UGx1Z2lucyA9IFtjb21wYXQsIHJlbW92ZUxhYmVsXTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIG9tbmlwcmVzZW50UGx1Z2lucy5wdXNoKGNyZWF0ZVVuc2FmZVNlbGVjdG9yc0FsYXJtKHtcbiAgICAgIGdldCBjb21wYXQoKSB7XG4gICAgICAgIHJldHVybiBjYWNoZS5jb21wYXQ7XG4gICAgICB9XG5cbiAgICB9KSwgaW5jb3JyZWN0SW1wb3J0QWxhcm0pO1xuICB9XG5cbiAge1xuICAgIHZhciBjdXJyZW50U2hlZXQ7XG4gICAgdmFyIGZpbmFsaXppbmdQbHVnaW5zID0gW3N0cmluZ2lmeSwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICBpZiAoIWVsZW1lbnQucm9vdCkge1xuICAgICAgICBpZiAoZWxlbWVudFtcInJldHVyblwiXSkge1xuICAgICAgICAgIGN1cnJlbnRTaGVldC5pbnNlcnQoZWxlbWVudFtcInJldHVyblwiXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC52YWx1ZSAmJiBlbGVtZW50LnR5cGUgIT09IENPTU1FTlQpIHtcbiAgICAgICAgICAvLyBpbnNlcnQgZW1wdHkgcnVsZSBpbiBub24tcHJvZHVjdGlvbiBlbnZpcm9ubWVudHNcbiAgICAgICAgICAvLyBzbyBAZW1vdGlvbi9qZXN0IGNhbiBncmFiIGBrZXlgIGZyb20gdGhlIChKUylET00gZm9yIGNhY2hlcyB3aXRob3V0IGFueSBydWxlcyBpbnNlcnRlZCB5ZXRcbiAgICAgICAgICBjdXJyZW50U2hlZXQuaW5zZXJ0KGVsZW1lbnQudmFsdWUgKyBcInt9XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSA6IHJ1bGVzaGVldChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgY3VycmVudFNoZWV0Lmluc2VydChydWxlKTtcbiAgICB9KV07XG4gICAgdmFyIHNlcmlhbGl6ZXIgPSBtaWRkbGV3YXJlKG9tbmlwcmVzZW50UGx1Z2lucy5jb25jYXQoc3R5bGlzUGx1Z2lucywgZmluYWxpemluZ1BsdWdpbnMpKTtcblxuICAgIHZhciBzdHlsaXMgPSBmdW5jdGlvbiBzdHlsaXMoc3R5bGVzKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplKGNvbXBpbGUoc3R5bGVzKSwgc2VyaWFsaXplcik7XG4gICAgfTtcblxuICAgIF9pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQoc2VsZWN0b3IsIHNlcmlhbGl6ZWQsIHNoZWV0LCBzaG91bGRDYWNoZSkge1xuICAgICAgY3VycmVudFNoZWV0ID0gc2hlZXQ7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHNlcmlhbGl6ZWQubWFwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3VycmVudFNoZWV0ID0ge1xuICAgICAgICAgIGluc2VydDogZnVuY3Rpb24gaW5zZXJ0KHJ1bGUpIHtcbiAgICAgICAgICAgIHNoZWV0Lmluc2VydChydWxlICsgc2VyaWFsaXplZC5tYXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgc3R5bGlzKHNlbGVjdG9yID8gc2VsZWN0b3IgKyBcIntcIiArIHNlcmlhbGl6ZWQuc3R5bGVzICsgXCJ9XCIgOiBzZXJpYWxpemVkLnN0eWxlcyk7XG5cbiAgICAgIGlmIChzaG91bGRDYWNoZSkge1xuICAgICAgICBjYWNoZS5pbnNlcnRlZFtzZXJpYWxpemVkLm5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIGNhY2hlID0ge1xuICAgIGtleToga2V5LFxuICAgIHNoZWV0OiBuZXcgU3R5bGVTaGVldCh7XG4gICAgICBrZXk6IGtleSxcbiAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgbm9uY2U6IG9wdGlvbnMubm9uY2UsXG4gICAgICBzcGVlZHk6IG9wdGlvbnMuc3BlZWR5LFxuICAgICAgcHJlcGVuZDogb3B0aW9ucy5wcmVwZW5kXG4gICAgfSksXG4gICAgbm9uY2U6IG9wdGlvbnMubm9uY2UsXG4gICAgaW5zZXJ0ZWQ6IGluc2VydGVkLFxuICAgIHJlZ2lzdGVyZWQ6IHt9LFxuICAgIGluc2VydDogX2luc2VydFxuICB9O1xuICBjYWNoZS5zaGVldC5oeWRyYXRlKG5vZGVzVG9IeWRyYXRlKTtcbiAgcmV0dXJuIGNhY2hlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ2FjaGU7XG4iLCJ2YXIgaXNCcm93c2VyID0gXCJvYmplY3RcIiAhPT0gJ3VuZGVmaW5lZCc7XG5mdW5jdGlvbiBnZXRSZWdpc3RlcmVkU3R5bGVzKHJlZ2lzdGVyZWQsIHJlZ2lzdGVyZWRTdHlsZXMsIGNsYXNzTmFtZXMpIHtcbiAgdmFyIHJhd0NsYXNzTmFtZSA9ICcnO1xuICBjbGFzc05hbWVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKHJlZ2lzdGVyZWRbY2xhc3NOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZWdpc3RlcmVkU3R5bGVzLnB1c2gocmVnaXN0ZXJlZFtjbGFzc05hbWVdICsgXCI7XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYXdDbGFzc05hbWUgKz0gY2xhc3NOYW1lICsgXCIgXCI7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJhd0NsYXNzTmFtZTtcbn1cbnZhciBpbnNlcnRTdHlsZXMgPSBmdW5jdGlvbiBpbnNlcnRTdHlsZXMoY2FjaGUsIHNlcmlhbGl6ZWQsIGlzU3RyaW5nVGFnKSB7XG4gIHZhciBjbGFzc05hbWUgPSBjYWNoZS5rZXkgKyBcIi1cIiArIHNlcmlhbGl6ZWQubmFtZTtcblxuICBpZiAoIC8vIHdlIG9ubHkgbmVlZCB0byBhZGQgdGhlIHN0eWxlcyB0byB0aGUgcmVnaXN0ZXJlZCBjYWNoZSBpZiB0aGVcbiAgLy8gY2xhc3MgbmFtZSBjb3VsZCBiZSB1c2VkIGZ1cnRoZXIgZG93blxuICAvLyB0aGUgdHJlZSBidXQgaWYgaXQncyBhIHN0cmluZyB0YWcsIHdlIGtub3cgaXQgd29uJ3RcbiAgLy8gc28gd2UgZG9uJ3QgaGF2ZSB0byBhZGQgaXQgdG8gcmVnaXN0ZXJlZCBjYWNoZS5cbiAgLy8gdGhpcyBpbXByb3ZlcyBtZW1vcnkgdXNhZ2Ugc2luY2Ugd2UgY2FuIGF2b2lkIHN0b3JpbmcgdGhlIHdob2xlIHN0eWxlIHN0cmluZ1xuICAoaXNTdHJpbmdUYWcgPT09IGZhbHNlIHx8IC8vIHdlIG5lZWQgdG8gYWx3YXlzIHN0b3JlIGl0IGlmIHdlJ3JlIGluIGNvbXBhdCBtb2RlIGFuZFxuICAvLyBpbiBub2RlIHNpbmNlIGVtb3Rpb24tc2VydmVyIHJlbGllcyBvbiB3aGV0aGVyIGEgc3R5bGUgaXMgaW5cbiAgLy8gdGhlIHJlZ2lzdGVyZWQgY2FjaGUgdG8ga25vdyB3aGV0aGVyIGEgc3R5bGUgaXMgZ2xvYmFsIG9yIG5vdFxuICAvLyBhbHNvLCBub3RlIHRoYXQgdGhpcyBjaGVjayB3aWxsIGJlIGRlYWQgY29kZSBlbGltaW5hdGVkIGluIHRoZSBicm93c2VyXG4gIGlzQnJvd3NlciA9PT0gZmFsc2UgKSAmJiBjYWNoZS5yZWdpc3RlcmVkW2NsYXNzTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgIGNhY2hlLnJlZ2lzdGVyZWRbY2xhc3NOYW1lXSA9IHNlcmlhbGl6ZWQuc3R5bGVzO1xuICB9XG5cbiAgaWYgKGNhY2hlLmluc2VydGVkW3NlcmlhbGl6ZWQubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjdXJyZW50ID0gc2VyaWFsaXplZDtcblxuICAgIGRvIHtcbiAgICAgIHZhciBtYXliZVN0eWxlcyA9IGNhY2hlLmluc2VydChzZXJpYWxpemVkID09PSBjdXJyZW50ID8gXCIuXCIgKyBjbGFzc05hbWUgOiAnJywgY3VycmVudCwgY2FjaGUuc2hlZXQsIHRydWUpO1xuXG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgIH0gd2hpbGUgKGN1cnJlbnQgIT09IHVuZGVmaW5lZCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGdldFJlZ2lzdGVyZWRTdHlsZXMsIGluc2VydFN0eWxlcyB9O1xuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9nYXJ5Y291cnQvbXVybXVyaGFzaC1qc1xuLy8gUG9ydGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FhcHBsZWJ5L3NtaGFzaGVyL2Jsb2IvNjFhMDUzMGYyODI3N2YyZTg1MGJmYzM5NjAwY2U2MWQwMmI1MThkZS9zcmMvTXVybXVySGFzaDIuY3BwI0wzNy1MODZcbmZ1bmN0aW9uIG11cm11cjIoc3RyKSB7XG4gIC8vICdtJyBhbmQgJ3InIGFyZSBtaXhpbmcgY29uc3RhbnRzIGdlbmVyYXRlZCBvZmZsaW5lLlxuICAvLyBUaGV5J3JlIG5vdCByZWFsbHkgJ21hZ2ljJywgdGhleSBqdXN0IGhhcHBlbiB0byB3b3JrIHdlbGwuXG4gIC8vIGNvbnN0IG0gPSAweDViZDFlOTk1O1xuICAvLyBjb25zdCByID0gMjQ7XG4gIC8vIEluaXRpYWxpemUgdGhlIGhhc2hcbiAgdmFyIGggPSAwOyAvLyBNaXggNCBieXRlcyBhdCBhIHRpbWUgaW50byB0aGUgaGFzaFxuXG4gIHZhciBrLFxuICAgICAgaSA9IDAsXG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xuXG4gIGZvciAoOyBsZW4gPj0gNDsgKytpLCBsZW4gLT0gNCkge1xuICAgIGsgPSBzdHIuY2hhckNvZGVBdChpKSAmIDB4ZmYgfCAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDggfCAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDE2IHwgKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCAyNDtcbiAgICBrID1cbiAgICAvKiBNYXRoLmltdWwoaywgbSk6ICovXG4gICAgKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoayA+Pj4gMTYpICogMHhlOTk1IDw8IDE2KTtcbiAgICBrIF49XG4gICAgLyogayA+Pj4gcjogKi9cbiAgICBrID4+PiAyNDtcbiAgICBoID1cbiAgICAvKiBNYXRoLmltdWwoaywgbSk6ICovXG4gICAgKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoayA+Pj4gMTYpICogMHhlOTk1IDw8IDE2KSBeXG4gICAgLyogTWF0aC5pbXVsKGgsIG0pOiAqL1xuICAgIChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUgKyAoKGggPj4+IDE2KSAqIDB4ZTk5NSA8PCAxNik7XG4gIH0gLy8gSGFuZGxlIHRoZSBsYXN0IGZldyBieXRlcyBvZiB0aGUgaW5wdXQgYXJyYXlcblxuXG4gIHN3aXRjaCAobGVuKSB7XG4gICAgY2FzZSAzOlxuICAgICAgaCBePSAoc3RyLmNoYXJDb2RlQXQoaSArIDIpICYgMHhmZikgPDwgMTY7XG5cbiAgICBjYXNlIDI6XG4gICAgICBoIF49IChzdHIuY2hhckNvZGVBdChpICsgMSkgJiAweGZmKSA8PCA4O1xuXG4gICAgY2FzZSAxOlxuICAgICAgaCBePSBzdHIuY2hhckNvZGVBdChpKSAmIDB4ZmY7XG4gICAgICBoID1cbiAgICAgIC8qIE1hdGguaW11bChoLCBtKTogKi9cbiAgICAgIChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUgKyAoKGggPj4+IDE2KSAqIDB4ZTk5NSA8PCAxNik7XG4gIH0gLy8gRG8gYSBmZXcgZmluYWwgbWl4ZXMgb2YgdGhlIGhhc2ggdG8gZW5zdXJlIHRoZSBsYXN0IGZld1xuICAvLyBieXRlcyBhcmUgd2VsbC1pbmNvcnBvcmF0ZWQuXG5cblxuICBoIF49IGggPj4+IDEzO1xuICBoID1cbiAgLyogTWF0aC5pbXVsKGgsIG0pOiAqL1xuICAoaCAmIDB4ZmZmZikgKiAweDViZDFlOTk1ICsgKChoID4+PiAxNikgKiAweGU5OTUgPDwgMTYpO1xuICByZXR1cm4gKChoIF4gaCA+Pj4gMTUpID4+PiAwKS50b1N0cmluZygzNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG11cm11cjI7XG4iLCJ2YXIgdW5pdGxlc3NLZXlzID0ge1xuICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogMSxcbiAgYm9yZGVySW1hZ2VPdXRzZXQ6IDEsXG4gIGJvcmRlckltYWdlU2xpY2U6IDEsXG4gIGJvcmRlckltYWdlV2lkdGg6IDEsXG4gIGJveEZsZXg6IDEsXG4gIGJveEZsZXhHcm91cDogMSxcbiAgYm94T3JkaW5hbEdyb3VwOiAxLFxuICBjb2x1bW5Db3VudDogMSxcbiAgY29sdW1uczogMSxcbiAgZmxleDogMSxcbiAgZmxleEdyb3c6IDEsXG4gIGZsZXhQb3NpdGl2ZTogMSxcbiAgZmxleFNocmluazogMSxcbiAgZmxleE5lZ2F0aXZlOiAxLFxuICBmbGV4T3JkZXI6IDEsXG4gIGdyaWRSb3c6IDEsXG4gIGdyaWRSb3dFbmQ6IDEsXG4gIGdyaWRSb3dTcGFuOiAxLFxuICBncmlkUm93U3RhcnQ6IDEsXG4gIGdyaWRDb2x1bW46IDEsXG4gIGdyaWRDb2x1bW5FbmQ6IDEsXG4gIGdyaWRDb2x1bW5TcGFuOiAxLFxuICBncmlkQ29sdW1uU3RhcnQ6IDEsXG4gIG1zR3JpZFJvdzogMSxcbiAgbXNHcmlkUm93U3BhbjogMSxcbiAgbXNHcmlkQ29sdW1uOiAxLFxuICBtc0dyaWRDb2x1bW5TcGFuOiAxLFxuICBmb250V2VpZ2h0OiAxLFxuICBsaW5lSGVpZ2h0OiAxLFxuICBvcGFjaXR5OiAxLFxuICBvcmRlcjogMSxcbiAgb3JwaGFuczogMSxcbiAgdGFiU2l6ZTogMSxcbiAgd2lkb3dzOiAxLFxuICB6SW5kZXg6IDEsXG4gIHpvb206IDEsXG4gIFdlYmtpdExpbmVDbGFtcDogMSxcbiAgLy8gU1ZHLXJlbGF0ZWQgcHJvcGVydGllc1xuICBmaWxsT3BhY2l0eTogMSxcbiAgZmxvb2RPcGFjaXR5OiAxLFxuICBzdG9wT3BhY2l0eTogMSxcbiAgc3Ryb2tlRGFzaGFycmF5OiAxLFxuICBzdHJva2VEYXNob2Zmc2V0OiAxLFxuICBzdHJva2VNaXRlcmxpbWl0OiAxLFxuICBzdHJva2VPcGFjaXR5OiAxLFxuICBzdHJva2VXaWR0aDogMVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdW5pdGxlc3NLZXlzO1xuIiwiaW1wb3J0IGhhc2hTdHJpbmcgZnJvbSAnQGVtb3Rpb24vaGFzaCc7XG5pbXBvcnQgdW5pdGxlc3MgZnJvbSAnQGVtb3Rpb24vdW5pdGxlc3MnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnQGVtb3Rpb24vbWVtb2l6ZSc7XG5cbnZhciBJTExFR0FMX0VTQ0FQRV9TRVFVRU5DRV9FUlJPUiA9IFwiWW91IGhhdmUgaWxsZWdhbCBlc2NhcGUgc2VxdWVuY2UgaW4geW91ciB0ZW1wbGF0ZSBsaXRlcmFsLCBtb3N0IGxpa2VseSBpbnNpZGUgY29udGVudCdzIHByb3BlcnR5IHZhbHVlLlxcbkJlY2F1c2UgeW91IHdyaXRlIHlvdXIgQ1NTIGluc2lkZSBhIEphdmFTY3JpcHQgc3RyaW5nIHlvdSBhY3R1YWxseSBoYXZlIHRvIGRvIGRvdWJsZSBlc2NhcGluZywgc28gZm9yIGV4YW1wbGUgXFxcImNvbnRlbnQ6ICdcXFxcMDBkNyc7XFxcIiBzaG91bGQgYmVjb21lIFxcXCJjb250ZW50OiAnXFxcXFxcXFwwMGQ3JztcXFwiLlxcbllvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoaXMgaGVyZTpcXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9UZW1wbGF0ZV9saXRlcmFscyNFUzIwMThfcmV2aXNpb25fb2ZfaWxsZWdhbF9lc2NhcGVfc2VxdWVuY2VzXCI7XG52YXIgVU5ERUZJTkVEX0FTX09CSkVDVF9LRVlfRVJST1IgPSBcIllvdSBoYXZlIHBhc3NlZCBpbiBmYWxzeSB2YWx1ZSBhcyBzdHlsZSBvYmplY3QncyBrZXkgKGNhbiBoYXBwZW4gd2hlbiBpbiBleGFtcGxlIHlvdSBwYXNzIHVuZXhwb3J0ZWQgY29tcG9uZW50IGFzIGNvbXB1dGVkIGtleSkuXCI7XG52YXIgaHlwaGVuYXRlUmVnZXggPSAvW0EtWl18Xm1zL2c7XG52YXIgYW5pbWF0aW9uUmVnZXggPSAvX0VNT18oW15fXSs/KV8oW15dKj8pX0VNT18vZztcblxudmFyIGlzQ3VzdG9tUHJvcGVydHkgPSBmdW5jdGlvbiBpc0N1c3RvbVByb3BlcnR5KHByb3BlcnR5KSB7XG4gIHJldHVybiBwcm9wZXJ0eS5jaGFyQ29kZUF0KDEpID09PSA0NTtcbn07XG5cbnZhciBpc1Byb2Nlc3NhYmxlVmFsdWUgPSBmdW5jdGlvbiBpc1Byb2Nlc3NhYmxlVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbic7XG59O1xuXG52YXIgcHJvY2Vzc1N0eWxlTmFtZSA9IC8qICNfX1BVUkVfXyAqL21lbW9pemUoZnVuY3Rpb24gKHN0eWxlTmFtZSkge1xuICByZXR1cm4gaXNDdXN0b21Qcm9wZXJ0eShzdHlsZU5hbWUpID8gc3R5bGVOYW1lIDogc3R5bGVOYW1lLnJlcGxhY2UoaHlwaGVuYXRlUmVnZXgsICctJCYnKS50b0xvd2VyQ2FzZSgpO1xufSk7XG5cbnZhciBwcm9jZXNzU3R5bGVWYWx1ZSA9IGZ1bmN0aW9uIHByb2Nlc3NTdHlsZVZhbHVlKGtleSwgdmFsdWUpIHtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlICdhbmltYXRpb24nOlxuICAgIGNhc2UgJ2FuaW1hdGlvbk5hbWUnOlxuICAgICAge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKGFuaW1hdGlvblJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gsIHAxLCBwMikge1xuICAgICAgICAgICAgY3Vyc29yID0ge1xuICAgICAgICAgICAgICBuYW1lOiBwMSxcbiAgICAgICAgICAgICAgc3R5bGVzOiBwMixcbiAgICAgICAgICAgICAgbmV4dDogY3Vyc29yXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHAxO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICBpZiAodW5pdGxlc3Nba2V5XSAhPT0gMSAmJiAhaXNDdXN0b21Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdmFsdWUgKyAncHgnO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGNvbnRlbnRWYWx1ZVBhdHRlcm4gPSAvKGF0dHJ8Y291bnRlcnM/fHVybHwoKChyZXBlYXRpbmctKT8obGluZWFyfHJhZGlhbCkpfGNvbmljKS1ncmFkaWVudClcXCh8KG5vLSk/KG9wZW58Y2xvc2UpLXF1b3RlLztcbiAgdmFyIGNvbnRlbnRWYWx1ZXMgPSBbJ25vcm1hbCcsICdub25lJywgJ2luaXRpYWwnLCAnaW5oZXJpdCcsICd1bnNldCddO1xuICB2YXIgb2xkUHJvY2Vzc1N0eWxlVmFsdWUgPSBwcm9jZXNzU3R5bGVWYWx1ZTtcbiAgdmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG4gIHZhciBoeXBoZW5QYXR0ZXJuID0gLy0oLikvZztcbiAgdmFyIGh5cGhlbmF0ZWRDYWNoZSA9IHt9O1xuXG4gIHByb2Nlc3NTdHlsZVZhbHVlID0gZnVuY3Rpb24gcHJvY2Vzc1N0eWxlVmFsdWUoa2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgPT09ICdjb250ZW50Jykge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgfHwgY29udGVudFZhbHVlcy5pbmRleE9mKHZhbHVlKSA9PT0gLTEgJiYgIWNvbnRlbnRWYWx1ZVBhdHRlcm4udGVzdCh2YWx1ZSkgJiYgKHZhbHVlLmNoYXJBdCgwKSAhPT0gdmFsdWUuY2hhckF0KHZhbHVlLmxlbmd0aCAtIDEpIHx8IHZhbHVlLmNoYXJBdCgwKSAhPT0gJ1wiJyAmJiB2YWx1ZS5jaGFyQXQoMCkgIT09IFwiJ1wiKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3Ugc2VlbSB0byBiZSB1c2luZyBhIHZhbHVlIGZvciAnY29udGVudCcgd2l0aG91dCBxdW90ZXMsIHRyeSByZXBsYWNpbmcgaXQgd2l0aCBgY29udGVudDogJ1xcXCJcIiArIHZhbHVlICsgXCJcXFwiJ2BcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByb2Nlc3NlZCA9IG9sZFByb2Nlc3NTdHlsZVZhbHVlKGtleSwgdmFsdWUpO1xuXG4gICAgaWYgKHByb2Nlc3NlZCAhPT0gJycgJiYgIWlzQ3VzdG9tUHJvcGVydHkoa2V5KSAmJiBrZXkuaW5kZXhPZignLScpICE9PSAtMSAmJiBoeXBoZW5hdGVkQ2FjaGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBoeXBoZW5hdGVkQ2FjaGVba2V5XSA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKFwiVXNpbmcga2ViYWItY2FzZSBmb3IgY3NzIHByb3BlcnRpZXMgaW4gb2JqZWN0cyBpcyBub3Qgc3VwcG9ydGVkLiBEaWQgeW91IG1lYW4gXCIgKyBrZXkucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKS5yZXBsYWNlKGh5cGhlblBhdHRlcm4sIGZ1bmN0aW9uIChzdHIsIF9jaGFyKSB7XG4gICAgICAgIHJldHVybiBfY2hhci50b1VwcGVyQ2FzZSgpO1xuICAgICAgfSkgKyBcIj9cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgaW50ZXJwb2xhdGlvbikge1xuICBpZiAoaW50ZXJwb2xhdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgaWYgKGludGVycG9sYXRpb24uX19lbW90aW9uX3N0eWxlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgaW50ZXJwb2xhdGlvbi50b1N0cmluZygpID09PSAnTk9fQ09NUE9ORU5UX1NFTEVDVE9SJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgc2VsZWN0b3JzIGNhbiBvbmx5IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBAZW1vdGlvbi9iYWJlbC1wbHVnaW4uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVycG9sYXRpb247XG4gIH1cblxuICBzd2l0Y2ggKHR5cGVvZiBpbnRlcnBvbGF0aW9uKSB7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICB7XG4gICAgICAgIGlmIChpbnRlcnBvbGF0aW9uLmFuaW0gPT09IDEpIHtcbiAgICAgICAgICBjdXJzb3IgPSB7XG4gICAgICAgICAgICBuYW1lOiBpbnRlcnBvbGF0aW9uLm5hbWUsXG4gICAgICAgICAgICBzdHlsZXM6IGludGVycG9sYXRpb24uc3R5bGVzLFxuICAgICAgICAgICAgbmV4dDogY3Vyc29yXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGlvbi5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGludGVycG9sYXRpb24uc3R5bGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGludGVycG9sYXRpb24ubmV4dDtcblxuICAgICAgICAgIGlmIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIG5vdCB0aGUgbW9zdCBlZmZpY2llbnQgdGhpbmcgZXZlciBidXQgdGhpcyBpcyBhIHByZXR0eSByYXJlIGNhc2VcbiAgICAgICAgICAgIC8vIGFuZCB0aGVyZSB3aWxsIGJlIHZlcnkgZmV3IGl0ZXJhdGlvbnMgb2YgdGhpcyBnZW5lcmFsbHlcbiAgICAgICAgICAgIHdoaWxlIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY3Vyc29yID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5leHQubmFtZSxcbiAgICAgICAgICAgICAgICBzdHlsZXM6IG5leHQuc3R5bGVzLFxuICAgICAgICAgICAgICAgIG5leHQ6IGN1cnNvclxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBuZXh0ID0gbmV4dC5uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdHlsZXMgPSBpbnRlcnBvbGF0aW9uLnN0eWxlcyArIFwiO1wiO1xuXG4gICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgaW50ZXJwb2xhdGlvbi5tYXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3R5bGVzICs9IGludGVycG9sYXRpb24ubWFwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdHlsZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3JlYXRlU3RyaW5nRnJvbU9iamVjdChtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgaW50ZXJwb2xhdGlvbik7XG4gICAgICB9XG5cbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICB7XG4gICAgICAgIGlmIChtZXJnZWRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIHByZXZpb3VzQ3Vyc29yID0gY3Vyc29yO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBpbnRlcnBvbGF0aW9uKG1lcmdlZFByb3BzKTtcbiAgICAgICAgICBjdXJzb3IgPSBwcmV2aW91c0N1cnNvcjtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRnVuY3Rpb25zIHRoYXQgYXJlIGludGVycG9sYXRlZCBpbiBjc3MgY2FsbHMgd2lsbCBiZSBzdHJpbmdpZmllZC5cXG4nICsgJ0lmIHlvdSB3YW50IHRvIGhhdmUgYSBjc3MgY2FsbCBiYXNlZCBvbiBwcm9wcywgY3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgY3NzIGNhbGwgbGlrZSB0aGlzXFxuJyArICdsZXQgZHluYW1pY1N0eWxlID0gKHByb3BzKSA9PiBjc3NgY29sb3I6ICR7cHJvcHMuY29sb3J9YFxcbicgKyAnSXQgY2FuIGJlIGNhbGxlZCBkaXJlY3RseSB3aXRoIHByb3BzIG9yIGludGVycG9sYXRlZCBpbiBhIHN0eWxlZCBjYWxsIGxpa2UgdGhpc1xcbicgKyBcImxldCBTb21lQ29tcG9uZW50ID0gc3R5bGVkKCdkaXYnKWAke2R5bmFtaWNTdHlsZX1gXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBbXTtcbiAgICAgICAgdmFyIHJlcGxhY2VkID0gaW50ZXJwb2xhdGlvbi5yZXBsYWNlKGFuaW1hdGlvblJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gsIHAxLCBwMikge1xuICAgICAgICAgIHZhciBmYWtlVmFyTmFtZSA9IFwiYW5pbWF0aW9uXCIgKyBtYXRjaGVkLmxlbmd0aDtcbiAgICAgICAgICBtYXRjaGVkLnB1c2goXCJjb25zdCBcIiArIGZha2VWYXJOYW1lICsgXCIgPSBrZXlmcmFtZXNgXCIgKyBwMi5yZXBsYWNlKC9eQGtleWZyYW1lcyBhbmltYXRpb24tXFx3Ky8sICcnKSArIFwiYFwiKTtcbiAgICAgICAgICByZXR1cm4gXCIke1wiICsgZmFrZVZhck5hbWUgKyBcIn1cIjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZWQubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignYGtleWZyYW1lc2Agb3V0cHV0IGdvdCBpbnRlcnBvbGF0ZWQgaW50byBwbGFpbiBzdHJpbmcsIHBsZWFzZSB3cmFwIGl0IHdpdGggYGNzc2AuXFxuXFxuJyArICdJbnN0ZWFkIG9mIGRvaW5nIHRoaXM6XFxuXFxuJyArIFtdLmNvbmNhdChtYXRjaGVkLCBbXCJgXCIgKyByZXBsYWNlZCArIFwiYFwiXSkuam9pbignXFxuJykgKyAnXFxuXFxuWW91IHNob3VsZCB3cmFwIGl0IHdpdGggYGNzc2AgbGlrZSB0aGlzOlxcblxcbicgKyAoXCJjc3NgXCIgKyByZXBsYWNlZCArIFwiYFwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gIH0gLy8gZmluYWxpemUgc3RyaW5nIHZhbHVlcyAocmVndWxhciBzdHJpbmdzIGFuZCBmdW5jdGlvbnMgaW50ZXJwb2xhdGVkIGludG8gY3NzIGNhbGxzKVxuXG5cbiAgaWYgKHJlZ2lzdGVyZWQgPT0gbnVsbCkge1xuICAgIHJldHVybiBpbnRlcnBvbGF0aW9uO1xuICB9XG5cbiAgdmFyIGNhY2hlZCA9IHJlZ2lzdGVyZWRbaW50ZXJwb2xhdGlvbl07XG4gIHJldHVybiBjYWNoZWQgIT09IHVuZGVmaW5lZCA/IGNhY2hlZCA6IGludGVycG9sYXRpb247XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0Zyb21PYmplY3QobWVyZ2VkUHJvcHMsIHJlZ2lzdGVyZWQsIG9iaikge1xuICB2YXIgc3RyaW5nID0gJyc7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdHJpbmcgKz0gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgb2JqW2ldKSArIFwiO1wiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBfa2V5IGluIG9iaikge1xuICAgICAgdmFyIHZhbHVlID0gb2JqW19rZXldO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAocmVnaXN0ZXJlZCAhPSBudWxsICYmIHJlZ2lzdGVyZWRbdmFsdWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdHJpbmcgKz0gX2tleSArIFwie1wiICsgcmVnaXN0ZXJlZFt2YWx1ZV0gKyBcIn1cIjtcbiAgICAgICAgfSBlbHNlIGlmIChpc1Byb2Nlc3NhYmxlVmFsdWUodmFsdWUpKSB7XG4gICAgICAgICAgc3RyaW5nICs9IHByb2Nlc3NTdHlsZU5hbWUoX2tleSkgKyBcIjpcIiArIHByb2Nlc3NTdHlsZVZhbHVlKF9rZXksIHZhbHVlKSArIFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoX2tleSA9PT0gJ05PX0NPTVBPTkVOVF9TRUxFQ1RPUicgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IHNlbGVjdG9ycyBjYW4gb25seSBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggQGVtb3Rpb24vYmFiZWwtcGx1Z2luLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZVswXSA9PT0gJ3N0cmluZycgJiYgKHJlZ2lzdGVyZWQgPT0gbnVsbCB8fCByZWdpc3RlcmVkW3ZhbHVlWzBdXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCB2YWx1ZS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGlmIChpc1Byb2Nlc3NhYmxlVmFsdWUodmFsdWVbX2ldKSkge1xuICAgICAgICAgICAgICBzdHJpbmcgKz0gcHJvY2Vzc1N0eWxlTmFtZShfa2V5KSArIFwiOlwiICsgcHJvY2Vzc1N0eWxlVmFsdWUoX2tleSwgdmFsdWVbX2ldKSArIFwiO1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaW50ZXJwb2xhdGVkID0gaGFuZGxlSW50ZXJwb2xhdGlvbihtZXJnZWRQcm9wcywgcmVnaXN0ZXJlZCwgdmFsdWUpO1xuXG4gICAgICAgICAgc3dpdGNoIChfa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdhbmltYXRpb24nOlxuICAgICAgICAgICAgY2FzZSAnYW5pbWF0aW9uTmFtZSc6XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gcHJvY2Vzc1N0eWxlTmFtZShfa2V5KSArIFwiOlwiICsgaW50ZXJwb2xhdGVkICsgXCI7XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIF9rZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFVOREVGSU5FRF9BU19PQkpFQ1RfS0VZX0VSUk9SKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gX2tleSArIFwie1wiICsgaW50ZXJwb2xhdGVkICsgXCJ9XCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RyaW5nO1xufVxuXG52YXIgbGFiZWxQYXR0ZXJuID0gL2xhYmVsOlxccyooW15cXHM7XFxue10rKVxccyooO3wkKS9nO1xudmFyIHNvdXJjZU1hcFBhdHRlcm47XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHNvdXJjZU1hcFBhdHRlcm4gPSAvXFwvXFwqI1xcc3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvblxcL2pzb247XFxTK1xccytcXCpcXC8vZztcbn0gLy8gdGhpcyBpcyB0aGUgY3Vyc29yIGZvciBrZXlmcmFtZXNcbi8vIGtleWZyYW1lcyBhcmUgc3RvcmVkIG9uIHRoZSBTZXJpYWxpemVkU3R5bGVzIG9iamVjdCBhcyBhIGxpbmtlZCBsaXN0XG5cblxudmFyIGN1cnNvcjtcbnZhciBzZXJpYWxpemVTdHlsZXMgPSBmdW5jdGlvbiBzZXJpYWxpemVTdHlsZXMoYXJncywgcmVnaXN0ZXJlZCwgbWVyZ2VkUHJvcHMpIHtcbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiBhcmdzWzBdICE9PSBudWxsICYmIGFyZ3NbMF0uc3R5bGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYXJnc1swXTtcbiAgfVxuXG4gIHZhciBzdHJpbmdNb2RlID0gdHJ1ZTtcbiAgdmFyIHN0eWxlcyA9ICcnO1xuICBjdXJzb3IgPSB1bmRlZmluZWQ7XG4gIHZhciBzdHJpbmdzID0gYXJnc1swXTtcblxuICBpZiAoc3RyaW5ncyA9PSBudWxsIHx8IHN0cmluZ3MucmF3ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdHJpbmdNb2RlID0gZmFsc2U7XG4gICAgc3R5bGVzICs9IGhhbmRsZUludGVycG9sYXRpb24obWVyZ2VkUHJvcHMsIHJlZ2lzdGVyZWQsIHN0cmluZ3MpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHN0cmluZ3NbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcihJTExFR0FMX0VTQ0FQRV9TRVFVRU5DRV9FUlJPUik7XG4gICAgfVxuXG4gICAgc3R5bGVzICs9IHN0cmluZ3NbMF07XG4gIH0gLy8gd2Ugc3RhcnQgYXQgMSBzaW5jZSB3ZSd2ZSBhbHJlYWR5IGhhbmRsZWQgdGhlIGZpcnN0IGFyZ1xuXG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgc3R5bGVzICs9IGhhbmRsZUludGVycG9sYXRpb24obWVyZ2VkUHJvcHMsIHJlZ2lzdGVyZWQsIGFyZ3NbaV0pO1xuXG4gICAgaWYgKHN0cmluZ01vZGUpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHN0cmluZ3NbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKElMTEVHQUxfRVNDQVBFX1NFUVVFTkNFX0VSUk9SKTtcbiAgICAgIH1cblxuICAgICAgc3R5bGVzICs9IHN0cmluZ3NbaV07XG4gICAgfVxuICB9XG5cbiAgdmFyIHNvdXJjZU1hcDtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHN0eWxlcyA9IHN0eWxlcy5yZXBsYWNlKHNvdXJjZU1hcFBhdHRlcm4sIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgc291cmNlTWFwID0gbWF0Y2g7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG4gIH0gLy8gdXNpbmcgYSBnbG9iYWwgcmVnZXggd2l0aCAuZXhlYyBpcyBzdGF0ZWZ1bCBzbyBsYXN0SW5kZXggaGFzIHRvIGJlIHJlc2V0IGVhY2ggdGltZVxuXG5cbiAgbGFiZWxQYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG4gIHZhciBpZGVudGlmaWVyTmFtZSA9ICcnO1xuICB2YXIgbWF0Y2g7IC8vIGh0dHBzOi8vZXNiZW5jaC5jb20vYmVuY2gvNWI4MDljMmNmMjk0OTgwMGEwZjYxZmI1XG5cbiAgd2hpbGUgKChtYXRjaCA9IGxhYmVsUGF0dGVybi5leGVjKHN0eWxlcykpICE9PSBudWxsKSB7XG4gICAgaWRlbnRpZmllck5hbWUgKz0gJy0nICsgLy8gJEZsb3dGaXhNZSB3ZSBrbm93IGl0J3Mgbm90IG51bGxcbiAgICBtYXRjaFsxXTtcbiAgfVxuXG4gIHZhciBuYW1lID0gaGFzaFN0cmluZyhzdHlsZXMpICsgaWRlbnRpZmllck5hbWU7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyAkRmxvd0ZpeE1lIFNlcmlhbGl6ZWRTdHlsZXMgdHlwZSBkb2Vzbid0IGhhdmUgdG9TdHJpbmcgcHJvcGVydHkgKGFuZCB3ZSBkb24ndCB3YW50IHRvIGFkZCBpdClcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHN0eWxlczogc3R5bGVzLFxuICAgICAgbWFwOiBzb3VyY2VNYXAsXG4gICAgICBuZXh0OiBjdXJzb3IsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIllvdSBoYXZlIHRyaWVkIHRvIHN0cmluZ2lmeSBvYmplY3QgcmV0dXJuZWQgZnJvbSBgY3NzYCBmdW5jdGlvbi4gSXQgaXNuJ3Qgc3VwcG9zZWQgdG8gYmUgdXNlZCBkaXJlY3RseSAoZS5nLiBhcyB2YWx1ZSBvZiB0aGUgYGNsYXNzTmFtZWAgcHJvcCksIGJ1dCByYXRoZXIgaGFuZGVkIHRvIGVtb3Rpb24gc28gaXQgY2FuIGhhbmRsZSBpdCAoZS5nLiBhcyB2YWx1ZSBvZiBgY3NzYCBwcm9wKS5cIjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIHN0eWxlczogc3R5bGVzLFxuICAgIG5leHQ6IGN1cnNvclxuICB9O1xufTtcblxuZXhwb3J0IHsgc2VyaWFsaXplU3R5bGVzIH07XG4iLCJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCBmb3J3YXJkUmVmLCB1c2VDb250ZXh0LCBjcmVhdGVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNyZWF0ZUNhY2hlIGZyb20gJ0BlbW90aW9uL2NhY2hlJztcbmltcG9ydCBfZXh0ZW5kcyBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9leHRlbmRzJztcbmltcG9ydCB3ZWFrTWVtb2l6ZSBmcm9tICdAZW1vdGlvbi93ZWFrLW1lbW9pemUnO1xuaW1wb3J0IGhvaXN0Tm9uUmVhY3RTdGF0aWNzIGZyb20gJy4uL2lzb2xhdGVkLWhvaXN0LW5vbi1yZWFjdC1zdGF0aWNzLWRvLW5vdC11c2UtdGhpcy1pbi15b3VyLWNvZGUvZGlzdC9lbW90aW9uLXJlYWN0LWlzb2xhdGVkLWhvaXN0LW5vbi1yZWFjdC1zdGF0aWNzLWRvLW5vdC11c2UtdGhpcy1pbi15b3VyLWNvZGUuYnJvd3Nlci5lc20uanMnO1xuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZFN0eWxlcywgaW5zZXJ0U3R5bGVzIH0gZnJvbSAnQGVtb3Rpb24vdXRpbHMnO1xuaW1wb3J0IHsgc2VyaWFsaXplU3R5bGVzIH0gZnJvbSAnQGVtb3Rpb24vc2VyaWFsaXplJztcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIEVtb3Rpb25DYWNoZUNvbnRleHQgPSAvKiAjX19QVVJFX18gKi9jcmVhdGVDb250ZXh0KCAvLyB3ZSdyZSBkb2luZyB0aGlzIHRvIGF2b2lkIHByZWNvbnN0cnVjdCdzIGRlYWQgY29kZSBlbGltaW5hdGlvbiBpbiB0aGlzIG9uZSBjYXNlXG4vLyBiZWNhdXNlIHRoaXMgbW9kdWxlIGlzIHByaW1hcmlseSBpbnRlbmRlZCBmb3IgdGhlIGJyb3dzZXIgYW5kIG5vZGVcbi8vIGJ1dCBpdCdzIGFsc28gcmVxdWlyZWQgaW4gcmVhY3QgbmF0aXZlIGFuZCBzaW1pbGFyIGVudmlyb25tZW50cyBzb21ldGltZXNcbi8vIGFuZCB3ZSBjb3VsZCBoYXZlIGEgc3BlY2lhbCBidWlsZCBqdXN0IGZvciB0aGF0XG4vLyBidXQgdGhpcyBpcyBtdWNoIGVhc2llciBhbmQgdGhlIG5hdGl2ZSBwYWNrYWdlc1xuLy8gbWlnaHQgdXNlIGEgZGlmZmVyZW50IHRoZW1lIGNvbnRleHQgaW4gdGhlIGZ1dHVyZSBhbnl3YXlcbnR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyAvKiAjX19QVVJFX18gKi9jcmVhdGVDYWNoZSh7XG4gIGtleTogJ2Nzcydcbn0pIDogbnVsbCk7XG52YXIgQ2FjaGVQcm92aWRlciA9IEVtb3Rpb25DYWNoZUNvbnRleHQuUHJvdmlkZXI7XG5cbnZhciB3aXRoRW1vdGlvbkNhY2hlID0gZnVuY3Rpb24gd2l0aEVtb3Rpb25DYWNoZShmdW5jKSB7XG4gIC8vICRGbG93Rml4TWVcbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKGZ1bmN0aW9uIChwcm9wcywgcmVmKSB7XG4gICAgLy8gdGhlIGNhY2hlIHdpbGwgbmV2ZXIgYmUgbnVsbCBpbiB0aGUgYnJvd3NlclxuICAgIHZhciBjYWNoZSA9IHVzZUNvbnRleHQoRW1vdGlvbkNhY2hlQ29udGV4dCk7XG4gICAgcmV0dXJuIGZ1bmMocHJvcHMsIGNhY2hlLCByZWYpO1xuICB9KTtcbn07XG5cbnZhciBUaGVtZUNvbnRleHQgPSAvKiAjX19QVVJFX18gKi9jcmVhdGVDb250ZXh0KHt9KTtcbnZhciB1c2VUaGVtZSA9IGZ1bmN0aW9uIHVzZVRoZW1lKCkge1xuICByZXR1cm4gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xufTtcblxudmFyIGdldFRoZW1lID0gZnVuY3Rpb24gZ2V0VGhlbWUob3V0ZXJUaGVtZSwgdGhlbWUpIHtcbiAgaWYgKHR5cGVvZiB0aGVtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBtZXJnZWRUaGVtZSA9IHRoZW1lKG91dGVyVGhlbWUpO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgKG1lcmdlZFRoZW1lID09IG51bGwgfHwgdHlwZW9mIG1lcmdlZFRoZW1lICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KG1lcmdlZFRoZW1lKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignW1RoZW1lUHJvdmlkZXJdIFBsZWFzZSByZXR1cm4gYW4gb2JqZWN0IGZyb20geW91ciB0aGVtZSBmdW5jdGlvbiwgaS5lLiB0aGVtZT17KCkgPT4gKHt9KX0hJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlZFRoZW1lO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgKHRoZW1lID09IG51bGwgfHwgdHlwZW9mIHRoZW1lICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHRoZW1lKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1tUaGVtZVByb3ZpZGVyXSBQbGVhc2UgbWFrZSB5b3VyIHRoZW1lIHByb3AgYSBwbGFpbiBvYmplY3QnKTtcbiAgfVxuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgb3V0ZXJUaGVtZSwgdGhlbWUpO1xufTtcblxudmFyIGNyZWF0ZUNhY2hlV2l0aFRoZW1lID0gLyogI19fUFVSRV9fICovd2Vha01lbW9pemUoZnVuY3Rpb24gKG91dGVyVGhlbWUpIHtcbiAgcmV0dXJuIHdlYWtNZW1vaXplKGZ1bmN0aW9uICh0aGVtZSkge1xuICAgIHJldHVybiBnZXRUaGVtZShvdXRlclRoZW1lLCB0aGVtZSk7XG4gIH0pO1xufSk7XG52YXIgVGhlbWVQcm92aWRlciA9IGZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcbiAgdmFyIHRoZW1lID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xuXG4gIGlmIChwcm9wcy50aGVtZSAhPT0gdGhlbWUpIHtcbiAgICB0aGVtZSA9IGNyZWF0ZUNhY2hlV2l0aFRoZW1lKHRoZW1lKShwcm9wcy50aGVtZSk7XG4gIH1cblxuICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoVGhlbWVDb250ZXh0LlByb3ZpZGVyLCB7XG4gICAgdmFsdWU6IHRoZW1lXG4gIH0sIHByb3BzLmNoaWxkcmVuKTtcbn07XG5mdW5jdGlvbiB3aXRoVGhlbWUoQ29tcG9uZW50KSB7XG4gIHZhciBjb21wb25lbnROYW1lID0gQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xuXG4gIHZhciByZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIocHJvcHMsIHJlZikge1xuICAgIHZhciB0aGVtZSA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbiAgICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCBfZXh0ZW5kcyh7XG4gICAgICB0aGVtZTogdGhlbWUsXG4gICAgICByZWY6IHJlZlxuICAgIH0sIHByb3BzKSk7XG4gIH07IC8vICRGbG93Rml4TWVcblxuXG4gIHZhciBXaXRoVGhlbWUgPSAvKiNfX1BVUkVfXyovZm9yd2FyZFJlZihyZW5kZXIpO1xuICBXaXRoVGhlbWUuZGlzcGxheU5hbWUgPSBcIldpdGhUaGVtZShcIiArIGNvbXBvbmVudE5hbWUgKyBcIilcIjtcbiAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKFdpdGhUaGVtZSwgQ29tcG9uZW50KTtcbn1cblxuLy8gdGh1cyB3ZSBvbmx5IG5lZWQgdG8gcmVwbGFjZSB3aGF0IGlzIGEgdmFsaWQgY2hhcmFjdGVyIGZvciBKUywgYnV0IG5vdCBmb3IgQ1NTXG5cbnZhciBzYW5pdGl6ZUlkZW50aWZpZXIgPSBmdW5jdGlvbiBzYW5pdGl6ZUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICByZXR1cm4gaWRlbnRpZmllci5yZXBsYWNlKC9cXCQvZywgJy0nKTtcbn07XG5cbnZhciB0eXBlUHJvcE5hbWUgPSAnX19FTU9USU9OX1RZUEVfUExFQVNFX0RPX05PVF9VU0VfXyc7XG52YXIgbGFiZWxQcm9wTmFtZSA9ICdfX0VNT1RJT05fTEFCRUxfUExFQVNFX0RPX05PVF9VU0VfXyc7XG52YXIgY3JlYXRlRW1vdGlvblByb3BzID0gZnVuY3Rpb24gY3JlYXRlRW1vdGlvblByb3BzKHR5cGUsIHByb3BzKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBwcm9wcy5jc3MgPT09ICdzdHJpbmcnICYmIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGEgY3NzIGRlY2xhcmF0aW9uXG4gIHByb3BzLmNzcy5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3RyaW5ncyBhcmUgbm90IGFsbG93ZWQgYXMgY3NzIHByb3AgdmFsdWVzLCBwbGVhc2Ugd3JhcCBpdCBpbiBhIGNzcyB0ZW1wbGF0ZSBsaXRlcmFsIGZyb20gJ0BlbW90aW9uL3JlYWN0JyBsaWtlIHRoaXM6IGNzc2BcIiArIHByb3BzLmNzcyArIFwiYFwiKTtcbiAgfVxuXG4gIHZhciBuZXdQcm9wcyA9IHt9O1xuXG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCBrZXkpKSB7XG4gICAgICBuZXdQcm9wc1trZXldID0gcHJvcHNba2V5XTtcbiAgICB9XG4gIH1cblxuICBuZXdQcm9wc1t0eXBlUHJvcE5hbWVdID0gdHlwZTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcigpO1xuXG4gICAgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAvLyBjaHJvbWVcbiAgICAgIHZhciBtYXRjaCA9IGVycm9yLnN0YWNrLm1hdGNoKC9hdCAoPzpPYmplY3RcXC58TW9kdWxlXFwufCkoPzpqc3h8Y3JlYXRlRW1vdGlvblByb3BzKS4qXFxuXFxzK2F0ICg/Ok9iamVjdFxcLnwpKFtBLVpdW0EtWmEtejAtOSRdKykgLyk7XG5cbiAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgLy8gc2FmYXJpIGFuZCBmaXJlZm94XG4gICAgICAgIG1hdGNoID0gZXJyb3Iuc3RhY2subWF0Y2goLy4qXFxuKFtBLVpdW0EtWmEtejAtOSRdKylALyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBuZXdQcm9wc1tsYWJlbFByb3BOYW1lXSA9IHNhbml0aXplSWRlbnRpZmllcihtYXRjaFsxXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld1Byb3BzO1xufTtcbnZhciBFbW90aW9uID0gLyogI19fUFVSRV9fICovd2l0aEVtb3Rpb25DYWNoZShmdW5jdGlvbiAocHJvcHMsIGNhY2hlLCByZWYpIHtcbiAgdmFyIGNzc1Byb3AgPSBwcm9wcy5jc3M7IC8vIHNvIHRoYXQgdXNpbmcgYGNzc2AgZnJvbSBgZW1vdGlvbmAgYW5kIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgY3NzIHByb3Agd29ya3NcbiAgLy8gbm90IHBhc3NpbmcgdGhlIHJlZ2lzdGVyZWQgY2FjaGUgdG8gc2VyaWFsaXplU3R5bGVzIGJlY2F1c2UgaXQgd291bGRcbiAgLy8gbWFrZSBjZXJ0YWluIGJhYmVsIG9wdGltaXNhdGlvbnMgbm90IHBvc3NpYmxlXG5cbiAgaWYgKHR5cGVvZiBjc3NQcm9wID09PSAnc3RyaW5nJyAmJiBjYWNoZS5yZWdpc3RlcmVkW2Nzc1Byb3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICBjc3NQcm9wID0gY2FjaGUucmVnaXN0ZXJlZFtjc3NQcm9wXTtcbiAgfVxuXG4gIHZhciB0eXBlID0gcHJvcHNbdHlwZVByb3BOYW1lXTtcbiAgdmFyIHJlZ2lzdGVyZWRTdHlsZXMgPSBbY3NzUHJvcF07XG4gIHZhciBjbGFzc05hbWUgPSAnJztcblxuICBpZiAodHlwZW9mIHByb3BzLmNsYXNzTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjbGFzc05hbWUgPSBnZXRSZWdpc3RlcmVkU3R5bGVzKGNhY2hlLnJlZ2lzdGVyZWQsIHJlZ2lzdGVyZWRTdHlsZXMsIHByb3BzLmNsYXNzTmFtZSk7XG4gIH0gZWxzZSBpZiAocHJvcHMuY2xhc3NOYW1lICE9IG51bGwpIHtcbiAgICBjbGFzc05hbWUgPSBwcm9wcy5jbGFzc05hbWUgKyBcIiBcIjtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkID0gc2VyaWFsaXplU3R5bGVzKHJlZ2lzdGVyZWRTdHlsZXMsIHVuZGVmaW5lZCwgdHlwZW9mIGNzc1Byb3AgPT09ICdmdW5jdGlvbicgfHwgQXJyYXkuaXNBcnJheShjc3NQcm9wKSA/IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KSA6IHVuZGVmaW5lZCk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgc2VyaWFsaXplZC5uYW1lLmluZGV4T2YoJy0nKSA9PT0gLTEpIHtcbiAgICB2YXIgbGFiZWxGcm9tU3RhY2sgPSBwcm9wc1tsYWJlbFByb3BOYW1lXTtcblxuICAgIGlmIChsYWJlbEZyb21TdGFjaykge1xuICAgICAgc2VyaWFsaXplZCA9IHNlcmlhbGl6ZVN0eWxlcyhbc2VyaWFsaXplZCwgJ2xhYmVsOicgKyBsYWJlbEZyb21TdGFjayArICc7J10pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBydWxlcyA9IGluc2VydFN0eWxlcyhjYWNoZSwgc2VyaWFsaXplZCwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKTtcbiAgY2xhc3NOYW1lICs9IGNhY2hlLmtleSArIFwiLVwiICsgc2VyaWFsaXplZC5uYW1lO1xuICB2YXIgbmV3UHJvcHMgPSB7fTtcblxuICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChwcm9wcywga2V5KSAmJiBrZXkgIT09ICdjc3MnICYmIGtleSAhPT0gdHlwZVByb3BOYW1lICYmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nIHx8IGtleSAhPT0gbGFiZWxQcm9wTmFtZSkpIHtcbiAgICAgIG5ld1Byb3BzW2tleV0gPSBwcm9wc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIG5ld1Byb3BzLnJlZiA9IHJlZjtcbiAgbmV3UHJvcHMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICB2YXIgZWxlID0gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQodHlwZSwgbmV3UHJvcHMpO1xuXG4gIHJldHVybiBlbGU7XG59KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgRW1vdGlvbi5kaXNwbGF5TmFtZSA9ICdFbW90aW9uQ3NzUHJvcEludGVybmFsJztcbn1cblxuZXhwb3J0IHsgQ2FjaGVQcm92aWRlciBhcyBDLCBFbW90aW9uIGFzIEUsIFRoZW1lQ29udGV4dCBhcyBULCBUaGVtZVByb3ZpZGVyIGFzIGEsIHdpdGhUaGVtZSBhcyBiLCBjcmVhdGVFbW90aW9uUHJvcHMgYXMgYywgaGFzT3duUHJvcGVydHkgYXMgaCwgdXNlVGhlbWUgYXMgdSwgd2l0aEVtb3Rpb25DYWNoZSBhcyB3IH07XG4iLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZXh0ZW5kcztcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJpbXBvcnQgeyBpc1N0cmluZywgb21pdCwgX19ERVZfXyB9IGZyb20gXCJAY2hha3JhLXVpL3V0aWxzXCI7XG5cbi8qKlxuICogQ2FyZWZ1bGx5IHNlbGVjdGVkIGh0bWwgZWxlbWVudHMgZm9yIGNoYWtyYSBjb21wb25lbnRzLlxuICogVGhpcyBpcyBtb3N0bHkgZm9yIGBjaGFrcmEuPGVsZW1lbnQ+YCBzeW50YXguXG4gKi9cbmV4cG9ydCB2YXIgZG9tRWxlbWVudHMgPSBbXCJhXCIsIFwiYlwiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImJsb2NrcXVvdGVcIiwgXCJidXR0b25cIiwgXCJjYXB0aW9uXCIsIFwiY2l0ZVwiLCBcImNpcmNsZVwiLCBcImNvZGVcIiwgXCJkZFwiLCBcImRpdlwiLCBcImRsXCIsIFwiZHRcIiwgXCJmaWVsZHNldFwiLCBcImZpZ2NhcHRpb25cIiwgXCJmaWd1cmVcIiwgXCJmb290ZXJcIiwgXCJmb3JtXCIsIFwiaDFcIiwgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcImg2XCIsIFwiaGVhZGVyXCIsIFwiaHJcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImtiZFwiLCBcImxhYmVsXCIsIFwibGlcIiwgXCJtYWluXCIsIFwibWFya1wiLCBcIm5hdlwiLCBcIm9sXCIsIFwicFwiLCBcInBhdGhcIiwgXCJwcmVcIiwgXCJxXCIsIFwicmVjdFwiLCBcInNcIiwgXCJzdmdcIiwgXCJzZWN0aW9uXCIsIFwic2VsZWN0XCIsIFwic3Ryb25nXCIsIFwic21hbGxcIiwgXCJzcGFuXCIsIFwic3ViXCIsIFwic3VwXCIsIFwidGFibGVcIiwgXCJ0Ym9keVwiLCBcInRkXCIsIFwidGV4dGFyZWFcIiwgXCJ0Zm9vdFwiLCBcInRoXCIsIFwidGhlYWRcIiwgXCJ0clwiLCBcInVsXCJdO1xuZXhwb3J0IGZ1bmN0aW9uIG9taXRUaGVtaW5nUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIG9taXQocHJvcHMsIFtcInN0eWxlQ29uZmlnXCIsIFwic2l6ZVwiLCBcInZhcmlhbnRcIiwgXCJjb2xvclNjaGVtZVwiXSk7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1RhZyh0YXJnZXQpIHtcbiAgcmV0dXJuIGlzU3RyaW5nKHRhcmdldCkgJiYgKF9fREVWX18gPyB0YXJnZXQuY2hhckF0KDApID09PSB0YXJnZXQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgOiB0cnVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXNwbGF5TmFtZShwcmltaXRpdmUpIHtcbiAgcmV0dXJuIGlzVGFnKHByaW1pdGl2ZSkgPyBcImNoYWtyYS5cIiArIHByaW1pdGl2ZSA6IGdldENvbXBvbmVudE5hbWUocHJpbWl0aXZlKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZShwcmltaXRpdmUpIHtcbiAgcmV0dXJuIChfX0RFVl9fID8gaXNTdHJpbmcocHJpbWl0aXZlKSAmJiBwcmltaXRpdmUgOiBmYWxzZSkgfHwgIWlzU3RyaW5nKHByaW1pdGl2ZSkgJiYgcHJpbWl0aXZlLmRpc3BsYXlOYW1lIHx8ICFpc1N0cmluZyhwcmltaXRpdmUpICYmIHByaW1pdGl2ZS5uYW1lIHx8IFwiQ2hha3JhQ29tcG9uZW50XCI7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW0udXRpbHMuanMubWFwIiwiaW1wb3J0IG1lbW9pemUgZnJvbSAnQGVtb3Rpb24vbWVtb2l6ZSc7XG5cbnZhciByZWFjdFByb3BzUmVnZXggPSAvXigoY2hpbGRyZW58ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUx8a2V5fHJlZnxhdXRvRm9jdXN8ZGVmYXVsdFZhbHVlfGRlZmF1bHRDaGVja2VkfGlubmVySFRNTHxzdXBwcmVzc0NvbnRlbnRFZGl0YWJsZVdhcm5pbmd8c3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nfHZhbHVlTGlua3xhY2NlcHR8YWNjZXB0Q2hhcnNldHxhY2Nlc3NLZXl8YWN0aW9ufGFsbG93fGFsbG93VXNlck1lZGlhfGFsbG93UGF5bWVudFJlcXVlc3R8YWxsb3dGdWxsU2NyZWVufGFsbG93VHJhbnNwYXJlbmN5fGFsdHxhc3luY3xhdXRvQ29tcGxldGV8YXV0b1BsYXl8Y2FwdHVyZXxjZWxsUGFkZGluZ3xjZWxsU3BhY2luZ3xjaGFsbGVuZ2V8Y2hhclNldHxjaGVja2VkfGNpdGV8Y2xhc3NJRHxjbGFzc05hbWV8Y29sc3xjb2xTcGFufGNvbnRlbnR8Y29udGVudEVkaXRhYmxlfGNvbnRleHRNZW51fGNvbnRyb2xzfGNvbnRyb2xzTGlzdHxjb29yZHN8Y3Jvc3NPcmlnaW58ZGF0YXxkYXRlVGltZXxkZWNvZGluZ3xkZWZhdWx0fGRlZmVyfGRpcnxkaXNhYmxlZHxkaXNhYmxlUGljdHVyZUluUGljdHVyZXxkb3dubG9hZHxkcmFnZ2FibGV8ZW5jVHlwZXxmb3JtfGZvcm1BY3Rpb258Zm9ybUVuY1R5cGV8Zm9ybU1ldGhvZHxmb3JtTm9WYWxpZGF0ZXxmb3JtVGFyZ2V0fGZyYW1lQm9yZGVyfGhlYWRlcnN8aGVpZ2h0fGhpZGRlbnxoaWdofGhyZWZ8aHJlZkxhbmd8aHRtbEZvcnxodHRwRXF1aXZ8aWR8aW5wdXRNb2RlfGludGVncml0eXxpc3xrZXlQYXJhbXN8a2V5VHlwZXxraW5kfGxhYmVsfGxhbmd8bGlzdHxsb2FkaW5nfGxvb3B8bG93fG1hcmdpbkhlaWdodHxtYXJnaW5XaWR0aHxtYXh8bWF4TGVuZ3RofG1lZGlhfG1lZGlhR3JvdXB8bWV0aG9kfG1pbnxtaW5MZW5ndGh8bXVsdGlwbGV8bXV0ZWR8bmFtZXxub25jZXxub1ZhbGlkYXRlfG9wZW58b3B0aW11bXxwYXR0ZXJufHBsYWNlaG9sZGVyfHBsYXlzSW5saW5lfHBvc3RlcnxwcmVsb2FkfHByb2ZpbGV8cmFkaW9Hcm91cHxyZWFkT25seXxyZWZlcnJlclBvbGljeXxyZWx8cmVxdWlyZWR8cmV2ZXJzZWR8cm9sZXxyb3dzfHJvd1NwYW58c2FuZGJveHxzY29wZXxzY29wZWR8c2Nyb2xsaW5nfHNlYW1sZXNzfHNlbGVjdGVkfHNoYXBlfHNpemV8c2l6ZXN8c2xvdHxzcGFufHNwZWxsQ2hlY2t8c3JjfHNyY0RvY3xzcmNMYW5nfHNyY1NldHxzdGFydHxzdGVwfHN0eWxlfHN1bW1hcnl8dGFiSW5kZXh8dGFyZ2V0fHRpdGxlfHRyYW5zbGF0ZXx0eXBlfHVzZU1hcHx2YWx1ZXx3aWR0aHx3bW9kZXx3cmFwfGFib3V0fGRhdGF0eXBlfGlubGlzdHxwcmVmaXh8cHJvcGVydHl8cmVzb3VyY2V8dHlwZW9mfHZvY2FifGF1dG9DYXBpdGFsaXplfGF1dG9Db3JyZWN0fGF1dG9TYXZlfGNvbG9yfGZhbGxiYWNrfGluZXJ0fGl0ZW1Qcm9wfGl0ZW1TY29wZXxpdGVtVHlwZXxpdGVtSUR8aXRlbVJlZnxvbnxvcHRpb258cmVzdWx0c3xzZWN1cml0eXx1bnNlbGVjdGFibGV8YWNjZW50SGVpZ2h0fGFjY3VtdWxhdGV8YWRkaXRpdmV8YWxpZ25tZW50QmFzZWxpbmV8YWxsb3dSZW9yZGVyfGFscGhhYmV0aWN8YW1wbGl0dWRlfGFyYWJpY0Zvcm18YXNjZW50fGF0dHJpYnV0ZU5hbWV8YXR0cmlidXRlVHlwZXxhdXRvUmV2ZXJzZXxhemltdXRofGJhc2VGcmVxdWVuY3l8YmFzZWxpbmVTaGlmdHxiYXNlUHJvZmlsZXxiYm94fGJlZ2lufGJpYXN8Ynl8Y2FsY01vZGV8Y2FwSGVpZ2h0fGNsaXB8Y2xpcFBhdGhVbml0c3xjbGlwUGF0aHxjbGlwUnVsZXxjb2xvckludGVycG9sYXRpb258Y29sb3JJbnRlcnBvbGF0aW9uRmlsdGVyc3xjb2xvclByb2ZpbGV8Y29sb3JSZW5kZXJpbmd8Y29udGVudFNjcmlwdFR5cGV8Y29udGVudFN0eWxlVHlwZXxjdXJzb3J8Y3h8Y3l8ZHxkZWNlbGVyYXRlfGRlc2NlbnR8ZGlmZnVzZUNvbnN0YW50fGRpcmVjdGlvbnxkaXNwbGF5fGRpdmlzb3J8ZG9taW5hbnRCYXNlbGluZXxkdXJ8ZHh8ZHl8ZWRnZU1vZGV8ZWxldmF0aW9ufGVuYWJsZUJhY2tncm91bmR8ZW5kfGV4cG9uZW50fGV4dGVybmFsUmVzb3VyY2VzUmVxdWlyZWR8ZmlsbHxmaWxsT3BhY2l0eXxmaWxsUnVsZXxmaWx0ZXJ8ZmlsdGVyUmVzfGZpbHRlclVuaXRzfGZsb29kQ29sb3J8Zmxvb2RPcGFjaXR5fGZvY3VzYWJsZXxmb250RmFtaWx5fGZvbnRTaXplfGZvbnRTaXplQWRqdXN0fGZvbnRTdHJldGNofGZvbnRTdHlsZXxmb250VmFyaWFudHxmb250V2VpZ2h0fGZvcm1hdHxmcm9tfGZyfGZ4fGZ5fGcxfGcyfGdseXBoTmFtZXxnbHlwaE9yaWVudGF0aW9uSG9yaXpvbnRhbHxnbHlwaE9yaWVudGF0aW9uVmVydGljYWx8Z2x5cGhSZWZ8Z3JhZGllbnRUcmFuc2Zvcm18Z3JhZGllbnRVbml0c3xoYW5naW5nfGhvcml6QWR2WHxob3Jpek9yaWdpblh8aWRlb2dyYXBoaWN8aW1hZ2VSZW5kZXJpbmd8aW58aW4yfGludGVyY2VwdHxrfGsxfGsyfGszfGs0fGtlcm5lbE1hdHJpeHxrZXJuZWxVbml0TGVuZ3RofGtlcm5pbmd8a2V5UG9pbnRzfGtleVNwbGluZXN8a2V5VGltZXN8bGVuZ3RoQWRqdXN0fGxldHRlclNwYWNpbmd8bGlnaHRpbmdDb2xvcnxsaW1pdGluZ0NvbmVBbmdsZXxsb2NhbHxtYXJrZXJFbmR8bWFya2VyTWlkfG1hcmtlclN0YXJ0fG1hcmtlckhlaWdodHxtYXJrZXJVbml0c3xtYXJrZXJXaWR0aHxtYXNrfG1hc2tDb250ZW50VW5pdHN8bWFza1VuaXRzfG1hdGhlbWF0aWNhbHxtb2RlfG51bU9jdGF2ZXN8b2Zmc2V0fG9wYWNpdHl8b3BlcmF0b3J8b3JkZXJ8b3JpZW50fG9yaWVudGF0aW9ufG9yaWdpbnxvdmVyZmxvd3xvdmVybGluZVBvc2l0aW9ufG92ZXJsaW5lVGhpY2tuZXNzfHBhbm9zZTF8cGFpbnRPcmRlcnxwYXRoTGVuZ3RofHBhdHRlcm5Db250ZW50VW5pdHN8cGF0dGVyblRyYW5zZm9ybXxwYXR0ZXJuVW5pdHN8cG9pbnRlckV2ZW50c3xwb2ludHN8cG9pbnRzQXRYfHBvaW50c0F0WXxwb2ludHNBdFp8cHJlc2VydmVBbHBoYXxwcmVzZXJ2ZUFzcGVjdFJhdGlvfHByaW1pdGl2ZVVuaXRzfHJ8cmFkaXVzfHJlZlh8cmVmWXxyZW5kZXJpbmdJbnRlbnR8cmVwZWF0Q291bnR8cmVwZWF0RHVyfHJlcXVpcmVkRXh0ZW5zaW9uc3xyZXF1aXJlZEZlYXR1cmVzfHJlc3RhcnR8cmVzdWx0fHJvdGF0ZXxyeHxyeXxzY2FsZXxzZWVkfHNoYXBlUmVuZGVyaW5nfHNsb3BlfHNwYWNpbmd8c3BlY3VsYXJDb25zdGFudHxzcGVjdWxhckV4cG9uZW50fHNwZWVkfHNwcmVhZE1ldGhvZHxzdGFydE9mZnNldHxzdGREZXZpYXRpb258c3RlbWh8c3RlbXZ8c3RpdGNoVGlsZXN8c3RvcENvbG9yfHN0b3BPcGFjaXR5fHN0cmlrZXRocm91Z2hQb3NpdGlvbnxzdHJpa2V0aHJvdWdoVGhpY2tuZXNzfHN0cmluZ3xzdHJva2V8c3Ryb2tlRGFzaGFycmF5fHN0cm9rZURhc2hvZmZzZXR8c3Ryb2tlTGluZWNhcHxzdHJva2VMaW5lam9pbnxzdHJva2VNaXRlcmxpbWl0fHN0cm9rZU9wYWNpdHl8c3Ryb2tlV2lkdGh8c3VyZmFjZVNjYWxlfHN5c3RlbUxhbmd1YWdlfHRhYmxlVmFsdWVzfHRhcmdldFh8dGFyZ2V0WXx0ZXh0QW5jaG9yfHRleHREZWNvcmF0aW9ufHRleHRSZW5kZXJpbmd8dGV4dExlbmd0aHx0b3x0cmFuc2Zvcm18dTF8dTJ8dW5kZXJsaW5lUG9zaXRpb258dW5kZXJsaW5lVGhpY2tuZXNzfHVuaWNvZGV8dW5pY29kZUJpZGl8dW5pY29kZVJhbmdlfHVuaXRzUGVyRW18dkFscGhhYmV0aWN8dkhhbmdpbmd8dklkZW9ncmFwaGljfHZNYXRoZW1hdGljYWx8dmFsdWVzfHZlY3RvckVmZmVjdHx2ZXJzaW9ufHZlcnRBZHZZfHZlcnRPcmlnaW5YfHZlcnRPcmlnaW5ZfHZpZXdCb3h8dmlld1RhcmdldHx2aXNpYmlsaXR5fHdpZHRoc3x3b3JkU3BhY2luZ3x3cml0aW5nTW9kZXx4fHhIZWlnaHR8eDF8eDJ8eENoYW5uZWxTZWxlY3Rvcnx4bGlua0FjdHVhdGV8eGxpbmtBcmNyb2xlfHhsaW5rSHJlZnx4bGlua1JvbGV8eGxpbmtTaG93fHhsaW5rVGl0bGV8eGxpbmtUeXBlfHhtbEJhc2V8eG1sbnN8eG1sbnNYbGlua3x4bWxMYW5nfHhtbFNwYWNlfHl8eTF8eTJ8eUNoYW5uZWxTZWxlY3Rvcnx6fHpvb21BbmRQYW58Zm9yfGNsYXNzfGF1dG9mb2N1cyl8KChbRGRdW0FhXVtUdF1bQWFdfFtBYV1bUnJdW0lpXVtBYV18eCktLiopKSQvOyAvLyBodHRwczovL2VzYmVuY2guY29tL2JlbmNoLzViZmVlNjhhNGNkN2U2MDA5ZWY2MWQyM1xuXG52YXIgaXNQcm9wVmFsaWQgPSAvKiAjX19QVVJFX18gKi9tZW1vaXplKGZ1bmN0aW9uIChwcm9wKSB7XG4gIHJldHVybiByZWFjdFByb3BzUmVnZXgudGVzdChwcm9wKSB8fCBwcm9wLmNoYXJDb2RlQXQoMCkgPT09IDExMVxuICAvKiBvICovXG4gICYmIHByb3AuY2hhckNvZGVBdCgxKSA9PT0gMTEwXG4gIC8qIG4gKi9cbiAgJiYgcHJvcC5jaGFyQ29kZUF0KDIpIDwgOTE7XG59XG4vKiBaKzEgKi9cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGlzUHJvcFZhbGlkO1xuIiwiaW1wb3J0IF9leHRlbmRzIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgY3JlYXRlRWxlbWVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpc1Byb3BWYWxpZCBmcm9tICdAZW1vdGlvbi9pcy1wcm9wLXZhbGlkJztcbmltcG9ydCB7IHdpdGhFbW90aW9uQ2FjaGUsIFRoZW1lQ29udGV4dCB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IGdldFJlZ2lzdGVyZWRTdHlsZXMsIGluc2VydFN0eWxlcyB9IGZyb20gJ0BlbW90aW9uL3V0aWxzJztcbmltcG9ydCB7IHNlcmlhbGl6ZVN0eWxlcyB9IGZyb20gJ0BlbW90aW9uL3NlcmlhbGl6ZSc7XG5cbnZhciB0ZXN0T21pdFByb3BzT25TdHJpbmdUYWcgPSBpc1Byb3BWYWxpZDtcblxudmFyIHRlc3RPbWl0UHJvcHNPbkNvbXBvbmVudCA9IGZ1bmN0aW9uIHRlc3RPbWl0UHJvcHNPbkNvbXBvbmVudChrZXkpIHtcbiAgcmV0dXJuIGtleSAhPT0gJ3RoZW1lJztcbn07XG5cbnZhciBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AgPSBmdW5jdGlvbiBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AodGFnKSB7XG4gIHJldHVybiB0eXBlb2YgdGFnID09PSAnc3RyaW5nJyAmJiAvLyA5NiBpcyBvbmUgbGVzcyB0aGFuIHRoZSBjaGFyIGNvZGVcbiAgLy8gZm9yIFwiYVwiIHNvIHRoaXMgaXMgY2hlY2tpbmcgdGhhdFxuICAvLyBpdCdzIGEgbG93ZXJjYXNlIGNoYXJhY3RlclxuICB0YWcuY2hhckNvZGVBdCgwKSA+IDk2ID8gdGVzdE9taXRQcm9wc09uU3RyaW5nVGFnIDogdGVzdE9taXRQcm9wc09uQ29tcG9uZW50O1xufTtcbnZhciBjb21wb3NlU2hvdWxkRm9yd2FyZFByb3BzID0gZnVuY3Rpb24gY29tcG9zZVNob3VsZEZvcndhcmRQcm9wcyh0YWcsIG9wdGlvbnMsIGlzUmVhbCkge1xuICB2YXIgc2hvdWxkRm9yd2FyZFByb3A7XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wID0gb3B0aW9ucy5zaG91bGRGb3J3YXJkUHJvcDtcbiAgICBzaG91bGRGb3J3YXJkUHJvcCA9IHRhZy5fX2Vtb3Rpb25fZm9yd2FyZFByb3AgJiYgb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wID8gZnVuY3Rpb24gKHByb3BOYW1lKSB7XG4gICAgICByZXR1cm4gdGFnLl9fZW1vdGlvbl9mb3J3YXJkUHJvcChwcm9wTmFtZSkgJiYgb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wKHByb3BOYW1lKTtcbiAgICB9IDogb3B0aW9uc1Nob3VsZEZvcndhcmRQcm9wO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzaG91bGRGb3J3YXJkUHJvcCAhPT0gJ2Z1bmN0aW9uJyAmJiBpc1JlYWwpIHtcbiAgICBzaG91bGRGb3J3YXJkUHJvcCA9IHRhZy5fX2Vtb3Rpb25fZm9yd2FyZFByb3A7XG4gIH1cblxuICByZXR1cm4gc2hvdWxkRm9yd2FyZFByb3A7XG59O1xuXG52YXIgSUxMRUdBTF9FU0NBUEVfU0VRVUVOQ0VfRVJST1IgPSBcIllvdSBoYXZlIGlsbGVnYWwgZXNjYXBlIHNlcXVlbmNlIGluIHlvdXIgdGVtcGxhdGUgbGl0ZXJhbCwgbW9zdCBsaWtlbHkgaW5zaWRlIGNvbnRlbnQncyBwcm9wZXJ0eSB2YWx1ZS5cXG5CZWNhdXNlIHlvdSB3cml0ZSB5b3VyIENTUyBpbnNpZGUgYSBKYXZhU2NyaXB0IHN0cmluZyB5b3UgYWN0dWFsbHkgaGF2ZSB0byBkbyBkb3VibGUgZXNjYXBpbmcsIHNvIGZvciBleGFtcGxlIFxcXCJjb250ZW50OiAnXFxcXDAwZDcnO1xcXCIgc2hvdWxkIGJlY29tZSBcXFwiY29udGVudDogJ1xcXFxcXFxcMDBkNyc7XFxcIi5cXG5Zb3UgY2FuIHJlYWQgbW9yZSBhYm91dCB0aGlzIGhlcmU6XFxuaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvVGVtcGxhdGVfbGl0ZXJhbHMjRVMyMDE4X3JldmlzaW9uX29mX2lsbGVnYWxfZXNjYXBlX3NlcXVlbmNlc1wiO1xuXG52YXIgY3JlYXRlU3R5bGVkID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVkKHRhZywgb3B0aW9ucykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmICh0YWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgYXJlIHRyeWluZyB0byBjcmVhdGUgYSBzdHlsZWQgZWxlbWVudCB3aXRoIGFuIHVuZGVmaW5lZCBjb21wb25lbnQuXFxuWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBpbXBvcnQgaXQuJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGlzUmVhbCA9IHRhZy5fX2Vtb3Rpb25fcmVhbCA9PT0gdGFnO1xuICB2YXIgYmFzZVRhZyA9IGlzUmVhbCAmJiB0YWcuX19lbW90aW9uX2Jhc2UgfHwgdGFnO1xuICB2YXIgaWRlbnRpZmllck5hbWU7XG4gIHZhciB0YXJnZXRDbGFzc05hbWU7XG5cbiAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgIGlkZW50aWZpZXJOYW1lID0gb3B0aW9ucy5sYWJlbDtcbiAgICB0YXJnZXRDbGFzc05hbWUgPSBvcHRpb25zLnRhcmdldDtcbiAgfVxuXG4gIHZhciBzaG91bGRGb3J3YXJkUHJvcCA9IGNvbXBvc2VTaG91bGRGb3J3YXJkUHJvcHModGFnLCBvcHRpb25zLCBpc1JlYWwpO1xuICB2YXIgZGVmYXVsdFNob3VsZEZvcndhcmRQcm9wID0gc2hvdWxkRm9yd2FyZFByb3AgfHwgZ2V0RGVmYXVsdFNob3VsZEZvcndhcmRQcm9wKGJhc2VUYWcpO1xuICB2YXIgc2hvdWxkVXNlQXMgPSAhZGVmYXVsdFNob3VsZEZvcndhcmRQcm9wKCdhcycpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdHlsZXMgPSBpc1JlYWwgJiYgdGFnLl9fZW1vdGlvbl9zdHlsZXMgIT09IHVuZGVmaW5lZCA/IHRhZy5fX2Vtb3Rpb25fc3R5bGVzLnNsaWNlKDApIDogW107XG5cbiAgICBpZiAoaWRlbnRpZmllck5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGVzLnB1c2goXCJsYWJlbDpcIiArIGlkZW50aWZpZXJOYW1lICsgXCI7XCIpO1xuICAgIH1cblxuICAgIGlmIChhcmdzWzBdID09IG51bGwgfHwgYXJnc1swXS5yYXcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGVzLnB1c2guYXBwbHkoc3R5bGVzLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgYXJnc1swXVswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoSUxMRUdBTF9FU0NBUEVfU0VRVUVOQ0VfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICBzdHlsZXMucHVzaChhcmdzWzBdWzBdKTtcbiAgICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgICAgIHZhciBpID0gMTtcblxuICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBhcmdzWzBdW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKElMTEVHQUxfRVNDQVBFX1NFUVVFTkNFX0VSUk9SKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0eWxlcy5wdXNoKGFyZ3NbaV0sIGFyZ3NbMF1baV0pO1xuICAgICAgfVxuICAgIH0gLy8gJEZsb3dGaXhNZTogd2UgbmVlZCB0byBjYXN0IFN0YXRlbGVzc0Z1bmN0aW9uYWxDb21wb25lbnQgdG8gb3VyIFByaXZhdGVTdHlsZWRDb21wb25lbnQgY2xhc3NcblxuXG4gICAgdmFyIFN0eWxlZCA9IHdpdGhFbW90aW9uQ2FjaGUoZnVuY3Rpb24gKHByb3BzLCBjYWNoZSwgcmVmKSB7XG4gICAgICB2YXIgZmluYWxUYWcgPSBzaG91bGRVc2VBcyAmJiBwcm9wcy5hcyB8fCBiYXNlVGFnO1xuICAgICAgdmFyIGNsYXNzTmFtZSA9ICcnO1xuICAgICAgdmFyIGNsYXNzSW50ZXJwb2xhdGlvbnMgPSBbXTtcbiAgICAgIHZhciBtZXJnZWRQcm9wcyA9IHByb3BzO1xuXG4gICAgICBpZiAocHJvcHMudGhlbWUgPT0gbnVsbCkge1xuICAgICAgICBtZXJnZWRQcm9wcyA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgICAgIG1lcmdlZFByb3BzW2tleV0gPSBwcm9wc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVyZ2VkUHJvcHMudGhlbWUgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcHJvcHMuY2xhc3NOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICBjbGFzc05hbWUgPSBnZXRSZWdpc3RlcmVkU3R5bGVzKGNhY2hlLnJlZ2lzdGVyZWQsIGNsYXNzSW50ZXJwb2xhdGlvbnMsIHByb3BzLmNsYXNzTmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLmNsYXNzTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IHByb3BzLmNsYXNzTmFtZSArIFwiIFwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VyaWFsaXplZCA9IHNlcmlhbGl6ZVN0eWxlcyhzdHlsZXMuY29uY2F0KGNsYXNzSW50ZXJwb2xhdGlvbnMpLCBjYWNoZS5yZWdpc3RlcmVkLCBtZXJnZWRQcm9wcyk7XG4gICAgICB2YXIgcnVsZXMgPSBpbnNlcnRTdHlsZXMoY2FjaGUsIHNlcmlhbGl6ZWQsIHR5cGVvZiBmaW5hbFRhZyA9PT0gJ3N0cmluZycpO1xuICAgICAgY2xhc3NOYW1lICs9IGNhY2hlLmtleSArIFwiLVwiICsgc2VyaWFsaXplZC5uYW1lO1xuXG4gICAgICBpZiAodGFyZ2V0Q2xhc3NOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xhc3NOYW1lICs9IFwiIFwiICsgdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluYWxTaG91bGRGb3J3YXJkUHJvcCA9IHNob3VsZFVzZUFzICYmIHNob3VsZEZvcndhcmRQcm9wID09PSB1bmRlZmluZWQgPyBnZXREZWZhdWx0U2hvdWxkRm9yd2FyZFByb3AoZmluYWxUYWcpIDogZGVmYXVsdFNob3VsZEZvcndhcmRQcm9wO1xuICAgICAgdmFyIG5ld1Byb3BzID0ge307XG5cbiAgICAgIGZvciAodmFyIF9rZXkgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKHNob3VsZFVzZUFzICYmIF9rZXkgPT09ICdhcycpIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmICggLy8gJEZsb3dGaXhNZVxuICAgICAgICBmaW5hbFNob3VsZEZvcndhcmRQcm9wKF9rZXkpKSB7XG4gICAgICAgICAgbmV3UHJvcHNbX2tleV0gPSBwcm9wc1tfa2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuZXdQcm9wcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICBuZXdQcm9wcy5yZWYgPSByZWY7XG4gICAgICB2YXIgZWxlID0gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoZmluYWxUYWcsIG5ld1Byb3BzKTtcblxuICAgICAgcmV0dXJuIGVsZTtcbiAgICB9KTtcbiAgICBTdHlsZWQuZGlzcGxheU5hbWUgPSBpZGVudGlmaWVyTmFtZSAhPT0gdW5kZWZpbmVkID8gaWRlbnRpZmllck5hbWUgOiBcIlN0eWxlZChcIiArICh0eXBlb2YgYmFzZVRhZyA9PT0gJ3N0cmluZycgPyBiYXNlVGFnIDogYmFzZVRhZy5kaXNwbGF5TmFtZSB8fCBiYXNlVGFnLm5hbWUgfHwgJ0NvbXBvbmVudCcpICsgXCIpXCI7XG4gICAgU3R5bGVkLmRlZmF1bHRQcm9wcyA9IHRhZy5kZWZhdWx0UHJvcHM7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9yZWFsID0gU3R5bGVkO1xuICAgIFN0eWxlZC5fX2Vtb3Rpb25fYmFzZSA9IGJhc2VUYWc7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9zdHlsZXMgPSBzdHlsZXM7XG4gICAgU3R5bGVkLl9fZW1vdGlvbl9mb3J3YXJkUHJvcCA9IHNob3VsZEZvcndhcmRQcm9wO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHlsZWQsICd0b1N0cmluZycsIHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgaWYgKHRhcmdldENsYXNzTmFtZSA9PT0gdW5kZWZpbmVkICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gJ05PX0NPTVBPTkVOVF9TRUxFQ1RPUic7XG4gICAgICAgIH0gLy8gJEZsb3dGaXhNZTogY29lcmNlIHVuZGVmaW5lZCB0byBzdHJpbmdcblxuXG4gICAgICAgIHJldHVybiBcIi5cIiArIHRhcmdldENsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFN0eWxlZC53aXRoQ29tcG9uZW50ID0gZnVuY3Rpb24gKG5leHRUYWcsIG5leHRPcHRpb25zKSB7XG4gICAgICByZXR1cm4gY3JlYXRlU3R5bGVkKG5leHRUYWcsIF9leHRlbmRzKHt9LCBvcHRpb25zLCBuZXh0T3B0aW9ucywge1xuICAgICAgICBzaG91bGRGb3J3YXJkUHJvcDogY29tcG9zZVNob3VsZEZvcndhcmRQcm9wcyhTdHlsZWQsIG5leHRPcHRpb25zLCB0cnVlKVxuICAgICAgfSkpLmFwcGx5KHZvaWQgMCwgc3R5bGVzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFN0eWxlZDtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVN0eWxlZDtcbiIsImltcG9ydCAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzJztcbmltcG9ydCAncmVhY3QnO1xuaW1wb3J0ICdAZW1vdGlvbi9pcy1wcm9wLXZhbGlkJztcbmltcG9ydCBjcmVhdGVTdHlsZWQgZnJvbSAnLi4vYmFzZS9kaXN0L2Vtb3Rpb24tc3R5bGVkLWJhc2UuYnJvd3Nlci5lc20uanMnO1xuaW1wb3J0ICdAZW1vdGlvbi9yZWFjdCc7XG5pbXBvcnQgJ0BlbW90aW9uL3V0aWxzJztcbmltcG9ydCAnQGVtb3Rpb24vc2VyaWFsaXplJztcblxudmFyIHRhZ3MgPSBbJ2EnLCAnYWJicicsICdhZGRyZXNzJywgJ2FyZWEnLCAnYXJ0aWNsZScsICdhc2lkZScsICdhdWRpbycsICdiJywgJ2Jhc2UnLCAnYmRpJywgJ2JkbycsICdiaWcnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2JyJywgJ2J1dHRvbicsICdjYW52YXMnLCAnY2FwdGlvbicsICdjaXRlJywgJ2NvZGUnLCAnY29sJywgJ2NvbGdyb3VwJywgJ2RhdGEnLCAnZGF0YWxpc3QnLCAnZGQnLCAnZGVsJywgJ2RldGFpbHMnLCAnZGZuJywgJ2RpYWxvZycsICdkaXYnLCAnZGwnLCAnZHQnLCAnZW0nLCAnZW1iZWQnLCAnZmllbGRzZXQnLCAnZmlnY2FwdGlvbicsICdmaWd1cmUnLCAnZm9vdGVyJywgJ2Zvcm0nLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZCcsICdoZWFkZXInLCAnaGdyb3VwJywgJ2hyJywgJ2h0bWwnLCAnaScsICdpZnJhbWUnLCAnaW1nJywgJ2lucHV0JywgJ2lucycsICdrYmQnLCAna2V5Z2VuJywgJ2xhYmVsJywgJ2xlZ2VuZCcsICdsaScsICdsaW5rJywgJ21haW4nLCAnbWFwJywgJ21hcmsnLCAnbWFycXVlZScsICdtZW51JywgJ21lbnVpdGVtJywgJ21ldGEnLCAnbWV0ZXInLCAnbmF2JywgJ25vc2NyaXB0JywgJ29iamVjdCcsICdvbCcsICdvcHRncm91cCcsICdvcHRpb24nLCAnb3V0cHV0JywgJ3AnLCAncGFyYW0nLCAncGljdHVyZScsICdwcmUnLCAncHJvZ3Jlc3MnLCAncScsICdycCcsICdydCcsICdydWJ5JywgJ3MnLCAnc2FtcCcsICdzY3JpcHQnLCAnc2VjdGlvbicsICdzZWxlY3QnLCAnc21hbGwnLCAnc291cmNlJywgJ3NwYW4nLCAnc3Ryb25nJywgJ3N0eWxlJywgJ3N1YicsICdzdW1tYXJ5JywgJ3N1cCcsICd0YWJsZScsICd0Ym9keScsICd0ZCcsICd0ZXh0YXJlYScsICd0Zm9vdCcsICd0aCcsICd0aGVhZCcsICd0aW1lJywgJ3RpdGxlJywgJ3RyJywgJ3RyYWNrJywgJ3UnLCAndWwnLCAndmFyJywgJ3ZpZGVvJywgJ3dicicsIC8vIFNWR1xuJ2NpcmNsZScsICdjbGlwUGF0aCcsICdkZWZzJywgJ2VsbGlwc2UnLCAnZm9yZWlnbk9iamVjdCcsICdnJywgJ2ltYWdlJywgJ2xpbmUnLCAnbGluZWFyR3JhZGllbnQnLCAnbWFzaycsICdwYXRoJywgJ3BhdHRlcm4nLCAncG9seWdvbicsICdwb2x5bGluZScsICdyYWRpYWxHcmFkaWVudCcsICdyZWN0JywgJ3N0b3AnLCAnc3ZnJywgJ3RleHQnLCAndHNwYW4nXTtcblxudmFyIG5ld1N0eWxlZCA9IGNyZWF0ZVN0eWxlZC5iaW5kKCk7XG50YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgLy8gJEZsb3dGaXhNZTogd2UgY2FuIGlnbm9yZSB0aGlzIGJlY2F1c2UgaXRzIGV4cG9zZWQgdHlwZSBpcyBkZWZpbmVkIGJ5IHRoZSBDcmVhdGVTdHlsZWQgdHlwZVxuICBuZXdTdHlsZWRbdGFnTmFtZV0gPSBuZXdTdHlsZWQodGFnTmFtZSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbmV3U3R5bGVkO1xuIiwiaW1wb3J0IHsgcHJvcE5hbWVzIH0gZnJvbSBcIkBjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbVwiO1xuLyoqXG4gKiBMaXN0IG9mIHByb3BzIGZvciBlbW90aW9uIHRvIG9taXQgZnJvbSBET00uXG4gKiBJdCBtb3N0bHkgY29uc2lzdHMgb2YgQ2hha3JhIHByb3BzXG4gKi9cblxudmFyIGFsbFByb3BOYW1lcyA9IG5ldyBTZXQoWy4uLnByb3BOYW1lcywgXCJ0ZXh0U3R5bGVcIiwgXCJsYXllclN0eWxlXCIsIFwiYXBwbHlcIiwgXCJpc1RydW5jYXRlZFwiLCBcIm5vT2ZMaW5lc1wiLCBcImZvY3VzQm9yZGVyQ29sb3JcIiwgXCJlcnJvckJvcmRlckNvbG9yXCIsIFwiYXNcIiwgXCJfX2Nzc1wiLCBcImNzc1wiLCBcInN4XCJdKTtcbi8qKlxuICogaHRtbFdpZHRoIGFuZCBodG1sSGVpZ2h0IGlzIHVzZWQgaW4gdGhlIDxJbWFnZSAvPlxuICogY29tcG9uZW50IHRvIHN1cHBvcnQgdGhlIG5hdGl2ZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBhdHRyaWJ1dGVzXG4gKlxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoYWtyYS11aS9jaGFrcmEtdWkvaXNzdWVzLzE0OVxuICovXG5cbnZhciB2YWxpZEhUTUxQcm9wcyA9IG5ldyBTZXQoW1wiaHRtbFdpZHRoXCIsIFwiaHRtbEhlaWdodFwiLCBcImh0bWxTaXplXCJdKTtcbmV4cG9ydCB2YXIgc2hvdWxkRm9yd2FyZFByb3AgPSBwcm9wID0+IHZhbGlkSFRNTFByb3BzLmhhcyhwcm9wKSB8fCAhYWxsUHJvcE5hbWVzLmhhcyhwcm9wKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNob3VsZC1mb3J3YXJkLXByb3AuanMubWFwIiwiZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IHt9OyB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7IHZhciBrZXksIGk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZUtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5pbXBvcnQgeyBjc3MsIGlzU3R5bGVQcm9wIH0gZnJvbSBcIkBjaGFrcmEtdWkvc3R5bGVkLXN5c3RlbVwiO1xuaW1wb3J0IHsgb2JqZWN0RmlsdGVyIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCBfc3R5bGVkIGZyb20gXCJAZW1vdGlvbi9zdHlsZWRcIjtcbmltcG9ydCB7IHNob3VsZEZvcndhcmRQcm9wIH0gZnJvbSBcIi4vc2hvdWxkLWZvcndhcmQtcHJvcFwiO1xuaW1wb3J0IHsgZG9tRWxlbWVudHMgfSBmcm9tIFwiLi9zeXN0ZW0udXRpbHNcIjtcblxuLyoqXG4gKiBTdHlsZSByZXNvbHZlciBmdW5jdGlvbiB0aGF0IG1hbmFnZXMgaG93IHN0eWxlIHByb3BzIGFyZSBtZXJnZWRcbiAqIGluIGNvbWJpbmF0aW9uIHdpdGggb3RoZXIgcG9zc2libGUgd2F5cyBvZiBkZWZpbmluZyBzdHlsZXMuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRha2UgYSBjb21wb25lbnQgZGVmaW5lZCB0aGlzIHdheTpcbiAqIGBgYGpzeFxuICogPEJveCBmb250U2l6ZT1cIjI0cHhcIiBzeD17eyBmb250U2l6ZTogXCI0MHB4XCIgfX0+PC9Cb3g+XG4gKiBgYGBcbiAqXG4gKiBXZSB3YW50IHRvIG1hbmFnZSB0aGUgcHJpb3JpdHkgb2YgdGhlIHN0eWxlcyBwcm9wZXJseSB0byBwcmV2ZW50IHVud2FudGVkXG4gKiBiZWhhdmlvcnMuIFJpZ2h0IG5vdywgdGhlIGBzeGAgcHJvcCBoYXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgc28gdGhlIHJlc29sdmVkXG4gKiBmb250U2l6ZSB3aWxsIGJlIGA0MHB4YFxuICovXG5leHBvcnQgdmFyIHRvQ1NTT2JqZWN0ID0gKF9yZWYpID0+IHtcbiAgdmFyIHtcbiAgICBiYXNlU3R5bGVcbiAgfSA9IF9yZWY7XG4gIHJldHVybiBwcm9wcyA9PiB7XG4gICAgdmFyIHtcbiAgICAgIGNzczogY3NzUHJvcCxcbiAgICAgIF9fY3NzLFxuICAgICAgc3hcbiAgICB9ID0gcHJvcHMsXG4gICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShwcm9wcywgW1widGhlbWVcIiwgXCJjc3NcIiwgXCJfX2Nzc1wiLCBcInN4XCJdKTtcblxuICAgIHZhciBzdHlsZVByb3BzID0gb2JqZWN0RmlsdGVyKHJlc3QsIChfLCBwcm9wKSA9PiBpc1N0eWxlUHJvcChwcm9wKSk7XG4gICAgdmFyIGZpbmFsU3R5bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgX19jc3MsIGJhc2VTdHlsZSwgc3R5bGVQcm9wcywgc3gpO1xuICAgIHZhciBjb21wdXRlZENTUyA9IGNzcyhmaW5hbFN0eWxlcykocHJvcHMudGhlbWUpO1xuICAgIHJldHVybiBjc3NQcm9wID8gW2NvbXB1dGVkQ1NTLCBjc3NQcm9wXSA6IGNvbXB1dGVkQ1NTO1xuICB9O1xufTtcbmV4cG9ydCBmdW5jdGlvbiBzdHlsZWQoY29tcG9uZW50LCBvcHRpb25zKSB7XG4gIHZhciBfcmVmMiA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fSxcbiAgICAgIHtcbiAgICBiYXNlU3R5bGVcbiAgfSA9IF9yZWYyLFxuICAgICAgc3R5bGVkT3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYyLCBbXCJiYXNlU3R5bGVcIl0pO1xuXG4gIGlmICghc3R5bGVkT3B0aW9ucy5zaG91bGRGb3J3YXJkUHJvcCkge1xuICAgIHN0eWxlZE9wdGlvbnMuc2hvdWxkRm9yd2FyZFByb3AgPSBzaG91bGRGb3J3YXJkUHJvcDtcbiAgfVxuXG4gIHZhciBzdHlsZU9iamVjdCA9IHRvQ1NTT2JqZWN0KHtcbiAgICBiYXNlU3R5bGVcbiAgfSk7XG4gIHJldHVybiBfc3R5bGVkKGNvbXBvbmVudCwgc3R5bGVkT3B0aW9ucykoc3R5bGVPYmplY3QpO1xufVxuZXhwb3J0IHZhciBjaGFrcmEgPSBzdHlsZWQ7XG5kb21FbGVtZW50cy5mb3JFYWNoKHRhZyA9PiB7XG4gIGNoYWtyYVt0YWddID0gY2hha3JhKHRhZyk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbS5qcy5tYXAiLCIvKipcbiAqIEFsbCBjcmVkaXQgZ29lcyB0byBDaGFuY2UgKFJlYWNoIFVJKSwgSGF6IChSZWFraXQpIGFuZCAoZmx1ZW50dWkpXG4gKiBmb3IgY3JlYXRpbmcgdGhlIGJhc2UgdHlwZSBkZWZpbml0aW9ucyB1cG9uIHdoaWNoIHdlIGltcHJvdmVkIG9uXG4gKi9cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmRSZWYoY29tcG9uZW50KSB7XG4gIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuZm9yd2FyZFJlZihjb21wb25lbnQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9yd2FyZC1yZWYuanMubWFwIiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IHt9OyB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7IHZhciBrZXksIGk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZUtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5pbXBvcnQgeyBjaGFrcmEsIGZvcndhcmRSZWYgfSBmcm9tIFwiQGNoYWtyYS11aS9zeXN0ZW1cIjtcbmltcG9ydCB7IGN4LCBfX0RFVl9fIH0gZnJvbSBcIkBjaGFrcmEtdWkvdXRpbHNcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xudmFyIGZhbGxiYWNrSWNvbiA9IHtcbiAgcGF0aDogLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIHtcbiAgICBzdHJva2U6IFwiY3VycmVudENvbG9yXCIsXG4gICAgc3Ryb2tlV2lkdGg6IFwiMS41XCJcbiAgfSwgLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwYXRoXCIsIHtcbiAgICBzdHJva2VMaW5lY2FwOiBcInJvdW5kXCIsXG4gICAgZmlsbDogXCJub25lXCIsXG4gICAgZDogXCJNOSw5YTMsMywwLDEsMSw0LDIuODI5LDEuNSwxLjUsMCwwLDAtMSwxLjQxNVYxNC4yNVwiXG4gIH0pLCAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChcInBhdGhcIiwge1xuICAgIGZpbGw6IFwiY3VycmVudENvbG9yXCIsXG4gICAgc3Ryb2tlTGluZWNhcDogXCJyb3VuZFwiLFxuICAgIGQ6IFwiTTEyLDE3LjI1YS4zNzUuMzc1LDAsMSwwLC4zNzUuMzc1QS4zNzUuMzc1LDAsMCwwLDEyLDE3LjI1aDBcIlxuICB9KSwgLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjaXJjbGVcIiwge1xuICAgIGZpbGw6IFwibm9uZVwiLFxuICAgIHN0cm9rZU1pdGVybGltaXQ6IFwiMTBcIixcbiAgICBjeDogXCIxMlwiLFxuICAgIGN5OiBcIjEyXCIsXG4gICAgcjogXCIxMS4yNVwiXG4gIH0pKSxcbiAgdmlld0JveDogXCIwIDAgMjQgMjRcIlxufTtcbmV4cG9ydCB2YXIgSWNvbiA9IC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKChwcm9wcywgcmVmKSA9PiB7XG4gIHZhciB7XG4gICAgYXM6IGVsZW1lbnQsXG4gICAgdmlld0JveCxcbiAgICBjb2xvciA9IFwiY3VycmVudENvbG9yXCIsXG4gICAgZm9jdXNhYmxlID0gZmFsc2UsXG4gICAgY2hpbGRyZW4sXG4gICAgY2xhc3NOYW1lLFxuICAgIF9fY3NzXG4gIH0gPSBwcm9wcyxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShwcm9wcywgW1wiYXNcIiwgXCJ2aWV3Qm94XCIsIFwiY29sb3JcIiwgXCJmb2N1c2FibGVcIiwgXCJjaGlsZHJlblwiLCBcImNsYXNzTmFtZVwiLCBcIl9fY3NzXCJdKTtcblxuICB2YXIgX2NsYXNzTmFtZSA9IGN4KFwiY2hha3JhLWljb25cIiwgY2xhc3NOYW1lKTtcblxuICB2YXIgc3R5bGVzID0gX2V4dGVuZHMoe1xuICAgIHc6IFwiMWVtXCIsXG4gICAgaDogXCIxZW1cIixcbiAgICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxuICAgIGxpbmVIZWlnaHQ6IFwiMWVtXCIsXG4gICAgZmxleFNocmluazogMCxcbiAgICBjb2xvclxuICB9LCBfX2Nzcyk7XG5cbiAgdmFyIHNoYXJlZCA9IHtcbiAgICByZWYsXG4gICAgZm9jdXNhYmxlLFxuICAgIGNsYXNzTmFtZTogX2NsYXNzTmFtZSxcbiAgICBfX2Nzczogc3R5bGVzXG4gIH07XG5cbiAgdmFyIF92aWV3Qm94ID0gdmlld0JveCAhPSBudWxsID8gdmlld0JveCA6IGZhbGxiYWNrSWNvbi52aWV3Qm94O1xuICAvKipcbiAgICogSWYgeW91J3JlIHVzaW5nIGFuIGljb24gbGlicmFyeSBsaWtlIGByZWFjdC1pY29uc2AuXG4gICAqIE5vdGU6IGFueW9uZSBwYXNzaW5nIHRoZSBgYXNgIHByb3AsIHNob3VsZCBtYW5hZ2UgdGhlIGB2aWV3Qm94YCBmcm9tIHRoZSBleHRlcm5hbCBjb21wb25lbnRcbiAgICovXG5cblxuICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChjaGFrcmEuc3ZnLCBfZXh0ZW5kcyh7XG4gICAgICBhczogZWxlbWVudFxuICAgIH0sIHNoYXJlZCwgcmVzdCkpO1xuICB9XG5cbiAgdmFyIF9wYXRoID0gY2hpbGRyZW4gIT0gbnVsbCA/IGNoaWxkcmVuIDogZmFsbGJhY2tJY29uLnBhdGg7XG5cbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9SZWFjdC5jcmVhdGVFbGVtZW50KGNoYWtyYS5zdmcsIF9leHRlbmRzKHtcbiAgICB2ZXJ0aWNhbEFsaWduOiBcIm1pZGRsZVwiLFxuICAgIHZpZXdCb3g6IF92aWV3Qm94XG4gIH0sIHNoYXJlZCwgcmVzdCksIF9wYXRoKTtcbn0pO1xuXG5pZiAoX19ERVZfXykge1xuICBJY29uLmRpc3BsYXlOYW1lID0gXCJJY29uXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEljb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pY29uLmpzLm1hcCJdLCJuYW1lcyI6WyJnbG9iYWwiLCJ0cmFuc2Zvcm1zIiwiZ2V0IiwiX2V4dGVuZHMiLCJtZXJnZVdpdGgiLCJtZXJnZSIsInN5c3RlbVByb3BDb25maWdzIiwidCIsIm1lbW9pemUiLCJ0b2tlbiIsInBlZWsiLCJpZGVudGlmaWVyIiwicG9zaXRpb24iLCJkZWxpbWl0IiwiZnJvbSIsIm5leHQiLCJkZWFsbG9jIiwiYWxsb2MiLCJwcmVmaXhlciIsInN0cmluZ2lmeSIsInJ1bGVzaGVldCIsIm1pZGRsZXdhcmUiLCJzZXJpYWxpemUiLCJjb21waWxlIiwiaXNCcm93c2VyIiwidW5pdGxlc3MiLCJoYXNoU3RyaW5nIiwiY3JlYXRlQ29udGV4dCIsImZvcndhcmRSZWYiLCJ1c2VDb250ZXh0IiwiY3JlYXRlRWxlbWVudCIsIl9zdHlsZWQiLCJSZWFjdC5mb3J3YXJkUmVmIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJSZWFjdC5jcmVhdGVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDTyxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDaEMsRUFBRSxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUNuQyxDQUFDO0FBQ00sU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ25DLEVBQUUsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUlEO0FBQ08sU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQy9CLEVBQUUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFJRDtBQUNPLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUNsQyxFQUFFLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFB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QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksT0FBTyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxFQUFFLEVBQUUsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsVUFBVSxHQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUUsSUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUUsRUFBRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLE9BQU8sWUFBWSxLQUFLLFVBQVUsRUFBRSxFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQzk3QztBQUNBLFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLE9BQU8sVUFBVSxLQUFLLFVBQVUsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRTtBQUtqWTtBQUNBLFNBQVMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxHQUFHLEtBQUssVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRSxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxPQUFPLEdBQUcsRUFBRSxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxlQUFlLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN2dkI7QUFDQSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUkseUJBQXlCLEVBQUUsRUFBRSxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsR0FBRyxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsZUFBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUNsYTtBQUNBLFNBQVMseUJBQXlCLEdBQUcsRUFBRSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUMsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQyxFQUFFLEVBQUU7QUFDcFU7QUFDQSxTQUFTLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDckc7QUFDQSxTQUFTLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsZUFBZSxHQUFHLE1BQU0sQ0FBQyxjQUFjLElBQUksU0FBUyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FB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QUUsT0FBTyxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN4RCxDQUFDLENBQUM7QUFDRjtBQUNBLElBQUksU0FBUyxHQUFHLFNBQVMsUUFBUSxHQUFHO0FBQ3BDLEVBQUUsS0FBSyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDckcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN4RCxDQUFDLENBQUM7QUFDRjtBQUNBLElBQUksU0FBUyxHQUFHLFNBQVMsUUFBUSxHQUFHO0FBQ3BDLEVBQUUsS0FBSyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDckcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN4RCxDQUFDLENBQUM7QUFDRjtBQUNBLElBQUksT0FBTyxHQUFHLFNBQVMsTUFBTSxHQUFHO0FBQ2hDLEVBQUUsS0FBSyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDckcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN4RCxDQUFDLENBQUM7QUFDRjtBQUNBLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSTtBQUNuQixFQUFFLElBQUksS0FBSyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDO0FBQ0EsRUFBRSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3pELElBQUksT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNoRixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQUNGO0FBQ1UsSUFBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUs7QUFDdEMsRUFBRSxHQUFHLEVBQUUsU0FBUyxHQUFHLEdBQUc7QUFDdEIsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN2RyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekMsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN0QyxHQUFHO0FBQ0gsRUFBRSxRQUFRLEVBQUUsU0FBUyxRQUFRLEdBQUc7QUFDaEMsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN2RyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekMsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMzQyxHQUFHO0FBQ0gsRUFBRSxRQUFRLEVBQUUsU0FBUyxRQUFRLEdBQUc7QUFDaEMsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN2RyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekMsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMzQyxHQUFHO0FBQ0gsRUFBRSxNQUFNLEVBQUUsU0FBUyxNQUFNLEdBQUc7QUFDNUIsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FB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LEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDdkMsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFILENBQUM7QUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUN2QixFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBQ0QsU0FBUyxDQUFDLEdBQUc7QUFDYixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELFNBQVMsQ0FBQyxHQUFHO0FBQ2IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFD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QUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ2hELEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDYixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZCxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZCxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsT0FBTyxFQUFFO0FBQ1gsSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM3QixNQUFNLEtBQUssRUFBRSxDQUFDO0FBQ2QsTUFBTSxLQUFLLEVBQUUsQ0FBQztBQUNkLE1BQU0sS0FBSyxFQUFFLENBQUM7QUFD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RUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3hELEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDaEQsSUFBSSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNwRixNQUFNLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3hCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUM1QixFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFQSxHQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDcEIsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25CLElBQUksS0FBSyxJQUFJO0FBQ2IsTUFBTSxPQUFPLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNwQyxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSTtBQUNiLE1BQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN6QixJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNkLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQ2QsSUFBSSxLQUFLLElBQUk7QUFDYixNQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQzNDLElBQUksS0FBSyxJQUFJLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSTtBQUNiLE1BQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2xDLElBQUksS0FBSyxJQUFJO0FBQ2IsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQzVDLElBQUksS0FBSyxJQUFJO0FBQ2IsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEdB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QUssU0FBUyxFQUFFO0FBQ3RFLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBQ3BELEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDckQsSUFBSSxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFDN0I7QUFDQSxJQUFJLEdBQUc7QUFDUCxNQUFNLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLE9BQU8sR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoSDtBQUNBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDN0IsS0FBSyxRQUFRLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDcEMsR0FBRztBQUNIOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1o7QUFDQSxFQUFFLElBQUksQ0FBQztBQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDWCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3ZCO0FBQ0EsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTtBQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUMvSSxJQUFJLENBQUM7QUFDTDtBQUNBLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVELElBQUksQ0FBQztBQUNMO0FBQ0EsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2IsSUFBSSxDQUFDO0FBQ0w7QUFDQSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDM0Q7QUFDQSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RCxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsUUFBUSxHQUFHO0FBQ2IsSUFBSSxLQUFLLENBQUM7QUFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDaEQ7QUFDQSxJQUFJLEtBQUssQ0FBQztBQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUMvQztBQUNBLElBQUksS0FBSyxDQUFDO0FBQ1YsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDcEMsTUFBTSxDQUFDO0FBQ1A7QUFDQSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksQ0FB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QUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSztBQUNsOEIs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
