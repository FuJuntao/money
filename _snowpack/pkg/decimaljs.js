var EXP_LIMIT = 9e15, MAX_DIGITS = 1e9, NUMERALS = "0123456789abcdef", LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", DEFAULTS = {
  precision: 20,
  rounding: 4,
  modulo: 1,
  toExpNeg: -7,
  toExpPos: 21,
  minE: -EXP_LIMIT,
  maxE: EXP_LIMIT,
  crypto: false
}, inexact, quadrant, external = true, decimalError = "[DecimalError] ", invalidArgument = decimalError + "Invalid argument: ", precisionLimitExceeded = decimalError + "Precision limit exceeded", cryptoUnavailable = decimalError + "crypto unavailable", mathfloor = Math.floor, mathpow = Math.pow, isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, BASE = 1e7, LOG_BASE = 7, MAX_SAFE_INTEGER = 9007199254740991, LN10_PRECISION = LN10.length - 1, PI_PRECISION = PI.length - 1, P = {name: "[object Decimal]"};
P.absoluteValue = P.abs = function() {
  var x = new this.constructor(this);
  if (x.s < 0)
    x.s = 1;
  return finalise(x);
};
P.ceil = function() {
  return finalise(new this.constructor(this), this.e + 1, 2);
};
P.comparedTo = P.cmp = function(y) {
  var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }
  if (!xd[0] || !yd[0])
    return xd[0] ? xs : yd[0] ? -ys : 0;
  if (xs !== ys)
    return xs;
  if (x.e !== y.e)
    return x.e > y.e ^ xs < 0 ? 1 : -1;
  xdL = xd.length;
  ydL = yd.length;
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i])
      return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
P.cosine = P.cos = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.d)
    return new Ctor(NaN);
  if (!x.d[0])
    return new Ctor(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
P.cubeRoot = P.cbrt = function() {
  var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero())
    return new Ctor(x);
  external = false;
  s = x.s * mathpow(x.s * x, 1 / 3);
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;
    if (s = (e - n.length + 1) % 3)
      n += s == 1 || s == -2 ? "0" : "00";
    s = mathpow(n, 1 / 3);
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.decimalPlaces = P.dp = function() {
  var w, d = this.d, n = NaN;
  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
    w = d[w];
    if (w)
      for (; w % 10 == 0; w /= 10)
        n--;
    if (n < 0)
      n = 0;
  }
  return n;
};
P.dividedBy = P.div = function(y) {
  return divide(this, new this.constructor(y));
};
P.dividedToIntegerBy = P.divToInt = function(y) {
  var x = this, Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
P.equals = P.eq = function(y) {
  return this.cmp(y) === 0;
};
P.floor = function() {
  return finalise(new this.constructor(this), this.e + 1, 3);
};
P.greaterThan = P.gt = function(y) {
  return this.cmp(y) > 0;
};
P.greaterThanOrEqualTo = P.gte = function(y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};
P.hyperbolicCosine = P.cosh = function() {
  var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
  if (!x.isFinite())
    return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero())
    return one;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = "2.3283064365386962890625e-10";
  }
  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
  var cosh2_x, i = k, d8 = new Ctor(8);
  for (; i--; ) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }
  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.hyperbolicSine = P.sinh = function() {
  var k, pr, rm, len, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true);
    var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(x, pr, rm, true);
};
P.hyperbolicTangent = P.tanh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(x.s);
  if (x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;
  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
P.inverseCosine = P.acos = function() {
  var halfPi, x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
  if (k !== -1) {
    return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
  }
  if (x.isZero())
    return getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.asin();
  halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return halfPi.minus(x);
};
P.inverseHyperbolicCosine = P.acosh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (x.lte(1))
    return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).minus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicSine = P.asinh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).plus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicTangent = P.atanh = function() {
  var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(NaN);
  if (x.e >= 0)
    return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();
  if (Math.max(xsd, pr) < 2 * -x.e - 1)
    return finalise(new Ctor(x), pr, rm, true);
  Ctor.precision = wpr = xsd - x.e;
  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
  Ctor.precision = pr + 4;
  Ctor.rounding = 1;
  x = x.ln();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(0.5);
};
P.inverseSine = P.asin = function() {
  var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
  if (x.isZero())
    return new Ctor(x);
  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (k !== -1) {
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }
    return new Ctor(NaN);
  }
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseTangent = P.atan = function() {
  var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
  if (!x.isFinite()) {
    if (!x.s)
      return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }
  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;
  k = Math.min(28, wpr / LOG_BASE + 2 | 0);
  for (i = k; i; --i)
    x = x.div(x.times(x).plus(1).sqrt().plus(1));
  external = false;
  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px = x;
  for (; i !== -1; ) {
    px = px.times(x2);
    t = r.minus(px.div(n += 2));
    px = px.times(x2);
    r = t.plus(px.div(n += 2));
    if (r.d[j] !== void 0)
      for (i = j; r.d[i] === t.d[i] && i--; )
        ;
  }
  if (k)
    r = r.times(2 << k - 1);
  external = true;
  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.isFinite = function() {
  return !!this.d;
};
P.isInteger = P.isInt = function() {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
P.isNaN = function() {
  return !this.s;
};
P.isNegative = P.isNeg = function() {
  return this.s < 0;
};
P.isPositive = P.isPos = function() {
  return this.s > 0;
};
P.isZero = function() {
  return !!this.d && this.d[0] === 0;
};
P.lessThan = P.lt = function(y) {
  return this.cmp(y) < 0;
};
P.lessThanOrEqualTo = P.lte = function(y) {
  return this.cmp(y) < 1;
};
P.logarithm = P.log = function(base) {
  var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;
    if (base.s < 0 || !d || !d[0] || base.eq(1))
      return new Ctor(NaN);
    isBase10 = base.eq(10);
  }
  d = arg.d;
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0; )
        k /= 10;
      inf = k !== 1;
    }
  }
  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
  r = divide(num, denominator, sd, 1);
  if (checkRoundingDigits(r.d, k = pr, rm)) {
    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);
      if (!inf) {
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }
  external = true;
  return finalise(r, pr, rm);
};
P.minus = P.sub = function(y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s)
      y = new Ctor(NaN);
    else if (x.d)
      y.s = -y.s;
    else
      y = new Ctor(y.d || x.s !== y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (yd[0])
      y.s = -y.s;
    else if (xd[0])
      y = new Ctor(x);
    else
      return new Ctor(rm === 3 ? -0 : 0);
    return external ? finalise(y, pr, rm) : y;
  }
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);
  xd = xd.slice();
  k = xe - e;
  if (k) {
    xLTy = k < 0;
    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
    if (k > i) {
      k = i;
      d.length = 1;
    }
    d.reverse();
    for (i = k; i--; )
      d.push(0);
    d.reverse();
  } else {
    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy)
      len = i;
    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }
    k = 0;
  }
  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }
  len = xd.length;
  for (i = yd.length - len; i > 0; --i)
    xd[len++] = 0;
  for (i = yd.length; i > k; ) {
    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0; )
        xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }
    xd[i] -= yd[i];
  }
  for (; xd[--len] === 0; )
    xd.pop();
  for (; xd[0] === 0; xd.shift())
    --e;
  if (!xd[0])
    return new Ctor(rm === 3 ? -0 : 0);
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.modulo = P.mod = function(y) {
  var q, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.s || y.d && !y.d[0])
    return new Ctor(NaN);
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }
  external = false;
  if (Ctor.modulo == 9) {
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }
  q = q.times(y);
  external = true;
  return x.minus(q);
};
P.naturalExponential = P.exp = function() {
  return naturalExponential(this);
};
P.naturalLogarithm = P.ln = function() {
  return naturalLogarithm(this);
};
P.negated = P.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};
P.plus = P.add = function(y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s)
      y = new Ctor(NaN);
    else if (!x.d)
      y = new Ctor(y.d || x.s === y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (!yd[0])
      y = new Ctor(x);
    return external ? finalise(y, pr, rm) : y;
  }
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);
  xd = xd.slice();
  i = k - e;
  if (i) {
    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;
    if (i > len) {
      i = len;
      d.length = 1;
    }
    d.reverse();
    for (; i--; )
      d.push(0);
    d.reverse();
  }
  len = xd.length;
  i = yd.length;
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }
  for (carry = 0; i; ) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }
  if (carry) {
    xd.unshift(carry);
    ++e;
  }
  for (len = xd.length; xd[--len] == 0; )
    xd.pop();
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.precision = P.sd = function(z) {
  var k, x = this;
  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0)
    throw Error(invalidArgument + z);
  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k)
      k = x.e + 1;
  } else {
    k = NaN;
  }
  return k;
};
P.round = function() {
  var x = this, Ctor = x.constructor;
  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
P.sine = P.sin = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(NaN);
  if (x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = sine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
P.squareRoot = P.sqrt = function() {
  var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }
  external = false;
  s = Math.sqrt(+x);
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);
    if ((n.length + e) % 2 == 0)
      n += "0";
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.tangent = P.tan = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(NaN);
  if (x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;
  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
P.times = P.mul = function(y) {
  var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
  y.s *= x.s;
  if (!xd || !xd[0] || !yd || !yd[0]) {
    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
  }
  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;
  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }
  r = [];
  rL = xdL + ydL;
  for (i = rL; i--; )
    r.push(0);
  for (i = ydL; --i >= 0; ) {
    carry = 0;
    for (k = xdL + i; k > i; ) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }
    r[k] = (r[k] + carry) % BASE | 0;
  }
  for (; !r[--rL]; )
    r.pop();
  if (carry)
    ++e;
  else
    r.shift();
  y.d = r;
  y.e = getBase10Exponent(r, e);
  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
P.toBinary = function(sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};
P.toDecimalPlaces = P.toDP = function(dp, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (dp === void 0)
    return x;
  checkInt32(dp, 0, MAX_DIGITS);
  if (rm === void 0)
    rm = Ctor.rounding;
  else
    checkInt32(rm, 0, 8);
  return finalise(x, dp + x.e + 1, rm);
};
P.toExponential = function(dp, rm) {
  var str, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFixed = function(dp, rm) {
  var str, y, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFraction = function(maxD) {
  var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
  if (!xd)
    return new Ctor(x);
  n1 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);
  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
  if (maxD == null) {
    maxD = e > 0 ? d : n1;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n1))
      throw Error(invalidArgument + n);
    maxD = n.gt(d) ? e > 0 ? d : n1 : n;
  }
  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;
  for (; ; ) {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1)
      break;
    d0 = d1;
    d1 = d2;
    d2 = n1;
    n1 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }
  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n1));
  d0 = d0.plus(d2.times(d1));
  n0.s = n1.s = x.s;
  r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
  Ctor.precision = pr;
  external = true;
  return r;
};
P.toHexadecimal = P.toHex = function(sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};
P.toNearest = function(y, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (y == null) {
    if (!x.d)
      return x;
    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }
    if (!x.d)
      return y.s ? x : y;
    if (!y.d) {
      if (y.s)
        y.s = x.s;
      return y;
    }
  }
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);
  } else {
    y.s = x.s;
    x = y;
  }
  return x;
};
P.toNumber = function() {
  return +this;
};
P.toOctal = function(sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};
P.toPower = P.pow = function(y) {
  var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
  if (!x.d || !y.d || !x.d[0] || !y.d[0])
    return new Ctor(mathpow(+x, yn));
  x = new Ctor(x);
  if (x.eq(1))
    return x;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (y.eq(1))
    return finalise(x, pr, rm);
  e = mathfloor(y.e / LOG_BASE);
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }
  s = x.s;
  if (s < 0) {
    if (e < y.d.length - 1)
      return new Ctor(NaN);
    if ((y.d[e] & 1) == 0)
      s = 1;
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1)
    return new Ctor(e > 0 ? s / 0 : 0);
  external = false;
  Ctor.rounding = x.s = 1;
  k = Math.min(12, (e + "").length);
  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
  if (r.d) {
    r = finalise(r, pr + 5, 1);
    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10;
      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }
  r.s = s;
  external = true;
  Ctor.rounding = rm;
  return finalise(r, pr, rm);
};
P.toPrecision = function(sd, rm) {
  var str, x = this, Ctor = x.constructor;
  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toSignificantDigits = P.toSD = function(sd, rm) {
  var x = this, Ctor = x.constructor;
  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
  }
  return finalise(new Ctor(x), sd, rm);
};
P.toString = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.truncated = P.trunc = function() {
  return finalise(new this.constructor(this), this.e + 1, 1);
};
P.valueOf = P.toJSON = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() ? "-" + str : str;
};
function digitsToString(d) {
  var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + "";
      k = LOG_BASE - ws.length;
      if (k)
        str += getZeroString(k);
      str += ws;
    }
    w = d[i];
    ws = w + "";
    k = LOG_BASE - ws.length;
    if (k)
      str += getZeroString(k);
  } else if (w === 0) {
    return "0";
  }
  for (; w % 10 === 0; )
    w /= 10;
  return str + w;
}
function checkInt32(i, min2, max2) {
  if (i !== ~~i || i < min2 || i > max2) {
    throw Error(invalidArgument + i);
  }
}
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd;
  for (k = d[0]; k >= 10; k /= 10)
    --i;
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;
  if (repeating == null) {
    if (i < 3) {
      if (i == 0)
        rd = rd / 100 | 0;
      else if (i == 1)
        rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0)
        rd = rd / 1e3 | 0;
      else if (i == 1)
        rd = rd / 100 | 0;
      else if (i == 2)
        rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
    }
  }
  return r;
}
function convertBase(str, baseIn, baseOut) {
  var j, arr = [0], arrL, i = 0, strL = str.length;
  for (; i < strL; ) {
    for (arrL = arr.length; arrL--; )
      arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0)
          arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }
  return arr.reverse();
}
function cosine(Ctor, x) {
  var k, y, len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = "2.3283064365386962890625e-10";
  }
  Ctor.precision += k;
  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
  for (var i = k; i--; ) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }
  Ctor.precision -= k;
  return x;
}
var divide = function() {
  function multiplyInteger(x, k, base) {
    var temp, carry = 0, i = x.length;
    for (x = x.slice(); i--; ) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }
    if (carry)
      x.unshift(carry);
    return x;
  }
  function compare(a, b, aL, bL) {
    var i, r;
    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }
    return r;
  }
  function subtract(a, b, aL, base) {
    var i = 0;
    for (; aL--; ) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }
    for (; !a[0] && a.length > 1; )
      a.shift();
  }
  return function(x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign2 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(!x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : xd && xd[0] == 0 || !yd ? sign2 * 0 : sign2 / 0);
    }
    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }
    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign2);
    qd = q.d = [];
    for (i = 0; yd[i] == (xd[i] || 0); i++)
      ;
    if (yd[i] > (xd[i] || 0))
      e--;
    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }
    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {
      sd = sd / logBase + 2 | 0;
      i = 0;
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }
        more = k || i < xL;
      } else {
        k = base / (yd[0] + 1) | 0;
        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }
        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; )
          rem[remL++] = 0;
        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];
        if (yd[1] >= base / 2)
          ++yd0;
        do {
          k = 0;
          cmp = compare(yd, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL)
              rem0 = rem0 * base + (rem[1] || 0);
            k = rem0 / yd0 | 0;
            if (k > 1) {
              if (k >= base)
                k = base - 1;
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;
              cmp = compare(prod, rem, prodL, remL);
              if (cmp == 1) {
                k--;
                subtract(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {
              if (k == 0)
                cmp = k = 1;
              prod = yd.slice();
            }
            prodL = prod.length;
            if (prodL < remL)
              prod.unshift(0);
            subtract(rem, prod, remL, base);
            if (cmp == -1) {
              remL = rem.length;
              cmp = compare(yd, rem, yL, remL);
              if (cmp < 1) {
                k++;
                subtract(rem, yL < remL ? yz : yd, remL, base);
              }
            }
            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }
          qd[i++] = k;
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);
        more = rem[0] !== void 0;
      }
      if (!qd[0])
        qd.shift();
    }
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {
      for (i = 1, k = qd[0]; k >= 10; k /= 10)
        i++;
      q.e = i + e * logBase - 1;
      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }
    return q;
  };
}();
function finalise(x, sd, rm, isTruncated) {
  var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
  out:
    if (sd != null) {
      xd = x.d;
      if (!xd)
        return x;
      for (digits = 1, k = xd[0]; k >= 10; k /= 10)
        digits++;
      i = sd - digits;
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];
        rd = w / mathpow(10, digits - j - 1) % 10 | 0;
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) {
          if (isTruncated) {
            for (; k++ <= xdi; )
              xd.push(0);
            w = rd = 0;
            digits = 1;
            i %= LOG_BASE;
            j = i - LOG_BASE + 1;
          } else {
            break out;
          }
        } else {
          w = k = xd[xdi];
          for (digits = 1; k >= 10; k /= 10)
            digits++;
          i %= LOG_BASE;
          j = i - LOG_BASE + digits;
          rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
        }
      }
      isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
      roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
      if (sd < 1 || !xd[0]) {
        xd.length = 0;
        if (roundUp) {
          sd -= x.e + 1;
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = -sd || 0;
        } else {
          xd[0] = x.e = 0;
        }
        return x;
      }
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);
        xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
      }
      if (roundUp) {
        for (; ; ) {
          if (xdi == 0) {
            for (i = 1, j = xd[0]; j >= 10; j /= 10)
              i++;
            j = xd[0] += k;
            for (k = 1; j >= 10; j /= 10)
              k++;
            if (i != k) {
              x.e++;
              if (xd[0] == BASE)
                xd[0] = 1;
            }
            break;
          } else {
            xd[xdi] += k;
            if (xd[xdi] != BASE)
              break;
            xd[xdi--] = 0;
            k = 1;
          }
        }
      }
      for (i = xd.length; xd[--i] === 0; )
        xd.pop();
    }
  if (external) {
    if (x.e > Ctor.maxE) {
      x.d = null;
      x.e = NaN;
    } else if (x.e < Ctor.minE) {
      x.e = 0;
      x.d = [0];
    }
  }
  return x;
}
function finiteToString(x, isExp, sd) {
  if (!x.isFinite())
    return nonFiniteToString(x);
  var k, e = x.e, str = digitsToString(x.d), len = str.length;
  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + "." + str.slice(1);
    }
    str = str + (x.e < 0 ? "e" : "e+") + x.e;
  } else if (e < 0) {
    str = "0." + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0)
      str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0)
      str = str + "." + getZeroString(k);
  } else {
    if ((k = e + 1) < len)
      str = str.slice(0, k) + "." + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len)
        str += ".";
      str += getZeroString(k);
    }
  }
  return str;
}
function getBase10Exponent(digits, e) {
  var w = digits[0];
  for (e *= LOG_BASE; w >= 10; w /= 10)
    e++;
  return e;
}
function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {
    external = true;
    if (pr)
      Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}
function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION)
    throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}
function getPrecision(digits) {
  var w = digits.length - 1, len = w * LOG_BASE + 1;
  w = digits[w];
  if (w) {
    for (; w % 10 == 0; w /= 10)
      len--;
    for (w = digits[0]; w >= 10; w /= 10)
      len++;
  }
  return len;
}
function getZeroString(k) {
  var zs = "";
  for (; k--; )
    zs += "0";
  return zs;
}
function intPow(Ctor, x, n, pr) {
  var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
  external = false;
  for (; ; ) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k))
        isTruncated = true;
    }
    n = mathfloor(n / 2);
    if (n === 0) {
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0)
        ++r.d[n];
      break;
    }
    x = x.times(x);
    truncate(x.d, k);
  }
  external = true;
  return r;
}
function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}
function maxOrMin(Ctor, args, ltgt) {
  var y, x = new Ctor(args[0]), i = 0;
  for (; ++i < args.length; ) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    } else if (x[ltgt](y)) {
      x = y;
    }
  }
  return x;
}
function naturalExponential(x, sd) {
  var denominator, guard, j, pow2, sum, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (!x.d || !x.d[0] || x.e > 17) {
    return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  t = new Ctor(0.03125);
  while (x.e > -2) {
    x = x.times(t);
    k += 5;
  }
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow2 = sum = new Ctor(1);
  Ctor.precision = wpr;
  for (; ; ) {
    pow2 = finalise(pow2.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum.plus(divide(pow2, denominator, wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      j = k;
      while (j--)
        sum = finalise(sum.times(sum), wpr, 1);
      if (sd == null) {
        if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow2 = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }
    sum = t;
  }
}
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);
  if (Math.abs(e = x.e) < 15e14) {
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }
    e = x.e;
    if (c0 > 1) {
      x = new Ctor("0." + c);
      e++;
    } else {
      x = new Ctor(c0 + "." + c.slice(1));
    }
  } else {
    t = getLn10(Ctor, wpr + 2, pr).times(e + "");
    x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;
    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }
  x1 = x;
  sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;
  for (; ; ) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      sum = sum.times(2);
      if (e !== 0)
        sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
      sum = divide(sum, new Ctor(n), wpr, 1);
      if (sd == null) {
        if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }
    sum = t;
    denominator += 2;
  }
}
function nonFiniteToString(x) {
  return String(x.s * x.s / 0);
}
function parseDecimal(x, str) {
  var e, i, len;
  if ((e = str.indexOf(".")) > -1)
    str = str.replace(".", "");
  if ((i = str.search(/e/i)) > 0) {
    if (e < 0)
      e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {
    e = str.length;
  }
  for (i = 0; str.charCodeAt(i) === 48; i++)
    ;
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len)
    ;
  str = str.slice(i, len);
  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];
    i = (e + 1) % LOG_BASE;
    if (e < 0)
      i += LOG_BASE;
    if (i < len) {
      if (i)
        x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len; )
        x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }
    for (; i--; )
      str += "0";
    x.d.push(+str);
    if (external) {
      if (x.e > x.constructor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < x.constructor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
  } else {
    x.e = 0;
    x.d = [0];
  }
  return x;
}
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
  if (str === "Infinity" || str === "NaN") {
    if (!+str)
      x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }
  if (isHex.test(str)) {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str)) {
    base = 2;
  } else if (isOctal.test(str)) {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }
  i = str.search(/p/i);
  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }
  i = str.indexOf(".");
  isFloat = i >= 0;
  Ctor = x.constructor;
  if (isFloat) {
    str = str.replace(".", "");
    len = str.length;
    i = len - i;
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }
  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;
  for (i = xe; xd[i] === 0; --i)
    xd.pop();
  if (i < 0)
    return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;
  if (isFloat)
    x = divide(x, divisor, len * 4);
  if (p)
    x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;
  return x;
}
function sine(Ctor, x) {
  var k, len = x.d.length;
  if (len < 3)
    return taylorSeries(Ctor, 2, x, x);
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;
  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x);
  var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
  for (; k--; ) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }
  return x;
}
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
  external = false;
  x2 = x.times(x);
  u = new Ctor(y);
  for (; ; ) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);
    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--; )
        ;
      if (j == -1)
        break;
    }
    j = u;
    u = y;
    y = t;
    t = j;
  }
  external = true;
  t.d.length = k + 1;
  return t;
}
function tinyPow(b, e) {
  var n = b;
  while (--e)
    n *= b;
  return n;
}
function toLessThanHalfPi(Ctor, x) {
  var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
  x = x.abs();
  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }
  t = x.divToInt(pi);
  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
      return x;
    }
    quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
  }
  return x.minus(pi).abs();
}
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }
  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf(".");
    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }
    if (i >= 0) {
      str = str.replace(".", "");
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }
    xd = convertBase(str, 10, base);
    e = len = xd.length;
    for (; xd[--len] == 0; )
      xd.pop();
    if (!xd[0]) {
      str = isExp ? "0p+0" : "0";
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;
      roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
      xd.length = sd;
      if (roundUp) {
        for (; ++xd[--sd] > base - 1; ) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }
      for (len = xd.length; !xd[len - 1]; --len)
        ;
      for (i = 0, str = ""; i < len; i++)
        str += NUMERALS.charAt(xd[i]);
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++)
              str += "0";
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len)
              ;
            for (i = 1, str = "1."; i < len; i++)
              str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + "." + str.slice(1);
          }
        }
        str = str + (e < 0 ? "p" : "p+") + e;
      } else if (e < 0) {
        for (; ++e; )
          str = "0" + str;
        str = "0." + str;
      } else {
        if (++e > len)
          for (e -= len; e--; )
            str += "0";
        else if (e < len)
          str = str.slice(0, e) + "." + str.slice(e);
      }
    }
    str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
  }
  return x.s < 0 ? "-" + str : str;
}
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}
function abs(x) {
  return new this(x).abs();
}
function acos(x) {
  return new this(x).acos();
}
function acosh(x) {
  return new this(x).acosh();
}
function add(x, y) {
  return new this(x).plus(y);
}
function asin(x) {
  return new this(x).asin();
}
function asinh(x) {
  return new this(x).asinh();
}
function atan(x) {
  return new this(x).atan();
}
function atanh(x) {
  return new this(x).atanh();
}
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
  if (!y.s || !x.s) {
    r = new this(NaN);
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s;
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s;
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s;
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }
  return r;
}
function cbrt(x) {
  return new this(x).cbrt();
}
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}
function config(obj) {
  if (!obj || typeof obj !== "object")
    throw Error(decimalError + "Object expected");
  var i, p, v, useDefaults = obj.defaults === true, ps = [
    "precision",
    1,
    MAX_DIGITS,
    "rounding",
    0,
    8,
    "toExpNeg",
    -EXP_LIMIT,
    0,
    "toExpPos",
    0,
    EXP_LIMIT,
    "maxE",
    0,
    EXP_LIMIT,
    "minE",
    -EXP_LIMIT,
    0,
    "modulo",
    0,
    9
  ];
  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults)
      this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2])
        this[p] = v;
      else
        throw Error(invalidArgument + p + ": " + v);
    }
  }
  if (p = "crypto", useDefaults)
    this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ": " + v);
    }
  }
  return this;
}
function cos(x) {
  return new this(x).cos();
}
function cosh(x) {
  return new this(x).cosh();
}
function clone(obj) {
  var i, p, ps;
  function Decimal2(v) {
    var e, i2, t, x = this;
    if (!(x instanceof Decimal2))
      return new Decimal2(v);
    x.constructor = Decimal2;
    if (v instanceof Decimal2) {
      x.s = v.s;
      if (external) {
        if (!v.d || v.e > Decimal2.maxE) {
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal2.minE) {
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }
      return;
    }
    t = typeof v;
    if (t === "number") {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      if (v === ~~v && v < 1e7) {
        for (e = 0, i2 = v; i2 >= 10; i2 /= 10)
          e++;
        if (external) {
          if (e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }
        return;
      } else if (v * 0 !== 0) {
        if (!v)
          x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }
      return parseDecimal(x, v.toString());
    } else if (t !== "string") {
      throw Error(invalidArgument + v);
    }
    if ((i2 = v.charCodeAt(0)) === 45) {
      v = v.slice(1);
      x.s = -1;
    } else {
      if (i2 === 43)
        v = v.slice(1);
      x.s = 1;
    }
    return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
  }
  Decimal2.prototype = P;
  Decimal2.ROUND_UP = 0;
  Decimal2.ROUND_DOWN = 1;
  Decimal2.ROUND_CEIL = 2;
  Decimal2.ROUND_FLOOR = 3;
  Decimal2.ROUND_HALF_UP = 4;
  Decimal2.ROUND_HALF_DOWN = 5;
  Decimal2.ROUND_HALF_EVEN = 6;
  Decimal2.ROUND_HALF_CEIL = 7;
  Decimal2.ROUND_HALF_FLOOR = 8;
  Decimal2.EUCLID = 9;
  Decimal2.config = Decimal2.set = config;
  Decimal2.clone = clone;
  Decimal2.isDecimal = isDecimalInstance;
  Decimal2.abs = abs;
  Decimal2.acos = acos;
  Decimal2.acosh = acosh;
  Decimal2.add = add;
  Decimal2.asin = asin;
  Decimal2.asinh = asinh;
  Decimal2.atan = atan;
  Decimal2.atanh = atanh;
  Decimal2.atan2 = atan2;
  Decimal2.cbrt = cbrt;
  Decimal2.ceil = ceil;
  Decimal2.cos = cos;
  Decimal2.cosh = cosh;
  Decimal2.div = div;
  Decimal2.exp = exp;
  Decimal2.floor = floor;
  Decimal2.hypot = hypot;
  Decimal2.ln = ln;
  Decimal2.log = log;
  Decimal2.log10 = log10;
  Decimal2.log2 = log2;
  Decimal2.max = max;
  Decimal2.min = min;
  Decimal2.mod = mod;
  Decimal2.mul = mul;
  Decimal2.pow = pow;
  Decimal2.random = random;
  Decimal2.round = round;
  Decimal2.sign = sign;
  Decimal2.sin = sin;
  Decimal2.sinh = sinh;
  Decimal2.sqrt = sqrt;
  Decimal2.sub = sub;
  Decimal2.tan = tan;
  Decimal2.tanh = tanh;
  Decimal2.trunc = trunc;
  if (obj === void 0)
    obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
      for (i = 0; i < ps.length; )
        if (!obj.hasOwnProperty(p = ps[i++]))
          obj[p] = this[p];
    }
  }
  Decimal2.config(obj);
  return Decimal2;
}
function div(x, y) {
  return new this(x).div(y);
}
function exp(x) {
  return new this(x).exp();
}
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}
function hypot() {
  var i, n, t = new this(0);
  external = false;
  for (i = 0; i < arguments.length; ) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }
  external = true;
  return t.sqrt();
}
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.name === "[object Decimal]" || false;
}
function ln(x) {
  return new this(x).ln();
}
function log(x, y) {
  return new this(x).log(y);
}
function log2(x) {
  return new this(x).log(2);
}
function log10(x) {
  return new this(x).log(10);
}
function max() {
  return maxOrMin(this, arguments, "lt");
}
function min() {
  return maxOrMin(this, arguments, "gt");
}
function mod(x, y) {
  return new this(x).mod(y);
}
function mul(x, y) {
  return new this(x).mul(y);
}
function pow(x, y) {
  return new this(x).pow(y);
}
function random(sd) {
  var d, e, k, n, i = 0, r = new this(1), rd = [];
  if (sd === void 0)
    sd = this.precision;
  else
    checkInt32(sd, 1, MAX_DIGITS);
  k = Math.ceil(sd / LOG_BASE);
  if (!this.crypto) {
    for (; i < k; )
      rd[i++] = Math.random() * 1e7 | 0;
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));
    for (; i < k; ) {
      n = d[i];
      if (n >= 429e7) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {
        rd[i++] = n % 1e7;
      }
    }
  } else if (crypto.randomBytes) {
    d = crypto.randomBytes(k *= 4);
    for (; i < k; ) {
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
      if (n >= 214e7) {
        crypto.randomBytes(4).copy(d, i);
      } else {
        rd.push(n % 1e7);
        i += 4;
      }
    }
    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }
  k = rd[--i];
  sd %= LOG_BASE;
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }
  for (; rd[i] === 0; i--)
    rd.pop();
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;
    for (; rd[0] === 0; e -= LOG_BASE)
      rd.shift();
    for (k = 1, n = rd[0]; n >= 10; n /= 10)
      k++;
    if (k < LOG_BASE)
      e -= LOG_BASE - k;
  }
  r.e = e;
  r.d = rd;
  return r;
}
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}
function sign(x) {
  x = new this(x);
  return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
function sin(x) {
  return new this(x).sin();
}
function sinh(x) {
  return new this(x).sinh();
}
function sqrt(x) {
  return new this(x).sqrt();
}
function sub(x, y) {
  return new this(x).sub(y);
}
function tan(x) {
  return new this(x).tan();
}
function tanh(x) {
  return new this(x).tanh();
}
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}
P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
P[Symbol.toStringTag] = "Decimal";
var Decimal = clone(DEFAULTS);
LN10 = new Decimal(LN10);
PI = new Decimal(PI);

export { Decimal };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjaW1hbGpzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZGVjaW1hbC5qcy9kZWNpbWFsLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRVhQX0xJTUlUID0gOWUxNSwgTUFYX0RJR0lUUyA9IDFlOSwgTlVNRVJBTFMgPSBcIjAxMjM0NTY3ODlhYmNkZWZcIiwgTE4xMCA9IFwiMi4zMDI1ODUwOTI5OTQwNDU2ODQwMTc5OTE0NTQ2ODQzNjQyMDc2MDExMDE0ODg2Mjg3NzI5NzYwMzMzMjc5MDA5Njc1NzI2MDk2NzczNTI0ODAyMzU5OTcyMDUwODk1OTgyOTgzNDE5Njc3ODQwNDIyODYyNDg2MzM0MDk1MjU0NjUwODI4MDY3NTY2NjYyODczNjkwOTg3ODE2ODk0ODI5MDcyMDgzMjU1NTQ2ODA4NDM3OTk4OTQ4MjYyMzMxOTg1MjgzOTM1MDUzMDg5NjUzNzc3MzI2Mjg4NDYxNjMzNjYyMjIyODc2OTgyMTk4ODY3NDY1NDM2Njc0NzQ0MDQyNDMyNzQzNjUxNTUwNDg5MzQzMTQ5MzkzOTE0Nzk2MTk0MDQ0MDAyMjIxMDUxMDE3MTQxNzQ4MDAzNjg4MDg0MDEyNjQ3MDgwNjg1NTY3NzQzMjE2MjI4MzU1MjIwMTE0ODA0NjYzNzE1NjU5MTIxMzczNDUwNzQ3ODU2OTQ3NjgzNDYzNjE2NzkyMTAxODA2NDQ1MDcwNjQ4MDAwMjc3NTAyNjg0OTE2NzQ2NTUwNTg2ODU2OTM1NjczNDIwNjcwNTgxMTM2NDI5MjI0NTU0NDA1NzU4OTI1NzI0MjA4MjQxMzE0Njk1Njg5MDE2NzU4OTQwMjU2Nzc2MzExMzU2OTE5MjkyMDMzMzc2NTg3MTQxNjYwMjMwMTA1NzAzMDg5NjM0NTcyMDc1NDQwMzcwODQ3NDY5OTQwMTY4MjY5MjgyODA4NDgxMTg0Mjg5MzE0ODQ4NTI0OTQ4NjQ0ODcxOTI3ODA5Njc2MjcxMjc1Nzc1Mzk3MDI3NjY4NjA1OTUyNDk2NzE2Njc0MTgzNDg1NzA0NDIyNTA3MTk3OTY1MDA0NzE0OTUxMDUwNDkyMjE0Nzc2NTY3NjM2OTM4NjYyOTc2OTc5NTIyMTEwNzE4MjY0NTQ5NzM0NzcyNjYyNDI1NzA5NDI5MzIyNTgyNzk4NTAyNTg1NTA5Nzg1MjY1MzgzMjA3NjA2NzI2MzE3MTY0MzA5NTA1OTk1MDg3ODA3NTIzNzEwMzMzMTAxMTk3ODU3NTQ3MzMxNTQxNDIxODA4NDI3NTQzODYzNTkxNzc4MTE3MDU0MzA5ODI3NDgyMzg1MDQ1NjQ4MDE5MDk1NjEwMjk5MjkxODI0MzE4MjM3NTI1MzU3NzA5NzUwNTM5NTY1MTg3Njk3NTEwMzc0OTcwODg4NjkyMTgwMjA1MTg5MzM5NTA3MjM4NTM5MjA1MTQ0NjM0MTk3MjY1Mjg3Mjg2OTY1MTEwODYyNTcxNDkyMTk4ODQ5OTc4NzQ4ODczNzcxMzQ1Njg2MjA5MTY3MDU4XCIsIFBJID0gXCIzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTUwMjg4NDE5NzE2OTM5OTM3NTEwNTgyMDk3NDk0NDU5MjMwNzgxNjQwNjI4NjIwODk5ODYyODAzNDgyNTM0MjExNzA2Nzk4MjE0ODA4NjUxMzI4MjMwNjY0NzA5Mzg0NDYwOTU1MDU4MjIzMTcyNTM1OTQwODEyODQ4MTExNzQ1MDI4NDEwMjcwMTkzODUyMTEwNTU1OTY0NDYyMjk0ODk1NDkzMDM4MTk2NDQyODgxMDk3NTY2NTkzMzQ0NjEyODQ3NTY0ODIzMzc4Njc4MzE2NTI3MTIwMTkwOTE0NTY0ODU2NjkyMzQ2MDM0ODYxMDQ1NDMyNjY0ODIxMzM5MzYwNzI2MDI0OTE0MTI3MzcyNDU4NzAwNjYwNjMxNTU4ODE3NDg4MTUyMDkyMDk2MjgyOTI1NDA5MTcxNTM2NDM2Nzg5MjU5MDM2MDAxMTMzMDUzMDU0ODgyMDQ2NjUyMTM4NDE0Njk1MTk0MTUxMTYwOTQzMzA1NzI3MDM2NTc1OTU5MTk1MzA5MjE4NjExNzM4MTkzMjYxMTc5MzEwNTExODU0ODA3NDQ2MjM3OTk2Mjc0OTU2NzM1MTg4NTc1MjcyNDg5MTIyNzkzODE4MzAxMTk0OTEyOTgzMzY3MzM2MjQ0MDY1NjY0MzA4NjAyMTM5NDk0NjM5NTIyNDczNzE5MDcwMjE3OTg2MDk0MzcwMjc3MDUzOTIxNzE3NjI5MzE3Njc1MjM4NDY3NDgxODQ2NzY2OTQwNTEzMjAwMDU2ODEyNzE0NTI2MzU2MDgyNzc4NTc3MTM0Mjc1Nzc4OTYwOTE3MzYzNzE3ODcyMTQ2ODQ0MDkwMTIyNDk1MzQzMDE0NjU0OTU4NTM3MTA1MDc5MjI3OTY4OTI1ODkyMzU0MjAxOTk1NjExMjEyOTAyMTk2MDg2NDAzNDQxODE1OTgxMzYyOTc3NDc3MTMwOTk2MDUxODcwNzIxMTM0OTk5OTk5ODM3Mjk3ODA0OTk1MTA1OTczMTczMjgxNjA5NjMxODU5NTAyNDQ1OTQ1NTM0NjkwODMwMjY0MjUyMjMwODI1MzM0NDY4NTAzNTI2MTkzMTE4ODE3MTAxMDAwMzEzNzgzODc1Mjg4NjU4NzUzMzIwODM4MTQyMDYxNzE3NzY2OTE0NzMwMzU5ODI1MzQ5MDQyODc1NTQ2ODczMTE1OTU2Mjg2Mzg4MjM1Mzc4NzU5Mzc1MTk1Nzc4MTg1Nzc4MDUzMjE3MTIyNjgwNjYxMzAwMTkyNzg3NjYxMTE5NTkwOTIxNjQyMDE5ODkzODA5NTI1NzIwMTA2NTQ4NTg2MzI3ODlcIiwgREVGQVVMVFMgPSB7XG4gIHByZWNpc2lvbjogMjAsXG4gIHJvdW5kaW5nOiA0LFxuICBtb2R1bG86IDEsXG4gIHRvRXhwTmVnOiAtNyxcbiAgdG9FeHBQb3M6IDIxLFxuICBtaW5FOiAtRVhQX0xJTUlULFxuICBtYXhFOiBFWFBfTElNSVQsXG4gIGNyeXB0bzogZmFsc2Vcbn0sIGluZXhhY3QsIHF1YWRyYW50LCBleHRlcm5hbCA9IHRydWUsIGRlY2ltYWxFcnJvciA9IFwiW0RlY2ltYWxFcnJvcl0gXCIsIGludmFsaWRBcmd1bWVudCA9IGRlY2ltYWxFcnJvciArIFwiSW52YWxpZCBhcmd1bWVudDogXCIsIHByZWNpc2lvbkxpbWl0RXhjZWVkZWQgPSBkZWNpbWFsRXJyb3IgKyBcIlByZWNpc2lvbiBsaW1pdCBleGNlZWRlZFwiLCBjcnlwdG9VbmF2YWlsYWJsZSA9IGRlY2ltYWxFcnJvciArIFwiY3J5cHRvIHVuYXZhaWxhYmxlXCIsIG1hdGhmbG9vciA9IE1hdGguZmxvb3IsIG1hdGhwb3cgPSBNYXRoLnBvdywgaXNCaW5hcnkgPSAvXjBiKFswMV0rKFxcLlswMV0qKT98XFwuWzAxXSspKHBbKy1dP1xcZCspPyQvaSwgaXNIZXggPSAvXjB4KFswLTlhLWZdKyhcXC5bMC05YS1mXSopP3xcXC5bMC05YS1mXSspKHBbKy1dP1xcZCspPyQvaSwgaXNPY3RhbCA9IC9eMG8oWzAtN10rKFxcLlswLTddKik/fFxcLlswLTddKykocFsrLV0/XFxkKyk/JC9pLCBpc0RlY2ltYWwgPSAvXihcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksIEJBU0UgPSAxZTcsIExPR19CQVNFID0gNywgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsIExOMTBfUFJFQ0lTSU9OID0gTE4xMC5sZW5ndGggLSAxLCBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLCBQID0ge25hbWU6IFwiW29iamVjdCBEZWNpbWFsXVwifTtcblAuYWJzb2x1dGVWYWx1ZSA9IFAuYWJzID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XG4gIGlmICh4LnMgPCAwKVxuICAgIHgucyA9IDE7XG4gIHJldHVybiBmaW5hbGlzZSh4KTtcbn07XG5QLmNlaWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcbn07XG5QLmNvbXBhcmVkVG8gPSBQLmNtcCA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIGksIGosIHhkTCwgeWRMLCB4ID0gdGhpcywgeGQgPSB4LmQsIHlkID0gKHkgPSBuZXcgeC5jb25zdHJ1Y3Rvcih5KSkuZCwgeHMgPSB4LnMsIHlzID0geS5zO1xuICBpZiAoIXhkIHx8ICF5ZCkge1xuICAgIHJldHVybiAheHMgfHwgIXlzID8gTmFOIDogeHMgIT09IHlzID8geHMgOiB4ZCA9PT0geWQgPyAwIDogIXhkIF4geHMgPCAwID8gMSA6IC0xO1xuICB9XG4gIGlmICgheGRbMF0gfHwgIXlkWzBdKVxuICAgIHJldHVybiB4ZFswXSA/IHhzIDogeWRbMF0gPyAteXMgOiAwO1xuICBpZiAoeHMgIT09IHlzKVxuICAgIHJldHVybiB4cztcbiAgaWYgKHguZSAhPT0geS5lKVxuICAgIHJldHVybiB4LmUgPiB5LmUgXiB4cyA8IDAgPyAxIDogLTE7XG4gIHhkTCA9IHhkLmxlbmd0aDtcbiAgeWRMID0geWQubGVuZ3RoO1xuICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XG4gICAgaWYgKHhkW2ldICE9PSB5ZFtpXSlcbiAgICAgIHJldHVybiB4ZFtpXSA+IHlkW2ldIF4geHMgPCAwID8gMSA6IC0xO1xuICB9XG4gIHJldHVybiB4ZEwgPT09IHlkTCA/IDAgOiB4ZEwgPiB5ZEwgXiB4cyA8IDAgPyAxIDogLTE7XG59O1xuUC5jb3NpbmUgPSBQLmNvcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHIsIHJtLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICgheC5kKVxuICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xuICBpZiAoIXguZFswXSlcbiAgICByZXR1cm4gbmV3IEN0b3IoMSk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgeCA9IGNvc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPT0gMiB8fCBxdWFkcmFudCA9PSAzID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XG59O1xuUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZSwgbSwgbiwgciwgcmVwLCBzLCBzZCwgdCwgdDMsIHQzcGx1c3gsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIHMgPSB4LnMgKiBtYXRocG93KHgucyAqIHgsIDEgLyAzKTtcbiAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XG4gICAgbiA9IGRpZ2l0c1RvU3RyaW5nKHguZCk7XG4gICAgZSA9IHguZTtcbiAgICBpZiAocyA9IChlIC0gbi5sZW5ndGggKyAxKSAlIDMpXG4gICAgICBuICs9IHMgPT0gMSB8fCBzID09IC0yID8gXCIwXCIgOiBcIjAwXCI7XG4gICAgcyA9IG1hdGhwb3cobiwgMSAvIDMpO1xuICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDMpIC0gKGUgJSAzID09IChlIDwgMCA/IC0xIDogMikpO1xuICAgIGlmIChzID09IDEgLyAwKSB7XG4gICAgICBuID0gXCI1ZVwiICsgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKFwiZVwiKSArIDEpICsgZTtcbiAgICB9XG4gICAgciA9IG5ldyBDdG9yKG4pO1xuICAgIHIucyA9IHgucztcbiAgfSBlbHNlIHtcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcbiAgfVxuICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcbiAgZm9yICg7IDsgKSB7XG4gICAgdCA9IHI7XG4gICAgdDMgPSB0LnRpbWVzKHQpLnRpbWVzKHQpO1xuICAgIHQzcGx1c3ggPSB0My5wbHVzKHgpO1xuICAgIHIgPSBkaXZpZGUodDNwbHVzeC5wbHVzKHgpLnRpbWVzKHQpLCB0M3BsdXN4LnBsdXModDMpLCBzZCArIDIsIDEpO1xuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcbiAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcbiAgICAgIGlmIChuID09IFwiOTk5OVwiIHx8ICFyZXAgJiYgbiA9PSBcIjQ5OTlcIikge1xuICAgICAgICBpZiAoIXJlcCkge1xuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS50aW1lcyh0KS5lcSh4KSkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2QgKz0gNDtcbiAgICAgICAgcmVwID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09IFwiNVwiKSB7XG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xuICAgICAgICAgIG0gPSAhci50aW1lcyhyKS50aW1lcyhyKS5lcSh4KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICByZXR1cm4gZmluYWxpc2UociwgZSwgQ3Rvci5yb3VuZGluZywgbSk7XG59O1xuUC5kZWNpbWFsUGxhY2VzID0gUC5kcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdywgZCA9IHRoaXMuZCwgbiA9IE5hTjtcbiAgaWYgKGQpIHtcbiAgICB3ID0gZC5sZW5ndGggLSAxO1xuICAgIG4gPSAodyAtIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkpICogTE9HX0JBU0U7XG4gICAgdyA9IGRbd107XG4gICAgaWYgKHcpXG4gICAgICBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApXG4gICAgICAgIG4tLTtcbiAgICBpZiAobiA8IDApXG4gICAgICBuID0gMDtcbiAgfVxuICByZXR1cm4gbjtcbn07XG5QLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24oeSkge1xuICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcbn07XG5QLmRpdmlkZWRUb0ludGVnZXJCeSA9IFAuZGl2VG9JbnQgPSBmdW5jdGlvbih5KSB7XG4gIHZhciB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIHJldHVybiBmaW5hbGlzZShkaXZpZGUoeCwgbmV3IEN0b3IoeSksIDAsIDEsIDEpLCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZyk7XG59O1xuUC5lcXVhbHMgPSBQLmVxID0gZnVuY3Rpb24oeSkge1xuICByZXR1cm4gdGhpcy5jbXAoeSkgPT09IDA7XG59O1xuUC5mbG9vciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDMpO1xufTtcblAuZ3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24oeSkge1xuICByZXR1cm4gdGhpcy5jbXAoeSkgPiAwO1xufTtcblAuZ3JlYXRlclRoYW5PckVxdWFsVG8gPSBQLmd0ZSA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIGsgPSB0aGlzLmNtcCh5KTtcbiAgcmV0dXJuIGsgPT0gMSB8fCBrID09PSAwO1xufTtcblAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaywgbiwgcHIsIHJtLCBsZW4sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3Rvciwgb25lID0gbmV3IEN0b3IoMSk7XG4gIGlmICgheC5pc0Zpbml0ZSgpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4LnMgPyAxIC8gMCA6IE5hTik7XG4gIGlmICh4LmlzWmVybygpKVxuICAgIHJldHVybiBvbmU7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICBsZW4gPSB4LmQubGVuZ3RoO1xuICBpZiAobGVuIDwgMzIpIHtcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xuICAgIG4gPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgayA9IDE2O1xuICAgIG4gPSBcIjIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTBcIjtcbiAgfVxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMobiksIG5ldyBDdG9yKDEpLCB0cnVlKTtcbiAgdmFyIGNvc2gyX3gsIGkgPSBrLCBkOCA9IG5ldyBDdG9yKDgpO1xuICBmb3IgKDsgaS0tOyApIHtcbiAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcbiAgICB4ID0gb25lLm1pbnVzKGNvc2gyX3gudGltZXMoZDgubWludXMoY29zaDJfeC50aW1lcyhkOCkpKSk7XG4gIH1cbiAgcmV0dXJuIGZpbmFsaXNlKHgsIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSwgdHJ1ZSk7XG59O1xuUC5oeXBlcmJvbGljU2luZSA9IFAuc2luaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaywgcHIsIHJtLCBsZW4sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICBsZW4gPSB4LmQubGVuZ3RoO1xuICBpZiAobGVuIDwgMykge1xuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xuICAgIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xuICAgIHggPSB4LnRpbWVzKDEgLyB0aW55UG93KDUsIGspKTtcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgsIHRydWUpO1xuICAgIHZhciBzaW5oMl94LCBkNSA9IG5ldyBDdG9yKDUpLCBkMTYgPSBuZXcgQ3RvcigxNiksIGQyMCA9IG5ldyBDdG9yKDIwKTtcbiAgICBmb3IgKDsgay0tOyApIHtcbiAgICAgIHNpbmgyX3ggPSB4LnRpbWVzKHgpO1xuICAgICAgeCA9IHgudGltZXMoZDUucGx1cyhzaW5oMl94LnRpbWVzKGQxNi50aW1lcyhzaW5oMl94KS5wbHVzKGQyMCkpKSk7XG4gICAgfVxuICB9XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSwgdHJ1ZSk7XG59O1xuUC5oeXBlcmJvbGljVGFuZ2VudCA9IFAudGFuaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHIsIHJtLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICgheC5pc0Zpbml0ZSgpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xuICBpZiAoeC5pc1plcm8oKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDc7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcbn07XG5QLmludmVyc2VDb3NpbmUgPSBQLmFjb3MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbGZQaSwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yLCBrID0geC5hYnMoKS5jbXAoMSksIHByID0gQ3Rvci5wcmVjaXNpb24sIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgaWYgKGsgIT09IC0xKSB7XG4gICAgcmV0dXJuIGsgPT09IDAgPyB4LmlzTmVnKCkgPyBnZXRQaShDdG9yLCBwciwgcm0pIDogbmV3IEN0b3IoMCkgOiBuZXcgQ3RvcihOYU4pO1xuICB9XG4gIGlmICh4LmlzWmVybygpKVxuICAgIHJldHVybiBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xuICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XG4gIHggPSB4LmFzaW4oKTtcbiAgaGFsZlBpID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4gaGFsZlBpLm1pbnVzKHgpO1xufTtcblAuaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgPSBQLmFjb3NoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwciwgcm0sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKHgubHRlKDEpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4LmVxKDEpID8gMCA6IE5hTik7XG4gIGlmICgheC5pc0Zpbml0ZSgpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDQ7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBDdG9yLnJvdW5kaW5nID0gcm07XG4gIHJldHVybiB4LmxuKCk7XG59O1xuUC5pbnZlcnNlSHlwZXJib2xpY1NpbmUgPSBQLmFzaW5oID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwciwgcm0sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDIgKiBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNjtcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIHggPSB4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoeCk7XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4geC5sbigpO1xufTtcblAuaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ID0gUC5hdGFuaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHIsIHJtLCB3cHIsIHhzZCwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoIXguaXNGaW5pdGUoKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgaWYgKHguZSA+PSAwKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4LmFicygpLmVxKDEpID8geC5zIC8gMCA6IHguaXNaZXJvKCkgPyB4IDogTmFOKTtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICB4c2QgPSB4LnNkKCk7XG4gIGlmIChNYXRoLm1heCh4c2QsIHByKSA8IDIgKiAteC5lIC0gMSlcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XG4gIEN0b3IucHJlY2lzaW9uID0gd3ByID0geHNkIC0geC5lO1xuICB4ID0gZGl2aWRlKHgucGx1cygxKSwgbmV3IEN0b3IoMSkubWludXMoeCksIHdwciArIHByLCAxKTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICB4ID0geC5sbigpO1xuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBDdG9yLnJvdW5kaW5nID0gcm07XG4gIHJldHVybiB4LnRpbWVzKDAuNSk7XG59O1xuUC5pbnZlcnNlU2luZSA9IFAuYXNpbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGFsZlBpLCBrLCBwciwgcm0sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBrID0geC5hYnMoKS5jbXAoMSk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgaWYgKGsgIT09IC0xKSB7XG4gICAgaWYgKGsgPT09IDApIHtcbiAgICAgIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XG4gICAgICBoYWxmUGkucyA9IHgucztcbiAgICAgIHJldHVybiBoYWxmUGk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xuICB9XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA2O1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgeCA9IHguZGl2KG5ldyBDdG9yKDEpLm1pbnVzKHgudGltZXMoeCkpLnNxcnQoKS5wbHVzKDEpKS5hdGFuKCk7XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIHgudGltZXMoMik7XG59O1xuUC5pbnZlcnNlVGFuZ2VudCA9IFAuYXRhbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaSwgaiwgaywgbiwgcHgsIHQsIHIsIHdwciwgeDIsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvciwgcHIgPSBDdG9yLnByZWNpc2lvbiwgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBpZiAoIXguaXNGaW5pdGUoKSkge1xuICAgIGlmICgheC5zKVxuICAgICAgcmV0dXJuIG5ldyBDdG9yKE5hTik7XG4gICAgaWYgKHByICsgNCA8PSBQSV9QUkVDSVNJT04pIHtcbiAgICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xuICAgICAgci5zID0geC5zO1xuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICB9IGVsc2UgaWYgKHguaXNaZXJvKCkpIHtcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIH0gZWxzZSBpZiAoeC5hYnMoKS5lcSgxKSAmJiBwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XG4gICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuMjUpO1xuICAgIHIucyA9IHgucztcbiAgICByZXR1cm4gcjtcbiAgfVxuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xuICBmb3IgKGkgPSBrOyBpOyAtLWkpXG4gICAgeCA9IHguZGl2KHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cygxKSk7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIGogPSBNYXRoLmNlaWwod3ByIC8gTE9HX0JBU0UpO1xuICBuID0gMTtcbiAgeDIgPSB4LnRpbWVzKHgpO1xuICByID0gbmV3IEN0b3IoeCk7XG4gIHB4ID0geDtcbiAgZm9yICg7IGkgIT09IC0xOyApIHtcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcbiAgICB0ID0gci5taW51cyhweC5kaXYobiArPSAyKSk7XG4gICAgcHggPSBweC50aW1lcyh4Mik7XG4gICAgciA9IHQucGx1cyhweC5kaXYobiArPSAyKSk7XG4gICAgaWYgKHIuZFtqXSAhPT0gdm9pZCAwKVxuICAgICAgZm9yIChpID0gajsgci5kW2ldID09PSB0LmRbaV0gJiYgaS0tOyApXG4gICAgICAgIDtcbiAgfVxuICBpZiAoaylcbiAgICByID0gci50aW1lcygyIDw8IGsgLSAxKTtcbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcbn07XG5QLmlzRmluaXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhIXRoaXMuZDtcbn07XG5QLmlzSW50ZWdlciA9IFAuaXNJbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICEhdGhpcy5kICYmIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkgPiB0aGlzLmQubGVuZ3RoIC0gMjtcbn07XG5QLmlzTmFOID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5zO1xufTtcblAuaXNOZWdhdGl2ZSA9IFAuaXNOZWcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucyA8IDA7XG59O1xuUC5pc1Bvc2l0aXZlID0gUC5pc1BvcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zID4gMDtcbn07XG5QLmlzWmVybyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xufTtcblAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24oeSkge1xuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xufTtcblAubGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uKHkpIHtcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcbn07XG5QLmxvZ2FyaXRobSA9IFAubG9nID0gZnVuY3Rpb24oYmFzZSkge1xuICB2YXIgaXNCYXNlMTAsIGQsIGRlbm9taW5hdG9yLCBrLCBpbmYsIG51bSwgc2QsIHIsIGFyZyA9IHRoaXMsIEN0b3IgPSBhcmcuY29uc3RydWN0b3IsIHByID0gQ3Rvci5wcmVjaXNpb24sIHJtID0gQ3Rvci5yb3VuZGluZywgZ3VhcmQgPSA1O1xuICBpZiAoYmFzZSA9PSBudWxsKSB7XG4gICAgYmFzZSA9IG5ldyBDdG9yKDEwKTtcbiAgICBpc0Jhc2UxMCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgYmFzZSA9IG5ldyBDdG9yKGJhc2UpO1xuICAgIGQgPSBiYXNlLmQ7XG4gICAgaWYgKGJhc2UucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYmFzZS5lcSgxKSlcbiAgICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xuICAgIGlzQmFzZTEwID0gYmFzZS5lcSgxMCk7XG4gIH1cbiAgZCA9IGFyZy5kO1xuICBpZiAoYXJnLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGFyZy5lcSgxKSkge1xuICAgIHJldHVybiBuZXcgQ3RvcihkICYmICFkWzBdID8gLTEgLyAwIDogYXJnLnMgIT0gMSA/IE5hTiA6IGQgPyAwIDogMSAvIDApO1xuICB9XG4gIGlmIChpc0Jhc2UxMCkge1xuICAgIGlmIChkLmxlbmd0aCA+IDEpIHtcbiAgICAgIGluZiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoayA9IGRbMF07IGsgJSAxMCA9PT0gMDsgKVxuICAgICAgICBrIC89IDEwO1xuICAgICAgaW5mID0gayAhPT0gMTtcbiAgICB9XG4gIH1cbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgc2QgPSBwciArIGd1YXJkO1xuICBudW0gPSBuYXR1cmFsTG9nYXJpdGhtKGFyZywgc2QpO1xuICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xuICByID0gZGl2aWRlKG51bSwgZGVub21pbmF0b3IsIHNkLCAxKTtcbiAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrID0gcHIsIHJtKSkge1xuICAgIGRvIHtcbiAgICAgIHNkICs9IDEwO1xuICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcbiAgICAgIGRlbm9taW5hdG9yID0gaXNCYXNlMTAgPyBnZXRMbjEwKEN0b3IsIHNkICsgMTApIDogbmF0dXJhbExvZ2FyaXRobShiYXNlLCBzZCk7XG4gICAgICByID0gZGl2aWRlKG51bSwgZGVub21pbmF0b3IsIHNkLCAxKTtcbiAgICAgIGlmICghaW5mKSB7XG4gICAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShrICsgMSwgayArIDE1KSArIDEgPT0gMWUxNCkge1xuICAgICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrICs9IDEwLCBybSkpO1xuICB9XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XG59O1xuUC5taW51cyA9IFAuc3ViID0gZnVuY3Rpb24oeSkge1xuICB2YXIgZCwgZSwgaSwgaiwgaywgbGVuLCBwciwgcm0sIHhkLCB4ZSwgeExUeSwgeWQsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgeSA9IG5ldyBDdG9yKHkpO1xuICBpZiAoIXguZCB8fCAheS5kKSB7XG4gICAgaWYgKCF4LnMgfHwgIXkucylcbiAgICAgIHkgPSBuZXcgQ3RvcihOYU4pO1xuICAgIGVsc2UgaWYgKHguZClcbiAgICAgIHkucyA9IC15LnM7XG4gICAgZWxzZVxuICAgICAgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgIT09IHkucyA/IHggOiBOYU4pO1xuICAgIHJldHVybiB5O1xuICB9XG4gIGlmICh4LnMgIT0geS5zKSB7XG4gICAgeS5zID0gLXkucztcbiAgICByZXR1cm4geC5wbHVzKHkpO1xuICB9XG4gIHhkID0geC5kO1xuICB5ZCA9IHkuZDtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkge1xuICAgIGlmICh5ZFswXSlcbiAgICAgIHkucyA9IC15LnM7XG4gICAgZWxzZSBpZiAoeGRbMF0pXG4gICAgICB5ID0gbmV3IEN0b3IoeCk7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcbiAgfVxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcbiAgeGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xuICB4ZCA9IHhkLnNsaWNlKCk7XG4gIGsgPSB4ZSAtIGU7XG4gIGlmIChrKSB7XG4gICAgeExUeSA9IGsgPCAwO1xuICAgIGlmICh4TFR5KSB7XG4gICAgICBkID0geGQ7XG4gICAgICBrID0gLWs7XG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGQgPSB5ZDtcbiAgICAgIGUgPSB4ZTtcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcbiAgICB9XG4gICAgaSA9IE1hdGgubWF4KE1hdGguY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDI7XG4gICAgaWYgKGsgPiBpKSB7XG4gICAgICBrID0gaTtcbiAgICAgIGQubGVuZ3RoID0gMTtcbiAgICB9XG4gICAgZC5yZXZlcnNlKCk7XG4gICAgZm9yIChpID0gazsgaS0tOyApXG4gICAgICBkLnB1c2goMCk7XG4gICAgZC5yZXZlcnNlKCk7XG4gIH0gZWxzZSB7XG4gICAgaSA9IHhkLmxlbmd0aDtcbiAgICBsZW4gPSB5ZC5sZW5ndGg7XG4gICAgeExUeSA9IGkgPCBsZW47XG4gICAgaWYgKHhMVHkpXG4gICAgICBsZW4gPSBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHhkW2ldICE9IHlkW2ldKSB7XG4gICAgICAgIHhMVHkgPSB4ZFtpXSA8IHlkW2ldO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgayA9IDA7XG4gIH1cbiAgaWYgKHhMVHkpIHtcbiAgICBkID0geGQ7XG4gICAgeGQgPSB5ZDtcbiAgICB5ZCA9IGQ7XG4gICAgeS5zID0gLXkucztcbiAgfVxuICBsZW4gPSB4ZC5sZW5ndGg7XG4gIGZvciAoaSA9IHlkLmxlbmd0aCAtIGxlbjsgaSA+IDA7IC0taSlcbiAgICB4ZFtsZW4rK10gPSAwO1xuICBmb3IgKGkgPSB5ZC5sZW5ndGg7IGkgPiBrOyApIHtcbiAgICBpZiAoeGRbLS1pXSA8IHlkW2ldKSB7XG4gICAgICBmb3IgKGogPSBpOyBqICYmIHhkWy0tal0gPT09IDA7IClcbiAgICAgICAgeGRbal0gPSBCQVNFIC0gMTtcbiAgICAgIC0teGRbal07XG4gICAgICB4ZFtpXSArPSBCQVNFO1xuICAgIH1cbiAgICB4ZFtpXSAtPSB5ZFtpXTtcbiAgfVxuICBmb3IgKDsgeGRbLS1sZW5dID09PSAwOyApXG4gICAgeGQucG9wKCk7XG4gIGZvciAoOyB4ZFswXSA9PT0gMDsgeGQuc2hpZnQoKSlcbiAgICAtLWU7XG4gIGlmICgheGRbMF0pXG4gICAgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcbiAgeS5kID0geGQ7XG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XG59O1xuUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIHEsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgeSA9IG5ldyBDdG9yKHkpO1xuICBpZiAoIXguZCB8fCAheS5zIHx8IHkuZCAmJiAheS5kWzBdKVxuICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xuICBpZiAoIXkuZCB8fCB4LmQgJiYgIXguZFswXSkge1xuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xuICB9XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIGlmIChDdG9yLm1vZHVsbyA9PSA5KSB7XG4gICAgcSA9IGRpdmlkZSh4LCB5LmFicygpLCAwLCAzLCAxKTtcbiAgICBxLnMgKj0geS5zO1xuICB9IGVsc2Uge1xuICAgIHEgPSBkaXZpZGUoeCwgeSwgMCwgQ3Rvci5tb2R1bG8sIDEpO1xuICB9XG4gIHEgPSBxLnRpbWVzKHkpO1xuICBleHRlcm5hbCA9IHRydWU7XG4gIHJldHVybiB4Lm1pbnVzKHEpO1xufTtcblAubmF0dXJhbEV4cG9uZW50aWFsID0gUC5leHAgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5hdHVyYWxFeHBvbmVudGlhbCh0aGlzKTtcbn07XG5QLm5hdHVyYWxMb2dhcml0aG0gPSBQLmxuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuYXR1cmFsTG9nYXJpdGhtKHRoaXMpO1xufTtcblAubmVnYXRlZCA9IFAubmVnID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XG4gIHgucyA9IC14LnM7XG4gIHJldHVybiBmaW5hbGlzZSh4KTtcbn07XG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIHkgPSBuZXcgQ3Rvcih5KTtcbiAgaWYgKCF4LmQgfHwgIXkuZCkge1xuICAgIGlmICgheC5zIHx8ICF5LnMpXG4gICAgICB5ID0gbmV3IEN0b3IoTmFOKTtcbiAgICBlbHNlIGlmICgheC5kKVxuICAgICAgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgPT09IHkucyA/IHggOiBOYU4pO1xuICAgIHJldHVybiB5O1xuICB9XG4gIGlmICh4LnMgIT0geS5zKSB7XG4gICAgeS5zID0gLXkucztcbiAgICByZXR1cm4geC5taW51cyh5KTtcbiAgfVxuICB4ZCA9IHguZDtcbiAgeWQgPSB5LmQ7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcbiAgICBpZiAoIXlkWzBdKVxuICAgICAgeSA9IG5ldyBDdG9yKHgpO1xuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xuICB9XG4gIGsgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcbiAgeGQgPSB4ZC5zbGljZSgpO1xuICBpID0gayAtIGU7XG4gIGlmIChpKSB7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICBkID0geGQ7XG4gICAgICBpID0gLWk7XG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGQgPSB5ZDtcbiAgICAgIGUgPSBrO1xuICAgICAgbGVuID0geGQubGVuZ3RoO1xuICAgIH1cbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xuICAgIGxlbiA9IGsgPiBsZW4gPyBrICsgMSA6IGxlbiArIDE7XG4gICAgaWYgKGkgPiBsZW4pIHtcbiAgICAgIGkgPSBsZW47XG4gICAgICBkLmxlbmd0aCA9IDE7XG4gICAgfVxuICAgIGQucmV2ZXJzZSgpO1xuICAgIGZvciAoOyBpLS07IClcbiAgICAgIGQucHVzaCgwKTtcbiAgICBkLnJldmVyc2UoKTtcbiAgfVxuICBsZW4gPSB4ZC5sZW5ndGg7XG4gIGkgPSB5ZC5sZW5ndGg7XG4gIGlmIChsZW4gLSBpIDwgMCkge1xuICAgIGkgPSBsZW47XG4gICAgZCA9IHlkO1xuICAgIHlkID0geGQ7XG4gICAgeGQgPSBkO1xuICB9XG4gIGZvciAoY2FycnkgPSAwOyBpOyApIHtcbiAgICBjYXJyeSA9ICh4ZFstLWldID0geGRbaV0gKyB5ZFtpXSArIGNhcnJ5KSAvIEJBU0UgfCAwO1xuICAgIHhkW2ldICU9IEJBU0U7XG4gIH1cbiAgaWYgKGNhcnJ5KSB7XG4gICAgeGQudW5zaGlmdChjYXJyeSk7XG4gICAgKytlO1xuICB9XG4gIGZvciAobGVuID0geGQubGVuZ3RoOyB4ZFstLWxlbl0gPT0gMDsgKVxuICAgIHhkLnBvcCgpO1xuICB5LmQgPSB4ZDtcbiAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIGUpO1xuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcbn07XG5QLnByZWNpc2lvbiA9IFAuc2QgPSBmdW5jdGlvbih6KSB7XG4gIHZhciBrLCB4ID0gdGhpcztcbiAgaWYgKHogIT09IHZvaWQgMCAmJiB6ICE9PSAhIXogJiYgeiAhPT0gMSAmJiB6ICE9PSAwKVxuICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHopO1xuICBpZiAoeC5kKSB7XG4gICAgayA9IGdldFByZWNpc2lvbih4LmQpO1xuICAgIGlmICh6ICYmIHguZSArIDEgPiBrKVxuICAgICAgayA9IHguZSArIDE7XG4gIH0gZWxzZSB7XG4gICAgayA9IE5hTjtcbiAgfVxuICByZXR1cm4gaztcbn07XG5QLnJvdW5kID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgeC5lICsgMSwgQ3Rvci5yb3VuZGluZyk7XG59O1xuUC5zaW5lID0gUC5zaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByLCBybSwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoIXguaXNGaW5pdGUoKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgaWYgKHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XG4gIHggPSBzaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBDdG9yLnJvdW5kaW5nID0gcm07XG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA+IDIgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcbn07XG5QLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG0sIG4sIHNkLCByLCByZXAsIHQsIHggPSB0aGlzLCBkID0geC5kLCBlID0geC5lLCBzID0geC5zLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKHMgIT09IDEgfHwgIWQgfHwgIWRbMF0pIHtcbiAgICByZXR1cm4gbmV3IEN0b3IoIXMgfHwgcyA8IDAgJiYgKCFkIHx8IGRbMF0pID8gTmFOIDogZCA/IHggOiAxIC8gMCk7XG4gIH1cbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgcyA9IE1hdGguc3FydCgreCk7XG4gIGlmIChzID09IDAgfHwgcyA9PSAxIC8gMCkge1xuICAgIG4gPSBkaWdpdHNUb1N0cmluZyhkKTtcbiAgICBpZiAoKG4ubGVuZ3RoICsgZSkgJSAyID09IDApXG4gICAgICBuICs9IFwiMFwiO1xuICAgIHMgPSBNYXRoLnNxcnQobik7XG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xuICAgIGlmIChzID09IDEgLyAwKSB7XG4gICAgICBuID0gXCI1ZVwiICsgZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKFwiZVwiKSArIDEpICsgZTtcbiAgICB9XG4gICAgciA9IG5ldyBDdG9yKG4pO1xuICB9IGVsc2Uge1xuICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xuICB9XG4gIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xuICBmb3IgKDsgOyApIHtcbiAgICB0ID0gcjtcbiAgICByID0gdC5wbHVzKGRpdmlkZSh4LCB0LCBzZCArIDIsIDEpKS50aW1lcygwLjUpO1xuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcbiAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcbiAgICAgIGlmIChuID09IFwiOTk5OVwiIHx8ICFyZXAgJiYgbiA9PSBcIjQ5OTlcIikge1xuICAgICAgICBpZiAoIXJlcCkge1xuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS5lcSh4KSkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2QgKz0gNDtcbiAgICAgICAgcmVwID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09IFwiNVwiKSB7XG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xuICAgICAgICAgIG0gPSAhci50aW1lcyhyKS5lcSh4KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICByZXR1cm4gZmluYWxpc2UociwgZSwgQ3Rvci5yb3VuZGluZywgbSk7XG59O1xuUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByLCBybSwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoIXguaXNGaW5pdGUoKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgaWYgKHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyAxMDtcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XG4gIHggPSB4LnNpbigpO1xuICB4LnMgPSAxO1xuICB4ID0gZGl2aWRlKHgsIG5ldyBDdG9yKDEpLm1pbnVzKHgudGltZXMoeCkpLnNxcnQoKSwgcHIgKyAxMCwgMCk7XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xufTtcblAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvciwgeGQgPSB4LmQsIHlkID0gKHkgPSBuZXcgQ3Rvcih5KSkuZDtcbiAgeS5zICo9IHgucztcbiAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xuICAgIHJldHVybiBuZXcgQ3RvcigheS5zIHx8IHhkICYmICF4ZFswXSAmJiAheWQgfHwgeWQgJiYgIXlkWzBdICYmICF4ZCA/IE5hTiA6ICF4ZCB8fCAheWQgPyB5LnMgLyAwIDogeS5zICogMCk7XG4gIH1cbiAgZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSkgKyBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xuICB4ZEwgPSB4ZC5sZW5ndGg7XG4gIHlkTCA9IHlkLmxlbmd0aDtcbiAgaWYgKHhkTCA8IHlkTCkge1xuICAgIHIgPSB4ZDtcbiAgICB4ZCA9IHlkO1xuICAgIHlkID0gcjtcbiAgICByTCA9IHhkTDtcbiAgICB4ZEwgPSB5ZEw7XG4gICAgeWRMID0gckw7XG4gIH1cbiAgciA9IFtdO1xuICByTCA9IHhkTCArIHlkTDtcbiAgZm9yIChpID0gckw7IGktLTsgKVxuICAgIHIucHVzaCgwKTtcbiAgZm9yIChpID0geWRMOyAtLWkgPj0gMDsgKSB7XG4gICAgY2FycnkgPSAwO1xuICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOyApIHtcbiAgICAgIHQgPSByW2tdICsgeWRbaV0gKiB4ZFtrIC0gaSAtIDFdICsgY2Fycnk7XG4gICAgICByW2stLV0gPSB0ICUgQkFTRSB8IDA7XG4gICAgICBjYXJyeSA9IHQgLyBCQVNFIHwgMDtcbiAgICB9XG4gICAgcltrXSA9IChyW2tdICsgY2FycnkpICUgQkFTRSB8IDA7XG4gIH1cbiAgZm9yICg7ICFyWy0tckxdOyApXG4gICAgci5wb3AoKTtcbiAgaWYgKGNhcnJ5KVxuICAgICsrZTtcbiAgZWxzZVxuICAgIHIuc2hpZnQoKTtcbiAgeS5kID0gcjtcbiAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQociwgZSk7XG4gIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKSA6IHk7XG59O1xuUC50b0JpbmFyeSA9IGZ1bmN0aW9uKHNkLCBybSkge1xuICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMiwgc2QsIHJtKTtcbn07XG5QLnRvRGVjaW1hbFBsYWNlcyA9IFAudG9EUCA9IGZ1bmN0aW9uKGRwLCBybSkge1xuICB2YXIgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICB4ID0gbmV3IEN0b3IoeCk7XG4gIGlmIChkcCA9PT0gdm9pZCAwKVxuICAgIHJldHVybiB4O1xuICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcbiAgaWYgKHJtID09PSB2b2lkIDApXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBlbHNlXG4gICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XG4gIHJldHVybiBmaW5hbGlzZSh4LCBkcCArIHguZSArIDEsIHJtKTtcbn07XG5QLnRvRXhwb25lbnRpYWwgPSBmdW5jdGlvbihkcCwgcm0pIHtcbiAgdmFyIHN0ciwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoZHAgPT09IHZvaWQgMCkge1xuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xuICAgIGlmIChybSA9PT0gdm9pZCAwKVxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICAgIGVsc2VcbiAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSwgZHAgKyAxKTtcbiAgfVxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gXCItXCIgKyBzdHIgOiBzdHI7XG59O1xuUC50b0ZpeGVkID0gZnVuY3Rpb24oZHAsIHJtKSB7XG4gIHZhciBzdHIsIHksIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGRwID09PSB2b2lkIDApIHtcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcbiAgfSBlbHNlIHtcbiAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcbiAgICBpZiAocm0gPT09IHZvaWQgMClcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgICBlbHNlXG4gICAgICBjaGVja0ludDMyKHJtLCAwLCA4KTtcbiAgICB5ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgeC5lICsgMSwgcm0pO1xuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHksIGZhbHNlLCBkcCArIHkuZSArIDEpO1xuICB9XG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyBcIi1cIiArIHN0ciA6IHN0cjtcbn07XG5QLnRvRnJhY3Rpb24gPSBmdW5jdGlvbihtYXhEKSB7XG4gIHZhciBkLCBkMCwgZDEsIGQyLCBlLCBrLCBuLCBuMCwgbjEsIHByLCBxLCByLCB4ID0gdGhpcywgeGQgPSB4LmQsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoIXhkKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcbiAgbjEgPSBkMCA9IG5ldyBDdG9yKDEpO1xuICBkMSA9IG4wID0gbmV3IEN0b3IoMCk7XG4gIGQgPSBuZXcgQ3RvcihkMSk7XG4gIGUgPSBkLmUgPSBnZXRQcmVjaXNpb24oeGQpIC0geC5lIC0gMTtcbiAgayA9IGUgJSBMT0dfQkFTRTtcbiAgZC5kWzBdID0gbWF0aHBvdygxMCwgayA8IDAgPyBMT0dfQkFTRSArIGsgOiBrKTtcbiAgaWYgKG1heEQgPT0gbnVsbCkge1xuICAgIG1heEQgPSBlID4gMCA/IGQgOiBuMTtcbiAgfSBlbHNlIHtcbiAgICBuID0gbmV3IEN0b3IobWF4RCk7XG4gICAgaWYgKCFuLmlzSW50KCkgfHwgbi5sdChuMSkpXG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBuKTtcbiAgICBtYXhEID0gbi5ndChkKSA/IGUgPiAwID8gZCA6IG4xIDogbjtcbiAgfVxuICBleHRlcm5hbCA9IGZhbHNlO1xuICBuID0gbmV3IEN0b3IoZGlnaXRzVG9TdHJpbmcoeGQpKTtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgQ3Rvci5wcmVjaXNpb24gPSBlID0geGQubGVuZ3RoICogTE9HX0JBU0UgKiAyO1xuICBmb3IgKDsgOyApIHtcbiAgICBxID0gZGl2aWRlKG4sIGQsIDAsIDEsIDEpO1xuICAgIGQyID0gZDAucGx1cyhxLnRpbWVzKGQxKSk7XG4gICAgaWYgKGQyLmNtcChtYXhEKSA9PSAxKVxuICAgICAgYnJlYWs7XG4gICAgZDAgPSBkMTtcbiAgICBkMSA9IGQyO1xuICAgIGQyID0gbjE7XG4gICAgbjEgPSBuMC5wbHVzKHEudGltZXMoZDIpKTtcbiAgICBuMCA9IGQyO1xuICAgIGQyID0gZDtcbiAgICBkID0gbi5taW51cyhxLnRpbWVzKGQyKSk7XG4gICAgbiA9IGQyO1xuICB9XG4gIGQyID0gZGl2aWRlKG1heEQubWludXMoZDApLCBkMSwgMCwgMSwgMSk7XG4gIG4wID0gbjAucGx1cyhkMi50aW1lcyhuMSkpO1xuICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcbiAgbjAucyA9IG4xLnMgPSB4LnM7XG4gIHIgPSBkaXZpZGUobjEsIGQxLCBlLCAxKS5taW51cyh4KS5hYnMoKS5jbXAoZGl2aWRlKG4wLCBkMCwgZSwgMSkubWludXMoeCkuYWJzKCkpIDwgMSA/IFtuMSwgZDFdIDogW24wLCBkMF07XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIHI7XG59O1xuUC50b0hleGFkZWNpbWFsID0gUC50b0hleCA9IGZ1bmN0aW9uKHNkLCBybSkge1xuICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMTYsIHNkLCBybSk7XG59O1xuUC50b05lYXJlc3QgPSBmdW5jdGlvbih5LCBybSkge1xuICB2YXIgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICB4ID0gbmV3IEN0b3IoeCk7XG4gIGlmICh5ID09IG51bGwpIHtcbiAgICBpZiAoIXguZClcbiAgICAgIHJldHVybiB4O1xuICAgIHkgPSBuZXcgQ3RvcigxKTtcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIH0gZWxzZSB7XG4gICAgeSA9IG5ldyBDdG9yKHkpO1xuICAgIGlmIChybSA9PT0gdm9pZCAwKSB7XG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xuICAgIH1cbiAgICBpZiAoIXguZClcbiAgICAgIHJldHVybiB5LnMgPyB4IDogeTtcbiAgICBpZiAoIXkuZCkge1xuICAgICAgaWYgKHkucylcbiAgICAgICAgeS5zID0geC5zO1xuICAgICAgcmV0dXJuIHk7XG4gICAgfVxuICB9XG4gIGlmICh5LmRbMF0pIHtcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xuICAgIHggPSBkaXZpZGUoeCwgeSwgMCwgcm0sIDEpLnRpbWVzKHkpO1xuICAgIGV4dGVybmFsID0gdHJ1ZTtcbiAgICBmaW5hbGlzZSh4KTtcbiAgfSBlbHNlIHtcbiAgICB5LnMgPSB4LnM7XG4gICAgeCA9IHk7XG4gIH1cbiAgcmV0dXJuIHg7XG59O1xuUC50b051bWJlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gK3RoaXM7XG59O1xuUC50b09jdGFsID0gZnVuY3Rpb24oc2QsIHJtKSB7XG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCA4LCBzZCwgcm0pO1xufTtcblAudG9Qb3dlciA9IFAucG93ID0gZnVuY3Rpb24oeSkge1xuICB2YXIgZSwgaywgcHIsIHIsIHJtLCBzLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3IsIHluID0gKyh5ID0gbmV3IEN0b3IoeSkpO1xuICBpZiAoIXguZCB8fCAheS5kIHx8ICF4LmRbMF0gfHwgIXkuZFswXSlcbiAgICByZXR1cm4gbmV3IEN0b3IobWF0aHBvdygreCwgeW4pKTtcbiAgeCA9IG5ldyBDdG9yKHgpO1xuICBpZiAoeC5lcSgxKSlcbiAgICByZXR1cm4geDtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBpZiAoeS5lcSgxKSlcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgcHIsIHJtKTtcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XG4gIGlmIChlID49IHkuZC5sZW5ndGggLSAxICYmIChrID0geW4gPCAwID8gLXluIDogeW4pIDw9IE1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICByID0gaW50UG93KEN0b3IsIHgsIGssIHByKTtcbiAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XG4gIH1cbiAgcyA9IHgucztcbiAgaWYgKHMgPCAwKSB7XG4gICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSlcbiAgICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xuICAgIGlmICgoeS5kW2VdICYgMSkgPT0gMClcbiAgICAgIHMgPSAxO1xuICAgIGlmICh4LmUgPT0gMCAmJiB4LmRbMF0gPT0gMSAmJiB4LmQubGVuZ3RoID09IDEpIHtcbiAgICAgIHgucyA9IHM7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gIH1cbiAgayA9IG1hdGhwb3coK3gsIHluKTtcbiAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaykgPyBtYXRoZmxvb3IoeW4gKiAoTWF0aC5sb2coXCIwLlwiICsgZGlnaXRzVG9TdHJpbmcoeC5kKSkgLyBNYXRoLkxOMTAgKyB4LmUgKyAxKSkgOiBuZXcgQ3RvcihrICsgXCJcIikuZTtcbiAgaWYgKGUgPiBDdG9yLm1heEUgKyAxIHx8IGUgPCBDdG9yLm1pbkUgLSAxKVxuICAgIHJldHVybiBuZXcgQ3RvcihlID4gMCA/IHMgLyAwIDogMCk7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIEN0b3Iucm91bmRpbmcgPSB4LnMgPSAxO1xuICBrID0gTWF0aC5taW4oMTIsIChlICsgXCJcIikubGVuZ3RoKTtcbiAgciA9IG5hdHVyYWxFeHBvbmVudGlhbCh5LnRpbWVzKG5hdHVyYWxMb2dhcml0aG0oeCwgcHIgKyBrKSksIHByKTtcbiAgaWYgKHIuZCkge1xuICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDUsIDEpO1xuICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xuICAgICAgZSA9IHByICsgMTA7XG4gICAgICByID0gZmluYWxpc2UobmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBlICsgaykpLCBlKSwgZSArIDUsIDEpO1xuICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKHByICsgMSwgcHIgKyAxNSkgKyAxID09IDFlMTQpIHtcbiAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHIucyA9IHM7XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcbn07XG5QLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24oc2QsIHJtKSB7XG4gIHZhciBzdHIsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKHNkID09PSB2b2lkIDApIHtcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XG4gICAgaWYgKHJtID09PSB2b2lkIDApXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gICAgZWxzZVxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XG4gICAgeCA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBzZCwgcm0pO1xuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHNkIDw9IHguZSB8fCB4LmUgPD0gQ3Rvci50b0V4cE5lZywgc2QpO1xuICB9XG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyBcIi1cIiArIHN0ciA6IHN0cjtcbn07XG5QLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbihzZCwgcm0pIHtcbiAgdmFyIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKHNkID09PSB2b2lkIDApIHtcbiAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgfSBlbHNlIHtcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcbiAgICBpZiAocm0gPT09IHZvaWQgMClcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgICBlbHNlXG4gICAgICBjaGVja0ludDMyKHJtLCAwLCA4KTtcbiAgfVxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XG59O1xuUC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yLCBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyBcIi1cIiArIHN0ciA6IHN0cjtcbn07XG5QLnRydW5jYXRlZCA9IFAudHJ1bmMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAxKTtcbn07XG5QLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yLCBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XG4gIHJldHVybiB4LmlzTmVnKCkgPyBcIi1cIiArIHN0ciA6IHN0cjtcbn07XG5mdW5jdGlvbiBkaWdpdHNUb1N0cmluZyhkKSB7XG4gIHZhciBpLCBrLCB3cywgaW5kZXhPZkxhc3RXb3JkID0gZC5sZW5ndGggLSAxLCBzdHIgPSBcIlwiLCB3ID0gZFswXTtcbiAgaWYgKGluZGV4T2ZMYXN0V29yZCA+IDApIHtcbiAgICBzdHIgKz0gdztcbiAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcbiAgICAgIHdzID0gZFtpXSArIFwiXCI7XG4gICAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XG4gICAgICBpZiAoaylcbiAgICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XG4gICAgICBzdHIgKz0gd3M7XG4gICAgfVxuICAgIHcgPSBkW2ldO1xuICAgIHdzID0gdyArIFwiXCI7XG4gICAgayA9IExPR19CQVNFIC0gd3MubGVuZ3RoO1xuICAgIGlmIChrKVxuICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XG4gIH0gZWxzZSBpZiAodyA9PT0gMCkge1xuICAgIHJldHVybiBcIjBcIjtcbiAgfVxuICBmb3IgKDsgdyAlIDEwID09PSAwOyApXG4gICAgdyAvPSAxMDtcbiAgcmV0dXJuIHN0ciArIHc7XG59XG5mdW5jdGlvbiBjaGVja0ludDMyKGksIG1pbjIsIG1heDIpIHtcbiAgaWYgKGkgIT09IH5+aSB8fCBpIDwgbWluMiB8fCBpID4gbWF4Mikge1xuICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIGkpO1xuICB9XG59XG5mdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcbiAgdmFyIGRpLCBrLCByLCByZDtcbiAgZm9yIChrID0gZFswXTsgayA+PSAxMDsgayAvPSAxMClcbiAgICAtLWk7XG4gIGlmICgtLWkgPCAwKSB7XG4gICAgaSArPSBMT0dfQkFTRTtcbiAgICBkaSA9IDA7XG4gIH0gZWxzZSB7XG4gICAgZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcbiAgICBpICU9IExPR19CQVNFO1xuICB9XG4gIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xuICByZCA9IGRbZGldICUgayB8IDA7XG4gIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xuICAgIGlmIChpIDwgMykge1xuICAgICAgaWYgKGkgPT0gMClcbiAgICAgICAgcmQgPSByZCAvIDEwMCB8IDA7XG4gICAgICBlbHNlIGlmIChpID09IDEpXG4gICAgICAgIHJkID0gcmQgLyAxMCB8IDA7XG4gICAgICByID0gcm0gPCA0ICYmIHJkID09IDk5OTk5IHx8IHJtID4gMyAmJiByZCA9PSA0OTk5OSB8fCByZCA9PSA1ZTQgfHwgcmQgPT0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgciA9IChybSA8IDQgJiYgcmQgKyAxID09IGsgfHwgcm0gPiAzICYmIHJkICsgMSA9PSBrIC8gMikgJiYgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSBtYXRocG93KDEwLCBpIC0gMikgLSAxIHx8IChyZCA9PSBrIC8gMiB8fCByZCA9PSAwKSAmJiAoZFtkaSArIDFdIC8gayAvIDEwMCB8IDApID09IDA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChpIDwgNCkge1xuICAgICAgaWYgKGkgPT0gMClcbiAgICAgICAgcmQgPSByZCAvIDFlMyB8IDA7XG4gICAgICBlbHNlIGlmIChpID09IDEpXG4gICAgICAgIHJkID0gcmQgLyAxMDAgfCAwO1xuICAgICAgZWxzZSBpZiAoaSA9PSAyKVxuICAgICAgICByZCA9IHJkIC8gMTAgfCAwO1xuICAgICAgciA9IChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCA9PSA5OTk5IHx8ICFyZXBlYXRpbmcgJiYgcm0gPiAzICYmIHJkID09IDQ5OTk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIgPSAoKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkICsgMSA9PSBrIHx8ICFyZXBlYXRpbmcgJiYgcm0gPiAzICYmIHJkICsgMSA9PSBrIC8gMikgJiYgKGRbZGkgKyAxXSAvIGsgLyAxZTMgfCAwKSA9PSBtYXRocG93KDEwLCBpIC0gMykgLSAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cbmZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XG4gIHZhciBqLCBhcnIgPSBbMF0sIGFyckwsIGkgPSAwLCBzdHJMID0gc3RyLmxlbmd0aDtcbiAgZm9yICg7IGkgPCBzdHJMOyApIHtcbiAgICBmb3IgKGFyckwgPSBhcnIubGVuZ3RoOyBhcnJMLS07IClcbiAgICAgIGFyclthcnJMXSAqPSBiYXNlSW47XG4gICAgYXJyWzBdICs9IE5VTUVSQUxTLmluZGV4T2Yoc3RyLmNoYXJBdChpKyspKTtcbiAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYXJyW2pdID4gYmFzZU91dCAtIDEpIHtcbiAgICAgICAgaWYgKGFycltqICsgMV0gPT09IHZvaWQgMClcbiAgICAgICAgICBhcnJbaiArIDFdID0gMDtcbiAgICAgICAgYXJyW2ogKyAxXSArPSBhcnJbal0gLyBiYXNlT3V0IHwgMDtcbiAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnIucmV2ZXJzZSgpO1xufVxuZnVuY3Rpb24gY29zaW5lKEN0b3IsIHgpIHtcbiAgdmFyIGssIHksIGxlbiA9IHguZC5sZW5ndGg7XG4gIGlmIChsZW4gPCAzMikge1xuICAgIGsgPSBNYXRoLmNlaWwobGVuIC8gMyk7XG4gICAgeSA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICBrID0gMTY7XG4gICAgeSA9IFwiMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMFwiO1xuICB9XG4gIEN0b3IucHJlY2lzaW9uICs9IGs7XG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyh5KSwgbmV3IEN0b3IoMSkpO1xuICBmb3IgKHZhciBpID0gazsgaS0tOyApIHtcbiAgICB2YXIgY29zMnggPSB4LnRpbWVzKHgpO1xuICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XG4gIH1cbiAgQ3Rvci5wcmVjaXNpb24gLT0gaztcbiAgcmV0dXJuIHg7XG59XG52YXIgZGl2aWRlID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG11bHRpcGx5SW50ZWdlcih4LCBrLCBiYXNlKSB7XG4gICAgdmFyIHRlbXAsIGNhcnJ5ID0gMCwgaSA9IHgubGVuZ3RoO1xuICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOyApIHtcbiAgICAgIHRlbXAgPSB4W2ldICogayArIGNhcnJ5O1xuICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlIHwgMDtcbiAgICAgIGNhcnJ5ID0gdGVtcCAvIGJhc2UgfCAwO1xuICAgIH1cbiAgICBpZiAoY2FycnkpXG4gICAgICB4LnVuc2hpZnQoY2FycnkpO1xuICAgIHJldHVybiB4O1xuICB9XG4gIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYiwgYUwsIGJMKSB7XG4gICAgdmFyIGksIHI7XG4gICAgaWYgKGFMICE9IGJMKSB7XG4gICAgICByID0gYUwgPiBiTCA/IDEgOiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gciA9IDA7IGkgPCBhTDsgaSsrKSB7XG4gICAgICAgIGlmIChhW2ldICE9IGJbaV0pIHtcbiAgICAgICAgICByID0gYVtpXSA+IGJbaV0gPyAxIDogLTE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG4gIH1cbiAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgZm9yICg7IGFMLS07ICkge1xuICAgICAgYVthTF0gLT0gaTtcbiAgICAgIGkgPSBhW2FMXSA8IGJbYUxdID8gMSA6IDA7XG4gICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcbiAgICB9XG4gICAgZm9yICg7ICFhWzBdICYmIGEubGVuZ3RoID4gMTsgKVxuICAgICAgYS5zaGlmdCgpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbih4LCB5LCBwciwgcm0sIGRwLCBiYXNlKSB7XG4gICAgdmFyIGNtcCwgZSwgaSwgaywgbG9nQmFzZSwgbW9yZSwgcHJvZCwgcHJvZEwsIHEsIHFkLCByZW0sIHJlbUwsIHJlbTAsIHNkLCB0LCB4aSwgeEwsIHlkMCwgeUwsIHl6LCBDdG9yID0geC5jb25zdHJ1Y3Rvciwgc2lnbjIgPSB4LnMgPT0geS5zID8gMSA6IC0xLCB4ZCA9IHguZCwgeWQgPSB5LmQ7XG4gICAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xuICAgICAgcmV0dXJuIG5ldyBDdG9yKCF4LnMgfHwgIXkucyB8fCAoeGQgPyB5ZCAmJiB4ZFswXSA9PSB5ZFswXSA6ICF5ZCkgPyBOYU4gOiB4ZCAmJiB4ZFswXSA9PSAwIHx8ICF5ZCA/IHNpZ24yICogMCA6IHNpZ24yIC8gMCk7XG4gICAgfVxuICAgIGlmIChiYXNlKSB7XG4gICAgICBsb2dCYXNlID0gMTtcbiAgICAgIGUgPSB4LmUgLSB5LmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhc2UgPSBCQVNFO1xuICAgICAgbG9nQmFzZSA9IExPR19CQVNFO1xuICAgICAgZSA9IG1hdGhmbG9vcih4LmUgLyBsb2dCYXNlKSAtIG1hdGhmbG9vcih5LmUgLyBsb2dCYXNlKTtcbiAgICB9XG4gICAgeUwgPSB5ZC5sZW5ndGg7XG4gICAgeEwgPSB4ZC5sZW5ndGg7XG4gICAgcSA9IG5ldyBDdG9yKHNpZ24yKTtcbiAgICBxZCA9IHEuZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IHlkW2ldID09ICh4ZFtpXSB8fCAwKTsgaSsrKVxuICAgICAgO1xuICAgIGlmICh5ZFtpXSA+ICh4ZFtpXSB8fCAwKSlcbiAgICAgIGUtLTtcbiAgICBpZiAocHIgPT0gbnVsbCkge1xuICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICAgIH0gZWxzZSBpZiAoZHApIHtcbiAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNkID0gcHI7XG4gICAgfVxuICAgIGlmIChzZCA8IDApIHtcbiAgICAgIHFkLnB1c2goMSk7XG4gICAgICBtb3JlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcbiAgICAgIGkgPSAwO1xuICAgICAgaWYgKHlMID09IDEpIHtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIHlkID0geWRbMF07XG4gICAgICAgIHNkKys7XG4gICAgICAgIGZvciAoOyAoaSA8IHhMIHx8IGspICYmIHNkLS07IGkrKykge1xuICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcbiAgICAgICAgICBxZFtpXSA9IHQgLyB5ZCB8IDA7XG4gICAgICAgICAgayA9IHQgJSB5ZCB8IDA7XG4gICAgICAgIH1cbiAgICAgICAgbW9yZSA9IGsgfHwgaSA8IHhMO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgayA9IGJhc2UgLyAoeWRbMF0gKyAxKSB8IDA7XG4gICAgICAgIGlmIChrID4gMSkge1xuICAgICAgICAgIHlkID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcbiAgICAgICAgICB4ZCA9IG11bHRpcGx5SW50ZWdlcih4ZCwgaywgYmFzZSk7XG4gICAgICAgICAgeUwgPSB5ZC5sZW5ndGg7XG4gICAgICAgICAgeEwgPSB4ZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgeGkgPSB5TDtcbiAgICAgICAgcmVtID0geGQuc2xpY2UoMCwgeUwpO1xuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcbiAgICAgICAgZm9yICg7IHJlbUwgPCB5TDsgKVxuICAgICAgICAgIHJlbVtyZW1MKytdID0gMDtcbiAgICAgICAgeXogPSB5ZC5zbGljZSgpO1xuICAgICAgICB5ei51bnNoaWZ0KDApO1xuICAgICAgICB5ZDAgPSB5ZFswXTtcbiAgICAgICAgaWYgKHlkWzFdID49IGJhc2UgLyAyKVxuICAgICAgICAgICsreWQwO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgayA9IDA7XG4gICAgICAgICAgY21wID0gY29tcGFyZSh5ZCwgcmVtLCB5TCwgcmVtTCk7XG4gICAgICAgICAgaWYgKGNtcCA8IDApIHtcbiAgICAgICAgICAgIHJlbTAgPSByZW1bMF07XG4gICAgICAgICAgICBpZiAoeUwgIT0gcmVtTClcbiAgICAgICAgICAgICAgcmVtMCA9IHJlbTAgKiBiYXNlICsgKHJlbVsxXSB8fCAwKTtcbiAgICAgICAgICAgIGsgPSByZW0wIC8geWQwIHwgMDtcbiAgICAgICAgICAgIGlmIChrID4gMSkge1xuICAgICAgICAgICAgICBpZiAoayA+PSBiYXNlKVxuICAgICAgICAgICAgICAgIGsgPSBiYXNlIC0gMTtcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XG4gICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xuICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHByb2QsIHJlbSwgcHJvZEwsIHJlbUwpO1xuICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcbiAgICAgICAgICAgICAgICBrLS07XG4gICAgICAgICAgICAgICAgc3VidHJhY3QocHJvZCwgeUwgPCBwcm9kTCA/IHl6IDogeWQsIHByb2RMLCBiYXNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGsgPT0gMClcbiAgICAgICAgICAgICAgICBjbXAgPSBrID0gMTtcbiAgICAgICAgICAgICAgcHJvZCA9IHlkLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTClcbiAgICAgICAgICAgICAgcHJvZC51bnNoaWZ0KDApO1xuICAgICAgICAgICAgc3VidHJhY3QocmVtLCBwcm9kLCByZW1MLCBiYXNlKTtcbiAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcbiAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XG4gICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xuICAgICAgICAgICAgICBpZiAoY21wIDwgMSkge1xuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWQsIHJlbUwsIGJhc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgcmVtID0gWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxZFtpKytdID0gaztcbiAgICAgICAgICBpZiAoY21wICYmIHJlbVswXSkge1xuICAgICAgICAgICAgcmVtW3JlbUwrK10gPSB4ZFt4aV0gfHwgMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVtID0gW3hkW3hpXV07XG4gICAgICAgICAgICByZW1MID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9PSB2b2lkIDApICYmIHNkLS0pO1xuICAgICAgICBtb3JlID0gcmVtWzBdICE9PSB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAoIXFkWzBdKVxuICAgICAgICBxZC5zaGlmdCgpO1xuICAgIH1cbiAgICBpZiAobG9nQmFzZSA9PSAxKSB7XG4gICAgICBxLmUgPSBlO1xuICAgICAgaW5leGFjdCA9IG1vcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDEsIGsgPSBxZFswXTsgayA+PSAxMDsgayAvPSAxMClcbiAgICAgICAgaSsrO1xuICAgICAgcS5lID0gaSArIGUgKiBsb2dCYXNlIC0gMTtcbiAgICAgIGZpbmFsaXNlKHEsIGRwID8gcHIgKyBxLmUgKyAxIDogcHIsIHJtLCBtb3JlKTtcbiAgICB9XG4gICAgcmV0dXJuIHE7XG4gIH07XG59KCk7XG5mdW5jdGlvbiBmaW5hbGlzZSh4LCBzZCwgcm0sIGlzVHJ1bmNhdGVkKSB7XG4gIHZhciBkaWdpdHMsIGksIGosIGssIHJkLCByb3VuZFVwLCB3LCB4ZCwgeGRpLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgb3V0OlxuICAgIGlmIChzZCAhPSBudWxsKSB7XG4gICAgICB4ZCA9IHguZDtcbiAgICAgIGlmICgheGQpXG4gICAgICAgIHJldHVybiB4O1xuICAgICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApXG4gICAgICAgIGRpZ2l0cysrO1xuICAgICAgaSA9IHNkIC0gZGlnaXRzO1xuICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgIGkgKz0gTE9HX0JBU0U7XG4gICAgICAgIGogPSBzZDtcbiAgICAgICAgdyA9IHhkW3hkaSA9IDBdO1xuICAgICAgICByZCA9IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcbiAgICAgICAgayA9IHhkLmxlbmd0aDtcbiAgICAgICAgaWYgKHhkaSA+PSBrKSB7XG4gICAgICAgICAgaWYgKGlzVHJ1bmNhdGVkKSB7XG4gICAgICAgICAgICBmb3IgKDsgaysrIDw9IHhkaTsgKVxuICAgICAgICAgICAgICB4ZC5wdXNoKDApO1xuICAgICAgICAgICAgdyA9IHJkID0gMDtcbiAgICAgICAgICAgIGRpZ2l0cyA9IDE7XG4gICAgICAgICAgICBpICU9IExPR19CQVNFO1xuICAgICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJyZWFrIG91dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdyA9IGsgPSB4ZFt4ZGldO1xuICAgICAgICAgIGZvciAoZGlnaXRzID0gMTsgayA+PSAxMDsgayAvPSAxMClcbiAgICAgICAgICAgIGRpZ2l0cysrO1xuICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XG4gICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIGRpZ2l0cztcbiAgICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlzVHJ1bmNhdGVkID0gaXNUcnVuY2F0ZWQgfHwgc2QgPCAwIHx8IHhkW3hkaSArIDFdICE9PSB2b2lkIDAgfHwgKGogPCAwID8gdyA6IHcgJSBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkpO1xuICAgICAgcm91bmRVcCA9IHJtIDwgNCA/IChyZCB8fCBpc1RydW5jYXRlZCkgJiYgKHJtID09IDAgfHwgcm0gPT0gKHgucyA8IDAgPyAzIDogMikpIDogcmQgPiA1IHx8IHJkID09IDUgJiYgKHJtID09IDQgfHwgaXNUcnVuY2F0ZWQgfHwgcm0gPT0gNiAmJiAoaSA+IDAgPyBqID4gMCA/IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSA6IDAgOiB4ZFt4ZGkgLSAxXSkgJSAxMCAmIDEgfHwgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xuICAgICAgaWYgKHNkIDwgMSB8fCAheGRbMF0pIHtcbiAgICAgICAgeGQubGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKHJvdW5kVXApIHtcbiAgICAgICAgICBzZCAtPSB4LmUgKyAxO1xuICAgICAgICAgIHhkWzBdID0gbWF0aHBvdygxMCwgKExPR19CQVNFIC0gc2QgJSBMT0dfQkFTRSkgJSBMT0dfQkFTRSk7XG4gICAgICAgICAgeC5lID0gLXNkIHx8IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeGRbMF0gPSB4LmUgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICB4ZC5sZW5ndGggPSB4ZGk7XG4gICAgICAgIGsgPSAxO1xuICAgICAgICB4ZGktLTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhkLmxlbmd0aCA9IHhkaSArIDE7XG4gICAgICAgIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xuICAgICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xuICAgICAgfVxuICAgICAgaWYgKHJvdW5kVXApIHtcbiAgICAgICAgZm9yICg7IDsgKSB7XG4gICAgICAgICAgaWYgKHhkaSA9PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGRbMF07IGogPj0gMTA7IGogLz0gMTApXG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGogPSB4ZFswXSArPSBrO1xuICAgICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMClcbiAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgaWYgKGkgIT0gaykge1xuICAgICAgICAgICAgICB4LmUrKztcbiAgICAgICAgICAgICAgaWYgKHhkWzBdID09IEJBU0UpXG4gICAgICAgICAgICAgICAgeGRbMF0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHhkW3hkaV0gKz0gaztcbiAgICAgICAgICAgIGlmICh4ZFt4ZGldICE9IEJBU0UpXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgeGRbeGRpLS1dID0gMDtcbiAgICAgICAgICAgIGsgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpID0geGQubGVuZ3RoOyB4ZFstLWldID09PSAwOyApXG4gICAgICAgIHhkLnBvcCgpO1xuICAgIH1cbiAgaWYgKGV4dGVybmFsKSB7XG4gICAgaWYgKHguZSA+IEN0b3IubWF4RSkge1xuICAgICAgeC5kID0gbnVsbDtcbiAgICAgIHguZSA9IE5hTjtcbiAgICB9IGVsc2UgaWYgKHguZSA8IEN0b3IubWluRSkge1xuICAgICAgeC5lID0gMDtcbiAgICAgIHguZCA9IFswXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBmaW5pdGVUb1N0cmluZyh4LCBpc0V4cCwgc2QpIHtcbiAgaWYgKCF4LmlzRmluaXRlKCkpXG4gICAgcmV0dXJuIG5vbkZpbml0ZVRvU3RyaW5nKHgpO1xuICB2YXIgaywgZSA9IHguZSwgc3RyID0gZGlnaXRzVG9TdHJpbmcoeC5kKSwgbGVuID0gc3RyLmxlbmd0aDtcbiAgaWYgKGlzRXhwKSB7XG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xuICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArIFwiLlwiICsgc3RyLnNsaWNlKDEpICsgZ2V0WmVyb1N0cmluZyhrKTtcbiAgICB9IGVsc2UgaWYgKGxlbiA+IDEpIHtcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyBcIi5cIiArIHN0ci5zbGljZSgxKTtcbiAgICB9XG4gICAgc3RyID0gc3RyICsgKHguZSA8IDAgPyBcImVcIiA6IFwiZStcIikgKyB4LmU7XG4gIH0gZWxzZSBpZiAoZSA8IDApIHtcbiAgICBzdHIgPSBcIjAuXCIgKyBnZXRaZXJvU3RyaW5nKC1lIC0gMSkgKyBzdHI7XG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMClcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xuICB9IGVsc2UgaWYgKGUgPj0gbGVuKSB7XG4gICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gZSAtIDEpID4gMClcbiAgICAgIHN0ciA9IHN0ciArIFwiLlwiICsgZ2V0WmVyb1N0cmluZyhrKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pXG4gICAgICBzdHIgPSBzdHIuc2xpY2UoMCwgaykgKyBcIi5cIiArIHN0ci5zbGljZShrKTtcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XG4gICAgICBpZiAoZSArIDEgPT09IGxlbilcbiAgICAgICAgc3RyICs9IFwiLlwiO1xuICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59XG5mdW5jdGlvbiBnZXRCYXNlMTBFeHBvbmVudChkaWdpdHMsIGUpIHtcbiAgdmFyIHcgPSBkaWdpdHNbMF07XG4gIGZvciAoZSAqPSBMT0dfQkFTRTsgdyA+PSAxMDsgdyAvPSAxMClcbiAgICBlKys7XG4gIHJldHVybiBlO1xufVxuZnVuY3Rpb24gZ2V0TG4xMChDdG9yLCBzZCwgcHIpIHtcbiAgaWYgKHNkID4gTE4xMF9QUkVDSVNJT04pIHtcbiAgICBleHRlcm5hbCA9IHRydWU7XG4gICAgaWYgKHByKVxuICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgICB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcbiAgfVxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoTE4xMCksIHNkLCAxLCB0cnVlKTtcbn1cbmZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xuICBpZiAoc2QgPiBQSV9QUkVDSVNJT04pXG4gICAgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihQSSksIHNkLCBybSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBnZXRQcmVjaXNpb24oZGlnaXRzKSB7XG4gIHZhciB3ID0gZGlnaXRzLmxlbmd0aCAtIDEsIGxlbiA9IHcgKiBMT0dfQkFTRSArIDE7XG4gIHcgPSBkaWdpdHNbd107XG4gIGlmICh3KSB7XG4gICAgZm9yICg7IHcgJSAxMCA9PSAwOyB3IC89IDEwKVxuICAgICAgbGVuLS07XG4gICAgZm9yICh3ID0gZGlnaXRzWzBdOyB3ID49IDEwOyB3IC89IDEwKVxuICAgICAgbGVuKys7XG4gIH1cbiAgcmV0dXJuIGxlbjtcbn1cbmZ1bmN0aW9uIGdldFplcm9TdHJpbmcoaykge1xuICB2YXIgenMgPSBcIlwiO1xuICBmb3IgKDsgay0tOyApXG4gICAgenMgKz0gXCIwXCI7XG4gIHJldHVybiB6cztcbn1cbmZ1bmN0aW9uIGludFBvdyhDdG9yLCB4LCBuLCBwcikge1xuICB2YXIgaXNUcnVuY2F0ZWQsIHIgPSBuZXcgQ3RvcigxKSwgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFICsgNCk7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIGZvciAoOyA7ICkge1xuICAgIGlmIChuICUgMikge1xuICAgICAgciA9IHIudGltZXMoeCk7XG4gICAgICBpZiAodHJ1bmNhdGUoci5kLCBrKSlcbiAgICAgICAgaXNUcnVuY2F0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBuID0gbWF0aGZsb29yKG4gLyAyKTtcbiAgICBpZiAobiA9PT0gMCkge1xuICAgICAgbiA9IHIuZC5sZW5ndGggLSAxO1xuICAgICAgaWYgKGlzVHJ1bmNhdGVkICYmIHIuZFtuXSA9PT0gMClcbiAgICAgICAgKytyLmRbbl07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgeCA9IHgudGltZXMoeCk7XG4gICAgdHJ1bmNhdGUoeC5kLCBrKTtcbiAgfVxuICBleHRlcm5hbCA9IHRydWU7XG4gIHJldHVybiByO1xufVxuZnVuY3Rpb24gaXNPZGQobikge1xuICByZXR1cm4gbi5kW24uZC5sZW5ndGggLSAxXSAmIDE7XG59XG5mdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XG4gIHZhciB5LCB4ID0gbmV3IEN0b3IoYXJnc1swXSksIGkgPSAwO1xuICBmb3IgKDsgKytpIDwgYXJncy5sZW5ndGg7ICkge1xuICAgIHkgPSBuZXcgQ3RvcihhcmdzW2ldKTtcbiAgICBpZiAoIXkucykge1xuICAgICAgeCA9IHk7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHhbbHRndF0oeSkpIHtcbiAgICAgIHggPSB5O1xuICAgIH1cbiAgfVxuICByZXR1cm4geDtcbn1cbmZ1bmN0aW9uIG5hdHVyYWxFeHBvbmVudGlhbCh4LCBzZCkge1xuICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3cyLCBzdW0sIHQsIHdwciwgcmVwID0gMCwgaSA9IDAsIGsgPSAwLCBDdG9yID0geC5jb25zdHJ1Y3Rvciwgcm0gPSBDdG9yLnJvdW5kaW5nLCBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBpZiAoIXguZCB8fCAheC5kWzBdIHx8IHguZSA+IDE3KSB7XG4gICAgcmV0dXJuIG5ldyBDdG9yKHguZCA/ICF4LmRbMF0gPyAxIDogeC5zIDwgMCA/IDAgOiAxIC8gMCA6IHgucyA/IHgucyA8IDAgPyAwIDogeCA6IDAgLyAwKTtcbiAgfVxuICBpZiAoc2QgPT0gbnVsbCkge1xuICAgIGV4dGVybmFsID0gZmFsc2U7XG4gICAgd3ByID0gcHI7XG4gIH0gZWxzZSB7XG4gICAgd3ByID0gc2Q7XG4gIH1cbiAgdCA9IG5ldyBDdG9yKDAuMDMxMjUpO1xuICB3aGlsZSAoeC5lID4gLTIpIHtcbiAgICB4ID0geC50aW1lcyh0KTtcbiAgICBrICs9IDU7XG4gIH1cbiAgZ3VhcmQgPSBNYXRoLmxvZyhtYXRocG93KDIsIGspKSAvIE1hdGguTE4xMCAqIDIgKyA1IHwgMDtcbiAgd3ByICs9IGd1YXJkO1xuICBkZW5vbWluYXRvciA9IHBvdzIgPSBzdW0gPSBuZXcgQ3RvcigxKTtcbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHI7XG4gIGZvciAoOyA7ICkge1xuICAgIHBvdzIgPSBmaW5hbGlzZShwb3cyLnRpbWVzKHgpLCB3cHIsIDEpO1xuICAgIGRlbm9taW5hdG9yID0gZGVub21pbmF0b3IudGltZXMoKytpKTtcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKHBvdzIsIGRlbm9taW5hdG9yLCB3cHIsIDEpKTtcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xuICAgICAgaiA9IGs7XG4gICAgICB3aGlsZSAoai0tKVxuICAgICAgICBzdW0gPSBmaW5hbGlzZShzdW0udGltZXMoc3VtKSwgd3ByLCAxKTtcbiAgICAgIGlmIChzZCA9PSBudWxsKSB7XG4gICAgICAgIGlmIChyZXAgPCAzICYmIGNoZWNrUm91bmRpbmdEaWdpdHMoc3VtLmQsIHdwciAtIGd1YXJkLCBybSwgcmVwKSkge1xuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IDEwO1xuICAgICAgICAgIGRlbm9taW5hdG9yID0gcG93MiA9IHQgPSBuZXcgQ3RvcigxKTtcbiAgICAgICAgICBpID0gMDtcbiAgICAgICAgICByZXArKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VtID0gdDtcbiAgfVxufVxuZnVuY3Rpb24gbmF0dXJhbExvZ2FyaXRobSh5LCBzZCkge1xuICB2YXIgYywgYzAsIGRlbm9taW5hdG9yLCBlLCBudW1lcmF0b3IsIHJlcCwgc3VtLCB0LCB3cHIsIHgxLCB4MiwgbiA9IDEsIGd1YXJkID0gMTAsIHggPSB5LCB4ZCA9IHguZCwgQ3RvciA9IHguY29uc3RydWN0b3IsIHJtID0gQ3Rvci5yb3VuZGluZywgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgaWYgKHgucyA8IDAgfHwgIXhkIHx8ICF4ZFswXSB8fCAheC5lICYmIHhkWzBdID09IDEgJiYgeGQubGVuZ3RoID09IDEpIHtcbiAgICByZXR1cm4gbmV3IEN0b3IoeGQgJiYgIXhkWzBdID8gLTEgLyAwIDogeC5zICE9IDEgPyBOYU4gOiB4ZCA/IDAgOiB4KTtcbiAgfVxuICBpZiAoc2QgPT0gbnVsbCkge1xuICAgIGV4dGVybmFsID0gZmFsc2U7XG4gICAgd3ByID0gcHI7XG4gIH0gZWxzZSB7XG4gICAgd3ByID0gc2Q7XG4gIH1cbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XG4gIGMgPSBkaWdpdHNUb1N0cmluZyh4ZCk7XG4gIGMwID0gYy5jaGFyQXQoMCk7XG4gIGlmIChNYXRoLmFicyhlID0geC5lKSA8IDE1ZTE0KSB7XG4gICAgd2hpbGUgKGMwIDwgNyAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAzKSB7XG4gICAgICB4ID0geC50aW1lcyh5KTtcbiAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xuICAgICAgYzAgPSBjLmNoYXJBdCgwKTtcbiAgICAgIG4rKztcbiAgICB9XG4gICAgZSA9IHguZTtcbiAgICBpZiAoYzAgPiAxKSB7XG4gICAgICB4ID0gbmV3IEN0b3IoXCIwLlwiICsgYyk7XG4gICAgICBlKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSBuZXcgQ3RvcihjMCArIFwiLlwiICsgYy5zbGljZSgxKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHQgPSBnZXRMbjEwKEN0b3IsIHdwciArIDIsIHByKS50aW1lcyhlICsgXCJcIik7XG4gICAgeCA9IG5hdHVyYWxMb2dhcml0aG0obmV3IEN0b3IoYzAgKyBcIi5cIiArIGMuc2xpY2UoMSkpLCB3cHIgLSBndWFyZCkucGx1cyh0KTtcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICAgIHJldHVybiBzZCA9PSBudWxsID8gZmluYWxpc2UoeCwgcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpIDogeDtcbiAgfVxuICB4MSA9IHg7XG4gIHN1bSA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeC5taW51cygxKSwgeC5wbHVzKDEpLCB3cHIsIDEpO1xuICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XG4gIGRlbm9taW5hdG9yID0gMztcbiAgZm9yICg7IDsgKSB7XG4gICAgbnVtZXJhdG9yID0gZmluYWxpc2UobnVtZXJhdG9yLnRpbWVzKHgyKSwgd3ByLCAxKTtcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xuICAgICAgc3VtID0gc3VtLnRpbWVzKDIpO1xuICAgICAgaWYgKGUgIT09IDApXG4gICAgICAgIHN1bSA9IHN1bS5wbHVzKGdldExuMTAoQ3Rvciwgd3ByICsgMiwgcHIpLnRpbWVzKGUgKyBcIlwiKSk7XG4gICAgICBzdW0gPSBkaXZpZGUoc3VtLCBuZXcgQ3RvcihuKSwgd3ByLCAxKTtcbiAgICAgIGlmIChzZCA9PSBudWxsKSB7XG4gICAgICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHN1bS5kLCB3cHIgLSBndWFyZCwgcm0sIHJlcCkpIHtcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcbiAgICAgICAgICB0ID0gbnVtZXJhdG9yID0geCA9IGRpdmlkZSh4MS5taW51cygxKSwgeDEucGx1cygxKSwgd3ByLCAxKTtcbiAgICAgICAgICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XG4gICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmaW5hbGlzZShzdW0sIEN0b3IucHJlY2lzaW9uID0gcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICAgICAgICByZXR1cm4gc3VtO1xuICAgICAgfVxuICAgIH1cbiAgICBzdW0gPSB0O1xuICAgIGRlbm9taW5hdG9yICs9IDI7XG4gIH1cbn1cbmZ1bmN0aW9uIG5vbkZpbml0ZVRvU3RyaW5nKHgpIHtcbiAgcmV0dXJuIFN0cmluZyh4LnMgKiB4LnMgLyAwKTtcbn1cbmZ1bmN0aW9uIHBhcnNlRGVjaW1hbCh4LCBzdHIpIHtcbiAgdmFyIGUsIGksIGxlbjtcbiAgaWYgKChlID0gc3RyLmluZGV4T2YoXCIuXCIpKSA+IC0xKVxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiLlwiLCBcIlwiKTtcbiAgaWYgKChpID0gc3RyLnNlYXJjaCgvZS9pKSkgPiAwKSB7XG4gICAgaWYgKGUgPCAwKVxuICAgICAgZSA9IGk7XG4gICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcbiAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIGkpO1xuICB9IGVsc2UgaWYgKGUgPCAwKSB7XG4gICAgZSA9IHN0ci5sZW5ndGg7XG4gIH1cbiAgZm9yIChpID0gMDsgc3RyLmNoYXJDb2RlQXQoaSkgPT09IDQ4OyBpKyspXG4gICAgO1xuICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IHN0ci5jaGFyQ29kZUF0KGxlbiAtIDEpID09PSA0ODsgLS1sZW4pXG4gICAgO1xuICBzdHIgPSBzdHIuc2xpY2UoaSwgbGVuKTtcbiAgaWYgKHN0cikge1xuICAgIGxlbiAtPSBpO1xuICAgIHguZSA9IGUgPSBlIC0gaSAtIDE7XG4gICAgeC5kID0gW107XG4gICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcbiAgICBpZiAoZSA8IDApXG4gICAgICBpICs9IExPR19CQVNFO1xuICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICBpZiAoaSlcbiAgICAgICAgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XG4gICAgICBmb3IgKGxlbiAtPSBMT0dfQkFTRTsgaSA8IGxlbjsgKVxuICAgICAgICB4LmQucHVzaCgrc3RyLnNsaWNlKGksIGkgKz0gTE9HX0JBU0UpKTtcbiAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcbiAgICAgIGkgPSBMT0dfQkFTRSAtIHN0ci5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkgLT0gbGVuO1xuICAgIH1cbiAgICBmb3IgKDsgaS0tOyApXG4gICAgICBzdHIgKz0gXCIwXCI7XG4gICAgeC5kLnB1c2goK3N0cik7XG4gICAgaWYgKGV4dGVybmFsKSB7XG4gICAgICBpZiAoeC5lID4geC5jb25zdHJ1Y3Rvci5tYXhFKSB7XG4gICAgICAgIHguZCA9IG51bGw7XG4gICAgICAgIHguZSA9IE5hTjtcbiAgICAgIH0gZWxzZSBpZiAoeC5lIDwgeC5jb25zdHJ1Y3Rvci5taW5FKSB7XG4gICAgICAgIHguZSA9IDA7XG4gICAgICAgIHguZCA9IFswXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgeC5lID0gMDtcbiAgICB4LmQgPSBbMF07XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBwYXJzZU90aGVyKHgsIHN0cikge1xuICB2YXIgYmFzZSwgQ3RvciwgZGl2aXNvciwgaSwgaXNGbG9hdCwgbGVuLCBwLCB4ZCwgeGU7XG4gIGlmIChzdHIgPT09IFwiSW5maW5pdHlcIiB8fCBzdHIgPT09IFwiTmFOXCIpIHtcbiAgICBpZiAoIStzdHIpXG4gICAgICB4LnMgPSBOYU47XG4gICAgeC5lID0gTmFOO1xuICAgIHguZCA9IG51bGw7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgaWYgKGlzSGV4LnRlc3Qoc3RyKSkge1xuICAgIGJhc2UgPSAxNjtcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmIChpc0JpbmFyeS50ZXN0KHN0cikpIHtcbiAgICBiYXNlID0gMjtcbiAgfSBlbHNlIGlmIChpc09jdGFsLnRlc3Qoc3RyKSkge1xuICAgIGJhc2UgPSA4O1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHN0cik7XG4gIH1cbiAgaSA9IHN0ci5zZWFyY2goL3AvaSk7XG4gIGlmIChpID4gMCkge1xuICAgIHAgPSArc3RyLnNsaWNlKGkgKyAxKTtcbiAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDIsIGkpO1xuICB9IGVsc2Uge1xuICAgIHN0ciA9IHN0ci5zbGljZSgyKTtcbiAgfVxuICBpID0gc3RyLmluZGV4T2YoXCIuXCIpO1xuICBpc0Zsb2F0ID0gaSA+PSAwO1xuICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGlzRmxvYXQpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShcIi5cIiwgXCJcIik7XG4gICAgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpID0gbGVuIC0gaTtcbiAgICBkaXZpc29yID0gaW50UG93KEN0b3IsIG5ldyBDdG9yKGJhc2UpLCBpLCBpICogMik7XG4gIH1cbiAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIGJhc2UsIEJBU0UpO1xuICB4ZSA9IHhkLmxlbmd0aCAtIDE7XG4gIGZvciAoaSA9IHhlOyB4ZFtpXSA9PT0gMDsgLS1pKVxuICAgIHhkLnBvcCgpO1xuICBpZiAoaSA8IDApXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgucyAqIDApO1xuICB4LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgeGUpO1xuICB4LmQgPSB4ZDtcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgaWYgKGlzRmxvYXQpXG4gICAgeCA9IGRpdmlkZSh4LCBkaXZpc29yLCBsZW4gKiA0KTtcbiAgaWYgKHApXG4gICAgeCA9IHgudGltZXMoTWF0aC5hYnMocCkgPCA1NCA/IG1hdGhwb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBzaW5lKEN0b3IsIHgpIHtcbiAgdmFyIGssIGxlbiA9IHguZC5sZW5ndGg7XG4gIGlmIChsZW4gPCAzKVxuICAgIHJldHVybiB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XG4gIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcbiAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XG4gIHggPSB4LnRpbWVzKDEgLyB0aW55UG93KDUsIGspKTtcbiAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4KTtcbiAgdmFyIHNpbjJfeCwgZDUgPSBuZXcgQ3Rvcig1KSwgZDE2ID0gbmV3IEN0b3IoMTYpLCBkMjAgPSBuZXcgQ3RvcigyMCk7XG4gIGZvciAoOyBrLS07ICkge1xuICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XG4gICAgeCA9IHgudGltZXMoZDUucGx1cyhzaW4yX3gudGltZXMoZDE2LnRpbWVzKHNpbjJfeCkubWludXMoZDIwKSkpKTtcbiAgfVxuICByZXR1cm4geDtcbn1cbmZ1bmN0aW9uIHRheWxvclNlcmllcyhDdG9yLCBuLCB4LCB5LCBpc0h5cGVyYm9saWMpIHtcbiAgdmFyIGosIHQsIHUsIHgyLCBpID0gMSwgcHIgPSBDdG9yLnByZWNpc2lvbiwgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgeDIgPSB4LnRpbWVzKHgpO1xuICB1ID0gbmV3IEN0b3IoeSk7XG4gIGZvciAoOyA7ICkge1xuICAgIHQgPSBkaXZpZGUodS50aW1lcyh4MiksIG5ldyBDdG9yKG4rKyAqIG4rKyksIHByLCAxKTtcbiAgICB1ID0gaXNIeXBlcmJvbGljID8geS5wbHVzKHQpIDogeS5taW51cyh0KTtcbiAgICB5ID0gZGl2aWRlKHQudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XG4gICAgdCA9IHUucGx1cyh5KTtcbiAgICBpZiAodC5kW2tdICE9PSB2b2lkIDApIHtcbiAgICAgIGZvciAoaiA9IGs7IHQuZFtqXSA9PT0gdS5kW2pdICYmIGotLTsgKVxuICAgICAgICA7XG4gICAgICBpZiAoaiA9PSAtMSlcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGogPSB1O1xuICAgIHUgPSB5O1xuICAgIHkgPSB0O1xuICAgIHQgPSBqO1xuICAgIGkrKztcbiAgfVxuICBleHRlcm5hbCA9IHRydWU7XG4gIHQuZC5sZW5ndGggPSBrICsgMTtcbiAgcmV0dXJuIHQ7XG59XG5mdW5jdGlvbiB0aW55UG93KGIsIGUpIHtcbiAgdmFyIG4gPSBiO1xuICB3aGlsZSAoLS1lKVxuICAgIG4gKj0gYjtcbiAgcmV0dXJuIG47XG59XG5mdW5jdGlvbiB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpIHtcbiAgdmFyIHQsIGlzTmVnID0geC5zIDwgMCwgcGkgPSBnZXRQaShDdG9yLCBDdG9yLnByZWNpc2lvbiwgMSksIGhhbGZQaSA9IHBpLnRpbWVzKDAuNSk7XG4gIHggPSB4LmFicygpO1xuICBpZiAoeC5sdGUoaGFsZlBpKSkge1xuICAgIHF1YWRyYW50ID0gaXNOZWcgPyA0IDogMTtcbiAgICByZXR1cm4geDtcbiAgfVxuICB0ID0geC5kaXZUb0ludChwaSk7XG4gIGlmICh0LmlzWmVybygpKSB7XG4gICAgcXVhZHJhbnQgPSBpc05lZyA/IDMgOiAyO1xuICB9IGVsc2Uge1xuICAgIHggPSB4Lm1pbnVzKHQudGltZXMocGkpKTtcbiAgICBpZiAoeC5sdGUoaGFsZlBpKSkge1xuICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IGlzTmVnID8gMiA6IDMgOiBpc05lZyA/IDQgOiAxO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyBpc05lZyA/IDEgOiA0IDogaXNOZWcgPyAzIDogMjtcbiAgfVxuICByZXR1cm4geC5taW51cyhwaSkuYWJzKCk7XG59XG5mdW5jdGlvbiB0b1N0cmluZ0JpbmFyeSh4LCBiYXNlT3V0LCBzZCwgcm0pIHtcbiAgdmFyIGJhc2UsIGUsIGksIGssIGxlbiwgcm91bmRVcCwgc3RyLCB4ZCwgeSwgQ3RvciA9IHguY29uc3RydWN0b3IsIGlzRXhwID0gc2QgIT09IHZvaWQgMDtcbiAgaWYgKGlzRXhwKSB7XG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XG4gICAgaWYgKHJtID09PSB2b2lkIDApXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gICAgZWxzZVxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XG4gIH0gZWxzZSB7XG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIH1cbiAgaWYgKCF4LmlzRmluaXRlKCkpIHtcbiAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcbiAgfSBlbHNlIHtcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcbiAgICBpID0gc3RyLmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpc0V4cCkge1xuICAgICAgYmFzZSA9IDI7XG4gICAgICBpZiAoYmFzZU91dCA9PSAxNikge1xuICAgICAgICBzZCA9IHNkICogNCAtIDM7XG4gICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xuICAgICAgICBzZCA9IHNkICogMyAtIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhc2UgPSBiYXNlT3V0O1xuICAgIH1cbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShcIi5cIiwgXCJcIik7XG4gICAgICB5ID0gbmV3IEN0b3IoMSk7XG4gICAgICB5LmUgPSBzdHIubGVuZ3RoIC0gaTtcbiAgICAgIHkuZCA9IGNvbnZlcnRCYXNlKGZpbml0ZVRvU3RyaW5nKHkpLCAxMCwgYmFzZSk7XG4gICAgICB5LmUgPSB5LmQubGVuZ3RoO1xuICAgIH1cbiAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgMTAsIGJhc2UpO1xuICAgIGUgPSBsZW4gPSB4ZC5sZW5ndGg7XG4gICAgZm9yICg7IHhkWy0tbGVuXSA9PSAwOyApXG4gICAgICB4ZC5wb3AoKTtcbiAgICBpZiAoIXhkWzBdKSB7XG4gICAgICBzdHIgPSBpc0V4cCA/IFwiMHArMFwiIDogXCIwXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICBlLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ID0gbmV3IEN0b3IoeCk7XG4gICAgICAgIHguZCA9IHhkO1xuICAgICAgICB4LmUgPSBlO1xuICAgICAgICB4ID0gZGl2aWRlKHgsIHksIHNkLCBybSwgMCwgYmFzZSk7XG4gICAgICAgIHhkID0geC5kO1xuICAgICAgICBlID0geC5lO1xuICAgICAgICByb3VuZFVwID0gaW5leGFjdDtcbiAgICAgIH1cbiAgICAgIGkgPSB4ZFtzZF07XG4gICAgICBrID0gYmFzZSAvIDI7XG4gICAgICByb3VuZFVwID0gcm91bmRVcCB8fCB4ZFtzZCArIDFdICE9PSB2b2lkIDA7XG4gICAgICByb3VuZFVwID0gcm0gPCA0ID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKSA6IGkgPiBrIHx8IGkgPT09IGsgJiYgKHJtID09PSA0IHx8IHJvdW5kVXAgfHwgcm0gPT09IDYgJiYgeGRbc2QgLSAxXSAmIDEgfHwgcm0gPT09ICh4LnMgPCAwID8gOCA6IDcpKTtcbiAgICAgIHhkLmxlbmd0aCA9IHNkO1xuICAgICAgaWYgKHJvdW5kVXApIHtcbiAgICAgICAgZm9yICg7ICsreGRbLS1zZF0gPiBiYXNlIC0gMTsgKSB7XG4gICAgICAgICAgeGRbc2RdID0gMDtcbiAgICAgICAgICBpZiAoIXNkKSB7XG4gICAgICAgICAgICArK2U7XG4gICAgICAgICAgICB4ZC51bnNoaWZ0KDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pXG4gICAgICAgIDtcbiAgICAgIGZvciAoaSA9IDAsIHN0ciA9IFwiXCI7IGkgPCBsZW47IGkrKylcbiAgICAgICAgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XG4gICAgICBpZiAoaXNFeHApIHtcbiAgICAgICAgaWYgKGxlbiA+IDEpIHtcbiAgICAgICAgICBpZiAoYmFzZU91dCA9PSAxNiB8fCBiYXNlT3V0ID09IDgpIHtcbiAgICAgICAgICAgIGkgPSBiYXNlT3V0ID09IDE2ID8gNCA6IDM7XG4gICAgICAgICAgICBmb3IgKC0tbGVuOyBsZW4gJSBpOyBsZW4rKylcbiAgICAgICAgICAgICAgc3RyICs9IFwiMFwiO1xuICAgICAgICAgICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIGJhc2UsIGJhc2VPdXQpO1xuICAgICAgICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pXG4gICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGZvciAoaSA9IDEsIHN0ciA9IFwiMS5cIjsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArIFwiLlwiICsgc3RyLnNsaWNlKDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdHIgPSBzdHIgKyAoZSA8IDAgPyBcInBcIiA6IFwicCtcIikgKyBlO1xuICAgICAgfSBlbHNlIGlmIChlIDwgMCkge1xuICAgICAgICBmb3IgKDsgKytlOyApXG4gICAgICAgICAgc3RyID0gXCIwXCIgKyBzdHI7XG4gICAgICAgIHN0ciA9IFwiMC5cIiArIHN0cjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgrK2UgPiBsZW4pXG4gICAgICAgICAgZm9yIChlIC09IGxlbjsgZS0tOyApXG4gICAgICAgICAgICBzdHIgKz0gXCIwXCI7XG4gICAgICAgIGVsc2UgaWYgKGUgPCBsZW4pXG4gICAgICAgICAgc3RyID0gc3RyLnNsaWNlKDAsIGUpICsgXCIuXCIgKyBzdHIuc2xpY2UoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0ciA9IChiYXNlT3V0ID09IDE2ID8gXCIweFwiIDogYmFzZU91dCA9PSAyID8gXCIwYlwiIDogYmFzZU91dCA9PSA4ID8gXCIwb1wiIDogXCJcIikgKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHgucyA8IDAgPyBcIi1cIiArIHN0ciA6IHN0cjtcbn1cbmZ1bmN0aW9uIHRydW5jYXRlKGFyciwgbGVuKSB7XG4gIGlmIChhcnIubGVuZ3RoID4gbGVuKSB7XG4gICAgYXJyLmxlbmd0aCA9IGxlbjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuZnVuY3Rpb24gYWJzKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFicygpO1xufVxuZnVuY3Rpb24gYWNvcyh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hY29zKCk7XG59XG5mdW5jdGlvbiBhY29zaCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hY29zaCgpO1xufVxuZnVuY3Rpb24gYWRkKHgsIHkpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnBsdXMoeSk7XG59XG5mdW5jdGlvbiBhc2luKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFzaW4oKTtcbn1cbmZ1bmN0aW9uIGFzaW5oKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFzaW5oKCk7XG59XG5mdW5jdGlvbiBhdGFuKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW4oKTtcbn1cbmZ1bmN0aW9uIGF0YW5oKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW5oKCk7XG59XG5mdW5jdGlvbiBhdGFuMih5LCB4KSB7XG4gIHkgPSBuZXcgdGhpcyh5KTtcbiAgeCA9IG5ldyB0aGlzKHgpO1xuICB2YXIgciwgcHIgPSB0aGlzLnByZWNpc2lvbiwgcm0gPSB0aGlzLnJvdW5kaW5nLCB3cHIgPSBwciArIDQ7XG4gIGlmICgheS5zIHx8ICF4LnMpIHtcbiAgICByID0gbmV3IHRoaXMoTmFOKTtcbiAgfSBlbHNlIGlmICgheS5kICYmICF4LmQpIHtcbiAgICByID0gZ2V0UGkodGhpcywgd3ByLCAxKS50aW1lcyh4LnMgPiAwID8gMC4yNSA6IDAuNzUpO1xuICAgIHIucyA9IHkucztcbiAgfSBlbHNlIGlmICgheC5kIHx8IHkuaXNaZXJvKCkpIHtcbiAgICByID0geC5zIDwgMCA/IGdldFBpKHRoaXMsIHByLCBybSkgOiBuZXcgdGhpcygwKTtcbiAgICByLnMgPSB5LnM7XG4gIH0gZWxzZSBpZiAoIXkuZCB8fCB4LmlzWmVybygpKSB7XG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoMC41KTtcbiAgICByLnMgPSB5LnM7XG4gIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xuICAgIHRoaXMucHJlY2lzaW9uID0gd3ByO1xuICAgIHRoaXMucm91bmRpbmcgPSAxO1xuICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xuICAgIHggPSBnZXRQaSh0aGlzLCB3cHIsIDEpO1xuICAgIHRoaXMucHJlY2lzaW9uID0gcHI7XG4gICAgdGhpcy5yb3VuZGluZyA9IHJtO1xuICAgIHIgPSB5LnMgPCAwID8gci5taW51cyh4KSA6IHIucGx1cyh4KTtcbiAgfSBlbHNlIHtcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcbiAgfVxuICByZXR1cm4gcjtcbn1cbmZ1bmN0aW9uIGNicnQoeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuY2JydCgpO1xufVxuZnVuY3Rpb24gY2VpbCh4KSB7XG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDIpO1xufVxuZnVuY3Rpb24gY29uZmlnKG9iaikge1xuICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiKVxuICAgIHRocm93IEVycm9yKGRlY2ltYWxFcnJvciArIFwiT2JqZWN0IGV4cGVjdGVkXCIpO1xuICB2YXIgaSwgcCwgdiwgdXNlRGVmYXVsdHMgPSBvYmouZGVmYXVsdHMgPT09IHRydWUsIHBzID0gW1xuICAgIFwicHJlY2lzaW9uXCIsXG4gICAgMSxcbiAgICBNQVhfRElHSVRTLFxuICAgIFwicm91bmRpbmdcIixcbiAgICAwLFxuICAgIDgsXG4gICAgXCJ0b0V4cE5lZ1wiLFxuICAgIC1FWFBfTElNSVQsXG4gICAgMCxcbiAgICBcInRvRXhwUG9zXCIsXG4gICAgMCxcbiAgICBFWFBfTElNSVQsXG4gICAgXCJtYXhFXCIsXG4gICAgMCxcbiAgICBFWFBfTElNSVQsXG4gICAgXCJtaW5FXCIsXG4gICAgLUVYUF9MSU1JVCxcbiAgICAwLFxuICAgIFwibW9kdWxvXCIsXG4gICAgMCxcbiAgICA5XG4gIF07XG4gIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGlmIChwID0gcHNbaV0sIHVzZURlZmF1bHRzKVxuICAgICAgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xuICAgIGlmICgodiA9IG9ialtwXSkgIT09IHZvaWQgMCkge1xuICAgICAgaWYgKG1hdGhmbG9vcih2KSA9PT0gdiAmJiB2ID49IHBzW2kgKyAxXSAmJiB2IDw9IHBzW2kgKyAyXSlcbiAgICAgICAgdGhpc1twXSA9IHY7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyBcIjogXCIgKyB2KTtcbiAgICB9XG4gIH1cbiAgaWYgKHAgPSBcImNyeXB0b1wiLCB1c2VEZWZhdWx0cylcbiAgICB0aGlzW3BdID0gREVGQVVMVFNbcF07XG4gIGlmICgodiA9IG9ialtwXSkgIT09IHZvaWQgMCkge1xuICAgIGlmICh2ID09PSB0cnVlIHx8IHYgPT09IGZhbHNlIHx8IHYgPT09IDAgfHwgdiA9PT0gMSkge1xuICAgICAgaWYgKHYpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8gIT0gXCJ1bmRlZmluZWRcIiAmJiBjcnlwdG8gJiYgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgfHwgY3J5cHRvLnJhbmRvbUJ5dGVzKSkge1xuICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1twXSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgXCI6IFwiICsgdik7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gY29zKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvcygpO1xufVxuZnVuY3Rpb24gY29zaCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3NoKCk7XG59XG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgdmFyIGksIHAsIHBzO1xuICBmdW5jdGlvbiBEZWNpbWFsMih2KSB7XG4gICAgdmFyIGUsIGkyLCB0LCB4ID0gdGhpcztcbiAgICBpZiAoISh4IGluc3RhbmNlb2YgRGVjaW1hbDIpKVxuICAgICAgcmV0dXJuIG5ldyBEZWNpbWFsMih2KTtcbiAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDI7XG4gICAgaWYgKHYgaW5zdGFuY2VvZiBEZWNpbWFsMikge1xuICAgICAgeC5zID0gdi5zO1xuICAgICAgaWYgKGV4dGVybmFsKSB7XG4gICAgICAgIGlmICghdi5kIHx8IHYuZSA+IERlY2ltYWwyLm1heEUpIHtcbiAgICAgICAgICB4LmUgPSBOYU47XG4gICAgICAgICAgeC5kID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmICh2LmUgPCBEZWNpbWFsMi5taW5FKSB7XG4gICAgICAgICAgeC5lID0gMDtcbiAgICAgICAgICB4LmQgPSBbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeC5lID0gdi5lO1xuICAgICAgICAgIHguZCA9IHYuZC5zbGljZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4LmUgPSB2LmU7XG4gICAgICAgIHguZCA9IHYuZCA/IHYuZC5zbGljZSgpIDogdi5kO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0ID0gdHlwZW9mIHY7XG4gICAgaWYgKHQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGlmICh2ID09PSAwKSB7XG4gICAgICAgIHgucyA9IDEgLyB2IDwgMCA/IC0xIDogMTtcbiAgICAgICAgeC5lID0gMDtcbiAgICAgICAgeC5kID0gWzBdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodiA8IDApIHtcbiAgICAgICAgdiA9IC12O1xuICAgICAgICB4LnMgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHgucyA9IDE7XG4gICAgICB9XG4gICAgICBpZiAodiA9PT0gfn52ICYmIHYgPCAxZTcpIHtcbiAgICAgICAgZm9yIChlID0gMCwgaTIgPSB2OyBpMiA+PSAxMDsgaTIgLz0gMTApXG4gICAgICAgICAgZSsrO1xuICAgICAgICBpZiAoZXh0ZXJuYWwpIHtcbiAgICAgICAgICBpZiAoZSA+IERlY2ltYWwyLm1heEUpIHtcbiAgICAgICAgICAgIHguZSA9IE5hTjtcbiAgICAgICAgICAgIHguZCA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIGlmIChlIDwgRGVjaW1hbDIubWluRSkge1xuICAgICAgICAgICAgeC5lID0gMDtcbiAgICAgICAgICAgIHguZCA9IFswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeC5lID0gZTtcbiAgICAgICAgICAgIHguZCA9IFt2XTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeC5lID0gZTtcbiAgICAgICAgICB4LmQgPSBbdl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh2ICogMCAhPT0gMCkge1xuICAgICAgICBpZiAoIXYpXG4gICAgICAgICAgeC5zID0gTmFOO1xuICAgICAgICB4LmUgPSBOYU47XG4gICAgICAgIHguZCA9IG51bGw7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcbiAgICB9IGVsc2UgaWYgKHQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHYpO1xuICAgIH1cbiAgICBpZiAoKGkyID0gdi5jaGFyQ29kZUF0KDApKSA9PT0gNDUpIHtcbiAgICAgIHYgPSB2LnNsaWNlKDEpO1xuICAgICAgeC5zID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpMiA9PT0gNDMpXG4gICAgICAgIHYgPSB2LnNsaWNlKDEpO1xuICAgICAgeC5zID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcbiAgfVxuICBEZWNpbWFsMi5wcm90b3R5cGUgPSBQO1xuICBEZWNpbWFsMi5ST1VORF9VUCA9IDA7XG4gIERlY2ltYWwyLlJPVU5EX0RPV04gPSAxO1xuICBEZWNpbWFsMi5ST1VORF9DRUlMID0gMjtcbiAgRGVjaW1hbDIuUk9VTkRfRkxPT1IgPSAzO1xuICBEZWNpbWFsMi5ST1VORF9IQUxGX1VQID0gNDtcbiAgRGVjaW1hbDIuUk9VTkRfSEFMRl9ET1dOID0gNTtcbiAgRGVjaW1hbDIuUk9VTkRfSEFMRl9FVkVOID0gNjtcbiAgRGVjaW1hbDIuUk9VTkRfSEFMRl9DRUlMID0gNztcbiAgRGVjaW1hbDIuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XG4gIERlY2ltYWwyLkVVQ0xJRCA9IDk7XG4gIERlY2ltYWwyLmNvbmZpZyA9IERlY2ltYWwyLnNldCA9IGNvbmZpZztcbiAgRGVjaW1hbDIuY2xvbmUgPSBjbG9uZTtcbiAgRGVjaW1hbDIuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XG4gIERlY2ltYWwyLmFicyA9IGFicztcbiAgRGVjaW1hbDIuYWNvcyA9IGFjb3M7XG4gIERlY2ltYWwyLmFjb3NoID0gYWNvc2g7XG4gIERlY2ltYWwyLmFkZCA9IGFkZDtcbiAgRGVjaW1hbDIuYXNpbiA9IGFzaW47XG4gIERlY2ltYWwyLmFzaW5oID0gYXNpbmg7XG4gIERlY2ltYWwyLmF0YW4gPSBhdGFuO1xuICBEZWNpbWFsMi5hdGFuaCA9IGF0YW5oO1xuICBEZWNpbWFsMi5hdGFuMiA9IGF0YW4yO1xuICBEZWNpbWFsMi5jYnJ0ID0gY2JydDtcbiAgRGVjaW1hbDIuY2VpbCA9IGNlaWw7XG4gIERlY2ltYWwyLmNvcyA9IGNvcztcbiAgRGVjaW1hbDIuY29zaCA9IGNvc2g7XG4gIERlY2ltYWwyLmRpdiA9IGRpdjtcbiAgRGVjaW1hbDIuZXhwID0gZXhwO1xuICBEZWNpbWFsMi5mbG9vciA9IGZsb29yO1xuICBEZWNpbWFsMi5oeXBvdCA9IGh5cG90O1xuICBEZWNpbWFsMi5sbiA9IGxuO1xuICBEZWNpbWFsMi5sb2cgPSBsb2c7XG4gIERlY2ltYWwyLmxvZzEwID0gbG9nMTA7XG4gIERlY2ltYWwyLmxvZzIgPSBsb2cyO1xuICBEZWNpbWFsMi5tYXggPSBtYXg7XG4gIERlY2ltYWwyLm1pbiA9IG1pbjtcbiAgRGVjaW1hbDIubW9kID0gbW9kO1xuICBEZWNpbWFsMi5tdWwgPSBtdWw7XG4gIERlY2ltYWwyLnBvdyA9IHBvdztcbiAgRGVjaW1hbDIucmFuZG9tID0gcmFuZG9tO1xuICBEZWNpbWFsMi5yb3VuZCA9IHJvdW5kO1xuICBEZWNpbWFsMi5zaWduID0gc2lnbjtcbiAgRGVjaW1hbDIuc2luID0gc2luO1xuICBEZWNpbWFsMi5zaW5oID0gc2luaDtcbiAgRGVjaW1hbDIuc3FydCA9IHNxcnQ7XG4gIERlY2ltYWwyLnN1YiA9IHN1YjtcbiAgRGVjaW1hbDIudGFuID0gdGFuO1xuICBEZWNpbWFsMi50YW5oID0gdGFuaDtcbiAgRGVjaW1hbDIudHJ1bmMgPSB0cnVuYztcbiAgaWYgKG9iaiA9PT0gdm9pZCAwKVxuICAgIG9iaiA9IHt9O1xuICBpZiAob2JqKSB7XG4gICAgaWYgKG9iai5kZWZhdWx0cyAhPT0gdHJ1ZSkge1xuICAgICAgcHMgPSBbXCJwcmVjaXNpb25cIiwgXCJyb3VuZGluZ1wiLCBcInRvRXhwTmVnXCIsIFwidG9FeHBQb3NcIiwgXCJtYXhFXCIsIFwibWluRVwiLCBcIm1vZHVsb1wiLCBcImNyeXB0b1wiXTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7IClcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocCA9IHBzW2krK10pKVxuICAgICAgICAgIG9ialtwXSA9IHRoaXNbcF07XG4gICAgfVxuICB9XG4gIERlY2ltYWwyLmNvbmZpZyhvYmopO1xuICByZXR1cm4gRGVjaW1hbDI7XG59XG5mdW5jdGlvbiBkaXYoeCwgeSkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuZGl2KHkpO1xufVxuZnVuY3Rpb24gZXhwKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmV4cCgpO1xufVxuZnVuY3Rpb24gZmxvb3IoeCkge1xuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAzKTtcbn1cbmZ1bmN0aW9uIGh5cG90KCkge1xuICB2YXIgaSwgbiwgdCA9IG5ldyB0aGlzKDApO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKSB7XG4gICAgbiA9IG5ldyB0aGlzKGFyZ3VtZW50c1tpKytdKTtcbiAgICBpZiAoIW4uZCkge1xuICAgICAgaWYgKG4ucykge1xuICAgICAgICBleHRlcm5hbCA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcygxIC8gMCk7XG4gICAgICB9XG4gICAgICB0ID0gbjtcbiAgICB9IGVsc2UgaWYgKHQuZCkge1xuICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcbiAgICB9XG4gIH1cbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICByZXR1cm4gdC5zcXJ0KCk7XG59XG5mdW5jdGlvbiBpc0RlY2ltYWxJbnN0YW5jZShvYmopIHtcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERlY2ltYWwgfHwgb2JqICYmIG9iai5uYW1lID09PSBcIltvYmplY3QgRGVjaW1hbF1cIiB8fCBmYWxzZTtcbn1cbmZ1bmN0aW9uIGxuKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmxuKCk7XG59XG5mdW5jdGlvbiBsb2coeCwgeSkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xufVxuZnVuY3Rpb24gbG9nMih4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMik7XG59XG5mdW5jdGlvbiBsb2cxMCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMTApO1xufVxuZnVuY3Rpb24gbWF4KCkge1xuICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCBcImx0XCIpO1xufVxuZnVuY3Rpb24gbWluKCkge1xuICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCBcImd0XCIpO1xufVxuZnVuY3Rpb24gbW9kKHgsIHkpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm1vZCh5KTtcbn1cbmZ1bmN0aW9uIG11bCh4LCB5KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5tdWwoeSk7XG59XG5mdW5jdGlvbiBwb3coeCwgeSkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkucG93KHkpO1xufVxuZnVuY3Rpb24gcmFuZG9tKHNkKSB7XG4gIHZhciBkLCBlLCBrLCBuLCBpID0gMCwgciA9IG5ldyB0aGlzKDEpLCByZCA9IFtdO1xuICBpZiAoc2QgPT09IHZvaWQgMClcbiAgICBzZCA9IHRoaXMucHJlY2lzaW9uO1xuICBlbHNlXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XG4gIGsgPSBNYXRoLmNlaWwoc2QgLyBMT0dfQkFTRSk7XG4gIGlmICghdGhpcy5jcnlwdG8pIHtcbiAgICBmb3IgKDsgaSA8IGs7IClcbiAgICAgIHJkW2krK10gPSBNYXRoLnJhbmRvbSgpICogMWU3IHwgMDtcbiAgfSBlbHNlIGlmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgZCA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KGspKTtcbiAgICBmb3IgKDsgaSA8IGs7ICkge1xuICAgICAgbiA9IGRbaV07XG4gICAgICBpZiAobiA+PSA0MjllNykge1xuICAgICAgICBkW2ldID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoMSkpWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmRbaSsrXSA9IG4gJSAxZTc7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xuICAgIGQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoayAqPSA0KTtcbiAgICBmb3IgKDsgaSA8IGs7ICkge1xuICAgICAgbiA9IGRbaV0gKyAoZFtpICsgMV0gPDwgOCkgKyAoZFtpICsgMl0gPDwgMTYpICsgKChkW2kgKyAzXSAmIDEyNykgPDwgMjQpO1xuICAgICAgaWYgKG4gPj0gMjE0ZTcpIHtcbiAgICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDQpLmNvcHkoZCwgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZC5wdXNoKG4gJSAxZTcpO1xuICAgICAgICBpICs9IDQ7XG4gICAgICB9XG4gICAgfVxuICAgIGkgPSBrIC8gNDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XG4gIH1cbiAgayA9IHJkWy0taV07XG4gIHNkICU9IExPR19CQVNFO1xuICBpZiAoayAmJiBzZCkge1xuICAgIG4gPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIHNkKTtcbiAgICByZFtpXSA9IChrIC8gbiB8IDApICogbjtcbiAgfVxuICBmb3IgKDsgcmRbaV0gPT09IDA7IGktLSlcbiAgICByZC5wb3AoKTtcbiAgaWYgKGkgPCAwKSB7XG4gICAgZSA9IDA7XG4gICAgcmQgPSBbMF07XG4gIH0gZWxzZSB7XG4gICAgZSA9IC0xO1xuICAgIGZvciAoOyByZFswXSA9PT0gMDsgZSAtPSBMT0dfQkFTRSlcbiAgICAgIHJkLnNoaWZ0KCk7XG4gICAgZm9yIChrID0gMSwgbiA9IHJkWzBdOyBuID49IDEwOyBuIC89IDEwKVxuICAgICAgaysrO1xuICAgIGlmIChrIDwgTE9HX0JBU0UpXG4gICAgICBlIC09IExPR19CQVNFIC0gaztcbiAgfVxuICByLmUgPSBlO1xuICByLmQgPSByZDtcbiAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiByb3VuZCh4KSB7XG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIHRoaXMucm91bmRpbmcpO1xufVxuZnVuY3Rpb24gc2lnbih4KSB7XG4gIHggPSBuZXcgdGhpcyh4KTtcbiAgcmV0dXJuIHguZCA/IHguZFswXSA/IHgucyA6IDAgKiB4LnMgOiB4LnMgfHwgTmFOO1xufVxuZnVuY3Rpb24gc2luKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnNpbigpO1xufVxuZnVuY3Rpb24gc2luaCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW5oKCk7XG59XG5mdW5jdGlvbiBzcXJ0KHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnNxcnQoKTtcbn1cbmZ1bmN0aW9uIHN1Yih4LCB5KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5zdWIoeSk7XG59XG5mdW5jdGlvbiB0YW4oeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XG59XG5mdW5jdGlvbiB0YW5oKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbmgoKTtcbn1cbmZ1bmN0aW9uIHRydW5jKHgpIHtcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMSk7XG59XG5QW1N5bWJvbC5mb3IoXCJub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbVwiKV0gPSBQLnRvU3RyaW5nO1xuUFtTeW1ib2wudG9TdHJpbmdUYWddID0gXCJEZWNpbWFsXCI7XG5leHBvcnQgdmFyIERlY2ltYWwgPSBjbG9uZShERUZBVUxUUyk7XG5MTjEwID0gbmV3IERlY2ltYWwoTE4xMCk7XG5QSSA9IG5ldyBEZWNpbWFsKFBJKTtcbmV4cG9ydCBkZWZhdWx0IERlY2ltYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV3b2dJQ0oyWlhKemFXOXVJam9nTXl3S0lDQWljMjkxY21ObGN5STZJRnNpTDJodmJXVXZjblZ1Ym1WeUwzZHZjbXN2Ylc5dVpYa3ZiVzl1WlhrdmJtOWtaVjl0YjJSMWJHVnpMMlJsWTJsdFlXd3Vhbk12WkdWamFXMWhiQzV0YW5NaVhTd0tJQ0FpYldGd2NHbHVaM01pT2lBaVFVRmpRU3hKUVVGSkxGbEJRVmtzVFVGSlpDeGhRVUZoTEV0QlIySXNWMEZCVnl4dlFrRkhXQ3hQUVVGUExITm5RMEZIVUN4TFFVRkxMSE5uUTBGSlRDeFhRVUZYTzBGQlFVRXNSVUZQVkN4WFFVRlhPMEZCUVVFc1JVRnBRbGdzVlVGQlZUdEJRVUZCTEVWQlpWWXNVVUZCVVR0QlFVRkJMRVZCU1ZJc1ZVRkJWVHRCUVVGQkxFVkJTVllzVlVGQlZ6dEJRVUZCTEVWQlNWZ3NUVUZCVFN4RFFVRkRPMEZCUVVFc1JVRkpVQ3hOUVVGTk8wRkJRVUVzUlVGSFRpeFJRVUZSTzBGQlFVRXNSMEZQVml4VFFVRlRMRlZCUTFRc1YwRkJWeXhOUVVWWUxHVkJRV1VzYlVKQlEyWXNhMEpCUVd0Q0xHVkJRV1VzYzBKQlEycERMSGxDUVVGNVFpeGxRVUZsTERSQ1FVTjRReXh2UWtGQmIwSXNaVUZCWlN4elFrRkZia01zV1VGQldTeExRVUZMTEU5QlEycENMRlZCUVZVc1MwRkJTeXhMUVVWbUxGZEJRVmNzT0VOQlExZ3NVVUZCVVN3d1JFRkRVaXhWUVVGVkxHbEVRVU5XTEZsQlFWa3NjME5CUlZvc1QwRkJUeXhMUVVOUUxGZEJRVmNzUjBGRFdDeHRRa0ZCYlVJc2EwSkJSVzVDTEdsQ1FVRnBRaXhMUVVGTExGTkJRVk1zUjBGREwwSXNaVUZCWlN4SFFVRkhMRk5CUVZNc1IwRkhNMElzU1VGQlNTeERRVUZGTEUxQlFVMDdRVUY1UldRc1JVRkJSU3huUWtGQlowSXNSVUZCUlN4TlFVRk5MRmRCUVZrN1FVRkRjRU1zVFVGQlNTeEpRVUZKTEVsQlFVa3NTMEZCU3l4WlFVRlpPMEZCUXpkQ0xFMUJRVWtzUlVGQlJTeEpRVUZKTzBGQlFVY3NUVUZCUlN4SlFVRkpPMEZCUTI1Q0xGTkJRVThzVTBGQlV6dEJRVUZCTzBGQlUyeENMRVZCUVVVc1QwRkJUeXhYUVVGWk8wRkJRMjVDTEZOQlFVOHNVMEZCVXl4SlFVRkpMRXRCUVVzc1dVRkJXU3hQUVVGUExFdEJRVXNzU1VGQlNTeEhRVUZITzBGQlFVRTdRVUZaTVVRc1JVRkJSU3hoUVVGaExFVkJRVVVzVFVGQlRTeFRRVUZWTEVkQlFVYzdRVUZEYkVNc1RVRkJTU3hIUVVGSExFZEJRVWNzUzBGQlN5eExRVU5pTEVsQlFVa3NUVUZEU2l4TFFVRkxMRVZCUVVVc1IwRkRVQ3hMUVVGTkxFdEJRVWtzU1VGQlNTeEZRVUZGTEZsQlFWa3NTVUZCU1N4SFFVTm9ReXhMUVVGTExFVkJRVVVzUjBGRFVDeExRVUZMTEVWQlFVVTdRVUZIVkN4TlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWs3UVVGRFpDeFhRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1RVRkJUU3hQUVVGUExFdEJRVXNzUzBGQlN5eFBRVUZQTEV0QlFVc3NTVUZCU1N4RFFVRkRMRXRCUVVzc1MwRkJTeXhKUVVGSkxFbEJRVWs3UVVGQlFUdEJRVWxvUml4TlFVRkpMRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zUjBGQlJ6dEJRVUZKTEZkQlFVOHNSMEZCUnl4TFFVRkxMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN6dEJRVWQ0UkN4TlFVRkpMRTlCUVU4N1FVRkJTU3hYUVVGUE8wRkJSM1JDTEUxQlFVa3NSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkJSeXhYUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVsQlFVa3NTMEZCU3l4SlFVRkpMRWxCUVVrN1FVRkZha1FzVVVGQlRTeEhRVUZITzBGQlExUXNVVUZCVFN4SFFVRkhPMEZCUjFRc1QwRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeE5RVUZOTEUxQlFVMHNUVUZCVFN4TFFVRkxMRWxCUVVrc1IwRkJSeXhGUVVGRkxFZEJRVWM3UVVGRGFrUXNVVUZCU1N4SFFVRkhMRTlCUVU4c1IwRkJSenRCUVVGSkxHRkJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTMEZCU3l4TFFVRkxMRWxCUVVrc1NVRkJTVHRCUVVGQk8wRkJTVE5FTEZOQlFVOHNVVUZCVVN4TlFVRk5MRWxCUVVrc1RVRkJUU3hOUVVGTkxFdEJRVXNzU1VGQlNTeEpRVUZKTzBGQlFVRTdRVUZwUW5CRUxFVkJRVVVzVTBGQlV5eEZRVUZGTEUxQlFVMHNWMEZCV1R0QlFVTTNRaXhOUVVGSkxFbEJRVWtzU1VGRFRpeEpRVUZKTEUxQlEwb3NUMEZCVHl4RlFVRkZPMEZCUlZnc1RVRkJTU3hEUVVGRExFVkJRVVU3UVVGQlJ5eFhRVUZQTEVsQlFVa3NTMEZCU3p0QlFVY3hRaXhOUVVGSkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlFVa3NWMEZCVHl4SlFVRkpMRXRCUVVzN1FVRkZOMElzVDBGQlN5eExRVUZMTzBGQlExWXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhaUVVGWkxFdEJRVXNzUzBGQlN5eEpRVUZKTEVWQlFVVXNSMEZCUnl4RlFVRkZMRkZCUVZFN1FVRkRPVU1zVDBGQlN5eFhRVUZYTzBGQlJXaENMRTFCUVVrc1QwRkJUeXhOUVVGTkxHbENRVUZwUWl4TlFVRk5PMEZCUlhoRExFOUJRVXNzV1VGQldUdEJRVU5xUWl4UFFVRkxMRmRCUVZjN1FVRkZhRUlzVTBGQlR5eFRRVUZUTEZsQlFWa3NTMEZCU3l4WlFVRlpMRWxCUVVrc1JVRkJSU3hSUVVGUkxFZEJRVWNzU1VGQlNTeEpRVUZKTzBGQlFVRTdRVUZ2UW5oRkxFVkJRVVVzVjBGQlZ5eEZRVUZGTEU5QlFVOHNWMEZCV1R0QlFVTm9ReXhOUVVGSkxFZEJRVWNzUjBGQlJ5eEhRVUZITEVkQlFVY3NTMEZCU3l4SFFVRkhMRWxCUVVrc1IwRkJSeXhKUVVGSkxGTkJRMnBETEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVN1FVRkZXQ3hOUVVGSkxFTkJRVU1zUlVGQlJTeGpRVUZqTEVWQlFVVTdRVUZCVlN4WFFVRlBMRWxCUVVrc1MwRkJTenRCUVVOcVJDeGhRVUZYTzBGQlIxZ3NUVUZCU1N4RlFVRkZMRWxCUVVrc1VVRkJVU3hGUVVGRkxFbEJRVWtzUjBGQlJ5eEpRVUZKTzBGQlNTOUNMRTFCUVVrc1EwRkJReXhMUVVGTExFdEJRVXNzU1VGQlNTeE5RVUZOTEVsQlFVa3NSMEZCUnp0QlFVTTVRaXhSUVVGSkxHVkJRV1VzUlVGQlJUdEJRVU55UWl4UlFVRkpMRVZCUVVVN1FVRkhUaXhSUVVGSkxFbEJRVXNzUzBGQlNTeEZRVUZGTEZOQlFWTXNTMEZCU3p0QlFVRkhMRmRCUVUwc1MwRkJTeXhMUVVGTExFdEJRVXNzUzBGQlN5eE5RVUZOTzBGQlEyaEZMRkZCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWs3UVVGSGJrSXNVVUZCU1N4VlFVRlhMRXRCUVVrc1MwRkJTeXhMUVVGTkxFdEJRVWtzUzBGQlRTeExRVUZKTEVsQlFVa3NTMEZCU3p0QlFVVnlSQ3hSUVVGSkxFdEJRVXNzU1VGQlNTeEhRVUZITzBGQlEyUXNWVUZCU1N4UFFVRlBPMEZCUVVFc1YwRkRUanRCUVVOTUxGVkJRVWtzUlVGQlJUdEJRVU5PTEZWQlFVa3NSVUZCUlN4TlFVRk5MRWRCUVVjc1JVRkJSU3hSUVVGUkxFOUJRVThzUzBGQlN6dEJRVUZCTzBGQlIzWkRMRkZCUVVrc1NVRkJTU3hMUVVGTE8wRkJRMklzVFVGQlJTeEpRVUZKTEVWQlFVVTdRVUZCUVN4VFFVTklPMEZCUTB3c1VVRkJTU3hKUVVGSkxFdEJRVXNzUlVGQlJUdEJRVUZCTzBGQlIycENMRTlCUVUwc1MwRkJTU3hMUVVGTExHRkJRV0U3UVVGSk5VSXNZVUZCVXp0QlFVTlFMRkZCUVVrN1FVRkRTaXhUUVVGTExFVkJRVVVzVFVGQlRTeEhRVUZITEUxQlFVMDdRVUZEZEVJc1kwRkJWU3hIUVVGSExFdEJRVXM3UVVGRGJFSXNVVUZCU1N4UFFVRlBMRkZCUVZFc1MwRkJTeXhIUVVGSExFMUJRVTBzU1VGQlNTeFJRVUZSTEV0QlFVc3NTMEZCU3l4TFFVRkxMRWRCUVVjN1FVRkhMMFFzVVVGQlNTeGxRVUZsTEVWQlFVVXNSMEZCUnl4TlFVRk5MRWRCUVVjc1VVRkJVeXhMUVVGSkxHVkJRV1VzUlVGQlJTeEpRVUZKTEUxQlFVMHNSMEZCUnl4TFFVRkxPMEZCUXk5RkxGVkJRVWtzUlVGQlJTeE5RVUZOTEV0QlFVc3NSMEZCUnl4TFFVRkxPMEZCU1hwQ0xGVkJRVWtzUzBGQlN5eFZRVUZWTEVOQlFVTXNUMEZCVHl4TFFVRkxMRkZCUVZFN1FVRkpkRU1zV1VGQlNTeERRVUZETEV0QlFVczdRVUZEVWl4dFFrRkJVeXhIUVVGSExFbEJRVWtzUjBGQlJ6dEJRVVZ1UWl4alFVRkpMRVZCUVVVc1RVRkJUU3hIUVVGSExFMUJRVTBzUjBGQlJ5eEhRVUZITEVsQlFVazdRVUZETjBJc1owSkJRVWs3UVVGRFNqdEJRVUZCTzBGQlFVRTdRVUZKU2l4alFVRk5PMEZCUTA0c1kwRkJUVHRCUVVGQkxHRkJRMFE3UVVGSlRDeFpRVUZKTEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRkxFMUJRVTBzVFVGQlRTeEZRVUZGTEU5QlFVOHNUVUZCVFN4TFFVRkxPMEZCUnpkRExHMUNRVUZUTEVkQlFVY3NTVUZCU1N4SFFVRkhPMEZCUTI1Q0xHTkJRVWtzUTBGQlF5eEZRVUZGTEUxQlFVMHNSMEZCUnl4TlFVRk5MRWRCUVVjc1IwRkJSenRCUVVGQk8wRkJSemxDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUzA0c1lVRkJWenRCUVVWWUxGTkJRVThzVTBGQlV5eEhRVUZITEVkQlFVY3NTMEZCU3l4VlFVRlZPMEZCUVVFN1FVRlJka01zUlVGQlJTeG5Ra0ZCWjBJc1JVRkJSU3hMUVVGTExGZEJRVms3UVVGRGJrTXNUVUZCU1N4SFFVTkdMRWxCUVVrc1MwRkJTeXhIUVVOVUxFbEJRVWs3UVVGRlRpeE5RVUZKTEVkQlFVYzdRVUZEVEN4UlFVRkpMRVZCUVVVc1UwRkJVenRCUVVObUxGRkJRVXNzUzBGQlNTeFZRVUZWTEV0QlFVc3NTVUZCU1N4aFFVRmhPMEZCUjNwRExGRkJRVWtzUlVGQlJUdEJRVU5PTEZGQlFVazdRVUZCUnl4aFFVRlBMRWxCUVVrc1RVRkJUU3hIUVVGSExFdEJRVXM3UVVGQlNUdEJRVU53UXl4UlFVRkpMRWxCUVVrN1FVRkJSeXhWUVVGSk8wRkJRVUU3UVVGSGFrSXNVMEZCVHp0QlFVRkJPMEZCZVVKVUxFVkJRVVVzV1VGQldTeEZRVUZGTEUxQlFVMHNVMEZCVlN4SFFVRkhPMEZCUTJwRExGTkJRVThzVDBGQlR5eE5RVUZOTEVsQlFVa3NTMEZCU3l4WlFVRlpPMEZCUVVFN1FVRlRNME1zUlVGQlJTeHhRa0ZCY1VJc1JVRkJSU3hYUVVGWExGTkJRVlVzUjBGQlJ6dEJRVU12UXl4TlFVRkpMRWxCUVVrc1RVRkRUaXhQUVVGUExFVkJRVVU3UVVGRFdDeFRRVUZQTEZOQlFWTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1MwRkJTeXhKUVVGSkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEV0QlFVc3NWMEZCVnl4TFFVRkxPMEZCUVVFN1FVRlJlRVVzUlVGQlJTeFRRVUZUTEVWQlFVVXNTMEZCU3l4VFFVRlZMRWRCUVVjN1FVRkROMElzVTBGQlR5eExRVUZMTEVsQlFVa3NUMEZCVHp0QlFVRkJPMEZCVTNwQ0xFVkJRVVVzVVVGQlVTeFhRVUZaTzBGQlEzQkNMRk5CUVU4c1UwRkJVeXhKUVVGSkxFdEJRVXNzV1VGQldTeFBRVUZQTEV0QlFVc3NTVUZCU1N4SFFVRkhPMEZCUVVFN1FVRlRNVVFzUlVGQlJTeGpRVUZqTEVWQlFVVXNTMEZCU3l4VFFVRlZMRWRCUVVjN1FVRkRiRU1zVTBGQlR5eExRVUZMTEVsQlFVa3NTMEZCU3p0QlFVRkJPMEZCVTNaQ0xFVkJRVVVzZFVKQlFYVkNMRVZCUVVVc1RVRkJUU3hUUVVGVkxFZEJRVWM3UVVGRE5VTXNUVUZCU1N4SlFVRkpMRXRCUVVzc1NVRkJTVHRCUVVOcVFpeFRRVUZQTEV0QlFVc3NTMEZCU3l4TlFVRk5PMEZCUVVFN1FVRTJRbnBDTEVWQlFVVXNiVUpCUVcxQ0xFVkJRVVVzVDBGQlR5eFhRVUZaTzBGQlEzaERMRTFCUVVrc1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNTeExRVU5vUWl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRkxHRkJRMVFzVFVGQlRTeEpRVUZKTEV0QlFVczdRVUZGYWtJc1RVRkJTU3hEUVVGRExFVkJRVVU3UVVGQldTeFhRVUZQTEVsQlFVa3NTMEZCU3l4RlFVRkZMRWxCUVVrc1NVRkJTU3hKUVVGSk8wRkJRMnBFTEUxQlFVa3NSVUZCUlR0QlFVRlZMRmRCUVU4N1FVRkZka0lzVDBGQlN5eExRVUZMTzBGQlExWXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhaUVVGWkxFdEJRVXNzUzBGQlN5eEpRVUZKTEVWQlFVVXNSMEZCUnl4RlFVRkZMRkZCUVZFN1FVRkRPVU1zVDBGQlN5eFhRVUZYTzBGQlEyaENMRkZCUVUwc1JVRkJSU3hGUVVGRk8wRkJUMVlzVFVGQlNTeE5RVUZOTEVsQlFVazdRVUZEV2l4UlFVRkpMRXRCUVVzc1MwRkJTeXhOUVVGTk8wRkJRM0JDTEZGQlFVc3NTMEZCU1N4UlFVRlJMRWRCUVVjc1NVRkJTVHRCUVVGQkxGTkJRMjVDTzBGQlEwd3NVVUZCU1R0QlFVTktMRkZCUVVrN1FVRkJRVHRCUVVkT0xFMUJRVWtzWVVGQllTeE5RVUZOTEVkQlFVY3NSVUZCUlN4TlFVRk5MRWxCUVVrc1NVRkJTU3hMUVVGTExFbEJRVWs3UVVGSGJrUXNUVUZCU1N4VFFVTkdMRWxCUVVrc1IwRkRTaXhMUVVGTExFbEJRVWtzUzBGQlN6dEJRVU5vUWl4VFFVRlBMRTlCUVUwN1FVRkRXQ3hqUVVGVkxFVkJRVVVzVFVGQlRUdEJRVU5zUWl4UlFVRkpMRWxCUVVrc1RVRkJUU3hSUVVGUkxFMUJRVTBzUjBGQlJ5eE5RVUZOTEZGQlFWRXNUVUZCVFR0QlFVRkJPMEZCUjNKRUxGTkJRVThzVTBGQlV5eEhRVUZITEV0QlFVc3NXVUZCV1N4SlFVRkpMRXRCUVVzc1YwRkJWeXhKUVVGSk8wRkJRVUU3UVVGclF6bEVMRVZCUVVVc2FVSkJRV2xDTEVWQlFVVXNUMEZCVHl4WFFVRlpPMEZCUTNSRExFMUJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NTMEZEWWl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRk8wRkJSVmdzVFVGQlNTeERRVUZETEVWQlFVVXNZMEZCWXl4RlFVRkZPMEZCUVZVc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRmFrUXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eFpRVUZaTEV0QlFVc3NTMEZCU3l4SlFVRkpMRVZCUVVVc1IwRkJSeXhGUVVGRkxGRkJRVkU3UVVGRE9VTXNUMEZCU3l4WFFVRlhPMEZCUTJoQ0xGRkJRVTBzUlVGQlJTeEZRVUZGTzBGQlJWWXNUVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkRXQ3hSUVVGSkxHRkJRV0VzVFVGQlRTeEhRVUZITEVkQlFVY3NSMEZCUnp0QlFVRkJMRk5CUXpOQ08wRkJWMHdzVVVGQlNTeE5RVUZOTEV0QlFVc3NTMEZCU3p0QlFVTndRaXhSUVVGSkxFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVazdRVUZGZEVJc1VVRkJTU3hGUVVGRkxFMUJRVTBzU1VGQlNTeFJRVUZSTEVkQlFVYzdRVUZETTBJc1VVRkJTU3hoUVVGaExFMUJRVTBzUjBGQlJ5eEhRVUZITEVkQlFVYzdRVUZIYUVNc1VVRkJTU3hUUVVOR0xFdEJRVXNzU1VGQlNTeExRVUZMTEVsQlEyUXNUVUZCVFN4SlFVRkpMRXRCUVVzc1MwRkRaaXhOUVVGTkxFbEJRVWtzUzBGQlN6dEJRVU5xUWl4WFFVRlBMRTlCUVUwN1FVRkRXQ3huUWtGQlZTeEZRVUZGTEUxQlFVMDdRVUZEYkVJc1ZVRkJTU3hGUVVGRkxFMUJRVTBzUjBGQlJ5eExRVUZMTEZGQlFWRXNUVUZCVFN4SlFVRkpMRTFCUVUwc1UwRkJVeXhMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVWs1UkN4UFFVRkxMRmxCUVZrN1FVRkRha0lzVDBGQlN5eFhRVUZYTzBGQlJXaENMRk5CUVU4c1UwRkJVeXhIUVVGSExFbEJRVWtzU1VGQlNUdEJRVUZCTzBGQmIwSTNRaXhGUVVGRkxHOUNRVUZ2UWl4RlFVRkZMRTlCUVU4c1YwRkJXVHRCUVVONlF5eE5RVUZKTEVsQlFVa3NTVUZEVGl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRk8wRkJSVmdzVFVGQlNTeERRVUZETEVWQlFVVTdRVUZCV1N4WFFVRlBMRWxCUVVrc1MwRkJTeXhGUVVGRk8wRkJRM0pETEUxQlFVa3NSVUZCUlR0QlFVRlZMRmRCUVU4c1NVRkJTU3hMUVVGTE8wRkJSV2hETEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzV1VGQldTeExRVUZMTzBGQlEzUkNMRTlCUVVzc1YwRkJWenRCUVVWb1FpeFRRVUZQTEU5QlFVOHNSVUZCUlN4UlFVRlJMRVZCUVVVc1VVRkJVU3hMUVVGTExGbEJRVmtzU1VGQlNTeExRVUZMTEZkQlFWYzdRVUZCUVR0QlFYVkNla1VzUlVGQlJTeG5Ra0ZCWjBJc1JVRkJSU3hQUVVGUExGZEJRVms3UVVGRGNrTXNUVUZCU1N4UlFVTkdMRWxCUVVrc1RVRkRTaXhQUVVGUExFVkJRVVVzWVVGRFZDeEpRVUZKTEVWQlFVVXNUVUZCVFN4SlFVRkpMRWxCUTJoQ0xFdEJRVXNzUzBGQlN5eFhRVU5XTEV0QlFVc3NTMEZCU3p0QlFVVmFMRTFCUVVrc1RVRkJUU3hKUVVGSk8wRkJRMW9zVjBGQlR5eE5RVUZOTEVsQlJWUXNSVUZCUlN4VlFVRlZMRTFCUVUwc1RVRkJUU3hKUVVGSkxFMUJRVTBzU1VGQlNTeExRVUZMTEV0QlJUTkRMRWxCUVVrc1MwRkJTenRCUVVGQk8wRkJSMllzVFVGQlNTeEZRVUZGTzBGQlFWVXNWMEZCVHl4TlFVRk5MRTFCUVUwc1MwRkJTeXhIUVVGSExFbEJRVWtzVFVGQlRUdEJRVWx5UkN4UFFVRkxMRmxCUVZrc1MwRkJTenRCUVVOMFFpeFBRVUZMTEZkQlFWYzdRVUZGYUVJc1RVRkJTU3hGUVVGRk8wRkJRMDRzVjBGQlV5eE5RVUZOTEUxQlFVMHNTMEZCU3l4SFFVRkhMRWxCUVVrc1RVRkJUVHRCUVVWMlF5eFBRVUZMTEZsQlFWazdRVUZEYWtJc1QwRkJTeXhYUVVGWE8wRkJSV2hDTEZOQlFVOHNUMEZCVHl4TlFVRk5PMEZCUVVFN1FVRjFRblJDTEVWQlFVVXNNRUpCUVRCQ0xFVkJRVVVzVVVGQlVTeFhRVUZaTzBGQlEyaEVMRTFCUVVrc1NVRkJTU3hKUVVOT0xFbEJRVWtzVFVGRFNpeFBRVUZQTEVWQlFVVTdRVUZGV0N4TlFVRkpMRVZCUVVVc1NVRkJTVHRCUVVGSkxGZEJRVThzU1VGQlNTeExRVUZMTEVWQlFVVXNSMEZCUnl4TFFVRkxMRWxCUVVrN1FVRkROVU1zVFVGQlNTeERRVUZETEVWQlFVVTdRVUZCV1N4WFFVRlBMRWxCUVVrc1MwRkJTenRCUVVWdVF5eFBRVUZMTEV0QlFVczdRVUZEVml4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExGbEJRVmtzUzBGQlN5eExRVUZMTEVsQlFVa3NTMEZCU3l4SlFVRkpMRVZCUVVVc1NVRkJTU3hGUVVGRkxGRkJRVkU3UVVGRGVFUXNUMEZCU3l4WFFVRlhPMEZCUTJoQ0xHRkJRVmM3UVVGRldDeE5RVUZKTEVWQlFVVXNUVUZCVFN4SFFVRkhMRTFCUVUwc1IwRkJSeXhQUVVGUExFdEJRVXM3UVVGRmNFTXNZVUZCVnp0QlFVTllMRTlCUVVzc1dVRkJXVHRCUVVOcVFpeFBRVUZMTEZkQlFWYzdRVUZGYUVJc1UwRkJUeXhGUVVGRk8wRkJRVUU3UVVGdlFsZ3NSVUZCUlN4M1FrRkJkMElzUlVGQlJTeFJRVUZSTEZkQlFWazdRVUZET1VNc1RVRkJTU3hKUVVGSkxFbEJRMDRzU1VGQlNTeE5RVU5LTEU5QlFVOHNSVUZCUlR0QlFVVllMRTFCUVVrc1EwRkJReXhGUVVGRkxHTkJRV01zUlVGQlJUdEJRVUZWTEZkQlFVOHNTVUZCU1N4TFFVRkxPMEZCUldwRUxFOUJRVXNzUzBGQlN6dEJRVU5XTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1dVRkJXU3hMUVVGTExFbEJRVWtzUzBGQlN5eEpRVUZKTEV0QlFVc3NTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hSUVVGUk8wRkJRelZFTEU5QlFVc3NWMEZCVnp0QlFVTm9RaXhoUVVGWE8wRkJSVmdzVFVGQlNTeEZRVUZGTEUxQlFVMHNSMEZCUnl4TFFVRkxMRWRCUVVjc1QwRkJUeXhMUVVGTE8wRkJSVzVETEdGQlFWYzdRVUZEV0N4UFFVRkxMRmxCUVZrN1FVRkRha0lzVDBGQlN5eFhRVUZYTzBGQlJXaENMRk5CUVU4c1JVRkJSVHRCUVVGQk8wRkJkVUpZTEVWQlFVVXNNa0pCUVRKQ0xFVkJRVVVzVVVGQlVTeFhRVUZaTzBGQlEycEVMRTFCUVVrc1NVRkJTU3hKUVVGSkxFdEJRVXNzUzBGRFppeEpRVUZKTEUxQlEwb3NUMEZCVHl4RlFVRkZPMEZCUlZnc1RVRkJTU3hEUVVGRExFVkJRVVU3UVVGQldTeFhRVUZQTEVsQlFVa3NTMEZCU3p0QlFVTnVReXhOUVVGSkxFVkJRVVVzUzBGQlN6dEJRVUZITEZkQlFVOHNTVUZCU1N4TFFVRkxMRVZCUVVVc1RVRkJUU3hIUVVGSExFdEJRVXNzUlVGQlJTeEpRVUZKTEVsQlFVa3NSVUZCUlN4WFFVRlhMRWxCUVVrN1FVRkZla1VzVDBGQlN5eExRVUZMTzBGQlExWXNUMEZCU3l4TFFVRkxPMEZCUTFZc1VVRkJUU3hGUVVGRk8wRkJSVklzVFVGQlNTeExRVUZMTEVsQlFVa3NTMEZCU3l4TlFVRk5MRWxCUVVrc1EwRkJReXhGUVVGRkxFbEJRVWs3UVVGQlJ5eFhRVUZQTEZOQlFWTXNTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hKUVVGSk8wRkJSVE5GTEU5QlFVc3NXVUZCV1N4TlFVRk5MRTFCUVUwc1JVRkJSVHRCUVVVdlFpeE5RVUZKTEU5QlFVOHNSVUZCUlN4TFFVRkxMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzVFVGQlRTeEpRVUZKTEUxQlFVMHNTVUZCU1R0QlFVVjBSQ3hQUVVGTExGbEJRVmtzUzBGQlN6dEJRVU4wUWl4UFFVRkxMRmRCUVZjN1FVRkZhRUlzVFVGQlNTeEZRVUZGTzBGQlJVNHNUMEZCU3l4WlFVRlpPMEZCUTJwQ0xFOUJRVXNzVjBGQlZ6dEJRVVZvUWl4VFFVRlBMRVZCUVVVc1RVRkJUVHRCUVVGQk8wRkJlVUpxUWl4RlFVRkZMR05CUVdNc1JVRkJSU3hQUVVGUExGZEJRVms3UVVGRGJrTXNUVUZCU1N4UlFVRlJMRWRCUTFZc1NVRkJTU3hKUVVOS0xFbEJRVWtzVFVGRFNpeFBRVUZQTEVWQlFVVTdRVUZGV0N4TlFVRkpMRVZCUVVVN1FVRkJWU3hYUVVGUExFbEJRVWtzUzBGQlN6dEJRVVZvUXl4TlFVRkpMRVZCUVVVc1RVRkJUU3hKUVVGSk8wRkJRMmhDTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1MwRkJTenRCUVVWV0xFMUJRVWtzVFVGQlRTeEpRVUZKTzBGQlIxb3NVVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkRXQ3hsUVVGVExFMUJRVTBzVFVGQlRTeExRVUZMTEVkQlFVY3NTVUZCU1N4TlFVRk5PMEZCUTNaRExHRkJRVThzU1VGQlNTeEZRVUZGTzBGQlEySXNZVUZCVHp0QlFVRkJPMEZCU1ZRc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGQlFUdEJRVXRzUWl4UFFVRkxMRmxCUVZrc1MwRkJTenRCUVVOMFFpeFBRVUZMTEZkQlFWYzdRVUZGYUVJc1RVRkJTU3hGUVVGRkxFbEJRVWtzU1VGQlNTeExRVUZMTEVkQlFVY3NUVUZCVFN4RlFVRkZMRTFCUVUwc1NVRkJTU3hQUVVGUExFdEJRVXNzU1VGQlNUdEJRVVY0UkN4UFFVRkxMRmxCUVZrN1FVRkRha0lzVDBGQlN5eFhRVUZYTzBGQlJXaENMRk5CUVU4c1JVRkJSU3hOUVVGTk8wRkJRVUU3UVVGelFtcENMRVZCUVVVc2FVSkJRV2xDTEVWQlFVVXNUMEZCVHl4WFFVRlpPMEZCUTNSRExFMUJRVWtzUjBGQlJ5eEhRVUZITEVkQlFVY3NSMEZCUnl4SlFVRkpMRWRCUVVjc1IwRkJSeXhMUVVGTExFbEJRemRDTEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVc1lVRkRWQ3hMUVVGTExFdEJRVXNzVjBGRFZpeExRVUZMTEV0QlFVczdRVUZGV2l4TlFVRkpMRU5CUVVNc1JVRkJSU3haUVVGWk8wRkJRMnBDTEZGQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVVjc1lVRkJUeXhKUVVGSkxFdEJRVXM3UVVGRE1VSXNVVUZCU1N4TFFVRkxMRXRCUVVzc1kwRkJZenRCUVVNeFFpeFZRVUZKTEUxQlFVMHNUVUZCVFN4TFFVRkxMRWRCUVVjc1NVRkJTU3hOUVVGTk8wRkJRMnhETEZGQlFVVXNTVUZCU1N4RlFVRkZPMEZCUTFJc1lVRkJUenRCUVVGQk8wRkJRVUVzWVVGRlFTeEZRVUZGTEZWQlFWVTdRVUZEY2tJc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGQlFTeGhRVU5RTEVWQlFVVXNUVUZCVFN4SFFVRkhMRTFCUVUwc1MwRkJTeXhMUVVGTExHTkJRV003UVVGRGJFUXNVVUZCU1N4TlFVRk5MRTFCUVUwc1MwRkJTeXhIUVVGSExFbEJRVWtzVFVGQlRUdEJRVU5zUXl4TlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVOU0xGZEJRVTg3UVVGQlFUdEJRVWRVTEU5QlFVc3NXVUZCV1N4TlFVRk5MRXRCUVVzN1FVRkROVUlzVDBGQlN5eFhRVUZYTzBGQlVXaENMRTFCUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWtzVFVGQlRTeFhRVUZYTEVsQlFVazdRVUZGZEVNc1QwRkJTeXhKUVVGSkxFZEJRVWNzUjBGQlJ5eEZRVUZGTzBGQlFVY3NVVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hOUVVGTkxFZEJRVWNzUzBGQlN5eEhRVUZITEU5QlFVOHNTMEZCU3p0QlFVVTNSQ3hoUVVGWE8wRkJSVmdzVFVGQlNTeExRVUZMTEV0QlFVc3NUVUZCVFR0QlFVTndRaXhOUVVGSk8wRkJRMG9zVDBGQlN5eEZRVUZGTEUxQlFVMDdRVUZEWWl4TlFVRkpMRWxCUVVrc1MwRkJTenRCUVVOaUxFOUJRVXM3UVVGSFRDeFRRVUZQTEUxQlFVMHNUVUZCU3p0QlFVTm9RaXhUUVVGTExFZEJRVWNzVFVGQlRUdEJRVU5rTEZGQlFVa3NSVUZCUlN4TlFVRk5MRWRCUVVjc1NVRkJTU3hMUVVGTE8wRkJSWGhDTEZOQlFVc3NSMEZCUnl4TlFVRk5PMEZCUTJRc1VVRkJTU3hGUVVGRkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEV0QlFVczdRVUZGZGtJc1VVRkJTU3hGUVVGRkxFVkJRVVVzVDBGQlR6dEJRVUZSTEZkQlFVc3NTVUZCU1N4SFFVRkhMRVZCUVVVc1JVRkJSU3hQUVVGUExFVkJRVVVzUlVGQlJTeE5RVUZOTzBGQlFVczdRVUZCUVR0QlFVY3ZSQ3hOUVVGSk8wRkJRVWNzVVVGQlNTeEZRVUZGTEUxQlFVMHNTMEZCVFN4SlFVRkpPMEZCUlRkQ0xHRkJRVmM3UVVGRldDeFRRVUZQTEZOQlFWTXNSMEZCUnl4TFFVRkxMRmxCUVZrc1NVRkJTU3hMUVVGTExGZEJRVmNzU1VGQlNUdEJRVUZCTzBGQlVUbEVMRVZCUVVVc1YwRkJWeXhYUVVGWk8wRkJRM1pDTEZOQlFVOHNRMEZCUXl4RFFVRkRMRXRCUVVzN1FVRkJRVHRCUVZGb1FpeEZRVUZGTEZsQlFWa3NSVUZCUlN4UlFVRlJMRmRCUVZrN1FVRkRiRU1zVTBGQlR5eERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkxMRlZCUVZVc1MwRkJTeXhKUVVGSkxGbEJRVmtzUzBGQlN5eEZRVUZGTEZOQlFWTTdRVUZCUVR0QlFWRndSU3hGUVVGRkxGRkJRVkVzVjBGQldUdEJRVU53UWl4VFFVRlBMRU5CUVVNc1MwRkJTenRCUVVGQk8wRkJVV1lzUlVGQlJTeGhRVUZoTEVWQlFVVXNVVUZCVVN4WFFVRlpPMEZCUTI1RExGTkJRVThzUzBGQlN5eEpRVUZKTzBGQlFVRTdRVUZSYkVJc1JVRkJSU3hoUVVGaExFVkJRVVVzVVVGQlVTeFhRVUZaTzBGQlEyNURMRk5CUVU4c1MwRkJTeXhKUVVGSk8wRkJRVUU3UVVGUmJFSXNSVUZCUlN4VFFVRlRMRmRCUVZrN1FVRkRja0lzVTBGQlR5eERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkxMRXRCUVVzc1JVRkJSU3hQUVVGUE8wRkJRVUU3UVVGUmJrTXNSVUZCUlN4WFFVRlhMRVZCUVVVc1MwRkJTeXhUUVVGVkxFZEJRVWM3UVVGREwwSXNVMEZCVHl4TFFVRkxMRWxCUVVrc1MwRkJTenRCUVVGQk8wRkJVWFpDTEVWQlFVVXNiMEpCUVc5Q0xFVkJRVVVzVFVGQlRTeFRRVUZWTEVkQlFVYzdRVUZEZWtNc1UwRkJUeXhMUVVGTExFbEJRVWtzUzBGQlN6dEJRVUZCTzBGQmEwTjJRaXhGUVVGRkxGbEJRVmtzUlVGQlJTeE5RVUZOTEZOQlFWVXNUVUZCVFR0QlFVTndReXhOUVVGSkxGVkJRVlVzUjBGQlJ5eGhRVUZoTEVkQlFVY3NTMEZCU3l4TFFVRkxMRWxCUVVrc1IwRkROME1zVFVGQlRTeE5RVU5PTEU5QlFVOHNTVUZCU1N4aFFVTllMRXRCUVVzc1MwRkJTeXhYUVVOV0xFdEJRVXNzUzBGQlN5eFZRVU5XTEZGQlFWRTdRVUZIVml4TlFVRkpMRkZCUVZFc1RVRkJUVHRCUVVOb1FpeFhRVUZQTEVsQlFVa3NTMEZCU3p0QlFVTm9RaXhsUVVGWE8wRkJRVUVzVTBGRFRqdEJRVU5NTEZkQlFVOHNTVUZCU1N4TFFVRkxPMEZCUTJoQ0xGRkJRVWtzUzBGQlN6dEJRVWRVTEZGQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJTeE5RVUZOTEV0QlFVc3NSMEZCUnp0QlFVRkpMR0ZCUVU4c1NVRkJTU3hMUVVGTE8wRkJSVGRFTEdWQlFWY3NTMEZCU3l4SFFVRkhPMEZCUVVFN1FVRkhja0lzVFVGQlNTeEpRVUZKTzBGQlIxSXNUVUZCU1N4SlFVRkpMRWxCUVVrc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTEUxQlFVMHNTVUZCU1N4SFFVRkhMRWxCUVVrN1FVRkRla01zVjBGQlR5eEpRVUZKTEV0QlFVc3NTMEZCU3l4RFFVRkRMRVZCUVVVc1MwRkJTeXhMUVVGTExFbEJRVWtzU1VGQlNTeExRVUZMTEVsQlFVa3NUVUZCVFN4SlFVRkpMRWxCUVVrc1NVRkJTVHRCUVVGQk8wRkJTM1pGTEUxQlFVa3NWVUZCVlR0QlFVTmFMRkZCUVVrc1JVRkJSU3hUUVVGVExFZEJRVWM3UVVGRGFFSXNXVUZCVFR0QlFVRkJMRmRCUTBRN1FVRkRUQ3hYUVVGTExFbEJRVWtzUlVGQlJTeEpRVUZKTEVsQlFVa3NUMEZCVHp0QlFVRkpMR0ZCUVVzN1FVRkRia01zV1VGQlRTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVbG9RaXhoUVVGWE8wRkJRMWdzVDBGQlN5eExRVUZMTzBGQlExWXNVVUZCVFN4cFFrRkJhVUlzUzBGQlN6dEJRVU0xUWl4blFrRkJZeXhYUVVGWExGRkJRVkVzVFVGQlRTeExRVUZMTEUxQlFVMHNhVUpCUVdsQ0xFMUJRVTA3UVVGSGVrVXNUVUZCU1N4UFFVRlBMRXRCUVVzc1lVRkJZU3hKUVVGSk8wRkJaMEpxUXl4TlFVRkpMRzlDUVVGdlFpeEZRVUZGTEVkQlFVY3NTVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkZlRU1zVDBGQlJ6dEJRVU5FTEZsQlFVMDdRVUZEVGl4WlFVRk5MR2xDUVVGcFFpeExRVUZMTzBGQlF6VkNMRzlDUVVGakxGZEJRVmNzVVVGQlVTeE5RVUZOTEV0QlFVc3NUVUZCVFN4cFFrRkJhVUlzVFVGQlRUdEJRVU42UlN4VlFVRkpMRTlCUVU4c1MwRkJTeXhoUVVGaExFbEJRVWs3UVVGRmFrTXNWVUZCU1N4RFFVRkRMRXRCUVVzN1FVRkhVaXhaUVVGSkxFTkJRVU1zWlVGQlpTeEZRVUZGTEVkQlFVY3NUVUZCVFN4SlFVRkpMRWRCUVVjc1NVRkJTU3hOUVVGTkxFdEJRVXNzVFVGQlRUdEJRVU42UkN4alFVRkpMRk5CUVZNc1IwRkJSeXhMUVVGTExFZEJRVWM3UVVGQlFUdEJRVWN4UWp0QlFVRkJPMEZCUVVFc1lVRkZTeXh2UWtGQmIwSXNSVUZCUlN4SFFVRkhMRXRCUVVzc1NVRkJTVHRCUVVGQk8wRkJSemRETEdGQlFWYzdRVUZGV0N4VFFVRlBMRk5CUVZNc1IwRkJSeXhKUVVGSk8wRkJRVUU3UVVGcFJIcENMRVZCUVVVc1VVRkJVU3hGUVVGRkxFMUJRVTBzVTBGQlZTeEhRVUZITzBGQlF6ZENMRTFCUVVrc1IwRkJSeXhIUVVGSExFZEJRVWNzUjBGQlJ5eEhRVUZITEV0QlFVc3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTU3hOUVVGTkxFbEJRelZETEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVN1FVRkZXQ3hOUVVGSkxFbEJRVWtzUzBGQlN6dEJRVWRpTEUxQlFVa3NRMEZCUXl4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxFZEJRVWM3UVVGSGFFSXNVVUZCU1N4RFFVRkRMRVZCUVVVc1MwRkJTeXhEUVVGRExFVkJRVVU3UVVGQlJ5eFZRVUZKTEVsQlFVa3NTMEZCU3p0QlFVRkJMR0ZCUjNSQ0xFVkJRVVU3UVVGQlJ5eFJRVUZGTEVsQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVVFN1FVRkxiRUlzVlVGQlNTeEpRVUZKTEV0QlFVc3NSVUZCUlN4TFFVRkxMRVZCUVVVc1RVRkJUU3hGUVVGRkxFbEJRVWtzU1VGQlNUdEJRVVV6UXl4WFFVRlBPMEZCUVVFN1FVRkpWQ3hOUVVGSkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVkQlFVYzdRVUZEWkN4TlFVRkZMRWxCUVVrc1EwRkJReXhGUVVGRk8wRkJRMVFzVjBGQlR5eEZRVUZGTEV0QlFVczdRVUZCUVR0QlFVZG9RaXhQUVVGTExFVkJRVVU3UVVGRFVDeFBRVUZMTEVWQlFVVTdRVUZEVUN4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExFdEJRVXM3UVVGSFZpeE5RVUZKTEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1IwRkJSeXhKUVVGSk8wRkJSM0JDTEZGQlFVa3NSMEZCUnp0QlFVRkpMRkZCUVVVc1NVRkJTU3hEUVVGRExFVkJRVVU3UVVGQlFTeGhRVWRZTEVkQlFVYzdRVUZCU1N4VlFVRkpMRWxCUVVrc1MwRkJTenRCUVVGQk8wRkJTWGhDTEdGQlFVOHNTVUZCU1N4TFFVRkxMRTlCUVU4c1NVRkJTU3hMUVVGTE8wRkJSWEpETEZkQlFVOHNWMEZCVnl4VFFVRlRMRWRCUVVjc1NVRkJTU3hOUVVGTk8wRkJRVUU3UVVGTk1VTXNUVUZCU1N4VlFVRlZMRVZCUVVVc1NVRkJTVHRCUVVOd1FpeFBRVUZMTEZWQlFWVXNSVUZCUlN4SlFVRkpPMEZCUlhKQ0xFOUJRVXNzUjBGQlJ6dEJRVU5TTEUxQlFVa3NTMEZCU3p0QlFVZFVMRTFCUVVrc1IwRkJSenRCUVVOTUxGZEJRVThzU1VGQlNUdEJRVVZZTEZGQlFVa3NUVUZCVFR0QlFVTlNMRlZCUVVrN1FVRkRTaXhWUVVGSkxFTkJRVU03UVVGRFRDeFpRVUZOTEVkQlFVYzdRVUZCUVN4WFFVTktPMEZCUTB3c1ZVRkJTVHRCUVVOS0xGVkJRVWs3UVVGRFNpeFpRVUZOTEVkQlFVYzdRVUZCUVR0QlFVMVlMRkZCUVVrc1MwRkJTeXhKUVVGSkxFdEJRVXNzUzBGQlN5eExRVUZMTEZkQlFWY3NUMEZCVHp0QlFVVTVReXhSUVVGSkxFbEJRVWtzUjBGQlJ6dEJRVU5VTEZWQlFVazdRVUZEU2l4UlFVRkZMRk5CUVZNN1FVRkJRVHRCUVVsaUxFMUJRVVU3UVVGRFJpeFRRVUZMTEVsQlFVa3NSMEZCUnp0QlFVRk5MRkZCUVVVc1MwRkJTenRCUVVONlFpeE5RVUZGTzBGQlFVRXNVMEZIUnp0QlFVbE1MRkZCUVVrc1IwRkJSenRCUVVOUUxGVkJRVTBzUjBGQlJ6dEJRVU5VTEZkQlFVOHNTVUZCU1R0QlFVTllMRkZCUVVrN1FVRkJUU3haUVVGTk8wRkJSV2hDTEZOQlFVc3NTVUZCU1N4SFFVRkhMRWxCUVVrc1MwRkJTeXhMUVVGTE8wRkJRM2hDTEZWQlFVa3NSMEZCUnl4TlFVRk5MRWRCUVVjc1NVRkJTVHRCUVVOc1FpeGxRVUZQTEVkQlFVY3NTMEZCU3l4SFFVRkhPMEZCUTJ4Q08wRkJRVUU3UVVGQlFUdEJRVWxLTEZGQlFVazdRVUZCUVR0QlFVZE9MRTFCUVVrc1RVRkJUVHRCUVVOU0xGRkJRVWs3UVVGRFNpeFRRVUZMTzBGQlEwd3NVMEZCU3p0QlFVTk1MRTFCUVVVc1NVRkJTU3hEUVVGRExFVkJRVVU3UVVGQlFUdEJRVWRZTEZGQlFVMHNSMEZCUnp0QlFVbFVMRTlCUVVzc1NVRkJTU3hIUVVGSExGTkJRVk1zUzBGQlN5eEpRVUZKTEVkQlFVY3NSVUZCUlR0QlFVRkhMRTlCUVVjc1UwRkJVenRCUVVkc1JDeFBRVUZMTEVsQlFVa3NSMEZCUnl4UlFVRlJMRWxCUVVrc1MwRkJTVHRCUVVVeFFpeFJRVUZKTEVkQlFVY3NSVUZCUlN4TFFVRkxMRWRCUVVjc1NVRkJTVHRCUVVOdVFpeFhRVUZMTEVsQlFVa3NSMEZCUnl4TFFVRkxMRWRCUVVjc1JVRkJSU3hQUVVGUE8wRkJRVWtzVjBGQlJ5eExRVUZMTEU5QlFVODdRVUZEYUVRc1VVRkJSU3hIUVVGSE8wRkJRMHdzVTBGQlJ5eE5RVUZOTzBGQlFVRTdRVUZIV0N4UFFVRkhMRTFCUVUwc1IwRkJSenRCUVVGQk8wRkJTV1FzVTBGQlR5eEhRVUZITEVWQlFVVXNVMEZCVXp0QlFVRkpMRTlCUVVjN1FVRkhOVUlzVTBGQlR5eEhRVUZITEU5QlFVOHNSMEZCUnl4SFFVRkhPMEZCUVZNc1RVRkJSVHRCUVVkc1F5eE5RVUZKTEVOQlFVTXNSMEZCUnp0QlFVRkpMRmRCUVU4c1NVRkJTU3hMUVVGTExFOUJRVThzU1VGQlNTeExRVUZMTzBGQlJUVkRMRWxCUVVVc1NVRkJTVHRCUVVOT0xFbEJRVVVzU1VGQlNTeHJRa0ZCYTBJc1NVRkJTVHRCUVVVMVFpeFRRVUZQTEZkQlFWY3NVMEZCVXl4SFFVRkhMRWxCUVVrc1RVRkJUVHRCUVVGQk8wRkJORUl4UXl4RlFVRkZMRk5CUVZNc1JVRkJSU3hOUVVGTkxGTkJRVlVzUjBGQlJ6dEJRVU01UWl4TlFVRkpMRWRCUTBZc1NVRkJTU3hOUVVOS0xFOUJRVThzUlVGQlJUdEJRVVZZTEUxQlFVa3NTVUZCU1N4TFFVRkxPMEZCUjJJc1RVRkJTU3hEUVVGRExFVkJRVVVzUzBGQlN5eERRVUZETEVWQlFVVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGQlNTeFhRVUZQTEVsQlFVa3NTMEZCU3p0QlFVZHdSQ3hOUVVGSkxFTkJRVU1zUlVGQlJTeExRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRVZCUVVVc1JVRkJSU3hKUVVGSk8wRkJRekZDTEZkQlFVOHNVMEZCVXl4SlFVRkpMRXRCUVVzc1NVRkJTU3hMUVVGTExGZEJRVmNzUzBGQlN6dEJRVUZCTzBGQlNYQkVMR0ZCUVZjN1FVRkZXQ3hOUVVGSkxFdEJRVXNzVlVGQlZTeEhRVUZITzBGQlNYQkNMRkZCUVVrc1QwRkJUeXhIUVVGSExFVkJRVVVzVDBGQlR5eEhRVUZITEVkQlFVYzdRVUZETjBJc1RVRkJSU3hMUVVGTExFVkJRVVU3UVVGQlFTeFRRVU5LTzBGQlEwd3NVVUZCU1N4UFFVRlBMRWRCUVVjc1IwRkJSeXhIUVVGSExFdEJRVXNzVVVGQlVUdEJRVUZCTzBGQlIyNURMRTFCUVVrc1JVRkJSU3hOUVVGTk8wRkJSVm9zWVVGQlZ6dEJRVVZZTEZOQlFVOHNSVUZCUlN4TlFVRk5PMEZCUVVFN1FVRlZha0lzUlVGQlJTeHhRa0ZCY1VJc1JVRkJSU3hOUVVGTkxGZEJRVms3UVVGRGVrTXNVMEZCVHl4dFFrRkJiVUk3UVVGQlFUdEJRVk0xUWl4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEV0QlFVc3NWMEZCV1R0QlFVTjBReXhUUVVGUExHbENRVUZwUWp0QlFVRkJPMEZCVXpGQ0xFVkJRVVVzVlVGQlZTeEZRVUZGTEUxQlFVMHNWMEZCV1R0QlFVTTVRaXhOUVVGSkxFbEJRVWtzU1VGQlNTeExRVUZMTEZsQlFWazdRVUZETjBJc1NVRkJSU3hKUVVGSkxFTkJRVU1zUlVGQlJUdEJRVU5VTEZOQlFVOHNVMEZCVXp0QlFVRkJPMEZCZVVKc1FpeEZRVUZGTEU5QlFVOHNSVUZCUlN4TlFVRk5MRk5CUVZVc1IwRkJSenRCUVVNMVFpeE5RVUZKTEU5QlFVOHNSMEZCUnl4SFFVRkhMRWRCUVVjc1IwRkJSeXhMUVVGTExFbEJRVWtzU1VGQlNTeEpRVUZKTEVsQlEzUkRMRWxCUVVrc1RVRkRTaXhQUVVGUExFVkJRVVU3UVVGRldDeE5RVUZKTEVsQlFVa3NTMEZCU3p0QlFVZGlMRTFCUVVrc1EwRkJReXhGUVVGRkxFdEJRVXNzUTBGQlF5eEZRVUZGTEVkQlFVYzdRVUZIYUVJc1VVRkJTU3hEUVVGRExFVkJRVVVzUzBGQlN5eERRVUZETEVWQlFVVTdRVUZCUnl4VlFVRkpMRWxCUVVrc1MwRkJTenRCUVVGQkxHRkJUWFJDTEVOQlFVTXNSVUZCUlR0QlFVRkhMRlZCUVVrc1NVRkJTU3hMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTEUxQlFVMHNSVUZCUlN4SlFVRkpMRWxCUVVrN1FVRkZja1FzVjBGQlR6dEJRVUZCTzBGQlNWUXNUVUZCU1N4RlFVRkZMRXRCUVVzc1JVRkJSU3hIUVVGSE8wRkJRMlFzVFVGQlJTeEpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTlVMRmRCUVU4c1JVRkJSU3hOUVVGTk8wRkJRVUU3UVVGSGFrSXNUMEZCU3l4RlFVRkZPMEZCUTFBc1QwRkJTeXhGUVVGRk8wRkJRMUFzVDBGQlN5eExRVUZMTzBGQlExWXNUMEZCU3l4TFFVRkxPMEZCUjFZc1RVRkJTU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NTVUZCU1R0QlFVbHdRaXhSUVVGSkxFTkJRVU1zUjBGQlJ6dEJRVUZKTEZWQlFVa3NTVUZCU1N4TFFVRkxPMEZCUlhwQ0xGZEJRVThzVjBGQlZ5eFRRVUZUTEVkQlFVY3NTVUZCU1N4TlFVRk5PMEZCUVVFN1FVRk5NVU1zVFVGQlNTeFZRVUZWTEVWQlFVVXNTVUZCU1R0QlFVTndRaXhOUVVGSkxGVkJRVlVzUlVGQlJTeEpRVUZKTzBGQlJYQkNMRTlCUVVzc1IwRkJSenRCUVVOU0xFMUJRVWtzU1VGQlNUdEJRVWRTTEUxQlFVa3NSMEZCUnp0QlFVVk1MRkZCUVVrc1NVRkJTU3hIUVVGSE8wRkJRMVFzVlVGQlNUdEJRVU5LTEZWQlFVa3NRMEZCUXp0QlFVTk1MRmxCUVUwc1IwRkJSenRCUVVGQkxGZEJRMG83UVVGRFRDeFZRVUZKTzBGQlEwb3NWVUZCU1R0QlFVTktMRmxCUVUwc1IwRkJSenRCUVVGQk8wRkJTVmdzVVVGQlNTeExRVUZMTEV0QlFVc3NTMEZCU3p0QlFVTnVRaXhWUVVGTkxFbEJRVWtzVFVGQlRTeEpRVUZKTEVsQlFVa3NUVUZCVFR0QlFVVTVRaXhSUVVGSkxFbEJRVWtzUzBGQlN6dEJRVU5ZTEZWQlFVazdRVUZEU2l4UlFVRkZMRk5CUVZNN1FVRkJRVHRCUVVsaUxFMUJRVVU3UVVGRFJpeFhRVUZQTzBGQlFVMHNVVUZCUlN4TFFVRkxPMEZCUTNCQ0xFMUJRVVU3UVVGQlFUdEJRVWRLTEZGQlFVMHNSMEZCUnp0QlFVTlVMRTFCUVVrc1IwRkJSenRCUVVkUUxFMUJRVWtzVFVGQlRTeEpRVUZKTEVkQlFVYzdRVUZEWml4UlFVRkpPMEZCUTBvc1VVRkJTVHRCUVVOS0xGTkJRVXM3UVVGRFRDeFRRVUZMTzBGQlFVRTdRVUZKVUN4UFFVRkxMRkZCUVZFc1IwRkJSeXhMUVVGSk8wRkJRMnhDTEZsQlFWTXNTVUZCUnl4RlFVRkZMRXRCUVVzc1IwRkJSeXhMUVVGTExFZEJRVWNzUzBGQlN5eFRRVUZUTEU5QlFVODdRVUZEYmtRc1QwRkJSeXhOUVVGTk8wRkJRVUU3UVVGSFdDeE5RVUZKTEU5QlFVODdRVUZEVkN4UFFVRkhMRkZCUVZFN1FVRkRXQ3hOUVVGRk8wRkJRVUU3UVVGTFNpeFBRVUZMTEUxQlFVMHNSMEZCUnl4UlFVRlJMRWRCUVVjc1JVRkJSU3hSUVVGUk8wRkJRVWtzVDBGQlJ6dEJRVVV4UXl4SlFVRkZMRWxCUVVrN1FVRkRUaXhKUVVGRkxFbEJRVWtzYTBKQlFXdENMRWxCUVVrN1FVRkZOVUlzVTBGQlR5eFhRVUZYTEZOQlFWTXNSMEZCUnl4SlFVRkpMRTFCUVUwN1FVRkJRVHRCUVZVeFF5eEZRVUZGTEZsQlFWa3NSVUZCUlN4TFFVRkxMRk5CUVZVc1IwRkJSenRCUVVOb1F5eE5RVUZKTEVkQlEwWXNTVUZCU1R0QlFVVk9MRTFCUVVrc1RVRkJUU3hWUVVGVkxFMUJRVTBzUTBGQlF5eERRVUZETEV0QlFVc3NUVUZCVFN4TFFVRkxMRTFCUVUwN1FVRkJSeXhWUVVGTkxFMUJRVTBzYTBKQlFXdENPMEZCUlc1R0xFMUJRVWtzUlVGQlJTeEhRVUZITzBGQlExQXNVVUZCU1N4aFFVRmhMRVZCUVVVN1FVRkRia0lzVVVGQlNTeExRVUZMTEVWQlFVVXNTVUZCU1N4SlFVRkpPMEZCUVVjc1ZVRkJTU3hGUVVGRkxFbEJRVWs3UVVGQlFTeFRRVU16UWp0QlFVTk1MRkZCUVVrN1FVRkJRVHRCUVVkT0xGTkJRVTg3UVVGQlFUdEJRVk5VTEVWQlFVVXNVVUZCVVN4WFFVRlpPMEZCUTNCQ0xFMUJRVWtzU1VGQlNTeE5RVU5PTEU5QlFVOHNSVUZCUlR0QlFVVllMRk5CUVU4c1UwRkJVeXhKUVVGSkxFdEJRVXNzU1VGQlNTeEZRVUZGTEVsQlFVa3NSMEZCUnl4TFFVRkxPMEZCUVVFN1FVRnRRamRETEVWQlFVVXNUMEZCVHl4RlFVRkZMRTFCUVUwc1YwRkJXVHRCUVVNelFpeE5RVUZKTEVsQlFVa3NTVUZEVGl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRk8wRkJSVmdzVFVGQlNTeERRVUZETEVWQlFVVTdRVUZCV1N4WFFVRlBMRWxCUVVrc1MwRkJTenRCUVVOdVF5eE5RVUZKTEVWQlFVVTdRVUZCVlN4WFFVRlBMRWxCUVVrc1MwRkJTenRCUVVWb1F5eFBRVUZMTEV0QlFVczdRVUZEVml4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExGbEJRVmtzUzBGQlN5eExRVUZMTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVc1VVRkJVVHRCUVVNNVF5eFBRVUZMTEZkQlFWYzdRVUZGYUVJc1RVRkJTU3hMUVVGTExFMUJRVTBzYVVKQlFXbENMRTFCUVUwN1FVRkZkRU1zVDBGQlN5eFpRVUZaTzBGQlEycENMRTlCUVVzc1YwRkJWenRCUVVWb1FpeFRRVUZQTEZOQlFWTXNWMEZCVnl4SlFVRkpMRVZCUVVVc1VVRkJVU3hIUVVGSExFbEJRVWtzU1VGQlNUdEJRVUZCTzBGQlowSjBSQ3hGUVVGRkxHRkJRV0VzUlVGQlJTeFBRVUZQTEZkQlFWazdRVUZEYkVNc1RVRkJTU3hIUVVGSExFZEJRVWNzU1VGQlNTeEhRVUZITEV0QlFVc3NSMEZEY0VJc1NVRkJTU3hOUVVOS0xFbEJRVWtzUlVGQlJTeEhRVU5PTEVsQlFVa3NSVUZCUlN4SFFVTk9MRWxCUVVrc1JVRkJSU3hIUVVOT0xFOUJRVThzUlVGQlJUdEJRVWRZTEUxQlFVa3NUVUZCVFN4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVVzU1VGQlNUdEJRVU14UWl4WFFVRlBMRWxCUVVrc1MwRkJTeXhEUVVGRExFdEJRVXNzU1VGQlNTeExRVUZOTEVWQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1RVRkJUU3hKUVVGSkxFbEJRVWtzU1VGQlNUdEJRVUZCTzBGQlIyeEZMR0ZCUVZjN1FVRkhXQ3hOUVVGSkxFdEJRVXNzUzBGQlN5eERRVUZETzBGQlNXWXNUVUZCU1N4TFFVRkxMRXRCUVVzc1MwRkJTeXhKUVVGSkxFZEJRVWM3UVVGRGVFSXNVVUZCU1N4bFFVRmxPMEZCUlc1Q0xGRkJRVXNzUjBGQlJTeFRRVUZUTEV0QlFVc3NTMEZCU3p0QlFVRkhMRmRCUVVzN1FVRkRiRU1zVVVGQlNTeExRVUZMTEV0QlFVczdRVUZEWkN4UlFVRkpMRlZCUVZjc1MwRkJTU3hMUVVGTExFdEJRVTBzUzBGQlNTeExRVUZMTEVsQlFVazdRVUZGTTBNc1VVRkJTU3hMUVVGTExFbEJRVWtzUjBGQlJ6dEJRVU5rTEZWQlFVa3NUMEZCVHp0QlFVRkJMRmRCUTA0N1FVRkRUQ3hWUVVGSkxFVkJRVVU3UVVGRFRpeFZRVUZKTEVWQlFVVXNUVUZCVFN4SFFVRkhMRVZCUVVVc1VVRkJVU3hQUVVGUExFdEJRVXM3UVVGQlFUdEJRVWQyUXl4UlFVRkpMRWxCUVVrc1MwRkJTenRCUVVGQkxGTkJRMUk3UVVGRFRDeFJRVUZKTEVsQlFVa3NTMEZCU3l4RlFVRkZPMEZCUVVFN1FVRkhha0lzVDBGQlRTeExRVUZKTEV0QlFVc3NZVUZCWVR0QlFVYzFRaXhoUVVGVE8wRkJRMUFzVVVGQlNUdEJRVU5LTEZGQlFVa3NSVUZCUlN4TFFVRkxMRTlCUVU4c1IwRkJSeXhIUVVGSExFdEJRVXNzUjBGQlJ5eEpRVUZKTEUxQlFVMDdRVUZITVVNc1VVRkJTU3hsUVVGbExFVkJRVVVzUjBGQlJ5eE5RVUZOTEVkQlFVY3NVVUZCVXl4TFFVRkpMR1ZCUVdVc1JVRkJSU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eExRVUZMTzBGQlF5OUZMRlZCUVVrc1JVRkJSU3hOUVVGTkxFdEJRVXNzUjBGQlJ5eExRVUZMTzBGQlNYcENMRlZCUVVrc1MwRkJTeXhWUVVGVkxFTkJRVU1zVDBGQlR5eExRVUZMTEZGQlFWRTdRVUZKZEVNc1dVRkJTU3hEUVVGRExFdEJRVXM3UVVGRFVpeHRRa0ZCVXl4SFFVRkhMRWxCUVVrc1IwRkJSenRCUVVWdVFpeGpRVUZKTEVWQlFVVXNUVUZCVFN4SFFVRkhMRWRCUVVjc1NVRkJTVHRCUVVOd1FpeG5Ra0ZCU1R0QlFVTktPMEZCUVVFN1FVRkJRVHRCUVVsS0xHTkJRVTA3UVVGRFRpeGpRVUZOTzBGQlFVRXNZVUZEUkR0QlFVbE1MRmxCUVVrc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVXNUVUZCVFN4TlFVRk5MRVZCUVVVc1QwRkJUeXhOUVVGTkxFdEJRVXM3UVVGSE4wTXNiVUpCUVZNc1IwRkJSeXhKUVVGSkxFZEJRVWM3UVVGRGJrSXNZMEZCU1N4RFFVRkRMRVZCUVVVc1RVRkJUU3hIUVVGSExFZEJRVWM3UVVGQlFUdEJRVWR5UWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0T0xHRkJRVmM3UVVGRldDeFRRVUZQTEZOQlFWTXNSMEZCUnl4SFFVRkhMRXRCUVVzc1ZVRkJWVHRCUVVGQk8wRkJhVUoyUXl4RlFVRkZMRlZCUVZVc1JVRkJSU3hOUVVGTkxGZEJRVms3UVVGRE9VSXNUVUZCU1N4SlFVRkpMRWxCUTA0c1NVRkJTU3hOUVVOS0xFOUJRVThzUlVGQlJUdEJRVVZZTEUxQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVZrc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRGJrTXNUVUZCU1N4RlFVRkZPMEZCUVZVc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRmFFTXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eFpRVUZaTEV0QlFVczdRVUZEZEVJc1QwRkJTeXhYUVVGWE8wRkJSV2hDTEUxQlFVa3NSVUZCUlR0QlFVTk9MRWxCUVVVc1NVRkJTVHRCUVVOT0xFMUJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NTMEZCU3l4SFFVRkhMRTFCUVUwc1JVRkJSU3hOUVVGTkxFbEJRVWtzVVVGQlVTeExRVUZMTEVsQlFVazdRVUZGTjBRc1QwRkJTeXhaUVVGWk8wRkJRMnBDTEU5QlFVc3NWMEZCVnp0QlFVVm9RaXhUUVVGUExGTkJRVk1zV1VGQldTeExRVUZMTEZsQlFWa3NTVUZCU1N4RlFVRkZMRkZCUVZFc1IwRkJSeXhKUVVGSkxFbEJRVWs3UVVGQlFUdEJRWGxDZUVVc1JVRkJSU3hSUVVGUkxFVkJRVVVzVFVGQlRTeFRRVUZWTEVkQlFVYzdRVUZETjBJc1RVRkJTU3hQUVVGUExFZEJRVWNzUjBGQlJ5eEhRVUZITEVkQlFVY3NTVUZCU1N4SFFVRkhMRXRCUVVzc1MwRkRha01zU1VGQlNTeE5RVU5LTEU5QlFVOHNSVUZCUlN4aFFVTlVMRXRCUVVzc1JVRkJSU3hIUVVOUUxFdEJRVTBzUzBGQlNTeEpRVUZKTEV0QlFVc3NTVUZCU1R0QlFVVjZRaXhKUVVGRkxFdEJRVXNzUlVGQlJUdEJRVWRVTEUxQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NTVUZCU1R0QlFVVnNReXhYUVVGUExFbEJRVWtzUzBGQlN5eERRVUZETEVWQlFVVXNTMEZCU3l4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zVFVGQlRTeE5RVUZOTEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1MwRkpOVVFzVFVGSlFTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hKUVVGSkxFVkJRVVVzU1VGQlNUdEJRVUZCTzBGQlIyNURMRTFCUVVrc1ZVRkJWU3hGUVVGRkxFbEJRVWtzV1VGQldTeFZRVUZWTEVWQlFVVXNTVUZCU1R0QlFVTm9SQ3hSUVVGTkxFZEJRVWM3UVVGRFZDeFJRVUZOTEVkQlFVYzdRVUZIVkN4TlFVRkpMRTFCUVUwc1MwRkJTenRCUVVOaUxGRkJRVWs3UVVGRFNpeFRRVUZMTzBGQlEwd3NVMEZCU3p0QlFVTk1MRk5CUVVzN1FVRkRUQ3hWUVVGTk8wRkJRMDRzVlVGQlRUdEJRVUZCTzBGQlNWSXNUVUZCU1R0QlFVTktMRTlCUVVzc1RVRkJUVHRCUVVOWUxFOUJRVXNzU1VGQlNTeEpRVUZKTzBGQlFVMHNUVUZCUlN4TFFVRkxPMEZCUnpGQ0xFOUJRVXNzU1VGQlNTeExRVUZMTEVWQlFVVXNTMEZCU3l4TFFVRkpPMEZCUTNaQ0xGbEJRVkU3UVVGRFVpeFRRVUZMTEVsQlFVa3NUVUZCVFN4SFFVRkhMRWxCUVVrc1MwRkJTVHRCUVVONFFpeFZRVUZKTEVWQlFVVXNTMEZCU3l4SFFVRkhMRXRCUVVzc1IwRkJSeXhKUVVGSkxFbEJRVWtzUzBGQlN6dEJRVU51UXl4UlFVRkZMRTlCUVU4c1NVRkJTU3hQUVVGUE8wRkJRM0JDTEdOQlFWRXNTVUZCU1N4UFFVRlBPMEZCUVVFN1FVRkhja0lzVFVGQlJTeExRVUZOTEVkQlFVVXNTMEZCU3l4VFFVRlRMRTlCUVU4N1FVRkJRVHRCUVVscVF5eFRRVUZQTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUVUwc1RVRkJSVHRCUVVWd1FpeE5RVUZKTzBGQlFVOHNUVUZCUlR0QlFVRkJPMEZCUTFJc1RVRkJSVHRCUVVWUUxFbEJRVVVzU1VGQlNUdEJRVU5PTEVsQlFVVXNTVUZCU1N4clFrRkJhMElzUjBGQlJ6dEJRVVV6UWl4VFFVRlBMRmRCUVZjc1UwRkJVeXhIUVVGSExFdEJRVXNzVjBGQlZ5eExRVUZMTEZsQlFWazdRVUZCUVR0QlFXTnFSU3hGUVVGRkxGZEJRVmNzVTBGQlZTeEpRVUZKTEVsQlFVazdRVUZETjBJc1UwRkJUeXhsUVVGbExFMUJRVTBzUjBGQlJ5eEpRVUZKTzBGQlFVRTdRVUZqY2tNc1JVRkJSU3hyUWtGQmEwSXNSVUZCUlN4UFFVRlBMRk5CUVZVc1NVRkJTU3hKUVVGSk8wRkJRemRETEUxQlFVa3NTVUZCU1N4TlFVTk9MRTlCUVU4c1JVRkJSVHRCUVVWWUxFMUJRVWtzU1VGQlNTeExRVUZMTzBGQlEySXNUVUZCU1N4UFFVRlBPMEZCUVZFc1YwRkJUenRCUVVVeFFpeGhRVUZYTEVsQlFVa3NSMEZCUnp0QlFVVnNRaXhOUVVGSkxFOUJRVTg3UVVGQlVTeFRRVUZMTEV0QlFVczdRVUZCUVR0QlFVTjRRaXhsUVVGWExFbEJRVWtzUjBGQlJ6dEJRVVYyUWl4VFFVRlBMRk5CUVZNc1IwRkJSeXhMUVVGTExFVkJRVVVzU1VGQlNTeEhRVUZITzBGQlFVRTdRVUZaYmtNc1JVRkJSU3huUWtGQlowSXNVMEZCVlN4SlFVRkpMRWxCUVVrN1FVRkRiRU1zVFVGQlNTeExRVU5HTEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVN1FVRkZXQ3hOUVVGSkxFOUJRVThzVVVGQlVUdEJRVU5xUWl4VlFVRk5MR1ZCUVdVc1IwRkJSenRCUVVGQkxGTkJRMjVDTzBGQlEwd3NaVUZCVnl4SlFVRkpMRWRCUVVjN1FVRkZiRUlzVVVGQlNTeFBRVUZQTzBGQlFWRXNWMEZCU3l4TFFVRkxPMEZCUVVFN1FVRkRlRUlzYVVKQlFWY3NTVUZCU1N4SFFVRkhPMEZCUlhaQ0xGRkJRVWtzVTBGQlV5eEpRVUZKTEV0QlFVc3NTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkRiRU1zVlVGQlRTeGxRVUZsTEVkQlFVY3NUVUZCVFN4TFFVRkxPMEZCUVVFN1FVRkhja01zVTBGQlR5eEZRVUZGTEZkQlFWY3NRMEZCUXl4RlFVRkZMRmRCUVZjc1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGdlFtaEVMRVZCUVVVc1ZVRkJWU3hUUVVGVkxFbEJRVWtzU1VGQlNUdEJRVU0xUWl4TlFVRkpMRXRCUVVzc1IwRkRVQ3hKUVVGSkxFMUJRMG9zVDBGQlR5eEZRVUZGTzBGQlJWZ3NUVUZCU1N4UFFVRlBMRkZCUVZFN1FVRkRha0lzVlVGQlRTeGxRVUZsTzBGQlFVRXNVMEZEYUVJN1FVRkRUQ3hsUVVGWExFbEJRVWtzUjBGQlJ6dEJRVVZzUWl4UlFVRkpMRTlCUVU4N1FVRkJVU3hYUVVGTExFdEJRVXM3UVVGQlFUdEJRVU40UWl4cFFrRkJWeXhKUVVGSkxFZEJRVWM3UVVGRmRrSXNVVUZCU1N4VFFVRlRMRWxCUVVrc1MwRkJTeXhKUVVGSkxFdEJRVXNzUlVGQlJTeEpRVUZKTEVkQlFVYzdRVUZEZUVNc1ZVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eExRVUZMTEVWQlFVVXNTVUZCU1R0QlFVRkJPMEZCU3pWRExGTkJRVThzUlVGQlJTeFhRVUZYTEVOQlFVTXNSVUZCUlN4WFFVRlhMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJaV2hFTEVWQlFVVXNZVUZCWVN4VFFVRlZMRTFCUVUwN1FVRkROMElzVFVGQlNTeEhRVUZITEVsQlFVa3NTVUZCU1N4SlFVRkpMRWRCUVVjc1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNTeEpRVUZKTEVkQlFVY3NSMEZEZWtNc1NVRkJTU3hOUVVOS0xFdEJRVXNzUlVGQlJTeEhRVU5RTEU5QlFVOHNSVUZCUlR0QlFVVllMRTFCUVVrc1EwRkJRenRCUVVGSkxGZEJRVThzU1VGQlNTeExRVUZMTzBGQlJYcENMRTlCUVVzc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGRGJrSXNUMEZCU3l4TFFVRkxMRWxCUVVrc1MwRkJTenRCUVVWdVFpeE5RVUZKTEVsQlFVa3NTMEZCU3p0QlFVTmlMRTFCUVVrc1JVRkJSU3hKUVVGSkxHRkJRV0VzVFVGQlRTeEZRVUZGTEVsQlFVazdRVUZEYmtNc1RVRkJTU3hKUVVGSk8wRkJRMUlzU1VGQlJTeEZRVUZGTEV0QlFVc3NVVUZCVVN4SlFVRkpMRWxCUVVrc1NVRkJTU3hYUVVGWExFbEJRVWs3UVVGRk5VTXNUVUZCU1N4UlFVRlJMRTFCUVUwN1FVRkhhRUlzVjBGQlR5eEpRVUZKTEVsQlFVa3NTVUZCU1R0QlFVRkJMRk5CUTJRN1FVRkRUQ3hSUVVGSkxFbEJRVWtzUzBGQlN6dEJRVU5pTEZGQlFVa3NRMEZCUXl4RlFVRkZMRmRCUVZjc1JVRkJSU3hIUVVGSE8wRkJRVXNzV1VGQlRTeE5RVUZOTEd0Q1FVRnJRanRCUVVNeFJDeFhRVUZQTEVWQlFVVXNSMEZCUnl4TFFVRk5MRWxCUVVrc1NVRkJTU3hKUVVGSkxFdEJRVTA3UVVGQlFUdEJRVWQwUXl4aFFVRlhPMEZCUTFnc1RVRkJTU3hKUVVGSkxFdEJRVXNzWlVGQlpUdEJRVU0xUWl4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExGbEJRVmtzU1VGQlNTeEhRVUZITEZOQlFWTXNWMEZCVnp0QlFVVTFReXhoUVVGVk8wRkJRMUlzVVVGQlNTeFBRVUZQTEVkQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjN1FVRkRka0lzVTBGQlN5eEhRVUZITEV0QlFVc3NSVUZCUlN4TlFVRk5PMEZCUTNKQ0xGRkJRVWtzUjBGQlJ5eEpRVUZKTEZOQlFWTTdRVUZCUnp0QlFVTjJRaXhUUVVGTE8wRkJRMHdzVTBGQlN6dEJRVU5NTEZOQlFVczdRVUZEVEN4VFFVRkxMRWRCUVVjc1MwRkJTeXhGUVVGRkxFMUJRVTA3UVVGRGNrSXNVMEZCU3p0QlFVTk1MRk5CUVVzN1FVRkRUQ3hSUVVGSkxFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMDdRVUZEY0VJc1VVRkJTVHRCUVVGQk8wRkJSMDRzVDBGQlN5eFBRVUZQTEV0QlFVc3NUVUZCVFN4TFFVRkxMRWxCUVVrc1IwRkJSeXhIUVVGSE8wRkJRM1JETEU5QlFVc3NSMEZCUnl4TFFVRkxMRWRCUVVjc1RVRkJUVHRCUVVOMFFpeFBRVUZMTEVkQlFVY3NTMEZCU3l4SFFVRkhMRTFCUVUwN1FVRkRkRUlzUzBGQlJ5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RlFVRkZPMEZCUjJoQ0xFMUJRVWtzVDBGQlR5eEpRVUZKTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTFCUVUwc1IwRkJSeXhOUVVGTkxFbEJRVWtzVDBGQlR5eEpRVUZKTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTFCUVUwc1IwRkJSeXhUUVVGVExFbEJRemRGTEVOQlFVTXNTVUZCU1N4TlFVRk5MRU5CUVVNc1NVRkJTVHRCUVVWMFFpeFBRVUZMTEZsQlFWazdRVUZEYWtJc1lVRkJWenRCUVVWWUxGTkJRVTg3UVVGQlFUdEJRV05VTEVWQlFVVXNaMEpCUVdkQ0xFVkJRVVVzVVVGQlVTeFRRVUZWTEVsQlFVa3NTVUZCU1R0QlFVTTFReXhUUVVGUExHVkJRV1VzVFVGQlRTeEpRVUZKTEVsQlFVazdRVUZCUVR0QlFXOUNkRU1zUlVGQlJTeFpRVUZaTEZOQlFWVXNSMEZCUnl4SlFVRkpPMEZCUXpkQ0xFMUJRVWtzU1VGQlNTeE5RVU5PTEU5QlFVOHNSVUZCUlR0QlFVVllMRTFCUVVrc1NVRkJTU3hMUVVGTE8wRkJSV0lzVFVGQlNTeExRVUZMTEUxQlFVMDdRVUZIWWl4UlFVRkpMRU5CUVVNc1JVRkJSVHRCUVVGSExHRkJRVTg3UVVGRmFrSXNVVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRZaXhUUVVGTExFdEJRVXM3UVVGQlFTeFRRVU5NTzBGQlEwd3NVVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRZaXhSUVVGSkxFOUJRVThzVVVGQlVUdEJRVU5xUWl4WFFVRkxMRXRCUVVzN1FVRkJRU3hYUVVOTU8wRkJRMHdzYVVKQlFWY3NTVUZCU1N4SFFVRkhPMEZCUVVFN1FVRkpjRUlzVVVGQlNTeERRVUZETEVWQlFVVTdRVUZCUnl4aFFVRlBMRVZCUVVVc1NVRkJTU3hKUVVGSk8wRkJSek5DTEZGQlFVa3NRMEZCUXl4RlFVRkZMRWRCUVVjN1FVRkRVaXhWUVVGSkxFVkJRVVU3UVVGQlJ5eFZRVUZGTEVsQlFVa3NSVUZCUlR0QlFVTnFRaXhoUVVGUE8wRkJRVUU3UVVGQlFUdEJRVXRZTEUxQlFVa3NSVUZCUlN4RlFVRkZMRWxCUVVrN1FVRkRWaXhsUVVGWE8wRkJRMWdzVVVGQlNTeFBRVUZQTEVkQlFVY3NSMEZCUnl4SFFVRkhMRWxCUVVrc1IwRkJSeXhOUVVGTk8wRkJRMnBETEdWQlFWYzdRVUZEV0N4aFFVRlRPMEZCUVVFc1UwRkhTanRCUVVOTUxFMUJRVVVzU1VGQlNTeEZRVUZGTzBGQlExSXNVVUZCU1R0QlFVRkJPMEZCUjA0c1UwRkJUenRCUVVGQk8wRkJVMVFzUlVGQlJTeFhRVUZYTEZkQlFWazdRVUZEZGtJc1UwRkJUeXhEUVVGRE8wRkJRVUU3UVVGalZpeEZRVUZGTEZWQlFWVXNVMEZCVlN4SlFVRkpMRWxCUVVrN1FVRkROVUlzVTBGQlR5eGxRVUZsTEUxQlFVMHNSMEZCUnl4SlFVRkpPMEZCUVVFN1FVRXJRM0pETEVWQlFVVXNWVUZCVlN4RlFVRkZMRTFCUVUwc1UwRkJWU3hIUVVGSE8wRkJReTlDTEUxQlFVa3NSMEZCUnl4SFFVRkhMRWxCUVVrc1IwRkJSeXhKUVVGSkxFZEJRMjVDTEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVc1lVRkRWQ3hMUVVGTExFTkJRVVVzUzBGQlNTeEpRVUZKTEV0QlFVczdRVUZIZEVJc1RVRkJTU3hEUVVGRExFVkJRVVVzUzBGQlN5eERRVUZETEVWQlFVVXNTMEZCU3l4RFFVRkRMRVZCUVVVc1JVRkJSU3hOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlFVa3NWMEZCVHl4SlFVRkpMRXRCUVVzc1VVRkJVU3hEUVVGRExFZEJRVWM3UVVGRmNFVXNUVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkZZaXhOUVVGSkxFVkJRVVVzUjBGQlJ6dEJRVUZKTEZkQlFVODdRVUZGY0VJc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eExRVUZMTzBGQlJWWXNUVUZCU1N4RlFVRkZMRWRCUVVjN1FVRkJTU3hYUVVGUExGTkJRVk1zUjBGQlJ5eEpRVUZKTzBGQlIzQkRMRTFCUVVrc1ZVRkJWU3hGUVVGRkxFbEJRVWs3UVVGSGNFSXNUVUZCU1N4TFFVRkxMRVZCUVVVc1JVRkJSU3hUUVVGVExFdEJRVTBzUzBGQlNTeExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVU4c2EwSkJRV3RDTzBGQlEzUkZMRkZCUVVrc1QwRkJUeXhOUVVGTkxFZEJRVWNzUjBGQlJ6dEJRVU4yUWl4WFFVRlBMRVZCUVVVc1NVRkJTU3hKUVVGSkxFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NTMEZCU3l4VFFVRlRMRWRCUVVjc1NVRkJTVHRCUVVGQk8wRkJSM2hFTEUxQlFVa3NSVUZCUlR0QlFVZE9MRTFCUVVrc1NVRkJTU3hIUVVGSE8wRkJSMVFzVVVGQlNTeEpRVUZKTEVWQlFVVXNSVUZCUlN4VFFVRlRPMEZCUVVjc1lVRkJUeXhKUVVGSkxFdEJRVXM3UVVGSGVFTXNVVUZCU3l4SFFVRkZMRVZCUVVVc1MwRkJTeXhOUVVGTk8wRkJRVWNzVlVGQlNUdEJRVWN6UWl4UlFVRkpMRVZCUVVVc1MwRkJTeXhMUVVGTExFVkJRVVVzUlVGQlJTeE5RVUZOTEV0QlFVc3NSVUZCUlN4RlFVRkZMRlZCUVZVc1IwRkJSenRCUVVNNVF5eFJRVUZGTEVsQlFVazdRVUZEVGl4aFFVRlBPMEZCUVVFN1FVRkJRVHRCUVZGWUxFMUJRVWtzVVVGQlVTeERRVUZETEVkQlFVYzdRVUZEYUVJc1RVRkJTU3hMUVVGTExFdEJRVXNzUTBGQlF5eFRRVUZUTEV0QlEzQkNMRlZCUVZVc1MwRkJUU3hOUVVGTExFbEJRVWtzVDBGQlR5eGxRVUZsTEVWQlFVVXNUVUZCVFN4TFFVRkxMRTlCUVU4c1JVRkJSU3hKUVVGSkxFMUJRM3BGTEVsQlFVa3NTMEZCU3l4SlFVRkpMRWxCUVVrN1FVRkxja0lzVFVGQlNTeEpRVUZKTEV0QlFVc3NUMEZCVHl4TFFVRkxMRWxCUVVrc1MwRkJTeXhQUVVGUE8wRkJRVWNzVjBGQlR5eEpRVUZKTEV0QlFVc3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTVHRCUVVVMVJTeGhRVUZYTzBGQlExZ3NUMEZCU3l4WFFVRlhMRVZCUVVVc1NVRkJTVHRCUVUxMFFpeE5RVUZKTEV0QlFVc3NTVUZCU1N4SlFVRkxMRXRCUVVrc1NVRkJTVHRCUVVjeFFpeE5RVUZKTEcxQ1FVRnRRaXhGUVVGRkxFMUJRVTBzYVVKQlFXbENMRWRCUVVjc1MwRkJTeXhMUVVGTE8wRkJSemRFTEUxQlFVa3NSVUZCUlN4SFFVRkhPMEZCUjFBc1VVRkJTU3hUUVVGVExFZEJRVWNzUzBGQlN5eEhRVUZITzBGQlNYaENMRkZCUVVrc2IwSkJRVzlDTEVWQlFVVXNSMEZCUnl4SlFVRkpMRXRCUVVzN1FVRkRjRU1zVlVGQlNTeExRVUZMTzBGQlIxUXNWVUZCU1N4VFFVRlRMRzFDUVVGdFFpeEZRVUZGTEUxQlFVMHNhVUpCUVdsQ0xFZEJRVWNzU1VGQlNTeExRVUZMTEVsQlFVa3NTVUZCU1N4SFFVRkhPMEZCUjJoR0xGVkJRVWtzUTBGQlF5eGxRVUZsTEVWQlFVVXNSMEZCUnl4TlFVRk5MRXRCUVVzc1IwRkJSeXhMUVVGTExFMUJRVTBzUzBGQlN5eE5RVUZOTzBGQlF6TkVMRmxCUVVrc1UwRkJVeXhIUVVGSExFdEJRVXNzUjBGQlJ6dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVczVRaXhKUVVGRkxFbEJRVWs3UVVGRFRpeGhRVUZYTzBGQlExZ3NUMEZCU3l4WFFVRlhPMEZCUldoQ0xGTkJRVThzVTBGQlV5eEhRVUZITEVsQlFVazdRVUZCUVR0QlFXVjZRaXhGUVVGRkxHTkJRV01zVTBGQlZTeEpRVUZKTEVsQlFVazdRVUZEYUVNc1RVRkJTU3hMUVVOR0xFbEJRVWtzVFVGRFNpeFBRVUZQTEVWQlFVVTdRVUZGV0N4TlFVRkpMRTlCUVU4c1VVRkJVVHRCUVVOcVFpeFZRVUZOTEdWQlFXVXNSMEZCUnl4RlFVRkZMRXRCUVVzc1MwRkJTeXhaUVVGWkxFVkJRVVVzUzBGQlN5eExRVUZMTzBGQlFVRXNVMEZEZGtRN1FVRkRUQ3hsUVVGWExFbEJRVWtzUjBGQlJ6dEJRVVZzUWl4UlFVRkpMRTlCUVU4N1FVRkJVU3hYUVVGTExFdEJRVXM3UVVGQlFUdEJRVU40UWl4cFFrRkJWeXhKUVVGSkxFZEJRVWM3UVVGRmRrSXNVVUZCU1N4VFFVRlRMRWxCUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWs3UVVGRE9VSXNWVUZCVFN4bFFVRmxMRWRCUVVjc1RVRkJUU3hGUVVGRkxFdEJRVXNzUlVGQlJTeExRVUZMTEV0QlFVc3NWVUZCVlR0QlFVRkJPMEZCUnpkRUxGTkJRVThzUlVGQlJTeFhRVUZYTEVOQlFVTXNSVUZCUlN4WFFVRlhMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJhMEpvUkN4RlFVRkZMSE5DUVVGelFpeEZRVUZGTEU5QlFVOHNVMEZCVlN4SlFVRkpMRWxCUVVrN1FVRkRha1FzVFVGQlNTeEpRVUZKTEUxQlEwNHNUMEZCVHl4RlFVRkZPMEZCUlZnc1RVRkJTU3hQUVVGUExGRkJRVkU3UVVGRGFrSXNVMEZCU3l4TFFVRkxPMEZCUTFZc1UwRkJTeXhMUVVGTE8wRkJRVUVzVTBGRFREdEJRVU5NTEdWQlFWY3NTVUZCU1N4SFFVRkhPMEZCUld4Q0xGRkJRVWtzVDBGQlR6dEJRVUZSTEZkQlFVc3NTMEZCU3p0QlFVRkJPMEZCUTNoQ0xHbENRVUZYTEVsQlFVa3NSMEZCUnp0QlFVRkJPMEZCUjNwQ0xGTkJRVThzVTBGQlV5eEpRVUZKTEV0QlFVc3NTVUZCU1N4SlFVRkpPMEZCUVVFN1FVRlhia01zUlVGQlJTeFhRVUZYTEZkQlFWazdRVUZEZGtJc1RVRkJTU3hKUVVGSkxFMUJRMDRzVDBGQlR5eEZRVUZGTEdGQlExUXNUVUZCVFN4bFFVRmxMRWRCUVVjc1JVRkJSU3hMUVVGTExFdEJRVXNzV1VGQldTeEZRVUZGTEV0QlFVc3NTMEZCU3p0QlFVVTVSQ3hUUVVGUExFVkJRVVVzVjBGQlZ5eERRVUZETEVWQlFVVXNWMEZCVnl4TlFVRk5MRTFCUVUwN1FVRkJRVHRCUVZGb1JDeEZRVUZGTEZsQlFWa3NSVUZCUlN4UlFVRlJMRmRCUVZrN1FVRkRiRU1zVTBGQlR5eFRRVUZUTEVsQlFVa3NTMEZCU3l4WlFVRlpMRTlCUVU4c1MwRkJTeXhKUVVGSkxFZEJRVWM3UVVGQlFUdEJRVk14UkN4RlFVRkZMRlZCUVZVc1JVRkJSU3hUUVVGVExGZEJRVms3UVVGRGFrTXNUVUZCU1N4SlFVRkpMRTFCUTA0c1QwRkJUeXhGUVVGRkxHRkJRMVFzVFVGQlRTeGxRVUZsTEVkQlFVY3NSVUZCUlN4TFFVRkxMRXRCUVVzc1dVRkJXU3hGUVVGRkxFdEJRVXNzUzBGQlN6dEJRVVU1UkN4VFFVRlBMRVZCUVVVc1ZVRkJWU3hOUVVGTkxFMUJRVTA3UVVGQlFUdEJRV2xGYWtNc2QwSkJRWGRDTEVkQlFVYzdRVUZEZWtJc1RVRkJTU3hIUVVGSExFZEJRVWNzU1VGRFVpeHJRa0ZCYTBJc1JVRkJSU3hUUVVGVExFZEJRemRDTEUxQlFVMHNTVUZEVGl4SlFVRkpMRVZCUVVVN1FVRkZVaXhOUVVGSkxHdENRVUZyUWl4SFFVRkhPMEZCUTNaQ0xGZEJRVTg3UVVGRFVDeFRRVUZMTEVsQlFVa3NSMEZCUnl4SlFVRkpMR2xDUVVGcFFpeExRVUZMTzBGQlEzQkRMRmRCUVVzc1JVRkJSU3hMUVVGTE8wRkJRMW9zVlVGQlNTeFhRVUZYTEVkQlFVYzdRVUZEYkVJc1ZVRkJTVHRCUVVGSExHVkJRVThzWTBGQll6dEJRVU0xUWl4aFFVRlBPMEZCUVVFN1FVRkhWQ3hSUVVGSkxFVkJRVVU3UVVGRFRpeFRRVUZMTEVsQlFVazdRVUZEVkN4UlFVRkpMRmRCUVZjc1IwRkJSenRCUVVOc1FpeFJRVUZKTzBGQlFVY3NZVUZCVHl4alFVRmpPMEZCUVVFc1lVRkRia0lzVFVGQlRTeEhRVUZITzBGQlEyeENMRmRCUVU4N1FVRkJRVHRCUVVsVUxGTkJRVThzU1VGQlNTeFBRVUZQTzBGQlFVa3NVMEZCU3p0QlFVVXpRaXhUUVVGUExFMUJRVTA3UVVGQlFUdEJRVWxtTEc5Q1FVRnZRaXhIUVVGSExFMUJRVXNzVFVGQlN6dEJRVU12UWl4TlFVRkpMRTFCUVUwc1EwRkJReXhEUVVGRExFdEJRVXNzU1VGQlNTeFJRVUZQTEVsQlFVa3NUVUZCU3p0QlFVTnVReXhWUVVGTkxFMUJRVTBzYTBKQlFXdENPMEZCUVVFN1FVRkJRVHRCUVZWc1F5dzJRa0ZCTmtJc1IwRkJSeXhIUVVGSExFbEJRVWtzVjBGQlZ6dEJRVU5vUkN4TlFVRkpMRWxCUVVrc1IwRkJSeXhIUVVGSE8wRkJSMlFzVDBGQlN5eEpRVUZKTEVWQlFVVXNTVUZCU1N4TFFVRkxMRWxCUVVrc1MwRkJTenRCUVVGSkxFMUJRVVU3UVVGSGJrTXNUVUZCU1N4RlFVRkZMRWxCUVVrc1IwRkJSenRCUVVOWUxGTkJRVXM3UVVGRFRDeFRRVUZMTzBGQlFVRXNVMEZEUVR0QlFVTk1MRk5CUVVzc1MwRkJTeXhMUVVGTkxFdEJRVWtzUzBGQlN6dEJRVU42UWl4VFFVRkxPMEZCUVVFN1FVRk5VQ3hOUVVGSkxGRkJRVkVzU1VGQlNTeFhRVUZYTzBGQlF6TkNMRTlCUVVzc1JVRkJSU3hOUVVGTkxFbEJRVWs3UVVGRmFrSXNUVUZCU1N4aFFVRmhMRTFCUVUwN1FVRkRja0lzVVVGQlNTeEpRVUZKTEVkQlFVYzdRVUZEVkN4VlFVRkpMRXRCUVVzN1FVRkJSeXhoUVVGTExFdEJRVXNzVFVGQlRUdEJRVUZCTEdWQlEyNUNMRXRCUVVzN1FVRkJSeXhoUVVGTExFdEJRVXNzUzBGQlN6dEJRVU5vUXl4VlFVRkpMRXRCUVVzc1MwRkJTeXhOUVVGTkxGTkJRVk1zUzBGQlN5eExRVUZMTEUxQlFVMHNVMEZCVXl4TlFVRk5MRTlCUVZNc1RVRkJUVHRCUVVGQkxGZEJRM1JGTzBGQlEwd3NWVUZCU3l4TlFVRkxMRXRCUVVzc1MwRkJTeXhMUVVGTExFdEJRVXNzUzBGQlN5eExRVUZMTEV0QlFVc3NTMEZCU3l4SlFVRkpMRTFCUTI1RUxFZEJRVVVzUzBGQlN5eExRVUZMTEVsQlFVa3NUVUZCVFN4TlFVRk5MRkZCUVZFc1NVRkJTU3hKUVVGSkxFdEJRVXNzUzBGREwwTXNUMEZCVFN4SlFVRkpMRXRCUVVzc1RVRkJUU3hOUVVGUExFZEJRVVVzUzBGQlN5eExRVUZMTEVsQlFVa3NUVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkJRU3hUUVVVeFJEdEJRVU5NTEZGQlFVa3NTVUZCU1N4SFFVRkhPMEZCUTFRc1ZVRkJTU3hMUVVGTE8wRkJRVWNzWVVGQlN5eExRVUZMTEUxQlFVODdRVUZCUVN4bFFVTndRaXhMUVVGTE8wRkJRVWNzWVVGQlN5eExRVUZMTEUxQlFVMDdRVUZCUVN4bFFVTjRRaXhMUVVGTE8wRkJRVWNzWVVGQlN5eExRVUZMTEV0QlFVczdRVUZEYUVNc1ZVRkJTeXhqUVVGaExFdEJRVXNzVFVGQlRTeE5RVUZOTEZGQlFWRXNRMEZCUXl4aFFVRmhMRXRCUVVzc1MwRkJTeXhOUVVGTk8wRkJRVUVzVjBGRGNFVTdRVUZEVEN4VlFVRk5MR1ZCUVdFc1MwRkJTeXhOUVVGTkxFdEJRVXNzUzBGQlN5eExRVU4yUXl4RFFVRkRMR0ZCUVdFc1MwRkJTeXhMUVVGTkxFdEJRVXNzUzBGQlN5eEpRVUZKTEUxQlEzSkRMRWRCUVVVc1MwRkJTeXhMUVVGTExFbEJRVWtzVFVGQlR5eE5RVUZOTEZGQlFWRXNTVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkJRVHRCUVVGQk8wRkJTWHBFTEZOQlFVODdRVUZCUVR0QlFVOVVMSEZDUVVGeFFpeExRVUZMTEZGQlFWRXNVMEZCVXp0QlFVTjZReXhOUVVGSkxFZEJRMFlzVFVGQlRTeERRVUZETEVsQlExQXNUVUZEUVN4SlFVRkpMRWRCUTBvc1QwRkJUeXhKUVVGSk8wRkJSV0lzVTBGQlR5eEpRVUZKTEZGQlFVODdRVUZEYUVJc1UwRkJTeXhQUVVGUExFbEJRVWtzVVVGQlVUdEJRVUZUTEZWQlFVa3NVMEZCVXp0QlFVTTVReXhSUVVGSkxFMUJRVTBzVTBGQlV5eFJRVUZSTEVsQlFVa3NUMEZCVHp0QlFVTjBReXhUUVVGTExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NVVUZCVVN4TFFVRkxPMEZCUXk5Q0xGVkJRVWtzU1VGQlNTeExRVUZMTEZWQlFWVXNSMEZCUnp0QlFVTjRRaXhaUVVGSkxFbEJRVWtzU1VGQlNTeFBRVUZQTzBGQlFWRXNZMEZCU1N4SlFVRkpMRXRCUVVzN1FVRkRlRU1zV1VGQlNTeEpRVUZKTEUxQlFVMHNTVUZCU1N4TFFVRkxMRlZCUVZVN1FVRkRha01zV1VGQlNTeE5RVUZOTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUzJoQ0xGTkJRVThzU1VGQlNUdEJRVUZCTzBGQlUySXNaMEpCUVdkQ0xFMUJRVTBzUjBGQlJ6dEJRVU4yUWl4TlFVRkpMRWRCUVVjc1IwRkRUQ3hOUVVGTkxFVkJRVVVzUlVGQlJUdEJRVTFhTEUxQlFVa3NUVUZCVFN4SlFVRkpPMEZCUTFvc1VVRkJTU3hMUVVGTExFdEJRVXNzVFVGQlRUdEJRVU53UWl4UlFVRkxMRXRCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWs3UVVGQlFTeFRRVU51UWp0QlFVTk1MRkZCUVVrN1FVRkRTaXhSUVVGSk8wRkJRVUU3UVVGSFRpeFBRVUZMTEdGQlFXRTdRVUZGYkVJc1RVRkJTU3hoUVVGaExFMUJRVTBzUjBGQlJ5eEZRVUZGTEUxQlFVMHNTVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkhMME1zVjBGQlV5eEpRVUZKTEVkQlFVY3NUMEZCVFR0QlFVTndRaXhSUVVGSkxGRkJRVkVzUlVGQlJTeE5RVUZOTzBGQlEzQkNMRkZCUVVrc1RVRkJUU3hOUVVGTkxFOUJRVThzVFVGQlRTeFBRVUZQTEUxQlFVMHNSMEZCUnl4TFFVRkxPMEZCUVVFN1FVRkhjRVFzVDBGQlN5eGhRVUZoTzBGQlJXeENMRk5CUVU4N1FVRkJRVHRCUVU5VUxFbEJRVWtzVTBGQlZTeFhRVUZaTzBGQlIzaENMREpDUVVGNVFpeEhRVUZITEVkQlFVY3NUVUZCVFR0QlFVTnVReXhSUVVGSkxFMUJRMFlzVVVGQlVTeEhRVU5TTEVsQlFVa3NSVUZCUlR0QlFVVlNMRk5CUVVzc1NVRkJTU3hGUVVGRkxGTkJRVk1zVDBGQlRUdEJRVU40UWl4aFFVRlBMRVZCUVVVc1MwRkJTeXhKUVVGSk8wRkJRMnhDTEZGQlFVVXNTMEZCU3l4UFFVRlBMRTlCUVU4N1FVRkRja0lzWTBGQlVTeFBRVUZQTEU5QlFVODdRVUZCUVR0QlFVZDRRaXhSUVVGSk8wRkJRVThzVVVGQlJTeFJRVUZSTzBGQlJYSkNMRmRCUVU4N1FVRkJRVHRCUVVkVUxHMUNRVUZwUWl4SFFVRkhMRWRCUVVjc1NVRkJTU3hKUVVGSk8wRkJRemRDTEZGQlFVa3NSMEZCUnp0QlFVVlFMRkZCUVVrc1RVRkJUU3hKUVVGSk8wRkJRMW9zVlVGQlNTeExRVUZMTEV0QlFVc3NTVUZCU1R0QlFVRkJMRmRCUTJJN1FVRkRUQ3hYUVVGTExFbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NTVUZCU1N4TFFVRkxPMEZCUXpOQ0xGbEJRVWtzUlVGQlJTeE5RVUZOTEVWQlFVVXNTVUZCU1R0QlFVTm9RaXhqUVVGSkxFVkJRVVVzUzBGQlN5eEZRVUZGTEV0QlFVc3NTVUZCU1R0QlFVTjBRanRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVXRPTEZkQlFVODdRVUZCUVR0QlFVZFVMRzlDUVVGclFpeEhRVUZITEVkQlFVY3NTVUZCU1N4TlFVRk5PMEZCUTJoRExGRkJRVWtzU1VGQlNUdEJRVWRTTEZkQlFVOHNVVUZCVHp0QlFVTmFMRkZCUVVVc1QwRkJUenRCUVVOVUxGVkJRVWtzUlVGQlJTeE5RVUZOTEVWQlFVVXNUVUZCVFN4SlFVRkpPMEZCUTNoQ0xGRkJRVVVzVFVGQlRTeEpRVUZKTEU5QlFVOHNSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkJRVHRCUVVrdlFpeFhRVUZQTEVOQlFVTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1UwRkJVenRCUVVGSkxGRkJRVVU3UVVGQlFUdEJRVWR1UXl4VFFVRlBMRk5CUVZVc1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNTeEpRVUZKTEUxQlFVMDdRVUZEZGtNc1VVRkJTU3hMUVVGTExFZEJRVWNzUjBGQlJ5eEhRVUZITEZOQlFWTXNUVUZCVFN4TlFVRk5MRTlCUVU4c1IwRkJSeXhKUVVGSkxFdEJRVXNzVFVGQlRTeE5RVUZOTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1MwRkRia1lzU1VGQlNTeEpRVU5LTEU5QlFVOHNSVUZCUlN4aFFVTlVMRkZCUVU4c1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeEpRVUZKTEVsQlEzaENMRXRCUVVzc1JVRkJSU3hIUVVOUUxFdEJRVXNzUlVGQlJUdEJRVWRVTEZGQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NTVUZCU1R0QlFVVnNReXhoUVVGUExFbEJRVWtzUzBGRFZDeERRVUZETEVWQlFVVXNTMEZCU3l4RFFVRkRMRVZCUVVVc1MwRkJUU3hOUVVGTExFMUJRVTBzUjBGQlJ5eE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRTFCUVUwc1RVRkhjRVFzVFVGQlRTeEhRVUZITEUxQlFVMHNTMEZCU3l4RFFVRkRMRXRCUVVzc1VVRkJUeXhKUVVGSkxGRkJRVTg3UVVGQlFUdEJRVWRvUkN4UlFVRkpMRTFCUVUwN1FVRkRVaXhuUWtGQlZUdEJRVU5XTEZWQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkJRU3hYUVVOUU8wRkJRMHdzWVVGQlR6dEJRVU5RTEdkQ1FVRlZPMEZCUTFZc1ZVRkJTU3hWUVVGVkxFVkJRVVVzU1VGQlNTeFhRVUZYTEZWQlFWVXNSVUZCUlN4SlFVRkpPMEZCUVVFN1FVRkhha1FzVTBGQlN5eEhRVUZITzBGQlExSXNVMEZCU3l4SFFVRkhPMEZCUTFJc1VVRkJTU3hKUVVGSkxFdEJRVXM3UVVGRFlpeFRRVUZMTEVWQlFVVXNTVUZCU1R0QlFVbFlMRk5CUVVzc1NVRkJTU3hIUVVGSExFZEJRVWNzVFVGQlR5eEpRVUZITEUxQlFVMHNTVUZCU1R0QlFVRkpPMEZCUlhaRExGRkJRVWtzUjBGQlJ5eExRVUZOTEVsQlFVY3NUVUZCVFR0QlFVRkpPMEZCUlRGQ0xGRkJRVWtzVFVGQlRTeE5RVUZOTzBGQlEyUXNWMEZCU3l4TFFVRkxMRXRCUVVzN1FVRkRaaXhYUVVGTExFdEJRVXM3UVVGQlFTeGxRVU5FTEVsQlFVazdRVUZEWWl4WFFVRkxMRXRCUVUwc1IwRkJSU3hKUVVGSkxFVkJRVVVzUzBGQlN6dEJRVUZCTEZkQlEyNUNPMEZCUTB3c1YwRkJTenRCUVVGQk8wRkJSMUFzVVVGQlNTeExRVUZMTEVkQlFVYzdRVUZEVml4VFFVRkhMRXRCUVVzN1FVRkRVaXhoUVVGUE8wRkJRVUVzVjBGRFJqdEJRVWRNTEZkQlFVc3NTMEZCU3l4VlFVRlZMRWxCUVVrN1FVRkRlRUlzVlVGQlNUdEJRVWRLTEZWQlFVa3NUVUZCVFN4SFFVRkhPMEZCUTFnc1dVRkJTVHRCUVVOS0xHRkJRVXNzUjBGQlJ6dEJRVU5TTzBGQlIwRXNaVUZCVVN4TFFVRkpMRTFCUVUwc1RVRkJUU3hOUVVGTkxFdEJRVXM3UVVGRGFrTXNZMEZCU1N4SlFVRkpMRTlCUVZFc1NVRkJSeXhOUVVGTk8wRkJRM3BDTEdGQlFVY3NTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRkRha0lzWTBGQlNTeEpRVUZKTEV0QlFVczdRVUZCUVR0QlFVZG1MR1ZCUVU4c1MwRkJTeXhKUVVGSk8wRkJRVUVzWVVGSFdEdEJRVWRNTEZsQlFVa3NUMEZCVVN4SlFVRkhMRXRCUVVzc1MwRkJTenRCUVVWNlFpeFpRVUZKTEVsQlFVa3NSMEZCUnp0QlFVTlVMR1ZCUVVzc1owSkJRV2RDTEVsQlFVa3NSMEZCUnp0QlFVTTFRaXhsUVVGTExHZENRVUZuUWl4SlFVRkpMRWRCUVVjN1FVRkROVUlzWlVGQlN5eEhRVUZITzBGQlExSXNaVUZCU3l4SFFVRkhPMEZCUVVFN1FVRkhWaXhoUVVGTE8wRkJRMHdzWTBGQlRTeEhRVUZITEUxQlFVMHNSMEZCUnp0QlFVTnNRaXhsUVVGUExFbEJRVWs3UVVGSFdDeGxRVUZQTEU5QlFVODdRVUZCU3l4alFVRkpMRlZCUVZVN1FVRkZha01zWVVGQlN5eEhRVUZITzBGQlExSXNWMEZCUnl4UlFVRlJPMEZCUTFnc1kwRkJUU3hIUVVGSE8wRkJSVlFzV1VGQlNTeEhRVUZITEUxQlFVMHNUMEZCVHp0QlFVRkhMRmxCUVVVN1FVRkZla0lzVjBGQlJ6dEJRVU5FTEdOQlFVazdRVUZIU2l4blFrRkJUU3hSUVVGUkxFbEJRVWtzUzBGQlN5eEpRVUZKTzBGQlJ6TkNMR05CUVVrc1RVRkJUU3hIUVVGSE8wRkJSMWdzYlVKQlFVOHNTVUZCU1R0QlFVTllMR2RDUVVGSkxFMUJRVTA3UVVGQlRTeHhRa0ZCVHl4UFFVRlBMRTlCUVZFc1MwRkJTU3hOUVVGTk8wRkJSMmhFTEdkQ1FVRkpMRTlCUVU4c1RVRkJUVHRCUVZWcVFpeG5Ra0ZCU1N4SlFVRkpMRWRCUVVjN1FVRkRWQ3hyUWtGQlNTeExRVUZMTzBGQlFVMHNiMEpCUVVrc1QwRkJUenRCUVVjeFFpeHhRa0ZCVHl4blFrRkJaMElzU1VGQlNTeEhRVUZITzBGQlF6bENMSE5DUVVGUkxFdEJRVXM3UVVGRFlpeHhRa0ZCVHl4SlFVRkpPMEZCUjFnc2IwSkJRVTBzVVVGQlVTeE5RVUZOTEV0QlFVc3NUMEZCVHp0QlFVZG9ReXhyUWtGQlNTeFBRVUZQTEVkQlFVYzdRVUZEV2p0QlFVZEJMSGxDUVVGVExFMUJRVTBzUzBGQlN5eFJRVUZSTEV0QlFVc3NTVUZCU1N4UFFVRlBPMEZCUVVFN1FVRkJRU3h0UWtGRmVrTTdRVUZMVEN4clFrRkJTU3hMUVVGTE8wRkJRVWNzYzBKQlFVMHNTVUZCU1R0QlFVTjBRaXh4UWtGQlR5eEhRVUZITzBGQlFVRTdRVUZIV2l4dlFrRkJVU3hMUVVGTE8wRkJRMklzWjBKQlFVa3NVVUZCVVR0QlFVRk5MRzFDUVVGTExGRkJRVkU3UVVGSEwwSXNjVUpCUVZNc1MwRkJTeXhOUVVGTkxFMUJRVTA3UVVGSE1VSXNaMEpCUVVrc1QwRkJUeXhKUVVGSk8wRkJRMklzY1VKQlFVOHNTVUZCU1R0QlFVZFlMRzlDUVVGTkxGRkJRVkVzU1VGQlNTeExRVUZMTEVsQlFVazdRVUZITTBJc2EwSkJRVWtzVFVGQlRTeEhRVUZITzBGQlExZzdRVUZIUVN4NVFrRkJVeXhMUVVGTExFdEJRVXNzVDBGQlR5eExRVUZMTEVsQlFVa3NUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkpOME1zYlVKQlFVOHNTVUZCU1R0QlFVRkJMSEZDUVVOR0xGRkJRVkVzUjBGQlJ6dEJRVU53UWp0QlFVTkJMR3RDUVVGTkxFTkJRVU03UVVGQlFUdEJRVWxVTEdGQlFVY3NUMEZCVHp0QlFVZFdMR05CUVVrc1QwRkJUeXhKUVVGSkxFbEJRVWs3UVVGRGFrSXNaMEpCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVTg3UVVGQlFTeHBRa0ZEYmtJN1FVRkRUQ3hyUWtGQlRTeERRVUZETEVkQlFVYzdRVUZEVml4dFFrRkJUenRCUVVGQk8wRkJRVUVzYVVKQlIwUXNVVUZCVHl4TlFVRk5MRWxCUVVrc1QwRkJUeXhYUVVGWE8wRkJSVGRETEdWQlFVOHNTVUZCU1N4UFFVRlBPMEZCUVVFN1FVRkpjRUlzVlVGQlNTeERRVUZETEVkQlFVYzdRVUZCU1N4WFFVRkhPMEZCUVVFN1FVRkpha0lzVVVGQlNTeFhRVUZYTEVkQlFVYzdRVUZEYUVJc1VVRkJSU3hKUVVGSk8wRkJRMDRzWjBKQlFWVTdRVUZCUVN4WFFVTk1PMEZCUjB3c1YwRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVUZITEVsQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRkJTVHRCUVVONlF5eFJRVUZGTEVsQlFVa3NTVUZCU1N4SlFVRkpMRlZCUVZVN1FVRkZlRUlzWlVGQlV5eEhRVUZITEV0QlFVc3NTMEZCU3l4RlFVRkZMRWxCUVVrc1NVRkJTU3hKUVVGSkxFbEJRVWs3UVVGQlFUdEJRVWN4UXl4WFFVRlBPMEZCUVVFN1FVRkJRVHRCUVZOV0xHdENRVUZyUWl4SFFVRkhMRWxCUVVrc1NVRkJTU3hoUVVGaE8wRkJRM3BETEUxQlFVa3NVVUZCVVN4SFFVRkhMRWRCUVVjc1IwRkJSeXhKUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEV0QlEzWkRMRTlCUVU4c1JVRkJSVHRCUVVkWU8wRkJRVXNzVVVGQlNTeE5RVUZOTEUxQlFVMDdRVUZEYmtJc1YwRkJTeXhGUVVGRk8wRkJSMUFzVlVGQlNTeERRVUZETzBGQlFVa3NaVUZCVHp0QlFWZG9RaXhYUVVGTExGTkJRVk1zUjBGQlJ5eEpRVUZKTEVkQlFVY3NTVUZCU1N4TFFVRkxMRWxCUVVrc1MwRkJTenRCUVVGSk8wRkJRemxETEZWQlFVa3NTMEZCU3p0QlFVZFVMRlZCUVVrc1NVRkJTU3hIUVVGSE8wRkJRMVFzWVVGQlN6dEJRVU5NTEZsQlFVazdRVUZEU2l4WlFVRkpMRWRCUVVjc1RVRkJUVHRCUVVkaUxHRkJRVXNzU1VGQlNTeFJRVUZSTEVsQlFVa3NVMEZCVXl4SlFVRkpMRXRCUVVzc1MwRkJTenRCUVVGQkxHRkJRM1pETzBGQlEwd3NZMEZCVFN4TFFVRkxMRXRCUVUwc1MwRkJTU3hMUVVGTE8wRkJRekZDTEZsQlFVa3NSMEZCUnp0QlFVTlFMRmxCUVVrc1QwRkJUeXhIUVVGSE8wRkJRMW9zWTBGQlNTeGhRVUZoTzBGQlIyWXNiVUpCUVU4c1QwRkJUenRCUVVGTkxHbENRVUZITEV0QlFVczdRVUZETlVJc1owSkJRVWtzUzBGQlN6dEJRVU5VTEhGQ1FVRlRPMEZCUTFRc2FVSkJRVXM3UVVGRFRDeG5Ra0ZCU1N4SlFVRkpMRmRCUVZjN1FVRkJRU3hwUWtGRFpEdEJRVU5NTzBGQlFVRTdRVUZCUVN4bFFVVkhPMEZCUTB3c1kwRkJTU3hKUVVGSkxFZEJRVWM3UVVGSFdDeGxRVUZMTEZOQlFWTXNSMEZCUnl4TFFVRkxMRWxCUVVrc1MwRkJTenRCUVVGSk8wRkJSMjVETEdWQlFVczdRVUZKVEN4alFVRkpMRWxCUVVrc1YwRkJWenRCUVVkdVFpeGxRVUZMTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1VVRkJVU3hKUVVGSkxGTkJRVk1zU1VGQlNTeExRVUZMTEV0QlFVczdRVUZCUVR0QlFVRkJPMEZCU3pWRUxHOUNRVUZqTEdWQlFXVXNTMEZCU3l4TFFVTm9ReXhIUVVGSExFMUJRVTBzVDBGQlR5eFZRVUZYTEV0QlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1VVRkJVU3hKUVVGSkxGTkJRVk1zU1VGQlNUdEJRVTEwUlN4blFrRkJWU3hMUVVGTExFbEJRMVlzVDBGQlRTeG5Ra0ZCYVVJc1QwRkJUU3hMUVVGTExFMUJRVThzUjBGQlJTeEpRVUZKTEVsQlFVa3NTVUZCU1N4TlFVTjRSQ3hMUVVGTExFdEJRVXNzVFVGQlRTeExRVUZOTEU5QlFVMHNTMEZCU3l4bFFVRmxMRTFCUVUwc1MwRkhjRVFzUzBGQlNTeEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVRkpMRkZCUVZFc1NVRkJTU3hUUVVGVExFdEJRVXNzU1VGQlNTeEhRVUZITEUxQlFVMHNUVUZCVFN4TFFVRk5MRXRCUTNaRkxFMUJRVThzUjBGQlJTeEpRVUZKTEVsQlFVa3NTVUZCU1R0QlFVVXpRaXhWUVVGSkxFdEJRVXNzUzBGQlN5eERRVUZETEVkQlFVY3NTVUZCU1R0QlFVTndRaXhYUVVGSExGTkJRVk03UVVGRFdpeFpRVUZKTEZOQlFWTTdRVUZIV0N4blFrRkJUU3hGUVVGRkxFbEJRVWs3UVVGSFdpeGhRVUZITEV0QlFVc3NVVUZCVVN4SlFVRkxMRmxCUVZjc1MwRkJTeXhaUVVGWk8wRkJRMnBFTEZsQlFVVXNTVUZCU1N4RFFVRkRMRTFCUVUwN1FVRkJRU3hsUVVOU08wRkJSMHdzWVVGQlJ5eExRVUZMTEVWQlFVVXNTVUZCU1R0QlFVRkJPMEZCUjJoQ0xHVkJRVTg3UVVGQlFUdEJRVWxVTEZWQlFVa3NTMEZCU3l4SFFVRkhPMEZCUTFZc1YwRkJSeXhUUVVGVE8wRkJRMW9zV1VGQlNUdEJRVU5LTzBGQlFVRXNZVUZEU3p0QlFVTk1MRmRCUVVjc1UwRkJVeXhOUVVGTk8wRkJRMnhDTEZsQlFVa3NVVUZCVVN4SlFVRkpMRmRCUVZjN1FVRkpNMElzVjBGQlJ5eFBRVUZQTEVsQlFVa3NTVUZCU3l4TFFVRkpMRkZCUVZFc1NVRkJTU3hUUVVGVExFdEJRVXNzVVVGQlVTeEpRVUZKTEV0QlFVc3NTMEZCU3l4SlFVRkpPMEZCUVVFN1FVRkhOMFVzVlVGQlNTeFRRVUZUTzBGQlExZ3NiVUpCUVZNN1FVRkhVQ3hqUVVGSkxFOUJRVThzUjBGQlJ6dEJRVWRhTEdsQ1FVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxFZEJRVWNzU1VGQlNTeExRVUZMTEVsQlFVa3NTMEZCU3p0QlFVRkpPMEZCUTNwRExHZENRVUZKTEVkQlFVY3NUVUZCVFR0QlFVTmlMR2xDUVVGTExFbEJRVWtzUjBGQlJ5eExRVUZMTEVsQlFVa3NTMEZCU3p0QlFVRkpPMEZCUnpsQ0xHZENRVUZKTEV0QlFVc3NSMEZCUnp0QlFVTldMR2RDUVVGRk8wRkJRMFlzYTBKQlFVa3NSMEZCUnl4TlFVRk5PMEZCUVUwc2JVSkJRVWNzUzBGQlN6dEJRVUZCTzBGQlJ6ZENPMEZCUVVFc2FVSkJRMHM3UVVGRFRDeGxRVUZITEZGQlFWRTdRVUZEV0N4blFrRkJTU3hIUVVGSExGRkJRVkU3UVVGQlRUdEJRVU55UWl4bFFVRkhMRk5CUVZNN1FVRkRXaXhuUWtGQlNUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVMVdMRmRCUVVzc1NVRkJTU3hIUVVGSExGRkJRVkVzUjBGQlJ5eEZRVUZGTEU5QlFVODdRVUZCU1N4WFFVRkhPMEZCUVVFN1FVRkhla01zVFVGQlNTeFZRVUZWTzBGQlIxb3NVVUZCU1N4RlFVRkZMRWxCUVVrc1MwRkJTeXhOUVVGTk8wRkJSMjVDTEZGQlFVVXNTVUZCU1R0QlFVTk9MRkZCUVVVc1NVRkJTVHRCUVVGQkxHVkJSMGNzUlVGQlJTeEpRVUZKTEV0QlFVc3NUVUZCVFR0QlFVY3hRaXhSUVVGRkxFbEJRVWs3UVVGRFRpeFJRVUZGTEVsQlFVa3NRMEZCUXp0QlFVRkJPMEZCUVVFN1FVRkxXQ3hUUVVGUE8wRkJRVUU3UVVGSlZDeDNRa0ZCZDBJc1IwRkJSeXhQUVVGUExFbEJRVWs3UVVGRGNFTXNUVUZCU1N4RFFVRkRMRVZCUVVVN1FVRkJXU3hYUVVGUExHdENRVUZyUWp0QlFVTTFReXhOUVVGSkxFZEJRMFlzU1VGQlNTeEZRVUZGTEVkQlEwNHNUVUZCVFN4bFFVRmxMRVZCUVVVc1NVRkRka0lzVFVGQlRTeEpRVUZKTzBGQlJWb3NUVUZCU1N4UFFVRlBPMEZCUTFRc1VVRkJTU3hOUVVGUExFdEJRVWtzUzBGQlN5eFBRVUZQTEVkQlFVYzdRVUZETlVJc1dVRkJUU3hKUVVGSkxFOUJRVThzUzBGQlN5eE5RVUZOTEVsQlFVa3NUVUZCVFN4TFFVRkxMR05CUVdNN1FVRkJRU3hsUVVOb1JDeE5RVUZOTEVkQlFVYzdRVUZEYkVJc1dVRkJUU3hKUVVGSkxFOUJRVThzUzBGQlN5eE5RVUZOTEVsQlFVa3NUVUZCVFR0QlFVRkJPMEZCUjNoRExGVkJRVTBzVFVGQlR5eEhRVUZGTEVsQlFVa3NTVUZCU1N4TlFVRk5MRkZCUVZFc1JVRkJSVHRCUVVGQkxHRkJRemxDTEVsQlFVa3NSMEZCUnp0QlFVTm9RaXhWUVVGTkxFOUJRVThzWTBGQll5eERRVUZETEVsQlFVa3NTMEZCU3p0QlFVTnlReXhSUVVGSkxFMUJRVThzUzBGQlNTeExRVUZMTEU5QlFVODdRVUZCUnl4aFFVRlBMR05CUVdNN1FVRkJRU3hoUVVNeFF5eExRVUZMTEV0QlFVczdRVUZEYmtJc1YwRkJUeXhqUVVGakxFbEJRVWtzU1VGQlNUdEJRVU0zUWl4UlFVRkpMRTFCUVU4c1MwRkJTU3hMUVVGTExFbEJRVWtzUzBGQlN6dEJRVUZITEZsQlFVMHNUVUZCVFN4TlFVRk5MR05CUVdNN1FVRkJRU3hUUVVNelJEdEJRVU5NTEZGQlFVc3NTMEZCU1N4SlFVRkpMRXRCUVVzN1FVRkJTeXhaUVVGTkxFbEJRVWtzVFVGQlRTeEhRVUZITEV0QlFVc3NUVUZCVFN4SlFVRkpMRTFCUVUwN1FVRkRMMFFzVVVGQlNTeE5RVUZQTEV0QlFVa3NTMEZCU3l4UFFVRlBMRWRCUVVjN1FVRkROVUlzVlVGQlNTeEpRVUZKTEUxQlFVMDdRVUZCU3l4bFFVRlBPMEZCUXpGQ0xHRkJRVThzWTBGQll6dEJRVUZCTzBGQlFVRTdRVUZKZWtJc1UwRkJUenRCUVVGQk8wRkJTMVFzTWtKQlFUSkNMRkZCUVZFc1IwRkJSenRCUVVOd1F5eE5RVUZKTEVsQlFVa3NUMEZCVHp0QlFVZG1MRTlCUVUwc1MwRkJTeXhWUVVGVkxFdEJRVXNzU1VGQlNTeExRVUZMTzBGQlFVazdRVUZEZGtNc1UwRkJUenRCUVVGQk8wRkJTVlFzYVVKQlFXbENMRTFCUVUwc1NVRkJTU3hKUVVGSk8wRkJRemRDTEUxQlFVa3NTMEZCU3l4blFrRkJaMEk3UVVGSGRrSXNaVUZCVnp0QlFVTllMRkZCUVVrN1FVRkJTU3hYUVVGTExGbEJRVms3UVVGRGVrSXNWVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkZaQ3hUUVVGUExGTkJRVk1zU1VGQlNTeExRVUZMTEU5QlFVOHNTVUZCU1N4SFFVRkhPMEZCUVVFN1FVRkpla01zWlVGQlpTeE5RVUZOTEVsQlFVa3NTVUZCU1R0QlFVTXpRaXhOUVVGSkxFdEJRVXM3UVVGQll5eFZRVUZOTEUxQlFVMDdRVUZEYmtNc1UwRkJUeXhUUVVGVExFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCU1hoRExITkNRVUZ6UWl4UlFVRlJPMEZCUXpWQ0xFMUJRVWtzU1VGQlNTeFBRVUZQTEZOQlFWTXNSMEZEZEVJc1RVRkJUU3hKUVVGSkxGZEJRVmM3UVVGRmRrSXNUVUZCU1N4UFFVRlBPMEZCUjFnc1RVRkJTU3hIUVVGSE8wRkJSMHdzVjBGQlR5eEpRVUZKTEUxQlFVMHNSMEZCUnl4TFFVRkxPMEZCUVVrN1FVRkhOMElzVTBGQlN5eEpRVUZKTEU5QlFVOHNTVUZCU1N4TFFVRkxMRWxCUVVrc1MwRkJTenRCUVVGSk8wRkJRVUU3UVVGSGVFTXNVMEZCVHp0QlFVRkJPMEZCU1ZRc2RVSkJRWFZDTEVkQlFVYzdRVUZEZUVJc1RVRkJTU3hMUVVGTE8wRkJRMVFzVTBGQlR6dEJRVUZOTEZWQlFVMDdRVUZEYmtJc1UwRkJUenRCUVVGQk8wRkJWMVFzWjBKQlFXZENMRTFCUVUwc1IwRkJSeXhIUVVGSExFbEJRVWs3UVVGRE9VSXNUVUZCU1N4aFFVTkdMRWxCUVVrc1NVRkJTU3hMUVVGTExFbEJTV0lzU1VGQlNTeExRVUZMTEV0QlFVc3NTMEZCU3l4WFFVRlhPMEZCUldoRExHRkJRVmM3UVVGRldDeGhRVUZUTzBGQlExQXNVVUZCU1N4SlFVRkpMRWRCUVVjN1FVRkRWQ3hWUVVGSkxFVkJRVVVzVFVGQlRUdEJRVU5hTEZWQlFVa3NVMEZCVXl4RlFVRkZMRWRCUVVjN1FVRkJTU3h6UWtGQll6dEJRVUZCTzBGQlIzUkRMRkZCUVVrc1ZVRkJWU3hKUVVGSk8wRkJRMnhDTEZGQlFVa3NUVUZCVFN4SFFVRkhPMEZCUjFnc1ZVRkJTU3hGUVVGRkxFVkJRVVVzVTBGQlV6dEJRVU5xUWl4VlFVRkpMR1ZCUVdVc1JVRkJSU3hGUVVGRkxFOUJRVTg3UVVGQlJ5eFZRVUZGTEVWQlFVVXNSVUZCUlR0QlFVTjJRenRCUVVGQk8wRkJSMFlzVVVGQlNTeEZRVUZGTEUxQlFVMDdRVUZEV2l4aFFVRlRMRVZCUVVVc1IwRkJSenRCUVVGQk8wRkJSMmhDTEdGQlFWYzdRVUZGV0N4VFFVRlBPMEZCUVVFN1FVRkpWQ3hsUVVGbExFZEJRVWM3UVVGRGFFSXNVMEZCVHl4RlFVRkZMRVZCUVVVc1JVRkJSU3hGUVVGRkxGTkJRVk1zUzBGQlN6dEJRVUZCTzBGQlR5OUNMR3RDUVVGclFpeE5RVUZOTEUxQlFVMHNUVUZCVFR0QlFVTnNReXhOUVVGSkxFZEJRMFlzU1VGQlNTeEpRVUZKTEV0QlFVc3NTMEZCU3l4TFFVTnNRaXhKUVVGSk8wRkJSVTRzVTBGQlR5eEZRVUZGTEVsQlFVa3NTMEZCU3l4VlFVRlRPMEZCUTNwQ0xGRkJRVWtzU1VGQlNTeExRVUZMTEV0QlFVczdRVUZEYkVJc1VVRkJTU3hEUVVGRExFVkJRVVVzUjBGQlJ6dEJRVU5TTEZWQlFVazdRVUZEU2p0QlFVRkJMR1ZCUTFNc1JVRkJSU3hOUVVGTkxFbEJRVWs3UVVGRGNrSXNWVUZCU1R0QlFVRkJPMEZCUVVFN1FVRkpVaXhUUVVGUE8wRkJRVUU3UVVGdFExUXNORUpCUVRSQ0xFZEJRVWNzU1VGQlNUdEJRVU5xUXl4TlFVRkpMR0ZCUVdFc1QwRkJUeXhIUVVGSExFMUJRVXNzUzBGQlN5eEhRVUZITEV0QlEzUkRMRTFCUVUwc1IwRkRUaXhKUVVGSkxFZEJRMG9zU1VGQlNTeEhRVU5LTEU5QlFVOHNSVUZCUlN4aFFVTlVMRXRCUVVzc1MwRkJTeXhWUVVOV0xFdEJRVXNzUzBGQlN6dEJRVWRhTEUxQlFVa3NRMEZCUXl4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxFVkJRVVVzVFVGQlRTeEZRVUZGTEVsQlFVa3NTVUZCU1R0QlFVVXZRaXhYUVVGUExFbEJRVWtzUzBGQlN5eEZRVUZGTEVsQlEyUXNRMEZCUXl4RlFVRkZMRVZCUVVVc1MwRkJTeXhKUVVGSkxFVkJRVVVzU1VGQlNTeEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVTm9ReXhGUVVGRkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrN1FVRkJRVHRCUVVkc1F5eE5RVUZKTEUxQlFVMHNUVUZCVFR0QlFVTmtMR1ZCUVZjN1FVRkRXQ3hWUVVGTk8wRkJRVUVzVTBGRFJEdEJRVU5NTEZWQlFVMDdRVUZCUVR0QlFVZFNMRTFCUVVrc1NVRkJTU3hMUVVGTE8wRkJSMklzVTBGQlR5eEZRVUZGTEVsQlFVa3NTVUZCU1R0QlFVZG1MRkZCUVVrc1JVRkJSU3hOUVVGTk8wRkJRMW9zVTBGQlN6dEJRVUZCTzBGQlMxQXNWVUZCVVN4TFFVRkxMRWxCUVVrc1VVRkJVU3hIUVVGSExFMUJRVTBzUzBGQlN5eFBRVUZQTEVsQlFVa3NTVUZCU1R0QlFVTjBSQ3hUUVVGUE8wRkJRMUFzWjBKQlFXTXNUMEZCVFN4TlFVRk5MRWxCUVVrc1MwRkJTenRCUVVOdVF5eFBRVUZMTEZsQlFWazdRVUZGYWtJc1lVRkJVenRCUVVOUUxGZEJRVTBzVTBGQlV5eExRVUZKTEUxQlFVMHNTVUZCU1N4TFFVRkxPMEZCUTJ4RExHdENRVUZqTEZsQlFWa3NUVUZCVFN4RlFVRkZPMEZCUTJ4RExGRkJRVWtzU1VGQlNTeExRVUZMTEU5QlFVOHNUVUZCU3l4aFFVRmhMRXRCUVVzN1FVRkZNME1zVVVGQlNTeGxRVUZsTEVWQlFVVXNSMEZCUnl4TlFVRk5MRWRCUVVjc1UwRkJVeXhsUVVGbExFbEJRVWtzUjBGQlJ5eE5RVUZOTEVkQlFVY3NUVUZCVFR0QlFVTTNSU3hWUVVGSk8wRkJRMG9zWVVGQlR6dEJRVUZMTEdOQlFVMHNVMEZCVXl4SlFVRkpMRTFCUVUwc1RVRkJUU3hMUVVGTE8wRkJUMmhFTEZWQlFVa3NUVUZCVFN4TlFVRk5PMEZCUldRc1dVRkJTU3hOUVVGTkxFdEJRVXNzYjBKQlFXOUNMRWxCUVVrc1IwRkJSeXhOUVVGTkxFOUJRVThzU1VGQlNTeE5RVUZOTzBGQlF5OUVMR1ZCUVVzc1dVRkJXU3hQUVVGUE8wRkJRM2hDTEhkQ1FVRmpMRTlCUVUwc1NVRkJTU3hKUVVGSkxFdEJRVXM3UVVGRGFrTXNZMEZCU1R0QlFVTktPMEZCUVVFc1pVRkRTenRCUVVOTUxHbENRVUZQTEZOQlFWTXNTMEZCU3l4TFFVRkxMRmxCUVZrc1NVRkJTU3hKUVVGSkxGZEJRVmM3UVVGQlFUdEJRVUZCTEdGQlJYUkVPMEZCUTB3c1lVRkJTeXhaUVVGWk8wRkJRMnBDTEdWQlFVODdRVUZCUVR0QlFVRkJPMEZCU1Znc1ZVRkJUVHRCUVVGQk8wRkJRVUU3UVVGdlFsWXNNRUpCUVRCQ0xFZEJRVWNzU1VGQlNUdEJRVU12UWl4TlFVRkpMRWRCUVVjc1NVRkJTU3hoUVVGaExFZEJRVWNzVjBGQlZ5eExRVUZMTEV0QlFVc3NSMEZCUnl4TFFVRkxMRWxCUVVrc1NVRkRNVVFzU1VGQlNTeEhRVU5LTEZGQlFWRXNTVUZEVWl4SlFVRkpMRWRCUTBvc1MwRkJTeXhGUVVGRkxFZEJRMUFzVDBGQlR5eEZRVUZGTEdGQlExUXNTMEZCU3l4TFFVRkxMRlZCUTFZc1MwRkJTeXhMUVVGTE8wRkJSMW9zVFVGQlNTeEZRVUZGTEVsQlFVa3NTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFMUJRVTBzUTBGQlF5eEZRVUZGTEV0QlFVc3NSMEZCUnl4TlFVRk5MRXRCUVVzc1IwRkJSeXhWUVVGVkxFZEJRVWM3UVVGRGNFVXNWMEZCVHl4SlFVRkpMRXRCUVVzc1RVRkJUU3hEUVVGRExFZEJRVWNzUzBGQlN5eExRVUZMTEVsQlFVa3NSVUZCUlN4TFFVRkxMRWxCUVVrc1RVRkJUU3hMUVVGTExFbEJRVWs3UVVGQlFUdEJRVWR3UlN4TlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVOa0xHVkJRVmM3UVVGRFdDeFZRVUZOTzBGQlFVRXNVMEZEUkR0QlFVTk1MRlZCUVUwN1FVRkJRVHRCUVVkU0xFOUJRVXNzV1VGQldTeFBRVUZQTzBGQlEzaENMRTFCUVVrc1pVRkJaVHRCUVVOdVFpeFBRVUZMTEVWQlFVVXNUMEZCVHp0QlFVVmtMRTFCUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWtzUlVGQlJTeExRVUZMTEU5QlFWRTdRVUZoT1VJc1YwRkJUeXhMUVVGTExFdEJRVXNzVFVGQlRTeExRVUZMTEUxQlFVMHNTMEZCU3l4RlFVRkZMRTlCUVU4c1MwRkJTeXhIUVVGSE8wRkJRM1JFTEZWQlFVa3NSVUZCUlN4TlFVRk5PMEZCUTFvc1ZVRkJTU3hsUVVGbExFVkJRVVU3UVVGRGNrSXNWMEZCU3l4RlFVRkZMRTlCUVU4N1FVRkRaRHRCUVVGQk8wRkJSMFlzVVVGQlNTeEZRVUZGTzBGQlJVNHNVVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkRWaXhWUVVGSkxFbEJRVWtzUzBGQlN5eFBRVUZQTzBGQlEzQkNPMEZCUVVFc1YwRkRTenRCUVVOTUxGVkJRVWtzU1VGQlNTeExRVUZMTEV0QlFVc3NUVUZCVFN4RlFVRkZMRTFCUVUwN1FVRkJRVHRCUVVGQkxGTkJSVGRDTzBGQlMwd3NVVUZCU1N4UlFVRlJMRTFCUVUwc1RVRkJUU3hIUVVGSExFbEJRVWtzVFVGQlRTeEpRVUZKTzBGQlEzcERMRkZCUVVrc2FVSkJRV2xDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTFCUVUwc1JVRkJSU3hOUVVGTkxFdEJRVXNzVFVGQlRTeFBRVUZQTEV0QlFVczdRVUZEZUVVc1UwRkJTeXhaUVVGWk8wRkJSV3BDTEZkQlFVOHNUVUZCVFN4UFFVRlBMRk5CUVZNc1IwRkJSeXhKUVVGSkxFbEJRVWtzVjBGQlZ5eFJRVUZSTzBGQlFVRTdRVUZKTjBRc1QwRkJTenRCUVV0TUxGRkJRVTBzV1VGQldTeEpRVUZKTEU5QlFVOHNSVUZCUlN4TlFVRk5MRWxCUVVrc1JVRkJSU3hMUVVGTExFbEJRVWtzUzBGQlN6dEJRVU42UkN4UFFVRkxMRk5CUVZNc1JVRkJSU3hOUVVGTkxFbEJRVWtzUzBGQlN6dEJRVU12UWl4blFrRkJZenRCUVVWa0xHRkJRVk03UVVGRFVDeG5Ra0ZCV1N4VFFVRlRMRlZCUVZVc1RVRkJUU3hMUVVGTExFdEJRVXM3UVVGREwwTXNVVUZCU1N4SlFVRkpMRXRCUVVzc1QwRkJUeXhYUVVGWExFbEJRVWtzUzBGQlN5eGpRVUZqTEV0QlFVczdRVUZGTTBRc1VVRkJTU3hsUVVGbExFVkJRVVVzUjBGQlJ5eE5RVUZOTEVkQlFVY3NVMEZCVXl4bFFVRmxMRWxCUVVrc1IwRkJSeXhOUVVGTkxFZEJRVWNzVFVGQlRUdEJRVU0zUlN4WlFVRk5MRWxCUVVrc1RVRkJUVHRCUVVsb1FpeFZRVUZKTEUxQlFVMDdRVUZCUnl4alFVRk5MRWxCUVVrc1MwRkJTeXhSUVVGUkxFMUJRVTBzVFVGQlRTeEhRVUZITEVsQlFVa3NUVUZCVFN4SlFVRkpPMEZCUTJwRkxGbEJRVTBzVDBGQlR5eExRVUZMTEVsQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRlJjRU1zVlVGQlNTeE5RVUZOTEUxQlFVMDdRVUZEWkN4WlFVRkpMRzlDUVVGdlFpeEpRVUZKTEVkQlFVY3NUVUZCVFN4UFFVRlBMRWxCUVVrc1RVRkJUVHRCUVVOd1JDeGxRVUZMTEZsQlFWa3NUMEZCVHp0QlFVTjRRaXhqUVVGSkxGbEJRVmtzU1VGQlNTeFBRVUZQTEVkQlFVY3NUVUZCVFN4SlFVRkpMRWRCUVVjc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGRGVrUXNaVUZCU3l4VFFVRlRMRVZCUVVVc1RVRkJUU3hKUVVGSkxFdEJRVXM3UVVGREwwSXNkMEpCUVdNc1RVRkJUVHRCUVVGQkxHVkJRMlk3UVVGRFRDeHBRa0ZCVHl4VFFVRlRMRXRCUVVzc1MwRkJTeXhaUVVGWkxFbEJRVWtzU1VGQlNTeFhRVUZYTzBGQlFVRTdRVUZCUVN4aFFVVjBSRHRCUVVOTUxHRkJRVXNzV1VGQldUdEJRVU5xUWl4bFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVsWUxGVkJRVTA3UVVGRFRpeHRRa0ZCWlR0QlFVRkJPMEZCUVVFN1FVRk5ia0lzTWtKQlFUSkNMRWRCUVVjN1FVRkZOVUlzVTBGQlR5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RlFVRkZMRWxCUVVrN1FVRkJRVHRCUVU4MVFpeHpRa0ZCYzBJc1IwRkJSeXhMUVVGTE8wRkJRelZDTEUxQlFVa3NSMEZCUnl4SFFVRkhPMEZCUjFZc1RVRkJTeXhMUVVGSkxFbEJRVWtzVVVGQlVTeFJRVUZSTzBGQlFVa3NWVUZCVFN4SlFVRkpMRkZCUVZFc1MwRkJTenRCUVVkNFJDeE5RVUZMTEV0QlFVa3NTVUZCU1N4UFFVRlBMRk5CUVZNc1IwRkJSenRCUVVjNVFpeFJRVUZKTEVsQlFVazdRVUZCUnl4VlFVRkpPMEZCUTJZc1UwRkJTeXhEUVVGRExFbEJRVWtzVFVGQlRTeEpRVUZKTzBGQlEzQkNMRlZCUVUwc1NVRkJTU3hWUVVGVkxFZEJRVWM3UVVGQlFTeGhRVU5rTEVsQlFVa3NSMEZCUnp0QlFVZG9RaXhSUVVGSkxFbEJRVWs3UVVGQlFUdEJRVWxXTEU5QlFVc3NTVUZCU1N4SFFVRkhMRWxCUVVrc1YwRkJWeXhQUVVGUExFbEJRVWs3UVVGQlNUdEJRVWN4UXl4UFFVRkxMRTFCUVUwc1NVRkJTU3hSUVVGUkxFbEJRVWtzVjBGQlZ5eE5RVUZOTEU5QlFVOHNTVUZCU1N4RlFVRkZPMEZCUVVrN1FVRkROMFFzVVVGQlRTeEpRVUZKTEUxQlFVMHNSMEZCUnp0QlFVVnVRaXhOUVVGSkxFdEJRVXM3UVVGRFVDeFhRVUZQTzBGQlExQXNUVUZCUlN4SlFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSk8wRkJRMnhDTEUxQlFVVXNTVUZCU1R0QlFVMU9MRkZCUVVzc1MwRkJTU3hMUVVGTE8wRkJRMlFzVVVGQlNTeEpRVUZKTzBGQlFVY3NWMEZCU3p0QlFVVm9RaXhSUVVGSkxFbEJRVWtzUzBGQlN6dEJRVU5ZTEZWQlFVazdRVUZCUnl4VlFVRkZMRVZCUVVVc1MwRkJTeXhEUVVGRExFbEJRVWtzVFVGQlRTeEhRVUZITzBGQlF6bENMRmRCUVVzc1QwRkJUeXhWUVVGVkxFbEJRVWs3UVVGQlRTeFZRVUZGTEVWQlFVVXNTMEZCU3l4RFFVRkRMRWxCUVVrc1RVRkJUU3hIUVVGSExFdEJRVXM3UVVGRE5VUXNXVUZCVFN4SlFVRkpMRTFCUVUwN1FVRkRhRUlzVlVGQlNTeFhRVUZYTEVsQlFVazdRVUZCUVN4WFFVTmtPMEZCUTB3c1YwRkJTenRCUVVGQk8wRkJSMUFzVjBGQlR6dEJRVUZOTEdGQlFVODdRVUZEY0VJc1RVRkJSU3hGUVVGRkxFdEJRVXNzUTBGQlF6dEJRVVZXTEZGQlFVa3NWVUZCVlR0QlFVZGFMRlZCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzV1VGQldTeE5RVUZOTzBGQlJ6VkNMRlZCUVVVc1NVRkJTVHRCUVVOT0xGVkJRVVVzU1VGQlNUdEJRVUZCTEdsQ1FVZEhMRVZCUVVVc1NVRkJTU3hGUVVGRkxGbEJRVmtzVFVGQlRUdEJRVWR1UXl4VlFVRkZMRWxCUVVrN1FVRkRUaXhWUVVGRkxFbEJRVWtzUTBGQlF6dEJRVUZCTzBGQlFVRTdRVUZCUVN4VFFVbE9PMEZCUjB3c1RVRkJSU3hKUVVGSk8wRkJRMDRzVFVGQlJTeEpRVUZKTEVOQlFVTTdRVUZCUVR0QlFVZFVMRk5CUVU4N1FVRkJRVHRCUVU5VUxHOUNRVUZ2UWl4SFFVRkhMRXRCUVVzN1FVRkRNVUlzVFVGQlNTeE5RVUZOTEUxQlFVMHNVMEZCVXl4SFFVRkhMRk5CUVZNc1MwRkJTeXhIUVVGSExFbEJRVWs3UVVGRmFrUXNUVUZCU1N4UlFVRlJMR05CUVdNc1VVRkJVU3hQUVVGUE8wRkJRM1pETEZGQlFVa3NRMEZCUXl4RFFVRkRPMEZCUVVzc1VVRkJSU3hKUVVGSk8wRkJRMnBDTEUxQlFVVXNTVUZCU1R0QlFVTk9MRTFCUVVVc1NVRkJTVHRCUVVOT0xGZEJRVTg3UVVGQlFUdEJRVWRVTEUxQlFVa3NUVUZCVFN4TFFVRkxMRTFCUVU4N1FVRkRjRUlzVjBGQlR6dEJRVU5RTEZWQlFVMHNTVUZCU1R0QlFVRkJMR0ZCUTBRc1UwRkJVeXhMUVVGTExFMUJRVTg3UVVGRE9VSXNWMEZCVHp0QlFVRkJMR0ZCUTBVc1VVRkJVU3hMUVVGTExFMUJRVTg3UVVGRE4wSXNWMEZCVHp0QlFVRkJMRk5CUTBZN1FVRkRUQ3hWUVVGTkxFMUJRVTBzYTBKQlFXdENPMEZCUVVFN1FVRkphRU1zVFVGQlNTeEpRVUZKTEU5QlFVODdRVUZGWml4TlFVRkpMRWxCUVVrc1IwRkJSenRCUVVOVUxGRkJRVWtzUTBGQlF5eEpRVUZKTEUxQlFVMHNTVUZCU1R0QlFVTnVRaXhWUVVGTkxFbEJRVWtzVlVGQlZTeEhRVUZITzBGQlFVRXNVMEZEYkVJN1FVRkRUQ3hWUVVGTkxFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlMyeENMRTFCUVVrc1NVRkJTU3hSUVVGUk8wRkJRMmhDTEZsQlFWVXNTMEZCU3p0QlFVTm1MRk5CUVU4c1JVRkJSVHRCUVVWVUxFMUJRVWtzVTBGQlV6dEJRVU5ZTEZWQlFVMHNTVUZCU1N4UlFVRlJMRXRCUVVzN1FVRkRka0lzVlVGQlRTeEpRVUZKTzBGQlExWXNVVUZCU1N4TlFVRk5PMEZCUjFZc1kwRkJWU3hQUVVGUExFMUJRVTBzU1VGQlNTeExRVUZMTEU5QlFVOHNSMEZCUnl4SlFVRkpPMEZCUVVFN1FVRkhhRVFzVDBGQlN5eFpRVUZaTEV0QlFVc3NUVUZCVFR0QlFVTTFRaXhQUVVGTExFZEJRVWNzVTBGQlV6dEJRVWRxUWl4UFFVRkxMRWxCUVVrc1NVRkJTU3hIUVVGSExFOUJRVThzUjBGQlJ5eEZRVUZGTzBGQlFVY3NUMEZCUnp0QlFVTnNReXhOUVVGSkxFbEJRVWs3UVVGQlJ5eFhRVUZQTEVsQlFVa3NTMEZCU3l4RlFVRkZMRWxCUVVrN1FVRkRha01zU1VGQlJTeEpRVUZKTEd0Q1FVRnJRaXhKUVVGSk8wRkJRelZDTEVsQlFVVXNTVUZCU1R0QlFVTk9MR0ZCUVZjN1FVRlJXQ3hOUVVGSk8wRkJRVk1zVVVGQlNTeFBRVUZQTEVkQlFVY3NVMEZCVXl4TlFVRk5PMEZCUnpGRExFMUJRVWs3UVVGQlJ5eFJRVUZKTEVWQlFVVXNUVUZCVFN4TFFVRkxMRWxCUVVrc1MwRkJTeXhMUVVGTExGRkJRVkVzUjBGQlJ5eExRVUZMTEZGQlFWRXNTVUZCU1N4SFFVRkhPMEZCUTNKRkxHRkJRVmM3UVVGRldDeFRRVUZQTzBGQlFVRTdRVUZUVkN4alFVRmpMRTFCUVUwc1IwRkJSenRCUVVOeVFpeE5RVUZKTEVkQlEwWXNUVUZCVFN4RlFVRkZMRVZCUVVVN1FVRkZXaXhOUVVGSkxFMUJRVTA3UVVGQlJ5eFhRVUZQTEdGQlFXRXNUVUZCVFN4SFFVRkhMRWRCUVVjN1FVRlBOME1zVFVGQlNTeE5RVUZOTEV0QlFVc3NTMEZCU3p0QlFVTndRaXhOUVVGSkxFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVazdRVUZGZEVJc1RVRkJTU3hGUVVGRkxFMUJRVTBzU1VGQlNTeFJRVUZSTEVkQlFVYzdRVUZETTBJc1RVRkJTU3hoUVVGaExFMUJRVTBzUjBGQlJ5eEhRVUZITzBGQlJ6ZENMRTFCUVVrc1VVRkRSaXhMUVVGTExFbEJRVWtzUzBGQlN5eEpRVU5rTEUxQlFVMHNTVUZCU1N4TFFVRkxMRXRCUTJZc1RVRkJUU3hKUVVGSkxFdEJRVXM3UVVGRGFrSXNVMEZCVHl4UFFVRk5PMEZCUTFnc1lVRkJVeXhGUVVGRkxFMUJRVTA3UVVGRGFrSXNVVUZCU1N4RlFVRkZMRTFCUVUwc1IwRkJSeXhMUVVGTExFOUJRVThzVFVGQlRTeEpRVUZKTEUxQlFVMHNVVUZCVVN4TlFVRk5PMEZCUVVFN1FVRkhNMFFzVTBGQlR6dEJRVUZCTzBGQlMxUXNjMEpCUVhOQ0xFMUJRVTBzUjBGQlJ5eEhRVUZITEVkQlFVY3NZMEZCWXp0QlFVTnFSQ3hOUVVGSkxFZEJRVWNzUjBGQlJ5eEhRVUZITEVsQlExZ3NTVUZCU1N4SFFVTktMRXRCUVVzc1MwRkJTeXhYUVVOV0xFbEJRVWtzUzBGQlN5eExRVUZMTEV0QlFVczdRVUZGY2tJc1lVRkJWenRCUVVOWUxFOUJRVXNzUlVGQlJTeE5RVUZOTzBGQlEySXNUVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkZZaXhoUVVGVE8wRkJRMUFzVVVGQlNTeFBRVUZQTEVWQlFVVXNUVUZCVFN4TFFVRkxMRWxCUVVrc1MwRkJTeXhOUVVGTkxFMUJRVTBzU1VGQlNUdEJRVU5xUkN4UlFVRkpMR1ZCUVdVc1JVRkJSU3hMUVVGTExFdEJRVXNzUlVGQlJTeE5RVUZOTzBGQlEzWkRMRkZCUVVrc1QwRkJUeXhGUVVGRkxFMUJRVTBzUzBGQlN5eEpRVUZKTEV0QlFVc3NUVUZCVFN4TlFVRk5MRWxCUVVrN1FVRkRha1FzVVVGQlNTeEZRVUZGTEV0QlFVczdRVUZGV0N4UlFVRkpMRVZCUVVVc1JVRkJSU3hQUVVGUExGRkJRVkU3UVVGRGNrSXNWMEZCU3l4SlFVRkpMRWRCUVVjc1JVRkJSU3hGUVVGRkxFOUJRVThzUlVGQlJTeEZRVUZGTEUxQlFVMDdRVUZCU3p0QlFVTjBReXhWUVVGSkxFdEJRVXM3UVVGQlNUdEJRVUZCTzBGQlIyWXNVVUZCU1R0QlFVTktMRkZCUVVrN1FVRkRTaXhSUVVGSk8wRkJRMG9zVVVGQlNUdEJRVU5LTzBGQlFVRTdRVUZIUml4aFFVRlhPMEZCUTFnc1NVRkJSU3hGUVVGRkxGTkJRVk1zU1VGQlNUdEJRVVZxUWl4VFFVRlBPMEZCUVVFN1FVRkxWQ3hwUWtGQmFVSXNSMEZCUnl4SFFVRkhPMEZCUTNKQ0xFMUJRVWtzU1VGQlNUdEJRVU5TTEZOQlFVOHNSVUZCUlR0QlFVRkhMRk5CUVVzN1FVRkRha0lzVTBGQlR6dEJRVUZCTzBGQlMxUXNNRUpCUVRCQ0xFMUJRVTBzUjBGQlJ6dEJRVU5xUXl4TlFVRkpMRWRCUTBZc1VVRkJVU3hGUVVGRkxFbEJRVWtzUjBGRFpDeExRVUZMTEUxQlFVMHNUVUZCVFN4TFFVRkxMRmRCUVZjc1NVRkRha01zVTBGQlV5eEhRVUZITEUxQlFVMDdRVUZGY0VJc1RVRkJTU3hGUVVGRk8wRkJSVTRzVFVGQlNTeEZRVUZGTEVsQlFVa3NVMEZCVXp0QlFVTnFRaXhsUVVGWExGRkJRVkVzU1VGQlNUdEJRVU4yUWl4WFFVRlBPMEZCUVVFN1FVRkhWQ3hOUVVGSkxFVkJRVVVzVTBGQlV6dEJRVVZtTEUxQlFVa3NSVUZCUlN4VlFVRlZPMEZCUTJRc1pVRkJWeXhSUVVGUkxFbEJRVWs3UVVGQlFTeFRRVU5zUWp0QlFVTk1MRkZCUVVrc1JVRkJSU3hOUVVGTkxFVkJRVVVzVFVGQlRUdEJRVWR3UWl4UlFVRkpMRVZCUVVVc1NVRkJTU3hUUVVGVE8wRkJRMnBDTEdsQ1FVRlhMRTFCUVUwc1MwRkJUU3hSUVVGUkxFbEJRVWtzU1VGQlRTeFJRVUZSTEVsQlFVazdRVUZEY2tRc1lVRkJUenRCUVVGQk8wRkJSMVFzWlVGQlZ5eE5RVUZOTEV0QlFVMHNVVUZCVVN4SlFVRkpMRWxCUVUwc1VVRkJVU3hKUVVGSk8wRkJRVUU3UVVGSGRrUXNVMEZCVHl4RlFVRkZMRTFCUVUwc1NVRkJTVHRCUVVGQk8wRkJVM0pDTEhkQ1FVRjNRaXhIUVVGSExGTkJRVk1zU1VGQlNTeEpRVUZKTzBGQlF6RkRMRTFCUVVrc1RVRkJUU3hIUVVGSExFZEJRVWNzUjBGQlJ5eExRVUZMTEZOQlFWTXNTMEZCU3l4SlFVRkpMRWRCUTNoRExFOUJRVThzUlVGQlJTeGhRVU5VTEZGQlFWRXNUMEZCVHp0QlFVVnFRaXhOUVVGSkxFOUJRVTg3UVVGRFZDeGxRVUZYTEVsQlFVa3NSMEZCUnp0QlFVTnNRaXhSUVVGSkxFOUJRVTg3UVVGQlVTeFhRVUZMTEV0QlFVczdRVUZCUVR0QlFVTjRRaXhwUWtGQlZ5eEpRVUZKTEVkQlFVYzdRVUZCUVN4VFFVTnNRanRCUVVOTUxGTkJRVXNzUzBGQlN6dEJRVU5XTEZOQlFVc3NTMEZCU3p0QlFVRkJPMEZCUjFvc1RVRkJTU3hEUVVGRExFVkJRVVVzV1VGQldUdEJRVU5xUWl4VlFVRk5MR3RDUVVGclFqdEJRVUZCTEZOQlEyNUNPMEZCUTB3c1ZVRkJUU3hsUVVGbE8wRkJRM0pDTEZGQlFVa3NTVUZCU1N4UlFVRlJPMEZCVDJoQ0xGRkJRVWtzVDBGQlR6dEJRVU5VTEdGQlFVODdRVUZEVUN4VlFVRkpMRmRCUVZjc1NVRkJTVHRCUVVOcVFpeGhRVUZMTEV0QlFVc3NTVUZCU1R0QlFVRkJMR2xDUVVOTUxGZEJRVmNzUjBGQlJ6dEJRVU4yUWl4aFFVRkxMRXRCUVVzc1NVRkJTVHRCUVVGQk8wRkJRVUVzVjBGRldEdEJRVU5NTEdGQlFVODdRVUZCUVR0QlFVOVVMRkZCUVVrc1MwRkJTeXhIUVVGSE8wRkJRMVlzV1VGQlRTeEpRVUZKTEZGQlFWRXNTMEZCU3p0QlFVTjJRaXhWUVVGSkxFbEJRVWtzUzBGQlN6dEJRVU5pTEZGQlFVVXNTVUZCU1N4SlFVRkpMRk5CUVZNN1FVRkRia0lzVVVGQlJTeEpRVUZKTEZsQlFWa3NaVUZCWlN4SlFVRkpMRWxCUVVrN1FVRkRla01zVVVGQlJTeEpRVUZKTEVWQlFVVXNSVUZCUlR0QlFVRkJPMEZCUjFvc1UwRkJTeXhaUVVGWkxFdEJRVXNzU1VGQlNUdEJRVU14UWl4UlFVRkpMRTFCUVUwc1IwRkJSenRCUVVkaUxGZEJRVThzUjBGQlJ5eEZRVUZGTEZGQlFWRTdRVUZCU1N4VFFVRkhPMEZCUlROQ0xGRkJRVWtzUTBGQlF5eEhRVUZITEVsQlFVazdRVUZEVml4WlFVRk5MRkZCUVZFc1UwRkJVenRCUVVGQkxGZEJRMnhDTzBGQlEwd3NWVUZCU1N4SlFVRkpMRWRCUVVjN1FVRkRWRHRCUVVGQkxHRkJRMHM3UVVGRFRDeFpRVUZKTEVsQlFVa3NTMEZCU3p0QlFVTmlMRlZCUVVVc1NVRkJTVHRCUVVOT0xGVkJRVVVzU1VGQlNUdEJRVU5PTEZsQlFVa3NUMEZCVHl4SFFVRkhMRWRCUVVjc1NVRkJTU3hKUVVGSkxFZEJRVWM3UVVGRE5VSXNZVUZCU3l4RlFVRkZPMEZCUTFBc1dVRkJTU3hGUVVGRk8wRkJRMDRzYTBKQlFWVTdRVUZCUVR0QlFVbGFMRlZCUVVrc1IwRkJSenRCUVVOUUxGVkJRVWtzVDBGQlR6dEJRVU5ZTEdkQ1FVRlZMRmRCUVZjc1IwRkJSeXhMUVVGTExFOUJRVTg3UVVGRmNFTXNaMEpCUVZVc1MwRkJTeXhKUVVOV0xFOUJRVTBzVlVGQlZTeFpRVUZoTEZGQlFVOHNTMEZCU3l4UFFVRlJMRWRCUVVVc1NVRkJTU3hKUVVGSkxFbEJRVWtzVFVGRGFFVXNTVUZCU1N4TFFVRkxMRTFCUVUwc1MwRkJUU3hSUVVGUExFdEJRVXNzVjBGQlZ5eFBRVUZQTEV0QlFVc3NSMEZCUnl4TFFVRkxMRXRCUVVzc1MwRkRja1VzVDBGQlVTeEhRVUZGTEVsQlFVa3NTVUZCU1N4SlFVRkpPMEZCUlRGQ0xGTkJRVWNzVTBGQlV6dEJRVVZhTEZWQlFVa3NVMEZCVXp0QlFVZFlMR1ZCUVU4c1JVRkJSU3hIUVVGSExFVkJRVVVzVFVGQlRTeFBRVUZQTEV0QlFVazdRVUZETjBJc1lVRkJSeXhOUVVGTk8wRkJRMVFzWTBGQlNTeERRVUZETEVsQlFVazdRVUZEVUN4alFVRkZPMEZCUTBZc1pVRkJSeXhSUVVGUk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlRXcENMRmRCUVVzc1RVRkJUU3hIUVVGSExGRkJRVkVzUTBGQlF5eEhRVUZITEUxQlFVMHNTVUZCU1N4RlFVRkZPMEZCUVVrN1FVRkhNVU1zVjBGQlN5eEpRVUZKTEVkQlFVY3NUVUZCVFN4SlFVRkpMRWxCUVVrc1MwRkJTenRCUVVGTExHVkJRVThzVTBGQlV5eFBRVUZQTEVkQlFVYzdRVUZIT1VRc1ZVRkJTU3hQUVVGUE8wRkJRMVFzV1VGQlNTeE5RVUZOTEVkQlFVYzdRVUZEV0N4alFVRkpMRmRCUVZjc1RVRkJUU3hYUVVGWExFZEJRVWM3UVVGRGFrTXNaMEpCUVVrc1YwRkJWeXhMUVVGTExFbEJRVWs3UVVGRGVFSXNhVUpCUVVzc1JVRkJSU3hMUVVGTExFMUJRVTBzUjBGQlJ6dEJRVUZQTEhGQ1FVRlBPMEZCUTI1RExHbENRVUZMTEZsQlFWa3NTMEZCU3l4TlFVRk5PMEZCUXpWQ0xHbENRVUZMTEUxQlFVMHNSMEZCUnl4UlFVRlJMRU5CUVVNc1IwRkJSeXhOUVVGTkxFbEJRVWtzUlVGQlJUdEJRVUZKTzBGQlJ6RkRMR2xDUVVGTExFbEJRVWtzUjBGQlJ5eE5RVUZOTEUxQlFVMHNTVUZCU1N4TFFVRkxPMEZCUVVzc2NVSkJRVThzVTBGQlV5eFBRVUZQTEVkQlFVYzdRVUZCUVN4cFFrRkRNMFE3UVVGRFRDeHJRa0ZCVFN4SlFVRkpMRTlCUVU4c1MwRkJTeXhOUVVGTkxFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlFVRTdRVUZKTVVNc1kwRkJUeXhOUVVGUExFdEJRVWtzU1VGQlNTeE5RVUZOTEZGQlFWRTdRVUZCUVN4cFFrRkRNMElzU1VGQlNTeEhRVUZITzBGQlEyaENMR1ZCUVU4c1JVRkJSVHRCUVVGSkxHZENRVUZOTEUxQlFVMDdRVUZEZWtJc1kwRkJUU3hQUVVGUE8wRkJRVUVzWVVGRFVqdEJRVU5NTEZsQlFVa3NSVUZCUlN4SlFVRkpPMEZCUVVzc1pVRkJTeXhMUVVGTExFdEJRVXM3UVVGQlR5eHRRa0ZCVHp0QlFVRkJMR2xDUVVOdVF5eEpRVUZKTzBGQlFVc3NaMEpCUVUwc1NVRkJTU3hOUVVGTkxFZEJRVWNzUzBGQlN5eE5RVUZOTEVsQlFVa3NUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkpPVVFzVlVGQlR5eFpRVUZYTEV0QlFVc3NUMEZCVHl4WFFVRlhMRWxCUVVrc1QwRkJUeXhYUVVGWExFbEJRVWtzVDBGQlR5eE5RVUZOTzBGQlFVRTdRVUZIYkVZc1UwRkJUeXhGUVVGRkxFbEJRVWtzU1VGQlNTeE5RVUZOTEUxQlFVMDdRVUZCUVR0QlFVc3ZRaXhyUWtGQmEwSXNTMEZCU3l4TFFVRkxPMEZCUXpGQ0xFMUJRVWtzU1VGQlNTeFRRVUZUTEV0QlFVczdRVUZEY0VJc1VVRkJTU3hUUVVGVE8wRkJRMklzVjBGQlR6dEJRVUZCTzBGQlFVRTdRVUY1UkZnc1lVRkJZU3hIUVVGSE8wRkJRMlFzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnp0QlFVRkJPMEZCVlhKQ0xHTkJRV01zUjBGQlJ6dEJRVU5tTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVZkeVFpeGxRVUZsTEVkQlFVYzdRVUZEYUVJc1UwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ6dEJRVUZCTzBGQldYSkNMR0ZCUVdFc1IwRkJSeXhIUVVGSE8wRkJRMnBDTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjc1MwRkJTenRCUVVGQk8wRkJWekZDTEdOQlFXTXNSMEZCUnp0QlFVTm1MRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWM3UVVGQlFUdEJRVmR5UWl4bFFVRmxMRWRCUVVjN1FVRkRhRUlzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnp0QlFVRkJPMEZCVjNKQ0xHTkJRV01zUjBGQlJ6dEJRVU5tTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVZkeVFpeGxRVUZsTEVkQlFVYzdRVUZEYUVJc1UwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ6dEJRVUZCTzBGQk5rSnlRaXhsUVVGbExFZEJRVWNzUjBGQlJ6dEJRVU51UWl4TlFVRkpMRWxCUVVrc1MwRkJTenRCUVVOaUxFMUJRVWtzU1VGQlNTeExRVUZMTzBGQlEySXNUVUZCU1N4SFFVTkdMRXRCUVVzc1MwRkJTeXhYUVVOV0xFdEJRVXNzUzBGQlN5eFZRVU5XTEUxQlFVMHNTMEZCU3p0QlFVZGlMRTFCUVVrc1EwRkJReXhGUVVGRkxFdEJRVXNzUTBGQlF5eEZRVUZGTEVkQlFVYzdRVUZEYUVJc1VVRkJTU3hKUVVGSkxFdEJRVXM3UVVGQlFTeGhRVWRLTEVOQlFVTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1JVRkJSU3hIUVVGSE8wRkJRM1pDTEZGQlFVa3NUVUZCVFN4TlFVRk5MRXRCUVVzc1IwRkJSeXhOUVVGTkxFVkJRVVVzU1VGQlNTeEpRVUZKTEU5QlFVODdRVUZETDBNc1RVRkJSU3hKUVVGSkxFVkJRVVU3UVVGQlFTeGhRVWRETEVOQlFVTXNSVUZCUlN4TFFVRkxMRVZCUVVVc1ZVRkJWVHRCUVVNM1FpeFJRVUZKTEVWQlFVVXNTVUZCU1N4SlFVRkpMRTFCUVUwc1RVRkJUU3hKUVVGSkxFMUJRVTBzU1VGQlNTeExRVUZMTzBGQlF6ZERMRTFCUVVVc1NVRkJTU3hGUVVGRk8wRkJRVUVzWVVGSFF5eERRVUZETEVWQlFVVXNTMEZCU3l4RlFVRkZMRlZCUVZVN1FVRkROMElzVVVGQlNTeE5RVUZOTEUxQlFVMHNTMEZCU3l4SFFVRkhMRTFCUVUwN1FVRkRPVUlzVFVGQlJTeEpRVUZKTEVWQlFVVTdRVUZCUVN4aFFVZERMRVZCUVVVc1NVRkJTU3hIUVVGSE8wRkJRMnhDTEZOQlFVc3NXVUZCV1R0QlFVTnFRaXhUUVVGTExGZEJRVmM3UVVGRGFFSXNVVUZCU1N4TFFVRkxMRXRCUVVzc1QwRkJUeXhIUVVGSExFZEJRVWNzUzBGQlN6dEJRVU5vUXl4UlFVRkpMRTFCUVUwc1RVRkJUU3hMUVVGTE8wRkJRM0pDTEZOQlFVc3NXVUZCV1R0QlFVTnFRaXhUUVVGTExGZEJRVmM3UVVGRGFFSXNVVUZCU1N4RlFVRkZMRWxCUVVrc1NVRkJTU3hGUVVGRkxFMUJRVTBzUzBGQlN5eEZRVUZGTEV0QlFVczdRVUZCUVN4VFFVTTNRanRCUVVOTUxGRkJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNSMEZCUnl4SFFVRkhMRXRCUVVzN1FVRkJRVHRCUVVkc1F5eFRRVUZQTzBGQlFVRTdRVUZYVkN4alFVRmpMRWRCUVVjN1FVRkRaaXhUUVVGUExFbEJRVWtzUzBGQlN5eEhRVUZITzBGQlFVRTdRVUZWY2tJc1kwRkJZeXhIUVVGSE8wRkJRMllzVTBGQlR5eFRRVUZUTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWxCUVVrc1JVRkJSU3hKUVVGSkxFZEJRVWM3UVVGQlFUdEJRWE5DTlVNc1owSkJRV2RDTEV0QlFVczdRVUZEYmtJc1RVRkJTU3hEUVVGRExFOUJRVThzVDBGQlR5eFJRVUZSTzBGQlFWVXNWVUZCVFN4TlFVRk5MR1ZCUVdVN1FVRkRhRVVzVFVGQlNTeEhRVUZITEVkQlFVY3NSMEZEVWl4alFVRmpMRWxCUVVrc1lVRkJZU3hOUVVNdlFpeExRVUZMTzBGQlFVRXNTVUZEU0R0QlFVRkJMRWxCUVdFN1FVRkJRU3hKUVVGSE8wRkJRVUVzU1VGRGFFSTdRVUZCUVN4SlFVRlpPMEZCUVVFc1NVRkJSenRCUVVGQkxFbEJRMlk3UVVGQlFTeEpRVUZaTEVOQlFVTTdRVUZCUVN4SlFVRlhPMEZCUVVFc1NVRkRlRUk3UVVGQlFTeEpRVUZaTzBGQlFVRXNTVUZCUnp0QlFVRkJMRWxCUTJZN1FVRkJRU3hKUVVGUk8wRkJRVUVzU1VGQlJ6dEJRVUZCTEVsQlExZzdRVUZCUVN4SlFVRlJMRU5CUVVNN1FVRkJRU3hKUVVGWE8wRkJRVUVzU1VGRGNFSTdRVUZCUVN4SlFVRlZPMEZCUVVFc1NVRkJSenRCUVVGQk8wRkJSMnBDTEU5QlFVc3NTVUZCU1N4SFFVRkhMRWxCUVVrc1IwRkJSeXhSUVVGUkxFdEJRVXNzUjBGQlJ6dEJRVU5xUXl4UlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSk8wRkJRV0VzVjBGQlN5eExRVUZMTEZOQlFWTTdRVUZETDBNc1VVRkJTeXhMUVVGSkxFbEJRVWtzVVVGQlVTeFJRVUZSTzBGQlF6TkNMRlZCUVVrc1ZVRkJWU3hQUVVGUExFdEJRVXNzUzBGQlN5eEhRVUZITEVsQlFVa3NUVUZCVFN4TFFVRkxMRWRCUVVjc1NVRkJTVHRCUVVGSkxHRkJRVXNzUzBGQlN6dEJRVUZCTzBGQlEycEZMR05CUVUwc1RVRkJUU3hyUWtGQmEwSXNTVUZCU1N4UFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVsc1JDeE5RVUZKTEVsQlFVa3NWVUZCVlR0QlFVRmhMRk5CUVVzc1MwRkJTeXhUUVVGVE8wRkJRMnhFTEUxQlFVc3NTMEZCU1N4SlFVRkpMRkZCUVZFc1VVRkJVVHRCUVVNelFpeFJRVUZKTEUxQlFVMHNVVUZCVVN4TlFVRk5MRk5CUVZNc1RVRkJUU3hMUVVGTExFMUJRVTBzUjBGQlJ6dEJRVU51UkN4VlFVRkpMRWRCUVVjN1FVRkRUQ3haUVVGSkxFOUJRVThzVlVGQlZTeGxRVUZsTEZWQlEycERMRkZCUVU4c2JVSkJRVzFDTEU5QlFVOHNZMEZCWXp0QlFVTm9SQ3hsUVVGTExFdEJRVXM3UVVGQlFTeGxRVU5NTzBGQlEwd3NaMEpCUVUwc1RVRkJUVHRCUVVGQk8wRkJRVUVzWVVGRlZEdEJRVU5NTEdGQlFVc3NTMEZCU3p0QlFVRkJPMEZCUVVFc1YwRkZVRHRCUVVOTUxGbEJRVTBzVFVGQlRTeHJRa0ZCYTBJc1NVRkJTU3hQUVVGUE8wRkJRVUU3UVVGQlFUdEJRVWszUXl4VFFVRlBPMEZCUVVFN1FVRlhWQ3hoUVVGaExFZEJRVWM3UVVGRFpDeFRRVUZQTEVsQlFVa3NTMEZCU3l4SFFVRkhPMEZCUVVFN1FVRlhja0lzWTBGQll5eEhRVUZITzBGQlEyWXNVMEZCVHl4SlFVRkpMRXRCUVVzc1IwRkJSenRCUVVGQk8wRkJVM0pDTEdWQlFXVXNTMEZCU3p0QlFVTnNRaXhOUVVGSkxFZEJRVWNzUjBGQlJ6dEJRVk5XTEc5Q1FVRnBRaXhIUVVGSE8wRkJRMnhDTEZGQlFVa3NSMEZCUnl4SlFVRkhMRWRCUTFJc1NVRkJTVHRCUVVkT0xGRkJRVWtzUTBGQlJTeGpRVUZoTzBGQlFWVXNZVUZCVHl4SlFVRkpMRk5CUVZFN1FVRkphRVFzVFVGQlJTeGpRVUZqTzBGQlIyaENMRkZCUVVrc1lVRkJZU3hWUVVGVE8wRkJRM2hDTEZGQlFVVXNTVUZCU1N4RlFVRkZPMEZCUlZJc1ZVRkJTU3hWUVVGVk8wRkJRMW9zV1VGQlNTeERRVUZETEVWQlFVVXNTMEZCU3l4RlFVRkZMRWxCUVVrc1UwRkJVU3hOUVVGTk8wRkJSemxDTEZsQlFVVXNTVUZCU1R0QlFVTk9MRmxCUVVVc1NVRkJTVHRCUVVGQkxHMUNRVU5ITEVWQlFVVXNTVUZCU1N4VFFVRlJMRTFCUVUwN1FVRkhOMElzV1VGQlJTeEpRVUZKTzBGQlEwNHNXVUZCUlN4SlFVRkpMRU5CUVVNN1FVRkJRU3hsUVVOR08wRkJRMHdzV1VGQlJTeEpRVUZKTEVWQlFVVTdRVUZEVWl4WlFVRkZMRWxCUVVrc1JVRkJSU3hGUVVGRk8wRkJRVUU3UVVGQlFTeGhRVVZRTzBGQlEwd3NWVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRVaXhWUVVGRkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVXNSVUZCUlN4VlFVRlZMRVZCUVVVN1FVRkJRVHRCUVVjNVFqdEJRVUZCTzBGQlIwWXNVVUZCU1N4UFFVRlBPMEZCUlZnc1VVRkJTU3hOUVVGTkxGVkJRVlU3UVVGRGJFSXNWVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkRXQ3hWUVVGRkxFbEJRVWtzU1VGQlNTeEpRVUZKTEVsQlFVa3NTMEZCU3p0QlFVTjJRaXhWUVVGRkxFbEJRVWs3UVVGRFRpeFZRVUZGTEVsQlFVa3NRMEZCUXp0QlFVTlFPMEZCUVVFN1FVRkhSaXhWUVVGSkxFbEJRVWtzUjBGQlJ6dEJRVU5VTEZsQlFVa3NRMEZCUXp0QlFVTk1MRlZCUVVVc1NVRkJTVHRCUVVGQkxHRkJRMFE3UVVGRFRDeFZRVUZGTEVsQlFVazdRVUZCUVR0QlFVbFNMRlZCUVVrc1RVRkJUU3hEUVVGRExFTkJRVU1zUzBGQlN5eEpRVUZKTEV0QlFVczdRVUZEZUVJc1lVRkJTeXhKUVVGSkxFZEJRVWNzUzBGQlNTeEhRVUZITEUxQlFVc3NTVUZCU1N4TlFVRkxPMEZCUVVrN1FVRkZja01zV1VGQlNTeFZRVUZWTzBGQlExb3NZMEZCU1N4SlFVRkpMRk5CUVZFc1RVRkJUVHRCUVVOd1FpeGpRVUZGTEVsQlFVazdRVUZEVGl4alFVRkZMRWxCUVVrN1FVRkJRU3h4UWtGRFJ5eEpRVUZKTEZOQlFWRXNUVUZCVFR0QlFVTXpRaXhqUVVGRkxFbEJRVWs3UVVGRFRpeGpRVUZGTEVsQlFVa3NRMEZCUXp0QlFVRkJMR2xDUVVOR08wRkJRMHdzWTBGQlJTeEpRVUZKTzBGQlEwNHNZMEZCUlN4SlFVRkpMRU5CUVVNN1FVRkJRVHRCUVVGQkxHVkJSVW83UVVGRFRDeFpRVUZGTEVsQlFVazdRVUZEVGl4WlFVRkZMRWxCUVVrc1EwRkJRenRCUVVGQk8wRkJSMVE3UVVGQlFTeHBRa0ZIVXl4SlFVRkpMRTFCUVUwc1IwRkJSenRCUVVOMFFpeFpRVUZKTEVOQlFVTTdRVUZCUnl4WlFVRkZMRWxCUVVrN1FVRkRaQ3hWUVVGRkxFbEJRVWs3UVVGRFRpeFZRVUZGTEVsQlFVazdRVUZEVGp0QlFVRkJPMEZCUjBZc1lVRkJUeXhoUVVGaExFZEJRVWNzUlVGQlJUdEJRVUZCTEdWQlJXaENMRTFCUVUwc1ZVRkJWVHRCUVVONlFpeFpRVUZOTEUxQlFVMHNhMEpCUVd0Q08wRkJRVUU3UVVGSmFFTXNVVUZCU3l4TlFVRkpMRVZCUVVVc1YwRkJWeXhSUVVGUkxFbEJRVWs3UVVGRGFFTXNWVUZCU1N4RlFVRkZMRTFCUVUwN1FVRkRXaXhSUVVGRkxFbEJRVWs3UVVGQlFTeFhRVU5FTzBGQlJVd3NWVUZCU1N4UFFVRk5PMEZCUVVrc1dVRkJTU3hGUVVGRkxFMUJRVTA3UVVGRE1VSXNVVUZCUlN4SlFVRkpPMEZCUVVFN1FVRkhVaXhYUVVGUExGVkJRVlVzUzBGQlN5eExRVUZMTEdGQlFXRXNSMEZCUnl4TFFVRkxMRmRCUVZjc1IwRkJSenRCUVVGQk8wRkJSMmhGTEZkQlFWRXNXVUZCV1R0QlFVVndRaXhYUVVGUkxGZEJRVmM3UVVGRGJrSXNWMEZCVVN4aFFVRmhPMEZCUTNKQ0xGZEJRVkVzWVVGQllUdEJRVU55UWl4WFFVRlJMR05CUVdNN1FVRkRkRUlzVjBGQlVTeG5Ra0ZCWjBJN1FVRkRlRUlzVjBGQlVTeHJRa0ZCYTBJN1FVRkRNVUlzVjBGQlVTeHJRa0ZCYTBJN1FVRkRNVUlzVjBGQlVTeHJRa0ZCYTBJN1FVRkRNVUlzVjBGQlVTeHRRa0ZCYlVJN1FVRkRNMElzVjBGQlVTeFRRVUZUTzBGQlJXcENMRmRCUVZFc1UwRkJVeXhUUVVGUkxFMUJRVTA3UVVGREwwSXNWMEZCVVN4UlFVRlJPMEZCUTJoQ0xGZEJRVkVzV1VGQldUdEJRVVZ3UWl4WFFVRlJMRTFCUVUwN1FVRkRaQ3hYUVVGUkxFOUJRVTg3UVVGRFppeFhRVUZSTEZGQlFWRTdRVUZEYUVJc1YwRkJVU3hOUVVGTk8wRkJRMlFzVjBGQlVTeFBRVUZQTzBGQlEyWXNWMEZCVVN4UlFVRlJPMEZCUTJoQ0xGZEJRVkVzVDBGQlR6dEJRVU5tTEZkQlFWRXNVVUZCVVR0QlFVTm9RaXhYUVVGUkxGRkJRVkU3UVVGRGFFSXNWMEZCVVN4UFFVRlBPMEZCUTJZc1YwRkJVU3hQUVVGUE8wRkJRMllzVjBGQlVTeE5RVUZOTzBGQlEyUXNWMEZCVVN4UFFVRlBPMEZCUTJZc1YwRkJVU3hOUVVGTk8wRkJRMlFzVjBGQlVTeE5RVUZOTzBGQlEyUXNWMEZCVVN4UlFVRlJPMEZCUTJoQ0xGZEJRVkVzVVVGQlVUdEJRVU5vUWl4WFFVRlJMRXRCUVVzN1FVRkRZaXhYUVVGUkxFMUJRVTA3UVVGRFpDeFhRVUZSTEZGQlFWRTdRVUZEYUVJc1YwRkJVU3hQUVVGUE8wRkJRMllzVjBGQlVTeE5RVUZOTzBGQlEyUXNWMEZCVVN4TlFVRk5PMEZCUTJRc1YwRkJVU3hOUVVGTk8wRkJRMlFzVjBGQlVTeE5RVUZOTzBGQlEyUXNWMEZCVVN4TlFVRk5PMEZCUTJRc1YwRkJVU3hUUVVGVE8wRkJRMnBDTEZkQlFWRXNVVUZCVVR0QlFVTm9RaXhYUVVGUkxFOUJRVTg3UVVGRFppeFhRVUZSTEUxQlFVMDdRVUZEWkN4WFFVRlJMRTlCUVU4N1FVRkRaaXhYUVVGUkxFOUJRVTg3UVVGRFppeFhRVUZSTEUxQlFVMDdRVUZEWkN4WFFVRlJMRTFCUVUwN1FVRkRaQ3hYUVVGUkxFOUJRVTg3UVVGRFppeFhRVUZSTEZGQlFWRTdRVUZGYUVJc1RVRkJTU3hSUVVGUk8wRkJRVkVzVlVGQlRUdEJRVU14UWl4TlFVRkpMRXRCUVVzN1FVRkRVQ3hSUVVGSkxFbEJRVWtzWVVGQllTeE5RVUZOTzBGQlEzcENMRmRCUVVzc1EwRkJReXhoUVVGaExGbEJRVmtzV1VGQldTeFpRVUZaTEZGQlFWRXNVVUZCVVN4VlFVRlZPMEZCUTJwR0xGZEJRVXNzU1VGQlNTeEhRVUZITEVsQlFVa3NSMEZCUnp0QlFVRlRMRmxCUVVrc1EwRkJReXhKUVVGSkxHVkJRV1VzU1VGQlNTeEhRVUZITzBGQlFVOHNZMEZCU1N4TFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVGQk8wRkJTWEJHTEZkQlFWRXNUMEZCVHp0QlFVVm1MRk5CUVU4N1FVRkJRVHRCUVZsVUxHRkJRV0VzUjBGQlJ5eEhRVUZITzBGQlEycENMRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNUdEJRVUZCTzBGQlYzcENMR0ZCUVdFc1IwRkJSenRCUVVOa0xGTkJRVThzU1VGQlNTeExRVUZMTEVkQlFVYzdRVUZCUVR0QlFWVnlRaXhsUVVGbExFZEJRVWM3UVVGRGFFSXNVMEZCVHl4VFFVRlRMRWxCUVVrc1NVRkJTU3hMUVVGTExFbEJRVWtzUlVGQlJTeEpRVUZKTEVkQlFVYzdRVUZCUVR0QlFXRTFReXhwUWtGQmFVSTdRVUZEWml4TlFVRkpMRWRCUVVjc1IwRkRUQ3hKUVVGSkxFbEJRVWtzUzBGQlN6dEJRVVZtTEdGQlFWYzdRVUZGV0N4UFFVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxGVkJRVlVzVlVGQlV6dEJRVU5xUXl4UlFVRkpMRWxCUVVrc1MwRkJTeXhWUVVGVk8wRkJRM1pDTEZGQlFVa3NRMEZCUXl4RlFVRkZMRWRCUVVjN1FVRkRVaXhWUVVGSkxFVkJRVVVzUjBGQlJ6dEJRVU5RTEcxQ1FVRlhPMEZCUTFnc1pVRkJUeXhKUVVGSkxFdEJRVXNzU1VGQlNUdEJRVUZCTzBGQlJYUkNMRlZCUVVrN1FVRkJRU3hsUVVOTExFVkJRVVVzUjBGQlJ6dEJRVU5rTEZWQlFVa3NSVUZCUlN4TFFVRkxMRVZCUVVVc1RVRkJUVHRCUVVGQk8wRkJRVUU3UVVGSmRrSXNZVUZCVnp0QlFVVllMRk5CUVU4c1JVRkJSVHRCUVVGQk8wRkJVMWdzTWtKQlFUSkNMRXRCUVVzN1FVRkRPVUlzVTBGQlR5eGxRVUZsTEZkQlFWY3NUMEZCVHl4SlFVRkpMRk5CUVZNc2MwSkJRWE5DTzBGQlFVRTdRVUZYTjBVc1dVRkJXU3hIUVVGSE8wRkJRMklzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnp0QlFVRkJPMEZCWTNKQ0xHRkJRV0VzUjBGQlJ5eEhRVUZITzBGQlEycENMRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNUdEJRVUZCTzBGQlYzcENMR05CUVdNc1IwRkJSenRCUVVObUxGTkJRVThzU1VGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1R0QlFVRkJPMEZCVjNwQ0xHVkJRV1VzUjBGQlJ6dEJRVU5vUWl4VFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWs3UVVGQlFUdEJRVlY2UWl4bFFVRmxPMEZCUTJJc1UwRkJUeXhUUVVGVExFMUJRVTBzVjBGQlZ6dEJRVUZCTzBGQlZXNURMR1ZCUVdVN1FVRkRZaXhUUVVGUExGTkJRVk1zVFVGQlRTeFhRVUZYTzBGQlFVRTdRVUZaYmtNc1lVRkJZU3hIUVVGSExFZEJRVWM3UVVGRGFrSXNVMEZCVHl4SlFVRkpMRXRCUVVzc1IwRkJSeXhKUVVGSk8wRkJRVUU3UVVGWmVrSXNZVUZCWVN4SFFVRkhMRWRCUVVjN1FVRkRha0lzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpPMEZCUVVFN1FVRlpla0lzWVVGQllTeEhRVUZITEVkQlFVYzdRVUZEYWtJc1UwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTzBGQlFVRTdRVUZaZWtJc1owSkJRV2RDTEVsQlFVazdRVUZEYkVJc1RVRkJTU3hIUVVGSExFZEJRVWNzUjBGQlJ5eEhRVU5ZTEVsQlFVa3NSMEZEU2l4SlFVRkpMRWxCUVVrc1MwRkJTeXhKUVVOaUxFdEJRVXM3UVVGRlVDeE5RVUZKTEU5QlFVODdRVUZCVVN4VFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVONFFpeGxRVUZYTEVsQlFVa3NSMEZCUnp0QlFVVjJRaXhOUVVGSkxFdEJRVXNzUzBGQlN5eExRVUZMTzBGQlJXNUNMRTFCUVVrc1EwRkJReXhMUVVGTExGRkJRVkU3UVVGRGFFSXNWMEZCVHl4SlFVRkpPMEZCUVVrc1UwRkJSeXhQUVVGUExFdEJRVXNzVjBGQlZ5eE5RVUZOTzBGQlFVRXNZVUZIZEVNc1QwRkJUeXhwUWtGQmFVSTdRVUZEYWtNc1VVRkJTU3hQUVVGUExHZENRVUZuUWl4SlFVRkpMRmxCUVZrN1FVRkZNME1zVjBGQlR5eEpRVUZKTEV0QlFVazdRVUZEWWl4VlFVRkpMRVZCUVVVN1FVRkpUaXhWUVVGSkxFdEJRVXNzVDBGQlVUdEJRVU5tTEZWQlFVVXNTMEZCU3l4UFFVRlBMR2RDUVVGblFpeEpRVUZKTEZsQlFWa3NTVUZCU1R0QlFVRkJMR0ZCUXpkRE8wRkJTVXdzVjBGQlJ5eFBRVUZQTEVsQlFVazdRVUZCUVR0QlFVRkJPMEZCUVVFc1lVRkxWQ3hQUVVGUExHRkJRV0U3UVVGSE4wSXNVVUZCU1N4UFFVRlBMRmxCUVZrc1MwRkJTenRCUVVVMVFpeFhRVUZQTEVsQlFVa3NTMEZCU1R0QlFVZGlMRlZCUVVrc1JVRkJSU3hMUVVGTkxFZEJRVVVzU1VGQlNTeE5RVUZOTEV0QlFVMHNSMEZCUlN4SlFVRkpMRTFCUVUwc1RVRkJVU3hKUVVGRkxFbEJRVWtzUzBGQlN5eFJRVUZUTzBGQlIzUkZMRlZCUVVrc1MwRkJTeXhQUVVGUk8wRkJRMllzWlVGQlR5eFpRVUZaTEVkQlFVY3NTMEZCU3l4SFFVRkhPMEZCUVVFc1lVRkRla0k3UVVGSlRDeFhRVUZITEV0QlFVc3NTVUZCU1R0QlFVTmFMR0ZCUVVzN1FVRkJRVHRCUVVGQk8wRkJTVlFzVVVGQlNTeEpRVUZKTzBGQlFVRXNVMEZEU0R0QlFVTk1MRlZCUVUwc1RVRkJUVHRCUVVGQk8wRkJSMlFzVFVGQlNTeEhRVUZITEVWQlFVVTdRVUZEVkN4UlFVRk5PMEZCUjA0c1RVRkJTU3hMUVVGTExFbEJRVWs3UVVGRFdDeFJRVUZKTEZGQlFWRXNTVUZCU1N4WFFVRlhPMEZCUXpOQ0xFOUJRVWNzUzBGQlRTeExRVUZKTEVsQlFVa3NTMEZCU3p0QlFVRkJPMEZCU1hoQ0xGTkJRVThzUjBGQlJ5eFBRVUZQTEVkQlFVYzdRVUZCU3l4UFFVRkhPMEZCUnpWQ0xFMUJRVWtzU1VGQlNTeEhRVUZITzBGQlExUXNVVUZCU1R0QlFVTktMRk5CUVVzc1EwRkJRenRCUVVGQkxGTkJRMFE3UVVGRFRDeFJRVUZKTzBGQlIwb3NWMEZCVHl4SFFVRkhMRTlCUVU4c1IwRkJSeXhMUVVGTE8wRkJRVlVzVTBGQlJ6dEJRVWQwUXl4VFFVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxFZEJRVWNzU1VGQlNTeExRVUZMTEVsQlFVa3NTMEZCU3p0QlFVRkpPMEZCUjNwRExGRkJRVWtzU1VGQlNUdEJRVUZWTEZkQlFVc3NWMEZCVnp0QlFVRkJPMEZCUjNCRExFbEJRVVVzU1VGQlNUdEJRVU5PTEVsQlFVVXNTVUZCU1R0QlFVVk9MRk5CUVU4N1FVRkJRVHRCUVZsVUxHVkJRV1VzUjBGQlJ6dEJRVU5vUWl4VFFVRlBMRk5CUVZNc1NVRkJTU3hKUVVGSkxFdEJRVXNzU1VGQlNTeEZRVUZGTEVsQlFVa3NSMEZCUnl4TFFVRkxPMEZCUVVFN1FVRmxha1FzWTBGQll5eEhRVUZITzBGQlEyWXNUVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRZaXhUUVVGUExFVkJRVVVzU1VGQlN5eEZRVUZGTEVWQlFVVXNTMEZCU3l4RlFVRkZMRWxCUVVrc1NVRkJTU3hGUVVGRkxFbEJRVXNzUlVGQlJTeExRVUZMTzBGQlFVRTdRVUZYYWtRc1lVRkJZU3hIUVVGSE8wRkJRMlFzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnp0QlFVRkJPMEZCVjNKQ0xHTkJRV01zUjBGQlJ6dEJRVU5tTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVZkeVFpeGpRVUZqTEVkQlFVYzdRVUZEWml4VFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSE8wRkJRVUU3UVVGWmNrSXNZVUZCWVN4SFFVRkhMRWRCUVVjN1FVRkRha0lzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpPMEZCUVVFN1FVRlhla0lzWVVGQllTeEhRVUZITzBGQlEyUXNVMEZCVHl4SlFVRkpMRXRCUVVzc1IwRkJSenRCUVVGQk8wRkJWM0pDTEdOQlFXTXNSMEZCUnp0QlFVTm1MRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWM3UVVGQlFUdEJRVlZ5UWl4bFFVRmxMRWRCUVVjN1FVRkRhRUlzVTBGQlR5eFRRVUZUTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWxCUVVrc1JVRkJSU3hKUVVGSkxFZEJRVWM3UVVGQlFUdEJRVWsxUXl4RlFVRkZMRTlCUVU4c1NVRkJTU3hwUTBGQmFVTXNSVUZCUlR0QlFVTm9SQ3hGUVVGRkxFOUJRVThzWlVGQlpUdEJRVWRxUWl4WFFVRkpMRlZCUVZVc1RVRkJUVHRCUVVjelFpeFBRVUZQTEVsQlFVa3NVVUZCVVR0QlFVTnVRaXhMUVVGTExFbEJRVWtzVVVGQlVUdEJRVVZxUWl4bFFVRmxPeUlzQ2lBZ0ltNWhiV1Z6SWpvZ1cxMEtmUW89XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFLFVBQVUsR0FBRyxHQUFHLEVBQUUsUUFBUSxHQUFHLGtCQUFrQixFQUFFLElBQUksR0FBRyxvZ0NBQW9nQyxFQUFFLEVBQUUsR0FBRyxvZ0NBQW9nQyxFQUFFLFFBQVEsR0FBRztBQUMxbUUsRUFBRSxTQUFTLEVBQUUsRUFBRTtBQUNmLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDYixFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ1gsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2QsRUFBRSxRQUFRLEVBQUUsRUFBRTtBQUNkLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUztBQUNsQixFQUFFLElBQUksRUFBRSxTQUFTO0FBQ2pCLEVBQUUsTUFBTSxFQUFFLEtBQUs7QUFDZixDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEdBQUcsSUFBSSxFQUFFLFlBQVksR0FBRyxpQkFBaUIsRUFBRSxlQUFlLEdBQUcsWUFBWSxHQUFHLG9CQUFvQixFQUFFLHNCQUFzQixHQUFHLFlBQVksR0FBRywwQkFBMEIsRUFBRSxpQkFBaUIsR0FBRyxZQUFZLEdBQUcsb0JBQW9CLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxHQUFHLDRDQUE0QyxFQUFFLEtBQUssR0FBRyx3REFBd0QsRUFBRSxPQUFPLEdBQUcsK0NBQStDLEVBQUUsU0FBUyxHQUFHLG9DQUFvQyxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsR0FBRyxnQkFBZ0IsRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQy9xQixDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsV0FBVztBQUNyQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3BCLEVBQUUsT0FBTyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsRUFBRTtBQUNuQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ2xCLElBQUksT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckYsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDZixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2xCLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDbEIsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FB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TUFBTTtBQUNULElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsSUFBSSxJQUFJLE9BQU8sRUFBRSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxRSxJQUFJLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDbEIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDdEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNyQixFQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUNG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LElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEVBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUNuQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUNoQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDUixFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNULEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUk7QUFDckIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDO0FBQ3pCLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDMUMsUUFBUSxDQUFDO0FBQ1QsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDO0FBQ1AsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtB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LENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUNyRixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM5QixJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkUsR0FBRztBQUNILEVBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUNuQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDNUIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNmLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDcEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNuQixLQUFLLE1BQU07QUFDWCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0MsS0FBSztBQUNMLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLEdBQUcsTUFBTTtBQUNULElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLEdBQUc7QUFDSCxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztBQUNoQyxFQUFFLFdBQVc7QUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkQsSUFBSSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDckYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsQyxNQUFNLElBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO0FBQzlDLFFBQVEsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNsQixVQUFVLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxVQUFVLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFlBQVksTUFBTTtBQUNsQixXQUFXO0FBQ1gsU0FBUztBQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoQixRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDaEIsT0FBTyxNQUFNO0FBQ2IsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7QUFDdkQsVUFBVSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxTQUFTO0FBQ1QsUUFBUSxNQUFNO0FBQ2QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXO0FBQy9CLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDN0MsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUNuQixJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDaEIsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDdEIsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNyQixFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUMzQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDckIsRUFBRSxPQUFPLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlFLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsRUFBRTtBQUM5QixFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RDLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMvRyxHQUFHO0FBQ0gsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7QUFDNUQsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNsQixFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2xCLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFO0FBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNaLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNYLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNiLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNkLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLEdBQUc7QUFDSCxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDVCxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNsQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUk7QUFDNUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUk7QUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUM1QixNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUMzQixLQUFLO0FBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDckMsR0FBRztBQUNILEVBQUUsT0FBTyxD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Q0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLEdBQUc7QUFDSCxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0csRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN0QixFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbEIsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDN0MsRUFBRSxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFDRixDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtBQUM5QixFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUNyQyxFQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtBQUNqQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNaLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3ZCLEdBQUcsTUFBTTtBQUNULElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxFQUFFLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDdkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN6QixLQUFLLE1BQU07QUFDWCxNQUFNLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNCLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNaLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNkLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNiLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2QsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQixHQUFHLE1BQU07QUFDVCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLEdBQUc7QUFDSCxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDLFFBQVEsR0FBRyxXQUFXO0FBQ3hCLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNmLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzdCLEVBQUUsT0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxFQUFFO0FBQ2hDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyQyxFQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUN0QixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3JCLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLElBQUksT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvQixFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUNoQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxnQkFBZ0IsRUFBRTtBQUMxRSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0IsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM5RCxHQUFHO0FBQ0gsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNWLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2IsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDO0FBQzFCLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNkLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDZixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0QixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakksRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0FBQzVDLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkMsRUFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ25CLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDWCxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbEIsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekYsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUNuRSxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNsQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFDRixDQUFDLENBQUMsV0FBVyxHQUFHLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNqQyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDMUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNyQixJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRSxHQUFHLE1BQU07QUFDVCxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLElBQUksSUFBSSxFQUFFLEtBQUssS0FBSyxDQUFDO0FBQ3JCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDekI7QUFDQSxNQUFNLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNCLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdEMsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsR0FBRztBQUNILEVBQUUsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDcEQsQ0FBQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ2xELEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxFQUFFLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDckIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3ZCLEdBQUcsTUFBTTtBQUNULElBQUksVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbEMsSUFBSSxJQUFJLEVBQUUsS0FBSyxLQUFLLENBQUM7QUFDckIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN6QjtBQUNBLE1BQU0sVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0IsR0FBRztBQUNILEVBQUUsT0FBTyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxRQUFRLEdBQUcsV0FBVztBQUN4QixFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNwRCxDQUFDLENBQUM7QUFDRixDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVztBQUNuQyxFQUFFLE9BQU8sUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUM7QUFDRixDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUNsQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQyxDQUFDLENBQUM7QUFDRixTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUU7QUFDM0IsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLGVBQWUsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFH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QyxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztBQUNoQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQixHQUFHO0FBQ0gsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDMUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUssSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3hDLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxF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QUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNySCxNQUFNLE9BQU8sR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLFdBQVcsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxXQUFXLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdlAsTUFBTSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUIsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFRLElBQUksT0FBTyxFQUFFO0FBQ3JCLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLFFBQVEs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LENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsTUFBTTtBQUNULElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsR0FBRztBQUNILEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsRUFBRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQ3ZCLEVBQUUsSUFBSSxPQUFPLEVBQUU7QUFDZixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JELEdBQUc7QUFDSCxFQUFFLEVBQUUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNyQixFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMvQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNiLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNYLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxH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SSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxXQUFXO0FBQ2IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEQsSUFBSSxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQzNCLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDMUMsUUFBUSxDQUFDO0FBQ1QsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakIsUUFBUSxNQUFNO0FBQ2QsS0FBSztBQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVWLEdBQUc7QUFDSCxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUM7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QyxDQUFDLEVBQUU7QUFDaEIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFDRCxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDakIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFDRCxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDbEIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLENBQUM7QUFDRCxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDckIsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvRCxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDekQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsR0FBRyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUNqQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLEdBQUcsTUFBTTtBQUNULElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsR0FBRztBQUNILEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ2pCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFF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RSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN6QixFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLEVBQUUsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbkIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLEVBQUUsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDdkIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDM0IsRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN6QixFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixF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cEIsTUFBTSxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN4QixHQUFHO0FBQ0gsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsQixFQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7QUFDbkQsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNoQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ2pCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2xCLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN6RCxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUN4QixJQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3JDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixFQUFFLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDOzs7OyJ9
