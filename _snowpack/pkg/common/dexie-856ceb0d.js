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
var DEXIE_VERSION = "3.1.0-beta.11";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4aWUtODU2Y2ViMGQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kZXhpZS9kaXN0L2RleGllLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1Jcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbjIodCkge1xuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAodmFyIHAgaW4gcylcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG4gIH07XG4gIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcbiAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXG4gICAgdG9bal0gPSBmcm9tW2ldO1xuICByZXR1cm4gdG87XG59XG52YXIga2V5cyA9IE9iamVjdC5rZXlzO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xudmFyIF9nbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogZ2xvYmFsO1xuaWYgKHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICYmICFfZ2xvYmFsLlByb21pc2UpIHtcbiAgX2dsb2JhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGV4dGVuZChvYmosIGV4dGVuc2lvbikge1xuICBpZiAodHlwZW9mIGV4dGVuc2lvbiAhPT0gXCJvYmplY3RcIilcbiAgICByZXR1cm4gb2JqO1xuICBrZXlzKGV4dGVuc2lvbikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBvYmpba2V5XSA9IGV4dGVuc2lvbltrZXldO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbnZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBfaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBoYXNPd24ob2JqLCBwcm9wKSB7XG4gIHJldHVybiBfaGFzT3duLmNhbGwob2JqLCBwcm9wKTtcbn1cbmZ1bmN0aW9uIHByb3BzKHByb3RvLCBleHRlbnNpb24pIHtcbiAgaWYgKHR5cGVvZiBleHRlbnNpb24gPT09IFwiZnVuY3Rpb25cIilcbiAgICBleHRlbnNpb24gPSBleHRlbnNpb24oZ2V0UHJvdG8ocHJvdG8pKTtcbiAgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiID8ga2V5cyA6IFJlZmxlY3Qub3duS2V5cykoZXh0ZW5zaW9uKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHNldFByb3AocHJvdG8sIGtleSwgZXh0ZW5zaW9uW2tleV0pO1xuICB9KTtcbn1cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbmZ1bmN0aW9uIHNldFByb3Aob2JqLCBwcm9wLCBmdW5jdGlvbk9yR2V0U2V0LCBvcHRpb25zKSB7XG4gIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZXh0ZW5kKGZ1bmN0aW9uT3JHZXRTZXQgJiYgaGFzT3duKGZ1bmN0aW9uT3JHZXRTZXQsIFwiZ2V0XCIpICYmIHR5cGVvZiBmdW5jdGlvbk9yR2V0U2V0LmdldCA9PT0gXCJmdW5jdGlvblwiID8ge2dldDogZnVuY3Rpb25PckdldFNldC5nZXQsIHNldDogZnVuY3Rpb25PckdldFNldC5zZXQsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0gOiB7dmFsdWU6IGZ1bmN0aW9uT3JHZXRTZXQsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWV9LCBvcHRpb25zKSk7XG59XG5mdW5jdGlvbiBkZXJpdmUoQ2hpbGQpIHtcbiAgcmV0dXJuIHtcbiAgICBmcm9tOiBmdW5jdGlvbihQYXJlbnQpIHtcbiAgICAgIENoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGFyZW50LnByb3RvdHlwZSk7XG4gICAgICBzZXRQcm9wKENoaWxkLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBDaGlsZCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBleHRlbmQ6IHByb3BzLmJpbmQobnVsbCwgQ2hpbGQucHJvdG90eXBlKVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbmZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApIHtcbiAgdmFyIHBkID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gIHZhciBwcm90bztcbiAgcmV0dXJuIHBkIHx8IChwcm90byA9IGdldFByb3RvKG9iaikpICYmIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgcHJvcCk7XG59XG52YXIgX3NsaWNlID0gW10uc2xpY2U7XG5mdW5jdGlvbiBzbGljZShhcmdzLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfc2xpY2UuY2FsbChhcmdzLCBzdGFydCwgZW5kKTtcbn1cbmZ1bmN0aW9uIG92ZXJyaWRlKG9yaWdGdW5jLCBvdmVycmlkZWRGYWN0b3J5KSB7XG4gIHJldHVybiBvdmVycmlkZWRGYWN0b3J5KG9yaWdGdW5jKTtcbn1cbmZ1bmN0aW9uIGFzc2VydChiKSB7XG4gIGlmICghYilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3NlcnRpb24gRmFpbGVkXCIpO1xufVxuZnVuY3Rpb24gYXNhcCQxKGZuKSB7XG4gIGlmIChfZ2xvYmFsLnNldEltbWVkaWF0ZSlcbiAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICBlbHNlXG4gICAgc2V0VGltZW91dChmbiwgMCk7XG59XG5mdW5jdGlvbiBhcnJheVRvT2JqZWN0KGFycmF5LCBleHRyYWN0b3IpIHtcbiAgcmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGl0ZW0sIGkpIHtcbiAgICB2YXIgbmFtZUFuZFZhbHVlID0gZXh0cmFjdG9yKGl0ZW0sIGkpO1xuICAgIGlmIChuYW1lQW5kVmFsdWUpXG4gICAgICByZXN1bHRbbmFtZUFuZFZhbHVlWzBdXSA9IG5hbWVBbmRWYWx1ZVsxXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCB7fSk7XG59XG5mdW5jdGlvbiB0cnlDYXRjaChmbiwgb25lcnJvciwgYXJncykge1xuICB0cnkge1xuICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9IGNhdGNoIChleCkge1xuICAgIG9uZXJyb3IgJiYgb25lcnJvcihleCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEJ5S2V5UGF0aChvYmosIGtleVBhdGgpIHtcbiAgaWYgKGhhc093bihvYmosIGtleVBhdGgpKVxuICAgIHJldHVybiBvYmpba2V5UGF0aF07XG4gIGlmICgha2V5UGF0aClcbiAgICByZXR1cm4gb2JqO1xuICBpZiAodHlwZW9mIGtleVBhdGggIT09IFwic3RyaW5nXCIpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGtleVBhdGgubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICB2YXIgdmFsID0gZ2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aFtpXSk7XG4gICAgICBydi5wdXNoKHZhbCk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICB2YXIgcGVyaW9kID0ga2V5UGF0aC5pbmRleE9mKFwiLlwiKTtcbiAgaWYgKHBlcmlvZCAhPT0gLTEpIHtcbiAgICB2YXIgaW5uZXJPYmogPSBvYmpba2V5UGF0aC5zdWJzdHIoMCwgcGVyaW9kKV07XG4gICAgcmV0dXJuIGlubmVyT2JqID09PSB2b2lkIDAgPyB2b2lkIDAgOiBnZXRCeUtleVBhdGgoaW5uZXJPYmosIGtleVBhdGguc3Vic3RyKHBlcmlvZCArIDEpKTtcbiAgfVxuICByZXR1cm4gdm9pZCAwO1xufVxuZnVuY3Rpb24gc2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmogfHwga2V5UGF0aCA9PT0gdm9pZCAwKVxuICAgIHJldHVybjtcbiAgaWYgKFwiaXNGcm96ZW5cIiBpbiBPYmplY3QgJiYgT2JqZWN0LmlzRnJvemVuKG9iaikpXG4gICAgcmV0dXJuO1xuICBpZiAodHlwZW9mIGtleVBhdGggIT09IFwic3RyaW5nXCIgJiYgXCJsZW5ndGhcIiBpbiBrZXlQYXRoKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJiBcImxlbmd0aFwiIGluIHZhbHVlKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGtleVBhdGgubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBzZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoW2ldLCB2YWx1ZVtpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBwZXJpb2QgPSBrZXlQYXRoLmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChwZXJpb2QgIT09IC0xKSB7XG4gICAgICB2YXIgY3VycmVudEtleVBhdGggPSBrZXlQYXRoLnN1YnN0cigwLCBwZXJpb2QpO1xuICAgICAgdmFyIHJlbWFpbmluZ0tleVBhdGggPSBrZXlQYXRoLnN1YnN0cihwZXJpb2QgKyAxKTtcbiAgICAgIGlmIChyZW1haW5pbmdLZXlQYXRoID09PSBcIlwiKVxuICAgICAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChpc0FycmF5KG9iaikgJiYgIWlzTmFOKHBhcnNlSW50KGN1cnJlbnRLZXlQYXRoKSkpXG4gICAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRLZXlQYXRoLCAxKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRLZXlQYXRoXTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgb2JqW2N1cnJlbnRLZXlQYXRoXSA9IHZhbHVlO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBpbm5lck9iaiA9IG9ialtjdXJyZW50S2V5UGF0aF07XG4gICAgICAgIGlmICghaW5uZXJPYmopXG4gICAgICAgICAgaW5uZXJPYmogPSBvYmpbY3VycmVudEtleVBhdGhdID0ge307XG4gICAgICAgIHNldEJ5S2V5UGF0aChpbm5lck9iaiwgcmVtYWluaW5nS2V5UGF0aCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICBpZiAoaXNBcnJheShvYmopICYmICFpc05hTihwYXJzZUludChrZXlQYXRoKSkpXG4gICAgICAgICAgb2JqLnNwbGljZShrZXlQYXRoLCAxKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlbGV0ZSBvYmpba2V5UGF0aF07XG4gICAgICB9IGVsc2VcbiAgICAgICAgb2JqW2tleVBhdGhdID0gdmFsdWU7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBkZWxCeUtleVBhdGgob2JqLCBrZXlQYXRoKSB7XG4gIGlmICh0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICBzZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoLCB2b2lkIDApO1xuICBlbHNlIGlmIChcImxlbmd0aFwiIGluIGtleVBhdGgpXG4gICAgW10ubWFwLmNhbGwoa2V5UGF0aCwgZnVuY3Rpb24oa3ApIHtcbiAgICAgIHNldEJ5S2V5UGF0aChvYmosIGtwLCB2b2lkIDApO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc2hhbGxvd0Nsb25lKG9iaikge1xuICB2YXIgcnYgPSB7fTtcbiAgZm9yICh2YXIgbSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duKG9iaiwgbSkpXG4gICAgICBydlttXSA9IG9ialttXTtcbiAgfVxuICByZXR1cm4gcnY7XG59XG52YXIgY29uY2F0ID0gW10uY29uY2F0O1xuZnVuY3Rpb24gZmxhdHRlbihhKSB7XG4gIHJldHVybiBjb25jYXQuYXBwbHkoW10sIGEpO1xufVxudmFyIGludHJpbnNpY1R5cGVOYW1lcyA9IFwiQm9vbGVhbixTdHJpbmcsRGF0ZSxSZWdFeHAsQmxvYixGaWxlLEZpbGVMaXN0LEFycmF5QnVmZmVyLERhdGFWaWV3LFVpbnQ4Q2xhbXBlZEFycmF5LEltYWdlQml0bWFwLEltYWdlRGF0YSxNYXAsU2V0LENyeXB0b0tleVwiLnNwbGl0KFwiLFwiKS5jb25jYXQoZmxhdHRlbihbOCwgMTYsIDMyLCA2NF0ubWFwKGZ1bmN0aW9uKG51bSkge1xuICByZXR1cm4gW1wiSW50XCIsIFwiVWludFwiLCBcIkZsb2F0XCJdLm1hcChmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIHQgKyBudW0gKyBcIkFycmF5XCI7XG4gIH0pO1xufSkpKS5maWx0ZXIoZnVuY3Rpb24odCkge1xuICByZXR1cm4gX2dsb2JhbFt0XTtcbn0pO1xudmFyIGludHJpbnNpY1R5cGVzID0gaW50cmluc2ljVHlwZU5hbWVzLm1hcChmdW5jdGlvbih0KSB7XG4gIHJldHVybiBfZ2xvYmFsW3RdO1xufSk7XG52YXIgaW50cmluc2ljVHlwZU5hbWVTZXQgPSBhcnJheVRvT2JqZWN0KGludHJpbnNpY1R5cGVOYW1lcywgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gW3gsIHRydWVdO1xufSk7XG52YXIgY2lyY3VsYXJSZWZzID0gbnVsbDtcbmZ1bmN0aW9uIGRlZXBDbG9uZShhbnkpIHtcbiAgY2lyY3VsYXJSZWZzID0gdHlwZW9mIFdlYWtNYXAgIT09IFwidW5kZWZpbmVkXCIgJiYgbmV3IFdlYWtNYXAoKTtcbiAgdmFyIHJ2ID0gaW5uZXJEZWVwQ2xvbmUoYW55KTtcbiAgY2lyY3VsYXJSZWZzID0gbnVsbDtcbiAgcmV0dXJuIHJ2O1xufVxuZnVuY3Rpb24gaW5uZXJEZWVwQ2xvbmUoYW55KSB7XG4gIGlmICghYW55IHx8IHR5cGVvZiBhbnkgIT09IFwib2JqZWN0XCIpXG4gICAgcmV0dXJuIGFueTtcbiAgdmFyIHJ2ID0gY2lyY3VsYXJSZWZzICYmIGNpcmN1bGFyUmVmcy5nZXQoYW55KTtcbiAgaWYgKHJ2KVxuICAgIHJldHVybiBydjtcbiAgaWYgKGlzQXJyYXkoYW55KSkge1xuICAgIHJ2ID0gW107XG4gICAgY2lyY3VsYXJSZWZzICYmIGNpcmN1bGFyUmVmcy5zZXQoYW55LCBydik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhbnkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBydi5wdXNoKGlubmVyRGVlcENsb25lKGFueVtpXSkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpbnRyaW5zaWNUeXBlcy5pbmRleE9mKGFueS5jb25zdHJ1Y3RvcikgPj0gMCkge1xuICAgIHJ2ID0gYW55O1xuICB9IGVsc2Uge1xuICAgIHZhciBwcm90byA9IGdldFByb3RvKGFueSk7XG4gICAgcnYgPSBwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSA/IHt9IDogT2JqZWN0LmNyZWF0ZShwcm90byk7XG4gICAgY2lyY3VsYXJSZWZzICYmIGNpcmN1bGFyUmVmcy5zZXQoYW55LCBydik7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBhbnkpIHtcbiAgICAgIGlmIChoYXNPd24oYW55LCBwcm9wKSkge1xuICAgICAgICBydltwcm9wXSA9IGlubmVyRGVlcENsb25lKGFueVtwcm9wXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBydjtcbn1cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuZnVuY3Rpb24gdG9TdHJpbmdUYWcobykge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG59XG52YXIgZ2V0VmFsdWVPZiA9IGZ1bmN0aW9uKHZhbCwgdHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gXCJBcnJheVwiID8gXCJcIiArIHZhbC5tYXAoZnVuY3Rpb24odikge1xuICAgIHJldHVybiBnZXRWYWx1ZU9mKHYsIHRvU3RyaW5nVGFnKHYpKTtcbiAgfSkgOiB0eXBlID09PSBcIkFycmF5QnVmZmVyXCIgPyBcIlwiICsgbmV3IFVpbnQ4QXJyYXkodmFsKSA6IHR5cGUgPT09IFwiRGF0ZVwiID8gdmFsLmdldFRpbWUoKSA6IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpID8gXCJcIiArIG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpIDogdmFsO1xufTtcbmZ1bmN0aW9uIGdldE9iamVjdERpZmYoYSwgYiwgcnYsIHByZngpIHtcbiAgcnYgPSBydiB8fCB7fTtcbiAgcHJmeCA9IHByZnggfHwgXCJcIjtcbiAga2V5cyhhKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICBpZiAoIWhhc093bihiLCBwcm9wKSlcbiAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IHZvaWQgMDtcbiAgICBlbHNlIHtcbiAgICAgIHZhciBhcCA9IGFbcHJvcF0sIGJwID0gYltwcm9wXTtcbiAgICAgIGlmICh0eXBlb2YgYXAgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGJwID09PSBcIm9iamVjdFwiICYmIGFwICYmIGJwKSB7XG4gICAgICAgIHZhciBhcFR5cGVOYW1lID0gdG9TdHJpbmdUYWcoYXApO1xuICAgICAgICB2YXIgYnBUeXBlTmFtZSA9IHRvU3RyaW5nVGFnKGJwKTtcbiAgICAgICAgaWYgKGFwVHlwZU5hbWUgPT09IGJwVHlwZU5hbWUpIHtcbiAgICAgICAgICBpZiAoaW50cmluc2ljVHlwZU5hbWVTZXRbYXBUeXBlTmFtZV0gfHwgaXNBcnJheShhcCkpIHtcbiAgICAgICAgICAgIGlmIChnZXRWYWx1ZU9mKGFwLCBhcFR5cGVOYW1lKSAhPT0gZ2V0VmFsdWVPZihicCwgYnBUeXBlTmFtZSkpIHtcbiAgICAgICAgICAgICAgcnZbcHJmeCArIHByb3BdID0gYltwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0T2JqZWN0RGlmZihhcCwgYnAsIHJ2LCBwcmZ4ICsgcHJvcCArIFwiLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcnZbcHJmeCArIHByb3BdID0gYltwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhcCAhPT0gYnApXG4gICAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IGJbcHJvcF07XG4gICAgfVxuICB9KTtcbiAga2V5cyhiKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICBpZiAoIWhhc093bihhLCBwcm9wKSkge1xuICAgICAgcnZbcHJmeCArIHByb3BdID0gYltwcm9wXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcnY7XG59XG52YXIgaXRlcmF0b3JTeW1ib2wgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sLml0ZXJhdG9yIDogXCJAQGl0ZXJhdG9yXCI7XG52YXIgZ2V0SXRlcmF0b3JPZiA9IHR5cGVvZiBpdGVyYXRvclN5bWJvbCA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGk7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgKGkgPSB4W2l0ZXJhdG9yU3ltYm9sXSkgJiYgaS5hcHBseSh4KTtcbn0gOiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG51bGw7XG59O1xudmFyIE5PX0NIQVJfQVJSQVkgPSB7fTtcbmZ1bmN0aW9uIGdldEFycmF5T2YoYXJyYXlMaWtlKSB7XG4gIHZhciBpLCBhLCB4LCBpdDtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAoaXNBcnJheShhcnJheUxpa2UpKVxuICAgICAgcmV0dXJuIGFycmF5TGlrZS5zbGljZSgpO1xuICAgIGlmICh0aGlzID09PSBOT19DSEFSX0FSUkFZICYmIHR5cGVvZiBhcnJheUxpa2UgPT09IFwic3RyaW5nXCIpXG4gICAgICByZXR1cm4gW2FycmF5TGlrZV07XG4gICAgaWYgKGl0ID0gZ2V0SXRlcmF0b3JPZihhcnJheUxpa2UpKSB7XG4gICAgICBhID0gW107XG4gICAgICB3aGlsZSAoeCA9IGl0Lm5leHQoKSwgIXguZG9uZSlcbiAgICAgICAgYS5wdXNoKHgudmFsdWUpO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbClcbiAgICAgIHJldHVybiBbYXJyYXlMaWtlXTtcbiAgICBpID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICBpZiAodHlwZW9mIGkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGEgPSBuZXcgQXJyYXkoaSk7XG4gICAgICB3aGlsZSAoaS0tKVxuICAgICAgICBhW2ldID0gYXJyYXlMaWtlW2ldO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBbYXJyYXlMaWtlXTtcbiAgfVxuICBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgYSA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSlcbiAgICBhW2ldID0gYXJndW1lbnRzW2ldO1xuICByZXR1cm4gYTtcbn1cbnZhciBpc0FzeW5jRnVuY3Rpb24gPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiID8gZnVuY3Rpb24oZm4pIHtcbiAgcmV0dXJuIGZuW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09IFwiQXN5bmNGdW5jdGlvblwiO1xufSA6IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xudmFyIGRlYnVnID0gdHlwZW9mIGxvY2F0aW9uICE9PSBcInVuZGVmaW5lZFwiICYmIC9eKGh0dHB8aHR0cHMpOlxcL1xcLyhsb2NhbGhvc3R8MTI3XFwuMFxcLjBcXC4xKS8udGVzdChsb2NhdGlvbi5ocmVmKTtcbmZ1bmN0aW9uIHNldERlYnVnKHZhbHVlLCBmaWx0ZXIpIHtcbiAgZGVidWcgPSB2YWx1ZTtcbiAgbGlicmFyeUZpbHRlciA9IGZpbHRlcjtcbn1cbnZhciBsaWJyYXJ5RmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBORUVEU19USFJPV19GT1JfU1RBQ0sgPSAhbmV3IEVycm9yKFwiXCIpLnN0YWNrO1xuZnVuY3Rpb24gZ2V0RXJyb3JXaXRoU3RhY2soKSB7XG4gIGlmIChORUVEU19USFJPV19GT1JfU1RBQ0spXG4gICAgdHJ5IHtcbiAgICAgIGdldEVycm9yV2l0aFN0YWNrLmFyZ3VtZW50cztcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgcmV0dXJuIG5ldyBFcnJvcigpO1xufVxuZnVuY3Rpb24gcHJldHR5U3RhY2soZXhjZXB0aW9uLCBudW1JZ25vcmVkRnJhbWVzKSB7XG4gIHZhciBzdGFjayA9IGV4Y2VwdGlvbi5zdGFjaztcbiAgaWYgKCFzdGFjaylcbiAgICByZXR1cm4gXCJcIjtcbiAgbnVtSWdub3JlZEZyYW1lcyA9IG51bUlnbm9yZWRGcmFtZXMgfHwgMDtcbiAgaWYgKHN0YWNrLmluZGV4T2YoZXhjZXB0aW9uLm5hbWUpID09PSAwKVxuICAgIG51bUlnbm9yZWRGcmFtZXMgKz0gKGV4Y2VwdGlvbi5uYW1lICsgZXhjZXB0aW9uLm1lc3NhZ2UpLnNwbGl0KFwiXFxuXCIpLmxlbmd0aDtcbiAgcmV0dXJuIHN0YWNrLnNwbGl0KFwiXFxuXCIpLnNsaWNlKG51bUlnbm9yZWRGcmFtZXMpLmZpbHRlcihsaWJyYXJ5RmlsdGVyKS5tYXAoZnVuY3Rpb24oZnJhbWUpIHtcbiAgICByZXR1cm4gXCJcXG5cIiArIGZyYW1lO1xuICB9KS5qb2luKFwiXCIpO1xufVxudmFyIGRleGllRXJyb3JOYW1lcyA9IFtcbiAgXCJNb2RpZnlcIixcbiAgXCJCdWxrXCIsXG4gIFwiT3BlbkZhaWxlZFwiLFxuICBcIlZlcnNpb25DaGFuZ2VcIixcbiAgXCJTY2hlbWFcIixcbiAgXCJVcGdyYWRlXCIsXG4gIFwiSW52YWxpZFRhYmxlXCIsXG4gIFwiTWlzc2luZ0FQSVwiLFxuICBcIk5vU3VjaERhdGFiYXNlXCIsXG4gIFwiSW52YWxpZEFyZ3VtZW50XCIsXG4gIFwiU3ViVHJhbnNhY3Rpb25cIixcbiAgXCJVbnN1cHBvcnRlZFwiLFxuICBcIkludGVybmFsXCIsXG4gIFwiRGF0YWJhc2VDbG9zZWRcIixcbiAgXCJQcmVtYXR1cmVDb21taXRcIixcbiAgXCJGb3JlaWduQXdhaXRcIlxuXTtcbnZhciBpZGJEb21FcnJvck5hbWVzID0gW1xuICBcIlVua25vd25cIixcbiAgXCJDb25zdHJhaW50XCIsXG4gIFwiRGF0YVwiLFxuICBcIlRyYW5zYWN0aW9uSW5hY3RpdmVcIixcbiAgXCJSZWFkT25seVwiLFxuICBcIlZlcnNpb25cIixcbiAgXCJOb3RGb3VuZFwiLFxuICBcIkludmFsaWRTdGF0ZVwiLFxuICBcIkludmFsaWRBY2Nlc3NcIixcbiAgXCJBYm9ydFwiLFxuICBcIlRpbWVvdXRcIixcbiAgXCJRdW90YUV4Y2VlZGVkXCIsXG4gIFwiU3ludGF4XCIsXG4gIFwiRGF0YUNsb25lXCJcbl07XG52YXIgZXJyb3JMaXN0ID0gZGV4aWVFcnJvck5hbWVzLmNvbmNhdChpZGJEb21FcnJvck5hbWVzKTtcbnZhciBkZWZhdWx0VGV4dHMgPSB7XG4gIFZlcnNpb25DaGFuZ2VkOiBcIkRhdGFiYXNlIHZlcnNpb24gY2hhbmdlZCBieSBvdGhlciBkYXRhYmFzZSBjb25uZWN0aW9uXCIsXG4gIERhdGFiYXNlQ2xvc2VkOiBcIkRhdGFiYXNlIGhhcyBiZWVuIGNsb3NlZFwiLFxuICBBYm9ydDogXCJUcmFuc2FjdGlvbiBhYm9ydGVkXCIsXG4gIFRyYW5zYWN0aW9uSW5hY3RpdmU6IFwiVHJhbnNhY3Rpb24gaGFzIGFscmVhZHkgY29tcGxldGVkIG9yIGZhaWxlZFwiLFxuICBNaXNzaW5nQVBJOiBcIkluZGV4ZWREQiBBUEkgbWlzc2luZy4gUGxlYXNlIHZpc2l0IGh0dHBzOi8vdGlueXVybC5jb20veTJ1dXZza2JcIlxufTtcbmZ1bmN0aW9uIERleGllRXJyb3IobmFtZSwgbXNnKSB7XG4gIHRoaXMuX2UgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLm1lc3NhZ2UgPSBtc2c7XG59XG5kZXJpdmUoRGV4aWVFcnJvcikuZnJvbShFcnJvcikuZXh0ZW5kKHtcbiAgc3RhY2s6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YWNrIHx8ICh0aGlzLl9zdGFjayA9IHRoaXMubmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZSArIHByZXR0eVN0YWNrKHRoaXMuX2UsIDIpKTtcbiAgICB9XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlO1xuICB9XG59KTtcbmZ1bmN0aW9uIGdldE11bHRpRXJyb3JNZXNzYWdlKG1zZywgZmFpbHVyZXMpIHtcbiAgcmV0dXJuIG1zZyArIFwiLiBFcnJvcnM6IFwiICsgT2JqZWN0LmtleXMoZmFpbHVyZXMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZmFpbHVyZXNba2V5XS50b1N0cmluZygpO1xuICB9KS5maWx0ZXIoZnVuY3Rpb24odiwgaSwgcykge1xuICAgIHJldHVybiBzLmluZGV4T2YodikgPT09IGk7XG4gIH0pLmpvaW4oXCJcXG5cIik7XG59XG5mdW5jdGlvbiBNb2RpZnlFcnJvcihtc2csIGZhaWx1cmVzLCBzdWNjZXNzQ291bnQsIGZhaWxlZEtleXMpIHtcbiAgdGhpcy5fZSA9IGdldEVycm9yV2l0aFN0YWNrKCk7XG4gIHRoaXMuZmFpbHVyZXMgPSBmYWlsdXJlcztcbiAgdGhpcy5mYWlsZWRLZXlzID0gZmFpbGVkS2V5cztcbiAgdGhpcy5zdWNjZXNzQ291bnQgPSBzdWNjZXNzQ291bnQ7XG4gIHRoaXMubWVzc2FnZSA9IGdldE11bHRpRXJyb3JNZXNzYWdlKG1zZywgZmFpbHVyZXMpO1xufVxuZGVyaXZlKE1vZGlmeUVycm9yKS5mcm9tKERleGllRXJyb3IpO1xuZnVuY3Rpb24gQnVsa0Vycm9yKG1zZywgZmFpbHVyZXMpIHtcbiAgdGhpcy5fZSA9IGdldEVycm9yV2l0aFN0YWNrKCk7XG4gIHRoaXMubmFtZSA9IFwiQnVsa0Vycm9yXCI7XG4gIHRoaXMuZmFpbHVyZXMgPSBPYmplY3Qua2V5cyhmYWlsdXJlcykubWFwKGZ1bmN0aW9uKHBvcykge1xuICAgIHJldHVybiBmYWlsdXJlc1twb3NdO1xuICB9KTtcbiAgdGhpcy5mYWlsdXJlc0J5UG9zID0gZmFpbHVyZXM7XG4gIHRoaXMubWVzc2FnZSA9IGdldE11bHRpRXJyb3JNZXNzYWdlKG1zZywgZmFpbHVyZXMpO1xufVxuZGVyaXZlKEJ1bGtFcnJvcikuZnJvbShEZXhpZUVycm9yKTtcbnZhciBlcnJuYW1lcyA9IGVycm9yTGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBuYW1lKSB7XG4gIHJldHVybiBvYmpbbmFtZV0gPSBuYW1lICsgXCJFcnJvclwiLCBvYmo7XG59LCB7fSk7XG52YXIgQmFzZUV4Y2VwdGlvbiA9IERleGllRXJyb3I7XG52YXIgZXhjZXB0aW9ucyA9IGVycm9yTGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBuYW1lKSB7XG4gIHZhciBmdWxsTmFtZSA9IG5hbWUgKyBcIkVycm9yXCI7XG4gIGZ1bmN0aW9uIERleGllRXJyb3IyKG1zZ09ySW5uZXIsIGlubmVyKSB7XG4gICAgdGhpcy5fZSA9IGdldEVycm9yV2l0aFN0YWNrKCk7XG4gICAgdGhpcy5uYW1lID0gZnVsbE5hbWU7XG4gICAgaWYgKCFtc2dPcklubmVyKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBkZWZhdWx0VGV4dHNbbmFtZV0gfHwgZnVsbE5hbWU7XG4gICAgICB0aGlzLmlubmVyID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtc2dPcklubmVyID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcIlwiICsgbXNnT3JJbm5lciArICghaW5uZXIgPyBcIlwiIDogXCJcXG4gXCIgKyBpbm5lcik7XG4gICAgICB0aGlzLmlubmVyID0gaW5uZXIgfHwgbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtc2dPcklubmVyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtc2dPcklubmVyLm5hbWUgKyBcIiBcIiArIG1zZ09ySW5uZXIubWVzc2FnZTtcbiAgICAgIHRoaXMuaW5uZXIgPSBtc2dPcklubmVyO1xuICAgIH1cbiAgfVxuICBkZXJpdmUoRGV4aWVFcnJvcjIpLmZyb20oQmFzZUV4Y2VwdGlvbik7XG4gIG9ialtuYW1lXSA9IERleGllRXJyb3IyO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuZXhjZXB0aW9ucy5TeW50YXggPSBTeW50YXhFcnJvcjtcbmV4Y2VwdGlvbnMuVHlwZSA9IFR5cGVFcnJvcjtcbmV4Y2VwdGlvbnMuUmFuZ2UgPSBSYW5nZUVycm9yO1xudmFyIGV4Y2VwdGlvbk1hcCA9IGlkYkRvbUVycm9yTmFtZXMucmVkdWNlKGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICBvYmpbbmFtZSArIFwiRXJyb3JcIl0gPSBleGNlcHRpb25zW25hbWVdO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuZnVuY3Rpb24gbWFwRXJyb3IoZG9tRXJyb3IsIG1lc3NhZ2UpIHtcbiAgaWYgKCFkb21FcnJvciB8fCBkb21FcnJvciBpbnN0YW5jZW9mIERleGllRXJyb3IgfHwgZG9tRXJyb3IgaW5zdGFuY2VvZiBUeXBlRXJyb3IgfHwgZG9tRXJyb3IgaW5zdGFuY2VvZiBTeW50YXhFcnJvciB8fCAhZG9tRXJyb3IubmFtZSB8fCAhZXhjZXB0aW9uTWFwW2RvbUVycm9yLm5hbWVdKVxuICAgIHJldHVybiBkb21FcnJvcjtcbiAgdmFyIHJ2ID0gbmV3IGV4Y2VwdGlvbk1hcFtkb21FcnJvci5uYW1lXShtZXNzYWdlIHx8IGRvbUVycm9yLm1lc3NhZ2UsIGRvbUVycm9yKTtcbiAgaWYgKFwic3RhY2tcIiBpbiBkb21FcnJvcikge1xuICAgIHNldFByb3AocnYsIFwic3RhY2tcIiwge2dldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbm5lci5zdGFjaztcbiAgICB9fSk7XG4gIH1cbiAgcmV0dXJuIHJ2O1xufVxudmFyIGZ1bGxOYW1lRXhjZXB0aW9ucyA9IGVycm9yTGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBuYW1lKSB7XG4gIGlmIChbXCJTeW50YXhcIiwgXCJUeXBlXCIsIFwiUmFuZ2VcIl0uaW5kZXhPZihuYW1lKSA9PT0gLTEpXG4gICAgb2JqW25hbWUgKyBcIkVycm9yXCJdID0gZXhjZXB0aW9uc1tuYW1lXTtcbiAgcmV0dXJuIG9iajtcbn0sIHt9KTtcbmZ1bGxOYW1lRXhjZXB0aW9ucy5Nb2RpZnlFcnJvciA9IE1vZGlmeUVycm9yO1xuZnVsbE5hbWVFeGNlcHRpb25zLkRleGllRXJyb3IgPSBEZXhpZUVycm9yO1xuZnVsbE5hbWVFeGNlcHRpb25zLkJ1bGtFcnJvciA9IEJ1bGtFcnJvcjtcbmZ1bmN0aW9uIG5vcCgpIHtcbn1cbmZ1bmN0aW9uIG1pcnJvcih2YWwpIHtcbiAgcmV0dXJuIHZhbDtcbn1cbmZ1bmN0aW9uIHB1cmVGdW5jdGlvbkNoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT0gbnVsbCB8fCBmMSA9PT0gbWlycm9yKVxuICAgIHJldHVybiBmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiBmMihmMSh2YWwpKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNhbGxCb3RoKG9uMSwgb24yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBvbjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBvbjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGhvb2tDcmVhdGluZ0NoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT09IG5vcClcbiAgICByZXR1cm4gZjI7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzICE9PSB2b2lkIDApXG4gICAgICBhcmd1bWVudHNbMF0gPSByZXM7XG4gICAgdmFyIG9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzLCBvbmVycm9yID0gdGhpcy5vbmVycm9yO1xuICAgIHRoaXMub25zdWNjZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgIHZhciByZXMyID0gZjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAob25zdWNjZXNzKVxuICAgICAgdGhpcy5vbnN1Y2Nlc3MgPSB0aGlzLm9uc3VjY2VzcyA/IGNhbGxCb3RoKG9uc3VjY2VzcywgdGhpcy5vbnN1Y2Nlc3MpIDogb25zdWNjZXNzO1xuICAgIGlmIChvbmVycm9yKVxuICAgICAgdGhpcy5vbmVycm9yID0gdGhpcy5vbmVycm9yID8gY2FsbEJvdGgob25lcnJvciwgdGhpcy5vbmVycm9yKSA6IG9uZXJyb3I7XG4gICAgcmV0dXJuIHJlczIgIT09IHZvaWQgMCA/IHJlczIgOiByZXM7XG4gIH07XG59XG5mdW5jdGlvbiBob29rRGVsZXRpbmdDaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09PSBub3ApXG4gICAgcmV0dXJuIGYyO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgb25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MsIG9uZXJyb3IgPSB0aGlzLm9uZXJyb3I7XG4gICAgdGhpcy5vbnN1Y2Nlc3MgPSB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgIGYyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKG9uc3VjY2VzcylcbiAgICAgIHRoaXMub25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MgPyBjYWxsQm90aChvbnN1Y2Nlc3MsIHRoaXMub25zdWNjZXNzKSA6IG9uc3VjY2VzcztcbiAgICBpZiAob25lcnJvcilcbiAgICAgIHRoaXMub25lcnJvciA9IHRoaXMub25lcnJvciA/IGNhbGxCb3RoKG9uZXJyb3IsIHRoaXMub25lcnJvcikgOiBvbmVycm9yO1xuICB9O1xufVxuZnVuY3Rpb24gaG9va1VwZGF0aW5nQ2hhaW4oZjEsIGYyKSB7XG4gIGlmIChmMSA9PT0gbm9wKVxuICAgIHJldHVybiBmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uKG1vZGlmaWNhdGlvbnMpIHtcbiAgICB2YXIgcmVzID0gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBleHRlbmQobW9kaWZpY2F0aW9ucywgcmVzKTtcbiAgICB2YXIgb25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MsIG9uZXJyb3IgPSB0aGlzLm9uZXJyb3I7XG4gICAgdGhpcy5vbnN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMub25lcnJvciA9IG51bGw7XG4gICAgdmFyIHJlczIgPSBmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChvbnN1Y2Nlc3MpXG4gICAgICB0aGlzLm9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzID8gY2FsbEJvdGgob25zdWNjZXNzLCB0aGlzLm9uc3VjY2VzcykgOiBvbnN1Y2Nlc3M7XG4gICAgaWYgKG9uZXJyb3IpXG4gICAgICB0aGlzLm9uZXJyb3IgPSB0aGlzLm9uZXJyb3IgPyBjYWxsQm90aChvbmVycm9yLCB0aGlzLm9uZXJyb3IpIDogb25lcnJvcjtcbiAgICByZXR1cm4gcmVzID09PSB2b2lkIDAgPyByZXMyID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZXMyIDogZXh0ZW5kKHJlcywgcmVzMik7XG4gIH07XG59XG5mdW5jdGlvbiByZXZlcnNlU3RvcHBhYmxlRXZlbnRDaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09PSBub3ApXG4gICAgcmV0dXJuIGYyO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGYyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBmMS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuZnVuY3Rpb24gcHJvbWlzYWJsZUNoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT09IG5vcClcbiAgICByZXR1cm4gZjI7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgdGhpeiA9IHRoaXMsIGkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGkpO1xuICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIHJldHVybiByZXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGYyLmFwcGx5KHRoaXosIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxudmFyIElOVEVSTkFMID0ge307XG52YXIgTE9OR19TVEFDS1NfQ0xJUF9MSU1JVCA9IDEwMCwgTUFYX0xPTkdfU1RBQ0tTID0gMjAsIFpPTkVfRUNIT19MSU1JVCA9IDEwMCwgX2EkMSA9IHR5cGVvZiBQcm9taXNlID09PSBcInVuZGVmaW5lZFwiID8gW10gOiBmdW5jdGlvbigpIHtcbiAgdmFyIGdsb2JhbFAgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgaWYgKHR5cGVvZiBjcnlwdG8gPT09IFwidW5kZWZpbmVkXCIgfHwgIWNyeXB0by5zdWJ0bGUpXG4gICAgcmV0dXJuIFtnbG9iYWxQLCBnZXRQcm90byhnbG9iYWxQKSwgZ2xvYmFsUF07XG4gIHZhciBuYXRpdmVQID0gY3J5cHRvLnN1YnRsZS5kaWdlc3QoXCJTSEEtNTEyXCIsIG5ldyBVaW50OEFycmF5KFswXSkpO1xuICByZXR1cm4gW1xuICAgIG5hdGl2ZVAsXG4gICAgZ2V0UHJvdG8obmF0aXZlUCksXG4gICAgZ2xvYmFsUFxuICBdO1xufSgpLCByZXNvbHZlZE5hdGl2ZVByb21pc2UgPSBfYSQxWzBdLCBuYXRpdmVQcm9taXNlUHJvdG8gPSBfYSQxWzFdLCByZXNvbHZlZEdsb2JhbFByb21pc2UgPSBfYSQxWzJdLCBuYXRpdmVQcm9taXNlVGhlbiA9IG5hdGl2ZVByb21pc2VQcm90byAmJiBuYXRpdmVQcm9taXNlUHJvdG8udGhlbjtcbnZhciBOYXRpdmVQcm9taXNlID0gcmVzb2x2ZWROYXRpdmVQcm9taXNlICYmIHJlc29sdmVkTmF0aXZlUHJvbWlzZS5jb25zdHJ1Y3RvcjtcbnZhciBwYXRjaEdsb2JhbFByb21pc2UgPSAhIXJlc29sdmVkR2xvYmFsUHJvbWlzZTtcbnZhciBzdGFja19iZWluZ19nZW5lcmF0ZWQgPSBmYWxzZTtcbnZhciBzY2hlZHVsZVBoeXNpY2FsVGljayA9IHJlc29sdmVkR2xvYmFsUHJvbWlzZSA/IGZ1bmN0aW9uKCkge1xuICByZXNvbHZlZEdsb2JhbFByb21pc2UudGhlbihwaHlzaWNhbFRpY2spO1xufSA6IF9nbG9iYWwuc2V0SW1tZWRpYXRlID8gc2V0SW1tZWRpYXRlLmJpbmQobnVsbCwgcGh5c2ljYWxUaWNrKSA6IF9nbG9iYWwuTXV0YXRpb25PYnNlcnZlciA/IGZ1bmN0aW9uKCkge1xuICB2YXIgaGlkZGVuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oKSB7XG4gICAgcGh5c2ljYWxUaWNrKCk7XG4gICAgaGlkZGVuRGl2ID0gbnVsbDtcbiAgfSkub2JzZXJ2ZShoaWRkZW5EaXYsIHthdHRyaWJ1dGVzOiB0cnVlfSk7XG4gIGhpZGRlbkRpdi5zZXRBdHRyaWJ1dGUoXCJpXCIsIFwiMVwiKTtcbn0gOiBmdW5jdGlvbigpIHtcbiAgc2V0VGltZW91dChwaHlzaWNhbFRpY2ssIDApO1xufTtcbnZhciBhc2FwID0gZnVuY3Rpb24oY2FsbGJhY2ssIGFyZ3MpIHtcbiAgbWljcm90aWNrUXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ3NdKTtcbiAgaWYgKG5lZWRzTmV3UGh5c2ljYWxUaWNrKSB7XG4gICAgc2NoZWR1bGVQaHlzaWNhbFRpY2soKTtcbiAgICBuZWVkc05ld1BoeXNpY2FsVGljayA9IGZhbHNlO1xuICB9XG59O1xudmFyIGlzT3V0c2lkZU1pY3JvVGljayA9IHRydWUsIG5lZWRzTmV3UGh5c2ljYWxUaWNrID0gdHJ1ZSwgdW5oYW5kbGVkRXJyb3JzID0gW10sIHJlamVjdGluZ0Vycm9ycyA9IFtdLCBjdXJyZW50RnVsZmlsbGVyID0gbnVsbCwgcmVqZWN0aW9uTWFwcGVyID0gbWlycm9yO1xudmFyIGdsb2JhbFBTRCA9IHtcbiAgaWQ6IFwiZ2xvYmFsXCIsXG4gIGdsb2JhbDogdHJ1ZSxcbiAgcmVmOiAwLFxuICB1bmhhbmRsZWRzOiBbXSxcbiAgb251bmhhbmRsZWQ6IGdsb2JhbEVycm9yLFxuICBwZ3A6IGZhbHNlLFxuICBlbnY6IHt9LFxuICBmaW5hbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51bmhhbmRsZWRzLmZvckVhY2goZnVuY3Rpb24odWgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbEVycm9yKHVoWzBdLCB1aFsxXSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG52YXIgUFNEID0gZ2xvYmFsUFNEO1xudmFyIG1pY3JvdGlja1F1ZXVlID0gW107XG52YXIgbnVtU2NoZWR1bGVkQ2FsbHMgPSAwO1xudmFyIHRpY2tGaW5hbGl6ZXJzID0gW107XG5mdW5jdGlvbiBEZXhpZVByb21pc2UoZm4pIHtcbiAgaWYgKHR5cGVvZiB0aGlzICE9PSBcIm9iamVjdFwiKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXdcIik7XG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB0aGlzLm9udW5jYXRjaGVkID0gbm9wO1xuICB0aGlzLl9saWIgPSBmYWxzZTtcbiAgdmFyIHBzZCA9IHRoaXMuX1BTRCA9IFBTRDtcbiAgaWYgKGRlYnVnKSB7XG4gICAgdGhpcy5fc3RhY2tIb2xkZXIgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICAgIHRoaXMuX3ByZXYgPSBudWxsO1xuICAgIHRoaXMuX251bVByZXYgPSAwO1xuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09IFwiZnVuY3Rpb25cIikge1xuICAgIGlmIChmbiAhPT0gSU5URVJOQUwpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7XG4gICAgdGhpcy5fc3RhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgdGhpcy5fdmFsdWUgPSBhcmd1bWVudHNbMl07XG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSBmYWxzZSlcbiAgICAgIGhhbmRsZVJlamVjdGlvbih0aGlzLCB0aGlzLl92YWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICArK3BzZC5yZWY7XG4gIGV4ZWN1dGVQcm9taXNlVGFzayh0aGlzLCBmbik7XG59XG52YXIgdGhlblByb3AgPSB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBzZCA9IFBTRCwgbWljcm9UYXNrSWQgPSB0b3RhbEVjaG9lcztcbiAgICBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdmFyIHBvc3NpYmxlQXdhaXQgPSAhcHNkLmdsb2JhbCAmJiAocHNkICE9PSBQU0QgfHwgbWljcm9UYXNrSWQgIT09IHRvdGFsRWNob2VzKTtcbiAgICAgIHZhciBjbGVhbnVwID0gcG9zc2libGVBd2FpdCAmJiAhZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgIHZhciBydiA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHByb3BhZ2F0ZVRvTGlzdGVuZXIoX3RoaXMsIG5ldyBMaXN0ZW5lcihuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKG9uRnVsZmlsbGVkLCBwc2QsIHBvc3NpYmxlQXdhaXQsIGNsZWFudXApLCBuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKG9uUmVqZWN0ZWQsIHBzZCwgcG9zc2libGVBd2FpdCwgY2xlYW51cCksIHJlc29sdmUsIHJlamVjdCwgcHNkKSk7XG4gICAgICB9KTtcbiAgICAgIGRlYnVnICYmIGxpbmtUb1ByZXZpb3VzUHJvbWlzZShydiwgdGhpcyk7XG4gICAgICByZXR1cm4gcnY7XG4gICAgfVxuICAgIHRoZW4ucHJvdG90eXBlID0gSU5URVJOQUw7XG4gICAgcmV0dXJuIHRoZW47XG4gIH0sXG4gIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBzZXRQcm9wKHRoaXMsIFwidGhlblwiLCB2YWx1ZSAmJiB2YWx1ZS5wcm90b3R5cGUgPT09IElOVEVSTkFMID8gdGhlblByb3AgOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgICAgc2V0OiB0aGVuUHJvcC5zZXRcbiAgICB9KTtcbiAgfVxufTtcbnByb3BzKERleGllUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgdGhlbjogdGhlblByb3AsXG4gIF90aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIHByb3BhZ2F0ZVRvTGlzdGVuZXIodGhpcywgbmV3IExpc3RlbmVyKG51bGwsIG51bGwsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBQU0QpKTtcbiAgfSxcbiAgY2F0Y2g6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gICAgdmFyIHR5cGUgPSBhcmd1bWVudHNbMF0sIGhhbmRsZXIgPSBhcmd1bWVudHNbMV07XG4gICAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLnRoZW4obnVsbCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXR1cm4gZXJyIGluc3RhbmNlb2YgdHlwZSA/IGhhbmRsZXIoZXJyKSA6IFByb21pc2VSZWplY3QoZXJyKTtcbiAgICB9KSA6IHRoaXMudGhlbihudWxsLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJldHVybiBlcnIgJiYgZXJyLm5hbWUgPT09IHR5cGUgPyBoYW5kbGVyKGVycikgOiBQcm9taXNlUmVqZWN0KGVycik7XG4gICAgfSk7XG4gIH0sXG4gIGZpbmFsbHk6IGZ1bmN0aW9uKG9uRmluYWxseSkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIG9uRmluYWxseSgpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgb25GaW5hbGx5KCk7XG4gICAgICByZXR1cm4gUHJvbWlzZVJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9LFxuICBzdGFjazoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fc3RhY2spXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFjaztcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YWNrX2JlaW5nX2dlbmVyYXRlZCA9IHRydWU7XG4gICAgICAgIHZhciBzdGFja3MgPSBnZXRTdGFjayh0aGlzLCBbXSwgTUFYX0xPTkdfU1RBQ0tTKTtcbiAgICAgICAgdmFyIHN0YWNrID0gc3RhY2tzLmpvaW4oXCJcXG5Gcm9tIHByZXZpb3VzOiBcIik7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLl9zdGFjayA9IHN0YWNrO1xuICAgICAgICByZXR1cm4gc3RhY2s7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzdGFja19iZWluZ19nZW5lcmF0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRpbWVvdXQ6IGZ1bmN0aW9uKG1zLCBtc2cpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBtcyA8IEluZmluaXR5ID8gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBoYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBleGNlcHRpb25zLlRpbWVvdXQobXNnKSk7XG4gICAgICB9LCBtcyk7XG4gICAgICBfdGhpcy50aGVuKHJlc29sdmUsIHJlamVjdCkuZmluYWxseShjbGVhclRpbWVvdXQuYmluZChudWxsLCBoYW5kbGUpKTtcbiAgICB9KSA6IHRoaXM7XG4gIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKVxuICBzZXRQcm9wKERleGllUHJvbWlzZS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgXCJEZXhpZS5Qcm9taXNlXCIpO1xuZ2xvYmFsUFNELmVudiA9IHNuYXBTaG90KCk7XG5mdW5jdGlvbiBMaXN0ZW5lcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzb2x2ZSwgcmVqZWN0LCB6b25lKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09IFwiZnVuY3Rpb25cIiA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09IFwiZnVuY3Rpb25cIiA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICB0aGlzLnJlamVjdCA9IHJlamVjdDtcbiAgdGhpcy5wc2QgPSB6b25lO1xufVxucHJvcHMoRGV4aWVQcm9taXNlLCB7XG4gIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IGdldEFycmF5T2YuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5tYXAob25Qb3NzaWJsZVBhcmFsbGVsbEFzeW5jKTtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24oYSwgaSkge1xuICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUoYSkudGhlbihmdW5jdGlvbih4KSB7XG4gICAgICAgICAgdmFsdWVzW2ldID0geDtcbiAgICAgICAgICBpZiAoIS0tcmVtYWluaW5nKVxuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHJlc29sdmU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGV4aWVQcm9taXNlKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhbHVlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIHZhciBydiA9IG5ldyBEZXhpZVByb21pc2UoSU5URVJOQUwsIHRydWUsIHZhbHVlKTtcbiAgICBsaW5rVG9QcmV2aW91c1Byb21pc2UocnYsIGN1cnJlbnRGdWxmaWxsZXIpO1xuICAgIHJldHVybiBydjtcbiAgfSxcbiAgcmVqZWN0OiBQcm9taXNlUmVqZWN0LFxuICByYWNlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWVzID0gZ2V0QXJyYXlPZi5hcHBseShudWxsLCBhcmd1bWVudHMpLm1hcChvblBvc3NpYmxlUGFyYWxsZWxsQXN5bmMpO1xuICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFsdWVzLm1hcChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBQU0Q6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBTRDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBQU0QgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHRvdGFsRWNob2VzOiB7Z2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdG90YWxFY2hvZXM7XG4gIH19LFxuICBuZXdQU0Q6IG5ld1Njb3BlLFxuICB1c2VQU0QsXG4gIHNjaGVkdWxlcjoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXNhcDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGFzYXAgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHJlamVjdGlvbk1hcHBlcjoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uTWFwcGVyO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmVqZWN0aW9uTWFwcGVyID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICBmb2xsb3c6IGZ1bmN0aW9uKGZuLCB6b25lUHJvcHMpIHtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBuZXdTY29wZShmdW5jdGlvbihyZXNvbHZlMiwgcmVqZWN0Mikge1xuICAgICAgICB2YXIgcHNkID0gUFNEO1xuICAgICAgICBwc2QudW5oYW5kbGVkcyA9IFtdO1xuICAgICAgICBwc2Qub251bmhhbmRsZWQgPSByZWplY3QyO1xuICAgICAgICBwc2QuZmluYWxpemUgPSBjYWxsQm90aChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgIHJ1bl9hdF9lbmRfb2ZfdGhpc19vcl9uZXh0X3BoeXNpY2FsX3RpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfdGhpcy51bmhhbmRsZWRzLmxlbmd0aCA9PT0gMCA/IHJlc29sdmUyKCkgOiByZWplY3QyKF90aGlzLnVuaGFuZGxlZHNbMF0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBwc2QuZmluYWxpemUpO1xuICAgICAgICBmbigpO1xuICAgICAgfSwgem9uZVByb3BzLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbmlmIChOYXRpdmVQcm9taXNlKSB7XG4gIGlmIChOYXRpdmVQcm9taXNlLmFsbFNldHRsZWQpXG4gICAgc2V0UHJvcChEZXhpZVByb21pc2UsIFwiYWxsU2V0dGxlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NzaWJsZVByb21pc2VzID0gZ2V0QXJyYXlPZi5hcHBseShudWxsLCBhcmd1bWVudHMpLm1hcChvblBvc3NpYmxlUGFyYWxsZWxsQXN5bmMpO1xuICAgICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBpZiAocG9zc2libGVQcm9taXNlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSBwb3NzaWJsZVByb21pc2VzLmxlbmd0aDtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkocmVtYWluaW5nKTtcbiAgICAgICAgcG9zc2libGVQcm9taXNlcy5mb3JFYWNoKGZ1bmN0aW9uKHAsIGkpIHtcbiAgICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUocCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNbaV0gPSB7c3RhdHVzOiBcImZ1bGZpbGxlZFwiLCB2YWx1ZX07XG4gICAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c1tpXSA9IHtzdGF0dXM6IFwicmVqZWN0ZWRcIiwgcmVhc29ufTtcbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIGlmIChOYXRpdmVQcm9taXNlLmFueSAmJiB0eXBlb2YgQWdncmVnYXRlRXJyb3IgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgc2V0UHJvcChEZXhpZVByb21pc2UsIFwiYW55XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc3NpYmxlUHJvbWlzZXMgPSBnZXRBcnJheU9mLmFwcGx5KG51bGwsIGFyZ3VtZW50cykubWFwKG9uUG9zc2libGVQYXJhbGxlbGxBc3luYyk7XG4gICAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlUHJvbWlzZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgIHJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10pKTtcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHBvc3NpYmxlUHJvbWlzZXMubGVuZ3RoO1xuICAgICAgICB2YXIgZmFpbHVyZXMgPSBuZXcgQXJyYXkocmVtYWluaW5nKTtcbiAgICAgICAgcG9zc2libGVQcm9taXNlcy5mb3JFYWNoKGZ1bmN0aW9uKHAsIGkpIHtcbiAgICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUocCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGZhaWx1cmUpIHtcbiAgICAgICAgICAgIGZhaWx1cmVzW2ldID0gZmFpbHVyZTtcbiAgICAgICAgICAgIGlmICghLS1yZW1haW5pbmcpXG4gICAgICAgICAgICAgIHJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoZmFpbHVyZXMpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGV4ZWN1dGVQcm9taXNlVGFzayhwcm9taXNlLCBmbikge1xuICB0cnkge1xuICAgIGZuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IG51bGwpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmICh2YWx1ZSA9PT0gcHJvbWlzZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuXCIpO1xuICAgICAgdmFyIHNob3VsZEV4ZWN1dGVUaWNrID0gcHJvbWlzZS5fbGliICYmIGJlZ2luTWljcm9UaWNrU2NvcGUoKTtcbiAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGV4ZWN1dGVQcm9taXNlVGFzayhwcm9taXNlLCBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICB2YWx1ZSBpbnN0YW5jZW9mIERleGllUHJvbWlzZSA/IHZhbHVlLl90aGVuKHJlc29sdmUsIHJlamVjdCkgOiB2YWx1ZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZS5fc3RhdGUgPSB0cnVlO1xuICAgICAgICBwcm9taXNlLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICBwcm9wYWdhdGVBbGxMaXN0ZW5lcnMocHJvbWlzZSk7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdWxkRXhlY3V0ZVRpY2spXG4gICAgICAgIGVuZE1pY3JvVGlja1Njb3BlKCk7XG4gICAgfSwgaGFuZGxlUmVqZWN0aW9uLmJpbmQobnVsbCwgcHJvbWlzZSkpO1xuICB9IGNhdGNoIChleCkge1xuICAgIGhhbmRsZVJlamVjdGlvbihwcm9taXNlLCBleCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZVJlamVjdGlvbihwcm9taXNlLCByZWFzb24pIHtcbiAgcmVqZWN0aW5nRXJyb3JzLnB1c2gocmVhc29uKTtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBudWxsKVxuICAgIHJldHVybjtcbiAgdmFyIHNob3VsZEV4ZWN1dGVUaWNrID0gcHJvbWlzZS5fbGliICYmIGJlZ2luTWljcm9UaWNrU2NvcGUoKTtcbiAgcmVhc29uID0gcmVqZWN0aW9uTWFwcGVyKHJlYXNvbik7XG4gIHByb21pc2UuX3N0YXRlID0gZmFsc2U7XG4gIHByb21pc2UuX3ZhbHVlID0gcmVhc29uO1xuICBkZWJ1ZyAmJiByZWFzb24gIT09IG51bGwgJiYgdHlwZW9mIHJlYXNvbiA9PT0gXCJvYmplY3RcIiAmJiAhcmVhc29uLl9wcm9taXNlICYmIHRyeUNhdGNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcmlnUHJvcCA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihyZWFzb24sIFwic3RhY2tcIik7XG4gICAgcmVhc29uLl9wcm9taXNlID0gcHJvbWlzZTtcbiAgICBzZXRQcm9wKHJlYXNvbiwgXCJzdGFja1wiLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RhY2tfYmVpbmdfZ2VuZXJhdGVkID8gb3JpZ1Byb3AgJiYgKG9yaWdQcm9wLmdldCA/IG9yaWdQcm9wLmdldC5hcHBseShyZWFzb24pIDogb3JpZ1Byb3AudmFsdWUpIDogcHJvbWlzZS5zdGFjaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGFkZFBvc3NpYmx5VW5oYW5kbGVkRXJyb3IocHJvbWlzZSk7XG4gIHByb3BhZ2F0ZUFsbExpc3RlbmVycyhwcm9taXNlKTtcbiAgaWYgKHNob3VsZEV4ZWN1dGVUaWNrKVxuICAgIGVuZE1pY3JvVGlja1Njb3BlKCk7XG59XG5mdW5jdGlvbiBwcm9wYWdhdGVBbGxMaXN0ZW5lcnMocHJvbWlzZSkge1xuICB2YXIgbGlzdGVuZXJzID0gcHJvbWlzZS5fbGlzdGVuZXJzO1xuICBwcm9taXNlLl9saXN0ZW5lcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHByb3BhZ2F0ZVRvTGlzdGVuZXIocHJvbWlzZSwgbGlzdGVuZXJzW2ldKTtcbiAgfVxuICB2YXIgcHNkID0gcHJvbWlzZS5fUFNEO1xuICAtLXBzZC5yZWYgfHwgcHNkLmZpbmFsaXplKCk7XG4gIGlmIChudW1TY2hlZHVsZWRDYWxscyA9PT0gMCkge1xuICAgICsrbnVtU2NoZWR1bGVkQ2FsbHM7XG4gICAgYXNhcChmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLW51bVNjaGVkdWxlZENhbGxzID09PSAwKVxuICAgICAgICBmaW5hbGl6ZVBoeXNpY2FsVGljaygpO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuZnVuY3Rpb24gcHJvcGFnYXRlVG9MaXN0ZW5lcihwcm9taXNlLCBsaXN0ZW5lcikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IG51bGwpIHtcbiAgICBwcm9taXNlLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBjYiA9IHByb21pc2UuX3N0YXRlID8gbGlzdGVuZXIub25GdWxmaWxsZWQgOiBsaXN0ZW5lci5vblJlamVjdGVkO1xuICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICByZXR1cm4gKHByb21pc2UuX3N0YXRlID8gbGlzdGVuZXIucmVzb2x2ZSA6IGxpc3RlbmVyLnJlamVjdCkocHJvbWlzZS5fdmFsdWUpO1xuICB9XG4gICsrbGlzdGVuZXIucHNkLnJlZjtcbiAgKytudW1TY2hlZHVsZWRDYWxscztcbiAgYXNhcChjYWxsTGlzdGVuZXIsIFtjYiwgcHJvbWlzZSwgbGlzdGVuZXJdKTtcbn1cbmZ1bmN0aW9uIGNhbGxMaXN0ZW5lcihjYiwgcHJvbWlzZSwgbGlzdGVuZXIpIHtcbiAgdHJ5IHtcbiAgICBjdXJyZW50RnVsZmlsbGVyID0gcHJvbWlzZTtcbiAgICB2YXIgcmV0LCB2YWx1ZSA9IHByb21pc2UuX3ZhbHVlO1xuICAgIGlmIChwcm9taXNlLl9zdGF0ZSkge1xuICAgICAgcmV0ID0gY2IodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVqZWN0aW5nRXJyb3JzLmxlbmd0aClcbiAgICAgICAgcmVqZWN0aW5nRXJyb3JzID0gW107XG4gICAgICByZXQgPSBjYih2YWx1ZSk7XG4gICAgICBpZiAocmVqZWN0aW5nRXJyb3JzLmluZGV4T2YodmFsdWUpID09PSAtMSlcbiAgICAgICAgbWFya0Vycm9yQXNIYW5kbGVkKHByb21pc2UpO1xuICAgIH1cbiAgICBsaXN0ZW5lci5yZXNvbHZlKHJldCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsaXN0ZW5lci5yZWplY3QoZSk7XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudEZ1bGZpbGxlciA9IG51bGw7XG4gICAgaWYgKC0tbnVtU2NoZWR1bGVkQ2FsbHMgPT09IDApXG4gICAgICBmaW5hbGl6ZVBoeXNpY2FsVGljaygpO1xuICAgIC0tbGlzdGVuZXIucHNkLnJlZiB8fCBsaXN0ZW5lci5wc2QuZmluYWxpemUoKTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0U3RhY2socHJvbWlzZSwgc3RhY2tzLCBsaW1pdCkge1xuICBpZiAoc3RhY2tzLmxlbmd0aCA9PT0gbGltaXQpXG4gICAgcmV0dXJuIHN0YWNrcztcbiAgdmFyIHN0YWNrID0gXCJcIjtcbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBmYWxzZSkge1xuICAgIHZhciBmYWlsdXJlID0gcHJvbWlzZS5fdmFsdWUsIGVycm9yTmFtZSwgbWVzc2FnZTtcbiAgICBpZiAoZmFpbHVyZSAhPSBudWxsKSB7XG4gICAgICBlcnJvck5hbWUgPSBmYWlsdXJlLm5hbWUgfHwgXCJFcnJvclwiO1xuICAgICAgbWVzc2FnZSA9IGZhaWx1cmUubWVzc2FnZSB8fCBmYWlsdXJlO1xuICAgICAgc3RhY2sgPSBwcmV0dHlTdGFjayhmYWlsdXJlLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JOYW1lID0gZmFpbHVyZTtcbiAgICAgIG1lc3NhZ2UgPSBcIlwiO1xuICAgIH1cbiAgICBzdGFja3MucHVzaChlcnJvck5hbWUgKyAobWVzc2FnZSA/IFwiOiBcIiArIG1lc3NhZ2UgOiBcIlwiKSArIHN0YWNrKTtcbiAgfVxuICBpZiAoZGVidWcpIHtcbiAgICBzdGFjayA9IHByZXR0eVN0YWNrKHByb21pc2UuX3N0YWNrSG9sZGVyLCAyKTtcbiAgICBpZiAoc3RhY2sgJiYgc3RhY2tzLmluZGV4T2Yoc3RhY2spID09PSAtMSlcbiAgICAgIHN0YWNrcy5wdXNoKHN0YWNrKTtcbiAgICBpZiAocHJvbWlzZS5fcHJldilcbiAgICAgIGdldFN0YWNrKHByb21pc2UuX3ByZXYsIHN0YWNrcywgbGltaXQpO1xuICB9XG4gIHJldHVybiBzdGFja3M7XG59XG5mdW5jdGlvbiBsaW5rVG9QcmV2aW91c1Byb21pc2UocHJvbWlzZSwgcHJldikge1xuICB2YXIgbnVtUHJldiA9IHByZXYgPyBwcmV2Ll9udW1QcmV2ICsgMSA6IDA7XG4gIGlmIChudW1QcmV2IDwgTE9OR19TVEFDS1NfQ0xJUF9MSU1JVCkge1xuICAgIHByb21pc2UuX3ByZXYgPSBwcmV2O1xuICAgIHByb21pc2UuX251bVByZXYgPSBudW1QcmV2O1xuICB9XG59XG5mdW5jdGlvbiBwaHlzaWNhbFRpY2soKSB7XG4gIGJlZ2luTWljcm9UaWNrU2NvcGUoKSAmJiBlbmRNaWNyb1RpY2tTY29wZSgpO1xufVxuZnVuY3Rpb24gYmVnaW5NaWNyb1RpY2tTY29wZSgpIHtcbiAgdmFyIHdhc1Jvb3RFeGVjID0gaXNPdXRzaWRlTWljcm9UaWNrO1xuICBpc091dHNpZGVNaWNyb1RpY2sgPSBmYWxzZTtcbiAgbmVlZHNOZXdQaHlzaWNhbFRpY2sgPSBmYWxzZTtcbiAgcmV0dXJuIHdhc1Jvb3RFeGVjO1xufVxuZnVuY3Rpb24gZW5kTWljcm9UaWNrU2NvcGUoKSB7XG4gIHZhciBjYWxsYmFja3MsIGksIGw7XG4gIGRvIHtcbiAgICB3aGlsZSAobWljcm90aWNrUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY2FsbGJhY2tzID0gbWljcm90aWNrUXVldWU7XG4gICAgICBtaWNyb3RpY2tRdWV1ZSA9IFtdO1xuICAgICAgbCA9IGNhbGxiYWNrcy5sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIHZhciBpdGVtID0gY2FsbGJhY2tzW2ldO1xuICAgICAgICBpdGVtWzBdLmFwcGx5KG51bGwsIGl0ZW1bMV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAobWljcm90aWNrUXVldWUubGVuZ3RoID4gMCk7XG4gIGlzT3V0c2lkZU1pY3JvVGljayA9IHRydWU7XG4gIG5lZWRzTmV3UGh5c2ljYWxUaWNrID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGZpbmFsaXplUGh5c2ljYWxUaWNrKCkge1xuICB2YXIgdW5oYW5kbGVkRXJycyA9IHVuaGFuZGxlZEVycm9ycztcbiAgdW5oYW5kbGVkRXJyb3JzID0gW107XG4gIHVuaGFuZGxlZEVycnMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgcC5fUFNELm9udW5oYW5kbGVkLmNhbGwobnVsbCwgcC5fdmFsdWUsIHApO1xuICB9KTtcbiAgdmFyIGZpbmFsaXplcnMgPSB0aWNrRmluYWxpemVycy5zbGljZSgwKTtcbiAgdmFyIGkgPSBmaW5hbGl6ZXJzLmxlbmd0aDtcbiAgd2hpbGUgKGkpXG4gICAgZmluYWxpemVyc1stLWldKCk7XG59XG5mdW5jdGlvbiBydW5fYXRfZW5kX29mX3RoaXNfb3JfbmV4dF9waHlzaWNhbF90aWNrKGZuKSB7XG4gIGZ1bmN0aW9uIGZpbmFsaXplcigpIHtcbiAgICBmbigpO1xuICAgIHRpY2tGaW5hbGl6ZXJzLnNwbGljZSh0aWNrRmluYWxpemVycy5pbmRleE9mKGZpbmFsaXplciksIDEpO1xuICB9XG4gIHRpY2tGaW5hbGl6ZXJzLnB1c2goZmluYWxpemVyKTtcbiAgKytudW1TY2hlZHVsZWRDYWxscztcbiAgYXNhcChmdW5jdGlvbigpIHtcbiAgICBpZiAoLS1udW1TY2hlZHVsZWRDYWxscyA9PT0gMClcbiAgICAgIGZpbmFsaXplUGh5c2ljYWxUaWNrKCk7XG4gIH0sIFtdKTtcbn1cbmZ1bmN0aW9uIGFkZFBvc3NpYmx5VW5oYW5kbGVkRXJyb3IocHJvbWlzZSkge1xuICBpZiAoIXVuaGFuZGxlZEVycm9ycy5zb21lKGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gcC5fdmFsdWUgPT09IHByb21pc2UuX3ZhbHVlO1xuICB9KSlcbiAgICB1bmhhbmRsZWRFcnJvcnMucHVzaChwcm9taXNlKTtcbn1cbmZ1bmN0aW9uIG1hcmtFcnJvckFzSGFuZGxlZChwcm9taXNlKSB7XG4gIHZhciBpID0gdW5oYW5kbGVkRXJyb3JzLmxlbmd0aDtcbiAgd2hpbGUgKGkpXG4gICAgaWYgKHVuaGFuZGxlZEVycm9yc1stLWldLl92YWx1ZSA9PT0gcHJvbWlzZS5fdmFsdWUpIHtcbiAgICAgIHVuaGFuZGxlZEVycm9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxufVxuZnVuY3Rpb24gUHJvbWlzZVJlamVjdChyZWFzb24pIHtcbiAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoSU5URVJOQUwsIGZhbHNlLCByZWFzb24pO1xufVxuZnVuY3Rpb24gd3JhcChmbiwgZXJyb3JDYXRjaGVyKSB7XG4gIHZhciBwc2QgPSBQU0Q7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgd2FzUm9vdEV4ZWMgPSBiZWdpbk1pY3JvVGlja1Njb3BlKCksIG91dGVyU2NvcGUgPSBQU0Q7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaFRvWm9uZShwc2QsIHRydWUpO1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JDYXRjaGVyICYmIGVycm9yQ2F0Y2hlcihlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc3dpdGNoVG9ab25lKG91dGVyU2NvcGUsIGZhbHNlKTtcbiAgICAgIGlmICh3YXNSb290RXhlYylcbiAgICAgICAgZW5kTWljcm9UaWNrU2NvcGUoKTtcbiAgICB9XG4gIH07XG59XG52YXIgdGFzayA9IHthd2FpdHM6IDAsIGVjaG9lczogMCwgaWQ6IDB9O1xudmFyIHRhc2tDb3VudGVyID0gMDtcbnZhciB6b25lU3RhY2sgPSBbXTtcbnZhciB6b25lRWNob2VzID0gMDtcbnZhciB0b3RhbEVjaG9lcyA9IDA7XG52YXIgem9uZV9pZF9jb3VudGVyID0gMDtcbmZ1bmN0aW9uIG5ld1Njb3BlKGZuLCBwcm9wczIsIGExLCBhMikge1xuICB2YXIgcGFyZW50ID0gUFNELCBwc2QgPSBPYmplY3QuY3JlYXRlKHBhcmVudCk7XG4gIHBzZC5wYXJlbnQgPSBwYXJlbnQ7XG4gIHBzZC5yZWYgPSAwO1xuICBwc2QuZ2xvYmFsID0gZmFsc2U7XG4gIHBzZC5pZCA9ICsrem9uZV9pZF9jb3VudGVyO1xuICB2YXIgZ2xvYmFsRW52ID0gZ2xvYmFsUFNELmVudjtcbiAgcHNkLmVudiA9IHBhdGNoR2xvYmFsUHJvbWlzZSA/IHtcbiAgICBQcm9taXNlOiBEZXhpZVByb21pc2UsXG4gICAgUHJvbWlzZVByb3A6IHt2YWx1ZTogRGV4aWVQcm9taXNlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlfSxcbiAgICBhbGw6IERleGllUHJvbWlzZS5hbGwsXG4gICAgcmFjZTogRGV4aWVQcm9taXNlLnJhY2UsXG4gICAgYWxsU2V0dGxlZDogRGV4aWVQcm9taXNlLmFsbFNldHRsZWQsXG4gICAgYW55OiBEZXhpZVByb21pc2UuYW55LFxuICAgIHJlc29sdmU6IERleGllUHJvbWlzZS5yZXNvbHZlLFxuICAgIHJlamVjdDogRGV4aWVQcm9taXNlLnJlamVjdCxcbiAgICBudGhlbjogZ2V0UGF0Y2hlZFByb21pc2VUaGVuKGdsb2JhbEVudi5udGhlbiwgcHNkKSxcbiAgICBndGhlbjogZ2V0UGF0Y2hlZFByb21pc2VUaGVuKGdsb2JhbEVudi5ndGhlbiwgcHNkKVxuICB9IDoge307XG4gIGlmIChwcm9wczIpXG4gICAgZXh0ZW5kKHBzZCwgcHJvcHMyKTtcbiAgKytwYXJlbnQucmVmO1xuICBwc2QuZmluYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAtLXRoaXMucGFyZW50LnJlZiB8fCB0aGlzLnBhcmVudC5maW5hbGl6ZSgpO1xuICB9O1xuICB2YXIgcnYgPSB1c2VQU0QocHNkLCBmbiwgYTEsIGEyKTtcbiAgaWYgKHBzZC5yZWYgPT09IDApXG4gICAgcHNkLmZpbmFsaXplKCk7XG4gIHJldHVybiBydjtcbn1cbmZ1bmN0aW9uIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCkge1xuICBpZiAoIXRhc2suaWQpXG4gICAgdGFzay5pZCA9ICsrdGFza0NvdW50ZXI7XG4gICsrdGFzay5hd2FpdHM7XG4gIHRhc2suZWNob2VzICs9IFpPTkVfRUNIT19MSU1JVDtcbiAgcmV0dXJuIHRhc2suaWQ7XG59XG5mdW5jdGlvbiBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cygpIHtcbiAgaWYgKCF0YXNrLmF3YWl0cylcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmICgtLXRhc2suYXdhaXRzID09PSAwKVxuICAgIHRhc2suaWQgPSAwO1xuICB0YXNrLmVjaG9lcyA9IHRhc2suYXdhaXRzICogWk9ORV9FQ0hPX0xJTUlUO1xuICByZXR1cm4gdHJ1ZTtcbn1cbmlmICgoXCJcIiArIG5hdGl2ZVByb21pc2VUaGVuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSA9PT0gLTEpIHtcbiAgaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMgPSBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cyA9IG5vcDtcbn1cbmZ1bmN0aW9uIG9uUG9zc2libGVQYXJhbGxlbGxBc3luYyhwb3NzaWJsZVByb21pc2UpIHtcbiAgaWYgKHRhc2suZWNob2VzICYmIHBvc3NpYmxlUHJvbWlzZSAmJiBwb3NzaWJsZVByb21pc2UuY29uc3RydWN0b3IgPT09IE5hdGl2ZVByb21pc2UpIHtcbiAgICBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgIHJldHVybiBwb3NzaWJsZVByb21pc2UudGhlbihmdW5jdGlvbih4KSB7XG4gICAgICBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSwgZnVuY3Rpb24oZSkge1xuICAgICAgZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgIHJldHVybiByZWplY3Rpb24oZSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHBvc3NpYmxlUHJvbWlzZTtcbn1cbmZ1bmN0aW9uIHpvbmVFbnRlckVjaG8odGFyZ2V0Wm9uZSkge1xuICArK3RvdGFsRWNob2VzO1xuICBpZiAoIXRhc2suZWNob2VzIHx8IC0tdGFzay5lY2hvZXMgPT09IDApIHtcbiAgICB0YXNrLmVjaG9lcyA9IHRhc2suaWQgPSAwO1xuICB9XG4gIHpvbmVTdGFjay5wdXNoKFBTRCk7XG4gIHN3aXRjaFRvWm9uZSh0YXJnZXRab25lLCB0cnVlKTtcbn1cbmZ1bmN0aW9uIHpvbmVMZWF2ZUVjaG8oKSB7XG4gIHZhciB6b25lID0gem9uZVN0YWNrW3pvbmVTdGFjay5sZW5ndGggLSAxXTtcbiAgem9uZVN0YWNrLnBvcCgpO1xuICBzd2l0Y2hUb1pvbmUoem9uZSwgZmFsc2UpO1xufVxuZnVuY3Rpb24gc3dpdGNoVG9ab25lKHRhcmdldFpvbmUsIGJFbnRlcmluZ1pvbmUpIHtcbiAgdmFyIGN1cnJlbnRab25lID0gUFNEO1xuICBpZiAoYkVudGVyaW5nWm9uZSA/IHRhc2suZWNob2VzICYmICghem9uZUVjaG9lcysrIHx8IHRhcmdldFpvbmUgIT09IFBTRCkgOiB6b25lRWNob2VzICYmICghLS16b25lRWNob2VzIHx8IHRhcmdldFpvbmUgIT09IFBTRCkpIHtcbiAgICBlbnF1ZXVlTmF0aXZlTWljcm9UYXNrKGJFbnRlcmluZ1pvbmUgPyB6b25lRW50ZXJFY2hvLmJpbmQobnVsbCwgdGFyZ2V0Wm9uZSkgOiB6b25lTGVhdmVFY2hvKTtcbiAgfVxuICBpZiAodGFyZ2V0Wm9uZSA9PT0gUFNEKVxuICAgIHJldHVybjtcbiAgUFNEID0gdGFyZ2V0Wm9uZTtcbiAgaWYgKGN1cnJlbnRab25lID09PSBnbG9iYWxQU0QpXG4gICAgZ2xvYmFsUFNELmVudiA9IHNuYXBTaG90KCk7XG4gIGlmIChwYXRjaEdsb2JhbFByb21pc2UpIHtcbiAgICB2YXIgR2xvYmFsUHJvbWlzZV8xID0gZ2xvYmFsUFNELmVudi5Qcm9taXNlO1xuICAgIHZhciB0YXJnZXRFbnYgPSB0YXJnZXRab25lLmVudjtcbiAgICBuYXRpdmVQcm9taXNlUHJvdG8udGhlbiA9IHRhcmdldEVudi5udGhlbjtcbiAgICBHbG9iYWxQcm9taXNlXzEucHJvdG90eXBlLnRoZW4gPSB0YXJnZXRFbnYuZ3RoZW47XG4gICAgaWYgKGN1cnJlbnRab25lLmdsb2JhbCB8fCB0YXJnZXRab25lLmdsb2JhbCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9nbG9iYWwsIFwiUHJvbWlzZVwiLCB0YXJnZXRFbnYuUHJvbWlzZVByb3ApO1xuICAgICAgR2xvYmFsUHJvbWlzZV8xLmFsbCA9IHRhcmdldEVudi5hbGw7XG4gICAgICBHbG9iYWxQcm9taXNlXzEucmFjZSA9IHRhcmdldEVudi5yYWNlO1xuICAgICAgR2xvYmFsUHJvbWlzZV8xLnJlc29sdmUgPSB0YXJnZXRFbnYucmVzb2x2ZTtcbiAgICAgIEdsb2JhbFByb21pc2VfMS5yZWplY3QgPSB0YXJnZXRFbnYucmVqZWN0O1xuICAgICAgaWYgKHRhcmdldEVudi5hbGxTZXR0bGVkKVxuICAgICAgICBHbG9iYWxQcm9taXNlXzEuYWxsU2V0dGxlZCA9IHRhcmdldEVudi5hbGxTZXR0bGVkO1xuICAgICAgaWYgKHRhcmdldEVudi5hbnkpXG4gICAgICAgIEdsb2JhbFByb21pc2VfMS5hbnkgPSB0YXJnZXRFbnYuYW55O1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gc25hcFNob3QoKSB7XG4gIHZhciBHbG9iYWxQcm9taXNlID0gX2dsb2JhbC5Qcm9taXNlO1xuICByZXR1cm4gcGF0Y2hHbG9iYWxQcm9taXNlID8ge1xuICAgIFByb21pc2U6IEdsb2JhbFByb21pc2UsXG4gICAgUHJvbWlzZVByb3A6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoX2dsb2JhbCwgXCJQcm9taXNlXCIpLFxuICAgIGFsbDogR2xvYmFsUHJvbWlzZS5hbGwsXG4gICAgcmFjZTogR2xvYmFsUHJvbWlzZS5yYWNlLFxuICAgIGFsbFNldHRsZWQ6IEdsb2JhbFByb21pc2UuYWxsU2V0dGxlZCxcbiAgICBhbnk6IEdsb2JhbFByb21pc2UuYW55LFxuICAgIHJlc29sdmU6IEdsb2JhbFByb21pc2UucmVzb2x2ZSxcbiAgICByZWplY3Q6IEdsb2JhbFByb21pc2UucmVqZWN0LFxuICAgIG50aGVuOiBuYXRpdmVQcm9taXNlUHJvdG8udGhlbixcbiAgICBndGhlbjogR2xvYmFsUHJvbWlzZS5wcm90b3R5cGUudGhlblxuICB9IDoge307XG59XG5mdW5jdGlvbiB1c2VQU0QocHNkLCBmbiwgYTEsIGEyLCBhMykge1xuICB2YXIgb3V0ZXJTY29wZSA9IFBTRDtcbiAgdHJ5IHtcbiAgICBzd2l0Y2hUb1pvbmUocHNkLCB0cnVlKTtcbiAgICByZXR1cm4gZm4oYTEsIGEyLCBhMyk7XG4gIH0gZmluYWxseSB7XG4gICAgc3dpdGNoVG9ab25lKG91dGVyU2NvcGUsIGZhbHNlKTtcbiAgfVxufVxuZnVuY3Rpb24gZW5xdWV1ZU5hdGl2ZU1pY3JvVGFzayhqb2IpIHtcbiAgbmF0aXZlUHJvbWlzZVRoZW4uY2FsbChyZXNvbHZlZE5hdGl2ZVByb21pc2UsIGpvYik7XG59XG5mdW5jdGlvbiBuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKGZuLCB6b25lLCBwb3NzaWJsZUF3YWl0LCBjbGVhbnVwKSB7XG4gIHJldHVybiB0eXBlb2YgZm4gIT09IFwiZnVuY3Rpb25cIiA/IGZuIDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dGVyWm9uZSA9IFBTRDtcbiAgICBpZiAocG9zc2libGVBd2FpdClcbiAgICAgIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgc3dpdGNoVG9ab25lKHpvbmUsIHRydWUpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc3dpdGNoVG9ab25lKG91dGVyWm9uZSwgZmFsc2UpO1xuICAgICAgaWYgKGNsZWFudXApXG4gICAgICAgIGVucXVldWVOYXRpdmVNaWNyb1Rhc2soZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGdldFBhdGNoZWRQcm9taXNlVGhlbihvcmlnVGhlbiwgem9uZSkge1xuICByZXR1cm4gZnVuY3Rpb24ob25SZXNvbHZlZCwgb25SZWplY3RlZCkge1xuICAgIHJldHVybiBvcmlnVGhlbi5jYWxsKHRoaXMsIG5hdGl2ZUF3YWl0Q29tcGF0aWJsZVdyYXAob25SZXNvbHZlZCwgem9uZSksIG5hdGl2ZUF3YWl0Q29tcGF0aWJsZVdyYXAob25SZWplY3RlZCwgem9uZSkpO1xuICB9O1xufVxudmFyIFVOSEFORExFRFJFSkVDVElPTiA9IFwidW5oYW5kbGVkcmVqZWN0aW9uXCI7XG5mdW5jdGlvbiBnbG9iYWxFcnJvcihlcnIsIHByb21pc2UpIHtcbiAgdmFyIHJ2O1xuICB0cnkge1xuICAgIHJ2ID0gcHJvbWlzZS5vbnVuY2F0Y2hlZChlcnIpO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgaWYgKHJ2ICE9PSBmYWxzZSlcbiAgICB0cnkge1xuICAgICAgdmFyIGV2ZW50LCBldmVudERhdGEgPSB7cHJvbWlzZSwgcmVhc29uOiBlcnJ9O1xuICAgICAgaWYgKF9nbG9iYWwuZG9jdW1lbnQgJiYgZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgICAgICBldmVudC5pbml0RXZlbnQoVU5IQU5ETEVEUkVKRUNUSU9OLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgZXh0ZW5kKGV2ZW50LCBldmVudERhdGEpO1xuICAgICAgfSBlbHNlIGlmIChfZ2xvYmFsLkN1c3RvbUV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFVOSEFORExFRFJFSkVDVElPTiwge2RldGFpbDogZXZlbnREYXRhfSk7XG4gICAgICAgIGV4dGVuZChldmVudCwgZXZlbnREYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmIChldmVudCAmJiBfZ2xvYmFsLmRpc3BhdGNoRXZlbnQpIHtcbiAgICAgICAgZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIGlmICghX2dsb2JhbC5Qcm9taXNlUmVqZWN0aW9uRXZlbnQgJiYgX2dsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbilcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgX2dsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbihldmVudCk7XG4gICAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkZWJ1ZyAmJiBldmVudCAmJiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgcmVqZWN0aW9uOiBcIiArIChlcnIuc3RhY2sgfHwgZXJyKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbn1cbnZhciByZWplY3Rpb24gPSBEZXhpZVByb21pc2UucmVqZWN0O1xuZnVuY3Rpb24gdGVtcFRyYW5zYWN0aW9uKGRiLCBtb2RlLCBzdG9yZU5hbWVzLCBmbikge1xuICBpZiAoIWRiLl9zdGF0ZS5vcGVuQ29tcGxldGUgJiYgIVBTRC5sZXRUaHJvdWdoKSB7XG4gICAgaWYgKCFkYi5fc3RhdGUuaXNCZWluZ09wZW5lZCkge1xuICAgICAgaWYgKCFkYi5fb3B0aW9ucy5hdXRvT3BlbilcbiAgICAgICAgcmV0dXJuIHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5EYXRhYmFzZUNsb3NlZCgpKTtcbiAgICAgIGRiLm9wZW4oKS5jYXRjaChub3ApO1xuICAgIH1cbiAgICByZXR1cm4gZGIuX3N0YXRlLmRiUmVhZHlQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGVtcFRyYW5zYWN0aW9uKGRiLCBtb2RlLCBzdG9yZU5hbWVzLCBmbik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRyYW5zID0gZGIuX2NyZWF0ZVRyYW5zYWN0aW9uKG1vZGUsIHN0b3JlTmFtZXMsIGRiLl9kYlNjaGVtYSk7XG4gICAgdHJ5IHtcbiAgICAgIHRyYW5zLmNyZWF0ZSgpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zLl9wcm9taXNlKG1vZGUsIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIG5ld1Njb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICBQU0QudHJhbnMgPSB0cmFucztcbiAgICAgICAgcmV0dXJuIGZuKHJlc29sdmUsIHJlamVjdCwgdHJhbnMpO1xuICAgICAgfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIHJldHVybiB0cmFucy5fY29tcGxldGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbnZhciBERVhJRV9WRVJTSU9OID0gXCIzLjEuMC1iZXRhLjExXCI7XG52YXIgbWF4U3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NTUzNSk7XG52YXIgbWluS2V5ID0gLUluZmluaXR5O1xudmFyIElOVkFMSURfS0VZX0FSR1VNRU5UID0gXCJJbnZhbGlkIGtleSBwcm92aWRlZC4gS2V5cyBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLCBudW1iZXIsIERhdGUgb3IgQXJyYXk8c3RyaW5nIHwgbnVtYmVyIHwgRGF0ZT4uXCI7XG52YXIgU1RSSU5HX0VYUEVDVEVEID0gXCJTdHJpbmcgZXhwZWN0ZWQuXCI7XG52YXIgY29ubmVjdGlvbnMgPSBbXTtcbnZhciBpc0lFT3JFZGdlID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAvKE1TSUV8VHJpZGVudHxFZGdlKS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbnZhciBoYXNJRURlbGV0ZU9iamVjdFN0b3JlQnVnID0gaXNJRU9yRWRnZTtcbnZhciBoYW5nc09uRGVsZXRlTGFyZ2VLZXlSYW5nZSA9IGlzSUVPckVkZ2U7XG52YXIgZGV4aWVTdGFja0ZyYW1lRmlsdGVyID0gZnVuY3Rpb24oZnJhbWUpIHtcbiAgcmV0dXJuICEvKGRleGllXFwuanN8ZGV4aWVcXC5taW5cXC5qcykvLnRlc3QoZnJhbWUpO1xufTtcbnZhciBEQk5BTUVTX0RCID0gXCJfX2RibmFtZXNcIjtcbnZhciBSRUFET05MWSA9IFwicmVhZG9ubHlcIjtcbnZhciBSRUFEV1JJVEUgPSBcInJlYWR3cml0ZVwiO1xuZnVuY3Rpb24gY29tYmluZShmaWx0ZXIxLCBmaWx0ZXIyKSB7XG4gIHJldHVybiBmaWx0ZXIxID8gZmlsdGVyMiA/IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaWx0ZXIxLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgJiYgZmlsdGVyMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9IDogZmlsdGVyMSA6IGZpbHRlcjI7XG59XG52YXIgZG9tRGVwcztcbnRyeSB7XG4gIGRvbURlcHMgPSB7XG4gICAgaW5kZXhlZERCOiBfZ2xvYmFsLmluZGV4ZWREQiB8fCBfZ2xvYmFsLm1vekluZGV4ZWREQiB8fCBfZ2xvYmFsLndlYmtpdEluZGV4ZWREQiB8fCBfZ2xvYmFsLm1zSW5kZXhlZERCLFxuICAgIElEQktleVJhbmdlOiBfZ2xvYmFsLklEQktleVJhbmdlIHx8IF9nbG9iYWwud2Via2l0SURCS2V5UmFuZ2VcbiAgfTtcbn0gY2F0Y2ggKGUpIHtcbiAgZG9tRGVwcyA9IHtpbmRleGVkREI6IG51bGwsIElEQktleVJhbmdlOiBudWxsfTtcbn1cbmZ1bmN0aW9uIHNhZmFyaU11bHRpU3RvcmVGaXgoc3RvcmVOYW1lcykge1xuICByZXR1cm4gc3RvcmVOYW1lcy5sZW5ndGggPT09IDEgPyBzdG9yZU5hbWVzWzBdIDogc3RvcmVOYW1lcztcbn1cbnZhciBnZXRNYXhLZXkgPSBmdW5jdGlvbihJZGJLZXlSYW5nZSkge1xuICB0cnkge1xuICAgIElkYktleVJhbmdlLm9ubHkoW1tdXSk7XG4gICAgZ2V0TWF4S2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW1tdXTtcbiAgICB9O1xuICAgIHJldHVybiBbW11dO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZ2V0TWF4S2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbWF4U3RyaW5nO1xuICAgIH07XG4gICAgcmV0dXJuIG1heFN0cmluZztcbiAgfVxufTtcbnZhciBBbnlSYW5nZSA9IHtcbiAgdHlwZTogMyxcbiAgbG93ZXI6IC1JbmZpbml0eSxcbiAgbG93ZXJPcGVuOiBmYWxzZSxcbiAgZ2V0IHVwcGVyKCkge1xuICAgIHJldHVybiBnZXRNYXhLZXkoZG9tRGVwcy5JREJLZXlSYW5nZSk7XG4gIH0sXG4gIHVwcGVyT3BlbjogZmFsc2Vcbn07XG5mdW5jdGlvbiB3b3JrYXJvdW5kRm9yVW5kZWZpbmVkUHJpbUtleShrZXlQYXRoKSB7XG4gIHJldHVybiB0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIiAmJiAhL1xcLi8udGVzdChrZXlQYXRoKSA/IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmpba2V5UGF0aF0gPT09IHZvaWQgMCAmJiBrZXlQYXRoIGluIG9iaikge1xuICAgICAgb2JqID0gZGVlcENsb25lKG9iaik7XG4gICAgICBkZWxldGUgb2JqW2tleVBhdGhdO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9IDogZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn1cbnZhciBUYWJsZSA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUYWJsZTIoKSB7XG4gIH1cbiAgVGFibGUyLnByb3RvdHlwZS5fdHJhbnMgPSBmdW5jdGlvbihtb2RlLCBmbiwgd3JpdGVMb2NrZWQpIHtcbiAgICB2YXIgdHJhbnMgPSB0aGlzLl90eCB8fCBQU0QudHJhbnM7XG4gICAgdmFyIHRhYmxlTmFtZSA9IHRoaXMubmFtZTtcbiAgICBmdW5jdGlvbiBjaGVja1RhYmxlSW5UcmFuc2FjdGlvbihyZXNvbHZlLCByZWplY3QsIHRyYW5zMikge1xuICAgICAgaWYgKCF0cmFuczIuc2NoZW1hW3RhYmxlTmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk5vdEZvdW5kKFwiVGFibGUgXCIgKyB0YWJsZU5hbWUgKyBcIiBub3QgcGFydCBvZiB0cmFuc2FjdGlvblwiKTtcbiAgICAgIHJldHVybiBmbih0cmFuczIuaWRidHJhbnMsIHRyYW5zMik7XG4gICAgfVxuICAgIHZhciB3YXNSb290RXhlYyA9IGJlZ2luTWljcm9UaWNrU2NvcGUoKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRyYW5zICYmIHRyYW5zLmRiID09PSB0aGlzLmRiID8gdHJhbnMgPT09IFBTRC50cmFucyA/IHRyYW5zLl9wcm9taXNlKG1vZGUsIGNoZWNrVGFibGVJblRyYW5zYWN0aW9uLCB3cml0ZUxvY2tlZCkgOiBuZXdTY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zLl9wcm9taXNlKG1vZGUsIGNoZWNrVGFibGVJblRyYW5zYWN0aW9uLCB3cml0ZUxvY2tlZCk7XG4gICAgICB9LCB7dHJhbnMsIHRyYW5zbGVzczogUFNELnRyYW5zbGVzcyB8fCBQU0R9KSA6IHRlbXBUcmFuc2FjdGlvbih0aGlzLmRiLCBtb2RlLCBbdGhpcy5uYW1lXSwgY2hlY2tUYWJsZUluVHJhbnNhY3Rpb24pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAod2FzUm9vdEV4ZWMpXG4gICAgICAgIGVuZE1pY3JvVGlja1Njb3BlKCk7XG4gICAgfVxuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleU9yQ3JpdCwgY2IpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGlmIChrZXlPckNyaXQgJiYga2V5T3JDcml0LmNvbnN0cnVjdG9yID09PSBPYmplY3QpXG4gICAgICByZXR1cm4gdGhpcy53aGVyZShrZXlPckNyaXQpLmZpcnN0KGNiKTtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkb25seVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUuZ2V0KHt0cmFucywga2V5OiBrZXlPckNyaXR9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICByZXR1cm4gX3RoaXMuaG9vay5yZWFkaW5nLmZpcmUocmVzKTtcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLndoZXJlID0gZnVuY3Rpb24oaW5kZXhPckNyaXQpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4T3JDcml0ID09PSBcInN0cmluZ1wiKVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmRiLldoZXJlQ2xhdXNlKHRoaXMsIGluZGV4T3JDcml0KTtcbiAgICBpZiAoaXNBcnJheShpbmRleE9yQ3JpdCkpXG4gICAgICByZXR1cm4gbmV3IHRoaXMuZGIuV2hlcmVDbGF1c2UodGhpcywgXCJbXCIgKyBpbmRleE9yQ3JpdC5qb2luKFwiK1wiKSArIFwiXVwiKTtcbiAgICB2YXIga2V5UGF0aHMgPSBrZXlzKGluZGV4T3JDcml0KTtcbiAgICBpZiAoa2V5UGF0aHMubGVuZ3RoID09PSAxKVxuICAgICAgcmV0dXJuIHRoaXMud2hlcmUoa2V5UGF0aHNbMF0pLmVxdWFscyhpbmRleE9yQ3JpdFtrZXlQYXRoc1swXV0pO1xuICAgIHZhciBjb21wb3VuZEluZGV4ID0gdGhpcy5zY2hlbWEuaW5kZXhlcy5jb25jYXQodGhpcy5zY2hlbWEucHJpbUtleSkuZmlsdGVyKGZ1bmN0aW9uKGl4KSB7XG4gICAgICByZXR1cm4gaXguY29tcG91bmQgJiYga2V5UGF0aHMuZXZlcnkoZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgICByZXR1cm4gaXgua2V5UGF0aC5pbmRleE9mKGtleVBhdGgpID49IDA7XG4gICAgICB9KSAmJiBpeC5rZXlQYXRoLmV2ZXJ5KGZ1bmN0aW9uKGtleVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGtleVBhdGhzLmluZGV4T2Yoa2V5UGF0aCkgPj0gMDtcbiAgICAgIH0pO1xuICAgIH0pWzBdO1xuICAgIGlmIChjb21wb3VuZEluZGV4ICYmIHRoaXMuZGIuX21heEtleSAhPT0gbWF4U3RyaW5nKVxuICAgICAgcmV0dXJuIHRoaXMud2hlcmUoY29tcG91bmRJbmRleC5uYW1lKS5lcXVhbHMoY29tcG91bmRJbmRleC5rZXlQYXRoLm1hcChmdW5jdGlvbihrcCkge1xuICAgICAgICByZXR1cm4gaW5kZXhPckNyaXRba3BdO1xuICAgICAgfSkpO1xuICAgIGlmICghY29tcG91bmRJbmRleCAmJiBkZWJ1ZylcbiAgICAgIGNvbnNvbGUud2FybihcIlRoZSBxdWVyeSBcIiArIEpTT04uc3RyaW5naWZ5KGluZGV4T3JDcml0KSArIFwiIG9uIFwiICsgdGhpcy5uYW1lICsgXCIgd291bGQgYmVuZWZpdCBvZiBhIFwiICsgKFwiY29tcG91bmQgaW5kZXggW1wiICsga2V5UGF0aHMuam9pbihcIitcIikgKyBcIl1cIikpO1xuICAgIHZhciBpZHhCeU5hbWUgPSB0aGlzLnNjaGVtYS5pZHhCeU5hbWU7XG4gICAgdmFyIGlkYiA9IHRoaXMuZGIuX2RlcHMuaW5kZXhlZERCO1xuICAgIGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gaWRiLmNtcChhLCBiKSA9PT0gMDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgX2EyID0ga2V5UGF0aHMucmVkdWNlKGZ1bmN0aW9uKF9hMywga2V5UGF0aCkge1xuICAgICAgdmFyIHByZXZJbmRleCA9IF9hM1swXSwgcHJldkZpbHRlckZuID0gX2EzWzFdO1xuICAgICAgdmFyIGluZGV4ID0gaWR4QnlOYW1lW2tleVBhdGhdO1xuICAgICAgdmFyIHZhbHVlID0gaW5kZXhPckNyaXRba2V5UGF0aF07XG4gICAgICByZXR1cm4gW1xuICAgICAgICBwcmV2SW5kZXggfHwgaW5kZXgsXG4gICAgICAgIHByZXZJbmRleCB8fCAhaW5kZXggPyBjb21iaW5lKHByZXZGaWx0ZXJGbiwgaW5kZXggJiYgaW5kZXgubXVsdGkgPyBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgdmFyIHByb3AgPSBnZXRCeUtleVBhdGgoeCwga2V5UGF0aCk7XG4gICAgICAgICAgcmV0dXJuIGlzQXJyYXkocHJvcCkgJiYgcHJvcC5zb21lKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBlcXVhbHModmFsdWUsIGl0ZW0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IDogZnVuY3Rpb24oeCkge1xuICAgICAgICAgIHJldHVybiBlcXVhbHModmFsdWUsIGdldEJ5S2V5UGF0aCh4LCBrZXlQYXRoKSk7XG4gICAgICAgIH0pIDogcHJldkZpbHRlckZuXG4gICAgICBdO1xuICAgIH0sIFtudWxsLCBudWxsXSksIGlkeCA9IF9hMlswXSwgZmlsdGVyRnVuY3Rpb24gPSBfYTJbMV07XG4gICAgcmV0dXJuIGlkeCA/IHRoaXMud2hlcmUoaWR4Lm5hbWUpLmVxdWFscyhpbmRleE9yQ3JpdFtpZHgua2V5UGF0aF0pLmZpbHRlcihmaWx0ZXJGdW5jdGlvbikgOiBjb21wb3VuZEluZGV4ID8gdGhpcy5maWx0ZXIoZmlsdGVyRnVuY3Rpb24pIDogdGhpcy53aGVyZShrZXlQYXRocykuZXF1YWxzKFwiXCIpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlckZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkuYW5kKGZpbHRlckZ1bmN0aW9uKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uKHRoZW5TaG9ydGN1dCkge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLmNvdW50KHRoZW5TaG9ydGN1dCk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkub2Zmc2V0KG9mZnNldCk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUubGltaXQgPSBmdW5jdGlvbihudW1Sb3dzKSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkubGltaXQobnVtUm93cyk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkuZWFjaChjYWxsYmFjayk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKHRoZW5TaG9ydGN1dCkge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLnRvQXJyYXkodGhlblNob3J0Y3V0KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS50b0NvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuZGIuQ29sbGVjdGlvbihuZXcgdGhpcy5kYi5XaGVyZUNsYXVzZSh0aGlzKSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUub3JkZXJCeSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmRiLkNvbGxlY3Rpb24obmV3IHRoaXMuZGIuV2hlcmVDbGF1c2UodGhpcywgaXNBcnJheShpbmRleCkgPyBcIltcIiArIGluZGV4LmpvaW4oXCIrXCIpICsgXCJdXCIgOiBpbmRleCkpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS5yZXZlcnNlKCk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUubWFwVG9DbGFzcyA9IGZ1bmN0aW9uKGNvbnN0cnVjdG9yKSB7XG4gICAgdGhpcy5zY2hlbWEubWFwcGVkQ2xhc3MgPSBjb25zdHJ1Y3RvcjtcbiAgICB2YXIgcmVhZEhvb2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmICghb2JqKVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgdmFyIHJlcyA9IE9iamVjdC5jcmVhdGUoY29uc3RydWN0b3IucHJvdG90eXBlKTtcbiAgICAgIGZvciAodmFyIG0gaW4gb2JqKVxuICAgICAgICBpZiAoaGFzT3duKG9iaiwgbSkpXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc1ttXSA9IG9ialttXTtcbiAgICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICAgIGlmICh0aGlzLnNjaGVtYS5yZWFkSG9vaykge1xuICAgICAgdGhpcy5ob29rLnJlYWRpbmcudW5zdWJzY3JpYmUodGhpcy5zY2hlbWEucmVhZEhvb2spO1xuICAgIH1cbiAgICB0aGlzLnNjaGVtYS5yZWFkSG9vayA9IHJlYWRIb29rO1xuICAgIHRoaXMuaG9vayhcInJlYWRpbmdcIiwgcmVhZEhvb2spO1xuICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5kZWZpbmVDbGFzcyA9IGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIENsYXNzKGNvbnRlbnQpIHtcbiAgICAgIGV4dGVuZCh0aGlzLCBjb250ZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWFwVG9DbGFzcyhDbGFzcyk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBfYTIgPSB0aGlzLnNjaGVtYS5wcmltS2V5LCBhdXRvID0gX2EyLmF1dG8sIGtleVBhdGggPSBfYTIua2V5UGF0aDtcbiAgICB2YXIgb2JqVG9BZGQgPSBvYmo7XG4gICAgaWYgKGtleVBhdGggJiYgYXV0bykge1xuICAgICAgb2JqVG9BZGQgPSB3b3JrYXJvdW5kRm9yVW5kZWZpbmVkUHJpbUtleShrZXlQYXRoKShvYmopO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiYWRkXCIsIGtleXM6IGtleSAhPSBudWxsID8gW2tleV0gOiBudWxsLCB2YWx1ZXM6IFtvYmpUb0FkZF19KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5udW1GYWlsdXJlcyA/IERleGllUHJvbWlzZS5yZWplY3QocmVzLmZhaWx1cmVzWzBdKSA6IHJlcy5sYXN0UmVzdWx0O1xuICAgIH0pLnRoZW4oZnVuY3Rpb24obGFzdFJlc3VsdCkge1xuICAgICAgaWYgKGtleVBhdGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoLCBsYXN0UmVzdWx0KTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihrZXlPck9iamVjdCwgbW9kaWZpY2F0aW9ucykge1xuICAgIGlmICh0eXBlb2Yga2V5T3JPYmplY3QgPT09IFwib2JqZWN0XCIgJiYgIWlzQXJyYXkoa2V5T3JPYmplY3QpKSB7XG4gICAgICB2YXIga2V5ID0gZ2V0QnlLZXlQYXRoKGtleU9yT2JqZWN0LCB0aGlzLnNjaGVtYS5wcmltS2V5LmtleVBhdGgpO1xuICAgICAgaWYgKGtleSA9PT0gdm9pZCAwKVxuICAgICAgICByZXR1cm4gcmVqZWN0aW9uKG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIkdpdmVuIG9iamVjdCBkb2VzIG5vdCBjb250YWluIGl0cyBwcmltYXJ5IGtleVwiKSk7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWNhdGlvbnMgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGtleXMobW9kaWZpY2F0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXlQYXRoKSB7XG4gICAgICAgICAgICBzZXRCeUtleVBhdGgoa2V5T3JPYmplY3QsIGtleVBhdGgsIG1vZGlmaWNhdGlvbnNba2V5UGF0aF0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vZGlmaWNhdGlvbnMoa2V5T3JPYmplY3QsIHt2YWx1ZToga2V5T3JPYmplY3QsIHByaW1LZXk6IGtleX0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChfYTIpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLndoZXJlKFwiOmlkXCIpLmVxdWFscyhrZXkpLm1vZGlmeShtb2RpZmljYXRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMud2hlcmUoXCI6aWRcIikuZXF1YWxzKGtleU9yT2JqZWN0KS5tb2RpZnkobW9kaWZpY2F0aW9ucyk7XG4gICAgfVxuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgX2EyID0gdGhpcy5zY2hlbWEucHJpbUtleSwgYXV0byA9IF9hMi5hdXRvLCBrZXlQYXRoID0gX2EyLmtleVBhdGg7XG4gICAgdmFyIG9ialRvQWRkID0gb2JqO1xuICAgIGlmIChrZXlQYXRoICYmIGF1dG8pIHtcbiAgICAgIG9ialRvQWRkID0gd29ya2Fyb3VuZEZvclVuZGVmaW5lZFByaW1LZXkoa2V5UGF0aCkob2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcInB1dFwiLCB2YWx1ZXM6IFtvYmpUb0FkZF0sIGtleXM6IGtleSAhPSBudWxsID8gW2tleV0gOiBudWxsfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIHJldHVybiByZXMubnVtRmFpbHVyZXMgPyBEZXhpZVByb21pc2UucmVqZWN0KHJlcy5mYWlsdXJlc1swXSkgOiByZXMubGFzdFJlc3VsdDtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGxhc3RSZXN1bHQpIHtcbiAgICAgIGlmIChrZXlQYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCwgbGFzdFJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiZGVsZXRlXCIsIGtleXM6IFtrZXldfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIHJldHVybiByZXMubnVtRmFpbHVyZXMgPyBEZXhpZVByb21pc2UucmVqZWN0KHJlcy5mYWlsdXJlc1swXSkgOiB2b2lkIDA7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJkZWxldGVSYW5nZVwiLCByYW5nZTogQW55UmFuZ2V9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5udW1GYWlsdXJlcyA/IERleGllUHJvbWlzZS5yZWplY3QocmVzLmZhaWx1cmVzWzBdKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5idWxrR2V0ID0gZnVuY3Rpb24oa2V5czIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWRvbmx5XCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5nZXRNYW55KHtcbiAgICAgICAga2V5czoga2V5czIsXG4gICAgICAgIHRyYW5zXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0Lm1hcChmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuaG9vay5yZWFkaW5nLmZpcmUocmVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5idWxrQWRkID0gZnVuY3Rpb24ob2JqZWN0cywga2V5c09yT3B0aW9ucywgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGtleXMyID0gQXJyYXkuaXNBcnJheShrZXlzT3JPcHRpb25zKSA/IGtleXNPck9wdGlvbnMgOiB2b2lkIDA7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgKGtleXMyID8gdm9pZCAwIDoga2V5c09yT3B0aW9ucyk7XG4gICAgdmFyIHdhbnRSZXN1bHRzID0gb3B0aW9ucyA/IG9wdGlvbnMuYWxsS2V5cyA6IHZvaWQgMDtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHZhciBfYTIgPSBfdGhpcy5zY2hlbWEucHJpbUtleSwgYXV0byA9IF9hMi5hdXRvLCBrZXlQYXRoID0gX2EyLmtleVBhdGg7XG4gICAgICBpZiAoa2V5UGF0aCAmJiBrZXlzMilcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiYnVsa0FkZCgpOiBrZXlzIGFyZ3VtZW50IGludmFsaWQgb24gdGFibGVzIHdpdGggaW5ib3VuZCBrZXlzXCIpO1xuICAgICAgaWYgKGtleXMyICYmIGtleXMyLmxlbmd0aCAhPT0gb2JqZWN0cy5sZW5ndGgpXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIkFyZ3VtZW50cyBvYmplY3RzIGFuZCBrZXlzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGhcIik7XG4gICAgICB2YXIgbnVtT2JqZWN0cyA9IG9iamVjdHMubGVuZ3RoO1xuICAgICAgdmFyIG9iamVjdHNUb0FkZCA9IGtleVBhdGggJiYgYXV0byA/IG9iamVjdHMubWFwKHdvcmthcm91bmRGb3JVbmRlZmluZWRQcmltS2V5KGtleVBhdGgpKSA6IG9iamVjdHM7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImFkZFwiLCBrZXlzOiBrZXlzMiwgdmFsdWVzOiBvYmplY3RzVG9BZGQsIHdhbnRSZXN1bHRzfSkudGhlbihmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgdmFyIG51bUZhaWx1cmVzID0gX2EzLm51bUZhaWx1cmVzLCByZXN1bHRzID0gX2EzLnJlc3VsdHMsIGxhc3RSZXN1bHQgPSBfYTMubGFzdFJlc3VsdCwgZmFpbHVyZXMgPSBfYTMuZmFpbHVyZXM7XG4gICAgICAgIHZhciByZXN1bHQgPSB3YW50UmVzdWx0cyA/IHJlc3VsdHMgOiBsYXN0UmVzdWx0O1xuICAgICAgICBpZiAobnVtRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgdGhyb3cgbmV3IEJ1bGtFcnJvcihfdGhpcy5uYW1lICsgXCIuYnVsa0FkZCgpOiBcIiArIG51bUZhaWx1cmVzICsgXCIgb2YgXCIgKyBudW1PYmplY3RzICsgXCIgb3BlcmF0aW9ucyBmYWlsZWRcIiwgZmFpbHVyZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuYnVsa1B1dCA9IGZ1bmN0aW9uKG9iamVjdHMsIGtleXNPck9wdGlvbnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBrZXlzMiA9IEFycmF5LmlzQXJyYXkoa2V5c09yT3B0aW9ucykgPyBrZXlzT3JPcHRpb25zIDogdm9pZCAwO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IChrZXlzMiA/IHZvaWQgMCA6IGtleXNPck9wdGlvbnMpO1xuICAgIHZhciB3YW50UmVzdWx0cyA9IG9wdGlvbnMgPyBvcHRpb25zLmFsbEtleXMgOiB2b2lkIDA7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICB2YXIgX2EyID0gX3RoaXMuc2NoZW1hLnByaW1LZXksIGF1dG8gPSBfYTIuYXV0bywga2V5UGF0aCA9IF9hMi5rZXlQYXRoO1xuICAgICAgaWYgKGtleVBhdGggJiYga2V5czIpXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcImJ1bGtQdXQoKToga2V5cyBhcmd1bWVudCBpbnZhbGlkIG9uIHRhYmxlcyB3aXRoIGluYm91bmQga2V5c1wiKTtcbiAgICAgIGlmIChrZXlzMiAmJiBrZXlzMi5sZW5ndGggIT09IG9iamVjdHMubGVuZ3RoKVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJBcmd1bWVudHMgb2JqZWN0cyBhbmQga2V5cyBtdXN0IGhhdmUgdGhlIHNhbWUgbGVuZ3RoXCIpO1xuICAgICAgdmFyIG51bU9iamVjdHMgPSBvYmplY3RzLmxlbmd0aDtcbiAgICAgIHZhciBvYmplY3RzVG9QdXQgPSBrZXlQYXRoICYmIGF1dG8gPyBvYmplY3RzLm1hcCh3b3JrYXJvdW5kRm9yVW5kZWZpbmVkUHJpbUtleShrZXlQYXRoKSkgOiBvYmplY3RzO1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJwdXRcIiwga2V5czoga2V5czIsIHZhbHVlczogb2JqZWN0c1RvUHV0LCB3YW50UmVzdWx0c30pLnRoZW4oZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgIHZhciBudW1GYWlsdXJlcyA9IF9hMy5udW1GYWlsdXJlcywgcmVzdWx0cyA9IF9hMy5yZXN1bHRzLCBsYXN0UmVzdWx0ID0gX2EzLmxhc3RSZXN1bHQsIGZhaWx1cmVzID0gX2EzLmZhaWx1cmVzO1xuICAgICAgICB2YXIgcmVzdWx0ID0gd2FudFJlc3VsdHMgPyByZXN1bHRzIDogbGFzdFJlc3VsdDtcbiAgICAgICAgaWYgKG51bUZhaWx1cmVzID09PSAwKVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIHRocm93IG5ldyBCdWxrRXJyb3IoX3RoaXMubmFtZSArIFwiLmJ1bGtQdXQoKTogXCIgKyBudW1GYWlsdXJlcyArIFwiIG9mIFwiICsgbnVtT2JqZWN0cyArIFwiIG9wZXJhdGlvbnMgZmFpbGVkXCIsIGZhaWx1cmVzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmJ1bGtEZWxldGUgPSBmdW5jdGlvbihrZXlzMikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIG51bUtleXMgPSBrZXlzMi5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImRlbGV0ZVwiLCBrZXlzOiBrZXlzMn0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oX2EyKSB7XG4gICAgICB2YXIgbnVtRmFpbHVyZXMgPSBfYTIubnVtRmFpbHVyZXMsIGxhc3RSZXN1bHQgPSBfYTIubGFzdFJlc3VsdCwgZmFpbHVyZXMgPSBfYTIuZmFpbHVyZXM7XG4gICAgICBpZiAobnVtRmFpbHVyZXMgPT09IDApXG4gICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xuICAgICAgdGhyb3cgbmV3IEJ1bGtFcnJvcihfdGhpcy5uYW1lICsgXCIuYnVsa0RlbGV0ZSgpOiBcIiArIG51bUZhaWx1cmVzICsgXCIgb2YgXCIgKyBudW1LZXlzICsgXCIgb3BlcmF0aW9ucyBmYWlsZWRcIiwgZmFpbHVyZXMpO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gVGFibGUyO1xufSgpO1xuZnVuY3Rpb24gRXZlbnRzKGN0eCkge1xuICB2YXIgZXZzID0ge307XG4gIHZhciBydiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgc3Vic2NyaWJlcikge1xuICAgIGlmIChzdWJzY3JpYmVyKSB7XG4gICAgICB2YXIgaTIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGkyIC0gMSk7XG4gICAgICB3aGlsZSAoLS1pMilcbiAgICAgICAgYXJnc1tpMiAtIDFdID0gYXJndW1lbnRzW2kyXTtcbiAgICAgIGV2c1tldmVudE5hbWVdLnN1YnNjcmliZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIHJldHVybiBjdHg7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXZlbnROYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gZXZzW2V2ZW50TmFtZV07XG4gICAgfVxuICB9O1xuICBydi5hZGRFdmVudFR5cGUgPSBhZGQ7XG4gIGZvciAodmFyIGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFkZChhcmd1bWVudHNbaV0pO1xuICB9XG4gIHJldHVybiBydjtcbiAgZnVuY3Rpb24gYWRkKGV2ZW50TmFtZSwgY2hhaW5GdW5jdGlvbiwgZGVmYXVsdEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudE5hbWUgPT09IFwib2JqZWN0XCIpXG4gICAgICByZXR1cm4gYWRkQ29uZmlndXJlZEV2ZW50cyhldmVudE5hbWUpO1xuICAgIGlmICghY2hhaW5GdW5jdGlvbilcbiAgICAgIGNoYWluRnVuY3Rpb24gPSByZXZlcnNlU3RvcHBhYmxlRXZlbnRDaGFpbjtcbiAgICBpZiAoIWRlZmF1bHRGdW5jdGlvbilcbiAgICAgIGRlZmF1bHRGdW5jdGlvbiA9IG5vcDtcbiAgICB2YXIgY29udGV4dCA9IHtcbiAgICAgIHN1YnNjcmliZXJzOiBbXSxcbiAgICAgIGZpcmU6IGRlZmF1bHRGdW5jdGlvbixcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgaWYgKGNvbnRleHQuc3Vic2NyaWJlcnMuaW5kZXhPZihjYikgPT09IC0xKSB7XG4gICAgICAgICAgY29udGV4dC5zdWJzY3JpYmVycy5wdXNoKGNiKTtcbiAgICAgICAgICBjb250ZXh0LmZpcmUgPSBjaGFpbkZ1bmN0aW9uKGNvbnRleHQuZmlyZSwgY2IpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIGNvbnRleHQuc3Vic2NyaWJlcnMgPSBjb250ZXh0LnN1YnNjcmliZXJzLmZpbHRlcihmdW5jdGlvbihmbikge1xuICAgICAgICAgIHJldHVybiBmbiAhPT0gY2I7XG4gICAgICAgIH0pO1xuICAgICAgICBjb250ZXh0LmZpcmUgPSBjb250ZXh0LnN1YnNjcmliZXJzLnJlZHVjZShjaGFpbkZ1bmN0aW9uLCBkZWZhdWx0RnVuY3Rpb24pO1xuICAgICAgfVxuICAgIH07XG4gICAgZXZzW2V2ZW50TmFtZV0gPSBydltldmVudE5hbWVdID0gY29udGV4dDtcbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuICBmdW5jdGlvbiBhZGRDb25maWd1cmVkRXZlbnRzKGNmZykge1xuICAgIGtleXMoY2ZnKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgdmFyIGFyZ3MgPSBjZmdbZXZlbnROYW1lXTtcbiAgICAgIGlmIChpc0FycmF5KGFyZ3MpKSB7XG4gICAgICAgIGFkZChldmVudE5hbWUsIGNmZ1tldmVudE5hbWVdWzBdLCBjZmdbZXZlbnROYW1lXVsxXSk7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3MgPT09IFwiYXNhcFwiKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gYWRkKGV2ZW50TmFtZSwgbWlycm9yLCBmdW5jdGlvbiBmaXJlKCkge1xuICAgICAgICAgIHZhciBpMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MyID0gbmV3IEFycmF5KGkyKTtcbiAgICAgICAgICB3aGlsZSAoaTItLSlcbiAgICAgICAgICAgIGFyZ3MyW2kyXSA9IGFyZ3VtZW50c1tpMl07XG4gICAgICAgICAgY29udGV4dC5zdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICBhc2FwJDEoZnVuY3Rpb24gZmlyZUV2ZW50KCkge1xuICAgICAgICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzMik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiSW52YWxpZCBldmVudCBjb25maWdcIik7XG4gICAgfSk7XG4gIH1cbn1cbmZ1bmN0aW9uIG1ha2VDbGFzc0NvbnN0cnVjdG9yKHByb3RvdHlwZSwgY29uc3RydWN0b3IpIHtcbiAgZGVyaXZlKGNvbnN0cnVjdG9yKS5mcm9tKHtwcm90b3R5cGV9KTtcbiAgcmV0dXJuIGNvbnN0cnVjdG9yO1xufVxuZnVuY3Rpb24gY3JlYXRlVGFibGVDb25zdHJ1Y3RvcihkYikge1xuICByZXR1cm4gbWFrZUNsYXNzQ29uc3RydWN0b3IoVGFibGUucHJvdG90eXBlLCBmdW5jdGlvbiBUYWJsZTIobmFtZSwgdGFibGVTY2hlbWEsIHRyYW5zKSB7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHRoaXMuX3R4ID0gdHJhbnM7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnNjaGVtYSA9IHRhYmxlU2NoZW1hO1xuICAgIHRoaXMuaG9vayA9IGRiLl9hbGxUYWJsZXNbbmFtZV0gPyBkYi5fYWxsVGFibGVzW25hbWVdLmhvb2sgOiBFdmVudHMobnVsbCwge1xuICAgICAgY3JlYXRpbmc6IFtob29rQ3JlYXRpbmdDaGFpbiwgbm9wXSxcbiAgICAgIHJlYWRpbmc6IFtwdXJlRnVuY3Rpb25DaGFpbiwgbWlycm9yXSxcbiAgICAgIHVwZGF0aW5nOiBbaG9va1VwZGF0aW5nQ2hhaW4sIG5vcF0sXG4gICAgICBkZWxldGluZzogW2hvb2tEZWxldGluZ0NoYWluLCBub3BdXG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gaXNQbGFpbktleVJhbmdlKGN0eCwgaWdub3JlTGltaXRGaWx0ZXIpIHtcbiAgcmV0dXJuICEoY3R4LmZpbHRlciB8fCBjdHguYWxnb3JpdGhtIHx8IGN0eC5vcikgJiYgKGlnbm9yZUxpbWl0RmlsdGVyID8gY3R4Lmp1c3RMaW1pdCA6ICFjdHgucmVwbGF5RmlsdGVyKTtcbn1cbmZ1bmN0aW9uIGFkZEZpbHRlcihjdHgsIGZuKSB7XG4gIGN0eC5maWx0ZXIgPSBjb21iaW5lKGN0eC5maWx0ZXIsIGZuKTtcbn1cbmZ1bmN0aW9uIGFkZFJlcGxheUZpbHRlcihjdHgsIGZhY3RvcnksIGlzTGltaXRGaWx0ZXIpIHtcbiAgdmFyIGN1cnIgPSBjdHgucmVwbGF5RmlsdGVyO1xuICBjdHgucmVwbGF5RmlsdGVyID0gY3VyciA/IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb21iaW5lKGN1cnIoKSwgZmFjdG9yeSgpKTtcbiAgfSA6IGZhY3Rvcnk7XG4gIGN0eC5qdXN0TGltaXQgPSBpc0xpbWl0RmlsdGVyICYmICFjdXJyO1xufVxuZnVuY3Rpb24gYWRkTWF0Y2hGaWx0ZXIoY3R4LCBmbikge1xuICBjdHguaXNNYXRjaCA9IGNvbWJpbmUoY3R4LmlzTWF0Y2gsIGZuKTtcbn1cbmZ1bmN0aW9uIGdldEluZGV4T3JTdG9yZShjdHgsIGNvcmVTY2hlbWEpIHtcbiAgaWYgKGN0eC5pc1ByaW1LZXkpXG4gICAgcmV0dXJuIGNvcmVTY2hlbWEucHJpbWFyeUtleTtcbiAgdmFyIGluZGV4ID0gY29yZVNjaGVtYS5nZXRJbmRleEJ5S2V5UGF0aChjdHguaW5kZXgpO1xuICBpZiAoIWluZGV4KVxuICAgIHRocm93IG5ldyBleGNlcHRpb25zLlNjaGVtYShcIktleVBhdGggXCIgKyBjdHguaW5kZXggKyBcIiBvbiBvYmplY3Qgc3RvcmUgXCIgKyBjb3JlU2NoZW1hLm5hbWUgKyBcIiBpcyBub3QgaW5kZXhlZFwiKTtcbiAgcmV0dXJuIGluZGV4O1xufVxuZnVuY3Rpb24gb3BlbkN1cnNvcihjdHgsIGNvcmVUYWJsZSwgdHJhbnMpIHtcbiAgdmFyIGluZGV4ID0gZ2V0SW5kZXhPclN0b3JlKGN0eCwgY29yZVRhYmxlLnNjaGVtYSk7XG4gIHJldHVybiBjb3JlVGFibGUub3BlbkN1cnNvcih7XG4gICAgdHJhbnMsXG4gICAgdmFsdWVzOiAhY3R4LmtleXNPbmx5LFxuICAgIHJldmVyc2U6IGN0eC5kaXIgPT09IFwicHJldlwiLFxuICAgIHVuaXF1ZTogISFjdHgudW5pcXVlLFxuICAgIHF1ZXJ5OiB7XG4gICAgICBpbmRleCxcbiAgICAgIHJhbmdlOiBjdHgucmFuZ2VcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gaXRlcihjdHgsIGZuLCBjb3JlVHJhbnMsIGNvcmVUYWJsZSkge1xuICB2YXIgZmlsdGVyID0gY3R4LnJlcGxheUZpbHRlciA/IGNvbWJpbmUoY3R4LmZpbHRlciwgY3R4LnJlcGxheUZpbHRlcigpKSA6IGN0eC5maWx0ZXI7XG4gIGlmICghY3R4Lm9yKSB7XG4gICAgcmV0dXJuIGl0ZXJhdGUob3BlbkN1cnNvcihjdHgsIGNvcmVUYWJsZSwgY29yZVRyYW5zKSwgY29tYmluZShjdHguYWxnb3JpdGhtLCBmaWx0ZXIpLCBmbiwgIWN0eC5rZXlzT25seSAmJiBjdHgudmFsdWVNYXBwZXIpO1xuICB9IGVsc2Uge1xuICAgIHZhciBzZXRfMSA9IHt9O1xuICAgIHZhciB1bmlvbiA9IGZ1bmN0aW9uKGl0ZW0sIGN1cnNvciwgYWR2YW5jZSkge1xuICAgICAgaWYgKCFmaWx0ZXIgfHwgZmlsdGVyKGN1cnNvciwgYWR2YW5jZSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiBjdXJzb3Iuc3RvcChyZXN1bHQpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHJldHVybiBjdXJzb3IuZmFpbChlcnIpO1xuICAgICAgfSkpIHtcbiAgICAgICAgdmFyIHByaW1hcnlLZXkgPSBjdXJzb3IucHJpbWFyeUtleTtcbiAgICAgICAgdmFyIGtleSA9IFwiXCIgKyBwcmltYXJ5S2V5O1xuICAgICAgICBpZiAoa2V5ID09PSBcIltvYmplY3QgQXJyYXlCdWZmZXJdXCIpXG4gICAgICAgICAga2V5ID0gXCJcIiArIG5ldyBVaW50OEFycmF5KHByaW1hcnlLZXkpO1xuICAgICAgICBpZiAoIWhhc093bihzZXRfMSwga2V5KSkge1xuICAgICAgICAgIHNldF8xW2tleV0gPSB0cnVlO1xuICAgICAgICAgIGZuKGl0ZW0sIGN1cnNvciwgYWR2YW5jZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICBjdHgub3IuX2l0ZXJhdGUodW5pb24sIGNvcmVUcmFucyksXG4gICAgICBpdGVyYXRlKG9wZW5DdXJzb3IoY3R4LCBjb3JlVGFibGUsIGNvcmVUcmFucyksIGN0eC5hbGdvcml0aG0sIHVuaW9uLCAhY3R4LmtleXNPbmx5ICYmIGN0eC52YWx1ZU1hcHBlcilcbiAgICBdKTtcbiAgfVxufVxuZnVuY3Rpb24gaXRlcmF0ZShjdXJzb3JQcm9taXNlLCBmaWx0ZXIsIGZuLCB2YWx1ZU1hcHBlcikge1xuICB2YXIgbWFwcGVkRm4gPSB2YWx1ZU1hcHBlciA/IGZ1bmN0aW9uKHgsIGMsIGEpIHtcbiAgICByZXR1cm4gZm4odmFsdWVNYXBwZXIoeCksIGMsIGEpO1xuICB9IDogZm47XG4gIHZhciB3cmFwcGVkRm4gPSB3cmFwKG1hcHBlZEZuKTtcbiAgcmV0dXJuIGN1cnNvclByb21pc2UudGhlbihmdW5jdGlvbihjdXJzb3IpIHtcbiAgICBpZiAoY3Vyc29yKSB7XG4gICAgICByZXR1cm4gY3Vyc29yLnN0YXJ0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFmaWx0ZXIgfHwgZmlsdGVyKGN1cnNvciwgZnVuY3Rpb24oYWR2YW5jZXIpIHtcbiAgICAgICAgICByZXR1cm4gYyA9IGFkdmFuY2VyO1xuICAgICAgICB9LCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICBjdXJzb3Iuc3RvcCh2YWwpO1xuICAgICAgICAgIGMgPSBub3A7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBjdXJzb3IuZmFpbChlKTtcbiAgICAgICAgICBjID0gbm9wO1xuICAgICAgICB9KSlcbiAgICAgICAgICB3cmFwcGVkRm4oY3Vyc29yLnZhbHVlLCBjdXJzb3IsIGZ1bmN0aW9uKGFkdmFuY2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gYyA9IGFkdmFuY2VyO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxudmFyIENvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ29sbGVjdGlvbjIoKSB7XG4gIH1cbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24oZm4sIGNiKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICByZXR1cm4gY3R4LmVycm9yID8gY3R4LnRhYmxlLl90cmFucyhudWxsLCByZWplY3Rpb24uYmluZChudWxsLCBjdHguZXJyb3IpKSA6IGN0eC50YWJsZS5fdHJhbnMoXCJyZWFkb25seVwiLCBmbikudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgcmV0dXJuIGN0eC5lcnJvciA/IGN0eC50YWJsZS5fdHJhbnMobnVsbCwgcmVqZWN0aW9uLmJpbmQobnVsbCwgY3R4LmVycm9yKSkgOiBjdHgudGFibGUuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZuLCBcImxvY2tlZFwiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLl9hZGRBbGdvcml0aG0gPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgY3R4LmFsZ29yaXRobSA9IGNvbWJpbmUoY3R4LmFsZ29yaXRobSwgZm4pO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgY29yZVRyYW5zKSB7XG4gICAgcmV0dXJuIGl0ZXIodGhpcy5fY3R4LCBmbiwgY29yZVRyYW5zLCB0aGlzLl9jdHgudGFibGUuY29yZSk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKHByb3BzMikge1xuICAgIHZhciBydiA9IE9iamVjdC5jcmVhdGUodGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpLCBjdHggPSBPYmplY3QuY3JlYXRlKHRoaXMuX2N0eCk7XG4gICAgaWYgKHByb3BzMilcbiAgICAgIGV4dGVuZChjdHgsIHByb3BzMik7XG4gICAgcnYuX2N0eCA9IGN0eDtcbiAgICByZXR1cm4gcnY7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5yYXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jdHgudmFsdWVNYXBwZXIgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICByZXR1cm4gdGhpcy5fcmVhZChmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIGl0ZXIoY3R4LCBmbiwgdHJhbnMsIGN0eC50YWJsZS5jb3JlKTtcbiAgICB9KTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl9yZWFkKGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICB2YXIgY3R4ID0gX3RoaXMuX2N0eDtcbiAgICAgIHZhciBjb3JlVGFibGUgPSBjdHgudGFibGUuY29yZTtcbiAgICAgIGlmIChpc1BsYWluS2V5UmFuZ2UoY3R4LCB0cnVlKSkge1xuICAgICAgICByZXR1cm4gY29yZVRhYmxlLmNvdW50KHtcbiAgICAgICAgICB0cmFucyxcbiAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgaW5kZXg6IGdldEluZGV4T3JTdG9yZShjdHgsIGNvcmVUYWJsZS5zY2hlbWEpLFxuICAgICAgICAgICAgcmFuZ2U6IGN0eC5yYW5nZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihjb3VudDIpIHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5taW4oY291bnQyLCBjdHgubGltaXQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIHJldHVybiBpdGVyKGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgKytjb3VudDtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIHRyYW5zLCBjb3JlVGFibGUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnNvcnRCeSA9IGZ1bmN0aW9uKGtleVBhdGgsIGNiKSB7XG4gICAgdmFyIHBhcnRzID0ga2V5UGF0aC5zcGxpdChcIi5cIikucmV2ZXJzZSgpLCBsYXN0UGFydCA9IHBhcnRzWzBdLCBsYXN0SW5kZXggPSBwYXJ0cy5sZW5ndGggLSAxO1xuICAgIGZ1bmN0aW9uIGdldHZhbChvYmosIGkpIHtcbiAgICAgIGlmIChpKVxuICAgICAgICByZXR1cm4gZ2V0dmFsKG9ialtwYXJ0c1tpXV0sIGkgLSAxKTtcbiAgICAgIHJldHVybiBvYmpbbGFzdFBhcnRdO1xuICAgIH1cbiAgICB2YXIgb3JkZXIgPSB0aGlzLl9jdHguZGlyID09PSBcIm5leHRcIiA/IDEgOiAtMTtcbiAgICBmdW5jdGlvbiBzb3J0ZXIoYSwgYikge1xuICAgICAgdmFyIGFWYWwgPSBnZXR2YWwoYSwgbGFzdEluZGV4KSwgYlZhbCA9IGdldHZhbChiLCBsYXN0SW5kZXgpO1xuICAgICAgcmV0dXJuIGFWYWwgPCBiVmFsID8gLW9yZGVyIDogYVZhbCA+IGJWYWwgPyBvcmRlciA6IDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRvQXJyYXkoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEuc29ydChzb3J0ZXIpO1xuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fcmVhZChmdW5jdGlvbih0cmFucykge1xuICAgICAgdmFyIGN0eCA9IF90aGlzLl9jdHg7XG4gICAgICBpZiAoY3R4LmRpciA9PT0gXCJuZXh0XCIgJiYgaXNQbGFpbktleVJhbmdlKGN0eCwgdHJ1ZSkgJiYgY3R4LmxpbWl0ID4gMCkge1xuICAgICAgICB2YXIgdmFsdWVNYXBwZXJfMSA9IGN0eC52YWx1ZU1hcHBlcjtcbiAgICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhPclN0b3JlKGN0eCwgY3R4LnRhYmxlLmNvcmUuc2NoZW1hKTtcbiAgICAgICAgcmV0dXJuIGN0eC50YWJsZS5jb3JlLnF1ZXJ5KHtcbiAgICAgICAgICB0cmFucyxcbiAgICAgICAgICBsaW1pdDogY3R4LmxpbWl0LFxuICAgICAgICAgIHZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICByYW5nZTogY3R4LnJhbmdlXG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKF9hMikge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBfYTIucmVzdWx0O1xuICAgICAgICAgIHJldHVybiB2YWx1ZU1hcHBlcl8xID8gcmVzdWx0Lm1hcCh2YWx1ZU1hcHBlcl8xKSA6IHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYV8xID0gW107XG4gICAgICAgIHJldHVybiBpdGVyKGN0eCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHJldHVybiBhXzEucHVzaChpdGVtKTtcbiAgICAgICAgfSwgdHJhbnMsIGN0eC50YWJsZS5jb3JlKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhXzE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgaWYgKG9mZnNldCA8PSAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgY3R4Lm9mZnNldCArPSBvZmZzZXQ7XG4gICAgaWYgKGlzUGxhaW5LZXlSYW5nZShjdHgpKSB7XG4gICAgICBhZGRSZXBsYXlGaWx0ZXIoY3R4LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSBvZmZzZXQ7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjdXJzb3IsIGFkdmFuY2UpIHtcbiAgICAgICAgICBpZiAob2Zmc2V0TGVmdCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ID09PSAxKSB7XG4gICAgICAgICAgICAtLW9mZnNldExlZnQ7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFkdmFuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdXJzb3IuYWR2YW5jZShvZmZzZXRMZWZ0KTtcbiAgICAgICAgICAgIG9mZnNldExlZnQgPSAwO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRSZXBsYXlGaWx0ZXIoY3R4LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSBvZmZzZXQ7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gLS1vZmZzZXRMZWZ0IDwgMDtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmxpbWl0ID0gZnVuY3Rpb24obnVtUm93cykge1xuICAgIHRoaXMuX2N0eC5saW1pdCA9IE1hdGgubWluKHRoaXMuX2N0eC5saW1pdCwgbnVtUm93cyk7XG4gICAgYWRkUmVwbGF5RmlsdGVyKHRoaXMuX2N0eCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcm93c0xlZnQgPSBudW1Sb3dzO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGN1cnNvciwgYWR2YW5jZSwgcmVzb2x2ZSkge1xuICAgICAgICBpZiAoLS1yb3dzTGVmdCA8PSAwKVxuICAgICAgICAgIGFkdmFuY2UocmVzb2x2ZSk7XG4gICAgICAgIHJldHVybiByb3dzTGVmdCA+PSAwO1xuICAgICAgfTtcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnVudGlsID0gZnVuY3Rpb24oZmlsdGVyRnVuY3Rpb24sIGJJbmNsdWRlU3RvcEVudHJ5KSB7XG4gICAgYWRkRmlsdGVyKHRoaXMuX2N0eCwgZnVuY3Rpb24oY3Vyc29yLCBhZHZhbmNlLCByZXNvbHZlKSB7XG4gICAgICBpZiAoZmlsdGVyRnVuY3Rpb24oY3Vyc29yLnZhbHVlKSkge1xuICAgICAgICBhZHZhbmNlKHJlc29sdmUpO1xuICAgICAgICByZXR1cm4gYkluY2x1ZGVTdG9wRW50cnk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24oY2IpIHtcbiAgICByZXR1cm4gdGhpcy5saW1pdCgxKS50b0FycmF5KGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhWzBdO1xuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0KGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlckZ1bmN0aW9uKSB7XG4gICAgYWRkRmlsdGVyKHRoaXMuX2N0eCwgZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICByZXR1cm4gZmlsdGVyRnVuY3Rpb24oY3Vyc29yLnZhbHVlKTtcbiAgICB9KTtcbiAgICBhZGRNYXRjaEZpbHRlcih0aGlzLl9jdHgsIGZpbHRlckZ1bmN0aW9uKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmFuZCA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihmaWx0ZXIpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUub3IgPSBmdW5jdGlvbihpbmRleE5hbWUpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuZGIuV2hlcmVDbGF1c2UodGhpcy5fY3R4LnRhYmxlLCBpbmRleE5hbWUsIHRoaXMpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2N0eC5kaXIgPSB0aGlzLl9jdHguZGlyID09PSBcInByZXZcIiA/IFwibmV4dFwiIDogXCJwcmV2XCI7XG4gICAgaWYgKHRoaXMuX29uZGlyZWN0aW9uY2hhbmdlKVxuICAgICAgdGhpcy5fb25kaXJlY3Rpb25jaGFuZ2UodGhpcy5fY3R4LmRpcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5kZXNjID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZWFjaEtleSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICBjdHgua2V5c09ubHkgPSAhY3R4LmlzTWF0Y2g7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbih2YWwsIGN1cnNvcikge1xuICAgICAgY2IoY3Vyc29yLmtleSwgY3Vyc29yKTtcbiAgICB9KTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmVhY2hVbmlxdWVLZXkgPSBmdW5jdGlvbihjYikge1xuICAgIHRoaXMuX2N0eC51bmlxdWUgPSBcInVuaXF1ZVwiO1xuICAgIHJldHVybiB0aGlzLmVhY2hLZXkoY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZWFjaFByaW1hcnlLZXkgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgY3R4LmtleXNPbmx5ID0gIWN0eC5pc01hdGNoO1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24odmFsLCBjdXJzb3IpIHtcbiAgICAgIGNiKGN1cnNvci5wcmltYXJ5S2V5LCBjdXJzb3IpO1xuICAgIH0pO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICBjdHgua2V5c09ubHkgPSAhY3R4LmlzTWF0Y2g7XG4gICAgdmFyIGEgPSBbXTtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0sIGN1cnNvcikge1xuICAgICAgYS5wdXNoKGN1cnNvci5rZXkpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYTtcbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnByaW1hcnlLZXlzID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIGlmIChjdHguZGlyID09PSBcIm5leHRcIiAmJiBpc1BsYWluS2V5UmFuZ2UoY3R4LCB0cnVlKSAmJiBjdHgubGltaXQgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVhZChmdW5jdGlvbih0cmFucykge1xuICAgICAgICB2YXIgaW5kZXggPSBnZXRJbmRleE9yU3RvcmUoY3R4LCBjdHgudGFibGUuY29yZS5zY2hlbWEpO1xuICAgICAgICByZXR1cm4gY3R4LnRhYmxlLmNvcmUucXVlcnkoe1xuICAgICAgICAgIHRyYW5zLFxuICAgICAgICAgIHZhbHVlczogZmFsc2UsXG4gICAgICAgICAgbGltaXQ6IGN0eC5saW1pdCxcbiAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICByYW5nZTogY3R4LnJhbmdlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oX2EyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBfYTIucmVzdWx0O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSkudGhlbihjYik7XG4gICAgfVxuICAgIGN0eC5rZXlzT25seSA9ICFjdHguaXNNYXRjaDtcbiAgICB2YXIgYSA9IFtdO1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSwgY3Vyc29yKSB7XG4gICAgICBhLnB1c2goY3Vyc29yLnByaW1hcnlLZXkpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYTtcbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnVuaXF1ZUtleXMgPSBmdW5jdGlvbihjYikge1xuICAgIHRoaXMuX2N0eC51bmlxdWUgPSBcInVuaXF1ZVwiO1xuICAgIHJldHVybiB0aGlzLmtleXMoY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZmlyc3RLZXkgPSBmdW5jdGlvbihjYikge1xuICAgIHJldHVybiB0aGlzLmxpbWl0KDEpLmtleXMoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGFbMF07XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5sYXN0S2V5ID0gZnVuY3Rpb24oY2IpIHtcbiAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuZmlyc3RLZXkoY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZGlzdGluY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4LCBpZHggPSBjdHguaW5kZXggJiYgY3R4LnRhYmxlLnNjaGVtYS5pZHhCeU5hbWVbY3R4LmluZGV4XTtcbiAgICBpZiAoIWlkeCB8fCAhaWR4Lm11bHRpKVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgdmFyIHNldCA9IHt9O1xuICAgIGFkZEZpbHRlcih0aGlzLl9jdHgsIGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgdmFyIHN0cktleSA9IGN1cnNvci5wcmltYXJ5S2V5LnRvU3RyaW5nKCk7XG4gICAgICB2YXIgZm91bmQgPSBoYXNPd24oc2V0LCBzdHJLZXkpO1xuICAgICAgc2V0W3N0cktleV0gPSB0cnVlO1xuICAgICAgcmV0dXJuICFmb3VuZDtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uKGNoYW5nZXMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlKGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICB2YXIgbW9kaWZ5ZXI7XG4gICAgICBpZiAodHlwZW9mIGNoYW5nZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBtb2RpZnllciA9IGNoYW5nZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIga2V5UGF0aHMgPSBrZXlzKGNoYW5nZXMpO1xuICAgICAgICB2YXIgbnVtS2V5cyA9IGtleVBhdGhzLmxlbmd0aDtcbiAgICAgICAgbW9kaWZ5ZXIgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGFueXRoaW5nTW9kaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUtleXM7ICsraSkge1xuICAgICAgICAgICAgdmFyIGtleVBhdGggPSBrZXlQYXRoc1tpXSwgdmFsID0gY2hhbmdlc1trZXlQYXRoXTtcbiAgICAgICAgICAgIGlmIChnZXRCeUtleVBhdGgoaXRlbSwga2V5UGF0aCkgIT09IHZhbCkge1xuICAgICAgICAgICAgICBzZXRCeUtleVBhdGgoaXRlbSwga2V5UGF0aCwgdmFsKTtcbiAgICAgICAgICAgICAgYW55dGhpbmdNb2RpZmllZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhbnl0aGluZ01vZGlmaWVkO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdmFyIGNvcmVUYWJsZSA9IGN0eC50YWJsZS5jb3JlO1xuICAgICAgdmFyIF9hMiA9IGNvcmVUYWJsZS5zY2hlbWEucHJpbWFyeUtleSwgb3V0Ym91bmQgPSBfYTIub3V0Ym91bmQsIGV4dHJhY3RLZXkgPSBfYTIuZXh0cmFjdEtleTtcbiAgICAgIHZhciBsaW1pdCA9IF90aGlzLmRiLl9vcHRpb25zLm1vZGlmeUNodW5rU2l6ZSB8fCAyMDA7XG4gICAgICB2YXIgY21wMiA9IF90aGlzLmRiLmNvcmUuY21wO1xuICAgICAgdmFyIHRvdGFsRmFpbHVyZXMgPSBbXTtcbiAgICAgIHZhciBzdWNjZXNzQ291bnQgPSAwO1xuICAgICAgdmFyIGZhaWxlZEtleXMgPSBbXTtcbiAgICAgIHZhciBhcHBseU11dGF0ZVJlc3VsdCA9IGZ1bmN0aW9uKGV4cGVjdGVkQ291bnQsIHJlcykge1xuICAgICAgICB2YXIgZmFpbHVyZXMgPSByZXMuZmFpbHVyZXMsIG51bUZhaWx1cmVzID0gcmVzLm51bUZhaWx1cmVzO1xuICAgICAgICBzdWNjZXNzQ291bnQgKz0gZXhwZWN0ZWRDb3VudCAtIG51bUZhaWx1cmVzO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hMyA9IGtleXMoZmFpbHVyZXMpOyBfaSA8IF9hMy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICB2YXIgcG9zID0gX2EzW19pXTtcbiAgICAgICAgICB0b3RhbEZhaWx1cmVzLnB1c2goZmFpbHVyZXNbcG9zXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gX3RoaXMuY2xvbmUoKS5wcmltYXJ5S2V5cygpLnRoZW4oZnVuY3Rpb24oa2V5czIpIHtcbiAgICAgICAgdmFyIG5leHRDaHVuayA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICAgIHZhciBjb3VudCA9IE1hdGgubWluKGxpbWl0LCBrZXlzMi5sZW5ndGggLSBvZmZzZXQpO1xuICAgICAgICAgIHJldHVybiBjb3JlVGFibGUuZ2V0TWFueSh7XG4gICAgICAgICAgICB0cmFucyxcbiAgICAgICAgICAgIGtleXM6IGtleXMyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgY291bnQpLFxuICAgICAgICAgICAgY2FjaGU6IFwiaW1tdXRhYmxlXCJcbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICAgICAgdmFyIGFkZFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHB1dFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHB1dEtleXMgPSBvdXRib3VuZCA/IFtdIDogbnVsbDtcbiAgICAgICAgICAgIHZhciBkZWxldGVLZXlzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgICAgdmFyIG9yaWdWYWx1ZSA9IHZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgdmFyIGN0eF8xID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBkZWVwQ2xvbmUob3JpZ1ZhbHVlKSxcbiAgICAgICAgICAgICAgICBwcmltS2V5OiBrZXlzMltvZmZzZXQgKyBpXVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAobW9kaWZ5ZXIuY2FsbChjdHhfMSwgY3R4XzEudmFsdWUsIGN0eF8xKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3R4XzEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgZGVsZXRlS2V5cy5wdXNoKGtleXMyW29mZnNldCArIGldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvdXRib3VuZCAmJiBjbXAyKGV4dHJhY3RLZXkob3JpZ1ZhbHVlKSwgZXh0cmFjdEtleShjdHhfMS52YWx1ZSkpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICBkZWxldGVLZXlzLnB1c2goa2V5czJbb2Zmc2V0ICsgaV0pO1xuICAgICAgICAgICAgICAgICAgYWRkVmFsdWVzLnB1c2goY3R4XzEudmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwdXRWYWx1ZXMucHVzaChjdHhfMS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICBpZiAob3V0Ym91bmQpXG4gICAgICAgICAgICAgICAgICAgIHB1dEtleXMucHVzaChrZXlzMltvZmZzZXQgKyBpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGFkZFZhbHVlcy5sZW5ndGggPiAwICYmIGNvcmVUYWJsZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImFkZFwiLCB2YWx1ZXM6IGFkZFZhbHVlc30pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIHBvcyBpbiByZXMuZmFpbHVyZXMpIHtcbiAgICAgICAgICAgICAgICBkZWxldGVLZXlzLnNwbGljZShwYXJzZUludChwb3MpLCAxKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcHBseU11dGF0ZVJlc3VsdChhZGRWYWx1ZXMubGVuZ3RoLCByZXMpO1xuICAgICAgICAgICAgfSkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwdXRWYWx1ZXMubGVuZ3RoID4gMCAmJiBjb3JlVGFibGUubXV0YXRlKHt0cmFucywgdHlwZTogXCJwdXRcIiwga2V5czogcHV0S2V5cywgdmFsdWVzOiBwdXRWYWx1ZXN9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcHBseU11dGF0ZVJlc3VsdChwdXRWYWx1ZXMubGVuZ3RoLCByZXMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkZWxldGVLZXlzLmxlbmd0aCA+IDAgJiYgY29yZVRhYmxlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiZGVsZXRlXCIsIGtleXM6IGRlbGV0ZUtleXN9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcHBseU11dGF0ZVJlc3VsdChkZWxldGVLZXlzLmxlbmd0aCwgcmVzKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4ga2V5czIubGVuZ3RoID4gb2Zmc2V0ICsgY291bnQgJiYgbmV4dENodW5rKG9mZnNldCArIGxpbWl0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV4dENodW5rKDApLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHRvdGFsRmFpbHVyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBNb2RpZnlFcnJvcihcIkVycm9yIG1vZGlmeWluZyBvbmUgb3IgbW9yZSBvYmplY3RzXCIsIHRvdGFsRmFpbHVyZXMsIHN1Y2Nlc3NDb3VudCwgZmFpbGVkS2V5cyk7XG4gICAgICAgICAgcmV0dXJuIGtleXMyLmxlbmd0aDtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHgsIHJhbmdlID0gY3R4LnJhbmdlO1xuICAgIGlmIChpc1BsYWluS2V5UmFuZ2UoY3R4KSAmJiAoY3R4LmlzUHJpbUtleSAmJiAhaGFuZ3NPbkRlbGV0ZUxhcmdlS2V5UmFuZ2UgfHwgcmFuZ2UudHlwZSA9PT0gMykpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cml0ZShmdW5jdGlvbih0cmFucykge1xuICAgICAgICB2YXIgcHJpbWFyeUtleSA9IGN0eC50YWJsZS5jb3JlLnNjaGVtYS5wcmltYXJ5S2V5O1xuICAgICAgICB2YXIgY29yZVJhbmdlID0gcmFuZ2U7XG4gICAgICAgIHJldHVybiBjdHgudGFibGUuY29yZS5jb3VudCh7dHJhbnMsIHF1ZXJ5OiB7aW5kZXg6IHByaW1hcnlLZXksIHJhbmdlOiBjb3JlUmFuZ2V9fSkudGhlbihmdW5jdGlvbihjb3VudCkge1xuICAgICAgICAgIHJldHVybiBjdHgudGFibGUuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImRlbGV0ZVJhbmdlXCIsIHJhbmdlOiBjb3JlUmFuZ2V9KS50aGVuKGZ1bmN0aW9uKF9hMikge1xuICAgICAgICAgICAgdmFyIGZhaWx1cmVzID0gX2EyLmZhaWx1cmVzO1xuICAgICAgICAgICAgX2EyLmxhc3RSZXN1bHQ7XG4gICAgICAgICAgICBfYTIucmVzdWx0cztcbiAgICAgICAgICAgIHZhciBudW1GYWlsdXJlcyA9IF9hMi5udW1GYWlsdXJlcztcbiAgICAgICAgICAgIGlmIChudW1GYWlsdXJlcylcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1vZGlmeUVycm9yKFwiQ291bGQgbm90IGRlbGV0ZSBzb21lIHZhbHVlc1wiLCBPYmplY3Qua2V5cyhmYWlsdXJlcykubWFwKGZ1bmN0aW9uKHBvcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWlsdXJlc1twb3NdO1xuICAgICAgICAgICAgICB9KSwgY291bnQgLSBudW1GYWlsdXJlcyk7XG4gICAgICAgICAgICByZXR1cm4gY291bnQgLSBudW1GYWlsdXJlcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubW9kaWZ5KGZ1bmN0aW9uKHZhbHVlLCBjdHgyKSB7XG4gICAgICByZXR1cm4gY3R4Mi52YWx1ZSA9IG51bGw7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBDb2xsZWN0aW9uMjtcbn0oKTtcbmZ1bmN0aW9uIGNyZWF0ZUNvbGxlY3Rpb25Db25zdHJ1Y3RvcihkYikge1xuICByZXR1cm4gbWFrZUNsYXNzQ29uc3RydWN0b3IoQ29sbGVjdGlvbi5wcm90b3R5cGUsIGZ1bmN0aW9uIENvbGxlY3Rpb24yKHdoZXJlQ2xhdXNlLCBrZXlSYW5nZUdlbmVyYXRvcikge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB2YXIga2V5UmFuZ2UgPSBBbnlSYW5nZSwgZXJyb3IgPSBudWxsO1xuICAgIGlmIChrZXlSYW5nZUdlbmVyYXRvcilcbiAgICAgIHRyeSB7XG4gICAgICAgIGtleVJhbmdlID0ga2V5UmFuZ2VHZW5lcmF0b3IoKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGVycm9yID0gZXg7XG4gICAgICB9XG4gICAgdmFyIHdoZXJlQ3R4ID0gd2hlcmVDbGF1c2UuX2N0eDtcbiAgICB2YXIgdGFibGUgPSB3aGVyZUN0eC50YWJsZTtcbiAgICB2YXIgcmVhZGluZ0hvb2sgPSB0YWJsZS5ob29rLnJlYWRpbmcuZmlyZTtcbiAgICB0aGlzLl9jdHggPSB7XG4gICAgICB0YWJsZSxcbiAgICAgIGluZGV4OiB3aGVyZUN0eC5pbmRleCxcbiAgICAgIGlzUHJpbUtleTogIXdoZXJlQ3R4LmluZGV4IHx8IHRhYmxlLnNjaGVtYS5wcmltS2V5LmtleVBhdGggJiYgd2hlcmVDdHguaW5kZXggPT09IHRhYmxlLnNjaGVtYS5wcmltS2V5Lm5hbWUsXG4gICAgICByYW5nZToga2V5UmFuZ2UsXG4gICAgICBrZXlzT25seTogZmFsc2UsXG4gICAgICBkaXI6IFwibmV4dFwiLFxuICAgICAgdW5pcXVlOiBcIlwiLFxuICAgICAgYWxnb3JpdGhtOiBudWxsLFxuICAgICAgZmlsdGVyOiBudWxsLFxuICAgICAgcmVwbGF5RmlsdGVyOiBudWxsLFxuICAgICAganVzdExpbWl0OiB0cnVlLFxuICAgICAgaXNNYXRjaDogbnVsbCxcbiAgICAgIG9mZnNldDogMCxcbiAgICAgIGxpbWl0OiBJbmZpbml0eSxcbiAgICAgIGVycm9yLFxuICAgICAgb3I6IHdoZXJlQ3R4Lm9yLFxuICAgICAgdmFsdWVNYXBwZXI6IHJlYWRpbmdIb29rICE9PSBtaXJyb3IgPyByZWFkaW5nSG9vayA6IG51bGxcbiAgICB9O1xuICB9KTtcbn1cbmZ1bmN0aW9uIHNpbXBsZUNvbXBhcmUoYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPT09IGIgPyAwIDogMTtcbn1cbmZ1bmN0aW9uIHNpbXBsZUNvbXBhcmVSZXZlcnNlKGEsIGIpIHtcbiAgcmV0dXJuIGEgPiBiID8gLTEgOiBhID09PSBiID8gMCA6IDE7XG59XG5mdW5jdGlvbiBmYWlsKGNvbGxlY3Rpb25PcldoZXJlQ2xhdXNlLCBlcnIsIFQpIHtcbiAgdmFyIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uT3JXaGVyZUNsYXVzZSBpbnN0YW5jZW9mIFdoZXJlQ2xhdXNlID8gbmV3IGNvbGxlY3Rpb25PcldoZXJlQ2xhdXNlLkNvbGxlY3Rpb24oY29sbGVjdGlvbk9yV2hlcmVDbGF1c2UpIDogY29sbGVjdGlvbk9yV2hlcmVDbGF1c2U7XG4gIGNvbGxlY3Rpb24uX2N0eC5lcnJvciA9IFQgPyBuZXcgVChlcnIpIDogbmV3IFR5cGVFcnJvcihlcnIpO1xuICByZXR1cm4gY29sbGVjdGlvbjtcbn1cbmZ1bmN0aW9uIGVtcHR5Q29sbGVjdGlvbih3aGVyZUNsYXVzZSkge1xuICByZXR1cm4gbmV3IHdoZXJlQ2xhdXNlLkNvbGxlY3Rpb24od2hlcmVDbGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYW5nZUVxdWFsKFwiXCIpO1xuICB9KS5saW1pdCgwKTtcbn1cbmZ1bmN0aW9uIHVwcGVyRmFjdG9yeShkaXIpIHtcbiAgcmV0dXJuIGRpciA9PT0gXCJuZXh0XCIgPyBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHMudG9VcHBlckNhc2UoKTtcbiAgfSA6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpO1xuICB9O1xufVxuZnVuY3Rpb24gbG93ZXJGYWN0b3J5KGRpcikge1xuICByZXR1cm4gZGlyID09PSBcIm5leHRcIiA/IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpO1xuICB9IDogZnVuY3Rpb24ocykge1xuICAgIHJldHVybiBzLnRvVXBwZXJDYXNlKCk7XG4gIH07XG59XG5mdW5jdGlvbiBuZXh0Q2FzaW5nKGtleSwgbG93ZXJLZXksIHVwcGVyTmVlZGxlLCBsb3dlck5lZWRsZSwgY21wMiwgZGlyKSB7XG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihrZXkubGVuZ3RoLCBsb3dlck5lZWRsZS5sZW5ndGgpO1xuICB2YXIgbGxwID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgbHdyS2V5Q2hhciA9IGxvd2VyS2V5W2ldO1xuICAgIGlmIChsd3JLZXlDaGFyICE9PSBsb3dlck5lZWRsZVtpXSkge1xuICAgICAgaWYgKGNtcDIoa2V5W2ldLCB1cHBlck5lZWRsZVtpXSkgPCAwKVxuICAgICAgICByZXR1cm4ga2V5LnN1YnN0cigwLCBpKSArIHVwcGVyTmVlZGxlW2ldICsgdXBwZXJOZWVkbGUuc3Vic3RyKGkgKyAxKTtcbiAgICAgIGlmIChjbXAyKGtleVtpXSwgbG93ZXJOZWVkbGVbaV0pIDwgMClcbiAgICAgICAgcmV0dXJuIGtleS5zdWJzdHIoMCwgaSkgKyBsb3dlck5lZWRsZVtpXSArIHVwcGVyTmVlZGxlLnN1YnN0cihpICsgMSk7XG4gICAgICBpZiAobGxwID49IDApXG4gICAgICAgIHJldHVybiBrZXkuc3Vic3RyKDAsIGxscCkgKyBsb3dlcktleVtsbHBdICsgdXBwZXJOZWVkbGUuc3Vic3RyKGxscCArIDEpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChjbXAyKGtleVtpXSwgbHdyS2V5Q2hhcikgPCAwKVxuICAgICAgbGxwID0gaTtcbiAgfVxuICBpZiAobGVuZ3RoIDwgbG93ZXJOZWVkbGUubGVuZ3RoICYmIGRpciA9PT0gXCJuZXh0XCIpXG4gICAgcmV0dXJuIGtleSArIHVwcGVyTmVlZGxlLnN1YnN0cihrZXkubGVuZ3RoKTtcbiAgaWYgKGxlbmd0aCA8IGtleS5sZW5ndGggJiYgZGlyID09PSBcInByZXZcIilcbiAgICByZXR1cm4ga2V5LnN1YnN0cigwLCB1cHBlck5lZWRsZS5sZW5ndGgpO1xuICByZXR1cm4gbGxwIDwgMCA/IG51bGwgOiBrZXkuc3Vic3RyKDAsIGxscCkgKyBsb3dlck5lZWRsZVtsbHBdICsgdXBwZXJOZWVkbGUuc3Vic3RyKGxscCArIDEpO1xufVxuZnVuY3Rpb24gYWRkSWdub3JlQ2FzZUFsZ29yaXRobSh3aGVyZUNsYXVzZSwgbWF0Y2gsIG5lZWRsZXMsIHN1ZmZpeCkge1xuICB2YXIgdXBwZXIsIGxvd2VyLCBjb21wYXJlLCB1cHBlck5lZWRsZXMsIGxvd2VyTmVlZGxlcywgZGlyZWN0aW9uLCBuZXh0S2V5U3VmZml4LCBuZWVkbGVzTGVuID0gbmVlZGxlcy5sZW5ndGg7XG4gIGlmICghbmVlZGxlcy5ldmVyeShmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzID09PSBcInN0cmluZ1wiO1xuICB9KSkge1xuICAgIHJldHVybiBmYWlsKHdoZXJlQ2xhdXNlLCBTVFJJTkdfRVhQRUNURUQpO1xuICB9XG4gIGZ1bmN0aW9uIGluaXREaXJlY3Rpb24oZGlyKSB7XG4gICAgdXBwZXIgPSB1cHBlckZhY3RvcnkoZGlyKTtcbiAgICBsb3dlciA9IGxvd2VyRmFjdG9yeShkaXIpO1xuICAgIGNvbXBhcmUgPSBkaXIgPT09IFwibmV4dFwiID8gc2ltcGxlQ29tcGFyZSA6IHNpbXBsZUNvbXBhcmVSZXZlcnNlO1xuICAgIHZhciBuZWVkbGVCb3VuZHMgPSBuZWVkbGVzLm1hcChmdW5jdGlvbihuZWVkbGUpIHtcbiAgICAgIHJldHVybiB7bG93ZXI6IGxvd2VyKG5lZWRsZSksIHVwcGVyOiB1cHBlcihuZWVkbGUpfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBjb21wYXJlKGEubG93ZXIsIGIubG93ZXIpO1xuICAgIH0pO1xuICAgIHVwcGVyTmVlZGxlcyA9IG5lZWRsZUJvdW5kcy5tYXAoZnVuY3Rpb24obmIpIHtcbiAgICAgIHJldHVybiBuYi51cHBlcjtcbiAgICB9KTtcbiAgICBsb3dlck5lZWRsZXMgPSBuZWVkbGVCb3VuZHMubWFwKGZ1bmN0aW9uKG5iKSB7XG4gICAgICByZXR1cm4gbmIubG93ZXI7XG4gICAgfSk7XG4gICAgZGlyZWN0aW9uID0gZGlyO1xuICAgIG5leHRLZXlTdWZmaXggPSBkaXIgPT09IFwibmV4dFwiID8gXCJcIiA6IHN1ZmZpeDtcbiAgfVxuICBpbml0RGlyZWN0aW9uKFwibmV4dFwiKTtcbiAgdmFyIGMgPSBuZXcgd2hlcmVDbGF1c2UuQ29sbGVjdGlvbih3aGVyZUNsYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHVwcGVyTmVlZGxlc1swXSwgbG93ZXJOZWVkbGVzW25lZWRsZXNMZW4gLSAxXSArIHN1ZmZpeCk7XG4gIH0pO1xuICBjLl9vbmRpcmVjdGlvbmNoYW5nZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbjIpIHtcbiAgICBpbml0RGlyZWN0aW9uKGRpcmVjdGlvbjIpO1xuICB9O1xuICB2YXIgZmlyc3RQb3NzaWJsZU5lZWRsZSA9IDA7XG4gIGMuX2FkZEFsZ29yaXRobShmdW5jdGlvbihjdXJzb3IsIGFkdmFuY2UsIHJlc29sdmUpIHtcbiAgICB2YXIga2V5ID0gY3Vyc29yLmtleTtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gXCJzdHJpbmdcIilcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB2YXIgbG93ZXJLZXkgPSBsb3dlcihrZXkpO1xuICAgIGlmIChtYXRjaChsb3dlcktleSwgbG93ZXJOZWVkbGVzLCBmaXJzdFBvc3NpYmxlTmVlZGxlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsb3dlc3RQb3NzaWJsZUNhc2luZyA9IG51bGw7XG4gICAgICBmb3IgKHZhciBpID0gZmlyc3RQb3NzaWJsZU5lZWRsZTsgaSA8IG5lZWRsZXNMZW47ICsraSkge1xuICAgICAgICB2YXIgY2FzaW5nID0gbmV4dENhc2luZyhrZXksIGxvd2VyS2V5LCB1cHBlck5lZWRsZXNbaV0sIGxvd2VyTmVlZGxlc1tpXSwgY29tcGFyZSwgZGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKGNhc2luZyA9PT0gbnVsbCAmJiBsb3dlc3RQb3NzaWJsZUNhc2luZyA9PT0gbnVsbClcbiAgICAgICAgICBmaXJzdFBvc3NpYmxlTmVlZGxlID0gaSArIDE7XG4gICAgICAgIGVsc2UgaWYgKGxvd2VzdFBvc3NpYmxlQ2FzaW5nID09PSBudWxsIHx8IGNvbXBhcmUobG93ZXN0UG9zc2libGVDYXNpbmcsIGNhc2luZykgPiAwKSB7XG4gICAgICAgICAgbG93ZXN0UG9zc2libGVDYXNpbmcgPSBjYXNpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsb3dlc3RQb3NzaWJsZUNhc2luZyAhPT0gbnVsbCkge1xuICAgICAgICBhZHZhbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGN1cnNvci5jb250aW51ZShsb3dlc3RQb3NzaWJsZUNhc2luZyArIG5leHRLZXlTdWZmaXgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkdmFuY2UocmVzb2x2ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGM7XG59XG5mdW5jdGlvbiBjcmVhdGVSYW5nZShsb3dlciwgdXBwZXIsIGxvd2VyT3BlbiwgdXBwZXJPcGVuKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogMixcbiAgICBsb3dlcixcbiAgICB1cHBlcixcbiAgICBsb3dlck9wZW4sXG4gICAgdXBwZXJPcGVuXG4gIH07XG59XG5mdW5jdGlvbiByYW5nZUVxdWFsKHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogMSxcbiAgICBsb3dlcjogdmFsdWUsXG4gICAgdXBwZXI6IHZhbHVlXG4gIH07XG59XG52YXIgV2hlcmVDbGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gV2hlcmVDbGF1c2UyKCkge1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaGVyZUNsYXVzZTIucHJvdG90eXBlLCBcIkNvbGxlY3Rpb25cIiwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3R4LnRhYmxlLmRiLkNvbGxlY3Rpb247XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uKGxvd2VyLCB1cHBlciwgaW5jbHVkZUxvd2VyLCBpbmNsdWRlVXBwZXIpIHtcbiAgICBpbmNsdWRlTG93ZXIgPSBpbmNsdWRlTG93ZXIgIT09IGZhbHNlO1xuICAgIGluY2x1ZGVVcHBlciA9IGluY2x1ZGVVcHBlciA9PT0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgaWYgKHRoaXMuX2NtcChsb3dlciwgdXBwZXIpID4gMCB8fCB0aGlzLl9jbXAobG93ZXIsIHVwcGVyKSA9PT0gMCAmJiAoaW5jbHVkZUxvd2VyIHx8IGluY2x1ZGVVcHBlcikgJiYgIShpbmNsdWRlTG93ZXIgJiYgaW5jbHVkZVVwcGVyKSlcbiAgICAgICAgcmV0dXJuIGVtcHR5Q29sbGVjdGlvbih0aGlzKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlUmFuZ2UobG93ZXIsIHVwcGVyLCAhaW5jbHVkZUxvd2VyLCAhaW5jbHVkZVVwcGVyKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICB9XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByYW5nZUVxdWFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5hYm92ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZ2UodmFsdWUsIHZvaWQgMCwgdHJ1ZSk7XG4gICAgfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYWJvdmVPckVxdWFsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSYW5nZSh2YWx1ZSwgdm9pZCAwLCBmYWxzZSk7XG4gICAgfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuYmVsb3cgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHZvaWQgMCwgdmFsdWUsIGZhbHNlLCB0cnVlKTtcbiAgICB9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5iZWxvd09yRXF1YWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHZvaWQgMCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gXCJzdHJpbmdcIilcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIFNUUklOR19FWFBFQ1RFRCk7XG4gICAgcmV0dXJuIHRoaXMuYmV0d2VlbihzdHIsIHN0ciArIG1heFN0cmluZywgdHJ1ZSwgdHJ1ZSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuc3RhcnRzV2l0aElnbm9yZUNhc2UgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoc3RyID09PSBcIlwiKVxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRzV2l0aChzdHIpO1xuICAgIHJldHVybiBhZGRJZ25vcmVDYXNlQWxnb3JpdGhtKHRoaXMsIGZ1bmN0aW9uKHgsIGEpIHtcbiAgICAgIHJldHVybiB4LmluZGV4T2YoYVswXSkgPT09IDA7XG4gICAgfSwgW3N0cl0sIG1heFN0cmluZyk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuZXF1YWxzSWdub3JlQ2FzZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBhZGRJZ25vcmVDYXNlQWxnb3JpdGhtKHRoaXMsIGZ1bmN0aW9uKHgsIGEpIHtcbiAgICAgIHJldHVybiB4ID09PSBhWzBdO1xuICAgIH0sIFtzdHJdLCBcIlwiKTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5hbnlPZklnbm9yZUNhc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0ID0gZ2V0QXJyYXlPZi5hcHBseShOT19DSEFSX0FSUkFZLCBhcmd1bWVudHMpO1xuICAgIGlmIChzZXQubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIGVtcHR5Q29sbGVjdGlvbih0aGlzKTtcbiAgICByZXR1cm4gYWRkSWdub3JlQ2FzZUFsZ29yaXRobSh0aGlzLCBmdW5jdGlvbih4LCBhKSB7XG4gICAgICByZXR1cm4gYS5pbmRleE9mKHgpICE9PSAtMTtcbiAgICB9LCBzZXQsIFwiXCIpO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLnN0YXJ0c1dpdGhBbnlPZklnbm9yZUNhc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0ID0gZ2V0QXJyYXlPZi5hcHBseShOT19DSEFSX0FSUkFZLCBhcmd1bWVudHMpO1xuICAgIGlmIChzZXQubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIGVtcHR5Q29sbGVjdGlvbih0aGlzKTtcbiAgICByZXR1cm4gYWRkSWdub3JlQ2FzZUFsZ29yaXRobSh0aGlzLCBmdW5jdGlvbih4LCBhKSB7XG4gICAgICByZXR1cm4gYS5zb21lKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIHguaW5kZXhPZihuKSA9PT0gMDtcbiAgICAgIH0pO1xuICAgIH0sIHNldCwgbWF4U3RyaW5nKTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5hbnlPZiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHNldCA9IGdldEFycmF5T2YuYXBwbHkoTk9fQ0hBUl9BUlJBWSwgYXJndW1lbnRzKTtcbiAgICB2YXIgY29tcGFyZSA9IHRoaXMuX2NtcDtcbiAgICB0cnkge1xuICAgICAgc2V0LnNvcnQoY29tcGFyZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIH1cbiAgICBpZiAoc2V0Lmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBlbXB0eUNvbGxlY3Rpb24odGhpcyk7XG4gICAgdmFyIGMgPSBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHNldFswXSwgc2V0W3NldC5sZW5ndGggLSAxXSk7XG4gICAgfSk7XG4gICAgYy5fb25kaXJlY3Rpb25jaGFuZ2UgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcbiAgICAgIGNvbXBhcmUgPSBkaXJlY3Rpb24gPT09IFwibmV4dFwiID8gX3RoaXMuX2FzY2VuZGluZyA6IF90aGlzLl9kZXNjZW5kaW5nO1xuICAgICAgc2V0LnNvcnQoY29tcGFyZSk7XG4gICAgfTtcbiAgICB2YXIgaSA9IDA7XG4gICAgYy5fYWRkQWxnb3JpdGhtKGZ1bmN0aW9uKGN1cnNvciwgYWR2YW5jZSwgcmVzb2x2ZSkge1xuICAgICAgdmFyIGtleSA9IGN1cnNvci5rZXk7XG4gICAgICB3aGlsZSAoY29tcGFyZShrZXksIHNldFtpXSkgPiAwKSB7XG4gICAgICAgICsraTtcbiAgICAgICAgaWYgKGkgPT09IHNldC5sZW5ndGgpIHtcbiAgICAgICAgICBhZHZhbmNlKHJlc29sdmUpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNvbXBhcmUoa2V5LCBzZXRbaV0pID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWR2YW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICBjdXJzb3IuY29udGludWUoc2V0W2ldKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYztcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5ub3RFcXVhbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5BbnlSYW5nZShbW21pbktleSwgdmFsdWVdLCBbdmFsdWUsIHRoaXMuZGIuX21heEtleV1dLCB7aW5jbHVkZUxvd2VyczogZmFsc2UsIGluY2x1ZGVVcHBlcnM6IGZhbHNlfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUubm9uZU9mID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldCA9IGdldEFycmF5T2YuYXBwbHkoTk9fQ0hBUl9BUlJBWSwgYXJndW1lbnRzKTtcbiAgICBpZiAoc2V0Lmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBzZXQuc29ydCh0aGlzLl9hc2NlbmRpbmcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICB9XG4gICAgdmFyIHJhbmdlcyA9IHNldC5yZWR1Y2UoZnVuY3Rpb24ocmVzLCB2YWwpIHtcbiAgICAgIHJldHVybiByZXMgPyByZXMuY29uY2F0KFtbcmVzW3Jlcy5sZW5ndGggLSAxXVsxXSwgdmFsXV0pIDogW1ttaW5LZXksIHZhbF1dO1xuICAgIH0sIG51bGwpO1xuICAgIHJhbmdlcy5wdXNoKFtzZXRbc2V0Lmxlbmd0aCAtIDFdLCB0aGlzLmRiLl9tYXhLZXldKTtcbiAgICByZXR1cm4gdGhpcy5pbkFueVJhbmdlKHJhbmdlcywge2luY2x1ZGVMb3dlcnM6IGZhbHNlLCBpbmNsdWRlVXBwZXJzOiBmYWxzZX0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmluQW55UmFuZ2UgPSBmdW5jdGlvbihyYW5nZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBjbXAyID0gdGhpcy5fY21wLCBhc2NlbmRpbmcgPSB0aGlzLl9hc2NlbmRpbmcsIGRlc2NlbmRpbmcgPSB0aGlzLl9kZXNjZW5kaW5nLCBtaW4gPSB0aGlzLl9taW4sIG1heCA9IHRoaXMuX21heDtcbiAgICBpZiAocmFuZ2VzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBlbXB0eUNvbGxlY3Rpb24odGhpcyk7XG4gICAgaWYgKCFyYW5nZXMuZXZlcnkoZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgIHJldHVybiByYW5nZVswXSAhPT0gdm9pZCAwICYmIHJhbmdlWzFdICE9PSB2b2lkIDAgJiYgYXNjZW5kaW5nKHJhbmdlWzBdLCByYW5nZVsxXSkgPD0gMDtcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIGZhaWwodGhpcywgXCJGaXJzdCBhcmd1bWVudCB0byBpbkFueVJhbmdlKCkgbXVzdCBiZSBhbiBBcnJheSBvZiB0d28tdmFsdWUgQXJyYXlzIFtsb3dlcix1cHBlcl0gd2hlcmUgdXBwZXIgbXVzdCBub3QgYmUgbG93ZXIgdGhhbiBsb3dlclwiLCBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudCk7XG4gICAgfVxuICAgIHZhciBpbmNsdWRlTG93ZXJzID0gIW9wdGlvbnMgfHwgb3B0aW9ucy5pbmNsdWRlTG93ZXJzICE9PSBmYWxzZTtcbiAgICB2YXIgaW5jbHVkZVVwcGVycyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5pbmNsdWRlVXBwZXJzID09PSB0cnVlO1xuICAgIGZ1bmN0aW9uIGFkZFJhbmdlMihyYW5nZXMyLCBuZXdSYW5nZSkge1xuICAgICAgdmFyIGkgPSAwLCBsID0gcmFuZ2VzMi5sZW5ndGg7XG4gICAgICBmb3IgKDsgaSA8IGw7ICsraSkge1xuICAgICAgICB2YXIgcmFuZ2UgPSByYW5nZXMyW2ldO1xuICAgICAgICBpZiAoY21wMihuZXdSYW5nZVswXSwgcmFuZ2VbMV0pIDwgMCAmJiBjbXAyKG5ld1JhbmdlWzFdLCByYW5nZVswXSkgPiAwKSB7XG4gICAgICAgICAgcmFuZ2VbMF0gPSBtaW4ocmFuZ2VbMF0sIG5ld1JhbmdlWzBdKTtcbiAgICAgICAgICByYW5nZVsxXSA9IG1heChyYW5nZVsxXSwgbmV3UmFuZ2VbMV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA9PT0gbClcbiAgICAgICAgcmFuZ2VzMi5wdXNoKG5ld1JhbmdlKTtcbiAgICAgIHJldHVybiByYW5nZXMyO1xuICAgIH1cbiAgICB2YXIgc29ydERpcmVjdGlvbiA9IGFzY2VuZGluZztcbiAgICBmdW5jdGlvbiByYW5nZVNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gc29ydERpcmVjdGlvbihhWzBdLCBiWzBdKTtcbiAgICB9XG4gICAgdmFyIHNldDtcbiAgICB0cnkge1xuICAgICAgc2V0ID0gcmFuZ2VzLnJlZHVjZShhZGRSYW5nZTIsIFtdKTtcbiAgICAgIHNldC5zb3J0KHJhbmdlU29ydGVyKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIH1cbiAgICB2YXIgcmFuZ2VQb3MgPSAwO1xuICAgIHZhciBrZXlJc0JleW9uZEN1cnJlbnRFbnRyeSA9IGluY2x1ZGVVcHBlcnMgPyBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBhc2NlbmRpbmcoa2V5LCBzZXRbcmFuZ2VQb3NdWzFdKSA+IDA7XG4gICAgfSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGFzY2VuZGluZyhrZXksIHNldFtyYW5nZVBvc11bMV0pID49IDA7XG4gICAgfTtcbiAgICB2YXIga2V5SXNCZWZvcmVDdXJyZW50RW50cnkgPSBpbmNsdWRlTG93ZXJzID8gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhrZXksIHNldFtyYW5nZVBvc11bMF0pID4gMDtcbiAgICB9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhrZXksIHNldFtyYW5nZVBvc11bMF0pID49IDA7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBrZXlXaXRoaW5DdXJyZW50UmFuZ2Uoa2V5KSB7XG4gICAgICByZXR1cm4gIWtleUlzQmV5b25kQ3VycmVudEVudHJ5KGtleSkgJiYgIWtleUlzQmVmb3JlQ3VycmVudEVudHJ5KGtleSk7XG4gICAgfVxuICAgIHZhciBjaGVja0tleSA9IGtleUlzQmV5b25kQ3VycmVudEVudHJ5O1xuICAgIHZhciBjID0gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSYW5nZShzZXRbMF1bMF0sIHNldFtzZXQubGVuZ3RoIC0gMV1bMV0sICFpbmNsdWRlTG93ZXJzLCAhaW5jbHVkZVVwcGVycyk7XG4gICAgfSk7XG4gICAgYy5fb25kaXJlY3Rpb25jaGFuZ2UgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwibmV4dFwiKSB7XG4gICAgICAgIGNoZWNrS2V5ID0ga2V5SXNCZXlvbmRDdXJyZW50RW50cnk7XG4gICAgICAgIHNvcnREaXJlY3Rpb24gPSBhc2NlbmRpbmc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGVja0tleSA9IGtleUlzQmVmb3JlQ3VycmVudEVudHJ5O1xuICAgICAgICBzb3J0RGlyZWN0aW9uID0gZGVzY2VuZGluZztcbiAgICAgIH1cbiAgICAgIHNldC5zb3J0KHJhbmdlU29ydGVyKTtcbiAgICB9O1xuICAgIGMuX2FkZEFsZ29yaXRobShmdW5jdGlvbihjdXJzb3IsIGFkdmFuY2UsIHJlc29sdmUpIHtcbiAgICAgIHZhciBrZXkgPSBjdXJzb3Iua2V5O1xuICAgICAgd2hpbGUgKGNoZWNrS2V5KGtleSkpIHtcbiAgICAgICAgKytyYW5nZVBvcztcbiAgICAgICAgaWYgKHJhbmdlUG9zID09PSBzZXQubGVuZ3RoKSB7XG4gICAgICAgICAgYWR2YW5jZShyZXNvbHZlKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChrZXlXaXRoaW5DdXJyZW50UmFuZ2Uoa2V5KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoX3RoaXMuX2NtcChrZXksIHNldFtyYW5nZVBvc11bMV0pID09PSAwIHx8IF90aGlzLl9jbXAoa2V5LCBzZXRbcmFuZ2VQb3NdWzBdKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZHZhbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChzb3J0RGlyZWN0aW9uID09PSBhc2NlbmRpbmcpXG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUoc2V0W3JhbmdlUG9zXVswXSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKHNldFtyYW5nZVBvc11bMV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLnN0YXJ0c1dpdGhBbnlPZiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXQgPSBnZXRBcnJheU9mLmFwcGx5KE5PX0NIQVJfQVJSQVksIGFyZ3VtZW50cyk7XG4gICAgaWYgKCFzZXQuZXZlcnkoZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIHR5cGVvZiBzID09PSBcInN0cmluZ1wiO1xuICAgIH0pKSB7XG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBcInN0YXJ0c1dpdGhBbnlPZigpIG9ubHkgd29ya3Mgd2l0aCBzdHJpbmdzXCIpO1xuICAgIH1cbiAgICBpZiAoc2V0Lmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBlbXB0eUNvbGxlY3Rpb24odGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuaW5BbnlSYW5nZShzZXQubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIFtzdHIsIHN0ciArIG1heFN0cmluZ107XG4gICAgfSkpO1xuICB9O1xuICByZXR1cm4gV2hlcmVDbGF1c2UyO1xufSgpO1xuZnVuY3Rpb24gY3JlYXRlV2hlcmVDbGF1c2VDb25zdHJ1Y3RvcihkYikge1xuICByZXR1cm4gbWFrZUNsYXNzQ29uc3RydWN0b3IoV2hlcmVDbGF1c2UucHJvdG90eXBlLCBmdW5jdGlvbiBXaGVyZUNsYXVzZTIodGFibGUsIGluZGV4LCBvckNvbGxlY3Rpb24pIHtcbiAgICB0aGlzLmRiID0gZGI7XG4gICAgdGhpcy5fY3R4ID0ge1xuICAgICAgdGFibGUsXG4gICAgICBpbmRleDogaW5kZXggPT09IFwiOmlkXCIgPyBudWxsIDogaW5kZXgsXG4gICAgICBvcjogb3JDb2xsZWN0aW9uXG4gICAgfTtcbiAgICB2YXIgaW5kZXhlZERCID0gZGIuX2RlcHMuaW5kZXhlZERCO1xuICAgIGlmICghaW5kZXhlZERCKVxuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTWlzc2luZ0FQSSgpO1xuICAgIHRoaXMuX2NtcCA9IHRoaXMuX2FzY2VuZGluZyA9IGluZGV4ZWREQi5jbXAuYmluZChpbmRleGVkREIpO1xuICAgIHRoaXMuX2Rlc2NlbmRpbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gaW5kZXhlZERCLmNtcChiLCBhKTtcbiAgICB9O1xuICAgIHRoaXMuX21heCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBpbmRleGVkREIuY21wKGEsIGIpID4gMCA/IGEgOiBiO1xuICAgIH07XG4gICAgdGhpcy5fbWluID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGluZGV4ZWREQi5jbXAoYSwgYikgPCAwID8gYSA6IGI7XG4gICAgfTtcbiAgICB0aGlzLl9JREJLZXlSYW5nZSA9IGRiLl9kZXBzLklEQktleVJhbmdlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpIHtcbiAgcmV0dXJuIHdyYXAoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBwcmV2ZW50RGVmYXVsdChldmVudCk7XG4gICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGV2ZW50KSB7XG4gIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdClcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufVxudmFyIGdsb2JhbEV2ZW50cyA9IEV2ZW50cyhudWxsLCBcInR4Y29tbWl0dGVkXCIpO1xudmFyIFRyYW5zYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uMigpIHtcbiAgfVxuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLl9sb2NrID0gZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0KCFQU0QuZ2xvYmFsKTtcbiAgICArK3RoaXMuX3JlY3Vsb2NrO1xuICAgIGlmICh0aGlzLl9yZWN1bG9jayA9PT0gMSAmJiAhUFNELmdsb2JhbClcbiAgICAgIFBTRC5sb2NrT3duZXJGb3IgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLl91bmxvY2sgPSBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQoIVBTRC5nbG9iYWwpO1xuICAgIGlmICgtLXRoaXMuX3JlY3Vsb2NrID09PSAwKSB7XG4gICAgICBpZiAoIVBTRC5nbG9iYWwpXG4gICAgICAgIFBTRC5sb2NrT3duZXJGb3IgPSBudWxsO1xuICAgICAgd2hpbGUgKHRoaXMuX2Jsb2NrZWRGdW5jcy5sZW5ndGggPiAwICYmICF0aGlzLl9sb2NrZWQoKSkge1xuICAgICAgICB2YXIgZm5BbmRQU0QgPSB0aGlzLl9ibG9ja2VkRnVuY3Muc2hpZnQoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB1c2VQU0QoZm5BbmRQU0RbMV0sIGZuQW5kUFNEWzBdKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLl9sb2NrZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVjdWxvY2sgJiYgUFNELmxvY2tPd25lckZvciAhPT0gdGhpcztcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihpZGJ0cmFucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLm1vZGUpXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB2YXIgaWRiZGIgPSB0aGlzLmRiLmlkYmRiO1xuICAgIHZhciBkYk9wZW5FcnJvciA9IHRoaXMuZGIuX3N0YXRlLmRiT3BlbkVycm9yO1xuICAgIGFzc2VydCghdGhpcy5pZGJ0cmFucyk7XG4gICAgaWYgKCFpZGJ0cmFucyAmJiAhaWRiZGIpIHtcbiAgICAgIHN3aXRjaCAoZGJPcGVuRXJyb3IgJiYgZGJPcGVuRXJyb3IubmFtZSkge1xuICAgICAgICBjYXNlIFwiRGF0YWJhc2VDbG9zZWRFcnJvclwiOlxuICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkRhdGFiYXNlQ2xvc2VkKGRiT3BlbkVycm9yKTtcbiAgICAgICAgY2FzZSBcIk1pc3NpbmdBUElFcnJvclwiOlxuICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk1pc3NpbmdBUEkoZGJPcGVuRXJyb3IubWVzc2FnZSwgZGJPcGVuRXJyb3IpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk9wZW5GYWlsZWQoZGJPcGVuRXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXRoaXMuYWN0aXZlKVxuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuVHJhbnNhY3Rpb25JbmFjdGl2ZSgpO1xuICAgIGFzc2VydCh0aGlzLl9jb21wbGV0aW9uLl9zdGF0ZSA9PT0gbnVsbCk7XG4gICAgaWRidHJhbnMgPSB0aGlzLmlkYnRyYW5zID0gaWRidHJhbnMgfHwgaWRiZGIudHJhbnNhY3Rpb24oc2FmYXJpTXVsdGlTdG9yZUZpeCh0aGlzLnN0b3JlTmFtZXMpLCB0aGlzLm1vZGUpO1xuICAgIGlkYnRyYW5zLm9uZXJyb3IgPSB3cmFwKGZ1bmN0aW9uKGV2KSB7XG4gICAgICBwcmV2ZW50RGVmYXVsdChldik7XG4gICAgICBfdGhpcy5fcmVqZWN0KGlkYnRyYW5zLmVycm9yKTtcbiAgICB9KTtcbiAgICBpZGJ0cmFucy5vbmFib3J0ID0gd3JhcChmdW5jdGlvbihldikge1xuICAgICAgcHJldmVudERlZmF1bHQoZXYpO1xuICAgICAgX3RoaXMuYWN0aXZlICYmIF90aGlzLl9yZWplY3QobmV3IGV4Y2VwdGlvbnMuQWJvcnQoaWRidHJhbnMuZXJyb3IpKTtcbiAgICAgIF90aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgX3RoaXMub24oXCJhYm9ydFwiKS5maXJlKGV2KTtcbiAgICB9KTtcbiAgICBpZGJ0cmFucy5vbmNvbXBsZXRlID0gd3JhcChmdW5jdGlvbigpIHtcbiAgICAgIF90aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgX3RoaXMuX3Jlc29sdmUoKTtcbiAgICAgIGlmIChcIm11dGF0ZWRQYXJ0c1wiIGluIGlkYnRyYW5zKSB7XG4gICAgICAgIGdsb2JhbEV2ZW50cy50eGNvbW1pdHRlZC5maXJlKGlkYnRyYW5zW1wibXV0YXRlZFBhcnRzXCJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5fcHJvbWlzZSA9IGZ1bmN0aW9uKG1vZGUsIGZuLCBiV3JpdGVMb2NrKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBpZiAobW9kZSA9PT0gXCJyZWFkd3JpdGVcIiAmJiB0aGlzLm1vZGUgIT09IFwicmVhZHdyaXRlXCIpXG4gICAgICByZXR1cm4gcmVqZWN0aW9uKG5ldyBleGNlcHRpb25zLlJlYWRPbmx5KFwiVHJhbnNhY3Rpb24gaXMgcmVhZG9ubHlcIikpO1xuICAgIGlmICghdGhpcy5hY3RpdmUpXG4gICAgICByZXR1cm4gcmVqZWN0aW9uKG5ldyBleGNlcHRpb25zLlRyYW5zYWN0aW9uSW5hY3RpdmUoKSk7XG4gICAgaWYgKHRoaXMuX2xvY2tlZCgpKSB7XG4gICAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgX3RoaXMuX2Jsb2NrZWRGdW5jcy5wdXNoKFtmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5fcHJvbWlzZShtb2RlLCBmbiwgYldyaXRlTG9jaykudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9LCBQU0RdKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYldyaXRlTG9jaykge1xuICAgICAgcmV0dXJuIG5ld1Njb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcDIgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIF90aGlzLl9sb2NrKCk7XG4gICAgICAgICAgdmFyIHJ2ID0gZm4ocmVzb2x2ZSwgcmVqZWN0LCBfdGhpcyk7XG4gICAgICAgICAgaWYgKHJ2ICYmIHJ2LnRoZW4pXG4gICAgICAgICAgICBydi50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgICBwMi5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5fdW5sb2NrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBwMi5fbGliID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHAyO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJ2ID0gZm4ocmVzb2x2ZSwgcmVqZWN0LCBfdGhpcyk7XG4gICAgICAgIGlmIChydiAmJiBydi50aGVuKVxuICAgICAgICAgIHJ2LnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgcC5fbGliID0gdHJ1ZTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5fcm9vdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50Ll9yb290KCkgOiB0aGlzO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLndhaXRGb3IgPSBmdW5jdGlvbihwcm9taXNlTGlrZSkge1xuICAgIHZhciByb290ID0gdGhpcy5fcm9vdCgpO1xuICAgIHZhciBwcm9taXNlID0gRGV4aWVQcm9taXNlLnJlc29sdmUocHJvbWlzZUxpa2UpO1xuICAgIGlmIChyb290Ll93YWl0aW5nRm9yKSB7XG4gICAgICByb290Ll93YWl0aW5nRm9yID0gcm9vdC5fd2FpdGluZ0Zvci50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290Ll93YWl0aW5nRm9yID0gcHJvbWlzZTtcbiAgICAgIHJvb3QuX3dhaXRpbmdRdWV1ZSA9IFtdO1xuICAgICAgdmFyIHN0b3JlID0gcm9vdC5pZGJ0cmFucy5vYmplY3RTdG9yZShyb290LnN0b3JlTmFtZXNbMF0pO1xuICAgICAgKGZ1bmN0aW9uIHNwaW4oKSB7XG4gICAgICAgICsrcm9vdC5fc3BpbkNvdW50O1xuICAgICAgICB3aGlsZSAocm9vdC5fd2FpdGluZ1F1ZXVlLmxlbmd0aClcbiAgICAgICAgICByb290Ll93YWl0aW5nUXVldWUuc2hpZnQoKSgpO1xuICAgICAgICBpZiAocm9vdC5fd2FpdGluZ0ZvcilcbiAgICAgICAgICBzdG9yZS5nZXQoLUluZmluaXR5KS5vbnN1Y2Nlc3MgPSBzcGluO1xuICAgICAgfSkoKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRXYWl0UHJvbWlzZSA9IHJvb3QuX3dhaXRpbmdGb3I7XG4gICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIHJldHVybiByb290Ll93YWl0aW5nUXVldWUucHVzaCh3cmFwKHJlc29sdmUuYmluZChudWxsLCByZXMpKSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJvb3QuX3dhaXRpbmdRdWV1ZS5wdXNoKHdyYXAocmVqZWN0LmJpbmQobnVsbCwgZXJyKSkpO1xuICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHJvb3QuX3dhaXRpbmdGb3IgPT09IGN1cnJlbnRXYWl0UHJvbWlzZSkge1xuICAgICAgICAgIHJvb3QuX3dhaXRpbmdGb3IgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgVHJhbnNhY3Rpb24yLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYWN0aXZlICYmIHRoaXMuX3JlamVjdChuZXcgZXhjZXB0aW9ucy5BYm9ydCgpKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLnRhYmxlID0gZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgdmFyIG1lbW9pemVkVGFibGVzID0gdGhpcy5fbWVtb2l6ZWRUYWJsZXMgfHwgKHRoaXMuX21lbW9pemVkVGFibGVzID0ge30pO1xuICAgIGlmIChoYXNPd24obWVtb2l6ZWRUYWJsZXMsIHRhYmxlTmFtZSkpXG4gICAgICByZXR1cm4gbWVtb2l6ZWRUYWJsZXNbdGFibGVOYW1lXTtcbiAgICB2YXIgdGFibGVTY2hlbWEgPSB0aGlzLnNjaGVtYVt0YWJsZU5hbWVdO1xuICAgIGlmICghdGFibGVTY2hlbWEpIHtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk5vdEZvdW5kKFwiVGFibGUgXCIgKyB0YWJsZU5hbWUgKyBcIiBub3QgcGFydCBvZiB0cmFuc2FjdGlvblwiKTtcbiAgICB9XG4gICAgdmFyIHRyYW5zYWN0aW9uQm91bmRUYWJsZSA9IG5ldyB0aGlzLmRiLlRhYmxlKHRhYmxlTmFtZSwgdGFibGVTY2hlbWEsIHRoaXMpO1xuICAgIHRyYW5zYWN0aW9uQm91bmRUYWJsZS5jb3JlID0gdGhpcy5kYi5jb3JlLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgbWVtb2l6ZWRUYWJsZXNbdGFibGVOYW1lXSA9IHRyYW5zYWN0aW9uQm91bmRUYWJsZTtcbiAgICByZXR1cm4gdHJhbnNhY3Rpb25Cb3VuZFRhYmxlO1xuICB9O1xuICByZXR1cm4gVHJhbnNhY3Rpb24yO1xufSgpO1xuZnVuY3Rpb24gY3JlYXRlVHJhbnNhY3Rpb25Db25zdHJ1Y3RvcihkYikge1xuICByZXR1cm4gbWFrZUNsYXNzQ29uc3RydWN0b3IoVHJhbnNhY3Rpb24ucHJvdG90eXBlLCBmdW5jdGlvbiBUcmFuc2FjdGlvbjIobW9kZSwgc3RvcmVOYW1lcywgZGJzY2hlbWEsIHBhcmVudCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHRoaXMubW9kZSA9IG1vZGU7XG4gICAgdGhpcy5zdG9yZU5hbWVzID0gc3RvcmVOYW1lcztcbiAgICB0aGlzLnNjaGVtYSA9IGRic2NoZW1hO1xuICAgIHRoaXMuaWRidHJhbnMgPSBudWxsO1xuICAgIHRoaXMub24gPSBFdmVudHModGhpcywgXCJjb21wbGV0ZVwiLCBcImVycm9yXCIsIFwiYWJvcnRcIik7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgfHwgbnVsbDtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5fcmVjdWxvY2sgPSAwO1xuICAgIHRoaXMuX2Jsb2NrZWRGdW5jcyA9IFtdO1xuICAgIHRoaXMuX3Jlc29sdmUgPSBudWxsO1xuICAgIHRoaXMuX3JlamVjdCA9IG51bGw7XG4gICAgdGhpcy5fd2FpdGluZ0ZvciA9IG51bGw7XG4gICAgdGhpcy5fd2FpdGluZ1F1ZXVlID0gbnVsbDtcbiAgICB0aGlzLl9zcGluQ291bnQgPSAwO1xuICAgIHRoaXMuX2NvbXBsZXRpb24gPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgX3RoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgX3RoaXMuX3JlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgICB0aGlzLl9jb21wbGV0aW9uLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBfdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIF90aGlzLm9uLmNvbXBsZXRlLmZpcmUoKTtcbiAgICB9LCBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgd2FzQWN0aXZlID0gX3RoaXMuYWN0aXZlO1xuICAgICAgX3RoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICBfdGhpcy5vbi5lcnJvci5maXJlKGUpO1xuICAgICAgX3RoaXMucGFyZW50ID8gX3RoaXMucGFyZW50Ll9yZWplY3QoZSkgOiB3YXNBY3RpdmUgJiYgX3RoaXMuaWRidHJhbnMgJiYgX3RoaXMuaWRidHJhbnMuYWJvcnQoKTtcbiAgICAgIHJldHVybiByZWplY3Rpb24oZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlSW5kZXhTcGVjKG5hbWUsIGtleVBhdGgsIHVuaXF1ZSwgbXVsdGksIGF1dG8sIGNvbXBvdW5kLCBpc1ByaW1LZXkpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIGtleVBhdGgsXG4gICAgdW5pcXVlLFxuICAgIG11bHRpLFxuICAgIGF1dG8sXG4gICAgY29tcG91bmQsXG4gICAgc3JjOiAodW5pcXVlICYmICFpc1ByaW1LZXkgPyBcIiZcIiA6IFwiXCIpICsgKG11bHRpID8gXCIqXCIgOiBcIlwiKSArIChhdXRvID8gXCIrK1wiIDogXCJcIikgKyBuYW1lRnJvbUtleVBhdGgoa2V5UGF0aClcbiAgfTtcbn1cbmZ1bmN0aW9uIG5hbWVGcm9tS2V5UGF0aChrZXlQYXRoKSB7XG4gIHJldHVybiB0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIiA/IGtleVBhdGggOiBrZXlQYXRoID8gXCJbXCIgKyBbXS5qb2luLmNhbGwoa2V5UGF0aCwgXCIrXCIpICsgXCJdXCIgOiBcIlwiO1xufVxuZnVuY3Rpb24gY3JlYXRlVGFibGVTY2hlbWEobmFtZSwgcHJpbUtleSwgaW5kZXhlcykge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgcHJpbUtleSxcbiAgICBpbmRleGVzLFxuICAgIG1hcHBlZENsYXNzOiBudWxsLFxuICAgIGlkeEJ5TmFtZTogYXJyYXlUb09iamVjdChpbmRleGVzLCBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuIFtpbmRleC5uYW1lLCBpbmRleF07XG4gICAgfSlcbiAgfTtcbn1cbmZ1bmN0aW9uIGdldEtleUV4dHJhY3RvcihrZXlQYXRoKSB7XG4gIGlmIChrZXlQYXRoID09IG51bGwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gZ2V0U2luZ2xlUGF0aEtleUV4dHJhY3RvcihrZXlQYXRoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gZ2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCk7XG4gICAgfTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0U2luZ2xlUGF0aEtleUV4dHJhY3RvcihrZXlQYXRoKSB7XG4gIHZhciBzcGxpdCA9IGtleVBhdGguc3BsaXQoXCIuXCIpO1xuICBpZiAoc3BsaXQubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9ialtrZXlQYXRoXTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBnZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoKTtcbiAgICB9O1xuICB9XG59XG5mdW5jdGlvbiBhcnJheWlmeShhcnJheUxpa2UpIHtcbiAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoYXJyYXlMaWtlKTtcbn1cbnZhciBfaWRfY291bnRlciA9IDA7XG5mdW5jdGlvbiBnZXRLZXlQYXRoQWxpYXMoa2V5UGF0aCkge1xuICByZXR1cm4ga2V5UGF0aCA9PSBudWxsID8gXCI6aWRcIiA6IHR5cGVvZiBrZXlQYXRoID09PSBcInN0cmluZ1wiID8ga2V5UGF0aCA6IFwiW1wiICsga2V5UGF0aC5qb2luKFwiK1wiKSArIFwiXVwiO1xufVxuZnVuY3Rpb24gY3JlYXRlREJDb3JlKGRiLCBpbmRleGVkREIsIElkYktleVJhbmdlLCB0bXBUcmFucykge1xuICB2YXIgY21wMiA9IGluZGV4ZWREQi5jbXAuYmluZChpbmRleGVkREIpO1xuICBmdW5jdGlvbiBleHRyYWN0U2NoZW1hKGRiMiwgdHJhbnMpIHtcbiAgICB2YXIgdGFibGVzMiA9IGFycmF5aWZ5KGRiMi5vYmplY3RTdG9yZU5hbWVzKTtcbiAgICByZXR1cm4ge1xuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIG5hbWU6IGRiMi5uYW1lLFxuICAgICAgICB0YWJsZXM6IHRhYmxlczIubWFwKGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlKTtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uKHN0b3JlKSB7XG4gICAgICAgICAgdmFyIGtleVBhdGggPSBzdG9yZS5rZXlQYXRoLCBhdXRvSW5jcmVtZW50ID0gc3RvcmUuYXV0b0luY3JlbWVudDtcbiAgICAgICAgICB2YXIgY29tcG91bmQgPSBpc0FycmF5KGtleVBhdGgpO1xuICAgICAgICAgIHZhciBvdXRib3VuZCA9IGtleVBhdGggPT0gbnVsbDtcbiAgICAgICAgICB2YXIgaW5kZXhCeUtleVBhdGggPSB7fTtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgbmFtZTogc3RvcmUubmFtZSxcbiAgICAgICAgICAgIHByaW1hcnlLZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgaXNQcmltYXJ5S2V5OiB0cnVlLFxuICAgICAgICAgICAgICBvdXRib3VuZCxcbiAgICAgICAgICAgICAgY29tcG91bmQsXG4gICAgICAgICAgICAgIGtleVBhdGgsXG4gICAgICAgICAgICAgIGF1dG9JbmNyZW1lbnQsXG4gICAgICAgICAgICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgZXh0cmFjdEtleTogZ2V0S2V5RXh0cmFjdG9yKGtleVBhdGgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5kZXhlczogYXJyYXlpZnkoc3RvcmUuaW5kZXhOYW1lcykubWFwKGZ1bmN0aW9uKGluZGV4TmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RvcmUuaW5kZXgoaW5kZXhOYW1lKTtcbiAgICAgICAgICAgIH0pLm1hcChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICB2YXIgbmFtZSA9IGluZGV4Lm5hbWUsIHVuaXF1ZSA9IGluZGV4LnVuaXF1ZSwgbXVsdGlFbnRyeSA9IGluZGV4Lm11bHRpRW50cnksIGtleVBhdGgyID0gaW5kZXgua2V5UGF0aDtcbiAgICAgICAgICAgICAgdmFyIGNvbXBvdW5kMiA9IGlzQXJyYXkoa2V5UGF0aDIpO1xuICAgICAgICAgICAgICB2YXIgcmVzdWx0MiA9IHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGNvbXBvdW5kOiBjb21wb3VuZDIsXG4gICAgICAgICAgICAgICAga2V5UGF0aDoga2V5UGF0aDIsXG4gICAgICAgICAgICAgICAgdW5pcXVlLFxuICAgICAgICAgICAgICAgIG11bHRpRW50cnksXG4gICAgICAgICAgICAgICAgZXh0cmFjdEtleTogZ2V0S2V5RXh0cmFjdG9yKGtleVBhdGgyKVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpbmRleEJ5S2V5UGF0aFtnZXRLZXlQYXRoQWxpYXMoa2V5UGF0aDIpXSA9IHJlc3VsdDI7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHQyO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBnZXRJbmRleEJ5S2V5UGF0aDogZnVuY3Rpb24oa2V5UGF0aDIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGluZGV4QnlLZXlQYXRoW2dldEtleVBhdGhBbGlhcyhrZXlQYXRoMildO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgaW5kZXhCeUtleVBhdGhbXCI6aWRcIl0gPSByZXN1bHQucHJpbWFyeUtleTtcbiAgICAgICAgICBpZiAoa2V5UGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbmRleEJ5S2V5UGF0aFtnZXRLZXlQYXRoQWxpYXMoa2V5UGF0aCldID0gcmVzdWx0LnByaW1hcnlLZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgaGFzR2V0QWxsOiB0YWJsZXMyLmxlbmd0aCA+IDAgJiYgXCJnZXRBbGxcIiBpbiB0cmFucy5vYmplY3RTdG9yZSh0YWJsZXMyWzBdKSAmJiAhKHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhLyhDaHJvbWVcXC98RWRnZVxcLykvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgW10uY29uY2F0KG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1NhZmFyaVxcLyhcXGQqKS8pKVsxXSA8IDYwNClcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VJREJLZXlSYW5nZShyYW5nZSkge1xuICAgIGlmIChyYW5nZS50eXBlID09PSAzKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKHJhbmdlLnR5cGUgPT09IDQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY29udmVydCBuZXZlciB0eXBlIHRvIElEQktleVJhbmdlXCIpO1xuICAgIHZhciBsb3dlciA9IHJhbmdlLmxvd2VyLCB1cHBlciA9IHJhbmdlLnVwcGVyLCBsb3dlck9wZW4gPSByYW5nZS5sb3dlck9wZW4sIHVwcGVyT3BlbiA9IHJhbmdlLnVwcGVyT3BlbjtcbiAgICB2YXIgaWRiUmFuZ2UgPSBsb3dlciA9PT0gdm9pZCAwID8gdXBwZXIgPT09IHZvaWQgMCA/IG51bGwgOiBJZGJLZXlSYW5nZS51cHBlckJvdW5kKHVwcGVyLCAhIXVwcGVyT3BlbikgOiB1cHBlciA9PT0gdm9pZCAwID8gSWRiS2V5UmFuZ2UubG93ZXJCb3VuZChsb3dlciwgISFsb3dlck9wZW4pIDogSWRiS2V5UmFuZ2UuYm91bmQobG93ZXIsIHVwcGVyLCAhIWxvd2VyT3BlbiwgISF1cHBlck9wZW4pO1xuICAgIHJldHVybiBpZGJSYW5nZTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVEYkNvcmVUYWJsZSh0YWJsZVNjaGVtYSkge1xuICAgIHZhciB0YWJsZU5hbWUgPSB0YWJsZVNjaGVtYS5uYW1lO1xuICAgIGZ1bmN0aW9uIG11dGF0ZShfYTMpIHtcbiAgICAgIHZhciB0cmFucyA9IF9hMy50cmFucywgdHlwZSA9IF9hMy50eXBlLCBrZXlzMiA9IF9hMy5rZXlzLCB2YWx1ZXMgPSBfYTMudmFsdWVzLCByYW5nZSA9IF9hMy5yYW5nZTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZSA9IHdyYXAocmVzb2x2ZSk7XG4gICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlTmFtZSk7XG4gICAgICAgIHZhciBvdXRib3VuZCA9IHN0b3JlLmtleVBhdGggPT0gbnVsbDtcbiAgICAgICAgdmFyIGlzQWRkT3JQdXQgPSB0eXBlID09PSBcInB1dFwiIHx8IHR5cGUgPT09IFwiYWRkXCI7XG4gICAgICAgIGlmICghaXNBZGRPclB1dCAmJiB0eXBlICE9PSBcImRlbGV0ZVwiICYmIHR5cGUgIT09IFwiZGVsZXRlUmFuZ2VcIilcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG9wZXJhdGlvbiB0eXBlOiBcIiArIHR5cGUpO1xuICAgICAgICB2YXIgbGVuZ3RoID0gKGtleXMyIHx8IHZhbHVlcyB8fCB7bGVuZ3RoOiAxfSkubGVuZ3RoO1xuICAgICAgICBpZiAoa2V5czIgJiYgdmFsdWVzICYmIGtleXMyLmxlbmd0aCAhPT0gdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdpdmVuIGtleXMgYXJyYXkgbXVzdCBoYXZlIHNhbWUgbGVuZ3RoIGFzIGdpdmVuIHZhbHVlcyBhcnJheS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMClcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7bnVtRmFpbHVyZXM6IDAsIGZhaWx1cmVzOiB7fSwgcmVzdWx0czogW10sIGxhc3RSZXN1bHQ6IHZvaWQgMH0pO1xuICAgICAgICB2YXIgcmVxO1xuICAgICAgICB2YXIgcmVxcyA9IFtdO1xuICAgICAgICB2YXIgZmFpbHVyZXMgPSBbXTtcbiAgICAgICAgdmFyIG51bUZhaWx1cmVzID0gMDtcbiAgICAgICAgdmFyIGVycm9ySGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgKytudW1GYWlsdXJlcztcbiAgICAgICAgICBwcmV2ZW50RGVmYXVsdChldmVudCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlID09PSBcImRlbGV0ZVJhbmdlXCIpIHtcbiAgICAgICAgICBpZiAocmFuZ2UudHlwZSA9PT0gNClcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtudW1GYWlsdXJlcywgZmFpbHVyZXMsIHJlc3VsdHM6IFtdLCBsYXN0UmVzdWx0OiB2b2lkIDB9KTtcbiAgICAgICAgICBpZiAocmFuZ2UudHlwZSA9PT0gMylcbiAgICAgICAgICAgIHJlcXMucHVzaChyZXEgPSBzdG9yZS5jbGVhcigpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXFzLnB1c2gocmVxID0gc3RvcmUuZGVsZXRlKG1ha2VJREJLZXlSYW5nZShyYW5nZSkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgX2E0ID0gaXNBZGRPclB1dCA/IG91dGJvdW5kID8gW3ZhbHVlcywga2V5czJdIDogW3ZhbHVlcywgbnVsbF0gOiBba2V5czIsIG51bGxdLCBhcmdzMSA9IF9hNFswXSwgYXJnczIgPSBfYTRbMV07XG4gICAgICAgICAgaWYgKGlzQWRkT3JQdXQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgcmVxcy5wdXNoKHJlcSA9IGFyZ3MyICYmIGFyZ3MyW2ldICE9PSB2b2lkIDAgPyBzdG9yZVt0eXBlXShhcmdzMVtpXSwgYXJnczJbaV0pIDogc3RvcmVbdHlwZV0oYXJnczFbaV0pKTtcbiAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSBlcnJvckhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgcmVxcy5wdXNoKHJlcSA9IHN0b3JlW3R5cGVdKGFyZ3MxW2ldKSk7XG4gICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZG9uZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIGxhc3RSZXN1bHQgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgIHJlcXMuZm9yRWFjaChmdW5jdGlvbihyZXEyLCBpMikge1xuICAgICAgICAgICAgcmV0dXJuIHJlcTIuZXJyb3IgIT0gbnVsbCAmJiAoZmFpbHVyZXNbaTJdID0gcmVxMi5lcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBudW1GYWlsdXJlcyxcbiAgICAgICAgICAgIGZhaWx1cmVzLFxuICAgICAgICAgICAgcmVzdWx0czogdHlwZSA9PT0gXCJkZWxldGVcIiA/IGtleXMyIDogcmVxcy5tYXAoZnVuY3Rpb24ocmVxMikge1xuICAgICAgICAgICAgICByZXR1cm4gcmVxMi5yZXN1bHQ7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGxhc3RSZXN1bHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGVycm9ySGFuZGxlcihldmVudCk7XG4gICAgICAgICAgZG9uZShldmVudCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBkb25lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9wZW5DdXJzb3IyKF9hMykge1xuICAgICAgdmFyIHRyYW5zID0gX2EzLnRyYW5zLCB2YWx1ZXMgPSBfYTMudmFsdWVzLCBxdWVyeTIgPSBfYTMucXVlcnksIHJldmVyc2UgPSBfYTMucmV2ZXJzZSwgdW5pcXVlID0gX2EzLnVuaXF1ZTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZSA9IHdyYXAocmVzb2x2ZSk7XG4gICAgICAgIHZhciBpbmRleCA9IHF1ZXJ5Mi5pbmRleCwgcmFuZ2UgPSBxdWVyeTIucmFuZ2U7XG4gICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlTmFtZSk7XG4gICAgICAgIHZhciBzb3VyY2UgPSBpbmRleC5pc1ByaW1hcnlLZXkgPyBzdG9yZSA6IHN0b3JlLmluZGV4KGluZGV4Lm5hbWUpO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gcmV2ZXJzZSA/IHVuaXF1ZSA/IFwicHJldnVuaXF1ZVwiIDogXCJwcmV2XCIgOiB1bmlxdWUgPyBcIm5leHR1bmlxdWVcIiA6IFwibmV4dFwiO1xuICAgICAgICB2YXIgcmVxID0gdmFsdWVzIHx8ICEoXCJvcGVuS2V5Q3Vyc29yXCIgaW4gc291cmNlKSA/IHNvdXJjZS5vcGVuQ3Vyc29yKG1ha2VJREJLZXlSYW5nZShyYW5nZSksIGRpcmVjdGlvbikgOiBzb3VyY2Uub3BlbktleUN1cnNvcihtYWtlSURCS2V5UmFuZ2UocmFuZ2UpLCBkaXJlY3Rpb24pO1xuICAgICAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICByZXEub25zdWNjZXNzID0gd3JhcChmdW5jdGlvbihldikge1xuICAgICAgICAgIHZhciBjdXJzb3IgPSByZXEucmVzdWx0O1xuICAgICAgICAgIGlmICghY3Vyc29yKSB7XG4gICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJzb3IuX19faWQgPSArK19pZF9jb3VudGVyO1xuICAgICAgICAgIGN1cnNvci5kb25lID0gZmFsc2U7XG4gICAgICAgICAgdmFyIF9jdXJzb3JDb250aW51ZSA9IGN1cnNvci5jb250aW51ZS5iaW5kKGN1cnNvcik7XG4gICAgICAgICAgdmFyIF9jdXJzb3JDb250aW51ZVByaW1hcnlLZXkgPSBjdXJzb3IuY29udGludWVQcmltYXJ5S2V5O1xuICAgICAgICAgIGlmIChfY3Vyc29yQ29udGludWVQcmltYXJ5S2V5KVxuICAgICAgICAgICAgX2N1cnNvckNvbnRpbnVlUHJpbWFyeUtleSA9IF9jdXJzb3JDb250aW51ZVByaW1hcnlLZXkuYmluZChjdXJzb3IpO1xuICAgICAgICAgIHZhciBfY3Vyc29yQWR2YW5jZSA9IGN1cnNvci5hZHZhbmNlLmJpbmQoY3Vyc29yKTtcbiAgICAgICAgICB2YXIgZG9UaHJvd0N1cnNvcklzTm90U3RhcnRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ3Vyc29yIG5vdCBzdGFydGVkXCIpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIGRvVGhyb3dDdXJzb3JJc1N0b3BwZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkN1cnNvciBub3Qgc3RvcHBlZFwiKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGN1cnNvci50cmFucyA9IHRyYW5zO1xuICAgICAgICAgIGN1cnNvci5zdG9wID0gY3Vyc29yLmNvbnRpbnVlID0gY3Vyc29yLmNvbnRpbnVlUHJpbWFyeUtleSA9IGN1cnNvci5hZHZhbmNlID0gZG9UaHJvd0N1cnNvcklzTm90U3RhcnRlZDtcbiAgICAgICAgICBjdXJzb3IuZmFpbCA9IHdyYXAocmVqZWN0KTtcbiAgICAgICAgICBjdXJzb3IubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHZhciBnb3RPbmUgPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBnb3RPbmUtLSA/IF90aGlzLmNvbnRpbnVlKCkgOiBfdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGN1cnNvci5zdGFydCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0aW9uUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmVJdGVyYXRpb24sIHJlamVjdEl0ZXJhdGlvbikge1xuICAgICAgICAgICAgICByZXNvbHZlSXRlcmF0aW9uID0gd3JhcChyZXNvbHZlSXRlcmF0aW9uKTtcbiAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0SXRlcmF0aW9uKTtcbiAgICAgICAgICAgICAgY3Vyc29yLmZhaWwgPSByZWplY3RJdGVyYXRpb247XG4gICAgICAgICAgICAgIGN1cnNvci5zdG9wID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjdXJzb3Iuc3RvcCA9IGN1cnNvci5jb250aW51ZSA9IGN1cnNvci5jb250aW51ZVByaW1hcnlLZXkgPSBjdXJzb3IuYWR2YW5jZSA9IGRvVGhyb3dDdXJzb3JJc1N0b3BwZWQ7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZUl0ZXJhdGlvbih2YWx1ZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBndWFyZGVkQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaWYgKHJlcS5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgIGN1cnNvci5mYWlsKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnNvci5kb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjdXJzb3Iuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkN1cnNvciBiZWhpbmQgbGFzdCBlbnRyeVwiKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGN1cnNvci5zdG9wKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXEub25zdWNjZXNzID0gd3JhcChmdW5jdGlvbihldjIpIHtcbiAgICAgICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IGd1YXJkZWRDYWxsYmFjaztcbiAgICAgICAgICAgICAgZ3VhcmRlZENhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSA9IF9jdXJzb3JDb250aW51ZTtcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZVByaW1hcnlLZXkgPSBfY3Vyc29yQ29udGludWVQcmltYXJ5S2V5O1xuICAgICAgICAgICAgY3Vyc29yLmFkdmFuY2UgPSBfY3Vyc29yQWR2YW5jZTtcbiAgICAgICAgICAgIGd1YXJkZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdGlvblByb21pc2U7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXNvbHZlKGN1cnNvcik7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcXVlcnkoaGFzR2V0QWxsMikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHJlc29sdmUgPSB3cmFwKHJlc29sdmUpO1xuICAgICAgICAgIHZhciB0cmFucyA9IHJlcXVlc3QudHJhbnMsIHZhbHVlcyA9IHJlcXVlc3QudmFsdWVzLCBsaW1pdCA9IHJlcXVlc3QubGltaXQsIHF1ZXJ5MiA9IHJlcXVlc3QucXVlcnk7XG4gICAgICAgICAgdmFyIG5vbkluZmluaXRMaW1pdCA9IGxpbWl0ID09PSBJbmZpbml0eSA/IHZvaWQgMCA6IGxpbWl0O1xuICAgICAgICAgIHZhciBpbmRleCA9IHF1ZXJ5Mi5pbmRleCwgcmFuZ2UgPSBxdWVyeTIucmFuZ2U7XG4gICAgICAgICAgdmFyIHN0b3JlID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVOYW1lKTtcbiAgICAgICAgICB2YXIgc291cmNlID0gaW5kZXguaXNQcmltYXJ5S2V5ID8gc3RvcmUgOiBzdG9yZS5pbmRleChpbmRleC5uYW1lKTtcbiAgICAgICAgICB2YXIgaWRiS2V5UmFuZ2UgPSBtYWtlSURCS2V5UmFuZ2UocmFuZ2UpO1xuICAgICAgICAgIGlmIChsaW1pdCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtyZXN1bHQ6IFtdfSk7XG4gICAgICAgICAgaWYgKGhhc0dldEFsbDIpIHtcbiAgICAgICAgICAgIHZhciByZXEgPSB2YWx1ZXMgPyBzb3VyY2UuZ2V0QWxsKGlkYktleVJhbmdlLCBub25JbmZpbml0TGltaXQpIDogc291cmNlLmdldEFsbEtleXMoaWRiS2V5UmFuZ2UsIG5vbkluZmluaXRMaW1pdCk7XG4gICAgICAgICAgICByZXEub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe3Jlc3VsdDogZXZlbnQudGFyZ2V0LnJlc3VsdH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb3VudF8xID0gMDtcbiAgICAgICAgICAgIHZhciByZXFfMSA9IHZhbHVlcyB8fCAhKFwib3BlbktleUN1cnNvclwiIGluIHNvdXJjZSkgPyBzb3VyY2Uub3BlbkN1cnNvcihpZGJLZXlSYW5nZSkgOiBzb3VyY2Uub3BlbktleUN1cnNvcihpZGJLZXlSYW5nZSk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0XzEgPSBbXTtcbiAgICAgICAgICAgIHJlcV8xLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIHZhciBjdXJzb3IgPSByZXFfMS5yZXN1bHQ7XG4gICAgICAgICAgICAgIGlmICghY3Vyc29yKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtyZXN1bHQ6IHJlc3VsdF8xfSk7XG4gICAgICAgICAgICAgIHJlc3VsdF8xLnB1c2godmFsdWVzID8gY3Vyc29yLnZhbHVlIDogY3Vyc29yLnByaW1hcnlLZXkpO1xuICAgICAgICAgICAgICBpZiAoKytjb3VudF8xID09PSBsaW1pdClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7cmVzdWx0OiByZXN1bHRfMX0pO1xuICAgICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXFfMS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiB0YWJsZU5hbWUsXG4gICAgICBzY2hlbWE6IHRhYmxlU2NoZW1hLFxuICAgICAgbXV0YXRlLFxuICAgICAgZ2V0TWFueTogZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgIHZhciB0cmFucyA9IF9hMy50cmFucywga2V5czIgPSBfYTMua2V5cztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHJlc29sdmUgPSB3cmFwKHJlc29sdmUpO1xuICAgICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlTmFtZSk7XG4gICAgICAgICAgdmFyIGxlbmd0aCA9IGtleXMyLmxlbmd0aDtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgdmFyIGtleUNvdW50ID0gMDtcbiAgICAgICAgICB2YXIgY2FsbGJhY2tDb3VudCA9IDA7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICB2YXIgc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIHJlcTIgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoKHJlc3VsdFtyZXEyLl9wb3NdID0gcmVxMi5yZXN1bHQpICE9IG51bGwpXG4gICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGlmICgrK2NhbGxiYWNrQ291bnQgPT09IGtleUNvdW50KVxuICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgZXJyb3JIYW5kbGVyID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXMyW2ldO1xuICAgICAgICAgICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlcSA9IHN0b3JlLmdldChrZXlzMltpXSk7XG4gICAgICAgICAgICAgIHJlcS5fcG9zID0gaTtcbiAgICAgICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IHN1Y2Nlc3NIYW5kbGVyO1xuICAgICAgICAgICAgICByZXEub25lcnJvciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgICAgICAgKytrZXlDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGtleUNvdW50ID09PSAwKVxuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXQ6IGZ1bmN0aW9uKF9hMykge1xuICAgICAgICB2YXIgdHJhbnMgPSBfYTMudHJhbnMsIGtleSA9IF9hMy5rZXk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICByZXNvbHZlID0gd3JhcChyZXNvbHZlKTtcbiAgICAgICAgICB2YXIgc3RvcmUgPSB0cmFucy5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICAgIHZhciByZXEgPSBzdG9yZS5nZXQoa2V5KTtcbiAgICAgICAgICByZXEub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgcXVlcnk6IHF1ZXJ5KGhhc0dldEFsbCksXG4gICAgICBvcGVuQ3Vyc29yOiBvcGVuQ3Vyc29yMixcbiAgICAgIGNvdW50OiBmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgdmFyIHF1ZXJ5MiA9IF9hMy5xdWVyeSwgdHJhbnMgPSBfYTMudHJhbnM7XG4gICAgICAgIHZhciBpbmRleCA9IHF1ZXJ5Mi5pbmRleCwgcmFuZ2UgPSBxdWVyeTIucmFuZ2U7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICB2YXIgc3RvcmUgPSB0cmFucy5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICAgIHZhciBzb3VyY2UgPSBpbmRleC5pc1ByaW1hcnlLZXkgPyBzdG9yZSA6IHN0b3JlLmluZGV4KGluZGV4Lm5hbWUpO1xuICAgICAgICAgIHZhciBpZGJLZXlSYW5nZSA9IG1ha2VJREJLZXlSYW5nZShyYW5nZSk7XG4gICAgICAgICAgdmFyIHJlcSA9IGlkYktleVJhbmdlID8gc291cmNlLmNvdW50KGlkYktleVJhbmdlKSA6IHNvdXJjZS5jb3VudCgpO1xuICAgICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSB3cmFwKGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShldi50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHZhciBfYTIgPSBleHRyYWN0U2NoZW1hKGRiLCB0bXBUcmFucyksIHNjaGVtYSA9IF9hMi5zY2hlbWEsIGhhc0dldEFsbCA9IF9hMi5oYXNHZXRBbGw7XG4gIHZhciB0YWJsZXMgPSBzY2hlbWEudGFibGVzLm1hcChmdW5jdGlvbih0YWJsZVNjaGVtYSkge1xuICAgIHJldHVybiBjcmVhdGVEYkNvcmVUYWJsZSh0YWJsZVNjaGVtYSk7XG4gIH0pO1xuICB2YXIgdGFibGVNYXAgPSB7fTtcbiAgdGFibGVzLmZvckVhY2goZnVuY3Rpb24odGFibGUpIHtcbiAgICByZXR1cm4gdGFibGVNYXBbdGFibGUubmFtZV0gPSB0YWJsZTtcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgc3RhY2s6IFwiZGJjb3JlXCIsXG4gICAgdHJhbnNhY3Rpb246IGRiLnRyYW5zYWN0aW9uLmJpbmQoZGIpLFxuICAgIHRhYmxlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGFibGVNYXBbbmFtZV07XG4gICAgICBpZiAoIXJlc3VsdClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGFibGUgJ1wiICsgbmFtZSArIFwiJyBub3QgZm91bmRcIik7XG4gICAgICByZXR1cm4gdGFibGVNYXBbbmFtZV07XG4gICAgfSxcbiAgICBjbXA6IGNtcDIsXG4gICAgTUlOX0tFWTogLUluZmluaXR5LFxuICAgIE1BWF9LRVk6IGdldE1heEtleShJZGJLZXlSYW5nZSksXG4gICAgc2NoZW1hXG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVNaWRkbGV3YXJlU3RhY2soc3RhY2tJbXBsLCBtaWRkbGV3YXJlcykge1xuICByZXR1cm4gbWlkZGxld2FyZXMucmVkdWNlKGZ1bmN0aW9uKGRvd24sIF9hMikge1xuICAgIHZhciBjcmVhdGUgPSBfYTIuY3JlYXRlO1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZG93biksIGNyZWF0ZShkb3duKSk7XG4gIH0sIHN0YWNrSW1wbCk7XG59XG5mdW5jdGlvbiBjcmVhdGVNaWRkbGV3YXJlU3RhY2tzKG1pZGRsZXdhcmVzLCBpZGJkYiwgX2EyLCB0bXBUcmFucykge1xuICB2YXIgSURCS2V5UmFuZ2UgPSBfYTIuSURCS2V5UmFuZ2UsIGluZGV4ZWREQiA9IF9hMi5pbmRleGVkREI7XG4gIHZhciBkYmNvcmUgPSBjcmVhdGVNaWRkbGV3YXJlU3RhY2soY3JlYXRlREJDb3JlKGlkYmRiLCBpbmRleGVkREIsIElEQktleVJhbmdlLCB0bXBUcmFucyksIG1pZGRsZXdhcmVzLmRiY29yZSk7XG4gIHJldHVybiB7XG4gICAgZGJjb3JlXG4gIH07XG59XG5mdW5jdGlvbiBnZW5lcmF0ZU1pZGRsZXdhcmVTdGFja3MoZGIsIHRtcFRyYW5zKSB7XG4gIHZhciBpZGJkYiA9IHRtcFRyYW5zLmRiO1xuICB2YXIgc3RhY2tzID0gY3JlYXRlTWlkZGxld2FyZVN0YWNrcyhkYi5fbWlkZGxld2FyZXMsIGlkYmRiLCBkYi5fZGVwcywgdG1wVHJhbnMpO1xuICBkYi5jb3JlID0gc3RhY2tzLmRiY29yZTtcbiAgZGIudGFibGVzLmZvckVhY2goZnVuY3Rpb24odGFibGUpIHtcbiAgICB2YXIgdGFibGVOYW1lID0gdGFibGUubmFtZTtcbiAgICBpZiAoZGIuY29yZS5zY2hlbWEudGFibGVzLnNvbWUoZnVuY3Rpb24odGJsKSB7XG4gICAgICByZXR1cm4gdGJsLm5hbWUgPT09IHRhYmxlTmFtZTtcbiAgICB9KSkge1xuICAgICAgdGFibGUuY29yZSA9IGRiLmNvcmUudGFibGUodGFibGVOYW1lKTtcbiAgICAgIGlmIChkYlt0YWJsZU5hbWVdIGluc3RhbmNlb2YgZGIuVGFibGUpIHtcbiAgICAgICAgZGJbdGFibGVOYW1lXS5jb3JlID0gdGFibGUuY29yZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gc2V0QXBpT25QbGFjZShkYiwgb2JqcywgdGFibGVOYW1lcywgZGJzY2hlbWEpIHtcbiAgdGFibGVOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgIHZhciBzY2hlbWEgPSBkYnNjaGVtYVt0YWJsZU5hbWVdO1xuICAgIG9ianMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBwcm9wRGVzYyA9IGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmosIHRhYmxlTmFtZSk7XG4gICAgICBpZiAoIXByb3BEZXNjIHx8IFwidmFsdWVcIiBpbiBwcm9wRGVzYyAmJiBwcm9wRGVzYy52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGlmIChvYmogPT09IGRiLlRyYW5zYWN0aW9uLnByb3RvdHlwZSB8fCBvYmogaW5zdGFuY2VvZiBkYi5UcmFuc2FjdGlvbikge1xuICAgICAgICAgIHNldFByb3Aob2JqLCB0YWJsZU5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCB0YWJsZU5hbWUsIHt2YWx1ZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ialt0YWJsZU5hbWVdID0gbmV3IGRiLlRhYmxlKHRhYmxlTmFtZSwgc2NoZW1hKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVRhYmxlc0FwaShkYiwgb2Jqcykge1xuICBvYmpzLmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKG9ialtrZXldIGluc3RhbmNlb2YgZGIuVGFibGUpXG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gbG93ZXJWZXJzaW9uRmlyc3QoYSwgYikge1xuICByZXR1cm4gYS5fY2ZnLnZlcnNpb24gLSBiLl9jZmcudmVyc2lvbjtcbn1cbmZ1bmN0aW9uIHJ1blVwZ3JhZGVycyhkYiwgb2xkVmVyc2lvbiwgaWRiVXBncmFkZVRyYW5zLCByZWplY3QpIHtcbiAgdmFyIGdsb2JhbFNjaGVtYSA9IGRiLl9kYlNjaGVtYTtcbiAgdmFyIHRyYW5zID0gZGIuX2NyZWF0ZVRyYW5zYWN0aW9uKFwicmVhZHdyaXRlXCIsIGRiLl9zdG9yZU5hbWVzLCBnbG9iYWxTY2hlbWEpO1xuICB0cmFucy5jcmVhdGUoaWRiVXBncmFkZVRyYW5zKTtcbiAgdHJhbnMuX2NvbXBsZXRpb24uY2F0Y2gocmVqZWN0KTtcbiAgdmFyIHJlamVjdFRyYW5zYWN0aW9uID0gdHJhbnMuX3JlamVjdC5iaW5kKHRyYW5zKTtcbiAgdmFyIHRyYW5zbGVzcyA9IFBTRC50cmFuc2xlc3MgfHwgUFNEO1xuICBuZXdTY29wZShmdW5jdGlvbigpIHtcbiAgICBQU0QudHJhbnMgPSB0cmFucztcbiAgICBQU0QudHJhbnNsZXNzID0gdHJhbnNsZXNzO1xuICAgIGlmIChvbGRWZXJzaW9uID09PSAwKSB7XG4gICAgICBrZXlzKGdsb2JhbFNjaGVtYSkuZm9yRWFjaChmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICAgICAgY3JlYXRlVGFibGUoaWRiVXBncmFkZVRyYW5zLCB0YWJsZU5hbWUsIGdsb2JhbFNjaGVtYVt0YWJsZU5hbWVdLnByaW1LZXksIGdsb2JhbFNjaGVtYVt0YWJsZU5hbWVdLmluZGV4ZXMpO1xuICAgICAgfSk7XG4gICAgICBnZW5lcmF0ZU1pZGRsZXdhcmVTdGFja3MoZGIsIGlkYlVwZ3JhZGVUcmFucyk7XG4gICAgICBEZXhpZVByb21pc2UuZm9sbG93KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZGIub24ucG9wdWxhdGUuZmlyZSh0cmFucyk7XG4gICAgICB9KS5jYXRjaChyZWplY3RUcmFuc2FjdGlvbik7XG4gICAgfSBlbHNlXG4gICAgICB1cGRhdGVUYWJsZXNBbmRJbmRleGVzKGRiLCBvbGRWZXJzaW9uLCB0cmFucywgaWRiVXBncmFkZVRyYW5zKS5jYXRjaChyZWplY3RUcmFuc2FjdGlvbik7XG4gIH0pO1xufVxuZnVuY3Rpb24gdXBkYXRlVGFibGVzQW5kSW5kZXhlcyhkYiwgb2xkVmVyc2lvbiwgdHJhbnMsIGlkYlVwZ3JhZGVUcmFucykge1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIHZlcnNpb25zID0gZGIuX3ZlcnNpb25zO1xuICB2YXIgZ2xvYmFsU2NoZW1hID0gZGIuX2RiU2NoZW1hID0gYnVpbGRHbG9iYWxTY2hlbWEoZGIsIGRiLmlkYmRiLCBpZGJVcGdyYWRlVHJhbnMpO1xuICB2YXIgYW55Q29udGVudFVwZ3JhZGVySGFzUnVuID0gZmFsc2U7XG4gIHZhciB2ZXJzVG9SdW4gPSB2ZXJzaW9ucy5maWx0ZXIoZnVuY3Rpb24odikge1xuICAgIHJldHVybiB2Ll9jZmcudmVyc2lvbiA+PSBvbGRWZXJzaW9uO1xuICB9KTtcbiAgdmVyc1RvUnVuLmZvckVhY2goZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHF1ZXVlLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2xkU2NoZW1hID0gZ2xvYmFsU2NoZW1hO1xuICAgICAgdmFyIG5ld1NjaGVtYSA9IHZlcnNpb24uX2NmZy5kYnNjaGVtYTtcbiAgICAgIGFkanVzdFRvRXhpc3RpbmdJbmRleE5hbWVzKGRiLCBvbGRTY2hlbWEsIGlkYlVwZ3JhZGVUcmFucyk7XG4gICAgICBhZGp1c3RUb0V4aXN0aW5nSW5kZXhOYW1lcyhkYiwgbmV3U2NoZW1hLCBpZGJVcGdyYWRlVHJhbnMpO1xuICAgICAgZ2xvYmFsU2NoZW1hID0gZGIuX2RiU2NoZW1hID0gbmV3U2NoZW1hO1xuICAgICAgdmFyIGRpZmYgPSBnZXRTY2hlbWFEaWZmKG9sZFNjaGVtYSwgbmV3U2NoZW1hKTtcbiAgICAgIGRpZmYuYWRkLmZvckVhY2goZnVuY3Rpb24odHVwbGUpIHtcbiAgICAgICAgY3JlYXRlVGFibGUoaWRiVXBncmFkZVRyYW5zLCB0dXBsZVswXSwgdHVwbGVbMV0ucHJpbUtleSwgdHVwbGVbMV0uaW5kZXhlcyk7XG4gICAgICB9KTtcbiAgICAgIGRpZmYuY2hhbmdlLmZvckVhY2goZnVuY3Rpb24oY2hhbmdlKSB7XG4gICAgICAgIGlmIChjaGFuZ2UucmVjcmVhdGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5VcGdyYWRlKFwiTm90IHlldCBzdXBwb3J0IGZvciBjaGFuZ2luZyBwcmltYXJ5IGtleVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc3RvcmVfMSA9IGlkYlVwZ3JhZGVUcmFucy5vYmplY3RTdG9yZShjaGFuZ2UubmFtZSk7XG4gICAgICAgICAgY2hhbmdlLmFkZC5mb3JFYWNoKGZ1bmN0aW9uKGlkeCkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZEluZGV4KHN0b3JlXzEsIGlkeCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2hhbmdlLmNoYW5nZS5mb3JFYWNoKGZ1bmN0aW9uKGlkeCkge1xuICAgICAgICAgICAgc3RvcmVfMS5kZWxldGVJbmRleChpZHgubmFtZSk7XG4gICAgICAgICAgICBhZGRJbmRleChzdG9yZV8xLCBpZHgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNoYW5nZS5kZWwuZm9yRWFjaChmdW5jdGlvbihpZHhOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVfMS5kZWxldGVJbmRleChpZHhOYW1lKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgY29udGVudFVwZ3JhZGUgPSB2ZXJzaW9uLl9jZmcuY29udGVudFVwZ3JhZGU7XG4gICAgICBpZiAoY29udGVudFVwZ3JhZGUgJiYgdmVyc2lvbi5fY2ZnLnZlcnNpb24gPiBvbGRWZXJzaW9uKSB7XG4gICAgICAgIGdlbmVyYXRlTWlkZGxld2FyZVN0YWNrcyhkYiwgaWRiVXBncmFkZVRyYW5zKTtcbiAgICAgICAgdHJhbnMuX21lbW9pemVkVGFibGVzID0ge307XG4gICAgICAgIGFueUNvbnRlbnRVcGdyYWRlckhhc1J1biA9IHRydWU7XG4gICAgICAgIHZhciB1cGdyYWRlU2NoZW1hXzEgPSBzaGFsbG93Q2xvbmUobmV3U2NoZW1hKTtcbiAgICAgICAgZGlmZi5kZWwuZm9yRWFjaChmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICAgIHVwZ3JhZGVTY2hlbWFfMVt0YWJsZV0gPSBvbGRTY2hlbWFbdGFibGVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVtb3ZlVGFibGVzQXBpKGRiLCBbZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlXSk7XG4gICAgICAgIHNldEFwaU9uUGxhY2UoZGIsIFtkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGVdLCBrZXlzKHVwZ3JhZGVTY2hlbWFfMSksIHVwZ3JhZGVTY2hlbWFfMSk7XG4gICAgICAgIHRyYW5zLnNjaGVtYSA9IHVwZ3JhZGVTY2hlbWFfMTtcbiAgICAgICAgdmFyIGNvbnRlbnRVcGdyYWRlSXNBc3luY18xID0gaXNBc3luY0Z1bmN0aW9uKGNvbnRlbnRVcGdyYWRlKTtcbiAgICAgICAgaWYgKGNvbnRlbnRVcGdyYWRlSXNBc3luY18xKSB7XG4gICAgICAgICAgaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0dXJuVmFsdWVfMTtcbiAgICAgICAgdmFyIHByb21pc2VGb2xsb3dlZCA9IERleGllUHJvbWlzZS5mb2xsb3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWVfMSA9IGNvbnRlbnRVcGdyYWRlKHRyYW5zKTtcbiAgICAgICAgICBpZiAocmV0dXJuVmFsdWVfMSkge1xuICAgICAgICAgICAgaWYgKGNvbnRlbnRVcGdyYWRlSXNBc3luY18xKSB7XG4gICAgICAgICAgICAgIHZhciBkZWNyZW1lbnRvciA9IGRlY3JlbWVudEV4cGVjdGVkQXdhaXRzLmJpbmQobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgIHJldHVyblZhbHVlXzEudGhlbihkZWNyZW1lbnRvciwgZGVjcmVtZW50b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZV8xICYmIHR5cGVvZiByZXR1cm5WYWx1ZV8xLnRoZW4gPT09IFwiZnVuY3Rpb25cIiA/IERleGllUHJvbWlzZS5yZXNvbHZlKHJldHVyblZhbHVlXzEpIDogcHJvbWlzZUZvbGxvd2VkLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlXzE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHF1ZXVlLnB1c2goZnVuY3Rpb24oaWRidHJhbnMpIHtcbiAgICAgIGlmICghYW55Q29udGVudFVwZ3JhZGVySGFzUnVuIHx8ICFoYXNJRURlbGV0ZU9iamVjdFN0b3JlQnVnKSB7XG4gICAgICAgIHZhciBuZXdTY2hlbWEgPSB2ZXJzaW9uLl9jZmcuZGJzY2hlbWE7XG4gICAgICAgIGRlbGV0ZVJlbW92ZWRUYWJsZXMobmV3U2NoZW1hLCBpZGJ0cmFucyk7XG4gICAgICB9XG4gICAgICByZW1vdmVUYWJsZXNBcGkoZGIsIFtkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGVdKTtcbiAgICAgIHNldEFwaU9uUGxhY2UoZGIsIFtkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGVdLCBkYi5fc3RvcmVOYW1lcywgZGIuX2RiU2NoZW1hKTtcbiAgICAgIHRyYW5zLnNjaGVtYSA9IGRiLl9kYlNjaGVtYTtcbiAgICB9KTtcbiAgfSk7XG4gIGZ1bmN0aW9uIHJ1blF1ZXVlKCkge1xuICAgIHJldHVybiBxdWV1ZS5sZW5ndGggPyBEZXhpZVByb21pc2UucmVzb2x2ZShxdWV1ZS5zaGlmdCgpKHRyYW5zLmlkYnRyYW5zKSkudGhlbihydW5RdWV1ZSkgOiBEZXhpZVByb21pc2UucmVzb2x2ZSgpO1xuICB9XG4gIHJldHVybiBydW5RdWV1ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgY3JlYXRlTWlzc2luZ1RhYmxlcyhnbG9iYWxTY2hlbWEsIGlkYlVwZ3JhZGVUcmFucyk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0U2NoZW1hRGlmZihvbGRTY2hlbWEsIG5ld1NjaGVtYSkge1xuICB2YXIgZGlmZiA9IHtcbiAgICBkZWw6IFtdLFxuICAgIGFkZDogW10sXG4gICAgY2hhbmdlOiBbXVxuICB9O1xuICB2YXIgdGFibGU7XG4gIGZvciAodGFibGUgaW4gb2xkU2NoZW1hKSB7XG4gICAgaWYgKCFuZXdTY2hlbWFbdGFibGVdKVxuICAgICAgZGlmZi5kZWwucHVzaCh0YWJsZSk7XG4gIH1cbiAgZm9yICh0YWJsZSBpbiBuZXdTY2hlbWEpIHtcbiAgICB2YXIgb2xkRGVmID0gb2xkU2NoZW1hW3RhYmxlXSwgbmV3RGVmID0gbmV3U2NoZW1hW3RhYmxlXTtcbiAgICBpZiAoIW9sZERlZikge1xuICAgICAgZGlmZi5hZGQucHVzaChbdGFibGUsIG5ld0RlZl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICBuYW1lOiB0YWJsZSxcbiAgICAgICAgZGVmOiBuZXdEZWYsXG4gICAgICAgIHJlY3JlYXRlOiBmYWxzZSxcbiAgICAgICAgZGVsOiBbXSxcbiAgICAgICAgYWRkOiBbXSxcbiAgICAgICAgY2hhbmdlOiBbXVxuICAgICAgfTtcbiAgICAgIGlmIChcIlwiICsgKG9sZERlZi5wcmltS2V5LmtleVBhdGggfHwgXCJcIikgIT09IFwiXCIgKyAobmV3RGVmLnByaW1LZXkua2V5UGF0aCB8fCBcIlwiKSB8fCBvbGREZWYucHJpbUtleS5hdXRvICE9PSBuZXdEZWYucHJpbUtleS5hdXRvICYmICFpc0lFT3JFZGdlKSB7XG4gICAgICAgIGNoYW5nZS5yZWNyZWF0ZSA9IHRydWU7XG4gICAgICAgIGRpZmYuY2hhbmdlLnB1c2goY2hhbmdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBvbGRJbmRleGVzID0gb2xkRGVmLmlkeEJ5TmFtZTtcbiAgICAgICAgdmFyIG5ld0luZGV4ZXMgPSBuZXdEZWYuaWR4QnlOYW1lO1xuICAgICAgICB2YXIgaWR4TmFtZSA9IHZvaWQgMDtcbiAgICAgICAgZm9yIChpZHhOYW1lIGluIG9sZEluZGV4ZXMpIHtcbiAgICAgICAgICBpZiAoIW5ld0luZGV4ZXNbaWR4TmFtZV0pXG4gICAgICAgICAgICBjaGFuZ2UuZGVsLnB1c2goaWR4TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpZHhOYW1lIGluIG5ld0luZGV4ZXMpIHtcbiAgICAgICAgICB2YXIgb2xkSWR4ID0gb2xkSW5kZXhlc1tpZHhOYW1lXSwgbmV3SWR4ID0gbmV3SW5kZXhlc1tpZHhOYW1lXTtcbiAgICAgICAgICBpZiAoIW9sZElkeClcbiAgICAgICAgICAgIGNoYW5nZS5hZGQucHVzaChuZXdJZHgpO1xuICAgICAgICAgIGVsc2UgaWYgKG9sZElkeC5zcmMgIT09IG5ld0lkeC5zcmMpXG4gICAgICAgICAgICBjaGFuZ2UuY2hhbmdlLnB1c2gobmV3SWR4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlLmRlbC5sZW5ndGggPiAwIHx8IGNoYW5nZS5hZGQubGVuZ3RoID4gMCB8fCBjaGFuZ2UuY2hhbmdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkaWZmLmNoYW5nZS5wdXNoKGNoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRpZmY7XG59XG5mdW5jdGlvbiBjcmVhdGVUYWJsZShpZGJ0cmFucywgdGFibGVOYW1lLCBwcmltS2V5LCBpbmRleGVzKSB7XG4gIHZhciBzdG9yZSA9IGlkYnRyYW5zLmRiLmNyZWF0ZU9iamVjdFN0b3JlKHRhYmxlTmFtZSwgcHJpbUtleS5rZXlQYXRoID8ge2tleVBhdGg6IHByaW1LZXkua2V5UGF0aCwgYXV0b0luY3JlbWVudDogcHJpbUtleS5hdXRvfSA6IHthdXRvSW5jcmVtZW50OiBwcmltS2V5LmF1dG99KTtcbiAgaW5kZXhlcy5mb3JFYWNoKGZ1bmN0aW9uKGlkeCkge1xuICAgIHJldHVybiBhZGRJbmRleChzdG9yZSwgaWR4KTtcbiAgfSk7XG4gIHJldHVybiBzdG9yZTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1pc3NpbmdUYWJsZXMobmV3U2NoZW1hLCBpZGJ0cmFucykge1xuICBrZXlzKG5ld1NjaGVtYSkuZm9yRWFjaChmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICBpZiAoIWlkYnRyYW5zLmRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnModGFibGVOYW1lKSkge1xuICAgICAgY3JlYXRlVGFibGUoaWRidHJhbnMsIHRhYmxlTmFtZSwgbmV3U2NoZW1hW3RhYmxlTmFtZV0ucHJpbUtleSwgbmV3U2NoZW1hW3RhYmxlTmFtZV0uaW5kZXhlcyk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZVJlbW92ZWRUYWJsZXMobmV3U2NoZW1hLCBpZGJ0cmFucykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlkYnRyYW5zLmRiLm9iamVjdFN0b3JlTmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgc3RvcmVOYW1lID0gaWRidHJhbnMuZGIub2JqZWN0U3RvcmVOYW1lc1tpXTtcbiAgICBpZiAobmV3U2NoZW1hW3N0b3JlTmFtZV0gPT0gbnVsbCkge1xuICAgICAgaWRidHJhbnMuZGIuZGVsZXRlT2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGFkZEluZGV4KHN0b3JlLCBpZHgpIHtcbiAgc3RvcmUuY3JlYXRlSW5kZXgoaWR4Lm5hbWUsIGlkeC5rZXlQYXRoLCB7dW5pcXVlOiBpZHgudW5pcXVlLCBtdWx0aUVudHJ5OiBpZHgubXVsdGl9KTtcbn1cbmZ1bmN0aW9uIGJ1aWxkR2xvYmFsU2NoZW1hKGRiLCBpZGJkYiwgdG1wVHJhbnMpIHtcbiAgdmFyIGdsb2JhbFNjaGVtYSA9IHt9O1xuICB2YXIgZGJTdG9yZU5hbWVzID0gc2xpY2UoaWRiZGIub2JqZWN0U3RvcmVOYW1lcywgMCk7XG4gIGRiU3RvcmVOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xuICAgIHZhciBzdG9yZSA9IHRtcFRyYW5zLm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgdmFyIGtleVBhdGggPSBzdG9yZS5rZXlQYXRoO1xuICAgIHZhciBwcmltS2V5ID0gY3JlYXRlSW5kZXhTcGVjKG5hbWVGcm9tS2V5UGF0aChrZXlQYXRoKSwga2V5UGF0aCB8fCBcIlwiLCBmYWxzZSwgZmFsc2UsICEhc3RvcmUuYXV0b0luY3JlbWVudCwga2V5UGF0aCAmJiB0eXBlb2Yga2V5UGF0aCAhPT0gXCJzdHJpbmdcIiwgdHJ1ZSk7XG4gICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0b3JlLmluZGV4TmFtZXMubGVuZ3RoOyArK2opIHtcbiAgICAgIHZhciBpZGJpbmRleCA9IHN0b3JlLmluZGV4KHN0b3JlLmluZGV4TmFtZXNbal0pO1xuICAgICAga2V5UGF0aCA9IGlkYmluZGV4LmtleVBhdGg7XG4gICAgICB2YXIgaW5kZXggPSBjcmVhdGVJbmRleFNwZWMoaWRiaW5kZXgubmFtZSwga2V5UGF0aCwgISFpZGJpbmRleC51bmlxdWUsICEhaWRiaW5kZXgubXVsdGlFbnRyeSwgZmFsc2UsIGtleVBhdGggJiYgdHlwZW9mIGtleVBhdGggIT09IFwic3RyaW5nXCIsIGZhbHNlKTtcbiAgICAgIGluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIGdsb2JhbFNjaGVtYVtzdG9yZU5hbWVdID0gY3JlYXRlVGFibGVTY2hlbWEoc3RvcmVOYW1lLCBwcmltS2V5LCBpbmRleGVzKTtcbiAgfSk7XG4gIHJldHVybiBnbG9iYWxTY2hlbWE7XG59XG5mdW5jdGlvbiByZWFkR2xvYmFsU2NoZW1hKGRiLCBpZGJkYiwgdG1wVHJhbnMpIHtcbiAgZGIudmVybm8gPSBpZGJkYi52ZXJzaW9uIC8gMTA7XG4gIHZhciBnbG9iYWxTY2hlbWEgPSBkYi5fZGJTY2hlbWEgPSBidWlsZEdsb2JhbFNjaGVtYShkYiwgaWRiZGIsIHRtcFRyYW5zKTtcbiAgZGIuX3N0b3JlTmFtZXMgPSBzbGljZShpZGJkYi5vYmplY3RTdG9yZU5hbWVzLCAwKTtcbiAgc2V0QXBpT25QbGFjZShkYiwgW2RiLl9hbGxUYWJsZXNdLCBrZXlzKGdsb2JhbFNjaGVtYSksIGdsb2JhbFNjaGVtYSk7XG59XG5mdW5jdGlvbiB2ZXJpZnlJbnN0YWxsZWRTY2hlbWEoZGIsIHRtcFRyYW5zKSB7XG4gIHZhciBpbnN0YWxsZWRTY2hlbWEgPSBidWlsZEdsb2JhbFNjaGVtYShkYiwgZGIuaWRiZGIsIHRtcFRyYW5zKTtcbiAgdmFyIGRpZmYgPSBnZXRTY2hlbWFEaWZmKGluc3RhbGxlZFNjaGVtYSwgZGIuX2RiU2NoZW1hKTtcbiAgcmV0dXJuICEoZGlmZi5hZGQubGVuZ3RoIHx8IGRpZmYuY2hhbmdlLnNvbWUoZnVuY3Rpb24oY2gpIHtcbiAgICByZXR1cm4gY2guYWRkLmxlbmd0aCB8fCBjaC5jaGFuZ2UubGVuZ3RoO1xuICB9KSk7XG59XG5mdW5jdGlvbiBhZGp1c3RUb0V4aXN0aW5nSW5kZXhOYW1lcyhkYiwgc2NoZW1hLCBpZGJ0cmFucykge1xuICB2YXIgc3RvcmVOYW1lcyA9IGlkYnRyYW5zLmRiLm9iamVjdFN0b3JlTmFtZXM7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcmVOYW1lcy5sZW5ndGg7ICsraSkge1xuICAgIHZhciBzdG9yZU5hbWUgPSBzdG9yZU5hbWVzW2ldO1xuICAgIHZhciBzdG9yZSA9IGlkYnRyYW5zLm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgZGIuX2hhc0dldEFsbCA9IFwiZ2V0QWxsXCIgaW4gc3RvcmU7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdG9yZS5pbmRleE5hbWVzLmxlbmd0aDsgKytqKSB7XG4gICAgICB2YXIgaW5kZXhOYW1lID0gc3RvcmUuaW5kZXhOYW1lc1tqXTtcbiAgICAgIHZhciBrZXlQYXRoID0gc3RvcmUuaW5kZXgoaW5kZXhOYW1lKS5rZXlQYXRoO1xuICAgICAgdmFyIGRleGllTmFtZSA9IHR5cGVvZiBrZXlQYXRoID09PSBcInN0cmluZ1wiID8ga2V5UGF0aCA6IFwiW1wiICsgc2xpY2Uoa2V5UGF0aCkuam9pbihcIitcIikgKyBcIl1cIjtcbiAgICAgIGlmIChzY2hlbWFbc3RvcmVOYW1lXSkge1xuICAgICAgICB2YXIgaW5kZXhTcGVjID0gc2NoZW1hW3N0b3JlTmFtZV0uaWR4QnlOYW1lW2RleGllTmFtZV07XG4gICAgICAgIGlmIChpbmRleFNwZWMpIHtcbiAgICAgICAgICBpbmRleFNwZWMubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgICBkZWxldGUgc2NoZW1hW3N0b3JlTmFtZV0uaWR4QnlOYW1lW2RleGllTmFtZV07XG4gICAgICAgICAgc2NoZW1hW3N0b3JlTmFtZV0uaWR4QnlOYW1lW2luZGV4TmFtZV0gPSBpbmRleFNwZWM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhLyhDaHJvbWVcXC98RWRnZVxcLykvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgX2dsb2JhbC5Xb3JrZXJHbG9iYWxTY29wZSAmJiBfZ2xvYmFsIGluc3RhbmNlb2YgX2dsb2JhbC5Xb3JrZXJHbG9iYWxTY29wZSAmJiBbXS5jb25jYXQobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvU2FmYXJpXFwvKFxcZCopLykpWzFdIDwgNjA0KSB7XG4gICAgZGIuX2hhc0dldEFsbCA9IGZhbHNlO1xuICB9XG59XG5mdW5jdGlvbiBwYXJzZUluZGV4U3ludGF4KHByaW1LZXlBbmRJbmRleGVzKSB7XG4gIHJldHVybiBwcmltS2V5QW5kSW5kZXhlcy5zcGxpdChcIixcIikubWFwKGZ1bmN0aW9uKGluZGV4LCBpbmRleE51bSkge1xuICAgIGluZGV4ID0gaW5kZXgudHJpbSgpO1xuICAgIHZhciBuYW1lID0gaW5kZXgucmVwbGFjZSgvKFsmKl18XFwrXFwrKS9nLCBcIlwiKTtcbiAgICB2YXIga2V5UGF0aCA9IC9eXFxbLy50ZXN0KG5hbWUpID8gbmFtZS5tYXRjaCgvXlxcWyguKilcXF0kLylbMV0uc3BsaXQoXCIrXCIpIDogbmFtZTtcbiAgICByZXR1cm4gY3JlYXRlSW5kZXhTcGVjKG5hbWUsIGtleVBhdGggfHwgbnVsbCwgL1xcJi8udGVzdChpbmRleCksIC9cXCovLnRlc3QoaW5kZXgpLCAvXFwrXFwrLy50ZXN0KGluZGV4KSwgaXNBcnJheShrZXlQYXRoKSwgaW5kZXhOdW0gPT09IDApO1xuICB9KTtcbn1cbnZhciBWZXJzaW9uID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFZlcnNpb24yKCkge1xuICB9XG4gIFZlcnNpb24yLnByb3RvdHlwZS5fcGFyc2VTdG9yZXNTcGVjID0gZnVuY3Rpb24oc3RvcmVzLCBvdXRTY2hlbWEpIHtcbiAgICBrZXlzKHN0b3JlcykuZm9yRWFjaChmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICAgIGlmIChzdG9yZXNbdGFibGVOYW1lXSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgaW5kZXhlcyA9IHBhcnNlSW5kZXhTeW50YXgoc3RvcmVzW3RhYmxlTmFtZV0pO1xuICAgICAgICB2YXIgcHJpbUtleSA9IGluZGV4ZXMuc2hpZnQoKTtcbiAgICAgICAgaWYgKHByaW1LZXkubXVsdGkpXG4gICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU2NoZW1hKFwiUHJpbWFyeSBrZXkgY2Fubm90IGJlIG11bHRpLXZhbHVlZFwiKTtcbiAgICAgICAgaW5kZXhlcy5mb3JFYWNoKGZ1bmN0aW9uKGlkeCkge1xuICAgICAgICAgIGlmIChpZHguYXV0bylcbiAgICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlNjaGVtYShcIk9ubHkgcHJpbWFyeSBrZXkgY2FuIGJlIG1hcmtlZCBhcyBhdXRvSW5jcmVtZW50ICgrKylcIik7XG4gICAgICAgICAgaWYgKCFpZHgua2V5UGF0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlNjaGVtYShcIkluZGV4IG11c3QgaGF2ZSBhIG5hbWUgYW5kIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmdcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBvdXRTY2hlbWFbdGFibGVOYW1lXSA9IGNyZWF0ZVRhYmxlU2NoZW1hKHRhYmxlTmFtZSwgcHJpbUtleSwgaW5kZXhlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIFZlcnNpb24yLnByb3RvdHlwZS5zdG9yZXMgPSBmdW5jdGlvbihzdG9yZXMpIHtcbiAgICB2YXIgZGIgPSB0aGlzLmRiO1xuICAgIHRoaXMuX2NmZy5zdG9yZXNTb3VyY2UgPSB0aGlzLl9jZmcuc3RvcmVzU291cmNlID8gZXh0ZW5kKHRoaXMuX2NmZy5zdG9yZXNTb3VyY2UsIHN0b3JlcykgOiBzdG9yZXM7XG4gICAgdmFyIHZlcnNpb25zID0gZGIuX3ZlcnNpb25zO1xuICAgIHZhciBzdG9yZXNTcGVjID0ge307XG4gICAgdmFyIGRic2NoZW1hID0ge307XG4gICAgdmVyc2lvbnMuZm9yRWFjaChmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgICBleHRlbmQoc3RvcmVzU3BlYywgdmVyc2lvbi5fY2ZnLnN0b3Jlc1NvdXJjZSk7XG4gICAgICBkYnNjaGVtYSA9IHZlcnNpb24uX2NmZy5kYnNjaGVtYSA9IHt9O1xuICAgICAgdmVyc2lvbi5fcGFyc2VTdG9yZXNTcGVjKHN0b3Jlc1NwZWMsIGRic2NoZW1hKTtcbiAgICB9KTtcbiAgICBkYi5fZGJTY2hlbWEgPSBkYnNjaGVtYTtcbiAgICByZW1vdmVUYWJsZXNBcGkoZGIsIFtkYi5fYWxsVGFibGVzLCBkYiwgZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlXSk7XG4gICAgc2V0QXBpT25QbGFjZShkYiwgW2RiLl9hbGxUYWJsZXMsIGRiLCBkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGUsIHRoaXMuX2NmZy50YWJsZXNdLCBrZXlzKGRic2NoZW1hKSwgZGJzY2hlbWEpO1xuICAgIGRiLl9zdG9yZU5hbWVzID0ga2V5cyhkYnNjaGVtYSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIFZlcnNpb24yLnByb3RvdHlwZS51cGdyYWRlID0gZnVuY3Rpb24odXBncmFkZUZ1bmN0aW9uKSB7XG4gICAgdGhpcy5fY2ZnLmNvbnRlbnRVcGdyYWRlID0gdXBncmFkZUZ1bmN0aW9uO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICByZXR1cm4gVmVyc2lvbjI7XG59KCk7XG5mdW5jdGlvbiBjcmVhdGVWZXJzaW9uQ29uc3RydWN0b3IoZGIpIHtcbiAgcmV0dXJuIG1ha2VDbGFzc0NvbnN0cnVjdG9yKFZlcnNpb24ucHJvdG90eXBlLCBmdW5jdGlvbiBWZXJzaW9uMih2ZXJzaW9uTnVtYmVyKSB7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHRoaXMuX2NmZyA9IHtcbiAgICAgIHZlcnNpb246IHZlcnNpb25OdW1iZXIsXG4gICAgICBzdG9yZXNTb3VyY2U6IG51bGwsXG4gICAgICBkYnNjaGVtYToge30sXG4gICAgICB0YWJsZXM6IHt9LFxuICAgICAgY29udGVudFVwZ3JhZGU6IG51bGxcbiAgICB9O1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldERiTmFtZXNUYWJsZShpbmRleGVkREIsIElEQktleVJhbmdlKSB7XG4gIHZhciBkYk5hbWVzREIgPSBpbmRleGVkREJbXCJfZGJOYW1lc0RCXCJdO1xuICBpZiAoIWRiTmFtZXNEQikge1xuICAgIGRiTmFtZXNEQiA9IGluZGV4ZWREQltcIl9kYk5hbWVzREJcIl0gPSBuZXcgRGV4aWUkMShEQk5BTUVTX0RCLCB7XG4gICAgICBhZGRvbnM6IFtdLFxuICAgICAgaW5kZXhlZERCLFxuICAgICAgSURCS2V5UmFuZ2VcbiAgICB9KTtcbiAgICBkYk5hbWVzREIudmVyc2lvbigxKS5zdG9yZXMoe2RibmFtZXM6IFwibmFtZVwifSk7XG4gIH1cbiAgcmV0dXJuIGRiTmFtZXNEQi50YWJsZShcImRibmFtZXNcIik7XG59XG5mdW5jdGlvbiBoYXNEYXRhYmFzZXNOYXRpdmUoaW5kZXhlZERCKSB7XG4gIHJldHVybiBpbmRleGVkREIgJiYgdHlwZW9mIGluZGV4ZWREQi5kYXRhYmFzZXMgPT09IFwiZnVuY3Rpb25cIjtcbn1cbmZ1bmN0aW9uIGdldERhdGFiYXNlTmFtZXMoX2EyKSB7XG4gIHZhciBpbmRleGVkREIgPSBfYTIuaW5kZXhlZERCLCBJREJLZXlSYW5nZSA9IF9hMi5JREJLZXlSYW5nZTtcbiAgcmV0dXJuIGhhc0RhdGFiYXNlc05hdGl2ZShpbmRleGVkREIpID8gUHJvbWlzZS5yZXNvbHZlKGluZGV4ZWREQi5kYXRhYmFzZXMoKSkudGhlbihmdW5jdGlvbihpbmZvcykge1xuICAgIHJldHVybiBpbmZvcy5tYXAoZnVuY3Rpb24oaW5mbykge1xuICAgICAgcmV0dXJuIGluZm8ubmFtZTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUgIT09IERCTkFNRVNfREI7XG4gICAgfSk7XG4gIH0pIDogZ2V0RGJOYW1lc1RhYmxlKGluZGV4ZWREQiwgSURCS2V5UmFuZ2UpLnRvQ29sbGVjdGlvbigpLnByaW1hcnlLZXlzKCk7XG59XG5mdW5jdGlvbiBfb25EYXRhYmFzZUNyZWF0ZWQoX2EyLCBuYW1lKSB7XG4gIHZhciBpbmRleGVkREIgPSBfYTIuaW5kZXhlZERCLCBJREJLZXlSYW5nZSA9IF9hMi5JREJLZXlSYW5nZTtcbiAgIWhhc0RhdGFiYXNlc05hdGl2ZShpbmRleGVkREIpICYmIG5hbWUgIT09IERCTkFNRVNfREIgJiYgZ2V0RGJOYW1lc1RhYmxlKGluZGV4ZWREQiwgSURCS2V5UmFuZ2UpLnB1dCh7bmFtZX0pLmNhdGNoKG5vcCk7XG59XG5mdW5jdGlvbiBfb25EYXRhYmFzZURlbGV0ZWQoX2EyLCBuYW1lKSB7XG4gIHZhciBpbmRleGVkREIgPSBfYTIuaW5kZXhlZERCLCBJREJLZXlSYW5nZSA9IF9hMi5JREJLZXlSYW5nZTtcbiAgIWhhc0RhdGFiYXNlc05hdGl2ZShpbmRleGVkREIpICYmIG5hbWUgIT09IERCTkFNRVNfREIgJiYgZ2V0RGJOYW1lc1RhYmxlKGluZGV4ZWREQiwgSURCS2V5UmFuZ2UpLmRlbGV0ZShuYW1lKS5jYXRjaChub3ApO1xufVxuZnVuY3Rpb24gdmlwKGZuKSB7XG4gIHJldHVybiBuZXdTY29wZShmdW5jdGlvbigpIHtcbiAgICBQU0QubGV0VGhyb3VnaCA9IHRydWU7XG4gICAgcmV0dXJuIGZuKCk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZGV4aWVPcGVuKGRiKSB7XG4gIHZhciBzdGF0ZSA9IGRiLl9zdGF0ZTtcbiAgdmFyIGluZGV4ZWREQiA9IGRiLl9kZXBzLmluZGV4ZWREQjtcbiAgaWYgKHN0YXRlLmlzQmVpbmdPcGVuZWQgfHwgZGIuaWRiZGIpXG4gICAgcmV0dXJuIHN0YXRlLmRiUmVhZHlQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3RhdGUuZGJPcGVuRXJyb3IgPyByZWplY3Rpb24oc3RhdGUuZGJPcGVuRXJyb3IpIDogZGI7XG4gICAgfSk7XG4gIGRlYnVnICYmIChzdGF0ZS5vcGVuQ2FuY2VsbGVyLl9zdGFja0hvbGRlciA9IGdldEVycm9yV2l0aFN0YWNrKCkpO1xuICBzdGF0ZS5pc0JlaW5nT3BlbmVkID0gdHJ1ZTtcbiAgc3RhdGUuZGJPcGVuRXJyb3IgPSBudWxsO1xuICBzdGF0ZS5vcGVuQ29tcGxldGUgPSBmYWxzZTtcbiAgdmFyIHJlc29sdmVEYlJlYWR5ID0gc3RhdGUuZGJSZWFkeVJlc29sdmUsIHVwZ3JhZGVUcmFuc2FjdGlvbiA9IG51bGwsIHdhc0NyZWF0ZWQgPSBmYWxzZTtcbiAgcmV0dXJuIERleGllUHJvbWlzZS5yYWNlKFtzdGF0ZS5vcGVuQ2FuY2VsbGVyLCBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaW5kZXhlZERCKVxuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTWlzc2luZ0FQSSgpO1xuICAgIHZhciBkYk5hbWUgPSBkYi5uYW1lO1xuICAgIHZhciByZXEgPSBzdGF0ZS5hdXRvU2NoZW1hID8gaW5kZXhlZERCLm9wZW4oZGJOYW1lKSA6IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgTWF0aC5yb3VuZChkYi52ZXJubyAqIDEwKSk7XG4gICAgaWYgKCFyZXEpXG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5NaXNzaW5nQVBJKCk7XG4gICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICByZXEub25ibG9ja2VkID0gd3JhcChkYi5fZmlyZU9uQmxvY2tlZCk7XG4gICAgcmVxLm9udXBncmFkZW5lZWRlZCA9IHdyYXAoZnVuY3Rpb24oZSkge1xuICAgICAgdXBncmFkZVRyYW5zYWN0aW9uID0gcmVxLnRyYW5zYWN0aW9uO1xuICAgICAgaWYgKHN0YXRlLmF1dG9TY2hlbWEgJiYgIWRiLl9vcHRpb25zLmFsbG93RW1wdHlEQikge1xuICAgICAgICByZXEub25lcnJvciA9IHByZXZlbnREZWZhdWx0O1xuICAgICAgICB1cGdyYWRlVHJhbnNhY3Rpb24uYWJvcnQoKTtcbiAgICAgICAgcmVxLnJlc3VsdC5jbG9zZSgpO1xuICAgICAgICB2YXIgZGVscmVxID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKGRiTmFtZSk7XG4gICAgICAgIGRlbHJlcS5vbnN1Y2Nlc3MgPSBkZWxyZXEub25lcnJvciA9IHdyYXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBleGNlcHRpb25zLk5vU3VjaERhdGFiYXNlKFwiRGF0YWJhc2UgXCIgKyBkYk5hbWUgKyBcIiBkb2VzbnQgZXhpc3RcIikpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZ3JhZGVUcmFuc2FjdGlvbi5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgIHZhciBvbGRWZXIgPSBlLm9sZFZlcnNpb24gPiBNYXRoLnBvdygyLCA2MikgPyAwIDogZS5vbGRWZXJzaW9uO1xuICAgICAgICB3YXNDcmVhdGVkID0gb2xkVmVyIDwgMTtcbiAgICAgICAgZGIuaWRiZGIgPSByZXEucmVzdWx0O1xuICAgICAgICBydW5VcGdyYWRlcnMoZGIsIG9sZFZlciAvIDEwLCB1cGdyYWRlVHJhbnNhY3Rpb24sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSwgcmVqZWN0KTtcbiAgICByZXEub25zdWNjZXNzID0gd3JhcChmdW5jdGlvbigpIHtcbiAgICAgIHVwZ3JhZGVUcmFuc2FjdGlvbiA9IG51bGw7XG4gICAgICB2YXIgaWRiZGIgPSBkYi5pZGJkYiA9IHJlcS5yZXN1bHQ7XG4gICAgICB2YXIgb2JqZWN0U3RvcmVOYW1lcyA9IHNsaWNlKGlkYmRiLm9iamVjdFN0b3JlTmFtZXMpO1xuICAgICAgaWYgKG9iamVjdFN0b3JlTmFtZXMubGVuZ3RoID4gMClcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdG1wVHJhbnMgPSBpZGJkYi50cmFuc2FjdGlvbihzYWZhcmlNdWx0aVN0b3JlRml4KG9iamVjdFN0b3JlTmFtZXMpLCBcInJlYWRvbmx5XCIpO1xuICAgICAgICAgIGlmIChzdGF0ZS5hdXRvU2NoZW1hKVxuICAgICAgICAgICAgcmVhZEdsb2JhbFNjaGVtYShkYiwgaWRiZGIsIHRtcFRyYW5zKTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFkanVzdFRvRXhpc3RpbmdJbmRleE5hbWVzKGRiLCBkYi5fZGJTY2hlbWEsIHRtcFRyYW5zKTtcbiAgICAgICAgICAgIGlmICghdmVyaWZ5SW5zdGFsbGVkU2NoZW1hKGRiLCB0bXBUcmFucykpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRGV4aWUgU2NoZW1hRGlmZjogU2NoZW1hIHdhcyBleHRlbmRlZCB3aXRob3V0IGluY3JlYXNpbmcgdGhlIG51bWJlciBwYXNzZWQgdG8gZGIudmVyc2lvbigpLiBTb21lIHF1ZXJpZXMgbWF5IGZhaWwuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBnZW5lcmF0ZU1pZGRsZXdhcmVTdGFja3MoZGIsIHRtcFRyYW5zKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICBjb25uZWN0aW9ucy5wdXNoKGRiKTtcbiAgICAgIGlkYmRiLm9udmVyc2lvbmNoYW5nZSA9IHdyYXAoZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgc3RhdGUudmNGaXJlZCA9IHRydWU7XG4gICAgICAgIGRiLm9uKFwidmVyc2lvbmNoYW5nZVwiKS5maXJlKGV2KTtcbiAgICAgIH0pO1xuICAgICAgaWRiZGIub25jbG9zZSA9IHdyYXAoZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgZGIub24oXCJjbG9zZVwiKS5maXJlKGV2KTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHdhc0NyZWF0ZWQpXG4gICAgICAgIF9vbkRhdGFiYXNlQ3JlYXRlZChkYi5fZGVwcywgZGJOYW1lKTtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9LCByZWplY3QpO1xuICB9KV0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUub25SZWFkeUJlaW5nRmlyZWQgPSBbXTtcbiAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUodmlwKGRiLm9uLnJlYWR5LmZpcmUpKS50aGVuKGZ1bmN0aW9uIGZpcmVSZW1haW5kZXJzKCkge1xuICAgICAgaWYgKHN0YXRlLm9uUmVhZHlCZWluZ0ZpcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHJlbWFpbmRlcnMgPSBzdGF0ZS5vblJlYWR5QmVpbmdGaXJlZC5yZWR1Y2UocHJvbWlzYWJsZUNoYWluLCBub3ApO1xuICAgICAgICBzdGF0ZS5vblJlYWR5QmVpbmdGaXJlZCA9IFtdO1xuICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUodmlwKHJlbWFpbmRlcnMpKS50aGVuKGZpcmVSZW1haW5kZXJzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5vblJlYWR5QmVpbmdGaXJlZCA9IG51bGw7XG4gIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUuaXNCZWluZ09wZW5lZCA9IGZhbHNlO1xuICAgIHJldHVybiBkYjtcbiAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHVwZ3JhZGVUcmFuc2FjdGlvbiAmJiB1cGdyYWRlVHJhbnNhY3Rpb24uYWJvcnQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICAgIHN0YXRlLmlzQmVpbmdPcGVuZWQgPSBmYWxzZTtcbiAgICBkYi5jbG9zZSgpO1xuICAgIHN0YXRlLmRiT3BlbkVycm9yID0gZXJyO1xuICAgIHJldHVybiByZWplY3Rpb24oc3RhdGUuZGJPcGVuRXJyb3IpO1xuICB9KS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLm9wZW5Db21wbGV0ZSA9IHRydWU7XG4gICAgcmVzb2x2ZURiUmVhZHkoKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBhd2FpdEl0ZXJhdG9yKGl0ZXJhdG9yKSB7XG4gIHZhciBjYWxsTmV4dCA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHJldHVybiBpdGVyYXRvci5uZXh0KHJlc3VsdCk7XG4gIH0sIGRvVGhyb3cgPSBmdW5jdGlvbihlcnJvcikge1xuICAgIHJldHVybiBpdGVyYXRvci50aHJvdyhlcnJvcik7XG4gIH0sIG9uU3VjY2VzcyA9IHN0ZXAoY2FsbE5leHQpLCBvbkVycm9yID0gc3RlcChkb1Rocm93KTtcbiAgZnVuY3Rpb24gc3RlcChnZXROZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgdmFyIG5leHQgPSBnZXROZXh0KHZhbCksIHZhbHVlID0gbmV4dC52YWx1ZTtcbiAgICAgIHJldHVybiBuZXh0LmRvbmUgPyB2YWx1ZSA6ICF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUudGhlbiAhPT0gXCJmdW5jdGlvblwiID8gaXNBcnJheSh2YWx1ZSkgPyBQcm9taXNlLmFsbCh2YWx1ZSkudGhlbihvblN1Y2Nlc3MsIG9uRXJyb3IpIDogb25TdWNjZXNzKHZhbHVlKSA6IHZhbHVlLnRoZW4ob25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBzdGVwKGNhbGxOZXh0KSgpO1xufVxuZnVuY3Rpb24gZXh0cmFjdFRyYW5zYWN0aW9uQXJncyhtb2RlLCBfdGFibGVBcmdzXywgc2NvcGVGdW5jKSB7XG4gIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKGkgPCAyKVxuICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIlRvbyBmZXcgYXJndW1lbnRzXCIpO1xuICB2YXIgYXJncyA9IG5ldyBBcnJheShpIC0gMSk7XG4gIHdoaWxlICgtLWkpXG4gICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gIHNjb3BlRnVuYyA9IGFyZ3MucG9wKCk7XG4gIHZhciB0YWJsZXMgPSBmbGF0dGVuKGFyZ3MpO1xuICByZXR1cm4gW21vZGUsIHRhYmxlcywgc2NvcGVGdW5jXTtcbn1cbmZ1bmN0aW9uIGVudGVyVHJhbnNhY3Rpb25TY29wZShkYiwgbW9kZSwgc3RvcmVOYW1lcywgcGFyZW50VHJhbnNhY3Rpb24sIHNjb3BlRnVuYykge1xuICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFuc2xlc3MgPSBQU0QudHJhbnNsZXNzIHx8IFBTRDtcbiAgICB2YXIgdHJhbnMgPSBkYi5fY3JlYXRlVHJhbnNhY3Rpb24obW9kZSwgc3RvcmVOYW1lcywgZGIuX2RiU2NoZW1hLCBwYXJlbnRUcmFuc2FjdGlvbik7XG4gICAgdmFyIHpvbmVQcm9wcyA9IHtcbiAgICAgIHRyYW5zLFxuICAgICAgdHJhbnNsZXNzXG4gICAgfTtcbiAgICBpZiAocGFyZW50VHJhbnNhY3Rpb24pIHtcbiAgICAgIHRyYW5zLmlkYnRyYW5zID0gcGFyZW50VHJhbnNhY3Rpb24uaWRidHJhbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zLmNyZWF0ZSgpO1xuICAgIH1cbiAgICB2YXIgc2NvcGVGdW5jSXNBc3luYyA9IGlzQXN5bmNGdW5jdGlvbihzY29wZUZ1bmMpO1xuICAgIGlmIChzY29wZUZ1bmNJc0FzeW5jKSB7XG4gICAgICBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgIH1cbiAgICB2YXIgcmV0dXJuVmFsdWU7XG4gICAgdmFyIHByb21pc2VGb2xsb3dlZCA9IERleGllUHJvbWlzZS5mb2xsb3coZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHNjb3BlRnVuYy5jYWxsKHRyYW5zLCB0cmFucyk7XG4gICAgICBpZiAocmV0dXJuVmFsdWUpIHtcbiAgICAgICAgaWYgKHNjb3BlRnVuY0lzQXN5bmMpIHtcbiAgICAgICAgICB2YXIgZGVjcmVtZW50b3IgPSBkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cy5iaW5kKG51bGwsIG51bGwpO1xuICAgICAgICAgIHJldHVyblZhbHVlLnRoZW4oZGVjcmVtZW50b3IsIGRlY3JlbWVudG9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmV0dXJuVmFsdWUubmV4dCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiByZXR1cm5WYWx1ZS50aHJvdyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBhd2FpdEl0ZXJhdG9yKHJldHVyblZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHpvbmVQcm9wcyk7XG4gICAgcmV0dXJuIChyZXR1cm5WYWx1ZSAmJiB0eXBlb2YgcmV0dXJuVmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiID8gRGV4aWVQcm9taXNlLnJlc29sdmUocmV0dXJuVmFsdWUpLnRoZW4oZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHRyYW5zLmFjdGl2ZSA/IHggOiByZWplY3Rpb24obmV3IGV4Y2VwdGlvbnMuUHJlbWF0dXJlQ29tbWl0KFwiVHJhbnNhY3Rpb24gY29tbWl0dGVkIHRvbyBlYXJseS4gU2VlIGh0dHA6Ly9iaXQubHkvMmtkY2tNblwiKSk7XG4gICAgfSkgOiBwcm9taXNlRm9sbG93ZWQudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9KSkudGhlbihmdW5jdGlvbih4KSB7XG4gICAgICBpZiAocGFyZW50VHJhbnNhY3Rpb24pXG4gICAgICAgIHRyYW5zLl9yZXNvbHZlKCk7XG4gICAgICByZXR1cm4gdHJhbnMuX2NvbXBsZXRpb24udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICB0cmFucy5fcmVqZWN0KGUpO1xuICAgICAgcmV0dXJuIHJlamVjdGlvbihlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBwYWQoYSwgdmFsdWUsIGNvdW50KSB7XG4gIHZhciByZXN1bHQgPSBpc0FycmF5KGEpID8gYS5zbGljZSgpIDogW2FdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpXG4gICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY3JlYXRlVmlydHVhbEluZGV4TWlkZGxld2FyZShkb3duKSB7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZG93biksIHt0YWJsZTogZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgdmFyIHRhYmxlID0gZG93bi50YWJsZSh0YWJsZU5hbWUpO1xuICAgIHZhciBzY2hlbWEgPSB0YWJsZS5zY2hlbWE7XG4gICAgdmFyIGluZGV4TG9va3VwID0ge307XG4gICAgdmFyIGFsbFZpcnR1YWxJbmRleGVzID0gW107XG4gICAgZnVuY3Rpb24gYWRkVmlydHVhbEluZGV4ZXMoa2V5UGF0aCwga2V5VGFpbCwgbG93TGV2ZWxJbmRleCkge1xuICAgICAgdmFyIGtleVBhdGhBbGlhcyA9IGdldEtleVBhdGhBbGlhcyhrZXlQYXRoKTtcbiAgICAgIHZhciBpbmRleExpc3QgPSBpbmRleExvb2t1cFtrZXlQYXRoQWxpYXNdID0gaW5kZXhMb29rdXBba2V5UGF0aEFsaWFzXSB8fCBbXTtcbiAgICAgIHZhciBrZXlMZW5ndGggPSBrZXlQYXRoID09IG51bGwgPyAwIDogdHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIgPyAxIDoga2V5UGF0aC5sZW5ndGg7XG4gICAgICB2YXIgaXNWaXJ0dWFsID0ga2V5VGFpbCA+IDA7XG4gICAgICB2YXIgdmlydHVhbEluZGV4ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGxvd0xldmVsSW5kZXgpLCB7XG4gICAgICAgIGlzVmlydHVhbCxcbiAgICAgICAgaXNQcmltYXJ5S2V5OiAhaXNWaXJ0dWFsICYmIGxvd0xldmVsSW5kZXguaXNQcmltYXJ5S2V5LFxuICAgICAgICBrZXlUYWlsLFxuICAgICAgICBrZXlMZW5ndGgsXG4gICAgICAgIGV4dHJhY3RLZXk6IGdldEtleUV4dHJhY3RvcihrZXlQYXRoKSxcbiAgICAgICAgdW5pcXVlOiAhaXNWaXJ0dWFsICYmIGxvd0xldmVsSW5kZXgudW5pcXVlXG4gICAgICB9KTtcbiAgICAgIGluZGV4TGlzdC5wdXNoKHZpcnR1YWxJbmRleCk7XG4gICAgICBpZiAoIXZpcnR1YWxJbmRleC5pc1ByaW1hcnlLZXkpIHtcbiAgICAgICAgYWxsVmlydHVhbEluZGV4ZXMucHVzaCh2aXJ0dWFsSW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGtleUxlbmd0aCA+IDEpIHtcbiAgICAgICAgdmFyIHZpcnR1YWxLZXlQYXRoID0ga2V5TGVuZ3RoID09PSAyID8ga2V5UGF0aFswXSA6IGtleVBhdGguc2xpY2UoMCwga2V5TGVuZ3RoIC0gMSk7XG4gICAgICAgIGFkZFZpcnR1YWxJbmRleGVzKHZpcnR1YWxLZXlQYXRoLCBrZXlUYWlsICsgMSwgbG93TGV2ZWxJbmRleCk7XG4gICAgICB9XG4gICAgICBpbmRleExpc3Quc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmtleVRhaWwgLSBiLmtleVRhaWw7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2aXJ0dWFsSW5kZXg7XG4gICAgfVxuICAgIHZhciBwcmltYXJ5S2V5ID0gYWRkVmlydHVhbEluZGV4ZXMoc2NoZW1hLnByaW1hcnlLZXkua2V5UGF0aCwgMCwgc2NoZW1hLnByaW1hcnlLZXkpO1xuICAgIGluZGV4TG9va3VwW1wiOmlkXCJdID0gW3ByaW1hcnlLZXldO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EyID0gc2NoZW1hLmluZGV4ZXM7IF9pIDwgX2EyLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIGluZGV4ID0gX2EyW19pXTtcbiAgICAgIGFkZFZpcnR1YWxJbmRleGVzKGluZGV4LmtleVBhdGgsIDAsIGluZGV4KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZEJlc3RJbmRleChrZXlQYXRoKSB7XG4gICAgICB2YXIgcmVzdWx0MiA9IGluZGV4TG9va3VwW2dldEtleVBhdGhBbGlhcyhrZXlQYXRoKV07XG4gICAgICByZXR1cm4gcmVzdWx0MiAmJiByZXN1bHQyWzBdO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVSYW5nZShyYW5nZSwga2V5VGFpbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogcmFuZ2UudHlwZSA9PT0gMSA/IDIgOiByYW5nZS50eXBlLFxuICAgICAgICBsb3dlcjogcGFkKHJhbmdlLmxvd2VyLCByYW5nZS5sb3dlck9wZW4gPyBkb3duLk1BWF9LRVkgOiBkb3duLk1JTl9LRVksIGtleVRhaWwpLFxuICAgICAgICBsb3dlck9wZW46IHRydWUsXG4gICAgICAgIHVwcGVyOiBwYWQocmFuZ2UudXBwZXIsIHJhbmdlLnVwcGVyT3BlbiA/IGRvd24uTUlOX0tFWSA6IGRvd24uTUFYX0tFWSwga2V5VGFpbCksXG4gICAgICAgIHVwcGVyT3BlbjogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlUmVxdWVzdChyZXEpIHtcbiAgICAgIHZhciBpbmRleDIgPSByZXEucXVlcnkuaW5kZXg7XG4gICAgICByZXR1cm4gaW5kZXgyLmlzVmlydHVhbCA/IF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXEpLCB7cXVlcnk6IHtcbiAgICAgICAgaW5kZXg6IGluZGV4MixcbiAgICAgICAgcmFuZ2U6IHRyYW5zbGF0ZVJhbmdlKHJlcS5xdWVyeS5yYW5nZSwgaW5kZXgyLmtleVRhaWwpXG4gICAgICB9fSkgOiByZXE7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGFibGUpLCB7XG4gICAgICBzY2hlbWE6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBzY2hlbWEpLCB7cHJpbWFyeUtleSwgaW5kZXhlczogYWxsVmlydHVhbEluZGV4ZXMsIGdldEluZGV4QnlLZXlQYXRoOiBmaW5kQmVzdEluZGV4fSksXG4gICAgICBjb3VudDogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHJldHVybiB0YWJsZS5jb3VudCh0cmFuc2xhdGVSZXF1ZXN0KHJlcSkpO1xuICAgICAgfSxcbiAgICAgIHF1ZXJ5OiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgcmV0dXJuIHRhYmxlLnF1ZXJ5KHRyYW5zbGF0ZVJlcXVlc3QocmVxKSk7XG4gICAgICB9LFxuICAgICAgb3BlbkN1cnNvcjogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHZhciBfYTMgPSByZXEucXVlcnkuaW5kZXgsIGtleVRhaWwgPSBfYTMua2V5VGFpbCwgaXNWaXJ0dWFsID0gX2EzLmlzVmlydHVhbCwga2V5TGVuZ3RoID0gX2EzLmtleUxlbmd0aDtcbiAgICAgICAgaWYgKCFpc1ZpcnR1YWwpXG4gICAgICAgICAgcmV0dXJuIHRhYmxlLm9wZW5DdXJzb3IocmVxKTtcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlVmlydHVhbEN1cnNvcihjdXJzb3IpIHtcbiAgICAgICAgICBmdW5jdGlvbiBfY29udGludWUoa2V5KSB7XG4gICAgICAgICAgICBrZXkgIT0gbnVsbCA/IGN1cnNvci5jb250aW51ZShwYWQoa2V5LCByZXEucmV2ZXJzZSA/IGRvd24uTUFYX0tFWSA6IGRvd24uTUlOX0tFWSwga2V5VGFpbCkpIDogcmVxLnVuaXF1ZSA/IGN1cnNvci5jb250aW51ZShwYWQoY3Vyc29yLmtleSwgcmVxLnJldmVyc2UgPyBkb3duLk1JTl9LRVkgOiBkb3duLk1BWF9LRVksIGtleVRhaWwpKSA6IGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmlydHVhbEN1cnNvciA9IE9iamVjdC5jcmVhdGUoY3Vyc29yLCB7XG4gICAgICAgICAgICBjb250aW51ZToge3ZhbHVlOiBfY29udGludWV9LFxuICAgICAgICAgICAgY29udGludWVQcmltYXJ5S2V5OiB7XG4gICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihrZXksIHByaW1hcnlLZXkyKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlUHJpbWFyeUtleShwYWQoa2V5LCBkb3duLk1BWF9LRVksIGtleVRhaWwpLCBwcmltYXJ5S2V5Mik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gY3Vyc29yLmtleTtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5TGVuZ3RoID09PSAxID8ga2V5WzBdIDoga2V5LnNsaWNlKDAsIGtleUxlbmd0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJzb3IudmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdmlydHVhbEN1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGUub3BlbkN1cnNvcih0cmFuc2xhdGVSZXF1ZXN0KHJlcSkpLnRoZW4oZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnNvciAmJiBjcmVhdGVWaXJ0dWFsQ3Vyc29yKGN1cnNvcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH19KTtcbn1cbnZhciB2aXJ0dWFsSW5kZXhNaWRkbGV3YXJlID0ge1xuICBzdGFjazogXCJkYmNvcmVcIixcbiAgbmFtZTogXCJWaXJ0dWFsSW5kZXhNaWRkbGV3YXJlXCIsXG4gIGxldmVsOiAxLFxuICBjcmVhdGU6IGNyZWF0ZVZpcnR1YWxJbmRleE1pZGRsZXdhcmVcbn07XG5mdW5jdGlvbiBnZXRFZmZlY3RpdmVLZXlzKHByaW1hcnlLZXksIHJlcSkge1xuICBpZiAocmVxLnR5cGUgPT09IFwiZGVsZXRlXCIpXG4gICAgcmV0dXJuIHJlcS5rZXlzO1xuICByZXR1cm4gcmVxLmtleXMgfHwgcmVxLnZhbHVlcy5tYXAocHJpbWFyeUtleS5leHRyYWN0S2V5KTtcbn1cbnZhciBob29rc01pZGRsZXdhcmUgPSB7XG4gIHN0YWNrOiBcImRiY29yZVwiLFxuICBuYW1lOiBcIkhvb2tzTWlkZGxld2FyZVwiLFxuICBsZXZlbDogMixcbiAgY3JlYXRlOiBmdW5jdGlvbihkb3duQ29yZSkge1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZG93bkNvcmUpLCB7dGFibGU6IGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgICAgdmFyIGRvd25UYWJsZSA9IGRvd25Db3JlLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgICB2YXIgcHJpbWFyeUtleSA9IGRvd25UYWJsZS5zY2hlbWEucHJpbWFyeUtleTtcbiAgICAgIHZhciB0YWJsZU1pZGRsZXdhcmUgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZG93blRhYmxlKSwge211dGF0ZTogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHZhciBkeFRyYW5zID0gUFNELnRyYW5zO1xuICAgICAgICB2YXIgX2EyID0gZHhUcmFucy50YWJsZSh0YWJsZU5hbWUpLmhvb2ssIGRlbGV0aW5nID0gX2EyLmRlbGV0aW5nLCBjcmVhdGluZyA9IF9hMi5jcmVhdGluZywgdXBkYXRpbmcgPSBfYTIudXBkYXRpbmc7XG4gICAgICAgIHN3aXRjaCAocmVxLnR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwiYWRkXCI6XG4gICAgICAgICAgICBpZiAoY3JlYXRpbmcuZmlyZSA9PT0gbm9wKVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHJldHVybiBkeFRyYW5zLl9wcm9taXNlKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gYWRkUHV0T3JEZWxldGUocmVxKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgIGNhc2UgXCJwdXRcIjpcbiAgICAgICAgICAgIGlmIChjcmVhdGluZy5maXJlID09PSBub3AgJiYgdXBkYXRpbmcuZmlyZSA9PT0gbm9wKVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHJldHVybiBkeFRyYW5zLl9wcm9taXNlKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gYWRkUHV0T3JEZWxldGUocmVxKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgIGNhc2UgXCJkZWxldGVcIjpcbiAgICAgICAgICAgIGlmIChkZWxldGluZy5maXJlID09PSBub3ApXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgcmV0dXJuIGR4VHJhbnMuX3Byb21pc2UoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhZGRQdXRPckRlbGV0ZShyZXEpO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgY2FzZSBcImRlbGV0ZVJhbmdlXCI6XG4gICAgICAgICAgICBpZiAoZGVsZXRpbmcuZmlyZSA9PT0gbm9wKVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHJldHVybiBkeFRyYW5zLl9wcm9taXNlKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZGVsZXRlUmFuZ2UocmVxKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb3duVGFibGUubXV0YXRlKHJlcSk7XG4gICAgICAgIGZ1bmN0aW9uIGFkZFB1dE9yRGVsZXRlKHJlcTIpIHtcbiAgICAgICAgICB2YXIgZHhUcmFuczIgPSBQU0QudHJhbnM7XG4gICAgICAgICAgdmFyIGtleXMyID0gcmVxMi5rZXlzIHx8IGdldEVmZmVjdGl2ZUtleXMocHJpbWFyeUtleSwgcmVxMik7XG4gICAgICAgICAgaWYgKCFrZXlzMilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIktleXMgbWlzc2luZ1wiKTtcbiAgICAgICAgICByZXEyID0gcmVxMi50eXBlID09PSBcImFkZFwiIHx8IHJlcTIudHlwZSA9PT0gXCJwdXRcIiA/IF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXEyKSwge2tleXM6IGtleXMyfSkgOiBfX2Fzc2lnbih7fSwgcmVxMik7XG4gICAgICAgICAgaWYgKHJlcTIudHlwZSAhPT0gXCJkZWxldGVcIilcbiAgICAgICAgICAgIHJlcTIudmFsdWVzID0gX19zcHJlYWRBcnJheShbXSwgcmVxMi52YWx1ZXMpO1xuICAgICAgICAgIGlmIChyZXEyLmtleXMpXG4gICAgICAgICAgICByZXEyLmtleXMgPSBfX3NwcmVhZEFycmF5KFtdLCByZXEyLmtleXMpO1xuICAgICAgICAgIHJldHVybiBnZXRFeGlzdGluZ1ZhbHVlcyhkb3duVGFibGUsIHJlcTIsIGtleXMyKS50aGVuKGZ1bmN0aW9uKGV4aXN0aW5nVmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgY29udGV4dHMgPSBrZXlzMi5tYXAoZnVuY3Rpb24oa2V5LCBpKSB7XG4gICAgICAgICAgICAgIHZhciBleGlzdGluZ1ZhbHVlID0gZXhpc3RpbmdWYWx1ZXNbaV07XG4gICAgICAgICAgICAgIHZhciBjdHggPSB7b25lcnJvcjogbnVsbCwgb25zdWNjZXNzOiBudWxsfTtcbiAgICAgICAgICAgICAgaWYgKHJlcTIudHlwZSA9PT0gXCJkZWxldGVcIikge1xuICAgICAgICAgICAgICAgIGRlbGV0aW5nLmZpcmUuY2FsbChjdHgsIGtleSwgZXhpc3RpbmdWYWx1ZSwgZHhUcmFuczIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcTIudHlwZSA9PT0gXCJhZGRcIiB8fCBleGlzdGluZ1ZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2VuZXJhdGVkUHJpbWFyeUtleSA9IGNyZWF0aW5nLmZpcmUuY2FsbChjdHgsIGtleSwgcmVxMi52YWx1ZXNbaV0sIGR4VHJhbnMyKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IG51bGwgJiYgZ2VuZXJhdGVkUHJpbWFyeUtleSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBrZXkgPSBnZW5lcmF0ZWRQcmltYXJ5S2V5O1xuICAgICAgICAgICAgICAgICAgcmVxMi5rZXlzW2ldID0ga2V5O1xuICAgICAgICAgICAgICAgICAgaWYgKCFwcmltYXJ5S2V5Lm91dGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEJ5S2V5UGF0aChyZXEyLnZhbHVlc1tpXSwgcHJpbWFyeUtleS5rZXlQYXRoLCBrZXkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgb2JqZWN0RGlmZiA9IGdldE9iamVjdERpZmYoZXhpc3RpbmdWYWx1ZSwgcmVxMi52YWx1ZXNbaV0pO1xuICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsQ2hhbmdlc18xID0gdXBkYXRpbmcuZmlyZS5jYWxsKGN0eCwgb2JqZWN0RGlmZiwga2V5LCBleGlzdGluZ1ZhbHVlLCBkeFRyYW5zMik7XG4gICAgICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxDaGFuZ2VzXzEpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ZWRWYWx1ZV8xID0gcmVxMi52YWx1ZXNbaV07XG4gICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhhZGRpdGlvbmFsQ2hhbmdlc18xKS5mb3JFYWNoKGZ1bmN0aW9uKGtleVBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc093bihyZXF1ZXN0ZWRWYWx1ZV8xLCBrZXlQYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZFZhbHVlXzFba2V5UGF0aF0gPSBhZGRpdGlvbmFsQ2hhbmdlc18xW2tleVBhdGhdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHNldEJ5S2V5UGF0aChyZXF1ZXN0ZWRWYWx1ZV8xLCBrZXlQYXRoLCBhZGRpdGlvbmFsQ2hhbmdlc18xW2tleVBhdGhdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBjdHg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkb3duVGFibGUubXV0YXRlKHJlcTIpLnRoZW4oZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgICAgICAgIHZhciBmYWlsdXJlcyA9IF9hMy5mYWlsdXJlcywgcmVzdWx0cyA9IF9hMy5yZXN1bHRzLCBudW1GYWlsdXJlcyA9IF9hMy5udW1GYWlsdXJlcywgbGFzdFJlc3VsdCA9IF9hMy5sYXN0UmVzdWx0O1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByaW1LZXkgPSByZXN1bHRzID8gcmVzdWx0c1tpXSA6IGtleXMyW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjdHggPSBjb250ZXh0c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAocHJpbUtleSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBjdHgub25lcnJvciAmJiBjdHgub25lcnJvcihmYWlsdXJlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGN0eC5vbnN1Y2Nlc3MgJiYgY3R4Lm9uc3VjY2VzcyhyZXEyLnR5cGUgPT09IFwicHV0XCIgJiYgZXhpc3RpbmdWYWx1ZXNbaV0gPyByZXEyLnZhbHVlc1tpXSA6IHByaW1LZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4ge2ZhaWx1cmVzLCByZXN1bHRzLCBudW1GYWlsdXJlcywgbGFzdFJlc3VsdH07XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBjb250ZXh0cy5mb3JFYWNoKGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHgub25lcnJvciAmJiBjdHgub25lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlUmFuZ2UocmVxMikge1xuICAgICAgICAgIHJldHVybiBkZWxldGVOZXh0Q2h1bmsocmVxMi50cmFucywgcmVxMi5yYW5nZSwgMWU0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVOZXh0Q2h1bmsodHJhbnMsIHJhbmdlLCBsaW1pdCkge1xuICAgICAgICAgIHJldHVybiBkb3duVGFibGUucXVlcnkoe3RyYW5zLCB2YWx1ZXM6IGZhbHNlLCBxdWVyeToge2luZGV4OiBwcmltYXJ5S2V5LCByYW5nZX0sIGxpbWl0fSkudGhlbihmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBfYTMucmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIGFkZFB1dE9yRGVsZXRlKHt0eXBlOiBcImRlbGV0ZVwiLCBrZXlzOiByZXN1bHQsIHRyYW5zfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHJlcy5udW1GYWlsdXJlcyA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5mYWlsdXJlc1swXSk7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge2ZhaWx1cmVzOiBbXSwgbnVtRmFpbHVyZXM6IDAsIGxhc3RSZXN1bHQ6IHZvaWQgMH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZU5leHRDaHVuayh0cmFucywgX19hc3NpZ24oX19hc3NpZ24oe30sIHJhbmdlKSwge2xvd2VyOiByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLCBsb3dlck9wZW46IHRydWV9KSwgbGltaXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfX0pO1xuICAgICAgcmV0dXJuIHRhYmxlTWlkZGxld2FyZTtcbiAgICB9fSk7XG4gIH1cbn07XG5mdW5jdGlvbiBnZXRFeGlzdGluZ1ZhbHVlcyh0YWJsZSwgcmVxLCBlZmZlY3RpdmVLZXlzKSB7XG4gIHJldHVybiByZXEudHlwZSA9PT0gXCJhZGRcIiA/IFByb21pc2UucmVzb2x2ZShbXSkgOiB0YWJsZS5nZXRNYW55KHt0cmFuczogcmVxLnRyYW5zLCBrZXlzOiBlZmZlY3RpdmVLZXlzLCBjYWNoZTogXCJpbW11dGFibGVcIn0pO1xufVxudmFyIF9jbXA7XG5mdW5jdGlvbiBjbXAoYSwgYikge1xuICBpZiAoX2NtcClcbiAgICByZXR1cm4gX2NtcChhLCBiKTtcbiAgdmFyIGluZGV4ZWREQiA9IGRvbURlcHMuaW5kZXhlZERCO1xuICBpZiAoIWluZGV4ZWREQilcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5NaXNzaW5nQVBJKCk7XG4gIF9jbXAgPSBmdW5jdGlvbihhMiwgYjIpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGEyID09IG51bGwgfHwgYjIgPT0gbnVsbCA/IE5hTiA6IGluZGV4ZWREQi5jbXAoYTIsIGIyKTtcbiAgICB9IGNhdGNoIChfYTIpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2NtcChhLCBiKTtcbn1cbmZ1bmN0aW9uIGdldEZyb21UcmFuc2FjdGlvbkNhY2hlKGtleXMyLCBjYWNoZSwgY2xvbmUpIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWNhY2hlKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKGNhY2hlLmtleXMubGVuZ3RoIDwga2V5czIubGVuZ3RoKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IGNhY2hlLmtleXMubGVuZ3RoICYmIGogPCBrZXlzMi5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGNtcChjYWNoZS5rZXlzW2ldLCBrZXlzMltqXSkgIT09IDApXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgcmVzdWx0LnB1c2goY2xvbmUgPyBkZWVwQ2xvbmUoY2FjaGUudmFsdWVzW2ldKSA6IGNhY2hlLnZhbHVlc1tpXSk7XG4gICAgICArK2o7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQubGVuZ3RoID09PSBrZXlzMi5sZW5ndGggPyByZXN1bHQgOiBudWxsO1xuICB9IGNhdGNoIChfYTIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxudmFyIGNhY2hlRXhpc3RpbmdWYWx1ZXNNaWRkbGV3YXJlID0ge1xuICBzdGFjazogXCJkYmNvcmVcIixcbiAgbGV2ZWw6IC0xLFxuICBjcmVhdGU6IGZ1bmN0aW9uKGNvcmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFibGU6IGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgICAgICB2YXIgdGFibGUgPSBjb3JlLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGFibGUpLCB7Z2V0TWFueTogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgICAgaWYgKCFyZXEuY2FjaGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZS5nZXRNYW55KHJlcSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBjYWNoZWRSZXN1bHQgPSBnZXRGcm9tVHJhbnNhY3Rpb25DYWNoZShyZXEua2V5cywgcmVxLnRyYW5zW1wiX2NhY2hlXCJdLCByZXEuY2FjaGUgPT09IFwiY2xvbmVcIik7XG4gICAgICAgICAgaWYgKGNhY2hlZFJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKGNhY2hlZFJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YWJsZS5nZXRNYW55KHJlcSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIHJlcS50cmFuc1tcIl9jYWNoZVwiXSA9IHtcbiAgICAgICAgICAgICAga2V5czogcmVxLmtleXMsXG4gICAgICAgICAgICAgIHZhbHVlczogcmVxLmNhY2hlID09PSBcImNsb25lXCIgPyBkZWVwQ2xvbmUocmVzKSA6IHJlc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIG11dGF0ZTogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgICAgaWYgKHJlcS50eXBlICE9PSBcImFkZFwiKVxuICAgICAgICAgICAgcmVxLnRyYW5zW1wiX2NhY2hlXCJdID0gbnVsbDtcbiAgICAgICAgICByZXR1cm4gdGFibGUubXV0YXRlKHJlcSk7XG4gICAgICAgIH19KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xudmFyIF9hO1xuZnVuY3Rpb24gaXNFbXB0eVJhbmdlKG5vZGUpIHtcbiAgcmV0dXJuICEoXCJmcm9tXCIgaW4gbm9kZSk7XG59XG52YXIgUmFuZ2VTZXQgPSBmdW5jdGlvbihmcm9tT3JUcmVlLCB0bykge1xuICBpZiAodGhpcykge1xuICAgIGV4dGVuZCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID8ge2Q6IDEsIGZyb206IGZyb21PclRyZWUsIHRvOiBhcmd1bWVudHMubGVuZ3RoID4gMSA/IHRvIDogZnJvbU9yVHJlZX0gOiB7ZDogMH0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBydiA9IG5ldyBSYW5nZVNldCgpO1xuICAgIGlmIChmcm9tT3JUcmVlICYmIFwiZFwiIGluIGZyb21PclRyZWUpIHtcbiAgICAgIGV4dGVuZChydiwgZnJvbU9yVHJlZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxufTtcbnByb3BzKFJhbmdlU2V0LnByb3RvdHlwZSwgKF9hID0ge1xuICBhZGQ6IGZ1bmN0aW9uKHJhbmdlU2V0KSB7XG4gICAgbWVyZ2VSYW5nZXModGhpcywgcmFuZ2VTZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBhZGRLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgIGFkZFJhbmdlKHRoaXMsIGtleSwga2V5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgYWRkS2V5czogZnVuY3Rpb24oa2V5czIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGtleXMyLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gYWRkUmFuZ2UoX3RoaXMsIGtleSwga2V5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSwgX2FbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBnZXRSYW5nZVNldEl0ZXJhdG9yKHRoaXMpO1xufSwgX2EpKTtcbmZ1bmN0aW9uIGFkZFJhbmdlKHRhcmdldCwgZnJvbSwgdG8pIHtcbiAgdmFyIGRpZmYgPSBjbXAoZnJvbSwgdG8pO1xuICBpZiAoaXNOYU4oZGlmZikpXG4gICAgcmV0dXJuO1xuICBpZiAoZGlmZiA+IDApXG4gICAgdGhyb3cgUmFuZ2VFcnJvcigpO1xuICBpZiAoaXNFbXB0eVJhbmdlKHRhcmdldCkpXG4gICAgcmV0dXJuIGV4dGVuZCh0YXJnZXQsIHtmcm9tLCB0bywgZDogMX0pO1xuICB2YXIgbGVmdCA9IHRhcmdldC5sO1xuICB2YXIgcmlnaHQgPSB0YXJnZXQucjtcbiAgaWYgKGNtcCh0bywgdGFyZ2V0LmZyb20pIDwgMCkge1xuICAgIGxlZnQgPyBhZGRSYW5nZShsZWZ0LCBmcm9tLCB0bykgOiB0YXJnZXQubCA9IHtmcm9tLCB0bywgZDogMSwgbDogbnVsbCwgcjogbnVsbH07XG4gICAgcmV0dXJuIHJlYmFsYW5jZSh0YXJnZXQpO1xuICB9XG4gIGlmIChjbXAoZnJvbSwgdGFyZ2V0LnRvKSA+IDApIHtcbiAgICByaWdodCA/IGFkZFJhbmdlKHJpZ2h0LCBmcm9tLCB0bykgOiB0YXJnZXQuciA9IHtmcm9tLCB0bywgZDogMSwgbDogbnVsbCwgcjogbnVsbH07XG4gICAgcmV0dXJuIHJlYmFsYW5jZSh0YXJnZXQpO1xuICB9XG4gIGlmIChjbXAoZnJvbSwgdGFyZ2V0LmZyb20pIDwgMCkge1xuICAgIHRhcmdldC5mcm9tID0gZnJvbTtcbiAgICB0YXJnZXQubCA9IG51bGw7XG4gICAgdGFyZ2V0LmQgPSByaWdodCA/IHJpZ2h0LmQgKyAxIDogMTtcbiAgfVxuICBpZiAoY21wKHRvLCB0YXJnZXQudG8pID4gMCkge1xuICAgIHRhcmdldC50byA9IHRvO1xuICAgIHRhcmdldC5yID0gbnVsbDtcbiAgICB0YXJnZXQuZCA9IHRhcmdldC5sID8gdGFyZ2V0LmwuZCArIDEgOiAxO1xuICB9XG4gIHZhciByaWdodFdhc0N1dE9mZiA9ICF0YXJnZXQucjtcbiAgaWYgKGxlZnQgJiYgIXRhcmdldC5sKSB7XG4gICAgbWVyZ2VSYW5nZXModGFyZ2V0LCBsZWZ0KTtcbiAgfVxuICBpZiAocmlnaHQgJiYgcmlnaHRXYXNDdXRPZmYpIHtcbiAgICBtZXJnZVJhbmdlcyh0YXJnZXQsIHJpZ2h0KTtcbiAgfVxufVxuZnVuY3Rpb24gbWVyZ2VSYW5nZXModGFyZ2V0LCBuZXdTZXQpIHtcbiAgZnVuY3Rpb24gX2FkZFJhbmdlU2V0KHRhcmdldDIsIF9hMikge1xuICAgIHZhciBmcm9tID0gX2EyLmZyb20sIHRvID0gX2EyLnRvLCBsID0gX2EyLmwsIHIgPSBfYTIucjtcbiAgICBhZGRSYW5nZSh0YXJnZXQyLCBmcm9tLCB0byk7XG4gICAgaWYgKGwpXG4gICAgICBfYWRkUmFuZ2VTZXQodGFyZ2V0MiwgbCk7XG4gICAgaWYgKHIpXG4gICAgICBfYWRkUmFuZ2VTZXQodGFyZ2V0Miwgcik7XG4gIH1cbiAgaWYgKCFpc0VtcHR5UmFuZ2UobmV3U2V0KSlcbiAgICBfYWRkUmFuZ2VTZXQodGFyZ2V0LCBuZXdTZXQpO1xufVxuZnVuY3Rpb24gcmFuZ2VzT3ZlcmxhcChyYW5nZVNldDEsIHJhbmdlU2V0Mikge1xuICB2YXIgaTEgPSBnZXRSYW5nZVNldEl0ZXJhdG9yKHJhbmdlU2V0Mik7XG4gIHZhciBuZXh0UmVzdWx0MSA9IGkxLm5leHQoKTtcbiAgaWYgKG5leHRSZXN1bHQxLmRvbmUpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB2YXIgYSA9IG5leHRSZXN1bHQxLnZhbHVlO1xuICB2YXIgaTIgPSBnZXRSYW5nZVNldEl0ZXJhdG9yKHJhbmdlU2V0MSk7XG4gIHZhciBuZXh0UmVzdWx0MiA9IGkyLm5leHQoYS5mcm9tKTtcbiAgdmFyIGIgPSBuZXh0UmVzdWx0Mi52YWx1ZTtcbiAgd2hpbGUgKCFuZXh0UmVzdWx0MS5kb25lICYmICFuZXh0UmVzdWx0Mi5kb25lKSB7XG4gICAgaWYgKGNtcChiLmZyb20sIGEudG8pIDw9IDAgJiYgY21wKGIudG8sIGEuZnJvbSkgPj0gMClcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNtcChhLmZyb20sIGIuZnJvbSkgPCAwID8gYSA9IChuZXh0UmVzdWx0MSA9IGkxLm5leHQoYi5mcm9tKSkudmFsdWUgOiBiID0gKG5leHRSZXN1bHQyID0gaTIubmV4dChhLmZyb20pKS52YWx1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBnZXRSYW5nZVNldEl0ZXJhdG9yKG5vZGUpIHtcbiAgdmFyIHN0YXRlID0gaXNFbXB0eVJhbmdlKG5vZGUpID8gbnVsbCA6IHtzOiAwLCBuOiBub2RlfTtcbiAgcmV0dXJuIHtcbiAgICBuZXh0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBrZXlQcm92aWRlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwO1xuICAgICAgd2hpbGUgKHN0YXRlKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUucykge1xuICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHN0YXRlLnMgPSAxO1xuICAgICAgICAgICAgaWYgKGtleVByb3ZpZGVkKSB7XG4gICAgICAgICAgICAgIHdoaWxlIChzdGF0ZS5uLmwgJiYgY21wKGtleSwgc3RhdGUubi5mcm9tKSA8IDApXG4gICAgICAgICAgICAgICAgc3RhdGUgPSB7dXA6IHN0YXRlLCBuOiBzdGF0ZS5uLmwsIHM6IDF9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2hpbGUgKHN0YXRlLm4ubClcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt1cDogc3RhdGUsIG46IHN0YXRlLm4ubCwgczogMX07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc3RhdGUucyA9IDI7XG4gICAgICAgICAgICBpZiAoIWtleVByb3ZpZGVkIHx8IGNtcChrZXksIHN0YXRlLm4udG8pIDw9IDApXG4gICAgICAgICAgICAgIHJldHVybiB7dmFsdWU6IHN0YXRlLm4sIGRvbmU6IGZhbHNlfTtcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBpZiAoc3RhdGUubi5yKSB7XG4gICAgICAgICAgICAgIHN0YXRlLnMgPSAzO1xuICAgICAgICAgICAgICBzdGF0ZSA9IHt1cDogc3RhdGUsIG46IHN0YXRlLm4uciwgczogMH07XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHN0YXRlID0gc3RhdGUudXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7ZG9uZTogdHJ1ZX07XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gcmViYWxhbmNlKHRhcmdldCkge1xuICB2YXIgX2EyLCBfYjtcbiAgdmFyIGRpZmYgPSAoKChfYTIgPSB0YXJnZXQucikgPT09IG51bGwgfHwgX2EyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYTIuZCkgfHwgMCkgLSAoKChfYiA9IHRhcmdldC5sKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZCkgfHwgMCk7XG4gIHZhciByID0gZGlmZiA+IDEgPyBcInJcIiA6IGRpZmYgPCAtMSA/IFwibFwiIDogXCJcIjtcbiAgaWYgKHIpIHtcbiAgICB2YXIgbCA9IHIgPT09IFwiclwiID8gXCJsXCIgOiBcInJcIjtcbiAgICB2YXIgcm9vdENsb25lID0gX19hc3NpZ24oe30sIHRhcmdldCk7XG4gICAgdmFyIG9sZFJvb3RSaWdodCA9IHRhcmdldFtyXTtcbiAgICB0YXJnZXQuZnJvbSA9IG9sZFJvb3RSaWdodC5mcm9tO1xuICAgIHRhcmdldC50byA9IG9sZFJvb3RSaWdodC50bztcbiAgICB0YXJnZXRbcl0gPSBvbGRSb290UmlnaHRbcl07XG4gICAgcm9vdENsb25lW3JdID0gb2xkUm9vdFJpZ2h0W2xdO1xuICAgIHRhcmdldFtsXSA9IHJvb3RDbG9uZTtcbiAgICByb290Q2xvbmUuZCA9IGNvbXB1dGVEZXB0aChyb290Q2xvbmUpO1xuICB9XG4gIHRhcmdldC5kID0gY29tcHV0ZURlcHRoKHRhcmdldCk7XG59XG5mdW5jdGlvbiBjb21wdXRlRGVwdGgoX2EyKSB7XG4gIHZhciByID0gX2EyLnIsIGwgPSBfYTIubDtcbiAgcmV0dXJuIChyID8gbCA/IE1hdGgubWF4KHIuZCwgbC5kKSA6IHIuZCA6IGwgPyBsLmQgOiAwKSArIDE7XG59XG52YXIgb2JzZXJ2YWJpbGl0eU1pZGRsZXdhcmUgPSB7XG4gIHN0YWNrOiBcImRiY29yZVwiLFxuICBsZXZlbDogMCxcbiAgY3JlYXRlOiBmdW5jdGlvbihjb3JlKSB7XG4gICAgdmFyIGRiTmFtZSA9IGNvcmUuc2NoZW1hLm5hbWU7XG4gICAgdmFyIEZVTExfUkFOR0UgPSBuZXcgUmFuZ2VTZXQoY29yZS5NSU5fS0VZLCBjb3JlLk1BWF9LRVkpO1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29yZSksIHt0YWJsZTogZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgICB2YXIgdGFibGUgPSBjb3JlLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgICB2YXIgc2NoZW1hID0gdGFibGUuc2NoZW1hO1xuICAgICAgdmFyIHByaW1hcnlLZXkgPSBzY2hlbWEucHJpbWFyeUtleTtcbiAgICAgIHZhciBleHRyYWN0S2V5ID0gcHJpbWFyeUtleS5leHRyYWN0S2V5LCBvdXRib3VuZCA9IHByaW1hcnlLZXkub3V0Ym91bmQ7XG4gICAgICB2YXIgdGFibGVDbG9uZSA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0YWJsZSksIHttdXRhdGU6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB2YXIgdHJhbnMgPSByZXEudHJhbnM7XG4gICAgICAgIHZhciBtdXRhdGVkUGFydHMgPSB0cmFucy5tdXRhdGVkUGFydHMgfHwgKHRyYW5zLm11dGF0ZWRQYXJ0cyA9IHt9KTtcbiAgICAgICAgdmFyIGdldFJhbmdlU2V0ID0gZnVuY3Rpb24oaW5kZXhOYW1lKSB7XG4gICAgICAgICAgdmFyIHBhcnQgPSBcImlkYjovL1wiICsgZGJOYW1lICsgXCIvXCIgKyB0YWJsZU5hbWUgKyBcIi9cIiArIGluZGV4TmFtZTtcbiAgICAgICAgICByZXR1cm4gbXV0YXRlZFBhcnRzW3BhcnRdIHx8IChtdXRhdGVkUGFydHNbcGFydF0gPSBuZXcgUmFuZ2VTZXQoKSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwa1JhbmdlU2V0ID0gZ2V0UmFuZ2VTZXQoXCJcIik7XG4gICAgICAgIHZhciBkZWxzUmFuZ2VTZXQgPSBnZXRSYW5nZVNldChcIjpkZWxzXCIpO1xuICAgICAgICB2YXIgdHlwZSA9IHJlcS50eXBlO1xuICAgICAgICB2YXIgX2EyID0gcmVxLnR5cGUgPT09IFwiZGVsZXRlUmFuZ2VcIiA/IFtyZXEucmFuZ2VdIDogcmVxLnR5cGUgPT09IFwiZGVsZXRlXCIgPyBbcmVxLmtleXNdIDogcmVxLnZhbHVlcy5sZW5ndGggPCA1MCA/IFtbXSwgcmVxLnZhbHVlc10gOiBbXSwga2V5czIgPSBfYTJbMF0sIG5ld09ianMgPSBfYTJbMV07XG4gICAgICAgIHZhciBvbGRDYWNoZSA9IHJlcS50cmFuc1tcIl9jYWNoZVwiXTtcbiAgICAgICAgcmV0dXJuIHRhYmxlLm11dGF0ZShyZXEpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgaWYgKGlzQXJyYXkoa2V5czIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPT0gXCJkZWxldGVcIilcbiAgICAgICAgICAgICAga2V5czIgPSByZXMucmVzdWx0cztcbiAgICAgICAgICAgIHBrUmFuZ2VTZXQuYWRkS2V5cyhrZXlzMik7XG4gICAgICAgICAgICB2YXIgb2xkT2JqcyA9IGdldEZyb21UcmFuc2FjdGlvbkNhY2hlKGtleXMyLCBvbGRDYWNoZSk7XG4gICAgICAgICAgICBpZiAoIW9sZE9ianMgJiYgdHlwZSAhPT0gXCJhZGRcIikge1xuICAgICAgICAgICAgICBkZWxzUmFuZ2VTZXQuYWRkS2V5cyhrZXlzMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2xkT2JqcyB8fCBuZXdPYmpzKSB7XG4gICAgICAgICAgICAgIHRyYWNrQWZmZWN0ZWRJbmRleGVzKGdldFJhbmdlU2V0LCBzY2hlbWEsIG9sZE9ianMsIG5ld09ianMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5czIpIHtcbiAgICAgICAgICAgIHZhciByYW5nZSA9IHtmcm9tOiBrZXlzMi5sb3dlciwgdG86IGtleXMyLnVwcGVyfTtcbiAgICAgICAgICAgIGRlbHNSYW5nZVNldC5hZGQocmFuZ2UpO1xuICAgICAgICAgICAgcGtSYW5nZVNldC5hZGQocmFuZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwa1JhbmdlU2V0LmFkZChGVUxMX1JBTkdFKTtcbiAgICAgICAgICAgIGRlbHNSYW5nZVNldC5hZGQoRlVMTF9SQU5HRSk7XG4gICAgICAgICAgICBzY2hlbWEuaW5kZXhlcy5mb3JFYWNoKGZ1bmN0aW9uKGlkeCkge1xuICAgICAgICAgICAgICByZXR1cm4gZ2V0UmFuZ2VTZXQoaWR4Lm5hbWUpLmFkZChGVUxMX1JBTkdFKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICAgIH19KTtcbiAgICAgIHZhciBnZXRSYW5nZSA9IGZ1bmN0aW9uKF9hMikge1xuICAgICAgICB2YXIgX2IsIF9jO1xuICAgICAgICB2YXIgX2QgPSBfYTIucXVlcnksIGluZGV4ID0gX2QuaW5kZXgsIHJhbmdlID0gX2QucmFuZ2U7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgbmV3IFJhbmdlU2V0KChfYiA9IHJhbmdlLmxvd2VyKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBjb3JlLk1JTl9LRVksIChfYyA9IHJhbmdlLnVwcGVyKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBjb3JlLk1BWF9LRVkpXG4gICAgICAgIF07XG4gICAgICB9O1xuICAgICAgdmFyIHJlYWRTdWJzY3JpYmVycyA9IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgICByZXR1cm4gW3ByaW1hcnlLZXksIG5ldyBSYW5nZVNldChyZXEua2V5KV07XG4gICAgICAgIH0sXG4gICAgICAgIGdldE1hbnk6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICAgIHJldHVybiBbcHJpbWFyeUtleSwgbmV3IFJhbmdlU2V0KCkuYWRkS2V5cyhyZXEua2V5cyldO1xuICAgICAgICB9LFxuICAgICAgICBjb3VudDogZ2V0UmFuZ2UsXG4gICAgICAgIHF1ZXJ5OiBnZXRSYW5nZSxcbiAgICAgICAgb3BlbkN1cnNvcjogZ2V0UmFuZ2VcbiAgICAgIH07XG4gICAgICBrZXlzKHJlYWRTdWJzY3JpYmVycykuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdGFibGVDbG9uZVttZXRob2RdID0gZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgICAgdmFyIHN1YnNjciA9IFBTRC5zdWJzY3I7XG4gICAgICAgICAgaWYgKHN1YnNjcikge1xuICAgICAgICAgICAgdmFyIGdldFJhbmdlU2V0ID0gZnVuY3Rpb24oaW5kZXhOYW1lKSB7XG4gICAgICAgICAgICAgIHZhciBwYXJ0ID0gXCJpZGI6Ly9cIiArIGRiTmFtZSArIFwiL1wiICsgdGFibGVOYW1lICsgXCIvXCIgKyBpbmRleE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybiBzdWJzY3JbcGFydF0gfHwgKHN1YnNjcltwYXJ0XSA9IG5ldyBSYW5nZVNldCgpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgcGtSYW5nZVNldF8xID0gZ2V0UmFuZ2VTZXQoXCJcIik7XG4gICAgICAgICAgICB2YXIgZGVsc1JhbmdlU2V0XzEgPSBnZXRSYW5nZVNldChcIjpkZWxzXCIpO1xuICAgICAgICAgICAgdmFyIF9hMiA9IHJlYWRTdWJzY3JpYmVyc1ttZXRob2RdKHJlcSksIHF1ZXJpZWRJbmRleCA9IF9hMlswXSwgcXVlcmllZFJhbmdlcyA9IF9hMlsxXTtcbiAgICAgICAgICAgIGdldFJhbmdlU2V0KHF1ZXJpZWRJbmRleC5uYW1lIHx8IFwiXCIpLmFkZChxdWVyaWVkUmFuZ2VzKTtcbiAgICAgICAgICAgIGlmICghcXVlcmllZEluZGV4LmlzUHJpbWFyeUtleSkge1xuICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSBcImNvdW50XCIpIHtcbiAgICAgICAgICAgICAgICBkZWxzUmFuZ2VTZXRfMS5hZGQoRlVMTF9SQU5HRSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXNQcm9taXNlXzEgPSBtZXRob2QgPT09IFwicXVlcnlcIiAmJiBvdXRib3VuZCAmJiByZXEudmFsdWVzICYmIHRhYmxlLnF1ZXJ5KF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXEpLCB7dmFsdWVzOiBmYWxzZX0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGVbbWV0aG9kXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSBcInF1ZXJ5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dGJvdW5kICYmIHJlcS52YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5c1Byb21pc2VfMS50aGVuKGZ1bmN0aW9uKF9hMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdGluZ0tleXMgPSBfYTMucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcGtSYW5nZVNldF8xLmFkZEtleXMocmVzdWx0aW5nS2V5cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBwS2V5cyA9IHJlcS52YWx1ZXMgPyByZXMucmVzdWx0Lm1hcChleHRyYWN0S2V5KSA6IHJlcy5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEudmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcGtSYW5nZVNldF8xLmFkZEtleXMocEtleXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGRlbHNSYW5nZVNldF8xLmFkZEtleXMocEtleXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJvcGVuQ3Vyc29yXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnNvcl8xID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgd2FudFZhbHVlc18xID0gcmVxLnZhbHVlcztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcl8xICYmIE9iamVjdC5jcmVhdGUoY3Vyc29yXzEsIHtcbiAgICAgICAgICAgICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHNSYW5nZVNldF8xLmFkZEtleShjdXJzb3JfMS5wcmltYXJ5S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcl8xLmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlLZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwa2V5ID0gY3Vyc29yXzEucHJpbWFyeUtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsc1JhbmdlU2V0XzEuYWRkS2V5KHBrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3YW50VmFsdWVzXzEgJiYgcGtSYW5nZVNldF8xLmFkZEtleShjdXJzb3JfMS5wcmltYXJ5S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcl8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YWJsZVttZXRob2RdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0YWJsZUNsb25lO1xuICAgIH19KTtcbiAgfVxufTtcbmZ1bmN0aW9uIHRyYWNrQWZmZWN0ZWRJbmRleGVzKGdldFJhbmdlU2V0LCBzY2hlbWEsIG9sZE9ianMsIG5ld09ianMpIHtcbiAgZnVuY3Rpb24gYWRkQWZmZWN0ZWRJbmRleChpeCkge1xuICAgIHZhciByYW5nZVNldCA9IGdldFJhbmdlU2V0KGl4Lm5hbWUgfHwgXCJcIik7XG4gICAgZnVuY3Rpb24gZXh0cmFjdEtleShvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IGl4LmV4dHJhY3RLZXkob2JqKSA6IG51bGw7XG4gICAgfVxuICAgIHZhciBhZGRLZXlPcktleXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBpeC5tdWx0aUVudHJ5ICYmIGlzQXJyYXkoa2V5KSA/IGtleS5mb3JFYWNoKGZ1bmN0aW9uKGtleTIpIHtcbiAgICAgICAgcmV0dXJuIHJhbmdlU2V0LmFkZEtleShrZXkyKTtcbiAgICAgIH0pIDogcmFuZ2VTZXQuYWRkS2V5KGtleSk7XG4gICAgfTtcbiAgICAob2xkT2JqcyB8fCBuZXdPYmpzKS5mb3JFYWNoKGZ1bmN0aW9uKF8sIGkpIHtcbiAgICAgIHZhciBvbGRLZXkgPSBvbGRPYmpzICYmIGV4dHJhY3RLZXkob2xkT2Jqc1tpXSk7XG4gICAgICB2YXIgbmV3S2V5ID0gbmV3T2JqcyAmJiBleHRyYWN0S2V5KG5ld09ianNbaV0pO1xuICAgICAgaWYgKGNtcChvbGRLZXksIG5ld0tleSkgIT09IDApIHtcbiAgICAgICAgaWYgKG9sZEtleSAhPSBudWxsKVxuICAgICAgICAgIGFkZEtleU9yS2V5cyhvbGRLZXkpO1xuICAgICAgICBpZiAobmV3S2V5ICE9IG51bGwpXG4gICAgICAgICAgYWRkS2V5T3JLZXlzKG5ld0tleSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgc2NoZW1hLmluZGV4ZXMuZm9yRWFjaChhZGRBZmZlY3RlZEluZGV4KTtcbn1cbnZhciBEZXhpZSQxID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERleGllMihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLl9taWRkbGV3YXJlcyA9IHt9O1xuICAgIHRoaXMudmVybm8gPSAwO1xuICAgIHZhciBkZXBzID0gRGV4aWUyLmRlcGVuZGVuY2llcztcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyA9IF9fYXNzaWduKHtcbiAgICAgIGFkZG9uczogRGV4aWUyLmFkZG9ucyxcbiAgICAgIGF1dG9PcGVuOiB0cnVlLFxuICAgICAgaW5kZXhlZERCOiBkZXBzLmluZGV4ZWREQixcbiAgICAgIElEQktleVJhbmdlOiBkZXBzLklEQktleVJhbmdlXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fZGVwcyA9IHtcbiAgICAgIGluZGV4ZWREQjogb3B0aW9ucy5pbmRleGVkREIsXG4gICAgICBJREJLZXlSYW5nZTogb3B0aW9ucy5JREJLZXlSYW5nZVxuICAgIH07XG4gICAgdmFyIGFkZG9ucyA9IG9wdGlvbnMuYWRkb25zO1xuICAgIHRoaXMuX2RiU2NoZW1hID0ge307XG4gICAgdGhpcy5fdmVyc2lvbnMgPSBbXTtcbiAgICB0aGlzLl9zdG9yZU5hbWVzID0gW107XG4gICAgdGhpcy5fYWxsVGFibGVzID0ge307XG4gICAgdGhpcy5pZGJkYiA9IG51bGw7XG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgZGJPcGVuRXJyb3I6IG51bGwsXG4gICAgICBpc0JlaW5nT3BlbmVkOiBmYWxzZSxcbiAgICAgIG9uUmVhZHlCZWluZ0ZpcmVkOiBudWxsLFxuICAgICAgb3BlbkNvbXBsZXRlOiBmYWxzZSxcbiAgICAgIGRiUmVhZHlSZXNvbHZlOiBub3AsXG4gICAgICBkYlJlYWR5UHJvbWlzZTogbnVsbCxcbiAgICAgIGNhbmNlbE9wZW46IG5vcCxcbiAgICAgIG9wZW5DYW5jZWxsZXI6IG51bGwsXG4gICAgICBhdXRvU2NoZW1hOiB0cnVlXG4gICAgfTtcbiAgICBzdGF0ZS5kYlJlYWR5UHJvbWlzZSA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgc3RhdGUuZGJSZWFkeVJlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIHN0YXRlLm9wZW5DYW5jZWxsZXIgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKF8sIHJlamVjdCkge1xuICAgICAgc3RhdGUuY2FuY2VsT3BlbiA9IHJlamVjdDtcbiAgICB9KTtcbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5vbiA9IEV2ZW50cyh0aGlzLCBcInBvcHVsYXRlXCIsIFwiYmxvY2tlZFwiLCBcInZlcnNpb25jaGFuZ2VcIiwgXCJjbG9zZVwiLCB7cmVhZHk6IFtwcm9taXNhYmxlQ2hhaW4sIG5vcF19KTtcbiAgICB0aGlzLm9uLnJlYWR5LnN1YnNjcmliZSA9IG92ZXJyaWRlKHRoaXMub24ucmVhZHkuc3Vic2NyaWJlLCBmdW5jdGlvbihzdWJzY3JpYmUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdWJzY3JpYmVyLCBiU3RpY2t5KSB7XG4gICAgICAgIERleGllMi52aXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHN0YXRlMiA9IF90aGlzLl9zdGF0ZTtcbiAgICAgICAgICBpZiAoc3RhdGUyLm9wZW5Db21wbGV0ZSkge1xuICAgICAgICAgICAgaWYgKCFzdGF0ZTIuZGJPcGVuRXJyb3IpXG4gICAgICAgICAgICAgIERleGllUHJvbWlzZS5yZXNvbHZlKCkudGhlbihzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmIChiU3RpY2t5KVxuICAgICAgICAgICAgICBzdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZTIub25SZWFkeUJlaW5nRmlyZWQpIHtcbiAgICAgICAgICAgIHN0YXRlMi5vblJlYWR5QmVpbmdGaXJlZC5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKGJTdGlja3kpXG4gICAgICAgICAgICAgIHN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgdmFyIGRiXzEgPSBfdGhpcztcbiAgICAgICAgICAgIGlmICghYlN0aWNreSlcbiAgICAgICAgICAgICAgc3Vic2NyaWJlKGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICAgICAgICAgIGRiXzEub24ucmVhZHkudW5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICAgICAgZGJfMS5vbi5yZWFkeS51bnN1YnNjcmliZSh1bnN1YnNjcmliZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHRoaXMuQ29sbGVjdGlvbiA9IGNyZWF0ZUNvbGxlY3Rpb25Db25zdHJ1Y3Rvcih0aGlzKTtcbiAgICB0aGlzLlRhYmxlID0gY3JlYXRlVGFibGVDb25zdHJ1Y3Rvcih0aGlzKTtcbiAgICB0aGlzLlRyYW5zYWN0aW9uID0gY3JlYXRlVHJhbnNhY3Rpb25Db25zdHJ1Y3Rvcih0aGlzKTtcbiAgICB0aGlzLlZlcnNpb24gPSBjcmVhdGVWZXJzaW9uQ29uc3RydWN0b3IodGhpcyk7XG4gICAgdGhpcy5XaGVyZUNsYXVzZSA9IGNyZWF0ZVdoZXJlQ2xhdXNlQ29uc3RydWN0b3IodGhpcyk7XG4gICAgdGhpcy5vbihcInZlcnNpb25jaGFuZ2VcIiwgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGlmIChldi5uZXdWZXJzaW9uID4gMClcbiAgICAgICAgY29uc29sZS53YXJuKFwiQW5vdGhlciBjb25uZWN0aW9uIHdhbnRzIHRvIHVwZ3JhZGUgZGF0YWJhc2UgJ1wiICsgX3RoaXMubmFtZSArIFwiJy4gQ2xvc2luZyBkYiBub3cgdG8gcmVzdW1lIHRoZSB1cGdyYWRlLlwiKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuKFwiQW5vdGhlciBjb25uZWN0aW9uIHdhbnRzIHRvIGRlbGV0ZSBkYXRhYmFzZSAnXCIgKyBfdGhpcy5uYW1lICsgXCInLiBDbG9zaW5nIGRiIG5vdyB0byByZXN1bWUgdGhlIGRlbGV0ZSByZXF1ZXN0LlwiKTtcbiAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgdGhpcy5vbihcImJsb2NrZWRcIiwgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGlmICghZXYubmV3VmVyc2lvbiB8fCBldi5uZXdWZXJzaW9uIDwgZXYub2xkVmVyc2lvbilcbiAgICAgICAgY29uc29sZS53YXJuKFwiRGV4aWUuZGVsZXRlKCdcIiArIF90aGlzLm5hbWUgKyBcIicpIHdhcyBibG9ja2VkXCIpO1xuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4oXCJVcGdyYWRlICdcIiArIF90aGlzLm5hbWUgKyBcIicgYmxvY2tlZCBieSBvdGhlciBjb25uZWN0aW9uIGhvbGRpbmcgdmVyc2lvbiBcIiArIGV2Lm9sZFZlcnNpb24gLyAxMCk7XG4gICAgfSk7XG4gICAgdGhpcy5fbWF4S2V5ID0gZ2V0TWF4S2V5KG9wdGlvbnMuSURCS2V5UmFuZ2UpO1xuICAgIHRoaXMuX2NyZWF0ZVRyYW5zYWN0aW9uID0gZnVuY3Rpb24obW9kZSwgc3RvcmVOYW1lcywgZGJzY2hlbWEsIHBhcmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IF90aGlzLlRyYW5zYWN0aW9uKG1vZGUsIHN0b3JlTmFtZXMsIGRic2NoZW1hLCBwYXJlbnRUcmFuc2FjdGlvbik7XG4gICAgfTtcbiAgICB0aGlzLl9maXJlT25CbG9ja2VkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgIF90aGlzLm9uKFwiYmxvY2tlZFwiKS5maXJlKGV2KTtcbiAgICAgIGNvbm5lY3Rpb25zLmZpbHRlcihmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiBjLm5hbWUgPT09IF90aGlzLm5hbWUgJiYgYyAhPT0gX3RoaXMgJiYgIWMuX3N0YXRlLnZjRmlyZWQ7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24oYykge1xuICAgICAgICByZXR1cm4gYy5vbihcInZlcnNpb25jaGFuZ2VcIikuZmlyZShldik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMudXNlKHZpcnR1YWxJbmRleE1pZGRsZXdhcmUpO1xuICAgIHRoaXMudXNlKGhvb2tzTWlkZGxld2FyZSk7XG4gICAgdGhpcy51c2Uob2JzZXJ2YWJpbGl0eU1pZGRsZXdhcmUpO1xuICAgIHRoaXMudXNlKGNhY2hlRXhpc3RpbmdWYWx1ZXNNaWRkbGV3YXJlKTtcbiAgICBhZGRvbnMuZm9yRWFjaChmdW5jdGlvbihhZGRvbikge1xuICAgICAgcmV0dXJuIGFkZG9uKF90aGlzKTtcbiAgICB9KTtcbiAgfVxuICBEZXhpZTIucHJvdG90eXBlLnZlcnNpb24gPSBmdW5jdGlvbih2ZXJzaW9uTnVtYmVyKSB7XG4gICAgaWYgKGlzTmFOKHZlcnNpb25OdW1iZXIpIHx8IHZlcnNpb25OdW1iZXIgPCAwLjEpXG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5UeXBlKFwiR2l2ZW4gdmVyc2lvbiBpcyBub3QgYSBwb3NpdGl2ZSBudW1iZXJcIik7XG4gICAgdmVyc2lvbk51bWJlciA9IE1hdGgucm91bmQodmVyc2lvbk51bWJlciAqIDEwKSAvIDEwO1xuICAgIGlmICh0aGlzLmlkYmRiIHx8IHRoaXMuX3N0YXRlLmlzQmVpbmdPcGVuZWQpXG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TY2hlbWEoXCJDYW5ub3QgYWRkIHZlcnNpb24gd2hlbiBkYXRhYmFzZSBpcyBvcGVuXCIpO1xuICAgIHRoaXMudmVybm8gPSBNYXRoLm1heCh0aGlzLnZlcm5vLCB2ZXJzaW9uTnVtYmVyKTtcbiAgICB2YXIgdmVyc2lvbnMgPSB0aGlzLl92ZXJzaW9ucztcbiAgICB2YXIgdmVyc2lvbkluc3RhbmNlID0gdmVyc2lvbnMuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcbiAgICAgIHJldHVybiB2Ll9jZmcudmVyc2lvbiA9PT0gdmVyc2lvbk51bWJlcjtcbiAgICB9KVswXTtcbiAgICBpZiAodmVyc2lvbkluc3RhbmNlKVxuICAgICAgcmV0dXJuIHZlcnNpb25JbnN0YW5jZTtcbiAgICB2ZXJzaW9uSW5zdGFuY2UgPSBuZXcgdGhpcy5WZXJzaW9uKHZlcnNpb25OdW1iZXIpO1xuICAgIHZlcnNpb25zLnB1c2godmVyc2lvbkluc3RhbmNlKTtcbiAgICB2ZXJzaW9ucy5zb3J0KGxvd2VyVmVyc2lvbkZpcnN0KTtcbiAgICB2ZXJzaW9uSW5zdGFuY2Uuc3RvcmVzKHt9KTtcbiAgICB0aGlzLl9zdGF0ZS5hdXRvU2NoZW1hID0gZmFsc2U7XG4gICAgcmV0dXJuIHZlcnNpb25JbnN0YW5jZTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5fd2hlblJlYWR5ID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5vcGVuQ29tcGxldGUgfHwgUFNELmxldFRocm91Z2ggPyBmbigpIDogbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmICghX3RoaXMuX3N0YXRlLmlzQmVpbmdPcGVuZWQpIHtcbiAgICAgICAgaWYgKCFfdGhpcy5fb3B0aW9ucy5hdXRvT3Blbikge1xuICAgICAgICAgIHJlamVjdChuZXcgZXhjZXB0aW9ucy5EYXRhYmFzZUNsb3NlZCgpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMub3BlbigpLmNhdGNoKG5vcCk7XG4gICAgICB9XG4gICAgICBfdGhpcy5fc3RhdGUuZGJSZWFkeVByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH0pLnRoZW4oZm4pO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKF9hMikge1xuICAgIHZhciBzdGFjayA9IF9hMi5zdGFjaywgY3JlYXRlID0gX2EyLmNyZWF0ZSwgbGV2ZWwgPSBfYTIubGV2ZWwsIG5hbWUgPSBfYTIubmFtZTtcbiAgICBpZiAobmFtZSlcbiAgICAgIHRoaXMudW51c2Uoe3N0YWNrLCBuYW1lfSk7XG4gICAgdmFyIG1pZGRsZXdhcmVzID0gdGhpcy5fbWlkZGxld2FyZXNbc3RhY2tdIHx8ICh0aGlzLl9taWRkbGV3YXJlc1tzdGFja10gPSBbXSk7XG4gICAgbWlkZGxld2FyZXMucHVzaCh7c3RhY2ssIGNyZWF0ZSwgbGV2ZWw6IGxldmVsID09IG51bGwgPyAxMCA6IGxldmVsLCBuYW1lfSk7XG4gICAgbWlkZGxld2FyZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5sZXZlbCAtIGIubGV2ZWw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUudW51c2UgPSBmdW5jdGlvbihfYTIpIHtcbiAgICB2YXIgc3RhY2sgPSBfYTIuc3RhY2ssIG5hbWUgPSBfYTIubmFtZSwgY3JlYXRlID0gX2EyLmNyZWF0ZTtcbiAgICBpZiAoc3RhY2sgJiYgdGhpcy5fbWlkZGxld2FyZXNbc3RhY2tdKSB7XG4gICAgICB0aGlzLl9taWRkbGV3YXJlc1tzdGFja10gPSB0aGlzLl9taWRkbGV3YXJlc1tzdGFja10uZmlsdGVyKGZ1bmN0aW9uKG13KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGUgPyBtdy5jcmVhdGUgIT09IGNyZWF0ZSA6IG5hbWUgPyBtdy5uYW1lICE9PSBuYW1lIDogZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkZXhpZU9wZW4odGhpcyk7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaWR4ID0gY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgc3RhdGUgPSB0aGlzLl9zdGF0ZTtcbiAgICBpZiAoaWR4ID49IDApXG4gICAgICBjb25uZWN0aW9ucy5zcGxpY2UoaWR4LCAxKTtcbiAgICBpZiAodGhpcy5pZGJkYikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5pZGJkYi5jbG9zZSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgdGhpcy5pZGJkYiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuX29wdGlvbnMuYXV0b09wZW4gPSBmYWxzZTtcbiAgICBzdGF0ZS5kYk9wZW5FcnJvciA9IG5ldyBleGNlcHRpb25zLkRhdGFiYXNlQ2xvc2VkKCk7XG4gICAgaWYgKHN0YXRlLmlzQmVpbmdPcGVuZWQpXG4gICAgICBzdGF0ZS5jYW5jZWxPcGVuKHN0YXRlLmRiT3BlbkVycm9yKTtcbiAgICBzdGF0ZS5kYlJlYWR5UHJvbWlzZSA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgc3RhdGUuZGJSZWFkeVJlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIHN0YXRlLm9wZW5DYW5jZWxsZXIgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKF8sIHJlamVjdCkge1xuICAgICAgc3RhdGUuY2FuY2VsT3BlbiA9IHJlamVjdDtcbiAgICB9KTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBoYXNBcmd1bWVudHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMDtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9zdGF0ZTtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBkb0RlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICB2YXIgcmVxID0gX3RoaXMuX2RlcHMuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKF90aGlzLm5hbWUpO1xuICAgICAgICByZXEub25zdWNjZXNzID0gd3JhcChmdW5jdGlvbigpIHtcbiAgICAgICAgICBfb25EYXRhYmFzZURlbGV0ZWQoX3RoaXMuX2RlcHMsIF90aGlzLm5hbWUpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgIHJlcS5vbmJsb2NrZWQgPSBfdGhpcy5fZmlyZU9uQmxvY2tlZDtcbiAgICAgIH07XG4gICAgICBpZiAoaGFzQXJndW1lbnRzKVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJBcmd1bWVudHMgbm90IGFsbG93ZWQgaW4gZGIuZGVsZXRlKClcIik7XG4gICAgICBpZiAoc3RhdGUuaXNCZWluZ09wZW5lZCkge1xuICAgICAgICBzdGF0ZS5kYlJlYWR5UHJvbWlzZS50aGVuKGRvRGVsZXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvRGVsZXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuYmFja2VuZERCID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRiZGI7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuaXNPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRiZGIgIT09IG51bGw7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuaGFzQmVlbkNsb3NlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYk9wZW5FcnJvciA9IHRoaXMuX3N0YXRlLmRiT3BlbkVycm9yO1xuICAgIHJldHVybiBkYk9wZW5FcnJvciAmJiBkYk9wZW5FcnJvci5uYW1lID09PSBcIkRhdGFiYXNlQ2xvc2VkXCI7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuaGFzRmFpbGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLmRiT3BlbkVycm9yICE9PSBudWxsO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmR5bmFtaWNhbGx5T3BlbmVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLmF1dG9TY2hlbWE7XG4gIH07XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEZXhpZTIucHJvdG90eXBlLCBcInRhYmxlc1wiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICByZXR1cm4ga2V5cyh0aGlzLl9hbGxUYWJsZXMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fYWxsVGFibGVzW25hbWVdO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIERleGllMi5wcm90b3R5cGUudHJhbnNhY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGV4dHJhY3RUcmFuc2FjdGlvbkFyZ3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNhY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuX3RyYW5zYWN0aW9uID0gZnVuY3Rpb24obW9kZSwgdGFibGVzLCBzY29wZUZ1bmMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRUcmFuc2FjdGlvbiA9IFBTRC50cmFucztcbiAgICBpZiAoIXBhcmVudFRyYW5zYWN0aW9uIHx8IHBhcmVudFRyYW5zYWN0aW9uLmRiICE9PSB0aGlzIHx8IG1vZGUuaW5kZXhPZihcIiFcIikgIT09IC0xKVxuICAgICAgcGFyZW50VHJhbnNhY3Rpb24gPSBudWxsO1xuICAgIHZhciBvbmx5SWZDb21wYXRpYmxlID0gbW9kZS5pbmRleE9mKFwiP1wiKSAhPT0gLTE7XG4gICAgbW9kZSA9IG1vZGUucmVwbGFjZShcIiFcIiwgXCJcIikucmVwbGFjZShcIj9cIiwgXCJcIik7XG4gICAgdmFyIGlkYk1vZGUsIHN0b3JlTmFtZXM7XG4gICAgdHJ5IHtcbiAgICAgIHN0b3JlTmFtZXMgPSB0YWJsZXMubWFwKGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHZhciBzdG9yZU5hbWUgPSB0YWJsZSBpbnN0YW5jZW9mIF90aGlzLlRhYmxlID8gdGFibGUubmFtZSA6IHRhYmxlO1xuICAgICAgICBpZiAodHlwZW9mIHN0b3JlTmFtZSAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCB0YWJsZSBhcmd1bWVudCB0byBEZXhpZS50cmFuc2FjdGlvbigpLiBPbmx5IFRhYmxlIG9yIFN0cmluZyBhcmUgYWxsb3dlZFwiKTtcbiAgICAgICAgcmV0dXJuIHN0b3JlTmFtZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKG1vZGUgPT0gXCJyXCIgfHwgbW9kZSA9PT0gUkVBRE9OTFkpXG4gICAgICAgIGlkYk1vZGUgPSBSRUFET05MWTtcbiAgICAgIGVsc2UgaWYgKG1vZGUgPT0gXCJyd1wiIHx8IG1vZGUgPT0gUkVBRFdSSVRFKVxuICAgICAgICBpZGJNb2RlID0gUkVBRFdSSVRFO1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJJbnZhbGlkIHRyYW5zYWN0aW9uIG1vZGU6IFwiICsgbW9kZSk7XG4gICAgICBpZiAocGFyZW50VHJhbnNhY3Rpb24pIHtcbiAgICAgICAgaWYgKHBhcmVudFRyYW5zYWN0aW9uLm1vZGUgPT09IFJFQURPTkxZICYmIGlkYk1vZGUgPT09IFJFQURXUklURSkge1xuICAgICAgICAgIGlmIChvbmx5SWZDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICBwYXJlbnRUcmFuc2FjdGlvbiA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TdWJUcmFuc2FjdGlvbihcIkNhbm5vdCBlbnRlciBhIHN1Yi10cmFuc2FjdGlvbiB3aXRoIFJFQURXUklURSBtb2RlIHdoZW4gcGFyZW50IHRyYW5zYWN0aW9uIGlzIFJFQURPTkxZXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgICAgIHN0b3JlTmFtZXMuZm9yRWFjaChmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnRUcmFuc2FjdGlvbiAmJiBwYXJlbnRUcmFuc2FjdGlvbi5zdG9yZU5hbWVzLmluZGV4T2Yoc3RvcmVOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgaWYgKG9ubHlJZkNvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRUcmFuc2FjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlN1YlRyYW5zYWN0aW9uKFwiVGFibGUgXCIgKyBzdG9yZU5hbWUgKyBcIiBub3QgaW5jbHVkZWQgaW4gcGFyZW50IHRyYW5zYWN0aW9uLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob25seUlmQ29tcGF0aWJsZSAmJiBwYXJlbnRUcmFuc2FjdGlvbiAmJiAhcGFyZW50VHJhbnNhY3Rpb24uYWN0aXZlKSB7XG4gICAgICAgICAgcGFyZW50VHJhbnNhY3Rpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHBhcmVudFRyYW5zYWN0aW9uID8gcGFyZW50VHJhbnNhY3Rpb24uX3Byb21pc2UobnVsbCwgZnVuY3Rpb24oXywgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH0pIDogcmVqZWN0aW9uKGUpO1xuICAgIH1cbiAgICB2YXIgZW50ZXJUcmFuc2FjdGlvbiA9IGVudGVyVHJhbnNhY3Rpb25TY29wZS5iaW5kKG51bGwsIHRoaXMsIGlkYk1vZGUsIHN0b3JlTmFtZXMsIHBhcmVudFRyYW5zYWN0aW9uLCBzY29wZUZ1bmMpO1xuICAgIHJldHVybiBwYXJlbnRUcmFuc2FjdGlvbiA/IHBhcmVudFRyYW5zYWN0aW9uLl9wcm9taXNlKGlkYk1vZGUsIGVudGVyVHJhbnNhY3Rpb24sIFwibG9ja1wiKSA6IFBTRC50cmFucyA/IHVzZVBTRChQU0QudHJhbnNsZXNzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfdGhpcy5fd2hlblJlYWR5KGVudGVyVHJhbnNhY3Rpb24pO1xuICAgIH0pIDogdGhpcy5fd2hlblJlYWR5KGVudGVyVHJhbnNhY3Rpb24pO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLnRhYmxlID0gZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgaWYgKCFoYXNPd24odGhpcy5fYWxsVGFibGVzLCB0YWJsZU5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkVGFibGUoXCJUYWJsZSBcIiArIHRhYmxlTmFtZSArIFwiIGRvZXMgbm90IGV4aXN0XCIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWxsVGFibGVzW3RhYmxlTmFtZV07XG4gIH07XG4gIHJldHVybiBEZXhpZTI7XG59KCk7XG52YXIgc3ltYm9sT2JzZXJ2YWJsZSA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJvYnNlcnZhYmxlXCIgaW4gU3ltYm9sID8gU3ltYm9sW1wib2JzZXJ2YWJsZVwiXSA6IFwiQEBvYnNlcnZhYmxlXCI7XG52YXIgT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBPYnNlcnZhYmxlMihzdWJzY3JpYmUpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gIH1cbiAgT2JzZXJ2YWJsZTIucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHgsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUodHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIiA/IHtuZXh0OiB4LCBlcnJvciwgY29tcGxldGV9IDogeCk7XG4gIH07XG4gIE9ic2VydmFibGUyLnByb3RvdHlwZVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICByZXR1cm4gT2JzZXJ2YWJsZTI7XG59KCk7XG5mdW5jdGlvbiBleHRlbmRPYnNlcnZhYmlsaXR5U2V0KHRhcmdldCwgbmV3U2V0KSB7XG4gIGtleXMobmV3U2V0KS5mb3JFYWNoKGZ1bmN0aW9uKHBhcnQpIHtcbiAgICB2YXIgcmFuZ2VTZXQgPSB0YXJnZXRbcGFydF0gfHwgKHRhcmdldFtwYXJ0XSA9IG5ldyBSYW5nZVNldCgpKTtcbiAgICBtZXJnZVJhbmdlcyhyYW5nZVNldCwgbmV3U2V0W3BhcnRdKTtcbiAgfSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBsaXZlUXVlcnkocXVlcmllcikge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24ob2JzZXJ2ZXIpIHtcbiAgICB2YXIgc2NvcGVGdW5jSXNBc3luYyA9IGlzQXN5bmNGdW5jdGlvbihxdWVyaWVyKTtcbiAgICBmdW5jdGlvbiBleGVjdXRlKHN1YnNjcikge1xuICAgICAgaWYgKHNjb3BlRnVuY0lzQXN5bmMpIHtcbiAgICAgICAgaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgIH1cbiAgICAgIHZhciBleGVjID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXdTY29wZShxdWVyaWVyLCB7c3Vic2NyLCB0cmFuczogbnVsbH0pO1xuICAgICAgfTtcbiAgICAgIHZhciBydiA9IFBTRC50cmFucyA/IHVzZVBTRChQU0QudHJhbnNsZXNzLCBleGVjKSA6IGV4ZWMoKTtcbiAgICAgIGlmIChzY29wZUZ1bmNJc0FzeW5jKSB7XG4gICAgICAgIHJ2LnRoZW4oZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMsIGRlY3JlbWVudEV4cGVjdGVkQXdhaXRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBydjtcbiAgICB9XG4gICAgdmFyIGNsb3NlZCA9IGZhbHNlO1xuICAgIHZhciBhY2N1bU11dHMgPSB7fTtcbiAgICB2YXIgY3VycmVudE9icyA9IHt9O1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSB7XG4gICAgICBnZXQgY2xvc2VkKCkge1xuICAgICAgICByZXR1cm4gY2xvc2VkO1xuICAgICAgfSxcbiAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgZ2xvYmFsRXZlbnRzLnR4Y29tbWl0dGVkLnVuc3Vic2NyaWJlKG11dGF0aW9uTGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH07XG4gICAgb2JzZXJ2ZXIuc3RhcnQgJiYgb2JzZXJ2ZXIuc3RhcnQoc3Vic2NyaXB0aW9uKTtcbiAgICB2YXIgcXVlcnlpbmcgPSBmYWxzZSwgc3RhcnRlZExpc3RlbmluZyA9IGZhbHNlO1xuICAgIGZ1bmN0aW9uIHNob3VsZE5vdGlmeSgpIHtcbiAgICAgIHJldHVybiBrZXlzKGN1cnJlbnRPYnMpLnNvbWUoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBhY2N1bU11dHNba2V5XSAmJiByYW5nZXNPdmVybGFwKGFjY3VtTXV0c1trZXldLCBjdXJyZW50T2JzW2tleV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBtdXRhdGlvbkxpc3RlbmVyID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICAgIGV4dGVuZE9ic2VydmFiaWxpdHlTZXQoYWNjdW1NdXRzLCBwYXJ0cyk7XG4gICAgICBpZiAoc2hvdWxkTm90aWZ5KCkpIHtcbiAgICAgICAgZG9RdWVyeSgpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRvUXVlcnkgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChxdWVyeWluZyB8fCBjbG9zZWQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGFjY3VtTXV0cyA9IHt9O1xuICAgICAgdmFyIHN1YnNjciA9IHt9O1xuICAgICAgdmFyIHJldCA9IGV4ZWN1dGUoc3Vic2NyKTtcbiAgICAgIGlmICghc3RhcnRlZExpc3RlbmluZykge1xuICAgICAgICBnbG9iYWxFdmVudHMoXCJ0eGNvbW1pdHRlZFwiLCBtdXRhdGlvbkxpc3RlbmVyKTtcbiAgICAgICAgc3RhcnRlZExpc3RlbmluZyA9IHRydWU7XG4gICAgICB9XG4gICAgICBxdWVyeWluZyA9IHRydWU7XG4gICAgICBQcm9taXNlLnJlc29sdmUocmV0KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBxdWVyeWluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoY2xvc2VkKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHNob3VsZE5vdGlmeSgpKSB7XG4gICAgICAgICAgZG9RdWVyeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFjY3VtTXV0cyA9IHt9O1xuICAgICAgICAgIGN1cnJlbnRPYnMgPSBzdWJzY3I7XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dCAmJiBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBxdWVyeWluZyA9IGZhbHNlO1xuICAgICAgICBvYnNlcnZlci5lcnJvciAmJiBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZG9RdWVyeSgpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH0pO1xufVxudmFyIERleGllID0gRGV4aWUkMTtcbnByb3BzKERleGllLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZnVsbE5hbWVFeGNlcHRpb25zKSwge1xuICBkZWxldGU6IGZ1bmN0aW9uKGRhdGFiYXNlTmFtZSkge1xuICAgIHZhciBkYiA9IG5ldyBEZXhpZShkYXRhYmFzZU5hbWUpO1xuICAgIHJldHVybiBkYi5kZWxldGUoKTtcbiAgfSxcbiAgZXhpc3RzOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBEZXhpZShuYW1lLCB7YWRkb25zOiBbXX0pLm9wZW4oKS50aGVuKGZ1bmN0aW9uKGRiKSB7XG4gICAgICBkYi5jbG9zZSgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSkuY2F0Y2goXCJOb1N1Y2hEYXRhYmFzZUVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9LFxuICBnZXREYXRhYmFzZU5hbWVzOiBmdW5jdGlvbihjYikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZ2V0RGF0YWJhc2VOYW1lcyhEZXhpZS5kZXBlbmRlbmNpZXMpLnRoZW4oY2IpO1xuICAgIH0gY2F0Y2ggKF9hMikge1xuICAgICAgcmV0dXJuIHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5NaXNzaW5nQVBJKCkpO1xuICAgIH1cbiAgfSxcbiAgZGVmaW5lQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIENsYXNzKGNvbnRlbnQpIHtcbiAgICAgIGV4dGVuZCh0aGlzLCBjb250ZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIENsYXNzO1xuICB9LFxuICBpZ25vcmVUcmFuc2FjdGlvbjogZnVuY3Rpb24oc2NvcGVGdW5jKSB7XG4gICAgcmV0dXJuIFBTRC50cmFucyA/IHVzZVBTRChQU0QudHJhbnNsZXNzLCBzY29wZUZ1bmMpIDogc2NvcGVGdW5jKCk7XG4gIH0sXG4gIHZpcCxcbiAgYXN5bmM6IGZ1bmN0aW9uKGdlbmVyYXRvckZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJ2ID0gYXdhaXRJdGVyYXRvcihnZW5lcmF0b3JGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKCFydiB8fCB0eXBlb2YgcnYudGhlbiAhPT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgIHJldHVybiBEZXhpZVByb21pc2UucmVzb2x2ZShydik7XG4gICAgICAgIHJldHVybiBydjtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGlvbihlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBzcGF3bjogZnVuY3Rpb24oZ2VuZXJhdG9yRm4sIGFyZ3MsIHRoaXopIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHJ2ID0gYXdhaXRJdGVyYXRvcihnZW5lcmF0b3JGbi5hcHBseSh0aGl6LCBhcmdzIHx8IFtdKSk7XG4gICAgICBpZiAoIXJ2IHx8IHR5cGVvZiBydi50aGVuICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHJldHVybiBEZXhpZVByb21pc2UucmVzb2x2ZShydik7XG4gICAgICByZXR1cm4gcnY7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHJlamVjdGlvbihlKTtcbiAgICB9XG4gIH0sXG4gIGN1cnJlbnRUcmFuc2FjdGlvbjoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUFNELnRyYW5zIHx8IG51bGw7XG4gICAgfVxuICB9LFxuICB3YWl0Rm9yOiBmdW5jdGlvbihwcm9taXNlT3JGdW5jdGlvbiwgb3B0aW9uYWxUaW1lb3V0KSB7XG4gICAgdmFyIHByb21pc2UgPSBEZXhpZVByb21pc2UucmVzb2x2ZSh0eXBlb2YgcHJvbWlzZU9yRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIiA/IERleGllLmlnbm9yZVRyYW5zYWN0aW9uKHByb21pc2VPckZ1bmN0aW9uKSA6IHByb21pc2VPckZ1bmN0aW9uKS50aW1lb3V0KG9wdGlvbmFsVGltZW91dCB8fCA2ZTQpO1xuICAgIHJldHVybiBQU0QudHJhbnMgPyBQU0QudHJhbnMud2FpdEZvcihwcm9taXNlKSA6IHByb21pc2U7XG4gIH0sXG4gIFByb21pc2U6IERleGllUHJvbWlzZSxcbiAgZGVidWc6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRlYnVnO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgc2V0RGVidWcodmFsdWUsIHZhbHVlID09PSBcImRleGllXCIgPyBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IDogZGV4aWVTdGFja0ZyYW1lRmlsdGVyKTtcbiAgICB9XG4gIH0sXG4gIGRlcml2ZSxcbiAgZXh0ZW5kLFxuICBwcm9wcyxcbiAgb3ZlcnJpZGUsXG4gIEV2ZW50cyxcbiAgb246IGdsb2JhbEV2ZW50cyxcbiAgbGl2ZVF1ZXJ5LFxuICBleHRlbmRPYnNlcnZhYmlsaXR5U2V0LFxuICBnZXRCeUtleVBhdGgsXG4gIHNldEJ5S2V5UGF0aCxcbiAgZGVsQnlLZXlQYXRoLFxuICBzaGFsbG93Q2xvbmUsXG4gIGRlZXBDbG9uZSxcbiAgZ2V0T2JqZWN0RGlmZixcbiAgYXNhcDogYXNhcCQxLFxuICBtaW5LZXksXG4gIGFkZG9uczogW10sXG4gIGNvbm5lY3Rpb25zLFxuICBlcnJuYW1lcyxcbiAgZGVwZW5kZW5jaWVzOiBkb21EZXBzLFxuICBzZW1WZXI6IERFWElFX1ZFUlNJT04sXG4gIHZlcnNpb246IERFWElFX1ZFUlNJT04uc3BsaXQoXCIuXCIpLm1hcChmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG4pO1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24ocCwgYywgaSkge1xuICAgIHJldHVybiBwICsgYyAvIE1hdGgucG93KDEwLCBpICogMik7XG4gIH0pXG59KSk7XG5EZXhpZS5tYXhLZXkgPSBnZXRNYXhLZXkoRGV4aWUuZGVwZW5kZW5jaWVzLklEQktleVJhbmdlKTtcbmZ1bmN0aW9uIGZpcmVMb2NhbGx5KHVwZGF0ZVBhcnRzKSB7XG4gIHZhciB3YXNNZSA9IHByb3BhZ2F0aW5nTG9jYWxseTtcbiAgdHJ5IHtcbiAgICBwcm9wYWdhdGluZ0xvY2FsbHkgPSB0cnVlO1xuICAgIGdsb2JhbEV2ZW50cy50eGNvbW1pdHRlZC5maXJlKHVwZGF0ZVBhcnRzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBwcm9wYWdhdGluZ0xvY2FsbHkgPSB3YXNNZTtcbiAgfVxufVxudmFyIHByb3BhZ2F0ZUxvY2FsbHkgPSBmaXJlTG9jYWxseTtcbnZhciBwcm9wYWdhdGluZ0xvY2FsbHkgPSBmYWxzZTtcbnZhciBhY2N1bXVsYXRlZFBhcnRzID0ge307XG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgdmFyIGZpcmVJZlZpc2libGVfMSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwidmlzaWJsZVwiKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoYWNjdW11bGF0ZWRQYXJ0cykubGVuZ3RoID4gMCkge1xuICAgICAgICBmaXJlTG9jYWxseShhY2N1bXVsYXRlZFBhcnRzKTtcbiAgICAgIH1cbiAgICAgIGFjY3VtdWxhdGVkUGFydHMgPSB7fTtcbiAgICB9XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIGZpcmVJZlZpc2libGVfMSk7XG4gIHByb3BhZ2F0ZUxvY2FsbHkgPSBmdW5jdGlvbihjaGFuZ2VkUGFydHMpIHtcbiAgICBleHRlbmRPYnNlcnZhYmlsaXR5U2V0KGFjY3VtdWxhdGVkUGFydHMsIGNoYW5nZWRQYXJ0cyk7XG4gICAgZmlyZUlmVmlzaWJsZV8xKCk7XG4gIH07XG59XG5pZiAodHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgdmFyIGJjXzEgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbChcImRleGllLXR4Y29tbWl0dGVkXCIpO1xuICBnbG9iYWxFdmVudHMoXCJ0eGNvbW1pdHRlZFwiLCBmdW5jdGlvbihjaGFuZ2VkUGFydHMpIHtcbiAgICBpZiAoIXByb3BhZ2F0aW5nTG9jYWxseSkge1xuICAgICAgYmNfMS5wb3N0TWVzc2FnZShjaGFuZ2VkUGFydHMpO1xuICAgIH1cbiAgfSk7XG4gIGJjXzEub25tZXNzYWdlID0gZnVuY3Rpb24oZXYpIHtcbiAgICBpZiAoZXYuZGF0YSlcbiAgICAgIHByb3BhZ2F0ZUxvY2FsbHkoZXYuZGF0YSk7XG4gIH07XG59IGVsc2UgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZ2xvYmFsRXZlbnRzKFwidHhjb21taXR0ZWRcIiwgZnVuY3Rpb24oY2hhbmdlZFBhcnRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghcHJvcGFnYXRpbmdMb2NhbGx5KSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZGV4aWUtdHhjb21taXR0ZWRcIiwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHRyaWc6IE1hdGgucmFuZG9tKCksXG4gICAgICAgICAgY2hhbmdlZFBhcnRzXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfYTIpIHtcbiAgICB9XG4gIH0pO1xuICBhZGRFdmVudExpc3RlbmVyKFwic3RvcmFnZVwiLCBmdW5jdGlvbihldikge1xuICAgIGlmIChldi5rZXkgPT09IFwiZGV4aWUtdHhjb21taXR0ZWRcIikge1xuICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGV2Lm5ld1ZhbHVlKTtcbiAgICAgIGlmIChkYXRhKVxuICAgICAgICBwcm9wYWdhdGVMb2NhbGx5KGRhdGEuY2hhbmdlZFBhcnRzKTtcbiAgICB9XG4gIH0pO1xufVxuRGV4aWVQcm9taXNlLnJlamVjdGlvbk1hcHBlciA9IG1hcEVycm9yO1xuc2V0RGVidWcoZGVidWcsIGRleGllU3RhY2tGcmFtZUZpbHRlcik7XG5leHBvcnQgZGVmYXVsdCBEZXhpZSQxO1xuZXhwb3J0IHtEZXhpZSQxIGFzIERleGllLCBSYW5nZVNldCwgbGl2ZVF1ZXJ5LCBtZXJnZVJhbmdlcywgcmFuZ2VzT3ZlcmxhcH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV3b2dJQ0oyWlhKemFXOXVJam9nTXl3S0lDQWljMjkxY21ObGN5STZJRnNpTDJodmJXVXZjblZ1Ym1WeUwzZHZjbXN2Ylc5dVpYa3ZiVzl1WlhrdmJtOWtaVjl0YjJSMWJHVnpMMlJsZUdsbEwyUnBjM1F2WkdWNGFXVXViV3B6SWwwc0NpQWdJbTFoY0hCcGJtZHpJam9nSWtGQllVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCV1VFc1NVRkJTU3hYUVVGWExGZEJRVmM3UVVGRGRFSXNZVUZCVnl4UFFVRlBMRlZCUVZVc2JVSkJRV3RDTEVkQlFVYzdRVUZETjBNc1lVRkJVeXhIUVVGSExFbEJRVWtzUjBGQlJ5eEpRVUZKTEZWQlFWVXNVVUZCVVN4SlFVRkpMRWRCUVVjc1MwRkJTenRCUVVOcVJDeFZRVUZKTEZWQlFWVTdRVUZEWkN4bFFVRlRMRXRCUVVzN1FVRkJSeXhaUVVGSkxFOUJRVThzVlVGQlZTeGxRVUZsTEV0QlFVc3NSMEZCUnp0QlFVRkpMRmxCUVVVc1MwRkJTeXhGUVVGRk8wRkJRVUU3UVVGRk9VVXNWMEZCVHp0QlFVRkJPMEZCUlZnc1UwRkJUeXhUUVVGVExFMUJRVTBzVFVGQlRUdEJRVUZCTzBGQlJXaERMSFZDUVVGMVFpeEpRVUZKTEUxQlFVMDdRVUZETjBJc1YwRkJVeXhKUVVGSkxFZEJRVWNzUzBGQlN5eExRVUZMTEZGQlFWRXNTVUZCU1N4SFFVRkhMRkZCUVZFc1NVRkJTU3hKUVVGSkxFdEJRVXM3UVVGRE1VUXNUMEZCUnl4TFFVRkxMRXRCUVVzN1FVRkRha0lzVTBGQlR6dEJRVUZCTzBGQlIxZ3NTVUZCU1N4UFFVRlBMRTlCUVU4N1FVRkRiRUlzU1VGQlNTeFZRVUZWTEUxQlFVMDdRVUZEY0VJc1NVRkJTU3hWUVVGVkxFOUJRVThzVTBGQlV5eGpRVUZqTEU5QlEzaERMRTlCUVU4c1YwRkJWeXhqUVVGakxGTkJRelZDTzBGQlExSXNTVUZCU1N4UFFVRlBMRmxCUVZrc1pVRkJaU3hEUVVGRExGRkJRVkVzVTBGQlV6dEJRVU53UkN4VlFVRlJMRlZCUVZVN1FVRkJRVHRCUVVWMFFpeG5Ra0ZCWjBJc1MwRkJTeXhYUVVGWE8wRkJRelZDTEUxQlFVa3NUMEZCVHl4alFVRmpPMEZCUTNKQ0xGZEJRVTg3UVVGRFdDeFBRVUZMTEZkQlFWY3NVVUZCVVN4VFFVRlZMRXRCUVVzN1FVRkRia01zVVVGQlNTeFBRVUZQTEZWQlFWVTdRVUZCUVR0QlFVVjZRaXhUUVVGUE8wRkJRVUU3UVVGRldDeEpRVUZKTEZkQlFWY3NUMEZCVHp0QlFVTjBRaXhKUVVGSkxGVkJRVlVzUjBGQlJ6dEJRVU5xUWl4blFrRkJaMElzUzBGQlN5eE5RVUZOTzBGQlEzWkNMRk5CUVU4c1VVRkJVU3hMUVVGTExFdEJRVXM3UVVGQlFUdEJRVVUzUWl4bFFVRmxMRTlCUVU4c1YwRkJWenRCUVVNM1FpeE5RVUZKTEU5QlFVOHNZMEZCWXp0QlFVTnlRaXhuUWtGQldTeFZRVUZWTEZOQlFWTTdRVUZEYmtNc1JVRkJReXhSUVVGUExGbEJRVmtzWTBGQll5eFBRVUZQTEZGQlFWRXNVMEZCVXl4WFFVRlhMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRM2hHTEZsQlFWRXNUMEZCVHl4TFFVRkxMRlZCUVZVN1FVRkJRVHRCUVVGQk8wRkJSM1JETEVsQlFVa3NhVUpCUVdsQ0xFOUJRVTg3UVVGRE5VSXNhVUpCUVdsQ0xFdEJRVXNzVFVGQlRTeHJRa0ZCYTBJc1UwRkJVenRCUVVOdVJDeHBRa0ZCWlN4TFFVRkxMRTFCUVUwc1QwRkJUeXh2UWtGQmIwSXNUMEZCVHl4clFrRkJhMElzVlVGQlZTeFBRVUZQTEdsQ1FVRnBRaXhSUVVGUkxHRkJRM0JJTEVOQlFVVXNTMEZCU3l4cFFrRkJhVUlzUzBGQlN5eExRVUZMTEdsQ1FVRnBRaXhMUVVGTExHTkJRV01zVVVGRGRFVXNRMEZCUlN4UFFVRlBMR3RDUVVGclFpeGpRVUZqTEUxQlFVMHNWVUZCVlN4UFFVRlJPMEZCUVVFN1FVRkZla1VzWjBKQlFXZENMRTlCUVU4N1FVRkRia0lzVTBGQlR6dEJRVUZCTEVsQlEwZ3NUVUZCVFN4VFFVRlZMRkZCUVZFN1FVRkRjRUlzV1VGQlRTeFpRVUZaTEU5QlFVOHNUMEZCVHl4UFFVRlBPMEZCUTNaRExHTkJRVkVzVFVGQlRTeFhRVUZYTEdWQlFXVTdRVUZEZUVNc1lVRkJUenRCUVVGQkxGRkJRMGdzVVVGQlVTeE5RVUZOTEV0QlFVc3NUVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTEwwTXNTVUZCU1N3eVFrRkJNa0lzVDBGQlR6dEJRVU4wUXl3clFrRkJLMElzUzBGQlN5eE5RVUZOTzBGQlEzUkRMRTFCUVVrc1MwRkJTeXg1UWtGQmVVSXNTMEZCU3p0QlFVTjJReXhOUVVGSk8wRkJRMG9zVTBGQlR5eE5RVUZQTEZOQlFWRXNVMEZCVXl4VFFVRlRMSE5DUVVGelFpeFBRVUZQTzBGQlFVRTdRVUZGZWtVc1NVRkJTU3hUUVVGVExFZEJRVWM3UVVGRGFFSXNaVUZCWlN4TlFVRk5MRTlCUVU4c1MwRkJTenRCUVVNM1FpeFRRVUZQTEU5QlFVOHNTMEZCU3l4TlFVRk5MRTlCUVU4N1FVRkJRVHRCUVVWd1F5eHJRa0ZCYTBJc1ZVRkJWU3hyUWtGQmEwSTdRVUZETVVNc1UwRkJUeXhwUWtGQmFVSTdRVUZCUVR0QlFVVTFRaXhuUWtGQlowSXNSMEZCUnp0QlFVTm1MRTFCUVVrc1EwRkJRenRCUVVORUxGVkJRVTBzU1VGQlNTeE5RVUZOTzBGQlFVRTdRVUZGZUVJc1owSkJRV2RDTEVsQlFVazdRVUZEYUVJc1RVRkJTU3hSUVVGUk8wRkJRMUlzYVVKQlFXRTdRVUZCUVR0QlFVVmlMR1ZCUVZjc1NVRkJTVHRCUVVGQk8wRkJSWFpDTEhWQ1FVRjFRaXhQUVVGUExGZEJRVmM3UVVGRGNrTXNVMEZCVHl4TlFVRk5MRTlCUVU4c1UwRkJWU3hSUVVGUkxFMUJRVTBzUjBGQlJ6dEJRVU16UXl4UlFVRkpMR1ZCUVdVc1ZVRkJWU3hOUVVGTk8wRkJRMjVETEZGQlFVazdRVUZEUVN4aFFVRlBMR0ZCUVdFc1RVRkJUU3hoUVVGaE8wRkJRek5ETEZkQlFVODdRVUZCUVN4TFFVTlNPMEZCUVVFN1FVRkZVQ3hyUWtGQmEwSXNTVUZCU1N4VFFVRlRMRTFCUVUwN1FVRkRha01zVFVGQlNUdEJRVU5CTEU5QlFVY3NUVUZCVFN4TlFVRk5PMEZCUVVFc1YwRkZXaXhKUVVGUU8wRkJRMGtzWlVGQlZ5eFJRVUZSTzBGQlFVRTdRVUZCUVR0QlFVY3pRaXh6UWtGQmMwSXNTMEZCU3l4VFFVRlRPMEZCUTJoRExFMUJRVWtzVDBGQlR5eExRVUZMTzBGQlExb3NWMEZCVHl4SlFVRkpPMEZCUTJZc1RVRkJTU3hEUVVGRE8wRkJRMFFzVjBGQlR6dEJRVU5ZTEUxQlFVa3NUMEZCVHl4WlFVRlpMRlZCUVZVN1FVRkROMElzVVVGQlNTeExRVUZMTzBGQlExUXNZVUZCVXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hSUVVGUkxGRkJRVkVzU1VGQlNTeEhRVUZITEVWQlFVVXNSMEZCUnp0QlFVTTFReXhWUVVGSkxFMUJRVTBzWVVGQllTeExRVUZMTEZGQlFWRTdRVUZEY0VNc1UwRkJSeXhMUVVGTE8wRkJRVUU3UVVGRldpeFhRVUZQTzBGQlFVRTdRVUZGV0N4TlFVRkpMRk5CUVZNc1VVRkJVU3hSUVVGUk8wRkJRemRDTEUxQlFVa3NWMEZCVnl4SlFVRkpPMEZCUTJZc1VVRkJTU3hYUVVGWExFbEJRVWtzVVVGQlVTeFBRVUZQTEVkQlFVYzdRVUZEY2tNc1YwRkJUeXhoUVVGaExGTkJRVmtzVTBGQldTeGhRVUZoTEZWQlFWVXNVVUZCVVN4UFFVRlBMRk5CUVZNN1FVRkJRVHRCUVVVdlJpeFRRVUZQTzBGQlFVRTdRVUZGV0N4elFrRkJjMElzUzBGQlN5eFRRVUZUTEU5QlFVODdRVUZEZGtNc1RVRkJTU3hEUVVGRExFOUJRVThzV1VGQldUdEJRVU53UWp0QlFVTktMRTFCUVVrc1kwRkJZeXhWUVVGVkxFOUJRVThzVTBGQlV6dEJRVU40UXp0QlFVTktMRTFCUVVrc1QwRkJUeXhaUVVGWkxGbEJRVmtzV1VGQldTeFRRVUZUTzBGQlEzQkVMRmRCUVU4c1QwRkJUeXhWUVVGVkxGbEJRVmtzV1VGQldUdEJRVU5vUkN4aFFVRlRMRWxCUVVrc1IwRkJSeXhKUVVGSkxGRkJRVkVzVVVGQlVTeEpRVUZKTEVkQlFVY3NSVUZCUlN4SFFVRkhPMEZCUXpWRExHMUNRVUZoTEV0QlFVc3NVVUZCVVN4SlFVRkpMRTFCUVUwN1FVRkJRVHRCUVVGQkxGTkJSM1pETzBGQlEwUXNVVUZCU1N4VFFVRlRMRkZCUVZFc1VVRkJVVHRCUVVNM1FpeFJRVUZKTEZkQlFWY3NTVUZCU1R0QlFVTm1MRlZCUVVrc2FVSkJRV2xDTEZGQlFWRXNUMEZCVHl4SFFVRkhPMEZCUTNaRExGVkJRVWtzYlVKQlFXMUNMRkZCUVZFc1QwRkJUeXhUUVVGVE8wRkJReTlETEZWQlFVa3NjVUpCUVhGQ08wRkJRM0pDTEZsQlFVa3NWVUZCVlN4UlFVRlhPMEZCUTNKQ0xHTkJRVWtzVVVGQlVTeFJRVUZSTEVOQlFVTXNUVUZCVFN4VFFVRlRPMEZCUTJoRExHZENRVUZKTEU5QlFVOHNaMEpCUVdkQ08wRkJRVUU3UVVGRk0wSXNiVUpCUVU4c1NVRkJTVHRCUVVGQk8wRkJSMllzWTBGQlNTeHJRa0ZCYTBJN1FVRkJRU3hYUVVONlFqdEJRVU5FTEZsQlFVa3NWMEZCVnl4SlFVRkpPMEZCUTI1Q0xGbEJRVWtzUTBGQlF6dEJRVU5FTEhGQ1FVRlpMRWxCUVVrc2EwSkJRV3RDTzBGQlEzUkRMSEZDUVVGaExGVkJRVlVzYTBKQlFXdENPMEZCUVVFN1FVRkJRU3hYUVVjMVF6dEJRVU5FTEZWQlFVa3NWVUZCVlN4UlFVRlhPMEZCUTNKQ0xGbEJRVWtzVVVGQlVTeFJRVUZSTEVOQlFVTXNUVUZCVFN4VFFVRlRPMEZCUTJoRExHTkJRVWtzVDBGQlR5eFRRVUZUTzBGQlFVRTdRVUZGY0VJc2FVSkJRVThzU1VGQlNUdEJRVUZCTzBGQlIyWXNXVUZCU1N4WFFVRlhPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTUzlDTEhOQ1FVRnpRaXhMUVVGTExGTkJRVk03UVVGRGFFTXNUVUZCU1N4UFFVRlBMRmxCUVZrN1FVRkRia0lzYVVKQlFXRXNTMEZCU3l4VFFVRlRPMEZCUVVFc1YwRkRkRUlzV1VGQldUdEJRVU5xUWl4UFFVRkhMRWxCUVVrc1MwRkJTeXhUUVVGVExGTkJRVlVzU1VGQlNUdEJRVU12UWl4dFFrRkJZU3hMUVVGTExFbEJRVWs3UVVGQlFUdEJRVUZCTzBGQlIyeERMSE5DUVVGelFpeExRVUZMTzBGQlEzWkNMRTFCUVVrc1MwRkJTenRCUVVOVUxGZEJRVk1zUzBGQlN5eExRVUZMTzBGQlEyWXNVVUZCU1N4UFFVRlBMRXRCUVVzN1FVRkRXaXhUUVVGSExFdEJRVXNzU1VGQlNUdEJRVUZCTzBGQlJYQkNMRk5CUVU4N1FVRkJRVHRCUVVWWUxFbEJRVWtzVTBGQlV5eEhRVUZITzBGQlEyaENMR2xDUVVGcFFpeEhRVUZITzBGQlEyaENMRk5CUVU4c1QwRkJUeXhOUVVGTkxFbEJRVWs3UVVGQlFUdEJRVVUxUWl4SlFVRkpMSEZDUVVGeFFpd3JTRUZEY0VJc1RVRkJUU3hMUVVGTExFOUJRVThzVVVGQlVTeERRVUZETEVkQlFVY3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTU3hUUVVGVkxFdEJRVXM3UVVGQlJTeFRRVUZQTEVOQlFVTXNUMEZCVHl4UlFVRlJMRk5CUVZNc1NVRkJTU3hUUVVGVkxFZEJRVWM3UVVGQlJTeFhRVUZQTEVsQlFVa3NUVUZCVFR0QlFVRkJPMEZCUVVFc1MwRkJhMElzVDBGQlR5eFRRVUZWTEVkQlFVYzdRVUZCUlN4VFFVRlBMRkZCUVZFN1FVRkJRVHRCUVVNdlRDeEpRVUZKTEdsQ1FVRnBRaXh0UWtGQmJVSXNTVUZCU1N4VFFVRlZMRWRCUVVjN1FVRkJSU3hUUVVGUExGRkJRVkU3UVVGQlFUdEJRVU14UlN4SlFVRkpMSFZDUVVGMVFpeGpRVUZqTEc5Q1FVRnZRaXhUUVVGVkxFZEJRVWM3UVVGQlJTeFRRVUZQTEVOQlFVTXNSMEZCUnp0QlFVRkJPMEZCUTNaR0xFbEJRVWtzWlVGQlpUdEJRVU51UWl4dFFrRkJiVUlzUzBGQlN6dEJRVU53UWl4cFFrRkJaU3hQUVVGUExGbEJRVmtzWlVGQlpTeEpRVUZKTzBGQlEzSkVMRTFCUVVrc1MwRkJTeXhsUVVGbE8wRkJRM2hDTEdsQ1FVRmxPMEZCUTJZc1UwRkJUenRCUVVGQk8wRkJSVmdzZDBKQlFYZENMRXRCUVVzN1FVRkRla0lzVFVGQlNTeERRVUZETEU5QlFVOHNUMEZCVHl4UlFVRlJPMEZCUTNaQ0xGZEJRVTg3UVVGRFdDeE5RVUZKTEV0QlFVc3NaMEpCUVdkQ0xHRkJRV0VzU1VGQlNUdEJRVU14UXl4TlFVRkpPMEZCUTBFc1YwRkJUenRCUVVOWUxFMUJRVWtzVVVGQlVTeE5RVUZOTzBGQlEyUXNVMEZCU3p0QlFVTk1MRzlDUVVGblFpeGhRVUZoTEVsQlFVa3NTMEZCU3p0QlFVTjBReXhoUVVGVExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NVVUZCVVN4SlFVRkpMRWRCUVVjc1JVRkJSU3hIUVVGSE8wRkJRM2hETEZOQlFVY3NTMEZCU3l4bFFVRmxMRWxCUVVrN1FVRkJRVHRCUVVGQkxHRkJSekZDTEdWQlFXVXNVVUZCVVN4SlFVRkpMR2RDUVVGblFpeEhRVUZITzBGQlEyNUVMRk5CUVVzN1FVRkJRU3hUUVVWS08wRkJRMFFzVVVGQlNTeFJRVUZSTEZOQlFWTTdRVUZEY2tJc1UwRkJTeXhWUVVGVkxFOUJRVThzV1VGQldTeExRVUZMTEU5QlFVOHNUMEZCVHp0QlFVTnlSQ3h2UWtGQlowSXNZVUZCWVN4SlFVRkpMRXRCUVVzN1FVRkRkRU1zWVVGQlV5eFJRVUZSTEV0QlFVczdRVUZEYkVJc1ZVRkJTU3hQUVVGUExFdEJRVXNzVDBGQlR6dEJRVU51UWl4WFFVRkhMRkZCUVZFc1pVRkJaU3hKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNURkRMRk5CUVU4N1FVRkJRVHRCUVVWWUxFbEJRVWtzVjBGQlZ5eEhRVUZITzBGQlEyeENMSEZDUVVGeFFpeEhRVUZITzBGQlEzQkNMRk5CUVU4c1UwRkJVeXhMUVVGTExFZEJRVWNzVFVGQlRTeEhRVUZITzBGQlFVRTdRVUZGY2tNc1NVRkJTU3hoUVVGaExGTkJRVlVzUzBGQlN5eE5RVUZOTzBGQlEyeERMRk5CUVU4c1UwRkJVeXhWUVVGVkxFdEJRVXNzU1VGQlNTeEpRVUZKTEZOQlFWVXNSMEZCUnp0QlFVRkZMRmRCUVU4c1YwRkJWeXhIUVVGSExGbEJRVms3UVVGQlFTeFBRVU51Uml4VFFVRlRMR2RDUVVGblFpeExRVUZMTEVsQlFVa3NWMEZCVnl4UFFVTjZReXhUUVVGVExGTkJRVk1zU1VGQlNTeFpRVU5zUWl4WlFVRlpMRTlCUVU4c1QwRkJUeXhMUVVGTExFbEJRVWtzVjBGQlZ5eEpRVUZKTEZWQlF6bERPMEZCUVVFN1FVRkZjRUlzZFVKQlFYVkNMRWRCUVVjc1IwRkJSeXhKUVVGSkxFMUJRVTA3UVVGRGJrTXNUMEZCU3l4TlFVRk5PMEZCUTFnc1UwRkJUeXhSUVVGUk8wRkJRMllzVDBGQlN5eEhRVUZITEZGQlFWRXNVMEZCVlN4TlFVRk5PMEZCUXpWQ0xGRkJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVYzdRVUZEV0N4VFFVRkhMRTlCUVU4c1VVRkJVVHRCUVVGQkxGTkJRMnBDTzBGQlEwUXNWVUZCU1N4TFFVRkxMRVZCUVVVc1QwRkJUeXhMUVVGTExFVkJRVVU3UVVGRGVrSXNWVUZCU1N4UFFVRlBMRTlCUVU4c1dVRkJXU3hQUVVGUExFOUJRVThzV1VGQldTeE5RVUZOTEVsQlFVazdRVUZET1VRc1dVRkJTU3hoUVVGaExGbEJRVms3UVVGRE4wSXNXVUZCU1N4aFFVRmhMRmxCUVZrN1FVRkROMElzV1VGQlNTeGxRVUZsTEZsQlFWazdRVUZETTBJc1kwRkJTU3h4UWtGQmNVSXNaVUZCWlN4UlFVRlJMRXRCUVVzN1FVRkRha1FzWjBKQlFVa3NWMEZCVnl4SlFVRkpMR2RDUVVGblFpeFhRVUZYTEVsQlFVa3NZVUZCWVR0QlFVTXpSQ3hwUWtGQlJ5eFBRVUZQTEZGQlFWRXNSVUZCUlR0QlFVRkJPMEZCUVVFc2FVSkJSM1pDTzBGQlEwUXNNRUpCUVdNc1NVRkJTU3hKUVVGSkxFbEJRVWtzVDBGQlR5eFBRVUZQTzBGQlFVRTdRVUZCUVN4bFFVY3pRenRCUVVORUxHRkJRVWNzVDBGQlR5eFJRVUZSTEVWQlFVVTdRVUZCUVR0QlFVRkJMR2xDUVVkdVFpeFBRVUZQTzBGQlExb3NWMEZCUnl4UFFVRlBMRkZCUVZFc1JVRkJSVHRCUVVGQk8wRkJRVUU3UVVGSGFFTXNUMEZCU3l4SFFVRkhMRkZCUVZFc1UwRkJWU3hOUVVGTk8wRkJRelZDTEZGQlFVa3NRMEZCUXl4UFFVRlBMRWRCUVVjc1QwRkJUenRCUVVOc1FpeFRRVUZITEU5QlFVOHNVVUZCVVN4RlFVRkZPMEZCUVVFN1FVRkJRVHRCUVVjMVFpeFRRVUZQTzBGQlFVRTdRVUZGV0N4SlFVRkpMR2xDUVVGcFFpeFBRVUZQTEZkQlFWY3NZMEZEYmtNc1QwRkJUeXhYUVVOUU8wRkJRMG9zU1VGQlNTeG5Ra0ZCWjBJc1QwRkJUeXh0UWtGQmJVSXNWMEZCVnl4VFFVRlZMRWRCUVVjN1FVRkRiRVVzVFVGQlNUdEJRVU5LTEZOQlFVOHNTMEZCU3l4UlFVRlRMRXRCUVVrc1JVRkJSU3h2UWtGQmIwSXNSVUZCUlN4TlFVRk5PMEZCUVVFc1NVRkRka1FzVjBGQldUdEJRVUZGTEZOQlFVODdRVUZCUVR0QlFVTjZRaXhKUVVGSkxHZENRVUZuUWp0QlFVTndRaXh2UWtGQmIwSXNWMEZCVnp0QlFVTXpRaXhOUVVGSkxFZEJRVWNzUjBGQlJ5eEhRVUZITzBGQlEySXNUVUZCU1N4VlFVRlZMRmRCUVZjc1IwRkJSenRCUVVONFFpeFJRVUZKTEZGQlFWRTdRVUZEVWl4aFFVRlBMRlZCUVZVN1FVRkRja0lzVVVGQlNTeFRRVUZUTEdsQ1FVRnBRaXhQUVVGUExHTkJRV003UVVGREwwTXNZVUZCVHl4RFFVRkRPMEZCUTFvc1VVRkJTeXhMUVVGTExHTkJRV01zV1VGQllUdEJRVU5xUXl4VlFVRkpPMEZCUTBvc1lVRkJVU3hKUVVGSkxFZEJRVWNzVVVGQlV5eERRVUZETEVWQlFVVTdRVUZEZGtJc1ZVRkJSU3hMUVVGTExFVkJRVVU3UVVGRFlpeGhRVUZQTzBGQlFVRTdRVUZGV0N4UlFVRkpMR0ZCUVdFN1FVRkRZaXhoUVVGUExFTkJRVU03UVVGRFdpeFJRVUZKTEZWQlFWVTdRVUZEWkN4UlFVRkpMRTlCUVU4c1RVRkJUU3hWUVVGVk8wRkJRM1pDTEZWQlFVa3NTVUZCU1N4TlFVRk5PMEZCUTJRc1lVRkJUenRCUVVOSUxGVkJRVVVzUzBGQlN5eFZRVUZWTzBGQlEzSkNMR0ZCUVU4N1FVRkJRVHRCUVVWWUxGZEJRVThzUTBGQlF6dEJRVUZCTzBGQlJWb3NUVUZCU1N4VlFVRlZPMEZCUTJRc1RVRkJTU3hKUVVGSkxFMUJRVTA3UVVGRFpDeFRRVUZQTzBGQlEwZ3NUVUZCUlN4TFFVRkxMRlZCUVZVN1FVRkRja0lzVTBGQlR6dEJRVUZCTzBGQlJWZ3NTVUZCU1N4clFrRkJhMElzVDBGQlR5eFhRVUZYTEdOQlEyeERMRk5CUVZVc1NVRkJTVHRCUVVGRkxGTkJRVThzUjBGQlJ5eFBRVUZQTEdsQ1FVRnBRanRCUVVGQkxFbEJRMnhFTEZkQlFWazdRVUZCUlN4VFFVRlBPMEZCUVVFN1FVRkZNMElzU1VGQlNTeFJRVUZSTEU5QlFVOHNZVUZCWVN4bFFVTTFRaXcyUTBGQk5rTXNTMEZCU3l4VFFVRlRPMEZCUXk5RUxHdENRVUZyUWl4UFFVRlBMRkZCUVZFN1FVRkROMElzVlVGQlVUdEJRVU5TTEd0Q1FVRm5RanRCUVVGQk8wRkJSWEJDTEVsQlFVa3NaMEpCUVdkQ0xGZEJRVms3UVVGQlJTeFRRVUZQTzBGQlFVRTdRVUZEZWtNc1NVRkJTU3gzUWtGQmQwSXNRMEZCUXl4SlFVRkpMRTFCUVUwc1NVRkJTVHRCUVVNelF5dzJRa0ZCTmtJN1FVRkRla0lzVFVGQlNUdEJRVU5CTEZGQlFVazdRVUZEUVN4M1FrRkJhMEk3UVVGRGJFSXNXVUZCVFN4SlFVRkpPMEZCUVVFc1lVRkZVQ3hIUVVGUU8wRkJRMGtzWVVGQlR6dEJRVUZCTzBGQlJXWXNVMEZCVHl4SlFVRkpPMEZCUVVFN1FVRkZaaXh4UWtGQmNVSXNWMEZCVnl4clFrRkJhMEk3UVVGRE9VTXNUVUZCU1N4UlFVRlJMRlZCUVZVN1FVRkRkRUlzVFVGQlNTeERRVUZETzBGQlEwUXNWMEZCVHp0QlFVTllMSEZDUVVGdlFpeHZRa0ZCYjBJN1FVRkRlRU1zVFVGQlNTeE5RVUZOTEZGQlFWRXNWVUZCVlN4VlFVRlZPMEZCUTJ4RExIZENRVUZ4UWl4WFFVRlZMRTlCUVU4c1ZVRkJWU3hUUVVGVExFMUJRVTBzVFVGQlRUdEJRVU42UlN4VFFVRlBMRTFCUVUwc1RVRkJUU3hOUVVOa0xFMUJRVTBzYTBKQlEwNHNUMEZCVHl4bFFVTlFMRWxCUVVrc1UwRkJWU3hQUVVGUE8wRkJRVVVzVjBGQlR5eFBRVUZQTzBGQlFVRXNTMEZEY2tNc1MwRkJTenRCUVVGQk8wRkJSMlFzU1VGQlNTeHJRa0ZCYTBJN1FVRkJRU3hGUVVOc1FqdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJPMEZCUlVvc1NVRkJTU3h0UWtGQmJVSTdRVUZCUVN4RlFVTnVRanRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRVHRCUVVWS0xFbEJRVWtzV1VGQldTeG5Ra0ZCWjBJc1QwRkJUenRCUVVOMlF5eEpRVUZKTEdWQlFXVTdRVUZCUVN4RlFVTm1MR2RDUVVGblFqdEJRVUZCTEVWQlEyaENMR2RDUVVGblFqdEJRVUZCTEVWQlEyaENMRTlCUVU4N1FVRkJRU3hGUVVOUUxIRkNRVUZ4UWp0QlFVRkJMRVZCUTNKQ0xGbEJRVms3UVVGQlFUdEJRVVZvUWl4dlFrRkJiMElzVFVGQlRTeExRVUZMTzBGQlF6TkNMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzVDBGQlR6dEJRVU5hTEU5QlFVc3NWVUZCVlR0QlFVRkJPMEZCUlc1Q0xFOUJRVThzV1VGQldTeExRVUZMTEU5QlFVOHNUMEZCVHp0QlFVRkJMRVZCUTJ4RExFOUJRVTg3UVVGQlFTeEpRVU5JTEV0QlFVc3NWMEZCV1R0QlFVTmlMR0ZCUVU4c1MwRkJTeXhWUVVOUUxFMUJRVXNzVTBGQlV5eExRVUZMTEU5QlFVOHNUMEZCVHl4TFFVRkxMRlZCUVZVc1dVRkJXU3hMUVVGTExFbEJRVWs3UVVGQlFUdEJRVUZCTzBGQlFVRXNSVUZIYkVZc1ZVRkJWU3hYUVVGWk8wRkJRVVVzVjBGQlR5eExRVUZMTEU5QlFVOHNUMEZCVHl4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVVelJDdzRRa0ZCT0VJc1MwRkJTeXhWUVVGVk8wRkJRM3BETEZOQlFVOHNUVUZCVFN4bFFVRmxMRTlCUVU4c1MwRkJTeXhWUVVOdVF5eEpRVUZKTEZOQlFWVXNTMEZCU3p0QlFVRkZMRmRCUVU4c1UwRkJVeXhMUVVGTE8wRkJRVUVzUzBGRE1VTXNUMEZCVHl4VFFVRlZMRWRCUVVjc1IwRkJSeXhIUVVGSE8wRkJRVVVzVjBGQlR5eEZRVUZGTEZGQlFWRXNUMEZCVHp0QlFVRkJMRXRCUTNCRUxFdEJRVXM3UVVGQlFUdEJRVVZrTEhGQ1FVRnhRaXhMUVVGTExGVkJRVlVzWTBGQll5eFpRVUZaTzBGQlF6RkVMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzVjBGQlZ6dEJRVU5vUWl4UFFVRkxMR0ZCUVdFN1FVRkRiRUlzVDBGQlN5eGxRVUZsTzBGQlEzQkNMRTlCUVVzc1ZVRkJWU3h4UWtGQmNVSXNTMEZCU3p0QlFVRkJPMEZCUlRkRExFOUJRVThzWVVGQllTeExRVUZMTzBGQlEzcENMRzFDUVVGdFFpeExRVUZMTEZWQlFWVTdRVUZET1VJc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eFBRVUZQTzBGQlExb3NUMEZCU3l4WFFVRlhMRTlCUVU4c1MwRkJTeXhWUVVGVkxFbEJRVWtzVTBGQlZTeExRVUZMTzBGQlFVVXNWMEZCVHl4VFFVRlRPMEZCUVVFN1FVRkRNMFVzVDBGQlN5eG5Ra0ZCWjBJN1FVRkRja0lzVDBGQlN5eFZRVUZWTEhGQ1FVRnhRaXhMUVVGTE8wRkJRVUU3UVVGRk4wTXNUMEZCVHl4WFFVRlhMRXRCUVVzN1FVRkRka0lzU1VGQlNTeFhRVUZYTEZWQlFWVXNUMEZCVHl4VFFVRlZMRXRCUVVzc1RVRkJUVHRCUVVGRkxGTkJRVkVzU1VGQlNTeFJRVUZSTEU5QlFVOHNVMEZCVXp0QlFVRkJMRWRCUVZNN1FVRkRjRWNzU1VGQlNTeG5Ra0ZCWjBJN1FVRkRjRUlzU1VGQlNTeGhRVUZoTEZWQlFWVXNUMEZCVHl4VFFVRlZMRXRCUVVzc1RVRkJUVHRCUVVOdVJDeE5RVUZKTEZkQlFWY3NUMEZCVHp0QlFVTjBRaXgxUWtGQmIwSXNXVUZCV1N4UFFVRlBPMEZCUTI1RExGTkJRVXNzUzBGQlN6dEJRVU5XTEZOQlFVc3NUMEZCVHp0QlFVTmFMRkZCUVVrc1EwRkJReXhaUVVGWk8wRkJRMklzVjBGQlN5eFZRVUZWTEdGQlFXRXNVMEZCVXp0QlFVTnlReXhYUVVGTExGRkJRVkU3UVVGQlFTeGxRVVZTTEU5QlFVOHNaVUZCWlN4VlFVRlZPMEZCUTNKRExGZEJRVXNzVlVGQlZTeExRVUZMTEdGQlFXTXNSVUZCUXl4UlFVRlJMRXRCUVVzc1VVRkJVVHRCUVVONFJDeFhRVUZMTEZGQlFWRXNVMEZCVXp0QlFVRkJMR1ZCUldwQ0xFOUJRVThzWlVGQlpTeFZRVUZWTzBGQlEzSkRMRmRCUVVzc1ZVRkJWU3hYUVVGWExFOUJRVThzVFVGQlRTeFhRVUZYTzBGQlEyeEVMRmRCUVVzc1VVRkJVVHRCUVVGQk8wRkJRVUU3UVVGSGNrSXNVMEZCVHl4aFFVRlpMRXRCUVVzN1FVRkRlRUlzVFVGQlNTeFJRVUZSTzBGQlExb3NVMEZCVHp0QlFVRkJMRWRCUTFJN1FVRkRTQ3hYUVVGWExGTkJRVk03UVVGRGNFSXNWMEZCVnl4UFFVRlBPMEZCUTJ4Q0xGZEJRVmNzVVVGQlVUdEJRVU51UWl4SlFVRkpMR1ZCUVdVc2FVSkJRV2xDTEU5QlFVOHNVMEZCVlN4TFFVRkxMRTFCUVUwN1FVRkROVVFzVFVGQlNTeFBRVUZQTEZkQlFWY3NWMEZCVnp0QlFVTnFReXhUUVVGUE8wRkJRVUVzUjBGRFVqdEJRVU5JTEd0Q1FVRnJRaXhWUVVGVkxGTkJRVk03UVVGRGFrTXNUVUZCU1N4RFFVRkRMRmxCUVZrc2IwSkJRVzlDTEdOQlFXTXNiMEpCUVc5Q0xHRkJRV0VzYjBKQlFXOUNMR1ZCUVdVc1EwRkJReXhUUVVGVExGRkJRVkVzUTBGQlF5eGhRVUZoTEZOQlFWTTdRVUZETlVvc1YwRkJUenRCUVVOWUxFMUJRVWtzUzBGQlN5eEpRVUZKTEdGQlFXRXNVMEZCVXl4TlFVRk5MRmRCUVZjc1UwRkJVeXhUUVVGVE8wRkJRM1JGTEUxQlFVa3NWMEZCVnl4VlFVRlZPMEZCUTNKQ0xGbEJRVkVzU1VGQlNTeFRRVUZUTEVOQlFVVXNTMEZCU3l4WFFVRlpPMEZCUTJoRExHRkJRVThzUzBGQlN5eE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVYzVRaXhUUVVGUE8wRkJRVUU3UVVGRldDeEpRVUZKTEhGQ1FVRnhRaXhWUVVGVkxFOUJRVThzVTBGQlZTeExRVUZMTEUxQlFVMDdRVUZETTBRc1RVRkJTU3hEUVVGRExGVkJRVlVzVVVGQlVTeFRRVUZUTEZGQlFWRXNWVUZCVlR0QlFVTTVReXhSUVVGSkxFOUJRVThzVjBGQlZ5eFhRVUZYTzBGQlEzSkRMRk5CUVU4N1FVRkJRU3hIUVVOU08wRkJRMGdzYlVKQlFXMUNMR05CUVdNN1FVRkRha01zYlVKQlFXMUNMR0ZCUVdFN1FVRkRhRU1zYlVKQlFXMUNMRmxCUVZrN1FVRkZMMElzWlVGQlpUdEJRVUZCTzBGQlEyWXNaMEpCUVdkQ0xFdEJRVXM3UVVGQlJTeFRRVUZQTzBGQlFVRTdRVUZET1VJc01rSkJRVEpDTEVsQlFVa3NTVUZCU1R0QlFVTXZRaXhOUVVGSkxFMUJRVTBzVVVGQlVTeFBRVUZQTzBGQlEzSkNMRmRCUVU4N1FVRkRXQ3hUUVVGUExGTkJRVlVzUzBGQlN6dEJRVU5zUWl4WFFVRlBMRWRCUVVjc1IwRkJSenRCUVVGQk8wRkJRVUU3UVVGSGNrSXNhMEpCUVd0Q0xFdEJRVXNzUzBGQlN6dEJRVU40UWl4VFFVRlBMRmRCUVZrN1FVRkRaaXhSUVVGSkxFMUJRVTBzVFVGQlRUdEJRVU5vUWl4UlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGSGVFSXNNa0pCUVRKQ0xFbEJRVWtzU1VGQlNUdEJRVU12UWl4TlFVRkpMRTlCUVU4N1FVRkRVQ3hYUVVGUE8wRkJRMWdzVTBGQlR5eFhRVUZaTzBGQlEyWXNVVUZCU1N4TlFVRk5MRWRCUVVjc1RVRkJUU3hOUVVGTk8wRkJRM3BDTEZGQlFVa3NVVUZCVVR0QlFVTlNMR2RDUVVGVkxFdEJRVXM3UVVGRGJrSXNVVUZCU1N4WlFVRlpMRXRCUVVzc1YwRkRja0lzVlVGQlZTeExRVUZMTzBGQlEyWXNVMEZCU3l4WlFVRlpPMEZCUTJwQ0xGTkJRVXNzVlVGQlZUdEJRVU5tTEZGQlFVa3NUMEZCVHl4SFFVRkhMRTFCUVUwc1RVRkJUVHRCUVVNeFFpeFJRVUZKTzBGQlEwRXNWMEZCU3l4WlFVRlpMRXRCUVVzc1dVRkJXU3hUUVVGVExGZEJRVmNzUzBGQlN5eGhRVUZoTzBGQlF6VkZMRkZCUVVrN1FVRkRRU3hYUVVGTExGVkJRVlVzUzBGQlN5eFZRVUZWTEZOQlFWTXNVMEZCVXl4TFFVRkxMRmRCUVZjN1FVRkRjRVVzVjBGQlR5eFRRVUZUTEZOQlFWa3NUMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkhNME1zTWtKQlFUSkNMRWxCUVVrc1NVRkJTVHRCUVVNdlFpeE5RVUZKTEU5QlFVODdRVUZEVUN4WFFVRlBPMEZCUTFnc1UwRkJUeXhYUVVGWk8wRkJRMllzVDBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZEWml4UlFVRkpMRmxCUVZrc1MwRkJTeXhYUVVOeVFpeFZRVUZWTEV0QlFVczdRVUZEWml4VFFVRkxMRmxCUVZrc1MwRkJTeXhWUVVGVk8wRkJRMmhETEU5QlFVY3NUVUZCVFN4TlFVRk5PMEZCUTJZc1VVRkJTVHRCUVVOQkxGZEJRVXNzV1VGQldTeExRVUZMTEZsQlFWa3NVMEZCVXl4WFFVRlhMRXRCUVVzc1lVRkJZVHRCUVVNMVJTeFJRVUZKTzBGQlEwRXNWMEZCU3l4VlFVRlZMRXRCUVVzc1ZVRkJWU3hUUVVGVExGTkJRVk1zUzBGQlN5eFhRVUZYTzBGQlFVRTdRVUZCUVR0QlFVYzFSU3d5UWtGQk1rSXNTVUZCU1N4SlFVRkpPMEZCUXk5Q0xFMUJRVWtzVDBGQlR6dEJRVU5RTEZkQlFVODdRVUZEV0N4VFFVRlBMRk5CUVZVc1pVRkJaVHRCUVVNMVFpeFJRVUZKTEUxQlFVMHNSMEZCUnl4TlFVRk5MRTFCUVUwN1FVRkRla0lzVjBGQlR5eGxRVUZsTzBGQlEzUkNMRkZCUVVrc1dVRkJXU3hMUVVGTExGZEJRM0pDTEZWQlFWVXNTMEZCU3p0QlFVTm1MRk5CUVVzc1dVRkJXVHRCUVVOcVFpeFRRVUZMTEZWQlFWVTdRVUZEWml4UlFVRkpMRTlCUVU4c1IwRkJSeXhOUVVGTkxFMUJRVTA3UVVGRE1VSXNVVUZCU1R0QlFVTkJMRmRCUVVzc1dVRkJXU3hMUVVGTExGbEJRVmtzVTBGQlV5eFhRVUZYTEV0QlFVc3NZVUZCWVR0QlFVTTFSU3hSUVVGSk8wRkJRMEVzVjBGQlN5eFZRVUZWTEV0QlFVc3NWVUZCVlN4VFFVRlRMRk5CUVZNc1MwRkJTeXhYUVVGWE8wRkJRM0JGTEZkQlFVOHNVVUZCVVN4VFFVTldMRk5CUVZNc1UwRkJXU3hUUVVGWkxFOUJRMnBETEU5QlFVOHNTMEZCU3p0QlFVRkJPMEZCUVVFN1FVRkhla0lzYjBOQlFXOURMRWxCUVVrc1NVRkJTVHRCUVVONFF5eE5RVUZKTEU5QlFVODdRVUZEVUN4WFFVRlBPMEZCUTFnc1UwRkJUeXhYUVVGWk8wRkJRMllzVVVGQlNTeEhRVUZITEUxQlFVMHNUVUZCVFN4bFFVRmxPMEZCUXpsQ0xHRkJRVTg3UVVGRFdDeFhRVUZQTEVkQlFVY3NUVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVjNVFpeDVRa0ZCZVVJc1NVRkJTU3hKUVVGSk8wRkJRemRDTEUxQlFVa3NUMEZCVHp0QlFVTlFMRmRCUVU4N1FVRkRXQ3hUUVVGUExGZEJRVms3UVVGRFppeFJRVUZKTEUxQlFVMHNSMEZCUnl4TlFVRk5MRTFCUVUwN1FVRkRla0lzVVVGQlNTeFBRVUZQTEU5QlFVOHNTVUZCU1N4VFFVRlRMRmxCUVZrN1FVRkRka01zVlVGQlNTeFBRVUZQTEUxQlFVMHNTVUZCU1N4VlFVRlZMRkZCUVZFc1QwRkJUeXhKUVVGSkxFMUJRVTA3UVVGRGVFUXNZVUZCVHp0QlFVTklMR0ZCUVVzc1MwRkJTeXhWUVVGVk8wRkJRM2hDTEdGQlFVOHNTVUZCU1N4TFFVRkxMRmRCUVZrN1FVRkRlRUlzWlVGQlR5eEhRVUZITEUxQlFVMHNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkhPVUlzVjBGQlR5eEhRVUZITEUxQlFVMHNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkpPVUlzU1VGQlNTeFhRVUZYTzBGQlEyWXNTVUZCU1N4NVFrRkJlVUlzUzBGRE4wSXNhMEpCUVd0Q0xFbEJRVWtzYTBKQlFXdENMRXRCUVVzc1QwRkJUeXhQUVVGUExGbEJRVmtzWTBGRGJrVXNTMEZEUXl4WFFVRlpPMEZCUTFRc1RVRkJTU3hWUVVGVkxGRkJRVkU3UVVGRGRFSXNUVUZCU1N4UFFVRlBMRmRCUVZjc1pVRkJaU3hEUVVGRExFOUJRVTg3UVVGRGVrTXNWMEZCVHl4RFFVRkRMRk5CUVZNc1UwRkJVeXhWUVVGVk8wRkJRM2hETEUxQlFVa3NWVUZCVlN4UFFVRlBMRTlCUVU4c1QwRkJUeXhYUVVGWExFbEJRVWtzVjBGQlZ5eERRVUZETzBGQlF6bEVMRk5CUVU4N1FVRkJRU3hKUVVOSU8wRkJRVUVzU1VGRFFTeFRRVUZUTzBGQlFVRXNTVUZEVkR0QlFVRkJPMEZCUVVFc1MwRkZSaXgzUWtGQmQwSXNTMEZCU3l4SlFVRkpMSEZDUVVGeFFpeExRVUZMTEVsQlFVa3NkMEpCUVhkQ0xFdEJRVXNzU1VGQlNTeHZRa0ZCYjBJc2MwSkJRWE5DTEcxQ1FVRnRRanRCUVVOMlN5eEpRVUZKTEdkQ1FVRm5RaXg1UWtGQmVVSXNjMEpCUVhOQ08wRkJRMjVGTEVsQlFVa3NjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6dEJRVU16UWl4SlFVRkpMSGRDUVVGM1FqdEJRVU0xUWl4SlFVRkpMSFZDUVVGMVFpeDNRa0ZEZGtJc1YwRkJXVHRCUVVGRkxIZENRVUZ6UWl4TFFVRkxPMEZCUVVFc1NVRkZja01zVVVGQlVTeGxRVU5LTEdGQlFXRXNTMEZCU3l4TlFVRk5MR2RDUVVONFFpeFJRVUZSTEcxQ1FVTktMRmRCUVZrN1FVRkRVaXhOUVVGSkxGbEJRVmtzVTBGQlV5eGpRVUZqTzBGQlEzWkRMRVZCUVVNc1NVRkJTU3hwUWtGQmFVSXNWMEZCV1R0QlFVTTVRanRCUVVOQkxHZENRVUZaTzBGQlFVRXNTMEZEV2l4UlFVRlJMRmRCUVZjc1EwRkJSU3haUVVGWk8wRkJRM0pETEZsQlFWVXNZVUZCWVN4TFFVRkxPMEZCUVVFc1NVRkZhRU1zVjBGQldUdEJRVUZGTEdGQlFWY3NZMEZCWXp0QlFVRkJPMEZCUTNaRUxFbEJRVWtzVDBGQlR5eFRRVUZWTEZWQlFWVXNUVUZCVFR0QlFVTnFReXhwUWtGQlpTeExRVUZMTEVOQlFVTXNWVUZCVlR0QlFVTXZRaXhOUVVGSkxITkNRVUZ6UWp0QlFVTjBRanRCUVVOQkxESkNRVUYxUWp0QlFVRkJPMEZCUVVFN1FVRkhMMElzU1VGQlNTeHhRa0ZCY1VJc1RVRkRla0lzZFVKQlFYVkNMRTFCUTNaQ0xHdENRVUZyUWl4SlFVTnNRaXhyUWtGQmEwSXNTVUZEYkVJc2JVSkJRVzFDTEUxQlFVMHNhMEpCUVd0Q08wRkJRek5ETEVsQlFVa3NXVUZCV1R0QlFVRkJMRVZCUTFvc1NVRkJTVHRCUVVGQkxFVkJRMG9zVVVGQlVUdEJRVUZCTEVWQlExSXNTMEZCU3p0QlFVRkJMRVZCUTB3c1dVRkJXVHRCUVVGQkxFVkJRMW9zWVVGQllUdEJRVUZCTEVWQlEySXNTMEZCU3p0QlFVRkJMRVZCUTB3c1MwRkJTenRCUVVGQkxFVkJRMHdzVlVGQlZTeFhRVUZaTzBGQlEyeENMRk5CUVVzc1YwRkJWeXhSUVVGUkxGTkJRVlVzU1VGQlNUdEJRVU5zUXl4VlFVRkpPMEZCUTBFc2IwSkJRVmtzUjBGQlJ5eEpRVUZKTEVkQlFVYzdRVUZCUVN4bFFVVnVRaXhIUVVGUU8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKV2l4SlFVRkpMRTFCUVUwN1FVRkRWaXhKUVVGSkxHbENRVUZwUWp0QlFVTnlRaXhKUVVGSkxHOUNRVUZ2UWp0QlFVTjRRaXhKUVVGSkxHbENRVUZwUWp0QlFVTnlRaXh6UWtGQmMwSXNTVUZCU1R0QlFVTjBRaXhOUVVGSkxFOUJRVThzVTBGQlV6dEJRVU5vUWl4VlFVRk5MRWxCUVVrc1ZVRkJWVHRCUVVONFFpeFBRVUZMTEdGQlFXRTdRVUZEYkVJc1QwRkJTeXhqUVVGak8wRkJRMjVDTEU5QlFVc3NUMEZCVHp0QlFVTmFMRTFCUVVrc1RVRkJUeXhMUVVGTExFOUJRVTg3UVVGRGRrSXNUVUZCU1N4UFFVRlBPMEZCUTFBc1UwRkJTeXhsUVVGbE8wRkJRM0JDTEZOQlFVc3NVVUZCVVR0QlFVTmlMRk5CUVVzc1YwRkJWenRCUVVGQk8wRkJSWEJDTEUxQlFVa3NUMEZCVHl4UFFVRlBMRmxCUVZrN1FVRkRNVUlzVVVGQlNTeFBRVUZQTzBGQlExQXNXVUZCVFN4SlFVRkpMRlZCUVZVN1FVRkRlRUlzVTBGQlN5eFRRVUZUTEZWQlFWVTdRVUZEZUVJc1UwRkJTeXhUUVVGVExGVkJRVlU3UVVGRGVFSXNVVUZCU1N4TFFVRkxMRmRCUVZjN1FVRkRhRUlzYzBKQlFXZENMRTFCUVUwc1MwRkJTenRCUVVNdlFqdEJRVUZCTzBGQlJVb3NUMEZCU3l4VFFVRlRPMEZCUTJRc1QwRkJTeXhUUVVGVE8wRkJRMlFzU1VGQlJTeEpRVUZKTzBGQlEwNHNjVUpCUVcxQ0xFMUJRVTA3UVVGQlFUdEJRVVUzUWl4SlFVRkpMRmRCUVZjN1FVRkJRU3hGUVVOWUxFdEJRVXNzVjBGQldUdEJRVU5pTEZGQlFVa3NUVUZCVFN4TFFVRkxMR05CUVdNN1FVRkROMElzYTBKQlFXTXNZVUZCWVN4WlFVRlpPMEZCUTI1RExGVkJRVWtzVVVGQlVUdEJRVU5hTEZWQlFVa3NaMEpCUVdkQ0xFTkJRVU1zU1VGQlNTeFZRVUZYTEZOQlFWRXNUMEZCVHl4blFrRkJaMEk3UVVGRGJrVXNWVUZCU1N4VlFVRlZMR2xDUVVGcFFpeERRVUZETzBGQlEyaERMRlZCUVVrc1MwRkJTeXhKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZEYWtRc05FSkJRVzlDTEU5QlFVOHNTVUZCU1N4VFFVRlRMREJDUVVFd1FpeGhRVUZoTEV0QlFVc3NaVUZCWlN4VlFVRlZMREJDUVVFd1FpeFpRVUZaTEV0QlFVc3NaVUZCWlN4VlFVRlZMRk5CUVZNc1VVRkJVVHRCUVVGQk8wRkJSWFJOTEdWQlFWTXNjMEpCUVhOQ0xFbEJRVWs3UVVGRGJrTXNZVUZCVHp0QlFVRkJPMEZCUlZnc1UwRkJTeXhaUVVGWk8wRkJRMnBDTEZkQlFVODdRVUZCUVR0QlFVRkJMRVZCUlZnc1MwRkJTeXhUUVVGVkxFOUJRVTg3UVVGRGJFSXNXVUZCVVN4TlFVRk5MRkZCUVZFc1UwRkJVeXhOUVVGTkxHTkJRV01zVjBGREwwTXNWMEZEUVR0QlFVRkJMRTFCUTBrc1MwRkJTeXhYUVVGWk8wRkJRMklzWlVGQlR6dEJRVUZCTzBGQlFVRXNUVUZGV0N4TFFVRkxMRk5CUVZNN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSk9VSXNUVUZCVFN4aFFVRmhMRmRCUVZjN1FVRkJRU3hGUVVNeFFpeE5RVUZOTzBGQlFVRXNSVUZEVGl4UFFVRlBMRk5CUVZVc1lVRkJZU3haUVVGWk8wRkJRM1JETEhkQ1FVRnZRaXhOUVVGTkxFbEJRVWtzVTBGQlV5eE5RVUZOTEUxQlFVMHNZVUZCWVN4WlFVRlpPMEZCUVVFN1FVRkJRU3hGUVVWb1JpeFBRVUZQTEZOQlFWVXNXVUZCV1R0QlFVTjZRaXhSUVVGSkxGVkJRVlVzVjBGQlZ6dEJRVU55UWl4aFFVRlBMRXRCUVVzc1MwRkJTeXhOUVVGTk8wRkJRek5DTEZGQlFVa3NUMEZCVHl4VlFVRlZMRWxCUVVrc1ZVRkJWU3hWUVVGVk8wRkJRemRETEZkQlFVOHNUMEZCVHl4VFFVRlRMR0ZCUVdFc1MwRkJTeXhMUVVGTExFMUJRVTBzVTBGQlZTeExRVUZMTzBGQlF5OUVMR0ZCUVU4c1pVRkJaU3hQUVVGUExGRkJRVkVzVDBGQlR5eGpRVUZqTzBGQlFVRXNVMEZGZUVRc1MwRkJTeXhMUVVGTExFMUJRVTBzVTBGQlZTeExRVUZMTzBGQlF6ZENMR0ZCUVU4c1QwRkJUeXhKUVVGSkxGTkJRVk1zVDBGQlR5eFJRVUZSTEU5QlFVOHNZMEZCWXp0QlFVRkJPMEZCUVVFN1FVRkJRU3hGUVVjelJTeFRRVUZUTEZOQlFWVXNWMEZCVnp0QlFVTXhRaXhYUVVGUExFdEJRVXNzUzBGQlN5eFRRVUZWTEU5QlFVODdRVUZET1VJN1FVRkRRU3hoUVVGUE8wRkJRVUVzVDBGRFVpeFRRVUZWTEV0QlFVczdRVUZEWkR0QlFVTkJMR0ZCUVU4c1kwRkJZenRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVWMzUWl4UFFVRlBPMEZCUVVFc1NVRkRTQ3hMUVVGTExGZEJRVms3UVVGRFlpeFZRVUZKTEV0QlFVczdRVUZEVEN4bFFVRlBMRXRCUVVzN1FVRkRhRUlzVlVGQlNUdEJRVU5CTEdkRFFVRjNRanRCUVVONFFpeFpRVUZKTEZOQlFWTXNVMEZCVXl4TlFVRk5MRWxCUVVrN1FVRkRhRU1zV1VGQlNTeFJRVUZSTEU5QlFVOHNTMEZCU3p0QlFVTjRRaXhaUVVGSkxFdEJRVXNzVjBGQlZ6dEJRVU5vUWl4bFFVRkxMRk5CUVZNN1FVRkRiRUlzWlVGQlR6dEJRVUZCTEdkQ1FVVllPMEZCUTBrc1owTkJRWGRDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFc1JVRkpjRU1zVTBGQlV5eFRRVUZWTEVsQlFVa3NTMEZCU3p0QlFVTjRRaXhSUVVGSkxGRkJRVkU3UVVGRFdpeFhRVUZQTEV0QlFVc3NWMEZEVWl4SlFVRkpMR0ZCUVdFc1UwRkJWU3hUUVVGVExGRkJRVkU3UVVGRGVFTXNWVUZCU1N4VFFVRlRMRmRCUVZjc1YwRkJXVHRCUVVGRkxHVkJRVThzVDBGQlR5eEpRVUZKTEZkQlFWY3NVVUZCVVR0QlFVRkJMRk5CUVZVN1FVRkRja1lzV1VGQlRTeExRVUZMTEZOQlFWTXNVVUZCVVN4UlFVRlJMR0ZCUVdFc1MwRkJTeXhOUVVGTk8wRkJRVUVzVTBGRE0wUTdRVUZCUVR0QlFVRkJPMEZCUjJwQ0xFbEJRVWtzVDBGQlR5eFhRVUZYTEdWQlFXVXNUMEZCVHp0QlFVTjRReXhWUVVGUkxHRkJRV0VzVjBGQlZ5eFBRVUZQTEdGQlFXRTdRVUZEZUVRc1ZVRkJWU3hOUVVGTk8wRkJRMmhDTEd0Q1FVRnJRaXhoUVVGaExGbEJRVmtzVTBGQlV5eFJRVUZSTEUxQlFVMDdRVUZET1VRc1QwRkJTeXhqUVVGakxFOUJRVThzWjBKQlFXZENMR0ZCUVdFc1kwRkJZenRCUVVOeVJTeFBRVUZMTEdGQlFXRXNUMEZCVHl4bFFVRmxMR0ZCUVdFc1lVRkJZVHRCUVVOc1JTeFBRVUZMTEZWQlFWVTdRVUZEWml4UFFVRkxMRk5CUVZNN1FVRkRaQ3hQUVVGTExFMUJRVTA3UVVGQlFUdEJRVVZtTEUxQlFVMHNZMEZCWXp0QlFVRkJMRVZCUTJoQ0xFdEJRVXNzVjBGQldUdEJRVU5pTEZGQlFVa3NVMEZCVXl4WFFVRlhMRTFCUVUwc1RVRkJUU3hYUVVNdlFpeEpRVUZKTzBGQlExUXNWMEZCVHl4SlFVRkpMR0ZCUVdFc1UwRkJWU3hUUVVGVExGRkJRVkU3UVVGREwwTXNWVUZCU1N4UFFVRlBMRmRCUVZjN1FVRkRiRUlzWjBKQlFWRTdRVUZEV2l4VlFVRkpMRmxCUVZrc1QwRkJUenRCUVVOMlFpeGhRVUZQTEZGQlFWRXNVMEZCVlN4SFFVRkhMRWRCUVVjN1FVRkJSU3hsUVVGUExHRkJRV0VzVVVGQlVTeEhRVUZITEV0QlFVc3NVMEZCVlN4SFFVRkhPMEZCUXpsRkxHbENRVUZQTEV0QlFVczdRVUZEV2l4alFVRkpMRU5CUVVNc1JVRkJSVHRCUVVOSUxHOUNRVUZSTzBGQlFVRXNWMEZEWWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQkxFVkJSMWdzVTBGQlV5eFRRVUZWTEU5QlFVODdRVUZEZEVJc1VVRkJTU3hwUWtGQmFVSTdRVUZEYWtJc1lVRkJUenRCUVVOWUxGRkJRVWtzVTBGQlV5eFBRVUZQTEUxQlFVMHNVMEZCVXp0QlFVTXZRaXhoUVVGUExFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXZReXhqUVVGTkxFdEJRVXNzVTBGQlV6dEJRVUZCTzBGQlJUVkNMRkZCUVVrc1MwRkJTeXhKUVVGSkxHRkJRV0VzVlVGQlZTeE5RVUZOTzBGQlF6RkRMREJDUVVGelFpeEpRVUZKTzBGQlF6RkNMRmRCUVU4N1FVRkJRVHRCUVVGQkxFVkJSVmdzVVVGQlVUdEJRVUZCTEVWQlExSXNUVUZCVFN4WFFVRlpPMEZCUTJRc1VVRkJTU3hUUVVGVExGZEJRVmNzVFVGQlRTeE5RVUZOTEZkQlFWY3NTVUZCU1R0QlFVTnVSQ3hYUVVGUExFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXZReXhoUVVGUExFbEJRVWtzVTBGQlZTeFBRVUZQTzBGQlFVVXNaVUZCVHl4aFFVRmhMRkZCUVZFc1QwRkJUeXhMUVVGTExGTkJRVk03UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVZDJSaXhMUVVGTE8wRkJRVUVzU1VGRFJDeExRVUZMTEZkQlFWazdRVUZCUlN4aFFVRlBPMEZCUVVFN1FVRkJRU3hKUVVNeFFpeExRVUZMTEZOQlFWVXNUMEZCVHp0QlFVRkZMR0ZCUVU4c1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVVY2UXl4aFFVRmhMRU5CUVVVc1MwRkJTeXhYUVVGWk8wRkJRVVVzVjBGQlR6dEJRVUZCTzBGQlFVRXNSVUZEZWtNc1VVRkJVVHRCUVVGQkxFVkJRMUk3UVVGQlFTeEZRVU5CTEZkQlFWYzdRVUZCUVN4SlFVTlFMRXRCUVVzc1YwRkJXVHRCUVVGRkxHRkJRVTg3UVVGQlFUdEJRVUZCTEVsQlF6RkNMRXRCUVVzc1UwRkJWU3hQUVVGUE8wRkJRVVVzWVVGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVVnVReXhwUWtGQmFVSTdRVUZCUVN4SlFVTmlMRXRCUVVzc1YwRkJXVHRCUVVGRkxHRkJRVTg3UVVGQlFUdEJRVUZCTEVsQlF6RkNMRXRCUVVzc1UwRkJWU3hQUVVGUE8wRkJRVVVzZDBKQlFXdENPMEZCUVVFN1FVRkJRVHRCUVVGQkxFVkJSVGxETEZGQlFWRXNVMEZCVlN4SlFVRkpMRmRCUVZjN1FVRkROMElzVjBGQlR5eEpRVUZKTEdGQlFXRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRMME1zWVVGQlR5eFRRVUZUTEZOQlFWVXNWVUZCVXl4VFFVRlJPMEZCUTNaRExGbEJRVWtzVFVGQlRUdEJRVU5XTEZsQlFVa3NZVUZCWVR0QlFVTnFRaXhaUVVGSkxHTkJRV003UVVGRGJFSXNXVUZCU1N4WFFVRlhMRk5CUVZNc1YwRkJXVHRCUVVOb1F5eGpRVUZKTEZGQlFWRTdRVUZEV2l4dFJFRkJlVU1zVjBGQldUdEJRVU5xUkN4clFrRkJUU3hYUVVGWExGZEJRVmNzU1VGQlNTeGhRVUZaTEZGQlFVOHNUVUZCVFN4WFFVRlhPMEZCUVVFN1FVRkJRU3hYUVVWNlJTeEpRVUZKTzBGQlExQTdRVUZCUVN4VFFVTkVMRmRCUVZjc1UwRkJVenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWx1UXl4SlFVRkpMR1ZCUVdVN1FVRkRaaXhOUVVGSkxHTkJRV003UVVGRFpDeFpRVUZSTEdOQlFXTXNZMEZCWXl4WFFVRlpPMEZCUXpWRExGVkJRVWtzYlVKQlFXMUNMRmRCUVZjc1RVRkJUU3hOUVVGTkxGZEJRVmNzU1VGQlNUdEJRVU0zUkN4aFFVRlBMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk03UVVGRGRrTXNXVUZCU1N4cFFrRkJhVUlzVjBGQlZ6dEJRVU0xUWl4clFrRkJVVHRCUVVOYUxGbEJRVWtzV1VGQldTeHBRa0ZCYVVJN1FVRkRha01zV1VGQlNTeFZRVUZWTEVsQlFVa3NUVUZCVFR0QlFVTjRRaXg1UWtGQmFVSXNVVUZCVVN4VFFVRlZMRWRCUVVjc1IwRkJSenRCUVVGRkxHbENRVUZQTEdGQlFXRXNVVUZCVVN4SFFVRkhMRXRCUVVzc1UwRkJWU3hQUVVGUE8wRkJRVVVzYlVKQlFVOHNVVUZCVVN4TFFVRkxMRU5CUVVVc1VVRkJVU3hoUVVGaE8wRkJRVUVzWVVGQmJVSXNVMEZCVlN4UlFVRlJPMEZCUVVVc2JVSkJRVThzVVVGQlVTeExRVUZMTEVOQlFVVXNVVUZCVVN4WlFVRlpPMEZCUVVFc1lVRkRlazRzUzBGQlN5eFhRVUZaTzBGQlFVVXNiVUpCUVU4c1JVRkJSU3hoUVVGaExGRkJRVkU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVZHNSU3hOUVVGSkxHTkJRV01zVDBGQlR5eFBRVUZQTEcxQ1FVRnRRanRCUVVNdlF5eFpRVUZSTEdOQlFXTXNUMEZCVHl4WFFVRlpPMEZCUTNKRExGVkJRVWtzYlVKQlFXMUNMRmRCUVZjc1RVRkJUU3hOUVVGTkxGZEJRVmNzU1VGQlNUdEJRVU0zUkN4aFFVRlBMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU12UXl4WlFVRkpMR2xDUVVGcFFpeFhRVUZYTzBGQlF6VkNMR2xDUVVGUExFbEJRVWtzWlVGQlpUdEJRVU01UWl4WlFVRkpMRmxCUVZrc2FVSkJRV2xDTzBGQlEycERMRmxCUVVrc1YwRkJWeXhKUVVGSkxFMUJRVTA3UVVGRGVrSXNlVUpCUVdsQ0xGRkJRVkVzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4cFFrRkJUeXhoUVVGaExGRkJRVkVzUjBGQlJ5eExRVUZMTEZOQlFWVXNUMEZCVHp0QlFVRkZMRzFDUVVGUExGRkJRVkU3UVVGQlFTeGhRVUZYTEZOQlFWVXNVMEZCVXp0QlFVTXpTU3h4UWtGQlV5eExRVUZMTzBGQlEyUXNaMEpCUVVrc1EwRkJReXhGUVVGRk8wRkJRMGdzY1VKQlFVOHNTVUZCU1N4bFFVRmxPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXRzUkN3MFFrRkJORUlzVTBGQlV5eEpRVUZKTzBGQlEzSkRMRTFCUVVrN1FVRkRRU3hQUVVGSExGTkJRVlVzVDBGQlR6dEJRVU5vUWl4VlFVRkpMRkZCUVZFc1YwRkJWenRCUVVOdVFqdEJRVU5LTEZWQlFVa3NWVUZCVlR0QlFVTldMR05CUVUwc1NVRkJTU3hWUVVGVk8wRkJRM2hDTEZWQlFVa3NiMEpCUVc5Q0xGRkJRVkVzVVVGQlVUdEJRVU40UXl4VlFVRkpMRk5CUVZNc1QwRkJUeXhOUVVGTkxGTkJRVk1zV1VGQldUdEJRVU16UXl3eVFrRkJiVUlzVTBGQlV5eFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTnVSQ3d5UWtGQmFVSXNaVUZEWWl4TlFVRk5MRTFCUVUwc1UwRkJVeXhWUVVOeVFpeE5RVUZOTEV0QlFVc3NVMEZCVXp0QlFVRkJPMEZCUVVFc1lVRkhNMEk3UVVGRFJDeG5Ra0ZCVVN4VFFVRlRPMEZCUTJwQ0xHZENRVUZSTEZOQlFWTTdRVUZEYWtJc09FSkJRWE5DTzBGQlFVRTdRVUZGTVVJc1ZVRkJTVHRCUVVOQk8wRkJRVUVzVDBGRFRDeG5Ra0ZCWjBJc1MwRkJTeXhOUVVGTk8wRkJRVUVzVjBGRk0wSXNTVUZCVUR0QlFVTkpMRzlDUVVGblFpeFRRVUZUTzBGQlFVRTdRVUZCUVR0QlFVZHFReXg1UWtGQmVVSXNVMEZCVXl4UlFVRlJPMEZCUTNSRExHdENRVUZuUWl4TFFVRkxPMEZCUTNKQ0xFMUJRVWtzVVVGQlVTeFhRVUZYTzBGQlEyNUNPMEZCUTBvc1RVRkJTU3h2UWtGQmIwSXNVVUZCVVN4UlFVRlJPMEZCUTNoRExGZEJRVk1zWjBKQlFXZENPMEZCUTNwQ0xGVkJRVkVzVTBGQlV6dEJRVU5xUWl4VlFVRlJMRk5CUVZNN1FVRkRha0lzVjBGQlV5eFhRVUZYTEZGQlFWRXNUMEZCVHl4WFFVRlhMRmxCUVZrc1EwRkJReXhQUVVGUExGbEJRVmtzVTBGQlV5eFhRVUZaTzBGQlF5OUdMRkZCUVVrc1YwRkJWeXh6UWtGQmMwSXNVVUZCVVR0QlFVTTNReXhYUVVGUExGZEJRVmM3UVVGRGJFSXNXVUZCVVN4UlFVRlJMRk5CUVZNN1FVRkJRU3hOUVVOeVFpeExRVUZMTEZkQlFWazdRVUZEWWl4bFFVRlBMSGRDUVVOSUxGbEJRV0VzVlVGQlV5eE5RVU5zUWl4VFFVRlRMRWxCUVVrc1RVRkJUU3hWUVVOdVFpeFRRVUZUTEZOQlEySXNVVUZCVVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVsNFFpdzBRa0ZCTUVJN1FVRkRNVUlzZDBKQlFYTkNPMEZCUTNSQ0xFMUJRVWs3UVVGRFFUdEJRVUZCTzBGQlJWSXNLMEpCUVN0Q0xGTkJRVk03UVVGRGNFTXNUVUZCU1N4WlFVRlpMRkZCUVZFN1FVRkRlRUlzVlVGQlVTeGhRVUZoTzBGQlEzSkNMRmRCUVZNc1NVRkJTU3hIUVVGSExFMUJRVTBzVlVGQlZTeFJRVUZSTEVsQlFVa3NTMEZCU3l4RlFVRkZMRWRCUVVjN1FVRkRiRVFzZDBKQlFXOUNMRk5CUVZNc1ZVRkJWVHRCUVVGQk8wRkJSVE5ETEUxQlFVa3NUVUZCVFN4UlFVRlJPMEZCUTJ4Q0xFbEJRVVVzU1VGQlNTeFBRVUZQTEVsQlFVazdRVUZEYWtJc1RVRkJTU3h6UWtGQmMwSXNSMEZCUnp0QlFVTjZRaXhOUVVGRk8wRkJRMFlzVTBGQlN5eFhRVUZaTzBGQlEySXNWVUZCU1N4RlFVRkZMSE5DUVVGelFqdEJRVU40UWp0QlFVRkJMRTlCUTB3N1FVRkJRVHRCUVVGQk8wRkJSMWdzTmtKQlFUWkNMRk5CUVZNc1ZVRkJWVHRCUVVNMVF5eE5RVUZKTEZGQlFWRXNWMEZCVnl4TlFVRk5PMEZCUTNwQ0xGbEJRVkVzVjBGQlZ5eExRVUZMTzBGQlEzaENPMEZCUVVFN1FVRkZTaXhOUVVGSkxFdEJRVXNzVVVGQlVTeFRRVUZUTEZOQlFWTXNZMEZCWXl4VFFVRlRPMEZCUXpGRUxFMUJRVWtzVDBGQlR5eE5RVUZOTzBGQlEySXNWMEZCVVN4VFFVRlJMRk5CUVZNc1UwRkJVeXhWUVVGVkxGTkJRVk1zVVVGQlVTeFJRVUZSTzBGQlFVRTdRVUZGZWtVc1NVRkJSU3hUUVVGVExFbEJRVWs3UVVGRFppeEpRVUZGTzBGQlEwWXNUMEZCU3l4alFVRmpMRU5CUVVNc1NVRkJTU3hUUVVGVE8wRkJRVUU3UVVGRmNrTXNjMEpCUVhOQ0xFbEJRVWtzVTBGQlV5eFZRVUZWTzBGQlEzcERMRTFCUVVrN1FVRkRRU3gxUWtGQmJVSTdRVUZEYmtJc1VVRkJTU3hMUVVGTExGRkJRVkVzVVVGQlVUdEJRVU42UWl4UlFVRkpMRkZCUVZFc1VVRkJVVHRCUVVOb1FpeFpRVUZOTEVkQlFVYzdRVUZCUVN4WFFVVlNPMEZCUTBRc1ZVRkJTU3huUWtGQlowSTdRVUZEYUVJc01FSkJRV3RDTzBGQlEzUkNMRmxCUVUwc1IwRkJSenRCUVVOVUxGVkJRVWtzWjBKQlFXZENMRkZCUVZFc1YwRkJWenRCUVVOdVF5d3lRa0ZCYlVJN1FVRkJRVHRCUVVVelFpeGhRVUZUTEZGQlFWRTdRVUZCUVN4WFFVVmtMRWRCUVZBN1FVRkRTU3hoUVVGVExFOUJRVTg3UVVGQlFTeFpRVVZ3UWp0QlFVTkpMSFZDUVVGdFFqdEJRVU51UWl4UlFVRkpMRVZCUVVVc2MwSkJRWE5DTzBGQlEzaENPMEZCUTBvc1RVRkJSU3hUUVVGVExFbEJRVWtzVDBGQlR5eFRRVUZUTEVsQlFVazdRVUZCUVR0QlFVRkJPMEZCUnpORExHdENRVUZyUWl4VFFVRlRMRkZCUVZFc1QwRkJUenRCUVVOMFF5eE5RVUZKTEU5QlFVOHNWMEZCVnp0QlFVTnNRaXhYUVVGUE8wRkJRMWdzVFVGQlNTeFJRVUZSTzBGQlExb3NUVUZCU1N4UlFVRlJMRmRCUVZjc1QwRkJUenRCUVVNeFFpeFJRVUZKTEZWQlFWVXNVVUZCVVN4UlFVRlJMRmRCUVZjN1FVRkRla01zVVVGQlNTeFhRVUZYTEUxQlFVMDdRVUZEYWtJc2EwSkJRVmtzVVVGQlVTeFJRVUZSTzBGQlF6VkNMR2RDUVVGVkxGRkJRVkVzVjBGQlZ6dEJRVU0zUWl4alFVRlJMRmxCUVZrc1UwRkJVenRCUVVGQkxGZEJSVFZDTzBGQlEwUXNhMEpCUVZrN1FVRkRXaXhuUWtGQlZUdEJRVUZCTzBGQlJXUXNWMEZCVHl4TFFVRkxMRmxCUVdFc1YwRkJWU3hQUVVGUExGVkJRVlVzVFVGQlRUdEJRVUZCTzBGQlJUbEVMRTFCUVVrc1QwRkJUenRCUVVOUUxGbEJRVkVzV1VGQldTeFJRVUZSTEdOQlFXTTdRVUZETVVNc1VVRkJTU3hUUVVGVExFOUJRVThzVVVGQlVTeFhRVUZYTzBGQlEyNURMR0ZCUVU4c1MwRkJTenRCUVVOb1FpeFJRVUZKTEZGQlFWRTdRVUZEVWl4bFFVRlRMRkZCUVZFc1QwRkJUeXhSUVVGUk8wRkJRVUU3UVVGRmVFTXNVMEZCVHp0QlFVRkJPMEZCUlZnc0swSkJRU3RDTEZOQlFWTXNUVUZCVFR0QlFVTXhReXhOUVVGSkxGVkJRVlVzVDBGQlR5eExRVUZMTEZkQlFWY3NTVUZCU1R0QlFVTjZReXhOUVVGSkxGVkJRVlVzZDBKQlFYZENPMEZCUTJ4RExGbEJRVkVzVVVGQlVUdEJRVU5vUWl4WlFVRlJMRmRCUVZjN1FVRkJRVHRCUVVGQk8wRkJSek5DTEhkQ1FVRjNRanRCUVVOd1Fpd3lRa0ZCZVVJN1FVRkJRVHRCUVVVM1Fpd3JRa0ZCSzBJN1FVRkRNMElzVFVGQlNTeGpRVUZqTzBGQlEyeENMSFZDUVVGeFFqdEJRVU55UWl4NVFrRkJkVUk3UVVGRGRrSXNVMEZCVHp0QlFVRkJPMEZCUlZnc05rSkJRVFpDTzBGQlEzcENMRTFCUVVrc1YwRkJWeXhIUVVGSE8wRkJRMnhDTEV0QlFVYzdRVUZEUXl4WFFVRlBMR1ZCUVdVc1UwRkJVeXhIUVVGSE8wRkJRemxDTEd0Q1FVRlpPMEZCUTFvc2RVSkJRV2xDTzBGQlEycENMRlZCUVVrc1ZVRkJWVHRCUVVOa0xGZEJRVXNzU1VGQlNTeEhRVUZITEVsQlFVa3NSMEZCUnl4RlFVRkZMRWRCUVVjN1FVRkRjRUlzV1VGQlNTeFBRVUZQTEZWQlFWVTdRVUZEY2tJc1lVRkJTeXhIUVVGSExFMUJRVTBzVFVGQlRTeExRVUZMTzBGQlFVRTdRVUZCUVR0QlFVRkJMRmRCUnpWQ0xHVkJRV1VzVTBGQlV6dEJRVU5xUXl4MVFrRkJjVUk3UVVGRGNrSXNlVUpCUVhWQ08wRkJRVUU3UVVGRk0wSXNaME5CUVdkRE8wRkJRelZDTEUxQlFVa3NaMEpCUVdkQ08wRkJRM0JDTEc5Q1FVRnJRanRCUVVOc1FpeG5Ra0ZCWXl4UlFVRlJMRk5CUVZVc1IwRkJSenRCUVVNdlFpeE5RVUZGTEV0QlFVc3NXVUZCV1N4TFFVRkxMRTFCUVUwc1JVRkJSU3hSUVVGUk8wRkJRVUU3UVVGRk5VTXNUVUZCU1N4aFFVRmhMR1ZCUVdVc1RVRkJUVHRCUVVOMFF5eE5RVUZKTEVsQlFVa3NWMEZCVnp0QlFVTnVRaXhUUVVGUE8wRkJRMGdzWlVGQlZ5eEZRVUZGTzBGQlFVRTdRVUZGY2tJc2EwUkJRV3RFTEVsQlFVazdRVUZEYkVRc2RVSkJRWEZDTzBGQlEycENPMEZCUTBFc2JVSkJRV1VzVDBGQlR5eGxRVUZsTEZGQlFWRXNXVUZCV1R0QlFVRkJPMEZCUlRkRUxHbENRVUZsTEV0QlFVczdRVUZEY0VJc1NVRkJSVHRCUVVOR0xFOUJRVXNzVjBGQldUdEJRVU5pTEZGQlFVa3NSVUZCUlN4elFrRkJjMEk3UVVGRGVFSTdRVUZCUVN4TFFVTk1PMEZCUVVFN1FVRkZVQ3h0UTBGQmJVTXNVMEZCVXp0QlFVTjRReXhOUVVGSkxFTkJRVU1zWjBKQlFXZENMRXRCUVVzc1UwRkJWU3hIUVVGSE8wRkJRVVVzVjBGQlR5eEZRVUZGTEZkQlFWY3NVVUZCVVR0QlFVRkJPMEZCUTJwRkxHOUNRVUZuUWl4TFFVRkxPMEZCUVVFN1FVRkZOMElzTkVKQlFUUkNMRk5CUVZNN1FVRkRha01zVFVGQlNTeEpRVUZKTEdkQ1FVRm5RanRCUVVONFFpeFRRVUZQTzBGQlEwZ3NVVUZCU1N4blFrRkJaMElzUlVGQlJTeEhRVUZITEZkQlFWY3NVVUZCVVN4UlFVRlJPMEZCUTJoRUxITkNRVUZuUWl4UFFVRlBMRWRCUVVjN1FVRkRNVUk3UVVGQlFUdEJRVUZCTzBGQlIxb3NkVUpCUVhWQ0xGRkJRVkU3UVVGRE0wSXNVMEZCVHl4SlFVRkpMR0ZCUVdFc1ZVRkJWU3hQUVVGUE8wRkJRVUU3UVVGRk4wTXNZMEZCWXl4SlFVRkpMR05CUVdNN1FVRkROVUlzVFVGQlNTeE5RVUZOTzBGQlExWXNVMEZCVHl4WFFVRlpPMEZCUTJZc1VVRkJTU3hqUVVGakxIVkNRVUYxUWl4aFFVRmhPMEZCUTNSRUxGRkJRVWs3UVVGRFFTeHRRa0ZCWVN4TFFVRkxPMEZCUTJ4Q0xHRkJRVThzUjBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZCUVN4aFFVVnVRaXhIUVVGUU8wRkJRMGtzYzBKQlFXZENMR0ZCUVdFN1FVRkJRU3hqUVVWcVF6dEJRVU5KTEcxQ1FVRmhMRmxCUVZrN1FVRkRla0lzVlVGQlNUdEJRVU5CTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1doQ0xFbEJRVWtzVDBGQlR5eERRVUZGTEZGQlFWRXNSMEZCUnl4UlFVRlJMRWRCUVVjc1NVRkJTVHRCUVVOMlF5eEpRVUZKTEdOQlFXTTdRVUZEYkVJc1NVRkJTU3haUVVGWk8wRkJRMmhDTEVsQlFVa3NZVUZCWVR0QlFVTnFRaXhKUVVGSkxHTkJRV003UVVGRGJFSXNTVUZCU1N4clFrRkJhMEk3UVVGRGRFSXNhMEpCUVd0Q0xFbEJRVWtzVVVGQlR5eEpRVUZKTEVsQlFVazdRVUZEYWtNc1RVRkJTU3hUUVVGVExFdEJRVXNzVFVGQlRTeFBRVUZQTEU5QlFVODdRVUZEZEVNc1RVRkJTU3hUUVVGVE8wRkJRMklzVFVGQlNTeE5RVUZOTzBGQlExWXNUVUZCU1N4VFFVRlRPMEZCUTJJc1RVRkJTU3hMUVVGTExFVkJRVVU3UVVGRFdDeE5RVUZKTEZsQlFWa3NWVUZCVlR0QlFVTXhRaXhOUVVGSkxFMUJRVTBzY1VKQlFYRkNPMEZCUVVFc1NVRkRNMElzVTBGQlV6dEJRVUZCTEVsQlExUXNZVUZCWVN4RFFVRkZMRTlCUVU4c1kwRkJZeXhqUVVGakxFMUJRVTBzVlVGQlZUdEJRVUZCTEVsQlEyeEZMRXRCUVVzc1lVRkJZVHRCUVVGQkxFbEJRMnhDTEUxQlFVMHNZVUZCWVR0QlFVRkJMRWxCUTI1Q0xGbEJRVmtzWVVGQllUdEJRVUZCTEVsQlEzcENMRXRCUVVzc1lVRkJZVHRCUVVGQkxFbEJRMnhDTEZOQlFWTXNZVUZCWVR0QlFVRkJMRWxCUTNSQ0xGRkJRVkVzWVVGQllUdEJRVUZCTEVsQlEzSkNMRTlCUVU4c2MwSkJRWE5DTEZWQlFWVXNUMEZCVHp0QlFVRkJMRWxCUXpsRExFOUJRVThzYzBKQlFYTkNMRlZCUVZVc1QwRkJUenRCUVVGQkxFMUJRemxETzBGQlEwb3NUVUZCU1R0QlFVTkJMRmRCUVU4c1MwRkJTenRCUVVOb1FpeEpRVUZGTEU5QlFVODdRVUZEVkN4TlFVRkpMRmRCUVZjc1YwRkJXVHRCUVVOMlFpeE5RVUZGTEV0QlFVc3NUMEZCVHl4UFFVRlBMRXRCUVVzc1QwRkJUenRCUVVGQk8wRkJSWEpETEUxQlFVa3NTMEZCU3l4UFFVRlBMRXRCUVVzc1NVRkJTU3hKUVVGSk8wRkJRemRDTEUxQlFVa3NTVUZCU1N4UlFVRlJPMEZCUTFvc1VVRkJTVHRCUVVOU0xGTkJRVTg3UVVGQlFUdEJRVVZZTEcxRFFVRnRRenRCUVVNdlFpeE5RVUZKTEVOQlFVTXNTMEZCU3p0QlFVTk9MRk5CUVVzc1MwRkJTeXhGUVVGRk8wRkJRMmhDTEVsQlFVVXNTMEZCU3p0QlFVTlFMRTlCUVVzc1ZVRkJWVHRCUVVObUxGTkJRVThzUzBGQlN6dEJRVUZCTzBGQlJXaENMRzFEUVVGdFF6dEJRVU12UWl4TlFVRkpMRU5CUVVNc1MwRkJTenRCUVVOT0xGZEJRVTg3UVVGRFdDeE5RVUZKTEVWQlFVVXNTMEZCU3l4WFFVRlhPMEZCUTJ4Q0xGTkJRVXNzUzBGQlN6dEJRVU5rTEU5QlFVc3NVMEZCVXl4TFFVRkxMRk5CUVZNN1FVRkROVUlzVTBGQlR6dEJRVUZCTzBGQlJWZ3NTVUZCU3l4TlFVRkxMRzFDUVVGdFFpeFJRVUZSTEhGQ1FVRnhRaXhKUVVGSk8wRkJRekZFTERSQ1FVRXdRaXd3UWtGQk1FSTdRVUZCUVR0QlFVVjRSQ3hyUTBGQmEwTXNhVUpCUVdsQ08wRkJReTlETEUxQlFVa3NTMEZCU3l4VlFVRlZMRzFDUVVGdFFpeG5Ra0ZCWjBJc1owSkJRV2RDTEdWQlFXVTdRVUZEYWtZN1FVRkRRU3hYUVVGUExHZENRVUZuUWl4TFFVRkxMRk5CUVZVc1IwRkJSenRCUVVOeVF6dEJRVU5CTEdGQlFVODdRVUZCUVN4UFFVTlNMRk5CUVZVc1IwRkJSenRCUVVOYU8wRkJRMEVzWVVGQlR5eFZRVUZWTzBGQlFVRTdRVUZCUVR0QlFVZDZRaXhUUVVGUE8wRkJRVUU3UVVGRldDeDFRa0ZCZFVJc1dVRkJXVHRCUVVNdlFpeEpRVUZGTzBGQlEwWXNUVUZCU1N4RFFVRkRMRXRCUVVzc1ZVRkJWU3hGUVVGRkxFdEJRVXNzVjBGQlZ5eEhRVUZITzBGQlEzSkRMRk5CUVVzc1UwRkJVeXhMUVVGTExFdEJRVXM3UVVGQlFUdEJRVVUxUWl4WlFVRlZMRXRCUVVzN1FVRkRaaXhsUVVGaExGbEJRVms3UVVGQlFUdEJRVVUzUWl4NVFrRkJlVUk3UVVGRGNrSXNUVUZCU1N4UFFVRlBMRlZCUVZVc1ZVRkJWU3hUUVVGVE8wRkJRM2hETEZsQlFWVTdRVUZEVml4bFFVRmhMRTFCUVUwN1FVRkJRVHRCUVVWMlFpeHpRa0ZCYzBJc1dVRkJXU3hsUVVGbE8wRkJRemRETEUxQlFVa3NZMEZCWXp0QlFVTnNRaXhOUVVGSkxHZENRVUZuUWl4TFFVRkxMRlZCUVZjc1JVRkJReXhuUWtGQlowSXNaVUZCWlN4UFFVRlBMR05CUVdVc1JVRkJReXhGUVVGRkxHTkJRV01zWlVGQlpTeE5RVUZOTzBGQlF6VklMREpDUVVGMVFpeG5Ra0ZCWjBJc1kwRkJZeXhMUVVGTExFMUJRVTBzWTBGQll6dEJRVUZCTzBGQlJXeEdMRTFCUVVrc1pVRkJaVHRCUVVObU8wRkJRMG9zVVVGQlRUdEJRVU5PTEUxQlFVa3NaMEpCUVdkQ08wRkJRMmhDTEdOQlFWVXNUVUZCVFR0QlFVTndRaXhOUVVGSkxHOUNRVUZ2UWp0QlFVTndRaXhSUVVGSkxHdENRVUZyUWl4VlFVRlZMRWxCUVVrN1FVRkRjRU1zVVVGQlNTeFpRVUZaTEZkQlFWYzdRVUZETTBJc2RVSkJRVzFDTEU5QlFVOHNWVUZCVlR0QlFVTndReXh2UWtGQlowSXNWVUZCVlN4UFFVRlBMRlZCUVZVN1FVRkRNME1zVVVGQlNTeFpRVUZaTEZWQlFWVXNWMEZCVnl4UlFVRlJPMEZCUTNwRExHRkJRVThzWlVGQlpTeFRRVUZUTEZkQlFWY3NWVUZCVlR0QlFVTndSQ3h6UWtGQlowSXNUVUZCVFN4VlFVRlZPMEZCUTJoRExITkNRVUZuUWl4UFFVRlBMRlZCUVZVN1FVRkRha01zYzBKQlFXZENMRlZCUVZVc1ZVRkJWVHRCUVVOd1F5eHpRa0ZCWjBJc1UwRkJVeXhWUVVGVk8wRkJRMjVETEZWQlFVa3NWVUZCVlR0QlFVTldMSGRDUVVGblFpeGhRVUZoTEZWQlFWVTdRVUZETTBNc1ZVRkJTU3hWUVVGVk8wRkJRMVlzZDBKQlFXZENMRTFCUVUwc1ZVRkJWVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWxvUkN4dlFrRkJiMEk3UVVGRGFFSXNUVUZCU1N4blFrRkJaMElzVVVGQlVUdEJRVU0xUWl4VFFVRlBMSEZDUVVGeFFqdEJRVUZCTEVsQlEzaENMRk5CUVZNN1FVRkJRU3hKUVVOVUxHRkJRV0VzVDBGQlR5eDVRa0ZCZVVJc1UwRkJVenRCUVVGQkxFbEJRM1JFTEV0QlFVc3NZMEZCWXp0QlFVRkJMRWxCUTI1Q0xFMUJRVTBzWTBGQll6dEJRVUZCTEVsQlEzQkNMRmxCUVZrc1kwRkJZenRCUVVGQkxFbEJRekZDTEV0QlFVc3NZMEZCWXp0QlFVRkJMRWxCUTI1Q0xGTkJRVk1zWTBGQll6dEJRVUZCTEVsQlEzWkNMRkZCUVZFc1kwRkJZenRCUVVGQkxFbEJRM1JDTEU5QlFVOHNiVUpCUVcxQ08wRkJRVUVzU1VGRE1VSXNUMEZCVHl4alFVRmpMRlZCUVZVN1FVRkJRU3hOUVVNdlFqdEJRVUZCTzBGQlJWSXNaMEpCUVdkQ0xFdEJRVXNzU1VGQlNTeEpRVUZKTEVsQlFVa3NTVUZCU1R0QlFVTnFReXhOUVVGSkxHRkJRV0U3UVVGRGFrSXNUVUZCU1R0QlFVTkJMR2xDUVVGaExFdEJRVXM3UVVGRGJFSXNWMEZCVHl4SFFVRkhMRWxCUVVrc1NVRkJTVHRCUVVGQkxGbEJSWFJDTzBGQlEwa3NhVUpCUVdFc1dVRkJXVHRCUVVGQk8wRkJRVUU3UVVGSGFrTXNaME5CUVdkRExFdEJRVXM3UVVGRGFrTXNiMEpCUVd0Q0xFdEJRVXNzZFVKQlFYVkNPMEZCUVVFN1FVRkZiRVFzYlVOQlFXMURMRWxCUVVrc1RVRkJUU3hsUVVGbExGTkJRVk03UVVGRGFrVXNVMEZCVHl4UFFVRlBMRTlCUVU4c1lVRkJZU3hMUVVGTExGZEJRVms3UVVGREwwTXNVVUZCU1N4WlFVRlpPMEZCUTJoQ0xGRkJRVWs3UVVGRFFUdEJRVU5LTEdsQ1FVRmhMRTFCUVUwN1FVRkRia0lzVVVGQlNUdEJRVU5CTEdGQlFVOHNSMEZCUnl4TlFVRk5MRTFCUVUwN1FVRkJRU3hqUVVVeFFqdEJRVU5KTEcxQ1FVRmhMRmRCUVZjN1FVRkRlRUlzVlVGQlNUdEJRVU5CTEN0Q1FVRjFRanRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWwyUXl3clFrRkJLMElzVlVGQlZTeE5RVUZOTzBGQlF6TkRMRk5CUVU4c1UwRkJWU3haUVVGWkxGbEJRVms3UVVGRGNrTXNWMEZCVHl4VFFVRlRMRXRCUVVzc1RVRkJUU3d3UWtGQk1FSXNXVUZCV1N4UFFVRlBMREJDUVVFd1FpeFpRVUZaTzBGQlFVRTdRVUZCUVR0QlFVZDBTQ3hKUVVGSkxIRkNRVUZ4UWp0QlFVTjZRaXh4UWtGQmNVSXNTMEZCU3l4VFFVRlRPMEZCUXk5Q0xFMUJRVWs3UVVGRFNpeE5RVUZKTzBGQlEwRXNVMEZCU3l4UlFVRlJMRmxCUVZrN1FVRkJRU3hYUVVWMFFpeEhRVUZRTzBGQlFVRTdRVUZEUVN4TlFVRkpMRTlCUVU4N1FVRkRVQ3hSUVVGSk8wRkJRMEVzVlVGQlNTeFBRVUZQTEZsQlFWa3NRMEZCUlN4VFFVRnJRaXhSUVVGUk8wRkJRMjVFTEZWQlFVa3NVVUZCVVN4WlFVRlpMRk5CUVZNc1lVRkJZVHRCUVVNeFF5eG5Ra0ZCVVN4VFFVRlRMRmxCUVZrN1FVRkROMElzWTBGQlRTeFZRVUZWTEc5Q1FVRnZRaXhOUVVGTk8wRkJRekZETEdWQlFVOHNUMEZCVHp0QlFVRkJMR2xDUVVWVUxGRkJRVkVzWVVGQllUdEJRVU14UWl4blFrRkJVU3hKUVVGSkxGbEJRVmtzYjBKQlFXOUNMRU5CUVVVc1VVRkJVVHRCUVVOMFJDeGxRVUZQTEU5QlFVODdRVUZCUVR0QlFVVnNRaXhWUVVGSkxGTkJRVk1zVVVGQlVTeGxRVUZsTzBGQlEyaERMSE5DUVVGak8wRkJRMlFzV1VGQlNTeERRVUZETEZGQlFWRXNlVUpCUVhsQ0xGRkJRVkU3UVVGRE1VTXNZMEZCU1R0QlFVTkJMRzlDUVVGUkxIRkNRVUZ4UWp0QlFVRkJMRzFDUVVVeFFpeEhRVUZRTzBGQlFVRTdRVUZCUVR0QlFVVlNMRlZCUVVrc1UwRkJVeXhUUVVGVExFTkJRVU1zVFVGQlRTeHJRa0ZCYTBJN1FVRkRNME1zWjBKQlFWRXNTMEZCU3l3d1FrRkJNa0lzUzBGQlNTeFRRVUZUTzBGQlFVRTdRVUZCUVN4aFFVZDBSQ3hIUVVGUU8wRkJRVUU3UVVGQlFUdEJRVVZTTEVsQlFVa3NXVUZCV1N4aFFVRmhPMEZCUlRkQ0xIbENRVUY1UWl4SlFVRkpMRTFCUVUwc1dVRkJXU3hKUVVGSk8wRkJReTlETEUxQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1owSkJRV2xDTEVOQlFVTXNTVUZCU1N4WlFVRmhPMEZCUXpsRExGRkJRVWtzUTBGQlF5eEhRVUZITEU5QlFVOHNaVUZCWlR0QlFVTXhRaXhWUVVGSkxFTkJRVU1zUjBGQlJ5eFRRVUZUTzBGQlEySXNaVUZCVHl4VlFVRlZMRWxCUVVrc1YwRkJWenRCUVVOd1F5eFRRVUZITEU5QlFVOHNUVUZCVFR0QlFVRkJPMEZCUlhCQ0xGZEJRVThzUjBGQlJ5eFBRVUZQTEdWQlFXVXNTMEZCU3l4WFFVRlpPMEZCUVVVc1lVRkJUeXhuUWtGQlowSXNTVUZCU1N4TlFVRk5MRmxCUVZrN1FVRkJRVHRCUVVGQkxGTkJSUzlHTzBGQlEwUXNVVUZCU1N4UlFVRlJMRWRCUVVjc2JVSkJRVzFDTEUxQlFVMHNXVUZCV1N4SFFVRkhPMEZCUTNaRUxGRkJRVWs3UVVGRFFTeFpRVUZOTzBGQlFVRXNZVUZGU0N4SlFVRlFPMEZCUTBrc1lVRkJUeXhWUVVGVk8wRkJRVUU3UVVGRmNrSXNWMEZCVHl4TlFVRk5MRk5CUVZNc1RVRkJUU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU51UkN4aFFVRlBMRk5CUVZNc1YwRkJXVHRCUVVONFFpeFpRVUZKTEZGQlFWRTdRVUZEV2l4bFFVRlBMRWRCUVVjc1UwRkJVeXhSUVVGUk8wRkJRVUU3UVVGQlFTeFBRVVZvUXl4TFFVRkxMRk5CUVZVc1VVRkJVVHRCUVVOMFFpeGhRVUZQTEUxQlFVMHNXVUZCV1N4TFFVRkxMRmRCUVZrN1FVRkJSU3hsUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMTDBRc1NVRkJTU3huUWtGQlowSTdRVUZEY0VJc1NVRkJTU3haUVVGWkxFOUJRVThzWVVGQllUdEJRVU53UXl4SlFVRkpMRk5CUVZNN1FVRkRZaXhKUVVGSkxIVkNRVUYxUWp0QlFVTXpRaXhKUVVGSkxHdENRVUZyUWp0QlFVTjBRaXhKUVVGSkxHTkJRV003UVVGRGJFSXNTVUZCU1N4aFFVRmhMRTlCUVU4c1kwRkJZeXhsUVVGbExITkNRVUZ6UWl4TFFVRkxMRlZCUVZVN1FVRkRNVVlzU1VGQlNTdzBRa0ZCTkVJN1FVRkRhRU1zU1VGQlNTdzJRa0ZCTmtJN1FVRkRha01zU1VGQlNTeDNRa0ZCZDBJc1UwRkJWU3hQUVVGUE8wRkJRVVVzVTBGQlR5eERRVUZETERaQ1FVRTJRaXhMUVVGTE8wRkJRVUU3UVVGRGVrWXNTVUZCU1N4aFFVRmhPMEZCUTJwQ0xFbEJRVWtzVjBGQlZ6dEJRVU5tTEVsQlFVa3NXVUZCV1R0QlFVVm9RaXhwUWtGQmFVSXNVMEZCVXl4VFFVRlRPMEZCUXk5Q0xGTkJRVThzVlVGRFNDeFZRVU5KTEZkQlFWazdRVUZCUlN4WFFVRlBMRkZCUVZFc1RVRkJUU3hOUVVGTkxHTkJRV01zVVVGQlVTeE5RVUZOTEUxQlFVMDdRVUZCUVN4TlFVTXpSU3hWUVVOS08wRkJRVUU3UVVGSFVpeEpRVUZKTzBGQlEwb3NTVUZCU1R0QlFVTkJMRmxCUVZVN1FVRkJRU3hKUVVOT0xGZEJRVmNzVVVGQlVTeGhRVUZoTEZGQlFWRXNaMEpCUVdkQ0xGRkJRVkVzYlVKQlFXMUNMRkZCUVZFN1FVRkJRU3hKUVVNelJpeGhRVUZoTEZGQlFWRXNaVUZCWlN4UlFVRlJPMEZCUVVFN1FVRkJRU3hUUVVjM1F5eEhRVUZRTzBGQlEwa3NXVUZCVlN4RFFVRkZMRmRCUVZjc1RVRkJUU3hoUVVGaE8wRkJRVUU3UVVGSE9VTXNOa0pCUVRaQ0xGbEJRVms3UVVGRGNrTXNVMEZCVHl4WFFVRlhMRmRCUVZjc1NVRkJTU3hYUVVGWExFdEJRVXM3UVVGQlFUdEJRVVZ5UkN4SlFVRkpMRmxCUVZrc1UwRkJWU3hoUVVGaE8wRkJRMjVETEUxQlFVazdRVUZEUVN4blFrRkJXU3hMUVVGTExFTkJRVU03UVVGRGJFSXNaMEpCUVZrc1YwRkJXVHRCUVVGRkxHRkJRVThzUTBGQlF6dEJRVUZCTzBGQlEyeERMRmRCUVU4c1EwRkJRenRCUVVGQkxGZEJSVXdzUjBGQlVEdEJRVU5KTEdkQ1FVRlpMRmRCUVZrN1FVRkJSU3hoUVVGUE8wRkJRVUU3UVVGRGFrTXNWMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkpaaXhKUVVGSkxGZEJRVmM3UVVGQlFTeEZRVU5ZTEUxQlFVMDdRVUZCUVN4RlFVTk9MRTlCUVU4N1FVRkJRU3hGUVVOUUxGZEJRVmM3UVVGQlFTeE5RVU5RTEZGQlFWRTdRVUZCUlN4WFFVRlBMRlZCUVZVc1VVRkJVVHRCUVVGQk8wRkJRVUVzUlVGRGRrTXNWMEZCVnp0QlFVRkJPMEZCUjJZc2RVTkJRWFZETEZOQlFWTTdRVUZETlVNc1UwRkJUeXhQUVVGUExGbEJRVmtzV1VGQldTeERRVUZETEV0QlFVc3NTMEZCU3l4WFFVTXpReXhUUVVGVkxFdEJRVXM3UVVGRFlpeFJRVUZKTEVsQlFVa3NZVUZCWVN4VlFVRmpMRmRCUVZjc1MwRkJUVHRCUVVOb1JDeFpRVUZOTEZWQlFWVTdRVUZEYUVJc1lVRkJUeXhKUVVGSk8wRkJRVUU3UVVGRlppeFhRVUZQTzBGQlFVRXNUVUZGVkN4VFFVRlZMRXRCUVVzN1FVRkJSU3hYUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWRzUXl4SlFVRkpMRkZCUVZVc1YwRkJXVHRCUVVOMFFpeHZRa0ZCYVVJN1FVRkJRVHRCUVVWcVFpeFRRVUZOTEZWQlFWVXNVMEZCVXl4VFFVRlZMRTFCUVUwc1NVRkJTU3hoUVVGaE8wRkJRM1JFTEZGQlFVa3NVVUZCVVN4TFFVRkxMRTlCUVU4c1NVRkJTVHRCUVVNMVFpeFJRVUZKTEZsQlFWa3NTMEZCU3p0QlFVTnlRaXh4UTBGQmFVTXNVMEZCVXl4UlFVRlJMRkZCUVU4N1FVRkRja1FzVlVGQlNTeERRVUZETEU5QlFVMHNUMEZCVHp0QlFVTmtMR05CUVUwc1NVRkJTU3hYUVVGWExGTkJRVk1zVjBGQlZ5eFpRVUZaTzBGQlEzcEVMR0ZCUVU4c1IwRkJSeXhQUVVGTkxGVkJRVlU3UVVGQlFUdEJRVVU1UWl4UlFVRkpMR05CUVdNN1FVRkRiRUlzVVVGQlNUdEJRVU5CTEdGQlFVOHNVMEZCVXl4TlFVRk5MRTlCUVU4c1MwRkJTeXhMUVVNNVFpeFZRVUZWTEVsQlFVa3NVVUZEVml4TlFVRk5MRk5CUVZNc1RVRkJUU3g1UWtGQmVVSXNaVUZET1VNc1UwRkJVeXhYUVVGWk8wRkJRVVVzWlVGQlR5eE5RVUZOTEZOQlFWTXNUVUZCVFN4NVFrRkJlVUk3UVVGQlFTeFRRVUZwUWl4RFFVRkZMRTlCUVdNc1YwRkJWeXhKUVVGSkxHRkJRV0VzVVVGRE4wa3NaMEpCUVdkQ0xFdEJRVXNzU1VGQlNTeE5RVUZOTEVOQlFVTXNTMEZCU3l4UFFVRlBPMEZCUVVFc1kwRkZjRVE3UVVGRFNTeFZRVUZKTzBGQlEwRTdRVUZCUVR0QlFVRkJPMEZCUjFvc1UwRkJUU3hWUVVGVkxFMUJRVTBzVTBGQlZTeFhRVUZYTEVsQlFVazdRVUZETTBNc1VVRkJTU3hSUVVGUk8wRkJRMW9zVVVGQlNTeGhRVUZoTEZWQlFWVXNaMEpCUVdkQ08wRkJRM1pETEdGQlFVOHNTMEZCU3l4TlFVRk5MRmRCUVZjc1RVRkJUVHRCUVVOMlF5eFhRVUZQTEV0QlFVc3NUMEZCVHl4WlFVRlpMRk5CUVZVc1QwRkJUenRCUVVNMVF5eGhRVUZQTEUxQlFVMHNTMEZCU3l4SlFVRkpMRU5CUVVVc1QwRkJZeXhMUVVGTExGbEJRM1JETEV0QlFVc3NVMEZCVlN4TFFVRkxPMEZCUVVVc1pVRkJUeXhOUVVGTkxFdEJRVXNzVVVGQlVTeExRVUZMTzBGQlFVRTdRVUZCUVN4UFFVTXpSQ3hMUVVGTE8wRkJRVUU3UVVGRldpeFRRVUZOTEZWQlFWVXNVVUZCVVN4VFFVRlZMR0ZCUVdFN1FVRkRNME1zVVVGQlNTeFBRVUZQTEdkQ1FVRm5RanRCUVVOMlFpeGhRVUZQTEVsQlFVa3NTMEZCU3l4SFFVRkhMRmxCUVZrc1RVRkJUVHRCUVVONlF5eFJRVUZKTEZGQlFWRTdRVUZEVWl4aFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSExGbEJRVmtzVFVGQlRTeE5RVUZOTEZsQlFWa3NTMEZCU3l4UFFVRlBPMEZCUTNaRkxGRkJRVWtzVjBGQlZ5eExRVUZMTzBGQlEzQkNMRkZCUVVrc1UwRkJVeXhYUVVGWE8wRkJRM0JDTEdGQlFVOHNTMEZEUml4TlFVRk5MRk5CUVZNc1NVRkRaaXhQUVVGUExGbEJRVmtzVTBGQlV6dEJRVU55UXl4UlFVRkpMR2RDUVVGblFpeExRVUZMTEU5QlFVOHNVVUZCVVN4UFFVRlBMRXRCUVVzc1QwRkJUeXhUUVVGVExFOUJRVThzVTBGQlZTeEpRVUZKTzBGQlEzSkdMR0ZCUVU4c1IwRkJSeXhaUVVOT0xGTkJRVk1zVFVGQlRTeFRRVUZWTEZOQlFWTTdRVUZCUlN4bFFVRlBMRWRCUVVjc1VVRkJVU3hSUVVGUkxGbEJRVms3UVVGQlFTeFpRVU14UlN4SFFVRkhMRkZCUVZFc1RVRkJUU3hUUVVGVkxGTkJRVk03UVVGQlJTeGxRVUZQTEZOQlFWTXNVVUZCVVN4WlFVRlpPMEZCUVVFN1FVRkJRU3hQUVVNdlJUdEJRVU5JTEZGQlFVa3NhVUpCUVdsQ0xFdEJRVXNzUjBGQlJ5eFpRVUZaTzBGQlEzSkRMR0ZCUVU4c1MwRkRSaXhOUVVGTkxHTkJRV01zVFVGRGNFSXNUMEZCVHl4alFVRmpMRkZCUVZFc1NVRkJTU3hUUVVGVkxFbEJRVWs3UVVGQlJTeGxRVUZQTEZsQlFWazdRVUZCUVR0QlFVTTNSU3hSUVVGSkxFTkJRVU1zYVVKQlFXbENPMEZCUTJ4Q0xHTkJRVkVzUzBGQlN5eGxRVUZsTEV0QlFVc3NWVUZCVlN4bFFVRmxMRk5CUVZNc1MwRkJTeXhQUVVGUExIbENRVU14UlN4elFrRkJjVUlzVTBGQlV5eExRVUZMTEU5QlFVODdRVUZEYmtRc1VVRkJTU3haUVVGWkxFdEJRVXNzVDBGQlR6dEJRVU0xUWl4UlFVRkpMRTFCUVUwc1MwRkJTeXhIUVVGSExFMUJRVTA3UVVGRGVFSXNiMEpCUVdkQ0xFZEJRVWNzUjBGQlJ6dEJRVU5zUWl4VlFVRkpPMEZCUTBFc1pVRkJUeXhKUVVGSkxFbEJRVWtzUjBGQlJ5eFBRVUZQTzBGQlFVRXNaVUZGZEVJc1IwRkJVRHRCUVVOSkxHVkJRVTg3UVVGQlFUdEJRVUZCTzBGQlIyWXNVVUZCU1N4TlFVRkxMRk5CUVZNc1QwRkJUeXhUUVVGVkxFdEJRVWtzVTBGQlV6dEJRVU0xUXl4VlFVRkpMRmxCUVZrc1NVRkJSeXhKUVVGSkxHVkJRV1VzU1VGQlJ6dEJRVU42UXl4VlFVRkpMRkZCUVZFc1ZVRkJWVHRCUVVOMFFpeFZRVUZKTEZGQlFWRXNXVUZCV1R0QlFVTjRRaXhoUVVGUE8wRkJRVUVzVVVGRFNDeGhRVUZoTzBGQlFVRXNVVUZEWWl4aFFVRmhMRU5CUVVNc1VVRkRWaXhSUVVGUkxHTkJRV01zVTBGQlV5eE5RVUZOTEZGQlEycERMRk5CUVZVc1IwRkJSenRCUVVOVUxHTkJRVWtzVDBGQlR5eGhRVUZoTEVkQlFVYzdRVUZETTBJc2FVSkJRVThzVVVGQlVTeFRRVUZUTEV0QlFVc3NTMEZCU3l4VFFVRlZMRTFCUVUwN1FVRkJSU3h0UWtGQlR5eFBRVUZQTEU5QlFVODdRVUZCUVR0QlFVRkJMRmxCUTNwRkxGTkJRVlVzUjBGQlJ6dEJRVUZGTEdsQ1FVRlBMRTlCUVU4c1QwRkJUeXhoUVVGaExFZEJRVWM3UVVGQlFTeGhRVU14UkR0QlFVRkJPMEZCUVVFc1QwRkZXQ3hEUVVGRExFMUJRVTBzVVVGQlVTeE5RVUZOTEVsQlFVY3NTVUZCU1N4cFFrRkJhVUlzU1VGQlJ6dEJRVU51UkN4WFFVRlBMRTFCUTBnc1MwRkJTeXhOUVVGTkxFbEJRVWtzVFVGQlRTeFBRVUZQTEZsQlFWa3NTVUZCU1N4VlFVTjJReXhQUVVGUExHdENRVU5hTEdkQ1FVTkpMRXRCUVVzc1QwRkJUeXhyUWtGRFdpeExRVUZMTEUxQlFVMHNWVUZCVlN4UFFVRlBPMEZCUVVFN1FVRkZlRU1zVTBGQlRTeFZRVUZWTEZOQlFWTXNVMEZCVlN4blFrRkJaMEk3UVVGREwwTXNWMEZCVHl4TFFVRkxMR1ZCUVdVc1NVRkJTVHRCUVVGQk8wRkJSVzVETEZOQlFVMHNWVUZCVlN4UlFVRlJMRk5CUVZVc1kwRkJZenRCUVVNMVF5eFhRVUZQTEV0QlFVc3NaVUZCWlN4TlFVRk5PMEZCUVVFN1FVRkZja01zVTBGQlRTeFZRVUZWTEZOQlFWTXNVMEZCVlN4UlFVRlJPMEZCUTNaRExGZEJRVThzUzBGQlN5eGxRVUZsTEU5QlFVODdRVUZCUVR0QlFVVjBReXhUUVVGTkxGVkJRVlVzVVVGQlVTeFRRVUZWTEZOQlFWTTdRVUZEZGtNc1YwRkJUeXhMUVVGTExHVkJRV1VzVFVGQlRUdEJRVUZCTzBGQlJYSkRMRk5CUVUwc1ZVRkJWU3hQUVVGUExGTkJRVlVzVlVGQlZUdEJRVU4yUXl4WFFVRlBMRXRCUVVzc1pVRkJaU3hMUVVGTE8wRkJRVUU3UVVGRmNFTXNVMEZCVFN4VlFVRlZMRlZCUVZVc1UwRkJWU3hqUVVGak8wRkJRemxETEZkQlFVOHNTMEZCU3l4bFFVRmxMRkZCUVZFN1FVRkJRVHRCUVVWMlF5eFRRVUZOTEZWQlFWVXNaVUZCWlN4WFFVRlpPMEZCUTNaRExGZEJRVThzU1VGQlNTeExRVUZMTEVkQlFVY3NWMEZCVnl4SlFVRkpMRXRCUVVzc1IwRkJSeXhaUVVGWk8wRkJRVUU3UVVGRk1VUXNVMEZCVFN4VlFVRlZMRlZCUVZVc1UwRkJWU3hQUVVGUE8wRkJRM1pETEZkQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjc1YwRkJWeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFpRVUZaTEUxQlFVMHNVVUZCVVN4VFFVTm9SU3hOUVVGTkxFMUJRVTBzUzBGQlN5eFBRVUZQTEUxQlEzaENPMEZCUVVFN1FVRkZVaXhUUVVGTkxGVkJRVlVzVlVGQlZTeFhRVUZaTzBGQlEyeERMRmRCUVU4c1MwRkJTeXhsUVVGbE8wRkJRVUU3UVVGRkwwSXNVMEZCVFN4VlFVRlZMR0ZCUVdFc1UwRkJWU3hoUVVGaE8wRkJRMmhFTEZOQlFVc3NUMEZCVHl4alFVRmpPMEZCUXpGQ0xGRkJRVWtzVjBGQlZ5eFRRVUZWTEV0QlFVczdRVUZETVVJc1ZVRkJTU3hEUVVGRE8wRkJRMFFzWlVGQlR6dEJRVU5ZTEZWQlFVa3NUVUZCVFN4UFFVRlBMRTlCUVU4c1dVRkJXVHRCUVVOd1F5eGxRVUZUTEV0QlFVczdRVUZEVml4WlFVRkpMRTlCUVU4c1MwRkJTenRCUVVOYUxHTkJRVWs3UVVGRFFTeG5Ra0ZCU1N4TFFVRkxMRWxCUVVrN1FVRkJRU3h0UWtGRlZpeEhRVUZRTzBGQlFVRTdRVUZEVWl4aFFVRlBPMEZCUVVFN1FVRkZXQ3hSUVVGSkxFdEJRVXNzVDBGQlR5eFZRVUZWTzBGQlEzUkNMRmRCUVVzc1MwRkJTeXhSUVVGUkxGbEJRVmtzUzBGQlN5eFBRVUZQTzBGQlFVRTdRVUZGT1VNc1UwRkJTeXhQUVVGUExGZEJRVmM3UVVGRGRrSXNVMEZCU3l4TFFVRkxMRmRCUVZjN1FVRkRja0lzVjBGQlR6dEJRVUZCTzBGQlJWZ3NVMEZCVFN4VlFVRlZMR05CUVdNc1YwRkJXVHRCUVVOMFF5eHRRa0ZCWlN4VFFVRlRPMEZCUTNCQ0xHRkJRVThzVFVGQlRUdEJRVUZCTzBGQlJXcENMRmRCUVU4c1MwRkJTeXhYUVVGWE8wRkJRVUU3UVVGRk0wSXNVMEZCVFN4VlFVRlZMRTFCUVUwc1UwRkJWU3hMUVVGTExFdEJRVXM3UVVGRGRFTXNVVUZCU1N4UlFVRlJPMEZCUTFvc1VVRkJTU3hOUVVGTExFdEJRVXNzVDBGQlR5eFRRVUZUTEU5QlFVOHNTVUZCUnl4TlFVRk5MRlZCUVZVc1NVRkJSenRCUVVNelJDeFJRVUZKTEZkQlFWYzdRVUZEWml4UlFVRkpMRmRCUVZjc1RVRkJUVHRCUVVOcVFpeHBRa0ZCVnl3NFFrRkJPRUlzVTBGQlV6dEJRVUZCTzBGQlJYUkVMRmRCUVU4c1MwRkJTeXhQUVVGUExHRkJRV0VzVTBGQlZTeFBRVUZQTzBGQlF6ZERMR0ZCUVU4c1RVRkJUU3hMUVVGTExFOUJRVThzUTBGQlJTeFBRVUZqTEUxQlFVMHNUMEZCVHl4TlFVRk5MRTlCUVU4c1QwRkJUeXhEUVVGRExFOUJRVThzVFVGQlRTeFJRVUZSTEVOQlFVTTdRVUZCUVN4UFFVTnNSeXhMUVVGTExGTkJRVlVzUzBGQlN6dEJRVUZGTEdGQlFVOHNTVUZCU1N4alFVRmpMR0ZCUVdFc1QwRkJUeXhKUVVGSkxGTkJRVk1zVFVGQlRTeEpRVUZKTzBGQlFVRXNUMEZEZUVZc1MwRkJTeXhUUVVGVkxGbEJRVms3UVVGRE5VSXNWVUZCU1N4VFFVRlRPMEZCUTFRc1dVRkJTVHRCUVVOQkxIVkNRVUZoTEV0QlFVc3NVMEZCVXp0QlFVRkJMR2xDUVVWNFFpeEhRVUZRTzBGQlFVRTdRVUZCUVR0QlFVVktMR0ZCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMllzVTBGQlRTeFZRVUZWTEZOQlFWTXNVMEZCVlN4aFFVRmhMR1ZCUVdVN1FVRkRNMFFzVVVGQlNTeFBRVUZQTEdkQ1FVRm5RaXhaUVVGWkxFTkJRVU1zVVVGQlVTeGpRVUZqTzBGQlF6RkVMRlZCUVVrc1RVRkJUU3hoUVVGaExHRkJRV0VzUzBGQlN5eFBRVUZQTEZGQlFWRTdRVUZEZUVRc1ZVRkJTU3hSUVVGUk8wRkJRMUlzWlVGQlR5eFZRVUZWTEVsQlFVa3NWMEZCVnl4blFrRkJaMEk3UVVGRGNFUXNWVUZCU1R0QlFVTkJMRmxCUVVrc1QwRkJUeXhyUWtGQmEwSXNXVUZCV1R0QlFVTnlReXhsUVVGTExHVkJRV1VzVVVGQlVTeFRRVUZWTEZOQlFWTTdRVUZETTBNc2VVSkJRV0VzWVVGQllTeFRRVUZUTEdOQlFXTTdRVUZCUVR0QlFVRkJMR1ZCUjNCRU8wRkJRMFFzZDBKQlFXTXNZVUZCWVN4RFFVRkZMRTlCUVU4c1lVRkJZU3hUUVVGVE8wRkJRVUU3UVVGQlFTeGxRVWN6UkN4TFFVRlFPMEZCUVVFN1FVRkZRU3hoUVVGUExFdEJRVXNzVFVGQlRTeFBRVUZQTEU5QlFVOHNTMEZCU3l4UFFVRlBPMEZCUVVFc1YwRkZNME03UVVGRFJDeGhRVUZQTEV0QlFVc3NUVUZCVFN4UFFVRlBMRTlCUVU4c1lVRkJZU3hQUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWMxUkN4VFFVRk5MRlZCUVZVc1RVRkJUU3hUUVVGVkxFdEJRVXNzUzBGQlN6dEJRVU4wUXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhSUVVGSkxFMUJRVXNzUzBGQlN5eFBRVUZQTEZOQlFWTXNUMEZCVHl4SlFVRkhMRTFCUVUwc1ZVRkJWU3hKUVVGSE8wRkJRek5FTEZGQlFVa3NWMEZCVnp0QlFVTm1MRkZCUVVrc1YwRkJWeXhOUVVGTk8wRkJRMnBDTEdsQ1FVRlhMRGhDUVVFNFFpeFRRVUZUTzBGQlFVRTdRVUZGZEVRc1YwRkJUeXhMUVVGTExFOUJRVThzWVVGQllTeFRRVUZWTEU5QlFVODdRVUZCUlN4aFFVRlBMRTFCUVUwc1MwRkJTeXhQUVVGUExFTkJRVVVzVDBGQll5eE5RVUZOTEU5QlFVOHNVVUZCVVN4RFFVRkRMRmRCUVZjc1RVRkJUU3hQUVVGUExFOUJRVThzUTBGQlF5eFBRVUZQTzBGQlFVRXNUMEZEY0Vvc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGQlJTeGhRVUZQTEVsQlFVa3NZMEZCWXl4aFFVRmhMRTlCUVU4c1NVRkJTU3hUUVVGVExFMUJRVTBzU1VGQlNUdEJRVUZCTEU5QlF6RkdMRXRCUVVzc1UwRkJWU3haUVVGWk8wRkJRelZDTEZWQlFVa3NVMEZCVXp0QlFVTlVMRmxCUVVrN1FVRkRRU3gxUWtGQllTeExRVUZMTEZOQlFWTTdRVUZCUVN4cFFrRkZlRUlzUjBGQlVEdEJRVUZCTzBGQlFVRTdRVUZGU2l4aFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVkbUxGTkJRVTBzVlVGQlZTeFRRVUZUTEZOQlFWVXNTMEZCU3p0QlFVTndReXhSUVVGSkxGRkJRVkU3UVVGRFdpeFhRVUZQTEV0QlFVc3NUMEZCVHl4aFFVRmhMRk5CUVZVc1QwRkJUenRCUVVGRkxHRkJRVThzVFVGQlRTeExRVUZMTEU5QlFVOHNRMEZCUlN4UFFVRmpMRTFCUVUwc1ZVRkJWU3hOUVVGTkxFTkJRVU03UVVGQlFTeFBRVU01Unl4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzU1VGQlNTeGpRVUZqTEdGQlFXRXNUMEZCVHl4SlFVRkpMRk5CUVZNc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGRkwwWXNVMEZCVFN4VlFVRlZMRkZCUVZFc1YwRkJXVHRCUVVOb1F5eFJRVUZKTEZGQlFWRTdRVUZEV2l4WFFVRlBMRXRCUVVzc1QwRkJUeXhoUVVGaExGTkJRVlVzVDBGQlR6dEJRVUZGTEdGQlFVOHNUVUZCVFN4TFFVRkxMRTlCUVU4c1EwRkJSU3hQUVVGakxFMUJRVTBzWlVGQlpTeFBRVUZQTzBGQlFVRXNUMEZEYmtnc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGQlJTeGhRVUZQTEVsQlFVa3NZMEZCWXl4aFFVRmhMRTlCUVU4c1NVRkJTU3hUUVVGVExFMUJRVTA3UVVGQlFUdEJRVUZCTzBGQlJTOUdMRk5CUVUwc1ZVRkJWU3hWUVVGVkxGTkJRVlVzVDBGQlRUdEJRVU4wUXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhYUVVGUExFdEJRVXNzVDBGQlR5eFpRVUZaTEZOQlFWVXNUMEZCVHp0QlFVTTFReXhoUVVGUExFMUJRVTBzUzBGQlN5eFJRVUZSTzBGQlFVRXNVVUZEZEVJc1RVRkJUVHRCUVVGQkxGRkJRMDQ3UVVGQlFTeFRRVU5FTEV0QlFVc3NVMEZCVlN4UlFVRlJPMEZCUVVVc1pVRkJUeXhQUVVGUExFbEJRVWtzVTBGQlZTeExRVUZMTzBGQlFVVXNhVUpCUVU4c1RVRkJUU3hMUVVGTExGRkJRVkVzUzBGQlN6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUjNSSExGTkJRVTBzVlVGQlZTeFZRVUZWTEZOQlFWVXNVMEZCVXl4bFFVRmxMRk5CUVZNN1FVRkRha1VzVVVGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1N4UlFVRlBMRTFCUVUwc1VVRkJVU3hwUWtGQmFVSXNaMEpCUVdkQ08wRkJRekZFTEdOQlFWVXNWMEZCV1N4VFFVRlBMRk5CUVZrN1FVRkRla01zVVVGQlNTeGpRVUZqTEZWQlFWVXNVVUZCVVN4VlFVRlZPMEZCUXpsRExGZEJRVThzUzBGQlN5eFBRVUZQTEdGQlFXRXNVMEZCVlN4UFFVRlBPMEZCUXpkRExGVkJRVWtzVFVGQlN5eE5RVUZOTEU5QlFVOHNVMEZCVXl4UFFVRlBMRWxCUVVjc1RVRkJUU3hWUVVGVkxFbEJRVWM3UVVGRE5VUXNWVUZCU1N4WFFVRlhPMEZCUTFnc1kwRkJUU3hKUVVGSkxGZEJRVmNzWjBKQlFXZENPMEZCUTNwRExGVkJRVWtzVTBGQlVTeE5RVUZMTEZkQlFWY3NVVUZCVVR0QlFVTm9ReXhqUVVGTkxFbEJRVWtzVjBGQlZ5eG5Ra0ZCWjBJN1FVRkRla01zVlVGQlNTeGhRVUZoTEZGQlFWRTdRVUZEZWtJc1ZVRkJTU3hsUVVGbExGZEJRVmNzVDBGRE1VSXNVVUZCVVN4SlFVRkpMRGhDUVVFNFFpeFpRVU14UXp0QlFVTktMR0ZCUVU4c1RVRkJUU3hMUVVGTExFOUJRVThzUTBGQlJTeFBRVUZqTEUxQlFVMHNUMEZCVHl4TlFVRk5MRTlCUVUwc1VVRkJVU3hqUVVGakxHTkJRMjVHTEV0QlFVc3NVMEZCVlN4TFFVRkpPMEZCUTNCQ0xGbEJRVWtzWTBGQll5eEpRVUZITEdGQlFXRXNWVUZCVlN4SlFVRkhMRk5CUVZNc1lVRkJZU3hKUVVGSExGbEJRVmtzVjBGQlZ5eEpRVUZITzBGQlEyeEhMRmxCUVVrc1UwRkJVeXhqUVVGakxGVkJRVlU3UVVGRGNrTXNXVUZCU1N4blFrRkJaMEk3UVVGRGFFSXNhVUpCUVU4N1FVRkRXQ3hqUVVGTkxFbEJRVWtzVlVGQlZTeE5RVUZOTEU5QlFVOHNhVUpCUVdsQ0xHTkJRV01zVTBGQlV5eGhRVUZoTEhOQ1FVRnpRanRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWw0U0N4VFFVRk5MRlZCUVZVc1ZVRkJWU3hUUVVGVkxGTkJRVk1zWlVGQlpTeFRRVUZUTzBGQlEycEZMRkZCUVVrc1VVRkJVVHRCUVVOYUxGRkJRVWtzVVVGQlR5eE5RVUZOTEZGQlFWRXNhVUpCUVdsQ0xHZENRVUZuUWp0QlFVTXhSQ3hqUVVGVkxGZEJRVmtzVTBGQlR5eFRRVUZaTzBGQlEzcERMRkZCUVVrc1kwRkJZeXhWUVVGVkxGRkJRVkVzVlVGQlZUdEJRVU01UXl4WFFVRlBMRXRCUVVzc1QwRkJUeXhoUVVGaExGTkJRVlVzVDBGQlR6dEJRVU0zUXl4VlFVRkpMRTFCUVVzc1RVRkJUU3hQUVVGUExGTkJRVk1zVDBGQlR5eEpRVUZITEUxQlFVMHNWVUZCVlN4SlFVRkhPMEZCUXpWRUxGVkJRVWtzVjBGQlZ6dEJRVU5ZTEdOQlFVMHNTVUZCU1N4WFFVRlhMR2RDUVVGblFqdEJRVU42UXl4VlFVRkpMRk5CUVZFc1RVRkJTeXhYUVVGWExGRkJRVkU3UVVGRGFFTXNZMEZCVFN4SlFVRkpMRmRCUVZjc1owSkJRV2RDTzBGQlEzcERMRlZCUVVrc1lVRkJZU3hSUVVGUk8wRkJRM3BDTEZWQlFVa3NaVUZCWlN4WFFVRlhMRTlCUXpGQ0xGRkJRVkVzU1VGQlNTdzRRa0ZCT0VJc1dVRkRNVU03UVVGRFNpeGhRVUZQTEUxQlFVMHNTMEZCU3l4UFFVRlBMRU5CUVVVc1QwRkJZeXhOUVVGTkxFOUJRVThzVFVGQlRTeFBRVUZOTEZGQlFWRXNZMEZCWXl4alFVTnVSaXhMUVVGTExGTkJRVlVzUzBGQlNUdEJRVU53UWl4WlFVRkpMR05CUVdNc1NVRkJSeXhoUVVGaExGVkJRVlVzU1VGQlJ5eFRRVUZUTEdGQlFXRXNTVUZCUnl4WlFVRlpMRmRCUVZjc1NVRkJSenRCUVVOc1J5eFpRVUZKTEZOQlFWTXNZMEZCWXl4VlFVRlZPMEZCUTNKRExGbEJRVWtzWjBKQlFXZENPMEZCUTJoQ0xHbENRVUZQTzBGQlExZ3NZMEZCVFN4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExHbENRVUZwUWl4alFVRmpMRk5CUVZNc1lVRkJZU3h6UWtGQmMwSTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkplRWdzVTBGQlRTeFZRVUZWTEdGQlFXRXNVMEZCVlN4UFFVRk5PMEZCUTNwRExGRkJRVWtzVVVGQlVUdEJRVU5hTEZGQlFVa3NWVUZCVlN4TlFVRkxPMEZCUTI1Q0xGZEJRVThzUzBGQlN5eFBRVUZQTEdGQlFXRXNVMEZCVlN4UFFVRlBPMEZCUXpkRExHRkJRVThzVFVGQlRTeExRVUZMTEU5QlFVOHNRMEZCUlN4UFFVRmpMRTFCUVUwc1ZVRkJWU3hOUVVGTk8wRkJRVUVzVDBGRGFFVXNTMEZCU3l4VFFVRlZMRXRCUVVrN1FVRkRiRUlzVlVGQlNTeGpRVUZqTEVsQlFVY3NZVUZCWVN4aFFVRmhMRWxCUVVjc1dVRkJXU3hYUVVGWExFbEJRVWM3UVVGRE5VVXNWVUZCU1N4blFrRkJaMEk3UVVGRGFFSXNaVUZCVHp0QlFVTllMRmxCUVUwc1NVRkJTU3hWUVVGVkxFMUJRVTBzVDBGQlR5eHZRa0ZCYjBJc1kwRkJZeXhUUVVGVExGVkJRVlVzYzBKQlFYTkNPMEZCUVVFN1FVRkJRVHRCUVVkd1NDeFRRVUZQTzBGQlFVRTdRVUZIV0N4blFrRkJaMElzUzBGQlN6dEJRVU5xUWl4TlFVRkpMRTFCUVUwN1FVRkRWaXhOUVVGSkxFdEJRVXNzVTBGQlZTeFhRVUZYTEZsQlFWazdRVUZEZEVNc1VVRkJTU3haUVVGWk8wRkJRMW9zVlVGQlNTeExRVUZKTEZWQlFWVXNVVUZCVVN4UFFVRlBMRWxCUVVrc1RVRkJUU3hMUVVGSk8wRkJReTlETEdGQlFVOHNSVUZCUlR0QlFVTk1MR0ZCUVVzc1MwRkJTU3hMUVVGTExGVkJRVlU3UVVGRE5VSXNWVUZCU1N4WFFVRlhMRlZCUVZVc1RVRkJUU3hOUVVGTk8wRkJRM0pETEdGQlFVODdRVUZCUVN4bFFVVkdMRTlCUVZFc1kwRkJaU3hWUVVGVk8wRkJRM1JETEdGQlFVOHNTVUZCU1R0QlFVRkJPMEZCUVVFN1FVRkhia0lzUzBGQlJ5eGxRVUZsTzBGQlEyeENMRmRCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzVlVGQlZTeFJRVUZSTEVsQlFVa3NSMEZCUnl4RlFVRkZMRWRCUVVjN1FVRkRPVU1zVVVGQlNTeFZRVUZWTzBGQlFVRTdRVUZGYkVJc1UwRkJUenRCUVVOUUxHVkJRV0VzVjBGQlZ5eGxRVUZsTEdsQ1FVRnBRanRCUVVOd1JDeFJRVUZKTEU5QlFVOHNZMEZCWXp0QlFVTnlRaXhoUVVGUExHOUNRVUZ2UWp0QlFVTXZRaXhSUVVGSkxFTkJRVU03UVVGRFJDeHpRa0ZCWjBJN1FVRkRjRUlzVVVGQlNTeERRVUZETzBGQlEwUXNkMEpCUVd0Q08wRkJRM1JDTEZGQlFVa3NWVUZCVlR0QlFVRkJMRTFCUTFZc1lVRkJZVHRCUVVGQkxFMUJRMklzVFVGQlRUdEJRVUZCTEUxQlEwNHNWMEZCVnl4VFFVRlZMRWxCUVVrN1FVRkRja0lzV1VGQlNTeFJRVUZSTEZsQlFWa3NVVUZCVVN4UlFVRlJMRWxCUVVrN1FVRkRlRU1zYTBKQlFWRXNXVUZCV1N4TFFVRkxPMEZCUTNwQ0xHdENRVUZSTEU5QlFVOHNZMEZCWXl4UlFVRlJMRTFCUVUwN1FVRkJRVHRCUVVGQk8wRkJRVUVzVFVGSGJrUXNZVUZCWVN4VFFVRlZMRWxCUVVrN1FVRkRka0lzWjBKQlFWRXNZMEZCWXl4UlFVRlJMRmxCUVZrc1QwRkJUeXhUUVVGVkxFbEJRVWs3UVVGQlJTeHBRa0ZCVHl4UFFVRlBPMEZCUVVFN1FVRkRMMFVzWjBKQlFWRXNUMEZCVHl4UlFVRlJMRmxCUVZrc1QwRkJUeXhsUVVGbE8wRkJRVUU3UVVGQlFUdEJRVWRxUlN4UlFVRkpMR0ZCUVdFc1IwRkJSeXhoUVVGaE8wRkJRMnBETEZkQlFVODdRVUZCUVR0QlFVVllMQ3RDUVVFMlFpeExRVUZMTzBGQlF6bENMRk5CUVVzc1MwRkJTeXhSUVVGUkxGTkJRVlVzVjBGQlZ6dEJRVU51UXl4VlFVRkpMRTlCUVU4c1NVRkJTVHRCUVVObUxGVkJRVWtzVVVGQlVTeFBRVUZQTzBGQlEyWXNXVUZCU1N4WFFVRlhMRWxCUVVrc1YwRkJWeXhKUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVUZCTEdsQ1FVVTFReXhUUVVGVExGRkJRVkU3UVVGRGRFSXNXVUZCU1N4VlFVRlZMRWxCUVVrc1YwRkJWeXhSUVVGUkxHZENRVUZuUWp0QlFVTnFSQ3hqUVVGSkxFdEJRVWtzVlVGQlZTeFJRVUZSTEZGQlFVOHNTVUZCU1N4TlFVRk5PMEZCUXpORExHbENRVUZQTzBGQlEwZ3NhMEpCUVVzc1RVRkJTeXhWUVVGVk8wRkJRM2hDTEd0Q1FVRlJMRmxCUVZrc1VVRkJVU3hUUVVGVkxFbEJRVWs3UVVGRGRFTXNiVUpCUVU4c2NVSkJRWEZDTzBGQlEzaENMR2xDUVVGSExFMUJRVTBzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCVFROQ0xHTkJRVTBzU1VGQlNTeFhRVUZYTEdkQ1FVRm5RanRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXR5UkN3NFFrRkJPRUlzVjBGQlZ5eGhRVUZoTzBGQlEyeEVMRk5CUVU4c1lVRkJZU3hMUVVGTExFTkJRVVU3UVVGRE0wSXNVMEZCVHp0QlFVRkJPMEZCUjFnc1owTkJRV2RETEVsQlFVazdRVUZEYUVNc1UwRkJUeXh4UWtGQmNVSXNUVUZCVFN4WFFVRlhMR2RDUVVGbExFMUJRVTBzWVVGQllTeFBRVUZQTzBGQlEyeEdMRk5CUVVzc1MwRkJTenRCUVVOV0xGTkJRVXNzVFVGQlRUdEJRVU5ZTEZOQlFVc3NUMEZCVHp0QlFVTmFMRk5CUVVzc1UwRkJVenRCUVVOa0xGTkJRVXNzVDBGQlR5eEhRVUZITEZkQlFWY3NVVUZCVVN4SFFVRkhMRmRCUVZjc1RVRkJUU3hQUVVGUExFOUJRVThzVFVGQlRUdEJRVUZCTEUxQlEzUkZMRlZCUVZrc1EwRkJReXh0UWtGQmJVSTdRVUZCUVN4TlFVTm9ReXhUUVVGWExFTkJRVU1zYlVKQlFXMUNPMEZCUVVFc1RVRkRMMElzVlVGQldTeERRVUZETEcxQ1FVRnRRanRCUVVGQkxFMUJRMmhETEZWQlFWa3NRMEZCUXl4dFFrRkJiVUk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMTlVNc2VVSkJRWGxDTEV0QlFVc3NiVUpCUVcxQ08wRkJRemRETEZOQlFVOHNRMEZCUlN4TFFVRkpMRlZCUVZVc1NVRkJTU3hoUVVGaExFbEJRVWtzVDBGRGRrTXNjVUpCUVc5Q0xFbEJRVWtzV1VGQldTeERRVUZETEVsQlFVazdRVUZCUVR0QlFVVnNSQ3h0UWtGQmJVSXNTMEZCU3l4SlFVRkpPMEZCUTNoQ0xFMUJRVWtzVTBGQlV5eFJRVUZSTEVsQlFVa3NVVUZCVVR0QlFVRkJPMEZCUlhKRExIbENRVUY1UWl4TFFVRkxMRk5CUVZNc1pVRkJaVHRCUVVOc1JDeE5RVUZKTEU5QlFVOHNTVUZCU1R0QlFVTm1MRTFCUVVrc1pVRkJaU3hQUVVGUExGZEJRVms3UVVGQlJTeFhRVUZQTEZGQlFWRXNVVUZCVVR0QlFVRkJMRTFCUVdkQ08wRkJReTlGTEUxQlFVa3NXVUZCV1N4cFFrRkJhVUlzUTBGQlF6dEJRVUZCTzBGQlJYUkRMSGRDUVVGM1FpeExRVUZMTEVsQlFVazdRVUZETjBJc1RVRkJTU3hWUVVGVkxGRkJRVkVzU1VGQlNTeFRRVUZUTzBGQlFVRTdRVUZGZGtNc2VVSkJRWGxDTEV0QlFVc3NXVUZCV1R0QlFVTjBReXhOUVVGSkxFbEJRVWs3UVVGRFNpeFhRVUZQTEZkQlFWYzdRVUZEZEVJc1RVRkJTU3hSUVVGUkxGZEJRVmNzYTBKQlFXdENMRWxCUVVrN1FVRkROME1zVFVGQlNTeERRVUZETzBGQlEwUXNWVUZCVFN4SlFVRkpMRmRCUVZjc1QwRkJUeXhoUVVGaExFbEJRVWtzVVVGQlVTeHpRa0ZCYzBJc1YwRkJWeXhQUVVGUE8wRkJRMnBITEZOQlFVODdRVUZCUVR0QlFVVllMRzlDUVVGdlFpeExRVUZMTEZkQlFWY3NUMEZCVHp0QlFVTjJReXhOUVVGSkxGRkJRVkVzWjBKQlFXZENMRXRCUVVzc1ZVRkJWVHRCUVVNelF5eFRRVUZQTEZWQlFWVXNWMEZCVnp0QlFVRkJMRWxCUTNoQ08wRkJRVUVzU1VGRFFTeFJRVUZSTEVOQlFVTXNTVUZCU1R0QlFVRkJMRWxCUTJJc1UwRkJVeXhKUVVGSkxGRkJRVkU3UVVGQlFTeEpRVU55UWl4UlFVRlJMRU5CUVVNc1EwRkJReXhKUVVGSk8wRkJRVUVzU1VGRFpDeFBRVUZQTzBGQlFVRXNUVUZEU0R0QlFVRkJMRTFCUTBFc1QwRkJUeXhKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNYWkNMR05CUVdNc1MwRkJTeXhKUVVGSkxGZEJRVmNzVjBGQlZ6dEJRVU42UXl4TlFVRkpMRk5CUVZNc1NVRkJTU3hsUVVGbExGRkJRVkVzU1VGQlNTeFJRVUZSTEVsQlFVa3NhMEpCUVd0Q0xFbEJRVWs3UVVGRE9VVXNUVUZCU1N4RFFVRkRMRWxCUVVrc1NVRkJTVHRCUVVOVUxGZEJRVThzVVVGQlVTeFhRVUZYTEV0QlFVc3NWMEZCVnl4WlFVRlpMRkZCUVZFc1NVRkJTU3hYUVVGWExGTkJRVk1zU1VGQlNTeERRVUZETEVsQlFVa3NXVUZCV1N4SlFVRkpPMEZCUVVFc1UwRkZPVWM3UVVGRFJDeFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRkZCUVZFc1UwRkJWU3hOUVVGTkxGRkJRVkVzVTBGQlV6dEJRVU42UXl4VlFVRkpMRU5CUVVNc1ZVRkJWU3hQUVVGUExGRkJRVkVzVTBGQlV5eFRRVUZWTEZGQlFWRTdRVUZCUlN4bFFVRlBMRTlCUVU4c1MwRkJTenRCUVVGQkxGTkJRVmtzVTBGQlZTeExRVUZMTzBGQlFVVXNaVUZCVHl4UFFVRlBMRXRCUVVzN1FVRkJRU3hWUVVGVk8wRkJRM0JKTEZsQlFVa3NZVUZCWVN4UFFVRlBPMEZCUTNoQ0xGbEJRVWtzVFVGQlRTeExRVUZMTzBGQlEyWXNXVUZCU1N4UlFVRlJPMEZCUTFJc1owSkJRVTBzUzBGQlN5eEpRVUZKTEZkQlFWYzdRVUZET1VJc1dVRkJTU3hEUVVGRExFOUJRVThzVDBGQlR5eE5RVUZOTzBGQlEzSkNMR2RDUVVGTkxFOUJRVTg3UVVGRFlpeGhRVUZITEUxQlFVMHNVVUZCVVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVrM1FpeFhRVUZQTEZGQlFWRXNTVUZCU1R0QlFVRkJMRTFCUTJZc1NVRkJTU3hIUVVGSExGTkJRVk1zVDBGQlR6dEJRVUZCTEUxQlEzWkNMRkZCUVZFc1YwRkJWeXhMUVVGTExGZEJRVmNzV1VGQldTeEpRVUZKTEZkQlFWY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1dVRkJXU3hKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNYUkhMR2xDUVVGcFFpeGxRVUZsTEZGQlFWRXNTVUZCU1N4aFFVRmhPMEZCUTNKRUxFMUJRVWtzVjBGQlZ5eGpRVUZqTEZOQlFWVXNSMEZCUnl4SFFVRkhMRWRCUVVjN1FVRkJSU3hYUVVGUExFZEJRVWNzV1VGQldTeEpRVUZKTEVkQlFVYzdRVUZCUVN4TlFVRlJPMEZCUTNaR0xFMUJRVWtzV1VGQldTeExRVUZMTzBGQlEzSkNMRk5CUVU4c1kwRkJZeXhMUVVGTExGTkJRVlVzVVVGQlVUdEJRVU40UXl4UlFVRkpMRkZCUVZFN1FVRkRVaXhoUVVGUExFOUJRVThzVFVGQlRTeFhRVUZaTzBGQlF6VkNMRmxCUVVrc1NVRkJTU3hYUVVGWk8wRkJRVVVzYVVKQlFVOHNUMEZCVHp0QlFVRkJPMEZCUTNCRExGbEJRVWtzUTBGQlF5eFZRVUZWTEU5QlFVOHNVVUZCVVN4VFFVRlZMRlZCUVZVN1FVRkJSU3hwUWtGQlR5eEpRVUZKTzBGQlFVRXNWMEZCWVN4VFFVRlZMRXRCUVVzN1FVRkJSU3hwUWtGQlR5eExRVUZMTzBGQlFVMHNZMEZCU1R0QlFVRkJMRmRCUVZFc1UwRkJWU3hIUVVGSE8wRkJRVVVzYVVKQlFVOHNTMEZCU3p0QlFVRkpMR05CUVVrN1FVRkJRVHRCUVVNeFNpeHZRa0ZCVlN4UFFVRlBMRTlCUVU4c1VVRkJVU3hUUVVGVkxGVkJRVlU3UVVGQlJTeHRRa0ZCVHl4SlFVRkpPMEZCUVVFN1FVRkRja1U3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVMW9RaXhKUVVGSkxHRkJRV1VzVjBGQldUdEJRVU16UWl4NVFrRkJjMEk3UVVGQlFUdEJRVVYwUWl4alFVRlhMRlZCUVZVc1VVRkJVU3hUUVVGVkxFbEJRVWtzU1VGQlNUdEJRVU16UXl4UlFVRkpMRTFCUVUwc1MwRkJTenRCUVVObUxGZEJRVThzU1VGQlNTeFJRVU5RTEVsQlFVa3NUVUZCVFN4UFFVRlBMRTFCUVUwc1ZVRkJWU3hMUVVGTExFMUJRVTBzU1VGQlNTeFZRVU5vUkN4SlFVRkpMRTFCUVUwc1QwRkJUeXhaUVVGWkxFbEJRVWtzUzBGQlN6dEJRVUZCTzBGQlJUbERMR05CUVZjc1ZVRkJWU3hUUVVGVExGTkJRVlVzU1VGQlNUdEJRVU40UXl4UlFVRkpMRTFCUVUwc1MwRkJTenRCUVVObUxGZEJRVThzU1VGQlNTeFJRVU5RTEVsQlFVa3NUVUZCVFN4UFFVRlBMRTFCUVUwc1ZVRkJWU3hMUVVGTExFMUJRVTBzU1VGQlNTeFZRVU5vUkN4SlFVRkpMRTFCUVUwc1QwRkJUeXhoUVVGaExFbEJRVWs3UVVGQlFUdEJRVVV4UXl4alFVRlhMRlZCUVZVc1owSkJRV2RDTEZOQlFWVXNTVUZCU1R0QlFVTXZReXhSUVVGSkxFMUJRVTBzUzBGQlN6dEJRVU5tTEZGQlFVa3NXVUZCV1N4UlFVRlJMRWxCUVVrc1YwRkJWenRCUVVGQk8wRkJSVE5ETEdOQlFWY3NWVUZCVlN4WFFVRlhMRk5CUVZVc1NVRkJTU3hYUVVGWE8wRkJRM0pFTEZkQlFVOHNTMEZCU3l4TFFVRkxMRTFCUVUwc1NVRkJTU3hYUVVGWExFdEJRVXNzUzBGQlN5eE5RVUZOTzBGQlFVRTdRVUZGTVVRc1kwRkJWeXhWUVVGVkxGRkJRVkVzVTBGQlZTeFJRVUZQTzBGQlF6RkRMRkZCUVVrc1MwRkJTeXhQUVVGUExFOUJRVThzUzBGQlN5eFpRVUZaTEZsQlFWa3NUVUZCVFN4UFFVRlBMRTlCUVU4c1MwRkJTenRCUVVNM1JTeFJRVUZKTzBGQlEwRXNZVUZCVHl4TFFVRkxPMEZCUTJoQ0xFOUJRVWNzVDBGQlR6dEJRVU5XTEZkQlFVODdRVUZCUVR0QlFVVllMR05CUVZjc1ZVRkJWU3hOUVVGTkxGZEJRVms3UVVGRGJrTXNVMEZCU3l4TFFVRkxMR05CUVdNN1FVRkRlRUlzVjBGQlR6dEJRVUZCTzBGQlJWZ3NZMEZCVnl4VlFVRlZMRTlCUVU4c1UwRkJWU3hKUVVGSk8wRkJRM1JETEZGQlFVa3NUVUZCVFN4TFFVRkxPMEZCUTJZc1YwRkJUeXhMUVVGTExFMUJRVTBzVTBGQlZTeFBRVUZQTzBGQlFVVXNZVUZCVHl4TFFVRkxMRXRCUVVzc1NVRkJTU3hQUVVGUExFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZGTDBVc1kwRkJWeXhWUVVGVkxGRkJRVkVzVTBGQlZTeEpRVUZKTzBGQlEzWkRMRkZCUVVrc1VVRkJVVHRCUVVOYUxGZEJRVThzUzBGQlN5eE5RVUZOTEZOQlFWVXNUMEZCVHp0QlFVTXZRaXhWUVVGSkxFMUJRVTBzVFVGQlRUdEJRVU5vUWl4VlFVRkpMRmxCUVZrc1NVRkJTU3hOUVVGTk8wRkJRekZDTEZWQlFVa3NaMEpCUVdkQ0xFdEJRVXNzVDBGQlR6dEJRVU0xUWl4bFFVRlBMRlZCUVZVc1RVRkJUVHRCUVVGQkxGVkJRMjVDTzBGQlFVRXNWVUZEUVN4UFFVRlBPMEZCUVVFc1dVRkRTQ3hQUVVGUExHZENRVUZuUWl4TFFVRkxMRlZCUVZVN1FVRkJRU3haUVVOMFF5eFBRVUZQTEVsQlFVazdRVUZCUVR0QlFVRkJMRmRCUldoQ0xFdEJRVXNzVTBGQlZTeFJRVUZQTzBGQlFVVXNhVUpCUVU4c1MwRkJTeXhKUVVGSkxGRkJRVThzU1VGQlNUdEJRVUZCTzBGQlFVRXNZVUZGY2tRN1FVRkRSQ3haUVVGSkxGRkJRVkU3UVVGRFdpeGxRVUZQTEV0QlFVc3NTMEZCU3l4WFFVRlpPMEZCUVVVc1dVRkJSVHRCUVVGUExHbENRVUZQTzBGQlFVRXNWMEZCVlN4UFFVRlBMRmRCUXpORUxFdEJRVXNzVjBGQldUdEJRVUZGTEdsQ1FVRlBPMEZCUVVFN1FVRkJRVHRCUVVGQkxFOUJSWEJETEV0QlFVczdRVUZCUVR0QlFVVmFMR05CUVZjc1ZVRkJWU3hUUVVGVExGTkJRVlVzVTBGQlV5eEpRVUZKTzBGQlEycEVMRkZCUVVrc1VVRkJVU3hSUVVGUkxFMUJRVTBzUzBGQlN5eFhRVUZYTEZkQlFWY3NUVUZCVFN4SlFVRkpMRmxCUVZrc1RVRkJUU3hUUVVGVE8wRkJRekZHTEc5Q1FVRm5RaXhMUVVGTExFZEJRVWM3UVVGRGNFSXNWVUZCU1R0QlFVTkJMR1ZCUVU4c1QwRkJUeXhKUVVGSkxFMUJRVTBzUzBGQlN5eEpRVUZKTzBGQlEzSkRMR0ZCUVU4c1NVRkJTVHRCUVVGQk8wRkJSV1lzVVVGQlNTeFJRVUZSTEV0QlFVc3NTMEZCU3l4UlFVRlJMRk5CUVZNc1NVRkJTVHRCUVVNelF5eHZRa0ZCWjBJc1IwRkJSeXhIUVVGSE8wRkJRMnhDTEZWQlFVa3NUMEZCVHl4UFFVRlBMRWRCUVVjc1dVRkJXU3hQUVVGUExFOUJRVThzUjBGQlJ6dEJRVU5zUkN4aFFVRlBMRTlCUVU4c1QwRkJUeXhEUVVGRExGRkJRVkVzVDBGQlR5eFBRVUZQTEZGQlFWRTdRVUZCUVR0QlFVVjRSQ3hYUVVGUExFdEJRVXNzVVVGQlVTeFRRVUZWTEVkQlFVYzdRVUZETjBJc1lVRkJUeXhGUVVGRkxFdEJRVXM3UVVGQlFTeFBRVU5tTEV0QlFVczdRVUZCUVR0QlFVVmFMR05CUVZjc1ZVRkJWU3hWUVVGVkxGTkJRVlVzU1VGQlNUdEJRVU42UXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhYUVVGUExFdEJRVXNzVFVGQlRTeFRRVUZWTEU5QlFVODdRVUZETDBJc1ZVRkJTU3hOUVVGTkxFMUJRVTA3UVVGRGFFSXNWVUZCU1N4SlFVRkpMRkZCUVZFc1ZVRkJWU3huUWtGQlowSXNTMEZCU3l4VFFVRlRMRWxCUVVrc1VVRkJVU3hIUVVGSE8wRkJRMjVGTEZsQlFVa3NaMEpCUVdkQ0xFbEJRVWs3UVVGRGVFSXNXVUZCU1N4UlFVRlJMR2RDUVVGblFpeExRVUZMTEVsQlFVa3NUVUZCVFN4TFFVRkxPMEZCUTJoRUxHVkJRVThzU1VGQlNTeE5RVUZOTEV0QlFVc3NUVUZCVFR0QlFVRkJMRlZCUTNoQ08wRkJRVUVzVlVGRFFTeFBRVUZQTEVsQlFVazdRVUZCUVN4VlFVTllMRkZCUVZFN1FVRkJRU3hWUVVOU0xFOUJRVTg3UVVGQlFTeFpRVU5JTzBGQlFVRXNXVUZEUVN4UFFVRlBMRWxCUVVrN1FVRkJRVHRCUVVGQkxGZEJSV2hDTEV0QlFVc3NVMEZCVlN4TFFVRkpPMEZCUTJ4Q0xHTkJRVWtzVTBGQlV5eEpRVUZITzBGQlEyaENMR2xDUVVGUExHZENRVUZuUWl4UFFVRlBMRWxCUVVrc2FVSkJRV2xDTzBGQlFVRTdRVUZCUVN4aFFVZDBSRHRCUVVORUxGbEJRVWtzVFVGQlRUdEJRVU5XTEdWQlFVOHNTMEZCU3l4TFFVRkxMRk5CUVZVc1RVRkJUVHRCUVVGRkxHbENRVUZQTEVsQlFVa3NTMEZCU3p0QlFVRkJMRmRCUVZVc1QwRkJUeXhKUVVGSkxFMUJRVTBzVFVGQlRTeExRVUZMTEZkQlFWazdRVUZCUlN4cFFrRkJUenRCUVVGQk8wRkJRVUU3UVVGQlFTeFBRVVZ1U0R0QlFVRkJPMEZCUlZBc1kwRkJWeXhWUVVGVkxGTkJRVk1zVTBGQlZTeFJRVUZSTzBGQlF6VkRMRkZCUVVrc1RVRkJUU3hMUVVGTE8wRkJRMllzVVVGQlNTeFZRVUZWTzBGQlExWXNZVUZCVHp0QlFVTllMRkZCUVVrc1ZVRkJWVHRCUVVOa0xGRkJRVWtzWjBKQlFXZENMRTFCUVUwN1FVRkRkRUlzYzBKQlFXZENMRXRCUVVzc1YwRkJXVHRCUVVNM1FpeFpRVUZKTEdGQlFXRTdRVUZEYWtJc1pVRkJUeXhUUVVGVkxGRkJRVkVzVTBGQlV6dEJRVU01UWl4alFVRkpMR1ZCUVdVN1FVRkRaaXh0UWtGQlR6dEJRVU5ZTEdOQlFVa3NaVUZCWlN4SFFVRkhPMEZCUTJ4Q0xHTkJRVVU3UVVGRFJpeHRRa0ZCVHp0QlFVRkJPMEZCUlZnc2EwSkJRVkVzVjBGQldUdEJRVU5vUWl4dFFrRkJUeXhSUVVGUk8wRkJRMllzZVVKQlFXRTdRVUZCUVR0QlFVVnFRaXhwUWtGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUVN4WFFVbGtPMEZCUTBRc2MwSkJRV2RDTEV0QlFVc3NWMEZCV1R0QlFVTTNRaXhaUVVGSkxHRkJRV0U3UVVGRGFrSXNaVUZCVHl4WFFVRlpPMEZCUVVVc2FVSkJRVkVzUlVGQlJTeGhRVUZoTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUjNCRUxGZEJRVTg3UVVGQlFUdEJRVVZZTEdOQlFWY3NWVUZCVlN4UlFVRlJMRk5CUVZVc1UwRkJVenRCUVVNMVF5eFRRVUZMTEV0QlFVc3NVVUZCVVN4TFFVRkxMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVTg3UVVGRE5VTXNiMEpCUVdkQ0xFdEJRVXNzVFVGQlRTeFhRVUZaTzBGQlEyNURMRlZCUVVrc1YwRkJWenRCUVVObUxHRkJRVThzVTBGQlZTeFJRVUZSTEZOQlFWTXNVMEZCVXp0QlFVTjJReXhaUVVGSkxFVkJRVVVzV1VGQldUdEJRVU5rTEd0Q1FVRlJPMEZCUTFvc1pVRkJUeXhaUVVGWk8wRkJRVUU3UVVGQlFTeFBRVVY0UWp0QlFVTklMRmRCUVU4N1FVRkJRVHRCUVVWWUxHTkJRVmNzVlVGQlZTeFJRVUZSTEZOQlFWVXNaMEpCUVdkQ0xHMUNRVUZ0UWp0QlFVTjBSU3hqUVVGVkxFdEJRVXNzVFVGQlRTeFRRVUZWTEZGQlFWRXNVMEZCVXl4VFFVRlRPMEZCUTNKRUxGVkJRVWtzWlVGQlpTeFBRVUZQTEZGQlFWRTdRVUZET1VJc1owSkJRVkU3UVVGRFVpeGxRVUZQTzBGQlFVRXNZVUZGVGp0QlFVTkVMR1ZCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMllzVjBGQlR6dEJRVUZCTzBGQlJWZ3NZMEZCVnl4VlFVRlZMRkZCUVZFc1UwRkJWU3hKUVVGSk8wRkJRM1pETEZkQlFVOHNTMEZCU3l4TlFVRk5MRWRCUVVjc1VVRkJVU3hUUVVGVkxFZEJRVWM3UVVGQlJTeGhRVUZQTEVWQlFVVTdRVUZCUVN4UFFVRlBMRXRCUVVzN1FVRkJRVHRCUVVWeVJTeGpRVUZYTEZWQlFWVXNUMEZCVHl4VFFVRlZMRWxCUVVrN1FVRkRkRU1zVjBGQlR5eExRVUZMTEZWQlFWVXNUVUZCVFR0QlFVRkJPMEZCUldoRExHTkJRVmNzVlVGQlZTeFRRVUZUTEZOQlFWVXNaMEpCUVdkQ08wRkJRM0JFTEdOQlFWVXNTMEZCU3l4TlFVRk5MRk5CUVZVc1VVRkJVVHRCUVVOdVF5eGhRVUZQTEdWQlFXVXNUMEZCVHp0QlFVRkJPMEZCUldwRExHMUNRVUZsTEV0QlFVc3NUVUZCVFR0QlFVTXhRaXhYUVVGUE8wRkJRVUU3UVVGRldDeGpRVUZYTEZWQlFWVXNUVUZCVFN4VFFVRlZMRkZCUVZFN1FVRkRla01zVjBGQlR5eExRVUZMTEU5QlFVODdRVUZCUVR0QlFVVjJRaXhqUVVGWExGVkJRVlVzUzBGQlN5eFRRVUZWTEZkQlFWYzdRVUZETTBNc1YwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFpRVUZaTEV0QlFVc3NTMEZCU3l4UFFVRlBMRmRCUVZjN1FVRkJRVHRCUVVVdlJDeGpRVUZYTEZWQlFWVXNWVUZCVlN4WFFVRlpPMEZCUTNaRExGTkJRVXNzUzBGQlN5eE5RVUZQTEV0QlFVc3NTMEZCU3l4UlFVRlJMRk5CUVZNc1UwRkJVenRCUVVOeVJDeFJRVUZKTEV0QlFVczdRVUZEVEN4WFFVRkxMRzFDUVVGdFFpeExRVUZMTEV0QlFVczdRVUZEZEVNc1YwRkJUenRCUVVGQk8wRkJSVmdzWTBGQlZ5eFZRVUZWTEU5QlFVOHNWMEZCV1R0QlFVTndReXhYUVVGUExFdEJRVXM3UVVGQlFUdEJRVVZvUWl4alFVRlhMRlZCUVZVc1ZVRkJWU3hUUVVGVkxFbEJRVWs3UVVGRGVrTXNVVUZCU1N4TlFVRk5MRXRCUVVzN1FVRkRaaXhSUVVGSkxGZEJRVmNzUTBGQlF5eEpRVUZKTzBGQlEzQkNMRmRCUVU4c1MwRkJTeXhMUVVGTExGTkJRVlVzUzBGQlN5eFJRVUZSTzBGQlFVVXNVMEZCUnl4UFFVRlBMRXRCUVVzN1FVRkJRVHRCUVVGQk8wRkJSVGRFTEdOQlFWY3NWVUZCVlN4blFrRkJaMElzVTBGQlZTeEpRVUZKTzBGQlF5OURMRk5CUVVzc1MwRkJTeXhUUVVGVE8wRkJRMjVDTEZkQlFVOHNTMEZCU3l4UlFVRlJPMEZCUVVFN1FVRkZlRUlzWTBGQlZ5eFZRVUZWTEdsQ1FVRnBRaXhUUVVGVkxFbEJRVWs3UVVGRGFFUXNVVUZCU1N4TlFVRk5MRXRCUVVzN1FVRkRaaXhSUVVGSkxGZEJRVmNzUTBGQlF5eEpRVUZKTzBGQlEzQkNMRmRCUVU4c1MwRkJTeXhMUVVGTExGTkJRVlVzUzBGQlN5eFJRVUZSTzBGQlFVVXNVMEZCUnl4UFFVRlBMRmxCUVZrN1FVRkJRVHRCUVVGQk8wRkJSWEJGTEdOQlFWY3NWVUZCVlN4UFFVRlBMRk5CUVZVc1NVRkJTVHRCUVVOMFF5eFJRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm1MRkZCUVVrc1YwRkJWeXhEUVVGRExFbEJRVWs3UVVGRGNFSXNVVUZCU1N4SlFVRkpPMEZCUTFJc1YwRkJUeXhMUVVGTExFdEJRVXNzVTBGQlZTeE5RVUZOTEZGQlFWRTdRVUZEY2tNc1VVRkJSU3hMUVVGTExFOUJRVTg3UVVGQlFTeFBRVU5tTEV0QlFVc3NWMEZCV1R0QlFVTm9RaXhoUVVGUE8wRkJRVUVzVDBGRFVpeExRVUZMTzBGQlFVRTdRVUZGV2l4alFVRlhMRlZCUVZVc1kwRkJZeXhUUVVGVkxFbEJRVWs3UVVGRE4wTXNVVUZCU1N4TlFVRk5MRXRCUVVzN1FVRkRaaXhSUVVGSkxFbEJRVWtzVVVGQlVTeFZRVUZWTEdkQ1FVRm5RaXhMUVVGTExGTkJRVk1zU1VGQlNTeFJRVUZSTEVkQlFVYzdRVUZEYmtVc1lVRkJUeXhMUVVGTExFMUJRVTBzVTBGQlZTeFBRVUZQTzBGQlF5OUNMRmxCUVVrc1VVRkJVU3huUWtGQlowSXNTMEZCU3l4SlFVRkpMRTFCUVUwc1MwRkJTenRCUVVOb1JDeGxRVUZQTEVsQlFVa3NUVUZCVFN4TFFVRkxMRTFCUVUwN1FVRkJRU3hWUVVONFFqdEJRVUZCTEZWQlEwRXNVVUZCVVR0QlFVRkJMRlZCUTFJc1QwRkJUeXhKUVVGSk8wRkJRVUVzVlVGRFdDeFBRVUZQTzBGQlFVRXNXVUZEU0R0QlFVRkJMRmxCUTBFc1QwRkJUeXhKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVUZCTEZOQlIzQkNMRXRCUVVzc1UwRkJWU3hMUVVGSk8wRkJRMnhDTEZsQlFVa3NVMEZCVXl4SlFVRkhPMEZCUTJoQ0xHVkJRVTg3UVVGQlFTeFRRVU5TTEV0QlFVczdRVUZCUVR0QlFVVmFMRkZCUVVrc1YwRkJWeXhEUVVGRExFbEJRVWs3UVVGRGNFSXNVVUZCU1N4SlFVRkpPMEZCUTFJc1YwRkJUeXhMUVVGTExFdEJRVXNzVTBGQlZTeE5RVUZOTEZGQlFWRTdRVUZEY2tNc1VVRkJSU3hMUVVGTExFOUJRVTg3UVVGQlFTeFBRVU5tTEV0QlFVc3NWMEZCV1R0QlFVTm9RaXhoUVVGUE8wRkJRVUVzVDBGRFVpeExRVUZMTzBGQlFVRTdRVUZGV2l4alFVRlhMRlZCUVZVc1lVRkJZU3hUUVVGVkxFbEJRVWs3UVVGRE5VTXNVMEZCU3l4TFFVRkxMRk5CUVZNN1FVRkRia0lzVjBGQlR5eExRVUZMTEV0QlFVczdRVUZCUVR0QlFVVnlRaXhqUVVGWExGVkJRVlVzVjBGQlZ5eFRRVUZWTEVsQlFVazdRVUZETVVNc1YwRkJUeXhMUVVGTExFMUJRVTBzUjBGQlJ5eExRVUZMTEZOQlFWVXNSMEZCUnp0QlFVRkZMR0ZCUVU4c1JVRkJSVHRCUVVGQkxFOUJRVThzUzBGQlN6dEJRVUZCTzBGQlJXeEZMR05CUVZjc1ZVRkJWU3hWUVVGVkxGTkJRVlVzU1VGQlNUdEJRVU42UXl4WFFVRlBMRXRCUVVzc1ZVRkJWU3hUUVVGVE8wRkJRVUU3UVVGRmJrTXNZMEZCVnl4VlFVRlZMRmRCUVZjc1YwRkJXVHRCUVVONFF5eFJRVUZKTEUxQlFVMHNTMEZCU3l4TlFVRk5MRTFCUVUwc1NVRkJTU3hUUVVGVExFbEJRVWtzVFVGQlRTeFBRVUZQTEZWQlFWVXNTVUZCU1R0QlFVTjJSU3hSUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVazdRVUZEWWl4aFFVRlBPMEZCUTFnc1VVRkJTU3hOUVVGTk8wRkJRMVlzWTBGQlZTeExRVUZMTEUxQlFVMHNVMEZCVlN4UlFVRlJPMEZCUTI1RExGVkJRVWtzVTBGQlV5eFBRVUZQTEZkQlFWYzdRVUZETDBJc1ZVRkJTU3hSUVVGUkxFOUJRVThzUzBGQlN6dEJRVU40UWl4VlFVRkpMRlZCUVZVN1FVRkRaQ3hoUVVGUExFTkJRVU03UVVGQlFUdEJRVVZhTEZkQlFVODdRVUZCUVR0QlFVVllMR05CUVZjc1ZVRkJWU3hUUVVGVExGTkJRVlVzVTBGQlV6dEJRVU0zUXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhSUVVGSkxFMUJRVTBzUzBGQlN6dEJRVU5tTEZkQlFVOHNTMEZCU3l4UFFVRlBMRk5CUVZVc1QwRkJUenRCUVVOb1F5eFZRVUZKTzBGQlEwb3NWVUZCU1N4UFFVRlBMRmxCUVZrc1dVRkJXVHRCUVVNdlFpeHRRa0ZCVnp0QlFVRkJMR0ZCUlZZN1FVRkRSQ3haUVVGSkxGZEJRVmNzUzBGQlN6dEJRVU53UWl4WlFVRkpMRlZCUVZVc1UwRkJVenRCUVVOMlFpeHRRa0ZCVnl4VFFVRlZMRTFCUVUwN1FVRkRka0lzWTBGQlNTeHRRa0ZCYlVJN1FVRkRka0lzYlVKQlFWTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1UwRkJVeXhGUVVGRkxFZEJRVWM3UVVGRE9VSXNaMEpCUVVrc1ZVRkJWU3hUUVVGVExFbEJRVWtzVFVGQlRTeFJRVUZSTzBGQlEzcERMR2RDUVVGSkxHRkJRV0VzVFVGQlRTeGhRVUZoTEV0QlFVczdRVUZEY2tNc01rSkJRV0VzVFVGQlRTeFRRVUZUTzBGQlF6VkNMR2xEUVVGdFFqdEJRVUZCTzBGQlFVRTdRVUZITTBJc2FVSkJRVTg3UVVGQlFUdEJRVUZCTzBGQlIyWXNWVUZCU1N4WlFVRlpMRWxCUVVrc1RVRkJUVHRCUVVNeFFpeFZRVUZKTEUxQlFVc3NWVUZCVlN4UFFVRlBMRmxCUVZrc1YwRkJWeXhKUVVGSExGVkJRVlVzWVVGQllTeEpRVUZITzBGQlF6bEZMRlZCUVVrc1VVRkJVU3hOUVVGTkxFZEJRVWNzVTBGQlV5eHRRa0ZCYlVJN1FVRkRha1FzVlVGQlNTeFBRVUZOTEUxQlFVMHNSMEZCUnl4TFFVRkxPMEZCUTNoQ0xGVkJRVWtzWjBKQlFXZENPMEZCUTNCQ0xGVkJRVWtzWlVGQlpUdEJRVU51UWl4VlFVRkpMR0ZCUVdFN1FVRkRha0lzVlVGQlNTeHZRa0ZCYjBJc1UwRkJWU3hsUVVGbExFdEJRVXM3UVVGRGJFUXNXVUZCU1N4WFFVRlhMRWxCUVVrc1ZVRkJWU3hqUVVGakxFbEJRVWs3UVVGREwwTXNkMEpCUVdkQ0xHZENRVUZuUWp0QlFVTm9ReXhwUWtGQlV5eExRVUZMTEVkQlFVY3NUVUZCU3l4TFFVRkxMRmRCUVZjc1MwRkJTeXhKUVVGSExGRkJRVkVzVFVGQlRUdEJRVU40UkN4alFVRkpMRTFCUVUwc1NVRkJSenRCUVVOaUxIZENRVUZqTEV0QlFVc3NVMEZCVXp0QlFVRkJPMEZCUVVFN1FVRkhjRU1zWVVGQlR5eE5RVUZOTEZGQlFWRXNZMEZCWXl4TFFVRkxMRk5CUVZVc1QwRkJUVHRCUVVOd1JDeFpRVUZKTEZsQlFWa3NVMEZCVlN4UlFVRlJPMEZCUXpsQ0xHTkJRVWtzVVVGQlVTeExRVUZMTEVsQlFVa3NUMEZCVHl4TlFVRkxMRk5CUVZNN1FVRkRNVU1zYVVKQlFVOHNWVUZCVlN4UlFVRlJPMEZCUVVFc1dVRkRja0k3UVVGQlFTeFpRVU5CTEUxQlFVMHNUVUZCU3l4TlFVRk5MRkZCUVZFc1UwRkJVenRCUVVGQkxGbEJRMnhETEU5QlFVODdRVUZCUVN4aFFVTlNMRXRCUVVzc1UwRkJWU3hSUVVGUk8wRkJRM1JDTEdkQ1FVRkpMRmxCUVZrN1FVRkRhRUlzWjBKQlFVa3NXVUZCV1R0QlFVTm9RaXhuUWtGQlNTeFZRVUZWTEZkQlFWY3NTMEZCU3p0QlFVTTVRaXhuUWtGQlNTeGhRVUZoTzBGQlEycENMSEZDUVVGVExFbEJRVWtzUjBGQlJ5eEpRVUZKTEU5QlFVOHNSVUZCUlN4SFFVRkhPMEZCUXpWQ0xHdENRVUZKTEZsQlFWa3NUMEZCVHp0QlFVTjJRaXhyUWtGQlNTeFJRVUZSTzBGQlFVRXNaMEpCUTFJc1QwRkJUeXhWUVVGVk8wRkJRVUVzWjBKQlEycENMRk5CUVZNc1RVRkJTeXhUUVVGVE8wRkJRVUU3UVVGRk0wSXNhMEpCUVVrc1UwRkJVeXhMUVVGTExFOUJRVThzVFVGQlRTeFBRVUZQTEZkQlFWY3NUMEZCVHp0QlFVTndSQ3h2UWtGQlNTeE5RVUZOTEZOQlFWTXNUVUZCVFR0QlFVTnlRaXcyUWtGQlZ5eExRVUZMTEUxQlFVc3NVMEZCVXp0QlFVRkJMREpDUVVWNlFpeERRVUZETEZsQlFWa3NTMEZCU1N4WFFVRlhMRmxCUVZrc1YwRkJWeXhOUVVGTkxGbEJRVmtzUjBGQlJ6dEJRVU0zUlN3MlFrRkJWeXhMUVVGTExFMUJRVXNzVTBGQlV6dEJRVU01UWl3MFFrRkJWU3hMUVVGTExFMUJRVTA3UVVGQlFTeDFRa0ZGY0VJN1FVRkRSQ3cwUWtGQlZTeExRVUZMTEUxQlFVMDdRVUZEY2tJc2MwSkJRVWs3UVVGRFFTdzBRa0ZCVVN4TFFVRkxMRTFCUVVzc1UwRkJVenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWt6UXl4dFFrRkJUeXhSUVVGUkxGRkJRVkVzVlVGQlZTeFRRVUZUTEV0QlEzUkRMRlZCUVZVc1QwRkJUeXhEUVVGRkxFOUJRV01zVFVGQlRTeFBRVUZQTEZGQlFWRXNXVUZEYWtRc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGRGNrSXNkVUpCUVZNc1QwRkJUeXhKUVVGSkxGVkJRVlU3UVVGRE1VSXNNa0pCUVZjc1QwRkJUeXhUUVVGVExFMUJRVTA3UVVGQlFUdEJRVVZ5UXl4blEwRkJhMElzVlVGQlZTeFJRVUZSTzBGQlFVRXNaMEpCUTNCRExFdEJRVXNzVjBGQldUdEJRVUZGTEhGQ1FVRlBMRlZCUVZVc1UwRkJVeXhMUVVOcVJDeFZRVUZWTEU5QlFVOHNRMEZCUlN4UFFVRmpMRTFCUVUwc1QwRkJUeXhOUVVGTkxGTkJRVk1zVVVGQlVTeFpRVU5vUlN4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxIVkNRVUZQTEd0Q1FVRnJRaXhWUVVGVkxGRkJRVkU3UVVGQlFUdEJRVUZCTEdWQlFXRXNTMEZCU3l4WFFVRlpPMEZCUVVVc2NVSkJRVThzVjBGQlZ5eFRRVUZUTEV0QlEycEpMRlZCUVZVc1QwRkJUeXhEUVVGRkxFOUJRV01zVFVGQlRTeFZRVUZWTEUxQlFVMHNZVUZEYkVRc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGQlJTeDFRa0ZCVHl4clFrRkJhMElzVjBGQlZ5eFJRVUZSTzBGQlFVRTdRVUZCUVN4bFFVRmhMRXRCUVVzc1YwRkJXVHRCUVVOeVJ5eHhRa0ZCVHl4TlFVRkxMRk5CUVZNc1UwRkJVeXhUUVVGVExGVkJRVlVzVTBGQlV6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVbDBSU3hsUVVGUExGVkJRVlVzUjBGQlJ5eExRVUZMTEZkQlFWazdRVUZEYWtNc1kwRkJTU3hqUVVGakxGTkJRVk03UVVGRGRrSXNhMEpCUVUwc1NVRkJTU3haUVVGWkxIVkRRVUYxUXl4bFFVRmxMR05CUVdNN1FVRkRPVVlzYVVKQlFVOHNUVUZCU3p0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTelZDTEdOQlFWY3NWVUZCVlN4VFFVRlRMRmRCUVZrN1FVRkRkRU1zVVVGQlNTeE5RVUZOTEV0QlFVc3NUVUZCVFN4UlFVRlJMRWxCUVVrN1FVRkRha01zVVVGQlNTeG5Ra0ZCWjBJc1VVRkRaQ3hMUVVGSkxHRkJRV0VzUTBGQlF5dzRRa0ZCSzBJc1RVRkJUU3hUUVVGVExFbEJRM0pGTzBGQlEwY3NZVUZCVHl4TFFVRkxMRTlCUVU4c1UwRkJWU3hQUVVGUE8wRkJRMmhETEZsQlFVa3NZVUZCWVN4SlFVRkpMRTFCUVUwc1MwRkJTeXhQUVVGUE8wRkJRM1pETEZsQlFVa3NXVUZCV1R0QlFVTm9RaXhsUVVGUExFbEJRVWtzVFVGQlRTeExRVUZMTEUxQlFVMHNRMEZCUlN4UFFVRmpMRTlCUVU4c1EwRkJSU3hQUVVGUExGbEJRVmtzVDBGQlR5eGhRVUZsTEV0QlFVc3NVMEZCVlN4UFFVRlBPMEZCUTJoSUxHbENRVUZQTEVsQlFVa3NUVUZCVFN4TFFVRkxMRTlCUVU4c1EwRkJSU3hQUVVGakxFMUJRVTBzWlVGQlpTeFBRVUZQTEZsQlEzQkZMRXRCUVVzc1UwRkJWU3hMUVVGSk8wRkJRM0JDTEdkQ1FVRkpMRmRCUVZjc1NVRkJSenRCUVVGVkxHZENRVUZITzBGQlFWa3NaMEpCUVVjN1FVRkJVeXhuUWtGQlNTeGpRVUZqTEVsQlFVYzdRVUZETlVVc1owSkJRVWs3UVVGRFFTeHZRa0ZCVFN4SlFVRkpMRmxCUVZrc1owTkJRV2RETEU5QlFVOHNTMEZCU3l4VlFVRlZMRWxCUVVrc1UwRkJWU3hMUVVGTE8wRkJRVVVzZFVKQlFVOHNVMEZCVXp0QlFVRkJMR3RDUVVGVkxGRkJRVkU3UVVGRGRra3NiVUpCUVU4c1VVRkJVVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlN5OUNMRmRCUVU4c1MwRkJTeXhQUVVGUExGTkJRVlVzVDBGQlR5eE5RVUZMTzBGQlFVVXNZVUZCVHl4TFFVRkpMRkZCUVZFN1FVRkJRVHRCUVVGQk8wRkJSV3hGTEZOQlFVODdRVUZCUVR0QlFVZFlMSEZEUVVGeFF5eEpRVUZKTzBGQlEzSkRMRk5CUVU4c2NVSkJRWEZDTEZkQlFWY3NWMEZCVnl4eFFrRkJiMElzWVVGQllTeHRRa0ZCYlVJN1FVRkRiRWNzVTBGQlN5eExRVUZMTzBGQlExWXNVVUZCU1N4WFFVRlhMRlZCUVZVc1VVRkJVVHRCUVVOcVF5eFJRVUZKTzBGQlEwRXNWVUZCU1R0QlFVTkJMRzFDUVVGWE8wRkJRVUVzWlVGRlVpeEpRVUZRTzBGQlEwa3NaMEpCUVZFN1FVRkJRVHRCUVVWb1FpeFJRVUZKTEZkQlFWY3NXVUZCV1R0QlFVTXpRaXhSUVVGSkxGRkJRVkVzVTBGQlV6dEJRVU55UWl4UlFVRkpMR05CUVdNc1RVRkJUU3hMUVVGTExGRkJRVkU3UVVGRGNrTXNVMEZCU3l4UFFVRlBPMEZCUVVFc1RVRkRVanRCUVVGQkxFMUJRMEVzVDBGQlR5eFRRVUZUTzBGQlFVRXNUVUZEYUVJc1YwRkJXU3hEUVVGRExGTkJRVk1zVTBGQlZTeE5RVUZOTEU5QlFVOHNVVUZCVVN4WFFVRlhMRk5CUVZNc1ZVRkJWU3hOUVVGTkxFOUJRVThzVVVGQlVUdEJRVUZCTEUxQlEzaEhMRTlCUVU4N1FVRkJRU3hOUVVOUUxGVkJRVlU3UVVGQlFTeE5RVU5XTEV0QlFVczdRVUZCUVN4TlFVTk1MRkZCUVZFN1FVRkJRU3hOUVVOU0xGZEJRVmM3UVVGQlFTeE5RVU5ZTEZGQlFWRTdRVUZCUVN4TlFVTlNMR05CUVdNN1FVRkJRU3hOUVVOa0xGZEJRVmM3UVVGQlFTeE5RVU5ZTEZOQlFWTTdRVUZCUVN4TlFVTlVMRkZCUVZFN1FVRkJRU3hOUVVOU0xFOUJRVTg3UVVGQlFTeE5RVU5RTzBGQlFVRXNUVUZEUVN4SlFVRkpMRk5CUVZNN1FVRkJRU3hOUVVOaUxHRkJRV0VzWjBKQlFXZENMRk5CUVZNc1kwRkJZenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXRvUlN4MVFrRkJkVUlzUjBGQlJ5eEhRVUZITzBGQlEzcENMRk5CUVU4c1NVRkJTU3hKUVVGSkxFdEJRVXNzVFVGQlRTeEpRVUZKTEVsQlFVazdRVUZCUVR0QlFVVjBReXc0UWtGQk9FSXNSMEZCUnl4SFFVRkhPMEZCUTJoRExGTkJRVThzU1VGQlNTeEpRVUZKTEV0QlFVc3NUVUZCVFN4SlFVRkpMRWxCUVVrN1FVRkJRVHRCUVVkMFF5eGpRVUZqTEhsQ1FVRjVRaXhMUVVGTExFZEJRVWM3UVVGRE0wTXNUVUZCU1N4aFFVRmhMRzFEUVVGdFF5eGpRVU5vUkN4SlFVRkpMSGRDUVVGM1FpeFhRVUZYTERKQ1FVTjJRenRCUVVOS0xHRkJRVmNzUzBGQlN5eFJRVUZSTEVsQlFVa3NTVUZCU1N4RlFVRkZMRTlCUVU4c1NVRkJTU3hWUVVGVk8wRkJRM1pFTEZOQlFVODdRVUZCUVR0QlFVVllMSGxDUVVGNVFpeGhRVUZoTzBGQlEyeERMRk5CUVU4c1NVRkJTU3haUVVGWkxGZEJRVmNzWVVGQllTeFhRVUZaTzBGQlFVVXNWMEZCVHl4WFFVRlhPMEZCUVVFc1MwRkJVU3hOUVVGTk8wRkJRVUU3UVVGRmFrY3NjMEpCUVhOQ0xFdEJRVXM3UVVGRGRrSXNVMEZCVHl4UlFVRlJMRk5CUTFnc1UwRkJWU3hIUVVGSE8wRkJRVVVzVjBGQlR5eEZRVUZGTzBGQlFVRXNUVUZEZUVJc1UwRkJWU3hIUVVGSE8wRkJRVVVzVjBGQlR5eEZRVUZGTzBGQlFVRTdRVUZCUVR0QlFVVm9ReXh6UWtGQmMwSXNTMEZCU3p0QlFVTjJRaXhUUVVGUExGRkJRVkVzVTBGRFdDeFRRVUZWTEVkQlFVYzdRVUZCUlN4WFFVRlBMRVZCUVVVN1FVRkJRU3hOUVVONFFpeFRRVUZWTEVkQlFVYzdRVUZCUlN4WFFVRlBMRVZCUVVVN1FVRkJRVHRCUVVGQk8wRkJSV2hETEc5Q1FVRnZRaXhMUVVGTExGVkJRVlVzWVVGQllTeGhRVUZoTEUxQlFVc3NTMEZCU3p0QlFVTnVSU3hOUVVGSkxGTkJRVk1zUzBGQlN5eEpRVUZKTEVsQlFVa3NVVUZCVVN4WlFVRlpPMEZCUXpsRExFMUJRVWtzVFVGQlRUdEJRVU5XTEZkQlFWTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1VVRkJVU3hGUVVGRkxFZEJRVWM3UVVGRE4wSXNVVUZCU1N4aFFVRmhMRk5CUVZNN1FVRkRNVUlzVVVGQlNTeGxRVUZsTEZsQlFWa3NTVUZCU1R0QlFVTXZRaXhWUVVGSkxFdEJRVWtzU1VGQlNTeEpRVUZKTEZsQlFWa3NUVUZCVFR0QlFVTTVRaXhsUVVGUExFbEJRVWtzVDBGQlR5eEhRVUZITEV0QlFVc3NXVUZCV1N4TFFVRkxMRmxCUVZrc1QwRkJUeXhKUVVGSk8wRkJRM1JGTEZWQlFVa3NTMEZCU1N4SlFVRkpMRWxCUVVrc1dVRkJXU3hOUVVGTk8wRkJRemxDTEdWQlFVOHNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhaUVVGWkxFdEJRVXNzV1VGQldTeFBRVUZQTEVsQlFVazdRVUZEZEVVc1ZVRkJTU3hQUVVGUE8wRkJRMUFzWlVGQlR5eEpRVUZKTEU5QlFVOHNSMEZCUnl4UFFVRlBMRk5CUVZNc1QwRkJUeXhaUVVGWkxFOUJRVThzVFVGQlRUdEJRVU42UlN4aFFVRlBPMEZCUVVFN1FVRkZXQ3hSUVVGSkxFdEJRVWtzU1VGQlNTeEpRVUZKTEdOQlFXTTdRVUZETVVJc1dVRkJUVHRCUVVGQk8wRkJSV1FzVFVGQlNTeFRRVUZUTEZsQlFWa3NWVUZCVlN4UlFVRlJPMEZCUTNaRExGZEJRVThzVFVGQlRTeFpRVUZaTEU5QlFVOHNTVUZCU1R0QlFVTjRReXhOUVVGSkxGTkJRVk1zU1VGQlNTeFZRVUZWTEZGQlFWRTdRVUZETDBJc1YwRkJUeXhKUVVGSkxFOUJRVThzUjBGQlJ5eFpRVUZaTzBGQlEzSkRMRk5CUVZFc1RVRkJUU3hKUVVGSkxFOUJRVThzU1VGQlNTeFBRVUZQTEVkQlFVY3NUMEZCVHl4WlFVRlpMRTlCUVU4c1dVRkJXU3hQUVVGUExFMUJRVTA3UVVGQlFUdEJRVVU1Uml4blEwRkJaME1zWVVGQllTeFBRVUZQTEZOQlFWTXNVVUZCVVR0QlFVTnFSU3hOUVVGSkxFOUJRVThzVDBGQlR5eFRRVUZUTEdOQlFXTXNZMEZCWXl4WFFVRlhMR1ZCUVdVc1lVRkJZU3hSUVVGUk8wRkJRM1JITEUxQlFVa3NRMEZCUXl4UlFVRlJMRTFCUVUwc1UwRkJWU3hIUVVGSE8wRkJRVVVzVjBGQlR5eFBRVUZQTEUxQlFVMDdRVUZCUVN4TlFVRmpPMEZCUTJoRkxGZEJRVThzUzBGQlN5eGhRVUZoTzBGQlFVRTdRVUZGTjBJc2VVSkJRWFZDTEV0QlFVczdRVUZEZUVJc1dVRkJVU3hoUVVGaE8wRkJRM0pDTEZsQlFWRXNZVUZCWVR0QlFVTnlRaXhqUVVGWExGRkJRVkVzVTBGQlV5eG5Ra0ZCWjBJN1FVRkROVU1zVVVGQlNTeGxRVUZsTEZGQlFWRXNTVUZCU1N4VFFVRlZMRkZCUVZFN1FVRkROME1zWVVGQlR5eERRVUZGTEU5QlFVOHNUVUZCVFN4VFFVRlRMRTlCUVU4c1RVRkJUVHRCUVVGQkxFOUJRemRETEV0QlFVc3NVMEZCVlN4SFFVRkhMRWRCUVVjN1FVRkRjRUlzWVVGQlR5eFJRVUZSTEVWQlFVVXNUMEZCVHl4RlFVRkZPMEZCUVVFN1FVRkZPVUlzYlVKQlFXVXNZVUZCWVN4SlFVRkpMRk5CUVZVc1NVRkJTVHRCUVVGRkxHRkJRVThzUjBGQlJ6dEJRVUZCTzBGQlF6RkVMRzFDUVVGbExHRkJRV0VzU1VGQlNTeFRRVUZWTEVsQlFVazdRVUZCUlN4aFFVRlBMRWRCUVVjN1FVRkJRVHRCUVVNeFJDeG5Ra0ZCV1R0QlFVTmFMRzlDUVVGcFFpeFJRVUZSTEZOQlFWTXNTMEZCU3p0QlFVRkJPMEZCUlRORExHZENRVUZqTzBGQlEyUXNUVUZCU1N4SlFVRkpMRWxCUVVrc1dVRkJXU3hYUVVGWExHRkJRV0VzVjBGQldUdEJRVUZGTEZkQlFVOHNXVUZCV1N4aFFVRmhMRWxCUVVrc1lVRkJZU3hoUVVGaExFdEJRVXM3UVVGQlFUdEJRVU5xU1N4SlFVRkZMSEZDUVVGeFFpeFRRVUZWTEZsQlFWYzdRVUZEZUVNc2EwSkJRV003UVVGQlFUdEJRVVZzUWl4TlFVRkpMSE5DUVVGelFqdEJRVU14UWl4SlFVRkZMR05CUVdNc1UwRkJWU3hSUVVGUkxGTkJRVk1zVTBGQlV6dEJRVU5vUkN4UlFVRkpMRTFCUVUwc1QwRkJUenRCUVVOcVFpeFJRVUZKTEU5QlFVOHNVVUZCVVR0QlFVTm1MR0ZCUVU4N1FVRkRXQ3hSUVVGSkxGZEJRVmNzVFVGQlRUdEJRVU55UWl4UlFVRkpMRTFCUVUwc1ZVRkJWU3hqUVVGakxITkNRVUZ6UWp0QlFVTndSQ3hoUVVGUE8wRkJRVUVzVjBGRlRqdEJRVU5FTEZWQlFVa3NkVUpCUVhWQ08wRkJRek5DTEdWQlFWTXNTVUZCU1N4eFFrRkJjVUlzU1VGQlNTeFpRVUZaTEVWQlFVVXNSMEZCUnp0QlFVTnVSQ3haUVVGSkxGTkJRVk1zVjBGQlZ5eExRVUZMTEZWQlFWVXNZVUZCWVN4SlFVRkpMR0ZCUVdFc1NVRkJTU3hUUVVGVE8wRkJRMnhHTEZsQlFVa3NWMEZCVnl4UlFVRlJMSGxDUVVGNVFqdEJRVU0xUXl4blEwRkJjMElzU1VGQlNUdEJRVUZCTEdsQ1FVTnlRaXg1UWtGQmVVSXNVVUZCVVN4UlFVRlJMSE5DUVVGelFpeFZRVUZWTEVkQlFVYzdRVUZEYWtZc2FVTkJRWFZDTzBGQlFVRTdRVUZCUVR0QlFVY3ZRaXhWUVVGSkxIbENRVUY1UWl4TlFVRk5PMEZCUXk5Q0xHZENRVUZSTEZkQlFWazdRVUZCUlN4cFFrRkJUeXhUUVVGVExIVkNRVUYxUWp0QlFVRkJPMEZCUVVFc1lVRkZOVVE3UVVGRFJDeG5Ra0ZCVVR0QlFVRkJPMEZCUlZvc1lVRkJUenRCUVVGQk8wRkJRVUU3UVVGSFppeFRRVUZQTzBGQlFVRTdRVUZGV0N4eFFrRkJjVUlzVDBGQlR5eFBRVUZQTEZkQlFWY3NWMEZCVnp0QlFVTnlSQ3hUUVVGUE8wRkJRVUVzU1VGRFNDeE5RVUZOTzBGQlFVRXNTVUZEVGp0QlFVRkJMRWxCUTBFN1FVRkJRU3hKUVVOQk8wRkJRVUVzU1VGRFFUdEJRVUZCTzBGQlFVRTdRVUZIVWl4dlFrRkJiMElzVDBGQlR6dEJRVU4yUWl4VFFVRlBPMEZCUVVFc1NVRkRTQ3hOUVVGTk8wRkJRVUVzU1VGRFRpeFBRVUZQTzBGQlFVRXNTVUZEVUN4UFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVsbUxFbEJRVWtzWTBGQlowSXNWMEZCV1R0QlFVTTFRaXd3UWtGQmRVSTdRVUZCUVR0QlFVVjJRaXhUUVVGUExHVkJRV1VzWVVGQldTeFhRVUZYTEdOQlFXTTdRVUZCUVN4SlFVTjJSQ3hMUVVGTExGZEJRVms3UVVGRFlpeGhRVUZQTEV0QlFVc3NTMEZCU3l4TlFVRk5MRWRCUVVjN1FVRkJRVHRCUVVGQkxFbEJSVGxDTEZsQlFWazdRVUZCUVN4SlFVTmFMR05CUVdNN1FVRkJRVHRCUVVWc1FpeGxRVUZaTEZWQlFWVXNWVUZCVlN4VFFVRlZMRTlCUVU4c1QwRkJUeXhqUVVGakxHTkJRV003UVVGRGFFWXNiVUpCUVdVc2FVSkJRV2xDTzBGQlEyaERMRzFDUVVGbExHbENRVUZwUWp0QlFVTm9ReXhSUVVGSk8wRkJRMEVzVlVGQlN5eExRVUZMTEV0QlFVc3NUMEZCVHl4VFFVRlRMRXRCUXpGQ0xFdEJRVXNzUzBGQlN5eFBRVUZQTEZkQlFWY3NTMEZCVFN4cFFrRkJaMElzYVVKQlFXbENMRU5CUVVVc2FVSkJRV2RDTzBGQlEzUkdMR1ZCUVU4c1owSkJRV2RDTzBGQlF6TkNMR0ZCUVU4c1NVRkJTU3hMUVVGTExGZEJRVmNzVFVGQlRTeFhRVUZaTzBGQlFVVXNaVUZCVHl4WlFVRlpMRTlCUVU4c1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF6dEJRVUZCTzBGQlFVRXNZVUZGTjBZc1IwRkJVRHRCUVVOSkxHRkJRVThzUzBGQlN5eE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVY3hRaXhsUVVGWkxGVkJRVlVzVTBGQlV5eFRRVUZWTEU5QlFVODdRVUZETlVNc1VVRkJTU3hUUVVGVE8wRkJRMVFzWVVGQlR5eExRVUZMTEUxQlFVMDdRVUZEZEVJc1YwRkJUeXhKUVVGSkxFdEJRVXNzVjBGQlZ5eE5RVUZOTEZkQlFWazdRVUZCUlN4aFFVRlBMRmRCUVZjN1FVRkJRVHRCUVVGQk8wRkJSWEpGTEdWQlFWa3NWVUZCVlN4UlFVRlJMRk5CUVZVc1QwRkJUenRCUVVNelF5eFJRVUZKTEZOQlFWTTdRVUZEVkN4aFFVRlBMRXRCUVVzc1RVRkJUVHRCUVVOMFFpeFhRVUZQTEVsQlFVa3NTMEZCU3l4WFFVRlhMRTFCUVUwc1YwRkJXVHRCUVVGRkxHRkJRVThzV1VGQldTeFBRVUZQTEZGQlFWYzdRVUZCUVR0QlFVRkJPMEZCUlhoR0xHVkJRVmtzVlVGQlZTeGxRVUZsTEZOQlFWVXNUMEZCVHp0QlFVTnNSQ3hSUVVGSkxGTkJRVk03UVVGRFZDeGhRVUZQTEV0QlFVc3NUVUZCVFR0QlFVTjBRaXhYUVVGUExFbEJRVWtzUzBGQlN5eFhRVUZYTEUxQlFVMHNWMEZCV1R0QlFVRkZMR0ZCUVU4c1dVRkJXU3hQUVVGUExGRkJRVmM3UVVGQlFUdEJRVUZCTzBGQlJYaEdMR1ZCUVZrc1ZVRkJWU3hSUVVGUkxGTkJRVlVzVDBGQlR6dEJRVU16UXl4UlFVRkpMRk5CUVZNN1FVRkRWQ3hoUVVGUExFdEJRVXNzVFVGQlRUdEJRVU4wUWl4WFFVRlBMRWxCUVVrc1MwRkJTeXhYUVVGWExFMUJRVTBzVjBGQldUdEJRVUZGTEdGQlFVOHNXVUZCV1N4UlFVRlhMRTlCUVU4c1QwRkJUenRCUVVGQk8wRkJRVUU3UVVGRkwwWXNaVUZCV1N4VlFVRlZMR1ZCUVdVc1UwRkJWU3hQUVVGUE8wRkJRMnhFTEZGQlFVa3NVMEZCVXp0QlFVTlVMR0ZCUVU4c1MwRkJTeXhOUVVGTk8wRkJRM1JDTEZkQlFVOHNTVUZCU1N4TFFVRkxMRmRCUVZjc1RVRkJUU3hYUVVGWk8wRkJRVVVzWVVGQlR5eFpRVUZaTEZGQlFWYzdRVUZCUVR0QlFVRkJPMEZCUldwR0xHVkJRVmtzVlVGQlZTeGhRVUZoTEZOQlFWVXNTMEZCU3p0QlFVTTVReXhSUVVGSkxFOUJRVThzVVVGQlVUdEJRVU5tTEdGQlFVOHNTMEZCU3l4TlFVRk5PMEZCUTNSQ0xGZEJRVThzUzBGQlN5eFJRVUZSTEV0QlFVc3NUVUZCVFN4WFFVRlhMRTFCUVUwN1FVRkJRVHRCUVVWd1JDeGxRVUZaTEZWQlFWVXNkVUpCUVhWQ0xGTkJRVlVzUzBGQlN6dEJRVU40UkN4UlFVRkpMRkZCUVZFN1FVRkRVaXhoUVVGUExFdEJRVXNzVjBGQlZ6dEJRVU16UWl4WFFVRlBMSFZDUVVGMVFpeE5RVUZOTEZOQlFWVXNSMEZCUnl4SFFVRkhPMEZCUVVVc1lVRkJUeXhGUVVGRkxGRkJRVkVzUlVGQlJTeFJRVUZSTzBGQlFVRXNUMEZCVFN4RFFVRkRMRTFCUVUwN1FVRkJRVHRCUVVWc1J5eGxRVUZaTEZWQlFWVXNiVUpCUVcxQ0xGTkJRVlVzUzBGQlN6dEJRVU53UkN4WFFVRlBMSFZDUVVGMVFpeE5RVUZOTEZOQlFWVXNSMEZCUnl4SFFVRkhPMEZCUVVVc1lVRkJUeXhOUVVGTkxFVkJRVVU3UVVGQlFTeFBRVUZQTEVOQlFVTXNUVUZCVFR0QlFVRkJPMEZCUlhaR0xHVkJRVmtzVlVGQlZTeHJRa0ZCYTBJc1YwRkJXVHRCUVVOb1JDeFJRVUZKTEUxQlFVMHNWMEZCVnl4TlFVRk5MR1ZCUVdVN1FVRkRNVU1zVVVGQlNTeEpRVUZKTEZkQlFWYzdRVUZEWml4aFFVRlBMR2RDUVVGblFqdEJRVU16UWl4WFFVRlBMSFZDUVVGMVFpeE5RVUZOTEZOQlFWVXNSMEZCUnl4SFFVRkhPMEZCUVVVc1lVRkJUeXhGUVVGRkxGRkJRVkVzVDBGQlR6dEJRVUZCTEU5QlFVOHNTMEZCU3p0QlFVRkJPMEZCUlRsR0xHVkJRVmtzVlVGQlZTdzBRa0ZCTkVJc1YwRkJXVHRCUVVNeFJDeFJRVUZKTEUxQlFVMHNWMEZCVnl4TlFVRk5MR1ZCUVdVN1FVRkRNVU1zVVVGQlNTeEpRVUZKTEZkQlFWYzdRVUZEWml4aFFVRlBMR2RDUVVGblFqdEJRVU16UWl4WFFVRlBMSFZDUVVGMVFpeE5RVUZOTEZOQlFWVXNSMEZCUnl4SFFVRkhPMEZCUVVVc1lVRkJUeXhGUVVGRkxFdEJRVXNzVTBGQlZTeEhRVUZITzBGQlFVVXNaVUZCVHl4RlFVRkZMRkZCUVZFc1QwRkJUenRCUVVGQk8wRkJRVUVzVDBGQlZTeExRVUZMTzBGQlFVRTdRVUZGT1Vnc1pVRkJXU3hWUVVGVkxGRkJRVkVzVjBGQldUdEJRVU4wUXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhSUVVGSkxFMUJRVTBzVjBGQlZ5eE5RVUZOTEdWQlFXVTdRVUZETVVNc1VVRkJTU3hWUVVGVkxFdEJRVXM3UVVGRGJrSXNVVUZCU1R0QlFVTkJMRlZCUVVrc1MwRkJTenRCUVVGQkxHRkJSVTRzUjBGQlVEdEJRVU5KTEdGQlFVOHNTMEZCU3l4TlFVRk5PMEZCUVVFN1FVRkZkRUlzVVVGQlNTeEpRVUZKTEZkQlFWYzdRVUZEWml4aFFVRlBMR2RDUVVGblFqdEJRVU16UWl4UlFVRkpMRWxCUVVrc1NVRkJTU3hMUVVGTExGZEJRVmNzVFVGQlRTeFhRVUZaTzBGQlFVVXNZVUZCVHl4WlFVRlpMRWxCUVVrc1NVRkJTU3hKUVVGSkxFbEJRVWtzVTBGQlV6dEJRVUZCTzBGQlF6VkdMRTFCUVVVc2NVSkJRWEZDTEZOQlFWVXNWMEZCVnp0QlFVTjRReXhuUWtGQlZ5eGpRVUZqTEZOQlEzSkNMRTFCUVUwc1lVRkRUaXhOUVVGTk8wRkJRMVlzVlVGQlNTeExRVUZMTzBGQlFVRTdRVUZGWWl4UlFVRkpMRWxCUVVrN1FVRkRVaXhOUVVGRkxHTkJRV01zVTBGQlZTeFJRVUZSTEZOQlFWTXNVMEZCVXp0QlFVTm9SQ3hWUVVGSkxFMUJRVTBzVDBGQlR6dEJRVU5xUWl4aFFVRlBMRkZCUVZFc1MwRkJTeXhKUVVGSkxFMUJRVTBzUjBGQlJ6dEJRVU0zUWl4VlFVRkZPMEZCUTBZc1dVRkJTU3hOUVVGTkxFbEJRVWtzVVVGQlVUdEJRVU5zUWl4clFrRkJVVHRCUVVOU0xHbENRVUZQTzBGQlFVRTdRVUZCUVR0QlFVZG1MRlZCUVVrc1VVRkJVU3hMUVVGTExFbEJRVWtzVVVGQlVTeEhRVUZITzBGQlF6VkNMR1ZCUVU4N1FVRkJRU3hoUVVWT08wRkJRMFFzWjBKQlFWRXNWMEZCV1R0QlFVRkZMR2xDUVVGUExGTkJRVk1zU1VGQlNUdEJRVUZCTzBGQlF6RkRMR1ZCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMllzVjBGQlR6dEJRVUZCTzBGQlJWZ3NaVUZCV1N4VlFVRlZMRmRCUVZjc1UwRkJWU3hQUVVGUE8wRkJRemxETEZkQlFVOHNTMEZCU3l4WFFVRlhMRU5CUVVNc1EwRkJReXhSUVVGUkxGRkJRVkVzUTBGQlF5eFBRVUZQTEV0QlFVc3NSMEZCUnl4WFFVRlhMRU5CUVVVc1pVRkJaU3hQUVVGUExHVkJRV1U3UVVGQlFUdEJRVVV2Unl4bFFVRlpMRlZCUVZVc1UwRkJVeXhYUVVGWk8wRkJRM1pETEZGQlFVa3NUVUZCVFN4WFFVRlhMRTFCUVUwc1pVRkJaVHRCUVVNeFF5eFJRVUZKTEVsQlFVa3NWMEZCVnp0QlFVTm1MR0ZCUVU4c1NVRkJTU3hMUVVGTExGZEJRVmM3UVVGREwwSXNVVUZCU1R0QlFVTkJMRlZCUVVrc1MwRkJTeXhMUVVGTE8wRkJRVUVzWVVGRldDeEhRVUZRTzBGQlEwa3NZVUZCVHl4TFFVRkxMRTFCUVUwN1FVRkJRVHRCUVVWMFFpeFJRVUZKTEZOQlFWTXNTVUZCU1N4UFFVRlBMRk5CUVZVc1MwRkJTeXhMUVVGTE8wRkJRVVVzWVVGQlR5eE5RVU5xUkN4SlFVRkpMRTlCUVU4c1EwRkJReXhEUVVGRExFbEJRVWtzU1VGQlNTeFRRVUZUTEVkQlFVY3NTVUZCU1N4VFFVTnlReXhEUVVGRExFTkJRVU1zVVVGQlVUdEJRVUZCTEU5QlFWVTdRVUZEZUVJc1YwRkJUeXhMUVVGTExFTkJRVU1zU1VGQlNTeEpRVUZKTEZOQlFWTXNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkRNVU1zVjBGQlR5eExRVUZMTEZkQlFWY3NVVUZCVVN4RFFVRkZMR1ZCUVdVc1QwRkJUeXhsUVVGbE8wRkJRVUU3UVVGRk1VVXNaVUZCV1N4VlFVRlZMR0ZCUVdFc1UwRkJWU3hSUVVGUkxGTkJRVk03UVVGRE1VUXNVVUZCU1N4UlFVRlJPMEZCUTFvc1VVRkJTU3hQUVVGTkxFdEJRVXNzVFVGQlRTeFpRVUZaTEV0QlFVc3NXVUZCV1N4aFFVRmhMRXRCUVVzc1lVRkJZU3hOUVVGTkxFdEJRVXNzVFVGQlRTeE5RVUZOTEV0QlFVczdRVUZETjBjc1VVRkJTU3hQUVVGUExGZEJRVmM3UVVGRGJFSXNZVUZCVHl4blFrRkJaMEk3UVVGRE0wSXNVVUZCU1N4RFFVRkRMRTlCUVU4c1RVRkJUU3hUUVVGVkxFOUJRVTg3UVVGREwwSXNZVUZCVHl4TlFVRk5MRTlCUVU4c1ZVRkRhRUlzVFVGQlRTeFBRVUZQTEZWQlEySXNWVUZCVlN4TlFVRk5MRWxCUVVrc1RVRkJUU3hQUVVGUE8wRkJRVUVzVVVGRGNrTTdRVUZEUVN4aFFVRlBMRXRCUVVzc1RVRkJUU3c0U0VGQk9FZ3NWMEZCVnp0QlFVRkJPMEZCUlM5S0xGRkJRVWtzWjBKQlFXZENMRU5CUVVNc1YwRkJWeXhSUVVGUkxHdENRVUZyUWp0QlFVTXhSQ3hSUVVGSkxHZENRVUZuUWl4WFFVRlhMRkZCUVZFc2EwSkJRV3RDTzBGQlEzcEVMSFZDUVVGclFpeFRRVUZSTEZWQlFWVTdRVUZEYUVNc1ZVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeFJRVUZQTzBGQlEzUkNMR0ZCUVU4c1NVRkJTU3hIUVVGSExFVkJRVVVzUjBGQlJ6dEJRVU5tTEZsQlFVa3NVVUZCVVN4UlFVRlBPMEZCUTI1Q0xGbEJRVWtzUzBGQlNTeFRRVUZUTEVsQlFVa3NUVUZCVFN4TlFVRk5MRXRCUVVzc1MwRkJTU3hUUVVGVExFbEJRVWtzVFVGQlRTeE5RVUZOTEVkQlFVYzdRVUZEYkVVc1owSkJRVTBzUzBGQlN5eEpRVUZKTEUxQlFVMHNTVUZCU1N4VFFVRlRPMEZCUTJ4RExHZENRVUZOTEV0QlFVc3NTVUZCU1N4TlFVRk5MRWxCUVVrc1UwRkJVenRCUVVOc1F6dEJRVUZCTzBGQlFVRTdRVUZIVWl4VlFVRkpMRTFCUVUwN1FVRkRUaXhuUWtGQlR5eExRVUZMTzBGQlEyaENMR0ZCUVU4N1FVRkJRVHRCUVVWWUxGRkJRVWtzWjBKQlFXZENPMEZCUTNCQ0xIbENRVUZ4UWl4SFFVRkhMRWRCUVVjN1FVRkJSU3hoUVVGUExHTkJRV01zUlVGQlJTeEpRVUZKTEVWQlFVVTdRVUZCUVR0QlFVTXhSQ3hSUVVGSk8wRkJRMG9zVVVGQlNUdEJRVU5CTEZsQlFVMHNUMEZCVHl4UFFVRlBMRmRCUVZVN1FVRkRPVUlzVlVGQlNTeExRVUZMTzBGQlFVRXNZVUZGVGl4SlFVRlFPMEZCUTBrc1lVRkJUeXhMUVVGTExFMUJRVTA3UVVGQlFUdEJRVVYwUWl4UlFVRkpMRmRCUVZjN1FVRkRaaXhSUVVGSkxEQkNRVUV3UWl4blFrRkRNVUlzVTBGQlZTeExRVUZMTzBGQlFVVXNZVUZCVHl4VlFVRlZMRXRCUVVzc1NVRkJTU3hWUVVGVkxFMUJRVTA3UVVGQlFTeFJRVU16UkN4VFFVRlZMRXRCUVVzN1FVRkJSU3hoUVVGUExGVkJRVlVzUzBGQlN5eEpRVUZKTEZWQlFWVXNUMEZCVHp0QlFVRkJPMEZCUTJoRkxGRkJRVWtzTUVKQlFUQkNMR2RDUVVNeFFpeFRRVUZWTEV0QlFVczdRVUZCUlN4aFFVRlBMRmRCUVZjc1MwRkJTeXhKUVVGSkxGVkJRVlVzVFVGQlRUdEJRVUZCTEZGQlF6VkVMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzVjBGQlZ5eExRVUZMTEVsQlFVa3NWVUZCVlN4UFFVRlBPMEZCUVVFN1FVRkRha1VzYlVOQlFTdENMRXRCUVVzN1FVRkRhRU1zWVVGQlR5eERRVUZETEhkQ1FVRjNRaXhSUVVGUkxFTkJRVU1zZDBKQlFYZENPMEZCUVVFN1FVRkZja1VzVVVGQlNTeFhRVUZYTzBGQlEyWXNVVUZCU1N4SlFVRkpMRWxCUVVrc1MwRkJTeXhYUVVGWExFMUJRVTBzVjBGQldUdEJRVUZGTEdGQlFVOHNXVUZCV1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hKUVVGSkxFbEJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVNN1FVRkJRVHRCUVVOMlNDeE5RVUZGTEhGQ1FVRnhRaXhUUVVGVkxGZEJRVmM3UVVGRGVFTXNWVUZCU1N4alFVRmpMRkZCUVZFN1FVRkRkRUlzYlVKQlFWYzdRVUZEV0N4M1FrRkJaMEk3UVVGQlFTeGhRVVZtTzBGQlEwUXNiVUpCUVZjN1FVRkRXQ3gzUWtGQlowSTdRVUZCUVR0QlFVVndRaXhWUVVGSkxFdEJRVXM3UVVGQlFUdEJRVVZpTEUxQlFVVXNZMEZCWXl4VFFVRlZMRkZCUVZFc1UwRkJVeXhUUVVGVE8wRkJRMmhFTEZWQlFVa3NUVUZCVFN4UFFVRlBPMEZCUTJwQ0xHRkJRVThzVTBGQlV5eE5RVUZOTzBGQlEyeENMRlZCUVVVN1FVRkRSaXhaUVVGSkxHRkJRV0VzU1VGQlNTeFJRVUZSTzBGQlEzcENMR3RDUVVGUk8wRkJRMUlzYVVKQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1ZVRkJTU3h6UWtGQmMwSXNUVUZCVFR0QlFVTTFRaXhsUVVGUE8wRkJRVUVzYVVKQlJVWXNUVUZCVFN4TFFVRkxMRXRCUVVzc1NVRkJTU3hWUVVGVkxGRkJRVkVzUzBGQlN5eE5RVUZOTEV0QlFVc3NTMEZCU3l4SlFVRkpMRlZCUVZVc1VVRkJVU3hIUVVGSE8wRkJRM3BHTEdWQlFVODdRVUZCUVN4aFFVVk9PMEZCUTBRc1owSkJRVkVzVjBGQldUdEJRVU5vUWl4alFVRkpMR3RDUVVGclFqdEJRVU5zUWl4dFFrRkJUeXhUUVVGVExFbEJRVWtzVlVGQlZUdEJRVUZCTzBGQlJUbENMRzFDUVVGUExGTkJRVk1zU1VGQlNTeFZRVUZWTzBGQlFVRTdRVUZGZEVNc1pVRkJUenRCUVVGQk8wRkJRVUU3UVVGSFppeFhRVUZQTzBGQlFVRTdRVUZGV0N4bFFVRlpMRlZCUVZVc2EwSkJRV3RDTEZkQlFWazdRVUZEYUVRc1VVRkJTU3hOUVVGTkxGZEJRVmNzVFVGQlRTeGxRVUZsTzBGQlF6RkRMRkZCUVVrc1EwRkJReXhKUVVGSkxFMUJRVTBzVTBGQlZTeEhRVUZITzBGQlFVVXNZVUZCVHl4UFFVRlBMRTFCUVUwN1FVRkJRU3hSUVVGak8wRkJRelZFTEdGQlFVOHNTMEZCU3l4TlFVRk5PMEZCUVVFN1FVRkZkRUlzVVVGQlNTeEpRVUZKTEZkQlFWYzdRVUZEWml4aFFVRlBMR2RDUVVGblFqdEJRVU16UWl4WFFVRlBMRXRCUVVzc1YwRkJWeXhKUVVGSkxFbEJRVWtzVTBGQlZTeExRVUZMTzBGQlFVVXNZVUZCVHl4RFFVRkRMRXRCUVVzc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGRmRrVXNVMEZCVHp0QlFVRkJPMEZCUjFnc2MwTkJRWE5ETEVsQlFVazdRVUZEZEVNc1UwRkJUeXh4UWtGQmNVSXNXVUZCV1N4WFFVRlhMSE5DUVVGeFFpeFBRVUZQTEU5QlFVOHNZMEZCWXp0QlFVTm9SeXhUUVVGTExFdEJRVXM3UVVGRFZpeFRRVUZMTEU5QlFVODdRVUZCUVN4TlFVTlNPMEZCUVVFc1RVRkRRU3hQUVVGUExGVkJRVlVzVVVGQlVTeFBRVUZQTzBGQlFVRXNUVUZEYUVNc1NVRkJTVHRCUVVGQk8wRkJSVklzVVVGQlNTeFpRVUZaTEVkQlFVY3NUVUZCVFR0QlFVTjZRaXhSUVVGSkxFTkJRVU03UVVGRFJDeFpRVUZOTEVsQlFVa3NWMEZCVnp0QlFVTjZRaXhUUVVGTExFOUJRVThzUzBGQlN5eGhRVUZoTEZWQlFWVXNTVUZCU1N4TFFVRkxPMEZCUTJwRUxGTkJRVXNzWTBGQll5eFRRVUZWTEVkQlFVY3NSMEZCUnp0QlFVRkZMR0ZCUVU4c1ZVRkJWU3hKUVVGSkxFZEJRVWM3UVVGQlFUdEJRVU0zUkN4VFFVRkxMRTlCUVU4c1UwRkJWU3hIUVVGSExFZEJRVWM3UVVGQlJTeGhRVUZQTEZWQlFWVXNTVUZCU1N4SFFVRkhMRXRCUVVzc1NVRkJTU3hKUVVGSk8wRkJRVUU3UVVGRGJrVXNVMEZCU3l4UFFVRlBMRk5CUVZVc1IwRkJSeXhIUVVGSE8wRkJRVVVzWVVGQlR5eFZRVUZWTEVsQlFVa3NSMEZCUnl4TFFVRkxMRWxCUVVrc1NVRkJTVHRCUVVGQk8wRkJRMjVGTEZOQlFVc3NaVUZCWlN4SFFVRkhMRTFCUVUwN1FVRkJRVHRCUVVGQk8wRkJTWEpETERSQ1FVRTBRaXhSUVVGUk8wRkJRMmhETEZOQlFVOHNTMEZCU3l4VFFVRlZMRTlCUVU4N1FVRkRla0lzYlVKQlFXVTdRVUZEWml4WFFVRlBMRTFCUVUwc1QwRkJUenRCUVVOd1FpeFhRVUZQTzBGQlFVRTdRVUZCUVR0QlFVZG1MSGRDUVVGM1FpeFBRVUZQTzBGQlF6TkNMRTFCUVVrc1RVRkJUVHRCUVVOT0xGVkJRVTA3UVVGRFZpeE5RVUZKTEUxQlFVMDdRVUZEVGl4VlFVRk5PMEZCUVVFN1FVRkhaQ3hKUVVGSkxHVkJRV1VzVDBGQlR5eE5RVUZOTzBGQlJXaERMRWxCUVVrc1kwRkJaMElzVjBGQldUdEJRVU0xUWl3d1FrRkJkVUk3UVVGQlFUdEJRVVYyUWl4bFFVRlpMRlZCUVZVc1VVRkJVU3hYUVVGWk8wRkJRM1JETEZkQlFVOHNRMEZCUXl4SlFVRkpPMEZCUTFvc1RVRkJSU3hMUVVGTE8wRkJRMUFzVVVGQlNTeExRVUZMTEdOQlFXTXNTMEZCU3l4RFFVRkRMRWxCUVVrN1FVRkROMElzVlVGQlNTeGxRVUZsTzBGQlEzWkNMRmRCUVU4N1FVRkJRVHRCUVVWWUxHVkJRVmtzVlVGQlZTeFZRVUZWTEZkQlFWazdRVUZEZUVNc1YwRkJUeXhEUVVGRExFbEJRVWs3UVVGRFdpeFJRVUZKTEVWQlFVVXNTMEZCU3l4alFVRmpMRWRCUVVjN1FVRkRlRUlzVlVGQlNTeERRVUZETEVsQlFVazdRVUZEVEN4WlFVRkpMR1ZCUVdVN1FVRkRka0lzWVVGQlR5eExRVUZMTEdOQlFXTXNVMEZCVXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhYUVVGWE8wRkJRM0pFTEZsQlFVa3NWMEZCVnl4TFFVRkxMR05CUVdNN1FVRkRiRU1zV1VGQlNUdEJRVU5CTEdsQ1FVRlBMRk5CUVZNc1NVRkJTU3hUUVVGVE8wRkJRVUVzYVVKQlJURkNMRWRCUVZBN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSFVpeFhRVUZQTzBGQlFVRTdRVUZGV0N4bFFVRlpMRlZCUVZVc1ZVRkJWU3hYUVVGWk8wRkJRM2hETEZkQlFVOHNTMEZCU3l4aFFVRmhMRWxCUVVrc2FVSkJRV2xDTzBGQlFVRTdRVUZGYkVRc1pVRkJXU3hWUVVGVkxGTkJRVk1zVTBGQlZTeFZRVUZWTzBGQlF5OURMRkZCUVVrc1VVRkJVVHRCUVVOYUxGRkJRVWtzUTBGQlF5eExRVUZMTzBGQlEwNHNZVUZCVHp0QlFVTllMRkZCUVVrc1VVRkJVU3hMUVVGTExFZEJRVWM3UVVGRGNFSXNVVUZCU1N4alFVRmpMRXRCUVVzc1IwRkJSeXhQUVVGUE8wRkJRMnBETEZkQlFVOHNRMEZCUXl4TFFVRkxPMEZCUTJJc1VVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTzBGQlEzSkNMR05CUVZFc1pVRkJaU3haUVVGWk8wRkJRVUVzWVVGRE1VSTdRVUZEUkN4blFrRkJUU3hKUVVGSkxGZEJRVmNzWlVGQlpUdEJRVUZCTEdGQlEyNURPMEZCUTBRc1owSkJRVTBzU1VGQlNTeFhRVUZYTEZkQlFWY3NXVUZCV1N4VFFVRlRPMEZCUVVFN1FVRkZja1FzWjBKQlFVMHNTVUZCU1N4WFFVRlhMRmRCUVZjN1FVRkJRVHRCUVVGQk8wRkJSelZETEZGQlFVa3NRMEZCUXl4TFFVRkxPMEZCUTA0c1dVRkJUU3hKUVVGSkxGZEJRVmM3UVVGRGVrSXNWMEZCVHl4TFFVRkxMRmxCUVZrc1YwRkJWenRCUVVOdVF5eGxRVUZYTEV0QlFVc3NWMEZCVnl4WlFVRlpMRTFCUVUwc1dVRkJXU3h2UWtGQmIwSXNTMEZCU3l4aFFVRmhMRXRCUVVzN1FVRkRjRWNzWVVGQlV5eFZRVUZWTEV0QlFVc3NVMEZCVlN4SlFVRkpPMEZCUTJ4RExIRkNRVUZsTzBGQlEyWXNXVUZCVFN4UlFVRlJMRk5CUVZNN1FVRkJRVHRCUVVVelFpeGhRVUZUTEZWQlFWVXNTMEZCU3l4VFFVRlZMRWxCUVVrN1FVRkRiRU1zY1VKQlFXVTdRVUZEWml4WlFVRk5MRlZCUVZVc1RVRkJUU3hSUVVGUkxFbEJRVWtzVjBGQlZ5eE5RVUZOTEZOQlFWTTdRVUZETlVRc1dVRkJUU3hUUVVGVE8wRkJRMllzV1VGQlRTeEhRVUZITEZOQlFWTXNTMEZCU3p0QlFVRkJPMEZCUlROQ0xHRkJRVk1zWVVGQllTeExRVUZMTEZkQlFWazdRVUZEYmtNc1dVRkJUU3hUUVVGVE8wRkJRMllzV1VGQlRUdEJRVU5PTEZWQlFVa3NhMEpCUVd0Q0xGVkJRVlU3UVVGRE5VSXNjVUpCUVdFc1dVRkJXU3hMUVVGTExGTkJRVk03UVVGQlFUdEJRVUZCTzBGQlJ5OURMRmRCUVU4N1FVRkJRVHRCUVVWWUxHVkJRVmtzVlVGQlZTeFhRVUZYTEZOQlFWVXNUVUZCVFN4SlFVRkpMRmxCUVZrN1FVRkROMFFzVVVGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1N4VFFVRlRMR1ZCUVdVc1MwRkJTeXhUUVVGVE8wRkJRM1JETEdGQlFVOHNWVUZCVlN4SlFVRkpMRmRCUVZjc1UwRkJVenRCUVVNM1F5eFJRVUZKTEVOQlFVTXNTMEZCU3p0QlFVTk9MR0ZCUVU4c1ZVRkJWU3hKUVVGSkxGZEJRVmM3UVVGRGNFTXNVVUZCU1N4TFFVRkxMRmRCUVZjN1FVRkRhRUlzWVVGQlR5eEpRVUZKTEdGQlFXRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRMME1zWTBGQlRTeGpRVUZqTEV0QlFVc3NRMEZCUXl4WFFVRlpPMEZCUXpsQ0xHZENRVUZOTEZOQlFWTXNUVUZCVFN4SlFVRkpMRmxCUVZrc1MwRkJTeXhUUVVGVE8wRkJRVUVzVjBGRGNFUTdRVUZCUVR0QlFVRkJMR1ZCUjA0c1dVRkJXVHRCUVVOcVFpeGhRVUZQTEZOQlFWTXNWMEZCV1R0QlFVTjRRaXhaUVVGSkxFdEJRVWtzU1VGQlNTeGhRVUZoTEZOQlFWVXNVMEZCVXl4UlFVRlJPMEZCUTJoRUxHZENRVUZOTzBGQlEwNHNZMEZCU1N4TFFVRkxMRWRCUVVjc1UwRkJVeXhSUVVGUk8wRkJRemRDTEdOQlFVa3NUVUZCVFN4SFFVRkhPMEZCUTFRc1pVRkJSeXhMUVVGTExGTkJRVk03UVVGQlFUdEJRVVY2UWl4WFFVRkZMRkZCUVZFc1YwRkJXVHRCUVVGRkxHbENRVUZQTEUxQlFVMDdRVUZCUVR0QlFVTnlReXhYUVVGRkxFOUJRVTg3UVVGRFZDeGxRVUZQTzBGQlFVRTdRVUZCUVN4WFFVZFdPMEZCUTBRc1ZVRkJTU3hKUVVGSkxFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTm9SQ3haUVVGSkxFdEJRVXNzUjBGQlJ5eFRRVUZUTEZGQlFWRTdRVUZETjBJc1dVRkJTU3hOUVVGTkxFZEJRVWM3UVVGRFZDeGhRVUZITEV0QlFVc3NVMEZCVXp0QlFVRkJPMEZCUlhwQ0xGRkJRVVVzVDBGQlR6dEJRVU5VTEdGQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1pVRkJXU3hWUVVGVkxGRkJRVkVzVjBGQldUdEJRVU4wUXl4WFFVRlBMRXRCUVVzc1UwRkJVeXhMUVVGTExFOUJRVThzVlVGQlZUdEJRVUZCTzBGQlJTOURMR1ZCUVZrc1ZVRkJWU3hWUVVGVkxGTkJRVlVzWVVGQllUdEJRVU51UkN4UlFVRkpMRTlCUVU4c1MwRkJTenRCUVVOb1FpeFJRVUZKTEZWQlFWVXNZVUZCWVN4UlFVRlJPMEZCUTI1RExGRkJRVWtzUzBGQlN5eGhRVUZoTzBGQlEyeENMRmRCUVVzc1kwRkJZeXhMUVVGTExGbEJRVmtzUzBGQlN5eFhRVUZaTzBGQlFVVXNaVUZCVHp0QlFVRkJPMEZCUVVFc1YwRkZOMFE3UVVGRFJDeFhRVUZMTEdOQlFXTTdRVUZEYmtJc1YwRkJTeXhuUWtGQlowSTdRVUZEY2tJc1ZVRkJTU3hSUVVGUkxFdEJRVXNzVTBGQlV5eFpRVUZaTEV0QlFVc3NWMEZCVnp0QlFVTjBSQ3hOUVVGRExHbENRVUZuUWp0QlFVTmlMRlZCUVVVc1MwRkJTenRCUVVOUUxHVkJRVThzUzBGQlN5eGpRVUZqTzBGQlEzUkNMRlZCUVVNc1MwRkJTeXhqUVVGak8wRkJRM2hDTEZsQlFVa3NTMEZCU3p0QlFVTk1MR2RDUVVGTkxFbEJRVWtzVjBGQlZ5eFpRVUZaTzBGQlFVRTdRVUZCUVR0QlFVYzNReXhSUVVGSkxIRkNRVUZ4UWl4TFFVRkxPMEZCUXpsQ0xGZEJRVThzU1VGQlNTeGhRVUZoTEZOQlFWVXNVMEZCVXl4UlFVRlJPMEZCUXk5RExHTkJRVkVzUzBGQlN5eFRRVUZWTEV0QlFVczdRVUZCUlN4bFFVRlBMRXRCUVVzc1kwRkJZeXhMUVVGTExFdEJRVXNzVVVGQlVTeExRVUZMTEUxQlFVMDdRVUZCUVN4VFFVRlhMRk5CUVZVc1MwRkJTenRCUVVGRkxHVkJRVThzUzBGQlN5eGpRVUZqTEV0QlFVc3NTMEZCU3l4UFFVRlBMRXRCUVVzc1RVRkJUVHRCUVVGQkxGTkJRVmNzVVVGQlVTeFhRVUZaTzBGQlEyeE5MRmxCUVVrc1MwRkJTeXhuUWtGQlowSXNiMEpCUVc5Q08wRkJRM3BETEdWQlFVc3NZMEZCWXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTMjVETEdWQlFWa3NWVUZCVlN4UlFVRlJMRmRCUVZrN1FVRkRkRU1zVTBGQlN5eFZRVUZWTEV0QlFVc3NVVUZCVVN4SlFVRkpMRmRCUVZjN1FVRkRNME1zVTBGQlN5eFRRVUZUTzBGQlFVRTdRVUZGYkVJc1pVRkJXU3hWUVVGVkxGRkJRVkVzVTBGQlZTeFhRVUZYTzBGQlF5OURMRkZCUVVrc2FVSkJRV3RDTEV0QlFVc3NiVUpCUVc5Q0xFMUJRVXNzYTBKQlFXdENPMEZCUTNSRkxGRkJRVWtzVDBGQlR5eG5Ra0ZCWjBJN1FVRkRka0lzWVVGQlR5eGxRVUZsTzBGQlF6RkNMRkZCUVVrc1kwRkJZeXhMUVVGTExFOUJRVTg3UVVGRE9VSXNVVUZCU1N4RFFVRkRMR0ZCUVdFN1FVRkRaQ3haUVVGTkxFbEJRVWtzVjBGQlZ5eFRRVUZUTEZkQlFWY3NXVUZCV1R0QlFVRkJPMEZCUlhwRUxGRkJRVWtzZDBKQlFYZENMRWxCUVVrc1MwRkJTeXhIUVVGSExFMUJRVTBzVjBGQlZ5eGhRVUZoTzBGQlEzUkZMREJDUVVGelFpeFBRVUZQTEV0QlFVc3NSMEZCUnl4TFFVRkxMRTFCUVUwN1FVRkRhRVFzYlVKQlFXVXNZVUZCWVR0QlFVTTFRaXhYUVVGUE8wRkJRVUU3UVVGRldDeFRRVUZQTzBGQlFVRTdRVUZIV0N4elEwRkJjME1zU1VGQlNUdEJRVU4wUXl4VFFVRlBMSEZDUVVGeFFpeFpRVUZaTEZkQlFWY3NjMEpCUVhGQ0xFMUJRVTBzV1VGQldTeFZRVUZWTEZGQlFWRTdRVUZEZUVjc1VVRkJTU3hSUVVGUk8wRkJRMW9zVTBGQlN5eExRVUZMTzBGQlExWXNVMEZCU3l4UFFVRlBPMEZCUTFvc1UwRkJTeXhoUVVGaE8wRkJRMnhDTEZOQlFVc3NVMEZCVXp0QlFVTmtMRk5CUVVzc1YwRkJWenRCUVVOb1FpeFRRVUZMTEV0QlFVc3NUMEZCVHl4TlFVRk5MRmxCUVZrc1UwRkJVenRCUVVNMVF5eFRRVUZMTEZOQlFWTXNWVUZCVlR0QlFVTjRRaXhUUVVGTExGTkJRVk03UVVGRFpDeFRRVUZMTEZsQlFWazdRVUZEYWtJc1UwRkJTeXhuUWtGQlowSTdRVUZEY2tJc1UwRkJTeXhYUVVGWE8wRkJRMmhDTEZOQlFVc3NWVUZCVlR0QlFVTm1MRk5CUVVzc1kwRkJZenRCUVVOdVFpeFRRVUZMTEdkQ1FVRm5RanRCUVVOeVFpeFRRVUZMTEdGQlFXRTdRVUZEYkVJc1UwRkJTeXhqUVVGakxFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXpSQ3haUVVGTkxGZEJRVmM3UVVGRGFrSXNXVUZCVFN4VlFVRlZPMEZCUVVFN1FVRkZjRUlzVTBGQlN5eFpRVUZaTEV0QlFVc3NWMEZCV1R0QlFVTTVRaXhaUVVGTkxGTkJRVk03UVVGRFppeFpRVUZOTEVkQlFVY3NVMEZCVXp0QlFVRkJMRTlCUTI1Q0xGTkJRVlVzUjBGQlJ6dEJRVU5hTEZWQlFVa3NXVUZCV1N4TlFVRk5PMEZCUTNSQ0xGbEJRVTBzVTBGQlV6dEJRVU5tTEZsQlFVMHNSMEZCUnl4TlFVRk5MRXRCUVVzN1FVRkRjRUlzV1VGQlRTeFRRVU5HTEUxQlFVMHNUMEZCVHl4UlFVRlJMRXRCUTNKQ0xHRkJRV0VzVFVGQlRTeFpRVUZaTEUxQlFVMHNVMEZCVXp0QlFVTnNSQ3hoUVVGUExGVkJRVlU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMTjBJc2VVSkJRWGxDTEUxQlFVMHNVMEZCVXl4UlFVRlJMRTlCUVU4c1RVRkJUU3hWUVVGVkxGZEJRVmM3UVVGRE9VVXNVMEZCVHp0QlFVRkJMRWxCUTBnN1FVRkJRU3hKUVVOQk8wRkJRVUVzU1VGRFFUdEJRVUZCTEVsQlEwRTdRVUZCUVN4SlFVTkJPMEZCUVVFc1NVRkRRVHRCUVVGQkxFbEJRMEVzUzBGQlRTeFhRVUZWTEVOQlFVTXNXVUZCV1N4TlFVRk5MRTFCUVU4c1UwRkJVU3hOUVVGTkxFMUJRVThzVVVGQlR5eFBRVUZQTEUxQlFVMHNaMEpCUVdkQ08wRkJRVUU3UVVGQlFUdEJRVWN6Unl4NVFrRkJlVUlzVTBGQlV6dEJRVU01UWl4VFFVRlBMRTlCUVU4c1dVRkJXU3hYUVVOMFFpeFZRVU5CTEZWQlFWY3NUVUZCVFN4SFFVRkhMRXRCUVVzc1MwRkJTeXhUUVVGVExFOUJRVThzVFVGQlR6dEJRVUZCTzBGQlJ6ZEVMREpDUVVFeVFpeE5RVUZOTEZOQlFWTXNVMEZCVXp0QlFVTXZReXhUUVVGUE8wRkJRVUVzU1VGRFNEdEJRVUZCTEVsQlEwRTdRVUZCUVN4SlFVTkJPMEZCUVVFc1NVRkRRU3hoUVVGaE8wRkJRVUVzU1VGRFlpeFhRVUZYTEdOQlFXTXNVMEZCVXl4VFFVRlZMRTlCUVU4N1FVRkJSU3hoUVVGUExFTkJRVU1zVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1dwR0xIbENRVUY1UWl4VFFVRlRPMEZCUXpsQ0xFMUJRVWtzVjBGQlZ5eE5RVUZOTzBGQlEycENMRmRCUVU4c1YwRkJXVHRCUVVGRkxHRkJRVTg3UVVGQlFUdEJRVUZCTEdGQlJYWkNMRTlCUVU4c1dVRkJXU3hWUVVGVk8wRkJRMnhETEZkQlFVOHNNRUpCUVRCQ08wRkJRVUVzVTBGRmFFTTdRVUZEUkN4WFFVRlBMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzWVVGQllTeExRVUZMTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUjNwRUxHMURRVUZ0UXl4VFFVRlRPMEZCUTNoRExFMUJRVWtzVVVGQlVTeFJRVUZSTEUxQlFVMDdRVUZETVVJc1RVRkJTU3hOUVVGTkxGZEJRVmNzUjBGQlJ6dEJRVU53UWl4WFFVRlBMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzU1VGQlNUdEJRVUZCTzBGQlFVRXNVMEZGYkVNN1FVRkRSQ3hYUVVGUExGTkJRVlVzUzBGQlN6dEJRVUZGTEdGQlFVOHNZVUZCWVN4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWHBFTEd0Q1FVRnJRaXhYUVVGWE8wRkJRM3BDTEZOQlFVOHNSMEZCUnl4TlFVRk5MRXRCUVVzN1FVRkJRVHRCUVVWNlFpeEpRVUZKTEdOQlFXTTdRVUZEYkVJc2VVSkJRWGxDTEZOQlFWTTdRVUZET1VJc1UwRkJUeXhYUVVGWExFOUJRMlFzVVVGRFFTeFBRVUZQTEZsQlFWa3NWMEZEWml4VlFVTkJMRTFCUVUwc1VVRkJVU3hMUVVGTExFOUJRVTg3UVVGQlFUdEJRVVYwUXl4elFrRkJjMElzU1VGQlNTeFhRVUZYTEdGQlFXRXNWVUZCVlR0QlFVTjRSQ3hOUVVGSkxFOUJRVTBzVlVGQlZTeEpRVUZKTEV0QlFVczdRVUZETjBJc2VVSkJRWFZDTEV0QlFVa3NUMEZCVHp0QlFVTTVRaXhSUVVGSkxGVkJRVk1zVTBGQlV5eEpRVUZITzBGQlEzcENMRmRCUVU4N1FVRkJRU3hOUVVOSUxGRkJRVkU3UVVGQlFTeFJRVU5LTEUxQlFVMHNTVUZCUnp0QlFVRkJMRkZCUTFRc1VVRkJVU3hSUVVGUExFbEJRVWtzVTBGQlZTeFBRVUZQTzBGQlFVVXNhVUpCUVU4c1RVRkJUU3haUVVGWk8wRkJRVUVzVjBGQlZ5eEpRVUZKTEZOQlFWVXNUMEZCVHp0QlFVTXpSaXhqUVVGSkxGVkJRVlVzVFVGQlRTeFRRVUZUTEdkQ1FVRm5RaXhOUVVGTk8wRkJRMjVFTEdOQlFVa3NWMEZCVnl4UlFVRlJPMEZCUTNaQ0xHTkJRVWtzVjBGQlZ5eFhRVUZYTzBGQlF6RkNMR05CUVVrc2FVSkJRV2xDTzBGQlEzSkNMR05CUVVrc1UwRkJVenRCUVVGQkxGbEJRMVFzVFVGQlRTeE5RVUZOTzBGQlFVRXNXVUZEV2l4WlFVRlpPMEZCUVVFc1kwRkRVaXhOUVVGTk8wRkJRVUVzWTBGRFRpeGpRVUZqTzBGQlFVRXNZMEZEWkR0QlFVRkJMR05CUTBFN1FVRkJRU3hqUVVOQk8wRkJRVUVzWTBGRFFUdEJRVUZCTEdOQlEwRXNVVUZCVVR0QlFVRkJMR05CUTFJc1dVRkJXU3huUWtGQlowSTdRVUZCUVR0QlFVRkJMRmxCUldoRExGTkJRVk1zVTBGQlV5eE5RVUZOTEZsQlFWa3NTVUZCU1N4VFFVRlZMRmRCUVZjN1FVRkJSU3h4UWtGQlR5eE5RVUZOTEUxQlFVMDdRVUZCUVN4bFFVTTNSU3hKUVVGSkxGTkJRVlVzVDBGQlR6dEJRVU4wUWl4clFrRkJTU3hQUVVGUExFMUJRVTBzVFVGQlRTeFRRVUZUTEUxQlFVMHNVVUZCVVN4aFFVRmhMRTFCUVUwc1dVRkJXU3hYUVVGVkxFMUJRVTA3UVVGRE4wWXNhMEpCUVVrc1dVRkJWeXhSUVVGUk8wRkJRM1pDTEd0Q1FVRkpMRlZCUVZNN1FVRkJRU3huUWtGRFZEdEJRVUZCTEdkQ1FVTkJMRlZCUVZVN1FVRkJRU3huUWtGRFZpeFRRVUZUTzBGQlFVRXNaMEpCUTFRN1FVRkJRU3huUWtGRFFUdEJRVUZCTEdkQ1FVTkJMRmxCUVZrc1owSkJRV2RDTzBGQlFVRTdRVUZGYUVNc05rSkJRV1VzWjBKQlFXZENMR0ZCUVZrN1FVRkRNME1zY1VKQlFVODdRVUZCUVR0QlFVRkJMRmxCUlZnc2JVSkJRVzFDTEZOQlFWVXNWVUZCVXp0QlFVRkZMSEZDUVVGUExHVkJRV1VzWjBKQlFXZENPMEZCUVVFN1FVRkJRVHRCUVVWc1JpeDVRa0ZCWlN4VFFVRlRMRTlCUVU4N1FVRkRMMElzWTBGQlNTeFhRVUZYTEUxQlFVMDdRVUZEYWtJc01rSkJRV1VzWjBKQlFXZENMRmxCUVZrc1QwRkJUenRCUVVGQk8wRkJSWFJFTEdsQ1FVRlBPMEZCUVVFN1FVRkJRVHRCUVVGQkxFMUJSMllzVjBGQlZ5eFJRVUZQTEZOQlFWTXNTMEZCVFN4WlFVRlpMRTFCUVUwc1dVRkJXU3hSUVVGUExFOUJRMnhGTEVOQlFVVXNVVUZCVHl4alFVRmpMR1ZCUVdVc1UwRkJVeXhMUVVGTExGVkJRVlVzWTBGRE1VUXNRMEZCUXl4dlFrRkJiMElzUzBGQlN5eFZRVUZWTEdOQlEzQkRMRWRCUVVjc1QwRkJUeXhWUVVGVkxGVkJRVlVzVFVGQlRTeHJRa0ZCYTBJc1MwRkJTenRCUVVGQk8wRkJRVUU3UVVGSE0wVXNNa0pCUVhsQ0xFOUJRVTg3UVVGRE5VSXNVVUZCU1N4TlFVRk5MRk5CUVZNN1FVRkRaaXhoUVVGUE8wRkJRMWdzVVVGQlNTeE5RVUZOTEZOQlFWTTdRVUZEWml4WlFVRk5MRWxCUVVrc1RVRkJUVHRCUVVOd1FpeFJRVUZKTEZGQlFWRXNUVUZCVFN4UFFVRlBMRkZCUVZFc1RVRkJUU3hQUVVGUExGbEJRVmtzVFVGQlRTeFhRVUZYTEZsQlFWa3NUVUZCVFR0QlFVTTNSaXhSUVVGSkxGZEJRVmNzVlVGQlZTeFRRVU55UWl4VlFVRlZMRk5CUTA0c1QwRkRRU3haUVVGWkxGZEJRVmNzVDBGQlR5eERRVUZETEVOQlFVTXNZVUZEY0VNc1ZVRkJWU3hUUVVOT0xGbEJRVmtzVjBGQlZ5eFBRVUZQTEVOQlFVTXNRMEZCUXl4aFFVTm9ReXhaUVVGWkxFMUJRVTBzVDBGQlR5eFBRVUZQTEVOQlFVTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVOMlJDeFhRVUZQTzBGQlFVRTdRVUZGV0N3MlFrRkJNa0lzWVVGQllUdEJRVU53UXl4UlFVRkpMRmxCUVZrc1dVRkJXVHRCUVVNMVFpeHZRa0ZCWjBJc1MwRkJTVHRCUVVOb1FpeFZRVUZKTEZGQlFWRXNTVUZCUnl4UFFVRlBMRTlCUVU4c1NVRkJSeXhOUVVGTkxGRkJRVThzU1VGQlJ5eE5RVUZOTEZOQlFWTXNTVUZCUnl4UlFVRlJMRkZCUVZFc1NVRkJSenRCUVVOeVJpeGhRVUZQTEVsQlFVa3NVVUZCVVN4VFFVRlZMRk5CUVZNc1VVRkJVVHRCUVVNeFF5eHJRa0ZCVlN4TFFVRkxPMEZCUTJZc1dVRkJTU3hSUVVGUkxFMUJRVTBzV1VGQldUdEJRVU01UWl4WlFVRkpMRmRCUVZjc1RVRkJUU3hYUVVGWE8wRkJRMmhETEZsQlFVa3NZVUZCWVN4VFFVRlRMRk5CUVZNc1UwRkJVenRCUVVNMVF5eFpRVUZKTEVOQlFVTXNZMEZCWXl4VFFVRlRMRmxCUVZrc1UwRkJVenRCUVVNM1F5eG5Ra0ZCVFN4SlFVRkpMRTFCUVUwc05rSkJRVFpDTzBGQlEycEVMRmxCUVVrc1UwRkJWU3hWUVVGUkxGVkJRVlVzUTBGQlJTeFJRVUZSTEVsQlFVczdRVUZETDBNc1dVRkJTU3hUUVVGUkxGVkJRVlVzVFVGQlN5eFhRVUZYTEU5QlFVOHNVVUZCVVR0QlFVTnFSQ3huUWtGQlRTeEpRVUZKTEUxQlFVMDdRVUZCUVR0QlFVVndRaXhaUVVGSkxGZEJRVmM3UVVGRFdDeHBRa0ZCVHl4UlFVRlJMRU5CUVVVc1lVRkJZU3hIUVVGSExGVkJRVlVzU1VGQlNTeFRRVUZUTEVsQlFVa3NXVUZCV1R0QlFVTTFSU3haUVVGSk8wRkJRMG9zV1VGQlNTeFBRVUZQTzBGQlExZ3NXVUZCU1N4WFFVRlhPMEZCUTJZc1dVRkJTU3hqUVVGak8wRkJRMnhDTEZsQlFVa3NaVUZCWlN4VFFVRlZMRTlCUVU4N1FVRkRhRU1zV1VGQlJUdEJRVU5HTEhsQ1FVRmxPMEZCUVVFN1FVRkZia0lzV1VGQlNTeFRRVUZUTEdWQlFXVTdRVUZEZUVJc1kwRkJTU3hOUVVGTkxGTkJRVk03UVVGRFppeHRRa0ZCVHl4UlFVRlJMRU5CUVVVc1lVRkJNRUlzVlVGQmIwSXNVMEZCVXl4SlFVRkpMRmxCUVZrN1FVRkROVVlzWTBGQlNTeE5RVUZOTEZOQlFWTTdRVUZEWml4cFFrRkJTeXhMUVVGTExFMUJRVTBzVFVGQlRUdEJRVUZCTzBGQlJYUkNMR2xDUVVGTExFdEJRVXNzVFVGQlRTeE5RVUZOTEU5QlFVOHNaMEpCUVdkQ08wRkJRVUVzWlVGRmFFUTdRVUZEUkN4alFVRkpMRTFCUVVzc1lVRkRUQ3hYUVVOSkxFTkJRVU1zVVVGQlVTeFRRVU5VTEVOQlFVTXNVVUZCVVN4UlFVTmlMRU5CUVVNc1QwRkJUU3hQUVVGUExGRkJRVkVzU1VGQlJ5eEpRVUZKTEZGQlFWRXNTVUZCUnp0QlFVTTFReXhqUVVGSkxGbEJRVms3UVVGRFdpeHhRa0ZCVXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hSUVVGUkxFVkJRVVVzUjBGQlJ6dEJRVU0zUWl4dFFrRkJTeXhMUVVGTExFMUJRVThzVTBGQlV5eE5RVUZOTEU5QlFVOHNVMEZEYmtNc1RVRkJUU3hOUVVGTkxFMUJRVTBzU1VGQlNTeE5RVUZOTEUxQlF6VkNMRTFCUVUwc1RVRkJUU3hOUVVGTk8wRkJRM1JDTEd0Q1FVRkpMRlZCUVZVN1FVRkJRVHRCUVVGQkxHbENRVWRxUWp0QlFVTkVMSEZDUVVGVExFbEJRVWtzUjBGQlJ5eEpRVUZKTEZGQlFWRXNSVUZCUlN4SFFVRkhPMEZCUXpkQ0xHMUNRVUZMTEV0QlFVc3NUVUZCVFN4TlFVRk5MRTFCUVUwc1RVRkJUVHRCUVVOc1F5eHJRa0ZCU1N4VlFVRlZPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTVEZDTEZsQlFVa3NUMEZCVHl4VFFVRlZMRTlCUVU4N1FVRkRlRUlzWTBGQlNTeGhRVUZoTEUxQlFVMHNUMEZCVHp0QlFVTTVRaXhsUVVGTExGRkJRVkVzVTBGQlZTeE5RVUZMTEVsQlFVYzdRVUZCUlN4dFFrRkJUeXhMUVVGSkxGTkJRVk1zVVVGQlV5eFZRVUZUTEUxQlFVc3NTMEZCU1R0QlFVRkJPMEZCUTJoR0xHdENRVUZSTzBGQlFVRXNXVUZEU2p0QlFVRkJMRmxCUTBFN1FVRkJRU3haUVVOQkxGTkJRVk1zVTBGQlV5eFhRVUZYTEZGQlFVOHNTMEZCU3l4SlFVRkpMRk5CUVZVc1RVRkJTenRCUVVGRkxIRkNRVUZQTEV0QlFVazdRVUZCUVR0QlFVRkJMRmxCUTNwRk8wRkJRVUU3UVVGQlFUdEJRVWRTTEZsQlFVa3NWVUZCVlN4VFFVRlZMRTlCUVU4N1FVRkRNMElzZFVKQlFXRTdRVUZEWWl4bFFVRkxPMEZCUVVFN1FVRkZWQ3haUVVGSkxGbEJRVms3UVVGQlFUdEJRVUZCTzBGQlIzaENMSGxDUVVGdlFpeExRVUZKTzBGQlEzQkNMRlZCUVVrc1VVRkJVU3hKUVVGSExFOUJRVThzVTBGQlV5eEpRVUZITEZGQlFWRXNVMEZCVVN4SlFVRkhMRTlCUVU4c1ZVRkJWU3hKUVVGSExGTkJRVk1zVTBGQlV5eEpRVUZITzBGQlF6bEdMR0ZCUVU4c1NVRkJTU3hSUVVGUkxGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlF6RkRMR3RDUVVGVkxFdEJRVXM3UVVGRFppeFpRVUZKTEZGQlFWRXNUMEZCVFN4UFFVRlBMRkZCUVZFc1QwRkJUVHRCUVVOMlF5eFpRVUZKTEZGQlFWRXNUVUZCVFN4WlFVRlpPMEZCUXpsQ0xGbEJRVWtzVTBGQlV5eE5RVUZOTEdWQlEyWXNVVUZEUVN4TlFVRk5MRTFCUVUwc1RVRkJUVHRCUVVOMFFpeFpRVUZKTEZsQlFWa3NWVUZEV2l4VFFVTkpMR1ZCUTBFc1UwRkRTaXhUUVVOSkxHVkJRMEU3UVVGRFVpeFpRVUZKTEUxQlFVMHNWVUZCVlN4RFFVRkZMRzlDUVVGdFFpeFZRVU55UXl4UFFVRlBMRmRCUVZjc1owSkJRV2RDTEZGQlFWRXNZVUZETVVNc1QwRkJUeXhqUVVGakxHZENRVUZuUWl4UlFVRlJPMEZCUTJwRUxGbEJRVWtzVlVGQlZTeHRRa0ZCYlVJN1FVRkRha01zV1VGQlNTeFpRVUZaTEV0QlFVc3NVMEZCVlN4SlFVRkpPMEZCUXk5Q0xHTkJRVWtzVTBGQlV5eEpRVUZKTzBGQlEycENMR05CUVVrc1EwRkJReXhSUVVGUk8wRkJRMVFzYjBKQlFWRTdRVUZEVWp0QlFVRkJPMEZCUlVvc2FVSkJRVThzVVVGQlVTeEZRVUZGTzBGQlEycENMR2xDUVVGUExFOUJRVTg3UVVGRFpDeGpRVUZKTEd0Q1FVRnJRaXhQUVVGUExGTkJRVk1zUzBGQlN6dEJRVU16UXl4alFVRkpMRFJDUVVFMFFpeFBRVUZQTzBGQlEzWkRMR05CUVVrN1FVRkRRU3gzUTBGQk5FSXNNRUpCUVRCQ0xFdEJRVXM3UVVGREwwUXNZMEZCU1N4cFFrRkJhVUlzVDBGQlR5eFJRVUZSTEV0QlFVczdRVUZEZWtNc1kwRkJTU3cwUWtGQk5FSXNWMEZCV1R0QlFVRkZMR3RDUVVGTkxFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlF6bEVMR05CUVVrc2VVSkJRWGxDTEZkQlFWazdRVUZCUlN4clFrRkJUU3hKUVVGSkxFMUJRVTA3UVVGQlFUdEJRVU16UkN4cFFrRkJUeXhSUVVGUk8wRkJRMllzYVVKQlFVOHNUMEZCVHl4UFFVRlBMRmRCUVZjc1QwRkJUeXh4UWtGQmNVSXNUMEZCVHl4VlFVRlZPMEZCUXpkRkxHbENRVUZQTEU5QlFVOHNTMEZCU3p0QlFVTnVRaXhwUWtGQlR5eFBRVUZQTEZkQlFWazdRVUZEZEVJc1owSkJRVWtzVVVGQlVUdEJRVU5hTEdkQ1FVRkpMRk5CUVZNN1FVRkRZaXh0UWtGQlR5eExRVUZMTEUxQlFVMHNWMEZCV1R0QlFVRkZMSEZDUVVGUExGZEJRVmNzVFVGQlRTeGhRVUZoTEUxQlFVMDdRVUZCUVN4bFFVRlhMRXRCUVVzc1YwRkJXVHRCUVVGRkxIRkNRVUZQTzBGQlFVRTdRVUZCUVR0QlFVVndTQ3hwUWtGQlR5eFJRVUZSTEZOQlFWVXNWVUZCVlR0QlFVTXZRaXhuUWtGQlNTeHRRa0ZCYlVJc1NVRkJTU3hSUVVGUkxGTkJRVlVzYTBKQlFXdENMR2xDUVVGcFFqdEJRVU0xUlN4cFEwRkJiVUlzUzBGQlN6dEJRVU40UWl4clFrRkJTU3hWUVVGVkxHMUNRVUZ0UWp0QlFVTnFReXh4UWtGQlR5eFBRVUZQTzBGQlEyUXNjVUpCUVU4c1QwRkJUeXhUUVVGVkxFOUJRVTg3UVVGRE0wSXNkVUpCUVU4c1QwRkJUeXhQUVVGUExGZEJRVmNzVDBGQlR5eHhRa0ZCY1VJc1QwRkJUeXhWUVVGVk8wRkJRemRGTEdsRFFVRnBRanRCUVVGQk8wRkJRVUU3UVVGSGVrSXNaMEpCUVVrc2EwSkJRV3RDTEZkQlFWazdRVUZET1VJc2EwSkJRVWtzU1VGQlNTeFJRVUZSTzBGQlExb3NiMEpCUVVrN1FVRkRRVHRCUVVGQkxIbENRVVZITEV0QlFWQTdRVUZEU1N4NVFrRkJUeXhMUVVGTE8wRkJRVUU3UVVGQlFTeHhRa0ZIWmp0QlFVTkVMSFZDUVVGUExFOUJRVTg3UVVGRFpDeDFRa0ZCVHl4UlFVRlJMRmRCUVZrN1FVRkJSU3gzUWtGQlRTeEpRVUZKTEUxQlFVMDdRVUZCUVR0QlFVTTNReXgxUWtGQlR6dEJRVUZCTzBGQlFVRTdRVUZIWml4blFrRkJTU3haUVVGWkxFdEJRVXNzVTBGQlZTeExRVUZKTzBGQlF5OUNMR3RDUVVGSkxGbEJRVms3UVVGRGFFSTdRVUZCUVR0QlFVVktMRzFDUVVGUExGZEJRVmM3UVVGRGJFSXNiVUpCUVU4c2NVSkJRWEZDTzBGQlF6VkNMRzFDUVVGUExGVkJRVlU3UVVGRGFrSTdRVUZEUVN4dFFrRkJUenRCUVVGQk8wRkJSVmdzYTBKQlFWRTdRVUZCUVN4WFFVTlVPMEZCUVVFN1FVRkJRVHRCUVVkWUxHMUNRVUZsTEZsQlFWYzdRVUZEZEVJc1lVRkJUeXhUUVVGVkxGTkJRVk03UVVGRGRFSXNaVUZCVHl4SlFVRkpMRkZCUVZFc1UwRkJWU3hUUVVGVExGRkJRVkU3UVVGRE1VTXNiMEpCUVZVc1MwRkJTenRCUVVObUxHTkJRVWtzVVVGQlVTeFJRVUZSTEU5QlFVOHNVMEZCVXl4UlFVRlJMRkZCUVZFc1VVRkJVU3hSUVVGUkxFOUJRVThzVTBGQlVTeFJRVUZSTzBGQlF6TkdMR05CUVVrc2EwSkJRV3RDTEZWQlFWVXNWMEZCVnl4VFFVRlpPMEZCUTNaRUxHTkJRVWtzVVVGQlVTeFBRVUZOTEU5QlFVOHNVVUZCVVN4UFFVRk5PMEZCUTNaRExHTkJRVWtzVVVGQlVTeE5RVUZOTEZsQlFWazdRVUZET1VJc1kwRkJTU3hUUVVGVExFMUJRVTBzWlVGQlpTeFJRVUZSTEUxQlFVMHNUVUZCVFN4TlFVRk5PMEZCUXpWRUxHTkJRVWtzWTBGQll5eG5Ra0ZCWjBJN1FVRkRiRU1zWTBGQlNTeFZRVUZWTzBGQlExWXNiVUpCUVU4c1VVRkJVU3hEUVVGRkxGRkJRVkU3UVVGRE4wSXNZMEZCU1N4WlFVRlhPMEZCUTFnc1owSkJRVWtzVFVGQlRTeFRRVU5PTEU5QlFVOHNUMEZCVHl4aFFVRmhMRzFDUVVNelFpeFBRVUZQTEZkQlFWY3NZVUZCWVR0QlFVTnVReXhuUWtGQlNTeFpRVUZaTEZOQlFWVXNUMEZCVHp0QlFVRkZMSEZDUVVGUExGRkJRVkVzUTBGQlJTeFJRVUZSTEUxQlFVMHNUMEZCVHp0QlFVRkJPMEZCUTNwRkxHZENRVUZKTEZWQlFWVXNiVUpCUVcxQ08wRkJRVUVzYVVKQlJXaERPMEZCUTBRc1owSkJRVWtzVlVGQlZUdEJRVU5rTEdkQ1FVRkpMRkZCUVZFc1ZVRkJWU3hEUVVGRkxHOUNRVUZ0UWl4VlFVTjJReXhQUVVGUExGZEJRVmNzWlVGRGJFSXNUMEZCVHl4alFVRmpPMEZCUTNwQ0xHZENRVUZKTEZkQlFWYzdRVUZEWml4clFrRkJUU3haUVVGWkxGTkJRVlVzVDBGQlR6dEJRVU12UWl4clFrRkJTU3hUUVVGVExFMUJRVTA3UVVGRGJrSXNhMEpCUVVrc1EwRkJRenRCUVVORUxIVkNRVUZQTEZGQlFWRXNRMEZCUlN4UlFVRlJPMEZCUXpkQ0xIVkNRVUZUTEV0QlFVc3NVMEZCVXl4UFFVRlBMRkZCUVZFc1QwRkJUenRCUVVNM1F5eHJRa0ZCU1N4RlFVRkZMRmxCUVZrN1FVRkRaQ3gxUWtGQlR5eFJRVUZSTEVOQlFVVXNVVUZCVVR0QlFVTTNRaXh4UWtGQlR6dEJRVUZCTzBGQlJWZ3NhMEpCUVUwc1ZVRkJWU3h0UWtGQmJVSTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0dVJDeFhRVUZQTzBGQlFVRXNUVUZEU0N4TlFVRk5PMEZCUVVFc1RVRkRUaXhSUVVGUk8wRkJRVUVzVFVGRFVqdEJRVUZCTEUxQlEwRXNVMEZCVXl4VFFVRlZMRXRCUVVrN1FVRkRia0lzV1VGQlNTeFJRVUZSTEVsQlFVY3NUMEZCVHl4UlFVRlBMRWxCUVVjN1FVRkRhRU1zWlVGQlR5eEpRVUZKTEZGQlFWRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRNVU1zYjBKQlFWVXNTMEZCU3p0QlFVTm1MR05CUVVrc1VVRkJVU3hOUVVGTkxGbEJRVms3UVVGRE9VSXNZMEZCU1N4VFFVRlRMRTFCUVVzN1FVRkRiRUlzWTBGQlNTeFRRVUZUTEVsQlFVa3NUVUZCVFR0QlFVTjJRaXhqUVVGSkxGZEJRVmM3UVVGRFppeGpRVUZKTEdkQ1FVRm5RanRCUVVOd1FpeGpRVUZKTzBGQlEwb3NZMEZCU1N4cFFrRkJhVUlzVTBGQlZTeFBRVUZQTzBGQlEyeERMR2RDUVVGSkxFOUJRVTBzVFVGQlRUdEJRVU5vUWl4blFrRkJTeXhSUVVGUExFdEJRVWtzVVVGQlVTeExRVUZKTEZkQlFWYzdRVUZEYmtNN1FVRkRTaXhuUWtGQlNTeEZRVUZGTEd0Q1FVRnJRanRCUVVOd1FpeHpRa0ZCVVR0QlFVRkJPMEZCUldoQ0xHTkJRVWtzWlVGQlpTeHRRa0ZCYlVJN1FVRkRkRU1zYlVKQlFWTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1VVRkJVU3hGUVVGRkxFZEJRVWM3UVVGRE4wSXNaMEpCUVVrc1RVRkJUU3hOUVVGTE8wRkJRMllzWjBKQlFVa3NUMEZCVHl4TlFVRk5PMEZCUTJJc2IwSkJRVTBzVFVGQlRTeEpRVUZKTEUxQlFVczdRVUZEY2tJc2EwSkJRVWtzVDBGQlR6dEJRVU5ZTEd0Q1FVRkpMRmxCUVZrN1FVRkRhRUlzYTBKQlFVa3NWVUZCVlR0QlFVTmtMR2RDUVVGRk8wRkJRVUU3UVVGQlFUdEJRVWRXTEdOQlFVa3NZVUZCWVR0QlFVTmlMRzlDUVVGUk8wRkJRVUU3UVVGQlFUdEJRVUZCTEUxQlIzQkNMRXRCUVVzc1UwRkJWU3hMUVVGSk8wRkJRMllzV1VGQlNTeFJRVUZSTEVsQlFVY3NUMEZCVHl4TlFVRk5MRWxCUVVjN1FVRkRMMElzWlVGQlR5eEpRVUZKTEZGQlFWRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRNVU1zYjBKQlFWVXNTMEZCU3p0QlFVTm1MR05CUVVrc1VVRkJVU3hOUVVGTkxGbEJRVms3UVVGRE9VSXNZMEZCU1N4TlFVRk5MRTFCUVUwc1NVRkJTVHRCUVVOd1FpeGpRVUZKTEZsQlFWa3NVMEZCVlN4UFFVRlBPMEZCUVVVc2JVSkJRVThzVVVGQlVTeE5RVUZOTEU5QlFVODdRVUZCUVR0QlFVTXZSQ3hqUVVGSkxGVkJRVlVzYlVKQlFXMUNPMEZCUVVFN1FVRkJRVHRCUVVGQkxFMUJSM3BETEU5QlFVOHNUVUZCVFR0QlFVRkJMRTFCUTJJc1dVRkJXVHRCUVVGQkxFMUJRMW9zVDBGQlR5eFRRVUZWTEV0QlFVazdRVUZEYWtJc1dVRkJTU3hUUVVGUkxFbEJRVWNzVDBGQlR5eFJRVUZSTEVsQlFVYzdRVUZEYWtNc1dVRkJTU3hSUVVGUkxFOUJRVTBzVDBGQlR5eFJRVUZSTEU5QlFVMDdRVUZEZGtNc1pVRkJUeXhKUVVGSkxGRkJRVkVzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZETVVNc1kwRkJTU3hSUVVGUkxFMUJRVTBzV1VGQldUdEJRVU01UWl4alFVRkpMRk5CUVZNc1RVRkJUU3hsUVVGbExGRkJRVkVzVFVGQlRTeE5RVUZOTEUxQlFVMDdRVUZETlVRc1kwRkJTU3hqUVVGakxHZENRVUZuUWp0QlFVTnNReXhqUVVGSkxFMUJRVTBzWTBGQll5eFBRVUZQTEUxQlFVMHNaVUZCWlN4UFFVRlBPMEZCUXpORUxHTkJRVWtzV1VGQldTeExRVUZMTEZOQlFWVXNTVUZCU1R0QlFVRkZMRzFDUVVGUExGRkJRVkVzUjBGQlJ5eFBRVUZQTzBGQlFVRTdRVUZET1VRc1kwRkJTU3hWUVVGVkxHMUNRVUZ0UWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTMnBFTEUxQlFVa3NUVUZCU3l4alFVRmpMRWxCUVVrc1YwRkJWeXhUUVVGVExFbEJRVWNzVVVGQlVTeFpRVUZaTEVsQlFVYzdRVUZEZWtVc1RVRkJTU3hUUVVGVExFOUJRVThzVDBGQlR5eEpRVUZKTEZOQlFWVXNZVUZCWVR0QlFVRkZMRmRCUVU4c2EwSkJRV3RDTzBGQlFVRTdRVUZEYWtZc1RVRkJTU3hYUVVGWE8wRkJRMllzVTBGQlR5eFJRVUZSTEZOQlFWVXNUMEZCVHp0QlFVRkZMRmRCUVU4c1UwRkJVeXhOUVVGTkxGRkJRVkU3UVVGQlFUdEJRVU5vUlN4VFFVRlBPMEZCUVVFc1NVRkRTQ3hQUVVGUE8wRkJRVUVzU1VGRFVDeGhRVUZoTEVkQlFVY3NXVUZCV1N4TFFVRkxPMEZCUVVFc1NVRkRha01zVDBGQlR5eFRRVUZWTEUxQlFVMDdRVUZEYmtJc1ZVRkJTU3hUUVVGVExGTkJRVk03UVVGRGRFSXNWVUZCU1N4RFFVRkRPMEZCUTBRc1kwRkJUU3hKUVVGSkxFMUJRVTBzV1VGQldTeFBRVUZQTzBGQlEzWkRMR0ZCUVU4c1UwRkJVenRCUVVGQk8wRkJRVUVzU1VGRmNFSXNTMEZCU3p0QlFVRkJMRWxCUTB3c1UwRkJVenRCUVVGQkxFbEJRMVFzVTBGQlV5eFZRVUZWTzBGQlFVRXNTVUZEYmtJN1FVRkJRVHRCUVVGQk8wRkJTVklzSzBKQlFTdENMRmRCUVZjc1lVRkJZVHRCUVVOdVJDeFRRVUZQTEZsQlFWa3NUMEZCVHl4VFFVRlZMRTFCUVUwc1MwRkJTVHRCUVVNeFF5eFJRVUZKTEZOQlFWTXNTVUZCUnp0QlFVTm9RaXhYUVVGUkxGTkJRVk1zVTBGQlV5eEpRVUZKTEU5QlFVOHNUMEZCVHp0QlFVRkJMRXRCUXpkRE8wRkJRVUU3UVVGRlVDeG5RMEZCWjBNc1lVRkJZU3hQUVVGUExFdEJRVWtzVlVGQlZUdEJRVU01UkN4TlFVRkpMR05CUVdNc1NVRkJSeXhoUVVGaExGbEJRVmtzU1VGQlJ6dEJRVU5xUkN4TlFVRkpMRk5CUVZNc2MwSkJRWE5DTEdGQlFXRXNUMEZCVHl4WFFVRlhMR0ZCUVdFc1YwRkJWeXhaUVVGWk8wRkJRM1JITEZOQlFVODdRVUZCUVN4SlFVTklPMEZCUVVFN1FVRkJRVHRCUVVkU0xHdERRVUZyUXl4SlFVRkpMRlZCUVZVN1FVRkROVU1zVFVGQlNTeFJRVUZSTEZOQlFWTTdRVUZEY2tJc1RVRkJTU3hUUVVGVExIVkNRVUYxUWl4SFFVRkhMR05CUVdNc1QwRkJUeXhIUVVGSExFOUJRVTg3UVVGRGRFVXNTMEZCUnl4UFFVRlBMRTlCUVU4N1FVRkRha0lzUzBGQlJ5eFBRVUZQTEZGQlFWRXNVMEZCVlN4UFFVRlBPMEZCUXk5Q0xGRkJRVWtzV1VGQldTeE5RVUZOTzBGQlEzUkNMRkZCUVVrc1IwRkJSeXhMUVVGTExFOUJRVThzVDBGQlR5eExRVUZMTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1NVRkJTU3hUUVVGVE8wRkJRVUVzVVVGQlpUdEJRVU12UlN4WlFVRk5MRTlCUVU4c1IwRkJSeXhMUVVGTExFMUJRVTA3UVVGRE0wSXNWVUZCU1N4SFFVRkhMSE5DUVVGelFpeEhRVUZITEU5QlFVODdRVUZEYmtNc1YwRkJSeXhYUVVGWExFOUJRVThzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCVFRORExIVkNRVUYxUWl4SlFVRkpMRTFCUVUwc1dVRkJXU3hWUVVGVk8wRkJRMjVFTEdGQlFWY3NVVUZCVVN4VFFVRlZMRmRCUVZjN1FVRkRjRU1zVVVGQlNTeFRRVUZUTEZOQlFWTTdRVUZEZEVJc1UwRkJTeXhSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVU40UWl4VlFVRkpMRmRCUVZjc2MwSkJRWE5DTEV0QlFVczdRVUZETVVNc1ZVRkJTU3hEUVVGRExGbEJRV0VzVjBGQlZ5eFpRVUZaTEZOQlFWTXNWVUZCVlN4UlFVRlpPMEZCUTNCRkxGbEJRVWtzVVVGQlVTeEhRVUZITEZsQlFWa3NZVUZCWVN4bFFVRmxMRWRCUVVjc1lVRkJZVHRCUVVOdVJTeHJRa0ZCVVN4TFFVRkxMRmRCUVZjN1FVRkJRU3haUVVOd1FpeExRVUZMTEZkQlFWazdRVUZCUlN4eFFrRkJUeXhMUVVGTExFMUJRVTA3UVVGQlFUdEJRVUZCTEZsQlEzSkRMRXRCUVVzc1UwRkJWU3hQUVVGUE8wRkJRMnhDTERaQ1FVRmxMRTFCUVUwc1YwRkJWeXhEUVVGRkxFOUJRV01zVlVGQlZTeE5RVUZOTEdOQlFXTXNUVUZCVFN4WlFVRlpPMEZCUVVFN1FVRkJRVHRCUVVGQkxHVkJTWFpITzBGQlEwUXNZMEZCU1N4aFFVRmhMRWxCUVVrc1IwRkJSeXhOUVVGTkxGZEJRVmM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCVFRkRUxIbENRVUY1UWl4SlFVRkpMRTFCUVUwN1FVRkRMMElzVDBGQlN5eFJRVUZSTEZOQlFWVXNTMEZCU3p0QlFVTjRRaXhoUVVGVExFOUJRVThzUzBGQlN6dEJRVU5xUWl4VlFVRkpMRWxCUVVrc1owSkJRV2RDTEVkQlFVYzdRVUZEZGtJc1pVRkJUeXhKUVVGSk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNUTkNMREpDUVVFeVFpeEhRVUZITEVkQlFVYzdRVUZETjBJc1UwRkJUeXhGUVVGRkxFdEJRVXNzVlVGQlZTeEZRVUZGTEV0QlFVczdRVUZCUVR0QlFVVnVReXh6UWtGQmMwSXNTVUZCU1N4WlFVRlpMR2xDUVVGcFFpeFJRVUZSTzBGQlF6TkVMRTFCUVVrc1pVRkJaU3hIUVVGSE8wRkJRM1JDTEUxQlFVa3NVVUZCVVN4SFFVRkhMRzFDUVVGdFFpeGhRVUZoTEVkQlFVY3NZVUZCWVR0QlFVTXZSQ3hSUVVGTkxFOUJRVTg3UVVGRFlpeFJRVUZOTEZsQlFWa3NUVUZCVFR0QlFVTjRRaXhOUVVGSkxHOUNRVUZ2UWl4TlFVRk5MRkZCUVZFc1MwRkJTenRCUVVNelF5eE5RVUZKTEZsQlFWa3NTVUZCU1N4aFFVRmhPMEZCUTJwRExGZEJRVk1zVjBGQldUdEJRVU5xUWl4UlFVRkpMRkZCUVZFN1FVRkRXaXhSUVVGSkxGbEJRVms3UVVGRGFFSXNVVUZCU1N4bFFVRmxMRWRCUVVjN1FVRkRiRUlzVjBGQlN5eGpRVUZqTEZGQlFWRXNVMEZCVlN4WFFVRlhPMEZCUXpWRExHOUNRVUZaTEdsQ1FVRnBRaXhYUVVGWExHRkJRV0VzVjBGQlZ5eFRRVUZUTEdGQlFXRXNWMEZCVnp0QlFVRkJPMEZCUlhKSExDdENRVUY1UWl4SlFVRkpPMEZCUXpkQ0xHMUNRVUZoTEU5QlFVOHNWMEZCV1R0QlFVRkZMR1ZCUVU4c1IwRkJSeXhIUVVGSExGTkJRVk1zUzBGQlN6dEJRVUZCTEZOQlFWY3NUVUZCVFR0QlFVRkJPMEZCUnpsRkxEWkNRVUYxUWl4SlFVRkpMRmxCUVZrc1QwRkJUeXhwUWtGQmFVSXNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkhha1lzWjBOQlFXZERMRWxCUVVrc1dVRkJXU3hQUVVGUExHbENRVUZwUWp0QlFVTndSU3hOUVVGSkxGRkJRVkU3UVVGRFdpeE5RVUZKTEZkQlFWY3NSMEZCUnp0QlFVTnNRaXhOUVVGSkxHVkJRV1VzUjBGQlJ5eFpRVUZaTEd0Q1FVRnJRaXhKUVVGSkxFZEJRVWNzVDBGQlR6dEJRVU5zUlN4TlFVRkpMREpDUVVFeVFqdEJRVU12UWl4TlFVRkpMRmxCUVZrc1UwRkJVeXhQUVVGUExGTkJRVlVzUjBGQlJ6dEJRVUZGTEZkQlFVOHNSVUZCUlN4TFFVRkxMRmRCUVZjN1FVRkJRVHRCUVVONFJTeFpRVUZWTEZGQlFWRXNVMEZCVlN4VFFVRlRPMEZCUTJwRExGVkJRVTBzUzBGQlN5eFhRVUZaTzBGQlEyNUNMRlZCUVVrc1dVRkJXVHRCUVVOb1FpeFZRVUZKTEZsQlFWa3NVVUZCVVN4TFFVRkxPMEZCUXpkQ0xHbERRVUV5UWl4SlFVRkpMRmRCUVZjN1FVRkRNVU1zYVVOQlFUSkNMRWxCUVVrc1YwRkJWenRCUVVNeFF5eHhRa0ZCWlN4SFFVRkhMRmxCUVZrN1FVRkRPVUlzVlVGQlNTeFBRVUZQTEdOQlFXTXNWMEZCVnp0QlFVTndReXhYUVVGTExFbEJRVWtzVVVGQlVTeFRRVUZWTEU5QlFVODdRVUZET1VJc2IwSkJRVmtzYVVKQlFXbENMRTFCUVUwc1NVRkJTU3hOUVVGTkxFZEJRVWNzVTBGQlV5eE5RVUZOTEVkQlFVYzdRVUZCUVR0QlFVVjBSU3hYUVVGTExFOUJRVThzVVVGQlVTeFRRVUZWTEZGQlFWRTdRVUZEYkVNc1dVRkJTU3hQUVVGUExGVkJRVlU3UVVGRGFrSXNaMEpCUVUwc1NVRkJTU3hYUVVGWExGRkJRVkU3UVVGQlFTeGxRVVUxUWp0QlFVTkVMR05CUVVrc1ZVRkJWU3huUWtGQlowSXNXVUZCV1N4UFFVRlBPMEZCUTJwRUxHbENRVUZQTEVsQlFVa3NVVUZCVVN4VFFVRlZMRXRCUVVzN1FVRkJSU3h0UWtGQlR5eFRRVUZUTEZOQlFWTTdRVUZCUVR0QlFVTTNSQ3hwUWtGQlR5eFBRVUZQTEZGQlFWRXNVMEZCVlN4TFFVRkxPMEZCUTJwRExHOUNRVUZSTEZsQlFWa3NTVUZCU1R0QlFVTjRRaXh4UWtGQlV5eFRRVUZUTzBGQlFVRTdRVUZGZEVJc2FVSkJRVThzU1VGQlNTeFJRVUZSTEZOQlFWVXNVMEZCVXp0QlFVRkZMRzFDUVVGUExGRkJRVkVzV1VGQldUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVY3pSU3hWUVVGSkxHbENRVUZwUWl4UlFVRlJMRXRCUVVzN1FVRkRiRU1zVlVGQlNTeHJRa0ZCYTBJc1VVRkJVU3hMUVVGTExGVkJRVlVzV1VGQldUdEJRVU55UkN4cFEwRkJlVUlzU1VGQlNUdEJRVU0zUWl4alFVRk5MR3RDUVVGclFqdEJRVU40UWl4dFEwRkJNa0k3UVVGRE0wSXNXVUZCU1N4clFrRkJhMElzWVVGQllUdEJRVU51UXl4aFFVRkxMRWxCUVVrc1VVRkJVU3hUUVVGVkxFOUJRVTg3UVVGRE9VSXNNRUpCUVdkQ0xGTkJRVk1zVlVGQlZUdEJRVUZCTzBGQlJYWkRMSGRDUVVGblFpeEpRVUZKTEVOQlFVTXNSMEZCUnl4WlFVRlpPMEZCUTNCRExITkNRVUZqTEVsQlFVa3NRMEZCUXl4SFFVRkhMRmxCUVZrc1dVRkJXU3hMUVVGTExHdENRVUZyUWp0QlFVTnlSU3hqUVVGTkxGTkJRVk03UVVGRFppeFpRVUZKTERCQ1FVRXdRaXhuUWtGQlowSTdRVUZET1VNc1dVRkJTU3g1UWtGQmVVSTdRVUZEZWtJN1FVRkJRVHRCUVVWS0xGbEJRVWs3UVVGRFNpeFpRVUZKTEd0Q1FVRnJRaXhoUVVGaExFOUJRVThzVjBGQldUdEJRVU5zUkN3d1FrRkJaMElzWlVGQlpUdEJRVU12UWl4alFVRkpMR1ZCUVdVN1FVRkRaaXhuUWtGQlNTeDVRa0ZCZVVJN1FVRkRla0lzYTBKQlFVa3NZMEZCWXl4M1FrRkJkMElzUzBGQlN5eE5RVUZOTzBGQlEzSkVMRFJDUVVGakxFdEJRVXNzWVVGQllUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVazFReXhsUVVGUkxHbENRVUZwUWl4UFFVRlBMR05CUVdNc1UwRkJVeXhoUVVOdVJDeGhRVUZoTEZGQlFWRXNhVUpCUVdsQ0xHZENRVUZuUWl4TFFVRkxMRmRCUVZrN1FVRkJSU3hwUWtGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVYzFSaXhWUVVGTkxFdEJRVXNzVTBGQlZTeFZRVUZWTzBGQlF6TkNMRlZCUVVrc1EwRkJReXcwUWtGQk5FSXNRMEZCUXl3eVFrRkJNa0k3UVVGRGVrUXNXVUZCU1N4WlFVRlpMRkZCUVZFc1MwRkJTenRCUVVNM1FpdzBRa0ZCYjBJc1YwRkJWenRCUVVGQk8wRkJSVzVETEhOQ1FVRm5RaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eFpRVUZaTzBGQlEzQkRMRzlDUVVGakxFbEJRVWtzUTBGQlF5eEhRVUZITEZsQlFWa3NXVUZCV1N4SFFVRkhMR0ZCUVdFc1IwRkJSenRCUVVOcVJTeFpRVUZOTEZOQlFWTXNSMEZCUnp0QlFVRkJPMEZCUVVFN1FVRkhNVUlzYzBKQlFXOUNPMEZCUTJoQ0xGZEJRVThzVFVGQlRTeFRRVUZUTEdGQlFXRXNVVUZCVVN4TlFVRk5MRkZCUVZFc1RVRkJUU3hYUVVGWExFdEJRVXNzV1VGRE0wVXNZVUZCWVR0QlFVRkJPMEZCUlhKQ0xGTkJRVThzVjBGQlZ5eExRVUZMTEZkQlFWazdRVUZETDBJc2QwSkJRVzlDTEdOQlFXTTdRVUZCUVR0QlFVRkJPMEZCUnpGRExIVkNRVUYxUWl4WFFVRlhMRmRCUVZjN1FVRkRla01zVFVGQlNTeFBRVUZQTzBGQlFVRXNTVUZEVUN4TFFVRkxPMEZCUVVFc1NVRkRUQ3hMUVVGTE8wRkJRVUVzU1VGRFRDeFJRVUZSTzBGQlFVRTdRVUZGV2l4TlFVRkpPMEZCUTBvc1QwRkJTeXhUUVVGVExGZEJRVmM3UVVGRGNrSXNVVUZCU1N4RFFVRkRMRlZCUVZVN1FVRkRXQ3hYUVVGTExFbEJRVWtzUzBGQlN6dEJRVUZCTzBGQlJYUkNMRTlCUVVzc1UwRkJVeXhYUVVGWE8wRkJRM0pDTEZGQlFVa3NVMEZCVXl4VlFVRlZMRkZCUVZFc1UwRkJVeXhWUVVGVk8wRkJRMnhFTEZGQlFVa3NRMEZCUXl4UlFVRlJPMEZCUTFRc1YwRkJTeXhKUVVGSkxFdEJRVXNzUTBGQlF5eFBRVUZQTzBGQlFVRXNWMEZGY2tJN1FVRkRSQ3hWUVVGSkxGTkJRVk03UVVGQlFTeFJRVU5VTEUxQlFVMDdRVUZCUVN4UlFVTk9MRXRCUVVzN1FVRkJRU3hSUVVOTUxGVkJRVlU3UVVGQlFTeFJRVU5XTEV0QlFVczdRVUZCUVN4UlFVTk1MRXRCUVVzN1FVRkJRU3hSUVVOTUxGRkJRVkU3UVVGQlFUdEJRVVZhTEZWQlEwRXNTMEZCVFN4UlFVRlBMRkZCUVZFc1YwRkJWeXhSUVVGVkxFdEJRVTBzVVVGQlR5eFJRVUZSTEZkQlFWY3NUMEZEY2tVc1QwRkJUeXhSUVVGUkxGTkJRVk1zVDBGQlR5eFJRVUZSTEZGQlFWRXNRMEZCUXl4WlFVTndSRHRCUVVOSExHVkJRVThzVjBGQlZ6dEJRVU5zUWl4aFFVRkxMRTlCUVU4c1MwRkJTenRCUVVGQkxHRkJSV2hDTzBGQlEwUXNXVUZCU1N4aFFVRmhMRTlCUVU4N1FVRkRlRUlzV1VGQlNTeGhRVUZoTEU5QlFVODdRVUZEZUVJc1dVRkJTU3hWUVVGVk8wRkJRMlFzWVVGQlN5eFhRVUZYTEZsQlFWazdRVUZEZUVJc1kwRkJTU3hEUVVGRExGZEJRVmM3UVVGRFdpeHRRa0ZCVHl4SlFVRkpMRXRCUVVzN1FVRkJRVHRCUVVWNFFpeGhRVUZMTEZkQlFWY3NXVUZCV1R0QlFVTjRRaXhqUVVGSkxGTkJRVk1zVjBGQlZ5eFZRVUZWTEZOQlFWTXNWMEZCVnp0QlFVTjBSQ3hqUVVGSkxFTkJRVU03UVVGRFJDeHRRa0ZCVHl4SlFVRkpMRXRCUVVzN1FVRkJRU3h0UWtGRFdDeFBRVUZQTEZGQlFWRXNUMEZCVHp0QlFVTXpRaXh0UWtGQlR5eFBRVUZQTEV0QlFVczdRVUZCUVR0QlFVVXpRaXhaUVVGSkxFOUJRVThzU1VGQlNTeFRRVUZUTEV0QlFVc3NUMEZCVHl4SlFVRkpMRk5CUVZNc1MwRkJTeXhQUVVGUExFOUJRVThzVTBGQlV5eEhRVUZITzBGQlF6VkZMR1ZCUVVzc1QwRkJUeXhMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMYWtNc1UwRkJUenRCUVVGQk8wRkJSVmdzY1VKQlFYRkNMRlZCUVZVc1YwRkJWeXhUUVVGVExGTkJRVk03UVVGRGVFUXNUVUZCU1N4UlFVRlJMRk5CUVZNc1IwRkJSeXhyUWtGQmEwSXNWMEZCVnl4UlFVRlJMRlZCUTNwRUxFTkJRVVVzVTBGQlV5eFJRVUZSTEZOQlFWTXNaVUZCWlN4UlFVRlJMRkZCUTI1RUxFTkJRVVVzWlVGQlpTeFJRVUZSTzBGQlF6ZENMRlZCUVZFc1VVRkJVU3hUUVVGVkxFdEJRVXM3UVVGQlJTeFhRVUZQTEZOQlFWTXNUMEZCVHp0QlFVRkJPMEZCUTNoRUxGTkJRVTg3UVVGQlFUdEJRVVZZTERaQ1FVRTJRaXhYUVVGWExGVkJRVlU3UVVGRE9VTXNUMEZCU3l4WFFVRlhMRkZCUVZFc1UwRkJWU3hYUVVGWE8wRkJRM3BETEZGQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc2FVSkJRV2xDTEZOQlFWTXNXVUZCV1R0QlFVTnVSQ3hyUWtGQldTeFZRVUZWTEZkQlFWY3NWVUZCVlN4WFFVRlhMRk5CUVZNc1ZVRkJWU3hYUVVGWE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNXaEhMRFpDUVVFMlFpeFhRVUZYTEZWQlFWVTdRVUZET1VNc1YwRkJVeXhKUVVGSkxFZEJRVWNzU1VGQlNTeFRRVUZUTEVkQlFVY3NhVUpCUVdsQ0xGRkJRVkVzUlVGQlJTeEhRVUZITzBGQlF6RkVMRkZCUVVrc1dVRkJXU3hUUVVGVExFZEJRVWNzYVVKQlFXbENPMEZCUXpkRExGRkJRVWtzVlVGQlZTeGpRVUZqTEUxQlFVMDdRVUZET1VJc1pVRkJVeXhIUVVGSExHdENRVUZyUWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVreFF5eHJRa0ZCYTBJc1QwRkJUeXhMUVVGTE8wRkJRekZDTEZGQlFVMHNXVUZCV1N4SlFVRkpMRTFCUVUwc1NVRkJTU3hUUVVGVExFTkJRVVVzVVVGQlVTeEpRVUZKTEZGQlFWRXNXVUZCV1N4SlFVRkpPMEZCUVVFN1FVRkZia1lzTWtKQlFUSkNMRWxCUVVrc1QwRkJUeXhWUVVGVk8wRkJRelZETEUxQlFVa3NaVUZCWlR0QlFVTnVRaXhOUVVGSkxHVkJRV1VzVFVGQlRTeE5RVUZOTEd0Q1FVRnJRanRCUVVOcVJDeGxRVUZoTEZGQlFWRXNVMEZCVlN4WFFVRlhPMEZCUTNSRExGRkJRVWtzVVVGQlVTeFRRVUZUTEZsQlFWazdRVUZEYWtNc1VVRkJTU3hWUVVGVkxFMUJRVTA3UVVGRGNFSXNVVUZCU1N4VlFVRlZMR2RDUVVGblFpeG5Ra0ZCWjBJc1ZVRkJWU3hYUVVGWExFbEJRVWtzVDBGQlR5eFBRVUZQTEVOQlFVTXNRMEZCUXl4TlFVRk5MR1ZCUVdVc1YwRkJWeXhQUVVGUExGbEJRVmtzVlVGQlZUdEJRVU53U2l4UlFVRkpMRlZCUVZVN1FVRkRaQ3hoUVVGVExFbEJRVWtzUjBGQlJ5eEpRVUZKTEUxQlFVMHNWMEZCVnl4UlFVRlJMRVZCUVVVc1IwRkJSenRCUVVNNVF5eFZRVUZKTEZkQlFWY3NUVUZCVFN4TlFVRk5MRTFCUVUwc1YwRkJWenRCUVVNMVF5eG5Ra0ZCVlN4VFFVRlRPMEZCUTI1Q0xGVkJRVWtzVVVGQlVTeG5Ra0ZCWjBJc1UwRkJVeXhOUVVGTkxGTkJRVk1zUTBGQlF5eERRVUZETEZOQlFWTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1UwRkJVeXhaUVVGWkxFOUJRVThzVjBGQlZ5eFBRVUZQTEZsQlFWa3NWVUZCVlR0QlFVTTNTU3hqUVVGUkxFdEJRVXM3UVVGQlFUdEJRVVZxUWl4cFFrRkJZU3hoUVVGaExHdENRVUZyUWl4WFFVRlhMRk5CUVZNN1FVRkJRVHRCUVVWd1JTeFRRVUZQTzBGQlFVRTdRVUZGV0N3d1FrRkJNRUlzU1VGQlNTeFBRVUZQTEZWQlFWVTdRVUZETTBNc1MwRkJSeXhSUVVGUkxFMUJRVTBzVlVGQlZUdEJRVU16UWl4TlFVRkpMR1ZCUVdVc1IwRkJSeXhaUVVGWkxHdENRVUZyUWl4SlFVRkpMRTlCUVU4N1FVRkRMMFFzUzBGQlJ5eGpRVUZqTEUxQlFVMHNUVUZCVFN4clFrRkJhMEk3UVVGREwwTXNaMEpCUVdNc1NVRkJTU3hEUVVGRExFZEJRVWNzWVVGQllTeExRVUZMTEdWQlFXVTdRVUZCUVR0QlFVVXpSQ3dyUWtGQkswSXNTVUZCU1N4VlFVRlZPMEZCUTNwRExFMUJRVWtzYTBKQlFXdENMR3RDUVVGclFpeEpRVUZKTEVkQlFVY3NUMEZCVHp0QlFVTjBSQ3hOUVVGSkxFOUJRVThzWTBGQll5eHBRa0ZCYVVJc1IwRkJSenRCUVVNM1F5eFRRVUZQTEVOQlFVVXNUVUZCU3l4SlFVRkpMRlZCUVZVc1MwRkJTeXhQUVVGUExFdEJRVXNzVTBGQlZTeEpRVUZKTzBGQlFVVXNWMEZCVHl4SFFVRkhMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVTg3UVVGQlFUdEJRVUZCTzBGQlJXNUhMRzlEUVVGdlF5eEpRVUZKTEZGQlFWRXNWVUZCVlR0QlFVTjBSQ3hOUVVGSkxHRkJRV0VzVTBGQlV5eEhRVUZITzBGQlF6ZENMRmRCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzVjBGQlZ5eFJRVUZSTEVWQlFVVXNSMEZCUnp0QlFVTjRReXhSUVVGSkxGbEJRVmtzVjBGQlZ6dEJRVU16UWl4UlFVRkpMRkZCUVZFc1UwRkJVeXhaUVVGWk8wRkJRMnBETEU5QlFVY3NZVUZCWVN4WlFVRlpPMEZCUXpWQ0xHRkJRVk1zU1VGQlNTeEhRVUZITEVsQlFVa3NUVUZCVFN4WFFVRlhMRkZCUVZFc1JVRkJSU3hIUVVGSE8wRkJRemxETEZWQlFVa3NXVUZCV1N4TlFVRk5MRmRCUVZjN1FVRkRha01zVlVGQlNTeFZRVUZWTEUxQlFVMHNUVUZCVFN4WFFVRlhPMEZCUTNKRExGVkJRVWtzV1VGQldTeFBRVUZQTEZsQlFWa3NWMEZCVnl4VlFVRlZMRTFCUVUwc1RVRkJUU3hUUVVGVExFdEJRVXNzVDBGQlR6dEJRVU42Uml4VlFVRkpMRTlCUVU4c1dVRkJXVHRCUVVOdVFpeFpRVUZKTEZsQlFWa3NUMEZCVHl4WFFVRlhMRlZCUVZVN1FVRkROVU1zV1VGQlNTeFhRVUZYTzBGQlExZ3NiMEpCUVZVc1QwRkJUenRCUVVOcVFpeHBRa0ZCVHl4UFFVRlBMRmRCUVZjc1ZVRkJWVHRCUVVOdVF5eHBRa0ZCVHl4WFFVRlhMRlZCUVZVc1lVRkJZVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlMzcEVMRTFCUVVrc1QwRkJUeXhqUVVGakxHVkJRV1VzVTBGQlV5eExRVUZMTEZWQlFWVXNZMEZETlVRc1EwRkJReXh2UWtGQmIwSXNTMEZCU3l4VlFVRlZMR05CUTNCRExGRkJRVkVzY1VKQlFYRkNMRzFDUVVGdFFpeFJRVUZSTEhGQ1FVTjRSQ3hIUVVGSExFOUJRVThzVlVGQlZTeFZRVUZWTEUxQlFVMHNhMEpCUVd0Q0xFdEJRVXNzUzBGQlN6dEJRVU5vUlN4UFFVRkhMR0ZCUVdFN1FVRkJRVHRCUVVGQk8wRkJSM2hDTERCQ1FVRXdRaXh0UWtGQmJVSTdRVUZEZWtNc1UwRkJUeXhyUWtGQmEwSXNUVUZCVFN4TFFVRkxMRWxCUVVrc1UwRkJWU3hQUVVGUExGVkJRVlU3UVVGREwwUXNXVUZCVVN4TlFVRk5PMEZCUTJRc1VVRkJTU3hQUVVGUExFMUJRVTBzVVVGQlVTeG5Ra0ZCWjBJN1FVRkRla01zVVVGQlNTeFZRVUZWTEUxQlFVMHNTMEZCU3l4UlFVRlJMRXRCUVVzc1RVRkJUU3hqUVVGakxFZEJRVWNzVFVGQlRTeFBRVUZQTzBGQlF6RkZMRmRCUVU4c1owSkJRV2RDTEUxQlFVMHNWMEZCVnl4TlFVRk5MRXRCUVVzc1MwRkJTeXhSUVVGUkxFdEJRVXNzUzBGQlN5eFJRVUZSTEU5QlFVOHNTMEZCU3l4UlFVRlJMRkZCUVZFc1ZVRkJWU3hoUVVGaE8wRkJRVUU3UVVGQlFUdEJRVWszU1N4SlFVRkpMRlZCUVZrc1YwRkJXVHRCUVVONFFpeHpRa0ZCYlVJN1FVRkJRVHRCUVVWdVFpeFhRVUZSTEZWQlFWVXNiVUpCUVcxQ0xGTkJRVlVzVVVGQlVTeFhRVUZYTzBGQlF6bEVMRk5CUVVzc1VVRkJVU3hSUVVGUkxGTkJRVlVzVjBGQlZ6dEJRVU4wUXl4VlFVRkpMRTlCUVU4c1pVRkJaU3hOUVVGTk8wRkJRelZDTEZsQlFVa3NWVUZCVlN4cFFrRkJhVUlzVDBGQlR6dEJRVU4wUXl4WlFVRkpMRlZCUVZVc1VVRkJVVHRCUVVOMFFpeFpRVUZKTEZGQlFWRTdRVUZEVWl4blFrRkJUU3hKUVVGSkxGZEJRVmNzVDBGQlR6dEJRVU5vUXl4blFrRkJVU3hSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVU16UWl4alFVRkpMRWxCUVVrN1FVRkRTaXhyUWtGQlRTeEpRVUZKTEZkQlFWY3NUMEZCVHp0QlFVTm9ReXhqUVVGSkxFTkJRVU1zU1VGQlNUdEJRVU5NTEd0Q1FVRk5MRWxCUVVrc1YwRkJWeXhQUVVGUE8wRkJRVUU3UVVGRmNFTXNhMEpCUVZVc1lVRkJZU3hyUWtGQmEwSXNWMEZCVnl4VFFVRlRPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWHBGTEZkQlFWRXNWVUZCVlN4VFFVRlRMRk5CUVZVc1VVRkJVVHRCUVVONlF5eFJRVUZKTEV0QlFVc3NTMEZCU3p0QlFVTmtMRk5CUVVzc1MwRkJTeXhsUVVGbExFdEJRVXNzUzBGQlN5eGxRVU12UWl4UFFVRlBMRXRCUVVzc1MwRkJTeXhqUVVGakxGVkJReTlDTzBGQlEwb3NVVUZCU1N4WFFVRlhMRWRCUVVjN1FVRkRiRUlzVVVGQlNTeGhRVUZoTzBGQlEycENMRkZCUVVrc1YwRkJWenRCUVVObUxHRkJRVk1zVVVGQlVTeFRRVUZWTEZOQlFWTTdRVUZEYUVNc1lVRkJUeXhaUVVGWkxGRkJRVkVzUzBGQlN6dEJRVU5vUXl4cFFrRkJXU3hSUVVGUkxFdEJRVXNzVjBGQlZ6dEJRVU53UXl4alFVRlJMR2xDUVVGcFFpeFpRVUZaTzBGQlFVRTdRVUZGZWtNc1QwRkJSeXhaUVVGWk8wRkJRMllzYjBKQlFXZENMRWxCUVVrc1EwRkJReXhIUVVGSExGbEJRVmtzU1VGQlNTeEhRVUZITEZsQlFWazdRVUZEZGtRc2EwSkJRV01zU1VGQlNTeERRVUZETEVkQlFVY3NXVUZCV1N4SlFVRkpMRWRCUVVjc1dVRkJXU3hYUVVGWExFdEJRVXNzUzBGQlN5eFRRVUZUTEV0QlFVc3NWMEZCVnp0QlFVTnVSeXhQUVVGSExHTkJRV01zUzBGQlN6dEJRVU4wUWl4WFFVRlBPMEZCUVVFN1FVRkZXQ3hYUVVGUkxGVkJRVlVzVlVGQlZTeFRRVUZWTEdsQ1FVRnBRanRCUVVOdVJDeFRRVUZMTEV0QlFVc3NhVUpCUVdsQ08wRkJRek5DTEZkQlFVODdRVUZCUVR0QlFVVllMRk5CUVU4N1FVRkJRVHRCUVVkWUxHdERRVUZyUXl4SlFVRkpPMEZCUTJ4RExGTkJRVThzY1VKQlFYRkNMRkZCUVZFc1YwRkJWeXhyUWtGQmFVSXNaVUZCWlR0QlFVTXpSU3hUUVVGTExFdEJRVXM3UVVGRFZpeFRRVUZMTEU5QlFVODdRVUZCUVN4TlFVTlNMRk5CUVZNN1FVRkJRU3hOUVVOVUxHTkJRV003UVVGQlFTeE5RVU5rTEZWQlFWVTdRVUZCUVN4TlFVTldMRkZCUVZFN1FVRkJRU3hOUVVOU0xHZENRVUZuUWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVzMVFpeDVRa0ZCZVVJc1YwRkJWeXhoUVVGaE8wRkJRemRETEUxQlFVa3NXVUZCV1N4VlFVRlZPMEZCUXpGQ0xFMUJRVWtzUTBGQlF5eFhRVUZYTzBGQlExb3NaMEpCUVZrc1ZVRkJWU3huUWtGQlowSXNTVUZCU1N4UlFVRlJMRmxCUVZrN1FVRkJRU3hOUVVNeFJDeFJRVUZSTzBGQlFVRXNUVUZEVWp0QlFVRkJMRTFCUTBFN1FVRkJRVHRCUVVWS0xHTkJRVlVzVVVGQlVTeEhRVUZITEU5QlFVOHNRMEZCUlN4VFFVRlRPMEZCUVVFN1FVRkZNME1zVTBGQlR5eFZRVUZWTEUxQlFVMDdRVUZCUVR0QlFVVXpRaXcwUWtGQk5FSXNWMEZCVnp0QlFVTnVReXhUUVVGUExHRkJRV0VzVDBGQlR5eFZRVUZWTEdOQlFXTTdRVUZCUVR0QlFVVjJSQ3d3UWtGQk1FSXNTMEZCU1R0QlFVTXhRaXhOUVVGSkxGbEJRVmtzU1VGQlJ5eFhRVUZYTEdOQlFXTXNTVUZCUnp0QlFVTXZReXhUUVVGUExHMUNRVUZ0UWl4aFFVTndRaXhSUVVGUkxGRkJRVkVzVlVGQlZTeGhRVUZoTEV0QlFVc3NVMEZCVlN4UFFVRlBPMEZCUXpORUxGZEJRVThzVFVGRFJpeEpRVUZKTEZOQlFWVXNUVUZCVFR0QlFVRkZMR0ZCUVU4c1MwRkJTenRCUVVGQkxFOUJRMnhETEU5QlFVOHNVMEZCVlN4TlFVRk5PMEZCUVVVc1lVRkJUeXhUUVVGVE8wRkJRVUU3UVVGQlFTeFBRVVZvUkN4blFrRkJaMElzVjBGQlZ5eGhRVUZoTEdWQlFXVTdRVUZCUVR0QlFVVnFSU3cwUWtGQk5FSXNTMEZCU1N4TlFVRk5PMEZCUTJ4RExFMUJRVWtzV1VGQldTeEpRVUZITEZkQlFWY3NZMEZCWXl4SlFVRkhPMEZCUXk5RExFZEJRVU1zYlVKQlFXMUNMR05CUTJoQ0xGTkJRVk1zWTBGRFZDeG5Ra0ZCWjBJc1YwRkJWeXhoUVVGaExFbEJRVWtzUTBGQlJTeFBRVUZqTEUxQlFVMDdRVUZCUVR0QlFVVXhSU3cwUWtGQk5FSXNTMEZCU1N4TlFVRk5PMEZCUTJ4RExFMUJRVWtzV1VGQldTeEpRVUZITEZkQlFWY3NZMEZCWXl4SlFVRkhPMEZCUXk5RExFZEJRVU1zYlVKQlFXMUNMR05CUTJoQ0xGTkJRVk1zWTBGRFZDeG5Ra0ZCWjBJc1YwRkJWeXhoUVVGaExFOUJRVThzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZIYmtVc1lVRkJZU3hKUVVGSk8wRkJRMklzVTBGQlR5eFRRVUZUTEZkQlFWazdRVUZEZUVJc1VVRkJTU3hoUVVGaE8wRkJRMnBDTEZkQlFVODdRVUZCUVR0QlFVRkJPMEZCU1dZc2JVSkJRVzFDTEVsQlFVazdRVUZEYmtJc1RVRkJTU3hSUVVGUkxFZEJRVWM3UVVGRFppeE5RVUZKTEZsQlFWa3NSMEZCUnl4TlFVRk5PMEZCUTNwQ0xFMUJRVWtzVFVGQlRTeHBRa0ZCYVVJc1IwRkJSenRCUVVNeFFpeFhRVUZQTEUxQlFVMHNaVUZCWlN4TFFVRkxMRmRCUVZrN1FVRkJSU3hoUVVGUExFMUJRVTBzWTBGRGVFUXNWVUZCVlN4TlFVRk5MR1ZCUTJoQ08wRkJRVUU3UVVGRFVpeFhRVUZWTEU5QlFVMHNZMEZCWXl4bFFVRmxPMEZCUXpkRExGRkJRVTBzWjBKQlFXZENPMEZCUTNSQ0xGRkJRVTBzWTBGQll6dEJRVU53UWl4UlFVRk5MR1ZCUVdVN1FVRkRja0lzVFVGQlNTeHBRa0ZCYVVJc1RVRkJUU3huUWtGRE0wSXNjVUpCUVhGQ0xFMUJRVTBzWVVGQllUdEJRVU40UXl4VFFVRlBMR0ZCUVdFc1MwRkJTeXhEUVVGRExFMUJRVTBzWlVGQlpTeEpRVUZKTEdGQlFXRXNVMEZCVlN4VFFVRlRMRkZCUVZFN1FVRkRia1lzVVVGQlNTeERRVUZETzBGQlEwUXNXVUZCVFN4SlFVRkpMRmRCUVZjN1FVRkRla0lzVVVGQlNTeFRRVUZUTEVkQlFVYzdRVUZEYUVJc1VVRkJTU3hOUVVGTkxFMUJRVTBzWVVGRFdpeFZRVUZWTEV0QlFVc3NWVUZEWml4VlFVRlZMRXRCUVVzc1VVRkJVU3hMUVVGTExFMUJRVTBzUjBGQlJ5eFJRVUZSTzBGQlEycEVMRkZCUVVrc1EwRkJRenRCUVVORUxGbEJRVTBzU1VGQlNTeFhRVUZYTzBGQlEzcENMRkZCUVVrc1ZVRkJWU3h0UWtGQmJVSTdRVUZEYWtNc1VVRkJTU3haUVVGWkxFdEJRVXNzUjBGQlJ6dEJRVU40UWl4UlFVRkpMR3RDUVVGclFpeExRVUZMTEZOQlFWVXNSMEZCUnp0QlFVTndReXd5UWtGQmNVSXNTVUZCU1R0QlFVTjZRaXhWUVVGSkxFMUJRVTBzWTBGQll5eERRVUZETEVkQlFVY3NVMEZCVXl4alFVRmpPMEZCUXk5RExGbEJRVWtzVlVGQlZUdEJRVU5rTERKQ1FVRnRRanRCUVVOdVFpeFpRVUZKTEU5QlFVODdRVUZEV0N4WlFVRkpMRk5CUVZNc1ZVRkJWU3hsUVVGbE8wRkJRM1JETEdWQlFVOHNXVUZCV1N4UFFVRlBMRlZCUVZVc1MwRkJTeXhYUVVGWk8wRkJRMnBFTEdsQ1FVRlBMRWxCUVVrc1YwRkJWeXhsUVVGbExHTkJRV01zVTBGQlV6dEJRVUZCTzBGQlFVRXNZVUZITDBRN1FVRkRSQ3d5UWtGQmJVSXNWVUZCVlN4dFFrRkJiVUk3UVVGRGFFUXNXVUZCU1N4VFFVRlRMRVZCUVVVc1lVRkJZU3hMUVVGTExFbEJRVWtzUjBGQlJ5eE5RVUZOTEVsQlFVa3NSVUZCUlR0QlFVTndSQ3h4UWtGQllTeFRRVUZUTzBGQlEzUkNMRmRCUVVjc1VVRkJVU3hKUVVGSk8wRkJRMllzY1VKQlFXRXNTVUZCU1N4VFFVRlRMRWxCUVVrc2IwSkJRVzlDTzBGQlFVRTdRVUZCUVN4UFFVVjJSRHRCUVVOSUxGRkJRVWtzV1VGQldTeExRVUZMTEZkQlFWazdRVUZETjBJc01rSkJRWEZDTzBGQlEzSkNMRlZCUVVrc1VVRkJVU3hIUVVGSExGRkJRVkVzU1VGQlNUdEJRVU16UWl4VlFVRkpMRzFDUVVGdFFpeE5RVUZOTEUxQlFVMDdRVUZEYmtNc1ZVRkJTU3hwUWtGQmFVSXNVMEZCVXp0QlFVTXhRaXhaUVVGSk8wRkJRMEVzWTBGQlNTeFhRVUZYTEUxQlFVMHNXVUZCV1N4dlFrRkJiMElzYlVKQlFXMUNPMEZCUTNoRkxHTkJRVWtzVFVGQlRUdEJRVU5PTERaQ1FVRnBRaXhKUVVGSkxFOUJRVTg3UVVGQlFTeGxRVU16UWp0QlFVTkVMSFZEUVVFeVFpeEpRVUZKTEVkQlFVY3NWMEZCVnp0QlFVTTNReXhuUWtGQlNTeERRVUZETEhOQ1FVRnpRaXhKUVVGSkxGZEJRVmM3UVVGRGRFTXNjMEpCUVZFc1MwRkJTenRCUVVGQk8wRkJRVUU3UVVGSGNrSXNiVU5CUVhsQ0xFbEJRVWs3UVVGQlFTeHBRa0ZGTVVJc1IwRkJVRHRCUVVGQk8wRkJSVW9zYTBKQlFWa3NTMEZCU3p0QlFVTnFRaXhaUVVGTkxHdENRVUZyUWl4TFFVRkxMRk5CUVZVc1NVRkJTVHRCUVVOMlF5eGpRVUZOTEZWQlFWVTdRVUZEYUVJc1YwRkJSeXhIUVVGSExHbENRVUZwUWl4TFFVRkxPMEZCUVVFN1FVRkZhRU1zV1VGQlRTeFZRVUZWTEV0QlFVc3NVMEZCVlN4SlFVRkpPMEZCUXk5Q0xGZEJRVWNzUjBGQlJ5eFRRVUZUTEV0QlFVczdRVUZCUVR0QlFVVjRRaXhWUVVGSk8wRkJRMEVzTWtKQlFXMUNMRWRCUVVjc1QwRkJUenRCUVVOcVF6dEJRVUZCTEU5QlEwUTdRVUZCUVN4UFFVTkdMRXRCUVVzc1YwRkJXVHRCUVVOMFFpeFZRVUZOTEc5Q1FVRnZRanRCUVVNeFFpeFhRVUZQTEdGQlFXRXNVVUZCVVN4SlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFOUJRVThzUzBGQlN5d3dRa0ZCTUVJN1FVRkRPVVVzVlVGQlNTeE5RVUZOTEd0Q1FVRnJRaXhUUVVGVExFZEJRVWM3UVVGRGNFTXNXVUZCU1N4aFFVRmhMRTFCUVUwc2EwSkJRV3RDTEU5QlFVOHNhVUpCUVdsQ08wRkJRMnBGTEdOQlFVMHNiMEpCUVc5Q08wRkJRekZDTEdWQlFVOHNZVUZCWVN4UlFVRlJMRWxCUVVrc1lVRkJZU3hMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVUZCTEV0QlJ6TkVMRkZCUVZFc1YwRkJXVHRCUVVOdVFpeFZRVUZOTEc5Q1FVRnZRanRCUVVGQkxFdEJRek5DTEV0QlFVc3NWMEZCV1R0QlFVTm9RaXhWUVVGTkxHZENRVUZuUWp0QlFVTjBRaXhYUVVGUE8wRkJRVUVzUzBGRFVpeE5RVUZOTEZOQlFWVXNTMEZCU3p0QlFVTndRaXhSUVVGSk8wRkJRMEVzTkVKQlFYTkNMRzFDUVVGdFFqdEJRVUZCTEdGQlJYUkRMRWRCUVZBN1FVRkJRVHRCUVVOQkxGVkJRVTBzWjBKQlFXZENPMEZCUTNSQ0xFOUJRVWM3UVVGRFNDeFZRVUZOTEdOQlFXTTdRVUZEY0VJc1YwRkJUeXhWUVVGVkxFMUJRVTA3UVVGQlFTeExRVU40UWl4UlFVRlJMRmRCUVZrN1FVRkRia0lzVlVGQlRTeGxRVUZsTzBGQlEzSkNPMEZCUVVFN1FVRkJRVHRCUVVsU0xIVkNRVUYxUWl4VlFVRlZPMEZCUXpkQ0xFMUJRVWtzVjBGQlZ5eFRRVUZWTEZGQlFWRTdRVUZCUlN4WFFVRlBMRk5CUVZNc1MwRkJTenRCUVVGQkxFdEJRVmtzVlVGQlZTeFRRVUZWTEU5QlFVODdRVUZCUlN4WFFVRlBMRk5CUVZNc1RVRkJUVHRCUVVGQkxFdEJRVmNzV1VGQldTeExRVUZMTEZkQlFWY3NWVUZCVlN4TFFVRkxPMEZCUXpkTExHZENRVUZqTEZOQlFWTTdRVUZEYmtJc1YwRkJUeXhUUVVGVkxFdEJRVXM3UVVGRGJFSXNWVUZCU1N4UFFVRlBMRkZCUVZFc1RVRkJUU3hSUVVGUkxFdEJRVXM3UVVGRGRFTXNZVUZCVHl4TFFVRkxMRTlCUVU4c1VVRkRaQ3hEUVVGRExGTkJRVk1zVDBGQlR5eE5RVUZOTEZOQlFWTXNZVUZETjBJc1VVRkJVU3hUUVVGVExGRkJRVkVzU1VGQlNTeFBRVUZQTEV0QlFVc3NWMEZCVnl4WFFVRlhMRlZCUVZVc1UwRkRla1VzVFVGQlRTeExRVUZMTEZkQlFWYzdRVUZCUVR0QlFVRkJPMEZCUjNSRExGTkJRVThzUzBGQlN6dEJRVUZCTzBGQlIyaENMR2REUVVGblF5eE5RVUZOTEdGQlFXRXNWMEZCVnp0QlFVTXhSQ3hOUVVGSkxFbEJRVWtzVlVGQlZUdEJRVU5zUWl4TlFVRkpMRWxCUVVrN1FVRkRTaXhWUVVGTkxFbEJRVWtzVjBGQlZ5eG5Ra0ZCWjBJN1FVRkRla01zVFVGQlNTeFBRVUZQTEVsQlFVa3NUVUZCVFN4SlFVRkpPMEZCUTNwQ0xGTkJRVThzUlVGQlJUdEJRVU5NTEZOQlFVc3NTVUZCU1N4TFFVRkxMRlZCUVZVN1FVRkROVUlzWTBGQldTeExRVUZMTzBGQlEycENMRTFCUVVrc1UwRkJVeXhSUVVGUk8wRkJRM0pDTEZOQlFVOHNRMEZCUXl4TlFVRk5MRkZCUVZFN1FVRkJRVHRCUVVVeFFpd3JRa0ZCSzBJc1NVRkJTU3hOUVVGTkxGbEJRVmtzYlVKQlFXMUNMRmRCUVZjN1FVRkRMMFVzVTBGQlR5eGhRVUZoTEZWQlFWVXNTMEZCU3l4WFFVRlpPMEZCUXpORExGRkJRVWtzV1VGQldTeEpRVUZKTEdGQlFXRTdRVUZEYWtNc1VVRkJTU3hSUVVGUkxFZEJRVWNzYlVKQlFXMUNMRTFCUVUwc1dVRkJXU3hIUVVGSExGZEJRVmM3UVVGRGJFVXNVVUZCU1N4WlFVRlpPMEZCUVVFc1RVRkRXanRCUVVGQkxFMUJRMEU3UVVGQlFUdEJRVVZLTEZGQlFVa3NiVUpCUVcxQ08wRkJRMjVDTEZsQlFVMHNWMEZCVnl4clFrRkJhMEk3UVVGQlFTeFhRVVZzUXp0QlFVTkVMRmxCUVUwN1FVRkJRVHRCUVVWV0xGRkJRVWtzYlVKQlFXMUNMR2RDUVVGblFqdEJRVU4yUXl4UlFVRkpMR3RDUVVGclFqdEJRVU5zUWp0QlFVRkJPMEZCUlVvc1VVRkJTVHRCUVVOS0xGRkJRVWtzYTBKQlFXdENMR0ZCUVdFc1QwRkJUeXhYUVVGWk8wRkJRMnhFTEc5Q1FVRmpMRlZCUVZVc1MwRkJTeXhQUVVGUE8wRkJRM0JETEZWQlFVa3NZVUZCWVR0QlFVTmlMRmxCUVVrc2EwSkJRV3RDTzBGQlEyeENMR05CUVVrc1kwRkJZeXgzUWtGQmQwSXNTMEZCU3l4TlFVRk5PMEZCUTNKRUxITkNRVUZaTEV0QlFVc3NZVUZCWVR0QlFVRkJMRzFDUVVWNlFpeFBRVUZQTEZsQlFWa3NVMEZCVXl4alFVRmpMRTlCUVU4c1dVRkJXU3hWUVVGVkxGbEJRVms3UVVGRGVFWXNkMEpCUVdNc1kwRkJZenRCUVVGQk8wRkJRVUU3UVVGQlFTeFBRVWR5UXp0QlFVTklMRmRCUVZFc1owSkJRV1VzVDBGQlR5eFpRVUZaTEZOQlFWTXNZVUZETDBNc1lVRkJZU3hSUVVGUkxHRkJRV0VzUzBGQlN5eFRRVUZWTEVkQlFVYzdRVUZCUlN4aFFVRlBMRTFCUVUwc1UwRkRMMFFzU1VGRFJTeFZRVUZWTEVsQlFVa3NWMEZCVnl4blFrRkJaMEk3UVVGQlFTeFRRVU0zUXl4blFrRkJaMElzUzBGQlN5eFhRVUZaTzBGQlFVVXNZVUZCVHp0QlFVRkJMRkZCUVdsQ0xFdEJRVXNzVTBGQlZTeEhRVUZITzBGQlF5OUZMRlZCUVVrN1FVRkRRU3hqUVVGTk8wRkJRMVlzWVVGQlR5eE5RVUZOTEZsQlFWa3NTMEZCU3l4WFFVRlpPMEZCUVVVc1pVRkJUenRCUVVGQk8wRkJRVUVzVDBGRGNFUXNUVUZCVFN4VFFVRlZMRWRCUVVjN1FVRkRiRUlzV1VGQlRTeFJRVUZSTzBGQlEyUXNZVUZCVHl4VlFVRlZPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTemRDTEdGQlFXRXNSMEZCUnl4UFFVRlBMRTlCUVU4N1FVRkRNVUlzVFVGQlNTeFRRVUZUTEZGQlFWRXNTMEZCU3l4RlFVRkZMRlZCUVZVc1EwRkJRenRCUVVOMlF5eFhRVUZUTEVsQlFVa3NSMEZCUnl4SlFVRkpMRTlCUVU4c1JVRkJSVHRCUVVONlFpeFhRVUZQTEV0QlFVczdRVUZEYUVJc1UwRkJUenRCUVVGQk8wRkJSVmdzYzBOQlFYTkRMRTFCUVUwN1FVRkRlRU1zVTBGQlR5eFRRVUZUTEZOQlFWTXNTVUZCU1N4UFFVRlBMRU5CUVVVc1QwRkJUeXhUUVVGVkxGZEJRVmM3UVVGRE1VUXNVVUZCU1N4UlFVRlJMRXRCUVVzc1RVRkJUVHRCUVVOMlFpeFJRVUZKTEZOQlFWTXNUVUZCVFR0QlFVTnVRaXhSUVVGSkxHTkJRV003UVVGRGJFSXNVVUZCU1N4dlFrRkJiMEk3UVVGRGVFSXNLMEpCUVRKQ0xGTkJRVk1zVTBGQlV5eGxRVUZsTzBGQlEzaEVMRlZCUVVrc1pVRkJaU3huUWtGQlowSTdRVUZEYmtNc1ZVRkJTU3haUVVGaExGbEJRVmtzWjBKQlFXZENMRmxCUVZrc2FVSkJRV2xDTzBGQlF6RkZMRlZCUVVrc1dVRkJXU3hYUVVGWExFOUJRVThzU1VGQlNTeFBRVUZQTEZsQlFWa3NWMEZCVnl4SlFVRkpMRkZCUVZFN1FVRkRhRVlzVlVGQlNTeFpRVUZaTEZWQlFWVTdRVUZETVVJc1ZVRkJTU3hsUVVGbExGTkJRVk1zVTBGQlV5eEpRVUZKTEdkQ1FVRm5RanRCUVVGQkxGRkJRVVU3UVVGQlFTeFJRVUZ6UWl4alFVRmpMRU5CUVVNc1lVRkJZU3hqUVVGak8wRkJRVUVzVVVGQll6dEJRVUZCTEZGQlEzSkpPMEZCUVVFc1VVRkJjMElzV1VGQldTeG5Ra0ZCWjBJN1FVRkJRU3hSUVVGVkxGRkJRVkVzUTBGQlF5eGhRVUZoTEdOQlFXTTdRVUZCUVR0QlFVTndSeXhuUWtGQlZTeExRVUZMTzBGQlEyWXNWVUZCU1N4RFFVRkRMR0ZCUVdFc1kwRkJZenRCUVVNMVFpd3dRa0ZCYTBJc1MwRkJTenRCUVVGQk8wRkJSVE5DTEZWQlFVa3NXVUZCV1N4SFFVRkhPMEZCUTJZc1dVRkJTU3hwUWtGQmFVSXNZMEZCWXl4SlFVTXZRaXhSUVVGUkxFdEJRMUlzVVVGQlVTeE5RVUZOTEVkQlFVY3NXVUZCV1R0QlFVTnFReXd3UWtGQmEwSXNaMEpCUVdkQ0xGVkJRVlVzUjBGQlJ6dEJRVUZCTzBGQlJXNUVMR2RDUVVGVkxFdEJRVXNzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4bFFVRlBMRVZCUVVVc1ZVRkJWU3hGUVVGRk8wRkJRVUU3UVVGRGRFUXNZVUZCVHp0QlFVRkJPMEZCUlZnc1VVRkJTU3hoUVVGaExHdENRVUZyUWl4UFFVRlBMRmRCUVZjc1UwRkJVeXhIUVVGSExFOUJRVTg3UVVGRGVFVXNaMEpCUVZrc1UwRkJVeXhEUVVGRE8wRkJRM1JDTEdGQlFWTXNTMEZCU3l4SFFVRkhMRTFCUVVzc1QwRkJUeXhUUVVGVExFdEJRVXNzU1VGQlJ5eFJRVUZSTEUxQlFVMDdRVUZEZUVRc1ZVRkJTU3hSUVVGUkxFbEJRVWM3UVVGRFppeDNRa0ZCYTBJc1RVRkJUU3hUUVVGVExFZEJRVWM3UVVGQlFUdEJRVVY0UXl3eVFrRkJkVUlzVTBGQlV6dEJRVU0xUWl4VlFVRkpMRlZCUVZNc1dVRkJXU3huUWtGQlowSTdRVUZEZWtNc1lVRkJUeXhYUVVGVkxGRkJRVTg3UVVGQlFUdEJRVVUxUWl3MFFrRkJkMElzVDBGQlR5eFRRVUZUTzBGQlEzQkRMR0ZCUVU4N1FVRkJRU3hSUVVOSUxFMUJRVTBzVFVGQlRTeFRRVUZUTEVsQlEycENMRWxCUTBFc1RVRkJUVHRCUVVGQkxGRkJRMVlzVDBGQlR5eEpRVUZKTEUxQlFVMHNUMEZCVHl4TlFVRk5MRmxCUVZrc1MwRkJTeXhWUVVGVkxFdEJRVXNzVTBGQlV6dEJRVUZCTEZGQlEzWkZMRmRCUVZjN1FVRkJRU3hSUVVOWUxFOUJRVThzU1VGQlNTeE5RVUZOTEU5QlFVOHNUVUZCVFN4WlFVRlpMRXRCUVVzc1ZVRkJWU3hMUVVGTExGTkJRVk03UVVGQlFTeFJRVU4yUlN4WFFVRlhPMEZCUVVFN1FVRkJRVHRCUVVkdVFpdzRRa0ZCTUVJc1MwRkJTenRCUVVNelFpeFZRVUZKTEZOQlFWRXNTVUZCU1N4TlFVRk5PMEZCUTNSQ0xHRkJRVThzVDBGQlRTeFpRVUZaTEZOQlFWTXNVMEZCVXl4SlFVRkpMRTFCUVUwc1EwRkJSU3hQUVVGUE8wRkJRVUVzVVVGRGRFUXNUMEZCVHp0QlFVRkJMRkZCUTFBc1QwRkJUeXhsUVVGbExFbEJRVWtzVFVGQlRTeFBRVUZQTEU5QlFVMDdRVUZCUVN4WlFVTXhRenRCUVVGQk8wRkJSV1lzVVVGQlNTeFRRVUZUTEZOQlFWTXNVMEZCVXl4SlFVRkpMRkZCUVZFN1FVRkJRU3hOUVVGRkxGRkJRVkVzVTBGQlV5eFRRVUZUTEVsQlFVa3NVMEZCVXl4RFFVRkZMRmxCUVhkQ0xGTkJRVk1zYlVKQlFXMUNMRzFDUVVGdFFqdEJRVUZCTEUxQlFXdENMRTlCUVU4c1UwRkJWU3hMUVVGTE8wRkJRemRNTEdWQlFVOHNUVUZCVFN4TlFVRk5MR2xDUVVGcFFqdEJRVUZCTzBGQlFVRXNUVUZGZUVNc1QwRkJUeXhUUVVGVkxFdEJRVXM3UVVGRGJFSXNaVUZCVHl4TlFVRk5MRTFCUVUwc2FVSkJRV2xDTzBGQlFVRTdRVUZCUVN4TlFVVjRReXhaUVVGWkxGTkJRVlVzUzBGQlN6dEJRVU4yUWl4WlFVRkpMRTFCUVVzc1NVRkJTU3hOUVVGTkxFOUJRVThzVlVGQlZTeEpRVUZITEZOQlFWTXNXVUZCV1N4SlFVRkhMRmRCUVZjc1dVRkJXU3hKUVVGSE8wRkJRM3BHTEZsQlFVa3NRMEZCUXp0QlFVTkVMR2xDUVVGUExFMUJRVTBzVjBGQlZ6dEJRVU0xUWl4eFEwRkJOa0lzVVVGQlVUdEJRVU5xUXl3MlFrRkJiVUlzUzBGQlN6dEJRVU53UWl4dFFrRkJUeXhQUVVOSUxFOUJRVThzVTBGQlV5eEpRVUZKTEV0QlFVc3NTVUZCU1N4VlFVRlZMRXRCUVVzc1ZVRkJWU3hMUVVGTExGTkJRVk1zV1VGRGNFVXNTVUZCU1N4VFFVTkJMRTlCUVU4c1UwRkJVeXhKUVVGSkxFOUJRVThzUzBGQlN5eEpRVUZKTEZWQlFWVXNTMEZCU3l4VlFVRlZMRXRCUVVzc1UwRkJVeXhaUVVNelJTeFBRVUZQTzBGQlFVRTdRVUZGYmtJc1kwRkJTU3huUWtGQlowSXNUMEZCVHl4UFFVRlBMRkZCUVZFN1FVRkJRU3haUVVOMFF5eFZRVUZWTEVOQlFVVXNUMEZCVHp0QlFVRkJMRmxCUTI1Q0xHOUNRVUZ2UWp0QlFVRkJMR05CUTJoQ0xFOUJRVThzVTBGQlZTeExRVUZMTEdGQlFWazdRVUZET1VJc2RVSkJRVThzYlVKQlFXMUNMRWxCUVVrc1MwRkJTeXhMUVVGTExGTkJRVk1zVlVGQlZUdEJRVUZCTzBGQlFVRTdRVUZCUVN4WlFVZHVSU3hMUVVGTE8wRkJRVUVzWTBGRFJDeExRVUZMTEZkQlFWazdRVUZEWWl4dlFrRkJTU3hOUVVGTkxFOUJRVTg3UVVGRGFrSXNkVUpCUVU4c1kwRkJZeXhKUVVOcVFpeEpRVUZKTEV0QlEwb3NTVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkJRVHRCUVVGQk8wRkJRVUVzV1VGSGVrSXNUMEZCVHp0QlFVRkJMR05CUTBnc1MwRkJTeXhYUVVGWk8wRkJRMklzZFVKQlFVOHNUMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVreFFpeHBRa0ZCVHp0QlFVRkJPMEZCUlZnc1pVRkJUeXhOUVVGTkxGZEJRVmNzYVVKQlFXbENMRTFCUTNCRExFdEJRVXNzVTBGQlZTeFJRVUZSTzBGQlFVVXNhVUpCUVU4c1ZVRkJWU3h2UWtGQmIwSTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkZNMFVzVjBGQlR6dEJRVUZCTzBGQlFVRTdRVUZIYmtJc1NVRkJTU3g1UWtGQmVVSTdRVUZCUVN4RlFVTjZRaXhQUVVGUE8wRkJRVUVzUlVGRFVDeE5RVUZOTzBGQlFVRXNSVUZEVGl4UFFVRlBPMEZCUVVFc1JVRkRVQ3hSUVVGUk8wRkJRVUU3UVVGSFdpd3dRa0ZCTUVJc1dVRkJXU3hMUVVGTE8wRkJRM1pETEUxQlFVa3NTVUZCU1N4VFFVRlRPMEZCUTJJc1YwRkJUeXhKUVVGSk8wRkJRMllzVTBGQlR5eEpRVUZKTEZGQlFWRXNTVUZCU1N4UFFVRlBMRWxCUVVrc1YwRkJWenRCUVVGQk8wRkJSMnBFTEVsQlFVa3NhMEpCUVd0Q08wRkJRVUVzUlVGRGJFSXNUMEZCVHp0QlFVRkJMRVZCUTFBc1RVRkJUVHRCUVVGQkxFVkJRMDRzVDBGQlR6dEJRVUZCTEVWQlExQXNVVUZCVVN4VFFVRlZMRlZCUVZVN1FVRkJSU3hYUVVGUkxGTkJRVk1zVTBGQlV5eEpRVUZKTEZkQlFWY3NRMEZCUlN4UFFVRlBMRk5CUVZVc1YwRkJWenRCUVVNM1JpeFZRVUZKTEZsQlFWa3NVMEZCVXl4TlFVRk5PMEZCUXk5Q0xGVkJRVWtzWVVGQllTeFZRVUZWTEU5QlFVODdRVUZEYkVNc1ZVRkJTU3hyUWtGQmEwSXNVMEZCVXl4VFFVRlRMRWxCUVVrc1dVRkJXU3hEUVVGRkxGRkJRVkVzVTBGQlZTeExRVUZMTzBGQlEzcEZMRmxCUVVrc1ZVRkJWU3hKUVVGSk8wRkJRMnhDTEZsQlFVa3NUVUZCU3l4UlFVRlJMRTFCUVUwc1YwRkJWeXhOUVVGTkxGZEJRVmNzU1VGQlJ5eFZRVUZWTEZkQlFWY3NTVUZCUnl4VlFVRlZMRmRCUVZjc1NVRkJSenRCUVVOMFJ5eG5Ra0ZCVVN4SlFVRkpPMEZCUVVFc1pVRkRTRHRCUVVORUxHZENRVUZKTEZOQlFWTXNVMEZCVXp0QlFVTnNRanRCUVVOS0xHMUNRVUZQTEZGQlFWRXNVMEZCVXl4aFFVRmhMRmRCUVZrN1FVRkJSU3h4UWtGQlR5eGxRVUZsTzBGQlFVRXNaVUZCVXp0QlFVRkJMR1ZCUTJwR08wRkJRMFFzWjBKQlFVa3NVMEZCVXl4VFFVRlRMRTlCUVU4c1UwRkJVeXhUUVVGVE8wRkJRek5ETzBGQlEwb3NiVUpCUVU4c1VVRkJVU3hUUVVGVExHRkJRV0VzVjBGQldUdEJRVUZGTEhGQ1FVRlBMR1ZCUVdVN1FVRkJRU3hsUVVGVE8wRkJRVUVzWlVGRGFrWTdRVUZEUkN4blFrRkJTU3hUUVVGVExGTkJRVk03UVVGRGJFSTdRVUZEU2l4dFFrRkJUeXhSUVVGUkxGTkJRVk1zWVVGQllTeFhRVUZaTzBGQlFVVXNjVUpCUVU4c1pVRkJaVHRCUVVGQkxHVkJRVk03UVVGQlFTeGxRVU5xUmp0QlFVTkVMR2RDUVVGSkxGTkJRVk1zVTBGQlV6dEJRVU5zUWp0QlFVTktMRzFDUVVGUExGRkJRVkVzVTBGQlV5eGhRVUZoTEZkQlFWazdRVUZCUlN4eFFrRkJUeXhaUVVGWk8wRkJRVUVzWlVGQlV6dEJRVUZCTzBGQlJYWkdMR1ZCUVU4c1ZVRkJWU3hQUVVGUE8wRkJRM2hDTEdkRFFVRjNRaXhOUVVGTE8wRkJRM3BDTEdOQlFVa3NWMEZCVlN4SlFVRkpPMEZCUTJ4Q0xHTkJRVWtzVVVGQlR5eExRVUZKTEZGQlFWRXNhVUpCUVdsQ0xGbEJRVms3UVVGRGNFUXNZMEZCU1N4RFFVRkRPMEZCUTBRc2EwSkJRVTBzU1VGQlNTeE5RVUZOTzBGQlEzQkNMR2xDUVVGTkxFdEJRVWtzVTBGQlV5eFRRVUZUTEV0QlFVa3NVMEZCVXl4UlFVRlJMRk5CUVZNc1UwRkJVeXhKUVVGSkxFOUJRVTBzUTBGQlJTeE5RVUZOTEZWQlFWVXNVMEZCVXl4SlFVRkpPMEZCUXpWSExHTkJRVWtzUzBGQlNTeFRRVUZUTzBGQlEySXNhVUpCUVVrc1UwRkJVeXhqUVVGakxFbEJRVWtzUzBGQlNUdEJRVU4yUXl4alFVRkpMRXRCUVVrN1FVRkRTaXhwUWtGQlNTeFBRVUZQTEdOQlFXTXNTVUZCU1N4TFFVRkpPMEZCUTNKRExHbENRVUZQTEd0Q1FVRnJRaXhYUVVGWExFMUJRVXNzVDBGQlRTeExRVUZMTEZOQlFWVXNaMEpCUVdkQ08wRkJRekZGTEdkQ1FVRkpMRmRCUVZjc1RVRkJTeXhKUVVGSkxGTkJRVlVzUzBGQlN5eEhRVUZITzBGQlEzUkRMR3RDUVVGSkxHZENRVUZuUWl4bFFVRmxPMEZCUTI1RExHdENRVUZKTEUxQlFVMHNRMEZCUlN4VFFVRlRMRTFCUVUwc1YwRkJWenRCUVVOMFF5eHJRa0ZCU1N4TFFVRkpMRk5CUVZNc1ZVRkJWVHRCUVVOMlFpeDVRa0ZCVXl4TFFVRkxMRXRCUVVzc1MwRkJTeXhMUVVGTExHVkJRV1U3UVVGQlFTeDVRa0ZGZGtNc1MwRkJTU3hUUVVGVExGTkJRVk1zYTBKQlFXdENMRkZCUVZjN1FVRkRlRVFzYjBKQlFVa3NjMEpCUVhOQ0xGTkJRVk1zUzBGQlN5eExRVUZMTEV0QlFVc3NTMEZCU3l4TFFVRkpMRTlCUVU4c1NVRkJTVHRCUVVOMFJTeHZRa0ZCU1N4UFFVRlBMRkZCUVZFc2RVSkJRWFZDTEUxQlFVMDdRVUZETlVNc2QwSkJRVTA3UVVGRFRpeDFRa0ZCU1N4TFFVRkxMRXRCUVVzN1FVRkRaQ3h6UWtGQlNTeERRVUZETEZkQlFWY3NWVUZCVlR0QlFVTjBRaXhwUTBGQllTeExRVUZKTEU5QlFVOHNTVUZCU1N4WFFVRlhMRk5CUVZNN1FVRkJRVHRCUVVGQk8wRkJRVUVzY1VKQlNYWkVPMEZCUTBRc2IwSkJRVWtzWVVGQllTeGpRVUZqTEdWQlFXVXNTMEZCU1N4UFFVRlBPMEZCUTNwRUxHOUNRVUZKTEhOQ1FVRnpRaXhUUVVGVExFdEJRVXNzUzBGQlN5eExRVUZMTEZsQlFWa3NTMEZCU3l4bFFVRmxPMEZCUTJ4R0xHOUNRVUZKTEhGQ1FVRnhRanRCUVVOeVFpeHpRa0ZCU1N4dFFrRkJiVUlzUzBGQlNTeFBRVUZQTzBGQlEyeERMSGxDUVVGUExFdEJRVXNzY1VKQlFYRkNMRkZCUVZFc1UwRkJWU3hUUVVGVE8wRkJRM2hFTEhkQ1FVRkpMRTlCUVU4c2EwSkJRV3RDTEZWQlFWVTdRVUZEYmtNc2RVTkJRV2xDTEZkQlFWY3NiMEpCUVc5Q08wRkJRVUVzTWtKQlJTOURPMEZCUTBRc2JVTkJRV0VzYTBKQlFXdENMRk5CUVZNc2IwSkJRVzlDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxOVVVzY1VKQlFVODdRVUZCUVR0QlFVVllMRzFDUVVGUExGVkJRVlVzVDBGQlR5eE5RVUZMTEV0QlFVc3NVMEZCVlN4TFFVRkpPMEZCUXpWRExHdENRVUZKTEZkQlFWY3NTVUZCUnl4VlFVRlZMRlZCUVZVc1NVRkJSeXhUUVVGVExHTkJRV01zU1VGQlJ5eGhRVUZoTEdGQlFXRXNTVUZCUnp0QlFVTm9SeXgxUWtGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4TlFVRkxMRkZCUVZFc1JVRkJSU3hIUVVGSE8wRkJRMnhETEc5Q1FVRkpMRlZCUVZVc1ZVRkJWU3hSUVVGUkxFdEJRVXNzVFVGQlN6dEJRVU14UXl4dlFrRkJTU3hOUVVGTkxGTkJRVk03UVVGRGJrSXNiMEpCUVVrc1YwRkJWeXhOUVVGTk8wRkJRMnBDTEhOQ1FVRkpMRmRCUVZjc1NVRkJTU3hSUVVGUkxGTkJRVk03UVVGQlFTeDFRa0ZGYmtNN1FVRkRSQ3h6UWtGQlNTeGhRVUZoTEVsQlFVa3NWVUZCVlN4TFFVRkpMRk5CUVZNc1UwRkJVeXhsUVVGbExFdEJRMmhGTEV0QlFVa3NUMEZCVHl4TFFVTllPMEZCUVVFN1FVRkJRVHRCUVVsYUxIRkNRVUZQTEVOQlFVVXNWVUZCYjBJc1UwRkJhMElzWVVGQk1FSTdRVUZCUVN4bFFVTXhSU3hOUVVGTkxGTkJRVlVzVDBGQlR6dEJRVU4wUWl4MVFrRkJVeXhSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVUZGTEhWQ1FVRlBMRWxCUVVrc1YwRkJWeXhKUVVGSkxGRkJRVkU3UVVGQlFUdEJRVU53UlN4eFFrRkJUeXhSUVVGUkxFOUJRVTg3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKYkVNc05rSkJRWEZDTEUxQlFVczdRVUZEZEVJc2FVSkJRVThzWjBKQlFXZENMRXRCUVVrc1QwRkJUeXhMUVVGSkxFOUJRVTg3UVVGQlFUdEJRVVZxUkN4cFEwRkJlVUlzVDBGQlR5eFBRVUZQTEU5QlFVODdRVUZETVVNc2FVSkJRVThzVlVGQlZTeE5RVUZOTEVOQlFVVXNUMEZCWXl4UlFVRlJMRTlCUVU4c1QwRkJUeXhEUVVGRkxFOUJRVThzV1VGQldTeFJRVUZuUWl4UlFVTTNSaXhMUVVGTExGTkJRVlVzUzBGQlNUdEJRVU53UWl4blFrRkJTU3hUUVVGVExFbEJRVWM3UVVGRGFFSXNiVUpCUVU4c1pVRkJaU3hEUVVGRkxFMUJRVTBzVlVGQlZTeE5RVUZOTEZGQlFWRXNVVUZCWjBJc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGRGRFWXNhMEpCUVVrc1NVRkJTU3hqUVVGak8wRkJRMnhDTEhWQ1FVRlBMRkZCUVZFc1QwRkJUeXhKUVVGSkxGTkJRVk03UVVGRGRrTXNhMEpCUVVrc1QwRkJUeXhUUVVGVExFOUJRVTg3UVVGRGRrSXNkVUpCUVU4c1EwRkJSU3hWUVVGVkxFbEJRVWtzWVVGQllTeEhRVUZITEZsQlFWazdRVUZCUVN4eFFrRkZiRVE3UVVGRFJDeDFRa0ZCVHl4blFrRkJaMElzVDBGQlR5eFRRVUZUTEZOQlFWTXNTVUZCU1N4UlFVRlJMRU5CUVVVc1QwRkJUeXhQUVVGUExFOUJRVThzVTBGQlV5eEpRVUZKTEZkQlFWY3NVVUZCVXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTk5Va3NZVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVkdVFpd3lRa0ZCTWtJc1QwRkJUeXhMUVVGTExHVkJRV1U3UVVGRGJFUXNVMEZCVHl4SlFVRkpMRk5CUVZNc1VVRkRaQ3hSUVVGUkxGRkJRVkVzVFVGRGFFSXNUVUZCVFN4UlFVRlJMRU5CUVVVc1QwRkJUeXhKUVVGSkxFOUJRVThzVFVGQlRTeGxRVUZsTEU5QlFVODdRVUZCUVR0QlFVZDRSU3hKUVVGSk8wRkJRMG9zWVVGQllTeEhRVUZITEVkQlFVYzdRVUZEWml4TlFVRkpPMEZCUTBFc1YwRkJUeXhMUVVGTExFZEJRVWM3UVVGRGJrSXNUVUZCU1N4WlFVRlpMRkZCUVZFN1FVRkRlRUlzVFVGQlNTeERRVUZETzBGQlEwUXNWVUZCVFN4SlFVRkpMRmRCUVZjN1FVRkRla0lzVTBGQlR5eFRRVUZWTEVsQlFVY3NTVUZCUnp0QlFVTnVRaXhSUVVGSk8wRkJRMEVzWVVGQlR5eE5RVUZMTEZGQlFWRXNUVUZCU3l4UFFVRlBMRTFCUVUwc1ZVRkJWU3hKUVVGSkxFbEJRVWM3UVVGQlFTeGhRVVZ3UkN4TFFVRlFPMEZCUTBrc1lVRkJUenRCUVVGQk8wRkJRVUU3UVVGSFppeFRRVUZQTEV0QlFVc3NSMEZCUnp0QlFVRkJPMEZCUjI1Q0xHbERRVUZwUXl4UFFVRk5MRTlCUVU4c1QwRkJUenRCUVVOcVJDeE5RVUZKTzBGQlEwRXNVVUZCU1N4RFFVRkRPMEZCUTBRc1lVRkJUenRCUVVOWUxGRkJRVWtzVFVGQlRTeExRVUZMTEZOQlFWTXNUVUZCU3p0QlFVTjZRaXhoUVVGUE8wRkJRMWdzVVVGQlNTeFRRVUZUTzBGQlEySXNZVUZCVXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hIUVVGSExFbEJRVWtzVFVGQlRTeExRVUZMTEZWQlFWVXNTVUZCU1N4TlFVRkxMRkZCUVZFc1JVRkJSU3hIUVVGSE8wRkJRMnhGTEZWQlFVa3NTVUZCU1N4TlFVRk5MRXRCUVVzc1NVRkJTU3hOUVVGTExGRkJRVkU3UVVGRGFFTTdRVUZEU2l4aFFVRlBMRXRCUVVzc1VVRkJVU3hWUVVGVkxFMUJRVTBzVDBGQlR5eE5RVUZOTEUxQlFVMHNUMEZCVHp0QlFVTTVSQ3hSUVVGRk8wRkJRVUU3UVVGRlRpeFhRVUZQTEU5QlFVOHNWMEZCVnl4TlFVRkxMRk5CUVZNc1UwRkJVenRCUVVGQkxGZEJSVGRETEV0QlFWQTdRVUZEU1N4WFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVkbUxFbEJRVWtzWjBOQlFXZERPMEZCUVVFc1JVRkRhRU1zVDBGQlR6dEJRVUZCTEVWQlExQXNUMEZCVHp0QlFVRkJMRVZCUTFBc1VVRkJVU3hUUVVGVkxFMUJRVTA3UVVGRGNFSXNWMEZCVHp0QlFVRkJMRTFCUTBnc1QwRkJUeXhUUVVGVkxGZEJRVmM3UVVGRGVFSXNXVUZCU1N4UlFVRlJMRXRCUVVzc1RVRkJUVHRCUVVOMlFpeGxRVUZQTEZOQlFWTXNVMEZCVXl4SlFVRkpMRkZCUVZFc1EwRkJSU3hUUVVGVExGTkJRVlVzUzBGQlN6dEJRVU4yUkN4alFVRkpMRU5CUVVNc1NVRkJTU3hQUVVGUE8wRkJRMW9zYlVKQlFVOHNUVUZCVFN4UlFVRlJPMEZCUVVFN1FVRkZla0lzWTBGQlNTeGxRVUZsTEhkQ1FVRjNRaXhKUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEZkQlFWY3NTVUZCU1N4VlFVRlZPMEZCUTNoR0xHTkJRVWtzWTBGQll6dEJRVU5rTEcxQ1FVRlBMR0ZCUVdFc1VVRkJVVHRCUVVGQk8wRkJSV2hETEdsQ1FVRlBMRTFCUVUwc1VVRkJVU3hMUVVGTExFdEJRVXNzVTBGQlZTeExRVUZMTzBGQlF6RkRMR2RDUVVGSkxFMUJRVTBzV1VGQldUdEJRVUZCTEdOQlEyeENMRTFCUVUwc1NVRkJTVHRCUVVGQkxHTkJRMVlzVVVGQlVTeEpRVUZKTEZWQlFWVXNWVUZCVlN4VlFVRlZMRTlCUVU4N1FVRkJRVHRCUVVWeVJDeHRRa0ZCVHp0QlFVRkJPMEZCUVVFc1YwRkZXaXhSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVU4wUWl4alFVRkpMRWxCUVVrc1UwRkJVenRCUVVOaUxHZENRVUZKTEUxQlFVMHNXVUZCV1R0QlFVTXhRaXhwUWtGQlR5eE5RVUZOTEU5QlFVODdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJUelZETEVsQlFVazdRVUZEU2l4elFrRkJjMElzVFVGQlRUdEJRVU40UWl4VFFVRlBMRU5CUVVVc1YwRkJWVHRCUVVGQk8wRkJSWFpDTEVsQlFVa3NWMEZCVnl4VFFVRlZMRmxCUVZrc1NVRkJTVHRCUVVOeVF5eE5RVUZKTEUxQlFVMDdRVUZEVGl4WFFVRlBMRTFCUVUwc1ZVRkJWU3hUUVVGVExFTkJRVVVzUjBGQlJ5eEhRVUZITEUxQlFVMHNXVUZCV1N4SlFVRkpMRlZCUVZVc1UwRkJVeXhKUVVGSkxFdEJRVXNzWTBGQlpTeERRVUZGTEVkQlFVYzdRVUZCUVN4VFFVVTNSenRCUVVORUxGRkJRVWtzUzBGQlN5eEpRVUZKTzBGQlEySXNVVUZCU1N4alFVRmxMRTlCUVU4c1dVRkJZVHRCUVVOdVF5eGhRVUZQTEVsQlFVazdRVUZCUVR0QlFVVm1MRmRCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMllzVFVGQlRTeFRRVUZUTEZkQlFWa3NUVUZCU3p0QlFVRkJMRVZCUTNoQ0xFdEJRVXNzVTBGQlZTeFZRVUZWTzBGQlEzSkNMR2RDUVVGWkxFMUJRVTA3UVVGRGJFSXNWMEZCVHp0QlFVRkJPMEZCUVVFc1JVRkZXQ3hSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVU51UWl4aFFVRlRMRTFCUVUwc1MwRkJTenRCUVVOd1FpeFhRVUZQTzBGQlFVRTdRVUZCUVN4RlFVVllMRk5CUVZNc1UwRkJWU3hQUVVGTk8wRkJRM0pDTEZGQlFVa3NVVUZCVVR0QlFVTmFMRlZCUVVzc1VVRkJVU3hUUVVGVkxFdEJRVXM3UVVGQlJTeGhRVUZQTEZOQlFWTXNUMEZCVHl4TFFVRkxPMEZCUVVFN1FVRkRNVVFzVjBGQlR6dEJRVUZCTzBGQlFVRXNSMEZIWml4SFFVRkhMR3RDUVVGclFpeFhRVUZaTzBGQlF6ZENMRk5CUVU4c2IwSkJRVzlDTzBGQlFVRXNSMEZGTDBJN1FVRkRTaXhyUWtGQmEwSXNVVUZCVVN4TlFVRk5MRWxCUVVrN1FVRkRhRU1zVFVGQlNTeFBRVUZQTEVsQlFVa3NUVUZCVFR0QlFVTnlRaXhOUVVGSkxFMUJRVTA3UVVGRFRqdEJRVU5LTEUxQlFVa3NUMEZCVHp0QlFVTlFMRlZCUVUwN1FVRkRWaXhOUVVGSkxHRkJRV0U3UVVGRFlpeFhRVUZQTEU5QlFVOHNVVUZCVVN4RFFVRkZMRTFCUVZrc1NVRkJVU3hIUVVGSE8wRkJRMjVFTEUxQlFVa3NUMEZCVHl4UFFVRlBPMEZCUTJ4Q0xFMUJRVWtzVVVGQlVTeFBRVUZQTzBGQlEyNUNMRTFCUVVrc1NVRkJTU3hKUVVGSkxFOUJRVThzVVVGQlVTeEhRVUZITzBGQlF6RkNMRmRCUTAwc1UwRkJVeXhOUVVGTkxFMUJRVTBzVFVGRGNFSXNUMEZCVHl4SlFVRkpMRU5CUVVVc1RVRkJXU3hKUVVGUkxFZEJRVWNzUjBGQlJ5eEhRVUZITEUxQlFVMHNSMEZCUnp0QlFVTXhSQ3hYUVVGUExGVkJRVlU3UVVGQlFUdEJRVVZ5UWl4TlFVRkpMRWxCUVVrc1RVRkJUU3hQUVVGUExFMUJRVTBzUjBGQlJ6dEJRVU14UWl4WlFVTk5MRk5CUVZNc1QwRkJUeXhOUVVGTkxFMUJRM0pDTEU5QlFVOHNTVUZCU1N4RFFVRkZMRTFCUVZrc1NVRkJVU3hIUVVGSExFZEJRVWNzUjBGQlJ5eE5RVUZOTEVkQlFVYzdRVUZETVVRc1YwRkJUeXhWUVVGVk8wRkJRVUU3UVVGRmNrSXNUVUZCU1N4SlFVRkpMRTFCUVUwc1QwRkJUeXhSUVVGUkxFZEJRVWM3UVVGRE5VSXNWMEZCVHl4UFFVRlBPMEZCUTJRc1YwRkJUeXhKUVVGSk8wRkJRMWdzVjBGQlR5eEpRVUZKTEZGQlFWRXNUVUZCVFN4SlFVRkpMRWxCUVVrN1FVRkJRVHRCUVVWeVF5eE5RVUZKTEVsQlFVa3NTVUZCU1N4UFFVRlBMRTFCUVUwc1IwRkJSenRCUVVONFFpeFhRVUZQTEV0QlFVczdRVUZEV2l4WFFVRlBMRWxCUVVrN1FVRkRXQ3hYUVVGUExFbEJRVWtzVDBGQlR5eEpRVUZKTEU5QlFVOHNSVUZCUlN4SlFVRkpMRWxCUVVrN1FVRkJRVHRCUVVVelF5eE5RVUZKTEdsQ1FVRnBRaXhEUVVGRExFOUJRVTg3UVVGRE4wSXNUVUZCU1N4UlFVRlJMRU5CUVVNc1QwRkJUeXhIUVVGSE8wRkJRMjVDTEdkQ1FVRlpMRkZCUVZFN1FVRkJRVHRCUVVWNFFpeE5RVUZKTEZOQlFWTXNaMEpCUVdkQ08wRkJRM3BDTEdkQ1FVRlpMRkZCUVZFN1FVRkJRVHRCUVVGQk8wRkJSelZDTEhGQ1FVRnhRaXhSUVVGUkxGRkJRVkU3UVVGRGFrTXNkMEpCUVhOQ0xGTkJRVkVzUzBGQlNUdEJRVU01UWl4UlFVRkpMRTlCUVU4c1NVRkJSeXhOUVVGTkxFdEJRVXNzU1VGQlJ5eEpRVUZKTEVsQlFVa3NTVUZCUnl4SFFVRkhMRWxCUVVrc1NVRkJSenRCUVVOcVJDeGhRVUZUTEZOQlFWRXNUVUZCVFR0QlFVTjJRaXhSUVVGSk8wRkJRMEVzYlVKQlFXRXNVMEZCVVR0QlFVTjZRaXhSUVVGSk8wRkJRMEVzYlVKQlFXRXNVMEZCVVR0QlFVRkJPMEZCUlRkQ0xFMUJRVWtzUTBGQlF5eGhRVUZoTzBGQlEyUXNhVUpCUVdFc1VVRkJVVHRCUVVGQk8wRkJSVGRDTEhWQ1FVRjFRaXhYUVVGWExGZEJRVmM3UVVGRGVrTXNUVUZCU1N4TFFVRkxMRzlDUVVGdlFqdEJRVU0zUWl4TlFVRkpMR05CUVdNc1IwRkJSenRCUVVOeVFpeE5RVUZKTEZsQlFWazdRVUZEV2l4WFFVRlBPMEZCUTFnc1RVRkJTU3hKUVVGSkxGbEJRVms3UVVGRGNFSXNUVUZCU1N4TFFVRkxMRzlDUVVGdlFqdEJRVU0zUWl4TlFVRkpMR05CUVdNc1IwRkJSeXhMUVVGTExFVkJRVVU3UVVGRE5VSXNUVUZCU1N4SlFVRkpMRmxCUVZrN1FVRkRjRUlzVTBGQlR5eERRVUZETEZsQlFWa3NVVUZCVVN4RFFVRkRMRmxCUVZrc1RVRkJUVHRCUVVNelF5eFJRVUZKTEVsQlFVa3NSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhMUVVGTExFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVXNVMEZCVXp0QlFVTXZReXhoUVVGUE8wRkJRMWdzVVVGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlN4UlFVRlJMRWxCUTJZc1NVRkJTeXhsUVVGakxFZEJRVWNzUzBGQlN5eEZRVUZGTEU5QlFVOHNVVUZEY0VNc1NVRkJTeXhsUVVGakxFZEJRVWNzUzBGQlN5eEZRVUZGTEU5QlFVODdRVUZCUVR0QlFVVXZReXhUUVVGUE8wRkJRVUU3UVVGRldDdzJRa0ZCTmtJc1RVRkJUVHRCUVVNdlFpeE5RVUZKTEZGQlFWRXNZVUZCWVN4UlFVRlJMRTlCUVU4c1EwRkJSU3hIUVVGSExFZEJRVWNzUjBGQlJ6dEJRVU51UkN4VFFVRlBPMEZCUVVFc1NVRkRTQ3hOUVVGTkxGTkJRVlVzUzBGQlN6dEJRVU5xUWl4VlFVRkpMR05CUVdNc1ZVRkJWU3hUUVVGVE8wRkJRM0pETEdGQlFVOHNUMEZCVHp0QlFVTldMR2RDUVVGUkxFMUJRVTA3UVVGQlFTeGxRVU5NTzBGQlEwUXNhMEpCUVUwc1NVRkJTVHRCUVVOV0xHZENRVUZKTEdGQlFXRTdRVUZEWWl4eFFrRkJUeXhOUVVGTkxFVkJRVVVzUzBGQlN5eEpRVUZKTEV0QlFVc3NUVUZCVFN4RlFVRkZMRkZCUVZFN1FVRkRla01zZDBKQlFWRXNRMEZCUlN4SlFVRkpMRTlCUVU4c1IwRkJSeXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEhRVUZITzBGQlFVRXNiVUpCUlhwRE8wRkJRMFFzY1VKQlFVOHNUVUZCVFN4RlFVRkZPMEZCUTFnc2QwSkJRVkVzUTBGQlJTeEpRVUZKTEU5QlFVOHNSMEZCUnl4TlFVRk5MRVZCUVVVc1IwRkJSeXhIUVVGSE8wRkJRVUU3UVVGQlFTeGxRVVUzUXp0QlFVTkVMR3RDUVVGTkxFbEJRVWs3UVVGRFZpeG5Ra0ZCU1N4RFFVRkRMR1ZCUVdVc1NVRkJTU3hMUVVGTExFMUJRVTBzUlVGQlJTeFBRVUZQTzBGQlEzaERMSEZDUVVGUExFTkJRVVVzVDBGQlR5eE5RVUZOTEVkQlFVY3NUVUZCVFR0QlFVRkJMR1ZCUTJ4RE8wRkJRMFFzWjBKQlFVa3NUVUZCVFN4RlFVRkZMRWRCUVVjN1FVRkRXQ3h2UWtGQlRTeEpRVUZKTzBGQlExWXNjMEpCUVZFc1EwRkJSU3hKUVVGSkxFOUJRVThzUjBGQlJ5eE5RVUZOTEVWQlFVVXNSMEZCUnl4SFFVRkhPMEZCUTNSRE8wRkJRVUU3UVVGQlFTeGxRVVZJTzBGQlEwUXNiMEpCUVZFc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGSE1VSXNZVUZCVHl4RFFVRkZMRTFCUVUwN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSk0wSXNiVUpCUVcxQ0xGRkJRVkU3UVVGRGRrSXNUVUZCU1N4TFFVRkpPMEZCUTFJc1RVRkJTU3hQUVVGVkxGTkJRVXNzVDBGQlR5eFBRVUZQTEZGQlFWRXNVVUZCVHl4VFFVRlRMRk5CUVZNc1NVRkJSeXhOUVVGTkxFdEJRVkVzVVVGQlN5eFBRVUZQTEU5QlFVOHNVVUZCVVN4UFFVRlBMRk5CUVZNc1UwRkJVeXhIUVVGSExFMUJRVTA3UVVGRGFFb3NUVUZCU1N4SlFVRkpMRTlCUVU4c1NVRkJTU3hOUVVGTkxFOUJRVThzUzBGQlN5eE5RVUZOTzBGQlF6TkRMRTFCUVVrc1IwRkJSenRCUVVOSUxGRkJRVWtzU1VGQlNTeE5RVUZOTEUxQlFVMHNUVUZCVFR0QlFVTXhRaXhSUVVGSkxGbEJRVmtzVTBGQlV5eEpRVUZKTzBGQlF6ZENMRkZCUVVrc1pVRkJaU3hQUVVGUE8wRkJRekZDTEZkQlFVOHNUMEZCVHl4aFFVRmhPMEZCUXpOQ0xGZEJRVThzUzBGQlN5eGhRVUZoTzBGQlEzcENMRmRCUVU4c1MwRkJTeXhoUVVGaE8wRkJRM3BDTEdOQlFWVXNTMEZCU3l4aFFVRmhPMEZCUXpWQ0xGZEJRVThzUzBGQlN6dEJRVU5hTEdOQlFWVXNTVUZCU1N4aFFVRmhPMEZCUVVFN1FVRkZMMElzVTBGQlR5eEpRVUZKTEdGQlFXRTdRVUZCUVR0QlFVVTFRaXh6UWtGQmMwSXNTMEZCU1R0QlFVTjBRaXhOUVVGSkxFbEJRVWtzU1VGQlJ5eEhRVUZITEVsQlFVa3NTVUZCUnp0QlFVTnlRaXhUUVVGUkxFdEJRVXNzU1VGQlNTeExRVUZMTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVc1MwRkJTeXhGUVVGRkxFbEJRVXNzU1VGQlNTeEZRVUZGTEVsQlFVa3NTMEZCU3p0QlFVRkJPMEZCUjJoRkxFbEJRVWtzTUVKQlFUQkNPMEZCUVVFc1JVRkRNVUlzVDBGQlR6dEJRVUZCTEVWQlExQXNUMEZCVHp0QlFVRkJMRVZCUTFBc1VVRkJVU3hUUVVGVkxFMUJRVTA3UVVGRGNFSXNVVUZCU1N4VFFVRlRMRXRCUVVzc1QwRkJUenRCUVVONlFpeFJRVUZKTEdGQlFXRXNTVUZCU1N4VFFVRlRMRXRCUVVzc1UwRkJVeXhMUVVGTE8wRkJRMnBFTEZkQlFVOHNVMEZCVXl4VFFVRlRMRWxCUVVrc1QwRkJUeXhEUVVGRkxFOUJRVThzVTBGQlZTeFhRVUZYTzBGQlF6RkVMRlZCUVVrc1VVRkJVU3hMUVVGTExFMUJRVTA3UVVGRGRrSXNWVUZCU1N4VFFVRlRMRTFCUVUwN1FVRkRia0lzVlVGQlNTeGhRVUZoTEU5QlFVODdRVUZEZUVJc1ZVRkJTU3hoUVVGaExGZEJRVmNzV1VGQldTeFhRVUZYTEZkQlFWYzdRVUZET1VRc1ZVRkJTU3hoUVVGaExGTkJRVk1zVTBGQlV5eEpRVUZKTEZGQlFWRXNRMEZCUlN4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVOb1JTeFpRVUZKTEZGQlFWRXNTVUZCU1R0QlFVTm9RaXhaUVVGSkxHVkJRV1VzVFVGQlRTeG5Ra0ZCYVVJc1QwRkJUU3hsUVVGbE8wRkJReTlFTEZsQlFVa3NZMEZCWXl4VFFVRlZMRmRCUVZjN1FVRkRia01zWTBGQlNTeFBRVUZQTEZkQlFWY3NVMEZCVXl4TlFVRk5MRmxCUVZrc1RVRkJUVHRCUVVOMlJDeHBRa0ZCVVN4aFFVRmhMRk5CUTJoQ0xHTkJRV0VzVVVGQlVTeEpRVUZKTzBGQlFVRTdRVUZGYkVNc1dVRkJTU3hoUVVGaExGbEJRVms3UVVGRE4wSXNXVUZCU1N4bFFVRmxMRmxCUVZrN1FVRkRMMElzV1VGQlNTeFBRVUZQTEVsQlFVazdRVUZEWml4WlFVRkpMRTFCUVVzc1NVRkJTU3hUUVVGVExHZENRVU5vUWl4RFFVRkRMRWxCUVVrc1UwRkRUQ3hKUVVGSkxGTkJRVk1zVjBGRFZDeERRVUZETEVsQlFVa3NVVUZEVEN4SlFVRkpMRTlCUVU4c1UwRkJVeXhMUVVOb1FpeERRVUZETEVsQlFVa3NTVUZCU1N4VlFVTlVMRWxCUVVrc1VVRkJUeXhKUVVGSExFbEJRVWtzVlVGQlZTeEpRVUZITzBGQlF6ZERMRmxCUVVrc1YwRkJWeXhKUVVGSkxFMUJRVTA3UVVGRGVrSXNaVUZCVHl4TlFVRk5MRTlCUVU4c1MwRkJTeXhMUVVGTExGTkJRVlVzUzBGQlN6dEJRVU42UXl4alFVRkpMRkZCUVZFc1VVRkJUenRCUVVObUxHZENRVUZKTEZOQlFWTTdRVUZEVkN4elFrRkJUeXhKUVVGSk8wRkJRMllzZFVKQlFWY3NVVUZCVVR0QlFVTnVRaXhuUWtGQlNTeFZRVUZWTEhkQ1FVRjNRaXhQUVVGTk8wRkJRelZETEdkQ1FVRkpMRU5CUVVNc1YwRkJWeXhUUVVGVExFOUJRVTg3UVVGRE5VSXNNa0pCUVdFc1VVRkJVVHRCUVVGQk8wRkJSWHBDTEdkQ1FVRkpMRmRCUVZjc1UwRkJVenRCUVVOd1FpeHRRMEZCY1VJc1lVRkJZU3hSUVVGUkxGTkJRVk03UVVGQlFUdEJRVUZCTEhGQ1FVZHNSQ3hQUVVGTk8wRkJRMWdzWjBKQlFVa3NVVUZCVVN4RFFVRkZMRTFCUVUwc1RVRkJTeXhQUVVGUExFbEJRVWtzVFVGQlN6dEJRVU42UXl4NVFrRkJZU3hKUVVGSk8wRkJRMnBDTEhWQ1FVRlhMRWxCUVVrN1FVRkJRU3hwUWtGRlpEdEJRVU5FTEhWQ1FVRlhMRWxCUVVrN1FVRkRaaXg1UWtGQllTeEpRVUZKTzBGQlEycENMRzFDUVVGUExGRkJRVkVzVVVGQlVTeFRRVUZWTEV0QlFVczdRVUZCUlN4eFFrRkJUeXhaUVVGWkxFbEJRVWtzVFVGQlRTeEpRVUZKTzBGQlFVRTdRVUZCUVR0QlFVVTNSU3hwUWtGQlR6dEJRVUZCTzBGQlFVRTdRVUZIYmtJc1ZVRkJTU3hYUVVGWExGTkJRVlVzUzBGQlNUdEJRVU42UWl4WlFVRkpMRWxCUVVrN1FVRkRVaXhaUVVGSkxFdEJRVXNzU1VGQlJ5eFBRVUZQTEZGQlFWRXNSMEZCUnl4UFFVRlBMRkZCUVZFc1IwRkJSenRCUVVOb1JDeGxRVUZQTzBGQlFVRXNWVUZEU0R0QlFVRkJMRlZCUTBFc1NVRkJTU3hUUVVGVkxFMUJRVXNzVFVGQlRTeFhRVUZYTEZGQlFWRXNUMEZCVHl4VFFVRlRMRXRCUVVzc1MwRkJTeXhUUVVGVkxFMUJRVXNzVFVGQlRTeFhRVUZYTEZGQlFWRXNUMEZCVHl4VFFVRlRMRXRCUVVzc1MwRkJTenRCUVVGQk8wRkJRVUU3UVVGSGFFb3NWVUZCU1N4clFrRkJhMEk3UVVGQlFTeFJRVU5zUWl4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxHbENRVUZQTEVOQlFVTXNXVUZCV1N4SlFVRkpMRk5CUVZNc1NVRkJTVHRCUVVGQk8wRkJRVUVzVVVGRE0wUXNVMEZCVXl4VFFVRlZMRXRCUVVzN1FVRkJSU3hwUWtGQlR5eERRVUZETEZsQlFWa3NTVUZCU1N4WFFVRlhMRkZCUVZFc1NVRkJTVHRCUVVGQk8wRkJRVUVzVVVGRGVrVXNUMEZCVHp0QlFVRkJMRkZCUTFBc1QwRkJUenRCUVVGQkxGRkJRMUFzV1VGQldUdEJRVUZCTzBGQlJXaENMRmRCUVVzc2FVSkJRV2xDTEZGQlFWRXNVMEZCVlN4UlFVRlJPMEZCUXpWRExHMUNRVUZYTEZWQlFWVXNVMEZCVlN4TFFVRkxPMEZCUTJoRExHTkJRVWtzVTBGQlV5eEpRVUZKTzBGQlEycENMR05CUVVrc1VVRkJVVHRCUVVOU0xHZENRVUZKTEdOQlFXTXNVMEZCVlN4WFFVRlhPMEZCUTI1RExHdENRVUZKTEU5QlFVOHNWMEZCVnl4VFFVRlRMRTFCUVUwc1dVRkJXU3hOUVVGTk8wRkJRM1pFTEhGQ1FVRlJMRTlCUVU4c1UwRkRWaXhSUVVGUExGRkJRVkVzU1VGQlNUdEJRVUZCTzBGQlJUVkNMR2RDUVVGSkxHVkJRV1VzV1VGQldUdEJRVU12UWl4blFrRkJTU3hwUWtGQmFVSXNXVUZCV1R0QlFVTnFReXhuUWtGQlNTeE5RVUZMTEdkQ1FVRm5RaXhSUVVGUkxFMUJRVTBzWlVGQlpTeEpRVUZITEVsQlFVa3NaMEpCUVdkQ0xFbEJRVWM3UVVGRGFFWXNkMEpCUVZrc1lVRkJZU3hSUVVGUkxFbEJRVWtzU1VGQlNUdEJRVU42UXl4blFrRkJTU3hEUVVGRExHRkJRV0VzWTBGQll6dEJRVU0xUWl4clFrRkJTU3hYUVVGWExGTkJRVk03UVVGRGNFSXNLMEpCUVdVc1NVRkJTVHRCUVVGQkxIRkNRVVZzUWp0QlFVTkVMRzlDUVVGSkxHZENRVUZuUWl4WFFVRlhMRmRCUXpOQ0xGbEJRMEVzU1VGQlNTeFZRVU5LTEUxQlFVMHNUVUZCVFN4VFFVRlRMRk5CUVZNc1NVRkJTU3hOUVVGTkxFTkJRVVVzVVVGQlVUdEJRVU4wUkN4MVFrRkJUeXhOUVVGTkxGRkJRVkVzVFVGQlRTeE5RVUZOTEZkQlFWY3NTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkROVVFzYzBKQlFVa3NWMEZCVnl4VFFVRlRPMEZCUTNCQ0xIZENRVUZKTEZsQlFWa3NTVUZCU1N4UlFVRlJPMEZCUTNoQ0xEWkNRVUZQTEdOQlFXTXNTMEZCU3l4VFFVRlZMRXRCUVVrN1FVRkRjRU1zTkVKQlFVa3NaMEpCUVdkQ0xFbEJRVWM3UVVGRGRrSXNjVU5CUVdFc1VVRkJVVHRCUVVOeVFpd3JRa0ZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXgzUWtGQlNTeFJRVUZSTEVsQlFVa3NVMEZEVml4SlFVRkpMRTlCUVU4c1NVRkJTU3hqUVVObUxFbEJRVWs3UVVGRFZpeDNRa0ZCU1N4SlFVRkpMRkZCUVZFN1FVRkRXaXh0UTBGQllTeFJRVUZSTzBGQlFVRXNNa0pCUlhCQ08wRkJRMFFzY1VOQlFXVXNVVUZCVVR0QlFVRkJPMEZCUVVFc05rSkJSM1JDTEZkQlFWY3NZMEZCWXp0QlFVTTVRaXgzUWtGQlNTeFhRVUZYTzBGQlEyWXNkMEpCUVVrc1pVRkJaU3hKUVVGSk8wRkJRM1pDTERKQ1FVRlJMRmxCUTBvc1QwRkJUeXhQUVVGUExGVkJRVlU3UVVGQlFTeHpRa0ZEY0VJc1MwRkJTenRCUVVGQkxIZENRVU5FTEV0QlFVc3NWMEZCV1R0QlFVTmlMSGxEUVVGbExFOUJRVThzVTBGQlV6dEJRVU12UWl4cFEwRkJUeXhUUVVGVE8wRkJRVUU3UVVGQlFUdEJRVUZCTEhOQ1FVZDRRaXhaUVVGWk8wRkJRVUVzZDBKQlExSXNTMEZCU3l4WFFVRlpPMEZCUTJJc09FSkJRVWtzVDBGQlR5eFRRVUZUTzBGQlEzQkNMSGxEUVVGbExFOUJRVTg3UVVGRGRFSXNhVU5CUVU4N1FVRkJRVHRCUVVGQk8wRkJRVUVzYzBKQlIyWXNUMEZCVHp0QlFVRkJMSGRDUVVOSUxFdEJRVXNzVjBGQldUdEJRVU5pTERCRFFVRm5RaXhoUVVGaExFOUJRVThzVTBGQlV6dEJRVU0zUXl4cFEwRkJUeXhUUVVGVE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMY0VNc2VVSkJRVTg3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVdDJRaXhwUWtGQlR5eE5RVUZOTEZGQlFWRXNUVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVkNlF5eGhRVUZQTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1haQ0xEaENRVUU0UWl4aFFVRmhMRkZCUVZFc1UwRkJVeXhUUVVGVE8wRkJRMnBGTERSQ1FVRXdRaXhKUVVGSk8wRkJRekZDTEZGQlFVa3NWMEZCVnl4WlFVRlpMRWRCUVVjc1VVRkJVVHRCUVVOMFF5eDNRa0ZCYjBJc1MwRkJTenRCUVVOeVFpeGhRVUZQTEU5QlFVOHNUMEZCVHl4SFFVRkhMRmRCUVZjc1QwRkJUenRCUVVGQk8wRkJSVGxETEZGQlFVa3NaVUZCWlN4VFFVRlZMRXRCUVVzN1FVRkJSU3hoUVVGUExFZEJRVWNzWTBGQll5eFJRVUZSTEU5QlF6bEVMRWxCUVVrc1VVRkJVU3hUUVVGVkxFMUJRVXM3UVVGQlJTeGxRVUZQTEZOQlFWTXNUMEZCVHp0QlFVRkJMRmRCUTNCRUxGTkJRVk1zVDBGQlR6dEJRVUZCTzBGQlEzUkNMRWxCUVVNc1dVRkJWeXhUUVVGVExGRkJRVkVzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZEZWtNc1ZVRkJTU3hUUVVGVExGZEJRVmNzVjBGQlZ5eFJRVUZSTzBGQlF6TkRMRlZCUVVrc1UwRkJVeXhYUVVGWExGZEJRVmNzVVVGQlVUdEJRVU16UXl4VlFVRkpMRWxCUVVrc1VVRkJVU3haUVVGWkxFZEJRVWM3UVVGRE0wSXNXVUZCU1N4VlFVRlZPMEZCUTFZc2RVSkJRV0U3UVVGRGFrSXNXVUZCU1N4VlFVRlZPMEZCUTFZc2RVSkJRV0U3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKTjBJc1UwRkJUeXhSUVVGUkxGRkJRVkU3UVVGQlFUdEJRVWN6UWl4SlFVRkpMRlZCUVZrc1YwRkJXVHRCUVVONFFpeHJRa0ZCWlN4TlFVRk5MRk5CUVZNN1FVRkRNVUlzVVVGQlNTeFJRVUZSTzBGQlExb3NVMEZCU3l4bFFVRmxPMEZCUTNCQ0xGTkJRVXNzVVVGQlVUdEJRVU5pTEZGQlFVa3NUMEZCVHl4UFFVRk5PMEZCUTJwQ0xGTkJRVXNzVjBGQlZ5eFZRVUZWTEZOQlFWTTdRVUZCUVN4TlFVTXZRaXhSUVVGUkxFOUJRVTA3UVVGQlFTeE5RVUZSTEZWQlFWVTdRVUZCUVN4TlFVTm9ReXhYUVVGWExFdEJRVXM3UVVGQlFTeE5RVUZYTEdGQlFXRXNTMEZCU3p0QlFVRkJMRTlCUVdVN1FVRkRhRVVzVTBGQlN5eFJRVUZSTzBGQlFVRXNUVUZEVkN4WFFVRlhMRkZCUVZFN1FVRkJRU3hOUVVOdVFpeGhRVUZoTEZGQlFWRTdRVUZCUVR0QlFVVjZRaXhSUVVGSkxGTkJRVk1zVVVGQlVUdEJRVU55UWl4VFFVRkxMRmxCUVZrN1FVRkRha0lzVTBGQlN5eFpRVUZaTzBGQlEycENMRk5CUVVzc1kwRkJZenRCUVVOdVFpeFRRVUZMTEdGQlFXRTdRVUZEYkVJc1UwRkJTeXhSUVVGUk8wRkJRMklzVVVGQlNTeFJRVUZSTzBGQlFVRXNUVUZEVWl4aFFVRmhPMEZCUVVFc1RVRkRZaXhsUVVGbE8wRkJRVUVzVFVGRFppeHRRa0ZCYlVJN1FVRkJRU3hOUVVOdVFpeGpRVUZqTzBGQlFVRXNUVUZEWkN4blFrRkJaMEk3UVVGQlFTeE5RVU5vUWl4blFrRkJaMEk3UVVGQlFTeE5RVU5vUWl4WlFVRlpPMEZCUVVFc1RVRkRXaXhsUVVGbE8wRkJRVUVzVFVGRFppeFpRVUZaTzBGQlFVRTdRVUZGYUVJc1ZVRkJUU3hwUWtGQmFVSXNTVUZCU1N4aFFVRmhMRk5CUVZVc1UwRkJVenRCUVVOMlJDeFpRVUZOTEdsQ1FVRnBRanRCUVVGQk8wRkJSVE5DTEZWQlFVMHNaMEpCUVdkQ0xFbEJRVWtzWVVGQllTeFRRVUZWTEVkQlFVY3NVVUZCVVR0QlFVTjRSQ3haUVVGTkxHRkJRV0U3UVVGQlFUdEJRVVYyUWl4VFFVRkxMRk5CUVZNN1FVRkRaQ3hUUVVGTExFOUJRVTg3UVVGRFdpeFRRVUZMTEV0QlFVc3NUMEZCVHl4TlFVRk5MRmxCUVZrc1YwRkJWeXhwUWtGQmFVSXNVMEZCVXl4RFFVRkZMRTlCUVU4c1EwRkJReXhwUWtGQmFVSTdRVUZEYmtjc1UwRkJTeXhIUVVGSExFMUJRVTBzV1VGQldTeFRRVUZUTEV0QlFVc3NSMEZCUnl4TlFVRk5MRmRCUVZjc1UwRkJWU3hYUVVGWE8wRkJRemRGTEdGQlFVOHNVMEZCVlN4WlFVRlpMRk5CUVZNN1FVRkRiRU1zWlVGQlRTeEpRVUZKTEZkQlFWazdRVUZEYkVJc1kwRkJTU3hUUVVGUkxFMUJRVTA3UVVGRGJFSXNZMEZCU1N4UFFVRk5MR05CUVdNN1FVRkRjRUlzWjBKQlFVa3NRMEZCUXl4UFFVRk5PMEZCUTFBc01rSkJRV0VzVlVGQlZTeExRVUZMTzBGQlEyaERMR2RDUVVGSk8wRkJRMEVzZDBKQlFWVTdRVUZCUVN4eFFrRkZWQ3hQUVVGTkxHMUNRVUZ0UWp0QlFVTTVRaXh0UWtGQlRTeHJRa0ZCYTBJc1MwRkJTenRCUVVNM1FpeG5Ra0ZCU1R0QlFVTkJMSGRDUVVGVk8wRkJRVUVzYVVKQlJXSTdRVUZEUkN4elFrRkJWVHRCUVVOV0xHZENRVUZKTEU5QlFVODdRVUZEV0N4blFrRkJTU3hEUVVGRE8wRkJRMFFzZDBKQlFWVXNkVUpCUVhWQ08wRkJRemRDTEhGQ1FVRkxMRWRCUVVjc1RVRkJUU3haUVVGWk8wRkJRekZDTEhGQ1FVRkxMRWRCUVVjc1RVRkJUU3haUVVGWk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVMXNSQ3hUUVVGTExHRkJRV0VzTkVKQlFUUkNPMEZCUXpsRExGTkJRVXNzVVVGQlVTeDFRa0ZCZFVJN1FVRkRjRU1zVTBGQlN5eGpRVUZqTERaQ1FVRTJRanRCUVVOb1JDeFRRVUZMTEZWQlFWVXNlVUpCUVhsQ08wRkJRM2hETEZOQlFVc3NZMEZCWXl3MlFrRkJOa0k3UVVGRGFFUXNVMEZCU3l4SFFVRkhMR2xDUVVGcFFpeFRRVUZWTEVsQlFVazdRVUZEYmtNc1ZVRkJTU3hIUVVGSExHRkJRV0U3UVVGRGFFSXNaMEpCUVZFc1MwRkJTeXh0UkVGQmJVUXNUVUZCVFN4UFFVRlBPMEZCUVVFN1FVRkZOMFVzWjBKQlFWRXNTMEZCU3l4clJFRkJhMFFzVFVGQlRTeFBRVUZQTzBGQlEyaEdMRmxCUVUwN1FVRkJRVHRCUVVWV0xGTkJRVXNzUjBGQlJ5eFhRVUZYTEZOQlFWVXNTVUZCU1R0QlFVTTNRaXhWUVVGSkxFTkJRVU1zUjBGQlJ5eGpRVUZqTEVkQlFVY3NZVUZCWVN4SFFVRkhPMEZCUTNKRExHZENRVUZSTEV0QlFVc3NiVUpCUVcxQ0xFMUJRVTBzVDBGQlR6dEJRVUZCTzBGQlJUZERMR2RDUVVGUkxFdEJRVXNzWTBGQll5eE5RVUZOTEU5QlFVOHNiVVJCUVcxRUxFZEJRVWNzWVVGQllUdEJRVUZCTzBGQlJXNUlMRk5CUVVzc1ZVRkJWU3hWUVVGVkxGRkJRVkU3UVVGRGFrTXNVMEZCU3l4eFFrRkJjVUlzVTBGQlZTeE5RVUZOTEZsQlFWa3NWVUZCVlN4dFFrRkJiVUk3UVVGQlJTeGhRVUZQTEVsQlFVa3NUVUZCVFN4WlFVRlpMRTFCUVUwc1dVRkJXU3hWUVVGVk8wRkJRVUU3UVVGRE9Va3NVMEZCU3l4cFFrRkJhVUlzVTBGQlZTeEpRVUZKTzBGQlEyaERMRmxCUVUwc1IwRkJSeXhYUVVGWExFdEJRVXM3UVVGRGVrSXNhMEpCUTBzc1QwRkJUeXhUUVVGVkxFZEJRVWM3UVVGQlJTeGxRVUZQTEVWQlFVVXNVMEZCVXl4TlFVRk5MRkZCUVZFc1RVRkJUU3hUUVVGVExFTkJRVU1zUlVGQlJTeFBRVUZQTzBGQlFVRXNVMEZETDBVc1NVRkJTU3hUUVVGVkxFZEJRVWM3UVVGQlJTeGxRVUZQTEVWQlFVVXNSMEZCUnl4cFFrRkJhVUlzUzBGQlN6dEJRVUZCTzBGQlFVRTdRVUZGT1VRc1UwRkJTeXhKUVVGSk8wRkJRMVFzVTBGQlN5eEpRVUZKTzBGQlExUXNVMEZCU3l4SlFVRkpPMEZCUTFRc1UwRkJTeXhKUVVGSk8wRkJRMVFzVjBGQlR5eFJRVUZSTEZOQlFWVXNUMEZCVHp0QlFVRkZMR0ZCUVU4c1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGRmJrUXNVMEZCVFN4VlFVRlZMRlZCUVZVc1UwRkJWU3hsUVVGbE8wRkJReTlETEZGQlFVa3NUVUZCVFN4clFrRkJhMElzWjBKQlFXZENPMEZCUTNoRExGbEJRVTBzU1VGQlNTeFhRVUZYTEV0QlFVczdRVUZET1VJc2IwSkJRV2RDTEV0QlFVc3NUVUZCVFN4blFrRkJaMElzVFVGQlRUdEJRVU5xUkN4UlFVRkpMRXRCUVVzc1UwRkJVeXhMUVVGTExFOUJRVTg3UVVGRE1VSXNXVUZCVFN4SlFVRkpMRmRCUVZjc1QwRkJUenRCUVVOb1F5eFRRVUZMTEZGQlFWRXNTMEZCU3l4SlFVRkpMRXRCUVVzc1QwRkJUenRCUVVOc1F5eFJRVUZKTEZkQlFWY3NTMEZCU3p0QlFVTndRaXhSUVVGSkxHdENRVUZyUWl4VFFVRlRMRTlCUVU4c1UwRkJWU3hIUVVGSE8wRkJRVVVzWVVGQlR5eEZRVUZGTEV0QlFVc3NXVUZCV1R0QlFVRkJMRTlCUVd0Q08wRkJRMnBITEZGQlFVazdRVUZEUVN4aFFVRlBPMEZCUTFnc2MwSkJRV3RDTEVsQlFVa3NTMEZCU3l4UlFVRlJPMEZCUTI1RExHRkJRVk1zUzBGQlN6dEJRVU5rTEdGQlFWTXNTMEZCU3p0QlFVTmtMRzlDUVVGblFpeFBRVUZQTzBGQlEzWkNMRk5CUVVzc1QwRkJUeXhoUVVGaE8wRkJRM3BDTEZkQlFVODdRVUZCUVR0QlFVVllMRk5CUVUwc1ZVRkJWU3hoUVVGaExGTkJRVlVzU1VGQlNUdEJRVU4yUXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhYUVVGUExFdEJRVXNzVDBGQlR5eG5Ra0ZCWjBJc1NVRkJTU3hoUVVGaExFOUJRVThzU1VGQlNTeGhRVUZoTEZOQlFWVXNVMEZCVXl4UlFVRlJPMEZCUTI1SExGVkJRVWtzUTBGQlF5eE5RVUZOTEU5QlFVOHNaVUZCWlR0QlFVTTNRaXhaUVVGSkxFTkJRVU1zVFVGQlRTeFRRVUZUTEZWQlFWVTdRVUZETVVJc2FVSkJRVThzU1VGQlNTeFhRVUZYTzBGQlEzUkNPMEZCUVVFN1FVRkZTaXhqUVVGTkxFOUJRVThzVFVGQlRUdEJRVUZCTzBGQlJYWkNMRmxCUVUwc1QwRkJUeXhsUVVGbExFdEJRVXNzVTBGQlV6dEJRVUZCTEU5QlF6TkRMRXRCUVVzN1FVRkJRVHRCUVVWYUxGTkJRVTBzVlVGQlZTeE5RVUZOTEZOQlFWVXNTMEZCU1R0QlFVTm9ReXhSUVVGSkxGRkJRVkVzU1VGQlJ5eFBRVUZQTEZOQlFWTXNTVUZCUnl4UlFVRlJMRkZCUVZFc1NVRkJSeXhQUVVGUExFOUJRVThzU1VGQlJ6dEJRVU4wUlN4UlFVRkpPMEZCUTBFc1YwRkJTeXhOUVVGTkxFTkJRVVVzVDBGQll6dEJRVU12UWl4UlFVRkpMR05CUVdNc1MwRkJTeXhoUVVGaExGVkJRVmNzVFVGQlN5eGhRVUZoTEZOQlFWTTdRVUZETVVVc1owSkJRVmtzUzBGQlN5eERRVUZGTEU5QlFXTXNVVUZCWjBJc1QwRkJUeXhUUVVGVExFOUJRVThzUzBGQlN5eFBRVUZQTzBGQlEzQkdMR2RDUVVGWkxFdEJRVXNzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4aFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRk8wRkJRVUU3UVVGRGRFUXNWMEZCVHp0QlFVRkJPMEZCUlZnc1UwRkJUU3hWUVVGVkxGRkJRVkVzVTBGQlZTeExRVUZKTzBGQlEyeERMRkZCUVVrc1VVRkJVU3hKUVVGSExFOUJRVThzVDBGQlR5eEpRVUZITEUxQlFVMHNVMEZCVXl4SlFVRkhPMEZCUTJ4RUxGRkJRVWtzVTBGQlV5eExRVUZMTEdGQlFXRXNVVUZCVVR0QlFVTnVReXhYUVVGTExHRkJRV0VzVTBGQlV5eExRVUZMTEdGQlFXRXNUMEZCVHl4UFFVRlBMRk5CUVZVc1NVRkJTVHRCUVVOeVJTeGxRVUZQTEZOQlFWTXNSMEZCUnl4WFFVRlhMRk5CUXpGQ0xFOUJRVThzUjBGQlJ5eFRRVUZUTEU5QlEyWTdRVUZCUVR0QlFVRkJPMEZCUjJoQ0xGZEJRVTg3UVVGQlFUdEJRVVZZTEZOQlFVMHNWVUZCVlN4UFFVRlBMRmRCUVZrN1FVRkRMMElzVjBGQlR5eFZRVUZWTzBGQlFVRTdRVUZGY2tJc1UwRkJUU3hWUVVGVkxGRkJRVkVzVjBGQldUdEJRVU5vUXl4UlFVRkpMRTFCUVUwc1dVRkJXU3hSUVVGUkxFOUJRVThzVVVGQlVTeExRVUZMTzBGQlEyeEVMRkZCUVVrc1QwRkJUenRCUVVOUUxHdENRVUZaTEU5QlFVOHNTMEZCU3p0QlFVTTFRaXhSUVVGSkxFdEJRVXNzVDBGQlR6dEJRVU5hTEZWQlFVazdRVUZEUVN4aFFVRkxMRTFCUVUwN1FVRkJRU3hsUVVWU0xFZEJRVkE3UVVGQlFUdEJRVU5CTEZkQlFVc3NVVUZCVVR0QlFVRkJPMEZCUldwQ0xGTkJRVXNzVTBGQlV5eFhRVUZYTzBGQlEzcENMRlZCUVUwc1kwRkJZeXhKUVVGSkxGZEJRVmM3UVVGRGJrTXNVVUZCU1N4TlFVRk5PMEZCUTA0c1dVRkJUU3hYUVVGWExFMUJRVTA3UVVGRE0wSXNWVUZCVFN4cFFrRkJhVUlzU1VGQlNTeGhRVUZoTEZOQlFWVXNVMEZCVXp0QlFVTjJSQ3haUVVGTkxHbENRVUZwUWp0QlFVRkJPMEZCUlROQ0xGVkJRVTBzWjBKQlFXZENMRWxCUVVrc1lVRkJZU3hUUVVGVkxFZEJRVWNzVVVGQlVUdEJRVU40UkN4WlFVRk5MR0ZCUVdFN1FVRkJRVHRCUVVGQk8wRkJSek5DTEZOQlFVMHNWVUZCVlN4VFFVRlRMRmRCUVZrN1FVRkRha01zVVVGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1N4bFFVRmxMRlZCUVZVc1UwRkJVenRCUVVOMFF5eFJRVUZKTEZGQlFWRXNTMEZCU3p0QlFVTnFRaXhYUVVGUExFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXZReXhWUVVGSkxGZEJRVmNzVjBGQldUdEJRVU4yUWl4alFVRk5PMEZCUTA0c1dVRkJTU3hOUVVGTkxFMUJRVTBzVFVGQlRTeFZRVUZWTEdWQlFXVXNUVUZCVFR0QlFVTnlSQ3haUVVGSkxGbEJRVmtzUzBGQlN5eFhRVUZaTzBGQlF6ZENMRFpDUVVGdFFpeE5RVUZOTEU5QlFVOHNUVUZCVFR0QlFVTjBRenRCUVVGQk8wRkJSVW9zV1VGQlNTeFZRVUZWTEcxQ1FVRnRRanRCUVVOcVF5eFpRVUZKTEZsQlFWa3NUVUZCVFR0QlFVRkJPMEZCUlRGQ0xGVkJRVWs3UVVGRFFTeGpRVUZOTEVsQlFVa3NWMEZCVnl4blFrRkJaMEk3UVVGRGVrTXNWVUZCU1N4TlFVRk5MR1ZCUVdVN1FVRkRja0lzWTBGQlRTeGxRVUZsTEV0QlFVczdRVUZCUVN4aFFVVjZRanRCUVVORU8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNWb3NVMEZCVFN4VlFVRlZMRmxCUVZrc1YwRkJXVHRCUVVOd1F5eFhRVUZQTEV0QlFVczdRVUZCUVR0QlFVVm9RaXhUUVVGTkxGVkJRVlVzVTBGQlV5eFhRVUZaTzBGQlEycERMRmRCUVU4c1MwRkJTeXhWUVVGVk8wRkJRVUU3UVVGRk1VSXNVMEZCVFN4VlFVRlZMR2RDUVVGblFpeFhRVUZaTzBGQlEzaERMRkZCUVVrc1kwRkJZeXhMUVVGTExFOUJRVTg3UVVGRE9VSXNWMEZCVHl4bFFVRm5RaXhaUVVGWkxGTkJRVk03UVVGQlFUdEJRVVZvUkN4VFFVRk5MRlZCUVZVc1dVRkJXU3hYUVVGWk8wRkJRM0JETEZkQlFVOHNTMEZCU3l4UFFVRlBMR2RDUVVGblFqdEJRVUZCTzBGQlJYWkRMRk5CUVUwc1ZVRkJWU3h2UWtGQmIwSXNWMEZCV1R0QlFVTTFReXhYUVVGUExFdEJRVXNzVDBGQlR6dEJRVUZCTzBGQlJYWkNMRk5CUVU4c1pVRkJaU3hQUVVGTkxGZEJRVmNzVlVGQlZUdEJRVUZCTEVsQlF6ZERMRXRCUVVzc1YwRkJXVHRCUVVOaUxGVkJRVWtzVVVGQlVUdEJRVU5hTEdGQlFVOHNTMEZCU3l4TFFVRkxMRmxCUVZrc1NVRkJTU3hUUVVGVkxFMUJRVTA3UVVGQlJTeGxRVUZQTEUxQlFVMHNWMEZCVnp0QlFVRkJPMEZCUVVFN1FVRkJRU3hKUVVVdlJTeFpRVUZaTzBGQlFVRXNTVUZEV2l4alFVRmpPMEZCUVVFN1FVRkZiRUlzVTBGQlRTeFZRVUZWTEdOQlFXTXNWMEZCV1R0QlFVTjBReXhSUVVGSkxFOUJRVThzZFVKQlFYVkNMRTFCUVUwc1RVRkJUVHRCUVVNNVF5eFhRVUZQTEV0QlFVc3NZVUZCWVN4TlFVRk5MRTFCUVUwN1FVRkJRVHRCUVVWNlF5eFRRVUZOTEZWQlFWVXNaVUZCWlN4VFFVRlZMRTFCUVUwc1VVRkJVU3hYUVVGWE8wRkJRemxFTEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc2IwSkJRVzlDTEVsQlFVazdRVUZETlVJc1VVRkJTU3hEUVVGRExIRkNRVUZ4UWl4clFrRkJhMElzVDBGQlR5eFJRVUZSTEV0QlFVc3NVVUZCVVN4VFFVRlRPMEZCUXpkRkxEQkNRVUZ2UWp0QlFVTjRRaXhSUVVGSkxHMUNRVUZ0UWl4TFFVRkxMRkZCUVZFc1UwRkJVenRCUVVNM1F5eFhRVUZQTEV0QlFVc3NVVUZCVVN4TFFVRkxMRWxCUVVrc1VVRkJVU3hMUVVGTE8wRkJRekZETEZGQlFVa3NVMEZCVXp0QlFVTmlMRkZCUVVrN1FVRkRRU3h0UWtGQllTeFBRVUZQTEVsQlFVa3NVMEZCVlN4UFFVRlBPMEZCUTNKRExGbEJRVWtzV1VGQldTeHBRa0ZCYVVJc1RVRkJUU3hSUVVGUkxFMUJRVTBzVDBGQlR6dEJRVU0xUkN4WlFVRkpMRTlCUVU4c1kwRkJZenRCUVVOeVFpeG5Ra0ZCVFN4SlFVRkpMRlZCUVZVN1FVRkRlRUlzWlVGQlR6dEJRVUZCTzBGQlJWZ3NWVUZCU1N4UlFVRlJMRTlCUVU4c1UwRkJVenRCUVVONFFpeHJRa0ZCVlR0QlFVRkJMR1ZCUTB3c1VVRkJVU3hSUVVGUkxGRkJRVkU3UVVGRE4wSXNhMEpCUVZVN1FVRkJRVHRCUVVWV0xHTkJRVTBzU1VGQlNTeFhRVUZYTEdkQ1FVRm5RaXdyUWtGQkswSTdRVUZEZUVVc1ZVRkJTU3h0UWtGQmJVSTdRVUZEYmtJc1dVRkJTU3hyUWtGQmEwSXNVMEZCVXl4WlFVRlpMRmxCUVZrc1YwRkJWenRCUVVNNVJDeGpRVUZKTEd0Q1FVRnJRanRCUVVOc1FpeG5RMEZCYjBJN1FVRkJRVHRCUVVkd1FpeHJRa0ZCVFN4SlFVRkpMRmRCUVZjc1pVRkJaVHRCUVVGQk8wRkJSVFZETEZsQlFVa3NiVUpCUVcxQ08wRkJRMjVDTEhGQ1FVRlhMRkZCUVZFc1UwRkJWU3hYUVVGWE8wRkJRM0JETEdkQ1FVRkpMSEZDUVVGeFFpeHJRa0ZCYTBJc1YwRkJWeXhSUVVGUkxHVkJRV1VzU1VGQlNUdEJRVU0zUlN4clFrRkJTU3hyUWtGQmEwSTdRVUZEYkVJc2IwTkJRVzlDTzBGQlFVRTdRVUZIY0VJc2MwSkJRVTBzU1VGQlNTeFhRVUZYTEdWQlFXVXNWMEZCVnl4WlFVTXpRenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWx3UWl4WlFVRkpMRzlDUVVGdlFpeHhRa0ZCY1VJc1EwRkJReXhyUWtGQmEwSXNVVUZCVVR0QlFVTndSU3c0UWtGQmIwSTdRVUZCUVR0QlFVRkJPMEZCUVVFc1lVRkpla0lzUjBGQlVEdEJRVU5KTEdGQlFVOHNiMEpCUTBnc2EwSkJRV3RDTEZOQlFWTXNUVUZCVFN4VFFVRlZMRWRCUVVjc1VVRkJVVHRCUVVGRkxHVkJRVTg3UVVGQlFTeFhRVU12UkN4VlFVRlZPMEZCUVVFN1FVRkZiRUlzVVVGQlNTeHRRa0ZCYlVJc2MwSkJRWE5DTEV0QlFVc3NUVUZCVFN4TlFVRk5MRk5CUVZNc1dVRkJXU3h0UWtGQmJVSTdRVUZEZEVjc1YwRkJVU3h2UWtGRFNpeHJRa0ZCYTBJc1UwRkJVeXhUUVVGVExHdENRVUZyUWl4VlFVTjBSQ3hKUVVGSkxGRkJRMEVzVDBGQlR5eEpRVUZKTEZkQlFWY3NWMEZCV1R0QlFVRkZMR0ZCUVU4c1RVRkJUU3hYUVVGWE8wRkJRVUVzVTBGRE5VUXNTMEZCU3l4WFFVRlhPMEZCUVVFN1FVRkZOVUlzVTBGQlRTeFZRVUZWTEZGQlFWRXNVMEZCVlN4WFFVRlhPMEZCUTNwRExGRkJRVWtzUTBGQlF5eFBRVUZQTEV0QlFVc3NXVUZCV1N4WlFVRlpPMEZCUTNKRExGbEJRVTBzU1VGQlNTeFhRVUZYTEdGQlFXRXNWMEZCVnl4WlFVRlpPMEZCUVVFN1FVRkZOMFFzVjBGQlR5eExRVUZMTEZkQlFWYzdRVUZCUVR0QlFVVXpRaXhUUVVGUE8wRkJRVUU3UVVGSFdDeEpRVUZKTEcxQ1FVRnRRaXhQUVVGUExGZEJRVmNzWlVGQlpTeG5Ra0ZCWjBJc1UwRkRiRVVzVDBGQlR5eG5Ra0ZEVUR0QlFVTk9MRWxCUVVrc1lVRkJaU3hYUVVGWk8wRkJRek5DTEhWQ1FVRnZRaXhYUVVGWE8wRkJRek5DTEZOQlFVc3NZVUZCWVR0QlFVRkJPMEZCUlhSQ0xHTkJRVmNzVlVGQlZTeFpRVUZaTEZOQlFWVXNSMEZCUnl4UFFVRlBMRlZCUVZVN1FVRkRNMFFzVjBGQlR5eExRVUZMTEZkQlFWY3NUMEZCVHl4TlFVRk5MR0ZCUVdFc1EwRkJSU3hOUVVGTkxFZEJRVWNzVDBGQll5eFpRVUYxUWp0QlFVRkJPMEZCUlhKSExHTkJRVmNzVlVGQlZTeHZRa0ZCYjBJc1YwRkJXVHRCUVVOcVJDeFhRVUZQTzBGQlFVRTdRVUZGV0N4VFFVRlBPMEZCUVVFN1FVRkhXQ3huUTBGQlowTXNVVUZCVVN4UlFVRlJPMEZCUXpWRExFOUJRVXNzVVVGQlVTeFJRVUZSTEZOQlFWVXNUVUZCVFR0QlFVTnFReXhSUVVGSkxGZEJRVmNzVDBGQlR5eFRRVUZWTEZGQlFVOHNVVUZCVVN4SlFVRkpPMEZCUTI1RUxHZENRVUZaTEZWQlFWVXNUMEZCVHp0QlFVRkJPMEZCUldwRExGTkJRVTg3UVVGQlFUdEJRVWRZTEcxQ1FVRnRRaXhUUVVGVE8wRkJRM2hDTEZOQlFVOHNTVUZCU1N4WFFVRlhMRk5CUVZVc1ZVRkJWVHRCUVVOMFF5eFJRVUZKTEcxQ1FVRnRRaXhuUWtGQlowSTdRVUZEZGtNc2NVSkJRV2xDTEZGQlFWRTdRVUZEY2tJc1ZVRkJTU3hyUWtGQmEwSTdRVUZEYkVJN1FVRkJRVHRCUVVWS0xGVkJRVWtzVDBGQlR5eFhRVUZaTzBGQlFVVXNaVUZCVHl4VFFVRlRMRk5CUVZNc1EwRkJSU3hSUVVGblFpeFBRVUZQTzBGQlFVRTdRVUZETTBVc1ZVRkJTU3hMUVVGTExFbEJRVWtzVVVGRlRDeFBRVUZQTEVsQlFVa3NWMEZCVnl4UlFVTjRRanRCUVVOT0xGVkJRVWtzYTBKQlFXdENPMEZCUTJ4Q0xGZEJRVWNzUzBGQlN5eDVRa0ZCZVVJN1FVRkJRVHRCUVVWeVF5eGhRVUZQTzBGQlFVRTdRVUZGV0N4UlFVRkpMRk5CUVZNN1FVRkRZaXhSUVVGSkxGbEJRVms3UVVGRGFFSXNVVUZCU1N4aFFVRmhPMEZCUTJwQ0xGRkJRVWtzWlVGQlpUdEJRVUZCTEZWQlExZ3NVMEZCVXp0QlFVTlVMR1ZCUVU4N1FVRkJRVHRCUVVGQkxFMUJSVmdzWVVGQllTeFhRVUZaTzBGQlEzSkNMR2xDUVVGVE8wRkJRMVFzY1VKQlFXRXNXVUZCV1N4WlFVRlpPMEZCUVVFN1FVRkJRVHRCUVVjM1F5eGhRVUZUTEZOQlFWTXNVMEZCVXl4TlFVRk5PMEZCUTJwRExGRkJRVWtzVjBGQlZ5eFBRVUZQTEcxQ1FVRnRRanRCUVVONlF5dzBRa0ZCZDBJN1FVRkRjRUlzWVVGQlR5eExRVUZMTEZsQlFWa3NTMEZCU3l4VFFVRlZMRXRCUVVzN1FVRkRlRU1zWlVGQlR5eFZRVUZWTEZGQlFWRXNZMEZCWXl4VlFVRlZMRTFCUVUwc1YwRkJWenRCUVVGQk8wRkJRVUU3UVVGSE1VVXNVVUZCU1N4dFFrRkJiVUlzVTBGQlZTeFBRVUZQTzBGQlEzQkRMRFpDUVVGMVFpeFhRVUZYTzBGQlEyeERMRlZCUVVrc1owSkJRV2RDTzBGQlEyaENPMEZCUVVFN1FVRkJRVHRCUVVkU0xGRkJRVWtzVlVGQlZTeFhRVUZaTzBGQlEzUkNMRlZCUVVrc1dVRkJXVHRCUVVOYU8wRkJRMG9zYTBKQlFWazdRVUZEV2l4VlFVRkpMRk5CUVZNN1FVRkRZaXhWUVVGSkxFMUJRVTBzVVVGQlVUdEJRVU5zUWl4VlFVRkpMRU5CUVVNc2EwSkJRV3RDTzBGQlEyNUNMSEZDUVVGaExHVkJRV1U3UVVGRE5VSXNNa0pCUVcxQ08wRkJRVUU3UVVGRmRrSXNhVUpCUVZjN1FVRkRXQ3hqUVVGUkxGRkJRVkVzUzBGQlN5eExRVUZMTEZOQlFWVXNVVUZCVVR0QlFVTjRReXh0UWtGQlZ6dEJRVU5ZTEZsQlFVazdRVUZEUVR0QlFVTktMRmxCUVVrc1owSkJRV2RDTzBGQlEyaENPMEZCUVVFc1pVRkZRenRCUVVORUxITkNRVUZaTzBGQlExb3NkVUpCUVdFN1FVRkRZaXh0UWtGQlV5eFJRVUZSTEZOQlFWTXNTMEZCU3p0QlFVRkJPMEZCUVVFc1UwRkZjRU1zVTBGQlZTeExRVUZMTzBGQlEyUXNiVUpCUVZjN1FVRkRXQ3hwUWtGQlV5eFRRVUZUTEZOQlFWTXNUVUZCVFR0QlFVTnFReXh4UWtGQllUdEJRVUZCTzBGQlFVRTdRVUZIY2tJN1FVRkRRU3hYUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWxtTEVsQlFVa3NVVUZCVVR0QlFVTmFMRTFCUVUwc1QwRkJUeXhUUVVGVExGTkJRVk1zU1VGQlNTeHhRa0ZCY1VJN1FVRkJRU3hGUVVOd1JDeFJRVUZSTEZOQlFWVXNZMEZCWXp0QlFVTTFRaXhSUVVGSkxFdEJRVXNzU1VGQlNTeE5RVUZOTzBGQlEyNUNMRmRCUVU4c1IwRkJSenRCUVVGQk8wRkJRVUVzUlVGRlpDeFJRVUZSTEZOQlFWVXNUVUZCVFR0QlFVTndRaXhYUVVGUExFbEJRVWtzVFVGQlRTeE5RVUZOTEVOQlFVVXNVVUZCVVN4TFFVRk5MRTlCUVU4c1MwRkJTeXhUUVVGVkxFbEJRVWs3UVVGRE4wUXNVMEZCUnp0QlFVTklMR0ZCUVU4N1FVRkJRU3hQUVVOU0xFMUJRVTBzZFVKQlFYVkNMRmRCUVZrN1FVRkJSU3hoUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTEVWQlJYcEVMR3RDUVVGclFpeFRRVUZWTEVsQlFVazdRVUZETlVJc1VVRkJTVHRCUVVOQkxHRkJRVThzYVVKQlFXbENMRTFCUVUwc1kwRkJZeXhMUVVGTE8wRkJRVUVzWVVGRk9VTXNTMEZCVUR0QlFVTkpMR0ZCUVU4c1ZVRkJWU3hKUVVGSkxGZEJRVmM3UVVGQlFUdEJRVUZCTzBGQlFVRXNSVUZIZUVNc1lVRkJZU3hYUVVGWk8wRkJRM0pDTEcxQ1FVRmxMRk5CUVZNN1FVRkRjRUlzWVVGQlR5eE5RVUZOTzBGQlFVRTdRVUZGYWtJc1YwRkJUenRCUVVGQk8wRkJRVUVzUlVGRldDeHRRa0ZCYlVJc1UwRkJWU3hYUVVGWE8wRkJRM0JETEZkQlFVOHNTVUZCU1N4UlFVTlFMRTlCUVU4c1NVRkJTU3hYUVVGWExHRkJRM1JDTzBGQlFVRTdRVUZCUVN4RlFVVlNPMEZCUVVFc1JVRkJWU3hQUVVGUExGTkJRVlVzWVVGQllUdEJRVU53UXl4WFFVRlBMRmRCUVZrN1FVRkRaaXhWUVVGSk8wRkJRMEVzV1VGQlNTeExRVUZMTEdOQlFXTXNXVUZCV1N4TlFVRk5MRTFCUVUwN1FVRkRMME1zV1VGQlNTeERRVUZETEUxQlFVMHNUMEZCVHl4SFFVRkhMRk5CUVZNN1FVRkRNVUlzYVVKQlFVOHNZVUZCWVN4UlFVRlJPMEZCUTJoRExHVkJRVTg3UVVGQlFTeGxRVVZLTEVkQlFWQTdRVUZEU1N4bFFVRlBMRlZCUVZVN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVWN4UWl4UFFVRlBMRk5CUVZVc1lVRkJZU3hOUVVGTkxFMUJRVTA3UVVGRGVrTXNVVUZCU1R0QlFVTkJMRlZCUVVrc1MwRkJTeXhqUVVGakxGbEJRVmtzVFVGQlRTeE5RVUZOTEZGQlFWRTdRVUZEZGtRc1ZVRkJTU3hEUVVGRExFMUJRVTBzVDBGQlR5eEhRVUZITEZOQlFWTTdRVUZETVVJc1pVRkJUeXhoUVVGaExGRkJRVkU3UVVGRGFFTXNZVUZCVHp0QlFVRkJMR0ZCUlVvc1IwRkJVRHRCUVVOSkxHRkJRVThzVlVGQlZUdEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVZDZRaXh2UWtGQmIwSTdRVUZCUVN4SlFVTm9RaXhMUVVGTExGZEJRVms3UVVGQlJTeGhRVUZQTEVsQlFVa3NVMEZCVXp0QlFVRkJPMEZCUVVFN1FVRkJRU3hGUVVONFF5eFRRVUZUTEZOQlFWVXNiVUpCUVcxQ0xHbENRVUZwUWp0QlFVTjBSQ3hSUVVGSkxGVkJRVlVzWVVGQllTeFJRVUZSTEU5QlFVOHNjMEpCUVhOQ0xHRkJRelZFTEUxQlFVMHNhMEpCUVd0Q0xIRkNRVU40UWl4dFFrRkRReXhSUVVGUkxHMUNRVUZ0UWp0QlFVTm9ReXhYUVVGUExFbEJRVWtzVVVGRFVDeEpRVUZKTEUxQlFVMHNVVUZCVVN4WFFVTnNRanRCUVVGQk8wRkJRVUVzUlVGRlVpeFRRVUZUTzBGQlFVRXNSVUZEVkN4UFFVRlBPMEZCUVVFc1NVRkRTQ3hMUVVGTExGZEJRVms3UVVGQlJTeGhRVUZQTzBGQlFVRTdRVUZCUVN4SlFVTXhRaXhMUVVGTExGTkJRVlVzVDBGQlR6dEJRVU5zUWl4bFFVRlRMRTlCUVU4c1ZVRkJWU3hWUVVGVkxGZEJRVms3UVVGQlJTeGxRVUZQTzBGQlFVRXNWVUZCVlR0QlFVRkJPMEZCUVVFN1FVRkJRU3hGUVVjelJUdEJRVUZCTEVWQlFXZENPMEZCUVVFc1JVRkJaMEk3UVVGQlFTeEZRVUZqTzBGQlFVRXNSVUZET1VNN1FVRkJRU3hGUVVGblFpeEpRVUZKTzBGQlFVRXNSVUZCWXp0QlFVRkJMRVZCUTJ4RE8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlFUUkNPMEZCUVVFc1JVRkJORUk3UVVGQlFTeEZRVUUwUWp0QlFVRkJMRVZCUVRSQ08wRkJRVUVzUlVGQmMwSTdRVUZCUVN4RlFVRTRRaXhOUVVGTk8wRkJRVUVzUlVGRE1VczdRVUZCUVN4RlFVTkJMRkZCUVZFN1FVRkJRU3hGUVVOU08wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRXNZMEZCWXp0QlFVRkJMRVZCUTJRc1VVRkJVVHRCUVVGQkxFVkJRV1VzVTBGQlV5eGpRVUZqTEUxQlFVMHNTMEZETDBNc1NVRkJTU3hUUVVGVkxFZEJRVWM3UVVGQlJTeFhRVUZQTEZOQlFWTTdRVUZCUVN4TFFVTnVReXhQUVVGUExGTkJRVlVzUjBGQlJ5eEhRVUZITEVkQlFVYzdRVUZCUlN4WFFVRlBMRWxCUVVzc1NVRkJTU3hMUVVGTExFbEJRVWtzU1VGQlNTeEpRVUZKTzBGQlFVRTdRVUZCUVR0QlFVTjBSU3hOUVVGTkxGTkJRVk1zVlVGQlZTeE5RVUZOTEdGQlFXRTdRVUZGTlVNc2NVSkJRWEZDTEdGQlFXRTdRVUZET1VJc1RVRkJTU3hSUVVGUk8wRkJRMW9zVFVGQlNUdEJRVU5CTEhsQ1FVRnhRanRCUVVOeVFpeHBRa0ZCWVN4WlFVRlpMRXRCUVVzN1FVRkJRU3haUVVWc1F6dEJRVU5KTEhsQ1FVRnhRanRCUVVGQk8wRkJRVUU3UVVGSE4wSXNTVUZCU1N4dFFrRkJiVUk3UVVGRGRrSXNTVUZCU1N4eFFrRkJjVUk3UVVGRGVrSXNTVUZCU1N4dFFrRkJiVUk3UVVGRGRrSXNTVUZCU1N4UFFVRlBMR0ZCUVdFc1pVRkJaU3hUUVVGVExHdENRVUZyUWp0QlFVTTVSQ3hOUVVGSkxHdENRVUZyUWl4WFFVRlpPMEZCUXpsQ0xGRkJRVWtzVTBGQlV5eHZRa0ZCYjBJc1YwRkJWenRCUVVONFF5eFZRVUZKTEU5QlFVOHNTMEZCU3l4clFrRkJhMElzVTBGQlV5eEhRVUZITzBGQlF6RkRMRzlDUVVGWk8wRkJRVUU3UVVGRmFFSXNlVUpCUVcxQ08wRkJRVUU3UVVGQlFUdEJRVWN6UWl4WFFVRlRMR2xDUVVGcFFpeHZRa0ZCYjBJN1FVRkRPVU1zY1VKQlFXMUNMRk5CUVZVc1kwRkJZenRCUVVOMlF5d3lRa0ZCZFVJc2EwSkJRV3RDTzBGQlEzcERPMEZCUVVFN1FVRkJRVHRCUVVsU0xFbEJRVWtzVDBGQlR5eHhRa0ZCY1VJc1lVRkJZVHRCUVVONlF5eE5RVUZKTEU5QlFVOHNTVUZCU1N4cFFrRkJhVUk3UVVGRGFFTXNaVUZCWVN4bFFVRmxMRk5CUVZVc1kwRkJZenRCUVVOb1JDeFJRVUZKTEVOQlFVTXNiMEpCUVc5Q08wRkJRM0pDTEZkQlFVc3NXVUZCV1R0QlFVRkJPMEZCUVVFN1FVRkhla0lzVDBGQlN5eFpRVUZaTEZOQlFWVXNTVUZCU1R0QlFVTXpRaXhSUVVGSkxFZEJRVWM3UVVGRFNDeDFRa0ZCYVVJc1IwRkJSenRCUVVGQk8wRkJRVUVzVjBGSGRrSXNUMEZCVHl4cFFrRkJhVUlzWVVGQllUdEJRVU14UXl4bFFVRmhMR1ZCUVdVc1UwRkJWU3hqUVVGak8wRkJRMmhFTEZGQlFVazdRVUZEUVN4VlFVRkpMRU5CUVVNc2IwSkJRVzlDTzBGQlEzSkNMSEZDUVVGaExGRkJRVkVzY1VKQlFYRkNMRXRCUVVzc1ZVRkJWVHRCUVVGQkxGVkJRM0pFTEUxQlFVMHNTMEZCU3p0QlFVRkJMRlZCUTFnN1FVRkJRVHRCUVVGQk8wRkJRVUVzWVVGSlRDeExRVUZRTzBGQlFVRTdRVUZCUVR0QlFVVktMRzFDUVVGcFFpeFhRVUZYTEZOQlFWVXNTVUZCU1R0QlFVTjBReXhSUVVGSkxFZEJRVWNzVVVGQlVTeHhRa0ZCY1VJN1FVRkRhRU1zVlVGQlNTeFBRVUZQTEV0QlFVc3NUVUZCVFN4SFFVRkhPMEZCUTNwQ0xGVkJRVWs3UVVGRFFTeDVRa0ZCYVVJc1MwRkJTenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXQwUXl4aFFVRmhMR3RDUVVGclFqdEJRVU12UWl4VFFVRlRMRTlCUVU4N1FVRkZhRUlzWlVGQlpUdEJRVU5tT3lJc0NpQWdJbTVoYldWeklqb2dXMTBLZlFvPVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLFdBQVc7QUFDMUIsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDcEQsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6RCxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDckIsUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixLQUFLO0FBQ0wsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUNiLEdBQUcsQ0FBQztBQUNKLEVBQUUsT0FB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QUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFO0FBQzdDLElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLEdBQUcsQ0FBQztBQUNKLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxPQUFPLEVBQUU7QUFDN0MsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDO0FBQ0osRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLFFBQVEsRUFBRTtBQUM3QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxHQUFHLENBQUM7QUFDSixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsWUFBWSxFQUFFO0FBQ3BELElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JELEdBQUcsQ0FBQztBQUNKLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsV0FBVztBQUM3QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakUsR0FBRyxDQUFDO0FBQ0osRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUssRUFBRTtBQUM3QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMs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LENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNCLEtBQUs7QUFDTCxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzFCLE1BQU0sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxNQUFNLE9BQU8sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDNUQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3BDLE1BQU0sT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQixHQUFHLENBQUM7QUFDSixFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsRUFBRSxFQUFFO0FBQy9DLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQ3RDLE1BQU0sSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUMzQixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtBQUM3RSxRQUFRLElBQUks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QyxJQUFJLElBQUksVUFBVSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN2QyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzFDLFFBQVEsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0UsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUMxQyxRQUFRLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFRLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDbEIsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUM7QUFDcEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsR0FBRztBQUNILEVBQUUsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sSUFBSSxHQUFHLEtBQUssTUFBTTtBQUNuRCxJQUFJLE9BQU8sR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELEVBQUUsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEtBQUssTUFBTTtBQUMzQyxJQUFJLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLEVBQUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUNELFNBQVMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ3JFLEVBQUUsSUFBSSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDL0csRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNqQyxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQ2pDLEdBQUcsQ0FBQyxFQUFFO0FBQ04sSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDOUMsR0FBRztBQUNILEVBQUUsU0FBUyxhQUFhLENBQUMsR0FBRyxFQUFFO0FBQzlCLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsSUFBSSxPQUFPLEdBQUcsR0FBRyxLQUFLLE1BQU0sR0FBRyxhQUFhLEdBQUcsb0JBQW9CLENBQUM7QUFDcEUsSUFBSSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsTUFBTSxFQUFFO0FBQ3BELE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzFELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDM0IsTUFBTSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDakQsTUFBTSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDdEIsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLFlBQVksR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ2pELE1BQU0sT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3BCLElBQUksYUFBYSxHQUFHLEdBQUcsS0FBSyxNQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztBQUNqRCxHQUFHO0FBQ0gsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLFdBQVc7QUFDN0QsSUFBSSxPQUFPLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMvRSxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixHQUFHLFNBQVMsVUFBVSxFQUFFO0FBQzlDLElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsQ0FBQztBQUNKLEVBQUUsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7QUFDOUIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDckQsSUFBSSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3pCLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO0FBQy9CLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFDbkIsSUFBSSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDLEVBQUU7QUFDNUQsTUFBTSxPQUFPLElBQUksQ0FBQztBQUNsQixLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ3RDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzdELFFBQVEsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckcsUUFBUSxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksb0JBQW9CLEtBQUssSUFBSTtBQUM1RCxVQUFVLG1CQUFtQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsYUFBYSxJQUFJLG9CQUFvQixLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzdGLFVBQVUsb0JBQW9CLEdBQUcsTUFBTSxDQUFDO0FBQ3hDLFNBQVM7QUFDVCxPQUFPO0FBQ1AsTUFBTSxJQUFJLG9CQUFvQixLQUFLLElBQUksRUFBRTtBQUN6QyxRQUFRLE9BQU8sQ0FBQyxXQUFXO0FBQzNCLFVBQVUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsR0FBRyxhQUFhLENBQUMsQ0FBQztBQUNoRSxTQUFTLENBQUMsQ0FBQztBQUNYLE9BQU8sTUFBTTtBQUNiLFFBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLE9BQU87QUFDUCxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ25CLEtBQUs7QUFDTCxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO0FBQ3pELEVBQUUsT0FBTztBQUNULElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLEtBQUs7QUFDVCxJQUFJLEtBQUs7QUFDVCxJQUFJLFNBQVM7QUFDYixJQUFJLFNBQVM7QUFDYixHQUFHLENBQUM7QUFDSixDQUFDO0FBQ0QsU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQzNCLEVBQUUsT0FBTztBQUNULElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNELElBQUksV0FBVyxHQUFHLFdBQVc7QUFDN0IsRUFBRSxTQUFTLFlBQVksR0FBRztBQUMxQixHQUFHO0FBQ0gsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFO0FBQzlELElBQUksR0FBRyxFQUFFLFdBQVc7QUFDcEIsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUM7QUFDM0MsS0FBSztBQUNMLElBQUksVUFBVSxFQUFFLEtBQUs7QUFDckIsSUFBSSxZQUFZLEVBQUUsSUFBSTtBQUN0QixHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUU7QUFDdEYsSUFBSSxZQUFZLEdBQUcsWUFBWSxLQUFLLEtBQUssQ0FBQztBQUMxQyxJQUFJLFlBQVksR0FBRyxZQUFZLEtBQUssSUFBSSxDQUFDO0FBQ3pDLElBQUksSUFBSTtBQUNSLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLFlBQVksSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLFlBQVksSUFBSSxZQUFZLENBQUM7QUFDM0ksUUFBUSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXO0FBQ2xELFFBQVEsT0FBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZFLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2hCLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxLQUFLLEVBQUU7QUFDbEQsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJO0FBQ3JCLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDOUMsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVztBQUNoRCxNQUFNLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLEtBQUssRUFBRTtBQUNqRCxJQUFJLElBQUksS0FBSyxJQUFJLElBQUk7QUFDckIsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUM5QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXO0FBQ2hELE1BQU0sT0FBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlDLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLEtBQUssRUFBRTtBQUN4RCxJQUFJLElBQUksS0FBSyxJQUFJLElBQUk7QUFDckIsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUM5QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXO0FBQ2hELE1BQU0sT0FBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9DLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLEtBQUssRUFBRTtBQUNqRCxJQUFJLElBQUksS0FBSyxJQUFJLElBQUk7QUFDckIsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUM5QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXO0FBQ2hELE1BQU0sT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxLQUFLLEVBQUU7QUFDeEQsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJO0FBQ3JCLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDOUMsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVztBQUNoRCxNQUFNLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLEdBQUcsRUFBRTtBQUNwRCxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtBQUMvQixNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN6QyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUQsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLG9CQUFvQixHQUFHLFNBQVMsR0FBRyxFQUFFO0FBQzlELElBQUksSUFBSSxHQUFHLEtBQUssRUFBRTtBQUNsQixNQUFNLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxJQUFJLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN2RCxNQUFNLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekIsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxFQUFFO0FBQzFELElBQUksT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZELE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsV0FBVztBQUN0RCxJQUFJLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3pELElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7QUFDeEIsTUFBTSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxJQUFJLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN2RCxNQUFNLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNqQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsR0FBRyxXQUFXO0FBQ2hFLElBQUksSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN4QixNQUFNLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLElBQUksT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZELE1BQU0sT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ2hDLFFBQVEsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxPQUFPLENBQUMsQ0FBQztBQUNULEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdkIsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxXQUFXO0FBQzVDLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLElBQUksSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekQsSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzVCLElBQUksSUFBSTtBQUNSLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QixLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDaEIsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0wsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN4QixNQUFNLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXO0FBQ2pELE1BQU0sT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEQsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLFNBQVMsRUFBRTtBQUMvQyxNQUFNLE9BQU8sR0FBRyxTQUFTLEtBQUssTUFBTSxHQUFHLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUM1RSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsS0FBSyxDQUFDO0FBQ04sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN2RCxNQUFNLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDM0IsTUFBTSxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDWixRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDOUIsVUFBVSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsVUFBVSxPQUFPLEtBQUssQ0FBQztBQUN2QixTQUFTO0FBQ1QsT0FBTztBQUNQLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN0QyxRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sTUFBTTtBQUNiLFFBQVEsT0FBTyxDQUFDLFdBQVc7QUFDM0IsVUFBVSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNyQixPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUssRUFBRTtBQUNwRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEgsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxXQUFXO0FBQzdDLElBQUksSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN4QixNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLElBQUksSUFBSTtBQUNSLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2hCLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMLElBQUksSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDL0MsTUFBTSxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNiLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN4RCxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ2hFLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2SCxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQzNCLE1BQU0sT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssRUFBRTtBQUN0QyxNQUFNLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5RixLQUFLLENBQUMsRUFBRTtBQUNSLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLDRIQUE0SCxFQUFFLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNsTCxLQUFLO0FBQ0wsSUFBSSxJQUFJLGFBQWEsR0FBRyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxLQUFLLEtBQUssQ0FBQztBQUNwRSxJQUFJLElBQUksYUFBYSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQztBQUNsRSxJQUFJLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDMUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDcEMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDekIsUUFBUSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2hGLFVBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxVQUFVLE1BQU07QUFDaEIsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDakIsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLE1BQU0sT0FBTyxPQUFPLENBQUM7QUFDckIsS0FBSztBQUNMLElBQUksSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQ2xDLElBQUksU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMvQixNQUFNLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUNaLElBQUksSUFBSTtBQUNSLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM1QixLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDakIsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0wsSUFBSSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDckIsSUFBSSxJQUFJLHVCQUF1QixHQUFHLGFBQWEsR0FBRyxTQUFTLEdBQUcsRUFBRTtBQUNoRSxNQUFNLE9BQU8sU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEQsS0FBSyxHQUFHLFNBQVMsR0FBRyxFQUFFO0FBQ3RCLE1BQU0sT0FBTyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksdUJBQXVCLEdBQUcsYUFBYSxHQUFHLFNBQVMsR0FBRyxFQUFFO0FBQ2hFLE1BQU0sT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRCxLQUFLLEdBQUcsU0FBUyxHQUFHLEVBQUU7QUFDdEIsTUFBTSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7QUFDeEMsTUFBTSxPQUFPLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1RSxLQUFLO0FBQ0wsSUFBSSxJQUFJLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQztBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVztBQUNqRCxNQUFNLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVGLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxTQUFTLEVBQUU7QUFDL0MsTUFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7QUFDaEMsUUFBUSxRQUFRLEdBQUcsdUJBQXVCLENBQUM7QUFDM0MsUUFBUSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQ2xDLE9BQU8sTUFBTTtBQUNiLFFBQVEsUUFBUSxHQUFHLHVCQUF1QixDQUFDO0FBQzNDLFFBQVEsYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUNuQyxPQUFPO0FBQ1AsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVCLEtBQUssQ0FBQztBQUNOLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3ZELE1BQU0sSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMzQixNQUFNLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzVCLFFBQVEsRUFBRSxRQUFRLENBQUM7QUFDbkIsUUFBUSxJQUFJLFFBQVEsS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFVBQVUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNCLFVBQVUsT0FBTyxLQUFLLENBQUM7QUFDdkIsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNLElBQUkscUJBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdEMsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixPQUFPLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3JHLFFBQVEsT0FBTyxLQUFLLENBQUM7QUFDckIsT0FBTyxNQUFNO0FBQ2IsUUFBUSxPQUFPLENBQUMsV0FBVztBQUMzQixVQUFVLElBQUksYUFBYSxLQUFLLFNBQVM7QUFDekMsWUFBWSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsWUFBWSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNyQixPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxXQUFXO0FBQ3RELElBQUksSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMvQixNQUFNLE9BQU8sT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQ25DLEtBQUssQ0FBQyxFQUFFO0FBQ1IsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztBQUNyRSxLQUFLO0FBQ0wsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN4QixNQUFNLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDakQsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUNwQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ1IsR0FBRyxDQUFDO0FBQ0osRUFBRSxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDLEVBQUUsQ0FBQztBQUNKLFNBQVMsNEJBQTRCLENBQUMsRUFBRSxFQUFFO0FBQzFDLEVBQUUsT0FBTyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0FBQ3ZHLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHO0FBQ2hCLE1BQU0sS0FBSztBQUNYLE1BQU0sS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUs7QUFDM0MsTUFBTSxFQUFFLEVBQUUsWUFBWTtBQUN0QixLQUFLLENBQUM7QUFDTixJQUFJLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ3ZDLElBQUksSUFBSSxDQUFDLFNBQVM7QUFDbEIsTUFBTSxNQUFNLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3hDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hFLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEMsTUFBTSxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDL0IsTUFBTSxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDL0IsTUFBTSxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUM3QyxHQUFHLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxTQUFTLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtBQUNwQyxFQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQzlCLElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsSUFBSSxPQUFPLEtBQUssQ0FBQztBQUNqQixHQUFHLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsRUFBRSxJQUFJLEtBQUssQ0FBQyxlQUFlO0FBQzNCLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzVCLEVBQUUsSUFBSSxLQUFLLENBQUMsY0FBYztBQUMxQixJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBQ0QsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUMvQyxJQUFJLFdBQVcsR0FBRyxXQUFXO0FBQzdCLEVBQUUsU0FBUyxZQUFZLEdBQUc7QUFDMUIsR0FBRztBQUNILEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsV0FBVztBQUM1QyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTTtBQUMzQyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxXQUFXO0FBQzlDLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxFQUFFO0FBQ2hDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNO0FBQ3JCLFFBQVEsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDaEMsTUFBTSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUMvRCxRQUFRLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEQsUUFBUSxJQUFJO0FBQ1osVUFBVSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUM5QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQztBQUN2RCxHQUFHLENBQUM7QUFDSixFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsUUFBUSxFQUFFO0FBQ3JELElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO0FBQ2xCLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDbEIsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUM5QixJQUFJLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNqRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDN0IsTUFBTSxRQUFRLFdBQVcsSUFBSSxXQUFXLENBQUMsSUFBSTtBQUM3QyxRQUFRLEtBQUsscUJBQXFCO0FBQ2xDLFVBQVUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDM0QsUUFBUSxLQUFLLGlCQUFpQjtBQUM5QixVQUFVLE1BQU0sSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUUsUUFBUTtBQUNSLFVBQVUsTUFBTSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkQsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtBQUNwQixNQUFNLE1BQU0sSUFBSSxVQUFVLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNqRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQztBQUM3QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUcsSUFBSSxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUN6QyxNQUFNLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QixNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUN6QyxNQUFNLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QixNQUFNLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUUsTUFBTSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUMzQixNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXO0FBQzFDLE1BQU0sS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDM0IsTUFBTSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDdkIsTUFBTSxJQUFJLGNBQWMsSUFBSSxRQUFRLEVBQUU7QUFDdEMsUUFBUSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUNoRSxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRTtBQUNuRSxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLElBQUksSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVc7QUFDekQsTUFBTSxPQUFPLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBQzNFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQ3BCLE1BQU0sT0FBTyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0FBQzdELElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDeEIsTUFBTSxPQUFPLElBQUksWUFBWSxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUN4RCxRQUFRLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVztBQUM3QyxVQUFVLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JFLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSyxNQUFNLElBQUksVUFBVSxFQUFFO0FBQzNCLE1BQU0sT0FBTyxRQUFRLENBQUMsV0FBVztBQUNqQyxRQUFRLElBQUksRUFBRSxHQUFHLElBQUksWUFBWSxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM1RCxVQUFVLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QixVQUFVLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlDLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUk7QUFDM0IsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyQyxTQUFTLENBQUMsQ0FBQztBQUNYLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0FBQzlCLFVBQVUsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsU0FBUyxDQUFDLENBQUM7QUFDWCxRQUFRLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFFBQVEsT0FBTyxFQUFFLENBQUM7QUFDbEIsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUN6RCxRQUFRLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFFBQVEsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUk7QUFDekIsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuQyxPQUFPLENBQUMsQ0FBQztBQUNULE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDcEIsTUFBTSxPQUFPLENBQUMsQ0FBQztBQUNmLEtBQUs7QUFDTCxHQUFHLENBQUM7QUFDSixFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVc7QUFDNUMsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDcEQsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLFdBQVcsRUFBRTtBQUN6RCxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixJQUFJLElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEQsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDMUIsTUFBTSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDMUQsUUFBUSxPQUFPLE9BQU8sQ0FBQztBQUN2QixPQUFPLENBQUMsQ0FBQztBQUNULEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDakMsTUFBTSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUM5QixNQUFNLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRSxNQUFNLENBQUMsU0FBUyxJQUFJLEdBQUc7QUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDMUIsUUFBUSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTTtBQUN4QyxVQUFVLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUN2QyxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVc7QUFDNUIsVUFBVSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUNoRCxPQUFPLEdBQUcsQ0FBQztBQUNYLEtBQUs7QUFDTCxJQUFJLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUM5QyxJQUFJLE9BQU8sSUFBSSxZQUFZLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ3RELE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRTtBQUNqQyxRQUFRLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RSxPQUFPLEVBQUUsU0FBUyxHQUFHLEVBQUU7QUFDdkIsUUFBUSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVc7QUFDNUIsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssa0JBQWtCLEVBQUU7QUFDckQsVUFBVSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUNsQyxTQUFTO0FBQ1QsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQztBQUNKLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsV0FBVztBQUM1QyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDeEIsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLFNBQVMsRUFBRTtBQUNyRCxJQUFJLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM3RSxJQUFJLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7QUFDekMsTUFBTSxPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxJQUFJLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0MsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3RCLE1BQU0sTUFBTSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3ZGLEtBQUs7QUFDTCxJQUFJLElBQUkscUJBQXFCLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hGLElBQUkscUJBQXFCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvRCxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxxQkFBcUIsQ0FBQztBQUN0RCxJQUFJLE9BQU8scUJBQXFCLENBQUM7QUFDakMsR0FBRyxDQUFDO0FBQ0osRUFBRSxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDLEVBQUUsQ0FBQztBQUNKLFNBQVMsNEJBQTRCLENBQUMsRUFBRSxFQUFFO0FBQzFDLEVBQUUsT0FBTyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUMvRyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQzNCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDekIsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQztBQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksWUFBWSxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNsRSxNQUFNLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQy9CLE1BQU0sS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDN0IsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDckMsTUFBTSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUMzQixNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRTtBQUNuQixNQUFNLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDbkMsTUFBTSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUMzQixNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixNQUFNLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNyRyxNQUFNLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ2xGLEVBQUUsT0FBTztBQUNULElBQUksSUFBSTtBQUNSLElBQUksT0FBTztBQUNYLElBQUksTUFBTTtBQUNWLElBQUksS0FBSztBQUNULElBQUksSUFBSTtBQUNSLElBQUksUUFBUTtBQUNaLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxFQUFFLEtBQUssS0FBSyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7QUFDL0csR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNELFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRTtBQUNsQyxFQUFFLE9BQU8sT0FBTyxPQUFPLEtBQUssUUFBUSxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3ZHLENBQUM7QUFDRCxTQUFTLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ25ELEVBQUUsT0FBTztBQUNULElBQUksSUFBSTtBQUNSLElBQUksT0FBTztBQUNYLElBQUksT0FBTztBQUNYLElBQUksV0FBVyxFQUFFLElBQUk7QUFDckIsSUFBSSxTQUFTLEVBQUUsYUFBYSxDQUFDLE9BQU8sRUFBRSxTQUFTLEtBQUssRUFBRTtBQUN0RCxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLEtBQUssQ0FBQztBQUNOLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRCxTQUFTLGVBQWUsQ0FBQyxPQUFPLEVBQUU7QUFDbEMsRUFBRSxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDdkIsSUFBSSxPQUFPLFdBQVc7QUFDdEIsTUFBTSxPQUFPLEtBQUssQ0FBQyxDQUFDO0FBQ3BCLEtBQUssQ0FBQztBQUNOLEdBQUcsTUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtBQUMxQyxJQUFJLE9BQU8seUJBQXlCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsR0FBRyxNQUFNO0FBQ1QsSUFBSSxPQUFPLFNBQVMsR0FBRyxFQUFFO0FBQ3pCLE1BQU0sT0FBTyxZQUFZLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLEtBQUssQ0FBQztBQUNOLEdBQUc7QUFDSCxDQUFDO0FBQ0QsU0FBUyx5QkFBeUIsQ0FBQyxPQUFPLEVBQUU7QUFDNUMsRUFBRSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxQixJQUFJLE9BQU8sU0FBUyxHQUFHLEVBQUU7QUFDekIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxQixLQUFLLENBQUM7QUFDTixHQUFHLE1BQU07QUFDVCxJQUFJLE9BQU8sU0FBUyxHQUFHLEVBQUU7QUFDekIsTUFBTSxPQUFPLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEMsS0FBSyxDQUFDO0FBQ04sR0FBRztBQUNILENBQUM7QUFDRCxTQUFTLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFDN0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFDRCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsU0FBUyxlQUFlLENBQUMsT0FBTyxFQUFFO0FBQ2xDLEVBQUUsT0FBTyxPQUFPLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN6RyxDQUFDO0FBQ0QsU0FBUyxZQUFZLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFO0FBQzVELEVBQUUsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MsRUFBRSxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLElBQUksSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pELElBQUksT0FBTztBQUNYLE1BQU0sTUFBTSxFQUFFO0FBQ2QsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7QUFDdEIsUUFBUSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEtBQUssRUFBRTtBQUM1QyxVQUFVLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDL0IsVUFBVSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQzNFLFVBQVUsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLFVBQVUsSUFBSSxRQUFRLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQztBQUN6QyxVQUFVLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUNsQyxVQUFVLElBQUksTUFBTSxHQUFHO0FBQ3ZCLFlBQVksSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQzVCLFlBQVksVUFBVSxFQUFFO0FBQ3hCLGNBQWMsSUFBSSxFQUFFLElBQUk7QUFDeEIsY0FBYyxZQUFZLEVBQUUsSUFBSTtBQUNoQyxjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsT0FBTztBQUNyQixjQUFjLGFBQWE7QUFDM0IsY0FBYyxNQUFNLEVBQUUsSUFBSTtBQUMxQixjQUFjLFVBQVUsRUFBRSxlQUFlLENBQUMsT0FBTyxDQUFDO0FBQ2xELGFBQWE7QUFDYixZQUFZLE9BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLFNBQVMsRUFBRTtBQUN4RSxjQUFjLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDbkMsY0FBYyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3BILGNBQWMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELGNBQWMsSUFBSSxPQUFPLEdBQUc7QUFDNUIsZ0JBQWdCLElBQUk7QUFDcEIsZ0JBQWdCLFFBQVEsRUFBRSxTQUFTO0FBQ25DLGdCQUFnQixPQUFPLEVBQUUsUUFBUTtBQUNqQyxnQkFBZ0IsTUFBTTtBQUN0QixnQkFBZ0IsVUFBVTtBQUMxQixnQkFBZ0IsVUFBVSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUM7QUFDckQsZUFBZSxDQUFDO0FBQ2hCLGNBQWMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNsRSxjQUFjLE9BQU8sT0FBTyxDQUFDO0FBQzdCLGFBQWEsQ0FBQztBQUNkLFlBQVksaUJBQWlCLEVBQUUsU0FBUyxRQUFRLEVBQUU7QUFDbEQsY0FBYyxPQUFPLGNBQWMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMvRCxhQUFhO0FBQ2IsV0FBVyxDQUFDO0FBQ1osVUFBVSxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwRCxVQUFVLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUMvQixZQUFZLGNBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3pFLFdBQVc7QUFDWCxVQUFVLE9BQU8sTUFBTSxDQUFDO0FBQ3hCLFNBQVMsQ0FBQztBQUNWLE9BQU87QUFDUCxNQUFNLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNqUixLQUFLLENBQUM7QUFDTixHQUFHO0FBQ0gsRUFBRSxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQztBQUN4QixNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQ2xCLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDeEIsTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7QUFDbEUsSUFBSSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQzNHLElBQUksSUFBSSxRQUFRLEdBQUcsS0FBSyxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssS0FBSyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssS0FBSyxLQUFLLENBQUMsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZPLElBQUksT0FBTyxRQUFRLENBQUM7QUFDcEIsR0FBRztBQUNILEVBQUUsU0FBUyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUU7QUFDMUMsSUFBSSxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBQ3JDLElBQUksU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUN2RyxNQUFNLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFFBQVEsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoQyxRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsUUFBUSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUM3QyxRQUFRLElBQUksVUFBVSxHQUFHLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQztBQUMxRCxRQUFRLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssYUFBYTtBQUN0RSxVQUFVLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDN0QsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUssSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDO0FBQzdELFFBQVEsSUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUMvRCxVQUFVLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUMzRixTQUFTO0FBQ1QsUUFBUSxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQ3hCLFVBQVUsT0FBTyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFGLFFBQVEsSUFBSSxHQUFHLENBQUM7QUFDaEIsUUFBUSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBUSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBUSxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDNUIsUUFBUSxJQUFJLFlBQVksR0FBRyxTQUFTLEtBQUssRUFBRTtBQUMzQyxVQUFVLEVBQUUsV0FBVyxDQUFDO0FBQ3hCLFVBQVUsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFNBQVMsQ0FBQztBQUNWLFFBQVEsSUFBSSxJQUFJLEtBQUssYUFBYSxFQUFFO0FBQ3BDLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDOUIsWUFBWSxPQUFPLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDOUIsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMzQztBQUNBLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLFNBQVMsTUFBTTtBQUNmLFVBQVUsSUFBSSxHQUFHLEdBQUcsVUFBVSxHQUFHLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0gsVUFBVSxJQUFJLFVBQVUsRUFBRTtBQUMxQixZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDN0MsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEgsY0FBYyxHQUFHLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUN6QyxhQUFhO0FBQ2IsV0FBVyxNQUFNO0FBQ2pCLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUM3QyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELGNBQWMsR0FBRyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDekMsYUFBYTtBQUNiLFdBQVc7QUFDWCxTQUFTO0FBQ1QsUUFBUSxJQUFJLElBQUksR0FBRyxTQUFTLEtBQUssRUFBRTtBQUNuQyxVQUFVLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQy9DLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDMUMsWUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxLQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckUsV0FBVyxDQUFDLENBQUM7QUFDYixVQUFVLE9BQU8sQ0FBQztBQUNsQixZQUFZLFdBQVc7QUFDdkIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksT0FBTyxFQUFFLElBQUksS0FBSyxRQUFRLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLEVBQUU7QUFDekUsY0FBYyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDakMsYUFBYSxDQUFDO0FBQ2QsWUFBWSxVQUFVO0FBQ3RCLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUyxDQUFDO0FBQ1YsUUFBUSxHQUFHLENBQUMsT0FBTyxHQUFHLFNBQVMsS0FBSyxFQUFFO0FBQ3RDLFVBQVUsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RCLFNBQVMsQ0FBQztBQUNWLFFBQVEsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDN0IsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLO0FBQ0wsSUFBSSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDOUIsTUFBTSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ2pILE1BQU0sT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDbkQsUUFBUSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLFFBQVEsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUN2RCxRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsUUFBUSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxRSxRQUFRLElBQUksU0FBUyxHQUFHLE9BQU8sR0FBRyxNQUFNLEdBQUcsWUFBWSxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUNsRyxRQUFRLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxFQUFFLGVBQWUsSUFBSSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxSyxRQUFRLEdBQUcsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsUUFBUSxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUMxQyxVQUFVLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDbEMsVUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLFlBQVksT0FBTztBQUNuQixXQUFXO0FBQ1gsVUFBVSxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsV0FBVyxDQUFDO0FBQ3ZDLFVBQVUsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDOUIsVUFBVSxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3RCxVQUFVLElBQUkseUJBQXlCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0FBQ3BFLFVBQVUsSUFBSSx5QkFBeUI7QUFDdkMsWUFBWSx5QkFBeUIsR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0UsVUFBVSxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzRCxVQUFVLElBQUkseUJBQXlCLEdBQUcsV0FBVztBQUNyRCxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxXQUFXLENBQUM7QUFDWixVQUFVLElBQUksc0JBQXNCLEdBQUcsV0FBVztBQUNsRCxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxXQUFXLENBQUM7QUFDWixVQUFVLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQy9CLFVBQVUsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLHlCQUF5QixDQUFDO0FBQ2pILFVBQVUsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDckMsVUFBVSxNQUFNLENBQUMsSUFBSSxHQUFHLFdBQVc7QUFDbkMsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDN0IsWUFBWSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDM0IsWUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVztBQUN6QyxjQUFjLE9BQU8sTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVztBQUMvQixjQUFjLE9BQU8sS0FBSyxDQUFDO0FBQzNCLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsV0FBVyxDQUFDO0FBQ1osVUFBVSxNQUFNLENBQUMsS0FBSyxHQUFHLFNBQVMsUUFBUSxFQUFFO0FBQzVDLFlBQVksSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLGdCQUFnQixFQUFFLGVBQWUsRUFBRTtBQUMzRixjQUFjLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hELGNBQWMsR0FBRyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRSxjQUFjLE1BQU0sQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDO0FBQzVDLGNBQWMsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLEtBQUssRUFBRTtBQUM1QyxnQkFBZ0IsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDO0FBQ3BILGdCQUFnQixnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxlQUFlLENBQUM7QUFDaEIsYUFBYSxDQUFDLENBQUM7QUFDZixZQUFZLElBQUksZUFBZSxHQUFHLFdBQVc7QUFDN0MsY0FBYyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDOUIsZ0JBQWdCLElBQUk7QUFDcEIsa0JBQWtCLFFBQVEsRUFBRSxDQUFDO0FBQzdCLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQzlCLGtCQUFrQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLGlCQUFpQjtBQUNqQixlQUFlLE1BQU07QUFDckIsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ25DLGdCQUFnQixNQUFNLENBQUMsS0FBSyxHQUFHLFdBQVc7QUFDMUMsa0JBQWtCLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUM5RCxpQkFBaUIsQ0FBQztBQUNsQixnQkFBZ0IsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLGVBQWU7QUFDZixhQUFhLENBQUM7QUFDZCxZQUFZLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0FBQy9DLGNBQWMsR0FBRyxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7QUFDOUMsY0FBYyxlQUFlLEVBQUUsQ0FBQztBQUNoQyxhQUFhLENBQUMsQ0FBQztBQUNmLFlBQVksTUFBTSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7QUFDOUMsWUFBWSxNQUFNLENBQUMsa0JBQWtCLEdBQUcseUJBQXlCLENBQUM7QUFDbEUsWUFBWSxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztBQUM1QyxZQUFZLGVBQWUsRUFBRSxDQUFDO0FBQzlCLFlBQVksT0FBTyxnQkFBZ0IsQ0FBQztBQUNwQyxXQUFXLENBQUM7QUFDWixVQUFVLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQixTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkIsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLO0FBQ0wsSUFBSSxTQUFTLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDL0IsTUFBTSxPQUFPLFNBQVMsT0FBTyxFQUFFO0FBQy9CLFFBQVEsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDckQsVUFBVSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLFVBQVUsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM1RyxVQUFVLElBQUksZUFBZSxHQUFHLEtBQUssS0FBSyxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3BFLFVBQVUsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUN6RCxVQUFVLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsVUFBVSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1RSxVQUFVLElBQUksV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRCxVQUFVLElBQUksS0FBSyxLQUFLLENBQUM7QUFDekIsWUFBWSxPQUFPLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFVBQVUsSUFBSSxVQUFVLEVBQUU7QUFDMUIsWUFBWSxJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDN0gsWUFBWSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsS0FBSyxFQUFFO0FBQzVDLGNBQWMsT0FBTyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVELGFBQWEsQ0FBQztBQUNkLFlBQVksR0FBRyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxXQUFXLE1BQU07QUFDakIsWUFBWSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDNUIsWUFBWSxJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksRUFBRSxlQUFlLElBQUksTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BJLFlBQVksSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQzlCLFlBQVksS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLEtBQUssRUFBRTtBQUM5QyxjQUFjLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDeEMsY0FBYyxJQUFJLENBQUMsTUFBTTtBQUN6QixnQkFBZ0IsT0FBTyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNuRCxjQUFjLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZFLGNBQWMsSUFBSSxFQUFFLE9BQU8sS0FBSyxLQUFLO0FBQ3JDLGdCQUFnQixPQUFPLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ25ELGNBQWMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hDLGFBQWEsQ0FBQztBQUNkLFlBQVksS0FBSyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxXQUFXO0FBQ1gsU0FBUyxDQUFDLENBQUM7QUFDWCxPQUFPLENBQUM7QUFDUixLQUFLO0FBQ0wsSUFBSSxPQUFPO0FBQ1gsTUFBTSxJQUFJLEVBQUUsU0FBUztBQUNyQixNQUFNLE1BQU0sRUFBRSxXQUFXO0FBQ3pCLE1BQU0sTUFBTTtBQUNaLE1BQU0sT0FBTyxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQzdCLFFBQVEsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztBQUNoRCxRQUFRLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ3JELFVBQVUsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsQyxVQUFVLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsVUFBVSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3BDLFVBQVUsSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsVUFBVSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDM0IsVUFBVSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDaEMsVUFBVSxJQUFJLEdBQUcsQ0FBQztBQUNsQixVQUFVLElBQUksY0FBYyxHQUFHLFNBQVMsS0FBSyxFQUFFO0FBQy9DLFlBQVksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNwQyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSTtBQUN6RCxjQUFjLENBQUM7QUFDZixZQUFZLElBQUksRUFBRSxhQUFhLEtBQUssUUFBUTtBQUM1QyxjQUFjLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixXQUFXLENBQUM7QUFDWixVQUFVLElBQUksWUFBWSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFVBQVUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUMzQyxZQUFZLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixZQUFZLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUM3QixjQUFjLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLGNBQWMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDM0IsY0FBYyxHQUFHLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztBQUM3QyxjQUFjLEdBQUcsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQ3pDLGNBQWMsRUFBRSxRQUFRLENBQUM7QUFDekIsYUFBYTtBQUNiLFdBQVc7QUFDWCxVQUFVLElBQUksUUFBUSxLQUFLLENBQUM7QUFDNUIsWUFBWSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsU0FBUyxDQUFDLENBQUM7QUFDWCxPQUFPO0FBQ1AsTUFBTSxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUU7QUFDekIsUUFBUSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQzdDLFFBQVEsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDckQsVUFBVSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLFVBQVUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuRCxVQUFVLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsVUFBVSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsS0FBSyxFQUFFO0FBQzFDLFlBQVksT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxXQUFXLENBQUM7QUFDWixVQUFVLEdBQUcsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsU0FBUyxDQUFDLENBQUM7QUFDWCxPQUFPO0FBQ1AsTUFBTSxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUM3QixNQUFNLFVBQVUsRUFBRSxXQUFXO0FBQzdCLE1BQU0sS0FBSyxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQzNCLFFBQVEsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNsRCxRQUFRLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDdkQsUUFBUSxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNyRCxVQUFVLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsVUFBVSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1RSxVQUFVLElBQUksV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRCxVQUFVLElBQUksR0FBRyxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3RSxVQUFVLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQzVDLFlBQVksT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxXQUFXLENBQUMsQ0FBQztBQUNiLFVBQVUsR0FBRyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRCxTQUFTLENBQUMsQ0FBQztBQUNYLE9BQU87QUFDUCxLQUFLLENBQUM7QUFDTixHQUFHO0FBQ0gsRUFBRSxJQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3hGLEVBQUUsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxXQUFXLEVBQUU7QUFDdkQsSUFBSSxPQUFPLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzFDLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDcEIsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQ2pDLElBQUksT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUN4QyxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTztBQUNULElBQUksS0FBSyxFQUFFLFFBQVE7QUFDbkIsSUFBSSxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3hDLElBQUksS0FBSyxFQUFFLFNBQVMsSUFBSSxFQUFFO0FBQzFCLE1BQU0sSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sSUFBSSxDQUFDLE1BQU07QUFDakIsUUFBUSxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFDMUQsTUFBTSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixLQUFLO0FBQ0wsSUFBSSxHQUFHLEVBQUUsSUFBSTtBQUNiLElBQUksT0FBTyxFQUFFLENBQUMsUUFBUTtBQUN0QixJQUFJLE9BQU8sRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDO0FBQ25DLElBQUksTUFBTTtBQUNWLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRCxTQUFTLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUU7QUFDdkQsRUFBRSxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2hELElBQUksSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUM1QixJQUFJLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdEQsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFDRCxTQUFTLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNuRSxFQUFFLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7QUFDL0QsRUFBRSxJQUFJLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hILEVBQUUsT0FBTztBQUNULElBQUksTUFBTTtBQUNWLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRCxTQUFTLHdCQUF3QixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUU7QUFDaEQsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQzFCLEVBQUUsSUFBSSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsRixFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQ3BDLElBQUksSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUMvQixJQUFJLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRTtBQUNqRCxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUM7QUFDcEMsS0FBSyxDQUFDLEVBQUU7QUFDUixNQUFNLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFO0FBQzdDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3hDLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQ3ZELEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLFNBQVMsRUFBRTtBQUN6QyxJQUFJLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDL0IsTUFBTSxJQUFJLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDM0QsTUFBTSxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsRUFBRTtBQUN6RSxRQUFRLElBQUksR0FBRyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxJQUFJLEdBQUcsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFO0FBQy9FLFVBQVUsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDbEMsWUFBWSxHQUFHLEVBQUUsV0FBVztBQUM1QixjQUFjLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQyxhQUFhO0FBQ2IsWUFBWSxHQUFHLEVBQUUsU0FBUyxLQUFLLEVBQUU7QUFDakMsY0FBYyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDN0csYUFBYTtBQUNiLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUyxNQUFNO0FBQ2YsVUFBVSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNuQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDN0IsSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUN6QixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLO0FBQ3RDLFFBQVEsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsS0FBSztBQUNMLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNELFNBQVMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNqQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDekMsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRTtBQUMvRCxFQUFFLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7QUFDbEMsRUFBRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDL0UsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hDLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsRUFBRSxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELEVBQUUsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUM7QUFDdkMsRUFBRSxRQUFRLENBQUMsV0FBVztBQUN0QixJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLElBQUksR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDOUIsSUFBSSxJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7QUFDMUIsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsU0FBUyxFQUFFO0FBQ3JELFFBQVEsV0FBVyxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEgsT0FBTyxDQUFDLENBQUM7QUFDVCxNQUFNLHdCQUF3QixDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNwRCxNQUFNLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVztBQUNyQyxRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2xDLEtBQUs7QUFDTCxNQUFNLHNCQUFzQixDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlGLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNELFNBQVMsc0JBQXNCLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFO0FBQ3hFLEVBQUUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLEVBQUUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztBQUM5QixFQUFFLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDckYsRUFBRSxJQUFJLHdCQUF3QixHQUFHLEtBQUssQ0FBQztBQUN2QyxFQUFFLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDOUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQztBQUN4QyxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRTtBQUN0QyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVztBQUMxQixNQUFNLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQztBQUNuQyxNQUFNLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzVDLE1BQU0sMEJBQTBCLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNqRSxNQUFNLDBCQUEwQixDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDakUsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDOUMsTUFBTSxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDdkMsUUFBUSxXQUFXLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuRixPQUFPLENBQUMsQ0FBQztBQUNULE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxNQUFNLEVBQUU7QUFDM0MsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7QUFDN0IsVUFBVSxNQUFNLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQ25GLFNBQVMsTUFBTTtBQUNmLFVBQVUsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakUsVUFBVSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRTtBQUMzQyxZQUFZLE9BQU8sUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxQyxXQUFXLENBQUMsQ0FBQztBQUNiLFVBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDOUMsWUFBWSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxZQUFZLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkMsV0FBVyxDQUFDLENBQUM7QUFDYixVQUFVLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsT0FBTyxFQUFFO0FBQy9DLFlBQVksT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUztBQUNULE9BQU8sQ0FBQyxDQUFDO0FBQ1QsTUFBTSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUN2RCxNQUFNLElBQUksY0FBYyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRTtBQUMvRCxRQUFRLHdCQUF3QixDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN0RCxRQUFRLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ25DLFFBQVEsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxlQUFlLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDekMsVUFBVSxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFFBQVEsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzlGLFFBQVEsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7QUFDdkMsUUFBUSxJQUFJLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RSxRQUFRLElBQUksdUJBQXVCLEVBQUU7QUFDckMsVUFBVSx1QkFBdUIsRUFBRSxDQUFDO0FBQ3BDLFNBQVM7QUFDVCxRQUFRLElBQUksYUFBYSxDQUFDO0FBQzFCLFFBQVEsSUFBSSxlQUFlLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXO0FBQzdELFVBQVUsYUFBYSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxVQUFVLElBQUksYUFBYSxFQUFFO0FBQzdCLFlBQVksSUFBSSx1QkFBdUIsRUFBRTtBQUN6QyxjQUFjLElBQUksV0FBVyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekUsY0FBYyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMzRCxhQUFhO0FBQ2IsV0FBVztBQUNYLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxPQUFPLGFBQWEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEtBQUssVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXO0FBQ2pKLFVBQVUsT0FBTyxhQUFhLENBQUM7QUFDL0IsU0FBUyxDQUFDLENBQUM7QUFDWCxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxRQUFRLEVBQUU7QUFDbEMsTUFBTSxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtBQUNuRSxRQUFRLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlDLFFBQVEsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELE9BQU87QUFDUCxNQUFNLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDdEQsTUFBTSxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRixNQUFNLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztBQUNsQyxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxTQUFTLFFBQVEsR0FBRztBQUN0QixJQUFJLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RILEdBQUc7QUFDSCxFQUFFLE9BQU8sUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDcEMsSUFBSSxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDdkQsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUM3QyxFQUFFLElBQUksSUFBSSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUNYLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDWCxJQUFJLE1BQU0sRUFBRSxFQUFFO0FBQ2QsR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLEtBQUssQ0FBQztBQUNaLEVBQUUsS0FBSyxLQUFLLElBQUksU0FBUyxFQUFFO0FBQzNCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDekIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixHQUFHO0FBQ0gsRUFBRSxLQUFLLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDM0IsSUFBSSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDakIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxNQUFNLEdBQUc7QUFDbkIsUUFBUSxJQUFJLEVBQUUsS0FBSztBQUNuQixRQUFRLEdBQUcsRUFBRSxNQUFNO0FBQ25CLFFBQVEsUUFBUSxFQUFFLEtBQUs7QUFDdkIsUUFBUSxHQUFHLEVBQUUsRUFBRTtBQUNmLFFBQVEsR0FBRyxFQUFFLEVBQUU7QUFDZixRQUFRLE1BQU0sRUFBRSxFQUFFO0FBQ2xCLE9BQU8sQ0FBQztBQUNSLE1BQU0sSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3JKLFFBQVEsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDL0IsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxPQUFPLE1BQU07QUFDYixRQUFRLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDMUMsUUFBUSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQzFDLFFBQVEsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDN0IsUUFBUSxLQUFLLE9BQU8sSUFBSSxVQUFVLEVBQUU7QUFDcEMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxZQUFZLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLFNBQVM7QUFDVCxRQUFRLEtBQUssT0FBTyxJQUFJLFVBQVUsRUFBRTtBQUNwQyxVQUFVLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pFLFVBQVUsSUFBSSxDQUFDLE1BQU07QUFDckIsWUFBWSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxlQUFlLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsR0FBRztBQUM1QyxZQUFZLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZDLFNBQVM7QUFDVCxRQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDeEYsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRCxTQUFTLFdBQVcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDNUQsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDaEMsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEMsR0FBRyxDQUFDLENBQUM7QUFDTCxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUNELFNBQVMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtBQUNsRCxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxTQUFTLEVBQUU7QUFDOUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDM0QsTUFBTSxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuRyxLQUFLO0FBQ0wsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFO0FBQ2xELEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ2hFLElBQUksSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxJQUFJLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN0QyxNQUFNLFFBQVEsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0MsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0QsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUM5QixFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFDRCxTQUFTLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ2hELEVBQUUsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLEVBQUUsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxTQUFTLEVBQUU7QUFDM0MsSUFBSSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUNoQyxJQUFJLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLE9BQU8sSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUosSUFBSSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDdEQsTUFBTSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ2pDLE1BQU0sSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFKLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQixLQUFLO0FBQ0wsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RSxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQUNELFNBQVMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDL0MsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLEVBQUUsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNFLEVBQUUsRUFBRSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BELEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUNELFNBQVMscUJBQXFCLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRTtBQUM3QyxFQUFFLElBQUksZUFBZSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xFLEVBQUUsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUQsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDNUQsSUFBSSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzdDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBQ0QsU0FBUywwQkFBMEIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUMxRCxFQUFFLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7QUFDaEQsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUM5QyxJQUFJLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxJQUFJLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsSUFBSSxFQUFFLENBQUMsVUFBVSxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUM7QUFDdEMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDdEQsTUFBTSxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDbkQsTUFBTSxJQUFJLFNBQVMsR0FBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNuRyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzdCLFFBQVEsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvRCxRQUFRLElBQUksU0FBUyxFQUFFO0FBQ3ZCLFVBQVUsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDckMsVUFBVSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEQsVUFBVSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUM3RCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sWUFBWSxPQUFPLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRTtBQUMvUSxJQUFJLEVBQUUsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQzFCLEdBQUc7QUFDSCxDQUFDO0FBQ0QsU0FBUyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRTtBQUM3QyxFQUFFLE9BQU8saUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDcEUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pCLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakQsSUFBSSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNuRixJQUFJLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUksR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsSUFBSSxPQUFPLEdBQUcsV0FBVztBQUN6QixFQUFFLFNBQVMsUUFBUSxHQUFHO0FBQ3RCLEdBQUc7QUFDSCxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ3BFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLFNBQVMsRUFBRTtBQUM3QyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtBQUN0QyxRQUFRLElBQUksT0FBTyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzFELFFBQVEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSztBQUN6QixVQUFVLE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDNUUsUUFBUSxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFO0FBQ3RDLFVBQVUsSUFBSSxHQUFHLENBQUMsSUFBSTtBQUN0QixZQUFZLE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7QUFDaEcsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU87QUFDMUIsWUFBWSxNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0FBQ2hHLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM5RSxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHLENBQUM7QUFDSixFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFO0FBQy9DLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNyQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDdEcsSUFBSSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDO0FBQ2hDLElBQUksSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLElBQUksSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRTtBQUN2QyxNQUFNLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDNUMsTUFBTSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3JELEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUM1QixJQUFJLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsSUFBSSxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDakgsSUFBSSxFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUcsQ0FBQztBQUNKLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxlQUFlLEVBQUU7QUFDekQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxlQUFlLENBQUM7QUFDL0MsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHLENBQUM7QUFDSixFQUFFLE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUMsRUFBRSxDQUFDO0FBQ0osU0FBUyx3QkFBd0IsQ0FBQyxFQUFFLEVBQUU7QUFDdEMsRUFBRSxPQUFPLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxRQUFRLENBQUMsYUFBYSxFQUFFO0FBQ2xGLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHO0FBQ2hCLE1BQU0sT0FBTyxFQUFFLGFBQWE7QUFDNUIsTUFBTSxZQUFZLEVBQUUsSUFBSTtBQUN4QixNQUFNLFFBQVEsRUFBRSxFQUFFO0FBQ2xCLE1BQU0sTUFBTSxFQUFFLEVBQUU7QUFDaEIsTUFBTSxjQUFjLEVBQUUsSUFBSTtBQUMxQixLQUFLLENBQUM7QUFDTixHQUFHLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxTQUFTLGVBQWUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFO0FBQ2pELEVBQUUsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ2xFLE1BQU0sTUFBTSxFQUFFLEVBQUU7QUFDaEIsTUFBTSxTQUFTO0FBQ2YsTUFBTSxXQUFXO0FBQ2pCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ25ELEdBQUc7QUFDSCxFQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7QUFDdkMsRUFBRSxPQUFPLFNBQVMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxTQUFTLEtBQUssVUFBVSxDQUFDO0FBQ2hFLENBQUM7QUFDRCxTQUFTLGdCQUFnQixDQUFDLEdBQUcsRUFBRTtBQUMvQixFQUFFLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDL0QsRUFBRSxPQUFPLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQ3JHLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxFQUFFO0FBQ3BDLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRTtBQUM3QixNQUFNLE9BQU8sSUFBSSxLQUFLLFVBQVUsQ0FBQztBQUNqQyxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDNUUsQ0FBQztBQUNELFNBQVMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtBQUN2QyxFQUFFLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDL0QsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxVQUFVLElBQUksZUFBZSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxSCxDQUFDO0FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLEVBQUUsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztBQUMvRCxFQUFFLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0gsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUFDLEVBQUUsRUFBRTtBQUNqQixFQUFFLE9BQU8sUUFBUSxDQUFDLFdBQVc7QUFDN0IsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUMxQixJQUFJLE9BQU8sRUFBRSxFQUFFLENBQUM7QUFDaEIsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsRUFBRSxFQUFFO0FBQ3ZCLEVBQUUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUN4QixFQUFFLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxLQUFLLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxLQUFLO0FBQ3JDLElBQUksT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXO0FBQ2hELE1BQU0sT0FBTyxLQUFLLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25FLEtBQUssQ0FBQyxDQUFDO0FBQ1AsRUFBRSxLQUFLLEtBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQ3BFLEVBQUUsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDN0IsRUFBRSxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUMzQixFQUFFLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzdCLEVBQUUsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUMzRixFQUFFLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxZQUFZLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzVGLElBQUksSUFBSSxDQUFDLFNBQVM7QUFDbEIsTUFBTSxNQUFNLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3hDLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFJLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1RyxJQUFJLElBQUksQ0FBQyxHQUFHO0FBQ1osTUFBTSxNQUFNLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3hDLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxJQUFJLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QyxJQUFJLEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzNDLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztBQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFO0FBQ3pELFFBQVEsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7QUFDckMsUUFBUSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0IsUUFBUSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELFFBQVEsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXO0FBQzVELFVBQVUsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDeEYsU0FBUyxDQUFDLENBQUM7QUFDWCxPQUFPLE1BQU07QUFDYixRQUFRLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDdkUsUUFBUSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUM5QixRQUFRLFlBQVksQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSxPQUFPO0FBQ1AsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2YsSUFBSSxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXO0FBQ3BDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLE1BQU0sSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3hDLE1BQU0sSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0QsTUFBTSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDO0FBQ3JDLFFBQVEsSUFBSTtBQUNaLFVBQVUsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzlGLFVBQVUsSUFBSSxLQUFLLENBQUMsVUFBVTtBQUM5QixZQUFZLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsZUFBZTtBQUNmLFlBQVksMEJBQTBCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkUsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQ3RELGNBQWMsT0FBTyxDQUFDLElBQUksQ0FBQyxvSEFBb0gsQ0FBQyxDQUFDO0FBQ2pKLGFBQWE7QUFDYixXQUFXO0FBQ1gsVUFBVSx3QkFBd0IsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDakQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3BCLFNBQVM7QUFDVCxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsTUFBTSxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNoRCxRQUFRLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsT0FBTyxDQUFDLENBQUM7QUFDVCxNQUFNLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3hDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsT0FBTyxDQUFDLENBQUM7QUFDVCxNQUFNLElBQUksVUFBVTtBQUNwQixRQUFRLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDN0MsTUFBTSxPQUFPLEVBQUUsQ0FBQztBQUNoQixLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDZixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDdkIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLElBQUksT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLGNBQWMsR0FBRztBQUN0RixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDOUMsUUFBUSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM5RSxRQUFRLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDckMsUUFBUSxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFFLE9BQU87QUFDUCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXO0FBQ3hCLElBQUksS0FBSyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUNuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVztBQUNyQixJQUFJLEtBQUssQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQ2hDLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDekIsSUFBSSxJQUFJO0FBQ1IsTUFBTSxrQkFBa0IsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2RCxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDaEIsS0FBSztBQUNMLElBQUksS0FBSyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDaEMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixJQUFJLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQzVCLElBQUksT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXO0FBQ3hCLElBQUksS0FBSyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDOUIsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUNyQixHQUFHLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxTQUFTLGFBQWEsQ0FBQyxRQUFRLEVBQUU7QUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxTQUFTLE1BQU0sRUFBRTtBQUNsQyxJQUFJLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxHQUFHLEVBQUUsT0FBTyxHQUFHLFNBQVMsS0FBSyxFQUFFO0FBQy9CLElBQUksT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLEdBQUcsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsRUFBRSxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDekIsSUFBSSxPQUFPLFNBQVMsR0FBRyxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ2xELE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9MLEtBQUssQ0FBQztBQUNOLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDMUIsQ0FBQztBQUNELFNBQVMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUU7QUFDOUQsRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQzNCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNYLElBQUksTUFBTSxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxFQUFFLElBQUksSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QixFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ1osSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekIsRUFBRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0QsU0FBUyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUU7QUFDbkYsRUFBRSxPQUFPLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVztBQUNoRCxJQUFJLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDO0FBQ3pDLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pGLElBQUksSUFBSSxTQUFTLEdBQUc7QUFDcEIsTUFBTSxLQUFLO0FBQ1gsTUFBTSxTQUFTO0FBQ2YsS0FBSyxDQUFDO0FBQ04sSUFBSSxJQUFJLGlCQUFpQixFQUFFO0FBQzNCLE1BQU0sS0FBSyxDQUFDLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7QUFDbEQsS0FBSyxNQUFNO0FBQ1gsTUFBTSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDckIsS0FBSztBQUNMLElBQUksSUFBSSxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsSUFBSSxJQUFJLGdCQUFnQixFQUFFO0FBQzFCLE1BQU0sdUJBQXVCLEVBQUUsQ0FBQztBQUNoQyxLQUFLO0FBQ0wsSUFBSSxJQUFJLFdBQVcsQ0FBQztBQUNwQixJQUFJLElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVztBQUN6RCxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRCxNQUFNLElBQUksV0FBVyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxnQkFBZ0IsRUFBRTtBQUM5QixVQUFVLElBQUksV0FBVyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckUsVUFBVSxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNyRCxTQUFTLE1BQU0sSUFBSSxPQUFPLFdBQVcsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLE9BQU8sV0FBVyxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7QUFDdEcsVUFBVSxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25ELFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xCLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLFdBQVcsQ0FBQyxJQUFJLEtBQUssVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3ZILE1BQU0sT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDLDREQUE0RCxDQUFDLENBQUMsQ0FBQztBQUN4SSxLQUFLLENBQUMsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDekMsTUFBTSxPQUFPLFdBQVcsQ0FBQztBQUN6QixLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDekIsTUFBTSxJQUFJLGlCQUFpQjtBQUMzQixRQUFRLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN6QixNQUFNLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVztBQUMvQyxRQUFRLE9BQU8sQ0FBQyxDQUFDO0FBQ2pCLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3pCLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixNQUFNLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDOUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUMsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUNoQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0QsU0FBUyw0QkFBNEIsQ0FBQyxJQUFJLEVBQUU7QUFDNUMsRUFBRSxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsU0FBUyxFQUFFO0FBQ2xFLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0QyxJQUFJLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDOUIsSUFBSSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDekIsSUFBSSxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUMvQixJQUFJLFNBQVMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7QUFDaEUsTUFBTSxJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEQsTUFBTSxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsRixNQUFNLElBQUksU0FBUyxHQUFHLE9BQU8sSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUM3RixNQUFNLElBQUksU0FBUyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDbEMsTUFBTSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxhQUFhLENBQUMsRUFBRTtBQUMvRCxRQUFRLFNBQVM7QUFDakIsUUFBUSxZQUFZLEVBQUUsQ0FBQyxTQUFTLElBQUksYUFBYSxDQUFDLFlBQVk7QUFDOUQsUUFBUSxPQUFPO0FBQ2YsUUFBUSxTQUFTO0FBQ2pCLFFBQVEsVUFBVSxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUM7QUFDNUMsUUFBUSxNQUFNLEVBQUUsQ0FBQyxTQUFTLElBQUksYUFBYSxDQUFDLE1BQU07QUFDbEQsT0FBTyxDQUFDLENBQUM7QUFDVCxNQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRTtBQUN0QyxRQUFRLGlCQUFpQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxPQUFPO0FBQ1AsTUFBTSxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7QUFDekIsUUFBUSxJQUFJLGNBQWMsR0FBRyxTQUFTLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDNUYsUUFBUSxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN0RSxPQUFPO0FBQ1AsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNwQyxRQUFRLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3JDLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsTUFBTSxPQUFPLFlBQVksQ0FBQztBQUMxQixLQUFLO0FBQ0wsSUFBSSxJQUFJLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hGLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNsRSxNQUFNLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxQixNQUFNLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pELEtBQUs7QUFDTCxJQUFJLFNBQVMsYUFBYSxDQUFDLE9BQU8sRUFBRTtBQUNwQyxNQUFNLElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMxRCxNQUFNLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxLQUFLO0FBQ0wsSUFBSSxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzVDLE1BQU0sT0FBTztBQUNiLFFBQVEsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSTtBQUMvQyxRQUFRLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7QUFDdkYsUUFBUSxTQUFTLEVBQUUsSUFBSTtBQUN2QixRQUFRLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7QUFDdkYsUUFBUSxTQUFTLEVBQUUsSUFBSTtBQUN2QixPQUFPLENBQUM7QUFDUixLQUFLO0FBQ0wsSUFBSSxTQUFTLGdCQUFnQixDQUFDLEdBQUcsRUFBRTtBQUNuQyxNQUFNLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ25DLE1BQU0sT0FBTyxNQUFNLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFO0FBQ3BFLFFBQVEsS0FBSyxFQUFFLE1BQU07QUFDckIsUUFBUSxLQUFLLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDOUQsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDaEIsS0FBSztBQUNMLElBQUksSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDL0MsTUFBTSxNQUFNLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3hILE1BQU0sS0FBSyxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQzNCLFFBQVEsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsT0FBTztBQUNQLE1BQU0sS0FBSyxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQzNCLFFBQVEsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsT0FBTztBQUNQLE1BQU0sVUFBVSxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQ2hDLFFBQVEsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7QUFDL0csUUFBUSxJQUFJLENBQUMsU0FBUztBQUN0QixVQUFVLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxRQUFRLFNBQVMsbUJBQW1CLENBQUMsTUFBTSxFQUFFO0FBQzdDLFVBQVUsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ2xDLFlBQVksR0FBRyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaE8sV0FBVztBQUNYLFVBQVUsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDO0FBQ3hDLFlBQVksa0JBQWtCLEVBQUU7QUFDaEMsY0FBYyxLQUFLLEVBQUUsU0FBUyxHQUFHLEVBQUUsV0FBVyxFQUFFO0FBQ2hELGdCQUFnQixNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3hGLGVBQWU7QUFDZixhQUFhO0FBQ2IsWUFBWSxHQUFHLEVBQUU7QUFDakIsY0FBYyxHQUFHLEVBQUUsV0FBVztBQUM5QixnQkFBZ0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNyQyxnQkFBZ0IsT0FBTyxTQUFTLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxRSxlQUFlO0FBQ2YsYUFBYTtBQUNiLFlBQVksS0FBSyxFQUFFO0FBQ25CLGNBQWMsR0FBRyxFQUFFLFdBQVc7QUFDOUIsZ0JBQWdCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNwQyxlQUFlO0FBQ2YsYUFBYTtBQUNiLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsVUFBVSxPQUFPLGFBQWEsQ0FBQztBQUMvQixTQUFTO0FBQ1QsUUFBUSxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxNQUFNLEVBQUU7QUFDN0UsVUFBVSxPQUFPLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxTQUFTLENBQUMsQ0FBQztBQUNYLE9BQU87QUFDUCxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFDRCxJQUFJLHNCQUFzQixHQUFHO0FBQzdCLEVBQUUsS0FBSyxFQUFFLFFBQVE7QUFDakIsRUFBRSxJQUFJLEVBQUUsd0JBQXdCO0FBQ2hDLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDVixFQUFFLE1BQU0sRUFBRSw0QkFBNEI7QUFDdEMsQ0FBQyxDQUFDO0FBQ0YsU0FBUyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0FBQzNDLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVE7QUFDM0IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDcEIsRUFBRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFDRCxJQUFJLGVBQWUsR0FBRztBQUN0QixFQUFFLEtBQUssRUFBRSxRQUFRO0FBQ2pCLEVBQUUsSUFBSSxFQUFFLGlCQUFpQjtBQUN6QixFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ1YsRUFBRSxNQUFNLEVBQUUsU0FBUyxRQUFRLEVBQUU7QUFDN0IsSUFBSSxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsU0FBUyxFQUFFO0FBQ3hFLE1BQU0sSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxNQUFNLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ25ELE1BQU0sSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFHLEVBQUU7QUFDckYsUUFBUSxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFFBQVEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDM0gsUUFBUSxRQUFRLEdBQUcsQ0FBQyxJQUFJO0FBQ3hCLFVBQVUsS0FBSyxLQUFLO0FBQ3BCLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLEdBQUc7QUFDckMsY0FBYyxNQUFNO0FBQ3BCLFlBQVksT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXO0FBQzVELGNBQWMsT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JCLFVBQVUsS0FBSyxLQUFLO0FBQ3BCLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLEdBQUc7QUFDOUQsY0FBYyxNQUFNO0FBQ3BCLFlBQVksT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXO0FBQzVELGNBQWMsT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JCLFVBQVUsS0FBSyxRQUFRO0FBQ3ZCLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLEdBQUc7QUFDckMsY0FBYyxNQUFNO0FBQ3BCLFlBQVksT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXO0FBQzVELGNBQWMsT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JCLFVBQVUsS0FBSyxhQUFhO0FBQzVCLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLEdBQUc7QUFDckMsY0FBYyxNQUFNO0FBQ3BCLFlBQVksT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXO0FBQzVELGNBQWMsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JCLFNBQVM7QUFDVCxRQUFRLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxRQUFRLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUN0QyxVQUFVLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDbkMsVUFBVSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RSxVQUFVLElBQUksQ0FBQyxLQUFLO0FBQ3BCLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QyxVQUFVLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0gsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtBQUNwQyxZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekQsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJO0FBQ3ZCLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxVQUFVLE9BQU8saUJBQWlCLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxjQUFjLEVBQUU7QUFDekYsWUFBWSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUN0RCxjQUFjLElBQUksYUFBYSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxjQUFjLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekQsY0FBYyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzFDLGdCQUFnQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0RSxlQUFlLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxhQUFhLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDMUUsZ0JBQWdCLElBQUksbUJBQW1CLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2pHLGdCQUFnQixJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksbUJBQW1CLElBQUksSUFBSSxFQUFFO0FBQ2hFLGtCQUFrQixHQUFHLEdBQUcsbUJBQW1CLENBQUM7QUFDNUMsa0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3JDLGtCQUFrQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtBQUM1QyxvQkFBb0IsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxRSxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCLGVBQWUsTUFBTTtBQUNyQixnQkFBZ0IsSUFBSSxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsZ0JBQWdCLElBQUksbUJBQW1CLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzVHLGdCQUFnQixJQUFJLG1CQUFtQixFQUFFO0FBQ3pDLGtCQUFrQixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsa0JBQWtCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUU7QUFDN0Usb0JBQW9CLElBQUksTUFBTSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQzNELHNCQUFzQixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvRSxxQkFBcUIsTUFBTTtBQUMzQixzQkFBc0IsWUFBWSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVGLHFCQUFxQjtBQUNyQixtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JCLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2YsY0FBYyxPQUFPLEdBQUcsQ0FBQztBQUN6QixhQUFhLENBQUMsQ0FBQztBQUNmLFlBQVksT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRTtBQUM3RCxjQUFjLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7QUFDN0gsY0FBYyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNyRCxnQkFBZ0IsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsZ0JBQWdCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxnQkFBZ0IsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQ3JDLGtCQUFrQixHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsaUJBQWlCLE1BQU07QUFDdkIsa0JBQWtCLEdBQUcsQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUN0SCxpQkFBaUI7QUFDakIsZUFBZTtBQUNmLGNBQWMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2xFLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFjLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUU7QUFDN0MsZ0JBQWdCLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pELGVBQWUsQ0FBQyxDQUFDO0FBQ2pCLGNBQWMsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsV0FBVyxDQUFDLENBQUM7QUFDYixTQUFTO0FBQ1QsUUFBUSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDbkMsVUFBVSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUQsU0FBUztBQUNULFFBQVEsU0FBUyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdEQsVUFBVSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0FBQ3RILFlBQVksSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUNwQyxZQUFZLE9BQU8sY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0FBQzVGLGNBQWMsSUFBSSxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUM7QUFDckMsZ0JBQWdCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsY0FBYyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO0FBQ3pDLGdCQUFnQixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFFLGVBQWUsTUFBTTtBQUNyQixnQkFBZ0IsT0FBTyxlQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pJLGVBQWU7QUFDZixhQUFhLENBQUMsQ0FBQztBQUNmLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUztBQUNULE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDVixNQUFNLE9BQU8sZUFBZSxDQUFDO0FBQzdCLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDUixHQUFHO0FBQ0gsQ0FBQyxDQUFDO0FBQ0YsU0FBUyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTtBQUN0RCxFQUFFLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUMvSCxDQUFDO0FBQ0QsSUFBSSxJQUFJLENBQUM7QUFDVCxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLEVBQUUsSUFBSSxJQUFJO0FBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEIsRUFBRSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ3BDLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDaEIsSUFBSSxNQUFNLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3RDLEVBQUUsSUFBSSxHQUFHLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUMxQixJQUFJLElBQUk7QUFDUixNQUFNLE9BQU8sRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwRSxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDbEIsTUFBTSxPQUFPLEdBQUcsQ0FBQztBQUNqQixLQUFLO0FBQ0wsR0FBRyxDQUFDO0FBQ0osRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUNELFNBQVMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdEQsRUFBRSxJQUFJO0FBQ04sSUFBSSxJQUFJLENBQUMsS0FBSztBQUNkLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDbEIsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNO0FBQ3hDLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDbEIsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUMzRSxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM1QyxRQUFRLFNBQVM7QUFDakIsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ1YsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztBQUMxRCxHQUFHLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDaEIsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0gsQ0FBQztBQUNELElBQUksNkJBQTZCLEdBQUc7QUFDcEMsRUFBRSxLQUFLLEVBQUUsUUFBUTtBQUNqQixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDWCxFQUFFLE1BQU0sRUFBRSxTQUFTLElBQUksRUFBRTtBQUN6QixJQUFJLE9BQU87QUFDWCxNQUFNLEtBQUssRUFBRSxTQUFTLFNBQVMsRUFBRTtBQUNqQyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsUUFBUSxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQ3JFLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsWUFBWSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsV0FBVztBQUNYLFVBQVUsSUFBSSxZQUFZLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDM0csVUFBVSxJQUFJLFlBQVksRUFBRTtBQUM1QixZQUFZLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0RCxXQUFXO0FBQ1gsVUFBVSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0FBQ3ZELFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRztBQUNsQyxjQUFjLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtBQUM1QixjQUFjLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxLQUFLLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRztBQUNsRSxhQUFhLENBQUM7QUFDZCxZQUFZLE9BQU8sR0FBRyxDQUFDO0FBQ3ZCLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUcsRUFBRTtBQUNqQyxVQUFVLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLO0FBQ2hDLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDdkMsVUFBVSxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNaLE9BQU87QUFDUCxLQUFLLENBQUM7QUFDTixHQUFHO0FBQ0gsQ0FBQyxDQUFDO0FBQ0YsSUFBSSxFQUFFLENBQUM7QUFDUCxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDNUIsRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFDRCxJQUFJLFFBQVEsR0FBRyxTQUFTLFVBQVUsRUFBRSxFQUFFLEVBQUU7QUFDeEMsRUFBRSxJQUFJLElBQUksRUFBRTtBQUNaLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuSCxHQUFHLE1BQU07QUFDVCxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDNUIsSUFBSSxJQUFJLFVBQVUsSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO0FBQ3pDLE1BQU0sTUFBTSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0wsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUc7QUFDSCxDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUc7QUFDaEMsRUFBRSxHQUFHLEVBQUUsU0FBUyxRQUFRLEVBQUU7QUFDMUIsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNILEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxFQUFFO0FBQ3hCLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0IsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0gsRUFBRSxPQUFPLEVBQUUsU0FBUyxLQUFLLEVBQUU7QUFDM0IsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFO0FBQ2hDLE1BQU0sT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2QyxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNILENBQUMsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVztBQUNuQyxFQUFFLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ1IsU0FBUyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDcEMsRUFBRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2pCLElBQUksT0FBTztBQUNYLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUNkLElBQUksTUFBTSxVQUFVLEVBQUUsQ0FBQztBQUN2QixFQUFFLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQztBQUMxQixJQUFJLE9BQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUMsRUFBRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLEVBQUUsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2QixFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEYsSUFBSSxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixHQUFHO0FBQ0gsRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNoQyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RGLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsR0FBRztBQUNILEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbEMsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSCxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLElBQUksTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbkIsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLEdBQUc7QUFDSCxFQUFFLElBQUksY0FBYyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNqQyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUN6QixJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUIsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLElBQUksY0FBYyxFQUFFO0FBQy9CLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvQixHQUFHO0FBQ0gsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDckMsRUFBRSxTQUFTLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0FBQ3RDLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLElBQUksSUFBSSxDQUFDO0FBQ1QsTUFBTSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDO0FBQ1QsTUFBTSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0FBQzNCLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBQ0QsU0FBUyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUM3QyxFQUFFLElBQUksRUFBRSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLEVBQUUsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLEVBQUUsSUFBSSxXQUFXLENBQUMsSUFBSTtBQUN0QixJQUFJLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLEVBQUUsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztBQUM1QixFQUFFLElBQUksRUFBRSxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLEVBQUUsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsRUFBRSxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQzVCLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ2pELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hELE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDbEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQztBQUNwSCxHQUFHO0FBQ0gsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFDRCxTQUFTLG1CQUFtQixDQUFDLElBQUksRUFBRTtBQUNuQyxFQUFFLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxRCxFQUFFLE9BQU87QUFDVCxJQUFJLElBQUksRUFBRSxTQUFTLEdBQUcsRUFBRTtBQUN4QixNQUFNLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sT0FBTyxLQUFLLEVBQUU7QUFDcEIsUUFBUSxRQUFRLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLFVBQVUsS0FBSyxDQUFDO0FBQ2hCLFlBQVksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsWUFBWSxJQUFJLFdBQVcsRUFBRTtBQUM3QixjQUFjLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDNUQsZ0JBQWdCLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RCxhQUFhLE1BQU07QUFDbkIsY0FBYyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixnQkFBZ0IsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hELGFBQWE7QUFDYixVQUFVLEtBQUssQ0FBQztBQUNoQixZQUFZLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQVksSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztBQUN6RCxjQUFjLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkQsVUFBVSxLQUFLLENBQUM7QUFDaEIsWUFBWSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLGNBQWMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsY0FBYyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsY0FBYyxTQUFTO0FBQ3ZCLGFBQWE7QUFDYixVQUFVLEtBQUssQ0FBQztBQUNoQixZQUFZLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQzdCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFCLEtBQUs7QUFDTCxHQUFHLENBQUM7QUFDSixDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzNCLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEosRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNoRCxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ1QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbEMsSUFBSSxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLElBQUksSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBQ3BDLElBQUksTUFBTSxDQUFDLEVBQUUsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDO0FBQ2hDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxJQUFJLFNBQVMs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
