import { r as react } from './common/index-47b2c619.js';
import './common/hoist-non-react-statics.cjs-bb397e65.js';
import './common/_commonjsHelpers-798ad6a7.js';

var global = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
var hasElementType = typeof Element !== 'undefined';

function equal(a, b) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = length; i-- !== 0;)
      if (!hasProp.call(b, keys[i])) return false;
    // end fast-deep-equal

    // start react-fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element && b instanceof Element)
      return a === b;

    // custom handling for React
    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!equal(a[key], b[key])) return false;
      }
    }
    // end react-fast-compare

    // fast-deep-equal index.js 2.0.1
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

var reactFastCompare = function exportedEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if ((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
};

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		Object.keys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	Object.keys(source).forEach(function(key) {
		if (!options.isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		} else {
			destination[key] = deepmerge(target[key], source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

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

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

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
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
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

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

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

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

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
  var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
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

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

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

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

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

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

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

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

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

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

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
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$2.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

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

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

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

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

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
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

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
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

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
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

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

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

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

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

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

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

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

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

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
  if (!(hasOwnProperty$5.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
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

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

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

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

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
  return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') &&
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
var isArray$1 = Array.isArray;

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

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

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

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

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

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

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
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
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

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

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

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

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

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
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

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

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
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
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
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
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

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

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
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
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
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined,
    allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

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
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap$1 = getNative(root, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap$1);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (Map && getTag(new Map) != mapTag$1) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag$1) ||
    (WeakMap$1 && getTag(new WeakMap$1) != weakMapTag$1)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$a.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

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
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
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

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

/** Built-in value references. */
var objectCreate = Object.create;

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

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$3;
}

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$3;
}

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray$1(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG$1);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** `Object#toString` result references. */
var symbolTag$2 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag$2);
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray$1(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

function _extends() {
  _extends = Object.assign || function (target) {
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

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
/** @private is the given object a Function? */

var isFunction$1 = function isFunction(obj) {
  return typeof obj === 'function';
};
/** @private is the given object an Object? */

var isObject$1 = function isObject(obj) {
  return obj !== null && typeof obj === 'object';
};
/** @private is the given object an integer? */

var isInteger = function isInteger(obj) {
  return String(Math.floor(Number(obj))) === obj;
};
/** @private is the given object a string? */

var isString = function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};
/** @private is the given object/value a promise? */

var isPromise = function isPromise(value) {
  return isObject$1(value) && isFunction$1(value.then);
};
/**
 * Deeply get a value from an object via its path.
 */

function getIn(obj, key, def, p) {
  if (p === void 0) {
    p = 0;
  }

  var path = toPath(key);

  while (obj && p < path.length) {
    obj = obj[path[p++]];
  }

  return obj === undefined ? def : obj;
}
/**
 * Deeply set a value from in object via it's path. If the value at `path`
 * has changed, return a shallow copy of obj with `value` set at `path`.
 * If `value` has not changed, return the original `obj`.
 *
 * Existing objects / arrays along `path` are also shallow copied. Sibling
 * objects along path retain the same internal js reference. Since new
 * objects / arrays are only created along `path`, we can test if anything
 * changed in a nested structure by comparing the object's reference in
 * the old and new object, similar to how russian doll cache invalidation
 * works.
 *
 * In earlier versions of this function, which used cloneDeep, there were
 * issues whereby settings a nested value would mutate the parent
 * instead of creating a new object. `clone` avoids that bug making a
 * shallow copy of the objects along the update path
 * so no object is mutated in place.
 *
 * Before changing this function, please read through the following
 * discussions.
 *
 * @see https://github.com/developit/linkstate
 * @see https://github.com/jaredpalmer/formik/pull/123
 */

function setIn(obj, path, value) {
  var res = clone(obj); // this keeps inheritance when obj is a class

  var resVal = res;
  var i = 0;
  var pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    var currentPath = pathArray[i];
    var currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && (isObject$1(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      var nextPath = pathArray[i + 1];
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  } // Return original object if new value is the same as current


  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  } // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.


  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}
/**
 * Recursively a set the same value for all keys and arrays nested object, cloning
 * @param object
 * @param value
 * @param visited
 * @param response
 */

function setNestedObjectValues(object, value, visited, response) {
  if (visited === void 0) {
    visited = new WeakMap();
  }

  if (response === void 0) {
    response = {};
  }

  for (var _i = 0, _Object$keys = Object.keys(object); _i < _Object$keys.length; _i++) {
    var k = _Object$keys[_i];
    var val = object[k];

    if (isObject$1(val)) {
      if (!visited.get(val)) {
        visited.set(val, true); // In order to keep array values consistent for both dot path  and
        // bracket syntax, we need to check if this is an array so that
        // this will output  { friends: [true] } and not { friends: { "0": true } }

        response[k] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k]);
      }
    } else {
      response[k] = value;
    }
  }

  return response;
}

var FormikContext = /*#__PURE__*/react.createContext(undefined);
var FormikProvider = FormikContext.Provider;
var FormikConsumer = FormikContext.Consumer;
function useFormikContext() {
  var formik = react.useContext(FormikContext);
  return formik;
}

function formikReducer(state, msg) {
  switch (msg.type) {
    case 'SET_VALUES':
      return _extends({}, state, {
        values: msg.payload
      });

    case 'SET_TOUCHED':
      return _extends({}, state, {
        touched: msg.payload
      });

    case 'SET_ERRORS':
      if (reactFastCompare(state.errors, msg.payload)) {
        return state;
      }

      return _extends({}, state, {
        errors: msg.payload
      });

    case 'SET_STATUS':
      return _extends({}, state, {
        status: msg.payload
      });

    case 'SET_ISSUBMITTING':
      return _extends({}, state, {
        isSubmitting: msg.payload
      });

    case 'SET_ISVALIDATING':
      return _extends({}, state, {
        isValidating: msg.payload
      });

    case 'SET_FIELD_VALUE':
      return _extends({}, state, {
        values: setIn(state.values, msg.payload.field, msg.payload.value)
      });

    case 'SET_FIELD_TOUCHED':
      return _extends({}, state, {
        touched: setIn(state.touched, msg.payload.field, msg.payload.value)
      });

    case 'SET_FIELD_ERROR':
      return _extends({}, state, {
        errors: setIn(state.errors, msg.payload.field, msg.payload.value)
      });

    case 'RESET_FORM':
      return _extends({}, state, msg.payload);

    case 'SET_FORMIK_STATE':
      return msg.payload(state);

    case 'SUBMIT_ATTEMPT':
      return _extends({}, state, {
        touched: setNestedObjectValues(state.values, true),
        isSubmitting: true,
        submitCount: state.submitCount + 1
      });

    case 'SUBMIT_FAILURE':
      return _extends({}, state, {
        isSubmitting: false
      });

    case 'SUBMIT_SUCCESS':
      return _extends({}, state, {
        isSubmitting: false
      });

    default:
      return state;
  }
} // Initial empty states // objects


var emptyErrors = {};
var emptyTouched = {};
function useFormik(_ref) {
  var _ref$validateOnChange = _ref.validateOnChange,
      validateOnChange = _ref$validateOnChange === void 0 ? true : _ref$validateOnChange,
      _ref$validateOnBlur = _ref.validateOnBlur,
      validateOnBlur = _ref$validateOnBlur === void 0 ? true : _ref$validateOnBlur,
      _ref$validateOnMount = _ref.validateOnMount,
      validateOnMount = _ref$validateOnMount === void 0 ? false : _ref$validateOnMount,
      isInitialValid = _ref.isInitialValid,
      _ref$enableReinitiali = _ref.enableReinitialize,
      enableReinitialize = _ref$enableReinitiali === void 0 ? false : _ref$enableReinitiali,
      onSubmit = _ref.onSubmit,
      rest = _objectWithoutPropertiesLoose(_ref, ["validateOnChange", "validateOnBlur", "validateOnMount", "isInitialValid", "enableReinitialize", "onSubmit"]);

  var props = _extends({
    validateOnChange: validateOnChange,
    validateOnBlur: validateOnBlur,
    validateOnMount: validateOnMount,
    onSubmit: onSubmit
  }, rest);

  var initialValues = react.useRef(props.initialValues);
  var initialErrors = react.useRef(props.initialErrors || emptyErrors);
  var initialTouched = react.useRef(props.initialTouched || emptyTouched);
  var initialStatus = react.useRef(props.initialStatus);
  var isMounted = react.useRef(false);
  var fieldRegistry = react.useRef({});

  react.useEffect(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);

  var _React$useReducer = react.useReducer(formikReducer, {
    values: props.initialValues,
    errors: props.initialErrors || emptyErrors,
    touched: props.initialTouched || emptyTouched,
    status: props.initialStatus,
    isSubmitting: false,
    isValidating: false,
    submitCount: 0
  }),
      state = _React$useReducer[0],
      dispatch = _React$useReducer[1];

  var runValidateHandler = react.useCallback(function (values, field) {
    return new Promise(function (resolve, reject) {
      var maybePromisedErrors = props.validate(values, field);

      if (maybePromisedErrors == null) {
        // use loose null check here on purpose
        resolve(emptyErrors);
      } else if (isPromise(maybePromisedErrors)) {
        maybePromisedErrors.then(function (errors) {
          resolve(errors || emptyErrors);
        }, function (actualException) {

          reject(actualException);
        });
      } else {
        resolve(maybePromisedErrors);
      }
    });
  }, [props.validate]);
  /**
   * Run validation against a Yup schema and optionally run a function if successful
   */

  var runValidationSchema = react.useCallback(function (values, field) {
    var validationSchema = props.validationSchema;
    var schema = isFunction$1(validationSchema) ? validationSchema(field) : validationSchema;
    var promise = field && schema.validateAt ? schema.validateAt(field, values) : validateYupSchema(values, schema);
    return new Promise(function (resolve, reject) {
      promise.then(function () {
        resolve(emptyErrors);
      }, function (err) {
        // Yup will throw a validation error if validation fails. We catch those and
        // resolve them into Formik errors. We can sniff if something is a Yup error
        // by checking error.name.
        // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
        if (err.name === 'ValidationError') {
          resolve(yupToFormErrors(err));
        } else {

          reject(err);
        }
      });
    });
  }, [props.validationSchema]);
  var runSingleFieldLevelValidation = react.useCallback(function (field, value) {
    return new Promise(function (resolve) {
      return resolve(fieldRegistry.current[field].validate(value));
    });
  }, []);
  var runFieldLevelValidations = react.useCallback(function (values) {
    var fieldKeysWithValidation = Object.keys(fieldRegistry.current).filter(function (f) {
      return isFunction$1(fieldRegistry.current[f].validate);
    }); // Construct an array with all of the field validation functions

    var fieldValidations = fieldKeysWithValidation.length > 0 ? fieldKeysWithValidation.map(function (f) {
      return runSingleFieldLevelValidation(f, getIn(values, f));
    }) : [Promise.resolve('DO_NOT_DELETE_YOU_WILL_BE_FIRED')]; // use special case ;)

    return Promise.all(fieldValidations).then(function (fieldErrorsList) {
      return fieldErrorsList.reduce(function (prev, curr, index) {
        if (curr === 'DO_NOT_DELETE_YOU_WILL_BE_FIRED') {
          return prev;
        }

        if (curr) {
          prev = setIn(prev, fieldKeysWithValidation[index], curr);
        }

        return prev;
      }, {});
    });
  }, [runSingleFieldLevelValidation]); // Run all validations and return the result

  var runAllValidations = react.useCallback(function (values) {
    return Promise.all([runFieldLevelValidations(values), props.validationSchema ? runValidationSchema(values) : {}, props.validate ? runValidateHandler(values) : {}]).then(function (_ref2) {
      var fieldErrors = _ref2[0],
          schemaErrors = _ref2[1],
          validateErrors = _ref2[2];
      var combinedErrors = deepmerge_1.all([fieldErrors, schemaErrors, validateErrors], {
        arrayMerge: arrayMerge
      });
      return combinedErrors;
    });
  }, [props.validate, props.validationSchema, runFieldLevelValidations, runValidateHandler, runValidationSchema]); // Run all validations methods and update state accordingly

  var validateFormWithHighPriority = useEventCallback(function (values) {
    if (values === void 0) {
      values = state.values;
    }

    dispatch({
      type: 'SET_ISVALIDATING',
      payload: true
    });
    return runAllValidations(values).then(function (combinedErrors) {
      if (!!isMounted.current) {
        dispatch({
          type: 'SET_ISVALIDATING',
          payload: false
        });

        if (!reactFastCompare(state.errors, combinedErrors)) {
          dispatch({
            type: 'SET_ERRORS',
            payload: combinedErrors
          });
        }
      }

      return combinedErrors;
    });
  });
  react.useEffect(function () {
    if (validateOnMount && isMounted.current === true && reactFastCompare(initialValues.current, props.initialValues)) {
      validateFormWithHighPriority(initialValues.current);
    }
  }, [validateOnMount, validateFormWithHighPriority]);
  var resetForm = react.useCallback(function (nextState) {
    var values = nextState && nextState.values ? nextState.values : initialValues.current;
    var errors = nextState && nextState.errors ? nextState.errors : initialErrors.current ? initialErrors.current : props.initialErrors || {};
    var touched = nextState && nextState.touched ? nextState.touched : initialTouched.current ? initialTouched.current : props.initialTouched || {};
    var status = nextState && nextState.status ? nextState.status : initialStatus.current ? initialStatus.current : props.initialStatus;
    initialValues.current = values;
    initialErrors.current = errors;
    initialTouched.current = touched;
    initialStatus.current = status;

    var dispatchFn = function dispatchFn() {
      dispatch({
        type: 'RESET_FORM',
        payload: {
          isSubmitting: !!nextState && !!nextState.isSubmitting,
          errors: errors,
          touched: touched,
          status: status,
          values: values,
          isValidating: !!nextState && !!nextState.isValidating,
          submitCount: !!nextState && !!nextState.submitCount && typeof nextState.submitCount === 'number' ? nextState.submitCount : 0
        }
      });
    };

    if (props.onReset) {
      var maybePromisedOnReset = props.onReset(state.values, imperativeMethods);

      if (isPromise(maybePromisedOnReset)) {
        maybePromisedOnReset.then(dispatchFn);
      } else {
        dispatchFn();
      }
    } else {
      dispatchFn();
    }
  }, [props.initialErrors, props.initialStatus, props.initialTouched]);
  react.useEffect(function () {
    if (isMounted.current === true && !reactFastCompare(initialValues.current, props.initialValues)) {
      if (enableReinitialize) {
        initialValues.current = props.initialValues;
        resetForm();
      }

      if (validateOnMount) {
        validateFormWithHighPriority(initialValues.current);
      }
    }
  }, [enableReinitialize, props.initialValues, resetForm, validateOnMount, validateFormWithHighPriority]);
  react.useEffect(function () {
    if (enableReinitialize && isMounted.current === true && !reactFastCompare(initialErrors.current, props.initialErrors)) {
      initialErrors.current = props.initialErrors || emptyErrors;
      dispatch({
        type: 'SET_ERRORS',
        payload: props.initialErrors || emptyErrors
      });
    }
  }, [enableReinitialize, props.initialErrors]);
  react.useEffect(function () {
    if (enableReinitialize && isMounted.current === true && !reactFastCompare(initialTouched.current, props.initialTouched)) {
      initialTouched.current = props.initialTouched || emptyTouched;
      dispatch({
        type: 'SET_TOUCHED',
        payload: props.initialTouched || emptyTouched
      });
    }
  }, [enableReinitialize, props.initialTouched]);
  react.useEffect(function () {
    if (enableReinitialize && isMounted.current === true && !reactFastCompare(initialStatus.current, props.initialStatus)) {
      initialStatus.current = props.initialStatus;
      dispatch({
        type: 'SET_STATUS',
        payload: props.initialStatus
      });
    }
  }, [enableReinitialize, props.initialStatus, props.initialTouched]);
  var validateField = useEventCallback(function (name) {
    // This will efficiently validate a single field by avoiding state
    // changes if the validation function is synchronous. It's different from
    // what is called when using validateForm.
    if (fieldRegistry.current[name] && isFunction$1(fieldRegistry.current[name].validate)) {
      var value = getIn(state.values, name);
      var maybePromise = fieldRegistry.current[name].validate(value);

      if (isPromise(maybePromise)) {
        // Only flip isValidating if the function is async.
        dispatch({
          type: 'SET_ISVALIDATING',
          payload: true
        });
        return maybePromise.then(function (x) {
          return x;
        }).then(function (error) {
          dispatch({
            type: 'SET_FIELD_ERROR',
            payload: {
              field: name,
              value: error
            }
          });
          dispatch({
            type: 'SET_ISVALIDATING',
            payload: false
          });
        });
      } else {
        dispatch({
          type: 'SET_FIELD_ERROR',
          payload: {
            field: name,
            value: maybePromise
          }
        });
        return Promise.resolve(maybePromise);
      }
    } else if (props.validationSchema) {
      dispatch({
        type: 'SET_ISVALIDATING',
        payload: true
      });
      return runValidationSchema(state.values, name).then(function (x) {
        return x;
      }).then(function (error) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          payload: {
            field: name,
            value: error[name]
          }
        });
        dispatch({
          type: 'SET_ISVALIDATING',
          payload: false
        });
      });
    }

    return Promise.resolve();
  });
  var registerField = react.useCallback(function (name, _ref3) {
    var validate = _ref3.validate;
    fieldRegistry.current[name] = {
      validate: validate
    };
  }, []);
  var unregisterField = react.useCallback(function (name) {
    delete fieldRegistry.current[name];
  }, []);
  var setTouched = useEventCallback(function (touched, shouldValidate) {
    dispatch({
      type: 'SET_TOUCHED',
      payload: touched
    });
    var willValidate = shouldValidate === undefined ? validateOnBlur : shouldValidate;
    return willValidate ? validateFormWithHighPriority(state.values) : Promise.resolve();
  });
  var setErrors = react.useCallback(function (errors) {
    dispatch({
      type: 'SET_ERRORS',
      payload: errors
    });
  }, []);
  var setValues = useEventCallback(function (values, shouldValidate) {
    var resolvedValues = isFunction$1(values) ? values(state.values) : values;
    dispatch({
      type: 'SET_VALUES',
      payload: resolvedValues
    });
    var willValidate = shouldValidate === undefined ? validateOnChange : shouldValidate;
    return willValidate ? validateFormWithHighPriority(resolvedValues) : Promise.resolve();
  });
  var setFieldError = react.useCallback(function (field, value) {
    dispatch({
      type: 'SET_FIELD_ERROR',
      payload: {
        field: field,
        value: value
      }
    });
  }, []);
  var setFieldValue = useEventCallback(function (field, value, shouldValidate) {
    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {
        field: field,
        value: value
      }
    });
    var willValidate = shouldValidate === undefined ? validateOnChange : shouldValidate;
    return willValidate ? validateFormWithHighPriority(setIn(state.values, field, value)) : Promise.resolve();
  });
  var executeChange = react.useCallback(function (eventOrTextValue, maybePath) {
    // By default, assume that the first argument is a string. This allows us to use
    // handleChange with React Native and React Native Web's onChangeText prop which
    // provides just the value of the input.
    var field = maybePath;
    var val = eventOrTextValue;
    var parsed; // If the first argument is not a string though, it has to be a synthetic React Event (or a fake one),
    // so we handle like we would a normal HTML change event.

    if (!isString(eventOrTextValue)) {
      // If we can, persist the event
      // @see https://reactjs.org/docs/events.html#event-pooling
      if (eventOrTextValue.persist) {
        eventOrTextValue.persist();
      }

      var target = eventOrTextValue.target ? eventOrTextValue.target : eventOrTextValue.currentTarget;
      var type = target.type,
          name = target.name,
          id = target.id,
          value = target.value,
          checked = target.checked,
          outerHTML = target.outerHTML,
          options = target.options,
          multiple = target.multiple;
      field = maybePath ? maybePath : name ? name : id;

      if (!field && "production" !== "production") {
        warnAboutMissingIdentifier({
          htmlContent: outerHTML,
          documentationAnchorLink: 'handlechange-e-reactchangeeventany--void',
          handlerName: 'handleChange'
        });
      }

      val = /number|range/.test(type) ? (parsed = parseFloat(value), isNaN(parsed) ? '' : parsed) : /checkbox/.test(type) // checkboxes
      ? getValueForCheckbox(getIn(state.values, field), checked, value) : !!multiple // <select multiple>
      ? getSelectedValues(options) : value;
    }

    if (field) {
      // Set form fields by name
      setFieldValue(field, val);
    }
  }, [setFieldValue, state.values]);
  var handleChange = useEventCallback(function (eventOrPath) {
    if (isString(eventOrPath)) {
      return function (event) {
        return executeChange(event, eventOrPath);
      };
    } else {
      executeChange(eventOrPath);
    }
  });
  var setFieldTouched = useEventCallback(function (field, touched, shouldValidate) {
    if (touched === void 0) {
      touched = true;
    }

    dispatch({
      type: 'SET_FIELD_TOUCHED',
      payload: {
        field: field,
        value: touched
      }
    });
    var willValidate = shouldValidate === undefined ? validateOnBlur : shouldValidate;
    return willValidate ? validateFormWithHighPriority(state.values) : Promise.resolve();
  });
  var executeBlur = react.useCallback(function (e, path) {
    if (e.persist) {
      e.persist();
    }

    var _e$target = e.target,
        name = _e$target.name,
        id = _e$target.id,
        outerHTML = _e$target.outerHTML;
    var field = path ? path : name ? name : id;

    if (!field && "production" !== "production") {
      warnAboutMissingIdentifier({
        htmlContent: outerHTML,
        documentationAnchorLink: 'handleblur-e-any--void',
        handlerName: 'handleBlur'
      });
    }

    setFieldTouched(field, true);
  }, [setFieldTouched]);
  var handleBlur = useEventCallback(function (eventOrString) {
    if (isString(eventOrString)) {
      return function (event) {
        return executeBlur(event, eventOrString);
      };
    } else {
      executeBlur(eventOrString);
    }
  });
  var setFormikState = react.useCallback(function (stateOrCb) {
    if (isFunction$1(stateOrCb)) {
      dispatch({
        type: 'SET_FORMIK_STATE',
        payload: stateOrCb
      });
    } else {
      dispatch({
        type: 'SET_FORMIK_STATE',
        payload: function payload() {
          return stateOrCb;
        }
      });
    }
  }, []);
  var setStatus = react.useCallback(function (status) {
    dispatch({
      type: 'SET_STATUS',
      payload: status
    });
  }, []);
  var setSubmitting = react.useCallback(function (isSubmitting) {
    dispatch({
      type: 'SET_ISSUBMITTING',
      payload: isSubmitting
    });
  }, []);
  var submitForm = useEventCallback(function () {
    dispatch({
      type: 'SUBMIT_ATTEMPT'
    });
    return validateFormWithHighPriority().then(function (combinedErrors) {
      // In case an error was thrown and passed to the resolved Promise,
      // `combinedErrors` can be an instance of an Error. We need to check
      // that and abort the submit.
      // If we don't do that, calling `Object.keys(new Error())` yields an
      // empty array, which causes the validation to pass and the form
      // to be submitted.
      var isInstanceOfError = combinedErrors instanceof Error;
      var isActuallyValid = !isInstanceOfError && Object.keys(combinedErrors).length === 0;

      if (isActuallyValid) {
        // Proceed with submit...
        //
        // To respect sync submit fns, we can't simply wrap executeSubmit in a promise and
        // _always_ dispatch SUBMIT_SUCCESS because isSubmitting would then always be false.
        // This would be fine in simple cases, but make it impossible to disable submit
        // buttons where people use callbacks or promises as side effects (which is basically
        // all of v1 Formik code). Instead, recall that we are inside of a promise chain already,
        //  so we can try/catch executeSubmit(), if it returns undefined, then just bail.
        // If there are errors, throw em. Otherwise, wrap executeSubmit in a promise and handle
        // cleanup of isSubmitting on behalf of the consumer.
        var promiseOrUndefined;

        try {
          promiseOrUndefined = executeSubmit(); // Bail if it's sync, consumer is responsible for cleaning up
          // via setSubmitting(false)

          if (promiseOrUndefined === undefined) {
            return;
          }
        } catch (error) {
          throw error;
        }

        return Promise.resolve(promiseOrUndefined).then(function (result) {
          if (!!isMounted.current) {
            dispatch({
              type: 'SUBMIT_SUCCESS'
            });
          }

          return result;
        })["catch"](function (_errors) {
          if (!!isMounted.current) {
            dispatch({
              type: 'SUBMIT_FAILURE'
            }); // This is a legit error rejected by the onSubmit fn
            // so we don't want to break the promise chain

            throw _errors;
          }
        });
      } else if (!!isMounted.current) {
        // ^^^ Make sure Formik is still mounted before updating state
        dispatch({
          type: 'SUBMIT_FAILURE'
        }); // throw combinedErrors;

        if (isInstanceOfError) {
          throw combinedErrors;
        }
      }

      return;
    });
  });
  var handleSubmit = useEventCallback(function (e) {
    if (e && e.preventDefault && isFunction$1(e.preventDefault)) {
      e.preventDefault();
    }

    if (e && e.stopPropagation && isFunction$1(e.stopPropagation)) {
      e.stopPropagation();
    } // Warn if form submission is triggered by a <button> without a

    submitForm()["catch"](function (reason) {
      console.warn("Warning: An unhandled error was caught from submitForm()", reason);
    });
  });
  var imperativeMethods = {
    resetForm: resetForm,
    validateForm: validateFormWithHighPriority,
    validateField: validateField,
    setErrors: setErrors,
    setFieldError: setFieldError,
    setFieldTouched: setFieldTouched,
    setFieldValue: setFieldValue,
    setStatus: setStatus,
    setSubmitting: setSubmitting,
    setTouched: setTouched,
    setValues: setValues,
    setFormikState: setFormikState,
    submitForm: submitForm
  };
  var executeSubmit = useEventCallback(function () {
    return onSubmit(state.values, imperativeMethods);
  });
  var handleReset = useEventCallback(function (e) {
    if (e && e.preventDefault && isFunction$1(e.preventDefault)) {
      e.preventDefault();
    }

    if (e && e.stopPropagation && isFunction$1(e.stopPropagation)) {
      e.stopPropagation();
    }

    resetForm();
  });
  var getFieldMeta = react.useCallback(function (name) {
    return {
      value: getIn(state.values, name),
      error: getIn(state.errors, name),
      touched: !!getIn(state.touched, name),
      initialValue: getIn(initialValues.current, name),
      initialTouched: !!getIn(initialTouched.current, name),
      initialError: getIn(initialErrors.current, name)
    };
  }, [state.errors, state.touched, state.values]);
  var getFieldHelpers = react.useCallback(function (name) {
    return {
      setValue: function setValue(value, shouldValidate) {
        return setFieldValue(name, value, shouldValidate);
      },
      setTouched: function setTouched(value, shouldValidate) {
        return setFieldTouched(name, value, shouldValidate);
      },
      setError: function setError(value) {
        return setFieldError(name, value);
      }
    };
  }, [setFieldValue, setFieldTouched, setFieldError]);
  var getFieldProps = react.useCallback(function (nameOrOptions) {
    var isAnObject = isObject$1(nameOrOptions);
    var name = isAnObject ? nameOrOptions.name : nameOrOptions;
    var valueState = getIn(state.values, name);
    var field = {
      name: name,
      value: valueState,
      onChange: handleChange,
      onBlur: handleBlur
    };

    if (isAnObject) {
      var type = nameOrOptions.type,
          valueProp = nameOrOptions.value,
          is = nameOrOptions.as,
          multiple = nameOrOptions.multiple;

      if (type === 'checkbox') {
        if (valueProp === undefined) {
          field.checked = !!valueState;
        } else {
          field.checked = !!(Array.isArray(valueState) && ~valueState.indexOf(valueProp));
          field.value = valueProp;
        }
      } else if (type === 'radio') {
        field.checked = valueState === valueProp;
        field.value = valueProp;
      } else if (is === 'select' && multiple) {
        field.value = field.value || [];
        field.multiple = true;
      }
    }

    return field;
  }, [handleBlur, handleChange, state.values]);
  var dirty = react.useMemo(function () {
    return !reactFastCompare(initialValues.current, state.values);
  }, [initialValues.current, state.values]);
  var isValid = react.useMemo(function () {
    return typeof isInitialValid !== 'undefined' ? dirty ? state.errors && Object.keys(state.errors).length === 0 : isInitialValid !== false && isFunction$1(isInitialValid) ? isInitialValid(props) : isInitialValid : state.errors && Object.keys(state.errors).length === 0;
  }, [isInitialValid, dirty, state.errors, props]);

  var ctx = _extends({}, state, {
    initialValues: initialValues.current,
    initialErrors: initialErrors.current,
    initialTouched: initialTouched.current,
    initialStatus: initialStatus.current,
    handleBlur: handleBlur,
    handleChange: handleChange,
    handleReset: handleReset,
    handleSubmit: handleSubmit,
    resetForm: resetForm,
    setErrors: setErrors,
    setFormikState: setFormikState,
    setFieldTouched: setFieldTouched,
    setFieldValue: setFieldValue,
    setFieldError: setFieldError,
    setStatus: setStatus,
    setSubmitting: setSubmitting,
    setTouched: setTouched,
    setValues: setValues,
    submitForm: submitForm,
    validateForm: validateFormWithHighPriority,
    validateField: validateField,
    isValid: isValid,
    dirty: dirty,
    unregisterField: unregisterField,
    registerField: registerField,
    getFieldProps: getFieldProps,
    getFieldMeta: getFieldMeta,
    getFieldHelpers: getFieldHelpers,
    validateOnBlur: validateOnBlur,
    validateOnChange: validateOnChange,
    validateOnMount: validateOnMount
  });

  return ctx;
}

function warnAboutMissingIdentifier(_ref4) {
  var htmlContent = _ref4.htmlContent,
      documentationAnchorLink = _ref4.documentationAnchorLink,
      handlerName = _ref4.handlerName;
  console.warn("Warning: Formik called `" + handlerName + "`, but you forgot to pass an `id` or `name` attribute to your input:\n    " + htmlContent + "\n    Formik cannot determine which value to update. For more info see https://formik.org/docs/api/formik#" + documentationAnchorLink + "\n  ");
}
/**
 * Transform Yup ValidationError to a more usable object
 */


function yupToFormErrors(yupError) {
  var errors = {};

  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return setIn(errors, yupError.path, yupError.message);
    }

    for (var _iterator = yupError.inner, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref5 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref5 = _i.value;
      }

      var err = _ref5;

      if (!getIn(errors, err.path)) {
        errors = setIn(errors, err.path, err.message);
      }
    }
  }

  return errors;
}
/**
 * Validate a yup schema.
 */

function validateYupSchema(values, schema, sync, context) {
  if (sync === void 0) {
    sync = false;
  }

  if (context === void 0) {
    context = {};
  }

  var validateData = prepareDataForValidation(values);
  return schema[sync ? 'validateSync' : 'validate'](validateData, {
    abortEarly: false,
    context: context
  });
}
/**
 * Recursively prepare values.
 */

function prepareDataForValidation(values) {
  var data = Array.isArray(values) ? [] : {};

  for (var k in values) {
    if (Object.prototype.hasOwnProperty.call(values, k)) {
      var key = String(k);

      if (Array.isArray(values[key]) === true) {
        data[key] = values[key].map(function (value) {
          if (Array.isArray(value) === true || isPlainObject(value)) {
            return prepareDataForValidation(value);
          } else {
            return value !== '' ? value : undefined;
          }
        });
      } else if (isPlainObject(values[key])) {
        data[key] = prepareDataForValidation(values[key]);
      } else {
        data[key] = values[key] !== '' ? values[key] : undefined;
      }
    }
  }

  return data;
}
/**
 * deepmerge array merging algorithm
 * https://github.com/KyleAMathews/deepmerge#combine-array
 */

function arrayMerge(target, source, options) {
  var destination = target.slice();
  source.forEach(function merge(e, i) {
    if (typeof destination[i] === 'undefined') {
      var cloneRequested = options.clone !== false;
      var shouldClone = cloneRequested && options.isMergeableObject(e);
      destination[i] = shouldClone ? deepmerge_1(Array.isArray(e) ? [] : {}, e, options) : e;
    } else if (options.isMergeableObject(e)) {
      destination[i] = deepmerge_1(target[i], e, options);
    } else if (target.indexOf(e) === -1) {
      destination.push(e);
    }
  });
  return destination;
}
/** Return multi select values based on an array of options */


function getSelectedValues(options) {
  return Array.from(options).filter(function (el) {
    return el.selected;
  }).map(function (el) {
    return el.value;
  });
}
/** Return the next value for a checkbox */


function getValueForCheckbox(currentValue, checked, valueProp) {
  // If the current value was a boolean, return a boolean
  if (typeof currentValue === 'boolean') {
    return Boolean(checked);
  } // If the currentValue was not a boolean we want to return an array


  var currentArrayOfValues = [];
  var isValueInArray = false;
  var index = -1;

  if (!Array.isArray(currentValue)) {
    // eslint-disable-next-line eqeqeq
    if (!valueProp || valueProp == 'true' || valueProp == 'false') {
      return Boolean(checked);
    }
  } else {
    // If the current value is already an array, use it
    currentArrayOfValues = currentValue;
    index = currentValue.indexOf(valueProp);
    isValueInArray = index >= 0;
  } // If the checkbox was checked and the value is not already present in the aray we want to add the new value to the array of values


  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp);
  } // If the checkbox was unchecked and the value is not in the array, simply return the already existing array of values


  if (!isValueInArray) {
    return currentArrayOfValues;
  } // If the checkbox was unchecked and the value is in the array, remove the value and return the array


  return currentArrayOfValues.slice(0, index).concat(currentArrayOfValues.slice(index + 1));
} // React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
// @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85


var useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? react.useLayoutEffect : react.useEffect;

function useEventCallback(fn) {
  var ref = react.useRef(fn); // we copy a ref to the callback scoped to the current state/props on each render

  useIsomorphicLayoutEffect(function () {
    ref.current = fn;
  });
  return react.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return ref.current.apply(void 0, args);
  }, []);
}

function useField(propsOrFieldName) {
  var formik = useFormikContext();
  var getFieldProps = formik.getFieldProps,
      getFieldMeta = formik.getFieldMeta,
      getFieldHelpers = formik.getFieldHelpers,
      registerField = formik.registerField,
      unregisterField = formik.unregisterField;
  var isAnObject = isObject$1(propsOrFieldName); // Normalize propsOrFieldName to FieldHookConfig<Val>

  var props = isAnObject ? propsOrFieldName : {
    name: propsOrFieldName
  };
  var fieldName = props.name,
      validateFn = props.validate;
  react.useEffect(function () {
    if (fieldName) {
      registerField(fieldName, {
        validate: validateFn
      });
    }

    return function () {
      if (fieldName) {
        unregisterField(fieldName);
      }
    };
  }, [registerField, unregisterField, fieldName, validateFn]);
  return [getFieldProps(props), getFieldMeta(fieldName), getFieldHelpers(fieldName)];
}

var Form = /*#__PURE__*/react.forwardRef(function (props, ref) {
  // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
  // We default the action to "#" in case the preventDefault fails (just updates the URL hash)
  var action = props.action,
      rest = _objectWithoutPropertiesLoose(props, ["action"]);

  var _action = action || '#';

  var _useFormikContext = useFormikContext(),
      handleReset = _useFormikContext.handleReset,
      handleSubmit = _useFormikContext.handleSubmit;

  return react.createElement("form", Object.assign({
    onSubmit: handleSubmit,
    ref: ref,
    onReset: handleReset,
    action: _action
  }, rest));
});
Form.displayName = 'Form';

export { Form, FormikProvider, useField, useFormik, useFormikContext };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWlrLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3QtZmFzdC1jb21wYXJlQDIuMC40L25vZGVfbW9kdWxlcy9yZWFjdC1mYXN0LWNvbXBhcmUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZGVlcG1lcmdlQDIuMi4xL25vZGVfbW9kdWxlcy9kZWVwbWVyZ2UvZGlzdC9lcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19mcmVlR2xvYmFsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3Jvb3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fU3ltYm9sLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldFJhd1RhZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vYmplY3RUb1N0cmluZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX292ZXJBcmcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UHJvdG90eXBlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNQbGFpbk9iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVDbGVhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2VxLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Fzc29jSW5kZXhPZi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVEZWxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlR2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUhhcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVTZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTGlzdENhY2hlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrQ2xlYXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tEZWxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tHZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tIYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzRnVuY3Rpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY29yZUpzRGF0YS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc01hc2tlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL190b1NvdXJjZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNOYXRpdmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0TmF0aXZlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19uYXRpdmVDcmVhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaENsZWFyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoSGFzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzS2V5YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrU2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N0YWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2FycmF5RWFjaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlQXNzaWduVmFsdWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXNzaWduVmFsdWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY29weU9iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlVGltZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzQXJndW1lbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvc3R1YkZhbHNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNCdWZmZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNJbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzTGVuZ3RoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVVuYXJ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25vZGVVdGlsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNUeXBlZEFycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2FycmF5TGlrZUtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNQcm90b3R5cGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbmF0aXZlS2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlS2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJyYXlMaWtlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMva2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlQXNzaWduLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXNJbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlS2V5c0luLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMva2V5c0luLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VBc3NpZ25Jbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZUJ1ZmZlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3B5QXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXJyYXlGaWx0ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9zdHViQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0U3ltYm9scy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3B5U3ltYm9scy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hcnJheVB1c2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0U3ltYm9sc0luLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcHlTeW1ib2xzSW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldEFsbEtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0QWxsS2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRBbGxLZXlzSW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fRGF0YVZpZXcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fUHJvbWlzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19TZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fV2Vha01hcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRUYWcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faW5pdENsb25lQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fVWludDhBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZUFycmF5QnVmZmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lRGF0YVZpZXcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY2xvbmVSZWdFeHAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY2xvbmVTeW1ib2wuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY2xvbmVUeXBlZEFycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2luaXRDbG9uZUJ5VGFnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VDcmVhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faW5pdENsb25lT2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VJc01hcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzTWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VJc1NldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzU2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VDbG9uZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2Nsb25lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2FycmF5TWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNTeW1ib2wuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9tZW1vaXplLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21lbW9pemVDYXBwZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9kYXNoLWVzQDQuMTcuMjEvbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RyaW5nVG9QYXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvS2V5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VUb1N0cmluZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9sb2Rhc2gtZXNANC4xNy4yMS9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL3RvU3RyaW5nLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2xvZGFzaC1lc0A0LjE3LjIxL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvdG9QYXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2Zvcm1pa0AyLjIuNl9yZWFjdEAxNy4wLjIvbm9kZV9tb2R1bGVzL2Zvcm1pay9kaXN0L2Zvcm1pay5lc20uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG52YXIga2V5TGlzdCA9IE9iamVjdC5rZXlzO1xudmFyIGhhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhc0VsZW1lbnRUeXBlID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnO1xuXG5mdW5jdGlvbiBlcXVhbChhLCBiKSB7XG4gIC8vIGZhc3QtZGVlcC1lcXVhbCBpbmRleC5qcyAyLjAuMVxuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiA9PSAnb2JqZWN0Jykge1xuICAgIHZhciBhcnJBID0gaXNBcnJheShhKVxuICAgICAgLCBhcnJCID0gaXNBcnJheShiKVxuICAgICAgLCBpXG4gICAgICAsIGxlbmd0aFxuICAgICAgLCBrZXk7XG5cbiAgICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOylcbiAgICAgICAgaWYgKCFlcXVhbChhW2ldLCBiW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGFyckEgIT0gYXJyQikgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIGRhdGVBID0gYSBpbnN0YW5jZW9mIERhdGVcbiAgICAgICwgZGF0ZUIgPSBiIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBpZiAoZGF0ZUEgIT0gZGF0ZUIpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoZGF0ZUEgJiYgZGF0ZUIpIHJldHVybiBhLmdldFRpbWUoKSA9PSBiLmdldFRpbWUoKTtcblxuICAgIHZhciByZWdleHBBID0gYSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgLCByZWdleHBCID0gYiBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICBpZiAocmVnZXhwQSAhPSByZWdleHBCKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHJlZ2V4cEEgJiYgcmVnZXhwQikgcmV0dXJuIGEudG9TdHJpbmcoKSA9PSBiLnRvU3RyaW5nKCk7XG5cbiAgICB2YXIga2V5cyA9IGtleUxpc3QoYSk7XG4gICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG5cbiAgICBpZiAobGVuZ3RoICE9PSBrZXlMaXN0KGIpLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOylcbiAgICAgIGlmICghaGFzUHJvcC5jYWxsKGIsIGtleXNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gZW5kIGZhc3QtZGVlcC1lcXVhbFxuXG4gICAgLy8gc3RhcnQgcmVhY3QtZmFzdC1jb21wYXJlXG4gICAgLy8gY3VzdG9tIGhhbmRsaW5nIGZvciBET00gZWxlbWVudHNcbiAgICBpZiAoaGFzRWxlbWVudFR5cGUgJiYgYSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgYiBpbnN0YW5jZW9mIEVsZW1lbnQpXG4gICAgICByZXR1cm4gYSA9PT0gYjtcblxuICAgIC8vIGN1c3RvbSBoYW5kbGluZyBmb3IgUmVhY3RcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSAhPT0gMDspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ID09PSAnX293bmVyJyAmJiBhLiQkdHlwZW9mKSB7XG4gICAgICAgIC8vIFJlYWN0LXNwZWNpZmljOiBhdm9pZCB0cmF2ZXJzaW5nIFJlYWN0IGVsZW1lbnRzJyBfb3duZXIuXG4gICAgICAgIC8vICBfb3duZXIgY29udGFpbnMgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgICAgICAvLyBhbmQgaXMgbm90IG5lZWRlZCB3aGVuIGNvbXBhcmluZyB0aGUgYWN0dWFsIGVsZW1lbnRzIChhbmQgbm90IHRoZWlyIG93bmVycylcbiAgICAgICAgLy8gLiQkdHlwZW9mIGFuZCAuX3N0b3JlIG9uIGp1c3QgcmVhc29uYWJsZSBtYXJrZXJzIG9mIGEgcmVhY3QgZWxlbWVudFxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFsbCBvdGhlciBwcm9wZXJ0aWVzIHNob3VsZCBiZSB0cmF2ZXJzZWQgYXMgdXN1YWxcbiAgICAgICAgaWYgKCFlcXVhbChhW2tleV0sIGJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZW5kIHJlYWN0LWZhc3QtY29tcGFyZVxuXG4gICAgLy8gZmFzdC1kZWVwLWVxdWFsIGluZGV4LmpzIDIuMC4xXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gYSAhPT0gYSAmJiBiICE9PSBiO1xufVxuLy8gZW5kIGZhc3QtZGVlcC1lcXVhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4cG9ydGVkRXF1YWwoYSwgYikge1xuICB0cnkge1xuICAgIHJldHVybiBlcXVhbChhLCBiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoKGVycm9yLm1lc3NhZ2UgJiYgZXJyb3IubWVzc2FnZS5tYXRjaCgvc3RhY2t8cmVjdXJzaW9uL2kpKSB8fCAoZXJyb3IubnVtYmVyID09PSAtMjE0NjgyODI2MCkpIHtcbiAgICAgIC8vIHdhcm4gb24gY2lyY3VsYXIgcmVmZXJlbmNlcywgZG9uJ3QgY3Jhc2hcbiAgICAgIC8vIGJyb3dzZXJzIGdpdmUgdGhpcyBkaWZmZXJlbnQgZXJyb3JzIG5hbWUgYW5kIG1lc3NhZ2VzOlxuICAgICAgLy8gY2hyb21lL3NhZmFyaTogXCJSYW5nZUVycm9yXCIsIFwiTWF4aW11bSBjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIlxuICAgICAgLy8gZmlyZWZveDogXCJJbnRlcm5hbEVycm9yXCIsIHRvbyBtdWNoIHJlY3Vyc2lvblwiXG4gICAgICAvLyBlZGdlOiBcIkVycm9yXCIsIFwiT3V0IG9mIHN0YWNrIHNwYWNlXCJcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogcmVhY3QtZmFzdC1jb21wYXJlIGRvZXMgbm90IGhhbmRsZSBjaXJjdWxhciByZWZlcmVuY2VzLicsIGVycm9yLm5hbWUsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBzb21lIG90aGVyIGVycm9yLiB3ZSBzaG91bGQgZGVmaW5pdGVseSBrbm93IGFib3V0IHRoZXNlXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG4iLCJ2YXIgaXNNZXJnZWFibGVPYmplY3QgPSBmdW5jdGlvbiBpc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gaXNOb25OdWxsT2JqZWN0KHZhbHVlKVxuXHRcdCYmICFpc1NwZWNpYWwodmFsdWUpXG59O1xuXG5mdW5jdGlvbiBpc05vbk51bGxPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xufVxuXG5mdW5jdGlvbiBpc1NwZWNpYWwodmFsdWUpIHtcblx0dmFyIHN0cmluZ1ZhbHVlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcblxuXHRyZXR1cm4gc3RyaW5nVmFsdWUgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXG5cdFx0fHwgc3RyaW5nVmFsdWUgPT09ICdbb2JqZWN0IERhdGVdJ1xuXHRcdHx8IGlzUmVhY3RFbGVtZW50KHZhbHVlKVxufVxuXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvYjVhYzk2M2ZiNzkxZDEyOThlN2YzOTYyMzYzODNiYzk1NWY5MTZjMS9zcmMvaXNvbW9ycGhpYy9jbGFzc2ljL2VsZW1lbnQvUmVhY3RFbGVtZW50LmpzI0wyMS1MMjVcbnZhciBjYW5Vc2VTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gY2FuVXNlU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xuXG5mdW5jdGlvbiBpc1JlYWN0RWxlbWVudCh2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRVxufVxuXG5mdW5jdGlvbiBlbXB0eVRhcmdldCh2YWwpIHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IFtdIDoge31cbn1cblxuZnVuY3Rpb24gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodmFsdWUsIG9wdGlvbnMpIHtcblx0cmV0dXJuIChvcHRpb25zLmNsb25lICE9PSBmYWxzZSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSlcblx0XHQ/IGRlZXBtZXJnZShlbXB0eVRhcmdldCh2YWx1ZSksIHZhbHVlLCBvcHRpb25zKVxuXHRcdDogdmFsdWVcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0cmV0dXJuIHRhcmdldC5jb25jYXQoc291cmNlKS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChlbGVtZW50LCBvcHRpb25zKVxuXHR9KVxufVxuXG5mdW5jdGlvbiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHR2YXIgZGVzdGluYXRpb24gPSB7fTtcblx0aWYgKG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodGFyZ2V0KSkge1xuXHRcdE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cblx0T2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmICghb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkgfHwgIXRhcmdldFtrZXldKSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gZGVlcG1lcmdlKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGRlc3RpbmF0aW9uXG59XG5cbmZ1bmN0aW9uIGRlZXBtZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hcnJheU1lcmdlID0gb3B0aW9ucy5hcnJheU1lcmdlIHx8IGRlZmF1bHRBcnJheU1lcmdlO1xuXHRvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0ID0gb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCB8fCBpc01lcmdlYWJsZU9iamVjdDtcblxuXHR2YXIgc291cmNlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoc291cmNlKTtcblx0dmFyIHRhcmdldElzQXJyYXkgPSBBcnJheS5pc0FycmF5KHRhcmdldCk7XG5cdHZhciBzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoID0gc291cmNlSXNBcnJheSA9PT0gdGFyZ2V0SXNBcnJheTtcblxuXHRpZiAoIXNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2gpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2UgaWYgKHNvdXJjZUlzQXJyYXkpIHtcblx0XHRyZXR1cm4gb3B0aW9ucy5hcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fVxufVxuXG5kZWVwbWVyZ2UuYWxsID0gZnVuY3Rpb24gZGVlcG1lcmdlQWxsKGFycmF5LCBvcHRpb25zKSB7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSBhbiBhcnJheScpXG5cdH1cblxuXHRyZXR1cm4gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKHByZXYsIG5leHQpIHtcblx0XHRyZXR1cm4gZGVlcG1lcmdlKHByZXYsIG5leHQsIG9wdGlvbnMpXG5cdH0sIHt9KVxufTtcblxudmFyIGRlZXBtZXJnZV8xID0gZGVlcG1lcmdlO1xuXG5leHBvcnQgZGVmYXVsdCBkZWVwbWVyZ2VfMTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbmV4cG9ydCBkZWZhdWx0IGZyZWVHbG9iYWw7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5leHBvcnQgZGVmYXVsdCBTeW1ib2w7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuaW1wb3J0IGdldFJhd1RhZyBmcm9tICcuL19nZXRSYXdUYWcuanMnO1xuaW1wb3J0IG9iamVjdFRvU3RyaW5nIGZyb20gJy4vX29iamVjdFRvU3RyaW5nLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VHZXRUYWc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb3ZlckFyZztcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJvdG90eXBlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0TGlrZTtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGdldFByb3RvdHlwZSBmcm9tICcuL19nZXRQcm90b3R5cGUuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGluZmVyIHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3Rvci4gKi9cbnZhciBvYmplY3RDdG9yU3RyaW5nID0gZnVuY1RvU3RyaW5nLmNhbGwoT2JqZWN0KTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjguMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgfHwgYmFzZUdldFRhZyh2YWx1ZSkgIT0gb2JqZWN0VGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwcm90byA9IGdldFByb3RvdHlwZSh2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBDdG9yID0gaGFzT3duUHJvcGVydHkuY2FsbChwcm90bywgJ2NvbnN0cnVjdG9yJykgJiYgcHJvdG8uY29uc3RydWN0b3I7XG4gIHJldHVybiB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IgaW5zdGFuY2VvZiBDdG9yICYmXG4gICAgZnVuY1RvU3RyaW5nLmNhbGwoQ3RvcikgPT0gb2JqZWN0Q3RvclN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNQbGFpbk9iamVjdDtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXE7XG4iLCJpbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc29jSW5kZXhPZjtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVEZWxldGU7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUdldDtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUhhcztcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVTZXQ7XG4iLCJpbXBvcnQgbGlzdENhY2hlQ2xlYXIgZnJvbSAnLi9fbGlzdENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IGxpc3RDYWNoZURlbGV0ZSBmcm9tICcuL19saXN0Q2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUdldCBmcm9tICcuL19saXN0Q2FjaGVHZXQuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUhhcyBmcm9tICcuL19saXN0Q2FjaGVIYXMuanMnO1xuaW1wb3J0IGxpc3RDYWNoZVNldCBmcm9tICcuL19saXN0Q2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RDYWNoZTtcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhY2tIYXM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNGdW5jdGlvbjtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5leHBvcnQgZGVmYXVsdCBjb3JlSnNEYXRhO1xuIiwiaW1wb3J0IGNvcmVKc0RhdGEgZnJvbSAnLi9fY29yZUpzRGF0YS5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b1NvdXJjZTtcbiIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNNYXNrZWQgZnJvbSAnLi9faXNNYXNrZWQuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IHRvU291cmNlIGZyb20gJy4vX3RvU291cmNlLmpzJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzTmF0aXZlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFZhbHVlO1xuIiwiaW1wb3J0IGJhc2VJc05hdGl2ZSBmcm9tICcuL19iYXNlSXNOYXRpdmUuanMnO1xuaW1wb3J0IGdldFZhbHVlIGZyb20gJy4vX2dldFZhbHVlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TmF0aXZlO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5leHBvcnQgZGVmYXVsdCBNYXA7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUNyZWF0ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hEZWxldGU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEdldDtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoSGFzO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaFNldDtcbiIsImltcG9ydCBoYXNoQ2xlYXIgZnJvbSAnLi9faGFzaENsZWFyLmpzJztcbmltcG9ydCBoYXNoRGVsZXRlIGZyb20gJy4vX2hhc2hEZWxldGUuanMnO1xuaW1wb3J0IGhhc2hHZXQgZnJvbSAnLi9faGFzaEdldC5qcyc7XG5pbXBvcnQgaGFzaEhhcyBmcm9tICcuL19oYXNoSGFzLmpzJztcbmltcG9ydCBoYXNoU2V0IGZyb20gJy4vX2hhc2hTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuZXhwb3J0IGRlZmF1bHQgSGFzaDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5YWJsZTtcbiIsImltcG9ydCBpc0tleWFibGUgZnJvbSAnLi9faXNLZXlhYmxlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRNYXBEYXRhO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlR2V0O1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlSGFzO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVTZXQ7XG4iLCJpbXBvcnQgbWFwQ2FjaGVDbGVhciBmcm9tICcuL19tYXBDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBtYXBDYWNoZURlbGV0ZSBmcm9tICcuL19tYXBDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVHZXQgZnJvbSAnLi9fbWFwQ2FjaGVHZXQuanMnO1xuaW1wb3J0IG1hcENhY2hlSGFzIGZyb20gJy4vX21hcENhY2hlSGFzLmpzJztcbmltcG9ydCBtYXBDYWNoZVNldCBmcm9tICcuL19tYXBDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBNYXBDYWNoZTtcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcbmltcG9ydCBNYXBDYWNoZSBmcm9tICcuL19NYXBDYWNoZS5qcyc7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja1NldDtcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBzdGFja0NsZWFyIGZyb20gJy4vX3N0YWNrQ2xlYXIuanMnO1xuaW1wb3J0IHN0YWNrRGVsZXRlIGZyb20gJy4vX3N0YWNrRGVsZXRlLmpzJztcbmltcG9ydCBzdGFja0dldCBmcm9tICcuL19zdGFja0dldC5qcyc7XG5pbXBvcnQgc3RhY2tIYXMgZnJvbSAnLi9fc3RhY2tIYXMuanMnO1xuaW1wb3J0IHN0YWNrU2V0IGZyb20gJy4vX3N0YWNrU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBTdGFjaztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJyYXlFYWNoO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lUHJvcGVydHk7XG4iLCJpbXBvcnQgZGVmaW5lUHJvcGVydHkgZnJvbSAnLi9fZGVmaW5lUHJvcGVydHkuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlQXNzaWduVmFsdWU7XG4iLCJpbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc2lnblZhbHVlO1xuIiwiaW1wb3J0IGFzc2lnblZhbHVlIGZyb20gJy4vX2Fzc2lnblZhbHVlLmpzJztcbmltcG9ydCBiYXNlQXNzaWduVmFsdWUgZnJvbSAnLi9fYmFzZUFzc2lnblZhbHVlLmpzJztcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvcHlPYmplY3Q7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlVGltZXM7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNBcmd1bWVudHM7XG4iLCJpbXBvcnQgYmFzZUlzQXJndW1lbnRzIGZyb20gJy4vX2Jhc2VJc0FyZ3VtZW50cy5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXk7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0dWJGYWxzZTtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuaW1wb3J0IHN0dWJGYWxzZSBmcm9tICcuL3N0dWJGYWxzZS5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgaXNCdWZmZXI7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzSW5kZXg7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTGVuZ3RoO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNMZW5ndGggZnJvbSAnLi9pc0xlbmd0aC5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlVW5hcnk7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2UgYHV0aWwudHlwZXNgIGZvciBOb2RlLmpzIDEwKy5cbiAgICB2YXIgdHlwZXMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUucmVxdWlyZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUoJ3V0aWwnKS50eXBlcztcblxuICAgIGlmICh0eXBlcykge1xuICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cblxuICAgIC8vIExlZ2FjeSBgcHJvY2Vzcy5iaW5kaW5nKCd1dGlsJylgIGZvciBOb2RlLmpzIDwgMTAuXG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgbm9kZVV0aWw7XG4iLCJpbXBvcnQgYmFzZUlzVHlwZWRBcnJheSBmcm9tICcuL19iYXNlSXNUeXBlZEFycmF5LmpzJztcbmltcG9ydCBiYXNlVW5hcnkgZnJvbSAnLi9fYmFzZVVuYXJ5LmpzJztcbmltcG9ydCBub2RlVXRpbCBmcm9tICcuL19ub2RlVXRpbC5qcyc7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5leHBvcnQgZGVmYXVsdCBpc1R5cGVkQXJyYXk7XG4iLCJpbXBvcnQgYmFzZVRpbWVzIGZyb20gJy4vX2Jhc2VUaW1lcy5qcyc7XG5pbXBvcnQgaXNBcmd1bWVudHMgZnJvbSAnLi9pc0FyZ3VtZW50cy5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IGlzQnVmZmVyIGZyb20gJy4vaXNCdWZmZXIuanMnO1xuaW1wb3J0IGlzSW5kZXggZnJvbSAnLi9faXNJbmRleC5qcyc7XG5pbXBvcnQgaXNUeXBlZEFycmF5IGZyb20gJy4vaXNUeXBlZEFycmF5LmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcnJheUxpa2VLZXlzO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1Byb3RvdHlwZTtcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUtleXM7XG4iLCJpbXBvcnQgaXNQcm90b3R5cGUgZnJvbSAnLi9faXNQcm90b3R5cGUuanMnO1xuaW1wb3J0IG5hdGl2ZUtleXMgZnJvbSAnLi9fbmF0aXZlS2V5cy5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUtleXM7XG4iLCJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzTGVuZ3RoIGZyb20gJy4vaXNMZW5ndGguanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNBcnJheUxpa2U7XG4iLCJpbXBvcnQgYXJyYXlMaWtlS2V5cyBmcm9tICcuL19hcnJheUxpa2VLZXlzLmpzJztcbmltcG9ydCBiYXNlS2V5cyBmcm9tICcuL19iYXNlS2V5cy5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXlzO1xuIiwiaW1wb3J0IGNvcHlPYmplY3QgZnJvbSAnLi9fY29weU9iamVjdC5qcyc7XG5pbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VBc3NpZ247XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlS2V5c0luO1xuIiwiaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IGlzUHJvdG90eXBlIGZyb20gJy4vX2lzUHJvdG90eXBlLmpzJztcbmltcG9ydCBuYXRpdmVLZXlzSW4gZnJvbSAnLi9fbmF0aXZlS2V5c0luLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUtleXNJbjtcbiIsImltcG9ydCBhcnJheUxpa2VLZXlzIGZyb20gJy4vX2FycmF5TGlrZUtleXMuanMnO1xuaW1wb3J0IGJhc2VLZXlzSW4gZnJvbSAnLi9fYmFzZUtleXNJbi5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXlzSW47XG4iLCJpbXBvcnQgY29weU9iamVjdCBmcm9tICcuL19jb3B5T2JqZWN0LmpzJztcbmltcG9ydCBrZXlzSW4gZnJvbSAnLi9rZXlzSW4uanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VBc3NpZ25JbjtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZUJ1ZmZlcjtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb3B5QXJyYXk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFycmF5RmlsdGVyO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R1YkFycmF5O1xuIiwiaW1wb3J0IGFycmF5RmlsdGVyIGZyb20gJy4vX2FycmF5RmlsdGVyLmpzJztcbmltcG9ydCBzdHViQXJyYXkgZnJvbSAnLi9zdHViQXJyYXkuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFN5bWJvbHM7XG4iLCJpbXBvcnQgY29weU9iamVjdCBmcm9tICcuL19jb3B5T2JqZWN0LmpzJztcbmltcG9ydCBnZXRTeW1ib2xzIGZyb20gJy4vX2dldFN5bWJvbHMuanMnO1xuXG4vKipcbiAqIENvcGllcyBvd24gc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvcHlTeW1ib2xzO1xuIiwiLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcnJheVB1c2g7XG4iLCJpbXBvcnQgYXJyYXlQdXNoIGZyb20gJy4vX2FycmF5UHVzaC5qcyc7XG5pbXBvcnQgZ2V0UHJvdG90eXBlIGZyb20gJy4vX2dldFByb3RvdHlwZS5qcyc7XG5pbXBvcnQgZ2V0U3ltYm9scyBmcm9tICcuL19nZXRTeW1ib2xzLmpzJztcbmltcG9ydCBzdHViQXJyYXkgZnJvbSAnLi9zdHViQXJyYXkuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzSW4gPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlIChvYmplY3QpIHtcbiAgICBhcnJheVB1c2gocmVzdWx0LCBnZXRTeW1ib2xzKG9iamVjdCkpO1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZShvYmplY3QpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRTeW1ib2xzSW47XG4iLCJpbXBvcnQgY29weU9iamVjdCBmcm9tICcuL19jb3B5T2JqZWN0LmpzJztcbmltcG9ydCBnZXRTeW1ib2xzSW4gZnJvbSAnLi9fZ2V0U3ltYm9sc0luLmpzJztcblxuLyoqXG4gKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHNJbihzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb3B5U3ltYm9sc0luO1xuIiwiaW1wb3J0IGFycmF5UHVzaCBmcm9tICcuL19hcnJheVB1c2guanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlR2V0QWxsS2V5cztcbiIsImltcG9ydCBiYXNlR2V0QWxsS2V5cyBmcm9tICcuL19iYXNlR2V0QWxsS2V5cy5qcyc7XG5pbXBvcnQgZ2V0U3ltYm9scyBmcm9tICcuL19nZXRTeW1ib2xzLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFsbEtleXM7XG4iLCJpbXBvcnQgYmFzZUdldEFsbEtleXMgZnJvbSAnLi9fYmFzZUdldEFsbEtleXMuanMnO1xuaW1wb3J0IGdldFN5bWJvbHNJbiBmcm9tICcuL19nZXRTeW1ib2xzSW4uanMnO1xuaW1wb3J0IGtleXNJbiBmcm9tICcuL2tleXNJbi5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzSW4sIGdldFN5bWJvbHNJbik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFsbEtleXNJbjtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcbmltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFWaWV3O1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IFByb21pc2U7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5pbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldDtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcbmltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5leHBvcnQgZGVmYXVsdCBXZWFrTWFwO1xuIiwiaW1wb3J0IERhdGFWaWV3IGZyb20gJy4vX0RhdGFWaWV3LmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4vX1Byb21pc2UuanMnO1xuaW1wb3J0IFNldCBmcm9tICcuL19TZXQuanMnO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLi9fV2Vha01hcC5qcyc7XG5pbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCB0b1NvdXJjZSBmcm9tICcuL190b1NvdXJjZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBuZXcgYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRDbG9uZUFycmF5O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IFVpbnQ4QXJyYXk7XG4iLCJpbXBvcnQgVWludDhBcnJheSBmcm9tICcuL19VaW50OEFycmF5LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZUFycmF5QnVmZmVyO1xuIiwiaW1wb3J0IGNsb25lQXJyYXlCdWZmZXIgZnJvbSAnLi9fY2xvbmVBcnJheUJ1ZmZlci5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsb25lRGF0YVZpZXc7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZVJlZ0V4cDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZVN5bWJvbDtcbiIsImltcG9ydCBjbG9uZUFycmF5QnVmZmVyIGZyb20gJy4vX2Nsb25lQXJyYXlCdWZmZXIuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZVR5cGVkQXJyYXk7XG4iLCJpbXBvcnQgY2xvbmVBcnJheUJ1ZmZlciBmcm9tICcuL19jbG9uZUFycmF5QnVmZmVyLmpzJztcbmltcG9ydCBjbG9uZURhdGFWaWV3IGZyb20gJy4vX2Nsb25lRGF0YVZpZXcuanMnO1xuaW1wb3J0IGNsb25lUmVnRXhwIGZyb20gJy4vX2Nsb25lUmVnRXhwLmpzJztcbmltcG9ydCBjbG9uZVN5bWJvbCBmcm9tICcuL19jbG9uZVN5bWJvbC5qcyc7XG5pbXBvcnQgY2xvbmVUeXBlZEFycmF5IGZyb20gJy4vX2Nsb25lVHlwZWRBcnJheS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBNYXBgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIGBTZXRgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVCeVRhZyhvYmplY3QsIHRhZywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICByZXR1cm4gY2xvbmVEYXRhVmlldyhvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVSZWdFeHAob2JqZWN0KTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yO1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTeW1ib2wob2JqZWN0KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0Q2xvbmVCeVRhZztcbiIsImltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgYmFzZUNyZWF0ZTtcbiIsImltcG9ydCBiYXNlQ3JlYXRlIGZyb20gJy4vX2Jhc2VDcmVhdGUuanMnO1xuaW1wb3J0IGdldFByb3RvdHlwZSBmcm9tICcuL19nZXRQcm90b3R5cGUuanMnO1xuaW1wb3J0IGlzUHJvdG90eXBlIGZyb20gJy4vX2lzUHJvdG90eXBlLmpzJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0Q2xvbmVPYmplY3Q7XG4iLCJpbXBvcnQgZ2V0VGFnIGZyb20gJy4vX2dldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWFwYCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXAodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBtYXBUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc01hcDtcbiIsImltcG9ydCBiYXNlSXNNYXAgZnJvbSAnLi9fYmFzZUlzTWFwLmpzJztcbmltcG9ydCBiYXNlVW5hcnkgZnJvbSAnLi9fYmFzZVVuYXJ5LmpzJztcbmltcG9ydCBub2RlVXRpbCBmcm9tICcuL19ub2RlVXRpbC5qcyc7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzTWFwID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNNYXA7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBNYXBgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTWFwKG5ldyBNYXApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNNYXAobmV3IFdlYWtNYXApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzTWFwID0gbm9kZUlzTWFwID8gYmFzZVVuYXJ5KG5vZGVJc01hcCkgOiBiYXNlSXNNYXA7XG5cbmV4cG9ydCBkZWZhdWx0IGlzTWFwO1xuIiwiaW1wb3J0IGdldFRhZyBmcm9tICcuL19nZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1NldGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzU2V0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gc2V0VGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNTZXQ7XG4iLCJpbXBvcnQgYmFzZUlzU2V0IGZyb20gJy4vX2Jhc2VJc1NldC5qcyc7XG5pbXBvcnQgYmFzZVVuYXJ5IGZyb20gJy4vX2Jhc2VVbmFyeS5qcyc7XG5pbXBvcnQgbm9kZVV0aWwgZnJvbSAnLi9fbm9kZVV0aWwuanMnO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBpc1NldDtcbiIsImltcG9ydCBTdGFjayBmcm9tICcuL19TdGFjay5qcyc7XG5pbXBvcnQgYXJyYXlFYWNoIGZyb20gJy4vX2FycmF5RWFjaC5qcyc7XG5pbXBvcnQgYXNzaWduVmFsdWUgZnJvbSAnLi9fYXNzaWduVmFsdWUuanMnO1xuaW1wb3J0IGJhc2VBc3NpZ24gZnJvbSAnLi9fYmFzZUFzc2lnbi5qcyc7XG5pbXBvcnQgYmFzZUFzc2lnbkluIGZyb20gJy4vX2Jhc2VBc3NpZ25Jbi5qcyc7XG5pbXBvcnQgY2xvbmVCdWZmZXIgZnJvbSAnLi9fY2xvbmVCdWZmZXIuanMnO1xuaW1wb3J0IGNvcHlBcnJheSBmcm9tICcuL19jb3B5QXJyYXkuanMnO1xuaW1wb3J0IGNvcHlTeW1ib2xzIGZyb20gJy4vX2NvcHlTeW1ib2xzLmpzJztcbmltcG9ydCBjb3B5U3ltYm9sc0luIGZyb20gJy4vX2NvcHlTeW1ib2xzSW4uanMnO1xuaW1wb3J0IGdldEFsbEtleXMgZnJvbSAnLi9fZ2V0QWxsS2V5cy5qcyc7XG5pbXBvcnQgZ2V0QWxsS2V5c0luIGZyb20gJy4vX2dldEFsbEtleXNJbi5qcyc7XG5pbXBvcnQgZ2V0VGFnIGZyb20gJy4vX2dldFRhZy5qcyc7XG5pbXBvcnQgaW5pdENsb25lQXJyYXkgZnJvbSAnLi9faW5pdENsb25lQXJyYXkuanMnO1xuaW1wb3J0IGluaXRDbG9uZUJ5VGFnIGZyb20gJy4vX2luaXRDbG9uZUJ5VGFnLmpzJztcbmltcG9ydCBpbml0Q2xvbmVPYmplY3QgZnJvbSAnLi9faW5pdENsb25lT2JqZWN0LmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5pbXBvcnQgaXNCdWZmZXIgZnJvbSAnLi9pc0J1ZmZlci5qcyc7XG5pbXBvcnQgaXNNYXAgZnJvbSAnLi9pc01hcC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgaXNTZXQgZnJvbSAnLi9pc1NldC5qcyc7XG5pbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnO1xuaW1wb3J0IGtleXNJbiBmcm9tICcuL2tleXNJbi5qcyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc01hcCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlQ2xvbmU7XG4iLCJpbXBvcnQgYmFzZUNsb25lIGZyb20gJy4vX2Jhc2VDbG9uZS5qcyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2hhbGxvdyBjbG9uZSBvZiBgdmFsdWVgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZVxuICogW3N0cnVjdHVyZWQgY2xvbmUgYWxnb3JpdGhtXShodHRwczovL21kbi5pby9TdHJ1Y3R1cmVkX2Nsb25lX2FsZ29yaXRobSlcbiAqIGFuZCBzdXBwb3J0cyBjbG9uaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsIGRhdGUgb2JqZWN0cywgbWFwcyxcbiAqIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZFxuICogYXJyYXlzLiBUaGUgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBgYXJndW1lbnRzYCBvYmplY3RzIGFyZSBjbG9uZWRcbiAqIGFzIHBsYWluIG9iamVjdHMuIEFuIGVtcHR5IG9iamVjdCBpcyByZXR1cm5lZCBmb3IgdW5jbG9uZWFibGUgdmFsdWVzIHN1Y2hcbiAqIGFzIGVycm9yIG9iamVjdHMsIGZ1bmN0aW9ucywgRE9NIG5vZGVzLCBhbmQgV2Vha01hcHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZURlZXBcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAnYSc6IDEgfSwgeyAnYic6IDIgfV07XG4gKlxuICogdmFyIHNoYWxsb3cgPSBfLmNsb25lKG9iamVjdHMpO1xuICogY29uc29sZS5sb2coc2hhbGxvd1swXSA9PT0gb2JqZWN0c1swXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNsb25lKHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIENMT05FX1NZTUJPTFNfRkxBRyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsb25lO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJyYXlNYXA7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzU3ltYm9sO1xuIiwiaW1wb3J0IE1hcENhY2hlIGZyb20gJy4vX01hcENhY2hlLmpzJztcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5leHBvcnQgZGVmYXVsdCBtZW1vaXplO1xuIiwiaW1wb3J0IG1lbW9pemUgZnJvbSAnLi9tZW1vaXplLmpzJztcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vaXplQ2FwcGVkO1xuIiwiaW1wb3J0IG1lbW9pemVDYXBwZWQgZnJvbSAnLi9fbWVtb2l6ZUNhcHBlZC5qcyc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoMCkgPT09IDQ2IC8qIC4gKi8pIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5nVG9QYXRoO1xuIiwiaW1wb3J0IGlzU3ltYm9sIGZyb20gJy4vaXNTeW1ib2wuanMnO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtzdHJpbmd8c3ltYm9sfSBSZXR1cm5zIHRoZSBrZXkuXG4gKi9cbmZ1bmN0aW9uIHRvS2V5KHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9LZXk7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5pbXBvcnQgYXJyYXlNYXAgZnJvbSAnLi9fYXJyYXlNYXAuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBpc1N5bWJvbCBmcm9tICcuL2lzU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHZhbHVlcyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVRvU3RyaW5nO1xuIiwiaW1wb3J0IGJhc2VUb1N0cmluZyBmcm9tICcuL19iYXNlVG9TdHJpbmcuanMnO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvU3RyaW5nO1xuIiwiaW1wb3J0IGFycmF5TWFwIGZyb20gJy4vX2FycmF5TWFwLmpzJztcbmltcG9ydCBjb3B5QXJyYXkgZnJvbSAnLi9fY29weUFycmF5LmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5pbXBvcnQgaXNTeW1ib2wgZnJvbSAnLi9pc1N5bWJvbC5qcyc7XG5pbXBvcnQgc3RyaW5nVG9QYXRoIGZyb20gJy4vX3N0cmluZ1RvUGF0aC5qcyc7XG5pbXBvcnQgdG9LZXkgZnJvbSAnLi9fdG9LZXkuanMnO1xuaW1wb3J0IHRvU3RyaW5nIGZyb20gJy4vdG9TdHJpbmcuanMnO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1BhdGgoJ2EuYi5jJyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ11cbiAqXG4gKiBfLnRvUGF0aCgnYVswXS5iLmMnKTtcbiAqIC8vID0+IFsnYScsICcwJywgJ2InLCAnYyddXG4gKi9cbmZ1bmN0aW9uIHRvUGF0aCh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIHRvS2V5KTtcbiAgfVxuICByZXR1cm4gaXNTeW1ib2wodmFsdWUpID8gW3ZhbHVlXSA6IGNvcHlBcnJheShzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvUGF0aDtcbiIsImltcG9ydCB7IENoaWxkcmVuLCBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlUmVkdWNlciwgdXNlQ2FsbGJhY2ssIHVzZU1lbW8sIHVzZUltcGVyYXRpdmVIYW5kbGUsIGNyZWF0ZUVsZW1lbnQsIHVzZUxheW91dEVmZmVjdCwgZm9yd2FyZFJlZiwgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGlzRXF1YWwgZnJvbSAncmVhY3QtZmFzdC1jb21wYXJlJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnZGVlcG1lcmdlJztcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2xvZGFzaC1lcy9pc1BsYWluT2JqZWN0JztcbmltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2gtZXMvY2xvbmUnO1xuaW1wb3J0IHRvUGF0aCBmcm9tICdsb2Rhc2gtZXMvdG9QYXRoJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAndGlueS13YXJuaW5nJztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC1lcy9jbG9uZURlZXAnO1xuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTtcbiAgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7XG4gIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307XG4gIHZhciB0YXJnZXQgPSB7fTtcbiAgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICB2YXIga2V5LCBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAga2V5ID0gc291cmNlS2V5c1tpXTtcbiAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG4vKiogQHByaXZhdGUgaXMgdGhlIHZhbHVlIGFuIGVtcHR5IGFycmF5PyAqL1xuXG52YXIgaXNFbXB0eUFycmF5ID0gZnVuY3Rpb24gaXNFbXB0eUFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDA7XG59O1xuLyoqIEBwcml2YXRlIGlzIHRoZSBnaXZlbiBvYmplY3QgYSBGdW5jdGlvbj8gKi9cblxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vKiogQHByaXZhdGUgaXMgdGhlIGdpdmVuIG9iamVjdCBhbiBPYmplY3Q/ICovXG5cbnZhciBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xufTtcbi8qKiBAcHJpdmF0ZSBpcyB0aGUgZ2l2ZW4gb2JqZWN0IGFuIGludGVnZXI/ICovXG5cbnZhciBpc0ludGVnZXIgPSBmdW5jdGlvbiBpc0ludGVnZXIob2JqKSB7XG4gIHJldHVybiBTdHJpbmcoTWF0aC5mbG9vcihOdW1iZXIob2JqKSkpID09PSBvYmo7XG59O1xuLyoqIEBwcml2YXRlIGlzIHRoZSBnaXZlbiBvYmplY3QgYSBzdHJpbmc/ICovXG5cbnZhciBpc1N0cmluZyA9IGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcbi8qKiBAcHJpdmF0ZSBpcyB0aGUgZ2l2ZW4gb2JqZWN0IGEgTmFOPyAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuXG52YXIgaXNOYU4kMSA9IGZ1bmN0aW9uIGlzTmFOKG9iaikge1xuICByZXR1cm4gb2JqICE9PSBvYmo7XG59O1xuLyoqIEBwcml2YXRlIERvZXMgYSBSZWFjdCBjb21wb25lbnQgaGF2ZSBleGFjdGx5IDAgY2hpbGRyZW4/ICovXG5cbnZhciBpc0VtcHR5Q2hpbGRyZW4gPSBmdW5jdGlvbiBpc0VtcHR5Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgcmV0dXJuIENoaWxkcmVuLmNvdW50KGNoaWxkcmVuKSA9PT0gMDtcbn07XG4vKiogQHByaXZhdGUgaXMgdGhlIGdpdmVuIG9iamVjdC92YWx1ZSBhIHByb21pc2U/ICovXG5cbnZhciBpc1Byb21pc2UgPSBmdW5jdGlvbiBpc1Byb21pc2UodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnRoZW4pO1xufTtcbi8qKiBAcHJpdmF0ZSBpcyB0aGUgZ2l2ZW4gb2JqZWN0L3ZhbHVlIGEgdHlwZSBvZiBzeW50aGV0aWMgZXZlbnQ/ICovXG5cbnZhciBpc0lucHV0RXZlbnQgPSBmdW5jdGlvbiBpc0lucHV0RXZlbnQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIGlzT2JqZWN0KHZhbHVlKSAmJiBpc09iamVjdCh2YWx1ZS50YXJnZXQpO1xufTtcbi8qKlxyXG4gKiBTYW1lIGFzIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYnV0IHdyYXBzIGluIGEgdHJ5LWNhdGNoIGJsb2NrLiBJbiBJRSBpdCBpc1xyXG4gKiBub3Qgc2FmZSB0byBjYWxsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaWYgdGhlcmUgaXMgbm90aGluZyBmb2N1c2VkLlxyXG4gKlxyXG4gKiBUaGUgYWN0aXZlRWxlbWVudCB3aWxsIGJlIG51bGwgb25seSBpZiB0aGUgZG9jdW1lbnQgb3IgZG9jdW1lbnQgYm9keSBpcyBub3RcclxuICogeWV0IGRlZmluZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7P0RvY3VtZW50fSBkb2MgRGVmYXVsdHMgdG8gY3VycmVudCBkb2N1bWVudC5cclxuICogQHJldHVybiB7RWxlbWVudCB8IG51bGx9XHJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2ZianMvYmxvYi9tYXN0ZXIvcGFja2FnZXMvZmJqcy9zcmMvY29yZS9kb20vZ2V0QWN0aXZlRWxlbWVudC5qc1xyXG4gKi9cblxuZnVuY3Rpb24gZ2V0QWN0aXZlRWxlbWVudChkb2MpIHtcbiAgZG9jID0gZG9jIHx8ICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQgOiB1bmRlZmluZWQpO1xuXG4gIGlmICh0eXBlb2YgZG9jID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZG9jLmFjdGl2ZUVsZW1lbnQgfHwgZG9jLmJvZHk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZG9jLmJvZHk7XG4gIH1cbn1cbi8qKlxyXG4gKiBEZWVwbHkgZ2V0IGEgdmFsdWUgZnJvbSBhbiBvYmplY3QgdmlhIGl0cyBwYXRoLlxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0SW4ob2JqLCBrZXksIGRlZiwgcCkge1xuICBpZiAocCA9PT0gdm9pZCAwKSB7XG4gICAgcCA9IDA7XG4gIH1cblxuICB2YXIgcGF0aCA9IHRvUGF0aChrZXkpO1xuXG4gIHdoaWxlIChvYmogJiYgcCA8IHBhdGgubGVuZ3RoKSB7XG4gICAgb2JqID0gb2JqW3BhdGhbcCsrXV07XG4gIH1cblxuICByZXR1cm4gb2JqID09PSB1bmRlZmluZWQgPyBkZWYgOiBvYmo7XG59XG4vKipcclxuICogRGVlcGx5IHNldCBhIHZhbHVlIGZyb20gaW4gb2JqZWN0IHZpYSBpdCdzIHBhdGguIElmIHRoZSB2YWx1ZSBhdCBgcGF0aGBcclxuICogaGFzIGNoYW5nZWQsIHJldHVybiBhIHNoYWxsb3cgY29weSBvZiBvYmogd2l0aCBgdmFsdWVgIHNldCBhdCBgcGF0aGAuXHJcbiAqIElmIGB2YWx1ZWAgaGFzIG5vdCBjaGFuZ2VkLCByZXR1cm4gdGhlIG9yaWdpbmFsIGBvYmpgLlxyXG4gKlxyXG4gKiBFeGlzdGluZyBvYmplY3RzIC8gYXJyYXlzIGFsb25nIGBwYXRoYCBhcmUgYWxzbyBzaGFsbG93IGNvcGllZC4gU2libGluZ1xyXG4gKiBvYmplY3RzIGFsb25nIHBhdGggcmV0YWluIHRoZSBzYW1lIGludGVybmFsIGpzIHJlZmVyZW5jZS4gU2luY2UgbmV3XHJcbiAqIG9iamVjdHMgLyBhcnJheXMgYXJlIG9ubHkgY3JlYXRlZCBhbG9uZyBgcGF0aGAsIHdlIGNhbiB0ZXN0IGlmIGFueXRoaW5nXHJcbiAqIGNoYW5nZWQgaW4gYSBuZXN0ZWQgc3RydWN0dXJlIGJ5IGNvbXBhcmluZyB0aGUgb2JqZWN0J3MgcmVmZXJlbmNlIGluXHJcbiAqIHRoZSBvbGQgYW5kIG5ldyBvYmplY3QsIHNpbWlsYXIgdG8gaG93IHJ1c3NpYW4gZG9sbCBjYWNoZSBpbnZhbGlkYXRpb25cclxuICogd29ya3MuXHJcbiAqXHJcbiAqIEluIGVhcmxpZXIgdmVyc2lvbnMgb2YgdGhpcyBmdW5jdGlvbiwgd2hpY2ggdXNlZCBjbG9uZURlZXAsIHRoZXJlIHdlcmVcclxuICogaXNzdWVzIHdoZXJlYnkgc2V0dGluZ3MgYSBuZXN0ZWQgdmFsdWUgd291bGQgbXV0YXRlIHRoZSBwYXJlbnRcclxuICogaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3QuIGBjbG9uZWAgYXZvaWRzIHRoYXQgYnVnIG1ha2luZyBhXHJcbiAqIHNoYWxsb3cgY29weSBvZiB0aGUgb2JqZWN0cyBhbG9uZyB0aGUgdXBkYXRlIHBhdGhcclxuICogc28gbm8gb2JqZWN0IGlzIG11dGF0ZWQgaW4gcGxhY2UuXHJcbiAqXHJcbiAqIEJlZm9yZSBjaGFuZ2luZyB0aGlzIGZ1bmN0aW9uLCBwbGVhc2UgcmVhZCB0aHJvdWdoIHRoZSBmb2xsb3dpbmdcclxuICogZGlzY3Vzc2lvbnMuXHJcbiAqXHJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RldmVsb3BpdC9saW5rc3RhdGVcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vamFyZWRwYWxtZXIvZm9ybWlrL3B1bGwvMTIzXHJcbiAqL1xuXG5mdW5jdGlvbiBzZXRJbihvYmosIHBhdGgsIHZhbHVlKSB7XG4gIHZhciByZXMgPSBjbG9uZShvYmopOyAvLyB0aGlzIGtlZXBzIGluaGVyaXRhbmNlIHdoZW4gb2JqIGlzIGEgY2xhc3NcblxuICB2YXIgcmVzVmFsID0gcmVzO1xuICB2YXIgaSA9IDA7XG4gIHZhciBwYXRoQXJyYXkgPSB0b1BhdGgocGF0aCk7XG5cbiAgZm9yICg7IGkgPCBwYXRoQXJyYXkubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gcGF0aEFycmF5W2ldO1xuICAgIHZhciBjdXJyZW50T2JqID0gZ2V0SW4ob2JqLCBwYXRoQXJyYXkuc2xpY2UoMCwgaSArIDEpKTtcblxuICAgIGlmIChjdXJyZW50T2JqICYmIChpc09iamVjdChjdXJyZW50T2JqKSB8fCBBcnJheS5pc0FycmF5KGN1cnJlbnRPYmopKSkge1xuICAgICAgcmVzVmFsID0gcmVzVmFsW2N1cnJlbnRQYXRoXSA9IGNsb25lKGN1cnJlbnRPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmV4dFBhdGggPSBwYXRoQXJyYXlbaSArIDFdO1xuICAgICAgcmVzVmFsID0gcmVzVmFsW2N1cnJlbnRQYXRoXSA9IGlzSW50ZWdlcihuZXh0UGF0aCkgJiYgTnVtYmVyKG5leHRQYXRoKSA+PSAwID8gW10gOiB7fTtcbiAgICB9XG4gIH0gLy8gUmV0dXJuIG9yaWdpbmFsIG9iamVjdCBpZiBuZXcgdmFsdWUgaXMgdGhlIHNhbWUgYXMgY3VycmVudFxuXG5cbiAgaWYgKChpID09PSAwID8gb2JqIDogcmVzVmFsKVtwYXRoQXJyYXlbaV1dID09PSB2YWx1ZSkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGRlbGV0ZSByZXNWYWxbcGF0aEFycmF5W2ldXTtcbiAgfSBlbHNlIHtcbiAgICByZXNWYWxbcGF0aEFycmF5W2ldXSA9IHZhbHVlO1xuICB9IC8vIElmIHRoZSBwYXRoIGFycmF5IGhhcyBhIHNpbmdsZSBlbGVtZW50LCB0aGUgbG9vcCBkaWQgbm90IHJ1bi5cbiAgLy8gRGVsZXRpbmcgb24gYHJlc1ZhbGAgaGFkIG5vIGVmZmVjdCBpbiB0aGlzIHNjZW5hcmlvLCBzbyB3ZSBkZWxldGUgb24gdGhlIHJlc3VsdCBpbnN0ZWFkLlxuXG5cbiAgaWYgKGkgPT09IDAgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGRlbGV0ZSByZXNbcGF0aEFycmF5W2ldXTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59XG4vKipcclxuICogUmVjdXJzaXZlbHkgYSBzZXQgdGhlIHNhbWUgdmFsdWUgZm9yIGFsbCBrZXlzIGFuZCBhcnJheXMgbmVzdGVkIG9iamVjdCwgY2xvbmluZ1xyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcGFyYW0gdmlzaXRlZFxyXG4gKiBAcGFyYW0gcmVzcG9uc2VcclxuICovXG5cbmZ1bmN0aW9uIHNldE5lc3RlZE9iamVjdFZhbHVlcyhvYmplY3QsIHZhbHVlLCB2aXNpdGVkLCByZXNwb25zZSkge1xuICBpZiAodmlzaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgdmlzaXRlZCA9IG5ldyBXZWFrTWFwKCk7XG4gIH1cblxuICBpZiAocmVzcG9uc2UgPT09IHZvaWQgMCkge1xuICAgIHJlc3BvbnNlID0ge307XG4gIH1cblxuICBmb3IgKHZhciBfaSA9IDAsIF9PYmplY3Qka2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IF9pIDwgX09iamVjdCRrZXlzLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBrID0gX09iamVjdCRrZXlzW19pXTtcbiAgICB2YXIgdmFsID0gb2JqZWN0W2tdO1xuXG4gICAgaWYgKGlzT2JqZWN0KHZhbCkpIHtcbiAgICAgIGlmICghdmlzaXRlZC5nZXQodmFsKSkge1xuICAgICAgICB2aXNpdGVkLnNldCh2YWwsIHRydWUpOyAvLyBJbiBvcmRlciB0byBrZWVwIGFycmF5IHZhbHVlcyBjb25zaXN0ZW50IGZvciBib3RoIGRvdCBwYXRoICBhbmRcbiAgICAgICAgLy8gYnJhY2tldCBzeW50YXgsIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhpcyBpcyBhbiBhcnJheSBzbyB0aGF0XG4gICAgICAgIC8vIHRoaXMgd2lsbCBvdXRwdXQgIHsgZnJpZW5kczogW3RydWVdIH0gYW5kIG5vdCB7IGZyaWVuZHM6IHsgXCIwXCI6IHRydWUgfSB9XG5cbiAgICAgICAgcmVzcG9uc2Vba10gPSBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9O1xuICAgICAgICBzZXROZXN0ZWRPYmplY3RWYWx1ZXModmFsLCB2YWx1ZSwgdmlzaXRlZCwgcmVzcG9uc2Vba10pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZVtrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXNwb25zZTtcbn1cblxudmFyIEZvcm1pa0NvbnRleHQgPSAvKiNfX1BVUkVfXyovY3JlYXRlQ29udGV4dCh1bmRlZmluZWQpO1xudmFyIEZvcm1pa1Byb3ZpZGVyID0gRm9ybWlrQ29udGV4dC5Qcm92aWRlcjtcbnZhciBGb3JtaWtDb25zdW1lciA9IEZvcm1pa0NvbnRleHQuQ29uc3VtZXI7XG5mdW5jdGlvbiB1c2VGb3JtaWtDb250ZXh0KCkge1xuICB2YXIgZm9ybWlrID0gdXNlQ29udGV4dChGb3JtaWtDb250ZXh0KTtcbiAgISEhZm9ybWlrID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCBcIkZvcm1payBjb250ZXh0IGlzIHVuZGVmaW5lZCwgcGxlYXNlIHZlcmlmeSB5b3UgYXJlIGNhbGxpbmcgdXNlRm9ybWlrQ29udGV4dCgpIGFzIGNoaWxkIG9mIGEgPEZvcm1paz4gY29tcG9uZW50LlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gIHJldHVybiBmb3JtaWs7XG59XG5cbmZ1bmN0aW9uIGZvcm1pa1JlZHVjZXIoc3RhdGUsIG1zZykge1xuICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgY2FzZSAnU0VUX1ZBTFVFUyc6XG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG4gICAgICAgIHZhbHVlczogbXNnLnBheWxvYWRcbiAgICAgIH0pO1xuXG4gICAgY2FzZSAnU0VUX1RPVUNIRUQnOlxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICB0b3VjaGVkOiBtc2cucGF5bG9hZFxuICAgICAgfSk7XG5cbiAgICBjYXNlICdTRVRfRVJST1JTJzpcbiAgICAgIGlmIChpc0VxdWFsKHN0YXRlLmVycm9ycywgbXNnLnBheWxvYWQpKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICBlcnJvcnM6IG1zZy5wYXlsb2FkXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ1NFVF9TVEFUVVMnOlxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICBzdGF0dXM6IG1zZy5wYXlsb2FkXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ1NFVF9JU1NVQk1JVFRJTkcnOlxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICBpc1N1Ym1pdHRpbmc6IG1zZy5wYXlsb2FkXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ1NFVF9JU1ZBTElEQVRJTkcnOlxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICBpc1ZhbGlkYXRpbmc6IG1zZy5wYXlsb2FkXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ1NFVF9GSUVMRF9WQUxVRSc6XG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG4gICAgICAgIHZhbHVlczogc2V0SW4oc3RhdGUudmFsdWVzLCBtc2cucGF5bG9hZC5maWVsZCwgbXNnLnBheWxvYWQudmFsdWUpXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ1NFVF9GSUVMRF9UT1VDSEVEJzpcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcbiAgICAgICAgdG91Y2hlZDogc2V0SW4oc3RhdGUudG91Y2hlZCwgbXNnLnBheWxvYWQuZmllbGQsIG1zZy5wYXlsb2FkLnZhbHVlKVxuICAgICAgfSk7XG5cbiAgICBjYXNlICdTRVRfRklFTERfRVJST1InOlxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICBlcnJvcnM6IHNldEluKHN0YXRlLmVycm9ycywgbXNnLnBheWxvYWQuZmllbGQsIG1zZy5wYXlsb2FkLnZhbHVlKVxuICAgICAgfSk7XG5cbiAgICBjYXNlICdSRVNFVF9GT1JNJzpcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIG1zZy5wYXlsb2FkKTtcblxuICAgIGNhc2UgJ1NFVF9GT1JNSUtfU1RBVEUnOlxuICAgICAgcmV0dXJuIG1zZy5wYXlsb2FkKHN0YXRlKTtcblxuICAgIGNhc2UgJ1NVQk1JVF9BVFRFTVBUJzpcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIHtcbiAgICAgICAgdG91Y2hlZDogc2V0TmVzdGVkT2JqZWN0VmFsdWVzKHN0YXRlLnZhbHVlcywgdHJ1ZSksXG4gICAgICAgIGlzU3VibWl0dGluZzogdHJ1ZSxcbiAgICAgICAgc3VibWl0Q291bnQ6IHN0YXRlLnN1Ym1pdENvdW50ICsgMVxuICAgICAgfSk7XG5cbiAgICBjYXNlICdTVUJNSVRfRkFJTFVSRSc6XG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG4gICAgICAgIGlzU3VibWl0dGluZzogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgY2FzZSAnU1VCTUlUX1NVQ0NFU1MnOlxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwge1xuICAgICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlXG4gICAgICB9KTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn0gLy8gSW5pdGlhbCBlbXB0eSBzdGF0ZXMgLy8gb2JqZWN0c1xuXG5cbnZhciBlbXB0eUVycm9ycyA9IHt9O1xudmFyIGVtcHR5VG91Y2hlZCA9IHt9O1xuZnVuY3Rpb24gdXNlRm9ybWlrKF9yZWYpIHtcbiAgdmFyIF9yZWYkdmFsaWRhdGVPbkNoYW5nZSA9IF9yZWYudmFsaWRhdGVPbkNoYW5nZSxcbiAgICAgIHZhbGlkYXRlT25DaGFuZ2UgPSBfcmVmJHZhbGlkYXRlT25DaGFuZ2UgPT09IHZvaWQgMCA/IHRydWUgOiBfcmVmJHZhbGlkYXRlT25DaGFuZ2UsXG4gICAgICBfcmVmJHZhbGlkYXRlT25CbHVyID0gX3JlZi52YWxpZGF0ZU9uQmx1cixcbiAgICAgIHZhbGlkYXRlT25CbHVyID0gX3JlZiR2YWxpZGF0ZU9uQmx1ciA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9yZWYkdmFsaWRhdGVPbkJsdXIsXG4gICAgICBfcmVmJHZhbGlkYXRlT25Nb3VudCA9IF9yZWYudmFsaWRhdGVPbk1vdW50LFxuICAgICAgdmFsaWRhdGVPbk1vdW50ID0gX3JlZiR2YWxpZGF0ZU9uTW91bnQgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZiR2YWxpZGF0ZU9uTW91bnQsXG4gICAgICBpc0luaXRpYWxWYWxpZCA9IF9yZWYuaXNJbml0aWFsVmFsaWQsXG4gICAgICBfcmVmJGVuYWJsZVJlaW5pdGlhbGkgPSBfcmVmLmVuYWJsZVJlaW5pdGlhbGl6ZSxcbiAgICAgIGVuYWJsZVJlaW5pdGlhbGl6ZSA9IF9yZWYkZW5hYmxlUmVpbml0aWFsaSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcmVmJGVuYWJsZVJlaW5pdGlhbGksXG4gICAgICBvblN1Ym1pdCA9IF9yZWYub25TdWJtaXQsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgW1widmFsaWRhdGVPbkNoYW5nZVwiLCBcInZhbGlkYXRlT25CbHVyXCIsIFwidmFsaWRhdGVPbk1vdW50XCIsIFwiaXNJbml0aWFsVmFsaWRcIiwgXCJlbmFibGVSZWluaXRpYWxpemVcIiwgXCJvblN1Ym1pdFwiXSk7XG5cbiAgdmFyIHByb3BzID0gX2V4dGVuZHMoe1xuICAgIHZhbGlkYXRlT25DaGFuZ2U6IHZhbGlkYXRlT25DaGFuZ2UsXG4gICAgdmFsaWRhdGVPbkJsdXI6IHZhbGlkYXRlT25CbHVyLFxuICAgIHZhbGlkYXRlT25Nb3VudDogdmFsaWRhdGVPbk1vdW50LFxuICAgIG9uU3VibWl0OiBvblN1Ym1pdFxuICB9LCByZXN0KTtcblxuICB2YXIgaW5pdGlhbFZhbHVlcyA9IHVzZVJlZihwcm9wcy5pbml0aWFsVmFsdWVzKTtcbiAgdmFyIGluaXRpYWxFcnJvcnMgPSB1c2VSZWYocHJvcHMuaW5pdGlhbEVycm9ycyB8fCBlbXB0eUVycm9ycyk7XG4gIHZhciBpbml0aWFsVG91Y2hlZCA9IHVzZVJlZihwcm9wcy5pbml0aWFsVG91Y2hlZCB8fCBlbXB0eVRvdWNoZWQpO1xuICB2YXIgaW5pdGlhbFN0YXR1cyA9IHVzZVJlZihwcm9wcy5pbml0aWFsU3RhdHVzKTtcbiAgdmFyIGlzTW91bnRlZCA9IHVzZVJlZihmYWxzZSk7XG4gIHZhciBmaWVsZFJlZ2lzdHJ5ID0gdXNlUmVmKHt9KTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICEodHlwZW9mIGlzSW5pdGlhbFZhbGlkID09PSAndW5kZWZpbmVkJykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsICdpc0luaXRpYWxWYWxpZCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gZnV0dXJlIHZlcnNpb25zIG9mIEZvcm1pay4gUGxlYXNlIHVzZSBpbml0aWFsRXJyb3JzIG9yIHZhbGlkYXRlT25Nb3VudCBpbnN0ZWFkLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgfSwgW10pO1xuICB9XG5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpc01vdW50ZWQuY3VycmVudCA9IHRydWU7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlzTW91bnRlZC5jdXJyZW50ID0gZmFsc2U7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHZhciBfUmVhY3QkdXNlUmVkdWNlciA9IHVzZVJlZHVjZXIoZm9ybWlrUmVkdWNlciwge1xuICAgIHZhbHVlczogcHJvcHMuaW5pdGlhbFZhbHVlcyxcbiAgICBlcnJvcnM6IHByb3BzLmluaXRpYWxFcnJvcnMgfHwgZW1wdHlFcnJvcnMsXG4gICAgdG91Y2hlZDogcHJvcHMuaW5pdGlhbFRvdWNoZWQgfHwgZW1wdHlUb3VjaGVkLFxuICAgIHN0YXR1czogcHJvcHMuaW5pdGlhbFN0YXR1cyxcbiAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlLFxuICAgIGlzVmFsaWRhdGluZzogZmFsc2UsXG4gICAgc3VibWl0Q291bnQ6IDBcbiAgfSksXG4gICAgICBzdGF0ZSA9IF9SZWFjdCR1c2VSZWR1Y2VyWzBdLFxuICAgICAgZGlzcGF0Y2ggPSBfUmVhY3QkdXNlUmVkdWNlclsxXTtcblxuICB2YXIgcnVuVmFsaWRhdGVIYW5kbGVyID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHZhbHVlcywgZmllbGQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIG1heWJlUHJvbWlzZWRFcnJvcnMgPSBwcm9wcy52YWxpZGF0ZSh2YWx1ZXMsIGZpZWxkKTtcblxuICAgICAgaWYgKG1heWJlUHJvbWlzZWRFcnJvcnMgPT0gbnVsbCkge1xuICAgICAgICAvLyB1c2UgbG9vc2UgbnVsbCBjaGVjayBoZXJlIG9uIHB1cnBvc2VcbiAgICAgICAgcmVzb2x2ZShlbXB0eUVycm9ycyk7XG4gICAgICB9IGVsc2UgaWYgKGlzUHJvbWlzZShtYXliZVByb21pc2VkRXJyb3JzKSkge1xuICAgICAgICBtYXliZVByb21pc2VkRXJyb3JzLnRoZW4oZnVuY3Rpb24gKGVycm9ycykge1xuICAgICAgICAgIHJlc29sdmUoZXJyb3JzIHx8IGVtcHR5RXJyb3JzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGFjdHVhbEV4Y2VwdGlvbikge1xuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBBbiB1bmhhbmRsZWQgZXJyb3Igd2FzIGNhdWdodCBkdXJpbmcgdmFsaWRhdGlvbiBpbiA8Rm9ybWlrIHZhbGlkYXRlIC8+XCIsIGFjdHVhbEV4Y2VwdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVqZWN0KGFjdHVhbEV4Y2VwdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShtYXliZVByb21pc2VkRXJyb3JzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgW3Byb3BzLnZhbGlkYXRlXSk7XG4gIC8qKlxyXG4gICAqIFJ1biB2YWxpZGF0aW9uIGFnYWluc3QgYSBZdXAgc2NoZW1hIGFuZCBvcHRpb25hbGx5IHJ1biBhIGZ1bmN0aW9uIGlmIHN1Y2Nlc3NmdWxcclxuICAgKi9cblxuICB2YXIgcnVuVmFsaWRhdGlvblNjaGVtYSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh2YWx1ZXMsIGZpZWxkKSB7XG4gICAgdmFyIHZhbGlkYXRpb25TY2hlbWEgPSBwcm9wcy52YWxpZGF0aW9uU2NoZW1hO1xuICAgIHZhciBzY2hlbWEgPSBpc0Z1bmN0aW9uKHZhbGlkYXRpb25TY2hlbWEpID8gdmFsaWRhdGlvblNjaGVtYShmaWVsZCkgOiB2YWxpZGF0aW9uU2NoZW1hO1xuICAgIHZhciBwcm9taXNlID0gZmllbGQgJiYgc2NoZW1hLnZhbGlkYXRlQXQgPyBzY2hlbWEudmFsaWRhdGVBdChmaWVsZCwgdmFsdWVzKSA6IHZhbGlkYXRlWXVwU2NoZW1hKHZhbHVlcywgc2NoZW1hKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzb2x2ZShlbXB0eUVycm9ycyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIC8vIFl1cCB3aWxsIHRocm93IGEgdmFsaWRhdGlvbiBlcnJvciBpZiB2YWxpZGF0aW9uIGZhaWxzLiBXZSBjYXRjaCB0aG9zZSBhbmRcbiAgICAgICAgLy8gcmVzb2x2ZSB0aGVtIGludG8gRm9ybWlrIGVycm9ycy4gV2UgY2FuIHNuaWZmIGlmIHNvbWV0aGluZyBpcyBhIFl1cCBlcnJvclxuICAgICAgICAvLyBieSBjaGVja2luZyBlcnJvci5uYW1lLlxuICAgICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlbnNlL3l1cCN2YWxpZGF0aW9uZXJyb3JlcnJvcnMtc3RyaW5nLS1hcnJheXN0cmluZy12YWx1ZS1hbnktcGF0aC1zdHJpbmdcbiAgICAgICAgaWYgKGVyci5uYW1lID09PSAnVmFsaWRhdGlvbkVycm9yJykge1xuICAgICAgICAgIHJlc29sdmUoeXVwVG9Gb3JtRXJyb3JzKGVycikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFdlIHRocm93IGFueSBvdGhlciBlcnJvcnNcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogQW4gdW5oYW5kbGVkIGVycm9yIHdhcyBjYXVnaHQgZHVyaW5nIHZhbGlkYXRpb24gaW4gPEZvcm1payB2YWxpZGF0aW9uU2NoZW1hIC8+XCIsIGVycik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LCBbcHJvcHMudmFsaWRhdGlvblNjaGVtYV0pO1xuICB2YXIgcnVuU2luZ2xlRmllbGRMZXZlbFZhbGlkYXRpb24gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZmllbGQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShmaWVsZFJlZ2lzdHJ5LmN1cnJlbnRbZmllbGRdLnZhbGlkYXRlKHZhbHVlKSk7XG4gICAgfSk7XG4gIH0sIFtdKTtcbiAgdmFyIHJ1bkZpZWxkTGV2ZWxWYWxpZGF0aW9ucyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICB2YXIgZmllbGRLZXlzV2l0aFZhbGlkYXRpb24gPSBPYmplY3Qua2V5cyhmaWVsZFJlZ2lzdHJ5LmN1cnJlbnQpLmZpbHRlcihmdW5jdGlvbiAoZikge1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24oZmllbGRSZWdpc3RyeS5jdXJyZW50W2ZdLnZhbGlkYXRlKTtcbiAgICB9KTsgLy8gQ29uc3RydWN0IGFuIGFycmF5IHdpdGggYWxsIG9mIHRoZSBmaWVsZCB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdmFyIGZpZWxkVmFsaWRhdGlvbnMgPSBmaWVsZEtleXNXaXRoVmFsaWRhdGlvbi5sZW5ndGggPiAwID8gZmllbGRLZXlzV2l0aFZhbGlkYXRpb24ubWFwKGZ1bmN0aW9uIChmKSB7XG4gICAgICByZXR1cm4gcnVuU2luZ2xlRmllbGRMZXZlbFZhbGlkYXRpb24oZiwgZ2V0SW4odmFsdWVzLCBmKSk7XG4gICAgfSkgOiBbUHJvbWlzZS5yZXNvbHZlKCdET19OT1RfREVMRVRFX1lPVV9XSUxMX0JFX0ZJUkVEJyldOyAvLyB1c2Ugc3BlY2lhbCBjYXNlIDspXG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoZmllbGRWYWxpZGF0aW9ucykudGhlbihmdW5jdGlvbiAoZmllbGRFcnJvcnNMaXN0KSB7XG4gICAgICByZXR1cm4gZmllbGRFcnJvcnNMaXN0LnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3VyciwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGN1cnIgPT09ICdET19OT1RfREVMRVRFX1lPVV9XSUxMX0JFX0ZJUkVEJykge1xuICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnIpIHtcbiAgICAgICAgICBwcmV2ID0gc2V0SW4ocHJldiwgZmllbGRLZXlzV2l0aFZhbGlkYXRpb25baW5kZXhdLCBjdXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgfSwge30pO1xuICAgIH0pO1xuICB9LCBbcnVuU2luZ2xlRmllbGRMZXZlbFZhbGlkYXRpb25dKTsgLy8gUnVuIGFsbCB2YWxpZGF0aW9ucyBhbmQgcmV0dXJuIHRoZSByZXN1bHRcblxuICB2YXIgcnVuQWxsVmFsaWRhdGlvbnMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtydW5GaWVsZExldmVsVmFsaWRhdGlvbnModmFsdWVzKSwgcHJvcHMudmFsaWRhdGlvblNjaGVtYSA/IHJ1blZhbGlkYXRpb25TY2hlbWEodmFsdWVzKSA6IHt9LCBwcm9wcy52YWxpZGF0ZSA/IHJ1blZhbGlkYXRlSGFuZGxlcih2YWx1ZXMpIDoge31dKS50aGVuKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIGZpZWxkRXJyb3JzID0gX3JlZjJbMF0sXG4gICAgICAgICAgc2NoZW1hRXJyb3JzID0gX3JlZjJbMV0sXG4gICAgICAgICAgdmFsaWRhdGVFcnJvcnMgPSBfcmVmMlsyXTtcbiAgICAgIHZhciBjb21iaW5lZEVycm9ycyA9IGRlZXBtZXJnZS5hbGwoW2ZpZWxkRXJyb3JzLCBzY2hlbWFFcnJvcnMsIHZhbGlkYXRlRXJyb3JzXSwge1xuICAgICAgICBhcnJheU1lcmdlOiBhcnJheU1lcmdlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjb21iaW5lZEVycm9ycztcbiAgICB9KTtcbiAgfSwgW3Byb3BzLnZhbGlkYXRlLCBwcm9wcy52YWxpZGF0aW9uU2NoZW1hLCBydW5GaWVsZExldmVsVmFsaWRhdGlvbnMsIHJ1blZhbGlkYXRlSGFuZGxlciwgcnVuVmFsaWRhdGlvblNjaGVtYV0pOyAvLyBSdW4gYWxsIHZhbGlkYXRpb25zIG1ldGhvZHMgYW5kIHVwZGF0ZSBzdGF0ZSBhY2NvcmRpbmdseVxuXG4gIHZhciB2YWxpZGF0ZUZvcm1XaXRoSGlnaFByaW9yaXR5ID0gdXNlRXZlbnRDYWxsYmFjayhmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgaWYgKHZhbHVlcyA9PT0gdm9pZCAwKSB7XG4gICAgICB2YWx1ZXMgPSBzdGF0ZS52YWx1ZXM7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ1NFVF9JU1ZBTElEQVRJTkcnLFxuICAgICAgcGF5bG9hZDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBydW5BbGxWYWxpZGF0aW9ucyh2YWx1ZXMpLnRoZW4oZnVuY3Rpb24gKGNvbWJpbmVkRXJyb3JzKSB7XG4gICAgICBpZiAoISFpc01vdW50ZWQuY3VycmVudCkge1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogJ1NFVF9JU1ZBTElEQVRJTkcnLFxuICAgICAgICAgIHBheWxvYWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaXNFcXVhbChzdGF0ZS5lcnJvcnMsIGNvbWJpbmVkRXJyb3JzKSkge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdTRVRfRVJST1JTJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IGNvbWJpbmVkRXJyb3JzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbWJpbmVkRXJyb3JzO1xuICAgIH0pO1xuICB9KTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodmFsaWRhdGVPbk1vdW50ICYmIGlzTW91bnRlZC5jdXJyZW50ID09PSB0cnVlICYmIGlzRXF1YWwoaW5pdGlhbFZhbHVlcy5jdXJyZW50LCBwcm9wcy5pbml0aWFsVmFsdWVzKSkge1xuICAgICAgdmFsaWRhdGVGb3JtV2l0aEhpZ2hQcmlvcml0eShpbml0aWFsVmFsdWVzLmN1cnJlbnQpO1xuICAgIH1cbiAgfSwgW3ZhbGlkYXRlT25Nb3VudCwgdmFsaWRhdGVGb3JtV2l0aEhpZ2hQcmlvcml0eV0pO1xuICB2YXIgcmVzZXRGb3JtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5leHRTdGF0ZSkge1xuICAgIHZhciB2YWx1ZXMgPSBuZXh0U3RhdGUgJiYgbmV4dFN0YXRlLnZhbHVlcyA/IG5leHRTdGF0ZS52YWx1ZXMgOiBpbml0aWFsVmFsdWVzLmN1cnJlbnQ7XG4gICAgdmFyIGVycm9ycyA9IG5leHRTdGF0ZSAmJiBuZXh0U3RhdGUuZXJyb3JzID8gbmV4dFN0YXRlLmVycm9ycyA6IGluaXRpYWxFcnJvcnMuY3VycmVudCA/IGluaXRpYWxFcnJvcnMuY3VycmVudCA6IHByb3BzLmluaXRpYWxFcnJvcnMgfHwge307XG4gICAgdmFyIHRvdWNoZWQgPSBuZXh0U3RhdGUgJiYgbmV4dFN0YXRlLnRvdWNoZWQgPyBuZXh0U3RhdGUudG91Y2hlZCA6IGluaXRpYWxUb3VjaGVkLmN1cnJlbnQgPyBpbml0aWFsVG91Y2hlZC5jdXJyZW50IDogcHJvcHMuaW5pdGlhbFRvdWNoZWQgfHwge307XG4gICAgdmFyIHN0YXR1cyA9IG5leHRTdGF0ZSAmJiBuZXh0U3RhdGUuc3RhdHVzID8gbmV4dFN0YXRlLnN0YXR1cyA6IGluaXRpYWxTdGF0dXMuY3VycmVudCA/IGluaXRpYWxTdGF0dXMuY3VycmVudCA6IHByb3BzLmluaXRpYWxTdGF0dXM7XG4gICAgaW5pdGlhbFZhbHVlcy5jdXJyZW50ID0gdmFsdWVzO1xuICAgIGluaXRpYWxFcnJvcnMuY3VycmVudCA9IGVycm9ycztcbiAgICBpbml0aWFsVG91Y2hlZC5jdXJyZW50ID0gdG91Y2hlZDtcbiAgICBpbml0aWFsU3RhdHVzLmN1cnJlbnQgPSBzdGF0dXM7XG5cbiAgICB2YXIgZGlzcGF0Y2hGbiA9IGZ1bmN0aW9uIGRpc3BhdGNoRm4oKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6ICdSRVNFVF9GT1JNJyxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIGlzU3VibWl0dGluZzogISFuZXh0U3RhdGUgJiYgISFuZXh0U3RhdGUuaXNTdWJtaXR0aW5nLFxuICAgICAgICAgIGVycm9yczogZXJyb3JzLFxuICAgICAgICAgIHRvdWNoZWQ6IHRvdWNoZWQsXG4gICAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXG4gICAgICAgICAgaXNWYWxpZGF0aW5nOiAhIW5leHRTdGF0ZSAmJiAhIW5leHRTdGF0ZS5pc1ZhbGlkYXRpbmcsXG4gICAgICAgICAgc3VibWl0Q291bnQ6ICEhbmV4dFN0YXRlICYmICEhbmV4dFN0YXRlLnN1Ym1pdENvdW50ICYmIHR5cGVvZiBuZXh0U3RhdGUuc3VibWl0Q291bnQgPT09ICdudW1iZXInID8gbmV4dFN0YXRlLnN1Ym1pdENvdW50IDogMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKHByb3BzLm9uUmVzZXQpIHtcbiAgICAgIHZhciBtYXliZVByb21pc2VkT25SZXNldCA9IHByb3BzLm9uUmVzZXQoc3RhdGUudmFsdWVzLCBpbXBlcmF0aXZlTWV0aG9kcyk7XG5cbiAgICAgIGlmIChpc1Byb21pc2UobWF5YmVQcm9taXNlZE9uUmVzZXQpKSB7XG4gICAgICAgIG1heWJlUHJvbWlzZWRPblJlc2V0LnRoZW4oZGlzcGF0Y2hGbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwYXRjaEZuKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoRm4oKTtcbiAgICB9XG4gIH0sIFtwcm9wcy5pbml0aWFsRXJyb3JzLCBwcm9wcy5pbml0aWFsU3RhdHVzLCBwcm9wcy5pbml0aWFsVG91Y2hlZF0pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc01vdW50ZWQuY3VycmVudCA9PT0gdHJ1ZSAmJiAhaXNFcXVhbChpbml0aWFsVmFsdWVzLmN1cnJlbnQsIHByb3BzLmluaXRpYWxWYWx1ZXMpKSB7XG4gICAgICBpZiAoZW5hYmxlUmVpbml0aWFsaXplKSB7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMuY3VycmVudCA9IHByb3BzLmluaXRpYWxWYWx1ZXM7XG4gICAgICAgIHJlc2V0Rm9ybSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsaWRhdGVPbk1vdW50KSB7XG4gICAgICAgIHZhbGlkYXRlRm9ybVdpdGhIaWdoUHJpb3JpdHkoaW5pdGlhbFZhbHVlcy5jdXJyZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtlbmFibGVSZWluaXRpYWxpemUsIHByb3BzLmluaXRpYWxWYWx1ZXMsIHJlc2V0Rm9ybSwgdmFsaWRhdGVPbk1vdW50LCB2YWxpZGF0ZUZvcm1XaXRoSGlnaFByaW9yaXR5XSk7XG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGVuYWJsZVJlaW5pdGlhbGl6ZSAmJiBpc01vdW50ZWQuY3VycmVudCA9PT0gdHJ1ZSAmJiAhaXNFcXVhbChpbml0aWFsRXJyb3JzLmN1cnJlbnQsIHByb3BzLmluaXRpYWxFcnJvcnMpKSB7XG4gICAgICBpbml0aWFsRXJyb3JzLmN1cnJlbnQgPSBwcm9wcy5pbml0aWFsRXJyb3JzIHx8IGVtcHR5RXJyb3JzO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnU0VUX0VSUk9SUycsXG4gICAgICAgIHBheWxvYWQ6IHByb3BzLmluaXRpYWxFcnJvcnMgfHwgZW1wdHlFcnJvcnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW2VuYWJsZVJlaW5pdGlhbGl6ZSwgcHJvcHMuaW5pdGlhbEVycm9yc10pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChlbmFibGVSZWluaXRpYWxpemUgJiYgaXNNb3VudGVkLmN1cnJlbnQgPT09IHRydWUgJiYgIWlzRXF1YWwoaW5pdGlhbFRvdWNoZWQuY3VycmVudCwgcHJvcHMuaW5pdGlhbFRvdWNoZWQpKSB7XG4gICAgICBpbml0aWFsVG91Y2hlZC5jdXJyZW50ID0gcHJvcHMuaW5pdGlhbFRvdWNoZWQgfHwgZW1wdHlUb3VjaGVkO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnU0VUX1RPVUNIRUQnLFxuICAgICAgICBwYXlsb2FkOiBwcm9wcy5pbml0aWFsVG91Y2hlZCB8fCBlbXB0eVRvdWNoZWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW2VuYWJsZVJlaW5pdGlhbGl6ZSwgcHJvcHMuaW5pdGlhbFRvdWNoZWRdKTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZW5hYmxlUmVpbml0aWFsaXplICYmIGlzTW91bnRlZC5jdXJyZW50ID09PSB0cnVlICYmICFpc0VxdWFsKGluaXRpYWxTdGF0dXMuY3VycmVudCwgcHJvcHMuaW5pdGlhbFN0YXR1cykpIHtcbiAgICAgIGluaXRpYWxTdGF0dXMuY3VycmVudCA9IHByb3BzLmluaXRpYWxTdGF0dXM7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6ICdTRVRfU1RBVFVTJyxcbiAgICAgICAgcGF5bG9hZDogcHJvcHMuaW5pdGlhbFN0YXR1c1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBbZW5hYmxlUmVpbml0aWFsaXplLCBwcm9wcy5pbml0aWFsU3RhdHVzLCBwcm9wcy5pbml0aWFsVG91Y2hlZF0pO1xuICB2YXIgdmFsaWRhdGVGaWVsZCA9IHVzZUV2ZW50Q2FsbGJhY2soZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAvLyBUaGlzIHdpbGwgZWZmaWNpZW50bHkgdmFsaWRhdGUgYSBzaW5nbGUgZmllbGQgYnkgYXZvaWRpbmcgc3RhdGVcbiAgICAvLyBjaGFuZ2VzIGlmIHRoZSB2YWxpZGF0aW9uIGZ1bmN0aW9uIGlzIHN5bmNocm9ub3VzLiBJdCdzIGRpZmZlcmVudCBmcm9tXG4gICAgLy8gd2hhdCBpcyBjYWxsZWQgd2hlbiB1c2luZyB2YWxpZGF0ZUZvcm0uXG4gICAgaWYgKGZpZWxkUmVnaXN0cnkuY3VycmVudFtuYW1lXSAmJiBpc0Z1bmN0aW9uKGZpZWxkUmVnaXN0cnkuY3VycmVudFtuYW1lXS52YWxpZGF0ZSkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGdldEluKHN0YXRlLnZhbHVlcywgbmFtZSk7XG4gICAgICB2YXIgbWF5YmVQcm9taXNlID0gZmllbGRSZWdpc3RyeS5jdXJyZW50W25hbWVdLnZhbGlkYXRlKHZhbHVlKTtcblxuICAgICAgaWYgKGlzUHJvbWlzZShtYXliZVByb21pc2UpKSB7XG4gICAgICAgIC8vIE9ubHkgZmxpcCBpc1ZhbGlkYXRpbmcgaWYgdGhlIGZ1bmN0aW9uIGlzIGFzeW5jLlxuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogJ1NFVF9JU1ZBTElEQVRJTkcnLFxuICAgICAgICAgIHBheWxvYWQ6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXliZVByb21pc2UudGhlbihmdW5jdGlvbiAoeCkge1xuICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdTRVRfRklFTERfRVJST1InLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICBmaWVsZDogbmFtZSxcbiAgICAgICAgICAgICAgdmFsdWU6IGVycm9yXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogJ1NFVF9JU1ZBTElEQVRJTkcnLFxuICAgICAgICAgICAgcGF5bG9hZDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogJ1NFVF9GSUVMRF9FUlJPUicsXG4gICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgZmllbGQ6IG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogbWF5YmVQcm9taXNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtYXliZVByb21pc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJvcHMudmFsaWRhdGlvblNjaGVtYSkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnU0VUX0lTVkFMSURBVElORycsXG4gICAgICAgIHBheWxvYWQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJ1blZhbGlkYXRpb25TY2hlbWEoc3RhdGUudmFsdWVzLCBuYW1lKS50aGVuKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6ICdTRVRfRklFTERfRVJST1InLFxuICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgIGZpZWxkOiBuYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGVycm9yW25hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6ICdTRVRfSVNWQUxJREFUSU5HJyxcbiAgICAgICAgICBwYXlsb2FkOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSk7XG4gIHZhciByZWdpc3RlckZpZWxkID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5hbWUsIF9yZWYzKSB7XG4gICAgdmFyIHZhbGlkYXRlID0gX3JlZjMudmFsaWRhdGU7XG4gICAgZmllbGRSZWdpc3RyeS5jdXJyZW50W25hbWVdID0ge1xuICAgICAgdmFsaWRhdGU6IHZhbGlkYXRlXG4gICAgfTtcbiAgfSwgW10pO1xuICB2YXIgdW5yZWdpc3RlckZpZWxkID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBkZWxldGUgZmllbGRSZWdpc3RyeS5jdXJyZW50W25hbWVdO1xuICB9LCBbXSk7XG4gIHZhciBzZXRUb3VjaGVkID0gdXNlRXZlbnRDYWxsYmFjayhmdW5jdGlvbiAodG91Y2hlZCwgc2hvdWxkVmFsaWRhdGUpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnU0VUX1RPVUNIRUQnLFxuICAgICAgcGF5bG9hZDogdG91Y2hlZFxuICAgIH0pO1xuICAgIHZhciB3aWxsVmFsaWRhdGUgPSBzaG91bGRWYWxpZGF0ZSA9PT0gdW5kZWZpbmVkID8gdmFsaWRhdGVPbkJsdXIgOiBzaG91bGRWYWxpZGF0ZTtcbiAgICByZXR1cm4gd2lsbFZhbGlkYXRlID8gdmFsaWRhdGVGb3JtV2l0aEhpZ2hQcmlvcml0eShzdGF0ZS52YWx1ZXMpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH0pO1xuICB2YXIgc2V0RXJyb3JzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGVycm9ycykge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdTRVRfRVJST1JTJyxcbiAgICAgIHBheWxvYWQ6IGVycm9yc1xuICAgIH0pO1xuICB9LCBbXSk7XG4gIHZhciBzZXRWYWx1ZXMgPSB1c2VFdmVudENhbGxiYWNrKGZ1bmN0aW9uICh2YWx1ZXMsIHNob3VsZFZhbGlkYXRlKSB7XG4gICAgdmFyIHJlc29sdmVkVmFsdWVzID0gaXNGdW5jdGlvbih2YWx1ZXMpID8gdmFsdWVzKHN0YXRlLnZhbHVlcykgOiB2YWx1ZXM7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ1NFVF9WQUxVRVMnLFxuICAgICAgcGF5bG9hZDogcmVzb2x2ZWRWYWx1ZXNcbiAgICB9KTtcbiAgICB2YXIgd2lsbFZhbGlkYXRlID0gc2hvdWxkVmFsaWRhdGUgPT09IHVuZGVmaW5lZCA/IHZhbGlkYXRlT25DaGFuZ2UgOiBzaG91bGRWYWxpZGF0ZTtcbiAgICByZXR1cm4gd2lsbFZhbGlkYXRlID8gdmFsaWRhdGVGb3JtV2l0aEhpZ2hQcmlvcml0eShyZXNvbHZlZFZhbHVlcykgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSk7XG4gIHZhciBzZXRGaWVsZEVycm9yID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGZpZWxkLCB2YWx1ZSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdTRVRfRklFTERfRVJST1InLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9LCBbXSk7XG4gIHZhciBzZXRGaWVsZFZhbHVlID0gdXNlRXZlbnRDYWxsYmFjayhmdW5jdGlvbiAoZmllbGQsIHZhbHVlLCBzaG91bGRWYWxpZGF0ZSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdTRVRfRklFTERfVkFMVUUnLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciB3aWxsVmFsaWRhdGUgPSBzaG91bGRWYWxpZGF0ZSA9PT0gdW5kZWZpbmVkID8gdmFsaWRhdGVPbkNoYW5nZSA6IHNob3VsZFZhbGlkYXRlO1xuICAgIHJldHVybiB3aWxsVmFsaWRhdGUgPyB2YWxpZGF0ZUZvcm1XaXRoSGlnaFByaW9yaXR5KHNldEluKHN0YXRlLnZhbHVlcywgZmllbGQsIHZhbHVlKSkgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSk7XG4gIHZhciBleGVjdXRlQ2hhbmdlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50T3JUZXh0VmFsdWUsIG1heWJlUGF0aCkge1xuICAgIC8vIEJ5IGRlZmF1bHQsIGFzc3VtZSB0aGF0IHRoZSBmaXJzdCBhcmd1bWVudCBpcyBhIHN0cmluZy4gVGhpcyBhbGxvd3MgdXMgdG8gdXNlXG4gICAgLy8gaGFuZGxlQ2hhbmdlIHdpdGggUmVhY3QgTmF0aXZlIGFuZCBSZWFjdCBOYXRpdmUgV2ViJ3Mgb25DaGFuZ2VUZXh0IHByb3Agd2hpY2hcbiAgICAvLyBwcm92aWRlcyBqdXN0IHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuXG4gICAgdmFyIGZpZWxkID0gbWF5YmVQYXRoO1xuICAgIHZhciB2YWwgPSBldmVudE9yVGV4dFZhbHVlO1xuICAgIHZhciBwYXJzZWQ7IC8vIElmIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBub3QgYSBzdHJpbmcgdGhvdWdoLCBpdCBoYXMgdG8gYmUgYSBzeW50aGV0aWMgUmVhY3QgRXZlbnQgKG9yIGEgZmFrZSBvbmUpLFxuICAgIC8vIHNvIHdlIGhhbmRsZSBsaWtlIHdlIHdvdWxkIGEgbm9ybWFsIEhUTUwgY2hhbmdlIGV2ZW50LlxuXG4gICAgaWYgKCFpc1N0cmluZyhldmVudE9yVGV4dFZhbHVlKSkge1xuICAgICAgLy8gSWYgd2UgY2FuLCBwZXJzaXN0IHRoZSBldmVudFxuICAgICAgLy8gQHNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvZXZlbnRzLmh0bWwjZXZlbnQtcG9vbGluZ1xuICAgICAgaWYgKGV2ZW50T3JUZXh0VmFsdWUucGVyc2lzdCkge1xuICAgICAgICBldmVudE9yVGV4dFZhbHVlLnBlcnNpc3QoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50T3JUZXh0VmFsdWUudGFyZ2V0ID8gZXZlbnRPclRleHRWYWx1ZS50YXJnZXQgOiBldmVudE9yVGV4dFZhbHVlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICB2YXIgdHlwZSA9IHRhcmdldC50eXBlLFxuICAgICAgICAgIG5hbWUgPSB0YXJnZXQubmFtZSxcbiAgICAgICAgICBpZCA9IHRhcmdldC5pZCxcbiAgICAgICAgICB2YWx1ZSA9IHRhcmdldC52YWx1ZSxcbiAgICAgICAgICBjaGVja2VkID0gdGFyZ2V0LmNoZWNrZWQsXG4gICAgICAgICAgb3V0ZXJIVE1MID0gdGFyZ2V0Lm91dGVySFRNTCxcbiAgICAgICAgICBvcHRpb25zID0gdGFyZ2V0Lm9wdGlvbnMsXG4gICAgICAgICAgbXVsdGlwbGUgPSB0YXJnZXQubXVsdGlwbGU7XG4gICAgICBmaWVsZCA9IG1heWJlUGF0aCA/IG1heWJlUGF0aCA6IG5hbWUgPyBuYW1lIDogaWQ7XG5cbiAgICAgIGlmICghZmllbGQgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIHdhcm5BYm91dE1pc3NpbmdJZGVudGlmaWVyKHtcbiAgICAgICAgICBodG1sQ29udGVudDogb3V0ZXJIVE1MLFxuICAgICAgICAgIGRvY3VtZW50YXRpb25BbmNob3JMaW5rOiAnaGFuZGxlY2hhbmdlLWUtcmVhY3RjaGFuZ2VldmVudGFueS0tdm9pZCcsXG4gICAgICAgICAgaGFuZGxlck5hbWU6ICdoYW5kbGVDaGFuZ2UnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YWwgPSAvbnVtYmVyfHJhbmdlLy50ZXN0KHR5cGUpID8gKHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsdWUpLCBpc05hTihwYXJzZWQpID8gJycgOiBwYXJzZWQpIDogL2NoZWNrYm94Ly50ZXN0KHR5cGUpIC8vIGNoZWNrYm94ZXNcbiAgICAgID8gZ2V0VmFsdWVGb3JDaGVja2JveChnZXRJbihzdGF0ZS52YWx1ZXMsIGZpZWxkKSwgY2hlY2tlZCwgdmFsdWUpIDogISFtdWx0aXBsZSAvLyA8c2VsZWN0IG11bHRpcGxlPlxuICAgICAgPyBnZXRTZWxlY3RlZFZhbHVlcyhvcHRpb25zKSA6IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChmaWVsZCkge1xuICAgICAgLy8gU2V0IGZvcm0gZmllbGRzIGJ5IG5hbWVcbiAgICAgIHNldEZpZWxkVmFsdWUoZmllbGQsIHZhbCk7XG4gICAgfVxuICB9LCBbc2V0RmllbGRWYWx1ZSwgc3RhdGUudmFsdWVzXSk7XG4gIHZhciBoYW5kbGVDaGFuZ2UgPSB1c2VFdmVudENhbGxiYWNrKGZ1bmN0aW9uIChldmVudE9yUGF0aCkge1xuICAgIGlmIChpc1N0cmluZyhldmVudE9yUGF0aCkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVDaGFuZ2UoZXZlbnQsIGV2ZW50T3JQYXRoKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4ZWN1dGVDaGFuZ2UoZXZlbnRPclBhdGgpO1xuICAgIH1cbiAgfSk7XG4gIHZhciBzZXRGaWVsZFRvdWNoZWQgPSB1c2VFdmVudENhbGxiYWNrKGZ1bmN0aW9uIChmaWVsZCwgdG91Y2hlZCwgc2hvdWxkVmFsaWRhdGUpIHtcbiAgICBpZiAodG91Y2hlZCA9PT0gdm9pZCAwKSB7XG4gICAgICB0b3VjaGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnU0VUX0ZJRUxEX1RPVUNIRUQnLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgIHZhbHVlOiB0b3VjaGVkXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHdpbGxWYWxpZGF0ZSA9IHNob3VsZFZhbGlkYXRlID09PSB1bmRlZmluZWQgPyB2YWxpZGF0ZU9uQmx1ciA6IHNob3VsZFZhbGlkYXRlO1xuICAgIHJldHVybiB3aWxsVmFsaWRhdGUgPyB2YWxpZGF0ZUZvcm1XaXRoSGlnaFByaW9yaXR5KHN0YXRlLnZhbHVlcykgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSk7XG4gIHZhciBleGVjdXRlQmx1ciA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChlLCBwYXRoKSB7XG4gICAgaWYgKGUucGVyc2lzdCkge1xuICAgICAgZS5wZXJzaXN0KCk7XG4gICAgfVxuXG4gICAgdmFyIF9lJHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICBuYW1lID0gX2UkdGFyZ2V0Lm5hbWUsXG4gICAgICAgIGlkID0gX2UkdGFyZ2V0LmlkLFxuICAgICAgICBvdXRlckhUTUwgPSBfZSR0YXJnZXQub3V0ZXJIVE1MO1xuICAgIHZhciBmaWVsZCA9IHBhdGggPyBwYXRoIDogbmFtZSA/IG5hbWUgOiBpZDtcblxuICAgIGlmICghZmllbGQgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICB3YXJuQWJvdXRNaXNzaW5nSWRlbnRpZmllcih7XG4gICAgICAgIGh0bWxDb250ZW50OiBvdXRlckhUTUwsXG4gICAgICAgIGRvY3VtZW50YXRpb25BbmNob3JMaW5rOiAnaGFuZGxlYmx1ci1lLWFueS0tdm9pZCcsXG4gICAgICAgIGhhbmRsZXJOYW1lOiAnaGFuZGxlQmx1cidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldEZpZWxkVG91Y2hlZChmaWVsZCwgdHJ1ZSk7XG4gIH0sIFtzZXRGaWVsZFRvdWNoZWRdKTtcbiAgdmFyIGhhbmRsZUJsdXIgPSB1c2VFdmVudENhbGxiYWNrKGZ1bmN0aW9uIChldmVudE9yU3RyaW5nKSB7XG4gICAgaWYgKGlzU3RyaW5nKGV2ZW50T3JTdHJpbmcpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBleGVjdXRlQmx1cihldmVudCwgZXZlbnRPclN0cmluZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBleGVjdXRlQmx1cihldmVudE9yU3RyaW5nKTtcbiAgICB9XG4gIH0pO1xuICB2YXIgc2V0Rm9ybWlrU3RhdGUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoc3RhdGVPckNiKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oc3RhdGVPckNiKSkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnU0VUX0ZPUk1JS19TVEFURScsXG4gICAgICAgIHBheWxvYWQ6IHN0YXRlT3JDYlxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogJ1NFVF9GT1JNSUtfU1RBVEUnLFxuICAgICAgICBwYXlsb2FkOiBmdW5jdGlvbiBwYXlsb2FkKCkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZU9yQ2I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW10pO1xuICB2YXIgc2V0U3RhdHVzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHN0YXR1cykge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdTRVRfU1RBVFVTJyxcbiAgICAgIHBheWxvYWQ6IHN0YXR1c1xuICAgIH0pO1xuICB9LCBbXSk7XG4gIHZhciBzZXRTdWJtaXR0aW5nID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGlzU3VibWl0dGluZykge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdTRVRfSVNTVUJNSVRUSU5HJyxcbiAgICAgIHBheWxvYWQ6IGlzU3VibWl0dGluZ1xuICAgIH0pO1xuICB9LCBbXSk7XG4gIHZhciBzdWJtaXRGb3JtID0gdXNlRXZlbnRDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ1NVQk1JVF9BVFRFTVBUJ1xuICAgIH0pO1xuICAgIHJldHVybiB2YWxpZGF0ZUZvcm1XaXRoSGlnaFByaW9yaXR5KCkudGhlbihmdW5jdGlvbiAoY29tYmluZWRFcnJvcnMpIHtcbiAgICAgIC8vIEluIGNhc2UgYW4gZXJyb3Igd2FzIHRocm93biBhbmQgcGFzc2VkIHRvIHRoZSByZXNvbHZlZCBQcm9taXNlLFxuICAgICAgLy8gYGNvbWJpbmVkRXJyb3JzYCBjYW4gYmUgYW4gaW5zdGFuY2Ugb2YgYW4gRXJyb3IuIFdlIG5lZWQgdG8gY2hlY2tcbiAgICAgIC8vIHRoYXQgYW5kIGFib3J0IHRoZSBzdWJtaXQuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBkbyB0aGF0LCBjYWxsaW5nIGBPYmplY3Qua2V5cyhuZXcgRXJyb3IoKSlgIHlpZWxkcyBhblxuICAgICAgLy8gZW1wdHkgYXJyYXksIHdoaWNoIGNhdXNlcyB0aGUgdmFsaWRhdGlvbiB0byBwYXNzIGFuZCB0aGUgZm9ybVxuICAgICAgLy8gdG8gYmUgc3VibWl0dGVkLlxuICAgICAgdmFyIGlzSW5zdGFuY2VPZkVycm9yID0gY29tYmluZWRFcnJvcnMgaW5zdGFuY2VvZiBFcnJvcjtcbiAgICAgIHZhciBpc0FjdHVhbGx5VmFsaWQgPSAhaXNJbnN0YW5jZU9mRXJyb3IgJiYgT2JqZWN0LmtleXMoY29tYmluZWRFcnJvcnMpLmxlbmd0aCA9PT0gMDtcblxuICAgICAgaWYgKGlzQWN0dWFsbHlWYWxpZCkge1xuICAgICAgICAvLyBQcm9jZWVkIHdpdGggc3VibWl0Li4uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRvIHJlc3BlY3Qgc3luYyBzdWJtaXQgZm5zLCB3ZSBjYW4ndCBzaW1wbHkgd3JhcCBleGVjdXRlU3VibWl0IGluIGEgcHJvbWlzZSBhbmRcbiAgICAgICAgLy8gX2Fsd2F5c18gZGlzcGF0Y2ggU1VCTUlUX1NVQ0NFU1MgYmVjYXVzZSBpc1N1Ym1pdHRpbmcgd291bGQgdGhlbiBhbHdheXMgYmUgZmFsc2UuXG4gICAgICAgIC8vIFRoaXMgd291bGQgYmUgZmluZSBpbiBzaW1wbGUgY2FzZXMsIGJ1dCBtYWtlIGl0IGltcG9zc2libGUgdG8gZGlzYWJsZSBzdWJtaXRcbiAgICAgICAgLy8gYnV0dG9ucyB3aGVyZSBwZW9wbGUgdXNlIGNhbGxiYWNrcyBvciBwcm9taXNlcyBhcyBzaWRlIGVmZmVjdHMgKHdoaWNoIGlzIGJhc2ljYWxseVxuICAgICAgICAvLyBhbGwgb2YgdjEgRm9ybWlrIGNvZGUpLiBJbnN0ZWFkLCByZWNhbGwgdGhhdCB3ZSBhcmUgaW5zaWRlIG9mIGEgcHJvbWlzZSBjaGFpbiBhbHJlYWR5LFxuICAgICAgICAvLyAgc28gd2UgY2FuIHRyeS9jYXRjaCBleGVjdXRlU3VibWl0KCksIGlmIGl0IHJldHVybnMgdW5kZWZpbmVkLCB0aGVuIGp1c3QgYmFpbC5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIGVycm9ycywgdGhyb3cgZW0uIE90aGVyd2lzZSwgd3JhcCBleGVjdXRlU3VibWl0IGluIGEgcHJvbWlzZSBhbmQgaGFuZGxlXG4gICAgICAgIC8vIGNsZWFudXAgb2YgaXNTdWJtaXR0aW5nIG9uIGJlaGFsZiBvZiB0aGUgY29uc3VtZXIuXG4gICAgICAgIHZhciBwcm9taXNlT3JVbmRlZmluZWQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwcm9taXNlT3JVbmRlZmluZWQgPSBleGVjdXRlU3VibWl0KCk7IC8vIEJhaWwgaWYgaXQncyBzeW5jLCBjb25zdW1lciBpcyByZXNwb25zaWJsZSBmb3IgY2xlYW5pbmcgdXBcbiAgICAgICAgICAvLyB2aWEgc2V0U3VibWl0dGluZyhmYWxzZSlcblxuICAgICAgICAgIGlmIChwcm9taXNlT3JVbmRlZmluZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvbWlzZU9yVW5kZWZpbmVkKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAoISFpc01vdW50ZWQuY3VycmVudCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICB0eXBlOiAnU1VCTUlUX1NVQ0NFU1MnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChfZXJyb3JzKSB7XG4gICAgICAgICAgaWYgKCEhaXNNb3VudGVkLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ1NVQk1JVF9GQUlMVVJFJ1xuICAgICAgICAgICAgfSk7IC8vIFRoaXMgaXMgYSBsZWdpdCBlcnJvciByZWplY3RlZCBieSB0aGUgb25TdWJtaXQgZm5cbiAgICAgICAgICAgIC8vIHNvIHdlIGRvbid0IHdhbnQgdG8gYnJlYWsgdGhlIHByb21pc2UgY2hhaW5cblxuICAgICAgICAgICAgdGhyb3cgX2Vycm9ycztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICghIWlzTW91bnRlZC5jdXJyZW50KSB7XG4gICAgICAgIC8vIF5eXiBNYWtlIHN1cmUgRm9ybWlrIGlzIHN0aWxsIG1vdW50ZWQgYmVmb3JlIHVwZGF0aW5nIHN0YXRlXG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiAnU1VCTUlUX0ZBSUxVUkUnXG4gICAgICAgIH0pOyAvLyB0aHJvdyBjb21iaW5lZEVycm9ycztcblxuICAgICAgICBpZiAoaXNJbnN0YW5jZU9mRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBjb21iaW5lZEVycm9ycztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfSk7XG4gIH0pO1xuICB2YXIgaGFuZGxlU3VibWl0ID0gdXNlRXZlbnRDYWxsYmFjayhmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlICYmIGUucHJldmVudERlZmF1bHQgJiYgaXNGdW5jdGlvbihlLnByZXZlbnREZWZhdWx0KSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmIChlICYmIGUuc3RvcFByb3BhZ2F0aW9uICYmIGlzRnVuY3Rpb24oZS5zdG9wUHJvcGFnYXRpb24pKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0gLy8gV2FybiBpZiBmb3JtIHN1Ym1pc3Npb24gaXMgdHJpZ2dlcmVkIGJ5IGEgPGJ1dHRvbj4gd2l0aG91dCBhXG4gICAgLy8gc3BlY2lmaWVkIGB0eXBlYCBhdHRyaWJ1dGUgZHVyaW5nIGRldmVsb3BtZW50LiBUaGlzIG1pdGlnYXRlc1xuICAgIC8vIGEgY29tbW9uIGdvdGNoYSBpbiBmb3JtcyB3aXRoIGJvdGggcmVzZXQgYW5kIHN1Ym1pdCBidXR0b25zLFxuICAgIC8vIHdoZXJlIHRoZSBkZXYgZm9yZ2V0cyB0byBhZGQgdHlwZT1cImJ1dHRvblwiIHRvIHRoZSByZXNldCBidXR0b24uXG5cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gU2FmZWx5IGdldCB0aGUgYWN0aXZlIGVsZW1lbnQgKHdvcmtzIHdpdGggSUUpXG4gICAgICB2YXIgYWN0aXZlRWxlbWVudCA9IGdldEFjdGl2ZUVsZW1lbnQoKTtcblxuICAgICAgaWYgKGFjdGl2ZUVsZW1lbnQgIT09IG51bGwgJiYgYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICEoYWN0aXZlRWxlbWVudC5hdHRyaWJ1dGVzICYmIGFjdGl2ZUVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ3R5cGUnKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsICdZb3Ugc3VibWl0dGVkIGEgRm9ybWlrIGZvcm0gdXNpbmcgYSBidXR0b24gd2l0aCBhbiB1bnNwZWNpZmllZCBgdHlwZWAgYXR0cmlidXRlLiAgTW9zdCBicm93c2VycyBkZWZhdWx0IGJ1dHRvbiBlbGVtZW50cyB0byBgdHlwZT1cInN1Ym1pdFwiYC4gSWYgdGhpcyBpcyBub3QgYSBzdWJtaXQgYnV0dG9uLCBwbGVhc2UgYWRkIGB0eXBlPVwiYnV0dG9uXCJgLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJtaXRGb3JtKClbXCJjYXRjaFwiXShmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBBbiB1bmhhbmRsZWQgZXJyb3Igd2FzIGNhdWdodCBmcm9tIHN1Ym1pdEZvcm0oKVwiLCByZWFzb24pO1xuICAgIH0pO1xuICB9KTtcbiAgdmFyIGltcGVyYXRpdmVNZXRob2RzID0ge1xuICAgIHJlc2V0Rm9ybTogcmVzZXRGb3JtLFxuICAgIHZhbGlkYXRlRm9ybTogdmFsaWRhdGVGb3JtV2l0aEhpZ2hQcmlvcml0eSxcbiAgICB2YWxpZGF0ZUZpZWxkOiB2YWxpZGF0ZUZpZWxkLFxuICAgIHNldEVycm9yczogc2V0RXJyb3JzLFxuICAgIHNldEZpZWxkRXJyb3I6IHNldEZpZWxkRXJyb3IsXG4gICAgc2V0RmllbGRUb3VjaGVkOiBzZXRGaWVsZFRvdWNoZWQsXG4gICAgc2V0RmllbGRWYWx1ZTogc2V0RmllbGRWYWx1ZSxcbiAgICBzZXRTdGF0dXM6IHNldFN0YXR1cyxcbiAgICBzZXRTdWJtaXR0aW5nOiBzZXRTdWJtaXR0aW5nLFxuICAgIHNldFRvdWNoZWQ6IHNldFRvdWNoZWQsXG4gICAgc2V0VmFsdWVzOiBzZXRWYWx1ZXMsXG4gICAgc2V0Rm9ybWlrU3RhdGU6IHNldEZvcm1pa1N0YXRlLFxuICAgIHN1Ym1pdEZvcm06IHN1Ym1pdEZvcm1cbiAgfTtcbiAgdmFyIGV4ZWN1dGVTdWJtaXQgPSB1c2VFdmVudENhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gb25TdWJtaXQoc3RhdGUudmFsdWVzLCBpbXBlcmF0aXZlTWV0aG9kcyk7XG4gIH0pO1xuICB2YXIgaGFuZGxlUmVzZXQgPSB1c2VFdmVudENhbGxiYWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUgJiYgZS5wcmV2ZW50RGVmYXVsdCAmJiBpc0Z1bmN0aW9uKGUucHJldmVudERlZmF1bHQpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaWYgKGUgJiYgZS5zdG9wUHJvcGFnYXRpb24gJiYgaXNGdW5jdGlvbihlLnN0b3BQcm9wYWdhdGlvbikpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcmVzZXRGb3JtKCk7XG4gIH0pO1xuICB2YXIgZ2V0RmllbGRNZXRhID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGdldEluKHN0YXRlLnZhbHVlcywgbmFtZSksXG4gICAgICBlcnJvcjogZ2V0SW4oc3RhdGUuZXJyb3JzLCBuYW1lKSxcbiAgICAgIHRvdWNoZWQ6ICEhZ2V0SW4oc3RhdGUudG91Y2hlZCwgbmFtZSksXG4gICAgICBpbml0aWFsVmFsdWU6IGdldEluKGluaXRpYWxWYWx1ZXMuY3VycmVudCwgbmFtZSksXG4gICAgICBpbml0aWFsVG91Y2hlZDogISFnZXRJbihpbml0aWFsVG91Y2hlZC5jdXJyZW50LCBuYW1lKSxcbiAgICAgIGluaXRpYWxFcnJvcjogZ2V0SW4oaW5pdGlhbEVycm9ycy5jdXJyZW50LCBuYW1lKVxuICAgIH07XG4gIH0sIFtzdGF0ZS5lcnJvcnMsIHN0YXRlLnRvdWNoZWQsIHN0YXRlLnZhbHVlc10pO1xuICB2YXIgZ2V0RmllbGRIZWxwZXJzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlLCBzaG91bGRWYWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gc2V0RmllbGRWYWx1ZShuYW1lLCB2YWx1ZSwgc2hvdWxkVmFsaWRhdGUpO1xuICAgICAgfSxcbiAgICAgIHNldFRvdWNoZWQ6IGZ1bmN0aW9uIHNldFRvdWNoZWQodmFsdWUsIHNob3VsZFZhbGlkYXRlKSB7XG4gICAgICAgIHJldHVybiBzZXRGaWVsZFRvdWNoZWQobmFtZSwgdmFsdWUsIHNob3VsZFZhbGlkYXRlKTtcbiAgICAgIH0sXG4gICAgICBzZXRFcnJvcjogZnVuY3Rpb24gc2V0RXJyb3IodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHNldEZpZWxkRXJyb3IobmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtzZXRGaWVsZFZhbHVlLCBzZXRGaWVsZFRvdWNoZWQsIHNldEZpZWxkRXJyb3JdKTtcbiAgdmFyIGdldEZpZWxkUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmFtZU9yT3B0aW9ucykge1xuICAgIHZhciBpc0FuT2JqZWN0ID0gaXNPYmplY3QobmFtZU9yT3B0aW9ucyk7XG4gICAgdmFyIG5hbWUgPSBpc0FuT2JqZWN0ID8gbmFtZU9yT3B0aW9ucy5uYW1lIDogbmFtZU9yT3B0aW9ucztcbiAgICB2YXIgdmFsdWVTdGF0ZSA9IGdldEluKHN0YXRlLnZhbHVlcywgbmFtZSk7XG4gICAgdmFyIGZpZWxkID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZhbHVlOiB2YWx1ZVN0YXRlLFxuICAgICAgb25DaGFuZ2U6IGhhbmRsZUNoYW5nZSxcbiAgICAgIG9uQmx1cjogaGFuZGxlQmx1clxuICAgIH07XG5cbiAgICBpZiAoaXNBbk9iamVjdCkge1xuICAgICAgdmFyIHR5cGUgPSBuYW1lT3JPcHRpb25zLnR5cGUsXG4gICAgICAgICAgdmFsdWVQcm9wID0gbmFtZU9yT3B0aW9ucy52YWx1ZSxcbiAgICAgICAgICBpcyA9IG5hbWVPck9wdGlvbnMuYXMsXG4gICAgICAgICAgbXVsdGlwbGUgPSBuYW1lT3JPcHRpb25zLm11bHRpcGxlO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICBpZiAodmFsdWVQcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmaWVsZC5jaGVja2VkID0gISF2YWx1ZVN0YXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpZWxkLmNoZWNrZWQgPSAhIShBcnJheS5pc0FycmF5KHZhbHVlU3RhdGUpICYmIH52YWx1ZVN0YXRlLmluZGV4T2YodmFsdWVQcm9wKSk7XG4gICAgICAgICAgZmllbGQudmFsdWUgPSB2YWx1ZVByb3A7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICBmaWVsZC5jaGVja2VkID0gdmFsdWVTdGF0ZSA9PT0gdmFsdWVQcm9wO1xuICAgICAgICBmaWVsZC52YWx1ZSA9IHZhbHVlUHJvcDtcbiAgICAgIH0gZWxzZSBpZiAoaXMgPT09ICdzZWxlY3QnICYmIG11bHRpcGxlKSB7XG4gICAgICAgIGZpZWxkLnZhbHVlID0gZmllbGQudmFsdWUgfHwgW107XG4gICAgICAgIGZpZWxkLm11bHRpcGxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGQ7XG4gIH0sIFtoYW5kbGVCbHVyLCBoYW5kbGVDaGFuZ2UsIHN0YXRlLnZhbHVlc10pO1xuICB2YXIgZGlydHkgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gIWlzRXF1YWwoaW5pdGlhbFZhbHVlcy5jdXJyZW50LCBzdGF0ZS52YWx1ZXMpO1xuICB9LCBbaW5pdGlhbFZhbHVlcy5jdXJyZW50LCBzdGF0ZS52YWx1ZXNdKTtcbiAgdmFyIGlzVmFsaWQgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIGlzSW5pdGlhbFZhbGlkICE9PSAndW5kZWZpbmVkJyA/IGRpcnR5ID8gc3RhdGUuZXJyb3JzICYmIE9iamVjdC5rZXlzKHN0YXRlLmVycm9ycykubGVuZ3RoID09PSAwIDogaXNJbml0aWFsVmFsaWQgIT09IGZhbHNlICYmIGlzRnVuY3Rpb24oaXNJbml0aWFsVmFsaWQpID8gaXNJbml0aWFsVmFsaWQocHJvcHMpIDogaXNJbml0aWFsVmFsaWQgOiBzdGF0ZS5lcnJvcnMgJiYgT2JqZWN0LmtleXMoc3RhdGUuZXJyb3JzKS5sZW5ndGggPT09IDA7XG4gIH0sIFtpc0luaXRpYWxWYWxpZCwgZGlydHksIHN0YXRlLmVycm9ycywgcHJvcHNdKTtcblxuICB2YXIgY3R4ID0gX2V4dGVuZHMoe30sIHN0YXRlLCB7XG4gICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcy5jdXJyZW50LFxuICAgIGluaXRpYWxFcnJvcnM6IGluaXRpYWxFcnJvcnMuY3VycmVudCxcbiAgICBpbml0aWFsVG91Y2hlZDogaW5pdGlhbFRvdWNoZWQuY3VycmVudCxcbiAgICBpbml0aWFsU3RhdHVzOiBpbml0aWFsU3RhdHVzLmN1cnJlbnQsXG4gICAgaGFuZGxlQmx1cjogaGFuZGxlQmx1cixcbiAgICBoYW5kbGVDaGFuZ2U6IGhhbmRsZUNoYW5nZSxcbiAgICBoYW5kbGVSZXNldDogaGFuZGxlUmVzZXQsXG4gICAgaGFuZGxlU3VibWl0OiBoYW5kbGVTdWJtaXQsXG4gICAgcmVzZXRGb3JtOiByZXNldEZvcm0sXG4gICAgc2V0RXJyb3JzOiBzZXRFcnJvcnMsXG4gICAgc2V0Rm9ybWlrU3RhdGU6IHNldEZvcm1pa1N0YXRlLFxuICAgIHNldEZpZWxkVG91Y2hlZDogc2V0RmllbGRUb3VjaGVkLFxuICAgIHNldEZpZWxkVmFsdWU6IHNldEZpZWxkVmFsdWUsXG4gICAgc2V0RmllbGRFcnJvcjogc2V0RmllbGRFcnJvcixcbiAgICBzZXRTdGF0dXM6IHNldFN0YXR1cyxcbiAgICBzZXRTdWJtaXR0aW5nOiBzZXRTdWJtaXR0aW5nLFxuICAgIHNldFRvdWNoZWQ6IHNldFRvdWNoZWQsXG4gICAgc2V0VmFsdWVzOiBzZXRWYWx1ZXMsXG4gICAgc3VibWl0Rm9ybTogc3VibWl0Rm9ybSxcbiAgICB2YWxpZGF0ZUZvcm06IHZhbGlkYXRlRm9ybVdpdGhIaWdoUHJpb3JpdHksXG4gICAgdmFsaWRhdGVGaWVsZDogdmFsaWRhdGVGaWVsZCxcbiAgICBpc1ZhbGlkOiBpc1ZhbGlkLFxuICAgIGRpcnR5OiBkaXJ0eSxcbiAgICB1bnJlZ2lzdGVyRmllbGQ6IHVucmVnaXN0ZXJGaWVsZCxcbiAgICByZWdpc3RlckZpZWxkOiByZWdpc3RlckZpZWxkLFxuICAgIGdldEZpZWxkUHJvcHM6IGdldEZpZWxkUHJvcHMsXG4gICAgZ2V0RmllbGRNZXRhOiBnZXRGaWVsZE1ldGEsXG4gICAgZ2V0RmllbGRIZWxwZXJzOiBnZXRGaWVsZEhlbHBlcnMsXG4gICAgdmFsaWRhdGVPbkJsdXI6IHZhbGlkYXRlT25CbHVyLFxuICAgIHZhbGlkYXRlT25DaGFuZ2U6IHZhbGlkYXRlT25DaGFuZ2UsXG4gICAgdmFsaWRhdGVPbk1vdW50OiB2YWxpZGF0ZU9uTW91bnRcbiAgfSk7XG5cbiAgcmV0dXJuIGN0eDtcbn1cbmZ1bmN0aW9uIEZvcm1payhwcm9wcykge1xuICB2YXIgZm9ybWlrYmFnID0gdXNlRm9ybWlrKHByb3BzKTtcbiAgdmFyIGNvbXBvbmVudCA9IHByb3BzLmNvbXBvbmVudCxcbiAgICAgIGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW4sXG4gICAgICByZW5kZXIgPSBwcm9wcy5yZW5kZXIsXG4gICAgICBpbm5lclJlZiA9IHByb3BzLmlubmVyUmVmOyAvLyBUaGlzIGFsbG93cyBmb2xrcyB0byBwYXNzIGEgcmVmIHRvIDxGb3JtaWsgLz5cblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKGlubmVyUmVmLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZvcm1pa2JhZztcbiAgfSk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9ydWxlcy1vZi1ob29rc1xuICAgIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAhIXByb3BzLnJlbmRlciA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgXCI8Rm9ybWlrIHJlbmRlcj4gaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBGb3JtaWsuIFBsZWFzZSB1c2UgYSBjaGlsZCBjYWxsYmFjayBmdW5jdGlvbiBpbnN0ZWFkLiBUbyBnZXQgcmlkIG9mIHRoaXMgd2FybmluZywgcmVwbGFjZSA8Rm9ybWlrIHJlbmRlcj17KHByb3BzKSA9PiAuLi59IC8+IHdpdGggPEZvcm1paz57KHByb3BzKSA9PiAuLi59PC9Gb3JtaWs+XCIpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgfSwgW10pO1xuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoRm9ybWlrUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogZm9ybWlrYmFnXG4gIH0sIGNvbXBvbmVudCA/IGNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCBmb3JtaWtiYWcpIDogcmVuZGVyID8gcmVuZGVyKGZvcm1pa2JhZykgOiBjaGlsZHJlbiAvLyBjaGlsZHJlbiBjb21lIGxhc3QsIGFsd2F5cyBjYWxsZWRcbiAgPyBpc0Z1bmN0aW9uKGNoaWxkcmVuKSA/IGNoaWxkcmVuKGZvcm1pa2JhZykgOiAhaXNFbXB0eUNoaWxkcmVuKGNoaWxkcmVuKSA/IENoaWxkcmVuLm9ubHkoY2hpbGRyZW4pIDogbnVsbCA6IG51bGwpO1xufVxuXG5mdW5jdGlvbiB3YXJuQWJvdXRNaXNzaW5nSWRlbnRpZmllcihfcmVmNCkge1xuICB2YXIgaHRtbENvbnRlbnQgPSBfcmVmNC5odG1sQ29udGVudCxcbiAgICAgIGRvY3VtZW50YXRpb25BbmNob3JMaW5rID0gX3JlZjQuZG9jdW1lbnRhdGlvbkFuY2hvckxpbmssXG4gICAgICBoYW5kbGVyTmFtZSA9IF9yZWY0LmhhbmRsZXJOYW1lO1xuICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBGb3JtaWsgY2FsbGVkIGBcIiArIGhhbmRsZXJOYW1lICsgXCJgLCBidXQgeW91IGZvcmdvdCB0byBwYXNzIGFuIGBpZGAgb3IgYG5hbWVgIGF0dHJpYnV0ZSB0byB5b3VyIGlucHV0OlxcbiAgICBcIiArIGh0bWxDb250ZW50ICsgXCJcXG4gICAgRm9ybWlrIGNhbm5vdCBkZXRlcm1pbmUgd2hpY2ggdmFsdWUgdG8gdXBkYXRlLiBGb3IgbW9yZSBpbmZvIHNlZSBodHRwczovL2Zvcm1pay5vcmcvZG9jcy9hcGkvZm9ybWlrI1wiICsgZG9jdW1lbnRhdGlvbkFuY2hvckxpbmsgKyBcIlxcbiAgXCIpO1xufVxuLyoqXHJcbiAqIFRyYW5zZm9ybSBZdXAgVmFsaWRhdGlvbkVycm9yIHRvIGEgbW9yZSB1c2FibGUgb2JqZWN0XHJcbiAqL1xuXG5cbmZ1bmN0aW9uIHl1cFRvRm9ybUVycm9ycyh5dXBFcnJvcikge1xuICB2YXIgZXJyb3JzID0ge307XG5cbiAgaWYgKHl1cEVycm9yLmlubmVyKSB7XG4gICAgaWYgKHl1cEVycm9yLmlubmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHNldEluKGVycm9ycywgeXVwRXJyb3IucGF0aCwgeXVwRXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yID0geXVwRXJyb3IuaW5uZXIsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICB2YXIgX3JlZjU7XG5cbiAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICBpZiAoX2kgPj0gX2l0ZXJhdG9yLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgIF9yZWY1ID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kgPSBfaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWY1ID0gX2kudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBlcnIgPSBfcmVmNTtcblxuICAgICAgaWYgKCFnZXRJbihlcnJvcnMsIGVyci5wYXRoKSkge1xuICAgICAgICBlcnJvcnMgPSBzZXRJbihlcnJvcnMsIGVyci5wYXRoLCBlcnIubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVycm9ycztcbn1cbi8qKlxyXG4gKiBWYWxpZGF0ZSBhIHl1cCBzY2hlbWEuXHJcbiAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVl1cFNjaGVtYSh2YWx1ZXMsIHNjaGVtYSwgc3luYywgY29udGV4dCkge1xuICBpZiAoc3luYyA9PT0gdm9pZCAwKSB7XG4gICAgc3luYyA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkge1xuICAgIGNvbnRleHQgPSB7fTtcbiAgfVxuXG4gIHZhciB2YWxpZGF0ZURhdGEgPSBwcmVwYXJlRGF0YUZvclZhbGlkYXRpb24odmFsdWVzKTtcbiAgcmV0dXJuIHNjaGVtYVtzeW5jID8gJ3ZhbGlkYXRlU3luYycgOiAndmFsaWRhdGUnXSh2YWxpZGF0ZURhdGEsIHtcbiAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbiAgICBjb250ZXh0OiBjb250ZXh0XG4gIH0pO1xufVxuLyoqXHJcbiAqIFJlY3Vyc2l2ZWx5IHByZXBhcmUgdmFsdWVzLlxyXG4gKi9cblxuZnVuY3Rpb24gcHJlcGFyZURhdGFGb3JWYWxpZGF0aW9uKHZhbHVlcykge1xuICB2YXIgZGF0YSA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IFtdIDoge307XG5cbiAgZm9yICh2YXIgayBpbiB2YWx1ZXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlcywgaykpIHtcbiAgICAgIHZhciBrZXkgPSBTdHJpbmcoayk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlc1trZXldKSA9PT0gdHJ1ZSkge1xuICAgICAgICBkYXRhW2tleV0gPSB2YWx1ZXNba2V5XS5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpID09PSB0cnVlIHx8IGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlcGFyZURhdGFGb3JWYWxpZGF0aW9uKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSAnJyA/IHZhbHVlIDogdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsdWVzW2tleV0pKSB7XG4gICAgICAgIGRhdGFba2V5XSA9IHByZXBhcmVEYXRhRm9yVmFsaWRhdGlvbih2YWx1ZXNba2V5XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhW2tleV0gPSB2YWx1ZXNba2V5XSAhPT0gJycgPyB2YWx1ZXNba2V5XSA6IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cbi8qKlxyXG4gKiBkZWVwbWVyZ2UgYXJyYXkgbWVyZ2luZyBhbGdvcml0aG1cclxuICogaHR0cHM6Ly9naXRodWIuY29tL0t5bGVBTWF0aGV3cy9kZWVwbWVyZ2UjY29tYmluZS1hcnJheVxyXG4gKi9cblxuZnVuY3Rpb24gYXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuICB2YXIgZGVzdGluYXRpb24gPSB0YXJnZXQuc2xpY2UoKTtcbiAgc291cmNlLmZvckVhY2goZnVuY3Rpb24gbWVyZ2UoZSwgaSkge1xuICAgIGlmICh0eXBlb2YgZGVzdGluYXRpb25baV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgY2xvbmVSZXF1ZXN0ZWQgPSBvcHRpb25zLmNsb25lICE9PSBmYWxzZTtcbiAgICAgIHZhciBzaG91bGRDbG9uZSA9IGNsb25lUmVxdWVzdGVkICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QoZSk7XG4gICAgICBkZXN0aW5hdGlvbltpXSA9IHNob3VsZENsb25lID8gZGVlcG1lcmdlKEFycmF5LmlzQXJyYXkoZSkgPyBbXSA6IHt9LCBlLCBvcHRpb25zKSA6IGU7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KGUpKSB7XG4gICAgICBkZXN0aW5hdGlvbltpXSA9IGRlZXBtZXJnZSh0YXJnZXRbaV0sIGUsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmluZGV4T2YoZSkgPT09IC0xKSB7XG4gICAgICBkZXN0aW5hdGlvbi5wdXNoKGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cbi8qKiBSZXR1cm4gbXVsdGkgc2VsZWN0IHZhbHVlcyBiYXNlZCBvbiBhbiBhcnJheSBvZiBvcHRpb25zICovXG5cblxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWRWYWx1ZXMob3B0aW9ucykge1xuICByZXR1cm4gQXJyYXkuZnJvbShvcHRpb25zKS5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG4gICAgcmV0dXJuIGVsLnNlbGVjdGVkO1xuICB9KS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgcmV0dXJuIGVsLnZhbHVlO1xuICB9KTtcbn1cbi8qKiBSZXR1cm4gdGhlIG5leHQgdmFsdWUgZm9yIGEgY2hlY2tib3ggKi9cblxuXG5mdW5jdGlvbiBnZXRWYWx1ZUZvckNoZWNrYm94KGN1cnJlbnRWYWx1ZSwgY2hlY2tlZCwgdmFsdWVQcm9wKSB7XG4gIC8vIElmIHRoZSBjdXJyZW50IHZhbHVlIHdhcyBhIGJvb2xlYW4sIHJldHVybiBhIGJvb2xlYW5cbiAgaWYgKHR5cGVvZiBjdXJyZW50VmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBCb29sZWFuKGNoZWNrZWQpO1xuICB9IC8vIElmIHRoZSBjdXJyZW50VmFsdWUgd2FzIG5vdCBhIGJvb2xlYW4gd2Ugd2FudCB0byByZXR1cm4gYW4gYXJyYXlcblxuXG4gIHZhciBjdXJyZW50QXJyYXlPZlZhbHVlcyA9IFtdO1xuICB2YXIgaXNWYWx1ZUluQXJyYXkgPSBmYWxzZTtcbiAgdmFyIGluZGV4ID0gLTE7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKCF2YWx1ZVByb3AgfHwgdmFsdWVQcm9wID09ICd0cnVlJyB8fCB2YWx1ZVByb3AgPT0gJ2ZhbHNlJykge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oY2hlY2tlZCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGFscmVhZHkgYW4gYXJyYXksIHVzZSBpdFxuICAgIGN1cnJlbnRBcnJheU9mVmFsdWVzID0gY3VycmVudFZhbHVlO1xuICAgIGluZGV4ID0gY3VycmVudFZhbHVlLmluZGV4T2YodmFsdWVQcm9wKTtcbiAgICBpc1ZhbHVlSW5BcnJheSA9IGluZGV4ID49IDA7XG4gIH0gLy8gSWYgdGhlIGNoZWNrYm94IHdhcyBjaGVja2VkIGFuZCB0aGUgdmFsdWUgaXMgbm90IGFscmVhZHkgcHJlc2VudCBpbiB0aGUgYXJheSB3ZSB3YW50IHRvIGFkZCB0aGUgbmV3IHZhbHVlIHRvIHRoZSBhcnJheSBvZiB2YWx1ZXNcblxuXG4gIGlmIChjaGVja2VkICYmIHZhbHVlUHJvcCAmJiAhaXNWYWx1ZUluQXJyYXkpIHtcbiAgICByZXR1cm4gY3VycmVudEFycmF5T2ZWYWx1ZXMuY29uY2F0KHZhbHVlUHJvcCk7XG4gIH0gLy8gSWYgdGhlIGNoZWNrYm94IHdhcyB1bmNoZWNrZWQgYW5kIHRoZSB2YWx1ZSBpcyBub3QgaW4gdGhlIGFycmF5LCBzaW1wbHkgcmV0dXJuIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGFycmF5IG9mIHZhbHVlc1xuXG5cbiAgaWYgKCFpc1ZhbHVlSW5BcnJheSkge1xuICAgIHJldHVybiBjdXJyZW50QXJyYXlPZlZhbHVlcztcbiAgfSAvLyBJZiB0aGUgY2hlY2tib3ggd2FzIHVuY2hlY2tlZCBhbmQgdGhlIHZhbHVlIGlzIGluIHRoZSBhcnJheSwgcmVtb3ZlIHRoZSB2YWx1ZSBhbmQgcmV0dXJuIHRoZSBhcnJheVxuXG5cbiAgcmV0dXJuIGN1cnJlbnRBcnJheU9mVmFsdWVzLnNsaWNlKDAsIGluZGV4KS5jb25jYXQoY3VycmVudEFycmF5T2ZWYWx1ZXMuc2xpY2UoaW5kZXggKyAxKSk7XG59IC8vIFJlYWN0IGN1cnJlbnRseSB0aHJvd3MgYSB3YXJuaW5nIHdoZW4gdXNpbmcgdXNlTGF5b3V0RWZmZWN0IG9uIHRoZSBzZXJ2ZXIuXG4vLyBUbyBnZXQgYXJvdW5kIGl0LCB3ZSBjYW4gY29uZGl0aW9uYWxseSB1c2VFZmZlY3Qgb24gdGhlIHNlcnZlciAobm8tb3ApIGFuZFxuLy8gdXNlTGF5b3V0RWZmZWN0IGluIHRoZSBicm93c2VyLlxuLy8gQHNlZSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9nYWVhcm9uL2U3ZDk3Y2RmMzhhMjkwNzkyNGVhMTJlNGViZGYzYzg1XG5cblxudmFyIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gdXNlTGF5b3V0RWZmZWN0IDogdXNlRWZmZWN0O1xuXG5mdW5jdGlvbiB1c2VFdmVudENhbGxiYWNrKGZuKSB7XG4gIHZhciByZWYgPSB1c2VSZWYoZm4pOyAvLyB3ZSBjb3B5IGEgcmVmIHRvIHRoZSBjYWxsYmFjayBzY29wZWQgdG8gdGhlIGN1cnJlbnQgc3RhdGUvcHJvcHMgb24gZWFjaCByZW5kZXJcblxuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICByZWYuY3VycmVudCA9IGZuO1xuICB9KTtcbiAgcmV0dXJuIHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlZi5jdXJyZW50LmFwcGx5KHZvaWQgMCwgYXJncyk7XG4gIH0sIFtdKTtcbn1cblxuZnVuY3Rpb24gdXNlRmllbGQocHJvcHNPckZpZWxkTmFtZSkge1xuICB2YXIgZm9ybWlrID0gdXNlRm9ybWlrQ29udGV4dCgpO1xuICB2YXIgZ2V0RmllbGRQcm9wcyA9IGZvcm1pay5nZXRGaWVsZFByb3BzLFxuICAgICAgZ2V0RmllbGRNZXRhID0gZm9ybWlrLmdldEZpZWxkTWV0YSxcbiAgICAgIGdldEZpZWxkSGVscGVycyA9IGZvcm1pay5nZXRGaWVsZEhlbHBlcnMsXG4gICAgICByZWdpc3RlckZpZWxkID0gZm9ybWlrLnJlZ2lzdGVyRmllbGQsXG4gICAgICB1bnJlZ2lzdGVyRmllbGQgPSBmb3JtaWsudW5yZWdpc3RlckZpZWxkO1xuICB2YXIgaXNBbk9iamVjdCA9IGlzT2JqZWN0KHByb3BzT3JGaWVsZE5hbWUpOyAvLyBOb3JtYWxpemUgcHJvcHNPckZpZWxkTmFtZSB0byBGaWVsZEhvb2tDb25maWc8VmFsPlxuXG4gIHZhciBwcm9wcyA9IGlzQW5PYmplY3QgPyBwcm9wc09yRmllbGROYW1lIDoge1xuICAgIG5hbWU6IHByb3BzT3JGaWVsZE5hbWVcbiAgfTtcbiAgdmFyIGZpZWxkTmFtZSA9IHByb3BzLm5hbWUsXG4gICAgICB2YWxpZGF0ZUZuID0gcHJvcHMudmFsaWRhdGU7XG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGZpZWxkTmFtZSkge1xuICAgICAgcmVnaXN0ZXJGaWVsZChmaWVsZE5hbWUsIHtcbiAgICAgICAgdmFsaWRhdGU6IHZhbGlkYXRlRm5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZmllbGROYW1lKSB7XG4gICAgICAgIHVucmVnaXN0ZXJGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtyZWdpc3RlckZpZWxkLCB1bnJlZ2lzdGVyRmllbGQsIGZpZWxkTmFtZSwgdmFsaWRhdGVGbl0pO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAhZm9ybWlrID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCAndXNlRmllbGQoKSAvIDxGaWVsZCAvPiBtdXN0IGJlIHVzZWQgdW5kZXJuZWF0aCBhIDxGb3JtaWs+IGNvbXBvbmVudCBvciB3aXRoRm9ybWlrKCkgaGlnaGVyIG9yZGVyIGNvbXBvbmVudCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgfVxuXG4gICFmaWVsZE5hbWUgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsICdJbnZhbGlkIGZpZWxkIG5hbWUuIEVpdGhlciBwYXNzIGB1c2VGaWVsZGAgYSBzdHJpbmcgb3IgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBgbmFtZWAga2V5LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgcmV0dXJuIFtnZXRGaWVsZFByb3BzKHByb3BzKSwgZ2V0RmllbGRNZXRhKGZpZWxkTmFtZSksIGdldEZpZWxkSGVscGVycyhmaWVsZE5hbWUpXTtcbn1cbmZ1bmN0aW9uIEZpZWxkKF9yZWYpIHtcbiAgdmFyIHZhbGlkYXRlID0gX3JlZi52YWxpZGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICByZW5kZXIgPSBfcmVmLnJlbmRlcixcbiAgICAgIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbixcbiAgICAgIGlzID0gX3JlZi5hcyxcbiAgICAgIGNvbXBvbmVudCA9IF9yZWYuY29tcG9uZW50LFxuICAgICAgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmLCBbXCJ2YWxpZGF0ZVwiLCBcIm5hbWVcIiwgXCJyZW5kZXJcIiwgXCJjaGlsZHJlblwiLCBcImFzXCIsIFwiY29tcG9uZW50XCJdKTtcblxuICB2YXIgX3VzZUZvcm1pa0NvbnRleHQgPSB1c2VGb3JtaWtDb250ZXh0KCksXG4gICAgICBmb3JtaWsgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfdXNlRm9ybWlrQ29udGV4dCwgW1widmFsaWRhdGVcIiwgXCJ2YWxpZGF0aW9uU2NoZW1hXCJdKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICEhcmVuZGVyID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCBcIjxGaWVsZCByZW5kZXI+IGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgRm9ybWlrLiBQbGVhc2UgdXNlIGEgY2hpbGQgY2FsbGJhY2sgZnVuY3Rpb24gaW5zdGVhZC4gVG8gZ2V0IHJpZCBvZiB0aGlzIHdhcm5pbmcsIHJlcGxhY2UgPEZpZWxkIG5hbWU9XFxcIlwiICsgbmFtZSArIFwiXFxcIiByZW5kZXI9eyh7ZmllbGQsIGZvcm19KSA9PiAuLi59IC8+IHdpdGggPEZpZWxkIG5hbWU9XFxcIlwiICsgbmFtZSArIFwiXFxcIj57KHtmaWVsZCwgZm9ybSwgbWV0YX0pID0+IC4uLn08L0ZpZWxkPlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgICAhIShpcyAmJiBjaGlsZHJlbiAmJiBpc0Z1bmN0aW9uKGNoaWxkcmVuKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsICdZb3Ugc2hvdWxkIG5vdCB1c2UgPEZpZWxkIGFzPiBhbmQgPEZpZWxkIGNoaWxkcmVuPiBhcyBhIGZ1bmN0aW9uIGluIHRoZSBzYW1lIDxGaWVsZD4gY29tcG9uZW50OyA8RmllbGQgYXM+IHdpbGwgYmUgaWdub3JlZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgICAhIShjb21wb25lbnQgJiYgY2hpbGRyZW4gJiYgaXNGdW5jdGlvbihjaGlsZHJlbikpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCAnWW91IHNob3VsZCBub3QgdXNlIDxGaWVsZCBjb21wb25lbnQ+IGFuZCA8RmllbGQgY2hpbGRyZW4+IGFzIGEgZnVuY3Rpb24gaW4gdGhlIHNhbWUgPEZpZWxkPiBjb21wb25lbnQ7IDxGaWVsZCBjb21wb25lbnQ+IHdpbGwgYmUgaWdub3JlZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgICAhIShyZW5kZXIgJiYgY2hpbGRyZW4gJiYgIWlzRW1wdHlDaGlsZHJlbihjaGlsZHJlbikpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCAnWW91IHNob3VsZCBub3QgdXNlIDxGaWVsZCByZW5kZXI+IGFuZCA8RmllbGQgY2hpbGRyZW4+IGluIHRoZSBzYW1lIDxGaWVsZD4gY29tcG9uZW50OyA8RmllbGQgY2hpbGRyZW4+IHdpbGwgYmUgaWdub3JlZCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgfSwgW10pO1xuICB9IC8vIFJlZ2lzdGVyIGZpZWxkIGFuZCBmaWVsZC1sZXZlbCB2YWxpZGF0aW9uIHdpdGggcGFyZW50IDxGb3JtaWs+XG5cblxuICB2YXIgcmVnaXN0ZXJGaWVsZCA9IGZvcm1pay5yZWdpc3RlckZpZWxkLFxuICAgICAgdW5yZWdpc3RlckZpZWxkID0gZm9ybWlrLnVucmVnaXN0ZXJGaWVsZDtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICByZWdpc3RlckZpZWxkKG5hbWUsIHtcbiAgICAgIHZhbGlkYXRlOiB2YWxpZGF0ZVxuICAgIH0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB1bnJlZ2lzdGVyRmllbGQobmFtZSk7XG4gICAgfTtcbiAgfSwgW3JlZ2lzdGVyRmllbGQsIHVucmVnaXN0ZXJGaWVsZCwgbmFtZSwgdmFsaWRhdGVdKTtcbiAgdmFyIGZpZWxkID0gZm9ybWlrLmdldEZpZWxkUHJvcHMoX2V4dGVuZHMoe1xuICAgIG5hbWU6IG5hbWVcbiAgfSwgcHJvcHMpKTtcbiAgdmFyIG1ldGEgPSBmb3JtaWsuZ2V0RmllbGRNZXRhKG5hbWUpO1xuICB2YXIgbGVnYWN5QmFnID0ge1xuICAgIGZpZWxkOiBmaWVsZCxcbiAgICBmb3JtOiBmb3JtaWtcbiAgfTtcblxuICBpZiAocmVuZGVyKSB7XG4gICAgcmV0dXJuIHJlbmRlcihfZXh0ZW5kcyh7fSwgbGVnYWN5QmFnLCB7XG4gICAgICBtZXRhOiBtZXRhXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKGlzRnVuY3Rpb24oY2hpbGRyZW4pKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuKF9leHRlbmRzKHt9LCBsZWdhY3lCYWcsIHtcbiAgICAgIG1ldGE6IG1ldGFcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoY29tcG9uZW50KSB7XG4gICAgLy8gVGhpcyBiZWhhdmlvciBpcyBiYWNrd2FyZHMgY29tcGF0IHdpdGggZWFybGllciBGb3JtaWsgMC45IHRvIDEueFxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIGlubmVyUmVmID0gcHJvcHMuaW5uZXJSZWYsXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHByb3BzLCBbXCJpbm5lclJlZlwiXSk7XG5cbiAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGNvbXBvbmVudCwgX2V4dGVuZHMoe1xuICAgICAgICByZWY6IGlubmVyUmVmXG4gICAgICB9LCBmaWVsZCwgcmVzdCksIGNoaWxkcmVuKTtcbiAgICB9IC8vIFdlIGRvbid0IHBhc3MgYG1ldGFgIGZvciBiYWNrd2FyZHMgY29tcGF0XG5cblxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGNvbXBvbmVudCwgX2V4dGVuZHMoe1xuICAgICAgZmllbGQ6IGZpZWxkLFxuICAgICAgZm9ybTogZm9ybWlrXG4gICAgfSwgcHJvcHMpLCBjaGlsZHJlbik7XG4gIH0gLy8gZGVmYXVsdCB0byBpbnB1dCBoZXJlIHNvIHdlIGNhbiBjaGVjayBmb3IgYm90aCBgYXNgIGFuZCBgY2hpbGRyZW5gIGFib3ZlXG5cblxuICB2YXIgYXNFbGVtZW50ID0gaXMgfHwgJ2lucHV0JztcblxuICBpZiAodHlwZW9mIGFzRWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgX2lubmVyUmVmID0gcHJvcHMuaW5uZXJSZWYsXG4gICAgICAgIF9yZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UocHJvcHMsIFtcImlubmVyUmVmXCJdKTtcblxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGFzRWxlbWVudCwgX2V4dGVuZHMoe1xuICAgICAgcmVmOiBfaW5uZXJSZWZcbiAgICB9LCBmaWVsZCwgX3Jlc3QpLCBjaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gY3JlYXRlRWxlbWVudChhc0VsZW1lbnQsIF9leHRlbmRzKHt9LCBmaWVsZCwgcHJvcHMpLCBjaGlsZHJlbik7XG59XG5cbnZhciBGb3JtID0gLyojX19QVVJFX18qL2ZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgLy8gaU9TIG5lZWRzIGFuIFwiYWN0aW9uXCIgYXR0cmlidXRlIGZvciBuaWNlIGlucHV0OiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk0ODUxNjIvNDA2NzI1XG4gIC8vIFdlIGRlZmF1bHQgdGhlIGFjdGlvbiB0byBcIiNcIiBpbiBjYXNlIHRoZSBwcmV2ZW50RGVmYXVsdCBmYWlscyAoanVzdCB1cGRhdGVzIHRoZSBVUkwgaGFzaClcbiAgdmFyIGFjdGlvbiA9IHByb3BzLmFjdGlvbixcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShwcm9wcywgW1wiYWN0aW9uXCJdKTtcblxuICB2YXIgX2FjdGlvbiA9IGFjdGlvbiB8fCAnIyc7XG5cbiAgdmFyIF91c2VGb3JtaWtDb250ZXh0ID0gdXNlRm9ybWlrQ29udGV4dCgpLFxuICAgICAgaGFuZGxlUmVzZXQgPSBfdXNlRm9ybWlrQ29udGV4dC5oYW5kbGVSZXNldCxcbiAgICAgIGhhbmRsZVN1Ym1pdCA9IF91c2VGb3JtaWtDb250ZXh0LmhhbmRsZVN1Ym1pdDtcblxuICByZXR1cm4gY3JlYXRlRWxlbWVudChcImZvcm1cIiwgT2JqZWN0LmFzc2lnbih7XG4gICAgb25TdWJtaXQ6IGhhbmRsZVN1Ym1pdCxcbiAgICByZWY6IHJlZixcbiAgICBvblJlc2V0OiBoYW5kbGVSZXNldCxcbiAgICBhY3Rpb246IF9hY3Rpb25cbiAgfSwgcmVzdCkpO1xufSk7XG5Gb3JtLmRpc3BsYXlOYW1lID0gJ0Zvcm0nO1xuXG4vKipcclxuICogQSBwdWJsaWMgaGlnaGVyLW9yZGVyIGNvbXBvbmVudCB0byBhY2Nlc3MgdGhlIGltcGVyYXRpdmUgQVBJXHJcbiAqL1xuXG5mdW5jdGlvbiB3aXRoRm9ybWlrKF9yZWYpIHtcbiAgdmFyIF9yZWYkbWFwUHJvcHNUb1ZhbHVlcyA9IF9yZWYubWFwUHJvcHNUb1ZhbHVlcyxcbiAgICAgIG1hcFByb3BzVG9WYWx1ZXMgPSBfcmVmJG1hcFByb3BzVG9WYWx1ZXMgPT09IHZvaWQgMCA/IGZ1bmN0aW9uICh2YW5pbGxhUHJvcHMpIHtcbiAgICB2YXIgdmFsID0ge307XG5cbiAgICBmb3IgKHZhciBrIGluIHZhbmlsbGFQcm9wcykge1xuICAgICAgaWYgKHZhbmlsbGFQcm9wcy5oYXNPd25Qcm9wZXJ0eShrKSAmJiB0eXBlb2YgdmFuaWxsYVByb3BzW2tdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIEB0b2RvIFR5cGVTY3JpcHQgZml4XG4gICAgICAgIHZhbFtrXSA9IHZhbmlsbGFQcm9wc1trXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9IDogX3JlZiRtYXBQcm9wc1RvVmFsdWVzLFxuICAgICAgY29uZmlnID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgW1wibWFwUHJvcHNUb1ZhbHVlc1wiXSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUZvcm1payhDb21wb25lbnQkMSkge1xuICAgIHZhciBjb21wb25lbnREaXNwbGF5TmFtZSA9IENvbXBvbmVudCQxLmRpc3BsYXlOYW1lIHx8IENvbXBvbmVudCQxLm5hbWUgfHwgQ29tcG9uZW50JDEuY29uc3RydWN0b3IgJiYgQ29tcG9uZW50JDEuY29uc3RydWN0b3IubmFtZSB8fCAnQ29tcG9uZW50JztcbiAgICAvKipcclxuICAgICAqIFdlIG5lZWQgdG8gdXNlIGNsb3N1cmVzIGhlcmUgZm9yIHRvIHByb3ZpZGUgdGhlIHdyYXBwZWQgY29tcG9uZW50J3MgcHJvcHMgdG9cclxuICAgICAqIHRoZSByZXNwZWN0aXZlIHdpdGhGb3JtaWsgY29uZmlnIG1ldGhvZHMuXHJcbiAgICAgKi9cblxuICAgIHZhciBDID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgICBfaW5oZXJpdHNMb29zZShDLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgICAgZnVuY3Rpb24gQygpIHtcbiAgICAgICAgdmFyIF90aGlzO1xuXG4gICAgICAgIF90aGlzID0gX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG5cbiAgICAgICAgX3RoaXMudmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbmZpZy52YWxpZGF0ZSh2YWx1ZXMsIF90aGlzLnByb3BzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBfdGhpcy52YWxpZGF0aW9uU2NoZW1hID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKGNvbmZpZy52YWxpZGF0aW9uU2NoZW1hKSA/IGNvbmZpZy52YWxpZGF0aW9uU2NoZW1hKF90aGlzLnByb3BzKSA6IGNvbmZpZy52YWxpZGF0aW9uU2NoZW1hO1xuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uICh2YWx1ZXMsIGFjdGlvbnMpIHtcbiAgICAgICAgICByZXR1cm4gY29uZmlnLmhhbmRsZVN1Ym1pdCh2YWx1ZXMsIF9leHRlbmRzKHt9LCBhY3Rpb25zLCB7XG4gICAgICAgICAgICBwcm9wczogX3RoaXMucHJvcHNcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEp1c3QgYXZvaWRpbmcgYSByZW5kZXIgY2FsbGJhY2sgZm9yIHBlcmYgaGVyZVxyXG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgX3RoaXMucmVuZGVyRm9ybUNvbXBvbmVudCA9IGZ1bmN0aW9uIChmb3JtaWtQcm9wcykge1xuICAgICAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50KENvbXBvbmVudCQxLCBPYmplY3QuYXNzaWduKHt9LCBfdGhpcy5wcm9wcywgZm9ybWlrUHJvcHMpKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBfcHJvdG8gPSBDLnByb3RvdHlwZTtcblxuICAgICAgX3Byb3RvLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzJHByb3BzID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIHByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3RoaXMkcHJvcHMsIFtcImNoaWxkcmVuXCJdKTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRWxlbWVudChGb3JtaWssIE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCBjb25maWcsIHtcbiAgICAgICAgICB2YWxpZGF0ZTogY29uZmlnLnZhbGlkYXRlICYmIHRoaXMudmFsaWRhdGUsXG4gICAgICAgICAgdmFsaWRhdGlvblNjaGVtYTogY29uZmlnLnZhbGlkYXRpb25TY2hlbWEgJiYgdGhpcy52YWxpZGF0aW9uU2NoZW1hLFxuICAgICAgICAgIGluaXRpYWxWYWx1ZXM6IG1hcFByb3BzVG9WYWx1ZXModGhpcy5wcm9wcyksXG4gICAgICAgICAgaW5pdGlhbFN0YXR1czogY29uZmlnLm1hcFByb3BzVG9TdGF0dXMgJiYgY29uZmlnLm1hcFByb3BzVG9TdGF0dXModGhpcy5wcm9wcyksXG4gICAgICAgICAgaW5pdGlhbEVycm9yczogY29uZmlnLm1hcFByb3BzVG9FcnJvcnMgJiYgY29uZmlnLm1hcFByb3BzVG9FcnJvcnModGhpcy5wcm9wcyksXG4gICAgICAgICAgaW5pdGlhbFRvdWNoZWQ6IGNvbmZpZy5tYXBQcm9wc1RvVG91Y2hlZCAmJiBjb25maWcubWFwUHJvcHNUb1RvdWNoZWQodGhpcy5wcm9wcyksXG4gICAgICAgICAgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0LFxuICAgICAgICAgIGNoaWxkcmVuOiB0aGlzLnJlbmRlckZvcm1Db21wb25lbnRcbiAgICAgICAgfSkpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEM7XG4gICAgfShDb21wb25lbnQpO1xuXG4gICAgQy5kaXNwbGF5TmFtZSA9IFwiV2l0aEZvcm1payhcIiArIGNvbXBvbmVudERpc3BsYXlOYW1lICsgXCIpXCI7XG4gICAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKEMsIENvbXBvbmVudCQxIC8vIGNhc3QgdHlwZSB0byBDb21wb25lbnRDbGFzcyAoZXZlbiBpZiBTRkMpXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXHJcbiAqIENvbm5lY3QgYW55IGNvbXBvbmVudCB0byBGb3JtaWsgY29udGV4dCwgYW5kIGluamVjdCBhcyBhIHByb3AgY2FsbGVkIGBmb3JtaWtgO1xyXG4gKiBAcGFyYW0gQ29tcCBSZWFjdCBDb21wb25lbnRcclxuICovXG5cbmZ1bmN0aW9uIGNvbm5lY3QoQ29tcCkge1xuICB2YXIgQyA9IGZ1bmN0aW9uIEMocHJvcHMpIHtcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudChGb3JtaWtDb25zdW1lciwgbnVsbCwgZnVuY3Rpb24gKGZvcm1paykge1xuICAgICAgISEhZm9ybWlrID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCBcIkZvcm1payBjb250ZXh0IGlzIHVuZGVmaW5lZCwgcGxlYXNlIHZlcmlmeSB5b3UgYXJlIHJlbmRlcmluZyA8Rm9ybT4sIDxGaWVsZD4sIDxGYXN0RmllbGQ+LCA8RmllbGRBcnJheT4sIG9yIHlvdXIgY3VzdG9tIGNvbnRleHQtdXNpbmcgY29tcG9uZW50IGFzIGEgY2hpbGQgb2YgYSA8Rm9ybWlrPiBjb21wb25lbnQuIENvbXBvbmVudCBuYW1lOiBcIiArIENvbXAubmFtZSkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoQ29tcCwgT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgZm9ybWlrOiBmb3JtaWtcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgY29tcG9uZW50RGlzcGxheU5hbWUgPSBDb21wLmRpc3BsYXlOYW1lIHx8IENvbXAubmFtZSB8fCBDb21wLmNvbnN0cnVjdG9yICYmIENvbXAuY29uc3RydWN0b3IubmFtZSB8fCAnQ29tcG9uZW50JzsgLy8gQXNzaWduIENvbXAgdG8gQy5XcmFwcGVkQ29tcG9uZW50IHNvIHdlIGNhbiBhY2Nlc3MgdGhlIGlubmVyIGNvbXBvbmVudCBpbiB0ZXN0c1xuICAvLyBGb3IgZXhhbXBsZSwgPEZpZWxkLldyYXBwZWRDb21wb25lbnQgLz4gZ2V0cyB1cyA8RmllbGRJbm5lci8+XG5cbiAgQy5XcmFwcGVkQ29tcG9uZW50ID0gQ29tcDtcbiAgQy5kaXNwbGF5TmFtZSA9IFwiRm9ybWlrQ29ubmVjdChcIiArIGNvbXBvbmVudERpc3BsYXlOYW1lICsgXCIpXCI7XG4gIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhDLCBDb21wIC8vIGNhc3QgdHlwZSB0byBDb21wb25lbnRDbGFzcyAoZXZlbiBpZiBTRkMpXG4gICk7XG59XG5cbi8qKlxyXG4gKiBTb21lIGFycmF5IGhlbHBlcnMhXHJcbiAqL1xuXG52YXIgbW92ZSA9IGZ1bmN0aW9uIG1vdmUoYXJyYXksIGZyb20sIHRvKSB7XG4gIHZhciBjb3B5ID0gY29weUFycmF5TGlrZShhcnJheSk7XG4gIHZhciB2YWx1ZSA9IGNvcHlbZnJvbV07XG4gIGNvcHkuc3BsaWNlKGZyb20sIDEpO1xuICBjb3B5LnNwbGljZSh0bywgMCwgdmFsdWUpO1xuICByZXR1cm4gY29weTtcbn07XG52YXIgc3dhcCA9IGZ1bmN0aW9uIHN3YXAoYXJyYXlMaWtlLCBpbmRleEEsIGluZGV4Qikge1xuICB2YXIgY29weSA9IGNvcHlBcnJheUxpa2UoYXJyYXlMaWtlKTtcbiAgdmFyIGEgPSBjb3B5W2luZGV4QV07XG4gIGNvcHlbaW5kZXhBXSA9IGNvcHlbaW5kZXhCXTtcbiAgY29weVtpbmRleEJdID0gYTtcbiAgcmV0dXJuIGNvcHk7XG59O1xudmFyIGluc2VydCA9IGZ1bmN0aW9uIGluc2VydChhcnJheUxpa2UsIGluZGV4LCB2YWx1ZSkge1xuICB2YXIgY29weSA9IGNvcHlBcnJheUxpa2UoYXJyYXlMaWtlKTtcbiAgY29weS5zcGxpY2UoaW5kZXgsIDAsIHZhbHVlKTtcbiAgcmV0dXJuIGNvcHk7XG59O1xudmFyIHJlcGxhY2UgPSBmdW5jdGlvbiByZXBsYWNlKGFycmF5TGlrZSwgaW5kZXgsIHZhbHVlKSB7XG4gIHZhciBjb3B5ID0gY29weUFycmF5TGlrZShhcnJheUxpa2UpO1xuICBjb3B5W2luZGV4XSA9IHZhbHVlO1xuICByZXR1cm4gY29weTtcbn07XG5cbnZhciBjb3B5QXJyYXlMaWtlID0gZnVuY3Rpb24gY29weUFycmF5TGlrZShhcnJheUxpa2UpIHtcbiAgaWYgKCFhcnJheUxpa2UpIHtcbiAgICByZXR1cm4gW107XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcnJheUxpa2UpKSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdChhcnJheUxpa2UpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXhJbmRleCA9IE9iamVjdC5rZXlzKGFycmF5TGlrZSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBwYXJzZUludChrZXkpO1xuICAgIH0pLnJlZHVjZShmdW5jdGlvbiAobWF4LCBlbCkge1xuICAgICAgcmV0dXJuIGVsID4gbWF4ID8gZWwgOiBtYXg7XG4gICAgfSwgMCk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oX2V4dGVuZHMoe30sIGFycmF5TGlrZSwge1xuICAgICAgbGVuZ3RoOiBtYXhJbmRleCArIDFcbiAgICB9KSk7XG4gIH1cbn07XG5cbnZhciBGaWVsZEFycmF5SW5uZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgX2luaGVyaXRzTG9vc2UoRmllbGRBcnJheUlubmVyLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBGaWVsZEFycmF5SW5uZXIocHJvcHMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9SZWFjdCRDb21wb25lbnQuY2FsbCh0aGlzLCBwcm9wcykgfHwgdGhpcztcblxuICAgIF90aGlzLnVwZGF0ZUFycmF5RmllbGQgPSBmdW5jdGlvbiAoZm4sIGFsdGVyVG91Y2hlZCwgYWx0ZXJFcnJvcnMpIHtcbiAgICAgIHZhciBfdGhpcyRwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgIG5hbWUgPSBfdGhpcyRwcm9wcy5uYW1lLFxuICAgICAgICAgIHNldEZvcm1pa1N0YXRlID0gX3RoaXMkcHJvcHMuZm9ybWlrLnNldEZvcm1pa1N0YXRlO1xuICAgICAgc2V0Rm9ybWlrU3RhdGUoZnVuY3Rpb24gKHByZXZTdGF0ZSkge1xuICAgICAgICB2YXIgdXBkYXRlRXJyb3JzID0gdHlwZW9mIGFsdGVyRXJyb3JzID09PSAnZnVuY3Rpb24nID8gYWx0ZXJFcnJvcnMgOiBmbjtcbiAgICAgICAgdmFyIHVwZGF0ZVRvdWNoZWQgPSB0eXBlb2YgYWx0ZXJUb3VjaGVkID09PSAnZnVuY3Rpb24nID8gYWx0ZXJUb3VjaGVkIDogZm47IC8vIHZhbHVlcyBmbiBzaG91bGQgYmUgZXhlY3V0ZWQgYmVmb3JlIHVwZGF0ZUVycm9ycyBhbmQgdXBkYXRlVG91Y2hlZCxcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGl0IGNhdXNlcyBhbiBlcnJvciB3aXRoIHVuc2hpZnQuXG5cbiAgICAgICAgdmFyIHZhbHVlcyA9IHNldEluKHByZXZTdGF0ZS52YWx1ZXMsIG5hbWUsIGZuKGdldEluKHByZXZTdGF0ZS52YWx1ZXMsIG5hbWUpKSk7XG4gICAgICAgIHZhciBmaWVsZEVycm9yID0gYWx0ZXJFcnJvcnMgPyB1cGRhdGVFcnJvcnMoZ2V0SW4ocHJldlN0YXRlLmVycm9ycywgbmFtZSkpIDogdW5kZWZpbmVkO1xuICAgICAgICB2YXIgZmllbGRUb3VjaGVkID0gYWx0ZXJUb3VjaGVkID8gdXBkYXRlVG91Y2hlZChnZXRJbihwcmV2U3RhdGUudG91Y2hlZCwgbmFtZSkpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChpc0VtcHR5QXJyYXkoZmllbGRFcnJvcikpIHtcbiAgICAgICAgICBmaWVsZEVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRW1wdHlBcnJheShmaWVsZFRvdWNoZWQpKSB7XG4gICAgICAgICAgZmllbGRUb3VjaGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBwcmV2U3RhdGUsIHtcbiAgICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcbiAgICAgICAgICBlcnJvcnM6IGFsdGVyRXJyb3JzID8gc2V0SW4ocHJldlN0YXRlLmVycm9ycywgbmFtZSwgZmllbGRFcnJvcikgOiBwcmV2U3RhdGUuZXJyb3JzLFxuICAgICAgICAgIHRvdWNoZWQ6IGFsdGVyVG91Y2hlZCA/IHNldEluKHByZXZTdGF0ZS50b3VjaGVkLCBuYW1lLCBmaWVsZFRvdWNoZWQpIDogcHJldlN0YXRlLnRvdWNoZWRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX3RoaXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF90aGlzLnVwZGF0ZUFycmF5RmllbGQoZnVuY3Rpb24gKGFycmF5TGlrZSkge1xuICAgICAgICByZXR1cm4gW10uY29uY2F0KGNvcHlBcnJheUxpa2UoYXJyYXlMaWtlKSwgW2Nsb25lRGVlcCh2YWx1ZSldKTtcbiAgICAgIH0sIGZhbHNlLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIF90aGlzLmhhbmRsZVB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5wdXNoKHZhbHVlKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIF90aGlzLnN3YXAgPSBmdW5jdGlvbiAoaW5kZXhBLCBpbmRleEIpIHtcbiAgICAgIHJldHVybiBfdGhpcy51cGRhdGVBcnJheUZpZWxkKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gc3dhcChhcnJheSwgaW5kZXhBLCBpbmRleEIpO1xuICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIF90aGlzLmhhbmRsZVN3YXAgPSBmdW5jdGlvbiAoaW5kZXhBLCBpbmRleEIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5zd2FwKGluZGV4QSwgaW5kZXhCKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIF90aGlzLm1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICAgIHJldHVybiBfdGhpcy51cGRhdGVBcnJheUZpZWxkKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gbW92ZShhcnJheSwgZnJvbSwgdG8pO1xuICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIF90aGlzLmhhbmRsZU1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5tb3ZlKGZyb20sIHRvKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIF90aGlzLmluc2VydCA9IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBfdGhpcy51cGRhdGVBcnJheUZpZWxkKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0KGFycmF5LCBpbmRleCwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQoYXJyYXksIGluZGV4LCBudWxsKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0KGFycmF5LCBpbmRleCwgbnVsbCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX3RoaXMuaGFuZGxlSW5zZXJ0ID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmluc2VydChpbmRleCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgX3RoaXMucmVwbGFjZSA9IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBfdGhpcy51cGRhdGVBcnJheUZpZWxkKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gcmVwbGFjZShhcnJheSwgaW5kZXgsIHZhbHVlKTtcbiAgICAgIH0sIGZhbHNlLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIF90aGlzLmhhbmRsZVJlcGxhY2UgPSBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMucmVwbGFjZShpbmRleCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgX3RoaXMudW5zaGlmdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIGxlbmd0aCA9IC0xO1xuXG4gICAgICBfdGhpcy51cGRhdGVBcnJheUZpZWxkKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICB2YXIgYXJyID0gYXJyYXkgPyBbdmFsdWVdLmNvbmNhdChhcnJheSkgOiBbdmFsdWVdO1xuXG4gICAgICAgIGlmIChsZW5ndGggPCAwKSB7XG4gICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgICB9LCBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgdmFyIGFyciA9IGFycmF5ID8gW251bGxdLmNvbmNhdChhcnJheSkgOiBbbnVsbF07XG5cbiAgICAgICAgaWYgKGxlbmd0aCA8IDApIHtcbiAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgIH0sIGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICB2YXIgYXJyID0gYXJyYXkgPyBbbnVsbF0uY29uY2F0KGFycmF5KSA6IFtudWxsXTtcblxuICAgICAgICBpZiAobGVuZ3RoIDwgMCkge1xuICAgICAgICAgIGxlbmd0aCA9IGFyci5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfTtcblxuICAgIF90aGlzLmhhbmRsZVVuc2hpZnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy51bnNoaWZ0KHZhbHVlKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIF90aGlzLmhhbmRsZVJlbW92ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlbW92ZShpbmRleCk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBfdGhpcy5oYW5kbGVQb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMucG9wKCk7XG4gICAgICB9O1xuICAgIH07IC8vIFdlIG5lZWQgVHlwZVNjcmlwdCBnZW5lcmljcyBvbiB0aGVzZSwgc28gd2UnbGwgYmluZCB0aGVtIGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIC8vIEB0b2RvIEZpeCBUUyAzLjIuMVxuXG5cbiAgICBfdGhpcy5yZW1vdmUgPSBfdGhpcy5yZW1vdmUuYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgX3RoaXMucG9wID0gX3RoaXMucG9wLmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBGaWVsZEFycmF5SW5uZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5jb21wb25lbnREaWRVcGRhdGUgPSBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudmFsaWRhdGVPbkNoYW5nZSAmJiB0aGlzLnByb3BzLmZvcm1pay52YWxpZGF0ZU9uQ2hhbmdlICYmICFpc0VxdWFsKGdldEluKHByZXZQcm9wcy5mb3JtaWsudmFsdWVzLCBwcmV2UHJvcHMubmFtZSksIGdldEluKHRoaXMucHJvcHMuZm9ybWlrLnZhbHVlcywgdGhpcy5wcm9wcy5uYW1lKSkpIHtcbiAgICAgIHRoaXMucHJvcHMuZm9ybWlrLnZhbGlkYXRlRm9ybSh0aGlzLnByb3BzLmZvcm1pay52YWx1ZXMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKGluZGV4KSB7XG4gICAgLy8gV2UgbmVlZCB0byBtYWtlIHN1cmUgd2UgYWxzbyByZW1vdmUgcmVsZXZhbnQgcGllY2VzIG9mIGB0b3VjaGVkYCBhbmQgYGVycm9yc2BcbiAgICB2YXIgcmVzdWx0O1xuICAgIHRoaXMudXBkYXRlQXJyYXlGaWVsZCggLy8gc28gdGhpcyBnZXRzIGNhbGwgMyB0aW1lc1xuICAgIGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgdmFyIGNvcHkgPSBhcnJheSA/IGNvcHlBcnJheUxpa2UoYXJyYXkpIDogW107XG5cbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHlbaW5kZXhdO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNGdW5jdGlvbihjb3B5LnNwbGljZSkpIHtcbiAgICAgICAgY29weS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29weTtcbiAgICB9LCB0cnVlLCB0cnVlKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIF9wcm90by5wb3AgPSBmdW5jdGlvbiBwb3AoKSB7XG4gICAgLy8gUmVtb3ZlIHJlbGV2YW50IHBpZWNlcyBvZiBgdG91Y2hlZGAgYW5kIGBlcnJvcnNgIHRvbyFcbiAgICB2YXIgcmVzdWx0O1xuICAgIHRoaXMudXBkYXRlQXJyYXlGaWVsZCggLy8gc28gdGhpcyBnZXRzIGNhbGwgMyB0aW1lc1xuICAgIGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgdmFyIHRtcCA9IGFycmF5O1xuXG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSB0bXAgJiYgdG1wLnBvcCAmJiB0bXAucG9wKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0bXA7XG4gICAgfSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBfcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBhcnJheUhlbHBlcnMgPSB7XG4gICAgICBwdXNoOiB0aGlzLnB1c2gsXG4gICAgICBwb3A6IHRoaXMucG9wLFxuICAgICAgc3dhcDogdGhpcy5zd2FwLFxuICAgICAgbW92ZTogdGhpcy5tb3ZlLFxuICAgICAgaW5zZXJ0OiB0aGlzLmluc2VydCxcbiAgICAgIHJlcGxhY2U6IHRoaXMucmVwbGFjZSxcbiAgICAgIHVuc2hpZnQ6IHRoaXMudW5zaGlmdCxcbiAgICAgIHJlbW92ZTogdGhpcy5yZW1vdmUsXG4gICAgICBoYW5kbGVQdXNoOiB0aGlzLmhhbmRsZVB1c2gsXG4gICAgICBoYW5kbGVQb3A6IHRoaXMuaGFuZGxlUG9wLFxuICAgICAgaGFuZGxlU3dhcDogdGhpcy5oYW5kbGVTd2FwLFxuICAgICAgaGFuZGxlTW92ZTogdGhpcy5oYW5kbGVNb3ZlLFxuICAgICAgaGFuZGxlSW5zZXJ0OiB0aGlzLmhhbmRsZUluc2VydCxcbiAgICAgIGhhbmRsZVJlcGxhY2U6IHRoaXMuaGFuZGxlUmVwbGFjZSxcbiAgICAgIGhhbmRsZVVuc2hpZnQ6IHRoaXMuaGFuZGxlVW5zaGlmdCxcbiAgICAgIGhhbmRsZVJlbW92ZTogdGhpcy5oYW5kbGVSZW1vdmVcbiAgICB9O1xuXG4gICAgdmFyIF90aGlzJHByb3BzMiA9IHRoaXMucHJvcHMsXG4gICAgICAgIGNvbXBvbmVudCA9IF90aGlzJHByb3BzMi5jb21wb25lbnQsXG4gICAgICAgIHJlbmRlciA9IF90aGlzJHByb3BzMi5yZW5kZXIsXG4gICAgICAgIGNoaWxkcmVuID0gX3RoaXMkcHJvcHMyLmNoaWxkcmVuLFxuICAgICAgICBuYW1lID0gX3RoaXMkcHJvcHMyLm5hbWUsXG4gICAgICAgIF90aGlzJHByb3BzMiRmb3JtaWsgPSBfdGhpcyRwcm9wczIuZm9ybWlrLFxuICAgICAgICByZXN0T2ZGb3JtaWsgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfdGhpcyRwcm9wczIkZm9ybWlrLCBbXCJ2YWxpZGF0ZVwiLCBcInZhbGlkYXRpb25TY2hlbWFcIl0pO1xuXG4gICAgdmFyIHByb3BzID0gX2V4dGVuZHMoe30sIGFycmF5SGVscGVycywge1xuICAgICAgZm9ybTogcmVzdE9mRm9ybWlrLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudCA/IGNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCBwcm9wcykgOiByZW5kZXIgPyByZW5kZXIocHJvcHMpIDogY2hpbGRyZW4gLy8gY2hpbGRyZW4gY29tZSBsYXN0LCBhbHdheXMgY2FsbGVkXG4gICAgPyB0eXBlb2YgY2hpbGRyZW4gPT09ICdmdW5jdGlvbicgPyBjaGlsZHJlbihwcm9wcykgOiAhaXNFbXB0eUNoaWxkcmVuKGNoaWxkcmVuKSA/IENoaWxkcmVuLm9ubHkoY2hpbGRyZW4pIDogbnVsbCA6IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIEZpZWxkQXJyYXlJbm5lcjtcbn0oQ29tcG9uZW50KTtcblxuRmllbGRBcnJheUlubmVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgdmFsaWRhdGVPbkNoYW5nZTogdHJ1ZVxufTtcbnZhciBGaWVsZEFycmF5ID0gLyojX19QVVJFX18qL2Nvbm5lY3QoRmllbGRBcnJheUlubmVyKTtcblxudmFyIEVycm9yTWVzc2FnZUltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgX2luaGVyaXRzTG9vc2UoRXJyb3JNZXNzYWdlSW1wbCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gRXJyb3JNZXNzYWdlSW1wbCgpIHtcbiAgICByZXR1cm4gX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gRXJyb3JNZXNzYWdlSW1wbC5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IGZ1bmN0aW9uIHNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcykge1xuICAgIGlmIChnZXRJbih0aGlzLnByb3BzLmZvcm1pay5lcnJvcnMsIHRoaXMucHJvcHMubmFtZSkgIT09IGdldEluKHByb3BzLmZvcm1pay5lcnJvcnMsIHRoaXMucHJvcHMubmFtZSkgfHwgZ2V0SW4odGhpcy5wcm9wcy5mb3JtaWsudG91Y2hlZCwgdGhpcy5wcm9wcy5uYW1lKSAhPT0gZ2V0SW4ocHJvcHMuZm9ybWlrLnRvdWNoZWQsIHRoaXMucHJvcHMubmFtZSkgfHwgT2JqZWN0LmtleXModGhpcy5wcm9wcykubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhwcm9wcykubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyRwcm9wcyA9IHRoaXMucHJvcHMsXG4gICAgICAgIGNvbXBvbmVudCA9IF90aGlzJHByb3BzLmNvbXBvbmVudCxcbiAgICAgICAgZm9ybWlrID0gX3RoaXMkcHJvcHMuZm9ybWlrLFxuICAgICAgICByZW5kZXIgPSBfdGhpcyRwcm9wcy5yZW5kZXIsXG4gICAgICAgIGNoaWxkcmVuID0gX3RoaXMkcHJvcHMuY2hpbGRyZW4sXG4gICAgICAgIG5hbWUgPSBfdGhpcyRwcm9wcy5uYW1lLFxuICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3RoaXMkcHJvcHMsIFtcImNvbXBvbmVudFwiLCBcImZvcm1pa1wiLCBcInJlbmRlclwiLCBcImNoaWxkcmVuXCIsIFwibmFtZVwiXSk7XG5cbiAgICB2YXIgdG91Y2ggPSBnZXRJbihmb3JtaWsudG91Y2hlZCwgbmFtZSk7XG4gICAgdmFyIGVycm9yID0gZ2V0SW4oZm9ybWlrLmVycm9ycywgbmFtZSk7XG4gICAgcmV0dXJuICEhdG91Y2ggJiYgISFlcnJvciA/IHJlbmRlciA/IGlzRnVuY3Rpb24ocmVuZGVyKSA/IHJlbmRlcihlcnJvcikgOiBudWxsIDogY2hpbGRyZW4gPyBpc0Z1bmN0aW9uKGNoaWxkcmVuKSA/IGNoaWxkcmVuKGVycm9yKSA6IG51bGwgOiBjb21wb25lbnQgPyBjcmVhdGVFbGVtZW50KGNvbXBvbmVudCwgcmVzdCwgZXJyb3IpIDogZXJyb3IgOiBudWxsO1xuICB9O1xuXG4gIHJldHVybiBFcnJvck1lc3NhZ2VJbXBsO1xufShDb21wb25lbnQpO1xuXG52YXIgRXJyb3JNZXNzYWdlID0gLyojX19QVVJFX18qL2Nvbm5lY3QoRXJyb3JNZXNzYWdlSW1wbCk7XG5cbi8qKlxyXG4gKiBDdXN0b20gRmllbGQgY29tcG9uZW50IGZvciBxdWlja2x5IGhvb2tpbmcgaW50byBGb3JtaWtcclxuICogY29udGV4dCBhbmQgd2lyaW5nIHVwIGZvcm1zLlxyXG4gKi9cblxudmFyIEZhc3RGaWVsZElubmVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gIF9pbmhlcml0c0xvb3NlKEZhc3RGaWVsZElubmVyLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBGYXN0RmllbGRJbm5lcihwcm9wcykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX1JlYWN0JENvbXBvbmVudC5jYWxsKHRoaXMsIHByb3BzKSB8fCB0aGlzO1xuICAgIHZhciByZW5kZXIgPSBwcm9wcy5yZW5kZXIsXG4gICAgICAgIGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW4sXG4gICAgICAgIGNvbXBvbmVudCA9IHByb3BzLmNvbXBvbmVudCxcbiAgICAgICAgaXMgPSBwcm9wcy5hcyxcbiAgICAgICAgbmFtZSA9IHByb3BzLm5hbWU7XG4gICAgISFyZW5kZXIgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIFwiPEZhc3RGaWVsZCByZW5kZXI+IGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgYSBjaGlsZCBjYWxsYmFjayBmdW5jdGlvbiBpbnN0ZWFkOiA8RmFzdEZpZWxkIG5hbWU9e1wiICsgbmFtZSArIFwifT57cHJvcHMgPT4gLi4ufTwvRmFzdEZpZWxkPiBpbnN0ZWFkLlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgISEoY29tcG9uZW50ICYmIHJlbmRlcikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsICdZb3Ugc2hvdWxkIG5vdCB1c2UgPEZhc3RGaWVsZCBjb21wb25lbnQ+IGFuZCA8RmFzdEZpZWxkIHJlbmRlcj4gaW4gdGhlIHNhbWUgPEZhc3RGaWVsZD4gY29tcG9uZW50OyA8RmFzdEZpZWxkIGNvbXBvbmVudD4gd2lsbCBiZSBpZ25vcmVkJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdm9pZCAwO1xuICAgICEhKGlzICYmIGNoaWxkcmVuICYmIGlzRnVuY3Rpb24oY2hpbGRyZW4pKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgJ1lvdSBzaG91bGQgbm90IHVzZSA8RmFzdEZpZWxkIGFzPiBhbmQgPEZhc3RGaWVsZCBjaGlsZHJlbj4gYXMgYSBmdW5jdGlvbiBpbiB0aGUgc2FtZSA8RmFzdEZpZWxkPiBjb21wb25lbnQ7IDxGYXN0RmllbGQgYXM+IHdpbGwgYmUgaWdub3JlZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgISEoY29tcG9uZW50ICYmIGNoaWxkcmVuICYmIGlzRnVuY3Rpb24oY2hpbGRyZW4pKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgJ1lvdSBzaG91bGQgbm90IHVzZSA8RmFzdEZpZWxkIGNvbXBvbmVudD4gYW5kIDxGYXN0RmllbGQgY2hpbGRyZW4+IGFzIGEgZnVuY3Rpb24gaW4gdGhlIHNhbWUgPEZhc3RGaWVsZD4gY29tcG9uZW50OyA8RmFzdEZpZWxkIGNvbXBvbmVudD4gd2lsbCBiZSBpZ25vcmVkLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgICAhIShyZW5kZXIgJiYgY2hpbGRyZW4gJiYgIWlzRW1wdHlDaGlsZHJlbihjaGlsZHJlbikpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCAnWW91IHNob3VsZCBub3QgdXNlIDxGYXN0RmllbGQgcmVuZGVyPiBhbmQgPEZhc3RGaWVsZCBjaGlsZHJlbj4gaW4gdGhlIHNhbWUgPEZhc3RGaWVsZD4gY29tcG9uZW50OyA8RmFzdEZpZWxkIGNoaWxkcmVuPiB3aWxsIGJlIGlnbm9yZWQnKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEZhc3RGaWVsZElubmVyLnByb3RvdHlwZTtcblxuICBfcHJvdG8uc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gZnVuY3Rpb24gc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdWxkVXBkYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5zaG91bGRVcGRhdGUocHJvcHMsIHRoaXMucHJvcHMpO1xuICAgIH0gZWxzZSBpZiAocHJvcHMubmFtZSAhPT0gdGhpcy5wcm9wcy5uYW1lIHx8IGdldEluKHByb3BzLmZvcm1pay52YWx1ZXMsIHRoaXMucHJvcHMubmFtZSkgIT09IGdldEluKHRoaXMucHJvcHMuZm9ybWlrLnZhbHVlcywgdGhpcy5wcm9wcy5uYW1lKSB8fCBnZXRJbihwcm9wcy5mb3JtaWsuZXJyb3JzLCB0aGlzLnByb3BzLm5hbWUpICE9PSBnZXRJbih0aGlzLnByb3BzLmZvcm1pay5lcnJvcnMsIHRoaXMucHJvcHMubmFtZSkgfHwgZ2V0SW4ocHJvcHMuZm9ybWlrLnRvdWNoZWQsIHRoaXMucHJvcHMubmFtZSkgIT09IGdldEluKHRoaXMucHJvcHMuZm9ybWlrLnRvdWNoZWQsIHRoaXMucHJvcHMubmFtZSkgfHwgT2JqZWN0LmtleXModGhpcy5wcm9wcykubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhwcm9wcykubGVuZ3RoIHx8IHByb3BzLmZvcm1pay5pc1N1Ym1pdHRpbmcgIT09IHRoaXMucHJvcHMuZm9ybWlrLmlzU3VibWl0dGluZykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gUmVnaXN0ZXIgdGhlIEZpZWxkIHdpdGggdGhlIHBhcmVudCBGb3JtaWsuIFBhcmVudCB3aWxsIGN5Y2xlIHRocm91Z2hcbiAgICAvLyByZWdpc3RlcmVkIEZpZWxkJ3MgdmFsaWRhdGUgZm5zIHJpZ2h0IHByaW9yIHRvIHN1Ym1pdFxuICAgIHRoaXMucHJvcHMuZm9ybWlrLnJlZ2lzdGVyRmllbGQodGhpcy5wcm9wcy5uYW1lLCB7XG4gICAgICB2YWxpZGF0ZTogdGhpcy5wcm9wcy52YWxpZGF0ZVxuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5jb21wb25lbnREaWRVcGRhdGUgPSBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubmFtZSAhPT0gcHJldlByb3BzLm5hbWUpIHtcbiAgICAgIHRoaXMucHJvcHMuZm9ybWlrLnVucmVnaXN0ZXJGaWVsZChwcmV2UHJvcHMubmFtZSk7XG4gICAgICB0aGlzLnByb3BzLmZvcm1pay5yZWdpc3RlckZpZWxkKHRoaXMucHJvcHMubmFtZSwge1xuICAgICAgICB2YWxpZGF0ZTogdGhpcy5wcm9wcy52YWxpZGF0ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMudmFsaWRhdGUgIT09IHByZXZQcm9wcy52YWxpZGF0ZSkge1xuICAgICAgdGhpcy5wcm9wcy5mb3JtaWsucmVnaXN0ZXJGaWVsZCh0aGlzLnByb3BzLm5hbWUsIHtcbiAgICAgICAgdmFsaWRhdGU6IHRoaXMucHJvcHMudmFsaWRhdGVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uY29tcG9uZW50V2lsbFVubW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmZvcm1pay51bnJlZ2lzdGVyRmllbGQodGhpcy5wcm9wcy5uYW1lKTtcbiAgfTtcblxuICBfcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyRwcm9wcyA9IHRoaXMucHJvcHMsXG4gICAgICAgIG5hbWUgPSBfdGhpcyRwcm9wcy5uYW1lLFxuICAgICAgICByZW5kZXIgPSBfdGhpcyRwcm9wcy5yZW5kZXIsXG4gICAgICAgIGlzID0gX3RoaXMkcHJvcHMuYXMsXG4gICAgICAgIGNoaWxkcmVuID0gX3RoaXMkcHJvcHMuY2hpbGRyZW4sXG4gICAgICAgIGNvbXBvbmVudCA9IF90aGlzJHByb3BzLmNvbXBvbmVudCxcbiAgICAgICAgZm9ybWlrID0gX3RoaXMkcHJvcHMuZm9ybWlrLFxuICAgICAgICBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF90aGlzJHByb3BzLCBbXCJ2YWxpZGF0ZVwiLCBcIm5hbWVcIiwgXCJyZW5kZXJcIiwgXCJhc1wiLCBcImNoaWxkcmVuXCIsIFwiY29tcG9uZW50XCIsIFwic2hvdWxkVXBkYXRlXCIsIFwiZm9ybWlrXCJdKTtcblxuICAgIHZhciByZXN0T2ZGb3JtaWsgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShmb3JtaWssIFtcInZhbGlkYXRlXCIsIFwidmFsaWRhdGlvblNjaGVtYVwiXSk7XG5cbiAgICB2YXIgZmllbGQgPSBmb3JtaWsuZ2V0RmllbGRQcm9wcyhfZXh0ZW5kcyh7XG4gICAgICBuYW1lOiBuYW1lXG4gICAgfSwgcHJvcHMpKTtcbiAgICB2YXIgbWV0YSA9IHtcbiAgICAgIHZhbHVlOiBnZXRJbihmb3JtaWsudmFsdWVzLCBuYW1lKSxcbiAgICAgIGVycm9yOiBnZXRJbihmb3JtaWsuZXJyb3JzLCBuYW1lKSxcbiAgICAgIHRvdWNoZWQ6ICEhZ2V0SW4oZm9ybWlrLnRvdWNoZWQsIG5hbWUpLFxuICAgICAgaW5pdGlhbFZhbHVlOiBnZXRJbihmb3JtaWsuaW5pdGlhbFZhbHVlcywgbmFtZSksXG4gICAgICBpbml0aWFsVG91Y2hlZDogISFnZXRJbihmb3JtaWsuaW5pdGlhbFRvdWNoZWQsIG5hbWUpLFxuICAgICAgaW5pdGlhbEVycm9yOiBnZXRJbihmb3JtaWsuaW5pdGlhbEVycm9ycywgbmFtZSlcbiAgICB9O1xuICAgIHZhciBiYWcgPSB7XG4gICAgICBmaWVsZDogZmllbGQsXG4gICAgICBtZXRhOiBtZXRhLFxuICAgICAgZm9ybTogcmVzdE9mRm9ybWlrXG4gICAgfTtcblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHJldHVybiByZW5kZXIoYmFnKTtcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjaGlsZHJlbikpIHtcbiAgICAgIHJldHVybiBjaGlsZHJlbihiYWcpO1xuICAgIH1cblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIC8vIFRoaXMgYmVoYXZpb3IgaXMgYmFja3dhcmRzIGNvbXBhdCB3aXRoIGVhcmxpZXIgRm9ybWlrIDAuOSB0byAxLnhcbiAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgaW5uZXJSZWYgPSBwcm9wcy5pbm5lclJlZixcbiAgICAgICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShwcm9wcywgW1wiaW5uZXJSZWZcIl0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGNvbXBvbmVudCwgX2V4dGVuZHMoe1xuICAgICAgICAgIHJlZjogaW5uZXJSZWZcbiAgICAgICAgfSwgZmllbGQsIHJlc3QpLCBjaGlsZHJlbik7XG4gICAgICB9IC8vIFdlIGRvbid0IHBhc3MgYG1ldGFgIGZvciBiYWNrd2FyZHMgY29tcGF0XG5cblxuICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoY29tcG9uZW50LCBfZXh0ZW5kcyh7XG4gICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgZm9ybTogZm9ybWlrXG4gICAgICB9LCBwcm9wcyksIGNoaWxkcmVuKTtcbiAgICB9IC8vIGRlZmF1bHQgdG8gaW5wdXQgaGVyZSBzbyB3ZSBjYW4gY2hlY2sgZm9yIGJvdGggYGFzYCBhbmQgYGNoaWxkcmVuYCBhYm92ZVxuXG5cbiAgICB2YXIgYXNFbGVtZW50ID0gaXMgfHwgJ2lucHV0JztcblxuICAgIGlmICh0eXBlb2YgYXNFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIF9pbm5lclJlZiA9IHByb3BzLmlubmVyUmVmLFxuICAgICAgICAgIF9yZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UocHJvcHMsIFtcImlubmVyUmVmXCJdKTtcblxuICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoYXNFbGVtZW50LCBfZXh0ZW5kcyh7XG4gICAgICAgIHJlZjogX2lubmVyUmVmXG4gICAgICB9LCBmaWVsZCwgX3Jlc3QpLCBjaGlsZHJlbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoYXNFbGVtZW50LCBfZXh0ZW5kcyh7fSwgZmllbGQsIHByb3BzKSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIHJldHVybiBGYXN0RmllbGRJbm5lcjtcbn0oQ29tcG9uZW50KTtcblxudmFyIEZhc3RGaWVsZCA9IC8qI19fUFVSRV9fKi9jb25uZWN0KEZhc3RGaWVsZElubmVyKTtcblxuZXhwb3J0IHsgRXJyb3JNZXNzYWdlLCBGYXN0RmllbGQsIEZpZWxkLCBGaWVsZEFycmF5LCBGb3JtLCBGb3JtaWssIEZvcm1pa0NvbnN1bWVyLCBGb3JtaWtDb250ZXh0LCBGb3JtaWtQcm92aWRlciwgY29ubmVjdCwgZ2V0QWN0aXZlRWxlbWVudCwgZ2V0SW4sIGluc2VydCwgaXNFbXB0eUFycmF5LCBpc0VtcHR5Q2hpbGRyZW4sIGlzRnVuY3Rpb24sIGlzSW5wdXRFdmVudCwgaXNJbnRlZ2VyLCBpc05hTiQxIGFzIGlzTmFOLCBpc09iamVjdCwgaXNQcm9taXNlLCBpc1N0cmluZywgbW92ZSwgcHJlcGFyZURhdGFGb3JWYWxpZGF0aW9uLCByZXBsYWNlLCBzZXRJbiwgc2V0TmVzdGVkT2JqZWN0VmFsdWVzLCBzd2FwLCB1c2VGaWVsZCwgdXNlRm9ybWlrLCB1c2VGb3JtaWtDb250ZXh0LCB2YWxpZGF0ZVl1cFNjaGVtYSwgd2l0aEZvcm1paywgeXVwVG9Gb3JtRXJyb3JzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtaWsuZXNtLmpzLm1hcFxuIl0sIm5hbWVzIjpbIlN5bWJvbCIsIm9iamVjdFByb3RvIiwibmF0aXZlT2JqZWN0VG9TdHJpbmciLCJzeW1Ub1N0cmluZ1RhZyIsImhhc093blByb3BlcnR5IiwiZnVuY1Byb3RvIiwiZnVuY1RvU3RyaW5nIiwiSEFTSF9VTkRFRklORUQiLCJpc0FycmF5IiwiTUFYX1NBRkVfSU5URUdFUiIsImFyZ3NUYWciLCJmdW5jVGFnIiwib2JqZWN0VGFnIiwiZnJlZUV4cG9ydHMiLCJmcmVlTW9kdWxlIiwibW9kdWxlRXhwb3J0cyIsIkJ1ZmZlciIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwibmF0aXZlR2V0U3ltYm9scyIsIlByb21pc2UiLCJXZWFrTWFwIiwibWFwVGFnIiwic2V0VGFnIiwid2Vha01hcFRhZyIsImRhdGFWaWV3VGFnIiwiYm9vbFRhZyIsImRhdGVUYWciLCJudW1iZXJUYWciLCJyZWdleHBUYWciLCJzdHJpbmdUYWciLCJhcnJheUJ1ZmZlclRhZyIsImZsb2F0MzJUYWciLCJmbG9hdDY0VGFnIiwiaW50OFRhZyIsImludDE2VGFnIiwiaW50MzJUYWciLCJ1aW50OFRhZyIsInVpbnQ4Q2xhbXBlZFRhZyIsInVpbnQxNlRhZyIsInVpbnQzMlRhZyIsImdldFRhZyIsImFycmF5VGFnIiwiZXJyb3JUYWciLCJnZW5UYWciLCJzeW1ib2xUYWciLCJDTE9ORV9TWU1CT0xTX0ZMQUciLCJJTkZJTklUWSIsInN5bWJvbFByb3RvIiwiaXNGdW5jdGlvbiIsImlzT2JqZWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJpc0VxdWFsIiwidXNlUmVmIiwidXNlRWZmZWN0IiwidXNlUmVkdWNlciIsInVzZUNhbGxiYWNrIiwiZGVlcG1lcmdlIiwidXNlTWVtbyIsInVzZUxheW91dEVmZmVjdCIsImZvcndhcmRSZWYiLCJjcmVhdGVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDNUIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMxQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUM5QyxJQUFJLGNBQWMsR0FBRyxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDcEQ7QUFDQSxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3JCO0FBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDM0I7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxRQUFRLElBQUksT0FBTyxDQUFDLElBQUksUUFBUSxFQUFFO0FBQzlELElBQUksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN6QixRQUFRLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFFBQVEsQ0FBQztBQUNULFFBQVEsTUFBTTtBQUNkLFFBQVEsR0FBRyxDQUFDO0FBQ1o7QUFDQSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtBQUN0QixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxNQUFN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
