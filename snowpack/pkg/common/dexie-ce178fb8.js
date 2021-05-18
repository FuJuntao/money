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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4aWUtY2UxNzhmYjguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kZXhpZUAzLjEuMC1hbHBoYS4xMC9ub2RlX21vZHVsZXMvZGV4aWUvZGlzdC9kZXhpZS5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbnZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xuICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24yKHQpIHtcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKHZhciBwIGluIHMpXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgfVxuICAgIHJldHVybiB0O1xuICB9O1xuICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5mdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XG4gIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxuICAgIHRvW2pdID0gZnJvbVtpXTtcbiAgcmV0dXJuIHRvO1xufVxudmFyIGtleXMgPSBPYmplY3Qua2V5cztcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBfZ2xvYmFsID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IGdsb2JhbDtcbmlmICh0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhX2dsb2JhbC5Qcm9taXNlKSB7XG4gIF9nbG9iYWwuUHJvbWlzZSA9IFByb21pc2U7XG59XG5mdW5jdGlvbiBleHRlbmQob2JqLCBleHRlbnNpb24pIHtcbiAgaWYgKHR5cGVvZiBleHRlbnNpb24gIT09IFwib2JqZWN0XCIpXG4gICAgcmV0dXJuIG9iajtcbiAga2V5cyhleHRlbnNpb24pLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgb2JqW2tleV0gPSBleHRlbnNpb25ba2V5XTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG52YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG52YXIgX2hhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gaGFzT3duKG9iaiwgcHJvcCkge1xuICByZXR1cm4gX2hhc093bi5jYWxsKG9iaiwgcHJvcCk7XG59XG5mdW5jdGlvbiBwcm9wcyhwcm90bywgZXh0ZW5zaW9uKSB7XG4gIGlmICh0eXBlb2YgZXh0ZW5zaW9uID09PSBcImZ1bmN0aW9uXCIpXG4gICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uKGdldFByb3RvKHByb3RvKSk7XG4gICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiA/IGtleXMgOiBSZWZsZWN0Lm93bktleXMpKGV4dGVuc2lvbikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBzZXRQcm9wKHByb3RvLCBrZXksIGV4dGVuc2lvbltrZXldKTtcbiAgfSk7XG59XG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5mdW5jdGlvbiBzZXRQcm9wKG9iaiwgcHJvcCwgZnVuY3Rpb25PckdldFNldCwgb3B0aW9ucykge1xuICBkZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGV4dGVuZChmdW5jdGlvbk9yR2V0U2V0ICYmIGhhc093bihmdW5jdGlvbk9yR2V0U2V0LCBcImdldFwiKSAmJiB0eXBlb2YgZnVuY3Rpb25PckdldFNldC5nZXQgPT09IFwiZnVuY3Rpb25cIiA/IHtnZXQ6IGZ1bmN0aW9uT3JHZXRTZXQuZ2V0LCBzZXQ6IGZ1bmN0aW9uT3JHZXRTZXQuc2V0LCBjb25maWd1cmFibGU6IHRydWV9IDoge3ZhbHVlOiBmdW5jdGlvbk9yR2V0U2V0LCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlfSwgb3B0aW9ucykpO1xufVxuZnVuY3Rpb24gZGVyaXZlKENoaWxkKSB7XG4gIHJldHVybiB7XG4gICAgZnJvbTogZnVuY3Rpb24oUGFyZW50KSB7XG4gICAgICBDaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBhcmVudC5wcm90b3R5cGUpO1xuICAgICAgc2V0UHJvcChDaGlsZC5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgQ2hpbGQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXh0ZW5kOiBwcm9wcy5iaW5kKG51bGwsIENoaWxkLnByb3RvdHlwZSlcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wKSB7XG4gIHZhciBwZCA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApO1xuICB2YXIgcHJvdG87XG4gIHJldHVybiBwZCB8fCAocHJvdG8gPSBnZXRQcm90byhvYmopKSAmJiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIHByb3ApO1xufVxudmFyIF9zbGljZSA9IFtdLnNsaWNlO1xuZnVuY3Rpb24gc2xpY2UoYXJncywgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX3NsaWNlLmNhbGwoYXJncywgc3RhcnQsIGVuZCk7XG59XG5mdW5jdGlvbiBvdmVycmlkZShvcmlnRnVuYywgb3ZlcnJpZGVkRmFjdG9yeSkge1xuICByZXR1cm4gb3ZlcnJpZGVkRmFjdG9yeShvcmlnRnVuYyk7XG59XG5mdW5jdGlvbiBhc3NlcnQoYikge1xuICBpZiAoIWIpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXNzZXJ0aW9uIEZhaWxlZFwiKTtcbn1cbmZ1bmN0aW9uIGFzYXAkMShmbikge1xuICBpZiAoX2dsb2JhbC5zZXRJbW1lZGlhdGUpXG4gICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgZWxzZVxuICAgIHNldFRpbWVvdXQoZm4sIDApO1xufVxuZnVuY3Rpb24gYXJyYXlUb09iamVjdChhcnJheSwgZXh0cmFjdG9yKSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBpdGVtLCBpKSB7XG4gICAgdmFyIG5hbWVBbmRWYWx1ZSA9IGV4dHJhY3RvcihpdGVtLCBpKTtcbiAgICBpZiAobmFtZUFuZFZhbHVlKVxuICAgICAgcmVzdWx0W25hbWVBbmRWYWx1ZVswXV0gPSBuYW1lQW5kVmFsdWVbMV07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufVxuZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9uZXJyb3IsIGFyZ3MpIHtcbiAgdHJ5IHtcbiAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBvbmVycm9yICYmIG9uZXJyb3IoZXgpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoKSB7XG4gIGlmIChoYXNPd24ob2JqLCBrZXlQYXRoKSlcbiAgICByZXR1cm4gb2JqW2tleVBhdGhdO1xuICBpZiAoIWtleVBhdGgpXG4gICAgcmV0dXJuIG9iajtcbiAgaWYgKHR5cGVvZiBrZXlQYXRoICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlQYXRoLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgdmFyIHZhbCA9IGdldEJ5S2V5UGF0aChvYmosIGtleVBhdGhbaV0pO1xuICAgICAgcnYucHVzaCh2YWwpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgdmFyIHBlcmlvZCA9IGtleVBhdGguaW5kZXhPZihcIi5cIik7XG4gIGlmIChwZXJpb2QgIT09IC0xKSB7XG4gICAgdmFyIGlubmVyT2JqID0gb2JqW2tleVBhdGguc3Vic3RyKDAsIHBlcmlvZCldO1xuICAgIHJldHVybiBpbm5lck9iaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ2V0QnlLZXlQYXRoKGlubmVyT2JqLCBrZXlQYXRoLnN1YnN0cihwZXJpb2QgKyAxKSk7XG4gIH1cbiAgcmV0dXJuIHZvaWQgMDtcbn1cbmZ1bmN0aW9uIHNldEJ5S2V5UGF0aChvYmosIGtleVBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqIHx8IGtleVBhdGggPT09IHZvaWQgMClcbiAgICByZXR1cm47XG4gIGlmIChcImlzRnJvemVuXCIgaW4gT2JqZWN0ICYmIE9iamVjdC5pc0Zyb3plbihvYmopKVxuICAgIHJldHVybjtcbiAgaWYgKHR5cGVvZiBrZXlQYXRoICE9PSBcInN0cmluZ1wiICYmIFwibGVuZ3RoXCIgaW4ga2V5UGF0aCkge1xuICAgIGFzc2VydCh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgJiYgXCJsZW5ndGhcIiBpbiB2YWx1ZSk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlQYXRoLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgc2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aFtpXSwgdmFsdWVbaV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgcGVyaW9kID0ga2V5UGF0aC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAocGVyaW9kICE9PSAtMSkge1xuICAgICAgdmFyIGN1cnJlbnRLZXlQYXRoID0ga2V5UGF0aC5zdWJzdHIoMCwgcGVyaW9kKTtcbiAgICAgIHZhciByZW1haW5pbmdLZXlQYXRoID0ga2V5UGF0aC5zdWJzdHIocGVyaW9kICsgMSk7XG4gICAgICBpZiAocmVtYWluaW5nS2V5UGF0aCA9PT0gXCJcIilcbiAgICAgICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoaXNBcnJheShvYmopICYmICFpc05hTihwYXJzZUludChjdXJyZW50S2V5UGF0aCkpKVxuICAgICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50S2V5UGF0aCwgMSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIG9ialtjdXJyZW50S2V5UGF0aF07XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgIG9ialtjdXJyZW50S2V5UGF0aF0gPSB2YWx1ZTtcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgaW5uZXJPYmogPSBvYmpbY3VycmVudEtleVBhdGhdO1xuICAgICAgICBpZiAoIWlubmVyT2JqKVxuICAgICAgICAgIGlubmVyT2JqID0gb2JqW2N1cnJlbnRLZXlQYXRoXSA9IHt9O1xuICAgICAgICBzZXRCeUtleVBhdGgoaW5uZXJPYmosIHJlbWFpbmluZ0tleVBhdGgsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgaWYgKGlzQXJyYXkob2JqKSAmJiAhaXNOYU4ocGFyc2VJbnQoa2V5UGF0aCkpKVxuICAgICAgICAgIG9iai5zcGxpY2Uoa2V5UGF0aCwgMSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWxldGUgb2JqW2tleVBhdGhdO1xuICAgICAgfSBlbHNlXG4gICAgICAgIG9ialtrZXlQYXRoXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZGVsQnlLZXlQYXRoKG9iaiwga2V5UGF0aCkge1xuICBpZiAodHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgc2V0QnlLZXlQYXRoKG9iaiwga2V5UGF0aCwgdm9pZCAwKTtcbiAgZWxzZSBpZiAoXCJsZW5ndGhcIiBpbiBrZXlQYXRoKVxuICAgIFtdLm1hcC5jYWxsKGtleVBhdGgsIGZ1bmN0aW9uKGtwKSB7XG4gICAgICBzZXRCeUtleVBhdGgob2JqLCBrcCwgdm9pZCAwKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHNoYWxsb3dDbG9uZShvYmopIHtcbiAgdmFyIHJ2ID0ge307XG4gIGZvciAodmFyIG0gaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bihvYmosIG0pKVxuICAgICAgcnZbbV0gPSBvYmpbbV07XG4gIH1cbiAgcmV0dXJuIHJ2O1xufVxudmFyIGNvbmNhdCA9IFtdLmNvbmNhdDtcbmZ1bmN0aW9uIGZsYXR0ZW4oYSkge1xuICByZXR1cm4gY29uY2F0LmFwcGx5KFtdLCBhKTtcbn1cbnZhciBpbnRyaW5zaWNUeXBlTmFtZXMgPSBcIkJvb2xlYW4sU3RyaW5nLERhdGUsUmVnRXhwLEJsb2IsRmlsZSxGaWxlTGlzdCxBcnJheUJ1ZmZlcixEYXRhVmlldyxVaW50OENsYW1wZWRBcnJheSxJbWFnZUJpdG1hcCxJbWFnZURhdGEsTWFwLFNldCxDcnlwdG9LZXlcIi5zcGxpdChcIixcIikuY29uY2F0KGZsYXR0ZW4oWzgsIDE2LCAzMiwgNjRdLm1hcChmdW5jdGlvbihudW0pIHtcbiAgcmV0dXJuIFtcIkludFwiLCBcIlVpbnRcIiwgXCJGbG9hdFwiXS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHJldHVybiB0ICsgbnVtICsgXCJBcnJheVwiO1xuICB9KTtcbn0pKSkuZmlsdGVyKGZ1bmN0aW9uKHQpIHtcbiAgcmV0dXJuIF9nbG9iYWxbdF07XG59KTtcbnZhciBpbnRyaW5zaWNUeXBlcyA9IGludHJpbnNpY1R5cGVOYW1lcy5tYXAoZnVuY3Rpb24odCkge1xuICByZXR1cm4gX2dsb2JhbFt0XTtcbn0pO1xudmFyIGludHJpbnNpY1R5cGVOYW1lU2V0ID0gYXJyYXlUb09iamVjdChpbnRyaW5zaWNUeXBlTmFtZXMsIGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIFt4LCB0cnVlXTtcbn0pO1xudmFyIGNpcmN1bGFyUmVmcyA9IG51bGw7XG5mdW5jdGlvbiBkZWVwQ2xvbmUoYW55KSB7XG4gIGNpcmN1bGFyUmVmcyA9IHR5cGVvZiBXZWFrTWFwICE9PSBcInVuZGVmaW5lZFwiICYmIG5ldyBXZWFrTWFwKCk7XG4gIHZhciBydiA9IGlubmVyRGVlcENsb25lKGFueSk7XG4gIGNpcmN1bGFyUmVmcyA9IG51bGw7XG4gIHJldHVybiBydjtcbn1cbmZ1bmN0aW9uIGlubmVyRGVlcENsb25lKGFueSkge1xuICBpZiAoIWFueSB8fCB0eXBlb2YgYW55ICE9PSBcIm9iamVjdFwiKVxuICAgIHJldHVybiBhbnk7XG4gIHZhciBydiA9IGNpcmN1bGFyUmVmcyAmJiBjaXJjdWxhclJlZnMuZ2V0KGFueSk7XG4gIGlmIChydilcbiAgICByZXR1cm4gcnY7XG4gIGlmIChpc0FycmF5KGFueSkpIHtcbiAgICBydiA9IFtdO1xuICAgIGNpcmN1bGFyUmVmcyAmJiBjaXJjdWxhclJlZnMuc2V0KGFueSwgcnYpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYW55Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgcnYucHVzaChpbm5lckRlZXBDbG9uZShhbnlbaV0pKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaW50cmluc2ljVHlwZXMuaW5kZXhPZihhbnkuY29uc3RydWN0b3IpID49IDApIHtcbiAgICBydiA9IGFueTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcHJvdG8gPSBnZXRQcm90byhhbnkpO1xuICAgIHJ2ID0gcHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUgPyB7fSA6IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuICAgIGNpcmN1bGFyUmVmcyAmJiBjaXJjdWxhclJlZnMuc2V0KGFueSwgcnYpO1xuICAgIGZvciAodmFyIHByb3AgaW4gYW55KSB7XG4gICAgICBpZiAoaGFzT3duKGFueSwgcHJvcCkpIHtcbiAgICAgICAgcnZbcHJvcF0gPSBpbm5lckRlZXBDbG9uZShhbnlbcHJvcF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcnY7XG59XG52YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcbmZ1bmN0aW9uIHRvU3RyaW5nVGFnKG8pIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xufVxudmFyIGdldFZhbHVlT2YgPSBmdW5jdGlvbih2YWwsIHR5cGUpIHtcbiAgcmV0dXJuIHR5cGUgPT09IFwiQXJyYXlcIiA/IFwiXCIgKyB2YWwubWFwKGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gZ2V0VmFsdWVPZih2LCB0b1N0cmluZ1RhZyh2KSk7XG4gIH0pIDogdHlwZSA9PT0gXCJBcnJheUJ1ZmZlclwiID8gXCJcIiArIG5ldyBVaW50OEFycmF5KHZhbCkgOiB0eXBlID09PSBcIkRhdGVcIiA/IHZhbC5nZXRUaW1lKCkgOiBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKSA/IFwiXCIgKyBuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSA6IHZhbDtcbn07XG5mdW5jdGlvbiBnZXRPYmplY3REaWZmKGEsIGIsIHJ2LCBwcmZ4KSB7XG4gIHJ2ID0gcnYgfHwge307XG4gIHByZnggPSBwcmZ4IHx8IFwiXCI7XG4gIGtleXMoYSkuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgaWYgKCFoYXNPd24oYiwgcHJvcCkpXG4gICAgICBydltwcmZ4ICsgcHJvcF0gPSB2b2lkIDA7XG4gICAgZWxzZSB7XG4gICAgICB2YXIgYXAgPSBhW3Byb3BdLCBicCA9IGJbcHJvcF07XG4gICAgICBpZiAodHlwZW9mIGFwID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBicCA9PT0gXCJvYmplY3RcIiAmJiBhcCAmJiBicCkge1xuICAgICAgICB2YXIgYXBUeXBlTmFtZSA9IHRvU3RyaW5nVGFnKGFwKTtcbiAgICAgICAgdmFyIGJwVHlwZU5hbWUgPSB0b1N0cmluZ1RhZyhicCk7XG4gICAgICAgIGlmIChhcFR5cGVOYW1lID09PSBicFR5cGVOYW1lKSB7XG4gICAgICAgICAgaWYgKGludHJpbnNpY1R5cGVOYW1lU2V0W2FwVHlwZU5hbWVdIHx8IGlzQXJyYXkoYXApKSB7XG4gICAgICAgICAgICBpZiAoZ2V0VmFsdWVPZihhcCwgYXBUeXBlTmFtZSkgIT09IGdldFZhbHVlT2YoYnAsIGJwVHlwZU5hbWUpKSB7XG4gICAgICAgICAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IGJbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldE9iamVjdERpZmYoYXAsIGJwLCBydiwgcHJmeCArIHByb3AgKyBcIi5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IGJbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYXAgIT09IGJwKVxuICAgICAgICBydltwcmZ4ICsgcHJvcF0gPSBiW3Byb3BdO1xuICAgIH1cbiAgfSk7XG4gIGtleXMoYikuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgaWYgKCFoYXNPd24oYSwgcHJvcCkpIHtcbiAgICAgIHJ2W3ByZnggKyBwcm9wXSA9IGJbcHJvcF07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJ2O1xufVxudmFyIGl0ZXJhdG9yU3ltYm9sID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbC5pdGVyYXRvciA6IFwiQEBpdGVyYXRvclwiO1xudmFyIGdldEl0ZXJhdG9yT2YgPSB0eXBlb2YgaXRlcmF0b3JTeW1ib2wgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbih4KSB7XG4gIHZhciBpO1xuICByZXR1cm4geCAhPSBudWxsICYmIChpID0geFtpdGVyYXRvclN5bWJvbF0pICYmIGkuYXBwbHkoeCk7XG59IDogZnVuY3Rpb24oKSB7XG4gIHJldHVybiBudWxsO1xufTtcbnZhciBOT19DSEFSX0FSUkFZID0ge307XG5mdW5jdGlvbiBnZXRBcnJheU9mKGFycmF5TGlrZSkge1xuICB2YXIgaSwgYSwgeCwgaXQ7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgaWYgKGlzQXJyYXkoYXJyYXlMaWtlKSlcbiAgICAgIHJldHVybiBhcnJheUxpa2Uuc2xpY2UoKTtcbiAgICBpZiAodGhpcyA9PT0gTk9fQ0hBUl9BUlJBWSAmJiB0eXBlb2YgYXJyYXlMaWtlID09PSBcInN0cmluZ1wiKVxuICAgICAgcmV0dXJuIFthcnJheUxpa2VdO1xuICAgIGlmIChpdCA9IGdldEl0ZXJhdG9yT2YoYXJyYXlMaWtlKSkge1xuICAgICAgYSA9IFtdO1xuICAgICAgd2hpbGUgKHggPSBpdC5uZXh0KCksICF4LmRvbmUpXG4gICAgICAgIGEucHVzaCh4LnZhbHVlKTtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBpZiAoYXJyYXlMaWtlID09IG51bGwpXG4gICAgICByZXR1cm4gW2FycmF5TGlrZV07XG4gICAgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBpID09PSBcIm51bWJlclwiKSB7XG4gICAgICBhID0gbmV3IEFycmF5KGkpO1xuICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgYVtpXSA9IGFycmF5TGlrZVtpXTtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICByZXR1cm4gW2FycmF5TGlrZV07XG4gIH1cbiAgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIGEgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0pXG4gICAgYVtpXSA9IGFyZ3VtZW50c1tpXTtcbiAgcmV0dXJuIGE7XG59XG52YXIgaXNBc3luY0Z1bmN0aW9uID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGZ1bmN0aW9uKGZuKSB7XG4gIHJldHVybiBmbltTeW1ib2wudG9TdHJpbmdUYWddID09PSBcIkFzeW5jRnVuY3Rpb25cIjtcbn0gOiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcbnZhciBkZWJ1ZyA9IHR5cGVvZiBsb2NhdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiAvXihodHRwfGh0dHBzKTpcXC9cXC8obG9jYWxob3N0fDEyN1xcLjBcXC4wXFwuMSkvLnRlc3QobG9jYXRpb24uaHJlZik7XG5mdW5jdGlvbiBzZXREZWJ1Zyh2YWx1ZSwgZmlsdGVyKSB7XG4gIGRlYnVnID0gdmFsdWU7XG4gIGxpYnJhcnlGaWx0ZXIgPSBmaWx0ZXI7XG59XG52YXIgbGlicmFyeUZpbHRlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgTkVFRFNfVEhST1dfRk9SX1NUQUNLID0gIW5ldyBFcnJvcihcIlwiKS5zdGFjaztcbmZ1bmN0aW9uIGdldEVycm9yV2l0aFN0YWNrKCkge1xuICBpZiAoTkVFRFNfVEhST1dfRk9SX1NUQUNLKVxuICAgIHRyeSB7XG4gICAgICBnZXRFcnJvcldpdGhTdGFjay5hcmd1bWVudHM7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIHJldHVybiBuZXcgRXJyb3IoKTtcbn1cbmZ1bmN0aW9uIHByZXR0eVN0YWNrKGV4Y2VwdGlvbiwgbnVtSWdub3JlZEZyYW1lcykge1xuICB2YXIgc3RhY2sgPSBleGNlcHRpb24uc3RhY2s7XG4gIGlmICghc3RhY2spXG4gICAgcmV0dXJuIFwiXCI7XG4gIG51bUlnbm9yZWRGcmFtZXMgPSBudW1JZ25vcmVkRnJhbWVzIHx8IDA7XG4gIGlmIChzdGFjay5pbmRleE9mKGV4Y2VwdGlvbi5uYW1lKSA9PT0gMClcbiAgICBudW1JZ25vcmVkRnJhbWVzICs9IChleGNlcHRpb24ubmFtZSArIGV4Y2VwdGlvbi5tZXNzYWdlKS5zcGxpdChcIlxcblwiKS5sZW5ndGg7XG4gIHJldHVybiBzdGFjay5zcGxpdChcIlxcblwiKS5zbGljZShudW1JZ25vcmVkRnJhbWVzKS5maWx0ZXIobGlicmFyeUZpbHRlcikubWFwKGZ1bmN0aW9uKGZyYW1lKSB7XG4gICAgcmV0dXJuIFwiXFxuXCIgKyBmcmFtZTtcbiAgfSkuam9pbihcIlwiKTtcbn1cbnZhciBkZXhpZUVycm9yTmFtZXMgPSBbXG4gIFwiTW9kaWZ5XCIsXG4gIFwiQnVsa1wiLFxuICBcIk9wZW5GYWlsZWRcIixcbiAgXCJWZXJzaW9uQ2hhbmdlXCIsXG4gIFwiU2NoZW1hXCIsXG4gIFwiVXBncmFkZVwiLFxuICBcIkludmFsaWRUYWJsZVwiLFxuICBcIk1pc3NpbmdBUElcIixcbiAgXCJOb1N1Y2hEYXRhYmFzZVwiLFxuICBcIkludmFsaWRBcmd1bWVudFwiLFxuICBcIlN1YlRyYW5zYWN0aW9uXCIsXG4gIFwiVW5zdXBwb3J0ZWRcIixcbiAgXCJJbnRlcm5hbFwiLFxuICBcIkRhdGFiYXNlQ2xvc2VkXCIsXG4gIFwiUHJlbWF0dXJlQ29tbWl0XCIsXG4gIFwiRm9yZWlnbkF3YWl0XCJcbl07XG52YXIgaWRiRG9tRXJyb3JOYW1lcyA9IFtcbiAgXCJVbmtub3duXCIsXG4gIFwiQ29uc3RyYWludFwiLFxuICBcIkRhdGFcIixcbiAgXCJUcmFuc2FjdGlvbkluYWN0aXZlXCIsXG4gIFwiUmVhZE9ubHlcIixcbiAgXCJWZXJzaW9uXCIsXG4gIFwiTm90Rm91bmRcIixcbiAgXCJJbnZhbGlkU3RhdGVcIixcbiAgXCJJbnZhbGlkQWNjZXNzXCIsXG4gIFwiQWJvcnRcIixcbiAgXCJUaW1lb3V0XCIsXG4gIFwiUXVvdGFFeGNlZWRlZFwiLFxuICBcIlN5bnRheFwiLFxuICBcIkRhdGFDbG9uZVwiXG5dO1xudmFyIGVycm9yTGlzdCA9IGRleGllRXJyb3JOYW1lcy5jb25jYXQoaWRiRG9tRXJyb3JOYW1lcyk7XG52YXIgZGVmYXVsdFRleHRzID0ge1xuICBWZXJzaW9uQ2hhbmdlZDogXCJEYXRhYmFzZSB2ZXJzaW9uIGNoYW5nZWQgYnkgb3RoZXIgZGF0YWJhc2UgY29ubmVjdGlvblwiLFxuICBEYXRhYmFzZUNsb3NlZDogXCJEYXRhYmFzZSBoYXMgYmVlbiBjbG9zZWRcIixcbiAgQWJvcnQ6IFwiVHJhbnNhY3Rpb24gYWJvcnRlZFwiLFxuICBUcmFuc2FjdGlvbkluYWN0aXZlOiBcIlRyYW5zYWN0aW9uIGhhcyBhbHJlYWR5IGNvbXBsZXRlZCBvciBmYWlsZWRcIixcbiAgTWlzc2luZ0FQSTogXCJJbmRleGVkREIgQVBJIG1pc3NpbmcuIFBsZWFzZSB2aXNpdCBodHRwczovL3Rpbnl1cmwuY29tL3kydXV2c2tiXCJcbn07XG5mdW5jdGlvbiBEZXhpZUVycm9yKG5hbWUsIG1zZykge1xuICB0aGlzLl9lID0gZ2V0RXJyb3JXaXRoU3RhY2soKTtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5tZXNzYWdlID0gbXNnO1xufVxuZGVyaXZlKERleGllRXJyb3IpLmZyb20oRXJyb3IpLmV4dGVuZCh7XG4gIHN0YWNrOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGFjayB8fCAodGhpcy5fc3RhY2sgPSB0aGlzLm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UgKyBwcmV0dHlTdGFjayh0aGlzLl9lLCAyKSk7XG4gICAgfVxuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZTtcbiAgfVxufSk7XG5mdW5jdGlvbiBnZXRNdWx0aUVycm9yTWVzc2FnZShtc2csIGZhaWx1cmVzKSB7XG4gIHJldHVybiBtc2cgKyBcIi4gRXJyb3JzOiBcIiArIE9iamVjdC5rZXlzKGZhaWx1cmVzKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZhaWx1cmVzW2tleV0udG9TdHJpbmcoKTtcbiAgfSkuZmlsdGVyKGZ1bmN0aW9uKHYsIGksIHMpIHtcbiAgICByZXR1cm4gcy5pbmRleE9mKHYpID09PSBpO1xuICB9KS5qb2luKFwiXFxuXCIpO1xufVxuZnVuY3Rpb24gTW9kaWZ5RXJyb3IobXNnLCBmYWlsdXJlcywgc3VjY2Vzc0NvdW50LCBmYWlsZWRLZXlzKSB7XG4gIHRoaXMuX2UgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICB0aGlzLmZhaWx1cmVzID0gZmFpbHVyZXM7XG4gIHRoaXMuZmFpbGVkS2V5cyA9IGZhaWxlZEtleXM7XG4gIHRoaXMuc3VjY2Vzc0NvdW50ID0gc3VjY2Vzc0NvdW50O1xuICB0aGlzLm1lc3NhZ2UgPSBnZXRNdWx0aUVycm9yTWVzc2FnZShtc2csIGZhaWx1cmVzKTtcbn1cbmRlcml2ZShNb2RpZnlFcnJvcikuZnJvbShEZXhpZUVycm9yKTtcbmZ1bmN0aW9uIEJ1bGtFcnJvcihtc2csIGZhaWx1cmVzKSB7XG4gIHRoaXMuX2UgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICB0aGlzLm5hbWUgPSBcIkJ1bGtFcnJvclwiO1xuICB0aGlzLmZhaWx1cmVzID0gT2JqZWN0LmtleXMoZmFpbHVyZXMpLm1hcChmdW5jdGlvbihwb3MpIHtcbiAgICByZXR1cm4gZmFpbHVyZXNbcG9zXTtcbiAgfSk7XG4gIHRoaXMuZmFpbHVyZXNCeVBvcyA9IGZhaWx1cmVzO1xuICB0aGlzLm1lc3NhZ2UgPSBnZXRNdWx0aUVycm9yTWVzc2FnZShtc2csIGZhaWx1cmVzKTtcbn1cbmRlcml2ZShCdWxrRXJyb3IpLmZyb20oRGV4aWVFcnJvcik7XG52YXIgZXJybmFtZXMgPSBlcnJvckxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICByZXR1cm4gb2JqW25hbWVdID0gbmFtZSArIFwiRXJyb3JcIiwgb2JqO1xufSwge30pO1xudmFyIEJhc2VFeGNlcHRpb24gPSBEZXhpZUVycm9yO1xudmFyIGV4Y2VwdGlvbnMgPSBlcnJvckxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICB2YXIgZnVsbE5hbWUgPSBuYW1lICsgXCJFcnJvclwiO1xuICBmdW5jdGlvbiBEZXhpZUVycm9yMihtc2dPcklubmVyLCBpbm5lcikge1xuICAgIHRoaXMuX2UgPSBnZXRFcnJvcldpdGhTdGFjaygpO1xuICAgIHRoaXMubmFtZSA9IGZ1bGxOYW1lO1xuICAgIGlmICghbXNnT3JJbm5lcikge1xuICAgICAgdGhpcy5tZXNzYWdlID0gZGVmYXVsdFRleHRzW25hbWVdIHx8IGZ1bGxOYW1lO1xuICAgICAgdGhpcy5pbm5lciA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbXNnT3JJbm5lciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdGhpcy5tZXNzYWdlID0gXCJcIiArIG1zZ09ySW5uZXIgKyAoIWlubmVyID8gXCJcIiA6IFwiXFxuIFwiICsgaW5uZXIpO1xuICAgICAgdGhpcy5pbm5lciA9IGlubmVyIHx8IG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbXNnT3JJbm5lciA9PT0gXCJvYmplY3RcIikge1xuICAgICAgdGhpcy5tZXNzYWdlID0gbXNnT3JJbm5lci5uYW1lICsgXCIgXCIgKyBtc2dPcklubmVyLm1lc3NhZ2U7XG4gICAgICB0aGlzLmlubmVyID0gbXNnT3JJbm5lcjtcbiAgICB9XG4gIH1cbiAgZGVyaXZlKERleGllRXJyb3IyKS5mcm9tKEJhc2VFeGNlcHRpb24pO1xuICBvYmpbbmFtZV0gPSBEZXhpZUVycm9yMjtcbiAgcmV0dXJuIG9iajtcbn0sIHt9KTtcbmV4Y2VwdGlvbnMuU3ludGF4ID0gU3ludGF4RXJyb3I7XG5leGNlcHRpb25zLlR5cGUgPSBUeXBlRXJyb3I7XG5leGNlcHRpb25zLlJhbmdlID0gUmFuZ2VFcnJvcjtcbnZhciBleGNlcHRpb25NYXAgPSBpZGJEb21FcnJvck5hbWVzLnJlZHVjZShmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgb2JqW25hbWUgKyBcIkVycm9yXCJdID0gZXhjZXB0aW9uc1tuYW1lXTtcbiAgcmV0dXJuIG9iajtcbn0sIHt9KTtcbmZ1bmN0aW9uIG1hcEVycm9yKGRvbUVycm9yLCBtZXNzYWdlKSB7XG4gIGlmICghZG9tRXJyb3IgfHwgZG9tRXJyb3IgaW5zdGFuY2VvZiBEZXhpZUVycm9yIHx8IGRvbUVycm9yIGluc3RhbmNlb2YgVHlwZUVycm9yIHx8IGRvbUVycm9yIGluc3RhbmNlb2YgU3ludGF4RXJyb3IgfHwgIWRvbUVycm9yLm5hbWUgfHwgIWV4Y2VwdGlvbk1hcFtkb21FcnJvci5uYW1lXSlcbiAgICByZXR1cm4gZG9tRXJyb3I7XG4gIHZhciBydiA9IG5ldyBleGNlcHRpb25NYXBbZG9tRXJyb3IubmFtZV0obWVzc2FnZSB8fCBkb21FcnJvci5tZXNzYWdlLCBkb21FcnJvcik7XG4gIGlmIChcInN0YWNrXCIgaW4gZG9tRXJyb3IpIHtcbiAgICBzZXRQcm9wKHJ2LCBcInN0YWNrXCIsIHtnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5uZXIuc3RhY2s7XG4gICAgfX0pO1xuICB9XG4gIHJldHVybiBydjtcbn1cbnZhciBmdWxsTmFtZUV4Y2VwdGlvbnMgPSBlcnJvckxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICBpZiAoW1wiU3ludGF4XCIsIFwiVHlwZVwiLCBcIlJhbmdlXCJdLmluZGV4T2YobmFtZSkgPT09IC0xKVxuICAgIG9ialtuYW1lICsgXCJFcnJvclwiXSA9IGV4Y2VwdGlvbnNbbmFtZV07XG4gIHJldHVybiBvYmo7XG59LCB7fSk7XG5mdWxsTmFtZUV4Y2VwdGlvbnMuTW9kaWZ5RXJyb3IgPSBNb2RpZnlFcnJvcjtcbmZ1bGxOYW1lRXhjZXB0aW9ucy5EZXhpZUVycm9yID0gRGV4aWVFcnJvcjtcbmZ1bGxOYW1lRXhjZXB0aW9ucy5CdWxrRXJyb3IgPSBCdWxrRXJyb3I7XG5mdW5jdGlvbiBub3AoKSB7XG59XG5mdW5jdGlvbiBtaXJyb3IodmFsKSB7XG4gIHJldHVybiB2YWw7XG59XG5mdW5jdGlvbiBwdXJlRnVuY3Rpb25DaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09IG51bGwgfHwgZjEgPT09IG1pcnJvcilcbiAgICByZXR1cm4gZjI7XG4gIHJldHVybiBmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gZjIoZjEodmFsKSk7XG4gIH07XG59XG5mdW5jdGlvbiBjYWxsQm90aChvbjEsIG9uMikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgb24xLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgb24yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5mdW5jdGlvbiBob29rQ3JlYXRpbmdDaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09PSBub3ApXG4gICAgcmV0dXJuIGYyO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IGYxLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlcyAhPT0gdm9pZCAwKVxuICAgICAgYXJndW1lbnRzWzBdID0gcmVzO1xuICAgIHZhciBvbnN1Y2Nlc3MgPSB0aGlzLm9uc3VjY2Vzcywgb25lcnJvciA9IHRoaXMub25lcnJvcjtcbiAgICB0aGlzLm9uc3VjY2VzcyA9IG51bGw7XG4gICAgdGhpcy5vbmVycm9yID0gbnVsbDtcbiAgICB2YXIgcmVzMiA9IGYyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKG9uc3VjY2VzcylcbiAgICAgIHRoaXMub25zdWNjZXNzID0gdGhpcy5vbnN1Y2Nlc3MgPyBjYWxsQm90aChvbnN1Y2Nlc3MsIHRoaXMub25zdWNjZXNzKSA6IG9uc3VjY2VzcztcbiAgICBpZiAob25lcnJvcilcbiAgICAgIHRoaXMub25lcnJvciA9IHRoaXMub25lcnJvciA/IGNhbGxCb3RoKG9uZXJyb3IsIHRoaXMub25lcnJvcikgOiBvbmVycm9yO1xuICAgIHJldHVybiByZXMyICE9PSB2b2lkIDAgPyByZXMyIDogcmVzO1xuICB9O1xufVxuZnVuY3Rpb24gaG9va0RlbGV0aW5nQ2hhaW4oZjEsIGYyKSB7XG4gIGlmIChmMSA9PT0gbm9wKVxuICAgIHJldHVybiBmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGYxLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIG9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzLCBvbmVycm9yID0gdGhpcy5vbmVycm9yO1xuICAgIHRoaXMub25zdWNjZXNzID0gdGhpcy5vbmVycm9yID0gbnVsbDtcbiAgICBmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChvbnN1Y2Nlc3MpXG4gICAgICB0aGlzLm9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzID8gY2FsbEJvdGgob25zdWNjZXNzLCB0aGlzLm9uc3VjY2VzcykgOiBvbnN1Y2Nlc3M7XG4gICAgaWYgKG9uZXJyb3IpXG4gICAgICB0aGlzLm9uZXJyb3IgPSB0aGlzLm9uZXJyb3IgPyBjYWxsQm90aChvbmVycm9yLCB0aGlzLm9uZXJyb3IpIDogb25lcnJvcjtcbiAgfTtcbn1cbmZ1bmN0aW9uIGhvb2tVcGRhdGluZ0NoYWluKGYxLCBmMikge1xuICBpZiAoZjEgPT09IG5vcClcbiAgICByZXR1cm4gZjI7XG4gIHJldHVybiBmdW5jdGlvbihtb2RpZmljYXRpb25zKSB7XG4gICAgdmFyIHJlcyA9IGYxLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgZXh0ZW5kKG1vZGlmaWNhdGlvbnMsIHJlcyk7XG4gICAgdmFyIG9uc3VjY2VzcyA9IHRoaXMub25zdWNjZXNzLCBvbmVycm9yID0gdGhpcy5vbmVycm9yO1xuICAgIHRoaXMub25zdWNjZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgIHZhciByZXMyID0gZjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAob25zdWNjZXNzKVxuICAgICAgdGhpcy5vbnN1Y2Nlc3MgPSB0aGlzLm9uc3VjY2VzcyA/IGNhbGxCb3RoKG9uc3VjY2VzcywgdGhpcy5vbnN1Y2Nlc3MpIDogb25zdWNjZXNzO1xuICAgIGlmIChvbmVycm9yKVxuICAgICAgdGhpcy5vbmVycm9yID0gdGhpcy5vbmVycm9yID8gY2FsbEJvdGgob25lcnJvciwgdGhpcy5vbmVycm9yKSA6IG9uZXJyb3I7XG4gICAgcmV0dXJuIHJlcyA9PT0gdm9pZCAwID8gcmVzMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVzMiA6IGV4dGVuZChyZXMsIHJlczIpO1xuICB9O1xufVxuZnVuY3Rpb24gcmV2ZXJzZVN0b3BwYWJsZUV2ZW50Q2hhaW4oZjEsIGYyKSB7XG4gIGlmIChmMSA9PT0gbm9wKVxuICAgIHJldHVybiBmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmIChmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gZjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHByb21pc2FibGVDaGFpbihmMSwgZjIpIHtcbiAgaWYgKGYxID09PSBub3ApXG4gICAgcmV0dXJuIGYyO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IGYxLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlcyAmJiB0eXBlb2YgcmVzLnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHRoaXogPSB0aGlzLCBpID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShpKTtcbiAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgICByZXR1cm4gcmVzLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmMi5hcHBseSh0aGl6LCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cbnZhciBJTlRFUk5BTCA9IHt9O1xudmFyIExPTkdfU1RBQ0tTX0NMSVBfTElNSVQgPSAxMDAsIE1BWF9MT05HX1NUQUNLUyA9IDIwLCBaT05FX0VDSE9fTElNSVQgPSAxMDAsIF9hJDEgPSB0eXBlb2YgUHJvbWlzZSA9PT0gXCJ1bmRlZmluZWRcIiA/IFtdIDogZnVuY3Rpb24oKSB7XG4gIHZhciBnbG9iYWxQID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGlmICh0eXBlb2YgY3J5cHRvID09PSBcInVuZGVmaW5lZFwiIHx8ICFjcnlwdG8uc3VidGxlKVxuICAgIHJldHVybiBbZ2xvYmFsUCwgZ2V0UHJvdG8oZ2xvYmFsUCksIGdsb2JhbFBdO1xuICB2YXIgbmF0aXZlUCA9IGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTUxMlwiLCBuZXcgVWludDhBcnJheShbMF0pKTtcbiAgcmV0dXJuIFtcbiAgICBuYXRpdmVQLFxuICAgIGdldFByb3RvKG5hdGl2ZVApLFxuICAgIGdsb2JhbFBcbiAgXTtcbn0oKSwgcmVzb2x2ZWROYXRpdmVQcm9taXNlID0gX2EkMVswXSwgbmF0aXZlUHJvbWlzZVByb3RvID0gX2EkMVsxXSwgcmVzb2x2ZWRHbG9iYWxQcm9taXNlID0gX2EkMVsyXSwgbmF0aXZlUHJvbWlzZVRoZW4gPSBuYXRpdmVQcm9taXNlUHJvdG8gJiYgbmF0aXZlUHJvbWlzZVByb3RvLnRoZW47XG52YXIgTmF0aXZlUHJvbWlzZSA9IHJlc29sdmVkTmF0aXZlUHJvbWlzZSAmJiByZXNvbHZlZE5hdGl2ZVByb21pc2UuY29uc3RydWN0b3I7XG52YXIgcGF0Y2hHbG9iYWxQcm9taXNlID0gISFyZXNvbHZlZEdsb2JhbFByb21pc2U7XG52YXIgc3RhY2tfYmVpbmdfZ2VuZXJhdGVkID0gZmFsc2U7XG52YXIgc2NoZWR1bGVQaHlzaWNhbFRpY2sgPSByZXNvbHZlZEdsb2JhbFByb21pc2UgPyBmdW5jdGlvbigpIHtcbiAgcmVzb2x2ZWRHbG9iYWxQcm9taXNlLnRoZW4ocGh5c2ljYWxUaWNrKTtcbn0gOiBfZ2xvYmFsLnNldEltbWVkaWF0ZSA/IHNldEltbWVkaWF0ZS5iaW5kKG51bGwsIHBoeXNpY2FsVGljaykgOiBfZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgPyBmdW5jdGlvbigpIHtcbiAgdmFyIGhpZGRlbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKCkge1xuICAgIHBoeXNpY2FsVGljaygpO1xuICAgIGhpZGRlbkRpdiA9IG51bGw7XG4gIH0pLm9ic2VydmUoaGlkZGVuRGl2LCB7YXR0cmlidXRlczogdHJ1ZX0pO1xuICBoaWRkZW5EaXYuc2V0QXR0cmlidXRlKFwiaVwiLCBcIjFcIik7XG59IDogZnVuY3Rpb24oKSB7XG4gIHNldFRpbWVvdXQocGh5c2ljYWxUaWNrLCAwKTtcbn07XG52YXIgYXNhcCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBhcmdzKSB7XG4gIG1pY3JvdGlja1F1ZXVlLnB1c2goW2NhbGxiYWNrLCBhcmdzXSk7XG4gIGlmIChuZWVkc05ld1BoeXNpY2FsVGljaykge1xuICAgIHNjaGVkdWxlUGh5c2ljYWxUaWNrKCk7XG4gICAgbmVlZHNOZXdQaHlzaWNhbFRpY2sgPSBmYWxzZTtcbiAgfVxufTtcbnZhciBpc091dHNpZGVNaWNyb1RpY2sgPSB0cnVlLCBuZWVkc05ld1BoeXNpY2FsVGljayA9IHRydWUsIHVuaGFuZGxlZEVycm9ycyA9IFtdLCByZWplY3RpbmdFcnJvcnMgPSBbXSwgY3VycmVudEZ1bGZpbGxlciA9IG51bGwsIHJlamVjdGlvbk1hcHBlciA9IG1pcnJvcjtcbnZhciBnbG9iYWxQU0QgPSB7XG4gIGlkOiBcImdsb2JhbFwiLFxuICBnbG9iYWw6IHRydWUsXG4gIHJlZjogMCxcbiAgdW5oYW5kbGVkczogW10sXG4gIG9udW5oYW5kbGVkOiBnbG9iYWxFcnJvcixcbiAgcGdwOiBmYWxzZSxcbiAgZW52OiB7fSxcbiAgZmluYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudW5oYW5kbGVkcy5mb3JFYWNoKGZ1bmN0aW9uKHVoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBnbG9iYWxFcnJvcih1aFswXSwgdWhbMV0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xudmFyIFBTRCA9IGdsb2JhbFBTRDtcbnZhciBtaWNyb3RpY2tRdWV1ZSA9IFtdO1xudmFyIG51bVNjaGVkdWxlZENhbGxzID0gMDtcbnZhciB0aWNrRmluYWxpemVycyA9IFtdO1xuZnVuY3Rpb24gRGV4aWVQcm9taXNlKGZuKSB7XG4gIGlmICh0eXBlb2YgdGhpcyAhPT0gXCJvYmplY3RcIilcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3XCIpO1xuICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgdGhpcy5vbnVuY2F0Y2hlZCA9IG5vcDtcbiAgdGhpcy5fbGliID0gZmFsc2U7XG4gIHZhciBwc2QgPSB0aGlzLl9QU0QgPSBQU0Q7XG4gIGlmIChkZWJ1Zykge1xuICAgIHRoaXMuX3N0YWNrSG9sZGVyID0gZ2V0RXJyb3JXaXRoU3RhY2soKTtcbiAgICB0aGlzLl9wcmV2ID0gbnVsbDtcbiAgICB0aGlzLl9udW1QcmV2ID0gMDtcbiAgfVxuICBpZiAodHlwZW9mIGZuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpZiAoZm4gIT09IElOVEVSTkFMKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgIHRoaXMuX3N0YXRlID0gYXJndW1lbnRzWzFdO1xuICAgIHRoaXMuX3ZhbHVlID0gYXJndW1lbnRzWzJdO1xuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gZmFsc2UpXG4gICAgICBoYW5kbGVSZWplY3Rpb24odGhpcywgdGhpcy5fdmFsdWUpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gIHRoaXMuX3ZhbHVlID0gbnVsbDtcbiAgKytwc2QucmVmO1xuICBleGVjdXRlUHJvbWlzZVRhc2sodGhpcywgZm4pO1xufVxudmFyIHRoZW5Qcm9wID0ge1xuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwc2QgPSBQU0QsIG1pY3JvVGFza0lkID0gdG90YWxFY2hvZXM7XG4gICAgZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHZhciBwb3NzaWJsZUF3YWl0ID0gIXBzZC5nbG9iYWwgJiYgKHBzZCAhPT0gUFNEIHx8IG1pY3JvVGFza0lkICE9PSB0b3RhbEVjaG9lcyk7XG4gICAgICB2YXIgY2xlYW51cCA9IHBvc3NpYmxlQXdhaXQgJiYgIWRlY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgICB2YXIgcnYgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBwcm9wYWdhdGVUb0xpc3RlbmVyKF90aGlzLCBuZXcgTGlzdGVuZXIobmF0aXZlQXdhaXRDb21wYXRpYmxlV3JhcChvbkZ1bGZpbGxlZCwgcHNkLCBwb3NzaWJsZUF3YWl0LCBjbGVhbnVwKSwgbmF0aXZlQXdhaXRDb21wYXRpYmxlV3JhcChvblJlamVjdGVkLCBwc2QsIHBvc3NpYmxlQXdhaXQsIGNsZWFudXApLCByZXNvbHZlLCByZWplY3QsIHBzZCkpO1xuICAgICAgfSk7XG4gICAgICBkZWJ1ZyAmJiBsaW5rVG9QcmV2aW91c1Byb21pc2UocnYsIHRoaXMpO1xuICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cbiAgICB0aGVuLnByb3RvdHlwZSA9IElOVEVSTkFMO1xuICAgIHJldHVybiB0aGVuO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgc2V0UHJvcCh0aGlzLCBcInRoZW5cIiwgdmFsdWUgJiYgdmFsdWUucHJvdG90eXBlID09PSBJTlRFUk5BTCA/IHRoZW5Qcm9wIDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogdGhlblByb3Auc2V0XG4gICAgfSk7XG4gIH1cbn07XG5wcm9wcyhEZXhpZVByb21pc2UucHJvdG90eXBlLCB7XG4gIHRoZW46IHRoZW5Qcm9wLFxuICBfdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICBwcm9wYWdhdGVUb0xpc3RlbmVyKHRoaXMsIG5ldyBMaXN0ZW5lcihudWxsLCBudWxsLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgUFNEKSk7XG4gIH0sXG4gIGNhdGNoOiBmdW5jdGlvbihvblJlamVjdGVkKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xuICAgIHZhciB0eXBlID0gYXJndW1lbnRzWzBdLCBoYW5kbGVyID0gYXJndW1lbnRzWzFdO1xuICAgIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiID8gdGhpcy50aGVuKG51bGwsIGZ1bmN0aW9uKGVycikge1xuICAgICAgcmV0dXJuIGVyciBpbnN0YW5jZW9mIHR5cGUgPyBoYW5kbGVyKGVycikgOiBQcm9taXNlUmVqZWN0KGVycik7XG4gICAgfSkgOiB0aGlzLnRoZW4obnVsbCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXR1cm4gZXJyICYmIGVyci5uYW1lID09PSB0eXBlID8gaGFuZGxlcihlcnIpIDogUHJvbWlzZVJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9LFxuICBmaW5hbGx5OiBmdW5jdGlvbihvbkZpbmFsbHkpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBvbkZpbmFsbHkoKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIG9uRmluYWxseSgpO1xuICAgICAgcmV0dXJuIFByb21pc2VSZWplY3QoZXJyKTtcbiAgICB9KTtcbiAgfSxcbiAgc3RhY2s6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX3N0YWNrKVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhY2s7XG4gICAgICB0cnkge1xuICAgICAgICBzdGFja19iZWluZ19nZW5lcmF0ZWQgPSB0cnVlO1xuICAgICAgICB2YXIgc3RhY2tzID0gZ2V0U3RhY2sodGhpcywgW10sIE1BWF9MT05HX1NUQUNLUyk7XG4gICAgICAgIHZhciBzdGFjayA9IHN0YWNrcy5qb2luKFwiXFxuRnJvbSBwcmV2aW91czogXCIpO1xuICAgICAgICBpZiAodGhpcy5fc3RhdGUgIT09IG51bGwpXG4gICAgICAgICAgdGhpcy5fc3RhY2sgPSBzdGFjaztcbiAgICAgICAgcmV0dXJuIHN0YWNrO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc3RhY2tfYmVpbmdfZ2VuZXJhdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0aW1lb3V0OiBmdW5jdGlvbihtcywgbXNnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gbXMgPCBJbmZpbml0eSA/IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgaGFuZGxlID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgZXhjZXB0aW9ucy5UaW1lb3V0KG1zZykpO1xuICAgICAgfSwgbXMpO1xuICAgICAgX3RoaXMudGhlbihyZXNvbHZlLCByZWplY3QpLmZpbmFsbHkoY2xlYXJUaW1lb3V0LmJpbmQobnVsbCwgaGFuZGxlKSk7XG4gICAgfSkgOiB0aGlzO1xuICB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIFN5bWJvbC50b1N0cmluZ1RhZylcbiAgc2V0UHJvcChEZXhpZVByb21pc2UucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIFwiRGV4aWUuUHJvbWlzZVwiKTtcbmdsb2JhbFBTRC5lbnYgPSBzbmFwU2hvdCgpO1xuZnVuY3Rpb24gTGlzdGVuZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlc29sdmUsIHJlamVjdCwgem9uZSkge1xuICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSBcImZ1bmN0aW9uXCIgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSBcImZ1bmN0aW9uXCIgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gIHRoaXMucHNkID0gem9uZTtcbn1cbnByb3BzKERleGllUHJvbWlzZSwge1xuICBhbGw6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBnZXRBcnJheU9mLmFwcGx5KG51bGwsIGFyZ3VtZW50cykubWFwKG9uUG9zc2libGVQYXJhbGxlbGxBc3luYyk7XG4gICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKGEsIGkpIHtcbiAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKGEpLnRoZW4oZnVuY3Rpb24oeCkge1xuICAgICAgICAgIHZhbHVlc1tpXSA9IHg7XG4gICAgICAgICAgaWYgKCEtLXJlbWFpbmluZylcbiAgICAgICAgICAgIHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICByZXNvbHZlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERleGllUHJvbWlzZSlcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09IFwiZnVuY3Rpb25cIilcbiAgICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YWx1ZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB2YXIgcnYgPSBuZXcgRGV4aWVQcm9taXNlKElOVEVSTkFMLCB0cnVlLCB2YWx1ZSk7XG4gICAgbGlua1RvUHJldmlvdXNQcm9taXNlKHJ2LCBjdXJyZW50RnVsZmlsbGVyKTtcbiAgICByZXR1cm4gcnY7XG4gIH0sXG4gIHJlamVjdDogUHJvbWlzZVJlamVjdCxcbiAgcmFjZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IGdldEFycmF5T2YuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5tYXAob25Qb3NzaWJsZVBhcmFsbGVsbEFzeW5jKTtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhbHVlcy5tYXAoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgUFNEOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQU0Q7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gUFNEID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICB0b3RhbEVjaG9lczoge2dldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRvdGFsRWNob2VzO1xuICB9fSxcbiAgbmV3UFNEOiBuZXdTY29wZSxcbiAgdXNlUFNELFxuICBzY2hlZHVsZXI6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGFzYXA7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBhc2FwID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICByZWplY3Rpb25NYXBwZXI6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlamVjdGlvbk1hcHBlcjtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJlamVjdGlvbk1hcHBlciA9IHZhbHVlO1xuICAgIH1cbiAgfSxcbiAgZm9sbG93OiBmdW5jdGlvbihmbiwgem9uZVByb3BzKSB7XG4gICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3U2NvcGUoZnVuY3Rpb24ocmVzb2x2ZTIsIHJlamVjdDIpIHtcbiAgICAgICAgdmFyIHBzZCA9IFBTRDtcbiAgICAgICAgcHNkLnVuaGFuZGxlZHMgPSBbXTtcbiAgICAgICAgcHNkLm9udW5oYW5kbGVkID0gcmVqZWN0MjtcbiAgICAgICAgcHNkLmZpbmFsaXplID0gY2FsbEJvdGgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICBydW5fYXRfZW5kX29mX3RoaXNfb3JfbmV4dF9waHlzaWNhbF90aWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX3RoaXMudW5oYW5kbGVkcy5sZW5ndGggPT09IDAgPyByZXNvbHZlMigpIDogcmVqZWN0MihfdGhpcy51bmhhbmRsZWRzWzBdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgcHNkLmZpbmFsaXplKTtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0sIHpvbmVQcm9wcywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG5pZiAoTmF0aXZlUHJvbWlzZSkge1xuICBpZiAoTmF0aXZlUHJvbWlzZS5hbGxTZXR0bGVkKVxuICAgIHNldFByb3AoRGV4aWVQcm9taXNlLCBcImFsbFNldHRsZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zc2libGVQcm9taXNlcyA9IGdldEFycmF5T2YuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5tYXAob25Qb3NzaWJsZVBhcmFsbGVsbEFzeW5jKTtcbiAgICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlUHJvbWlzZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgIHJlc29sdmUoW10pO1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gcG9zc2libGVQcm9taXNlcy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICAgIHBvc3NpYmxlUHJvbWlzZXMuZm9yRWFjaChmdW5jdGlvbihwLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHApLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzW2ldID0ge3N0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWV9O1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNbaV0gPSB7c3RhdHVzOiBcInJlamVjdGVkXCIsIHJlYXNvbn07XG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICBpZiAoTmF0aXZlUHJvbWlzZS5hbnkgJiYgdHlwZW9mIEFnZ3JlZ2F0ZUVycm9yICE9PSBcInVuZGVmaW5lZFwiKVxuICAgIHNldFByb3AoRGV4aWVQcm9taXNlLCBcImFueVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NzaWJsZVByb21pc2VzID0gZ2V0QXJyYXlPZi5hcHBseShudWxsLCBhcmd1bWVudHMpLm1hcChvblBvc3NpYmxlUGFyYWxsZWxsQXN5bmMpO1xuICAgICAgcmV0dXJuIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGlmIChwb3NzaWJsZVByb21pc2VzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICByZWplY3QobmV3IEFnZ3JlZ2F0ZUVycm9yKFtdKSk7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSBwb3NzaWJsZVByb21pc2VzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZhaWx1cmVzID0gbmV3IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICAgIHBvc3NpYmxlUHJvbWlzZXMuZm9yRWFjaChmdW5jdGlvbihwLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHApLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihmYWlsdXJlKSB7XG4gICAgICAgICAgICBmYWlsdXJlc1tpXSA9IGZhaWx1cmU7XG4gICAgICAgICAgICBpZiAoIS0tcmVtYWluaW5nKVxuICAgICAgICAgICAgICByZWplY3QobmV3IEFnZ3JlZ2F0ZUVycm9yKGZhaWx1cmVzKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBleGVjdXRlUHJvbWlzZVRhc2socHJvbWlzZSwgZm4pIHtcbiAgdHJ5IHtcbiAgICBmbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBudWxsKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAodmFsdWUgPT09IHByb21pc2UpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLlwiKTtcbiAgICAgIHZhciBzaG91bGRFeGVjdXRlVGljayA9IHByb21pc2UuX2xpYiAmJiBiZWdpbk1pY3JvVGlja1Njb3BlKCk7XG4gICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBleGVjdXRlUHJvbWlzZVRhc2socHJvbWlzZSwgZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgdmFsdWUgaW5zdGFuY2VvZiBEZXhpZVByb21pc2UgPyB2YWx1ZS5fdGhlbihyZXNvbHZlLCByZWplY3QpIDogdmFsdWUudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb21pc2UuX3N0YXRlID0gdHJ1ZTtcbiAgICAgICAgcHJvbWlzZS5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcHJvcGFnYXRlQWxsTGlzdGVuZXJzKHByb21pc2UpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3VsZEV4ZWN1dGVUaWNrKVxuICAgICAgICBlbmRNaWNyb1RpY2tTY29wZSgpO1xuICAgIH0sIGhhbmRsZVJlamVjdGlvbi5iaW5kKG51bGwsIHByb21pc2UpKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBoYW5kbGVSZWplY3Rpb24ocHJvbWlzZSwgZXgpO1xuICB9XG59XG5mdW5jdGlvbiBoYW5kbGVSZWplY3Rpb24ocHJvbWlzZSwgcmVhc29uKSB7XG4gIHJlamVjdGluZ0Vycm9ycy5wdXNoKHJlYXNvbik7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbnVsbClcbiAgICByZXR1cm47XG4gIHZhciBzaG91bGRFeGVjdXRlVGljayA9IHByb21pc2UuX2xpYiAmJiBiZWdpbk1pY3JvVGlja1Njb3BlKCk7XG4gIHJlYXNvbiA9IHJlamVjdGlvbk1hcHBlcihyZWFzb24pO1xuICBwcm9taXNlLl9zdGF0ZSA9IGZhbHNlO1xuICBwcm9taXNlLl92YWx1ZSA9IHJlYXNvbjtcbiAgZGVidWcgJiYgcmVhc29uICE9PSBudWxsICYmIHR5cGVvZiByZWFzb24gPT09IFwib2JqZWN0XCIgJiYgIXJlYXNvbi5fcHJvbWlzZSAmJiB0cnlDYXRjaChmdW5jdGlvbigpIHtcbiAgICB2YXIgb3JpZ1Byb3AgPSBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocmVhc29uLCBcInN0YWNrXCIpO1xuICAgIHJlYXNvbi5fcHJvbWlzZSA9IHByb21pc2U7XG4gICAgc2V0UHJvcChyZWFzb24sIFwic3RhY2tcIiwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrX2JlaW5nX2dlbmVyYXRlZCA/IG9yaWdQcm9wICYmIChvcmlnUHJvcC5nZXQgPyBvcmlnUHJvcC5nZXQuYXBwbHkocmVhc29uKSA6IG9yaWdQcm9wLnZhbHVlKSA6IHByb21pc2Uuc3RhY2s7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBhZGRQb3NzaWJseVVuaGFuZGxlZEVycm9yKHByb21pc2UpO1xuICBwcm9wYWdhdGVBbGxMaXN0ZW5lcnMocHJvbWlzZSk7XG4gIGlmIChzaG91bGRFeGVjdXRlVGljaylcbiAgICBlbmRNaWNyb1RpY2tTY29wZSgpO1xufVxuZnVuY3Rpb24gcHJvcGFnYXRlQWxsTGlzdGVuZXJzKHByb21pc2UpIHtcbiAgdmFyIGxpc3RlbmVycyA9IHByb21pc2UuX2xpc3RlbmVycztcbiAgcHJvbWlzZS5fbGlzdGVuZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwcm9wYWdhdGVUb0xpc3RlbmVyKHByb21pc2UsIGxpc3RlbmVyc1tpXSk7XG4gIH1cbiAgdmFyIHBzZCA9IHByb21pc2UuX1BTRDtcbiAgLS1wc2QucmVmIHx8IHBzZC5maW5hbGl6ZSgpO1xuICBpZiAobnVtU2NoZWR1bGVkQ2FsbHMgPT09IDApIHtcbiAgICArK251bVNjaGVkdWxlZENhbGxzO1xuICAgIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS1udW1TY2hlZHVsZWRDYWxscyA9PT0gMClcbiAgICAgICAgZmluYWxpemVQaHlzaWNhbFRpY2soKTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHByb3BhZ2F0ZVRvTGlzdGVuZXIocHJvbWlzZSwgbGlzdGVuZXIpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBudWxsKSB7XG4gICAgcHJvbWlzZS5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgY2IgPSBwcm9taXNlLl9zdGF0ZSA/IGxpc3RlbmVyLm9uRnVsZmlsbGVkIDogbGlzdGVuZXIub25SZWplY3RlZDtcbiAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIChwcm9taXNlLl9zdGF0ZSA/IGxpc3RlbmVyLnJlc29sdmUgOiBsaXN0ZW5lci5yZWplY3QpKHByb21pc2UuX3ZhbHVlKTtcbiAgfVxuICArK2xpc3RlbmVyLnBzZC5yZWY7XG4gICsrbnVtU2NoZWR1bGVkQ2FsbHM7XG4gIGFzYXAoY2FsbExpc3RlbmVyLCBbY2IsIHByb21pc2UsIGxpc3RlbmVyXSk7XG59XG5mdW5jdGlvbiBjYWxsTGlzdGVuZXIoY2IsIHByb21pc2UsIGxpc3RlbmVyKSB7XG4gIHRyeSB7XG4gICAgY3VycmVudEZ1bGZpbGxlciA9IHByb21pc2U7XG4gICAgdmFyIHJldCwgdmFsdWUgPSBwcm9taXNlLl92YWx1ZTtcbiAgICBpZiAocHJvbWlzZS5fc3RhdGUpIHtcbiAgICAgIHJldCA9IGNiKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlamVjdGluZ0Vycm9ycy5sZW5ndGgpXG4gICAgICAgIHJlamVjdGluZ0Vycm9ycyA9IFtdO1xuICAgICAgcmV0ID0gY2IodmFsdWUpO1xuICAgICAgaWYgKHJlamVjdGluZ0Vycm9ycy5pbmRleE9mKHZhbHVlKSA9PT0gLTEpXG4gICAgICAgIG1hcmtFcnJvckFzSGFuZGxlZChwcm9taXNlKTtcbiAgICB9XG4gICAgbGlzdGVuZXIucmVzb2x2ZShyZXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbGlzdGVuZXIucmVqZWN0KGUpO1xuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRGdWxmaWxsZXIgPSBudWxsO1xuICAgIGlmICgtLW51bVNjaGVkdWxlZENhbGxzID09PSAwKVxuICAgICAgZmluYWxpemVQaHlzaWNhbFRpY2soKTtcbiAgICAtLWxpc3RlbmVyLnBzZC5yZWYgfHwgbGlzdGVuZXIucHNkLmZpbmFsaXplKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFN0YWNrKHByb21pc2UsIHN0YWNrcywgbGltaXQpIHtcbiAgaWYgKHN0YWNrcy5sZW5ndGggPT09IGxpbWl0KVxuICAgIHJldHVybiBzdGFja3M7XG4gIHZhciBzdGFjayA9IFwiXCI7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gZmFsc2UpIHtcbiAgICB2YXIgZmFpbHVyZSA9IHByb21pc2UuX3ZhbHVlLCBlcnJvck5hbWUsIG1lc3NhZ2U7XG4gICAgaWYgKGZhaWx1cmUgIT0gbnVsbCkge1xuICAgICAgZXJyb3JOYW1lID0gZmFpbHVyZS5uYW1lIHx8IFwiRXJyb3JcIjtcbiAgICAgIG1lc3NhZ2UgPSBmYWlsdXJlLm1lc3NhZ2UgfHwgZmFpbHVyZTtcbiAgICAgIHN0YWNrID0gcHJldHR5U3RhY2soZmFpbHVyZSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yTmFtZSA9IGZhaWx1cmU7XG4gICAgICBtZXNzYWdlID0gXCJcIjtcbiAgICB9XG4gICAgc3RhY2tzLnB1c2goZXJyb3JOYW1lICsgKG1lc3NhZ2UgPyBcIjogXCIgKyBtZXNzYWdlIDogXCJcIikgKyBzdGFjayk7XG4gIH1cbiAgaWYgKGRlYnVnKSB7XG4gICAgc3RhY2sgPSBwcmV0dHlTdGFjayhwcm9taXNlLl9zdGFja0hvbGRlciwgMik7XG4gICAgaWYgKHN0YWNrICYmIHN0YWNrcy5pbmRleE9mKHN0YWNrKSA9PT0gLTEpXG4gICAgICBzdGFja3MucHVzaChzdGFjayk7XG4gICAgaWYgKHByb21pc2UuX3ByZXYpXG4gICAgICBnZXRTdGFjayhwcm9taXNlLl9wcmV2LCBzdGFja3MsIGxpbWl0KTtcbiAgfVxuICByZXR1cm4gc3RhY2tzO1xufVxuZnVuY3Rpb24gbGlua1RvUHJldmlvdXNQcm9taXNlKHByb21pc2UsIHByZXYpIHtcbiAgdmFyIG51bVByZXYgPSBwcmV2ID8gcHJldi5fbnVtUHJldiArIDEgOiAwO1xuICBpZiAobnVtUHJldiA8IExPTkdfU1RBQ0tTX0NMSVBfTElNSVQpIHtcbiAgICBwcm9taXNlLl9wcmV2ID0gcHJldjtcbiAgICBwcm9taXNlLl9udW1QcmV2ID0gbnVtUHJldjtcbiAgfVxufVxuZnVuY3Rpb24gcGh5c2ljYWxUaWNrKCkge1xuICBiZWdpbk1pY3JvVGlja1Njb3BlKCkgJiYgZW5kTWljcm9UaWNrU2NvcGUoKTtcbn1cbmZ1bmN0aW9uIGJlZ2luTWljcm9UaWNrU2NvcGUoKSB7XG4gIHZhciB3YXNSb290RXhlYyA9IGlzT3V0c2lkZU1pY3JvVGljaztcbiAgaXNPdXRzaWRlTWljcm9UaWNrID0gZmFsc2U7XG4gIG5lZWRzTmV3UGh5c2ljYWxUaWNrID0gZmFsc2U7XG4gIHJldHVybiB3YXNSb290RXhlYztcbn1cbmZ1bmN0aW9uIGVuZE1pY3JvVGlja1Njb3BlKCkge1xuICB2YXIgY2FsbGJhY2tzLCBpLCBsO1xuICBkbyB7XG4gICAgd2hpbGUgKG1pY3JvdGlja1F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNhbGxiYWNrcyA9IG1pY3JvdGlja1F1ZXVlO1xuICAgICAgbWljcm90aWNrUXVldWUgPSBbXTtcbiAgICAgIGwgPSBjYWxsYmFja3MubGVuZ3RoO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGw7ICsraSkge1xuICAgICAgICB2YXIgaXRlbSA9IGNhbGxiYWNrc1tpXTtcbiAgICAgICAgaXRlbVswXS5hcHBseShudWxsLCBpdGVtWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gd2hpbGUgKG1pY3JvdGlja1F1ZXVlLmxlbmd0aCA+IDApO1xuICBpc091dHNpZGVNaWNyb1RpY2sgPSB0cnVlO1xuICBuZWVkc05ld1BoeXNpY2FsVGljayA9IHRydWU7XG59XG5mdW5jdGlvbiBmaW5hbGl6ZVBoeXNpY2FsVGljaygpIHtcbiAgdmFyIHVuaGFuZGxlZEVycnMgPSB1bmhhbmRsZWRFcnJvcnM7XG4gIHVuaGFuZGxlZEVycm9ycyA9IFtdO1xuICB1bmhhbmRsZWRFcnJzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgIHAuX1BTRC5vbnVuaGFuZGxlZC5jYWxsKG51bGwsIHAuX3ZhbHVlLCBwKTtcbiAgfSk7XG4gIHZhciBmaW5hbGl6ZXJzID0gdGlja0ZpbmFsaXplcnMuc2xpY2UoMCk7XG4gIHZhciBpID0gZmluYWxpemVycy5sZW5ndGg7XG4gIHdoaWxlIChpKVxuICAgIGZpbmFsaXplcnNbLS1pXSgpO1xufVxuZnVuY3Rpb24gcnVuX2F0X2VuZF9vZl90aGlzX29yX25leHRfcGh5c2ljYWxfdGljayhmbikge1xuICBmdW5jdGlvbiBmaW5hbGl6ZXIoKSB7XG4gICAgZm4oKTtcbiAgICB0aWNrRmluYWxpemVycy5zcGxpY2UodGlja0ZpbmFsaXplcnMuaW5kZXhPZihmaW5hbGl6ZXIpLCAxKTtcbiAgfVxuICB0aWNrRmluYWxpemVycy5wdXNoKGZpbmFsaXplcik7XG4gICsrbnVtU2NoZWR1bGVkQ2FsbHM7XG4gIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKC0tbnVtU2NoZWR1bGVkQ2FsbHMgPT09IDApXG4gICAgICBmaW5hbGl6ZVBoeXNpY2FsVGljaygpO1xuICB9LCBbXSk7XG59XG5mdW5jdGlvbiBhZGRQb3NzaWJseVVuaGFuZGxlZEVycm9yKHByb21pc2UpIHtcbiAgaWYgKCF1bmhhbmRsZWRFcnJvcnMuc29tZShmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIHAuX3ZhbHVlID09PSBwcm9taXNlLl92YWx1ZTtcbiAgfSkpXG4gICAgdW5oYW5kbGVkRXJyb3JzLnB1c2gocHJvbWlzZSk7XG59XG5mdW5jdGlvbiBtYXJrRXJyb3JBc0hhbmRsZWQocHJvbWlzZSkge1xuICB2YXIgaSA9IHVuaGFuZGxlZEVycm9ycy5sZW5ndGg7XG4gIHdoaWxlIChpKVxuICAgIGlmICh1bmhhbmRsZWRFcnJvcnNbLS1pXS5fdmFsdWUgPT09IHByb21pc2UuX3ZhbHVlKSB7XG4gICAgICB1bmhhbmRsZWRFcnJvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbn1cbmZ1bmN0aW9uIFByb21pc2VSZWplY3QocmVhc29uKSB7XG4gIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKElOVEVSTkFMLCBmYWxzZSwgcmVhc29uKTtcbn1cbmZ1bmN0aW9uIHdyYXAoZm4sIGVycm9yQ2F0Y2hlcikge1xuICB2YXIgcHNkID0gUFNEO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdhc1Jvb3RFeGVjID0gYmVnaW5NaWNyb1RpY2tTY29wZSgpLCBvdXRlclNjb3BlID0gUFNEO1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2hUb1pvbmUocHNkLCB0cnVlKTtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9yQ2F0Y2hlciAmJiBlcnJvckNhdGNoZXIoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHN3aXRjaFRvWm9uZShvdXRlclNjb3BlLCBmYWxzZSk7XG4gICAgICBpZiAod2FzUm9vdEV4ZWMpXG4gICAgICAgIGVuZE1pY3JvVGlja1Njb3BlKCk7XG4gICAgfVxuICB9O1xufVxudmFyIHRhc2sgPSB7YXdhaXRzOiAwLCBlY2hvZXM6IDAsIGlkOiAwfTtcbnZhciB0YXNrQ291bnRlciA9IDA7XG52YXIgem9uZVN0YWNrID0gW107XG52YXIgem9uZUVjaG9lcyA9IDA7XG52YXIgdG90YWxFY2hvZXMgPSAwO1xudmFyIHpvbmVfaWRfY291bnRlciA9IDA7XG5mdW5jdGlvbiBuZXdTY29wZShmbiwgcHJvcHMyLCBhMSwgYTIpIHtcbiAgdmFyIHBhcmVudCA9IFBTRCwgcHNkID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQpO1xuICBwc2QucGFyZW50ID0gcGFyZW50O1xuICBwc2QucmVmID0gMDtcbiAgcHNkLmdsb2JhbCA9IGZhbHNlO1xuICBwc2QuaWQgPSArK3pvbmVfaWRfY291bnRlcjtcbiAgdmFyIGdsb2JhbEVudiA9IGdsb2JhbFBTRC5lbnY7XG4gIHBzZC5lbnYgPSBwYXRjaEdsb2JhbFByb21pc2UgPyB7XG4gICAgUHJvbWlzZTogRGV4aWVQcm9taXNlLFxuICAgIFByb21pc2VQcm9wOiB7dmFsdWU6IERleGllUHJvbWlzZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZX0sXG4gICAgYWxsOiBEZXhpZVByb21pc2UuYWxsLFxuICAgIHJhY2U6IERleGllUHJvbWlzZS5yYWNlLFxuICAgIGFsbFNldHRsZWQ6IERleGllUHJvbWlzZS5hbGxTZXR0bGVkLFxuICAgIGFueTogRGV4aWVQcm9taXNlLmFueSxcbiAgICByZXNvbHZlOiBEZXhpZVByb21pc2UucmVzb2x2ZSxcbiAgICByZWplY3Q6IERleGllUHJvbWlzZS5yZWplY3QsXG4gICAgbnRoZW46IGdldFBhdGNoZWRQcm9taXNlVGhlbihnbG9iYWxFbnYubnRoZW4sIHBzZCksXG4gICAgZ3RoZW46IGdldFBhdGNoZWRQcm9taXNlVGhlbihnbG9iYWxFbnYuZ3RoZW4sIHBzZClcbiAgfSA6IHt9O1xuICBpZiAocHJvcHMyKVxuICAgIGV4dGVuZChwc2QsIHByb3BzMik7XG4gICsrcGFyZW50LnJlZjtcbiAgcHNkLmZpbmFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgLS10aGlzLnBhcmVudC5yZWYgfHwgdGhpcy5wYXJlbnQuZmluYWxpemUoKTtcbiAgfTtcbiAgdmFyIHJ2ID0gdXNlUFNEKHBzZCwgZm4sIGExLCBhMik7XG4gIGlmIChwc2QucmVmID09PSAwKVxuICAgIHBzZC5maW5hbGl6ZSgpO1xuICByZXR1cm4gcnY7XG59XG5mdW5jdGlvbiBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpIHtcbiAgaWYgKCF0YXNrLmlkKVxuICAgIHRhc2suaWQgPSArK3Rhc2tDb3VudGVyO1xuICArK3Rhc2suYXdhaXRzO1xuICB0YXNrLmVjaG9lcyArPSBaT05FX0VDSE9fTElNSVQ7XG4gIHJldHVybiB0YXNrLmlkO1xufVxuZnVuY3Rpb24gZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMoKSB7XG4gIGlmICghdGFzay5hd2FpdHMpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoLS10YXNrLmF3YWl0cyA9PT0gMClcbiAgICB0YXNrLmlkID0gMDtcbiAgdGFzay5lY2hvZXMgPSB0YXNrLmF3YWl0cyAqIFpPTkVfRUNIT19MSU1JVDtcbiAgcmV0dXJuIHRydWU7XG59XG5pZiAoKFwiXCIgKyBuYXRpdmVQcm9taXNlVGhlbikuaW5kZXhPZihcIltuYXRpdmUgY29kZV1cIikgPT09IC0xKSB7XG4gIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzID0gZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMgPSBub3A7XG59XG5mdW5jdGlvbiBvblBvc3NpYmxlUGFyYWxsZWxsQXN5bmMocG9zc2libGVQcm9taXNlKSB7XG4gIGlmICh0YXNrLmVjaG9lcyAmJiBwb3NzaWJsZVByb21pc2UgJiYgcG9zc2libGVQcm9taXNlLmNvbnN0cnVjdG9yID09PSBOYXRpdmVQcm9taXNlKSB7XG4gICAgaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICByZXR1cm4gcG9zc2libGVQcm9taXNlLnRoZW4oZnVuY3Rpb24oeCkge1xuICAgICAgZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMoKTtcbiAgICAgIHJldHVybiB4O1xuICAgIH0sIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGRlY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKGUpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBwb3NzaWJsZVByb21pc2U7XG59XG5mdW5jdGlvbiB6b25lRW50ZXJFY2hvKHRhcmdldFpvbmUpIHtcbiAgKyt0b3RhbEVjaG9lcztcbiAgaWYgKCF0YXNrLmVjaG9lcyB8fCAtLXRhc2suZWNob2VzID09PSAwKSB7XG4gICAgdGFzay5lY2hvZXMgPSB0YXNrLmlkID0gMDtcbiAgfVxuICB6b25lU3RhY2sucHVzaChQU0QpO1xuICBzd2l0Y2hUb1pvbmUodGFyZ2V0Wm9uZSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiB6b25lTGVhdmVFY2hvKCkge1xuICB2YXIgem9uZSA9IHpvbmVTdGFja1t6b25lU3RhY2subGVuZ3RoIC0gMV07XG4gIHpvbmVTdGFjay5wb3AoKTtcbiAgc3dpdGNoVG9ab25lKHpvbmUsIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIHN3aXRjaFRvWm9uZSh0YXJnZXRab25lLCBiRW50ZXJpbmdab25lKSB7XG4gIHZhciBjdXJyZW50Wm9uZSA9IFBTRDtcbiAgaWYgKGJFbnRlcmluZ1pvbmUgPyB0YXNrLmVjaG9lcyAmJiAoIXpvbmVFY2hvZXMrKyB8fCB0YXJnZXRab25lICE9PSBQU0QpIDogem9uZUVjaG9lcyAmJiAoIS0tem9uZUVjaG9lcyB8fCB0YXJnZXRab25lICE9PSBQU0QpKSB7XG4gICAgZW5xdWV1ZU5hdGl2ZU1pY3JvVGFzayhiRW50ZXJpbmdab25lID8gem9uZUVudGVyRWNoby5iaW5kKG51bGwsIHRhcmdldFpvbmUpIDogem9uZUxlYXZlRWNobyk7XG4gIH1cbiAgaWYgKHRhcmdldFpvbmUgPT09IFBTRClcbiAgICByZXR1cm47XG4gIFBTRCA9IHRhcmdldFpvbmU7XG4gIGlmIChjdXJyZW50Wm9uZSA9PT0gZ2xvYmFsUFNEKVxuICAgIGdsb2JhbFBTRC5lbnYgPSBzbmFwU2hvdCgpO1xuICBpZiAocGF0Y2hHbG9iYWxQcm9taXNlKSB7XG4gICAgdmFyIEdsb2JhbFByb21pc2VfMSA9IGdsb2JhbFBTRC5lbnYuUHJvbWlzZTtcbiAgICB2YXIgdGFyZ2V0RW52ID0gdGFyZ2V0Wm9uZS5lbnY7XG4gICAgbmF0aXZlUHJvbWlzZVByb3RvLnRoZW4gPSB0YXJnZXRFbnYubnRoZW47XG4gICAgR2xvYmFsUHJvbWlzZV8xLnByb3RvdHlwZS50aGVuID0gdGFyZ2V0RW52Lmd0aGVuO1xuICAgIGlmIChjdXJyZW50Wm9uZS5nbG9iYWwgfHwgdGFyZ2V0Wm9uZS5nbG9iYWwpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfZ2xvYmFsLCBcIlByb21pc2VcIiwgdGFyZ2V0RW52LlByb21pc2VQcm9wKTtcbiAgICAgIEdsb2JhbFByb21pc2VfMS5hbGwgPSB0YXJnZXRFbnYuYWxsO1xuICAgICAgR2xvYmFsUHJvbWlzZV8xLnJhY2UgPSB0YXJnZXRFbnYucmFjZTtcbiAgICAgIEdsb2JhbFByb21pc2VfMS5yZXNvbHZlID0gdGFyZ2V0RW52LnJlc29sdmU7XG4gICAgICBHbG9iYWxQcm9taXNlXzEucmVqZWN0ID0gdGFyZ2V0RW52LnJlamVjdDtcbiAgICAgIGlmICh0YXJnZXRFbnYuYWxsU2V0dGxlZClcbiAgICAgICAgR2xvYmFsUHJvbWlzZV8xLmFsbFNldHRsZWQgPSB0YXJnZXRFbnYuYWxsU2V0dGxlZDtcbiAgICAgIGlmICh0YXJnZXRFbnYuYW55KVxuICAgICAgICBHbG9iYWxQcm9taXNlXzEuYW55ID0gdGFyZ2V0RW52LmFueTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHNuYXBTaG90KCkge1xuICB2YXIgR2xvYmFsUHJvbWlzZSA9IF9nbG9iYWwuUHJvbWlzZTtcbiAgcmV0dXJuIHBhdGNoR2xvYmFsUHJvbWlzZSA/IHtcbiAgICBQcm9taXNlOiBHbG9iYWxQcm9taXNlLFxuICAgIFByb21pc2VQcm9wOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKF9nbG9iYWwsIFwiUHJvbWlzZVwiKSxcbiAgICBhbGw6IEdsb2JhbFByb21pc2UuYWxsLFxuICAgIHJhY2U6IEdsb2JhbFByb21pc2UucmFjZSxcbiAgICBhbGxTZXR0bGVkOiBHbG9iYWxQcm9taXNlLmFsbFNldHRsZWQsXG4gICAgYW55OiBHbG9iYWxQcm9taXNlLmFueSxcbiAgICByZXNvbHZlOiBHbG9iYWxQcm9taXNlLnJlc29sdmUsXG4gICAgcmVqZWN0OiBHbG9iYWxQcm9taXNlLnJlamVjdCxcbiAgICBudGhlbjogbmF0aXZlUHJvbWlzZVByb3RvLnRoZW4sXG4gICAgZ3RoZW46IEdsb2JhbFByb21pc2UucHJvdG90eXBlLnRoZW5cbiAgfSA6IHt9O1xufVxuZnVuY3Rpb24gdXNlUFNEKHBzZCwgZm4sIGExLCBhMiwgYTMpIHtcbiAgdmFyIG91dGVyU2NvcGUgPSBQU0Q7XG4gIHRyeSB7XG4gICAgc3dpdGNoVG9ab25lKHBzZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIGZuKGExLCBhMiwgYTMpO1xuICB9IGZpbmFsbHkge1xuICAgIHN3aXRjaFRvWm9uZShvdXRlclNjb3BlLCBmYWxzZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGVucXVldWVOYXRpdmVNaWNyb1Rhc2soam9iKSB7XG4gIG5hdGl2ZVByb21pc2VUaGVuLmNhbGwocmVzb2x2ZWROYXRpdmVQcm9taXNlLCBqb2IpO1xufVxuZnVuY3Rpb24gbmF0aXZlQXdhaXRDb21wYXRpYmxlV3JhcChmbiwgem9uZSwgcG9zc2libGVBd2FpdCwgY2xlYW51cCkge1xuICByZXR1cm4gdHlwZW9mIGZuICE9PSBcImZ1bmN0aW9uXCIgPyBmbiA6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXRlclpvbmUgPSBQU0Q7XG4gICAgaWYgKHBvc3NpYmxlQXdhaXQpXG4gICAgICBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgIHN3aXRjaFRvWm9uZSh6b25lLCB0cnVlKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHN3aXRjaFRvWm9uZShvdXRlclpvbmUsIGZhbHNlKTtcbiAgICAgIGlmIChjbGVhbnVwKVxuICAgICAgICBlbnF1ZXVlTmF0aXZlTWljcm9UYXNrKGRlY3JlbWVudEV4cGVjdGVkQXdhaXRzKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBnZXRQYXRjaGVkUHJvbWlzZVRoZW4ob3JpZ1RoZW4sIHpvbmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gb3JpZ1RoZW4uY2FsbCh0aGlzLCBuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKG9uUmVzb2x2ZWQsIHpvbmUpLCBuYXRpdmVBd2FpdENvbXBhdGlibGVXcmFwKG9uUmVqZWN0ZWQsIHpvbmUpKTtcbiAgfTtcbn1cbnZhciBVTkhBTkRMRURSRUpFQ1RJT04gPSBcInVuaGFuZGxlZHJlamVjdGlvblwiO1xuZnVuY3Rpb24gZ2xvYmFsRXJyb3IoZXJyLCBwcm9taXNlKSB7XG4gIHZhciBydjtcbiAgdHJ5IHtcbiAgICBydiA9IHByb21pc2Uub251bmNhdGNoZWQoZXJyKTtcbiAgfSBjYXRjaCAoZSkge1xuICB9XG4gIGlmIChydiAhPT0gZmFsc2UpXG4gICAgdHJ5IHtcbiAgICAgIHZhciBldmVudCwgZXZlbnREYXRhID0ge3Byb21pc2UsIHJlYXNvbjogZXJyfTtcbiAgICAgIGlmIChfZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICAgICAgZXZlbnQuaW5pdEV2ZW50KFVOSEFORExFRFJFSkVDVElPTiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIGV4dGVuZChldmVudCwgZXZlbnREYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoX2dsb2JhbC5DdXN0b21FdmVudCkge1xuICAgICAgICBldmVudCA9IG5ldyBDdXN0b21FdmVudChVTkhBTkRMRURSRUpFQ1RJT04sIHtkZXRhaWw6IGV2ZW50RGF0YX0pO1xuICAgICAgICBleHRlbmQoZXZlbnQsIGV2ZW50RGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQgJiYgX2dsb2JhbC5kaXNwYXRjaEV2ZW50KSB7XG4gICAgICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICBpZiAoIV9nbG9iYWwuUHJvbWlzZVJlamVjdGlvbkV2ZW50ICYmIF9nbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIF9nbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24oZXZlbnQpO1xuICAgICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGVidWcgJiYgZXZlbnQgJiYgIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHJlamVjdGlvbjogXCIgKyAoZXJyLnN0YWNrIHx8IGVycikpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG59XG52YXIgcmVqZWN0aW9uID0gRGV4aWVQcm9taXNlLnJlamVjdDtcbmZ1bmN0aW9uIHRlbXBUcmFuc2FjdGlvbihkYiwgbW9kZSwgc3RvcmVOYW1lcywgZm4pIHtcbiAgaWYgKCFkYi5fc3RhdGUub3BlbkNvbXBsZXRlICYmICFQU0QubGV0VGhyb3VnaCkge1xuICAgIGlmICghZGIuX3N0YXRlLmlzQmVpbmdPcGVuZWQpIHtcbiAgICAgIGlmICghZGIuX29wdGlvbnMuYXV0b09wZW4pXG4gICAgICAgIHJldHVybiByZWplY3Rpb24obmV3IGV4Y2VwdGlvbnMuRGF0YWJhc2VDbG9zZWQoKSk7XG4gICAgICBkYi5vcGVuKCkuY2F0Y2gobm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLl9zdGF0ZS5kYlJlYWR5UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRlbXBUcmFuc2FjdGlvbihkYiwgbW9kZSwgc3RvcmVOYW1lcywgZm4pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHZhciB0cmFucyA9IGRiLl9jcmVhdGVUcmFuc2FjdGlvbihtb2RlLCBzdG9yZU5hbWVzLCBkYi5fZGJTY2hlbWEpO1xuICAgIHRyeSB7XG4gICAgICB0cmFucy5jcmVhdGUoKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgcmV0dXJuIHJlamVjdGlvbihleCk7XG4gICAgfVxuICAgIHJldHVybiB0cmFucy5fcHJvbWlzZShtb2RlLCBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBuZXdTY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgUFNELnRyYW5zID0gdHJhbnM7XG4gICAgICAgIHJldHVybiBmbihyZXNvbHZlLCByZWplY3QsIHRyYW5zKTtcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICByZXR1cm4gdHJhbnMuX2NvbXBsZXRpb24udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG52YXIgREVYSUVfVkVSU0lPTiA9IFwiMy4xLjAtYWxwaGEuMTBcIjtcbnZhciBtYXhTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1NTM1KTtcbnZhciBtaW5LZXkgPSAtSW5maW5pdHk7XG52YXIgSU5WQUxJRF9LRVlfQVJHVU1FTlQgPSBcIkludmFsaWQga2V5IHByb3ZpZGVkLiBLZXlzIG11c3QgYmUgb2YgdHlwZSBzdHJpbmcsIG51bWJlciwgRGF0ZSBvciBBcnJheTxzdHJpbmcgfCBudW1iZXIgfCBEYXRlPi5cIjtcbnZhciBTVFJJTkdfRVhQRUNURUQgPSBcIlN0cmluZyBleHBlY3RlZC5cIjtcbnZhciBjb25uZWN0aW9ucyA9IFtdO1xudmFyIGlzSUVPckVkZ2UgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIC8oTVNJRXxUcmlkZW50fEVkZ2UpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xudmFyIGhhc0lFRGVsZXRlT2JqZWN0U3RvcmVCdWcgPSBpc0lFT3JFZGdlO1xudmFyIGhhbmdzT25EZWxldGVMYXJnZUtleVJhbmdlID0gaXNJRU9yRWRnZTtcbnZhciBkZXhpZVN0YWNrRnJhbWVGaWx0ZXIgPSBmdW5jdGlvbihmcmFtZSkge1xuICByZXR1cm4gIS8oZGV4aWVcXC5qc3xkZXhpZVxcLm1pblxcLmpzKS8udGVzdChmcmFtZSk7XG59O1xudmFyIERCTkFNRVNfREIgPSBcIl9fZGJuYW1lc1wiO1xudmFyIFJFQURPTkxZID0gXCJyZWFkb25seVwiO1xudmFyIFJFQURXUklURSA9IFwicmVhZHdyaXRlXCI7XG5mdW5jdGlvbiBjb21iaW5lKGZpbHRlcjEsIGZpbHRlcjIpIHtcbiAgcmV0dXJuIGZpbHRlcjEgPyBmaWx0ZXIyID8gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbHRlcjEuYXBwbHkodGhpcywgYXJndW1lbnRzKSAmJiBmaWx0ZXIyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0gOiBmaWx0ZXIxIDogZmlsdGVyMjtcbn1cbnZhciBkb21EZXBzO1xudHJ5IHtcbiAgZG9tRGVwcyA9IHtcbiAgICBpbmRleGVkREI6IF9nbG9iYWwuaW5kZXhlZERCIHx8IF9nbG9iYWwubW96SW5kZXhlZERCIHx8IF9nbG9iYWwud2Via2l0SW5kZXhlZERCIHx8IF9nbG9iYWwubXNJbmRleGVkREIsXG4gICAgSURCS2V5UmFuZ2U6IF9nbG9iYWwuSURCS2V5UmFuZ2UgfHwgX2dsb2JhbC53ZWJraXRJREJLZXlSYW5nZVxuICB9O1xufSBjYXRjaCAoZSkge1xuICBkb21EZXBzID0ge2luZGV4ZWREQjogbnVsbCwgSURCS2V5UmFuZ2U6IG51bGx9O1xufVxuZnVuY3Rpb24gc2FmYXJpTXVsdGlTdG9yZUZpeChzdG9yZU5hbWVzKSB7XG4gIHJldHVybiBzdG9yZU5hbWVzLmxlbmd0aCA9PT0gMSA/IHN0b3JlTmFtZXNbMF0gOiBzdG9yZU5hbWVzO1xufVxudmFyIGdldE1heEtleSA9IGZ1bmN0aW9uKElkYktleVJhbmdlKSB7XG4gIHRyeSB7XG4gICAgSWRiS2V5UmFuZ2Uub25seShbW11dKTtcbiAgICBnZXRNYXhLZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbW11dO1xuICAgIH07XG4gICAgcmV0dXJuIFtbXV07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBnZXRNYXhLZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBtYXhTdHJpbmc7XG4gICAgfTtcbiAgICByZXR1cm4gbWF4U3RyaW5nO1xuICB9XG59O1xudmFyIEFueVJhbmdlID0ge1xuICB0eXBlOiAzLFxuICBsb3dlcjogLUluZmluaXR5LFxuICBsb3dlck9wZW46IGZhbHNlLFxuICBnZXQgdXBwZXIoKSB7XG4gICAgcmV0dXJuIGdldE1heEtleShkb21EZXBzLklEQktleVJhbmdlKTtcbiAgfSxcbiAgdXBwZXJPcGVuOiBmYWxzZVxufTtcbmZ1bmN0aW9uIHdvcmthcm91bmRGb3JVbmRlZmluZWRQcmltS2V5KGtleVBhdGgpIHtcbiAgcmV0dXJuIHR5cGVvZiBrZXlQYXRoID09PSBcInN0cmluZ1wiICYmICEvXFwuLy50ZXN0KGtleVBhdGgpID8gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9ialtrZXlQYXRoXSA9PT0gdm9pZCAwICYmIGtleVBhdGggaW4gb2JqKSB7XG4gICAgICBvYmogPSBkZWVwQ2xvbmUob2JqKTtcbiAgICAgIGRlbGV0ZSBvYmpba2V5UGF0aF07XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH0gOiBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xufVxudmFyIFRhYmxlID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRhYmxlMigpIHtcbiAgfVxuICBUYWJsZTIucHJvdG90eXBlLl90cmFucyA9IGZ1bmN0aW9uKG1vZGUsIGZuLCB3cml0ZUxvY2tlZCkge1xuICAgIHZhciB0cmFucyA9IHRoaXMuX3R4IHx8IFBTRC50cmFucztcbiAgICB2YXIgdGFibGVOYW1lID0gdGhpcy5uYW1lO1xuICAgIGZ1bmN0aW9uIGNoZWNrVGFibGVJblRyYW5zYWN0aW9uKHJlc29sdmUsIHJlamVjdCwgdHJhbnMyKSB7XG4gICAgICBpZiAoIXRyYW5zMi5zY2hlbWFbdGFibGVOYW1lXSlcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTm90Rm91bmQoXCJUYWJsZSBcIiArIHRhYmxlTmFtZSArIFwiIG5vdCBwYXJ0IG9mIHRyYW5zYWN0aW9uXCIpO1xuICAgICAgcmV0dXJuIGZuKHRyYW5zMi5pZGJ0cmFucywgdHJhbnMyKTtcbiAgICB9XG4gICAgdmFyIHdhc1Jvb3RFeGVjID0gYmVnaW5NaWNyb1RpY2tTY29wZSgpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdHJhbnMgJiYgdHJhbnMuZGIgPT09IHRoaXMuZGIgPyB0cmFucyA9PT0gUFNELnRyYW5zID8gdHJhbnMuX3Byb21pc2UobW9kZSwgY2hlY2tUYWJsZUluVHJhbnNhY3Rpb24sIHdyaXRlTG9ja2VkKSA6IG5ld1Njb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJhbnMuX3Byb21pc2UobW9kZSwgY2hlY2tUYWJsZUluVHJhbnNhY3Rpb24sIHdyaXRlTG9ja2VkKTtcbiAgICAgIH0sIHt0cmFucywgdHJhbnNsZXNzOiBQU0QudHJhbnNsZXNzIHx8IFBTRH0pIDogdGVtcFRyYW5zYWN0aW9uKHRoaXMuZGIsIG1vZGUsIFt0aGlzLm5hbWVdLCBjaGVja1RhYmxlSW5UcmFuc2FjdGlvbik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICh3YXNSb290RXhlYylcbiAgICAgICAgZW5kTWljcm9UaWNrU2NvcGUoKTtcbiAgICB9XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5T3JDcml0LCBjYikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgaWYgKGtleU9yQ3JpdCAmJiBrZXlPckNyaXQuY29uc3RydWN0b3IgPT09IE9iamVjdClcbiAgICAgIHJldHVybiB0aGlzLndoZXJlKGtleU9yQ3JpdCkuZmlyc3QoY2IpO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWRvbmx5XCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5nZXQoe3RyYW5zLCBrZXk6IGtleU9yQ3JpdH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5ob29rLnJlYWRpbmcuZmlyZShyZXMpO1xuICAgICAgfSk7XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUud2hlcmUgPSBmdW5jdGlvbihpbmRleE9yQ3JpdCkge1xuICAgIGlmICh0eXBlb2YgaW5kZXhPckNyaXQgPT09IFwic3RyaW5nXCIpXG4gICAgICByZXR1cm4gbmV3IHRoaXMuZGIuV2hlcmVDbGF1c2UodGhpcywgaW5kZXhPckNyaXQpO1xuICAgIGlmIChpc0FycmF5KGluZGV4T3JDcml0KSlcbiAgICAgIHJldHVybiBuZXcgdGhpcy5kYi5XaGVyZUNsYXVzZSh0aGlzLCBcIltcIiArIGluZGV4T3JDcml0LmpvaW4oXCIrXCIpICsgXCJdXCIpO1xuICAgIHZhciBrZXlQYXRocyA9IGtleXMoaW5kZXhPckNyaXQpO1xuICAgIGlmIChrZXlQYXRocy5sZW5ndGggPT09IDEpXG4gICAgICByZXR1cm4gdGhpcy53aGVyZShrZXlQYXRoc1swXSkuZXF1YWxzKGluZGV4T3JDcml0W2tleVBhdGhzWzBdXSk7XG4gICAgdmFyIGNvbXBvdW5kSW5kZXggPSB0aGlzLnNjaGVtYS5pbmRleGVzLmNvbmNhdCh0aGlzLnNjaGVtYS5wcmltS2V5KS5maWx0ZXIoZnVuY3Rpb24oaXgpIHtcbiAgICAgIHJldHVybiBpeC5jb21wb3VuZCAmJiBrZXlQYXRocy5ldmVyeShmdW5jdGlvbihrZXlQYXRoKSB7XG4gICAgICAgIHJldHVybiBpeC5rZXlQYXRoLmluZGV4T2Yoa2V5UGF0aCkgPj0gMDtcbiAgICAgIH0pICYmIGl4LmtleVBhdGguZXZlcnkoZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgICByZXR1cm4ga2V5UGF0aHMuaW5kZXhPZihrZXlQYXRoKSA+PSAwO1xuICAgICAgfSk7XG4gICAgfSlbMF07XG4gICAgaWYgKGNvbXBvdW5kSW5kZXggJiYgdGhpcy5kYi5fbWF4S2V5ICE9PSBtYXhTdHJpbmcpXG4gICAgICByZXR1cm4gdGhpcy53aGVyZShjb21wb3VuZEluZGV4Lm5hbWUpLmVxdWFscyhjb21wb3VuZEluZGV4LmtleVBhdGgubWFwKGZ1bmN0aW9uKGtwKSB7XG4gICAgICAgIHJldHVybiBpbmRleE9yQ3JpdFtrcF07XG4gICAgICB9KSk7XG4gICAgaWYgKCFjb21wb3VuZEluZGV4ICYmIGRlYnVnKVxuICAgICAgY29uc29sZS53YXJuKFwiVGhlIHF1ZXJ5IFwiICsgSlNPTi5zdHJpbmdpZnkoaW5kZXhPckNyaXQpICsgXCIgb24gXCIgKyB0aGlzLm5hbWUgKyBcIiB3b3VsZCBiZW5lZml0IG9mIGEgXCIgKyAoXCJjb21wb3VuZCBpbmRleCBbXCIgKyBrZXlQYXRocy5qb2luKFwiK1wiKSArIFwiXVwiKSk7XG4gICAgdmFyIGlkeEJ5TmFtZSA9IHRoaXMuc2NoZW1hLmlkeEJ5TmFtZTtcbiAgICB2YXIgaWRiID0gdGhpcy5kYi5fZGVwcy5pbmRleGVkREI7XG4gICAgZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBpZGIuY21wKGEsIGIpID09PSAwO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBfYTIgPSBrZXlQYXRocy5yZWR1Y2UoZnVuY3Rpb24oX2EzLCBrZXlQYXRoKSB7XG4gICAgICB2YXIgcHJldkluZGV4ID0gX2EzWzBdLCBwcmV2RmlsdGVyRm4gPSBfYTNbMV07XG4gICAgICB2YXIgaW5kZXggPSBpZHhCeU5hbWVba2V5UGF0aF07XG4gICAgICB2YXIgdmFsdWUgPSBpbmRleE9yQ3JpdFtrZXlQYXRoXTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHByZXZJbmRleCB8fCBpbmRleCxcbiAgICAgICAgcHJldkluZGV4IHx8ICFpbmRleCA/IGNvbWJpbmUocHJldkZpbHRlckZuLCBpbmRleCAmJiBpbmRleC5tdWx0aSA/IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICB2YXIgcHJvcCA9IGdldEJ5S2V5UGF0aCh4LCBrZXlQYXRoKTtcbiAgICAgICAgICByZXR1cm4gaXNBcnJheShwcm9wKSAmJiBwcm9wLnNvbWUoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGVxdWFscyh2YWx1ZSwgaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gOiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgcmV0dXJuIGVxdWFscyh2YWx1ZSwgZ2V0QnlLZXlQYXRoKHgsIGtleVBhdGgpKTtcbiAgICAgICAgfSkgOiBwcmV2RmlsdGVyRm5cbiAgICAgIF07XG4gICAgfSwgW251bGwsIG51bGxdKSwgaWR4ID0gX2EyWzBdLCBmaWx0ZXJGdW5jdGlvbiA9IF9hMlsxXTtcbiAgICByZXR1cm4gaWR4ID8gdGhpcy53aGVyZShpZHgubmFtZSkuZXF1YWxzKGluZGV4T3JDcml0W2lkeC5rZXlQYXRoXSkuZmlsdGVyKGZpbHRlckZ1bmN0aW9uKSA6IGNvbXBvdW5kSW5kZXggPyB0aGlzLmZpbHRlcihmaWx0ZXJGdW5jdGlvbikgOiB0aGlzLndoZXJlKGtleVBhdGhzKS5lcXVhbHMoXCJcIik7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZmlsdGVyRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS5hbmQoZmlsdGVyRnVuY3Rpb24pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24odGhlblNob3J0Y3V0KSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkuY291bnQodGhlblNob3J0Y3V0KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS5vZmZzZXQob2Zmc2V0KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5saW1pdCA9IGZ1bmN0aW9uKG51bVJvd3MpIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS5saW1pdChudW1Sb3dzKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy50b0NvbGxlY3Rpb24oKS5lYWNoKGNhbGxiYWNrKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24odGhlblNob3J0Y3V0KSB7XG4gICAgcmV0dXJuIHRoaXMudG9Db2xsZWN0aW9uKCkudG9BcnJheSh0aGVuU2hvcnRjdXQpO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLnRvQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5kYi5Db2xsZWN0aW9uKG5ldyB0aGlzLmRiLldoZXJlQ2xhdXNlKHRoaXMpKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5vcmRlckJ5ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuZGIuQ29sbGVjdGlvbihuZXcgdGhpcy5kYi5XaGVyZUNsYXVzZSh0aGlzLCBpc0FycmF5KGluZGV4KSA/IFwiW1wiICsgaW5kZXguam9pbihcIitcIikgKyBcIl1cIiA6IGluZGV4KSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRvQ29sbGVjdGlvbigpLnJldmVyc2UoKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5tYXBUb0NsYXNzID0gZnVuY3Rpb24oY29uc3RydWN0b3IpIHtcbiAgICB0aGlzLnNjaGVtYS5tYXBwZWRDbGFzcyA9IGNvbnN0cnVjdG9yO1xuICAgIHZhciByZWFkSG9vayA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgaWYgKCFvYmopXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB2YXIgcmVzID0gT2JqZWN0LmNyZWF0ZShjb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICAgICAgZm9yICh2YXIgbSBpbiBvYmopXG4gICAgICAgIGlmIChoYXNPd24ob2JqLCBtKSlcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzW21dID0gb2JqW21dO1xuICAgICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gICAgaWYgKHRoaXMuc2NoZW1hLnJlYWRIb29rKSB7XG4gICAgICB0aGlzLmhvb2sucmVhZGluZy51bnN1YnNjcmliZSh0aGlzLnNjaGVtYS5yZWFkSG9vayk7XG4gICAgfVxuICAgIHRoaXMuc2NoZW1hLnJlYWRIb29rID0gcmVhZEhvb2s7XG4gICAgdGhpcy5ob29rKFwicmVhZGluZ1wiLCByZWFkSG9vayk7XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmRlZmluZUNsYXNzID0gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQ2xhc3MoY29udGVudCkge1xuICAgICAgZXh0ZW5kKHRoaXMsIGNvbnRlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYXBUb0NsYXNzKENsYXNzKTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIF9hMiA9IHRoaXMuc2NoZW1hLnByaW1LZXksIGF1dG8gPSBfYTIuYXV0bywga2V5UGF0aCA9IF9hMi5rZXlQYXRoO1xuICAgIHZhciBvYmpUb0FkZCA9IG9iajtcbiAgICBpZiAoa2V5UGF0aCAmJiBhdXRvKSB7XG4gICAgICBvYmpUb0FkZCA9IHdvcmthcm91bmRGb3JVbmRlZmluZWRQcmltS2V5KGtleVBhdGgpKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJhZGRcIiwga2V5czoga2V5ICE9IG51bGwgPyBba2V5XSA6IG51bGwsIHZhbHVlczogW29ialRvQWRkXX0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICByZXR1cm4gcmVzLm51bUZhaWx1cmVzID8gRGV4aWVQcm9taXNlLnJlamVjdChyZXMuZmFpbHVyZXNbMF0pIDogcmVzLmxhc3RSZXN1bHQ7XG4gICAgfSkudGhlbihmdW5jdGlvbihsYXN0UmVzdWx0KSB7XG4gICAgICBpZiAoa2V5UGF0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNldEJ5S2V5UGF0aChvYmosIGtleVBhdGgsIGxhc3RSZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGtleU9yT2JqZWN0LCBtb2RpZmljYXRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBrZXlPck9iamVjdCA9PT0gXCJvYmplY3RcIiAmJiAhaXNBcnJheShrZXlPck9iamVjdCkpIHtcbiAgICAgIHZhciBrZXkgPSBnZXRCeUtleVBhdGgoa2V5T3JPYmplY3QsIHRoaXMuc2NoZW1hLnByaW1LZXkua2V5UGF0aCk7XG4gICAgICBpZiAoa2V5ID09PSB2b2lkIDApXG4gICAgICAgIHJldHVybiByZWplY3Rpb24obmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiR2l2ZW4gb2JqZWN0IGRvZXMgbm90IGNvbnRhaW4gaXRzIHByaW1hcnkga2V5XCIpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kaWZpY2F0aW9ucyAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAga2V5cyhtb2RpZmljYXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleVBhdGgpIHtcbiAgICAgICAgICAgIHNldEJ5S2V5UGF0aChrZXlPck9iamVjdCwga2V5UGF0aCwgbW9kaWZpY2F0aW9uc1trZXlQYXRoXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9kaWZpY2F0aW9ucyhrZXlPck9iamVjdCwge3ZhbHVlOiBrZXlPck9iamVjdCwgcHJpbUtleToga2V5fSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9hMikge1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMud2hlcmUoXCI6aWRcIikuZXF1YWxzKGtleSkubW9kaWZ5KG1vZGlmaWNhdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy53aGVyZShcIjppZFwiKS5lcXVhbHMoa2V5T3JPYmplY3QpLm1vZGlmeShtb2RpZmljYXRpb25zKTtcbiAgICB9XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBfYTIgPSB0aGlzLnNjaGVtYS5wcmltS2V5LCBhdXRvID0gX2EyLmF1dG8sIGtleVBhdGggPSBfYTIua2V5UGF0aDtcbiAgICB2YXIgb2JqVG9BZGQgPSBvYmo7XG4gICAgaWYgKGtleVBhdGggJiYgYXV0bykge1xuICAgICAgb2JqVG9BZGQgPSB3b3JrYXJvdW5kRm9yVW5kZWZpbmVkUHJpbUtleShrZXlQYXRoKShvYmopO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwicHV0XCIsIHZhbHVlczogW29ialRvQWRkXSwga2V5czoga2V5ICE9IG51bGwgPyBba2V5XSA6IG51bGx9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5udW1GYWlsdXJlcyA/IERleGllUHJvbWlzZS5yZWplY3QocmVzLmZhaWx1cmVzWzBdKSA6IHJlcy5sYXN0UmVzdWx0O1xuICAgIH0pLnRoZW4oZnVuY3Rpb24obGFzdFJlc3VsdCkge1xuICAgICAgaWYgKGtleVBhdGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoLCBsYXN0UmVzdWx0KTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgcmV0dXJuIF90aGlzLmNvcmUubXV0YXRlKHt0cmFucywgdHlwZTogXCJkZWxldGVcIiwga2V5czogW2tleV19KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5udW1GYWlsdXJlcyA/IERleGllUHJvbWlzZS5yZWplY3QocmVzLmZhaWx1cmVzWzBdKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZHdyaXRlXCIsIGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcImRlbGV0ZVJhbmdlXCIsIHJhbmdlOiBBbnlSYW5nZX0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICByZXR1cm4gcmVzLm51bUZhaWx1cmVzID8gRGV4aWVQcm9taXNlLnJlamVjdChyZXMuZmFpbHVyZXNbMF0pIDogdm9pZCAwO1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmJ1bGtHZXQgPSBmdW5jdGlvbihrZXlzMikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zKFwicmVhZG9ubHlcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLmdldE1hbnkoe1xuICAgICAgICBrZXlzOiBrZXlzMixcbiAgICAgICAgdHJhbnNcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQubWFwKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5ob29rLnJlYWRpbmcuZmlyZShyZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBUYWJsZTIucHJvdG90eXBlLmJ1bGtBZGQgPSBmdW5jdGlvbihvYmplY3RzLCBrZXlzT3JPcHRpb25zLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIga2V5czIgPSBBcnJheS5pc0FycmF5KGtleXNPck9wdGlvbnMpID8ga2V5c09yT3B0aW9ucyA6IHZvaWQgMDtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCAoa2V5czIgPyB2b2lkIDAgOiBrZXlzT3JPcHRpb25zKTtcbiAgICB2YXIgd2FudFJlc3VsdHMgPSBvcHRpb25zID8gb3B0aW9ucy5hbGxLZXlzIDogdm9pZCAwO1xuICAgIHJldHVybiB0aGlzLl90cmFucyhcInJlYWR3cml0ZVwiLCBmdW5jdGlvbih0cmFucykge1xuICAgICAgdmFyIF9hMiA9IF90aGlzLnNjaGVtYS5wcmltS2V5LCBhdXRvID0gX2EyLmF1dG8sIGtleVBhdGggPSBfYTIua2V5UGF0aDtcbiAgICAgIGlmIChrZXlQYXRoICYmIGtleXMyKVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJidWxrQWRkKCk6IGtleXMgYXJndW1lbnQgaW52YWxpZCBvbiB0YWJsZXMgd2l0aCBpbmJvdW5kIGtleXNcIik7XG4gICAgICBpZiAoa2V5czIgJiYga2V5czIubGVuZ3RoICE9PSBvYmplY3RzLmxlbmd0aClcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiQXJndW1lbnRzIG9iamVjdHMgYW5kIGtleXMgbXVzdCBoYXZlIHRoZSBzYW1lIGxlbmd0aFwiKTtcbiAgICAgIHZhciBudW1PYmplY3RzID0gb2JqZWN0cy5sZW5ndGg7XG4gICAgICB2YXIgb2JqZWN0c1RvQWRkID0ga2V5UGF0aCAmJiBhdXRvID8gb2JqZWN0cy5tYXAod29ya2Fyb3VuZEZvclVuZGVmaW5lZFByaW1LZXkoa2V5UGF0aCkpIDogb2JqZWN0cztcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiYWRkXCIsIGtleXM6IGtleXMyLCB2YWx1ZXM6IG9iamVjdHNUb0FkZCwgd2FudFJlc3VsdHN9KS50aGVuKGZ1bmN0aW9uKF9hMykge1xuICAgICAgICB2YXIgbnVtRmFpbHVyZXMgPSBfYTMubnVtRmFpbHVyZXMsIHJlc3VsdHMgPSBfYTMucmVzdWx0cywgbGFzdFJlc3VsdCA9IF9hMy5sYXN0UmVzdWx0LCBmYWlsdXJlcyA9IF9hMy5mYWlsdXJlcztcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdhbnRSZXN1bHRzID8gcmVzdWx0cyA6IGxhc3RSZXN1bHQ7XG4gICAgICAgIGlmIChudW1GYWlsdXJlcyA9PT0gMClcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB0aHJvdyBuZXcgQnVsa0Vycm9yKF90aGlzLm5hbWUgKyBcIi5idWxrQWRkKCk6IFwiICsgbnVtRmFpbHVyZXMgKyBcIiBvZiBcIiArIG51bU9iamVjdHMgKyBcIiBvcGVyYXRpb25zIGZhaWxlZFwiLCBmYWlsdXJlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgVGFibGUyLnByb3RvdHlwZS5idWxrUHV0ID0gZnVuY3Rpb24ob2JqZWN0cywga2V5c09yT3B0aW9ucywgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGtleXMyID0gQXJyYXkuaXNBcnJheShrZXlzT3JPcHRpb25zKSA/IGtleXNPck9wdGlvbnMgOiB2b2lkIDA7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgKGtleXMyID8gdm9pZCAwIDoga2V5c09yT3B0aW9ucyk7XG4gICAgdmFyIHdhbnRSZXN1bHRzID0gb3B0aW9ucyA/IG9wdGlvbnMuYWxsS2V5cyA6IHZvaWQgMDtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHZhciBfYTIgPSBfdGhpcy5zY2hlbWEucHJpbUtleSwgYXV0byA9IF9hMi5hdXRvLCBrZXlQYXRoID0gX2EyLmtleVBhdGg7XG4gICAgICBpZiAoa2V5UGF0aCAmJiBrZXlzMilcbiAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiYnVsa1B1dCgpOiBrZXlzIGFyZ3VtZW50IGludmFsaWQgb24gdGFibGVzIHdpdGggaW5ib3VuZCBrZXlzXCIpO1xuICAgICAgaWYgKGtleXMyICYmIGtleXMyLmxlbmd0aCAhPT0gb2JqZWN0cy5sZW5ndGgpXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIkFyZ3VtZW50cyBvYmplY3RzIGFuZCBrZXlzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGhcIik7XG4gICAgICB2YXIgbnVtT2JqZWN0cyA9IG9iamVjdHMubGVuZ3RoO1xuICAgICAgdmFyIG9iamVjdHNUb1B1dCA9IGtleVBhdGggJiYgYXV0byA/IG9iamVjdHMubWFwKHdvcmthcm91bmRGb3JVbmRlZmluZWRQcmltS2V5KGtleVBhdGgpKSA6IG9iamVjdHM7XG4gICAgICByZXR1cm4gX3RoaXMuY29yZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcInB1dFwiLCBrZXlzOiBrZXlzMiwgdmFsdWVzOiBvYmplY3RzVG9QdXQsIHdhbnRSZXN1bHRzfSkudGhlbihmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgdmFyIG51bUZhaWx1cmVzID0gX2EzLm51bUZhaWx1cmVzLCByZXN1bHRzID0gX2EzLnJlc3VsdHMsIGxhc3RSZXN1bHQgPSBfYTMubGFzdFJlc3VsdCwgZmFpbHVyZXMgPSBfYTMuZmFpbHVyZXM7XG4gICAgICAgIHZhciByZXN1bHQgPSB3YW50UmVzdWx0cyA/IHJlc3VsdHMgOiBsYXN0UmVzdWx0O1xuICAgICAgICBpZiAobnVtRmFpbHVyZXMgPT09IDApXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgdGhyb3cgbmV3IEJ1bGtFcnJvcihfdGhpcy5uYW1lICsgXCIuYnVsa1B1dCgpOiBcIiArIG51bUZhaWx1cmVzICsgXCIgb2YgXCIgKyBudW1PYmplY3RzICsgXCIgb3BlcmF0aW9ucyBmYWlsZWRcIiwgZmFpbHVyZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIFRhYmxlMi5wcm90b3R5cGUuYnVsa0RlbGV0ZSA9IGZ1bmN0aW9uKGtleXMyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgbnVtS2V5cyA9IGtleXMyLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHJldHVybiBfdGhpcy5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiZGVsZXRlXCIsIGtleXM6IGtleXMyfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihfYTIpIHtcbiAgICAgIHZhciBudW1GYWlsdXJlcyA9IF9hMi5udW1GYWlsdXJlcywgbGFzdFJlc3VsdCA9IF9hMi5sYXN0UmVzdWx0LCBmYWlsdXJlcyA9IF9hMi5mYWlsdXJlcztcbiAgICAgIGlmIChudW1GYWlsdXJlcyA9PT0gMClcbiAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gICAgICB0aHJvdyBuZXcgQnVsa0Vycm9yKF90aGlzLm5hbWUgKyBcIi5idWxrRGVsZXRlKCk6IFwiICsgbnVtRmFpbHVyZXMgKyBcIiBvZiBcIiArIG51bUtleXMgKyBcIiBvcGVyYXRpb25zIGZhaWxlZFwiLCBmYWlsdXJlcyk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBUYWJsZTI7XG59KCk7XG5mdW5jdGlvbiBFdmVudHMoY3R4KSB7XG4gIHZhciBldnMgPSB7fTtcbiAgdmFyIHJ2ID0gZnVuY3Rpb24oZXZlbnROYW1lLCBzdWJzY3JpYmVyKSB7XG4gICAgaWYgKHN1YnNjcmliZXIpIHtcbiAgICAgIHZhciBpMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoaTIgLSAxKTtcbiAgICAgIHdoaWxlICgtLWkyKVxuICAgICAgICBhcmdzW2kyIC0gMV0gPSBhcmd1bWVudHNbaTJdO1xuICAgICAgZXZzW2V2ZW50TmFtZV0uc3Vic2NyaWJlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgcmV0dXJuIGN0eDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBldmVudE5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBldnNbZXZlbnROYW1lXTtcbiAgICB9XG4gIH07XG4gIHJ2LmFkZEV2ZW50VHlwZSA9IGFkZDtcbiAgZm9yICh2YXIgaSA9IDEsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYWRkKGFyZ3VtZW50c1tpXSk7XG4gIH1cbiAgcmV0dXJuIHJ2O1xuICBmdW5jdGlvbiBhZGQoZXZlbnROYW1lLCBjaGFpbkZ1bmN0aW9uLCBkZWZhdWx0RnVuY3Rpb24pIHtcbiAgICBpZiAodHlwZW9mIGV2ZW50TmFtZSA9PT0gXCJvYmplY3RcIilcbiAgICAgIHJldHVybiBhZGRDb25maWd1cmVkRXZlbnRzKGV2ZW50TmFtZSk7XG4gICAgaWYgKCFjaGFpbkZ1bmN0aW9uKVxuICAgICAgY2hhaW5GdW5jdGlvbiA9IHJldmVyc2VTdG9wcGFibGVFdmVudENoYWluO1xuICAgIGlmICghZGVmYXVsdEZ1bmN0aW9uKVxuICAgICAgZGVmYXVsdEZ1bmN0aW9uID0gbm9wO1xuICAgIHZhciBjb250ZXh0ID0ge1xuICAgICAgc3Vic2NyaWJlcnM6IFtdLFxuICAgICAgZmlyZTogZGVmYXVsdEZ1bmN0aW9uLFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbihjYikge1xuICAgICAgICBpZiAoY29udGV4dC5zdWJzY3JpYmVycy5pbmRleE9mKGNiKSA9PT0gLTEpIHtcbiAgICAgICAgICBjb250ZXh0LnN1YnNjcmliZXJzLnB1c2goY2IpO1xuICAgICAgICAgIGNvbnRleHQuZmlyZSA9IGNoYWluRnVuY3Rpb24oY29udGV4dC5maXJlLCBjYik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgY29udGV4dC5zdWJzY3JpYmVycyA9IGNvbnRleHQuc3Vic2NyaWJlcnMuZmlsdGVyKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgcmV0dXJuIGZuICE9PSBjYjtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRleHQuZmlyZSA9IGNvbnRleHQuc3Vic2NyaWJlcnMucmVkdWNlKGNoYWluRnVuY3Rpb24sIGRlZmF1bHRGdW5jdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICBldnNbZXZlbnROYW1lXSA9IHJ2W2V2ZW50TmFtZV0gPSBjb250ZXh0O1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG4gIGZ1bmN0aW9uIGFkZENvbmZpZ3VyZWRFdmVudHMoY2ZnKSB7XG4gICAga2V5cyhjZmcpLmZvckVhY2goZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICB2YXIgYXJncyA9IGNmZ1tldmVudE5hbWVdO1xuICAgICAgaWYgKGlzQXJyYXkoYXJncykpIHtcbiAgICAgICAgYWRkKGV2ZW50TmFtZSwgY2ZnW2V2ZW50TmFtZV1bMF0sIGNmZ1tldmVudE5hbWVdWzFdKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJncyA9PT0gXCJhc2FwXCIpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBhZGQoZXZlbnROYW1lLCBtaXJyb3IsIGZ1bmN0aW9uIGZpcmUoKSB7XG4gICAgICAgICAgdmFyIGkyID0gYXJndW1lbnRzLmxlbmd0aCwgYXJnczIgPSBuZXcgQXJyYXkoaTIpO1xuICAgICAgICAgIHdoaWxlIChpMi0tKVxuICAgICAgICAgICAgYXJnczJbaTJdID0gYXJndW1lbnRzW2kyXTtcbiAgICAgICAgICBjb250ZXh0LnN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIGFzYXAkMShmdW5jdGlvbiBmaXJlRXZlbnQoKSB7XG4gICAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZVxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkQXJndW1lbnQoXCJJbnZhbGlkIGV2ZW50IGNvbmZpZ1wiKTtcbiAgICB9KTtcbiAgfVxufVxuZnVuY3Rpb24gbWFrZUNsYXNzQ29uc3RydWN0b3IocHJvdG90eXBlLCBjb25zdHJ1Y3Rvcikge1xuICBkZXJpdmUoY29uc3RydWN0b3IpLmZyb20oe3Byb3RvdHlwZX0pO1xuICByZXR1cm4gY29uc3RydWN0b3I7XG59XG5mdW5jdGlvbiBjcmVhdGVUYWJsZUNvbnN0cnVjdG9yKGRiKSB7XG4gIHJldHVybiBtYWtlQ2xhc3NDb25zdHJ1Y3RvcihUYWJsZS5wcm90b3R5cGUsIGZ1bmN0aW9uIFRhYmxlMihuYW1lLCB0YWJsZVNjaGVtYSwgdHJhbnMpIHtcbiAgICB0aGlzLmRiID0gZGI7XG4gICAgdGhpcy5fdHggPSB0cmFucztcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc2NoZW1hID0gdGFibGVTY2hlbWE7XG4gICAgdGhpcy5ob29rID0gZGIuX2FsbFRhYmxlc1tuYW1lXSA/IGRiLl9hbGxUYWJsZXNbbmFtZV0uaG9vayA6IEV2ZW50cyhudWxsLCB7XG4gICAgICBjcmVhdGluZzogW2hvb2tDcmVhdGluZ0NoYWluLCBub3BdLFxuICAgICAgcmVhZGluZzogW3B1cmVGdW5jdGlvbkNoYWluLCBtaXJyb3JdLFxuICAgICAgdXBkYXRpbmc6IFtob29rVXBkYXRpbmdDaGFpbiwgbm9wXSxcbiAgICAgIGRlbGV0aW5nOiBbaG9va0RlbGV0aW5nQ2hhaW4sIG5vcF1cbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBpc1BsYWluS2V5UmFuZ2UoY3R4LCBpZ25vcmVMaW1pdEZpbHRlcikge1xuICByZXR1cm4gIShjdHguZmlsdGVyIHx8IGN0eC5hbGdvcml0aG0gfHwgY3R4Lm9yKSAmJiAoaWdub3JlTGltaXRGaWx0ZXIgPyBjdHguanVzdExpbWl0IDogIWN0eC5yZXBsYXlGaWx0ZXIpO1xufVxuZnVuY3Rpb24gYWRkRmlsdGVyKGN0eCwgZm4pIHtcbiAgY3R4LmZpbHRlciA9IGNvbWJpbmUoY3R4LmZpbHRlciwgZm4pO1xufVxuZnVuY3Rpb24gYWRkUmVwbGF5RmlsdGVyKGN0eCwgZmFjdG9yeSwgaXNMaW1pdEZpbHRlcikge1xuICB2YXIgY3VyciA9IGN0eC5yZXBsYXlGaWx0ZXI7XG4gIGN0eC5yZXBsYXlGaWx0ZXIgPSBjdXJyID8gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvbWJpbmUoY3VycigpLCBmYWN0b3J5KCkpO1xuICB9IDogZmFjdG9yeTtcbiAgY3R4Lmp1c3RMaW1pdCA9IGlzTGltaXRGaWx0ZXIgJiYgIWN1cnI7XG59XG5mdW5jdGlvbiBhZGRNYXRjaEZpbHRlcihjdHgsIGZuKSB7XG4gIGN0eC5pc01hdGNoID0gY29tYmluZShjdHguaXNNYXRjaCwgZm4pO1xufVxuZnVuY3Rpb24gZ2V0SW5kZXhPclN0b3JlKGN0eCwgY29yZVNjaGVtYSkge1xuICBpZiAoY3R4LmlzUHJpbUtleSlcbiAgICByZXR1cm4gY29yZVNjaGVtYS5wcmltYXJ5S2V5O1xuICB2YXIgaW5kZXggPSBjb3JlU2NoZW1hLmdldEluZGV4QnlLZXlQYXRoKGN0eC5pbmRleCk7XG4gIGlmICghaW5kZXgpXG4gICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU2NoZW1hKFwiS2V5UGF0aCBcIiArIGN0eC5pbmRleCArIFwiIG9uIG9iamVjdCBzdG9yZSBcIiArIGNvcmVTY2hlbWEubmFtZSArIFwiIGlzIG5vdCBpbmRleGVkXCIpO1xuICByZXR1cm4gaW5kZXg7XG59XG5mdW5jdGlvbiBvcGVuQ3Vyc29yKGN0eCwgY29yZVRhYmxlLCB0cmFucykge1xuICB2YXIgaW5kZXggPSBnZXRJbmRleE9yU3RvcmUoY3R4LCBjb3JlVGFibGUuc2NoZW1hKTtcbiAgcmV0dXJuIGNvcmVUYWJsZS5vcGVuQ3Vyc29yKHtcbiAgICB0cmFucyxcbiAgICB2YWx1ZXM6ICFjdHgua2V5c09ubHksXG4gICAgcmV2ZXJzZTogY3R4LmRpciA9PT0gXCJwcmV2XCIsXG4gICAgdW5pcXVlOiAhIWN0eC51bmlxdWUsXG4gICAgcXVlcnk6IHtcbiAgICAgIGluZGV4LFxuICAgICAgcmFuZ2U6IGN0eC5yYW5nZVxuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBpdGVyKGN0eCwgZm4sIGNvcmVUcmFucywgY29yZVRhYmxlKSB7XG4gIHZhciBmaWx0ZXIgPSBjdHgucmVwbGF5RmlsdGVyID8gY29tYmluZShjdHguZmlsdGVyLCBjdHgucmVwbGF5RmlsdGVyKCkpIDogY3R4LmZpbHRlcjtcbiAgaWYgKCFjdHgub3IpIHtcbiAgICByZXR1cm4gaXRlcmF0ZShvcGVuQ3Vyc29yKGN0eCwgY29yZVRhYmxlLCBjb3JlVHJhbnMpLCBjb21iaW5lKGN0eC5hbGdvcml0aG0sIGZpbHRlciksIGZuLCAhY3R4LmtleXNPbmx5ICYmIGN0eC52YWx1ZU1hcHBlcik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNldF8xID0ge307XG4gICAgdmFyIHVuaW9uID0gZnVuY3Rpb24oaXRlbSwgY3Vyc29yLCBhZHZhbmNlKSB7XG4gICAgICBpZiAoIWZpbHRlciB8fCBmaWx0ZXIoY3Vyc29yLCBhZHZhbmNlLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIGN1cnNvci5zdG9wKHJlc3VsdCk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgcmV0dXJuIGN1cnNvci5mYWlsKGVycik7XG4gICAgICB9KSkge1xuICAgICAgICB2YXIgcHJpbWFyeUtleSA9IGN1cnNvci5wcmltYXJ5S2V5O1xuICAgICAgICB2YXIga2V5ID0gXCJcIiArIHByaW1hcnlLZXk7XG4gICAgICAgIGlmIChrZXkgPT09IFwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIilcbiAgICAgICAgICBrZXkgPSBcIlwiICsgbmV3IFVpbnQ4QXJyYXkocHJpbWFyeUtleSk7XG4gICAgICAgIGlmICghaGFzT3duKHNldF8xLCBrZXkpKSB7XG4gICAgICAgICAgc2V0XzFba2V5XSA9IHRydWU7XG4gICAgICAgICAgZm4oaXRlbSwgY3Vyc29yLCBhZHZhbmNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgIGN0eC5vci5faXRlcmF0ZSh1bmlvbiwgY29yZVRyYW5zKSxcbiAgICAgIGl0ZXJhdGUob3BlbkN1cnNvcihjdHgsIGNvcmVUYWJsZSwgY29yZVRyYW5zKSwgY3R4LmFsZ29yaXRobSwgdW5pb24sICFjdHgua2V5c09ubHkgJiYgY3R4LnZhbHVlTWFwcGVyKVxuICAgIF0pO1xuICB9XG59XG5mdW5jdGlvbiBpdGVyYXRlKGN1cnNvclByb21pc2UsIGZpbHRlciwgZm4sIHZhbHVlTWFwcGVyKSB7XG4gIHZhciBtYXBwZWRGbiA9IHZhbHVlTWFwcGVyID8gZnVuY3Rpb24oeCwgYywgYSkge1xuICAgIHJldHVybiBmbih2YWx1ZU1hcHBlcih4KSwgYywgYSk7XG4gIH0gOiBmbjtcbiAgdmFyIHdyYXBwZWRGbiA9IHdyYXAobWFwcGVkRm4pO1xuICByZXR1cm4gY3Vyc29yUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGN1cnNvcikge1xuICAgIGlmIChjdXJzb3IpIHtcbiAgICAgIHJldHVybiBjdXJzb3Iuc3RhcnQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIWZpbHRlciB8fCBmaWx0ZXIoY3Vyc29yLCBmdW5jdGlvbihhZHZhbmNlcikge1xuICAgICAgICAgIHJldHVybiBjID0gYWR2YW5jZXI7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIGN1cnNvci5zdG9wKHZhbCk7XG4gICAgICAgICAgYyA9IG5vcDtcbiAgICAgICAgfSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGN1cnNvci5mYWlsKGUpO1xuICAgICAgICAgIGMgPSBub3A7XG4gICAgICAgIH0pKVxuICAgICAgICAgIHdyYXBwZWRGbihjdXJzb3IudmFsdWUsIGN1cnNvciwgZnVuY3Rpb24oYWR2YW5jZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjID0gYWR2YW5jZXI7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG52YXIgQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDb2xsZWN0aW9uMigpIHtcbiAgfVxuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihmbiwgY2IpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIHJldHVybiBjdHguZXJyb3IgPyBjdHgudGFibGUuX3RyYW5zKG51bGwsIHJlamVjdGlvbi5iaW5kKG51bGwsIGN0eC5lcnJvcikpIDogY3R4LnRhYmxlLl90cmFucyhcInJlYWRvbmx5XCIsIGZuKS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICByZXR1cm4gY3R4LmVycm9yID8gY3R4LnRhYmxlLl90cmFucyhudWxsLCByZWplY3Rpb24uYmluZChudWxsLCBjdHguZXJyb3IpKSA6IGN0eC50YWJsZS5fdHJhbnMoXCJyZWFkd3JpdGVcIiwgZm4sIFwibG9ja2VkXCIpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuX2FkZEFsZ29yaXRobSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICBjdHguYWxnb3JpdGhtID0gY29tYmluZShjdHguYWxnb3JpdGhtLCBmbik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCBjb3JlVHJhbnMpIHtcbiAgICByZXR1cm4gaXRlcih0aGlzLl9jdHgsIGZuLCBjb3JlVHJhbnMsIHRoaXMuX2N0eC50YWJsZS5jb3JlKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24ocHJvcHMyKSB7XG4gICAgdmFyIHJ2ID0gT2JqZWN0LmNyZWF0ZSh0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSksIGN0eCA9IE9iamVjdC5jcmVhdGUodGhpcy5fY3R4KTtcbiAgICBpZiAocHJvcHMyKVxuICAgICAgZXh0ZW5kKGN0eCwgcHJvcHMyKTtcbiAgICBydi5fY3R4ID0gY3R4O1xuICAgIHJldHVybiBydjtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLnJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2N0eC52YWx1ZU1hcHBlciA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIHJldHVybiB0aGlzLl9yZWFkKGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICByZXR1cm4gaXRlcihjdHgsIGZuLCB0cmFucywgY3R4LnRhYmxlLmNvcmUpO1xuICAgIH0pO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWQoZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHZhciBjdHggPSBfdGhpcy5fY3R4O1xuICAgICAgdmFyIGNvcmVUYWJsZSA9IGN0eC50YWJsZS5jb3JlO1xuICAgICAgaWYgKGlzUGxhaW5LZXlSYW5nZShjdHgsIHRydWUpKSB7XG4gICAgICAgIHJldHVybiBjb3JlVGFibGUuY291bnQoe1xuICAgICAgICAgIHRyYW5zLFxuICAgICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgICBpbmRleDogZ2V0SW5kZXhPclN0b3JlKGN0eCwgY29yZVRhYmxlLnNjaGVtYSksXG4gICAgICAgICAgICByYW5nZTogY3R4LnJhbmdlXG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGNvdW50Mikge1xuICAgICAgICAgIHJldHVybiBNYXRoLm1pbihjb3VudDIsIGN0eC5saW1pdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIGl0ZXIoY3R4LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSwgdHJhbnMsIGNvcmVUYWJsZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24oa2V5UGF0aCwgY2IpIHtcbiAgICB2YXIgcGFydHMgPSBrZXlQYXRoLnNwbGl0KFwiLlwiKS5yZXZlcnNlKCksIGxhc3RQYXJ0ID0gcGFydHNbMF0sIGxhc3RJbmRleCA9IHBhcnRzLmxlbmd0aCAtIDE7XG4gICAgZnVuY3Rpb24gZ2V0dmFsKG9iaiwgaSkge1xuICAgICAgaWYgKGkpXG4gICAgICAgIHJldHVybiBnZXR2YWwob2JqW3BhcnRzW2ldXSwgaSAtIDEpO1xuICAgICAgcmV0dXJuIG9ialtsYXN0UGFydF07XG4gICAgfVxuICAgIHZhciBvcmRlciA9IHRoaXMuX2N0eC5kaXIgPT09IFwibmV4dFwiID8gMSA6IC0xO1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICB2YXIgYVZhbCA9IGdldHZhbChhLCBsYXN0SW5kZXgpLCBiVmFsID0gZ2V0dmFsKGIsIGxhc3RJbmRleCk7XG4gICAgICByZXR1cm4gYVZhbCA8IGJWYWwgPyAtb3JkZXIgOiBhVmFsID4gYlZhbCA/IG9yZGVyIDogMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9BcnJheShmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gYS5zb3J0KHNvcnRlcik7XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl9yZWFkKGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICB2YXIgY3R4ID0gX3RoaXMuX2N0eDtcbiAgICAgIGlmIChjdHguZGlyID09PSBcIm5leHRcIiAmJiBpc1BsYWluS2V5UmFuZ2UoY3R4LCB0cnVlKSAmJiBjdHgubGltaXQgPiAwKSB7XG4gICAgICAgIHZhciB2YWx1ZU1hcHBlcl8xID0gY3R4LnZhbHVlTWFwcGVyO1xuICAgICAgICB2YXIgaW5kZXggPSBnZXRJbmRleE9yU3RvcmUoY3R4LCBjdHgudGFibGUuY29yZS5zY2hlbWEpO1xuICAgICAgICByZXR1cm4gY3R4LnRhYmxlLmNvcmUucXVlcnkoe1xuICAgICAgICAgIHRyYW5zLFxuICAgICAgICAgIGxpbWl0OiBjdHgubGltaXQsXG4gICAgICAgICAgdmFsdWVzOiB0cnVlLFxuICAgICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIHJhbmdlOiBjdHgucmFuZ2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oX2EyKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IF9hMi5yZXN1bHQ7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlTWFwcGVyXzEgPyByZXN1bHQubWFwKHZhbHVlTWFwcGVyXzEpIDogcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBhXzEgPSBbXTtcbiAgICAgICAgcmV0dXJuIGl0ZXIoY3R4LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGFfMS5wdXNoKGl0ZW0pO1xuICAgICAgICB9LCB0cmFucywgY3R4LnRhYmxlLmNvcmUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGFfMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICBpZiAob2Zmc2V0IDw9IDApXG4gICAgICByZXR1cm4gdGhpcztcbiAgICBjdHgub2Zmc2V0ICs9IG9mZnNldDtcbiAgICBpZiAoaXNQbGFpbktleVJhbmdlKGN0eCkpIHtcbiAgICAgIGFkZFJlcGxheUZpbHRlcihjdHgsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2Zmc2V0TGVmdCA9IG9mZnNldDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGN1cnNvciwgYWR2YW5jZSkge1xuICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgaWYgKG9mZnNldExlZnQgPT09IDEpIHtcbiAgICAgICAgICAgIC0tb2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYWR2YW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN1cnNvci5hZHZhbmNlKG9mZnNldExlZnQpO1xuICAgICAgICAgICAgb2Zmc2V0TGVmdCA9IDA7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZFJlcGxheUZpbHRlcihjdHgsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2Zmc2V0TGVmdCA9IG9mZnNldDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAtLW9mZnNldExlZnQgPCAwO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUubGltaXQgPSBmdW5jdGlvbihudW1Sb3dzKSB7XG4gICAgdGhpcy5fY3R4LmxpbWl0ID0gTWF0aC5taW4odGhpcy5fY3R4LmxpbWl0LCBudW1Sb3dzKTtcbiAgICBhZGRSZXBsYXlGaWx0ZXIodGhpcy5fY3R4LCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByb3dzTGVmdCA9IG51bVJvd3M7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oY3Vyc29yLCBhZHZhbmNlLCByZXNvbHZlKSB7XG4gICAgICAgIGlmICgtLXJvd3NMZWZ0IDw9IDApXG4gICAgICAgICAgYWR2YW5jZShyZXNvbHZlKTtcbiAgICAgICAgcmV0dXJuIHJvd3NMZWZ0ID49IDA7XG4gICAgICB9O1xuICAgIH0sIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUudW50aWwgPSBmdW5jdGlvbihmaWx0ZXJGdW5jdGlvbiwgYkluY2x1ZGVTdG9wRW50cnkpIHtcbiAgICBhZGRGaWx0ZXIodGhpcy5fY3R4LCBmdW5jdGlvbihjdXJzb3IsIGFkdmFuY2UsIHJlc29sdmUpIHtcbiAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihjdXJzb3IudmFsdWUpKSB7XG4gICAgICAgIGFkdmFuY2UocmVzb2x2ZSk7XG4gICAgICAgIHJldHVybiBiSW5jbHVkZVN0b3BFbnRyeTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbihjYikge1xuICAgIHJldHVybiB0aGlzLmxpbWl0KDEpLnRvQXJyYXkoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGFbMF07XG4gICAgfSkudGhlbihjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5sYXN0ID0gZnVuY3Rpb24oY2IpIHtcbiAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuZmlyc3QoY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZmlsdGVyRnVuY3Rpb24pIHtcbiAgICBhZGRGaWx0ZXIodGhpcy5fY3R4LCBmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJGdW5jdGlvbihjdXJzb3IudmFsdWUpO1xuICAgIH0pO1xuICAgIGFkZE1hdGNoRmlsdGVyKHRoaXMuX2N0eCwgZmlsdGVyRnVuY3Rpb24pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuYW5kID0gZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKGZpbHRlcik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5vciA9IGZ1bmN0aW9uKGluZGV4TmFtZSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5kYi5XaGVyZUNsYXVzZSh0aGlzLl9jdHgudGFibGUsIGluZGV4TmFtZSwgdGhpcyk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fY3R4LmRpciA9IHRoaXMuX2N0eC5kaXIgPT09IFwicHJldlwiID8gXCJuZXh0XCIgOiBcInByZXZcIjtcbiAgICBpZiAodGhpcy5fb25kaXJlY3Rpb25jaGFuZ2UpXG4gICAgICB0aGlzLl9vbmRpcmVjdGlvbmNoYW5nZSh0aGlzLl9jdHguZGlyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmRlc2MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5lYWNoS2V5ID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIGN0eC5rZXlzT25seSA9ICFjdHguaXNNYXRjaDtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKHZhbCwgY3Vyc29yKSB7XG4gICAgICBjYihjdXJzb3Iua2V5LCBjdXJzb3IpO1xuICAgIH0pO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZWFjaFVuaXF1ZUtleSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdGhpcy5fY3R4LnVuaXF1ZSA9IFwidW5pcXVlXCI7XG4gICAgcmV0dXJuIHRoaXMuZWFjaEtleShjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5lYWNoUHJpbWFyeUtleSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICBjdHgua2V5c09ubHkgPSAhY3R4LmlzTWF0Y2g7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbih2YWwsIGN1cnNvcikge1xuICAgICAgY2IoY3Vyc29yLnByaW1hcnlLZXksIGN1cnNvcik7XG4gICAgfSk7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5fY3R4O1xuICAgIGN0eC5rZXlzT25seSA9ICFjdHguaXNNYXRjaDtcbiAgICB2YXIgYSA9IFtdO1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSwgY3Vyc29yKSB7XG4gICAgICBhLnB1c2goY3Vyc29yLmtleSk7XG4gICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUucHJpbWFyeUtleXMgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHg7XG4gICAgaWYgKGN0eC5kaXIgPT09IFwibmV4dFwiICYmIGlzUGxhaW5LZXlSYW5nZShjdHgsIHRydWUpICYmIGN0eC5saW1pdCA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWFkKGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGdldEluZGV4T3JTdG9yZShjdHgsIGN0eC50YWJsZS5jb3JlLnNjaGVtYSk7XG4gICAgICAgIHJldHVybiBjdHgudGFibGUuY29yZS5xdWVyeSh7XG4gICAgICAgICAgdHJhbnMsXG4gICAgICAgICAgdmFsdWVzOiBmYWxzZSxcbiAgICAgICAgICBsaW1pdDogY3R4LmxpbWl0LFxuICAgICAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIHJhbmdlOiBjdHgucmFuZ2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihmdW5jdGlvbihfYTIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IF9hMi5yZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KS50aGVuKGNiKTtcbiAgICB9XG4gICAgY3R4LmtleXNPbmx5ID0gIWN0eC5pc01hdGNoO1xuICAgIHZhciBhID0gW107XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtLCBjdXJzb3IpIHtcbiAgICAgIGEucHVzaChjdXJzb3IucHJpbWFyeUtleSk7XG4gICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH0pLnRoZW4oY2IpO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUudW5pcXVlS2V5cyA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdGhpcy5fY3R4LnVuaXF1ZSA9IFwidW5pcXVlXCI7XG4gICAgcmV0dXJuIHRoaXMua2V5cyhjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5maXJzdEtleSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMubGltaXQoMSkua2V5cyhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gYVswXTtcbiAgICB9KS50aGVuKGNiKTtcbiAgfTtcbiAgQ29sbGVjdGlvbjIucHJvdG90eXBlLmxhc3RLZXkgPSBmdW5jdGlvbihjYikge1xuICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5maXJzdEtleShjYik7XG4gIH07XG4gIENvbGxlY3Rpb24yLnByb3RvdHlwZS5kaXN0aW5jdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdHggPSB0aGlzLl9jdHgsIGlkeCA9IGN0eC5pbmRleCAmJiBjdHgudGFibGUuc2NoZW1hLmlkeEJ5TmFtZVtjdHguaW5kZXhdO1xuICAgIGlmICghaWR4IHx8ICFpZHgubXVsdGkpXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB2YXIgc2V0ID0ge307XG4gICAgYWRkRmlsdGVyKHRoaXMuX2N0eCwgZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICB2YXIgc3RyS2V5ID0gY3Vyc29yLnByaW1hcnlLZXkudG9TdHJpbmcoKTtcbiAgICAgIHZhciBmb3VuZCA9IGhhc093bihzZXQsIHN0cktleSk7XG4gICAgICBzZXRbc3RyS2V5XSA9IHRydWU7XG4gICAgICByZXR1cm4gIWZvdW5kO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUubW9kaWZ5ID0gZnVuY3Rpb24oY2hhbmdlcykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eDtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGUoZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgIHZhciBtb2RpZnllcjtcbiAgICAgIGlmICh0eXBlb2YgY2hhbmdlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG1vZGlmeWVyID0gY2hhbmdlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrZXlQYXRocyA9IGtleXMoY2hhbmdlcyk7XG4gICAgICAgIHZhciBudW1LZXlzID0ga2V5UGF0aHMubGVuZ3RoO1xuICAgICAgICBtb2RpZnllciA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgYW55dGhpbmdNb2RpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtS2V5czsgKytpKSB7XG4gICAgICAgICAgICB2YXIga2V5UGF0aCA9IGtleVBhdGhzW2ldLCB2YWwgPSBjaGFuZ2VzW2tleVBhdGhdO1xuICAgICAgICAgICAgaWYgKGdldEJ5S2V5UGF0aChpdGVtLCBrZXlQYXRoKSAhPT0gdmFsKSB7XG4gICAgICAgICAgICAgIHNldEJ5S2V5UGF0aChpdGVtLCBrZXlQYXRoLCB2YWwpO1xuICAgICAgICAgICAgICBhbnl0aGluZ01vZGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFueXRoaW5nTW9kaWZpZWQ7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB2YXIgY29yZVRhYmxlID0gY3R4LnRhYmxlLmNvcmU7XG4gICAgICB2YXIgX2EyID0gY29yZVRhYmxlLnNjaGVtYS5wcmltYXJ5S2V5LCBvdXRib3VuZCA9IF9hMi5vdXRib3VuZCwgZXh0cmFjdEtleSA9IF9hMi5leHRyYWN0S2V5O1xuICAgICAgdmFyIGxpbWl0ID0gX3RoaXMuZGIuX29wdGlvbnMubW9kaWZ5Q2h1bmtTaXplIHx8IDIwMDtcbiAgICAgIHZhciBjbXAyID0gX3RoaXMuZGIuY29yZS5jbXA7XG4gICAgICB2YXIgdG90YWxGYWlsdXJlcyA9IFtdO1xuICAgICAgdmFyIHN1Y2Nlc3NDb3VudCA9IDA7XG4gICAgICB2YXIgZmFpbGVkS2V5cyA9IFtdO1xuICAgICAgdmFyIGFwcGx5TXV0YXRlUmVzdWx0ID0gZnVuY3Rpb24oZXhwZWN0ZWRDb3VudCwgcmVzKSB7XG4gICAgICAgIHZhciBmYWlsdXJlcyA9IHJlcy5mYWlsdXJlcywgbnVtRmFpbHVyZXMgPSByZXMubnVtRmFpbHVyZXM7XG4gICAgICAgIHN1Y2Nlc3NDb3VudCArPSBleHBlY3RlZENvdW50IC0gbnVtRmFpbHVyZXM7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EzID0ga2V5cyhmYWlsdXJlcyk7IF9pIDwgX2EzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgIHZhciBwb3MgPSBfYTNbX2ldO1xuICAgICAgICAgIHRvdGFsRmFpbHVyZXMucHVzaChmYWlsdXJlc1twb3NdKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBfdGhpcy5jbG9uZSgpLnByaW1hcnlLZXlzKCkudGhlbihmdW5jdGlvbihrZXlzMikge1xuICAgICAgICB2YXIgbmV4dENodW5rID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgICAgdmFyIGNvdW50ID0gTWF0aC5taW4obGltaXQsIGtleXMyLmxlbmd0aCAtIG9mZnNldCk7XG4gICAgICAgICAgcmV0dXJuIGNvcmVUYWJsZS5nZXRNYW55KHtcbiAgICAgICAgICAgIHRyYW5zLFxuICAgICAgICAgICAga2V5czoga2V5czIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBjb3VudCksXG4gICAgICAgICAgICBjYWNoZTogXCJpbW11dGFibGVcIlxuICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgYWRkVmFsdWVzID0gW107XG4gICAgICAgICAgICB2YXIgcHV0VmFsdWVzID0gW107XG4gICAgICAgICAgICB2YXIgcHV0S2V5cyA9IG91dGJvdW5kID8gW10gOiBudWxsO1xuICAgICAgICAgICAgdmFyIGRlbGV0ZUtleXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICAgICAgICB2YXIgb3JpZ1ZhbHVlID0gdmFsdWVzW2ldO1xuICAgICAgICAgICAgICB2YXIgY3R4XzEgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlZXBDbG9uZShvcmlnVmFsdWUpLFxuICAgICAgICAgICAgICAgIHByaW1LZXk6IGtleXMyW29mZnNldCArIGldXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChtb2RpZnllci5jYWxsKGN0eF8xLCBjdHhfMS52YWx1ZSwgY3R4XzEpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHhfMS52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBkZWxldGVLZXlzLnB1c2goa2V5czJbb2Zmc2V0ICsgaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW91dGJvdW5kICYmIGNtcDIoZXh0cmFjdEtleShvcmlnVmFsdWUpLCBleHRyYWN0S2V5KGN0eF8xLnZhbHVlKSkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZUtleXMucHVzaChrZXlzMltvZmZzZXQgKyBpXSk7XG4gICAgICAgICAgICAgICAgICBhZGRWYWx1ZXMucHVzaChjdHhfMS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHB1dFZhbHVlcy5wdXNoKGN0eF8xLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIGlmIChvdXRib3VuZClcbiAgICAgICAgICAgICAgICAgICAgcHV0S2V5cy5wdXNoKGtleXMyW29mZnNldCArIGldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYWRkVmFsdWVzLmxlbmd0aCA+IDAgJiYgY29yZVRhYmxlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiYWRkXCIsIHZhbHVlczogYWRkVmFsdWVzfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgcG9zIGluIHJlcy5mYWlsdXJlcykge1xuICAgICAgICAgICAgICAgIGRlbGV0ZUtleXMuc3BsaWNlKHBhcnNlSW50KHBvcyksIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFwcGx5TXV0YXRlUmVzdWx0KGFkZFZhbHVlcy5sZW5ndGgsIHJlcyk7XG4gICAgICAgICAgICB9KSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHB1dFZhbHVlcy5sZW5ndGggPiAwICYmIGNvcmVUYWJsZS5tdXRhdGUoe3RyYW5zLCB0eXBlOiBcInB1dFwiLCBrZXlzOiBwdXRLZXlzLCB2YWx1ZXM6IHB1dFZhbHVlc30pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5TXV0YXRlUmVzdWx0KHB1dFZhbHVlcy5sZW5ndGgsIHJlcyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZUtleXMubGVuZ3RoID4gMCAmJiBjb3JlVGFibGUubXV0YXRlKHt0cmFucywgdHlwZTogXCJkZWxldGVcIiwga2V5czogZGVsZXRlS2V5c30pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5TXV0YXRlUmVzdWx0KGRlbGV0ZUtleXMubGVuZ3RoLCByZXMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBrZXlzMi5sZW5ndGggPiBvZmZzZXQgKyBjb3VudCAmJiBuZXh0Q2h1bmsob2Zmc2V0ICsgbGltaXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXh0Q2h1bmsoMCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAodG90YWxGYWlsdXJlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IE1vZGlmeUVycm9yKFwiRXJyb3IgbW9kaWZ5aW5nIG9uZSBvciBtb3JlIG9iamVjdHNcIiwgdG90YWxGYWlsdXJlcywgc3VjY2Vzc0NvdW50LCBmYWlsZWRLZXlzKTtcbiAgICAgICAgICByZXR1cm4ga2V5czIubGVuZ3RoO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDb2xsZWN0aW9uMi5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuX2N0eCwgcmFuZ2UgPSBjdHgucmFuZ2U7XG4gICAgaWYgKGlzUGxhaW5LZXlSYW5nZShjdHgpICYmIChjdHguaXNQcmltS2V5ICYmICFoYW5nc09uRGVsZXRlTGFyZ2VLZXlSYW5nZSB8fCByYW5nZS50eXBlID09PSAzKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3dyaXRlKGZ1bmN0aW9uKHRyYW5zKSB7XG4gICAgICAgIHZhciBwcmltYXJ5S2V5ID0gY3R4LnRhYmxlLmNvcmUuc2NoZW1hLnByaW1hcnlLZXk7XG4gICAgICAgIHZhciBjb3JlUmFuZ2UgPSByYW5nZTtcbiAgICAgICAgcmV0dXJuIGN0eC50YWJsZS5jb3JlLmNvdW50KHt0cmFucywgcXVlcnk6IHtpbmRleDogcHJpbWFyeUtleSwgcmFuZ2U6IGNvcmVSYW5nZX19KS50aGVuKGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICAgICAgcmV0dXJuIGN0eC50YWJsZS5jb3JlLm11dGF0ZSh7dHJhbnMsIHR5cGU6IFwiZGVsZXRlUmFuZ2VcIiwgcmFuZ2U6IGNvcmVSYW5nZX0pLnRoZW4oZnVuY3Rpb24oX2EyKSB7XG4gICAgICAgICAgICB2YXIgZmFpbHVyZXMgPSBfYTIuZmFpbHVyZXM7XG4gICAgICAgICAgICBfYTIubGFzdFJlc3VsdDtcbiAgICAgICAgICAgIF9hMi5yZXN1bHRzO1xuICAgICAgICAgICAgdmFyIG51bUZhaWx1cmVzID0gX2EyLm51bUZhaWx1cmVzO1xuICAgICAgICAgICAgaWYgKG51bUZhaWx1cmVzKVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgTW9kaWZ5RXJyb3IoXCJDb3VsZCBub3QgZGVsZXRlIHNvbWUgdmFsdWVzXCIsIE9iamVjdC5rZXlzKGZhaWx1cmVzKS5tYXAoZnVuY3Rpb24ocG9zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhaWx1cmVzW3Bvc107XG4gICAgICAgICAgICAgIH0pLCBjb3VudCAtIG51bUZhaWx1cmVzKTtcbiAgICAgICAgICAgIHJldHVybiBjb3VudCAtIG51bUZhaWx1cmVzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tb2RpZnkoZnVuY3Rpb24odmFsdWUsIGN0eDIpIHtcbiAgICAgIHJldHVybiBjdHgyLnZhbHVlID0gbnVsbDtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIENvbGxlY3Rpb24yO1xufSgpO1xuZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbkNvbnN0cnVjdG9yKGRiKSB7XG4gIHJldHVybiBtYWtlQ2xhc3NDb25zdHJ1Y3RvcihDb2xsZWN0aW9uLnByb3RvdHlwZSwgZnVuY3Rpb24gQ29sbGVjdGlvbjIod2hlcmVDbGF1c2UsIGtleVJhbmdlR2VuZXJhdG9yKSB7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHZhciBrZXlSYW5nZSA9IEFueVJhbmdlLCBlcnJvciA9IG51bGw7XG4gICAgaWYgKGtleVJhbmdlR2VuZXJhdG9yKVxuICAgICAgdHJ5IHtcbiAgICAgICAga2V5UmFuZ2UgPSBrZXlSYW5nZUdlbmVyYXRvcigpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgIH1cbiAgICB2YXIgd2hlcmVDdHggPSB3aGVyZUNsYXVzZS5fY3R4O1xuICAgIHZhciB0YWJsZSA9IHdoZXJlQ3R4LnRhYmxlO1xuICAgIHZhciByZWFkaW5nSG9vayA9IHRhYmxlLmhvb2sucmVhZGluZy5maXJlO1xuICAgIHRoaXMuX2N0eCA9IHtcbiAgICAgIHRhYmxlLFxuICAgICAgaW5kZXg6IHdoZXJlQ3R4LmluZGV4LFxuICAgICAgaXNQcmltS2V5OiAhd2hlcmVDdHguaW5kZXggfHwgdGFibGUuc2NoZW1hLnByaW1LZXkua2V5UGF0aCAmJiB3aGVyZUN0eC5pbmRleCA9PT0gdGFibGUuc2NoZW1hLnByaW1LZXkubmFtZSxcbiAgICAgIHJhbmdlOiBrZXlSYW5nZSxcbiAgICAgIGtleXNPbmx5OiBmYWxzZSxcbiAgICAgIGRpcjogXCJuZXh0XCIsXG4gICAgICB1bmlxdWU6IFwiXCIsXG4gICAgICBhbGdvcml0aG06IG51bGwsXG4gICAgICBmaWx0ZXI6IG51bGwsXG4gICAgICByZXBsYXlGaWx0ZXI6IG51bGwsXG4gICAgICBqdXN0TGltaXQ6IHRydWUsXG4gICAgICBpc01hdGNoOiBudWxsLFxuICAgICAgb2Zmc2V0OiAwLFxuICAgICAgbGltaXQ6IEluZmluaXR5LFxuICAgICAgZXJyb3IsXG4gICAgICBvcjogd2hlcmVDdHgub3IsXG4gICAgICB2YWx1ZU1hcHBlcjogcmVhZGluZ0hvb2sgIT09IG1pcnJvciA/IHJlYWRpbmdIb29rIDogbnVsbFxuICAgIH07XG4gIH0pO1xufVxuZnVuY3Rpb24gc2ltcGxlQ29tcGFyZShhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA9PT0gYiA/IDAgOiAxO1xufVxuZnVuY3Rpb24gc2ltcGxlQ29tcGFyZVJldmVyc2UoYSwgYikge1xuICByZXR1cm4gYSA+IGIgPyAtMSA6IGEgPT09IGIgPyAwIDogMTtcbn1cbmZ1bmN0aW9uIGZhaWwoY29sbGVjdGlvbk9yV2hlcmVDbGF1c2UsIGVyciwgVCkge1xuICB2YXIgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25PcldoZXJlQ2xhdXNlIGluc3RhbmNlb2YgV2hlcmVDbGF1c2UgPyBuZXcgY29sbGVjdGlvbk9yV2hlcmVDbGF1c2UuQ29sbGVjdGlvbihjb2xsZWN0aW9uT3JXaGVyZUNsYXVzZSkgOiBjb2xsZWN0aW9uT3JXaGVyZUNsYXVzZTtcbiAgY29sbGVjdGlvbi5fY3R4LmVycm9yID0gVCA/IG5ldyBUKGVycikgOiBuZXcgVHlwZUVycm9yKGVycik7XG4gIHJldHVybiBjb2xsZWN0aW9uO1xufVxuZnVuY3Rpb24gZW1wdHlDb2xsZWN0aW9uKHdoZXJlQ2xhdXNlKSB7XG4gIHJldHVybiBuZXcgd2hlcmVDbGF1c2UuQ29sbGVjdGlvbih3aGVyZUNsYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhbmdlRXF1YWwoXCJcIik7XG4gIH0pLmxpbWl0KDApO1xufVxuZnVuY3Rpb24gdXBwZXJGYWN0b3J5KGRpcikge1xuICByZXR1cm4gZGlyID09PSBcIm5leHRcIiA/IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy50b1VwcGVyQ2FzZSgpO1xuICB9IDogZnVuY3Rpb24ocykge1xuICAgIHJldHVybiBzLnRvTG93ZXJDYXNlKCk7XG4gIH07XG59XG5mdW5jdGlvbiBsb3dlckZhY3RvcnkoZGlyKSB7XG4gIHJldHVybiBkaXIgPT09IFwibmV4dFwiID8gZnVuY3Rpb24ocykge1xuICAgIHJldHVybiBzLnRvTG93ZXJDYXNlKCk7XG4gIH0gOiBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHMudG9VcHBlckNhc2UoKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIG5leHRDYXNpbmcoa2V5LCBsb3dlcktleSwgdXBwZXJOZWVkbGUsIGxvd2VyTmVlZGxlLCBjbXAyLCBkaXIpIHtcbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGtleS5sZW5ndGgsIGxvd2VyTmVlZGxlLmxlbmd0aCk7XG4gIHZhciBsbHAgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBsd3JLZXlDaGFyID0gbG93ZXJLZXlbaV07XG4gICAgaWYgKGx3cktleUNoYXIgIT09IGxvd2VyTmVlZGxlW2ldKSB7XG4gICAgICBpZiAoY21wMihrZXlbaV0sIHVwcGVyTmVlZGxlW2ldKSA8IDApXG4gICAgICAgIHJldHVybiBrZXkuc3Vic3RyKDAsIGkpICsgdXBwZXJOZWVkbGVbaV0gKyB1cHBlck5lZWRsZS5zdWJzdHIoaSArIDEpO1xuICAgICAgaWYgKGNtcDIoa2V5W2ldLCBsb3dlck5lZWRsZVtpXSkgPCAwKVxuICAgICAgICByZXR1cm4ga2V5LnN1YnN0cigwLCBpKSArIGxvd2VyTmVlZGxlW2ldICsgdXBwZXJOZWVkbGUuc3Vic3RyKGkgKyAxKTtcbiAgICAgIGlmIChsbHAgPj0gMClcbiAgICAgICAgcmV0dXJuIGtleS5zdWJzdHIoMCwgbGxwKSArIGxvd2VyS2V5W2xscF0gKyB1cHBlck5lZWRsZS5zdWJzdHIobGxwICsgMSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGNtcDIoa2V5W2ldLCBsd3JLZXlDaGFyKSA8IDApXG4gICAgICBsbHAgPSBpO1xuICB9XG4gIGlmIChsZW5ndGggPCBsb3dlck5lZWRsZS5sZW5ndGggJiYgZGlyID09PSBcIm5leHRcIilcbiAgICByZXR1cm4ga2V5ICsgdXBwZXJOZWVkbGUuc3Vic3RyKGtleS5sZW5ndGgpO1xuICBpZiAobGVuZ3RoIDwga2V5Lmxlbmd0aCAmJiBkaXIgPT09IFwicHJldlwiKVxuICAgIHJldHVybiBrZXkuc3Vic3RyKDAsIHVwcGVyTmVlZGxlLmxlbmd0aCk7XG4gIHJldHVybiBsbHAgPCAwID8gbnVsbCA6IGtleS5zdWJzdHIoMCwgbGxwKSArIGxvd2VyTmVlZGxlW2xscF0gKyB1cHBlck5lZWRsZS5zdWJzdHIobGxwICsgMSk7XG59XG5mdW5jdGlvbiBhZGRJZ25vcmVDYXNlQWxnb3JpdGhtKHdoZXJlQ2xhdXNlLCBtYXRjaCwgbmVlZGxlcywgc3VmZml4KSB7XG4gIHZhciB1cHBlciwgbG93ZXIsIGNvbXBhcmUsIHVwcGVyTmVlZGxlcywgbG93ZXJOZWVkbGVzLCBkaXJlY3Rpb24sIG5leHRLZXlTdWZmaXgsIG5lZWRsZXNMZW4gPSBuZWVkbGVzLmxlbmd0aDtcbiAgaWYgKCFuZWVkbGVzLmV2ZXJ5KGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHMgPT09IFwic3RyaW5nXCI7XG4gIH0pKSB7XG4gICAgcmV0dXJuIGZhaWwod2hlcmVDbGF1c2UsIFNUUklOR19FWFBFQ1RFRCk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdERpcmVjdGlvbihkaXIpIHtcbiAgICB1cHBlciA9IHVwcGVyRmFjdG9yeShkaXIpO1xuICAgIGxvd2VyID0gbG93ZXJGYWN0b3J5KGRpcik7XG4gICAgY29tcGFyZSA9IGRpciA9PT0gXCJuZXh0XCIgPyBzaW1wbGVDb21wYXJlIDogc2ltcGxlQ29tcGFyZVJldmVyc2U7XG4gICAgdmFyIG5lZWRsZUJvdW5kcyA9IG5lZWRsZXMubWFwKGZ1bmN0aW9uKG5lZWRsZSkge1xuICAgICAgcmV0dXJuIHtsb3dlcjogbG93ZXIobmVlZGxlKSwgdXBwZXI6IHVwcGVyKG5lZWRsZSl9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGNvbXBhcmUoYS5sb3dlciwgYi5sb3dlcik7XG4gICAgfSk7XG4gICAgdXBwZXJOZWVkbGVzID0gbmVlZGxlQm91bmRzLm1hcChmdW5jdGlvbihuYikge1xuICAgICAgcmV0dXJuIG5iLnVwcGVyO1xuICAgIH0pO1xuICAgIGxvd2VyTmVlZGxlcyA9IG5lZWRsZUJvdW5kcy5tYXAoZnVuY3Rpb24obmIpIHtcbiAgICAgIHJldHVybiBuYi5sb3dlcjtcbiAgICB9KTtcbiAgICBkaXJlY3Rpb24gPSBkaXI7XG4gICAgbmV4dEtleVN1ZmZpeCA9IGRpciA9PT0gXCJuZXh0XCIgPyBcIlwiIDogc3VmZml4O1xuICB9XG4gIGluaXREaXJlY3Rpb24oXCJuZXh0XCIpO1xuICB2YXIgYyA9IG5ldyB3aGVyZUNsYXVzZS5Db2xsZWN0aW9uKHdoZXJlQ2xhdXNlLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY3JlYXRlUmFuZ2UodXBwZXJOZWVkbGVzWzBdLCBsb3dlck5lZWRsZXNbbmVlZGxlc0xlbiAtIDFdICsgc3VmZml4KTtcbiAgfSk7XG4gIGMuX29uZGlyZWN0aW9uY2hhbmdlID0gZnVuY3Rpb24oZGlyZWN0aW9uMikge1xuICAgIGluaXREaXJlY3Rpb24oZGlyZWN0aW9uMik7XG4gIH07XG4gIHZhciBmaXJzdFBvc3NpYmxlTmVlZGxlID0gMDtcbiAgYy5fYWRkQWxnb3JpdGhtKGZ1bmN0aW9uKGN1cnNvciwgYWR2YW5jZSwgcmVzb2x2ZSkge1xuICAgIHZhciBrZXkgPSBjdXJzb3Iua2V5O1xuICAgIGlmICh0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBsb3dlcktleSA9IGxvd2VyKGtleSk7XG4gICAgaWYgKG1hdGNoKGxvd2VyS2V5LCBsb3dlck5lZWRsZXMsIGZpcnN0UG9zc2libGVOZWVkbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxvd2VzdFBvc3NpYmxlQ2FzaW5nID0gbnVsbDtcbiAgICAgIGZvciAodmFyIGkgPSBmaXJzdFBvc3NpYmxlTmVlZGxlOyBpIDwgbmVlZGxlc0xlbjsgKytpKSB7XG4gICAgICAgIHZhciBjYXNpbmcgPSBuZXh0Q2FzaW5nKGtleSwgbG93ZXJLZXksIHVwcGVyTmVlZGxlc1tpXSwgbG93ZXJOZWVkbGVzW2ldLCBjb21wYXJlLCBkaXJlY3Rpb24pO1xuICAgICAgICBpZiAoY2FzaW5nID09PSBudWxsICYmIGxvd2VzdFBvc3NpYmxlQ2FzaW5nID09PSBudWxsKVxuICAgICAgICAgIGZpcnN0UG9zc2libGVOZWVkbGUgPSBpICsgMTtcbiAgICAgICAgZWxzZSBpZiAobG93ZXN0UG9zc2libGVDYXNpbmcgPT09IG51bGwgfHwgY29tcGFyZShsb3dlc3RQb3NzaWJsZUNhc2luZywgY2FzaW5nKSA+IDApIHtcbiAgICAgICAgICBsb3dlc3RQb3NzaWJsZUNhc2luZyA9IGNhc2luZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxvd2VzdFBvc3NpYmxlQ2FzaW5nICE9PSBudWxsKSB7XG4gICAgICAgIGFkdmFuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKGxvd2VzdFBvc3NpYmxlQ2FzaW5nICsgbmV4dEtleVN1ZmZpeCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWR2YW5jZShyZXNvbHZlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYztcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJhbmdlKGxvd2VyLCB1cHBlciwgbG93ZXJPcGVuLCB1cHBlck9wZW4pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAyLFxuICAgIGxvd2VyLFxuICAgIHVwcGVyLFxuICAgIGxvd2VyT3BlbixcbiAgICB1cHBlck9wZW5cbiAgfTtcbn1cbmZ1bmN0aW9uIHJhbmdlRXF1YWwodmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAxLFxuICAgIGxvd2VyOiB2YWx1ZSxcbiAgICB1cHBlcjogdmFsdWVcbiAgfTtcbn1cbnZhciBXaGVyZUNsYXVzZSA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBXaGVyZUNsYXVzZTIoKSB7XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUsIFwiQ29sbGVjdGlvblwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdHgudGFibGUuZGIuQ29sbGVjdGlvbjtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5iZXR3ZWVuID0gZnVuY3Rpb24obG93ZXIsIHVwcGVyLCBpbmNsdWRlTG93ZXIsIGluY2x1ZGVVcHBlcikge1xuICAgIGluY2x1ZGVMb3dlciA9IGluY2x1ZGVMb3dlciAhPT0gZmFsc2U7XG4gICAgaW5jbHVkZVVwcGVyID0gaW5jbHVkZVVwcGVyID09PSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy5fY21wKGxvd2VyLCB1cHBlcikgPiAwIHx8IHRoaXMuX2NtcChsb3dlciwgdXBwZXIpID09PSAwICYmIChpbmNsdWRlTG93ZXIgfHwgaW5jbHVkZVVwcGVyKSAmJiAhKGluY2x1ZGVMb3dlciAmJiBpbmNsdWRlVXBwZXIpKVxuICAgICAgICByZXR1cm4gZW1wdHlDb2xsZWN0aW9uKHRoaXMpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVSYW5nZShsb3dlciwgdXBwZXIsICFpbmNsdWRlTG93ZXIsICFpbmNsdWRlVXBwZXIpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIH1cbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJhbmdlRXF1YWwodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmFib3ZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIElOVkFMSURfS0VZX0FSR1VNRU5UKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuQ29sbGVjdGlvbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSYW5nZSh2YWx1ZSwgdm9pZCAwLCB0cnVlKTtcbiAgICB9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5hYm92ZU9yRXF1YWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIHJldHVybiBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHZhbHVlLCB2b2lkIDAsIGZhbHNlKTtcbiAgICB9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5iZWxvdyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZ2Uodm9pZCAwLCB2YWx1ZSwgZmFsc2UsIHRydWUpO1xuICAgIH0pO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmJlbG93T3JFcXVhbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZ2Uodm9pZCAwLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSBcInN0cmluZ1wiKVxuICAgICAgcmV0dXJuIGZhaWwodGhpcywgU1RSSU5HX0VYUEVDVEVEKTtcbiAgICByZXR1cm4gdGhpcy5iZXR3ZWVuKHN0ciwgc3RyICsgbWF4U3RyaW5nLCB0cnVlLCB0cnVlKTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5zdGFydHNXaXRoSWdub3JlQ2FzZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIgPT09IFwiXCIpXG4gICAgICByZXR1cm4gdGhpcy5zdGFydHNXaXRoKHN0cik7XG4gICAgcmV0dXJuIGFkZElnbm9yZUNhc2VBbGdvcml0aG0odGhpcywgZnVuY3Rpb24oeCwgYSkge1xuICAgICAgcmV0dXJuIHguaW5kZXhPZihhWzBdKSA9PT0gMDtcbiAgICB9LCBbc3RyXSwgbWF4U3RyaW5nKTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5lcXVhbHNJZ25vcmVDYXNlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIGFkZElnbm9yZUNhc2VBbGdvcml0aG0odGhpcywgZnVuY3Rpb24oeCwgYSkge1xuICAgICAgcmV0dXJuIHggPT09IGFbMF07XG4gICAgfSwgW3N0cl0sIFwiXCIpO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmFueU9mSWdub3JlQ2FzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXQgPSBnZXRBcnJheU9mLmFwcGx5KE5PX0NIQVJfQVJSQVksIGFyZ3VtZW50cyk7XG4gICAgaWYgKHNldC5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gZW1wdHlDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHJldHVybiBhZGRJZ25vcmVDYXNlQWxnb3JpdGhtKHRoaXMsIGZ1bmN0aW9uKHgsIGEpIHtcbiAgICAgIHJldHVybiBhLmluZGV4T2YoeCkgIT09IC0xO1xuICAgIH0sIHNldCwgXCJcIik7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuc3RhcnRzV2l0aEFueU9mSWdub3JlQ2FzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXQgPSBnZXRBcnJheU9mLmFwcGx5KE5PX0NIQVJfQVJSQVksIGFyZ3VtZW50cyk7XG4gICAgaWYgKHNldC5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gZW1wdHlDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHJldHVybiBhZGRJZ25vcmVDYXNlQWxnb3JpdGhtKHRoaXMsIGZ1bmN0aW9uKHgsIGEpIHtcbiAgICAgIHJldHVybiBhLnNvbWUoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4geC5pbmRleE9mKG4pID09PSAwO1xuICAgICAgfSk7XG4gICAgfSwgc2V0LCBtYXhTdHJpbmcpO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLmFueU9mID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgc2V0ID0gZ2V0QXJyYXlPZi5hcHBseShOT19DSEFSX0FSUkFZLCBhcmd1bWVudHMpO1xuICAgIHZhciBjb21wYXJlID0gdGhpcy5fY21wO1xuICAgIHRyeSB7XG4gICAgICBzZXQuc29ydChjb21wYXJlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgfVxuICAgIGlmIChzZXQubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIGVtcHR5Q29sbGVjdGlvbih0aGlzKTtcbiAgICB2YXIgYyA9IG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlUmFuZ2Uoc2V0WzBdLCBzZXRbc2V0Lmxlbmd0aCAtIDFdKTtcbiAgICB9KTtcbiAgICBjLl9vbmRpcmVjdGlvbmNoYW5nZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgICAgY29tcGFyZSA9IGRpcmVjdGlvbiA9PT0gXCJuZXh0XCIgPyBfdGhpcy5fYXNjZW5kaW5nIDogX3RoaXMuX2Rlc2NlbmRpbmc7XG4gICAgICBzZXQuc29ydChjb21wYXJlKTtcbiAgICB9O1xuICAgIHZhciBpID0gMDtcbiAgICBjLl9hZGRBbGdvcml0aG0oZnVuY3Rpb24oY3Vyc29yLCBhZHZhbmNlLCByZXNvbHZlKSB7XG4gICAgICB2YXIga2V5ID0gY3Vyc29yLmtleTtcbiAgICAgIHdoaWxlIChjb21wYXJlKGtleSwgc2V0W2ldKSA+IDApIHtcbiAgICAgICAgKytpO1xuICAgICAgICBpZiAoaSA9PT0gc2V0Lmxlbmd0aCkge1xuICAgICAgICAgIGFkdmFuY2UocmVzb2x2ZSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY29tcGFyZShrZXksIHNldFtpXSkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZHZhbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGN1cnNvci5jb250aW51ZShzZXRbaV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjO1xuICB9O1xuICBXaGVyZUNsYXVzZTIucHJvdG90eXBlLm5vdEVxdWFsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbkFueVJhbmdlKFtbbWluS2V5LCB2YWx1ZV0sIFt2YWx1ZSwgdGhpcy5kYi5fbWF4S2V5XV0sIHtpbmNsdWRlTG93ZXJzOiBmYWxzZSwgaW5jbHVkZVVwcGVyczogZmFsc2V9KTtcbiAgfTtcbiAgV2hlcmVDbGF1c2UyLnByb3RvdHlwZS5ub25lT2YgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0ID0gZ2V0QXJyYXlPZi5hcHBseShOT19DSEFSX0FSUkFZLCBhcmd1bWVudHMpO1xuICAgIGlmIChzZXQubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLkNvbGxlY3Rpb24odGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIHNldC5zb3J0KHRoaXMuX2FzY2VuZGluZyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhaWwodGhpcywgSU5WQUxJRF9LRVlfQVJHVU1FTlQpO1xuICAgIH1cbiAgICB2YXIgcmFuZ2VzID0gc2V0LnJlZHVjZShmdW5jdGlvbihyZXMsIHZhbCkge1xuICAgICAgcmV0dXJuIHJlcyA/IHJlcy5jb25jYXQoW1tyZXNbcmVzLmxlbmd0aCAtIDFdWzFdLCB2YWxdXSkgOiBbW21pbktleSwgdmFsXV07XG4gICAgfSwgbnVsbCk7XG4gICAgcmFuZ2VzLnB1c2goW3NldFtzZXQubGVuZ3RoIC0gMV0sIHRoaXMuZGIuX21heEtleV0pO1xuICAgIHJldHVybiB0aGlzLmluQW55UmFuZ2UocmFuZ2VzLCB7aW5jbHVkZUxvd2VyczogZmFsc2UsIGluY2x1ZGVVcHBlcnM6IGZhbHNlfSk7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuaW5BbnlSYW5nZSA9IGZ1bmN0aW9uKHJhbmdlcywgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGNtcDIgPSB0aGlzLl9jbXAsIGFzY2VuZGluZyA9IHRoaXMuX2FzY2VuZGluZywgZGVzY2VuZGluZyA9IHRoaXMuX2Rlc2NlbmRpbmcsIG1pbiA9IHRoaXMuX21pbiwgbWF4ID0gdGhpcy5fbWF4O1xuICAgIGlmIChyYW5nZXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIGVtcHR5Q29sbGVjdGlvbih0aGlzKTtcbiAgICBpZiAoIXJhbmdlcy5ldmVyeShmdW5jdGlvbihyYW5nZSkge1xuICAgICAgcmV0dXJuIHJhbmdlWzBdICE9PSB2b2lkIDAgJiYgcmFuZ2VbMV0gIT09IHZvaWQgMCAmJiBhc2NlbmRpbmcocmFuZ2VbMF0sIHJhbmdlWzFdKSA8PSAwO1xuICAgIH0pKSB7XG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBcIkZpcnN0IGFyZ3VtZW50IHRvIGluQW55UmFuZ2UoKSBtdXN0IGJlIGFuIEFycmF5IG9mIHR3by12YWx1ZSBBcnJheXMgW2xvd2VyLHVwcGVyXSB3aGVyZSB1cHBlciBtdXN0IG5vdCBiZSBsb3dlciB0aGFuIGxvd2VyXCIsIGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KTtcbiAgICB9XG4gICAgdmFyIGluY2x1ZGVMb3dlcnMgPSAhb3B0aW9ucyB8fCBvcHRpb25zLmluY2x1ZGVMb3dlcnMgIT09IGZhbHNlO1xuICAgIHZhciBpbmNsdWRlVXBwZXJzID0gb3B0aW9ucyAmJiBvcHRpb25zLmluY2x1ZGVVcHBlcnMgPT09IHRydWU7XG4gICAgZnVuY3Rpb24gYWRkUmFuZ2UyKHJhbmdlczIsIG5ld1JhbmdlKSB7XG4gICAgICB2YXIgaSA9IDAsIGwgPSByYW5nZXMyLmxlbmd0aDtcbiAgICAgIGZvciAoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIHZhciByYW5nZSA9IHJhbmdlczJbaV07XG4gICAgICAgIGlmIChjbXAyKG5ld1JhbmdlWzBdLCByYW5nZVsxXSkgPCAwICYmIGNtcDIobmV3UmFuZ2VbMV0sIHJhbmdlWzBdKSA+IDApIHtcbiAgICAgICAgICByYW5nZVswXSA9IG1pbihyYW5nZVswXSwgbmV3UmFuZ2VbMF0pO1xuICAgICAgICAgIHJhbmdlWzFdID0gbWF4KHJhbmdlWzFdLCBuZXdSYW5nZVsxXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBsKVxuICAgICAgICByYW5nZXMyLnB1c2gobmV3UmFuZ2UpO1xuICAgICAgcmV0dXJuIHJhbmdlczI7XG4gICAgfVxuICAgIHZhciBzb3J0RGlyZWN0aW9uID0gYXNjZW5kaW5nO1xuICAgIGZ1bmN0aW9uIHJhbmdlU29ydGVyKGEsIGIpIHtcbiAgICAgIHJldHVybiBzb3J0RGlyZWN0aW9uKGFbMF0sIGJbMF0pO1xuICAgIH1cbiAgICB2YXIgc2V0O1xuICAgIHRyeSB7XG4gICAgICBzZXQgPSByYW5nZXMucmVkdWNlKGFkZFJhbmdlMiwgW10pO1xuICAgICAgc2V0LnNvcnQocmFuZ2VTb3J0ZXIpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICByZXR1cm4gZmFpbCh0aGlzLCBJTlZBTElEX0tFWV9BUkdVTUVOVCk7XG4gICAgfVxuICAgIHZhciByYW5nZVBvcyA9IDA7XG4gICAgdmFyIGtleUlzQmV5b25kQ3VycmVudEVudHJ5ID0gaW5jbHVkZVVwcGVycyA/IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGFzY2VuZGluZyhrZXksIHNldFtyYW5nZVBvc11bMV0pID4gMDtcbiAgICB9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gYXNjZW5kaW5nKGtleSwgc2V0W3JhbmdlUG9zXVsxXSkgPj0gMDtcbiAgICB9O1xuICAgIHZhciBrZXlJc0JlZm9yZUN1cnJlbnRFbnRyeSA9IGluY2x1ZGVMb3dlcnMgPyBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBkZXNjZW5kaW5nKGtleSwgc2V0W3JhbmdlUG9zXVswXSkgPiAwO1xuICAgIH0gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBkZXNjZW5kaW5nKGtleSwgc2V0W3JhbmdlUG9zXVswXSkgPj0gMDtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGtleVdpdGhpbkN1cnJlbnRSYW5nZShrZXkpIHtcbiAgICAgIHJldHVybiAha2V5SXNCZXlvbmRDdXJyZW50RW50cnkoa2V5KSAmJiAha2V5SXNCZWZvcmVDdXJyZW50RW50cnkoa2V5KTtcbiAgICB9XG4gICAgdmFyIGNoZWNrS2V5ID0ga2V5SXNCZXlvbmRDdXJyZW50RW50cnk7XG4gICAgdmFyIGMgPSBuZXcgdGhpcy5Db2xsZWN0aW9uKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKHNldFswXVswXSwgc2V0W3NldC5sZW5ndGggLSAxXVsxXSwgIWluY2x1ZGVMb3dlcnMsICFpbmNsdWRlVXBwZXJzKTtcbiAgICB9KTtcbiAgICBjLl9vbmRpcmVjdGlvbmNoYW5nZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgY2hlY2tLZXkgPSBrZXlJc0JleW9uZEN1cnJlbnRFbnRyeTtcbiAgICAgICAgc29ydERpcmVjdGlvbiA9IGFzY2VuZGluZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoZWNrS2V5ID0ga2V5SXNCZWZvcmVDdXJyZW50RW50cnk7XG4gICAgICAgIHNvcnREaXJlY3Rpb24gPSBkZXNjZW5kaW5nO1xuICAgICAgfVxuICAgICAgc2V0LnNvcnQocmFuZ2VTb3J0ZXIpO1xuICAgIH07XG4gICAgYy5fYWRkQWxnb3JpdGhtKGZ1bmN0aW9uKGN1cnNvciwgYWR2YW5jZSwgcmVzb2x2ZSkge1xuICAgICAgdmFyIGtleSA9IGN1cnNvci5rZXk7XG4gICAgICB3aGlsZSAoY2hlY2tLZXkoa2V5KSkge1xuICAgICAgICArK3JhbmdlUG9zO1xuICAgICAgICBpZiAocmFuZ2VQb3MgPT09IHNldC5sZW5ndGgpIHtcbiAgICAgICAgICBhZHZhbmNlKHJlc29sdmUpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGtleVdpdGhpbkN1cnJlbnRSYW5nZShrZXkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChfdGhpcy5fY21wKGtleSwgc2V0W3JhbmdlUG9zXVsxXSkgPT09IDAgfHwgX3RoaXMuX2NtcChrZXksIHNldFtyYW5nZVBvc11bMF0pID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkdmFuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHNvcnREaXJlY3Rpb24gPT09IGFzY2VuZGluZylcbiAgICAgICAgICAgIGN1cnNvci5jb250aW51ZShzZXRbcmFuZ2VQb3NdWzBdKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjdXJzb3IuY29udGludWUoc2V0W3JhbmdlUG9zXVsxXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGM7XG4gIH07XG4gIFdoZXJlQ2xhdXNlMi5wcm90b3R5cGUuc3RhcnRzV2l0aEFueU9mID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldCA9IGdldEFycmF5T2YuYXBwbHkoTk9fQ0hBUl9BUlJBWSwgYXJndW1lbnRzKTtcbiAgICBpZiAoIXNldC5ldmVyeShmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHMgPT09IFwic3RyaW5nXCI7XG4gICAgfSkpIHtcbiAgICAgIHJldHVybiBmYWlsKHRoaXMsIFwic3RhcnRzV2l0aEFueU9mKCkgb25seSB3b3JrcyB3aXRoIHN0cmluZ3NcIik7XG4gICAgfVxuICAgIGlmIChzZXQubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIGVtcHR5Q29sbGVjdGlvbih0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5pbkFueVJhbmdlKHNldC5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gW3N0ciwgc3RyICsgbWF4U3RyaW5nXTtcbiAgICB9KSk7XG4gIH07XG4gIHJldHVybiBXaGVyZUNsYXVzZTI7XG59KCk7XG5mdW5jdGlvbiBjcmVhdGVXaGVyZUNsYXVzZUNvbnN0cnVjdG9yKGRiKSB7XG4gIHJldHVybiBtYWtlQ2xhc3NDb25zdHJ1Y3RvcihXaGVyZUNsYXVzZS5wcm90b3R5cGUsIGZ1bmN0aW9uIFdoZXJlQ2xhdXNlMih0YWJsZSwgaW5kZXgsIG9yQ29sbGVjdGlvbikge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB0aGlzLl9jdHggPSB7XG4gICAgICB0YWJsZSxcbiAgICAgIGluZGV4OiBpbmRleCA9PT0gXCI6aWRcIiA/IG51bGwgOiBpbmRleCxcbiAgICAgIG9yOiBvckNvbGxlY3Rpb25cbiAgICB9O1xuICAgIHZhciBpbmRleGVkREIgPSBkYi5fZGVwcy5pbmRleGVkREI7XG4gICAgaWYgKCFpbmRleGVkREIpXG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5NaXNzaW5nQVBJKCk7XG4gICAgdGhpcy5fY21wID0gdGhpcy5fYXNjZW5kaW5nID0gaW5kZXhlZERCLmNtcC5iaW5kKGluZGV4ZWREQik7XG4gICAgdGhpcy5fZGVzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBpbmRleGVkREIuY21wKGIsIGEpO1xuICAgIH07XG4gICAgdGhpcy5fbWF4ID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGluZGV4ZWREQi5jbXAoYSwgYikgPiAwID8gYSA6IGI7XG4gICAgfTtcbiAgICB0aGlzLl9taW4gPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gaW5kZXhlZERCLmNtcChhLCBiKSA8IDAgPyBhIDogYjtcbiAgICB9O1xuICAgIHRoaXMuX0lEQktleVJhbmdlID0gZGIuX2RlcHMuSURCS2V5UmFuZ2U7XG4gIH0pO1xufVxuZnVuY3Rpb24gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCkge1xuICByZXR1cm4gd3JhcChmdW5jdGlvbihldmVudCkge1xuICAgIHByZXZlbnREZWZhdWx0KGV2ZW50KTtcbiAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xufVxuZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbilcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG52YXIgZ2xvYmFsRXZlbnRzID0gRXZlbnRzKG51bGwsIFwidHhjb21taXR0ZWRcIik7XG52YXIgVHJhbnNhY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVHJhbnNhY3Rpb24yKCkge1xuICB9XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuX2xvY2sgPSBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQoIVBTRC5nbG9iYWwpO1xuICAgICsrdGhpcy5fcmVjdWxvY2s7XG4gICAgaWYgKHRoaXMuX3JlY3Vsb2NrID09PSAxICYmICFQU0QuZ2xvYmFsKVxuICAgICAgUFNELmxvY2tPd25lckZvciA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuX3VubG9jayA9IGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydCghUFNELmdsb2JhbCk7XG4gICAgaWYgKC0tdGhpcy5fcmVjdWxvY2sgPT09IDApIHtcbiAgICAgIGlmICghUFNELmdsb2JhbClcbiAgICAgICAgUFNELmxvY2tPd25lckZvciA9IG51bGw7XG4gICAgICB3aGlsZSAodGhpcy5fYmxvY2tlZEZ1bmNzLmxlbmd0aCA+IDAgJiYgIXRoaXMuX2xvY2tlZCgpKSB7XG4gICAgICAgIHZhciBmbkFuZFBTRCA9IHRoaXMuX2Jsb2NrZWRGdW5jcy5zaGlmdCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHVzZVBTRChmbkFuZFBTRFsxXSwgZm5BbmRQU0RbMF0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUuX2xvY2tlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWN1bG9jayAmJiBQU0QubG9ja093bmVyRm9yICE9PSB0aGlzO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGlkYnRyYW5zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBpZiAoIXRoaXMubW9kZSlcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIHZhciBpZGJkYiA9IHRoaXMuZGIuaWRiZGI7XG4gICAgdmFyIGRiT3BlbkVycm9yID0gdGhpcy5kYi5fc3RhdGUuZGJPcGVuRXJyb3I7XG4gICAgYXNzZXJ0KCF0aGlzLmlkYnRyYW5zKTtcbiAgICBpZiAoIWlkYnRyYW5zICYmICFpZGJkYikge1xuICAgICAgc3dpdGNoIChkYk9wZW5FcnJvciAmJiBkYk9wZW5FcnJvci5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJEYXRhYmFzZUNsb3NlZEVycm9yXCI6XG4gICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuRGF0YWJhc2VDbG9zZWQoZGJPcGVuRXJyb3IpO1xuICAgICAgICBjYXNlIFwiTWlzc2luZ0FQSUVycm9yXCI6XG4gICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTWlzc2luZ0FQSShkYk9wZW5FcnJvci5tZXNzYWdlLCBkYk9wZW5FcnJvcik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuT3BlbkZhaWxlZChkYk9wZW5FcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy5hY3RpdmUpXG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5UcmFuc2FjdGlvbkluYWN0aXZlKCk7XG4gICAgYXNzZXJ0KHRoaXMuX2NvbXBsZXRpb24uX3N0YXRlID09PSBudWxsKTtcbiAgICBpZGJ0cmFucyA9IHRoaXMuaWRidHJhbnMgPSBpZGJ0cmFucyB8fCBpZGJkYi50cmFuc2FjdGlvbihzYWZhcmlNdWx0aVN0b3JlRml4KHRoaXMuc3RvcmVOYW1lcyksIHRoaXMubW9kZSk7XG4gICAgaWRidHJhbnMub25lcnJvciA9IHdyYXAoZnVuY3Rpb24oZXYpIHtcbiAgICAgIHByZXZlbnREZWZhdWx0KGV2KTtcbiAgICAgIF90aGlzLl9yZWplY3QoaWRidHJhbnMuZXJyb3IpO1xuICAgIH0pO1xuICAgIGlkYnRyYW5zLm9uYWJvcnQgPSB3cmFwKGZ1bmN0aW9uKGV2KSB7XG4gICAgICBwcmV2ZW50RGVmYXVsdChldik7XG4gICAgICBfdGhpcy5hY3RpdmUgJiYgX3RoaXMuX3JlamVjdChuZXcgZXhjZXB0aW9ucy5BYm9ydChpZGJ0cmFucy5lcnJvcikpO1xuICAgICAgX3RoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICBfdGhpcy5vbihcImFib3J0XCIpLmZpcmUoZXYpO1xuICAgIH0pO1xuICAgIGlkYnRyYW5zLm9uY29tcGxldGUgPSB3cmFwKGZ1bmN0aW9uKCkge1xuICAgICAgX3RoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICBfdGhpcy5fcmVzb2x2ZSgpO1xuICAgICAgaWYgKFwibXV0YXRlZFBhcnRzXCIgaW4gaWRidHJhbnMpIHtcbiAgICAgICAgZ2xvYmFsRXZlbnRzLnR4Y29tbWl0dGVkLmZpcmUoaWRidHJhbnNbXCJtdXRhdGVkUGFydHNcIl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLl9wcm9taXNlID0gZnVuY3Rpb24obW9kZSwgZm4sIGJXcml0ZUxvY2spIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGlmIChtb2RlID09PSBcInJlYWR3cml0ZVwiICYmIHRoaXMubW9kZSAhPT0gXCJyZWFkd3JpdGVcIilcbiAgICAgIHJldHVybiByZWplY3Rpb24obmV3IGV4Y2VwdGlvbnMuUmVhZE9ubHkoXCJUcmFuc2FjdGlvbiBpcyByZWFkb25seVwiKSk7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSlcbiAgICAgIHJldHVybiByZWplY3Rpb24obmV3IGV4Y2VwdGlvbnMuVHJhbnNhY3Rpb25JbmFjdGl2ZSgpKTtcbiAgICBpZiAodGhpcy5fbG9ja2VkKCkpIHtcbiAgICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBfdGhpcy5fYmxvY2tlZEZ1bmNzLnB1c2goW2Z1bmN0aW9uKCkge1xuICAgICAgICAgIF90aGlzLl9wcm9taXNlKG1vZGUsIGZuLCBiV3JpdGVMb2NrKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0sIFBTRF0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChiV3JpdGVMb2NrKSB7XG4gICAgICByZXR1cm4gbmV3U2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwMiA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgX3RoaXMuX2xvY2soKTtcbiAgICAgICAgICB2YXIgcnYgPSBmbihyZXNvbHZlLCByZWplY3QsIF90aGlzKTtcbiAgICAgICAgICBpZiAocnYgJiYgcnYudGhlbilcbiAgICAgICAgICAgIHJ2LnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHAyLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLl91bmxvY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHAyLl9saWIgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcDI7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHAgPSBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgcnYgPSBmbihyZXNvbHZlLCByZWplY3QsIF90aGlzKTtcbiAgICAgICAgaWYgKHJ2ICYmIHJ2LnRoZW4pXG4gICAgICAgICAgcnYudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICBwLl9saWIgPSB0cnVlO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLl9yb290ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuX3Jvb3QoKSA6IHRoaXM7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUud2FpdEZvciA9IGZ1bmN0aW9uKHByb21pc2VMaWtlKSB7XG4gICAgdmFyIHJvb3QgPSB0aGlzLl9yb290KCk7XG4gICAgdmFyIHByb21pc2UgPSBEZXhpZVByb21pc2UucmVzb2x2ZShwcm9taXNlTGlrZSk7XG4gICAgaWYgKHJvb3QuX3dhaXRpbmdGb3IpIHtcbiAgICAgIHJvb3QuX3dhaXRpbmdGb3IgPSByb290Ll93YWl0aW5nRm9yLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuX3dhaXRpbmdGb3IgPSBwcm9taXNlO1xuICAgICAgcm9vdC5fd2FpdGluZ1F1ZXVlID0gW107XG4gICAgICB2YXIgc3RvcmUgPSByb290LmlkYnRyYW5zLm9iamVjdFN0b3JlKHJvb3Quc3RvcmVOYW1lc1swXSk7XG4gICAgICAoZnVuY3Rpb24gc3BpbigpIHtcbiAgICAgICAgKytyb290Ll9zcGluQ291bnQ7XG4gICAgICAgIHdoaWxlIChyb290Ll93YWl0aW5nUXVldWUubGVuZ3RoKVxuICAgICAgICAgIHJvb3QuX3dhaXRpbmdRdWV1ZS5zaGlmdCgpKCk7XG4gICAgICAgIGlmIChyb290Ll93YWl0aW5nRm9yKVxuICAgICAgICAgIHN0b3JlLmdldCgtSW5maW5pdHkpLm9uc3VjY2VzcyA9IHNwaW47XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFdhaXRQcm9taXNlID0gcm9vdC5fd2FpdGluZ0ZvcjtcbiAgICByZXR1cm4gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJvb3QuX3dhaXRpbmdRdWV1ZS5wdXNoKHdyYXAocmVzb2x2ZS5iaW5kKG51bGwsIHJlcykpKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICByZXR1cm4gcm9vdC5fd2FpdGluZ1F1ZXVlLnB1c2god3JhcChyZWplY3QuYmluZChudWxsLCBlcnIpKSk7XG4gICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocm9vdC5fd2FpdGluZ0ZvciA9PT0gY3VycmVudFdhaXRQcm9taXNlKSB7XG4gICAgICAgICAgcm9vdC5fd2FpdGluZ0ZvciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBUcmFuc2FjdGlvbjIucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hY3RpdmUgJiYgdGhpcy5fcmVqZWN0KG5ldyBleGNlcHRpb25zLkFib3J0KCkpO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gIH07XG4gIFRyYW5zYWN0aW9uMi5wcm90b3R5cGUudGFibGUgPSBmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICB2YXIgbWVtb2l6ZWRUYWJsZXMgPSB0aGlzLl9tZW1vaXplZFRhYmxlcyB8fCAodGhpcy5fbWVtb2l6ZWRUYWJsZXMgPSB7fSk7XG4gICAgaWYgKGhhc093bihtZW1vaXplZFRhYmxlcywgdGFibGVOYW1lKSlcbiAgICAgIHJldHVybiBtZW1vaXplZFRhYmxlc1t0YWJsZU5hbWVdO1xuICAgIHZhciB0YWJsZVNjaGVtYSA9IHRoaXMuc2NoZW1hW3RhYmxlTmFtZV07XG4gICAgaWYgKCF0YWJsZVNjaGVtYSkge1xuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuTm90Rm91bmQoXCJUYWJsZSBcIiArIHRhYmxlTmFtZSArIFwiIG5vdCBwYXJ0IG9mIHRyYW5zYWN0aW9uXCIpO1xuICAgIH1cbiAgICB2YXIgdHJhbnNhY3Rpb25Cb3VuZFRhYmxlID0gbmV3IHRoaXMuZGIuVGFibGUodGFibGVOYW1lLCB0YWJsZVNjaGVtYSwgdGhpcyk7XG4gICAgdHJhbnNhY3Rpb25Cb3VuZFRhYmxlLmNvcmUgPSB0aGlzLmRiLmNvcmUudGFibGUodGFibGVOYW1lKTtcbiAgICBtZW1vaXplZFRhYmxlc1t0YWJsZU5hbWVdID0gdHJhbnNhY3Rpb25Cb3VuZFRhYmxlO1xuICAgIHJldHVybiB0cmFuc2FjdGlvbkJvdW5kVGFibGU7XG4gIH07XG4gIHJldHVybiBUcmFuc2FjdGlvbjI7XG59KCk7XG5mdW5jdGlvbiBjcmVhdGVUcmFuc2FjdGlvbkNvbnN0cnVjdG9yKGRiKSB7XG4gIHJldHVybiBtYWtlQ2xhc3NDb25zdHJ1Y3RvcihUcmFuc2FjdGlvbi5wcm90b3R5cGUsIGZ1bmN0aW9uIFRyYW5zYWN0aW9uMihtb2RlLCBzdG9yZU5hbWVzLCBkYnNjaGVtYSwgcGFyZW50KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLmRiID0gZGI7XG4gICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICB0aGlzLnN0b3JlTmFtZXMgPSBzdG9yZU5hbWVzO1xuICAgIHRoaXMuc2NoZW1hID0gZGJzY2hlbWE7XG4gICAgdGhpcy5pZGJ0cmFucyA9IG51bGw7XG4gICAgdGhpcy5vbiA9IEV2ZW50cyh0aGlzLCBcImNvbXBsZXRlXCIsIFwiZXJyb3JcIiwgXCJhYm9ydFwiKTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCB8fCBudWxsO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLl9yZWN1bG9jayA9IDA7XG4gICAgdGhpcy5fYmxvY2tlZEZ1bmNzID0gW107XG4gICAgdGhpcy5fcmVzb2x2ZSA9IG51bGw7XG4gICAgdGhpcy5fcmVqZWN0ID0gbnVsbDtcbiAgICB0aGlzLl93YWl0aW5nRm9yID0gbnVsbDtcbiAgICB0aGlzLl93YWl0aW5nUXVldWUgPSBudWxsO1xuICAgIHRoaXMuX3NwaW5Db3VudCA9IDA7XG4gICAgdGhpcy5fY29tcGxldGlvbiA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBfdGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBfdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIHRoaXMuX2NvbXBsZXRpb24udGhlbihmdW5jdGlvbigpIHtcbiAgICAgIF90aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgX3RoaXMub24uY29tcGxldGUuZmlyZSgpO1xuICAgIH0sIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciB3YXNBY3RpdmUgPSBfdGhpcy5hY3RpdmU7XG4gICAgICBfdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIF90aGlzLm9uLmVycm9yLmZpcmUoZSk7XG4gICAgICBfdGhpcy5wYXJlbnQgPyBfdGhpcy5wYXJlbnQuX3JlamVjdChlKSA6IHdhc0FjdGl2ZSAmJiBfdGhpcy5pZGJ0cmFucyAmJiBfdGhpcy5pZGJ0cmFucy5hYm9ydCgpO1xuICAgICAgcmV0dXJuIHJlamVjdGlvbihlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBjcmVhdGVJbmRleFNwZWMobmFtZSwga2V5UGF0aCwgdW5pcXVlLCBtdWx0aSwgYXV0bywgY29tcG91bmQsIGlzUHJpbUtleSkge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAga2V5UGF0aCxcbiAgICB1bmlxdWUsXG4gICAgbXVsdGksXG4gICAgYXV0byxcbiAgICBjb21wb3VuZCxcbiAgICBzcmM6ICh1bmlxdWUgJiYgIWlzUHJpbUtleSA/IFwiJlwiIDogXCJcIikgKyAobXVsdGkgPyBcIipcIiA6IFwiXCIpICsgKGF1dG8gPyBcIisrXCIgOiBcIlwiKSArIG5hbWVGcm9tS2V5UGF0aChrZXlQYXRoKVxuICB9O1xufVxuZnVuY3Rpb24gbmFtZUZyb21LZXlQYXRoKGtleVBhdGgpIHtcbiAgcmV0dXJuIHR5cGVvZiBrZXlQYXRoID09PSBcInN0cmluZ1wiID8ga2V5UGF0aCA6IGtleVBhdGggPyBcIltcIiArIFtdLmpvaW4uY2FsbChrZXlQYXRoLCBcIitcIikgKyBcIl1cIiA6IFwiXCI7XG59XG5mdW5jdGlvbiBjcmVhdGVUYWJsZVNjaGVtYShuYW1lLCBwcmltS2V5LCBpbmRleGVzKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBwcmltS2V5LFxuICAgIGluZGV4ZXMsXG4gICAgbWFwcGVkQ2xhc3M6IG51bGwsXG4gICAgaWR4QnlOYW1lOiBhcnJheVRvT2JqZWN0KGluZGV4ZXMsIGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gW2luZGV4Lm5hbWUsIGluZGV4XTtcbiAgICB9KVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0S2V5RXh0cmFjdG9yKGtleVBhdGgpIHtcbiAgaWYgKGtleVBhdGggPT0gbnVsbCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBnZXRTaW5nbGVQYXRoS2V5RXh0cmFjdG9yKGtleVBhdGgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBnZXRCeUtleVBhdGgob2JqLCBrZXlQYXRoKTtcbiAgICB9O1xuICB9XG59XG5mdW5jdGlvbiBnZXRTaW5nbGVQYXRoS2V5RXh0cmFjdG9yKGtleVBhdGgpIHtcbiAgdmFyIHNwbGl0ID0ga2V5UGF0aC5zcGxpdChcIi5cIik7XG4gIGlmIChzcGxpdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqW2tleVBhdGhdO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIGdldEJ5S2V5UGF0aChvYmosIGtleVBhdGgpO1xuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIGFycmF5aWZ5KGFycmF5TGlrZSkge1xuICByZXR1cm4gW10uc2xpY2UuY2FsbChhcnJheUxpa2UpO1xufVxudmFyIF9pZF9jb3VudGVyID0gMDtcbmZ1bmN0aW9uIGdldEtleVBhdGhBbGlhcyhrZXlQYXRoKSB7XG4gIHJldHVybiBrZXlQYXRoID09IG51bGwgPyBcIjppZFwiIDogdHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIgPyBrZXlQYXRoIDogXCJbXCIgKyBrZXlQYXRoLmpvaW4oXCIrXCIpICsgXCJdXCI7XG59XG5mdW5jdGlvbiBjcmVhdGVEQkNvcmUoZGIsIGluZGV4ZWREQiwgSWRiS2V5UmFuZ2UsIHRtcFRyYW5zKSB7XG4gIHZhciBjbXAyID0gaW5kZXhlZERCLmNtcC5iaW5kKGluZGV4ZWREQik7XG4gIGZ1bmN0aW9uIGV4dHJhY3RTY2hlbWEoZGIyLCB0cmFucykge1xuICAgIHZhciB0YWJsZXMyID0gYXJyYXlpZnkoZGIyLm9iamVjdFN0b3JlTmFtZXMpO1xuICAgIHJldHVybiB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgbmFtZTogZGIyLm5hbWUsXG4gICAgICAgIHRhYmxlczogdGFibGVzMi5tYXAoZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJhbnMub2JqZWN0U3RvcmUodGFibGUpO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24oc3RvcmUpIHtcbiAgICAgICAgICB2YXIga2V5UGF0aCA9IHN0b3JlLmtleVBhdGgsIGF1dG9JbmNyZW1lbnQgPSBzdG9yZS5hdXRvSW5jcmVtZW50O1xuICAgICAgICAgIHZhciBjb21wb3VuZCA9IGlzQXJyYXkoa2V5UGF0aCk7XG4gICAgICAgICAgdmFyIG91dGJvdW5kID0ga2V5UGF0aCA9PSBudWxsO1xuICAgICAgICAgIHZhciBpbmRleEJ5S2V5UGF0aCA9IHt9O1xuICAgICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICBuYW1lOiBzdG9yZS5uYW1lLFxuICAgICAgICAgICAgcHJpbWFyeUtleToge1xuICAgICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgICBpc1ByaW1hcnlLZXk6IHRydWUsXG4gICAgICAgICAgICAgIG91dGJvdW5kLFxuICAgICAgICAgICAgICBjb21wb3VuZCxcbiAgICAgICAgICAgICAga2V5UGF0aCxcbiAgICAgICAgICAgICAgYXV0b0luY3JlbWVudCxcbiAgICAgICAgICAgICAgdW5pcXVlOiB0cnVlLFxuICAgICAgICAgICAgICBleHRyYWN0S2V5OiBnZXRLZXlFeHRyYWN0b3Ioa2V5UGF0aClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmRleGVzOiBhcnJheWlmeShzdG9yZS5pbmRleE5hbWVzKS5tYXAoZnVuY3Rpb24oaW5kZXhOYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdG9yZS5pbmRleChpbmRleE5hbWUpO1xuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgIHZhciBuYW1lID0gaW5kZXgubmFtZSwgdW5pcXVlID0gaW5kZXgudW5pcXVlLCBtdWx0aUVudHJ5ID0gaW5kZXgubXVsdGlFbnRyeSwga2V5UGF0aDIgPSBpbmRleC5rZXlQYXRoO1xuICAgICAgICAgICAgICB2YXIgY29tcG91bmQyID0gaXNBcnJheShrZXlQYXRoMik7XG4gICAgICAgICAgICAgIHZhciByZXN1bHQyID0ge1xuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgY29tcG91bmQ6IGNvbXBvdW5kMixcbiAgICAgICAgICAgICAgICBrZXlQYXRoOiBrZXlQYXRoMixcbiAgICAgICAgICAgICAgICB1bmlxdWUsXG4gICAgICAgICAgICAgICAgbXVsdGlFbnRyeSxcbiAgICAgICAgICAgICAgICBleHRyYWN0S2V5OiBnZXRLZXlFeHRyYWN0b3Ioa2V5UGF0aDIpXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGluZGV4QnlLZXlQYXRoW2dldEtleVBhdGhBbGlhcyhrZXlQYXRoMildID0gcmVzdWx0MjtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDI7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGdldEluZGV4QnlLZXlQYXRoOiBmdW5jdGlvbihrZXlQYXRoMikge1xuICAgICAgICAgICAgICByZXR1cm4gaW5kZXhCeUtleVBhdGhbZ2V0S2V5UGF0aEFsaWFzKGtleVBhdGgyKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpbmRleEJ5S2V5UGF0aFtcIjppZFwiXSA9IHJlc3VsdC5wcmltYXJ5S2V5O1xuICAgICAgICAgIGlmIChrZXlQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGluZGV4QnlLZXlQYXRoW2dldEtleVBhdGhBbGlhcyhrZXlQYXRoKV0gPSByZXN1bHQucHJpbWFyeUtleTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBoYXNHZXRBbGw6IHRhYmxlczIubGVuZ3RoID4gMCAmJiBcImdldEFsbFwiIGluIHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlczJbMF0pICYmICEodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICEvKENocm9tZVxcL3xFZGdlXFwvKS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiBbXS5jb25jYXQobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvU2FmYXJpXFwvKFxcZCopLykpWzFdIDwgNjA0KVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gbWFrZUlEQktleVJhbmdlKHJhbmdlKSB7XG4gICAgaWYgKHJhbmdlLnR5cGUgPT09IDMpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBpZiAocmFuZ2UudHlwZSA9PT0gNClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBjb252ZXJ0IG5ldmVyIHR5cGUgdG8gSURCS2V5UmFuZ2VcIik7XG4gICAgdmFyIGxvd2VyID0gcmFuZ2UubG93ZXIsIHVwcGVyID0gcmFuZ2UudXBwZXIsIGxvd2VyT3BlbiA9IHJhbmdlLmxvd2VyT3BlbiwgdXBwZXJPcGVuID0gcmFuZ2UudXBwZXJPcGVuO1xuICAgIHZhciBpZGJSYW5nZSA9IGxvd2VyID09PSB2b2lkIDAgPyB1cHBlciA9PT0gdm9pZCAwID8gbnVsbCA6IElkYktleVJhbmdlLnVwcGVyQm91bmQodXBwZXIsICEhdXBwZXJPcGVuKSA6IHVwcGVyID09PSB2b2lkIDAgPyBJZGJLZXlSYW5nZS5sb3dlckJvdW5kKGxvd2VyLCAhIWxvd2VyT3BlbikgOiBJZGJLZXlSYW5nZS5ib3VuZChsb3dlciwgdXBwZXIsICEhbG93ZXJPcGVuLCAhIXVwcGVyT3Blbik7XG4gICAgcmV0dXJuIGlkYlJhbmdlO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZURiQ29yZVRhYmxlKHRhYmxlU2NoZW1hKSB7XG4gICAgdmFyIHRhYmxlTmFtZSA9IHRhYmxlU2NoZW1hLm5hbWU7XG4gICAgZnVuY3Rpb24gbXV0YXRlKF9hMykge1xuICAgICAgdmFyIHRyYW5zID0gX2EzLnRyYW5zLCB0eXBlID0gX2EzLnR5cGUsIGtleXMyID0gX2EzLmtleXMsIHZhbHVlcyA9IF9hMy52YWx1ZXMsIHJhbmdlID0gX2EzLnJhbmdlO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlID0gd3JhcChyZXNvbHZlKTtcbiAgICAgICAgdmFyIHN0b3JlID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVOYW1lKTtcbiAgICAgICAgdmFyIG91dGJvdW5kID0gc3RvcmUua2V5UGF0aCA9PSBudWxsO1xuICAgICAgICB2YXIgaXNBZGRPclB1dCA9IHR5cGUgPT09IFwicHV0XCIgfHwgdHlwZSA9PT0gXCJhZGRcIjtcbiAgICAgICAgaWYgKCFpc0FkZE9yUHV0ICYmIHR5cGUgIT09IFwiZGVsZXRlXCIgJiYgdHlwZSAhPT0gXCJkZWxldGVSYW5nZVwiKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgb3BlcmF0aW9uIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgICAgIHZhciBsZW5ndGggPSAoa2V5czIgfHwgdmFsdWVzIHx8IHtsZW5ndGg6IDF9KS5sZW5ndGg7XG4gICAgICAgIGlmIChrZXlzMiAmJiB2YWx1ZXMgJiYga2V5czIubGVuZ3RoICE9PSB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2l2ZW4ga2V5cyBhcnJheSBtdXN0IGhhdmUgc2FtZSBsZW5ndGggYXMgZ2l2ZW4gdmFsdWVzIGFycmF5LlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKHtudW1GYWlsdXJlczogMCwgZmFpbHVyZXM6IHt9LCByZXN1bHRzOiBbXSwgbGFzdFJlc3VsdDogdm9pZCAwfSk7XG4gICAgICAgIHZhciByZXE7XG4gICAgICAgIHZhciByZXFzID0gW107XG4gICAgICAgIHZhciBmYWlsdXJlcyA9IFtdO1xuICAgICAgICB2YXIgbnVtRmFpbHVyZXMgPSAwO1xuICAgICAgICB2YXIgZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICArK251bUZhaWx1cmVzO1xuICAgICAgICAgIHByZXZlbnREZWZhdWx0KGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiZGVsZXRlUmFuZ2VcIikge1xuICAgICAgICAgIGlmIChyYW5nZS50eXBlID09PSA0KVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe251bUZhaWx1cmVzLCBmYWlsdXJlcywgcmVzdWx0czogW10sIGxhc3RSZXN1bHQ6IHZvaWQgMH0pO1xuICAgICAgICAgIGlmIChyYW5nZS50eXBlID09PSAzKVxuICAgICAgICAgICAgcmVxcy5wdXNoKHJlcSA9IHN0b3JlLmNsZWFyKCkpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlcXMucHVzaChyZXEgPSBzdG9yZS5kZWxldGUobWFrZUlEQktleVJhbmdlKHJhbmdlKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfYTQgPSBpc0FkZE9yUHV0ID8gb3V0Ym91bmQgPyBbdmFsdWVzLCBrZXlzMl0gOiBbdmFsdWVzLCBudWxsXSA6IFtrZXlzMiwgbnVsbF0sIGFyZ3MxID0gX2E0WzBdLCBhcmdzMiA9IF9hNFsxXTtcbiAgICAgICAgICBpZiAoaXNBZGRPclB1dCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICByZXFzLnB1c2gocmVxID0gYXJnczIgJiYgYXJnczJbaV0gIT09IHZvaWQgMCA/IHN0b3JlW3R5cGVdKGFyZ3MxW2ldLCBhcmdzMltpXSkgOiBzdG9yZVt0eXBlXShhcmdzMVtpXSkpO1xuICAgICAgICAgICAgICByZXEub25lcnJvciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICByZXFzLnB1c2gocmVxID0gc3RvcmVbdHlwZV0oYXJnczFbaV0pKTtcbiAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSBlcnJvckhhbmRsZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkb25lID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB2YXIgbGFzdFJlc3VsdCA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgcmVxcy5mb3JFYWNoKGZ1bmN0aW9uKHJlcTIsIGkyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxMi5lcnJvciAhPSBudWxsICYmIChmYWlsdXJlc1tpMl0gPSByZXEyLmVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIG51bUZhaWx1cmVzLFxuICAgICAgICAgICAgZmFpbHVyZXMsXG4gICAgICAgICAgICByZXN1bHRzOiB0eXBlID09PSBcImRlbGV0ZVwiID8ga2V5czIgOiByZXFzLm1hcChmdW5jdGlvbihyZXEyKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXEyLnJlc3VsdDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbGFzdFJlc3VsdFxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgZXJyb3JIYW5kbGVyKGV2ZW50KTtcbiAgICAgICAgICBkb25lKGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9IGRvbmU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3BlbkN1cnNvcjIoX2EzKSB7XG4gICAgICB2YXIgdHJhbnMgPSBfYTMudHJhbnMsIHZhbHVlcyA9IF9hMy52YWx1ZXMsIHF1ZXJ5MiA9IF9hMy5xdWVyeSwgcmV2ZXJzZSA9IF9hMy5yZXZlcnNlLCB1bmlxdWUgPSBfYTMudW5pcXVlO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlID0gd3JhcChyZXNvbHZlKTtcbiAgICAgICAgdmFyIGluZGV4ID0gcXVlcnkyLmluZGV4LCByYW5nZSA9IHF1ZXJ5Mi5yYW5nZTtcbiAgICAgICAgdmFyIHN0b3JlID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVOYW1lKTtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGluZGV4LmlzUHJpbWFyeUtleSA/IHN0b3JlIDogc3RvcmUuaW5kZXgoaW5kZXgubmFtZSk7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSByZXZlcnNlID8gdW5pcXVlID8gXCJwcmV2dW5pcXVlXCIgOiBcInByZXZcIiA6IHVuaXF1ZSA/IFwibmV4dHVuaXF1ZVwiIDogXCJuZXh0XCI7XG4gICAgICAgIHZhciByZXEgPSB2YWx1ZXMgfHwgIShcIm9wZW5LZXlDdXJzb3JcIiBpbiBzb3VyY2UpID8gc291cmNlLm9wZW5DdXJzb3IobWFrZUlEQktleVJhbmdlKHJhbmdlKSwgZGlyZWN0aW9uKSA6IHNvdXJjZS5vcGVuS2V5Q3Vyc29yKG1ha2VJREJLZXlSYW5nZShyYW5nZSksIGRpcmVjdGlvbik7XG4gICAgICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSB3cmFwKGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgdmFyIGN1cnNvciA9IHJlcS5yZXN1bHQ7XG4gICAgICAgICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnNvci5fX19pZCA9ICsrX2lkX2NvdW50ZXI7XG4gICAgICAgICAgY3Vyc29yLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgX2N1cnNvckNvbnRpbnVlID0gY3Vyc29yLmNvbnRpbnVlLmJpbmQoY3Vyc29yKTtcbiAgICAgICAgICB2YXIgX2N1cnNvckNvbnRpbnVlUHJpbWFyeUtleSA9IGN1cnNvci5jb250aW51ZVByaW1hcnlLZXk7XG4gICAgICAgICAgaWYgKF9jdXJzb3JDb250aW51ZVByaW1hcnlLZXkpXG4gICAgICAgICAgICBfY3Vyc29yQ29udGludWVQcmltYXJ5S2V5ID0gX2N1cnNvckNvbnRpbnVlUHJpbWFyeUtleS5iaW5kKGN1cnNvcik7XG4gICAgICAgICAgdmFyIF9jdXJzb3JBZHZhbmNlID0gY3Vyc29yLmFkdmFuY2UuYmluZChjdXJzb3IpO1xuICAgICAgICAgIHZhciBkb1Rocm93Q3Vyc29ySXNOb3RTdGFydGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDdXJzb3Igbm90IHN0YXJ0ZWRcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgZG9UaHJvd0N1cnNvcklzU3RvcHBlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ3Vyc29yIG5vdCBzdG9wcGVkXCIpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgY3Vyc29yLnRyYW5zID0gdHJhbnM7XG4gICAgICAgICAgY3Vyc29yLnN0b3AgPSBjdXJzb3IuY29udGludWUgPSBjdXJzb3IuY29udGludWVQcmltYXJ5S2V5ID0gY3Vyc29yLmFkdmFuY2UgPSBkb1Rocm93Q3Vyc29ySXNOb3RTdGFydGVkO1xuICAgICAgICAgIGN1cnNvci5mYWlsID0gd3JhcChyZWplY3QpO1xuICAgICAgICAgIGN1cnNvci5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdvdE9uZSA9IDE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdvdE9uZS0tID8gX3RoaXMuY29udGludWUoKSA6IF90aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgICAgY3Vyc29yLnN0YXJ0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRpb25Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZUl0ZXJhdGlvbiwgcmVqZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgIHJlc29sdmVJdGVyYXRpb24gPSB3cmFwKHJlc29sdmVJdGVyYXRpb24pO1xuICAgICAgICAgICAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3RJdGVyYXRpb24pO1xuICAgICAgICAgICAgICBjdXJzb3IuZmFpbCA9IHJlamVjdEl0ZXJhdGlvbjtcbiAgICAgICAgICAgICAgY3Vyc29yLnN0b3AgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnNvci5zdG9wID0gY3Vyc29yLmNvbnRpbnVlID0gY3Vyc29yLmNvbnRpbnVlUHJpbWFyeUtleSA9IGN1cnNvci5hZHZhbmNlID0gZG9UaHJvd0N1cnNvcklzU3RvcHBlZDtcbiAgICAgICAgICAgICAgICByZXNvbHZlSXRlcmF0aW9uKHZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGd1YXJkZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAocmVxLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgY3Vyc29yLmZhaWwoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3Vyc29yLmRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGN1cnNvci5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ3Vyc29yIGJlaGluZCBsYXN0IGVudHJ5XCIpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY3Vyc29yLnN0b3AoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSB3cmFwKGZ1bmN0aW9uKGV2Mikge1xuICAgICAgICAgICAgICByZXEub25zdWNjZXNzID0gZ3VhcmRlZENhbGxiYWNrO1xuICAgICAgICAgICAgICBndWFyZGVkQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlID0gX2N1cnNvckNvbnRpbnVlO1xuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlUHJpbWFyeUtleSA9IF9jdXJzb3JDb250aW51ZVByaW1hcnlLZXk7XG4gICAgICAgICAgICBjdXJzb3IuYWR2YW5jZSA9IF9jdXJzb3JBZHZhbmNlO1xuICAgICAgICAgICAgZ3VhcmRlZENhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0aW9uUHJvbWlzZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJlc29sdmUoY3Vyc29yKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBxdWVyeShoYXNHZXRBbGwyKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVzb2x2ZSA9IHdyYXAocmVzb2x2ZSk7XG4gICAgICAgICAgdmFyIHRyYW5zID0gcmVxdWVzdC50cmFucywgdmFsdWVzID0gcmVxdWVzdC52YWx1ZXMsIGxpbWl0ID0gcmVxdWVzdC5saW1pdCwgcXVlcnkyID0gcmVxdWVzdC5xdWVyeTtcbiAgICAgICAgICB2YXIgbm9uSW5maW5pdExpbWl0ID0gbGltaXQgPT09IEluZmluaXR5ID8gdm9pZCAwIDogbGltaXQ7XG4gICAgICAgICAgdmFyIGluZGV4ID0gcXVlcnkyLmluZGV4LCByYW5nZSA9IHF1ZXJ5Mi5yYW5nZTtcbiAgICAgICAgICB2YXIgc3RvcmUgPSB0cmFucy5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICAgIHZhciBzb3VyY2UgPSBpbmRleC5pc1ByaW1hcnlLZXkgPyBzdG9yZSA6IHN0b3JlLmluZGV4KGluZGV4Lm5hbWUpO1xuICAgICAgICAgIHZhciBpZGJLZXlSYW5nZSA9IG1ha2VJREJLZXlSYW5nZShyYW5nZSk7XG4gICAgICAgICAgaWYgKGxpbWl0ID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe3Jlc3VsdDogW119KTtcbiAgICAgICAgICBpZiAoaGFzR2V0QWxsMikge1xuICAgICAgICAgICAgdmFyIHJlcSA9IHZhbHVlcyA/IHNvdXJjZS5nZXRBbGwoaWRiS2V5UmFuZ2UsIG5vbkluZmluaXRMaW1pdCkgOiBzb3VyY2UuZ2V0QWxsS2V5cyhpZGJLZXlSYW5nZSwgbm9uSW5maW5pdExpbWl0KTtcbiAgICAgICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7cmVzdWx0OiBldmVudC50YXJnZXQucmVzdWx0fSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNvdW50XzEgPSAwO1xuICAgICAgICAgICAgdmFyIHJlcV8xID0gdmFsdWVzIHx8ICEoXCJvcGVuS2V5Q3Vyc29yXCIgaW4gc291cmNlKSA/IHNvdXJjZS5vcGVuQ3Vyc29yKGlkYktleVJhbmdlKSA6IHNvdXJjZS5vcGVuS2V5Q3Vyc29yKGlkYktleVJhbmdlKTtcbiAgICAgICAgICAgIHZhciByZXN1bHRfMSA9IFtdO1xuICAgICAgICAgICAgcmVxXzEub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgdmFyIGN1cnNvciA9IHJlcV8xLnJlc3VsdDtcbiAgICAgICAgICAgICAgaWYgKCFjdXJzb3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe3Jlc3VsdDogcmVzdWx0XzF9KTtcbiAgICAgICAgICAgICAgcmVzdWx0XzEucHVzaCh2YWx1ZXMgPyBjdXJzb3IudmFsdWUgOiBjdXJzb3IucHJpbWFyeUtleSk7XG4gICAgICAgICAgICAgIGlmICgrK2NvdW50XzEgPT09IGxpbWl0KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtyZXN1bHQ6IHJlc3VsdF8xfSk7XG4gICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcV8xLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRhYmxlTmFtZSxcbiAgICAgIHNjaGVtYTogdGFibGVTY2hlbWEsXG4gICAgICBtdXRhdGUsXG4gICAgICBnZXRNYW55OiBmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgdmFyIHRyYW5zID0gX2EzLnRyYW5zLCBrZXlzMiA9IF9hMy5rZXlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVzb2x2ZSA9IHdyYXAocmVzb2x2ZSk7XG4gICAgICAgICAgdmFyIHN0b3JlID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVOYW1lKTtcbiAgICAgICAgICB2YXIgbGVuZ3RoID0ga2V5czIubGVuZ3RoO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICB2YXIga2V5Q291bnQgPSAwO1xuICAgICAgICAgIHZhciBjYWxsYmFja0NvdW50ID0gMDtcbiAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgIHZhciBzdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgcmVxMiA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGlmICgocmVzdWx0W3JlcTIuX3Bvc10gPSByZXEyLnJlc3VsdCkgIT0gbnVsbClcbiAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgaWYgKCsrY2FsbGJhY2tDb3VudCA9PT0ga2V5Q291bnQpXG4gICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBlcnJvckhhbmRsZXIgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5czJbaV07XG4gICAgICAgICAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVxID0gc3RvcmUuZ2V0KGtleXMyW2ldKTtcbiAgICAgICAgICAgICAgcmVxLl9wb3MgPSBpO1xuICAgICAgICAgICAgICByZXEub25zdWNjZXNzID0gc3VjY2Vzc0hhbmRsZXI7XG4gICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICAgICAgICArK2tleUNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoa2V5Q291bnQgPT09IDApXG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGdldDogZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgIHZhciB0cmFucyA9IF9hMy50cmFucywga2V5ID0gX2EzLmtleTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHJlc29sdmUgPSB3cmFwKHJlc29sdmUpO1xuICAgICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlTmFtZSk7XG4gICAgICAgICAgdmFyIHJlcSA9IHN0b3JlLmdldChrZXkpO1xuICAgICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBxdWVyeTogcXVlcnkoaGFzR2V0QWxsKSxcbiAgICAgIG9wZW5DdXJzb3I6IG9wZW5DdXJzb3IyLFxuICAgICAgY291bnQ6IGZ1bmN0aW9uKF9hMykge1xuICAgICAgICB2YXIgcXVlcnkyID0gX2EzLnF1ZXJ5LCB0cmFucyA9IF9hMy50cmFucztcbiAgICAgICAgdmFyIGluZGV4ID0gcXVlcnkyLmluZGV4LCByYW5nZSA9IHF1ZXJ5Mi5yYW5nZTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKHRhYmxlTmFtZSk7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IGluZGV4LmlzUHJpbWFyeUtleSA/IHN0b3JlIDogc3RvcmUuaW5kZXgoaW5kZXgubmFtZSk7XG4gICAgICAgICAgdmFyIGlkYktleVJhbmdlID0gbWFrZUlEQktleVJhbmdlKHJhbmdlKTtcbiAgICAgICAgICB2YXIgcmVxID0gaWRiS2V5UmFuZ2UgPyBzb3VyY2UuY291bnQoaWRiS2V5UmFuZ2UpIDogc291cmNlLmNvdW50KCk7XG4gICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IHdyYXAoZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV2LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcS5vbmVycm9yID0gZXZlbnRSZWplY3RIYW5kbGVyKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgdmFyIF9hMiA9IGV4dHJhY3RTY2hlbWEoZGIsIHRtcFRyYW5zKSwgc2NoZW1hID0gX2EyLnNjaGVtYSwgaGFzR2V0QWxsID0gX2EyLmhhc0dldEFsbDtcbiAgdmFyIHRhYmxlcyA9IHNjaGVtYS50YWJsZXMubWFwKGZ1bmN0aW9uKHRhYmxlU2NoZW1hKSB7XG4gICAgcmV0dXJuIGNyZWF0ZURiQ29yZVRhYmxlKHRhYmxlU2NoZW1hKTtcbiAgfSk7XG4gIHZhciB0YWJsZU1hcCA9IHt9O1xuICB0YWJsZXMuZm9yRWFjaChmdW5jdGlvbih0YWJsZSkge1xuICAgIHJldHVybiB0YWJsZU1hcFt0YWJsZS5uYW1lXSA9IHRhYmxlO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBzdGFjazogXCJkYmNvcmVcIixcbiAgICB0cmFuc2FjdGlvbjogZGIudHJhbnNhY3Rpb24uYmluZChkYiksXG4gICAgdGFibGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0YWJsZU1hcFtuYW1lXTtcbiAgICAgIGlmICghcmVzdWx0KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUYWJsZSAnXCIgKyBuYW1lICsgXCInIG5vdCBmb3VuZFwiKTtcbiAgICAgIHJldHVybiB0YWJsZU1hcFtuYW1lXTtcbiAgICB9LFxuICAgIGNtcDogY21wMixcbiAgICBNSU5fS0VZOiAtSW5maW5pdHksXG4gICAgTUFYX0tFWTogZ2V0TWF4S2V5KElkYktleVJhbmdlKSxcbiAgICBzY2hlbWFcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1pZGRsZXdhcmVTdGFjayhzdGFja0ltcGwsIG1pZGRsZXdhcmVzKSB7XG4gIHJldHVybiBtaWRkbGV3YXJlcy5yZWR1Y2UoZnVuY3Rpb24oZG93biwgX2EyKSB7XG4gICAgdmFyIGNyZWF0ZSA9IF9hMi5jcmVhdGU7XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBkb3duKSwgY3JlYXRlKGRvd24pKTtcbiAgfSwgc3RhY2tJbXBsKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1pZGRsZXdhcmVTdGFja3MobWlkZGxld2FyZXMsIGlkYmRiLCBfYTIsIHRtcFRyYW5zKSB7XG4gIHZhciBJREJLZXlSYW5nZSA9IF9hMi5JREJLZXlSYW5nZSwgaW5kZXhlZERCID0gX2EyLmluZGV4ZWREQjtcbiAgdmFyIGRiY29yZSA9IGNyZWF0ZU1pZGRsZXdhcmVTdGFjayhjcmVhdGVEQkNvcmUoaWRiZGIsIGluZGV4ZWREQiwgSURCS2V5UmFuZ2UsIHRtcFRyYW5zKSwgbWlkZGxld2FyZXMuZGJjb3JlKTtcbiAgcmV0dXJuIHtcbiAgICBkYmNvcmVcbiAgfTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlTWlkZGxld2FyZVN0YWNrcyhkYiwgdG1wVHJhbnMpIHtcbiAgdmFyIGlkYmRiID0gdG1wVHJhbnMuZGI7XG4gIHZhciBzdGFja3MgPSBjcmVhdGVNaWRkbGV3YXJlU3RhY2tzKGRiLl9taWRkbGV3YXJlcywgaWRiZGIsIGRiLl9kZXBzLCB0bXBUcmFucyk7XG4gIGRiLmNvcmUgPSBzdGFja3MuZGJjb3JlO1xuICBkYi50YWJsZXMuZm9yRWFjaChmdW5jdGlvbih0YWJsZSkge1xuICAgIHZhciB0YWJsZU5hbWUgPSB0YWJsZS5uYW1lO1xuICAgIGlmIChkYi5jb3JlLnNjaGVtYS50YWJsZXMuc29tZShmdW5jdGlvbih0YmwpIHtcbiAgICAgIHJldHVybiB0YmwubmFtZSA9PT0gdGFibGVOYW1lO1xuICAgIH0pKSB7XG4gICAgICB0YWJsZS5jb3JlID0gZGIuY29yZS50YWJsZSh0YWJsZU5hbWUpO1xuICAgICAgaWYgKGRiW3RhYmxlTmFtZV0gaW5zdGFuY2VvZiBkYi5UYWJsZSkge1xuICAgICAgICBkYlt0YWJsZU5hbWVdLmNvcmUgPSB0YWJsZS5jb3JlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBzZXRBcGlPblBsYWNlKGRiLCBvYmpzLCB0YWJsZU5hbWVzLCBkYnNjaGVtYSkge1xuICB0YWJsZU5hbWVzLmZvckVhY2goZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgdmFyIHNjaGVtYSA9IGRic2NoZW1hW3RhYmxlTmFtZV07XG4gICAgb2Jqcy5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIHByb3BEZXNjID0gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgdGFibGVOYW1lKTtcbiAgICAgIGlmICghcHJvcERlc2MgfHwgXCJ2YWx1ZVwiIGluIHByb3BEZXNjICYmIHByb3BEZXNjLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgaWYgKG9iaiA9PT0gZGIuVHJhbnNhY3Rpb24ucHJvdG90eXBlIHx8IG9iaiBpbnN0YW5jZW9mIGRiLlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgc2V0UHJvcChvYmosIHRhYmxlTmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFibGUodGFibGVOYW1lKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRoaXMsIHRhYmxlTmFtZSwge3ZhbHVlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiB0cnVlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqW3RhYmxlTmFtZV0gPSBuZXcgZGIuVGFibGUodGFibGVOYW1lLCBzY2hlbWEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVtb3ZlVGFibGVzQXBpKGRiLCBvYmpzKSB7XG4gIG9ianMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBkYi5UYWJsZSlcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBsb3dlclZlcnNpb25GaXJzdChhLCBiKSB7XG4gIHJldHVybiBhLl9jZmcudmVyc2lvbiAtIGIuX2NmZy52ZXJzaW9uO1xufVxuZnVuY3Rpb24gcnVuVXBncmFkZXJzKGRiLCBvbGRWZXJzaW9uLCBpZGJVcGdyYWRlVHJhbnMsIHJlamVjdCkge1xuICB2YXIgZ2xvYmFsU2NoZW1hID0gZGIuX2RiU2NoZW1hO1xuICB2YXIgdHJhbnMgPSBkYi5fY3JlYXRlVHJhbnNhY3Rpb24oXCJyZWFkd3JpdGVcIiwgZGIuX3N0b3JlTmFtZXMsIGdsb2JhbFNjaGVtYSk7XG4gIHRyYW5zLmNyZWF0ZShpZGJVcGdyYWRlVHJhbnMpO1xuICB0cmFucy5fY29tcGxldGlvbi5jYXRjaChyZWplY3QpO1xuICB2YXIgcmVqZWN0VHJhbnNhY3Rpb24gPSB0cmFucy5fcmVqZWN0LmJpbmQodHJhbnMpO1xuICB2YXIgdHJhbnNsZXNzID0gUFNELnRyYW5zbGVzcyB8fCBQU0Q7XG4gIG5ld1Njb3BlKGZ1bmN0aW9uKCkge1xuICAgIFBTRC50cmFucyA9IHRyYW5zO1xuICAgIFBTRC50cmFuc2xlc3MgPSB0cmFuc2xlc3M7XG4gICAgaWYgKG9sZFZlcnNpb24gPT09IDApIHtcbiAgICAgIGtleXMoZ2xvYmFsU2NoZW1hKS5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgICAgICBjcmVhdGVUYWJsZShpZGJVcGdyYWRlVHJhbnMsIHRhYmxlTmFtZSwgZ2xvYmFsU2NoZW1hW3RhYmxlTmFtZV0ucHJpbUtleSwgZ2xvYmFsU2NoZW1hW3RhYmxlTmFtZV0uaW5kZXhlcyk7XG4gICAgICB9KTtcbiAgICAgIGdlbmVyYXRlTWlkZGxld2FyZVN0YWNrcyhkYiwgaWRiVXBncmFkZVRyYW5zKTtcbiAgICAgIERleGllUHJvbWlzZS5mb2xsb3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBkYi5vbi5wb3B1bGF0ZS5maXJlKHRyYW5zKTtcbiAgICAgIH0pLmNhdGNoKHJlamVjdFRyYW5zYWN0aW9uKTtcbiAgICB9IGVsc2VcbiAgICAgIHVwZGF0ZVRhYmxlc0FuZEluZGV4ZXMoZGIsIG9sZFZlcnNpb24sIHRyYW5zLCBpZGJVcGdyYWRlVHJhbnMpLmNhdGNoKHJlamVjdFRyYW5zYWN0aW9uKTtcbiAgfSk7XG59XG5mdW5jdGlvbiB1cGRhdGVUYWJsZXNBbmRJbmRleGVzKGRiLCBvbGRWZXJzaW9uLCB0cmFucywgaWRiVXBncmFkZVRyYW5zKSB7XG4gIHZhciBxdWV1ZSA9IFtdO1xuICB2YXIgdmVyc2lvbnMgPSBkYi5fdmVyc2lvbnM7XG4gIHZhciBnbG9iYWxTY2hlbWEgPSBkYi5fZGJTY2hlbWEgPSBidWlsZEdsb2JhbFNjaGVtYShkYiwgZGIuaWRiZGIsIGlkYlVwZ3JhZGVUcmFucyk7XG4gIHZhciBhbnlDb250ZW50VXBncmFkZXJIYXNSdW4gPSBmYWxzZTtcbiAgdmFyIHZlcnNUb1J1biA9IHZlcnNpb25zLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIHYuX2NmZy52ZXJzaW9uID49IG9sZFZlcnNpb247XG4gIH0pO1xuICB2ZXJzVG9SdW4uZm9yRWFjaChmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgcXVldWUucHVzaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvbGRTY2hlbWEgPSBnbG9iYWxTY2hlbWE7XG4gICAgICB2YXIgbmV3U2NoZW1hID0gdmVyc2lvbi5fY2ZnLmRic2NoZW1hO1xuICAgICAgYWRqdXN0VG9FeGlzdGluZ0luZGV4TmFtZXMoZGIsIG9sZFNjaGVtYSwgaWRiVXBncmFkZVRyYW5zKTtcbiAgICAgIGFkanVzdFRvRXhpc3RpbmdJbmRleE5hbWVzKGRiLCBuZXdTY2hlbWEsIGlkYlVwZ3JhZGVUcmFucyk7XG4gICAgICBnbG9iYWxTY2hlbWEgPSBkYi5fZGJTY2hlbWEgPSBuZXdTY2hlbWE7XG4gICAgICB2YXIgZGlmZiA9IGdldFNjaGVtYURpZmYob2xkU2NoZW1hLCBuZXdTY2hlbWEpO1xuICAgICAgZGlmZi5hZGQuZm9yRWFjaChmdW5jdGlvbih0dXBsZSkge1xuICAgICAgICBjcmVhdGVUYWJsZShpZGJVcGdyYWRlVHJhbnMsIHR1cGxlWzBdLCB0dXBsZVsxXS5wcmltS2V5LCB0dXBsZVsxXS5pbmRleGVzKTtcbiAgICAgIH0pO1xuICAgICAgZGlmZi5jaGFuZ2UuZm9yRWFjaChmdW5jdGlvbihjaGFuZ2UpIHtcbiAgICAgICAgaWYgKGNoYW5nZS5yZWNyZWF0ZSkge1xuICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlVwZ3JhZGUoXCJOb3QgeWV0IHN1cHBvcnQgZm9yIGNoYW5naW5nIHByaW1hcnkga2V5XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzdG9yZV8xID0gaWRiVXBncmFkZVRyYW5zLm9iamVjdFN0b3JlKGNoYW5nZS5uYW1lKTtcbiAgICAgICAgICBjaGFuZ2UuYWRkLmZvckVhY2goZnVuY3Rpb24oaWR4KSB7XG4gICAgICAgICAgICByZXR1cm4gYWRkSW5kZXgoc3RvcmVfMSwgaWR4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjaGFuZ2UuY2hhbmdlLmZvckVhY2goZnVuY3Rpb24oaWR4KSB7XG4gICAgICAgICAgICBzdG9yZV8xLmRlbGV0ZUluZGV4KGlkeC5uYW1lKTtcbiAgICAgICAgICAgIGFkZEluZGV4KHN0b3JlXzEsIGlkeCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2hhbmdlLmRlbC5mb3JFYWNoKGZ1bmN0aW9uKGlkeE5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZV8xLmRlbGV0ZUluZGV4KGlkeE5hbWUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBjb250ZW50VXBncmFkZSA9IHZlcnNpb24uX2NmZy5jb250ZW50VXBncmFkZTtcbiAgICAgIGlmIChjb250ZW50VXBncmFkZSAmJiB2ZXJzaW9uLl9jZmcudmVyc2lvbiA+IG9sZFZlcnNpb24pIHtcbiAgICAgICAgZ2VuZXJhdGVNaWRkbGV3YXJlU3RhY2tzKGRiLCBpZGJVcGdyYWRlVHJhbnMpO1xuICAgICAgICB0cmFucy5fbWVtb2l6ZWRUYWJsZXMgPSB7fTtcbiAgICAgICAgYW55Q29udGVudFVwZ3JhZGVySGFzUnVuID0gdHJ1ZTtcbiAgICAgICAgdmFyIHVwZ3JhZGVTY2hlbWFfMSA9IHNoYWxsb3dDbG9uZShuZXdTY2hlbWEpO1xuICAgICAgICBkaWZmLmRlbC5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgICAgdXBncmFkZVNjaGVtYV8xW3RhYmxlXSA9IG9sZFNjaGVtYVt0YWJsZV07XG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVUYWJsZXNBcGkoZGIsIFtkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGVdKTtcbiAgICAgICAgc2V0QXBpT25QbGFjZShkYiwgW2RiLlRyYW5zYWN0aW9uLnByb3RvdHlwZV0sIGtleXModXBncmFkZVNjaGVtYV8xKSwgdXBncmFkZVNjaGVtYV8xKTtcbiAgICAgICAgdHJhbnMuc2NoZW1hID0gdXBncmFkZVNjaGVtYV8xO1xuICAgICAgICB2YXIgY29udGVudFVwZ3JhZGVJc0FzeW5jXzEgPSBpc0FzeW5jRnVuY3Rpb24oY29udGVudFVwZ3JhZGUpO1xuICAgICAgICBpZiAoY29udGVudFVwZ3JhZGVJc0FzeW5jXzEpIHtcbiAgICAgICAgICBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXR1cm5WYWx1ZV8xO1xuICAgICAgICB2YXIgcHJvbWlzZUZvbGxvd2VkID0gRGV4aWVQcm9taXNlLmZvbGxvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZV8xID0gY29udGVudFVwZ3JhZGUodHJhbnMpO1xuICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZV8xKSB7XG4gICAgICAgICAgICBpZiAoY29udGVudFVwZ3JhZGVJc0FzeW5jXzEpIHtcbiAgICAgICAgICAgICAgdmFyIGRlY3JlbWVudG9yID0gZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMuYmluZChudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgcmV0dXJuVmFsdWVfMS50aGVuKGRlY3JlbWVudG9yLCBkZWNyZW1lbnRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlXzEgJiYgdHlwZW9mIHJldHVyblZhbHVlXzEudGhlbiA9PT0gXCJmdW5jdGlvblwiID8gRGV4aWVQcm9taXNlLnJlc29sdmUocmV0dXJuVmFsdWVfMSkgOiBwcm9taXNlRm9sbG93ZWQudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWVfMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcXVldWUucHVzaChmdW5jdGlvbihpZGJ0cmFucykge1xuICAgICAgaWYgKCFhbnlDb250ZW50VXBncmFkZXJIYXNSdW4gfHwgIWhhc0lFRGVsZXRlT2JqZWN0U3RvcmVCdWcpIHtcbiAgICAgICAgdmFyIG5ld1NjaGVtYSA9IHZlcnNpb24uX2NmZy5kYnNjaGVtYTtcbiAgICAgICAgZGVsZXRlUmVtb3ZlZFRhYmxlcyhuZXdTY2hlbWEsIGlkYnRyYW5zKTtcbiAgICAgIH1cbiAgICAgIHJlbW92ZVRhYmxlc0FwaShkYiwgW2RiLlRyYW5zYWN0aW9uLnByb3RvdHlwZV0pO1xuICAgICAgc2V0QXBpT25QbGFjZShkYiwgW2RiLlRyYW5zYWN0aW9uLnByb3RvdHlwZV0sIGRiLl9zdG9yZU5hbWVzLCBkYi5fZGJTY2hlbWEpO1xuICAgICAgdHJhbnMuc2NoZW1hID0gZGIuX2RiU2NoZW1hO1xuICAgIH0pO1xuICB9KTtcbiAgZnVuY3Rpb24gcnVuUXVldWUoKSB7XG4gICAgcmV0dXJuIHF1ZXVlLmxlbmd0aCA/IERleGllUHJvbWlzZS5yZXNvbHZlKHF1ZXVlLnNoaWZ0KCkodHJhbnMuaWRidHJhbnMpKS50aGVuKHJ1blF1ZXVlKSA6IERleGllUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgcmV0dXJuIHJ1blF1ZXVlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICBjcmVhdGVNaXNzaW5nVGFibGVzKGdsb2JhbFNjaGVtYSwgaWRiVXBncmFkZVRyYW5zKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRTY2hlbWFEaWZmKG9sZFNjaGVtYSwgbmV3U2NoZW1hKSB7XG4gIHZhciBkaWZmID0ge1xuICAgIGRlbDogW10sXG4gICAgYWRkOiBbXSxcbiAgICBjaGFuZ2U6IFtdXG4gIH07XG4gIHZhciB0YWJsZTtcbiAgZm9yICh0YWJsZSBpbiBvbGRTY2hlbWEpIHtcbiAgICBpZiAoIW5ld1NjaGVtYVt0YWJsZV0pXG4gICAgICBkaWZmLmRlbC5wdXNoKHRhYmxlKTtcbiAgfVxuICBmb3IgKHRhYmxlIGluIG5ld1NjaGVtYSkge1xuICAgIHZhciBvbGREZWYgPSBvbGRTY2hlbWFbdGFibGVdLCBuZXdEZWYgPSBuZXdTY2hlbWFbdGFibGVdO1xuICAgIGlmICghb2xkRGVmKSB7XG4gICAgICBkaWZmLmFkZC5wdXNoKFt0YWJsZSwgbmV3RGVmXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgIG5hbWU6IHRhYmxlLFxuICAgICAgICBkZWY6IG5ld0RlZixcbiAgICAgICAgcmVjcmVhdGU6IGZhbHNlLFxuICAgICAgICBkZWw6IFtdLFxuICAgICAgICBhZGQ6IFtdLFxuICAgICAgICBjaGFuZ2U6IFtdXG4gICAgICB9O1xuICAgICAgaWYgKFwiXCIgKyAob2xkRGVmLnByaW1LZXkua2V5UGF0aCB8fCBcIlwiKSAhPT0gXCJcIiArIChuZXdEZWYucHJpbUtleS5rZXlQYXRoIHx8IFwiXCIpIHx8IG9sZERlZi5wcmltS2V5LmF1dG8gIT09IG5ld0RlZi5wcmltS2V5LmF1dG8gJiYgIWlzSUVPckVkZ2UpIHtcbiAgICAgICAgY2hhbmdlLnJlY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgZGlmZi5jaGFuZ2UucHVzaChjaGFuZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG9sZEluZGV4ZXMgPSBvbGREZWYuaWR4QnlOYW1lO1xuICAgICAgICB2YXIgbmV3SW5kZXhlcyA9IG5ld0RlZi5pZHhCeU5hbWU7XG4gICAgICAgIHZhciBpZHhOYW1lID0gdm9pZCAwO1xuICAgICAgICBmb3IgKGlkeE5hbWUgaW4gb2xkSW5kZXhlcykge1xuICAgICAgICAgIGlmICghbmV3SW5kZXhlc1tpZHhOYW1lXSlcbiAgICAgICAgICAgIGNoYW5nZS5kZWwucHVzaChpZHhOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGlkeE5hbWUgaW4gbmV3SW5kZXhlcykge1xuICAgICAgICAgIHZhciBvbGRJZHggPSBvbGRJbmRleGVzW2lkeE5hbWVdLCBuZXdJZHggPSBuZXdJbmRleGVzW2lkeE5hbWVdO1xuICAgICAgICAgIGlmICghb2xkSWR4KVxuICAgICAgICAgICAgY2hhbmdlLmFkZC5wdXNoKG5ld0lkeCk7XG4gICAgICAgICAgZWxzZSBpZiAob2xkSWR4LnNyYyAhPT0gbmV3SWR4LnNyYylcbiAgICAgICAgICAgIGNoYW5nZS5jaGFuZ2UucHVzaChuZXdJZHgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2UuZGVsLmxlbmd0aCA+IDAgfHwgY2hhbmdlLmFkZC5sZW5ndGggPiAwIHx8IGNoYW5nZS5jaGFuZ2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRpZmYuY2hhbmdlLnB1c2goY2hhbmdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGlmZjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRhYmxlKGlkYnRyYW5zLCB0YWJsZU5hbWUsIHByaW1LZXksIGluZGV4ZXMpIHtcbiAgdmFyIHN0b3JlID0gaWRidHJhbnMuZGIuY3JlYXRlT2JqZWN0U3RvcmUodGFibGVOYW1lLCBwcmltS2V5LmtleVBhdGggPyB7a2V5UGF0aDogcHJpbUtleS5rZXlQYXRoLCBhdXRvSW5jcmVtZW50OiBwcmltS2V5LmF1dG99IDoge2F1dG9JbmNyZW1lbnQ6IHByaW1LZXkuYXV0b30pO1xuICBpbmRleGVzLmZvckVhY2goZnVuY3Rpb24oaWR4KSB7XG4gICAgcmV0dXJuIGFkZEluZGV4KHN0b3JlLCBpZHgpO1xuICB9KTtcbiAgcmV0dXJuIHN0b3JlO1xufVxuZnVuY3Rpb24gY3JlYXRlTWlzc2luZ1RhYmxlcyhuZXdTY2hlbWEsIGlkYnRyYW5zKSB7XG4gIGtleXMobmV3U2NoZW1hKS5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgIGlmICghaWRidHJhbnMuZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyh0YWJsZU5hbWUpKSB7XG4gICAgICBjcmVhdGVUYWJsZShpZGJ0cmFucywgdGFibGVOYW1lLCBuZXdTY2hlbWFbdGFibGVOYW1lXS5wcmltS2V5LCBuZXdTY2hlbWFbdGFibGVOYW1lXS5pbmRleGVzKTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gZGVsZXRlUmVtb3ZlZFRhYmxlcyhuZXdTY2hlbWEsIGlkYnRyYW5zKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaWRidHJhbnMuZGIub2JqZWN0U3RvcmVOYW1lcy5sZW5ndGg7ICsraSkge1xuICAgIHZhciBzdG9yZU5hbWUgPSBpZGJ0cmFucy5kYi5vYmplY3RTdG9yZU5hbWVzW2ldO1xuICAgIGlmIChuZXdTY2hlbWFbc3RvcmVOYW1lXSA9PSBudWxsKSB7XG4gICAgICBpZGJ0cmFucy5kYi5kZWxldGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gYWRkSW5kZXgoc3RvcmUsIGlkeCkge1xuICBzdG9yZS5jcmVhdGVJbmRleChpZHgubmFtZSwgaWR4LmtleVBhdGgsIHt1bmlxdWU6IGlkeC51bmlxdWUsIG11bHRpRW50cnk6IGlkeC5tdWx0aX0pO1xufVxuZnVuY3Rpb24gYnVpbGRHbG9iYWxTY2hlbWEoZGIsIGlkYmRiLCB0bXBUcmFucykge1xuICB2YXIgZ2xvYmFsU2NoZW1hID0ge307XG4gIHZhciBkYlN0b3JlTmFtZXMgPSBzbGljZShpZGJkYi5vYmplY3RTdG9yZU5hbWVzLCAwKTtcbiAgZGJTdG9yZU5hbWVzLmZvckVhY2goZnVuY3Rpb24oc3RvcmVOYW1lKSB7XG4gICAgdmFyIHN0b3JlID0gdG1wVHJhbnMub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICB2YXIga2V5UGF0aCA9IHN0b3JlLmtleVBhdGg7XG4gICAgdmFyIHByaW1LZXkgPSBjcmVhdGVJbmRleFNwZWMobmFtZUZyb21LZXlQYXRoKGtleVBhdGgpLCBrZXlQYXRoIHx8IFwiXCIsIGZhbHNlLCBmYWxzZSwgISFzdG9yZS5hdXRvSW5jcmVtZW50LCBrZXlQYXRoICYmIHR5cGVvZiBrZXlQYXRoICE9PSBcInN0cmluZ1wiLCB0cnVlKTtcbiAgICB2YXIgaW5kZXhlcyA9IFtdO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3RvcmUuaW5kZXhOYW1lcy5sZW5ndGg7ICsraikge1xuICAgICAgdmFyIGlkYmluZGV4ID0gc3RvcmUuaW5kZXgoc3RvcmUuaW5kZXhOYW1lc1tqXSk7XG4gICAgICBrZXlQYXRoID0gaWRiaW5kZXgua2V5UGF0aDtcbiAgICAgIHZhciBpbmRleCA9IGNyZWF0ZUluZGV4U3BlYyhpZGJpbmRleC5uYW1lLCBrZXlQYXRoLCAhIWlkYmluZGV4LnVuaXF1ZSwgISFpZGJpbmRleC5tdWx0aUVudHJ5LCBmYWxzZSwga2V5UGF0aCAmJiB0eXBlb2Yga2V5UGF0aCAhPT0gXCJzdHJpbmdcIiwgZmFsc2UpO1xuICAgICAgaW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICB9XG4gICAgZ2xvYmFsU2NoZW1hW3N0b3JlTmFtZV0gPSBjcmVhdGVUYWJsZVNjaGVtYShzdG9yZU5hbWUsIHByaW1LZXksIGluZGV4ZXMpO1xuICB9KTtcbiAgcmV0dXJuIGdsb2JhbFNjaGVtYTtcbn1cbmZ1bmN0aW9uIHJlYWRHbG9iYWxTY2hlbWEoZGIsIGlkYmRiLCB0bXBUcmFucykge1xuICBkYi52ZXJubyA9IGlkYmRiLnZlcnNpb24gLyAxMDtcbiAgdmFyIGdsb2JhbFNjaGVtYSA9IGRiLl9kYlNjaGVtYSA9IGJ1aWxkR2xvYmFsU2NoZW1hKGRiLCBpZGJkYiwgdG1wVHJhbnMpO1xuICBkYi5fc3RvcmVOYW1lcyA9IHNsaWNlKGlkYmRiLm9iamVjdFN0b3JlTmFtZXMsIDApO1xuICBzZXRBcGlPblBsYWNlKGRiLCBbZGIuX2FsbFRhYmxlc10sIGtleXMoZ2xvYmFsU2NoZW1hKSwgZ2xvYmFsU2NoZW1hKTtcbn1cbmZ1bmN0aW9uIHZlcmlmeUluc3RhbGxlZFNjaGVtYShkYiwgdG1wVHJhbnMpIHtcbiAgdmFyIGluc3RhbGxlZFNjaGVtYSA9IGJ1aWxkR2xvYmFsU2NoZW1hKGRiLCBkYi5pZGJkYiwgdG1wVHJhbnMpO1xuICB2YXIgZGlmZiA9IGdldFNjaGVtYURpZmYoaW5zdGFsbGVkU2NoZW1hLCBkYi5fZGJTY2hlbWEpO1xuICByZXR1cm4gIShkaWZmLmFkZC5sZW5ndGggfHwgZGlmZi5jaGFuZ2Uuc29tZShmdW5jdGlvbihjaCkge1xuICAgIHJldHVybiBjaC5hZGQubGVuZ3RoIHx8IGNoLmNoYW5nZS5sZW5ndGg7XG4gIH0pKTtcbn1cbmZ1bmN0aW9uIGFkanVzdFRvRXhpc3RpbmdJbmRleE5hbWVzKGRiLCBzY2hlbWEsIGlkYnRyYW5zKSB7XG4gIHZhciBzdG9yZU5hbWVzID0gaWRidHJhbnMuZGIub2JqZWN0U3RvcmVOYW1lcztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdG9yZU5hbWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHN0b3JlTmFtZSA9IHN0b3JlTmFtZXNbaV07XG4gICAgdmFyIHN0b3JlID0gaWRidHJhbnMub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICBkYi5faGFzR2V0QWxsID0gXCJnZXRBbGxcIiBpbiBzdG9yZTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0b3JlLmluZGV4TmFtZXMubGVuZ3RoOyArK2opIHtcbiAgICAgIHZhciBpbmRleE5hbWUgPSBzdG9yZS5pbmRleE5hbWVzW2pdO1xuICAgICAgdmFyIGtleVBhdGggPSBzdG9yZS5pbmRleChpbmRleE5hbWUpLmtleVBhdGg7XG4gICAgICB2YXIgZGV4aWVOYW1lID0gdHlwZW9mIGtleVBhdGggPT09IFwic3RyaW5nXCIgPyBrZXlQYXRoIDogXCJbXCIgKyBzbGljZShrZXlQYXRoKS5qb2luKFwiK1wiKSArIFwiXVwiO1xuICAgICAgaWYgKHNjaGVtYVtzdG9yZU5hbWVdKSB7XG4gICAgICAgIHZhciBpbmRleFNwZWMgPSBzY2hlbWFbc3RvcmVOYW1lXS5pZHhCeU5hbWVbZGV4aWVOYW1lXTtcbiAgICAgICAgaWYgKGluZGV4U3BlYykge1xuICAgICAgICAgIGluZGV4U3BlYy5uYW1lID0gaW5kZXhOYW1lO1xuICAgICAgICAgIGRlbGV0ZSBzY2hlbWFbc3RvcmVOYW1lXS5pZHhCeU5hbWVbZGV4aWVOYW1lXTtcbiAgICAgICAgICBzY2hlbWFbc3RvcmVOYW1lXS5pZHhCeU5hbWVbaW5kZXhOYW1lXSA9IGluZGV4U3BlYztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICEvKENocm9tZVxcL3xFZGdlXFwvKS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiBfZ2xvYmFsLldvcmtlckdsb2JhbFNjb3BlICYmIF9nbG9iYWwgaW5zdGFuY2VvZiBfZ2xvYmFsLldvcmtlckdsb2JhbFNjb3BlICYmIFtdLmNvbmNhdChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9TYWZhcmlcXC8oXFxkKikvKSlbMV0gPCA2MDQpIHtcbiAgICBkYi5faGFzR2V0QWxsID0gZmFsc2U7XG4gIH1cbn1cbmZ1bmN0aW9uIHBhcnNlSW5kZXhTeW50YXgocHJpbUtleUFuZEluZGV4ZXMpIHtcbiAgcmV0dXJuIHByaW1LZXlBbmRJbmRleGVzLnNwbGl0KFwiLFwiKS5tYXAoZnVuY3Rpb24oaW5kZXgsIGluZGV4TnVtKSB7XG4gICAgaW5kZXggPSBpbmRleC50cmltKCk7XG4gICAgdmFyIG5hbWUgPSBpbmRleC5yZXBsYWNlKC8oWyYqXXxcXCtcXCspL2csIFwiXCIpO1xuICAgIHZhciBrZXlQYXRoID0gL15cXFsvLnRlc3QobmFtZSkgPyBuYW1lLm1hdGNoKC9eXFxbKC4qKVxcXSQvKVsxXS5zcGxpdChcIitcIikgOiBuYW1lO1xuICAgIHJldHVybiBjcmVhdGVJbmRleFNwZWMobmFtZSwga2V5UGF0aCB8fCBudWxsLCAvXFwmLy50ZXN0KGluZGV4KSwgL1xcKi8udGVzdChpbmRleCksIC9cXCtcXCsvLnRlc3QoaW5kZXgpLCBpc0FycmF5KGtleVBhdGgpLCBpbmRleE51bSA9PT0gMCk7XG4gIH0pO1xufVxudmFyIFZlcnNpb24gPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVmVyc2lvbjIoKSB7XG4gIH1cbiAgVmVyc2lvbjIucHJvdG90eXBlLl9wYXJzZVN0b3Jlc1NwZWMgPSBmdW5jdGlvbihzdG9yZXMsIG91dFNjaGVtYSkge1xuICAgIGtleXMoc3RvcmVzKS5mb3JFYWNoKGZ1bmN0aW9uKHRhYmxlTmFtZSkge1xuICAgICAgaWYgKHN0b3Jlc1t0YWJsZU5hbWVdICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBpbmRleGVzID0gcGFyc2VJbmRleFN5bnRheChzdG9yZXNbdGFibGVOYW1lXSk7XG4gICAgICAgIHZhciBwcmltS2V5ID0gaW5kZXhlcy5zaGlmdCgpO1xuICAgICAgICBpZiAocHJpbUtleS5tdWx0aSlcbiAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5TY2hlbWEoXCJQcmltYXJ5IGtleSBjYW5ub3QgYmUgbXVsdGktdmFsdWVkXCIpO1xuICAgICAgICBpbmRleGVzLmZvckVhY2goZnVuY3Rpb24oaWR4KSB7XG4gICAgICAgICAgaWYgKGlkeC5hdXRvKVxuICAgICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU2NoZW1hKFwiT25seSBwcmltYXJ5IGtleSBjYW4gYmUgbWFya2VkIGFzIGF1dG9JbmNyZW1lbnQgKCsrKVwiKTtcbiAgICAgICAgICBpZiAoIWlkeC5rZXlQYXRoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU2NoZW1hKFwiSW5kZXggbXVzdCBoYXZlIGEgbmFtZSBhbmQgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG91dFNjaGVtYVt0YWJsZU5hbWVdID0gY3JlYXRlVGFibGVTY2hlbWEodGFibGVOYW1lLCBwcmltS2V5LCBpbmRleGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgVmVyc2lvbjIucHJvdG90eXBlLnN0b3JlcyA9IGZ1bmN0aW9uKHN0b3Jlcykge1xuICAgIHZhciBkYiA9IHRoaXMuZGI7XG4gICAgdGhpcy5fY2ZnLnN0b3Jlc1NvdXJjZSA9IHRoaXMuX2NmZy5zdG9yZXNTb3VyY2UgPyBleHRlbmQodGhpcy5fY2ZnLnN0b3Jlc1NvdXJjZSwgc3RvcmVzKSA6IHN0b3JlcztcbiAgICB2YXIgdmVyc2lvbnMgPSBkYi5fdmVyc2lvbnM7XG4gICAgdmFyIHN0b3Jlc1NwZWMgPSB7fTtcbiAgICB2YXIgZGJzY2hlbWEgPSB7fTtcbiAgICB2ZXJzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICAgIGV4dGVuZChzdG9yZXNTcGVjLCB2ZXJzaW9uLl9jZmcuc3RvcmVzU291cmNlKTtcbiAgICAgIGRic2NoZW1hID0gdmVyc2lvbi5fY2ZnLmRic2NoZW1hID0ge307XG4gICAgICB2ZXJzaW9uLl9wYXJzZVN0b3Jlc1NwZWMoc3RvcmVzU3BlYywgZGJzY2hlbWEpO1xuICAgIH0pO1xuICAgIGRiLl9kYlNjaGVtYSA9IGRic2NoZW1hO1xuICAgIHJlbW92ZVRhYmxlc0FwaShkYiwgW2RiLl9hbGxUYWJsZXMsIGRiLCBkYi5UcmFuc2FjdGlvbi5wcm90b3R5cGVdKTtcbiAgICBzZXRBcGlPblBsYWNlKGRiLCBbZGIuX2FsbFRhYmxlcywgZGIsIGRiLlRyYW5zYWN0aW9uLnByb3RvdHlwZSwgdGhpcy5fY2ZnLnRhYmxlc10sIGtleXMoZGJzY2hlbWEpLCBkYnNjaGVtYSk7XG4gICAgZGIuX3N0b3JlTmFtZXMgPSBrZXlzKGRic2NoZW1hKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgVmVyc2lvbjIucHJvdG90eXBlLnVwZ3JhZGUgPSBmdW5jdGlvbih1cGdyYWRlRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9jZmcuY29udGVudFVwZ3JhZGUgPSB1cGdyYWRlRnVuY3Rpb247XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJldHVybiBWZXJzaW9uMjtcbn0oKTtcbmZ1bmN0aW9uIGNyZWF0ZVZlcnNpb25Db25zdHJ1Y3RvcihkYikge1xuICByZXR1cm4gbWFrZUNsYXNzQ29uc3RydWN0b3IoVmVyc2lvbi5wcm90b3R5cGUsIGZ1bmN0aW9uIFZlcnNpb24yKHZlcnNpb25OdW1iZXIpIHtcbiAgICB0aGlzLmRiID0gZGI7XG4gICAgdGhpcy5fY2ZnID0ge1xuICAgICAgdmVyc2lvbjogdmVyc2lvbk51bWJlcixcbiAgICAgIHN0b3Jlc1NvdXJjZTogbnVsbCxcbiAgICAgIGRic2NoZW1hOiB7fSxcbiAgICAgIHRhYmxlczoge30sXG4gICAgICBjb250ZW50VXBncmFkZTogbnVsbFxuICAgIH07XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0RGJOYW1lc1RhYmxlKGluZGV4ZWREQiwgSURCS2V5UmFuZ2UpIHtcbiAgdmFyIGRiTmFtZXNEQiA9IGluZGV4ZWREQltcIl9kYk5hbWVzREJcIl07XG4gIGlmICghZGJOYW1lc0RCKSB7XG4gICAgZGJOYW1lc0RCID0gaW5kZXhlZERCW1wiX2RiTmFtZXNEQlwiXSA9IG5ldyBEZXhpZSQxKERCTkFNRVNfREIsIHtcbiAgICAgIGFkZG9uczogW10sXG4gICAgICBpbmRleGVkREIsXG4gICAgICBJREJLZXlSYW5nZVxuICAgIH0pO1xuICAgIGRiTmFtZXNEQi52ZXJzaW9uKDEpLnN0b3Jlcyh7ZGJuYW1lczogXCJuYW1lXCJ9KTtcbiAgfVxuICByZXR1cm4gZGJOYW1lc0RCLnRhYmxlKFwiZGJuYW1lc1wiKTtcbn1cbmZ1bmN0aW9uIGhhc0RhdGFiYXNlc05hdGl2ZShpbmRleGVkREIpIHtcbiAgcmV0dXJuIGluZGV4ZWREQiAmJiB0eXBlb2YgaW5kZXhlZERCLmRhdGFiYXNlcyA9PT0gXCJmdW5jdGlvblwiO1xufVxuZnVuY3Rpb24gZ2V0RGF0YWJhc2VOYW1lcyhfYTIpIHtcbiAgdmFyIGluZGV4ZWREQiA9IF9hMi5pbmRleGVkREIsIElEQktleVJhbmdlID0gX2EyLklEQktleVJhbmdlO1xuICByZXR1cm4gaGFzRGF0YWJhc2VzTmF0aXZlKGluZGV4ZWREQikgPyBQcm9taXNlLnJlc29sdmUoaW5kZXhlZERCLmRhdGFiYXNlcygpKS50aGVuKGZ1bmN0aW9uKGluZm9zKSB7XG4gICAgcmV0dXJuIGluZm9zLm1hcChmdW5jdGlvbihpbmZvKSB7XG4gICAgICByZXR1cm4gaW5mby5uYW1lO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZSAhPT0gREJOQU1FU19EQjtcbiAgICB9KTtcbiAgfSkgOiBnZXREYk5hbWVzVGFibGUoaW5kZXhlZERCLCBJREJLZXlSYW5nZSkudG9Db2xsZWN0aW9uKCkucHJpbWFyeUtleXMoKTtcbn1cbmZ1bmN0aW9uIF9vbkRhdGFiYXNlQ3JlYXRlZChfYTIsIG5hbWUpIHtcbiAgdmFyIGluZGV4ZWREQiA9IF9hMi5pbmRleGVkREIsIElEQktleVJhbmdlID0gX2EyLklEQktleVJhbmdlO1xuICAhaGFzRGF0YWJhc2VzTmF0aXZlKGluZGV4ZWREQikgJiYgbmFtZSAhPT0gREJOQU1FU19EQiAmJiBnZXREYk5hbWVzVGFibGUoaW5kZXhlZERCLCBJREJLZXlSYW5nZSkucHV0KHtuYW1lfSkuY2F0Y2gobm9wKTtcbn1cbmZ1bmN0aW9uIF9vbkRhdGFiYXNlRGVsZXRlZChfYTIsIG5hbWUpIHtcbiAgdmFyIGluZGV4ZWREQiA9IF9hMi5pbmRleGVkREIsIElEQktleVJhbmdlID0gX2EyLklEQktleVJhbmdlO1xuICAhaGFzRGF0YWJhc2VzTmF0aXZlKGluZGV4ZWREQikgJiYgbmFtZSAhPT0gREJOQU1FU19EQiAmJiBnZXREYk5hbWVzVGFibGUoaW5kZXhlZERCLCBJREJLZXlSYW5nZSkuZGVsZXRlKG5hbWUpLmNhdGNoKG5vcCk7XG59XG5mdW5jdGlvbiB2aXAoZm4pIHtcbiAgcmV0dXJuIG5ld1Njb3BlKGZ1bmN0aW9uKCkge1xuICAgIFBTRC5sZXRUaHJvdWdoID0gdHJ1ZTtcbiAgICByZXR1cm4gZm4oKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBkZXhpZU9wZW4oZGIpIHtcbiAgdmFyIHN0YXRlID0gZGIuX3N0YXRlO1xuICB2YXIgaW5kZXhlZERCID0gZGIuX2RlcHMuaW5kZXhlZERCO1xuICBpZiAoc3RhdGUuaXNCZWluZ09wZW5lZCB8fCBkYi5pZGJkYilcbiAgICByZXR1cm4gc3RhdGUuZGJSZWFkeVByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzdGF0ZS5kYk9wZW5FcnJvciA/IHJlamVjdGlvbihzdGF0ZS5kYk9wZW5FcnJvcikgOiBkYjtcbiAgICB9KTtcbiAgZGVidWcgJiYgKHN0YXRlLm9wZW5DYW5jZWxsZXIuX3N0YWNrSG9sZGVyID0gZ2V0RXJyb3JXaXRoU3RhY2soKSk7XG4gIHN0YXRlLmlzQmVpbmdPcGVuZWQgPSB0cnVlO1xuICBzdGF0ZS5kYk9wZW5FcnJvciA9IG51bGw7XG4gIHN0YXRlLm9wZW5Db21wbGV0ZSA9IGZhbHNlO1xuICB2YXIgcmVzb2x2ZURiUmVhZHkgPSBzdGF0ZS5kYlJlYWR5UmVzb2x2ZSwgdXBncmFkZVRyYW5zYWN0aW9uID0gbnVsbCwgd2FzQ3JlYXRlZCA9IGZhbHNlO1xuICByZXR1cm4gRGV4aWVQcm9taXNlLnJhY2UoW3N0YXRlLm9wZW5DYW5jZWxsZXIsIG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaWYgKCFpbmRleGVkREIpXG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5NaXNzaW5nQVBJKCk7XG4gICAgdmFyIGRiTmFtZSA9IGRiLm5hbWU7XG4gICAgdmFyIHJlcSA9IHN0YXRlLmF1dG9TY2hlbWEgPyBpbmRleGVkREIub3BlbihkYk5hbWUpIDogaW5kZXhlZERCLm9wZW4oZGJOYW1lLCBNYXRoLnJvdW5kKGRiLnZlcm5vICogMTApKTtcbiAgICBpZiAoIXJlcSlcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLk1pc3NpbmdBUEkoKTtcbiAgICByZXEub25lcnJvciA9IGV2ZW50UmVqZWN0SGFuZGxlcihyZWplY3QpO1xuICAgIHJlcS5vbmJsb2NrZWQgPSB3cmFwKGRiLl9maXJlT25CbG9ja2VkKTtcbiAgICByZXEub251cGdyYWRlbmVlZGVkID0gd3JhcChmdW5jdGlvbihlKSB7XG4gICAgICB1cGdyYWRlVHJhbnNhY3Rpb24gPSByZXEudHJhbnNhY3Rpb247XG4gICAgICBpZiAoc3RhdGUuYXV0b1NjaGVtYSAmJiAhZGIuX29wdGlvbnMuYWxsb3dFbXB0eURCKSB7XG4gICAgICAgIHJlcS5vbmVycm9yID0gcHJldmVudERlZmF1bHQ7XG4gICAgICAgIHVwZ3JhZGVUcmFuc2FjdGlvbi5hYm9ydCgpO1xuICAgICAgICByZXEucmVzdWx0LmNsb3NlKCk7XG4gICAgICAgIHZhciBkZWxyZXEgPSBpbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoZGJOYW1lKTtcbiAgICAgICAgZGVscmVxLm9uc3VjY2VzcyA9IGRlbHJlcS5vbmVycm9yID0gd3JhcChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZWplY3QobmV3IGV4Y2VwdGlvbnMuTm9TdWNoRGF0YWJhc2UoXCJEYXRhYmFzZSBcIiArIGRiTmFtZSArIFwiIGRvZXNudCBleGlzdFwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBncmFkZVRyYW5zYWN0aW9uLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgdmFyIG9sZFZlciA9IGUub2xkVmVyc2lvbiA+IE1hdGgucG93KDIsIDYyKSA/IDAgOiBlLm9sZFZlcnNpb247XG4gICAgICAgIHdhc0NyZWF0ZWQgPSBvbGRWZXIgPCAxO1xuICAgICAgICBkYi5pZGJkYiA9IHJlcS5yZXN1bHQ7XG4gICAgICAgIHJ1blVwZ3JhZGVycyhkYiwgb2xkVmVyIC8gMTAsIHVwZ3JhZGVUcmFuc2FjdGlvbiwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9LCByZWplY3QpO1xuICAgIHJlcS5vbnN1Y2Nlc3MgPSB3cmFwKGZ1bmN0aW9uKCkge1xuICAgICAgdXBncmFkZVRyYW5zYWN0aW9uID0gbnVsbDtcbiAgICAgIHZhciBpZGJkYiA9IGRiLmlkYmRiID0gcmVxLnJlc3VsdDtcbiAgICAgIHZhciBvYmplY3RTdG9yZU5hbWVzID0gc2xpY2UoaWRiZGIub2JqZWN0U3RvcmVOYW1lcyk7XG4gICAgICBpZiAob2JqZWN0U3RvcmVOYW1lcy5sZW5ndGggPiAwKVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciB0bXBUcmFucyA9IGlkYmRiLnRyYW5zYWN0aW9uKHNhZmFyaU11bHRpU3RvcmVGaXgob2JqZWN0U3RvcmVOYW1lcyksIFwicmVhZG9ubHlcIik7XG4gICAgICAgICAgaWYgKHN0YXRlLmF1dG9TY2hlbWEpXG4gICAgICAgICAgICByZWFkR2xvYmFsU2NoZW1hKGRiLCBpZGJkYiwgdG1wVHJhbnMpO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWRqdXN0VG9FeGlzdGluZ0luZGV4TmFtZXMoZGIsIGRiLl9kYlNjaGVtYSwgdG1wVHJhbnMpO1xuICAgICAgICAgICAgaWYgKCF2ZXJpZnlJbnN0YWxsZWRTY2hlbWEoZGIsIHRtcFRyYW5zKSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEZXhpZSBTY2hlbWFEaWZmOiBTY2hlbWEgd2FzIGV4dGVuZGVkIHdpdGhvdXQgaW5jcmVhc2luZyB0aGUgbnVtYmVyIHBhc3NlZCB0byBkYi52ZXJzaW9uKCkuIFNvbWUgcXVlcmllcyBtYXkgZmFpbC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGdlbmVyYXRlTWlkZGxld2FyZVN0YWNrcyhkYiwgdG1wVHJhbnMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgIGNvbm5lY3Rpb25zLnB1c2goZGIpO1xuICAgICAgaWRiZGIub252ZXJzaW9uY2hhbmdlID0gd3JhcChmdW5jdGlvbihldikge1xuICAgICAgICBzdGF0ZS52Y0ZpcmVkID0gdHJ1ZTtcbiAgICAgICAgZGIub24oXCJ2ZXJzaW9uY2hhbmdlXCIpLmZpcmUoZXYpO1xuICAgICAgfSk7XG4gICAgICBpZGJkYi5vbmNsb3NlID0gd3JhcChmdW5jdGlvbihldikge1xuICAgICAgICBkYi5vbihcImNsb3NlXCIpLmZpcmUoZXYpO1xuICAgICAgfSk7XG4gICAgICBpZiAod2FzQ3JlYXRlZClcbiAgICAgICAgX29uRGF0YWJhc2VDcmVhdGVkKGRiLl9kZXBzLCBkYk5hbWUpO1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0sIHJlamVjdCk7XG4gIH0pXSkudGhlbihmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5vblJlYWR5QmVpbmdGaXJlZCA9IFtdO1xuICAgIHJldHVybiBEZXhpZVByb21pc2UucmVzb2x2ZSh2aXAoZGIub24ucmVhZHkuZmlyZSkpLnRoZW4oZnVuY3Rpb24gZmlyZVJlbWFpbmRlcnMoKSB7XG4gICAgICBpZiAoc3RhdGUub25SZWFkeUJlaW5nRmlyZWQubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgcmVtYWluZGVycyA9IHN0YXRlLm9uUmVhZHlCZWluZ0ZpcmVkLnJlZHVjZShwcm9taXNhYmxlQ2hhaW4sIG5vcCk7XG4gICAgICAgIHN0YXRlLm9uUmVhZHlCZWluZ0ZpcmVkID0gW107XG4gICAgICAgIHJldHVybiBEZXhpZVByb21pc2UucmVzb2x2ZSh2aXAocmVtYWluZGVycykpLnRoZW4oZmlyZVJlbWFpbmRlcnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlLm9uUmVhZHlCZWluZ0ZpcmVkID0gbnVsbDtcbiAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICBzdGF0ZS5pc0JlaW5nT3BlbmVkID0gZmFsc2U7XG4gICAgcmV0dXJuIGRiO1xuICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICB0cnkge1xuICAgICAgdXBncmFkZVRyYW5zYWN0aW9uICYmIHVwZ3JhZGVUcmFuc2FjdGlvbi5hYm9ydCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG4gICAgc3RhdGUuaXNCZWluZ09wZW5lZCA9IGZhbHNlO1xuICAgIGRiLmNsb3NlKCk7XG4gICAgc3RhdGUuZGJPcGVuRXJyb3IgPSBlcnI7XG4gICAgcmV0dXJuIHJlamVjdGlvbihzdGF0ZS5kYk9wZW5FcnJvcik7XG4gIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgc3RhdGUub3BlbkNvbXBsZXRlID0gdHJ1ZTtcbiAgICByZXNvbHZlRGJSZWFkeSgpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGF3YWl0SXRlcmF0b3IoaXRlcmF0b3IpIHtcbiAgdmFyIGNhbGxOZXh0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yLm5leHQocmVzdWx0KTtcbiAgfSwgZG9UaHJvdyA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yLnRocm93KGVycm9yKTtcbiAgfSwgb25TdWNjZXNzID0gc3RlcChjYWxsTmV4dCksIG9uRXJyb3IgPSBzdGVwKGRvVGhyb3cpO1xuICBmdW5jdGlvbiBzdGVwKGdldE5leHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgbmV4dCA9IGdldE5leHQodmFsKSwgdmFsdWUgPSBuZXh0LnZhbHVlO1xuICAgICAgcmV0dXJuIG5leHQuZG9uZSA/IHZhbHVlIDogIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZS50aGVuICE9PSBcImZ1bmN0aW9uXCIgPyBpc0FycmF5KHZhbHVlKSA/IFByb21pc2UuYWxsKHZhbHVlKS50aGVuKG9uU3VjY2Vzcywgb25FcnJvcikgOiBvblN1Y2Nlc3ModmFsdWUpIDogdmFsdWUudGhlbihvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHN0ZXAoY2FsbE5leHQpKCk7XG59XG5mdW5jdGlvbiBleHRyYWN0VHJhbnNhY3Rpb25BcmdzKG1vZGUsIF90YWJsZUFyZ3NfLCBzY29wZUZ1bmMpIHtcbiAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAoaSA8IDIpXG4gICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZEFyZ3VtZW50KFwiVG9vIGZldyBhcmd1bWVudHNcIik7XG4gIHZhciBhcmdzID0gbmV3IEFycmF5KGkgLSAxKTtcbiAgd2hpbGUgKC0taSlcbiAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgc2NvcGVGdW5jID0gYXJncy5wb3AoKTtcbiAgdmFyIHRhYmxlcyA9IGZsYXR0ZW4oYXJncyk7XG4gIHJldHVybiBbbW9kZSwgdGFibGVzLCBzY29wZUZ1bmNdO1xufVxuZnVuY3Rpb24gZW50ZXJUcmFuc2FjdGlvblNjb3BlKGRiLCBtb2RlLCBzdG9yZU5hbWVzLCBwYXJlbnRUcmFuc2FjdGlvbiwgc2NvcGVGdW5jKSB7XG4gIHJldHVybiBEZXhpZVByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYW5zbGVzcyA9IFBTRC50cmFuc2xlc3MgfHwgUFNEO1xuICAgIHZhciB0cmFucyA9IGRiLl9jcmVhdGVUcmFuc2FjdGlvbihtb2RlLCBzdG9yZU5hbWVzLCBkYi5fZGJTY2hlbWEsIHBhcmVudFRyYW5zYWN0aW9uKTtcbiAgICB2YXIgem9uZVByb3BzID0ge1xuICAgICAgdHJhbnMsXG4gICAgICB0cmFuc2xlc3NcbiAgICB9O1xuICAgIGlmIChwYXJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgdHJhbnMuaWRidHJhbnMgPSBwYXJlbnRUcmFuc2FjdGlvbi5pZGJ0cmFucztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnMuY3JlYXRlKCk7XG4gICAgfVxuICAgIHZhciBzY29wZUZ1bmNJc0FzeW5jID0gaXNBc3luY0Z1bmN0aW9uKHNjb3BlRnVuYyk7XG4gICAgaWYgKHNjb3BlRnVuY0lzQXN5bmMpIHtcbiAgICAgIGluY3JlbWVudEV4cGVjdGVkQXdhaXRzKCk7XG4gICAgfVxuICAgIHZhciByZXR1cm5WYWx1ZTtcbiAgICB2YXIgcHJvbWlzZUZvbGxvd2VkID0gRGV4aWVQcm9taXNlLmZvbGxvdyhmdW5jdGlvbigpIHtcbiAgICAgIHJldHVyblZhbHVlID0gc2NvcGVGdW5jLmNhbGwodHJhbnMsIHRyYW5zKTtcbiAgICAgIGlmIChyZXR1cm5WYWx1ZSkge1xuICAgICAgICBpZiAoc2NvcGVGdW5jSXNBc3luYykge1xuICAgICAgICAgIHZhciBkZWNyZW1lbnRvciA9IGRlY3JlbWVudEV4cGVjdGVkQXdhaXRzLmJpbmQobnVsbCwgbnVsbCk7XG4gICAgICAgICAgcmV0dXJuVmFsdWUudGhlbihkZWNyZW1lbnRvciwgZGVjcmVtZW50b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXR1cm5WYWx1ZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHJldHVyblZhbHVlLnRocm93ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGF3YWl0SXRlcmF0b3IocmV0dXJuVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgem9uZVByb3BzKTtcbiAgICByZXR1cm4gKHJldHVyblZhbHVlICYmIHR5cGVvZiByZXR1cm5WYWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCIgPyBEZXhpZVByb21pc2UucmVzb2x2ZShyZXR1cm5WYWx1ZSkudGhlbihmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHJhbnMuYWN0aXZlID8geCA6IHJlamVjdGlvbihuZXcgZXhjZXB0aW9ucy5QcmVtYXR1cmVDb21taXQoXCJUcmFuc2FjdGlvbiBjb21taXR0ZWQgdG9vIGVhcmx5LiBTZWUgaHR0cDovL2JpdC5seS8ya2Rja01uXCIpKTtcbiAgICB9KSA6IHByb21pc2VGb2xsb3dlZC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH0pKS50aGVuKGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmIChwYXJlbnRUcmFuc2FjdGlvbilcbiAgICAgICAgdHJhbnMuX3Jlc29sdmUoKTtcbiAgICAgIHJldHVybiB0cmFucy5fY29tcGxldGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHRyYW5zLl9yZWplY3QoZSk7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKGUpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHBhZChhLCB2YWx1ZSwgY291bnQpIHtcbiAgdmFyIHJlc3VsdCA9IGlzQXJyYXkoYSkgPyBhLnNsaWNlKCkgOiBbYV07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7ICsraSlcbiAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjcmVhdGVWaXJ0dWFsSW5kZXhNaWRkbGV3YXJlKGRvd24pIHtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBkb3duKSwge3RhYmxlOiBmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICB2YXIgdGFibGUgPSBkb3duLnRhYmxlKHRhYmxlTmFtZSk7XG4gICAgdmFyIHNjaGVtYSA9IHRhYmxlLnNjaGVtYTtcbiAgICB2YXIgaW5kZXhMb29rdXAgPSB7fTtcbiAgICB2YXIgYWxsVmlydHVhbEluZGV4ZXMgPSBbXTtcbiAgICBmdW5jdGlvbiBhZGRWaXJ0dWFsSW5kZXhlcyhrZXlQYXRoLCBrZXlUYWlsLCBsb3dMZXZlbEluZGV4KSB7XG4gICAgICB2YXIga2V5UGF0aEFsaWFzID0gZ2V0S2V5UGF0aEFsaWFzKGtleVBhdGgpO1xuICAgICAgdmFyIGluZGV4TGlzdCA9IGluZGV4TG9va3VwW2tleVBhdGhBbGlhc10gPSBpbmRleExvb2t1cFtrZXlQYXRoQWxpYXNdIHx8IFtdO1xuICAgICAgdmFyIGtleUxlbmd0aCA9IGtleVBhdGggPT0gbnVsbCA/IDAgOiB0eXBlb2Yga2V5UGF0aCA9PT0gXCJzdHJpbmdcIiA/IDEgOiBrZXlQYXRoLmxlbmd0aDtcbiAgICAgIHZhciBpc1ZpcnR1YWwgPSBrZXlUYWlsID4gMDtcbiAgICAgIHZhciB2aXJ0dWFsSW5kZXggPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgbG93TGV2ZWxJbmRleCksIHtcbiAgICAgICAgaXNWaXJ0dWFsLFxuICAgICAgICBpc1ByaW1hcnlLZXk6ICFpc1ZpcnR1YWwgJiYgbG93TGV2ZWxJbmRleC5pc1ByaW1hcnlLZXksXG4gICAgICAgIGtleVRhaWwsXG4gICAgICAgIGtleUxlbmd0aCxcbiAgICAgICAgZXh0cmFjdEtleTogZ2V0S2V5RXh0cmFjdG9yKGtleVBhdGgpLFxuICAgICAgICB1bmlxdWU6ICFpc1ZpcnR1YWwgJiYgbG93TGV2ZWxJbmRleC51bmlxdWVcbiAgICAgIH0pO1xuICAgICAgaW5kZXhMaXN0LnB1c2godmlydHVhbEluZGV4KTtcbiAgICAgIGlmICghdmlydHVhbEluZGV4LmlzUHJpbWFyeUtleSkge1xuICAgICAgICBhbGxWaXJ0dWFsSW5kZXhlcy5wdXNoKHZpcnR1YWxJbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5TGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgdmlydHVhbEtleVBhdGggPSBrZXlMZW5ndGggPT09IDIgPyBrZXlQYXRoWzBdIDoga2V5UGF0aC5zbGljZSgwLCBrZXlMZW5ndGggLSAxKTtcbiAgICAgICAgYWRkVmlydHVhbEluZGV4ZXModmlydHVhbEtleVBhdGgsIGtleVRhaWwgKyAxLCBsb3dMZXZlbEluZGV4KTtcbiAgICAgIH1cbiAgICAgIGluZGV4TGlzdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEua2V5VGFpbCAtIGIua2V5VGFpbDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZpcnR1YWxJbmRleDtcbiAgICB9XG4gICAgdmFyIHByaW1hcnlLZXkgPSBhZGRWaXJ0dWFsSW5kZXhlcyhzY2hlbWEucHJpbWFyeUtleS5rZXlQYXRoLCAwLCBzY2hlbWEucHJpbWFyeUtleSk7XG4gICAgaW5kZXhMb29rdXBbXCI6aWRcIl0gPSBbcHJpbWFyeUtleV07XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYTIgPSBzY2hlbWEuaW5kZXhlczsgX2kgPCBfYTIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgaW5kZXggPSBfYTJbX2ldO1xuICAgICAgYWRkVmlydHVhbEluZGV4ZXMoaW5kZXgua2V5UGF0aCwgMCwgaW5kZXgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmaW5kQmVzdEluZGV4KGtleVBhdGgpIHtcbiAgICAgIHZhciByZXN1bHQyID0gaW5kZXhMb29rdXBbZ2V0S2V5UGF0aEFsaWFzKGtleVBhdGgpXTtcbiAgICAgIHJldHVybiByZXN1bHQyICYmIHJlc3VsdDJbMF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZVJhbmdlKHJhbmdlLCBrZXlUYWlsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiByYW5nZS50eXBlID09PSAxID8gMiA6IHJhbmdlLnR5cGUsXG4gICAgICAgIGxvd2VyOiBwYWQocmFuZ2UubG93ZXIsIHJhbmdlLmxvd2VyT3BlbiA/IGRvd24uTUFYX0tFWSA6IGRvd24uTUlOX0tFWSwga2V5VGFpbCksXG4gICAgICAgIGxvd2VyT3BlbjogdHJ1ZSxcbiAgICAgICAgdXBwZXI6IHBhZChyYW5nZS51cHBlciwgcmFuZ2UudXBwZXJPcGVuID8gZG93bi5NSU5fS0VZIDogZG93bi5NQVhfS0VZLCBrZXlUYWlsKSxcbiAgICAgICAgdXBwZXJPcGVuOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVSZXF1ZXN0KHJlcSkge1xuICAgICAgdmFyIGluZGV4MiA9IHJlcS5xdWVyeS5pbmRleDtcbiAgICAgIHJldHVybiBpbmRleDIuaXNWaXJ0dWFsID8gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlcSksIHtxdWVyeToge1xuICAgICAgICBpbmRleDogaW5kZXgyLFxuICAgICAgICByYW5nZTogdHJhbnNsYXRlUmFuZ2UocmVxLnF1ZXJ5LnJhbmdlLCBpbmRleDIua2V5VGFpbClcbiAgICAgIH19KSA6IHJlcTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0YWJsZSksIHtcbiAgICAgIHNjaGVtYTogX19hc3NpZ24oX19hc3NpZ24oe30sIHNjaGVtYSksIHtwcmltYXJ5S2V5LCBpbmRleGVzOiBhbGxWaXJ0dWFsSW5kZXhlcywgZ2V0SW5kZXhCeUtleVBhdGg6IGZpbmRCZXN0SW5kZXh9KSxcbiAgICAgIGNvdW50OiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgcmV0dXJuIHRhYmxlLmNvdW50KHRyYW5zbGF0ZVJlcXVlc3QocmVxKSk7XG4gICAgICB9LFxuICAgICAgcXVlcnk6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICByZXR1cm4gdGFibGUucXVlcnkodHJhbnNsYXRlUmVxdWVzdChyZXEpKTtcbiAgICAgIH0sXG4gICAgICBvcGVuQ3Vyc29yOiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIF9hMyA9IHJlcS5xdWVyeS5pbmRleCwga2V5VGFpbCA9IF9hMy5rZXlUYWlsLCBpc1ZpcnR1YWwgPSBfYTMuaXNWaXJ0dWFsLCBrZXlMZW5ndGggPSBfYTMua2V5TGVuZ3RoO1xuICAgICAgICBpZiAoIWlzVmlydHVhbClcbiAgICAgICAgICByZXR1cm4gdGFibGUub3BlbkN1cnNvcihyZXEpO1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGVWaXJ0dWFsQ3Vyc29yKGN1cnNvcikge1xuICAgICAgICAgIGZ1bmN0aW9uIF9jb250aW51ZShrZXkpIHtcbiAgICAgICAgICAgIGtleSAhPSBudWxsID8gY3Vyc29yLmNvbnRpbnVlKHBhZChrZXksIHJlcS5yZXZlcnNlID8gZG93bi5NQVhfS0VZIDogZG93bi5NSU5fS0VZLCBrZXlUYWlsKSkgOiByZXEudW5pcXVlID8gY3Vyc29yLmNvbnRpbnVlKHBhZChjdXJzb3Iua2V5LCByZXEucmV2ZXJzZSA/IGRvd24uTUlOX0tFWSA6IGRvd24uTUFYX0tFWSwga2V5VGFpbCkpIDogY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2aXJ0dWFsQ3Vyc29yID0gT2JqZWN0LmNyZWF0ZShjdXJzb3IsIHtcbiAgICAgICAgICAgIGNvbnRpbnVlOiB7dmFsdWU6IF9jb250aW51ZX0sXG4gICAgICAgICAgICBjb250aW51ZVByaW1hcnlLZXk6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGtleSwgcHJpbWFyeUtleTIpIHtcbiAgICAgICAgICAgICAgICBjdXJzb3IuY29udGludWVQcmltYXJ5S2V5KHBhZChrZXksIGRvd24uTUFYX0tFWSwga2V5VGFpbCksIHByaW1hcnlLZXkyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBjdXJzb3Iua2V5O1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXlMZW5ndGggPT09IDEgPyBrZXlbMF0gOiBrZXkuc2xpY2UoMCwga2V5TGVuZ3RoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvci52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB2aXJ0dWFsQ3Vyc29yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZS5vcGVuQ3Vyc29yKHRyYW5zbGF0ZVJlcXVlc3QocmVxKSkudGhlbihmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgICAgICByZXR1cm4gY3Vyc29yICYmIGNyZWF0ZVZpcnR1YWxDdXJzb3IoY3Vyc29yKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfX0pO1xufVxudmFyIHZpcnR1YWxJbmRleE1pZGRsZXdhcmUgPSB7XG4gIHN0YWNrOiBcImRiY29yZVwiLFxuICBuYW1lOiBcIlZpcnR1YWxJbmRleE1pZGRsZXdhcmVcIixcbiAgbGV2ZWw6IDEsXG4gIGNyZWF0ZTogY3JlYXRlVmlydHVhbEluZGV4TWlkZGxld2FyZVxufTtcbmZ1bmN0aW9uIGdldEVmZmVjdGl2ZUtleXMocHJpbWFyeUtleSwgcmVxKSB7XG4gIGlmIChyZXEudHlwZSA9PT0gXCJkZWxldGVcIilcbiAgICByZXR1cm4gcmVxLmtleXM7XG4gIHJldHVybiByZXEua2V5cyB8fCByZXEudmFsdWVzLm1hcChwcmltYXJ5S2V5LmV4dHJhY3RLZXkpO1xufVxudmFyIGhvb2tzTWlkZGxld2FyZSA9IHtcbiAgc3RhY2s6IFwiZGJjb3JlXCIsXG4gIG5hbWU6IFwiSG9va3NNaWRkbGV3YXJlXCIsXG4gIGxldmVsOiAyLFxuICBjcmVhdGU6IGZ1bmN0aW9uKGRvd25Db3JlKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBkb3duQ29yZSksIHt0YWJsZTogZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgICB2YXIgZG93blRhYmxlID0gZG93bkNvcmUudGFibGUodGFibGVOYW1lKTtcbiAgICAgIHZhciBwcmltYXJ5S2V5ID0gZG93blRhYmxlLnNjaGVtYS5wcmltYXJ5S2V5O1xuICAgICAgdmFyIHRhYmxlTWlkZGxld2FyZSA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkb3duVGFibGUpLCB7bXV0YXRlOiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIGR4VHJhbnMgPSBQU0QudHJhbnM7XG4gICAgICAgIHZhciBfYTIgPSBkeFRyYW5zLnRhYmxlKHRhYmxlTmFtZSkuaG9vaywgZGVsZXRpbmcgPSBfYTIuZGVsZXRpbmcsIGNyZWF0aW5nID0gX2EyLmNyZWF0aW5nLCB1cGRhdGluZyA9IF9hMi51cGRhdGluZztcbiAgICAgICAgc3dpdGNoIChyZXEudHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgICAgIGlmIChjcmVhdGluZy5maXJlID09PSBub3ApXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgcmV0dXJuIGR4VHJhbnMuX3Byb21pc2UoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhZGRQdXRPckRlbGV0ZShyZXEpO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgY2FzZSBcInB1dFwiOlxuICAgICAgICAgICAgaWYgKGNyZWF0aW5nLmZpcmUgPT09IG5vcCAmJiB1cGRhdGluZy5maXJlID09PSBub3ApXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgcmV0dXJuIGR4VHJhbnMuX3Byb21pc2UoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhZGRQdXRPckRlbGV0ZShyZXEpO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgY2FzZSBcImRlbGV0ZVwiOlxuICAgICAgICAgICAgaWYgKGRlbGV0aW5nLmZpcmUgPT09IG5vcClcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICByZXR1cm4gZHhUcmFucy5fcHJvbWlzZShcInJlYWR3cml0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFkZFB1dE9yRGVsZXRlKHJlcSk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICBjYXNlIFwiZGVsZXRlUmFuZ2VcIjpcbiAgICAgICAgICAgIGlmIChkZWxldGluZy5maXJlID09PSBub3ApXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgcmV0dXJuIGR4VHJhbnMuX3Byb21pc2UoXCJyZWFkd3JpdGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkZWxldGVSYW5nZShyZXEpO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvd25UYWJsZS5tdXRhdGUocmVxKTtcbiAgICAgICAgZnVuY3Rpb24gYWRkUHV0T3JEZWxldGUocmVxMikge1xuICAgICAgICAgIHZhciBkeFRyYW5zMiA9IFBTRC50cmFucztcbiAgICAgICAgICB2YXIga2V5czIgPSByZXEyLmtleXMgfHwgZ2V0RWZmZWN0aXZlS2V5cyhwcmltYXJ5S2V5LCByZXEyKTtcbiAgICAgICAgICBpZiAoIWtleXMyKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiS2V5cyBtaXNzaW5nXCIpO1xuICAgICAgICAgIHJlcTIgPSByZXEyLnR5cGUgPT09IFwiYWRkXCIgfHwgcmVxMi50eXBlID09PSBcInB1dFwiID8gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlcTIpLCB7a2V5czoga2V5czJ9KSA6IF9fYXNzaWduKHt9LCByZXEyKTtcbiAgICAgICAgICBpZiAocmVxMi50eXBlICE9PSBcImRlbGV0ZVwiKVxuICAgICAgICAgICAgcmVxMi52YWx1ZXMgPSBfX3NwcmVhZEFycmF5KFtdLCByZXEyLnZhbHVlcyk7XG4gICAgICAgICAgaWYgKHJlcTIua2V5cylcbiAgICAgICAgICAgIHJlcTIua2V5cyA9IF9fc3ByZWFkQXJyYXkoW10sIHJlcTIua2V5cyk7XG4gICAgICAgICAgcmV0dXJuIGdldEV4aXN0aW5nVmFsdWVzKGRvd25UYWJsZSwgcmVxMiwga2V5czIpLnRoZW4oZnVuY3Rpb24oZXhpc3RpbmdWYWx1ZXMpIHtcbiAgICAgICAgICAgIHZhciBjb250ZXh0cyA9IGtleXMyLm1hcChmdW5jdGlvbihrZXksIGkpIHtcbiAgICAgICAgICAgICAgdmFyIGV4aXN0aW5nVmFsdWUgPSBleGlzdGluZ1ZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgdmFyIGN0eCA9IHtvbmVycm9yOiBudWxsLCBvbnN1Y2Nlc3M6IG51bGx9O1xuICAgICAgICAgICAgICBpZiAocmVxMi50eXBlID09PSBcImRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRpbmcuZmlyZS5jYWxsKGN0eCwga2V5LCBleGlzdGluZ1ZhbHVlLCBkeFRyYW5zMik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVxMi50eXBlID09PSBcImFkZFwiIHx8IGV4aXN0aW5nVmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIHZhciBnZW5lcmF0ZWRQcmltYXJ5S2V5ID0gY3JlYXRpbmcuZmlyZS5jYWxsKGN0eCwga2V5LCByZXEyLnZhbHVlc1tpXSwgZHhUcmFuczIpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gbnVsbCAmJiBnZW5lcmF0ZWRQcmltYXJ5S2V5ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGtleSA9IGdlbmVyYXRlZFByaW1hcnlLZXk7XG4gICAgICAgICAgICAgICAgICByZXEyLmtleXNbaV0gPSBrZXk7XG4gICAgICAgICAgICAgICAgICBpZiAoIXByaW1hcnlLZXkub3V0Ym91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QnlLZXlQYXRoKHJlcTIudmFsdWVzW2ldLCBwcmltYXJ5S2V5LmtleVBhdGgsIGtleSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBvYmplY3REaWZmID0gZ2V0T2JqZWN0RGlmZihleGlzdGluZ1ZhbHVlLCByZXEyLnZhbHVlc1tpXSk7XG4gICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxDaGFuZ2VzXzEgPSB1cGRhdGluZy5maXJlLmNhbGwoY3R4LCBvYmplY3REaWZmLCBrZXksIGV4aXN0aW5nVmFsdWUsIGR4VHJhbnMyKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRkaXRpb25hbENoYW5nZXNfMSkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3RlZFZhbHVlXzEgPSByZXEyLnZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGFkZGl0aW9uYWxDaGFuZ2VzXzEpLmZvckVhY2goZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzT3duKHJlcXVlc3RlZFZhbHVlXzEsIGtleVBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkVmFsdWVfMVtrZXlQYXRoXSA9IGFkZGl0aW9uYWxDaGFuZ2VzXzFba2V5UGF0aF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0QnlLZXlQYXRoKHJlcXVlc3RlZFZhbHVlXzEsIGtleVBhdGgsIGFkZGl0aW9uYWxDaGFuZ2VzXzFba2V5UGF0aF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGN0eDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRvd25UYWJsZS5tdXRhdGUocmVxMikudGhlbihmdW5jdGlvbihfYTMpIHtcbiAgICAgICAgICAgICAgdmFyIGZhaWx1cmVzID0gX2EzLmZhaWx1cmVzLCByZXN1bHRzID0gX2EzLnJlc3VsdHMsIG51bUZhaWx1cmVzID0gX2EzLm51bUZhaWx1cmVzLCBsYXN0UmVzdWx0ID0gX2EzLmxhc3RSZXN1bHQ7XG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5czIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJpbUtleSA9IHJlc3VsdHMgPyByZXN1bHRzW2ldIDoga2V5czJbaV07XG4gICAgICAgICAgICAgICAgdmFyIGN0eCA9IGNvbnRleHRzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChwcmltS2V5ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGN0eC5vbmVycm9yICYmIGN0eC5vbmVycm9yKGZhaWx1cmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY3R4Lm9uc3VjY2VzcyAmJiBjdHgub25zdWNjZXNzKHJlcTIudHlwZSA9PT0gXCJwdXRcIiAmJiBleGlzdGluZ1ZhbHVlc1tpXSA/IHJlcTIudmFsdWVzW2ldIDogcHJpbUtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB7ZmFpbHVyZXMsIHJlc3VsdHMsIG51bUZhaWx1cmVzLCBsYXN0UmVzdWx0fTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRzLmZvckVhY2goZnVuY3Rpb24oY3R4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5vbmVycm9yICYmIGN0eC5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWxldGVSYW5nZShyZXEyKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbGV0ZU5leHRDaHVuayhyZXEyLnRyYW5zLCByZXEyLnJhbmdlLCAxZTQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZU5leHRDaHVuayh0cmFucywgcmFuZ2UsIGxpbWl0KSB7XG4gICAgICAgICAgcmV0dXJuIGRvd25UYWJsZS5xdWVyeSh7dHJhbnMsIHZhbHVlczogZmFsc2UsIHF1ZXJ5OiB7aW5kZXg6IHByaW1hcnlLZXksIHJhbmdlfSwgbGltaXR9KS50aGVuKGZ1bmN0aW9uKF9hMykge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9hMy5yZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gYWRkUHV0T3JEZWxldGUoe3R5cGU6IFwiZGVsZXRlXCIsIGtleXM6IHJlc3VsdCwgdHJhbnN9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICBpZiAocmVzLm51bUZhaWx1cmVzID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmZhaWx1cmVzWzBdKTtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPCBsaW1pdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7ZmFpbHVyZXM6IFtdLCBudW1GYWlsdXJlczogMCwgbGFzdFJlc3VsdDogdm9pZCAwfTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZXRlTmV4dENodW5rKHRyYW5zLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmFuZ2UpLCB7bG93ZXI6IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0sIGxvd2VyT3BlbjogdHJ1ZX0pLCBsaW1pdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9fSk7XG4gICAgICByZXR1cm4gdGFibGVNaWRkbGV3YXJlO1xuICAgIH19KTtcbiAgfVxufTtcbmZ1bmN0aW9uIGdldEV4aXN0aW5nVmFsdWVzKHRhYmxlLCByZXEsIGVmZmVjdGl2ZUtleXMpIHtcbiAgcmV0dXJuIHJlcS50eXBlID09PSBcImFkZFwiID8gUHJvbWlzZS5yZXNvbHZlKFtdKSA6IHRhYmxlLmdldE1hbnkoe3RyYW5zOiByZXEudHJhbnMsIGtleXM6IGVmZmVjdGl2ZUtleXMsIGNhY2hlOiBcImltbXV0YWJsZVwifSk7XG59XG52YXIgX2NtcDtcbmZ1bmN0aW9uIGNtcChhLCBiKSB7XG4gIGlmIChfY21wKVxuICAgIHJldHVybiBfY21wKGEsIGIpO1xuICB2YXIgaW5kZXhlZERCID0gZG9tRGVwcy5pbmRleGVkREI7XG4gIGlmICghaW5kZXhlZERCKVxuICAgIHRocm93IG5ldyBleGNlcHRpb25zLk1pc3NpbmdBUEkoKTtcbiAgX2NtcCA9IGZ1bmN0aW9uKGEyLCBiMikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYTIgPT0gbnVsbCB8fCBiMiA9PSBudWxsID8gTmFOIDogaW5kZXhlZERCLmNtcChhMiwgYjIpO1xuICAgIH0gY2F0Y2ggKF9hMikge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gIH07XG4gIHJldHVybiBfY21wKGEsIGIpO1xufVxuZnVuY3Rpb24gZ2V0RnJvbVRyYW5zYWN0aW9uQ2FjaGUoa2V5czIsIGNhY2hlLCBjbG9uZSkge1xuICB0cnkge1xuICAgIGlmICghY2FjaGUpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBpZiAoY2FjaGUua2V5cy5sZW5ndGggPCBrZXlzMi5sZW5ndGgpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgY2FjaGUua2V5cy5sZW5ndGggJiYgaiA8IGtleXMyLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoY21wKGNhY2hlLmtleXNbaV0sIGtleXMyW2pdKSAhPT0gMClcbiAgICAgICAgY29udGludWU7XG4gICAgICByZXN1bHQucHVzaChjbG9uZSA/IGRlZXBDbG9uZShjYWNoZS52YWx1ZXNbaV0pIDogY2FjaGUudmFsdWVzW2ldKTtcbiAgICAgICsrajtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT09IGtleXMyLmxlbmd0aCA/IHJlc3VsdCA6IG51bGw7XG4gIH0gY2F0Y2ggKF9hMikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG52YXIgY2FjaGVFeGlzdGluZ1ZhbHVlc01pZGRsZXdhcmUgPSB7XG4gIHN0YWNrOiBcImRiY29yZVwiLFxuICBsZXZlbDogLTEsXG4gIGNyZWF0ZTogZnVuY3Rpb24oY29yZSkge1xuICAgIHJldHVybiB7XG4gICAgICB0YWJsZTogZnVuY3Rpb24odGFibGVOYW1lKSB7XG4gICAgICAgIHZhciB0YWJsZSA9IGNvcmUudGFibGUodGFibGVOYW1lKTtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0YWJsZSksIHtnZXRNYW55OiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgICBpZiAoIXJlcS5jYWNoZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlLmdldE1hbnkocmVxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGNhY2hlZFJlc3VsdCA9IGdldEZyb21UcmFuc2FjdGlvbkNhY2hlKHJlcS5rZXlzLCByZXEudHJhbnNbXCJfY2FjaGVcIl0sIHJlcS5jYWNoZSA9PT0gXCJjbG9uZVwiKTtcbiAgICAgICAgICBpZiAoY2FjaGVkUmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gRGV4aWVQcm9taXNlLnJlc29sdmUoY2FjaGVkUmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlLmdldE1hbnkocmVxKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgcmVxLnRyYW5zW1wiX2NhY2hlXCJdID0ge1xuICAgICAgICAgICAgICBrZXlzOiByZXEua2V5cyxcbiAgICAgICAgICAgICAgdmFsdWVzOiByZXEuY2FjaGUgPT09IFwiY2xvbmVcIiA/IGRlZXBDbG9uZShyZXMpIDogcmVzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgbXV0YXRlOiBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgICBpZiAocmVxLnR5cGUgIT09IFwiYWRkXCIpXG4gICAgICAgICAgICByZXEudHJhbnNbXCJfY2FjaGVcIl0gPSBudWxsO1xuICAgICAgICAgIHJldHVybiB0YWJsZS5tdXRhdGUocmVxKTtcbiAgICAgICAgfX0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG52YXIgX2E7XG5mdW5jdGlvbiBpc0VtcHR5UmFuZ2Uobm9kZSkge1xuICByZXR1cm4gIShcImZyb21cIiBpbiBub2RlKTtcbn1cbnZhciBSYW5nZVNldCA9IGZ1bmN0aW9uKGZyb21PclRyZWUsIHRvKSB7XG4gIGlmICh0aGlzKSB7XG4gICAgZXh0ZW5kKHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPyB7ZDogMSwgZnJvbTogZnJvbU9yVHJlZSwgdG86IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gdG8gOiBmcm9tT3JUcmVlfSA6IHtkOiAwfSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJ2ID0gbmV3IFJhbmdlU2V0KCk7XG4gICAgaWYgKGZyb21PclRyZWUgJiYgXCJkXCIgaW4gZnJvbU9yVHJlZSkge1xuICAgICAgZXh0ZW5kKHJ2LCBmcm9tT3JUcmVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG59O1xucHJvcHMoUmFuZ2VTZXQucHJvdG90eXBlLCAoX2EgPSB7XG4gIGFkZDogZnVuY3Rpb24ocmFuZ2VTZXQpIHtcbiAgICBtZXJnZVJhbmdlcyh0aGlzLCByYW5nZVNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGFkZEtleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgYWRkUmFuZ2UodGhpcywga2V5LCBrZXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBhZGRLZXlzOiBmdW5jdGlvbihrZXlzMikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAga2V5czIuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBhZGRSYW5nZShfdGhpcywga2V5LCBrZXkpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59LCBfYVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmdlU2V0SXRlcmF0b3IodGhpcyk7XG59LCBfYSkpO1xuZnVuY3Rpb24gYWRkUmFuZ2UodGFyZ2V0LCBmcm9tLCB0bykge1xuICB2YXIgZGlmZiA9IGNtcChmcm9tLCB0byk7XG4gIGlmIChpc05hTihkaWZmKSlcbiAgICByZXR1cm47XG4gIGlmIChkaWZmID4gMClcbiAgICB0aHJvdyBSYW5nZUVycm9yKCk7XG4gIGlmIChpc0VtcHR5UmFuZ2UodGFyZ2V0KSlcbiAgICByZXR1cm4gZXh0ZW5kKHRhcmdldCwge2Zyb20sIHRvLCBkOiAxfSk7XG4gIHZhciBsZWZ0ID0gdGFyZ2V0Lmw7XG4gIHZhciByaWdodCA9IHRhcmdldC5yO1xuICBpZiAoY21wKHRvLCB0YXJnZXQuZnJvbSkgPCAwKSB7XG4gICAgbGVmdCA/IGFkZFJhbmdlKGxlZnQsIGZyb20sIHRvKSA6IHRhcmdldC5sID0ge2Zyb20sIHRvLCBkOiAxLCBsOiBudWxsLCByOiBudWxsfTtcbiAgICByZXR1cm4gcmViYWxhbmNlKHRhcmdldCk7XG4gIH1cbiAgaWYgKGNtcChmcm9tLCB0YXJnZXQudG8pID4gMCkge1xuICAgIHJpZ2h0ID8gYWRkUmFuZ2UocmlnaHQsIGZyb20sIHRvKSA6IHRhcmdldC5yID0ge2Zyb20sIHRvLCBkOiAxLCBsOiBudWxsLCByOiBudWxsfTtcbiAgICByZXR1cm4gcmViYWxhbmNlKHRhcmdldCk7XG4gIH1cbiAgaWYgKGNtcChmcm9tLCB0YXJnZXQuZnJvbSkgPCAwKSB7XG4gICAgdGFyZ2V0LmZyb20gPSBmcm9tO1xuICAgIHRhcmdldC5sID0gbnVsbDtcbiAgICB0YXJnZXQuZCA9IHJpZ2h0ID8gcmlnaHQuZCArIDEgOiAxO1xuICB9XG4gIGlmIChjbXAodG8sIHRhcmdldC50bykgPiAwKSB7XG4gICAgdGFyZ2V0LnRvID0gdG87XG4gICAgdGFyZ2V0LnIgPSBudWxsO1xuICAgIHRhcmdldC5kID0gdGFyZ2V0LmwgPyB0YXJnZXQubC5kICsgMSA6IDE7XG4gIH1cbiAgdmFyIHJpZ2h0V2FzQ3V0T2ZmID0gIXRhcmdldC5yO1xuICBpZiAobGVmdCAmJiAhdGFyZ2V0LmwpIHtcbiAgICBtZXJnZVJhbmdlcyh0YXJnZXQsIGxlZnQpO1xuICB9XG4gIGlmIChyaWdodCAmJiByaWdodFdhc0N1dE9mZikge1xuICAgIG1lcmdlUmFuZ2VzKHRhcmdldCwgcmlnaHQpO1xuICB9XG59XG5mdW5jdGlvbiBtZXJnZVJhbmdlcyh0YXJnZXQsIG5ld1NldCkge1xuICBmdW5jdGlvbiBfYWRkUmFuZ2VTZXQodGFyZ2V0MiwgX2EyKSB7XG4gICAgdmFyIGZyb20gPSBfYTIuZnJvbSwgdG8gPSBfYTIudG8sIGwgPSBfYTIubCwgciA9IF9hMi5yO1xuICAgIGFkZFJhbmdlKHRhcmdldDIsIGZyb20sIHRvKTtcbiAgICBpZiAobClcbiAgICAgIF9hZGRSYW5nZVNldCh0YXJnZXQyLCBsKTtcbiAgICBpZiAocilcbiAgICAgIF9hZGRSYW5nZVNldCh0YXJnZXQyLCByKTtcbiAgfVxuICBpZiAoIWlzRW1wdHlSYW5nZShuZXdTZXQpKVxuICAgIF9hZGRSYW5nZVNldCh0YXJnZXQsIG5ld1NldCk7XG59XG5mdW5jdGlvbiByYW5nZXNPdmVybGFwKHJhbmdlU2V0MSwgcmFuZ2VTZXQyKSB7XG4gIHZhciBpMSA9IGdldFJhbmdlU2V0SXRlcmF0b3IocmFuZ2VTZXQyKTtcbiAgdmFyIG5leHRSZXN1bHQxID0gaTEubmV4dCgpO1xuICBpZiAobmV4dFJlc3VsdDEuZG9uZSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhID0gbmV4dFJlc3VsdDEudmFsdWU7XG4gIHZhciBpMiA9IGdldFJhbmdlU2V0SXRlcmF0b3IocmFuZ2VTZXQxKTtcbiAgdmFyIG5leHRSZXN1bHQyID0gaTIubmV4dChhLmZyb20pO1xuICB2YXIgYiA9IG5leHRSZXN1bHQyLnZhbHVlO1xuICB3aGlsZSAoIW5leHRSZXN1bHQxLmRvbmUgJiYgIW5leHRSZXN1bHQyLmRvbmUpIHtcbiAgICBpZiAoY21wKGIuZnJvbSwgYS50bykgPD0gMCAmJiBjbXAoYi50bywgYS5mcm9tKSA+PSAwKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY21wKGEuZnJvbSwgYi5mcm9tKSA8IDAgPyBhID0gKG5leHRSZXN1bHQxID0gaTEubmV4dChiLmZyb20pKS52YWx1ZSA6IGIgPSAobmV4dFJlc3VsdDIgPSBpMi5uZXh0KGEuZnJvbSkpLnZhbHVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGdldFJhbmdlU2V0SXRlcmF0b3Iobm9kZSkge1xuICB2YXIgc3RhdGUgPSBpc0VtcHR5UmFuZ2Uobm9kZSkgPyBudWxsIDoge3M6IDAsIG46IG5vZGV9O1xuICByZXR1cm4ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGtleVByb3ZpZGVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDA7XG4gICAgICB3aGlsZSAoc3RhdGUpIHtcbiAgICAgICAgc3dpdGNoIChzdGF0ZS5zKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgc3RhdGUucyA9IDE7XG4gICAgICAgICAgICBpZiAoa2V5UHJvdmlkZWQpIHtcbiAgICAgICAgICAgICAgd2hpbGUgKHN0YXRlLm4ubCAmJiBjbXAoa2V5LCBzdGF0ZS5uLmZyb20pIDwgMClcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHt1cDogc3RhdGUsIG46IHN0YXRlLm4ubCwgczogMX07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3aGlsZSAoc3RhdGUubi5sKVxuICAgICAgICAgICAgICAgIHN0YXRlID0ge3VwOiBzdGF0ZSwgbjogc3RhdGUubi5sLCBzOiAxfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzdGF0ZS5zID0gMjtcbiAgICAgICAgICAgIGlmICgha2V5UHJvdmlkZWQgfHwgY21wKGtleSwgc3RhdGUubi50bykgPD0gMClcbiAgICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTogc3RhdGUubiwgZG9uZTogZmFsc2V9O1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGlmIChzdGF0ZS5uLnIpIHtcbiAgICAgICAgICAgICAgc3RhdGUucyA9IDM7XG4gICAgICAgICAgICAgIHN0YXRlID0ge3VwOiBzdGF0ZSwgbjogc3RhdGUubi5yLCBzOiAwfTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgc3RhdGUgPSBzdGF0ZS51cDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtkb25lOiB0cnVlfTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiByZWJhbGFuY2UodGFyZ2V0KSB7XG4gIHZhciBfYTIsIF9iO1xuICB2YXIgZGlmZiA9ICgoKF9hMiA9IHRhcmdldC5yKSA9PT0gbnVsbCB8fCBfYTIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hMi5kKSB8fCAwKSAtICgoKF9iID0gdGFyZ2V0LmwpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5kKSB8fCAwKTtcbiAgdmFyIHIgPSBkaWZmID4gMSA/IFwiclwiIDogZGlmZiA8IC0xID8gXCJsXCIgOiBcIlwiO1xuICBpZiAocikge1xuICAgIHZhciBsID0gciA9PT0gXCJyXCIgPyBcImxcIiA6IFwiclwiO1xuICAgIHZhciByb290Q2xvbmUgPSBfX2Fzc2lnbih7fSwgdGFyZ2V0KTtcbiAgICB2YXIgb2xkUm9vdFJpZ2h0ID0gdGFyZ2V0W3JdO1xuICAgIHRhcmdldC5mcm9tID0gb2xkUm9vdFJpZ2h0LmZyb207XG4gICAgdGFyZ2V0LnRvID0gb2xkUm9vdFJpZ2h0LnRvO1xuICAgIHRhcmdldFtyXSA9IG9sZFJvb3RSaWdodFtyXTtcbiAgICByb290Q2xvbmVbcl0gPSBvbGRSb290UmlnaHRbbF07XG4gICAgdGFyZ2V0W2xdID0gcm9vdENsb25lO1xuICAgIHJvb3RDbG9uZS5kID0gY29tcHV0ZURlcHRoKHJvb3RDbG9uZSk7XG4gIH1cbiAgdGFyZ2V0LmQgPSBjb21wdXRlRGVwdGgodGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVEZXB0aChfYTIpIHtcbiAgdmFyIHIgPSBfYTIuciwgbCA9IF9hMi5sO1xuICByZXR1cm4gKHIgPyBsID8gTWF0aC5tYXgoci5kLCBsLmQpIDogci5kIDogbCA/IGwuZCA6IDApICsgMTtcbn1cbnZhciBvYnNlcnZhYmlsaXR5TWlkZGxld2FyZSA9IHtcbiAgc3RhY2s6IFwiZGJjb3JlXCIsXG4gIGxldmVsOiAwLFxuICBjcmVhdGU6IGZ1bmN0aW9uKGNvcmUpIHtcbiAgICB2YXIgZGJOYW1lID0gY29yZS5zY2hlbWEubmFtZTtcbiAgICB2YXIgRlVMTF9SQU5HRSA9IG5ldyBSYW5nZVNldChjb3JlLk1JTl9LRVksIGNvcmUuTUFYX0tFWSk7XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb3JlKSwge3RhYmxlOiBmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICAgIHZhciB0YWJsZSA9IGNvcmUudGFibGUodGFibGVOYW1lKTtcbiAgICAgIHZhciBzY2hlbWEgPSB0YWJsZS5zY2hlbWE7XG4gICAgICB2YXIgcHJpbWFyeUtleSA9IHNjaGVtYS5wcmltYXJ5S2V5O1xuICAgICAgdmFyIGV4dHJhY3RLZXkgPSBwcmltYXJ5S2V5LmV4dHJhY3RLZXksIG91dGJvdW5kID0gcHJpbWFyeUtleS5vdXRib3VuZDtcbiAgICAgIHZhciB0YWJsZUNsb25lID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRhYmxlKSwge211dGF0ZTogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHZhciB0cmFucyA9IHJlcS50cmFucztcbiAgICAgICAgdmFyIG11dGF0ZWRQYXJ0cyA9IHRyYW5zLm11dGF0ZWRQYXJ0cyB8fCAodHJhbnMubXV0YXRlZFBhcnRzID0ge30pO1xuICAgICAgICB2YXIgZ2V0UmFuZ2VTZXQgPSBmdW5jdGlvbihpbmRleE5hbWUpIHtcbiAgICAgICAgICB2YXIgcGFydCA9IFwiaWRiOi8vXCIgKyBkYk5hbWUgKyBcIi9cIiArIHRhYmxlTmFtZSArIFwiL1wiICsgaW5kZXhOYW1lO1xuICAgICAgICAgIHJldHVybiBtdXRhdGVkUGFydHNbcGFydF0gfHwgKG11dGF0ZWRQYXJ0c1twYXJ0XSA9IG5ldyBSYW5nZVNldCgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHBrUmFuZ2VTZXQgPSBnZXRSYW5nZVNldChcIlwiKTtcbiAgICAgICAgdmFyIGRlbHNSYW5nZVNldCA9IGdldFJhbmdlU2V0KFwiOmRlbHNcIik7XG4gICAgICAgIHZhciB0eXBlID0gcmVxLnR5cGU7XG4gICAgICAgIHZhciBfYTIgPSByZXEudHlwZSA9PT0gXCJkZWxldGVSYW5nZVwiID8gW3JlcS5yYW5nZV0gOiByZXEudHlwZSA9PT0gXCJkZWxldGVcIiA/IFtyZXEua2V5c10gOiByZXEudmFsdWVzLmxlbmd0aCA8IDUwID8gW1tdLCByZXEudmFsdWVzXSA6IFtdLCBrZXlzMiA9IF9hMlswXSwgbmV3T2JqcyA9IF9hMlsxXTtcbiAgICAgICAgdmFyIG9sZENhY2hlID0gcmVxLnRyYW5zW1wiX2NhY2hlXCJdO1xuICAgICAgICByZXR1cm4gdGFibGUubXV0YXRlKHJlcSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICBpZiAoaXNBcnJheShrZXlzMikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9PSBcImRlbGV0ZVwiKVxuICAgICAgICAgICAgICBrZXlzMiA9IHJlcy5yZXN1bHRzO1xuICAgICAgICAgICAgcGtSYW5nZVNldC5hZGRLZXlzKGtleXMyKTtcbiAgICAgICAgICAgIHZhciBvbGRPYmpzID0gZ2V0RnJvbVRyYW5zYWN0aW9uQ2FjaGUoa2V5czIsIG9sZENhY2hlKTtcbiAgICAgICAgICAgIGlmICghb2xkT2JqcyAmJiB0eXBlICE9PSBcImFkZFwiKSB7XG4gICAgICAgICAgICAgIGRlbHNSYW5nZVNldC5hZGRLZXlzKGtleXMyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvbGRPYmpzIHx8IG5ld09ianMpIHtcbiAgICAgICAgICAgICAgdHJhY2tBZmZlY3RlZEluZGV4ZXMoZ2V0UmFuZ2VTZXQsIHNjaGVtYSwgb2xkT2JqcywgbmV3T2Jqcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChrZXlzMikge1xuICAgICAgICAgICAgdmFyIHJhbmdlID0ge2Zyb206IGtleXMyLmxvd2VyLCB0bzoga2V5czIudXBwZXJ9O1xuICAgICAgICAgICAgZGVsc1JhbmdlU2V0LmFkZChyYW5nZSk7XG4gICAgICAgICAgICBwa1JhbmdlU2V0LmFkZChyYW5nZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBrUmFuZ2VTZXQuYWRkKEZVTExfUkFOR0UpO1xuICAgICAgICAgICAgZGVsc1JhbmdlU2V0LmFkZChGVUxMX1JBTkdFKTtcbiAgICAgICAgICAgIHNjaGVtYS5pbmRleGVzLmZvckVhY2goZnVuY3Rpb24oaWR4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBnZXRSYW5nZVNldChpZHgubmFtZSkuYWRkKEZVTExfUkFOR0UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgICAgfX0pO1xuICAgICAgdmFyIGdldFJhbmdlID0gZnVuY3Rpb24oX2EyKSB7XG4gICAgICAgIHZhciBfYiwgX2M7XG4gICAgICAgIHZhciBfZCA9IF9hMi5xdWVyeSwgaW5kZXggPSBfZC5pbmRleCwgcmFuZ2UgPSBfZC5yYW5nZTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBuZXcgUmFuZ2VTZXQoKF9iID0gcmFuZ2UubG93ZXIpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IGNvcmUuTUlOX0tFWSwgKF9jID0gcmFuZ2UudXBwZXIpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IGNvcmUuTUFYX0tFWSlcbiAgICAgICAgXTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVhZFN1YnNjcmliZXJzID0ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICAgIHJldHVybiBbcHJpbWFyeUtleSwgbmV3IFJhbmdlU2V0KHJlcS5rZXkpXTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0TWFueTogZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgICAgcmV0dXJuIFtwcmltYXJ5S2V5LCBuZXcgUmFuZ2VTZXQoKS5hZGRLZXlzKHJlcS5rZXlzKV07XG4gICAgICAgIH0sXG4gICAgICAgIGNvdW50OiBnZXRSYW5nZSxcbiAgICAgICAgcXVlcnk6IGdldFJhbmdlLFxuICAgICAgICBvcGVuQ3Vyc29yOiBnZXRSYW5nZVxuICAgICAgfTtcbiAgICAgIGtleXMocmVhZFN1YnNjcmliZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB0YWJsZUNsb25lW21ldGhvZF0gPSBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgICB2YXIgc3Vic2NyID0gUFNELnN1YnNjcjtcbiAgICAgICAgICBpZiAoc3Vic2NyKSB7XG4gICAgICAgICAgICB2YXIgZ2V0UmFuZ2VTZXQgPSBmdW5jdGlvbihpbmRleE5hbWUpIHtcbiAgICAgICAgICAgICAgdmFyIHBhcnQgPSBcImlkYjovL1wiICsgZGJOYW1lICsgXCIvXCIgKyB0YWJsZU5hbWUgKyBcIi9cIiArIGluZGV4TmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuIHN1YnNjcltwYXJ0XSB8fCAoc3Vic2NyW3BhcnRdID0gbmV3IFJhbmdlU2V0KCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBwa1JhbmdlU2V0XzEgPSBnZXRSYW5nZVNldChcIlwiKTtcbiAgICAgICAgICAgIHZhciBkZWxzUmFuZ2VTZXRfMSA9IGdldFJhbmdlU2V0KFwiOmRlbHNcIik7XG4gICAgICAgICAgICB2YXIgX2EyID0gcmVhZFN1YnNjcmliZXJzW21ldGhvZF0ocmVxKSwgcXVlcmllZEluZGV4ID0gX2EyWzBdLCBxdWVyaWVkUmFuZ2VzID0gX2EyWzFdO1xuICAgICAgICAgICAgZ2V0UmFuZ2VTZXQocXVlcmllZEluZGV4Lm5hbWUgfHwgXCJcIikuYWRkKHF1ZXJpZWRSYW5nZXMpO1xuICAgICAgICAgICAgaWYgKCFxdWVyaWVkSW5kZXguaXNQcmltYXJ5S2V5KSB7XG4gICAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwiY291bnRcIikge1xuICAgICAgICAgICAgICAgIGRlbHNSYW5nZVNldF8xLmFkZChGVUxMX1JBTkdFKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5c1Byb21pc2VfMSA9IG1ldGhvZCA9PT0gXCJxdWVyeVwiICYmIG91dGJvdW5kICYmIHJlcS52YWx1ZXMgJiYgdGFibGUucXVlcnkoX19hc3NpZ24oX19hc3NpZ24oe30sIHJlcSksIHt2YWx1ZXM6IGZhbHNlfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZVttZXRob2RdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicXVlcnlcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0Ym91bmQgJiYgcmVxLnZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlzUHJvbWlzZV8xLnRoZW4oZnVuY3Rpb24oX2EzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0aW5nS2V5cyA9IF9hMy5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwa1JhbmdlU2V0XzEuYWRkS2V5cyhyZXN1bHRpbmdLZXlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBLZXlzID0gcmVxLnZhbHVlcyA/IHJlcy5yZXN1bHQubWFwKGV4dHJhY3RLZXkpIDogcmVzLnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS52YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICBwa1JhbmdlU2V0XzEuYWRkS2V5cyhwS2V5cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgZGVsc1JhbmdlU2V0XzEuYWRkS2V5cyhwS2V5cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcIm9wZW5DdXJzb3JcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyc29yXzEgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3YW50VmFsdWVzXzEgPSByZXEudmFsdWVzO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yXzEgJiYgT2JqZWN0LmNyZWF0ZShjdXJzb3JfMSwge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsc1JhbmdlU2V0XzEuYWRkS2V5KGN1cnNvcl8xLnByaW1hcnlLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yXzEua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeUtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBrZXkgPSBjdXJzb3JfMS5wcmltYXJ5S2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxzUmFuZ2VTZXRfMS5hZGRLZXkocGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwa2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdhbnRWYWx1ZXNfMSAmJiBwa1JhbmdlU2V0XzEuYWRkS2V5KGN1cnNvcl8xLnByaW1hcnlLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlW21ldGhvZF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRhYmxlQ2xvbmU7XG4gICAgfX0pO1xuICB9XG59O1xuZnVuY3Rpb24gdHJhY2tBZmZlY3RlZEluZGV4ZXMoZ2V0UmFuZ2VTZXQsIHNjaGVtYSwgb2xkT2JqcywgbmV3T2Jqcykge1xuICBmdW5jdGlvbiBhZGRBZmZlY3RlZEluZGV4KGl4KSB7XG4gICAgdmFyIHJhbmdlU2V0ID0gZ2V0UmFuZ2VTZXQoaXgubmFtZSB8fCBcIlwiKTtcbiAgICBmdW5jdGlvbiBleHRyYWN0S2V5KG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gaXguZXh0cmFjdEtleShvYmopIDogbnVsbDtcbiAgICB9XG4gICAgdmFyIGFkZEtleU9yS2V5cyA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGl4Lm11bHRpRW50cnkgJiYgaXNBcnJheShrZXkpID8ga2V5LmZvckVhY2goZnVuY3Rpb24oa2V5Mikge1xuICAgICAgICByZXR1cm4gcmFuZ2VTZXQuYWRkS2V5KGtleTIpO1xuICAgICAgfSkgOiByYW5nZVNldC5hZGRLZXkoa2V5KTtcbiAgICB9O1xuICAgIChvbGRPYmpzIHx8IG5ld09ianMpLmZvckVhY2goZnVuY3Rpb24oXywgaSkge1xuICAgICAgdmFyIG9sZEtleSA9IG9sZE9ianMgJiYgZXh0cmFjdEtleShvbGRPYmpzW2ldKTtcbiAgICAgIHZhciBuZXdLZXkgPSBuZXdPYmpzICYmIGV4dHJhY3RLZXkobmV3T2Jqc1tpXSk7XG4gICAgICBpZiAoY21wKG9sZEtleSwgbmV3S2V5KSAhPT0gMCkge1xuICAgICAgICBpZiAob2xkS2V5ICE9IG51bGwpXG4gICAgICAgICAgYWRkS2V5T3JLZXlzKG9sZEtleSk7XG4gICAgICAgIGlmIChuZXdLZXkgIT0gbnVsbClcbiAgICAgICAgICBhZGRLZXlPcktleXMobmV3S2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBzY2hlbWEuaW5kZXhlcy5mb3JFYWNoKGFkZEFmZmVjdGVkSW5kZXgpO1xufVxudmFyIERleGllJDEgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRGV4aWUyKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMuX21pZGRsZXdhcmVzID0ge307XG4gICAgdGhpcy52ZXJubyA9IDA7XG4gICAgdmFyIGRlcHMgPSBEZXhpZTIuZGVwZW5kZW5jaWVzO1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zID0gX19hc3NpZ24oe1xuICAgICAgYWRkb25zOiBEZXhpZTIuYWRkb25zLFxuICAgICAgYXV0b09wZW46IHRydWUsXG4gICAgICBpbmRleGVkREI6IGRlcHMuaW5kZXhlZERCLFxuICAgICAgSURCS2V5UmFuZ2U6IGRlcHMuSURCS2V5UmFuZ2VcbiAgICB9LCBvcHRpb25zKTtcbiAgICB0aGlzLl9kZXBzID0ge1xuICAgICAgaW5kZXhlZERCOiBvcHRpb25zLmluZGV4ZWREQixcbiAgICAgIElEQktleVJhbmdlOiBvcHRpb25zLklEQktleVJhbmdlXG4gICAgfTtcbiAgICB2YXIgYWRkb25zID0gb3B0aW9ucy5hZGRvbnM7XG4gICAgdGhpcy5fZGJTY2hlbWEgPSB7fTtcbiAgICB0aGlzLl92ZXJzaW9ucyA9IFtdO1xuICAgIHRoaXMuX3N0b3JlTmFtZXMgPSBbXTtcbiAgICB0aGlzLl9hbGxUYWJsZXMgPSB7fTtcbiAgICB0aGlzLmlkYmRiID0gbnVsbDtcbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICBkYk9wZW5FcnJvcjogbnVsbCxcbiAgICAgIGlzQmVpbmdPcGVuZWQ6IGZhbHNlLFxuICAgICAgb25SZWFkeUJlaW5nRmlyZWQ6IG51bGwsXG4gICAgICBvcGVuQ29tcGxldGU6IGZhbHNlLFxuICAgICAgZGJSZWFkeVJlc29sdmU6IG5vcCxcbiAgICAgIGRiUmVhZHlQcm9taXNlOiBudWxsLFxuICAgICAgY2FuY2VsT3Blbjogbm9wLFxuICAgICAgb3BlbkNhbmNlbGxlcjogbnVsbCxcbiAgICAgIGF1dG9TY2hlbWE6IHRydWVcbiAgICB9O1xuICAgIHN0YXRlLmRiUmVhZHlQcm9taXNlID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICBzdGF0ZS5kYlJlYWR5UmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgc3RhdGUub3BlbkNhbmNlbGxlciA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24oXywgcmVqZWN0KSB7XG4gICAgICBzdGF0ZS5jYW5jZWxPcGVuID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLm9uID0gRXZlbnRzKHRoaXMsIFwicG9wdWxhdGVcIiwgXCJibG9ja2VkXCIsIFwidmVyc2lvbmNoYW5nZVwiLCBcImNsb3NlXCIsIHtyZWFkeTogW3Byb21pc2FibGVDaGFpbiwgbm9wXX0pO1xuICAgIHRoaXMub24ucmVhZHkuc3Vic2NyaWJlID0gb3ZlcnJpZGUodGhpcy5vbi5yZWFkeS5zdWJzY3JpYmUsIGZ1bmN0aW9uKHN1YnNjcmliZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN1YnNjcmliZXIsIGJTdGlja3kpIHtcbiAgICAgICAgRGV4aWUyLnZpcChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgc3RhdGUyID0gX3RoaXMuX3N0YXRlO1xuICAgICAgICAgIGlmIChzdGF0ZTIub3BlbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICBpZiAoIXN0YXRlMi5kYk9wZW5FcnJvcilcbiAgICAgICAgICAgICAgRGV4aWVQcm9taXNlLnJlc29sdmUoKS50aGVuKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKGJTdGlja3kpXG4gICAgICAgICAgICAgIHN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlMi5vblJlYWR5QmVpbmdGaXJlZCkge1xuICAgICAgICAgICAgc3RhdGUyLm9uUmVhZHlCZWluZ0ZpcmVkLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBpZiAoYlN0aWNreSlcbiAgICAgICAgICAgICAgc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICB2YXIgZGJfMSA9IF90aGlzO1xuICAgICAgICAgICAgaWYgKCFiU3RpY2t5KVxuICAgICAgICAgICAgICBzdWJzY3JpYmUoZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgICAgICAgICAgZGJfMS5vbi5yZWFkeS51bnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgICAgICBkYl8xLm9uLnJlYWR5LnVuc3Vic2NyaWJlKHVuc3Vic2NyaWJlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgdGhpcy5Db2xsZWN0aW9uID0gY3JlYXRlQ29sbGVjdGlvbkNvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHRoaXMuVGFibGUgPSBjcmVhdGVUYWJsZUNvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHRoaXMuVHJhbnNhY3Rpb24gPSBjcmVhdGVUcmFuc2FjdGlvbkNvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHRoaXMuVmVyc2lvbiA9IGNyZWF0ZVZlcnNpb25Db25zdHJ1Y3Rvcih0aGlzKTtcbiAgICB0aGlzLldoZXJlQ2xhdXNlID0gY3JlYXRlV2hlcmVDbGF1c2VDb25zdHJ1Y3Rvcih0aGlzKTtcbiAgICB0aGlzLm9uKFwidmVyc2lvbmNoYW5nZVwiLCBmdW5jdGlvbihldikge1xuICAgICAgaWYgKGV2Lm5ld1ZlcnNpb24gPiAwKVxuICAgICAgICBjb25zb2xlLndhcm4oXCJBbm90aGVyIGNvbm5lY3Rpb24gd2FudHMgdG8gdXBncmFkZSBkYXRhYmFzZSAnXCIgKyBfdGhpcy5uYW1lICsgXCInLiBDbG9zaW5nIGRiIG5vdyB0byByZXN1bWUgdGhlIHVwZ3JhZGUuXCIpO1xuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4oXCJBbm90aGVyIGNvbm5lY3Rpb24gd2FudHMgdG8gZGVsZXRlIGRhdGFiYXNlICdcIiArIF90aGlzLm5hbWUgKyBcIicuIENsb3NpbmcgZGIgbm93IHRvIHJlc3VtZSB0aGUgZGVsZXRlIHJlcXVlc3QuXCIpO1xuICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uKFwiYmxvY2tlZFwiLCBmdW5jdGlvbihldikge1xuICAgICAgaWYgKCFldi5uZXdWZXJzaW9uIHx8IGV2Lm5ld1ZlcnNpb24gPCBldi5vbGRWZXJzaW9uKVxuICAgICAgICBjb25zb2xlLndhcm4oXCJEZXhpZS5kZWxldGUoJ1wiICsgX3RoaXMubmFtZSArIFwiJykgd2FzIGJsb2NrZWRcIik7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybihcIlVwZ3JhZGUgJ1wiICsgX3RoaXMubmFtZSArIFwiJyBibG9ja2VkIGJ5IG90aGVyIGNvbm5lY3Rpb24gaG9sZGluZyB2ZXJzaW9uIFwiICsgZXYub2xkVmVyc2lvbiAvIDEwKTtcbiAgICB9KTtcbiAgICB0aGlzLl9tYXhLZXkgPSBnZXRNYXhLZXkob3B0aW9ucy5JREJLZXlSYW5nZSk7XG4gICAgdGhpcy5fY3JlYXRlVHJhbnNhY3Rpb24gPSBmdW5jdGlvbihtb2RlLCBzdG9yZU5hbWVzLCBkYnNjaGVtYSwgcGFyZW50VHJhbnNhY3Rpb24pIHtcbiAgICAgIHJldHVybiBuZXcgX3RoaXMuVHJhbnNhY3Rpb24obW9kZSwgc3RvcmVOYW1lcywgZGJzY2hlbWEsIHBhcmVudFRyYW5zYWN0aW9uKTtcbiAgICB9O1xuICAgIHRoaXMuX2ZpcmVPbkJsb2NrZWQgPSBmdW5jdGlvbihldikge1xuICAgICAgX3RoaXMub24oXCJibG9ja2VkXCIpLmZpcmUoZXYpO1xuICAgICAgY29ubmVjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgcmV0dXJuIGMubmFtZSA9PT0gX3RoaXMubmFtZSAmJiBjICE9PSBfdGhpcyAmJiAhYy5fc3RhdGUudmNGaXJlZDtcbiAgICAgIH0pLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiBjLm9uKFwidmVyc2lvbmNoYW5nZVwiKS5maXJlKGV2KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdGhpcy51c2UodmlydHVhbEluZGV4TWlkZGxld2FyZSk7XG4gICAgdGhpcy51c2UoaG9va3NNaWRkbGV3YXJlKTtcbiAgICB0aGlzLnVzZShvYnNlcnZhYmlsaXR5TWlkZGxld2FyZSk7XG4gICAgdGhpcy51c2UoY2FjaGVFeGlzdGluZ1ZhbHVlc01pZGRsZXdhcmUpO1xuICAgIGFkZG9ucy5mb3JFYWNoKGZ1bmN0aW9uKGFkZG9uKSB7XG4gICAgICByZXR1cm4gYWRkb24oX3RoaXMpO1xuICAgIH0pO1xuICB9XG4gIERleGllMi5wcm90b3R5cGUudmVyc2lvbiA9IGZ1bmN0aW9uKHZlcnNpb25OdW1iZXIpIHtcbiAgICBpZiAoaXNOYU4odmVyc2lvbk51bWJlcikgfHwgdmVyc2lvbk51bWJlciA8IDAuMSlcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlR5cGUoXCJHaXZlbiB2ZXJzaW9uIGlzIG5vdCBhIHBvc2l0aXZlIG51bWJlclwiKTtcbiAgICB2ZXJzaW9uTnVtYmVyID0gTWF0aC5yb3VuZCh2ZXJzaW9uTnVtYmVyICogMTApIC8gMTA7XG4gICAgaWYgKHRoaXMuaWRiZGIgfHwgdGhpcy5fc3RhdGUuaXNCZWluZ09wZW5lZClcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlNjaGVtYShcIkNhbm5vdCBhZGQgdmVyc2lvbiB3aGVuIGRhdGFiYXNlIGlzIG9wZW5cIik7XG4gICAgdGhpcy52ZXJubyA9IE1hdGgubWF4KHRoaXMudmVybm8sIHZlcnNpb25OdW1iZXIpO1xuICAgIHZhciB2ZXJzaW9ucyA9IHRoaXMuX3ZlcnNpb25zO1xuICAgIHZhciB2ZXJzaW9uSW5zdGFuY2UgPSB2ZXJzaW9ucy5maWx0ZXIoZnVuY3Rpb24odikge1xuICAgICAgcmV0dXJuIHYuX2NmZy52ZXJzaW9uID09PSB2ZXJzaW9uTnVtYmVyO1xuICAgIH0pWzBdO1xuICAgIGlmICh2ZXJzaW9uSW5zdGFuY2UpXG4gICAgICByZXR1cm4gdmVyc2lvbkluc3RhbmNlO1xuICAgIHZlcnNpb25JbnN0YW5jZSA9IG5ldyB0aGlzLlZlcnNpb24odmVyc2lvbk51bWJlcik7XG4gICAgdmVyc2lvbnMucHVzaCh2ZXJzaW9uSW5zdGFuY2UpO1xuICAgIHZlcnNpb25zLnNvcnQobG93ZXJWZXJzaW9uRmlyc3QpO1xuICAgIHZlcnNpb25JbnN0YW5jZS5zdG9yZXMoe30pO1xuICAgIHRoaXMuX3N0YXRlLmF1dG9TY2hlbWEgPSBmYWxzZTtcbiAgICByZXR1cm4gdmVyc2lvbkluc3RhbmNlO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLl93aGVuUmVhZHkgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLm9wZW5Db21wbGV0ZSB8fCBQU0QubGV0VGhyb3VnaCA/IGZuKCkgOiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWYgKCFfdGhpcy5fc3RhdGUuaXNCZWluZ09wZW5lZCkge1xuICAgICAgICBpZiAoIV90aGlzLl9vcHRpb25zLmF1dG9PcGVuKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBleGNlcHRpb25zLkRhdGFiYXNlQ2xvc2VkKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5vcGVuKCkuY2F0Y2gobm9wKTtcbiAgICAgIH1cbiAgICAgIF90aGlzLl9zdGF0ZS5kYlJlYWR5UHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSkudGhlbihmbik7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oX2EyKSB7XG4gICAgdmFyIHN0YWNrID0gX2EyLnN0YWNrLCBjcmVhdGUgPSBfYTIuY3JlYXRlLCBsZXZlbCA9IF9hMi5sZXZlbCwgbmFtZSA9IF9hMi5uYW1lO1xuICAgIGlmIChuYW1lKVxuICAgICAgdGhpcy51bnVzZSh7c3RhY2ssIG5hbWV9KTtcbiAgICB2YXIgbWlkZGxld2FyZXMgPSB0aGlzLl9taWRkbGV3YXJlc1tzdGFja10gfHwgKHRoaXMuX21pZGRsZXdhcmVzW3N0YWNrXSA9IFtdKTtcbiAgICBtaWRkbGV3YXJlcy5wdXNoKHtzdGFjaywgY3JlYXRlLCBsZXZlbDogbGV2ZWwgPT0gbnVsbCA/IDEwIDogbGV2ZWwsIG5hbWV9KTtcbiAgICBtaWRkbGV3YXJlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLmxldmVsIC0gYi5sZXZlbDtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS51bnVzZSA9IGZ1bmN0aW9uKF9hMikge1xuICAgIHZhciBzdGFjayA9IF9hMi5zdGFjaywgbmFtZSA9IF9hMi5uYW1lLCBjcmVhdGUgPSBfYTIuY3JlYXRlO1xuICAgIGlmIChzdGFjayAmJiB0aGlzLl9taWRkbGV3YXJlc1tzdGFja10pIHtcbiAgICAgIHRoaXMuX21pZGRsZXdhcmVzW3N0YWNrXSA9IHRoaXMuX21pZGRsZXdhcmVzW3N0YWNrXS5maWx0ZXIoZnVuY3Rpb24obXcpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZSA/IG13LmNyZWF0ZSAhPT0gY3JlYXRlIDogbmFtZSA/IG13Lm5hbWUgIT09IG5hbWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRleGllT3Blbih0aGlzKTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpZHggPSBjb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuICAgIGlmIChpZHggPj0gMClcbiAgICAgIGNvbm5lY3Rpb25zLnNwbGljZShpZHgsIDEpO1xuICAgIGlmICh0aGlzLmlkYmRiKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmlkYmRiLmNsb3NlKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICB0aGlzLmlkYmRiID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fb3B0aW9ucy5hdXRvT3BlbiA9IGZhbHNlO1xuICAgIHN0YXRlLmRiT3BlbkVycm9yID0gbmV3IGV4Y2VwdGlvbnMuRGF0YWJhc2VDbG9zZWQoKTtcbiAgICBpZiAoc3RhdGUuaXNCZWluZ09wZW5lZClcbiAgICAgIHN0YXRlLmNhbmNlbE9wZW4oc3RhdGUuZGJPcGVuRXJyb3IpO1xuICAgIHN0YXRlLmRiUmVhZHlQcm9taXNlID0gbmV3IERleGllUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICBzdGF0ZS5kYlJlYWR5UmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgc3RhdGUub3BlbkNhbmNlbGxlciA9IG5ldyBEZXhpZVByb21pc2UoZnVuY3Rpb24oXywgcmVqZWN0KSB7XG4gICAgICBzdGF0ZS5jYW5jZWxPcGVuID0gcmVqZWN0O1xuICAgIH0pO1xuICB9O1xuICBEZXhpZTIucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGhhc0FyZ3VtZW50cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwO1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuICAgIHJldHVybiBuZXcgRGV4aWVQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGRvRGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgIHZhciByZXEgPSBfdGhpcy5fZGVwcy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoX3RoaXMubmFtZSk7XG4gICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSB3cmFwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIF9vbkRhdGFiYXNlRGVsZXRlZChfdGhpcy5fZGVwcywgX3RoaXMubmFtZSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSBldmVudFJlamVjdEhhbmRsZXIocmVqZWN0KTtcbiAgICAgICAgcmVxLm9uYmxvY2tlZCA9IF90aGlzLl9maXJlT25CbG9ja2VkO1xuICAgICAgfTtcbiAgICAgIGlmIChoYXNBcmd1bWVudHMpXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIkFyZ3VtZW50cyBub3QgYWxsb3dlZCBpbiBkYi5kZWxldGUoKVwiKTtcbiAgICAgIGlmIChzdGF0ZS5pc0JlaW5nT3BlbmVkKSB7XG4gICAgICAgIHN0YXRlLmRiUmVhZHlQcm9taXNlLnRoZW4oZG9EZWxldGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9EZWxldGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5iYWNrZW5kREIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pZGJkYjtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5pc09wZW4gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pZGJkYiAhPT0gbnVsbDtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5oYXNCZWVuQ2xvc2VkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRiT3BlbkVycm9yID0gdGhpcy5fc3RhdGUuZGJPcGVuRXJyb3I7XG4gICAgcmV0dXJuIGRiT3BlbkVycm9yICYmIGRiT3BlbkVycm9yLm5hbWUgPT09IFwiRGF0YWJhc2VDbG9zZWRcIjtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5oYXNGYWlsZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUuZGJPcGVuRXJyb3IgIT09IG51bGw7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUuZHluYW1pY2FsbHlPcGVuZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUuYXV0b1NjaGVtYTtcbiAgfTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERleGllMi5wcm90b3R5cGUsIFwidGFibGVzXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHJldHVybiBrZXlzKHRoaXMuX2FsbFRhYmxlcykubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9hbGxUYWJsZXNbbmFtZV07XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgRGV4aWUyLnByb3RvdHlwZS50cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gZXh0cmFjdFRyYW5zYWN0aW9uQXJncy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzLl90cmFuc2FjdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbiAgRGV4aWUyLnByb3RvdHlwZS5fdHJhbnNhY3Rpb24gPSBmdW5jdGlvbihtb2RlLCB0YWJsZXMsIHNjb3BlRnVuYykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHBhcmVudFRyYW5zYWN0aW9uID0gUFNELnRyYW5zO1xuICAgIGlmICghcGFyZW50VHJhbnNhY3Rpb24gfHwgcGFyZW50VHJhbnNhY3Rpb24uZGIgIT09IHRoaXMgfHwgbW9kZS5pbmRleE9mKFwiIVwiKSAhPT0gLTEpXG4gICAgICBwYXJlbnRUcmFuc2FjdGlvbiA9IG51bGw7XG4gICAgdmFyIG9ubHlJZkNvbXBhdGlibGUgPSBtb2RlLmluZGV4T2YoXCI/XCIpICE9PSAtMTtcbiAgICBtb2RlID0gbW9kZS5yZXBsYWNlKFwiIVwiLCBcIlwiKS5yZXBsYWNlKFwiP1wiLCBcIlwiKTtcbiAgICB2YXIgaWRiTW9kZSwgc3RvcmVOYW1lcztcbiAgICB0cnkge1xuICAgICAgc3RvcmVOYW1lcyA9IHRhYmxlcy5tYXAoZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgdmFyIHN0b3JlTmFtZSA9IHRhYmxlIGluc3RhbmNlb2YgX3RoaXMuVGFibGUgPyB0YWJsZS5uYW1lIDogdGFibGU7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcmVOYW1lICE9PSBcInN0cmluZ1wiKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIHRhYmxlIGFyZ3VtZW50IHRvIERleGllLnRyYW5zYWN0aW9uKCkuIE9ubHkgVGFibGUgb3IgU3RyaW5nIGFyZSBhbGxvd2VkXCIpO1xuICAgICAgICByZXR1cm4gc3RvcmVOYW1lO1xuICAgICAgfSk7XG4gICAgICBpZiAobW9kZSA9PSBcInJcIiB8fCBtb2RlID09PSBSRUFET05MWSlcbiAgICAgICAgaWRiTW9kZSA9IFJFQURPTkxZO1xuICAgICAgZWxzZSBpZiAobW9kZSA9PSBcInJ3XCIgfHwgbW9kZSA9PSBSRUFEV1JJVEUpXG4gICAgICAgIGlkYk1vZGUgPSBSRUFEV1JJVEU7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRBcmd1bWVudChcIkludmFsaWQgdHJhbnNhY3Rpb24gbW9kZTogXCIgKyBtb2RlKTtcbiAgICAgIGlmIChwYXJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgICBpZiAocGFyZW50VHJhbnNhY3Rpb24ubW9kZSA9PT0gUkVBRE9OTFkgJiYgaWRiTW9kZSA9PT0gUkVBRFdSSVRFKSB7XG4gICAgICAgICAgaWYgKG9ubHlJZkNvbXBhdGlibGUpIHtcbiAgICAgICAgICAgIHBhcmVudFRyYW5zYWN0aW9uID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLlN1YlRyYW5zYWN0aW9uKFwiQ2Fubm90IGVudGVyIGEgc3ViLXRyYW5zYWN0aW9uIHdpdGggUkVBRFdSSVRFIG1vZGUgd2hlbiBwYXJlbnQgdHJhbnNhY3Rpb24gaXMgUkVBRE9OTFlcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgc3RvcmVOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xuICAgICAgICAgICAgaWYgKHBhcmVudFRyYW5zYWN0aW9uICYmIHBhcmVudFRyYW5zYWN0aW9uLnN0b3JlTmFtZXMuaW5kZXhPZihzdG9yZU5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgICBpZiAob25seUlmQ29tcGF0aWJsZSkge1xuICAgICAgICAgICAgICAgIHBhcmVudFRyYW5zYWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuU3ViVHJhbnNhY3Rpb24oXCJUYWJsZSBcIiArIHN0b3JlTmFtZSArIFwiIG5vdCBpbmNsdWRlZCBpbiBwYXJlbnQgdHJhbnNhY3Rpb24uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbmx5SWZDb21wYXRpYmxlICYmIHBhcmVudFRyYW5zYWN0aW9uICYmICFwYXJlbnRUcmFuc2FjdGlvbi5hY3RpdmUpIHtcbiAgICAgICAgICBwYXJlbnRUcmFuc2FjdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcGFyZW50VHJhbnNhY3Rpb24gPyBwYXJlbnRUcmFuc2FjdGlvbi5fcHJvbWlzZShudWxsLCBmdW5jdGlvbihfLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfSkgOiByZWplY3Rpb24oZSk7XG4gICAgfVxuICAgIHZhciBlbnRlclRyYW5zYWN0aW9uID0gZW50ZXJUcmFuc2FjdGlvblNjb3BlLmJpbmQobnVsbCwgdGhpcywgaWRiTW9kZSwgc3RvcmVOYW1lcywgcGFyZW50VHJhbnNhY3Rpb24sIHNjb3BlRnVuYyk7XG4gICAgcmV0dXJuIHBhcmVudFRyYW5zYWN0aW9uID8gcGFyZW50VHJhbnNhY3Rpb24uX3Byb21pc2UoaWRiTW9kZSwgZW50ZXJUcmFuc2FjdGlvbiwgXCJsb2NrXCIpIDogUFNELnRyYW5zID8gdXNlUFNEKFBTRC50cmFuc2xlc3MsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF90aGlzLl93aGVuUmVhZHkoZW50ZXJUcmFuc2FjdGlvbik7XG4gICAgfSkgOiB0aGlzLl93aGVuUmVhZHkoZW50ZXJUcmFuc2FjdGlvbik7XG4gIH07XG4gIERleGllMi5wcm90b3R5cGUudGFibGUgPSBmdW5jdGlvbih0YWJsZU5hbWUpIHtcbiAgICBpZiAoIWhhc093bih0aGlzLl9hbGxUYWJsZXMsIHRhYmxlTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRUYWJsZShcIlRhYmxlIFwiICsgdGFibGVOYW1lICsgXCIgZG9lcyBub3QgZXhpc3RcIik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hbGxUYWJsZXNbdGFibGVOYW1lXTtcbiAgfTtcbiAgcmV0dXJuIERleGllMjtcbn0oKTtcbnZhciBzeW1ib2xPYnNlcnZhYmxlID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBcIm9ic2VydmFibGVcIiBpbiBTeW1ib2wgPyBTeW1ib2xbXCJvYnNlcnZhYmxlXCJdIDogXCJAQG9ic2VydmFibGVcIjtcbnZhciBPYnNlcnZhYmxlID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE9ic2VydmFibGUyKHN1YnNjcmliZSkge1xuICAgIHRoaXMuX3N1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgfVxuICBPYnNlcnZhYmxlMi5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24oeCwgZXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N1YnNjcmliZSh0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiID8ge25leHQ6IHgsIGVycm9yLCBjb21wbGV0ZX0gOiB4KTtcbiAgfTtcbiAgT2JzZXJ2YWJsZTIucHJvdG90eXBlW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJldHVybiBPYnNlcnZhYmxlMjtcbn0oKTtcbmZ1bmN0aW9uIGV4dGVuZE9ic2VydmFiaWxpdHlTZXQodGFyZ2V0LCBuZXdTZXQpIHtcbiAga2V5cyhuZXdTZXQpLmZvckVhY2goZnVuY3Rpb24ocGFydCkge1xuICAgIHZhciByYW5nZVNldCA9IHRhcmdldFtwYXJ0XSB8fCAodGFyZ2V0W3BhcnRdID0gbmV3IFJhbmdlU2V0KCkpO1xuICAgIG1lcmdlUmFuZ2VzKHJhbmdlU2V0LCBuZXdTZXRbcGFydF0pO1xuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIGxpdmVRdWVyeShxdWVyaWVyKSB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbihvYnNlcnZlcikge1xuICAgIHZhciBzY29wZUZ1bmNJc0FzeW5jID0gaXNBc3luY0Z1bmN0aW9uKHF1ZXJpZXIpO1xuICAgIGZ1bmN0aW9uIGV4ZWN1dGUoc3Vic2NyKSB7XG4gICAgICBpZiAoc2NvcGVGdW5jSXNBc3luYykge1xuICAgICAgICBpbmNyZW1lbnRFeHBlY3RlZEF3YWl0cygpO1xuICAgICAgfVxuICAgICAgdmFyIGV4ZWMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ld1Njb3BlKHF1ZXJpZXIsIHtzdWJzY3IsIHRyYW5zOiBudWxsfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHJ2ID0gUFNELnRyYW5zID8gdXNlUFNEKFBTRC50cmFuc2xlc3MsIGV4ZWMpIDogZXhlYygpO1xuICAgICAgaWYgKHNjb3BlRnVuY0lzQXN5bmMpIHtcbiAgICAgICAgcnYudGhlbihkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cywgZGVjcmVtZW50RXhwZWN0ZWRBd2FpdHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cbiAgICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gICAgdmFyIGFjY3VtTXV0cyA9IHt9O1xuICAgIHZhciBjdXJyZW50T2JzID0ge307XG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IHtcbiAgICAgIGdldCBjbG9zZWQoKSB7XG4gICAgICAgIHJldHVybiBjbG9zZWQ7XG4gICAgICB9LFxuICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICBnbG9iYWxFdmVudHMudHhjb21taXR0ZWQudW5zdWJzY3JpYmUobXV0YXRpb25MaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfTtcbiAgICBvYnNlcnZlci5zdGFydCAmJiBvYnNlcnZlci5zdGFydChzdWJzY3JpcHRpb24pO1xuICAgIHZhciBxdWVyeWluZyA9IGZhbHNlLCBzdGFydGVkTGlzdGVuaW5nID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gc2hvdWxkTm90aWZ5KCkge1xuICAgICAgcmV0dXJuIGtleXMoY3VycmVudE9icykuc29tZShmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIGFjY3VtTXV0c1trZXldICYmIHJhbmdlc092ZXJsYXAoYWNjdW1NdXRzW2tleV0sIGN1cnJlbnRPYnNba2V5XSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIG11dGF0aW9uTGlzdGVuZXIgPSBmdW5jdGlvbihwYXJ0cykge1xuICAgICAgZXh0ZW5kT2JzZXJ2YWJpbGl0eVNldChhY2N1bU11dHMsIHBhcnRzKTtcbiAgICAgIGlmIChzaG91bGROb3RpZnkoKSkge1xuICAgICAgICBkb1F1ZXJ5KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZG9RdWVyeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHF1ZXJ5aW5nIHx8IGNsb3NlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgYWNjdW1NdXRzID0ge307XG4gICAgICB2YXIgc3Vic2NyID0ge307XG4gICAgICB2YXIgcmV0ID0gZXhlY3V0ZShzdWJzY3IpO1xuICAgICAgaWYgKCFzdGFydGVkTGlzdGVuaW5nKSB7XG4gICAgICAgIGdsb2JhbEV2ZW50cyhcInR4Y29tbWl0dGVkXCIsIG11dGF0aW9uTGlzdGVuZXIpO1xuICAgICAgICBzdGFydGVkTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHF1ZXJ5aW5nID0gdHJ1ZTtcbiAgICAgIFByb21pc2UucmVzb2x2ZShyZXQpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHF1ZXJ5aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChjbG9zZWQpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoc2hvdWxkTm90aWZ5KCkpIHtcbiAgICAgICAgICBkb1F1ZXJ5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWNjdW1NdXRzID0ge307XG4gICAgICAgICAgY3VycmVudE9icyA9IHN1YnNjcjtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0ICYmIG9ic2VydmVyLm5leHQocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHF1ZXJ5aW5nID0gZmFsc2U7XG4gICAgICAgIG9ic2VydmVyLmVycm9yICYmIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBkb1F1ZXJ5KCk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfSk7XG59XG52YXIgRGV4aWUgPSBEZXhpZSQxO1xucHJvcHMoRGV4aWUsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBmdWxsTmFtZUV4Y2VwdGlvbnMpLCB7XG4gIGRlbGV0ZTogZnVuY3Rpb24oZGF0YWJhc2VOYW1lKSB7XG4gICAgdmFyIGRiID0gbmV3IERleGllKGRhdGFiYXNlTmFtZSk7XG4gICAgcmV0dXJuIGRiLmRlbGV0ZSgpO1xuICB9LFxuICBleGlzdHM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IERleGllKG5hbWUsIHthZGRvbnM6IFtdfSkub3BlbigpLnRoZW4oZnVuY3Rpb24oZGIpIHtcbiAgICAgIGRiLmNsb3NlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KS5jYXRjaChcIk5vU3VjaERhdGFiYXNlRXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH0sXG4gIGdldERhdGFiYXNlTmFtZXM6IGZ1bmN0aW9uKGNiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBnZXREYXRhYmFzZU5hbWVzKERleGllLmRlcGVuZGVuY2llcykudGhlbihjYik7XG4gICAgfSBjYXRjaCAoX2EyKSB7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKG5ldyBleGNlcHRpb25zLk1pc3NpbmdBUEkoKSk7XG4gICAgfVxuICB9LFxuICBkZWZpbmVDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQ2xhc3MoY29udGVudCkge1xuICAgICAgZXh0ZW5kKHRoaXMsIGNvbnRlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gQ2xhc3M7XG4gIH0sXG4gIGlnbm9yZVRyYW5zYWN0aW9uOiBmdW5jdGlvbihzY29wZUZ1bmMpIHtcbiAgICByZXR1cm4gUFNELnRyYW5zID8gdXNlUFNEKFBTRC50cmFuc2xlc3MsIHNjb3BlRnVuYykgOiBzY29wZUZ1bmMoKTtcbiAgfSxcbiAgdmlwLFxuICBhc3luYzogZnVuY3Rpb24oZ2VuZXJhdG9yRm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcnYgPSBhd2FpdEl0ZXJhdG9yKGdlbmVyYXRvckZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgICBpZiAoIXJ2IHx8IHR5cGVvZiBydi50aGVuICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHJ2KTtcbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gcmVqZWN0aW9uKGUpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHNwYXduOiBmdW5jdGlvbihnZW5lcmF0b3JGbiwgYXJncywgdGhpeikge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcnYgPSBhd2FpdEl0ZXJhdG9yKGdlbmVyYXRvckZuLmFwcGx5KHRoaXosIGFyZ3MgfHwgW10pKTtcbiAgICAgIGlmICghcnYgfHwgdHlwZW9mIHJ2LnRoZW4gIT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgcmV0dXJuIERleGllUHJvbWlzZS5yZXNvbHZlKHJ2KTtcbiAgICAgIHJldHVybiBydjtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcmVqZWN0aW9uKGUpO1xuICAgIH1cbiAgfSxcbiAgY3VycmVudFRyYW5zYWN0aW9uOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQU0QudHJhbnMgfHwgbnVsbDtcbiAgICB9XG4gIH0sXG4gIHdhaXRGb3I6IGZ1bmN0aW9uKHByb21pc2VPckZ1bmN0aW9uLCBvcHRpb25hbFRpbWVvdXQpIHtcbiAgICB2YXIgcHJvbWlzZSA9IERleGllUHJvbWlzZS5yZXNvbHZlKHR5cGVvZiBwcm9taXNlT3JGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiID8gRGV4aWUuaWdub3JlVHJhbnNhY3Rpb24ocHJvbWlzZU9yRnVuY3Rpb24pIDogcHJvbWlzZU9yRnVuY3Rpb24pLnRpbWVvdXQob3B0aW9uYWxUaW1lb3V0IHx8IDZlNCk7XG4gICAgcmV0dXJuIFBTRC50cmFucyA/IFBTRC50cmFucy53YWl0Rm9yKHByb21pc2UpIDogcHJvbWlzZTtcbiAgfSxcbiAgUHJvbWlzZTogRGV4aWVQcm9taXNlLFxuICBkZWJ1Zzoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZGVidWc7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBzZXREZWJ1Zyh2YWx1ZSwgdmFsdWUgPT09IFwiZGV4aWVcIiA/IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gOiBkZXhpZVN0YWNrRnJhbWVGaWx0ZXIpO1xuICAgIH1cbiAgfSxcbiAgZGVyaXZlLFxuICBleHRlbmQsXG4gIHByb3BzLFxuICBvdmVycmlkZSxcbiAgRXZlbnRzLFxuICBvbjogZ2xvYmFsRXZlbnRzLFxuICBsaXZlUXVlcnksXG4gIGV4dGVuZE9ic2VydmFiaWxpdHlTZXQsXG4gIGdldEJ5S2V5UGF0aCxcbiAgc2V0QnlLZXlQYXRoLFxuICBkZWxCeUtleVBhdGgsXG4gIHNoYWxsb3dDbG9uZSxcbiAgZGVlcENsb25lLFxuICBnZXRPYmplY3REaWZmLFxuICBhc2FwOiBhc2FwJDEsXG4gIG1pbktleSxcbiAgYWRkb25zOiBbXSxcbiAgY29ubmVjdGlvbnMsXG4gIGVycm5hbWVzLFxuICBkZXBlbmRlbmNpZXM6IGRvbURlcHMsXG4gIHNlbVZlcjogREVYSUVfVkVSU0lPTixcbiAgdmVyc2lvbjogREVYSUVfVkVSU0lPTi5zcGxpdChcIi5cIikubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobik7XG4gIH0pLnJlZHVjZShmdW5jdGlvbihwLCBjLCBpKSB7XG4gICAgcmV0dXJuIHAgKyBjIC8gTWF0aC5wb3coMTAsIGkgKiAyKTtcbiAgfSlcbn0pKTtcbkRleGllLm1heEtleSA9IGdldE1heEtleShEZXhpZS5kZXBlbmRlbmNpZXMuSURCS2V5UmFuZ2UpO1xuZnVuY3Rpb24gZmlyZUxvY2FsbHkodXBkYXRlUGFydHMpIHtcbiAgdmFyIHdhc01lID0gcHJvcGFnYXRpbmdMb2NhbGx5O1xuICB0cnkge1xuICAgIHByb3BhZ2F0aW5nTG9jYWxseSA9IHRydWU7XG4gICAgZ2xvYmFsRXZlbnRzLnR4Y29tbWl0dGVkLmZpcmUodXBkYXRlUGFydHMpO1xuICB9IGZpbmFsbHkge1xuICAgIHByb3BhZ2F0aW5nTG9jYWxseSA9IHdhc01lO1xuICB9XG59XG52YXIgcHJvcGFnYXRlTG9jYWxseSA9IGZpcmVMb2NhbGx5O1xudmFyIHByb3BhZ2F0aW5nTG9jYWxseSA9IGZhbHNlO1xudmFyIGFjY3VtdWxhdGVkUGFydHMgPSB7fTtcbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICB2YXIgZmlyZUlmVmlzaWJsZV8xID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIpIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhY2N1bXVsYXRlZFBhcnRzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpcmVMb2NhbGx5KGFjY3VtdWxhdGVkUGFydHMpO1xuICAgICAgfVxuICAgICAgYWNjdW11bGF0ZWRQYXJ0cyA9IHt9O1xuICAgIH1cbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgZmlyZUlmVmlzaWJsZV8xKTtcbiAgcHJvcGFnYXRlTG9jYWxseSA9IGZ1bmN0aW9uKGNoYW5nZWRQYXJ0cykge1xuICAgIGV4dGVuZE9ic2VydmFiaWxpdHlTZXQoYWNjdW11bGF0ZWRQYXJ0cywgY2hhbmdlZFBhcnRzKTtcbiAgICBmaXJlSWZWaXNpYmxlXzEoKTtcbiAgfTtcbn1cbmlmICh0eXBlb2YgQnJvYWRjYXN0Q2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICB2YXIgYmNfMSA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKFwiZGV4aWUtdHhjb21taXR0ZWRcIik7XG4gIGdsb2JhbEV2ZW50cyhcInR4Y29tbWl0dGVkXCIsIGZ1bmN0aW9uKGNoYW5nZWRQYXJ0cykge1xuICAgIGlmICghcHJvcGFnYXRpbmdMb2NhbGx5KSB7XG4gICAgICBiY18xLnBvc3RNZXNzYWdlKGNoYW5nZWRQYXJ0cyk7XG4gICAgfVxuICB9KTtcbiAgYmNfMS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldikge1xuICAgIGlmIChldi5kYXRhKVxuICAgICAgcHJvcGFnYXRlTG9jYWxseShldi5kYXRhKTtcbiAgfTtcbn0gZWxzZSBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBnbG9iYWxFdmVudHMoXCJ0eGNvbW1pdHRlZFwiLCBmdW5jdGlvbihjaGFuZ2VkUGFydHMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFwcm9wYWdhdGluZ0xvY2FsbHkpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkZXhpZS10eGNvbW1pdHRlZFwiLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdHJpZzogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgICBjaGFuZ2VkUGFydHNcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKF9hMikge1xuICAgIH1cbiAgfSk7XG4gIGFkZEV2ZW50TGlzdGVuZXIoXCJzdG9yYWdlXCIsIGZ1bmN0aW9uKGV2KSB7XG4gICAgaWYgKGV2LmtleSA9PT0gXCJkZXhpZS10eGNvbW1pdHRlZFwiKSB7XG4gICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoZXYubmV3VmFsdWUpO1xuICAgICAgaWYgKGRhdGEpXG4gICAgICAgIHByb3BhZ2F0ZUxvY2FsbHkoZGF0YS5jaGFuZ2VkUGFydHMpO1xuICAgIH1cbiAgfSk7XG59XG5EZXhpZVByb21pc2UucmVqZWN0aW9uTWFwcGVyID0gbWFwRXJyb3I7XG5zZXREZWJ1ZyhkZWJ1ZywgZGV4aWVTdGFja0ZyYW1lRmlsdGVyKTtcbmV4cG9ydCBkZWZhdWx0IERleGllJDE7XG5leHBvcnQge0RleGllJDEgYXMgRGV4aWUsIFJhbmdlU2V0LCBsaXZlUXVlcnksIG1lcmdlUmFuZ2VzLCByYW5nZXNPdmVybGFwfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXdvZ0lDSjJaWEp6YVc5dUlqb2dNeXdLSUNBaWMyOTFjbU5sY3lJNklGc2lRenBjWEhkdmNtdHpjR0ZqWlZ4Y2JXOXVaWGxjWEc1dlpHVmZiVzlrZFd4bGMxeGNMbkJ1Y0cxY1hHUmxlR2xsUURNdU1TNHdMV0ZzY0doaExqRXdYRnh1YjJSbFgyMXZaSFZzWlhOY1hHUmxlR2xsWEZ4a2FYTjBYRnhrWlhocFpTNXRhbk1pWFN3S0lDQWliV0Z3Y0dsdVozTWlPaUFpUVVGaFFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZaUVN4SlFVRkpMRmRCUVZjc1YwRkJWenRCUVVOMFFpeGhRVUZYTEU5QlFVOHNWVUZCVlN4dFFrRkJhMElzUjBGQlJ6dEJRVU0zUXl4aFFVRlRMRWRCUVVjc1NVRkJTU3hIUVVGSExFbEJRVWtzVlVGQlZTeFJRVUZSTEVsQlFVa3NSMEZCUnl4TFFVRkxPMEZCUTJwRUxGVkJRVWtzVlVGQlZUdEJRVU5rTEdWQlFWTXNTMEZCU3p0QlFVRkhMRmxCUVVrc1QwRkJUeXhWUVVGVkxHVkJRV1VzUzBGQlN5eEhRVUZITzBGQlFVa3NXVUZCUlN4TFFVRkxMRVZCUVVVN1FVRkJRVHRCUVVVNVJTeFhRVUZQTzBGQlFVRTdRVUZGV0N4VFFVRlBMRk5CUVZNc1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGRmFFTXNkVUpCUVhWQ0xFbEJRVWtzVFVGQlRUdEJRVU0zUWl4WFFVRlRMRWxCUVVrc1IwRkJSeXhMUVVGTExFdEJRVXNzVVVGQlVTeEpRVUZKTEVkQlFVY3NVVUZCVVN4SlFVRkpMRWxCUVVrc1MwRkJTenRCUVVNeFJDeFBRVUZITEV0QlFVc3NTMEZCU3p0QlFVTnFRaXhUUVVGUE8wRkJRVUU3UVVGSFdDeEpRVUZKTEU5QlFVOHNUMEZCVHp0QlFVTnNRaXhKUVVGSkxGVkJRVlVzVFVGQlRUdEJRVU53UWl4SlFVRkpMRlZCUVZVc1QwRkJUeXhUUVVGVExHTkJRV01zVDBGRGVFTXNUMEZCVHl4WFFVRlhMR05CUVdNc1UwRkROVUk3UVVGRFVpeEpRVUZKTEU5QlFVOHNXVUZCV1N4bFFVRmxMRU5CUVVNc1VVRkJVU3hUUVVGVE8wRkJRM0JFTEZWQlFWRXNWVUZCVlR0QlFVRkJPMEZCUlhSQ0xHZENRVUZuUWl4TFFVRkxMRmRCUVZjN1FVRkROVUlzVFVGQlNTeFBRVUZQTEdOQlFXTTdRVUZEY2tJc1YwRkJUenRCUVVOWUxFOUJRVXNzVjBGQlZ5eFJRVUZSTEZOQlFWVXNTMEZCU3p0QlFVTnVReXhSUVVGSkxFOUJRVThzVlVGQlZUdEJRVUZCTzBGQlJYcENMRk5CUVU4N1FVRkJRVHRCUVVWWUxFbEJRVWtzVjBGQlZ5eFBRVUZQTzBGQlEzUkNMRWxCUVVrc1ZVRkJWU3hIUVVGSE8wRkJRMnBDTEdkQ1FVRm5RaXhMUVVGTExFMUJRVTA3UVVGRGRrSXNVMEZCVHl4UlFVRlJMRXRCUVVzc1MwRkJTenRCUVVGQk8wRkJSVGRDTEdWQlFXVXNUMEZCVHl4WFFVRlhPMEZCUXpkQ0xFMUJRVWtzVDBGQlR5eGpRVUZqTzBGQlEzSkNMR2RDUVVGWkxGVkJRVlVzVTBGQlV6dEJRVU51UXl4RlFVRkRMRkZCUVU4c1dVRkJXU3hqUVVGakxFOUJRVThzVVVGQlVTeFRRVUZUTEZkQlFWY3NVVUZCVVN4VFFVRlZMRXRCUVVzN1FVRkRlRVlzV1VGQlVTeFBRVUZQTEV0QlFVc3NWVUZCVlR0QlFVRkJPMEZCUVVFN1FVRkhkRU1zU1VGQlNTeHBRa0ZCYVVJc1QwRkJUenRCUVVNMVFpeHBRa0ZCYVVJc1MwRkJTeXhOUVVGTkxHdENRVUZyUWl4VFFVRlRPMEZCUTI1RUxHbENRVUZsTEV0QlFVc3NUVUZCVFN4UFFVRlBMRzlDUVVGdlFpeFBRVUZQTEd0Q1FVRnJRaXhWUVVGVkxFOUJRVThzYVVKQlFXbENMRkZCUVZFc1lVRkRjRWdzUTBGQlJTeExRVUZMTEdsQ1FVRnBRaXhMUVVGTExFdEJRVXNzYVVKQlFXbENMRXRCUVVzc1kwRkJZeXhSUVVOMFJTeERRVUZGTEU5QlFVOHNhMEpCUVd0Q0xHTkJRV01zVFVGQlRTeFZRVUZWTEU5QlFWRTdRVUZCUVR0QlFVVjZSU3huUWtGQlowSXNUMEZCVHp0QlFVTnVRaXhUUVVGUE8wRkJRVUVzU1VGRFNDeE5RVUZOTEZOQlFWVXNVVUZCVVR0QlFVTndRaXhaUVVGTkxGbEJRVmtzVDBGQlR5eFBRVUZQTEU5QlFVODdRVUZEZGtNc1kwRkJVU3hOUVVGTkxGZEJRVmNzWlVGQlpUdEJRVU40UXl4aFFVRlBPMEZCUVVFc1VVRkRTQ3hSUVVGUkxFMUJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVzdlF5eEpRVUZKTERKQ1FVRXlRaXhQUVVGUE8wRkJRM1JETEN0Q1FVRXJRaXhMUVVGTExFMUJRVTA3UVVGRGRFTXNUVUZCU1N4TFFVRkxMSGxDUVVGNVFpeExRVUZMTzBGQlEzWkRMRTFCUVVrN1FVRkRTaXhUUVVGUExFMUJRVThzVTBGQlVTeFRRVUZUTEZOQlFWTXNjMEpCUVhOQ0xFOUJRVTg3UVVGQlFUdEJRVVY2UlN4SlFVRkpMRk5CUVZNc1IwRkJSenRCUVVOb1FpeGxRVUZsTEUxQlFVMHNUMEZCVHl4TFFVRkxPMEZCUXpkQ0xGTkJRVThzVDBGQlR5eExRVUZMTEUxQlFVMHNUMEZCVHp0QlFVRkJPMEZCUlhCRExHdENRVUZyUWl4VlFVRlZMR3RDUVVGclFqdEJRVU14UXl4VFFVRlBMR2xDUVVGcFFqdEJRVUZCTzBGQlJUVkNMR2RDUVVGblFpeEhRVUZITzBGQlEyWXNUVUZCU1N4RFFVRkRPMEZCUTBRc1ZVRkJUU3hKUVVGSkxFMUJRVTA3UVVGQlFUdEJRVVY0UWl4blFrRkJaMElzU1VGQlNUdEJRVU5vUWl4TlFVRkpMRkZCUVZFN1FVRkRVaXhwUWtGQllUdEJRVUZCTzBGQlJXSXNaVUZCVnl4SlFVRkpPMEZCUVVFN1FVRkZka0lzZFVKQlFYVkNMRTlCUVU4c1YwRkJWenRCUVVOeVF5eFRRVUZQTEUxQlFVMHNUMEZCVHl4VFFVRlZMRkZCUVZFc1RVRkJUU3hIUVVGSE8wRkJRek5ETEZGQlFVa3NaVUZCWlN4VlFVRlZMRTFCUVUwN1FVRkRia01zVVVGQlNUdEJRVU5CTEdGQlFVOHNZVUZCWVN4TlFVRk5MR0ZCUVdFN1FVRkRNME1zVjBGQlR6dEJRVUZCTEV0QlExSTdRVUZCUVR0QlFVVlFMR3RDUVVGclFpeEpRVUZKTEZOQlFWTXNUVUZCVFR0QlFVTnFReXhOUVVGSk8wRkJRMEVzVDBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZCUVN4WFFVVmFMRWxCUVZBN1FVRkRTU3hsUVVGWExGRkJRVkU3UVVGQlFUdEJRVUZCTzBGQlJ6TkNMSE5DUVVGelFpeExRVUZMTEZOQlFWTTdRVUZEYUVNc1RVRkJTU3hQUVVGUExFdEJRVXM3UVVGRFdpeFhRVUZQTEVsQlFVazdRVUZEWml4TlFVRkpMRU5CUVVNN1FVRkRSQ3hYUVVGUE8wRkJRMWdzVFVGQlNTeFBRVUZQTEZsQlFWa3NWVUZCVlR0QlFVTTNRaXhSUVVGSkxFdEJRVXM3UVVGRFZDeGhRVUZUTEVsQlFVa3NSMEZCUnl4SlFVRkpMRkZCUVZFc1VVRkJVU3hKUVVGSkxFZEJRVWNzUlVGQlJTeEhRVUZITzBGQlF6VkRMRlZCUVVrc1RVRkJUU3hoUVVGaExFdEJRVXNzVVVGQlVUdEJRVU53UXl4VFFVRkhMRXRCUVVzN1FVRkJRVHRCUVVWYUxGZEJRVTg3UVVGQlFUdEJRVVZZTEUxQlFVa3NVMEZCVXl4UlFVRlJMRkZCUVZFN1FVRkROMElzVFVGQlNTeFhRVUZYTEVsQlFVazdRVUZEWml4UlFVRkpMRmRCUVZjc1NVRkJTU3hSUVVGUkxFOUJRVThzUjBGQlJ6dEJRVU55UXl4WFFVRlBMR0ZCUVdFc1UwRkJXU3hUUVVGWkxHRkJRV0VzVlVGQlZTeFJRVUZSTEU5QlFVOHNVMEZCVXp0QlFVRkJPMEZCUlM5R0xGTkJRVTg3UVVGQlFUdEJRVVZZTEhOQ1FVRnpRaXhMUVVGTExGTkJRVk1zVDBGQlR6dEJRVU4yUXl4TlFVRkpMRU5CUVVNc1QwRkJUeXhaUVVGWk8wRkJRM0JDTzBGQlEwb3NUVUZCU1N4alFVRmpMRlZCUVZVc1QwRkJUeXhUUVVGVE8wRkJRM2hETzBGQlEwb3NUVUZCU1N4UFFVRlBMRmxCUVZrc1dVRkJXU3haUVVGWkxGTkJRVk03UVVGRGNFUXNWMEZCVHl4UFFVRlBMRlZCUVZVc1dVRkJXU3haUVVGWk8wRkJRMmhFTEdGQlFWTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1VVRkJVU3hSUVVGUkxFbEJRVWtzUjBGQlJ5eEZRVUZGTEVkQlFVYzdRVUZETlVNc2JVSkJRV0VzUzBGQlN5eFJRVUZSTEVsQlFVa3NUVUZCVFR0QlFVRkJPMEZCUVVFc1UwRkhka003UVVGRFJDeFJRVUZKTEZOQlFWTXNVVUZCVVN4UlFVRlJPMEZCUXpkQ0xGRkJRVWtzVjBGQlZ5eEpRVUZKTzBGQlEyWXNWVUZCU1N4cFFrRkJhVUlzVVVGQlVTeFBRVUZQTEVkQlFVYzdRVUZEZGtNc1ZVRkJTU3h0UWtGQmJVSXNVVUZCVVN4UFFVRlBMRk5CUVZNN1FVRkRMME1zVlVGQlNTeHhRa0ZCY1VJN1FVRkRja0lzV1VGQlNTeFZRVUZWTEZGQlFWYzdRVUZEY2tJc1kwRkJTU3hSUVVGUkxGRkJRVkVzUTBGQlF5eE5RVUZOTEZOQlFWTTdRVUZEYUVNc1owSkJRVWtzVDBGQlR5eG5Ra0ZCWjBJN1FVRkJRVHRCUVVVelFpeHRRa0ZCVHl4SlFVRkpPMEZCUVVFN1FVRkhaaXhqUVVGSkxHdENRVUZyUWp0QlFVRkJMRmRCUTNwQ08wRkJRMFFzV1VGQlNTeFhRVUZYTEVsQlFVazdRVUZEYmtJc1dVRkJTU3hEUVVGRE8wRkJRMFFzY1VKQlFWa3NTVUZCU1N4clFrRkJhMEk3UVVGRGRFTXNjVUpCUVdFc1ZVRkJWU3hyUWtGQmEwSTdRVUZCUVR0QlFVRkJMRmRCUnpWRE8wRkJRMFFzVlVGQlNTeFZRVUZWTEZGQlFWYzdRVUZEY2tJc1dVRkJTU3hSUVVGUkxGRkJRVkVzUTBGQlF5eE5RVUZOTEZOQlFWTTdRVUZEYUVNc1kwRkJTU3hQUVVGUExGTkJRVk03UVVGQlFUdEJRVVZ3UWl4cFFrRkJUeXhKUVVGSk8wRkJRVUU3UVVGSFppeFpRVUZKTEZkQlFWYzdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkpMMElzYzBKQlFYTkNMRXRCUVVzc1UwRkJVenRCUVVOb1F5eE5RVUZKTEU5QlFVOHNXVUZCV1R0QlFVTnVRaXhwUWtGQllTeExRVUZMTEZOQlFWTTdRVUZCUVN4WFFVTjBRaXhaUVVGWk8wRkJRMnBDTEU5QlFVY3NTVUZCU1N4TFFVRkxMRk5CUVZNc1UwRkJWU3hKUVVGSk8wRkJReTlDTEcxQ1FVRmhMRXRCUVVzc1NVRkJTVHRCUVVGQk8wRkJRVUU3UVVGSGJFTXNjMEpCUVhOQ0xFdEJRVXM3UVVGRGRrSXNUVUZCU1N4TFFVRkxPMEZCUTFRc1YwRkJVeXhMUVVGTExFdEJRVXM3UVVGRFppeFJRVUZKTEU5QlFVOHNTMEZCU3p0QlFVTmFMRk5CUVVjc1MwRkJTeXhKUVVGSk8wRkJRVUU3UVVGRmNFSXNVMEZCVHp0QlFVRkJPMEZCUlZnc1NVRkJTU3hUUVVGVExFZEJRVWM3UVVGRGFFSXNhVUpCUVdsQ0xFZEJRVWM3UVVGRGFFSXNVMEZCVHl4UFFVRlBMRTFCUVUwc1NVRkJTVHRCUVVGQk8wRkJSVFZDTEVsQlFVa3NjVUpCUVhGQ0xDdElRVU53UWl4TlFVRk5MRXRCUVVzc1QwRkJUeXhSUVVGUkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVRkpMRk5CUVZVc1MwRkJTenRCUVVGRkxGTkJRVThzUTBGQlF5eFBRVUZQTEZGQlFWRXNVMEZCVXl4SlFVRkpMRk5CUVZVc1IwRkJSenRCUVVGRkxGZEJRVThzU1VGQlNTeE5RVUZOTzBGQlFVRTdRVUZCUVN4TFFVRnJRaXhQUVVGUExGTkJRVlVzUjBGQlJ6dEJRVUZGTEZOQlFVOHNVVUZCVVR0QlFVRkJPMEZCUXk5TUxFbEJRVWtzYVVKQlFXbENMRzFDUVVGdFFpeEpRVUZKTEZOQlFWVXNSMEZCUnp0QlFVRkZMRk5CUVU4c1VVRkJVVHRCUVVGQk8wRkJRekZGTEVsQlFVa3NkVUpCUVhWQ0xHTkJRV01zYjBKQlFXOUNMRk5CUVZVc1IwRkJSenRCUVVGRkxGTkJRVThzUTBGQlF5eEhRVUZITzBGQlFVRTdRVUZEZGtZc1NVRkJTU3hsUVVGbE8wRkJRMjVDTEcxQ1FVRnRRaXhMUVVGTE8wRkJRM0JDTEdsQ1FVRmxMRTlCUVU4c1dVRkJXU3hsUVVGbExFbEJRVWs3UVVGRGNrUXNUVUZCU1N4TFFVRkxMR1ZCUVdVN1FVRkRlRUlzYVVKQlFXVTdRVUZEWml4VFFVRlBPMEZCUVVFN1FVRkZXQ3gzUWtGQmQwSXNTMEZCU3p0QlFVTjZRaXhOUVVGSkxFTkJRVU1zVDBGQlR5eFBRVUZQTEZGQlFWRTdRVUZEZGtJc1YwRkJUenRCUVVOWUxFMUJRVWtzUzBGQlN5eG5Ra0ZCWjBJc1lVRkJZU3hKUVVGSk8wRkJRekZETEUxQlFVazdRVUZEUVN4WFFVRlBPMEZCUTFnc1RVRkJTU3hSUVVGUkxFMUJRVTA3UVVGRFpDeFRRVUZMTzBGQlEwd3NiMEpCUVdkQ0xHRkJRV0VzU1VGQlNTeExRVUZMTzBGQlEzUkRMR0ZCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzU1VGQlNTeFJRVUZSTEVsQlFVa3NSMEZCUnl4RlFVRkZMRWRCUVVjN1FVRkRlRU1zVTBGQlJ5eExRVUZMTEdWQlFXVXNTVUZCU1R0QlFVRkJPMEZCUVVFc1lVRkhNVUlzWlVGQlpTeFJRVUZSTEVsQlFVa3NaMEpCUVdkQ0xFZEJRVWM3UVVGRGJrUXNVMEZCU3p0QlFVRkJMRk5CUlVvN1FVRkRSQ3hSUVVGSkxGRkJRVkVzVTBGQlV6dEJRVU55UWl4VFFVRkxMRlZCUVZVc1QwRkJUeXhaUVVGWkxFdEJRVXNzVDBGQlR5eFBRVUZQTzBGQlEzSkVMRzlDUVVGblFpeGhRVUZoTEVsQlFVa3NTMEZCU3p0QlFVTjBReXhoUVVGVExGRkJRVkVzUzBGQlN6dEJRVU5zUWl4VlFVRkpMRTlCUVU4c1MwRkJTeXhQUVVGUE8wRkJRMjVDTEZkQlFVY3NVVUZCVVN4bFFVRmxMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSk1VTXNVMEZCVHp0QlFVRkJPMEZCUlZnc1NVRkJTU3hYUVVGWExFZEJRVWM3UVVGRGJFSXNjVUpCUVhGQ0xFZEJRVWM3UVVGRGNFSXNVMEZCVHl4VFFVRlRMRXRCUVVzc1IwRkJSeXhOUVVGTkxFZEJRVWM3UVVGQlFUdEJRVVZ5UXl4SlFVRkpMR0ZCUVdFc1UwRkJWU3hMUVVGTExFMUJRVTA3UVVGRGJFTXNVMEZCVHl4VFFVRlRMRlZCUVZVc1MwRkJTeXhKUVVGSkxFbEJRVWtzVTBGQlZTeEhRVUZITzBGQlFVVXNWMEZCVHl4WFFVRlhMRWRCUVVjc1dVRkJXVHRCUVVGQkxFOUJRMjVHTEZOQlFWTXNaMEpCUVdkQ0xFdEJRVXNzU1VGQlNTeFhRVUZYTEU5QlEzcERMRk5CUVZNc1UwRkJVeXhKUVVGSkxGbEJRMnhDTEZsQlFWa3NUMEZCVHl4UFFVRlBMRXRCUVVzc1NVRkJTU3hYUVVGWExFbEJRVWtzVlVGRE9VTTdRVUZCUVR0QlFVVndRaXgxUWtGQmRVSXNSMEZCUnl4SFFVRkhMRWxCUVVrc1RVRkJUVHRCUVVOdVF5eFBRVUZMTEUxQlFVMDdRVUZEV0N4VFFVRlBMRkZCUVZFN1FVRkRaaXhQUVVGTExFZEJRVWNzVVVGQlVTeFRRVUZWTEUxQlFVMDdRVUZETlVJc1VVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ6dEJRVU5ZTEZOQlFVY3NUMEZCVHl4UlFVRlJPMEZCUVVFc1UwRkRha0k3UVVGRFJDeFZRVUZKTEV0QlFVc3NSVUZCUlN4UFFVRlBMRXRCUVVzc1JVRkJSVHRCUVVONlFpeFZRVUZKTEU5QlFVOHNUMEZCVHl4WlFVRlpMRTlCUVU4c1QwRkJUeXhaUVVGWkxFMUJRVTBzU1VGQlNUdEJRVU01UkN4WlFVRkpMR0ZCUVdFc1dVRkJXVHRCUVVNM1FpeFpRVUZKTEdGQlFXRXNXVUZCV1R0QlFVTTNRaXhaUVVGSkxHVkJRV1VzV1VGQldUdEJRVU16UWl4alFVRkpMSEZDUVVGeFFpeGxRVUZsTEZGQlFWRXNTMEZCU3p0QlFVTnFSQ3huUWtGQlNTeFhRVUZYTEVsQlFVa3NaMEpCUVdkQ0xGZEJRVmNzU1VGQlNTeGhRVUZoTzBGQlF6TkVMR2xDUVVGSExFOUJRVThzVVVGQlVTeEZRVUZGTzBGQlFVRTdRVUZCUVN4cFFrRkhka0k3UVVGRFJDd3dRa0ZCWXl4SlFVRkpMRWxCUVVrc1NVRkJTU3hQUVVGUExFOUJRVTg3UVVGQlFUdEJRVUZCTEdWQlJ6TkRPMEZCUTBRc1lVRkJSeXhQUVVGUExGRkJRVkVzUlVGQlJUdEJRVUZCTzBGQlFVRXNhVUpCUjI1Q0xFOUJRVTg3UVVGRFdpeFhRVUZITEU5QlFVOHNVVUZCVVN4RlFVRkZPMEZCUVVFN1FVRkJRVHRCUVVkb1F5eFBRVUZMTEVkQlFVY3NVVUZCVVN4VFFVRlZMRTFCUVUwN1FVRkROVUlzVVVGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBPMEZCUTJ4Q0xGTkJRVWNzVDBGQlR5eFJRVUZSTEVWQlFVVTdRVUZCUVR0QlFVRkJPMEZCUnpWQ0xGTkJRVTg3UVVGQlFUdEJRVVZZTEVsQlFVa3NhVUpCUVdsQ0xFOUJRVThzVjBGQlZ5eGpRVU51UXl4UFFVRlBMRmRCUTFBN1FVRkRTaXhKUVVGSkxHZENRVUZuUWl4UFFVRlBMRzFDUVVGdFFpeFhRVUZYTEZOQlFWVXNSMEZCUnp0QlFVTnNSU3hOUVVGSk8wRkJRMG9zVTBGQlR5eExRVUZMTEZGQlFWTXNTMEZCU1N4RlFVRkZMRzlDUVVGdlFpeEZRVUZGTEUxQlFVMDdRVUZCUVN4SlFVTjJSQ3hYUVVGWk8wRkJRVVVzVTBGQlR6dEJRVUZCTzBGQlEzcENMRWxCUVVrc1owSkJRV2RDTzBGQlEzQkNMRzlDUVVGdlFpeFhRVUZYTzBGQlF6TkNMRTFCUVVrc1IwRkJSeXhIUVVGSExFZEJRVWM3UVVGRFlpeE5RVUZKTEZWQlFWVXNWMEZCVnl4SFFVRkhPMEZCUTNoQ0xGRkJRVWtzVVVGQlVUdEJRVU5TTEdGQlFVOHNWVUZCVlR0QlFVTnlRaXhSUVVGSkxGTkJRVk1zYVVKQlFXbENMRTlCUVU4c1kwRkJZenRCUVVNdlF5eGhRVUZQTEVOQlFVTTdRVUZEV2l4UlFVRkxMRXRCUVVzc1kwRkJZeXhaUVVGaE8wRkJRMnBETEZWQlFVazdRVUZEU2l4aFFVRlJMRWxCUVVrc1IwRkJSeXhSUVVGVExFTkJRVU1zUlVGQlJUdEJRVU4yUWl4VlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVOaUxHRkJRVTg3UVVGQlFUdEJRVVZZTEZGQlFVa3NZVUZCWVR0QlFVTmlMR0ZCUVU4c1EwRkJRenRCUVVOYUxGRkJRVWtzVlVGQlZUdEJRVU5rTEZGQlFVa3NUMEZCVHl4TlFVRk5MRlZCUVZVN1FVRkRka0lzVlVGQlNTeEpRVUZKTEUxQlFVMDdRVUZEWkN4aFFVRlBPMEZCUTBnc1ZVRkJSU3hMUVVGTExGVkJRVlU3UVVGRGNrSXNZVUZCVHp0QlFVRkJPMEZCUlZnc1YwRkJUeXhEUVVGRE8wRkJRVUU3UVVGRldpeE5RVUZKTEZWQlFWVTdRVUZEWkN4TlFVRkpMRWxCUVVrc1RVRkJUVHRCUVVOa0xGTkJRVTg3UVVGRFNDeE5RVUZGTEV0QlFVc3NWVUZCVlR0QlFVTnlRaXhUUVVGUE8wRkJRVUU3UVVGRldDeEpRVUZKTEd0Q1FVRnJRaXhQUVVGUExGZEJRVmNzWTBGRGJFTXNVMEZCVlN4SlFVRkpPMEZCUVVVc1UwRkJUeXhIUVVGSExFOUJRVThzYVVKQlFXbENPMEZCUVVFc1NVRkRiRVFzVjBGQldUdEJRVUZGTEZOQlFVODdRVUZCUVR0QlFVVXpRaXhKUVVGSkxGRkJRVkVzVDBGQlR5eGhRVUZoTEdWQlF6VkNMRFpEUVVFMlF5eExRVUZMTEZOQlFWTTdRVUZETDBRc2EwSkJRV3RDTEU5QlFVOHNVVUZCVVR0QlFVTTNRaXhWUVVGUk8wRkJRMUlzYTBKQlFXZENPMEZCUVVFN1FVRkZjRUlzU1VGQlNTeG5Ra0ZCWjBJc1YwRkJXVHRCUVVGRkxGTkJRVTg3UVVGQlFUdEJRVU42UXl4SlFVRkpMSGRDUVVGM1FpeERRVUZETEVsQlFVa3NUVUZCVFN4SlFVRkpPMEZCUXpORExEWkNRVUUyUWp0QlFVTjZRaXhOUVVGSk8wRkJRMEVzVVVGQlNUdEJRVU5CTEhkQ1FVRnJRanRCUVVOc1FpeFpRVUZOTEVsQlFVazdRVUZCUVN4aFFVVlFMRWRCUVZBN1FVRkRTU3hoUVVGUE8wRkJRVUU3UVVGRlppeFRRVUZQTEVsQlFVazdRVUZCUVR0QlFVVm1MSEZDUVVGeFFpeFhRVUZYTEd0Q1FVRnJRanRCUVVNNVF5eE5RVUZKTEZGQlFWRXNWVUZCVlR0QlFVTjBRaXhOUVVGSkxFTkJRVU03UVVGRFJDeFhRVUZQTzBGQlExZ3NjVUpCUVc5Q0xHOUNRVUZ2UWp0QlFVTjRReXhOUVVGSkxFMUJRVTBzVVVGQlVTeFZRVUZWTEZWQlFWVTdRVUZEYkVNc2QwSkJRWEZDTEZkQlFWVXNUMEZCVHl4VlFVRlZMRk5CUVZNc1RVRkJUU3hOUVVGTk8wRkJRM3BGTEZOQlFVOHNUVUZCVFN4TlFVRk5MRTFCUTJRc1RVRkJUU3hyUWtGRFRpeFBRVUZQTEdWQlExQXNTVUZCU1N4VFFVRlZMRTlCUVU4N1FVRkJSU3hYUVVGUExFOUJRVTg3UVVGQlFTeExRVU55UXl4TFFVRkxPMEZCUVVFN1FVRkhaQ3hKUVVGSkxHdENRVUZyUWp0QlFVRkJMRVZCUTJ4Q08wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRTdRVUZGU2l4SlFVRkpMRzFDUVVGdFFqdEJRVUZCTEVWQlEyNUNPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJMRVZCUTBFN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFUdEJRVUZCTEVWQlEwRTdRVUZCUVN4RlFVTkJPMEZCUVVFc1JVRkRRVHRCUVVGQkxFVkJRMEU3UVVGQlFTeEZRVU5CTzBGQlFVRXNSVUZEUVR0QlFVRkJPMEZCUlVvc1NVRkJTU3haUVVGWkxHZENRVUZuUWl4UFFVRlBPMEZCUTNaRExFbEJRVWtzWlVGQlpUdEJRVUZCTEVWQlEyWXNaMEpCUVdkQ08wRkJRVUVzUlVGRGFFSXNaMEpCUVdkQ08wRkJRVUVzUlVGRGFFSXNUMEZCVHp0QlFVRkJMRVZCUTFBc2NVSkJRWEZDTzBGQlFVRXNSVUZEY2tJc1dVRkJXVHRCUVVGQk8wRkJSV2hDTEc5Q1FVRnZRaXhOUVVGTkxFdEJRVXM3UVVGRE0wSXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhQUVVGUE8wRkJRMW9zVDBGQlN5eFZRVUZWTzBGQlFVRTdRVUZGYmtJc1QwRkJUeXhaUVVGWkxFdEJRVXNzVDBGQlR5eFBRVUZQTzBGQlFVRXNSVUZEYkVNc1QwRkJUenRCUVVGQkxFbEJRMGdzUzBGQlN5eFhRVUZaTzBGQlEySXNZVUZCVHl4TFFVRkxMRlZCUTFBc1RVRkJTeXhUUVVGVExFdEJRVXNzVDBGQlR5eFBRVUZQTEV0QlFVc3NWVUZCVlN4WlFVRlpMRXRCUVVzc1NVRkJTVHRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVWRzUml4VlFVRlZMRmRCUVZrN1FVRkJSU3hYUVVGUExFdEJRVXNzVDBGQlR5eFBRVUZQTEV0QlFVczdRVUZCUVR0QlFVRkJPMEZCUlRORUxEaENRVUU0UWl4TFFVRkxMRlZCUVZVN1FVRkRla01zVTBGQlR5eE5RVUZOTEdWQlFXVXNUMEZCVHl4TFFVRkxMRlZCUTI1RExFbEJRVWtzVTBGQlZTeExRVUZMTzBGQlFVVXNWMEZCVHl4VFFVRlRMRXRCUVVzN1FVRkJRU3hMUVVNeFF5eFBRVUZQTEZOQlFWVXNSMEZCUnl4SFFVRkhMRWRCUVVjN1FVRkJSU3hYUVVGUExFVkJRVVVzVVVGQlVTeFBRVUZQTzBGQlFVRXNTMEZEY0VRc1MwRkJTenRCUVVGQk8wRkJSV1FzY1VKQlFYRkNMRXRCUVVzc1ZVRkJWU3hqUVVGakxGbEJRVms3UVVGRE1VUXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhYUVVGWE8wRkJRMmhDTEU5QlFVc3NZVUZCWVR0QlFVTnNRaXhQUVVGTExHVkJRV1U3UVVGRGNFSXNUMEZCU3l4VlFVRlZMSEZDUVVGeFFpeExRVUZMTzBGQlFVRTdRVUZGTjBNc1QwRkJUeXhoUVVGaExFdEJRVXM3UVVGRGVrSXNiVUpCUVcxQ0xFdEJRVXNzVlVGQlZUdEJRVU01UWl4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExFOUJRVTg3UVVGRFdpeFBRVUZMTEZkQlFWY3NUMEZCVHl4TFFVRkxMRlZCUVZVc1NVRkJTU3hUUVVGVkxFdEJRVXM3UVVGQlJTeFhRVUZQTEZOQlFWTTdRVUZCUVR0QlFVTXpSU3hQUVVGTExHZENRVUZuUWp0QlFVTnlRaXhQUVVGTExGVkJRVlVzY1VKQlFYRkNMRXRCUVVzN1FVRkJRVHRCUVVVM1F5eFBRVUZQTEZkQlFWY3NTMEZCU3p0QlFVTjJRaXhKUVVGSkxGZEJRVmNzVlVGQlZTeFBRVUZQTEZOQlFWVXNTMEZCU3l4TlFVRk5PMEZCUVVVc1UwRkJVU3hKUVVGSkxGRkJRVkVzVDBGQlR5eFRRVUZUTzBGQlFVRXNSMEZCVXp0QlFVTndSeXhKUVVGSkxHZENRVUZuUWp0QlFVTndRaXhKUVVGSkxHRkJRV0VzVlVGQlZTeFBRVUZQTEZOQlFWVXNTMEZCU3l4TlFVRk5PMEZCUTI1RUxFMUJRVWtzVjBGQlZ5eFBRVUZQTzBGQlEzUkNMSFZDUVVGdlFpeFpRVUZaTEU5QlFVODdRVUZEYmtNc1UwRkJTeXhMUVVGTE8wRkJRMVlzVTBGQlN5eFBRVUZQTzBGQlExb3NVVUZCU1N4RFFVRkRMRmxCUVZrN1FVRkRZaXhYUVVGTExGVkJRVlVzWVVGQllTeFRRVUZUTzBGQlEzSkRMRmRCUVVzc1VVRkJVVHRCUVVGQkxHVkJSVklzVDBGQlR5eGxRVUZsTEZWQlFWVTdRVUZEY2tNc1YwRkJTeXhWUVVGVkxFdEJRVXNzWVVGQll5eEZRVUZETEZGQlFWRXNTMEZCU3l4UlFVRlJPMEZCUTNoRUxGZEJRVXNzVVVGQlVTeFRRVUZUTzBGQlFVRXNaVUZGYWtJc1QwRkJUeXhsUVVGbExGVkJRVlU3UVVGRGNrTXNWMEZCU3l4VlFVRlZMRmRCUVZjc1QwRkJUeXhOUVVGTkxGZEJRVmM3UVVGRGJFUXNWMEZCU3l4UlFVRlJPMEZCUVVFN1FVRkJRVHRCUVVkeVFpeFRRVUZQTEdGQlFWa3NTMEZCU3p0QlFVTjRRaXhOUVVGSkxGRkJRVkU3UVVGRFdpeFRRVUZQTzBGQlFVRXNSMEZEVWp0QlFVTklMRmRCUVZjc1UwRkJVenRCUVVOd1FpeFhRVUZYTEU5QlFVODdRVUZEYkVJc1YwRkJWeXhSUVVGUk8wRkJRMjVDTEVsQlFVa3NaVUZCWlN4cFFrRkJhVUlzVDBGQlR5eFRRVUZWTEV0QlFVc3NUVUZCVFR0QlFVTTFSQ3hOUVVGSkxFOUJRVThzVjBGQlZ5eFhRVUZYTzBGQlEycERMRk5CUVU4N1FVRkJRU3hIUVVOU08wRkJRMGdzYTBKQlFXdENMRlZCUVZVc1UwRkJVenRCUVVOcVF5eE5RVUZKTEVOQlFVTXNXVUZCV1N4dlFrRkJiMElzWTBGQll5eHZRa0ZCYjBJc1lVRkJZU3h2UWtGQmIwSXNaVUZCWlN4RFFVRkRMRk5CUVZNc1VVRkJVU3hEUVVGRExHRkJRV0VzVTBGQlV6dEJRVU0xU2l4WFFVRlBPMEZCUTFnc1RVRkJTU3hMUVVGTExFbEJRVWtzWVVGQllTeFRRVUZUTEUxQlFVMHNWMEZCVnl4VFFVRlRMRk5CUVZNN1FVRkRkRVVzVFVGQlNTeFhRVUZYTEZWQlFWVTdRVUZEY2tJc1dVRkJVU3hKUVVGSkxGTkJRVk1zUTBGQlJTeExRVUZMTEZkQlFWazdRVUZEYUVNc1lVRkJUeXhMUVVGTExFMUJRVTA3UVVGQlFUdEJRVUZCTzBGQlJ6bENMRk5CUVU4N1FVRkJRVHRCUVVWWUxFbEJRVWtzY1VKQlFYRkNMRlZCUVZVc1QwRkJUeXhUUVVGVkxFdEJRVXNzVFVGQlRUdEJRVU16UkN4TlFVRkpMRU5CUVVNc1ZVRkJWU3hSUVVGUkxGTkJRVk1zVVVGQlVTeFZRVUZWTzBGQlF6bERMRkZCUVVrc1QwRkJUeXhYUVVGWExGZEJRVmM3UVVGRGNrTXNVMEZCVHp0QlFVRkJMRWRCUTFJN1FVRkRTQ3h0UWtGQmJVSXNZMEZCWXp0QlFVTnFReXh0UWtGQmJVSXNZVUZCWVR0QlFVTm9ReXh0UWtGQmJVSXNXVUZCV1R0QlFVVXZRaXhsUVVGbE8wRkJRVUU3UVVGRFppeG5Ra0ZCWjBJc1MwRkJTenRCUVVGRkxGTkJRVTg3UVVGQlFUdEJRVU01UWl3eVFrRkJNa0lzU1VGQlNTeEpRVUZKTzBGQlF5OUNMRTFCUVVrc1RVRkJUU3hSUVVGUkxFOUJRVTg3UVVGRGNrSXNWMEZCVHp0QlFVTllMRk5CUVU4c1UwRkJWU3hMUVVGTE8wRkJRMnhDTEZkQlFVOHNSMEZCUnl4SFFVRkhPMEZCUVVFN1FVRkJRVHRCUVVkeVFpeHJRa0ZCYTBJc1MwRkJTeXhMUVVGTE8wRkJRM2hDTEZOQlFVOHNWMEZCV1R0QlFVTm1MRkZCUVVrc1RVRkJUU3hOUVVGTk8wRkJRMmhDTEZGQlFVa3NUVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVkNFFpd3lRa0ZCTWtJc1NVRkJTU3hKUVVGSk8wRkJReTlDTEUxQlFVa3NUMEZCVHp0QlFVTlFMRmRCUVU4N1FVRkRXQ3hUUVVGUExGZEJRVms3UVVGRFppeFJRVUZKTEUxQlFVMHNSMEZCUnl4TlFVRk5MRTFCUVUwN1FVRkRla0lzVVVGQlNTeFJRVUZSTzBGQlExSXNaMEpCUVZVc1MwRkJTenRCUVVOdVFpeFJRVUZKTEZsQlFWa3NTMEZCU3l4WFFVTnlRaXhWUVVGVkxFdEJRVXM3UVVGRFppeFRRVUZMTEZsQlFWazdRVUZEYWtJc1UwRkJTeXhWUVVGVk8wRkJRMllzVVVGQlNTeFBRVUZQTEVkQlFVY3NUVUZCVFN4TlFVRk5PMEZCUXpGQ0xGRkJRVWs3UVVGRFFTeFhRVUZMTEZsQlFWa3NTMEZCU3l4WlFVRlpMRk5CUVZNc1YwRkJWeXhMUVVGTExHRkJRV0U3UVVGRE5VVXNVVUZCU1R0QlFVTkJMRmRCUVVzc1ZVRkJWU3hMUVVGTExGVkJRVlVzVTBGQlV5eFRRVUZUTEV0QlFVc3NWMEZCVnp0QlFVTndSU3hYUVVGUExGTkJRVk1zVTBGQldTeFBRVUZQTzBGQlFVRTdRVUZCUVR0QlFVY3pReXd5UWtGQk1rSXNTVUZCU1N4SlFVRkpPMEZCUXk5Q0xFMUJRVWtzVDBGQlR6dEJRVU5RTEZkQlFVODdRVUZEV0N4VFFVRlBMRmRCUVZrN1FVRkRaaXhQUVVGSExFMUJRVTBzVFVGQlRUdEJRVU5tTEZGQlFVa3NXVUZCV1N4TFFVRkxMRmRCUTNKQ0xGVkJRVlVzUzBGQlN6dEJRVU5tTEZOQlFVc3NXVUZCV1N4TFFVRkxMRlZCUVZVN1FVRkRhRU1zVDBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZEWml4UlFVRkpPMEZCUTBFc1YwRkJTeXhaUVVGWkxFdEJRVXNzV1VGQldTeFRRVUZUTEZkQlFWY3NTMEZCU3l4aFFVRmhPMEZCUXpWRkxGRkJRVWs3UVVGRFFTeFhRVUZMTEZWQlFWVXNTMEZCU3l4VlFVRlZMRk5CUVZNc1UwRkJVeXhMUVVGTExGZEJRVmM3UVVGQlFUdEJRVUZCTzBGQlJ6VkZMREpDUVVFeVFpeEpRVUZKTEVsQlFVazdRVUZETDBJc1RVRkJTU3hQUVVGUE8wRkJRMUFzVjBGQlR6dEJRVU5ZTEZOQlFVOHNVMEZCVlN4bFFVRmxPMEZCUXpWQ0xGRkJRVWtzVFVGQlRTeEhRVUZITEUxQlFVMHNUVUZCVFR0QlFVTjZRaXhYUVVGUExHVkJRV1U3UVVGRGRFSXNVVUZCU1N4WlFVRlpMRXRCUVVzc1YwRkRja0lzVlVGQlZTeExRVUZMTzBGQlEyWXNVMEZCU3l4WlFVRlpPMEZCUTJwQ0xGTkJRVXNzVlVGQlZUdEJRVU5tTEZGQlFVa3NUMEZCVHl4SFFVRkhMRTFCUVUwc1RVRkJUVHRCUVVNeFFpeFJRVUZKTzBGQlEwRXNWMEZCU3l4WlFVRlpMRXRCUVVzc1dVRkJXU3hUUVVGVExGZEJRVmNzUzBGQlN5eGhRVUZoTzBGQlF6VkZMRkZCUVVrN1FVRkRRU3hYUVVGTExGVkJRVlVzUzBGQlN5eFZRVUZWTEZOQlFWTXNVMEZCVXl4TFFVRkxMRmRCUVZjN1FVRkRjRVVzVjBGQlR5eFJRVUZSTEZOQlExWXNVMEZCVXl4VFFVRlpMRk5CUVZrc1QwRkRha01zVDBGQlR5eExRVUZMTzBGQlFVRTdRVUZCUVR0QlFVZDZRaXh2UTBGQmIwTXNTVUZCU1N4SlFVRkpPMEZCUTNoRExFMUJRVWtzVDBGQlR6dEJRVU5RTEZkQlFVODdRVUZEV0N4VFFVRlBMRmRCUVZrN1FVRkRaaXhSUVVGSkxFZEJRVWNzVFVGQlRTeE5RVUZOTEdWQlFXVTdRVUZET1VJc1lVRkJUenRCUVVOWUxGZEJRVThzUjBGQlJ5eE5RVUZOTEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCUnpsQ0xIbENRVUY1UWl4SlFVRkpMRWxCUVVrN1FVRkROMElzVFVGQlNTeFBRVUZQTzBGQlExQXNWMEZCVHp0QlFVTllMRk5CUVU4c1YwRkJXVHRCUVVObUxGRkJRVWtzVFVGQlRTeEhRVUZITEUxQlFVMHNUVUZCVFR0QlFVTjZRaXhSUVVGSkxFOUJRVThzVDBGQlR5eEpRVUZKTEZOQlFWTXNXVUZCV1R0QlFVTjJReXhWUVVGSkxFOUJRVThzVFVGQlRTeEpRVUZKTEZWQlFWVXNVVUZCVVN4UFFVRlBMRWxCUVVrc1RVRkJUVHRCUVVONFJDeGhRVUZQTzBGQlEwZ3NZVUZCU3l4TFFVRkxMRlZCUVZVN1FVRkRlRUlzWVVGQlR5eEpRVUZKTEV0QlFVc3NWMEZCV1R0QlFVTjRRaXhsUVVGUExFZEJRVWNzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVYzVRaXhYUVVGUExFZEJRVWNzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVazVRaXhKUVVGSkxGZEJRVmM3UVVGRFppeEpRVUZKTEhsQ1FVRjVRaXhMUVVNM1FpeHJRa0ZCYTBJc1NVRkJTU3hyUWtGQmEwSXNTMEZCU3l4UFFVRlBMRTlCUVU4c1dVRkJXU3hqUVVOdVJTeExRVU5ETEZkQlFWazdRVUZEVkN4TlFVRkpMRlZCUVZVc1VVRkJVVHRCUVVOMFFpeE5RVUZKTEU5QlFVOHNWMEZCVnl4bFFVRmxMRU5CUVVNc1QwRkJUenRCUVVONlF5eFhRVUZQTEVOQlFVTXNVMEZCVXl4VFFVRlRMRlZCUVZVN1FVRkRlRU1zVFVGQlNTeFZRVUZWTEU5QlFVOHNUMEZCVHl4UFFVRlBMRmRCUVZjc1NVRkJTU3hYUVVGWExFTkJRVU03UVVGRE9VUXNVMEZCVHp0QlFVRkJMRWxCUTBnN1FVRkJRU3hKUVVOQkxGTkJRVk03UVVGQlFTeEpRVU5VTzBGQlFVRTdRVUZCUVN4TFFVVkdMSGRDUVVGM1FpeExRVUZMTEVsQlFVa3NjVUpCUVhGQ0xFdEJRVXNzU1VGQlNTeDNRa0ZCZDBJc1MwRkJTeXhKUVVGSkxHOUNRVUZ2UWl4elFrRkJjMElzYlVKQlFXMUNPMEZCUTNaTExFbEJRVWtzWjBKQlFXZENMSGxDUVVGNVFpeHpRa0ZCYzBJN1FVRkRia1VzU1VGQlNTeHhRa0ZCY1VJc1EwRkJReXhEUVVGRE8wRkJRek5DTEVsQlFVa3NkMEpCUVhkQ08wRkJRelZDTEVsQlFVa3NkVUpCUVhWQ0xIZENRVU4yUWl4WFFVRlpPMEZCUVVVc2QwSkJRWE5DTEV0QlFVczdRVUZCUVN4SlFVVnlReXhSUVVGUkxHVkJRMG9zWVVGQllTeExRVUZMTEUxQlFVMHNaMEpCUTNoQ0xGRkJRVkVzYlVKQlEwb3NWMEZCV1R0QlFVTlNMRTFCUVVrc1dVRkJXU3hUUVVGVExHTkJRV003UVVGRGRrTXNSVUZCUXl4SlFVRkpMR2xDUVVGcFFpeFhRVUZaTzBGQlF6bENPMEZCUTBFc1owSkJRVms3UVVGQlFTeExRVU5hTEZGQlFWRXNWMEZCVnl4RFFVRkZMRmxCUVZrN1FVRkRja01zV1VGQlZTeGhRVUZoTEV0QlFVczdRVUZCUVN4SlFVVm9ReXhYUVVGWk8wRkJRVVVzWVVGQlZ5eGpRVUZqTzBGQlFVRTdRVUZEZGtRc1NVRkJTU3hQUVVGUExGTkJRVlVzVlVGQlZTeE5RVUZOTzBGQlEycERMR2xDUVVGbExFdEJRVXNzUTBGQlF5eFZRVUZWTzBGQlF5OUNMRTFCUVVrc2MwSkJRWE5DTzBGQlEzUkNPMEZCUTBFc01rSkJRWFZDTzBGQlFVRTdRVUZCUVR0QlFVY3ZRaXhKUVVGSkxIRkNRVUZ4UWl4TlFVTjZRaXgxUWtGQmRVSXNUVUZEZGtJc2EwSkJRV3RDTEVsQlEyeENMR3RDUVVGclFpeEpRVU5zUWl4dFFrRkJiVUlzVFVGQlRTeHJRa0ZCYTBJN1FVRkRNME1zU1VGQlNTeFpRVUZaTzBGQlFVRXNSVUZEV2l4SlFVRkpPMEZCUVVFc1JVRkRTaXhSUVVGUk8wRkJRVUVzUlVGRFVpeExRVUZMTzBGQlFVRXNSVUZEVEN4WlFVRlpPMEZCUVVFc1JVRkRXaXhoUVVGaE8wRkJRVUVzUlVGRFlpeExRVUZMTzBGQlFVRXNSVUZEVEN4TFFVRkxPMEZCUVVFc1JVRkRUQ3hWUVVGVkxGZEJRVms3UVVGRGJFSXNVMEZCU3l4WFFVRlhMRkZCUVZFc1UwRkJWU3hKUVVGSk8wRkJRMnhETEZWQlFVazdRVUZEUVN4dlFrRkJXU3hIUVVGSExFbEJRVWtzUjBGQlJ6dEJRVUZCTEdWQlJXNUNMRWRCUVZBN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWxhTEVsQlFVa3NUVUZCVFR0QlFVTldMRWxCUVVrc2FVSkJRV2xDTzBGQlEzSkNMRWxCUVVrc2IwSkJRVzlDTzBGQlEzaENMRWxCUVVrc2FVSkJRV2xDTzBGQlEzSkNMSE5DUVVGelFpeEpRVUZKTzBGQlEzUkNMRTFCUVVrc1QwRkJUeXhUUVVGVE8wRkJRMmhDTEZWQlFVMHNTVUZCU1N4VlFVRlZPMEZCUTNoQ0xFOUJRVXNzWVVGQllUdEJRVU5zUWl4UFFVRkxMR05CUVdNN1FVRkRia0lzVDBGQlN5eFBRVUZQTzBGQlExb3NUVUZCU1N4TlFVRlBMRXRCUVVzc1QwRkJUenRCUVVOMlFpeE5RVUZKTEU5QlFVODdRVUZEVUN4VFFVRkxMR1ZCUVdVN1FVRkRjRUlzVTBGQlN5eFJRVUZSTzBGQlEySXNVMEZCU3l4WFFVRlhPMEZCUVVFN1FVRkZjRUlzVFVGQlNTeFBRVUZQTEU5QlFVOHNXVUZCV1R0QlFVTXhRaXhSUVVGSkxFOUJRVTg3UVVGRFVDeFpRVUZOTEVsQlFVa3NWVUZCVlR0QlFVTjRRaXhUUVVGTExGTkJRVk1zVlVGQlZUdEJRVU40UWl4VFFVRkxMRk5CUVZNc1ZVRkJWVHRCUVVONFFpeFJRVUZKTEV0QlFVc3NWMEZCVnp0QlFVTm9RaXh6UWtGQlowSXNUVUZCVFN4TFFVRkxPMEZCUXk5Q08wRkJRVUU3UVVGRlNpeFBRVUZMTEZOQlFWTTdRVUZEWkN4UFFVRkxMRk5CUVZNN1FVRkRaQ3hKUVVGRkxFbEJRVWs3UVVGRFRpeHhRa0ZCYlVJc1RVRkJUVHRCUVVGQk8wRkJSVGRDTEVsQlFVa3NWMEZCVnp0QlFVRkJMRVZCUTFnc1MwRkJTeXhYUVVGWk8wRkJRMklzVVVGQlNTeE5RVUZOTEV0QlFVc3NZMEZCWXp0QlFVTTNRaXhyUWtGQll5eGhRVUZoTEZsQlFWazdRVUZEYmtNc1ZVRkJTU3hSUVVGUk8wRkJRMW9zVlVGQlNTeG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxGVkJRVmNzVTBGQlVTeFBRVUZQTEdkQ1FVRm5RanRCUVVOdVJTeFZRVUZKTEZWQlFWVXNhVUpCUVdsQ0xFTkJRVU03UVVGRGFFTXNWVUZCU1N4TFFVRkxMRWxCUVVrc1lVRkJZU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU5xUkN3MFFrRkJiMElzVDBGQlR5eEpRVUZKTEZOQlFWTXNNRUpCUVRCQ0xHRkJRV0VzUzBGQlN5eGxRVUZsTEZWQlFWVXNNRUpCUVRCQ0xGbEJRVmtzUzBGQlN5eGxRVUZsTEZWQlFWVXNVMEZCVXl4UlFVRlJPMEZCUVVFN1FVRkZkRTBzWlVGQlV5eHpRa0ZCYzBJc1NVRkJTVHRCUVVOdVF5eGhRVUZQTzBGQlFVRTdRVUZGV0N4VFFVRkxMRmxCUVZrN1FVRkRha0lzVjBGQlR6dEJRVUZCTzBGQlFVRXNSVUZGV0N4TFFVRkxMRk5CUVZVc1QwRkJUenRCUVVOc1FpeFpRVUZSTEUxQlFVMHNVVUZCVVN4VFFVRlRMRTFCUVUwc1kwRkJZeXhYUVVNdlF5eFhRVU5CTzBGQlFVRXNUVUZEU1N4TFFVRkxMRmRCUVZrN1FVRkRZaXhsUVVGUE8wRkJRVUU3UVVGQlFTeE5RVVZZTEV0QlFVc3NVMEZCVXp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVrNVFpeE5RVUZOTEdGQlFXRXNWMEZCVnp0QlFVRkJMRVZCUXpGQ0xFMUJRVTA3UVVGQlFTeEZRVU5PTEU5QlFVOHNVMEZCVlN4aFFVRmhMRmxCUVZrN1FVRkRkRU1zZDBKQlFXOUNMRTFCUVUwc1NVRkJTU3hUUVVGVExFMUJRVTBzVFVGQlRTeGhRVUZoTEZsQlFWazdRVUZCUVR0QlFVRkJMRVZCUldoR0xFOUJRVThzVTBGQlZTeFpRVUZaTzBGQlEzcENMRkZCUVVrc1ZVRkJWU3hYUVVGWE8wRkJRM0pDTEdGQlFVOHNTMEZCU3l4TFFVRkxMRTFCUVUwN1FVRkRNMElzVVVGQlNTeFBRVUZQTEZWQlFWVXNTVUZCU1N4VlFVRlZMRlZCUVZVN1FVRkROME1zVjBGQlR5eFBRVUZQTEZOQlFWTXNZVUZCWVN4TFFVRkxMRXRCUVVzc1RVRkJUU3hUUVVGVkxFdEJRVXM3UVVGREwwUXNZVUZCVHl4bFFVRmxMRTlCUVU4c1VVRkJVU3hQUVVGUExHTkJRV003UVVGQlFTeFRRVVY0UkN4TFFVRkxMRXRCUVVzc1RVRkJUU3hUUVVGVkxFdEJRVXM3UVVGRE4wSXNZVUZCVHl4UFFVRlBMRWxCUVVrc1UwRkJVeXhQUVVGUExGRkJRVkVzVDBGQlR5eGpRVUZqTzBGQlFVRTdRVUZCUVR0QlFVRkJMRVZCUnpORkxGTkJRVk1zVTBGQlZTeFhRVUZYTzBGQlF6RkNMRmRCUVU4c1MwRkJTeXhMUVVGTExGTkJRVlVzVDBGQlR6dEJRVU01UWp0QlFVTkJMR0ZCUVU4N1FVRkJRU3hQUVVOU0xGTkJRVlVzUzBGQlN6dEJRVU5rTzBGQlEwRXNZVUZCVHl4alFVRmpPMEZCUVVFN1FVRkJRVHRCUVVGQkxFVkJSemRDTEU5QlFVODdRVUZCUVN4SlFVTklMRXRCUVVzc1YwRkJXVHRCUVVOaUxGVkJRVWtzUzBGQlN6dEJRVU5NTEdWQlFVOHNTMEZCU3p0QlFVTm9RaXhWUVVGSk8wRkJRMEVzWjBOQlFYZENPMEZCUTNoQ0xGbEJRVWtzVTBGQlV5eFRRVUZUTEUxQlFVMHNTVUZCU1R0QlFVTm9ReXhaUVVGSkxGRkJRVkVzVDBGQlR5eExRVUZMTzBGQlEzaENMRmxCUVVrc1MwRkJTeXhYUVVGWE8wRkJRMmhDTEdWQlFVc3NVMEZCVXp0QlFVTnNRaXhsUVVGUE8wRkJRVUVzWjBKQlJWZzdRVUZEU1N4blEwRkJkMEk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVN4RlFVbHdReXhUUVVGVExGTkJRVlVzU1VGQlNTeExRVUZMTzBGQlEzaENMRkZCUVVrc1VVRkJVVHRCUVVOYUxGZEJRVThzUzBGQlN5eFhRVU5TTEVsQlFVa3NZVUZCWVN4VFFVRlZMRk5CUVZNc1VVRkJVVHRCUVVONFF5eFZRVUZKTEZOQlFWTXNWMEZCVnl4WFFVRlpPMEZCUVVVc1pVRkJUeXhQUVVGUExFbEJRVWtzVjBGQlZ5eFJRVUZSTzBGQlFVRXNVMEZCVlR0QlFVTnlSaXhaUVVGTkxFdEJRVXNzVTBGQlV5eFJRVUZSTEZGQlFWRXNZVUZCWVN4TFFVRkxMRTFCUVUwN1FVRkJRU3hUUVVNelJEdEJRVUZCTzBGQlFVRTdRVUZIYWtJc1NVRkJTU3hQUVVGUExGZEJRVmNzWlVGQlpTeFBRVUZQTzBGQlEzaERMRlZCUVZFc1lVRkJZU3hYUVVGWExFOUJRVThzWVVGQllUdEJRVU40UkN4VlFVRlZMRTFCUVUwN1FVRkRhRUlzYTBKQlFXdENMR0ZCUVdFc1dVRkJXU3hUUVVGVExGRkJRVkVzVFVGQlRUdEJRVU01UkN4UFFVRkxMR05CUVdNc1QwRkJUeXhuUWtGQlowSXNZVUZCWVN4alFVRmpPMEZCUTNKRkxFOUJRVXNzWVVGQllTeFBRVUZQTEdWQlFXVXNZVUZCWVN4aFFVRmhPMEZCUTJ4RkxFOUJRVXNzVlVGQlZUdEJRVU5tTEU5QlFVc3NVMEZCVXp0QlFVTmtMRTlCUVVzc1RVRkJUVHRCUVVGQk8wRkJSV1lzVFVGQlRTeGpRVUZqTzBGQlFVRXNSVUZEYUVJc1MwRkJTeXhYUVVGWk8wRkJRMklzVVVGQlNTeFRRVUZUTEZkQlFWY3NUVUZCVFN4TlFVRk5MRmRCUXk5Q0xFbEJRVWs3UVVGRFZDeFhRVUZQTEVsQlFVa3NZVUZCWVN4VFFVRlZMRk5CUVZNc1VVRkJVVHRCUVVNdlF5eFZRVUZKTEU5QlFVOHNWMEZCVnp0QlFVTnNRaXhuUWtGQlVUdEJRVU5hTEZWQlFVa3NXVUZCV1N4UFFVRlBPMEZCUTNaQ0xHRkJRVThzVVVGQlVTeFRRVUZWTEVkQlFVY3NSMEZCUnp0QlFVRkZMR1ZCUVU4c1lVRkJZU3hSUVVGUkxFZEJRVWNzUzBGQlN5eFRRVUZWTEVkQlFVYzdRVUZET1VVc2FVSkJRVThzUzBGQlN6dEJRVU5hTEdOQlFVa3NRMEZCUXl4RlFVRkZPMEZCUTBnc2IwSkJRVkU3UVVGQlFTeFhRVU5pTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFc1JVRkhXQ3hUUVVGVExGTkJRVlVzVDBGQlR6dEJRVU4wUWl4UlFVRkpMR2xDUVVGcFFqdEJRVU5xUWl4aFFVRlBPMEZCUTFnc1VVRkJTU3hUUVVGVExFOUJRVThzVFVGQlRTeFRRVUZUTzBGQlF5OUNMR0ZCUVU4c1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlF5OURMR05CUVUwc1MwRkJTeXhUUVVGVE8wRkJRVUU3UVVGRk5VSXNVVUZCU1N4TFFVRkxMRWxCUVVrc1lVRkJZU3hWUVVGVkxFMUJRVTA3UVVGRE1VTXNNRUpCUVhOQ0xFbEJRVWs3UVVGRE1VSXNWMEZCVHp0QlFVRkJPMEZCUVVFc1JVRkZXQ3hSUVVGUk8wRkJRVUVzUlVGRFVpeE5RVUZOTEZkQlFWazdRVUZEWkN4UlFVRkpMRk5CUVZNc1YwRkJWeXhOUVVGTkxFMUJRVTBzVjBGQlZ5eEpRVUZKTzBGQlEyNUVMRmRCUVU4c1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlF5OURMR0ZCUVU4c1NVRkJTU3hUUVVGVkxFOUJRVTg3UVVGQlJTeGxRVUZQTEdGQlFXRXNVVUZCVVN4UFFVRlBMRXRCUVVzc1UwRkJVenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTEVWQlIzWkdMRXRCUVVzN1FVRkJRU3hKUVVORUxFdEJRVXNzVjBGQldUdEJRVUZGTEdGQlFVODdRVUZCUVR0QlFVRkJMRWxCUXpGQ0xFdEJRVXNzVTBGQlZTeFBRVUZQTzBGQlFVVXNZVUZCVHl4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVGQkxFVkJSWHBETEdGQlFXRXNRMEZCUlN4TFFVRkxMRmRCUVZrN1FVRkJSU3hYUVVGUE8wRkJRVUU3UVVGQlFTeEZRVU42UXl4UlFVRlJPMEZCUVVFc1JVRkRVanRCUVVGQkxFVkJRMEVzVjBGQlZ6dEJRVUZCTEVsQlExQXNTMEZCU3l4WFFVRlpPMEZCUVVVc1lVRkJUenRCUVVGQk8wRkJRVUVzU1VGRE1VSXNTMEZCU3l4VFFVRlZMRTlCUVU4N1FVRkJSU3hoUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTEVWQlJXNURMR2xDUVVGcFFqdEJRVUZCTEVsQlEySXNTMEZCU3l4WFFVRlpPMEZCUVVVc1lVRkJUenRCUVVGQk8wRkJRVUVzU1VGRE1VSXNTMEZCU3l4VFFVRlZMRTlCUVU4N1FVRkJSU3gzUWtGQmEwSTdRVUZCUVR0QlFVRkJPMEZCUVVFc1JVRkZPVU1zVVVGQlVTeFRRVUZWTEVsQlFVa3NWMEZCVnp0QlFVTTNRaXhYUVVGUExFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXZReXhoUVVGUExGTkJRVk1zVTBGQlZTeFZRVUZUTEZOQlFWRTdRVUZEZGtNc1dVRkJTU3hOUVVGTk8wRkJRMVlzV1VGQlNTeGhRVUZoTzBGQlEycENMRmxCUVVrc1kwRkJZenRCUVVOc1FpeFpRVUZKTEZkQlFWY3NVMEZCVXl4WFFVRlpPMEZCUTJoRExHTkJRVWtzVVVGQlVUdEJRVU5hTEcxRVFVRjVReXhYUVVGWk8wRkJRMnBFTEd0Q1FVRk5MRmRCUVZjc1YwRkJWeXhKUVVGSkxHRkJRVmtzVVVGQlR5eE5RVUZOTEZkQlFWYzdRVUZCUVR0QlFVRkJMRmRCUlhwRkxFbEJRVWs3UVVGRFVEdEJRVUZCTEZOQlEwUXNWMEZCVnl4VFFVRlRPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTVzVETEVsQlFVa3NaVUZCWlR0QlFVTm1MRTFCUVVrc1kwRkJZenRCUVVOa0xGbEJRVkVzWTBGQll5eGpRVUZqTEZkQlFWazdRVUZETlVNc1ZVRkJTU3h0UWtGQmJVSXNWMEZCVnl4TlFVRk5MRTFCUVUwc1YwRkJWeXhKUVVGSk8wRkJRemRFTEdGQlFVOHNTVUZCU1N4aFFVRmhMRk5CUVZVc1UwRkJVenRCUVVOMlF5eFpRVUZKTEdsQ1FVRnBRaXhYUVVGWE8wRkJRelZDTEd0Q1FVRlJPMEZCUTFvc1dVRkJTU3haUVVGWkxHbENRVUZwUWp0QlFVTnFReXhaUVVGSkxGVkJRVlVzU1VGQlNTeE5RVUZOTzBGQlEzaENMSGxDUVVGcFFpeFJRVUZSTEZOQlFWVXNSMEZCUnl4SFFVRkhPMEZCUVVVc2FVSkJRVThzWVVGQllTeFJRVUZSTEVkQlFVY3NTMEZCU3l4VFFVRlZMRTlCUVU4N1FVRkJSU3h0UWtGQlR5eFJRVUZSTEV0QlFVc3NRMEZCUlN4UlFVRlJMR0ZCUVdFN1FVRkJRU3hoUVVGdFFpeFRRVUZWTEZGQlFWRTdRVUZCUlN4dFFrRkJUeXhSUVVGUkxFdEJRVXNzUTBGQlJTeFJRVUZSTEZsQlFWazdRVUZCUVN4aFFVTjZUaXhMUVVGTExGZEJRVms3UVVGQlJTeHRRa0ZCVHl4RlFVRkZMR0ZCUVdFc1VVRkJVVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlIyeEZMRTFCUVVrc1kwRkJZeXhQUVVGUExFOUJRVThzYlVKQlFXMUNPMEZCUXk5RExGbEJRVkVzWTBGQll5eFBRVUZQTEZkQlFWazdRVUZEY2tNc1ZVRkJTU3h0UWtGQmJVSXNWMEZCVnl4TlFVRk5MRTFCUVUwc1YwRkJWeXhKUVVGSk8wRkJRemRFTEdGQlFVOHNTVUZCU1N4aFFVRmhMRk5CUVZVc1UwRkJVeXhSUVVGUk8wRkJReTlETEZsQlFVa3NhVUpCUVdsQ0xGZEJRVmM3UVVGRE5VSXNhVUpCUVU4c1NVRkJTU3hsUVVGbE8wRkJRemxDTEZsQlFVa3NXVUZCV1N4cFFrRkJhVUk3UVVGRGFrTXNXVUZCU1N4WFFVRlhMRWxCUVVrc1RVRkJUVHRCUVVONlFpeDVRa0ZCYVVJc1VVRkJVU3hUUVVGVkxFZEJRVWNzUjBGQlJ6dEJRVUZGTEdsQ1FVRlBMR0ZCUVdFc1VVRkJVU3hIUVVGSExFdEJRVXNzVTBGQlZTeFBRVUZQTzBGQlFVVXNiVUpCUVU4c1VVRkJVVHRCUVVGQkxHRkJRVmNzVTBGQlZTeFRRVUZUTzBGQlF6TkpMSEZDUVVGVExFdEJRVXM3UVVGRFpDeG5Ra0ZCU1N4RFFVRkRMRVZCUVVVN1FVRkRTQ3h4UWtGQlR5eEpRVUZKTEdWQlFXVTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTMnhFTERSQ1FVRTBRaXhUUVVGVExFbEJRVWs3UVVGRGNrTXNUVUZCU1R0QlFVTkJMRTlCUVVjc1UwRkJWU3hQUVVGUE8wRkJRMmhDTEZWQlFVa3NVVUZCVVN4WFFVRlhPMEZCUTI1Q08wRkJRMG9zVlVGQlNTeFZRVUZWTzBGQlExWXNZMEZCVFN4SlFVRkpMRlZCUVZVN1FVRkRlRUlzVlVGQlNTeHZRa0ZCYjBJc1VVRkJVU3hSUVVGUk8wRkJRM2hETEZWQlFVa3NVMEZCVXl4UFFVRlBMRTFCUVUwc1UwRkJVeXhaUVVGWk8wRkJRek5ETERKQ1FVRnRRaXhUUVVGVExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlEyNUVMREpDUVVGcFFpeGxRVU5pTEUxQlFVMHNUVUZCVFN4VFFVRlRMRlZCUTNKQ0xFMUJRVTBzUzBGQlN5eFRRVUZUTzBGQlFVRTdRVUZCUVN4aFFVY3pRanRCUVVORUxHZENRVUZSTEZOQlFWTTdRVUZEYWtJc1owSkJRVkVzVTBGQlV6dEJRVU5xUWl3NFFrRkJjMEk3UVVGQlFUdEJRVVV4UWl4VlFVRkpPMEZCUTBFN1FVRkJRU3hQUVVOTUxHZENRVUZuUWl4TFFVRkxMRTFCUVUwN1FVRkJRU3hYUVVVelFpeEpRVUZRTzBGQlEwa3NiMEpCUVdkQ0xGTkJRVk03UVVGQlFUdEJRVUZCTzBGQlIycERMSGxDUVVGNVFpeFRRVUZUTEZGQlFWRTdRVUZEZEVNc2EwSkJRV2RDTEV0QlFVczdRVUZEY2tJc1RVRkJTU3hSUVVGUkxGZEJRVmM3UVVGRGJrSTdRVUZEU2l4TlFVRkpMRzlDUVVGdlFpeFJRVUZSTEZGQlFWRTdRVUZEZUVNc1YwRkJVeXhuUWtGQlowSTdRVUZEZWtJc1ZVRkJVU3hUUVVGVE8wRkJRMnBDTEZWQlFWRXNVMEZCVXp0QlFVTnFRaXhYUVVGVExGZEJRVmNzVVVGQlVTeFBRVUZQTEZkQlFWY3NXVUZCV1N4RFFVRkRMRTlCUVU4c1dVRkJXU3hUUVVGVExGZEJRVms3UVVGREwwWXNVVUZCU1N4WFFVRlhMSE5DUVVGelFpeFJRVUZSTzBGQlF6ZERMRmRCUVU4c1YwRkJWenRCUVVOc1FpeFpRVUZSTEZGQlFWRXNVMEZCVXp0QlFVRkJMRTFCUTNKQ0xFdEJRVXNzVjBGQldUdEJRVU5pTEdWQlFVOHNkMEpCUTBnc1dVRkJZU3hWUVVGVExFMUJRMnhDTEZOQlFWTXNTVUZCU1N4TlFVRk5MRlZCUTI1Q0xGTkJRVk1zVTBGRFlpeFJRVUZSTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1hoQ0xEUkNRVUV3UWp0QlFVTXhRaXgzUWtGQmMwSTdRVUZEZEVJc1RVRkJTVHRCUVVOQk8wRkJRVUU3UVVGRlVpd3JRa0ZCSzBJc1UwRkJVenRCUVVOd1F5eE5RVUZKTEZsQlFWa3NVVUZCVVR0QlFVTjRRaXhWUVVGUkxHRkJRV0U3UVVGRGNrSXNWMEZCVXl4SlFVRkpMRWRCUVVjc1RVRkJUU3hWUVVGVkxGRkJRVkVzU1VGQlNTeExRVUZMTEVWQlFVVXNSMEZCUnp0QlFVTnNSQ3gzUWtGQmIwSXNVMEZCVXl4VlFVRlZPMEZCUVVFN1FVRkZNME1zVFVGQlNTeE5RVUZOTEZGQlFWRTdRVUZEYkVJc1NVRkJSU3hKUVVGSkxFOUJRVThzU1VGQlNUdEJRVU5xUWl4TlFVRkpMSE5DUVVGelFpeEhRVUZITzBGQlEzcENMRTFCUVVVN1FVRkRSaXhUUVVGTExGZEJRVms3UVVGRFlpeFZRVUZKTEVWQlFVVXNjMEpCUVhOQ08wRkJRM2hDTzBGQlFVRXNUMEZEVER0QlFVRkJPMEZCUVVFN1FVRkhXQ3cyUWtGQk5rSXNVMEZCVXl4VlFVRlZPMEZCUXpWRExFMUJRVWtzVVVGQlVTeFhRVUZYTEUxQlFVMDdRVUZEZWtJc1dVRkJVU3hYUVVGWExFdEJRVXM3UVVGRGVFSTdRVUZCUVR0QlFVVktMRTFCUVVrc1MwRkJTeXhSUVVGUkxGTkJRVk1zVTBGQlV5eGpRVUZqTEZOQlFWTTdRVUZETVVRc1RVRkJTU3hQUVVGUExFMUJRVTA3UVVGRFlpeFhRVUZSTEZOQlFWRXNVMEZCVXl4VFFVRlRMRlZCUVZVc1UwRkJVeXhSUVVGUkxGRkJRVkU3UVVGQlFUdEJRVVY2UlN4SlFVRkZMRk5CUVZNc1NVRkJTVHRCUVVObUxFbEJRVVU3UVVGRFJpeFBRVUZMTEdOQlFXTXNRMEZCUXl4SlFVRkpMRk5CUVZNN1FVRkJRVHRCUVVWeVF5eHpRa0ZCYzBJc1NVRkJTU3hUUVVGVExGVkJRVlU3UVVGRGVrTXNUVUZCU1R0QlFVTkJMSFZDUVVGdFFqdEJRVU51UWl4UlFVRkpMRXRCUVVzc1VVRkJVU3hSUVVGUk8wRkJRM3BDTEZGQlFVa3NVVUZCVVN4UlFVRlJPMEZCUTJoQ0xGbEJRVTBzUjBGQlJ6dEJRVUZCTEZkQlJWSTdRVUZEUkN4VlFVRkpMR2RDUVVGblFqdEJRVU5vUWl3d1FrRkJhMEk3UVVGRGRFSXNXVUZCVFN4SFFVRkhPMEZCUTFRc1ZVRkJTU3huUWtGQlowSXNVVUZCVVN4WFFVRlhPMEZCUTI1RExESkNRVUZ0UWp0QlFVRkJPMEZCUlROQ0xHRkJRVk1zVVVGQlVUdEJRVUZCTEZkQlJXUXNSMEZCVUR0QlFVTkpMR0ZCUVZNc1QwRkJUenRCUVVGQkxGbEJSWEJDTzBGQlEwa3NkVUpCUVcxQ08wRkJRMjVDTEZGQlFVa3NSVUZCUlN4elFrRkJjMEk3UVVGRGVFSTdRVUZEU2l4TlFVRkZMRk5CUVZNc1NVRkJTU3hQUVVGUExGTkJRVk1zU1VGQlNUdEJRVUZCTzBGQlFVRTdRVUZITTBNc2EwSkJRV3RDTEZOQlFWTXNVVUZCVVN4UFFVRlBPMEZCUTNSRExFMUJRVWtzVDBGQlR5eFhRVUZYTzBGQlEyeENMRmRCUVU4N1FVRkRXQ3hOUVVGSkxGRkJRVkU3UVVGRFdpeE5RVUZKTEZGQlFWRXNWMEZCVnl4UFFVRlBPMEZCUXpGQ0xGRkJRVWtzVlVGQlZTeFJRVUZSTEZGQlFWRXNWMEZCVnp0QlFVTjZReXhSUVVGSkxGZEJRVmNzVFVGQlRUdEJRVU5xUWl4clFrRkJXU3hSUVVGUkxGRkJRVkU3UVVGRE5VSXNaMEpCUVZVc1VVRkJVU3hYUVVGWE8wRkJRemRDTEdOQlFWRXNXVUZCV1N4VFFVRlRPMEZCUVVFc1YwRkZOVUk3UVVGRFJDeHJRa0ZCV1R0QlFVTmFMR2RDUVVGVk8wRkJRVUU3UVVGRlpDeFhRVUZQTEV0QlFVc3NXVUZCWVN4WFFVRlZMRTlCUVU4c1ZVRkJWU3hOUVVGTk8wRkJRVUU3UVVGRk9VUXNUVUZCU1N4UFFVRlBPMEZCUTFBc1dVRkJVU3haUVVGWkxGRkJRVkVzWTBGQll6dEJRVU14UXl4UlFVRkpMRk5CUVZNc1QwRkJUeXhSUVVGUkxGZEJRVmM3UVVGRGJrTXNZVUZCVHl4TFFVRkxPMEZCUTJoQ0xGRkJRVWtzVVVGQlVUdEJRVU5TTEdWQlFWTXNVVUZCVVN4UFFVRlBMRkZCUVZFN1FVRkJRVHRCUVVWNFF5eFRRVUZQTzBGQlFVRTdRVUZGV0N3clFrRkJLMElzVTBGQlV5eE5RVUZOTzBGQlF6RkRMRTFCUVVrc1ZVRkJWU3hQUVVGUExFdEJRVXNzVjBGQlZ5eEpRVUZKTzBGQlEzcERMRTFCUVVrc1ZVRkJWU3gzUWtGQmQwSTdRVUZEYkVNc1dVRkJVU3hSUVVGUk8wRkJRMmhDTEZsQlFWRXNWMEZCVnp0QlFVRkJPMEZCUVVFN1FVRkhNMElzZDBKQlFYZENPMEZCUTNCQ0xESkNRVUY1UWp0QlFVRkJPMEZCUlRkQ0xDdENRVUVyUWp0QlFVTXpRaXhOUVVGSkxHTkJRV003UVVGRGJFSXNkVUpCUVhGQ08wRkJRM0pDTEhsQ1FVRjFRanRCUVVOMlFpeFRRVUZQTzBGQlFVRTdRVUZGV0N3MlFrRkJOa0k3UVVGRGVrSXNUVUZCU1N4WFFVRlhMRWRCUVVjN1FVRkRiRUlzUzBGQlJ6dEJRVU5ETEZkQlFVOHNaVUZCWlN4VFFVRlRMRWRCUVVjN1FVRkRPVUlzYTBKQlFWazdRVUZEV2l4MVFrRkJhVUk3UVVGRGFrSXNWVUZCU1N4VlFVRlZPMEZCUTJRc1YwRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVUZITEVWQlFVVXNSMEZCUnp0QlFVTndRaXhaUVVGSkxFOUJRVThzVlVGQlZUdEJRVU55UWl4aFFVRkxMRWRCUVVjc1RVRkJUU3hOUVVGTkxFdEJRVXM3UVVGQlFUdEJRVUZCTzBGQlFVRXNWMEZITlVJc1pVRkJaU3hUUVVGVE8wRkJRMnBETEhWQ1FVRnhRanRCUVVOeVFpeDVRa0ZCZFVJN1FVRkJRVHRCUVVVelFpeG5RMEZCWjBNN1FVRkROVUlzVFVGQlNTeG5Ra0ZCWjBJN1FVRkRjRUlzYjBKQlFXdENPMEZCUTJ4Q0xHZENRVUZqTEZGQlFWRXNVMEZCVlN4SFFVRkhPMEZCUXk5Q0xFMUJRVVVzUzBGQlN5eFpRVUZaTEV0QlFVc3NUVUZCVFN4RlFVRkZMRkZCUVZFN1FVRkJRVHRCUVVVMVF5eE5RVUZKTEdGQlFXRXNaVUZCWlN4TlFVRk5PMEZCUTNSRExFMUJRVWtzU1VGQlNTeFhRVUZYTzBGQlEyNUNMRk5CUVU4N1FVRkRTQ3hsUVVGWExFVkJRVVU3UVVGQlFUdEJRVVZ5UWl4clJFRkJhMFFzU1VGQlNUdEJRVU5zUkN4MVFrRkJjVUk3UVVGRGFrSTdRVUZEUVN4dFFrRkJaU3hQUVVGUExHVkJRV1VzVVVGQlVTeFpRVUZaTzBGQlFVRTdRVUZGTjBRc2FVSkJRV1VzUzBGQlN6dEJRVU53UWl4SlFVRkZPMEZCUTBZc1QwRkJTeXhYUVVGWk8wRkJRMklzVVVGQlNTeEZRVUZGTEhOQ1FVRnpRanRCUVVONFFqdEJRVUZCTEV0QlEwdzdRVUZCUVR0QlFVVlFMRzFEUVVGdFF5eFRRVUZUTzBGQlEzaERMRTFCUVVrc1EwRkJReXhuUWtGQlowSXNTMEZCU3l4VFFVRlZMRWRCUVVjN1FVRkJSU3hYUVVGUExFVkJRVVVzVjBGQlZ5eFJRVUZSTzBGQlFVRTdRVUZEYWtVc2IwSkJRV2RDTEV0QlFVczdRVUZCUVR0QlFVVTNRaXcwUWtGQk5FSXNVMEZCVXp0QlFVTnFReXhOUVVGSkxFbEJRVWtzWjBKQlFXZENPMEZCUTNoQ0xGTkJRVTg3UVVGRFNDeFJRVUZKTEdkQ1FVRm5RaXhGUVVGRkxFZEJRVWNzVjBGQlZ5eFJRVUZSTEZGQlFWRTdRVUZEYUVRc2MwSkJRV2RDTEU5QlFVOHNSMEZCUnp0QlFVTXhRanRCUVVGQk8wRkJRVUU3UVVGSFdpeDFRa0ZCZFVJc1VVRkJVVHRCUVVNelFpeFRRVUZQTEVsQlFVa3NZVUZCWVN4VlFVRlZMRTlCUVU4N1FVRkJRVHRCUVVVM1F5eGpRVUZqTEVsQlFVa3NZMEZCWXp0QlFVTTFRaXhOUVVGSkxFMUJRVTA3UVVGRFZpeFRRVUZQTEZkQlFWazdRVUZEWml4UlFVRkpMR05CUVdNc2RVSkJRWFZDTEdGQlFXRTdRVUZEZEVRc1VVRkJTVHRCUVVOQkxHMUNRVUZoTEV0QlFVczdRVUZEYkVJc1lVRkJUeXhIUVVGSExFMUJRVTBzVFVGQlRUdEJRVUZCTEdGQlJXNUNMRWRCUVZBN1FVRkRTU3h6UWtGQlowSXNZVUZCWVR0QlFVRkJMR05CUldwRE8wRkJRMGtzYlVKQlFXRXNXVUZCV1R0QlFVTjZRaXhWUVVGSk8wRkJRMEU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKYUVJc1NVRkJTU3hQUVVGUExFTkJRVVVzVVVGQlVTeEhRVUZITEZGQlFWRXNSMEZCUnl4SlFVRkpPMEZCUTNaRExFbEJRVWtzWTBGQll6dEJRVU5zUWl4SlFVRkpMRmxCUVZrN1FVRkRhRUlzU1VGQlNTeGhRVUZoTzBGQlEycENMRWxCUVVrc1kwRkJZenRCUVVOc1FpeEpRVUZKTEd0Q1FVRnJRanRCUVVOMFFpeHJRa0ZCYTBJc1NVRkJTU3hSUVVGUExFbEJRVWtzU1VGQlNUdEJRVU5xUXl4TlFVRkpMRk5CUVZNc1MwRkJTeXhOUVVGTkxFOUJRVThzVDBGQlR6dEJRVU4wUXl4TlFVRkpMRk5CUVZNN1FVRkRZaXhOUVVGSkxFMUJRVTA3UVVGRFZpeE5RVUZKTEZOQlFWTTdRVUZEWWl4TlFVRkpMRXRCUVVzc1JVRkJSVHRCUVVOWUxFMUJRVWtzV1VGQldTeFZRVUZWTzBGQlF6RkNMRTFCUVVrc1RVRkJUU3h4UWtGQmNVSTdRVUZCUVN4SlFVTXpRaXhUUVVGVE8wRkJRVUVzU1VGRFZDeGhRVUZoTEVOQlFVVXNUMEZCVHl4alFVRmpMR05CUVdNc1RVRkJUU3hWUVVGVk8wRkJRVUVzU1VGRGJFVXNTMEZCU3l4aFFVRmhPMEZCUVVFc1NVRkRiRUlzVFVGQlRTeGhRVUZoTzBGQlFVRXNTVUZEYmtJc1dVRkJXU3hoUVVGaE8wRkJRVUVzU1VGRGVrSXNTMEZCU3l4aFFVRmhPMEZCUVVFc1NVRkRiRUlzVTBGQlV5eGhRVUZoTzBGQlFVRXNTVUZEZEVJc1VVRkJVU3hoUVVGaE8wRkJRVUVzU1VGRGNrSXNUMEZCVHl4elFrRkJjMElzVlVGQlZTeFBRVUZQTzBGQlFVRXNTVUZET1VNc1QwRkJUeXh6UWtGQmMwSXNWVUZCVlN4UFFVRlBPMEZCUVVFc1RVRkRPVU03UVVGRFNpeE5RVUZKTzBGQlEwRXNWMEZCVHl4TFFVRkxPMEZCUTJoQ0xFbEJRVVVzVDBGQlR6dEJRVU5VTEUxQlFVa3NWMEZCVnl4WFFVRlpPMEZCUTNaQ0xFMUJRVVVzUzBGQlN5eFBRVUZQTEU5QlFVOHNTMEZCU3l4UFFVRlBPMEZCUVVFN1FVRkZja01zVFVGQlNTeExRVUZMTEU5QlFVOHNTMEZCU3l4SlFVRkpMRWxCUVVrN1FVRkROMElzVFVGQlNTeEpRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpPMEZCUTFJc1UwRkJUenRCUVVGQk8wRkJSVmdzYlVOQlFXMURPMEZCUXk5Q0xFMUJRVWtzUTBGQlF5eExRVUZMTzBGQlEwNHNVMEZCU3l4TFFVRkxMRVZCUVVVN1FVRkRhRUlzU1VGQlJTeExRVUZMTzBGQlExQXNUMEZCU3l4VlFVRlZPMEZCUTJZc1UwRkJUeXhMUVVGTE8wRkJRVUU3UVVGRmFFSXNiVU5CUVcxRE8wRkJReTlDTEUxQlFVa3NRMEZCUXl4TFFVRkxPMEZCUTA0c1YwRkJUenRCUVVOWUxFMUJRVWtzUlVGQlJTeExRVUZMTEZkQlFWYzdRVUZEYkVJc1UwRkJTeXhMUVVGTE8wRkJRMlFzVDBGQlN5eFRRVUZUTEV0QlFVc3NVMEZCVXp0QlFVTTFRaXhUUVVGUE8wRkJRVUU3UVVGRldDeEpRVUZMTEUxQlFVc3NiVUpCUVcxQ0xGRkJRVkVzY1VKQlFYRkNMRWxCUVVrN1FVRkRNVVFzTkVKQlFUQkNMREJDUVVFd1FqdEJRVUZCTzBGQlJYaEVMR3REUVVGclF5eHBRa0ZCYVVJN1FVRkRMME1zVFVGQlNTeExRVUZMTEZWQlFWVXNiVUpCUVcxQ0xHZENRVUZuUWl4blFrRkJaMElzWlVGQlpUdEJRVU5xUmp0QlFVTkJMRmRCUVU4c1owSkJRV2RDTEV0QlFVc3NVMEZCVlN4SFFVRkhPMEZCUTNKRE8wRkJRMEVzWVVGQlR6dEJRVUZCTEU5QlExSXNVMEZCVlN4SFFVRkhPMEZCUTFvN1FVRkRRU3hoUVVGUExGVkJRVlU3UVVGQlFUdEJRVUZCTzBGQlIzcENMRk5CUVU4N1FVRkJRVHRCUVVWWUxIVkNRVUYxUWl4WlFVRlpPMEZCUXk5Q0xFbEJRVVU3UVVGRFJpeE5RVUZKTEVOQlFVTXNTMEZCU3l4VlFVRlZMRVZCUVVVc1MwRkJTeXhYUVVGWExFZEJRVWM3UVVGRGNrTXNVMEZCU3l4VFFVRlRMRXRCUVVzc1MwRkJTenRCUVVGQk8wRkJSVFZDTEZsQlFWVXNTMEZCU3p0QlFVTm1MR1ZCUVdFc1dVRkJXVHRCUVVGQk8wRkJSVGRDTEhsQ1FVRjVRanRCUVVOeVFpeE5RVUZKTEU5QlFVOHNWVUZCVlN4VlFVRlZMRk5CUVZNN1FVRkRlRU1zV1VGQlZUdEJRVU5XTEdWQlFXRXNUVUZCVFR0QlFVRkJPMEZCUlhaQ0xITkNRVUZ6UWl4WlFVRlpMR1ZCUVdVN1FVRkROME1zVFVGQlNTeGpRVUZqTzBGQlEyeENMRTFCUVVrc1owSkJRV2RDTEV0QlFVc3NWVUZCVnl4RlFVRkRMR2RDUVVGblFpeGxRVUZsTEU5QlFVOHNZMEZCWlN4RlFVRkRMRVZCUVVVc1kwRkJZeXhsUVVGbExFMUJRVTA3UVVGRE5VZ3NNa0pCUVhWQ0xHZENRVUZuUWl4alFVRmpMRXRCUVVzc1RVRkJUU3hqUVVGak8wRkJRVUU3UVVGRmJFWXNUVUZCU1N4bFFVRmxPMEZCUTJZN1FVRkRTaXhSUVVGTk8wRkJRMDRzVFVGQlNTeG5Ra0ZCWjBJN1FVRkRhRUlzWTBGQlZTeE5RVUZOTzBGQlEzQkNMRTFCUVVrc2IwSkJRVzlDTzBGQlEzQkNMRkZCUVVrc2EwSkJRV3RDTEZWQlFWVXNTVUZCU1R0QlFVTndReXhSUVVGSkxGbEJRVmtzVjBGQlZ6dEJRVU16UWl4MVFrRkJiVUlzVDBGQlR5eFZRVUZWTzBGQlEzQkRMRzlDUVVGblFpeFZRVUZWTEU5QlFVOHNWVUZCVlR0QlFVTXpReXhSUVVGSkxGbEJRVmtzVlVGQlZTeFhRVUZYTEZGQlFWRTdRVUZEZWtNc1lVRkJUeXhsUVVGbExGTkJRVk1zVjBGQlZ5eFZRVUZWTzBGQlEzQkVMSE5DUVVGblFpeE5RVUZOTEZWQlFWVTdRVUZEYUVNc2MwSkJRV2RDTEU5QlFVOHNWVUZCVlR0QlFVTnFReXh6UWtGQlowSXNWVUZCVlN4VlFVRlZPMEZCUTNCRExITkNRVUZuUWl4VFFVRlRMRlZCUVZVN1FVRkRia01zVlVGQlNTeFZRVUZWTzBGQlExWXNkMEpCUVdkQ0xHRkJRV0VzVlVGQlZUdEJRVU16UXl4VlFVRkpMRlZCUVZVN1FVRkRWaXgzUWtGQlowSXNUVUZCVFN4VlFVRlZPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTV2hFTEc5Q1FVRnZRanRCUVVOb1FpeE5RVUZKTEdkQ1FVRm5RaXhSUVVGUk8wRkJRelZDTEZOQlFVOHNjVUpCUVhGQ08wRkJRVUVzU1VGRGVFSXNVMEZCVXp0QlFVRkJMRWxCUTFRc1lVRkJZU3hQUVVGUExIbENRVUY1UWl4VFFVRlRPMEZCUVVFc1NVRkRkRVFzUzBGQlN5eGpRVUZqTzBGQlFVRXNTVUZEYmtJc1RVRkJUU3hqUVVGak8wRkJRVUVzU1VGRGNFSXNXVUZCV1N4alFVRmpPMEZCUVVFc1NVRkRNVUlzUzBGQlN5eGpRVUZqTzBGQlFVRXNTVUZEYmtJc1UwRkJVeXhqUVVGak8wRkJRVUVzU1VGRGRrSXNVVUZCVVN4alFVRmpPMEZCUVVFc1NVRkRkRUlzVDBGQlR5eHRRa0ZCYlVJN1FVRkJRU3hKUVVNeFFpeFBRVUZQTEdOQlFXTXNWVUZCVlR0QlFVRkJMRTFCUXk5Q08wRkJRVUU3UVVGRlVpeG5Ra0ZCWjBJc1MwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeEpRVUZKTzBGQlEycERMRTFCUVVrc1lVRkJZVHRCUVVOcVFpeE5RVUZKTzBGQlEwRXNhVUpCUVdFc1MwRkJTenRCUVVOc1FpeFhRVUZQTEVkQlFVY3NTVUZCU1N4SlFVRkpPMEZCUVVFc1dVRkZkRUk3UVVGRFNTeHBRa0ZCWVN4WlFVRlpPMEZCUVVFN1FVRkJRVHRCUVVkcVF5eG5RMEZCWjBNc1MwRkJTenRCUVVOcVF5eHZRa0ZCYTBJc1MwRkJTeXgxUWtGQmRVSTdRVUZCUVR0QlFVVnNSQ3h0UTBGQmJVTXNTVUZCU1N4TlFVRk5MR1ZCUVdVc1UwRkJVenRCUVVOcVJTeFRRVUZQTEU5QlFVOHNUMEZCVHl4aFFVRmhMRXRCUVVzc1YwRkJXVHRCUVVNdlF5eFJRVUZKTEZsQlFWazdRVUZEYUVJc1VVRkJTVHRCUVVOQk8wRkJRMG9zYVVKQlFXRXNUVUZCVFR0QlFVTnVRaXhSUVVGSk8wRkJRMEVzWVVGQlR5eEhRVUZITEUxQlFVMHNUVUZCVFR0QlFVRkJMR05CUlRGQ08wRkJRMGtzYlVKQlFXRXNWMEZCVnp0QlFVTjRRaXhWUVVGSk8wRkJRMEVzSzBKQlFYVkNPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWFpETEN0Q1FVRXJRaXhWUVVGVkxFMUJRVTA3UVVGRE0wTXNVMEZCVHl4VFFVRlZMRmxCUVZrc1dVRkJXVHRCUVVOeVF5eFhRVUZQTEZOQlFWTXNTMEZCU3l4TlFVRk5MREJDUVVFd1FpeFpRVUZaTEU5QlFVOHNNRUpCUVRCQ0xGbEJRVms3UVVGQlFUdEJRVUZCTzBGQlIzUklMRWxCUVVrc2NVSkJRWEZDTzBGQlEzcENMSEZDUVVGeFFpeExRVUZMTEZOQlFWTTdRVUZETDBJc1RVRkJTVHRCUVVOS0xFMUJRVWs3UVVGRFFTeFRRVUZMTEZGQlFWRXNXVUZCV1R0QlFVRkJMRmRCUlhSQ0xFZEJRVkE3UVVGQlFUdEJRVU5CTEUxQlFVa3NUMEZCVHp0QlFVTlFMRkZCUVVrN1FVRkRRU3hWUVVGSkxFOUJRVThzV1VGQldTeERRVUZGTEZOQlFXdENMRkZCUVZFN1FVRkRia1FzVlVGQlNTeFJRVUZSTEZsQlFWa3NVMEZCVXl4aFFVRmhPMEZCUXpGRExHZENRVUZSTEZOQlFWTXNXVUZCV1R0QlFVTTNRaXhqUVVGTkxGVkJRVlVzYjBKQlFXOUNMRTFCUVUwN1FVRkRNVU1zWlVGQlR5eFBRVUZQTzBGQlFVRXNhVUpCUlZRc1VVRkJVU3hoUVVGaE8wRkJRekZDTEdkQ1FVRlJMRWxCUVVrc1dVRkJXU3h2UWtGQmIwSXNRMEZCUlN4UlFVRlJPMEZCUTNSRUxHVkJRVThzVDBGQlR6dEJRVUZCTzBGQlJXeENMRlZCUVVrc1UwRkJVeXhSUVVGUkxHVkJRV1U3UVVGRGFFTXNjMEpCUVdNN1FVRkRaQ3haUVVGSkxFTkJRVU1zVVVGQlVTeDVRa0ZCZVVJc1VVRkJVVHRCUVVNeFF5eGpRVUZKTzBGQlEwRXNiMEpCUVZFc2NVSkJRWEZDTzBGQlFVRXNiVUpCUlRGQ0xFZEJRVkE3UVVGQlFUdEJRVUZCTzBGQlJWSXNWVUZCU1N4VFFVRlRMRk5CUVZNc1EwRkJReXhOUVVGTkxHdENRVUZyUWp0QlFVTXpReXhuUWtGQlVTeExRVUZMTERCQ1FVRXlRaXhMUVVGSkxGTkJRVk03UVVGQlFUdEJRVUZCTEdGQlIzUkVMRWRCUVZBN1FVRkJRVHRCUVVGQk8wRkJSVklzU1VGQlNTeFpRVUZaTEdGQlFXRTdRVUZGTjBJc2VVSkJRWGxDTEVsQlFVa3NUVUZCVFN4WlFVRlpMRWxCUVVrN1FVRkRMME1zVFVGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4blFrRkJhVUlzUTBGQlF5eEpRVUZKTEZsQlFXRTdRVUZET1VNc1VVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eGxRVUZsTzBGQlF6RkNMRlZCUVVrc1EwRkJReXhIUVVGSExGTkJRVk03UVVGRFlpeGxRVUZQTEZWQlFWVXNTVUZCU1N4WFFVRlhPMEZCUTNCRExGTkJRVWNzVDBGQlR5eE5RVUZOTzBGQlFVRTdRVUZGY0VJc1YwRkJUeXhIUVVGSExFOUJRVThzWlVGQlpTeExRVUZMTEZkQlFWazdRVUZCUlN4aFFVRlBMR2RDUVVGblFpeEpRVUZKTEUxQlFVMHNXVUZCV1R0QlFVRkJPMEZCUVVFc1UwRkZMMFk3UVVGRFJDeFJRVUZKTEZGQlFWRXNSMEZCUnl4dFFrRkJiVUlzVFVGQlRTeFpRVUZaTEVkQlFVYzdRVUZEZGtRc1VVRkJTVHRCUVVOQkxGbEJRVTA3UVVGQlFTeGhRVVZJTEVsQlFWQTdRVUZEU1N4aFFVRlBMRlZCUVZVN1FVRkJRVHRCUVVWeVFpeFhRVUZQTEUxQlFVMHNVMEZCVXl4TlFVRk5MRk5CUVZVc1UwRkJVeXhSUVVGUk8wRkJRMjVFTEdGQlFVOHNVMEZCVXl4WFFVRlpPMEZCUTNoQ0xGbEJRVWtzVVVGQlVUdEJRVU5hTEdWQlFVOHNSMEZCUnl4VFFVRlRMRkZCUVZFN1FVRkJRVHRCUVVGQkxFOUJSV2hETEV0QlFVc3NVMEZCVlN4UlFVRlJPMEZCUTNSQ0xHRkJRVThzVFVGQlRTeFpRVUZaTEV0QlFVc3NWMEZCV1R0QlFVRkZMR1ZCUVU4N1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXN2UkN4SlFVRkpMR2RDUVVGblFqdEJRVU53UWl4SlFVRkpMRmxCUVZrc1QwRkJUeXhoUVVGaE8wRkJRM0JETEVsQlFVa3NVMEZCVXp0QlFVTmlMRWxCUVVrc2RVSkJRWFZDTzBGQlF6TkNMRWxCUVVrc2EwSkJRV3RDTzBGQlEzUkNMRWxCUVVrc1kwRkJZenRCUVVOc1FpeEpRVUZKTEdGQlFXRXNUMEZCVHl4alFVRmpMR1ZCUVdVc2MwSkJRWE5DTEV0QlFVc3NWVUZCVlR0QlFVTXhSaXhKUVVGSkxEUkNRVUUwUWp0QlFVTm9ReXhKUVVGSkxEWkNRVUUyUWp0QlFVTnFReXhKUVVGSkxIZENRVUYzUWl4VFFVRlZMRTlCUVU4N1FVRkJSU3hUUVVGUExFTkJRVU1zTmtKQlFUWkNMRXRCUVVzN1FVRkJRVHRCUVVONlJpeEpRVUZKTEdGQlFXRTdRVUZEYWtJc1NVRkJTU3hYUVVGWE8wRkJRMllzU1VGQlNTeFpRVUZaTzBGQlJXaENMR2xDUVVGcFFpeFRRVUZUTEZOQlFWTTdRVUZETDBJc1UwRkJUeXhWUVVOSUxGVkJRMGtzVjBGQldUdEJRVUZGTEZkQlFVOHNVVUZCVVN4TlFVRk5MRTFCUVUwc1kwRkJZeXhSUVVGUkxFMUJRVTBzVFVGQlRUdEJRVUZCTEUxQlF6TkZMRlZCUTBvN1FVRkJRVHRCUVVkU0xFbEJRVWs3UVVGRFNpeEpRVUZKTzBGQlEwRXNXVUZCVlR0QlFVRkJMRWxCUTA0c1YwRkJWeXhSUVVGUkxHRkJRV0VzVVVGQlVTeG5Ra0ZCWjBJc1VVRkJVU3h0UWtGQmJVSXNVVUZCVVR0QlFVRkJMRWxCUXpOR0xHRkJRV0VzVVVGQlVTeGxRVUZsTEZGQlFWRTdRVUZCUVR0QlFVRkJMRk5CUnpkRExFZEJRVkE3UVVGRFNTeFpRVUZWTEVOQlFVVXNWMEZCVnl4TlFVRk5MR0ZCUVdFN1FVRkJRVHRCUVVjNVF5dzJRa0ZCTmtJc1dVRkJXVHRCUVVOeVF5eFRRVUZQTEZkQlFWY3NWMEZCVnl4SlFVRkpMRmRCUVZjc1MwRkJTenRCUVVGQk8wRkJSWEpFTEVsQlFVa3NXVUZCV1N4VFFVRlZMR0ZCUVdFN1FVRkRia01zVFVGQlNUdEJRVU5CTEdkQ1FVRlpMRXRCUVVzc1EwRkJRenRCUVVOc1FpeG5Ra0ZCV1N4WFFVRlpPMEZCUVVVc1lVRkJUeXhEUVVGRE8wRkJRVUU3UVVGRGJFTXNWMEZCVHl4RFFVRkRPMEZCUVVFc1YwRkZUQ3hIUVVGUU8wRkJRMGtzWjBKQlFWa3NWMEZCV1R0QlFVRkZMR0ZCUVU4N1FVRkJRVHRCUVVOcVF5eFhRVUZQTzBGQlFVRTdRVUZCUVR0QlFVbG1MRWxCUVVrc1YwRkJWenRCUVVGQkxFVkJRMWdzVFVGQlRUdEJRVUZCTEVWQlEwNHNUMEZCVHp0QlFVRkJMRVZCUTFBc1YwRkJWenRCUVVGQkxFMUJRMUFzVVVGQlVUdEJRVUZGTEZkQlFVOHNWVUZCVlN4UlFVRlJPMEZCUVVFN1FVRkJRU3hGUVVOMlF5eFhRVUZYTzBGQlFVRTdRVUZIWml4MVEwRkJkVU1zVTBGQlV6dEJRVU0xUXl4VFFVRlBMRTlCUVU4c1dVRkJXU3haUVVGWkxFTkJRVU1zUzBGQlN5eExRVUZMTEZkQlF6TkRMRk5CUVZVc1MwRkJTenRCUVVOaUxGRkJRVWtzU1VGQlNTeGhRVUZoTEZWQlFXTXNWMEZCVnl4TFFVRk5PMEZCUTJoRUxGbEJRVTBzVlVGQlZUdEJRVU5vUWl4aFFVRlBMRWxCUVVrN1FVRkJRVHRCUVVWbUxGZEJRVTg3UVVGQlFTeE5RVVZVTEZOQlFWVXNTMEZCU3p0QlFVRkZMRmRCUVU4N1FVRkJRVHRCUVVGQk8wRkJSMnhETEVsQlFVa3NVVUZCVlN4WFFVRlpPMEZCUTNSQ0xHOUNRVUZwUWp0QlFVRkJPMEZCUldwQ0xGTkJRVTBzVlVGQlZTeFRRVUZUTEZOQlFWVXNUVUZCVFN4SlFVRkpMR0ZCUVdFN1FVRkRkRVFzVVVGQlNTeFJRVUZSTEV0QlFVc3NUMEZCVHl4SlFVRkpPMEZCUXpWQ0xGRkJRVWtzV1VGQldTeExRVUZMTzBGQlEzSkNMSEZEUVVGcFF5eFRRVUZUTEZGQlFWRXNVVUZCVHp0QlFVTnlSQ3hWUVVGSkxFTkJRVU1zVDBGQlRTeFBRVUZQTzBGQlEyUXNZMEZCVFN4SlFVRkpMRmRCUVZjc1UwRkJVeXhYUVVGWExGbEJRVms3UVVGRGVrUXNZVUZCVHl4SFFVRkhMRTlCUVUwc1ZVRkJWVHRCUVVGQk8wRkJSVGxDTEZGQlFVa3NZMEZCWXp0QlFVTnNRaXhSUVVGSk8wRkJRMEVzWVVGQlR5eFRRVUZUTEUxQlFVMHNUMEZCVHl4TFFVRkxMRXRCUXpsQ0xGVkJRVlVzU1VGQlNTeFJRVU5XTEUxQlFVMHNVMEZCVXl4TlFVRk5MSGxDUVVGNVFpeGxRVU01UXl4VFFVRlRMRmRCUVZrN1FVRkJSU3hsUVVGUExFMUJRVTBzVTBGQlV5eE5RVUZOTEhsQ1FVRjVRanRCUVVGQkxGTkJRV2xDTEVOQlFVVXNUMEZCWXl4WFFVRlhMRWxCUVVrc1lVRkJZU3hSUVVNM1NTeG5Ra0ZCWjBJc1MwRkJTeXhKUVVGSkxFMUJRVTBzUTBGQlF5eExRVUZMTEU5QlFVODdRVUZCUVN4alFVVndSRHRCUVVOSkxGVkJRVWs3UVVGRFFUdEJRVUZCTzBGQlFVRTdRVUZIV2l4VFFVRk5MRlZCUVZVc1RVRkJUU3hUUVVGVkxGZEJRVmNzU1VGQlNUdEJRVU16UXl4UlFVRkpMRkZCUVZFN1FVRkRXaXhSUVVGSkxHRkJRV0VzVlVGQlZTeG5Ra0ZCWjBJN1FVRkRka01zWVVGQlR5eExRVUZMTEUxQlFVMHNWMEZCVnl4TlFVRk5PMEZCUTNaRExGZEJRVThzUzBGQlN5eFBRVUZQTEZsQlFWa3NVMEZCVlN4UFFVRlBPMEZCUXpWRExHRkJRVThzVFVGQlRTeExRVUZMTEVsQlFVa3NRMEZCUlN4UFFVRmpMRXRCUVVzc1dVRkRkRU1zUzBGQlN5eFRRVUZWTEV0QlFVczdRVUZCUlN4bFFVRlBMRTFCUVUwc1MwRkJTeXhSUVVGUkxFdEJRVXM3UVVGQlFUdEJRVUZCTEU5QlF6TkVMRXRCUVVzN1FVRkJRVHRCUVVWYUxGTkJRVTBzVlVGQlZTeFJRVUZSTEZOQlFWVXNZVUZCWVR0QlFVTXpReXhSUVVGSkxFOUJRVThzWjBKQlFXZENPMEZCUTNaQ0xHRkJRVThzU1VGQlNTeExRVUZMTEVkQlFVY3NXVUZCV1N4TlFVRk5PMEZCUTNwRExGRkJRVWtzVVVGQlVUdEJRVU5TTEdGQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjc1dVRkJXU3hOUVVGTkxFMUJRVTBzV1VGQldTeExRVUZMTEU5QlFVODdRVUZEZGtVc1VVRkJTU3hYUVVGWExFdEJRVXM3UVVGRGNFSXNVVUZCU1N4VFFVRlRMRmRCUVZjN1FVRkRjRUlzWVVGQlR5eExRVU5HTEUxQlFVMHNVMEZCVXl4SlFVTm1MRTlCUVU4c1dVRkJXU3hUUVVGVE8wRkJRM0pETEZGQlFVa3NaMEpCUVdkQ0xFdEJRVXNzVDBGQlR5eFJRVUZSTEU5QlFVOHNTMEZCU3l4UFFVRlBMRk5CUVZNc1QwRkJUeXhUUVVGVkxFbEJRVWs3UVVGRGNrWXNZVUZCVHl4SFFVRkhMRmxCUTA0c1UwRkJVeXhOUVVGTkxGTkJRVlVzVTBGQlV6dEJRVUZGTEdWQlFVOHNSMEZCUnl4UlFVRlJMRkZCUVZFc1dVRkJXVHRCUVVGQkxGbEJRekZGTEVkQlFVY3NVVUZCVVN4TlFVRk5MRk5CUVZVc1UwRkJVenRCUVVGRkxHVkJRVThzVTBGQlV5eFJRVUZSTEZsQlFWazdRVUZCUVR0QlFVRkJMRTlCUXk5Rk8wRkJRMGdzVVVGQlNTeHBRa0ZCYVVJc1MwRkJTeXhIUVVGSExGbEJRVms3UVVGRGNrTXNZVUZCVHl4TFFVTkdMRTFCUVUwc1kwRkJZeXhOUVVOd1FpeFBRVUZQTEdOQlFXTXNVVUZCVVN4SlFVRkpMRk5CUVZVc1NVRkJTVHRCUVVGRkxHVkJRVThzV1VGQldUdEJRVUZCTzBGQlF6ZEZMRkZCUVVrc1EwRkJReXhwUWtGQmFVSTdRVUZEYkVJc1kwRkJVU3hMUVVGTExHVkJRV1VzUzBGQlN5eFZRVUZWTEdWQlFXVXNVMEZCVXl4TFFVRkxMRTlCUVU4c2VVSkJRekZGTEhOQ1FVRnhRaXhUUVVGVExFdEJRVXNzVDBGQlR6dEJRVU51UkN4UlFVRkpMRmxCUVZrc1MwRkJTeXhQUVVGUE8wRkJRelZDTEZGQlFVa3NUVUZCVFN4TFFVRkxMRWRCUVVjc1RVRkJUVHRCUVVONFFpeHZRa0ZCWjBJc1IwRkJSeXhIUVVGSE8wRkJRMnhDTEZWQlFVazdRVUZEUVN4bFFVRlBMRWxCUVVrc1NVRkJTU3hIUVVGSExFOUJRVTg3UVVGQlFTeGxRVVYwUWl4SFFVRlFPMEZCUTBrc1pVRkJUenRCUVVGQk8wRkJRVUU3UVVGSFppeFJRVUZKTEUxQlFVc3NVMEZCVXl4UFFVRlBMRk5CUVZVc1MwRkJTU3hUUVVGVE8wRkJRelZETEZWQlFVa3NXVUZCV1N4SlFVRkhMRWxCUVVrc1pVRkJaU3hKUVVGSE8wRkJRM3BETEZWQlFVa3NVVUZCVVN4VlFVRlZPMEZCUTNSQ0xGVkJRVWtzVVVGQlVTeFpRVUZaTzBGQlEzaENMR0ZCUVU4N1FVRkJRU3hSUVVOSUxHRkJRV0U3UVVGQlFTeFJRVU5pTEdGQlFXRXNRMEZCUXl4UlFVTldMRkZCUVZFc1kwRkJZeXhUUVVGVExFMUJRVTBzVVVGRGFrTXNVMEZCVlN4SFFVRkhPMEZCUTFRc1kwRkJTU3hQUVVGUExHRkJRV0VzUjBGQlJ6dEJRVU16UWl4cFFrRkJUeXhSUVVGUkxGTkJRVk1zUzBGQlN5eExRVUZMTEZOQlFWVXNUVUZCVFR0QlFVRkZMRzFDUVVGUExFOUJRVThzVDBGQlR6dEJRVUZCTzBGQlFVRXNXVUZEZWtVc1UwRkJWU3hIUVVGSE8wRkJRVVVzYVVKQlFVOHNUMEZCVHl4UFFVRlBMR0ZCUVdFc1IwRkJSenRCUVVGQkxHRkJRekZFTzBGQlFVRTdRVUZCUVN4UFFVVllMRU5CUVVNc1RVRkJUU3hSUVVGUkxFMUJRVTBzU1VGQlJ5eEpRVUZKTEdsQ1FVRnBRaXhKUVVGSE8wRkJRMjVFTEZkQlFVOHNUVUZEU0N4TFFVRkxMRTFCUVUwc1NVRkJTU3hOUVVGTkxFOUJRVThzV1VGQldTeEpRVUZKTEZWQlEzWkRMRTlCUVU4c2EwSkJRMW9zWjBKQlEwa3NTMEZCU3l4UFFVRlBMR3RDUVVOYUxFdEJRVXNzVFVGQlRTeFZRVUZWTEU5QlFVODdRVUZCUVR0QlFVVjRReXhUUVVGTkxGVkJRVlVzVTBGQlV5eFRRVUZWTEdkQ1FVRm5RanRCUVVNdlF5eFhRVUZQTEV0QlFVc3NaVUZCWlN4SlFVRkpPMEZCUVVFN1FVRkZia01zVTBGQlRTeFZRVUZWTEZGQlFWRXNVMEZCVlN4alFVRmpPMEZCUXpWRExGZEJRVThzUzBGQlN5eGxRVUZsTEUxQlFVMDdRVUZCUVR0QlFVVnlReXhUUVVGTkxGVkJRVlVzVTBGQlV5eFRRVUZWTEZGQlFWRTdRVUZEZGtNc1YwRkJUeXhMUVVGTExHVkJRV1VzVDBGQlR6dEJRVUZCTzBGQlJYUkRMRk5CUVUwc1ZVRkJWU3hSUVVGUkxGTkJRVlVzVTBGQlV6dEJRVU4yUXl4WFFVRlBMRXRCUVVzc1pVRkJaU3hOUVVGTk8wRkJRVUU3UVVGRmNrTXNVMEZCVFN4VlFVRlZMRTlCUVU4c1UwRkJWU3hWUVVGVk8wRkJRM1pETEZkQlFVOHNTMEZCU3l4bFFVRmxMRXRCUVVzN1FVRkJRVHRCUVVWd1F5eFRRVUZOTEZWQlFWVXNWVUZCVlN4VFFVRlZMR05CUVdNN1FVRkRPVU1zVjBGQlR5eExRVUZMTEdWQlFXVXNVVUZCVVR0QlFVRkJPMEZCUlhaRExGTkJRVTBzVlVGQlZTeGxRVUZsTEZkQlFWazdRVUZEZGtNc1YwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFhRVUZYTEVsQlFVa3NTMEZCU3l4SFFVRkhMRmxCUVZrN1FVRkJRVHRCUVVVeFJDeFRRVUZOTEZWQlFWVXNWVUZCVlN4VFFVRlZMRTlCUVU4N1FVRkRka01zVjBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnl4WFFVRlhMRWxCUVVrc1MwRkJTeXhIUVVGSExGbEJRVmtzVFVGQlRTeFJRVUZSTEZOQlEyaEZMRTFCUVUwc1RVRkJUU3hMUVVGTExFOUJRVThzVFVGRGVFSTdRVUZCUVR0QlFVVlNMRk5CUVUwc1ZVRkJWU3hWUVVGVkxGZEJRVms3UVVGRGJFTXNWMEZCVHl4TFFVRkxMR1ZCUVdVN1FVRkJRVHRCUVVVdlFpeFRRVUZOTEZWQlFWVXNZVUZCWVN4VFFVRlZMR0ZCUVdFN1FVRkRhRVFzVTBGQlN5eFBRVUZQTEdOQlFXTTdRVUZETVVJc1VVRkJTU3hYUVVGWExGTkJRVlVzUzBGQlN6dEJRVU14UWl4VlFVRkpMRU5CUVVNN1FVRkRSQ3hsUVVGUE8wRkJRMWdzVlVGQlNTeE5RVUZOTEU5QlFVOHNUMEZCVHl4WlFVRlpPMEZCUTNCRExHVkJRVk1zUzBGQlN6dEJRVU5XTEZsQlFVa3NUMEZCVHl4TFFVRkxPMEZCUTFvc1kwRkJTVHRCUVVOQkxHZENRVUZKTEV0QlFVc3NTVUZCU1R0QlFVRkJMRzFDUVVWV0xFZEJRVkE3UVVGQlFUdEJRVU5TTEdGQlFVODdRVUZCUVR0QlFVVllMRkZCUVVrc1MwRkJTeXhQUVVGUExGVkJRVlU3UVVGRGRFSXNWMEZCU3l4TFFVRkxMRkZCUVZFc1dVRkJXU3hMUVVGTExFOUJRVTg3UVVGQlFUdEJRVVU1UXl4VFFVRkxMRTlCUVU4c1YwRkJWenRCUVVOMlFpeFRRVUZMTEV0QlFVc3NWMEZCVnp0QlFVTnlRaXhYUVVGUE8wRkJRVUU3UVVGRldDeFRRVUZOTEZWQlFWVXNZMEZCWXl4WFFVRlpPMEZCUTNSRExHMUNRVUZsTEZOQlFWTTdRVUZEY0VJc1lVRkJUeXhOUVVGTk8wRkJRVUU3UVVGRmFrSXNWMEZCVHl4TFFVRkxMRmRCUVZjN1FVRkJRVHRCUVVVelFpeFRRVUZOTEZWQlFWVXNUVUZCVFN4VFFVRlZMRXRCUVVzc1MwRkJTenRCUVVOMFF5eFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRTFCUVVzc1MwRkJTeXhQUVVGUExGTkJRVk1zVDBGQlR5eEpRVUZITEUxQlFVMHNWVUZCVlN4SlFVRkhPMEZCUXpORUxGRkJRVWtzVjBGQlZ6dEJRVU5tTEZGQlFVa3NWMEZCVnl4TlFVRk5PMEZCUTJwQ0xHbENRVUZYTERoQ1FVRTRRaXhUUVVGVE8wRkJRVUU3UVVGRmRFUXNWMEZCVHl4TFFVRkxMRTlCUVU4c1lVRkJZU3hUUVVGVkxFOUJRVTg3UVVGRE4wTXNZVUZCVHl4TlFVRk5MRXRCUVVzc1QwRkJUeXhEUVVGRkxFOUJRV01zVFVGQlRTeFBRVUZQTEUxQlFVMHNUMEZCVHl4UFFVRlBMRU5CUVVNc1QwRkJUeXhOUVVGTkxGRkJRVkVzUTBGQlF6dEJRVUZCTEU5QlEyeEhMRXRCUVVzc1UwRkJWU3hMUVVGTE8wRkJRVVVzWVVGQlR5eEpRVUZKTEdOQlFXTXNZVUZCWVN4UFFVRlBMRWxCUVVrc1UwRkJVeXhOUVVGTkxFbEJRVWs3UVVGQlFTeFBRVU40Uml4TFFVRkxMRk5CUVZVc1dVRkJXVHRCUVVNMVFpeFZRVUZKTEZOQlFWTTdRVUZEVkN4WlFVRkpPMEZCUTBFc2RVSkJRV0VzUzBGQlN5eFRRVUZUTzBGQlFVRXNhVUpCUlhoQ0xFZEJRVkE3UVVGQlFUdEJRVUZCTzBGQlJVb3NZVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhUUVVGTkxGVkJRVlVzVTBGQlV5eFRRVUZWTEdGQlFXRXNaVUZCWlR0QlFVTXpSQ3hSUVVGSkxFOUJRVThzWjBKQlFXZENMRmxCUVZrc1EwRkJReXhSUVVGUkxHTkJRV003UVVGRE1VUXNWVUZCU1N4TlFVRk5MR0ZCUVdFc1lVRkJZU3hMUVVGTExFOUJRVThzVVVGQlVUdEJRVU40UkN4VlFVRkpMRkZCUVZFN1FVRkRVaXhsUVVGUExGVkJRVlVzU1VGQlNTeFhRVUZYTEdkQ1FVRm5RanRCUVVOd1JDeFZRVUZKTzBGQlEwRXNXVUZCU1N4UFFVRlBMR3RDUVVGclFpeFpRVUZaTzBGQlEzSkRMR1ZCUVVzc1pVRkJaU3hSUVVGUkxGTkJRVlVzVTBGQlV6dEJRVU16UXl4NVFrRkJZU3hoUVVGaExGTkJRVk1zWTBGQll6dEJRVUZCTzBGQlFVRXNaVUZIY0VRN1FVRkRSQ3gzUWtGQll5eGhRVUZoTEVOQlFVVXNUMEZCVHl4aFFVRmhMRk5CUVZNN1FVRkJRVHRCUVVGQkxHVkJSek5FTEV0QlFWQTdRVUZCUVR0QlFVVkJMR0ZCUVU4c1MwRkJTeXhOUVVGTkxFOUJRVThzVDBGQlR5eExRVUZMTEU5QlFVODdRVUZCUVN4WFFVVXpRenRCUVVORUxHRkJRVThzUzBGQlN5eE5RVUZOTEU5QlFVOHNUMEZCVHl4aFFVRmhMRTlCUVU4N1FVRkJRVHRCUVVGQk8wRkJSelZFTEZOQlFVMHNWVUZCVlN4TlFVRk5MRk5CUVZVc1MwRkJTeXhMUVVGTE8wRkJRM1JETEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc1RVRkJTeXhMUVVGTExFOUJRVThzVTBGQlV5eFBRVUZQTEVsQlFVY3NUVUZCVFN4VlFVRlZMRWxCUVVjN1FVRkRNMFFzVVVGQlNTeFhRVUZYTzBGQlEyWXNVVUZCU1N4WFFVRlhMRTFCUVUwN1FVRkRha0lzYVVKQlFWY3NPRUpCUVRoQ0xGTkJRVk03UVVGQlFUdEJRVVYwUkN4WFFVRlBMRXRCUVVzc1QwRkJUeXhoUVVGaExGTkJRVlVzVDBGQlR6dEJRVUZGTEdGQlFVOHNUVUZCVFN4TFFVRkxMRTlCUVU4c1EwRkJSU3hQUVVGakxFMUJRVTBzVDBGQlR5eFJRVUZSTEVOQlFVTXNWMEZCVnl4TlFVRk5MRTlCUVU4c1QwRkJUeXhEUVVGRExFOUJRVTg3UVVGQlFTeFBRVU53U2l4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzU1VGQlNTeGpRVUZqTEdGQlFXRXNUMEZCVHl4SlFVRkpMRk5CUVZNc1RVRkJUU3hKUVVGSk8wRkJRVUVzVDBGRE1VWXNTMEZCU3l4VFFVRlZMRmxCUVZrN1FVRkROVUlzVlVGQlNTeFRRVUZUTzBGQlExUXNXVUZCU1R0QlFVTkJMSFZDUVVGaExFdEJRVXNzVTBGQlV6dEJRVUZCTEdsQ1FVVjRRaXhIUVVGUU8wRkJRVUU3UVVGQlFUdEJRVVZLTEdGQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1UwRkJUU3hWUVVGVkxGTkJRVk1zVTBGQlZTeExRVUZMTzBGQlEzQkRMRkZCUVVrc1VVRkJVVHRCUVVOYUxGZEJRVThzUzBGQlN5eFBRVUZQTEdGQlFXRXNVMEZCVlN4UFFVRlBPMEZCUVVVc1lVRkJUeXhOUVVGTkxFdEJRVXNzVDBGQlR5eERRVUZGTEU5QlFXTXNUVUZCVFN4VlFVRlZMRTFCUVUwc1EwRkJRenRCUVVGQkxFOUJRemxITEV0QlFVc3NVMEZCVlN4TFFVRkxPMEZCUVVVc1lVRkJUeXhKUVVGSkxHTkJRV01zWVVGQllTeFBRVUZQTEVsQlFVa3NVMEZCVXl4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVVdlJpeFRRVUZOTEZWQlFWVXNVVUZCVVN4WFFVRlpPMEZCUTJoRExGRkJRVWtzVVVGQlVUdEJRVU5hTEZkQlFVOHNTMEZCU3l4UFFVRlBMR0ZCUVdFc1UwRkJWU3hQUVVGUE8wRkJRVVVzWVVGQlR5eE5RVUZOTEV0QlFVc3NUMEZCVHl4RFFVRkZMRTlCUVdNc1RVRkJUU3hsUVVGbExFOUJRVTg3UVVGQlFTeFBRVU51U0N4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzU1VGQlNTeGpRVUZqTEdGQlFXRXNUMEZCVHl4SlFVRkpMRk5CUVZNc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGRkwwWXNVMEZCVFN4VlFVRlZMRlZCUVZVc1UwRkJWU3hQUVVGTk8wRkJRM1JETEZGQlFVa3NVVUZCVVR0QlFVTmFMRmRCUVU4c1MwRkJTeXhQUVVGUExGbEJRVmtzVTBGQlZTeFBRVUZQTzBGQlF6VkRMR0ZCUVU4c1RVRkJUU3hMUVVGTExGRkJRVkU3UVVGQlFTeFJRVU4wUWl4TlFVRk5PMEZCUVVFc1VVRkRUanRCUVVGQkxGTkJRMFFzUzBGQlN5eFRRVUZWTEZGQlFWRTdRVUZCUlN4bFFVRlBMRTlCUVU4c1NVRkJTU3hUUVVGVkxFdEJRVXM3UVVGQlJTeHBRa0ZCVHl4TlFVRk5MRXRCUVVzc1VVRkJVU3hMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZIZEVjc1UwRkJUU3hWUVVGVkxGVkJRVlVzVTBGQlZTeFRRVUZUTEdWQlFXVXNVMEZCVXp0QlFVTnFSU3hSUVVGSkxGRkJRVkU3UVVGRFdpeFJRVUZKTEZGQlFVOHNUVUZCVFN4UlFVRlJMR2xDUVVGcFFpeG5Ra0ZCWjBJN1FVRkRNVVFzWTBGQlZTeFhRVUZaTEZOQlFVOHNVMEZCV1R0QlFVTjZReXhSUVVGSkxHTkJRV01zVlVGQlZTeFJRVUZSTEZWQlFWVTdRVUZET1VNc1YwRkJUeXhMUVVGTExFOUJRVThzWVVGQllTeFRRVUZWTEU5QlFVODdRVUZETjBNc1ZVRkJTU3hOUVVGTExFMUJRVTBzVDBGQlR5eFRRVUZUTEU5QlFVOHNTVUZCUnl4TlFVRk5MRlZCUVZVc1NVRkJSenRCUVVNMVJDeFZRVUZKTEZkQlFWYzdRVUZEV0N4alFVRk5MRWxCUVVrc1YwRkJWeXhuUWtGQlowSTdRVUZEZWtNc1ZVRkJTU3hUUVVGUkxFMUJRVXNzVjBGQlZ5eFJRVUZSTzBGQlEyaERMR05CUVUwc1NVRkJTU3hYUVVGWExHZENRVUZuUWp0QlFVTjZReXhWUVVGSkxHRkJRV0VzVVVGQlVUdEJRVU42UWl4VlFVRkpMR1ZCUVdVc1YwRkJWeXhQUVVNeFFpeFJRVUZSTEVsQlFVa3NPRUpCUVRoQ0xGbEJRekZETzBGQlEwb3NZVUZCVHl4TlFVRk5MRXRCUVVzc1QwRkJUeXhEUVVGRkxFOUJRV01zVFVGQlRTeFBRVUZQTEUxQlFVMHNUMEZCVFN4UlFVRlJMR05CUVdNc1kwRkRia1lzUzBGQlN5eFRRVUZWTEV0QlFVazdRVUZEY0VJc1dVRkJTU3hqUVVGakxFbEJRVWNzWVVGQllTeFZRVUZWTEVsQlFVY3NVMEZCVXl4aFFVRmhMRWxCUVVjc1dVRkJXU3hYUVVGWExFbEJRVWM3UVVGRGJFY3NXVUZCU1N4VFFVRlRMR05CUVdNc1ZVRkJWVHRCUVVOeVF5eFpRVUZKTEdkQ1FVRm5RanRCUVVOb1FpeHBRa0ZCVHp0QlFVTllMR05CUVUwc1NVRkJTU3hWUVVGVkxFMUJRVTBzVDBGQlR5eHBRa0ZCYVVJc1kwRkJZeXhUUVVGVExHRkJRV0VzYzBKQlFYTkNPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWGhJTEZOQlFVMHNWVUZCVlN4VlFVRlZMRk5CUVZVc1UwRkJVeXhsUVVGbExGTkJRVk03UVVGRGFrVXNVVUZCU1N4UlFVRlJPMEZCUTFvc1VVRkJTU3hSUVVGUExFMUJRVTBzVVVGQlVTeHBRa0ZCYVVJc1owSkJRV2RDTzBGQlF6RkVMR05CUVZVc1YwRkJXU3hUUVVGUExGTkJRVms3UVVGRGVrTXNVVUZCU1N4alFVRmpMRlZCUVZVc1VVRkJVU3hWUVVGVk8wRkJRemxETEZkQlFVOHNTMEZCU3l4UFFVRlBMR0ZCUVdFc1UwRkJWU3hQUVVGUE8wRkJRemRETEZWQlFVa3NUVUZCU3l4TlFVRk5MRTlCUVU4c1UwRkJVeXhQUVVGUExFbEJRVWNzVFVGQlRTeFZRVUZWTEVsQlFVYzdRVUZETlVRc1ZVRkJTU3hYUVVGWE8wRkJRMWdzWTBGQlRTeEpRVUZKTEZkQlFWY3NaMEpCUVdkQ08wRkJRM3BETEZWQlFVa3NVMEZCVVN4TlFVRkxMRmRCUVZjc1VVRkJVVHRCUVVOb1F5eGpRVUZOTEVsQlFVa3NWMEZCVnl4blFrRkJaMEk3UVVGRGVrTXNWVUZCU1N4aFFVRmhMRkZCUVZFN1FVRkRla0lzVlVGQlNTeGxRVUZsTEZkQlFWY3NUMEZETVVJc1VVRkJVU3hKUVVGSkxEaENRVUU0UWl4WlFVTXhRenRCUVVOS0xHRkJRVThzVFVGQlRTeExRVUZMTEU5QlFVOHNRMEZCUlN4UFFVRmpMRTFCUVUwc1QwRkJUeXhOUVVGTkxFOUJRVTBzVVVGQlVTeGpRVUZqTEdOQlEyNUdMRXRCUVVzc1UwRkJWU3hMUVVGSk8wRkJRM0JDTEZsQlFVa3NZMEZCWXl4SlFVRkhMR0ZCUVdFc1ZVRkJWU3hKUVVGSExGTkJRVk1zWVVGQllTeEpRVUZITEZsQlFWa3NWMEZCVnl4SlFVRkhPMEZCUTJ4SExGbEJRVWtzVTBGQlV5eGpRVUZqTEZWQlFWVTdRVUZEY2tNc1dVRkJTU3huUWtGQlowSTdRVUZEYUVJc2FVSkJRVTg3UVVGRFdDeGpRVUZOTEVsQlFVa3NWVUZCVlN4TlFVRk5MRTlCUVU4c2FVSkJRV2xDTEdOQlFXTXNVMEZCVXl4aFFVRmhMSE5DUVVGelFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVbDRTQ3hUUVVGTkxGVkJRVlVzWVVGQllTeFRRVUZWTEU5QlFVMDdRVUZEZWtNc1VVRkJTU3hSUVVGUk8wRkJRMW9zVVVGQlNTeFZRVUZWTEUxQlFVczdRVUZEYmtJc1YwRkJUeXhMUVVGTExFOUJRVThzWVVGQllTeFRRVUZWTEU5QlFVODdRVUZETjBNc1lVRkJUeXhOUVVGTkxFdEJRVXNzVDBGQlR5eERRVUZGTEU5QlFXTXNUVUZCVFN4VlFVRlZMRTFCUVUwN1FVRkJRU3hQUVVOb1JTeExRVUZMTEZOQlFWVXNTMEZCU1R0QlFVTnNRaXhWUVVGSkxHTkJRV01zU1VGQlJ5eGhRVUZoTEdGQlFXRXNTVUZCUnl4WlFVRlpMRmRCUVZjc1NVRkJSenRCUVVNMVJTeFZRVUZKTEdkQ1FVRm5RanRCUVVOb1FpeGxRVUZQTzBGQlExZ3NXVUZCVFN4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExHOUNRVUZ2UWl4alFVRmpMRk5CUVZNc1ZVRkJWU3h6UWtGQmMwSTdRVUZCUVR0QlFVRkJPMEZCUjNCSUxGTkJRVTg3UVVGQlFUdEJRVWRZTEdkQ1FVRm5RaXhMUVVGTE8wRkJRMnBDTEUxQlFVa3NUVUZCVFR0QlFVTldMRTFCUVVrc1MwRkJTeXhUUVVGVkxGZEJRVmNzV1VGQldUdEJRVU4wUXl4UlFVRkpMRmxCUVZrN1FVRkRXaXhWUVVGSkxFdEJRVWtzVlVGQlZTeFJRVUZSTEU5QlFVOHNTVUZCU1N4TlFVRk5MRXRCUVVrN1FVRkRMME1zWVVGQlR5eEZRVUZGTzBGQlEwd3NZVUZCU3l4TFFVRkpMRXRCUVVzc1ZVRkJWVHRCUVVNMVFpeFZRVUZKTEZkQlFWY3NWVUZCVlN4TlFVRk5MRTFCUVUwN1FVRkRja01zWVVGQlR6dEJRVUZCTEdWQlJVWXNUMEZCVVN4alFVRmxMRlZCUVZVN1FVRkRkRU1zWVVGQlR5eEpRVUZKTzBGQlFVRTdRVUZCUVR0QlFVZHVRaXhMUVVGSExHVkJRV1U3UVVGRGJFSXNWMEZCVXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hWUVVGVkxGRkJRVkVzU1VGQlNTeEhRVUZITEVWQlFVVXNSMEZCUnp0QlFVTTVReXhSUVVGSkxGVkJRVlU3UVVGQlFUdEJRVVZzUWl4VFFVRlBPMEZCUTFBc1pVRkJZU3hYUVVGWExHVkJRV1VzYVVKQlFXbENPMEZCUTNCRUxGRkJRVWtzVDBGQlR5eGpRVUZqTzBGQlEzSkNMR0ZCUVU4c2IwSkJRVzlDTzBGQlF5OUNMRkZCUVVrc1EwRkJRenRCUVVORUxITkNRVUZuUWp0QlFVTndRaXhSUVVGSkxFTkJRVU03UVVGRFJDeDNRa0ZCYTBJN1FVRkRkRUlzVVVGQlNTeFZRVUZWTzBGQlFVRXNUVUZEVml4aFFVRmhPMEZCUVVFc1RVRkRZaXhOUVVGTk8wRkJRVUVzVFVGRFRpeFhRVUZYTEZOQlFWVXNTVUZCU1R0QlFVTnlRaXhaUVVGSkxGRkJRVkVzV1VGQldTeFJRVUZSTEZGQlFWRXNTVUZCU1R0QlFVTjRReXhyUWtGQlVTeFpRVUZaTEV0QlFVczdRVUZEZWtJc2EwSkJRVkVzVDBGQlR5eGpRVUZqTEZGQlFWRXNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkJRU3hOUVVkdVJDeGhRVUZoTEZOQlFWVXNTVUZCU1R0QlFVTjJRaXhuUWtGQlVTeGpRVUZqTEZGQlFWRXNXVUZCV1N4UFFVRlBMRk5CUVZVc1NVRkJTVHRCUVVGRkxHbENRVUZQTEU5QlFVODdRVUZCUVR0QlFVTXZSU3huUWtGQlVTeFBRVUZQTEZGQlFWRXNXVUZCV1N4UFFVRlBMR1ZCUVdVN1FVRkJRVHRCUVVGQk8wRkJSMnBGTEZGQlFVa3NZVUZCWVN4SFFVRkhMR0ZCUVdFN1FVRkRha01zVjBGQlR6dEJRVUZCTzBGQlJWZ3NLMEpCUVRaQ0xFdEJRVXM3UVVGRE9VSXNVMEZCU3l4TFFVRkxMRkZCUVZFc1UwRkJWU3hYUVVGWE8wRkJRMjVETEZWQlFVa3NUMEZCVHl4SlFVRkpPMEZCUTJZc1ZVRkJTU3hSUVVGUkxFOUJRVTg3UVVGRFppeFpRVUZKTEZkQlFWY3NTVUZCU1N4WFFVRlhMRWxCUVVrc1NVRkJTU3hYUVVGWE8wRkJRVUVzYVVKQlJUVkRMRk5CUVZNc1VVRkJVVHRCUVVOMFFpeFpRVUZKTEZWQlFWVXNTVUZCU1N4WFFVRlhMRkZCUVZFc1owSkJRV2RDTzBGQlEycEVMR05CUVVrc1MwRkJTU3hWUVVGVkxGRkJRVkVzVVVGQlR5eEpRVUZKTEUxQlFVMDdRVUZETTBNc2FVSkJRVTg3UVVGRFNDeHJRa0ZCU3l4TlFVRkxMRlZCUVZVN1FVRkRlRUlzYTBKQlFWRXNXVUZCV1N4UlFVRlJMRk5CUVZVc1NVRkJTVHRCUVVOMFF5eHRRa0ZCVHl4eFFrRkJjVUk3UVVGRGVFSXNhVUpCUVVjc1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZOTTBJc1kwRkJUU3hKUVVGSkxGZEJRVmNzWjBKQlFXZENPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTM0pFTERoQ1FVRTRRaXhYUVVGWExHRkJRV0U3UVVGRGJFUXNVMEZCVHl4aFFVRmhMRXRCUVVzc1EwRkJSVHRCUVVNelFpeFRRVUZQTzBGQlFVRTdRVUZIV0N4blEwRkJaME1zU1VGQlNUdEJRVU5vUXl4VFFVRlBMSEZDUVVGeFFpeE5RVUZOTEZkQlFWY3NaMEpCUVdVc1RVRkJUU3hoUVVGaExFOUJRVTg3UVVGRGJFWXNVMEZCU3l4TFFVRkxPMEZCUTFZc1UwRkJTeXhOUVVGTk8wRkJRMWdzVTBGQlN5eFBRVUZQTzBGQlExb3NVMEZCU3l4VFFVRlRPMEZCUTJRc1UwRkJTeXhQUVVGUExFZEJRVWNzVjBGQlZ5eFJRVUZSTEVkQlFVY3NWMEZCVnl4TlFVRk5MRTlCUVU4c1QwRkJUeXhOUVVGTk8wRkJRVUVzVFVGRGRFVXNWVUZCV1N4RFFVRkRMRzFDUVVGdFFqdEJRVUZCTEUxQlEyaERMRk5CUVZjc1EwRkJReXh0UWtGQmJVSTdRVUZCUVN4TlFVTXZRaXhWUVVGWkxFTkJRVU1zYlVKQlFXMUNPMEZCUVVFc1RVRkRhRU1zVlVGQldTeERRVUZETEcxQ1FVRnRRanRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXMxUXl4NVFrRkJlVUlzUzBGQlN5eHRRa0ZCYlVJN1FVRkROME1zVTBGQlR5eERRVUZGTEV0QlFVa3NWVUZCVlN4SlFVRkpMR0ZCUVdFc1NVRkJTU3hQUVVOMlF5eHhRa0ZCYjBJc1NVRkJTU3haUVVGWkxFTkJRVU1zU1VGQlNUdEJRVUZCTzBGQlJXeEVMRzFDUVVGdFFpeExRVUZMTEVsQlFVazdRVUZEZUVJc1RVRkJTU3hUUVVGVExGRkJRVkVzU1VGQlNTeFJRVUZSTzBGQlFVRTdRVUZGY2tNc2VVSkJRWGxDTEV0QlFVc3NVMEZCVXl4bFFVRmxPMEZCUTJ4RUxFMUJRVWtzVDBGQlR5eEpRVUZKTzBGQlEyWXNUVUZCU1N4bFFVRmxMRTlCUVU4c1YwRkJXVHRCUVVGRkxGZEJRVThzVVVGQlVTeFJRVUZSTzBGQlFVRXNUVUZCWjBJN1FVRkRMMFVzVFVGQlNTeFpRVUZaTEdsQ1FVRnBRaXhEUVVGRE8wRkJRVUU3UVVGRmRFTXNkMEpCUVhkQ0xFdEJRVXNzU1VGQlNUdEJRVU0zUWl4TlFVRkpMRlZCUVZVc1VVRkJVU3hKUVVGSkxGTkJRVk03UVVGQlFUdEJRVVYyUXl4NVFrRkJlVUlzUzBGQlN5eFpRVUZaTzBGQlEzUkRMRTFCUVVrc1NVRkJTVHRCUVVOS0xGZEJRVThzVjBGQlZ6dEJRVU4wUWl4TlFVRkpMRkZCUVZFc1YwRkJWeXhyUWtGQmEwSXNTVUZCU1R0QlFVTTNReXhOUVVGSkxFTkJRVU03UVVGRFJDeFZRVUZOTEVsQlFVa3NWMEZCVnl4UFFVRlBMR0ZCUVdFc1NVRkJTU3hSUVVGUkxITkNRVUZ6UWl4WFFVRlhMRTlCUVU4N1FVRkRha2NzVTBGQlR6dEJRVUZCTzBGQlJWZ3NiMEpCUVc5Q0xFdEJRVXNzVjBGQlZ5eFBRVUZQTzBGQlEzWkRMRTFCUVVrc1VVRkJVU3huUWtGQlowSXNTMEZCU3l4VlFVRlZPMEZCUXpORExGTkJRVThzVlVGQlZTeFhRVUZYTzBGQlFVRXNTVUZEZUVJN1FVRkJRU3hKUVVOQkxGRkJRVkVzUTBGQlF5eEpRVUZKTzBGQlFVRXNTVUZEWWl4VFFVRlRMRWxCUVVrc1VVRkJVVHRCUVVGQkxFbEJRM0pDTEZGQlFWRXNRMEZCUXl4RFFVRkRMRWxCUVVrN1FVRkJRU3hKUVVOa0xFOUJRVTg3UVVGQlFTeE5RVU5JTzBGQlFVRXNUVUZEUVN4UFFVRlBMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSmRrSXNZMEZCWXl4TFFVRkxMRWxCUVVrc1YwRkJWeXhYUVVGWE8wRkJRM3BETEUxQlFVa3NVMEZCVXl4SlFVRkpMR1ZCUVdVc1VVRkJVU3hKUVVGSkxGRkJRVkVzU1VGQlNTeHJRa0ZCYTBJc1NVRkJTVHRCUVVNNVJTeE5RVUZKTEVOQlFVTXNTVUZCU1N4SlFVRkpPMEZCUTFRc1YwRkJUeXhSUVVGUkxGZEJRVmNzUzBGQlN5eFhRVUZYTEZsQlFWa3NVVUZCVVN4SlFVRkpMRmRCUVZjc1UwRkJVeXhKUVVGSkxFTkJRVU1zU1VGQlNTeFpRVUZaTEVsQlFVazdRVUZCUVN4VFFVVTVSenRCUVVORUxGRkJRVWtzVVVGQlVUdEJRVU5hTEZGQlFVa3NVVUZCVVN4VFFVRlZMRTFCUVUwc1VVRkJVU3hUUVVGVE8wRkJRM3BETEZWQlFVa3NRMEZCUXl4VlFVRlZMRTlCUVU4c1VVRkJVU3hUUVVGVExGTkJRVlVzVVVGQlVUdEJRVUZGTEdWQlFVOHNUMEZCVHl4TFFVRkxPMEZCUVVFc1UwRkJXU3hUUVVGVkxFdEJRVXM3UVVGQlJTeGxRVUZQTEU5QlFVOHNTMEZCU3p0QlFVRkJMRlZCUVZVN1FVRkRjRWtzV1VGQlNTeGhRVUZoTEU5QlFVODdRVUZEZUVJc1dVRkJTU3hOUVVGTkxFdEJRVXM3UVVGRFppeFpRVUZKTEZGQlFWRTdRVUZEVWl4blFrRkJUU3hMUVVGTExFbEJRVWtzVjBGQlZ6dEJRVU01UWl4WlFVRkpMRU5CUVVNc1QwRkJUeXhQUVVGUExFMUJRVTA3UVVGRGNrSXNaMEpCUVUwc1QwRkJUenRCUVVOaUxHRkJRVWNzVFVGQlRTeFJRVUZSTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1RkQ0xGZEJRVThzVVVGQlVTeEpRVUZKTzBGQlFVRXNUVUZEWml4SlFVRkpMRWRCUVVjc1UwRkJVeXhQUVVGUE8wRkJRVUVzVFVGRGRrSXNVVUZCVVN4WFFVRlhMRXRCUVVzc1YwRkJWeXhaUVVGWkxFbEJRVWtzVjBGQlZ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4WlFVRlpMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSmRFY3NhVUpCUVdsQ0xHVkJRV1VzVVVGQlVTeEpRVUZKTEdGQlFXRTdRVUZEY2tRc1RVRkJTU3hYUVVGWExHTkJRV01zVTBGQlZTeEhRVUZITEVkQlFVY3NSMEZCUnp0QlFVRkZMRmRCUVU4c1IwRkJSeXhaUVVGWkxFbEJRVWtzUjBGQlJ6dEJRVUZCTEUxQlFWRTdRVUZEZGtZc1RVRkJTU3haUVVGWkxFdEJRVXM3UVVGRGNrSXNVMEZCVHl4alFVRmpMRXRCUVVzc1UwRkJWU3hSUVVGUk8wRkJRM2hETEZGQlFVa3NVVUZCVVR0QlFVTlNMR0ZCUVU4c1QwRkJUeXhOUVVGTkxGZEJRVms3UVVGRE5VSXNXVUZCU1N4SlFVRkpMRmRCUVZrN1FVRkJSU3hwUWtGQlR5eFBRVUZQTzBGQlFVRTdRVUZEY0VNc1dVRkJTU3hEUVVGRExGVkJRVlVzVDBGQlR5eFJRVUZSTEZOQlFWVXNWVUZCVlR0QlFVRkZMR2xDUVVGUExFbEJRVWs3UVVGQlFTeFhRVUZoTEZOQlFWVXNTMEZCU3p0QlFVRkZMR2xDUVVGUExFdEJRVXM3UVVGQlRTeGpRVUZKTzBGQlFVRXNWMEZCVVN4VFFVRlZMRWRCUVVjN1FVRkJSU3hwUWtGQlR5eExRVUZMTzBGQlFVa3NZMEZCU1R0QlFVRkJPMEZCUXpGS0xHOUNRVUZWTEU5QlFVOHNUMEZCVHl4UlFVRlJMRk5CUVZVc1ZVRkJWVHRCUVVGRkxHMUNRVUZQTEVsQlFVazdRVUZCUVR0QlFVTnlSVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlRXaENMRWxCUVVrc1lVRkJaU3hYUVVGWk8wRkJRek5DTEhsQ1FVRnpRanRCUVVGQk8wRkJSWFJDTEdOQlFWY3NWVUZCVlN4UlFVRlJMRk5CUVZVc1NVRkJTU3hKUVVGSk8wRkJRek5ETEZGQlFVa3NUVUZCVFN4TFFVRkxPMEZCUTJZc1YwRkJUeXhKUVVGSkxGRkJRMUFzU1VGQlNTeE5RVUZOTEU5QlFVOHNUVUZCVFN4VlFVRlZMRXRCUVVzc1RVRkJUU3hKUVVGSkxGVkJRMmhFTEVsQlFVa3NUVUZCVFN4UFFVRlBMRmxCUVZrc1NVRkJTU3hMUVVGTE8wRkJRVUU3UVVGRk9VTXNZMEZCVnl4VlFVRlZMRk5CUVZNc1UwRkJWU3hKUVVGSk8wRkJRM2hETEZGQlFVa3NUVUZCVFN4TFFVRkxPMEZCUTJZc1YwRkJUeXhKUVVGSkxGRkJRMUFzU1VGQlNTeE5RVUZOTEU5QlFVOHNUVUZCVFN4VlFVRlZMRXRCUVVzc1RVRkJUU3hKUVVGSkxGVkJRMmhFTEVsQlFVa3NUVUZCVFN4UFFVRlBMR0ZCUVdFc1NVRkJTVHRCUVVGQk8wRkJSVEZETEdOQlFWY3NWVUZCVlN4blFrRkJaMElzVTBGQlZTeEpRVUZKTzBGQlF5OURMRkZCUVVrc1RVRkJUU3hMUVVGTE8wRkJRMllzVVVGQlNTeFpRVUZaTEZGQlFWRXNTVUZCU1N4WFFVRlhPMEZCUVVFN1FVRkZNME1zWTBGQlZ5eFZRVUZWTEZkQlFWY3NVMEZCVlN4SlFVRkpMRmRCUVZjN1FVRkRja1FzVjBGQlR5eExRVUZMTEV0QlFVc3NUVUZCVFN4SlFVRkpMRmRCUVZjc1MwRkJTeXhMUVVGTExFMUJRVTA3UVVGQlFUdEJRVVV4UkN4alFVRlhMRlZCUVZVc1VVRkJVU3hUUVVGVkxGRkJRVTg3UVVGRE1VTXNVVUZCU1N4TFFVRkxMRTlCUVU4c1QwRkJUeXhMUVVGTExGbEJRVmtzV1VGQldTeE5RVUZOTEU5QlFVOHNUMEZCVHl4TFFVRkxPMEZCUXpkRkxGRkJRVWs3UVVGRFFTeGhRVUZQTEV0QlFVczdRVUZEYUVJc1QwRkJSeXhQUVVGUE8wRkJRMVlzVjBGQlR6dEJRVUZCTzBGQlJWZ3NZMEZCVnl4VlFVRlZMRTFCUVUwc1YwRkJXVHRCUVVOdVF5eFRRVUZMTEV0QlFVc3NZMEZCWXp0QlFVTjRRaXhYUVVGUE8wRkJRVUU3UVVGRldDeGpRVUZYTEZWQlFWVXNUMEZCVHl4VFFVRlZMRWxCUVVrN1FVRkRkRU1zVVVGQlNTeE5RVUZOTEV0QlFVczdRVUZEWml4WFFVRlBMRXRCUVVzc1RVRkJUU3hUUVVGVkxFOUJRVTg3UVVGQlJTeGhRVUZQTEV0QlFVc3NTMEZCU3l4SlFVRkpMRTlCUVU4c1NVRkJTU3hOUVVGTk8wRkJRVUU3UVVGQlFUdEJRVVV2UlN4alFVRlhMRlZCUVZVc1VVRkJVU3hUUVVGVkxFbEJRVWs3UVVGRGRrTXNVVUZCU1N4UlFVRlJPMEZCUTFvc1YwRkJUeXhMUVVGTExFMUJRVTBzVTBGQlZTeFBRVUZQTzBGQlF5OUNMRlZCUVVrc1RVRkJUU3hOUVVGTk8wRkJRMmhDTEZWQlFVa3NXVUZCV1N4SlFVRkpMRTFCUVUwN1FVRkRNVUlzVlVGQlNTeG5Ra0ZCWjBJc1MwRkJTeXhQUVVGUE8wRkJRelZDTEdWQlFVOHNWVUZCVlN4TlFVRk5PMEZCUVVFc1ZVRkRia0k3UVVGQlFTeFZRVU5CTEU5QlFVODdRVUZCUVN4WlFVTklMRTlCUVU4c1owSkJRV2RDTEV0QlFVc3NWVUZCVlR0QlFVRkJMRmxCUTNSRExFOUJRVThzU1VGQlNUdEJRVUZCTzBGQlFVRXNWMEZGYUVJc1MwRkJTeXhUUVVGVkxGRkJRVTg3UVVGQlJTeHBRa0ZCVHl4TFFVRkxMRWxCUVVrc1VVRkJUeXhKUVVGSk8wRkJRVUU3UVVGQlFTeGhRVVZ5UkR0QlFVTkVMRmxCUVVrc1VVRkJVVHRCUVVOYUxHVkJRVThzUzBGQlN5eExRVUZMTEZkQlFWazdRVUZCUlN4WlFVRkZPMEZCUVU4c2FVSkJRVTg3UVVGQlFTeFhRVUZWTEU5QlFVOHNWMEZETTBRc1MwRkJTeXhYUVVGWk8wRkJRVVVzYVVKQlFVODdRVUZCUVR0QlFVRkJPMEZCUVVFc1QwRkZjRU1zUzBGQlN6dEJRVUZCTzBGQlJWb3NZMEZCVnl4VlFVRlZMRk5CUVZNc1UwRkJWU3hUUVVGVExFbEJRVWs3UVVGRGFrUXNVVUZCU1N4UlFVRlJMRkZCUVZFc1RVRkJUU3hMUVVGTExGZEJRVmNzVjBGQlZ5eE5RVUZOTEVsQlFVa3NXVUZCV1N4TlFVRk5MRk5CUVZNN1FVRkRNVVlzYjBKQlFXZENMRXRCUVVzc1IwRkJSenRCUVVOd1FpeFZRVUZKTzBGQlEwRXNaVUZCVHl4UFFVRlBMRWxCUVVrc1RVRkJUU3hMUVVGTExFbEJRVWs3UVVGRGNrTXNZVUZCVHl4SlFVRkpPMEZCUVVFN1FVRkZaaXhSUVVGSkxGRkJRVkVzUzBGQlN5eExRVUZMTEZGQlFWRXNVMEZCVXl4SlFVRkpPMEZCUXpORExHOUNRVUZuUWl4SFFVRkhMRWRCUVVjN1FVRkRiRUlzVlVGQlNTeFBRVUZQTEU5QlFVOHNSMEZCUnl4WlFVRlpMRTlCUVU4c1QwRkJUeXhIUVVGSE8wRkJRMnhFTEdGQlFVOHNUMEZCVHl4UFFVRlBMRU5CUVVNc1VVRkJVU3hQUVVGUExFOUJRVThzVVVGQlVUdEJRVUZCTzBGQlJYaEVMRmRCUVU4c1MwRkJTeXhSUVVGUkxGTkJRVlVzUjBGQlJ6dEJRVU0zUWl4aFFVRlBMRVZCUVVVc1MwRkJTenRCUVVGQkxFOUJRMllzUzBGQlN6dEJRVUZCTzBGQlJWb3NZMEZCVnl4VlFVRlZMRlZCUVZVc1UwRkJWU3hKUVVGSk8wRkJRM3BETEZGQlFVa3NVVUZCVVR0QlFVTmFMRmRCUVU4c1MwRkJTeXhOUVVGTkxGTkJRVlVzVDBGQlR6dEJRVU12UWl4VlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVOb1FpeFZRVUZKTEVsQlFVa3NVVUZCVVN4VlFVRlZMR2RDUVVGblFpeExRVUZMTEZOQlFWTXNTVUZCU1N4UlFVRlJMRWRCUVVjN1FVRkRia1VzV1VGQlNTeG5Ra0ZCWjBJc1NVRkJTVHRCUVVONFFpeFpRVUZKTEZGQlFWRXNaMEpCUVdkQ0xFdEJRVXNzU1VGQlNTeE5RVUZOTEV0QlFVczdRVUZEYUVRc1pVRkJUeXhKUVVGSkxFMUJRVTBzUzBGQlN5eE5RVUZOTzBGQlFVRXNWVUZEZUVJN1FVRkJRU3hWUVVOQkxFOUJRVThzU1VGQlNUdEJRVUZCTEZWQlExZ3NVVUZCVVR0QlFVRkJMRlZCUTFJc1QwRkJUenRCUVVGQkxGbEJRMGc3UVVGQlFTeFpRVU5CTEU5QlFVOHNTVUZCU1R0QlFVRkJPMEZCUVVFc1YwRkZhRUlzUzBGQlN5eFRRVUZWTEV0QlFVazdRVUZEYkVJc1kwRkJTU3hUUVVGVExFbEJRVWM3UVVGRGFFSXNhVUpCUVU4c1owSkJRV2RDTEU5QlFVOHNTVUZCU1N4cFFrRkJhVUk3UVVGQlFUdEJRVUZCTEdGQlIzUkVPMEZCUTBRc1dVRkJTU3hOUVVGTk8wRkJRMVlzWlVGQlR5eExRVUZMTEV0QlFVc3NVMEZCVlN4TlFVRk5PMEZCUVVVc2FVSkJRVThzU1VGQlNTeExRVUZMTzBGQlFVRXNWMEZCVlN4UFFVRlBMRWxCUVVrc1RVRkJUU3hOUVVGTkxFdEJRVXNzVjBGQldUdEJRVUZGTEdsQ1FVRlBPMEZCUVVFN1FVRkJRVHRCUVVGQkxFOUJSVzVJTzBGQlFVRTdRVUZGVUN4alFVRlhMRlZCUVZVc1UwRkJVeXhUUVVGVkxGRkJRVkU3UVVGRE5VTXNVVUZCU1N4TlFVRk5MRXRCUVVzN1FVRkRaaXhSUVVGSkxGVkJRVlU3UVVGRFZpeGhRVUZQTzBGQlExZ3NVVUZCU1N4VlFVRlZPMEZCUTJRc1VVRkJTU3huUWtGQlowSXNUVUZCVFR0QlFVTjBRaXh6UWtGQlowSXNTMEZCU3l4WFFVRlpPMEZCUXpkQ0xGbEJRVWtzWVVGQllUdEJRVU5xUWl4bFFVRlBMRk5CUVZVc1VVRkJVU3hUUVVGVE8wRkJRemxDTEdOQlFVa3NaVUZCWlR0QlFVTm1MRzFDUVVGUE8wRkJRMWdzWTBGQlNTeGxRVUZsTEVkQlFVYzdRVUZEYkVJc1kwRkJSVHRCUVVOR0xHMUNRVUZQTzBGQlFVRTdRVUZGV0N4clFrRkJVU3hYUVVGWk8wRkJRMmhDTEcxQ1FVRlBMRkZCUVZFN1FVRkRaaXg1UWtGQllUdEJRVUZCTzBGQlJXcENMR2xDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTEZkQlNXUTdRVUZEUkN4elFrRkJaMElzUzBGQlN5eFhRVUZaTzBGQlF6ZENMRmxCUVVrc1lVRkJZVHRCUVVOcVFpeGxRVUZQTEZkQlFWazdRVUZCUlN4cFFrRkJVU3hGUVVGRkxHRkJRV0U3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZIY0VRc1YwRkJUenRCUVVGQk8wRkJSVmdzWTBGQlZ5eFZRVUZWTEZGQlFWRXNVMEZCVlN4VFFVRlRPMEZCUXpWRExGTkJRVXNzUzBGQlN5eFJRVUZSTEV0QlFVc3NTVUZCU1N4TFFVRkxMRXRCUVVzc1QwRkJUenRCUVVNMVF5eHZRa0ZCWjBJc1MwRkJTeXhOUVVGTkxGZEJRVms3UVVGRGJrTXNWVUZCU1N4WFFVRlhPMEZCUTJZc1lVRkJUeXhUUVVGVkxGRkJRVkVzVTBGQlV5eFRRVUZUTzBGQlEzWkRMRmxCUVVrc1JVRkJSU3haUVVGWk8wRkJRMlFzYTBKQlFWRTdRVUZEV2l4bFFVRlBMRmxCUVZrN1FVRkJRVHRCUVVGQkxFOUJSWGhDTzBGQlEwZ3NWMEZCVHp0QlFVRkJPMEZCUlZnc1kwRkJWeXhWUVVGVkxGRkJRVkVzVTBGQlZTeG5Ra0ZCWjBJc2JVSkJRVzFDTzBGQlEzUkZMR05CUVZVc1MwRkJTeXhOUVVGTkxGTkJRVlVzVVVGQlVTeFRRVUZUTEZOQlFWTTdRVUZEY2tRc1ZVRkJTU3hsUVVGbExFOUJRVThzVVVGQlVUdEJRVU01UWl4blFrRkJVVHRCUVVOU0xHVkJRVTg3UVVGQlFTeGhRVVZPTzBGQlEwUXNaVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhYUVVGUE8wRkJRVUU3UVVGRldDeGpRVUZYTEZWQlFWVXNVVUZCVVN4VFFVRlZMRWxCUVVrN1FVRkRka01zVjBGQlR5eExRVUZMTEUxQlFVMHNSMEZCUnl4UlFVRlJMRk5CUVZVc1IwRkJSenRCUVVGRkxHRkJRVThzUlVGQlJUdEJRVUZCTEU5QlFVOHNTMEZCU3p0QlFVRkJPMEZCUlhKRkxHTkJRVmNzVlVGQlZTeFBRVUZQTEZOQlFWVXNTVUZCU1R0QlFVTjBReXhYUVVGUExFdEJRVXNzVlVGQlZTeE5RVUZOTzBGQlFVRTdRVUZGYUVNc1kwRkJWeXhWUVVGVkxGTkJRVk1zVTBGQlZTeG5Ra0ZCWjBJN1FVRkRjRVFzWTBGQlZTeExRVUZMTEUxQlFVMHNVMEZCVlN4UlFVRlJPMEZCUTI1RExHRkJRVThzWlVGQlpTeFBRVUZQTzBGQlFVRTdRVUZGYWtNc2JVSkJRV1VzUzBGQlN5eE5RVUZOTzBGQlF6RkNMRmRCUVU4N1FVRkJRVHRCUVVWWUxHTkJRVmNzVlVGQlZTeE5RVUZOTEZOQlFWVXNVVUZCVVR0QlFVTjZReXhYUVVGUExFdEJRVXNzVDBGQlR6dEJRVUZCTzBGQlJYWkNMR05CUVZjc1ZVRkJWU3hMUVVGTExGTkJRVlVzVjBGQlZ6dEJRVU16UXl4WFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSExGbEJRVmtzUzBGQlN5eExRVUZMTEU5QlFVOHNWMEZCVnp0QlFVRkJPMEZCUlM5RUxHTkJRVmNzVlVGQlZTeFZRVUZWTEZkQlFWazdRVUZEZGtNc1UwRkJTeXhMUVVGTExFMUJRVThzUzBGQlN5eExRVUZMTEZGQlFWRXNVMEZCVXl4VFFVRlRPMEZCUTNKRUxGRkJRVWtzUzBGQlN6dEJRVU5NTEZkQlFVc3NiVUpCUVcxQ0xFdEJRVXNzUzBGQlN6dEJRVU4wUXl4WFFVRlBPMEZCUVVFN1FVRkZXQ3hqUVVGWExGVkJRVlVzVDBGQlR5eFhRVUZaTzBGQlEzQkRMRmRCUVU4c1MwRkJTenRCUVVGQk8wRkJSV2hDTEdOQlFWY3NWVUZCVlN4VlFVRlZMRk5CUVZVc1NVRkJTVHRCUVVONlF5eFJRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm1MRkZCUVVrc1YwRkJWeXhEUVVGRExFbEJRVWs3UVVGRGNFSXNWMEZCVHl4TFFVRkxMRXRCUVVzc1UwRkJWU3hMUVVGTExGRkJRVkU3UVVGQlJTeFRRVUZITEU5QlFVOHNTMEZCU3p0QlFVRkJPMEZCUVVFN1FVRkZOMFFzWTBGQlZ5eFZRVUZWTEdkQ1FVRm5RaXhUUVVGVkxFbEJRVWs3UVVGREwwTXNVMEZCU3l4TFFVRkxMRk5CUVZNN1FVRkRia0lzVjBGQlR5eExRVUZMTEZGQlFWRTdRVUZCUVR0QlFVVjRRaXhqUVVGWExGVkJRVlVzYVVKQlFXbENMRk5CUVZVc1NVRkJTVHRCUVVOb1JDeFJRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm1MRkZCUVVrc1YwRkJWeXhEUVVGRExFbEJRVWs3UVVGRGNFSXNWMEZCVHl4TFFVRkxMRXRCUVVzc1UwRkJWU3hMUVVGTExGRkJRVkU3UVVGQlJTeFRRVUZITEU5QlFVOHNXVUZCV1R0QlFVRkJPMEZCUVVFN1FVRkZjRVVzWTBGQlZ5eFZRVUZWTEU5QlFVOHNVMEZCVlN4SlFVRkpPMEZCUTNSRExGRkJRVWtzVFVGQlRTeExRVUZMTzBGQlEyWXNVVUZCU1N4WFFVRlhMRU5CUVVNc1NVRkJTVHRCUVVOd1FpeFJRVUZKTEVsQlFVazdRVUZEVWl4WFFVRlBMRXRCUVVzc1MwRkJTeXhUUVVGVkxFMUJRVTBzVVVGQlVUdEJRVU55UXl4UlFVRkZMRXRCUVVzc1QwRkJUenRCUVVGQkxFOUJRMllzUzBGQlN5eFhRVUZaTzBGQlEyaENMR0ZCUVU4N1FVRkJRU3hQUVVOU0xFdEJRVXM3UVVGQlFUdEJRVVZhTEdOQlFWY3NWVUZCVlN4alFVRmpMRk5CUVZVc1NVRkJTVHRCUVVNM1F5eFJRVUZKTEUxQlFVMHNTMEZCU3p0QlFVTm1MRkZCUVVrc1NVRkJTU3hSUVVGUkxGVkJRVlVzWjBKQlFXZENMRXRCUVVzc1UwRkJVeXhKUVVGSkxGRkJRVkVzUjBGQlJ6dEJRVU51UlN4aFFVRlBMRXRCUVVzc1RVRkJUU3hUUVVGVkxFOUJRVTg3UVVGREwwSXNXVUZCU1N4UlFVRlJMR2RDUVVGblFpeExRVUZMTEVsQlFVa3NUVUZCVFN4TFFVRkxPMEZCUTJoRUxHVkJRVThzU1VGQlNTeE5RVUZOTEV0QlFVc3NUVUZCVFR0QlFVRkJMRlZCUTNoQ08wRkJRVUVzVlVGRFFTeFJRVUZSTzBGQlFVRXNWVUZEVWl4UFFVRlBMRWxCUVVrN1FVRkJRU3hWUVVOWUxFOUJRVTg3UVVGQlFTeFpRVU5JTzBGQlFVRXNXVUZEUVN4UFFVRlBMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJRVUVzVTBGSGNFSXNTMEZCU3l4VFFVRlZMRXRCUVVrN1FVRkRiRUlzV1VGQlNTeFRRVUZUTEVsQlFVYzdRVUZEYUVJc1pVRkJUenRCUVVGQkxGTkJRMUlzUzBGQlN6dEJRVUZCTzBGQlJWb3NVVUZCU1N4WFFVRlhMRU5CUVVNc1NVRkJTVHRCUVVOd1FpeFJRVUZKTEVsQlFVazdRVUZEVWl4WFFVRlBMRXRCUVVzc1MwRkJTeXhUUVVGVkxFMUJRVTBzVVVGQlVUdEJRVU55UXl4UlFVRkZMRXRCUVVzc1QwRkJUenRCUVVGQkxFOUJRMllzUzBGQlN5eFhRVUZaTzBGQlEyaENMR0ZCUVU4N1FVRkJRU3hQUVVOU0xFdEJRVXM3UVVGQlFUdEJRVVZhTEdOQlFWY3NWVUZCVlN4aFFVRmhMRk5CUVZVc1NVRkJTVHRCUVVNMVF5eFRRVUZMTEV0QlFVc3NVMEZCVXp0QlFVTnVRaXhYUVVGUExFdEJRVXNzUzBGQlN6dEJRVUZCTzBGQlJYSkNMR05CUVZjc1ZVRkJWU3hYUVVGWExGTkJRVlVzU1VGQlNUdEJRVU14UXl4WFFVRlBMRXRCUVVzc1RVRkJUU3hIUVVGSExFdEJRVXNzVTBGQlZTeEhRVUZITzBGQlFVVXNZVUZCVHl4RlFVRkZPMEZCUVVFc1QwRkJUeXhMUVVGTE8wRkJRVUU3UVVGRmJFVXNZMEZCVnl4VlFVRlZMRlZCUVZVc1UwRkJWU3hKUVVGSk8wRkJRM3BETEZkQlFVOHNTMEZCU3l4VlFVRlZMRk5CUVZNN1FVRkJRVHRCUVVWdVF5eGpRVUZYTEZWQlFWVXNWMEZCVnl4WFFVRlpPMEZCUTNoRExGRkJRVWtzVFVGQlRTeExRVUZMTEUxQlFVMHNUVUZCVFN4SlFVRkpMRk5CUVZNc1NVRkJTU3hOUVVGTkxFOUJRVThzVlVGQlZTeEpRVUZKTzBGQlEzWkZMRkZCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNUdEJRVU5pTEdGQlFVODdRVUZEV0N4UlFVRkpMRTFCUVUwN1FVRkRWaXhqUVVGVkxFdEJRVXNzVFVGQlRTeFRRVUZWTEZGQlFWRTdRVUZEYmtNc1ZVRkJTU3hUUVVGVExFOUJRVThzVjBGQlZ6dEJRVU12UWl4VlFVRkpMRkZCUVZFc1QwRkJUeXhMUVVGTE8wRkJRM2hDTEZWQlFVa3NWVUZCVlR0QlFVTmtMR0ZCUVU4c1EwRkJRenRCUVVGQk8wRkJSVm9zVjBGQlR6dEJRVUZCTzBGQlJWZ3NZMEZCVnl4VlFVRlZMRk5CUVZNc1UwRkJWU3hUUVVGVE8wRkJRemRETEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc1RVRkJUU3hMUVVGTE8wRkJRMllzVjBGQlR5eExRVUZMTEU5QlFVOHNVMEZCVlN4UFFVRlBPMEZCUTJoRExGVkJRVWs3UVVGRFNpeFZRVUZKTEU5QlFVOHNXVUZCV1N4WlFVRlpPMEZCUXk5Q0xHMUNRVUZYTzBGQlFVRXNZVUZGVmp0QlFVTkVMRmxCUVVrc1YwRkJWeXhMUVVGTE8wRkJRM0JDTEZsQlFVa3NWVUZCVlN4VFFVRlRPMEZCUTNaQ0xHMUNRVUZYTEZOQlFWVXNUVUZCVFR0QlFVTjJRaXhqUVVGSkxHMUNRVUZ0UWp0QlFVTjJRaXh0UWtGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4VFFVRlRMRVZCUVVVc1IwRkJSenRCUVVNNVFpeG5Ra0ZCU1N4VlFVRlZMRk5CUVZNc1NVRkJTU3hOUVVGTkxGRkJRVkU3UVVGRGVrTXNaMEpCUVVrc1lVRkJZU3hOUVVGTkxHRkJRV0VzUzBGQlN6dEJRVU55UXl3eVFrRkJZU3hOUVVGTkxGTkJRVk03UVVGRE5VSXNhVU5CUVcxQ08wRkJRVUU3UVVGQlFUdEJRVWN6UWl4cFFrRkJUenRCUVVGQk8wRkJRVUU3UVVGSFppeFZRVUZKTEZsQlFWa3NTVUZCU1N4TlFVRk5PMEZCUXpGQ0xGVkJRVWtzVFVGQlN5eFZRVUZWTEU5QlFVOHNXVUZCV1N4WFFVRlhMRWxCUVVjc1ZVRkJWU3hoUVVGaExFbEJRVWM3UVVGRE9VVXNWVUZCU1N4UlFVRlJMRTFCUVUwc1IwRkJSeXhUUVVGVExHMUNRVUZ0UWp0QlFVTnFSQ3hWUVVGSkxFOUJRVTBzVFVGQlRTeEhRVUZITEV0QlFVczdRVUZEZUVJc1ZVRkJTU3huUWtGQlowSTdRVUZEY0VJc1ZVRkJTU3hsUVVGbE8wRkJRMjVDTEZWQlFVa3NZVUZCWVR0QlFVTnFRaXhWUVVGSkxHOUNRVUZ2UWl4VFFVRlZMR1ZCUVdVc1MwRkJTenRCUVVOc1JDeFpRVUZKTEZkQlFWY3NTVUZCU1N4VlFVRlZMR05CUVdNc1NVRkJTVHRCUVVNdlF5eDNRa0ZCWjBJc1owSkJRV2RDTzBGQlEyaERMR2xDUVVGVExFdEJRVXNzUjBGQlJ5eE5RVUZMTEV0QlFVc3NWMEZCVnl4TFFVRkxMRWxCUVVjc1VVRkJVU3hOUVVGTk8wRkJRM2hFTEdOQlFVa3NUVUZCVFN4SlFVRkhPMEZCUTJJc2QwSkJRV01zUzBGQlN5eFRRVUZUTzBGQlFVRTdRVUZCUVR0QlFVZHdReXhoUVVGUExFMUJRVTBzVVVGQlVTeGpRVUZqTEV0QlFVc3NVMEZCVlN4UFFVRk5PMEZCUTNCRUxGbEJRVWtzV1VGQldTeFRRVUZWTEZGQlFWRTdRVUZET1VJc1kwRkJTU3hSUVVGUkxFdEJRVXNzU1VGQlNTeFBRVUZQTEUxQlFVc3NVMEZCVXp0QlFVTXhReXhwUWtGQlR5eFZRVUZWTEZGQlFWRTdRVUZCUVN4WlFVTnlRanRCUVVGQkxGbEJRMEVzVFVGQlRTeE5RVUZMTEUxQlFVMHNVVUZCVVN4VFFVRlRPMEZCUVVFc1dVRkRiRU1zVDBGQlR6dEJRVUZCTEdGQlExSXNTMEZCU3l4VFFVRlZMRkZCUVZFN1FVRkRkRUlzWjBKQlFVa3NXVUZCV1R0QlFVTm9RaXhuUWtGQlNTeFpRVUZaTzBGQlEyaENMR2RDUVVGSkxGVkJRVlVzVjBGQlZ5eExRVUZMTzBGQlF6bENMR2RDUVVGSkxHRkJRV0U3UVVGRGFrSXNjVUpCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzVDBGQlR5eEZRVUZGTEVkQlFVYzdRVUZETlVJc2EwSkJRVWtzV1VGQldTeFBRVUZQTzBGQlEzWkNMR3RDUVVGSkxGRkJRVkU3UVVGQlFTeG5Ra0ZEVWl4UFFVRlBMRlZCUVZVN1FVRkJRU3huUWtGRGFrSXNVMEZCVXl4TlFVRkxMRk5CUVZNN1FVRkJRVHRCUVVVelFpeHJRa0ZCU1N4VFFVRlRMRXRCUVVzc1QwRkJUeXhOUVVGTkxFOUJRVThzVjBGQlZ5eFBRVUZQTzBGQlEzQkVMRzlDUVVGSkxFMUJRVTBzVTBGQlV5eE5RVUZOTzBGQlEzSkNMRFpDUVVGWExFdEJRVXNzVFVGQlN5eFRRVUZUTzBGQlFVRXNNa0pCUlhwQ0xFTkJRVU1zV1VGQldTeExRVUZKTEZkQlFWY3NXVUZCV1N4WFFVRlhMRTFCUVUwc1dVRkJXU3hIUVVGSE8wRkJRemRGTERaQ1FVRlhMRXRCUVVzc1RVRkJTeXhUUVVGVE8wRkJRemxDTERSQ1FVRlZMRXRCUVVzc1RVRkJUVHRCUVVGQkxIVkNRVVZ3UWp0QlFVTkVMRFJDUVVGVkxFdEJRVXNzVFVGQlRUdEJRVU55UWl4elFrRkJTVHRCUVVOQkxEUkNRVUZSTEV0QlFVc3NUVUZCU3l4VFFVRlRPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTVE5ETEcxQ1FVRlBMRkZCUVZFc1VVRkJVU3hWUVVGVkxGTkJRVk1zUzBGRGRFTXNWVUZCVlN4UFFVRlBMRU5CUVVVc1QwRkJZeXhOUVVGTkxFOUJRVThzVVVGQlVTeFpRVU5xUkN4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVOeVFpeDFRa0ZCVXl4UFFVRlBMRWxCUVVrc1ZVRkJWVHRCUVVNeFFpd3lRa0ZCVnl4UFFVRlBMRk5CUVZNc1RVRkJUVHRCUVVGQk8wRkJSWEpETEdkRFFVRnJRaXhWUVVGVkxGRkJRVkU3UVVGQlFTeG5Ra0ZEY0VNc1MwRkJTeXhYUVVGWk8wRkJRVVVzY1VKQlFVOHNWVUZCVlN4VFFVRlRMRXRCUTJwRUxGVkJRVlVzVDBGQlR5eERRVUZGTEU5QlFXTXNUVUZCVFN4UFFVRlBMRTFCUVUwc1UwRkJVeXhSUVVGUkxGbEJRMmhGTEV0QlFVc3NVMEZCVlN4TFFVRkxPMEZCUVVVc2RVSkJRVThzYTBKQlFXdENMRlZCUVZVc1VVRkJVVHRCUVVGQk8wRkJRVUVzWlVGQllTeExRVUZMTEZkQlFWazdRVUZCUlN4eFFrRkJUeXhYUVVGWExGTkJRVk1zUzBGRGFra3NWVUZCVlN4UFFVRlBMRU5CUVVVc1QwRkJZeXhOUVVGTkxGVkJRVlVzVFVGQlRTeGhRVU5zUkN4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVGRkxIVkNRVUZQTEd0Q1FVRnJRaXhYUVVGWExGRkJRVkU3UVVGQlFUdEJRVUZCTEdWQlFXRXNTMEZCU3l4WFFVRlpPMEZCUTNKSExIRkNRVUZQTEUxQlFVc3NVMEZCVXl4VFFVRlRMRk5CUVZNc1ZVRkJWU3hUUVVGVE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNYUkZMR1ZCUVU4c1ZVRkJWU3hIUVVGSExFdEJRVXNzVjBGQldUdEJRVU5xUXl4alFVRkpMR05CUVdNc1UwRkJVenRCUVVOMlFpeHJRa0ZCVFN4SlFVRkpMRmxCUVZrc2RVTkJRWFZETEdWQlFXVXNZMEZCWXp0QlFVTTVSaXhwUWtGQlR5eE5RVUZMTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxOVUlzWTBGQlZ5eFZRVUZWTEZOQlFWTXNWMEZCV1R0QlFVTjBReXhSUVVGSkxFMUJRVTBzUzBGQlN5eE5RVUZOTEZGQlFWRXNTVUZCU1R0QlFVTnFReXhSUVVGSkxHZENRVUZuUWl4UlFVTmtMRXRCUVVrc1lVRkJZU3hEUVVGRExEaENRVUVyUWl4TlFVRk5MRk5CUVZNc1NVRkRja1U3UVVGRFJ5eGhRVUZQTEV0QlFVc3NUMEZCVHl4VFFVRlZMRTlCUVU4N1FVRkRhRU1zV1VGQlNTeGhRVUZoTEVsQlFVa3NUVUZCVFN4TFFVRkxMRTlCUVU4N1FVRkRka01zV1VGQlNTeFpRVUZaTzBGQlEyaENMR1ZCUVU4c1NVRkJTU3hOUVVGTkxFdEJRVXNzVFVGQlRTeERRVUZGTEU5QlFXTXNUMEZCVHl4RFFVRkZMRTlCUVU4c1dVRkJXU3hQUVVGUExHRkJRV1VzUzBGQlN5eFRRVUZWTEU5QlFVODdRVUZEYUVnc2FVSkJRVThzU1VGQlNTeE5RVUZOTEV0QlFVc3NUMEZCVHl4RFFVRkZMRTlCUVdNc1RVRkJUU3hsUVVGbExFOUJRVThzV1VGRGNFVXNTMEZCU3l4VFFVRlZMRXRCUVVrN1FVRkRjRUlzWjBKQlFVa3NWMEZCVnl4SlFVRkhPMEZCUVZVc1owSkJRVWM3UVVGQldTeG5Ra0ZCUnp0QlFVRlRMR2RDUVVGSkxHTkJRV01zU1VGQlJ6dEJRVU0xUlN4blFrRkJTVHRCUVVOQkxHOUNRVUZOTEVsQlFVa3NXVUZCV1N4blEwRkJaME1zVDBGQlR5eExRVUZMTEZWQlFWVXNTVUZCU1N4VFFVRlZMRXRCUVVzN1FVRkJSU3gxUWtGQlR5eFRRVUZUTzBGQlFVRXNhMEpCUVZVc1VVRkJVVHRCUVVOMlNTeHRRa0ZCVHl4UlFVRlJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTEwwSXNWMEZCVHl4TFFVRkxMRTlCUVU4c1UwRkJWU3hQUVVGUExFMUJRVXM3UVVGQlJTeGhRVUZQTEV0QlFVa3NVVUZCVVR0QlFVRkJPMEZCUVVFN1FVRkZiRVVzVTBGQlR6dEJRVUZCTzBGQlIxZ3NjVU5CUVhGRExFbEJRVWs3UVVGRGNrTXNVMEZCVHl4eFFrRkJjVUlzVjBGQlZ5eFhRVUZYTEhGQ1FVRnZRaXhoUVVGaExHMUNRVUZ0UWp0QlFVTnNSeXhUUVVGTExFdEJRVXM3UVVGRFZpeFJRVUZKTEZkQlFWY3NWVUZCVlN4UlFVRlJPMEZCUTJwRExGRkJRVWs3UVVGRFFTeFZRVUZKTzBGQlEwRXNiVUpCUVZjN1FVRkJRU3hsUVVWU0xFbEJRVkE3UVVGRFNTeG5Ra0ZCVVR0QlFVRkJPMEZCUldoQ0xGRkJRVWtzVjBGQlZ5eFpRVUZaTzBGQlF6TkNMRkZCUVVrc1VVRkJVU3hUUVVGVE8wRkJRM0pDTEZGQlFVa3NZMEZCWXl4TlFVRk5MRXRCUVVzc1VVRkJVVHRCUVVOeVF5eFRRVUZMTEU5QlFVODdRVUZCUVN4TlFVTlNPMEZCUVVFc1RVRkRRU3hQUVVGUExGTkJRVk03UVVGQlFTeE5RVU5vUWl4WFFVRlpMRU5CUVVNc1UwRkJVeXhUUVVGVkxFMUJRVTBzVDBGQlR5eFJRVUZSTEZkQlFWY3NVMEZCVXl4VlFVRlZMRTFCUVUwc1QwRkJUeXhSUVVGUk8wRkJRVUVzVFVGRGVFY3NUMEZCVHp0QlFVRkJMRTFCUTFBc1ZVRkJWVHRCUVVGQkxFMUJRMVlzUzBGQlN6dEJRVUZCTEUxQlEwd3NVVUZCVVR0QlFVRkJMRTFCUTFJc1YwRkJWenRCUVVGQkxFMUJRMWdzVVVGQlVUdEJRVUZCTEUxQlExSXNZMEZCWXp0QlFVRkJMRTFCUTJRc1YwRkJWenRCUVVGQkxFMUJRMWdzVTBGQlV6dEJRVUZCTEUxQlExUXNVVUZCVVR0QlFVRkJMRTFCUTFJc1QwRkJUenRCUVVGQkxFMUJRMUE3UVVGQlFTeE5RVU5CTEVsQlFVa3NVMEZCVXp0QlFVRkJMRTFCUTJJc1lVRkJZU3huUWtGQlowSXNVMEZCVXl4alFVRmpPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTMmhGTEhWQ1FVRjFRaXhIUVVGSExFZEJRVWM3UVVGRGVrSXNVMEZCVHl4SlFVRkpMRWxCUVVrc1MwRkJTeXhOUVVGTkxFbEJRVWtzU1VGQlNUdEJRVUZCTzBGQlJYUkRMRGhDUVVFNFFpeEhRVUZITEVkQlFVYzdRVUZEYUVNc1UwRkJUeXhKUVVGSkxFbEJRVWtzUzBGQlN5eE5RVUZOTEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCUjNSRExHTkJRV01zZVVKQlFYbENMRXRCUVVzc1IwRkJSenRCUVVNelF5eE5RVUZKTEdGQlFXRXNiVU5CUVcxRExHTkJRMmhFTEVsQlFVa3NkMEpCUVhkQ0xGZEJRVmNzTWtKQlEzWkRPMEZCUTBvc1lVRkJWeXhMUVVGTExGRkJRVkVzU1VGQlNTeEpRVUZKTEVWQlFVVXNUMEZCVHl4SlFVRkpMRlZCUVZVN1FVRkRka1FzVTBGQlR6dEJRVUZCTzBGQlJWZ3NlVUpCUVhsQ0xHRkJRV0U3UVVGRGJFTXNVMEZCVHl4SlFVRkpMRmxCUVZrc1YwRkJWeXhoUVVGaExGZEJRVms3UVVGQlJTeFhRVUZQTEZkQlFWYzdRVUZCUVN4TFFVRlJMRTFCUVUwN1FVRkJRVHRCUVVWcVJ5eHpRa0ZCYzBJc1MwRkJTenRCUVVOMlFpeFRRVUZQTEZGQlFWRXNVMEZEV0N4VFFVRlZMRWRCUVVjN1FVRkJSU3hYUVVGUExFVkJRVVU3UVVGQlFTeE5RVU40UWl4VFFVRlZMRWRCUVVjN1FVRkJSU3hYUVVGUExFVkJRVVU3UVVGQlFUdEJRVUZCTzBGQlJXaERMSE5DUVVGelFpeExRVUZMTzBGQlEzWkNMRk5CUVU4c1VVRkJVU3hUUVVOWUxGTkJRVlVzUjBGQlJ6dEJRVUZGTEZkQlFVOHNSVUZCUlR0QlFVRkJMRTFCUTNoQ0xGTkJRVlVzUjBGQlJ6dEJRVUZGTEZkQlFVOHNSVUZCUlR0QlFVRkJPMEZCUVVFN1FVRkZhRU1zYjBKQlFXOUNMRXRCUVVzc1ZVRkJWU3hoUVVGaExHRkJRV0VzVFVGQlN5eExRVUZMTzBGQlEyNUZMRTFCUVVrc1UwRkJVeXhMUVVGTExFbEJRVWtzU1VGQlNTeFJRVUZSTEZsQlFWazdRVUZET1VNc1RVRkJTU3hOUVVGTk8wRkJRMVlzVjBGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4UlFVRlJMRVZCUVVVc1IwRkJSenRCUVVNM1FpeFJRVUZKTEdGQlFXRXNVMEZCVXp0QlFVTXhRaXhSUVVGSkxHVkJRV1VzV1VGQldTeEpRVUZKTzBGQlF5OUNMRlZCUVVrc1MwRkJTU3hKUVVGSkxFbEJRVWtzV1VGQldTeE5RVUZOTzBGQlF6bENMR1ZCUVU4c1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eFpRVUZaTEV0QlFVc3NXVUZCV1N4UFFVRlBMRWxCUVVrN1FVRkRkRVVzVlVGQlNTeExRVUZKTEVsQlFVa3NTVUZCU1N4WlFVRlpMRTFCUVUwN1FVRkRPVUlzWlVGQlR5eEpRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRmxCUVZrc1MwRkJTeXhaUVVGWkxFOUJRVThzU1VGQlNUdEJRVU4wUlN4VlFVRkpMRTlCUVU4N1FVRkRVQ3hsUVVGUExFbEJRVWtzVDBGQlR5eEhRVUZITEU5QlFVOHNVMEZCVXl4UFFVRlBMRmxCUVZrc1QwRkJUeXhOUVVGTk8wRkJRM3BGTEdGQlFVODdRVUZCUVR0QlFVVllMRkZCUVVrc1MwRkJTU3hKUVVGSkxFbEJRVWtzWTBGQll6dEJRVU14UWl4WlFVRk5PMEZCUVVFN1FVRkZaQ3hOUVVGSkxGTkJRVk1zV1VGQldTeFZRVUZWTEZGQlFWRTdRVUZEZGtNc1YwRkJUeXhOUVVGTkxGbEJRVmtzVDBGQlR5eEpRVUZKTzBGQlEzaERMRTFCUVVrc1UwRkJVeXhKUVVGSkxGVkJRVlVzVVVGQlVUdEJRVU12UWl4WFFVRlBMRWxCUVVrc1QwRkJUeXhIUVVGSExGbEJRVms3UVVGRGNrTXNVMEZCVVN4TlFVRk5MRWxCUVVrc1QwRkJUeXhKUVVGSkxFOUJRVThzUjBGQlJ5eFBRVUZQTEZsQlFWa3NUMEZCVHl4WlFVRlpMRTlCUVU4c1RVRkJUVHRCUVVGQk8wRkJSVGxHTEdkRFFVRm5ReXhoUVVGaExFOUJRVThzVTBGQlV5eFJRVUZSTzBGQlEycEZMRTFCUVVrc1QwRkJUeXhQUVVGUExGTkJRVk1zWTBGQll5eGpRVUZqTEZkQlFWY3NaVUZCWlN4aFFVRmhMRkZCUVZFN1FVRkRkRWNzVFVGQlNTeERRVUZETEZGQlFWRXNUVUZCVFN4VFFVRlZMRWRCUVVjN1FVRkJSU3hYUVVGUExFOUJRVThzVFVGQlRUdEJRVUZCTEUxQlFXTTdRVUZEYUVVc1YwRkJUeXhMUVVGTExHRkJRV0U3UVVGQlFUdEJRVVUzUWl4NVFrRkJkVUlzUzBGQlN6dEJRVU40UWl4WlFVRlJMR0ZCUVdFN1FVRkRja0lzV1VGQlVTeGhRVUZoTzBGQlEzSkNMR05CUVZjc1VVRkJVU3hUUVVGVExHZENRVUZuUWp0QlFVTTFReXhSUVVGSkxHVkJRV1VzVVVGQlVTeEpRVUZKTEZOQlFWVXNVVUZCVVR0QlFVTTNReXhoUVVGUExFTkJRVVVzVDBGQlR5eE5RVUZOTEZOQlFWTXNUMEZCVHl4TlFVRk5PMEZCUVVFc1QwRkROME1zUzBGQlN5eFRRVUZWTEVkQlFVY3NSMEZCUnp0QlFVTndRaXhoUVVGUExGRkJRVkVzUlVGQlJTeFBRVUZQTEVWQlFVVTdRVUZCUVR0QlFVVTVRaXh0UWtGQlpTeGhRVUZoTEVsQlFVa3NVMEZCVlN4SlFVRkpPMEZCUVVVc1lVRkJUeXhIUVVGSE8wRkJRVUU3UVVGRE1VUXNiVUpCUVdVc1lVRkJZU3hKUVVGSkxGTkJRVlVzU1VGQlNUdEJRVUZGTEdGQlFVOHNSMEZCUnp0QlFVRkJPMEZCUXpGRUxHZENRVUZaTzBGQlExb3NiMEpCUVdsQ0xGRkJRVkVzVTBGQlV5eExRVUZMTzBGQlFVRTdRVUZGTTBNc1owSkJRV003UVVGRFpDeE5RVUZKTEVsQlFVa3NTVUZCU1N4WlFVRlpMRmRCUVZjc1lVRkJZU3hYUVVGWk8wRkJRVVVzVjBGQlR5eFpRVUZaTEdGQlFXRXNTVUZCU1N4aFFVRmhMR0ZCUVdFc1MwRkJTenRCUVVGQk8wRkJRMnBKTEVsQlFVVXNjVUpCUVhGQ0xGTkJRVlVzV1VGQlZ6dEJRVU40UXl4clFrRkJZenRCUVVGQk8wRkJSV3hDTEUxQlFVa3NjMEpCUVhOQ08wRkJRekZDTEVsQlFVVXNZMEZCWXl4VFFVRlZMRkZCUVZFc1UwRkJVeXhUUVVGVE8wRkJRMmhFTEZGQlFVa3NUVUZCVFN4UFFVRlBPMEZCUTJwQ0xGRkJRVWtzVDBGQlR5eFJRVUZSTzBGQlEyWXNZVUZCVHp0QlFVTllMRkZCUVVrc1YwRkJWeXhOUVVGTk8wRkJRM0pDTEZGQlFVa3NUVUZCVFN4VlFVRlZMR05CUVdNc2MwSkJRWE5DTzBGQlEzQkVMR0ZCUVU4N1FVRkJRU3hYUVVWT08wRkJRMFFzVlVGQlNTeDFRa0ZCZFVJN1FVRkRNMElzWlVGQlV5eEpRVUZKTEhGQ1FVRnhRaXhKUVVGSkxGbEJRVmtzUlVGQlJTeEhRVUZITzBGQlEyNUVMRmxCUVVrc1UwRkJVeXhYUVVGWExFdEJRVXNzVlVGQlZTeGhRVUZoTEVsQlFVa3NZVUZCWVN4SlFVRkpMRk5CUVZNN1FVRkRiRVlzV1VGQlNTeFhRVUZYTEZGQlFWRXNlVUpCUVhsQ08wRkJRelZETEdkRFFVRnpRaXhKUVVGSk8wRkJRVUVzYVVKQlEzSkNMSGxDUVVGNVFpeFJRVUZSTEZGQlFWRXNjMEpCUVhOQ0xGVkJRVlVzUjBGQlJ6dEJRVU5xUml4cFEwRkJkVUk3UVVGQlFUdEJRVUZCTzBGQlJ5OUNMRlZCUVVrc2VVSkJRWGxDTEUxQlFVMDdRVUZETDBJc1owSkJRVkVzVjBGQldUdEJRVUZGTEdsQ1FVRlBMRk5CUVZNc2RVSkJRWFZDTzBGQlFVRTdRVUZCUVN4aFFVVTFSRHRCUVVORUxHZENRVUZSTzBGQlFVRTdRVUZGV2l4aFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVkbUxGTkJRVTg3UVVGQlFUdEJRVVZZTEhGQ1FVRnhRaXhQUVVGUExFOUJRVThzVjBGQlZ5eFhRVUZYTzBGQlEzSkVMRk5CUVU4N1FVRkJRU3hKUVVOSUxFMUJRVTA3UVVGQlFTeEpRVU5PTzBGQlFVRXNTVUZEUVR0QlFVRkJMRWxCUTBFN1FVRkJRU3hKUVVOQk8wRkJRVUU3UVVGQlFUdEJRVWRTTEc5Q1FVRnZRaXhQUVVGUE8wRkJRM1pDTEZOQlFVODdRVUZCUVN4SlFVTklMRTFCUVUwN1FVRkJRU3hKUVVOT0xFOUJRVTg3UVVGQlFTeEpRVU5RTEU5QlFVODdRVUZCUVR0QlFVRkJPMEZCU1dZc1NVRkJTU3hqUVVGblFpeFhRVUZaTzBGQlF6VkNMREJDUVVGMVFqdEJRVUZCTzBGQlJYWkNMRk5CUVU4c1pVRkJaU3hoUVVGWkxGZEJRVmNzWTBGQll6dEJRVUZCTEVsQlEzWkVMRXRCUVVzc1YwRkJXVHRCUVVOaUxHRkJRVThzUzBGQlN5eExRVUZMTEUxQlFVMHNSMEZCUnp0QlFVRkJPMEZCUVVFc1NVRkZPVUlzV1VGQldUdEJRVUZCTEVsQlExb3NZMEZCWXp0QlFVRkJPMEZCUld4Q0xHVkJRVmtzVlVGQlZTeFZRVUZWTEZOQlFWVXNUMEZCVHl4UFFVRlBMR05CUVdNc1kwRkJZenRCUVVOb1JpeHRRa0ZCWlN4cFFrRkJhVUk3UVVGRGFFTXNiVUpCUVdVc2FVSkJRV2xDTzBGQlEyaERMRkZCUVVrN1FVRkRRU3hWUVVGTExFdEJRVXNzUzBGQlN5eFBRVUZQTEZOQlFWTXNTMEZETVVJc1MwRkJTeXhMUVVGTExFOUJRVThzVjBGQlZ5eExRVUZOTEdsQ1FVRm5RaXhwUWtGQmFVSXNRMEZCUlN4cFFrRkJaMEk3UVVGRGRFWXNaVUZCVHl4blFrRkJaMEk3UVVGRE0wSXNZVUZCVHl4SlFVRkpMRXRCUVVzc1YwRkJWeXhOUVVGTkxGZEJRVms3UVVGQlJTeGxRVUZQTEZsQlFWa3NUMEZCVHl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRE8wRkJRVUU3UVVGQlFTeGhRVVUzUml4SFFVRlFPMEZCUTBrc1lVRkJUeXhMUVVGTExFMUJRVTA3UVVGQlFUdEJRVUZCTzBGQlJ6RkNMR1ZCUVZrc1ZVRkJWU3hUUVVGVExGTkJRVlVzVDBGQlR6dEJRVU0xUXl4UlFVRkpMRk5CUVZNN1FVRkRWQ3hoUVVGUExFdEJRVXNzVFVGQlRUdEJRVU4wUWl4WFFVRlBMRWxCUVVrc1MwRkJTeXhYUVVGWExFMUJRVTBzVjBGQldUdEJRVUZGTEdGQlFVOHNWMEZCVnp0QlFVRkJPMEZCUVVFN1FVRkZja1VzWlVGQldTeFZRVUZWTEZGQlFWRXNVMEZCVlN4UFFVRlBPMEZCUXpORExGRkJRVWtzVTBGQlV6dEJRVU5VTEdGQlFVOHNTMEZCU3l4TlFVRk5PMEZCUTNSQ0xGZEJRVThzU1VGQlNTeExRVUZMTEZkQlFWY3NUVUZCVFN4WFFVRlpPMEZCUVVVc1lVRkJUeXhaUVVGWkxFOUJRVThzVVVGQlZ6dEJRVUZCTzBGQlFVRTdRVUZGZUVZc1pVRkJXU3hWUVVGVkxHVkJRV1VzVTBGQlZTeFBRVUZQTzBGQlEyeEVMRkZCUVVrc1UwRkJVenRCUVVOVUxHRkJRVThzUzBGQlN5eE5RVUZOTzBGQlEzUkNMRmRCUVU4c1NVRkJTU3hMUVVGTExGZEJRVmNzVFVGQlRTeFhRVUZaTzBGQlFVVXNZVUZCVHl4WlFVRlpMRTlCUVU4c1VVRkJWenRCUVVGQk8wRkJRVUU3UVVGRmVFWXNaVUZCV1N4VlFVRlZMRkZCUVZFc1UwRkJWU3hQUVVGUE8wRkJRek5ETEZGQlFVa3NVMEZCVXp0QlFVTlVMR0ZCUVU4c1MwRkJTeXhOUVVGTk8wRkJRM1JDTEZkQlFVOHNTVUZCU1N4TFFVRkxMRmRCUVZjc1RVRkJUU3hYUVVGWk8wRkJRVVVzWVVGQlR5eFpRVUZaTEZGQlFWY3NUMEZCVHl4UFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVVdlJpeGxRVUZaTEZWQlFWVXNaVUZCWlN4VFFVRlZMRTlCUVU4N1FVRkRiRVFzVVVGQlNTeFRRVUZUTzBGQlExUXNZVUZCVHl4TFFVRkxMRTFCUVUwN1FVRkRkRUlzVjBGQlR5eEpRVUZKTEV0QlFVc3NWMEZCVnl4TlFVRk5MRmRCUVZrN1FVRkJSU3hoUVVGUExGbEJRVmtzVVVGQlZ6dEJRVUZCTzBGQlFVRTdRVUZGYWtZc1pVRkJXU3hWUVVGVkxHRkJRV0VzVTBGQlZTeExRVUZMTzBGQlF6bERMRkZCUVVrc1QwRkJUeXhSUVVGUk8wRkJRMllzWVVGQlR5eExRVUZMTEUxQlFVMDdRVUZEZEVJc1YwRkJUeXhMUVVGTExGRkJRVkVzUzBGQlN5eE5RVUZOTEZkQlFWY3NUVUZCVFR0QlFVRkJPMEZCUlhCRUxHVkJRVmtzVlVGQlZTeDFRa0ZCZFVJc1UwRkJWU3hMUVVGTE8wRkJRM2hFTEZGQlFVa3NVVUZCVVR0QlFVTlNMR0ZCUVU4c1MwRkJTeXhYUVVGWE8wRkJRek5DTEZkQlFVOHNkVUpCUVhWQ0xFMUJRVTBzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4aFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxGRkJRVkU3UVVGQlFTeFBRVUZOTEVOQlFVTXNUVUZCVFR0QlFVRkJPMEZCUld4SExHVkJRVmtzVlVGQlZTeHRRa0ZCYlVJc1UwRkJWU3hMUVVGTE8wRkJRM0JFTEZkQlFVOHNkVUpCUVhWQ0xFMUJRVTBzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4aFFVRlBMRTFCUVUwc1JVRkJSVHRCUVVGQkxFOUJRVThzUTBGQlF5eE5RVUZOTzBGQlFVRTdRVUZGZGtZc1pVRkJXU3hWUVVGVkxHdENRVUZyUWl4WFFVRlpPMEZCUTJoRUxGRkJRVWtzVFVGQlRTeFhRVUZYTEUxQlFVMHNaVUZCWlR0QlFVTXhReXhSUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVU5tTEdGQlFVOHNaMEpCUVdkQ08wRkJRek5DTEZkQlFVOHNkVUpCUVhWQ0xFMUJRVTBzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4aFFVRlBMRVZCUVVVc1VVRkJVU3hQUVVGUE8wRkJRVUVzVDBGQlR5eExRVUZMTzBGQlFVRTdRVUZGT1VZc1pVRkJXU3hWUVVGVkxEUkNRVUUwUWl4WFFVRlpPMEZCUXpGRUxGRkJRVWtzVFVGQlRTeFhRVUZYTEUxQlFVMHNaVUZCWlR0QlFVTXhReXhSUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVU5tTEdGQlFVOHNaMEpCUVdkQ08wRkJRek5DTEZkQlFVOHNkVUpCUVhWQ0xFMUJRVTBzVTBGQlZTeEhRVUZITEVkQlFVYzdRVUZCUlN4aFFVRlBMRVZCUVVVc1MwRkJTeXhUUVVGVkxFZEJRVWM3UVVGQlJTeGxRVUZQTEVWQlFVVXNVVUZCVVN4UFFVRlBPMEZCUVVFN1FVRkJRU3hQUVVGVkxFdEJRVXM3UVVGQlFUdEJRVVU1U0N4bFFVRlpMRlZCUVZVc1VVRkJVU3hYUVVGWk8wRkJRM1JETEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc1RVRkJUU3hYUVVGWExFMUJRVTBzWlVGQlpUdEJRVU14UXl4UlFVRkpMRlZCUVZVc1MwRkJTenRCUVVOdVFpeFJRVUZKTzBGQlEwRXNWVUZCU1N4TFFVRkxPMEZCUVVFc1lVRkZUaXhIUVVGUU8wRkJRMGtzWVVGQlR5eExRVUZMTEUxQlFVMDdRVUZCUVR0QlFVVjBRaXhSUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVU5tTEdGQlFVOHNaMEpCUVdkQ08wRkJRek5DTEZGQlFVa3NTVUZCU1N4SlFVRkpMRXRCUVVzc1YwRkJWeXhOUVVGTkxGZEJRVms3UVVGQlJTeGhRVUZQTEZsQlFWa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTU3hUUVVGVE8wRkJRVUU3UVVGRE5VWXNUVUZCUlN4eFFrRkJjVUlzVTBGQlZTeFhRVUZYTzBGQlEzaERMR2RDUVVGWExHTkJRV01zVTBGRGNrSXNUVUZCVFN4aFFVTk9MRTFCUVUwN1FVRkRWaXhWUVVGSkxFdEJRVXM3UVVGQlFUdEJRVVZpTEZGQlFVa3NTVUZCU1R0QlFVTlNMRTFCUVVVc1kwRkJZeXhUUVVGVkxGRkJRVkVzVTBGQlV5eFRRVUZUTzBGQlEyaEVMRlZCUVVrc1RVRkJUU3hQUVVGUE8wRkJRMnBDTEdGQlFVOHNVVUZCVVN4TFFVRkxMRWxCUVVrc1RVRkJUU3hIUVVGSE8wRkJRemRDTEZWQlFVVTdRVUZEUml4WlFVRkpMRTFCUVUwc1NVRkJTU3hSUVVGUk8wRkJRMnhDTEd0Q1FVRlJPMEZCUTFJc2FVSkJRVTg3UVVGQlFUdEJRVUZCTzBGQlIyWXNWVUZCU1N4UlFVRlJMRXRCUVVzc1NVRkJTU3hSUVVGUkxFZEJRVWM3UVVGRE5VSXNaVUZCVHp0QlFVRkJMR0ZCUlU0N1FVRkRSQ3huUWtGQlVTeFhRVUZaTzBGQlFVVXNhVUpCUVU4c1UwRkJVeXhKUVVGSk8wRkJRVUU3UVVGRE1VTXNaVUZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhYUVVGUE8wRkJRVUU3UVVGRldDeGxRVUZaTEZWQlFWVXNWMEZCVnl4VFFVRlZMRTlCUVU4N1FVRkRPVU1zVjBGQlR5eExRVUZMTEZkQlFWY3NRMEZCUXl4RFFVRkRMRkZCUVZFc1VVRkJVU3hEUVVGRExFOUJRVThzUzBGQlN5eEhRVUZITEZkQlFWY3NRMEZCUlN4bFFVRmxMRTlCUVU4c1pVRkJaVHRCUVVGQk8wRkJSUzlITEdWQlFWa3NWVUZCVlN4VFFVRlRMRmRCUVZrN1FVRkRka01zVVVGQlNTeE5RVUZOTEZkQlFWY3NUVUZCVFN4bFFVRmxPMEZCUXpGRExGRkJRVWtzU1VGQlNTeFhRVUZYTzBGQlEyWXNZVUZCVHl4SlFVRkpMRXRCUVVzc1YwRkJWenRCUVVNdlFpeFJRVUZKTzBGQlEwRXNWVUZCU1N4TFFVRkxMRXRCUVVzN1FVRkJRU3hoUVVWWUxFZEJRVkE3UVVGRFNTeGhRVUZQTEV0QlFVc3NUVUZCVFR0QlFVRkJPMEZCUlhSQ0xGRkJRVWtzVTBGQlV5eEpRVUZKTEU5QlFVOHNVMEZCVlN4TFFVRkxMRXRCUVVzN1FVRkJSU3hoUVVGUExFMUJRMnBFTEVsQlFVa3NUMEZCVHl4RFFVRkRMRU5CUVVNc1NVRkJTU3hKUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEZOQlEzSkRMRU5CUVVNc1EwRkJReXhSUVVGUk8wRkJRVUVzVDBGQlZUdEJRVU40UWl4WFFVRlBMRXRCUVVzc1EwRkJReXhKUVVGSkxFbEJRVWtzVTBGQlV5eEpRVUZKTEV0QlFVc3NSMEZCUnp0QlFVTXhReXhYUVVGUExFdEJRVXNzVjBGQlZ5eFJRVUZSTEVOQlFVVXNaVUZCWlN4UFFVRlBMR1ZCUVdVN1FVRkJRVHRCUVVVeFJTeGxRVUZaTEZWQlFWVXNZVUZCWVN4VFFVRlZMRkZCUVZFc1UwRkJVenRCUVVNeFJDeFJRVUZKTEZGQlFWRTdRVUZEV2l4UlFVRkpMRTlCUVUwc1MwRkJTeXhOUVVGTkxGbEJRVmtzUzBGQlN5eFpRVUZaTEdGQlFXRXNTMEZCU3l4aFFVRmhMRTFCUVUwc1MwRkJTeXhOUVVGTkxFMUJRVTBzUzBGQlN6dEJRVU0zUnl4UlFVRkpMRTlCUVU4c1YwRkJWenRCUVVOc1FpeGhRVUZQTEdkQ1FVRm5RanRCUVVNelFpeFJRVUZKTEVOQlFVTXNUMEZCVHl4TlFVRk5MRk5CUVZVc1QwRkJUenRCUVVNdlFpeGhRVUZQTEUxQlFVMHNUMEZCVHl4VlFVTm9RaXhOUVVGTkxFOUJRVThzVlVGRFlpeFZRVUZWTEUxQlFVMHNTVUZCU1N4TlFVRk5MRTlCUVU4N1FVRkJRU3hSUVVOeVF6dEJRVU5CTEdGQlFVOHNTMEZCU3l4TlFVRk5MRGhJUVVFNFNDeFhRVUZYTzBGQlFVRTdRVUZGTDBvc1VVRkJTU3huUWtGQlowSXNRMEZCUXl4WFFVRlhMRkZCUVZFc2EwSkJRV3RDTzBGQlF6RkVMRkZCUVVrc1owSkJRV2RDTEZkQlFWY3NVVUZCVVN4clFrRkJhMEk3UVVGRGVrUXNkVUpCUVd0Q0xGTkJRVkVzVlVGQlZUdEJRVU5vUXl4VlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxGRkJRVTg3UVVGRGRFSXNZVUZCVHl4SlFVRkpMRWRCUVVjc1JVRkJSU3hIUVVGSE8wRkJRMllzV1VGQlNTeFJRVUZSTEZGQlFVODdRVUZEYmtJc1dVRkJTU3hMUVVGSkxGTkJRVk1zU1VGQlNTeE5RVUZOTEUxQlFVMHNTMEZCU3l4TFFVRkpMRk5CUVZNc1NVRkJTU3hOUVVGTkxFMUJRVTBzUjBGQlJ6dEJRVU5zUlN4blFrRkJUU3hMUVVGTExFbEJRVWtzVFVGQlRTeEpRVUZKTEZOQlFWTTdRVUZEYkVNc1owSkJRVTBzUzBGQlN5eEpRVUZKTEUxQlFVMHNTVUZCU1N4VFFVRlRPMEZCUTJ4RE8wRkJRVUU3UVVGQlFUdEJRVWRTTEZWQlFVa3NUVUZCVFR0QlFVTk9MR2RDUVVGUExFdEJRVXM3UVVGRGFFSXNZVUZCVHp0QlFVRkJPMEZCUlZnc1VVRkJTU3huUWtGQlowSTdRVUZEY0VJc2VVSkJRWEZDTEVkQlFVY3NSMEZCUnp0QlFVRkZMR0ZCUVU4c1kwRkJZeXhGUVVGRkxFbEJRVWtzUlVGQlJUdEJRVUZCTzBGQlF6RkVMRkZCUVVrN1FVRkRTaXhSUVVGSk8wRkJRMEVzV1VGQlRTeFBRVUZQTEU5QlFVOHNWMEZCVlR0QlFVTTVRaXhWUVVGSkxFdEJRVXM3UVVGQlFTeGhRVVZPTEVsQlFWQTdRVUZEU1N4aFFVRlBMRXRCUVVzc1RVRkJUVHRCUVVGQk8wRkJSWFJDTEZGQlFVa3NWMEZCVnp0QlFVTm1MRkZCUVVrc01FSkJRVEJDTEdkQ1FVTXhRaXhUUVVGVkxFdEJRVXM3UVVGQlJTeGhRVUZQTEZWQlFWVXNTMEZCU3l4SlFVRkpMRlZCUVZVc1RVRkJUVHRCUVVGQkxGRkJRek5FTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1ZVRkJWU3hMUVVGTExFbEJRVWtzVlVGQlZTeFBRVUZQTzBGQlFVRTdRVUZEYUVVc1VVRkJTU3d3UWtGQk1FSXNaMEpCUXpGQ0xGTkJRVlVzUzBGQlN6dEJRVUZGTEdGQlFVOHNWMEZCVnl4TFFVRkxMRWxCUVVrc1ZVRkJWU3hOUVVGTk8wRkJRVUVzVVVGRE5VUXNVMEZCVlN4TFFVRkxPMEZCUVVVc1lVRkJUeXhYUVVGWExFdEJRVXNzU1VGQlNTeFZRVUZWTEU5QlFVODdRVUZCUVR0QlFVTnFSU3h0UTBGQkswSXNTMEZCU3p0QlFVTm9ReXhoUVVGUExFTkJRVU1zZDBKQlFYZENMRkZCUVZFc1EwRkJReXgzUWtGQmQwSTdRVUZCUVR0QlFVVnlSU3hSUVVGSkxGZEJRVmM3UVVGRFppeFJRVUZKTEVsQlFVa3NTVUZCU1N4TFFVRkxMRmRCUVZjc1RVRkJUU3hYUVVGWk8wRkJRVVVzWVVGQlR5eFpRVUZaTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXp0QlFVRkJPMEZCUTNaSUxFMUJRVVVzY1VKQlFYRkNMRk5CUVZVc1YwRkJWenRCUVVONFF5eFZRVUZKTEdOQlFXTXNVVUZCVVR0QlFVTjBRaXh0UWtGQlZ6dEJRVU5ZTEhkQ1FVRm5RanRCUVVGQkxHRkJSV1k3UVVGRFJDeHRRa0ZCVnp0QlFVTllMSGRDUVVGblFqdEJRVUZCTzBGQlJYQkNMRlZCUVVrc1MwRkJTenRCUVVGQk8wRkJSV0lzVFVGQlJTeGpRVUZqTEZOQlFWVXNVVUZCVVN4VFFVRlRMRk5CUVZNN1FVRkRhRVFzVlVGQlNTeE5RVUZOTEU5QlFVODdRVUZEYWtJc1lVRkJUeXhUUVVGVExFMUJRVTA3UVVGRGJFSXNWVUZCUlR0QlFVTkdMRmxCUVVrc1lVRkJZU3hKUVVGSkxGRkJRVkU3UVVGRGVrSXNhMEpCUVZFN1FVRkRVaXhwUWtGQlR6dEJRVUZCTzBGQlFVRTdRVUZIWml4VlFVRkpMSE5DUVVGelFpeE5RVUZOTzBGQlF6VkNMR1ZCUVU4N1FVRkJRU3hwUWtGRlJpeE5RVUZOTEV0QlFVc3NTMEZCU3l4SlFVRkpMRlZCUVZVc1VVRkJVU3hMUVVGTExFMUJRVTBzUzBGQlN5eExRVUZMTEVsQlFVa3NWVUZCVlN4UlFVRlJMRWRCUVVjN1FVRkRla1lzWlVGQlR6dEJRVUZCTEdGQlJVNDdRVUZEUkN4blFrRkJVU3hYUVVGWk8wRkJRMmhDTEdOQlFVa3NhMEpCUVd0Q08wRkJRMnhDTEcxQ1FVRlBMRk5CUVZNc1NVRkJTU3hWUVVGVk8wRkJRVUU3UVVGRk9VSXNiVUpCUVU4c1UwRkJVeXhKUVVGSkxGVkJRVlU3UVVGQlFUdEJRVVYwUXl4bFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVkbUxGZEJRVTg3UVVGQlFUdEJRVVZZTEdWQlFWa3NWVUZCVlN4clFrRkJhMElzVjBGQldUdEJRVU5vUkN4UlFVRkpMRTFCUVUwc1YwRkJWeXhOUVVGTkxHVkJRV1U3UVVGRE1VTXNVVUZCU1N4RFFVRkRMRWxCUVVrc1RVRkJUU3hUUVVGVkxFZEJRVWM3UVVGQlJTeGhRVUZQTEU5QlFVOHNUVUZCVFR0QlFVRkJMRkZCUVdNN1FVRkROVVFzWVVGQlR5eExRVUZMTEUxQlFVMDdRVUZCUVR0QlFVVjBRaXhSUVVGSkxFbEJRVWtzVjBGQlZ6dEJRVU5tTEdGQlFVOHNaMEpCUVdkQ08wRkJRek5DTEZkQlFVOHNTMEZCU3l4WFFVRlhMRWxCUVVrc1NVRkJTU3hUUVVGVkxFdEJRVXM3UVVGQlJTeGhRVUZQTEVOQlFVTXNTMEZCU3l4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVWMlJTeFRRVUZQTzBGQlFVRTdRVUZIV0N4elEwRkJjME1zU1VGQlNUdEJRVU4wUXl4VFFVRlBMSEZDUVVGeFFpeFpRVUZaTEZkQlFWY3NjMEpCUVhGQ0xFOUJRVThzVDBGQlR5eGpRVUZqTzBGQlEyaEhMRk5CUVVzc1MwRkJTenRCUVVOV0xGTkJRVXNzVDBGQlR6dEJRVUZCTEUxQlExSTdRVUZCUVN4TlFVTkJMRTlCUVU4c1ZVRkJWU3hSUVVGUkxFOUJRVTg3UVVGQlFTeE5RVU5vUXl4SlFVRkpPMEZCUVVFN1FVRkZVaXhSUVVGSkxGbEJRVmtzUjBGQlJ5eE5RVUZOTzBGQlEzcENMRkZCUVVrc1EwRkJRenRCUVVORUxGbEJRVTBzU1VGQlNTeFhRVUZYTzBGQlEzcENMRk5CUVVzc1QwRkJUeXhMUVVGTExHRkJRV0VzVlVGQlZTeEpRVUZKTEV0QlFVczdRVUZEYWtRc1UwRkJTeXhqUVVGakxGTkJRVlVzUjBGQlJ5eEhRVUZITzBGQlFVVXNZVUZCVHl4VlFVRlZMRWxCUVVrc1IwRkJSenRCUVVGQk8wRkJRemRFTEZOQlFVc3NUMEZCVHl4VFFVRlZMRWRCUVVjc1IwRkJSenRCUVVGRkxHRkJRVThzVlVGQlZTeEpRVUZKTEVkQlFVY3NTMEZCU3l4SlFVRkpMRWxCUVVrN1FVRkJRVHRCUVVOdVJTeFRRVUZMTEU5QlFVOHNVMEZCVlN4SFFVRkhMRWRCUVVjN1FVRkJSU3hoUVVGUExGVkJRVlVzU1VGQlNTeEhRVUZITEV0QlFVc3NTVUZCU1N4SlFVRkpPMEZCUVVFN1FVRkRia1VzVTBGQlN5eGxRVUZsTEVkQlFVY3NUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkpja01zTkVKQlFUUkNMRkZCUVZFN1FVRkRhRU1zVTBGQlR5eExRVUZMTEZOQlFWVXNUMEZCVHp0QlFVTjZRaXh0UWtGQlpUdEJRVU5tTEZkQlFVOHNUVUZCVFN4UFFVRlBPMEZCUTNCQ0xGZEJRVTg3UVVGQlFUdEJRVUZCTzBGQlIyWXNkMEpCUVhkQ0xFOUJRVTg3UVVGRE0wSXNUVUZCU1N4TlFVRk5PMEZCUTA0c1ZVRkJUVHRCUVVOV0xFMUJRVWtzVFVGQlRUdEJRVU5PTEZWQlFVMDdRVUZCUVR0QlFVZGtMRWxCUVVrc1pVRkJaU3hQUVVGUExFMUJRVTA3UVVGRmFFTXNTVUZCU1N4alFVRm5RaXhYUVVGWk8wRkJRelZDTERCQ1FVRjFRanRCUVVGQk8wRkJSWFpDTEdWQlFWa3NWVUZCVlN4UlFVRlJMRmRCUVZrN1FVRkRkRU1zVjBGQlR5eERRVUZETEVsQlFVazdRVUZEV2l4TlFVRkZMRXRCUVVzN1FVRkRVQ3hSUVVGSkxFdEJRVXNzWTBGQll5eExRVUZMTEVOQlFVTXNTVUZCU1R0QlFVTTNRaXhWUVVGSkxHVkJRV1U3UVVGRGRrSXNWMEZCVHp0QlFVRkJPMEZCUlZnc1pVRkJXU3hWUVVGVkxGVkJRVlVzVjBGQldUdEJRVU40UXl4WFFVRlBMRU5CUVVNc1NVRkJTVHRCUVVOYUxGRkJRVWtzUlVGQlJTeExRVUZMTEdOQlFXTXNSMEZCUnp0QlFVTjRRaXhWUVVGSkxFTkJRVU1zU1VGQlNUdEJRVU5NTEZsQlFVa3NaVUZCWlR0QlFVTjJRaXhoUVVGUExFdEJRVXNzWTBGQll5eFRRVUZUTEV0QlFVc3NRMEZCUXl4TFFVRkxMRmRCUVZjN1FVRkRja1FzV1VGQlNTeFhRVUZYTEV0QlFVc3NZMEZCWXp0QlFVTnNReXhaUVVGSk8wRkJRMEVzYVVKQlFVOHNVMEZCVXl4SlFVRkpMRk5CUVZNN1FVRkJRU3hwUWtGRk1VSXNSMEZCVUR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVkU0xGZEJRVTg3UVVGQlFUdEJRVVZZTEdWQlFWa3NWVUZCVlN4VlFVRlZMRmRCUVZrN1FVRkRlRU1zVjBGQlR5eExRVUZMTEdGQlFXRXNTVUZCU1N4cFFrRkJhVUk3UVVGQlFUdEJRVVZzUkN4bFFVRlpMRlZCUVZVc1UwRkJVeXhUUVVGVkxGVkJRVlU3UVVGREwwTXNVVUZCU1N4UlFVRlJPMEZCUTFvc1VVRkJTU3hEUVVGRExFdEJRVXM3UVVGRFRpeGhRVUZQTzBGQlExZ3NVVUZCU1N4UlFVRlJMRXRCUVVzc1IwRkJSenRCUVVOd1FpeFJRVUZKTEdOQlFXTXNTMEZCU3l4SFFVRkhMRTlCUVU4N1FVRkRha01zVjBGQlR5eERRVUZETEV0QlFVczdRVUZEWWl4UlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFOUJRVTg3UVVGRGNrSXNZMEZCVVN4bFFVRmxMRmxCUVZrN1FVRkJRU3hoUVVNeFFqdEJRVU5FTEdkQ1FVRk5MRWxCUVVrc1YwRkJWeXhsUVVGbE8wRkJRVUVzWVVGRGJrTTdRVUZEUkN4blFrRkJUU3hKUVVGSkxGZEJRVmNzVjBGQlZ5eFpRVUZaTEZOQlFWTTdRVUZCUVR0QlFVVnlSQ3huUWtGQlRTeEpRVUZKTEZkQlFWY3NWMEZCVnp0QlFVRkJPMEZCUVVFN1FVRkhOVU1zVVVGQlNTeERRVUZETEV0QlFVczdRVUZEVGl4WlFVRk5MRWxCUVVrc1YwRkJWenRCUVVONlFpeFhRVUZQTEV0QlFVc3NXVUZCV1N4WFFVRlhPMEZCUTI1RExHVkJRVmNzUzBGQlN5eFhRVUZYTEZsQlFWa3NUVUZCVFN4WlFVRlpMRzlDUVVGdlFpeExRVUZMTEdGQlFXRXNTMEZCU3p0QlFVTndSeXhoUVVGVExGVkJRVlVzUzBGQlN5eFRRVUZWTEVsQlFVazdRVUZEYkVNc2NVSkJRV1U3UVVGRFppeFpRVUZOTEZGQlFWRXNVMEZCVXp0QlFVRkJPMEZCUlROQ0xHRkJRVk1zVlVGQlZTeExRVUZMTEZOQlFWVXNTVUZCU1R0QlFVTnNReXh4UWtGQlpUdEJRVU5tTEZsQlFVMHNWVUZCVlN4TlFVRk5MRkZCUVZFc1NVRkJTU3hYUVVGWExFMUJRVTBzVTBGQlV6dEJRVU0xUkN4WlFVRk5MRk5CUVZNN1FVRkRaaXhaUVVGTkxFZEJRVWNzVTBGQlV5eExRVUZMTzBGQlFVRTdRVUZGTTBJc1lVRkJVeXhoUVVGaExFdEJRVXNzVjBGQldUdEJRVU51UXl4WlFVRk5MRk5CUVZNN1FVRkRaaXhaUVVGTk8wRkJRMDRzVlVGQlNTeHJRa0ZCYTBJc1ZVRkJWVHRCUVVNMVFpeHhRa0ZCWVN4WlFVRlpMRXRCUVVzc1UwRkJVenRCUVVGQk8wRkJRVUU3UVVGSEwwTXNWMEZCVHp0QlFVRkJPMEZCUlZnc1pVRkJXU3hWUVVGVkxGZEJRVmNzVTBGQlZTeE5RVUZOTEVsQlFVa3NXVUZCV1R0QlFVTTNSQ3hSUVVGSkxGRkJRVkU3UVVGRFdpeFJRVUZKTEZOQlFWTXNaVUZCWlN4TFFVRkxMRk5CUVZNN1FVRkRkRU1zWVVGQlR5eFZRVUZWTEVsQlFVa3NWMEZCVnl4VFFVRlRPMEZCUXpkRExGRkJRVWtzUTBGQlF5eExRVUZMTzBGQlEwNHNZVUZCVHl4VlFVRlZMRWxCUVVrc1YwRkJWenRCUVVOd1F5eFJRVUZKTEV0QlFVc3NWMEZCVnp0QlFVTm9RaXhoUVVGUExFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXZReXhqUVVGTkxHTkJRV01zUzBGQlN5eERRVUZETEZkQlFWazdRVUZET1VJc1owSkJRVTBzVTBGQlV5eE5RVUZOTEVsQlFVa3NXVUZCV1N4TFFVRkxMRk5CUVZNN1FVRkJRU3hYUVVOd1JEdEJRVUZCTzBGQlFVRXNaVUZIVGl4WlFVRlpPMEZCUTJwQ0xHRkJRVThzVTBGQlV5eFhRVUZaTzBGQlEzaENMRmxCUVVrc1MwRkJTU3hKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZEYUVRc1owSkJRVTA3UVVGRFRpeGpRVUZKTEV0QlFVc3NSMEZCUnl4VFFVRlRMRkZCUVZFN1FVRkROMElzWTBGQlNTeE5RVUZOTEVkQlFVYzdRVUZEVkN4bFFVRkhMRXRCUVVzc1UwRkJVenRCUVVGQk8wRkJSWHBDTEZkQlFVVXNVVUZCVVN4WFFVRlpPMEZCUVVVc2FVSkJRVThzVFVGQlRUdEJRVUZCTzBGQlEzSkRMRmRCUVVVc1QwRkJUenRCUVVOVUxHVkJRVTg3UVVGQlFUdEJRVUZCTEZkQlIxWTdRVUZEUkN4VlFVRkpMRWxCUVVrc1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlEyaEVMRmxCUVVrc1MwRkJTeXhIUVVGSExGTkJRVk1zVVVGQlVUdEJRVU0zUWl4WlFVRkpMRTFCUVUwc1IwRkJSenRCUVVOVUxHRkJRVWNzUzBGQlN5eFRRVUZUTzBGQlFVRTdRVUZGZWtJc1VVRkJSU3hQUVVGUE8wRkJRMVFzWVVGQlR6dEJRVUZCTzBGQlFVRTdRVUZIWml4bFFVRlpMRlZCUVZVc1VVRkJVU3hYUVVGWk8wRkJRM1JETEZkQlFVOHNTMEZCU3l4VFFVRlRMRXRCUVVzc1QwRkJUeXhWUVVGVk8wRkJRVUU3UVVGRkwwTXNaVUZCV1N4VlFVRlZMRlZCUVZVc1UwRkJWU3hoUVVGaE8wRkJRMjVFTEZGQlFVa3NUMEZCVHl4TFFVRkxPMEZCUTJoQ0xGRkJRVWtzVlVGQlZTeGhRVUZoTEZGQlFWRTdRVUZEYmtNc1VVRkJTU3hMUVVGTExHRkJRV0U3UVVGRGJFSXNWMEZCU3l4alFVRmpMRXRCUVVzc1dVRkJXU3hMUVVGTExGZEJRVms3UVVGQlJTeGxRVUZQTzBGQlFVRTdRVUZCUVN4WFFVVTNSRHRCUVVORUxGZEJRVXNzWTBGQll6dEJRVU51UWl4WFFVRkxMR2RDUVVGblFqdEJRVU55UWl4VlFVRkpMRkZCUVZFc1MwRkJTeXhUUVVGVExGbEJRVmtzUzBGQlN5eFhRVUZYTzBGQlEzUkVMRTFCUVVNc2FVSkJRV2RDTzBGQlEySXNWVUZCUlN4TFFVRkxPMEZCUTFBc1pVRkJUeXhMUVVGTExHTkJRV003UVVGRGRFSXNWVUZCUXl4TFFVRkxMR05CUVdNN1FVRkRlRUlzV1VGQlNTeExRVUZMTzBGQlEwd3NaMEpCUVUwc1NVRkJTU3hYUVVGWExGbEJRVms3UVVGQlFUdEJRVUZCTzBGQlJ6ZERMRkZCUVVrc2NVSkJRWEZDTEV0QlFVczdRVUZET1VJc1YwRkJUeXhKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZETDBNc1kwRkJVU3hMUVVGTExGTkJRVlVzUzBGQlN6dEJRVUZGTEdWQlFVOHNTMEZCU3l4alFVRmpMRXRCUVVzc1MwRkJTeXhSUVVGUkxFdEJRVXNzVFVGQlRUdEJRVUZCTEZOQlFWY3NVMEZCVlN4TFFVRkxPMEZCUVVVc1pVRkJUeXhMUVVGTExHTkJRV01zUzBGQlN5eExRVUZMTEU5QlFVOHNTMEZCU3l4TlFVRk5PMEZCUVVFc1UwRkJWeXhSUVVGUkxGZEJRVms3UVVGRGJFMHNXVUZCU1N4TFFVRkxMR2RDUVVGblFpeHZRa0ZCYjBJN1FVRkRla01zWlVGQlN5eGpRVUZqTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxia01zWlVGQldTeFZRVUZWTEZGQlFWRXNWMEZCV1R0QlFVTjBReXhUUVVGTExGVkJRVlVzUzBGQlN5eFJRVUZSTEVsQlFVa3NWMEZCVnp0QlFVTXpReXhUUVVGTExGTkJRVk03UVVGQlFUdEJRVVZzUWl4bFFVRlpMRlZCUVZVc1VVRkJVU3hUUVVGVkxGZEJRVmM3UVVGREwwTXNVVUZCU1N4cFFrRkJhMElzUzBGQlN5eHRRa0ZCYjBJc1RVRkJTeXhyUWtGQmEwSTdRVUZEZEVVc1VVRkJTU3hQUVVGUExHZENRVUZuUWp0QlFVTjJRaXhoUVVGUExHVkJRV1U3UVVGRE1VSXNVVUZCU1N4alFVRmpMRXRCUVVzc1QwRkJUenRCUVVNNVFpeFJRVUZKTEVOQlFVTXNZVUZCWVR0QlFVTmtMRmxCUVUwc1NVRkJTU3hYUVVGWExGTkJRVk1zVjBGQlZ5eFpRVUZaTzBGQlFVRTdRVUZGZWtRc1VVRkJTU3gzUWtGQmQwSXNTVUZCU1N4TFFVRkxMRWRCUVVjc1RVRkJUU3hYUVVGWExHRkJRV0U3UVVGRGRFVXNNRUpCUVhOQ0xFOUJRVThzUzBGQlN5eEhRVUZITEV0QlFVc3NUVUZCVFR0QlFVTm9SQ3h0UWtGQlpTeGhRVUZoTzBGQlF6VkNMRmRCUVU4N1FVRkJRVHRCUVVWWUxGTkJRVTg3UVVGQlFUdEJRVWRZTEhORFFVRnpReXhKUVVGSk8wRkJRM1JETEZOQlFVOHNjVUpCUVhGQ0xGbEJRVmtzVjBGQlZ5eHpRa0ZCY1VJc1RVRkJUU3haUVVGWkxGVkJRVlVzVVVGQlVUdEJRVU40Unl4UlFVRkpMRkZCUVZFN1FVRkRXaXhUUVVGTExFdEJRVXM3UVVGRFZpeFRRVUZMTEU5QlFVODdRVUZEV2l4VFFVRkxMR0ZCUVdFN1FVRkRiRUlzVTBGQlN5eFRRVUZUTzBGQlEyUXNVMEZCU3l4WFFVRlhPMEZCUTJoQ0xGTkJRVXNzUzBGQlN5eFBRVUZQTEUxQlFVMHNXVUZCV1N4VFFVRlRPMEZCUXpWRExGTkJRVXNzVTBGQlV5eFZRVUZWTzBGQlEzaENMRk5CUVVzc1UwRkJVenRCUVVOa0xGTkJRVXNzV1VGQldUdEJRVU5xUWl4VFFVRkxMR2RDUVVGblFqdEJRVU55UWl4VFFVRkxMRmRCUVZjN1FVRkRhRUlzVTBGQlN5eFZRVUZWTzBGQlEyWXNVMEZCU3l4alFVRmpPMEZCUTI1Q0xGTkJRVXNzWjBKQlFXZENPMEZCUTNKQ0xGTkJRVXNzWVVGQllUdEJRVU5zUWl4VFFVRkxMR05CUVdNc1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlF6TkVMRmxCUVUwc1YwRkJWenRCUVVOcVFpeFpRVUZOTEZWQlFWVTdRVUZCUVR0QlFVVndRaXhUUVVGTExGbEJRVmtzUzBGQlN5eFhRVUZaTzBGQlF6bENMRmxCUVUwc1UwRkJVenRCUVVObUxGbEJRVTBzUjBGQlJ5eFRRVUZUTzBGQlFVRXNUMEZEYmtJc1UwRkJWU3hIUVVGSE8wRkJRMW9zVlVGQlNTeFpRVUZaTEUxQlFVMDdRVUZEZEVJc1dVRkJUU3hUUVVGVE8wRkJRMllzV1VGQlRTeEhRVUZITEUxQlFVMHNTMEZCU3p0QlFVTndRaXhaUVVGTkxGTkJRMFlzVFVGQlRTeFBRVUZQTEZGQlFWRXNTMEZEY2tJc1lVRkJZU3hOUVVGTkxGbEJRVmtzVFVGQlRTeFRRVUZUTzBGQlEyeEVMR0ZCUVU4c1ZVRkJWVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXMzUWl4NVFrRkJlVUlzVFVGQlRTeFRRVUZUTEZGQlFWRXNUMEZCVHl4TlFVRk5MRlZCUVZVc1YwRkJWenRCUVVNNVJTeFRRVUZQTzBGQlFVRXNTVUZEU0R0QlFVRkJMRWxCUTBFN1FVRkJRU3hKUVVOQk8wRkJRVUVzU1VGRFFUdEJRVUZCTEVsQlEwRTdRVUZCUVN4SlFVTkJPMEZCUVVFc1NVRkRRU3hMUVVGTkxGZEJRVlVzUTBGQlF5eFpRVUZaTEUxQlFVMHNUVUZCVHl4VFFVRlJMRTFCUVUwc1RVRkJUeXhSUVVGUExFOUJRVThzVFVGQlRTeG5Ra0ZCWjBJN1FVRkJRVHRCUVVGQk8wRkJSek5ITEhsQ1FVRjVRaXhUUVVGVE8wRkJRemxDTEZOQlFVOHNUMEZCVHl4WlFVRlpMRmRCUTNSQ0xGVkJRMEVzVlVGQlZ5eE5RVUZOTEVkQlFVY3NTMEZCU3l4TFFVRkxMRk5CUVZNc1QwRkJUeXhOUVVGUE8wRkJRVUU3UVVGSE4wUXNNa0pCUVRKQ0xFMUJRVTBzVTBGQlV5eFRRVUZUTzBGQlF5OURMRk5CUVU4N1FVRkJRU3hKUVVOSU8wRkJRVUVzU1VGRFFUdEJRVUZCTEVsQlEwRTdRVUZCUVN4SlFVTkJMR0ZCUVdFN1FVRkJRU3hKUVVOaUxGZEJRVmNzWTBGQll5eFRRVUZUTEZOQlFWVXNUMEZCVHp0QlFVRkZMR0ZCUVU4c1EwRkJReXhOUVVGTkxFMUJRVTA3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKYWtZc2VVSkJRWGxDTEZOQlFWTTdRVUZET1VJc1RVRkJTU3hYUVVGWExFMUJRVTA3UVVGRGFrSXNWMEZCVHl4WFFVRlpPMEZCUVVVc1lVRkJUenRCUVVGQk8wRkJRVUVzWVVGRmRrSXNUMEZCVHl4WlFVRlpMRlZCUVZVN1FVRkRiRU1zVjBGQlR5d3dRa0ZCTUVJN1FVRkJRU3hUUVVWb1F6dEJRVU5FTEZkQlFVOHNVMEZCVlN4TFFVRkxPMEZCUVVVc1lVRkJUeXhoUVVGaExFdEJRVXM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZIZWtRc2JVTkJRVzFETEZOQlFWTTdRVUZEZUVNc1RVRkJTU3hSUVVGUkxGRkJRVkVzVFVGQlRUdEJRVU14UWl4TlFVRkpMRTFCUVUwc1YwRkJWeXhIUVVGSE8wRkJRM0JDTEZkQlFVOHNVMEZCVlN4TFFVRkxPMEZCUVVVc1lVRkJUeXhKUVVGSk8wRkJRVUU3UVVGQlFTeFRRVVZzUXp0QlFVTkVMRmRCUVU4c1UwRkJWU3hMUVVGTE8wRkJRVVVzWVVGQlR5eGhRVUZoTEV0QlFVczdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkpla1FzYTBKQlFXdENMRmRCUVZjN1FVRkRla0lzVTBGQlR5eEhRVUZITEUxQlFVMHNTMEZCU3p0QlFVRkJPMEZCUlhwQ0xFbEJRVWtzWTBGQll6dEJRVU5zUWl4NVFrRkJlVUlzVTBGQlV6dEJRVU01UWl4VFFVRlBMRmRCUVZjc1QwRkRaQ3hSUVVOQkxFOUJRVThzV1VGQldTeFhRVU5tTEZWQlEwRXNUVUZCVFN4UlFVRlJMRXRCUVVzc1QwRkJUenRCUVVGQk8wRkJSWFJETEhOQ1FVRnpRaXhKUVVGSkxGZEJRVmNzWVVGQllTeFZRVUZWTzBGQlEzaEVMRTFCUVVrc1QwRkJUU3hWUVVGVkxFbEJRVWtzUzBGQlN6dEJRVU0zUWl4NVFrRkJkVUlzUzBGQlNTeFBRVUZQTzBGQlF6bENMRkZCUVVrc1ZVRkJVeXhUUVVGVExFbEJRVWM3UVVGRGVrSXNWMEZCVHp0QlFVRkJMRTFCUTBnc1VVRkJVVHRCUVVGQkxGRkJRMG9zVFVGQlRTeEpRVUZITzBGQlFVRXNVVUZEVkN4UlFVRlJMRkZCUVU4c1NVRkJTU3hUUVVGVkxFOUJRVTg3UVVGQlJTeHBRa0ZCVHl4TlFVRk5MRmxCUVZrN1FVRkJRU3hYUVVGWExFbEJRVWtzVTBGQlZTeFBRVUZQTzBGQlF6TkdMR05CUVVrc1ZVRkJWU3hOUVVGTkxGTkJRVk1zWjBKQlFXZENMRTFCUVUwN1FVRkRia1FzWTBGQlNTeFhRVUZYTEZGQlFWRTdRVUZEZGtJc1kwRkJTU3hYUVVGWExGZEJRVmM3UVVGRE1VSXNZMEZCU1N4cFFrRkJhVUk3UVVGRGNrSXNZMEZCU1N4VFFVRlRPMEZCUVVFc1dVRkRWQ3hOUVVGTkxFMUJRVTA3UVVGQlFTeFpRVU5hTEZsQlFWazdRVUZCUVN4alFVTlNMRTFCUVUwN1FVRkJRU3hqUVVOT0xHTkJRV003UVVGQlFTeGpRVU5rTzBGQlFVRXNZMEZEUVR0QlFVRkJMR05CUTBFN1FVRkJRU3hqUVVOQk8wRkJRVUVzWTBGRFFTeFJRVUZSTzBGQlFVRXNZMEZEVWl4WlFVRlpMR2RDUVVGblFqdEJRVUZCTzBGQlFVRXNXVUZGYUVNc1UwRkJVeXhUUVVGVExFMUJRVTBzV1VGQldTeEpRVUZKTEZOQlFWVXNWMEZCVnp0QlFVRkZMSEZDUVVGUExFMUJRVTBzVFVGQlRUdEJRVUZCTEdWQlF6ZEZMRWxCUVVrc1UwRkJWU3hQUVVGUE8wRkJRM1JDTEd0Q1FVRkpMRTlCUVU4c1RVRkJUU3hOUVVGTkxGTkJRVk1zVFVGQlRTeFJRVUZSTEdGQlFXRXNUVUZCVFN4WlFVRlpMRmRCUVZVc1RVRkJUVHRCUVVNM1JpeHJRa0ZCU1N4WlFVRlhMRkZCUVZFN1FVRkRka0lzYTBKQlFVa3NWVUZCVXp0QlFVRkJMR2RDUVVOVU8wRkJRVUVzWjBKQlEwRXNWVUZCVlR0QlFVRkJMR2RDUVVOV0xGTkJRVk03UVVGQlFTeG5Ra0ZEVkR0QlFVRkJMR2RDUVVOQk8wRkJRVUVzWjBKQlEwRXNXVUZCV1N4blFrRkJaMEk3UVVGQlFUdEJRVVZvUXl3MlFrRkJaU3huUWtGQlowSXNZVUZCV1R0QlFVTXpReXh4UWtGQlR6dEJRVUZCTzBGQlFVRXNXVUZGV0N4dFFrRkJiVUlzVTBGQlZTeFZRVUZUTzBGQlFVVXNjVUpCUVU4c1pVRkJaU3huUWtGQlowSTdRVUZCUVR0QlFVRkJPMEZCUld4R0xIbENRVUZsTEZOQlFWTXNUMEZCVHp0QlFVTXZRaXhqUVVGSkxGZEJRVmNzVFVGQlRUdEJRVU5xUWl3eVFrRkJaU3huUWtGQlowSXNXVUZCV1N4UFFVRlBPMEZCUVVFN1FVRkZkRVFzYVVKQlFVODdRVUZCUVR0QlFVRkJPMEZCUVVFc1RVRkhaaXhYUVVGWExGRkJRVThzVTBGQlV5eExRVUZOTEZsQlFWa3NUVUZCVFN4WlFVRlpMRkZCUVU4c1QwRkRiRVVzUTBGQlJTeFJRVUZQTEdOQlFXTXNaVUZCWlN4VFFVRlRMRXRCUVVzc1ZVRkJWU3hqUVVNeFJDeERRVUZETEc5Q1FVRnZRaXhMUVVGTExGVkJRVlVzWTBGRGNFTXNSMEZCUnl4UFFVRlBMRlZCUVZVc1ZVRkJWU3hOUVVGTkxHdENRVUZyUWl4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVjelJTd3lRa0ZCZVVJc1QwRkJUenRCUVVNMVFpeFJRVUZKTEUxQlFVMHNVMEZCVXp0QlFVTm1MR0ZCUVU4N1FVRkRXQ3hSUVVGSkxFMUJRVTBzVTBGQlV6dEJRVU5tTEZsQlFVMHNTVUZCU1N4TlFVRk5PMEZCUTNCQ0xGRkJRVWtzVVVGQlVTeE5RVUZOTEU5QlFVOHNVVUZCVVN4TlFVRk5MRTlCUVU4c1dVRkJXU3hOUVVGTkxGZEJRVmNzV1VGQldTeE5RVUZOTzBGQlF6ZEdMRkZCUVVrc1YwRkJWeXhWUVVGVkxGTkJRM0pDTEZWQlFWVXNVMEZEVGl4UFFVTkJMRmxCUVZrc1YwRkJWeXhQUVVGUExFTkJRVU1zUTBGQlF5eGhRVU53UXl4VlFVRlZMRk5CUTA0c1dVRkJXU3hYUVVGWExFOUJRVThzUTBGQlF5eERRVUZETEdGQlEyaERMRmxCUVZrc1RVRkJUU3hQUVVGUExFOUJRVThzUTBGQlF5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMEZCUTNaRUxGZEJRVTg3UVVGQlFUdEJRVVZZTERaQ1FVRXlRaXhoUVVGaE8wRkJRM0JETEZGQlFVa3NXVUZCV1N4WlFVRlpPMEZCUXpWQ0xHOUNRVUZuUWl4TFFVRkpPMEZCUTJoQ0xGVkJRVWtzVVVGQlVTeEpRVUZITEU5QlFVOHNUMEZCVHl4SlFVRkhMRTFCUVUwc1VVRkJUeXhKUVVGSExFMUJRVTBzVTBGQlV5eEpRVUZITEZGQlFWRXNVVUZCVVN4SlFVRkhPMEZCUTNKR0xHRkJRVThzU1VGQlNTeFJRVUZSTEZOQlFWVXNVMEZCVXl4UlFVRlJPMEZCUXpGRExHdENRVUZWTEV0QlFVczdRVUZEWml4WlFVRkpMRkZCUVZFc1RVRkJUU3haUVVGWk8wRkJRemxDTEZsQlFVa3NWMEZCVnl4TlFVRk5MRmRCUVZjN1FVRkRhRU1zV1VGQlNTeGhRVUZoTEZOQlFWTXNVMEZCVXl4VFFVRlRPMEZCUXpWRExGbEJRVWtzUTBGQlF5eGpRVUZqTEZOQlFWTXNXVUZCV1N4VFFVRlRPMEZCUXpkRExHZENRVUZOTEVsQlFVa3NUVUZCVFN3MlFrRkJOa0k3UVVGRGFrUXNXVUZCU1N4VFFVRlZMRlZCUVZFc1ZVRkJWU3hEUVVGRkxGRkJRVkVzU1VGQlN6dEJRVU12UXl4WlFVRkpMRk5CUVZFc1ZVRkJWU3hOUVVGTExGZEJRVmNzVDBGQlR5eFJRVUZSTzBGQlEycEVMR2RDUVVGTkxFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlJYQkNMRmxCUVVrc1YwRkJWenRCUVVOWUxHbENRVUZQTEZGQlFWRXNRMEZCUlN4aFFVRmhMRWRCUVVjc1ZVRkJWU3hKUVVGSkxGTkJRVk1zU1VGQlNTeFpRVUZaTzBGQlF6VkZMRmxCUVVrN1FVRkRTaXhaUVVGSkxFOUJRVTg3UVVGRFdDeFpRVUZKTEZkQlFWYzdRVUZEWml4WlFVRkpMR05CUVdNN1FVRkRiRUlzV1VGQlNTeGxRVUZsTEZOQlFWVXNUMEZCVHp0QlFVTm9ReXhaUVVGRk8wRkJRMFlzZVVKQlFXVTdRVUZCUVR0QlFVVnVRaXhaUVVGSkxGTkJRVk1zWlVGQlpUdEJRVU40UWl4alFVRkpMRTFCUVUwc1UwRkJVenRCUVVObUxHMUNRVUZQTEZGQlFWRXNRMEZCUlN4aFFVRXdRaXhWUVVGdlFpeFRRVUZUTEVsQlFVa3NXVUZCV1R0QlFVTTFSaXhqUVVGSkxFMUJRVTBzVTBGQlV6dEJRVU5tTEdsQ1FVRkxMRXRCUVVzc1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGRmRFSXNhVUpCUVVzc1MwRkJTeXhOUVVGTkxFMUJRVTBzVDBGQlR5eG5Ra0ZCWjBJN1FVRkJRU3hsUVVWb1JEdEJRVU5FTEdOQlFVa3NUVUZCU3l4aFFVTk1MRmRCUTBrc1EwRkJReXhSUVVGUkxGTkJRMVFzUTBGQlF5eFJRVUZSTEZGQlEySXNRMEZCUXl4UFFVRk5MRTlCUVU4c1VVRkJVU3hKUVVGSExFbEJRVWtzVVVGQlVTeEpRVUZITzBGQlF6VkRMR05CUVVrc1dVRkJXVHRCUVVOYUxIRkNRVUZUTEVsQlFVa3NSMEZCUnl4SlFVRkpMRkZCUVZFc1JVRkJSU3hIUVVGSE8wRkJRemRDTEcxQ1FVRkxMRXRCUVVzc1RVRkJUeXhUUVVGVExFMUJRVTBzVDBGQlR5eFRRVU51UXl4TlFVRk5MRTFCUVUwc1RVRkJUU3hKUVVGSkxFMUJRVTBzVFVGRE5VSXNUVUZCVFN4TlFVRk5MRTFCUVUwN1FVRkRkRUlzYTBKQlFVa3NWVUZCVlR0QlFVRkJPMEZCUVVFc2FVSkJSMnBDTzBGQlEwUXNjVUpCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzVVVGQlVTeEZRVUZGTEVkQlFVYzdRVUZETjBJc2JVSkJRVXNzUzBGQlN5eE5RVUZOTEUxQlFVMHNUVUZCVFN4TlFVRk5PMEZCUTJ4RExHdENRVUZKTEZWQlFWVTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkpNVUlzV1VGQlNTeFBRVUZQTEZOQlFWVXNUMEZCVHp0QlFVTjRRaXhqUVVGSkxHRkJRV0VzVFVGQlRTeFBRVUZQTzBGQlF6bENMR1ZCUVVzc1VVRkJVU3hUUVVGVkxFMUJRVXNzU1VGQlJ6dEJRVUZGTEcxQ1FVRlBMRXRCUVVrc1UwRkJVeXhSUVVGVExGVkJRVk1zVFVGQlN5eExRVUZKTzBGQlFVRTdRVUZEYUVZc2EwSkJRVkU3UVVGQlFTeFpRVU5LTzBGQlFVRXNXVUZEUVR0QlFVRkJMRmxCUTBFc1UwRkJVeXhUUVVGVExGZEJRVmNzVVVGQlR5eExRVUZMTEVsQlFVa3NVMEZCVlN4TlFVRkxPMEZCUVVVc2NVSkJRVThzUzBGQlNUdEJRVUZCTzBGQlFVRXNXVUZEZWtVN1FVRkJRVHRCUVVGQk8wRkJSMUlzV1VGQlNTeFZRVUZWTEZOQlFWVXNUMEZCVHp0QlFVTXpRaXgxUWtGQllUdEJRVU5pTEdWQlFVczdRVUZCUVR0QlFVVlVMRmxCUVVrc1dVRkJXVHRCUVVGQk8wRkJRVUU3UVVGSGVFSXNlVUpCUVc5Q0xFdEJRVWs3UVVGRGNFSXNWVUZCU1N4UlFVRlJMRWxCUVVjc1QwRkJUeXhUUVVGVExFbEJRVWNzVVVGQlVTeFRRVUZSTEVsQlFVY3NUMEZCVHl4VlFVRlZMRWxCUVVjc1UwRkJVeXhUUVVGVExFbEJRVWM3UVVGRE9VWXNZVUZCVHl4SlFVRkpMRkZCUVZFc1UwRkJWU3hUUVVGVExGRkJRVkU3UVVGRE1VTXNhMEpCUVZVc1MwRkJTenRCUVVObUxGbEJRVWtzVVVGQlVTeFBRVUZOTEU5QlFVOHNVVUZCVVN4UFFVRk5PMEZCUTNaRExGbEJRVWtzVVVGQlVTeE5RVUZOTEZsQlFWazdRVUZET1VJc1dVRkJTU3hUUVVGVExFMUJRVTBzWlVGRFppeFJRVU5CTEUxQlFVMHNUVUZCVFN4TlFVRk5PMEZCUTNSQ0xGbEJRVWtzV1VGQldTeFZRVU5hTEZOQlEwa3NaVUZEUVN4VFFVTktMRk5CUTBrc1pVRkRRVHRCUVVOU0xGbEJRVWtzVFVGQlRTeFZRVUZWTEVOQlFVVXNiMEpCUVcxQ0xGVkJRM0pETEU5QlFVOHNWMEZCVnl4blFrRkJaMElzVVVGQlVTeGhRVU14UXl4UFFVRlBMR05CUVdNc1owSkJRV2RDTEZGQlFWRTdRVUZEYWtRc1dVRkJTU3hWUVVGVkxHMUNRVUZ0UWp0QlFVTnFReXhaUVVGSkxGbEJRVmtzUzBGQlN5eFRRVUZWTEVsQlFVazdRVUZETDBJc1kwRkJTU3hUUVVGVExFbEJRVWs3UVVGRGFrSXNZMEZCU1N4RFFVRkRMRkZCUVZFN1FVRkRWQ3h2UWtGQlVUdEJRVU5TTzBGQlFVRTdRVUZGU2l4cFFrRkJUeXhSUVVGUkxFVkJRVVU3UVVGRGFrSXNhVUpCUVU4c1QwRkJUenRCUVVOa0xHTkJRVWtzYTBKQlFXdENMRTlCUVU4c1UwRkJVeXhMUVVGTE8wRkJRek5ETEdOQlFVa3NORUpCUVRSQ0xFOUJRVTg3UVVGRGRrTXNZMEZCU1R0QlFVTkJMSGREUVVFMFFpd3dRa0ZCTUVJc1MwRkJTenRCUVVNdlJDeGpRVUZKTEdsQ1FVRnBRaXhQUVVGUExGRkJRVkVzUzBGQlN6dEJRVU42UXl4alFVRkpMRFJDUVVFMFFpeFhRVUZaTzBGQlFVVXNhMEpCUVUwc1NVRkJTU3hOUVVGTk8wRkJRVUU3UVVGRE9VUXNZMEZCU1N4NVFrRkJlVUlzVjBGQldUdEJRVUZGTEd0Q1FVRk5MRWxCUVVrc1RVRkJUVHRCUVVGQk8wRkJRek5FTEdsQ1FVRlBMRkZCUVZFN1FVRkRaaXhwUWtGQlR5eFBRVUZQTEU5QlFVOHNWMEZCVnl4UFFVRlBMSEZDUVVGeFFpeFBRVUZQTEZWQlFWVTdRVUZETjBVc2FVSkJRVThzVDBGQlR5eExRVUZMTzBGQlEyNUNMR2xDUVVGUExFOUJRVThzVjBGQldUdEJRVU4wUWl4blFrRkJTU3hSUVVGUk8wRkJRMW9zWjBKQlFVa3NVMEZCVXp0QlFVTmlMRzFDUVVGUExFdEJRVXNzVFVGQlRTeFhRVUZaTzBGQlFVVXNjVUpCUVU4c1YwRkJWeXhOUVVGTkxHRkJRV0VzVFVGQlRUdEJRVUZCTEdWQlFWY3NTMEZCU3l4WFFVRlpPMEZCUVVVc2NVSkJRVTg3UVVGQlFUdEJRVUZCTzBGQlJYQklMR2xDUVVGUExGRkJRVkVzVTBGQlZTeFZRVUZWTzBGQlF5OUNMR2RDUVVGSkxHMUNRVUZ0UWl4SlFVRkpMRkZCUVZFc1UwRkJWU3hyUWtGQmEwSXNhVUpCUVdsQ08wRkJRelZGTEdsRFFVRnRRaXhMUVVGTE8wRkJRM2hDTEd0Q1FVRkpMRlZCUVZVc2JVSkJRVzFDTzBGQlEycERMSEZDUVVGUExFOUJRVTg3UVVGRFpDeHhRa0ZCVHl4UFFVRlBMRk5CUVZVc1QwRkJUenRCUVVNelFpeDFRa0ZCVHl4UFFVRlBMRTlCUVU4c1YwRkJWeXhQUVVGUExIRkNRVUZ4UWl4UFFVRlBMRlZCUVZVN1FVRkROMFVzYVVOQlFXbENPMEZCUVVFN1FVRkJRVHRCUVVkNlFpeG5Ra0ZCU1N4clFrRkJhMElzVjBGQldUdEJRVU01UWl4clFrRkJTU3hKUVVGSkxGRkJRVkU3UVVGRFdpeHZRa0ZCU1R0QlFVTkJPMEZCUVVFc2VVSkJSVWNzUzBGQlVEdEJRVU5KTEhsQ1FVRlBMRXRCUVVzN1FVRkJRVHRCUVVGQkxIRkNRVWRtTzBGQlEwUXNkVUpCUVU4c1QwRkJUenRCUVVOa0xIVkNRVUZQTEZGQlFWRXNWMEZCV1R0QlFVRkZMSGRDUVVGTkxFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlF6ZERMSFZDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWRtTEdkQ1FVRkpMRmxCUVZrc1MwRkJTeXhUUVVGVkxFdEJRVWs3UVVGREwwSXNhMEpCUVVrc1dVRkJXVHRCUVVOb1FqdEJRVUZCTzBGQlJVb3NiVUpCUVU4c1YwRkJWenRCUVVOc1FpeHRRa0ZCVHl4eFFrRkJjVUk3UVVGRE5VSXNiVUpCUVU4c1ZVRkJWVHRCUVVOcVFqdEJRVU5CTEcxQ1FVRlBPMEZCUVVFN1FVRkZXQ3hyUWtGQlVUdEJRVUZCTEZkQlExUTdRVUZCUVR0QlFVRkJPMEZCUjFnc2JVSkJRV1VzV1VGQlZ6dEJRVU4wUWl4aFFVRlBMRk5CUVZVc1UwRkJVenRCUVVOMFFpeGxRVUZQTEVsQlFVa3NVVUZCVVN4VFFVRlZMRk5CUVZNc1VVRkJVVHRCUVVNeFF5eHZRa0ZCVlN4TFFVRkxPMEZCUTJZc1kwRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eFRRVUZUTEZGQlFWRXNVVUZCVVN4UlFVRlJMRkZCUVZFc1QwRkJUeXhUUVVGUkxGRkJRVkU3UVVGRE0wWXNZMEZCU1N4clFrRkJhMElzVlVGQlZTeFhRVUZYTEZOQlFWazdRVUZEZGtRc1kwRkJTU3hSUVVGUkxFOUJRVTBzVDBGQlR5eFJRVUZSTEU5QlFVMDdRVUZEZGtNc1kwRkJTU3hSUVVGUkxFMUJRVTBzV1VGQldUdEJRVU01UWl4alFVRkpMRk5CUVZNc1RVRkJUU3hsUVVGbExGRkJRVkVzVFVGQlRTeE5RVUZOTEUxQlFVMDdRVUZETlVRc1kwRkJTU3hqUVVGakxHZENRVUZuUWp0QlFVTnNReXhqUVVGSkxGVkJRVlU3UVVGRFZpeHRRa0ZCVHl4UlFVRlJMRU5CUVVVc1VVRkJVVHRCUVVNM1FpeGpRVUZKTEZsQlFWYzdRVUZEV0N4blFrRkJTU3hOUVVGTkxGTkJRMDRzVDBGQlR5eFBRVUZQTEdGQlFXRXNiVUpCUXpOQ0xFOUJRVThzVjBGQlZ5eGhRVUZoTzBGQlEyNURMR2RDUVVGSkxGbEJRVmtzVTBGQlZTeFBRVUZQTzBGQlFVVXNjVUpCUVU4c1VVRkJVU3hEUVVGRkxGRkJRVkVzVFVGQlRTeFBRVUZQTzBGQlFVRTdRVUZEZWtVc1owSkJRVWtzVlVGQlZTeHRRa0ZCYlVJN1FVRkJRU3hwUWtGRmFFTTdRVUZEUkN4blFrRkJTU3hWUVVGVk8wRkJRMlFzWjBKQlFVa3NVVUZCVVN4VlFVRlZMRU5CUVVVc2IwSkJRVzFDTEZWQlEzWkRMRTlCUVU4c1YwRkJWeXhsUVVOc1FpeFBRVUZQTEdOQlFXTTdRVUZEZWtJc1owSkJRVWtzVjBGQlZ6dEJRVU5tTEd0Q1FVRk5MRmxCUVZrc1UwRkJWU3hQUVVGUE8wRkJReTlDTEd0Q1FVRkpMRk5CUVZNc1RVRkJUVHRCUVVOdVFpeHJRa0ZCU1N4RFFVRkRPMEZCUTBRc2RVSkJRVThzVVVGQlVTeERRVUZGTEZGQlFWRTdRVUZETjBJc2RVSkJRVk1zUzBGQlN5eFRRVUZUTEU5QlFVOHNVVUZCVVN4UFFVRlBPMEZCUXpkRExHdENRVUZKTEVWQlFVVXNXVUZCV1R0QlFVTmtMSFZDUVVGUExGRkJRVkVzUTBGQlJTeFJRVUZSTzBGQlF6ZENMSEZDUVVGUE8wRkJRVUU3UVVGRldDeHJRa0ZCVFN4VlFVRlZMRzFDUVVGdFFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUzI1RUxGZEJRVTg3UVVGQlFTeE5RVU5JTEUxQlFVMDdRVUZCUVN4TlFVTk9MRkZCUVZFN1FVRkJRU3hOUVVOU08wRkJRVUVzVFVGRFFTeFRRVUZUTEZOQlFWVXNTMEZCU1R0QlFVTnVRaXhaUVVGSkxGRkJRVkVzU1VGQlJ5eFBRVUZQTEZGQlFVOHNTVUZCUnp0QlFVTm9ReXhsUVVGUExFbEJRVWtzVVVGQlVTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXhReXh2UWtGQlZTeExRVUZMTzBGQlEyWXNZMEZCU1N4UlFVRlJMRTFCUVUwc1dVRkJXVHRCUVVNNVFpeGpRVUZKTEZOQlFWTXNUVUZCU3p0QlFVTnNRaXhqUVVGSkxGTkJRVk1zU1VGQlNTeE5RVUZOTzBGQlEzWkNMR05CUVVrc1YwRkJWenRCUVVObUxHTkJRVWtzWjBKQlFXZENPMEZCUTNCQ0xHTkJRVWs3UVVGRFNpeGpRVUZKTEdsQ1FVRnBRaXhUUVVGVkxFOUJRVTg3UVVGRGJFTXNaMEpCUVVrc1QwRkJUU3hOUVVGTk8wRkJRMmhDTEdkQ1FVRkxMRkZCUVU4c1MwRkJTU3hSUVVGUkxFdEJRVWtzVjBGQlZ6dEJRVU51UXp0QlFVTktMR2RDUVVGSkxFVkJRVVVzYTBKQlFXdENPMEZCUTNCQ0xITkNRVUZSTzBGQlFVRTdRVUZGYUVJc1kwRkJTU3hsUVVGbExHMUNRVUZ0UWp0QlFVTjBReXh0UWtGQlV5eEpRVUZKTEVkQlFVY3NTVUZCU1N4UlFVRlJMRVZCUVVVc1IwRkJSenRCUVVNM1FpeG5Ra0ZCU1N4TlFVRk5MRTFCUVVzN1FVRkRaaXhuUWtGQlNTeFBRVUZQTEUxQlFVMDdRVUZEWWl4dlFrRkJUU3hOUVVGTkxFbEJRVWtzVFVGQlN6dEJRVU55UWl4clFrRkJTU3hQUVVGUE8wRkJRMWdzYTBKQlFVa3NXVUZCV1R0QlFVTm9RaXhyUWtGQlNTeFZRVUZWTzBGQlEyUXNaMEpCUVVVN1FVRkJRVHRCUVVGQk8wRkJSMVlzWTBGQlNTeGhRVUZoTzBGQlEySXNiMEpCUVZFN1FVRkJRVHRCUVVGQk8wRkJRVUVzVFVGSGNFSXNTMEZCU3l4VFFVRlZMRXRCUVVrN1FVRkRaaXhaUVVGSkxGRkJRVkVzU1VGQlJ5eFBRVUZQTEUxQlFVMHNTVUZCUnp0QlFVTXZRaXhsUVVGUExFbEJRVWtzVVVGQlVTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTXhReXh2UWtGQlZTeExRVUZMTzBGQlEyWXNZMEZCU1N4UlFVRlJMRTFCUVUwc1dVRkJXVHRCUVVNNVFpeGpRVUZKTEUxQlFVMHNUVUZCVFN4SlFVRkpPMEZCUTNCQ0xHTkJRVWtzV1VGQldTeFRRVUZWTEU5QlFVODdRVUZCUlN4dFFrRkJUeXhSUVVGUkxFMUJRVTBzVDBGQlR6dEJRVUZCTzBGQlF5OUVMR05CUVVrc1ZVRkJWU3h0UWtGQmJVSTdRVUZCUVR0QlFVRkJPMEZCUVVFc1RVRkhla01zVDBGQlR5eE5RVUZOTzBGQlFVRXNUVUZEWWl4WlFVRlpPMEZCUVVFc1RVRkRXaXhQUVVGUExGTkJRVlVzUzBGQlNUdEJRVU5xUWl4WlFVRkpMRk5CUVZFc1NVRkJSeXhQUVVGUExGRkJRVkVzU1VGQlJ6dEJRVU5xUXl4WlFVRkpMRkZCUVZFc1QwRkJUU3hQUVVGUExGRkJRVkVzVDBGQlRUdEJRVU4yUXl4bFFVRlBMRWxCUVVrc1VVRkJVU3hUUVVGVkxGTkJRVk1zVVVGQlVUdEJRVU14UXl4alFVRkpMRkZCUVZFc1RVRkJUU3haUVVGWk8wRkJRemxDTEdOQlFVa3NVMEZCVXl4TlFVRk5MR1ZCUVdVc1VVRkJVU3hOUVVGTkxFMUJRVTBzVFVGQlRUdEJRVU0xUkN4alFVRkpMR05CUVdNc1owSkJRV2RDTzBGQlEyeERMR05CUVVrc1RVRkJUU3hqUVVGakxFOUJRVThzVFVGQlRTeGxRVUZsTEU5QlFVODdRVUZETTBRc1kwRkJTU3haUVVGWkxFdEJRVXNzVTBGQlZTeEpRVUZKTzBGQlFVVXNiVUpCUVU4c1VVRkJVU3hIUVVGSExFOUJRVTg3UVVGQlFUdEJRVU01UkN4alFVRkpMRlZCUVZVc2JVSkJRVzFDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxha1FzVFVGQlNTeE5RVUZMTEdOQlFXTXNTVUZCU1N4WFFVRlhMRk5CUVZNc1NVRkJSeXhSUVVGUkxGbEJRVmtzU1VGQlJ6dEJRVU42UlN4TlFVRkpMRk5CUVZNc1QwRkJUeXhQUVVGUExFbEJRVWtzVTBGQlZTeGhRVUZoTzBGQlFVVXNWMEZCVHl4clFrRkJhMEk3UVVGQlFUdEJRVU5xUml4TlFVRkpMRmRCUVZjN1FVRkRaaXhUUVVGUExGRkJRVkVzVTBGQlZTeFBRVUZQTzBGQlFVVXNWMEZCVHl4VFFVRlRMRTFCUVUwc1VVRkJVVHRCUVVGQk8wRkJRMmhGTEZOQlFVODdRVUZCUVN4SlFVTklMRTlCUVU4N1FVRkJRU3hKUVVOUUxHRkJRV0VzUjBGQlJ5eFpRVUZaTEV0QlFVczdRVUZCUVN4SlFVTnFReXhQUVVGUExGTkJRVlVzVFVGQlRUdEJRVU51UWl4VlFVRkpMRk5CUVZNc1UwRkJVenRCUVVOMFFpeFZRVUZKTEVOQlFVTTdRVUZEUkN4alFVRk5MRWxCUVVrc1RVRkJUU3haUVVGWkxFOUJRVTg3UVVGRGRrTXNZVUZCVHl4VFFVRlRPMEZCUVVFN1FVRkJRU3hKUVVWd1FpeExRVUZMTzBGQlFVRXNTVUZEVEN4VFFVRlRPMEZCUVVFc1NVRkRWQ3hUUVVGVExGVkJRVlU3UVVGQlFTeEpRVU51UWp0QlFVRkJPMEZCUVVFN1FVRkpVaXdyUWtGQkswSXNWMEZCVnl4aFFVRmhPMEZCUTI1RUxGTkJRVThzV1VGQldTeFBRVUZQTEZOQlFWVXNUVUZCVFN4TFFVRkpPMEZCUXpGRExGRkJRVWtzVTBGQlV5eEpRVUZITzBGQlEyaENMRmRCUVZFc1UwRkJVeXhUUVVGVExFbEJRVWtzVDBGQlR5eFBRVUZQTzBGQlFVRXNTMEZETjBNN1FVRkJRVHRCUVVWUUxHZERRVUZuUXl4aFFVRmhMRTlCUVU4c1MwRkJTU3hWUVVGVk8wRkJRemxFTEUxQlFVa3NZMEZCWXl4SlFVRkhMR0ZCUVdFc1dVRkJXU3hKUVVGSE8wRkJRMnBFTEUxQlFVa3NVMEZCVXl4elFrRkJjMElzWVVGQllTeFBRVUZQTEZkQlFWY3NZVUZCWVN4WFFVRlhMRmxCUVZrN1FVRkRkRWNzVTBGQlR6dEJRVUZCTEVsQlEwZzdRVUZCUVR0QlFVRkJPMEZCUjFJc2EwTkJRV3RETEVsQlFVa3NWVUZCVlR0QlFVTTFReXhOUVVGSkxGRkJRVkVzVTBGQlV6dEJRVU55UWl4TlFVRkpMRk5CUVZNc2RVSkJRWFZDTEVkQlFVY3NZMEZCWXl4UFFVRlBMRWRCUVVjc1QwRkJUenRCUVVOMFJTeExRVUZITEU5QlFVOHNUMEZCVHp0QlFVTnFRaXhMUVVGSExFOUJRVThzVVVGQlVTeFRRVUZWTEU5QlFVODdRVUZETDBJc1VVRkJTU3haUVVGWkxFMUJRVTA3UVVGRGRFSXNVVUZCU1N4SFFVRkhMRXRCUVVzc1QwRkJUeXhQUVVGUExFdEJRVXNzVTBGQlZTeExRVUZMTzBGQlFVVXNZVUZCVHl4SlFVRkpMRk5CUVZNN1FVRkJRU3hSUVVGbE8wRkJReTlGTEZsQlFVMHNUMEZCVHl4SFFVRkhMRXRCUVVzc1RVRkJUVHRCUVVNelFpeFZRVUZKTEVkQlFVY3NjMEpCUVhOQ0xFZEJRVWNzVDBGQlR6dEJRVU51UXl4WFFVRkhMRmRCUVZjc1QwRkJUeXhOUVVGTk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZOTTBNc2RVSkJRWFZDTEVsQlFVa3NUVUZCVFN4WlFVRlpMRlZCUVZVN1FVRkRia1FzWVVGQlZ5eFJRVUZSTEZOQlFWVXNWMEZCVnp0QlFVTndReXhSUVVGSkxGTkJRVk1zVTBGQlV6dEJRVU4wUWl4VFFVRkxMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRM2hDTEZWQlFVa3NWMEZCVnl4elFrRkJjMElzUzBGQlN6dEJRVU14UXl4VlFVRkpMRU5CUVVNc1dVRkJZU3hYUVVGWExGbEJRVmtzVTBGQlV5eFZRVUZWTEZGQlFWazdRVUZEY0VVc1dVRkJTU3hSUVVGUkxFZEJRVWNzV1VGQldTeGhRVUZoTEdWQlFXVXNSMEZCUnl4aFFVRmhPMEZCUTI1RkxHdENRVUZSTEV0QlFVc3NWMEZCVnp0QlFVRkJMRmxCUTNCQ0xFdEJRVXNzVjBGQldUdEJRVUZGTEhGQ1FVRlBMRXRCUVVzc1RVRkJUVHRCUVVGQk8wRkJRVUVzV1VGRGNrTXNTMEZCU3l4VFFVRlZMRTlCUVU4N1FVRkRiRUlzTmtKQlFXVXNUVUZCVFN4WFFVRlhMRU5CUVVVc1QwRkJZeXhWUVVGVkxFMUJRVTBzWTBGQll5eE5RVUZOTEZsQlFWazdRVUZCUVR0QlFVRkJPMEZCUVVFc1pVRkpka2M3UVVGRFJDeGpRVUZKTEdGQlFXRXNTVUZCU1N4SFFVRkhMRTFCUVUwc1YwRkJWenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZOTjBRc2VVSkJRWGxDTEVsQlFVa3NUVUZCVFR0QlFVTXZRaXhQUVVGTExGRkJRVkVzVTBGQlZTeExRVUZMTzBGQlEzaENMR0ZCUVZNc1QwRkJUeXhMUVVGTE8wRkJRMnBDTEZWQlFVa3NTVUZCU1N4blFrRkJaMElzUjBGQlJ6dEJRVU4yUWl4bFFVRlBMRWxCUVVrN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSk0wSXNNa0pCUVRKQ0xFZEJRVWNzUjBGQlJ6dEJRVU0zUWl4VFFVRlBMRVZCUVVVc1MwRkJTeXhWUVVGVkxFVkJRVVVzUzBGQlN6dEJRVUZCTzBGQlJXNURMSE5DUVVGelFpeEpRVUZKTEZsQlFWa3NhVUpCUVdsQ0xGRkJRVkU3UVVGRE0wUXNUVUZCU1N4bFFVRmxMRWRCUVVjN1FVRkRkRUlzVFVGQlNTeFJRVUZSTEVkQlFVY3NiVUpCUVcxQ0xHRkJRV0VzUjBGQlJ5eGhRVUZoTzBGQlF5OUVMRkZCUVUwc1QwRkJUenRCUVVOaUxGRkJRVTBzV1VGQldTeE5RVUZOTzBGQlEzaENMRTFCUVVrc2IwSkJRVzlDTEUxQlFVMHNVVUZCVVN4TFFVRkxPMEZCUXpORExFMUJRVWtzV1VGQldTeEpRVUZKTEdGQlFXRTdRVUZEYWtNc1YwRkJVeXhYUVVGWk8wRkJRMnBDTEZGQlFVa3NVVUZCVVR0QlFVTmFMRkZCUVVrc1dVRkJXVHRCUVVOb1FpeFJRVUZKTEdWQlFXVXNSMEZCUnp0QlFVTnNRaXhYUVVGTExHTkJRV01zVVVGQlVTeFRRVUZWTEZkQlFWYzdRVUZETlVNc2IwSkJRVmtzYVVKQlFXbENMRmRCUVZjc1lVRkJZU3hYUVVGWExGTkJRVk1zWVVGQllTeFhRVUZYTzBGQlFVRTdRVUZGY2tjc0swSkJRWGxDTEVsQlFVazdRVUZETjBJc2JVSkJRV0VzVDBGQlR5eFhRVUZaTzBGQlFVVXNaVUZCVHl4SFFVRkhMRWRCUVVjc1UwRkJVeXhMUVVGTE8wRkJRVUVzVTBGQlZ5eE5RVUZOTzBGQlFVRTdRVUZIT1VVc05rSkJRWFZDTEVsQlFVa3NXVUZCV1N4UFFVRlBMR2xDUVVGcFFpeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVZHFSaXhuUTBGQlowTXNTVUZCU1N4WlFVRlpMRTlCUVU4c2FVSkJRV2xDTzBGQlEzQkZMRTFCUVVrc1VVRkJVVHRCUVVOYUxFMUJRVWtzVjBGQlZ5eEhRVUZITzBGQlEyeENMRTFCUVVrc1pVRkJaU3hIUVVGSExGbEJRVmtzYTBKQlFXdENMRWxCUVVrc1IwRkJSeXhQUVVGUE8wRkJRMnhGTEUxQlFVa3NNa0pCUVRKQ08wRkJReTlDTEUxQlFVa3NXVUZCV1N4VFFVRlRMRTlCUVU4c1UwRkJWU3hIUVVGSE8wRkJRVVVzVjBGQlR5eEZRVUZGTEV0QlFVc3NWMEZCVnp0QlFVRkJPMEZCUTNoRkxGbEJRVlVzVVVGQlVTeFRRVUZWTEZOQlFWTTdRVUZEYWtNc1ZVRkJUU3hMUVVGTExGZEJRVms3UVVGRGJrSXNWVUZCU1N4WlFVRlpPMEZCUTJoQ0xGVkJRVWtzV1VGQldTeFJRVUZSTEV0QlFVczdRVUZETjBJc2FVTkJRVEpDTEVsQlFVa3NWMEZCVnp0QlFVTXhReXhwUTBGQk1rSXNTVUZCU1N4WFFVRlhPMEZCUXpGRExIRkNRVUZsTEVkQlFVY3NXVUZCV1R0QlFVTTVRaXhWUVVGSkxFOUJRVThzWTBGQll5eFhRVUZYTzBGQlEzQkRMRmRCUVVzc1NVRkJTU3hSUVVGUkxGTkJRVlVzVDBGQlR6dEJRVU01UWl4dlFrRkJXU3hwUWtGQmFVSXNUVUZCVFN4SlFVRkpMRTFCUVUwc1IwRkJSeXhUUVVGVExFMUJRVTBzUjBGQlJ6dEJRVUZCTzBGQlJYUkZMRmRCUVVzc1QwRkJUeXhSUVVGUkxGTkJRVlVzVVVGQlVUdEJRVU5zUXl4WlFVRkpMRTlCUVU4c1ZVRkJWVHRCUVVOcVFpeG5Ra0ZCVFN4SlFVRkpMRmRCUVZjc1VVRkJVVHRCUVVGQkxHVkJSVFZDTzBGQlEwUXNZMEZCU1N4VlFVRlZMR2RDUVVGblFpeFpRVUZaTEU5QlFVODdRVUZEYWtRc2FVSkJRVThzU1VGQlNTeFJRVUZSTEZOQlFWVXNTMEZCU3p0QlFVRkZMRzFDUVVGUExGTkJRVk1zVTBGQlV6dEJRVUZCTzBGQlF6ZEVMR2xDUVVGUExFOUJRVThzVVVGQlVTeFRRVUZWTEV0QlFVczdRVUZEYWtNc2IwSkJRVkVzV1VGQldTeEpRVUZKTzBGQlEzaENMSEZDUVVGVExGTkJRVk03UVVGQlFUdEJRVVYwUWl4cFFrRkJUeXhKUVVGSkxGRkJRVkVzVTBGQlZTeFRRVUZUTzBGQlFVVXNiVUpCUVU4c1VVRkJVU3haUVVGWk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlJ6TkZMRlZCUVVrc2FVSkJRV2xDTEZGQlFWRXNTMEZCU3p0QlFVTnNReXhWUVVGSkxHdENRVUZyUWl4UlFVRlJMRXRCUVVzc1ZVRkJWU3haUVVGWk8wRkJRM0pFTEdsRFFVRjVRaXhKUVVGSk8wRkJRemRDTEdOQlFVMHNhMEpCUVd0Q08wRkJRM2hDTEcxRFFVRXlRanRCUVVNelFpeFpRVUZKTEd0Q1FVRnJRaXhoUVVGaE8wRkJRMjVETEdGQlFVc3NTVUZCU1N4UlFVRlJMRk5CUVZVc1QwRkJUenRCUVVNNVFpd3dRa0ZCWjBJc1UwRkJVeXhWUVVGVk8wRkJRVUU3UVVGRmRrTXNkMEpCUVdkQ0xFbEJRVWtzUTBGQlF5eEhRVUZITEZsQlFWazdRVUZEY0VNc2MwSkJRV01zU1VGQlNTeERRVUZETEVkQlFVY3NXVUZCV1N4WlFVRlpMRXRCUVVzc2EwSkJRV3RDTzBGQlEzSkZMR05CUVUwc1UwRkJVenRCUVVObUxGbEJRVWtzTUVKQlFUQkNMR2RDUVVGblFqdEJRVU01UXl4WlFVRkpMSGxDUVVGNVFqdEJRVU42UWp0QlFVRkJPMEZCUlVvc1dVRkJTVHRCUVVOS0xGbEJRVWtzYTBKQlFXdENMR0ZCUVdFc1QwRkJUeXhYUVVGWk8wRkJRMnhFTERCQ1FVRm5RaXhsUVVGbE8wRkJReTlDTEdOQlFVa3NaVUZCWlR0QlFVTm1MR2RDUVVGSkxIbENRVUY1UWp0QlFVTjZRaXhyUWtGQlNTeGpRVUZqTEhkQ1FVRjNRaXhMUVVGTExFMUJRVTA3UVVGRGNrUXNORUpCUVdNc1MwRkJTeXhoUVVGaE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlNUVkRMR1ZCUVZFc2FVSkJRV2xDTEU5QlFVOHNZMEZCWXl4VFFVRlRMR0ZCUTI1RUxHRkJRV0VzVVVGQlVTeHBRa0ZCYVVJc1owSkJRV2RDTEV0QlFVc3NWMEZCV1R0QlFVRkZMR2xDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlJ6VkdMRlZCUVUwc1MwRkJTeXhUUVVGVkxGVkJRVlU3UVVGRE0wSXNWVUZCU1N4RFFVRkRMRFJDUVVFMFFpeERRVUZETERKQ1FVRXlRanRCUVVONlJDeFpRVUZKTEZsQlFWa3NVVUZCVVN4TFFVRkxPMEZCUXpkQ0xEUkNRVUZ2UWl4WFFVRlhPMEZCUVVFN1FVRkZia01zYzBKQlFXZENMRWxCUVVrc1EwRkJReXhIUVVGSExGbEJRVms3UVVGRGNFTXNiMEpCUVdNc1NVRkJTU3hEUVVGRExFZEJRVWNzV1VGQldTeFpRVUZaTEVkQlFVY3NZVUZCWVN4SFFVRkhPMEZCUTJwRkxGbEJRVTBzVTBGQlV5eEhRVUZITzBGQlFVRTdRVUZCUVR0QlFVY3hRaXh6UWtGQmIwSTdRVUZEYUVJc1YwRkJUeXhOUVVGTkxGTkJRVk1zWVVGQllTeFJRVUZSTEUxQlFVMHNVVUZCVVN4TlFVRk5MRmRCUVZjc1MwRkJTeXhaUVVNelJTeGhRVUZoTzBGQlFVRTdRVUZGY2tJc1UwRkJUeXhYUVVGWExFdEJRVXNzVjBGQldUdEJRVU12UWl4M1FrRkJiMElzWTBGQll6dEJRVUZCTzBGQlFVRTdRVUZITVVNc2RVSkJRWFZDTEZkQlFWY3NWMEZCVnp0QlFVTjZReXhOUVVGSkxFOUJRVTg3UVVGQlFTeEpRVU5RTEV0QlFVczdRVUZCUVN4SlFVTk1MRXRCUVVzN1FVRkJRU3hKUVVOTUxGRkJRVkU3UVVGQlFUdEJRVVZhTEUxQlFVazdRVUZEU2l4UFFVRkxMRk5CUVZNc1YwRkJWenRCUVVOeVFpeFJRVUZKTEVOQlFVTXNWVUZCVlR0QlFVTllMRmRCUVVzc1NVRkJTU3hMUVVGTE8wRkJRVUU3UVVGRmRFSXNUMEZCU3l4VFFVRlRMRmRCUVZjN1FVRkRja0lzVVVGQlNTeFRRVUZUTEZWQlFWVXNVVUZCVVN4VFFVRlRMRlZCUVZVN1FVRkRiRVFzVVVGQlNTeERRVUZETEZGQlFWRTdRVUZEVkN4WFFVRkxMRWxCUVVrc1MwRkJTeXhEUVVGRExFOUJRVTg3UVVGQlFTeFhRVVZ5UWp0QlFVTkVMRlZCUVVrc1UwRkJVenRCUVVGQkxGRkJRMVFzVFVGQlRUdEJRVUZCTEZGQlEwNHNTMEZCU3p0QlFVRkJMRkZCUTB3c1ZVRkJWVHRCUVVGQkxGRkJRMVlzUzBGQlN6dEJRVUZCTEZGQlEwd3NTMEZCU3p0QlFVRkJMRkZCUTB3c1VVRkJVVHRCUVVGQk8wRkJSVm9zVlVGRFFTeExRVUZOTEZGQlFVOHNVVUZCVVN4WFFVRlhMRkZCUVZVc1MwRkJUU3hSUVVGUExGRkJRVkVzVjBGQlZ5eFBRVU55UlN4UFFVRlBMRkZCUVZFc1UwRkJVeXhQUVVGUExGRkJRVkVzVVVGQlVTeERRVUZETEZsQlEzQkVPMEZCUTBjc1pVRkJUeXhYUVVGWE8wRkJRMnhDTEdGQlFVc3NUMEZCVHl4TFFVRkxPMEZCUVVFc1lVRkZhRUk3UVVGRFJDeFpRVUZKTEdGQlFXRXNUMEZCVHp0QlFVTjRRaXhaUVVGSkxHRkJRV0VzVDBGQlR6dEJRVU40UWl4WlFVRkpMRlZCUVZVN1FVRkRaQ3hoUVVGTExGZEJRVmNzV1VGQldUdEJRVU40UWl4alFVRkpMRU5CUVVNc1YwRkJWenRCUVVOYUxHMUNRVUZQTEVsQlFVa3NTMEZCU3p0QlFVRkJPMEZCUlhoQ0xHRkJRVXNzVjBGQlZ5eFpRVUZaTzBGQlEzaENMR05CUVVrc1UwRkJVeXhYUVVGWExGVkJRVlVzVTBGQlV5eFhRVUZYTzBGQlEzUkVMR05CUVVrc1EwRkJRenRCUVVORUxHMUNRVUZQTEVsQlFVa3NTMEZCU3p0QlFVRkJMRzFDUVVOWUxFOUJRVThzVVVGQlVTeFBRVUZQTzBGQlF6TkNMRzFDUVVGUExFOUJRVThzUzBGQlN6dEJRVUZCTzBGQlJUTkNMRmxCUVVrc1QwRkJUeXhKUVVGSkxGTkJRVk1zUzBGQlN5eFBRVUZQTEVsQlFVa3NVMEZCVXl4TFFVRkxMRTlCUVU4c1QwRkJUeXhUUVVGVExFZEJRVWM3UVVGRE5VVXNaVUZCU3l4UFFVRlBMRXRCUVVzN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXRxUXl4VFFVRlBPMEZCUVVFN1FVRkZXQ3h4UWtGQmNVSXNWVUZCVlN4WFFVRlhMRk5CUVZNc1UwRkJVenRCUVVONFJDeE5RVUZKTEZGQlFWRXNVMEZCVXl4SFFVRkhMR3RDUVVGclFpeFhRVUZYTEZGQlFWRXNWVUZEZWtRc1EwRkJSU3hUUVVGVExGRkJRVkVzVTBGQlV5eGxRVUZsTEZGQlFWRXNVVUZEYmtRc1EwRkJSU3hsUVVGbExGRkJRVkU3UVVGRE4wSXNWVUZCVVN4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVGRkxGZEJRVThzVTBGQlV5eFBRVUZQTzBGQlFVRTdRVUZEZUVRc1UwRkJUenRCUVVGQk8wRkJSVmdzTmtKQlFUWkNMRmRCUVZjc1ZVRkJWVHRCUVVNNVF5eFBRVUZMTEZkQlFWY3NVVUZCVVN4VFFVRlZMRmRCUVZjN1FVRkRla01zVVVGQlNTeERRVUZETEZOQlFWTXNSMEZCUnl4cFFrRkJhVUlzVTBGQlV5eFpRVUZaTzBGQlEyNUVMR3RDUVVGWkxGVkJRVlVzVjBGQlZ5eFZRVUZWTEZkQlFWY3NVMEZCVXl4VlFVRlZMRmRCUVZjN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSmFFY3NOa0pCUVRaQ0xGZEJRVmNzVlVGQlZUdEJRVU01UXl4WFFVRlRMRWxCUVVrc1IwRkJSeXhKUVVGSkxGTkJRVk1zUjBGQlJ5eHBRa0ZCYVVJc1VVRkJVU3hGUVVGRkxFZEJRVWM3UVVGRE1VUXNVVUZCU1N4WlFVRlpMRk5CUVZNc1IwRkJSeXhwUWtGQmFVSTdRVUZETjBNc1VVRkJTU3hWUVVGVkxHTkJRV01zVFVGQlRUdEJRVU01UWl4bFFVRlRMRWRCUVVjc2EwSkJRV3RDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1RGRExHdENRVUZyUWl4UFFVRlBMRXRCUVVzN1FVRkRNVUlzVVVGQlRTeFpRVUZaTEVsQlFVa3NUVUZCVFN4SlFVRkpMRk5CUVZNc1EwRkJSU3hSUVVGUkxFbEJRVWtzVVVGQlVTeFpRVUZaTEVsQlFVazdRVUZCUVR0QlFVVnVSaXd5UWtGQk1rSXNTVUZCU1N4UFFVRlBMRlZCUVZVN1FVRkROVU1zVFVGQlNTeGxRVUZsTzBGQlEyNUNMRTFCUVVrc1pVRkJaU3hOUVVGTkxFMUJRVTBzYTBKQlFXdENPMEZCUTJwRUxHVkJRV0VzVVVGQlVTeFRRVUZWTEZkQlFWYzdRVUZEZEVNc1VVRkJTU3hSUVVGUkxGTkJRVk1zV1VGQldUdEJRVU5xUXl4UlFVRkpMRlZCUVZVc1RVRkJUVHRCUVVOd1FpeFJRVUZKTEZWQlFWVXNaMEpCUVdkQ0xHZENRVUZuUWl4VlFVRlZMRmRCUVZjc1NVRkJTU3hQUVVGUExFOUJRVThzUTBGQlF5eERRVUZETEUxQlFVMHNaVUZCWlN4WFFVRlhMRTlCUVU4c1dVRkJXU3hWUVVGVk8wRkJRM0JLTEZGQlFVa3NWVUZCVlR0QlFVTmtMR0ZCUVZNc1NVRkJTU3hIUVVGSExFbEJRVWtzVFVGQlRTeFhRVUZYTEZGQlFWRXNSVUZCUlN4SFFVRkhPMEZCUXpsRExGVkJRVWtzVjBGQlZ5eE5RVUZOTEUxQlFVMHNUVUZCVFN4WFFVRlhPMEZCUXpWRExHZENRVUZWTEZOQlFWTTdRVUZEYmtJc1ZVRkJTU3hSUVVGUkxHZENRVUZuUWl4VFFVRlRMRTFCUVUwc1UwRkJVeXhEUVVGRExFTkJRVU1zVTBGQlV5eFJRVUZSTEVOQlFVTXNRMEZCUXl4VFFVRlRMRmxCUVZrc1QwRkJUeXhYUVVGWExFOUJRVThzV1VGQldTeFZRVUZWTzBGQlF6ZEpMR05CUVZFc1MwRkJTenRCUVVGQk8wRkJSV3BDTEdsQ1FVRmhMR0ZCUVdFc2EwSkJRV3RDTEZkQlFWY3NVMEZCVXp0QlFVRkJPMEZCUlhCRkxGTkJRVTg3UVVGQlFUdEJRVVZZTERCQ1FVRXdRaXhKUVVGSkxFOUJRVThzVlVGQlZUdEJRVU16UXl4TFFVRkhMRkZCUVZFc1RVRkJUU3hWUVVGVk8wRkJRek5DTEUxQlFVa3NaVUZCWlN4SFFVRkhMRmxCUVZrc2EwSkJRV3RDTEVsQlFVa3NUMEZCVHp0QlFVTXZSQ3hMUVVGSExHTkJRV01zVFVGQlRTeE5RVUZOTEd0Q1FVRnJRanRCUVVNdlF5eG5Ra0ZCWXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhoUVVGaExFdEJRVXNzWlVGQlpUdEJRVUZCTzBGQlJUTkVMQ3RDUVVFclFpeEpRVUZKTEZWQlFWVTdRVUZEZWtNc1RVRkJTU3hyUWtGQmEwSXNhMEpCUVd0Q0xFbEJRVWtzUjBGQlJ5eFBRVUZQTzBGQlEzUkVMRTFCUVVrc1QwRkJUeXhqUVVGakxHbENRVUZwUWl4SFFVRkhPMEZCUXpkRExGTkJRVThzUTBGQlJTeE5RVUZMTEVsQlFVa3NWVUZCVlN4TFFVRkxMRTlCUVU4c1MwRkJTeXhUUVVGVkxFbEJRVWs3UVVGQlJTeFhRVUZQTEVkQlFVY3NTVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUenRCUVVGQk8wRkJRVUU3UVVGRmJrY3NiME5CUVc5RExFbEJRVWtzVVVGQlVTeFZRVUZWTzBGQlEzUkVMRTFCUVVrc1lVRkJZU3hUUVVGVExFZEJRVWM3UVVGRE4wSXNWMEZCVXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hYUVVGWExGRkJRVkVzUlVGQlJTeEhRVUZITzBGQlEzaERMRkZCUVVrc1dVRkJXU3hYUVVGWE8wRkJRek5DTEZGQlFVa3NVVUZCVVN4VFFVRlRMRmxCUVZrN1FVRkRha01zVDBGQlJ5eGhRVUZoTEZsQlFWazdRVUZETlVJc1lVRkJVeXhKUVVGSkxFZEJRVWNzU1VGQlNTeE5RVUZOTEZkQlFWY3NVVUZCVVN4RlFVRkZMRWRCUVVjN1FVRkRPVU1zVlVGQlNTeFpRVUZaTEUxQlFVMHNWMEZCVnp0QlFVTnFReXhWUVVGSkxGVkJRVlVzVFVGQlRTeE5RVUZOTEZkQlFWYzdRVUZEY2tNc1ZVRkJTU3haUVVGWkxFOUJRVThzV1VGQldTeFhRVUZYTEZWQlFWVXNUVUZCVFN4TlFVRk5MRk5CUVZNc1MwRkJTeXhQUVVGUE8wRkJRM3BHTEZWQlFVa3NUMEZCVHl4WlFVRlpPMEZCUTI1Q0xGbEJRVWtzV1VGQldTeFBRVUZQTEZkQlFWY3NWVUZCVlR0QlFVTTFReXhaUVVGSkxGZEJRVmM3UVVGRFdDeHZRa0ZCVlN4UFFVRlBPMEZCUTJwQ0xHbENRVUZQTEU5QlFVOHNWMEZCVnl4VlFVRlZPMEZCUTI1RExHbENRVUZQTEZkQlFWY3NWVUZCVlN4aFFVRmhPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTGVrUXNUVUZCU1N4UFFVRlBMR05CUVdNc1pVRkJaU3hUUVVGVExFdEJRVXNzVlVGQlZTeGpRVU0xUkN4RFFVRkRMRzlDUVVGdlFpeExRVUZMTEZWQlFWVXNZMEZEY0VNc1VVRkJVU3h4UWtGQmNVSXNiVUpCUVcxQ0xGRkJRVkVzY1VKQlEzaEVMRWRCUVVjc1QwRkJUeXhWUVVGVkxGVkJRVlVzVFVGQlRTeHJRa0ZCYTBJc1MwRkJTeXhMUVVGTE8wRkJRMmhGTEU5QlFVY3NZVUZCWVR0QlFVRkJPMEZCUVVFN1FVRkhlRUlzTUVKQlFUQkNMRzFDUVVGdFFqdEJRVU42UXl4VFFVRlBMR3RDUVVGclFpeE5RVUZOTEV0QlFVc3NTVUZCU1N4VFFVRlZMRTlCUVU4c1ZVRkJWVHRCUVVNdlJDeFpRVUZSTEUxQlFVMDdRVUZEWkN4UlFVRkpMRTlCUVU4c1RVRkJUU3hSUVVGUkxHZENRVUZuUWp0QlFVTjZReXhSUVVGSkxGVkJRVlVzVFVGQlRTeExRVUZMTEZGQlFWRXNTMEZCU3l4TlFVRk5MR05CUVdNc1IwRkJSeXhOUVVGTkxFOUJRVTg3UVVGRE1VVXNWMEZCVHl4blFrRkJaMElzVFVGQlRTeFhRVUZYTEUxQlFVMHNTMEZCU3l4TFFVRkxMRkZCUVZFc1MwRkJTeXhMUVVGTExGRkJRVkVzVDBGQlR5eExRVUZMTEZGQlFWRXNVVUZCVVN4VlFVRlZMR0ZCUVdFN1FVRkJRVHRCUVVGQk8wRkJTVGRKTEVsQlFVa3NWVUZCV1N4WFFVRlpPMEZCUTNoQ0xITkNRVUZ0UWp0QlFVRkJPMEZCUlc1Q0xGZEJRVkVzVlVGQlZTeHRRa0ZCYlVJc1UwRkJWU3hSUVVGUkxGZEJRVmM3UVVGRE9VUXNVMEZCU3l4UlFVRlJMRkZCUVZFc1UwRkJWU3hYUVVGWE8wRkJRM1JETEZWQlFVa3NUMEZCVHl4bFFVRmxMRTFCUVUwN1FVRkROVUlzV1VGQlNTeFZRVUZWTEdsQ1FVRnBRaXhQUVVGUE8wRkJRM1JETEZsQlFVa3NWVUZCVlN4UlFVRlJPMEZCUTNSQ0xGbEJRVWtzVVVGQlVUdEJRVU5TTEdkQ1FVRk5MRWxCUVVrc1YwRkJWeXhQUVVGUE8wRkJRMmhETEdkQ1FVRlJMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRek5DTEdOQlFVa3NTVUZCU1R0QlFVTktMR3RDUVVGTkxFbEJRVWtzVjBGQlZ5eFBRVUZQTzBGQlEyaERMR05CUVVrc1EwRkJReXhKUVVGSk8wRkJRMHdzYTBKQlFVMHNTVUZCU1N4WFFVRlhMRTlCUVU4N1FVRkJRVHRCUVVWd1F5eHJRa0ZCVlN4aFFVRmhMR3RDUVVGclFpeFhRVUZYTEZOQlFWTTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkpla1VzVjBGQlVTeFZRVUZWTEZOQlFWTXNVMEZCVlN4UlFVRlJPMEZCUTNwRExGRkJRVWtzUzBGQlN5eExRVUZMTzBGQlEyUXNVMEZCU3l4TFFVRkxMR1ZCUVdVc1MwRkJTeXhMUVVGTExHVkJReTlDTEU5QlFVOHNTMEZCU3l4TFFVRkxMR05CUVdNc1ZVRkRMMEk3UVVGRFNpeFJRVUZKTEZkQlFWY3NSMEZCUnp0QlFVTnNRaXhSUVVGSkxHRkJRV0U3UVVGRGFrSXNVVUZCU1N4WFFVRlhPMEZCUTJZc1lVRkJVeXhSUVVGUkxGTkJRVlVzVTBGQlV6dEJRVU5vUXl4aFFVRlBMRmxCUVZrc1VVRkJVU3hMUVVGTE8wRkJRMmhETEdsQ1FVRlpMRkZCUVZFc1MwRkJTeXhYUVVGWE8wRkJRM0JETEdOQlFWRXNhVUpCUVdsQ0xGbEJRVms3UVVGQlFUdEJRVVY2UXl4UFFVRkhMRmxCUVZrN1FVRkRaaXh2UWtGQlowSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1dVRkJXU3hKUVVGSkxFZEJRVWNzV1VGQldUdEJRVU4yUkN4clFrRkJZeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eFpRVUZaTEVsQlFVa3NSMEZCUnl4WlFVRlpMRmRCUVZjc1MwRkJTeXhMUVVGTExGTkJRVk1zUzBGQlN5eFhRVUZYTzBGQlEyNUhMRTlCUVVjc1kwRkJZeXhMUVVGTE8wRkJRM1JDTEZkQlFVODdRVUZCUVR0QlFVVllMRmRCUVZFc1ZVRkJWU3hWUVVGVkxGTkJRVlVzYVVKQlFXbENPMEZCUTI1RUxGTkJRVXNzUzBGQlN5eHBRa0ZCYVVJN1FVRkRNMElzVjBGQlR6dEJRVUZCTzBGQlJWZ3NVMEZCVHp0QlFVRkJPMEZCUjFnc2EwTkJRV3RETEVsQlFVazdRVUZEYkVNc1UwRkJUeXh4UWtGQmNVSXNVVUZCVVN4WFFVRlhMR3RDUVVGcFFpeGxRVUZsTzBGQlF6TkZMRk5CUVVzc1MwRkJTenRCUVVOV0xGTkJRVXNzVDBGQlR6dEJRVUZCTEUxQlExSXNVMEZCVXp0QlFVRkJMRTFCUTFRc1kwRkJZenRCUVVGQkxFMUJRMlFzVlVGQlZUdEJRVUZCTEUxQlExWXNVVUZCVVR0QlFVRkJMRTFCUTFJc1owSkJRV2RDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU3pWQ0xIbENRVUY1UWl4WFFVRlhMR0ZCUVdFN1FVRkROME1zVFVGQlNTeFpRVUZaTEZWQlFWVTdRVUZETVVJc1RVRkJTU3hEUVVGRExGZEJRVmM3UVVGRFdpeG5Ra0ZCV1N4VlFVRlZMR2RDUVVGblFpeEpRVUZKTEZGQlFWRXNXVUZCV1R0QlFVRkJMRTFCUXpGRUxGRkJRVkU3UVVGQlFTeE5RVU5TTzBGQlFVRXNUVUZEUVR0QlFVRkJPMEZCUlVvc1kwRkJWU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZGTEZOQlFWTTdRVUZCUVR0QlFVVXpReXhUUVVGUExGVkJRVlVzVFVGQlRUdEJRVUZCTzBGQlJUTkNMRFJDUVVFMFFpeFhRVUZYTzBGQlEyNURMRk5CUVU4c1lVRkJZU3hQUVVGUExGVkJRVlVzWTBGQll6dEJRVUZCTzBGQlJYWkVMREJDUVVFd1FpeExRVUZKTzBGQlF6RkNMRTFCUVVrc1dVRkJXU3hKUVVGSExGZEJRVmNzWTBGQll5eEpRVUZITzBGQlF5OURMRk5CUVU4c2JVSkJRVzFDTEdGQlEzQkNMRkZCUVZFc1VVRkJVU3hWUVVGVkxHRkJRV0VzUzBGQlN5eFRRVUZWTEU5QlFVODdRVUZETTBRc1YwRkJUeXhOUVVOR0xFbEJRVWtzVTBGQlZTeE5RVUZOTzBGQlFVVXNZVUZCVHl4TFFVRkxPMEZCUVVFc1QwRkRiRU1zVDBGQlR5eFRRVUZWTEUxQlFVMDdRVUZCUlN4aFFVRlBMRk5CUVZNN1FVRkJRVHRCUVVGQkxFOUJSV2hFTEdkQ1FVRm5RaXhYUVVGWExHRkJRV0VzWlVGQlpUdEJRVUZCTzBGQlJXcEZMRFJDUVVFMFFpeExRVUZKTEUxQlFVMDdRVUZEYkVNc1RVRkJTU3haUVVGWkxFbEJRVWNzVjBGQlZ5eGpRVUZqTEVsQlFVYzdRVUZETDBNc1IwRkJReXh0UWtGQmJVSXNZMEZEYUVJc1UwRkJVeXhqUVVOVUxHZENRVUZuUWl4WFFVRlhMR0ZCUVdFc1NVRkJTU3hEUVVGRkxFOUJRV01zVFVGQlRUdEJRVUZCTzBGQlJURkZMRFJDUVVFMFFpeExRVUZKTEUxQlFVMDdRVUZEYkVNc1RVRkJTU3haUVVGWkxFbEJRVWNzVjBGQlZ5eGpRVUZqTEVsQlFVYzdRVUZETDBNc1IwRkJReXh0UWtGQmJVSXNZMEZEYUVJc1UwRkJVeXhqUVVOVUxHZENRVUZuUWl4WFFVRlhMR0ZCUVdFc1QwRkJUeXhOUVVGTkxFMUJRVTA3UVVGQlFUdEJRVWR1UlN4aFFVRmhMRWxCUVVrN1FVRkRZaXhUUVVGUExGTkJRVk1zVjBGQldUdEJRVU40UWl4UlFVRkpMR0ZCUVdFN1FVRkRha0lzVjBGQlR6dEJRVUZCTzBGQlFVRTdRVUZKWml4dFFrRkJiVUlzU1VGQlNUdEJRVU51UWl4TlFVRkpMRkZCUVZFc1IwRkJSenRCUVVObUxFMUJRVWtzV1VGQldTeEhRVUZITEUxQlFVMDdRVUZEZWtJc1RVRkJTU3hOUVVGTkxHbENRVUZwUWl4SFFVRkhPMEZCUXpGQ0xGZEJRVThzVFVGQlRTeGxRVUZsTEV0QlFVc3NWMEZCV1R0QlFVRkZMR0ZCUVU4c1RVRkJUU3hqUVVONFJDeFZRVUZWTEUxQlFVMHNaVUZEYUVJN1FVRkJRVHRCUVVOU0xGZEJRVlVzVDBGQlRTeGpRVUZqTEdWQlFXVTdRVUZETjBNc1VVRkJUU3huUWtGQlowSTdRVUZEZEVJc1VVRkJUU3hqUVVGak8wRkJRM0JDTEZGQlFVMHNaVUZCWlR0QlFVTnlRaXhOUVVGSkxHbENRVUZwUWl4TlFVRk5MR2RDUVVNelFpeHhRa0ZCY1VJc1RVRkJUU3hoUVVGaE8wRkJRM2hETEZOQlFVOHNZVUZCWVN4TFFVRkxMRU5CUVVNc1RVRkJUU3hsUVVGbExFbEJRVWtzWVVGQllTeFRRVUZWTEZOQlFWTXNVVUZCVVR0QlFVTnVSaXhSUVVGSkxFTkJRVU03UVVGRFJDeFpRVUZOTEVsQlFVa3NWMEZCVnp0QlFVTjZRaXhSUVVGSkxGTkJRVk1zUjBGQlJ6dEJRVU5vUWl4UlFVRkpMRTFCUVUwc1RVRkJUU3hoUVVOYUxGVkJRVlVzUzBGQlN5eFZRVU5tTEZWQlFWVXNTMEZCU3l4UlFVRlJMRXRCUVVzc1RVRkJUU3hIUVVGSExGRkJRVkU3UVVGRGFrUXNVVUZCU1N4RFFVRkRPMEZCUTBRc1dVRkJUU3hKUVVGSkxGZEJRVmM3UVVGRGVrSXNVVUZCU1N4VlFVRlZMRzFDUVVGdFFqdEJRVU5xUXl4UlFVRkpMRmxCUVZrc1MwRkJTeXhIUVVGSE8wRkJRM2hDTEZGQlFVa3NhMEpCUVd0Q0xFdEJRVXNzVTBGQlZTeEhRVUZITzBGQlEzQkRMREpDUVVGeFFpeEpRVUZKTzBGQlEzcENMRlZCUVVrc1RVRkJUU3hqUVVGakxFTkJRVU1zUjBGQlJ5eFRRVUZUTEdOQlFXTTdRVUZETDBNc1dVRkJTU3hWUVVGVk8wRkJRMlFzTWtKQlFXMUNPMEZCUTI1Q0xGbEJRVWtzVDBGQlR6dEJRVU5ZTEZsQlFVa3NVMEZCVXl4VlFVRlZMR1ZCUVdVN1FVRkRkRU1zWlVGQlR5eFpRVUZaTEU5QlFVOHNWVUZCVlN4TFFVRkxMRmRCUVZrN1FVRkRha1FzYVVKQlFVOHNTVUZCU1N4WFFVRlhMR1ZCUVdVc1kwRkJZeXhUUVVGVE8wRkJRVUU3UVVGQlFTeGhRVWN2UkR0QlFVTkVMREpDUVVGdFFpeFZRVUZWTEcxQ1FVRnRRanRCUVVOb1JDeFpRVUZKTEZOQlFWTXNSVUZCUlN4aFFVRmhMRXRCUVVzc1NVRkJTU3hIUVVGSExFMUJRVTBzU1VGQlNTeEZRVUZGTzBGQlEzQkVMSEZDUVVGaExGTkJRVk03UVVGRGRFSXNWMEZCUnl4UlFVRlJMRWxCUVVrN1FVRkRaaXh4UWtGQllTeEpRVUZKTEZOQlFWTXNTVUZCU1N4dlFrRkJiMEk3UVVGQlFUdEJRVUZCTEU5QlJYWkVPMEZCUTBnc1VVRkJTU3haUVVGWkxFdEJRVXNzVjBGQldUdEJRVU0zUWl3eVFrRkJjVUk3UVVGRGNrSXNWVUZCU1N4UlFVRlJMRWRCUVVjc1VVRkJVU3hKUVVGSk8wRkJRek5DTEZWQlFVa3NiVUpCUVcxQ0xFMUJRVTBzVFVGQlRUdEJRVU51UXl4VlFVRkpMR2xDUVVGcFFpeFRRVUZUTzBGQlF6RkNMRmxCUVVrN1FVRkRRU3hqUVVGSkxGZEJRVmNzVFVGQlRTeFpRVUZaTEc5Q1FVRnZRaXh0UWtGQmJVSTdRVUZEZUVVc1kwRkJTU3hOUVVGTk8wRkJRMDRzTmtKQlFXbENMRWxCUVVrc1QwRkJUenRCUVVGQkxHVkJRek5DTzBGQlEwUXNkVU5CUVRKQ0xFbEJRVWtzUjBGQlJ5eFhRVUZYTzBGQlF6ZERMR2RDUVVGSkxFTkJRVU1zYzBKQlFYTkNMRWxCUVVrc1YwRkJWenRCUVVOMFF5eHpRa0ZCVVN4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVkeVFpeHRRMEZCZVVJc1NVRkJTVHRCUVVGQkxHbENRVVV4UWl4SFFVRlFPMEZCUVVFN1FVRkZTaXhyUWtGQldTeExRVUZMTzBGQlEycENMRmxCUVUwc2EwSkJRV3RDTEV0QlFVc3NVMEZCVlN4SlFVRkpPMEZCUTNaRExHTkJRVTBzVlVGQlZUdEJRVU5vUWl4WFFVRkhMRWRCUVVjc2FVSkJRV2xDTEV0QlFVczdRVUZCUVR0QlFVVm9ReXhaUVVGTkxGVkJRVlVzUzBGQlN5eFRRVUZWTEVsQlFVazdRVUZETDBJc1YwRkJSeXhIUVVGSExGTkJRVk1zUzBGQlN6dEJRVUZCTzBGQlJYaENMRlZCUVVrN1FVRkRRU3d5UWtGQmJVSXNSMEZCUnl4UFFVRlBPMEZCUTJwRE8wRkJRVUVzVDBGRFJEdEJRVUZCTEU5QlEwWXNTMEZCU3l4WFFVRlpPMEZCUTNSQ0xGVkJRVTBzYjBKQlFXOUNPMEZCUXpGQ0xGZEJRVThzWVVGQllTeFJRVUZSTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTFCUVUwc1QwRkJUeXhMUVVGTExEQkNRVUV3UWp0QlFVTTVSU3hWUVVGSkxFMUJRVTBzYTBKQlFXdENMRk5CUVZNc1IwRkJSenRCUVVOd1F5eFpRVUZKTEdGQlFXRXNUVUZCVFN4clFrRkJhMElzVDBGQlR5eHBRa0ZCYVVJN1FVRkRha1VzWTBGQlRTeHZRa0ZCYjBJN1FVRkRNVUlzWlVGQlR5eGhRVUZoTEZGQlFWRXNTVUZCU1N4aFFVRmhMRXRCUVVzN1FVRkJRVHRCUVVGQk8wRkJRVUVzUzBGSE0wUXNVVUZCVVN4WFFVRlpPMEZCUTI1Q0xGVkJRVTBzYjBKQlFXOUNPMEZCUVVFc1MwRkRNMElzUzBGQlN5eFhRVUZaTzBGQlEyaENMRlZCUVUwc1owSkJRV2RDTzBGQlEzUkNMRmRCUVU4N1FVRkJRU3hMUVVOU0xFMUJRVTBzVTBGQlZTeExRVUZMTzBGQlEzQkNMRkZCUVVrN1FVRkRRU3cwUWtGQmMwSXNiVUpCUVcxQ08wRkJRVUVzWVVGRmRFTXNSMEZCVUR0QlFVRkJPMEZCUTBFc1ZVRkJUU3huUWtGQlowSTdRVUZEZEVJc1QwRkJSenRCUVVOSUxGVkJRVTBzWTBGQll6dEJRVU53UWl4WFFVRlBMRlZCUVZVc1RVRkJUVHRCUVVGQkxFdEJRM2hDTEZGQlFWRXNWMEZCV1R0QlFVTnVRaXhWUVVGTkxHVkJRV1U3UVVGRGNrSTdRVUZCUVR0QlFVRkJPMEZCU1ZJc2RVSkJRWFZDTEZWQlFWVTdRVUZETjBJc1RVRkJTU3hYUVVGWExGTkJRVlVzVVVGQlVUdEJRVUZGTEZkQlFVOHNVMEZCVXl4TFFVRkxPMEZCUVVFc1MwRkJXU3hWUVVGVkxGTkJRVlVzVDBGQlR6dEJRVUZGTEZkQlFVOHNVMEZCVXl4TlFVRk5PMEZCUVVFc1MwRkJWeXhaUVVGWkxFdEJRVXNzVjBGQlZ5eFZRVUZWTEV0QlFVczdRVUZETjBzc1owSkJRV01zVTBGQlV6dEJRVU51UWl4WFFVRlBMRk5CUVZVc1MwRkJTenRCUVVOc1FpeFZRVUZKTEU5QlFVOHNVVUZCVVN4TlFVRk5MRkZCUVZFc1MwRkJTenRCUVVOMFF5eGhRVUZQTEV0QlFVc3NUMEZCVHl4UlFVTmtMRU5CUVVNc1UwRkJVeXhQUVVGUExFMUJRVTBzVTBGQlV5eGhRVU0zUWl4UlFVRlJMRk5CUVZNc1VVRkJVU3hKUVVGSkxFOUJRVThzUzBGQlN5eFhRVUZYTEZkQlFWY3NWVUZCVlN4VFFVTjZSU3hOUVVGTkxFdEJRVXNzVjBGQlZ6dEJRVUZCTzBGQlFVRTdRVUZIZEVNc1UwRkJUeXhMUVVGTE8wRkJRVUU3UVVGSGFFSXNaME5CUVdkRExFMUJRVTBzWVVGQllTeFhRVUZYTzBGQlF6RkVMRTFCUVVrc1NVRkJTU3hWUVVGVk8wRkJRMnhDTEUxQlFVa3NTVUZCU1R0QlFVTktMRlZCUVUwc1NVRkJTU3hYUVVGWExHZENRVUZuUWp0QlFVTjZReXhOUVVGSkxFOUJRVThzU1VGQlNTeE5RVUZOTEVsQlFVazdRVUZEZWtJc1UwRkJUeXhGUVVGRk8wRkJRMHdzVTBGQlN5eEpRVUZKTEV0QlFVc3NWVUZCVlR0QlFVTTFRaXhqUVVGWkxFdEJRVXM3UVVGRGFrSXNUVUZCU1N4VFFVRlRMRkZCUVZFN1FVRkRja0lzVTBGQlR5eERRVUZETEUxQlFVMHNVVUZCVVR0QlFVRkJPMEZCUlRGQ0xDdENRVUVyUWl4SlFVRkpMRTFCUVUwc1dVRkJXU3h0UWtGQmJVSXNWMEZCVnp0QlFVTXZSU3hUUVVGUExHRkJRV0VzVlVGQlZTeExRVUZMTEZkQlFWazdRVUZETTBNc1VVRkJTU3haUVVGWkxFbEJRVWtzWVVGQllUdEJRVU5xUXl4UlFVRkpMRkZCUVZFc1IwRkJSeXh0UWtGQmJVSXNUVUZCVFN4WlFVRlpMRWRCUVVjc1YwRkJWenRCUVVOc1JTeFJRVUZKTEZsQlFWazdRVUZCUVN4TlFVTmFPMEZCUVVFc1RVRkRRVHRCUVVGQk8wRkJSVW9zVVVGQlNTeHRRa0ZCYlVJN1FVRkRia0lzV1VGQlRTeFhRVUZYTEd0Q1FVRnJRanRCUVVGQkxGZEJSV3hETzBGQlEwUXNXVUZCVFR0QlFVRkJPMEZCUlZZc1VVRkJTU3h0UWtGQmJVSXNaMEpCUVdkQ08wRkJRM1pETEZGQlFVa3NhMEpCUVd0Q08wRkJRMnhDTzBGQlFVRTdRVUZGU2l4UlFVRkpPMEZCUTBvc1VVRkJTU3hyUWtGQmEwSXNZVUZCWVN4UFFVRlBMRmRCUVZrN1FVRkRiRVFzYjBKQlFXTXNWVUZCVlN4TFFVRkxMRTlCUVU4N1FVRkRjRU1zVlVGQlNTeGhRVUZoTzBGQlEySXNXVUZCU1N4clFrRkJhMEk3UVVGRGJFSXNZMEZCU1N4alFVRmpMSGRDUVVGM1FpeExRVUZMTEUxQlFVMDdRVUZEY2tRc2MwSkJRVmtzUzBGQlN5eGhRVUZoTzBGQlFVRXNiVUpCUlhwQ0xFOUJRVThzV1VGQldTeFRRVUZUTEdOQlFXTXNUMEZCVHl4WlFVRlpMRlZCUVZVc1dVRkJXVHRCUVVONFJpeDNRa0ZCWXl4alFVRmpPMEZCUVVFN1FVRkJRVHRCUVVGQkxFOUJSM0pETzBGQlEwZ3NWMEZCVVN4blFrRkJaU3hQUVVGUExGbEJRVmtzVTBGQlV5eGhRVU12UXl4aFFVRmhMRkZCUVZFc1lVRkJZU3hMUVVGTExGTkJRVlVzUjBGQlJ6dEJRVUZGTEdGQlFVOHNUVUZCVFN4VFFVTXZSQ3hKUVVORkxGVkJRVlVzU1VGQlNTeFhRVUZYTEdkQ1FVRm5RanRCUVVGQkxGTkJRemRETEdkQ1FVRm5RaXhMUVVGTExGZEJRVms3UVVGQlJTeGhRVUZQTzBGQlFVRXNVVUZCYVVJc1MwRkJTeXhUUVVGVkxFZEJRVWM3UVVGREwwVXNWVUZCU1R0QlFVTkJMR05CUVUwN1FVRkRWaXhoUVVGUExFMUJRVTBzV1VGQldTeExRVUZMTEZkQlFWazdRVUZCUlN4bFFVRlBPMEZCUVVFN1FVRkJRU3hQUVVOd1JDeE5RVUZOTEZOQlFWVXNSMEZCUnp0QlFVTnNRaXhaUVVGTkxGRkJRVkU3UVVGRFpDeGhRVUZQTEZWQlFWVTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxOMElzWVVGQllTeEhRVUZITEU5QlFVOHNUMEZCVHp0QlFVTXhRaXhOUVVGSkxGTkJRVk1zVVVGQlVTeExRVUZMTEVWQlFVVXNWVUZCVlN4RFFVRkRPMEZCUTNaRExGZEJRVk1zU1VGQlNTeEhRVUZITEVsQlFVa3NUMEZCVHl4RlFVRkZPMEZCUTNwQ0xGZEJRVThzUzBGQlN6dEJRVU5vUWl4VFFVRlBPMEZCUVVFN1FVRkZXQ3h6UTBGQmMwTXNUVUZCVFR0QlFVTjRReXhUUVVGUExGTkJRVk1zVTBGQlV5eEpRVUZKTEU5QlFVOHNRMEZCUlN4UFFVRlBMRk5CUVZVc1YwRkJWenRCUVVNeFJDeFJRVUZKTEZGQlFWRXNTMEZCU3l4TlFVRk5PMEZCUTNaQ0xGRkJRVWtzVTBGQlV5eE5RVUZOTzBGQlEyNUNMRkZCUVVrc1kwRkJZenRCUVVOc1FpeFJRVUZKTEc5Q1FVRnZRanRCUVVONFFpd3JRa0ZCTWtJc1UwRkJVeXhUUVVGVExHVkJRV1U3UVVGRGVFUXNWVUZCU1N4bFFVRmxMR2RDUVVGblFqdEJRVU51UXl4VlFVRkpMRmxCUVdFc1dVRkJXU3huUWtGQlowSXNXVUZCV1N4cFFrRkJhVUk3UVVGRE1VVXNWVUZCU1N4WlFVRlpMRmRCUVZjc1QwRkJUeXhKUVVGSkxFOUJRVThzV1VGQldTeFhRVUZYTEVsQlFVa3NVVUZCVVR0QlFVTm9SaXhWUVVGSkxGbEJRVmtzVlVGQlZUdEJRVU14UWl4VlFVRkpMR1ZCUVdVc1UwRkJVeXhUUVVGVExFbEJRVWtzWjBKQlFXZENPMEZCUVVFc1VVRkJSVHRCUVVGQkxGRkJRWE5DTEdOQlFXTXNRMEZCUXl4aFFVRmhMR05CUVdNN1FVRkJRU3hSUVVGak8wRkJRVUVzVVVGRGNrazdRVUZCUVN4UlFVRnpRaXhaUVVGWkxHZENRVUZuUWp0QlFVRkJMRkZCUVZVc1VVRkJVU3hEUVVGRExHRkJRV0VzWTBGQll6dEJRVUZCTzBGQlEzQkhMR2RDUVVGVkxFdEJRVXM3UVVGRFppeFZRVUZKTEVOQlFVTXNZVUZCWVN4alFVRmpPMEZCUXpWQ0xEQkNRVUZyUWl4TFFVRkxPMEZCUVVFN1FVRkZNMElzVlVGQlNTeFpRVUZaTEVkQlFVYzdRVUZEWml4WlFVRkpMR2xDUVVGcFFpeGpRVUZqTEVsQlF5OUNMRkZCUVZFc1MwRkRVaXhSUVVGUkxFMUJRVTBzUjBGQlJ5eFpRVUZaTzBGQlEycERMREJDUVVGclFpeG5Ra0ZCWjBJc1ZVRkJWU3hIUVVGSE8wRkJRVUU3UVVGRmJrUXNaMEpCUVZVc1MwRkJTeXhUUVVGVkxFZEJRVWNzUjBGQlJ6dEJRVUZGTEdWQlFVOHNSVUZCUlN4VlFVRlZMRVZCUVVVN1FVRkJRVHRCUVVOMFJDeGhRVUZQTzBGQlFVRTdRVUZGV0N4UlFVRkpMR0ZCUVdFc2EwSkJRV3RDTEU5QlFVOHNWMEZCVnl4VFFVRlRMRWRCUVVjc1QwRkJUenRCUVVONFJTeG5Ra0ZCV1N4VFFVRlRMRU5CUVVNN1FVRkRkRUlzWVVGQlV5eExRVUZMTEVkQlFVY3NUVUZCU3l4UFFVRlBMRk5CUVZNc1MwRkJTeXhKUVVGSExGRkJRVkVzVFVGQlRUdEJRVU40UkN4VlFVRkpMRkZCUVZFc1NVRkJSenRCUVVObUxIZENRVUZyUWl4TlFVRk5MRk5CUVZNc1IwRkJSenRCUVVGQk8wRkJSWGhETERKQ1FVRjFRaXhUUVVGVE8wRkJRelZDTEZWQlFVa3NWVUZCVXl4WlFVRlpMR2RDUVVGblFqdEJRVU42UXl4aFFVRlBMRmRCUVZVc1VVRkJUenRCUVVGQk8wRkJSVFZDTERSQ1FVRjNRaXhQUVVGUExGTkJRVk03UVVGRGNFTXNZVUZCVHp0QlFVRkJMRkZCUTBnc1RVRkJUU3hOUVVGTkxGTkJRVk1zU1VGRGFrSXNTVUZEUVN4TlFVRk5PMEZCUVVFc1VVRkRWaXhQUVVGUExFbEJRVWtzVFVGQlRTeFBRVUZQTEUxQlFVMHNXVUZCV1N4TFFVRkxMRlZCUVZVc1MwRkJTeXhUUVVGVE8wRkJRVUVzVVVGRGRrVXNWMEZCVnp0QlFVRkJMRkZCUTFnc1QwRkJUeXhKUVVGSkxFMUJRVTBzVDBGQlR5eE5RVUZOTEZsQlFWa3NTMEZCU3l4VlFVRlZMRXRCUVVzc1UwRkJVenRCUVVGQkxGRkJRM1pGTEZkQlFWYzdRVUZCUVR0QlFVRkJPMEZCUjI1Q0xEaENRVUV3UWl4TFFVRkxPMEZCUXpOQ0xGVkJRVWtzVTBGQlVTeEpRVUZKTEUxQlFVMDdRVUZEZEVJc1lVRkJUeXhQUVVGTkxGbEJRVmtzVTBGQlV5eFRRVUZUTEVsQlFVa3NUVUZCVFN4RFFVRkZMRTlCUVU4N1FVRkJRU3hSUVVOMFJDeFBRVUZQTzBGQlFVRXNVVUZEVUN4UFFVRlBMR1ZCUVdVc1NVRkJTU3hOUVVGTkxFOUJRVThzVDBGQlRUdEJRVUZCTEZsQlF6RkRPMEZCUVVFN1FVRkZaaXhSUVVGSkxGTkJRVk1zVTBGQlV5eFRRVUZUTEVsQlFVa3NVVUZCVVR0QlFVRkJMRTFCUVVVc1VVRkJVU3hUUVVGVExGTkJRVk1zU1VGQlNTeFRRVUZUTEVOQlFVVXNXVUZCZDBJc1UwRkJVeXh0UWtGQmJVSXNiVUpCUVcxQ08wRkJRVUVzVFVGQmEwSXNUMEZCVHl4VFFVRlZMRXRCUVVzN1FVRkROMHdzWlVGQlR5eE5RVUZOTEUxQlFVMHNhVUpCUVdsQ08wRkJRVUU3UVVGQlFTeE5RVVY0UXl4UFFVRlBMRk5CUVZVc1MwRkJTenRCUVVOc1FpeGxRVUZQTEUxQlFVMHNUVUZCVFN4cFFrRkJhVUk3UVVGQlFUdEJRVUZCTEUxQlJYaERMRmxCUVZrc1UwRkJWU3hMUVVGTE8wRkJRM1pDTEZsQlFVa3NUVUZCU3l4SlFVRkpMRTFCUVUwc1QwRkJUeXhWUVVGVkxFbEJRVWNzVTBGQlV5eFpRVUZaTEVsQlFVY3NWMEZCVnl4WlFVRlpMRWxCUVVjN1FVRkRla1lzV1VGQlNTeERRVUZETzBGQlEwUXNhVUpCUVU4c1RVRkJUU3hYUVVGWE8wRkJRelZDTEhGRFFVRTJRaXhSUVVGUk8wRkJRMnBETERaQ1FVRnRRaXhMUVVGTE8wRkJRM0JDTEcxQ1FVRlBMRTlCUTBnc1QwRkJUeXhUUVVGVExFbEJRVWtzUzBGQlN5eEpRVUZKTEZWQlFWVXNTMEZCU3l4VlFVRlZMRXRCUVVzc1UwRkJVeXhaUVVOd1JTeEpRVUZKTEZOQlEwRXNUMEZCVHl4VFFVRlRMRWxCUVVrc1QwRkJUeXhMUVVGTExFbEJRVWtzVlVGQlZTeExRVUZMTEZWQlFWVXNTMEZCU3l4VFFVRlRMRmxCUXpORkxFOUJRVTg3UVVGQlFUdEJRVVZ1UWl4alFVRkpMR2RDUVVGblFpeFBRVUZQTEU5QlFVOHNVVUZCVVR0QlFVRkJMRmxCUTNSRExGVkJRVlVzUTBGQlJTeFBRVUZQTzBGQlFVRXNXVUZEYmtJc2IwSkJRVzlDTzBGQlFVRXNZMEZEYUVJc1QwRkJUeXhUUVVGVkxFdEJRVXNzWVVGQldUdEJRVU01UWl4MVFrRkJUeXh0UWtGQmJVSXNTVUZCU1N4TFFVRkxMRXRCUVVzc1UwRkJVeXhWUVVGVk8wRkJRVUU3UVVGQlFUdEJRVUZCTEZsQlIyNUZMRXRCUVVzN1FVRkJRU3hqUVVORUxFdEJRVXNzVjBGQldUdEJRVU5pTEc5Q1FVRkpMRTFCUVUwc1QwRkJUenRCUVVOcVFpeDFRa0ZCVHl4alFVRmpMRWxCUTJwQ0xFbEJRVWtzUzBGRFNpeEpRVUZKTEUxQlFVMHNSMEZCUnp0QlFVRkJPMEZCUVVFN1FVRkJRU3haUVVkNlFpeFBRVUZQTzBGQlFVRXNZMEZEU0N4TFFVRkxMRmRCUVZrN1FVRkRZaXgxUWtGQlR5eFBRVUZQTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCU1RGQ0xHbENRVUZQTzBGQlFVRTdRVUZGV0N4bFFVRlBMRTFCUVUwc1YwRkJWeXhwUWtGQmFVSXNUVUZEY0VNc1MwRkJTeXhUUVVGVkxGRkJRVkU3UVVGQlJTeHBRa0ZCVHl4VlFVRlZMRzlDUVVGdlFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVVXpSU3hYUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWR1UWl4SlFVRkpMSGxDUVVGNVFqdEJRVUZCTEVWQlEzcENMRTlCUVU4N1FVRkJRU3hGUVVOUUxFMUJRVTA3UVVGQlFTeEZRVU5PTEU5QlFVODdRVUZCUVN4RlFVTlFMRkZCUVZFN1FVRkJRVHRCUVVkYUxEQkNRVUV3UWl4WlFVRlpMRXRCUVVzN1FVRkRka01zVFVGQlNTeEpRVUZKTEZOQlFWTTdRVUZEWWl4WFFVRlBMRWxCUVVrN1FVRkRaaXhUUVVGUExFbEJRVWtzVVVGQlVTeEpRVUZKTEU5QlFVOHNTVUZCU1N4WFFVRlhPMEZCUVVFN1FVRkhha1FzU1VGQlNTeHJRa0ZCYTBJN1FVRkJRU3hGUVVOc1FpeFBRVUZQTzBGQlFVRXNSVUZEVUN4TlFVRk5PMEZCUVVFc1JVRkRUaXhQUVVGUE8wRkJRVUVzUlVGRFVDeFJRVUZSTEZOQlFWVXNWVUZCVlR0QlFVRkZMRmRCUVZFc1UwRkJVeXhUUVVGVExFbEJRVWtzVjBGQlZ5eERRVUZGTEU5QlFVOHNVMEZCVlN4WFFVRlhPMEZCUXpkR0xGVkJRVWtzV1VGQldTeFRRVUZUTEUxQlFVMDdRVUZETDBJc1ZVRkJTU3hoUVVGaExGVkJRVlVzVDBGQlR6dEJRVU5zUXl4VlFVRkpMR3RDUVVGclFpeFRRVUZUTEZOQlFWTXNTVUZCU1N4WlFVRlpMRU5CUVVVc1VVRkJVU3hUUVVGVkxFdEJRVXM3UVVGRGVrVXNXVUZCU1N4VlFVRlZMRWxCUVVrN1FVRkRiRUlzV1VGQlNTeE5RVUZMTEZGQlFWRXNUVUZCVFN4WFFVRlhMRTFCUVUwc1YwRkJWeXhKUVVGSExGVkJRVlVzVjBGQlZ5eEpRVUZITEZWQlFWVXNWMEZCVnl4SlFVRkhPMEZCUTNSSExHZENRVUZSTEVsQlFVazdRVUZCUVN4bFFVTklPMEZCUTBRc1owSkJRVWtzVTBGQlV5eFRRVUZUTzBGQlEyeENPMEZCUTBvc2JVSkJRVThzVVVGQlVTeFRRVUZUTEdGQlFXRXNWMEZCV1R0QlFVRkZMSEZDUVVGUExHVkJRV1U3UVVGQlFTeGxRVUZUTzBGQlFVRXNaVUZEYWtZN1FVRkRSQ3huUWtGQlNTeFRRVUZUTEZOQlFWTXNUMEZCVHl4VFFVRlRMRk5CUVZNN1FVRkRNME03UVVGRFNpeHRRa0ZCVHl4UlFVRlJMRk5CUVZNc1lVRkJZU3hYUVVGWk8wRkJRVVVzY1VKQlFVOHNaVUZCWlR0QlFVRkJMR1ZCUVZNN1FVRkJRU3hsUVVOcVJqdEJRVU5FTEdkQ1FVRkpMRk5CUVZNc1UwRkJVenRCUVVOc1FqdEJRVU5LTEcxQ1FVRlBMRkZCUVZFc1UwRkJVeXhoUVVGaExGZEJRVms3UVVGQlJTeHhRa0ZCVHl4bFFVRmxPMEZCUVVFc1pVRkJVenRCUVVGQkxHVkJRMnBHTzBGQlEwUXNaMEpCUVVrc1UwRkJVeXhUUVVGVE8wRkJRMnhDTzBGQlEwb3NiVUpCUVU4c1VVRkJVU3hUUVVGVExHRkJRV0VzVjBGQldUdEJRVUZGTEhGQ1FVRlBMRmxCUVZrN1FVRkJRU3hsUVVGVE8wRkJRVUU3UVVGRmRrWXNaVUZCVHl4VlFVRlZMRTlCUVU4N1FVRkRlRUlzWjBOQlFYZENMRTFCUVVzN1FVRkRla0lzWTBGQlNTeFhRVUZWTEVsQlFVazdRVUZEYkVJc1kwRkJTU3hSUVVGUExFdEJRVWtzVVVGQlVTeHBRa0ZCYVVJc1dVRkJXVHRCUVVOd1JDeGpRVUZKTEVOQlFVTTdRVUZEUkN4clFrRkJUU3hKUVVGSkxFMUJRVTA3UVVGRGNFSXNhVUpCUVUwc1MwRkJTU3hUUVVGVExGTkJRVk1zUzBGQlNTeFRRVUZUTEZGQlFWRXNVMEZCVXl4VFFVRlRMRWxCUVVrc1QwRkJUU3hEUVVGRkxFMUJRVTBzVlVGQlZTeFRRVUZUTEVsQlFVazdRVUZETlVjc1kwRkJTU3hMUVVGSkxGTkJRVk03UVVGRFlpeHBRa0ZCU1N4VFFVRlRMR05CUVdNc1NVRkJTU3hMUVVGSk8wRkJRM1pETEdOQlFVa3NTMEZCU1R0QlFVTktMR2xDUVVGSkxFOUJRVThzWTBGQll5eEpRVUZKTEV0QlFVazdRVUZEY2tNc2FVSkJRVThzYTBKQlFXdENMRmRCUVZjc1RVRkJTeXhQUVVGTkxFdEJRVXNzVTBGQlZTeG5Ra0ZCWjBJN1FVRkRNVVVzWjBKQlFVa3NWMEZCVnl4TlFVRkxMRWxCUVVrc1UwRkJWU3hMUVVGTExFZEJRVWM3UVVGRGRFTXNhMEpCUVVrc1owSkJRV2RDTEdWQlFXVTdRVUZEYmtNc2EwSkJRVWtzVFVGQlRTeERRVUZGTEZOQlFWTXNUVUZCVFN4WFFVRlhPMEZCUTNSRExHdENRVUZKTEV0QlFVa3NVMEZCVXl4VlFVRlZPMEZCUTNaQ0xIbENRVUZUTEV0QlFVc3NTMEZCU3l4TFFVRkxMRXRCUVVzc1pVRkJaVHRCUVVGQkxIbENRVVYyUXl4TFFVRkpMRk5CUVZNc1UwRkJVeXhyUWtGQmEwSXNVVUZCVnp0QlFVTjRSQ3h2UWtGQlNTeHpRa0ZCYzBJc1UwRkJVeXhMUVVGTExFdEJRVXNzUzBGQlN5eExRVUZMTEV0QlFVa3NUMEZCVHl4SlFVRkpPMEZCUTNSRkxHOUNRVUZKTEU5QlFVOHNVVUZCVVN4MVFrRkJkVUlzVFVGQlRUdEJRVU0xUXl4M1FrRkJUVHRCUVVOT0xIVkNRVUZKTEV0QlFVc3NTMEZCU3p0QlFVTmtMSE5DUVVGSkxFTkJRVU1zVjBGQlZ5eFZRVUZWTzBGQlEzUkNMR2xEUVVGaExFdEJRVWtzVDBGQlR5eEpRVUZKTEZkQlFWY3NVMEZCVXp0QlFVRkJPMEZCUVVFN1FVRkJRU3h4UWtGSmRrUTdRVUZEUkN4dlFrRkJTU3hoUVVGaExHTkJRV01zWlVGQlpTeExRVUZKTEU5QlFVODdRVUZEZWtRc2IwSkJRVWtzYzBKQlFYTkNMRk5CUVZNc1MwRkJTeXhMUVVGTExFdEJRVXNzV1VGQldTeExRVUZMTEdWQlFXVTdRVUZEYkVZc2IwSkJRVWtzY1VKQlFYRkNPMEZCUTNKQ0xITkNRVUZKTEcxQ1FVRnRRaXhMUVVGSkxFOUJRVTg3UVVGRGJFTXNlVUpCUVU4c1MwRkJTeXh4UWtGQmNVSXNVVUZCVVN4VFFVRlZMRk5CUVZNN1FVRkRlRVFzZDBKQlFVa3NUMEZCVHl4clFrRkJhMElzVlVGQlZUdEJRVU51UXl4MVEwRkJhVUlzVjBGQlZ5eHZRa0ZCYjBJN1FVRkJRU3d5UWtGRkwwTTdRVUZEUkN4dFEwRkJZU3hyUWtGQmEwSXNVMEZCVXl4dlFrRkJiMEk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVczFSU3h4UWtGQlR6dEJRVUZCTzBGQlJWZ3NiVUpCUVU4c1ZVRkJWU3hQUVVGUExFMUJRVXNzUzBGQlN5eFRRVUZWTEV0QlFVazdRVUZETlVNc2EwSkJRVWtzVjBGQlZ5eEpRVUZITEZWQlFWVXNWVUZCVlN4SlFVRkhMRk5CUVZNc1kwRkJZeXhKUVVGSExHRkJRV0VzWVVGQllTeEpRVUZITzBGQlEyaEhMSFZDUVVGVExFbEJRVWtzUjBGQlJ5eEpRVUZKTEUxQlFVc3NVVUZCVVN4RlFVRkZMRWRCUVVjN1FVRkRiRU1zYjBKQlFVa3NWVUZCVlN4VlFVRlZMRkZCUVZFc1MwRkJTeXhOUVVGTE8wRkJRekZETEc5Q1FVRkpMRTFCUVUwc1UwRkJVenRCUVVOdVFpeHZRa0ZCU1N4WFFVRlhMRTFCUVUwN1FVRkRha0lzYzBKQlFVa3NWMEZCVnl4SlFVRkpMRkZCUVZFc1UwRkJVenRCUVVGQkxIVkNRVVZ1UXp0QlFVTkVMSE5DUVVGSkxHRkJRV0VzU1VGQlNTeFZRVUZWTEV0QlFVa3NVMEZCVXl4VFFVRlRMR1ZCUVdVc1MwRkRhRVVzUzBGQlNTeFBRVUZQTEV0QlExZzdRVUZCUVR0QlFVRkJPMEZCU1Zvc2NVSkJRVThzUTBGQlJTeFZRVUZ2UWl4VFFVRnJRaXhoUVVFd1FqdEJRVUZCTEdWQlF6RkZMRTFCUVUwc1UwRkJWU3hQUVVGUE8wRkJRM1JDTEhWQ1FVRlRMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRVVVzZFVKQlFVOHNTVUZCU1N4WFFVRlhMRWxCUVVrc1VVRkJVVHRCUVVGQk8wRkJRM0JGTEhGQ1FVRlBMRkZCUVZFc1QwRkJUenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWxzUXl3MlFrRkJjVUlzVFVGQlN6dEJRVU4wUWl4cFFrRkJUeXhuUWtGQlowSXNTMEZCU1N4UFFVRlBMRXRCUVVrc1QwRkJUenRCUVVGQk8wRkJSV3BFTEdsRFFVRjVRaXhQUVVGUExFOUJRVThzVDBGQlR6dEJRVU14UXl4cFFrRkJUeXhWUVVGVkxFMUJRVTBzUTBGQlJTeFBRVUZqTEZGQlFWRXNUMEZCVHl4UFFVRlBMRU5CUVVVc1QwRkJUeXhaUVVGWkxGRkJRV2RDTEZGQlF6ZEdMRXRCUVVzc1UwRkJWU3hMUVVGSk8wRkJRM0JDTEdkQ1FVRkpMRk5CUVZNc1NVRkJSenRCUVVOb1FpeHRRa0ZCVHl4bFFVRmxMRU5CUVVVc1RVRkJUU3hWUVVGVkxFMUJRVTBzVVVGQlVTeFJRVUZuUWl4TFFVRkxMRk5CUVZVc1MwRkJTenRCUVVOMFJpeHJRa0ZCU1N4SlFVRkpMR05CUVdNN1FVRkRiRUlzZFVKQlFVOHNVVUZCVVN4UFFVRlBMRWxCUVVrc1UwRkJVenRCUVVOMlF5eHJRa0ZCU1N4UFFVRlBMRk5CUVZNc1QwRkJUenRCUVVOMlFpeDFRa0ZCVHl4RFFVRkZMRlZCUVZVc1NVRkJTU3hoUVVGaExFZEJRVWNzV1VGQldUdEJRVUZCTEhGQ1FVVnNSRHRCUVVORUxIVkNRVUZQTEdkQ1FVRm5RaXhQUVVGUExGTkJRVk1zVTBGQlV5eEpRVUZKTEZGQlFWRXNRMEZCUlN4UFFVRlBMRTlCUVU4c1QwRkJUeXhUUVVGVExFbEJRVWtzVjBGQlZ5eFJRVUZUTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVUwMVNTeGhRVUZQTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUjI1Q0xESkNRVUV5UWl4UFFVRlBMRXRCUVVzc1pVRkJaVHRCUVVOc1JDeFRRVUZQTEVsQlFVa3NVMEZCVXl4UlFVTmtMRkZCUVZFc1VVRkJVU3hOUVVOb1FpeE5RVUZOTEZGQlFWRXNRMEZCUlN4UFFVRlBMRWxCUVVrc1QwRkJUeXhOUVVGTkxHVkJRV1VzVDBGQlR6dEJRVUZCTzBGQlIzaEZMRWxCUVVrN1FVRkRTaXhoUVVGaExFZEJRVWNzUjBGQlJ6dEJRVU5tTEUxQlFVazdRVUZEUVN4WFFVRlBMRXRCUVVzc1IwRkJSenRCUVVOdVFpeE5RVUZKTEZsQlFWa3NVVUZCVVR0QlFVTjRRaXhOUVVGSkxFTkJRVU03UVVGRFJDeFZRVUZOTEVsQlFVa3NWMEZCVnp0QlFVTjZRaXhUUVVGUExGTkJRVlVzU1VGQlJ5eEpRVUZITzBGQlEyNUNMRkZCUVVrN1FVRkRRU3hoUVVGUExFMUJRVXNzVVVGQlVTeE5RVUZMTEU5QlFVOHNUVUZCVFN4VlFVRlZMRWxCUVVrc1NVRkJSenRCUVVGQkxHRkJSWEJFTEV0QlFWQTdRVUZEU1N4aFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVkbUxGTkJRVThzUzBGQlN5eEhRVUZITzBGQlFVRTdRVUZIYmtJc2FVTkJRV2xETEU5QlFVMHNUMEZCVHl4UFFVRlBPMEZCUTJwRUxFMUJRVWs3UVVGRFFTeFJRVUZKTEVOQlFVTTdRVUZEUkN4aFFVRlBPMEZCUTFnc1VVRkJTU3hOUVVGTkxFdEJRVXNzVTBGQlV5eE5RVUZMTzBGQlEzcENMR0ZCUVU4N1FVRkRXQ3hSUVVGSkxGTkJRVk03UVVGRFlpeGhRVUZUTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWRCUVVjc1NVRkJTU3hOUVVGTkxFdEJRVXNzVlVGQlZTeEpRVUZKTEUxQlFVc3NVVUZCVVN4RlFVRkZMRWRCUVVjN1FVRkRiRVVzVlVGQlNTeEpRVUZKTEUxQlFVMHNTMEZCU3l4SlFVRkpMRTFCUVVzc1VVRkJVVHRCUVVOb1F6dEJRVU5LTEdGQlFVOHNTMEZCU3l4UlFVRlJMRlZCUVZVc1RVRkJUU3hQUVVGUExFMUJRVTBzVFVGQlRTeFBRVUZQTzBGQlF6bEVMRkZCUVVVN1FVRkJRVHRCUVVWT0xGZEJRVThzVDBGQlR5eFhRVUZYTEUxQlFVc3NVMEZCVXl4VFFVRlRPMEZCUVVFc1YwRkZOME1zUzBGQlVEdEJRVU5KTEZkQlFVODdRVUZCUVR0QlFVRkJPMEZCUjJZc1NVRkJTU3huUTBGQlowTTdRVUZCUVN4RlFVTm9ReXhQUVVGUE8wRkJRVUVzUlVGRFVDeFBRVUZQTzBGQlFVRXNSVUZEVUN4UlFVRlJMRk5CUVZVc1RVRkJUVHRCUVVOd1FpeFhRVUZQTzBGQlFVRXNUVUZEU0N4UFFVRlBMRk5CUVZVc1YwRkJWenRCUVVONFFpeFpRVUZKTEZGQlFWRXNTMEZCU3l4TlFVRk5PMEZCUTNaQ0xHVkJRVThzVTBGQlV5eFRRVUZUTEVsQlFVa3NVVUZCVVN4RFFVRkZMRk5CUVZNc1UwRkJWU3hMUVVGTE8wRkJRM1pFTEdOQlFVa3NRMEZCUXl4SlFVRkpMRTlCUVU4N1FVRkRXaXh0UWtGQlR5eE5RVUZOTEZGQlFWRTdRVUZCUVR0QlFVVjZRaXhqUVVGSkxHVkJRV1VzZDBKQlFYZENMRWxCUVVrc1RVRkJUU3hKUVVGSkxFMUJRVTBzVjBGQlZ5eEpRVUZKTEZWQlFWVTdRVUZEZUVZc1kwRkJTU3hqUVVGak8wRkJRMlFzYlVKQlFVOHNZVUZCWVN4UlFVRlJPMEZCUVVFN1FVRkZhRU1zYVVKQlFVOHNUVUZCVFN4UlFVRlJMRXRCUVVzc1MwRkJTeXhUUVVGVkxFdEJRVXM3UVVGRE1VTXNaMEpCUVVrc1RVRkJUU3haUVVGWk8wRkJRVUVzWTBGRGJFSXNUVUZCVFN4SlFVRkpPMEZCUVVFc1kwRkRWaXhSUVVGUkxFbEJRVWtzVlVGQlZTeFZRVUZWTEZWQlFWVXNUMEZCVHp0QlFVRkJPMEZCUlhKRUxHMUNRVUZQTzBGQlFVRTdRVUZCUVN4WFFVVmFMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRM1JDTEdOQlFVa3NTVUZCU1N4VFFVRlRPMEZCUTJJc1owSkJRVWtzVFVGQlRTeFpRVUZaTzBGQlF6RkNMR2xDUVVGUExFMUJRVTBzVDBGQlR6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRlBOVU1zU1VGQlNUdEJRVU5LTEhOQ1FVRnpRaXhOUVVGTk8wRkJRM2hDTEZOQlFVOHNRMEZCUlN4WFFVRlZPMEZCUVVFN1FVRkZka0lzU1VGQlNTeFhRVUZYTEZOQlFWVXNXVUZCV1N4SlFVRkpPMEZCUTNKRExFMUJRVWtzVFVGQlRUdEJRVU5PTEZkQlFVOHNUVUZCVFN4VlFVRlZMRk5CUVZNc1EwRkJSU3hIUVVGSExFZEJRVWNzVFVGQlRTeFpRVUZaTEVsQlFVa3NWVUZCVlN4VFFVRlRMRWxCUVVrc1MwRkJTeXhqUVVGbExFTkJRVVVzUjBGQlJ6dEJRVUZCTEZOQlJUZEhPMEZCUTBRc1VVRkJTU3hMUVVGTExFbEJRVWs3UVVGRFlpeFJRVUZKTEdOQlFXVXNUMEZCVHl4WlFVRmhPMEZCUTI1RExHRkJRVThzU1VGQlNUdEJRVUZCTzBGQlJXWXNWMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkhaaXhOUVVGTkxGTkJRVk1zVjBGQldTeE5RVUZMTzBGQlFVRXNSVUZEZUVJc1MwRkJTeXhUUVVGVkxGVkJRVlU3UVVGRGNrSXNaMEpCUVZrc1RVRkJUVHRCUVVOc1FpeFhRVUZQTzBGQlFVRTdRVUZCUVN4RlFVVllMRkZCUVZFc1UwRkJWU3hMUVVGTE8wRkJRMjVDTEdGQlFWTXNUVUZCVFN4TFFVRkxPMEZCUTNCQ0xGZEJRVTg3UVVGQlFUdEJRVUZCTEVWQlJWZ3NVMEZCVXl4VFFVRlZMRTlCUVUwN1FVRkRja0lzVVVGQlNTeFJRVUZSTzBGQlExb3NWVUZCU3l4UlFVRlJMRk5CUVZVc1MwRkJTenRCUVVGRkxHRkJRVThzVTBGQlV5eFBRVUZQTEV0QlFVczdRVUZCUVR0QlFVTXhSQ3hYUVVGUE8wRkJRVUU3UVVGQlFTeEhRVWRtTEVkQlFVY3NhMEpCUVd0Q0xGZEJRVms3UVVGRE4wSXNVMEZCVHl4dlFrRkJiMEk3UVVGQlFTeEhRVVV2UWp0QlFVTktMR3RDUVVGclFpeFJRVUZSTEUxQlFVMHNTVUZCU1R0QlFVTm9ReXhOUVVGSkxFOUJRVThzU1VGQlNTeE5RVUZOTzBGQlEzSkNMRTFCUVVrc1RVRkJUVHRCUVVOT08wRkJRMG9zVFVGQlNTeFBRVUZQTzBGQlExQXNWVUZCVFR0QlFVTldMRTFCUVVrc1lVRkJZVHRCUVVOaUxGZEJRVThzVDBGQlR5eFJRVUZSTEVOQlFVVXNUVUZCV1N4SlFVRlJMRWRCUVVjN1FVRkRia1FzVFVGQlNTeFBRVUZQTEU5QlFVODdRVUZEYkVJc1RVRkJTU3hSUVVGUkxFOUJRVTg3UVVGRGJrSXNUVUZCU1N4SlFVRkpMRWxCUVVrc1QwRkJUeXhSUVVGUkxFZEJRVWM3UVVGRE1VSXNWMEZEVFN4VFFVRlRMRTFCUVUwc1RVRkJUU3hOUVVOd1FpeFBRVUZQTEVsQlFVa3NRMEZCUlN4TlFVRlpMRWxCUVZFc1IwRkJSeXhIUVVGSExFZEJRVWNzVFVGQlRTeEhRVUZITzBGQlF6RkVMRmRCUVU4c1ZVRkJWVHRCUVVGQk8wRkJSWEpDTEUxQlFVa3NTVUZCU1N4TlFVRk5MRTlCUVU4c1RVRkJUU3hIUVVGSE8wRkJRekZDTEZsQlEwMHNVMEZCVXl4UFFVRlBMRTFCUVUwc1RVRkRja0lzVDBGQlR5eEpRVUZKTEVOQlFVVXNUVUZCV1N4SlFVRlJMRWRCUVVjc1IwRkJSeXhIUVVGSExFMUJRVTBzUjBGQlJ6dEJRVU14UkN4WFFVRlBMRlZCUVZVN1FVRkJRVHRCUVVWeVFpeE5RVUZKTEVsQlFVa3NUVUZCVFN4UFFVRlBMRkZCUVZFc1IwRkJSenRCUVVNMVFpeFhRVUZQTEU5QlFVODdRVUZEWkN4WFFVRlBMRWxCUVVrN1FVRkRXQ3hYUVVGUExFbEJRVWtzVVVGQlVTeE5RVUZOTEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCUlhKRExFMUJRVWtzU1VGQlNTeEpRVUZKTEU5QlFVOHNUVUZCVFN4SFFVRkhPMEZCUTNoQ0xGZEJRVThzUzBGQlN6dEJRVU5hTEZkQlFVOHNTVUZCU1R0QlFVTllMRmRCUVU4c1NVRkJTU3hQUVVGUExFbEJRVWtzVDBGQlR5eEZRVUZGTEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCUlRORExFMUJRVWtzYVVKQlFXbENMRU5CUVVNc1QwRkJUenRCUVVNM1FpeE5RVUZKTEZGQlFWRXNRMEZCUXl4UFFVRlBMRWRCUVVjN1FVRkRia0lzWjBKQlFWa3NVVUZCVVR0QlFVRkJPMEZCUlhoQ0xFMUJRVWtzVTBGQlV5eG5Ra0ZCWjBJN1FVRkRla0lzWjBKQlFWa3NVVUZCVVR0QlFVRkJPMEZCUVVFN1FVRkhOVUlzY1VKQlFYRkNMRkZCUVZFc1VVRkJVVHRCUVVOcVF5eDNRa0ZCYzBJc1UwRkJVU3hMUVVGSk8wRkJRemxDTEZGQlFVa3NUMEZCVHl4SlFVRkhMRTFCUVUwc1MwRkJTeXhKUVVGSExFbEJRVWtzU1VGQlNTeEpRVUZITEVkQlFVY3NTVUZCU1N4SlFVRkhPMEZCUTJwRUxHRkJRVk1zVTBGQlVTeE5RVUZOTzBGQlEzWkNMRkZCUVVrN1FVRkRRU3h0UWtGQllTeFRRVUZSTzBGQlEzcENMRkZCUVVrN1FVRkRRU3h0UWtGQllTeFRRVUZSTzBGQlFVRTdRVUZGTjBJc1RVRkJTU3hEUVVGRExHRkJRV0U3UVVGRFpDeHBRa0ZCWVN4UlFVRlJPMEZCUVVFN1FVRkZOMElzZFVKQlFYVkNMRmRCUVZjc1YwRkJWenRCUVVONlF5eE5RVUZKTEV0QlFVc3NiMEpCUVc5Q08wRkJRemRDTEUxQlFVa3NZMEZCWXl4SFFVRkhPMEZCUTNKQ0xFMUJRVWtzV1VGQldUdEJRVU5hTEZkQlFVODdRVUZEV0N4TlFVRkpMRWxCUVVrc1dVRkJXVHRCUVVOd1FpeE5RVUZKTEV0QlFVc3NiMEpCUVc5Q08wRkJRemRDTEUxQlFVa3NZMEZCWXl4SFFVRkhMRXRCUVVzc1JVRkJSVHRCUVVNMVFpeE5RVUZKTEVsQlFVa3NXVUZCV1R0QlFVTndRaXhUUVVGUExFTkJRVU1zV1VGQldTeFJRVUZSTEVOQlFVTXNXVUZCV1N4TlFVRk5PMEZCUXpORExGRkJRVWtzU1VGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlN4UFFVRlBMRXRCUVVzc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeFRRVUZUTzBGQlF5OURMR0ZCUVU4N1FVRkRXQ3hSUVVGSkxFVkJRVVVzVFVGQlRTeEZRVUZGTEZGQlFWRXNTVUZEWml4SlFVRkxMR1ZCUVdNc1IwRkJSeXhMUVVGTExFVkJRVVVzVDBGQlR5eFJRVU53UXl4SlFVRkxMR1ZCUVdNc1IwRkJSeXhMUVVGTExFVkJRVVVzVDBGQlR6dEJRVUZCTzBGQlJTOURMRk5CUVU4N1FVRkJRVHRCUVVWWUxEWkNRVUUyUWl4TlFVRk5PMEZCUXk5Q0xFMUJRVWtzVVVGQlVTeGhRVUZoTEZGQlFWRXNUMEZCVHl4RFFVRkZMRWRCUVVjc1IwRkJSeXhIUVVGSE8wRkJRMjVFTEZOQlFVODdRVUZCUVN4SlFVTklMRTFCUVUwc1UwRkJWU3hMUVVGTE8wRkJRMnBDTEZWQlFVa3NZMEZCWXl4VlFVRlZMRk5CUVZNN1FVRkRja01zWVVGQlR5eFBRVUZQTzBGQlExWXNaMEpCUVZFc1RVRkJUVHRCUVVGQkxHVkJRMHc3UVVGRFJDeHJRa0ZCVFN4SlFVRkpPMEZCUTFZc1owSkJRVWtzWVVGQllUdEJRVU5pTEhGQ1FVRlBMRTFCUVUwc1JVRkJSU3hMUVVGTExFbEJRVWtzUzBGQlN5eE5RVUZOTEVWQlFVVXNVVUZCVVR0QlFVTjZReXgzUWtGQlVTeERRVUZGTEVsQlFVa3NUMEZCVHl4SFFVRkhMRTFCUVUwc1JVRkJSU3hIUVVGSExFZEJRVWM3UVVGQlFTeHRRa0ZGZWtNN1FVRkRSQ3h4UWtGQlR5eE5RVUZOTEVWQlFVVTdRVUZEV0N4M1FrRkJVU3hEUVVGRkxFbEJRVWtzVDBGQlR5eEhRVUZITEUxQlFVMHNSVUZCUlN4SFFVRkhMRWRCUVVjN1FVRkJRVHRCUVVGQkxHVkJSVGRETzBGQlEwUXNhMEpCUVUwc1NVRkJTVHRCUVVOV0xHZENRVUZKTEVOQlFVTXNaVUZCWlN4SlFVRkpMRXRCUVVzc1RVRkJUU3hGUVVGRkxFOUJRVTg3UVVGRGVFTXNjVUpCUVU4c1EwRkJSU3hQUVVGUExFMUJRVTBzUjBGQlJ5eE5RVUZOTzBGQlFVRXNaVUZEYkVNN1FVRkRSQ3huUWtGQlNTeE5RVUZOTEVWQlFVVXNSMEZCUnp0QlFVTllMRzlDUVVGTkxFbEJRVWs3UVVGRFZpeHpRa0ZCVVN4RFFVRkZMRWxCUVVrc1QwRkJUeXhIUVVGSExFMUJRVTBzUlVGQlJTeEhRVUZITEVkQlFVYzdRVUZEZEVNN1FVRkJRVHRCUVVGQkxHVkJSVWc3UVVGRFJDeHZRa0ZCVVN4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVjeFFpeGhRVUZQTEVOQlFVVXNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVrelFpeHRRa0ZCYlVJc1VVRkJVVHRCUVVOMlFpeE5RVUZKTEV0QlFVazdRVUZEVWl4TlFVRkpMRTlCUVZVc1UwRkJTeXhQUVVGUExFOUJRVThzVVVGQlVTeFJRVUZQTEZOQlFWTXNVMEZCVXl4SlFVRkhMRTFCUVUwc1MwRkJVU3hSUVVGTExFOUJRVThzVDBGQlR5eFJRVUZSTEU5QlFVOHNVMEZCVXl4VFFVRlRMRWRCUVVjc1RVRkJUVHRCUVVOb1NpeE5RVUZKTEVsQlFVa3NUMEZCVHl4SlFVRkpMRTFCUVUwc1QwRkJUeXhMUVVGTExFMUJRVTA3UVVGRE0wTXNUVUZCU1N4SFFVRkhPMEZCUTBnc1VVRkJTU3hKUVVGSkxFMUJRVTBzVFVGQlRTeE5RVUZOTzBGQlF6RkNMRkZCUVVrc1dVRkJXU3hUUVVGVExFbEJRVWs3UVVGRE4wSXNVVUZCU1N4bFFVRmxMRTlCUVU4N1FVRkRNVUlzVjBGQlR5eFBRVUZQTEdGQlFXRTdRVUZETTBJc1YwRkJUeXhMUVVGTExHRkJRV0U3UVVGRGVrSXNWMEZCVHl4TFFVRkxMR0ZCUVdFN1FVRkRla0lzWTBGQlZTeExRVUZMTEdGQlFXRTdRVUZETlVJc1YwRkJUeXhMUVVGTE8wRkJRMW9zWTBGQlZTeEpRVUZKTEdGQlFXRTdRVUZCUVR0QlFVVXZRaXhUUVVGUExFbEJRVWtzWVVGQllUdEJRVUZCTzBGQlJUVkNMSE5DUVVGelFpeExRVUZKTzBGQlEzUkNMRTFCUVVrc1NVRkJTU3hKUVVGSExFZEJRVWNzU1VGQlNTeEpRVUZITzBGQlEzSkNMRk5CUVZFc1MwRkJTeXhKUVVGSkxFdEJRVXNzU1VGQlNTeEZRVUZGTEVkQlFVY3NSVUZCUlN4TFFVRkxMRVZCUVVVc1NVRkJTeXhKUVVGSkxFVkJRVVVzU1VGQlNTeExRVUZMTzBGQlFVRTdRVUZIYUVVc1NVRkJTU3d3UWtGQk1FSTdRVUZCUVN4RlFVTXhRaXhQUVVGUE8wRkJRVUVzUlVGRFVDeFBRVUZQTzBGQlFVRXNSVUZEVUN4UlFVRlJMRk5CUVZVc1RVRkJUVHRCUVVOd1FpeFJRVUZKTEZOQlFWTXNTMEZCU3l4UFFVRlBPMEZCUTNwQ0xGRkJRVWtzWVVGQllTeEpRVUZKTEZOQlFWTXNTMEZCU3l4VFFVRlRMRXRCUVVzN1FVRkRha1FzVjBGQlR5eFRRVUZUTEZOQlFWTXNTVUZCU1N4UFFVRlBMRU5CUVVVc1QwRkJUeXhUUVVGVkxGZEJRVmM3UVVGRE1VUXNWVUZCU1N4UlFVRlJMRXRCUVVzc1RVRkJUVHRCUVVOMlFpeFZRVUZKTEZOQlFWTXNUVUZCVFR0QlFVTnVRaXhWUVVGSkxHRkJRV0VzVDBGQlR6dEJRVU40UWl4VlFVRkpMR0ZCUVdFc1YwRkJWeXhaUVVGWkxGZEJRVmNzVjBGQlZ6dEJRVU01UkN4VlFVRkpMR0ZCUVdFc1UwRkJVeXhUUVVGVExFbEJRVWtzVVVGQlVTeERRVUZGTEZGQlFWRXNVMEZCVlN4TFFVRkxPMEZCUTJoRkxGbEJRVWtzVVVGQlVTeEpRVUZKTzBGQlEyaENMRmxCUVVrc1pVRkJaU3hOUVVGTkxHZENRVUZwUWl4UFFVRk5MR1ZCUVdVN1FVRkRMMFFzV1VGQlNTeGpRVUZqTEZOQlFWVXNWMEZCVnp0QlFVTnVReXhqUVVGSkxFOUJRVThzVjBGQlZ5eFRRVUZUTEUxQlFVMHNXVUZCV1N4TlFVRk5PMEZCUTNaRUxHbENRVUZSTEdGQlFXRXNVMEZEYUVJc1kwRkJZU3hSUVVGUkxFbEJRVWs3UVVGQlFUdEJRVVZzUXl4WlFVRkpMR0ZCUVdFc1dVRkJXVHRCUVVNM1FpeFpRVUZKTEdWQlFXVXNXVUZCV1R0QlFVTXZRaXhaUVVGSkxFOUJRVThzU1VGQlNUdEJRVU5tTEZsQlFVa3NUVUZCU3l4SlFVRkpMRk5CUVZNc1owSkJRMmhDTEVOQlFVTXNTVUZCU1N4VFFVTk1MRWxCUVVrc1UwRkJVeXhYUVVOVUxFTkJRVU1zU1VGQlNTeFJRVU5NTEVsQlFVa3NUMEZCVHl4VFFVRlRMRXRCUTJoQ0xFTkJRVU1zU1VGQlNTeEpRVUZKTEZWQlExUXNTVUZCU1N4UlFVRlBMRWxCUVVjc1NVRkJTU3hWUVVGVkxFbEJRVWM3UVVGRE4wTXNXVUZCU1N4WFFVRlhMRWxCUVVrc1RVRkJUVHRCUVVONlFpeGxRVUZQTEUxQlFVMHNUMEZCVHl4TFFVRkxMRXRCUVVzc1UwRkJWU3hMUVVGTE8wRkJRM3BETEdOQlFVa3NVVUZCVVN4UlFVRlBPMEZCUTJZc1owSkJRVWtzVTBGQlV6dEJRVU5VTEhOQ1FVRlBMRWxCUVVrN1FVRkRaaXgxUWtGQlZ5eFJRVUZSTzBGQlEyNUNMR2RDUVVGSkxGVkJRVlVzZDBKQlFYZENMRTlCUVUwN1FVRkROVU1zWjBKQlFVa3NRMEZCUXl4WFFVRlhMRk5CUVZNc1QwRkJUenRCUVVNMVFpd3lRa0ZCWVN4UlFVRlJPMEZCUVVFN1FVRkZla0lzWjBKQlFVa3NWMEZCVnl4VFFVRlRPMEZCUTNCQ0xHMURRVUZ4UWl4aFFVRmhMRkZCUVZFc1UwRkJVenRCUVVGQk8wRkJRVUVzY1VKQlIyeEVMRTlCUVUwN1FVRkRXQ3huUWtGQlNTeFJRVUZSTEVOQlFVVXNUVUZCVFN4TlFVRkxMRTlCUVU4c1NVRkJTU3hOUVVGTE8wRkJRM3BETEhsQ1FVRmhMRWxCUVVrN1FVRkRha0lzZFVKQlFWY3NTVUZCU1R0QlFVRkJMR2xDUVVWa08wRkJRMFFzZFVKQlFWY3NTVUZCU1R0QlFVTm1MSGxDUVVGaExFbEJRVWs3UVVGRGFrSXNiVUpCUVU4c1VVRkJVU3hSUVVGUkxGTkJRVlVzUzBGQlN6dEJRVUZGTEhGQ1FVRlBMRmxCUVZrc1NVRkJTU3hOUVVGTkxFbEJRVWs3UVVGQlFUdEJRVUZCTzBGQlJUZEZMR2xDUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWR1UWl4VlFVRkpMRmRCUVZjc1UwRkJWU3hMUVVGSk8wRkJRM3BDTEZsQlFVa3NTVUZCU1R0QlFVTlNMRmxCUVVrc1MwRkJTeXhKUVVGSExFOUJRVThzVVVGQlVTeEhRVUZITEU5QlFVOHNVVUZCVVN4SFFVRkhPMEZCUTJoRUxHVkJRVTg3UVVGQlFTeFZRVU5JTzBGQlFVRXNWVUZEUVN4SlFVRkpMRk5CUVZVc1RVRkJTeXhOUVVGTkxGZEJRVmNzVVVGQlVTeFBRVUZQTEZOQlFWTXNTMEZCU3l4TFFVRkxMRk5CUVZVc1RVRkJTeXhOUVVGTkxGZEJRVmNzVVVGQlVTeFBRVUZQTEZOQlFWTXNTMEZCU3l4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVkb1NpeFZRVUZKTEd0Q1FVRnJRanRCUVVGQkxGRkJRMnhDTEV0QlFVc3NVMEZCVlN4TFFVRkxPMEZCUVVVc2FVSkJRVThzUTBGQlF5eFpRVUZaTEVsQlFVa3NVMEZCVXl4SlFVRkpPMEZCUVVFN1FVRkJRU3hSUVVNelJDeFRRVUZUTEZOQlFWVXNTMEZCU3p0QlFVRkZMR2xDUVVGUExFTkJRVU1zV1VGQldTeEpRVUZKTEZkQlFWY3NVVUZCVVN4SlFVRkpPMEZCUVVFN1FVRkJRU3hSUVVONlJTeFBRVUZQTzBGQlFVRXNVVUZEVUN4UFFVRlBPMEZCUVVFc1VVRkRVQ3haUVVGWk8wRkJRVUU3UVVGRmFFSXNWMEZCU3l4cFFrRkJhVUlzVVVGQlVTeFRRVUZWTEZGQlFWRTdRVUZETlVNc2JVSkJRVmNzVlVGQlZTeFRRVUZWTEV0QlFVczdRVUZEYUVNc1kwRkJTU3hUUVVGVExFbEJRVWs3UVVGRGFrSXNZMEZCU1N4UlFVRlJPMEZCUTFJc1owSkJRVWtzWTBGQll5eFRRVUZWTEZkQlFWYzdRVUZEYmtNc2EwSkJRVWtzVDBGQlR5eFhRVUZYTEZOQlFWTXNUVUZCVFN4WlFVRlpMRTFCUVUwN1FVRkRka1FzY1VKQlFWRXNUMEZCVHl4VFFVTldMRkZCUVU4c1VVRkJVU3hKUVVGSk8wRkJRVUU3UVVGRk5VSXNaMEpCUVVrc1pVRkJaU3haUVVGWk8wRkJReTlDTEdkQ1FVRkpMR2xDUVVGcFFpeFpRVUZaTzBGQlEycERMR2RDUVVGSkxFMUJRVXNzWjBKQlFXZENMRkZCUVZFc1RVRkJUU3hsUVVGbExFbEJRVWNzU1VGQlNTeG5Ra0ZCWjBJc1NVRkJSenRCUVVOb1JpeDNRa0ZCV1N4aFFVRmhMRkZCUVZFc1NVRkJTU3hKUVVGSk8wRkJRM3BETEdkQ1FVRkpMRU5CUVVNc1lVRkJZU3hqUVVGak8wRkJRelZDTEd0Q1FVRkpMRmRCUVZjc1UwRkJVenRCUVVOd1Fpd3JRa0ZCWlN4SlFVRkpPMEZCUVVFc2NVSkJSV3hDTzBGQlEwUXNiMEpCUVVrc1owSkJRV2RDTEZkQlFWY3NWMEZETTBJc1dVRkRRU3hKUVVGSkxGVkJRMG9zVFVGQlRTeE5RVUZOTEZOQlFWTXNVMEZCVXl4SlFVRkpMRTFCUVUwc1EwRkJSU3hSUVVGUk8wRkJRM1JFTEhWQ1FVRlBMRTFCUVUwc1VVRkJVU3hOUVVGTkxFMUJRVTBzVjBGQlZ5eExRVUZMTEZOQlFWVXNTMEZCU3p0QlFVTTFSQ3h6UWtGQlNTeFhRVUZYTEZOQlFWTTdRVUZEY0VJc2QwSkJRVWtzV1VGQldTeEpRVUZKTEZGQlFWRTdRVUZEZUVJc05rSkJRVThzWTBGQll5eExRVUZMTEZOQlFWVXNTMEZCU1R0QlFVTndReXcwUWtGQlNTeG5Ra0ZCWjBJc1NVRkJSenRCUVVOMlFpeHhRMEZCWVN4UlFVRlJPMEZCUTNKQ0xDdENRVUZQTzBGQlFVRTdRVUZCUVR0QlFVZG1MSGRDUVVGSkxGRkJRVkVzU1VGQlNTeFRRVU5XTEVsQlFVa3NUMEZCVHl4SlFVRkpMR05CUTJZc1NVRkJTVHRCUVVOV0xIZENRVUZKTEVsQlFVa3NVVUZCVVR0QlFVTmFMRzFEUVVGaExGRkJRVkU3UVVGQlFTd3lRa0ZGY0VJN1FVRkRSQ3h4UTBGQlpTeFJRVUZSTzBGQlFVRTdRVUZCUVN3MlFrRkhkRUlzVjBGQlZ5eGpRVUZqTzBGQlF6bENMSGRDUVVGSkxGZEJRVmM3UVVGRFppeDNRa0ZCU1N4bFFVRmxMRWxCUVVrN1FVRkRka0lzTWtKQlFWRXNXVUZEU2l4UFFVRlBMRTlCUVU4c1ZVRkJWVHRCUVVGQkxITkNRVU53UWl4TFFVRkxPMEZCUVVFc2QwSkJRMFFzUzBGQlN5eFhRVUZaTzBGQlEySXNlVU5CUVdVc1QwRkJUeXhUUVVGVE8wRkJReTlDTEdsRFFVRlBMRk5CUVZNN1FVRkJRVHRCUVVGQk8wRkJRVUVzYzBKQlIzaENMRmxCUVZrN1FVRkJRU3gzUWtGRFVpeExRVUZMTEZkQlFWazdRVUZEWWl3NFFrRkJTU3hQUVVGUExGTkJRVk03UVVGRGNFSXNlVU5CUVdVc1QwRkJUenRCUVVOMFFpeHBRMEZCVHp0QlFVRkJPMEZCUVVFN1FVRkJRU3h6UWtGSFppeFBRVUZQTzBGQlFVRXNkMEpCUTBnc1MwRkJTeXhYUVVGWk8wRkJRMklzTUVOQlFXZENMR0ZCUVdFc1QwRkJUeXhUUVVGVE8wRkJRemRETEdsRFFVRlBMRk5CUVZNN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXR3UXl4NVFrRkJUenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlMzWkNMR2xDUVVGUExFMUJRVTBzVVVGQlVTeE5RVUZOTEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCUjNwRExHRkJRVTg3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZKZGtJc09FSkJRVGhDTEdGQlFXRXNVVUZCVVN4VFFVRlRMRk5CUVZNN1FVRkRha1VzTkVKQlFUQkNMRWxCUVVrN1FVRkRNVUlzVVVGQlNTeFhRVUZYTEZsQlFWa3NSMEZCUnl4UlFVRlJPMEZCUTNSRExIZENRVUZ2UWl4TFFVRkxPMEZCUTNKQ0xHRkJRVThzVDBGQlR5eFBRVUZQTEVkQlFVY3NWMEZCVnl4UFFVRlBPMEZCUVVFN1FVRkZPVU1zVVVGQlNTeGxRVUZsTEZOQlFWVXNTMEZCU3p0QlFVRkZMR0ZCUVU4c1IwRkJSeXhqUVVGakxGRkJRVkVzVDBGRE9VUXNTVUZCU1N4UlFVRlJMRk5CUVZVc1RVRkJTenRCUVVGRkxHVkJRVThzVTBGQlV5eFBRVUZQTzBGQlFVRXNWMEZEY0VRc1UwRkJVeXhQUVVGUE8wRkJRVUU3UVVGRGRFSXNTVUZCUXl4WlFVRlhMRk5CUVZNc1VVRkJVU3hUUVVGVkxFZEJRVWNzUjBGQlJ6dEJRVU42UXl4VlFVRkpMRk5CUVZNc1YwRkJWeXhYUVVGWExGRkJRVkU3UVVGRE0wTXNWVUZCU1N4VFFVRlRMRmRCUVZjc1YwRkJWeXhSUVVGUk8wRkJRek5ETEZWQlFVa3NTVUZCU1N4UlFVRlJMRmxCUVZrc1IwRkJSenRCUVVNelFpeFpRVUZKTEZWQlFWVTdRVUZEVml4MVFrRkJZVHRCUVVOcVFpeFpRVUZKTEZWQlFWVTdRVUZEVml4MVFrRkJZVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVWszUWl4VFFVRlBMRkZCUVZFc1VVRkJVVHRCUVVGQk8wRkJSek5DTEVsQlFVa3NWVUZCV1N4WFFVRlpPMEZCUTNoQ0xHdENRVUZsTEUxQlFVMHNVMEZCVXp0QlFVTXhRaXhSUVVGSkxGRkJRVkU3UVVGRFdpeFRRVUZMTEdWQlFXVTdRVUZEY0VJc1UwRkJTeXhSUVVGUk8wRkJRMklzVVVGQlNTeFBRVUZQTEU5QlFVMDdRVUZEYWtJc1UwRkJTeXhYUVVGWExGVkJRVlVzVTBGQlV6dEJRVUZCTEUxQlF5OUNMRkZCUVZFc1QwRkJUVHRCUVVGQkxFMUJRVkVzVlVGQlZUdEJRVUZCTEUxQlEyaERMRmRCUVZjc1MwRkJTenRCUVVGQkxFMUJRVmNzWVVGQllTeExRVUZMTzBGQlFVRXNUMEZCWlR0QlFVTm9SU3hUUVVGTExGRkJRVkU3UVVGQlFTeE5RVU5VTEZkQlFWY3NVVUZCVVR0QlFVRkJMRTFCUTI1Q0xHRkJRV0VzVVVGQlVUdEJRVUZCTzBGQlJYcENMRkZCUVVrc1UwRkJVeXhSUVVGUk8wRkJRM0pDTEZOQlFVc3NXVUZCV1R0QlFVTnFRaXhUUVVGTExGbEJRVms3UVVGRGFrSXNVMEZCU3l4alFVRmpPMEZCUTI1Q0xGTkJRVXNzWVVGQllUdEJRVU5zUWl4VFFVRkxMRkZCUVZFN1FVRkRZaXhSUVVGSkxGRkJRVkU3UVVGQlFTeE5RVU5TTEdGQlFXRTdRVUZCUVN4TlFVTmlMR1ZCUVdVN1FVRkJRU3hOUVVObUxHMUNRVUZ0UWp0QlFVRkJMRTFCUTI1Q0xHTkJRV003UVVGQlFTeE5RVU5rTEdkQ1FVRm5RanRCUVVGQkxFMUJRMmhDTEdkQ1FVRm5RanRCUVVGQkxFMUJRMmhDTEZsQlFWazdRVUZCUVN4TlFVTmFMR1ZCUVdVN1FVRkJRU3hOUVVObUxGbEJRVms3UVVGQlFUdEJRVVZvUWl4VlFVRk5MR2xDUVVGcFFpeEpRVUZKTEdGQlFXRXNVMEZCVlN4VFFVRlRPMEZCUTNaRUxGbEJRVTBzYVVKQlFXbENPMEZCUVVFN1FVRkZNMElzVlVGQlRTeG5Ra0ZCWjBJc1NVRkJTU3hoUVVGaExGTkJRVlVzUjBGQlJ5eFJRVUZSTzBGQlEzaEVMRmxCUVUwc1lVRkJZVHRCUVVGQk8wRkJSWFpDTEZOQlFVc3NVMEZCVXp0QlFVTmtMRk5CUVVzc1QwRkJUenRCUVVOYUxGTkJRVXNzUzBGQlN5eFBRVUZQTEUxQlFVMHNXVUZCV1N4WFFVRlhMR2xDUVVGcFFpeFRRVUZUTEVOQlFVVXNUMEZCVHl4RFFVRkRMR2xDUVVGcFFqdEJRVU51Unl4VFFVRkxMRWRCUVVjc1RVRkJUU3haUVVGWkxGTkJRVk1zUzBGQlN5eEhRVUZITEUxQlFVMHNWMEZCVnl4VFFVRlZMRmRCUVZjN1FVRkROMFVzWVVGQlR5eFRRVUZWTEZsQlFWa3NVMEZCVXp0QlFVTnNReXhsUVVGTkxFbEJRVWtzVjBGQldUdEJRVU5zUWl4alFVRkpMRk5CUVZFc1RVRkJUVHRCUVVOc1FpeGpRVUZKTEU5QlFVMHNZMEZCWXp0QlFVTndRaXhuUWtGQlNTeERRVUZETEU5QlFVMDdRVUZEVUN3eVFrRkJZU3hWUVVGVkxFdEJRVXM3UVVGRGFFTXNaMEpCUVVrN1FVRkRRU3gzUWtGQlZUdEJRVUZCTEhGQ1FVVlVMRTlCUVUwc2JVSkJRVzFDTzBGQlF6bENMRzFDUVVGTkxHdENRVUZyUWl4TFFVRkxPMEZCUXpkQ0xHZENRVUZKTzBGQlEwRXNkMEpCUVZVN1FVRkJRU3hwUWtGRllqdEJRVU5FTEhOQ1FVRlZPMEZCUTFZc1owSkJRVWtzVDBGQlR6dEJRVU5ZTEdkQ1FVRkpMRU5CUVVNN1FVRkRSQ3gzUWtGQlZTeDFRa0ZCZFVJN1FVRkROMElzY1VKQlFVc3NSMEZCUnl4TlFVRk5MRmxCUVZrN1FVRkRNVUlzY1VKQlFVc3NSMEZCUnl4TlFVRk5MRmxCUVZrN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlRXeEVMRk5CUVVzc1lVRkJZU3cwUWtGQk5FSTdRVUZET1VNc1UwRkJTeXhSUVVGUkxIVkNRVUYxUWp0QlFVTndReXhUUVVGTExHTkJRV01zTmtKQlFUWkNPMEZCUTJoRUxGTkJRVXNzVlVGQlZTeDVRa0ZCZVVJN1FVRkRlRU1zVTBGQlN5eGpRVUZqTERaQ1FVRTJRanRCUVVOb1JDeFRRVUZMTEVkQlFVY3NhVUpCUVdsQ0xGTkJRVlVzU1VGQlNUdEJRVU51UXl4VlFVRkpMRWRCUVVjc1lVRkJZVHRCUVVOb1FpeG5Ra0ZCVVN4TFFVRkxMRzFFUVVGdFJDeE5RVUZOTEU5QlFVODdRVUZCUVR0QlFVVTNSU3huUWtGQlVTeExRVUZMTEd0RVFVRnJSQ3hOUVVGTkxFOUJRVTg3UVVGRGFFWXNXVUZCVFR0QlFVRkJPMEZCUlZZc1UwRkJTeXhIUVVGSExGZEJRVmNzVTBGQlZTeEpRVUZKTzBGQlF6ZENMRlZCUVVrc1EwRkJReXhIUVVGSExHTkJRV01zUjBGQlJ5eGhRVUZoTEVkQlFVYzdRVUZEY2tNc1owSkJRVkVzUzBGQlN5eHRRa0ZCYlVJc1RVRkJUU3hQUVVGUE8wRkJRVUU3UVVGRk4wTXNaMEpCUVZFc1MwRkJTeXhqUVVGakxFMUJRVTBzVDBGQlR5eHRSRUZCYlVRc1IwRkJSeXhoUVVGaE8wRkJRVUU3UVVGRmJrZ3NVMEZCU3l4VlFVRlZMRlZCUVZVc1VVRkJVVHRCUVVOcVF5eFRRVUZMTEhGQ1FVRnhRaXhUUVVGVkxFMUJRVTBzV1VGQldTeFZRVUZWTEcxQ1FVRnRRanRCUVVGRkxHRkJRVThzU1VGQlNTeE5RVUZOTEZsQlFWa3NUVUZCVFN4WlFVRlpMRlZCUVZVN1FVRkJRVHRCUVVNNVNTeFRRVUZMTEdsQ1FVRnBRaXhUUVVGVkxFbEJRVWs3UVVGRGFFTXNXVUZCVFN4SFFVRkhMRmRCUVZjc1MwRkJTenRCUVVONlFpeHJRa0ZEU3l4UFFVRlBMRk5CUVZVc1IwRkJSenRCUVVGRkxHVkJRVThzUlVGQlJTeFRRVUZUTEUxQlFVMHNVVUZCVVN4TlFVRk5MRk5CUVZNc1EwRkJReXhGUVVGRkxFOUJRVTg3UVVGQlFTeFRRVU12UlN4SlFVRkpMRk5CUVZVc1IwRkJSenRCUVVGRkxHVkJRVThzUlVGQlJTeEhRVUZITEdsQ1FVRnBRaXhMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVVU1UkN4VFFVRkxMRWxCUVVrN1FVRkRWQ3hUUVVGTExFbEJRVWs3UVVGRFZDeFRRVUZMTEVsQlFVazdRVUZEVkN4VFFVRkxMRWxCUVVrN1FVRkRWQ3hYUVVGUExGRkJRVkVzVTBGQlZTeFBRVUZQTzBGQlFVVXNZVUZCVHl4TlFVRk5PMEZCUVVFN1FVRkJRVHRCUVVWdVJDeFRRVUZOTEZWQlFWVXNWVUZCVlN4VFFVRlZMR1ZCUVdVN1FVRkRMME1zVVVGQlNTeE5RVUZOTEd0Q1FVRnJRaXhuUWtGQlowSTdRVUZEZUVNc1dVRkJUU3hKUVVGSkxGZEJRVmNzUzBGQlN6dEJRVU01UWl4dlFrRkJaMElzUzBGQlN5eE5RVUZOTEdkQ1FVRm5RaXhOUVVGTk8wRkJRMnBFTEZGQlFVa3NTMEZCU3l4VFFVRlRMRXRCUVVzc1QwRkJUenRCUVVNeFFpeFpRVUZOTEVsQlFVa3NWMEZCVnl4UFFVRlBPMEZCUTJoRExGTkJRVXNzVVVGQlVTeExRVUZMTEVsQlFVa3NTMEZCU3l4UFFVRlBPMEZCUTJ4RExGRkJRVWtzVjBGQlZ5eExRVUZMTzBGQlEzQkNMRkZCUVVrc2EwSkJRV3RDTEZOQlFWTXNUMEZCVHl4VFFVRlZMRWRCUVVjN1FVRkJSU3hoUVVGUExFVkJRVVVzUzBGQlN5eFpRVUZaTzBGQlFVRXNUMEZCYTBJN1FVRkRha2NzVVVGQlNUdEJRVU5CTEdGQlFVODdRVUZEV0N4elFrRkJhMElzU1VGQlNTeExRVUZMTEZGQlFWRTdRVUZEYmtNc1lVRkJVeXhMUVVGTE8wRkJRMlFzWVVGQlV5eExRVUZMTzBGQlEyUXNiMEpCUVdkQ0xFOUJRVTg3UVVGRGRrSXNVMEZCU3l4UFFVRlBMR0ZCUVdFN1FVRkRla0lzVjBGQlR6dEJRVUZCTzBGQlJWZ3NVMEZCVFN4VlFVRlZMR0ZCUVdFc1UwRkJWU3hKUVVGSk8wRkJRM1pETEZGQlFVa3NVVUZCVVR0QlFVTmFMRmRCUVU4c1MwRkJTeXhQUVVGUExHZENRVUZuUWl4SlFVRkpMR0ZCUVdFc1QwRkJUeXhKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTEZGQlFWRTdRVUZEYmtjc1ZVRkJTU3hEUVVGRExFMUJRVTBzVDBGQlR5eGxRVUZsTzBGQlF6ZENMRmxCUVVrc1EwRkJReXhOUVVGTkxGTkJRVk1zVlVGQlZUdEJRVU14UWl4cFFrRkJUeXhKUVVGSkxGZEJRVmM3UVVGRGRFSTdRVUZCUVR0QlFVVktMR05CUVUwc1QwRkJUeXhOUVVGTk8wRkJRVUU3UVVGRmRrSXNXVUZCVFN4UFFVRlBMR1ZCUVdVc1MwRkJTeXhUUVVGVE8wRkJRVUVzVDBGRE0wTXNTMEZCU3p0QlFVRkJPMEZCUlZvc1UwRkJUU3hWUVVGVkxFMUJRVTBzVTBGQlZTeExRVUZKTzBGQlEyaERMRkZCUVVrc1VVRkJVU3hKUVVGSExFOUJRVThzVTBGQlV5eEpRVUZITEZGQlFWRXNVVUZCVVN4SlFVRkhMRTlCUVU4c1QwRkJUeXhKUVVGSE8wRkJRM1JGTEZGQlFVazdRVUZEUVN4WFFVRkxMRTFCUVUwc1EwRkJSU3hQUVVGak8wRkJReTlDTEZGQlFVa3NZMEZCWXl4TFFVRkxMR0ZCUVdFc1ZVRkJWeXhOUVVGTExHRkJRV0VzVTBGQlV6dEJRVU14UlN4blFrRkJXU3hMUVVGTExFTkJRVVVzVDBGQll5eFJRVUZuUWl4UFFVRlBMRk5CUVZNc1QwRkJUeXhMUVVGTExFOUJRVTg3UVVGRGNFWXNaMEpCUVZrc1MwRkJTeXhUUVVGVkxFZEJRVWNzUjBGQlJ6dEJRVUZGTEdGQlFVOHNSVUZCUlN4UlFVRlJMRVZCUVVVN1FVRkJRVHRCUVVOMFJDeFhRVUZQTzBGQlFVRTdRVUZGV0N4VFFVRk5MRlZCUVZVc1VVRkJVU3hUUVVGVkxFdEJRVWs3UVVGRGJFTXNVVUZCU1N4UlFVRlJMRWxCUVVjc1QwRkJUeXhQUVVGUExFbEJRVWNzVFVGQlRTeFRRVUZUTEVsQlFVYzdRVUZEYkVRc1VVRkJTU3hUUVVGVExFdEJRVXNzWVVGQllTeFJRVUZSTzBGQlEyNURMRmRCUVVzc1lVRkJZU3hUUVVGVExFdEJRVXNzWVVGQllTeFBRVUZQTEU5QlFVOHNVMEZCVlN4SlFVRkpPMEZCUTNKRkxHVkJRVThzVTBGQlV5eEhRVUZITEZkQlFWY3NVMEZETVVJc1QwRkJUeXhIUVVGSExGTkJRVk1zVDBGRFpqdEJRVUZCTzBGQlFVRTdRVUZIYUVJc1YwRkJUenRCUVVGQk8wRkJSVmdzVTBGQlRTeFZRVUZWTEU5QlFVOHNWMEZCV1R0QlFVTXZRaXhYUVVGUExGVkJRVlU3UVVGQlFUdEJRVVZ5UWl4VFFVRk5MRlZCUVZVc1VVRkJVU3hYUVVGWk8wRkJRMmhETEZGQlFVa3NUVUZCVFN4WlFVRlpMRkZCUVZFc1QwRkJUeXhSUVVGUkxFdEJRVXM3UVVGRGJFUXNVVUZCU1N4UFFVRlBPMEZCUTFBc2EwSkJRVmtzVDBGQlR5eExRVUZMTzBGQlF6VkNMRkZCUVVrc1MwRkJTeXhQUVVGUE8wRkJRMW9zVlVGQlNUdEJRVU5CTEdGQlFVc3NUVUZCVFR0QlFVRkJMR1ZCUlZJc1IwRkJVRHRCUVVGQk8wRkJRMEVzVjBGQlN5eFJRVUZSTzBGQlFVRTdRVUZGYWtJc1UwRkJTeXhUUVVGVExGZEJRVmM3UVVGRGVrSXNWVUZCVFN4alFVRmpMRWxCUVVrc1YwRkJWenRCUVVOdVF5eFJRVUZKTEUxQlFVMDdRVUZEVGl4WlFVRk5MRmRCUVZjc1RVRkJUVHRCUVVNelFpeFZRVUZOTEdsQ1FVRnBRaXhKUVVGSkxHRkJRV0VzVTBGQlZTeFRRVUZUTzBGQlEzWkVMRmxCUVUwc2FVSkJRV2xDTzBGQlFVRTdRVUZGTTBJc1ZVRkJUU3huUWtGQlowSXNTVUZCU1N4aFFVRmhMRk5CUVZVc1IwRkJSeXhSUVVGUk8wRkJRM2hFTEZsQlFVMHNZVUZCWVR0QlFVRkJPMEZCUVVFN1FVRkhNMElzVTBGQlRTeFZRVUZWTEZOQlFWTXNWMEZCV1R0QlFVTnFReXhSUVVGSkxGRkJRVkU3UVVGRFdpeFJRVUZKTEdWQlFXVXNWVUZCVlN4VFFVRlRPMEZCUTNSRExGRkJRVWtzVVVGQlVTeExRVUZMTzBGQlEycENMRmRCUVU4c1NVRkJTU3hoUVVGaExGTkJRVlVzVTBGQlV5eFJRVUZSTzBGQlF5OURMRlZCUVVrc1YwRkJWeXhYUVVGWk8wRkJRM1pDTEdOQlFVMDdRVUZEVGl4WlFVRkpMRTFCUVUwc1RVRkJUU3hOUVVGTkxGVkJRVlVzWlVGQlpTeE5RVUZOTzBGQlEzSkVMRmxCUVVrc1dVRkJXU3hMUVVGTExGZEJRVms3UVVGRE4wSXNOa0pCUVcxQ0xFMUJRVTBzVDBGQlR5eE5RVUZOTzBGQlEzUkRPMEZCUVVFN1FVRkZTaXhaUVVGSkxGVkJRVlVzYlVKQlFXMUNPMEZCUTJwRExGbEJRVWtzV1VGQldTeE5RVUZOTzBGQlFVRTdRVUZGTVVJc1ZVRkJTVHRCUVVOQkxHTkJRVTBzU1VGQlNTeFhRVUZYTEdkQ1FVRm5RanRCUVVONlF5eFZRVUZKTEUxQlFVMHNaVUZCWlR0QlFVTnlRaXhqUVVGTkxHVkJRV1VzUzBGQlN6dEJRVUZCTEdGQlJYcENPMEZCUTBRN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGSldpeFRRVUZOTEZWQlFWVXNXVUZCV1N4WFFVRlpPMEZCUTNCRExGZEJRVThzUzBGQlN6dEJRVUZCTzBGQlJXaENMRk5CUVUwc1ZVRkJWU3hUUVVGVExGZEJRVms3UVVGRGFrTXNWMEZCVHl4TFFVRkxMRlZCUVZVN1FVRkJRVHRCUVVVeFFpeFRRVUZOTEZWQlFWVXNaMEpCUVdkQ0xGZEJRVms3UVVGRGVFTXNVVUZCU1N4alFVRmpMRXRCUVVzc1QwRkJUenRCUVVNNVFpeFhRVUZQTEdWQlFXZENMRmxCUVZrc1UwRkJVenRCUVVGQk8wRkJSV2hFTEZOQlFVMHNWVUZCVlN4WlFVRlpMRmRCUVZrN1FVRkRjRU1zVjBGQlR5eExRVUZMTEU5QlFVOHNaMEpCUVdkQ08wRkJRVUU3UVVGRmRrTXNVMEZCVFN4VlFVRlZMRzlDUVVGdlFpeFhRVUZaTzBGQlF6VkRMRmRCUVU4c1MwRkJTeXhQUVVGUE8wRkJRVUU3UVVGRmRrSXNVMEZCVHl4bFFVRmxMRTlCUVUwc1YwRkJWeXhWUVVGVk8wRkJRVUVzU1VGRE4wTXNTMEZCU3l4WFFVRlpPMEZCUTJJc1ZVRkJTU3hSUVVGUk8wRkJRMW9zWVVGQlR5eExRVUZMTEV0QlFVc3NXVUZCV1N4SlFVRkpMRk5CUVZVc1RVRkJUVHRCUVVGRkxHVkJRVThzVFVGQlRTeFhRVUZYTzBGQlFVRTdRVUZCUVR0QlFVRkJMRWxCUlM5RkxGbEJRVms3UVVGQlFTeEpRVU5hTEdOQlFXTTdRVUZCUVR0QlFVVnNRaXhUUVVGTkxGVkJRVlVzWTBGQll5eFhRVUZaTzBGQlEzUkRMRkZCUVVrc1QwRkJUeXgxUWtGQmRVSXNUVUZCVFN4TlFVRk5PMEZCUXpsRExGZEJRVThzUzBGQlN5eGhRVUZoTEUxQlFVMHNUVUZCVFR0QlFVRkJPMEZCUlhwRExGTkJRVTBzVlVGQlZTeGxRVUZsTEZOQlFWVXNUVUZCVFN4UlFVRlJMRmRCUVZjN1FVRkRPVVFzVVVGQlNTeFJRVUZSTzBGQlExb3NVVUZCU1N4dlFrRkJiMElzU1VGQlNUdEJRVU0xUWl4UlFVRkpMRU5CUVVNc2NVSkJRWEZDTEd0Q1FVRnJRaXhQUVVGUExGRkJRVkVzUzBGQlN5eFJRVUZSTEZOQlFWTTdRVUZETjBVc01FSkJRVzlDTzBGQlEzaENMRkZCUVVrc2JVSkJRVzFDTEV0QlFVc3NVVUZCVVN4VFFVRlRPMEZCUXpkRExGZEJRVThzUzBGQlN5eFJRVUZSTEV0QlFVc3NTVUZCU1N4UlFVRlJMRXRCUVVzN1FVRkRNVU1zVVVGQlNTeFRRVUZUTzBGQlEySXNVVUZCU1R0QlFVTkJMRzFDUVVGaExFOUJRVThzU1VGQlNTeFRRVUZWTEU5QlFVODdRVUZEY2tNc1dVRkJTU3haUVVGWkxHbENRVUZwUWl4TlFVRk5MRkZCUVZFc1RVRkJUU3hQUVVGUE8wRkJRelZFTEZsQlFVa3NUMEZCVHl4alFVRmpPMEZCUTNKQ0xHZENRVUZOTEVsQlFVa3NWVUZCVlR0QlFVTjRRaXhsUVVGUE8wRkJRVUU3UVVGRldDeFZRVUZKTEZGQlFWRXNUMEZCVHl4VFFVRlRPMEZCUTNoQ0xHdENRVUZWTzBGQlFVRXNaVUZEVEN4UlFVRlJMRkZCUVZFc1VVRkJVVHRCUVVNM1FpeHJRa0ZCVlR0QlFVRkJPMEZCUlZZc1kwRkJUU3hKUVVGSkxGZEJRVmNzWjBKQlFXZENMQ3RDUVVFclFqdEJRVU40UlN4VlFVRkpMRzFDUVVGdFFqdEJRVU51UWl4WlFVRkpMR3RDUVVGclFpeFRRVUZUTEZsQlFWa3NXVUZCV1N4WFFVRlhPMEZCUXpsRUxHTkJRVWtzYTBKQlFXdENPMEZCUTJ4Q0xHZERRVUZ2UWp0QlFVRkJPMEZCUjNCQ0xHdENRVUZOTEVsQlFVa3NWMEZCVnl4bFFVRmxPMEZCUVVFN1FVRkZOVU1zV1VGQlNTeHRRa0ZCYlVJN1FVRkRia0lzY1VKQlFWY3NVVUZCVVN4VFFVRlZMRmRCUVZjN1FVRkRjRU1zWjBKQlFVa3NjVUpCUVhGQ0xHdENRVUZyUWl4WFFVRlhMRkZCUVZFc1pVRkJaU3hKUVVGSk8wRkJRemRGTEd0Q1FVRkpMR3RDUVVGclFqdEJRVU5zUWl4dlEwRkJiMEk3UVVGQlFUdEJRVWR3UWl4elFrRkJUU3hKUVVGSkxGZEJRVmNzWlVGQlpTeFhRVUZYTEZsQlF6TkRPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTWEJDTEZsQlFVa3NiMEpCUVc5Q0xIRkNRVUZ4UWl4RFFVRkRMR3RDUVVGclFpeFJRVUZSTzBGQlEzQkZMRGhDUVVGdlFqdEJRVUZCTzBGQlFVRTdRVUZCUVN4aFFVbDZRaXhIUVVGUU8wRkJRMGtzWVVGQlR5eHZRa0ZEU0N4clFrRkJhMElzVTBGQlV5eE5RVUZOTEZOQlFWVXNSMEZCUnl4UlFVRlJPMEZCUVVVc1pVRkJUenRCUVVGQkxGZEJReTlFTEZWQlFWVTdRVUZCUVR0QlFVVnNRaXhSUVVGSkxHMUNRVUZ0UWl4elFrRkJjMElzUzBGQlN5eE5RVUZOTEUxQlFVMHNVMEZCVXl4WlFVRlpMRzFDUVVGdFFqdEJRVU4wUnl4WFFVRlJMRzlDUVVOS0xHdENRVUZyUWl4VFFVRlRMRk5CUVZNc2EwSkJRV3RDTEZWQlEzUkVMRWxCUVVrc1VVRkRRU3hQUVVGUExFbEJRVWtzVjBGQlZ5eFhRVUZaTzBGQlFVVXNZVUZCVHl4TlFVRk5MRmRCUVZjN1FVRkJRU3hUUVVNMVJDeExRVUZMTEZkQlFWYzdRVUZCUVR0QlFVVTFRaXhUUVVGTkxGVkJRVlVzVVVGQlVTeFRRVUZWTEZkQlFWYzdRVUZEZWtNc1VVRkJTU3hEUVVGRExFOUJRVThzUzBGQlN5eFpRVUZaTEZsQlFWazdRVUZEY2tNc1dVRkJUU3hKUVVGSkxGZEJRVmNzWVVGQllTeFhRVUZYTEZsQlFWazdRVUZCUVR0QlFVVTNSQ3hYUVVGUExFdEJRVXNzVjBGQlZ6dEJRVUZCTzBGQlJUTkNMRk5CUVU4N1FVRkJRVHRCUVVkWUxFbEJRVWtzYlVKQlFXMUNMRTlCUVU4c1YwRkJWeXhsUVVGbExHZENRVUZuUWl4VFFVTnNSU3hQUVVGUExHZENRVU5RTzBGQlEwNHNTVUZCU1N4aFFVRmxMRmRCUVZrN1FVRkRNMElzZFVKQlFXOUNMRmRCUVZjN1FVRkRNMElzVTBGQlN5eGhRVUZoTzBGQlFVRTdRVUZGZEVJc1kwRkJWeXhWUVVGVkxGbEJRVmtzVTBGQlZTeEhRVUZITEU5QlFVOHNWVUZCVlR0QlFVTXpSQ3hYUVVGUExFdEJRVXNzVjBGQlZ5eFBRVUZQTEUxQlFVMHNZVUZCWVN4RFFVRkZMRTFCUVUwc1IwRkJSeXhQUVVGakxGbEJRWFZDTzBGQlFVRTdRVUZGY2tjc1kwRkJWeXhWUVVGVkxHOUNRVUZ2UWl4WFFVRlpPMEZCUTJwRUxGZEJRVTg3UVVGQlFUdEJRVVZZTEZOQlFVODdRVUZCUVR0QlFVZFlMR2REUVVGblF5eFJRVUZSTEZGQlFWRTdRVUZETlVNc1QwRkJTeXhSUVVGUkxGRkJRVkVzVTBGQlZTeE5RVUZOTzBGQlEycERMRkZCUVVrc1YwRkJWeXhQUVVGUExGTkJRVlVzVVVGQlR5eFJRVUZSTEVsQlFVazdRVUZEYmtRc1owSkJRVmtzVlVGQlZTeFBRVUZQTzBGQlFVRTdRVUZGYWtNc1UwRkJUenRCUVVGQk8wRkJSMWdzYlVKQlFXMUNMRk5CUVZNN1FVRkRlRUlzVTBGQlR5eEpRVUZKTEZkQlFWY3NVMEZCVlN4VlFVRlZPMEZCUTNSRExGRkJRVWtzYlVKQlFXMUNMR2RDUVVGblFqdEJRVU4yUXl4eFFrRkJhVUlzVVVGQlVUdEJRVU55UWl4VlFVRkpMR3RDUVVGclFqdEJRVU5zUWp0QlFVRkJPMEZCUlVvc1ZVRkJTU3hQUVVGUExGZEJRVms3UVVGQlJTeGxRVUZQTEZOQlFWTXNVMEZCVXl4RFFVRkZMRkZCUVdkQ0xFOUJRVTg3UVVGQlFUdEJRVU16UlN4VlFVRkpMRXRCUVVzc1NVRkJTU3hSUVVWTUxFOUJRVThzU1VGQlNTeFhRVUZYTEZGQlEzaENPMEZCUTA0c1ZVRkJTU3hyUWtGQmEwSTdRVUZEYkVJc1YwRkJSeXhMUVVGTExIbENRVUY1UWp0QlFVRkJPMEZCUlhKRExHRkJRVTg3UVVGQlFUdEJRVVZZTEZGQlFVa3NVMEZCVXp0QlFVTmlMRkZCUVVrc1dVRkJXVHRCUVVOb1FpeFJRVUZKTEdGQlFXRTdRVUZEYWtJc1VVRkJTU3hsUVVGbE8wRkJRVUVzVlVGRFdDeFRRVUZUTzBGQlExUXNaVUZCVHp0QlFVRkJPMEZCUVVFc1RVRkZXQ3hoUVVGaExGZEJRVms3UVVGRGNrSXNhVUpCUVZNN1FVRkRWQ3h4UWtGQllTeFpRVUZaTEZsQlFWazdRVUZCUVR0QlFVRkJPMEZCUnpkRExHRkJRVk1zVTBGQlV5eFRRVUZUTEUxQlFVMDdRVUZEYWtNc1VVRkJTU3hYUVVGWExFOUJRVThzYlVKQlFXMUNPMEZCUTNwRExEUkNRVUYzUWp0QlFVTndRaXhoUVVGUExFdEJRVXNzV1VGQldTeExRVUZMTEZOQlFWVXNTMEZCU3p0QlFVTjRReXhsUVVGUExGVkJRVlVzVVVGQlVTeGpRVUZqTEZWQlFWVXNUVUZCVFN4WFFVRlhPMEZCUVVFN1FVRkJRVHRCUVVjeFJTeFJRVUZKTEcxQ1FVRnRRaXhUUVVGVkxFOUJRVTg3UVVGRGNFTXNOa0pCUVhWQ0xGZEJRVmM3UVVGRGJFTXNWVUZCU1N4blFrRkJaMEk3UVVGRGFFSTdRVUZCUVR0QlFVRkJPMEZCUjFJc1VVRkJTU3hWUVVGVkxGZEJRVms3UVVGRGRFSXNWVUZCU1N4WlFVRlpPMEZCUTFvN1FVRkRTaXhyUWtGQldUdEJRVU5hTEZWQlFVa3NVMEZCVXp0QlFVTmlMRlZCUVVrc1RVRkJUU3hSUVVGUk8wRkJRMnhDTEZWQlFVa3NRMEZCUXl4clFrRkJhMEk3UVVGRGJrSXNjVUpCUVdFc1pVRkJaVHRCUVVNMVFpd3lRa0ZCYlVJN1FVRkJRVHRCUVVWMlFpeHBRa0ZCVnp0QlFVTllMR05CUVZFc1VVRkJVU3hMUVVGTExFdEJRVXNzVTBGQlZTeFJRVUZSTzBGQlEzaERMRzFDUVVGWE8wRkJRMWdzV1VGQlNUdEJRVU5CTzBGQlEwb3NXVUZCU1N4blFrRkJaMEk3UVVGRGFFSTdRVUZCUVN4bFFVVkRPMEZCUTBRc2MwSkJRVms3UVVGRFdpeDFRa0ZCWVR0QlFVTmlMRzFDUVVGVExGRkJRVkVzVTBGQlV5eExRVUZMTzBGQlFVRTdRVUZCUVN4VFFVVndReXhUUVVGVkxFdEJRVXM3UVVGRFpDeHRRa0ZCVnp0QlFVTllMR2xDUVVGVExGTkJRVk1zVTBGQlV5eE5RVUZOTzBGQlEycERMSEZDUVVGaE8wRkJRVUU3UVVGQlFUdEJRVWR5UWp0QlFVTkJMRmRCUVU4N1FVRkJRVHRCUVVGQk8wRkJTV1lzU1VGQlNTeFJRVUZSTzBGQlExb3NUVUZCVFN4UFFVRlBMRk5CUVZNc1UwRkJVeXhKUVVGSkxIRkNRVUZ4UWp0QlFVRkJMRVZCUTNCRUxGRkJRVkVzVTBGQlZTeGpRVUZqTzBGQlF6VkNMRkZCUVVrc1MwRkJTeXhKUVVGSkxFMUJRVTA3UVVGRGJrSXNWMEZCVHl4SFFVRkhPMEZCUVVFN1FVRkJRU3hGUVVWa0xGRkJRVkVzVTBGQlZTeE5RVUZOTzBGQlEzQkNMRmRCUVU4c1NVRkJTU3hOUVVGTkxFMUJRVTBzUTBGQlJTeFJRVUZSTEV0QlFVMHNUMEZCVHl4TFFVRkxMRk5CUVZVc1NVRkJTVHRCUVVNM1JDeFRRVUZITzBGQlEwZ3NZVUZCVHp0QlFVRkJMRTlCUTFJc1RVRkJUU3gxUWtGQmRVSXNWMEZCV1R0QlFVRkZMR0ZCUVU4N1FVRkJRVHRCUVVGQk8wRkJRVUVzUlVGRmVrUXNhMEpCUVd0Q0xGTkJRVlVzU1VGQlNUdEJRVU0xUWl4UlFVRkpPMEZCUTBFc1lVRkJUeXhwUWtGQmFVSXNUVUZCVFN4alFVRmpMRXRCUVVzN1FVRkJRU3hoUVVVNVF5eExRVUZRTzBGQlEwa3NZVUZCVHl4VlFVRlZMRWxCUVVrc1YwRkJWenRCUVVGQk8wRkJRVUU3UVVGQlFTeEZRVWQ0UXl4aFFVRmhMRmRCUVZrN1FVRkRja0lzYlVKQlFXVXNVMEZCVXp0QlFVTndRaXhoUVVGUExFMUJRVTA3UVVGQlFUdEJRVVZxUWl4WFFVRlBPMEZCUVVFN1FVRkJRU3hGUVVWWUxHMUNRVUZ0UWl4VFFVRlZMRmRCUVZjN1FVRkRjRU1zVjBGQlR5eEpRVUZKTEZGQlExQXNUMEZCVHl4SlFVRkpMRmRCUVZjc1lVRkRkRUk3UVVGQlFUdEJRVUZCTEVWQlJWSTdRVUZCUVN4RlFVRlZMRTlCUVU4c1UwRkJWU3hoUVVGaE8wRkJRM0JETEZkQlFVOHNWMEZCV1R0QlFVTm1MRlZCUVVrN1FVRkRRU3haUVVGSkxFdEJRVXNzWTBGQll5eFpRVUZaTEUxQlFVMHNUVUZCVFR0QlFVTXZReXhaUVVGSkxFTkJRVU1zVFVGQlRTeFBRVUZQTEVkQlFVY3NVMEZCVXp0QlFVTXhRaXhwUWtGQlR5eGhRVUZoTEZGQlFWRTdRVUZEYUVNc1pVRkJUenRCUVVGQkxHVkJSVW9zUjBGQlVEdEJRVU5KTEdWQlFVOHNWVUZCVlR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQkxFVkJSekZDTEU5QlFVOHNVMEZCVlN4aFFVRmhMRTFCUVUwc1RVRkJUVHRCUVVONlF5eFJRVUZKTzBGQlEwRXNWVUZCU1N4TFFVRkxMR05CUVdNc1dVRkJXU3hOUVVGTkxFMUJRVTBzVVVGQlVUdEJRVU4yUkN4VlFVRkpMRU5CUVVNc1RVRkJUU3hQUVVGUExFZEJRVWNzVTBGQlV6dEJRVU14UWl4bFFVRlBMR0ZCUVdFc1VVRkJVVHRCUVVOb1F5eGhRVUZQTzBGQlFVRXNZVUZGU2l4SFFVRlFPMEZCUTBrc1lVRkJUeXhWUVVGVk8wRkJRVUU3UVVGQlFUdEJRVUZCTEVWQlIzcENMRzlDUVVGdlFqdEJRVUZCTEVsQlEyaENMRXRCUVVzc1YwRkJXVHRCUVVGRkxHRkJRVThzU1VGQlNTeFRRVUZUTzBGQlFVRTdRVUZCUVR0QlFVRkJMRVZCUTNoRExGTkJRVk1zVTBGQlZTeHRRa0ZCYlVJc2FVSkJRV2xDTzBGQlEzUkVMRkZCUVVrc1ZVRkJWU3hoUVVGaExGRkJRVkVzVDBGQlR5eHpRa0ZCYzBJc1lVRkROVVFzVFVGQlRTeHJRa0ZCYTBJc2NVSkJRM2hDTEcxQ1FVTkRMRkZCUVZFc2JVSkJRVzFDTzBGQlEyaERMRmRCUVU4c1NVRkJTU3hSUVVOUUxFbEJRVWtzVFVGQlRTeFJRVUZSTEZkQlEyeENPMEZCUVVFN1FVRkJRU3hGUVVWU0xGTkJRVk03UVVGQlFTeEZRVU5VTEU5QlFVODdRVUZCUVN4SlFVTklMRXRCUVVzc1YwRkJXVHRCUVVGRkxHRkJRVTg3UVVGQlFUdEJRVUZCTEVsQlF6RkNMRXRCUVVzc1UwRkJWU3hQUVVGUE8wRkJRMnhDTEdWQlFWTXNUMEZCVHl4VlFVRlZMRlZCUVZVc1YwRkJXVHRCUVVGRkxHVkJRVTg3UVVGQlFTeFZRVUZWTzBGQlFVRTdRVUZCUVR0QlFVRkJMRVZCUnpORk8wRkJRVUVzUlVGQlowSTdRVUZCUVN4RlFVRm5RanRCUVVGQkxFVkJRV003UVVGQlFTeEZRVU01UXp0QlFVRkJMRVZCUVdkQ0xFbEJRVWs3UVVGQlFTeEZRVUZqTzBGQlFVRXNSVUZEYkVNN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGQk5FSTdRVUZCUVN4RlFVRTBRanRCUVVGQkxFVkJRVFJDTzBGQlFVRXNSVUZCTkVJN1FVRkJRU3hGUVVGelFqdEJRVUZCTEVWQlFUaENMRTFCUVUwN1FVRkJRU3hGUVVNeFN6dEJRVUZCTEVWQlEwRXNVVUZCVVR0QlFVRkJMRVZCUTFJN1FVRkJRU3hGUVVOQk8wRkJRVUVzUlVGRFFTeGpRVUZqTzBGQlFVRXNSVUZEWkN4UlFVRlJPMEZCUVVFc1JVRkJaU3hUUVVGVExHTkJRV01zVFVGQlRTeExRVU12UXl4SlFVRkpMRk5CUVZVc1IwRkJSenRCUVVGRkxGZEJRVThzVTBGQlV6dEJRVUZCTEV0QlEyNURMRTlCUVU4c1UwRkJWU3hIUVVGSExFZEJRVWNzUjBGQlJ6dEJRVUZGTEZkQlFVOHNTVUZCU3l4SlFVRkpMRXRCUVVzc1NVRkJTU3hKUVVGSkxFbEJRVWs3UVVGQlFUdEJRVUZCTzBGQlEzUkZMRTFCUVUwc1UwRkJVeXhWUVVGVkxFMUJRVTBzWVVGQllUdEJRVVUxUXl4eFFrRkJjVUlzWVVGQllUdEJRVU01UWl4TlFVRkpMRkZCUVZFN1FVRkRXaXhOUVVGSk8wRkJRMEVzZVVKQlFYRkNPMEZCUTNKQ0xHbENRVUZoTEZsQlFWa3NTMEZCU3p0QlFVRkJMRmxCUld4RE8wRkJRMGtzZVVKQlFYRkNPMEZCUVVFN1FVRkJRVHRCUVVjM1FpeEpRVUZKTEcxQ1FVRnRRanRCUVVOMlFpeEpRVUZKTEhGQ1FVRnhRanRCUVVONlFpeEpRVUZKTEcxQ1FVRnRRanRCUVVOMlFpeEpRVUZKTEU5QlFVOHNZVUZCWVN4bFFVRmxMRk5CUVZNc2EwSkJRV3RDTzBGQlF6bEVMRTFCUVVrc2EwSkJRV3RDTEZkQlFWazdRVUZET1VJc1VVRkJTU3hUUVVGVExHOUNRVUZ2UWl4WFFVRlhPMEZCUTNoRExGVkJRVWtzVDBGQlR5eExRVUZMTEd0Q1FVRnJRaXhUUVVGVExFZEJRVWM3UVVGRE1VTXNiMEpCUVZrN1FVRkJRVHRCUVVWb1FpeDVRa0ZCYlVJN1FVRkJRVHRCUVVGQk8wRkJSek5DTEZkQlFWTXNhVUpCUVdsQ0xHOUNRVUZ2UWp0QlFVTTVReXh4UWtGQmJVSXNVMEZCVlN4alFVRmpPMEZCUTNaRExESkNRVUYxUWl4clFrRkJhMEk3UVVGRGVrTTdRVUZCUVR0QlFVRkJPMEZCU1ZJc1NVRkJTU3hQUVVGUExIRkNRVUZ4UWl4aFFVRmhPMEZCUTNwRExFMUJRVWtzVDBGQlR5eEpRVUZKTEdsQ1FVRnBRanRCUVVOb1F5eGxRVUZoTEdWQlFXVXNVMEZCVlN4alFVRmpPMEZCUTJoRUxGRkJRVWtzUTBGQlF5eHZRa0ZCYjBJN1FVRkRja0lzVjBGQlN5eFpRVUZaTzBGQlFVRTdRVUZCUVR0QlFVZDZRaXhQUVVGTExGbEJRVmtzVTBGQlZTeEpRVUZKTzBGQlF6TkNMRkZCUVVrc1IwRkJSenRCUVVOSUxIVkNRVUZwUWl4SFFVRkhPMEZCUVVFN1FVRkJRU3hYUVVkMlFpeFBRVUZQTEdsQ1FVRnBRaXhoUVVGaE8wRkJRekZETEdWQlFXRXNaVUZCWlN4VFFVRlZMR05CUVdNN1FVRkRhRVFzVVVGQlNUdEJRVU5CTEZWQlFVa3NRMEZCUXl4dlFrRkJiMEk3UVVGRGNrSXNjVUpCUVdFc1VVRkJVU3h4UWtGQmNVSXNTMEZCU3l4VlFVRlZPMEZCUVVFc1ZVRkRja1FzVFVGQlRTeExRVUZMTzBGQlFVRXNWVUZEV0R0QlFVRkJPMEZCUVVFN1FVRkJRU3hoUVVsTUxFdEJRVkE3UVVGQlFUdEJRVUZCTzBGQlJVb3NiVUpCUVdsQ0xGZEJRVmNzVTBGQlZTeEpRVUZKTzBGQlEzUkRMRkZCUVVrc1IwRkJSeXhSUVVGUkxIRkNRVUZ4UWp0QlFVTm9ReXhWUVVGSkxFOUJRVThzUzBGQlN5eE5RVUZOTEVkQlFVYzdRVUZEZWtJc1ZVRkJTVHRCUVVOQkxIbENRVUZwUWl4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJTM1JETEdGQlFXRXNhMEpCUVd0Q08wRkJReTlDTEZOQlFWTXNUMEZCVHp0QlFVVm9RaXhsUVVGbE8wRkJRMlk3SWl3S0lDQWlibUZ0WlhNaU9pQmJYUXA5Q2c9PVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLFdBQVc7QUFDMUIsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDcEQsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6RCxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDckIsUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxH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T0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RSxJQUFJLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUM1RixNQUFNLE9BQU8sRUFBRSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsT0FBTyxFQUFFO0FBQzdELFFBQVEsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxPQUFPLEVBQUU7QUFDL0MsUUFBUSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVixJQUFJLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxLQUFLLFNBQVM7QUFDdEQsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUMxRixRQUFRLE9BQU8sV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDVixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSztBQUMvQixNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMs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Q0FBQyxFQUFFO0FBQzVCLE1BQU0sSUFBSSxDQUFDO0FBQ1gsUUFBUSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVDLE1BQU0sT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0IsS0FBSztBQUNMLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRCxJQUFJLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsTUFBTSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ25FLE1BQU0sT0FBTyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUM1RCxLQUFLO0FBQ0wsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDcEMsTUFBTSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLEdBQUcsQ0FBQztBQUNKLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxFQUFFLEVBQUU7QUFDL0MsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDdEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzNCLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxL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Q0FBQyxDQUFDO0FBQ2IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3hELElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakYsR0FBRyxDQUFDO0FBQ0osRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDaEUsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZILElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUM7QUFDM0IsTUFBTSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQ3RDLE1BQU0sT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlGLEtBQUssQ0FBQyxFQUFFO0FBQ1IsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsNEhBQTRILEVBQUUsVUFBVSxDQUFD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
