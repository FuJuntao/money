/*! *****************************************************************************
Copyright (c) Microsoft Corporation.
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
    to[j] = from[i];
  return to;
}
var keys = Object.keys;
var isArray = Array.isArray;
var _global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object")
    return obj;
  keys(extension).forEach(function(key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function")
    extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? {get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true} : {value: functionOrGetSet, configurable: true, writable: true}, options));
}
function derive(Child) {
  return {
    from: function(Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  var pd = getOwnPropertyDescriptor(obj, prop);
  var proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b) {
  if (!b)
    throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate)
    setImmediate(fn);
  else
    setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce(function(result, item, i) {
    var nameAndValue = extractor(item, i);
    if (nameAndValue)
      result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath))
    return obj[keyPath];
  if (!keyPath)
    return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0)
    return;
  if ("isFrozen" in Object && Object.isFrozen(obj))
    return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else
            delete obj[currentKeyPath];
        } else
          obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj)
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath)))
          obj.splice(keyPath, 1);
        else
          delete obj[keyPath];
      } else
        obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string")
    setByKeyPath(obj, keyPath, void 0);
  else if ("length" in keyPath)
    [].map.call(keyPath, function(kp) {
      setByKeyPath(obj, kp, void 0);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m))
      rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map(function(num) {
  return ["Int", "Uint", "Float"].map(function(t) {
    return t + num + "Array";
  });
}))).filter(function(t) {
  return _global[t];
});
var intrinsicTypes = intrinsicTypeNames.map(function(t) {
  return _global[t];
});
var intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, function(x) {
  return [x, true];
});
var circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && new WeakMap();
  var rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object")
    return any;
  var rv = circularRefs && circularRefs.get(any);
  if (rv)
    return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    var proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
var toString = {}.toString;
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var getValueOf = function(val, type) {
  return type === "Array" ? "" + val.map(function(v) {
    return getValueOf(v, toStringTag(v));
  }) : type === "ArrayBuffer" ? "" + new Uint8Array(val) : type === "Date" ? val.getTime() : ArrayBuffer.isView(val) ? "" + new Uint8Array(val.buffer) : val;
};
function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach(function(prop) {
    if (!hasOwn(b, prop))
      rv[prfx + prop] = void 0;
    else {
      var ap = a[prop], bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        var apTypeName = toStringTag(ap);
        var bpTypeName = toStringTag(bp);
        if (apTypeName === bpTypeName) {
          if (intrinsicTypeNameSet[apTypeName] || isArray(ap)) {
            if (getValueOf(ap, apTypeName) !== getValueOf(bp, bpTypeName)) {
              rv[prfx + prop] = b[prop];
            }
          } else {
            getObjectDiff(ap, bp, rv, prfx + prop + ".");
          }
        } else {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp)
        rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach(function(prop) {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}
var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
  var i;
  return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function() {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike))
      return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done)
        a.push(x.value);
      return a;
    }
    if (arrayLike == null)
      return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--)
        a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--)
    a[i] = arguments[i];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
} : function() {
  return false;
};
var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = function() {
  return true;
};
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      getErrorWithStack.arguments;
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack)
    return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map(function(frame) {
    return "\n" + frame;
  }).join("");
}
var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait"
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone"
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function() {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg, failures) {
  return msg + ". Errors: " + Object.keys(failures).map(function(key) {
    return failures[key].toString();
  }).filter(function(v, i, s) {
    return s.indexOf(v) === i;
  }).join("\n");
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map(function(pos) {
    return failures[pos];
  });
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(function(obj, name) {
  return obj[name] = name + "Error", obj;
}, {});
var BaseException = DexieError;
var exceptions = errorList.reduce(function(obj, name) {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = "" + msgOrInner + (!inner ? "" : "\n " + inner);
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = msgOrInner.name + " " + msgOrInner.message;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
    return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", {get: function() {
      return this.inner.stack;
    }});
  }
  return rv;
}
var fullNameExceptions = errorList.reduce(function(obj, name) {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {
}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror)
    return f2;
  return function(val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function() {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res !== void 0)
      arguments[0] = res;
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function(modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    if (f2.apply(this, arguments) === false)
      return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this, i = arguments.length, args = new Array(i);
      while (i--)
        args[i] = arguments[i];
      return res.then(function() {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100, MAX_LONG_STACKS = 20, ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : function() {
  var globalP = Promise.resolve();
  if (typeof crypto === "undefined" || !crypto.subtle)
    return [globalP, getProto(globalP), globalP];
  var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [
    nativeP,
    getProto(nativeP),
    globalP
  ];
}(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? function() {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? function() {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(function() {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, {attributes: true});
  hiddenDiv.setAttribute("i", "1");
} : function() {
  setTimeout(physicalTick, 0);
};
var asap = function(callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], currentFulfiller = null, rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function() {
    this.unhandleds.forEach(function(uh) {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {
      }
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL)
      throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false)
      handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function() {
    var psd = PSD, microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var _this = this;
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      var cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise(function(resolve, reject) {
        propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function(value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function() {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function(onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function(onRejected) {
    if (arguments.length === 1)
      return this.then(null, onRejected);
    var type = arguments[0], handler = arguments[1];
    return typeof type === "function" ? this.then(null, function(err) {
      return err instanceof type ? handler(err) : PromiseReject(err);
    }) : this.then(null, function(err) {
      return err && err.name === type ? handler(err) : PromiseReject(err);
    });
  },
  finally: function(onFinally) {
    return this.then(function(value) {
      onFinally();
      return value;
    }, function(err) {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function() {
      if (this._stack)
        return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null)
          this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function(ms, msg) {
    var _this = this;
    return ms < Infinity ? new DexiePromise(function(resolve, reject) {
      var handle = setTimeout(function() {
        return reject(new exceptions.Timeout(msg));
      }, ms);
      _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      if (values.length === 0)
        resolve([]);
      var remaining = values.length;
      values.forEach(function(a, i) {
        return DexiePromise.resolve(a).then(function(x) {
          values[i] = x;
          if (!--remaining)
            resolve(values);
        }, reject);
      });
    });
  },
  resolve: function(value) {
    if (value instanceof DexiePromise)
      return value;
    if (value && typeof value.then === "function")
      return new DexiePromise(function(resolve, reject) {
        value.then(resolve, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      values.map(function(value) {
        return DexiePromise.resolve(value).then(resolve, reject);
      });
    });
  },
  PSD: {
    get: function() {
      return PSD;
    },
    set: function(value) {
      return PSD = value;
    }
  },
  totalEchoes: {get: function() {
    return totalEchoes;
  }},
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: function() {
      return asap;
    },
    set: function(value) {
      asap = value;
    }
  },
  rejectionMapper: {
    get: function() {
      return rejectionMapper;
    },
    set: function(value) {
      rejectionMapper = value;
    }
  },
  follow: function(fn, zoneProps) {
    return new DexiePromise(function(resolve, reject) {
      return newScope(function(resolve2, reject2) {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function() {
          var _this = this;
          run_at_end_of_this_or_next_physical_tick(function() {
            _this.unhandleds.length === 0 ? resolve2() : reject2(_this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function() {
      var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve) {
        if (possiblePromises.length === 0)
          resolve([]);
        var remaining = possiblePromises.length;
        var results = new Array(remaining);
        possiblePromises.forEach(function(p, i) {
          return DexiePromise.resolve(p).then(function(value) {
            return results[i] = {status: "fulfilled", value};
          }, function(reason) {
            return results[i] = {status: "rejected", reason};
          }).then(function() {
            return --remaining || resolve(results);
          });
        });
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function() {
      var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve, reject) {
        if (possiblePromises.length === 0)
          reject(new AggregateError([]));
        var remaining = possiblePromises.length;
        var failures = new Array(remaining);
        possiblePromises.forEach(function(p, i) {
          return DexiePromise.resolve(p).then(function(value) {
            return resolve(value);
          }, function(failure) {
            failures[i] = failure;
            if (!--remaining)
              reject(new AggregateError(failures));
          });
        });
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn(function(value) {
      if (promise._state !== null)
        return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, function(resolve, reject) {
          value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick)
        endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null)
    return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(function() {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: function() {
        return stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack;
      }
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick)
    endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(function() {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret, value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length)
        rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1)
        markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit)
    return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value, errorName, message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1)
      stacks.push(stack);
    if (promise._prev)
      getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach(function(p) {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i)
    finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(function() {
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some(function(p) {
    return p._value === promise._value;
  }))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i)
    if (unhandledErrors[--i]._value === promise._value) {
      unhandledErrors.splice(i, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function() {
    var wasRootExec = beginMicroTickScope(), outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec)
        endMicroTickScope();
    }
  };
}
var task = {awaits: 0, echoes: 0, id: 0};
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props2, a1, a2) {
  var parent = PSD, psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: {value: DexiePromise, configurable: true, writable: true},
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props2)
    extend(psd, props2);
  ++parent.ref;
  psd.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0)
    psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id)
    task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits)
    return false;
  if (--task.awaits === 0)
    task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then(function(x) {
      decrementExpectedAwaits();
      return x;
    }, function(e) {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD)
    return;
  PSD = targetZone;
  if (currentZone === globalPSD)
    globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise_1 = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise_1.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise_1.all = targetEnv.all;
      GlobalPromise_1.race = targetEnv.race;
      GlobalPromise_1.resolve = targetEnv.resolve;
      GlobalPromise_1.reject = targetEnv.reject;
      if (targetEnv.allSettled)
        GlobalPromise_1.allSettled = targetEnv.allSettled;
      if (targetEnv.any)
        GlobalPromise_1.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function() {
    var outerZone = PSD;
    if (possibleAwait)
      incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup)
        enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function(onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {
  }
  if (rv !== false)
    try {
      var event, eventData = {promise, reason: err};
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, {detail: eventData});
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {
          }
      }
      if (debug && event && !event.defaultPrevented) {
        console.warn("Unhandled rejection: " + (err.stack || err));
      }
    } catch (e) {
    }
}
var rejection = DexiePromise.reject;
function tempTransaction(db, mode, storeNames, fn) {
  if (!db._state.openComplete && !PSD.letThrough) {
    if (!db._state.isBeingOpened) {
      if (!db._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db.open().catch(nop);
    }
    return db._state.dbReadyPromise.then(function() {
      return tempTransaction(db, mode, storeNames, fn);
    });
  } else {
    var trans = db._createTransaction(mode, storeNames, db._dbSchema);
    try {
      trans.create();
    } catch (ex) {
      return rejection(ex);
    }
    return trans._promise(mode, function(resolve, reject) {
      return newScope(function() {
        PSD.trans = trans;
        return fn(resolve, reject, trans);
      });
    }).then(function(result) {
      return trans._completion.then(function() {
        return result;
      });
    });
  }
}
var DEXIE_VERSION = "3.1.0-alpha.10";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function(frame) {
  return !/(dexie\.js|dexie\.min\.js)/.test(frame);
};
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function() {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var domDeps;
try {
  domDeps = {
    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
  };
} catch (e) {
  domDeps = {indexedDB: null, IDBKeyRange: null};
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = function(IdbKeyRange) {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = function() {
      return [[]];
    };
    return [[]];
  } catch (e) {
    getMaxKey = function() {
      return maxString;
    };
    return maxString;
  }
};
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  get upper() {
    return getMaxKey(domDeps.IDBKeyRange);
  },
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
    if (obj[keyPath] === void 0 && keyPath in obj) {
      obj = deepClone(obj);
      delete obj[keyPath];
    }
    return obj;
  } : function(obj) {
    return obj;
  };
}
var Table = function() {
  function Table2() {
  }
  Table2.prototype._trans = function(mode, fn, writeLocked) {
    var trans = this._tx || PSD.trans;
    var tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans2) {
      if (!trans2.schema[tableName])
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    var wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
        return trans._promise(mode, checkTableInTransaction, writeLocked);
      }, {trans, transless: PSD.transless || PSD}) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec)
        endMicroTickScope();
    }
  };
  Table2.prototype.get = function(keyOrCrit, cb) {
    var _this = this;
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", function(trans) {
      return _this.core.get({trans, key: keyOrCrit}).then(function(res) {
        return _this.hook.reading.fire(res);
      });
    }).then(cb);
  };
  Table2.prototype.where = function(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, "[" + indexOrCrit.join("+") + "]");
    var keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
      return ix.compound && keyPaths.every(function(keyPath) {
        return ix.keyPath.indexOf(keyPath) >= 0;
      }) && ix.keyPath.every(function(keyPath) {
        return keyPaths.indexOf(keyPath) >= 0;
      });
    })[0];
    if (compoundIndex && this.db._maxKey !== maxString)
      return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map(function(kp) {
        return indexOrCrit[kp];
      }));
    if (!compoundIndex && debug)
      console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " + ("compound index [" + keyPaths.join("+") + "]"));
    var idxByName = this.schema.idxByName;
    var idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    var _a2 = keyPaths.reduce(function(_a3, keyPath) {
      var prevIndex = _a3[0], prevFilterFn = _a3[1];
      var index = idxByName[keyPath];
      var value = indexOrCrit[keyPath];
      return [
        prevIndex || index,
        prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
          var prop = getByKeyPath(x, keyPath);
          return isArray(prop) && prop.some(function(item) {
            return equals(value, item);
          });
        } : function(x) {
          return equals(value, getByKeyPath(x, keyPath));
        }) : prevFilterFn
      ];
    }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  };
  Table2.prototype.filter = function(filterFunction) {
    return this.toCollection().and(filterFunction);
  };
  Table2.prototype.count = function(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  };
  Table2.prototype.offset = function(offset) {
    return this.toCollection().offset(offset);
  };
  Table2.prototype.limit = function(numRows) {
    return this.toCollection().limit(numRows);
  };
  Table2.prototype.each = function(callback) {
    return this.toCollection().each(callback);
  };
  Table2.prototype.toArray = function(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  };
  Table2.prototype.toCollection = function() {
    return new this.db.Collection(new this.db.WhereClause(this));
  };
  Table2.prototype.orderBy = function(index) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? "[" + index.join("+") + "]" : index));
  };
  Table2.prototype.reverse = function() {
    return this.toCollection().reverse();
  };
  Table2.prototype.mapToClass = function(constructor) {
    this.schema.mappedClass = constructor;
    var readHook = function(obj) {
      if (!obj)
        return obj;
      var res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {
          }
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  };
  Table2.prototype.defineClass = function() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  };
  Table2.prototype.add = function(obj, key) {
    var _this = this;
    var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
    var objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd]});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
    }).then(function(lastResult) {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  };
  Table2.prototype.update = function(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0)
        return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach(function(keyPath) {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, {value: keyOrObject, primKey: key});
        }
      } catch (_a2) {
      }
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  };
  Table2.prototype.put = function(obj, key) {
    var _this = this;
    var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
    var objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
    }).then(function(lastResult) {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  };
  Table2.prototype.delete = function(key) {
    var _this = this;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "delete", keys: [key]});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
    });
  };
  Table2.prototype.clear = function() {
    var _this = this;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "deleteRange", range: AnyRange});
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
    });
  };
  Table2.prototype.bulkGet = function(keys2) {
    var _this = this;
    return this._trans("readonly", function(trans) {
      return _this.core.getMany({
        keys: keys2,
        trans
      }).then(function(result) {
        return result.map(function(res) {
          return _this.hook.reading.fire(res);
        });
      });
    });
  };
  Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
    var _this = this;
    var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    var wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", function(trans) {
      var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      var numObjects = objects.length;
      var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return _this.core.mutate({trans, type: "add", keys: keys2, values: objectsToAdd, wantResults}).then(function(_a3) {
        var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
        var result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", failures);
      });
    });
  };
  Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
    var _this = this;
    var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    var wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", function(trans) {
      var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      var numObjects = objects.length;
      var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return _this.core.mutate({trans, type: "put", keys: keys2, values: objectsToPut, wantResults}).then(function(_a3) {
        var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
        var result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", failures);
      });
    });
  };
  Table2.prototype.bulkDelete = function(keys2) {
    var _this = this;
    var numKeys = keys2.length;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({trans, type: "delete", keys: keys2});
    }).then(function(_a2) {
      var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
      if (numFailures === 0)
        return lastResult;
      throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
    });
  };
  return Table2;
}();
function Events(ctx) {
  var evs = {};
  var rv = function(eventName, subscriber) {
    if (subscriber) {
      var i2 = arguments.length, args = new Array(i2 - 1);
      while (--i2)
        args[i2 - 1] = arguments[i2];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object")
      return addConfiguredEvents(eventName);
    if (!chainFunction)
      chainFunction = reverseStoppableEventChain;
    if (!defaultFunction)
      defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function(cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function(cb) {
        context.subscribers = context.subscribers.filter(function(fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function(eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i2 = arguments.length, args2 = new Array(i2);
          while (i2--)
            args2[i2] = arguments[i2];
          context.subscribers.forEach(function(fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else
        throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({prototype});
  return constructor;
}
function createTableConstructor(db) {
  return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
    this.db = db;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
      creating: [hookCreatingChain, nop],
      reading: [pureFunctionChain, mirror],
      updating: [hookUpdatingChain, nop],
      deleting: [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? function() {
    return combine(curr(), factory());
  } : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey)
    return coreSchema.primaryKey;
  var index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index)
    throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index;
}
function openCursor(ctx, coreTable, trans) {
  var index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    var set_1 = {};
    var union = function(item, cursor, advance) {
      if (!filter || filter(cursor, advance, function(result) {
        return cursor.stop(result);
      }, function(err) {
        return cursor.fail(err);
      })) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set_1, key)) {
          set_1[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? function(x, c, a) {
    return fn(valueMapper(x), c, a);
  } : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then(function(cursor) {
    if (cursor) {
      return cursor.start(function() {
        var c = function() {
          return cursor.continue();
        };
        if (!filter || filter(cursor, function(advancer) {
          return c = advancer;
        }, function(val) {
          cursor.stop(val);
          c = nop;
        }, function(e) {
          cursor.fail(e);
          c = nop;
        }))
          wrappedFn(cursor.value, cursor, function(advancer) {
            return c = advancer;
          });
        c();
      });
    }
  });
}
var Collection = function() {
  function Collection2() {
  }
  Collection2.prototype._read = function(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  };
  Collection2.prototype._write = function(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  };
  Collection2.prototype._addAlgorithm = function(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  };
  Collection2.prototype._iterate = function(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  };
  Collection2.prototype.clone = function(props2) {
    var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
    if (props2)
      extend(ctx, props2);
    rv._ctx = ctx;
    return rv;
  };
  Collection2.prototype.raw = function() {
    this._ctx.valueMapper = null;
    return this;
  };
  Collection2.prototype.each = function(fn) {
    var ctx = this._ctx;
    return this._read(function(trans) {
      return iter(ctx, fn, trans, ctx.table.core);
    });
  };
  Collection2.prototype.count = function(cb) {
    var _this = this;
    return this._read(function(trans) {
      var ctx = _this._ctx;
      var coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then(function(count2) {
          return Math.min(count2, ctx.limit);
        });
      } else {
        var count = 0;
        return iter(ctx, function() {
          ++count;
          return false;
        }, trans, coreTable).then(function() {
          return count;
        });
      }
    }).then(cb);
  };
  Collection2.prototype.sortBy = function(keyPath, cb) {
    var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i)
        return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function(a) {
      return a.sort(sorter);
    }).then(cb);
  };
  Collection2.prototype.toArray = function(cb) {
    var _this = this;
    return this._read(function(trans) {
      var ctx = _this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        var valueMapper_1 = ctx.valueMapper;
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index,
            range: ctx.range
          }
        }).then(function(_a2) {
          var result = _a2.result;
          return valueMapper_1 ? result.map(valueMapper_1) : result;
        });
      } else {
        var a_1 = [];
        return iter(ctx, function(item) {
          return a_1.push(item);
        }, trans, ctx.table.core).then(function() {
          return a_1;
        });
      }
    }, cb);
  };
  Collection2.prototype.offset = function(offset) {
    var ctx = this._ctx;
    if (offset <= 0)
      return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, function() {
        var offsetLeft = offset;
        return function(cursor, advance) {
          if (offsetLeft === 0)
            return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(function() {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, function() {
        var offsetLeft = offset;
        return function() {
          return --offsetLeft < 0;
        };
      });
    }
    return this;
  };
  Collection2.prototype.limit = function(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, function() {
      var rowsLeft = numRows;
      return function(cursor, advance, resolve) {
        if (--rowsLeft <= 0)
          advance(resolve);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  };
  Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function(cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  };
  Collection2.prototype.first = function(cb) {
    return this.limit(1).toArray(function(a) {
      return a[0];
    }).then(cb);
  };
  Collection2.prototype.last = function(cb) {
    return this.reverse().first(cb);
  };
  Collection2.prototype.filter = function(filterFunction) {
    addFilter(this._ctx, function(cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  };
  Collection2.prototype.and = function(filter) {
    return this.filter(filter);
  };
  Collection2.prototype.or = function(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  };
  Collection2.prototype.reverse = function() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange)
      this._ondirectionchange(this._ctx.dir);
    return this;
  };
  Collection2.prototype.desc = function() {
    return this.reverse();
  };
  Collection2.prototype.eachKey = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.key, cursor);
    });
  };
  Collection2.prototype.eachUniqueKey = function(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  };
  Collection2.prototype.eachPrimaryKey = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  };
  Collection2.prototype.keys = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.key);
    }).then(function() {
      return a;
    }).then(cb);
  };
  Collection2.prototype.primaryKeys = function(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read(function(trans) {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range
          }
        });
      }).then(function(_a2) {
        var result = _a2.result;
        return result;
      }).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function() {
      return a;
    }).then(cb);
  };
  Collection2.prototype.uniqueKeys = function(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  };
  Collection2.prototype.firstKey = function(cb) {
    return this.limit(1).keys(function(a) {
      return a[0];
    }).then(cb);
  };
  Collection2.prototype.lastKey = function(cb) {
    return this.reverse().firstKey(cb);
  };
  Collection2.prototype.distinct = function() {
    var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi)
      return this;
    var set = {};
    addFilter(this._ctx, function(cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  };
  Collection2.prototype.modify = function(changes) {
    var _this = this;
    var ctx = this._ctx;
    return this._write(function(trans) {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function(item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i], val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      var coreTable = ctx.table.core;
      var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
      var limit = _this.db._options.modifyChunkSize || 200;
      var cmp2 = _this.db.core.cmp;
      var totalFailures = [];
      var successCount = 0;
      var failedKeys = [];
      var applyMutateResult = function(expectedCount, res) {
        var failures = res.failures, numFailures = res.numFailures;
        successCount += expectedCount - numFailures;
        for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
          var pos = _a3[_i];
          totalFailures.push(failures[pos]);
        }
      };
      return _this.clone().primaryKeys().then(function(keys2) {
        var nextChunk = function(offset) {
          var count = Math.min(limit, keys2.length - offset);
          return coreTable.getMany({
            trans,
            keys: keys2.slice(offset, offset + count),
            cache: "immutable"
          }).then(function(values) {
            var addValues = [];
            var putValues = [];
            var putKeys = outbound ? [] : null;
            var deleteKeys = [];
            for (var i = 0; i < count; ++i) {
              var origValue = values[i];
              var ctx_1 = {
                value: deepClone(origValue),
                primKey: keys2[offset + i]
              };
              if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                if (ctx_1.value == null) {
                  deleteKeys.push(keys2[offset + i]);
                } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                  deleteKeys.push(keys2[offset + i]);
                  addValues.push(ctx_1.value);
                } else {
                  putValues.push(ctx_1.value);
                  if (outbound)
                    putKeys.push(keys2[offset + i]);
                }
              }
            }
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({trans, type: "add", values: addValues}).then(function(res) {
              for (var pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(function() {
              return putValues.length > 0 && coreTable.mutate({trans, type: "put", keys: putKeys, values: putValues}).then(function(res) {
                return applyMutateResult(putValues.length, res);
              });
            }).then(function() {
              return deleteKeys.length > 0 && coreTable.mutate({trans, type: "delete", keys: deleteKeys}).then(function(res) {
                return applyMutateResult(deleteKeys.length, res);
              });
            }).then(function() {
              return keys2.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(function() {
          if (totalFailures.length > 0)
            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys2.length;
        });
      });
    });
  };
  Collection2.prototype.delete = function() {
    var ctx = this._ctx, range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write(function(trans) {
        var primaryKey = ctx.table.core.schema.primaryKey;
        var coreRange = range;
        return ctx.table.core.count({trans, query: {index: primaryKey, range: coreRange}}).then(function(count) {
          return ctx.table.core.mutate({trans, type: "deleteRange", range: coreRange}).then(function(_a2) {
            var failures = _a2.failures;
            _a2.lastResult;
            _a2.results;
            var numFailures = _a2.numFailures;
            if (numFailures)
              throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                return failures[pos];
              }), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(function(value, ctx2) {
      return ctx2.value = null;
    });
  };
  return Collection2;
}();
function createCollectionConstructor(db) {
  return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
    this.db = db;
    var keyRange = AnyRange, error = null;
    if (keyRangeGenerator)
      try {
        keyRange = keyRangeGenerator();
      } catch (ex) {
        error = ex;
      }
    var whereCtx = whereClause._ctx;
    var table = whereCtx.table;
    var readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, function() {
    return rangeEqual("");
  }).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? function(s) {
    return s.toUpperCase();
  } : function(s) {
    return s.toLowerCase();
  };
}
function lowerFactory(dir) {
  return dir === "next" ? function(s) {
    return s.toLowerCase();
  } : function(s) {
    return s.toUpperCase();
  };
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp2(key[i], upperNeedle[i]) < 0)
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp2(key[i], lowerNeedle[i]) < 0)
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp2(key[i], lwrKeyChar) < 0)
      llp = i;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
  if (!needles.every(function(s) {
    return typeof s === "string";
  })) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function(needle) {
      return {lower: lower(needle), upper: upper(needle)};
    }).sort(function(a, b) {
      return compare(a.lower, b.lower);
    });
    upperNeedles = needleBounds.map(function(nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function(nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, function() {
    return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
  });
  c._ondirectionchange = function(direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function(cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string")
      return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i + 1;
        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function() {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = function() {
  function WhereClause2() {
  }
  Object.defineProperty(WhereClause2.prototype, "Collection", {
    get: function() {
      return this._ctx.table.db.Collection;
    },
    enumerable: false,
    configurable: true
  });
  WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
        return emptyCollection(this);
      return new this.Collection(this, function() {
        return createRange(lower, upper, !includeLower, !includeUpper);
      });
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  };
  WhereClause2.prototype.equals = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return rangeEqual(value);
    });
  };
  WhereClause2.prototype.above = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(value, void 0, true);
    });
  };
  WhereClause2.prototype.aboveOrEqual = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(value, void 0, false);
    });
  };
  WhereClause2.prototype.below = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(void 0, value, false, true);
    });
  };
  WhereClause2.prototype.belowOrEqual = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(void 0, value);
    });
  };
  WhereClause2.prototype.startsWith = function(str) {
    if (typeof str !== "string")
      return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  };
  WhereClause2.prototype.startsWithIgnoreCase = function(str) {
    if (str === "")
      return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return x.indexOf(a[0]) === 0;
    }, [str], maxString);
  };
  WhereClause2.prototype.equalsIgnoreCase = function(str) {
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return x === a[0];
    }, [str], "");
  };
  WhereClause2.prototype.anyOfIgnoreCase = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return a.indexOf(x) !== -1;
    }, set, "");
  };
  WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return a.some(function(n) {
        return x.indexOf(n) === 0;
      });
    }, set, maxString);
  };
  WhereClause2.prototype.anyOf = function() {
    var _this = this;
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    var compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0)
      return emptyCollection(this);
    var c = new this.Collection(this, function() {
      return createRange(set[0], set[set.length - 1]);
    });
    c._ondirectionchange = function(direction) {
      compare = direction === "next" ? _this._ascending : _this._descending;
      set.sort(compare);
    };
    var i = 0;
    c._addAlgorithm(function(cursor, advance, resolve) {
      var key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(function() {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  };
  WhereClause2.prototype.notEqual = function(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], {includeLowers: false, includeUppers: false});
  };
  WhereClause2.prototype.noneOf = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    var ranges = set.reduce(function(res, val) {
      return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
    }, null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, {includeLowers: false, includeUppers: false});
  };
  WhereClause2.prototype.inAnyRange = function(ranges, options) {
    var _this = this;
    var cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
    if (ranges.length === 0)
      return emptyCollection(this);
    if (!ranges.every(function(range) {
      return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
    })) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    var includeLowers = !options || options.includeLowers !== false;
    var includeUppers = options && options.includeUppers === true;
    function addRange2(ranges2, newRange) {
      var i = 0, l = ranges2.length;
      for (; i < l; ++i) {
        var range = ranges2[i];
        if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l)
        ranges2.push(newRange);
      return ranges2;
    }
    var sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    var set;
    try {
      set = ranges.reduce(addRange2, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    var rangePos = 0;
    var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
      return ascending(key, set[rangePos][1]) > 0;
    } : function(key) {
      return ascending(key, set[rangePos][1]) >= 0;
    };
    var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
      return descending(key, set[rangePos][0]) > 0;
    } : function(key) {
      return descending(key, set[rangePos][0]) >= 0;
    };
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    var checkKey = keyIsBeyondCurrentEntry;
    var c = new this.Collection(this, function() {
      return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
    });
    c._ondirectionchange = function(direction) {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm(function(cursor, advance, resolve) {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(function() {
          if (sortDirection === ascending)
            cursor.continue(set[rangePos][0]);
          else
            cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  };
  WhereClause2.prototype.startsWithAnyOf = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every(function(s) {
      return typeof s === "string";
    })) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0)
      return emptyCollection(this);
    return this.inAnyRange(set.map(function(str) {
      return [str, str + maxString];
    }));
  };
  return WhereClause2;
}();
function createWhereClauseConstructor(db) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
    this.db = db;
    this._ctx = {
      table,
      index: index === ":id" ? null : index,
      or: orCollection
    };
    var indexedDB = db._deps.indexedDB;
    if (!indexedDB)
      throw new exceptions.MissingAPI();
    this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
    this._descending = function(a, b) {
      return indexedDB.cmp(b, a);
    };
    this._max = function(a, b) {
      return indexedDB.cmp(a, b) > 0 ? a : b;
    };
    this._min = function(a, b) {
      return indexedDB.cmp(a, b) < 0 ? a : b;
    };
    this._IDBKeyRange = db._deps.IDBKeyRange;
  });
}
function eventRejectHandler(reject) {
  return wrap(function(event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation)
    event.stopPropagation();
  if (event.preventDefault)
    event.preventDefault();
}
var globalEvents = Events(null, "txcommitted");
var Transaction = function() {
  function Transaction2() {
  }
  Transaction2.prototype._lock = function() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global)
      PSD.lockOwnerFor = this;
    return this;
  };
  Transaction2.prototype._unlock = function() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global)
        PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {
        }
      }
    }
    return this;
  };
  Transaction2.prototype._locked = function() {
    return this._reculock && PSD.lockOwnerFor !== this;
  };
  Transaction2.prototype.create = function(idbtrans) {
    var _this = this;
    if (!this.mode)
      return this;
    var idbdb = this.db.idbdb;
    var dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active)
      throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
    idbtrans.onerror = wrap(function(ev) {
      preventDefault(ev);
      _this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap(function(ev) {
      preventDefault(ev);
      _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
      _this.active = false;
      _this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(function() {
      _this.active = false;
      _this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.txcommitted.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  };
  Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
    var _this = this;
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise(function(resolve, reject) {
        _this._blockedFuncs.push([function() {
          _this._promise(mode, fn, bWriteLock).then(resolve, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(function() {
        var p2 = new DexiePromise(function(resolve, reject) {
          _this._lock();
          var rv = fn(resolve, reject, _this);
          if (rv && rv.then)
            rv.then(resolve, reject);
        });
        p2.finally(function() {
          return _this._unlock();
        });
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise(function(resolve, reject) {
        var rv = fn(resolve, reject, _this);
        if (rv && rv.then)
          rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  };
  Transaction2.prototype._root = function() {
    return this.parent ? this.parent._root() : this;
  };
  Transaction2.prototype.waitFor = function(promiseLike) {
    var root = this._root();
    var promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(function() {
        return promise;
      });
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length)
          root._waitingQueue.shift()();
        if (root._waitingFor)
          store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise(function(resolve, reject) {
      promise.then(function(res) {
        return root._waitingQueue.push(wrap(resolve.bind(null, res)));
      }, function(err) {
        return root._waitingQueue.push(wrap(reject.bind(null, err)));
      }).finally(function() {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  };
  Transaction2.prototype.abort = function() {
    this.active && this._reject(new exceptions.Abort());
    this.active = false;
  };
  Transaction2.prototype.table = function(tableName) {
    var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName))
      return memoizedTables[tableName];
    var tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  };
  return Transaction2;
}();
function createTransactionConstructor(db) {
  return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, parent) {
    var _this = this;
    this.db = db;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise(function(resolve, reject) {
      _this._resolve = resolve;
      _this._reject = reject;
    });
    this._completion.then(function() {
      _this.active = false;
      _this.on.complete.fire();
    }, function(e) {
      var wasActive = _this.active;
      _this.active = false;
      _this.on.error.fire(e);
      _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, function(index) {
      return [index.name, index];
    })
  };
}
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return function() {
      return void 0;
    };
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return function(obj) {
      return getByKeyPath(obj, keyPath);
    };
  }
}
function getSinglePathKeyExtractor(keyPath) {
  var split = keyPath.split(".");
  if (split.length === 1) {
    return function(obj) {
      return obj[keyPath];
    };
  } else {
    return function(obj) {
      return getByKeyPath(obj, keyPath);
    };
  }
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[" + keyPath.join("+") + "]";
}
function createDBCore(db, indexedDB, IdbKeyRange, tmpTrans) {
  var cmp2 = indexedDB.cmp.bind(indexedDB);
  function extractSchema(db2, trans) {
    var tables2 = arrayify(db2.objectStoreNames);
    return {
      schema: {
        name: db2.name,
        tables: tables2.map(function(table) {
          return trans.objectStore(table);
        }).map(function(store) {
          var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
          var compound = isArray(keyPath);
          var outbound = keyPath == null;
          var indexByKeyPath = {};
          var result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map(function(indexName) {
              return store.index(indexName);
            }).map(function(index) {
              var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
              var compound2 = isArray(keyPath2);
              var result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: function(keyPath2) {
              return indexByKeyPath[getKeyPathAlias(keyPath2)];
            }
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3)
      return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
    var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    var tableName = tableSchema.name;
    function mutate(_a3) {
      var trans = _a3.trans, type = _a3.type, keys2 = _a3.keys, values = _a3.values, range = _a3.range;
      return new Promise(function(resolve, reject) {
        resolve = wrap(resolve);
        var store = trans.objectStore(tableName);
        var outbound = store.keyPath == null;
        var isAddOrPut = type === "put" || type === "add";
        if (!isAddOrPut && type !== "delete" && type !== "deleteRange")
          throw new Error("Invalid operation type: " + type);
        var length = (keys2 || values || {length: 1}).length;
        if (keys2 && values && keys2.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0)
          return resolve({numFailures: 0, failures: {}, results: [], lastResult: void 0});
        var req;
        var reqs = [];
        var failures = [];
        var numFailures = 0;
        var errorHandler = function(event) {
          ++numFailures;
          preventDefault(event);
        };
        if (type === "deleteRange") {
          if (range.type === 4)
            return resolve({numFailures, failures, results: [], lastResult: void 0});
          if (range.type === 3)
            reqs.push(req = store.clear());
          else
            reqs.push(req = store.delete(makeIDBKeyRange(range)));
        } else {
          var _a4 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a4[0], args2 = _a4[1];
          if (isAddOrPut) {
            for (var i = 0; i < length; ++i) {
              reqs.push(req = args2 && args2[i] !== void 0 ? store[type](args1[i], args2[i]) : store[type](args1[i]));
              req.onerror = errorHandler;
            }
          } else {
            for (var i = 0; i < length; ++i) {
              reqs.push(req = store[type](args1[i]));
              req.onerror = errorHandler;
            }
          }
        }
        var done = function(event) {
          var lastResult = event.target.result;
          reqs.forEach(function(req2, i2) {
            return req2.error != null && (failures[i2] = req2.error);
          });
          resolve({
            numFailures,
            failures,
            results: type === "delete" ? keys2 : reqs.map(function(req2) {
              return req2.result;
            }),
            lastResult
          });
        };
        req.onerror = function(event) {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2(_a3) {
      var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique = _a3.unique;
      return new Promise(function(resolve, reject) {
        resolve = wrap(resolve);
        var index = query2.index, range = query2.range;
        var store = trans.objectStore(tableName);
        var source = index.isPrimaryKey ? store : store.index(index.name);
        var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap(function(ev) {
          var cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          var _cursorContinue = cursor.continue.bind(cursor);
          var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          var _cursorAdvance = cursor.advance.bind(cursor);
          var doThrowCursorIsNotStarted = function() {
            throw new Error("Cursor not started");
          };
          var doThrowCursorIsStopped = function() {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function() {
            var _this = this;
            var gotOne = 1;
            return this.start(function() {
              return gotOne-- ? _this.continue() : _this.stop();
            }).then(function() {
              return _this;
            });
          };
          cursor.start = function(callback) {
            var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
              resolveIteration = wrap(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = function(value) {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            var guardedCallback = function() {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = function() {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap(function(ev2) {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return function(request) {
        return new Promise(function(resolve, reject) {
          resolve = wrap(resolve);
          var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
          var nonInfinitLimit = limit === Infinity ? void 0 : limit;
          var index = query2.index, range = query2.range;
          var store = trans.objectStore(tableName);
          var source = index.isPrimaryKey ? store : store.index(index.name);
          var idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0)
            return resolve({result: []});
          if (hasGetAll2) {
            var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = function(event) {
              return resolve({result: event.target.result});
            };
            req.onerror = eventRejectHandler(reject);
          } else {
            var count_1 = 0;
            var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            var result_1 = [];
            req_1.onsuccess = function(event) {
              var cursor = req_1.result;
              if (!cursor)
                return resolve({result: result_1});
              result_1.push(values ? cursor.value : cursor.primaryKey);
              if (++count_1 === limit)
                return resolve({result: result_1});
              cursor.continue();
            };
            req_1.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany: function(_a3) {
        var trans = _a3.trans, keys2 = _a3.keys;
        return new Promise(function(resolve, reject) {
          resolve = wrap(resolve);
          var store = trans.objectStore(tableName);
          var length = keys2.length;
          var result = new Array(length);
          var keyCount = 0;
          var callbackCount = 0;
          var req;
          var successHandler = function(event) {
            var req2 = event.target;
            if ((result[req2._pos] = req2.result) != null)
              ;
            if (++callbackCount === keyCount)
              resolve(result);
          };
          var errorHandler = eventRejectHandler(reject);
          for (var i = 0; i < length; ++i) {
            var key = keys2[i];
            if (key != null) {
              req = store.get(keys2[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0)
            resolve(result);
        });
      },
      get: function(_a3) {
        var trans = _a3.trans, key = _a3.key;
        return new Promise(function(resolve, reject) {
          resolve = wrap(resolve);
          var store = trans.objectStore(tableName);
          var req = store.get(key);
          req.onsuccess = function(event) {
            return resolve(event.target.result);
          };
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count: function(_a3) {
        var query2 = _a3.query, trans = _a3.trans;
        var index = query2.index, range = query2.range;
        return new Promise(function(resolve, reject) {
          var store = trans.objectStore(tableName);
          var source = index.isPrimaryKey ? store : store.index(index.name);
          var idbKeyRange = makeIDBKeyRange(range);
          var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap(function(ev) {
            return resolve(ev.target.result);
          });
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  var _a2 = extractSchema(db, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll;
  var tables = schema.tables.map(function(tableSchema) {
    return createDbCoreTable(tableSchema);
  });
  var tableMap = {};
  tables.forEach(function(table) {
    return tableMap[table.name] = table;
  });
  return {
    stack: "dbcore",
    transaction: db.transaction.bind(db),
    table: function(name) {
      var result = tableMap[name];
      if (!result)
        throw new Error("Table '" + name + "' not found");
      return tableMap[name];
    },
    cmp: cmp2,
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce(function(down, _a2) {
    var create = _a2.create;
    return __assign(__assign({}, down), create(down));
  }, stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
  var IDBKeyRange = _a2.IDBKeyRange, indexedDB = _a2.indexedDB;
  var dbcore = createMiddlewareStack(createDBCore(idbdb, indexedDB, IDBKeyRange, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks(db, tmpTrans) {
  var idbdb = tmpTrans.db;
  var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
  db.core = stacks.dbcore;
  db.tables.forEach(function(table) {
    var tableName = table.name;
    if (db.core.schema.tables.some(function(tbl) {
      return tbl.name === tableName;
    })) {
      table.core = db.core.table(tableName);
      if (db[tableName] instanceof db.Table) {
        db[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace(db, objs, tableNames, dbschema) {
  tableNames.forEach(function(tableName) {
    var schema = dbschema[tableName];
    objs.forEach(function(obj) {
      var propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
          setProp(obj, tableName, {
            get: function() {
              return this.table(tableName);
            },
            set: function(value) {
              defineProperty(this, tableName, {value, writable: true, configurable: true, enumerable: true});
            }
          });
        } else {
          obj[tableName] = new db.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi(db, objs) {
  objs.forEach(function(obj) {
    for (var key in obj) {
      if (obj[key] instanceof db.Table)
        delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
  var globalSchema = db._dbSchema;
  var trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  var rejectTransaction = trans._reject.bind(trans);
  var transless = PSD.transless || PSD;
  newScope(function() {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach(function(tableName) {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db, idbUpgradeTrans);
      DexiePromise.follow(function() {
        return db.on.populate.fire(trans);
      }).catch(rejectTransaction);
    } else
      updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
  var queue = [];
  var versions = db._versions;
  var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
  var anyContentUpgraderHasRun = false;
  var versToRun = versions.filter(function(v) {
    return v._cfg.version >= oldVersion;
  });
  versToRun.forEach(function(version) {
    queue.push(function() {
      var oldSchema = globalSchema;
      var newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
      globalSchema = db._dbSchema = newSchema;
      var diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach(function(tuple) {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach(function(change) {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          var store_1 = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach(function(idx) {
            return addIndex(store_1, idx);
          });
          change.change.forEach(function(idx) {
            store_1.deleteIndex(idx.name);
            addIndex(store_1, idx);
          });
          change.del.forEach(function(idxName) {
            return store_1.deleteIndex(idxName);
          });
        }
      });
      var contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        var upgradeSchema_1 = shallowClone(newSchema);
        diff.del.forEach(function(table) {
          upgradeSchema_1[table] = oldSchema[table];
        });
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
        trans.schema = upgradeSchema_1;
        var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync_1) {
          incrementExpectedAwaits();
        }
        var returnValue_1;
        var promiseFollowed = DexiePromise.follow(function() {
          returnValue_1 = contentUpgrade(trans);
          if (returnValue_1) {
            if (contentUpgradeIsAsync_1) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue_1.then(decrementor, decrementor);
            }
          }
        });
        return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
          return returnValue_1;
        });
      }
    });
    queue.push(function(idbtrans) {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        var newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db, [db.Transaction.prototype]);
      setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
      trans.schema = db._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(function() {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  var diff = {
    del: [],
    add: [],
    change: []
  };
  var table;
  for (table in oldSchema) {
    if (!newSchema[table])
      diff.del.push(table);
  }
  for (table in newSchema) {
    var oldDef = oldSchema[table], newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      var change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        var oldIndexes = oldDef.idxByName;
        var newIndexes = newDef.idxByName;
        var idxName = void 0;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName])
            change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
          if (!oldIdx)
            change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src)
            change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? {keyPath: primKey.keyPath, autoIncrement: primKey.auto} : {autoIncrement: primKey.auto});
  indexes.forEach(function(idx) {
    return addIndex(store, idx);
  });
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach(function(tableName) {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
    var storeName = idbtrans.db.objectStoreNames[i];
    if (newSchema[storeName] == null) {
      idbtrans.db.deleteObjectStore(storeName);
    }
  }
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, {unique: idx.unique, multiEntry: idx.multi});
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
  var globalSchema = {};
  var dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach(function(storeName) {
    var store = tmpTrans.objectStore(storeName);
    var keyPath = store.keyPath;
    var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    var indexes = [];
    for (var j = 0; j < store.indexNames.length; ++j) {
      var idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema(db, idbdb, tmpTrans) {
  db.verno = idbdb.version / 10;
  var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
  db._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
  var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
  var diff = getSchemaDiff(installedSchema, db._dbSchema);
  return !(diff.add.length || diff.change.some(function(ch) {
    return ch.add.length || ch.change.length;
  }));
}
function adjustToExistingIndexNames(db, schema, idbtrans) {
  var storeNames = idbtrans.db.objectStoreNames;
  for (var i = 0; i < storeNames.length; ++i) {
    var storeName = storeNames[i];
    var store = idbtrans.objectStore(storeName);
    db._hasGetAll = "getAll" in store;
    for (var j = 0; j < store.indexNames.length; ++j) {
      var indexName = store.indexNames[j];
      var keyPath = store.index(indexName).keyPath;
      var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        var indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map(function(index, indexNum) {
    index = index.trim();
    var name = index.replace(/([&*]|\+\+)/g, "");
    var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
  });
}
var Version = function() {
  function Version2() {
  }
  Version2.prototype._parseStoresSpec = function(stores, outSchema) {
    keys(stores).forEach(function(tableName) {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach(function(idx) {
          if (idx.auto)
            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath)
            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  };
  Version2.prototype.stores = function(stores) {
    var db = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    var versions = db._versions;
    var storesSpec = {};
    var dbschema = {};
    versions.forEach(function(version) {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db._dbSchema = dbschema;
    removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
    setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db._storeNames = keys(dbschema);
    return this;
  };
  Version2.prototype.upgrade = function(upgradeFunction) {
    this._cfg.contentUpgrade = upgradeFunction;
    return this;
  };
  return Version2;
}();
function createVersionConstructor(db) {
  return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
    this.db = db;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
function getDbNamesTable(indexedDB, IDBKeyRange) {
  var dbNamesDB = indexedDB["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB,
      IDBKeyRange
    });
    dbNamesDB.version(1).stores({dbnames: "name"});
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB) {
  return indexedDB && typeof indexedDB.databases === "function";
}
function getDatabaseNames(_a2) {
  var indexedDB = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
  return hasDatabasesNative(indexedDB) ? Promise.resolve(indexedDB.databases()).then(function(infos) {
    return infos.map(function(info) {
      return info.name;
    }).filter(function(name) {
      return name !== DBNAMES_DB;
    });
  }) : getDbNamesTable(indexedDB, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated(_a2, name) {
  var indexedDB = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
  !hasDatabasesNative(indexedDB) && name !== DBNAMES_DB && getDbNamesTable(indexedDB, IDBKeyRange).put({name}).catch(nop);
}
function _onDatabaseDeleted(_a2, name) {
  var indexedDB = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
  !hasDatabasesNative(indexedDB) && name !== DBNAMES_DB && getDbNamesTable(indexedDB, IDBKeyRange).delete(name).catch(nop);
}
function vip(fn) {
  return newScope(function() {
    PSD.letThrough = true;
    return fn();
  });
}
function dexieOpen(db) {
  var state = db._state;
  var indexedDB = db._deps.indexedDB;
  if (state.isBeingOpened || db.idbdb)
    return state.dbReadyPromise.then(function() {
      return state.dbOpenError ? rejection(state.dbOpenError) : db;
    });
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
  return DexiePromise.race([state.openCanceller, new DexiePromise(function(resolve, reject) {
    if (!indexedDB)
      throw new exceptions.MissingAPI();
    var dbName = db.name;
    var req = state.autoSchema ? indexedDB.open(dbName) : indexedDB.open(dbName, Math.round(db.verno * 10));
    if (!req)
      throw new exceptions.MissingAPI();
    req.onerror = eventRejectHandler(reject);
    req.onblocked = wrap(db._fireOnBlocked);
    req.onupgradeneeded = wrap(function(e) {
      upgradeTransaction = req.transaction;
      if (state.autoSchema && !db._options.allowEmptyDB) {
        req.onerror = preventDefault;
        upgradeTransaction.abort();
        req.result.close();
        var delreq = indexedDB.deleteDatabase(dbName);
        delreq.onsuccess = delreq.onerror = wrap(function() {
          reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
        });
      } else {
        upgradeTransaction.onerror = eventRejectHandler(reject);
        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
        wasCreated = oldVer < 1;
        db.idbdb = req.result;
        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
      }
    }, reject);
    req.onsuccess = wrap(function() {
      upgradeTransaction = null;
      var idbdb = db.idbdb = req.result;
      var objectStoreNames = slice(idbdb.objectStoreNames);
      if (objectStoreNames.length > 0)
        try {
          var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
          if (state.autoSchema)
            readGlobalSchema(db, idbdb, tmpTrans);
          else {
            adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
            if (!verifyInstalledSchema(db, tmpTrans)) {
              console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.");
            }
          }
          generateMiddlewareStacks(db, tmpTrans);
        } catch (e) {
        }
      connections.push(db);
      idbdb.onversionchange = wrap(function(ev) {
        state.vcFired = true;
        db.on("versionchange").fire(ev);
      });
      idbdb.onclose = wrap(function(ev) {
        db.on("close").fire(ev);
      });
      if (wasCreated)
        _onDatabaseCreated(db._deps, dbName);
      resolve();
    }, reject);
  })]).then(function() {
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(db.on.ready.fire)).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        var remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(remainders)).then(fireRemainders);
      }
    });
  }).finally(function() {
    state.onReadyBeingFired = null;
  }).then(function() {
    state.isBeingOpened = false;
    return db;
  }).catch(function(err) {
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (e) {
    }
    state.isBeingOpened = false;
    db.close();
    state.dbOpenError = err;
    return rejection(state.dbOpenError);
  }).finally(function() {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = function(result) {
    return iterator.next(result);
  }, doThrow = function(error) {
    return iterator.throw(error);
  }, onSuccess = step(callNext), onError = step(doThrow);
  function step(getNext) {
    return function(val) {
      var next = getNext(val), value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2)
    throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i)
    args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(function() {
    var transless = PSD.transless || PSD;
    var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
    var zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      trans.create();
    }
    var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    var returnValue;
    var promiseFollowed = DexiePromise.follow(function() {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
      return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
    }) : promiseFollowed.then(function() {
      return returnValue;
    })).then(function(x) {
      if (parentTransaction)
        trans._resolve();
      return trans._completion.then(function() {
        return x;
      });
    }).catch(function(e) {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  var result = isArray(a) ? a.slice() : [a];
  for (var i = 0; i < count; ++i)
    result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return __assign(__assign({}, down), {table: function(tableName) {
    var table = down.table(tableName);
    var schema = table.schema;
    var indexLookup = {};
    var allVirtualIndexes = [];
    function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
      var keyPathAlias = getKeyPathAlias(keyPath);
      var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
      var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
      var isVirtual = keyTail > 0;
      var virtualIndex = __assign(__assign({}, lowLevelIndex), {
        isVirtual,
        isPrimaryKey: !isVirtual && lowLevelIndex.isPrimaryKey,
        keyTail,
        keyLength,
        extractKey: getKeyExtractor(keyPath),
        unique: !isVirtual && lowLevelIndex.unique
      });
      indexList.push(virtualIndex);
      if (!virtualIndex.isPrimaryKey) {
        allVirtualIndexes.push(virtualIndex);
      }
      if (keyLength > 1) {
        var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
        addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
      }
      indexList.sort(function(a, b) {
        return a.keyTail - b.keyTail;
      });
      return virtualIndex;
    }
    var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
    indexLookup[":id"] = [primaryKey];
    for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
      var index = _a2[_i];
      addVirtualIndexes(index.keyPath, 0, index);
    }
    function findBestIndex(keyPath) {
      var result2 = indexLookup[getKeyPathAlias(keyPath)];
      return result2 && result2[0];
    }
    function translateRange(range, keyTail) {
      return {
        type: range.type === 1 ? 2 : range.type,
        lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
        lowerOpen: true,
        upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
        upperOpen: true
      };
    }
    function translateRequest(req) {
      var index2 = req.query.index;
      return index2.isVirtual ? __assign(__assign({}, req), {query: {
        index: index2,
        range: translateRange(req.query.range, index2.keyTail)
      }}) : req;
    }
    var result = __assign(__assign({}, table), {
      schema: __assign(__assign({}, schema), {primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex}),
      count: function(req) {
        return table.count(translateRequest(req));
      },
      query: function(req) {
        return table.query(translateRequest(req));
      },
      openCursor: function(req) {
        var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
        if (!isVirtual)
          return table.openCursor(req);
        function createVirtualCursor(cursor) {
          function _continue(key) {
            key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(pad(cursor.key, req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
          }
          var virtualCursor = Object.create(cursor, {
            continue: {value: _continue},
            continuePrimaryKey: {
              value: function(key, primaryKey2) {
                cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
              }
            },
            key: {
              get: function() {
                var key = cursor.key;
                return keyLength === 1 ? key[0] : key.slice(0, keyLength);
              }
            },
            value: {
              get: function() {
                return cursor.value;
              }
            }
          });
          return virtualCursor;
        }
        return table.openCursor(translateRequest(req)).then(function(cursor) {
          return cursor && createVirtualCursor(cursor);
        });
      }
    });
    return result;
  }});
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete")
    return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: function(downCore) {
    return __assign(__assign({}, downCore), {table: function(tableName) {
      var downTable = downCore.table(tableName);
      var primaryKey = downTable.schema.primaryKey;
      var tableMiddleware = __assign(__assign({}, downTable), {mutate: function(req) {
        var dxTrans = PSD.trans;
        var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
        switch (req.type) {
          case "add":
            if (creating.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "put":
            if (creating.fire === nop && updating.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "delete":
            if (deleting.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "deleteRange":
            if (deleting.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return deleteRange(req);
            }, true);
        }
        return downTable.mutate(req);
        function addPutOrDelete(req2) {
          var dxTrans2 = PSD.trans;
          var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
          if (!keys2)
            throw new Error("Keys missing");
          req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), {keys: keys2}) : __assign({}, req2);
          if (req2.type !== "delete")
            req2.values = __spreadArray([], req2.values);
          if (req2.keys)
            req2.keys = __spreadArray([], req2.keys);
          return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
            var contexts = keys2.map(function(key, i) {
              var existingValue = existingValues[i];
              var ctx = {onerror: null, onsuccess: null};
              if (req2.type === "delete") {
                deleting.fire.call(ctx, key, existingValue, dxTrans2);
              } else if (req2.type === "add" || existingValue === void 0) {
                var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                if (key == null && generatedPrimaryKey != null) {
                  key = generatedPrimaryKey;
                  req2.keys[i] = key;
                  if (!primaryKey.outbound) {
                    setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                  }
                }
              } else {
                var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                if (additionalChanges_1) {
                  var requestedValue_1 = req2.values[i];
                  Object.keys(additionalChanges_1).forEach(function(keyPath) {
                    if (hasOwn(requestedValue_1, keyPath)) {
                      requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                    } else {
                      setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                    }
                  });
                }
              }
              return ctx;
            });
            return downTable.mutate(req2).then(function(_a3) {
              var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
              for (var i = 0; i < keys2.length; ++i) {
                var primKey = results ? results[i] : keys2[i];
                var ctx = contexts[i];
                if (primKey == null) {
                  ctx.onerror && ctx.onerror(failures[i]);
                } else {
                  ctx.onsuccess && ctx.onsuccess(req2.type === "put" && existingValues[i] ? req2.values[i] : primKey);
                }
              }
              return {failures, results, numFailures, lastResult};
            }).catch(function(error) {
              contexts.forEach(function(ctx) {
                return ctx.onerror && ctx.onerror(error);
              });
              return Promise.reject(error);
            });
          });
        }
        function deleteRange(req2) {
          return deleteNextChunk(req2.trans, req2.range, 1e4);
        }
        function deleteNextChunk(trans, range, limit) {
          return downTable.query({trans, values: false, query: {index: primaryKey, range}, limit}).then(function(_a3) {
            var result = _a3.result;
            return addPutOrDelete({type: "delete", keys: result, trans}).then(function(res) {
              if (res.numFailures > 0)
                return Promise.reject(res.failures[0]);
              if (result.length < limit) {
                return {failures: [], numFailures: 0, lastResult: void 0};
              } else {
                return deleteNextChunk(trans, __assign(__assign({}, range), {lower: result[result.length - 1], lowerOpen: true}), limit);
              }
            });
          });
        }
      }});
      return tableMiddleware;
    }});
  }
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve([]) : table.getMany({trans: req.trans, keys: effectiveKeys, cache: "immutable"});
}
var _cmp;
function cmp(a, b) {
  if (_cmp)
    return _cmp(a, b);
  var indexedDB = domDeps.indexedDB;
  if (!indexedDB)
    throw new exceptions.MissingAPI();
  _cmp = function(a2, b2) {
    try {
      return a2 == null || b2 == null ? NaN : indexedDB.cmp(a2, b2);
    } catch (_a2) {
      return NaN;
    }
  };
  return _cmp(a, b);
}
function getFromTransactionCache(keys2, cache, clone) {
  try {
    if (!cache)
      return null;
    if (cache.keys.length < keys2.length)
      return null;
    var result = [];
    for (var i = 0, j = 0; i < cache.keys.length && j < keys2.length; ++i) {
      if (cmp(cache.keys[i], keys2[j]) !== 0)
        continue;
      result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
      ++j;
    }
    return result.length === keys2.length ? result : null;
  } catch (_a2) {
    return null;
  }
}
var cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: function(core) {
    return {
      table: function(tableName) {
        var table = core.table(tableName);
        return __assign(__assign({}, table), {getMany: function(req) {
          if (!req.cache) {
            return table.getMany(req);
          }
          var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
          if (cachedResult) {
            return DexiePromise.resolve(cachedResult);
          }
          return table.getMany(req).then(function(res) {
            req.trans["_cache"] = {
              keys: req.keys,
              values: req.cache === "clone" ? deepClone(res) : res
            };
            return res;
          });
        }, mutate: function(req) {
          if (req.type !== "add")
            req.trans["_cache"] = null;
          return table.mutate(req);
        }});
      }
    };
  }
};
var _a;
function isEmptyRange(node) {
  return !("from" in node);
}
var RangeSet = function(fromOrTree, to) {
  if (this) {
    extend(this, arguments.length ? {d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree} : {d: 0});
  } else {
    var rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, (_a = {
  add: function(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey: function(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys: function(keys2) {
    var _this = this;
    keys2.forEach(function(key) {
      return addRange(_this, key, key);
    });
    return this;
  }
}, _a[iteratorSymbol] = function() {
  return getRangeSetIterator(this);
}, _a));
function addRange(target, from, to) {
  var diff = cmp(from, to);
  if (isNaN(diff))
    return;
  if (diff > 0)
    throw RangeError();
  if (isEmptyRange(target))
    return extend(target, {from, to, d: 1});
  var left = target.l;
  var right = target.r;
  if (cmp(to, target.from) < 0) {
    left ? addRange(left, from, to) : target.l = {from, to, d: 1, l: null, r: null};
    return rebalance(target);
  }
  if (cmp(from, target.to) > 0) {
    right ? addRange(right, from, to) : target.r = {from, to, d: 1, l: null, r: null};
    return rebalance(target);
  }
  if (cmp(from, target.from) < 0) {
    target.from = from;
    target.l = null;
    target.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target.to) > 0) {
    target.to = to;
    target.r = null;
    target.d = target.l ? target.l.d + 1 : 1;
  }
  var rightWasCutOff = !target.r;
  if (left && !target.l) {
    mergeRanges(target, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target, right);
  }
}
function mergeRanges(target, newSet) {
  function _addRangeSet(target2, _a2) {
    var from = _a2.from, to = _a2.to, l = _a2.l, r = _a2.r;
    addRange(target2, from, to);
    if (l)
      _addRangeSet(target2, l);
    if (r)
      _addRangeSet(target2, r);
  }
  if (!isEmptyRange(newSet))
    _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  var i1 = getRangeSetIterator(rangeSet2);
  var nextResult1 = i1.next();
  if (nextResult1.done)
    return false;
  var a = nextResult1.value;
  var i2 = getRangeSetIterator(rangeSet1);
  var nextResult2 = i2.next(a.from);
  var b = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
      return true;
    cmp(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
  }
  return false;
}
function getRangeSetIterator(node) {
  var state = isEmptyRange(node) ? null : {s: 0, n: node};
  return {
    next: function(key) {
      var keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0)
                state = {up: state, n: state.n.l, s: 1};
            } else {
              while (state.n.l)
                state = {up: state, n: state.n.l, s: 1};
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0)
              return {value: state.n, done: false};
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = {up: state, n: state.n.r, s: 0};
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return {done: true};
    }
  };
}
function rebalance(target) {
  var _a2, _b;
  var diff = (((_a2 = target.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    var l = r === "r" ? "l" : "r";
    var rootClone = __assign({}, target);
    var oldRootRight = target[r];
    target.from = oldRootRight.from;
    target.to = oldRootRight.to;
    target[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target.d = computeDepth(target);
}
function computeDepth(_a2) {
  var r = _a2.r, l = _a2.l;
  return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
}
var observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: function(core) {
    var dbName = core.schema.name;
    var FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return __assign(__assign({}, core), {table: function(tableName) {
      var table = core.table(tableName);
      var schema = table.schema;
      var primaryKey = schema.primaryKey;
      var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
      var tableClone = __assign(__assign({}, table), {mutate: function(req) {
        var trans = req.trans;
        var mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
        var getRangeSet = function(indexName) {
          var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
          return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
        };
        var pkRangeSet = getRangeSet("");
        var delsRangeSet = getRangeSet(":dels");
        var type = req.type;
        var _a2 = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [[], req.values] : [], keys2 = _a2[0], newObjs = _a2[1];
        var oldCache = req.trans["_cache"];
        return table.mutate(req).then(function(res) {
          if (isArray(keys2)) {
            if (type !== "delete")
              keys2 = res.results;
            pkRangeSet.addKeys(keys2);
            var oldObjs = getFromTransactionCache(keys2, oldCache);
            if (!oldObjs && type !== "add") {
              delsRangeSet.addKeys(keys2);
            }
            if (oldObjs || newObjs) {
              trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
            }
          } else if (keys2) {
            var range = {from: keys2.lower, to: keys2.upper};
            delsRangeSet.add(range);
            pkRangeSet.add(range);
          } else {
            pkRangeSet.add(FULL_RANGE);
            delsRangeSet.add(FULL_RANGE);
            schema.indexes.forEach(function(idx) {
              return getRangeSet(idx.name).add(FULL_RANGE);
            });
          }
          return res;
        });
      }});
      var getRange = function(_a2) {
        var _b, _c;
        var _d = _a2.query, index = _d.index, range = _d.range;
        return [
          index,
          new RangeSet((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
        ];
      };
      var readSubscribers = {
        get: function(req) {
          return [primaryKey, new RangeSet(req.key)];
        },
        getMany: function(req) {
          return [primaryKey, new RangeSet().addKeys(req.keys)];
        },
        count: getRange,
        query: getRange,
        openCursor: getRange
      };
      keys(readSubscribers).forEach(function(method) {
        tableClone[method] = function(req) {
          var subscr = PSD.subscr;
          if (subscr) {
            var getRangeSet = function(indexName) {
              var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
              return subscr[part] || (subscr[part] = new RangeSet());
            };
            var pkRangeSet_1 = getRangeSet("");
            var delsRangeSet_1 = getRangeSet(":dels");
            var _a2 = readSubscribers[method](req), queriedIndex = _a2[0], queriedRanges = _a2[1];
            getRangeSet(queriedIndex.name || "").add(queriedRanges);
            if (!queriedIndex.isPrimaryKey) {
              if (method === "count") {
                delsRangeSet_1.add(FULL_RANGE);
              } else {
                var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), {values: false}));
                return table[method].apply(this, arguments).then(function(res) {
                  if (method === "query") {
                    if (outbound && req.values) {
                      return keysPromise_1.then(function(_a3) {
                        var resultingKeys = _a3.result;
                        pkRangeSet_1.addKeys(resultingKeys);
                        return res;
                      });
                    }
                    var pKeys = req.values ? res.result.map(extractKey) : res.result;
                    if (req.values) {
                      pkRangeSet_1.addKeys(pKeys);
                    } else {
                      delsRangeSet_1.addKeys(pKeys);
                    }
                  } else if (method === "openCursor") {
                    var cursor_1 = res;
                    var wantValues_1 = req.values;
                    return cursor_1 && Object.create(cursor_1, {
                      key: {
                        get: function() {
                          delsRangeSet_1.addKey(cursor_1.primaryKey);
                          return cursor_1.key;
                        }
                      },
                      primaryKey: {
                        get: function() {
                          var pkey = cursor_1.primaryKey;
                          delsRangeSet_1.addKey(pkey);
                          return pkey;
                        }
                      },
                      value: {
                        get: function() {
                          wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                          return cursor_1.value;
                        }
                      }
                    });
                  }
                  return res;
                });
              }
            }
          }
          return table[method].apply(this, arguments);
        };
      });
      return tableClone;
    }});
  }
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    var rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    var addKeyOrKeys = function(key) {
      return ix.multiEntry && isArray(key) ? key.forEach(function(key2) {
        return rangeSet.addKey(key2);
      }) : rangeSet.addKey(key);
    };
    (oldObjs || newObjs).forEach(function(_, i) {
      var oldKey = oldObjs && extractKey(oldObjs[i]);
      var newKey = newObjs && extractKey(newObjs[i]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null)
          addKeyOrKeys(oldKey);
        if (newKey != null)
          addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}
var Dexie$1 = function() {
  function Dexie2(name, options) {
    var _this = this;
    this._middlewares = {};
    this.verno = 0;
    var deps = Dexie2.dependencies;
    this._options = options = __assign({
      addons: Dexie2.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange
    }, options);
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    var addons = options.addons;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    var state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true
    };
    state.dbReadyPromise = new DexiePromise(function(resolve) {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise(function(_, reject) {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", {ready: [promisableChain, nop]});
    this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
      return function(subscriber, bSticky) {
        Dexie2.vip(function() {
          var state2 = _this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError)
              DexiePromise.resolve().then(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else {
            subscribe(subscriber);
            var db_1 = _this;
            if (!bSticky)
              subscribe(function unsubscribe() {
                db_1.on.ready.unsubscribe(subscriber);
                db_1.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", function(ev) {
      if (ev.newVersion > 0)
        console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
      else
        console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
      _this.close();
    });
    this.on("blocked", function(ev) {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn("Dexie.delete('" + _this.name + "') was blocked");
      else
        console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
      return new _this.Transaction(mode, storeNames, dbschema, parentTransaction);
    };
    this._fireOnBlocked = function(ev) {
      _this.on("blocked").fire(ev);
      connections.filter(function(c) {
        return c.name === _this.name && c !== _this && !c._state.vcFired;
      }).map(function(c) {
        return c.on("versionchange").fire(ev);
      });
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    addons.forEach(function(addon) {
      return addon(_this);
    });
  }
  Dexie2.prototype.version = function(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type("Given version is not a positive number");
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    var versions = this._versions;
    var versionInstance = versions.filter(function(v) {
      return v._cfg.version === versionNumber;
    })[0];
    if (versionInstance)
      return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  };
  Dexie2.prototype._whenReady = function(fn) {
    var _this = this;
    return this._state.openComplete || PSD.letThrough ? fn() : new DexiePromise(function(resolve, reject) {
      if (!_this._state.isBeingOpened) {
        if (!_this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        _this.open().catch(nop);
      }
      _this._state.dbReadyPromise.then(resolve, reject);
    }).then(fn);
  };
  Dexie2.prototype.use = function(_a2) {
    var stack = _a2.stack, create = _a2.create, level = _a2.level, name = _a2.name;
    if (name)
      this.unuse({stack, name});
    var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({stack, create, level: level == null ? 10 : level, name});
    middlewares.sort(function(a, b) {
      return a.level - b.level;
    });
    return this;
  };
  Dexie2.prototype.unuse = function(_a2) {
    var stack = _a2.stack, name = _a2.name, create = _a2.create;
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
        return create ? mw.create !== create : name ? mw.name !== name : false;
      });
    }
    return this;
  };
  Dexie2.prototype.open = function() {
    return dexieOpen(this);
  };
  Dexie2.prototype.close = function() {
    var idx = connections.indexOf(this), state = this._state;
    if (idx >= 0)
      connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {
      }
      this.idbdb = null;
    }
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened)
      state.cancelOpen(state.dbOpenError);
    state.dbReadyPromise = new DexiePromise(function(resolve) {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise(function(_, reject) {
      state.cancelOpen = reject;
    });
  };
  Dexie2.prototype.delete = function() {
    var _this = this;
    var hasArguments = arguments.length > 0;
    var state = this._state;
    return new DexiePromise(function(resolve, reject) {
      var doDelete = function() {
        _this.close();
        var req = _this._deps.indexedDB.deleteDatabase(_this.name);
        req.onsuccess = wrap(function() {
          _onDatabaseDeleted(_this._deps, _this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = _this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  };
  Dexie2.prototype.backendDB = function() {
    return this.idbdb;
  };
  Dexie2.prototype.isOpen = function() {
    return this.idbdb !== null;
  };
  Dexie2.prototype.hasBeenClosed = function() {
    var dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  };
  Dexie2.prototype.hasFailed = function() {
    return this._state.dbOpenError !== null;
  };
  Dexie2.prototype.dynamicallyOpened = function() {
    return this._state.autoSchema;
  };
  Object.defineProperty(Dexie2.prototype, "tables", {
    get: function() {
      var _this = this;
      return keys(this._allTables).map(function(name) {
        return _this._allTables[name];
      });
    },
    enumerable: false,
    configurable: true
  });
  Dexie2.prototype.transaction = function() {
    var args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  };
  Dexie2.prototype._transaction = function(mode, tables, scopeFunc) {
    var _this = this;
    var parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
      parentTransaction = null;
    var onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    var idbMode, storeNames;
    try {
      storeNames = tables.map(function(table) {
        var storeName = table instanceof _this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY)
        idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE)
        idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach(function(storeName) {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
        reject(e);
      }) : rejection(e);
    }
    var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
      return _this._whenReady(enterTransaction);
    }) : this._whenReady(enterTransaction);
  };
  Dexie2.prototype.table = function(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
    }
    return this._allTables[tableName];
  };
  return Dexie2;
}();
var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol["observable"] : "@@observable";
var Observable = function() {
  function Observable2(subscribe) {
    this._subscribe = subscribe;
  }
  Observable2.prototype.subscribe = function(x, error, complete) {
    return this._subscribe(typeof x === "function" ? {next: x, error, complete} : x);
  };
  Observable2.prototype[symbolObservable] = function() {
    return this;
  };
  return Observable2;
}();
function extendObservabilitySet(target, newSet) {
  keys(newSet).forEach(function(part) {
    var rangeSet = target[part] || (target[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target;
}
function liveQuery(querier) {
  return new Observable(function(observer) {
    var scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      var exec = function() {
        return newScope(querier, {subscr, trans: null});
      };
      var rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    var closed = false;
    var accumMuts = {};
    var currentObs = {};
    var subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: function() {
        closed = true;
        globalEvents.txcommitted.unsubscribe(mutationListener);
      }
    };
    observer.start && observer.start(subscription);
    var querying = false, startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some(function(key) {
        return accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]);
      });
    }
    var mutationListener = function(parts) {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    var doQuery = function() {
      if (querying || closed)
        return;
      accumMuts = {};
      var subscr = {};
      var ret = execute(subscr);
      if (!startedListening) {
        globalEvents("txcommitted", mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then(function(result) {
        querying = false;
        if (closed)
          return;
        if (shouldNotify()) {
          doQuery();
        } else {
          accumMuts = {};
          currentObs = subscr;
          observer.next && observer.next(result);
        }
      }, function(err) {
        querying = false;
        observer.error && observer.error(err);
        subscription.unsubscribe();
      });
    };
    doQuery();
    return subscription;
  });
}
var Dexie = Dexie$1;
props(Dexie, __assign(__assign({}, fullNameExceptions), {
  delete: function(databaseName) {
    var db = new Dexie(databaseName);
    return db.delete();
  },
  exists: function(name) {
    return new Dexie(name, {addons: []}).open().then(function(db) {
      db.close();
      return true;
    }).catch("NoSuchDatabaseError", function() {
      return false;
    });
  },
  getDatabaseNames: function(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a2) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass: function() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction: function(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function(generatorFn) {
    return function() {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function(generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function")
        return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: function() {
      return PSD.trans || null;
    }
  },
  waitFor: function(promiseOrFunction, optionalTimeout) {
    var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: function() {
      return debug;
    },
    set: function(value) {
      setDebug(value, value === "dexie" ? function() {
        return true;
      } : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  asap: asap$1,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map(function(n) {
    return parseInt(n);
  }).reduce(function(p, c, i) {
    return p + c / Math.pow(10, i * 2);
  })
}));
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
function fireLocally(updateParts) {
  var wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.txcommitted.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
var propagateLocally = fireLocally;
var propagatingLocally = false;
var accumulatedParts = {};
if (typeof document !== "undefined" && document.addEventListener) {
  var fireIfVisible_1 = function() {
    if (document.visibilityState === "visible") {
      if (Object.keys(accumulatedParts).length > 0) {
        fireLocally(accumulatedParts);
      }
      accumulatedParts = {};
    }
  };
  document.addEventListener("visibilitychange", fireIfVisible_1);
  propagateLocally = function(changedParts) {
    extendObservabilitySet(accumulatedParts, changedParts);
    fireIfVisible_1();
  };
}
if (typeof BroadcastChannel !== "undefined") {
  var bc_1 = new BroadcastChannel("dexie-txcommitted");
  globalEvents("txcommitted", function(changedParts) {
    if (!propagatingLocally) {
      bc_1.postMessage(changedParts);
    }
  });
  bc_1.onmessage = function(ev) {
    if (ev.data)
      propagateLocally(ev.data);
  };
} else if (typeof localStorage !== "undefined") {
  globalEvents("txcommitted", function(changedParts) {
    try {
      if (!propagatingLocally) {
        localStorage.setItem("dexie-txcommitted", JSON.stringify({
          trig: Math.random(),
          changedParts
        }));
      }
    } catch (_a2) {
    }
  });
  addEventListener("storage", function(ev) {
    if (ev.key === "dexie-txcommitted") {
      var data = JSON.parse(ev.newValue);
      if (data)
        propagateLocally(data.changedParts);
    }
  });
}
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

var dexie = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Dexie$1,
  Dexie: Dexie$1,
  RangeSet: RangeSet,
  liveQuery: liveQuery,
  mergeRanges: mergeRanges,
  rangesOverlap: rangesOverlap
});

export { Dexie$1 as D, dexie as d };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4aWUtMTY0YTU2NjMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kZXhpZS9kaXN0L2RleGllLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1Jcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbjIodCkge1xuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAodmFyIHAgaW4gcylcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG4gIH07XG4gIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcbiAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXG4gICAgdG9bal0gPSBmcm9tW2ldO1xuICByZXR1cm4gdG87XG59XG52YXIga2V5cyA9IE9iamVjdC5rZXlzO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xudmFyIF9nbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogZ2xvYmFsO1xuaWYgKHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICYmICFfZ2xvYmFsLlByb21pc2UpIHtcbiAgX2dsb2JhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGV4dGVuZChvYmosIGV4dGVuc2lvbikge1xuICBpZiAodHlwZW9mIGV4dGVuc2lvbiAhPT0gXCJvYmplY3RcIilcbiAgICByZXR1cm4gb2JqO1xuICBrZXlzKGV4dGVuc2lvbikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBvYmpba2V5XSA9IGV4dGVuc2lvbltrZXldO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbnZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBfaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBoYXNPd24ob2JqLCBwcm9wKSB7XG4gIHJldHVybiBfaGFzT3duLmNhbGwob2JqLCBwcm9wKTtcbn1cbmZ1bmN0aW9uIHByb3BzKHByb3RvLCBleHRlbnNpb24pIHtcbiAgaWYgKHR5cGVvZiBleHRlbnNpb24gPT09IFwiZnVuY3Rpb25cIilcbiAgICBleHRlbnNpb24gPSBleHRlbnNpb24oZ2V0UHJvdG8ocHJvdG8pKTtcbiAgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiID8ga2V5cyA6IFJlZmxlY3Qub3duS2V5cykoZXh0ZW5zaW9uKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHNldFByb3AocHJvdG8sIGtleSwgZXh0ZW5zaW9uW2tleV0pO1xuICB9KTtcbn1cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbmZ1bmN0aW9uIHNldFByb3Aob2JqLCBwcm9wLCBmdW5jdGlvbk9yR2V0U2V0LCBvcHRpb25zKSB7XG4gIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZXh0ZW5kKGZ1bmN0aW9uT3JHZXRTZXQgJiYgaGFzT3duKGZ1bmN0aW9uT3JHZXRTZXQsIFwiZ2V0XCIpICYmIHR5cGVvZiBmdW5jdGlvbk9yR2V0U2V0LmdldCA9PT0gXCJmdW5jdGlvblwiID8ge2dldDogZnVuY3Rpb25PckdldFNldC5nZXQsIHNldDogZnVuY3Rpb25PckdldFNldC5zZXQsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0gOiB7dmFsdWU6IGZ1bmN0aW9uT3JHZXRTZXQsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWV9LCBvcHRpb25zKSk7XG59XG5mdW5jdGlvbiBkZXJpdmUoQ2hpbGQpIHtcbiAgcmV0dXJuIHtcbiAgICBmcm9tOiBmdW5jdGlvbihQYXJlbnQpIHtcbiAgICAgIENoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGFyZW50LnByb3RvdHlwZSk7XG4gICAgICBzZXRQcm9wKENoaWxkLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBDaGlsZCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBleHRlbmQ6IHByb3BzLmJpbmQobnVsbCwgQ2hpbGQucHJvdG90eXBlKVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbmZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApIHtcbiAgdmFyIHBkID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gIHZhciBwcm90bztcbiAgcmV0dXJuIHBkIHx8IChwcm90byA9IGdldFByb3RvKG9iaikpICYmIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgcHJvcCk7XG59XG52YXIgX3NsaWNlID0gW10uc2xpY2U7XG5mdW5jdGlvbiBzbGljZShhcmdzLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfc2xpY2UuY2FsbChhcmdzLCBzdGFydCwgZW5kKTtcbn1cbmZ1bmN0aW9uIG92ZXJyaWRlKG9yaWdGdW5jLCBvdmVycmlkZWRGYWN0b3J5KSB7XG4gIHJldHVybiBvdmVycmlkZWRGYWN0b3J5KG9yaWdGdW5jKTtcbn1cbmZ1bmN0aW9uIGFzc2VydChiKSB7XG4gIGlmICghYilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3NlcnRpb24gRmFpbGVkXCIpO1xufVxuZnVuY3Rpb24gYXNhcCQxKGZuKSB7XG4gIGlmIChfZ2xvYmFsLnNldEltbWVkaWF0ZSlcbiAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICBlbHNlXG4gICAgc2V0VGltZW91dChmbiwgMCk7XG59XG5mdW5jdGlvbiBhcnJheVRvT2JqZWN0KGFycmF5LCBleHRyYWN0b3IpIHtcbiAgcmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGl0ZW0sIGkpIHtcbiAgICB2YXIgbmFtZUFuZFZhbHVlID0gZXh0cmFjdG9yKGl0ZW0sIGkpO1xuICAgIGlmIChuYW1lQW5kVmFsdWUpXG4gICAgICByZXN1bHRbbmFtZUFuZFZhbHVlWzBdXSA9IG5hbWVBbmRWYWx1ZVsxXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCB7fSk7XG59XG5mdW5jdGlvbiB0cnlDYXRjaChmbiwgb25lcnJvciwgYXJncykge1xuICB0cnkge1xuICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9IGNhdGNoIChleCkge1xuICAgIG9uZXJyb3IgJiYgb25lcnJvcihleCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEJ5S2V5UGF0aChvYmosIGtleVBhdGgpIHtcbiAgaWYgKGhhc093bihvYmosIGtleVBhdGgpKVxuICAgIHJldHVybiBvYmpba2V5UGF0aF07XG4gIGlmICgha2V5UGF0aClcbiAgICByZXR1cm4gb2JqO1xuICBpZiAodHlwZW9mIGtleVBhdGggIT09IFwic3RyaW5nXCIpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGtleVBhdGgubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICB2YXIgdmFsID0gZ2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aFtpXSk7XG4gICAgICBydi5wdXNoKHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICB2YXIgcGVyaW9kID0ga2V5UGF0aC5pbmRleE9mKFwiLlwiKTtcbiAgaWYgKHBlcmlvZCAhPT0gLTEpIHtcbiAgICB2YXIgaW5uZXJPYmogPSBvYmpba2V5UGF0aC5zdWJzdHIoMCwgcGVyaW9kKV07XG4gICAgcmV0dXJuIGlubmVyT2JqID09PSB2b2lkIDAgPyB2b2lkIDAgOiBnZXRCeUtleVBhdGgoaW5uZXJPYmosIGtleVBhdGguc3Vic3RyKHBlcmlvZCArIDEpKTtcbiAgfVxuICByZXR1cm4gdm9pZCAwO1xufVxuZnVuY3Rpb24gc2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmogfHwga2V5UGF0aCA9PT0gdm9pZCAwKVxuICAgIHJldHVybjtcbiAgaWYgKFwiaXNGcm96ZW5cIiBpbiBPYmplY3QgJiYgT2JqZWN0LmlzRnJvemVuKG9iaikpXG4gICAgcmV0dXJuO1xuICBpZiAodHlwZW9mIGtleVBhdGggIT09IFwic3RyaW5nXCIgJiYgXCJsZW5ndGhcIiBpbiBrZXlQYXRoKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJiBcImxlbmd0aFwiIGluIHZhbHVlKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGtleVBhdGgubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBzZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoW2ldLCB2YWx1ZVtpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBwZXJpb2QgPSBrZXlQYXRoLmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChwZXJpb2QgIT09IC0xKSB7XG4gICAgICB2YXIgY3VycmVudEtleVBhdGggPSBrZXlQYXRoLnN1YnN0cigwLCBwZXJpb2QpO1xuICAgICAgdmFyIHJlbWFpbmluZ0tleVBhdGggPSBrZXlQYXRoLnN1YnN0cihwZXJpb2QgKyAxKTtcbiAgICAgIGlmIChyZW1haW5pbmdLZXlQYXRoID09PSBcIlwiKVxuICAgICAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChpc0FycmF5KG9iaikgJiYgIWlzTmFOKHBhcnNlSW50KGN1cnJlbnRLZXlQYXRoKSkpXG4gICAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRLZXlQYXRoLCAxKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRLZXlQYXRoXTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgb2JqW2N1cnJlbnRLZXlQYXRoXSA9IHZhbHVlO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBpbm5lck9iaiA9IG9ialtjdXJyZW50S2V5UGF0aF07XG4gICAgICAgIGlmICghaW5uZXJPYmopXG4gICAgICAgICAgaW5uZXJPYmogPSBvYmpbY3VycmVudEtleVBhdGhdID0ge307XG4gICAgICAgIHNldEJ5S2V5UGF0aChpbm5lck9iaiwgcmVtYWluaW5nS2V5UGF0aCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICBpZiAoaXNBcnJheShvYmopICYmICFpc05hTihwYXJzZUludChrZXlQYXRoKSkpXG4gICAgICAgICAgb2JqLnNwbGljZShrZXlQYXRoLCAxKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlbGV0ZSBvYmpba2V5UGF0aF07XG4gICAgICB9IGVsc2VcbiAgICAgICAgb2JqW2tleVBhdGhdID0gdmFsdWU7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBkZWxCeUtleVBhdGgob2JqLCBrZXlQYXRoKSB7XG4gIGlmICh0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICBzZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoLCB2b2lkIDApO1xuICBlbHNlIGlmIChcImxlbmd0aFwiIGluIGtleVBhdGgpXG4gICAgW10ubWFwLmNhbGwoa2V5UGF0aCwgZnVuY3Rpb24oa3ApIHtcbiAgICAgIHNldEJ5S2V5UGF0aChvYmosIGtwLCB2b2lkIDApO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc2hhbGxvd0Nsb25lKG9iaikge1xuICB2YXIgcnYgPSB7fTtcbiAgZm9yICh2YXIgbSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duKG9iaiwgbSkpXG4gICAgICBydlttXSA9IG9ialttXTtcbiAgfVxuICByZXR1cm4gcnY7XG59XG52YXIgY29uY2F0ID0gW10uY29uY2F0O1xuZnVuY3Rpb24gZmxhdHRlbihhKSB7XG4gIHJldHVybiBjb25jYXQuYXBwbHkoW10sIGEpO1xufVxudmFyIGludHJpbnNpY1R5cGVOYW1lcyA9IFwiQm9vbGVhbixTdHJpbmcsRGF0ZSxSZWdFeHAsQmxvYixGaWxlLEZpbGVMaXN0LEFycmF5QnVmZmVyLERhdGFWaWV3LFVpbnQ4Q2xhbXBlZEFycmF5LEltYWdlQml0bWFwLEltYWdlRGF0YSxNYXAsU2V0LENyeXB0b0tleVwiLnNwbGl0KFwiLFwiKS5jb25jYXQoZmxhdHRlbihbOCwgMTYsIDMyLCA2NF0ubWFwKGZ1bmN0aW9uKG51bSkge1xuICByZXR1cm4gW1wiSW50XCIsIFwiVWludFwiLCBcIkZsb2F0XCJdLm1hcChmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIHQgKyBudW0gKyBcIkFycmF5XCI7XG4gIH0pO1xufSkpKS5maWx0ZXIoZnVuY3Rpb24odCkge1xuICByZXR1cm4gX2dsb2JhbFt0XTtcbn0pO1xudmFyIGludHJpbnNpY1R5cGVzID0gaW50cmluc2ljVHlwZU5hbWVzLm1hcChmdW5jdGlvbih0KSB7XG4gIHJldHVybiBfZ2xvYmFsW3RdO1xufSk7XG52YXIgaW50cmluc2ljVHlwZU5hbWVTZXQgPSBhcnJheVRvT2JqZWN0KGludHJpbnNpY1R5cGVOYW1lcywgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gW3gsIHRydWVdO1xufSk7XG52YXIgY2lyY3VsYXJSZWZzID0gbnVsbDtcbmZ1bmN0aW9uIGRlZXBDbG9uZShhbnkpIHtcbiAgY2lyY3VsYXJSZWZzID0gdHlwZW9mIFdlYWtNYXAgIT09IFwidW5kZWZpbmVkXCIgJiYgbmV3IFdlYWtNYXAoKTtcbiAgdmFyIHJ2ID0gaW5uZXJEZWVwQ2xvbmUoYW55KTtcbiAgY2lyY3VsYXJSZWZzID0gbnVsbDtcbiAgcmV0dXJuIHJ2O1xufVxuZnVuY3Rpb24gaW5uZXJEZWVwQ2xvbmUoYW55KSB7XG4gIGlmICghYW55IHx8IHR5cGVvZiBhbnkgIT09IFwib2JqZWN0XCIpXG4gICAgcmV0dXJuIGFueTtcbiAgdmFyIHJ2ID0gY2lyY3VsYXJSZWZzICYmIGNpcmN1bGFyUmVmcy5nZXQoYW55KTtcbiAgaWYgKHJ2KVxuICAgIHJldHVybiBydjtcbiAgaWYgKGlzQXJyYXkoYW55KSkge1xuICAgIHJ2ID0gW107XG4gICAgY2lyY3VsYXJSZWZzICYmIGNpcmN1bGFyUmVmcy5zZXQoYW55LCBydik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhbnkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBydi5wdXNoKGlubmVyRGVlcENsb25lKGFueVtpXSkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpbnRyaW5zaWNUeXBlcy5pbmRleE9mKGFueS5jb25zdHJ1Y3RvcikgPj0gMCkge1xuICAgIHJ2ID0gYW55O1xuICB9IGVsc2Uge1xuICAgIHZhciBwcm90byA9IGdldFByb3RvKGFueSk7XG4gICAgcnYgPSBwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSA/IHt9IDogT2JqZWN0LmNyZWF0ZShwcm90byk7XG4gICAgY2lyY3VsYXJSZWZzICYmIGNpcmN1bGFyUmVmcy5zZXQoYW55LCBydik7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBhbnkpIHtcbiAgICAgIGlmIChoYXNPd24oYW55LCBwcm9wKSkge1xuICAgICAgICBydltwcm9wXSA9IGlubmVyRGVlcENsb25lKGFueVtwcm9wXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBydjtcbn1cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuZnVuY3Rpb24gdG9TdHJpbmdUYWcobykge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG59XG52YXIgZ2V0VmFsdWVPZiA9IGZ1bmN0aW9uKHZhbCwgdHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gXCJBcnJheVwiID8gXCJcIiArIHZhbC5tYXAoZnVuY3Rpb24odikge1xuICAgIHJldHVybiBnZXRWYWx1ZU9mKHYsIHRvU3RyaW5nVGFnKHYpKTtcbiAgfSkgOiB0eXBlID09PSBcIkFycmF5QnVmZmVyXCIgPyBcIlwiICsgbmV3IFVpbnQ4QXJyYXkodmFsKSA6IHR5cGUgPT09IFwiRGF0ZVwiID8gdmFsLmdldFRpbWUoKSA6IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpID8gXCJcIiArIG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpIDogdmFsO1xufTtcbmZ1bmN0aW9uIGdldE9iamVjdERpZmYoYSwgYiwgcnYsIHByZngpIHtcbiAgcnYgPSBydiB8fCB7fTtcbiAgcHJmeCA9IHByZnggfHwgXCJcIjtcbiAga2V5cyhhKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICBpZiAoIWhhc093bihiLCBwcm9wKSlcbiAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IHZvaWQgMDtcbiAgICBlbHNlIHtcbiAgICAgIHZhciBhcCA9IGFbcHJvcF0sIGJwID0gYltwcm9wXTtcbiAgICAgIGlmICh0eXBlb2YgYXAgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGJwID09PSBcIm9iamVjdFwiICYmIGFwICYmIGJwKSB7XG4gICAgICAgIHZhciBhcFR5cGVOYW1lID0gdG9TdHJpbmdUYWcoYXApO1xuICAgICAgICB2YXIgYnBUeXBlTmFtZSA9IHRvU3RyaW5nVGFnKGJwKTtcbiAgICAgICAgaWYgKGFwVHlwZU5hbWUgPT09IGJwVHlwZU5hbWUpIHtcbiAgICAgICAgICBpZiAoaW50cmluc2ljVHlwZU5hbWVTZXRbYXBUeXBlTmFtZV0gfHwgaXNBcnJheShhcCkpIHtcbiAgICAgICAgICAgIGlmIChnZXRWYWx1ZU9mKGFwLCBhcFR5cGVOYW1lKSAhPT0gZ2V0VmFsdWVPZihicCwgYnBUeXBlTmFtZSkpIHtcbiAgICAgICAgICAgICAgcnZbcHJmeCArIHByb3BdID0gYltwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0T2JqZWN0RGlmZihhcCwgYnAsIHJ2LCBwcmZ4ICsgcHJvcCArIFwiLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcnZbcHJmeCArIHByb3BdID0gYltwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhcCAhPT0gYnApXG4gICAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IGJbcHJvcF07XG4gICAgfVxuICB9KTtcbiAga2V5cyhiKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICBpZiAoIWhhc093bihhLCBwcm9wKSkge1xuICAgICAgcnZbcHJmeCArIHByb3BdID0gYltwcm9wXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcnY7XG59XG52YXIgaXRlcmF0b3JTeW1ib2wgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sLml0ZXJhdG9yIDogXCJAQGl0ZXJhdG9yXCI7XG52YXIgZ2V0SXRlcmF0b3JPZiA9IHR5cGVvZiBpdGVyYXRvclN5bWJvbCA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGk7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgKGkgPSB4W2l0ZXJhdG9yU3ltYm9sXSkgJiYgaS5hcHBseSh4KTtcbn0gOiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG51bGw7XG59O1xudmFyIE5PX0NIQVJfQVJSQVkgPSB7fTtcbmZ1bmN0aW9uIGdldEFycmF5T2YoYXJyYXlMaWtlKSB7XG4gIHZhciBpLCBhLCB4LCBpdDtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAoaXNBcnJheShhcnJheUxpa2UpKVxuICAgICAgcmV0dXJuIGFycmF5TGlrZS5zbGljZSgpO1xuICAgIGlmICh0aGlzID09PSBOT19DSEFSX0FSUkFZICYmIHR5cGVvZiBhcnJheUxpa2UgPT09IFwic3RyaW5nXCIpXG4gICAgICByZXR1cm4gW2FycmF5TGlrZV07XG4gICAgaWYgKGl0ID0gZ2V0SXRlcmF0b3JPZihhcnJheUxpa2UpKSB7XG4gICAgICBhID0gW107XG4gICAgICB3aGlsZSAoeCA9IGl0Lm5leHQoKSwgIXguZG9uZSlcbiAgICAgICAgYS5wdXNoKHgudmFsdWUpO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbClcbiAgICAgIHJldHVybiBbYXJyYXlMaWtlXTtcbiAgICBpID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICBpZiAodHlwZW9mIGkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGEgPSBuZXcgQXJyYXkoaSk7XG4gICAgICB3aGlsZSAoaS0tKVxuICAgICAgICBhW2ldID0gYXJyYXlMaWtlW2ldO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBbYXJyYXlMaWtlXTtcbiAgfVxuICBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgYSA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSlcbiAgICBhW2ldID0gYXJndW1lbnRzW2ldO1xuICByZXR1cm4gYTtcbn1cbnZhciBpc0FzeW5jRnVuY3Rpb24gPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiID8gZnVuY3Rpb24oZm4pIHtcbiAgcmV0dXJuIGZuW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09IFwiQXN5bmNGdW5jdGlvblwiO1xufSA6IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xudmFyIGRlYnVnID0gdHlwZW9mIGxvY2F0aW9uICE9PSBcInVuZGVmaW5lZFwiICYmIC9eKGh0dHB8aHR0cHMpOlxcL1xcLyhsb2NhbGhvc3R8MTI3XFwuMFxcLjBcXC4xKS8udGVzdChsb2NhdGlvbi5ocmVmKTtcbmZ1bmN0aW9uIHNldERlYnVnKHZhbHVlLCBmaWx0ZXIpIHtcbiAgZGVidWcgPSB2YWx1ZTtcbiAgbGlicmFyeUZpbHRlciA9IGZpbHRlcjtcbn1cbnZhciBsaWJyYXJ5RmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBORUVEU19USFJPV19GT1JfU1RBQ0sgPSAhbmV3IEVycm9yKFwiXCIpLnN0YWNrO1xuZnVuY3Rpb24gZ2V0RXJyb3JXaXRoU3RhY2soKSB7XG4gIGlmIChORUVEU19USFJPV19GT1JfU1RBQ0spXG4gICAgdHJ5IHtcbiAgICAgIGdldEVycm9yV2l0aFN0YWNrLmFyZ3VtZW50cztcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgcmV0dXJuIG5ldyBFcnJvcigpO1xufVxuZnVuY3Rpb24gcHJldHR5U3RhY2soZXhjZXB0aW9uLCBudW1JZ25vcmVkRnJhbWVzKSB7XG4gIHZhciBzdGFjayA9IGV4Y2VwdGlvbi5zdGFjaztcbiAgaWYgKCFzdGFjaylcbiAgICByZXR1cm4gXCJcIjtcbiAgbnVtSWdub3JlZEZyYW1lcyA9IG51bUlnbm9yZWRGcmFtZXMgfHwgMDtcbiAgaWYgKHN0YWNrLmluZGV4T2YoZXhjZXB0aW9uLm5hbWUpID09PSAwKVxuICAgIG51bUlnbm9yZWRGcmFtZXMgKz0gKGV4Y2VwdGlvbi5uYW1lICsgZXhjZXB0aW9uLm1lc3NhZ2UpLnNwbGl0KFwiXFxuXCIpLmxlbmd0aDtcbiAgcmV0dXJuIHN0YWNrLnNwbGl0KFwiXFxuXCIpLnNsaWNlKG51bUlnbm9yZWRGcmFtZXMpLmZpbHRlcihsaWJyYXJ5RmlsdGVyKS5tYXAoZnVuY3Rpb24oZnJhbWUpIHtcbiAgICByZXR1cm4gXCJcXG5cIiArIGZyYW1lO1xuICB9KS5qb2luKFwiXCIpO1xufVxudmFyIGRleGllRXJyb3JOYW1lcyA9IFtcbiAgXCJNb2RpZnlcIixcbiAgXCJCdWxrXCIsXG4gIFwiT3BlbkZhaWxlZFwiLFxuICBcIlZlcnNpb25DaGFuZ2VcIixcbiAgXCJTY2hlbWFcIixcbiAgXCJVcGdyYWRlXCIsXG4gIFwiSW52YWxpZFRhYmxlXCIsXG4gIFwiTWlzc2luZ0FQSVwiLFxuICBcIk5vU3VjaERhdGFiYXNlXCIsXG4gIFwiSW52YWxpZEFyZ3VtZW50XCIsXG4gIFwiU3ViVHJhbnNhY3Rpb25cIixcbiAgXCJVbnN1cHBvcnRlZFwiLFxuICBcIkludGVybmFsXCIsXG4gIFwiRGF0YWJhc2VDbG9zZWRcIixcbiAgXCJQcmVtYXR1cmVDb21taXRcIixcbiAgXCJGb3JlaWduQXdhaXRcIlxuXTtcbnZhciBpZGJEb21FcnJvck5hbWVzID0gW1xuICBcIlVua25vd25cIixcbiAgXCJDb25zdHJhaW50XCIsXG4gIFwiRGF0YVwiLFxuICBcIlRyYW5zYWN0aW9uSW5hY3RpdmVcIixcbiAgXCJSZWFkT25seVwiLFxuICBcIlZlcnNpb25cIixcbiAgXCJOb3RGb3VuZFwiLFxuICBcIkludmFsaWRTdGF0ZVwiLFxuICBcIkludmFsaWRBY2Nlc3NcIixcbiAgXCJBYm9ydFwiLFxuICBcIlRpbWVvdXRcIixcbiAgXCJRdW90YUV4Y2VlZGVkXCIsXG4gIFwiU3ludGF4XCIsXG4gIFwiRGF0YUNsb25lXCJcbl07XG52YXIgZXJyb3JMaXN0ID0gZGV4aWVFcnJvck5hbWVzLmNvbmNhdChpZGJEb21FcnJvck5hbWVzKTtcbnZhciBkZWZhdWx0VGV4dHMgPSB7XG4gIFZlcnNpb25DaGFuZ2VkOiBcIkRhdGFiYXNlIHZlcnNpb24gY2hhbmdlZCBieSBvdGhlciBkYXRhYmFzZSBjb25uZWN0aW9uXCIsXG4gIERhdGFiYXNlQ2xvc2VkOiBcIkRhdGFiYXNlIGhhcyBiZWVuIGNsb3NlZFwiLFxuICBBYm9ydDogXCJUcmFuc2FjdGlvbiBhYm9ydGVkXCIsXG4gIFRyYW5zYWN0aW9uSW5hY3RpdmU6IFwiVHJhbnNhY3Rpb24gaGFzIGFscmVhZHkgY29tcGxldGVkIG9yIGZhaWxlZFwiLFxuICBNaXNzaW5nQVBJOiBcIkluZGV4ZWREQiBBUEkgbWlzc2luZy4gUGxlYXNlIHZpc2l0IGh0dHBzOi8vdGlueXVybC5jb20veTJ1dXZza2JcIlxufTtcbmZ1bmN0aW9uIERleGllRXJyb3IobmFtZSwgbXNnKSB7XG4gIHRoaXMuX2UgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLm1lc3NhZ2UgPSBtc2c7XG59XG5kZXJpdmUoRGV4aWVFcnJvcikuZnJvbShFcnJvcikuZXh0ZW5kKHtcbiAgc3RhY2s6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YWNrIHx8ICh0aGlzLl9zdGFjayA9IHRoaXMubmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZSArIHByZXR0eVN0YWNrKHRoaXMuX2UsIDIpKTtcbiAgICB9XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlO1xuICB9XG59KTtcbmZ1bmN0aW9uIGdldE11bHRpRXJyb3JNZXNzYWdlKG1zZywgZmFpbHVyZXMpIHtcbiAgcmV0dXJuIG1zZyArIFwiLiBFcnJvcnM6IFwiICsgT2JqZWN0LmtleXMoZmFpbHVyZXMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZmFpbHVyZXNba2V5XS50b1N0cmluZygpO1xuICB9KS5maWx0ZXIoZnVuY3Rpb24odiwgaSwgcykge1xuICAgIHJldHVybiBzLmluZGV4T2YodikgPT09IGk7XG4gIH0pLmpvaW4oXCJcXG5cIik7XG59XG5mdW5jdGlvbiBNb2RpZnlFcnJvcihtc2csIGZhaWx1cmVzLCBzdWNjZXNzQ291bnQsIGZhaWxlZEtleXMpIHtcbiAgdGhpcy5fZSA9IGdldEVycm9yV2l0aFN0YWNrKCk7XG4gIHRoaXMuZmFpbHVyZXMgPSBmYWlsdXJlcztcbiAgdGhpcy5mYWlsZWRLZXlzID0gZmFpbGVkS2V5cztcbiAgdGhpcy5zdWNjZXNzQ291bnQgPSBzdWNjZXNzQ291bnQ7XG4gIHRoaXMubWVzc2FnZSA9IGdldE11bHRpRXJyb3JNZXNzYWdlKG1zZywgZmFpbHVyZXMpO1xufVxuZGVyaXZlKE1vZGlmeUVycm9yKS5mcm9tKERleGllRXJyb3IpO1xuZnVuY3Rpb24gQnVsa0Vycm9yKG1zZywgZmFpbHVyZXMpIHtcbiAgdGhpcy5fZSA9IGdldEVycm9yV2l0aFN0YWNrKCk7XG4gIHRoaXMubmFtZSA9IFwiQnVsa0Vycm9yXCI7XG4gIHRoaXMuZmFpbHVyZXMgPSBPYmplY3Qua2V5cyhmYWlsdXJlcykubWFwKGZ1bmN0aW9uKHBvcykge1xuICAgIHJldHVybiBmYWlsdXJlc1twb3NdO1xuICB9KTtcbiAgdGhpcy5mYWlsdXJlc0J5UG9zID0gZmFpbHVyZXM7XG4gIHRoaXMubWVzc2FnZSA9IGdldE11bHRpRXJyb3JNZXNzYWdlKG1zZywgZmFpbHVyZXMpO1xufVxuZGVyaXZlKEJ1bGtFcnJvcikuZnJvbShEZXhpZUVycm9yKTtcbnZhciBlcnJuYW1lcyA9IGVycm9yTGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBuYW1lKSB7XG4gIHJldHVybiBvYmpbbmFtZV0gPSBuYW1lICsgXCJFcnJvclwiLCBvYmo7XG59LCB7fSk7XG52YXIgQmFzZUV4Y2VwdGlvbiA9IERleGllRXJyb3I7XG52YXIgZXhjZXB0aW9ucyA9IGVycm9yTGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBuYW1lKSB7XG4gIHZhciBmdWxsTmFtZSA9IG5hbWUgKyBcIkVycm9yXCI7XG4gIGZ1bmN0aW9uIERleGllRXJyb3IyKG1zZ09ySW5uZXIsIGlubmVyKSB7XG4gICAgdGhpcy5fZSA9IGdldEVycm9yV2l0aFN0YWNrKCk7XG4gICAgdGhpcy5uYW1lID0gZnVsbE5hbWU7XG4gICAgaWYgKCFtc2dPcklubmVyKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBkZWZhdWx0VGV4dHNbbmFtZV0gfHwgZnVsbE5hbWU7XG4gICAgICB0aGlzLmlubmVyID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtc2dPcklubmVyID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcIlwiICsgbXNnT3JJbm5lciArICghaW5uZXIgPyBcIlwiIDogXCJcXG4gXCIgKyBpbm5lcik7XG4gICAgICB0aGlzLmlubmVyID0gaW5uZXIgfHwgbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtc2dPcklubmVyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtc2dPcklubmVyLm5hbWUgKyBcIiBcIiArIG1zZ09ySW5uZXIubWVzc2FnZTtcbiAgICAgIHRoaXMuaW5uZXIgPSBtc2dPcklubmVyO1xuICAgIH1cbiAgfVxuICBkZXJpdmUoRGV4aWVFcnJvcjIpLmZyb20oQmFzZUV4Y2VwdGlvbik7XG4gIG9ialtuYW1lXSA9IERleGllRXJyb3IyO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuZXhjZXB0aW9ucy5TeW50YXggPSBTeW50YXhFcnJvcjtcbmV4Y2VwdGlvbnMuVHlwZSA9IFR5cGVFcnJvcjtcbmV4Y2VwdGlvbnMuUmFuZ2UgPSBSYW5nZUVycm9yO1xudmFyIGV4Y2VwdGlvbk1hcCA9IGlkYkRvbUVycm9yTmFtZXMucmVkdWNlKGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICBvYmpbbmFtZSArIFwiRXJyb3JcIl0gPSBleGNlcHRpb25zW25hbWVdO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuZnVuY3Rpb24gbWFwRXJyb3IoZG9tRXJyb3IsIG1lc3NhZ2UpIHtcbiAgaWYgKCFkb21FcnJvciB8fCBkb21FcnJvciBpbnN0YW5jZW9mIERleGllRXJyb3IgfHwgZG9tRXJyb3IgaW5zdGFuY2VvZiBUeXBlRXJyb3IgfHwgZG9tRXJyb3IgaW5zdGFuY2VvZiBTeW50YXhFcnJvciB8fCAhZG9tRXJyb3IubmFtZSB8fCAhZXhjZXB0aW9uTWFwW2RvbUVycm9yLm5hbWVdKVxuICAgIHJldHVybiBkb21FcnJvcjtcbiAgdmFyIHJ2ID0gbmV3IGV4Y2VwdGlvbk1hcFtkb21FcnJvci5uYW1lXShtZXNzYWdlIHx8IGRvbUVycm9yLm1lc3NhZ2UsIGRvbUVycm9yKTtcbiAgaWYgKFwic3RhY2tcIiBpbiBkb21FcnJvcikge1xuICAgIHNldFByb3AocnYsIFwic3RhY2tcIiwge2dldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbm5lci5zdGFjaztcbiAgICB9fSk7XG4gIH1cbiAgcmV0dXJuIHJ2O1xufVxudmFyIGZ1bGxOYW1lRXhjZXB0aW9ucyA9IGVycm9yTGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBuYW1lKSB7XG4gIGlmIChbXCJTeW50YXhcIiwgXCJUeXBlXCIsIFwiUmFuZ2VcIl0uaW5kZXhPZihuYW1lKSA9PT0gLTEpXG4gICAgb2JqW25hbWUgKyBcIkVycm9yXCJdID0gZXhjZXB0aW9uc1tuYW1lXTtcbiAgcmV0dXJuIG9iajtcbn0sIHt9KTtcbmZ1bGxOYW1lRXhjZXB0aW9ucy5Nb2RpZnlFcnJvciA9IE1vZGlmeUVycm9yO1xuZnVsbE5hbWVFeGNlcHRpb25zLkRleGllRXJyb3IgPSBEZXhpZUVycm9yO1xuZnVsbE5hbWVFeGNlcHRpb25zLkJ1bGtFcnJvciA9IEJ1bGtFcnJvcjtcbmZ1bmN0aW9uIG5vcCgpIHtcbn1cbmZ1bmN0aW9uIG1pcnJvcih2YWwpIHtcbiAgcmV0dXJuIHZhbDtcbn1cbmZ1bmN0aW9uIHB1cmVGdW5jdGlvbkNoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT0gbnVsbCB8fCBmMSA9PT0gbWlycm9yKVxuICAgIHJldHVybiBmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiBmMihmMSh2YWwpKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNhbGxCb3RoKG9uMSwgb24yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBvbjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBvbjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGhvb2tDcmVhdGluZ0NoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT09IG5vcClcbiAgICByZXR1cm4gZjI7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzICE9PSB2b2lkIDApXG4gICAgICBhcmd1bWVudHNbMF0gPSByZXM7XG4gICAgdmFyIG9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzLCBvbmVycm9yID0gdGhpcy5vbmVycm9yO1xuICAgIHRoaXMub25zdWNjZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgIHZhciByZXMyID0gZjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAob25zdWNjZXNzKVxuICAgICAgdGhpcy5vbnN1Y2Nlc3MgPSB0aGlzLm9uc3VjY2VzcyA/IGNhbGxCb3RoKG9uc3VjY2VzcywgdGhpcy5vbnN1Y2Nlc3MpIDogb25zdWNjZXNzO1xuICAgIGlmIChvbmVycm9yKVxuICAgICAgdGhpcy5vbmVycm9yID0gdGhpcy5vbmVycm9yID8gY2FsbEJvdGgob25lcnJvciwgdGhpcy5vbmVycm9yKSA6IG9uZXJyb3I7XG4gICAgcmV0dXJuIHJlczIgIT09IHZvaWQgMCA/IHJlczIgOiByZXM7XG4gIH07XG59XG5mdW5jdGlvbiBob29rRGVsZXRpbmdDaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09PSBub3ApXG4gICAgcmV0dXJuIGYyO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgb25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MsIG9uZXJyb3IgPSB0aGlzLm9uZXJyb3I7XG4gICAgdGhpcy5vbnN1Y2Nlc3MgPSB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgIGYyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKG9uc3VjY2VzcylcbiAgICAgIHRoaXMub25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MgPyBjYWxsQm90aChvbnN1Y2Nlc3MsIHRoaXMub25zdWNjZXNzKSA6IG9uc3VjY2VzcztcbiAgICBpZiAob25lcnJvcilcbiAgICAgIHRoaXMub25lcnJvciA9IHRoaXMub25lcnJvciA/IGNhbGxCb3RoKG9uZXJyb3IsIHRoaXMub25lcnJvcikgOiBvbmVycm9yO1xuICB9O1xufVxuZnVuY3Rpb24gaG9va1VwZGF0aW5nQ2hhaW4oZjEsIGYyKSB7XG4gIGlmIChmMSA9PT0gbm9wKVxuICAgIHJldHVybiBmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uKG1vZGlmaWNhdGlvbnMpIHtcbiAgICB2YXIgcmVzID0gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBleHRlbmQobW9kaWZpY2F0aW9ucywgcmVzKTtcbiAgICB2YXIgb25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MsIG9uZXJyb3IgPSB0aGlzLm9uZXJyb3I7XG4gICAgdGhpcy5vbnN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMub25lcnJvciA9IG51bGw7XG4gICAgdmFyIHJlczIgPSBmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChvbnN1Y2Nlc3MpXG4gICAgICB0aGlzLm9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzID8gY2FsbEJvdGgob25zdWNjZXNzLCB0aGlzLm9uc3VjY2VzcykgOiBvbnN1Y2Nlc3M7XG4gICAgaWYgKG9uZXJyb3IpXG4gICAgICB0aGlzLm9uZXJyb3IgPSB0aGlzLm9uZXJyb3IgPyBjYWxsQm90aChvbmVycm9yLCB0aGlzLm9uZXJyb3IpIDogb25lcnJvcjtcbiAgICByZXR1cm4gcmVzID09PSB2b2lkIDAgPyByZXMyID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZXMyIDogZXh0ZW5kKHJlcywgcmVzMik7XG4gIH07XG59XG5mdW5jdGlvbiByZXZlcnNlU3RvcHBhYmxlRXZlbnRDaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09PSBub3ApXG4gICAgcmV0dXJuIGYyO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGYyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBmMS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuZnVuY3Rpb24gcHJvbWlzYWJsZUNoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT09IG5vcClcbiAgICByZXR1cm4gZjI7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgdGhpeiA9IHRoaXMsIGkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGkpO1xuICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIHJldHVybiByZXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGYyLmFwcGx5KHRoaXosIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxudmFyIElOVEVSTkFMID0ge307XG52YXIgTE9OR19TVEFDS1NfQ0xJUF9MSU1JVCA9IDEwMCwgTUFYX0xPTkdfU1RBQ0tTID0gMjAsIFpPTkVfRUNIT19MSU1JVCA9IDEwMCwgX2EkMSA9IHR5cGVvZiBQcm9taXNlID09PSBcInVuZGVmaW5lZFwiID8gW10gOiBmdW5jdGlvbigpIHtcbiAgdmFyIGdsb2JhbFAgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgaWYgKHR5cGVvZiBjcnlwdG8gPT09IFwidW5kZWZpbmVkXCIgfHwgIWNyeXB0by5zdWJ0bGUpXG4gICAgcmV0dXJuIFtnbG9iYWxQLCBnZXRQcm90byhnbG9iYWxQKSwgZ2xvYmFsUF07XG4gIHZhciBuYXRpdmVQID0gY3J5cHRvLnN1YnRsZS5kaWdlc3QoXCJTSEEtNTEyXCIsIG5ldyBVaW50OEFycmF5KFswXSkpO1xuICByZXR1cm4gW1xuICAgIG5hdGl2ZVAsXG4gICAgZ2V0UHJvdG8obmF0aXZlUCksXG4gICAgZ2xvYmFsUFxuICBdO1xufSgpLCByZXNvbHZlZE5hdGl2ZVByb21pc2UgPSBfYSQxWzBdLCBuYXRpdmVQcm9taXNlUHJvdG8gPSBfYSQxWzFdLCByZXNvbHZlZEdsb2JhbFByb21pc2UgPSBfYSQxWzJdLCBuYXRpdmVQcm9taXNlVGhlbiA9IG5hdGl2ZVByb21pc2VQcm90byAmJiBuYXRpdmVQcm9taXNlUHJvdG8udGhlbjtcbnZhciBOYXRpdmVQcm9taXNlID0gcmVzb2x2ZWROYXRpdmVQcm9taXNlICYmIHJlc29sdmVkTmF0aXZlUHJvbWlzZS5jb25zdHJ1Y3RvcjtcbnZhciBwYXRjaEdsb2JhbFByb21pc2UgPSAhIXJlc29sdmVkR2xvYmFsUHJvbWlzZTtcbnZhciBzdGFja19iZWluZ19nZW5lcmF0ZWQgPSBmYWxzZTtcbnZhciBzY2hlZHVsZVBoeXNpY2FsVGljayA9IHJlc29sdmVkR2xvYmFsUHJvbWlzZSA/IGZ1bmN0aW9uKCkge1xuICByZXNvbHZlZEdsb2JhbFByb21pc2UudGhlbihwaHlzaWNhbFRpY2spO1xufSA6IF9nbG9iYWwuc2V0SW1tZWRpYXRlID8gc2V0SW1tZWRpYXRlLmJpbmQobnVsbCwgcGh5c2ljYWxUaWNrKSA6IF9nbG9iYWwuTXV0YXRpb25PYnNlcnZlciA/IGZ1bmN0aW9uKCkge1xuICB2YXIgaGlkZGVuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oKSB7XG4gICAgcGh5c2ljYWxUaWNrKCk7XG4gICAgaGlkZGVuRGl2ID0gbnVsbDtcbiAgfSkub2JzZXJ2ZShoaWRkZW5EaXYsIHthdHRyaWJ1dGVzOiB0cnVlfSk7XG4gIGhpZGRlbkRpdi5zZXRBdHRyaWJ1dGUoXCJpXCIsIFwiMVwiKTtcbn0gOiBmdW5jdGlvbigpIHtcbiAgc2V0VGltZW91dChwaHlzaWNhbFRpY2ssIDApO1xufTtcbnZhciBhc2FwID0gZnVuY3Rpb24oY2FsbGJhY2ssIGFyZ3MpIHtcbiAgbWljcm90aWNrUXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ3NdKTtcbiAgaWYgKG5lZWRzTmV3UGh5c2ljYWxUaWNrKSB7XG4gICAgc2NoZWR1bGVQaHlzaWNhbFRpY2soKTtcbiAgICBuZWVkc05ld1BoeXNpY2FsVGljayA9IGZhbHNlO1xuICB9XG59O1xudmFyIGlzT3V0c2lkZU1pY3JvVGljayA9IHRydWUsIG5lZWRzTmV3UGh5c2ljYWxUaWNrID0gdHJ1ZSwgdW5oYW5kbGVkRXJyb3JzID0gW10sIHJlamVjdGluZ0Vycm9ycyA9IFtdLCBjdXJyZW50RnVsZmlsbGVyID0gbnVsbCwgcmVqZWN0aW9uTWFwcGVyID0gbWlycm9yO1xudmFyIGdsb2JhbFBTRCA9IHtcbiAgaWQ6IFwiZ2xvYmFsXCIsXG4gIGdsb2JhbDogdHJ1ZSxcbiAgcmVmOiAwLFxuICB1bmhhbmRsZWRzOiBbXSxcbiAgb251bmhhbmRsZWQ6IGdsb2JhbEVycm9yLFxuICBwZ3A6IGZhbHNlLFxuICBlbnY6IHt9LFxuICBmaW5hbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51bmhhbmRsZWRzLmZvckVhY2goZnVuY3Rpb24odWgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbEVycm9yKHVoWzBdLCB1aFsxXSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG52YXIgUFNEID0gZ2xvYmFsUFNEO1xudmFyIG1pY3JvdGlja1F1ZXVlID0gW107XG52YXIgbnVtU2NoZWR1bGVkQ2FsbHMgPSAwO1xudmFyIHRpY2tGaW5hbGl6ZXJzID0gW107XG5mdW5jdGlvbiBEZXhpZVByb21pc2UoZm4pIHtcbiAgaWYgKHR5cGVvZiB0aGlzICE9PSBcIm9iamVjdFwiKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXdcIik7XG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB0aGlzLm9udW5jYXRjaGVkID0gbm9wO1xuICB0aGlzLl9saWIgPSBmYWxzZTtcbiAgdmFyIHBzZCA9IHRoaXMuX1BTRCA9IFBTRDtcbiAgaWYgKGRlYnVnKSB7XG4gICAgdGhpcy5fc3RhY2tIb2xkZXIgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICAgIHRoaXMuX3ByZXYgPSBudWxsO1xuICAgIHRoaXMuX251bVByZXYgPSAwO1xuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09IFwiZnVuY3Rpb25cIikge1xuICAgIGlmIChmbiAhPT0gSU5URVJOQUwpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7XG4gICAgdGhpcy5fc3RhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgdGhpcy5fdmFsdWUgPSBhcmd1bWVudHNbMl07XG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSBmYWxzZSlcbiAgICAgIGhhbmRsZVJlamVjdGlvbih0aGlzLCB0aGlzLl92YWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICArK3BzZC5yZWY7XG4gIGV4ZWN1dGVQcm9taXNlVGFzayh0aGlzLCBmbik7XG59XG52YXIgdGhlblByb3AgPSB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBzZCA9IFBTRCwgbWljcm9UYXNrSWQgPSB0b3RhbEVjaG9lcztcbiAgICBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdmFyIHBvc3NpYmxlQXdhaXQgPSAhcHNkLmdsb2JhbCAmJiAocHNkICE9PSBQU0QgfHwgbWljcm9UYXNrSWQgIT09IHRvdGFsRWNob2VzKTtcbiAgICAgIHZhciBjbGVhbnVwID0gcG9zc2libGVBd2FpdCAmJiAhZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgIHZhciBydiA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHByb3BhZ2F0ZVRvTGlzdGVuZXIoX3RoaXMsIG5ldyBMaXN0ZW5lcihuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKG9uRnVsZmlsbGVkLCBwc2QsIHBvc3NpYmxlQXdhaXQsIGNsZWFudXApLCBuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKG9uUmVqZWN0ZWQsIHBzZCwgcG9zc2libGVBd2FpdCwgY2xlYW51cCksIHJlc29sdmUsIHJlamVjdCwgcHNkKSk7XG4gICAgICB9KTtcbiAgICAgIGRlYnVnICYmIGxpbmtUb1ByZXZpb3VzUHJvbWlzZShydiwgdGhpcyk7XG4gICAgICByZXR1cm4gcnY7XG4gICAgfVxuICAgIHRoZW4ucHJvdG90eXBlID0gSU5URVJOQUw7XG4gICAgcmV0dXJuIHRoZW47XG4gIH0sXG4gIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBzZXRQcm9wKHRoaXMsIFwidGhlblwiLCB2YWx1ZSAmJiB2YWx1ZS5wcm90b3R5cGUgPT09IElOVEVSTkFMID8gdGhlblByb3AgOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgICAgc2V0OiB0aGVuUHJvcC5zZXRcbiAgICB9KTtcbiAgfVxufTtcbnByb3BzKERleGllUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgdGhlbjogdGhlblByb3AsXG4gIF90aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIHByb3BhZ2F0ZVRvTGlzdGVuZXIodGhpcywgbmV3IExpc3RlbmVyKG51bGwsIG51bGwsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBQU0QpKTtcbiAgfSxcbiAgY2F0Y2g6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gICAgdmFyIHR5cGUgPSBhcmd1bWVudHNbMF0sIGhhbmRsZXIgPSBhcmd1bWVudHNbMV07XG4gICAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLnRoZW4obnVsbCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXR1cm4gZXJyIGluc3RhbmNlb2YgdHlwZSA/IGhhbmRsZXIoZXJyKSA6IFByb21pc2VSZWplY3QoZXJyKTtcbiAgICB9KSA6IHRoaXMudGhlbihudWxsLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJldHVybiBlcnIgJiYgZXJyLm5hbWUgPT09IHR5cGUgPyBoYW5kbGVyKGVycikgOiBQcm9taXNlUmVqZWN0KGVycik7XG4gICAgfSk7XG4gIH0sXG4gIGZpbmFsbHk6IGZ1bmN0aW9uKG9uRmluYWxseSkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIG9uRmluYWxseSgpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgb25GaW5hbGx5KCk7XG4gICAgICByZXR1cm4gUHJvbWlzZVJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9LFxuICBzdGFjazoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fc3RhY2spXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFjaztcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YWNrX2JlaW5nX2dlbmVyYXRlZCA9IHRydWU7XG4gICAgICAgIHZhciBzdGFja3MgPSBnZXRTdGFjayh0aGlzLCBbXSwgTUFYX0xPTkdfU1RBQ0tTKTtcbiAgICAgICAgdmFyIHN0YWNrID0gc3RhY2tzLmpvaW4oXCJcXG5Gcm9tIHByZXZpb3VzOiBcIik7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLl9zdGFjayA9IHN0YWNrO1xuICAgICAgICByZXR1cm4gc3RhY2s7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzdGFja19iZWluZ19nZW5lcmF0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRpbWVvdXQ6IGZ1bmN0aW9uKG1zLCBtc2cpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBtcyA8IEluZmluaXR5ID8gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBoYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBleGNlcHRpb25zLlRpbWVvdXQobXNnKSk7XG4gICAgICB9LCBtcyk7XG4gICAgICBfdGhpcy50aGVuKHJlc29sdmUsIHJlamVjdCkuZmluYWxseShjbGVhclRpbWVvdXQuYmluZChudWxsLCBoYW5kbGUpKTtcbiAgICB9KSA6IHRoaXM7XG4gIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKVxuICBzZXRQcm9wKERleGllUHJvbWlzZS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgXCJEZXhpZS5Qcm9taXNlXCIpO1xuZ2xvYmFsUFNELmVudiA9IHNuYXBTaG90KCk7XG5mdW5jdGlvbiBMaXN0ZW5lcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzb2x2ZSwgcmVqZWN0LCB6b25lKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09IFwiZnVuY3Rpb25cIiA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09IFwiZnVuY3Rpb25cIiA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICB0aGlzLnJlamVjdCA9IHJlamVjdDtcbiAgdGhpcy5wc2QgPSB6b25lO1xufVxucHJvcHMoRGV4aWVQcm9taXNlLCB7XG4gIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IGdldEFycmF5T2YuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5tYXAob25Qb3NzaWJsZVBhcmFsbGVsbEFzeW5jKTtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24oYSwgaSkge1xuICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUoYSkudGhlbihmdW5jdGlvbih4KSB7XG4gICAgICAgICAgdmFsdWVzW2ldID0geDtcbiAgICAgICAgICBpZiAoIS0tcmVtYWluaW5nKVxuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHJlc29sdmU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGV4aWVQcm9taXNlKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhbHVlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIHZhciBydiA9IG5ldyBEZXhpZVByb21pc2UoSU5URVJOQUwsIHRydWUsIHZhbHVlKTtcbiAgICBsaW5rVG9QcmV2aW91c1Byb21pc2UocnYsIGN1cnJlbnRGdWxmaWxsZXIpO1xuICAgIHJldHVybiBydjtcbiAgfSxcbiAgcmVqZWN0OiBQcm9taXNlUmVqZWN0LFxuICByYWNlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWVzID0gZ2V0QXJyYXlPZi5hcHBseShudWxsLCBhcmd1bWVudHMpLm1hcChvblBvc3NpYmxlUGFyYWxsZWxsQXN5bmMpO1xuICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFsdWVzLm1hcChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBQU0Q6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBTRDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBQU0QgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHRvdGFsRWNob2VzOiB7Z2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdG90YWxFY2hvZXM7XG4gIH19LFxuICBuZXdQU0Q6IG5ld1Njb3BlLFxuICB1c2VQU0QsXG4gIHNjaGVkdWxlcjoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXNhcDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGFzYXAgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHJlamVjdGlvbk1hcHBlcjoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uTWFwcGVyO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmVqZWN0aW9uTWFwcGVyID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICBmb2xsb3c6IGZ1bmN0aW9uKGZuLCB6b25lUHJvcHMpIHtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBuZXdTY29wZShmdW5jdGlvbihyZXNvbHZlMiwgcmVqZWN0Mikge1xuICAgICAgICB2YXIgcHNkID0gUFNEO1xuICAgICAgICBwc2QudW5oYW5kbGVkcyA9IFtdO1xuICAgICAgICBwc2Qub251bmhhbmRsZWQgPSByZWplY3QyO1xuICAgICAgICBwc2QuZmluYWxpemUgPSBjYWxsQm90aChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgIHJ1bl9hdF9lbmRfb2ZfdGhpc19vcl9uZXh0X3BoeXNpY2FsX3RpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfdGhpcy51bmhhbmRsZWRzLmxlbmd0aCA9PT0gMCA/IHJlc29sdmUyKCkgOiByZWplY3QyKF90aGlzLnVuaGFuZGxlZHNbMF0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBwc2QuZmluYWxpemUpO1xuICAgICAgICBmbigpO1xuICAgICAgfSwgem9uZVByb3BzLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbmlmIChOYXRpdmVQcm9taXNlKSB7XG4gIGlmIChOYXRpdmVQcm9taXNlLmFsbFNldHRsZWQpXG4gICAgc2V0UHJvcChEZXhpZVByb21pc2UsIFwiYWxsU2V0dGxlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NzaWJsZVByb21pc2VzID0gZ2V0QXJyYXlPZi5hcHBseShudWxsLCBhcmd1bWVudHMpLm1hcChvblBvc3NpYmxlUGFyYWxsZWxsQXN5bmMpO1xuICAgICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBpZiAocG9zc2libGVQcm9taXNlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSBwb3NzaWJsZVByb21pc2VzLmxlbmd0aDtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkocmVtYWluaW5nKTtcbiAgICAgICAgcG9zc2libGVQcm9taXNlcy5mb3JFYWNoKGZ1bmN0aW9uKHAsIGkpIHtcbiAgICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUocCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNbaV0gPSB7c3RhdHVzOiBcImZ1bGZpbGxlZFwiLCB2YWx1ZX07XG4gICAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c1tpXSA9IHtzdGF0dXM6IFwicmVqZWN0ZWRcIiwgcmVhc29ufTtcbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIGlmIChOYXRpdmVQcm9taXNlLmFueSAmJiB0eXBlb2YgQWdncmVnYXRlRXJyb3IgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgc2V0UHJvcChEZXhpZVByb21pc2UsIFwiYW55XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc3NpYmxlUHJvbWlzZXMgPSBnZXRBcnJheU9mLmFwcGx5KG51bGwsIGFyZ3VtZW50cykubWFwKG9uUG9zc2libGVQYXJhbGxlbGxBc3luYyk7XG4gICAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlUHJvbWlzZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgIHJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10pKTtcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHBvc3NpYmxlUHJvbWlzZXMubGVuZ3RoO1xuICAgICAgICB2YXIgZmFpbHVyZXMgPSBuZXcgQXJyYXkocmVtYWluaW5nKTtcbiAgICAgICAgcG9zc2libGVQcm9taXNlcy5mb3JFYWNoKGZ1bmN0aW9uKHAsIGkpIHtcbiAgICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUocCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGZhaWx1cmUpIHtcbiAgICAgICAgICAgIGZhaWx1cmVzW2ldID0gZmFpbHVyZTtcbiAgICAgICAgICAgIGlmICghLS1yZW1haW5pbmcpXG4gICAgICAgICAgICAgIHJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoZmFpbHVyZXMpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGV4ZWN1dGVQcm9taXNlVGFzayhwcm9taXNlLCBmbikge1xuICB0cnkge1xuICAgIGZuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IG51bGwpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmICh2YWx1ZSA9PT0gcHJvbWlzZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuXCIpO1xuICAgICAgdmFyIHNob3VsZEV4ZWN1dGVUaWNrID0gcHJvbWlzZS5fbGliICYmIGJlZ2luTWljcm9UaWNrU2NvcGUoKTtcbiAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGV4ZWN1dGVQcm9taXNlVGFzayhwcm9taXNlLCBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICB2YWx1ZSBpbnN0YW5jZW9mIERleGllUHJvbWlzZSA/IHZhbHVlLl90aGVuKHJlc29sdmUsIHJlamVjdCkgOiB2YWx1ZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZS5fc3RhdGUgPSB0cnVlO1xuICAgICAgICBwcm9taXNlLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICBwcm9wYWdhdGVBbGxMaXN0ZW5lcnMocHJvbWlzZSk7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdWxkRXhlY3V0ZVRpY2spXG4gICAgICAgIGVuZE1pY3JvVGlja1Njb3BlKCk7XG4gICAgfSwgaGFuZGxlUmVqZWN0aW9uLmJpbmQobnVsbCwgcHJvbWlzZSkpO1xuICB9IGNhdGNoIChleCkge1xuICAgIGhhbmRsZVJlamVjdGlvbihwcm9taXNlLCBleCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZVJlamVjdGlvbihwcm9taXNlLCByZWFzb24pIHtcbiAgcmVqZWN0aW5nRXJyb3JzLnB1c2gocmVhc29uKTtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBudWxsKVxuICAgIHJldHVybjtcbiAgdmFyIHNob3VsZEV4ZWN1dGVUaWNrID0gcHJvbWlzZS5fbGliICYmIGJlZ2luTWljcm9UaWNrU2NvcGUoKTtcbiAgcmVhc29uID0gcmVqZWN0aW9uTWFwcGVyKHJlYXNvbik7XG4gIHByb21pc2UuX3N0YXRlID0gZmFsc2U7XG4gIHByb21pc2UuX3ZhbHVlID0gcmVhc29uO1xuICBkZWJ1ZyAmJiByZWFzb24gIT09IG51bGwgJiYgdHlwZW9mIHJlYXNvbiA9PT0gXCJvYmplY3RcIiAmJiAhcmVhc29uLl9wcm9taXNlICYmIHRyeUNhdGNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcmlnUHJvcCA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihyZWFzb24sIFwic3RhY2tcIik7XG4gICAgcmVhc29uLl9wcm9taXNlID0gcHJvbWlzZTtcbiAgICBzZXRQcm9wKHJlYXNvbiwgXCJzdGFja1wiLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RhY2tfYmVpbmdfZ2VuZXJhdGVkID8gb3JpZ1Byb3AgJiYgKG9yaWdQcm9wLmdldCA/IG9yaWdQcm9wLmdldC5hcHBseShyZWFzb24pIDogb3JpZ1Byb3AudmFsdWUpIDogcHJvbWlzZS5zdGFjaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGFkZFBvc3NpYmx5VW5oYW5kbGVkRXJyb3IocHJvbWlzZSk7XG4gIHByb3BhZ2F0ZUFsbExpc3RlbmVycyhwcm9taXNlKTtcbiAgaWYgKHNob3VsZEV4ZWN1dGVUaWNrKVxuICAgIGVuZE1pY3JvVGlja1Njb3BlKCk7XG59XG5mdW5jdGlvbiBwcm9wYWdhdGVBbGxMaXN0ZW5lcnMocHJvbWlzZSkge1xuICB2YXIgbGlzdGVuZXJzID0gcHJvbWlzZS5fbGlzdGVuZXJzO1xuICBwcm9taXNlLl9saXN0ZW5lcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHByb3BhZ2F0ZVRvTGlzdGVuZXIocHJvbWlzZSwgbGlzdGVuZXJzW2ldKTtcbiAgfVxuICB2YXIgcHNkID0gcHJvbWlzZS5fUFNEO1xuICAtLXBzZC5yZWYgfHwgcHNkLmZpbmFsaXplKCk7XG4gIGlmIChudW1TY2hlZHVsZWRDYWxscyA9PT0gMCkge1xuICAgICsrbnVtU2NoZWR1bGVkQ2FsbHM7XG4gICAgYXNhcChmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLW51bVNjaGVkdWxlZENhbGxzID09PSAwKVxuICAgICAgICBmaW5hbGl6ZVBoeXNpY2FsVGljaygpO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuZnVuY3Rpb24gcHJvcGFnYXRlVG9MaXN0ZW5lcihwcm9taXNlLCBsaXN0ZW5lcikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IG51bGwpIHtcbiAgICBwcm9taXNlLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBjYiA9IHByb21pc2UuX3N0YXRlID8gbGlzdGVuZXIub25GdWxmaWxsZWQgOiBsaXN0ZW5lci5vblJlamVjdGVkO1xuICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICByZXR1cm4gKHByb21pc2UuX3N0YXRlID8gbGlzdGVuZXIucmVzb2x2ZSA6IGxpc3RlbmVyLnJlamVjdCkocHJvbWlzZS5fdmFsdWUpO1xuICB9XG4gICsrbGlzdGVuZXIucHNkLnJlZjtcbiAgKytudW1TY2hlZHVsZWRDYWxscztcbiAgYXNhcChjYWxsTGlzdGVuZXIsIFtjYiwgcHJvbWlzZSwgbGlzdGVuZXJdKTtcbn1cbmZ1bmN0aW9uIGNhbGxMaXN0ZW5lcihjYiwgcHJvbWlzZSwgbGlzdGVuZXIpIHtcbiAgdHJ5IHtcbiAgICBjdXJyZW50RnVsZmlsbGVyID0gcHJvbWlzZTtcbiAgICB2YXIgcmV0LCB2YWx1ZSA9IHByb21pc2UuX3ZhbHVlO1xuICAgIGlmIChwcm9taXNlLl9zdGF0ZSkge1xuICAgICAgcmV0ID0gY2IodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVqZWN0aW5nRXJyb3JzLmxlbmd0aClcbiAgICAgICAgcmVqZWN0aW5nRXJyb3JzID0gW107XG4gICAgICByZXQgPSBjYih2YWx1ZSk7XG4gICAgICBpZiAocmVqZWN0aW5nRXJyb3JzLmluZGV4T2YodmFsdWUpID09PSAtMSlcbiAgICAgICAgbWFya0Vycm9yQXNIYW5kbGVkKHByb21pc2UpO1xuICAgIH1cbiAgICBsaXN0ZW5lci5yZXNvbHZlKHJldCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsaXN0ZW5lci5yZWplY3QoZSk7XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudEZ1bGZpbGxlciA9IG51bGw7XG4gICAgaWYgKC0tbnVtU2NoZWR1bGVkQ2FsbHMgPT09IDApXG4gICAgICBmaW5hbGl6ZVBoeXNpY2FsVGljaygpO1xuICAgIC0tbGlzdGVuZXIucHNkLnJlZiB8fCBsaXN0ZW5lci5wc2QuZmluYWxpemUoKTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0U3RhY2socHJvbWlzZSwgc3RhY2tzLCBsaW1pdCkge1xuICBpZiAoc3RhY2tzLmxlbmd0aCA9PT0gbGltaXQpXG4gICAgcmV0dXJuIHN0YWNrcztcbiAgdmFyIHN0YWNrID0gXCJcIjtcbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBmYWxzZSkge1xuICAgIHZhciBmYWlsdXJlID0gcHJvbWlzZS5fdmFsdWUsIGVycm9yTmFtZSwgbWVzc2FnZTtcbiAgICBpZiAoZmFpbHVyZSAhPSBudWxsKSB7XG4gICAgICBlcnJvck5hbWUgPSBmYWlsdXJlLm5hbWUgfHwgXCJFcnJvclwiO1xuICAgICAgbWVzc2FnZSA9IGZhaWx1cmUubWVzc2FnZSB8fCBmYWlsdXJlO1xuICAgICAgc3RhY2sgPSBwcmV0dHlTdGFjayhmYWlsdXJlLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JOYW1lID0gZmFpbHVyZTtcbiAgICAgIG1lc3NhZ2UgPSBcIlwiO1xuICAgIH1cbiAgICBzdGFja3MucHVzaChlcnJvck5hbWUgKyAobWVzc2FnZSA/IFwiOiBcIiArIG1lc3NhZ2UgOiBcIlwiKSArIHN0YWNrKTtcbiAgfVxuICBpZiAoZGVidWcpIHtcbiAgICBzdGFjayA9IHByZXR0eVN0YWNrKHByb21pc2UuX3N0YWNrSG9sZGVyLCAyKTtcbiAgICBpZiAoc3RhY2sgJiYgc3RhY2tzLmluZGV4T2Yoc3RhY2spID09PSAtMSlcbiAgICAgIHN0YWNrcy5wdXNoKHN0YWNrKTtcbiAgICBpZiAocHJvbWlzZS5fcHJldilcbiAgICAgIGdldFN0YWNrKHByb21pc2UuX3ByZXYsIHN0YWNrcywgbGltaXQpO1xuICB9XG4gIHJldHVybiBzdGFja3M7XG59XG5mdW5jdGlvbiBsaW5rVG9QcmV2aW91c1Byb21pc2UocHJvbWlzZSwgcHJldikge1xuICB2YXIgbnVtUHJldiA9IHByZXYgPyBwcmV2Ll9udW1QcmV2ICsgMSA6IDA7XG4gIGlmIChudW1QcmV2IDwgTE9OR19TVEFDS1NfQ0xJUF9MSU1JVCkge1xuICAgIHByb21pc2UuX3ByZXYgPSBwcmV2O1xuICAgIHByb21pc2UuX251bVByZXYgPSBudW1QcmV2O1xuICB9XG59XG5mdW5jdGlvbiBwaHlzaWNhbFRpY2soKSB7XG4gIGJlZ2luTWljcm9UaWNrU2NvcGUoKSAmJiBlbmRNaWNyb1RpY2tTY29wZSgpO1xufVxuZnVuY3Rpb24gYmVnaW5NaWNyb1RpY2tTY29wZSgpIHtcbiAgdmFyIHdhc1Jvb3RFeGVjID0gaXNPdXRzaWRlTWljcm9UaWNrO1xuICBpc091dHNpZGVNaWNyb1RpY2sgPSBmYWxzZTtcbiAgbmVlZHNOZXdQaHlzaWNhbFRpY2sgPSBmYWxzZTtcbiAgcmV0dXJuIHdhc1Jvb3RFeGVjO1xufVxuZnVuY3Rpb24gZW5kTWljcm9UaWNrU2NvcGUoKSB7XG4gIHZhciBjYWxsYmFja3MsIGksIGw7XG4gIGRvIHtcbiAgICB3aGlsZSAobWljcm90aWNrUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY2FsbGJhY2tzID0gbWljcm90aWNrUXVldWU7XG4gICAgICBtaWNyb3RpY2tRdWV1ZSA9IFtdO1xuICAgICAgbCA9IGNhbGxiYWNrcy5sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIHZhciBpdGVtID0gY2FsbGJhY2tzW2ldO1xuICAgICAgICBpdGVtWzBdLmFwcGx5KG51bGwsIGl0ZW1bMV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAobWljcm90aWNrUXVldWUubGVuZ3RoID4gMCk7XG4gIGlzT3V0c2lkZU1pY3JvVGljayA9IHRydWU7XG4gIG5lZWRzTmV3UGh5c2ljYWxUaWNrID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGZpbmFsaXplUGh5c2ljYWxUaWNrKCkge1xuICB2YXIgdW5oYW5kbGVkRXJycyA9IHVuaGFuZGxlZEVycm9ycztcbiAgdW5oYW5kbGVkRXJyb3JzID0gW107XG4gIHVuaGFuZGxlZEVycnMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgcC5fUFNELm9udW5oYW5kbGVkLmNhbGwobnVsbCwgcC5fdmFsdWUsIHApO1xuICB9KTtcbiAgdmFyIGZpbmFsaXplcnMgPSB0aWNrRmluYWxpemVycy5zbGljZSgwKTtcbiAgdmFyIGkgPSBmaW5hbGl6ZXJzLmxlbmd0aDtcbiAgd2hpbGUgKGkpXG4gICAgZmluYWxpemVyc1stLWldKCk7XG59XG5mdW5jdGlvbiBydW5fYXRfZW5kX29mX3RoaXNfb3JfbmV4dF9waHlzaWNhbF90aWNrKGZuKSB7XG4gIGZ1bmN0aW9uIGZpbmFsaXplcigpIHtcbiAgICBmbigpO1xuICAgIHRpY2tGaW5hbGl6ZXJzLnNwbGljZSh0aWNrRmluYWxpemVycy5pbmRleE9mKGZpbmFsaXplciksIDEpO1xuICB9XG4gIHRpY2tGaW5hbGl6ZXJzLnB1c2goZmluYWxpemVyKTtcbiAgKytudW1TY2hlZHVsZWRDYWxscztcbiAgYXNhcChmdW5jdGlvbigpIHtcbiAgICBpZiAoLS1udW1TY2hlZHVsZWRDYWxscyA9PT0gMClcbiAgICAgIGZpbmFsaXplUGh5c2ljYWxUaWNrKCk7XG4gIH0sIFtdKTtcbn1cbmZ1bmN0aW9uIGFkZFBvc3NpYmx5VW5oYW5kbGVkRXJyb3IocHJvbWlzZSkge1xuICBpZiAoIXVuaGFuZGxlZEVycm9ycy5zb21lKGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gcC5fdmFsdWUgPT09IHByb21pc2UuX3ZhbHVlO1xuICB9KSlcbiAgICB1bmhhbmRsZWRFcnJvcnMucHVzaChwcm9taXNlKTtcbn1cbmZ1bmN0aW9uIG1hcmtFcnJvckFzSGFuZGxlZChwcm9taXNlKSB7XG4gIHZhciBpID0gdW5oYW5kbGVkRXJyb3JzLmxlbmd0aDtcbiAgd2hpbGUgKGkpXG4gICAgaWYgKHVuaGFuZGxlZEVycm9yc1stLWldLl92YWx1ZSA9PT0gcHJvbWlzZS5fdmFsdWUpIHtcbiAgICAgIHVuaGFuZGxlZEVycm9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxufVxuZnVuY3Rpb24gUHJvbWlzZVJlamVjdChyZWFzb24pIHtcbiAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoSU5URVJOQUwsIGZhbHNlLCByZWFzb24pO1xufVxuZnVuY3Rpb24gd3JhcChmbiwgZXJyb3JDYXRjaGVyKSB7XG4gIHZhciBwc2QgPSBQU0Q7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgd2FzUm9vdEV4ZWMgPSBiZWdpbk1pY3JvVGlja1Njb3BlKCksIG91dGVyU2NvcGUgPSBQU0Q7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaFRvWm9uZShwc2QsIHRydWUpO1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JDYXRjaGVyICYmIGVycm9yQ2F0Y2hlcihlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc3dpdGNoVG9ab25lKG91dGVyU2NvcGUsIGZhbHNlKTtcbiAgICAgIGlmICh3YXNSb290RXhlYylcbiAgICAgICAgZW5kTWljcm9UaWNrU2NvcGUoKTtcbiAgICB9XG4gIH07XG59XG52YXIgdGFzayA9IHthd2FpdHM6IDAsIGVjaG9lczogMCwgaWQ6IDB9O1xudmFyIHRhc2tDb3VudGVyID0gMDtcbnZhciB6b25lU3RhY2sgPSBbXTtcbnZhciB6b25lRWNob2VzID0gMDtcbnZhciB0b3RhbEVjaG9lcyA9IDA7XG52YXIgem9uZV9pZF9jb3VudGVyID0gMDtcbmZ1bmN0aW9uIG5ld1Njb3BlKGZuLCBwcm9wczIsIGExLCBhMikge1xuICB2YXIgcGFyZW50ID0gUFNELCBwc2QgPSBPYmplY3QuY3JlYXRlKHBhcmVudCk7XG4gIHBzZC5wYXJlbnQgPSBwYXJlbnQ7XG4gIHBzZC5yZWYgPSAwO1xuICBwc2QuZ2xvYmFsID0gZmFsc2U7XG4gIHBzZC5pZCA9ICsrem9uZV9pZF9jb3VudGVyO1xuICB2YXIgZ2xvYmFsRW52ID0gZ2xvYmFsUFNELmVudjtcbiAgcHNkLmVudiA9IHBhdGNoR2xvYmFsUHJvbWlzZSA/IHtcbiAgICBQcm9taXNlOiBEZXhpZVByb21pc2UsXG4gICAgUHJvbWlzZVByb3A6IHt2YWx1ZTogRGV4aWVQcm9taXNlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlfSxcbiAgICBhbGw6IERleGllUHJvbWlzZS5hbGwsXG4gICAgcmFjZTogRGV4aWVQcm9taXNlLnJhY2UsXG4gICAgYWxsU2V0dGxlZDogRGV4aWVQcm9taXNlLmFsbFNldHRsZWQsXG4gICAgYW55OiBEZXhpZVByb21pc2UuYW55LFxuICAgIHJlc29sdmU6IERleGllUHJvbWlzZS5yZXNvbHZlLFxuICAgIHJlamVjdDogRGV4aWVQcm9taXNlLnJlamVjdCxcbiAgICBudGhlbjogZ2V0UGF0Y2hlZFByb21pc2VUaGVuKGdsb2JhbEVudi5udGhlbiwgcHNkKSxcbiAgICBndGhlbjogZ2V0UGF0Y2hlZFByb21pc2VUaGVuKGdsb2JhbEVudi5ndGhlbiwgcHNkKVxuICB9IDoge307XG4gIGlmIChwcm9wczIpXG4gICAgZXh0ZW5kKHBzZCwgcHJvcHMyKTtcbiAgKytwYXJlbnQucmVmO1xuICBwc2QuZmluYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAtLXRoaXMucGFyZW50LnJlZiB8fCB0aGlzLnBhcmVudC5maW5hbGl6ZSgpO1xuICB9O1xuICB2YXIgcnYgPSB1c2VQU0QocHNkLCBmbiwgYTEsIGEyKTtcbiAgaWYgKHBzZC5yZWYgPT09IDApXG4gICAgcHNkLmZpbmFsaXplKCk7XG4gIHJldHVybiBydjtcbn1cbmZ1bmN0aW9uIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCkge1xuICBpZiAoIXRhc2suaWQpXG4gICAgdGFzay5pZCA9ICsrdGFza0NvdW50ZXI7XG4gICsrdGFzay5hd2FpdHM7XG4gIHRhc2suZWNob2VzICs9IFpPTkVfRUNIT19MSU1JVDtcbiAgcmV0dXJuIHRhc2suaWQ7XG59XG5mdW5jdGlvbiBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cygpIHtcbiAgaWYgKCF0YXNrLmF3YWl0cylcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmICgtLXRhc2suYXdhaXRzID09PSAwKVxuICAgIHRhc2suaWQgPSAwO1xuICB0YXNrLmVjaG9lcyA9IHRhc2suYXdhaXRzICogWk9ORV9FQ0hPX0xJTUlUO1xuICByZXR1cm4gdHJ1ZTtcbn1cbmlmICgoXCJcIiArIG5hdGl2ZVByb21pc2VUaGVuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSA9PT0gLTEpIHtcbiAgaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMgPSBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cyA9IG5vcDtcbn1cbmZ1bmN0aW9uIG9uUG9zc2libGVQYXJhbGxlbGxBc3luYyhwb3NzaWJsZVByb21pc2UpIHtcbiAgaWYgKHRhc2suZWNob2VzICYmIHBvc3NpYmxlUHJvbWlzZSAmJiBwb3NzaWJsZVByb21pc2UuY29uc3RydWN0b3IgPT09IE5hdGl2ZVByb21pc2UpIHtcbiAgICBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgIHJldHVybiBwb3NzaWJsZVByb21pc2UudGhlbihmdW5jdGlvbih4KSB7XG4gICAgICBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSwgZnVuY3Rpb24oZSkge1xuICAgICAgZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgIHJldHVybiByZWplY3Rpb24oZSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHBvc3NpYmxlUHJvbWlzZTtcbn1cbmZ1bmN0aW9uIHpvbmVFbnRlckVjaG8odGFyZ2V0Wm9uZSkge1xuICArK3RvdGFsRWNob2VzO1xuICBpZiAoIXRhc2suZWNob2VzIHx8IC0tdGFzay5lY2hvZXMgPT09IDApIHtcbiAgICB0YXNrLmVjaG9lcyA9IHRhc2suaWQgPSAwO1xuICB9XG4gIHpvbmVTdGFjay5wdXNoKFBTRCk7XG4gIHN3aXRjaFRvWm9uZSh0YXJnZXRab25lLCB0cnVlKTtcbn1cbmZ1bmN0aW9uIHpvbmVMZWF2ZUVjaG8oKSB7XG4gIHZhciB6b25lID0gem9uZVN0YWNrW3pvbmVTdGFjay5sZW5ndGggLSAxXTtcbiAgem9uZVN0YWNrLnBvcCgpO1xuICBzd2l0Y2hUb1pvbmUoem9uZSwgZmFsc2UpO1xufVxuZnVuY3Rpb24gc3dpdGNoVG9ab25lKHRhcmdldFpvbmUsIGJFbnRlcmluZ1pvbmUpIHtcbiAgdmFyIGN1cnJlbnRab25lID0gUFNEO1xuICBpZiAoYkVudGVyaW5nWm9uZSA/IHRhc2suZWNob2VzICYmICghem9uZUVjaG9lcysrIHx8IHRhcmdldFpvbmUgIT09IFBTRCkgOiB6b25lRWNob2VzICYmICghLS16b25lRWNob2VzIHx8IHRhcmdldFpvbmUgIT09IFBTRCkpIHtcbiAgICBlbnF1ZXVlTmF0aXZlTWljcm9UYXNrKGJFbnRlcmluZ1pvbmUgPyB6b25lRW50ZXJFY2hvLmJpbmQobnVsbCwgdGFyZ2V0Wm9uZSkgOiB6b25lTGVhdmVFY2hvKTtcbiAgfVxuICBpZiAodGFyZ2V0Wm9uZSA9PT0gUFNEKVxuICAgIHJldHVybjtcbiAgUFNEID0gdGFyZ2V0Wm9uZTtcbiAgaWYgKGN1cnJlbnRab25lID09PSBnbG9iYWxQU0QpXG4gICAgZ2xvYmFsUFNELmVudiA9IHNuYXBTaG90KCk7XG4gIGlmIChwYXRjaEdsb2JhbFByb21pc2UpIHtcbiAgICB2YXIgR2xvYmFsUHJvbWlzZV8xID0gZ2xvYmFsUFNELmVudi5Qcm9taXNlO1xuICAgIHZhciB0YXJnZXRFbnYgPSB0YXJnZXRab25lLmVudjtcbiAgICBuYXRpdmVQcm9taXNlUHJvdG8udGhlbiA9IHRhcmdldEVudi5udGhlbjtcbiAgICBHbG9iYWxQcm9taXNlXzEucHJvdG90eXBlLnRoZW4gPSB0YXJnZXRFbnYuZ3RoZW47XG4gICAgaWYgKGN1cnJlbnRab25lLmdsb2JhbCB8fCB0YXJnZXRab25lLmdsb2JhbCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9nbG9iYWwsIFwiUHJvbWlzZVwiLCB0YXJnZXRFbnYuUHJvbWlzZVByb3ApO1xuICAgICAgR2xvYmFsUHJvbWlzZV8xLmFsbCA9IHRhcmdldEVudi5hbGw7XG4gICAgICBHbG9iYWxQcm9taXNlXzEucmFjZSA9IHRhcmdldEVudi5yYWNlO1xuICAgICAgR2xvYmFsUHJvbWlzZV8xLnJlc29sdmUgPSB0YXJnZXRFbnYucmVzb2x2ZTtcbiAgICAgIEdsb2JhbFByb21pc2VfMS5yZWplY3QgPSB0YXJnZXRFbnYucmVqZWN0O1xuICAgICAgaWYgKHRhcmdldEVudi5hbGxTZXR0bGVkKVxuICAgICAgICBHbG9iYWxQcm9taXNlXzEuYWxsU2V0dGxlZCA9IHRhcmdldEVudi5hbGxTZXR0bGVkO1xuICAgICAgaWYgKHRhcmdldEVudi5hbnkpXG4gICAgICAgIEdsb2JhbFByb21pc2VfMS5hbnkgPSB0YXJnZXRFbnYuYW55O1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gc25hcFNob3QoKSB7XG4gIHZhciBHbG9iYWxQcm9taXNlID0gX2dsb2JhbC5Qcm9taXNlO1xuICByZXR1cm4gcGF0Y2hHbG9iYWxQcm9taXNlID8ge1xuICAgIFByb21pc2U6IEdsb2JhbFByb21pc2UsXG4gICAgUHJvbWlzZVByb3A6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoX2dsb2JhbCwgXCJQcm9taXNlXCIpLFxuICAgIGFsbDogR2xvYmFsUHJvbWlzZS5hbGwsXG4gICAgcmFjZTogR2xvYmFsUHJvbWlzZS5yYWNlLFxuICAgIGFsbFNldHRsZWQ6IEdsb2JhbFByb21pc2UuYWxsU2V0dGxlZCxcbiAgICBhbnk6IEdsb2JhbFByb21pc2UuYW55LFxuICAgIHJlc29sdmU6IEdsb2JhbFByb21pc2UucmVzb2x2ZSxcbiAgICByZWplY3Q6IEdsb2JhbFByb21pc2UucmVqZWN0LFxuICAgIG50aGVuOiBuYXRpdmVQcm9taXNlUHJvdG8udGhlbixcbiAgICBndGhlbjogR2xvYmFsUHJvbWlzZS5wcm90b3R5cGUudGhlblxuICB9IDoge307XG59XG5mdW5jdGlvbiB1c2VQU0QocHNkLCBmbiwgYTEsIGEyLCBhMykge1xuICB2YXIgb3V0ZXJTY29wZSA9IFBTRDtcbiAgdHJ5IHtcbiAgICBzd2l0Y2hUb1pvbmUocHNkLCB0cnVlKTtcbiAgICByZXR1cm4gZm4oYTEsIGEyLCBhMyk7XG4gIH0gZmluYWxseSB7XG4gICAgc3dpdGNoVG9ab25lKG91dGVyU2NvcGUsIGZhbHNlKTtcbiAgfVxufVxuZnVuY3Rpb24gZW5xdWV1ZU5hdGl2ZU1pY3JvVGFzayhqb2IpIHtcbiAgbmF0aXZlUHJvbWlzZVRoZW4uY2FsbChyZXNvbHZlZE5hdGl2ZVByb21pc2UsIGpvYik7XG59XG5mdW5jdGlvbiBuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKGZuLCB6b25lLCBwb3NzaWJsZUF3YWl0LCBjbGVhbnVwKSB7XG4gIHJldHVybiB0eXBlb2YgZm4gIT09IFwiZnVuY3Rpb25cIiA/IGZuIDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dGVyWm9uZSA9IFBTRDtcbiAgICBpZiAocG9zc2libGVBd2FpdClcbiAgICAgIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgc3dpdGNoVG9ab25lKHpvbmUsIHRydWUpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc3dpdGNoVG9ab25lKG91dGVyWm9uZSwgZmFsc2UpO1xuICAgICAgaWYgKGNsZWFudXApXG4gICAgICAgIGVucXVldWVOYXRpdmVNaWNyb1Rhc2soZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGdldFBhdGNoZWRQcm9taXNlVGhlbihvcmlnVGhlbiwgem9uZSkge1xuICByZXR1cm4gZnVuY3Rpb24ob25SZXNvbHZlZCwgb25SZWplY3RlZCkge1xuICAgIHJldHVybiBvcmlnVGhlbi5jYWxsKHRoaXMsIG5hdGl2ZUF3YWl0Q29tcGF0aWJsZVdyYXAob25SZXNvbHZlZCwgem9uZSksIG5hdGl2ZUF3YWl0Q29tcGF0aWJsZVdyYXAob25SZWplY3RlZCwgem9uZSkpO1xuICB9O1xufVxudmFyIFVOSEFORExFRFJFSkVDVElPTiA9IFwidW5oYW5kbGVkcmVqZWN0aW9uXCI7XG5mdW5jdGlvbiBnbG9iYWxFcnJvcihlcnIsIHByb21pc2UpIHtcbiAgdmFyIHJ2O1xuICB0cnkge1xuICAgIHJ2ID0gcHJvbWlzZS5vbnVuY2F0Y2hlZChlcnIpO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgaWYgKHJ2ICE9PSBmYWxzZSlcbiAgICB0cnkge1xuICAgICAgdmFyIGV2ZW50LCBldmVudERhdGEgPSB7cHJvbWlzZSwgcmVhc29uOiBlcnJ9O1xuICAgICAgaWYgKF9nbG9iYWwuZG9jdW1lbnQgJiYgZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgICAgICBldmVudC5pbml0RXZlbnQoVU5IQU5ETEVEUkVKRUNUSU9OLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgZXh0ZW5kKGV2ZW50LCBldmVudERhdGEpO1xuICAgICAgfSBlbHNlIGlmIChfZ2xvYmFsLkN1c3RvbUV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFVOSEFORExFRFJFSkVDVElPTiwge2RldGFpbDogZXZlbnREYXRhfSk7XG4gICAgICAgIGV4dGVuZChldmVudCwgZXZlbnREYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmIChldmVudCAmJiBfZ2xvYmFsLmRpc3BhdGNoRXZlbnQpIHtcbiAgICAgICAgZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIGlmICghX2dsb2JhbC5Qcm9taXNlUmVqZWN0aW9uRXZlbnQgJiYgX2dsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbilcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgX2dsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbihldmVudCk7XG4gICAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkZWJ1ZyAmJiBldmVudCAmJiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgcmVqZWN0aW9uOiBcIiArIChlcnIuc3RhY2sgfHwgZXJyKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbn1cbnZhciByZWplY3Rpb24gPSBEZXhpZVByb21pc2UucmVqZWN0O1xuZnVuY3Rpb24gdGVtcFRyYW5zYWN0aW9uKGRiLCBtb2RlLCBzdG9yZU5hbWVzLCBmbikge1xuICBpZiAoIWRiLl9zdGF0ZS5vcGVuQ29tcGxldGUgJiYgIVBTRC5sZXRUaHJvdWdoKSB7XG4gICAgaWYgKCFkYi5fc3RhdGUuaXNCZWluZ09wZW5lZCkge1xuICAgICAgaWYgKCFkYi5fb3B0aW9ucy5hdXRvT3BlbilcbiAgICAgICAgcmV0dXJuIHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5EYXRhYmFzZUNsb3NlZCgpKTtcbiAgICAgIGRiLm9wZW4oKS5jYXRjaChub3ApO1xuICAgIH1cbiAgICByZXR1cm4gZGIuX3N0YXRlLmRiUmVhZHlQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGVtcFRyYW5zYWN0aW9uKGRiLCBtb2RlLCBzdG9yZU5hbWVzLCBmbik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRyYW5zID0gZGIuX2NyZWF0ZVRyYW5zYWN0aW9uKG1vZGUsIHN0b3JlTmFtZXMsIGRiLl9kYlNjaGVtYSk7XG4gICAgdHJ5IHtcbiAgICAgIHRyYW5zLmNyZWF0ZSgpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zLl9wcm9taXNlKG1vZGUsIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIG5ld1Njb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICBQU0QudHJhbnMgPSB0cmFucztcbiAgICAgICAgcmV0dXJuIGZuKHJlc29sdmUsIHJlamVjdCwgdHJhbnMpO1xuICAgICAgfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIHJldHVybiB0cmFucy5fY29tcGxldGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbnZhciBERVhJRV9WRVJTSU9OID0gXCIzLjEuMC1hbHBoYS4xMFwiO1xudmFyIG1heFN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjU1MzUpO1xudmFyIG1pbktleSA9IC1JbmZpbml0eTtcbnZhciBJTlZBTElEX0tFWV9BUkdVTUVOVCA9IFwiSW52YWxpZCBrZXkgcHJvdmlkZWQuIEtleXMgbXVzdCBiZSBvZiB0eXBlIHN0cmluZywgbnVtYmVyLCBEYXRlIG9yIEFycmF5PHN0cmluZyB8IG51bWJlciB8IERhdGU+LlwiO1xudmFyIFNUUklOR19FWFBFQ1RFRCA9IFwiU3RyaW5nIGV4cGVjdGVkLlwiO1xudmFyIGNvbm5lY3Rpb25zID0gW107XG52YXIgaXNJRU9yRWRnZSA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgLyhNU0lFfFRyaWRlbnR8RWRnZSkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG52YXIgaGFzSUVEZWxldGVPYmplY3RTdG9yZUJ1ZyA9IGlzSUVPckVkZ2U7XG52YXIgaGFuZ3NPbkRlbGV0ZUxhcmdlS2V5UmFuZ2UgPSBpc0lFT3JFZGdlO1xudmFyIGRleGllU3RhY2tGcmFtZUZpbHRlciA9IGZ1bmN0aW9uKGZyYW1lKSB7XG4gIHJldHVybiAhLyhkZXhpZVxcLmpzfGRleGllXFwubWluXFwuanMpLy50ZXN0KGZyYW1lKTtcbn07XG52YXIgREJOQU1FU19EQiA9IFwiX19kYm5hbWVzXCI7XG52YXIgUkVBRE9OTFkgPSBcInJlYWRvbmx5XCI7XG52YXIgUkVBRFdSSVRFID0gXCJyZWFkd3JpdGVcIjtcbmZ1bmN0aW9uIGNvbWJpbmUoZmlsdGVyMSwgZmlsdGVyMikge1xuICByZXR1cm4gZmlsdGVyMSA/IGZpbHRlcjIgPyBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmlsdGVyMS5hcHBseSh0aGlzLCBhcmd1bWVudHMpICYmIGZpbHRlcjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSA6IGZpbHRlcjEgOiBmaWx0ZXIyO1xufVxudmFyIGRvbURlcHM7XG50cnkge1xuICBkb21EZXBzID0ge1xuICAgIGluZGV4ZWREQjogX2dsb2JhbC5pbmRleGVkREIgfHwgX2dsb2JhbC5tb3pJbmRleGVkREIgfHwgX2dsb2JhbC53ZWJraXRJbmRleGVkREIgfHwgX2dsb2JhbC5tc0luZGV4ZWREQixcbiAgICBJREJLZXlSYW5nZTogX2dsb2JhbC5JREJLZXlSYW5nZSB8fCBfZ2xvYmFsLndlYmtpdElEQktleVJhbmdlXG4gIH07XG59IGNhdGNoIChlKSB7XG4gIGRvbURlcHMgPSB7aW5kZXhlZERCOiBudWxsLCBJREJLZXlSYW5nZTogbnVsbH07XG59XG5mdW5jdGlvbiBzYWZhcmlNdWx0aVN0b3JlRml4KHN0b3JlTmFtZXMpIHtcbiAgcmV0dXJuIHN0b3JlTmFtZXMubGVuZ3RoID09PSAxID8gc3RvcmVOYW1lc1swXSA6IHN0b3JlTmFtZXM7XG59XG52YXIgZ2V0TWF4S2V5ID0gZnVuY3Rpb24oSWRiS2V5UmFuZ2UpIHtcbiAgdHJ5IHtcbiAgICBJZGJLZXlSYW5nZS5vbmx5KFtbXV0pO1xuICAgIGdldE1heEtleSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtbXV07XG4gICAgfTtcbiAgICByZXR1cm4gW1tdXTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGdldE1heEtleSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG1heFN0cmluZztcbiAgICB9O1xuICAgIHJldHVybiBtYXhTdHJpbmc7XG4gIH1cbn07XG52YXIgQW55UmFuZ2UgPSB7XG4gIHR5cGU6IDMsXG4gIGxvd2VyOiAtSW5maW5pdHksXG4gIGxvd2VyT3BlbjogZmFsc2UsXG4gIGdldCB1cHBlcigpIHtcbiAgICByZXR1cm4gZ2V0TWF4S2V5KGRvbURlcHMuSURCS2V5UmFuZ2UpO1xuICB9LFxuICB1cHBlck9wZW46IGZhbHNlXG59O1xuZnVuY3Rpb24gd29ya2Fyb3VuZEZvclVuZGVmaW5lZFByaW1LZXkoa2V5UGF0aCkge1xuICByZXR1cm4gdHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIgJiYgIS9cXC4vLnRlc3Qoa2V5UGF0aCkgPyBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqW2tleVBhdGhdID09PSB2b2lkIDAgJiYga2V5UGF0aCBpbiBvYmopIHtcbiAgICAgIG9iaiA9IGRlZXBDbG9uZShvYmopO1xuICAgICAgZGVsZXRlIG9ialtrZXlQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfSA6IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmo7XG4gIH07XG59XG52YXIgVGFibGUgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGFibGUyKCkge1xuICB9XG4gIFRhYmxlMi5wcm90b3R5cGUuX3RyYW5zID0gZnVuY3Rpb24obW9kZSwgZm4sIHdyaXRlTG9ja2VkKSB7XG4gICAgdmFyIHRyYW5zID0gdGhpcy5fdHggfHwgUFNELnRyYW5zO1xuICAgIHZhciB0YWJsZU5hbWUgPSB0aGlzLm5hbWU7XG4gICAgZnVuY3Rpb24gY2hlY2tUYWJsZUluVHJhbnNhY3Rpb24ocmVzb2x2ZSwgcmVqZWN0LCB0cmFuczIpIHtcbiAgICAgIGlmICghdHJhbnMyLnNjaGVtYVt0YWJsZU5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5Ob3RGb3VuZChcIlRhYmxlIFwiICsgdGFibGVOYW1lICsgXCIgbm90IHBhcnQgb2YgdHJhbnNhY3Rpb25cIik7XG4gICAgICByZXR1cm4gZm4odHJhbnMyLmlkYnRyYW5zLCB0cmFuczIpO1xuICAgIH1cbiAgICB2YXIgd2FzUm9vdEV4ZWMgPSBiZWdpbk1pY3JvVGlja1Njb3BlKCk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0cmFucyAmJiB0cmFucy5kYiA9PT0gdGhpcy5kYiA/IHRyYW5zID09PSBQU0QudHJhbnMgPyB0cmFucy5fcHJvbWlzZShtb2RlLCBjaGVja1RhYmxlSW5UcmFuc2FjdGlvbiwgd3JpdGVMb2NrZWQpIDogbmV3U2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cmFucy5fcHJvbWlzZShtb2RlLCBjaGVja1RhYmxlSW5UcmFuc2FjdGlvbiwgd3JpdGVMb2NrZWQpO1xuICAgICAgfSwge3RyYW5zLCB0cmFuc2xlc3M6IFBTRC50cmFuc2xlc3MgfHwgUFNEfSkgOiB0ZW1wVHJhbnNhY3Rpb24odGhpcy5kYiwgbW9kZSwgW3RoaXMubmFtZV0sIGNoZWNrVGFibGVJblRyYW5zYWN0aW9uKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKHdhc1Jvb3RFeGVjKVxuICAgICAgICBlbmRNaWNyb1RpY2tTY29wZSgpO1xuICAgIH1cbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXlPckNyaXQsIGNiKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBpZiAoa2V5T3JDcml0ICYmIGtleU9yQ3JpdC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KVxuICAgICAgcmV0dXJuIHRoaXMud2hlcmUoa2V5T3JDcml0KS5maXJzdChjYik7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZG9ubHlcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLmdldCh7dHJhbnMsIGtleToga2V5T3JDcml0fSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmhvb2sucmVhZGluZy5maXJlKHJlcyk7XG4gICAgICB9KTtcbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS53aGVyZSA9IGZ1bmN0aW9uKGluZGV4T3JDcml0KSB7XG4gICAgaWYgKHR5cGVvZiBpbmRleE9yQ3JpdCA9PT0gXCJzdHJpbmdcIilcbiAgICAgIHJldHVybiBuZXcgdGhpcy5kYi5XaGVyZUNsYXVzZSh0aGlzLCBpbmRleE9yQ3JpdCk7XG4gICAgaWYgKGlzQXJyYXkoaW5kZXhPckNyaXQpKVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmRiLldoZXJlQ2xhdXNlKHRoaXMsIFwiW1wiICsgaW5kZXhPckNyaXQuam9pbihcIitcIikgKyBcIl1cIik7XG4gICAgdmFyIGtleVBhdGhzID0ga2V5cyhpbmRleE9yQ3JpdCk7XG4gICAgaWYgKGtleVBhdGhzLmxlbmd0aCA9PT0gMSlcbiAgICAgIHJldHVybiB0aGlzLndoZXJlKGtleVBhdGhzWzBdKS5lcXVhbHMoaW5kZXhPckNyaXRba2V5UGF0aHNbMF1dKTtcbiAgICB2YXIgY29tcG91bmRJbmRleCA9IHRoaXMuc2NoZW1hLmluZGV4ZXMuY29uY2F0KHRoaXMuc2NoZW1hLnByaW1LZXkpLmZpbHRlcihmdW5jdGlvbihpeCkge1xuICAgICAgcmV0dXJuIGl4LmNvbXBvdW5kICYmIGtleVBhdGhzLmV2ZXJ5KGZ1bmN0aW9uKGtleVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGl4LmtleVBhdGguaW5kZXhPZihrZXlQYXRoKSA+PSAwO1xuICAgICAgfSkgJiYgaXgua2V5UGF0aC5ldmVyeShmdW5jdGlvbihrZXlQYXRoKSB7XG4gICAgICAgIHJldHVybiBrZXlQYXRocy5pbmRleE9mKGtleVBhdGgpID49IDA7XG4gICAgICB9KTtcbiAgICB9KVswXTtcbiAgICBpZiAoY29tcG91bmRJbmRleCAmJiB0aGlzLmRiLl9tYXhLZXkgIT09IG1heFN0cmluZylcbiAgICAgIHJldHVybiB0aGlzLndoZXJlKGNvbXBvdW5kSW5kZXgubmFtZSkuZXF1YWxzKGNvbXBvdW5kSW5kZXgua2V5UGF0aC5tYXAoZnVuY3Rpb24oa3ApIHtcbiAgICAgICAgcmV0dXJuIGluZGV4T3JDcml0W2twXTtcbiAgICAgIH0pKTtcbiAgICBpZiAoIWNvbXBvdW5kSW5kZXggJiYgZGVidWcpXG4gICAgICBjb25zb2xlLndhcm4oXCJUaGUgcXVlcnkgXCIgKyBKU09OLnN0cmluZ2lmeShpbmRleE9yQ3JpdCkgKyBcIiBvbiBcIiArIHRoaXMubmFtZSArIFwiIHdvdWxkIGJlbmVmaXQgb2YgYSBcIiArIChcImNvbXBvdW5kIGluZGV4IFtcIiArIGtleVBhdGhzLmpvaW4oXCIrXCIpICsgXCJdXCIpKTtcbiAgICB2YXIgaWR4QnlOYW1lID0gdGhpcy5zY2hlbWEuaWR4QnlOYW1lO1xuICAgIHZhciBpZGIgPSB0aGlzLmRiLl9kZXBzLmluZGV4ZWREQjtcbiAgICBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGlkYi5jbXAoYSwgYikgPT09IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIF9hMiA9IGtleVBhdGhzLnJlZHVjZShmdW5jdGlvbihfYTMsIGtleVBhdGgpIHtcbiAgICAgIHZhciBwcmV2SW5kZXggPSBfYTNbMF0sIHByZXZGaWx0ZXJGbiA9IF9hM1sxXTtcbiAgICAgIHZhciBpbmRleCA9IGlkeEJ5TmFtZVtrZXlQYXRoXTtcbiAgICAgIHZhciB2YWx1ZSA9IGluZGV4T3JDcml0W2tleVBhdGhdO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgcHJldkluZGV4IHx8IGluZGV4LFxuICAgICAgICBwcmV2SW5kZXggfHwgIWluZGV4ID8gY29tYmluZShwcmV2RmlsdGVyRm4sIGluZGV4ICYmIGluZGV4Lm11bHRpID8gZnVuY3Rpb24oeCkge1xuICAgICAgICAgIHZhciBwcm9wID0gZ2V0QnlLZXlQYXRoKHgsIGtleVBhdGgpO1xuICAgICAgICAgIHJldHVybiBpc0FycmF5KHByb3ApICYmIHByb3Auc29tZShmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZXF1YWxzKHZhbHVlLCBpdGVtKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSA6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICByZXR1cm4gZXF1YWxzKHZhbHVlLCBnZXRCeUtleVBhdGgoeCwga2V5UGF0aCkpO1xuICAgICAgICB9KSA6IHByZXZGaWx0ZXJGblxuICAgICAgXTtcbiAgICB9LCBbbnVsbCwgbnVsbF0pLCBpZHggPSBfYTJbMF0sIGZpbHRlckZ1bmN0aW9uID0gX2EyWzFdO1xuICAgIHJldHVybiBpZHggPyB0aGlzLndoZXJlKGlkeC5uYW1lKS5lcXVhbHMoaW5kZXhPckNyaXRbaWR4LmtleVBhdGhdKS5maWx0ZXIoZmlsdGVyRnVuY3Rpb24pIDogY29tcG91bmRJbmRleCA/IHRoaXMuZmlsdGVyKGZpbHRlckZ1bmN0aW9uKSA6IHRoaXMud2hlcmUoa2V5UGF0aHMpLmVxdWFscyhcIlwiKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXJGdW5jdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLmFuZChmaWx0ZXJGdW5jdGlvbik7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbih0aGVuU2hvcnRjdXQpIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS5jb3VudCh0aGVuU2hvcnRjdXQpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLm9mZnNldChvZmZzZXQpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmxpbWl0ID0gZnVuY3Rpb24obnVtUm93cykge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLmxpbWl0KG51bVJvd3MpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLmVhY2goY2FsbGJhY2spO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbih0aGVuU2hvcnRjdXQpIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS50b0FycmF5KHRoZW5TaG9ydGN1dCk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUudG9Db2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmRiLkNvbGxlY3Rpb24obmV3IHRoaXMuZGIuV2hlcmVDbGF1c2UodGhpcykpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLm9yZGVyQnkgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5kYi5Db2xsZWN0aW9uKG5ldyB0aGlzLmRiLldoZXJlQ2xhdXNlKHRoaXMsIGlzQXJyYXkoaW5kZXgpID8gXCJbXCIgKyBpbmRleC5qb2luKFwiK1wiKSArIFwiXVwiIDogaW5kZXgpKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkucmV2ZXJzZSgpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLm1hcFRvQ2xhc3MgPSBmdW5jdGlvbihjb25zdHJ1Y3Rvcikge1xuICAgIHRoaXMuc2NoZW1hLm1hcHBlZENsYXNzID0gY29uc3RydWN0b3I7XG4gICAgdmFyIHJlYWRIb29rID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAoIW9iailcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIHZhciByZXMgPSBPYmplY3QuY3JlYXRlKGNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgICBmb3IgKHZhciBtIGluIG9iailcbiAgICAgICAgaWYgKGhhc093bihvYmosIG0pKVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNbbV0gPSBvYmpbbV07XG4gICAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgICBpZiAodGhpcy5zY2hlbWEucmVhZEhvb2spIHtcbiAgICAgIHRoaXMuaG9vay5yZWFkaW5nLnVuc3Vic2NyaWJlKHRoaXMuc2NoZW1hLnJlYWRIb29rKTtcbiAgICB9XG4gICAgdGhpcy5zY2hlbWEucmVhZEhvb2sgPSByZWFkSG9vaztcbiAgICB0aGlzLmhvb2soXCJyZWFkaW5nXCIsIHJlYWRIb29rKTtcbiAgICByZXR1cm4gY29uc3RydWN0b3I7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuZGVmaW5lQ2xhc3MgPSBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBDbGFzcyhjb250ZW50KSB7XG4gICAgICBleHRlbmQodGhpcywgY29udGVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1hcFRvQ2xhc3MoQ2xhc3MpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgX2EyID0gdGhpcy5zY2hlbWEucHJpbUtleSwgYXV0byA9IF9hMi5hdXRvLCBrZXlQYXRoID0gX2EyLmtleVBhdGg7XG4gICAgdmFyIG9ialRvQWRkID0gb2JqO1xuICAgIGlmIChrZXlQYXRoICYmIGF1dG8pIHtcbiAgICAgIG9ialRvQWRkID0gd29ya2Fyb3VuZEZvclVuZGVmaW5lZFByaW1LZXkoa2V5UGF0aCkob2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImFkZFwiLCBrZXlzOiBrZXkgIT0gbnVsbCA/IFtrZXldIDogbnVsbCwgdmFsdWVzOiBbb2JqVG9BZGRdfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIHJldHVybiByZXMubnVtRmFpbHVyZXMgPyBEZXhpZVByb21pc2UucmVqZWN0KHJlcy5mYWlsdXJlc1swXSkgOiByZXMubGFzdFJlc3VsdDtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGxhc3RSZXN1bHQpIHtcbiAgICAgIGlmIChrZXlQYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCwgbGFzdFJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oa2V5T3JPYmplY3QsIG1vZGlmaWNhdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIGtleU9yT2JqZWN0ID09PSBcIm9iamVjdFwiICYmICFpc0FycmF5KGtleU9yT2JqZWN0KSkge1xuICAgICAgdmFyIGtleSA9IGdldEJ5S2V5UGF0aChrZXlPck9iamVjdCwgdGhpcy5zY2hlbWEucHJpbUtleS5rZXlQYXRoKTtcbiAgICAgIGlmIChrZXkgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuIHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJHaXZlbiBvYmplY3QgZG9lcyBub3QgY29udGFpbiBpdHMgcHJpbWFyeSBrZXlcIikpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb2RpZmljYXRpb25zICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBrZXlzKG1vZGlmaWNhdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgICAgICAgc2V0QnlLZXlQYXRoKGtleU9yT2JqZWN0LCBrZXlQYXRoLCBtb2RpZmljYXRpb25zW2tleVBhdGhdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb2RpZmljYXRpb25zKGtleU9yT2JqZWN0LCB7dmFsdWU6IGtleU9yT2JqZWN0LCBwcmltS2V5OiBrZXl9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoX2EyKSB7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy53aGVyZShcIjppZFwiKS5lcXVhbHMoa2V5KS5tb2RpZnkobW9kaWZpY2F0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLndoZXJlKFwiOmlkXCIpLmVxdWFscyhrZXlPck9iamVjdCkubW9kaWZ5KG1vZGlmaWNhdGlvbnMpO1xuICAgIH1cbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIF9hMiA9IHRoaXMuc2NoZW1hLnByaW1LZXksIGF1dG8gPSBfYTIuYXV0bywga2V5UGF0aCA9IF9hMi5rZXlQYXRoO1xuICAgIHZhciBvYmpUb0FkZCA9IG9iajtcbiAgICBpZiAoa2V5UGF0aCAmJiBhdXRvKSB7XG4gICAgICBvYmpUb0FkZCA9IHdvcmthcm91bmRGb3JVbmRlZmluZWRQcmltS2V5KGtleVBhdGgpKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJwdXRcIiwgdmFsdWVzOiBbb2JqVG9BZGRdLCBrZXlzOiBrZXkgIT0gbnVsbCA/IFtrZXldIDogbnVsbH0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICByZXR1cm4gcmVzLm51bUZhaWx1cmVzID8gRGV4aWVQcm9taXNlLnJlamVjdChyZXMuZmFpbHVyZXNbMF0pIDogcmVzLmxhc3RSZXN1bHQ7XG4gICAgfSkudGhlbihmdW5jdGlvbihsYXN0UmVzdWx0KSB7XG4gICAgICBpZiAoa2V5UGF0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNldEJ5S2V5UGF0aChvYmosIGtleVBhdGgsIGxhc3RSZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImRlbGV0ZVwiLCBrZXlzOiBba2V5XX0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICByZXR1cm4gcmVzLm51bUZhaWx1cmVzID8gRGV4aWVQcm9taXNlLnJlamVjdChyZXMuZmFpbHVyZXNbMF0pIDogdm9pZCAwO1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiZGVsZXRlUmFuZ2VcIiwgcmFuZ2U6IEFueVJhbmdlfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIHJldHVybiByZXMubnVtRmFpbHVyZXMgPyBEZXhpZVByb21pc2UucmVqZWN0KHJlcy5mYWlsdXJlc1swXSkgOiB2b2lkIDA7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuYnVsa0dldCA9IGZ1bmN0aW9uKGtleXMyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkb25seVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUuZ2V0TWFueSh7XG4gICAgICAgIGtleXM6IGtleXMyLFxuICAgICAgICB0cmFuc1xuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5tYXAoZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmhvb2sucmVhZGluZy5maXJlKHJlcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuYnVsa0FkZCA9IGZ1bmN0aW9uKG9iamVjdHMsIGtleXNPck9wdGlvbnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBrZXlzMiA9IEFycmF5LmlzQXJyYXkoa2V5c09yT3B0aW9ucykgPyBrZXlzT3JPcHRpb25zIDogdm9pZCAwO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IChrZXlzMiA/IHZvaWQgMCA6IGtleXNPck9wdGlvbnMpO1xuICAgIHZhciB3YW50UmVzdWx0cyA9IG9wdGlvbnMgPyBvcHRpb25zLmFsbEtleXMgOiB2b2lkIDA7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICB2YXIgX2EyID0gX3RoaXMuc2NoZW1hLnByaW1LZXksIGF1dG8gPSBfYTIuYXV0bywga2V5UGF0aCA9IF9hMi5rZXlQYXRoO1xuICAgICAgaWYgKGtleVBhdGggJiYga2V5czIpXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcImJ1bGtBZGQoKToga2V5cyBhcmd1bWVudCBpbnZhbGlkIG9uIHRhYmxlcyB3aXRoIGluYm91bmQga2V5c1wiKTtcbiAgICAgIGlmIChrZXlzMiAmJiBrZXlzMi5sZW5ndGggIT09IG9iamVjdHMubGVuZ3RoKVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJBcmd1bWVudHMgb2JqZWN0cyBhbmQga2V5cyBtdXN0IGhhdmUgdGhlIHNhbWUgbGVuZ3RoXCIpO1xuICAgICAgdmFyIG51bU9iamVjdHMgPSBvYmplY3RzLmxlbmd0aDtcbiAgICAgIHZhciBvYmplY3RzVG9BZGQgPSBrZXlQYXRoICYmIGF1dG8gPyBvYmplY3RzLm1hcCh3b3JrYXJvdW5kRm9yVW5kZWZpbmVkUHJpbUtleShrZXlQYXRoKSkgOiBvYmplY3RzO1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJhZGRcIiwga2V5czoga2V5czIsIHZhbHVlczogb2JqZWN0c1RvQWRkLCB3YW50UmVzdWx0c30pLnRoZW4oZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgIHZhciBudW1GYWlsdXJlcyA9IF9hMy5udW1GYWlsdXJlcywgcmVzdWx0cyA9IF9hMy5yZXN1bHRzLCBsYXN0UmVzdWx0ID0gX2EzLmxhc3RSZXN1bHQsIGZhaWx1cmVzID0gX2EzLmZhaWx1cmVzO1xuICAgICAgICB2YXIgcmVzdWx0ID0gd2FudFJlc3VsdHMgPyByZXN1bHRzIDogbGFzdFJlc3VsdDtcbiAgICAgICAgaWYgKG51bUZhaWx1cmVzID09PSAwKVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIHRocm93IG5ldyBCdWxrRXJyb3IoX3RoaXMubmFtZSArIFwiLmJ1bGtBZGQoKTogXCIgKyBudW1GYWlsdXJlcyArIFwiIG9mIFwiICsgbnVtT2JqZWN0cyArIFwiIG9wZXJhdGlvbnMgZmFpbGVkXCIsIGZhaWx1cmVzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmJ1bGtQdXQgPSBmdW5jdGlvbihvYmplY3RzLCBrZXlzT3JPcHRpb25zLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIga2V5czIgPSBBcnJheS5pc0FycmF5KGtleXNPck9wdGlvbnMpID8ga2V5c09yT3B0aW9ucyA6IHZvaWQgMDtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCAoa2V5czIgPyB2b2lkIDAgOiBrZXlzT3JPcHRpb25zKTtcbiAgICB2YXIgd2FudFJlc3VsdHMgPSBvcHRpb25zID8gb3B0aW9ucy5hbGxLZXlzIDogdm9pZCAwO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgdmFyIF9hMiA9IF90aGlzLnNjaGVtYS5wcmltS2V5LCBhdXRvID0gX2EyLmF1dG8sIGtleVBhdGggPSBfYTIua2V5UGF0aDtcbiAgICAgIGlmIChrZXlQYXRoICYmIGtleXMyKVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJidWxrUHV0KCk6IGtleXMgYXJndW1lbnQgaW52YWxpZCBvbiB0YWJsZXMgd2l0aCBpbmJvdW5kIGtleXNcIik7XG4gICAgICBpZiAoa2V5czIgJiYga2V5czIubGVuZ3RoICE9PSBvYmplY3RzLmxlbmd0aClcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiQXJndW1lbnRzIG9iamVjdHMgYW5kIGtleXMgbXVzdCBoYXZlIHRoZSBzYW1lIGxlbmd0aFwiKTtcbiAgICAgIHZhciBudW1PYmplY3RzID0gb2JqZWN0cy5sZW5ndGg7XG4gICAgICB2YXIgb2JqZWN0c1RvUHV0ID0ga2V5UGF0aCAmJiBhdXRvID8gb2JqZWN0cy5tYXAod29ya2Fyb3VuZEZvclVuZGVmaW5lZFByaW1LZXkoa2V5UGF0aCkpIDogb2JqZWN0cztcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwicHV0XCIsIGtleXM6IGtleXMyLCB2YWx1ZXM6IG9iamVjdHNUb1B1dCwgd2FudFJlc3VsdHN9KS50aGVuKGZ1bmN0aW9uKF9hMykge1xuICAgICAgICB2YXIgbnVtRmFpbHVyZXMgPSBfYTMubnVtRmFpbHVyZXMsIHJlc3VsdHMgPSBfYTMucmVzdWx0cywgbGFzdFJlc3VsdCA9IF9hMy5sYXN0UmVzdWx0LCBmYWlsdXJlcyA9IF9hMy5mYWlsdXJlcztcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdhbnRSZXN1bHRzID8gcmVzdWx0cyA6IGxhc3RSZXN1bHQ7XG4gICAgICAgIGlmIChudW1GYWlsdXJlcyA9PT0gMClcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB0aHJvdyBuZXcgQnVsa0Vycm9yKF90aGlzLm5hbWUgKyBcIi5idWxrUHV0KCk6IFwiICsgbnVtRmFpbHVyZXMgKyBcIiBvZiBcIiArIG51bU9iamVjdHMgKyBcIiBvcGVyYXRpb25zIGZhaWxlZFwiLCBmYWlsdXJlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5idWxrRGVsZXRlID0gZnVuY3Rpb24oa2V5czIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBudW1LZXlzID0ga2V5czIubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJkZWxldGVcIiwga2V5czoga2V5czJ9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKF9hMikge1xuICAgICAgdmFyIG51bUZhaWx1cmVzID0gX2EyLm51bUZhaWx1cmVzLCBsYXN0UmVzdWx0ID0gX2EyLmxhc3RSZXN1bHQsIGZhaWx1cmVzID0gX2EyLmZhaWx1cmVzO1xuICAgICAgaWYgKG51bUZhaWx1cmVzID09PSAwKVxuICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgICAgIHRocm93IG5ldyBCdWxrRXJyb3IoX3RoaXMubmFtZSArIFwiLmJ1bGtEZWxldGUoKTogXCIgKyBudW1GYWlsdXJlcyArIFwiIG9mIFwiICsgbnVtS2V5cyArIFwiIG9wZXJhdGlvbnMgZmFpbGVkXCIsIGZhaWx1cmVzKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIFRhYmxlMjtcbn0oKTtcbmZ1bmN0aW9uIEV2ZW50cyhjdHgpIHtcbiAgdmFyIGV2cyA9IHt9O1xuICB2YXIgcnYgPSBmdW5jdGlvbihldmVudE5hbWUsIHN1YnNjcmliZXIpIHtcbiAgICBpZiAoc3Vic2NyaWJlcikge1xuICAgICAgdmFyIGkyID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShpMiAtIDEpO1xuICAgICAgd2hpbGUgKC0taTIpXG4gICAgICAgIGFyZ3NbaTIgLSAxXSA9IGFyZ3VtZW50c1tpMl07XG4gICAgICBldnNbZXZlbnROYW1lXS5zdWJzY3JpYmUuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICByZXR1cm4gY3R4O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV2ZW50TmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIGV2c1tldmVudE5hbWVdO1xuICAgIH1cbiAgfTtcbiAgcnYuYWRkRXZlbnRUeXBlID0gYWRkO1xuICBmb3IgKHZhciBpID0gMSwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBhZGQoYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gcnY7XG4gIGZ1bmN0aW9uIGFkZChldmVudE5hbWUsIGNoYWluRnVuY3Rpb24sIGRlZmF1bHRGdW5jdGlvbikge1xuICAgIGlmICh0eXBlb2YgZXZlbnROYW1lID09PSBcIm9iamVjdFwiKVxuICAgICAgcmV0dXJuIGFkZENvbmZpZ3VyZWRFdmVudHMoZXZlbnROYW1lKTtcbiAgICBpZiAoIWNoYWluRnVuY3Rpb24pXG4gICAgICBjaGFpbkZ1bmN0aW9uID0gcmV2ZXJzZVN0b3BwYWJsZUV2ZW50Q2hhaW47XG4gICAgaWYgKCFkZWZhdWx0RnVuY3Rpb24pXG4gICAgICBkZWZhdWx0RnVuY3Rpb24gPSBub3A7XG4gICAgdmFyIGNvbnRleHQgPSB7XG4gICAgICBzdWJzY3JpYmVyczogW10sXG4gICAgICBmaXJlOiBkZWZhdWx0RnVuY3Rpb24sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIGlmIChjb250ZXh0LnN1YnNjcmliZXJzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgICAgIGNvbnRleHQuc3Vic2NyaWJlcnMucHVzaChjYik7XG4gICAgICAgICAgY29udGV4dC5maXJlID0gY2hhaW5GdW5jdGlvbihjb250ZXh0LmZpcmUsIGNiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihjYikge1xuICAgICAgICBjb250ZXh0LnN1YnNjcmliZXJzID0gY29udGV4dC5zdWJzY3JpYmVycy5maWx0ZXIoZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICByZXR1cm4gZm4gIT09IGNiO1xuICAgICAgICB9KTtcbiAgICAgICAgY29udGV4dC5maXJlID0gY29udGV4dC5zdWJzY3JpYmVycy5yZWR1Y2UoY2hhaW5GdW5jdGlvbiwgZGVmYXVsdEZ1bmN0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGV2c1tldmVudE5hbWVdID0gcnZbZXZlbnROYW1lXSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbiAgZnVuY3Rpb24gYWRkQ29uZmlndXJlZEV2ZW50cyhjZmcpIHtcbiAgICBrZXlzKGNmZykuZm9yRWFjaChmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgIHZhciBhcmdzID0gY2ZnW2V2ZW50TmFtZV07XG4gICAgICBpZiAoaXNBcnJheShhcmdzKSkge1xuICAgICAgICBhZGQoZXZlbnROYW1lLCBjZmdbZXZlbnROYW1lXVswXSwgY2ZnW2V2ZW50TmFtZV1bMV0pO1xuICAgICAgfSBlbHNlIGlmIChhcmdzID09PSBcImFzYXBcIikge1xuICAgICAgICB2YXIgY29udGV4dCA9IGFkZChldmVudE5hbWUsIG1pcnJvciwgZnVuY3Rpb24gZmlyZSgpIHtcbiAgICAgICAgICB2YXIgaTIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzMiA9IG5ldyBBcnJheShpMik7XG4gICAgICAgICAgd2hpbGUgKGkyLS0pXG4gICAgICAgICAgICBhcmdzMltpMl0gPSBhcmd1bWVudHNbaTJdO1xuICAgICAgICAgIGNvbnRleHQuc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgYXNhcCQxKGZ1bmN0aW9uIGZpcmVFdmVudCgpIHtcbiAgICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJnczIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIkludmFsaWQgZXZlbnQgY29uZmlnXCIpO1xuICAgIH0pO1xuICB9XG59XG5mdW5jdGlvbiBtYWtlQ2xhc3NDb25zdHJ1Y3Rvcihwcm90b3R5cGUsIGNvbnN0cnVjdG9yKSB7XG4gIGRlcml2ZShjb25zdHJ1Y3RvcikuZnJvbSh7cHJvdG90eXBlfSk7XG4gIHJldHVybiBjb25zdHJ1Y3Rvcjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRhYmxlQ29uc3RydWN0b3IoZGIpIHtcbiAgcmV0dXJuIG1ha2VDbGFzc0NvbnN0cnVjdG9yKFRhYmxlLnByb3RvdHlwZSwgZnVuY3Rpb24gVGFibGUyKG5hbWUsIHRhYmxlU2NoZW1hLCB0cmFucykge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB0aGlzLl90eCA9IHRyYW5zO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zY2hlbWEgPSB0YWJsZVNjaGVtYTtcbiAgICB0aGlzLmhvb2sgPSBkYi5fYWxsVGFibGVzW25hbWVdID8gZGIuX2FsbFRhYmxlc1tuYW1lXS5ob29rIDogRXZlbnRzKG51bGwsIHtcbiAgICAgIGNyZWF0aW5nOiBbaG9va0NyZWF0aW5nQ2hhaW4sIG5vcF0sXG4gICAgICByZWFkaW5nOiBbcHVyZUZ1bmN0aW9uQ2hhaW4sIG1pcnJvcl0sXG4gICAgICB1cGRhdGluZzogW2hvb2tVcGRhdGluZ0NoYWluLCBub3BdLFxuICAgICAgZGVsZXRpbmc6IFtob29rRGVsZXRpbmdDaGFpbiwgbm9wXVxuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlzUGxhaW5LZXlSYW5nZShjdHgsIGlnbm9yZUxpbWl0RmlsdGVyKSB7XG4gIHJldHVybiAhKGN0eC5maWx0ZXIgfHwgY3R4LmFsZ29yaXRobSB8fCBjdHgub3IpICYmIChpZ25vcmVMaW1pdEZpbHRlciA/IGN0eC5qdXN0TGltaXQgOiAhY3R4LnJlcGxheUZpbHRlcik7XG59XG5mdW5jdGlvbiBhZGRGaWx0ZXIoY3R4LCBmbikge1xuICBjdHguZmlsdGVyID0gY29tYmluZShjdHguZmlsdGVyLCBmbik7XG59XG5mdW5jdGlvbiBhZGRSZXBsYXlGaWx0ZXIoY3R4LCBmYWN0b3J5LCBpc0xpbWl0RmlsdGVyKSB7XG4gIHZhciBjdXJyID0gY3R4LnJlcGxheUZpbHRlcjtcbiAgY3R4LnJlcGxheUZpbHRlciA9IGN1cnIgPyBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29tYmluZShjdXJyKCksIGZhY3RvcnkoKSk7XG4gIH0gOiBmYWN0b3J5O1xuICBjdHguanVzdExpbWl0ID0gaXNMaW1pdEZpbHRlciAmJiAhY3Vycjtcbn1cbmZ1bmN0aW9uIGFkZE1hdGNoRmlsdGVyKGN0eCwgZm4pIHtcbiAgY3R4LmlzTWF0Y2ggPSBjb21iaW5lKGN0eC5pc01hdGNoLCBmbik7XG59XG5mdW5jdGlvbiBnZXRJbmRleE9yU3RvcmUoY3R4LCBjb3JlU2NoZW1hKSB7XG4gIGlmIChjdHguaXNQcmltS2V5KVxuICAgIHJldHVybiBjb3JlU2NoZW1hLnByaW1hcnlLZXk7XG4gIHZhciBpbmRleCA9IGNvcmVTY2hlbWEuZ2V0SW5kZXhCeUtleVBhdGgoY3R4LmluZGV4KTtcbiAgaWYgKCFpbmRleClcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TY2hlbWEoXCJLZXlQYXRoIFwiICsgY3R4LmluZGV4ICsgXCIgb24gb2JqZWN0IHN0b3JlIFwiICsgY29yZVNjaGVtYS5uYW1lICsgXCIgaXMgbm90IGluZGV4ZWRcIik7XG4gIHJldHVybiBpbmRleDtcbn1cbmZ1bmN0aW9uIG9wZW5DdXJzb3IoY3R4LCBjb3JlVGFibGUsIHRyYW5zKSB7XG4gIHZhciBpbmRleCA9IGdldEluZGV4T3JTdG9yZShjdHgsIGNvcmVUYWJsZS5zY2hlbWEpO1xuICByZXR1cm4gY29yZVRhYmxlLm9wZW5DdXJzb3Ioe1xuICAgIHRyYW5zLFxuICAgIHZhbHVlczogIWN0eC5rZXlzT25seSxcbiAgICByZXZlcnNlOiBjdHguZGlyID09PSBcInByZXZcIixcbiAgICB1bmlxdWU6ICEhY3R4LnVuaXF1ZSxcbiAgICBxdWVyeToge1xuICAgICAgaW5kZXgsXG4gICAgICByYW5nZTogY3R4LnJhbmdlXG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGl0ZXIoY3R4LCBmbiwgY29yZVRyYW5zLCBjb3JlVGFibGUpIHtcbiAgdmFyIGZpbHRlciA9IGN0eC5yZXBsYXlGaWx0ZXIgPyBjb21iaW5lKGN0eC5maWx0ZXIsIGN0eC5yZXBsYXlGaWx0ZXIoKSkgOiBjdHguZmlsdGVyO1xuICBpZiAoIWN0eC5vcikge1xuICAgIHJldHVybiBpdGVyYXRlKG9wZW5DdXJzb3IoY3R4LCBjb3JlVGFibGUsIGNvcmVUcmFucyksIGNvbWJpbmUoY3R4LmFsZ29yaXRobSwgZmlsdGVyKSwgZm4sICFjdHgua2V5c09ubHkgJiYgY3R4LnZhbHVlTWFwcGVyKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2V0XzEgPSB7fTtcbiAgICB2YXIgdW5pb24gPSBmdW5jdGlvbihpdGVtLCBjdXJzb3IsIGFkdmFuY2UpIHtcbiAgICAgIGlmICghZmlsdGVyIHx8IGZpbHRlcihjdXJzb3IsIGFkdmFuY2UsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gY3Vyc29yLnN0b3AocmVzdWx0KTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICByZXR1cm4gY3Vyc29yLmZhaWwoZXJyKTtcbiAgICAgIH0pKSB7XG4gICAgICAgIHZhciBwcmltYXJ5S2V5ID0gY3Vyc29yLnByaW1hcnlLZXk7XG4gICAgICAgIHZhciBrZXkgPSBcIlwiICsgcHJpbWFyeUtleTtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiKVxuICAgICAgICAgIGtleSA9IFwiXCIgKyBuZXcgVWludDhBcnJheShwcmltYXJ5S2V5KTtcbiAgICAgICAgaWYgKCFoYXNPd24oc2V0XzEsIGtleSkpIHtcbiAgICAgICAgICBzZXRfMVtrZXldID0gdHJ1ZTtcbiAgICAgICAgICBmbihpdGVtLCBjdXJzb3IsIGFkdmFuY2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgY3R4Lm9yLl9pdGVyYXRlKHVuaW9uLCBjb3JlVHJhbnMpLFxuICAgICAgaXRlcmF0ZShvcGVuQ3Vyc29yKGN0eCwgY29yZVRhYmxlLCBjb3JlVHJhbnMpLCBjdHguYWxnb3JpdGhtLCB1bmlvbiwgIWN0eC5rZXlzT25seSAmJiBjdHgudmFsdWVNYXBwZXIpXG4gICAgXSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGl0ZXJhdGUoY3Vyc29yUHJvbWlzZSwgZmlsdGVyLCBmbiwgdmFsdWVNYXBwZXIpIHtcbiAgdmFyIG1hcHBlZEZuID0gdmFsdWVNYXBwZXIgPyBmdW5jdGlvbih4LCBjLCBhKSB7XG4gICAgcmV0dXJuIGZuKHZhbHVlTWFwcGVyKHgpLCBjLCBhKTtcbiAgfSA6IGZuO1xuICB2YXIgd3JhcHBlZEZuID0gd3JhcChtYXBwZWRGbik7XG4gIHJldHVybiBjdXJzb3JQcm9taXNlLnRoZW4oZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgaWYgKGN1cnNvcikge1xuICAgICAgcmV0dXJuIGN1cnNvci5zdGFydChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghZmlsdGVyIHx8IGZpbHRlcihjdXJzb3IsIGZ1bmN0aW9uKGFkdmFuY2VyKSB7XG4gICAgICAgICAgcmV0dXJuIGMgPSBhZHZhbmNlcjtcbiAgICAgICAgfSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgY3Vyc29yLnN0b3AodmFsKTtcbiAgICAgICAgICBjID0gbm9wO1xuICAgICAgICB9LCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgY3Vyc29yLmZhaWwoZSk7XG4gICAgICAgICAgYyA9IG5vcDtcbiAgICAgICAgfSkpXG4gICAgICAgICAgd3JhcHBlZEZuKGN1cnNvci52YWx1ZSwgY3Vyc29yLCBmdW5jdGlvbihhZHZhbmNlcikge1xuICAgICAgICAgICAgcmV0dXJuIGMgPSBhZHZhbmNlcjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgYygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbnZhciBDb2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIENvbGxlY3Rpb24yKCkge1xuICB9XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uKGZuLCBjYikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgcmV0dXJuIGN0eC5lcnJvciA/IGN0eC50YWJsZS5fdHJhbnMobnVsbCwgcmVqZWN0aW9uLmJpbmQobnVsbCwgY3R4LmVycm9yKSkgOiBjdHgudGFibGUuX3RyYW5zKFwicmVhZG9ubHlcIiwgZm4pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIHJldHVybiBjdHguZXJyb3IgPyBjdHgudGFibGUuX3RyYW5zKG51bGwsIHJlamVjdGlvbi5iaW5kKG51bGwsIGN0eC5lcnJvcikpIDogY3R4LnRhYmxlLl90cmFucyhcInJlYWR3cml0ZVwiLCBmbiwgXCJsb2NrZWRcIik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5fYWRkQWxnb3JpdGhtID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIGN0eC5hbGdvcml0aG0gPSBjb21iaW5lKGN0eC5hbGdvcml0aG0sIGZuKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLl9pdGVyYXRlID0gZnVuY3Rpb24oZm4sIGNvcmVUcmFucykge1xuICAgIHJldHVybiBpdGVyKHRoaXMuX2N0eCwgZm4sIGNvcmVUcmFucywgdGhpcy5fY3R4LnRhYmxlLmNvcmUpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbihwcm9wczIpIHtcbiAgICB2YXIgcnYgPSBPYmplY3QuY3JlYXRlKHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlKSwgY3R4ID0gT2JqZWN0LmNyZWF0ZSh0aGlzLl9jdHgpO1xuICAgIGlmIChwcm9wczIpXG4gICAgICBleHRlbmQoY3R4LCBwcm9wczIpO1xuICAgIHJ2Ll9jdHggPSBjdHg7XG4gICAgcmV0dXJuIHJ2O1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUucmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fY3R4LnZhbHVlTWFwcGVyID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWQoZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBpdGVyKGN0eCwgZm4sIHRyYW5zLCBjdHgudGFibGUuY29yZSk7XG4gICAgfSk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fcmVhZChmdW5jdGlvbih0cmFucykge1xuICAgICAgdmFyIGN0eCA9IF90aGlzLl9jdHg7XG4gICAgICB2YXIgY29yZVRhYmxlID0gY3R4LnRhYmxlLmNvcmU7XG4gICAgICBpZiAoaXNQbGFpbktleVJhbmdlKGN0eCwgdHJ1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGNvcmVUYWJsZS5jb3VudCh7XG4gICAgICAgICAgdHJhbnMsXG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIGluZGV4OiBnZXRJbmRleE9yU3RvcmUoY3R4LCBjb3JlVGFibGUuc2NoZW1hKSxcbiAgICAgICAgICAgIHJhbmdlOiBjdHgucmFuZ2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oY291bnQyKSB7XG4gICAgICAgICAgcmV0dXJuIE1hdGgubWluKGNvdW50MiwgY3R4LmxpbWl0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICByZXR1cm4gaXRlcihjdHgsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICsrY291bnQ7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCB0cmFucywgY29yZVRhYmxlKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbihrZXlQYXRoLCBjYikge1xuICAgIHZhciBwYXJ0cyA9IGtleVBhdGguc3BsaXQoXCIuXCIpLnJldmVyc2UoKSwgbGFzdFBhcnQgPSBwYXJ0c1swXSwgbGFzdEluZGV4ID0gcGFydHMubGVuZ3RoIC0gMTtcbiAgICBmdW5jdGlvbiBnZXR2YWwob2JqLCBpKSB7XG4gICAgICBpZiAoaSlcbiAgICAgICAgcmV0dXJuIGdldHZhbChvYmpbcGFydHNbaV1dLCBpIC0gMSk7XG4gICAgICByZXR1cm4gb2JqW2xhc3RQYXJ0XTtcbiAgICB9XG4gICAgdmFyIG9yZGVyID0gdGhpcy5fY3R4LmRpciA9PT0gXCJuZXh0XCIgPyAxIDogLTE7XG4gICAgZnVuY3Rpb24gc29ydGVyKGEsIGIpIHtcbiAgICAgIHZhciBhVmFsID0gZ2V0dmFsKGEsIGxhc3RJbmRleCksIGJWYWwgPSBnZXR2YWwoYiwgbGFzdEluZGV4KTtcbiAgICAgIHJldHVybiBhVmFsIDwgYlZhbCA/IC1vcmRlciA6IGFWYWwgPiBiVmFsID8gb3JkZXIgOiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b0FycmF5KGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhLnNvcnQoc29ydGVyKTtcbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWQoZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHZhciBjdHggPSBfdGhpcy5fY3R4O1xuICAgICAgaWYgKGN0eC5kaXIgPT09IFwibmV4dFwiICYmIGlzUGxhaW5LZXlSYW5nZShjdHgsIHRydWUpICYmIGN0eC5saW1pdCA+IDApIHtcbiAgICAgICAgdmFyIHZhbHVlTWFwcGVyXzEgPSBjdHgudmFsdWVNYXBwZXI7XG4gICAgICAgIHZhciBpbmRleCA9IGdldEluZGV4T3JTdG9yZShjdHgsIGN0eC50YWJsZS5jb3JlLnNjaGVtYSk7XG4gICAgICAgIHJldHVybiBjdHgudGFibGUuY29yZS5xdWVyeSh7XG4gICAgICAgICAgdHJhbnMsXG4gICAgICAgICAgbGltaXQ6IGN0eC5saW1pdCxcbiAgICAgICAgICB2YWx1ZXM6IHRydWUsXG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcmFuZ2U6IGN0eC5yYW5nZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihfYTIpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gX2EyLnJlc3VsdDtcbiAgICAgICAgICByZXR1cm4gdmFsdWVNYXBwZXJfMSA/IHJlc3VsdC5tYXAodmFsdWVNYXBwZXJfMSkgOiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGFfMSA9IFtdO1xuICAgICAgICByZXR1cm4gaXRlcihjdHgsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gYV8xLnB1c2goaXRlbSk7XG4gICAgICAgIH0sIHRyYW5zLCBjdHgudGFibGUuY29yZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gYV8xO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCBjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIGlmIChvZmZzZXQgPD0gMClcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIGN0eC5vZmZzZXQgKz0gb2Zmc2V0O1xuICAgIGlmIChpc1BsYWluS2V5UmFuZ2UoY3R4KSkge1xuICAgICAgYWRkUmVwbGF5RmlsdGVyKGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gb2Zmc2V0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY3Vyc29yLCBhZHZhbmNlKSB7XG4gICAgICAgICAgaWYgKG9mZnNldExlZnQgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICBpZiAob2Zmc2V0TGVmdCA9PT0gMSkge1xuICAgICAgICAgICAgLS1vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZHZhbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3Vyc29yLmFkdmFuY2Uob2Zmc2V0TGVmdCk7XG4gICAgICAgICAgICBvZmZzZXRMZWZ0ID0gMDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkUmVwbGF5RmlsdGVyKGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gb2Zmc2V0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIC0tb2Zmc2V0TGVmdCA8IDA7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5saW1pdCA9IGZ1bmN0aW9uKG51bVJvd3MpIHtcbiAgICB0aGlzLl9jdHgubGltaXQgPSBNYXRoLm1pbih0aGlzLl9jdHgubGltaXQsIG51bVJvd3MpO1xuICAgIGFkZFJlcGxheUZpbHRlcih0aGlzLl9jdHgsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJvd3NMZWZ0ID0gbnVtUm93cztcbiAgICAgIHJldHVybiBmdW5jdGlvbihjdXJzb3IsIGFkdmFuY2UsIHJlc29sdmUpIHtcbiAgICAgICAgaWYgKC0tcm93c0xlZnQgPD0gMClcbiAgICAgICAgICBhZHZhbmNlKHJlc29sdmUpO1xuICAgICAgICByZXR1cm4gcm93c0xlZnQgPj0gMDtcbiAgICAgIH07XG4gICAgfSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS51bnRpbCA9IGZ1bmN0aW9uKGZpbHRlckZ1bmN0aW9uLCBiSW5jbHVkZVN0b3BFbnRyeSkge1xuICAgIGFkZEZpbHRlcih0aGlzLl9jdHgsIGZ1bmN0aW9uKGN1cnNvciwgYWR2YW5jZSwgcmVzb2x2ZSkge1xuICAgICAgaWYgKGZpbHRlckZ1bmN0aW9uKGN1cnNvci52YWx1ZSkpIHtcbiAgICAgICAgYWR2YW5jZShyZXNvbHZlKTtcbiAgICAgICAgcmV0dXJuIGJJbmNsdWRlU3RvcEVudHJ5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMubGltaXQoMSkudG9BcnJheShmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gYVswXTtcbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbihjYikge1xuICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5maXJzdChjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXJGdW5jdGlvbikge1xuICAgIGFkZEZpbHRlcih0aGlzLl9jdHgsIGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgcmV0dXJuIGZpbHRlckZ1bmN0aW9uKGN1cnNvci52YWx1ZSk7XG4gICAgfSk7XG4gICAgYWRkTWF0Y2hGaWx0ZXIodGhpcy5fY3R4LCBmaWx0ZXJGdW5jdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5hbmQgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoZmlsdGVyKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLm9yID0gZnVuY3Rpb24oaW5kZXhOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmRiLldoZXJlQ2xhdXNlKHRoaXMuX2N0eC50YWJsZSwgaW5kZXhOYW1lLCB0aGlzKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jdHguZGlyID0gdGhpcy5fY3R4LmRpciA9PT0gXCJwcmV2XCIgPyBcIm5leHRcIiA6IFwicHJldlwiO1xuICAgIGlmICh0aGlzLl9vbmRpcmVjdGlvbmNoYW5nZSlcbiAgICAgIHRoaXMuX29uZGlyZWN0aW9uY2hhbmdlKHRoaXMuX2N0eC5kaXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZGVzYyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJldmVyc2UoKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmVhY2hLZXkgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgY3R4LmtleXNPbmx5ID0gIWN0eC5pc01hdGNoO1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24odmFsLCBjdXJzb3IpIHtcbiAgICAgIGNiKGN1cnNvci5rZXksIGN1cnNvcik7XG4gICAgfSk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5lYWNoVW5pcXVlS2V5ID0gZnVuY3Rpb24oY2IpIHtcbiAgICB0aGlzLl9jdHgudW5pcXVlID0gXCJ1bmlxdWVcIjtcbiAgICByZXR1cm4gdGhpcy5lYWNoS2V5KGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmVhY2hQcmltYXJ5S2V5ID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIGN0eC5rZXlzT25seSA9ICFjdHguaXNNYXRjaDtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKHZhbCwgY3Vyc29yKSB7XG4gICAgICBjYihjdXJzb3IucHJpbWFyeUtleSwgY3Vyc29yKTtcbiAgICB9KTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgY3R4LmtleXNPbmx5ID0gIWN0eC5pc01hdGNoO1xuICAgIHZhciBhID0gW107XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtLCBjdXJzb3IpIHtcbiAgICAgIGEucHVzaChjdXJzb3Iua2V5KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5wcmltYXJ5S2V5cyA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICBpZiAoY3R4LmRpciA9PT0gXCJuZXh0XCIgJiYgaXNQbGFpbktleVJhbmdlKGN0eCwgdHJ1ZSkgJiYgY3R4LmxpbWl0ID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlYWQoZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhPclN0b3JlKGN0eCwgY3R4LnRhYmxlLmNvcmUuc2NoZW1hKTtcbiAgICAgICAgcmV0dXJuIGN0eC50YWJsZS5jb3JlLnF1ZXJ5KHtcbiAgICAgICAgICB0cmFucyxcbiAgICAgICAgICB2YWx1ZXM6IGZhbHNlLFxuICAgICAgICAgIGxpbWl0OiBjdHgubGltaXQsXG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcmFuZ2U6IGN0eC5yYW5nZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKF9hMikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gX2EyLnJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pLnRoZW4oY2IpO1xuICAgIH1cbiAgICBjdHgua2V5c09ubHkgPSAhY3R4LmlzTWF0Y2g7XG4gICAgdmFyIGEgPSBbXTtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0sIGN1cnNvcikge1xuICAgICAgYS5wdXNoKGN1cnNvci5wcmltYXJ5S2V5KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS51bmlxdWVLZXlzID0gZnVuY3Rpb24oY2IpIHtcbiAgICB0aGlzLl9jdHgudW5pcXVlID0gXCJ1bmlxdWVcIjtcbiAgICByZXR1cm4gdGhpcy5rZXlzKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmZpcnN0S2V5ID0gZnVuY3Rpb24oY2IpIHtcbiAgICByZXR1cm4gdGhpcy5saW1pdCgxKS5rZXlzKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhWzBdO1xuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUubGFzdEtleSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0S2V5KGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmRpc3RpbmN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eCwgaWR4ID0gY3R4LmluZGV4ICYmIGN0eC50YWJsZS5zY2hlbWEuaWR4QnlOYW1lW2N0eC5pbmRleF07XG4gICAgaWYgKCFpZHggfHwgIWlkeC5tdWx0aSlcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIHZhciBzZXQgPSB7fTtcbiAgICBhZGRGaWx0ZXIodGhpcy5fY3R4LCBmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgIHZhciBzdHJLZXkgPSBjdXJzb3IucHJpbWFyeUtleS50b1N0cmluZygpO1xuICAgICAgdmFyIGZvdW5kID0gaGFzT3duKHNldCwgc3RyS2V5KTtcbiAgICAgIHNldFtzdHJLZXldID0gdHJ1ZTtcbiAgICAgIHJldHVybiAhZm91bmQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5tb2RpZnkgPSBmdW5jdGlvbihjaGFuZ2VzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIHJldHVybiB0aGlzLl93cml0ZShmdW5jdGlvbih0cmFucykge1xuICAgICAgdmFyIG1vZGlmeWVyO1xuICAgICAgaWYgKHR5cGVvZiBjaGFuZ2VzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgbW9kaWZ5ZXIgPSBjaGFuZ2VzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleVBhdGhzID0ga2V5cyhjaGFuZ2VzKTtcbiAgICAgICAgdmFyIG51bUtleXMgPSBrZXlQYXRocy5sZW5ndGg7XG4gICAgICAgIG1vZGlmeWVyID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciBhbnl0aGluZ01vZGlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1LZXlzOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXlQYXRoID0ga2V5UGF0aHNbaV0sIHZhbCA9IGNoYW5nZXNba2V5UGF0aF07XG4gICAgICAgICAgICBpZiAoZ2V0QnlLZXlQYXRoKGl0ZW0sIGtleVBhdGgpICE9PSB2YWwpIHtcbiAgICAgICAgICAgICAgc2V0QnlLZXlQYXRoKGl0ZW0sIGtleVBhdGgsIHZhbCk7XG4gICAgICAgICAgICAgIGFueXRoaW5nTW9kaWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYW55dGhpbmdNb2RpZmllZDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHZhciBjb3JlVGFibGUgPSBjdHgudGFibGUuY29yZTtcbiAgICAgIHZhciBfYTIgPSBjb3JlVGFibGUuc2NoZW1hLnByaW1hcnlLZXksIG91dGJvdW5kID0gX2EyLm91dGJvdW5kLCBleHRyYWN0S2V5ID0gX2EyLmV4dHJhY3RLZXk7XG4gICAgICB2YXIgbGltaXQgPSBfdGhpcy5kYi5fb3B0aW9ucy5tb2RpZnlDaHVua1NpemUgfHwgMjAwO1xuICAgICAgdmFyIGNtcDIgPSBfdGhpcy5kYi5jb3JlLmNtcDtcbiAgICAgIHZhciB0b3RhbEZhaWx1cmVzID0gW107XG4gICAgICB2YXIgc3VjY2Vzc0NvdW50ID0gMDtcbiAgICAgIHZhciBmYWlsZWRLZXlzID0gW107XG4gICAgICB2YXIgYXBwbHlNdXRhdGVSZXN1bHQgPSBmdW5jdGlvbihleHBlY3RlZENvdW50LCByZXMpIHtcbiAgICAgICAgdmFyIGZhaWx1cmVzID0gcmVzLmZhaWx1cmVzLCBudW1GYWlsdXJlcyA9IHJlcy5udW1GYWlsdXJlcztcbiAgICAgICAgc3VjY2Vzc0NvdW50ICs9IGV4cGVjdGVkQ291bnQgLSBudW1GYWlsdXJlcztcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYTMgPSBrZXlzKGZhaWx1cmVzKTsgX2kgPCBfYTMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgdmFyIHBvcyA9IF9hM1tfaV07XG4gICAgICAgICAgdG90YWxGYWlsdXJlcy5wdXNoKGZhaWx1cmVzW3Bvc10pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIF90aGlzLmNsb25lKCkucHJpbWFyeUtleXMoKS50aGVuKGZ1bmN0aW9uKGtleXMyKSB7XG4gICAgICAgIHZhciBuZXh0Q2h1bmsgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgICB2YXIgY291bnQgPSBNYXRoLm1pbihsaW1pdCwga2V5czIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgICAgICAgICByZXR1cm4gY29yZVRhYmxlLmdldE1hbnkoe1xuICAgICAgICAgICAgdHJhbnMsXG4gICAgICAgICAgICBrZXlzOiBrZXlzMi5zbGljZShvZmZzZXQsIG9mZnNldCArIGNvdW50KSxcbiAgICAgICAgICAgIGNhY2hlOiBcImltbXV0YWJsZVwiXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgICAgIHZhciBhZGRWYWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBwdXRWYWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBwdXRLZXlzID0gb3V0Ym91bmQgPyBbXSA6IG51bGw7XG4gICAgICAgICAgICB2YXIgZGVsZXRlS2V5cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgICAgICAgIHZhciBvcmlnVmFsdWUgPSB2YWx1ZXNbaV07XG4gICAgICAgICAgICAgIHZhciBjdHhfMSA9IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGVlcENsb25lKG9yaWdWYWx1ZSksXG4gICAgICAgICAgICAgICAgcHJpbUtleToga2V5czJbb2Zmc2V0ICsgaV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKG1vZGlmeWVyLmNhbGwoY3R4XzEsIGN0eF8xLnZhbHVlLCBjdHhfMSkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eF8xLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZUtleXMucHVzaChrZXlzMltvZmZzZXQgKyBpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb3V0Ym91bmQgJiYgY21wMihleHRyYWN0S2V5KG9yaWdWYWx1ZSksIGV4dHJhY3RLZXkoY3R4XzEudmFsdWUpKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgZGVsZXRlS2V5cy5wdXNoKGtleXMyW29mZnNldCArIGldKTtcbiAgICAgICAgICAgICAgICAgIGFkZFZhbHVlcy5wdXNoKGN0eF8xLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcHV0VmFsdWVzLnB1c2goY3R4XzEudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgaWYgKG91dGJvdW5kKVxuICAgICAgICAgICAgICAgICAgICBwdXRLZXlzLnB1c2goa2V5czJbb2Zmc2V0ICsgaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhZGRWYWx1ZXMubGVuZ3RoID4gMCAmJiBjb3JlVGFibGUubXV0YXRlKHt0cmFucywgdHlwZTogXCJhZGRcIiwgdmFsdWVzOiBhZGRWYWx1ZXN9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBwb3MgaW4gcmVzLmZhaWx1cmVzKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlS2V5cy5zcGxpY2UocGFyc2VJbnQocG9zKSwgMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXBwbHlNdXRhdGVSZXN1bHQoYWRkVmFsdWVzLmxlbmd0aCwgcmVzKTtcbiAgICAgICAgICAgIH0pKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcHV0VmFsdWVzLmxlbmd0aCA+IDAgJiYgY29yZVRhYmxlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwicHV0XCIsIGtleXM6IHB1dEtleXMsIHZhbHVlczogcHV0VmFsdWVzfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGVSZXN1bHQocHV0VmFsdWVzLmxlbmd0aCwgcmVzKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZGVsZXRlS2V5cy5sZW5ndGggPiAwICYmIGNvcmVUYWJsZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImRlbGV0ZVwiLCBrZXlzOiBkZWxldGVLZXlzfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXBwbHlNdXRhdGVSZXN1bHQoZGVsZXRlS2V5cy5sZW5ndGgsIHJlcyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGtleXMyLmxlbmd0aCA+IG9mZnNldCArIGNvdW50ICYmIG5leHRDaHVuayhvZmZzZXQgKyBsaW1pdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5leHRDaHVuaygwKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh0b3RhbEZhaWx1cmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgTW9kaWZ5RXJyb3IoXCJFcnJvciBtb2RpZnlpbmcgb25lIG9yIG1vcmUgb2JqZWN0c1wiLCB0b3RhbEZhaWx1cmVzLCBzdWNjZXNzQ291bnQsIGZhaWxlZEtleXMpO1xuICAgICAgICAgIHJldHVybiBrZXlzMi5sZW5ndGg7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4LCByYW5nZSA9IGN0eC5yYW5nZTtcbiAgICBpZiAoaXNQbGFpbktleVJhbmdlKGN0eCkgJiYgKGN0eC5pc1ByaW1LZXkgJiYgIWhhbmdzT25EZWxldGVMYXJnZUtleVJhbmdlIHx8IHJhbmdlLnR5cGUgPT09IDMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JpdGUoZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgICAgdmFyIHByaW1hcnlLZXkgPSBjdHgudGFibGUuY29yZS5zY2hlbWEucHJpbWFyeUtleTtcbiAgICAgICAgdmFyIGNvcmVSYW5nZSA9IHJhbmdlO1xuICAgICAgICByZXR1cm4gY3R4LnRhYmxlLmNvcmUuY291bnQoe3RyYW5zLCBxdWVyeToge2luZGV4OiBwcmltYXJ5S2V5LCByYW5nZTogY29yZVJhbmdlfX0pLnRoZW4oZnVuY3Rpb24oY291bnQpIHtcbiAgICAgICAgICByZXR1cm4gY3R4LnRhYmxlLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJkZWxldGVSYW5nZVwiLCByYW5nZTogY29yZVJhbmdlfSkudGhlbihmdW5jdGlvbihfYTIpIHtcbiAgICAgICAgICAgIHZhciBmYWlsdXJlcyA9IF9hMi5mYWlsdXJlcztcbiAgICAgICAgICAgIF9hMi5sYXN0UmVzdWx0O1xuICAgICAgICAgICAgX2EyLnJlc3VsdHM7XG4gICAgICAgICAgICB2YXIgbnVtRmFpbHVyZXMgPSBfYTIubnVtRmFpbHVyZXM7XG4gICAgICAgICAgICBpZiAobnVtRmFpbHVyZXMpXG4gICAgICAgICAgICAgIHRocm93IG5ldyBNb2RpZnlFcnJvcihcIkNvdWxkIG5vdCBkZWxldGUgc29tZSB2YWx1ZXNcIiwgT2JqZWN0LmtleXMoZmFpbHVyZXMpLm1hcChmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFpbHVyZXNbcG9zXTtcbiAgICAgICAgICAgICAgfSksIGNvdW50IC0gbnVtRmFpbHVyZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGNvdW50IC0gbnVtRmFpbHVyZXM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1vZGlmeShmdW5jdGlvbih2YWx1ZSwgY3R4Mikge1xuICAgICAgcmV0dXJuIGN0eDIudmFsdWUgPSBudWxsO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gQ29sbGVjdGlvbjI7XG59KCk7XG5mdW5jdGlvbiBjcmVhdGVDb2xsZWN0aW9uQ29uc3RydWN0b3IoZGIpIHtcbiAgcmV0dXJuIG1ha2VDbGFzc0NvbnN0cnVjdG9yKENvbGxlY3Rpb24ucHJvdG90eXBlLCBmdW5jdGlvbiBDb2xsZWN0aW9uMih3aGVyZUNsYXVzZSwga2V5UmFuZ2VHZW5lcmF0b3IpIHtcbiAgICB0aGlzLmRiID0gZGI7XG4gICAgdmFyIGtleVJhbmdlID0gQW55UmFuZ2UsIGVycm9yID0gbnVsbDtcbiAgICBpZiAoa2V5UmFuZ2VHZW5lcmF0b3IpXG4gICAgICB0cnkge1xuICAgICAgICBrZXlSYW5nZSA9IGtleVJhbmdlR2VuZXJhdG9yKCk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgfVxuICAgIHZhciB3aGVyZUN0eCA9IHdoZXJlQ2xhdXNlLl9jdHg7XG4gICAgdmFyIHRhYmxlID0gd2hlcmVDdHgudGFibGU7XG4gICAgdmFyIHJlYWRpbmdIb29rID0gdGFibGUuaG9vay5yZWFkaW5nLmZpcmU7XG4gICAgdGhpcy5fY3R4ID0ge1xuICAgICAgdGFibGUsXG4gICAgICBpbmRleDogd2hlcmVDdHguaW5kZXgsXG4gICAgICBpc1ByaW1LZXk6ICF3aGVyZUN0eC5pbmRleCB8fCB0YWJsZS5zY2hlbWEucHJpbUtleS5rZXlQYXRoICYmIHdoZXJlQ3R4LmluZGV4ID09PSB0YWJsZS5zY2hlbWEucHJpbUtleS5uYW1lLFxuICAgICAgcmFuZ2U6IGtleVJhbmdlLFxuICAgICAga2V5c09ubHk6IGZhbHNlLFxuICAgICAgZGlyOiBcIm5leHRcIixcbiAgICAgIHVuaXF1ZTogXCJcIixcbiAgICAgIGFsZ29yaXRobTogbnVsbCxcbiAgICAgIGZpbHRlcjogbnVsbCxcbiAgICAgIHJlcGxheUZpbHRlcjogbnVsbCxcbiAgICAgIGp1c3RMaW1pdDogdHJ1ZSxcbiAgICAgIGlzTWF0Y2g6IG51bGwsXG4gICAgICBvZmZzZXQ6IDAsXG4gICAgICBsaW1pdDogSW5maW5pdHksXG4gICAgICBlcnJvcixcbiAgICAgIG9yOiB3aGVyZUN0eC5vcixcbiAgICAgIHZhbHVlTWFwcGVyOiByZWFkaW5nSG9vayAhPT0gbWlycm9yID8gcmVhZGluZ0hvb2sgOiBudWxsXG4gICAgfTtcbiAgfSk7XG59XG5mdW5jdGlvbiBzaW1wbGVDb21wYXJlKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID09PSBiID8gMCA6IDE7XG59XG5mdW5jdGlvbiBzaW1wbGVDb21wYXJlUmV2ZXJzZShhLCBiKSB7XG4gIHJldHVybiBhID4gYiA/IC0xIDogYSA9PT0gYiA/IDAgOiAxO1xufVxuZnVuY3Rpb24gZmFpbChjb2xsZWN0aW9uT3JXaGVyZUNsYXVzZSwgZXJyLCBUKSB7XG4gIHZhciBjb2xsZWN0aW9uID0gY29sbGVjdGlvbk9yV2hlcmVDbGF1c2UgaW5zdGFuY2VvZiBXaGVyZUNsYXVzZSA/IG5ldyBjb2xsZWN0aW9uT3JXaGVyZUNsYXVzZS5Db2xsZWN0aW9uKGNvbGxlY3Rpb25PcldoZXJlQ2xhdXNlKSA6IGNvbGxlY3Rpb25PcldoZXJlQ2xhdXNlO1xuICBjb2xsZWN0aW9uLl9jdHguZXJyb3IgPSBUID8gbmV3IFQoZXJyKSA6IG5ldyBUeXBlRXJyb3IoZXJyKTtcbiAgcmV0dXJuIGNvbGxlY3Rpb247XG59XG5mdW5jdGlvbiBlbXB0eUNvbGxlY3Rpb24od2hlcmVDbGF1c2UpIHtcbiAgcmV0dXJuIG5ldyB3aGVyZUNsYXVzZS5Db2xsZWN0aW9uKHdoZXJlQ2xhdXNlLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFuZ2VFcXVhbChcIlwiKTtcbiAgfSkubGltaXQoMCk7XG59XG5mdW5jdGlvbiB1cHBlckZhY3RvcnkoZGlyKSB7XG4gIHJldHVybiBkaXIgPT09IFwibmV4dFwiID8gZnVuY3Rpb24ocykge1xuICAgIHJldHVybiBzLnRvVXBwZXJDYXNlKCk7XG4gIH0gOiBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGxvd2VyRmFjdG9yeShkaXIpIHtcbiAgcmV0dXJuIGRpciA9PT0gXCJuZXh0XCIgPyBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKTtcbiAgfSA6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy50b1VwcGVyQ2FzZSgpO1xuICB9O1xufVxuZnVuY3Rpb24gbmV4dENhc2luZyhrZXksIGxvd2VyS2V5LCB1cHBlck5lZWRsZSwgbG93ZXJOZWVkbGUsIGNtcDIsIGRpcikge1xuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oa2V5Lmxlbmd0aCwgbG93ZXJOZWVkbGUubGVuZ3RoKTtcbiAgdmFyIGxscCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGx3cktleUNoYXIgPSBsb3dlcktleVtpXTtcbiAgICBpZiAobHdyS2V5Q2hhciAhPT0gbG93ZXJOZWVkbGVbaV0pIHtcbiAgICAgIGlmIChjbXAyKGtleVtpXSwgdXBwZXJOZWVkbGVbaV0pIDwgMClcbiAgICAgICAgcmV0dXJuIGtleS5zdWJzdHIoMCwgaSkgKyB1cHBlck5lZWRsZVtpXSArIHVwcGVyTmVlZGxlLnN1YnN0cihpICsgMSk7XG4gICAgICBpZiAoY21wMihrZXlbaV0sIGxvd2VyTmVlZGxlW2ldKSA8IDApXG4gICAgICAgIHJldHVybiBrZXkuc3Vic3RyKDAsIGkpICsgbG93ZXJOZWVkbGVbaV0gKyB1cHBlck5lZWRsZS5zdWJzdHIoaSArIDEpO1xuICAgICAgaWYgKGxscCA+PSAwKVxuICAgICAgICByZXR1cm4ga2V5LnN1YnN0cigwLCBsbHApICsgbG93ZXJLZXlbbGxwXSArIHVwcGVyTmVlZGxlLnN1YnN0cihsbHAgKyAxKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoY21wMihrZXlbaV0sIGx3cktleUNoYXIpIDwgMClcbiAgICAgIGxscCA9IGk7XG4gIH1cbiAgaWYgKGxlbmd0aCA8IGxvd2VyTmVlZGxlLmxlbmd0aCAmJiBkaXIgPT09IFwibmV4dFwiKVxuICAgIHJldHVybiBrZXkgKyB1cHBlck5lZWRsZS5zdWJzdHIoa2V5Lmxlbmd0aCk7XG4gIGlmIChsZW5ndGggPCBrZXkubGVuZ3RoICYmIGRpciA9PT0gXCJwcmV2XCIpXG4gICAgcmV0dXJuIGtleS5zdWJzdHIoMCwgdXBwZXJOZWVkbGUubGVuZ3RoKTtcbiAgcmV0dXJuIGxscCA8IDAgPyBudWxsIDoga2V5LnN1YnN0cigwLCBsbHApICsgbG93ZXJOZWVkbGVbbGxwXSArIHVwcGVyTmVlZGxlLnN1YnN0cihsbHAgKyAxKTtcbn1cbmZ1bmN0aW9uIGFkZElnbm9yZUNhc2VBbGdvcml0aG0od2hlcmVDbGF1c2UsIG1hdGNoLCBuZWVkbGVzLCBzdWZmaXgpIHtcbiAgdmFyIHVwcGVyLCBsb3dlciwgY29tcGFyZSwgdXBwZXJOZWVkbGVzLCBsb3dlck5lZWRsZXMsIGRpcmVjdGlvbiwgbmV4dEtleVN1ZmZpeCwgbmVlZGxlc0xlbiA9IG5lZWRsZXMubGVuZ3RoO1xuICBpZiAoIW5lZWRsZXMuZXZlcnkoZnVuY3Rpb24ocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gXCJzdHJpbmdcIjtcbiAgfSkpIHtcbiAgICByZXR1cm4gZmFpbCh3aGVyZUNsYXVzZSwgU1RSSU5HX0VYUEVDVEVEKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0RGlyZWN0aW9uKGRpcikge1xuICAgIHVwcGVyID0gdXBwZXJGYWN0b3J5KGRpcik7XG4gICAgbG93ZXIgPSBsb3dlckZhY3RvcnkoZGlyKTtcbiAgICBjb21wYXJlID0gZGlyID09PSBcIm5leHRcIiA/IHNpbXBsZUNvbXBhcmUgOiBzaW1wbGVDb21wYXJlUmV2ZXJzZTtcbiAgICB2YXIgbmVlZGxlQm91bmRzID0gbmVlZGxlcy5tYXAoZnVuY3Rpb24obmVlZGxlKSB7XG4gICAgICByZXR1cm4ge2xvd2VyOiBsb3dlcihuZWVkbGUpLCB1cHBlcjogdXBwZXIobmVlZGxlKX07XG4gICAgfSkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gY29tcGFyZShhLmxvd2VyLCBiLmxvd2VyKTtcbiAgICB9KTtcbiAgICB1cHBlck5lZWRsZXMgPSBuZWVkbGVCb3VuZHMubWFwKGZ1bmN0aW9uKG5iKSB7XG4gICAgICByZXR1cm4gbmIudXBwZXI7XG4gICAgfSk7XG4gICAgbG93ZXJOZWVkbGVzID0gbmVlZGxlQm91bmRzLm1hcChmdW5jdGlvbihuYikge1xuICAgICAgcmV0dXJuIG5iLmxvd2VyO1xuICAgIH0pO1xuICAgIGRpcmVjdGlvbiA9IGRpcjtcbiAgICBuZXh0S2V5U3VmZml4ID0gZGlyID09PSBcIm5leHRcIiA/IFwiXCIgOiBzdWZmaXg7XG4gIH1cbiAgaW5pdERpcmVjdGlvbihcIm5leHRcIik7XG4gIHZhciBjID0gbmV3IHdoZXJlQ2xhdXNlLkNvbGxlY3Rpb24od2hlcmVDbGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjcmVhdGVSYW5nZSh1cHBlck5lZWRsZXNbMF0sIGxvd2VyTmVlZGxlc1tuZWVkbGVzTGVuIC0gMV0gKyBzdWZmaXgpO1xuICB9KTtcbiAgYy5fb25kaXJlY3Rpb25jaGFuZ2UgPSBmdW5jdGlvbihkaXJlY3Rpb24yKSB7XG4gICAgaW5pdERpcmVjdGlvbihkaXJlY3Rpb24yKTtcbiAgfTtcbiAgdmFyIGZpcnN0UG9zc2libGVOZWVkbGUgPSAwO1xuICBjLl9hZGRBbGdvcml0aG0oZnVuY3Rpb24oY3Vyc29yLCBhZHZhbmNlLCByZXNvbHZlKSB7XG4gICAgdmFyIGtleSA9IGN1cnNvci5rZXk7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGxvd2VyS2V5ID0gbG93ZXIoa2V5KTtcbiAgICBpZiAobWF0Y2gobG93ZXJLZXksIGxvd2VyTmVlZGxlcywgZmlyc3RQb3NzaWJsZU5lZWRsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbG93ZXN0UG9zc2libGVDYXNpbmcgPSBudWxsO1xuICAgICAgZm9yICh2YXIgaSA9IGZpcnN0UG9zc2libGVOZWVkbGU7IGkgPCBuZWVkbGVzTGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGNhc2luZyA9IG5leHRDYXNpbmcoa2V5LCBsb3dlcktleSwgdXBwZXJOZWVkbGVzW2ldLCBsb3dlck5lZWRsZXNbaV0sIGNvbXBhcmUsIGRpcmVjdGlvbik7XG4gICAgICAgIGlmIChjYXNpbmcgPT09IG51bGwgJiYgbG93ZXN0UG9zc2libGVDYXNpbmcgPT09IG51bGwpXG4gICAgICAgICAgZmlyc3RQb3NzaWJsZU5lZWRsZSA9IGkgKyAxO1xuICAgICAgICBlbHNlIGlmIChsb3dlc3RQb3NzaWJsZUNhc2luZyA9PT0gbnVsbCB8fCBjb21wYXJlKGxvd2VzdFBvc3NpYmxlQ2FzaW5nLCBjYXNpbmcpID4gMCkge1xuICAgICAgICAgIGxvd2VzdFBvc3NpYmxlQ2FzaW5nID0gY2FzaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobG93ZXN0UG9zc2libGVDYXNpbmcgIT09IG51bGwpIHtcbiAgICAgICAgYWR2YW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICBjdXJzb3IuY29udGludWUobG93ZXN0UG9zc2libGVDYXNpbmcgKyBuZXh0S2V5U3VmZml4KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZHZhbmNlKHJlc29sdmUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjO1xufVxuZnVuY3Rpb24gY3JlYXRlUmFuZ2UobG93ZXIsIHVwcGVyLCBsb3dlck9wZW4sIHVwcGVyT3Blbikge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IDIsXG4gICAgbG93ZXIsXG4gICAgdXBwZXIsXG4gICAgbG93ZXJPcGVuLFxuICAgIHVwcGVyT3BlblxuICB9O1xufVxuZnVuY3Rpb24gcmFuZ2VFcXVhbCh2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IDEsXG4gICAgbG93ZXI6IHZhbHVlLFxuICAgIHVwcGVyOiB2YWx1ZVxuICB9O1xufVxudmFyIFdoZXJlQ2xhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFdoZXJlQ2xhdXNlMigpIHtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2hlcmVDbGF1c2UyLnByb3RvdHlwZSwgXCJDb2xsZWN0aW9uXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N0eC50YWJsZS5kYi5Db2xsZWN0aW9uO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmJldHdlZW4gPSBmdW5jdGlvbihsb3dlciwgdXBwZXIsIGluY2x1ZGVMb3dlciwgaW5jbHVkZVVwcGVyKSB7XG4gICAgaW5jbHVkZUxvd2VyID0gaW5jbHVkZUxvd2VyICE9PSBmYWxzZTtcbiAgICBpbmNsdWRlVXBwZXIgPSBpbmNsdWRlVXBwZXIgPT09IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLl9jbXAobG93ZXIsIHVwcGVyKSA+IDAgfHwgdGhpcy5fY21wKGxvd2VyLCB1cHBlcikgPT09IDAgJiYgKGluY2x1ZGVMb3dlciB8fCBpbmNsdWRlVXBwZXIpICYmICEoaW5jbHVkZUxvd2VyICYmIGluY2x1ZGVVcHBlcikpXG4gICAgICAgIHJldHVybiBlbXB0eUNvbGxlY3Rpb24odGhpcyk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKGxvd2VyLCB1cHBlciwgIWluY2x1ZGVMb3dlciwgIWluY2x1ZGVVcHBlcik7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgfVxuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmFuZ2VFcXVhbCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYWJvdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHZhbHVlLCB2b2lkIDAsIHRydWUpO1xuICAgIH0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmFib3ZlT3JFcXVhbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZ2UodmFsdWUsIHZvaWQgMCwgZmFsc2UpO1xuICAgIH0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmJlbG93ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSYW5nZSh2b2lkIDAsIHZhbHVlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYmVsb3dPckVxdWFsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSYW5nZSh2b2lkIDAsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5zdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09IFwic3RyaW5nXCIpXG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBTVFJJTkdfRVhQRUNURUQpO1xuICAgIHJldHVybiB0aGlzLmJldHdlZW4oc3RyLCBzdHIgKyBtYXhTdHJpbmcsIHRydWUsIHRydWUpO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLnN0YXJ0c1dpdGhJZ25vcmVDYXNlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHN0ciA9PT0gXCJcIilcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0c1dpdGgoc3RyKTtcbiAgICByZXR1cm4gYWRkSWdub3JlQ2FzZUFsZ29yaXRobSh0aGlzLCBmdW5jdGlvbih4LCBhKSB7XG4gICAgICByZXR1cm4geC5pbmRleE9mKGFbMF0pID09PSAwO1xuICAgIH0sIFtzdHJdLCBtYXhTdHJpbmcpO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmVxdWFsc0lnbm9yZUNhc2UgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gYWRkSWdub3JlQ2FzZUFsZ29yaXRobSh0aGlzLCBmdW5jdGlvbih4LCBhKSB7XG4gICAgICByZXR1cm4geCA9PT0gYVswXTtcbiAgICB9LCBbc3RyXSwgXCJcIik7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYW55T2ZJZ25vcmVDYXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldCA9IGdldEFycmF5T2YuYXBwbHkoTk9fQ0hBUl9BUlJBWSwgYXJndW1lbnRzKTtcbiAgICBpZiAoc2V0Lmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBlbXB0eUNvbGxlY3Rpb24odGhpcyk7XG4gICAgcmV0dXJuIGFkZElnbm9yZUNhc2VBbGdvcml0aG0odGhpcywgZnVuY3Rpb24oeCwgYSkge1xuICAgICAgcmV0dXJuIGEuaW5kZXhPZih4KSAhPT0gLTE7XG4gICAgfSwgc2V0LCBcIlwiKTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5zdGFydHNXaXRoQW55T2ZJZ25vcmVDYXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldCA9IGdldEFycmF5T2YuYXBwbHkoTk9fQ0hBUl9BUlJBWSwgYXJndW1lbnRzKTtcbiAgICBpZiAoc2V0Lmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBlbXB0eUNvbGxlY3Rpb24odGhpcyk7XG4gICAgcmV0dXJuIGFkZElnbm9yZUNhc2VBbGdvcml0aG0odGhpcywgZnVuY3Rpb24oeCwgYSkge1xuICAgICAgcmV0dXJuIGEuc29tZShmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiB4LmluZGV4T2YobikgPT09IDA7XG4gICAgICB9KTtcbiAgICB9LCBzZXQsIG1heFN0cmluZyk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYW55T2YgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBzZXQgPSBnZXRBcnJheU9mLmFwcGx5KE5PX0NIQVJfQVJSQVksIGFyZ3VtZW50cyk7XG4gICAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jbXA7XG4gICAgdHJ5IHtcbiAgICAgIHNldC5zb3J0KGNvbXBhcmUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICB9XG4gICAgaWYgKHNldC5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gZW1wdHlDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHZhciBjID0gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSYW5nZShzZXRbMF0sIHNldFtzZXQubGVuZ3RoIC0gMV0pO1xuICAgIH0pO1xuICAgIGMuX29uZGlyZWN0aW9uY2hhbmdlID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgICBjb21wYXJlID0gZGlyZWN0aW9uID09PSBcIm5leHRcIiA/IF90aGlzLl9hc2NlbmRpbmcgOiBfdGhpcy5fZGVzY2VuZGluZztcbiAgICAgIHNldC5zb3J0KGNvbXBhcmUpO1xuICAgIH07XG4gICAgdmFyIGkgPSAwO1xuICAgIGMuX2FkZEFsZ29yaXRobShmdW5jdGlvbihjdXJzb3IsIGFkdmFuY2UsIHJlc29sdmUpIHtcbiAgICAgIHZhciBrZXkgPSBjdXJzb3Iua2V5O1xuICAgICAgd2hpbGUgKGNvbXBhcmUoa2V5LCBzZXRbaV0pID4gMCkge1xuICAgICAgICArK2k7XG4gICAgICAgIGlmIChpID09PSBzZXQubGVuZ3RoKSB7XG4gICAgICAgICAgYWR2YW5jZShyZXNvbHZlKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjb21wYXJlKGtleSwgc2V0W2ldKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkdmFuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKHNldFtpXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGM7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUubm90RXF1YWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmluQW55UmFuZ2UoW1ttaW5LZXksIHZhbHVlXSwgW3ZhbHVlLCB0aGlzLmRiLl9tYXhLZXldXSwge2luY2x1ZGVMb3dlcnM6IGZhbHNlLCBpbmNsdWRlVXBwZXJzOiBmYWxzZX0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLm5vbmVPZiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXQgPSBnZXRBcnJheU9mLmFwcGx5KE5PX0NIQVJfQVJSQVksIGFyZ3VtZW50cyk7XG4gICAgaWYgKHNldC5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzKTtcbiAgICB0cnkge1xuICAgICAgc2V0LnNvcnQodGhpcy5fYXNjZW5kaW5nKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgfVxuICAgIHZhciByYW5nZXMgPSBzZXQucmVkdWNlKGZ1bmN0aW9uKHJlcywgdmFsKSB7XG4gICAgICByZXR1cm4gcmVzID8gcmVzLmNvbmNhdChbW3Jlc1tyZXMubGVuZ3RoIC0gMV1bMV0sIHZhbF1dKSA6IFtbbWluS2V5LCB2YWxdXTtcbiAgICB9LCBudWxsKTtcbiAgICByYW5nZXMucHVzaChbc2V0W3NldC5sZW5ndGggLSAxXSwgdGhpcy5kYi5fbWF4S2V5XSk7XG4gICAgcmV0dXJuIHRoaXMuaW5BbnlSYW5nZShyYW5nZXMsIHtpbmNsdWRlTG93ZXJzOiBmYWxzZSwgaW5jbHVkZVVwcGVyczogZmFsc2V9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5pbkFueVJhbmdlID0gZnVuY3Rpb24ocmFuZ2VzLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgY21wMiA9IHRoaXMuX2NtcCwgYXNjZW5kaW5nID0gdGhpcy5fYXNjZW5kaW5nLCBkZXNjZW5kaW5nID0gdGhpcy5fZGVzY2VuZGluZywgbWluID0gdGhpcy5fbWluLCBtYXggPSB0aGlzLl9tYXg7XG4gICAgaWYgKHJhbmdlcy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gZW1wdHlDb2xsZWN0aW9uKHRoaXMpO1xuICAgIGlmICghcmFuZ2VzLmV2ZXJ5KGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICByZXR1cm4gcmFuZ2VbMF0gIT09IHZvaWQgMCAmJiByYW5nZVsxXSAhPT0gdm9pZCAwICYmIGFzY2VuZGluZyhyYW5nZVswXSwgcmFuZ2VbMV0pIDw9IDA7XG4gICAgfSkpIHtcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIFwiRmlyc3QgYXJndW1lbnQgdG8gaW5BbnlSYW5nZSgpIG11c3QgYmUgYW4gQXJyYXkgb2YgdHdvLXZhbHVlIEFycmF5cyBbbG93ZXIsdXBwZXJdIHdoZXJlIHVwcGVyIG11c3Qgbm90IGJlIGxvd2VyIHRoYW4gbG93ZXJcIiwgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQpO1xuICAgIH1cbiAgICB2YXIgaW5jbHVkZUxvd2VycyA9ICFvcHRpb25zIHx8IG9wdGlvbnMuaW5jbHVkZUxvd2VycyAhPT0gZmFsc2U7XG4gICAgdmFyIGluY2x1ZGVVcHBlcnMgPSBvcHRpb25zICYmIG9wdGlvbnMuaW5jbHVkZVVwcGVycyA9PT0gdHJ1ZTtcbiAgICBmdW5jdGlvbiBhZGRSYW5nZTIocmFuZ2VzMiwgbmV3UmFuZ2UpIHtcbiAgICAgIHZhciBpID0gMCwgbCA9IHJhbmdlczIubGVuZ3RoO1xuICAgICAgZm9yICg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgdmFyIHJhbmdlID0gcmFuZ2VzMltpXTtcbiAgICAgICAgaWYgKGNtcDIobmV3UmFuZ2VbMF0sIHJhbmdlWzFdKSA8IDAgJiYgY21wMihuZXdSYW5nZVsxXSwgcmFuZ2VbMF0pID4gMCkge1xuICAgICAgICAgIHJhbmdlWzBdID0gbWluKHJhbmdlWzBdLCBuZXdSYW5nZVswXSk7XG4gICAgICAgICAgcmFuZ2VbMV0gPSBtYXgocmFuZ2VbMV0sIG5ld1JhbmdlWzFdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IGwpXG4gICAgICAgIHJhbmdlczIucHVzaChuZXdSYW5nZSk7XG4gICAgICByZXR1cm4gcmFuZ2VzMjtcbiAgICB9XG4gICAgdmFyIHNvcnREaXJlY3Rpb24gPSBhc2NlbmRpbmc7XG4gICAgZnVuY3Rpb24gcmFuZ2VTb3J0ZXIoYSwgYikge1xuICAgICAgcmV0dXJuIHNvcnREaXJlY3Rpb24oYVswXSwgYlswXSk7XG4gICAgfVxuICAgIHZhciBzZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHNldCA9IHJhbmdlcy5yZWR1Y2UoYWRkUmFuZ2UyLCBbXSk7XG4gICAgICBzZXQuc29ydChyYW5nZVNvcnRlcik7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICB9XG4gICAgdmFyIHJhbmdlUG9zID0gMDtcbiAgICB2YXIga2V5SXNCZXlvbmRDdXJyZW50RW50cnkgPSBpbmNsdWRlVXBwZXJzID8gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gYXNjZW5kaW5nKGtleSwgc2V0W3JhbmdlUG9zXVsxXSkgPiAwO1xuICAgIH0gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBhc2NlbmRpbmcoa2V5LCBzZXRbcmFuZ2VQb3NdWzFdKSA+PSAwO1xuICAgIH07XG4gICAgdmFyIGtleUlzQmVmb3JlQ3VycmVudEVudHJ5ID0gaW5jbHVkZUxvd2VycyA/IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoa2V5LCBzZXRbcmFuZ2VQb3NdWzBdKSA+IDA7XG4gICAgfSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoa2V5LCBzZXRbcmFuZ2VQb3NdWzBdKSA+PSAwO1xuICAgIH07XG4gICAgZnVuY3Rpb24ga2V5V2l0aGluQ3VycmVudFJhbmdlKGtleSkge1xuICAgICAgcmV0dXJuICFrZXlJc0JleW9uZEN1cnJlbnRFbnRyeShrZXkpICYmICFrZXlJc0JlZm9yZUN1cnJlbnRFbnRyeShrZXkpO1xuICAgIH1cbiAgICB2YXIgY2hlY2tLZXkgPSBrZXlJc0JleW9uZEN1cnJlbnRFbnRyeTtcbiAgICB2YXIgYyA9IG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZ2Uoc2V0WzBdWzBdLCBzZXRbc2V0Lmxlbmd0aCAtIDFdWzFdLCAhaW5jbHVkZUxvd2VycywgIWluY2x1ZGVVcHBlcnMpO1xuICAgIH0pO1xuICAgIGMuX29uZGlyZWN0aW9uY2hhbmdlID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcIm5leHRcIikge1xuICAgICAgICBjaGVja0tleSA9IGtleUlzQmV5b25kQ3VycmVudEVudHJ5O1xuICAgICAgICBzb3J0RGlyZWN0aW9uID0gYXNjZW5kaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tLZXkgPSBrZXlJc0JlZm9yZUN1cnJlbnRFbnRyeTtcbiAgICAgICAgc29ydERpcmVjdGlvbiA9IGRlc2NlbmRpbmc7XG4gICAgICB9XG4gICAgICBzZXQuc29ydChyYW5nZVNvcnRlcik7XG4gICAgfTtcbiAgICBjLl9hZGRBbGdvcml0aG0oZnVuY3Rpb24oY3Vyc29yLCBhZHZhbmNlLCByZXNvbHZlKSB7XG4gICAgICB2YXIga2V5ID0gY3Vyc29yLmtleTtcbiAgICAgIHdoaWxlIChjaGVja0tleShrZXkpKSB7XG4gICAgICAgICsrcmFuZ2VQb3M7XG4gICAgICAgIGlmIChyYW5nZVBvcyA9PT0gc2V0Lmxlbmd0aCkge1xuICAgICAgICAgIGFkdmFuY2UocmVzb2x2ZSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoa2V5V2l0aGluQ3VycmVudFJhbmdlKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKF90aGlzLl9jbXAoa2V5LCBzZXRbcmFuZ2VQb3NdWzFdKSA9PT0gMCB8fCBfdGhpcy5fY21wKGtleSwgc2V0W3JhbmdlUG9zXVswXSkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWR2YW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoc29ydERpcmVjdGlvbiA9PT0gYXNjZW5kaW5nKVxuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKHNldFtyYW5nZVBvc11bMF0pO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZShzZXRbcmFuZ2VQb3NdWzFdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYztcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5zdGFydHNXaXRoQW55T2YgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0ID0gZ2V0QXJyYXlPZi5hcHBseShOT19DSEFSX0FSUkFZLCBhcmd1bWVudHMpO1xuICAgIGlmICghc2V0LmV2ZXJ5KGZ1bmN0aW9uKHMpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgcyA9PT0gXCJzdHJpbmdcIjtcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIGZhaWwodGhpcywgXCJzdGFydHNXaXRoQW55T2YoKSBvbmx5IHdvcmtzIHdpdGggc3RyaW5nc1wiKTtcbiAgICB9XG4gICAgaWYgKHNldC5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gZW1wdHlDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLmluQW55UmFuZ2Uoc2V0Lm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBbc3RyLCBzdHIgKyBtYXhTdHJpbmddO1xuICAgIH0pKTtcbiAgfTtcbiAgcmV0dXJuIFdoZXJlQ2xhdXNlMjtcbn0oKTtcbmZ1bmN0aW9uIGNyZWF0ZVdoZXJlQ2xhdXNlQ29uc3RydWN0b3IoZGIpIHtcbiAgcmV0dXJuIG1ha2VDbGFzc0NvbnN0cnVjdG9yKFdoZXJlQ2xhdXNlLnByb3RvdHlwZSwgZnVuY3Rpb24gV2hlcmVDbGF1c2UyKHRhYmxlLCBpbmRleCwgb3JDb2xsZWN0aW9uKSB7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHRoaXMuX2N0eCA9IHtcbiAgICAgIHRhYmxlLFxuICAgICAgaW5kZXg6IGluZGV4ID09PSBcIjppZFwiID8gbnVsbCA6IGluZGV4LFxuICAgICAgb3I6IG9yQ29sbGVjdGlvblxuICAgIH07XG4gICAgdmFyIGluZGV4ZWREQiA9IGRiLl9kZXBzLmluZGV4ZWREQjtcbiAgICBpZiAoIWluZGV4ZWREQilcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk1pc3NpbmdBUEkoKTtcbiAgICB0aGlzLl9jbXAgPSB0aGlzLl9hc2NlbmRpbmcgPSBpbmRleGVkREIuY21wLmJpbmQoaW5kZXhlZERCKTtcbiAgICB0aGlzLl9kZXNjZW5kaW5nID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGluZGV4ZWREQi5jbXAoYiwgYSk7XG4gICAgfTtcbiAgICB0aGlzLl9tYXggPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gaW5kZXhlZERCLmNtcChhLCBiKSA+IDAgPyBhIDogYjtcbiAgICB9O1xuICAgIHRoaXMuX21pbiA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBpbmRleGVkREIuY21wKGEsIGIpIDwgMCA/IGEgOiBiO1xuICAgIH07XG4gICAgdGhpcy5fSURCS2V5UmFuZ2UgPSBkYi5fZGVwcy5JREJLZXlSYW5nZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KSB7XG4gIHJldHVybiB3cmFwKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgcHJldmVudERlZmF1bHQoZXZlbnQpO1xuICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChldmVudCkge1xuICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cbnZhciBnbG9iYWxFdmVudHMgPSBFdmVudHMobnVsbCwgXCJ0eGNvbW1pdHRlZFwiKTtcbnZhciBUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUcmFuc2FjdGlvbjIoKSB7XG4gIH1cbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5fbG9jayA9IGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydCghUFNELmdsb2JhbCk7XG4gICAgKyt0aGlzLl9yZWN1bG9jaztcbiAgICBpZiAodGhpcy5fcmVjdWxvY2sgPT09IDEgJiYgIVBTRC5nbG9iYWwpXG4gICAgICBQU0QubG9ja093bmVyRm9yID0gdGhpcztcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5fdW5sb2NrID0gZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0KCFQU0QuZ2xvYmFsKTtcbiAgICBpZiAoLS10aGlzLl9yZWN1bG9jayA9PT0gMCkge1xuICAgICAgaWYgKCFQU0QuZ2xvYmFsKVxuICAgICAgICBQU0QubG9ja093bmVyRm9yID0gbnVsbDtcbiAgICAgIHdoaWxlICh0aGlzLl9ibG9ja2VkRnVuY3MubGVuZ3RoID4gMCAmJiAhdGhpcy5fbG9ja2VkKCkpIHtcbiAgICAgICAgdmFyIGZuQW5kUFNEID0gdGhpcy5fYmxvY2tlZEZ1bmNzLnNoaWZ0KCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdXNlUFNEKGZuQW5kUFNEWzFdLCBmbkFuZFBTRFswXSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5fbG9ja2VkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY3Vsb2NrICYmIFBTRC5sb2NrT3duZXJGb3IgIT09IHRoaXM7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oaWRidHJhbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGlmICghdGhpcy5tb2RlKVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgdmFyIGlkYmRiID0gdGhpcy5kYi5pZGJkYjtcbiAgICB2YXIgZGJPcGVuRXJyb3IgPSB0aGlzLmRiLl9zdGF0ZS5kYk9wZW5FcnJvcjtcbiAgICBhc3NlcnQoIXRoaXMuaWRidHJhbnMpO1xuICAgIGlmICghaWRidHJhbnMgJiYgIWlkYmRiKSB7XG4gICAgICBzd2l0Y2ggKGRiT3BlbkVycm9yICYmIGRiT3BlbkVycm9yLm5hbWUpIHtcbiAgICAgICAgY2FzZSBcIkRhdGFiYXNlQ2xvc2VkRXJyb3JcIjpcbiAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5EYXRhYmFzZUNsb3NlZChkYk9wZW5FcnJvcik7XG4gICAgICAgIGNhc2UgXCJNaXNzaW5nQVBJRXJyb3JcIjpcbiAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5NaXNzaW5nQVBJKGRiT3BlbkVycm9yLm1lc3NhZ2UsIGRiT3BlbkVycm9yKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5PcGVuRmFpbGVkKGRiT3BlbkVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSlcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlRyYW5zYWN0aW9uSW5hY3RpdmUoKTtcbiAgICBhc3NlcnQodGhpcy5fY29tcGxldGlvbi5fc3RhdGUgPT09IG51bGwpO1xuICAgIGlkYnRyYW5zID0gdGhpcy5pZGJ0cmFucyA9IGlkYnRyYW5zIHx8IGlkYmRiLnRyYW5zYWN0aW9uKHNhZmFyaU11bHRpU3RvcmVGaXgodGhpcy5zdG9yZU5hbWVzKSwgdGhpcy5tb2RlKTtcbiAgICBpZGJ0cmFucy5vbmVycm9yID0gd3JhcChmdW5jdGlvbihldikge1xuICAgICAgcHJldmVudERlZmF1bHQoZXYpO1xuICAgICAgX3RoaXMuX3JlamVjdChpZGJ0cmFucy5lcnJvcik7XG4gICAgfSk7XG4gICAgaWRidHJhbnMub25hYm9ydCA9IHdyYXAoZnVuY3Rpb24oZXYpIHtcbiAgICAgIHByZXZlbnREZWZhdWx0KGV2KTtcbiAgICAgIF90aGlzLmFjdGl2ZSAmJiBfdGhpcy5fcmVqZWN0KG5ldyBleGNlcHRpb25zLkFib3J0KGlkYnRyYW5zLmVycm9yKSk7XG4gICAgICBfdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIF90aGlzLm9uKFwiYWJvcnRcIikuZmlyZShldik7XG4gICAgfSk7XG4gICAgaWRidHJhbnMub25jb21wbGV0ZSA9IHdyYXAoZnVuY3Rpb24oKSB7XG4gICAgICBfdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIF90aGlzLl9yZXNvbHZlKCk7XG4gICAgICBpZiAoXCJtdXRhdGVkUGFydHNcIiBpbiBpZGJ0cmFucykge1xuICAgICAgICBnbG9iYWxFdmVudHMudHhjb21taXR0ZWQuZmlyZShpZGJ0cmFuc1tcIm11dGF0ZWRQYXJ0c1wiXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuX3Byb21pc2UgPSBmdW5jdGlvbihtb2RlLCBmbiwgYldyaXRlTG9jaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgaWYgKG1vZGUgPT09IFwicmVhZHdyaXRlXCIgJiYgdGhpcy5tb2RlICE9PSBcInJlYWR3cml0ZVwiKVxuICAgICAgcmV0dXJuIHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5SZWFkT25seShcIlRyYW5zYWN0aW9uIGlzIHJlYWRvbmx5XCIpKTtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKVxuICAgICAgcmV0dXJuIHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5UcmFuc2FjdGlvbkluYWN0aXZlKCkpO1xuICAgIGlmICh0aGlzLl9sb2NrZWQoKSkge1xuICAgICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIF90aGlzLl9ibG9ja2VkRnVuY3MucHVzaChbZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMuX3Byb21pc2UobW9kZSwgZm4sIGJXcml0ZUxvY2spLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSwgUFNEXSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGJXcml0ZUxvY2spIHtcbiAgICAgIHJldHVybiBuZXdTY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHAyID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBfdGhpcy5fbG9jaygpO1xuICAgICAgICAgIHZhciBydiA9IGZuKHJlc29sdmUsIHJlamVjdCwgX3RoaXMpO1xuICAgICAgICAgIGlmIChydiAmJiBydi50aGVuKVxuICAgICAgICAgICAgcnYudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgICAgcDIuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuX3VubG9jaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcDIuX2xpYiA9IHRydWU7XG4gICAgICAgIHJldHVybiBwMjtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcCA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciBydiA9IGZuKHJlc29sdmUsIHJlamVjdCwgX3RoaXMpO1xuICAgICAgICBpZiAocnYgJiYgcnYudGhlbilcbiAgICAgICAgICBydi50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIHAuX2xpYiA9IHRydWU7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuX3Jvb3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5fcm9vdCgpIDogdGhpcztcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS53YWl0Rm9yID0gZnVuY3Rpb24ocHJvbWlzZUxpa2UpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3QoKTtcbiAgICB2YXIgcHJvbWlzZSA9IERleGllUHJvbWlzZS5yZXNvbHZlKHByb21pc2VMaWtlKTtcbiAgICBpZiAocm9vdC5fd2FpdGluZ0Zvcikge1xuICAgICAgcm9vdC5fd2FpdGluZ0ZvciA9IHJvb3QuX3dhaXRpbmdGb3IudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5fd2FpdGluZ0ZvciA9IHByb21pc2U7XG4gICAgICByb290Ll93YWl0aW5nUXVldWUgPSBbXTtcbiAgICAgIHZhciBzdG9yZSA9IHJvb3QuaWRidHJhbnMub2JqZWN0U3RvcmUocm9vdC5zdG9yZU5hbWVzWzBdKTtcbiAgICAgIChmdW5jdGlvbiBzcGluKCkge1xuICAgICAgICArK3Jvb3QuX3NwaW5Db3VudDtcbiAgICAgICAgd2hpbGUgKHJvb3QuX3dhaXRpbmdRdWV1ZS5sZW5ndGgpXG4gICAgICAgICAgcm9vdC5fd2FpdGluZ1F1ZXVlLnNoaWZ0KCkoKTtcbiAgICAgICAgaWYgKHJvb3QuX3dhaXRpbmdGb3IpXG4gICAgICAgICAgc3RvcmUuZ2V0KC1JbmZpbml0eSkub25zdWNjZXNzID0gc3BpbjtcbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50V2FpdFByb21pc2UgPSByb290Ll93YWl0aW5nRm9yO1xuICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICByZXR1cm4gcm9vdC5fd2FpdGluZ1F1ZXVlLnB1c2god3JhcChyZXNvbHZlLmJpbmQobnVsbCwgcmVzKSkpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHJldHVybiByb290Ll93YWl0aW5nUXVldWUucHVzaCh3cmFwKHJlamVjdC5iaW5kKG51bGwsIGVycikpKTtcbiAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChyb290Ll93YWl0aW5nRm9yID09PSBjdXJyZW50V2FpdFByb21pc2UpIHtcbiAgICAgICAgICByb290Ll93YWl0aW5nRm9yID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFjdGl2ZSAmJiB0aGlzLl9yZWplY3QobmV3IGV4Y2VwdGlvbnMuQWJvcnQoKSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS50YWJsZSA9IGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgIHZhciBtZW1vaXplZFRhYmxlcyA9IHRoaXMuX21lbW9pemVkVGFibGVzIHx8ICh0aGlzLl9tZW1vaXplZFRhYmxlcyA9IHt9KTtcbiAgICBpZiAoaGFzT3duKG1lbW9pemVkVGFibGVzLCB0YWJsZU5hbWUpKVxuICAgICAgcmV0dXJuIG1lbW9pemVkVGFibGVzW3RhYmxlTmFtZV07XG4gICAgdmFyIHRhYmxlU2NoZW1hID0gdGhpcy5zY2hlbWFbdGFibGVOYW1lXTtcbiAgICBpZiAoIXRhYmxlU2NoZW1hKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5Ob3RGb3VuZChcIlRhYmxlIFwiICsgdGFibGVOYW1lICsgXCIgbm90IHBhcnQgb2YgdHJhbnNhY3Rpb25cIik7XG4gICAgfVxuICAgIHZhciB0cmFuc2FjdGlvbkJvdW5kVGFibGUgPSBuZXcgdGhpcy5kYi5UYWJsZSh0YWJsZU5hbWUsIHRhYmxlU2NoZW1hLCB0aGlzKTtcbiAgICB0cmFuc2FjdGlvbkJvdW5kVGFibGUuY29yZSA9IHRoaXMuZGIuY29yZS50YWJsZSh0YWJsZU5hbWUpO1xuICAgIG1lbW9pemVkVGFibGVzW3RhYmxlTmFtZV0gPSB0cmFuc2FjdGlvbkJvdW5kVGFibGU7XG4gICAgcmV0dXJuIHRyYW5zYWN0aW9uQm91bmRUYWJsZTtcbiAgfTtcbiAgcmV0dXJuIFRyYW5zYWN0aW9uMjtcbn0oKTtcbmZ1bmN0aW9uIGNyZWF0ZVRyYW5zYWN0aW9uQ29uc3RydWN0b3IoZGIpIHtcbiAgcmV0dXJuIG1ha2VDbGFzc0NvbnN0cnVjdG9yKFRyYW5zYWN0aW9uLnByb3RvdHlwZSwgZnVuY3Rpb24gVHJhbnNhY3Rpb24yKG1vZGUsIHN0b3JlTmFtZXMsIGRic2NoZW1hLCBwYXJlbnQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMuc3RvcmVOYW1lcyA9IHN0b3JlTmFtZXM7XG4gICAgdGhpcy5zY2hlbWEgPSBkYnNjaGVtYTtcbiAgICB0aGlzLmlkYnRyYW5zID0gbnVsbDtcbiAgICB0aGlzLm9uID0gRXZlbnRzKHRoaXMsIFwiY29tcGxldGVcIiwgXCJlcnJvclwiLCBcImFib3J0XCIpO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50IHx8IG51bGw7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX3JlY3Vsb2NrID0gMDtcbiAgICB0aGlzLl9ibG9ja2VkRnVuY3MgPSBbXTtcbiAgICB0aGlzLl9yZXNvbHZlID0gbnVsbDtcbiAgICB0aGlzLl9yZWplY3QgPSBudWxsO1xuICAgIHRoaXMuX3dhaXRpbmdGb3IgPSBudWxsO1xuICAgIHRoaXMuX3dhaXRpbmdRdWV1ZSA9IG51bGw7XG4gICAgdGhpcy5fc3BpbkNvdW50ID0gMDtcbiAgICB0aGlzLl9jb21wbGV0aW9uID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIF90aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIF90aGlzLl9yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gICAgdGhpcy5fY29tcGxldGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgX3RoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICBfdGhpcy5vbi5jb21wbGV0ZS5maXJlKCk7XG4gICAgfSwgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIHdhc0FjdGl2ZSA9IF90aGlzLmFjdGl2ZTtcbiAgICAgIF90aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgX3RoaXMub24uZXJyb3IuZmlyZShlKTtcbiAgICAgIF90aGlzLnBhcmVudCA/IF90aGlzLnBhcmVudC5fcmVqZWN0KGUpIDogd2FzQWN0aXZlICYmIF90aGlzLmlkYnRyYW5zICYmIF90aGlzLmlkYnRyYW5zLmFib3J0KCk7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKGUpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUluZGV4U3BlYyhuYW1lLCBrZXlQYXRoLCB1bmlxdWUsIG11bHRpLCBhdXRvLCBjb21wb3VuZCwgaXNQcmltS2V5KSB7XG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBrZXlQYXRoLFxuICAgIHVuaXF1ZSxcbiAgICBtdWx0aSxcbiAgICBhdXRvLFxuICAgIGNvbXBvdW5kLFxuICAgIHNyYzogKHVuaXF1ZSAmJiAhaXNQcmltS2V5ID8gXCImXCIgOiBcIlwiKSArIChtdWx0aSA/IFwiKlwiIDogXCJcIikgKyAoYXV0byA/IFwiKytcIiA6IFwiXCIpICsgbmFtZUZyb21LZXlQYXRoKGtleVBhdGgpXG4gIH07XG59XG5mdW5jdGlvbiBuYW1lRnJvbUtleVBhdGgoa2V5UGF0aCkge1xuICByZXR1cm4gdHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIgPyBrZXlQYXRoIDoga2V5UGF0aCA/IFwiW1wiICsgW10uam9pbi5jYWxsKGtleVBhdGgsIFwiK1wiKSArIFwiXVwiIDogXCJcIjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRhYmxlU2NoZW1hKG5hbWUsIHByaW1LZXksIGluZGV4ZXMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHByaW1LZXksXG4gICAgaW5kZXhlcyxcbiAgICBtYXBwZWRDbGFzczogbnVsbCxcbiAgICBpZHhCeU5hbWU6IGFycmF5VG9PYmplY3QoaW5kZXhlcywgZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIHJldHVybiBbaW5kZXgubmFtZSwgaW5kZXhdO1xuICAgIH0pXG4gIH07XG59XG5mdW5jdGlvbiBnZXRLZXlFeHRyYWN0b3Ioa2V5UGF0aCkge1xuICBpZiAoa2V5UGF0aCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBrZXlQYXRoID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGdldFNpbmdsZVBhdGhLZXlFeHRyYWN0b3Ioa2V5UGF0aCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIGdldEJ5S2V5UGF0aChvYmosIGtleVBhdGgpO1xuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFNpbmdsZVBhdGhLZXlFeHRyYWN0b3Ioa2V5UGF0aCkge1xuICB2YXIgc3BsaXQgPSBrZXlQYXRoLnNwbGl0KFwiLlwiKTtcbiAgaWYgKHNwbGl0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmpba2V5UGF0aF07XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gZ2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCk7XG4gICAgfTtcbiAgfVxufVxuZnVuY3Rpb24gYXJyYXlpZnkoYXJyYXlMaWtlKSB7XG4gIHJldHVybiBbXS5zbGljZS5jYWxsKGFycmF5TGlrZSk7XG59XG52YXIgX2lkX2NvdW50ZXIgPSAwO1xuZnVuY3Rpb24gZ2V0S2V5UGF0aEFsaWFzKGtleVBhdGgpIHtcbiAgcmV0dXJuIGtleVBhdGggPT0gbnVsbCA/IFwiOmlkXCIgOiB0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIiA/IGtleVBhdGggOiBcIltcIiArIGtleVBhdGguam9pbihcIitcIikgKyBcIl1cIjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURCQ29yZShkYiwgaW5kZXhlZERCLCBJZGJLZXlSYW5nZSwgdG1wVHJhbnMpIHtcbiAgdmFyIGNtcDIgPSBpbmRleGVkREIuY21wLmJpbmQoaW5kZXhlZERCKTtcbiAgZnVuY3Rpb24gZXh0cmFjdFNjaGVtYShkYjIsIHRyYW5zKSB7XG4gICAgdmFyIHRhYmxlczIgPSBhcnJheWlmeShkYjIub2JqZWN0U3RvcmVOYW1lcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBuYW1lOiBkYjIubmFtZSxcbiAgICAgICAgdGFibGVzOiB0YWJsZXMyLm1hcChmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICAgIHJldHVybiB0cmFucy5vYmplY3RTdG9yZSh0YWJsZSk7XG4gICAgICAgIH0pLm1hcChmdW5jdGlvbihzdG9yZSkge1xuICAgICAgICAgIHZhciBrZXlQYXRoID0gc3RvcmUua2V5UGF0aCwgYXV0b0luY3JlbWVudCA9IHN0b3JlLmF1dG9JbmNyZW1lbnQ7XG4gICAgICAgICAgdmFyIGNvbXBvdW5kID0gaXNBcnJheShrZXlQYXRoKTtcbiAgICAgICAgICB2YXIgb3V0Ym91bmQgPSBrZXlQYXRoID09IG51bGw7XG4gICAgICAgICAgdmFyIGluZGV4QnlLZXlQYXRoID0ge307XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIG5hbWU6IHN0b3JlLm5hbWUsXG4gICAgICAgICAgICBwcmltYXJ5S2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICAgIGlzUHJpbWFyeUtleTogdHJ1ZSxcbiAgICAgICAgICAgICAgb3V0Ym91bmQsXG4gICAgICAgICAgICAgIGNvbXBvdW5kLFxuICAgICAgICAgICAgICBrZXlQYXRoLFxuICAgICAgICAgICAgICBhdXRvSW5jcmVtZW50LFxuICAgICAgICAgICAgICB1bmlxdWU6IHRydWUsXG4gICAgICAgICAgICAgIGV4dHJhY3RLZXk6IGdldEtleUV4dHJhY3RvcihrZXlQYXRoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZGV4ZXM6IGFycmF5aWZ5KHN0b3JlLmluZGV4TmFtZXMpLm1hcChmdW5jdGlvbihpbmRleE5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmluZGV4KGluZGV4TmFtZSk7XG4gICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgdmFyIG5hbWUgPSBpbmRleC5uYW1lLCB1bmlxdWUgPSBpbmRleC51bmlxdWUsIG11bHRpRW50cnkgPSBpbmRleC5tdWx0aUVudHJ5LCBrZXlQYXRoMiA9IGluZGV4LmtleVBhdGg7XG4gICAgICAgICAgICAgIHZhciBjb21wb3VuZDIgPSBpc0FycmF5KGtleVBhdGgyKTtcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdDIgPSB7XG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICBjb21wb3VuZDogY29tcG91bmQyLFxuICAgICAgICAgICAgICAgIGtleVBhdGg6IGtleVBhdGgyLFxuICAgICAgICAgICAgICAgIHVuaXF1ZSxcbiAgICAgICAgICAgICAgICBtdWx0aUVudHJ5LFxuICAgICAgICAgICAgICAgIGV4dHJhY3RLZXk6IGdldEtleUV4dHJhY3RvcihrZXlQYXRoMilcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaW5kZXhCeUtleVBhdGhbZ2V0S2V5UGF0aEFsaWFzKGtleVBhdGgyKV0gPSByZXN1bHQyO1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0MjtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZ2V0SW5kZXhCeUtleVBhdGg6IGZ1bmN0aW9uKGtleVBhdGgyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpbmRleEJ5S2V5UGF0aFtnZXRLZXlQYXRoQWxpYXMoa2V5UGF0aDIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGluZGV4QnlLZXlQYXRoW1wiOmlkXCJdID0gcmVzdWx0LnByaW1hcnlLZXk7XG4gICAgICAgICAgaWYgKGtleVBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5kZXhCeUtleVBhdGhbZ2V0S2V5UGF0aEFsaWFzKGtleVBhdGgpXSA9IHJlc3VsdC5wcmltYXJ5S2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGhhc0dldEFsbDogdGFibGVzMi5sZW5ndGggPiAwICYmIFwiZ2V0QWxsXCIgaW4gdHJhbnMub2JqZWN0U3RvcmUodGFibGVzMlswXSkgJiYgISh0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIC9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIS8oQ2hyb21lXFwvfEVkZ2VcXC8pLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIFtdLmNvbmNhdChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9TYWZhcmlcXC8oXFxkKikvKSlbMV0gPCA2MDQpXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlSURCS2V5UmFuZ2UocmFuZ2UpIHtcbiAgICBpZiAocmFuZ2UudHlwZSA9PT0gMylcbiAgICAgIHJldHVybiBudWxsO1xuICAgIGlmIChyYW5nZS50eXBlID09PSA0KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNvbnZlcnQgbmV2ZXIgdHlwZSB0byBJREJLZXlSYW5nZVwiKTtcbiAgICB2YXIgbG93ZXIgPSByYW5nZS5sb3dlciwgdXBwZXIgPSByYW5nZS51cHBlciwgbG93ZXJPcGVuID0gcmFuZ2UubG93ZXJPcGVuLCB1cHBlck9wZW4gPSByYW5nZS51cHBlck9wZW47XG4gICAgdmFyIGlkYlJhbmdlID0gbG93ZXIgPT09IHZvaWQgMCA/IHVwcGVyID09PSB2b2lkIDAgPyBudWxsIDogSWRiS2V5UmFuZ2UudXBwZXJCb3VuZCh1cHBlciwgISF1cHBlck9wZW4pIDogdXBwZXIgPT09IHZvaWQgMCA/IElkYktleVJhbmdlLmxvd2VyQm91bmQobG93ZXIsICEhbG93ZXJPcGVuKSA6IElkYktleVJhbmdlLmJvdW5kKGxvd2VyLCB1cHBlciwgISFsb3dlck9wZW4sICEhdXBwZXJPcGVuKTtcbiAgICByZXR1cm4gaWRiUmFuZ2U7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlRGJDb3JlVGFibGUodGFibGVTY2hlbWEpIHtcbiAgICB2YXIgdGFibGVOYW1lID0gdGFibGVTY2hlbWEubmFtZTtcbiAgICBmdW5jdGlvbiBtdXRhdGUoX2EzKSB7XG4gICAgICB2YXIgdHJhbnMgPSBfYTMudHJhbnMsIHR5cGUgPSBfYTMudHlwZSwga2V5czIgPSBfYTMua2V5cywgdmFsdWVzID0gX2EzLnZhbHVlcywgcmFuZ2UgPSBfYTMucmFuZ2U7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUgPSB3cmFwKHJlc29sdmUpO1xuICAgICAgICB2YXIgc3RvcmUgPSB0cmFucy5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICB2YXIgb3V0Ym91bmQgPSBzdG9yZS5rZXlQYXRoID09IG51bGw7XG4gICAgICAgIHZhciBpc0FkZE9yUHV0ID0gdHlwZSA9PT0gXCJwdXRcIiB8fCB0eXBlID09PSBcImFkZFwiO1xuICAgICAgICBpZiAoIWlzQWRkT3JQdXQgJiYgdHlwZSAhPT0gXCJkZWxldGVcIiAmJiB0eXBlICE9PSBcImRlbGV0ZVJhbmdlXCIpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBvcGVyYXRpb24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IChrZXlzMiB8fCB2YWx1ZXMgfHwge2xlbmd0aDogMX0pLmxlbmd0aDtcbiAgICAgICAgaWYgKGtleXMyICYmIHZhbHVlcyAmJiBrZXlzMi5sZW5ndGggIT09IHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBrZXlzIGFycmF5IG11c3QgaGF2ZSBzYW1lIGxlbmd0aCBhcyBnaXZlbiB2YWx1ZXMgYXJyYXkuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZW5ndGggPT09IDApXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoe251bUZhaWx1cmVzOiAwLCBmYWlsdXJlczoge30sIHJlc3VsdHM6IFtdLCBsYXN0UmVzdWx0OiB2b2lkIDB9KTtcbiAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgdmFyIHJlcXMgPSBbXTtcbiAgICAgICAgdmFyIGZhaWx1cmVzID0gW107XG4gICAgICAgIHZhciBudW1GYWlsdXJlcyA9IDA7XG4gICAgICAgIHZhciBlcnJvckhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICsrbnVtRmFpbHVyZXM7XG4gICAgICAgICAgcHJldmVudERlZmF1bHQoZXZlbnQpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZSA9PT0gXCJkZWxldGVSYW5nZVwiKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnR5cGUgPT09IDQpXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7bnVtRmFpbHVyZXMsIGZhaWx1cmVzLCByZXN1bHRzOiBbXSwgbGFzdFJlc3VsdDogdm9pZCAwfSk7XG4gICAgICAgICAgaWYgKHJhbmdlLnR5cGUgPT09IDMpXG4gICAgICAgICAgICByZXFzLnB1c2gocmVxID0gc3RvcmUuY2xlYXIoKSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVxcy5wdXNoKHJlcSA9IHN0b3JlLmRlbGV0ZShtYWtlSURCS2V5UmFuZ2UocmFuZ2UpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIF9hNCA9IGlzQWRkT3JQdXQgPyBvdXRib3VuZCA/IFt2YWx1ZXMsIGtleXMyXSA6IFt2YWx1ZXMsIG51bGxdIDogW2tleXMyLCBudWxsXSwgYXJnczEgPSBfYTRbMF0sIGFyZ3MyID0gX2E0WzFdO1xuICAgICAgICAgIGlmIChpc0FkZE9yUHV0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgIHJlcXMucHVzaChyZXEgPSBhcmdzMiAmJiBhcmdzMltpXSAhPT0gdm9pZCAwID8gc3RvcmVbdHlwZV0oYXJnczFbaV0sIGFyZ3MyW2ldKSA6IHN0b3JlW3R5cGVdKGFyZ3MxW2ldKSk7XG4gICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgIHJlcXMucHVzaChyZXEgPSBzdG9yZVt0eXBlXShhcmdzMVtpXSkpO1xuICAgICAgICAgICAgICByZXEub25lcnJvciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRvbmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHZhciBsYXN0UmVzdWx0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICByZXFzLmZvckVhY2goZnVuY3Rpb24ocmVxMiwgaTIpIHtcbiAgICAgICAgICAgIHJldHVybiByZXEyLmVycm9yICE9IG51bGwgJiYgKGZhaWx1cmVzW2kyXSA9IHJlcTIuZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgbnVtRmFpbHVyZXMsXG4gICAgICAgICAgICBmYWlsdXJlcyxcbiAgICAgICAgICAgIHJlc3VsdHM6IHR5cGUgPT09IFwiZGVsZXRlXCIgPyBrZXlzMiA6IHJlcXMubWFwKGZ1bmN0aW9uKHJlcTIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcTIucmVzdWx0O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBsYXN0UmVzdWx0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcS5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBlcnJvckhhbmRsZXIoZXZlbnQpO1xuICAgICAgICAgIGRvbmUoZXZlbnQpO1xuICAgICAgICB9O1xuICAgICAgICByZXEub25zdWNjZXNzID0gZG9uZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvcGVuQ3Vyc29yMihfYTMpIHtcbiAgICAgIHZhciB0cmFucyA9IF9hMy50cmFucywgdmFsdWVzID0gX2EzLnZhbHVlcywgcXVlcnkyID0gX2EzLnF1ZXJ5LCByZXZlcnNlID0gX2EzLnJldmVyc2UsIHVuaXF1ZSA9IF9hMy51bmlxdWU7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUgPSB3cmFwKHJlc29sdmUpO1xuICAgICAgICB2YXIgaW5kZXggPSBxdWVyeTIuaW5kZXgsIHJhbmdlID0gcXVlcnkyLnJhbmdlO1xuICAgICAgICB2YXIgc3RvcmUgPSB0cmFucy5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICB2YXIgc291cmNlID0gaW5kZXguaXNQcmltYXJ5S2V5ID8gc3RvcmUgOiBzdG9yZS5pbmRleChpbmRleC5uYW1lKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHJldmVyc2UgPyB1bmlxdWUgPyBcInByZXZ1bmlxdWVcIiA6IFwicHJldlwiIDogdW5pcXVlID8gXCJuZXh0dW5pcXVlXCIgOiBcIm5leHRcIjtcbiAgICAgICAgdmFyIHJlcSA9IHZhbHVlcyB8fCAhKFwib3BlbktleUN1cnNvclwiIGluIHNvdXJjZSkgPyBzb3VyY2Uub3BlbkN1cnNvcihtYWtlSURCS2V5UmFuZ2UocmFuZ2UpLCBkaXJlY3Rpb24pIDogc291cmNlLm9wZW5LZXlDdXJzb3IobWFrZUlEQktleVJhbmdlKHJhbmdlKSwgZGlyZWN0aW9uKTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9IHdyYXAoZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICB2YXIgY3Vyc29yID0gcmVxLnJlc3VsdDtcbiAgICAgICAgICBpZiAoIWN1cnNvcikge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3Vyc29yLl9fX2lkID0gKytfaWRfY291bnRlcjtcbiAgICAgICAgICBjdXJzb3IuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHZhciBfY3Vyc29yQ29udGludWUgPSBjdXJzb3IuY29udGludWUuYmluZChjdXJzb3IpO1xuICAgICAgICAgIHZhciBfY3Vyc29yQ29udGludWVQcmltYXJ5S2V5ID0gY3Vyc29yLmNvbnRpbnVlUHJpbWFyeUtleTtcbiAgICAgICAgICBpZiAoX2N1cnNvckNvbnRpbnVlUHJpbWFyeUtleSlcbiAgICAgICAgICAgIF9jdXJzb3JDb250aW51ZVByaW1hcnlLZXkgPSBfY3Vyc29yQ29udGludWVQcmltYXJ5S2V5LmJpbmQoY3Vyc29yKTtcbiAgICAgICAgICB2YXIgX2N1cnNvckFkdmFuY2UgPSBjdXJzb3IuYWR2YW5jZS5iaW5kKGN1cnNvcik7XG4gICAgICAgICAgdmFyIGRvVGhyb3dDdXJzb3JJc05vdFN0YXJ0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkN1cnNvciBub3Qgc3RhcnRlZFwiKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBkb1Rocm93Q3Vyc29ySXNTdG9wcGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDdXJzb3Igbm90IHN0b3BwZWRcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBjdXJzb3IudHJhbnMgPSB0cmFucztcbiAgICAgICAgICBjdXJzb3Iuc3RvcCA9IGN1cnNvci5jb250aW51ZSA9IGN1cnNvci5jb250aW51ZVByaW1hcnlLZXkgPSBjdXJzb3IuYWR2YW5jZSA9IGRvVGhyb3dDdXJzb3JJc05vdFN0YXJ0ZWQ7XG4gICAgICAgICAgY3Vyc29yLmZhaWwgPSB3cmFwKHJlamVjdCk7XG4gICAgICAgICAgY3Vyc29yLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ290T25lID0gMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZ290T25lLS0gPyBfdGhpcy5jb250aW51ZSgpIDogX3RoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBjdXJzb3Iuc3RhcnQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGl0ZXJhdGlvblByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlSXRlcmF0aW9uLCByZWplY3RJdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZUl0ZXJhdGlvbiA9IHdyYXAocmVzb2x2ZUl0ZXJhdGlvbik7XG4gICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdEl0ZXJhdGlvbik7XG4gICAgICAgICAgICAgIGN1cnNvci5mYWlsID0gcmVqZWN0SXRlcmF0aW9uO1xuICAgICAgICAgICAgICBjdXJzb3Iuc3RvcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29yLnN0b3AgPSBjdXJzb3IuY29udGludWUgPSBjdXJzb3IuY29udGludWVQcmltYXJ5S2V5ID0gY3Vyc29yLmFkdmFuY2UgPSBkb1Rocm93Q3Vyc29ySXNTdG9wcGVkO1xuICAgICAgICAgICAgICAgIHJlc29sdmVJdGVyYXRpb24odmFsdWUpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgZ3VhcmRlZENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmIChyZXEucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjdXJzb3IuZmFpbChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJzb3IuZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY3Vyc29yLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDdXJzb3IgYmVoaW5kIGxhc3QgZW50cnlcIik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjdXJzb3Iuc3RvcCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IHdyYXAoZnVuY3Rpb24oZXYyKSB7XG4gICAgICAgICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBndWFyZGVkQ2FsbGJhY2s7XG4gICAgICAgICAgICAgIGd1YXJkZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUgPSBfY3Vyc29yQ29udGludWU7XG4gICAgICAgICAgICBjdXJzb3IuY29udGludWVQcmltYXJ5S2V5ID0gX2N1cnNvckNvbnRpbnVlUHJpbWFyeUtleTtcbiAgICAgICAgICAgIGN1cnNvci5hZHZhbmNlID0gX2N1cnNvckFkdmFuY2U7XG4gICAgICAgICAgICBndWFyZGVkQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRpb25Qcm9taXNlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVzb2x2ZShjdXJzb3IpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHF1ZXJ5KGhhc0dldEFsbDIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICByZXNvbHZlID0gd3JhcChyZXNvbHZlKTtcbiAgICAgICAgICB2YXIgdHJhbnMgPSByZXF1ZXN0LnRyYW5zLCB2YWx1ZXMgPSByZXF1ZXN0LnZhbHVlcywgbGltaXQgPSByZXF1ZXN0LmxpbWl0LCBxdWVyeTIgPSByZXF1ZXN0LnF1ZXJ5O1xuICAgICAgICAgIHZhciBub25JbmZpbml0TGltaXQgPSBsaW1pdCA9PT0gSW5maW5pdHkgPyB2b2lkIDAgOiBsaW1pdDtcbiAgICAgICAgICB2YXIgaW5kZXggPSBxdWVyeTIuaW5kZXgsIHJhbmdlID0gcXVlcnkyLnJhbmdlO1xuICAgICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlTmFtZSk7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IGluZGV4LmlzUHJpbWFyeUtleSA/IHN0b3JlIDogc3RvcmUuaW5kZXgoaW5kZXgubmFtZSk7XG4gICAgICAgICAgdmFyIGlkYktleVJhbmdlID0gbWFrZUlEQktleVJhbmdlKHJhbmdlKTtcbiAgICAgICAgICBpZiAobGltaXQgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7cmVzdWx0OiBbXX0pO1xuICAgICAgICAgIGlmIChoYXNHZXRBbGwyKSB7XG4gICAgICAgICAgICB2YXIgcmVxID0gdmFsdWVzID8gc291cmNlLmdldEFsbChpZGJLZXlSYW5nZSwgbm9uSW5maW5pdExpbWl0KSA6IHNvdXJjZS5nZXRBbGxLZXlzKGlkYktleVJhbmdlLCBub25JbmZpbml0TGltaXQpO1xuICAgICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtyZXN1bHQ6IGV2ZW50LnRhcmdldC5yZXN1bHR9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY291bnRfMSA9IDA7XG4gICAgICAgICAgICB2YXIgcmVxXzEgPSB2YWx1ZXMgfHwgIShcIm9wZW5LZXlDdXJzb3JcIiBpbiBzb3VyY2UpID8gc291cmNlLm9wZW5DdXJzb3IoaWRiS2V5UmFuZ2UpIDogc291cmNlLm9wZW5LZXlDdXJzb3IoaWRiS2V5UmFuZ2UpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdF8xID0gW107XG4gICAgICAgICAgICByZXFfMS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICB2YXIgY3Vyc29yID0gcmVxXzEucmVzdWx0O1xuICAgICAgICAgICAgICBpZiAoIWN1cnNvcilcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7cmVzdWx0OiByZXN1bHRfMX0pO1xuICAgICAgICAgICAgICByZXN1bHRfMS5wdXNoKHZhbHVlcyA/IGN1cnNvci52YWx1ZSA6IGN1cnNvci5wcmltYXJ5S2V5KTtcbiAgICAgICAgICAgICAgaWYgKCsrY291bnRfMSA9PT0gbGltaXQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe3Jlc3VsdDogcmVzdWx0XzF9KTtcbiAgICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxXzEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdGFibGVOYW1lLFxuICAgICAgc2NoZW1hOiB0YWJsZVNjaGVtYSxcbiAgICAgIG11dGF0ZSxcbiAgICAgIGdldE1hbnk6IGZ1bmN0aW9uKF9hMykge1xuICAgICAgICB2YXIgdHJhbnMgPSBfYTMudHJhbnMsIGtleXMyID0gX2EzLmtleXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICByZXNvbHZlID0gd3JhcChyZXNvbHZlKTtcbiAgICAgICAgICB2YXIgc3RvcmUgPSB0cmFucy5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICAgIHZhciBsZW5ndGggPSBrZXlzMi5sZW5ndGg7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICAgIHZhciBrZXlDb3VudCA9IDA7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrQ291bnQgPSAwO1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgdmFyIHN1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciByZXEyID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgaWYgKChyZXN1bHRbcmVxMi5fcG9zXSA9IHJlcTIucmVzdWx0KSAhPSBudWxsKVxuICAgICAgICAgICAgICA7XG4gICAgICAgICAgICBpZiAoKytjYWxsYmFja0NvdW50ID09PSBrZXlDb3VudClcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIGVycm9ySGFuZGxlciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzMltpXTtcbiAgICAgICAgICAgIGlmIChrZXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXEgPSBzdG9yZS5nZXQoa2V5czJbaV0pO1xuICAgICAgICAgICAgICByZXEuX3BvcyA9IGk7XG4gICAgICAgICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBzdWNjZXNzSGFuZGxlcjtcbiAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSBlcnJvckhhbmRsZXI7XG4gICAgICAgICAgICAgICsra2V5Q291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChrZXlDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgdmFyIHRyYW5zID0gX2EzLnRyYW5zLCBrZXkgPSBfYTMua2V5O1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVzb2x2ZSA9IHdyYXAocmVzb2x2ZSk7XG4gICAgICAgICAgdmFyIHN0b3JlID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVOYW1lKTtcbiAgICAgICAgICB2YXIgcmVxID0gc3RvcmUuZ2V0KGtleSk7XG4gICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiBxdWVyeShoYXNHZXRBbGwpLFxuICAgICAgb3BlbkN1cnNvcjogb3BlbkN1cnNvcjIsXG4gICAgICBjb3VudDogZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgIHZhciBxdWVyeTIgPSBfYTMucXVlcnksIHRyYW5zID0gX2EzLnRyYW5zO1xuICAgICAgICB2YXIgaW5kZXggPSBxdWVyeTIuaW5kZXgsIHJhbmdlID0gcXVlcnkyLnJhbmdlO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgdmFyIHN0b3JlID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVOYW1lKTtcbiAgICAgICAgICB2YXIgc291cmNlID0gaW5kZXguaXNQcmltYXJ5S2V5ID8gc3RvcmUgOiBzdG9yZS5pbmRleChpbmRleC5uYW1lKTtcbiAgICAgICAgICB2YXIgaWRiS2V5UmFuZ2UgPSBtYWtlSURCS2V5UmFuZ2UocmFuZ2UpO1xuICAgICAgICAgIHZhciByZXEgPSBpZGJLZXlSYW5nZSA/IHNvdXJjZS5jb3VudChpZGJLZXlSYW5nZSkgOiBzb3VyY2UuY291bnQoKTtcbiAgICAgICAgICByZXEub25zdWNjZXNzID0gd3JhcChmdW5jdGlvbihldikge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZXYudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICB2YXIgX2EyID0gZXh0cmFjdFNjaGVtYShkYiwgdG1wVHJhbnMpLCBzY2hlbWEgPSBfYTIuc2NoZW1hLCBoYXNHZXRBbGwgPSBfYTIuaGFzR2V0QWxsO1xuICB2YXIgdGFibGVzID0gc2NoZW1hLnRhYmxlcy5tYXAoZnVuY3Rpb24odGFibGVTY2hlbWEpIHtcbiAgICByZXR1cm4gY3JlYXRlRGJDb3JlVGFibGUodGFibGVTY2hlbWEpO1xuICB9KTtcbiAgdmFyIHRhYmxlTWFwID0ge307XG4gIHRhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgcmV0dXJuIHRhYmxlTWFwW3RhYmxlLm5hbWVdID0gdGFibGU7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHN0YWNrOiBcImRiY29yZVwiLFxuICAgIHRyYW5zYWN0aW9uOiBkYi50cmFuc2FjdGlvbi5iaW5kKGRiKSxcbiAgICB0YWJsZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRhYmxlTWFwW25hbWVdO1xuICAgICAgaWYgKCFyZXN1bHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRhYmxlICdcIiArIG5hbWUgKyBcIicgbm90IGZvdW5kXCIpO1xuICAgICAgcmV0dXJuIHRhYmxlTWFwW25hbWVdO1xuICAgIH0sXG4gICAgY21wOiBjbXAyLFxuICAgIE1JTl9LRVk6IC1JbmZpbml0eSxcbiAgICBNQVhfS0VZOiBnZXRNYXhLZXkoSWRiS2V5UmFuZ2UpLFxuICAgIHNjaGVtYVxuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlTWlkZGxld2FyZVN0YWNrKHN0YWNrSW1wbCwgbWlkZGxld2FyZXMpIHtcbiAgcmV0dXJuIG1pZGRsZXdhcmVzLnJlZHVjZShmdW5jdGlvbihkb3duLCBfYTIpIHtcbiAgICB2YXIgY3JlYXRlID0gX2EyLmNyZWF0ZTtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGRvd24pLCBjcmVhdGUoZG93bikpO1xuICB9LCBzdGFja0ltcGwpO1xufVxuZnVuY3Rpb24gY3JlYXRlTWlkZGxld2FyZVN0YWNrcyhtaWRkbGV3YXJlcywgaWRiZGIsIF9hMiwgdG1wVHJhbnMpIHtcbiAgdmFyIElEQktleVJhbmdlID0gX2EyLklEQktleVJhbmdlLCBpbmRleGVkREIgPSBfYTIuaW5kZXhlZERCO1xuICB2YXIgZGJjb3JlID0gY3JlYXRlTWlkZGxld2FyZVN0YWNrKGNyZWF0ZURCQ29yZShpZGJkYiwgaW5kZXhlZERCLCBJREJLZXlSYW5nZSwgdG1wVHJhbnMpLCBtaWRkbGV3YXJlcy5kYmNvcmUpO1xuICByZXR1cm4ge1xuICAgIGRiY29yZVxuICB9O1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVNaWRkbGV3YXJlU3RhY2tzKGRiLCB0bXBUcmFucykge1xuICB2YXIgaWRiZGIgPSB0bXBUcmFucy5kYjtcbiAgdmFyIHN0YWNrcyA9IGNyZWF0ZU1pZGRsZXdhcmVTdGFja3MoZGIuX21pZGRsZXdhcmVzLCBpZGJkYiwgZGIuX2RlcHMsIHRtcFRyYW5zKTtcbiAgZGIuY29yZSA9IHN0YWNrcy5kYmNvcmU7XG4gIGRiLnRhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgdmFyIHRhYmxlTmFtZSA9IHRhYmxlLm5hbWU7XG4gICAgaWYgKGRiLmNvcmUuc2NoZW1hLnRhYmxlcy5zb21lKGZ1bmN0aW9uKHRibCkge1xuICAgICAgcmV0dXJuIHRibC5uYW1lID09PSB0YWJsZU5hbWU7XG4gICAgfSkpIHtcbiAgICAgIHRhYmxlLmNvcmUgPSBkYi5jb3JlLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgICBpZiAoZGJbdGFibGVOYW1lXSBpbnN0YW5jZW9mIGRiLlRhYmxlKSB7XG4gICAgICAgIGRiW3RhYmxlTmFtZV0uY29yZSA9IHRhYmxlLmNvcmU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHNldEFwaU9uUGxhY2UoZGIsIG9ianMsIHRhYmxlTmFtZXMsIGRic2NoZW1hKSB7XG4gIHRhYmxlTmFtZXMuZm9yRWFjaChmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICB2YXIgc2NoZW1hID0gZGJzY2hlbWFbdGFibGVOYW1lXTtcbiAgICBvYmpzLmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgcHJvcERlc2MgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCB0YWJsZU5hbWUpO1xuICAgICAgaWYgKCFwcm9wRGVzYyB8fCBcInZhbHVlXCIgaW4gcHJvcERlc2MgJiYgcHJvcERlc2MudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICBpZiAob2JqID09PSBkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGUgfHwgb2JqIGluc3RhbmNlb2YgZGIuVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICBzZXRQcm9wKG9iaiwgdGFibGVOYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50YWJsZSh0YWJsZU5hbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgdGFibGVOYW1lLCB7dmFsdWUsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IHRydWV9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmpbdGFibGVOYW1lXSA9IG5ldyBkYi5UYWJsZSh0YWJsZU5hbWUsIHNjaGVtYSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiByZW1vdmVUYWJsZXNBcGkoZGIsIG9ianMpIHtcbiAgb2Jqcy5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmpba2V5XSBpbnN0YW5jZW9mIGRiLlRhYmxlKVxuICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGxvd2VyVmVyc2lvbkZpcnN0KGEsIGIpIHtcbiAgcmV0dXJuIGEuX2NmZy52ZXJzaW9uIC0gYi5fY2ZnLnZlcnNpb247XG59XG5mdW5jdGlvbiBydW5VcGdyYWRlcnMoZGIsIG9sZFZlcnNpb24sIGlkYlVwZ3JhZGVUcmFucywgcmVqZWN0KSB7XG4gIHZhciBnbG9iYWxTY2hlbWEgPSBkYi5fZGJTY2hlbWE7XG4gIHZhciB0cmFucyA9IGRiLl9jcmVhdGVUcmFuc2FjdGlvbihcInJlYWR3cml0ZVwiLCBkYi5fc3RvcmVOYW1lcywgZ2xvYmFsU2NoZW1hKTtcbiAgdHJhbnMuY3JlYXRlKGlkYlVwZ3JhZGVUcmFucyk7XG4gIHRyYW5zLl9jb21wbGV0aW9uLmNhdGNoKHJlamVjdCk7XG4gIHZhciByZWplY3RUcmFuc2FjdGlvbiA9IHRyYW5zLl9yZWplY3QuYmluZCh0cmFucyk7XG4gIHZhciB0cmFuc2xlc3MgPSBQU0QudHJhbnNsZXNzIHx8IFBTRDtcbiAgbmV3U2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgUFNELnRyYW5zID0gdHJhbnM7XG4gICAgUFNELnRyYW5zbGVzcyA9IHRyYW5zbGVzcztcbiAgICBpZiAob2xkVmVyc2lvbiA9PT0gMCkge1xuICAgICAga2V5cyhnbG9iYWxTY2hlbWEpLmZvckVhY2goZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgICAgIGNyZWF0ZVRhYmxlKGlkYlVwZ3JhZGVUcmFucywgdGFibGVOYW1lLCBnbG9iYWxTY2hlbWFbdGFibGVOYW1lXS5wcmltS2V5LCBnbG9iYWxTY2hlbWFbdGFibGVOYW1lXS5pbmRleGVzKTtcbiAgICAgIH0pO1xuICAgICAgZ2VuZXJhdGVNaWRkbGV3YXJlU3RhY2tzKGRiLCBpZGJVcGdyYWRlVHJhbnMpO1xuICAgICAgRGV4aWVQcm9taXNlLmZvbGxvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGRiLm9uLnBvcHVsYXRlLmZpcmUodHJhbnMpO1xuICAgICAgfSkuY2F0Y2gocmVqZWN0VHJhbnNhY3Rpb24pO1xuICAgIH0gZWxzZVxuICAgICAgdXBkYXRlVGFibGVzQW5kSW5kZXhlcyhkYiwgb2xkVmVyc2lvbiwgdHJhbnMsIGlkYlVwZ3JhZGVUcmFucykuY2F0Y2gocmVqZWN0VHJhbnNhY3Rpb24pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVRhYmxlc0FuZEluZGV4ZXMoZGIsIG9sZFZlcnNpb24sIHRyYW5zLCBpZGJVcGdyYWRlVHJhbnMpIHtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciB2ZXJzaW9ucyA9IGRiLl92ZXJzaW9ucztcbiAgdmFyIGdsb2JhbFNjaGVtYSA9IGRiLl9kYlNjaGVtYSA9IGJ1aWxkR2xvYmFsU2NoZW1hKGRiLCBkYi5pZGJkYiwgaWRiVXBncmFkZVRyYW5zKTtcbiAgdmFyIGFueUNvbnRlbnRVcGdyYWRlckhhc1J1biA9IGZhbHNlO1xuICB2YXIgdmVyc1RvUnVuID0gdmVyc2lvbnMuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdi5fY2ZnLnZlcnNpb24gPj0gb2xkVmVyc2lvbjtcbiAgfSk7XG4gIHZlcnNUb1J1bi5mb3JFYWNoKGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9sZFNjaGVtYSA9IGdsb2JhbFNjaGVtYTtcbiAgICAgIHZhciBuZXdTY2hlbWEgPSB2ZXJzaW9uLl9jZmcuZGJzY2hlbWE7XG4gICAgICBhZGp1c3RUb0V4aXN0aW5nSW5kZXhOYW1lcyhkYiwgb2xkU2NoZW1hLCBpZGJVcGdyYWRlVHJhbnMpO1xuICAgICAgYWRqdXN0VG9FeGlzdGluZ0luZGV4TmFtZXMoZGIsIG5ld1NjaGVtYSwgaWRiVXBncmFkZVRyYW5zKTtcbiAgICAgIGdsb2JhbFNjaGVtYSA9IGRiLl9kYlNjaGVtYSA9IG5ld1NjaGVtYTtcbiAgICAgIHZhciBkaWZmID0gZ2V0U2NoZW1hRGlmZihvbGRTY2hlbWEsIG5ld1NjaGVtYSk7XG4gICAgICBkaWZmLmFkZC5mb3JFYWNoKGZ1bmN0aW9uKHR1cGxlKSB7XG4gICAgICAgIGNyZWF0ZVRhYmxlKGlkYlVwZ3JhZGVUcmFucywgdHVwbGVbMF0sIHR1cGxlWzFdLnByaW1LZXksIHR1cGxlWzFdLmluZGV4ZXMpO1xuICAgICAgfSk7XG4gICAgICBkaWZmLmNoYW5nZS5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5nZSkge1xuICAgICAgICBpZiAoY2hhbmdlLnJlY3JlYXRlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuVXBncmFkZShcIk5vdCB5ZXQgc3VwcG9ydCBmb3IgY2hhbmdpbmcgcHJpbWFyeSBrZXlcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHN0b3JlXzEgPSBpZGJVcGdyYWRlVHJhbnMub2JqZWN0U3RvcmUoY2hhbmdlLm5hbWUpO1xuICAgICAgICAgIGNoYW5nZS5hZGQuZm9yRWFjaChmdW5jdGlvbihpZHgpIHtcbiAgICAgICAgICAgIHJldHVybiBhZGRJbmRleChzdG9yZV8xLCBpZHgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNoYW5nZS5jaGFuZ2UuZm9yRWFjaChmdW5jdGlvbihpZHgpIHtcbiAgICAgICAgICAgIHN0b3JlXzEuZGVsZXRlSW5kZXgoaWR4Lm5hbWUpO1xuICAgICAgICAgICAgYWRkSW5kZXgoc3RvcmVfMSwgaWR4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjaGFuZ2UuZGVsLmZvckVhY2goZnVuY3Rpb24oaWR4TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlXzEuZGVsZXRlSW5kZXgoaWR4TmFtZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGNvbnRlbnRVcGdyYWRlID0gdmVyc2lvbi5fY2ZnLmNvbnRlbnRVcGdyYWRlO1xuICAgICAgaWYgKGNvbnRlbnRVcGdyYWRlICYmIHZlcnNpb24uX2NmZy52ZXJzaW9uID4gb2xkVmVyc2lvbikge1xuICAgICAgICBnZW5lcmF0ZU1pZGRsZXdhcmVTdGFja3MoZGIsIGlkYlVwZ3JhZGVUcmFucyk7XG4gICAgICAgIHRyYW5zLl9tZW1vaXplZFRhYmxlcyA9IHt9O1xuICAgICAgICBhbnlDb250ZW50VXBncmFkZXJIYXNSdW4gPSB0cnVlO1xuICAgICAgICB2YXIgdXBncmFkZVNjaGVtYV8xID0gc2hhbGxvd0Nsb25lKG5ld1NjaGVtYSk7XG4gICAgICAgIGRpZmYuZGVsLmZvckVhY2goZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgICB1cGdyYWRlU2NoZW1hXzFbdGFibGVdID0gb2xkU2NoZW1hW3RhYmxlXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZVRhYmxlc0FwaShkYiwgW2RiLlRyYW5zYWN0aW9uLnByb3RvdHlwZV0pO1xuICAgICAgICBzZXRBcGlPblBsYWNlKGRiLCBbZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlXSwga2V5cyh1cGdyYWRlU2NoZW1hXzEpLCB1cGdyYWRlU2NoZW1hXzEpO1xuICAgICAgICB0cmFucy5zY2hlbWEgPSB1cGdyYWRlU2NoZW1hXzE7XG4gICAgICAgIHZhciBjb250ZW50VXBncmFkZUlzQXN5bmNfMSA9IGlzQXN5bmNGdW5jdGlvbihjb250ZW50VXBncmFkZSk7XG4gICAgICAgIGlmIChjb250ZW50VXBncmFkZUlzQXN5bmNfMSkge1xuICAgICAgICAgIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldHVyblZhbHVlXzE7XG4gICAgICAgIHZhciBwcm9taXNlRm9sbG93ZWQgPSBEZXhpZVByb21pc2UuZm9sbG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVyblZhbHVlXzEgPSBjb250ZW50VXBncmFkZSh0cmFucyk7XG4gICAgICAgICAgaWYgKHJldHVyblZhbHVlXzEpIHtcbiAgICAgICAgICAgIGlmIChjb250ZW50VXBncmFkZUlzQXN5bmNfMSkge1xuICAgICAgICAgICAgICB2YXIgZGVjcmVtZW50b3IgPSBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cy5iaW5kKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICByZXR1cm5WYWx1ZV8xLnRoZW4oZGVjcmVtZW50b3IsIGRlY3JlbWVudG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWVfMSAmJiB0eXBlb2YgcmV0dXJuVmFsdWVfMS50aGVuID09PSBcImZ1bmN0aW9uXCIgPyBEZXhpZVByb21pc2UucmVzb2x2ZShyZXR1cm5WYWx1ZV8xKSA6IHByb21pc2VGb2xsb3dlZC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZV8xO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBxdWV1ZS5wdXNoKGZ1bmN0aW9uKGlkYnRyYW5zKSB7XG4gICAgICBpZiAoIWFueUNvbnRlbnRVcGdyYWRlckhhc1J1biB8fCAhaGFzSUVEZWxldGVPYmplY3RTdG9yZUJ1Zykge1xuICAgICAgICB2YXIgbmV3U2NoZW1hID0gdmVyc2lvbi5fY2ZnLmRic2NoZW1hO1xuICAgICAgICBkZWxldGVSZW1vdmVkVGFibGVzKG5ld1NjaGVtYSwgaWRidHJhbnMpO1xuICAgICAgfVxuICAgICAgcmVtb3ZlVGFibGVzQXBpKGRiLCBbZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlXSk7XG4gICAgICBzZXRBcGlPblBsYWNlKGRiLCBbZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlXSwgZGIuX3N0b3JlTmFtZXMsIGRiLl9kYlNjaGVtYSk7XG4gICAgICB0cmFucy5zY2hlbWEgPSBkYi5fZGJTY2hlbWE7XG4gICAgfSk7XG4gIH0pO1xuICBmdW5jdGlvbiBydW5RdWV1ZSgpIHtcbiAgICByZXR1cm4gcXVldWUubGVuZ3RoID8gRGV4aWVQcm9taXNlLnJlc29sdmUocXVldWUuc2hpZnQoKSh0cmFucy5pZGJ0cmFucykpLnRoZW4ocnVuUXVldWUpIDogRGV4aWVQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICByZXR1cm4gcnVuUXVldWUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIGNyZWF0ZU1pc3NpbmdUYWJsZXMoZ2xvYmFsU2NoZW1hLCBpZGJVcGdyYWRlVHJhbnMpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldFNjaGVtYURpZmYob2xkU2NoZW1hLCBuZXdTY2hlbWEpIHtcbiAgdmFyIGRpZmYgPSB7XG4gICAgZGVsOiBbXSxcbiAgICBhZGQ6IFtdLFxuICAgIGNoYW5nZTogW11cbiAgfTtcbiAgdmFyIHRhYmxlO1xuICBmb3IgKHRhYmxlIGluIG9sZFNjaGVtYSkge1xuICAgIGlmICghbmV3U2NoZW1hW3RhYmxlXSlcbiAgICAgIGRpZmYuZGVsLnB1c2godGFibGUpO1xuICB9XG4gIGZvciAodGFibGUgaW4gbmV3U2NoZW1hKSB7XG4gICAgdmFyIG9sZERlZiA9IG9sZFNjaGVtYVt0YWJsZV0sIG5ld0RlZiA9IG5ld1NjaGVtYVt0YWJsZV07XG4gICAgaWYgKCFvbGREZWYpIHtcbiAgICAgIGRpZmYuYWRkLnB1c2goW3RhYmxlLCBuZXdEZWZdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgbmFtZTogdGFibGUsXG4gICAgICAgIGRlZjogbmV3RGVmLFxuICAgICAgICByZWNyZWF0ZTogZmFsc2UsXG4gICAgICAgIGRlbDogW10sXG4gICAgICAgIGFkZDogW10sXG4gICAgICAgIGNoYW5nZTogW11cbiAgICAgIH07XG4gICAgICBpZiAoXCJcIiArIChvbGREZWYucHJpbUtleS5rZXlQYXRoIHx8IFwiXCIpICE9PSBcIlwiICsgKG5ld0RlZi5wcmltS2V5LmtleVBhdGggfHwgXCJcIikgfHwgb2xkRGVmLnByaW1LZXkuYXV0byAhPT0gbmV3RGVmLnByaW1LZXkuYXV0byAmJiAhaXNJRU9yRWRnZSkge1xuICAgICAgICBjaGFuZ2UucmVjcmVhdGUgPSB0cnVlO1xuICAgICAgICBkaWZmLmNoYW5nZS5wdXNoKGNoYW5nZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb2xkSW5kZXhlcyA9IG9sZERlZi5pZHhCeU5hbWU7XG4gICAgICAgIHZhciBuZXdJbmRleGVzID0gbmV3RGVmLmlkeEJ5TmFtZTtcbiAgICAgICAgdmFyIGlkeE5hbWUgPSB2b2lkIDA7XG4gICAgICAgIGZvciAoaWR4TmFtZSBpbiBvbGRJbmRleGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdJbmRleGVzW2lkeE5hbWVdKVxuICAgICAgICAgICAgY2hhbmdlLmRlbC5wdXNoKGlkeE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaWR4TmFtZSBpbiBuZXdJbmRleGVzKSB7XG4gICAgICAgICAgdmFyIG9sZElkeCA9IG9sZEluZGV4ZXNbaWR4TmFtZV0sIG5ld0lkeCA9IG5ld0luZGV4ZXNbaWR4TmFtZV07XG4gICAgICAgICAgaWYgKCFvbGRJZHgpXG4gICAgICAgICAgICBjaGFuZ2UuYWRkLnB1c2gobmV3SWR4KTtcbiAgICAgICAgICBlbHNlIGlmIChvbGRJZHguc3JjICE9PSBuZXdJZHguc3JjKVxuICAgICAgICAgICAgY2hhbmdlLmNoYW5nZS5wdXNoKG5ld0lkeCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZS5kZWwubGVuZ3RoID4gMCB8fCBjaGFuZ2UuYWRkLmxlbmd0aCA+IDAgfHwgY2hhbmdlLmNoYW5nZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGlmZi5jaGFuZ2UucHVzaChjaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkaWZmO1xufVxuZnVuY3Rpb24gY3JlYXRlVGFibGUoaWRidHJhbnMsIHRhYmxlTmFtZSwgcHJpbUtleSwgaW5kZXhlcykge1xuICB2YXIgc3RvcmUgPSBpZGJ0cmFucy5kYi5jcmVhdGVPYmplY3RTdG9yZSh0YWJsZU5hbWUsIHByaW1LZXkua2V5UGF0aCA/IHtrZXlQYXRoOiBwcmltS2V5LmtleVBhdGgsIGF1dG9JbmNyZW1lbnQ6IHByaW1LZXkuYXV0b30gOiB7YXV0b0luY3JlbWVudDogcHJpbUtleS5hdXRvfSk7XG4gIGluZGV4ZXMuZm9yRWFjaChmdW5jdGlvbihpZHgpIHtcbiAgICByZXR1cm4gYWRkSW5kZXgoc3RvcmUsIGlkeCk7XG4gIH0pO1xuICByZXR1cm4gc3RvcmU7XG59XG5mdW5jdGlvbiBjcmVhdGVNaXNzaW5nVGFibGVzKG5ld1NjaGVtYSwgaWRidHJhbnMpIHtcbiAga2V5cyhuZXdTY2hlbWEpLmZvckVhY2goZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgaWYgKCFpZGJ0cmFucy5kYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHRhYmxlTmFtZSkpIHtcbiAgICAgIGNyZWF0ZVRhYmxlKGlkYnRyYW5zLCB0YWJsZU5hbWUsIG5ld1NjaGVtYVt0YWJsZU5hbWVdLnByaW1LZXksIG5ld1NjaGVtYVt0YWJsZU5hbWVdLmluZGV4ZXMpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBkZWxldGVSZW1vdmVkVGFibGVzKG5ld1NjaGVtYSwgaWRidHJhbnMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZGJ0cmFucy5kYi5vYmplY3RTdG9yZU5hbWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHN0b3JlTmFtZSA9IGlkYnRyYW5zLmRiLm9iamVjdFN0b3JlTmFtZXNbaV07XG4gICAgaWYgKG5ld1NjaGVtYVtzdG9yZU5hbWVdID09IG51bGwpIHtcbiAgICAgIGlkYnRyYW5zLmRiLmRlbGV0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBhZGRJbmRleChzdG9yZSwgaWR4KSB7XG4gIHN0b3JlLmNyZWF0ZUluZGV4KGlkeC5uYW1lLCBpZHgua2V5UGF0aCwge3VuaXF1ZTogaWR4LnVuaXF1ZSwgbXVsdGlFbnRyeTogaWR4Lm11bHRpfSk7XG59XG5mdW5jdGlvbiBidWlsZEdsb2JhbFNjaGVtYShkYiwgaWRiZGIsIHRtcFRyYW5zKSB7XG4gIHZhciBnbG9iYWxTY2hlbWEgPSB7fTtcbiAgdmFyIGRiU3RvcmVOYW1lcyA9IHNsaWNlKGlkYmRiLm9iamVjdFN0b3JlTmFtZXMsIDApO1xuICBkYlN0b3JlTmFtZXMuZm9yRWFjaChmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICB2YXIgc3RvcmUgPSB0bXBUcmFucy5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIHZhciBrZXlQYXRoID0gc3RvcmUua2V5UGF0aDtcbiAgICB2YXIgcHJpbUtleSA9IGNyZWF0ZUluZGV4U3BlYyhuYW1lRnJvbUtleVBhdGgoa2V5UGF0aCksIGtleVBhdGggfHwgXCJcIiwgZmFsc2UsIGZhbHNlLCAhIXN0b3JlLmF1dG9JbmNyZW1lbnQsIGtleVBhdGggJiYgdHlwZW9mIGtleVBhdGggIT09IFwic3RyaW5nXCIsIHRydWUpO1xuICAgIHZhciBpbmRleGVzID0gW107XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdG9yZS5pbmRleE5hbWVzLmxlbmd0aDsgKytqKSB7XG4gICAgICB2YXIgaWRiaW5kZXggPSBzdG9yZS5pbmRleChzdG9yZS5pbmRleE5hbWVzW2pdKTtcbiAgICAgIGtleVBhdGggPSBpZGJpbmRleC5rZXlQYXRoO1xuICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXhTcGVjKGlkYmluZGV4Lm5hbWUsIGtleVBhdGgsICEhaWRiaW5kZXgudW5pcXVlLCAhIWlkYmluZGV4Lm11bHRpRW50cnksIGZhbHNlLCBrZXlQYXRoICYmIHR5cGVvZiBrZXlQYXRoICE9PSBcInN0cmluZ1wiLCBmYWxzZSk7XG4gICAgICBpbmRleGVzLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgICBnbG9iYWxTY2hlbWFbc3RvcmVOYW1lXSA9IGNyZWF0ZVRhYmxlU2NoZW1hKHN0b3JlTmFtZSwgcHJpbUtleSwgaW5kZXhlcyk7XG4gIH0pO1xuICByZXR1cm4gZ2xvYmFsU2NoZW1hO1xufVxuZnVuY3Rpb24gcmVhZEdsb2JhbFNjaGVtYShkYiwgaWRiZGIsIHRtcFRyYW5zKSB7XG4gIGRiLnZlcm5vID0gaWRiZGIudmVyc2lvbiAvIDEwO1xuICB2YXIgZ2xvYmFsU2NoZW1hID0gZGIuX2RiU2NoZW1hID0gYnVpbGRHbG9iYWxTY2hlbWEoZGIsIGlkYmRiLCB0bXBUcmFucyk7XG4gIGRiLl9zdG9yZU5hbWVzID0gc2xpY2UoaWRiZGIub2JqZWN0U3RvcmVOYW1lcywgMCk7XG4gIHNldEFwaU9uUGxhY2UoZGIsIFtkYi5fYWxsVGFibGVzXSwga2V5cyhnbG9iYWxTY2hlbWEpLCBnbG9iYWxTY2hlbWEpO1xufVxuZnVuY3Rpb24gdmVyaWZ5SW5zdGFsbGVkU2NoZW1hKGRiLCB0bXBUcmFucykge1xuICB2YXIgaW5zdGFsbGVkU2NoZW1hID0gYnVpbGRHbG9iYWxTY2hlbWEoZGIsIGRiLmlkYmRiLCB0bXBUcmFucyk7XG4gIHZhciBkaWZmID0gZ2V0U2NoZW1hRGlmZihpbnN0YWxsZWRTY2hlbWEsIGRiLl9kYlNjaGVtYSk7XG4gIHJldHVybiAhKGRpZmYuYWRkLmxlbmd0aCB8fCBkaWZmLmNoYW5nZS5zb21lKGZ1bmN0aW9uKGNoKSB7XG4gICAgcmV0dXJuIGNoLmFkZC5sZW5ndGggfHwgY2guY2hhbmdlLmxlbmd0aDtcbiAgfSkpO1xufVxuZnVuY3Rpb24gYWRqdXN0VG9FeGlzdGluZ0luZGV4TmFtZXMoZGIsIHNjaGVtYSwgaWRidHJhbnMpIHtcbiAgdmFyIHN0b3JlTmFtZXMgPSBpZGJ0cmFucy5kYi5vYmplY3RTdG9yZU5hbWVzO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlTmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgc3RvcmVOYW1lID0gc3RvcmVOYW1lc1tpXTtcbiAgICB2YXIgc3RvcmUgPSBpZGJ0cmFucy5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIGRiLl9oYXNHZXRBbGwgPSBcImdldEFsbFwiIGluIHN0b3JlO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3RvcmUuaW5kZXhOYW1lcy5sZW5ndGg7ICsraikge1xuICAgICAgdmFyIGluZGV4TmFtZSA9IHN0b3JlLmluZGV4TmFtZXNbal07XG4gICAgICB2YXIga2V5UGF0aCA9IHN0b3JlLmluZGV4KGluZGV4TmFtZSkua2V5UGF0aDtcbiAgICAgIHZhciBkZXhpZU5hbWUgPSB0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIiA/IGtleVBhdGggOiBcIltcIiArIHNsaWNlKGtleVBhdGgpLmpvaW4oXCIrXCIpICsgXCJdXCI7XG4gICAgICBpZiAoc2NoZW1hW3N0b3JlTmFtZV0pIHtcbiAgICAgICAgdmFyIGluZGV4U3BlYyA9IHNjaGVtYVtzdG9yZU5hbWVdLmlkeEJ5TmFtZVtkZXhpZU5hbWVdO1xuICAgICAgICBpZiAoaW5kZXhTcGVjKSB7XG4gICAgICAgICAgaW5kZXhTcGVjLm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgICAgZGVsZXRlIHNjaGVtYVtzdG9yZU5hbWVdLmlkeEJ5TmFtZVtkZXhpZU5hbWVdO1xuICAgICAgICAgIHNjaGVtYVtzdG9yZU5hbWVdLmlkeEJ5TmFtZVtpbmRleE5hbWVdID0gaW5kZXhTcGVjO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIC9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIS8oQ2hyb21lXFwvfEVkZ2VcXC8pLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIF9nbG9iYWwuV29ya2VyR2xvYmFsU2NvcGUgJiYgX2dsb2JhbCBpbnN0YW5jZW9mIF9nbG9iYWwuV29ya2VyR2xvYmFsU2NvcGUgJiYgW10uY29uY2F0KG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1NhZmFyaVxcLyhcXGQqKS8pKVsxXSA8IDYwNCkge1xuICAgIGRiLl9oYXNHZXRBbGwgPSBmYWxzZTtcbiAgfVxufVxuZnVuY3Rpb24gcGFyc2VJbmRleFN5bnRheChwcmltS2V5QW5kSW5kZXhlcykge1xuICByZXR1cm4gcHJpbUtleUFuZEluZGV4ZXMuc3BsaXQoXCIsXCIpLm1hcChmdW5jdGlvbihpbmRleCwgaW5kZXhOdW0pIHtcbiAgICBpbmRleCA9IGluZGV4LnRyaW0oKTtcbiAgICB2YXIgbmFtZSA9IGluZGV4LnJlcGxhY2UoLyhbJipdfFxcK1xcKykvZywgXCJcIik7XG4gICAgdmFyIGtleVBhdGggPSAvXlxcWy8udGVzdChuYW1lKSA/IG5hbWUubWF0Y2goL15cXFsoLiopXFxdJC8pWzFdLnNwbGl0KFwiK1wiKSA6IG5hbWU7XG4gICAgcmV0dXJuIGNyZWF0ZUluZGV4U3BlYyhuYW1lLCBrZXlQYXRoIHx8IG51bGwsIC9cXCYvLnRlc3QoaW5kZXgpLCAvXFwqLy50ZXN0KGluZGV4KSwgL1xcK1xcKy8udGVzdChpbmRleCksIGlzQXJyYXkoa2V5UGF0aCksIGluZGV4TnVtID09PSAwKTtcbiAgfSk7XG59XG52YXIgVmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBWZXJzaW9uMigpIHtcbiAgfVxuICBWZXJzaW9uMi5wcm90b3R5cGUuX3BhcnNlU3RvcmVzU3BlYyA9IGZ1bmN0aW9uKHN0b3Jlcywgb3V0U2NoZW1hKSB7XG4gICAga2V5cyhzdG9yZXMpLmZvckVhY2goZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgICBpZiAoc3RvcmVzW3RhYmxlTmFtZV0gIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ZXMgPSBwYXJzZUluZGV4U3ludGF4KHN0b3Jlc1t0YWJsZU5hbWVdKTtcbiAgICAgICAgdmFyIHByaW1LZXkgPSBpbmRleGVzLnNoaWZ0KCk7XG4gICAgICAgIGlmIChwcmltS2V5Lm11bHRpKVxuICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlNjaGVtYShcIlByaW1hcnkga2V5IGNhbm5vdCBiZSBtdWx0aS12YWx1ZWRcIik7XG4gICAgICAgIGluZGV4ZXMuZm9yRWFjaChmdW5jdGlvbihpZHgpIHtcbiAgICAgICAgICBpZiAoaWR4LmF1dG8pXG4gICAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TY2hlbWEoXCJPbmx5IHByaW1hcnkga2V5IGNhbiBiZSBtYXJrZWQgYXMgYXV0b0luY3JlbWVudCAoKyspXCIpO1xuICAgICAgICAgIGlmICghaWR4LmtleVBhdGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TY2hlbWEoXCJJbmRleCBtdXN0IGhhdmUgYSBuYW1lIGFuZCBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgb3V0U2NoZW1hW3RhYmxlTmFtZV0gPSBjcmVhdGVUYWJsZVNjaGVtYSh0YWJsZU5hbWUsIHByaW1LZXksIGluZGV4ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBWZXJzaW9uMi5wcm90b3R5cGUuc3RvcmVzID0gZnVuY3Rpb24oc3RvcmVzKSB7XG4gICAgdmFyIGRiID0gdGhpcy5kYjtcbiAgICB0aGlzLl9jZmcuc3RvcmVzU291cmNlID0gdGhpcy5fY2ZnLnN0b3Jlc1NvdXJjZSA/IGV4dGVuZCh0aGlzLl9jZmcuc3RvcmVzU291cmNlLCBzdG9yZXMpIDogc3RvcmVzO1xuICAgIHZhciB2ZXJzaW9ucyA9IGRiLl92ZXJzaW9ucztcbiAgICB2YXIgc3RvcmVzU3BlYyA9IHt9O1xuICAgIHZhciBkYnNjaGVtYSA9IHt9O1xuICAgIHZlcnNpb25zLmZvckVhY2goZnVuY3Rpb24odmVyc2lvbikge1xuICAgICAgZXh0ZW5kKHN0b3Jlc1NwZWMsIHZlcnNpb24uX2NmZy5zdG9yZXNTb3VyY2UpO1xuICAgICAgZGJzY2hlbWEgPSB2ZXJzaW9uLl9jZmcuZGJzY2hlbWEgPSB7fTtcbiAgICAgIHZlcnNpb24uX3BhcnNlU3RvcmVzU3BlYyhzdG9yZXNTcGVjLCBkYnNjaGVtYSk7XG4gICAgfSk7XG4gICAgZGIuX2RiU2NoZW1hID0gZGJzY2hlbWE7XG4gICAgcmVtb3ZlVGFibGVzQXBpKGRiLCBbZGIuX2FsbFRhYmxlcywgZGIsIGRiLlRyYW5zYWN0aW9uLnByb3RvdHlwZV0pO1xuICAgIHNldEFwaU9uUGxhY2UoZGIsIFtkYi5fYWxsVGFibGVzLCBkYiwgZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlLCB0aGlzLl9jZmcudGFibGVzXSwga2V5cyhkYnNjaGVtYSksIGRic2NoZW1hKTtcbiAgICBkYi5fc3RvcmVOYW1lcyA9IGtleXMoZGJzY2hlbWEpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBWZXJzaW9uMi5wcm90b3R5cGUudXBncmFkZSA9IGZ1bmN0aW9uKHVwZ3JhZGVGdW5jdGlvbikge1xuICAgIHRoaXMuX2NmZy5jb250ZW50VXBncmFkZSA9IHVwZ3JhZGVGdW5jdGlvbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcmV0dXJuIFZlcnNpb24yO1xufSgpO1xuZnVuY3Rpb24gY3JlYXRlVmVyc2lvbkNvbnN0cnVjdG9yKGRiKSB7XG4gIHJldHVybiBtYWtlQ2xhc3NDb25zdHJ1Y3RvcihWZXJzaW9uLnByb3RvdHlwZSwgZnVuY3Rpb24gVmVyc2lvbjIodmVyc2lvbk51bWJlcikge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB0aGlzLl9jZmcgPSB7XG4gICAgICB2ZXJzaW9uOiB2ZXJzaW9uTnVtYmVyLFxuICAgICAgc3RvcmVzU291cmNlOiBudWxsLFxuICAgICAgZGJzY2hlbWE6IHt9LFxuICAgICAgdGFibGVzOiB7fSxcbiAgICAgIGNvbnRlbnRVcGdyYWRlOiBudWxsXG4gICAgfTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXREYk5hbWVzVGFibGUoaW5kZXhlZERCLCBJREJLZXlSYW5nZSkge1xuICB2YXIgZGJOYW1lc0RCID0gaW5kZXhlZERCW1wiX2RiTmFtZXNEQlwiXTtcbiAgaWYgKCFkYk5hbWVzREIpIHtcbiAgICBkYk5hbWVzREIgPSBpbmRleGVkREJbXCJfZGJOYW1lc0RCXCJdID0gbmV3IERleGllJDEoREJOQU1FU19EQiwge1xuICAgICAgYWRkb25zOiBbXSxcbiAgICAgIGluZGV4ZWREQixcbiAgICAgIElEQktleVJhbmdlXG4gICAgfSk7XG4gICAgZGJOYW1lc0RCLnZlcnNpb24oMSkuc3RvcmVzKHtkYm5hbWVzOiBcIm5hbWVcIn0pO1xuICB9XG4gIHJldHVybiBkYk5hbWVzREIudGFibGUoXCJkYm5hbWVzXCIpO1xufVxuZnVuY3Rpb24gaGFzRGF0YWJhc2VzTmF0aXZlKGluZGV4ZWREQikge1xuICByZXR1cm4gaW5kZXhlZERCICYmIHR5cGVvZiBpbmRleGVkREIuZGF0YWJhc2VzID09PSBcImZ1bmN0aW9uXCI7XG59XG5mdW5jdGlvbiBnZXREYXRhYmFzZU5hbWVzKF9hMikge1xuICB2YXIgaW5kZXhlZERCID0gX2EyLmluZGV4ZWREQiwgSURCS2V5UmFuZ2UgPSBfYTIuSURCS2V5UmFuZ2U7XG4gIHJldHVybiBoYXNEYXRhYmFzZXNOYXRpdmUoaW5kZXhlZERCKSA/IFByb21pc2UucmVzb2x2ZShpbmRleGVkREIuZGF0YWJhc2VzKCkpLnRoZW4oZnVuY3Rpb24oaW5mb3MpIHtcbiAgICByZXR1cm4gaW5mb3MubWFwKGZ1bmN0aW9uKGluZm8pIHtcbiAgICAgIHJldHVybiBpbmZvLm5hbWU7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lICE9PSBEQk5BTUVTX0RCO1xuICAgIH0pO1xuICB9KSA6IGdldERiTmFtZXNUYWJsZShpbmRleGVkREIsIElEQktleVJhbmdlKS50b0NvbGxlY3Rpb24oKS5wcmltYXJ5S2V5cygpO1xufVxuZnVuY3Rpb24gX29uRGF0YWJhc2VDcmVhdGVkKF9hMiwgbmFtZSkge1xuICB2YXIgaW5kZXhlZERCID0gX2EyLmluZGV4ZWREQiwgSURCS2V5UmFuZ2UgPSBfYTIuSURCS2V5UmFuZ2U7XG4gICFoYXNEYXRhYmFzZXNOYXRpdmUoaW5kZXhlZERCKSAmJiBuYW1lICE9PSBEQk5BTUVTX0RCICYmIGdldERiTmFtZXNUYWJsZShpbmRleGVkREIsIElEQktleVJhbmdlKS5wdXQoe25hbWV9KS5jYXRjaChub3ApO1xufVxuZnVuY3Rpb24gX29uRGF0YWJhc2VEZWxldGVkKF9hMiwgbmFtZSkge1xuICB2YXIgaW5kZXhlZERCID0gX2EyLmluZGV4ZWREQiwgSURCS2V5UmFuZ2UgPSBfYTIuSURCS2V5UmFuZ2U7XG4gICFoYXNEYXRhYmFzZXNOYXRpdmUoaW5kZXhlZERCKSAmJiBuYW1lICE9PSBEQk5BTUVTX0RCICYmIGdldERiTmFtZXNUYWJsZShpbmRleGVkREIsIElEQktleVJhbmdlKS5kZWxldGUobmFtZSkuY2F0Y2gobm9wKTtcbn1cbmZ1bmN0aW9uIHZpcChmbikge1xuICByZXR1cm4gbmV3U2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgUFNELmxldFRocm91Z2ggPSB0cnVlO1xuICAgIHJldHVybiBmbigpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGRleGllT3BlbihkYikge1xuICB2YXIgc3RhdGUgPSBkYi5fc3RhdGU7XG4gIHZhciBpbmRleGVkREIgPSBkYi5fZGVwcy5pbmRleGVkREI7XG4gIGlmIChzdGF0ZS5pc0JlaW5nT3BlbmVkIHx8IGRiLmlkYmRiKVxuICAgIHJldHVybiBzdGF0ZS5kYlJlYWR5UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN0YXRlLmRiT3BlbkVycm9yID8gcmVqZWN0aW9uKHN0YXRlLmRiT3BlbkVycm9yKSA6IGRiO1xuICAgIH0pO1xuICBkZWJ1ZyAmJiAoc3RhdGUub3BlbkNhbmNlbGxlci5fc3RhY2tIb2xkZXIgPSBnZXRFcnJvcldpdGhTdGFjaygpKTtcbiAgc3RhdGUuaXNCZWluZ09wZW5lZCA9IHRydWU7XG4gIHN0YXRlLmRiT3BlbkVycm9yID0gbnVsbDtcbiAgc3RhdGUub3BlbkNvbXBsZXRlID0gZmFsc2U7XG4gIHZhciByZXNvbHZlRGJSZWFkeSA9IHN0YXRlLmRiUmVhZHlSZXNvbHZlLCB1cGdyYWRlVHJhbnNhY3Rpb24gPSBudWxsLCB3YXNDcmVhdGVkID0gZmFsc2U7XG4gIHJldHVybiBEZXhpZVByb21pc2UucmFjZShbc3RhdGUub3BlbkNhbmNlbGxlciwgbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoIWluZGV4ZWREQilcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk1pc3NpbmdBUEkoKTtcbiAgICB2YXIgZGJOYW1lID0gZGIubmFtZTtcbiAgICB2YXIgcmVxID0gc3RhdGUuYXV0b1NjaGVtYSA/IGluZGV4ZWREQi5vcGVuKGRiTmFtZSkgOiBpbmRleGVkREIub3BlbihkYk5hbWUsIE1hdGgucm91bmQoZGIudmVybm8gKiAxMCkpO1xuICAgIGlmICghcmVxKVxuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTWlzc2luZ0FQSSgpO1xuICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgcmVxLm9uYmxvY2tlZCA9IHdyYXAoZGIuX2ZpcmVPbkJsb2NrZWQpO1xuICAgIHJlcS5vbnVwZ3JhZGVuZWVkZWQgPSB3cmFwKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHVwZ3JhZGVUcmFuc2FjdGlvbiA9IHJlcS50cmFuc2FjdGlvbjtcbiAgICAgIGlmIChzdGF0ZS5hdXRvU2NoZW1hICYmICFkYi5fb3B0aW9ucy5hbGxvd0VtcHR5REIpIHtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSBwcmV2ZW50RGVmYXVsdDtcbiAgICAgICAgdXBncmFkZVRyYW5zYWN0aW9uLmFib3J0KCk7XG4gICAgICAgIHJlcS5yZXN1bHQuY2xvc2UoKTtcbiAgICAgICAgdmFyIGRlbHJlcSA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShkYk5hbWUpO1xuICAgICAgICBkZWxyZXEub25zdWNjZXNzID0gZGVscmVxLm9uZXJyb3IgPSB3cmFwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlamVjdChuZXcgZXhjZXB0aW9ucy5Ob1N1Y2hEYXRhYmFzZShcIkRhdGFiYXNlIFwiICsgZGJOYW1lICsgXCIgZG9lc250IGV4aXN0XCIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGdyYWRlVHJhbnNhY3Rpb24ub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICB2YXIgb2xkVmVyID0gZS5vbGRWZXJzaW9uID4gTWF0aC5wb3coMiwgNjIpID8gMCA6IGUub2xkVmVyc2lvbjtcbiAgICAgICAgd2FzQ3JlYXRlZCA9IG9sZFZlciA8IDE7XG4gICAgICAgIGRiLmlkYmRiID0gcmVxLnJlc3VsdDtcbiAgICAgICAgcnVuVXBncmFkZXJzKGRiLCBvbGRWZXIgLyAxMCwgdXBncmFkZVRyYW5zYWN0aW9uLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0sIHJlamVjdCk7XG4gICAgcmVxLm9uc3VjY2VzcyA9IHdyYXAoZnVuY3Rpb24oKSB7XG4gICAgICB1cGdyYWRlVHJhbnNhY3Rpb24gPSBudWxsO1xuICAgICAgdmFyIGlkYmRiID0gZGIuaWRiZGIgPSByZXEucmVzdWx0O1xuICAgICAgdmFyIG9iamVjdFN0b3JlTmFtZXMgPSBzbGljZShpZGJkYi5vYmplY3RTdG9yZU5hbWVzKTtcbiAgICAgIGlmIChvYmplY3RTdG9yZU5hbWVzLmxlbmd0aCA+IDApXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHRtcFRyYW5zID0gaWRiZGIudHJhbnNhY3Rpb24oc2FmYXJpTXVsdGlTdG9yZUZpeChvYmplY3RTdG9yZU5hbWVzKSwgXCJyZWFkb25seVwiKTtcbiAgICAgICAgICBpZiAoc3RhdGUuYXV0b1NjaGVtYSlcbiAgICAgICAgICAgIHJlYWRHbG9iYWxTY2hlbWEoZGIsIGlkYmRiLCB0bXBUcmFucyk7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhZGp1c3RUb0V4aXN0aW5nSW5kZXhOYW1lcyhkYiwgZGIuX2RiU2NoZW1hLCB0bXBUcmFucyk7XG4gICAgICAgICAgICBpZiAoIXZlcmlmeUluc3RhbGxlZFNjaGVtYShkYiwgdG1wVHJhbnMpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkRleGllIFNjaGVtYURpZmY6IFNjaGVtYSB3YXMgZXh0ZW5kZWQgd2l0aG91dCBpbmNyZWFzaW5nIHRoZSBudW1iZXIgcGFzc2VkIHRvIGRiLnZlcnNpb24oKS4gU29tZSBxdWVyaWVzIG1heSBmYWlsLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZ2VuZXJhdGVNaWRkbGV3YXJlU3RhY2tzKGRiLCB0bXBUcmFucyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgY29ubmVjdGlvbnMucHVzaChkYik7XG4gICAgICBpZGJkYi5vbnZlcnNpb25jaGFuZ2UgPSB3cmFwKGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgIHN0YXRlLnZjRmlyZWQgPSB0cnVlO1xuICAgICAgICBkYi5vbihcInZlcnNpb25jaGFuZ2VcIikuZmlyZShldik7XG4gICAgICB9KTtcbiAgICAgIGlkYmRiLm9uY2xvc2UgPSB3cmFwKGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgIGRiLm9uKFwiY2xvc2VcIikuZmlyZShldik7XG4gICAgICB9KTtcbiAgICAgIGlmICh3YXNDcmVhdGVkKVxuICAgICAgICBfb25EYXRhYmFzZUNyZWF0ZWQoZGIuX2RlcHMsIGRiTmFtZSk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSwgcmVqZWN0KTtcbiAgfSldKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLm9uUmVhZHlCZWluZ0ZpcmVkID0gW107XG4gICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHZpcChkYi5vbi5yZWFkeS5maXJlKSkudGhlbihmdW5jdGlvbiBmaXJlUmVtYWluZGVycygpIHtcbiAgICAgIGlmIChzdGF0ZS5vblJlYWR5QmVpbmdGaXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciByZW1haW5kZXJzID0gc3RhdGUub25SZWFkeUJlaW5nRmlyZWQucmVkdWNlKHByb21pc2FibGVDaGFpbiwgbm9wKTtcbiAgICAgICAgc3RhdGUub25SZWFkeUJlaW5nRmlyZWQgPSBbXTtcbiAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHZpcChyZW1haW5kZXJzKSkudGhlbihmaXJlUmVtYWluZGVycyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUub25SZWFkeUJlaW5nRmlyZWQgPSBudWxsO1xuICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLmlzQmVpbmdPcGVuZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gZGI7XG4gIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgIHRyeSB7XG4gICAgICB1cGdyYWRlVHJhbnNhY3Rpb24gJiYgdXBncmFkZVRyYW5zYWN0aW9uLmFib3J0KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgICBzdGF0ZS5pc0JlaW5nT3BlbmVkID0gZmFsc2U7XG4gICAgZGIuY2xvc2UoKTtcbiAgICBzdGF0ZS5kYk9wZW5FcnJvciA9IGVycjtcbiAgICByZXR1cm4gcmVqZWN0aW9uKHN0YXRlLmRiT3BlbkVycm9yKTtcbiAgfSkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5vcGVuQ29tcGxldGUgPSB0cnVlO1xuICAgIHJlc29sdmVEYlJlYWR5KCk7XG4gIH0pO1xufVxuZnVuY3Rpb24gYXdhaXRJdGVyYXRvcihpdGVyYXRvcikge1xuICB2YXIgY2FsbE5leHQgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICByZXR1cm4gaXRlcmF0b3IubmV4dChyZXN1bHQpO1xuICB9LCBkb1Rocm93ID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICByZXR1cm4gaXRlcmF0b3IudGhyb3coZXJyb3IpO1xuICB9LCBvblN1Y2Nlc3MgPSBzdGVwKGNhbGxOZXh0KSwgb25FcnJvciA9IHN0ZXAoZG9UaHJvdyk7XG4gIGZ1bmN0aW9uIHN0ZXAoZ2V0TmV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHZhciBuZXh0ID0gZ2V0TmV4dCh2YWwpLCB2YWx1ZSA9IG5leHQudmFsdWU7XG4gICAgICByZXR1cm4gbmV4dC5kb25lID8gdmFsdWUgOiAhdmFsdWUgfHwgdHlwZW9mIHZhbHVlLnRoZW4gIT09IFwiZnVuY3Rpb25cIiA/IGlzQXJyYXkodmFsdWUpID8gUHJvbWlzZS5hbGwodmFsdWUpLnRoZW4ob25TdWNjZXNzLCBvbkVycm9yKSA6IG9uU3VjY2Vzcyh2YWx1ZSkgOiB2YWx1ZS50aGVuKG9uU3VjY2Vzcywgb25FcnJvcik7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gc3RlcChjYWxsTmV4dCkoKTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RUcmFuc2FjdGlvbkFyZ3MobW9kZSwgX3RhYmxlQXJnc18sIHNjb3BlRnVuYykge1xuICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIGlmIChpIDwgMilcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJUb28gZmV3IGFyZ3VtZW50c1wiKTtcbiAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSAtIDEpO1xuICB3aGlsZSAoLS1pKVxuICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICBzY29wZUZ1bmMgPSBhcmdzLnBvcCgpO1xuICB2YXIgdGFibGVzID0gZmxhdHRlbihhcmdzKTtcbiAgcmV0dXJuIFttb2RlLCB0YWJsZXMsIHNjb3BlRnVuY107XG59XG5mdW5jdGlvbiBlbnRlclRyYW5zYWN0aW9uU2NvcGUoZGIsIG1vZGUsIHN0b3JlTmFtZXMsIHBhcmVudFRyYW5zYWN0aW9uLCBzY29wZUZ1bmMpIHtcbiAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhbnNsZXNzID0gUFNELnRyYW5zbGVzcyB8fCBQU0Q7XG4gICAgdmFyIHRyYW5zID0gZGIuX2NyZWF0ZVRyYW5zYWN0aW9uKG1vZGUsIHN0b3JlTmFtZXMsIGRiLl9kYlNjaGVtYSwgcGFyZW50VHJhbnNhY3Rpb24pO1xuICAgIHZhciB6b25lUHJvcHMgPSB7XG4gICAgICB0cmFucyxcbiAgICAgIHRyYW5zbGVzc1xuICAgIH07XG4gICAgaWYgKHBhcmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICB0cmFucy5pZGJ0cmFucyA9IHBhcmVudFRyYW5zYWN0aW9uLmlkYnRyYW5zO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFucy5jcmVhdGUoKTtcbiAgICB9XG4gICAgdmFyIHNjb3BlRnVuY0lzQXN5bmMgPSBpc0FzeW5jRnVuY3Rpb24oc2NvcGVGdW5jKTtcbiAgICBpZiAoc2NvcGVGdW5jSXNBc3luYykge1xuICAgICAgaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICB9XG4gICAgdmFyIHJldHVyblZhbHVlO1xuICAgIHZhciBwcm9taXNlRm9sbG93ZWQgPSBEZXhpZVByb21pc2UuZm9sbG93KGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuVmFsdWUgPSBzY29wZUZ1bmMuY2FsbCh0cmFucywgdHJhbnMpO1xuICAgICAgaWYgKHJldHVyblZhbHVlKSB7XG4gICAgICAgIGlmIChzY29wZUZ1bmNJc0FzeW5jKSB7XG4gICAgICAgICAgdmFyIGRlY3JlbWVudG9yID0gZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMuYmluZChudWxsLCBudWxsKTtcbiAgICAgICAgICByZXR1cm5WYWx1ZS50aGVuKGRlY3JlbWVudG9yLCBkZWNyZW1lbnRvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJldHVyblZhbHVlLm5leHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgcmV0dXJuVmFsdWUudGhyb3cgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gYXdhaXRJdGVyYXRvcihyZXR1cm5WYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB6b25lUHJvcHMpO1xuICAgIHJldHVybiAocmV0dXJuVmFsdWUgJiYgdHlwZW9mIHJldHVyblZhbHVlLnRoZW4gPT09IFwiZnVuY3Rpb25cIiA/IERleGllUHJvbWlzZS5yZXNvbHZlKHJldHVyblZhbHVlKS50aGVuKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0cmFucy5hY3RpdmUgPyB4IDogcmVqZWN0aW9uKG5ldyBleGNlcHRpb25zLlByZW1hdHVyZUNvbW1pdChcIlRyYW5zYWN0aW9uIGNvbW1pdHRlZCB0b28gZWFybHkuIFNlZSBodHRwOi8vYml0Lmx5LzJrZGNrTW5cIikpO1xuICAgIH0pIDogcHJvbWlzZUZvbGxvd2VkLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfSkpLnRoZW4oZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKHBhcmVudFRyYW5zYWN0aW9uKVxuICAgICAgICB0cmFucy5fcmVzb2x2ZSgpO1xuICAgICAgcmV0dXJuIHRyYW5zLl9jb21wbGV0aW9uLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgdHJhbnMuX3JlamVjdChlKTtcbiAgICAgIHJldHVybiByZWplY3Rpb24oZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcGFkKGEsIHZhbHVlLCBjb3VudCkge1xuICB2YXIgcmVzdWx0ID0gaXNBcnJheShhKSA/IGEuc2xpY2UoKSA6IFthXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKVxuICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVZpcnR1YWxJbmRleE1pZGRsZXdhcmUoZG93bikge1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGRvd24pLCB7dGFibGU6IGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgIHZhciB0YWJsZSA9IGRvd24udGFibGUodGFibGVOYW1lKTtcbiAgICB2YXIgc2NoZW1hID0gdGFibGUuc2NoZW1hO1xuICAgIHZhciBpbmRleExvb2t1cCA9IHt9O1xuICAgIHZhciBhbGxWaXJ0dWFsSW5kZXhlcyA9IFtdO1xuICAgIGZ1bmN0aW9uIGFkZFZpcnR1YWxJbmRleGVzKGtleVBhdGgsIGtleVRhaWwsIGxvd0xldmVsSW5kZXgpIHtcbiAgICAgIHZhciBrZXlQYXRoQWxpYXMgPSBnZXRLZXlQYXRoQWxpYXMoa2V5UGF0aCk7XG4gICAgICB2YXIgaW5kZXhMaXN0ID0gaW5kZXhMb29rdXBba2V5UGF0aEFsaWFzXSA9IGluZGV4TG9va3VwW2tleVBhdGhBbGlhc10gfHwgW107XG4gICAgICB2YXIga2V5TGVuZ3RoID0ga2V5UGF0aCA9PSBudWxsID8gMCA6IHR5cGVvZiBrZXlQYXRoID09PSBcInN0cmluZ1wiID8gMSA6IGtleVBhdGgubGVuZ3RoO1xuICAgICAgdmFyIGlzVmlydHVhbCA9IGtleVRhaWwgPiAwO1xuICAgICAgdmFyIHZpcnR1YWxJbmRleCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBsb3dMZXZlbEluZGV4KSwge1xuICAgICAgICBpc1ZpcnR1YWwsXG4gICAgICAgIGlzUHJpbWFyeUtleTogIWlzVmlydHVhbCAmJiBsb3dMZXZlbEluZGV4LmlzUHJpbWFyeUtleSxcbiAgICAgICAga2V5VGFpbCxcbiAgICAgICAga2V5TGVuZ3RoLFxuICAgICAgICBleHRyYWN0S2V5OiBnZXRLZXlFeHRyYWN0b3Ioa2V5UGF0aCksXG4gICAgICAgIHVuaXF1ZTogIWlzVmlydHVhbCAmJiBsb3dMZXZlbEluZGV4LnVuaXF1ZVxuICAgICAgfSk7XG4gICAgICBpbmRleExpc3QucHVzaCh2aXJ0dWFsSW5kZXgpO1xuICAgICAgaWYgKCF2aXJ0dWFsSW5kZXguaXNQcmltYXJ5S2V5KSB7XG4gICAgICAgIGFsbFZpcnR1YWxJbmRleGVzLnB1c2godmlydHVhbEluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXlMZW5ndGggPiAxKSB7XG4gICAgICAgIHZhciB2aXJ0dWFsS2V5UGF0aCA9IGtleUxlbmd0aCA9PT0gMiA/IGtleVBhdGhbMF0gOiBrZXlQYXRoLnNsaWNlKDAsIGtleUxlbmd0aCAtIDEpO1xuICAgICAgICBhZGRWaXJ0dWFsSW5kZXhlcyh2aXJ0dWFsS2V5UGF0aCwga2V5VGFpbCArIDEsIGxvd0xldmVsSW5kZXgpO1xuICAgICAgfVxuICAgICAgaW5kZXhMaXN0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYS5rZXlUYWlsIC0gYi5rZXlUYWlsO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmlydHVhbEluZGV4O1xuICAgIH1cbiAgICB2YXIgcHJpbWFyeUtleSA9IGFkZFZpcnR1YWxJbmRleGVzKHNjaGVtYS5wcmltYXJ5S2V5LmtleVBhdGgsIDAsIHNjaGVtYS5wcmltYXJ5S2V5KTtcbiAgICBpbmRleExvb2t1cFtcIjppZFwiXSA9IFtwcmltYXJ5S2V5XTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hMiA9IHNjaGVtYS5pbmRleGVzOyBfaSA8IF9hMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBpbmRleCA9IF9hMltfaV07XG4gICAgICBhZGRWaXJ0dWFsSW5kZXhlcyhpbmRleC5rZXlQYXRoLCAwLCBpbmRleCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpbmRCZXN0SW5kZXgoa2V5UGF0aCkge1xuICAgICAgdmFyIHJlc3VsdDIgPSBpbmRleExvb2t1cFtnZXRLZXlQYXRoQWxpYXMoa2V5UGF0aCldO1xuICAgICAgcmV0dXJuIHJlc3VsdDIgJiYgcmVzdWx0MlswXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlUmFuZ2UocmFuZ2UsIGtleVRhaWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHJhbmdlLnR5cGUgPT09IDEgPyAyIDogcmFuZ2UudHlwZSxcbiAgICAgICAgbG93ZXI6IHBhZChyYW5nZS5sb3dlciwgcmFuZ2UubG93ZXJPcGVuID8gZG93bi5NQVhfS0VZIDogZG93bi5NSU5fS0VZLCBrZXlUYWlsKSxcbiAgICAgICAgbG93ZXJPcGVuOiB0cnVlLFxuICAgICAgICB1cHBlcjogcGFkKHJhbmdlLnVwcGVyLCByYW5nZS51cHBlck9wZW4gPyBkb3duLk1JTl9LRVkgOiBkb3duLk1BWF9LRVksIGtleVRhaWwpLFxuICAgICAgICB1cHBlck9wZW46IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZVJlcXVlc3QocmVxKSB7XG4gICAgICB2YXIgaW5kZXgyID0gcmVxLnF1ZXJ5LmluZGV4O1xuICAgICAgcmV0dXJuIGluZGV4Mi5pc1ZpcnR1YWwgPyBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVxKSwge3F1ZXJ5OiB7XG4gICAgICAgIGluZGV4OiBpbmRleDIsXG4gICAgICAgIHJhbmdlOiB0cmFuc2xhdGVSYW5nZShyZXEucXVlcnkucmFuZ2UsIGluZGV4Mi5rZXlUYWlsKVxuICAgICAgfX0pIDogcmVxO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRhYmxlKSwge1xuICAgICAgc2NoZW1hOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc2NoZW1hKSwge3ByaW1hcnlLZXksIGluZGV4ZXM6IGFsbFZpcnR1YWxJbmRleGVzLCBnZXRJbmRleEJ5S2V5UGF0aDogZmluZEJlc3RJbmRleH0pLFxuICAgICAgY291bnQ6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICByZXR1cm4gdGFibGUuY291bnQodHJhbnNsYXRlUmVxdWVzdChyZXEpKTtcbiAgICAgIH0sXG4gICAgICBxdWVyeTogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHJldHVybiB0YWJsZS5xdWVyeSh0cmFuc2xhdGVSZXF1ZXN0KHJlcSkpO1xuICAgICAgfSxcbiAgICAgIG9wZW5DdXJzb3I6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB2YXIgX2EzID0gcmVxLnF1ZXJ5LmluZGV4LCBrZXlUYWlsID0gX2EzLmtleVRhaWwsIGlzVmlydHVhbCA9IF9hMy5pc1ZpcnR1YWwsIGtleUxlbmd0aCA9IF9hMy5rZXlMZW5ndGg7XG4gICAgICAgIGlmICghaXNWaXJ0dWFsKVxuICAgICAgICAgIHJldHVybiB0YWJsZS5vcGVuQ3Vyc29yKHJlcSk7XG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVZpcnR1YWxDdXJzb3IoY3Vyc29yKSB7XG4gICAgICAgICAgZnVuY3Rpb24gX2NvbnRpbnVlKGtleSkge1xuICAgICAgICAgICAga2V5ICE9IG51bGwgPyBjdXJzb3IuY29udGludWUocGFkKGtleSwgcmVxLnJldmVyc2UgPyBkb3duLk1BWF9LRVkgOiBkb3duLk1JTl9LRVksIGtleVRhaWwpKSA6IHJlcS51bmlxdWUgPyBjdXJzb3IuY29udGludWUocGFkKGN1cnNvci5rZXksIHJlcS5yZXZlcnNlID8gZG93bi5NSU5fS0VZIDogZG93bi5NQVhfS0VZLCBrZXlUYWlsKSkgOiBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZpcnR1YWxDdXJzb3IgPSBPYmplY3QuY3JlYXRlKGN1cnNvciwge1xuICAgICAgICAgICAgY29udGludWU6IHt2YWx1ZTogX2NvbnRpbnVlfSxcbiAgICAgICAgICAgIGNvbnRpbnVlUHJpbWFyeUtleToge1xuICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oa2V5LCBwcmltYXJ5S2V5Mikge1xuICAgICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZVByaW1hcnlLZXkocGFkKGtleSwgZG93bi5NQVhfS0VZLCBrZXlUYWlsKSwgcHJpbWFyeUtleTIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGN1cnNvci5rZXk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleUxlbmd0aCA9PT0gMSA/IGtleVswXSA6IGtleS5zbGljZSgwLCBrZXlMZW5ndGgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yLnZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHZpcnR1YWxDdXJzb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlLm9wZW5DdXJzb3IodHJhbnNsYXRlUmVxdWVzdChyZXEpKS50aGVuKGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgICAgIHJldHVybiBjdXJzb3IgJiYgY3JlYXRlVmlydHVhbEN1cnNvcihjdXJzb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9fSk7XG59XG52YXIgdmlydHVhbEluZGV4TWlkZGxld2FyZSA9IHtcbiAgc3RhY2s6IFwiZGJjb3JlXCIsXG4gIG5hbWU6IFwiVmlydHVhbEluZGV4TWlkZGxld2FyZVwiLFxuICBsZXZlbDogMSxcbiAgY3JlYXRlOiBjcmVhdGVWaXJ0dWFsSW5kZXhNaWRkbGV3YXJlXG59O1xuZnVuY3Rpb24gZ2V0RWZmZWN0aXZlS2V5cyhwcmltYXJ5S2V5LCByZXEpIHtcbiAgaWYgKHJlcS50eXBlID09PSBcImRlbGV0ZVwiKVxuICAgIHJldHVybiByZXEua2V5cztcbiAgcmV0dXJuIHJlcS5rZXlzIHx8IHJlcS52YWx1ZXMubWFwKHByaW1hcnlLZXkuZXh0cmFjdEtleSk7XG59XG52YXIgaG9va3NNaWRkbGV3YXJlID0ge1xuICBzdGFjazogXCJkYmNvcmVcIixcbiAgbmFtZTogXCJIb29rc01pZGRsZXdhcmVcIixcbiAgbGV2ZWw6IDIsXG4gIGNyZWF0ZTogZnVuY3Rpb24oZG93bkNvcmUpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGRvd25Db3JlKSwge3RhYmxlOiBmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICAgIHZhciBkb3duVGFibGUgPSBkb3duQ29yZS50YWJsZSh0YWJsZU5hbWUpO1xuICAgICAgdmFyIHByaW1hcnlLZXkgPSBkb3duVGFibGUuc2NoZW1hLnByaW1hcnlLZXk7XG4gICAgICB2YXIgdGFibGVNaWRkbGV3YXJlID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRvd25UYWJsZSksIHttdXRhdGU6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB2YXIgZHhUcmFucyA9IFBTRC50cmFucztcbiAgICAgICAgdmFyIF9hMiA9IGR4VHJhbnMudGFibGUodGFibGVOYW1lKS5ob29rLCBkZWxldGluZyA9IF9hMi5kZWxldGluZywgY3JlYXRpbmcgPSBfYTIuY3JlYXRpbmcsIHVwZGF0aW5nID0gX2EyLnVwZGF0aW5nO1xuICAgICAgICBzd2l0Y2ggKHJlcS50eXBlKSB7XG4gICAgICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICAgICAgaWYgKGNyZWF0aW5nLmZpcmUgPT09IG5vcClcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICByZXR1cm4gZHhUcmFucy5fcHJvbWlzZShcInJlYWR3cml0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFkZFB1dE9yRGVsZXRlKHJlcSk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICBjYXNlIFwicHV0XCI6XG4gICAgICAgICAgICBpZiAoY3JlYXRpbmcuZmlyZSA9PT0gbm9wICYmIHVwZGF0aW5nLmZpcmUgPT09IG5vcClcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICByZXR1cm4gZHhUcmFucy5fcHJvbWlzZShcInJlYWR3cml0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFkZFB1dE9yRGVsZXRlKHJlcSk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICBjYXNlIFwiZGVsZXRlXCI6XG4gICAgICAgICAgICBpZiAoZGVsZXRpbmcuZmlyZSA9PT0gbm9wKVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHJldHVybiBkeFRyYW5zLl9wcm9taXNlKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gYWRkUHV0T3JEZWxldGUocmVxKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgIGNhc2UgXCJkZWxldGVSYW5nZVwiOlxuICAgICAgICAgICAgaWYgKGRlbGV0aW5nLmZpcmUgPT09IG5vcClcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICByZXR1cm4gZHhUcmFucy5fcHJvbWlzZShcInJlYWR3cml0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZVJhbmdlKHJlcSk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG93blRhYmxlLm11dGF0ZShyZXEpO1xuICAgICAgICBmdW5jdGlvbiBhZGRQdXRPckRlbGV0ZShyZXEyKSB7XG4gICAgICAgICAgdmFyIGR4VHJhbnMyID0gUFNELnRyYW5zO1xuICAgICAgICAgIHZhciBrZXlzMiA9IHJlcTIua2V5cyB8fCBnZXRFZmZlY3RpdmVLZXlzKHByaW1hcnlLZXksIHJlcTIpO1xuICAgICAgICAgIGlmICgha2V5czIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXlzIG1pc3NpbmdcIik7XG4gICAgICAgICAgcmVxMiA9IHJlcTIudHlwZSA9PT0gXCJhZGRcIiB8fCByZXEyLnR5cGUgPT09IFwicHV0XCIgPyBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVxMiksIHtrZXlzOiBrZXlzMn0pIDogX19hc3NpZ24oe30sIHJlcTIpO1xuICAgICAgICAgIGlmIChyZXEyLnR5cGUgIT09IFwiZGVsZXRlXCIpXG4gICAgICAgICAgICByZXEyLnZhbHVlcyA9IF9fc3ByZWFkQXJyYXkoW10sIHJlcTIudmFsdWVzKTtcbiAgICAgICAgICBpZiAocmVxMi5rZXlzKVxuICAgICAgICAgICAgcmVxMi5rZXlzID0gX19zcHJlYWRBcnJheShbXSwgcmVxMi5rZXlzKTtcbiAgICAgICAgICByZXR1cm4gZ2V0RXhpc3RpbmdWYWx1ZXMoZG93blRhYmxlLCByZXEyLCBrZXlzMikudGhlbihmdW5jdGlvbihleGlzdGluZ1ZhbHVlcykge1xuICAgICAgICAgICAgdmFyIGNvbnRleHRzID0ga2V5czIubWFwKGZ1bmN0aW9uKGtleSwgaSkge1xuICAgICAgICAgICAgICB2YXIgZXhpc3RpbmdWYWx1ZSA9IGV4aXN0aW5nVmFsdWVzW2ldO1xuICAgICAgICAgICAgICB2YXIgY3R4ID0ge29uZXJyb3I6IG51bGwsIG9uc3VjY2VzczogbnVsbH07XG4gICAgICAgICAgICAgIGlmIChyZXEyLnR5cGUgPT09IFwiZGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICBkZWxldGluZy5maXJlLmNhbGwoY3R4LCBrZXksIGV4aXN0aW5nVmFsdWUsIGR4VHJhbnMyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXEyLnR5cGUgPT09IFwiYWRkXCIgfHwgZXhpc3RpbmdWYWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdlbmVyYXRlZFByaW1hcnlLZXkgPSBjcmVhdGluZy5maXJlLmNhbGwoY3R4LCBrZXksIHJlcTIudmFsdWVzW2ldLCBkeFRyYW5zMik7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBudWxsICYmIGdlbmVyYXRlZFByaW1hcnlLZXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAga2V5ID0gZ2VuZXJhdGVkUHJpbWFyeUtleTtcbiAgICAgICAgICAgICAgICAgIHJlcTIua2V5c1tpXSA9IGtleTtcbiAgICAgICAgICAgICAgICAgIGlmICghcHJpbWFyeUtleS5vdXRib3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRCeUtleVBhdGgocmVxMi52YWx1ZXNbaV0sIHByaW1hcnlLZXkua2V5UGF0aCwga2V5KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG9iamVjdERpZmYgPSBnZXRPYmplY3REaWZmKGV4aXN0aW5nVmFsdWUsIHJlcTIudmFsdWVzW2ldKTtcbiAgICAgICAgICAgICAgICB2YXIgYWRkaXRpb25hbENoYW5nZXNfMSA9IHVwZGF0aW5nLmZpcmUuY2FsbChjdHgsIG9iamVjdERpZmYsIGtleSwgZXhpc3RpbmdWYWx1ZSwgZHhUcmFuczIpO1xuICAgICAgICAgICAgICAgIGlmIChhZGRpdGlvbmFsQ2hhbmdlc18xKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdGVkVmFsdWVfMSA9IHJlcTIudmFsdWVzW2ldO1xuICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYWRkaXRpb25hbENoYW5nZXNfMSkuZm9yRWFjaChmdW5jdGlvbihrZXlQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd24ocmVxdWVzdGVkVmFsdWVfMSwga2V5UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ZWRWYWx1ZV8xW2tleVBhdGhdID0gYWRkaXRpb25hbENoYW5nZXNfMVtrZXlQYXRoXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRCeUtleVBhdGgocmVxdWVzdGVkVmFsdWVfMSwga2V5UGF0aCwgYWRkaXRpb25hbENoYW5nZXNfMVtrZXlQYXRoXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gY3R4O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZG93blRhYmxlLm11dGF0ZShyZXEyKS50aGVuKGZ1bmN0aW9uKF9hMykge1xuICAgICAgICAgICAgICB2YXIgZmFpbHVyZXMgPSBfYTMuZmFpbHVyZXMsIHJlc3VsdHMgPSBfYTMucmVzdWx0cywgbnVtRmFpbHVyZXMgPSBfYTMubnVtRmFpbHVyZXMsIGxhc3RSZXN1bHQgPSBfYTMubGFzdFJlc3VsdDtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzMi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBwcmltS2V5ID0gcmVzdWx0cyA/IHJlc3VsdHNbaV0gOiBrZXlzMltpXTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY29udGV4dHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHByaW1LZXkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgY3R4Lm9uZXJyb3IgJiYgY3R4Lm9uZXJyb3IoZmFpbHVyZXNbaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjdHgub25zdWNjZXNzICYmIGN0eC5vbnN1Y2Nlc3MocmVxMi50eXBlID09PSBcInB1dFwiICYmIGV4aXN0aW5nVmFsdWVzW2ldID8gcmVxMi52YWx1ZXNbaV0gOiBwcmltS2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHtmYWlsdXJlcywgcmVzdWx0cywgbnVtRmFpbHVyZXMsIGxhc3RSZXN1bHR9O1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29udGV4dHMuZm9yRWFjaChmdW5jdGlvbihjdHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4Lm9uZXJyb3IgJiYgY3R4Lm9uZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZVJhbmdlKHJlcTIpIHtcbiAgICAgICAgICByZXR1cm4gZGVsZXRlTmV4dENodW5rKHJlcTIudHJhbnMsIHJlcTIucmFuZ2UsIDFlNCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlTmV4dENodW5rKHRyYW5zLCByYW5nZSwgbGltaXQpIHtcbiAgICAgICAgICByZXR1cm4gZG93blRhYmxlLnF1ZXJ5KHt0cmFucywgdmFsdWVzOiBmYWxzZSwgcXVlcnk6IHtpbmRleDogcHJpbWFyeUtleSwgcmFuZ2V9LCBsaW1pdH0pLnRoZW4oZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gX2EzLnJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBhZGRQdXRPckRlbGV0ZSh7dHlwZTogXCJkZWxldGVcIiwga2V5czogcmVzdWx0LCB0cmFuc30pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgIGlmIChyZXMubnVtRmFpbHVyZXMgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZmFpbHVyZXNbMF0pO1xuICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtmYWlsdXJlczogW10sIG51bUZhaWx1cmVzOiAwLCBsYXN0UmVzdWx0OiB2b2lkIDB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWxldGVOZXh0Q2h1bmsodHJhbnMsIF9fYXNzaWduKF9fYXNzaWduKHt9LCByYW5nZSksIHtsb3dlcjogcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSwgbG93ZXJPcGVuOiB0cnVlfSksIGxpbWl0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH19KTtcbiAgICAgIHJldHVybiB0YWJsZU1pZGRsZXdhcmU7XG4gICAgfX0pO1xuICB9XG59O1xuZnVuY3Rpb24gZ2V0RXhpc3RpbmdWYWx1ZXModGFibGUsIHJlcSwgZWZmZWN0aXZlS2V5cykge1xuICByZXR1cm4gcmVxLnR5cGUgPT09IFwiYWRkXCIgPyBQcm9taXNlLnJlc29sdmUoW10pIDogdGFibGUuZ2V0TWFueSh7dHJhbnM6IHJlcS50cmFucywga2V5czogZWZmZWN0aXZlS2V5cywgY2FjaGU6IFwiaW1tdXRhYmxlXCJ9KTtcbn1cbnZhciBfY21wO1xuZnVuY3Rpb24gY21wKGEsIGIpIHtcbiAgaWYgKF9jbXApXG4gICAgcmV0dXJuIF9jbXAoYSwgYik7XG4gIHZhciBpbmRleGVkREIgPSBkb21EZXBzLmluZGV4ZWREQjtcbiAgaWYgKCFpbmRleGVkREIpXG4gICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTWlzc2luZ0FQSSgpO1xuICBfY21wID0gZnVuY3Rpb24oYTIsIGIyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhMiA9PSBudWxsIHx8IGIyID09IG51bGwgPyBOYU4gOiBpbmRleGVkREIuY21wKGEyLCBiMik7XG4gICAgfSBjYXRjaCAoX2EyKSB7XG4gICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIF9jbXAoYSwgYik7XG59XG5mdW5jdGlvbiBnZXRGcm9tVHJhbnNhY3Rpb25DYWNoZShrZXlzMiwgY2FjaGUsIGNsb25lKSB7XG4gIHRyeSB7XG4gICAgaWYgKCFjYWNoZSlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIGlmIChjYWNoZS5rZXlzLmxlbmd0aCA8IGtleXMyLmxlbmd0aClcbiAgICAgIHJldHVybiBudWxsO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCBjYWNoZS5rZXlzLmxlbmd0aCAmJiBqIDwga2V5czIubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChjbXAoY2FjaGUua2V5c1tpXSwga2V5czJbal0pICE9PSAwKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHJlc3VsdC5wdXNoKGNsb25lID8gZGVlcENsb25lKGNhY2hlLnZhbHVlc1tpXSkgOiBjYWNoZS52YWx1ZXNbaV0pO1xuICAgICAgKytqO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PT0ga2V5czIubGVuZ3RoID8gcmVzdWx0IDogbnVsbDtcbiAgfSBjYXRjaCAoX2EyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbnZhciBjYWNoZUV4aXN0aW5nVmFsdWVzTWlkZGxld2FyZSA9IHtcbiAgc3RhY2s6IFwiZGJjb3JlXCIsXG4gIGxldmVsOiAtMSxcbiAgY3JlYXRlOiBmdW5jdGlvbihjb3JlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhYmxlOiBmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICAgICAgdmFyIHRhYmxlID0gY29yZS50YWJsZSh0YWJsZU5hbWUpO1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRhYmxlKSwge2dldE1hbnk6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICAgIGlmICghcmVxLmNhY2hlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFibGUuZ2V0TWFueShyZXEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgY2FjaGVkUmVzdWx0ID0gZ2V0RnJvbVRyYW5zYWN0aW9uQ2FjaGUocmVxLmtleXMsIHJlcS50cmFuc1tcIl9jYWNoZVwiXSwgcmVxLmNhY2hlID09PSBcImNsb25lXCIpO1xuICAgICAgICAgIGlmIChjYWNoZWRSZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBEZXhpZVByb21pc2UucmVzb2x2ZShjYWNoZWRSZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFibGUuZ2V0TWFueShyZXEpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICByZXEudHJhbnNbXCJfY2FjaGVcIl0gPSB7XG4gICAgICAgICAgICAgIGtleXM6IHJlcS5rZXlzLFxuICAgICAgICAgICAgICB2YWx1ZXM6IHJlcS5jYWNoZSA9PT0gXCJjbG9uZVwiID8gZGVlcENsb25lKHJlcykgOiByZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBtdXRhdGU6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICAgIGlmIChyZXEudHlwZSAhPT0gXCJhZGRcIilcbiAgICAgICAgICAgIHJlcS50cmFuc1tcIl9jYWNoZVwiXSA9IG51bGw7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlLm11dGF0ZShyZXEpO1xuICAgICAgICB9fSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbnZhciBfYTtcbmZ1bmN0aW9uIGlzRW1wdHlSYW5nZShub2RlKSB7XG4gIHJldHVybiAhKFwiZnJvbVwiIGluIG5vZGUpO1xufVxudmFyIFJhbmdlU2V0ID0gZnVuY3Rpb24oZnJvbU9yVHJlZSwgdG8pIHtcbiAgaWYgKHRoaXMpIHtcbiAgICBleHRlbmQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA/IHtkOiAxLCBmcm9tOiBmcm9tT3JUcmVlLCB0bzogYXJndW1lbnRzLmxlbmd0aCA+IDEgPyB0byA6IGZyb21PclRyZWV9IDoge2Q6IDB9KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcnYgPSBuZXcgUmFuZ2VTZXQoKTtcbiAgICBpZiAoZnJvbU9yVHJlZSAmJiBcImRcIiBpbiBmcm9tT3JUcmVlKSB7XG4gICAgICBleHRlbmQocnYsIGZyb21PclRyZWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbn07XG5wcm9wcyhSYW5nZVNldC5wcm90b3R5cGUsIChfYSA9IHtcbiAgYWRkOiBmdW5jdGlvbihyYW5nZVNldCkge1xuICAgIG1lcmdlUmFuZ2VzKHRoaXMsIHJhbmdlU2V0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgYWRkS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICBhZGRSYW5nZSh0aGlzLCBrZXksIGtleSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGFkZEtleXM6IGZ1bmN0aW9uKGtleXMyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBrZXlzMi5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGFkZFJhbmdlKF90aGlzLCBrZXksIGtleSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0sIF9hW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZ2V0UmFuZ2VTZXRJdGVyYXRvcih0aGlzKTtcbn0sIF9hKSk7XG5mdW5jdGlvbiBhZGRSYW5nZSh0YXJnZXQsIGZyb20sIHRvKSB7XG4gIHZhciBkaWZmID0gY21wKGZyb20sIHRvKTtcbiAgaWYgKGlzTmFOKGRpZmYpKVxuICAgIHJldHVybjtcbiAgaWYgKGRpZmYgPiAwKVxuICAgIHRocm93IFJhbmdlRXJyb3IoKTtcbiAgaWYgKGlzRW1wdHlSYW5nZSh0YXJnZXQpKVxuICAgIHJldHVybiBleHRlbmQodGFyZ2V0LCB7ZnJvbSwgdG8sIGQ6IDF9KTtcbiAgdmFyIGxlZnQgPSB0YXJnZXQubDtcbiAgdmFyIHJpZ2h0ID0gdGFyZ2V0LnI7XG4gIGlmIChjbXAodG8sIHRhcmdldC5mcm9tKSA8IDApIHtcbiAgICBsZWZ0ID8gYWRkUmFuZ2UobGVmdCwgZnJvbSwgdG8pIDogdGFyZ2V0LmwgPSB7ZnJvbSwgdG8sIGQ6IDEsIGw6IG51bGwsIHI6IG51bGx9O1xuICAgIHJldHVybiByZWJhbGFuY2UodGFyZ2V0KTtcbiAgfVxuICBpZiAoY21wKGZyb20sIHRhcmdldC50bykgPiAwKSB7XG4gICAgcmlnaHQgPyBhZGRSYW5nZShyaWdodCwgZnJvbSwgdG8pIDogdGFyZ2V0LnIgPSB7ZnJvbSwgdG8sIGQ6IDEsIGw6IG51bGwsIHI6IG51bGx9O1xuICAgIHJldHVybiByZWJhbGFuY2UodGFyZ2V0KTtcbiAgfVxuICBpZiAoY21wKGZyb20sIHRhcmdldC5mcm9tKSA8IDApIHtcbiAgICB0YXJnZXQuZnJvbSA9IGZyb207XG4gICAgdGFyZ2V0LmwgPSBudWxsO1xuICAgIHRhcmdldC5kID0gcmlnaHQgPyByaWdodC5kICsgMSA6IDE7XG4gIH1cbiAgaWYgKGNtcCh0bywgdGFyZ2V0LnRvKSA+IDApIHtcbiAgICB0YXJnZXQudG8gPSB0bztcbiAgICB0YXJnZXQuciA9IG51bGw7XG4gICAgdGFyZ2V0LmQgPSB0YXJnZXQubCA/IHRhcmdldC5sLmQgKyAxIDogMTtcbiAgfVxuICB2YXIgcmlnaHRXYXNDdXRPZmYgPSAhdGFyZ2V0LnI7XG4gIGlmIChsZWZ0ICYmICF0YXJnZXQubCkge1xuICAgIG1lcmdlUmFuZ2VzKHRhcmdldCwgbGVmdCk7XG4gIH1cbiAgaWYgKHJpZ2h0ICYmIHJpZ2h0V2FzQ3V0T2ZmKSB7XG4gICAgbWVyZ2VSYW5nZXModGFyZ2V0LCByaWdodCk7XG4gIH1cbn1cbmZ1bmN0aW9uIG1lcmdlUmFuZ2VzKHRhcmdldCwgbmV3U2V0KSB7XG4gIGZ1bmN0aW9uIF9hZGRSYW5nZVNldCh0YXJnZXQyLCBfYTIpIHtcbiAgICB2YXIgZnJvbSA9IF9hMi5mcm9tLCB0byA9IF9hMi50bywgbCA9IF9hMi5sLCByID0gX2EyLnI7XG4gICAgYWRkUmFuZ2UodGFyZ2V0MiwgZnJvbSwgdG8pO1xuICAgIGlmIChsKVxuICAgICAgX2FkZFJhbmdlU2V0KHRhcmdldDIsIGwpO1xuICAgIGlmIChyKVxuICAgICAgX2FkZFJhbmdlU2V0KHRhcmdldDIsIHIpO1xuICB9XG4gIGlmICghaXNFbXB0eVJhbmdlKG5ld1NldCkpXG4gICAgX2FkZFJhbmdlU2V0KHRhcmdldCwgbmV3U2V0KTtcbn1cbmZ1bmN0aW9uIHJhbmdlc092ZXJsYXAocmFuZ2VTZXQxLCByYW5nZVNldDIpIHtcbiAgdmFyIGkxID0gZ2V0UmFuZ2VTZXRJdGVyYXRvcihyYW5nZVNldDIpO1xuICB2YXIgbmV4dFJlc3VsdDEgPSBpMS5uZXh0KCk7XG4gIGlmIChuZXh0UmVzdWx0MS5kb25lKVxuICAgIHJldHVybiBmYWxzZTtcbiAgdmFyIGEgPSBuZXh0UmVzdWx0MS52YWx1ZTtcbiAgdmFyIGkyID0gZ2V0UmFuZ2VTZXRJdGVyYXRvcihyYW5nZVNldDEpO1xuICB2YXIgbmV4dFJlc3VsdDIgPSBpMi5uZXh0KGEuZnJvbSk7XG4gIHZhciBiID0gbmV4dFJlc3VsdDIudmFsdWU7XG4gIHdoaWxlICghbmV4dFJlc3VsdDEuZG9uZSAmJiAhbmV4dFJlc3VsdDIuZG9uZSkge1xuICAgIGlmIChjbXAoYi5mcm9tLCBhLnRvKSA8PSAwICYmIGNtcChiLnRvLCBhLmZyb20pID49IDApXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjbXAoYS5mcm9tLCBiLmZyb20pIDwgMCA/IGEgPSAobmV4dFJlc3VsdDEgPSBpMS5uZXh0KGIuZnJvbSkpLnZhbHVlIDogYiA9IChuZXh0UmVzdWx0MiA9IGkyLm5leHQoYS5mcm9tKSkudmFsdWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZ2V0UmFuZ2VTZXRJdGVyYXRvcihub2RlKSB7XG4gIHZhciBzdGF0ZSA9IGlzRW1wdHlSYW5nZShub2RlKSA/IG51bGwgOiB7czogMCwgbjogbm9kZX07XG4gIHJldHVybiB7XG4gICAgbmV4dDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIga2V5UHJvdmlkZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMDtcbiAgICAgIHdoaWxlIChzdGF0ZSkge1xuICAgICAgICBzd2l0Y2ggKHN0YXRlLnMpIHtcbiAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBzdGF0ZS5zID0gMTtcbiAgICAgICAgICAgIGlmIChrZXlQcm92aWRlZCkge1xuICAgICAgICAgICAgICB3aGlsZSAoc3RhdGUubi5sICYmIGNtcChrZXksIHN0YXRlLm4uZnJvbSkgPCAwKVxuICAgICAgICAgICAgICAgIHN0YXRlID0ge3VwOiBzdGF0ZSwgbjogc3RhdGUubi5sLCBzOiAxfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdoaWxlIChzdGF0ZS5uLmwpXG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7dXA6IHN0YXRlLCBuOiBzdGF0ZS5uLmwsIHM6IDF9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHN0YXRlLnMgPSAyO1xuICAgICAgICAgICAgaWYgKCFrZXlQcm92aWRlZCB8fCBjbXAoa2V5LCBzdGF0ZS5uLnRvKSA8PSAwKVxuICAgICAgICAgICAgICByZXR1cm4ge3ZhbHVlOiBzdGF0ZS5uLCBkb25lOiBmYWxzZX07XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgaWYgKHN0YXRlLm4ucikge1xuICAgICAgICAgICAgICBzdGF0ZS5zID0gMztcbiAgICAgICAgICAgICAgc3RhdGUgPSB7dXA6IHN0YXRlLCBuOiBzdGF0ZS5uLnIsIHM6IDB9O1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBzdGF0ZSA9IHN0YXRlLnVwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ge2RvbmU6IHRydWV9O1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHJlYmFsYW5jZSh0YXJnZXQpIHtcbiAgdmFyIF9hMiwgX2I7XG4gIHZhciBkaWZmID0gKCgoX2EyID0gdGFyZ2V0LnIpID09PSBudWxsIHx8IF9hMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EyLmQpIHx8IDApIC0gKCgoX2IgPSB0YXJnZXQubCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmQpIHx8IDApO1xuICB2YXIgciA9IGRpZmYgPiAxID8gXCJyXCIgOiBkaWZmIDwgLTEgPyBcImxcIiA6IFwiXCI7XG4gIGlmIChyKSB7XG4gICAgdmFyIGwgPSByID09PSBcInJcIiA/IFwibFwiIDogXCJyXCI7XG4gICAgdmFyIHJvb3RDbG9uZSA9IF9fYXNzaWduKHt9LCB0YXJnZXQpO1xuICAgIHZhciBvbGRSb290UmlnaHQgPSB0YXJnZXRbcl07XG4gICAgdGFyZ2V0LmZyb20gPSBvbGRSb290UmlnaHQuZnJvbTtcbiAgICB0YXJnZXQudG8gPSBvbGRSb290UmlnaHQudG87XG4gICAgdGFyZ2V0W3JdID0gb2xkUm9vdFJpZ2h0W3JdO1xuICAgIHJvb3RDbG9uZVtyXSA9IG9sZFJvb3RSaWdodFtsXTtcbiAgICB0YXJnZXRbbF0gPSByb290Q2xvbmU7XG4gICAgcm9vdENsb25lLmQgPSBjb21wdXRlRGVwdGgocm9vdENsb25lKTtcbiAgfVxuICB0YXJnZXQuZCA9IGNvbXB1dGVEZXB0aCh0YXJnZXQpO1xufVxuZnVuY3Rpb24gY29tcHV0ZURlcHRoKF9hMikge1xuICB2YXIgciA9IF9hMi5yLCBsID0gX2EyLmw7XG4gIHJldHVybiAociA/IGwgPyBNYXRoLm1heChyLmQsIGwuZCkgOiByLmQgOiBsID8gbC5kIDogMCkgKyAxO1xufVxudmFyIG9ic2VydmFiaWxpdHlNaWRkbGV3YXJlID0ge1xuICBzdGFjazogXCJkYmNvcmVcIixcbiAgbGV2ZWw6IDAsXG4gIGNyZWF0ZTogZnVuY3Rpb24oY29yZSkge1xuICAgIHZhciBkYk5hbWUgPSBjb3JlLnNjaGVtYS5uYW1lO1xuICAgIHZhciBGVUxMX1JBTkdFID0gbmV3IFJhbmdlU2V0KGNvcmUuTUlOX0tFWSwgY29yZS5NQVhfS0VZKTtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGNvcmUpLCB7dGFibGU6IGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgICAgdmFyIHRhYmxlID0gY29yZS50YWJsZSh0YWJsZU5hbWUpO1xuICAgICAgdmFyIHNjaGVtYSA9IHRhYmxlLnNjaGVtYTtcbiAgICAgIHZhciBwcmltYXJ5S2V5ID0gc2NoZW1hLnByaW1hcnlLZXk7XG4gICAgICB2YXIgZXh0cmFjdEtleSA9IHByaW1hcnlLZXkuZXh0cmFjdEtleSwgb3V0Ym91bmQgPSBwcmltYXJ5S2V5Lm91dGJvdW5kO1xuICAgICAgdmFyIHRhYmxlQ2xvbmUgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGFibGUpLCB7bXV0YXRlOiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIHRyYW5zID0gcmVxLnRyYW5zO1xuICAgICAgICB2YXIgbXV0YXRlZFBhcnRzID0gdHJhbnMubXV0YXRlZFBhcnRzIHx8ICh0cmFucy5tdXRhdGVkUGFydHMgPSB7fSk7XG4gICAgICAgIHZhciBnZXRSYW5nZVNldCA9IGZ1bmN0aW9uKGluZGV4TmFtZSkge1xuICAgICAgICAgIHZhciBwYXJ0ID0gXCJpZGI6Ly9cIiArIGRiTmFtZSArIFwiL1wiICsgdGFibGVOYW1lICsgXCIvXCIgKyBpbmRleE5hbWU7XG4gICAgICAgICAgcmV0dXJuIG11dGF0ZWRQYXJ0c1twYXJ0XSB8fCAobXV0YXRlZFBhcnRzW3BhcnRdID0gbmV3IFJhbmdlU2V0KCkpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcGtSYW5nZVNldCA9IGdldFJhbmdlU2V0KFwiXCIpO1xuICAgICAgICB2YXIgZGVsc1JhbmdlU2V0ID0gZ2V0UmFuZ2VTZXQoXCI6ZGVsc1wiKTtcbiAgICAgICAgdmFyIHR5cGUgPSByZXEudHlwZTtcbiAgICAgICAgdmFyIF9hMiA9IHJlcS50eXBlID09PSBcImRlbGV0ZVJhbmdlXCIgPyBbcmVxLnJhbmdlXSA6IHJlcS50eXBlID09PSBcImRlbGV0ZVwiID8gW3JlcS5rZXlzXSA6IHJlcS52YWx1ZXMubGVuZ3RoIDwgNTAgPyBbW10sIHJlcS52YWx1ZXNdIDogW10sIGtleXMyID0gX2EyWzBdLCBuZXdPYmpzID0gX2EyWzFdO1xuICAgICAgICB2YXIgb2xkQ2FjaGUgPSByZXEudHJhbnNbXCJfY2FjaGVcIl07XG4gICAgICAgIHJldHVybiB0YWJsZS5tdXRhdGUocmVxKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgIGlmIChpc0FycmF5KGtleXMyKSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT09IFwiZGVsZXRlXCIpXG4gICAgICAgICAgICAgIGtleXMyID0gcmVzLnJlc3VsdHM7XG4gICAgICAgICAgICBwa1JhbmdlU2V0LmFkZEtleXMoa2V5czIpO1xuICAgICAgICAgICAgdmFyIG9sZE9ianMgPSBnZXRGcm9tVHJhbnNhY3Rpb25DYWNoZShrZXlzMiwgb2xkQ2FjaGUpO1xuICAgICAgICAgICAgaWYgKCFvbGRPYmpzICYmIHR5cGUgIT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgICAgZGVsc1JhbmdlU2V0LmFkZEtleXMoa2V5czIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9sZE9ianMgfHwgbmV3T2Jqcykge1xuICAgICAgICAgICAgICB0cmFja0FmZmVjdGVkSW5kZXhlcyhnZXRSYW5nZVNldCwgc2NoZW1hLCBvbGRPYmpzLCBuZXdPYmpzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGtleXMyKSB7XG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSB7ZnJvbToga2V5czIubG93ZXIsIHRvOiBrZXlzMi51cHBlcn07XG4gICAgICAgICAgICBkZWxzUmFuZ2VTZXQuYWRkKHJhbmdlKTtcbiAgICAgICAgICAgIHBrUmFuZ2VTZXQuYWRkKHJhbmdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGtSYW5nZVNldC5hZGQoRlVMTF9SQU5HRSk7XG4gICAgICAgICAgICBkZWxzUmFuZ2VTZXQuYWRkKEZVTExfUkFOR0UpO1xuICAgICAgICAgICAgc2NoZW1hLmluZGV4ZXMuZm9yRWFjaChmdW5jdGlvbihpZHgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldFJhbmdlU2V0KGlkeC5uYW1lKS5hZGQoRlVMTF9SQU5HRSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgICB9fSk7XG4gICAgICB2YXIgZ2V0UmFuZ2UgPSBmdW5jdGlvbihfYTIpIHtcbiAgICAgICAgdmFyIF9iLCBfYztcbiAgICAgICAgdmFyIF9kID0gX2EyLnF1ZXJ5LCBpbmRleCA9IF9kLmluZGV4LCByYW5nZSA9IF9kLnJhbmdlO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIGluZGV4LFxuICAgICAgICAgIG5ldyBSYW5nZVNldCgoX2IgPSByYW5nZS5sb3dlcikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogY29yZS5NSU5fS0VZLCAoX2MgPSByYW5nZS51cHBlcikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogY29yZS5NQVhfS0VZKVxuICAgICAgICBdO1xuICAgICAgfTtcbiAgICAgIHZhciByZWFkU3Vic2NyaWJlcnMgPSB7XG4gICAgICAgIGdldDogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgICAgcmV0dXJuIFtwcmltYXJ5S2V5LCBuZXcgUmFuZ2VTZXQocmVxLmtleSldO1xuICAgICAgICB9LFxuICAgICAgICBnZXRNYW55OiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgICByZXR1cm4gW3ByaW1hcnlLZXksIG5ldyBSYW5nZVNldCgpLmFkZEtleXMocmVxLmtleXMpXTtcbiAgICAgICAgfSxcbiAgICAgICAgY291bnQ6IGdldFJhbmdlLFxuICAgICAgICBxdWVyeTogZ2V0UmFuZ2UsXG4gICAgICAgIG9wZW5DdXJzb3I6IGdldFJhbmdlXG4gICAgICB9O1xuICAgICAga2V5cyhyZWFkU3Vic2NyaWJlcnMpLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHRhYmxlQ2xvbmVbbWV0aG9kXSA9IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICAgIHZhciBzdWJzY3IgPSBQU0Quc3Vic2NyO1xuICAgICAgICAgIGlmIChzdWJzY3IpIHtcbiAgICAgICAgICAgIHZhciBnZXRSYW5nZVNldCA9IGZ1bmN0aW9uKGluZGV4TmFtZSkge1xuICAgICAgICAgICAgICB2YXIgcGFydCA9IFwiaWRiOi8vXCIgKyBkYk5hbWUgKyBcIi9cIiArIHRhYmxlTmFtZSArIFwiL1wiICsgaW5kZXhOYW1lO1xuICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyW3BhcnRdIHx8IChzdWJzY3JbcGFydF0gPSBuZXcgUmFuZ2VTZXQoKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHBrUmFuZ2VTZXRfMSA9IGdldFJhbmdlU2V0KFwiXCIpO1xuICAgICAgICAgICAgdmFyIGRlbHNSYW5nZVNldF8xID0gZ2V0UmFuZ2VTZXQoXCI6ZGVsc1wiKTtcbiAgICAgICAgICAgIHZhciBfYTIgPSByZWFkU3Vic2NyaWJlcnNbbWV0aG9kXShyZXEpLCBxdWVyaWVkSW5kZXggPSBfYTJbMF0sIHF1ZXJpZWRSYW5nZXMgPSBfYTJbMV07XG4gICAgICAgICAgICBnZXRSYW5nZVNldChxdWVyaWVkSW5kZXgubmFtZSB8fCBcIlwiKS5hZGQocXVlcmllZFJhbmdlcyk7XG4gICAgICAgICAgICBpZiAoIXF1ZXJpZWRJbmRleC5pc1ByaW1hcnlLZXkpIHtcbiAgICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJjb3VudFwiKSB7XG4gICAgICAgICAgICAgICAgZGVsc1JhbmdlU2V0XzEuYWRkKEZVTExfUkFOR0UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzUHJvbWlzZV8xID0gbWV0aG9kID09PSBcInF1ZXJ5XCIgJiYgb3V0Ym91bmQgJiYgcmVxLnZhbHVlcyAmJiB0YWJsZS5xdWVyeShfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVxKSwge3ZhbHVlczogZmFsc2V9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlW21ldGhvZF0uYXBwbHkodGhpcywgYXJndW1lbnRzKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJxdWVyeVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRib3VuZCAmJiByZXEudmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXNQcm9taXNlXzEudGhlbihmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHRpbmdLZXlzID0gX2EzLnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBrUmFuZ2VTZXRfMS5hZGRLZXlzKHJlc3VsdGluZ0tleXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcEtleXMgPSByZXEudmFsdWVzID8gcmVzLnJlc3VsdC5tYXAoZXh0cmFjdEtleSkgOiByZXMucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgIHBrUmFuZ2VTZXRfMS5hZGRLZXlzKHBLZXlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZWxzUmFuZ2VTZXRfMS5hZGRLZXlzKHBLZXlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwib3BlbkN1cnNvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJzb3JfMSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdhbnRWYWx1ZXNfMSA9IHJlcS52YWx1ZXM7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJzb3JfMSAmJiBPYmplY3QuY3JlYXRlKGN1cnNvcl8xLCB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxzUmFuZ2VTZXRfMS5hZGRLZXkoY3Vyc29yXzEucHJpbWFyeUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJzb3JfMS5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5S2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGtleSA9IGN1cnNvcl8xLnByaW1hcnlLZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHNSYW5nZVNldF8xLmFkZEtleShwa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2FudFZhbHVlc18xICYmIHBrUmFuZ2VTZXRfMS5hZGRLZXkoY3Vyc29yXzEucHJpbWFyeUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJzb3JfMS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFibGVbbWV0aG9kXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGFibGVDbG9uZTtcbiAgICB9fSk7XG4gIH1cbn07XG5mdW5jdGlvbiB0cmFja0FmZmVjdGVkSW5kZXhlcyhnZXRSYW5nZVNldCwgc2NoZW1hLCBvbGRPYmpzLCBuZXdPYmpzKSB7XG4gIGZ1bmN0aW9uIGFkZEFmZmVjdGVkSW5kZXgoaXgpIHtcbiAgICB2YXIgcmFuZ2VTZXQgPSBnZXRSYW5nZVNldChpeC5uYW1lIHx8IFwiXCIpO1xuICAgIGZ1bmN0aW9uIGV4dHJhY3RLZXkob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBpeC5leHRyYWN0S2V5KG9iaikgOiBudWxsO1xuICAgIH1cbiAgICB2YXIgYWRkS2V5T3JLZXlzID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gaXgubXVsdGlFbnRyeSAmJiBpc0FycmF5KGtleSkgPyBrZXkuZm9yRWFjaChmdW5jdGlvbihrZXkyKSB7XG4gICAgICAgIHJldHVybiByYW5nZVNldC5hZGRLZXkoa2V5Mik7XG4gICAgICB9KSA6IHJhbmdlU2V0LmFkZEtleShrZXkpO1xuICAgIH07XG4gICAgKG9sZE9ianMgfHwgbmV3T2JqcykuZm9yRWFjaChmdW5jdGlvbihfLCBpKSB7XG4gICAgICB2YXIgb2xkS2V5ID0gb2xkT2JqcyAmJiBleHRyYWN0S2V5KG9sZE9ianNbaV0pO1xuICAgICAgdmFyIG5ld0tleSA9IG5ld09ianMgJiYgZXh0cmFjdEtleShuZXdPYmpzW2ldKTtcbiAgICAgIGlmIChjbXAob2xkS2V5LCBuZXdLZXkpICE9PSAwKSB7XG4gICAgICAgIGlmIChvbGRLZXkgIT0gbnVsbClcbiAgICAgICAgICBhZGRLZXlPcktleXMob2xkS2V5KTtcbiAgICAgICAgaWYgKG5ld0tleSAhPSBudWxsKVxuICAgICAgICAgIGFkZEtleU9yS2V5cyhuZXdLZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHNjaGVtYS5pbmRleGVzLmZvckVhY2goYWRkQWZmZWN0ZWRJbmRleCk7XG59XG52YXIgRGV4aWUkMSA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEZXhpZTIobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5fbWlkZGxld2FyZXMgPSB7fTtcbiAgICB0aGlzLnZlcm5vID0gMDtcbiAgICB2YXIgZGVwcyA9IERleGllMi5kZXBlbmRlbmNpZXM7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgPSBfX2Fzc2lnbih7XG4gICAgICBhZGRvbnM6IERleGllMi5hZGRvbnMsXG4gICAgICBhdXRvT3BlbjogdHJ1ZSxcbiAgICAgIGluZGV4ZWREQjogZGVwcy5pbmRleGVkREIsXG4gICAgICBJREJLZXlSYW5nZTogZGVwcy5JREJLZXlSYW5nZVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHRoaXMuX2RlcHMgPSB7XG4gICAgICBpbmRleGVkREI6IG9wdGlvbnMuaW5kZXhlZERCLFxuICAgICAgSURCS2V5UmFuZ2U6IG9wdGlvbnMuSURCS2V5UmFuZ2VcbiAgICB9O1xuICAgIHZhciBhZGRvbnMgPSBvcHRpb25zLmFkZG9ucztcbiAgICB0aGlzLl9kYlNjaGVtYSA9IHt9O1xuICAgIHRoaXMuX3ZlcnNpb25zID0gW107XG4gICAgdGhpcy5fc3RvcmVOYW1lcyA9IFtdO1xuICAgIHRoaXMuX2FsbFRhYmxlcyA9IHt9O1xuICAgIHRoaXMuaWRiZGIgPSBudWxsO1xuICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgIGRiT3BlbkVycm9yOiBudWxsLFxuICAgICAgaXNCZWluZ09wZW5lZDogZmFsc2UsXG4gICAgICBvblJlYWR5QmVpbmdGaXJlZDogbnVsbCxcbiAgICAgIG9wZW5Db21wbGV0ZTogZmFsc2UsXG4gICAgICBkYlJlYWR5UmVzb2x2ZTogbm9wLFxuICAgICAgZGJSZWFkeVByb21pc2U6IG51bGwsXG4gICAgICBjYW5jZWxPcGVuOiBub3AsXG4gICAgICBvcGVuQ2FuY2VsbGVyOiBudWxsLFxuICAgICAgYXV0b1NjaGVtYTogdHJ1ZVxuICAgIH07XG4gICAgc3RhdGUuZGJSZWFkeVByb21pc2UgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHN0YXRlLmRiUmVhZHlSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBzdGF0ZS5vcGVuQ2FuY2VsbGVyID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihfLCByZWplY3QpIHtcbiAgICAgIHN0YXRlLmNhbmNlbE9wZW4gPSByZWplY3Q7XG4gICAgfSk7XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMub24gPSBFdmVudHModGhpcywgXCJwb3B1bGF0ZVwiLCBcImJsb2NrZWRcIiwgXCJ2ZXJzaW9uY2hhbmdlXCIsIFwiY2xvc2VcIiwge3JlYWR5OiBbcHJvbWlzYWJsZUNoYWluLCBub3BdfSk7XG4gICAgdGhpcy5vbi5yZWFkeS5zdWJzY3JpYmUgPSBvdmVycmlkZSh0aGlzLm9uLnJlYWR5LnN1YnNjcmliZSwgZnVuY3Rpb24oc3Vic2NyaWJlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc3Vic2NyaWJlciwgYlN0aWNreSkge1xuICAgICAgICBEZXhpZTIudmlwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBzdGF0ZTIgPSBfdGhpcy5fc3RhdGU7XG4gICAgICAgICAgaWYgKHN0YXRlMi5vcGVuQ29tcGxldGUpIHtcbiAgICAgICAgICAgIGlmICghc3RhdGUyLmRiT3BlbkVycm9yKVxuICAgICAgICAgICAgICBEZXhpZVByb21pc2UucmVzb2x2ZSgpLnRoZW4oc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBpZiAoYlN0aWNreSlcbiAgICAgICAgICAgICAgc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUyLm9uUmVhZHlCZWluZ0ZpcmVkKSB7XG4gICAgICAgICAgICBzdGF0ZTIub25SZWFkeUJlaW5nRmlyZWQucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmIChiU3RpY2t5KVxuICAgICAgICAgICAgICBzdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIHZhciBkYl8xID0gX3RoaXM7XG4gICAgICAgICAgICBpZiAoIWJTdGlja3kpXG4gICAgICAgICAgICAgIHN1YnNjcmliZShmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgICAgICAgICBkYl8xLm9uLnJlYWR5LnVuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgICAgIGRiXzEub24ucmVhZHkudW5zdWJzY3JpYmUodW5zdWJzY3JpYmUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLkNvbGxlY3Rpb24gPSBjcmVhdGVDb2xsZWN0aW9uQ29uc3RydWN0b3IodGhpcyk7XG4gICAgdGhpcy5UYWJsZSA9IGNyZWF0ZVRhYmxlQ29uc3RydWN0b3IodGhpcyk7XG4gICAgdGhpcy5UcmFuc2FjdGlvbiA9IGNyZWF0ZVRyYW5zYWN0aW9uQ29uc3RydWN0b3IodGhpcyk7XG4gICAgdGhpcy5WZXJzaW9uID0gY3JlYXRlVmVyc2lvbkNvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHRoaXMuV2hlcmVDbGF1c2UgPSBjcmVhdGVXaGVyZUNsYXVzZUNvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHRoaXMub24oXCJ2ZXJzaW9uY2hhbmdlXCIsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBpZiAoZXYubmV3VmVyc2lvbiA+IDApXG4gICAgICAgIGNvbnNvbGUud2FybihcIkFub3RoZXIgY29ubmVjdGlvbiB3YW50cyB0byB1cGdyYWRlIGRhdGFiYXNlICdcIiArIF90aGlzLm5hbWUgKyBcIicuIENsb3NpbmcgZGIgbm93IHRvIHJlc3VtZSB0aGUgdXBncmFkZS5cIik7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybihcIkFub3RoZXIgY29ubmVjdGlvbiB3YW50cyB0byBkZWxldGUgZGF0YWJhc2UgJ1wiICsgX3RoaXMubmFtZSArIFwiJy4gQ2xvc2luZyBkYiBub3cgdG8gcmVzdW1lIHRoZSBkZWxldGUgcmVxdWVzdC5cIik7XG4gICAgICBfdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuICAgIHRoaXMub24oXCJibG9ja2VkXCIsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBpZiAoIWV2Lm5ld1ZlcnNpb24gfHwgZXYubmV3VmVyc2lvbiA8IGV2Lm9sZFZlcnNpb24pXG4gICAgICAgIGNvbnNvbGUud2FybihcIkRleGllLmRlbGV0ZSgnXCIgKyBfdGhpcy5uYW1lICsgXCInKSB3YXMgYmxvY2tlZFwiKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuKFwiVXBncmFkZSAnXCIgKyBfdGhpcy5uYW1lICsgXCInIGJsb2NrZWQgYnkgb3RoZXIgY29ubmVjdGlvbiBob2xkaW5nIHZlcnNpb24gXCIgKyBldi5vbGRWZXJzaW9uIC8gMTApO1xuICAgIH0pO1xuICAgIHRoaXMuX21heEtleSA9IGdldE1heEtleShvcHRpb25zLklEQktleVJhbmdlKTtcbiAgICB0aGlzLl9jcmVhdGVUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uKG1vZGUsIHN0b3JlTmFtZXMsIGRic2NoZW1hLCBwYXJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgcmV0dXJuIG5ldyBfdGhpcy5UcmFuc2FjdGlvbihtb2RlLCBzdG9yZU5hbWVzLCBkYnNjaGVtYSwgcGFyZW50VHJhbnNhY3Rpb24pO1xuICAgIH07XG4gICAgdGhpcy5fZmlyZU9uQmxvY2tlZCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICBfdGhpcy5vbihcImJsb2NrZWRcIikuZmlyZShldik7XG4gICAgICBjb25uZWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24oYykge1xuICAgICAgICByZXR1cm4gYy5uYW1lID09PSBfdGhpcy5uYW1lICYmIGMgIT09IF90aGlzICYmICFjLl9zdGF0ZS52Y0ZpcmVkO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgcmV0dXJuIGMub24oXCJ2ZXJzaW9uY2hhbmdlXCIpLmZpcmUoZXYpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLnVzZSh2aXJ0dWFsSW5kZXhNaWRkbGV3YXJlKTtcbiAgICB0aGlzLnVzZShob29rc01pZGRsZXdhcmUpO1xuICAgIHRoaXMudXNlKG9ic2VydmFiaWxpdHlNaWRkbGV3YXJlKTtcbiAgICB0aGlzLnVzZShjYWNoZUV4aXN0aW5nVmFsdWVzTWlkZGxld2FyZSk7XG4gICAgYWRkb25zLmZvckVhY2goZnVuY3Rpb24oYWRkb24pIHtcbiAgICAgIHJldHVybiBhZGRvbihfdGhpcyk7XG4gICAgfSk7XG4gIH1cbiAgRGV4aWUyLnByb3RvdHlwZS52ZXJzaW9uID0gZnVuY3Rpb24odmVyc2lvbk51bWJlcikge1xuICAgIGlmIChpc05hTih2ZXJzaW9uTnVtYmVyKSB8fCB2ZXJzaW9uTnVtYmVyIDwgMC4xKVxuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuVHlwZShcIkdpdmVuIHZlcnNpb24gaXMgbm90IGEgcG9zaXRpdmUgbnVtYmVyXCIpO1xuICAgIHZlcnNpb25OdW1iZXIgPSBNYXRoLnJvdW5kKHZlcnNpb25OdW1iZXIgKiAxMCkgLyAxMDtcbiAgICBpZiAodGhpcy5pZGJkYiB8fCB0aGlzLl9zdGF0ZS5pc0JlaW5nT3BlbmVkKVxuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU2NoZW1hKFwiQ2Fubm90IGFkZCB2ZXJzaW9uIHdoZW4gZGF0YWJhc2UgaXMgb3BlblwiKTtcbiAgICB0aGlzLnZlcm5vID0gTWF0aC5tYXgodGhpcy52ZXJubywgdmVyc2lvbk51bWJlcik7XG4gICAgdmFyIHZlcnNpb25zID0gdGhpcy5fdmVyc2lvbnM7XG4gICAgdmFyIHZlcnNpb25JbnN0YW5jZSA9IHZlcnNpb25zLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgICByZXR1cm4gdi5fY2ZnLnZlcnNpb24gPT09IHZlcnNpb25OdW1iZXI7XG4gICAgfSlbMF07XG4gICAgaWYgKHZlcnNpb25JbnN0YW5jZSlcbiAgICAgIHJldHVybiB2ZXJzaW9uSW5zdGFuY2U7XG4gICAgdmVyc2lvbkluc3RhbmNlID0gbmV3IHRoaXMuVmVyc2lvbih2ZXJzaW9uTnVtYmVyKTtcbiAgICB2ZXJzaW9ucy5wdXNoKHZlcnNpb25JbnN0YW5jZSk7XG4gICAgdmVyc2lvbnMuc29ydChsb3dlclZlcnNpb25GaXJzdCk7XG4gICAgdmVyc2lvbkluc3RhbmNlLnN0b3Jlcyh7fSk7XG4gICAgdGhpcy5fc3RhdGUuYXV0b1NjaGVtYSA9IGZhbHNlO1xuICAgIHJldHVybiB2ZXJzaW9uSW5zdGFuY2U7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuX3doZW5SZWFkeSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUub3BlbkNvbXBsZXRlIHx8IFBTRC5sZXRUaHJvdWdoID8gZm4oKSA6IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAoIV90aGlzLl9zdGF0ZS5pc0JlaW5nT3BlbmVkKSB7XG4gICAgICAgIGlmICghX3RoaXMuX29wdGlvbnMuYXV0b09wZW4pIHtcbiAgICAgICAgICByZWplY3QobmV3IGV4Y2VwdGlvbnMuRGF0YWJhc2VDbG9zZWQoKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLm9wZW4oKS5jYXRjaChub3ApO1xuICAgICAgfVxuICAgICAgX3RoaXMuX3N0YXRlLmRiUmVhZHlQcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KS50aGVuKGZuKTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbihfYTIpIHtcbiAgICB2YXIgc3RhY2sgPSBfYTIuc3RhY2ssIGNyZWF0ZSA9IF9hMi5jcmVhdGUsIGxldmVsID0gX2EyLmxldmVsLCBuYW1lID0gX2EyLm5hbWU7XG4gICAgaWYgKG5hbWUpXG4gICAgICB0aGlzLnVudXNlKHtzdGFjaywgbmFtZX0pO1xuICAgIHZhciBtaWRkbGV3YXJlcyA9IHRoaXMuX21pZGRsZXdhcmVzW3N0YWNrXSB8fCAodGhpcy5fbWlkZGxld2FyZXNbc3RhY2tdID0gW10pO1xuICAgIG1pZGRsZXdhcmVzLnB1c2goe3N0YWNrLCBjcmVhdGUsIGxldmVsOiBsZXZlbCA9PSBudWxsID8gMTAgOiBsZXZlbCwgbmFtZX0pO1xuICAgIG1pZGRsZXdhcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEubGV2ZWwgLSBiLmxldmVsO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLnVudXNlID0gZnVuY3Rpb24oX2EyKSB7XG4gICAgdmFyIHN0YWNrID0gX2EyLnN0YWNrLCBuYW1lID0gX2EyLm5hbWUsIGNyZWF0ZSA9IF9hMi5jcmVhdGU7XG4gICAgaWYgKHN0YWNrICYmIHRoaXMuX21pZGRsZXdhcmVzW3N0YWNrXSkge1xuICAgICAgdGhpcy5fbWlkZGxld2FyZXNbc3RhY2tdID0gdGhpcy5fbWlkZGxld2FyZXNbc3RhY2tdLmZpbHRlcihmdW5jdGlvbihtdykge1xuICAgICAgICByZXR1cm4gY3JlYXRlID8gbXcuY3JlYXRlICE9PSBjcmVhdGUgOiBuYW1lID8gbXcubmFtZSAhPT0gbmFtZSA6IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGV4aWVPcGVuKHRoaXMpO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlkeCA9IGNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIHN0YXRlID0gdGhpcy5fc3RhdGU7XG4gICAgaWYgKGlkeCA+PSAwKVxuICAgICAgY29ubmVjdGlvbnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgaWYgKHRoaXMuaWRiZGIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuaWRiZGIuY2xvc2UoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHRoaXMuaWRiZGIgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9vcHRpb25zLmF1dG9PcGVuID0gZmFsc2U7XG4gICAgc3RhdGUuZGJPcGVuRXJyb3IgPSBuZXcgZXhjZXB0aW9ucy5EYXRhYmFzZUNsb3NlZCgpO1xuICAgIGlmIChzdGF0ZS5pc0JlaW5nT3BlbmVkKVxuICAgICAgc3RhdGUuY2FuY2VsT3BlbihzdGF0ZS5kYk9wZW5FcnJvcik7XG4gICAgc3RhdGUuZGJSZWFkeVByb21pc2UgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHN0YXRlLmRiUmVhZHlSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBzdGF0ZS5vcGVuQ2FuY2VsbGVyID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihfLCByZWplY3QpIHtcbiAgICAgIHN0YXRlLmNhbmNlbE9wZW4gPSByZWplY3Q7XG4gICAgfSk7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgaGFzQXJndW1lbnRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDA7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fc3RhdGU7XG4gICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZG9EZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgdmFyIHJlcSA9IF90aGlzLl9kZXBzLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShfdGhpcy5uYW1lKTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9IHdyYXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX29uRGF0YWJhc2VEZWxldGVkKF90aGlzLl9kZXBzLCBfdGhpcy5uYW1lKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICByZXEub25ibG9ja2VkID0gX3RoaXMuX2ZpcmVPbkJsb2NrZWQ7XG4gICAgICB9O1xuICAgICAgaWYgKGhhc0FyZ3VtZW50cylcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiQXJndW1lbnRzIG5vdCBhbGxvd2VkIGluIGRiLmRlbGV0ZSgpXCIpO1xuICAgICAgaWYgKHN0YXRlLmlzQmVpbmdPcGVuZWQpIHtcbiAgICAgICAgc3RhdGUuZGJSZWFkeVByb21pc2UudGhlbihkb0RlbGV0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb0RlbGV0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmJhY2tlbmREQiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlkYmRiO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmlzT3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlkYmRiICE9PSBudWxsO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmhhc0JlZW5DbG9zZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGJPcGVuRXJyb3IgPSB0aGlzLl9zdGF0ZS5kYk9wZW5FcnJvcjtcbiAgICByZXR1cm4gZGJPcGVuRXJyb3IgJiYgZGJPcGVuRXJyb3IubmFtZSA9PT0gXCJEYXRhYmFzZUNsb3NlZFwiO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmhhc0ZhaWxlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5kYk9wZW5FcnJvciAhPT0gbnVsbDtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5keW5hbWljYWxseU9wZW5lZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5hdXRvU2NoZW1hO1xuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGV4aWUyLnByb3RvdHlwZSwgXCJ0YWJsZXNcIiwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgcmV0dXJuIGtleXModGhpcy5fYWxsVGFibGVzKS5tYXAoZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuX2FsbFRhYmxlc1tuYW1lXTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBEZXhpZTIucHJvdG90eXBlLnRyYW5zYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBleHRyYWN0VHJhbnNhY3Rpb25BcmdzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zYWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLl90cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKG1vZGUsIHRhYmxlcywgc2NvcGVGdW5jKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgcGFyZW50VHJhbnNhY3Rpb24gPSBQU0QudHJhbnM7XG4gICAgaWYgKCFwYXJlbnRUcmFuc2FjdGlvbiB8fCBwYXJlbnRUcmFuc2FjdGlvbi5kYiAhPT0gdGhpcyB8fCBtb2RlLmluZGV4T2YoXCIhXCIpICE9PSAtMSlcbiAgICAgIHBhcmVudFRyYW5zYWN0aW9uID0gbnVsbDtcbiAgICB2YXIgb25seUlmQ29tcGF0aWJsZSA9IG1vZGUuaW5kZXhPZihcIj9cIikgIT09IC0xO1xuICAgIG1vZGUgPSBtb2RlLnJlcGxhY2UoXCIhXCIsIFwiXCIpLnJlcGxhY2UoXCI/XCIsIFwiXCIpO1xuICAgIHZhciBpZGJNb2RlLCBzdG9yZU5hbWVzO1xuICAgIHRyeSB7XG4gICAgICBzdG9yZU5hbWVzID0gdGFibGVzLm1hcChmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICB2YXIgc3RvcmVOYW1lID0gdGFibGUgaW5zdGFuY2VvZiBfdGhpcy5UYWJsZSA/IHRhYmxlLm5hbWUgOiB0YWJsZTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZU5hbWUgIT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdGFibGUgYXJndW1lbnQgdG8gRGV4aWUudHJhbnNhY3Rpb24oKS4gT25seSBUYWJsZSBvciBTdHJpbmcgYXJlIGFsbG93ZWRcIik7XG4gICAgICAgIHJldHVybiBzdG9yZU5hbWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChtb2RlID09IFwiclwiIHx8IG1vZGUgPT09IFJFQURPTkxZKVxuICAgICAgICBpZGJNb2RlID0gUkVBRE9OTFk7XG4gICAgICBlbHNlIGlmIChtb2RlID09IFwicndcIiB8fCBtb2RlID09IFJFQURXUklURSlcbiAgICAgICAgaWRiTW9kZSA9IFJFQURXUklURTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiSW52YWxpZCB0cmFuc2FjdGlvbiBtb2RlOiBcIiArIG1vZGUpO1xuICAgICAgaWYgKHBhcmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICAgIGlmIChwYXJlbnRUcmFuc2FjdGlvbi5tb2RlID09PSBSRUFET05MWSAmJiBpZGJNb2RlID09PSBSRUFEV1JJVEUpIHtcbiAgICAgICAgICBpZiAob25seUlmQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgcGFyZW50VHJhbnNhY3Rpb24gPSBudWxsO1xuICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU3ViVHJhbnNhY3Rpb24oXCJDYW5ub3QgZW50ZXIgYSBzdWItdHJhbnNhY3Rpb24gd2l0aCBSRUFEV1JJVEUgbW9kZSB3aGVuIHBhcmVudCB0cmFuc2FjdGlvbiBpcyBSRUFET05MWVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50VHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICBzdG9yZU5hbWVzLmZvckVhY2goZnVuY3Rpb24oc3RvcmVOYW1lKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50VHJhbnNhY3Rpb24gJiYgcGFyZW50VHJhbnNhY3Rpb24uc3RvcmVOYW1lcy5pbmRleE9mKHN0b3JlTmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChvbmx5SWZDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50VHJhbnNhY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TdWJUcmFuc2FjdGlvbihcIlRhYmxlIFwiICsgc3RvcmVOYW1lICsgXCIgbm90IGluY2x1ZGVkIGluIHBhcmVudCB0cmFuc2FjdGlvbi5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9ubHlJZkNvbXBhdGlibGUgJiYgcGFyZW50VHJhbnNhY3Rpb24gJiYgIXBhcmVudFRyYW5zYWN0aW9uLmFjdGl2ZSkge1xuICAgICAgICAgIHBhcmVudFRyYW5zYWN0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwYXJlbnRUcmFuc2FjdGlvbiA/IHBhcmVudFRyYW5zYWN0aW9uLl9wcm9taXNlKG51bGwsIGZ1bmN0aW9uKF8sIHJlamVjdCkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9KSA6IHJlamVjdGlvbihlKTtcbiAgICB9XG4gICAgdmFyIGVudGVyVHJhbnNhY3Rpb24gPSBlbnRlclRyYW5zYWN0aW9uU2NvcGUuYmluZChudWxsLCB0aGlzLCBpZGJNb2RlLCBzdG9yZU5hbWVzLCBwYXJlbnRUcmFuc2FjdGlvbiwgc2NvcGVGdW5jKTtcbiAgICByZXR1cm4gcGFyZW50VHJhbnNhY3Rpb24gPyBwYXJlbnRUcmFuc2FjdGlvbi5fcHJvbWlzZShpZGJNb2RlLCBlbnRlclRyYW5zYWN0aW9uLCBcImxvY2tcIikgOiBQU0QudHJhbnMgPyB1c2VQU0QoUFNELnRyYW5zbGVzcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX3RoaXMuX3doZW5SZWFkeShlbnRlclRyYW5zYWN0aW9uKTtcbiAgICB9KSA6IHRoaXMuX3doZW5SZWFkeShlbnRlclRyYW5zYWN0aW9uKTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS50YWJsZSA9IGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgIGlmICghaGFzT3duKHRoaXMuX2FsbFRhYmxlcywgdGFibGVOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZFRhYmxlKFwiVGFibGUgXCIgKyB0YWJsZU5hbWUgKyBcIiBkb2VzIG5vdCBleGlzdFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2FsbFRhYmxlc1t0YWJsZU5hbWVdO1xuICB9O1xuICByZXR1cm4gRGV4aWUyO1xufSgpO1xudmFyIHN5bWJvbE9ic2VydmFibGUgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIFwib2JzZXJ2YWJsZVwiIGluIFN5bWJvbCA/IFN5bWJvbFtcIm9ic2VydmFibGVcIl0gOiBcIkBAb2JzZXJ2YWJsZVwiO1xudmFyIE9ic2VydmFibGUgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gT2JzZXJ2YWJsZTIoc3Vic2NyaWJlKSB7XG4gICAgdGhpcy5fc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICB9XG4gIE9ic2VydmFibGUyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbih4LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgPyB7bmV4dDogeCwgZXJyb3IsIGNvbXBsZXRlfSA6IHgpO1xuICB9O1xuICBPYnNlcnZhYmxlMi5wcm90b3R5cGVbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcmV0dXJuIE9ic2VydmFibGUyO1xufSgpO1xuZnVuY3Rpb24gZXh0ZW5kT2JzZXJ2YWJpbGl0eVNldCh0YXJnZXQsIG5ld1NldCkge1xuICBrZXlzKG5ld1NldCkuZm9yRWFjaChmdW5jdGlvbihwYXJ0KSB7XG4gICAgdmFyIHJhbmdlU2V0ID0gdGFyZ2V0W3BhcnRdIHx8ICh0YXJnZXRbcGFydF0gPSBuZXcgUmFuZ2VTZXQoKSk7XG4gICAgbWVyZ2VSYW5nZXMocmFuZ2VTZXQsIG5ld1NldFtwYXJ0XSk7XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gbGl2ZVF1ZXJ5KHF1ZXJpZXIpIHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uKG9ic2VydmVyKSB7XG4gICAgdmFyIHNjb3BlRnVuY0lzQXN5bmMgPSBpc0FzeW5jRnVuY3Rpb24ocXVlcmllcik7XG4gICAgZnVuY3Rpb24gZXhlY3V0ZShzdWJzY3IpIHtcbiAgICAgIGlmIChzY29wZUZ1bmNJc0FzeW5jKSB7XG4gICAgICAgIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgICB9XG4gICAgICB2YXIgZXhlYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3U2NvcGUocXVlcmllciwge3N1YnNjciwgdHJhbnM6IG51bGx9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcnYgPSBQU0QudHJhbnMgPyB1c2VQU0QoUFNELnRyYW5zbGVzcywgZXhlYykgOiBleGVjKCk7XG4gICAgICBpZiAoc2NvcGVGdW5jSXNBc3luYykge1xuICAgICAgICBydi50aGVuKGRlY3JlbWVudEV4cGVjdGVkQXdhaXRzLCBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcnY7XG4gICAgfVxuICAgIHZhciBjbG9zZWQgPSBmYWxzZTtcbiAgICB2YXIgYWNjdW1NdXRzID0ge307XG4gICAgdmFyIGN1cnJlbnRPYnMgPSB7fTtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0ge1xuICAgICAgZ2V0IGNsb3NlZCgpIHtcbiAgICAgICAgcmV0dXJuIGNsb3NlZDtcbiAgICAgIH0sXG4gICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICAgIGdsb2JhbEV2ZW50cy50eGNvbW1pdHRlZC51bnN1YnNjcmliZShtdXRhdGlvbkxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG9ic2VydmVyLnN0YXJ0ICYmIG9ic2VydmVyLnN0YXJ0KHN1YnNjcmlwdGlvbik7XG4gICAgdmFyIHF1ZXJ5aW5nID0gZmFsc2UsIHN0YXJ0ZWRMaXN0ZW5pbmcgPSBmYWxzZTtcbiAgICBmdW5jdGlvbiBzaG91bGROb3RpZnkoKSB7XG4gICAgICByZXR1cm4ga2V5cyhjdXJyZW50T2JzKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gYWNjdW1NdXRzW2tleV0gJiYgcmFuZ2VzT3ZlcmxhcChhY2N1bU11dHNba2V5XSwgY3VycmVudE9ic1trZXldKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbXV0YXRpb25MaXN0ZW5lciA9IGZ1bmN0aW9uKHBhcnRzKSB7XG4gICAgICBleHRlbmRPYnNlcnZhYmlsaXR5U2V0KGFjY3VtTXV0cywgcGFydHMpO1xuICAgICAgaWYgKHNob3VsZE5vdGlmeSgpKSB7XG4gICAgICAgIGRvUXVlcnkoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkb1F1ZXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocXVlcnlpbmcgfHwgY2xvc2VkKVxuICAgICAgICByZXR1cm47XG4gICAgICBhY2N1bU11dHMgPSB7fTtcbiAgICAgIHZhciBzdWJzY3IgPSB7fTtcbiAgICAgIHZhciByZXQgPSBleGVjdXRlKHN1YnNjcik7XG4gICAgICBpZiAoIXN0YXJ0ZWRMaXN0ZW5pbmcpIHtcbiAgICAgICAgZ2xvYmFsRXZlbnRzKFwidHhjb21taXR0ZWRcIiwgbXV0YXRpb25MaXN0ZW5lcik7XG4gICAgICAgIHN0YXJ0ZWRMaXN0ZW5pbmcgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcXVlcnlpbmcgPSB0cnVlO1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHJldCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgcXVlcnlpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKGNsb3NlZClcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChzaG91bGROb3RpZnkoKSkge1xuICAgICAgICAgIGRvUXVlcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY2N1bU11dHMgPSB7fTtcbiAgICAgICAgICBjdXJyZW50T2JzID0gc3Vic2NyO1xuICAgICAgICAgIG9ic2VydmVyLm5leHQgJiYgb2JzZXJ2ZXIubmV4dChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgcXVlcnlpbmcgPSBmYWxzZTtcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IgJiYgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGRvUXVlcnkoKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9KTtcbn1cbnZhciBEZXhpZSA9IERleGllJDE7XG5wcm9wcyhEZXhpZSwgX19hc3NpZ24oX19hc3NpZ24oe30sIGZ1bGxOYW1lRXhjZXB0aW9ucyksIHtcbiAgZGVsZXRlOiBmdW5jdGlvbihkYXRhYmFzZU5hbWUpIHtcbiAgICB2YXIgZGIgPSBuZXcgRGV4aWUoZGF0YWJhc2VOYW1lKTtcbiAgICByZXR1cm4gZGIuZGVsZXRlKCk7XG4gIH0sXG4gIGV4aXN0czogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBuZXcgRGV4aWUobmFtZSwge2FkZG9uczogW119KS5vcGVuKCkudGhlbihmdW5jdGlvbihkYikge1xuICAgICAgZGIuY2xvc2UoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pLmNhdGNoKFwiTm9TdWNoRGF0YWJhc2VFcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0RGF0YWJhc2VOYW1lczogZnVuY3Rpb24oY2IpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGdldERhdGFiYXNlTmFtZXMoRGV4aWUuZGVwZW5kZW5jaWVzKS50aGVuKGNiKTtcbiAgICB9IGNhdGNoIChfYTIpIHtcbiAgICAgIHJldHVybiByZWplY3Rpb24obmV3IGV4Y2VwdGlvbnMuTWlzc2luZ0FQSSgpKTtcbiAgICB9XG4gIH0sXG4gIGRlZmluZUNsYXNzOiBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBDbGFzcyhjb250ZW50KSB7XG4gICAgICBleHRlbmQodGhpcywgY29udGVudCk7XG4gICAgfVxuICAgIHJldHVybiBDbGFzcztcbiAgfSxcbiAgaWdub3JlVHJhbnNhY3Rpb246IGZ1bmN0aW9uKHNjb3BlRnVuYykge1xuICAgIHJldHVybiBQU0QudHJhbnMgPyB1c2VQU0QoUFNELnRyYW5zbGVzcywgc2NvcGVGdW5jKSA6IHNjb3BlRnVuYygpO1xuICB9LFxuICB2aXAsXG4gIGFzeW5jOiBmdW5jdGlvbihnZW5lcmF0b3JGbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBydiA9IGF3YWl0SXRlcmF0b3IoZ2VuZXJhdG9yRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICAgIGlmICghcnYgfHwgdHlwZW9mIHJ2LnRoZW4gIT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUocnYpO1xuICAgICAgICByZXR1cm4gcnY7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiByZWplY3Rpb24oZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgc3Bhd246IGZ1bmN0aW9uKGdlbmVyYXRvckZuLCBhcmdzLCB0aGl6KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBydiA9IGF3YWl0SXRlcmF0b3IoZ2VuZXJhdG9yRm4uYXBwbHkodGhpeiwgYXJncyB8fCBbXSkpO1xuICAgICAgaWYgKCFydiB8fCB0eXBlb2YgcnYudGhlbiAhPT0gXCJmdW5jdGlvblwiKVxuICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUocnYpO1xuICAgICAgcmV0dXJuIHJ2O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiByZWplY3Rpb24oZSk7XG4gICAgfVxuICB9LFxuICBjdXJyZW50VHJhbnNhY3Rpb246IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBTRC50cmFucyB8fCBudWxsO1xuICAgIH1cbiAgfSxcbiAgd2FpdEZvcjogZnVuY3Rpb24ocHJvbWlzZU9yRnVuY3Rpb24sIG9wdGlvbmFsVGltZW91dCkge1xuICAgIHZhciBwcm9taXNlID0gRGV4aWVQcm9taXNlLnJlc29sdmUodHlwZW9mIHByb21pc2VPckZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIgPyBEZXhpZS5pZ25vcmVUcmFuc2FjdGlvbihwcm9taXNlT3JGdW5jdGlvbikgOiBwcm9taXNlT3JGdW5jdGlvbikudGltZW91dChvcHRpb25hbFRpbWVvdXQgfHwgNmU0KTtcbiAgICByZXR1cm4gUFNELnRyYW5zID8gUFNELnRyYW5zLndhaXRGb3IocHJvbWlzZSkgOiBwcm9taXNlO1xuICB9LFxuICBQcm9taXNlOiBEZXhpZVByb21pc2UsXG4gIGRlYnVnOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHNldERlYnVnKHZhbHVlLCB2YWx1ZSA9PT0gXCJkZXhpZVwiID8gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSA6IGRleGllU3RhY2tGcmFtZUZpbHRlcik7XG4gICAgfVxuICB9LFxuICBkZXJpdmUsXG4gIGV4dGVuZCxcbiAgcHJvcHMsXG4gIG92ZXJyaWRlLFxuICBFdmVudHMsXG4gIG9uOiBnbG9iYWxFdmVudHMsXG4gIGxpdmVRdWVyeSxcbiAgZXh0ZW5kT2JzZXJ2YWJpbGl0eVNldCxcbiAgZ2V0QnlLZXlQYXRoLFxuICBzZXRCeUtleVBhdGgsXG4gIGRlbEJ5S2V5UGF0aCxcbiAgc2hhbGxvd0Nsb25lLFxuICBkZWVwQ2xvbmUsXG4gIGdldE9iamVjdERpZmYsXG4gIGFzYXA6IGFzYXAkMSxcbiAgbWluS2V5LFxuICBhZGRvbnM6IFtdLFxuICBjb25uZWN0aW9ucyxcbiAgZXJybmFtZXMsXG4gIGRlcGVuZGVuY2llczogZG9tRGVwcyxcbiAgc2VtVmVyOiBERVhJRV9WRVJTSU9OLFxuICB2ZXJzaW9uOiBERVhJRV9WRVJTSU9OLnNwbGl0KFwiLlwiKS5tYXAoZnVuY3Rpb24obikge1xuICAgIHJldHVybiBwYXJzZUludChuKTtcbiAgfSkucmVkdWNlKGZ1bmN0aW9uKHAsIGMsIGkpIHtcbiAgICByZXR1cm4gcCArIGMgLyBNYXRoLnBvdygxMCwgaSAqIDIpO1xuICB9KVxufSkpO1xuRGV4aWUubWF4S2V5ID0gZ2V0TWF4S2V5KERleGllLmRlcGVuZGVuY2llcy5JREJLZXlSYW5nZSk7XG5mdW5jdGlvbiBmaXJlTG9jYWxseSh1cGRhdGVQYXJ0cykge1xuICB2YXIgd2FzTWUgPSBwcm9wYWdhdGluZ0xvY2FsbHk7XG4gIHRyeSB7XG4gICAgcHJvcGFnYXRpbmdMb2NhbGx5ID0gdHJ1ZTtcbiAgICBnbG9iYWxFdmVudHMudHhjb21taXR0ZWQuZmlyZSh1cGRhdGVQYXJ0cyk7XG4gIH0gZmluYWxseSB7XG4gICAgcHJvcGFnYXRpbmdMb2NhbGx5ID0gd2FzTWU7XG4gIH1cbn1cbnZhciBwcm9wYWdhdGVMb2NhbGx5ID0gZmlyZUxvY2FsbHk7XG52YXIgcHJvcGFnYXRpbmdMb2NhbGx5ID0gZmFsc2U7XG52YXIgYWNjdW11bGF0ZWRQYXJ0cyA9IHt9O1xuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gIHZhciBmaXJlSWZWaXNpYmxlXzEgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcInZpc2libGVcIikge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGFjY3VtdWxhdGVkUGFydHMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmlyZUxvY2FsbHkoYWNjdW11bGF0ZWRQYXJ0cyk7XG4gICAgICB9XG4gICAgICBhY2N1bXVsYXRlZFBhcnRzID0ge307XG4gICAgfVxuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBmaXJlSWZWaXNpYmxlXzEpO1xuICBwcm9wYWdhdGVMb2NhbGx5ID0gZnVuY3Rpb24oY2hhbmdlZFBhcnRzKSB7XG4gICAgZXh0ZW5kT2JzZXJ2YWJpbGl0eVNldChhY2N1bXVsYXRlZFBhcnRzLCBjaGFuZ2VkUGFydHMpO1xuICAgIGZpcmVJZlZpc2libGVfMSgpO1xuICB9O1xufVxuaWYgKHR5cGVvZiBCcm9hZGNhc3RDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIHZhciBiY18xID0gbmV3IEJyb2FkY2FzdENoYW5uZWwoXCJkZXhpZS10eGNvbW1pdHRlZFwiKTtcbiAgZ2xvYmFsRXZlbnRzKFwidHhjb21taXR0ZWRcIiwgZnVuY3Rpb24oY2hhbmdlZFBhcnRzKSB7XG4gICAgaWYgKCFwcm9wYWdhdGluZ0xvY2FsbHkpIHtcbiAgICAgIGJjXzEucG9zdE1lc3NhZ2UoY2hhbmdlZFBhcnRzKTtcbiAgICB9XG4gIH0pO1xuICBiY18xLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgaWYgKGV2LmRhdGEpXG4gICAgICBwcm9wYWdhdGVMb2NhbGx5KGV2LmRhdGEpO1xuICB9O1xufSBlbHNlIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIGdsb2JhbEV2ZW50cyhcInR4Y29tbWl0dGVkXCIsIGZ1bmN0aW9uKGNoYW5nZWRQYXJ0cykge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXByb3BhZ2F0aW5nTG9jYWxseSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRleGllLXR4Y29tbWl0dGVkXCIsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICB0cmlnOiBNYXRoLnJhbmRvbSgpLFxuICAgICAgICAgIGNoYW5nZWRQYXJ0c1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoX2EyKSB7XG4gICAgfVxuICB9KTtcbiAgYWRkRXZlbnRMaXN0ZW5lcihcInN0b3JhZ2VcIiwgZnVuY3Rpb24oZXYpIHtcbiAgICBpZiAoZXYua2V5ID09PSBcImRleGllLXR4Y29tbWl0dGVkXCIpIHtcbiAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShldi5uZXdWYWx1ZSk7XG4gICAgICBpZiAoZGF0YSlcbiAgICAgICAgcHJvcGFnYXRlTG9jYWxseShkYXRhLmNoYW5nZWRQYXJ0cyk7XG4gICAgfVxuICB9KTtcbn1cbkRleGllUHJvbWlzZS5yZWplY3Rpb25NYXBwZXIgPSBtYXBFcnJvcjtcbnNldERlYnVnKGRlYnVnLCBkZXhpZVN0YWNrRnJhbWVGaWx0ZXIpO1xuZXhwb3J0IGRlZmF1bHQgRGV4aWUkMTtcbmV4cG9ydCB7RGV4aWUkMSBhcyBEZXhpZSwgUmFuZ2VTZXQsIGxpdmVRdWVyeSwgbWVyZ2VSYW5nZXMsIHJhbmdlc092ZXJsYXB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxld29nSUNKMlpYSnphVzl1SWpvZ015d0tJQ0FpYzI5MWNtTmxjeUk2SUZzaUwyaHZiV1V2Y25WdWJtVnlMM2R2Y21zdmJXOXVaWGt2Ylc5dVpYa3ZibTlrWlY5dGIyUjFiR1Z6TDJSbGVHbGxMMlJwYzNRdlpHVjRhV1V1YldweklsMHNDaUFnSW0xaGNIQnBibWR6SWpvZ0lrRkJZVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQldVRXNTVUZCU1N4WFFVRlhMRmRCUVZjN1FVRkRkRUlzWVVGQlZ5eFBRVUZQTEZWQlFWVXNiVUpCUVd0Q0xFZEJRVWM3UVVGRE4wTXNZVUZCVXl4SFFVRkhMRWxCUVVrc1IwRkJSeXhKUVVGSkxGVkJRVlVzVVVGQlVTeEpRVUZKTEVkQlFVY3NTMEZCU3p0QlFVTnFSQ3hWUVVGSkxGVkJRVlU3UVVGRFpDeGxRVUZUTEV0QlFVczdRVUZCUnl4WlFVRkpMRTlCUVU4c1ZVRkJWU3hsUVVGbExFdEJRVXNzUjBGQlJ6dEJRVUZKTEZsQlFVVXNTMEZCU3l4RlFVRkZPMEZCUVVFN1FVRkZPVVVzVjBGQlR6dEJRVUZCTzBGQlJWZ3NVMEZCVHl4VFFVRlRMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJSV2hETEhWQ1FVRjFRaXhKUVVGSkxFMUJRVTA3UVVGRE4wSXNWMEZCVXl4SlFVRkpMRWRCUVVjc1MwRkJTeXhMUVVGTExGRkJRVkVzU1VGQlNTeEhRVUZITEZGQlFWRXNTVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRNVVFzVDBGQlJ5eExRVUZMTEV0QlFVczdRVUZEYWtJc1UwRkJUenRCUVVGQk8wRkJSMWdzU1VGQlNTeFBRVUZQTEU5QlFVODdRVUZEYkVJc1NVRkJTU3hWUVVGVkxFMUJRVTA3UVVGRGNFSXNTVUZCU1N4VlFVRlZMRTlCUVU4c1UwRkJVeXhqUVVGakxFOUJRM2hETEU5QlFVOHNWMEZCVnl4alFVRmpMRk5CUXpWQ08wRkJRMUlzU1VGQlNTeFBRVUZQTEZsQlFWa3NaVUZCWlN4RFFVRkRMRkZCUVZFc1UwRkJVenRCUVVOd1JDeFZRVUZSTEZWQlFWVTdRVUZCUVR0QlFVVjBRaXhuUWtGQlowSXNTMEZCU3l4WFFVRlhPMEZCUXpWQ0xFMUJRVWtzVDBGQlR5eGpRVUZqTzBGQlEzSkNMRmRCUVU4N1FVRkRXQ3hQUVVGTExGZEJRVmNzVVVGQlVTeFRRVUZWTEV0QlFVczdRVUZEYmtNc1VVRkJTU3hQUVVGUExGVkJRVlU3UVVGQlFUdEJRVVY2UWl4VFFVRlBPMEZCUVVFN1FVRkZXQ3hKUVVGSkxGZEJRVmNzVDBGQlR6dEJRVU4wUWl4SlFVRkpMRlZCUVZVc1IwRkJSenRCUVVOcVFpeG5Ra0ZCWjBJc1MwRkJTeXhOUVVGTk8wRkJRM1pDTEZOQlFVOHNVVUZCVVN4TFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVVM1FpeGxRVUZsTEU5QlFVOHNWMEZCVnp0QlFVTTNRaXhOUVVGSkxFOUJRVThzWTBGQll6dEJRVU55UWl4blFrRkJXU3hWUVVGVkxGTkJRVk03UVVGRGJrTXNSVUZCUXl4UlFVRlBMRmxCUVZrc1kwRkJZeXhQUVVGUExGRkJRVkVzVTBGQlV5eFhRVUZYTEZGQlFWRXNVMEZCVlN4TFFVRkxPMEZCUTNoR0xGbEJRVkVzVDBGQlR5eExRVUZMTEZWQlFWVTdRVUZCUVR0QlFVRkJPMEZCUjNSRExFbEJRVWtzYVVKQlFXbENMRTlCUVU4N1FVRkROVUlzYVVKQlFXbENMRXRCUVVzc1RVRkJUU3hyUWtGQmEwSXNVMEZCVXp0QlFVTnVSQ3hwUWtGQlpTeExRVUZMTEUxQlFVMHNUMEZCVHl4dlFrRkJiMElzVDBGQlR5eHJRa0ZCYTBJc1ZVRkJWU3hQUVVGUExHbENRVUZwUWl4UlFVRlJMR0ZCUTNCSUxFTkJRVVVzUzBGQlN5eHBRa0ZCYVVJc1MwRkJTeXhMUVVGTExHbENRVUZwUWl4TFFVRkxMR05CUVdNc1VVRkRkRVVzUTBGQlJTeFBRVUZQTEd0Q1FVRnJRaXhqUVVGakxFMUJRVTBzVlVGQlZTeFBRVUZSTzBGQlFVRTdRVUZGZWtVc1owSkJRV2RDTEU5QlFVODdRVUZEYmtJc1UwRkJUenRCUVVGQkxFbEJRMGdzVFVGQlRTeFRRVUZWTEZGQlFWRTdRVUZEY0VJc1dVRkJUU3haUVVGWkxFOUJRVThzVDBGQlR5eFBRVUZQTzBGQlEzWkRMR05CUVZFc1RVRkJUU3hYUVVGWExHVkJRV1U3UVVGRGVFTXNZVUZCVHp0QlFVRkJMRkZCUTBnc1VVRkJVU3hOUVVGTkxFdEJRVXNzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxMME1zU1VGQlNTd3lRa0ZCTWtJc1QwRkJUenRCUVVOMFF5d3JRa0ZCSzBJc1MwRkJTeXhOUVVGTk8wRkJRM1JETEUxQlFVa3NTMEZCU3l4NVFrRkJlVUlzUzBGQlN6dEJRVU4yUXl4TlFVRkpPMEZCUTBvc1UwRkJUeXhOUVVGUExGTkJRVkVzVTBGQlV5eFRRVUZUTEhOQ1FVRnpRaXhQUVVGUE8wRkJRVUU3UVVGRmVrVXNTVUZCU1N4VFFVRlRMRWRCUVVjN1FVRkRhRUlzWlVGQlpTeE5RVUZOTEU5QlFVOHNTMEZCU3p0QlFVTTNRaXhUUVVGUExFOUJRVThzUzBGQlN5eE5RVUZOTEU5QlFVODdRVUZCUVR0QlFVVndReXhyUWtGQmEwSXNWVUZCVlN4clFrRkJhMEk3UVVGRE1VTXNVMEZCVHl4cFFrRkJhVUk3UVVGQlFUdEJRVVUxUWl4blFrRkJaMElzUjBGQlJ6dEJRVU5tTEUxQlFVa3NRMEZCUXp0QlFVTkVMRlZCUVUwc1NVRkJTU3hOUVVGTk8wRkJRVUU3UVVGRmVFSXNaMEpCUVdkQ0xFbEJRVWs3UVVGRGFFSXNUVUZCU1N4UlFVRlJPMEZCUTFJc2FVSkJRV0U3UVVGQlFUdEJRVVZpTEdWQlFWY3NTVUZCU1R0QlFVRkJPMEZCUlhaQ0xIVkNRVUYxUWl4UFFVRlBMRmRCUVZjN1FVRkRja01zVTBGQlR5eE5RVUZOTEU5QlFVOHNVMEZCVlN4UlFVRlJMRTFCUVUwc1IwRkJSenRCUVVNelF5eFJRVUZKTEdWQlFXVXNWVUZCVlN4TlFVRk5PMEZCUTI1RExGRkJRVWs3UVVGRFFTeGhRVUZQTEdGQlFXRXNUVUZCVFN4aFFVRmhPMEZCUXpORExGZEJRVTg3UVVGQlFTeExRVU5TTzBGQlFVRTdRVUZGVUN4clFrRkJhMElzU1VGQlNTeFRRVUZUTEUxQlFVMDdRVUZEYWtNc1RVRkJTVHRCUVVOQkxFOUJRVWNzVFVGQlRTeE5RVUZOTzBGQlFVRXNWMEZGV2l4SlFVRlFPMEZCUTBrc1pVRkJWeXhSUVVGUk8wRkJRVUU3UVVGQlFUdEJRVWN6UWl4elFrRkJjMElzUzBGQlN5eFRRVUZUTzBGQlEyaERMRTFCUVVrc1QwRkJUeXhMUVVGTE8wRkJRMW9zVjBGQlR5eEpRVUZKTzBGQlEyWXNUVUZCU1N4RFFVRkRPMEZCUTBRc1YwRkJUenRCUVVOWUxFMUJRVWtzVDBGQlR5eFpRVUZaTEZWQlFWVTdRVUZETjBJc1VVRkJTU3hMUVVGTE8wRkJRMVFzWVVGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4UlFVRlJMRkZCUVZFc1NVRkJTU3hIUVVGSExFVkJRVVVzUjBGQlJ6dEJRVU0xUXl4VlFVRkpMRTFCUVUwc1lVRkJZU3hMUVVGTExGRkJRVkU3UVVGRGNFTXNVMEZCUnl4TFFVRkxPMEZCUVVFN1FVRkZXaXhYUVVGUE8wRkJRVUU3UVVGRldDeE5RVUZKTEZOQlFWTXNVVUZCVVN4UlFVRlJPMEZCUXpkQ0xFMUJRVWtzVjBGQlZ5eEpRVUZKTzBGQlEyWXNVVUZCU1N4WFFVRlhMRWxCUVVrc1VVRkJVU3hQUVVGUExFZEJRVWM3UVVGRGNrTXNWMEZCVHl4aFFVRmhMRk5CUVZrc1UwRkJXU3hoUVVGaExGVkJRVlVzVVVGQlVTeFBRVUZQTEZOQlFWTTdRVUZCUVR0QlFVVXZSaXhUUVVGUE8wRkJRVUU3UVVGRldDeHpRa0ZCYzBJc1MwRkJTeXhUUVVGVExFOUJRVTg3UVVGRGRrTXNUVUZCU1N4RFFVRkRMRTlCUVU4c1dVRkJXVHRCUVVOd1FqdEJRVU5LTEUxQlFVa3NZMEZCWXl4VlFVRlZMRTlCUVU4c1UwRkJVenRCUVVONFF6dEJRVU5LTEUxQlFVa3NUMEZCVHl4WlFVRlpMRmxCUVZrc1dVRkJXU3hUUVVGVE8wRkJRM0JFTEZkQlFVOHNUMEZCVHl4VlFVRlZMRmxCUVZrc1dVRkJXVHRCUVVOb1JDeGhRVUZUTEVsQlFVa3NSMEZCUnl4SlFVRkpMRkZCUVZFc1VVRkJVU3hKUVVGSkxFZEJRVWNzUlVGQlJTeEhRVUZITzBGQlF6VkRMRzFDUVVGaExFdEJRVXNzVVVGQlVTeEpRVUZKTEUxQlFVMDdRVUZCUVR0QlFVRkJMRk5CUjNaRE8wRkJRMFFzVVVGQlNTeFRRVUZUTEZGQlFWRXNVVUZCVVR0QlFVTTNRaXhSUVVGSkxGZEJRVmNzU1VGQlNUdEJRVU5tTEZWQlFVa3NhVUpCUVdsQ0xGRkJRVkVzVDBGQlR5eEhRVUZITzBGQlEzWkRMRlZCUVVrc2JVSkJRVzFDTEZGQlFWRXNUMEZCVHl4VFFVRlRPMEZCUXk5RExGVkJRVWtzY1VKQlFYRkNPMEZCUTNKQ0xGbEJRVWtzVlVGQlZTeFJRVUZYTzBGQlEzSkNMR05CUVVrc1VVRkJVU3hSUVVGUkxFTkJRVU1zVFVGQlRTeFRRVUZUTzBGQlEyaERMR2RDUVVGSkxFOUJRVThzWjBKQlFXZENPMEZCUVVFN1FVRkZNMElzYlVKQlFVOHNTVUZCU1R0QlFVRkJPMEZCUjJZc1kwRkJTU3hyUWtGQmEwSTdRVUZCUVN4WFFVTjZRanRCUVVORUxGbEJRVWtzVjBGQlZ5eEpRVUZKTzBGQlEyNUNMRmxCUVVrc1EwRkJRenRCUVVORUxIRkNRVUZaTEVsQlFVa3NhMEpCUVd0Q08wRkJRM1JETEhGQ1FVRmhMRlZCUVZVc2EwSkJRV3RDTzBGQlFVRTdRVUZCUVN4WFFVYzFRenRCUVVORUxGVkJRVWtzVlVGQlZTeFJRVUZYTzBGQlEzSkNMRmxCUVVrc1VVRkJVU3hSUVVGUkxFTkJRVU1zVFVGQlRTeFRRVUZUTzBGQlEyaERMR05CUVVrc1QwRkJUeXhUUVVGVE8wRkJRVUU3UVVGRmNFSXNhVUpCUVU4c1NVRkJTVHRCUVVGQk8wRkJSMllzV1VGQlNTeFhRVUZYTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1M5Q0xITkNRVUZ6UWl4TFFVRkxMRk5CUVZNN1FVRkRhRU1zVFVGQlNTeFBRVUZQTEZsQlFWazdRVUZEYmtJc2FVSkJRV0VzUzBGQlN5eFRRVUZUTzBGQlFVRXNWMEZEZEVJc1dVRkJXVHRCUVVOcVFpeFBRVUZITEVsQlFVa3NTMEZCU3l4VFFVRlRMRk5CUVZVc1NVRkJTVHRCUVVNdlFpeHRRa0ZCWVN4TFFVRkxMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJSMnhETEhOQ1FVRnpRaXhMUVVGTE8wRkJRM1pDTEUxQlFVa3NTMEZCU3p0QlFVTlVMRmRCUVZNc1MwRkJTeXhMUVVGTE8wRkJRMllzVVVGQlNTeFBRVUZQTEV0QlFVczdRVUZEV2l4VFFVRkhMRXRCUVVzc1NVRkJTVHRCUVVGQk8wRkJSWEJDTEZOQlFVODdRVUZCUVR0QlFVVllMRWxCUVVrc1UwRkJVeXhIUVVGSE8wRkJRMmhDTEdsQ1FVRnBRaXhIUVVGSE8wRkJRMmhDTEZOQlFVOHNUMEZCVHl4TlFVRk5MRWxCUVVrN1FVRkJRVHRCUVVVMVFpeEpRVUZKTEhGQ1FVRnhRaXdyU0VGRGNFSXNUVUZCVFN4TFFVRkxMRTlCUVU4c1VVRkJVU3hEUVVGRExFZEJRVWNzU1VGQlNTeEpRVUZKTEVsQlFVa3NTVUZCU1N4VFFVRlZMRXRCUVVzN1FVRkJSU3hUUVVGUExFTkJRVU1zVDBGQlR5eFJRVUZSTEZOQlFWTXNTVUZCU1N4VFFVRlZMRWRCUVVjN1FVRkJSU3hYUVVGUExFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlFVRXNTMEZCYTBJc1QwRkJUeXhUUVVGVkxFZEJRVWM3UVVGQlJTeFRRVUZQTEZGQlFWRTdRVUZCUVR0QlFVTXZUQ3hKUVVGSkxHbENRVUZwUWl4dFFrRkJiVUlzU1VGQlNTeFRRVUZWTEVkQlFVYzdRVUZCUlN4VFFVRlBMRkZCUVZFN1FVRkJRVHRCUVVNeFJTeEpRVUZKTEhWQ1FVRjFRaXhqUVVGakxHOUNRVUZ2UWl4VFFVRlZMRWRCUVVjN1FVRkJSU3hUUVVGUExFTkJRVU1zUjBGQlJ6dEJRVUZCTzBGQlEzWkdMRWxCUVVrc1pVRkJaVHRCUVVOdVFpeHRRa0ZCYlVJc1MwRkJTenRCUVVOd1FpeHBRa0ZCWlN4UFFVRlBMRmxCUVZrc1pVRkJaU3hKUVVGSk8wRkJRM0pFTEUxQlFVa3NTMEZCU3l4bFFVRmxPMEZCUTNoQ0xHbENRVUZsTzBGQlEyWXNVMEZCVHp0QlFVRkJPMEZCUlZnc2QwSkJRWGRDTEV0QlFVczdRVUZEZWtJc1RVRkJTU3hEUVVGRExFOUJRVThzVDBGQlR5eFJRVUZSTzBGQlEzWkNMRmRCUVU4N1FVRkRXQ3hOUVVGSkxFdEJRVXNzWjBKQlFXZENMR0ZCUVdFc1NVRkJTVHRCUVVNeFF5eE5RVUZKTzBGQlEwRXNWMEZCVHp0QlFVTllMRTFCUVVrc1VVRkJVU3hOUVVGTk8wRkJRMlFzVTBGQlN6dEJRVU5NTEc5Q1FVRm5RaXhoUVVGaExFbEJRVWtzUzBGQlN6dEJRVU4wUXl4aFFVRlRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFbEJRVWtzVVVGQlVTeEpRVUZKTEVkQlFVY3NSVUZCUlN4SFFVRkhPMEZCUTNoRExGTkJRVWNzUzBGQlN5eGxRVUZsTEVsQlFVazdRVUZCUVR0QlFVRkJMR0ZCUnpGQ0xHVkJRV1VzVVVGQlVTeEpRVUZKTEdkQ1FVRm5RaXhIUVVGSE8wRkJRMjVFTEZOQlFVczdRVUZCUVN4VFFVVktPMEZCUTBRc1VVRkJTU3hSUVVGUkxGTkJRVk03UVVGRGNrSXNVMEZCU3l4VlFVRlZMRTlCUVU4c1dVRkJXU3hMUVVGTExFOUJRVThzVDBGQlR6dEJRVU55UkN4dlFrRkJaMElzWVVGQllTeEpRVUZKTEV0QlFVczdRVUZEZEVNc1lVRkJVeXhSUVVGUkxFdEJRVXM3UVVGRGJFSXNWVUZCU1N4UFFVRlBMRXRCUVVzc1QwRkJUenRCUVVOdVFpeFhRVUZITEZGQlFWRXNaVUZCWlN4SlFVRkpPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTVEZETEZOQlFVODdRVUZCUVR0QlFVVllMRWxCUVVrc1YwRkJWeXhIUVVGSE8wRkJRMnhDTEhGQ1FVRnhRaXhIUVVGSE8wRkJRM0JDTEZOQlFVOHNVMEZCVXl4TFFVRkxMRWRCUVVjc1RVRkJUU3hIUVVGSE8wRkJRVUU3UVVGRmNrTXNTVUZCU1N4aFFVRmhMRk5CUVZVc1MwRkJTeXhOUVVGTk8wRkJRMnhETEZOQlFVOHNVMEZCVXl4VlFVRlZMRXRCUVVzc1NVRkJTU3hKUVVGSkxGTkJRVlVzUjBGQlJ6dEJRVUZGTEZkQlFVOHNWMEZCVnl4SFFVRkhMRmxCUVZrN1FVRkJRU3hQUVVOdVJpeFRRVUZUTEdkQ1FVRm5RaXhMUVVGTExFbEJRVWtzVjBGQlZ5eFBRVU42UXl4VFFVRlRMRk5CUVZNc1NVRkJTU3haUVVOc1FpeFpRVUZaTEU5QlFVOHNUMEZCVHl4TFFVRkxMRWxCUVVrc1YwRkJWeXhKUVVGSkxGVkJRemxETzBGQlFVRTdRVUZGY0VJc2RVSkJRWFZDTEVkQlFVY3NSMEZCUnl4SlFVRkpMRTFCUVUwN1FVRkRia01zVDBGQlN5eE5RVUZOTzBGQlExZ3NVMEZCVHl4UlFVRlJPMEZCUTJZc1QwRkJTeXhIUVVGSExGRkJRVkVzVTBGQlZTeE5RVUZOTzBGQlF6VkNMRkZCUVVrc1EwRkJReXhQUVVGUExFZEJRVWM3UVVGRFdDeFRRVUZITEU5QlFVOHNVVUZCVVR0QlFVRkJMRk5CUTJwQ08wRkJRMFFzVlVGQlNTeExRVUZMTEVWQlFVVXNUMEZCVHl4TFFVRkxMRVZCUVVVN1FVRkRla0lzVlVGQlNTeFBRVUZQTEU5QlFVOHNXVUZCV1N4UFFVRlBMRTlCUVU4c1dVRkJXU3hOUVVGTkxFbEJRVWs3UVVGRE9VUXNXVUZCU1N4aFFVRmhMRmxCUVZrN1FVRkROMElzV1VGQlNTeGhRVUZoTEZsQlFWazdRVUZETjBJc1dVRkJTU3hsUVVGbExGbEJRVms3UVVGRE0wSXNZMEZCU1N4eFFrRkJjVUlzWlVGQlpTeFJRVUZSTEV0QlFVczdRVUZEYWtRc1owSkJRVWtzVjBGQlZ5eEpRVUZKTEdkQ1FVRm5RaXhYUVVGWExFbEJRVWtzWVVGQllUdEJRVU16UkN4cFFrRkJSeXhQUVVGUExGRkJRVkVzUlVGQlJUdEJRVUZCTzBGQlFVRXNhVUpCUjNaQ08wRkJRMFFzTUVKQlFXTXNTVUZCU1N4SlFVRkpMRWxCUVVrc1QwRkJUeXhQUVVGUE8wRkJRVUU3UVVGQlFTeGxRVWN6UXp0QlFVTkVMR0ZCUVVjc1QwRkJUeXhSUVVGUkxFVkJRVVU3UVVGQlFUdEJRVUZCTEdsQ1FVZHVRaXhQUVVGUE8wRkJRMW9zVjBGQlJ5eFBRVUZQTEZGQlFWRXNSVUZCUlR0QlFVRkJPMEZCUVVFN1FVRkhhRU1zVDBGQlN5eEhRVUZITEZGQlFWRXNVMEZCVlN4TlFVRk5PMEZCUXpWQ0xGRkJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NUMEZCVHp0QlFVTnNRaXhUUVVGSExFOUJRVThzVVVGQlVTeEZRVUZGTzBGQlFVRTdRVUZCUVR0QlFVYzFRaXhUUVVGUE8wRkJRVUU3UVVGRldDeEpRVUZKTEdsQ1FVRnBRaXhQUVVGUExGZEJRVmNzWTBGRGJrTXNUMEZCVHl4WFFVTlFPMEZCUTBvc1NVRkJTU3huUWtGQlowSXNUMEZCVHl4dFFrRkJiVUlzVjBGQlZ5eFRRVUZWTEVkQlFVYzdRVUZEYkVVc1RVRkJTVHRCUVVOS0xGTkJRVThzUzBGQlN5eFJRVUZUTEV0QlFVa3NSVUZCUlN4dlFrRkJiMElzUlVGQlJTeE5RVUZOTzBGQlFVRXNTVUZEZGtRc1YwRkJXVHRCUVVGRkxGTkJRVTg3UVVGQlFUdEJRVU42UWl4SlFVRkpMR2RDUVVGblFqdEJRVU53UWl4dlFrRkJiMElzVjBGQlZ6dEJRVU16UWl4TlFVRkpMRWRCUVVjc1IwRkJSeXhIUVVGSE8wRkJRMklzVFVGQlNTeFZRVUZWTEZkQlFWY3NSMEZCUnp0QlFVTjRRaXhSUVVGSkxGRkJRVkU3UVVGRFVpeGhRVUZQTEZWQlFWVTdRVUZEY2tJc1VVRkJTU3hUUVVGVExHbENRVUZwUWl4UFFVRlBMR05CUVdNN1FVRkRMME1zWVVGQlR5eERRVUZETzBGQlExb3NVVUZCU3l4TFFVRkxMR05CUVdNc1dVRkJZVHRCUVVOcVF5eFZRVUZKTzBGQlEwb3NZVUZCVVN4SlFVRkpMRWRCUVVjc1VVRkJVeXhEUVVGRExFVkJRVVU3UVVGRGRrSXNWVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkRZaXhoUVVGUE8wRkJRVUU3UVVGRldDeFJRVUZKTEdGQlFXRTdRVUZEWWl4aFFVRlBMRU5CUVVNN1FVRkRXaXhSUVVGSkxGVkJRVlU3UVVGRFpDeFJRVUZKTEU5QlFVOHNUVUZCVFN4VlFVRlZPMEZCUTNaQ0xGVkJRVWtzU1VGQlNTeE5RVUZOTzBGQlEyUXNZVUZCVHp0QlFVTklMRlZCUVVVc1MwRkJTeXhWUVVGVk8wRkJRM0pDTEdGQlFVODdRVUZCUVR0QlFVVllMRmRCUVU4c1EwRkJRenRCUVVGQk8wRkJSVm9zVFVGQlNTeFZRVUZWTzBGQlEyUXNUVUZCU1N4SlFVRkpMRTFCUVUwN1FVRkRaQ3hUUVVGUE8wRkJRMGdzVFVGQlJTeExRVUZMTEZWQlFWVTdRVUZEY2tJc1UwRkJUenRCUVVGQk8wRkJSVmdzU1VGQlNTeHJRa0ZCYTBJc1QwRkJUeXhYUVVGWExHTkJRMnhETEZOQlFWVXNTVUZCU1R0QlFVRkZMRk5CUVU4c1IwRkJSeXhQUVVGUExHbENRVUZwUWp0QlFVRkJMRWxCUTJ4RUxGZEJRVms3UVVGQlJTeFRRVUZQTzBGQlFVRTdRVUZGTTBJc1NVRkJTU3hSUVVGUkxFOUJRVThzWVVGQllTeGxRVU0xUWl3MlEwRkJOa01zUzBGQlN5eFRRVUZUTzBGQlF5OUVMR3RDUVVGclFpeFBRVUZQTEZGQlFWRTdRVUZETjBJc1ZVRkJVVHRCUVVOU0xHdENRVUZuUWp0QlFVRkJPMEZCUlhCQ0xFbEJRVWtzWjBKQlFXZENMRmRCUVZrN1FVRkJSU3hUUVVGUE8wRkJRVUU3UVVGRGVrTXNTVUZCU1N4M1FrRkJkMElzUTBGQlF5eEpRVUZKTEUxQlFVMHNTVUZCU1R0QlFVTXpReXcyUWtGQk5rSTdRVUZEZWtJc1RVRkJTVHRCUVVOQkxGRkJRVWs3UVVGRFFTeDNRa0ZCYTBJN1FVRkRiRUlzV1VGQlRTeEpRVUZKTzBGQlFVRXNZVUZGVUN4SFFVRlFPMEZCUTBrc1lVRkJUenRCUVVGQk8wRkJSV1lzVTBGQlR5eEpRVUZKTzBGQlFVRTdRVUZGWml4eFFrRkJjVUlzVjBGQlZ5eHJRa0ZCYTBJN1FVRkRPVU1zVFVGQlNTeFJRVUZSTEZWQlFWVTdRVUZEZEVJc1RVRkJTU3hEUVVGRE8wRkJRMFFzVjBGQlR6dEJRVU5ZTEhGQ1FVRnZRaXh2UWtGQmIwSTdRVUZEZUVNc1RVRkJTU3hOUVVGTkxGRkJRVkVzVlVGQlZTeFZRVUZWTzBGQlEyeERMSGRDUVVGeFFpeFhRVUZWTEU5QlFVOHNWVUZCVlN4VFFVRlRMRTFCUVUwc1RVRkJUVHRCUVVONlJTeFRRVUZQTEUxQlFVMHNUVUZCVFN4TlFVTmtMRTFCUVUwc2EwSkJRMDRzVDBGQlR5eGxRVU5RTEVsQlFVa3NVMEZCVlN4UFFVRlBPMEZCUVVVc1YwRkJUeXhQUVVGUE8wRkJRVUVzUzBGRGNrTXNTMEZCU3p0QlFVRkJPMEZCUjJRc1NVRkJTU3hyUWtGQmEwSTdRVUZCUVN4RlFVTnNRanRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTzBGQlJVb3NTVUZCU1N4dFFrRkJiVUk3UVVGQlFTeEZRVU51UWp0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVR0QlFVVktMRWxCUVVrc1dVRkJXU3huUWtGQlowSXNUMEZCVHp0QlFVTjJReXhKUVVGSkxHVkJRV1U3UVVGQlFTeEZRVU5tTEdkQ1FVRm5RanRCUVVGQkxFVkJRMmhDTEdkQ1FVRm5RanRCUVVGQkxFVkJRMmhDTEU5QlFVODdRVUZCUVN4RlFVTlFMSEZDUVVGeFFqdEJRVUZCTEVWQlEzSkNMRmxCUVZrN1FVRkJRVHRCUVVWb1FpeHZRa0ZCYjBJc1RVRkJUU3hMUVVGTE8wRkJRek5DTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1QwRkJUenRCUVVOYUxFOUJRVXNzVlVGQlZUdEJRVUZCTzBGQlJXNUNMRTlCUVU4c1dVRkJXU3hMUVVGTExFOUJRVThzVDBGQlR6dEJRVUZCTEVWQlEyeERMRTlCUVU4N1FVRkJRU3hKUVVOSUxFdEJRVXNzVjBGQldUdEJRVU5pTEdGQlFVOHNTMEZCU3l4VlFVTlFMRTFCUVVzc1UwRkJVeXhMUVVGTExFOUJRVThzVDBGQlR5eExRVUZMTEZWQlFWVXNXVUZCV1N4TFFVRkxMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJRVUVzUlVGSGJFWXNWVUZCVlN4WFFVRlpPMEZCUVVVc1YwRkJUeXhMUVVGTExFOUJRVThzVDBGQlR5eExRVUZMTzBGQlFVRTdRVUZCUVR0QlFVVXpSQ3c0UWtGQk9FSXNTMEZCU3l4VlFVRlZPMEZCUTNwRExGTkJRVThzVFVGQlRTeGxRVUZsTEU5QlFVOHNTMEZCU3l4VlFVTnVReXhKUVVGSkxGTkJRVlVzUzBGQlN6dEJRVUZGTEZkQlFVOHNVMEZCVXl4TFFVRkxPMEZCUVVFc1MwRkRNVU1zVDBGQlR5eFRRVUZWTEVkQlFVY3NSMEZCUnl4SFFVRkhPMEZCUVVVc1YwRkJUeXhGUVVGRkxGRkJRVkVzVDBGQlR6dEJRVUZCTEV0QlEzQkVMRXRCUVVzN1FVRkJRVHRCUVVWa0xIRkNRVUZ4UWl4TFFVRkxMRlZCUVZVc1kwRkJZeXhaUVVGWk8wRkJRekZFTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1YwRkJWenRCUVVOb1FpeFBRVUZMTEdGQlFXRTdRVUZEYkVJc1QwRkJTeXhsUVVGbE8wRkJRM0JDTEU5QlFVc3NWVUZCVlN4eFFrRkJjVUlzUzBGQlN6dEJRVUZCTzBGQlJUZERMRTlCUVU4c1lVRkJZU3hMUVVGTE8wRkJRM3BDTEcxQ1FVRnRRaXhMUVVGTExGVkJRVlU3UVVGRE9VSXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhQUVVGUE8wRkJRMW9zVDBGQlN5eFhRVUZYTEU5QlFVOHNTMEZCU3l4VlFVRlZMRWxCUVVrc1UwRkJWU3hMUVVGTE8wRkJRVVVzVjBGQlR5eFRRVUZUTzBGQlFVRTdRVUZETTBVc1QwRkJTeXhuUWtGQlowSTdRVUZEY2tJc1QwRkJTeXhWUVVGVkxIRkNRVUZ4UWl4TFFVRkxPMEZCUVVFN1FVRkZOME1zVDBGQlR5eFhRVUZYTEV0QlFVczdRVUZEZGtJc1NVRkJTU3hYUVVGWExGVkJRVlVzVDBGQlR5eFRRVUZWTEV0QlFVc3NUVUZCVFR0QlFVRkZMRk5CUVZFc1NVRkJTU3hSUVVGUkxFOUJRVThzVTBGQlV6dEJRVUZCTEVkQlFWTTdRVUZEY0Vjc1NVRkJTU3huUWtGQlowSTdRVUZEY0VJc1NVRkJTU3hoUVVGaExGVkJRVlVzVDBGQlR5eFRRVUZWTEV0QlFVc3NUVUZCVFR0QlFVTnVSQ3hOUVVGSkxGZEJRVmNzVDBGQlR6dEJRVU4wUWl4MVFrRkJiMElzV1VGQldTeFBRVUZQTzBGQlEyNURMRk5CUVVzc1MwRkJTenRCUVVOV0xGTkJRVXNzVDBGQlR6dEJRVU5hTEZGQlFVa3NRMEZCUXl4WlFVRlpPMEZCUTJJc1YwRkJTeXhWUVVGVkxHRkJRV0VzVTBGQlV6dEJRVU55UXl4WFFVRkxMRkZCUVZFN1FVRkJRU3hsUVVWU0xFOUJRVThzWlVGQlpTeFZRVUZWTzBGQlEzSkRMRmRCUVVzc1ZVRkJWU3hMUVVGTExHRkJRV01zUlVGQlF5eFJRVUZSTEV0QlFVc3NVVUZCVVR0QlFVTjRSQ3hYUVVGTExGRkJRVkVzVTBGQlV6dEJRVUZCTEdWQlJXcENMRTlCUVU4c1pVRkJaU3hWUVVGVk8wRkJRM0pETEZkQlFVc3NWVUZCVlN4WFFVRlhMRTlCUVU4c1RVRkJUU3hYUVVGWE8wRkJRMnhFTEZkQlFVc3NVVUZCVVR0QlFVRkJPMEZCUVVFN1FVRkhja0lzVTBGQlR5eGhRVUZaTEV0QlFVczdRVUZEZUVJc1RVRkJTU3hSUVVGUk8wRkJRMW9zVTBGQlR6dEJRVUZCTEVkQlExSTdRVUZEU0N4WFFVRlhMRk5CUVZNN1FVRkRjRUlzVjBGQlZ5eFBRVUZQTzBGQlEyeENMRmRCUVZjc1VVRkJVVHRCUVVOdVFpeEpRVUZKTEdWQlFXVXNhVUpCUVdsQ0xFOUJRVThzVTBGQlZTeExRVUZMTEUxQlFVMDdRVUZETlVRc1RVRkJTU3hQUVVGUExGZEJRVmNzVjBGQlZ6dEJRVU5xUXl4VFFVRlBPMEZCUVVFc1IwRkRVanRCUVVOSUxHdENRVUZyUWl4VlFVRlZMRk5CUVZNN1FVRkRha01zVFVGQlNTeERRVUZETEZsQlFWa3NiMEpCUVc5Q0xHTkJRV01zYjBKQlFXOUNMR0ZCUVdFc2IwSkJRVzlDTEdWQlFXVXNRMEZCUXl4VFFVRlRMRkZCUVZFc1EwRkJReXhoUVVGaExGTkJRVk03UVVGRE5Vb3NWMEZCVHp0QlFVTllMRTFCUVVrc1MwRkJTeXhKUVVGSkxHRkJRV0VzVTBGQlV5eE5RVUZOTEZkQlFWY3NVMEZCVXl4VFFVRlRPMEZCUTNSRkxFMUJRVWtzVjBGQlZ5eFZRVUZWTzBGQlEzSkNMRmxCUVZFc1NVRkJTU3hUUVVGVExFTkJRVVVzUzBGQlN5eFhRVUZaTzBGQlEyaERMR0ZCUVU4c1MwRkJTeXhOUVVGTk8wRkJRVUU3UVVGQlFUdEJRVWM1UWl4VFFVRlBPMEZCUVVFN1FVRkZXQ3hKUVVGSkxIRkNRVUZ4UWl4VlFVRlZMRTlCUVU4c1UwRkJWU3hMUVVGTExFMUJRVTA3UVVGRE0wUXNUVUZCU1N4RFFVRkRMRlZCUVZVc1VVRkJVU3hUUVVGVExGRkJRVkVzVlVGQlZUdEJRVU01UXl4UlFVRkpMRTlCUVU4c1YwRkJWeXhYUVVGWE8wRkJRM0pETEZOQlFVODdRVUZCUVN4SFFVTlNPMEZCUTBnc2JVSkJRVzFDTEdOQlFXTTdRVUZEYWtNc2JVSkJRVzFDTEdGQlFXRTdRVUZEYUVNc2JVSkJRVzFDTEZsQlFWazdRVUZGTDBJc1pVRkJaVHRCUVVGQk8wRkJRMllzWjBKQlFXZENMRXRCUVVzN1FVRkJSU3hUUVVGUE8wRkJRVUU3UVVGRE9VSXNNa0pCUVRKQ0xFbEJRVWtzU1VGQlNUdEJRVU12UWl4TlFVRkpMRTFCUVUwc1VVRkJVU3hQUVVGUE8wRkJRM0pDTEZkQlFVODdRVUZEV0N4VFFVRlBMRk5CUVZVc1MwRkJTenRCUVVOc1FpeFhRVUZQTEVkQlFVY3NSMEZCUnp0QlFVRkJPMEZCUVVFN1FVRkhja0lzYTBKQlFXdENMRXRCUVVzc1MwRkJTenRCUVVONFFpeFRRVUZQTEZkQlFWazdRVUZEWml4UlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVOb1FpeFJRVUZKTEUxQlFVMHNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkhlRUlzTWtKQlFUSkNMRWxCUVVrc1NVRkJTVHRCUVVNdlFpeE5RVUZKTEU5QlFVODdRVUZEVUN4WFFVRlBPMEZCUTFnc1UwRkJUeXhYUVVGWk8wRkJRMllzVVVGQlNTeE5RVUZOTEVkQlFVY3NUVUZCVFN4TlFVRk5PMEZCUTNwQ0xGRkJRVWtzVVVGQlVUdEJRVU5TTEdkQ1FVRlZMRXRCUVVzN1FVRkRia0lzVVVGQlNTeFpRVUZaTEV0QlFVc3NWMEZEY2tJc1ZVRkJWU3hMUVVGTE8wRkJRMllzVTBGQlN5eFpRVUZaTzBGQlEycENMRk5CUVVzc1ZVRkJWVHRCUVVObUxGRkJRVWtzVDBGQlR5eEhRVUZITEUxQlFVMHNUVUZCVFR0QlFVTXhRaXhSUVVGSk8wRkJRMEVzVjBGQlN5eFpRVUZaTEV0QlFVc3NXVUZCV1N4VFFVRlRMRmRCUVZjc1MwRkJTeXhoUVVGaE8wRkJRelZGTEZGQlFVazdRVUZEUVN4WFFVRkxMRlZCUVZVc1MwRkJTeXhWUVVGVkxGTkJRVk1zVTBGQlV5eExRVUZMTEZkQlFWYzdRVUZEY0VVc1YwRkJUeXhUUVVGVExGTkJRVmtzVDBGQlR6dEJRVUZCTzBGQlFVRTdRVUZITTBNc01rSkJRVEpDTEVsQlFVa3NTVUZCU1R0QlFVTXZRaXhOUVVGSkxFOUJRVTg3UVVGRFVDeFhRVUZQTzBGQlExZ3NVMEZCVHl4WFFVRlpPMEZCUTJZc1QwRkJSeXhOUVVGTkxFMUJRVTA3UVVGRFppeFJRVUZKTEZsQlFWa3NTMEZCU3l4WFFVTnlRaXhWUVVGVkxFdEJRVXM3UVVGRFppeFRRVUZMTEZsQlFWa3NTMEZCU3l4VlFVRlZPMEZCUTJoRExFOUJRVWNzVFVGQlRTeE5RVUZOTzBGQlEyWXNVVUZCU1R0QlFVTkJMRmRCUVVzc1dVRkJXU3hMUVVGTExGbEJRVmtzVTBGQlV5eFhRVUZYTEV0QlFVc3NZVUZCWVR0QlFVTTFSU3hSUVVGSk8wRkJRMEVzVjBGQlN5eFZRVUZWTEV0QlFVc3NWVUZCVlN4VFFVRlRMRk5CUVZNc1MwRkJTeXhYUVVGWE8wRkJRVUU3UVVGQlFUdEJRVWMxUlN3eVFrRkJNa0lzU1VGQlNTeEpRVUZKTzBGQlF5OUNMRTFCUVVrc1QwRkJUenRCUVVOUUxGZEJRVTg3UVVGRFdDeFRRVUZQTEZOQlFWVXNaVUZCWlR0QlFVTTFRaXhSUVVGSkxFMUJRVTBzUjBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZEZWtJc1YwRkJUeXhsUVVGbE8wRkJRM1JDTEZGQlFVa3NXVUZCV1N4TFFVRkxMRmRCUTNKQ0xGVkJRVlVzUzBGQlN6dEJRVU5tTEZOQlFVc3NXVUZCV1R0QlFVTnFRaXhUUVVGTExGVkJRVlU3UVVGRFppeFJRVUZKTEU5QlFVOHNSMEZCUnl4TlFVRk5MRTFCUVUwN1FVRkRNVUlzVVVGQlNUdEJRVU5CTEZkQlFVc3NXVUZCV1N4TFFVRkxMRmxCUVZrc1UwRkJVeXhYUVVGWExFdEJRVXNzWVVGQllUdEJRVU0xUlN4UlFVRkpPMEZCUTBFc1YwRkJTeXhWUVVGVkxFdEJRVXNzVlVGQlZTeFRRVUZUTEZOQlFWTXNTMEZCU3l4WFFVRlhPMEZCUTNCRkxGZEJRVThzVVVGQlVTeFRRVU5XTEZOQlFWTXNVMEZCV1N4VFFVRlpMRTlCUTJwRExFOUJRVThzUzBGQlN6dEJRVUZCTzBGQlFVRTdRVUZIZWtJc2IwTkJRVzlETEVsQlFVa3NTVUZCU1R0QlFVTjRReXhOUVVGSkxFOUJRVTg3UVVGRFVDeFhRVUZQTzBGQlExZ3NVMEZCVHl4WFFVRlpPMEZCUTJZc1VVRkJTU3hIUVVGSExFMUJRVTBzVFVGQlRTeGxRVUZsTzBGQlF6bENMR0ZCUVU4N1FVRkRXQ3hYUVVGUExFZEJRVWNzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVYzVRaXg1UWtGQmVVSXNTVUZCU1N4SlFVRkpPMEZCUXpkQ0xFMUJRVWtzVDBGQlR6dEJRVU5RTEZkQlFVODdRVUZEV0N4VFFVRlBMRmRCUVZrN1FVRkRaaXhSUVVGSkxFMUJRVTBzUjBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZEZWtJc1VVRkJTU3hQUVVGUExFOUJRVThzU1VGQlNTeFRRVUZUTEZsQlFWazdRVUZEZGtNc1ZVRkJTU3hQUVVGUExFMUJRVTBzU1VGQlNTeFZRVUZWTEZGQlFWRXNUMEZCVHl4SlFVRkpMRTFCUVUwN1FVRkRlRVFzWVVGQlR6dEJRVU5JTEdGQlFVc3NTMEZCU3l4VlFVRlZPMEZCUTNoQ0xHRkJRVThzU1VGQlNTeExRVUZMTEZkQlFWazdRVUZEZUVJc1pVRkJUeXhIUVVGSExFMUJRVTBzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZIT1VJc1YwRkJUeXhIUVVGSExFMUJRVTBzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZKT1VJc1NVRkJTU3hYUVVGWE8wRkJRMllzU1VGQlNTeDVRa0ZCZVVJc1MwRkROMElzYTBKQlFXdENMRWxCUVVrc2EwSkJRV3RDTEV0QlFVc3NUMEZCVHl4UFFVRlBMRmxCUVZrc1kwRkRia1VzUzBGRFF5eFhRVUZaTzBGQlExUXNUVUZCU1N4VlFVRlZMRkZCUVZFN1FVRkRkRUlzVFVGQlNTeFBRVUZQTEZkQlFWY3NaVUZCWlN4RFFVRkRMRTlCUVU4N1FVRkRla01zVjBGQlR5eERRVUZETEZOQlFWTXNVMEZCVXl4VlFVRlZPMEZCUTNoRExFMUJRVWtzVlVGQlZTeFBRVUZQTEU5QlFVOHNUMEZCVHl4WFFVRlhMRWxCUVVrc1YwRkJWeXhEUVVGRE8wRkJRemxFTEZOQlFVODdRVUZCUVN4SlFVTklPMEZCUVVFc1NVRkRRU3hUUVVGVE8wRkJRVUVzU1VGRFZEdEJRVUZCTzBGQlFVRXNTMEZGUml4M1FrRkJkMElzUzBGQlN5eEpRVUZKTEhGQ1FVRnhRaXhMUVVGTExFbEJRVWtzZDBKQlFYZENMRXRCUVVzc1NVRkJTU3h2UWtGQmIwSXNjMEpCUVhOQ0xHMUNRVUZ0UWp0QlFVTjJTeXhKUVVGSkxHZENRVUZuUWl4NVFrRkJlVUlzYzBKQlFYTkNPMEZCUTI1RkxFbEJRVWtzY1VKQlFYRkNMRU5CUVVNc1EwRkJRenRCUVVNelFpeEpRVUZKTEhkQ1FVRjNRanRCUVVNMVFpeEpRVUZKTEhWQ1FVRjFRaXgzUWtGRGRrSXNWMEZCV1R0QlFVRkZMSGRDUVVGelFpeExRVUZMTzBGQlFVRXNTVUZGY2tNc1VVRkJVU3hsUVVOS0xHRkJRV0VzUzBGQlN5eE5RVUZOTEdkQ1FVTjRRaXhSUVVGUkxHMUNRVU5LTEZkQlFWazdRVUZEVWl4TlFVRkpMRmxCUVZrc1UwRkJVeXhqUVVGak8wRkJRM1pETEVWQlFVTXNTVUZCU1N4cFFrRkJhVUlzVjBGQldUdEJRVU01UWp0QlFVTkJMR2RDUVVGWk8wRkJRVUVzUzBGRFdpeFJRVUZSTEZkQlFWY3NRMEZCUlN4WlFVRlpPMEZCUTNKRExGbEJRVlVzWVVGQllTeExRVUZMTzBGQlFVRXNTVUZGYUVNc1YwRkJXVHRCUVVGRkxHRkJRVmNzWTBGQll6dEJRVUZCTzBGQlEzWkVMRWxCUVVrc1QwRkJUeXhUUVVGVkxGVkJRVlVzVFVGQlRUdEJRVU5xUXl4cFFrRkJaU3hMUVVGTExFTkJRVU1zVlVGQlZUdEJRVU12UWl4TlFVRkpMSE5DUVVGelFqdEJRVU4wUWp0QlFVTkJMREpDUVVGMVFqdEJRVUZCTzBGQlFVRTdRVUZITDBJc1NVRkJTU3h4UWtGQmNVSXNUVUZEZWtJc2RVSkJRWFZDTEUxQlEzWkNMR3RDUVVGclFpeEpRVU5zUWl4clFrRkJhMElzU1VGRGJFSXNiVUpCUVcxQ0xFMUJRVTBzYTBKQlFXdENPMEZCUXpORExFbEJRVWtzV1VGQldUdEJRVUZCTEVWQlExb3NTVUZCU1R0QlFVRkJMRVZCUTBvc1VVRkJVVHRCUVVGQkxFVkJRMUlzUzBGQlN6dEJRVUZCTEVWQlEwd3NXVUZCV1R0QlFVRkJMRVZCUTFvc1lVRkJZVHRCUVVGQkxFVkJRMklzUzBGQlN6dEJRVUZCTEVWQlEwd3NTMEZCU3p0QlFVRkJMRVZCUTB3c1ZVRkJWU3hYUVVGWk8wRkJRMnhDTEZOQlFVc3NWMEZCVnl4UlFVRlJMRk5CUVZVc1NVRkJTVHRCUVVOc1F5eFZRVUZKTzBGQlEwRXNiMEpCUVZrc1IwRkJSeXhKUVVGSkxFZEJRVWM3UVVGQlFTeGxRVVZ1UWl4SFFVRlFPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSldpeEpRVUZKTEUxQlFVMDdRVUZEVml4SlFVRkpMR2xDUVVGcFFqdEJRVU55UWl4SlFVRkpMRzlDUVVGdlFqdEJRVU40UWl4SlFVRkpMR2xDUVVGcFFqdEJRVU55UWl4elFrRkJjMElzU1VGQlNUdEJRVU4wUWl4TlFVRkpMRTlCUVU4c1UwRkJVenRCUVVOb1FpeFZRVUZOTEVsQlFVa3NWVUZCVlR0QlFVTjRRaXhQUVVGTExHRkJRV0U3UVVGRGJFSXNUMEZCU3l4alFVRmpPMEZCUTI1Q0xFOUJRVXNzVDBGQlR6dEJRVU5hTEUxQlFVa3NUVUZCVHl4TFFVRkxMRTlCUVU4N1FVRkRka0lzVFVGQlNTeFBRVUZQTzBGQlExQXNVMEZCU3l4bFFVRmxPMEZCUTNCQ0xGTkJRVXNzVVVGQlVUdEJRVU5pTEZOQlFVc3NWMEZCVnp0QlFVRkJPMEZCUlhCQ0xFMUJRVWtzVDBGQlR5eFBRVUZQTEZsQlFWazdRVUZETVVJc1VVRkJTU3hQUVVGUE8wRkJRMUFzV1VGQlRTeEpRVUZKTEZWQlFWVTdRVUZEZUVJc1UwRkJTeXhUUVVGVExGVkJRVlU3UVVGRGVFSXNVMEZCU3l4VFFVRlRMRlZCUVZVN1FVRkRlRUlzVVVGQlNTeExRVUZMTEZkQlFWYzdRVUZEYUVJc2MwSkJRV2RDTEUxQlFVMHNTMEZCU3p0QlFVTXZRanRCUVVGQk8wRkJSVW9zVDBGQlN5eFRRVUZUTzBGQlEyUXNUMEZCU3l4VFFVRlRPMEZCUTJRc1NVRkJSU3hKUVVGSk8wRkJRMDRzY1VKQlFXMUNMRTFCUVUwN1FVRkJRVHRCUVVVM1FpeEpRVUZKTEZkQlFWYzdRVUZCUVN4RlFVTllMRXRCUVVzc1YwRkJXVHRCUVVOaUxGRkJRVWtzVFVGQlRTeExRVUZMTEdOQlFXTTdRVUZETjBJc2EwSkJRV01zWVVGQllTeFpRVUZaTzBGQlEyNURMRlZCUVVrc1VVRkJVVHRCUVVOYUxGVkJRVWtzWjBKQlFXZENMRU5CUVVNc1NVRkJTU3hWUVVGWExGTkJRVkVzVDBGQlR5eG5Ra0ZCWjBJN1FVRkRia1VzVlVGQlNTeFZRVUZWTEdsQ1FVRnBRaXhEUVVGRE8wRkJRMmhETEZWQlFVa3NTMEZCU3l4SlFVRkpMR0ZCUVdFc1UwRkJWU3hUUVVGVExGRkJRVkU3UVVGRGFrUXNORUpCUVc5Q0xFOUJRVThzU1VGQlNTeFRRVUZUTERCQ1FVRXdRaXhoUVVGaExFdEJRVXNzWlVGQlpTeFZRVUZWTERCQ1FVRXdRaXhaUVVGWkxFdEJRVXNzWlVGQlpTeFZRVUZWTEZOQlFWTXNVVUZCVVR0QlFVRkJPMEZCUlhSTkxHVkJRVk1zYzBKQlFYTkNMRWxCUVVrN1FVRkRia01zWVVGQlR6dEJRVUZCTzBGQlJWZ3NVMEZCU3l4WlFVRlpPMEZCUTJwQ0xGZEJRVTg3UVVGQlFUdEJRVUZCTEVWQlJWZ3NTMEZCU3l4VFFVRlZMRTlCUVU4N1FVRkRiRUlzV1VGQlVTeE5RVUZOTEZGQlFWRXNVMEZCVXl4TlFVRk5MR05CUVdNc1YwRkRMME1zVjBGRFFUdEJRVUZCTEUxQlEwa3NTMEZCU3l4WFFVRlpPMEZCUTJJc1pVRkJUenRCUVVGQk8wRkJRVUVzVFVGRldDeExRVUZMTEZOQlFWTTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkpPVUlzVFVGQlRTeGhRVUZoTEZkQlFWYzdRVUZCUVN4RlFVTXhRaXhOUVVGTk8wRkJRVUVzUlVGRFRpeFBRVUZQTEZOQlFWVXNZVUZCWVN4WlFVRlpPMEZCUTNSRExIZENRVUZ2UWl4TlFVRk5MRWxCUVVrc1UwRkJVeXhOUVVGTkxFMUJRVTBzWVVGQllTeFpRVUZaTzBGQlFVRTdRVUZCUVN4RlFVVm9SaXhQUVVGUExGTkJRVlVzV1VGQldUdEJRVU42UWl4UlFVRkpMRlZCUVZVc1YwRkJWenRCUVVOeVFpeGhRVUZQTEV0QlFVc3NTMEZCU3l4TlFVRk5PMEZCUXpOQ0xGRkJRVWtzVDBGQlR5eFZRVUZWTEVsQlFVa3NWVUZCVlN4VlFVRlZPMEZCUXpkRExGZEJRVThzVDBGQlR5eFRRVUZUTEdGQlFXRXNTMEZCU3l4TFFVRkxMRTFCUVUwc1UwRkJWU3hMUVVGTE8wRkJReTlFTEdGQlFVOHNaVUZCWlN4UFFVRlBMRkZCUVZFc1QwRkJUeXhqUVVGak8wRkJRVUVzVTBGRmVFUXNTMEZCU3l4TFFVRkxMRTFCUVUwc1UwRkJWU3hMUVVGTE8wRkJRemRDTEdGQlFVOHNUMEZCVHl4SlFVRkpMRk5CUVZNc1QwRkJUeXhSUVVGUkxFOUJRVThzWTBGQll6dEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVY3pSU3hUUVVGVExGTkJRVlVzVjBGQlZ6dEJRVU14UWl4WFFVRlBMRXRCUVVzc1MwRkJTeXhUUVVGVkxFOUJRVTg3UVVGRE9VSTdRVUZEUVN4aFFVRlBPMEZCUVVFc1QwRkRVaXhUUVVGVkxFdEJRVXM3UVVGRFpEdEJRVU5CTEdGQlFVOHNZMEZCWXp0QlFVRkJPMEZCUVVFN1FVRkJRU3hGUVVjM1FpeFBRVUZQTzBGQlFVRXNTVUZEU0N4TFFVRkxMRmRCUVZrN1FVRkRZaXhWUVVGSkxFdEJRVXM3UVVGRFRDeGxRVUZQTEV0QlFVczdRVUZEYUVJc1ZVRkJTVHRCUVVOQkxHZERRVUYzUWp0QlFVTjRRaXhaUVVGSkxGTkJRVk1zVTBGQlV5eE5RVUZOTEVsQlFVazdRVUZEYUVNc1dVRkJTU3hSUVVGUkxFOUJRVThzUzBGQlN6dEJRVU40UWl4WlFVRkpMRXRCUVVzc1YwRkJWenRCUVVOb1FpeGxRVUZMTEZOQlFWTTdRVUZEYkVJc1pVRkJUenRCUVVGQkxHZENRVVZZTzBGQlEwa3NaME5CUVhkQ08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRXNSVUZKY0VNc1UwRkJVeXhUUVVGVkxFbEJRVWtzUzBGQlN6dEJRVU40UWl4UlFVRkpMRkZCUVZFN1FVRkRXaXhYUVVGUExFdEJRVXNzVjBGRFVpeEpRVUZKTEdGQlFXRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRlRU1zVlVGQlNTeFRRVUZUTEZkQlFWY3NWMEZCV1R0QlFVRkZMR1ZCUVU4c1QwRkJUeXhKUVVGSkxGZEJRVmNzVVVGQlVUdEJRVUZCTEZOQlFWVTdRVUZEY2tZc1dVRkJUU3hMUVVGTExGTkJRVk1zVVVGQlVTeFJRVUZSTEdGQlFXRXNTMEZCU3l4TlFVRk5PMEZCUVVFc1UwRkRNMFE3UVVGQlFUdEJRVUZCTzBGQlIycENMRWxCUVVrc1QwRkJUeXhYUVVGWExHVkJRV1VzVDBGQlR6dEJRVU40UXl4VlFVRlJMR0ZCUVdFc1YwRkJWeXhQUVVGUExHRkJRV0U3UVVGRGVFUXNWVUZCVlN4TlFVRk5PMEZCUTJoQ0xHdENRVUZyUWl4aFFVRmhMRmxCUVZrc1UwRkJVeXhSUVVGUkxFMUJRVTA3UVVGRE9VUXNUMEZCU3l4alFVRmpMRTlCUVU4c1owSkJRV2RDTEdGQlFXRXNZMEZCWXp0QlFVTnlSU3hQUVVGTExHRkJRV0VzVDBGQlR5eGxRVUZsTEdGQlFXRXNZVUZCWVR0QlFVTnNSU3hQUVVGTExGVkJRVlU3UVVGRFppeFBRVUZMTEZOQlFWTTdRVUZEWkN4UFFVRkxMRTFCUVUwN1FVRkJRVHRCUVVWbUxFMUJRVTBzWTBGQll6dEJRVUZCTEVWQlEyaENMRXRCUVVzc1YwRkJXVHRCUVVOaUxGRkJRVWtzVTBGQlV5eFhRVUZYTEUxQlFVMHNUVUZCVFN4WFFVTXZRaXhKUVVGSk8wRkJRMVFzVjBGQlR5eEpRVUZKTEdGQlFXRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRMME1zVlVGQlNTeFBRVUZQTEZkQlFWYzdRVUZEYkVJc1owSkJRVkU3UVVGRFdpeFZRVUZKTEZsQlFWa3NUMEZCVHp0QlFVTjJRaXhoUVVGUExGRkJRVkVzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4bFFVRlBMR0ZCUVdFc1VVRkJVU3hIUVVGSExFdEJRVXNzVTBGQlZTeEhRVUZITzBGQlF6bEZMR2xDUVVGUExFdEJRVXM3UVVGRFdpeGpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTklMRzlDUVVGUk8wRkJRVUVzVjBGRFlqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJMRVZCUjFnc1UwRkJVeXhUUVVGVkxFOUJRVTg3UVVGRGRFSXNVVUZCU1N4cFFrRkJhVUk3UVVGRGFrSXNZVUZCVHp0QlFVTllMRkZCUVVrc1UwRkJVeXhQUVVGUExFMUJRVTBzVTBGQlV6dEJRVU12UWl4aFFVRlBMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU12UXl4alFVRk5MRXRCUVVzc1UwRkJVenRCUVVGQk8wRkJSVFZDTEZGQlFVa3NTMEZCU3l4SlFVRkpMR0ZCUVdFc1ZVRkJWU3hOUVVGTk8wRkJRekZETERCQ1FVRnpRaXhKUVVGSk8wRkJRekZDTEZkQlFVODdRVUZCUVR0QlFVRkJMRVZCUlZnc1VVRkJVVHRCUVVGQkxFVkJRMUlzVFVGQlRTeFhRVUZaTzBGQlEyUXNVVUZCU1N4VFFVRlRMRmRCUVZjc1RVRkJUU3hOUVVGTkxGZEJRVmNzU1VGQlNUdEJRVU51UkN4WFFVRlBMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU12UXl4aFFVRlBMRWxCUVVrc1UwRkJWU3hQUVVGUE8wRkJRVVVzWlVGQlR5eGhRVUZoTEZGQlFWRXNUMEZCVHl4TFFVRkxMRk5CUVZNN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVWQyUml4TFFVRkxPMEZCUVVFc1NVRkRSQ3hMUVVGTExGZEJRVms3UVVGQlJTeGhRVUZQTzBGQlFVRTdRVUZCUVN4SlFVTXhRaXhMUVVGTExGTkJRVlVzVDBGQlR6dEJRVUZGTEdGQlFVOHNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkJRU3hGUVVWNlF5eGhRVUZoTEVOQlFVVXNTMEZCU3l4WFFVRlpPMEZCUVVVc1YwRkJUenRCUVVGQk8wRkJRVUVzUlVGRGVrTXNVVUZCVVR0QlFVRkJMRVZCUTFJN1FVRkJRU3hGUVVOQkxGZEJRVmM3UVVGQlFTeEpRVU5RTEV0QlFVc3NWMEZCV1R0QlFVRkZMR0ZCUVU4N1FVRkJRVHRCUVVGQkxFbEJRekZDTEV0QlFVc3NVMEZCVlN4UFFVRlBPMEZCUVVVc1lVRkJUenRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVVZ1UXl4cFFrRkJhVUk3UVVGQlFTeEpRVU5pTEV0QlFVc3NWMEZCV1R0QlFVRkZMR0ZCUVU4N1FVRkJRVHRCUVVGQkxFbEJRekZDTEV0QlFVc3NVMEZCVlN4UFFVRlBPMEZCUVVVc2QwSkJRV3RDTzBGQlFVRTdRVUZCUVR0QlFVRkJMRVZCUlRsRExGRkJRVkVzVTBGQlZTeEpRVUZKTEZkQlFWYzdRVUZETjBJc1YwRkJUeXhKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZETDBNc1lVRkJUeXhUUVVGVExGTkJRVlVzVlVGQlV5eFRRVUZSTzBGQlEzWkRMRmxCUVVrc1RVRkJUVHRCUVVOV0xGbEJRVWtzWVVGQllUdEJRVU5xUWl4WlFVRkpMR05CUVdNN1FVRkRiRUlzV1VGQlNTeFhRVUZYTEZOQlFWTXNWMEZCV1R0QlFVTm9ReXhqUVVGSkxGRkJRVkU3UVVGRFdpeHRSRUZCZVVNc1YwRkJXVHRCUVVOcVJDeHJRa0ZCVFN4WFFVRlhMRmRCUVZjc1NVRkJTU3hoUVVGWkxGRkJRVThzVFVGQlRTeFhRVUZYTzBGQlFVRTdRVUZCUVN4WFFVVjZSU3hKUVVGSk8wRkJRMUE3UVVGQlFTeFRRVU5FTEZkQlFWY3NVMEZCVXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVsdVF5eEpRVUZKTEdWQlFXVTdRVUZEWml4TlFVRkpMR05CUVdNN1FVRkRaQ3haUVVGUkxHTkJRV01zWTBGQll5eFhRVUZaTzBGQlF6VkRMRlZCUVVrc2JVSkJRVzFDTEZkQlFWY3NUVUZCVFN4TlFVRk5MRmRCUVZjc1NVRkJTVHRCUVVNM1JDeGhRVUZQTEVsQlFVa3NZVUZCWVN4VFFVRlZMRk5CUVZNN1FVRkRka01zV1VGQlNTeHBRa0ZCYVVJc1YwRkJWenRCUVVNMVFpeHJRa0ZCVVR0QlFVTmFMRmxCUVVrc1dVRkJXU3hwUWtGQmFVSTdRVUZEYWtNc1dVRkJTU3hWUVVGVkxFbEJRVWtzVFVGQlRUdEJRVU40UWl4NVFrRkJhVUlzVVVGQlVTeFRRVUZWTEVkQlFVY3NSMEZCUnp0QlFVRkZMR2xDUVVGUExHRkJRV0VzVVVGQlVTeEhRVUZITEV0QlFVc3NVMEZCVlN4UFFVRlBPMEZCUVVVc2JVSkJRVThzVVVGQlVTeExRVUZMTEVOQlFVVXNVVUZCVVN4aFFVRmhPMEZCUVVFc1lVRkJiVUlzVTBGQlZTeFJRVUZSTzBGQlFVVXNiVUpCUVU4c1VVRkJVU3hMUVVGTExFTkJRVVVzVVVGQlVTeFpRVUZaTzBGQlFVRXNZVUZEZWs0c1MwRkJTeXhYUVVGWk8wRkJRVVVzYlVKQlFVOHNSVUZCUlN4aFFVRmhMRkZCUVZFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWRzUlN4TlFVRkpMR05CUVdNc1QwRkJUeXhQUVVGUExHMUNRVUZ0UWp0QlFVTXZReXhaUVVGUkxHTkJRV01zVDBGQlR5eFhRVUZaTzBGQlEzSkRMRlZCUVVrc2JVSkJRVzFDTEZkQlFWY3NUVUZCVFN4TlFVRk5MRmRCUVZjc1NVRkJTVHRCUVVNM1JDeGhRVUZQTEVsQlFVa3NZVUZCWVN4VFFVRlZMRk5CUVZNc1VVRkJVVHRCUVVNdlF5eFpRVUZKTEdsQ1FVRnBRaXhYUVVGWE8wRkJRelZDTEdsQ1FVRlBMRWxCUVVrc1pVRkJaVHRCUVVNNVFpeFpRVUZKTEZsQlFWa3NhVUpCUVdsQ08wRkJRMnBETEZsQlFVa3NWMEZCVnl4SlFVRkpMRTFCUVUwN1FVRkRla0lzZVVKQlFXbENMRkZCUVZFc1UwRkJWU3hIUVVGSExFZEJRVWM3UVVGQlJTeHBRa0ZCVHl4aFFVRmhMRkZCUVZFc1IwRkJSeXhMUVVGTExGTkJRVlVzVDBGQlR6dEJRVUZGTEcxQ1FVRlBMRkZCUVZFN1FVRkJRU3hoUVVGWExGTkJRVlVzVTBGQlV6dEJRVU16U1N4eFFrRkJVeXhMUVVGTE8wRkJRMlFzWjBKQlFVa3NRMEZCUXl4RlFVRkZPMEZCUTBnc2NVSkJRVThzU1VGQlNTeGxRVUZsTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0c1JDdzBRa0ZCTkVJc1UwRkJVeXhKUVVGSk8wRkJRM0pETEUxQlFVazdRVUZEUVN4UFFVRkhMRk5CUVZVc1QwRkJUenRCUVVOb1FpeFZRVUZKTEZGQlFWRXNWMEZCVnp0QlFVTnVRanRCUVVOS0xGVkJRVWtzVlVGQlZUdEJRVU5XTEdOQlFVMHNTVUZCU1N4VlFVRlZPMEZCUTNoQ0xGVkJRVWtzYjBKQlFXOUNMRkZCUVZFc1VVRkJVVHRCUVVONFF5eFZRVUZKTEZOQlFWTXNUMEZCVHl4TlFVRk5MRk5CUVZNc1dVRkJXVHRCUVVNelF5d3lRa0ZCYlVJc1UwRkJVeXhUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU51UkN3eVFrRkJhVUlzWlVGRFlpeE5RVUZOTEUxQlFVMHNVMEZCVXl4VlFVTnlRaXhOUVVGTkxFdEJRVXNzVTBGQlV6dEJRVUZCTzBGQlFVRXNZVUZITTBJN1FVRkRSQ3huUWtGQlVTeFRRVUZUTzBGQlEycENMR2RDUVVGUkxGTkJRVk03UVVGRGFrSXNPRUpCUVhOQ08wRkJRVUU3UVVGRk1VSXNWVUZCU1R0QlFVTkJPMEZCUVVFc1QwRkRUQ3huUWtGQlowSXNTMEZCU3l4TlFVRk5PMEZCUVVFc1YwRkZNMElzU1VGQlVEdEJRVU5KTEc5Q1FVRm5RaXhUUVVGVE8wRkJRVUU3UVVGQlFUdEJRVWRxUXl4NVFrRkJlVUlzVTBGQlV5eFJRVUZSTzBGQlEzUkRMR3RDUVVGblFpeExRVUZMTzBGQlEzSkNMRTFCUVVrc1VVRkJVU3hYUVVGWE8wRkJRMjVDTzBGQlEwb3NUVUZCU1N4dlFrRkJiMElzVVVGQlVTeFJRVUZSTzBGQlEzaERMRmRCUVZNc1owSkJRV2RDTzBGQlEzcENMRlZCUVZFc1UwRkJVenRCUVVOcVFpeFZRVUZSTEZOQlFWTTdRVUZEYWtJc1YwRkJVeXhYUVVGWExGRkJRVkVzVDBGQlR5eFhRVUZYTEZsQlFWa3NRMEZCUXl4UFFVRlBMRmxCUVZrc1UwRkJVeXhYUVVGWk8wRkJReTlHTEZGQlFVa3NWMEZCVnl4elFrRkJjMElzVVVGQlVUdEJRVU0zUXl4WFFVRlBMRmRCUVZjN1FVRkRiRUlzV1VGQlVTeFJRVUZSTEZOQlFWTTdRVUZCUVN4TlFVTnlRaXhMUVVGTExGZEJRVms3UVVGRFlpeGxRVUZQTEhkQ1FVTklMRmxCUVdFc1ZVRkJVeXhOUVVOc1FpeFRRVUZUTEVsQlFVa3NUVUZCVFN4VlFVTnVRaXhUUVVGVExGTkJRMklzVVVGQlVUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVbDRRaXcwUWtGQk1FSTdRVUZETVVJc2QwSkJRWE5DTzBGQlEzUkNMRTFCUVVrN1FVRkRRVHRCUVVGQk8wRkJSVklzSzBKQlFTdENMRk5CUVZNN1FVRkRjRU1zVFVGQlNTeFpRVUZaTEZGQlFWRTdRVUZEZUVJc1ZVRkJVU3hoUVVGaE8wRkJRM0pDTEZkQlFWTXNTVUZCU1N4SFFVRkhMRTFCUVUwc1ZVRkJWU3hSUVVGUkxFbEJRVWtzUzBGQlN5eEZRVUZGTEVkQlFVYzdRVUZEYkVRc2QwSkJRVzlDTEZOQlFWTXNWVUZCVlR0QlFVRkJPMEZCUlRORExFMUJRVWtzVFVGQlRTeFJRVUZSTzBGQlEyeENMRWxCUVVVc1NVRkJTU3hQUVVGUExFbEJRVWs3UVVGRGFrSXNUVUZCU1N4elFrRkJjMElzUjBGQlJ6dEJRVU42UWl4TlFVRkZPMEZCUTBZc1UwRkJTeXhYUVVGWk8wRkJRMklzVlVGQlNTeEZRVUZGTEhOQ1FVRnpRanRCUVVONFFqdEJRVUZCTEU5QlEwdzdRVUZCUVR0QlFVRkJPMEZCUjFnc05rSkJRVFpDTEZOQlFWTXNWVUZCVlR0QlFVTTFReXhOUVVGSkxGRkJRVkVzVjBGQlZ5eE5RVUZOTzBGQlEzcENMRmxCUVZFc1YwRkJWeXhMUVVGTE8wRkJRM2hDTzBGQlFVRTdRVUZGU2l4TlFVRkpMRXRCUVVzc1VVRkJVU3hUUVVGVExGTkJRVk1zWTBGQll5eFRRVUZUTzBGQlF6RkVMRTFCUVVrc1QwRkJUeXhOUVVGTk8wRkJRMklzVjBGQlVTeFRRVUZSTEZOQlFWTXNVMEZCVXl4VlFVRlZMRk5CUVZNc1VVRkJVU3hSUVVGUk8wRkJRVUU3UVVGRmVrVXNTVUZCUlN4VFFVRlRMRWxCUVVrN1FVRkRaaXhKUVVGRk8wRkJRMFlzVDBGQlN5eGpRVUZqTEVOQlFVTXNTVUZCU1N4VFFVRlRPMEZCUVVFN1FVRkZja01zYzBKQlFYTkNMRWxCUVVrc1UwRkJVeXhWUVVGVk8wRkJRM3BETEUxQlFVazdRVUZEUVN4MVFrRkJiVUk3UVVGRGJrSXNVVUZCU1N4TFFVRkxMRkZCUVZFc1VVRkJVVHRCUVVONlFpeFJRVUZKTEZGQlFWRXNVVUZCVVR0QlFVTm9RaXhaUVVGTkxFZEJRVWM3UVVGQlFTeFhRVVZTTzBGQlEwUXNWVUZCU1N4blFrRkJaMEk3UVVGRGFFSXNNRUpCUVd0Q08wRkJRM1JDTEZsQlFVMHNSMEZCUnp0QlFVTlVMRlZCUVVrc1owSkJRV2RDTEZGQlFWRXNWMEZCVnp0QlFVTnVReXd5UWtGQmJVSTdRVUZCUVR0QlFVVXpRaXhoUVVGVExGRkJRVkU3UVVGQlFTeFhRVVZrTEVkQlFWQTdRVUZEU1N4aFFVRlRMRTlCUVU4N1FVRkJRU3haUVVWd1FqdEJRVU5KTEhWQ1FVRnRRanRCUVVOdVFpeFJRVUZKTEVWQlFVVXNjMEpCUVhOQ08wRkJRM2hDTzBGQlEwb3NUVUZCUlN4VFFVRlRMRWxCUVVrc1QwRkJUeXhUUVVGVExFbEJRVWs3UVVGQlFUdEJRVUZCTzBGQlJ6TkRMR3RDUVVGclFpeFRRVUZUTEZGQlFWRXNUMEZCVHp0QlFVTjBReXhOUVVGSkxFOUJRVThzVjBGQlZ6dEJRVU5zUWl4WFFVRlBPMEZCUTFnc1RVRkJTU3hSUVVGUk8wRkJRMW9zVFVGQlNTeFJRVUZSTEZkQlFWY3NUMEZCVHp0QlFVTXhRaXhSUVVGSkxGVkJRVlVzVVVGQlVTeFJRVUZSTEZkQlFWYzdRVUZEZWtNc1VVRkJTU3hYUVVGWExFMUJRVTA3UVVGRGFrSXNhMEpCUVZrc1VVRkJVU3hSUVVGUk8wRkJRelZDTEdkQ1FVRlZMRkZCUVZFc1YwRkJWenRCUVVNM1FpeGpRVUZSTEZsQlFWa3NVMEZCVXp0QlFVRkJMRmRCUlRWQ08wRkJRMFFzYTBKQlFWazdRVUZEV2l4blFrRkJWVHRCUVVGQk8wRkJSV1FzVjBGQlR5eExRVUZMTEZsQlFXRXNWMEZCVlN4UFFVRlBMRlZCUVZVc1RVRkJUVHRCUVVGQk8wRkJSVGxFTEUxQlFVa3NUMEZCVHp0QlFVTlFMRmxCUVZFc1dVRkJXU3hSUVVGUkxHTkJRV003UVVGRE1VTXNVVUZCU1N4VFFVRlRMRTlCUVU4c1VVRkJVU3hYUVVGWE8wRkJRMjVETEdGQlFVOHNTMEZCU3p0QlFVTm9RaXhSUVVGSkxGRkJRVkU3UVVGRFVpeGxRVUZUTEZGQlFWRXNUMEZCVHl4UlFVRlJPMEZCUVVFN1FVRkZlRU1zVTBGQlR6dEJRVUZCTzBGQlJWZ3NLMEpCUVN0Q0xGTkJRVk1zVFVGQlRUdEJRVU14UXl4TlFVRkpMRlZCUVZVc1QwRkJUeXhMUVVGTExGZEJRVmNzU1VGQlNUdEJRVU42UXl4TlFVRkpMRlZCUVZVc2QwSkJRWGRDTzBGQlEyeERMRmxCUVZFc1VVRkJVVHRCUVVOb1FpeFpRVUZSTEZkQlFWYzdRVUZCUVR0QlFVRkJPMEZCUnpOQ0xIZENRVUYzUWp0QlFVTndRaXd5UWtGQmVVSTdRVUZCUVR0QlFVVTNRaXdyUWtGQkswSTdRVUZETTBJc1RVRkJTU3hqUVVGak8wRkJRMnhDTEhWQ1FVRnhRanRCUVVOeVFpeDVRa0ZCZFVJN1FVRkRka0lzVTBGQlR6dEJRVUZCTzBGQlJWZ3NOa0pCUVRaQ08wRkJRM3BDTEUxQlFVa3NWMEZCVnl4SFFVRkhPMEZCUTJ4Q0xFdEJRVWM3UVVGRFF5eFhRVUZQTEdWQlFXVXNVMEZCVXl4SFFVRkhPMEZCUXpsQ0xHdENRVUZaTzBGQlExb3NkVUpCUVdsQ08wRkJRMnBDTEZWQlFVa3NWVUZCVlR0QlFVTmtMRmRCUVVzc1NVRkJTU3hIUVVGSExFbEJRVWtzUjBGQlJ5eEZRVUZGTEVkQlFVYzdRVUZEY0VJc1dVRkJTU3hQUVVGUExGVkJRVlU3UVVGRGNrSXNZVUZCU3l4SFFVRkhMRTFCUVUwc1RVRkJUU3hMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVUZCTEZkQlJ6VkNMR1ZCUVdVc1UwRkJVenRCUVVOcVF5eDFRa0ZCY1VJN1FVRkRja0lzZVVKQlFYVkNPMEZCUVVFN1FVRkZNMElzWjBOQlFXZERPMEZCUXpWQ0xFMUJRVWtzWjBKQlFXZENPMEZCUTNCQ0xHOUNRVUZyUWp0QlFVTnNRaXhuUWtGQll5eFJRVUZSTEZOQlFWVXNSMEZCUnp0QlFVTXZRaXhOUVVGRkxFdEJRVXNzV1VGQldTeExRVUZMTEUxQlFVMHNSVUZCUlN4UlFVRlJPMEZCUVVFN1FVRkZOVU1zVFVGQlNTeGhRVUZoTEdWQlFXVXNUVUZCVFR0QlFVTjBReXhOUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVU51UWl4VFFVRlBPMEZCUTBnc1pVRkJWeXhGUVVGRk8wRkJRVUU3UVVGRmNrSXNhMFJCUVd0RUxFbEJRVWs3UVVGRGJFUXNkVUpCUVhGQ08wRkJRMnBDTzBGQlEwRXNiVUpCUVdVc1QwRkJUeXhsUVVGbExGRkJRVkVzV1VGQldUdEJRVUZCTzBGQlJUZEVMR2xDUVVGbExFdEJRVXM3UVVGRGNFSXNTVUZCUlR0QlFVTkdMRTlCUVVzc1YwRkJXVHRCUVVOaUxGRkJRVWtzUlVGQlJTeHpRa0ZCYzBJN1FVRkRlRUk3UVVGQlFTeExRVU5NTzBGQlFVRTdRVUZGVUN4dFEwRkJiVU1zVTBGQlV6dEJRVU40UXl4TlFVRkpMRU5CUVVNc1owSkJRV2RDTEV0QlFVc3NVMEZCVlN4SFFVRkhPMEZCUVVVc1YwRkJUeXhGUVVGRkxGZEJRVmNzVVVGQlVUdEJRVUZCTzBGQlEycEZMRzlDUVVGblFpeExRVUZMTzBGQlFVRTdRVUZGTjBJc05FSkJRVFJDTEZOQlFWTTdRVUZEYWtNc1RVRkJTU3hKUVVGSkxHZENRVUZuUWp0QlFVTjRRaXhUUVVGUE8wRkJRMGdzVVVGQlNTeG5Ra0ZCWjBJc1JVRkJSU3hIUVVGSExGZEJRVmNzVVVGQlVTeFJRVUZSTzBGQlEyaEVMSE5DUVVGblFpeFBRVUZQTEVkQlFVYzdRVUZETVVJN1FVRkJRVHRCUVVGQk8wRkJSMW9zZFVKQlFYVkNMRkZCUVZFN1FVRkRNMElzVTBGQlR5eEpRVUZKTEdGQlFXRXNWVUZCVlN4UFFVRlBPMEZCUVVFN1FVRkZOME1zWTBGQll5eEpRVUZKTEdOQlFXTTdRVUZETlVJc1RVRkJTU3hOUVVGTk8wRkJRMVlzVTBGQlR5eFhRVUZaTzBGQlEyWXNVVUZCU1N4alFVRmpMSFZDUVVGMVFpeGhRVUZoTzBGQlEzUkVMRkZCUVVrN1FVRkRRU3h0UWtGQllTeExRVUZMTzBGQlEyeENMR0ZCUVU4c1IwRkJSeXhOUVVGTkxFMUJRVTA3UVVGQlFTeGhRVVZ1UWl4SFFVRlFPMEZCUTBrc2MwSkJRV2RDTEdGQlFXRTdRVUZCUVN4alFVVnFRenRCUVVOSkxHMUNRVUZoTEZsQlFWazdRVUZEZWtJc1ZVRkJTVHRCUVVOQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNXaENMRWxCUVVrc1QwRkJUeXhEUVVGRkxGRkJRVkVzUjBGQlJ5eFJRVUZSTEVkQlFVY3NTVUZCU1R0QlFVTjJReXhKUVVGSkxHTkJRV003UVVGRGJFSXNTVUZCU1N4WlFVRlpPMEZCUTJoQ0xFbEJRVWtzWVVGQllUdEJRVU5xUWl4SlFVRkpMR05CUVdNN1FVRkRiRUlzU1VGQlNTeHJRa0ZCYTBJN1FVRkRkRUlzYTBKQlFXdENMRWxCUVVrc1VVRkJUeXhKUVVGSkxFbEJRVWs3UVVGRGFrTXNUVUZCU1N4VFFVRlRMRXRCUVVzc1RVRkJUU3hQUVVGUExFOUJRVTg3UVVGRGRFTXNUVUZCU1N4VFFVRlRPMEZCUTJJc1RVRkJTU3hOUVVGTk8wRkJRMVlzVFVGQlNTeFRRVUZUTzBGQlEySXNUVUZCU1N4TFFVRkxMRVZCUVVVN1FVRkRXQ3hOUVVGSkxGbEJRVmtzVlVGQlZUdEJRVU14UWl4TlFVRkpMRTFCUVUwc2NVSkJRWEZDTzBGQlFVRXNTVUZETTBJc1UwRkJVenRCUVVGQkxFbEJRMVFzWVVGQllTeERRVUZGTEU5QlFVOHNZMEZCWXl4alFVRmpMRTFCUVUwc1ZVRkJWVHRCUVVGQkxFbEJRMnhGTEV0QlFVc3NZVUZCWVR0QlFVRkJMRWxCUTJ4Q0xFMUJRVTBzWVVGQllUdEJRVUZCTEVsQlEyNUNMRmxCUVZrc1lVRkJZVHRCUVVGQkxFbEJRM3BDTEV0QlFVc3NZVUZCWVR0QlFVRkJMRWxCUTJ4Q0xGTkJRVk1zWVVGQllUdEJRVUZCTEVsQlEzUkNMRkZCUVZFc1lVRkJZVHRCUVVGQkxFbEJRM0pDTEU5QlFVOHNjMEpCUVhOQ0xGVkJRVlVzVDBGQlR6dEJRVUZCTEVsQlF6bERMRTlCUVU4c2MwSkJRWE5DTEZWQlFWVXNUMEZCVHp0QlFVRkJMRTFCUXpsRE8wRkJRMG9zVFVGQlNUdEJRVU5CTEZkQlFVOHNTMEZCU3p0QlFVTm9RaXhKUVVGRkxFOUJRVTg3UVVGRFZDeE5RVUZKTEZkQlFWY3NWMEZCV1R0QlFVTjJRaXhOUVVGRkxFdEJRVXNzVDBGQlR5eFBRVUZQTEV0QlFVc3NUMEZCVHp0QlFVRkJPMEZCUlhKRExFMUJRVWtzUzBGQlN5eFBRVUZQTEV0QlFVc3NTVUZCU1N4SlFVRkpPMEZCUXpkQ0xFMUJRVWtzU1VGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1R0QlFVTlNMRk5CUVU4N1FVRkJRVHRCUVVWWUxHMURRVUZ0UXp0QlFVTXZRaXhOUVVGSkxFTkJRVU1zUzBGQlN6dEJRVU5PTEZOQlFVc3NTMEZCU3l4RlFVRkZPMEZCUTJoQ0xFbEJRVVVzUzBGQlN6dEJRVU5RTEU5QlFVc3NWVUZCVlR0QlFVTm1MRk5CUVU4c1MwRkJTenRCUVVGQk8wRkJSV2hDTEcxRFFVRnRRenRCUVVNdlFpeE5RVUZKTEVOQlFVTXNTMEZCU3p0QlFVTk9MRmRCUVU4N1FVRkRXQ3hOUVVGSkxFVkJRVVVzUzBGQlN5eFhRVUZYTzBGQlEyeENMRk5CUVVzc1MwRkJTenRCUVVOa0xFOUJRVXNzVTBGQlV5eExRVUZMTEZOQlFWTTdRVUZETlVJc1UwRkJUenRCUVVGQk8wRkJSVmdzU1VGQlN5eE5RVUZMTEcxQ1FVRnRRaXhSUVVGUkxIRkNRVUZ4UWl4SlFVRkpPMEZCUXpGRUxEUkNRVUV3UWl3d1FrRkJNRUk3UVVGQlFUdEJRVVY0UkN4clEwRkJhME1zYVVKQlFXbENPMEZCUXk5RExFMUJRVWtzUzBGQlN5eFZRVUZWTEcxQ1FVRnRRaXhuUWtGQlowSXNaMEpCUVdkQ0xHVkJRV1U3UVVGRGFrWTdRVUZEUVN4WFFVRlBMR2RDUVVGblFpeExRVUZMTEZOQlFWVXNSMEZCUnp0QlFVTnlRenRCUVVOQkxHRkJRVTg3UVVGQlFTeFBRVU5TTEZOQlFWVXNSMEZCUnp0QlFVTmFPMEZCUTBFc1lVRkJUeXhWUVVGVk8wRkJRVUU3UVVGQlFUdEJRVWQ2UWl4VFFVRlBPMEZCUVVFN1FVRkZXQ3gxUWtGQmRVSXNXVUZCV1R0QlFVTXZRaXhKUVVGRk8wRkJRMFlzVFVGQlNTeERRVUZETEV0QlFVc3NWVUZCVlN4RlFVRkZMRXRCUVVzc1YwRkJWeXhIUVVGSE8wRkJRM0pETEZOQlFVc3NVMEZCVXl4TFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVVMVFpeFpRVUZWTEV0QlFVczdRVUZEWml4bFFVRmhMRmxCUVZrN1FVRkJRVHRCUVVVM1FpeDVRa0ZCZVVJN1FVRkRja0lzVFVGQlNTeFBRVUZQTEZWQlFWVXNWVUZCVlN4VFFVRlRPMEZCUTNoRExGbEJRVlU3UVVGRFZpeGxRVUZoTEUxQlFVMDdRVUZCUVR0QlFVVjJRaXh6UWtGQmMwSXNXVUZCV1N4bFFVRmxPMEZCUXpkRExFMUJRVWtzWTBGQll6dEJRVU5zUWl4TlFVRkpMR2RDUVVGblFpeExRVUZMTEZWQlFWY3NSVUZCUXl4blFrRkJaMElzWlVGQlpTeFBRVUZQTEdOQlFXVXNSVUZCUXl4RlFVRkZMR05CUVdNc1pVRkJaU3hOUVVGTk8wRkJRelZJTERKQ1FVRjFRaXhuUWtGQlowSXNZMEZCWXl4TFFVRkxMRTFCUVUwc1kwRkJZenRCUVVGQk8wRkJSV3hHTEUxQlFVa3NaVUZCWlR0QlFVTm1PMEZCUTBvc1VVRkJUVHRCUVVOT0xFMUJRVWtzWjBKQlFXZENPMEZCUTJoQ0xHTkJRVlVzVFVGQlRUdEJRVU53UWl4TlFVRkpMRzlDUVVGdlFqdEJRVU53UWl4UlFVRkpMR3RDUVVGclFpeFZRVUZWTEVsQlFVazdRVUZEY0VNc1VVRkJTU3haUVVGWkxGZEJRVmM3UVVGRE0wSXNkVUpCUVcxQ0xFOUJRVThzVlVGQlZUdEJRVU53UXl4dlFrRkJaMElzVlVGQlZTeFBRVUZQTEZWQlFWVTdRVUZETTBNc1VVRkJTU3haUVVGWkxGVkJRVlVzVjBGQlZ5eFJRVUZSTzBGQlEzcERMR0ZCUVU4c1pVRkJaU3hUUVVGVExGZEJRVmNzVlVGQlZUdEJRVU53UkN4elFrRkJaMElzVFVGQlRTeFZRVUZWTzBGQlEyaERMSE5DUVVGblFpeFBRVUZQTEZWQlFWVTdRVUZEYWtNc2MwSkJRV2RDTEZWQlFWVXNWVUZCVlR0QlFVTndReXh6UWtGQlowSXNVMEZCVXl4VlFVRlZPMEZCUTI1RExGVkJRVWtzVlVGQlZUdEJRVU5XTEhkQ1FVRm5RaXhoUVVGaExGVkJRVlU3UVVGRE0wTXNWVUZCU1N4VlFVRlZPMEZCUTFZc2QwSkJRV2RDTEUxQlFVMHNWVUZCVlR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVsb1JDeHZRa0ZCYjBJN1FVRkRhRUlzVFVGQlNTeG5Ra0ZCWjBJc1VVRkJVVHRCUVVNMVFpeFRRVUZQTEhGQ1FVRnhRanRCUVVGQkxFbEJRM2hDTEZOQlFWTTdRVUZCUVN4SlFVTlVMR0ZCUVdFc1QwRkJUeXg1UWtGQmVVSXNVMEZCVXp0QlFVRkJMRWxCUTNSRUxFdEJRVXNzWTBGQll6dEJRVUZCTEVsQlEyNUNMRTFCUVUwc1kwRkJZenRCUVVGQkxFbEJRM0JDTEZsQlFWa3NZMEZCWXp0QlFVRkJMRWxCUXpGQ0xFdEJRVXNzWTBGQll6dEJRVUZCTEVsQlEyNUNMRk5CUVZNc1kwRkJZenRCUVVGQkxFbEJRM1pDTEZGQlFWRXNZMEZCWXp0QlFVRkJMRWxCUTNSQ0xFOUJRVThzYlVKQlFXMUNPMEZCUVVFc1NVRkRNVUlzVDBGQlR5eGpRVUZqTEZWQlFWVTdRVUZCUVN4TlFVTXZRanRCUVVGQk8wRkJSVklzWjBKQlFXZENMRXRCUVVzc1NVRkJTU3hKUVVGSkxFbEJRVWtzU1VGQlNUdEJRVU5xUXl4TlFVRkpMR0ZCUVdFN1FVRkRha0lzVFVGQlNUdEJRVU5CTEdsQ1FVRmhMRXRCUVVzN1FVRkRiRUlzVjBGQlR5eEhRVUZITEVsQlFVa3NTVUZCU1R0QlFVRkJMRmxCUlhSQ08wRkJRMGtzYVVKQlFXRXNXVUZCV1R0QlFVRkJPMEZCUVVFN1FVRkhha01zWjBOQlFXZERMRXRCUVVzN1FVRkRha01zYjBKQlFXdENMRXRCUVVzc2RVSkJRWFZDTzBGQlFVRTdRVUZGYkVRc2JVTkJRVzFETEVsQlFVa3NUVUZCVFN4bFFVRmxMRk5CUVZNN1FVRkRha1VzVTBGQlR5eFBRVUZQTEU5QlFVOHNZVUZCWVN4TFFVRkxMRmRCUVZrN1FVRkRMME1zVVVGQlNTeFpRVUZaTzBGQlEyaENMRkZCUVVrN1FVRkRRVHRCUVVOS0xHbENRVUZoTEUxQlFVMDdRVUZEYmtJc1VVRkJTVHRCUVVOQkxHRkJRVThzUjBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZCUVN4alFVVXhRanRCUVVOSkxHMUNRVUZoTEZkQlFWYzdRVUZEZUVJc1ZVRkJTVHRCUVVOQkxDdENRVUYxUWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVsMlF5d3JRa0ZCSzBJc1ZVRkJWU3hOUVVGTk8wRkJRek5ETEZOQlFVOHNVMEZCVlN4WlFVRlpMRmxCUVZrN1FVRkRja01zVjBGQlR5eFRRVUZUTEV0QlFVc3NUVUZCVFN3d1FrRkJNRUlzV1VGQldTeFBRVUZQTERCQ1FVRXdRaXhaUVVGWk8wRkJRVUU3UVVGQlFUdEJRVWQwU0N4SlFVRkpMSEZDUVVGeFFqdEJRVU42UWl4eFFrRkJjVUlzUzBGQlN5eFRRVUZUTzBGQlF5OUNMRTFCUVVrN1FVRkRTaXhOUVVGSk8wRkJRMEVzVTBGQlN5eFJRVUZSTEZsQlFWazdRVUZCUVN4WFFVVjBRaXhIUVVGUU8wRkJRVUU3UVVGRFFTeE5RVUZKTEU5QlFVODdRVUZEVUN4UlFVRkpPMEZCUTBFc1ZVRkJTU3hQUVVGUExGbEJRVmtzUTBGQlJTeFRRVUZyUWl4UlFVRlJPMEZCUTI1RUxGVkJRVWtzVVVGQlVTeFpRVUZaTEZOQlFWTXNZVUZCWVR0QlFVTXhReXhuUWtGQlVTeFRRVUZUTEZsQlFWazdRVUZETjBJc1kwRkJUU3hWUVVGVkxHOUNRVUZ2UWl4TlFVRk5PMEZCUXpGRExHVkJRVThzVDBGQlR6dEJRVUZCTEdsQ1FVVlVMRkZCUVZFc1lVRkJZVHRCUVVNeFFpeG5Ra0ZCVVN4SlFVRkpMRmxCUVZrc2IwSkJRVzlDTEVOQlFVVXNVVUZCVVR0QlFVTjBSQ3hsUVVGUExFOUJRVTg3UVVGQlFUdEJRVVZzUWl4VlFVRkpMRk5CUVZNc1VVRkJVU3hsUVVGbE8wRkJRMmhETEhOQ1FVRmpPMEZCUTJRc1dVRkJTU3hEUVVGRExGRkJRVkVzZVVKQlFYbENMRkZCUVZFN1FVRkRNVU1zWTBGQlNUdEJRVU5CTEc5Q1FVRlJMSEZDUVVGeFFqdEJRVUZCTEcxQ1FVVXhRaXhIUVVGUU8wRkJRVUU3UVVGQlFUdEJRVVZTTEZWQlFVa3NVMEZCVXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hyUWtGQmEwSTdRVUZETTBNc1owSkJRVkVzUzBGQlN5d3dRa0ZCTWtJc1MwRkJTU3hUUVVGVE8wRkJRVUU3UVVGQlFTeGhRVWQwUkN4SFFVRlFPMEZCUVVFN1FVRkJRVHRCUVVWU0xFbEJRVWtzV1VGQldTeGhRVUZoTzBGQlJUZENMSGxDUVVGNVFpeEpRVUZKTEUxQlFVMHNXVUZCV1N4SlFVRkpPMEZCUXk5RExFMUJRVWtzUTBGQlF5eEhRVUZITEU5QlFVOHNaMEpCUVdsQ0xFTkJRVU1zU1VGQlNTeFpRVUZoTzBGQlF6bERMRkZCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzWlVGQlpUdEJRVU14UWl4VlFVRkpMRU5CUVVNc1IwRkJSeXhUUVVGVE8wRkJRMklzWlVGQlR5eFZRVUZWTEVsQlFVa3NWMEZCVnp0QlFVTndReXhUUVVGSExFOUJRVThzVFVGQlRUdEJRVUZCTzBGQlJYQkNMRmRCUVU4c1IwRkJSeXhQUVVGUExHVkJRV1VzUzBGQlN5eFhRVUZaTzBGQlFVVXNZVUZCVHl4blFrRkJaMElzU1VGQlNTeE5RVUZOTEZsQlFWazdRVUZCUVR0QlFVRkJMRk5CUlM5R08wRkJRMFFzVVVGQlNTeFJRVUZSTEVkQlFVY3NiVUpCUVcxQ0xFMUJRVTBzV1VGQldTeEhRVUZITzBGQlEzWkVMRkZCUVVrN1FVRkRRU3haUVVGTk8wRkJRVUVzWVVGRlNDeEpRVUZRTzBGQlEwa3NZVUZCVHl4VlFVRlZPMEZCUVVFN1FVRkZja0lzVjBGQlR5eE5RVUZOTEZOQlFWTXNUVUZCVFN4VFFVRlZMRk5CUVZNc1VVRkJVVHRCUVVOdVJDeGhRVUZQTEZOQlFWTXNWMEZCV1R0QlFVTjRRaXhaUVVGSkxGRkJRVkU3UVVGRFdpeGxRVUZQTEVkQlFVY3NVMEZCVXl4UlFVRlJPMEZCUVVFN1FVRkJRU3hQUVVWb1F5eExRVUZMTEZOQlFWVXNVVUZCVVR0QlFVTjBRaXhoUVVGUExFMUJRVTBzV1VGQldTeExRVUZMTEZkQlFWazdRVUZCUlN4bFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTEwwUXNTVUZCU1N4blFrRkJaMEk3UVVGRGNFSXNTVUZCU1N4WlFVRlpMRTlCUVU4c1lVRkJZVHRCUVVOd1F5eEpRVUZKTEZOQlFWTTdRVUZEWWl4SlFVRkpMSFZDUVVGMVFqdEJRVU16UWl4SlFVRkpMR3RDUVVGclFqdEJRVU4wUWl4SlFVRkpMR05CUVdNN1FVRkRiRUlzU1VGQlNTeGhRVUZoTEU5QlFVOHNZMEZCWXl4bFFVRmxMSE5DUVVGelFpeExRVUZMTEZWQlFWVTdRVUZETVVZc1NVRkJTU3cwUWtGQk5FSTdRVUZEYUVNc1NVRkJTU3cyUWtGQk5rSTdRVUZEYWtNc1NVRkJTU3gzUWtGQmQwSXNVMEZCVlN4UFFVRlBPMEZCUVVVc1UwRkJUeXhEUVVGRExEWkNRVUUyUWl4TFFVRkxPMEZCUVVFN1FVRkRla1lzU1VGQlNTeGhRVUZoTzBGQlEycENMRWxCUVVrc1YwRkJWenRCUVVObUxFbEJRVWtzV1VGQldUdEJRVVZvUWl4cFFrRkJhVUlzVTBGQlV5eFRRVUZUTzBGQlF5OUNMRk5CUVU4c1ZVRkRTQ3hWUVVOSkxGZEJRVms3UVVGQlJTeFhRVUZQTEZGQlFWRXNUVUZCVFN4TlFVRk5MR05CUVdNc1VVRkJVU3hOUVVGTkxFMUJRVTA3UVVGQlFTeE5RVU16UlN4VlFVTktPMEZCUVVFN1FVRkhVaXhKUVVGSk8wRkJRMG9zU1VGQlNUdEJRVU5CTEZsQlFWVTdRVUZCUVN4SlFVTk9MRmRCUVZjc1VVRkJVU3hoUVVGaExGRkJRVkVzWjBKQlFXZENMRkZCUVZFc2JVSkJRVzFDTEZGQlFWRTdRVUZCUVN4SlFVTXpSaXhoUVVGaExGRkJRVkVzWlVGQlpTeFJRVUZSTzBGQlFVRTdRVUZCUVN4VFFVYzNReXhIUVVGUU8wRkJRMGtzV1VGQlZTeERRVUZGTEZkQlFWY3NUVUZCVFN4aFFVRmhPMEZCUVVFN1FVRkhPVU1zTmtKQlFUWkNMRmxCUVZrN1FVRkRja01zVTBGQlR5eFhRVUZYTEZkQlFWY3NTVUZCU1N4WFFVRlhMRXRCUVVzN1FVRkJRVHRCUVVWeVJDeEpRVUZKTEZsQlFWa3NVMEZCVlN4aFFVRmhPMEZCUTI1RExFMUJRVWs3UVVGRFFTeG5Ra0ZCV1N4TFFVRkxMRU5CUVVNN1FVRkRiRUlzWjBKQlFWa3NWMEZCV1R0QlFVRkZMR0ZCUVU4c1EwRkJRenRCUVVGQk8wRkJRMnhETEZkQlFVOHNRMEZCUXp0QlFVRkJMRmRCUlV3c1IwRkJVRHRCUVVOSkxHZENRVUZaTEZkQlFWazdRVUZCUlN4aFFVRlBPMEZCUVVFN1FVRkRha01zVjBGQlR6dEJRVUZCTzBGQlFVRTdRVUZKWml4SlFVRkpMRmRCUVZjN1FVRkJRU3hGUVVOWUxFMUJRVTA3UVVGQlFTeEZRVU5PTEU5QlFVODdRVUZCUVN4RlFVTlFMRmRCUVZjN1FVRkJRU3hOUVVOUUxGRkJRVkU3UVVGQlJTeFhRVUZQTEZWQlFWVXNVVUZCVVR0QlFVRkJPMEZCUVVFc1JVRkRka01zVjBGQlZ6dEJRVUZCTzBGQlIyWXNkVU5CUVhWRExGTkJRVk03UVVGRE5VTXNVMEZCVHl4UFFVRlBMRmxCUVZrc1dVRkJXU3hEUVVGRExFdEJRVXNzUzBGQlN5eFhRVU16UXl4VFFVRlZMRXRCUVVzN1FVRkRZaXhSUVVGSkxFbEJRVWtzWVVGQllTeFZRVUZqTEZkQlFWY3NTMEZCVFR0QlFVTm9SQ3haUVVGTkxGVkJRVlU3UVVGRGFFSXNZVUZCVHl4SlFVRkpPMEZCUVVFN1FVRkZaaXhYUVVGUE8wRkJRVUVzVFVGRlZDeFRRVUZWTEV0QlFVczdRVUZCUlN4WFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVkc1F5eEpRVUZKTEZGQlFWVXNWMEZCV1R0QlFVTjBRaXh2UWtGQmFVSTdRVUZCUVR0QlFVVnFRaXhUUVVGTkxGVkJRVlVzVTBGQlV5eFRRVUZWTEUxQlFVMHNTVUZCU1N4aFFVRmhPMEZCUTNSRUxGRkJRVWtzVVVGQlVTeExRVUZMTEU5QlFVOHNTVUZCU1R0QlFVTTFRaXhSUVVGSkxGbEJRVmtzUzBGQlN6dEJRVU55UWl4eFEwRkJhVU1zVTBGQlV5eFJRVUZSTEZGQlFVODdRVUZEY2tRc1ZVRkJTU3hEUVVGRExFOUJRVTBzVDBGQlR6dEJRVU5rTEdOQlFVMHNTVUZCU1N4WFFVRlhMRk5CUVZNc1YwRkJWeXhaUVVGWk8wRkJRM3BFTEdGQlFVOHNSMEZCUnl4UFFVRk5MRlZCUVZVN1FVRkJRVHRCUVVVNVFpeFJRVUZKTEdOQlFXTTdRVUZEYkVJc1VVRkJTVHRCUVVOQkxHRkJRVThzVTBGQlV5eE5RVUZOTEU5QlFVOHNTMEZCU3l4TFFVTTVRaXhWUVVGVkxFbEJRVWtzVVVGRFZpeE5RVUZOTEZOQlFWTXNUVUZCVFN4NVFrRkJlVUlzWlVGRE9VTXNVMEZCVXl4WFFVRlpPMEZCUVVVc1pVRkJUeXhOUVVGTkxGTkJRVk1zVFVGQlRTeDVRa0ZCZVVJN1FVRkJRU3hUUVVGcFFpeERRVUZGTEU5QlFXTXNWMEZCVnl4SlFVRkpMR0ZCUVdFc1VVRkROMGtzWjBKQlFXZENMRXRCUVVzc1NVRkJTU3hOUVVGTkxFTkJRVU1zUzBGQlN5eFBRVUZQTzBGQlFVRXNZMEZGY0VRN1FVRkRTU3hWUVVGSk8wRkJRMEU3UVVGQlFUdEJRVUZCTzBGQlIxb3NVMEZCVFN4VlFVRlZMRTFCUVUwc1UwRkJWU3hYUVVGWExFbEJRVWs3UVVGRE0wTXNVVUZCU1N4UlFVRlJPMEZCUTFvc1VVRkJTU3hoUVVGaExGVkJRVlVzWjBKQlFXZENPMEZCUTNaRExHRkJRVThzUzBGQlN5eE5RVUZOTEZkQlFWY3NUVUZCVFR0QlFVTjJReXhYUVVGUExFdEJRVXNzVDBGQlR5eFpRVUZaTEZOQlFWVXNUMEZCVHp0QlFVTTFReXhoUVVGUExFMUJRVTBzUzBGQlN5eEpRVUZKTEVOQlFVVXNUMEZCWXl4TFFVRkxMRmxCUTNSRExFdEJRVXNzVTBGQlZTeExRVUZMTzBGQlFVVXNaVUZCVHl4TlFVRk5MRXRCUVVzc1VVRkJVU3hMUVVGTE8wRkJRVUU3UVVGQlFTeFBRVU16UkN4TFFVRkxPMEZCUVVFN1FVRkZXaXhUUVVGTkxGVkJRVlVzVVVGQlVTeFRRVUZWTEdGQlFXRTdRVUZETTBNc1VVRkJTU3hQUVVGUExHZENRVUZuUWp0QlFVTjJRaXhoUVVGUExFbEJRVWtzUzBGQlN5eEhRVUZITEZsQlFWa3NUVUZCVFR0QlFVTjZReXhSUVVGSkxGRkJRVkU3UVVGRFVpeGhRVUZQTEVsQlFVa3NTMEZCU3l4SFFVRkhMRmxCUVZrc1RVRkJUU3hOUVVGTkxGbEJRVmtzUzBGQlN5eFBRVUZQTzBGQlEzWkZMRkZCUVVrc1YwRkJWeXhMUVVGTE8wRkJRM0JDTEZGQlFVa3NVMEZCVXl4WFFVRlhPMEZCUTNCQ0xHRkJRVThzUzBGRFJpeE5RVUZOTEZOQlFWTXNTVUZEWml4UFFVRlBMRmxCUVZrc1UwRkJVenRCUVVOeVF5eFJRVUZKTEdkQ1FVRm5RaXhMUVVGTExFOUJRVThzVVVGQlVTeFBRVUZQTEV0QlFVc3NUMEZCVHl4VFFVRlRMRTlCUVU4c1UwRkJWU3hKUVVGSk8wRkJRM0pHTEdGQlFVOHNSMEZCUnl4WlFVTk9MRk5CUVZNc1RVRkJUU3hUUVVGVkxGTkJRVk03UVVGQlJTeGxRVUZQTEVkQlFVY3NVVUZCVVN4UlFVRlJMRmxCUVZrN1FVRkJRU3haUVVNeFJTeEhRVUZITEZGQlFWRXNUVUZCVFN4VFFVRlZMRk5CUVZNN1FVRkJSU3hsUVVGUExGTkJRVk1zVVVGQlVTeFpRVUZaTzBGQlFVRTdRVUZCUVN4UFFVTXZSVHRCUVVOSUxGRkJRVWtzYVVKQlFXbENMRXRCUVVzc1IwRkJSeXhaUVVGWk8wRkJRM0pETEdGQlFVOHNTMEZEUml4TlFVRk5MR05CUVdNc1RVRkRjRUlzVDBGQlR5eGpRVUZqTEZGQlFWRXNTVUZCU1N4VFFVRlZMRWxCUVVrN1FVRkJSU3hsUVVGUExGbEJRVms3UVVGQlFUdEJRVU0zUlN4UlFVRkpMRU5CUVVNc2FVSkJRV2xDTzBGQlEyeENMR05CUVZFc1MwRkJTeXhsUVVGbExFdEJRVXNzVlVGQlZTeGxRVUZsTEZOQlFWTXNTMEZCU3l4UFFVRlBMSGxDUVVNeFJTeHpRa0ZCY1VJc1UwRkJVeXhMUVVGTExFOUJRVTg3UVVGRGJrUXNVVUZCU1N4WlFVRlpMRXRCUVVzc1QwRkJUenRCUVVNMVFpeFJRVUZKTEUxQlFVMHNTMEZCU3l4SFFVRkhMRTFCUVUwN1FVRkRlRUlzYjBKQlFXZENMRWRCUVVjc1IwRkJSenRCUVVOc1FpeFZRVUZKTzBGQlEwRXNaVUZCVHl4SlFVRkpMRWxCUVVrc1IwRkJSeXhQUVVGUE8wRkJRVUVzWlVGRmRFSXNSMEZCVUR0QlFVTkpMR1ZCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMllzVVVGQlNTeE5RVUZMTEZOQlFWTXNUMEZCVHl4VFFVRlZMRXRCUVVrc1UwRkJVenRCUVVNMVF5eFZRVUZKTEZsQlFWa3NTVUZCUnl4SlFVRkpMR1ZCUVdVc1NVRkJSenRCUVVONlF5eFZRVUZKTEZGQlFWRXNWVUZCVlR0QlFVTjBRaXhWUVVGSkxGRkJRVkVzV1VGQldUdEJRVU40UWl4aFFVRlBPMEZCUVVFc1VVRkRTQ3hoUVVGaE8wRkJRVUVzVVVGRFlpeGhRVUZoTEVOQlFVTXNVVUZEVml4UlFVRlJMR05CUVdNc1UwRkJVeXhOUVVGTkxGRkJRMnBETEZOQlFWVXNSMEZCUnp0QlFVTlVMR05CUVVrc1QwRkJUeXhoUVVGaExFZEJRVWM3UVVGRE0wSXNhVUpCUVU4c1VVRkJVU3hUUVVGVExFdEJRVXNzUzBGQlN5eFRRVUZWTEUxQlFVMDdRVUZCUlN4dFFrRkJUeXhQUVVGUExFOUJRVTg3UVVGQlFUdEJRVUZCTEZsQlEzcEZMRk5CUVZVc1IwRkJSenRCUVVGRkxHbENRVUZQTEU5QlFVOHNUMEZCVHl4aFFVRmhMRWRCUVVjN1FVRkJRU3hoUVVNeFJEdEJRVUZCTzBGQlFVRXNUMEZGV0N4RFFVRkRMRTFCUVUwc1VVRkJVU3hOUVVGTkxFbEJRVWNzU1VGQlNTeHBRa0ZCYVVJc1NVRkJSenRCUVVOdVJDeFhRVUZQTEUxQlEwZ3NTMEZCU3l4TlFVRk5MRWxCUVVrc1RVRkJUU3hQUVVGUExGbEJRVmtzU1VGQlNTeFZRVU4yUXl4UFFVRlBMR3RDUVVOYUxHZENRVU5KTEV0QlFVc3NUMEZCVHl4clFrRkRXaXhMUVVGTExFMUJRVTBzVlVGQlZTeFBRVUZQTzBGQlFVRTdRVUZGZUVNc1UwRkJUU3hWUVVGVkxGTkJRVk1zVTBGQlZTeG5Ra0ZCWjBJN1FVRkRMME1zVjBGQlR5eExRVUZMTEdWQlFXVXNTVUZCU1R0QlFVRkJPMEZCUlc1RExGTkJRVTBzVlVGQlZTeFJRVUZSTEZOQlFWVXNZMEZCWXp0QlFVTTFReXhYUVVGUExFdEJRVXNzWlVGQlpTeE5RVUZOTzBGQlFVRTdRVUZGY2tNc1UwRkJUU3hWUVVGVkxGTkJRVk1zVTBGQlZTeFJRVUZSTzBGQlEzWkRMRmRCUVU4c1MwRkJTeXhsUVVGbExFOUJRVTg3UVVGQlFUdEJRVVYwUXl4VFFVRk5MRlZCUVZVc1VVRkJVU3hUUVVGVkxGTkJRVk03UVVGRGRrTXNWMEZCVHl4TFFVRkxMR1ZCUVdVc1RVRkJUVHRCUVVGQk8wRkJSWEpETEZOQlFVMHNWVUZCVlN4UFFVRlBMRk5CUVZVc1ZVRkJWVHRCUVVOMlF5eFhRVUZQTEV0QlFVc3NaVUZCWlN4TFFVRkxPMEZCUVVFN1FVRkZjRU1zVTBGQlRTeFZRVUZWTEZWQlFWVXNVMEZCVlN4alFVRmpPMEZCUXpsRExGZEJRVThzUzBGQlN5eGxRVUZsTEZGQlFWRTdRVUZCUVR0QlFVVjJReXhUUVVGTkxGVkJRVlVzWlVGQlpTeFhRVUZaTzBGQlEzWkRMRmRCUVU4c1NVRkJTU3hMUVVGTExFZEJRVWNzVjBGQlZ5eEpRVUZKTEV0QlFVc3NSMEZCUnl4WlFVRlpPMEZCUVVFN1FVRkZNVVFzVTBGQlRTeFZRVUZWTEZWQlFWVXNVMEZCVlN4UFFVRlBPMEZCUTNaRExGZEJRVThzU1VGQlNTeExRVUZMTEVkQlFVY3NWMEZCVnl4SlFVRkpMRXRCUVVzc1IwRkJSeXhaUVVGWkxFMUJRVTBzVVVGQlVTeFRRVU5vUlN4TlFVRk5MRTFCUVUwc1MwRkJTeXhQUVVGUExFMUJRM2hDTzBGQlFVRTdRVUZGVWl4VFFVRk5MRlZCUVZVc1ZVRkJWU3hYUVVGWk8wRkJRMnhETEZkQlFVOHNTMEZCU3l4bFFVRmxPMEZCUVVFN1FVRkZMMElzVTBGQlRTeFZRVUZWTEdGQlFXRXNVMEZCVlN4aFFVRmhPMEZCUTJoRUxGTkJRVXNzVDBGQlR5eGpRVUZqTzBGQlF6RkNMRkZCUVVrc1YwRkJWeXhUUVVGVkxFdEJRVXM3UVVGRE1VSXNWVUZCU1N4RFFVRkRPMEZCUTBRc1pVRkJUenRCUVVOWUxGVkJRVWtzVFVGQlRTeFBRVUZQTEU5QlFVOHNXVUZCV1R0QlFVTndReXhsUVVGVExFdEJRVXM3UVVGRFZpeFpRVUZKTEU5QlFVOHNTMEZCU3p0QlFVTmFMR05CUVVrN1FVRkRRU3huUWtGQlNTeExRVUZMTEVsQlFVazdRVUZCUVN4dFFrRkZWaXhIUVVGUU8wRkJRVUU3UVVGRFVpeGhRVUZQTzBGQlFVRTdRVUZGV0N4UlFVRkpMRXRCUVVzc1QwRkJUeXhWUVVGVk8wRkJRM1JDTEZkQlFVc3NTMEZCU3l4UlFVRlJMRmxCUVZrc1MwRkJTeXhQUVVGUE8wRkJRVUU3UVVGRk9VTXNVMEZCU3l4UFFVRlBMRmRCUVZjN1FVRkRka0lzVTBGQlN5eExRVUZMTEZkQlFWYzdRVUZEY2tJc1YwRkJUenRCUVVGQk8wRkJSVmdzVTBGQlRTeFZRVUZWTEdOQlFXTXNWMEZCV1R0QlFVTjBReXh0UWtGQlpTeFRRVUZUTzBGQlEzQkNMR0ZCUVU4c1RVRkJUVHRCUVVGQk8wRkJSV3BDTEZkQlFVOHNTMEZCU3l4WFFVRlhPMEZCUVVFN1FVRkZNMElzVTBGQlRTeFZRVUZWTEUxQlFVMHNVMEZCVlN4TFFVRkxMRXRCUVVzN1FVRkRkRU1zVVVGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1N4TlFVRkxMRXRCUVVzc1QwRkJUeXhUUVVGVExFOUJRVThzU1VGQlJ5eE5RVUZOTEZWQlFWVXNTVUZCUnp0QlFVTXpSQ3hSUVVGSkxGZEJRVmM3UVVGRFppeFJRVUZKTEZkQlFWY3NUVUZCVFR0QlFVTnFRaXhwUWtGQlZ5dzRRa0ZCT0VJc1UwRkJVenRCUVVGQk8wRkJSWFJFTEZkQlFVOHNTMEZCU3l4UFFVRlBMR0ZCUVdFc1UwRkJWU3hQUVVGUE8wRkJRemRETEdGQlFVOHNUVUZCVFN4TFFVRkxMRTlCUVU4c1EwRkJSU3hQUVVGakxFMUJRVTBzVDBGQlR5eE5RVUZOTEU5QlFVOHNUMEZCVHl4RFFVRkRMRTlCUVU4c1RVRkJUU3hSUVVGUkxFTkJRVU03UVVGQlFTeFBRVU5zUnl4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzU1VGQlNTeGpRVUZqTEdGQlFXRXNUMEZCVHl4SlFVRkpMRk5CUVZNc1RVRkJUU3hKUVVGSk8wRkJRVUVzVDBGRGVFWXNTMEZCU3l4VFFVRlZMRmxCUVZrN1FVRkROVUlzVlVGQlNTeFRRVUZUTzBGQlExUXNXVUZCU1R0QlFVTkJMSFZDUVVGaExFdEJRVXNzVTBGQlV6dEJRVUZCTEdsQ1FVVjRRaXhIUVVGUU8wRkJRVUU3UVVGQlFUdEJRVVZLTEdGQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1UwRkJUU3hWUVVGVkxGTkJRVk1zVTBGQlZTeGhRVUZoTEdWQlFXVTdRVUZETTBRc1VVRkJTU3hQUVVGUExHZENRVUZuUWl4WlFVRlpMRU5CUVVNc1VVRkJVU3hqUVVGak8wRkJRekZFTEZWQlFVa3NUVUZCVFN4aFFVRmhMR0ZCUVdFc1MwRkJTeXhQUVVGUExGRkJRVkU3UVVGRGVFUXNWVUZCU1N4UlFVRlJPMEZCUTFJc1pVRkJUeXhWUVVGVkxFbEJRVWtzVjBGQlZ5eG5Ra0ZCWjBJN1FVRkRjRVFzVlVGQlNUdEJRVU5CTEZsQlFVa3NUMEZCVHl4clFrRkJhMElzV1VGQldUdEJRVU55UXl4bFFVRkxMR1ZCUVdVc1VVRkJVU3hUUVVGVkxGTkJRVk03UVVGRE0wTXNlVUpCUVdFc1lVRkJZU3hUUVVGVExHTkJRV003UVVGQlFUdEJRVUZCTEdWQlIzQkVPMEZCUTBRc2QwSkJRV01zWVVGQllTeERRVUZGTEU5QlFVOHNZVUZCWVN4VFFVRlRPMEZCUVVFN1FVRkJRU3hsUVVjelJDeExRVUZRTzBGQlFVRTdRVUZGUVN4aFFVRlBMRXRCUVVzc1RVRkJUU3hQUVVGUExFOUJRVThzUzBGQlN5eFBRVUZQTzBGQlFVRXNWMEZGTTBNN1FVRkRSQ3hoUVVGUExFdEJRVXNzVFVGQlRTeFBRVUZQTEU5QlFVOHNZVUZCWVN4UFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVjMVJDeFRRVUZOTEZWQlFWVXNUVUZCVFN4VFFVRlZMRXRCUVVzc1MwRkJTenRCUVVOMFF5eFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRTFCUVVzc1MwRkJTeXhQUVVGUExGTkJRVk1zVDBGQlR5eEpRVUZITEUxQlFVMHNWVUZCVlN4SlFVRkhPMEZCUXpORUxGRkJRVWtzVjBGQlZ6dEJRVU5tTEZGQlFVa3NWMEZCVnl4TlFVRk5PMEZCUTJwQ0xHbENRVUZYTERoQ1FVRTRRaXhUUVVGVE8wRkJRVUU3UVVGRmRFUXNWMEZCVHl4TFFVRkxMRTlCUVU4c1lVRkJZU3hUUVVGVkxFOUJRVTg3UVVGQlJTeGhRVUZQTEUxQlFVMHNTMEZCU3l4UFFVRlBMRU5CUVVVc1QwRkJZeXhOUVVGTkxFOUJRVThzVVVGQlVTeERRVUZETEZkQlFWY3NUVUZCVFN4UFFVRlBMRTlCUVU4c1EwRkJReXhQUVVGUE8wRkJRVUVzVDBGRGNFb3NTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkJSU3hoUVVGUExFbEJRVWtzWTBGQll5eGhRVUZoTEU5QlFVOHNTVUZCU1N4VFFVRlRMRTFCUVUwc1NVRkJTVHRCUVVGQkxFOUJRekZHTEV0QlFVc3NVMEZCVlN4WlFVRlpPMEZCUXpWQ0xGVkJRVWtzVTBGQlV6dEJRVU5VTEZsQlFVazdRVUZEUVN4MVFrRkJZU3hMUVVGTExGTkJRVk03UVVGQlFTeHBRa0ZGZUVJc1IwRkJVRHRCUVVGQk8wRkJRVUU3UVVGRlNpeGhRVUZQTzBGQlFVRTdRVUZCUVR0QlFVZG1MRk5CUVUwc1ZVRkJWU3hUUVVGVExGTkJRVlVzUzBGQlN6dEJRVU53UXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhYUVVGUExFdEJRVXNzVDBGQlR5eGhRVUZoTEZOQlFWVXNUMEZCVHp0QlFVRkZMR0ZCUVU4c1RVRkJUU3hMUVVGTExFOUJRVThzUTBGQlJTeFBRVUZqTEUxQlFVMHNWVUZCVlN4TlFVRk5MRU5CUVVNN1FVRkJRU3hQUVVNNVJ5eExRVUZMTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1NVRkJTU3hqUVVGakxHRkJRV0VzVDBGQlR5eEpRVUZKTEZOQlFWTXNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkZMMFlzVTBGQlRTeFZRVUZWTEZGQlFWRXNWMEZCV1R0QlFVTm9ReXhSUVVGSkxGRkJRVkU3UVVGRFdpeFhRVUZQTEV0QlFVc3NUMEZCVHl4aFFVRmhMRk5CUVZVc1QwRkJUenRCUVVGRkxHRkJRVThzVFVGQlRTeExRVUZMTEU5QlFVOHNRMEZCUlN4UFFVRmpMRTFCUVUwc1pVRkJaU3hQUVVGUE8wRkJRVUVzVDBGRGJrZ3NTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkJSU3hoUVVGUExFbEJRVWtzWTBGQll5eGhRVUZoTEU5QlFVOHNTVUZCU1N4VFFVRlRMRTFCUVUwN1FVRkJRVHRCUVVGQk8wRkJSUzlHTEZOQlFVMHNWVUZCVlN4VlFVRlZMRk5CUVZVc1QwRkJUVHRCUVVOMFF5eFJRVUZKTEZGQlFWRTdRVUZEV2l4WFFVRlBMRXRCUVVzc1QwRkJUeXhaUVVGWkxGTkJRVlVzVDBGQlR6dEJRVU0xUXl4aFFVRlBMRTFCUVUwc1MwRkJTeXhSUVVGUk8wRkJRVUVzVVVGRGRFSXNUVUZCVFR0QlFVRkJMRkZCUTA0N1FVRkJRU3hUUVVORUxFdEJRVXNzVTBGQlZTeFJRVUZSTzBGQlFVVXNaVUZCVHl4UFFVRlBMRWxCUVVrc1UwRkJWU3hMUVVGTE8wRkJRVVVzYVVKQlFVOHNUVUZCVFN4TFFVRkxMRkZCUVZFc1MwRkJTenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlIzUkhMRk5CUVUwc1ZVRkJWU3hWUVVGVkxGTkJRVlVzVTBGQlV5eGxRVUZsTEZOQlFWTTdRVUZEYWtVc1VVRkJTU3hSUVVGUk8wRkJRMW9zVVVGQlNTeFJRVUZQTEUxQlFVMHNVVUZCVVN4cFFrRkJhVUlzWjBKQlFXZENPMEZCUXpGRUxHTkJRVlVzVjBGQldTeFRRVUZQTEZOQlFWazdRVUZEZWtNc1VVRkJTU3hqUVVGakxGVkJRVlVzVVVGQlVTeFZRVUZWTzBGQlF6bERMRmRCUVU4c1MwRkJTeXhQUVVGUExHRkJRV0VzVTBGQlZTeFBRVUZQTzBGQlF6ZERMRlZCUVVrc1RVRkJTeXhOUVVGTkxFOUJRVThzVTBGQlV5eFBRVUZQTEVsQlFVY3NUVUZCVFN4VlFVRlZMRWxCUVVjN1FVRkROVVFzVlVGQlNTeFhRVUZYTzBGQlExZ3NZMEZCVFN4SlFVRkpMRmRCUVZjc1owSkJRV2RDTzBGQlEzcERMRlZCUVVrc1UwRkJVU3hOUVVGTExGZEJRVmNzVVVGQlVUdEJRVU5vUXl4alFVRk5MRWxCUVVrc1YwRkJWeXhuUWtGQlowSTdRVUZEZWtNc1ZVRkJTU3hoUVVGaExGRkJRVkU3UVVGRGVrSXNWVUZCU1N4bFFVRmxMRmRCUVZjc1QwRkRNVUlzVVVGQlVTeEpRVUZKTERoQ1FVRTRRaXhaUVVNeFF6dEJRVU5LTEdGQlFVOHNUVUZCVFN4TFFVRkxMRTlCUVU4c1EwRkJSU3hQUVVGakxFMUJRVTBzVDBGQlR5eE5RVUZOTEU5QlFVMHNVVUZCVVN4alFVRmpMR05CUTI1R0xFdEJRVXNzVTBGQlZTeExRVUZKTzBGQlEzQkNMRmxCUVVrc1kwRkJZeXhKUVVGSExHRkJRV0VzVlVGQlZTeEpRVUZITEZOQlFWTXNZVUZCWVN4SlFVRkhMRmxCUVZrc1YwRkJWeXhKUVVGSE8wRkJRMnhITEZsQlFVa3NVMEZCVXl4alFVRmpMRlZCUVZVN1FVRkRja01zV1VGQlNTeG5Ra0ZCWjBJN1FVRkRhRUlzYVVKQlFVODdRVUZEV0N4alFVRk5MRWxCUVVrc1ZVRkJWU3hOUVVGTkxFOUJRVThzYVVKQlFXbENMR05CUVdNc1UwRkJVeXhoUVVGaExITkNRVUZ6UWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVsNFNDeFRRVUZOTEZWQlFWVXNWVUZCVlN4VFFVRlZMRk5CUVZNc1pVRkJaU3hUUVVGVE8wRkJRMnBGTEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc1VVRkJUeXhOUVVGTkxGRkJRVkVzYVVKQlFXbENMR2RDUVVGblFqdEJRVU14UkN4alFVRlZMRmRCUVZrc1UwRkJUeXhUUVVGWk8wRkJRM3BETEZGQlFVa3NZMEZCWXl4VlFVRlZMRkZCUVZFc1ZVRkJWVHRCUVVNNVF5eFhRVUZQTEV0QlFVc3NUMEZCVHl4aFFVRmhMRk5CUVZVc1QwRkJUenRCUVVNM1F5eFZRVUZKTEUxQlFVc3NUVUZCVFN4UFFVRlBMRk5CUVZNc1QwRkJUeXhKUVVGSExFMUJRVTBzVlVGQlZTeEpRVUZITzBGQlF6VkVMRlZCUVVrc1YwRkJWenRCUVVOWUxHTkJRVTBzU1VGQlNTeFhRVUZYTEdkQ1FVRm5RanRCUVVONlF5eFZRVUZKTEZOQlFWRXNUVUZCU3l4WFFVRlhMRkZCUVZFN1FVRkRhRU1zWTBGQlRTeEpRVUZKTEZkQlFWY3NaMEpCUVdkQ08wRkJRM3BETEZWQlFVa3NZVUZCWVN4UlFVRlJPMEZCUTNwQ0xGVkJRVWtzWlVGQlpTeFhRVUZYTEU5QlF6RkNMRkZCUVZFc1NVRkJTU3c0UWtGQk9FSXNXVUZETVVNN1FVRkRTaXhoUVVGUExFMUJRVTBzUzBGQlN5eFBRVUZQTEVOQlFVVXNUMEZCWXl4TlFVRk5MRTlCUVU4c1RVRkJUU3hQUVVGTkxGRkJRVkVzWTBGQll5eGpRVU51Uml4TFFVRkxMRk5CUVZVc1MwRkJTVHRCUVVOd1FpeFpRVUZKTEdOQlFXTXNTVUZCUnl4aFFVRmhMRlZCUVZVc1NVRkJSeXhUUVVGVExHRkJRV0VzU1VGQlJ5eFpRVUZaTEZkQlFWY3NTVUZCUnp0QlFVTnNSeXhaUVVGSkxGTkJRVk1zWTBGQll5eFZRVUZWTzBGQlEzSkRMRmxCUVVrc1owSkJRV2RDTzBGQlEyaENMR2xDUVVGUE8wRkJRMWdzWTBGQlRTeEpRVUZKTEZWQlFWVXNUVUZCVFN4UFFVRlBMR2xDUVVGcFFpeGpRVUZqTEZOQlFWTXNZVUZCWVN4elFrRkJjMEk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKZUVnc1UwRkJUU3hWUVVGVkxHRkJRV0VzVTBGQlZTeFBRVUZOTzBGQlEzcERMRkZCUVVrc1VVRkJVVHRCUVVOYUxGRkJRVWtzVlVGQlZTeE5RVUZMTzBGQlEyNUNMRmRCUVU4c1MwRkJTeXhQUVVGUExHRkJRV0VzVTBGQlZTeFBRVUZQTzBGQlF6ZERMR0ZCUVU4c1RVRkJUU3hMUVVGTExFOUJRVThzUTBGQlJTeFBRVUZqTEUxQlFVMHNWVUZCVlN4TlFVRk5PMEZCUVVFc1QwRkRhRVVzUzBGQlN5eFRRVUZWTEV0QlFVazdRVUZEYkVJc1ZVRkJTU3hqUVVGakxFbEJRVWNzWVVGQllTeGhRVUZoTEVsQlFVY3NXVUZCV1N4WFFVRlhMRWxCUVVjN1FVRkROVVVzVlVGQlNTeG5Ra0ZCWjBJN1FVRkRhRUlzWlVGQlR6dEJRVU5ZTEZsQlFVMHNTVUZCU1N4VlFVRlZMRTFCUVUwc1QwRkJUeXh2UWtGQmIwSXNZMEZCWXl4VFFVRlRMRlZCUVZVc2MwSkJRWE5DTzBGQlFVRTdRVUZCUVR0QlFVZHdTQ3hUUVVGUE8wRkJRVUU3UVVGSFdDeG5Ra0ZCWjBJc1MwRkJTenRCUVVOcVFpeE5RVUZKTEUxQlFVMDdRVUZEVml4TlFVRkpMRXRCUVVzc1UwRkJWU3hYUVVGWExGbEJRVms3UVVGRGRFTXNVVUZCU1N4WlFVRlpPMEZCUTFvc1ZVRkJTU3hMUVVGSkxGVkJRVlVzVVVGQlVTeFBRVUZQTEVsQlFVa3NUVUZCVFN4TFFVRkpPMEZCUXk5RExHRkJRVThzUlVGQlJUdEJRVU5NTEdGQlFVc3NTMEZCU1N4TFFVRkxMRlZCUVZVN1FVRkROVUlzVlVGQlNTeFhRVUZYTEZWQlFWVXNUVUZCVFN4TlFVRk5PMEZCUTNKRExHRkJRVTg3UVVGQlFTeGxRVVZHTEU5QlFWRXNZMEZCWlN4VlFVRlZPMEZCUTNSRExHRkJRVThzU1VGQlNUdEJRVUZCTzBGQlFVRTdRVUZIYmtJc1MwRkJSeXhsUVVGbE8wRkJRMnhDTEZkQlFWTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1ZVRkJWU3hSUVVGUkxFbEJRVWtzUjBGQlJ5eEZRVUZGTEVkQlFVYzdRVUZET1VNc1VVRkJTU3hWUVVGVk8wRkJRVUU3UVVGRmJFSXNVMEZCVHp0QlFVTlFMR1ZCUVdFc1YwRkJWeXhsUVVGbExHbENRVUZwUWp0QlFVTndSQ3hSUVVGSkxFOUJRVThzWTBGQll6dEJRVU55UWl4aFFVRlBMRzlDUVVGdlFqdEJRVU12UWl4UlFVRkpMRU5CUVVNN1FVRkRSQ3h6UWtGQlowSTdRVUZEY0VJc1VVRkJTU3hEUVVGRE8wRkJRMFFzZDBKQlFXdENPMEZCUTNSQ0xGRkJRVWtzVlVGQlZUdEJRVUZCTEUxQlExWXNZVUZCWVR0QlFVRkJMRTFCUTJJc1RVRkJUVHRCUVVGQkxFMUJRMDRzVjBGQlZ5eFRRVUZWTEVsQlFVazdRVUZEY2tJc1dVRkJTU3hSUVVGUkxGbEJRVmtzVVVGQlVTeFJRVUZSTEVsQlFVazdRVUZEZUVNc2EwSkJRVkVzV1VGQldTeExRVUZMTzBGQlEzcENMR3RDUVVGUkxFOUJRVThzWTBGQll5eFJRVUZSTEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCUVVFc1RVRkhia1FzWVVGQllTeFRRVUZWTEVsQlFVazdRVUZEZGtJc1owSkJRVkVzWTBGQll5eFJRVUZSTEZsQlFWa3NUMEZCVHl4VFFVRlZMRWxCUVVrN1FVRkJSU3hwUWtGQlR5eFBRVUZQTzBGQlFVRTdRVUZETDBVc1owSkJRVkVzVDBGQlR5eFJRVUZSTEZsQlFWa3NUMEZCVHl4bFFVRmxPMEZCUVVFN1FVRkJRVHRCUVVkcVJTeFJRVUZKTEdGQlFXRXNSMEZCUnl4aFFVRmhPMEZCUTJwRExGZEJRVTg3UVVGQlFUdEJRVVZZTEN0Q1FVRTJRaXhMUVVGTE8wRkJRemxDTEZOQlFVc3NTMEZCU3l4UlFVRlJMRk5CUVZVc1YwRkJWenRCUVVOdVF5eFZRVUZKTEU5QlFVOHNTVUZCU1R0QlFVTm1MRlZCUVVrc1VVRkJVU3hQUVVGUE8wRkJRMllzV1VGQlNTeFhRVUZYTEVsQlFVa3NWMEZCVnl4SlFVRkpMRWxCUVVrc1YwRkJWenRCUVVGQkxHbENRVVUxUXl4VFFVRlRMRkZCUVZFN1FVRkRkRUlzV1VGQlNTeFZRVUZWTEVsQlFVa3NWMEZCVnl4UlFVRlJMR2RDUVVGblFqdEJRVU5xUkN4alFVRkpMRXRCUVVrc1ZVRkJWU3hSUVVGUkxGRkJRVThzU1VGQlNTeE5RVUZOTzBGQlF6TkRMR2xDUVVGUE8wRkJRMGdzYTBKQlFVc3NUVUZCU3l4VlFVRlZPMEZCUTNoQ0xHdENRVUZSTEZsQlFWa3NVVUZCVVN4VFFVRlZMRWxCUVVrN1FVRkRkRU1zYlVKQlFVOHNjVUpCUVhGQ08wRkJRM2hDTEdsQ1FVRkhMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlRUTkNMR05CUVUwc1NVRkJTU3hYUVVGWExHZENRVUZuUWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0eVJDdzRRa0ZCT0VJc1YwRkJWeXhoUVVGaE8wRkJRMnhFTEZOQlFVOHNZVUZCWVN4TFFVRkxMRU5CUVVVN1FVRkRNMElzVTBGQlR6dEJRVUZCTzBGQlIxZ3NaME5CUVdkRExFbEJRVWs3UVVGRGFFTXNVMEZCVHl4eFFrRkJjVUlzVFVGQlRTeFhRVUZYTEdkQ1FVRmxMRTFCUVUwc1lVRkJZU3hQUVVGUE8wRkJRMnhHTEZOQlFVc3NTMEZCU3p0QlFVTldMRk5CUVVzc1RVRkJUVHRCUVVOWUxGTkJRVXNzVDBGQlR6dEJRVU5hTEZOQlFVc3NVMEZCVXp0QlFVTmtMRk5CUVVzc1QwRkJUeXhIUVVGSExGZEJRVmNzVVVGQlVTeEhRVUZITEZkQlFWY3NUVUZCVFN4UFFVRlBMRTlCUVU4c1RVRkJUVHRCUVVGQkxFMUJRM1JGTEZWQlFWa3NRMEZCUXl4dFFrRkJiVUk3UVVGQlFTeE5RVU5vUXl4VFFVRlhMRU5CUVVNc2JVSkJRVzFDTzBGQlFVRXNUVUZETDBJc1ZVRkJXU3hEUVVGRExHMUNRVUZ0UWp0QlFVRkJMRTFCUTJoRExGVkJRVmtzUTBGQlF5eHRRa0ZCYlVJN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTE5VTXNlVUpCUVhsQ0xFdEJRVXNzYlVKQlFXMUNPMEZCUXpkRExGTkJRVThzUTBGQlJTeExRVUZKTEZWQlFWVXNTVUZCU1N4aFFVRmhMRWxCUVVrc1QwRkRka01zY1VKQlFXOUNMRWxCUVVrc1dVRkJXU3hEUVVGRExFbEJRVWs3UVVGQlFUdEJRVVZzUkN4dFFrRkJiVUlzUzBGQlN5eEpRVUZKTzBGQlEzaENMRTFCUVVrc1UwRkJVeXhSUVVGUkxFbEJRVWtzVVVGQlVUdEJRVUZCTzBGQlJYSkRMSGxDUVVGNVFpeExRVUZMTEZOQlFWTXNaVUZCWlR0QlFVTnNSQ3hOUVVGSkxFOUJRVThzU1VGQlNUdEJRVU5tTEUxQlFVa3NaVUZCWlN4UFFVRlBMRmRCUVZrN1FVRkJSU3hYUVVGUExGRkJRVkVzVVVGQlVUdEJRVUZCTEUxQlFXZENPMEZCUXk5RkxFMUJRVWtzV1VGQldTeHBRa0ZCYVVJc1EwRkJRenRCUVVGQk8wRkJSWFJETEhkQ1FVRjNRaXhMUVVGTExFbEJRVWs3UVVGRE4wSXNUVUZCU1N4VlFVRlZMRkZCUVZFc1NVRkJTU3hUUVVGVE8wRkJRVUU3UVVGRmRrTXNlVUpCUVhsQ0xFdEJRVXNzV1VGQldUdEJRVU4wUXl4TlFVRkpMRWxCUVVrN1FVRkRTaXhYUVVGUExGZEJRVmM3UVVGRGRFSXNUVUZCU1N4UlFVRlJMRmRCUVZjc2EwSkJRV3RDTEVsQlFVazdRVUZETjBNc1RVRkJTU3hEUVVGRE8wRkJRMFFzVlVGQlRTeEpRVUZKTEZkQlFWY3NUMEZCVHl4aFFVRmhMRWxCUVVrc1VVRkJVU3h6UWtGQmMwSXNWMEZCVnl4UFFVRlBPMEZCUTJwSExGTkJRVTg3UVVGQlFUdEJRVVZZTEc5Q1FVRnZRaXhMUVVGTExGZEJRVmNzVDBGQlR6dEJRVU4yUXl4TlFVRkpMRkZCUVZFc1owSkJRV2RDTEV0QlFVc3NWVUZCVlR0QlFVTXpReXhUUVVGUExGVkJRVlVzVjBGQlZ6dEJRVUZCTEVsQlEzaENPMEZCUVVFc1NVRkRRU3hSUVVGUkxFTkJRVU1zU1VGQlNUdEJRVUZCTEVsQlEySXNVMEZCVXl4SlFVRkpMRkZCUVZFN1FVRkJRU3hKUVVOeVFpeFJRVUZSTEVOQlFVTXNRMEZCUXl4SlFVRkpPMEZCUVVFc1NVRkRaQ3hQUVVGUE8wRkJRVUVzVFVGRFNEdEJRVUZCTEUxQlEwRXNUMEZCVHl4SlFVRkpPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWFpDTEdOQlFXTXNTMEZCU3l4SlFVRkpMRmRCUVZjc1YwRkJWenRCUVVONlF5eE5RVUZKTEZOQlFWTXNTVUZCU1N4bFFVRmxMRkZCUVZFc1NVRkJTU3hSUVVGUkxFbEJRVWtzYTBKQlFXdENMRWxCUVVrN1FVRkRPVVVzVFVGQlNTeERRVUZETEVsQlFVa3NTVUZCU1R0QlFVTlVMRmRCUVU4c1VVRkJVU3hYUVVGWExFdEJRVXNzVjBGQlZ5eFpRVUZaTEZGQlFWRXNTVUZCU1N4WFFVRlhMRk5CUVZNc1NVRkJTU3hEUVVGRExFbEJRVWtzV1VGQldTeEpRVUZKTzBGQlFVRXNVMEZGT1VjN1FVRkRSQ3hSUVVGSkxGRkJRVkU3UVVGRFdpeFJRVUZKTEZGQlFWRXNVMEZCVlN4TlFVRk5MRkZCUVZFc1UwRkJVenRCUVVONlF5eFZRVUZKTEVOQlFVTXNWVUZCVlN4UFFVRlBMRkZCUVZFc1UwRkJVeXhUUVVGVkxGRkJRVkU3UVVGQlJTeGxRVUZQTEU5QlFVOHNTMEZCU3p0QlFVRkJMRk5CUVZrc1UwRkJWU3hMUVVGTE8wRkJRVVVzWlVGQlR5eFBRVUZQTEV0QlFVczdRVUZCUVN4VlFVRlZPMEZCUTNCSkxGbEJRVWtzWVVGQllTeFBRVUZQTzBGQlEzaENMRmxCUVVrc1RVRkJUU3hMUVVGTE8wRkJRMllzV1VGQlNTeFJRVUZSTzBGQlExSXNaMEpCUVUwc1MwRkJTeXhKUVVGSkxGZEJRVmM3UVVGRE9VSXNXVUZCU1N4RFFVRkRMRTlCUVU4c1QwRkJUeXhOUVVGTk8wRkJRM0pDTEdkQ1FVRk5MRTlCUVU4N1FVRkRZaXhoUVVGSExFMUJRVTBzVVVGQlVUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVazNRaXhYUVVGUExGRkJRVkVzU1VGQlNUdEJRVUZCTEUxQlEyWXNTVUZCU1N4SFFVRkhMRk5CUVZNc1QwRkJUenRCUVVGQkxFMUJRM1pDTEZGQlFWRXNWMEZCVnl4TFFVRkxMRmRCUVZjc1dVRkJXU3hKUVVGSkxGZEJRVmNzVDBGQlR5eERRVUZETEVsQlFVa3NXVUZCV1N4SlFVRkpPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWFJITEdsQ1FVRnBRaXhsUVVGbExGRkJRVkVzU1VGQlNTeGhRVUZoTzBGQlEzSkVMRTFCUVVrc1YwRkJWeXhqUVVGakxGTkJRVlVzUjBGQlJ5eEhRVUZITEVkQlFVYzdRVUZCUlN4WFFVRlBMRWRCUVVjc1dVRkJXU3hKUVVGSkxFZEJRVWM3UVVGQlFTeE5RVUZSTzBGQlEzWkdMRTFCUVVrc1dVRkJXU3hMUVVGTE8wRkJRM0pDTEZOQlFVOHNZMEZCWXl4TFFVRkxMRk5CUVZVc1VVRkJVVHRCUVVONFF5eFJRVUZKTEZGQlFWRTdRVUZEVWl4aFFVRlBMRTlCUVU4c1RVRkJUU3hYUVVGWk8wRkJRelZDTEZsQlFVa3NTVUZCU1N4WFFVRlpPMEZCUVVVc2FVSkJRVThzVDBGQlR6dEJRVUZCTzBGQlEzQkRMRmxCUVVrc1EwRkJReXhWUVVGVkxFOUJRVThzVVVGQlVTeFRRVUZWTEZWQlFWVTdRVUZCUlN4cFFrRkJUeXhKUVVGSk8wRkJRVUVzVjBGQllTeFRRVUZWTEV0QlFVczdRVUZCUlN4cFFrRkJUeXhMUVVGTE8wRkJRVTBzWTBGQlNUdEJRVUZCTEZkQlFWRXNVMEZCVlN4SFFVRkhPMEZCUVVVc2FVSkJRVThzUzBGQlN6dEJRVUZKTEdOQlFVazdRVUZCUVR0QlFVTXhTaXh2UWtGQlZTeFBRVUZQTEU5QlFVOHNVVUZCVVN4VFFVRlZMRlZCUVZVN1FVRkJSU3h0UWtGQlR5eEpRVUZKTzBGQlFVRTdRVUZEY2tVN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVTFvUWl4SlFVRkpMR0ZCUVdVc1YwRkJXVHRCUVVNelFpeDVRa0ZCYzBJN1FVRkJRVHRCUVVWMFFpeGpRVUZYTEZWQlFWVXNVVUZCVVN4VFFVRlZMRWxCUVVrc1NVRkJTVHRCUVVNelF5eFJRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm1MRmRCUVU4c1NVRkJTU3hSUVVOUUxFbEJRVWtzVFVGQlRTeFBRVUZQTEUxQlFVMHNWVUZCVlN4TFFVRkxMRTFCUVUwc1NVRkJTU3hWUVVOb1JDeEpRVUZKTEUxQlFVMHNUMEZCVHl4WlFVRlpMRWxCUVVrc1MwRkJTenRCUVVGQk8wRkJSVGxETEdOQlFWY3NWVUZCVlN4VFFVRlRMRk5CUVZVc1NVRkJTVHRCUVVONFF5eFJRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm1MRmRCUVU4c1NVRkJTU3hSUVVOUUxFbEJRVWtzVFVGQlRTeFBRVUZQTEUxQlFVMHNWVUZCVlN4TFFVRkxMRTFCUVUwc1NVRkJTU3hWUVVOb1JDeEpRVUZKTEUxQlFVMHNUMEZCVHl4aFFVRmhMRWxCUVVrN1FVRkJRVHRCUVVVeFF5eGpRVUZYTEZWQlFWVXNaMEpCUVdkQ0xGTkJRVlVzU1VGQlNUdEJRVU12UXl4UlFVRkpMRTFCUVUwc1MwRkJTenRCUVVObUxGRkJRVWtzV1VGQldTeFJRVUZSTEVsQlFVa3NWMEZCVnp0QlFVRkJPMEZCUlRORExHTkJRVmNzVlVGQlZTeFhRVUZYTEZOQlFWVXNTVUZCU1N4WFFVRlhPMEZCUTNKRUxGZEJRVThzUzBGQlN5eExRVUZMTEUxQlFVMHNTVUZCU1N4WFFVRlhMRXRCUVVzc1MwRkJTeXhOUVVGTk8wRkJRVUU3UVVGRk1VUXNZMEZCVnl4VlFVRlZMRkZCUVZFc1UwRkJWU3hSUVVGUE8wRkJRekZETEZGQlFVa3NTMEZCU3l4UFFVRlBMRTlCUVU4c1MwRkJTeXhaUVVGWkxGbEJRVmtzVFVGQlRTeFBRVUZQTEU5QlFVOHNTMEZCU3p0QlFVTTNSU3hSUVVGSk8wRkJRMEVzWVVGQlR5eExRVUZMTzBGQlEyaENMRTlCUVVjc1QwRkJUenRCUVVOV0xGZEJRVTg3UVVGQlFUdEJRVVZZTEdOQlFWY3NWVUZCVlN4TlFVRk5MRmRCUVZrN1FVRkRia01zVTBGQlN5eExRVUZMTEdOQlFXTTdRVUZEZUVJc1YwRkJUenRCUVVGQk8wRkJSVmdzWTBGQlZ5eFZRVUZWTEU5QlFVOHNVMEZCVlN4SlFVRkpPMEZCUTNSRExGRkJRVWtzVFVGQlRTeExRVUZMTzBGQlEyWXNWMEZCVHl4TFFVRkxMRTFCUVUwc1UwRkJWU3hQUVVGUE8wRkJRVVVzWVVGQlR5eExRVUZMTEV0QlFVc3NTVUZCU1N4UFFVRlBMRWxCUVVrc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGRkwwVXNZMEZCVnl4VlFVRlZMRkZCUVZFc1UwRkJWU3hKUVVGSk8wRkJRM1pETEZGQlFVa3NVVUZCVVR0QlFVTmFMRmRCUVU4c1MwRkJTeXhOUVVGTkxGTkJRVlVzVDBGQlR6dEJRVU12UWl4VlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVOb1FpeFZRVUZKTEZsQlFWa3NTVUZCU1N4TlFVRk5PMEZCUXpGQ0xGVkJRVWtzWjBKQlFXZENMRXRCUVVzc1QwRkJUenRCUVVNMVFpeGxRVUZQTEZWQlFWVXNUVUZCVFR0QlFVRkJMRlZCUTI1Q08wRkJRVUVzVlVGRFFTeFBRVUZQTzBGQlFVRXNXVUZEU0N4UFFVRlBMR2RDUVVGblFpeExRVUZMTEZWQlFWVTdRVUZCUVN4WlFVTjBReXhQUVVGUExFbEJRVWs3UVVGQlFUdEJRVUZCTEZkQlJXaENMRXRCUVVzc1UwRkJWU3hSUVVGUE8wRkJRVVVzYVVKQlFVOHNTMEZCU3l4SlFVRkpMRkZCUVU4c1NVRkJTVHRCUVVGQk8wRkJRVUVzWVVGRmNrUTdRVUZEUkN4WlFVRkpMRkZCUVZFN1FVRkRXaXhsUVVGUExFdEJRVXNzUzBGQlN5eFhRVUZaTzBGQlFVVXNXVUZCUlR0QlFVRlBMR2xDUVVGUE8wRkJRVUVzVjBGQlZTeFBRVUZQTEZkQlF6TkVMRXRCUVVzc1YwRkJXVHRCUVVGRkxHbENRVUZQTzBGQlFVRTdRVUZCUVR0QlFVRkJMRTlCUlhCRExFdEJRVXM3UVVGQlFUdEJRVVZhTEdOQlFWY3NWVUZCVlN4VFFVRlRMRk5CUVZVc1UwRkJVeXhKUVVGSk8wRkJRMnBFTEZGQlFVa3NVVUZCVVN4UlFVRlJMRTFCUVUwc1MwRkJTeXhYUVVGWExGZEJRVmNzVFVGQlRTeEpRVUZKTEZsQlFWa3NUVUZCVFN4VFFVRlRPMEZCUXpGR0xHOUNRVUZuUWl4TFFVRkxMRWRCUVVjN1FVRkRjRUlzVlVGQlNUdEJRVU5CTEdWQlFVOHNUMEZCVHl4SlFVRkpMRTFCUVUwc1MwRkJTeXhKUVVGSk8wRkJRM0pETEdGQlFVOHNTVUZCU1R0QlFVRkJPMEZCUldZc1VVRkJTU3hSUVVGUkxFdEJRVXNzUzBGQlN5eFJRVUZSTEZOQlFWTXNTVUZCU1R0QlFVTXpReXh2UWtGQlowSXNSMEZCUnl4SFFVRkhPMEZCUTJ4Q0xGVkJRVWtzVDBGQlR5eFBRVUZQTEVkQlFVY3NXVUZCV1N4UFFVRlBMRTlCUVU4c1IwRkJSenRCUVVOc1JDeGhRVUZQTEU5QlFVOHNUMEZCVHl4RFFVRkRMRkZCUVZFc1QwRkJUeXhQUVVGUExGRkJRVkU3UVVGQlFUdEJRVVY0UkN4WFFVRlBMRXRCUVVzc1VVRkJVU3hUUVVGVkxFZEJRVWM3UVVGRE4wSXNZVUZCVHl4RlFVRkZMRXRCUVVzN1FVRkJRU3hQUVVObUxFdEJRVXM3UVVGQlFUdEJRVVZhTEdOQlFWY3NWVUZCVlN4VlFVRlZMRk5CUVZVc1NVRkJTVHRCUVVONlF5eFJRVUZKTEZGQlFWRTdRVUZEV2l4WFFVRlBMRXRCUVVzc1RVRkJUU3hUUVVGVkxFOUJRVTg3UVVGREwwSXNWVUZCU1N4TlFVRk5MRTFCUVUwN1FVRkRhRUlzVlVGQlNTeEpRVUZKTEZGQlFWRXNWVUZCVlN4blFrRkJaMElzUzBGQlN5eFRRVUZUTEVsQlFVa3NVVUZCVVN4SFFVRkhPMEZCUTI1RkxGbEJRVWtzWjBKQlFXZENMRWxCUVVrN1FVRkRlRUlzV1VGQlNTeFJRVUZSTEdkQ1FVRm5RaXhMUVVGTExFbEJRVWtzVFVGQlRTeExRVUZMTzBGQlEyaEVMR1ZCUVU4c1NVRkJTU3hOUVVGTkxFdEJRVXNzVFVGQlRUdEJRVUZCTEZWQlEzaENPMEZCUVVFc1ZVRkRRU3hQUVVGUExFbEJRVWs3UVVGQlFTeFZRVU5ZTEZGQlFWRTdRVUZCUVN4VlFVTlNMRTlCUVU4N1FVRkJRU3haUVVOSU8wRkJRVUVzV1VGRFFTeFBRVUZQTEVsQlFVazdRVUZCUVR0QlFVRkJMRmRCUldoQ0xFdEJRVXNzVTBGQlZTeExRVUZKTzBGQlEyeENMR05CUVVrc1UwRkJVeXhKUVVGSE8wRkJRMmhDTEdsQ1FVRlBMR2RDUVVGblFpeFBRVUZQTEVsQlFVa3NhVUpCUVdsQ08wRkJRVUU3UVVGQlFTeGhRVWQwUkR0QlFVTkVMRmxCUVVrc1RVRkJUVHRCUVVOV0xHVkJRVThzUzBGQlN5eExRVUZMTEZOQlFWVXNUVUZCVFR0QlFVRkZMR2xDUVVGUExFbEJRVWtzUzBGQlN6dEJRVUZCTEZkQlFWVXNUMEZCVHl4SlFVRkpMRTFCUVUwc1RVRkJUU3hMUVVGTExGZEJRVms3UVVGQlJTeHBRa0ZCVHp0QlFVRkJPMEZCUVVFN1FVRkJRU3hQUVVWdVNEdEJRVUZCTzBGQlJWQXNZMEZCVnl4VlFVRlZMRk5CUVZNc1UwRkJWU3hSUVVGUk8wRkJRelZETEZGQlFVa3NUVUZCVFN4TFFVRkxPMEZCUTJZc1VVRkJTU3hWUVVGVk8wRkJRMVlzWVVGQlR6dEJRVU5ZTEZGQlFVa3NWVUZCVlR0QlFVTmtMRkZCUVVrc1owSkJRV2RDTEUxQlFVMDdRVUZEZEVJc2MwSkJRV2RDTEV0QlFVc3NWMEZCV1R0QlFVTTNRaXhaUVVGSkxHRkJRV0U3UVVGRGFrSXNaVUZCVHl4VFFVRlZMRkZCUVZFc1UwRkJVenRCUVVNNVFpeGpRVUZKTEdWQlFXVTdRVUZEWml4dFFrRkJUenRCUVVOWUxHTkJRVWtzWlVGQlpTeEhRVUZITzBGQlEyeENMR05CUVVVN1FVRkRSaXh0UWtGQlR6dEJRVUZCTzBGQlJWZ3NhMEpCUVZFc1YwRkJXVHRCUVVOb1FpeHRRa0ZCVHl4UlFVRlJPMEZCUTJZc2VVSkJRV0U3UVVGQlFUdEJRVVZxUWl4cFFrRkJUenRCUVVGQk8wRkJRVUU3UVVGQlFTeFhRVWxrTzBGQlEwUXNjMEpCUVdkQ0xFdEJRVXNzVjBGQldUdEJRVU0zUWl4WlFVRkpMR0ZCUVdFN1FVRkRha0lzWlVGQlR5eFhRVUZaTzBGQlFVVXNhVUpCUVZFc1JVRkJSU3hoUVVGaE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlIzQkVMRmRCUVU4N1FVRkJRVHRCUVVWWUxHTkJRVmNzVlVGQlZTeFJRVUZSTEZOQlFWVXNVMEZCVXp0QlFVTTFReXhUUVVGTExFdEJRVXNzVVVGQlVTeExRVUZMTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4N1FVRkROVU1zYjBKQlFXZENMRXRCUVVzc1RVRkJUU3hYUVVGWk8wRkJRMjVETEZWQlFVa3NWMEZCVnp0QlFVTm1MR0ZCUVU4c1UwRkJWU3hSUVVGUkxGTkJRVk1zVTBGQlV6dEJRVU4yUXl4WlFVRkpMRVZCUVVVc1dVRkJXVHRCUVVOa0xHdENRVUZSTzBGQlExb3NaVUZCVHl4WlFVRlpPMEZCUVVFN1FVRkJRU3hQUVVWNFFqdEJRVU5JTEZkQlFVODdRVUZCUVR0QlFVVllMR05CUVZjc1ZVRkJWU3hSUVVGUkxGTkJRVlVzWjBKQlFXZENMRzFDUVVGdFFqdEJRVU4wUlN4alFVRlZMRXRCUVVzc1RVRkJUU3hUUVVGVkxGRkJRVkVzVTBGQlV5eFRRVUZUTzBGQlEzSkVMRlZCUVVrc1pVRkJaU3hQUVVGUExGRkJRVkU3UVVGRE9VSXNaMEpCUVZFN1FVRkRVaXhsUVVGUE8wRkJRVUVzWVVGRlRqdEJRVU5FTEdWQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1YwRkJUenRCUVVGQk8wRkJSVmdzWTBGQlZ5eFZRVUZWTEZGQlFWRXNVMEZCVlN4SlFVRkpPMEZCUTNaRExGZEJRVThzUzBGQlN5eE5RVUZOTEVkQlFVY3NVVUZCVVN4VFFVRlZMRWRCUVVjN1FVRkJSU3hoUVVGUExFVkJRVVU3UVVGQlFTeFBRVUZQTEV0QlFVczdRVUZCUVR0QlFVVnlSU3hqUVVGWExGVkJRVlVzVDBGQlR5eFRRVUZWTEVsQlFVazdRVUZEZEVNc1YwRkJUeXhMUVVGTExGVkJRVlVzVFVGQlRUdEJRVUZCTzBGQlJXaERMR05CUVZjc1ZVRkJWU3hUUVVGVExGTkJRVlVzWjBKQlFXZENPMEZCUTNCRUxHTkJRVlVzUzBGQlN5eE5RVUZOTEZOQlFWVXNVVUZCVVR0QlFVTnVReXhoUVVGUExHVkJRV1VzVDBGQlR6dEJRVUZCTzBGQlJXcERMRzFDUVVGbExFdEJRVXNzVFVGQlRUdEJRVU14UWl4WFFVRlBPMEZCUVVFN1FVRkZXQ3hqUVVGWExGVkJRVlVzVFVGQlRTeFRRVUZWTEZGQlFWRTdRVUZEZWtNc1YwRkJUeXhMUVVGTExFOUJRVTg3UVVGQlFUdEJRVVYyUWl4alFVRlhMRlZCUVZVc1MwRkJTeXhUUVVGVkxGZEJRVmM3UVVGRE0wTXNWMEZCVHl4SlFVRkpMRXRCUVVzc1IwRkJSeXhaUVVGWkxFdEJRVXNzUzBGQlN5eFBRVUZQTEZkQlFWYzdRVUZCUVR0QlFVVXZSQ3hqUVVGWExGVkJRVlVzVlVGQlZTeFhRVUZaTzBGQlEzWkRMRk5CUVVzc1MwRkJTeXhOUVVGUExFdEJRVXNzUzBGQlN5eFJRVUZSTEZOQlFWTXNVMEZCVXp0QlFVTnlSQ3hSUVVGSkxFdEJRVXM3UVVGRFRDeFhRVUZMTEcxQ1FVRnRRaXhMUVVGTExFdEJRVXM3UVVGRGRFTXNWMEZCVHp0QlFVRkJPMEZCUlZnc1kwRkJWeXhWUVVGVkxFOUJRVThzVjBGQldUdEJRVU53UXl4WFFVRlBMRXRCUVVzN1FVRkJRVHRCUVVWb1FpeGpRVUZYTEZWQlFWVXNWVUZCVlN4VFFVRlZMRWxCUVVrN1FVRkRla01zVVVGQlNTeE5RVUZOTEV0QlFVczdRVUZEWml4UlFVRkpMRmRCUVZjc1EwRkJReXhKUVVGSk8wRkJRM0JDTEZkQlFVOHNTMEZCU3l4TFFVRkxMRk5CUVZVc1MwRkJTeXhSUVVGUk8wRkJRVVVzVTBGQlJ5eFBRVUZQTEV0QlFVczdRVUZCUVR0QlFVRkJPMEZCUlRkRUxHTkJRVmNzVlVGQlZTeG5Ra0ZCWjBJc1UwRkJWU3hKUVVGSk8wRkJReTlETEZOQlFVc3NTMEZCU3l4VFFVRlRPMEZCUTI1Q0xGZEJRVThzUzBGQlN5eFJRVUZSTzBGQlFVRTdRVUZGZUVJc1kwRkJWeXhWUVVGVkxHbENRVUZwUWl4VFFVRlZMRWxCUVVrN1FVRkRhRVFzVVVGQlNTeE5RVUZOTEV0QlFVczdRVUZEWml4UlFVRkpMRmRCUVZjc1EwRkJReXhKUVVGSk8wRkJRM0JDTEZkQlFVOHNTMEZCU3l4TFFVRkxMRk5CUVZVc1MwRkJTeXhSUVVGUk8wRkJRVVVzVTBGQlJ5eFBRVUZQTEZsQlFWazdRVUZCUVR0QlFVRkJPMEZCUlhCRkxHTkJRVmNzVlVGQlZTeFBRVUZQTEZOQlFWVXNTVUZCU1R0QlFVTjBReXhSUVVGSkxFMUJRVTBzUzBGQlN6dEJRVU5tTEZGQlFVa3NWMEZCVnl4RFFVRkRMRWxCUVVrN1FVRkRjRUlzVVVGQlNTeEpRVUZKTzBGQlExSXNWMEZCVHl4TFFVRkxMRXRCUVVzc1UwRkJWU3hOUVVGTkxGRkJRVkU3UVVGRGNrTXNVVUZCUlN4TFFVRkxMRTlCUVU4N1FVRkJRU3hQUVVObUxFdEJRVXNzVjBGQldUdEJRVU5vUWl4aFFVRlBPMEZCUVVFc1QwRkRVaXhMUVVGTE8wRkJRVUU3UVVGRldpeGpRVUZYTEZWQlFWVXNZMEZCWXl4VFFVRlZMRWxCUVVrN1FVRkROME1zVVVGQlNTeE5RVUZOTEV0QlFVczdRVUZEWml4UlFVRkpMRWxCUVVrc1VVRkJVU3hWUVVGVkxHZENRVUZuUWl4TFFVRkxMRk5CUVZNc1NVRkJTU3hSUVVGUkxFZEJRVWM3UVVGRGJrVXNZVUZCVHl4TFFVRkxMRTFCUVUwc1UwRkJWU3hQUVVGUE8wRkJReTlDTEZsQlFVa3NVVUZCVVN4blFrRkJaMElzUzBGQlN5eEpRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm9SQ3hsUVVGUExFbEJRVWtzVFVGQlRTeExRVUZMTEUxQlFVMDdRVUZCUVN4VlFVTjRRanRCUVVGQkxGVkJRMEVzVVVGQlVUdEJRVUZCTEZWQlExSXNUMEZCVHl4SlFVRkpPMEZCUVVFc1ZVRkRXQ3hQUVVGUE8wRkJRVUVzV1VGRFNEdEJRVUZCTEZsQlEwRXNUMEZCVHl4SlFVRkpPMEZCUVVFN1FVRkJRVHRCUVVGQkxGTkJSM0JDTEV0QlFVc3NVMEZCVlN4TFFVRkpPMEZCUTJ4Q0xGbEJRVWtzVTBGQlV5eEpRVUZITzBGQlEyaENMR1ZCUVU4N1FVRkJRU3hUUVVOU0xFdEJRVXM3UVVGQlFUdEJRVVZhTEZGQlFVa3NWMEZCVnl4RFFVRkRMRWxCUVVrN1FVRkRjRUlzVVVGQlNTeEpRVUZKTzBGQlExSXNWMEZCVHl4TFFVRkxMRXRCUVVzc1UwRkJWU3hOUVVGTkxGRkJRVkU3UVVGRGNrTXNVVUZCUlN4TFFVRkxMRTlCUVU4N1FVRkJRU3hQUVVObUxFdEJRVXNzVjBGQldUdEJRVU5vUWl4aFFVRlBPMEZCUVVFc1QwRkRVaXhMUVVGTE8wRkJRVUU3UVVGRldpeGpRVUZYTEZWQlFWVXNZVUZCWVN4VFFVRlZMRWxCUVVrN1FVRkROVU1zVTBGQlN5eExRVUZMTEZOQlFWTTdRVUZEYmtJc1YwRkJUeXhMUVVGTExFdEJRVXM3UVVGQlFUdEJRVVZ5UWl4alFVRlhMRlZCUVZVc1YwRkJWeXhUUVVGVkxFbEJRVWs3UVVGRE1VTXNWMEZCVHl4TFFVRkxMRTFCUVUwc1IwRkJSeXhMUVVGTExGTkJRVlVzUjBGQlJ6dEJRVUZGTEdGQlFVOHNSVUZCUlR0QlFVRkJMRTlCUVU4c1MwRkJTenRCUVVGQk8wRkJSV3hGTEdOQlFWY3NWVUZCVlN4VlFVRlZMRk5CUVZVc1NVRkJTVHRCUVVONlF5eFhRVUZQTEV0QlFVc3NWVUZCVlN4VFFVRlRPMEZCUVVFN1FVRkZia01zWTBGQlZ5eFZRVUZWTEZkQlFWY3NWMEZCV1R0QlFVTjRReXhSUVVGSkxFMUJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVMHNTVUZCU1N4VFFVRlRMRWxCUVVrc1RVRkJUU3hQUVVGUExGVkJRVlVzU1VGQlNUdEJRVU4yUlN4UlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWs3UVVGRFlpeGhRVUZQTzBGQlExZ3NVVUZCU1N4TlFVRk5PMEZCUTFZc1kwRkJWU3hMUVVGTExFMUJRVTBzVTBGQlZTeFJRVUZSTzBGQlEyNURMRlZCUVVrc1UwRkJVeXhQUVVGUExGZEJRVmM3UVVGREwwSXNWVUZCU1N4UlFVRlJMRTlCUVU4c1MwRkJTenRCUVVONFFpeFZRVUZKTEZWQlFWVTdRVUZEWkN4aFFVRlBMRU5CUVVNN1FVRkJRVHRCUVVWYUxGZEJRVTg3UVVGQlFUdEJRVVZZTEdOQlFWY3NWVUZCVlN4VFFVRlRMRk5CUVZVc1UwRkJVenRCUVVNM1F5eFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRTFCUVUwc1MwRkJTenRCUVVObUxGZEJRVThzUzBGQlN5eFBRVUZQTEZOQlFWVXNUMEZCVHp0QlFVTm9ReXhWUVVGSk8wRkJRMG9zVlVGQlNTeFBRVUZQTEZsQlFWa3NXVUZCV1R0QlFVTXZRaXh0UWtGQlZ6dEJRVUZCTEdGQlJWWTdRVUZEUkN4WlFVRkpMRmRCUVZjc1MwRkJTenRCUVVOd1FpeFpRVUZKTEZWQlFWVXNVMEZCVXp0QlFVTjJRaXh0UWtGQlZ5eFRRVUZWTEUxQlFVMDdRVUZEZGtJc1kwRkJTU3h0UWtGQmJVSTdRVUZEZGtJc2JVSkJRVk1zU1VGQlNTeEhRVUZITEVsQlFVa3NVMEZCVXl4RlFVRkZMRWRCUVVjN1FVRkRPVUlzWjBKQlFVa3NWVUZCVlN4VFFVRlRMRWxCUVVrc1RVRkJUU3hSUVVGUk8wRkJRM3BETEdkQ1FVRkpMR0ZCUVdFc1RVRkJUU3hoUVVGaExFdEJRVXM3UVVGRGNrTXNNa0pCUVdFc1RVRkJUU3hUUVVGVE8wRkJRelZDTEdsRFFVRnRRanRCUVVGQk8wRkJRVUU3UVVGSE0wSXNhVUpCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMllzVlVGQlNTeFpRVUZaTEVsQlFVa3NUVUZCVFR0QlFVTXhRaXhWUVVGSkxFMUJRVXNzVlVGQlZTeFBRVUZQTEZsQlFWa3NWMEZCVnl4SlFVRkhMRlZCUVZVc1lVRkJZU3hKUVVGSE8wRkJRemxGTEZWQlFVa3NVVUZCVVN4TlFVRk5MRWRCUVVjc1UwRkJVeXh0UWtGQmJVSTdRVUZEYWtRc1ZVRkJTU3hQUVVGTkxFMUJRVTBzUjBGQlJ5eExRVUZMTzBGQlEzaENMRlZCUVVrc1owSkJRV2RDTzBGQlEzQkNMRlZCUVVrc1pVRkJaVHRCUVVOdVFpeFZRVUZKTEdGQlFXRTdRVUZEYWtJc1ZVRkJTU3h2UWtGQmIwSXNVMEZCVlN4bFFVRmxMRXRCUVVzN1FVRkRiRVFzV1VGQlNTeFhRVUZYTEVsQlFVa3NWVUZCVlN4alFVRmpMRWxCUVVrN1FVRkRMME1zZDBKQlFXZENMR2RDUVVGblFqdEJRVU5vUXl4cFFrRkJVeXhMUVVGTExFZEJRVWNzVFVGQlN5eExRVUZMTEZkQlFWY3NTMEZCU3l4SlFVRkhMRkZCUVZFc1RVRkJUVHRCUVVONFJDeGpRVUZKTEUxQlFVMHNTVUZCUnp0QlFVTmlMSGRDUVVGakxFdEJRVXNzVTBGQlV6dEJRVUZCTzBGQlFVRTdRVUZIY0VNc1lVRkJUeXhOUVVGTkxGRkJRVkVzWTBGQll5eExRVUZMTEZOQlFWVXNUMEZCVFR0QlFVTndSQ3haUVVGSkxGbEJRVmtzVTBGQlZTeFJRVUZSTzBGQlF6bENMR05CUVVrc1VVRkJVU3hMUVVGTExFbEJRVWtzVDBGQlR5eE5RVUZMTEZOQlFWTTdRVUZETVVNc2FVSkJRVThzVlVGQlZTeFJRVUZSTzBGQlFVRXNXVUZEY2tJN1FVRkJRU3haUVVOQkxFMUJRVTBzVFVGQlN5eE5RVUZOTEZGQlFWRXNVMEZCVXp0QlFVRkJMRmxCUTJ4RExFOUJRVTg3UVVGQlFTeGhRVU5TTEV0QlFVc3NVMEZCVlN4UlFVRlJPMEZCUTNSQ0xHZENRVUZKTEZsQlFWazdRVUZEYUVJc1owSkJRVWtzV1VGQldUdEJRVU5vUWl4blFrRkJTU3hWUVVGVkxGZEJRVmNzUzBGQlN6dEJRVU01UWl4blFrRkJTU3hoUVVGaE8wRkJRMnBDTEhGQ1FVRlRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFOUJRVThzUlVGQlJTeEhRVUZITzBGQlF6VkNMR3RDUVVGSkxGbEJRVmtzVDBGQlR6dEJRVU4yUWl4clFrRkJTU3hSUVVGUk8wRkJRVUVzWjBKQlExSXNUMEZCVHl4VlFVRlZPMEZCUVVFc1owSkJRMnBDTEZOQlFWTXNUVUZCU3l4VFFVRlRPMEZCUVVFN1FVRkZNMElzYTBKQlFVa3NVMEZCVXl4TFFVRkxMRTlCUVU4c1RVRkJUU3hQUVVGUExGZEJRVmNzVDBGQlR6dEJRVU53UkN4dlFrRkJTU3hOUVVGTkxGTkJRVk1zVFVGQlRUdEJRVU55UWl3MlFrRkJWeXhMUVVGTExFMUJRVXNzVTBGQlV6dEJRVUZCTERKQ1FVVjZRaXhEUVVGRExGbEJRVmtzUzBGQlNTeFhRVUZYTEZsQlFWa3NWMEZCVnl4TlFVRk5MRmxCUVZrc1IwRkJSenRCUVVNM1JTdzJRa0ZCVnl4TFFVRkxMRTFCUVVzc1UwRkJVenRCUVVNNVFpdzBRa0ZCVlN4TFFVRkxMRTFCUVUwN1FVRkJRU3gxUWtGRmNFSTdRVUZEUkN3MFFrRkJWU3hMUVVGTExFMUJRVTA3UVVGRGNrSXNjMEpCUVVrN1FVRkRRU3cwUWtGQlVTeExRVUZMTEUxQlFVc3NVMEZCVXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVrelF5eHRRa0ZCVHl4UlFVRlJMRkZCUVZFc1ZVRkJWU3hUUVVGVExFdEJRM1JETEZWQlFWVXNUMEZCVHl4RFFVRkZMRTlCUVdNc1RVRkJUU3hQUVVGUExGRkJRVkVzV1VGRGFrUXNTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkRja0lzZFVKQlFWTXNUMEZCVHl4SlFVRkpMRlZCUVZVN1FVRkRNVUlzTWtKQlFWY3NUMEZCVHl4VFFVRlRMRTFCUVUwN1FVRkJRVHRCUVVWeVF5eG5RMEZCYTBJc1ZVRkJWU3hSUVVGUk8wRkJRVUVzWjBKQlEzQkRMRXRCUVVzc1YwRkJXVHRCUVVGRkxIRkNRVUZQTEZWQlFWVXNVMEZCVXl4TFFVTnFSQ3hWUVVGVkxFOUJRVThzUTBGQlJTeFBRVUZqTEUxQlFVMHNUMEZCVHl4TlFVRk5MRk5CUVZNc1VVRkJVU3haUVVOb1JTeExRVUZMTEZOQlFWVXNTMEZCU3p0QlFVRkZMSFZDUVVGUExHdENRVUZyUWl4VlFVRlZMRkZCUVZFN1FVRkJRVHRCUVVGQkxHVkJRV0VzUzBGQlN5eFhRVUZaTzBGQlFVVXNjVUpCUVU4c1YwRkJWeXhUUVVGVExFdEJRMnBKTEZWQlFWVXNUMEZCVHl4RFFVRkZMRTlCUVdNc1RVRkJUU3hWUVVGVkxFMUJRVTBzWVVGRGJFUXNTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkJSU3gxUWtGQlR5eHJRa0ZCYTBJc1YwRkJWeXhSUVVGUk8wRkJRVUU3UVVGQlFTeGxRVUZoTEV0QlFVc3NWMEZCV1R0QlFVTnlSeXh4UWtGQlR5eE5RVUZMTEZOQlFWTXNVMEZCVXl4VFFVRlRMRlZCUVZVc1UwRkJVenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWwwUlN4bFFVRlBMRlZCUVZVc1IwRkJSeXhMUVVGTExGZEJRVms3UVVGRGFrTXNZMEZCU1N4alFVRmpMRk5CUVZNN1FVRkRka0lzYTBKQlFVMHNTVUZCU1N4WlFVRlpMSFZEUVVGMVF5eGxRVUZsTEdOQlFXTTdRVUZET1VZc2FVSkJRVThzVFVGQlN6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU3pWQ0xHTkJRVmNzVlVGQlZTeFRRVUZUTEZkQlFWazdRVUZEZEVNc1VVRkJTU3hOUVVGTkxFdEJRVXNzVFVGQlRTeFJRVUZSTEVsQlFVazdRVUZEYWtNc1VVRkJTU3huUWtGQlowSXNVVUZEWkN4TFFVRkpMR0ZCUVdFc1EwRkJReXc0UWtGQkswSXNUVUZCVFN4VFFVRlRMRWxCUTNKRk8wRkJRMGNzWVVGQlR5eExRVUZMTEU5QlFVOHNVMEZCVlN4UFFVRlBPMEZCUTJoRExGbEJRVWtzWVVGQllTeEpRVUZKTEUxQlFVMHNTMEZCU3l4UFFVRlBPMEZCUTNaRExGbEJRVWtzV1VGQldUdEJRVU5vUWl4bFFVRlBMRWxCUVVrc1RVRkJUU3hMUVVGTExFMUJRVTBzUTBGQlJTeFBRVUZqTEU5QlFVOHNRMEZCUlN4UFFVRlBMRmxCUVZrc1QwRkJUeXhoUVVGbExFdEJRVXNzVTBGQlZTeFBRVUZQTzBGQlEyaElMR2xDUVVGUExFbEJRVWtzVFVGQlRTeExRVUZMTEU5QlFVOHNRMEZCUlN4UFFVRmpMRTFCUVUwc1pVRkJaU3hQUVVGUExGbEJRM0JGTEV0QlFVc3NVMEZCVlN4TFFVRkpPMEZCUTNCQ0xHZENRVUZKTEZkQlFWY3NTVUZCUnp0QlFVRlZMR2RDUVVGSE8wRkJRVmtzWjBKQlFVYzdRVUZCVXl4blFrRkJTU3hqUVVGakxFbEJRVWM3UVVGRE5VVXNaMEpCUVVrN1FVRkRRU3h2UWtGQlRTeEpRVUZKTEZsQlFWa3NaME5CUVdkRExFOUJRVThzUzBGQlN5eFZRVUZWTEVsQlFVa3NVMEZCVlN4TFFVRkxPMEZCUVVVc2RVSkJRVThzVTBGQlV6dEJRVUZCTEd0Q1FVRlZMRkZCUVZFN1FVRkRka2tzYlVKQlFVOHNVVUZCVVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTeTlDTEZkQlFVOHNTMEZCU3l4UFFVRlBMRk5CUVZVc1QwRkJUeXhOUVVGTE8wRkJRVVVzWVVGQlR5eExRVUZKTEZGQlFWRTdRVUZCUVR0QlFVRkJPMEZCUld4RkxGTkJRVTg3UVVGQlFUdEJRVWRZTEhGRFFVRnhReXhKUVVGSk8wRkJRM0pETEZOQlFVOHNjVUpCUVhGQ0xGZEJRVmNzVjBGQlZ5eHhRa0ZCYjBJc1lVRkJZU3h0UWtGQmJVSTdRVUZEYkVjc1UwRkJTeXhMUVVGTE8wRkJRMVlzVVVGQlNTeFhRVUZYTEZWQlFWVXNVVUZCVVR0QlFVTnFReXhSUVVGSk8wRkJRMEVzVlVGQlNUdEJRVU5CTEcxQ1FVRlhPMEZCUVVFc1pVRkZVaXhKUVVGUU8wRkJRMGtzWjBKQlFWRTdRVUZCUVR0QlFVVm9RaXhSUVVGSkxGZEJRVmNzV1VGQldUdEJRVU16UWl4UlFVRkpMRkZCUVZFc1UwRkJVenRCUVVOeVFpeFJRVUZKTEdOQlFXTXNUVUZCVFN4TFFVRkxMRkZCUVZFN1FVRkRja01zVTBGQlN5eFBRVUZQTzBGQlFVRXNUVUZEVWp0QlFVRkJMRTFCUTBFc1QwRkJUeXhUUVVGVE8wRkJRVUVzVFVGRGFFSXNWMEZCV1N4RFFVRkRMRk5CUVZNc1UwRkJWU3hOUVVGTkxFOUJRVThzVVVGQlVTeFhRVUZYTEZOQlFWTXNWVUZCVlN4TlFVRk5MRTlCUVU4c1VVRkJVVHRCUVVGQkxFMUJRM2hITEU5QlFVODdRVUZCUVN4TlFVTlFMRlZCUVZVN1FVRkJRU3hOUVVOV0xFdEJRVXM3UVVGQlFTeE5RVU5NTEZGQlFWRTdRVUZCUVN4TlFVTlNMRmRCUVZjN1FVRkJRU3hOUVVOWUxGRkJRVkU3UVVGQlFTeE5RVU5TTEdOQlFXTTdRVUZCUVN4TlFVTmtMRmRCUVZjN1FVRkJRU3hOUVVOWUxGTkJRVk03UVVGQlFTeE5RVU5VTEZGQlFWRTdRVUZCUVN4TlFVTlNMRTlCUVU4N1FVRkJRU3hOUVVOUU8wRkJRVUVzVFVGRFFTeEpRVUZKTEZOQlFWTTdRVUZCUVN4TlFVTmlMR0ZCUVdFc1owSkJRV2RDTEZOQlFWTXNZMEZCWXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0b1JTeDFRa0ZCZFVJc1IwRkJSeXhIUVVGSE8wRkJRM3BDTEZOQlFVOHNTVUZCU1N4SlFVRkpMRXRCUVVzc1RVRkJUU3hKUVVGSkxFbEJRVWs3UVVGQlFUdEJRVVYwUXl3NFFrRkJPRUlzUjBGQlJ5eEhRVUZITzBGQlEyaERMRk5CUVU4c1NVRkJTU3hKUVVGSkxFdEJRVXNzVFVGQlRTeEpRVUZKTEVsQlFVazdRVUZCUVR0QlFVZDBReXhqUVVGakxIbENRVUY1UWl4TFFVRkxMRWRCUVVjN1FVRkRNME1zVFVGQlNTeGhRVUZoTEcxRFFVRnRReXhqUVVOb1JDeEpRVUZKTEhkQ1FVRjNRaXhYUVVGWExESkNRVU4yUXp0QlFVTktMR0ZCUVZjc1MwRkJTeXhSUVVGUkxFbEJRVWtzU1VGQlNTeEZRVUZGTEU5QlFVOHNTVUZCU1N4VlFVRlZPMEZCUTNaRUxGTkJRVTg3UVVGQlFUdEJRVVZZTEhsQ1FVRjVRaXhoUVVGaE8wRkJRMnhETEZOQlFVOHNTVUZCU1N4WlFVRlpMRmRCUVZjc1lVRkJZU3hYUVVGWk8wRkJRVVVzVjBGQlR5eFhRVUZYTzBGQlFVRXNTMEZCVVN4TlFVRk5PMEZCUVVFN1FVRkZha2NzYzBKQlFYTkNMRXRCUVVzN1FVRkRka0lzVTBGQlR5eFJRVUZSTEZOQlExZ3NVMEZCVlN4SFFVRkhPMEZCUVVVc1YwRkJUeXhGUVVGRk8wRkJRVUVzVFVGRGVFSXNVMEZCVlN4SFFVRkhPMEZCUVVVc1YwRkJUeXhGUVVGRk8wRkJRVUU3UVVGQlFUdEJRVVZvUXl4elFrRkJjMElzUzBGQlN6dEJRVU4yUWl4VFFVRlBMRkZCUVZFc1UwRkRXQ3hUUVVGVkxFZEJRVWM3UVVGQlJTeFhRVUZQTEVWQlFVVTdRVUZCUVN4TlFVTjRRaXhUUVVGVkxFZEJRVWM3UVVGQlJTeFhRVUZQTEVWQlFVVTdRVUZCUVR0QlFVRkJPMEZCUldoRExHOUNRVUZ2UWl4TFFVRkxMRlZCUVZVc1lVRkJZU3hoUVVGaExFMUJRVXNzUzBGQlN6dEJRVU51UlN4TlFVRkpMRk5CUVZNc1MwRkJTeXhKUVVGSkxFbEJRVWtzVVVGQlVTeFpRVUZaTzBGQlF6bERMRTFCUVVrc1RVRkJUVHRCUVVOV0xGZEJRVk1zU1VGQlNTeEhRVUZITEVsQlFVa3NVVUZCVVN4RlFVRkZMRWRCUVVjN1FVRkROMElzVVVGQlNTeGhRVUZoTEZOQlFWTTdRVUZETVVJc1VVRkJTU3hsUVVGbExGbEJRVmtzU1VGQlNUdEJRVU12UWl4VlFVRkpMRXRCUVVrc1NVRkJTU3hKUVVGSkxGbEJRVmtzVFVGQlRUdEJRVU01UWl4bFFVRlBMRWxCUVVrc1QwRkJUeXhIUVVGSExFdEJRVXNzV1VGQldTeExRVUZMTEZsQlFWa3NUMEZCVHl4SlFVRkpPMEZCUTNSRkxGVkJRVWtzUzBGQlNTeEpRVUZKTEVsQlFVa3NXVUZCV1N4TlFVRk5PMEZCUXpsQ0xHVkJRVThzU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4WlFVRlpMRXRCUVVzc1dVRkJXU3hQUVVGUExFbEJRVWs3UVVGRGRFVXNWVUZCU1N4UFFVRlBPMEZCUTFBc1pVRkJUeXhKUVVGSkxFOUJRVThzUjBGQlJ5eFBRVUZQTEZOQlFWTXNUMEZCVHl4WlFVRlpMRTlCUVU4c1RVRkJUVHRCUVVONlJTeGhRVUZQTzBGQlFVRTdRVUZGV0N4UlFVRkpMRXRCUVVrc1NVRkJTU3hKUVVGSkxHTkJRV003UVVGRE1VSXNXVUZCVFR0QlFVRkJPMEZCUldRc1RVRkJTU3hUUVVGVExGbEJRVmtzVlVGQlZTeFJRVUZSTzBGQlEzWkRMRmRCUVU4c1RVRkJUU3haUVVGWkxFOUJRVThzU1VGQlNUdEJRVU40UXl4TlFVRkpMRk5CUVZNc1NVRkJTU3hWUVVGVkxGRkJRVkU3UVVGREwwSXNWMEZCVHl4SlFVRkpMRTlCUVU4c1IwRkJSeXhaUVVGWk8wRkJRM0pETEZOQlFWRXNUVUZCVFN4SlFVRkpMRTlCUVU4c1NVRkJTU3hQUVVGUExFZEJRVWNzVDBGQlR5eFpRVUZaTEU5QlFVOHNXVUZCV1N4UFFVRlBMRTFCUVUwN1FVRkJRVHRCUVVVNVJpeG5RMEZCWjBNc1lVRkJZU3hQUVVGUExGTkJRVk1zVVVGQlVUdEJRVU5xUlN4TlFVRkpMRTlCUVU4c1QwRkJUeXhUUVVGVExHTkJRV01zWTBGQll5eFhRVUZYTEdWQlFXVXNZVUZCWVN4UlFVRlJPMEZCUTNSSExFMUJRVWtzUTBGQlF5eFJRVUZSTEUxQlFVMHNVMEZCVlN4SFFVRkhPMEZCUVVVc1YwRkJUeXhQUVVGUExFMUJRVTA3UVVGQlFTeE5RVUZqTzBGQlEyaEZMRmRCUVU4c1MwRkJTeXhoUVVGaE8wRkJRVUU3UVVGRk4wSXNlVUpCUVhWQ0xFdEJRVXM3UVVGRGVFSXNXVUZCVVN4aFFVRmhPMEZCUTNKQ0xGbEJRVkVzWVVGQllUdEJRVU55UWl4alFVRlhMRkZCUVZFc1UwRkJVeXhuUWtGQlowSTdRVUZETlVNc1VVRkJTU3hsUVVGbExGRkJRVkVzU1VGQlNTeFRRVUZWTEZGQlFWRTdRVUZETjBNc1lVRkJUeXhEUVVGRkxFOUJRVThzVFVGQlRTeFRRVUZUTEU5QlFVOHNUVUZCVFR0QlFVRkJMRTlCUXpkRExFdEJRVXNzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZEY0VJc1lVRkJUeXhSUVVGUkxFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlFVRTdRVUZGT1VJc2JVSkJRV1VzWVVGQllTeEpRVUZKTEZOQlFWVXNTVUZCU1R0QlFVRkZMR0ZCUVU4c1IwRkJSenRCUVVGQk8wRkJRekZFTEcxQ1FVRmxMR0ZCUVdFc1NVRkJTU3hUUVVGVkxFbEJRVWs3UVVGQlJTeGhRVUZQTEVkQlFVYzdRVUZCUVR0QlFVTXhSQ3huUWtGQldUdEJRVU5hTEc5Q1FVRnBRaXhSUVVGUkxGTkJRVk1zUzBGQlN6dEJRVUZCTzBGQlJUTkRMR2RDUVVGak8wRkJRMlFzVFVGQlNTeEpRVUZKTEVsQlFVa3NXVUZCV1N4WFFVRlhMR0ZCUVdFc1YwRkJXVHRCUVVGRkxGZEJRVThzV1VGQldTeGhRVUZoTEVsQlFVa3NZVUZCWVN4aFFVRmhMRXRCUVVzN1FVRkJRVHRCUVVOcVNTeEpRVUZGTEhGQ1FVRnhRaXhUUVVGVkxGbEJRVmM3UVVGRGVFTXNhMEpCUVdNN1FVRkJRVHRCUVVWc1FpeE5RVUZKTEhOQ1FVRnpRanRCUVVNeFFpeEpRVUZGTEdOQlFXTXNVMEZCVlN4UlFVRlJMRk5CUVZNc1UwRkJVenRCUVVOb1JDeFJRVUZKTEUxQlFVMHNUMEZCVHp0QlFVTnFRaXhSUVVGSkxFOUJRVThzVVVGQlVUdEJRVU5tTEdGQlFVODdRVUZEV0N4UlFVRkpMRmRCUVZjc1RVRkJUVHRCUVVOeVFpeFJRVUZKTEUxQlFVMHNWVUZCVlN4alFVRmpMSE5DUVVGelFqdEJRVU53UkN4aFFVRlBPMEZCUVVFc1YwRkZUanRCUVVORUxGVkJRVWtzZFVKQlFYVkNPMEZCUXpOQ0xHVkJRVk1zU1VGQlNTeHhRa0ZCY1VJc1NVRkJTU3haUVVGWkxFVkJRVVVzUjBGQlJ6dEJRVU51UkN4WlFVRkpMRk5CUVZNc1YwRkJWeXhMUVVGTExGVkJRVlVzWVVGQllTeEpRVUZKTEdGQlFXRXNTVUZCU1N4VFFVRlRPMEZCUTJ4R0xGbEJRVWtzVjBGQlZ5eFJRVUZSTEhsQ1FVRjVRanRCUVVNMVF5eG5RMEZCYzBJc1NVRkJTVHRCUVVGQkxHbENRVU55UWl4NVFrRkJlVUlzVVVGQlVTeFJRVUZSTEhOQ1FVRnpRaXhWUVVGVkxFZEJRVWM3UVVGRGFrWXNhVU5CUVhWQ08wRkJRVUU3UVVGQlFUdEJRVWN2UWl4VlFVRkpMSGxDUVVGNVFpeE5RVUZOTzBGQlF5OUNMR2RDUVVGUkxGZEJRVms3UVVGQlJTeHBRa0ZCVHl4VFFVRlRMSFZDUVVGMVFqdEJRVUZCTzBGQlFVRXNZVUZGTlVRN1FVRkRSQ3huUWtGQlVUdEJRVUZCTzBGQlJWb3NZVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhUUVVGUE8wRkJRVUU3UVVGRldDeHhRa0ZCY1VJc1QwRkJUeXhQUVVGUExGZEJRVmNzVjBGQlZ6dEJRVU55UkN4VFFVRlBPMEZCUVVFc1NVRkRTQ3hOUVVGTk8wRkJRVUVzU1VGRFRqdEJRVUZCTEVsQlEwRTdRVUZCUVN4SlFVTkJPMEZCUVVFc1NVRkRRVHRCUVVGQk8wRkJRVUU3UVVGSFVpeHZRa0ZCYjBJc1QwRkJUenRCUVVOMlFpeFRRVUZQTzBGQlFVRXNTVUZEU0N4TlFVRk5PMEZCUVVFc1NVRkRUaXhQUVVGUE8wRkJRVUVzU1VGRFVDeFBRVUZQTzBGQlFVRTdRVUZCUVR0QlFVbG1MRWxCUVVrc1kwRkJaMElzVjBGQldUdEJRVU0xUWl3d1FrRkJkVUk3UVVGQlFUdEJRVVYyUWl4VFFVRlBMR1ZCUVdVc1lVRkJXU3hYUVVGWExHTkJRV003UVVGQlFTeEpRVU4yUkN4TFFVRkxMRmRCUVZrN1FVRkRZaXhoUVVGUExFdEJRVXNzUzBGQlN5eE5RVUZOTEVkQlFVYzdRVUZCUVR0QlFVRkJMRWxCUlRsQ0xGbEJRVms3UVVGQlFTeEpRVU5hTEdOQlFXTTdRVUZCUVR0QlFVVnNRaXhsUVVGWkxGVkJRVlVzVlVGQlZTeFRRVUZWTEU5QlFVOHNUMEZCVHl4alFVRmpMR05CUVdNN1FVRkRhRVlzYlVKQlFXVXNhVUpCUVdsQ08wRkJRMmhETEcxQ1FVRmxMR2xDUVVGcFFqdEJRVU5vUXl4UlFVRkpPMEZCUTBFc1ZVRkJTeXhMUVVGTExFdEJRVXNzVDBGQlR5eFRRVUZUTEV0QlF6RkNMRXRCUVVzc1MwRkJTeXhQUVVGUExGZEJRVmNzUzBGQlRTeHBRa0ZCWjBJc2FVSkJRV2xDTEVOQlFVVXNhVUpCUVdkQ08wRkJRM1JHTEdWQlFVOHNaMEpCUVdkQ08wRkJRek5DTEdGQlFVOHNTVUZCU1N4TFFVRkxMRmRCUVZjc1RVRkJUU3hYUVVGWk8wRkJRVVVzWlVGQlR5eFpRVUZaTEU5QlFVOHNUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJRenRCUVVGQk8wRkJRVUVzWVVGRk4wWXNSMEZCVUR0QlFVTkpMR0ZCUVU4c1MwRkJTeXhOUVVGTk8wRkJRVUU3UVVGQlFUdEJRVWN4UWl4bFFVRlpMRlZCUVZVc1UwRkJVeXhUUVVGVkxFOUJRVTg3UVVGRE5VTXNVVUZCU1N4VFFVRlRPMEZCUTFRc1lVRkJUeXhMUVVGTExFMUJRVTA3UVVGRGRFSXNWMEZCVHl4SlFVRkpMRXRCUVVzc1YwRkJWeXhOUVVGTkxGZEJRVms3UVVGQlJTeGhRVUZQTEZkQlFWYzdRVUZCUVR0QlFVRkJPMEZCUlhKRkxHVkJRVmtzVlVGQlZTeFJRVUZSTEZOQlFWVXNUMEZCVHp0QlFVTXpReXhSUVVGSkxGTkJRVk03UVVGRFZDeGhRVUZQTEV0QlFVc3NUVUZCVFR0QlFVTjBRaXhYUVVGUExFbEJRVWtzUzBGQlN5eFhRVUZYTEUxQlFVMHNWMEZCV1R0QlFVRkZMR0ZCUVU4c1dVRkJXU3hQUVVGUExGRkJRVmM3UVVGQlFUdEJRVUZCTzBGQlJYaEdMR1ZCUVZrc1ZVRkJWU3hsUVVGbExGTkJRVlVzVDBGQlR6dEJRVU5zUkN4UlFVRkpMRk5CUVZNN1FVRkRWQ3hoUVVGUExFdEJRVXNzVFVGQlRUdEJRVU4wUWl4WFFVRlBMRWxCUVVrc1MwRkJTeXhYUVVGWExFMUJRVTBzVjBGQldUdEJRVUZGTEdGQlFVOHNXVUZCV1N4UFFVRlBMRkZCUVZjN1FVRkJRVHRCUVVGQk8wRkJSWGhHTEdWQlFWa3NWVUZCVlN4UlFVRlJMRk5CUVZVc1QwRkJUenRCUVVNelF5eFJRVUZKTEZOQlFWTTdRVUZEVkN4aFFVRlBMRXRCUVVzc1RVRkJUVHRCUVVOMFFpeFhRVUZQTEVsQlFVa3NTMEZCU3l4WFFVRlhMRTFCUVUwc1YwRkJXVHRCUVVGRkxHRkJRVThzV1VGQldTeFJRVUZYTEU5QlFVOHNUMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkZMMFlzWlVGQldTeFZRVUZWTEdWQlFXVXNVMEZCVlN4UFFVRlBPMEZCUTJ4RUxGRkJRVWtzVTBGQlV6dEJRVU5VTEdGQlFVOHNTMEZCU3l4TlFVRk5PMEZCUTNSQ0xGZEJRVThzU1VGQlNTeExRVUZMTEZkQlFWY3NUVUZCVFN4WFFVRlpPMEZCUVVVc1lVRkJUeXhaUVVGWkxGRkJRVmM3UVVGQlFUdEJRVUZCTzBGQlJXcEdMR1ZCUVZrc1ZVRkJWU3hoUVVGaExGTkJRVlVzUzBGQlN6dEJRVU01UXl4UlFVRkpMRTlCUVU4c1VVRkJVVHRCUVVObUxHRkJRVThzUzBGQlN5eE5RVUZOTzBGQlEzUkNMRmRCUVU4c1MwRkJTeXhSUVVGUkxFdEJRVXNzVFVGQlRTeFhRVUZYTEUxQlFVMDdRVUZCUVR0QlFVVndSQ3hsUVVGWkxGVkJRVlVzZFVKQlFYVkNMRk5CUVZVc1MwRkJTenRCUVVONFJDeFJRVUZKTEZGQlFWRTdRVUZEVWl4aFFVRlBMRXRCUVVzc1YwRkJWenRCUVVNelFpeFhRVUZQTEhWQ1FVRjFRaXhOUVVGTkxGTkJRVlVzUjBGQlJ5eEhRVUZITzBGQlFVVXNZVUZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSU3hSUVVGUk8wRkJRVUVzVDBGQlRTeERRVUZETEUxQlFVMDdRVUZCUVR0QlFVVnNSeXhsUVVGWkxGVkJRVlVzYlVKQlFXMUNMRk5CUVZVc1MwRkJTenRCUVVOd1JDeFhRVUZQTEhWQ1FVRjFRaXhOUVVGTkxGTkJRVlVzUjBGQlJ5eEhRVUZITzBGQlFVVXNZVUZCVHl4TlFVRk5MRVZCUVVVN1FVRkJRU3hQUVVGUExFTkJRVU1zVFVGQlRUdEJRVUZCTzBGQlJYWkdMR1ZCUVZrc1ZVRkJWU3hyUWtGQmEwSXNWMEZCV1R0QlFVTm9SQ3hSUVVGSkxFMUJRVTBzVjBGQlZ5eE5RVUZOTEdWQlFXVTdRVUZETVVNc1VVRkJTU3hKUVVGSkxGZEJRVmM3UVVGRFppeGhRVUZQTEdkQ1FVRm5RanRCUVVNelFpeFhRVUZQTEhWQ1FVRjFRaXhOUVVGTkxGTkJRVlVzUjBGQlJ5eEhRVUZITzBGQlFVVXNZVUZCVHl4RlFVRkZMRkZCUVZFc1QwRkJUenRCUVVGQkxFOUJRVThzUzBGQlN6dEJRVUZCTzBGQlJUbEdMR1ZCUVZrc1ZVRkJWU3cwUWtGQk5FSXNWMEZCV1R0QlFVTXhSQ3hSUVVGSkxFMUJRVTBzVjBGQlZ5eE5RVUZOTEdWQlFXVTdRVUZETVVNc1VVRkJTU3hKUVVGSkxGZEJRVmM3UVVGRFppeGhRVUZQTEdkQ1FVRm5RanRCUVVNelFpeFhRVUZQTEhWQ1FVRjFRaXhOUVVGTkxGTkJRVlVzUjBGQlJ5eEhRVUZITzBGQlFVVXNZVUZCVHl4RlFVRkZMRXRCUVVzc1UwRkJWU3hIUVVGSE8wRkJRVVVzWlVGQlR5eEZRVUZGTEZGQlFWRXNUMEZCVHp0QlFVRkJPMEZCUVVFc1QwRkJWU3hMUVVGTE8wRkJRVUU3UVVGRk9VZ3NaVUZCV1N4VlFVRlZMRkZCUVZFc1YwRkJXVHRCUVVOMFF5eFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRTFCUVUwc1YwRkJWeXhOUVVGTkxHVkJRV1U3UVVGRE1VTXNVVUZCU1N4VlFVRlZMRXRCUVVzN1FVRkRia0lzVVVGQlNUdEJRVU5CTEZWQlFVa3NTMEZCU3p0QlFVRkJMR0ZCUlU0c1IwRkJVRHRCUVVOSkxHRkJRVThzUzBGQlN5eE5RVUZOTzBGQlFVRTdRVUZGZEVJc1VVRkJTU3hKUVVGSkxGZEJRVmM3UVVGRFppeGhRVUZQTEdkQ1FVRm5RanRCUVVNelFpeFJRVUZKTEVsQlFVa3NTVUZCU1N4TFFVRkxMRmRCUVZjc1RVRkJUU3hYUVVGWk8wRkJRVVVzWVVGQlR5eFpRVUZaTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1UwRkJVenRCUVVGQk8wRkJRelZHTEUxQlFVVXNjVUpCUVhGQ0xGTkJRVlVzVjBGQlZ6dEJRVU40UXl4blFrRkJWeXhqUVVGakxGTkJRM0pDTEUxQlFVMHNZVUZEVGl4TlFVRk5PMEZCUTFZc1ZVRkJTU3hMUVVGTE8wRkJRVUU3UVVGRllpeFJRVUZKTEVsQlFVazdRVUZEVWl4TlFVRkZMR05CUVdNc1UwRkJWU3hSUVVGUkxGTkJRVk1zVTBGQlV6dEJRVU5vUkN4VlFVRkpMRTFCUVUwc1QwRkJUenRCUVVOcVFpeGhRVUZQTEZGQlFWRXNTMEZCU3l4SlFVRkpMRTFCUVUwc1IwRkJSenRCUVVNM1FpeFZRVUZGTzBGQlEwWXNXVUZCU1N4TlFVRk5MRWxCUVVrc1VVRkJVVHRCUVVOc1FpeHJRa0ZCVVR0QlFVTlNMR2xDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWRtTEZWQlFVa3NVVUZCVVN4TFFVRkxMRWxCUVVrc1VVRkJVU3hIUVVGSE8wRkJRelZDTEdWQlFVODdRVUZCUVN4aFFVVk9PMEZCUTBRc1owSkJRVkVzVjBGQldUdEJRVUZGTEdsQ1FVRlBMRk5CUVZNc1NVRkJTVHRCUVVGQk8wRkJRekZETEdWQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1YwRkJUenRCUVVGQk8wRkJSVmdzWlVGQldTeFZRVUZWTEZkQlFWY3NVMEZCVlN4UFFVRlBPMEZCUXpsRExGZEJRVThzUzBGQlN5eFhRVUZYTEVOQlFVTXNRMEZCUXl4UlFVRlJMRkZCUVZFc1EwRkJReXhQUVVGUExFdEJRVXNzUjBGQlJ5eFhRVUZYTEVOQlFVVXNaVUZCWlN4UFFVRlBMR1ZCUVdVN1FVRkJRVHRCUVVVdlJ5eGxRVUZaTEZWQlFWVXNVMEZCVXl4WFFVRlpPMEZCUTNaRExGRkJRVWtzVFVGQlRTeFhRVUZYTEUxQlFVMHNaVUZCWlR0QlFVTXhReXhSUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVU5tTEdGQlFVOHNTVUZCU1N4TFFVRkxMRmRCUVZjN1FVRkRMMElzVVVGQlNUdEJRVU5CTEZWQlFVa3NTMEZCU3l4TFFVRkxPMEZCUVVFc1lVRkZXQ3hIUVVGUU8wRkJRMGtzWVVGQlR5eExRVUZMTEUxQlFVMDdRVUZCUVR0QlFVVjBRaXhSUVVGSkxGTkJRVk1zU1VGQlNTeFBRVUZQTEZOQlFWVXNTMEZCU3l4TFFVRkxPMEZCUVVVc1lVRkJUeXhOUVVOcVJDeEpRVUZKTEU5QlFVOHNRMEZCUXl4RFFVRkRMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeFRRVU55UXl4RFFVRkRMRU5CUVVNc1VVRkJVVHRCUVVGQkxFOUJRVlU3UVVGRGVFSXNWMEZCVHl4TFFVRkxMRU5CUVVNc1NVRkJTU3hKUVVGSkxGTkJRVk1zU1VGQlNTeExRVUZMTEVkQlFVYzdRVUZETVVNc1YwRkJUeXhMUVVGTExGZEJRVmNzVVVGQlVTeERRVUZGTEdWQlFXVXNUMEZCVHl4bFFVRmxPMEZCUVVFN1FVRkZNVVVzWlVGQldTeFZRVUZWTEdGQlFXRXNVMEZCVlN4UlFVRlJMRk5CUVZNN1FVRkRNVVFzVVVGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1N4UFFVRk5MRXRCUVVzc1RVRkJUU3haUVVGWkxFdEJRVXNzV1VGQldTeGhRVUZoTEV0QlFVc3NZVUZCWVN4TlFVRk5MRXRCUVVzc1RVRkJUU3hOUVVGTkxFdEJRVXM3UVVGRE4wY3NVVUZCU1N4UFFVRlBMRmRCUVZjN1FVRkRiRUlzWVVGQlR5eG5Ra0ZCWjBJN1FVRkRNMElzVVVGQlNTeERRVUZETEU5QlFVOHNUVUZCVFN4VFFVRlZMRTlCUVU4N1FVRkRMMElzWVVGQlR5eE5RVUZOTEU5QlFVOHNWVUZEYUVJc1RVRkJUU3hQUVVGUExGVkJRMklzVlVGQlZTeE5RVUZOTEVsQlFVa3NUVUZCVFN4UFFVRlBPMEZCUVVFc1VVRkRja003UVVGRFFTeGhRVUZQTEV0QlFVc3NUVUZCVFN3NFNFRkJPRWdzVjBGQlZ6dEJRVUZCTzBGQlJTOUtMRkZCUVVrc1owSkJRV2RDTEVOQlFVTXNWMEZCVnl4UlFVRlJMR3RDUVVGclFqdEJRVU14UkN4UlFVRkpMR2RDUVVGblFpeFhRVUZYTEZGQlFWRXNhMEpCUVd0Q08wRkJRM3BFTEhWQ1FVRnJRaXhUUVVGUkxGVkJRVlU3UVVGRGFFTXNWVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hSUVVGUE8wRkJRM1JDTEdGQlFVOHNTVUZCU1N4SFFVRkhMRVZCUVVVc1IwRkJSenRCUVVObUxGbEJRVWtzVVVGQlVTeFJRVUZQTzBGQlEyNUNMRmxCUVVrc1MwRkJTU3hUUVVGVExFbEJRVWtzVFVGQlRTeE5RVUZOTEV0QlFVc3NTMEZCU1N4VFFVRlRMRWxCUVVrc1RVRkJUU3hOUVVGTkxFZEJRVWM3UVVGRGJFVXNaMEpCUVUwc1MwRkJTeXhKUVVGSkxFMUJRVTBzU1VGQlNTeFRRVUZUTzBGQlEyeERMR2RDUVVGTkxFdEJRVXNzU1VGQlNTeE5RVUZOTEVsQlFVa3NVMEZCVXp0QlFVTnNRenRCUVVGQk8wRkJRVUU3UVVGSFVpeFZRVUZKTEUxQlFVMDdRVUZEVGl4blFrRkJUeXhMUVVGTE8wRkJRMmhDTEdGQlFVODdRVUZCUVR0QlFVVllMRkZCUVVrc1owSkJRV2RDTzBGQlEzQkNMSGxDUVVGeFFpeEhRVUZITEVkQlFVYzdRVUZCUlN4aFFVRlBMR05CUVdNc1JVRkJSU3hKUVVGSkxFVkJRVVU3UVVGQlFUdEJRVU14UkN4UlFVRkpPMEZCUTBvc1VVRkJTVHRCUVVOQkxGbEJRVTBzVDBGQlR5eFBRVUZQTEZkQlFWVTdRVUZET1VJc1ZVRkJTU3hMUVVGTE8wRkJRVUVzWVVGRlRpeEpRVUZRTzBGQlEwa3NZVUZCVHl4TFFVRkxMRTFCUVUwN1FVRkJRVHRCUVVWMFFpeFJRVUZKTEZkQlFWYzdRVUZEWml4UlFVRkpMREJDUVVFd1FpeG5Ra0ZETVVJc1UwRkJWU3hMUVVGTE8wRkJRVVVzWVVGQlR5eFZRVUZWTEV0QlFVc3NTVUZCU1N4VlFVRlZMRTFCUVUwN1FVRkJRU3hSUVVNelJDeFRRVUZWTEV0QlFVczdRVUZCUlN4aFFVRlBMRlZCUVZVc1MwRkJTeXhKUVVGSkxGVkJRVlVzVDBGQlR6dEJRVUZCTzBGQlEyaEZMRkZCUVVrc01FSkJRVEJDTEdkQ1FVTXhRaXhUUVVGVkxFdEJRVXM3UVVGQlJTeGhRVUZQTEZkQlFWY3NTMEZCU3l4SlFVRkpMRlZCUVZVc1RVRkJUVHRCUVVGQkxGRkJRelZFTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1YwRkJWeXhMUVVGTExFbEJRVWtzVlVGQlZTeFBRVUZQTzBGQlFVRTdRVUZEYWtVc2JVTkJRU3RDTEV0QlFVczdRVUZEYUVNc1lVRkJUeXhEUVVGRExIZENRVUYzUWl4UlFVRlJMRU5CUVVNc2QwSkJRWGRDTzBGQlFVRTdRVUZGY2tVc1VVRkJTU3hYUVVGWE8wRkJRMllzVVVGQlNTeEpRVUZKTEVsQlFVa3NTMEZCU3l4WFFVRlhMRTFCUVUwc1YwRkJXVHRCUVVGRkxHRkJRVThzV1VGQldTeEpRVUZKTEVkQlFVY3NTVUZCU1N4SlFVRkpMRWxCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTTdRVUZCUVR0QlFVTjJTQ3hOUVVGRkxIRkNRVUZ4UWl4VFFVRlZMRmRCUVZjN1FVRkRlRU1zVlVGQlNTeGpRVUZqTEZGQlFWRTdRVUZEZEVJc2JVSkJRVmM3UVVGRFdDeDNRa0ZCWjBJN1FVRkJRU3hoUVVWbU8wRkJRMFFzYlVKQlFWYzdRVUZEV0N4M1FrRkJaMEk3UVVGQlFUdEJRVVZ3UWl4VlFVRkpMRXRCUVVzN1FVRkJRVHRCUVVWaUxFMUJRVVVzWTBGQll5eFRRVUZWTEZGQlFWRXNVMEZCVXl4VFFVRlRPMEZCUTJoRUxGVkJRVWtzVFVGQlRTeFBRVUZQTzBGQlEycENMR0ZCUVU4c1UwRkJVeXhOUVVGTk8wRkJRMnhDTEZWQlFVVTdRVUZEUml4WlFVRkpMR0ZCUVdFc1NVRkJTU3hSUVVGUk8wRkJRM3BDTEd0Q1FVRlJPMEZCUTFJc2FVSkJRVTg3UVVGQlFUdEJRVUZCTzBGQlIyWXNWVUZCU1N4elFrRkJjMElzVFVGQlRUdEJRVU0xUWl4bFFVRlBPMEZCUVVFc2FVSkJSVVlzVFVGQlRTeExRVUZMTEV0QlFVc3NTVUZCU1N4VlFVRlZMRkZCUVZFc1MwRkJTeXhOUVVGTkxFdEJRVXNzUzBGQlN5eEpRVUZKTEZWQlFWVXNVVUZCVVN4SFFVRkhPMEZCUTNwR0xHVkJRVTg3UVVGQlFTeGhRVVZPTzBGQlEwUXNaMEpCUVZFc1YwRkJXVHRCUVVOb1FpeGpRVUZKTEd0Q1FVRnJRanRCUVVOc1FpeHRRa0ZCVHl4VFFVRlRMRWxCUVVrc1ZVRkJWVHRCUVVGQk8wRkJSVGxDTEcxQ1FVRlBMRk5CUVZNc1NVRkJTU3hWUVVGVk8wRkJRVUU3UVVGRmRFTXNaVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhYUVVGUE8wRkJRVUU3UVVGRldDeGxRVUZaTEZWQlFWVXNhMEpCUVd0Q0xGZEJRVms3UVVGRGFFUXNVVUZCU1N4TlFVRk5MRmRCUVZjc1RVRkJUU3hsUVVGbE8wRkJRekZETEZGQlFVa3NRMEZCUXl4SlFVRkpMRTFCUVUwc1UwRkJWU3hIUVVGSE8wRkJRVVVzWVVGQlR5eFBRVUZQTEUxQlFVMDdRVUZCUVN4UlFVRmpPMEZCUXpWRUxHRkJRVThzUzBGQlN5eE5RVUZOTzBGQlFVRTdRVUZGZEVJc1VVRkJTU3hKUVVGSkxGZEJRVmM3UVVGRFppeGhRVUZQTEdkQ1FVRm5RanRCUVVNelFpeFhRVUZQTEV0QlFVc3NWMEZCVnl4SlFVRkpMRWxCUVVrc1UwRkJWU3hMUVVGTE8wRkJRVVVzWVVGQlR5eERRVUZETEV0QlFVc3NUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkZka1VzVTBGQlR6dEJRVUZCTzBGQlIxZ3NjME5CUVhORExFbEJRVWs3UVVGRGRFTXNVMEZCVHl4eFFrRkJjVUlzV1VGQldTeFhRVUZYTEhOQ1FVRnhRaXhQUVVGUExFOUJRVThzWTBGQll6dEJRVU5vUnl4VFFVRkxMRXRCUVVzN1FVRkRWaXhUUVVGTExFOUJRVTg3UVVGQlFTeE5RVU5TTzBGQlFVRXNUVUZEUVN4UFFVRlBMRlZCUVZVc1VVRkJVU3hQUVVGUE8wRkJRVUVzVFVGRGFFTXNTVUZCU1R0QlFVRkJPMEZCUlZJc1VVRkJTU3haUVVGWkxFZEJRVWNzVFVGQlRUdEJRVU42UWl4UlFVRkpMRU5CUVVNN1FVRkRSQ3haUVVGTkxFbEJRVWtzVjBGQlZ6dEJRVU42UWl4VFFVRkxMRTlCUVU4c1MwRkJTeXhoUVVGaExGVkJRVlVzU1VGQlNTeExRVUZMTzBGQlEycEVMRk5CUVVzc1kwRkJZeXhUUVVGVkxFZEJRVWNzUjBGQlJ6dEJRVUZGTEdGQlFVOHNWVUZCVlN4SlFVRkpMRWRCUVVjN1FVRkJRVHRCUVVNM1JDeFRRVUZMTEU5QlFVOHNVMEZCVlN4SFFVRkhMRWRCUVVjN1FVRkJSU3hoUVVGUExGVkJRVlVzU1VGQlNTeEhRVUZITEV0QlFVc3NTVUZCU1N4SlFVRkpPMEZCUVVFN1FVRkRia1VzVTBGQlN5eFBRVUZQTEZOQlFWVXNSMEZCUnl4SFFVRkhPMEZCUVVVc1lVRkJUeXhWUVVGVkxFbEJRVWtzUjBGQlJ5eExRVUZMTEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCUTI1RkxGTkJRVXNzWlVGQlpTeEhRVUZITEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCU1hKRExEUkNRVUUwUWl4UlFVRlJPMEZCUTJoRExGTkJRVThzUzBGQlN5eFRRVUZWTEU5QlFVODdRVUZEZWtJc2JVSkJRV1U3UVVGRFppeFhRVUZQTEUxQlFVMHNUMEZCVHp0QlFVTndRaXhYUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWRtTEhkQ1FVRjNRaXhQUVVGUE8wRkJRek5DTEUxQlFVa3NUVUZCVFR0QlFVTk9MRlZCUVUwN1FVRkRWaXhOUVVGSkxFMUJRVTA3UVVGRFRpeFZRVUZOTzBGQlFVRTdRVUZIWkN4SlFVRkpMR1ZCUVdVc1QwRkJUeXhOUVVGTk8wRkJSV2hETEVsQlFVa3NZMEZCWjBJc1YwRkJXVHRCUVVNMVFpd3dRa0ZCZFVJN1FVRkJRVHRCUVVWMlFpeGxRVUZaTEZWQlFWVXNVVUZCVVN4WFFVRlpPMEZCUTNSRExGZEJRVThzUTBGQlF5eEpRVUZKTzBGQlExb3NUVUZCUlN4TFFVRkxPMEZCUTFBc1VVRkJTU3hMUVVGTExHTkJRV01zUzBGQlN5eERRVUZETEVsQlFVazdRVUZETjBJc1ZVRkJTU3hsUVVGbE8wRkJRM1pDTEZkQlFVODdRVUZCUVR0QlFVVllMR1ZCUVZrc1ZVRkJWU3hWUVVGVkxGZEJRVms3UVVGRGVFTXNWMEZCVHl4RFFVRkRMRWxCUVVrN1FVRkRXaXhSUVVGSkxFVkJRVVVzUzBGQlN5eGpRVUZqTEVkQlFVYzdRVUZEZUVJc1ZVRkJTU3hEUVVGRExFbEJRVWs3UVVGRFRDeFpRVUZKTEdWQlFXVTdRVUZEZGtJc1lVRkJUeXhMUVVGTExHTkJRV01zVTBGQlV5eExRVUZMTEVOQlFVTXNTMEZCU3l4WFFVRlhPMEZCUTNKRUxGbEJRVWtzVjBGQlZ5eExRVUZMTEdOQlFXTTdRVUZEYkVNc1dVRkJTVHRCUVVOQkxHbENRVUZQTEZOQlFWTXNTVUZCU1N4VFFVRlRPMEZCUVVFc2FVSkJSVEZDTEVkQlFWQTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkhVaXhYUVVGUE8wRkJRVUU3UVVGRldDeGxRVUZaTEZWQlFWVXNWVUZCVlN4WFFVRlpPMEZCUTNoRExGZEJRVThzUzBGQlN5eGhRVUZoTEVsQlFVa3NhVUpCUVdsQ08wRkJRVUU3UVVGRmJFUXNaVUZCV1N4VlFVRlZMRk5CUVZNc1UwRkJWU3hWUVVGVk8wRkJReTlETEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc1EwRkJReXhMUVVGTE8wRkJRMDRzWVVGQlR6dEJRVU5ZTEZGQlFVa3NVVUZCVVN4TFFVRkxMRWRCUVVjN1FVRkRjRUlzVVVGQlNTeGpRVUZqTEV0QlFVc3NSMEZCUnl4UFFVRlBPMEZCUTJwRExGZEJRVThzUTBGQlF5eExRVUZMTzBGQlEySXNVVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhQUVVGUE8wRkJRM0pDTEdOQlFWRXNaVUZCWlN4WlFVRlpPMEZCUVVFc1lVRkRNVUk3UVVGRFJDeG5Ra0ZCVFN4SlFVRkpMRmRCUVZjc1pVRkJaVHRCUVVGQkxHRkJRMjVETzBGQlEwUXNaMEpCUVUwc1NVRkJTU3hYUVVGWExGZEJRVmNzV1VGQldTeFRRVUZUTzBGQlFVRTdRVUZGY2tRc1owSkJRVTBzU1VGQlNTeFhRVUZYTEZkQlFWYzdRVUZCUVR0QlFVRkJPMEZCUnpWRExGRkJRVWtzUTBGQlF5eExRVUZMTzBGQlEwNHNXVUZCVFN4SlFVRkpMRmRCUVZjN1FVRkRla0lzVjBGQlR5eExRVUZMTEZsQlFWa3NWMEZCVnp0QlFVTnVReXhsUVVGWExFdEJRVXNzVjBGQlZ5eFpRVUZaTEUxQlFVMHNXVUZCV1N4dlFrRkJiMElzUzBGQlN5eGhRVUZoTEV0QlFVczdRVUZEY0Vjc1lVRkJVeXhWUVVGVkxFdEJRVXNzVTBGQlZTeEpRVUZKTzBGQlEyeERMSEZDUVVGbE8wRkJRMllzV1VGQlRTeFJRVUZSTEZOQlFWTTdRVUZCUVR0QlFVVXpRaXhoUVVGVExGVkJRVlVzUzBGQlN5eFRRVUZWTEVsQlFVazdRVUZEYkVNc2NVSkJRV1U3UVVGRFppeFpRVUZOTEZWQlFWVXNUVUZCVFN4UlFVRlJMRWxCUVVrc1YwRkJWeXhOUVVGTkxGTkJRVk03UVVGRE5VUXNXVUZCVFN4VFFVRlRPMEZCUTJZc1dVRkJUU3hIUVVGSExGTkJRVk1zUzBGQlN6dEJRVUZCTzBGQlJUTkNMR0ZCUVZNc1lVRkJZU3hMUVVGTExGZEJRVms3UVVGRGJrTXNXVUZCVFN4VFFVRlRPMEZCUTJZc1dVRkJUVHRCUVVOT0xGVkJRVWtzYTBKQlFXdENMRlZCUVZVN1FVRkROVUlzY1VKQlFXRXNXVUZCV1N4TFFVRkxMRk5CUVZNN1FVRkJRVHRCUVVGQk8wRkJSeTlETEZkQlFVODdRVUZCUVR0QlFVVllMR1ZCUVZrc1ZVRkJWU3hYUVVGWExGTkJRVlVzVFVGQlRTeEpRVUZKTEZsQlFWazdRVUZETjBRc1VVRkJTU3hSUVVGUk8wRkJRMW9zVVVGQlNTeFRRVUZUTEdWQlFXVXNTMEZCU3l4VFFVRlRPMEZCUTNSRExHRkJRVThzVlVGQlZTeEpRVUZKTEZkQlFWY3NVMEZCVXp0QlFVTTNReXhSUVVGSkxFTkJRVU1zUzBGQlN6dEJRVU5PTEdGQlFVOHNWVUZCVlN4SlFVRkpMRmRCUVZjN1FVRkRjRU1zVVVGQlNTeExRVUZMTEZkQlFWYzdRVUZEYUVJc1lVRkJUeXhKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZETDBNc1kwRkJUU3hqUVVGakxFdEJRVXNzUTBGQlF5eFhRVUZaTzBGQlF6bENMR2RDUVVGTkxGTkJRVk1zVFVGQlRTeEpRVUZKTEZsQlFWa3NTMEZCU3l4VFFVRlRPMEZCUVVFc1YwRkRjRVE3UVVGQlFUdEJRVUZCTEdWQlIwNHNXVUZCV1R0QlFVTnFRaXhoUVVGUExGTkJRVk1zVjBGQldUdEJRVU40UWl4WlFVRkpMRXRCUVVrc1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlEyaEVMR2RDUVVGTk8wRkJRMDRzWTBGQlNTeExRVUZMTEVkQlFVY3NVMEZCVXl4UlFVRlJPMEZCUXpkQ0xHTkJRVWtzVFVGQlRTeEhRVUZITzBGQlExUXNaVUZCUnl4TFFVRkxMRk5CUVZNN1FVRkJRVHRCUVVWNlFpeFhRVUZGTEZGQlFWRXNWMEZCV1R0QlFVRkZMR2xDUVVGUExFMUJRVTA3UVVGQlFUdEJRVU55UXl4WFFVRkZMRTlCUVU4N1FVRkRWQ3hsUVVGUE8wRkJRVUU3UVVGQlFTeFhRVWRXTzBGQlEwUXNWVUZCU1N4SlFVRkpMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU5vUkN4WlFVRkpMRXRCUVVzc1IwRkJSeXhUUVVGVExGRkJRVkU3UVVGRE4wSXNXVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkRWQ3hoUVVGSExFdEJRVXNzVTBGQlV6dEJRVUZCTzBGQlJYcENMRkZCUVVVc1QwRkJUenRCUVVOVUxHRkJRVTg3UVVGQlFUdEJRVUZCTzBGQlIyWXNaVUZCV1N4VlFVRlZMRkZCUVZFc1YwRkJXVHRCUVVOMFF5eFhRVUZQTEV0QlFVc3NVMEZCVXl4TFFVRkxMRTlCUVU4c1ZVRkJWVHRCUVVGQk8wRkJSUzlETEdWQlFWa3NWVUZCVlN4VlFVRlZMRk5CUVZVc1lVRkJZVHRCUVVOdVJDeFJRVUZKTEU5QlFVOHNTMEZCU3p0QlFVTm9RaXhSUVVGSkxGVkJRVlVzWVVGQllTeFJRVUZSTzBGQlEyNURMRkZCUVVrc1MwRkJTeXhoUVVGaE8wRkJRMnhDTEZkQlFVc3NZMEZCWXl4TFFVRkxMRmxCUVZrc1MwRkJTeXhYUVVGWk8wRkJRVVVzWlVGQlR6dEJRVUZCTzBGQlFVRXNWMEZGTjBRN1FVRkRSQ3hYUVVGTExHTkJRV003UVVGRGJrSXNWMEZCU3l4blFrRkJaMEk3UVVGRGNrSXNWVUZCU1N4UlFVRlJMRXRCUVVzc1UwRkJVeXhaUVVGWkxFdEJRVXNzVjBGQlZ6dEJRVU4wUkN4TlFVRkRMR2xDUVVGblFqdEJRVU5pTEZWQlFVVXNTMEZCU3p0QlFVTlFMR1ZCUVU4c1MwRkJTeXhqUVVGak8wRkJRM1JDTEZWQlFVTXNTMEZCU3l4alFVRmpPMEZCUTNoQ0xGbEJRVWtzUzBGQlN6dEJRVU5NTEdkQ1FVRk5MRWxCUVVrc1YwRkJWeXhaUVVGWk8wRkJRVUU3UVVGQlFUdEJRVWMzUXl4UlFVRkpMSEZDUVVGeFFpeExRVUZMTzBGQlF6bENMRmRCUVU4c1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlF5OURMR05CUVZFc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGQlJTeGxRVUZQTEV0QlFVc3NZMEZCWXl4TFFVRkxMRXRCUVVzc1VVRkJVU3hMUVVGTExFMUJRVTA3UVVGQlFTeFRRVUZYTEZOQlFWVXNTMEZCU3p0QlFVRkZMR1ZCUVU4c1MwRkJTeXhqUVVGakxFdEJRVXNzUzBGQlN5eFBRVUZQTEV0QlFVc3NUVUZCVFR0QlFVRkJMRk5CUVZjc1VVRkJVU3hYUVVGWk8wRkJRMnhOTEZsQlFVa3NTMEZCU3l4blFrRkJaMElzYjBKQlFXOUNPMEZCUTNwRExHVkJRVXNzWTBGQll6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUzI1RExHVkJRVmtzVlVGQlZTeFJRVUZSTEZkQlFWazdRVUZEZEVNc1UwRkJTeXhWUVVGVkxFdEJRVXNzVVVGQlVTeEpRVUZKTEZkQlFWYzdRVUZETTBNc1UwRkJTeXhUUVVGVE8wRkJRVUU3UVVGRmJFSXNaVUZCV1N4VlFVRlZMRkZCUVZFc1UwRkJWU3hYUVVGWE8wRkJReTlETEZGQlFVa3NhVUpCUVd0Q0xFdEJRVXNzYlVKQlFXOUNMRTFCUVVzc2EwSkJRV3RDTzBGQlEzUkZMRkZCUVVrc1QwRkJUeXhuUWtGQlowSTdRVUZEZGtJc1lVRkJUeXhsUVVGbE8wRkJRekZDTEZGQlFVa3NZMEZCWXl4TFFVRkxMRTlCUVU4N1FVRkRPVUlzVVVGQlNTeERRVUZETEdGQlFXRTdRVUZEWkN4WlFVRk5MRWxCUVVrc1YwRkJWeXhUUVVGVExGZEJRVmNzV1VGQldUdEJRVUZCTzBGQlJYcEVMRkZCUVVrc2QwSkJRWGRDTEVsQlFVa3NTMEZCU3l4SFFVRkhMRTFCUVUwc1YwRkJWeXhoUVVGaE8wRkJRM1JGTERCQ1FVRnpRaXhQUVVGUExFdEJRVXNzUjBGQlJ5eExRVUZMTEUxQlFVMDdRVUZEYUVRc2JVSkJRV1VzWVVGQllUdEJRVU0xUWl4WFFVRlBPMEZCUVVFN1FVRkZXQ3hUUVVGUE8wRkJRVUU3UVVGSFdDeHpRMEZCYzBNc1NVRkJTVHRCUVVOMFF5eFRRVUZQTEhGQ1FVRnhRaXhaUVVGWkxGZEJRVmNzYzBKQlFYRkNMRTFCUVUwc1dVRkJXU3hWUVVGVkxGRkJRVkU3UVVGRGVFY3NVVUZCU1N4UlFVRlJPMEZCUTFvc1UwRkJTeXhMUVVGTE8wRkJRMVlzVTBGQlN5eFBRVUZQTzBGQlExb3NVMEZCU3l4aFFVRmhPMEZCUTJ4Q0xGTkJRVXNzVTBGQlV6dEJRVU5rTEZOQlFVc3NWMEZCVnp0QlFVTm9RaXhUUVVGTExFdEJRVXNzVDBGQlR5eE5RVUZOTEZsQlFWa3NVMEZCVXp0QlFVTTFReXhUUVVGTExGTkJRVk1zVlVGQlZUdEJRVU40UWl4VFFVRkxMRk5CUVZNN1FVRkRaQ3hUUVVGTExGbEJRVms3UVVGRGFrSXNVMEZCU3l4blFrRkJaMEk3UVVGRGNrSXNVMEZCU3l4WFFVRlhPMEZCUTJoQ0xGTkJRVXNzVlVGQlZUdEJRVU5tTEZOQlFVc3NZMEZCWXp0QlFVTnVRaXhUUVVGTExHZENRVUZuUWp0QlFVTnlRaXhUUVVGTExHRkJRV0U3UVVGRGJFSXNVMEZCU3l4alFVRmpMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU16UkN4WlFVRk5MRmRCUVZjN1FVRkRha0lzV1VGQlRTeFZRVUZWTzBGQlFVRTdRVUZGY0VJc1UwRkJTeXhaUVVGWkxFdEJRVXNzVjBGQldUdEJRVU01UWl4WlFVRk5MRk5CUVZNN1FVRkRaaXhaUVVGTkxFZEJRVWNzVTBGQlV6dEJRVUZCTEU5QlEyNUNMRk5CUVZVc1IwRkJSenRCUVVOYUxGVkJRVWtzV1VGQldTeE5RVUZOTzBGQlEzUkNMRmxCUVUwc1UwRkJVenRCUVVObUxGbEJRVTBzUjBGQlJ5eE5RVUZOTEV0QlFVczdRVUZEY0VJc1dVRkJUU3hUUVVOR0xFMUJRVTBzVDBGQlR5eFJRVUZSTEV0QlEzSkNMR0ZCUVdFc1RVRkJUU3haUVVGWkxFMUJRVTBzVTBGQlV6dEJRVU5zUkN4aFFVRlBMRlZCUVZVN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTE4wSXNlVUpCUVhsQ0xFMUJRVTBzVTBGQlV5eFJRVUZSTEU5QlFVOHNUVUZCVFN4VlFVRlZMRmRCUVZjN1FVRkRPVVVzVTBGQlR6dEJRVUZCTEVsQlEwZzdRVUZCUVN4SlFVTkJPMEZCUVVFc1NVRkRRVHRCUVVGQkxFbEJRMEU3UVVGQlFTeEpRVU5CTzBGQlFVRXNTVUZEUVR0QlFVRkJMRWxCUTBFc1MwRkJUU3hYUVVGVkxFTkJRVU1zV1VGQldTeE5RVUZOTEUxQlFVOHNVMEZCVVN4TlFVRk5MRTFCUVU4c1VVRkJUeXhQUVVGUExFMUJRVTBzWjBKQlFXZENPMEZCUVVFN1FVRkJRVHRCUVVjelJ5eDVRa0ZCZVVJc1UwRkJVenRCUVVNNVFpeFRRVUZQTEU5QlFVOHNXVUZCV1N4WFFVTjBRaXhWUVVOQkxGVkJRVmNzVFVGQlRTeEhRVUZITEV0QlFVc3NTMEZCU3l4VFFVRlRMRTlCUVU4c1RVRkJUenRCUVVGQk8wRkJSemRFTERKQ1FVRXlRaXhOUVVGTkxGTkJRVk1zVTBGQlV6dEJRVU12UXl4VFFVRlBPMEZCUVVFc1NVRkRTRHRCUVVGQkxFbEJRMEU3UVVGQlFTeEpRVU5CTzBGQlFVRXNTVUZEUVN4aFFVRmhPMEZCUVVFc1NVRkRZaXhYUVVGWExHTkJRV01zVTBGQlV5eFRRVUZWTEU5QlFVODdRVUZCUlN4aFFVRlBMRU5CUVVNc1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNXcEdMSGxDUVVGNVFpeFRRVUZUTzBGQlF6bENMRTFCUVVrc1YwRkJWeXhOUVVGTk8wRkJRMnBDTEZkQlFVOHNWMEZCV1R0QlFVRkZMR0ZCUVU4N1FVRkJRVHRCUVVGQkxHRkJSWFpDTEU5QlFVOHNXVUZCV1N4VlFVRlZPMEZCUTJ4RExGZEJRVThzTUVKQlFUQkNPMEZCUVVFc1UwRkZhRU03UVVGRFJDeFhRVUZQTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1lVRkJZU3hMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlIzcEVMRzFEUVVGdFF5eFRRVUZUTzBGQlEzaERMRTFCUVVrc1VVRkJVU3hSUVVGUkxFMUJRVTA3UVVGRE1VSXNUVUZCU1N4TlFVRk5MRmRCUVZjc1IwRkJSenRCUVVOd1FpeFhRVUZQTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1NVRkJTVHRCUVVGQk8wRkJRVUVzVTBGRmJFTTdRVUZEUkN4WFFVRlBMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzWVVGQllTeExRVUZMTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1hwRUxHdENRVUZyUWl4WFFVRlhPMEZCUTNwQ0xGTkJRVThzUjBGQlJ5eE5RVUZOTEV0QlFVczdRVUZCUVR0QlFVVjZRaXhKUVVGSkxHTkJRV003UVVGRGJFSXNlVUpCUVhsQ0xGTkJRVk03UVVGRE9VSXNVMEZCVHl4WFFVRlhMRTlCUTJRc1VVRkRRU3hQUVVGUExGbEJRVmtzVjBGRFppeFZRVU5CTEUxQlFVMHNVVUZCVVN4TFFVRkxMRTlCUVU4N1FVRkJRVHRCUVVWMFF5eHpRa0ZCYzBJc1NVRkJTU3hYUVVGWExHRkJRV0VzVlVGQlZUdEJRVU40UkN4TlFVRkpMRTlCUVUwc1ZVRkJWU3hKUVVGSkxFdEJRVXM3UVVGRE4wSXNlVUpCUVhWQ0xFdEJRVWtzVDBGQlR6dEJRVU01UWl4UlFVRkpMRlZCUVZNc1UwRkJVeXhKUVVGSE8wRkJRM3BDTEZkQlFVODdRVUZCUVN4TlFVTklMRkZCUVZFN1FVRkJRU3hSUVVOS0xFMUJRVTBzU1VGQlJ6dEJRVUZCTEZGQlExUXNVVUZCVVN4UlFVRlBMRWxCUVVrc1UwRkJWU3hQUVVGUE8wRkJRVVVzYVVKQlFVOHNUVUZCVFN4WlFVRlpPMEZCUVVFc1YwRkJWeXhKUVVGSkxGTkJRVlVzVDBGQlR6dEJRVU16Uml4alFVRkpMRlZCUVZVc1RVRkJUU3hUUVVGVExHZENRVUZuUWl4TlFVRk5PMEZCUTI1RUxHTkJRVWtzVjBGQlZ5eFJRVUZSTzBGQlEzWkNMR05CUVVrc1YwRkJWeXhYUVVGWE8wRkJRekZDTEdOQlFVa3NhVUpCUVdsQ08wRkJRM0pDTEdOQlFVa3NVMEZCVXp0QlFVRkJMRmxCUTFRc1RVRkJUU3hOUVVGTk8wRkJRVUVzV1VGRFdpeFpRVUZaTzBGQlFVRXNZMEZEVWl4TlFVRk5PMEZCUVVFc1kwRkRUaXhqUVVGak8wRkJRVUVzWTBGRFpEdEJRVUZCTEdOQlEwRTdRVUZCUVN4alFVTkJPMEZCUVVFc1kwRkRRVHRCUVVGQkxHTkJRMEVzVVVGQlVUdEJRVUZCTEdOQlExSXNXVUZCV1N4blFrRkJaMEk3UVVGQlFUdEJRVUZCTEZsQlJXaERMRk5CUVZNc1UwRkJVeXhOUVVGTkxGbEJRVmtzU1VGQlNTeFRRVUZWTEZkQlFWYzdRVUZCUlN4eFFrRkJUeXhOUVVGTkxFMUJRVTA3UVVGQlFTeGxRVU0zUlN4SlFVRkpMRk5CUVZVc1QwRkJUenRCUVVOMFFpeHJRa0ZCU1N4UFFVRlBMRTFCUVUwc1RVRkJUU3hUUVVGVExFMUJRVTBzVVVGQlVTeGhRVUZoTEUxQlFVMHNXVUZCV1N4WFFVRlZMRTFCUVUwN1FVRkROMFlzYTBKQlFVa3NXVUZCVnl4UlFVRlJPMEZCUTNaQ0xHdENRVUZKTEZWQlFWTTdRVUZCUVN4blFrRkRWRHRCUVVGQkxHZENRVU5CTEZWQlFWVTdRVUZCUVN4blFrRkRWaXhUUVVGVE8wRkJRVUVzWjBKQlExUTdRVUZCUVN4blFrRkRRVHRCUVVGQkxHZENRVU5CTEZsQlFWa3NaMEpCUVdkQ08wRkJRVUU3UVVGRmFFTXNOa0pCUVdVc1owSkJRV2RDTEdGQlFWazdRVUZETTBNc2NVSkJRVTg3UVVGQlFUdEJRVUZCTEZsQlJWZ3NiVUpCUVcxQ0xGTkJRVlVzVlVGQlV6dEJRVUZGTEhGQ1FVRlBMR1ZCUVdVc1owSkJRV2RDTzBGQlFVRTdRVUZCUVR0QlFVVnNSaXg1UWtGQlpTeFRRVUZUTEU5QlFVODdRVUZETDBJc1kwRkJTU3hYUVVGWExFMUJRVTA3UVVGRGFrSXNNa0pCUVdVc1owSkJRV2RDTEZsQlFWa3NUMEZCVHp0QlFVRkJPMEZCUlhSRUxHbENRVUZQTzBGQlFVRTdRVUZCUVR0QlFVRkJMRTFCUjJZc1YwRkJWeXhSUVVGUExGTkJRVk1zUzBGQlRTeFpRVUZaTEUxQlFVMHNXVUZCV1N4UlFVRlBMRTlCUTJ4RkxFTkJRVVVzVVVGQlR5eGpRVUZqTEdWQlFXVXNVMEZCVXl4TFFVRkxMRlZCUVZVc1kwRkRNVVFzUTBGQlF5eHZRa0ZCYjBJc1MwRkJTeXhWUVVGVkxHTkJRM0JETEVkQlFVY3NUMEZCVHl4VlFVRlZMRlZCUVZVc1RVRkJUU3hyUWtGQmEwSXNTMEZCU3p0QlFVRkJPMEZCUVVFN1FVRkhNMFVzTWtKQlFYbENMRTlCUVU4N1FVRkROVUlzVVVGQlNTeE5RVUZOTEZOQlFWTTdRVUZEWml4aFFVRlBPMEZCUTFnc1VVRkJTU3hOUVVGTkxGTkJRVk03UVVGRFppeFpRVUZOTEVsQlFVa3NUVUZCVFR0QlFVTndRaXhSUVVGSkxGRkJRVkVzVFVGQlRTeFBRVUZQTEZGQlFWRXNUVUZCVFN4UFFVRlBMRmxCUVZrc1RVRkJUU3hYUVVGWExGbEJRVmtzVFVGQlRUdEJRVU0zUml4UlFVRkpMRmRCUVZjc1ZVRkJWU3hUUVVOeVFpeFZRVUZWTEZOQlEwNHNUMEZEUVN4WlFVRlpMRmRCUVZjc1QwRkJUeXhEUVVGRExFTkJRVU1zWVVGRGNFTXNWVUZCVlN4VFFVTk9MRmxCUVZrc1YwRkJWeXhQUVVGUExFTkJRVU1zUTBGQlF5eGhRVU5vUXl4WlFVRlpMRTFCUVUwc1QwRkJUeXhQUVVGUExFTkJRVU1zUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0QlFVTjJSQ3hYUVVGUE8wRkJRVUU3UVVGRldDdzJRa0ZCTWtJc1lVRkJZVHRCUVVOd1F5eFJRVUZKTEZsQlFWa3NXVUZCV1R0QlFVTTFRaXh2UWtGQlowSXNTMEZCU1R0QlFVTm9RaXhWUVVGSkxGRkJRVkVzU1VGQlJ5eFBRVUZQTEU5QlFVOHNTVUZCUnl4TlFVRk5MRkZCUVU4c1NVRkJSeXhOUVVGTkxGTkJRVk1zU1VGQlJ5eFJRVUZSTEZGQlFWRXNTVUZCUnp0QlFVTnlSaXhoUVVGUExFbEJRVWtzVVVGQlVTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXhReXhyUWtGQlZTeExRVUZMTzBGQlEyWXNXVUZCU1N4UlFVRlJMRTFCUVUwc1dVRkJXVHRCUVVNNVFpeFpRVUZKTEZkQlFWY3NUVUZCVFN4WFFVRlhPMEZCUTJoRExGbEJRVWtzWVVGQllTeFRRVUZUTEZOQlFWTXNVMEZCVXp0QlFVTTFReXhaUVVGSkxFTkJRVU1zWTBGQll5eFRRVUZUTEZsQlFWa3NVMEZCVXp0QlFVTTNReXhuUWtGQlRTeEpRVUZKTEUxQlFVMHNOa0pCUVRaQ08wRkJRMnBFTEZsQlFVa3NVMEZCVlN4VlFVRlJMRlZCUVZVc1EwRkJSU3hSUVVGUkxFbEJRVXM3UVVGREwwTXNXVUZCU1N4VFFVRlJMRlZCUVZVc1RVRkJTeXhYUVVGWExFOUJRVThzVVVGQlVUdEJRVU5xUkN4blFrRkJUU3hKUVVGSkxFMUJRVTA3UVVGQlFUdEJRVVZ3UWl4WlFVRkpMRmRCUVZjN1FVRkRXQ3hwUWtGQlR5eFJRVUZSTEVOQlFVVXNZVUZCWVN4SFFVRkhMRlZCUVZVc1NVRkJTU3hUUVVGVExFbEJRVWtzV1VGQldUdEJRVU0xUlN4WlFVRkpPMEZCUTBvc1dVRkJTU3hQUVVGUE8wRkJRMWdzV1VGQlNTeFhRVUZYTzBGQlEyWXNXVUZCU1N4alFVRmpPMEZCUTJ4Q0xGbEJRVWtzWlVGQlpTeFRRVUZWTEU5QlFVODdRVUZEYUVNc1dVRkJSVHRCUVVOR0xIbENRVUZsTzBGQlFVRTdRVUZGYmtJc1dVRkJTU3hUUVVGVExHVkJRV1U3UVVGRGVFSXNZMEZCU1N4TlFVRk5MRk5CUVZNN1FVRkRaaXh0UWtGQlR5eFJRVUZSTEVOQlFVVXNZVUZCTUVJc1ZVRkJiMElzVTBGQlV5eEpRVUZKTEZsQlFWazdRVUZETlVZc1kwRkJTU3hOUVVGTkxGTkJRVk03UVVGRFppeHBRa0ZCU3l4TFFVRkxMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJSWFJDTEdsQ1FVRkxMRXRCUVVzc1RVRkJUU3hOUVVGTkxFOUJRVThzWjBKQlFXZENPMEZCUVVFc1pVRkZhRVE3UVVGRFJDeGpRVUZKTEUxQlFVc3NZVUZEVEN4WFFVTkpMRU5CUVVNc1VVRkJVU3hUUVVOVUxFTkJRVU1zVVVGQlVTeFJRVU5pTEVOQlFVTXNUMEZCVFN4UFFVRlBMRkZCUVZFc1NVRkJSeXhKUVVGSkxGRkJRVkVzU1VGQlJ6dEJRVU0xUXl4alFVRkpMRmxCUVZrN1FVRkRXaXh4UWtGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4UlFVRlJMRVZCUVVVc1IwRkJSenRCUVVNM1FpeHRRa0ZCU3l4TFFVRkxMRTFCUVU4c1UwRkJVeXhOUVVGTkxFOUJRVThzVTBGRGJrTXNUVUZCVFN4TlFVRk5MRTFCUVUwc1NVRkJTU3hOUVVGTkxFMUJRelZDTEUxQlFVMHNUVUZCVFN4TlFVRk5PMEZCUTNSQ0xHdENRVUZKTEZWQlFWVTdRVUZCUVR0QlFVRkJMR2xDUVVkcVFqdEJRVU5FTEhGQ1FVRlRMRWxCUVVrc1IwRkJSeXhKUVVGSkxGRkJRVkVzUlVGQlJTeEhRVUZITzBGQlF6ZENMRzFDUVVGTExFdEJRVXNzVFVGQlRTeE5RVUZOTEUxQlFVMHNUVUZCVFR0QlFVTnNReXhyUWtGQlNTeFZRVUZWTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1RGQ0xGbEJRVWtzVDBGQlR5eFRRVUZWTEU5QlFVODdRVUZEZUVJc1kwRkJTU3hoUVVGaExFMUJRVTBzVDBGQlR6dEJRVU01UWl4bFFVRkxMRkZCUVZFc1UwRkJWU3hOUVVGTExFbEJRVWM3UVVGQlJTeHRRa0ZCVHl4TFFVRkpMRk5CUVZNc1VVRkJVeXhWUVVGVExFMUJRVXNzUzBGQlNUdEJRVUZCTzBGQlEyaEdMR3RDUVVGUk8wRkJRVUVzV1VGRFNqdEJRVUZCTEZsQlEwRTdRVUZCUVN4WlFVTkJMRk5CUVZNc1UwRkJVeXhYUVVGWExGRkJRVThzUzBGQlN5eEpRVUZKTEZOQlFWVXNUVUZCU3p0QlFVRkZMSEZDUVVGUExFdEJRVWs3UVVGQlFUdEJRVUZCTEZsQlEzcEZPMEZCUVVFN1FVRkJRVHRCUVVkU0xGbEJRVWtzVlVGQlZTeFRRVUZWTEU5QlFVODdRVUZETTBJc2RVSkJRV0U3UVVGRFlpeGxRVUZMTzBGQlFVRTdRVUZGVkN4WlFVRkpMRmxCUVZrN1FVRkJRVHRCUVVGQk8wRkJSM2hDTEhsQ1FVRnZRaXhMUVVGSk8wRkJRM0JDTEZWQlFVa3NVVUZCVVN4SlFVRkhMRTlCUVU4c1UwRkJVeXhKUVVGSExGRkJRVkVzVTBGQlVTeEpRVUZITEU5QlFVOHNWVUZCVlN4SlFVRkhMRk5CUVZNc1UwRkJVeXhKUVVGSE8wRkJRemxHTEdGQlFVOHNTVUZCU1N4UlFVRlJMRk5CUVZVc1UwRkJVeXhSUVVGUk8wRkJRekZETEd0Q1FVRlZMRXRCUVVzN1FVRkRaaXhaUVVGSkxGRkJRVkVzVDBGQlRTeFBRVUZQTEZGQlFWRXNUMEZCVFR0QlFVTjJReXhaUVVGSkxGRkJRVkVzVFVGQlRTeFpRVUZaTzBGQlF6bENMRmxCUVVrc1UwRkJVeXhOUVVGTkxHVkJRMllzVVVGRFFTeE5RVUZOTEUxQlFVMHNUVUZCVFR0QlFVTjBRaXhaUVVGSkxGbEJRVmtzVlVGRFdpeFRRVU5KTEdWQlEwRXNVMEZEU2l4VFFVTkpMR1ZCUTBFN1FVRkRVaXhaUVVGSkxFMUJRVTBzVlVGQlZTeERRVUZGTEc5Q1FVRnRRaXhWUVVOeVF5eFBRVUZQTEZkQlFWY3NaMEpCUVdkQ0xGRkJRVkVzWVVGRE1VTXNUMEZCVHl4alFVRmpMR2RDUVVGblFpeFJRVUZSTzBGQlEycEVMRmxCUVVrc1ZVRkJWU3h0UWtGQmJVSTdRVUZEYWtNc1dVRkJTU3haUVVGWkxFdEJRVXNzVTBGQlZTeEpRVUZKTzBGQlF5OUNMR05CUVVrc1UwRkJVeXhKUVVGSk8wRkJRMnBDTEdOQlFVa3NRMEZCUXl4UlFVRlJPMEZCUTFRc2IwSkJRVkU3UVVGRFVqdEJRVUZCTzBGQlJVb3NhVUpCUVU4c1VVRkJVU3hGUVVGRk8wRkJRMnBDTEdsQ1FVRlBMRTlCUVU4N1FVRkRaQ3hqUVVGSkxHdENRVUZyUWl4UFFVRlBMRk5CUVZNc1MwRkJTenRCUVVNelF5eGpRVUZKTERSQ1FVRTBRaXhQUVVGUE8wRkJRM1pETEdOQlFVazdRVUZEUVN4M1EwRkJORUlzTUVKQlFUQkNMRXRCUVVzN1FVRkRMMFFzWTBGQlNTeHBRa0ZCYVVJc1QwRkJUeXhSUVVGUkxFdEJRVXM3UVVGRGVrTXNZMEZCU1N3MFFrRkJORUlzVjBGQldUdEJRVUZGTEd0Q1FVRk5MRWxCUVVrc1RVRkJUVHRCUVVGQk8wRkJRemxFTEdOQlFVa3NlVUpCUVhsQ0xGZEJRVms3UVVGQlJTeHJRa0ZCVFN4SlFVRkpMRTFCUVUwN1FVRkJRVHRCUVVNelJDeHBRa0ZCVHl4UlFVRlJPMEZCUTJZc2FVSkJRVThzVDBGQlR5eFBRVUZQTEZkQlFWY3NUMEZCVHl4eFFrRkJjVUlzVDBGQlR5eFZRVUZWTzBGQlF6ZEZMR2xDUVVGUExFOUJRVThzUzBGQlN6dEJRVU51UWl4cFFrRkJUeXhQUVVGUExGZEJRVms3UVVGRGRFSXNaMEpCUVVrc1VVRkJVVHRCUVVOYUxHZENRVUZKTEZOQlFWTTdRVUZEWWl4dFFrRkJUeXhMUVVGTExFMUJRVTBzVjBGQldUdEJRVUZGTEhGQ1FVRlBMRmRCUVZjc1RVRkJUU3hoUVVGaExFMUJRVTA3UVVGQlFTeGxRVUZYTEV0QlFVc3NWMEZCV1R0QlFVRkZMSEZDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVVZ3U0N4cFFrRkJUeXhSUVVGUkxGTkJRVlVzVlVGQlZUdEJRVU12UWl4blFrRkJTU3h0UWtGQmJVSXNTVUZCU1N4UlFVRlJMRk5CUVZVc2EwSkJRV3RDTEdsQ1FVRnBRanRCUVVNMVJTeHBRMEZCYlVJc1MwRkJTenRCUVVONFFpeHJRa0ZCU1N4VlFVRlZMRzFDUVVGdFFqdEJRVU5xUXl4eFFrRkJUeXhQUVVGUE8wRkJRMlFzY1VKQlFVOHNUMEZCVHl4VFFVRlZMRTlCUVU4N1FVRkRNMElzZFVKQlFVOHNUMEZCVHl4UFFVRlBMRmRCUVZjc1QwRkJUeXh4UWtGQmNVSXNUMEZCVHl4VlFVRlZPMEZCUXpkRkxHbERRVUZwUWp0QlFVRkJPMEZCUVVFN1FVRkhla0lzWjBKQlFVa3NhMEpCUVd0Q0xGZEJRVms3UVVGRE9VSXNhMEpCUVVrc1NVRkJTU3hSUVVGUk8wRkJRMW9zYjBKQlFVazdRVUZEUVR0QlFVRkJMSGxDUVVWSExFdEJRVkE3UVVGRFNTeDVRa0ZCVHl4TFFVRkxPMEZCUVVFN1FVRkJRU3h4UWtGSFpqdEJRVU5FTEhWQ1FVRlBMRTlCUVU4N1FVRkRaQ3gxUWtGQlR5eFJRVUZSTEZkQlFWazdRVUZCUlN4M1FrRkJUU3hKUVVGSkxFMUJRVTA3UVVGQlFUdEJRVU0zUXl4MVFrRkJUenRCUVVGQk8wRkJRVUU3UVVGSFppeG5Ra0ZCU1N4WlFVRlpMRXRCUVVzc1UwRkJWU3hMUVVGSk8wRkJReTlDTEd0Q1FVRkpMRmxCUVZrN1FVRkRhRUk3UVVGQlFUdEJRVVZLTEcxQ1FVRlBMRmRCUVZjN1FVRkRiRUlzYlVKQlFVOHNjVUpCUVhGQ08wRkJRelZDTEcxQ1FVRlBMRlZCUVZVN1FVRkRha0k3UVVGRFFTeHRRa0ZCVHp0QlFVRkJPMEZCUlZnc2EwSkJRVkU3UVVGQlFTeFhRVU5VTzBGQlFVRTdRVUZCUVR0QlFVZFlMRzFDUVVGbExGbEJRVmM3UVVGRGRFSXNZVUZCVHl4VFFVRlZMRk5CUVZNN1FVRkRkRUlzWlVGQlR5eEpRVUZKTEZGQlFWRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRNVU1zYjBKQlFWVXNTMEZCU3p0QlFVTm1MR05CUVVrc1VVRkJVU3hSUVVGUkxFOUJRVThzVTBGQlV5eFJRVUZSTEZGQlFWRXNVVUZCVVN4UlFVRlJMRTlCUVU4c1UwRkJVU3hSUVVGUk8wRkJRek5HTEdOQlFVa3NhMEpCUVd0Q0xGVkJRVlVzVjBGQlZ5eFRRVUZaTzBGQlEzWkVMR05CUVVrc1VVRkJVU3hQUVVGTkxFOUJRVThzVVVGQlVTeFBRVUZOTzBGQlEzWkRMR05CUVVrc1VVRkJVU3hOUVVGTkxGbEJRVms3UVVGRE9VSXNZMEZCU1N4VFFVRlRMRTFCUVUwc1pVRkJaU3hSUVVGUkxFMUJRVTBzVFVGQlRTeE5RVUZOTzBGQlF6VkVMR05CUVVrc1kwRkJZeXhuUWtGQlowSTdRVUZEYkVNc1kwRkJTU3hWUVVGVk8wRkJRMVlzYlVKQlFVOHNVVUZCVVN4RFFVRkZMRkZCUVZFN1FVRkROMElzWTBGQlNTeFpRVUZYTzBGQlExZ3NaMEpCUVVrc1RVRkJUU3hUUVVOT0xFOUJRVThzVDBGQlR5eGhRVUZoTEcxQ1FVTXpRaXhQUVVGUExGZEJRVmNzWVVGQllUdEJRVU51UXl4blFrRkJTU3haUVVGWkxGTkJRVlVzVDBGQlR6dEJRVUZGTEhGQ1FVRlBMRkZCUVZFc1EwRkJSU3hSUVVGUkxFMUJRVTBzVDBGQlR6dEJRVUZCTzBGQlEzcEZMR2RDUVVGSkxGVkJRVlVzYlVKQlFXMUNPMEZCUVVFc2FVSkJSV2hETzBGQlEwUXNaMEpCUVVrc1ZVRkJWVHRCUVVOa0xHZENRVUZKTEZGQlFWRXNWVUZCVlN4RFFVRkZMRzlDUVVGdFFpeFZRVU4yUXl4UFFVRlBMRmRCUVZjc1pVRkRiRUlzVDBGQlR5eGpRVUZqTzBGQlEzcENMR2RDUVVGSkxGZEJRVmM3UVVGRFppeHJRa0ZCVFN4WlFVRlpMRk5CUVZVc1QwRkJUenRCUVVNdlFpeHJRa0ZCU1N4VFFVRlRMRTFCUVUwN1FVRkRia0lzYTBKQlFVa3NRMEZCUXp0QlFVTkVMSFZDUVVGUExGRkJRVkVzUTBGQlJTeFJRVUZSTzBGQlF6ZENMSFZDUVVGVExFdEJRVXNzVTBGQlV5eFBRVUZQTEZGQlFWRXNUMEZCVHp0QlFVTTNReXhyUWtGQlNTeEZRVUZGTEZsQlFWazdRVUZEWkN4MVFrRkJUeXhSUVVGUkxFTkJRVVVzVVVGQlVUdEJRVU0zUWl4eFFrRkJUenRCUVVGQk8wRkJSVmdzYTBKQlFVMHNWVUZCVlN4dFFrRkJiVUk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVdHVSQ3hYUVVGUE8wRkJRVUVzVFVGRFNDeE5RVUZOTzBGQlFVRXNUVUZEVGl4UlFVRlJPMEZCUVVFc1RVRkRVanRCUVVGQkxFMUJRMEVzVTBGQlV5eFRRVUZWTEV0QlFVazdRVUZEYmtJc1dVRkJTU3hSUVVGUkxFbEJRVWNzVDBGQlR5eFJRVUZQTEVsQlFVYzdRVUZEYUVNc1pVRkJUeXhKUVVGSkxGRkJRVkVzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZETVVNc2IwSkJRVlVzUzBGQlN6dEJRVU5tTEdOQlFVa3NVVUZCVVN4TlFVRk5MRmxCUVZrN1FVRkRPVUlzWTBGQlNTeFRRVUZUTEUxQlFVczdRVUZEYkVJc1kwRkJTU3hUUVVGVExFbEJRVWtzVFVGQlRUdEJRVU4yUWl4alFVRkpMRmRCUVZjN1FVRkRaaXhqUVVGSkxHZENRVUZuUWp0QlFVTndRaXhqUVVGSk8wRkJRMG9zWTBGQlNTeHBRa0ZCYVVJc1UwRkJWU3hQUVVGUE8wRkJRMnhETEdkQ1FVRkpMRTlCUVUwc1RVRkJUVHRCUVVOb1FpeG5Ra0ZCU3l4UlFVRlBMRXRCUVVrc1VVRkJVU3hMUVVGSkxGZEJRVmM3UVVGRGJrTTdRVUZEU2l4blFrRkJTU3hGUVVGRkxHdENRVUZyUWp0QlFVTndRaXh6UWtGQlVUdEJRVUZCTzBGQlJXaENMR05CUVVrc1pVRkJaU3h0UWtGQmJVSTdRVUZEZEVNc2JVSkJRVk1zU1VGQlNTeEhRVUZITEVsQlFVa3NVVUZCVVN4RlFVRkZMRWRCUVVjN1FVRkROMElzWjBKQlFVa3NUVUZCVFN4TlFVRkxPMEZCUTJZc1owSkJRVWtzVDBGQlR5eE5RVUZOTzBGQlEySXNiMEpCUVUwc1RVRkJUU3hKUVVGSkxFMUJRVXM3UVVGRGNrSXNhMEpCUVVrc1QwRkJUenRCUVVOWUxHdENRVUZKTEZsQlFWazdRVUZEYUVJc2EwSkJRVWtzVlVGQlZUdEJRVU5rTEdkQ1FVRkZPMEZCUVVFN1FVRkJRVHRCUVVkV0xHTkJRVWtzWVVGQllUdEJRVU5pTEc5Q1FVRlJPMEZCUVVFN1FVRkJRVHRCUVVGQkxFMUJSM0JDTEV0QlFVc3NVMEZCVlN4TFFVRkpPMEZCUTJZc1dVRkJTU3hSUVVGUkxFbEJRVWNzVDBGQlR5eE5RVUZOTEVsQlFVYzdRVUZETDBJc1pVRkJUeXhKUVVGSkxGRkJRVkVzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZETVVNc2IwSkJRVlVzUzBGQlN6dEJRVU5tTEdOQlFVa3NVVUZCVVN4TlFVRk5MRmxCUVZrN1FVRkRPVUlzWTBGQlNTeE5RVUZOTEUxQlFVMHNTVUZCU1R0QlFVTndRaXhqUVVGSkxGbEJRVmtzVTBGQlZTeFBRVUZQTzBGQlFVVXNiVUpCUVU4c1VVRkJVU3hOUVVGTkxFOUJRVTg3UVVGQlFUdEJRVU12UkN4alFVRkpMRlZCUVZVc2JVSkJRVzFDTzBGQlFVRTdRVUZCUVR0QlFVRkJMRTFCUjNwRExFOUJRVThzVFVGQlRUdEJRVUZCTEUxQlEySXNXVUZCV1R0QlFVRkJMRTFCUTFvc1QwRkJUeXhUUVVGVkxFdEJRVWs3UVVGRGFrSXNXVUZCU1N4VFFVRlJMRWxCUVVjc1QwRkJUeXhSUVVGUkxFbEJRVWM3UVVGRGFrTXNXVUZCU1N4UlFVRlJMRTlCUVUwc1QwRkJUeXhSUVVGUkxFOUJRVTA3UVVGRGRrTXNaVUZCVHl4SlFVRkpMRkZCUVZFc1UwRkJWU3hUUVVGVExGRkJRVkU3UVVGRE1VTXNZMEZCU1N4UlFVRlJMRTFCUVUwc1dVRkJXVHRCUVVNNVFpeGpRVUZKTEZOQlFWTXNUVUZCVFN4bFFVRmxMRkZCUVZFc1RVRkJUU3hOUVVGTkxFMUJRVTA3UVVGRE5VUXNZMEZCU1N4alFVRmpMR2RDUVVGblFqdEJRVU5zUXl4alFVRkpMRTFCUVUwc1kwRkJZeXhQUVVGUExFMUJRVTBzWlVGQlpTeFBRVUZQTzBGQlF6TkVMR05CUVVrc1dVRkJXU3hMUVVGTExGTkJRVlVzU1VGQlNUdEJRVUZGTEcxQ1FVRlBMRkZCUVZFc1IwRkJSeXhQUVVGUE8wRkJRVUU3UVVGRE9VUXNZMEZCU1N4VlFVRlZMRzFDUVVGdFFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUzJwRUxFMUJRVWtzVFVGQlN5eGpRVUZqTEVsQlFVa3NWMEZCVnl4VFFVRlRMRWxCUVVjc1VVRkJVU3haUVVGWkxFbEJRVWM3UVVGRGVrVXNUVUZCU1N4VFFVRlRMRTlCUVU4c1QwRkJUeXhKUVVGSkxGTkJRVlVzWVVGQllUdEJRVUZGTEZkQlFVOHNhMEpCUVd0Q08wRkJRVUU3UVVGRGFrWXNUVUZCU1N4WFFVRlhPMEZCUTJZc1UwRkJUeXhSUVVGUkxGTkJRVlVzVDBGQlR6dEJRVUZGTEZkQlFVOHNVMEZCVXl4TlFVRk5MRkZCUVZFN1FVRkJRVHRCUVVOb1JTeFRRVUZQTzBGQlFVRXNTVUZEU0N4UFFVRlBPMEZCUVVFc1NVRkRVQ3hoUVVGaExFZEJRVWNzV1VGQldTeExRVUZMTzBGQlFVRXNTVUZEYWtNc1QwRkJUeXhUUVVGVkxFMUJRVTA3UVVGRGJrSXNWVUZCU1N4VFFVRlRMRk5CUVZNN1FVRkRkRUlzVlVGQlNTeERRVUZETzBGQlEwUXNZMEZCVFN4SlFVRkpMRTFCUVUwc1dVRkJXU3hQUVVGUE8wRkJRM1pETEdGQlFVOHNVMEZCVXp0QlFVRkJPMEZCUVVFc1NVRkZjRUlzUzBGQlN6dEJRVUZCTEVsQlEwd3NVMEZCVXp0QlFVRkJMRWxCUTFRc1UwRkJVeXhWUVVGVk8wRkJRVUVzU1VGRGJrSTdRVUZCUVR0QlFVRkJPMEZCU1ZJc0swSkJRU3RDTEZkQlFWY3NZVUZCWVR0QlFVTnVSQ3hUUVVGUExGbEJRVmtzVDBGQlR5eFRRVUZWTEUxQlFVMHNTMEZCU1R0QlFVTXhReXhSUVVGSkxGTkJRVk1zU1VGQlJ6dEJRVU5vUWl4WFFVRlJMRk5CUVZNc1UwRkJVeXhKUVVGSkxFOUJRVThzVDBGQlR6dEJRVUZCTEV0QlF6ZERPMEZCUVVFN1FVRkZVQ3huUTBGQlowTXNZVUZCWVN4UFFVRlBMRXRCUVVrc1ZVRkJWVHRCUVVNNVJDeE5RVUZKTEdOQlFXTXNTVUZCUnl4aFFVRmhMRmxCUVZrc1NVRkJSenRCUVVOcVJDeE5RVUZKTEZOQlFWTXNjMEpCUVhOQ0xHRkJRV0VzVDBGQlR5eFhRVUZYTEdGQlFXRXNWMEZCVnl4WlFVRlpPMEZCUTNSSExGTkJRVTg3UVVGQlFTeEpRVU5JTzBGQlFVRTdRVUZCUVR0QlFVZFNMR3REUVVGclF5eEpRVUZKTEZWQlFWVTdRVUZETlVNc1RVRkJTU3hSUVVGUkxGTkJRVk03UVVGRGNrSXNUVUZCU1N4VFFVRlRMSFZDUVVGMVFpeEhRVUZITEdOQlFXTXNUMEZCVHl4SFFVRkhMRTlCUVU4N1FVRkRkRVVzUzBGQlJ5eFBRVUZQTEU5QlFVODdRVUZEYWtJc1MwRkJSeXhQUVVGUExGRkJRVkVzVTBGQlZTeFBRVUZQTzBGQlF5OUNMRkZCUVVrc1dVRkJXU3hOUVVGTk8wRkJRM1JDTEZGQlFVa3NSMEZCUnl4TFFVRkxMRTlCUVU4c1QwRkJUeXhMUVVGTExGTkJRVlVzUzBGQlN6dEJRVUZGTEdGQlFVOHNTVUZCU1N4VFFVRlRPMEZCUVVFc1VVRkJaVHRCUVVNdlJTeFpRVUZOTEU5QlFVOHNSMEZCUnl4TFFVRkxMRTFCUVUwN1FVRkRNMElzVlVGQlNTeEhRVUZITEhOQ1FVRnpRaXhIUVVGSExFOUJRVTg3UVVGRGJrTXNWMEZCUnl4WFFVRlhMRTlCUVU4c1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlRUTkRMSFZDUVVGMVFpeEpRVUZKTEUxQlFVMHNXVUZCV1N4VlFVRlZPMEZCUTI1RUxHRkJRVmNzVVVGQlVTeFRRVUZWTEZkQlFWYzdRVUZEY0VNc1VVRkJTU3hUUVVGVExGTkJRVk03UVVGRGRFSXNVMEZCU3l4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVONFFpeFZRVUZKTEZkQlFWY3NjMEpCUVhOQ0xFdEJRVXM3UVVGRE1VTXNWVUZCU1N4RFFVRkRMRmxCUVdFc1YwRkJWeXhaUVVGWkxGTkJRVk1zVlVGQlZTeFJRVUZaTzBGQlEzQkZMRmxCUVVrc1VVRkJVU3hIUVVGSExGbEJRVmtzWVVGQllTeGxRVUZsTEVkQlFVY3NZVUZCWVR0QlFVTnVSU3hyUWtGQlVTeExRVUZMTEZkQlFWYzdRVUZCUVN4WlFVTndRaXhMUVVGTExGZEJRVms3UVVGQlJTeHhRa0ZCVHl4TFFVRkxMRTFCUVUwN1FVRkJRVHRCUVVGQkxGbEJRM0pETEV0QlFVc3NVMEZCVlN4UFFVRlBPMEZCUTJ4Q0xEWkNRVUZsTEUxQlFVMHNWMEZCVnl4RFFVRkZMRTlCUVdNc1ZVRkJWU3hOUVVGTkxHTkJRV01zVFVGQlRTeFpRVUZaTzBGQlFVRTdRVUZCUVR0QlFVRkJMR1ZCU1haSE8wRkJRMFFzWTBGQlNTeGhRVUZoTEVsQlFVa3NSMEZCUnl4TlFVRk5MRmRCUVZjN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlRUZEVMSGxDUVVGNVFpeEpRVUZKTEUxQlFVMDdRVUZETDBJc1QwRkJTeXhSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVU40UWl4aFFVRlRMRTlCUVU4c1MwRkJTenRCUVVOcVFpeFZRVUZKTEVsQlFVa3NaMEpCUVdkQ0xFZEJRVWM3UVVGRGRrSXNaVUZCVHl4SlFVRkpPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTVE5DTERKQ1FVRXlRaXhIUVVGSExFZEJRVWM3UVVGRE4wSXNVMEZCVHl4RlFVRkZMRXRCUVVzc1ZVRkJWU3hGUVVGRkxFdEJRVXM3UVVGQlFUdEJRVVZ1UXl4elFrRkJjMElzU1VGQlNTeFpRVUZaTEdsQ1FVRnBRaXhSUVVGUk8wRkJRek5FTEUxQlFVa3NaVUZCWlN4SFFVRkhPMEZCUTNSQ0xFMUJRVWtzVVVGQlVTeEhRVUZITEcxQ1FVRnRRaXhoUVVGaExFZEJRVWNzWVVGQllUdEJRVU12UkN4UlFVRk5MRTlCUVU4N1FVRkRZaXhSUVVGTkxGbEJRVmtzVFVGQlRUdEJRVU40UWl4TlFVRkpMRzlDUVVGdlFpeE5RVUZOTEZGQlFWRXNTMEZCU3p0QlFVTXpReXhOUVVGSkxGbEJRVmtzU1VGQlNTeGhRVUZoTzBGQlEycERMRmRCUVZNc1YwRkJXVHRCUVVOcVFpeFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRmxCUVZrN1FVRkRhRUlzVVVGQlNTeGxRVUZsTEVkQlFVYzdRVUZEYkVJc1YwRkJTeXhqUVVGakxGRkJRVkVzVTBGQlZTeFhRVUZYTzBGQlF6VkRMRzlDUVVGWkxHbENRVUZwUWl4WFFVRlhMR0ZCUVdFc1YwRkJWeXhUUVVGVExHRkJRV0VzVjBGQlZ6dEJRVUZCTzBGQlJYSkhMQ3RDUVVGNVFpeEpRVUZKTzBGQlF6ZENMRzFDUVVGaExFOUJRVThzVjBGQldUdEJRVUZGTEdWQlFVOHNSMEZCUnl4SFFVRkhMRk5CUVZNc1MwRkJTenRCUVVGQkxGTkJRVmNzVFVGQlRUdEJRVUZCTzBGQlJ6bEZMRFpDUVVGMVFpeEpRVUZKTEZsQlFWa3NUMEZCVHl4cFFrRkJhVUlzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZIYWtZc1owTkJRV2RETEVsQlFVa3NXVUZCV1N4UFFVRlBMR2xDUVVGcFFqdEJRVU53UlN4TlFVRkpMRkZCUVZFN1FVRkRXaXhOUVVGSkxGZEJRVmNzUjBGQlJ6dEJRVU5zUWl4TlFVRkpMR1ZCUVdVc1IwRkJSeXhaUVVGWkxHdENRVUZyUWl4SlFVRkpMRWRCUVVjc1QwRkJUenRCUVVOc1JTeE5RVUZKTERKQ1FVRXlRanRCUVVNdlFpeE5RVUZKTEZsQlFWa3NVMEZCVXl4UFFVRlBMRk5CUVZVc1IwRkJSenRCUVVGRkxGZEJRVThzUlVGQlJTeExRVUZMTEZkQlFWYzdRVUZCUVR0QlFVTjRSU3haUVVGVkxGRkJRVkVzVTBGQlZTeFRRVUZUTzBGQlEycERMRlZCUVUwc1MwRkJTeXhYUVVGWk8wRkJRMjVDTEZWQlFVa3NXVUZCV1R0QlFVTm9RaXhWUVVGSkxGbEJRVmtzVVVGQlVTeExRVUZMTzBGQlF6ZENMR2xEUVVFeVFpeEpRVUZKTEZkQlFWYzdRVUZETVVNc2FVTkJRVEpDTEVsQlFVa3NWMEZCVnp0QlFVTXhReXh4UWtGQlpTeEhRVUZITEZsQlFWazdRVUZET1VJc1ZVRkJTU3hQUVVGUExHTkJRV01zVjBGQlZ6dEJRVU53UXl4WFFVRkxMRWxCUVVrc1VVRkJVU3hUUVVGVkxFOUJRVTg3UVVGRE9VSXNiMEpCUVZrc2FVSkJRV2xDTEUxQlFVMHNTVUZCU1N4TlFVRk5MRWRCUVVjc1UwRkJVeXhOUVVGTkxFZEJRVWM3UVVGQlFUdEJRVVYwUlN4WFFVRkxMRTlCUVU4c1VVRkJVU3hUUVVGVkxGRkJRVkU3UVVGRGJFTXNXVUZCU1N4UFFVRlBMRlZCUVZVN1FVRkRha0lzWjBKQlFVMHNTVUZCU1N4WFFVRlhMRkZCUVZFN1FVRkJRU3hsUVVVMVFqdEJRVU5FTEdOQlFVa3NWVUZCVlN4blFrRkJaMElzV1VGQldTeFBRVUZQTzBGQlEycEVMR2xDUVVGUExFbEJRVWtzVVVGQlVTeFRRVUZWTEV0QlFVczdRVUZCUlN4dFFrRkJUeXhUUVVGVExGTkJRVk03UVVGQlFUdEJRVU0zUkN4cFFrRkJUeXhQUVVGUExGRkJRVkVzVTBGQlZTeExRVUZMTzBGQlEycERMRzlDUVVGUkxGbEJRVmtzU1VGQlNUdEJRVU40UWl4eFFrRkJVeXhUUVVGVE8wRkJRVUU3UVVGRmRFSXNhVUpCUVU4c1NVRkJTU3hSUVVGUkxGTkJRVlVzVTBGQlV6dEJRVUZGTEcxQ1FVRlBMRkZCUVZFc1dVRkJXVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWN6UlN4VlFVRkpMR2xDUVVGcFFpeFJRVUZSTEV0QlFVczdRVUZEYkVNc1ZVRkJTU3hyUWtGQmEwSXNVVUZCVVN4TFFVRkxMRlZCUVZVc1dVRkJXVHRCUVVOeVJDeHBRMEZCZVVJc1NVRkJTVHRCUVVNM1FpeGpRVUZOTEd0Q1FVRnJRanRCUVVONFFpeHRRMEZCTWtJN1FVRkRNMElzV1VGQlNTeHJRa0ZCYTBJc1lVRkJZVHRCUVVOdVF5eGhRVUZMTEVsQlFVa3NVVUZCVVN4VFFVRlZMRTlCUVU4N1FVRkRPVUlzTUVKQlFXZENMRk5CUVZNc1ZVRkJWVHRCUVVGQk8wRkJSWFpETEhkQ1FVRm5RaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eFpRVUZaTzBGQlEzQkRMSE5DUVVGakxFbEJRVWtzUTBGQlF5eEhRVUZITEZsQlFWa3NXVUZCV1N4TFFVRkxMR3RDUVVGclFqdEJRVU55UlN4alFVRk5MRk5CUVZNN1FVRkRaaXhaUVVGSkxEQkNRVUV3UWl4blFrRkJaMEk3UVVGRE9VTXNXVUZCU1N4NVFrRkJlVUk3UVVGRGVrSTdRVUZCUVR0QlFVVktMRmxCUVVrN1FVRkRTaXhaUVVGSkxHdENRVUZyUWl4aFFVRmhMRTlCUVU4c1YwRkJXVHRCUVVOc1JDd3dRa0ZCWjBJc1pVRkJaVHRCUVVNdlFpeGpRVUZKTEdWQlFXVTdRVUZEWml4blFrRkJTU3g1UWtGQmVVSTdRVUZEZWtJc2EwSkJRVWtzWTBGQll5eDNRa0ZCZDBJc1MwRkJTeXhOUVVGTk8wRkJRM0pFTERSQ1FVRmpMRXRCUVVzc1lVRkJZVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWsxUXl4bFFVRlJMR2xDUVVGcFFpeFBRVUZQTEdOQlFXTXNVMEZCVXl4aFFVTnVSQ3hoUVVGaExGRkJRVkVzYVVKQlFXbENMR2RDUVVGblFpeExRVUZMTEZkQlFWazdRVUZCUlN4cFFrRkJUenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWMxUml4VlFVRk5MRXRCUVVzc1UwRkJWU3hWUVVGVk8wRkJRek5DTEZWQlFVa3NRMEZCUXl3MFFrRkJORUlzUTBGQlF5d3lRa0ZCTWtJN1FVRkRla1FzV1VGQlNTeFpRVUZaTEZGQlFWRXNTMEZCU3p0QlFVTTNRaXcwUWtGQmIwSXNWMEZCVnp0QlFVRkJPMEZCUlc1RExITkNRVUZuUWl4SlFVRkpMRU5CUVVNc1IwRkJSeXhaUVVGWk8wRkJRM0JETEc5Q1FVRmpMRWxCUVVrc1EwRkJReXhIUVVGSExGbEJRVmtzV1VGQldTeEhRVUZITEdGQlFXRXNSMEZCUnp0QlFVTnFSU3haUVVGTkxGTkJRVk1zUjBGQlJ6dEJRVUZCTzBGQlFVRTdRVUZITVVJc2MwSkJRVzlDTzBGQlEyaENMRmRCUVU4c1RVRkJUU3hUUVVGVExHRkJRV0VzVVVGQlVTeE5RVUZOTEZGQlFWRXNUVUZCVFN4WFFVRlhMRXRCUVVzc1dVRkRNMFVzWVVGQllUdEJRVUZCTzBGQlJYSkNMRk5CUVU4c1YwRkJWeXhMUVVGTExGZEJRVms3UVVGREwwSXNkMEpCUVc5Q0xHTkJRV003UVVGQlFUdEJRVUZCTzBGQlJ6RkRMSFZDUVVGMVFpeFhRVUZYTEZkQlFWYzdRVUZEZWtNc1RVRkJTU3hQUVVGUE8wRkJRVUVzU1VGRFVDeExRVUZMTzBGQlFVRXNTVUZEVEN4TFFVRkxPMEZCUVVFc1NVRkRUQ3hSUVVGUk8wRkJRVUU3UVVGRldpeE5RVUZKTzBGQlEwb3NUMEZCU3l4VFFVRlRMRmRCUVZjN1FVRkRja0lzVVVGQlNTeERRVUZETEZWQlFWVTdRVUZEV0N4WFFVRkxMRWxCUVVrc1MwRkJTenRCUVVGQk8wRkJSWFJDTEU5QlFVc3NVMEZCVXl4WFFVRlhPMEZCUTNKQ0xGRkJRVWtzVTBGQlV5eFZRVUZWTEZGQlFWRXNVMEZCVXl4VlFVRlZPMEZCUTJ4RUxGRkJRVWtzUTBGQlF5eFJRVUZSTzBGQlExUXNWMEZCU3l4SlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUE8wRkJRVUVzVjBGRmNrSTdRVUZEUkN4VlFVRkpMRk5CUVZNN1FVRkJRU3hSUVVOVUxFMUJRVTA3UVVGQlFTeFJRVU5PTEV0QlFVczdRVUZCUVN4UlFVTk1MRlZCUVZVN1FVRkJRU3hSUVVOV0xFdEJRVXM3UVVGQlFTeFJRVU5NTEV0QlFVczdRVUZCUVN4UlFVTk1MRkZCUVZFN1FVRkJRVHRCUVVWYUxGVkJRMEVzUzBGQlRTeFJRVUZQTEZGQlFWRXNWMEZCVnl4UlFVRlZMRXRCUVUwc1VVRkJUeXhSUVVGUkxGZEJRVmNzVDBGRGNrVXNUMEZCVHl4UlFVRlJMRk5CUVZNc1QwRkJUeXhSUVVGUkxGRkJRVkVzUTBGQlF5eFpRVU53UkR0QlFVTkhMR1ZCUVU4c1YwRkJWenRCUVVOc1FpeGhRVUZMTEU5QlFVOHNTMEZCU3p0QlFVRkJMR0ZCUldoQ08wRkJRMFFzV1VGQlNTeGhRVUZoTEU5QlFVODdRVUZEZUVJc1dVRkJTU3hoUVVGaExFOUJRVTg3UVVGRGVFSXNXVUZCU1N4VlFVRlZPMEZCUTJRc1lVRkJTeXhYUVVGWExGbEJRVms3UVVGRGVFSXNZMEZCU1N4RFFVRkRMRmRCUVZjN1FVRkRXaXh0UWtGQlR5eEpRVUZKTEV0QlFVczdRVUZCUVR0QlFVVjRRaXhoUVVGTExGZEJRVmNzV1VGQldUdEJRVU40UWl4alFVRkpMRk5CUVZNc1YwRkJWeXhWUVVGVkxGTkJRVk1zVjBGQlZ6dEJRVU4wUkN4alFVRkpMRU5CUVVNN1FVRkRSQ3h0UWtGQlR5eEpRVUZKTEV0QlFVczdRVUZCUVN4dFFrRkRXQ3hQUVVGUExGRkJRVkVzVDBGQlR6dEJRVU16UWl4dFFrRkJUeXhQUVVGUExFdEJRVXM3UVVGQlFUdEJRVVV6UWl4WlFVRkpMRTlCUVU4c1NVRkJTU3hUUVVGVExFdEJRVXNzVDBGQlR5eEpRVUZKTEZOQlFWTXNTMEZCU3l4UFFVRlBMRTlCUVU4c1UwRkJVeXhIUVVGSE8wRkJRelZGTEdWQlFVc3NUMEZCVHl4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTGFrTXNVMEZCVHp0QlFVRkJPMEZCUlZnc2NVSkJRWEZDTEZWQlFWVXNWMEZCVnl4VFFVRlRMRk5CUVZNN1FVRkRlRVFzVFVGQlNTeFJRVUZSTEZOQlFWTXNSMEZCUnl4clFrRkJhMElzVjBGQlZ5eFJRVUZSTEZWQlEzcEVMRU5CUVVVc1UwRkJVeXhSUVVGUkxGTkJRVk1zWlVGQlpTeFJRVUZSTEZGQlEyNUVMRU5CUVVVc1pVRkJaU3hSUVVGUk8wRkJRemRDTEZWQlFWRXNVVUZCVVN4VFFVRlZMRXRCUVVzN1FVRkJSU3hYUVVGUExGTkJRVk1zVDBGQlR6dEJRVUZCTzBGQlEzaEVMRk5CUVU4N1FVRkJRVHRCUVVWWUxEWkNRVUUyUWl4WFFVRlhMRlZCUVZVN1FVRkRPVU1zVDBGQlN5eFhRVUZYTEZGQlFWRXNVMEZCVlN4WFFVRlhPMEZCUTNwRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NhVUpCUVdsQ0xGTkJRVk1zV1VGQldUdEJRVU51UkN4clFrRkJXU3hWUVVGVkxGZEJRVmNzVlVGQlZTeFhRVUZYTEZOQlFWTXNWVUZCVlN4WFFVRlhPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTV2hITERaQ1FVRTJRaXhYUVVGWExGVkJRVlU3UVVGRE9VTXNWMEZCVXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hUUVVGVExFZEJRVWNzYVVKQlFXbENMRkZCUVZFc1JVRkJSU3hIUVVGSE8wRkJRekZFTEZGQlFVa3NXVUZCV1N4VFFVRlRMRWRCUVVjc2FVSkJRV2xDTzBGQlF6ZERMRkZCUVVrc1ZVRkJWU3hqUVVGakxFMUJRVTA3UVVGRE9VSXNaVUZCVXl4SFFVRkhMR3RDUVVGclFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVa3hReXhyUWtGQmEwSXNUMEZCVHl4TFFVRkxPMEZCUXpGQ0xGRkJRVTBzV1VGQldTeEpRVUZKTEUxQlFVMHNTVUZCU1N4VFFVRlRMRU5CUVVVc1VVRkJVU3hKUVVGSkxGRkJRVkVzV1VGQldTeEpRVUZKTzBGQlFVRTdRVUZGYmtZc01rSkJRVEpDTEVsQlFVa3NUMEZCVHl4VlFVRlZPMEZCUXpWRExFMUJRVWtzWlVGQlpUdEJRVU51UWl4TlFVRkpMR1ZCUVdVc1RVRkJUU3hOUVVGTkxHdENRVUZyUWp0QlFVTnFSQ3hsUVVGaExGRkJRVkVzVTBGQlZTeFhRVUZYTzBGQlEzUkRMRkZCUVVrc1VVRkJVU3hUUVVGVExGbEJRVms3UVVGRGFrTXNVVUZCU1N4VlFVRlZMRTFCUVUwN1FVRkRjRUlzVVVGQlNTeFZRVUZWTEdkQ1FVRm5RaXhuUWtGQlowSXNWVUZCVlN4WFFVRlhMRWxCUVVrc1QwRkJUeXhQUVVGUExFTkJRVU1zUTBGQlF5eE5RVUZOTEdWQlFXVXNWMEZCVnl4UFFVRlBMRmxCUVZrc1ZVRkJWVHRCUVVOd1NpeFJRVUZKTEZWQlFWVTdRVUZEWkN4aFFVRlRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFMUJRVTBzVjBGQlZ5eFJRVUZSTEVWQlFVVXNSMEZCUnp0QlFVTTVReXhWUVVGSkxGZEJRVmNzVFVGQlRTeE5RVUZOTEUxQlFVMHNWMEZCVnp0QlFVTTFReXhuUWtGQlZTeFRRVUZUTzBGQlEyNUNMRlZCUVVrc1VVRkJVU3huUWtGQlowSXNVMEZCVXl4TlFVRk5MRk5CUVZNc1EwRkJReXhEUVVGRExGTkJRVk1zVVVGQlVTeERRVUZETEVOQlFVTXNVMEZCVXl4WlFVRlpMRTlCUVU4c1YwRkJWeXhQUVVGUExGbEJRVmtzVlVGQlZUdEJRVU0zU1N4alFVRlJMRXRCUVVzN1FVRkJRVHRCUVVWcVFpeHBRa0ZCWVN4aFFVRmhMR3RDUVVGclFpeFhRVUZYTEZOQlFWTTdRVUZCUVR0QlFVVndSU3hUUVVGUE8wRkJRVUU3UVVGRldDd3dRa0ZCTUVJc1NVRkJTU3hQUVVGUExGVkJRVlU3UVVGRE0wTXNTMEZCUnl4UlFVRlJMRTFCUVUwc1ZVRkJWVHRCUVVNelFpeE5RVUZKTEdWQlFXVXNSMEZCUnl4WlFVRlpMR3RDUVVGclFpeEpRVUZKTEU5QlFVODdRVUZETDBRc1MwRkJSeXhqUVVGakxFMUJRVTBzVFVGQlRTeHJRa0ZCYTBJN1FVRkRMME1zWjBKQlFXTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1lVRkJZU3hMUVVGTExHVkJRV1U3UVVGQlFUdEJRVVV6UkN3clFrRkJLMElzU1VGQlNTeFZRVUZWTzBGQlEzcERMRTFCUVVrc2EwSkJRV3RDTEd0Q1FVRnJRaXhKUVVGSkxFZEJRVWNzVDBGQlR6dEJRVU4wUkN4TlFVRkpMRTlCUVU4c1kwRkJZeXhwUWtGQmFVSXNSMEZCUnp0QlFVTTNReXhUUVVGUExFTkJRVVVzVFVGQlN5eEpRVUZKTEZWQlFWVXNTMEZCU3l4UFFVRlBMRXRCUVVzc1UwRkJWU3hKUVVGSk8wRkJRVVVzVjBGQlR5eEhRVUZITEVsQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4N1FVRkJRVHRCUVVGQk8wRkJSVzVITEc5RFFVRnZReXhKUVVGSkxGRkJRVkVzVlVGQlZUdEJRVU4wUkN4TlFVRkpMR0ZCUVdFc1UwRkJVeXhIUVVGSE8wRkJRemRDTEZkQlFWTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1YwRkJWeXhSUVVGUkxFVkJRVVVzUjBGQlJ6dEJRVU40UXl4UlFVRkpMRmxCUVZrc1YwRkJWenRCUVVNelFpeFJRVUZKTEZGQlFWRXNVMEZCVXl4WlFVRlpPMEZCUTJwRExFOUJRVWNzWVVGQllTeFpRVUZaTzBGQlF6VkNMR0ZCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzVFVGQlRTeFhRVUZYTEZGQlFWRXNSVUZCUlN4SFFVRkhPMEZCUXpsRExGVkJRVWtzV1VGQldTeE5RVUZOTEZkQlFWYzdRVUZEYWtNc1ZVRkJTU3hWUVVGVkxFMUJRVTBzVFVGQlRTeFhRVUZYTzBGQlEzSkRMRlZCUVVrc1dVRkJXU3hQUVVGUExGbEJRVmtzVjBGQlZ5eFZRVUZWTEUxQlFVMHNUVUZCVFN4VFFVRlRMRXRCUVVzc1QwRkJUenRCUVVONlJpeFZRVUZKTEU5QlFVOHNXVUZCV1R0QlFVTnVRaXhaUVVGSkxGbEJRVmtzVDBGQlR5eFhRVUZYTEZWQlFWVTdRVUZETlVNc1dVRkJTU3hYUVVGWE8wRkJRMWdzYjBKQlFWVXNUMEZCVHp0QlFVTnFRaXhwUWtGQlR5eFBRVUZQTEZkQlFWY3NWVUZCVlR0QlFVTnVReXhwUWtGQlR5eFhRVUZYTEZWQlFWVXNZVUZCWVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTM3BFTEUxQlFVa3NUMEZCVHl4alFVRmpMR1ZCUVdVc1UwRkJVeXhMUVVGTExGVkJRVlVzWTBGRE5VUXNRMEZCUXl4dlFrRkJiMElzUzBGQlN5eFZRVUZWTEdOQlEzQkRMRkZCUVZFc2NVSkJRWEZDTEcxQ1FVRnRRaXhSUVVGUkxIRkNRVU40UkN4SFFVRkhMRTlCUVU4c1ZVRkJWU3hWUVVGVkxFMUJRVTBzYTBKQlFXdENMRXRCUVVzc1MwRkJTenRCUVVOb1JTeFBRVUZITEdGQlFXRTdRVUZCUVR0QlFVRkJPMEZCUjNoQ0xEQkNRVUV3UWl4dFFrRkJiVUk3UVVGRGVrTXNVMEZCVHl4clFrRkJhMElzVFVGQlRTeExRVUZMTEVsQlFVa3NVMEZCVlN4UFFVRlBMRlZCUVZVN1FVRkRMMFFzV1VGQlVTeE5RVUZOTzBGQlEyUXNVVUZCU1N4UFFVRlBMRTFCUVUwc1VVRkJVU3huUWtGQlowSTdRVUZEZWtNc1VVRkJTU3hWUVVGVkxFMUJRVTBzUzBGQlN5eFJRVUZSTEV0QlFVc3NUVUZCVFN4alFVRmpMRWRCUVVjc1RVRkJUU3hQUVVGUE8wRkJRekZGTEZkQlFVOHNaMEpCUVdkQ0xFMUJRVTBzVjBGQlZ5eE5RVUZOTEV0QlFVc3NTMEZCU3l4UlFVRlJMRXRCUVVzc1MwRkJTeXhSUVVGUkxFOUJRVThzUzBGQlN5eFJRVUZSTEZGQlFWRXNWVUZCVlN4aFFVRmhPMEZCUVVFN1FVRkJRVHRCUVVrM1NTeEpRVUZKTEZWQlFWa3NWMEZCV1R0QlFVTjRRaXh6UWtGQmJVSTdRVUZCUVR0QlFVVnVRaXhYUVVGUkxGVkJRVlVzYlVKQlFXMUNMRk5CUVZVc1VVRkJVU3hYUVVGWE8wRkJRemxFTEZOQlFVc3NVVUZCVVN4UlFVRlJMRk5CUVZVc1YwRkJWenRCUVVOMFF5eFZRVUZKTEU5QlFVOHNaVUZCWlN4TlFVRk5PMEZCUXpWQ0xGbEJRVWtzVlVGQlZTeHBRa0ZCYVVJc1QwRkJUenRCUVVOMFF5eFpRVUZKTEZWQlFWVXNVVUZCVVR0QlFVTjBRaXhaUVVGSkxGRkJRVkU3UVVGRFVpeG5Ra0ZCVFN4SlFVRkpMRmRCUVZjc1QwRkJUenRCUVVOb1F5eG5Ra0ZCVVN4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVNelFpeGpRVUZKTEVsQlFVazdRVUZEU2l4clFrRkJUU3hKUVVGSkxGZEJRVmNzVDBGQlR6dEJRVU5vUXl4alFVRkpMRU5CUVVNc1NVRkJTVHRCUVVOTUxHdENRVUZOTEVsQlFVa3NWMEZCVnl4UFFVRlBPMEZCUVVFN1FVRkZjRU1zYTBKQlFWVXNZVUZCWVN4clFrRkJhMElzVjBGQlZ5eFRRVUZUTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1hwRkxGZEJRVkVzVlVGQlZTeFRRVUZUTEZOQlFWVXNVVUZCVVR0QlFVTjZReXhSUVVGSkxFdEJRVXNzUzBGQlN6dEJRVU5rTEZOQlFVc3NTMEZCU3l4bFFVRmxMRXRCUVVzc1MwRkJTeXhsUVVNdlFpeFBRVUZQTEV0QlFVc3NTMEZCU3l4alFVRmpMRlZCUXk5Q08wRkJRMG9zVVVGQlNTeFhRVUZYTEVkQlFVYzdRVUZEYkVJc1VVRkJTU3hoUVVGaE8wRkJRMnBDTEZGQlFVa3NWMEZCVnp0QlFVTm1MR0ZCUVZNc1VVRkJVU3hUUVVGVkxGTkJRVk03UVVGRGFFTXNZVUZCVHl4WlFVRlpMRkZCUVZFc1MwRkJTenRCUVVOb1F5eHBRa0ZCV1N4UlFVRlJMRXRCUVVzc1YwRkJWenRCUVVOd1F5eGpRVUZSTEdsQ1FVRnBRaXhaUVVGWk8wRkJRVUU3UVVGRmVrTXNUMEZCUnl4WlFVRlpPMEZCUTJZc2IwSkJRV2RDTEVsQlFVa3NRMEZCUXl4SFFVRkhMRmxCUVZrc1NVRkJTU3hIUVVGSExGbEJRVms3UVVGRGRrUXNhMEpCUVdNc1NVRkJTU3hEUVVGRExFZEJRVWNzV1VGQldTeEpRVUZKTEVkQlFVY3NXVUZCV1N4WFFVRlhMRXRCUVVzc1MwRkJTeXhUUVVGVExFdEJRVXNzVjBGQlZ6dEJRVU51Unl4UFFVRkhMR05CUVdNc1MwRkJTenRCUVVOMFFpeFhRVUZQTzBGQlFVRTdRVUZGV0N4WFFVRlJMRlZCUVZVc1ZVRkJWU3hUUVVGVkxHbENRVUZwUWp0QlFVTnVSQ3hUUVVGTExFdEJRVXNzYVVKQlFXbENPMEZCUXpOQ0xGZEJRVTg3UVVGQlFUdEJRVVZZTEZOQlFVODdRVUZCUVR0QlFVZFlMR3REUVVGclF5eEpRVUZKTzBGQlEyeERMRk5CUVU4c2NVSkJRWEZDTEZGQlFWRXNWMEZCVnl4clFrRkJhVUlzWlVGQlpUdEJRVU16UlN4VFFVRkxMRXRCUVVzN1FVRkRWaXhUUVVGTExFOUJRVTg3UVVGQlFTeE5RVU5TTEZOQlFWTTdRVUZCUVN4TlFVTlVMR05CUVdNN1FVRkJRU3hOUVVOa0xGVkJRVlU3UVVGQlFTeE5RVU5XTEZGQlFWRTdRVUZCUVN4TlFVTlNMR2RDUVVGblFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVczFRaXg1UWtGQmVVSXNWMEZCVnl4aFFVRmhPMEZCUXpkRExFMUJRVWtzV1VGQldTeFZRVUZWTzBGQlF6RkNMRTFCUVVrc1EwRkJReXhYUVVGWE8wRkJRMW9zWjBKQlFWa3NWVUZCVlN4blFrRkJaMElzU1VGQlNTeFJRVUZSTEZsQlFWazdRVUZCUVN4TlFVTXhSQ3hSUVVGUk8wRkJRVUVzVFVGRFVqdEJRVUZCTEUxQlEwRTdRVUZCUVR0QlFVVktMR05CUVZVc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlJTeFRRVUZUTzBGQlFVRTdRVUZGTTBNc1UwRkJUeXhWUVVGVkxFMUJRVTA3UVVGQlFUdEJRVVV6UWl3MFFrRkJORUlzVjBGQlZ6dEJRVU51UXl4VFFVRlBMR0ZCUVdFc1QwRkJUeXhWUVVGVkxHTkJRV003UVVGQlFUdEJRVVYyUkN3d1FrRkJNRUlzUzBGQlNUdEJRVU14UWl4TlFVRkpMRmxCUVZrc1NVRkJSeXhYUVVGWExHTkJRV01zU1VGQlJ6dEJRVU12UXl4VFFVRlBMRzFDUVVGdFFpeGhRVU53UWl4UlFVRlJMRkZCUVZFc1ZVRkJWU3hoUVVGaExFdEJRVXNzVTBGQlZTeFBRVUZQTzBGQlF6TkVMRmRCUVU4c1RVRkRSaXhKUVVGSkxGTkJRVlVzVFVGQlRUdEJRVUZGTEdGQlFVOHNTMEZCU3p0QlFVRkJMRTlCUTJ4RExFOUJRVThzVTBGQlZTeE5RVUZOTzBGQlFVVXNZVUZCVHl4VFFVRlRPMEZCUVVFN1FVRkJRU3hQUVVWb1JDeG5Ra0ZCWjBJc1YwRkJWeXhoUVVGaExHVkJRV1U3UVVGQlFUdEJRVVZxUlN3MFFrRkJORUlzUzBGQlNTeE5RVUZOTzBGQlEyeERMRTFCUVVrc1dVRkJXU3hKUVVGSExGZEJRVmNzWTBGQll5eEpRVUZITzBGQlF5OURMRWRCUVVNc2JVSkJRVzFDTEdOQlEyaENMRk5CUVZNc1kwRkRWQ3huUWtGQlowSXNWMEZCVnl4aFFVRmhMRWxCUVVrc1EwRkJSU3hQUVVGakxFMUJRVTA3UVVGQlFUdEJRVVV4UlN3MFFrRkJORUlzUzBGQlNTeE5RVUZOTzBGQlEyeERMRTFCUVVrc1dVRkJXU3hKUVVGSExGZEJRVmNzWTBGQll5eEpRVUZITzBGQlF5OURMRWRCUVVNc2JVSkJRVzFDTEdOQlEyaENMRk5CUVZNc1kwRkRWQ3huUWtGQlowSXNWMEZCVnl4aFFVRmhMRTlCUVU4c1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGSGJrVXNZVUZCWVN4SlFVRkpPMEZCUTJJc1UwRkJUeXhUUVVGVExGZEJRVms3UVVGRGVFSXNVVUZCU1N4aFFVRmhPMEZCUTJwQ0xGZEJRVTg3UVVGQlFUdEJRVUZCTzBGQlNXWXNiVUpCUVcxQ0xFbEJRVWs3UVVGRGJrSXNUVUZCU1N4UlFVRlJMRWRCUVVjN1FVRkRaaXhOUVVGSkxGbEJRVmtzUjBGQlJ5eE5RVUZOTzBGQlEzcENMRTFCUVVrc1RVRkJUU3hwUWtGQmFVSXNSMEZCUnp0QlFVTXhRaXhYUVVGUExFMUJRVTBzWlVGQlpTeExRVUZMTEZkQlFWazdRVUZCUlN4aFFVRlBMRTFCUVUwc1kwRkRlRVFzVlVGQlZTeE5RVUZOTEdWQlEyaENPMEZCUVVFN1FVRkRVaXhYUVVGVkxFOUJRVTBzWTBGQll5eGxRVUZsTzBGQlF6ZERMRkZCUVUwc1owSkJRV2RDTzBGQlEzUkNMRkZCUVUwc1kwRkJZenRCUVVOd1FpeFJRVUZOTEdWQlFXVTdRVUZEY2tJc1RVRkJTU3hwUWtGQmFVSXNUVUZCVFN4blFrRkRNMElzY1VKQlFYRkNMRTFCUVUwc1lVRkJZVHRCUVVONFF5eFRRVUZQTEdGQlFXRXNTMEZCU3l4RFFVRkRMRTFCUVUwc1pVRkJaU3hKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZEYmtZc1VVRkJTU3hEUVVGRE8wRkJRMFFzV1VGQlRTeEpRVUZKTEZkQlFWYzdRVUZEZWtJc1VVRkJTU3hUUVVGVExFZEJRVWM3UVVGRGFFSXNVVUZCU1N4TlFVRk5MRTFCUVUwc1lVRkRXaXhWUVVGVkxFdEJRVXNzVlVGRFppeFZRVUZWTEV0QlFVc3NVVUZCVVN4TFFVRkxMRTFCUVUwc1IwRkJSeXhSUVVGUk8wRkJRMnBFTEZGQlFVa3NRMEZCUXp0QlFVTkVMRmxCUVUwc1NVRkJTU3hYUVVGWE8wRkJRM3BDTEZGQlFVa3NWVUZCVlN4dFFrRkJiVUk3UVVGRGFrTXNVVUZCU1N4WlFVRlpMRXRCUVVzc1IwRkJSenRCUVVONFFpeFJRVUZKTEd0Q1FVRnJRaXhMUVVGTExGTkJRVlVzUjBGQlJ6dEJRVU53UXl3eVFrRkJjVUlzU1VGQlNUdEJRVU42UWl4VlFVRkpMRTFCUVUwc1kwRkJZeXhEUVVGRExFZEJRVWNzVTBGQlV5eGpRVUZqTzBGQlF5OURMRmxCUVVrc1ZVRkJWVHRCUVVOa0xESkNRVUZ0UWp0QlFVTnVRaXhaUVVGSkxFOUJRVTg3UVVGRFdDeFpRVUZKTEZOQlFWTXNWVUZCVlN4bFFVRmxPMEZCUTNSRExHVkJRVThzV1VGQldTeFBRVUZQTEZWQlFWVXNTMEZCU3l4WFFVRlpPMEZCUTJwRUxHbENRVUZQTEVsQlFVa3NWMEZCVnl4bFFVRmxMR05CUVdNc1UwRkJVenRCUVVGQk8wRkJRVUVzWVVGSEwwUTdRVUZEUkN3eVFrRkJiVUlzVlVGQlZTeHRRa0ZCYlVJN1FVRkRhRVFzV1VGQlNTeFRRVUZUTEVWQlFVVXNZVUZCWVN4TFFVRkxMRWxCUVVrc1IwRkJSeXhOUVVGTkxFbEJRVWtzUlVGQlJUdEJRVU53UkN4eFFrRkJZU3hUUVVGVE8wRkJRM1JDTEZkQlFVY3NVVUZCVVN4SlFVRkpPMEZCUTJZc2NVSkJRV0VzU1VGQlNTeFRRVUZUTEVsQlFVa3NiMEpCUVc5Q08wRkJRVUU3UVVGQlFTeFBRVVYyUkR0QlFVTklMRkZCUVVrc1dVRkJXU3hMUVVGTExGZEJRVms3UVVGRE4wSXNNa0pCUVhGQ08wRkJRM0pDTEZWQlFVa3NVVUZCVVN4SFFVRkhMRkZCUVZFc1NVRkJTVHRCUVVNelFpeFZRVUZKTEcxQ1FVRnRRaXhOUVVGTkxFMUJRVTA3UVVGRGJrTXNWVUZCU1N4cFFrRkJhVUlzVTBGQlV6dEJRVU14UWl4WlFVRkpPMEZCUTBFc1kwRkJTU3hYUVVGWExFMUJRVTBzV1VGQldTeHZRa0ZCYjBJc2JVSkJRVzFDTzBGQlEzaEZMR05CUVVrc1RVRkJUVHRCUVVOT0xEWkNRVUZwUWl4SlFVRkpMRTlCUVU4N1FVRkJRU3hsUVVNelFqdEJRVU5FTEhWRFFVRXlRaXhKUVVGSkxFZEJRVWNzVjBGQlZ6dEJRVU0zUXl4blFrRkJTU3hEUVVGRExITkNRVUZ6UWl4SlFVRkpMRmRCUVZjN1FVRkRkRU1zYzBKQlFWRXNTMEZCU3p0QlFVRkJPMEZCUVVFN1FVRkhja0lzYlVOQlFYbENMRWxCUVVrN1FVRkJRU3hwUWtGRk1VSXNSMEZCVUR0QlFVRkJPMEZCUlVvc2EwSkJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRk5MR3RDUVVGclFpeExRVUZMTEZOQlFWVXNTVUZCU1R0QlFVTjJReXhqUVVGTkxGVkJRVlU3UVVGRGFFSXNWMEZCUnl4SFFVRkhMR2xDUVVGcFFpeExRVUZMTzBGQlFVRTdRVUZGYUVNc1dVRkJUU3hWUVVGVkxFdEJRVXNzVTBGQlZTeEpRVUZKTzBGQlF5OUNMRmRCUVVjc1IwRkJSeXhUUVVGVExFdEJRVXM3UVVGQlFUdEJRVVY0UWl4VlFVRkpPMEZCUTBFc01rSkJRVzFDTEVkQlFVY3NUMEZCVHp0QlFVTnFRenRCUVVGQkxFOUJRMFE3UVVGQlFTeFBRVU5HTEV0QlFVc3NWMEZCV1R0QlFVTjBRaXhWUVVGTkxHOUNRVUZ2UWp0QlFVTXhRaXhYUVVGUExHRkJRV0VzVVVGQlVTeEpRVUZKTEVkQlFVY3NSMEZCUnl4TlFVRk5MRTlCUVU4c1MwRkJTeXd3UWtGQk1FSTdRVUZET1VVc1ZVRkJTU3hOUVVGTkxHdENRVUZyUWl4VFFVRlRMRWRCUVVjN1FVRkRjRU1zV1VGQlNTeGhRVUZoTEUxQlFVMHNhMEpCUVd0Q0xFOUJRVThzYVVKQlFXbENPMEZCUTJwRkxHTkJRVTBzYjBKQlFXOUNPMEZCUXpGQ0xHVkJRVThzWVVGQllTeFJRVUZSTEVsQlFVa3NZVUZCWVN4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVGQkxFdEJSek5FTEZGQlFWRXNWMEZCV1R0QlFVTnVRaXhWUVVGTkxHOUNRVUZ2UWp0QlFVRkJMRXRCUXpOQ0xFdEJRVXNzVjBGQldUdEJRVU5vUWl4VlFVRk5MR2RDUVVGblFqdEJRVU4wUWl4WFFVRlBPMEZCUVVFc1MwRkRVaXhOUVVGTkxGTkJRVlVzUzBGQlN6dEJRVU53UWl4UlFVRkpPMEZCUTBFc05FSkJRWE5DTEcxQ1FVRnRRanRCUVVGQkxHRkJSWFJETEVkQlFWQTdRVUZCUVR0QlFVTkJMRlZCUVUwc1owSkJRV2RDTzBGQlEzUkNMRTlCUVVjN1FVRkRTQ3hWUVVGTkxHTkJRV003UVVGRGNFSXNWMEZCVHl4VlFVRlZMRTFCUVUwN1FVRkJRU3hMUVVONFFpeFJRVUZSTEZkQlFWazdRVUZEYmtJc1ZVRkJUU3hsUVVGbE8wRkJRM0pDTzBGQlFVRTdRVUZCUVR0QlFVbFNMSFZDUVVGMVFpeFZRVUZWTzBGQlF6ZENMRTFCUVVrc1YwRkJWeXhUUVVGVkxGRkJRVkU3UVVGQlJTeFhRVUZQTEZOQlFWTXNTMEZCU3p0QlFVRkJMRXRCUVZrc1ZVRkJWU3hUUVVGVkxFOUJRVTg3UVVGQlJTeFhRVUZQTEZOQlFWTXNUVUZCVFR0QlFVRkJMRXRCUVZjc1dVRkJXU3hMUVVGTExGZEJRVmNzVlVGQlZTeExRVUZMTzBGQlF6ZExMR2RDUVVGakxGTkJRVk03UVVGRGJrSXNWMEZCVHl4VFFVRlZMRXRCUVVzN1FVRkRiRUlzVlVGQlNTeFBRVUZQTEZGQlFWRXNUVUZCVFN4UlFVRlJMRXRCUVVzN1FVRkRkRU1zWVVGQlR5eExRVUZMTEU5QlFVOHNVVUZEWkN4RFFVRkRMRk5CUVZNc1QwRkJUeXhOUVVGTkxGTkJRVk1zWVVGRE4wSXNVVUZCVVN4VFFVRlRMRkZCUVZFc1NVRkJTU3hQUVVGUExFdEJRVXNzVjBGQlZ5eFhRVUZYTEZWQlFWVXNVMEZEZWtVc1RVRkJUU3hMUVVGTExGZEJRVmM3UVVGQlFUdEJRVUZCTzBGQlIzUkRMRk5CUVU4c1MwRkJTenRCUVVGQk8wRkJSMmhDTEdkRFFVRm5ReXhOUVVGTkxHRkJRV0VzVjBGQlZ6dEJRVU14UkN4TlFVRkpMRWxCUVVrc1ZVRkJWVHRCUVVOc1FpeE5RVUZKTEVsQlFVazdRVUZEU2l4VlFVRk5MRWxCUVVrc1YwRkJWeXhuUWtGQlowSTdRVUZEZWtNc1RVRkJTU3hQUVVGUExFbEJRVWtzVFVGQlRTeEpRVUZKTzBGQlEzcENMRk5CUVU4c1JVRkJSVHRCUVVOTUxGTkJRVXNzU1VGQlNTeExRVUZMTEZWQlFWVTdRVUZETlVJc1kwRkJXU3hMUVVGTE8wRkJRMnBDTEUxQlFVa3NVMEZCVXl4UlFVRlJPMEZCUTNKQ0xGTkJRVThzUTBGQlF5eE5RVUZOTEZGQlFWRTdRVUZCUVR0QlFVVXhRaXdyUWtGQkswSXNTVUZCU1N4TlFVRk5MRmxCUVZrc2JVSkJRVzFDTEZkQlFWYzdRVUZETDBVc1UwRkJUeXhoUVVGaExGVkJRVlVzUzBGQlN5eFhRVUZaTzBGQlF6TkRMRkZCUVVrc1dVRkJXU3hKUVVGSkxHRkJRV0U3UVVGRGFrTXNVVUZCU1N4UlFVRlJMRWRCUVVjc2JVSkJRVzFDTEUxQlFVMHNXVUZCV1N4SFFVRkhMRmRCUVZjN1FVRkRiRVVzVVVGQlNTeFpRVUZaTzBGQlFVRXNUVUZEV2p0QlFVRkJMRTFCUTBFN1FVRkJRVHRCUVVWS0xGRkJRVWtzYlVKQlFXMUNPMEZCUTI1Q0xGbEJRVTBzVjBGQlZ5eHJRa0ZCYTBJN1FVRkJRU3hYUVVWc1F6dEJRVU5FTEZsQlFVMDdRVUZCUVR0QlFVVldMRkZCUVVrc2JVSkJRVzFDTEdkQ1FVRm5RanRCUVVOMlF5eFJRVUZKTEd0Q1FVRnJRanRCUVVOc1FqdEJRVUZCTzBGQlJVb3NVVUZCU1R0QlFVTktMRkZCUVVrc2EwSkJRV3RDTEdGQlFXRXNUMEZCVHl4WFFVRlpPMEZCUTJ4RUxHOUNRVUZqTEZWQlFWVXNTMEZCU3l4UFFVRlBPMEZCUTNCRExGVkJRVWtzWVVGQllUdEJRVU5pTEZsQlFVa3NhMEpCUVd0Q08wRkJRMnhDTEdOQlFVa3NZMEZCWXl4M1FrRkJkMElzUzBGQlN5eE5RVUZOTzBGQlEzSkVMSE5DUVVGWkxFdEJRVXNzWVVGQllUdEJRVUZCTEcxQ1FVVjZRaXhQUVVGUExGbEJRVmtzVTBGQlV5eGpRVUZqTEU5QlFVOHNXVUZCV1N4VlFVRlZMRmxCUVZrN1FVRkRlRVlzZDBKQlFXTXNZMEZCWXp0QlFVRkJPMEZCUVVFN1FVRkJRU3hQUVVkeVF6dEJRVU5JTEZkQlFWRXNaMEpCUVdVc1QwRkJUeXhaUVVGWkxGTkJRVk1zWVVGREwwTXNZVUZCWVN4UlFVRlJMR0ZCUVdFc1MwRkJTeXhUUVVGVkxFZEJRVWM3UVVGQlJTeGhRVUZQTEUxQlFVMHNVMEZETDBRc1NVRkRSU3hWUVVGVkxFbEJRVWtzVjBGQlZ5eG5Ra0ZCWjBJN1FVRkJRU3hUUVVNM1F5eG5Ra0ZCWjBJc1MwRkJTeXhYUVVGWk8wRkJRVVVzWVVGQlR6dEJRVUZCTEZGQlFXbENMRXRCUVVzc1UwRkJWU3hIUVVGSE8wRkJReTlGTEZWQlFVazdRVUZEUVN4alFVRk5PMEZCUTFZc1lVRkJUeXhOUVVGTkxGbEJRVmtzUzBGQlN5eFhRVUZaTzBGQlFVVXNaVUZCVHp0QlFVRkJPMEZCUVVFc1QwRkRjRVFzVFVGQlRTeFRRVUZWTEVkQlFVYzdRVUZEYkVJc1dVRkJUU3hSUVVGUk8wRkJRMlFzWVVGQlR5eFZRVUZWTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU3pkQ0xHRkJRV0VzUjBGQlJ5eFBRVUZQTEU5QlFVODdRVUZETVVJc1RVRkJTU3hUUVVGVExGRkJRVkVzUzBGQlN5eEZRVUZGTEZWQlFWVXNRMEZCUXp0QlFVTjJReXhYUVVGVExFbEJRVWtzUjBGQlJ5eEpRVUZKTEU5QlFVOHNSVUZCUlR0QlFVTjZRaXhYUVVGUExFdEJRVXM3UVVGRGFFSXNVMEZCVHp0QlFVRkJPMEZCUlZnc2MwTkJRWE5ETEUxQlFVMDdRVUZEZUVNc1UwRkJUeXhUUVVGVExGTkJRVk1zU1VGQlNTeFBRVUZQTEVOQlFVVXNUMEZCVHl4VFFVRlZMRmRCUVZjN1FVRkRNVVFzVVVGQlNTeFJRVUZSTEV0QlFVc3NUVUZCVFR0QlFVTjJRaXhSUVVGSkxGTkJRVk1zVFVGQlRUdEJRVU51UWl4UlFVRkpMR05CUVdNN1FVRkRiRUlzVVVGQlNTeHZRa0ZCYjBJN1FVRkRlRUlzSzBKQlFUSkNMRk5CUVZNc1UwRkJVeXhsUVVGbE8wRkJRM2hFTEZWQlFVa3NaVUZCWlN4blFrRkJaMEk3UVVGRGJrTXNWVUZCU1N4WlFVRmhMRmxCUVZrc1owSkJRV2RDTEZsQlFWa3NhVUpCUVdsQ08wRkJRekZGTEZWQlFVa3NXVUZCV1N4WFFVRlhMRTlCUVU4c1NVRkJTU3hQUVVGUExGbEJRVmtzVjBGQlZ5eEpRVUZKTEZGQlFWRTdRVUZEYUVZc1ZVRkJTU3haUVVGWkxGVkJRVlU3UVVGRE1VSXNWVUZCU1N4bFFVRmxMRk5CUVZNc1UwRkJVeXhKUVVGSkxHZENRVUZuUWp0QlFVRkJMRkZCUVVVN1FVRkJRU3hSUVVGelFpeGpRVUZqTEVOQlFVTXNZVUZCWVN4alFVRmpPMEZCUVVFc1VVRkJZenRCUVVGQkxGRkJRM0pKTzBGQlFVRXNVVUZCYzBJc1dVRkJXU3huUWtGQlowSTdRVUZCUVN4UlFVRlZMRkZCUVZFc1EwRkJReXhoUVVGaExHTkJRV003UVVGQlFUdEJRVU53Unl4blFrRkJWU3hMUVVGTE8wRkJRMllzVlVGQlNTeERRVUZETEdGQlFXRXNZMEZCWXp0QlFVTTFRaXd3UWtGQmEwSXNTMEZCU3p0QlFVRkJPMEZCUlROQ0xGVkJRVWtzV1VGQldTeEhRVUZITzBGQlEyWXNXVUZCU1N4cFFrRkJhVUlzWTBGQll5eEpRVU12UWl4UlFVRlJMRXRCUTFJc1VVRkJVU3hOUVVGTkxFZEJRVWNzV1VGQldUdEJRVU5xUXl3d1FrRkJhMElzWjBKQlFXZENMRlZCUVZVc1IwRkJSenRCUVVGQk8wRkJSVzVFTEdkQ1FVRlZMRXRCUVVzc1UwRkJWU3hIUVVGSExFZEJRVWM3UVVGQlJTeGxRVUZQTEVWQlFVVXNWVUZCVlN4RlFVRkZPMEZCUVVFN1FVRkRkRVFzWVVGQlR6dEJRVUZCTzBGQlJWZ3NVVUZCU1N4aFFVRmhMR3RDUVVGclFpeFBRVUZQTEZkQlFWY3NVMEZCVXl4SFFVRkhMRTlCUVU4N1FVRkRlRVVzWjBKQlFWa3NVMEZCVXl4RFFVRkRPMEZCUTNSQ0xHRkJRVk1zUzBGQlN5eEhRVUZITEUxQlFVc3NUMEZCVHl4VFFVRlRMRXRCUVVzc1NVRkJSeXhSUVVGUkxFMUJRVTA3UVVGRGVFUXNWVUZCU1N4UlFVRlJMRWxCUVVjN1FVRkRaaXgzUWtGQmEwSXNUVUZCVFN4VFFVRlRMRWRCUVVjN1FVRkJRVHRCUVVWNFF5d3lRa0ZCZFVJc1UwRkJVenRCUVVNMVFpeFZRVUZKTEZWQlFWTXNXVUZCV1N4blFrRkJaMEk3UVVGRGVrTXNZVUZCVHl4WFFVRlZMRkZCUVU4N1FVRkJRVHRCUVVVMVFpdzBRa0ZCZDBJc1QwRkJUeXhUUVVGVE8wRkJRM0JETEdGQlFVODdRVUZCUVN4UlFVTklMRTFCUVUwc1RVRkJUU3hUUVVGVExFbEJRMnBDTEVsQlEwRXNUVUZCVFR0QlFVRkJMRkZCUTFZc1QwRkJUeXhKUVVGSkxFMUJRVTBzVDBGQlR5eE5RVUZOTEZsQlFWa3NTMEZCU3l4VlFVRlZMRXRCUVVzc1UwRkJVenRCUVVGQkxGRkJRM1pGTEZkQlFWYzdRVUZCUVN4UlFVTllMRTlCUVU4c1NVRkJTU3hOUVVGTkxFOUJRVThzVFVGQlRTeFpRVUZaTEV0QlFVc3NWVUZCVlN4TFFVRkxMRk5CUVZNN1FVRkJRU3hSUVVOMlJTeFhRVUZYTzBGQlFVRTdRVUZCUVR0QlFVZHVRaXc0UWtGQk1FSXNTMEZCU3p0QlFVTXpRaXhWUVVGSkxGTkJRVkVzU1VGQlNTeE5RVUZOTzBGQlEzUkNMR0ZCUVU4c1QwRkJUU3haUVVGWkxGTkJRVk1zVTBGQlV5eEpRVUZKTEUxQlFVMHNRMEZCUlN4UFFVRlBPMEZCUVVFc1VVRkRkRVFzVDBGQlR6dEJRVUZCTEZGQlExQXNUMEZCVHl4bFFVRmxMRWxCUVVrc1RVRkJUU3hQUVVGUExFOUJRVTA3UVVGQlFTeFpRVU14UXp0QlFVRkJPMEZCUldZc1VVRkJTU3hUUVVGVExGTkJRVk1zVTBGQlV5eEpRVUZKTEZGQlFWRTdRVUZCUVN4TlFVRkZMRkZCUVZFc1UwRkJVeXhUUVVGVExFbEJRVWtzVTBGQlV5eERRVUZGTEZsQlFYZENMRk5CUVZNc2JVSkJRVzFDTEcxQ1FVRnRRanRCUVVGQkxFMUJRV3RDTEU5QlFVOHNVMEZCVlN4TFFVRkxPMEZCUXpkTUxHVkJRVThzVFVGQlRTeE5RVUZOTEdsQ1FVRnBRanRCUVVGQk8wRkJRVUVzVFVGRmVFTXNUMEZCVHl4VFFVRlZMRXRCUVVzN1FVRkRiRUlzWlVGQlR5eE5RVUZOTEUxQlFVMHNhVUpCUVdsQ08wRkJRVUU3UVVGQlFTeE5RVVY0UXl4WlFVRlpMRk5CUVZVc1MwRkJTenRCUVVOMlFpeFpRVUZKTEUxQlFVc3NTVUZCU1N4TlFVRk5MRTlCUVU4c1ZVRkJWU3hKUVVGSExGTkJRVk1zV1VGQldTeEpRVUZITEZkQlFWY3NXVUZCV1N4SlFVRkhPMEZCUTNwR0xGbEJRVWtzUTBGQlF6dEJRVU5FTEdsQ1FVRlBMRTFCUVUwc1YwRkJWenRCUVVNMVFpeHhRMEZCTmtJc1VVRkJVVHRCUVVOcVF5dzJRa0ZCYlVJc1MwRkJTenRCUVVOd1FpeHRRa0ZCVHl4UFFVTklMRTlCUVU4c1UwRkJVeXhKUVVGSkxFdEJRVXNzU1VGQlNTeFZRVUZWTEV0QlFVc3NWVUZCVlN4TFFVRkxMRk5CUVZNc1dVRkRjRVVzU1VGQlNTeFRRVU5CTEU5QlFVOHNVMEZCVXl4SlFVRkpMRTlCUVU4c1MwRkJTeXhKUVVGSkxGVkJRVlVzUzBGQlN5eFZRVUZWTEV0QlFVc3NVMEZCVXl4WlFVTXpSU3hQUVVGUE8wRkJRVUU3UVVGRmJrSXNZMEZCU1N4blFrRkJaMElzVDBGQlR5eFBRVUZQTEZGQlFWRTdRVUZCUVN4WlFVTjBReXhWUVVGVkxFTkJRVVVzVDBGQlR6dEJRVUZCTEZsQlEyNUNMRzlDUVVGdlFqdEJRVUZCTEdOQlEyaENMRTlCUVU4c1UwRkJWU3hMUVVGTExHRkJRVms3UVVGRE9VSXNkVUpCUVU4c2JVSkJRVzFDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRk5CUVZNc1ZVRkJWVHRCUVVGQk8wRkJRVUU3UVVGQlFTeFpRVWR1UlN4TFFVRkxPMEZCUVVFc1kwRkRSQ3hMUVVGTExGZEJRVms3UVVGRFlpeHZRa0ZCU1N4TlFVRk5MRTlCUVU4N1FVRkRha0lzZFVKQlFVOHNZMEZCWXl4SlFVTnFRaXhKUVVGSkxFdEJRMG9zU1VGQlNTeE5RVUZOTEVkQlFVYzdRVUZCUVR0QlFVRkJPMEZCUVVFc1dVRkhla0lzVDBGQlR6dEJRVUZCTEdOQlEwZ3NTMEZCU3l4WFFVRlpPMEZCUTJJc2RVSkJRVThzVDBGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVa3hRaXhwUWtGQlR6dEJRVUZCTzBGQlJWZ3NaVUZCVHl4TlFVRk5MRmRCUVZjc2FVSkJRV2xDTEUxQlEzQkRMRXRCUVVzc1UwRkJWU3hSUVVGUk8wRkJRVVVzYVVKQlFVOHNWVUZCVlN4dlFrRkJiMEk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZGTTBVc1YwRkJUenRCUVVGQk8wRkJRVUU3UVVGSGJrSXNTVUZCU1N4NVFrRkJlVUk3UVVGQlFTeEZRVU42UWl4UFFVRlBPMEZCUVVFc1JVRkRVQ3hOUVVGTk8wRkJRVUVzUlVGRFRpeFBRVUZQTzBGQlFVRXNSVUZEVUN4UlFVRlJPMEZCUVVFN1FVRkhXaXd3UWtGQk1FSXNXVUZCV1N4TFFVRkxPMEZCUTNaRExFMUJRVWtzU1VGQlNTeFRRVUZUTzBGQlEySXNWMEZCVHl4SlFVRkpPMEZCUTJZc1UwRkJUeXhKUVVGSkxGRkJRVkVzU1VGQlNTeFBRVUZQTEVsQlFVa3NWMEZCVnp0QlFVRkJPMEZCUjJwRUxFbEJRVWtzYTBKQlFXdENPMEZCUVVFc1JVRkRiRUlzVDBGQlR6dEJRVUZCTEVWQlExQXNUVUZCVFR0QlFVRkJMRVZCUTA0c1QwRkJUenRCUVVGQkxFVkJRMUFzVVVGQlVTeFRRVUZWTEZWQlFWVTdRVUZCUlN4WFFVRlJMRk5CUVZNc1UwRkJVeXhKUVVGSkxGZEJRVmNzUTBGQlJTeFBRVUZQTEZOQlFWVXNWMEZCVnp0QlFVTTNSaXhWUVVGSkxGbEJRVmtzVTBGQlV5eE5RVUZOTzBGQlF5OUNMRlZCUVVrc1lVRkJZU3hWUVVGVkxFOUJRVTg3UVVGRGJFTXNWVUZCU1N4clFrRkJhMElzVTBGQlV5eFRRVUZUTEVsQlFVa3NXVUZCV1N4RFFVRkZMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRM3BGTEZsQlFVa3NWVUZCVlN4SlFVRkpPMEZCUTJ4Q0xGbEJRVWtzVFVGQlN5eFJRVUZSTEUxQlFVMHNWMEZCVnl4TlFVRk5MRmRCUVZjc1NVRkJSeXhWUVVGVkxGZEJRVmNzU1VGQlJ5eFZRVUZWTEZkQlFWY3NTVUZCUnp0QlFVTjBSeXhuUWtGQlVTeEpRVUZKTzBGQlFVRXNaVUZEU0R0QlFVTkVMR2RDUVVGSkxGTkJRVk1zVTBGQlV6dEJRVU5zUWp0QlFVTktMRzFDUVVGUExGRkJRVkVzVTBGQlV5eGhRVUZoTEZkQlFWazdRVUZCUlN4eFFrRkJUeXhsUVVGbE8wRkJRVUVzWlVGQlV6dEJRVUZCTEdWQlEycEdPMEZCUTBRc1owSkJRVWtzVTBGQlV5eFRRVUZUTEU5QlFVOHNVMEZCVXl4VFFVRlRPMEZCUXpORE8wRkJRMG9zYlVKQlFVOHNVVUZCVVN4VFFVRlRMR0ZCUVdFc1YwRkJXVHRCUVVGRkxIRkNRVUZQTEdWQlFXVTdRVUZCUVN4bFFVRlRPMEZCUVVFc1pVRkRha1k3UVVGRFJDeG5Ra0ZCU1N4VFFVRlRMRk5CUVZNN1FVRkRiRUk3UVVGRFNpeHRRa0ZCVHl4UlFVRlJMRk5CUVZNc1lVRkJZU3hYUVVGWk8wRkJRVVVzY1VKQlFVOHNaVUZCWlR0QlFVRkJMR1ZCUVZNN1FVRkJRU3hsUVVOcVJqdEJRVU5FTEdkQ1FVRkpMRk5CUVZNc1UwRkJVenRCUVVOc1FqdEJRVU5LTEcxQ1FVRlBMRkZCUVZFc1UwRkJVeXhoUVVGaExGZEJRVms3UVVGQlJTeHhRa0ZCVHl4WlFVRlpPMEZCUVVFc1pVRkJVenRCUVVGQk8wRkJSWFpHTEdWQlFVOHNWVUZCVlN4UFFVRlBPMEZCUTNoQ0xHZERRVUYzUWl4TlFVRkxPMEZCUTNwQ0xHTkJRVWtzVjBGQlZTeEpRVUZKTzBGQlEyeENMR05CUVVrc1VVRkJUeXhMUVVGSkxGRkJRVkVzYVVKQlFXbENMRmxCUVZrN1FVRkRjRVFzWTBGQlNTeERRVUZETzBGQlEwUXNhMEpCUVUwc1NVRkJTU3hOUVVGTk8wRkJRM0JDTEdsQ1FVRk5MRXRCUVVrc1UwRkJVeXhUUVVGVExFdEJRVWtzVTBGQlV5eFJRVUZSTEZOQlFWTXNVMEZCVXl4SlFVRkpMRTlCUVUwc1EwRkJSU3hOUVVGTkxGVkJRVlVzVTBGQlV5eEpRVUZKTzBGQlF6VkhMR05CUVVrc1MwRkJTU3hUUVVGVE8wRkJRMklzYVVKQlFVa3NVMEZCVXl4alFVRmpMRWxCUVVrc1MwRkJTVHRCUVVOMlF5eGpRVUZKTEV0QlFVazdRVUZEU2l4cFFrRkJTU3hQUVVGUExHTkJRV01zU1VGQlNTeExRVUZKTzBGQlEzSkRMR2xDUVVGUExHdENRVUZyUWl4WFFVRlhMRTFCUVVzc1QwRkJUU3hMUVVGTExGTkJRVlVzWjBKQlFXZENPMEZCUXpGRkxHZENRVUZKTEZkQlFWY3NUVUZCU3l4SlFVRkpMRk5CUVZVc1MwRkJTeXhIUVVGSE8wRkJRM1JETEd0Q1FVRkpMR2RDUVVGblFpeGxRVUZsTzBGQlEyNURMR3RDUVVGSkxFMUJRVTBzUTBGQlJTeFRRVUZUTEUxQlFVMHNWMEZCVnp0QlFVTjBReXhyUWtGQlNTeExRVUZKTEZOQlFWTXNWVUZCVlR0QlFVTjJRaXg1UWtGQlV5eExRVUZMTEV0QlFVc3NTMEZCU3l4TFFVRkxMR1ZCUVdVN1FVRkJRU3g1UWtGRmRrTXNTMEZCU1N4VFFVRlRMRk5CUVZNc2EwSkJRV3RDTEZGQlFWYzdRVUZEZUVRc2IwSkJRVWtzYzBKQlFYTkNMRk5CUVZNc1MwRkJTeXhMUVVGTExFdEJRVXNzUzBGQlN5eExRVUZKTEU5QlFVOHNTVUZCU1R0QlFVTjBSU3h2UWtGQlNTeFBRVUZQTEZGQlFWRXNkVUpCUVhWQ0xFMUJRVTA3UVVGRE5VTXNkMEpCUVUwN1FVRkRUaXgxUWtGQlNTeExRVUZMTEV0QlFVczdRVUZEWkN4elFrRkJTU3hEUVVGRExGZEJRVmNzVlVGQlZUdEJRVU4wUWl4cFEwRkJZU3hMUVVGSkxFOUJRVThzU1VGQlNTeFhRVUZYTEZOQlFWTTdRVUZCUVR0QlFVRkJPMEZCUVVFc2NVSkJTWFpFTzBGQlEwUXNiMEpCUVVrc1lVRkJZU3hqUVVGakxHVkJRV1VzUzBGQlNTeFBRVUZQTzBGQlEzcEVMRzlDUVVGSkxITkNRVUZ6UWl4VFFVRlRMRXRCUVVzc1MwRkJTeXhMUVVGTExGbEJRVmtzUzBGQlN5eGxRVUZsTzBGQlEyeEdMRzlDUVVGSkxIRkNRVUZ4UWp0QlFVTnlRaXh6UWtGQlNTeHRRa0ZCYlVJc1MwRkJTU3hQUVVGUE8wRkJRMnhETEhsQ1FVRlBMRXRCUVVzc2NVSkJRWEZDTEZGQlFWRXNVMEZCVlN4VFFVRlRPMEZCUTNoRUxIZENRVUZKTEU5QlFVOHNhMEpCUVd0Q0xGVkJRVlU3UVVGRGJrTXNkVU5CUVdsQ0xGZEJRVmNzYjBKQlFXOUNPMEZCUVVFc01rSkJSUzlETzBGQlEwUXNiVU5CUVdFc2EwSkJRV3RDTEZOQlFWTXNiMEpCUVc5Q08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMTlVVc2NVSkJRVTg3UVVGQlFUdEJRVVZZTEcxQ1FVRlBMRlZCUVZVc1QwRkJUeXhOUVVGTExFdEJRVXNzVTBGQlZTeExRVUZKTzBGQlF6VkRMR3RDUVVGSkxGZEJRVmNzU1VGQlJ5eFZRVUZWTEZWQlFWVXNTVUZCUnl4VFFVRlRMR05CUVdNc1NVRkJSeXhoUVVGaExHRkJRV0VzU1VGQlJ6dEJRVU5vUnl4MVFrRkJVeXhKUVVGSkxFZEJRVWNzU1VGQlNTeE5RVUZMTEZGQlFWRXNSVUZCUlN4SFFVRkhPMEZCUTJ4RExHOUNRVUZKTEZWQlFWVXNWVUZCVlN4UlFVRlJMRXRCUVVzc1RVRkJTenRCUVVNeFF5eHZRa0ZCU1N4TlFVRk5MRk5CUVZNN1FVRkRia0lzYjBKQlFVa3NWMEZCVnl4TlFVRk5PMEZCUTJwQ0xITkNRVUZKTEZkQlFWY3NTVUZCU1N4UlFVRlJMRk5CUVZNN1FVRkJRU3gxUWtGRmJrTTdRVUZEUkN4elFrRkJTU3hoUVVGaExFbEJRVWtzVlVGQlZTeExRVUZKTEZOQlFWTXNVMEZCVXl4bFFVRmxMRXRCUTJoRkxFdEJRVWtzVDBGQlR5eExRVU5ZTzBGQlFVRTdRVUZCUVR0QlFVbGFMSEZDUVVGUExFTkJRVVVzVlVGQmIwSXNVMEZCYTBJc1lVRkJNRUk3UVVGQlFTeGxRVU14UlN4TlFVRk5MRk5CUVZVc1QwRkJUenRCUVVOMFFpeDFRa0ZCVXl4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVGRkxIVkNRVUZQTEVsQlFVa3NWMEZCVnl4SlFVRkpMRkZCUVZFN1FVRkJRVHRCUVVOd1JTeHhRa0ZCVHl4UlFVRlJMRTlCUVU4N1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSmJFTXNOa0pCUVhGQ0xFMUJRVXM3UVVGRGRFSXNhVUpCUVU4c1owSkJRV2RDTEV0QlFVa3NUMEZCVHl4TFFVRkpMRTlCUVU4N1FVRkJRVHRCUVVWcVJDeHBRMEZCZVVJc1QwRkJUeXhQUVVGUExFOUJRVTg3UVVGRE1VTXNhVUpCUVU4c1ZVRkJWU3hOUVVGTkxFTkJRVVVzVDBGQll5eFJRVUZSTEU5QlFVOHNUMEZCVHl4RFFVRkZMRTlCUVU4c1dVRkJXU3hSUVVGblFpeFJRVU0zUml4TFFVRkxMRk5CUVZVc1MwRkJTVHRCUVVOd1FpeG5Ra0ZCU1N4VFFVRlRMRWxCUVVjN1FVRkRhRUlzYlVKQlFVOHNaVUZCWlN4RFFVRkZMRTFCUVUwc1ZVRkJWU3hOUVVGTkxGRkJRVkVzVVVGQlowSXNTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkRkRVlzYTBKQlFVa3NTVUZCU1N4alFVRmpPMEZCUTJ4Q0xIVkNRVUZQTEZGQlFWRXNUMEZCVHl4SlFVRkpMRk5CUVZNN1FVRkRka01zYTBKQlFVa3NUMEZCVHl4VFFVRlRMRTlCUVU4N1FVRkRka0lzZFVKQlFVOHNRMEZCUlN4VlFVRlZMRWxCUVVrc1lVRkJZU3hIUVVGSExGbEJRVms3UVVGQlFTeHhRa0ZGYkVRN1FVRkRSQ3gxUWtGQlR5eG5Ra0ZCWjBJc1QwRkJUeXhUUVVGVExGTkJRVk1zU1VGQlNTeFJRVUZSTEVOQlFVVXNUMEZCVHl4UFFVRlBMRTlCUVU4c1UwRkJVeXhKUVVGSkxGZEJRVmNzVVVGQlV6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRk5OVWtzWVVGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVZHVRaXd5UWtGQk1rSXNUMEZCVHl4TFFVRkxMR1ZCUVdVN1FVRkRiRVFzVTBGQlR5eEpRVUZKTEZOQlFWTXNVVUZEWkN4UlFVRlJMRkZCUVZFc1RVRkRhRUlzVFVGQlRTeFJRVUZSTEVOQlFVVXNUMEZCVHl4SlFVRkpMRTlCUVU4c1RVRkJUU3hsUVVGbExFOUJRVTg3UVVGQlFUdEJRVWQ0UlN4SlFVRkpPMEZCUTBvc1lVRkJZU3hIUVVGSExFZEJRVWM3UVVGRFppeE5RVUZKTzBGQlEwRXNWMEZCVHl4TFFVRkxMRWRCUVVjN1FVRkRia0lzVFVGQlNTeFpRVUZaTEZGQlFWRTdRVUZEZUVJc1RVRkJTU3hEUVVGRE8wRkJRMFFzVlVGQlRTeEpRVUZKTEZkQlFWYzdRVUZEZWtJc1UwRkJUeXhUUVVGVkxFbEJRVWNzU1VGQlJ6dEJRVU51UWl4UlFVRkpPMEZCUTBFc1lVRkJUeXhOUVVGTExGRkJRVkVzVFVGQlN5eFBRVUZQTEUxQlFVMHNWVUZCVlN4SlFVRkpMRWxCUVVjN1FVRkJRU3hoUVVWd1JDeExRVUZRTzBGQlEwa3NZVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhUUVVGUExFdEJRVXNzUjBGQlJ6dEJRVUZCTzBGQlIyNUNMR2xEUVVGcFF5eFBRVUZOTEU5QlFVOHNUMEZCVHp0QlFVTnFSQ3hOUVVGSk8wRkJRMEVzVVVGQlNTeERRVUZETzBGQlEwUXNZVUZCVHp0QlFVTllMRkZCUVVrc1RVRkJUU3hMUVVGTExGTkJRVk1zVFVGQlN6dEJRVU42UWl4aFFVRlBPMEZCUTFnc1VVRkJTU3hUUVVGVE8wRkJRMklzWVVGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4SFFVRkhMRWxCUVVrc1RVRkJUU3hMUVVGTExGVkJRVlVzU1VGQlNTeE5RVUZMTEZGQlFWRXNSVUZCUlN4SFFVRkhPMEZCUTJ4RkxGVkJRVWtzU1VGQlNTeE5RVUZOTEV0QlFVc3NTVUZCU1N4TlFVRkxMRkZCUVZFN1FVRkRhRU03UVVGRFNpeGhRVUZQTEV0QlFVc3NVVUZCVVN4VlFVRlZMRTFCUVUwc1QwRkJUeXhOUVVGTkxFMUJRVTBzVDBGQlR6dEJRVU01UkN4UlFVRkZPMEZCUVVFN1FVRkZUaXhYUVVGUExFOUJRVThzVjBGQlZ5eE5RVUZMTEZOQlFWTXNVMEZCVXp0QlFVRkJMRmRCUlRkRExFdEJRVkE3UVVGRFNTeFhRVUZQTzBGQlFVRTdRVUZCUVR0QlFVZG1MRWxCUVVrc1owTkJRV2RETzBGQlFVRXNSVUZEYUVNc1QwRkJUenRCUVVGQkxFVkJRMUFzVDBGQlR6dEJRVUZCTEVWQlExQXNVVUZCVVN4VFFVRlZMRTFCUVUwN1FVRkRjRUlzVjBGQlR6dEJRVUZCTEUxQlEwZ3NUMEZCVHl4VFFVRlZMRmRCUVZjN1FVRkRlRUlzV1VGQlNTeFJRVUZSTEV0QlFVc3NUVUZCVFR0QlFVTjJRaXhsUVVGUExGTkJRVk1zVTBGQlV5eEpRVUZKTEZGQlFWRXNRMEZCUlN4VFFVRlRMRk5CUVZVc1MwRkJTenRCUVVOMlJDeGpRVUZKTEVOQlFVTXNTVUZCU1N4UFFVRlBPMEZCUTFvc2JVSkJRVThzVFVGQlRTeFJRVUZSTzBGQlFVRTdRVUZGZWtJc1kwRkJTU3hsUVVGbExIZENRVUYzUWl4SlFVRkpMRTFCUVUwc1NVRkJTU3hOUVVGTkxGZEJRVmNzU1VGQlNTeFZRVUZWTzBGQlEzaEdMR05CUVVrc1kwRkJZenRCUVVOa0xHMUNRVUZQTEdGQlFXRXNVVUZCVVR0QlFVRkJPMEZCUldoRExHbENRVUZQTEUxQlFVMHNVVUZCVVN4TFFVRkxMRXRCUVVzc1UwRkJWU3hMUVVGTE8wRkJRekZETEdkQ1FVRkpMRTFCUVUwc1dVRkJXVHRCUVVGQkxHTkJRMnhDTEUxQlFVMHNTVUZCU1R0QlFVRkJMR05CUTFZc1VVRkJVU3hKUVVGSkxGVkJRVlVzVlVGQlZTeFZRVUZWTEU5QlFVODdRVUZCUVR0QlFVVnlSQ3h0UWtGQlR6dEJRVUZCTzBGQlFVRXNWMEZGV2l4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVOMFFpeGpRVUZKTEVsQlFVa3NVMEZCVXp0QlFVTmlMR2RDUVVGSkxFMUJRVTBzV1VGQldUdEJRVU14UWl4cFFrRkJUeXhOUVVGTkxFOUJRVTg3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCVHpWRExFbEJRVWs3UVVGRFNpeHpRa0ZCYzBJc1RVRkJUVHRCUVVONFFpeFRRVUZQTEVOQlFVVXNWMEZCVlR0QlFVRkJPMEZCUlhaQ0xFbEJRVWtzVjBGQlZ5eFRRVUZWTEZsQlFWa3NTVUZCU1R0QlFVTnlReXhOUVVGSkxFMUJRVTA3UVVGRFRpeFhRVUZQTEUxQlFVMHNWVUZCVlN4VFFVRlRMRU5CUVVVc1IwRkJSeXhIUVVGSExFMUJRVTBzV1VGQldTeEpRVUZKTEZWQlFWVXNVMEZCVXl4SlFVRkpMRXRCUVVzc1kwRkJaU3hEUVVGRkxFZEJRVWM3UVVGQlFTeFRRVVUzUnp0QlFVTkVMRkZCUVVrc1MwRkJTeXhKUVVGSk8wRkJRMklzVVVGQlNTeGpRVUZsTEU5QlFVOHNXVUZCWVR0QlFVTnVReXhoUVVGUExFbEJRVWs3UVVGQlFUdEJRVVZtTEZkQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1RVRkJUU3hUUVVGVExGZEJRVmtzVFVGQlN6dEJRVUZCTEVWQlEzaENMRXRCUVVzc1UwRkJWU3hWUVVGVk8wRkJRM0pDTEdkQ1FVRlpMRTFCUVUwN1FVRkRiRUlzVjBGQlR6dEJRVUZCTzBGQlFVRXNSVUZGV0N4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVOdVFpeGhRVUZUTEUxQlFVMHNTMEZCU3p0QlFVTndRaXhYUVVGUE8wRkJRVUU3UVVGQlFTeEZRVVZZTEZOQlFWTXNVMEZCVlN4UFFVRk5PMEZCUTNKQ0xGRkJRVWtzVVVGQlVUdEJRVU5hTEZWQlFVc3NVVUZCVVN4VFFVRlZMRXRCUVVzN1FVRkJSU3hoUVVGUExGTkJRVk1zVDBGQlR5eExRVUZMTzBGQlFVRTdRVUZETVVRc1YwRkJUenRCUVVGQk8wRkJRVUVzUjBGSFppeEhRVUZITEd0Q1FVRnJRaXhYUVVGWk8wRkJRemRDTEZOQlFVOHNiMEpCUVc5Q08wRkJRVUVzUjBGRkwwSTdRVUZEU2l4clFrRkJhMElzVVVGQlVTeE5RVUZOTEVsQlFVazdRVUZEYUVNc1RVRkJTU3hQUVVGUExFbEJRVWtzVFVGQlRUdEJRVU55UWl4TlFVRkpMRTFCUVUwN1FVRkRUanRCUVVOS0xFMUJRVWtzVDBGQlR6dEJRVU5RTEZWQlFVMDdRVUZEVml4TlFVRkpMR0ZCUVdFN1FVRkRZaXhYUVVGUExFOUJRVThzVVVGQlVTeERRVUZGTEUxQlFWa3NTVUZCVVN4SFFVRkhPMEZCUTI1RUxFMUJRVWtzVDBGQlR5eFBRVUZQTzBGQlEyeENMRTFCUVVrc1VVRkJVU3hQUVVGUE8wRkJRMjVDTEUxQlFVa3NTVUZCU1N4SlFVRkpMRTlCUVU4c1VVRkJVU3hIUVVGSE8wRkJRekZDTEZkQlEwMHNVMEZCVXl4TlFVRk5MRTFCUVUwc1RVRkRjRUlzVDBGQlR5eEpRVUZKTEVOQlFVVXNUVUZCV1N4SlFVRlJMRWRCUVVjc1IwRkJSeXhIUVVGSExFMUJRVTBzUjBGQlJ6dEJRVU14UkN4WFFVRlBMRlZCUVZVN1FVRkJRVHRCUVVWeVFpeE5RVUZKTEVsQlFVa3NUVUZCVFN4UFFVRlBMRTFCUVUwc1IwRkJSenRCUVVNeFFpeFpRVU5OTEZOQlFWTXNUMEZCVHl4TlFVRk5MRTFCUTNKQ0xFOUJRVThzU1VGQlNTeERRVUZGTEUxQlFWa3NTVUZCVVN4SFFVRkhMRWRCUVVjc1IwRkJSeXhOUVVGTkxFZEJRVWM3UVVGRE1VUXNWMEZCVHl4VlFVRlZPMEZCUVVFN1FVRkZja0lzVFVGQlNTeEpRVUZKTEUxQlFVMHNUMEZCVHl4UlFVRlJMRWRCUVVjN1FVRkROVUlzVjBGQlR5eFBRVUZQTzBGQlEyUXNWMEZCVHl4SlFVRkpPMEZCUTFnc1YwRkJUeXhKUVVGSkxGRkJRVkVzVFVGQlRTeEpRVUZKTEVsQlFVazdRVUZCUVR0QlFVVnlReXhOUVVGSkxFbEJRVWtzU1VGQlNTeFBRVUZQTEUxQlFVMHNSMEZCUnp0QlFVTjRRaXhYUVVGUExFdEJRVXM3UVVGRFdpeFhRVUZQTEVsQlFVazdRVUZEV0N4WFFVRlBMRWxCUVVrc1QwRkJUeXhKUVVGSkxFOUJRVThzUlVGQlJTeEpRVUZKTEVsQlFVazdRVUZCUVR0QlFVVXpReXhOUVVGSkxHbENRVUZwUWl4RFFVRkRMRTlCUVU4N1FVRkROMElzVFVGQlNTeFJRVUZSTEVOQlFVTXNUMEZCVHl4SFFVRkhPMEZCUTI1Q0xHZENRVUZaTEZGQlFWRTdRVUZCUVR0QlFVVjRRaXhOUVVGSkxGTkJRVk1zWjBKQlFXZENPMEZCUTNwQ0xHZENRVUZaTEZGQlFWRTdRVUZCUVR0QlFVRkJPMEZCUnpWQ0xIRkNRVUZ4UWl4UlFVRlJMRkZCUVZFN1FVRkRha01zZDBKQlFYTkNMRk5CUVZFc1MwRkJTVHRCUVVNNVFpeFJRVUZKTEU5QlFVOHNTVUZCUnl4TlFVRk5MRXRCUVVzc1NVRkJSeXhKUVVGSkxFbEJRVWtzU1VGQlJ5eEhRVUZITEVsQlFVa3NTVUZCUnp0QlFVTnFSQ3hoUVVGVExGTkJRVkVzVFVGQlRUdEJRVU4yUWl4UlFVRkpPMEZCUTBFc2JVSkJRV0VzVTBGQlVUdEJRVU42UWl4UlFVRkpPMEZCUTBFc2JVSkJRV0VzVTBGQlVUdEJRVUZCTzBGQlJUZENMRTFCUVVrc1EwRkJReXhoUVVGaE8wRkJRMlFzYVVKQlFXRXNVVUZCVVR0QlFVRkJPMEZCUlRkQ0xIVkNRVUYxUWl4WFFVRlhMRmRCUVZjN1FVRkRla01zVFVGQlNTeExRVUZMTEc5Q1FVRnZRanRCUVVNM1FpeE5RVUZKTEdOQlFXTXNSMEZCUnp0QlFVTnlRaXhOUVVGSkxGbEJRVms3UVVGRFdpeFhRVUZQTzBGQlExZ3NUVUZCU1N4SlFVRkpMRmxCUVZrN1FVRkRjRUlzVFVGQlNTeExRVUZMTEc5Q1FVRnZRanRCUVVNM1FpeE5RVUZKTEdOQlFXTXNSMEZCUnl4TFFVRkxMRVZCUVVVN1FVRkROVUlzVFVGQlNTeEpRVUZKTEZsQlFWazdRVUZEY0VJc1UwRkJUeXhEUVVGRExGbEJRVmtzVVVGQlVTeERRVUZETEZsQlFWa3NUVUZCVFR0QlFVTXpReXhSUVVGSkxFbEJRVWtzUlVGQlJTeE5RVUZOTEVWQlFVVXNUMEZCVHl4TFFVRkxMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzVTBGQlV6dEJRVU12UXl4aFFVRlBPMEZCUTFnc1VVRkJTU3hGUVVGRkxFMUJRVTBzUlVGQlJTeFJRVUZSTEVsQlEyWXNTVUZCU3l4bFFVRmpMRWRCUVVjc1MwRkJTeXhGUVVGRkxFOUJRVThzVVVGRGNFTXNTVUZCU3l4bFFVRmpMRWRCUVVjc1MwRkJTeXhGUVVGRkxFOUJRVTg3UVVGQlFUdEJRVVV2UXl4VFFVRlBPMEZCUVVFN1FVRkZXQ3cyUWtGQk5rSXNUVUZCVFR0QlFVTXZRaXhOUVVGSkxGRkJRVkVzWVVGQllTeFJRVUZSTEU5QlFVOHNRMEZCUlN4SFFVRkhMRWRCUVVjc1IwRkJSenRCUVVOdVJDeFRRVUZQTzBGQlFVRXNTVUZEU0N4TlFVRk5MRk5CUVZVc1MwRkJTenRCUVVOcVFpeFZRVUZKTEdOQlFXTXNWVUZCVlN4VFFVRlRPMEZCUTNKRExHRkJRVThzVDBGQlR6dEJRVU5XTEdkQ1FVRlJMRTFCUVUwN1FVRkJRU3hsUVVOTU8wRkJRMFFzYTBKQlFVMHNTVUZCU1R0QlFVTldMR2RDUVVGSkxHRkJRV0U3UVVGRFlpeHhRa0ZCVHl4TlFVRk5MRVZCUVVVc1MwRkJTeXhKUVVGSkxFdEJRVXNzVFVGQlRTeEZRVUZGTEZGQlFWRTdRVUZEZWtNc2QwSkJRVkVzUTBGQlJTeEpRVUZKTEU5QlFVOHNSMEZCUnl4TlFVRk5MRVZCUVVVc1IwRkJSeXhIUVVGSE8wRkJRVUVzYlVKQlJYcERPMEZCUTBRc2NVSkJRVThzVFVGQlRTeEZRVUZGTzBGQlExZ3NkMEpCUVZFc1EwRkJSU3hKUVVGSkxFOUJRVThzUjBGQlJ5eE5RVUZOTEVWQlFVVXNSMEZCUnl4SFFVRkhPMEZCUVVFN1FVRkJRU3hsUVVVM1F6dEJRVU5FTEd0Q1FVRk5MRWxCUVVrN1FVRkRWaXhuUWtGQlNTeERRVUZETEdWQlFXVXNTVUZCU1N4TFFVRkxMRTFCUVUwc1JVRkJSU3hQUVVGUE8wRkJRM2hETEhGQ1FVRlBMRU5CUVVVc1QwRkJUeXhOUVVGTkxFZEJRVWNzVFVGQlRUdEJRVUZCTEdWQlEyeERPMEZCUTBRc1owSkJRVWtzVFVGQlRTeEZRVUZGTEVkQlFVYzdRVUZEV0N4dlFrRkJUU3hKUVVGSk8wRkJRMVlzYzBKQlFWRXNRMEZCUlN4SlFVRkpMRTlCUVU4c1IwRkJSeXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEhRVUZITzBGQlEzUkRPMEZCUVVFN1FVRkJRU3hsUVVWSU8wRkJRMFFzYjBKQlFWRXNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkhNVUlzWVVGQlR5eERRVUZGTEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkpNMElzYlVKQlFXMUNMRkZCUVZFN1FVRkRka0lzVFVGQlNTeExRVUZKTzBGQlExSXNUVUZCU1N4UFFVRlZMRk5CUVVzc1QwRkJUeXhQUVVGUExGRkJRVkVzVVVGQlR5eFRRVUZUTEZOQlFWTXNTVUZCUnl4TlFVRk5MRXRCUVZFc1VVRkJTeXhQUVVGUExFOUJRVThzVVVGQlVTeFBRVUZQTEZOQlFWTXNVMEZCVXl4SFFVRkhMRTFCUVUwN1FVRkRhRW9zVFVGQlNTeEpRVUZKTEU5QlFVOHNTVUZCU1N4TlFVRk5MRTlCUVU4c1MwRkJTeXhOUVVGTk8wRkJRek5ETEUxQlFVa3NSMEZCUnp0QlFVTklMRkZCUVVrc1NVRkJTU3hOUVVGTkxFMUJRVTBzVFVGQlRUdEJRVU14UWl4UlFVRkpMRmxCUVZrc1UwRkJVeXhKUVVGSk8wRkJRemRDTEZGQlFVa3NaVUZCWlN4UFFVRlBPMEZCUXpGQ0xGZEJRVThzVDBGQlR5eGhRVUZoTzBGQlF6TkNMRmRCUVU4c1MwRkJTeXhoUVVGaE8wRkJRM3BDTEZkQlFVOHNTMEZCU3l4aFFVRmhPMEZCUTNwQ0xHTkJRVlVzUzBGQlN5eGhRVUZoTzBGQlF6VkNMRmRCUVU4c1MwRkJTenRCUVVOYUxHTkJRVlVzU1VGQlNTeGhRVUZoTzBGQlFVRTdRVUZGTDBJc1UwRkJUeXhKUVVGSkxHRkJRV0U3UVVGQlFUdEJRVVUxUWl4elFrRkJjMElzUzBGQlNUdEJRVU4wUWl4TlFVRkpMRWxCUVVrc1NVRkJSeXhIUVVGSExFbEJRVWtzU1VGQlJ6dEJRVU55UWl4VFFVRlJMRXRCUVVzc1NVRkJTU3hMUVVGTExFbEJRVWtzUlVGQlJTeEhRVUZITEVWQlFVVXNTMEZCU3l4RlFVRkZMRWxCUVVzc1NVRkJTU3hGUVVGRkxFbEJRVWtzUzBGQlN6dEJRVUZCTzBGQlIyaEZMRWxCUVVrc01FSkJRVEJDTzBGQlFVRXNSVUZETVVJc1QwRkJUenRCUVVGQkxFVkJRMUFzVDBGQlR6dEJRVUZCTEVWQlExQXNVVUZCVVN4VFFVRlZMRTFCUVUwN1FVRkRjRUlzVVVGQlNTeFRRVUZUTEV0QlFVc3NUMEZCVHp0QlFVTjZRaXhSUVVGSkxHRkJRV0VzU1VGQlNTeFRRVUZUTEV0QlFVc3NVMEZCVXl4TFFVRkxPMEZCUTJwRUxGZEJRVThzVTBGQlV5eFRRVUZUTEVsQlFVa3NUMEZCVHl4RFFVRkZMRTlCUVU4c1UwRkJWU3hYUVVGWE8wRkJRekZFTEZWQlFVa3NVVUZCVVN4TFFVRkxMRTFCUVUwN1FVRkRka0lzVlVGQlNTeFRRVUZUTEUxQlFVMDdRVUZEYmtJc1ZVRkJTU3hoUVVGaExFOUJRVTg3UVVGRGVFSXNWVUZCU1N4aFFVRmhMRmRCUVZjc1dVRkJXU3hYUVVGWExGZEJRVmM3UVVGRE9VUXNWVUZCU1N4aFFVRmhMRk5CUVZNc1UwRkJVeXhKUVVGSkxGRkJRVkVzUTBGQlJTeFJRVUZSTEZOQlFWVXNTMEZCU3p0QlFVTm9SU3haUVVGSkxGRkJRVkVzU1VGQlNUdEJRVU5vUWl4WlFVRkpMR1ZCUVdVc1RVRkJUU3huUWtGQmFVSXNUMEZCVFN4bFFVRmxPMEZCUXk5RUxGbEJRVWtzWTBGQll5eFRRVUZWTEZkQlFWYzdRVUZEYmtNc1kwRkJTU3hQUVVGUExGZEJRVmNzVTBGQlV5eE5RVUZOTEZsQlFWa3NUVUZCVFR0QlFVTjJSQ3hwUWtGQlVTeGhRVUZoTEZOQlEyaENMR05CUVdFc1VVRkJVU3hKUVVGSk8wRkJRVUU3UVVGRmJFTXNXVUZCU1N4aFFVRmhMRmxCUVZrN1FVRkROMElzV1VGQlNTeGxRVUZsTEZsQlFWazdRVUZETDBJc1dVRkJTU3hQUVVGUExFbEJRVWs3UVVGRFppeFpRVUZKTEUxQlFVc3NTVUZCU1N4VFFVRlRMR2RDUVVOb1FpeERRVUZETEVsQlFVa3NVMEZEVEN4SlFVRkpMRk5CUVZNc1YwRkRWQ3hEUVVGRExFbEJRVWtzVVVGRFRDeEpRVUZKTEU5QlFVOHNVMEZCVXl4TFFVTm9RaXhEUVVGRExFbEJRVWtzU1VGQlNTeFZRVU5VTEVsQlFVa3NVVUZCVHl4SlFVRkhMRWxCUVVrc1ZVRkJWU3hKUVVGSE8wRkJRemRETEZsQlFVa3NWMEZCVnl4SlFVRkpMRTFCUVUwN1FVRkRla0lzWlVGQlR5eE5RVUZOTEU5QlFVOHNTMEZCU3l4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVONlF5eGpRVUZKTEZGQlFWRXNVVUZCVHp0QlFVTm1MR2RDUVVGSkxGTkJRVk03UVVGRFZDeHpRa0ZCVHl4SlFVRkpPMEZCUTJZc2RVSkJRVmNzVVVGQlVUdEJRVU51UWl4blFrRkJTU3hWUVVGVkxIZENRVUYzUWl4UFFVRk5PMEZCUXpWRExHZENRVUZKTEVOQlFVTXNWMEZCVnl4VFFVRlRMRTlCUVU4N1FVRkROVUlzTWtKQlFXRXNVVUZCVVR0QlFVRkJPMEZCUlhwQ0xHZENRVUZKTEZkQlFWY3NVMEZCVXp0QlFVTndRaXh0UTBGQmNVSXNZVUZCWVN4UlFVRlJMRk5CUVZNN1FVRkJRVHRCUVVGQkxIRkNRVWRzUkN4UFFVRk5PMEZCUTFnc1owSkJRVWtzVVVGQlVTeERRVUZGTEUxQlFVMHNUVUZCU3l4UFFVRlBMRWxCUVVrc1RVRkJTenRCUVVONlF5eDVRa0ZCWVN4SlFVRkpPMEZCUTJwQ0xIVkNRVUZYTEVsQlFVazdRVUZCUVN4cFFrRkZaRHRCUVVORUxIVkNRVUZYTEVsQlFVazdRVUZEWml4NVFrRkJZU3hKUVVGSk8wRkJRMnBDTEcxQ1FVRlBMRkZCUVZFc1VVRkJVU3hUUVVGVkxFdEJRVXM3UVVGQlJTeHhRa0ZCVHl4WlFVRlpMRWxCUVVrc1RVRkJUU3hKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVVUzUlN4cFFrRkJUenRCUVVGQk8wRkJRVUU3UVVGSGJrSXNWVUZCU1N4WFFVRlhMRk5CUVZVc1MwRkJTVHRCUVVONlFpeFpRVUZKTEVsQlFVazdRVUZEVWl4WlFVRkpMRXRCUVVzc1NVRkJSeXhQUVVGUExGRkJRVkVzUjBGQlJ5eFBRVUZQTEZGQlFWRXNSMEZCUnp0QlFVTm9SQ3hsUVVGUE8wRkJRVUVzVlVGRFNEdEJRVUZCTEZWQlEwRXNTVUZCU1N4VFFVRlZMRTFCUVVzc1RVRkJUU3hYUVVGWExGRkJRVkVzVDBGQlR5eFRRVUZUTEV0QlFVc3NTMEZCU3l4VFFVRlZMRTFCUVVzc1RVRkJUU3hYUVVGWExGRkJRVkVzVDBGQlR5eFRRVUZUTEV0QlFVc3NTMEZCU3p0QlFVRkJPMEZCUVVFN1FVRkhhRW9zVlVGQlNTeHJRa0ZCYTBJN1FVRkJRU3hSUVVOc1FpeExRVUZMTEZOQlFWVXNTMEZCU3p0QlFVRkZMR2xDUVVGUExFTkJRVU1zV1VGQldTeEpRVUZKTEZOQlFWTXNTVUZCU1R0QlFVRkJPMEZCUVVFc1VVRkRNMFFzVTBGQlV5eFRRVUZWTEV0QlFVczdRVUZCUlN4cFFrRkJUeXhEUVVGRExGbEJRVmtzU1VGQlNTeFhRVUZYTEZGQlFWRXNTVUZCU1R0QlFVRkJPMEZCUVVFc1VVRkRla1VzVDBGQlR6dEJRVUZCTEZGQlExQXNUMEZCVHp0QlFVRkJMRkZCUTFBc1dVRkJXVHRCUVVGQk8wRkJSV2hDTEZkQlFVc3NhVUpCUVdsQ0xGRkJRVkVzVTBGQlZTeFJRVUZSTzBGQlF6VkRMRzFDUVVGWExGVkJRVlVzVTBGQlZTeExRVUZMTzBGQlEyaERMR05CUVVrc1UwRkJVeXhKUVVGSk8wRkJRMnBDTEdOQlFVa3NVVUZCVVR0QlFVTlNMR2RDUVVGSkxHTkJRV01zVTBGQlZTeFhRVUZYTzBGQlEyNURMR3RDUVVGSkxFOUJRVThzVjBGQlZ5eFRRVUZUTEUxQlFVMHNXVUZCV1N4TlFVRk5PMEZCUTNaRUxIRkNRVUZSTEU5QlFVOHNVMEZEVml4UlFVRlBMRkZCUVZFc1NVRkJTVHRCUVVGQk8wRkJSVFZDTEdkQ1FVRkpMR1ZCUVdVc1dVRkJXVHRCUVVNdlFpeG5Ra0ZCU1N4cFFrRkJhVUlzV1VGQldUdEJRVU5xUXl4blFrRkJTU3hOUVVGTExHZENRVUZuUWl4UlFVRlJMRTFCUVUwc1pVRkJaU3hKUVVGSExFbEJRVWtzWjBKQlFXZENMRWxCUVVjN1FVRkRhRVlzZDBKQlFWa3NZVUZCWVN4UlFVRlJMRWxCUVVrc1NVRkJTVHRCUVVONlF5eG5Ra0ZCU1N4RFFVRkRMR0ZCUVdFc1kwRkJZenRCUVVNMVFpeHJRa0ZCU1N4WFFVRlhMRk5CUVZNN1FVRkRjRUlzSzBKQlFXVXNTVUZCU1R0QlFVRkJMSEZDUVVWc1FqdEJRVU5FTEc5Q1FVRkpMR2RDUVVGblFpeFhRVUZYTEZkQlF6TkNMRmxCUTBFc1NVRkJTU3hWUVVOS0xFMUJRVTBzVFVGQlRTeFRRVUZUTEZOQlFWTXNTVUZCU1N4TlFVRk5MRU5CUVVVc1VVRkJVVHRCUVVOMFJDeDFRa0ZCVHl4TlFVRk5MRkZCUVZFc1RVRkJUU3hOUVVGTkxGZEJRVmNzUzBGQlN5eFRRVUZWTEV0QlFVczdRVUZETlVRc2MwSkJRVWtzVjBGQlZ5eFRRVUZUTzBGQlEzQkNMSGRDUVVGSkxGbEJRVmtzU1VGQlNTeFJRVUZSTzBGQlEzaENMRFpDUVVGUExHTkJRV01zUzBGQlN5eFRRVUZWTEV0QlFVazdRVUZEY0VNc05FSkJRVWtzWjBKQlFXZENMRWxCUVVjN1FVRkRka0lzY1VOQlFXRXNVVUZCVVR0QlFVTnlRaXdyUWtGQlR6dEJRVUZCTzBGQlFVRTdRVUZIWml4M1FrRkJTU3hSUVVGUkxFbEJRVWtzVTBGRFZpeEpRVUZKTEU5QlFVOHNTVUZCU1N4alFVTm1MRWxCUVVrN1FVRkRWaXgzUWtGQlNTeEpRVUZKTEZGQlFWRTdRVUZEV2l4dFEwRkJZU3hSUVVGUk8wRkJRVUVzTWtKQlJYQkNPMEZCUTBRc2NVTkJRV1VzVVVGQlVUdEJRVUZCTzBGQlFVRXNOa0pCUjNSQ0xGZEJRVmNzWTBGQll6dEJRVU01UWl4M1FrRkJTU3hYUVVGWE8wRkJRMllzZDBKQlFVa3NaVUZCWlN4SlFVRkpPMEZCUTNaQ0xESkNRVUZSTEZsQlEwb3NUMEZCVHl4UFFVRlBMRlZCUVZVN1FVRkJRU3h6UWtGRGNFSXNTMEZCU3p0QlFVRkJMSGRDUVVORUxFdEJRVXNzVjBGQldUdEJRVU5pTEhsRFFVRmxMRTlCUVU4c1UwRkJVenRCUVVNdlFpeHBRMEZCVHl4VFFVRlRPMEZCUVVFN1FVRkJRVHRCUVVGQkxITkNRVWQ0UWl4WlFVRlpPMEZCUVVFc2QwSkJRMUlzUzBGQlN5eFhRVUZaTzBGQlEySXNPRUpCUVVrc1QwRkJUeXhUUVVGVE8wRkJRM0JDTEhsRFFVRmxMRTlCUVU4N1FVRkRkRUlzYVVOQlFVODdRVUZCUVR0QlFVRkJPMEZCUVVFc2MwSkJSMllzVDBGQlR6dEJRVUZCTEhkQ1FVTklMRXRCUVVzc1YwRkJXVHRCUVVOaUxEQkRRVUZuUWl4aFFVRmhMRTlCUVU4c1UwRkJVenRCUVVNM1F5eHBRMEZCVHl4VFFVRlRPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTGNFTXNlVUpCUVU4N1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXQyUWl4cFFrRkJUeXhOUVVGTkxGRkJRVkVzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVZDZReXhoUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNYWkNMRGhDUVVFNFFpeGhRVUZoTEZGQlFWRXNVMEZCVXl4VFFVRlRPMEZCUTJwRkxEUkNRVUV3UWl4SlFVRkpPMEZCUXpGQ0xGRkJRVWtzVjBGQlZ5eFpRVUZaTEVkQlFVY3NVVUZCVVR0QlFVTjBReXgzUWtGQmIwSXNTMEZCU3p0QlFVTnlRaXhoUVVGUExFOUJRVThzVDBGQlR5eEhRVUZITEZkQlFWY3NUMEZCVHp0QlFVRkJPMEZCUlRsRExGRkJRVWtzWlVGQlpTeFRRVUZWTEV0QlFVczdRVUZCUlN4aFFVRlBMRWRCUVVjc1kwRkJZeXhSUVVGUkxFOUJRemxFTEVsQlFVa3NVVUZCVVN4VFFVRlZMRTFCUVVzN1FVRkJSU3hsUVVGUExGTkJRVk1zVDBGQlR6dEJRVUZCTEZkQlEzQkVMRk5CUVZNc1QwRkJUenRCUVVGQk8wRkJRM1JDTEVsQlFVTXNXVUZCVnl4VFFVRlRMRkZCUVZFc1UwRkJWU3hIUVVGSExFZEJRVWM3UVVGRGVrTXNWVUZCU1N4VFFVRlRMRmRCUVZjc1YwRkJWeXhSUVVGUk8wRkJRek5ETEZWQlFVa3NVMEZCVXl4WFFVRlhMRmRCUVZjc1VVRkJVVHRCUVVNelF5eFZRVUZKTEVsQlFVa3NVVUZCVVN4WlFVRlpMRWRCUVVjN1FVRkRNMElzV1VGQlNTeFZRVUZWTzBGQlExWXNkVUpCUVdFN1FVRkRha0lzV1VGQlNTeFZRVUZWTzBGQlExWXNkVUpCUVdFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSk4wSXNVMEZCVHl4UlFVRlJMRkZCUVZFN1FVRkJRVHRCUVVjelFpeEpRVUZKTEZWQlFWa3NWMEZCV1R0QlFVTjRRaXhyUWtGQlpTeE5RVUZOTEZOQlFWTTdRVUZETVVJc1VVRkJTU3hSUVVGUk8wRkJRMW9zVTBGQlN5eGxRVUZsTzBGQlEzQkNMRk5CUVVzc1VVRkJVVHRCUVVOaUxGRkJRVWtzVDBGQlR5eFBRVUZOTzBGQlEycENMRk5CUVVzc1YwRkJWeXhWUVVGVkxGTkJRVk03UVVGQlFTeE5RVU12UWl4UlFVRlJMRTlCUVUwN1FVRkJRU3hOUVVGUkxGVkJRVlU3UVVGQlFTeE5RVU5vUXl4WFFVRlhMRXRCUVVzN1FVRkJRU3hOUVVGWExHRkJRV0VzUzBGQlN6dEJRVUZCTEU5QlFXVTdRVUZEYUVVc1UwRkJTeXhSUVVGUk8wRkJRVUVzVFVGRFZDeFhRVUZYTEZGQlFWRTdRVUZCUVN4TlFVTnVRaXhoUVVGaExGRkJRVkU3UVVGQlFUdEJRVVY2UWl4UlFVRkpMRk5CUVZNc1VVRkJVVHRCUVVOeVFpeFRRVUZMTEZsQlFWazdRVUZEYWtJc1UwRkJTeXhaUVVGWk8wRkJRMnBDTEZOQlFVc3NZMEZCWXp0QlFVTnVRaXhUUVVGTExHRkJRV0U3UVVGRGJFSXNVMEZCU3l4UlFVRlJPMEZCUTJJc1VVRkJTU3hSUVVGUk8wRkJRVUVzVFVGRFVpeGhRVUZoTzBGQlFVRXNUVUZEWWl4bFFVRmxPMEZCUVVFc1RVRkRaaXh0UWtGQmJVSTdRVUZCUVN4TlFVTnVRaXhqUVVGak8wRkJRVUVzVFVGRFpDeG5Ra0ZCWjBJN1FVRkJRU3hOUVVOb1FpeG5Ra0ZCWjBJN1FVRkJRU3hOUVVOb1FpeFpRVUZaTzBGQlFVRXNUVUZEV2l4bFFVRmxPMEZCUVVFc1RVRkRaaXhaUVVGWk8wRkJRVUU3UVVGRmFFSXNWVUZCVFN4cFFrRkJhVUlzU1VGQlNTeGhRVUZoTEZOQlFWVXNVMEZCVXp0QlFVTjJSQ3haUVVGTkxHbENRVUZwUWp0QlFVRkJPMEZCUlROQ0xGVkJRVTBzWjBKQlFXZENMRWxCUVVrc1lVRkJZU3hUUVVGVkxFZEJRVWNzVVVGQlVUdEJRVU40UkN4WlFVRk5MR0ZCUVdFN1FVRkJRVHRCUVVWMlFpeFRRVUZMTEZOQlFWTTdRVUZEWkN4VFFVRkxMRTlCUVU4N1FVRkRXaXhUUVVGTExFdEJRVXNzVDBGQlR5eE5RVUZOTEZsQlFWa3NWMEZCVnl4cFFrRkJhVUlzVTBGQlV5eERRVUZGTEU5QlFVOHNRMEZCUXl4cFFrRkJhVUk3UVVGRGJrY3NVMEZCU3l4SFFVRkhMRTFCUVUwc1dVRkJXU3hUUVVGVExFdEJRVXNzUjBGQlJ5eE5RVUZOTEZkQlFWY3NVMEZCVlN4WFFVRlhPMEZCUXpkRkxHRkJRVThzVTBGQlZTeFpRVUZaTEZOQlFWTTdRVUZEYkVNc1pVRkJUU3hKUVVGSkxGZEJRVms3UVVGRGJFSXNZMEZCU1N4VFFVRlJMRTFCUVUwN1FVRkRiRUlzWTBGQlNTeFBRVUZOTEdOQlFXTTdRVUZEY0VJc1owSkJRVWtzUTBGQlF5eFBRVUZOTzBGQlExQXNNa0pCUVdFc1ZVRkJWU3hMUVVGTE8wRkJRMmhETEdkQ1FVRkpPMEZCUTBFc2QwSkJRVlU3UVVGQlFTeHhRa0ZGVkN4UFFVRk5MRzFDUVVGdFFqdEJRVU01UWl4dFFrRkJUU3hyUWtGQmEwSXNTMEZCU3p0QlFVTTNRaXhuUWtGQlNUdEJRVU5CTEhkQ1FVRlZPMEZCUVVFc2FVSkJSV0k3UVVGRFJDeHpRa0ZCVlR0QlFVTldMR2RDUVVGSkxFOUJRVTg3UVVGRFdDeG5Ra0ZCU1N4RFFVRkRPMEZCUTBRc2QwSkJRVlVzZFVKQlFYVkNPMEZCUXpkQ0xIRkNRVUZMTEVkQlFVY3NUVUZCVFN4WlFVRlpPMEZCUXpGQ0xIRkNRVUZMTEVkQlFVY3NUVUZCVFN4WlFVRlpPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVTFzUkN4VFFVRkxMR0ZCUVdFc05FSkJRVFJDTzBGQlF6bERMRk5CUVVzc1VVRkJVU3gxUWtGQmRVSTdRVUZEY0VNc1UwRkJTeXhqUVVGakxEWkNRVUUyUWp0QlFVTm9SQ3hUUVVGTExGVkJRVlVzZVVKQlFYbENPMEZCUTNoRExGTkJRVXNzWTBGQll5dzJRa0ZCTmtJN1FVRkRhRVFzVTBGQlN5eEhRVUZITEdsQ1FVRnBRaXhUUVVGVkxFbEJRVWs3UVVGRGJrTXNWVUZCU1N4SFFVRkhMR0ZCUVdFN1FVRkRhRUlzWjBKQlFWRXNTMEZCU3l4dFJFRkJiVVFzVFVGQlRTeFBRVUZQTzBGQlFVRTdRVUZGTjBVc1owSkJRVkVzUzBGQlN5eHJSRUZCYTBRc1RVRkJUU3hQUVVGUE8wRkJRMmhHTEZsQlFVMDdRVUZCUVR0QlFVVldMRk5CUVVzc1IwRkJSeXhYUVVGWExGTkJRVlVzU1VGQlNUdEJRVU0zUWl4VlFVRkpMRU5CUVVNc1IwRkJSeXhqUVVGakxFZEJRVWNzWVVGQllTeEhRVUZITzBGQlEzSkRMR2RDUVVGUkxFdEJRVXNzYlVKQlFXMUNMRTFCUVUwc1QwRkJUenRCUVVGQk8wRkJSVGRETEdkQ1FVRlJMRXRCUVVzc1kwRkJZeXhOUVVGTkxFOUJRVThzYlVSQlFXMUVMRWRCUVVjc1lVRkJZVHRCUVVGQk8wRkJSVzVJTEZOQlFVc3NWVUZCVlN4VlFVRlZMRkZCUVZFN1FVRkRha01zVTBGQlN5eHhRa0ZCY1VJc1UwRkJWU3hOUVVGTkxGbEJRVmtzVlVGQlZTeHRRa0ZCYlVJN1FVRkJSU3hoUVVGUExFbEJRVWtzVFVGQlRTeFpRVUZaTEUxQlFVMHNXVUZCV1N4VlFVRlZPMEZCUVVFN1FVRkRPVWtzVTBGQlN5eHBRa0ZCYVVJc1UwRkJWU3hKUVVGSk8wRkJRMmhETEZsQlFVMHNSMEZCUnl4WFFVRlhMRXRCUVVzN1FVRkRla0lzYTBKQlEwc3NUMEZCVHl4VFFVRlZMRWRCUVVjN1FVRkJSU3hsUVVGUExFVkJRVVVzVTBGQlV5eE5RVUZOTEZGQlFWRXNUVUZCVFN4VFFVRlRMRU5CUVVNc1JVRkJSU3hQUVVGUE8wRkJRVUVzVTBGREwwVXNTVUZCU1N4VFFVRlZMRWRCUVVjN1FVRkJSU3hsUVVGUExFVkJRVVVzUjBGQlJ5eHBRa0ZCYVVJc1MwRkJTenRCUVVGQk8wRkJRVUU3UVVGRk9VUXNVMEZCU3l4SlFVRkpPMEZCUTFRc1UwRkJTeXhKUVVGSk8wRkJRMVFzVTBGQlN5eEpRVUZKTzBGQlExUXNVMEZCU3l4SlFVRkpPMEZCUTFRc1YwRkJUeXhSUVVGUkxGTkJRVlVzVDBGQlR6dEJRVUZGTEdGQlFVOHNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkZia1FzVTBGQlRTeFZRVUZWTEZWQlFWVXNVMEZCVlN4bFFVRmxPMEZCUXk5RExGRkJRVWtzVFVGQlRTeHJRa0ZCYTBJc1owSkJRV2RDTzBGQlEzaERMRmxCUVUwc1NVRkJTU3hYUVVGWExFdEJRVXM3UVVGRE9VSXNiMEpCUVdkQ0xFdEJRVXNzVFVGQlRTeG5Ra0ZCWjBJc1RVRkJUVHRCUVVOcVJDeFJRVUZKTEV0QlFVc3NVMEZCVXl4TFFVRkxMRTlCUVU4N1FVRkRNVUlzV1VGQlRTeEpRVUZKTEZkQlFWY3NUMEZCVHp0QlFVTm9ReXhUUVVGTExGRkJRVkVzUzBGQlN5eEpRVUZKTEV0QlFVc3NUMEZCVHp0QlFVTnNReXhSUVVGSkxGZEJRVmNzUzBGQlN6dEJRVU53UWl4UlFVRkpMR3RDUVVGclFpeFRRVUZUTEU5QlFVOHNVMEZCVlN4SFFVRkhPMEZCUVVVc1lVRkJUeXhGUVVGRkxFdEJRVXNzV1VGQldUdEJRVUZCTEU5QlFXdENPMEZCUTJwSExGRkJRVWs3UVVGRFFTeGhRVUZQTzBGQlExZ3NjMEpCUVd0Q0xFbEJRVWtzUzBGQlN5eFJRVUZSTzBGQlEyNURMR0ZCUVZNc1MwRkJTenRCUVVOa0xHRkJRVk1zUzBGQlN6dEJRVU5rTEc5Q1FVRm5RaXhQUVVGUE8wRkJRM1pDTEZOQlFVc3NUMEZCVHl4aFFVRmhPMEZCUTNwQ0xGZEJRVTg3UVVGQlFUdEJRVVZZTEZOQlFVMHNWVUZCVlN4aFFVRmhMRk5CUVZVc1NVRkJTVHRCUVVOMlF5eFJRVUZKTEZGQlFWRTdRVUZEV2l4WFFVRlBMRXRCUVVzc1QwRkJUeXhuUWtGQlowSXNTVUZCU1N4aFFVRmhMRTlCUVU4c1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlEyNUhMRlZCUVVrc1EwRkJReXhOUVVGTkxFOUJRVThzWlVGQlpUdEJRVU0zUWl4WlFVRkpMRU5CUVVNc1RVRkJUU3hUUVVGVExGVkJRVlU3UVVGRE1VSXNhVUpCUVU4c1NVRkJTU3hYUVVGWE8wRkJRM1JDTzBGQlFVRTdRVUZGU2l4alFVRk5MRTlCUVU4c1RVRkJUVHRCUVVGQk8wRkJSWFpDTEZsQlFVMHNUMEZCVHl4bFFVRmxMRXRCUVVzc1UwRkJVenRCUVVGQkxFOUJRek5ETEV0QlFVczdRVUZCUVR0QlFVVmFMRk5CUVUwc1ZVRkJWU3hOUVVGTkxGTkJRVlVzUzBGQlNUdEJRVU5vUXl4UlFVRkpMRkZCUVZFc1NVRkJSeXhQUVVGUExGTkJRVk1zU1VGQlJ5eFJRVUZSTEZGQlFWRXNTVUZCUnl4UFFVRlBMRTlCUVU4c1NVRkJSenRCUVVOMFJTeFJRVUZKTzBGQlEwRXNWMEZCU3l4TlFVRk5MRU5CUVVVc1QwRkJZenRCUVVNdlFpeFJRVUZKTEdOQlFXTXNTMEZCU3l4aFFVRmhMRlZCUVZjc1RVRkJTeXhoUVVGaExGTkJRVk03UVVGRE1VVXNaMEpCUVZrc1MwRkJTeXhEUVVGRkxFOUJRV01zVVVGQlowSXNUMEZCVHl4VFFVRlRMRTlCUVU4c1MwRkJTeXhQUVVGUE8wRkJRM0JHTEdkQ1FVRlpMRXRCUVVzc1UwRkJWU3hIUVVGSExFZEJRVWM3UVVGQlJTeGhRVUZQTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUVVFN1FVRkRkRVFzVjBGQlR6dEJRVUZCTzBGQlJWZ3NVMEZCVFN4VlFVRlZMRkZCUVZFc1UwRkJWU3hMUVVGSk8wRkJRMnhETEZGQlFVa3NVVUZCVVN4SlFVRkhMRTlCUVU4c1QwRkJUeXhKUVVGSExFMUJRVTBzVTBGQlV5eEpRVUZITzBGQlEyeEVMRkZCUVVrc1UwRkJVeXhMUVVGTExHRkJRV0VzVVVGQlVUdEJRVU51UXl4WFFVRkxMR0ZCUVdFc1UwRkJVeXhMUVVGTExHRkJRV0VzVDBGQlR5eFBRVUZQTEZOQlFWVXNTVUZCU1R0QlFVTnlSU3hsUVVGUExGTkJRVk1zUjBGQlJ5eFhRVUZYTEZOQlF6RkNMRTlCUVU4c1IwRkJSeXhUUVVGVExFOUJRMlk3UVVGQlFUdEJRVUZCTzBGQlIyaENMRmRCUVU4N1FVRkJRVHRCUVVWWUxGTkJRVTBzVlVGQlZTeFBRVUZQTEZkQlFWazdRVUZETDBJc1YwRkJUeXhWUVVGVk8wRkJRVUU3UVVGRmNrSXNVMEZCVFN4VlFVRlZMRkZCUVZFc1YwRkJXVHRCUVVOb1F5eFJRVUZKTEUxQlFVMHNXVUZCV1N4UlFVRlJMRTlCUVU4c1VVRkJVU3hMUVVGTE8wRkJRMnhFTEZGQlFVa3NUMEZCVHp0QlFVTlFMR3RDUVVGWkxFOUJRVThzUzBGQlN6dEJRVU0xUWl4UlFVRkpMRXRCUVVzc1QwRkJUenRCUVVOYUxGVkJRVWs3UVVGRFFTeGhRVUZMTEUxQlFVMDdRVUZCUVN4bFFVVlNMRWRCUVZBN1FVRkJRVHRCUVVOQkxGZEJRVXNzVVVGQlVUdEJRVUZCTzBGQlJXcENMRk5CUVVzc1UwRkJVeXhYUVVGWE8wRkJRM3BDTEZWQlFVMHNZMEZCWXl4SlFVRkpMRmRCUVZjN1FVRkRia01zVVVGQlNTeE5RVUZOTzBGQlEwNHNXVUZCVFN4WFFVRlhMRTFCUVUwN1FVRkRNMElzVlVGQlRTeHBRa0ZCYVVJc1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV6dEJRVU4yUkN4WlFVRk5MR2xDUVVGcFFqdEJRVUZCTzBGQlJUTkNMRlZCUVUwc1owSkJRV2RDTEVsQlFVa3NZVUZCWVN4VFFVRlZMRWRCUVVjc1VVRkJVVHRCUVVONFJDeFpRVUZOTEdGQlFXRTdRVUZCUVR0QlFVRkJPMEZCUnpOQ0xGTkJRVTBzVlVGQlZTeFRRVUZUTEZkQlFWazdRVUZEYWtNc1VVRkJTU3hSUVVGUk8wRkJRMW9zVVVGQlNTeGxRVUZsTEZWQlFWVXNVMEZCVXp0QlFVTjBReXhSUVVGSkxGRkJRVkVzUzBGQlN6dEJRVU5xUWl4WFFVRlBMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU12UXl4VlFVRkpMRmRCUVZjc1YwRkJXVHRCUVVOMlFpeGpRVUZOTzBGQlEwNHNXVUZCU1N4TlFVRk5MRTFCUVUwc1RVRkJUU3hWUVVGVkxHVkJRV1VzVFVGQlRUdEJRVU55UkN4WlFVRkpMRmxCUVZrc1MwRkJTeXhYUVVGWk8wRkJRemRDTERaQ1FVRnRRaXhOUVVGTkxFOUJRVThzVFVGQlRUdEJRVU4wUXp0QlFVRkJPMEZCUlVvc1dVRkJTU3hWUVVGVkxHMUNRVUZ0UWp0QlFVTnFReXhaUVVGSkxGbEJRVmtzVFVGQlRUdEJRVUZCTzBGQlJURkNMRlZCUVVrN1FVRkRRU3hqUVVGTkxFbEJRVWtzVjBGQlZ5eG5Ra0ZCWjBJN1FVRkRla01zVlVGQlNTeE5RVUZOTEdWQlFXVTdRVUZEY2tJc1kwRkJUU3hsUVVGbExFdEJRVXM3UVVGQlFTeGhRVVY2UWp0QlFVTkVPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTVm9zVTBGQlRTeFZRVUZWTEZsQlFWa3NWMEZCV1R0QlFVTndReXhYUVVGUExFdEJRVXM3UVVGQlFUdEJRVVZvUWl4VFFVRk5MRlZCUVZVc1UwRkJVeXhYUVVGWk8wRkJRMnBETEZkQlFVOHNTMEZCU3l4VlFVRlZPMEZCUVVFN1FVRkZNVUlzVTBGQlRTeFZRVUZWTEdkQ1FVRm5RaXhYUVVGWk8wRkJRM2hETEZGQlFVa3NZMEZCWXl4TFFVRkxMRTlCUVU4N1FVRkRPVUlzVjBGQlR5eGxRVUZuUWl4WlFVRlpMRk5CUVZNN1FVRkJRVHRCUVVWb1JDeFRRVUZOTEZWQlFWVXNXVUZCV1N4WFFVRlpPMEZCUTNCRExGZEJRVThzUzBGQlN5eFBRVUZQTEdkQ1FVRm5RanRCUVVGQk8wRkJSWFpETEZOQlFVMHNWVUZCVlN4dlFrRkJiMElzVjBGQldUdEJRVU0xUXl4WFFVRlBMRXRCUVVzc1QwRkJUenRCUVVGQk8wRkJSWFpDTEZOQlFVOHNaVUZCWlN4UFFVRk5MRmRCUVZjc1ZVRkJWVHRCUVVGQkxFbEJRemRETEV0QlFVc3NWMEZCV1R0QlFVTmlMRlZCUVVrc1VVRkJVVHRCUVVOYUxHRkJRVThzUzBGQlN5eExRVUZMTEZsQlFWa3NTVUZCU1N4VFFVRlZMRTFCUVUwN1FVRkJSU3hsUVVGUExFMUJRVTBzVjBGQlZ6dEJRVUZCTzBGQlFVRTdRVUZCUVN4SlFVVXZSU3haUVVGWk8wRkJRVUVzU1VGRFdpeGpRVUZqTzBGQlFVRTdRVUZGYkVJc1UwRkJUU3hWUVVGVkxHTkJRV01zVjBGQldUdEJRVU4wUXl4UlFVRkpMRTlCUVU4c2RVSkJRWFZDTEUxQlFVMHNUVUZCVFR0QlFVTTVReXhYUVVGUExFdEJRVXNzWVVGQllTeE5RVUZOTEUxQlFVMDdRVUZCUVR0QlFVVjZReXhUUVVGTkxGVkJRVlVzWlVGQlpTeFRRVUZWTEUxQlFVMHNVVUZCVVN4WFFVRlhPMEZCUXpsRUxGRkJRVWtzVVVGQlVUdEJRVU5hTEZGQlFVa3NiMEpCUVc5Q0xFbEJRVWs3UVVGRE5VSXNVVUZCU1N4RFFVRkRMSEZDUVVGeFFpeHJRa0ZCYTBJc1QwRkJUeXhSUVVGUkxFdEJRVXNzVVVGQlVTeFRRVUZUTzBGQlF6ZEZMREJDUVVGdlFqdEJRVU40UWl4UlFVRkpMRzFDUVVGdFFpeExRVUZMTEZGQlFWRXNVMEZCVXp0QlFVTTNReXhYUVVGUExFdEJRVXNzVVVGQlVTeExRVUZMTEVsQlFVa3NVVUZCVVN4TFFVRkxPMEZCUXpGRExGRkJRVWtzVTBGQlV6dEJRVU5pTEZGQlFVazdRVUZEUVN4dFFrRkJZU3hQUVVGUExFbEJRVWtzVTBGQlZTeFBRVUZQTzBGQlEzSkRMRmxCUVVrc1dVRkJXU3hwUWtGQmFVSXNUVUZCVFN4UlFVRlJMRTFCUVUwc1QwRkJUenRCUVVNMVJDeFpRVUZKTEU5QlFVOHNZMEZCWXp0QlFVTnlRaXhuUWtGQlRTeEpRVUZKTEZWQlFWVTdRVUZEZUVJc1pVRkJUenRCUVVGQk8wRkJSVmdzVlVGQlNTeFJRVUZSTEU5QlFVOHNVMEZCVXp0QlFVTjRRaXhyUWtGQlZUdEJRVUZCTEdWQlEwd3NVVUZCVVN4UlFVRlJMRkZCUVZFN1FVRkROMElzYTBKQlFWVTdRVUZCUVR0QlFVVldMR05CUVUwc1NVRkJTU3hYUVVGWExHZENRVUZuUWl3clFrRkJLMEk3UVVGRGVFVXNWVUZCU1N4dFFrRkJiVUk3UVVGRGJrSXNXVUZCU1N4clFrRkJhMElzVTBGQlV5eFpRVUZaTEZsQlFWa3NWMEZCVnp0QlFVTTVSQ3hqUVVGSkxHdENRVUZyUWp0QlFVTnNRaXhuUTBGQmIwSTdRVUZCUVR0QlFVZHdRaXhyUWtGQlRTeEpRVUZKTEZkQlFWY3NaVUZCWlR0QlFVRkJPMEZCUlRWRExGbEJRVWtzYlVKQlFXMUNPMEZCUTI1Q0xIRkNRVUZYTEZGQlFWRXNVMEZCVlN4WFFVRlhPMEZCUTNCRExHZENRVUZKTEhGQ1FVRnhRaXhyUWtGQmEwSXNWMEZCVnl4UlFVRlJMR1ZCUVdVc1NVRkJTVHRCUVVNM1JTeHJRa0ZCU1N4clFrRkJhMEk3UVVGRGJFSXNiME5CUVc5Q08wRkJRVUU3UVVGSGNFSXNjMEpCUVUwc1NVRkJTU3hYUVVGWExHVkJRV1VzVjBGQlZ5eFpRVU16UXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVsd1FpeFpRVUZKTEc5Q1FVRnZRaXh4UWtGQmNVSXNRMEZCUXl4clFrRkJhMElzVVVGQlVUdEJRVU53UlN3NFFrRkJiMEk3UVVGQlFUdEJRVUZCTzBGQlFVRXNZVUZKZWtJc1IwRkJVRHRCUVVOSkxHRkJRVThzYjBKQlEwZ3NhMEpCUVd0Q0xGTkJRVk1zVFVGQlRTeFRRVUZWTEVkQlFVY3NVVUZCVVR0QlFVRkZMR1ZCUVU4N1FVRkJRU3hYUVVNdlJDeFZRVUZWTzBGQlFVRTdRVUZGYkVJc1VVRkJTU3h0UWtGQmJVSXNjMEpCUVhOQ0xFdEJRVXNzVFVGQlRTeE5RVUZOTEZOQlFWTXNXVUZCV1N4dFFrRkJiVUk3UVVGRGRFY3NWMEZCVVN4dlFrRkRTaXhyUWtGQmEwSXNVMEZCVXl4VFFVRlRMR3RDUVVGclFpeFZRVU4wUkN4SlFVRkpMRkZCUTBFc1QwRkJUeXhKUVVGSkxGZEJRVmNzVjBGQldUdEJRVUZGTEdGQlFVOHNUVUZCVFN4WFFVRlhPMEZCUVVFc1UwRkROVVFzUzBGQlN5eFhRVUZYTzBGQlFVRTdRVUZGTlVJc1UwRkJUU3hWUVVGVkxGRkJRVkVzVTBGQlZTeFhRVUZYTzBGQlEzcERMRkZCUVVrc1EwRkJReXhQUVVGUExFdEJRVXNzV1VGQldTeFpRVUZaTzBGQlEzSkRMRmxCUVUwc1NVRkJTU3hYUVVGWExHRkJRV0VzVjBGQlZ5eFpRVUZaTzBGQlFVRTdRVUZGTjBRc1YwRkJUeXhMUVVGTExGZEJRVmM3UVVGQlFUdEJRVVV6UWl4VFFVRlBPMEZCUVVFN1FVRkhXQ3hKUVVGSkxHMUNRVUZ0UWl4UFFVRlBMRmRCUVZjc1pVRkJaU3huUWtGQlowSXNVMEZEYkVVc1QwRkJUeXhuUWtGRFVEdEJRVU5PTEVsQlFVa3NZVUZCWlN4WFFVRlpPMEZCUXpOQ0xIVkNRVUZ2UWl4WFFVRlhPMEZCUXpOQ0xGTkJRVXNzWVVGQllUdEJRVUZCTzBGQlJYUkNMR05CUVZjc1ZVRkJWU3haUVVGWkxGTkJRVlVzUjBGQlJ5eFBRVUZQTEZWQlFWVTdRVUZETTBRc1YwRkJUeXhMUVVGTExGZEJRVmNzVDBGQlR5eE5RVUZOTEdGQlFXRXNRMEZCUlN4TlFVRk5MRWRCUVVjc1QwRkJZeXhaUVVGMVFqdEJRVUZCTzBGQlJYSkhMR05CUVZjc1ZVRkJWU3h2UWtGQmIwSXNWMEZCV1R0QlFVTnFSQ3hYUVVGUE8wRkJRVUU3UVVGRldDeFRRVUZQTzBGQlFVRTdRVUZIV0N4blEwRkJaME1zVVVGQlVTeFJRVUZSTzBGQlF6VkRMRTlCUVVzc1VVRkJVU3hSUVVGUkxGTkJRVlVzVFVGQlRUdEJRVU5xUXl4UlFVRkpMRmRCUVZjc1QwRkJUeXhUUVVGVkxGRkJRVThzVVVGQlVTeEpRVUZKTzBGQlEyNUVMR2RDUVVGWkxGVkJRVlVzVDBGQlR6dEJRVUZCTzBGQlJXcERMRk5CUVU4N1FVRkJRVHRCUVVkWUxHMUNRVUZ0UWl4VFFVRlRPMEZCUTNoQ0xGTkJRVThzU1VGQlNTeFhRVUZYTEZOQlFWVXNWVUZCVlR0QlFVTjBReXhSUVVGSkxHMUNRVUZ0UWl4blFrRkJaMEk3UVVGRGRrTXNjVUpCUVdsQ0xGRkJRVkU3UVVGRGNrSXNWVUZCU1N4clFrRkJhMEk3UVVGRGJFSTdRVUZCUVR0QlFVVktMRlZCUVVrc1QwRkJUeXhYUVVGWk8wRkJRVVVzWlVGQlR5eFRRVUZUTEZOQlFWTXNRMEZCUlN4UlFVRm5RaXhQUVVGUE8wRkJRVUU3UVVGRE0wVXNWVUZCU1N4TFFVRkxMRWxCUVVrc1VVRkZUQ3hQUVVGUExFbEJRVWtzVjBGQlZ5eFJRVU40UWp0QlFVTk9MRlZCUVVrc2EwSkJRV3RDTzBGQlEyeENMRmRCUVVjc1MwRkJTeXg1UWtGQmVVSTdRVUZCUVR0QlFVVnlReXhoUVVGUE8wRkJRVUU3UVVGRldDeFJRVUZKTEZOQlFWTTdRVUZEWWl4UlFVRkpMRmxCUVZrN1FVRkRhRUlzVVVGQlNTeGhRVUZoTzBGQlEycENMRkZCUVVrc1pVRkJaVHRCUVVGQkxGVkJRMWdzVTBGQlV6dEJRVU5VTEdWQlFVODdRVUZCUVR0QlFVRkJMRTFCUlZnc1lVRkJZU3hYUVVGWk8wRkJRM0pDTEdsQ1FVRlRPMEZCUTFRc2NVSkJRV0VzV1VGQldTeFpRVUZaTzBGQlFVRTdRVUZCUVR0QlFVYzNReXhoUVVGVExGTkJRVk1zVTBGQlV5eE5RVUZOTzBGQlEycERMRkZCUVVrc1YwRkJWeXhQUVVGUExHMUNRVUZ0UWp0QlFVTjZReXcwUWtGQmQwSTdRVUZEY0VJc1lVRkJUeXhMUVVGTExGbEJRVmtzUzBGQlN5eFRRVUZWTEV0QlFVczdRVUZEZUVNc1pVRkJUeXhWUVVGVkxGRkJRVkVzWTBGQll5eFZRVUZWTEUxQlFVMHNWMEZCVnp0QlFVRkJPMEZCUVVFN1FVRkhNVVVzVVVGQlNTeHRRa0ZCYlVJc1UwRkJWU3hQUVVGUE8wRkJRM0JETERaQ1FVRjFRaXhYUVVGWE8wRkJRMnhETEZWQlFVa3NaMEpCUVdkQ08wRkJRMmhDTzBGQlFVRTdRVUZCUVR0QlFVZFNMRkZCUVVrc1ZVRkJWU3hYUVVGWk8wRkJRM1JDTEZWQlFVa3NXVUZCV1R0QlFVTmFPMEZCUTBvc2EwSkJRVms3UVVGRFdpeFZRVUZKTEZOQlFWTTdRVUZEWWl4VlFVRkpMRTFCUVUwc1VVRkJVVHRCUVVOc1FpeFZRVUZKTEVOQlFVTXNhMEpCUVd0Q08wRkJRMjVDTEhGQ1FVRmhMR1ZCUVdVN1FVRkROVUlzTWtKQlFXMUNPMEZCUVVFN1FVRkZka0lzYVVKQlFWYzdRVUZEV0N4alFVRlJMRkZCUVZFc1MwRkJTeXhMUVVGTExGTkJRVlVzVVVGQlVUdEJRVU40UXl4dFFrRkJWenRCUVVOWUxGbEJRVWs3UVVGRFFUdEJRVU5LTEZsQlFVa3NaMEpCUVdkQ08wRkJRMmhDTzBGQlFVRXNaVUZGUXp0QlFVTkVMSE5DUVVGWk8wRkJRMW9zZFVKQlFXRTdRVUZEWWl4dFFrRkJVeXhSUVVGUkxGTkJRVk1zUzBGQlN6dEJRVUZCTzBGQlFVRXNVMEZGY0VNc1UwRkJWU3hMUVVGTE8wRkJRMlFzYlVKQlFWYzdRVUZEV0N4cFFrRkJVeXhUUVVGVExGTkJRVk1zVFVGQlRUdEJRVU5xUXl4eFFrRkJZVHRCUVVGQk8wRkJRVUU3UVVGSGNrSTdRVUZEUVN4WFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVsbUxFbEJRVWtzVVVGQlVUdEJRVU5hTEUxQlFVMHNUMEZCVHl4VFFVRlRMRk5CUVZNc1NVRkJTU3h4UWtGQmNVSTdRVUZCUVN4RlFVTndSQ3hSUVVGUkxGTkJRVlVzWTBGQll6dEJRVU0xUWl4UlFVRkpMRXRCUVVzc1NVRkJTU3hOUVVGTk8wRkJRMjVDTEZkQlFVOHNSMEZCUnp0QlFVRkJPMEZCUVVFc1JVRkZaQ3hSUVVGUkxGTkJRVlVzVFVGQlRUdEJRVU53UWl4WFFVRlBMRWxCUVVrc1RVRkJUU3hOUVVGTkxFTkJRVVVzVVVGQlVTeExRVUZOTEU5QlFVOHNTMEZCU3l4VFFVRlZMRWxCUVVrN1FVRkROMFFzVTBGQlJ6dEJRVU5JTEdGQlFVODdRVUZCUVN4UFFVTlNMRTFCUVUwc2RVSkJRWFZDTEZkQlFWazdRVUZCUlN4aFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVGQkxFVkJSWHBFTEd0Q1FVRnJRaXhUUVVGVkxFbEJRVWs3UVVGRE5VSXNVVUZCU1R0QlFVTkJMR0ZCUVU4c2FVSkJRV2xDTEUxQlFVMHNZMEZCWXl4TFFVRkxPMEZCUVVFc1lVRkZPVU1zUzBGQlVEdEJRVU5KTEdGQlFVOHNWVUZCVlN4SlFVRkpMRmRCUVZjN1FVRkJRVHRCUVVGQk8wRkJRVUVzUlVGSGVFTXNZVUZCWVN4WFFVRlpPMEZCUTNKQ0xHMUNRVUZsTEZOQlFWTTdRVUZEY0VJc1lVRkJUeXhOUVVGTk8wRkJRVUU3UVVGRmFrSXNWMEZCVHp0QlFVRkJPMEZCUVVFc1JVRkZXQ3h0UWtGQmJVSXNVMEZCVlN4WFFVRlhPMEZCUTNCRExGZEJRVThzU1VGQlNTeFJRVU5RTEU5QlFVOHNTVUZCU1N4WFFVRlhMR0ZCUTNSQ08wRkJRVUU3UVVGQlFTeEZRVVZTTzBGQlFVRXNSVUZCVlN4UFFVRlBMRk5CUVZVc1lVRkJZVHRCUVVOd1F5eFhRVUZQTEZkQlFWazdRVUZEWml4VlFVRkpPMEZCUTBFc1dVRkJTU3hMUVVGTExHTkJRV01zV1VGQldTeE5RVUZOTEUxQlFVMDdRVUZETDBNc1dVRkJTU3hEUVVGRExFMUJRVTBzVDBGQlR5eEhRVUZITEZOQlFWTTdRVUZETVVJc2FVSkJRVThzWVVGQllTeFJRVUZSTzBGQlEyaERMR1ZCUVU4N1FVRkJRU3hsUVVWS0xFZEJRVkE3UVVGRFNTeGxRVUZQTEZWQlFWVTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRU3hGUVVjeFFpeFBRVUZQTEZOQlFWVXNZVUZCWVN4TlFVRk5MRTFCUVUwN1FVRkRla01zVVVGQlNUdEJRVU5CTEZWQlFVa3NTMEZCU3l4alFVRmpMRmxCUVZrc1RVRkJUU3hOUVVGTkxGRkJRVkU3UVVGRGRrUXNWVUZCU1N4RFFVRkRMRTFCUVUwc1QwRkJUeXhIUVVGSExGTkJRVk03UVVGRE1VSXNaVUZCVHl4aFFVRmhMRkZCUVZFN1FVRkRhRU1zWVVGQlR6dEJRVUZCTEdGQlJVb3NSMEZCVUR0QlFVTkpMR0ZCUVU4c1ZVRkJWVHRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVWQ2UWl4dlFrRkJiMEk3UVVGQlFTeEpRVU5vUWl4TFFVRkxMRmRCUVZrN1FVRkJSU3hoUVVGUExFbEJRVWtzVTBGQlV6dEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVTjRReXhUUVVGVExGTkJRVlVzYlVKQlFXMUNMR2xDUVVGcFFqdEJRVU4wUkN4UlFVRkpMRlZCUVZVc1lVRkJZU3hSUVVGUkxFOUJRVThzYzBKQlFYTkNMR0ZCUXpWRUxFMUJRVTBzYTBKQlFXdENMSEZDUVVONFFpeHRRa0ZEUXl4UlFVRlJMRzFDUVVGdFFqdEJRVU5vUXl4WFFVRlBMRWxCUVVrc1VVRkRVQ3hKUVVGSkxFMUJRVTBzVVVGQlVTeFhRVU5zUWp0QlFVRkJPMEZCUVVFc1JVRkZVaXhUUVVGVE8wRkJRVUVzUlVGRFZDeFBRVUZQTzBGQlFVRXNTVUZEU0N4TFFVRkxMRmRCUVZrN1FVRkJSU3hoUVVGUE8wRkJRVUU3UVVGQlFTeEpRVU14UWl4TFFVRkxMRk5CUVZVc1QwRkJUenRCUVVOc1FpeGxRVUZUTEU5QlFVOHNWVUZCVlN4VlFVRlZMRmRCUVZrN1FVRkJSU3hsUVVGUE8wRkJRVUVzVlVGQlZUdEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVY3pSVHRCUVVGQkxFVkJRV2RDTzBGQlFVRXNSVUZCWjBJN1FVRkJRU3hGUVVGak8wRkJRVUVzUlVGRE9VTTdRVUZCUVN4RlFVRm5RaXhKUVVGSk8wRkJRVUVzUlVGQll6dEJRVUZCTEVWQlEyeERPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRVFJDTzBGQlFVRXNSVUZCTkVJN1FVRkJRU3hGUVVFMFFqdEJRVUZCTEVWQlFUUkNPMEZCUVVFc1JVRkJjMEk3UVVGQlFTeEZRVUU0UWl4TlFVRk5PMEZCUVVFc1JVRkRNVXM3UVVGQlFTeEZRVU5CTEZGQlFWRTdRVUZCUVN4RlFVTlNPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEVzWTBGQll6dEJRVUZCTEVWQlEyUXNVVUZCVVR0QlFVRkJMRVZCUVdVc1UwRkJVeXhqUVVGakxFMUJRVTBzUzBGREwwTXNTVUZCU1N4VFFVRlZMRWRCUVVjN1FVRkJSU3hYUVVGUExGTkJRVk03UVVGQlFTeExRVU51UXl4UFFVRlBMRk5CUVZVc1IwRkJSeXhIUVVGSExFZEJRVWM3UVVGQlJTeFhRVUZQTEVsQlFVc3NTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVU4wUlN4TlFVRk5MRk5CUVZNc1ZVRkJWU3hOUVVGTkxHRkJRV0U3UVVGRk5VTXNjVUpCUVhGQ0xHRkJRV0U3UVVGRE9VSXNUVUZCU1N4UlFVRlJPMEZCUTFvc1RVRkJTVHRCUVVOQkxIbENRVUZ4UWp0QlFVTnlRaXhwUWtGQllTeFpRVUZaTEV0QlFVczdRVUZCUVN4WlFVVnNRenRCUVVOSkxIbENRVUZ4UWp0QlFVRkJPMEZCUVVFN1FVRkhOMElzU1VGQlNTeHRRa0ZCYlVJN1FVRkRka0lzU1VGQlNTeHhRa0ZCY1VJN1FVRkRla0lzU1VGQlNTeHRRa0ZCYlVJN1FVRkRka0lzU1VGQlNTeFBRVUZQTEdGQlFXRXNaVUZCWlN4VFFVRlRMR3RDUVVGclFqdEJRVU01UkN4TlFVRkpMR3RDUVVGclFpeFhRVUZaTzBGQlF6bENMRkZCUVVrc1UwRkJVeXh2UWtGQmIwSXNWMEZCVnp0QlFVTjRReXhWUVVGSkxFOUJRVThzUzBGQlN5eHJRa0ZCYTBJc1UwRkJVeXhIUVVGSE8wRkJRekZETEc5Q1FVRlpPMEZCUVVFN1FVRkZhRUlzZVVKQlFXMUNPMEZCUVVFN1FVRkJRVHRCUVVjelFpeFhRVUZUTEdsQ1FVRnBRaXh2UWtGQmIwSTdRVUZET1VNc2NVSkJRVzFDTEZOQlFWVXNZMEZCWXp0QlFVTjJReXd5UWtGQmRVSXNhMEpCUVd0Q08wRkJRM3BETzBGQlFVRTdRVUZCUVR0QlFVbFNMRWxCUVVrc1QwRkJUeXh4UWtGQmNVSXNZVUZCWVR0QlFVTjZReXhOUVVGSkxFOUJRVThzU1VGQlNTeHBRa0ZCYVVJN1FVRkRhRU1zWlVGQllTeGxRVUZsTEZOQlFWVXNZMEZCWXp0QlFVTm9SQ3hSUVVGSkxFTkJRVU1zYjBKQlFXOUNPMEZCUTNKQ0xGZEJRVXNzV1VGQldUdEJRVUZCTzBGQlFVRTdRVUZIZWtJc1QwRkJTeXhaUVVGWkxGTkJRVlVzU1VGQlNUdEJRVU16UWl4UlFVRkpMRWRCUVVjN1FVRkRTQ3gxUWtGQmFVSXNSMEZCUnp0QlFVRkJPMEZCUVVFc1YwRkhka0lzVDBGQlR5eHBRa0ZCYVVJc1lVRkJZVHRCUVVNeFF5eGxRVUZoTEdWQlFXVXNVMEZCVlN4alFVRmpPMEZCUTJoRUxGRkJRVWs3UVVGRFFTeFZRVUZKTEVOQlFVTXNiMEpCUVc5Q08wRkJRM0pDTEhGQ1FVRmhMRkZCUVZFc2NVSkJRWEZDTEV0QlFVc3NWVUZCVlR0QlFVRkJMRlZCUTNKRUxFMUJRVTBzUzBGQlN6dEJRVUZCTEZWQlExZzdRVUZCUVR0QlFVRkJPMEZCUVVFc1lVRkpUQ3hMUVVGUU8wRkJRVUU3UVVGQlFUdEJRVVZLTEcxQ1FVRnBRaXhYUVVGWExGTkJRVlVzU1VGQlNUdEJRVU4wUXl4UlFVRkpMRWRCUVVjc1VVRkJVU3h4UWtGQmNVSTdRVUZEYUVNc1ZVRkJTU3hQUVVGUExFdEJRVXNzVFVGQlRTeEhRVUZITzBGQlEzcENMRlZCUVVrN1FVRkRRU3g1UWtGQmFVSXNTMEZCU3p0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0MFF5eGhRVUZoTEd0Q1FVRnJRanRCUVVNdlFpeFRRVUZUTEU5QlFVODdRVUZGYUVJc1pVRkJaVHRCUVVObU95SXNDaUFnSW01aGJXVnpJam9nVzEwS2ZRbz1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRyxXQUFXO0FBQzFCLEVBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQ3BELElBQUksS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekQsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3JCLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsS0FBSztBQUNMLElBQUksT0FBTyxDQUFDLENBQUM7QUFDYixHQUFHLENBQUM7QUFDSixFQUFFLE9B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QyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFO0FBQzdDLElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLEdBQUcsQ0FBQztBQUNKLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxPQUFPLEVBQUU7QUFDN0MsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDO0FBQ0osRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLFFBQVEsRUFBRTtBQUM3QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxHQUFHLENBQUM7QUFDSixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsWUFBWSxFQUFFO0FBQ3BELElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JELEdBQUcsQ0FBQztBQUNKLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsV0FBVztBQUM3QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakUsR0FBRyxDQUFDO0FBQ0osRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUssRUFBRTtBQUM3QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENB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QUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNCLEtBQUs7QUFDTCxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzFCLE1BQU0sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxNQUFNLE9BQU8sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDNUQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3BDLE1BQU0sT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQixHQUFHLENBQUM7QUFDSixFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsRUFBRSxFQUFFO0FBQy9DLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQ3RDLE1BQU0sSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUMzQixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtBQUM3RSxRQUFRLElB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
