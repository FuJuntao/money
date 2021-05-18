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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjaW1hbGpzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZGVjaW1hbC5qc0AxMC4yLjEvbm9kZV9tb2R1bGVzL2RlY2ltYWwuanMvZGVjaW1hbC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIEVYUF9MSU1JVCA9IDllMTUsIE1BWF9ESUdJVFMgPSAxZTksIE5VTUVSQUxTID0gXCIwMTIzNDU2Nzg5YWJjZGVmXCIsIExOMTAgPSBcIjIuMzAyNTg1MDkyOTk0MDQ1Njg0MDE3OTkxNDU0Njg0MzY0MjA3NjAxMTAxNDg4NjI4NzcyOTc2MDMzMzI3OTAwOTY3NTcyNjA5Njc3MzUyNDgwMjM1OTk3MjA1MDg5NTk4Mjk4MzQxOTY3Nzg0MDQyMjg2MjQ4NjMzNDA5NTI1NDY1MDgyODA2NzU2NjY2Mjg3MzY5MDk4NzgxNjg5NDgyOTA3MjA4MzI1NTU0NjgwODQzNzk5ODk0ODI2MjMzMTk4NTI4MzkzNTA1MzA4OTY1Mzc3NzMyNjI4ODQ2MTYzMzY2MjIyMjg3Njk4MjE5ODg2NzQ2NTQzNjY3NDc0NDA0MjQzMjc0MzY1MTU1MDQ4OTM0MzE0OTM5MzkxNDc5NjE5NDA0NDAwMjIyMTA1MTAxNzE0MTc0ODAwMzY4ODA4NDAxMjY0NzA4MDY4NTU2Nzc0MzIxNjIyODM1NTIyMDExNDgwNDY2MzcxNTY1OTEyMTM3MzQ1MDc0Nzg1Njk0NzY4MzQ2MzYxNjc5MjEwMTgwNjQ0NTA3MDY0ODAwMDI3NzUwMjY4NDkxNjc0NjU1MDU4Njg1NjkzNTY3MzQyMDY3MDU4MTEzNjQyOTIyNDU1NDQwNTc1ODkyNTcyNDIwODI0MTMxNDY5NTY4OTAxNjc1ODk0MDI1Njc3NjMxMTM1NjkxOTI5MjAzMzM3NjU4NzE0MTY2MDIzMDEwNTcwMzA4OTYzNDU3MjA3NTQ0MDM3MDg0NzQ2OTk0MDE2ODI2OTI4MjgwODQ4MTE4NDI4OTMxNDg0ODUyNDk0ODY0NDg3MTkyNzgwOTY3NjI3MTI3NTc3NTM5NzAyNzY2ODYwNTk1MjQ5NjcxNjY3NDE4MzQ4NTcwNDQyMjUwNzE5Nzk2NTAwNDcxNDk1MTA1MDQ5MjIxNDc3NjU2NzYzNjkzODY2Mjk3Njk3OTUyMjExMDcxODI2NDU0OTczNDc3MjY2MjQyNTcwOTQyOTMyMjU4Mjc5ODUwMjU4NTUwOTc4NTI2NTM4MzIwNzYwNjcyNjMxNzE2NDMwOTUwNTk5NTA4NzgwNzUyMzcxMDMzMzEwMTE5Nzg1NzU0NzMzMTU0MTQyMTgwODQyNzU0Mzg2MzU5MTc3ODExNzA1NDMwOTgyNzQ4MjM4NTA0NTY0ODAxOTA5NTYxMDI5OTI5MTgyNDMxODIzNzUyNTM1NzcwOTc1MDUzOTU2NTE4NzY5NzUxMDM3NDk3MDg4ODY5MjE4MDIwNTE4OTMzOTUwNzIzODUzOTIwNTE0NDYzNDE5NzI2NTI4NzI4Njk2NTExMDg2MjU3MTQ5MjE5ODg0OTk3ODc0ODg3Mzc3MTM0NTY4NjIwOTE2NzA1OFwiLCBQSSA9IFwiMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODQxOTcxNjkzOTkzNzUxMDU4MjA5NzQ5NDQ1OTIzMDc4MTY0MDYyODYyMDg5OTg2MjgwMzQ4MjUzNDIxMTcwNjc5ODIxNDgwODY1MTMyODIzMDY2NDcwOTM4NDQ2MDk1NTA1ODIyMzE3MjUzNTk0MDgxMjg0ODExMTc0NTAyODQxMDI3MDE5Mzg1MjExMDU1NTk2NDQ2MjI5NDg5NTQ5MzAzODE5NjQ0Mjg4MTA5NzU2NjU5MzM0NDYxMjg0NzU2NDgyMzM3ODY3ODMxNjUyNzEyMDE5MDkxNDU2NDg1NjY5MjM0NjAzNDg2MTA0NTQzMjY2NDgyMTMzOTM2MDcyNjAyNDkxNDEyNzM3MjQ1ODcwMDY2MDYzMTU1ODgxNzQ4ODE1MjA5MjA5NjI4MjkyNTQwOTE3MTUzNjQzNjc4OTI1OTAzNjAwMTEzMzA1MzA1NDg4MjA0NjY1MjEzODQxNDY5NTE5NDE1MTE2MDk0MzMwNTcyNzAzNjU3NTk1OTE5NTMwOTIxODYxMTczODE5MzI2MTE3OTMxMDUxMTg1NDgwNzQ0NjIzNzk5NjI3NDk1NjczNTE4ODU3NTI3MjQ4OTEyMjc5MzgxODMwMTE5NDkxMjk4MzM2NzMzNjI0NDA2NTY2NDMwODYwMjEzOTQ5NDYzOTUyMjQ3MzcxOTA3MDIxNzk4NjA5NDM3MDI3NzA1MzkyMTcxNzYyOTMxNzY3NTIzODQ2NzQ4MTg0Njc2Njk0MDUxMzIwMDA1NjgxMjcxNDUyNjM1NjA4Mjc3ODU3NzEzNDI3NTc3ODk2MDkxNzM2MzcxNzg3MjE0Njg0NDA5MDEyMjQ5NTM0MzAxNDY1NDk1ODUzNzEwNTA3OTIyNzk2ODkyNTg5MjM1NDIwMTk5NTYxMTIxMjkwMjE5NjA4NjQwMzQ0MTgxNTk4MTM2Mjk3NzQ3NzEzMDk5NjA1MTg3MDcyMTEzNDk5OTk5OTgzNzI5NzgwNDk5NTEwNTk3MzE3MzI4MTYwOTYzMTg1OTUwMjQ0NTk0NTUzNDY5MDgzMDI2NDI1MjIzMDgyNTMzNDQ2ODUwMzUyNjE5MzExODgxNzEwMTAwMDMxMzc4Mzg3NTI4ODY1ODc1MzMyMDgzODE0MjA2MTcxNzc2NjkxNDczMDM1OTgyNTM0OTA0Mjg3NTU0Njg3MzExNTk1NjI4NjM4ODIzNTM3ODc1OTM3NTE5NTc3ODE4NTc3ODA1MzIxNzEyMjY4MDY2MTMwMDE5Mjc4NzY2MTExOTU5MDkyMTY0MjAxOTg5MzgwOTUyNTcyMDEwNjU0ODU4NjMyNzg5XCIsIERFRkFVTFRTID0ge1xuICBwcmVjaXNpb246IDIwLFxuICByb3VuZGluZzogNCxcbiAgbW9kdWxvOiAxLFxuICB0b0V4cE5lZzogLTcsXG4gIHRvRXhwUG9zOiAyMSxcbiAgbWluRTogLUVYUF9MSU1JVCxcbiAgbWF4RTogRVhQX0xJTUlULFxuICBjcnlwdG86IGZhbHNlXG59LCBpbmV4YWN0LCBxdWFkcmFudCwgZXh0ZXJuYWwgPSB0cnVlLCBkZWNpbWFsRXJyb3IgPSBcIltEZWNpbWFsRXJyb3JdIFwiLCBpbnZhbGlkQXJndW1lbnQgPSBkZWNpbWFsRXJyb3IgKyBcIkludmFsaWQgYXJndW1lbnQ6IFwiLCBwcmVjaXNpb25MaW1pdEV4Y2VlZGVkID0gZGVjaW1hbEVycm9yICsgXCJQcmVjaXNpb24gbGltaXQgZXhjZWVkZWRcIiwgY3J5cHRvVW5hdmFpbGFibGUgPSBkZWNpbWFsRXJyb3IgKyBcImNyeXB0byB1bmF2YWlsYWJsZVwiLCBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLCBtYXRocG93ID0gTWF0aC5wb3csIGlzQmluYXJ5ID0gL14wYihbMDFdKyhcXC5bMDFdKik/fFxcLlswMV0rKShwWystXT9cXGQrKT8kL2ksIGlzSGV4ID0gL14weChbMC05YS1mXSsoXFwuWzAtOWEtZl0qKT98XFwuWzAtOWEtZl0rKShwWystXT9cXGQrKT8kL2ksIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSwgaXNEZWNpbWFsID0gL14oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/JC9pLCBCQVNFID0gMWU3LCBMT0dfQkFTRSA9IDcsIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxLCBMTjEwX1BSRUNJU0lPTiA9IExOMTAubGVuZ3RoIC0gMSwgUElfUFJFQ0lTSU9OID0gUEkubGVuZ3RoIC0gMSwgUCA9IHtuYW1lOiBcIltvYmplY3QgRGVjaW1hbF1cIn07XG5QLmFic29sdXRlVmFsdWUgPSBQLmFicyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xuICBpZiAoeC5zIDwgMClcbiAgICB4LnMgPSAxO1xuICByZXR1cm4gZmluYWxpc2UoeCk7XG59O1xuUC5jZWlsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMik7XG59O1xuUC5jb21wYXJlZFRvID0gUC5jbXAgPSBmdW5jdGlvbih5KSB7XG4gIHZhciBpLCBqLCB4ZEwsIHlkTCwgeCA9IHRoaXMsIHhkID0geC5kLCB5ZCA9ICh5ID0gbmV3IHguY29uc3RydWN0b3IoeSkpLmQsIHhzID0geC5zLCB5cyA9IHkucztcbiAgaWYgKCF4ZCB8fCAheWQpIHtcbiAgICByZXR1cm4gIXhzIHx8ICF5cyA/IE5hTiA6IHhzICE9PSB5cyA/IHhzIDogeGQgPT09IHlkID8gMCA6ICF4ZCBeIHhzIDwgMCA/IDEgOiAtMTtcbiAgfVxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSlcbiAgICByZXR1cm4geGRbMF0gPyB4cyA6IHlkWzBdID8gLXlzIDogMDtcbiAgaWYgKHhzICE9PSB5cylcbiAgICByZXR1cm4geHM7XG4gIGlmICh4LmUgIT09IHkuZSlcbiAgICByZXR1cm4geC5lID4geS5lIF4geHMgPCAwID8gMSA6IC0xO1xuICB4ZEwgPSB4ZC5sZW5ndGg7XG4gIHlkTCA9IHlkLmxlbmd0aDtcbiAgZm9yIChpID0gMCwgaiA9IHhkTCA8IHlkTCA/IHhkTCA6IHlkTDsgaSA8IGo7ICsraSkge1xuICAgIGlmICh4ZFtpXSAhPT0geWRbaV0pXG4gICAgICByZXR1cm4geGRbaV0gPiB5ZFtpXSBeIHhzIDwgMCA/IDEgOiAtMTtcbiAgfVxuICByZXR1cm4geGRMID09PSB5ZEwgPyAwIDogeGRMID4geWRMIF4geHMgPCAwID8gMSA6IC0xO1xufTtcblAuY29zaW5lID0gUC5jb3MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByLCBybSwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoIXguZClcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgaWYgKCF4LmRbMF0pXG4gICAgcmV0dXJuIG5ldyBDdG9yKDEpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XG4gIHggPSBjb3NpbmUoQ3RvciwgdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSk7XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xufTtcblAuY3ViZVJvb3QgPSBQLmNicnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGUsIG0sIG4sIHIsIHJlcCwgcywgc2QsIHQsIHQzLCB0M3BsdXN4LCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICBzID0geC5zICogbWF0aHBvdyh4LnMgKiB4LCAxIC8gMyk7XG4gIGlmICghcyB8fCBNYXRoLmFicyhzKSA9PSAxIC8gMCkge1xuICAgIG4gPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xuICAgIGUgPSB4LmU7XG4gICAgaWYgKHMgPSAoZSAtIG4ubGVuZ3RoICsgMSkgJSAzKVxuICAgICAgbiArPSBzID09IDEgfHwgcyA9PSAtMiA/IFwiMFwiIDogXCIwMFwiO1xuICAgIHMgPSBtYXRocG93KG4sIDEgLyAzKTtcbiAgICBlID0gbWF0aGZsb29yKChlICsgMSkgLyAzKSAtIChlICUgMyA9PSAoZSA8IDAgPyAtMSA6IDIpKTtcbiAgICBpZiAocyA9PSAxIC8gMCkge1xuICAgICAgbiA9IFwiNWVcIiArIGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcbiAgICAgIG4gPSBuLnNsaWNlKDAsIG4uaW5kZXhPZihcImVcIikgKyAxKSArIGU7XG4gICAgfVxuICAgIHIgPSBuZXcgQ3RvcihuKTtcbiAgICByLnMgPSB4LnM7XG4gIH0gZWxzZSB7XG4gICAgciA9IG5ldyBDdG9yKHMudG9TdHJpbmcoKSk7XG4gIH1cbiAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XG4gIGZvciAoOyA7ICkge1xuICAgIHQgPSByO1xuICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcbiAgICB0M3BsdXN4ID0gdDMucGx1cyh4KTtcbiAgICByID0gZGl2aWRlKHQzcGx1c3gucGx1cyh4KS50aW1lcyh0KSwgdDNwbHVzeC5wbHVzKHQzKSwgc2QgKyAyLCAxKTtcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XG4gICAgICBpZiAobiA9PSBcIjk5OTlcIiB8fCAhcmVwICYmIG4gPT0gXCI0OTk5XCIpIHtcbiAgICAgICAgaWYgKCFyZXApIHtcbiAgICAgICAgICBmaW5hbGlzZSh0LCBlICsgMSwgMCk7XG4gICAgICAgICAgaWYgKHQudGltZXModCkudGltZXModCkuZXEoeCkpIHtcbiAgICAgICAgICAgIHIgPSB0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNkICs9IDQ7XG4gICAgICAgIHJlcCA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSBcIjVcIikge1xuICAgICAgICAgIGZpbmFsaXNlKHIsIGUgKyAxLCAxKTtcbiAgICAgICAgICBtID0gIXIudGltZXMocikudGltZXMocikuZXEoeCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xufTtcblAuZGVjaW1hbFBsYWNlcyA9IFAuZHAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHcsIGQgPSB0aGlzLmQsIG4gPSBOYU47XG4gIGlmIChkKSB7XG4gICAgdyA9IGQubGVuZ3RoIC0gMTtcbiAgICBuID0gKHcgLSBtYXRoZmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpKSAqIExPR19CQVNFO1xuICAgIHcgPSBkW3ddO1xuICAgIGlmICh3KVxuICAgICAgZm9yICg7IHcgJSAxMCA9PSAwOyB3IC89IDEwKVxuICAgICAgICBuLS07XG4gICAgaWYgKG4gPCAwKVxuICAgICAgbiA9IDA7XG4gIH1cbiAgcmV0dXJuIG47XG59O1xuUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uKHkpIHtcbiAgcmV0dXJuIGRpdmlkZSh0aGlzLCBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih5KSk7XG59O1xuUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmRpdlRvSW50ID0gZnVuY3Rpb24oeSkge1xuICB2YXIgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICByZXR1cm4gZmluYWxpc2UoZGl2aWRlKHgsIG5ldyBDdG9yKHkpLCAwLCAxLCAxKSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xufTtcblAuZXF1YWxzID0gUC5lcSA9IGZ1bmN0aW9uKHkpIHtcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xufTtcblAuZmxvb3IgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAzKTtcbn07XG5QLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uKHkpIHtcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcbn07XG5QLmdyZWF0ZXJUaGFuT3JFcXVhbFRvID0gUC5ndGUgPSBmdW5jdGlvbih5KSB7XG4gIHZhciBrID0gdGhpcy5jbXAoeSk7XG4gIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcbn07XG5QLmh5cGVyYm9saWNDb3NpbmUgPSBQLmNvc2ggPSBmdW5jdGlvbigpIHtcbiAgdmFyIGssIG4sIHByLCBybSwgbGVuLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3IsIG9uZSA9IG5ldyBDdG9yKDEpO1xuICBpZiAoIXguaXNGaW5pdGUoKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5zID8gMSAvIDAgOiBOYU4pO1xuICBpZiAoeC5pc1plcm8oKSlcbiAgICByZXR1cm4gb25lO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgbGVuID0geC5kLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDMyKSB7XG4gICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcbiAgICBuID0gKDEgLyB0aW55UG93KDQsIGspKS50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIGsgPSAxNjtcbiAgICBuID0gXCIyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwXCI7XG4gIH1cbiAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAxLCB4LnRpbWVzKG4pLCBuZXcgQ3RvcigxKSwgdHJ1ZSk7XG4gIHZhciBjb3NoMl94LCBpID0gaywgZDggPSBuZXcgQ3Rvcig4KTtcbiAgZm9yICg7IGktLTsgKSB7XG4gICAgY29zaDJfeCA9IHgudGltZXMoeCk7XG4gICAgeCA9IG9uZS5taW51cyhjb3NoMl94LnRpbWVzKGQ4Lm1pbnVzKGNvc2gyX3gudGltZXMoZDgpKSkpO1xuICB9XG4gIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xufTtcblAuaHlwZXJib2xpY1NpbmUgPSBQLnNpbmggPSBmdW5jdGlvbigpIHtcbiAgdmFyIGssIHByLCBybSwgbGVuLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgbGVuID0geC5kLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDMpIHtcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcbiAgICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcbiAgICB4ID0geC50aW1lcygxIC8gdGlueVBvdyg1LCBrKSk7XG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcbiAgICB2YXIgc2luaDJfeCwgZDUgPSBuZXcgQ3Rvcig1KSwgZDE2ID0gbmV3IEN0b3IoMTYpLCBkMjAgPSBuZXcgQ3RvcigyMCk7XG4gICAgZm9yICg7IGstLTsgKSB7XG4gICAgICBzaW5oMl94ID0geC50aW1lcyh4KTtcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xuICAgIH1cbiAgfVxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBDdG9yLnJvdW5kaW5nID0gcm07XG4gIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0sIHRydWUpO1xufTtcblAuaHlwZXJib2xpY1RhbmdlbnQgPSBQLnRhbmggPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByLCBybSwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICBpZiAoIXguaXNGaW5pdGUoKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5zKTtcbiAgaWYgKHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA3O1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgcmV0dXJuIGRpdmlkZSh4LnNpbmgoKSwgeC5jb3NoKCksIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSk7XG59O1xuUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYWxmUGksIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvciwgayA9IHguYWJzKCkuY21wKDEpLCBwciA9IEN0b3IucHJlY2lzaW9uLCBybSA9IEN0b3Iucm91bmRpbmc7XG4gIGlmIChrICE9PSAtMSkge1xuICAgIHJldHVybiBrID09PSAwID8geC5pc05lZygpID8gZ2V0UGkoQ3RvciwgcHIsIHJtKSA6IG5ldyBDdG9yKDApIDogbmV3IEN0b3IoTmFOKTtcbiAgfVxuICBpZiAoeC5pc1plcm8oKSlcbiAgICByZXR1cm4gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICB4ID0geC5hc2luKCk7XG4gIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIGhhbGZQaS5taW51cyh4KTtcbn07XG5QLmludmVyc2VIeXBlcmJvbGljQ29zaW5lID0gUC5hY29zaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHIsIHJtLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICh4Lmx0ZSgxKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5lcSgxKSA/IDAgOiBOYU4pO1xuICBpZiAoIXguaXNGaW5pdGUoKSlcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KE1hdGguYWJzKHguZSksIHguc2QoKSkgKyA0O1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgeCA9IHgudGltZXMoeCkubWludXMoMSkuc3FydCgpLnBsdXMoeCk7XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4geC5sbigpO1xufTtcblAuaW52ZXJzZUh5cGVyYm9saWNTaW5lID0gUC5hc2luaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHIsIHJtLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyAyICogTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDY7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICB4ID0geC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKHgpO1xuICBleHRlcm5hbCA9IHRydWU7XG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIHgubG4oKTtcbn07XG5QLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByLCBybSwgd3ByLCB4c2QsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4LmlzRmluaXRlKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKE5hTik7XG4gIGlmICh4LmUgPj0gMClcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5hYnMoKS5lcSgxKSA/IHgucyAvIDAgOiB4LmlzWmVybygpID8geCA6IE5hTik7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgeHNkID0geC5zZCgpO1xuICBpZiAoTWF0aC5tYXgoeHNkLCBwcikgPCAyICogLXguZSAtIDEpXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBwciwgcm0sIHRydWUpO1xuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHhzZCAtIHguZTtcbiAgeCA9IGRpdmlkZSh4LnBsdXMoMSksIG5ldyBDdG9yKDEpLm1pbnVzKHgpLCB3cHIgKyBwciwgMSk7XG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA0O1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgeCA9IHgubG4oKTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4geC50aW1lcygwLjUpO1xufTtcblAuaW52ZXJzZVNpbmUgPSBQLmFzaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbGZQaSwgaywgcHIsIHJtLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmICh4LmlzWmVybygpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcbiAgayA9IHguYWJzKCkuY21wKDEpO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIGlmIChrICE9PSAtMSkge1xuICAgIGlmIChrID09PSAwKSB7XG4gICAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xuICAgICAgaGFsZlBpLnMgPSB4LnM7XG4gICAgICByZXR1cm4gaGFsZlBpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgfVxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XG4gIHggPSB4LmRpdihuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCkucGx1cygxKSkuYXRhbigpO1xuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBDdG9yLnJvdW5kaW5nID0gcm07XG4gIHJldHVybiB4LnRpbWVzKDIpO1xufTtcblAuaW52ZXJzZVRhbmdlbnQgPSBQLmF0YW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGksIGosIGssIG4sIHB4LCB0LCByLCB3cHIsIHgyLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3IsIHByID0gQ3Rvci5wcmVjaXNpb24sIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHtcbiAgICBpZiAoIXgucylcbiAgICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xuICAgIGlmIChwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XG4gICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcbiAgICAgIHIucyA9IHgucztcbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgfSBlbHNlIGlmICh4LmlzWmVybygpKSB7XG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xuICB9IGVsc2UgaWYgKHguYWJzKCkuZXEoMSkgJiYgcHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xuICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjI1KTtcbiAgICByLnMgPSB4LnM7XG4gICAgcmV0dXJuIHI7XG4gIH1cbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgPSBwciArIDEwO1xuICBDdG9yLnJvdW5kaW5nID0gMTtcbiAgayA9IE1hdGgubWluKDI4LCB3cHIgLyBMT0dfQkFTRSArIDIgfCAwKTtcbiAgZm9yIChpID0gazsgaTsgLS1pKVxuICAgIHggPSB4LmRpdih4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoMSkpO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcbiAgbiA9IDE7XG4gIHgyID0geC50aW1lcyh4KTtcbiAgciA9IG5ldyBDdG9yKHgpO1xuICBweCA9IHg7XG4gIGZvciAoOyBpICE9PSAtMTsgKSB7XG4gICAgcHggPSBweC50aW1lcyh4Mik7XG4gICAgdCA9IHIubWludXMocHguZGl2KG4gKz0gMikpO1xuICAgIHB4ID0gcHgudGltZXMoeDIpO1xuICAgIHIgPSB0LnBsdXMocHguZGl2KG4gKz0gMikpO1xuICAgIGlmIChyLmRbal0gIT09IHZvaWQgMClcbiAgICAgIGZvciAoaSA9IGo7IHIuZFtpXSA9PT0gdC5kW2ldICYmIGktLTsgKVxuICAgICAgICA7XG4gIH1cbiAgaWYgKGspXG4gICAgciA9IHIudGltZXMoMiA8PCBrIC0gMSk7XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSwgdHJ1ZSk7XG59O1xuUC5pc0Zpbml0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gISF0aGlzLmQ7XG59O1xuUC5pc0ludGVnZXIgPSBQLmlzSW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhIXRoaXMuZCAmJiBtYXRoZmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpID4gdGhpcy5kLmxlbmd0aCAtIDI7XG59O1xuUC5pc05hTiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMucztcbn07XG5QLmlzTmVnYXRpdmUgPSBQLmlzTmVnID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnMgPCAwO1xufTtcblAuaXNQb3NpdGl2ZSA9IFAuaXNQb3MgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucyA+IDA7XG59O1xuUC5pc1plcm8gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICEhdGhpcy5kICYmIHRoaXMuZFswXSA9PT0gMDtcbn07XG5QLmxlc3NUaGFuID0gUC5sdCA9IGZ1bmN0aW9uKHkpIHtcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMDtcbn07XG5QLmxlc3NUaGFuT3JFcXVhbFRvID0gUC5sdGUgPSBmdW5jdGlvbih5KSB7XG4gIHJldHVybiB0aGlzLmNtcCh5KSA8IDE7XG59O1xuUC5sb2dhcml0aG0gPSBQLmxvZyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgdmFyIGlzQmFzZTEwLCBkLCBkZW5vbWluYXRvciwgaywgaW5mLCBudW0sIHNkLCByLCBhcmcgPSB0aGlzLCBDdG9yID0gYXJnLmNvbnN0cnVjdG9yLCBwciA9IEN0b3IucHJlY2lzaW9uLCBybSA9IEN0b3Iucm91bmRpbmcsIGd1YXJkID0gNTtcbiAgaWYgKGJhc2UgPT0gbnVsbCkge1xuICAgIGJhc2UgPSBuZXcgQ3RvcigxMCk7XG4gICAgaXNCYXNlMTAgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGJhc2UgPSBuZXcgQ3RvcihiYXNlKTtcbiAgICBkID0gYmFzZS5kO1xuICAgIGlmIChiYXNlLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGJhc2UuZXEoMSkpXG4gICAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgICBpc0Jhc2UxMCA9IGJhc2UuZXEoMTApO1xuICB9XG4gIGQgPSBhcmcuZDtcbiAgaWYgKGFyZy5zIDwgMCB8fCAhZCB8fCAhZFswXSB8fCBhcmcuZXEoMSkpIHtcbiAgICByZXR1cm4gbmV3IEN0b3IoZCAmJiAhZFswXSA/IC0xIC8gMCA6IGFyZy5zICE9IDEgPyBOYU4gOiBkID8gMCA6IDEgLyAwKTtcbiAgfVxuICBpZiAoaXNCYXNlMTApIHtcbiAgICBpZiAoZC5sZW5ndGggPiAxKSB7XG4gICAgICBpbmYgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGsgPSBkWzBdOyBrICUgMTAgPT09IDA7IClcbiAgICAgICAgayAvPSAxMDtcbiAgICAgIGluZiA9IGsgIT09IDE7XG4gICAgfVxuICB9XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIHNkID0gcHIgKyBndWFyZDtcbiAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcbiAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcbiAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XG4gIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayA9IHByLCBybSkpIHtcbiAgICBkbyB7XG4gICAgICBzZCArPSAxMDtcbiAgICAgIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XG4gICAgICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xuICAgICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XG4gICAgICBpZiAoIWluZikge1xuICAgICAgICBpZiAoK2RpZ2l0c1RvU3RyaW5nKHIuZCkuc2xpY2UoayArIDEsIGsgKyAxNSkgKyAxID09IDFlMTQpIHtcbiAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayArPSAxMCwgcm0pKTtcbiAgfVxuICBleHRlcm5hbCA9IHRydWU7XG4gIHJldHVybiBmaW5hbGlzZShyLCBwciwgcm0pO1xufTtcblAubWludXMgPSBQLnN1YiA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIHkgPSBuZXcgQ3Rvcih5KTtcbiAgaWYgKCF4LmQgfHwgIXkuZCkge1xuICAgIGlmICgheC5zIHx8ICF5LnMpXG4gICAgICB5ID0gbmV3IEN0b3IoTmFOKTtcbiAgICBlbHNlIGlmICh4LmQpXG4gICAgICB5LnMgPSAteS5zO1xuICAgIGVsc2VcbiAgICAgIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zICE9PSB5LnMgPyB4IDogTmFOKTtcbiAgICByZXR1cm4geTtcbiAgfVxuICBpZiAoeC5zICE9IHkucykge1xuICAgIHkucyA9IC15LnM7XG4gICAgcmV0dXJuIHgucGx1cyh5KTtcbiAgfVxuICB4ZCA9IHguZDtcbiAgeWQgPSB5LmQ7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcbiAgICBpZiAoeWRbMF0pXG4gICAgICB5LnMgPSAteS5zO1xuICAgIGVsc2UgaWYgKHhkWzBdKVxuICAgICAgeSA9IG5ldyBDdG9yKHgpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XG4gIH1cbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XG4gIHhlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcbiAgeGQgPSB4ZC5zbGljZSgpO1xuICBrID0geGUgLSBlO1xuICBpZiAoaykge1xuICAgIHhMVHkgPSBrIDwgMDtcbiAgICBpZiAoeExUeSkge1xuICAgICAgZCA9IHhkO1xuICAgICAgayA9IC1rO1xuICAgICAgbGVuID0geWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBkID0geWQ7XG4gICAgICBlID0geGU7XG4gICAgICBsZW4gPSB4ZC5sZW5ndGg7XG4gICAgfVxuICAgIGkgPSBNYXRoLm1heChNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSksIGxlbikgKyAyO1xuICAgIGlmIChrID4gaSkge1xuICAgICAgayA9IGk7XG4gICAgICBkLmxlbmd0aCA9IDE7XG4gICAgfVxuICAgIGQucmV2ZXJzZSgpO1xuICAgIGZvciAoaSA9IGs7IGktLTsgKVxuICAgICAgZC5wdXNoKDApO1xuICAgIGQucmV2ZXJzZSgpO1xuICB9IGVsc2Uge1xuICAgIGkgPSB4ZC5sZW5ndGg7XG4gICAgbGVuID0geWQubGVuZ3RoO1xuICAgIHhMVHkgPSBpIDwgbGVuO1xuICAgIGlmICh4TFR5KVxuICAgICAgbGVuID0gaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh4ZFtpXSAhPSB5ZFtpXSkge1xuICAgICAgICB4TFR5ID0geGRbaV0gPCB5ZFtpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGsgPSAwO1xuICB9XG4gIGlmICh4TFR5KSB7XG4gICAgZCA9IHhkO1xuICAgIHhkID0geWQ7XG4gICAgeWQgPSBkO1xuICAgIHkucyA9IC15LnM7XG4gIH1cbiAgbGVuID0geGQubGVuZ3RoO1xuICBmb3IgKGkgPSB5ZC5sZW5ndGggLSBsZW47IGkgPiAwOyAtLWkpXG4gICAgeGRbbGVuKytdID0gMDtcbiAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazsgKSB7XG4gICAgaWYgKHhkWy0taV0gPCB5ZFtpXSkge1xuICAgICAgZm9yIChqID0gaTsgaiAmJiB4ZFstLWpdID09PSAwOyApXG4gICAgICAgIHhkW2pdID0gQkFTRSAtIDE7XG4gICAgICAtLXhkW2pdO1xuICAgICAgeGRbaV0gKz0gQkFTRTtcbiAgICB9XG4gICAgeGRbaV0gLT0geWRbaV07XG4gIH1cbiAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDsgKVxuICAgIHhkLnBvcCgpO1xuICBmb3IgKDsgeGRbMF0gPT09IDA7IHhkLnNoaWZ0KCkpXG4gICAgLS1lO1xuICBpZiAoIXhkWzBdKVxuICAgIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XG4gIHkuZCA9IHhkO1xuICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgZSk7XG4gIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xufTtcblAubW9kdWxvID0gUC5tb2QgPSBmdW5jdGlvbih5KSB7XG4gIHZhciBxLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIHkgPSBuZXcgQ3Rvcih5KTtcbiAgaWYgKCF4LmQgfHwgIXkucyB8fCB5LmQgJiYgIXkuZFswXSlcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgaWYgKCF5LmQgfHwgeC5kICYmICF4LmRbMF0pIHtcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcbiAgfVxuICBleHRlcm5hbCA9IGZhbHNlO1xuICBpZiAoQ3Rvci5tb2R1bG8gPT0gOSkge1xuICAgIHEgPSBkaXZpZGUoeCwgeS5hYnMoKSwgMCwgMywgMSk7XG4gICAgcS5zICo9IHkucztcbiAgfSBlbHNlIHtcbiAgICBxID0gZGl2aWRlKHgsIHksIDAsIEN0b3IubW9kdWxvLCAxKTtcbiAgfVxuICBxID0gcS50aW1lcyh5KTtcbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICByZXR1cm4geC5taW51cyhxKTtcbn07XG5QLm5hdHVyYWxFeHBvbmVudGlhbCA9IFAuZXhwID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuYXR1cmFsRXhwb25lbnRpYWwodGhpcyk7XG59O1xuUC5uYXR1cmFsTG9nYXJpdGhtID0gUC5sbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmF0dXJhbExvZ2FyaXRobSh0aGlzKTtcbn07XG5QLm5lZ2F0ZWQgPSBQLm5lZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xuICB4LnMgPSAteC5zO1xuICByZXR1cm4gZmluYWxpc2UoeCk7XG59O1xuUC5wbHVzID0gUC5hZGQgPSBmdW5jdGlvbih5KSB7XG4gIHZhciBjYXJyeSwgZCwgZSwgaSwgaywgbGVuLCBwciwgcm0sIHhkLCB5ZCwgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICB5ID0gbmV3IEN0b3IoeSk7XG4gIGlmICgheC5kIHx8ICF5LmQpIHtcbiAgICBpZiAoIXgucyB8fCAheS5zKVxuICAgICAgeSA9IG5ldyBDdG9yKE5hTik7XG4gICAgZWxzZSBpZiAoIXguZClcbiAgICAgIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zID09PSB5LnMgPyB4IDogTmFOKTtcbiAgICByZXR1cm4geTtcbiAgfVxuICBpZiAoeC5zICE9IHkucykge1xuICAgIHkucyA9IC15LnM7XG4gICAgcmV0dXJuIHgubWludXMoeSk7XG4gIH1cbiAgeGQgPSB4LmQ7XG4gIHlkID0geS5kO1xuICBwciA9IEN0b3IucHJlY2lzaW9uO1xuICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIGlmICgheGRbMF0gfHwgIXlkWzBdKSB7XG4gICAgaWYgKCF5ZFswXSlcbiAgICAgIHkgPSBuZXcgQ3Rvcih4KTtcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcbiAgfVxuICBrID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XG4gIHhkID0geGQuc2xpY2UoKTtcbiAgaSA9IGsgLSBlO1xuICBpZiAoaSkge1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgZCA9IHhkO1xuICAgICAgaSA9IC1pO1xuICAgICAgbGVuID0geWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBkID0geWQ7XG4gICAgICBlID0gaztcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcbiAgICB9XG4gICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcbiAgICBsZW4gPSBrID4gbGVuID8gayArIDEgOiBsZW4gKyAxO1xuICAgIGlmIChpID4gbGVuKSB7XG4gICAgICBpID0gbGVuO1xuICAgICAgZC5sZW5ndGggPSAxO1xuICAgIH1cbiAgICBkLnJldmVyc2UoKTtcbiAgICBmb3IgKDsgaS0tOyApXG4gICAgICBkLnB1c2goMCk7XG4gICAgZC5yZXZlcnNlKCk7XG4gIH1cbiAgbGVuID0geGQubGVuZ3RoO1xuICBpID0geWQubGVuZ3RoO1xuICBpZiAobGVuIC0gaSA8IDApIHtcbiAgICBpID0gbGVuO1xuICAgIGQgPSB5ZDtcbiAgICB5ZCA9IHhkO1xuICAgIHhkID0gZDtcbiAgfVxuICBmb3IgKGNhcnJ5ID0gMDsgaTsgKSB7XG4gICAgY2FycnkgPSAoeGRbLS1pXSA9IHhkW2ldICsgeWRbaV0gKyBjYXJyeSkgLyBCQVNFIHwgMDtcbiAgICB4ZFtpXSAlPSBCQVNFO1xuICB9XG4gIGlmIChjYXJyeSkge1xuICAgIHhkLnVuc2hpZnQoY2FycnkpO1xuICAgICsrZTtcbiAgfVxuICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgeGRbLS1sZW5dID09IDA7IClcbiAgICB4ZC5wb3AoKTtcbiAgeS5kID0geGQ7XG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XG59O1xuUC5wcmVjaXNpb24gPSBQLnNkID0gZnVuY3Rpb24oeikge1xuICB2YXIgaywgeCA9IHRoaXM7XG4gIGlmICh6ICE9PSB2b2lkIDAgJiYgeiAhPT0gISF6ICYmIHogIT09IDEgJiYgeiAhPT0gMClcbiAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB6KTtcbiAgaWYgKHguZCkge1xuICAgIGsgPSBnZXRQcmVjaXNpb24oeC5kKTtcbiAgICBpZiAoeiAmJiB4LmUgKyAxID4gaylcbiAgICAgIGsgPSB4LmUgKyAxO1xuICB9IGVsc2Uge1xuICAgIGsgPSBOYU47XG4gIH1cbiAgcmV0dXJuIGs7XG59O1xuUC5yb3VuZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHguZSArIDEsIEN0b3Iucm91bmRpbmcpO1xufTtcblAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwciwgcm0sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4LmlzRmluaXRlKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKE5hTik7XG4gIGlmICh4LmlzWmVybygpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgTE9HX0JBU0U7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICB4ID0gc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xuICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPiAyID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XG59O1xuUC5zcXVhcmVSb290ID0gUC5zcXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtLCBuLCBzZCwgciwgcmVwLCB0LCB4ID0gdGhpcywgZCA9IHguZCwgZSA9IHguZSwgcyA9IHgucywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmIChzICE9PSAxIHx8ICFkIHx8ICFkWzBdKSB7XG4gICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xuICB9XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIHMgPSBNYXRoLnNxcnQoK3gpO1xuICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcbiAgICBuID0gZGlnaXRzVG9TdHJpbmcoZCk7XG4gICAgaWYgKChuLmxlbmd0aCArIGUpICUgMiA9PSAwKVxuICAgICAgbiArPSBcIjBcIjtcbiAgICBzID0gTWF0aC5zcXJ0KG4pO1xuICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDIpIC0gKGUgPCAwIHx8IGUgJSAyKTtcbiAgICBpZiAocyA9PSAxIC8gMCkge1xuICAgICAgbiA9IFwiNWVcIiArIGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcbiAgICAgIG4gPSBuLnNsaWNlKDAsIG4uaW5kZXhPZihcImVcIikgKyAxKSArIGU7XG4gICAgfVxuICAgIHIgPSBuZXcgQ3RvcihuKTtcbiAgfSBlbHNlIHtcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcbiAgfVxuICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcbiAgZm9yICg7IDsgKSB7XG4gICAgdCA9IHI7XG4gICAgciA9IHQucGx1cyhkaXZpZGUoeCwgdCwgc2QgKyAyLCAxKSkudGltZXMoMC41KTtcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XG4gICAgICBpZiAobiA9PSBcIjk5OTlcIiB8fCAhcmVwICYmIG4gPT0gXCI0OTk5XCIpIHtcbiAgICAgICAgaWYgKCFyZXApIHtcbiAgICAgICAgICBmaW5hbGlzZSh0LCBlICsgMSwgMCk7XG4gICAgICAgICAgaWYgKHQudGltZXModCkuZXEoeCkpIHtcbiAgICAgICAgICAgIHIgPSB0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNkICs9IDQ7XG4gICAgICAgIHJlcCA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSBcIjVcIikge1xuICAgICAgICAgIGZpbmFsaXNlKHIsIGUgKyAxLCAxKTtcbiAgICAgICAgICBtID0gIXIudGltZXMocikuZXEoeCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xufTtcblAudGFuZ2VudCA9IFAudGFuID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwciwgcm0sIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4LmlzRmluaXRlKCkpXG4gICAgcmV0dXJuIG5ldyBDdG9yKE5hTik7XG4gIGlmICh4LmlzWmVybygpKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICBDdG9yLnByZWNpc2lvbiA9IHByICsgMTA7XG4gIEN0b3Iucm91bmRpbmcgPSAxO1xuICB4ID0geC5zaW4oKTtcbiAgeC5zID0gMTtcbiAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBDdG9yLnJvdW5kaW5nID0gcm07XG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA9PSAyIHx8IHF1YWRyYW50ID09IDQgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcbn07XG5QLnRpbWVzID0gUC5tdWwgPSBmdW5jdGlvbih5KSB7XG4gIHZhciBjYXJyeSwgZSwgaSwgaywgciwgckwsIHQsIHhkTCwgeWRMLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3IsIHhkID0geC5kLCB5ZCA9ICh5ID0gbmV3IEN0b3IoeSkpLmQ7XG4gIHkucyAqPSB4LnM7XG4gIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcbiAgICByZXR1cm4gbmV3IEN0b3IoIXkucyB8fCB4ZCAmJiAheGRbMF0gJiYgIXlkIHx8IHlkICYmICF5ZFswXSAmJiAheGQgPyBOYU4gOiAheGQgfHwgIXlkID8geS5zIC8gMCA6IHkucyAqIDApO1xuICB9XG4gIGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcbiAgeGRMID0geGQubGVuZ3RoO1xuICB5ZEwgPSB5ZC5sZW5ndGg7XG4gIGlmICh4ZEwgPCB5ZEwpIHtcbiAgICByID0geGQ7XG4gICAgeGQgPSB5ZDtcbiAgICB5ZCA9IHI7XG4gICAgckwgPSB4ZEw7XG4gICAgeGRMID0geWRMO1xuICAgIHlkTCA9IHJMO1xuICB9XG4gIHIgPSBbXTtcbiAgckwgPSB4ZEwgKyB5ZEw7XG4gIGZvciAoaSA9IHJMOyBpLS07IClcbiAgICByLnB1c2goMCk7XG4gIGZvciAoaSA9IHlkTDsgLS1pID49IDA7ICkge1xuICAgIGNhcnJ5ID0gMDtcbiAgICBmb3IgKGsgPSB4ZEwgKyBpOyBrID4gaTsgKSB7XG4gICAgICB0ID0gcltrXSArIHlkW2ldICogeGRbayAtIGkgLSAxXSArIGNhcnJ5O1xuICAgICAgcltrLS1dID0gdCAlIEJBU0UgfCAwO1xuICAgICAgY2FycnkgPSB0IC8gQkFTRSB8IDA7XG4gICAgfVxuICAgIHJba10gPSAocltrXSArIGNhcnJ5KSAlIEJBU0UgfCAwO1xuICB9XG4gIGZvciAoOyAhclstLXJMXTsgKVxuICAgIHIucG9wKCk7XG4gIGlmIChjYXJyeSlcbiAgICArK2U7XG4gIGVsc2VcbiAgICByLnNoaWZ0KCk7XG4gIHkuZCA9IHI7XG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZykgOiB5O1xufTtcblAudG9CaW5hcnkgPSBmdW5jdGlvbihzZCwgcm0pIHtcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDIsIHNkLCBybSk7XG59O1xuUC50b0RlY2ltYWxQbGFjZXMgPSBQLnRvRFAgPSBmdW5jdGlvbihkcCwgcm0pIHtcbiAgdmFyIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgeCA9IG5ldyBDdG9yKHgpO1xuICBpZiAoZHAgPT09IHZvaWQgMClcbiAgICByZXR1cm4geDtcbiAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XG4gIGlmIChybSA9PT0gdm9pZCAwKVxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgZWxzZVxuICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xuICByZXR1cm4gZmluYWxpc2UoeCwgZHAgKyB4LmUgKyAxLCBybSk7XG59O1xuUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24oZHAsIHJtKSB7XG4gIHZhciBzdHIsIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGRwID09PSB2b2lkIDApIHtcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcbiAgICBpZiAocm0gPT09IHZvaWQgMClcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgICBlbHNlXG4gICAgICBjaGVja0ludDMyKHJtLCAwLCA4KTtcbiAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgMSwgcm0pO1xuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUsIGRwICsgMSk7XG4gIH1cbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/IFwiLVwiICsgc3RyIDogc3RyO1xufTtcblAudG9GaXhlZCA9IGZ1bmN0aW9uKGRwLCBybSkge1xuICB2YXIgc3RyLCB5LCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmIChkcCA9PT0gdm9pZCAwKSB7XG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XG4gICAgaWYgKHJtID09PSB2b2lkIDApXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gICAgZWxzZVxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XG4gICAgeSA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIHguZSArIDEsIHJtKTtcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh5LCBmYWxzZSwgZHAgKyB5LmUgKyAxKTtcbiAgfVxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gXCItXCIgKyBzdHIgOiBzdHI7XG59O1xuUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24obWF4RCkge1xuICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgaywgbiwgbjAsIG4xLCBwciwgcSwgciwgeCA9IHRoaXMsIHhkID0geC5kLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCF4ZClcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XG4gIG4xID0gZDAgPSBuZXcgQ3RvcigxKTtcbiAgZDEgPSBuMCA9IG5ldyBDdG9yKDApO1xuICBkID0gbmV3IEN0b3IoZDEpO1xuICBlID0gZC5lID0gZ2V0UHJlY2lzaW9uKHhkKSAtIHguZSAtIDE7XG4gIGsgPSBlICUgTE9HX0JBU0U7XG4gIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XG4gIGlmIChtYXhEID09IG51bGwpIHtcbiAgICBtYXhEID0gZSA+IDAgPyBkIDogbjE7XG4gIH0gZWxzZSB7XG4gICAgbiA9IG5ldyBDdG9yKG1heEQpO1xuICAgIGlmICghbi5pc0ludCgpIHx8IG4ubHQobjEpKVxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XG4gICAgbWF4RCA9IG4uZ3QoZCkgPyBlID4gMCA/IGQgOiBuMSA6IG47XG4gIH1cbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgbiA9IG5ldyBDdG9yKGRpZ2l0c1RvU3RyaW5nKHhkKSk7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcbiAgZm9yICg7IDsgKSB7XG4gICAgcSA9IGRpdmlkZShuLCBkLCAwLCAxLCAxKTtcbiAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xuICAgIGlmIChkMi5jbXAobWF4RCkgPT0gMSlcbiAgICAgIGJyZWFrO1xuICAgIGQwID0gZDE7XG4gICAgZDEgPSBkMjtcbiAgICBkMiA9IG4xO1xuICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyKSk7XG4gICAgbjAgPSBkMjtcbiAgICBkMiA9IGQ7XG4gICAgZCA9IG4ubWludXMocS50aW1lcyhkMikpO1xuICAgIG4gPSBkMjtcbiAgfVxuICBkMiA9IGRpdmlkZShtYXhELm1pbnVzKGQwKSwgZDEsIDAsIDEsIDEpO1xuICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcbiAgZDAgPSBkMC5wbHVzKGQyLnRpbWVzKGQxKSk7XG4gIG4wLnMgPSBuMS5zID0geC5zO1xuICByID0gZGl2aWRlKG4xLCBkMSwgZSwgMSkubWludXMoeCkuYWJzKCkuY21wKGRpdmlkZShuMCwgZDAsIGUsIDEpLm1pbnVzKHgpLmFicygpKSA8IDEgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xuICBDdG9yLnByZWNpc2lvbiA9IHByO1xuICBleHRlcm5hbCA9IHRydWU7XG4gIHJldHVybiByO1xufTtcblAudG9IZXhhZGVjaW1hbCA9IFAudG9IZXggPSBmdW5jdGlvbihzZCwgcm0pIHtcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDE2LCBzZCwgcm0pO1xufTtcblAudG9OZWFyZXN0ID0gZnVuY3Rpb24oeSwgcm0pIHtcbiAgdmFyIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3RvcjtcbiAgeCA9IG5ldyBDdG9yKHgpO1xuICBpZiAoeSA9PSBudWxsKSB7XG4gICAgaWYgKCF4LmQpXG4gICAgICByZXR1cm4geDtcbiAgICB5ID0gbmV3IEN0b3IoMSk7XG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICB9IGVsc2Uge1xuICAgIHkgPSBuZXcgQ3Rvcih5KTtcbiAgICBpZiAocm0gPT09IHZvaWQgMCkge1xuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGVja0ludDMyKHJtLCAwLCA4KTtcbiAgICB9XG4gICAgaWYgKCF4LmQpXG4gICAgICByZXR1cm4geS5zID8geCA6IHk7XG4gICAgaWYgKCF5LmQpIHtcbiAgICAgIGlmICh5LnMpXG4gICAgICAgIHkucyA9IHgucztcbiAgICAgIHJldHVybiB5O1xuICAgIH1cbiAgfVxuICBpZiAoeS5kWzBdKSB7XG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgICB4ID0gZGl2aWRlKHgsIHksIDAsIHJtLCAxKS50aW1lcyh5KTtcbiAgICBleHRlcm5hbCA9IHRydWU7XG4gICAgZmluYWxpc2UoeCk7XG4gIH0gZWxzZSB7XG4gICAgeS5zID0geC5zO1xuICAgIHggPSB5O1xuICB9XG4gIHJldHVybiB4O1xufTtcblAudG9OdW1iZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICt0aGlzO1xufTtcblAudG9PY3RhbCA9IGZ1bmN0aW9uKHNkLCBybSkge1xuICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgOCwgc2QsIHJtKTtcbn07XG5QLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIGUsIGssIHByLCByLCBybSwgcywgeCA9IHRoaXMsIEN0b3IgPSB4LmNvbnN0cnVjdG9yLCB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcbiAgaWYgKCF4LmQgfHwgIXkuZCB8fCAheC5kWzBdIHx8ICF5LmRbMF0pXG4gICAgcmV0dXJuIG5ldyBDdG9yKG1hdGhwb3coK3gsIHluKSk7XG4gIHggPSBuZXcgQ3Rvcih4KTtcbiAgaWYgKHguZXEoMSkpXG4gICAgcmV0dXJuIHg7XG4gIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgaWYgKHkuZXEoMSkpXG4gICAgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSk7XG4gIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xuICBpZiAoZSA+PSB5LmQubGVuZ3RoIC0gMSAmJiAoayA9IHluIDwgMCA/IC15biA6IHluKSA8PSBNQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XG4gICAgcmV0dXJuIHkucyA8IDAgPyBuZXcgQ3RvcigxKS5kaXYocikgOiBmaW5hbGlzZShyLCBwciwgcm0pO1xuICB9XG4gIHMgPSB4LnM7XG4gIGlmIChzIDwgMCkge1xuICAgIGlmIChlIDwgeS5kLmxlbmd0aCAtIDEpXG4gICAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcbiAgICBpZiAoKHkuZFtlXSAmIDEpID09IDApXG4gICAgICBzID0gMTtcbiAgICBpZiAoeC5lID09IDAgJiYgeC5kWzBdID09IDEgJiYgeC5kLmxlbmd0aCA9PSAxKSB7XG4gICAgICB4LnMgPSBzO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9XG4gIGsgPSBtYXRocG93KCt4LCB5bik7XG4gIGUgPSBrID09IDAgfHwgIWlzRmluaXRlKGspID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKFwiMC5cIiArIGRpZ2l0c1RvU3RyaW5nKHguZCkpIC8gTWF0aC5MTjEwICsgeC5lICsgMSkpIDogbmV3IEN0b3IoayArIFwiXCIpLmU7XG4gIGlmIChlID4gQ3Rvci5tYXhFICsgMSB8fCBlIDwgQ3Rvci5taW5FIC0gMSlcbiAgICByZXR1cm4gbmV3IEN0b3IoZSA+IDAgPyBzIC8gMCA6IDApO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcbiAgayA9IE1hdGgubWluKDEyLCAoZSArIFwiXCIpLmxlbmd0aCk7XG4gIHIgPSBuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIHByICsgaykpLCBwcik7XG4gIGlmIChyLmQpIHtcbiAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcbiAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIHByLCBybSkpIHtcbiAgICAgIGUgPSBwciArIDEwO1xuICAgICAgciA9IGZpbmFsaXNlKG5hdHVyYWxFeHBvbmVudGlhbCh5LnRpbWVzKG5hdHVyYWxMb2dhcml0aG0oeCwgZSArIGspKSwgZSksIGUgKyA1LCAxKTtcbiAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShwciArIDEsIHByICsgMTUpICsgMSA9PSAxZTE0KSB7XG4gICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByLnMgPSBzO1xuICBleHRlcm5hbCA9IHRydWU7XG4gIEN0b3Iucm91bmRpbmcgPSBybTtcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XG59O1xuUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uKHNkLCBybSkge1xuICB2YXIgc3RyLCB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xuICB9IGVsc2Uge1xuICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xuICAgIGlmIChybSA9PT0gdm9pZCAwKVxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICAgIGVsc2VcbiAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcbiAgfVxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gXCItXCIgKyBzdHIgOiBzdHI7XG59O1xuUC50b1NpZ25pZmljYW50RGlnaXRzID0gUC50b1NEID0gZnVuY3Rpb24oc2QsIHJtKSB7XG4gIHZhciB4ID0gdGhpcywgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XG4gICAgaWYgKHJtID09PSB2b2lkIDApXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XG4gICAgZWxzZVxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XG4gIH1cbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBzZCwgcm0pO1xufTtcblAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3Rvciwgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gXCItXCIgKyBzdHIgOiBzdHI7XG59O1xuUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMSk7XG59O1xuUC52YWx1ZU9mID0gUC50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHggPSB0aGlzLCBDdG9yID0geC5jb25zdHJ1Y3Rvciwgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xuICByZXR1cm4geC5pc05lZygpID8gXCItXCIgKyBzdHIgOiBzdHI7XG59O1xuZnVuY3Rpb24gZGlnaXRzVG9TdHJpbmcoZCkge1xuICB2YXIgaSwgaywgd3MsIGluZGV4T2ZMYXN0V29yZCA9IGQubGVuZ3RoIC0gMSwgc3RyID0gXCJcIiwgdyA9IGRbMF07XG4gIGlmIChpbmRleE9mTGFzdFdvcmQgPiAwKSB7XG4gICAgc3RyICs9IHc7XG4gICAgZm9yIChpID0gMTsgaSA8IGluZGV4T2ZMYXN0V29yZDsgaSsrKSB7XG4gICAgICB3cyA9IGRbaV0gKyBcIlwiO1xuICAgICAgayA9IExPR19CQVNFIC0gd3MubGVuZ3RoO1xuICAgICAgaWYgKGspXG4gICAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xuICAgICAgc3RyICs9IHdzO1xuICAgIH1cbiAgICB3ID0gZFtpXTtcbiAgICB3cyA9IHcgKyBcIlwiO1xuICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcbiAgICBpZiAoaylcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xuICB9IGVsc2UgaWYgKHcgPT09IDApIHtcbiAgICByZXR1cm4gXCIwXCI7XG4gIH1cbiAgZm9yICg7IHcgJSAxMCA9PT0gMDsgKVxuICAgIHcgLz0gMTA7XG4gIHJldHVybiBzdHIgKyB3O1xufVxuZnVuY3Rpb24gY2hlY2tJbnQzMihpLCBtaW4yLCBtYXgyKSB7XG4gIGlmIChpICE9PSB+fmkgfHwgaSA8IG1pbjIgfHwgaSA+IG1heDIpIHtcbiAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBpKTtcbiAgfVxufVxuZnVuY3Rpb24gY2hlY2tSb3VuZGluZ0RpZ2l0cyhkLCBpLCBybSwgcmVwZWF0aW5nKSB7XG4gIHZhciBkaSwgaywgciwgcmQ7XG4gIGZvciAoayA9IGRbMF07IGsgPj0gMTA7IGsgLz0gMTApXG4gICAgLS1pO1xuICBpZiAoLS1pIDwgMCkge1xuICAgIGkgKz0gTE9HX0JBU0U7XG4gICAgZGkgPSAwO1xuICB9IGVsc2Uge1xuICAgIGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XG4gICAgaSAlPSBMT0dfQkFTRTtcbiAgfVxuICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcbiAgcmQgPSBkW2RpXSAlIGsgfCAwO1xuICBpZiAocmVwZWF0aW5nID09IG51bGwpIHtcbiAgICBpZiAoaSA8IDMpIHtcbiAgICAgIGlmIChpID09IDApXG4gICAgICAgIHJkID0gcmQgLyAxMDAgfCAwO1xuICAgICAgZWxzZSBpZiAoaSA9PSAxKVxuICAgICAgICByZCA9IHJkIC8gMTAgfCAwO1xuICAgICAgciA9IHJtIDwgNCAmJiByZCA9PSA5OTk5OSB8fCBybSA+IDMgJiYgcmQgPT0gNDk5OTkgfHwgcmQgPT0gNWU0IHx8IHJkID09IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIgPSAocm0gPCA0ICYmIHJkICsgMSA9PSBrIHx8IHJtID4gMyAmJiByZCArIDEgPT0gayAvIDIpICYmIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fCAocmQgPT0gayAvIDIgfHwgcmQgPT0gMCkgJiYgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSAwO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoaSA8IDQpIHtcbiAgICAgIGlmIChpID09IDApXG4gICAgICAgIHJkID0gcmQgLyAxZTMgfCAwO1xuICAgICAgZWxzZSBpZiAoaSA9PSAxKVxuICAgICAgICByZCA9IHJkIC8gMTAwIHwgMDtcbiAgICAgIGVsc2UgaWYgKGkgPT0gMilcbiAgICAgICAgcmQgPSByZCAvIDEwIHwgMDtcbiAgICAgIHIgPSAocmVwZWF0aW5nIHx8IHJtIDwgNCkgJiYgcmQgPT0gOTk5OSB8fCAhcmVwZWF0aW5nICYmIHJtID4gMyAmJiByZCA9PSA0OTk5O1xuICAgIH0gZWxzZSB7XG4gICAgICByID0gKChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCArIDEgPT0gayB8fCAhcmVwZWF0aW5nICYmIHJtID4gMyAmJiByZCArIDEgPT0gayAvIDIpICYmIChkW2RpICsgMV0gLyBrIC8gMWUzIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDMpIC0gMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBjb252ZXJ0QmFzZShzdHIsIGJhc2VJbiwgYmFzZU91dCkge1xuICB2YXIgaiwgYXJyID0gWzBdLCBhcnJMLCBpID0gMCwgc3RyTCA9IHN0ci5sZW5ndGg7XG4gIGZvciAoOyBpIDwgc3RyTDsgKSB7XG4gICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOyApXG4gICAgICBhcnJbYXJyTF0gKj0gYmFzZUluO1xuICAgIGFyclswXSArPSBOVU1FUkFMUy5pbmRleE9mKHN0ci5jaGFyQXQoaSsrKSk7XG4gICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGFycltqXSA+IGJhc2VPdXQgLSAxKSB7XG4gICAgICAgIGlmIChhcnJbaiArIDFdID09PSB2b2lkIDApXG4gICAgICAgICAgYXJyW2ogKyAxXSA9IDA7XG4gICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XG4gICAgICAgIGFycltqXSAlPSBiYXNlT3V0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyLnJldmVyc2UoKTtcbn1cbmZ1bmN0aW9uIGNvc2luZShDdG9yLCB4KSB7XG4gIHZhciBrLCB5LCBsZW4gPSB4LmQubGVuZ3RoO1xuICBpZiAobGVuIDwgMzIpIHtcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xuICAgIHkgPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgayA9IDE2O1xuICAgIHkgPSBcIjIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTBcIjtcbiAgfVxuICBDdG9yLnByZWNpc2lvbiArPSBrO1xuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMoeSksIG5ldyBDdG9yKDEpKTtcbiAgZm9yICh2YXIgaSA9IGs7IGktLTsgKSB7XG4gICAgdmFyIGNvczJ4ID0geC50aW1lcyh4KTtcbiAgICB4ID0gY29zMngudGltZXMoY29zMngpLm1pbnVzKGNvczJ4KS50aW1lcyg4KS5wbHVzKDEpO1xuICB9XG4gIEN0b3IucHJlY2lzaW9uIC09IGs7XG4gIHJldHVybiB4O1xufVxudmFyIGRpdmlkZSA9IGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBtdWx0aXBseUludGVnZXIoeCwgaywgYmFzZSkge1xuICAgIHZhciB0ZW1wLCBjYXJyeSA9IDAsIGkgPSB4Lmxlbmd0aDtcbiAgICBmb3IgKHggPSB4LnNsaWNlKCk7IGktLTsgKSB7XG4gICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcbiAgICAgIHhbaV0gPSB0ZW1wICUgYmFzZSB8IDA7XG4gICAgICBjYXJyeSA9IHRlbXAgLyBiYXNlIHwgMDtcbiAgICB9XG4gICAgaWYgKGNhcnJ5KVxuICAgICAgeC51bnNoaWZ0KGNhcnJ5KTtcbiAgICByZXR1cm4geDtcbiAgfVxuICBmdW5jdGlvbiBjb21wYXJlKGEsIGIsIGFMLCBiTCkge1xuICAgIHZhciBpLCByO1xuICAgIGlmIChhTCAhPSBiTCkge1xuICAgICAgciA9IGFMID4gYkwgPyAxIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xuICAgICAgICBpZiAoYVtpXSAhPSBiW2ldKSB7XG4gICAgICAgICAgciA9IGFbaV0gPiBiW2ldID8gMSA6IC0xO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xuICB9XG4gIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGFMLCBiYXNlKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoOyBhTC0tOyApIHtcbiAgICAgIGFbYUxdIC09IGk7XG4gICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xuICAgICAgYVthTF0gPSBpICogYmFzZSArIGFbYUxdIC0gYlthTF07XG4gICAgfVxuICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7IClcbiAgICAgIGEuc2hpZnQoKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oeCwgeSwgcHIsIHJtLCBkcCwgYmFzZSkge1xuICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsIHlMLCB5eiwgQ3RvciA9IHguY29uc3RydWN0b3IsIHNpZ24yID0geC5zID09IHkucyA/IDEgOiAtMSwgeGQgPSB4LmQsIHlkID0geS5kO1xuICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcbiAgICAgIHJldHVybiBuZXcgQ3RvcigheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDogeGQgJiYgeGRbMF0gPT0gMCB8fCAheWQgPyBzaWduMiAqIDAgOiBzaWduMiAvIDApO1xuICAgIH1cbiAgICBpZiAoYmFzZSkge1xuICAgICAgbG9nQmFzZSA9IDE7XG4gICAgICBlID0geC5lIC0geS5lO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYXNlID0gQkFTRTtcbiAgICAgIGxvZ0Jhc2UgPSBMT0dfQkFTRTtcbiAgICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gbG9nQmFzZSkgLSBtYXRoZmxvb3IoeS5lIC8gbG9nQmFzZSk7XG4gICAgfVxuICAgIHlMID0geWQubGVuZ3RoO1xuICAgIHhMID0geGQubGVuZ3RoO1xuICAgIHEgPSBuZXcgQ3RvcihzaWduMik7XG4gICAgcWQgPSBxLmQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKylcbiAgICAgIDtcbiAgICBpZiAoeWRbaV0gPiAoeGRbaV0gfHwgMCkpXG4gICAgICBlLS07XG4gICAgaWYgKHByID09IG51bGwpIHtcbiAgICAgIHNkID0gcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcbiAgICB9IGVsc2UgaWYgKGRwKSB7XG4gICAgICBzZCA9IHByICsgKHguZSAtIHkuZSkgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZCA9IHByO1xuICAgIH1cbiAgICBpZiAoc2QgPCAwKSB7XG4gICAgICBxZC5wdXNoKDEpO1xuICAgICAgbW9yZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNkID0gc2QgLyBsb2dCYXNlICsgMiB8IDA7XG4gICAgICBpID0gMDtcbiAgICAgIGlmICh5TCA9PSAxKSB7XG4gICAgICAgIGsgPSAwO1xuICAgICAgICB5ZCA9IHlkWzBdO1xuICAgICAgICBzZCsrO1xuICAgICAgICBmb3IgKDsgKGkgPCB4TCB8fCBrKSAmJiBzZC0tOyBpKyspIHtcbiAgICAgICAgICB0ID0gayAqIGJhc2UgKyAoeGRbaV0gfHwgMCk7XG4gICAgICAgICAgcWRbaV0gPSB0IC8geWQgfCAwO1xuICAgICAgICAgIGsgPSB0ICUgeWQgfCAwO1xuICAgICAgICB9XG4gICAgICAgIG1vcmUgPSBrIHx8IGkgPCB4TDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBiYXNlIC8gKHlkWzBdICsgMSkgfCAwO1xuICAgICAgICBpZiAoayA+IDEpIHtcbiAgICAgICAgICB5ZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XG4gICAgICAgICAgeGQgPSBtdWx0aXBseUludGVnZXIoeGQsIGssIGJhc2UpO1xuICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xuICAgICAgICAgIHhMID0geGQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHhpID0geUw7XG4gICAgICAgIHJlbSA9IHhkLnNsaWNlKDAsIHlMKTtcbiAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XG4gICAgICAgIGZvciAoOyByZW1MIDwgeUw7IClcbiAgICAgICAgICByZW1bcmVtTCsrXSA9IDA7XG4gICAgICAgIHl6ID0geWQuc2xpY2UoKTtcbiAgICAgICAgeXoudW5zaGlmdCgwKTtcbiAgICAgICAgeWQwID0geWRbMF07XG4gICAgICAgIGlmICh5ZFsxXSA+PSBiYXNlIC8gMilcbiAgICAgICAgICArK3lkMDtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGsgPSAwO1xuICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xuICAgICAgICAgIGlmIChjbXAgPCAwKSB7XG4gICAgICAgICAgICByZW0wID0gcmVtWzBdO1xuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpXG4gICAgICAgICAgICAgIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XG4gICAgICAgICAgICBrID0gcmVtMCAvIHlkMCB8IDA7XG4gICAgICAgICAgICBpZiAoayA+IDEpIHtcbiAgICAgICAgICAgICAgaWYgKGsgPj0gYmFzZSlcbiAgICAgICAgICAgICAgICBrID0gYmFzZSAtIDE7XG4gICAgICAgICAgICAgIHByb2QgPSBtdWx0aXBseUludGVnZXIoeWQsIGssIGJhc2UpO1xuICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcbiAgICAgICAgICAgICAgY21wID0gY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKTtcbiAgICAgICAgICAgICAgaWYgKGNtcCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgay0tO1xuICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChrID09IDApXG4gICAgICAgICAgICAgICAgY21wID0gayA9IDE7XG4gICAgICAgICAgICAgIHByb2QgPSB5ZC5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChwcm9kTCA8IHJlbUwpXG4gICAgICAgICAgICAgIHByb2QudW5zaGlmdCgwKTtcbiAgICAgICAgICAgIHN1YnRyYWN0KHJlbSwgcHJvZCwgcmVtTCwgYmFzZSk7XG4gICAgICAgICAgICBpZiAoY21wID09IC0xKSB7XG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xuICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcbiAgICAgICAgICAgICAgaWYgKGNtcCA8IDEpIHtcbiAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCB5TCA8IHJlbUwgPyB5eiA6IHlkLCByZW1MLCBiYXNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIGlmIChjbXAgPT09IDApIHtcbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIHJlbSA9IFswXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcWRbaSsrXSA9IGs7XG4gICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcbiAgICAgICAgICAgIHJlbVtyZW1MKytdID0geGRbeGldIHx8IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xuICAgICAgICAgICAgcmVtTCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICgoeGkrKyA8IHhMIHx8IHJlbVswXSAhPT0gdm9pZCAwKSAmJiBzZC0tKTtcbiAgICAgICAgbW9yZSA9IHJlbVswXSAhPT0gdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKCFxZFswXSlcbiAgICAgICAgcWQuc2hpZnQoKTtcbiAgICB9XG4gICAgaWYgKGxvZ0Jhc2UgPT0gMSkge1xuICAgICAgcS5lID0gZTtcbiAgICAgIGluZXhhY3QgPSBtb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAxLCBrID0gcWRbMF07IGsgPj0gMTA7IGsgLz0gMTApXG4gICAgICAgIGkrKztcbiAgICAgIHEuZSA9IGkgKyBlICogbG9nQmFzZSAtIDE7XG4gICAgICBmaW5hbGlzZShxLCBkcCA/IHByICsgcS5lICsgMSA6IHByLCBybSwgbW9yZSk7XG4gICAgfVxuICAgIHJldHVybiBxO1xuICB9O1xufSgpO1xuZnVuY3Rpb24gZmluYWxpc2UoeCwgc2QsIHJtLCBpc1RydW5jYXRlZCkge1xuICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSwgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIG91dDpcbiAgICBpZiAoc2QgIT0gbnVsbCkge1xuICAgICAgeGQgPSB4LmQ7XG4gICAgICBpZiAoIXhkKVxuICAgICAgICByZXR1cm4geDtcbiAgICAgIGZvciAoZGlnaXRzID0gMSwgayA9IHhkWzBdOyBrID49IDEwOyBrIC89IDEwKVxuICAgICAgICBkaWdpdHMrKztcbiAgICAgIGkgPSBzZCAtIGRpZ2l0cztcbiAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICBpICs9IExPR19CQVNFO1xuICAgICAgICBqID0gc2Q7XG4gICAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcbiAgICAgICAgcmQgPSB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XG4gICAgICAgIGsgPSB4ZC5sZW5ndGg7XG4gICAgICAgIGlmICh4ZGkgPj0gaykge1xuICAgICAgICAgIGlmIChpc1RydW5jYXRlZCkge1xuICAgICAgICAgICAgZm9yICg7IGsrKyA8PSB4ZGk7IClcbiAgICAgICAgICAgICAgeGQucHVzaCgwKTtcbiAgICAgICAgICAgIHcgPSByZCA9IDA7XG4gICAgICAgICAgICBkaWdpdHMgPSAxO1xuICAgICAgICAgICAgaSAlPSBMT0dfQkFTRTtcbiAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhayBvdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHcgPSBrID0geGRbeGRpXTtcbiAgICAgICAgICBmb3IgKGRpZ2l0cyA9IDE7IGsgPj0gMTA7IGsgLz0gMTApXG4gICAgICAgICAgICBkaWdpdHMrKztcbiAgICAgICAgICBpICU9IExPR19CQVNFO1xuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkaWdpdHM7XG4gICAgICAgICAgcmQgPSBqIDwgMCA/IDAgOiB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpc1RydW5jYXRlZCA9IGlzVHJ1bmNhdGVkIHx8IHNkIDwgMCB8fCB4ZFt4ZGkgKyAxXSAhPT0gdm9pZCAwIHx8IChqIDwgMCA/IHcgOiB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpKTtcbiAgICAgIHJvdW5kVXAgPSBybSA8IDQgPyAocmQgfHwgaXNUcnVuY2F0ZWQpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKSA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IGlzVHJ1bmNhdGVkIHx8IHJtID09IDYgJiYgKGkgPiAwID8gaiA+IDAgPyB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgOiAwIDogeGRbeGRpIC0gMV0pICUgMTAgJiAxIHx8IHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcbiAgICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XG4gICAgICAgIHhkLmxlbmd0aCA9IDA7XG4gICAgICAgIGlmIChyb3VuZFVwKSB7XG4gICAgICAgICAgc2QgLT0geC5lICsgMTtcbiAgICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xuICAgICAgICAgIHguZSA9IC1zZCB8fCAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHhkWzBdID0geC5lID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geDtcbiAgICAgIH1cbiAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgeGQubGVuZ3RoID0geGRpO1xuICAgICAgICBrID0gMTtcbiAgICAgICAgeGRpLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ZC5sZW5ndGggPSB4ZGkgKyAxO1xuICAgICAgICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcbiAgICAgICAgeGRbeGRpXSA9IGogPiAwID8gKHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSAlIG1hdGhwb3coMTAsIGopIHwgMCkgKiBrIDogMDtcbiAgICAgIH1cbiAgICAgIGlmIChyb3VuZFVwKSB7XG4gICAgICAgIGZvciAoOyA7ICkge1xuICAgICAgICAgIGlmICh4ZGkgPT0gMCkge1xuICAgICAgICAgICAgZm9yIChpID0gMSwgaiA9IHhkWzBdOyBqID49IDEwOyBqIC89IDEwKVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBqID0geGRbMF0gKz0gaztcbiAgICAgICAgICAgIGZvciAoayA9IDE7IGogPj0gMTA7IGogLz0gMTApXG4gICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIGlmIChpICE9IGspIHtcbiAgICAgICAgICAgICAgeC5lKys7XG4gICAgICAgICAgICAgIGlmICh4ZFswXSA9PSBCQVNFKVxuICAgICAgICAgICAgICAgIHhkWzBdID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ZFt4ZGldICs9IGs7XG4gICAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHhkW3hkaS0tXSA9IDA7XG4gICAgICAgICAgICBrID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IHhkLmxlbmd0aDsgeGRbLS1pXSA9PT0gMDsgKVxuICAgICAgICB4ZC5wb3AoKTtcbiAgICB9XG4gIGlmIChleHRlcm5hbCkge1xuICAgIGlmICh4LmUgPiBDdG9yLm1heEUpIHtcbiAgICAgIHguZCA9IG51bGw7XG4gICAgICB4LmUgPSBOYU47XG4gICAgfSBlbHNlIGlmICh4LmUgPCBDdG9yLm1pbkUpIHtcbiAgICAgIHguZSA9IDA7XG4gICAgICB4LmQgPSBbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gZmluaXRlVG9TdHJpbmcoeCwgaXNFeHAsIHNkKSB7XG4gIGlmICgheC5pc0Zpbml0ZSgpKVxuICAgIHJldHVybiBub25GaW5pdGVUb1N0cmluZyh4KTtcbiAgdmFyIGssIGUgPSB4LmUsIHN0ciA9IGRpZ2l0c1RvU3RyaW5nKHguZCksIGxlbiA9IHN0ci5sZW5ndGg7XG4gIGlmIChpc0V4cCkge1xuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyBcIi5cIiArIHN0ci5zbGljZSgxKSArIGdldFplcm9TdHJpbmcoayk7XG4gICAgfSBlbHNlIGlmIChsZW4gPiAxKSB7XG4gICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgXCIuXCIgKyBzdHIuc2xpY2UoMSk7XG4gICAgfVxuICAgIHN0ciA9IHN0ciArICh4LmUgPCAwID8gXCJlXCIgOiBcImUrXCIpICsgeC5lO1xuICB9IGVsc2UgaWYgKGUgPCAwKSB7XG4gICAgc3RyID0gXCIwLlwiICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApXG4gICAgICBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcbiAgfSBlbHNlIGlmIChlID49IGxlbikge1xuICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGUgKyAxIC0gbGVuKTtcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGUgLSAxKSA+IDApXG4gICAgICBzdHIgPSBzdHIgKyBcIi5cIiArIGdldFplcm9TdHJpbmcoayk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKChrID0gZSArIDEpIDwgbGVuKVxuICAgICAgc3RyID0gc3RyLnNsaWNlKDAsIGspICsgXCIuXCIgKyBzdHIuc2xpY2Uoayk7XG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xuICAgICAgaWYgKGUgKyAxID09PSBsZW4pXG4gICAgICAgIHN0ciArPSBcIi5cIjtcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufVxuZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XG4gIHZhciB3ID0gZGlnaXRzWzBdO1xuICBmb3IgKGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApXG4gICAgZSsrO1xuICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XG4gIGlmIChzZCA+IExOMTBfUFJFQ0lTSU9OKSB7XG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xuICAgIGlmIChwcilcbiAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gICAgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XG4gIH1cbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKExOMTApLCBzZCwgMSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBnZXRQaShDdG9yLCBzZCwgcm0pIHtcbiAgaWYgKHNkID4gUElfUFJFQ0lTSU9OKVxuICAgIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoUEkpLCBzZCwgcm0sIHRydWUpO1xufVxuZnVuY3Rpb24gZ2V0UHJlY2lzaW9uKGRpZ2l0cykge1xuICB2YXIgdyA9IGRpZ2l0cy5sZW5ndGggLSAxLCBsZW4gPSB3ICogTE9HX0JBU0UgKyAxO1xuICB3ID0gZGlnaXRzW3ddO1xuICBpZiAodykge1xuICAgIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMClcbiAgICAgIGxlbi0tO1xuICAgIGZvciAodyA9IGRpZ2l0c1swXTsgdyA+PSAxMDsgdyAvPSAxMClcbiAgICAgIGxlbisrO1xuICB9XG4gIHJldHVybiBsZW47XG59XG5mdW5jdGlvbiBnZXRaZXJvU3RyaW5nKGspIHtcbiAgdmFyIHpzID0gXCJcIjtcbiAgZm9yICg7IGstLTsgKVxuICAgIHpzICs9IFwiMFwiO1xuICByZXR1cm4genM7XG59XG5mdW5jdGlvbiBpbnRQb3coQ3RvciwgeCwgbiwgcHIpIHtcbiAgdmFyIGlzVHJ1bmNhdGVkLCByID0gbmV3IEN0b3IoMSksIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSArIDQpO1xuICBleHRlcm5hbCA9IGZhbHNlO1xuICBmb3IgKDsgOyApIHtcbiAgICBpZiAobiAlIDIpIHtcbiAgICAgIHIgPSByLnRpbWVzKHgpO1xuICAgICAgaWYgKHRydW5jYXRlKHIuZCwgaykpXG4gICAgICAgIGlzVHJ1bmNhdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgbiA9IG1hdGhmbG9vcihuIC8gMik7XG4gICAgaWYgKG4gPT09IDApIHtcbiAgICAgIG4gPSByLmQubGVuZ3RoIC0gMTtcbiAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApXG4gICAgICAgICsrci5kW25dO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHggPSB4LnRpbWVzKHgpO1xuICAgIHRydW5jYXRlKHguZCwgayk7XG4gIH1cbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICByZXR1cm4gcjtcbn1cbmZ1bmN0aW9uIGlzT2RkKG4pIHtcbiAgcmV0dXJuIG4uZFtuLmQubGVuZ3RoIC0gMV0gJiAxO1xufVxuZnVuY3Rpb24gbWF4T3JNaW4oQ3RvciwgYXJncywgbHRndCkge1xuICB2YXIgeSwgeCA9IG5ldyBDdG9yKGFyZ3NbMF0pLCBpID0gMDtcbiAgZm9yICg7ICsraSA8IGFyZ3MubGVuZ3RoOyApIHtcbiAgICB5ID0gbmV3IEN0b3IoYXJnc1tpXSk7XG4gICAgaWYgKCF5LnMpIHtcbiAgICAgIHggPSB5O1xuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XG4gICAgICB4ID0geTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBuYXR1cmFsRXhwb25lbnRpYWwoeCwgc2QpIHtcbiAgdmFyIGRlbm9taW5hdG9yLCBndWFyZCwgaiwgcG93Miwgc3VtLCB0LCB3cHIsIHJlcCA9IDAsIGkgPSAwLCBrID0gMCwgQ3RvciA9IHguY29uc3RydWN0b3IsIHJtID0gQ3Rvci5yb3VuZGluZywgcHIgPSBDdG9yLnByZWNpc2lvbjtcbiAgaWYgKCF4LmQgfHwgIXguZFswXSB8fCB4LmUgPiAxNykge1xuICAgIHJldHVybiBuZXcgQ3Rvcih4LmQgPyAheC5kWzBdID8gMSA6IHgucyA8IDAgPyAwIDogMSAvIDAgOiB4LnMgPyB4LnMgPCAwID8gMCA6IHggOiAwIC8gMCk7XG4gIH1cbiAgaWYgKHNkID09IG51bGwpIHtcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xuICAgIHdwciA9IHByO1xuICB9IGVsc2Uge1xuICAgIHdwciA9IHNkO1xuICB9XG4gIHQgPSBuZXcgQ3RvcigwLjAzMTI1KTtcbiAgd2hpbGUgKHguZSA+IC0yKSB7XG4gICAgeCA9IHgudGltZXModCk7XG4gICAgayArPSA1O1xuICB9XG4gIGd1YXJkID0gTWF0aC5sb2cobWF0aHBvdygyLCBrKSkgLyBNYXRoLkxOMTAgKiAyICsgNSB8IDA7XG4gIHdwciArPSBndWFyZDtcbiAgZGVub21pbmF0b3IgPSBwb3cyID0gc3VtID0gbmV3IEN0b3IoMSk7XG4gIEN0b3IucHJlY2lzaW9uID0gd3ByO1xuICBmb3IgKDsgOyApIHtcbiAgICBwb3cyID0gZmluYWxpc2UocG93Mi50aW1lcyh4KSwgd3ByLCAxKTtcbiAgICBkZW5vbWluYXRvciA9IGRlbm9taW5hdG9yLnRpbWVzKCsraSk7XG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShwb3cyLCBkZW5vbWluYXRvciwgd3ByLCAxKSk7XG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgd3ByKSA9PT0gZGlnaXRzVG9TdHJpbmcoc3VtLmQpLnNsaWNlKDAsIHdwcikpIHtcbiAgICAgIGogPSBrO1xuICAgICAgd2hpbGUgKGotLSlcbiAgICAgICAgc3VtID0gZmluYWxpc2Uoc3VtLnRpbWVzKHN1bSksIHdwciwgMSk7XG4gICAgICBpZiAoc2QgPT0gbnVsbCkge1xuICAgICAgICBpZiAocmVwIDwgMyAmJiBjaGVja1JvdW5kaW5nRGlnaXRzKHN1bS5kLCB3cHIgLSBndWFyZCwgcm0sIHJlcCkpIHtcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSAxMDtcbiAgICAgICAgICBkZW5vbWluYXRvciA9IHBvdzIgPSB0ID0gbmV3IEN0b3IoMSk7XG4gICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgcmVwKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9XG4gICAgfVxuICAgIHN1bSA9IHQ7XG4gIH1cbn1cbmZ1bmN0aW9uIG5hdHVyYWxMb2dhcml0aG0oeSwgc2QpIHtcbiAgdmFyIGMsIGMwLCBkZW5vbWluYXRvciwgZSwgbnVtZXJhdG9yLCByZXAsIHN1bSwgdCwgd3ByLCB4MSwgeDIsIG4gPSAxLCBndWFyZCA9IDEwLCB4ID0geSwgeGQgPSB4LmQsIEN0b3IgPSB4LmNvbnN0cnVjdG9yLCBybSA9IEN0b3Iucm91bmRpbmcsIHByID0gQ3Rvci5wcmVjaXNpb247XG4gIGlmICh4LnMgPCAwIHx8ICF4ZCB8fCAheGRbMF0gfHwgIXguZSAmJiB4ZFswXSA9PSAxICYmIHhkLmxlbmd0aCA9PSAxKSB7XG4gICAgcmV0dXJuIG5ldyBDdG9yKHhkICYmICF4ZFswXSA/IC0xIC8gMCA6IHgucyAhPSAxID8gTmFOIDogeGQgPyAwIDogeCk7XG4gIH1cbiAgaWYgKHNkID09IG51bGwpIHtcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xuICAgIHdwciA9IHByO1xuICB9IGVsc2Uge1xuICAgIHdwciA9IHNkO1xuICB9XG4gIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IGd1YXJkO1xuICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xuICBjMCA9IGMuY2hhckF0KDApO1xuICBpZiAoTWF0aC5hYnMoZSA9IHguZSkgPCAxNWUxNCkge1xuICAgIHdoaWxlIChjMCA8IDcgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMykge1xuICAgICAgeCA9IHgudGltZXMoeSk7XG4gICAgICBjID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcbiAgICAgIGMwID0gYy5jaGFyQXQoMCk7XG4gICAgICBuKys7XG4gICAgfVxuICAgIGUgPSB4LmU7XG4gICAgaWYgKGMwID4gMSkge1xuICAgICAgeCA9IG5ldyBDdG9yKFwiMC5cIiArIGMpO1xuICAgICAgZSsrO1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0gbmV3IEN0b3IoYzAgKyBcIi5cIiArIGMuc2xpY2UoMSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArIFwiXCIpO1xuICAgIHggPSBuYXR1cmFsTG9nYXJpdGhtKG5ldyBDdG9yKGMwICsgXCIuXCIgKyBjLnNsaWNlKDEpKSwgd3ByIC0gZ3VhcmQpLnBsdXModCk7XG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XG4gIH1cbiAgeDEgPSB4O1xuICBzdW0gPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgubWludXMoMSksIHgucGx1cygxKSwgd3ByLCAxKTtcbiAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xuICBkZW5vbWluYXRvciA9IDM7XG4gIGZvciAoOyA7ICkge1xuICAgIG51bWVyYXRvciA9IGZpbmFsaXNlKG51bWVyYXRvci50aW1lcyh4MiksIHdwciwgMSk7XG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShudW1lcmF0b3IsIG5ldyBDdG9yKGRlbm9taW5hdG9yKSwgd3ByLCAxKSk7XG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgd3ByKSA9PT0gZGlnaXRzVG9TdHJpbmcoc3VtLmQpLnNsaWNlKDAsIHdwcikpIHtcbiAgICAgIHN1bSA9IHN1bS50aW1lcygyKTtcbiAgICAgIGlmIChlICE9PSAwKVxuICAgICAgICBzdW0gPSBzdW0ucGx1cyhnZXRMbjEwKEN0b3IsIHdwciArIDIsIHByKS50aW1lcyhlICsgXCJcIikpO1xuICAgICAgc3VtID0gZGl2aWRlKHN1bSwgbmV3IEN0b3IobiksIHdwciwgMSk7XG4gICAgICBpZiAoc2QgPT0gbnVsbCkge1xuICAgICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XG4gICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XG4gICAgICAgICAgdCA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeDEubWludXMoMSksIHgxLnBsdXMoMSksIHdwciwgMSk7XG4gICAgICAgICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xuICAgICAgICAgIGRlbm9taW5hdG9yID0gcmVwID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VtID0gdDtcbiAgICBkZW5vbWluYXRvciArPSAyO1xuICB9XG59XG5mdW5jdGlvbiBub25GaW5pdGVUb1N0cmluZyh4KSB7XG4gIHJldHVybiBTdHJpbmcoeC5zICogeC5zIC8gMCk7XG59XG5mdW5jdGlvbiBwYXJzZURlY2ltYWwoeCwgc3RyKSB7XG4gIHZhciBlLCBpLCBsZW47XG4gIGlmICgoZSA9IHN0ci5pbmRleE9mKFwiLlwiKSkgPiAtMSlcbiAgICBzdHIgPSBzdHIucmVwbGFjZShcIi5cIiwgXCJcIik7XG4gIGlmICgoaSA9IHN0ci5zZWFyY2goL2UvaSkpID4gMCkge1xuICAgIGlmIChlIDwgMClcbiAgICAgIGUgPSBpO1xuICAgIGUgKz0gK3N0ci5zbGljZShpICsgMSk7XG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpKTtcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xuICAgIGUgPSBzdHIubGVuZ3RoO1xuICB9XG4gIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKVxuICAgIDtcbiAgZm9yIChsZW4gPSBzdHIubGVuZ3RoOyBzdHIuY2hhckNvZGVBdChsZW4gLSAxKSA9PT0gNDg7IC0tbGVuKVxuICAgIDtcbiAgc3RyID0gc3RyLnNsaWNlKGksIGxlbik7XG4gIGlmIChzdHIpIHtcbiAgICBsZW4gLT0gaTtcbiAgICB4LmUgPSBlID0gZSAtIGkgLSAxO1xuICAgIHguZCA9IFtdO1xuICAgIGkgPSAoZSArIDEpICUgTE9HX0JBU0U7XG4gICAgaWYgKGUgPCAwKVxuICAgICAgaSArPSBMT0dfQkFTRTtcbiAgICBpZiAoaSA8IGxlbikge1xuICAgICAgaWYgKGkpXG4gICAgICAgIHguZC5wdXNoKCtzdHIuc2xpY2UoMCwgaSkpO1xuICAgICAgZm9yIChsZW4gLT0gTE9HX0JBU0U7IGkgPCBsZW47IClcbiAgICAgICAgeC5kLnB1c2goK3N0ci5zbGljZShpLCBpICs9IExPR19CQVNFKSk7XG4gICAgICBzdHIgPSBzdHIuc2xpY2UoaSk7XG4gICAgICBpID0gTE9HX0JBU0UgLSBzdHIubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBpIC09IGxlbjtcbiAgICB9XG4gICAgZm9yICg7IGktLTsgKVxuICAgICAgc3RyICs9IFwiMFwiO1xuICAgIHguZC5wdXNoKCtzdHIpO1xuICAgIGlmIChleHRlcm5hbCkge1xuICAgICAgaWYgKHguZSA+IHguY29uc3RydWN0b3IubWF4RSkge1xuICAgICAgICB4LmQgPSBudWxsO1xuICAgICAgICB4LmUgPSBOYU47XG4gICAgICB9IGVsc2UgaWYgKHguZSA8IHguY29uc3RydWN0b3IubWluRSkge1xuICAgICAgICB4LmUgPSAwO1xuICAgICAgICB4LmQgPSBbMF07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHguZSA9IDA7XG4gICAgeC5kID0gWzBdO1xuICB9XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcbiAgdmFyIGJhc2UsIEN0b3IsIGRpdmlzb3IsIGksIGlzRmxvYXQsIGxlbiwgcCwgeGQsIHhlO1xuICBpZiAoc3RyID09PSBcIkluZmluaXR5XCIgfHwgc3RyID09PSBcIk5hTlwiKSB7XG4gICAgaWYgKCErc3RyKVxuICAgICAgeC5zID0gTmFOO1xuICAgIHguZSA9IE5hTjtcbiAgICB4LmQgPSBudWxsO1xuICAgIHJldHVybiB4O1xuICB9XG4gIGlmIChpc0hleC50ZXN0KHN0cikpIHtcbiAgICBiYXNlID0gMTY7XG4gICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAoaXNCaW5hcnkudGVzdChzdHIpKSB7XG4gICAgYmFzZSA9IDI7XG4gIH0gZWxzZSBpZiAoaXNPY3RhbC50ZXN0KHN0cikpIHtcbiAgICBiYXNlID0gODtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBzdHIpO1xuICB9XG4gIGkgPSBzdHIuc2VhcmNoKC9wL2kpO1xuICBpZiAoaSA+IDApIHtcbiAgICBwID0gK3N0ci5zbGljZShpICsgMSk7XG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygyLCBpKTtcbiAgfSBlbHNlIHtcbiAgICBzdHIgPSBzdHIuc2xpY2UoMik7XG4gIH1cbiAgaSA9IHN0ci5pbmRleE9mKFwiLlwiKTtcbiAgaXNGbG9hdCA9IGkgPj0gMDtcbiAgQ3RvciA9IHguY29uc3RydWN0b3I7XG4gIGlmIChpc0Zsb2F0KSB7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgIGxlbiA9IHN0ci5sZW5ndGg7XG4gICAgaSA9IGxlbiAtIGk7XG4gICAgZGl2aXNvciA9IGludFBvdyhDdG9yLCBuZXcgQ3RvcihiYXNlKSwgaSwgaSAqIDIpO1xuICB9XG4gIHhkID0gY29udmVydEJhc2Uoc3RyLCBiYXNlLCBCQVNFKTtcbiAgeGUgPSB4ZC5sZW5ndGggLSAxO1xuICBmb3IgKGkgPSB4ZTsgeGRbaV0gPT09IDA7IC0taSlcbiAgICB4ZC5wb3AoKTtcbiAgaWYgKGkgPCAwKVxuICAgIHJldHVybiBuZXcgQ3Rvcih4LnMgKiAwKTtcbiAgeC5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIHhlKTtcbiAgeC5kID0geGQ7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIGlmIChpc0Zsb2F0KVxuICAgIHggPSBkaXZpZGUoeCwgZGl2aXNvciwgbGVuICogNCk7XG4gIGlmIChwKVxuICAgIHggPSB4LnRpbWVzKE1hdGguYWJzKHApIDwgNTQgPyBtYXRocG93KDIsIHApIDogRGVjaW1hbC5wb3coMiwgcCkpO1xuICBleHRlcm5hbCA9IHRydWU7XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XG4gIHZhciBrLCBsZW4gPSB4LmQubGVuZ3RoO1xuICBpZiAobGVuIDwgMylcbiAgICByZXR1cm4gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xuICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XG4gIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xuICB4ID0geC50aW1lcygxIC8gdGlueVBvdyg1LCBrKSk7XG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XG4gIHZhciBzaW4yX3gsIGQ1ID0gbmV3IEN0b3IoNSksIGQxNiA9IG5ldyBDdG9yKDE2KSwgZDIwID0gbmV3IEN0b3IoMjApO1xuICBmb3IgKDsgay0tOyApIHtcbiAgICBzaW4yX3ggPSB4LnRpbWVzKHgpO1xuICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luMl94LnRpbWVzKGQxNi50aW1lcyhzaW4yX3gpLm1pbnVzKGQyMCkpKSk7XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiB0YXlsb3JTZXJpZXMoQ3RvciwgbiwgeCwgeSwgaXNIeXBlcmJvbGljKSB7XG4gIHZhciBqLCB0LCB1LCB4MiwgaSA9IDEsIHByID0gQ3Rvci5wcmVjaXNpb24sIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XG4gIGV4dGVybmFsID0gZmFsc2U7XG4gIHgyID0geC50aW1lcyh4KTtcbiAgdSA9IG5ldyBDdG9yKHkpO1xuICBmb3IgKDsgOyApIHtcbiAgICB0ID0gZGl2aWRlKHUudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XG4gICAgdSA9IGlzSHlwZXJib2xpYyA/IHkucGx1cyh0KSA6IHkubWludXModCk7XG4gICAgeSA9IGRpdmlkZSh0LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xuICAgIHQgPSB1LnBsdXMoeSk7XG4gICAgaWYgKHQuZFtrXSAhPT0gdm9pZCAwKSB7XG4gICAgICBmb3IgKGogPSBrOyB0LmRbal0gPT09IHUuZFtqXSAmJiBqLS07IClcbiAgICAgICAgO1xuICAgICAgaWYgKGogPT0gLTEpXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBqID0gdTtcbiAgICB1ID0geTtcbiAgICB5ID0gdDtcbiAgICB0ID0gajtcbiAgICBpKys7XG4gIH1cbiAgZXh0ZXJuYWwgPSB0cnVlO1xuICB0LmQubGVuZ3RoID0gayArIDE7XG4gIHJldHVybiB0O1xufVxuZnVuY3Rpb24gdGlueVBvdyhiLCBlKSB7XG4gIHZhciBuID0gYjtcbiAgd2hpbGUgKC0tZSlcbiAgICBuICo9IGI7XG4gIHJldHVybiBuO1xufVxuZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XG4gIHZhciB0LCBpc05lZyA9IHgucyA8IDAsIHBpID0gZ2V0UGkoQ3RvciwgQ3Rvci5wcmVjaXNpb24sIDEpLCBoYWxmUGkgPSBwaS50aW1lcygwLjUpO1xuICB4ID0geC5hYnMoKTtcbiAgaWYgKHgubHRlKGhhbGZQaSkpIHtcbiAgICBxdWFkcmFudCA9IGlzTmVnID8gNCA6IDE7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgdCA9IHguZGl2VG9JbnQocGkpO1xuICBpZiAodC5pc1plcm8oKSkge1xuICAgIHF1YWRyYW50ID0gaXNOZWcgPyAzIDogMjtcbiAgfSBlbHNlIHtcbiAgICB4ID0geC5taW51cyh0LnRpbWVzKHBpKSk7XG4gICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcbiAgICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyBpc05lZyA/IDIgOiAzIDogaXNOZWcgPyA0IDogMTtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgICBxdWFkcmFudCA9IGlzT2RkKHQpID8gaXNOZWcgPyAxIDogNCA6IGlzTmVnID8gMyA6IDI7XG4gIH1cbiAgcmV0dXJuIHgubWludXMocGkpLmFicygpO1xufVxuZnVuY3Rpb24gdG9TdHJpbmdCaW5hcnkoeCwgYmFzZU91dCwgc2QsIHJtKSB7XG4gIHZhciBiYXNlLCBlLCBpLCBrLCBsZW4sIHJvdW5kVXAsIHN0ciwgeGQsIHksIEN0b3IgPSB4LmNvbnN0cnVjdG9yLCBpc0V4cCA9IHNkICE9PSB2b2lkIDA7XG4gIGlmIChpc0V4cCkge1xuICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xuICAgIGlmIChybSA9PT0gdm9pZCAwKVxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICAgIGVsc2VcbiAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xuICB9IGVsc2Uge1xuICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xuICB9XG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XG4gICAgc3RyID0gbm9uRmluaXRlVG9TdHJpbmcoeCk7XG4gIH0gZWxzZSB7XG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XG4gICAgaSA9IHN0ci5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaXNFeHApIHtcbiAgICAgIGJhc2UgPSAyO1xuICAgICAgaWYgKGJhc2VPdXQgPT0gMTYpIHtcbiAgICAgICAgc2QgPSBzZCAqIDQgLSAzO1xuICAgICAgfSBlbHNlIGlmIChiYXNlT3V0ID09IDgpIHtcbiAgICAgICAgc2QgPSBzZCAqIDMgLSAyO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBiYXNlID0gYmFzZU91dDtcbiAgICB9XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgICAgeSA9IG5ldyBDdG9yKDEpO1xuICAgICAgeS5lID0gc3RyLmxlbmd0aCAtIGk7XG4gICAgICB5LmQgPSBjb252ZXJ0QmFzZShmaW5pdGVUb1N0cmluZyh5KSwgMTAsIGJhc2UpO1xuICAgICAgeS5lID0geS5kLmxlbmd0aDtcbiAgICB9XG4gICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIDEwLCBiYXNlKTtcbiAgICBlID0gbGVuID0geGQubGVuZ3RoO1xuICAgIGZvciAoOyB4ZFstLWxlbl0gPT0gMDsgKVxuICAgICAgeGQucG9wKCk7XG4gICAgaWYgKCF4ZFswXSkge1xuICAgICAgc3RyID0gaXNFeHAgPyBcIjBwKzBcIiA6IFwiMFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgZS0tO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeCA9IG5ldyBDdG9yKHgpO1xuICAgICAgICB4LmQgPSB4ZDtcbiAgICAgICAgeC5lID0gZTtcbiAgICAgICAgeCA9IGRpdmlkZSh4LCB5LCBzZCwgcm0sIDAsIGJhc2UpO1xuICAgICAgICB4ZCA9IHguZDtcbiAgICAgICAgZSA9IHguZTtcbiAgICAgICAgcm91bmRVcCA9IGluZXhhY3Q7XG4gICAgICB9XG4gICAgICBpID0geGRbc2RdO1xuICAgICAgayA9IGJhc2UgLyAyO1xuICAgICAgcm91bmRVcCA9IHJvdW5kVXAgfHwgeGRbc2QgKyAxXSAhPT0gdm9pZCAwO1xuICAgICAgcm91bmRVcCA9IHJtIDwgNCA/IChpICE9PSB2b2lkIDAgfHwgcm91bmRVcCkgJiYgKHJtID09PSAwIHx8IHJtID09PSAoeC5zIDwgMCA/IDMgOiAyKSkgOiBpID4gayB8fCBpID09PSBrICYmIChybSA9PT0gNCB8fCByb3VuZFVwIHx8IHJtID09PSA2ICYmIHhkW3NkIC0gMV0gJiAxIHx8IHJtID09PSAoeC5zIDwgMCA/IDggOiA3KSk7XG4gICAgICB4ZC5sZW5ndGggPSBzZDtcbiAgICAgIGlmIChyb3VuZFVwKSB7XG4gICAgICAgIGZvciAoOyArK3hkWy0tc2RdID4gYmFzZSAtIDE7ICkge1xuICAgICAgICAgIHhkW3NkXSA9IDA7XG4gICAgICAgICAgaWYgKCFzZCkge1xuICAgICAgICAgICAgKytlO1xuICAgICAgICAgICAgeGQudW5zaGlmdCgxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKVxuICAgICAgICA7XG4gICAgICBmb3IgKGkgPSAwLCBzdHIgPSBcIlwiOyBpIDwgbGVuOyBpKyspXG4gICAgICAgIHN0ciArPSBOVU1FUkFMUy5jaGFyQXQoeGRbaV0pO1xuICAgICAgaWYgKGlzRXhwKSB7XG4gICAgICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XG4gICAgICAgICAgICBpID0gYmFzZU91dCA9PSAxNiA/IDQgOiAzO1xuICAgICAgICAgICAgZm9yICgtLWxlbjsgbGVuICUgaTsgbGVuKyspXG4gICAgICAgICAgICAgIHN0ciArPSBcIjBcIjtcbiAgICAgICAgICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCBiYXNlLCBiYXNlT3V0KTtcbiAgICAgICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKVxuICAgICAgICAgICAgICA7XG4gICAgICAgICAgICBmb3IgKGkgPSAxLCBzdHIgPSBcIjEuXCI7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyBcIi5cIiArIHN0ci5zbGljZSgxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RyID0gc3RyICsgKGUgPCAwID8gXCJwXCIgOiBcInArXCIpICsgZTtcbiAgICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcbiAgICAgICAgZm9yICg7ICsrZTsgKVxuICAgICAgICAgIHN0ciA9IFwiMFwiICsgc3RyO1xuICAgICAgICBzdHIgPSBcIjAuXCIgKyBzdHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKytlID4gbGVuKVxuICAgICAgICAgIGZvciAoZSAtPSBsZW47IGUtLTsgKVxuICAgICAgICAgICAgc3RyICs9IFwiMFwiO1xuICAgICAgICBlbHNlIGlmIChlIDwgbGVuKVxuICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArIFwiLlwiICsgc3RyLnNsaWNlKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdHIgPSAoYmFzZU91dCA9PSAxNiA/IFwiMHhcIiA6IGJhc2VPdXQgPT0gMiA/IFwiMGJcIiA6IGJhc2VPdXQgPT0gOCA/IFwiMG9cIiA6IFwiXCIpICsgc3RyO1xuICB9XG4gIHJldHVybiB4LnMgPCAwID8gXCItXCIgKyBzdHIgOiBzdHI7XG59XG5mdW5jdGlvbiB0cnVuY2F0ZShhcnIsIGxlbikge1xuICBpZiAoYXJyLmxlbmd0aCA+IGxlbikge1xuICAgIGFyci5sZW5ndGggPSBsZW47XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbmZ1bmN0aW9uIGFicyh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hYnMoKTtcbn1cbmZ1bmN0aW9uIGFjb3MoeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuYWNvcygpO1xufVxuZnVuY3Rpb24gYWNvc2goeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuYWNvc2goKTtcbn1cbmZ1bmN0aW9uIGFkZCh4LCB5KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5wbHVzKHkpO1xufVxuZnVuY3Rpb24gYXNpbih4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XG59XG5mdW5jdGlvbiBhc2luaCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luaCgpO1xufVxuZnVuY3Rpb24gYXRhbih4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuKCk7XG59XG5mdW5jdGlvbiBhdGFuaCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuaCgpO1xufVxuZnVuY3Rpb24gYXRhbjIoeSwgeCkge1xuICB5ID0gbmV3IHRoaXMoeSk7XG4gIHggPSBuZXcgdGhpcyh4KTtcbiAgdmFyIHIsIHByID0gdGhpcy5wcmVjaXNpb24sIHJtID0gdGhpcy5yb3VuZGluZywgd3ByID0gcHIgKyA0O1xuICBpZiAoIXkucyB8fCAheC5zKSB7XG4gICAgciA9IG5ldyB0aGlzKE5hTik7XG4gIH0gZWxzZSBpZiAoIXkuZCAmJiAheC5kKSB7XG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcbiAgICByLnMgPSB5LnM7XG4gIH0gZWxzZSBpZiAoIXguZCB8fCB5LmlzWmVybygpKSB7XG4gICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XG4gICAgci5zID0geS5zO1xuICB9IGVsc2UgaWYgKCF5LmQgfHwgeC5pc1plcm8oKSkge1xuICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XG4gICAgci5zID0geS5zO1xuICB9IGVsc2UgaWYgKHgucyA8IDApIHtcbiAgICB0aGlzLnByZWNpc2lvbiA9IHdwcjtcbiAgICB0aGlzLnJvdW5kaW5nID0gMTtcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcbiAgICB4ID0gZ2V0UGkodGhpcywgd3ByLCAxKTtcbiAgICB0aGlzLnByZWNpc2lvbiA9IHByO1xuICAgIHRoaXMucm91bmRpbmcgPSBybTtcbiAgICByID0geS5zIDwgMCA/IHIubWludXMoeCkgOiByLnBsdXMoeCk7XG4gIH0gZWxzZSB7XG4gICAgciA9IHRoaXMuYXRhbihkaXZpZGUoeSwgeCwgd3ByLCAxKSk7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBjYnJ0KHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcbn1cbmZ1bmN0aW9uIGNlaWwoeCkge1xuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcbn1cbmZ1bmN0aW9uIGNvbmZpZyhvYmopIHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIilcbiAgICB0aHJvdyBFcnJvcihkZWNpbWFsRXJyb3IgKyBcIk9iamVjdCBleHBlY3RlZFwiKTtcbiAgdmFyIGksIHAsIHYsIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLCBwcyA9IFtcbiAgICBcInByZWNpc2lvblwiLFxuICAgIDEsXG4gICAgTUFYX0RJR0lUUyxcbiAgICBcInJvdW5kaW5nXCIsXG4gICAgMCxcbiAgICA4LFxuICAgIFwidG9FeHBOZWdcIixcbiAgICAtRVhQX0xJTUlULFxuICAgIDAsXG4gICAgXCJ0b0V4cFBvc1wiLFxuICAgIDAsXG4gICAgRVhQX0xJTUlULFxuICAgIFwibWF4RVwiLFxuICAgIDAsXG4gICAgRVhQX0xJTUlULFxuICAgIFwibWluRVwiLFxuICAgIC1FWFBfTElNSVQsXG4gICAgMCxcbiAgICBcIm1vZHVsb1wiLFxuICAgIDAsXG4gICAgOVxuICBdO1xuICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBpZiAocCA9IHBzW2ldLCB1c2VEZWZhdWx0cylcbiAgICAgIHRoaXNbcF0gPSBERUZBVUxUU1twXTtcbiAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcbiAgICAgIGlmIChtYXRoZmxvb3IodikgPT09IHYgJiYgdiA+PSBwc1tpICsgMV0gJiYgdiA8PSBwc1tpICsgMl0pXG4gICAgICAgIHRoaXNbcF0gPSB2O1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgXCI6IFwiICsgdik7XG4gICAgfVxuICB9XG4gIGlmIChwID0gXCJjcnlwdG9cIiwgdXNlRGVmYXVsdHMpXG4gICAgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xuICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcbiAgICBpZiAodiA9PT0gdHJ1ZSB8fCB2ID09PSBmYWxzZSB8fCB2ID09PSAwIHx8IHYgPT09IDEpIHtcbiAgICAgIGlmICh2KSB7XG4gICAgICAgIGlmICh0eXBlb2YgY3J5cHRvICE9IFwidW5kZWZpbmVkXCIgJiYgY3J5cHRvICYmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcbiAgICAgICAgICB0aGlzW3BdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNbcF0gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArIFwiOiBcIiArIHYpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIGNvcyh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcbn1cbmZ1bmN0aW9uIGNvc2goeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuY29zaCgpO1xufVxuZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gIHZhciBpLCBwLCBwcztcbiAgZnVuY3Rpb24gRGVjaW1hbDIodikge1xuICAgIHZhciBlLCBpMiwgdCwgeCA9IHRoaXM7XG4gICAgaWYgKCEoeCBpbnN0YW5jZW9mIERlY2ltYWwyKSlcbiAgICAgIHJldHVybiBuZXcgRGVjaW1hbDIodik7XG4gICAgeC5jb25zdHJ1Y3RvciA9IERlY2ltYWwyO1xuICAgIGlmICh2IGluc3RhbmNlb2YgRGVjaW1hbDIpIHtcbiAgICAgIHgucyA9IHYucztcbiAgICAgIGlmIChleHRlcm5hbCkge1xuICAgICAgICBpZiAoIXYuZCB8fCB2LmUgPiBEZWNpbWFsMi5tYXhFKSB7XG4gICAgICAgICAgeC5lID0gTmFOO1xuICAgICAgICAgIHguZCA9IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAodi5lIDwgRGVjaW1hbDIubWluRSkge1xuICAgICAgICAgIHguZSA9IDA7XG4gICAgICAgICAgeC5kID0gWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHguZSA9IHYuZTtcbiAgICAgICAgICB4LmQgPSB2LmQuc2xpY2UoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeC5lID0gdi5lO1xuICAgICAgICB4LmQgPSB2LmQgPyB2LmQuc2xpY2UoKSA6IHYuZDtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdCA9IHR5cGVvZiB2O1xuICAgIGlmICh0ID09PSBcIm51bWJlclwiKSB7XG4gICAgICBpZiAodiA9PT0gMCkge1xuICAgICAgICB4LnMgPSAxIC8gdiA8IDAgPyAtMSA6IDE7XG4gICAgICAgIHguZSA9IDA7XG4gICAgICAgIHguZCA9IFswXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYgPCAwKSB7XG4gICAgICAgIHYgPSAtdjtcbiAgICAgICAgeC5zID0gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4LnMgPSAxO1xuICAgICAgfVxuICAgICAgaWYgKHYgPT09IH5+diAmJiB2IDwgMWU3KSB7XG4gICAgICAgIGZvciAoZSA9IDAsIGkyID0gdjsgaTIgPj0gMTA7IGkyIC89IDEwKVxuICAgICAgICAgIGUrKztcbiAgICAgICAgaWYgKGV4dGVybmFsKSB7XG4gICAgICAgICAgaWYgKGUgPiBEZWNpbWFsMi5tYXhFKSB7XG4gICAgICAgICAgICB4LmUgPSBOYU47XG4gICAgICAgICAgICB4LmQgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZSA8IERlY2ltYWwyLm1pbkUpIHtcbiAgICAgICAgICAgIHguZSA9IDA7XG4gICAgICAgICAgICB4LmQgPSBbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHguZSA9IGU7XG4gICAgICAgICAgICB4LmQgPSBbdl07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHguZSA9IGU7XG4gICAgICAgICAgeC5kID0gW3ZdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcbiAgICAgICAgaWYgKCF2KVxuICAgICAgICAgIHgucyA9IE5hTjtcbiAgICAgICAgeC5lID0gTmFOO1xuICAgICAgICB4LmQgPSBudWxsO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VEZWNpbWFsKHgsIHYudG9TdHJpbmcoKSk7XG4gICAgfSBlbHNlIGlmICh0ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB2KTtcbiAgICB9XG4gICAgaWYgKChpMiA9IHYuY2hhckNvZGVBdCgwKSkgPT09IDQ1KSB7XG4gICAgICB2ID0gdi5zbGljZSgxKTtcbiAgICAgIHgucyA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaTIgPT09IDQzKVxuICAgICAgICB2ID0gdi5zbGljZSgxKTtcbiAgICAgIHgucyA9IDE7XG4gICAgfVxuICAgIHJldHVybiBpc0RlY2ltYWwudGVzdCh2KSA/IHBhcnNlRGVjaW1hbCh4LCB2KSA6IHBhcnNlT3RoZXIoeCwgdik7XG4gIH1cbiAgRGVjaW1hbDIucHJvdG90eXBlID0gUDtcbiAgRGVjaW1hbDIuUk9VTkRfVVAgPSAwO1xuICBEZWNpbWFsMi5ST1VORF9ET1dOID0gMTtcbiAgRGVjaW1hbDIuUk9VTkRfQ0VJTCA9IDI7XG4gIERlY2ltYWwyLlJPVU5EX0ZMT09SID0gMztcbiAgRGVjaW1hbDIuUk9VTkRfSEFMRl9VUCA9IDQ7XG4gIERlY2ltYWwyLlJPVU5EX0hBTEZfRE9XTiA9IDU7XG4gIERlY2ltYWwyLlJPVU5EX0hBTEZfRVZFTiA9IDY7XG4gIERlY2ltYWwyLlJPVU5EX0hBTEZfQ0VJTCA9IDc7XG4gIERlY2ltYWwyLlJPVU5EX0hBTEZfRkxPT1IgPSA4O1xuICBEZWNpbWFsMi5FVUNMSUQgPSA5O1xuICBEZWNpbWFsMi5jb25maWcgPSBEZWNpbWFsMi5zZXQgPSBjb25maWc7XG4gIERlY2ltYWwyLmNsb25lID0gY2xvbmU7XG4gIERlY2ltYWwyLmlzRGVjaW1hbCA9IGlzRGVjaW1hbEluc3RhbmNlO1xuICBEZWNpbWFsMi5hYnMgPSBhYnM7XG4gIERlY2ltYWwyLmFjb3MgPSBhY29zO1xuICBEZWNpbWFsMi5hY29zaCA9IGFjb3NoO1xuICBEZWNpbWFsMi5hZGQgPSBhZGQ7XG4gIERlY2ltYWwyLmFzaW4gPSBhc2luO1xuICBEZWNpbWFsMi5hc2luaCA9IGFzaW5oO1xuICBEZWNpbWFsMi5hdGFuID0gYXRhbjtcbiAgRGVjaW1hbDIuYXRhbmggPSBhdGFuaDtcbiAgRGVjaW1hbDIuYXRhbjIgPSBhdGFuMjtcbiAgRGVjaW1hbDIuY2JydCA9IGNicnQ7XG4gIERlY2ltYWwyLmNlaWwgPSBjZWlsO1xuICBEZWNpbWFsMi5jb3MgPSBjb3M7XG4gIERlY2ltYWwyLmNvc2ggPSBjb3NoO1xuICBEZWNpbWFsMi5kaXYgPSBkaXY7XG4gIERlY2ltYWwyLmV4cCA9IGV4cDtcbiAgRGVjaW1hbDIuZmxvb3IgPSBmbG9vcjtcbiAgRGVjaW1hbDIuaHlwb3QgPSBoeXBvdDtcbiAgRGVjaW1hbDIubG4gPSBsbjtcbiAgRGVjaW1hbDIubG9nID0gbG9nO1xuICBEZWNpbWFsMi5sb2cxMCA9IGxvZzEwO1xuICBEZWNpbWFsMi5sb2cyID0gbG9nMjtcbiAgRGVjaW1hbDIubWF4ID0gbWF4O1xuICBEZWNpbWFsMi5taW4gPSBtaW47XG4gIERlY2ltYWwyLm1vZCA9IG1vZDtcbiAgRGVjaW1hbDIubXVsID0gbXVsO1xuICBEZWNpbWFsMi5wb3cgPSBwb3c7XG4gIERlY2ltYWwyLnJhbmRvbSA9IHJhbmRvbTtcbiAgRGVjaW1hbDIucm91bmQgPSByb3VuZDtcbiAgRGVjaW1hbDIuc2lnbiA9IHNpZ247XG4gIERlY2ltYWwyLnNpbiA9IHNpbjtcbiAgRGVjaW1hbDIuc2luaCA9IHNpbmg7XG4gIERlY2ltYWwyLnNxcnQgPSBzcXJ0O1xuICBEZWNpbWFsMi5zdWIgPSBzdWI7XG4gIERlY2ltYWwyLnRhbiA9IHRhbjtcbiAgRGVjaW1hbDIudGFuaCA9IHRhbmg7XG4gIERlY2ltYWwyLnRydW5jID0gdHJ1bmM7XG4gIGlmIChvYmogPT09IHZvaWQgMClcbiAgICBvYmogPSB7fTtcbiAgaWYgKG9iaikge1xuICAgIGlmIChvYmouZGVmYXVsdHMgIT09IHRydWUpIHtcbiAgICAgIHBzID0gW1wicHJlY2lzaW9uXCIsIFwicm91bmRpbmdcIiwgXCJ0b0V4cE5lZ1wiLCBcInRvRXhwUG9zXCIsIFwibWF4RVwiLCBcIm1pbkVcIiwgXCJtb2R1bG9cIiwgXCJjcnlwdG9cIl07XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOyApXG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KHAgPSBwc1tpKytdKSlcbiAgICAgICAgICBvYmpbcF0gPSB0aGlzW3BdO1xuICAgIH1cbiAgfVxuICBEZWNpbWFsMi5jb25maWcob2JqKTtcbiAgcmV0dXJuIERlY2ltYWwyO1xufVxuZnVuY3Rpb24gZGl2KHgsIHkpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmRpdih5KTtcbn1cbmZ1bmN0aW9uIGV4cCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5leHAoKTtcbn1cbmZ1bmN0aW9uIGZsb29yKHgpIHtcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMyk7XG59XG5mdW5jdGlvbiBoeXBvdCgpIHtcbiAgdmFyIGksIG4sIHQgPSBuZXcgdGhpcygwKTtcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICkge1xuICAgIG4gPSBuZXcgdGhpcyhhcmd1bWVudHNbaSsrXSk7XG4gICAgaWYgKCFuLmQpIHtcbiAgICAgIGlmIChuLnMpIHtcbiAgICAgICAgZXh0ZXJuYWwgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoMSAvIDApO1xuICAgICAgfVxuICAgICAgdCA9IG47XG4gICAgfSBlbHNlIGlmICh0LmQpIHtcbiAgICAgIHQgPSB0LnBsdXMobi50aW1lcyhuKSk7XG4gICAgfVxuICB9XG4gIGV4dGVybmFsID0gdHJ1ZTtcbiAgcmV0dXJuIHQuc3FydCgpO1xufVxuZnVuY3Rpb24gaXNEZWNpbWFsSW5zdGFuY2Uob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBEZWNpbWFsIHx8IG9iaiAmJiBvYmoubmFtZSA9PT0gXCJbb2JqZWN0IERlY2ltYWxdXCIgfHwgZmFsc2U7XG59XG5mdW5jdGlvbiBsbih4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5sbigpO1xufVxuZnVuY3Rpb24gbG9nKHgsIHkpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZyh5KTtcbn1cbmZ1bmN0aW9uIGxvZzIoeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDIpO1xufVxuZnVuY3Rpb24gbG9nMTAoeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDEwKTtcbn1cbmZ1bmN0aW9uIG1heCgpIHtcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgXCJsdFwiKTtcbn1cbmZ1bmN0aW9uIG1pbigpIHtcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgXCJndFwiKTtcbn1cbmZ1bmN0aW9uIG1vZCh4LCB5KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5tb2QoeSk7XG59XG5mdW5jdGlvbiBtdWwoeCwgeSkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkubXVsKHkpO1xufVxuZnVuY3Rpb24gcG93KHgsIHkpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnBvdyh5KTtcbn1cbmZ1bmN0aW9uIHJhbmRvbShzZCkge1xuICB2YXIgZCwgZSwgaywgbiwgaSA9IDAsIHIgPSBuZXcgdGhpcygxKSwgcmQgPSBbXTtcbiAgaWYgKHNkID09PSB2b2lkIDApXG4gICAgc2QgPSB0aGlzLnByZWNpc2lvbjtcbiAgZWxzZVxuICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xuICBrID0gTWF0aC5jZWlsKHNkIC8gTE9HX0JBU0UpO1xuICBpZiAoIXRoaXMuY3J5cHRvKSB7XG4gICAgZm9yICg7IGkgPCBrOyApXG4gICAgICByZFtpKytdID0gTWF0aC5yYW5kb20oKSAqIDFlNyB8IDA7XG4gIH0gZWxzZSBpZiAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIGQgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheShrKSk7XG4gICAgZm9yICg7IGkgPCBrOyApIHtcbiAgICAgIG4gPSBkW2ldO1xuICAgICAgaWYgKG4gPj0gNDI5ZTcpIHtcbiAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJkW2krK10gPSBuICUgMWU3O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcbiAgICBkID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGsgKj0gNCk7XG4gICAgZm9yICg7IGkgPCBrOyApIHtcbiAgICAgIG4gPSBkW2ldICsgKGRbaSArIDFdIDw8IDgpICsgKGRbaSArIDJdIDw8IDE2KSArICgoZFtpICsgM10gJiAxMjcpIDw8IDI0KTtcbiAgICAgIGlmIChuID49IDIxNGU3KSB7XG4gICAgICAgIGNyeXB0by5yYW5kb21CeXRlcyg0KS5jb3B5KGQsIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmQucHVzaChuICUgMWU3KTtcbiAgICAgICAgaSArPSA0O1xuICAgICAgfVxuICAgIH1cbiAgICBpID0gayAvIDQ7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoY3J5cHRvVW5hdmFpbGFibGUpO1xuICB9XG4gIGsgPSByZFstLWldO1xuICBzZCAlPSBMT0dfQkFTRTtcbiAgaWYgKGsgJiYgc2QpIHtcbiAgICBuID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBzZCk7XG4gICAgcmRbaV0gPSAoayAvIG4gfCAwKSAqIG47XG4gIH1cbiAgZm9yICg7IHJkW2ldID09PSAwOyBpLS0pXG4gICAgcmQucG9wKCk7XG4gIGlmIChpIDwgMCkge1xuICAgIGUgPSAwO1xuICAgIHJkID0gWzBdO1xuICB9IGVsc2Uge1xuICAgIGUgPSAtMTtcbiAgICBmb3IgKDsgcmRbMF0gPT09IDA7IGUgLT0gTE9HX0JBU0UpXG4gICAgICByZC5zaGlmdCgpO1xuICAgIGZvciAoayA9IDEsIG4gPSByZFswXTsgbiA+PSAxMDsgbiAvPSAxMClcbiAgICAgIGsrKztcbiAgICBpZiAoayA8IExPR19CQVNFKVxuICAgICAgZSAtPSBMT0dfQkFTRSAtIGs7XG4gIH1cbiAgci5lID0gZTtcbiAgci5kID0gcmQ7XG4gIHJldHVybiByO1xufVxuZnVuY3Rpb24gcm91bmQoeCkge1xuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcbn1cbmZ1bmN0aW9uIHNpZ24oeCkge1xuICB4ID0gbmV3IHRoaXMoeCk7XG4gIHJldHVybiB4LmQgPyB4LmRbMF0gPyB4LnMgOiAwICogeC5zIDogeC5zIHx8IE5hTjtcbn1cbmZ1bmN0aW9uIHNpbih4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW4oKTtcbn1cbmZ1bmN0aW9uIHNpbmgoeCkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuc2luaCgpO1xufVxuZnVuY3Rpb24gc3FydCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XG59XG5mdW5jdGlvbiBzdWIoeCwgeSkge1xuICByZXR1cm4gbmV3IHRoaXMoeCkuc3ViKHkpO1xufVxuZnVuY3Rpb24gdGFuKHgpIHtcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbigpO1xufVxuZnVuY3Rpb24gdGFuaCh4KSB7XG4gIHJldHVybiBuZXcgdGhpcyh4KS50YW5oKCk7XG59XG5mdW5jdGlvbiB0cnVuYyh4KSB7XG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDEpO1xufVxuUFtTeW1ib2wuZm9yKFwibm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b21cIildID0gUC50b1N0cmluZztcblBbU3ltYm9sLnRvU3RyaW5nVGFnXSA9IFwiRGVjaW1hbFwiO1xuZXhwb3J0IHZhciBEZWNpbWFsID0gY2xvbmUoREVGQVVMVFMpO1xuTE4xMCA9IG5ldyBEZWNpbWFsKExOMTApO1xuUEkgPSBuZXcgRGVjaW1hbChQSSk7XG5leHBvcnQgZGVmYXVsdCBEZWNpbWFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxld29nSUNKMlpYSnphVzl1SWpvZ015d0tJQ0FpYzI5MWNtTmxjeUk2SUZzaVF6cGNYSGR2Y210emNHRmpaVnhjYlc5dVpYbGNYRzV2WkdWZmJXOWtkV3hsYzF4Y0xuQnVjRzFjWEdSbFkybHRZV3d1YW5OQU1UQXVNaTR4WEZ4dWIyUmxYMjF2WkhWc1pYTmNYR1JsWTJsdFlXd3Vhbk5jWEdSbFkybHRZV3d1YldweklsMHNDaUFnSW0xaGNIQnBibWR6SWpvZ0lrRkJZMEVzU1VGQlNTeFpRVUZaTEUxQlNXUXNZVUZCWVN4TFFVZGlMRmRCUVZjc2IwSkJSMWdzVDBGQlR5eHpaME5CUjFBc1MwRkJTeXh6WjBOQlNVd3NWMEZCVnp0QlFVRkJMRVZCVDFRc1YwRkJWenRCUVVGQkxFVkJhVUpZTEZWQlFWVTdRVUZCUVN4RlFXVldMRkZCUVZFN1FVRkJRU3hGUVVsU0xGVkJRVlU3UVVGQlFTeEZRVWxXTEZWQlFWYzdRVUZCUVN4RlFVbFlMRTFCUVUwc1EwRkJRenRCUVVGQkxFVkJTVkFzVFVGQlRUdEJRVUZCTEVWQlIwNHNVVUZCVVR0QlFVRkJMRWRCVDFZc1UwRkJVeXhWUVVOVUxGZEJRVmNzVFVGRldDeGxRVUZsTEcxQ1FVTm1MR3RDUVVGclFpeGxRVUZsTEhOQ1FVTnFReXg1UWtGQmVVSXNaVUZCWlN3MFFrRkRlRU1zYjBKQlFXOUNMR1ZCUVdVc2MwSkJSVzVETEZsQlFWa3NTMEZCU3l4UFFVTnFRaXhWUVVGVkxFdEJRVXNzUzBGRlppeFhRVUZYTERoRFFVTllMRkZCUVZFc01FUkJRMUlzVlVGQlZTeHBSRUZEVml4WlFVRlpMSE5EUVVWYUxFOUJRVThzUzBGRFVDeFhRVUZYTEVkQlExZ3NiVUpCUVcxQ0xHdENRVVZ1UWl4cFFrRkJhVUlzUzBGQlN5eFRRVUZUTEVkQlF5OUNMR1ZCUVdVc1IwRkJSeXhUUVVGVExFZEJSek5DTEVsQlFVa3NRMEZCUlN4TlFVRk5PMEZCZVVWa0xFVkJRVVVzWjBKQlFXZENMRVZCUVVVc1RVRkJUU3hYUVVGWk8wRkJRM0JETEUxQlFVa3NTVUZCU1N4SlFVRkpMRXRCUVVzc1dVRkJXVHRCUVVNM1FpeE5RVUZKTEVWQlFVVXNTVUZCU1R0QlFVRkhMRTFCUVVVc1NVRkJTVHRCUVVOdVFpeFRRVUZQTEZOQlFWTTdRVUZCUVR0QlFWTnNRaXhGUVVGRkxFOUJRVThzVjBGQldUdEJRVU51UWl4VFFVRlBMRk5CUVZNc1NVRkJTU3hMUVVGTExGbEJRVmtzVDBGQlR5eExRVUZMTEVsQlFVa3NSMEZCUnp0QlFVRkJPMEZCV1RGRUxFVkJRVVVzWVVGQllTeEZRVUZGTEUxQlFVMHNVMEZCVlN4SFFVRkhPMEZCUTJ4RExFMUJRVWtzUjBGQlJ5eEhRVUZITEV0QlFVc3NTMEZEWWl4SlFVRkpMRTFCUTBvc1MwRkJTeXhGUVVGRkxFZEJRMUFzUzBGQlRTeExRVUZKTEVsQlFVa3NSVUZCUlN4WlFVRlpMRWxCUVVrc1IwRkRhRU1zUzBGQlN5eEZRVUZGTEVkQlExQXNTMEZCU3l4RlFVRkZPMEZCUjFRc1RVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTzBGQlEyUXNWMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFMUJRVTBzVDBGQlR5eExRVUZMTEV0QlFVc3NUMEZCVHl4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFdEJRVXNzU1VGQlNTeEpRVUZKTzBGQlFVRTdRVUZKYUVZc1RVRkJTU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVYzdRVUZCU1N4WFFVRlBMRWRCUVVjc1MwRkJTeXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVczdRVUZIZUVRc1RVRkJTU3hQUVVGUE8wRkJRVWtzVjBGQlR6dEJRVWQwUWl4TlFVRkpMRVZCUVVVc1RVRkJUU3hGUVVGRk8wRkJRVWNzVjBGQlR5eEZRVUZGTEVsQlFVa3NSVUZCUlN4SlFVRkpMRXRCUVVzc1NVRkJTU3hKUVVGSk8wRkJSV3BFTEZGQlFVMHNSMEZCUnp0QlFVTlVMRkZCUVUwc1IwRkJSenRCUVVkVUxFOUJRVXNzU1VGQlNTeEhRVUZITEVsQlFVa3NUVUZCVFN4TlFVRk5MRTFCUVUwc1MwRkJTeXhKUVVGSkxFZEJRVWNzUlVGQlJTeEhRVUZITzBGQlEycEVMRkZCUVVrc1IwRkJSeXhQUVVGUExFZEJRVWM3UVVGQlNTeGhRVUZQTEVkQlFVY3NTMEZCU3l4SFFVRkhMRXRCUVVzc1MwRkJTeXhKUVVGSkxFbEJRVWs3UVVGQlFUdEJRVWt6UkN4VFFVRlBMRkZCUVZFc1RVRkJUU3hKUVVGSkxFMUJRVTBzVFVGQlRTeExRVUZMTEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCYVVKd1JDeEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MRmRCUVZrN1FVRkROMElzVFVGQlNTeEpRVUZKTEVsQlEwNHNTVUZCU1N4TlFVTktMRTlCUVU4c1JVRkJSVHRCUVVWWUxFMUJRVWtzUTBGQlF5eEZRVUZGTzBGQlFVY3NWMEZCVHl4SlFVRkpMRXRCUVVzN1FVRkhNVUlzVFVGQlNTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVRkpMRmRCUVU4c1NVRkJTU3hMUVVGTE8wRkJSVGRDTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzV1VGQldTeExRVUZMTEV0QlFVc3NTVUZCU1N4RlFVRkZMRWRCUVVjc1JVRkJSU3hSUVVGUk8wRkJRemxETEU5QlFVc3NWMEZCVnp0QlFVVm9RaXhOUVVGSkxFOUJRVThzVFVGQlRTeHBRa0ZCYVVJc1RVRkJUVHRCUVVWNFF5eFBRVUZMTEZsQlFWazdRVUZEYWtJc1QwRkJTeXhYUVVGWE8wRkJSV2hDTEZOQlFVOHNVMEZCVXl4WlFVRlpMRXRCUVVzc1dVRkJXU3hKUVVGSkxFVkJRVVVzVVVGQlVTeEhRVUZITEVsQlFVa3NTVUZCU1R0QlFVRkJPMEZCYjBKNFJTeEZRVUZGTEZkQlFWY3NSVUZCUlN4UFFVRlBMRmRCUVZrN1FVRkRhRU1zVFVGQlNTeEhRVUZITEVkQlFVY3NSMEZCUnl4SFFVRkhMRXRCUVVzc1IwRkJSeXhKUVVGSkxFZEJRVWNzU1VGQlNTeFRRVU5xUXl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRk8wRkJSVmdzVFVGQlNTeERRVUZETEVWQlFVVXNZMEZCWXl4RlFVRkZPMEZCUVZVc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRGFrUXNZVUZCVnp0QlFVZFlMRTFCUVVrc1JVRkJSU3hKUVVGSkxGRkJRVkVzUlVGQlJTeEpRVUZKTEVkQlFVY3NTVUZCU1R0QlFVa3ZRaXhOUVVGSkxFTkJRVU1zUzBGQlN5eExRVUZMTEVsQlFVa3NUVUZCVFN4SlFVRkpMRWRCUVVjN1FVRkRPVUlzVVVGQlNTeGxRVUZsTEVWQlFVVTdRVUZEY2tJc1VVRkJTU3hGUVVGRk8wRkJSMDRzVVVGQlNTeEpRVUZMTEV0QlFVa3NSVUZCUlN4VFFVRlRMRXRCUVVzN1FVRkJSeXhYUVVGTkxFdEJRVXNzUzBGQlN5eExRVUZMTEV0QlFVc3NUVUZCVFR0QlFVTm9SU3hSUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTzBGQlIyNUNMRkZCUVVrc1ZVRkJWeXhMUVVGSkxFdEJRVXNzUzBGQlRTeExRVUZKTEV0QlFVMHNTMEZCU1N4SlFVRkpMRXRCUVVzN1FVRkZja1FzVVVGQlNTeExRVUZMTEVsQlFVa3NSMEZCUnp0QlFVTmtMRlZCUVVrc1QwRkJUenRCUVVGQkxGZEJRMDQ3UVVGRFRDeFZRVUZKTEVWQlFVVTdRVUZEVGl4VlFVRkpMRVZCUVVVc1RVRkJUU3hIUVVGSExFVkJRVVVzVVVGQlVTeFBRVUZQTEV0QlFVczdRVUZCUVR0QlFVZDJReXhSUVVGSkxFbEJRVWtzUzBGQlN6dEJRVU5pTEUxQlFVVXNTVUZCU1N4RlFVRkZPMEZCUVVFc1UwRkRTRHRCUVVOTUxGRkJRVWtzU1VGQlNTeExRVUZMTEVWQlFVVTdRVUZCUVR0QlFVZHFRaXhQUVVGTkxFdEJRVWtzUzBGQlN5eGhRVUZoTzBGQlNUVkNMR0ZCUVZNN1FVRkRVQ3hSUVVGSk8wRkJRMG9zVTBGQlN5eEZRVUZGTEUxQlFVMHNSMEZCUnl4TlFVRk5PMEZCUTNSQ0xHTkJRVlVzUjBGQlJ5eExRVUZMTzBGQlEyeENMRkZCUVVrc1QwRkJUeXhSUVVGUkxFdEJRVXNzUjBGQlJ5eE5RVUZOTEVsQlFVa3NVVUZCVVN4TFFVRkxMRXRCUVVzc1MwRkJTeXhIUVVGSE8wRkJSeTlFTEZGQlFVa3NaVUZCWlN4RlFVRkZMRWRCUVVjc1RVRkJUU3hIUVVGSExGRkJRVk1zUzBGQlNTeGxRVUZsTEVWQlFVVXNTVUZCU1N4TlFVRk5MRWRCUVVjc1MwRkJTenRCUVVNdlJTeFZRVUZKTEVWQlFVVXNUVUZCVFN4TFFVRkxMRWRCUVVjc1MwRkJTenRCUVVsNlFpeFZRVUZKTEV0QlFVc3NWVUZCVlN4RFFVRkRMRTlCUVU4c1MwRkJTeXhSUVVGUk8wRkJTWFJETEZsQlFVa3NRMEZCUXl4TFFVRkxPMEZCUTFJc2JVSkJRVk1zUjBGQlJ5eEpRVUZKTEVkQlFVYzdRVUZGYmtJc1kwRkJTU3hGUVVGRkxFMUJRVTBzUjBGQlJ5eE5RVUZOTEVkQlFVY3NSMEZCUnl4SlFVRkpPMEZCUXpkQ0xHZENRVUZKTzBGQlEwbzdRVUZCUVR0QlFVRkJPMEZCU1Vvc1kwRkJUVHRCUVVOT0xHTkJRVTA3UVVGQlFTeGhRVU5FTzBGQlNVd3NXVUZCU1N4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJTeE5RVUZOTEUxQlFVMHNSVUZCUlN4UFFVRlBMRTFCUVUwc1MwRkJTenRCUVVjM1F5eHRRa0ZCVXl4SFFVRkhMRWxCUVVrc1IwRkJSenRCUVVOdVFpeGpRVUZKTEVOQlFVTXNSVUZCUlN4TlFVRk5MRWRCUVVjc1RVRkJUU3hIUVVGSExFZEJRVWM3UVVGQlFUdEJRVWM1UWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0T0xHRkJRVmM3UVVGRldDeFRRVUZQTEZOQlFWTXNSMEZCUnl4SFFVRkhMRXRCUVVzc1ZVRkJWVHRCUVVGQk8wRkJVWFpETEVWQlFVVXNaMEpCUVdkQ0xFVkJRVVVzUzBGQlN5eFhRVUZaTzBGQlEyNURMRTFCUVVrc1IwRkRSaXhKUVVGSkxFdEJRVXNzUjBGRFZDeEpRVUZKTzBGQlJVNHNUVUZCU1N4SFFVRkhPMEZCUTB3c1VVRkJTU3hGUVVGRkxGTkJRVk03UVVGRFppeFJRVUZMTEV0QlFVa3NWVUZCVlN4TFFVRkxMRWxCUVVrc1lVRkJZVHRCUVVkNlF5eFJRVUZKTEVWQlFVVTdRVUZEVGl4UlFVRkpPMEZCUVVjc1lVRkJUeXhKUVVGSkxFMUJRVTBzUjBGQlJ5eExRVUZMTzBGQlFVazdRVUZEY0VNc1VVRkJTU3hKUVVGSk8wRkJRVWNzVlVGQlNUdEJRVUZCTzBGQlIycENMRk5CUVU4N1FVRkJRVHRCUVhsQ1ZDeEZRVUZGTEZsQlFWa3NSVUZCUlN4TlFVRk5MRk5CUVZVc1IwRkJSenRCUVVOcVF5eFRRVUZQTEU5QlFVOHNUVUZCVFN4SlFVRkpMRXRCUVVzc1dVRkJXVHRCUVVGQk8wRkJVek5ETEVWQlFVVXNjVUpCUVhGQ0xFVkJRVVVzVjBGQlZ5eFRRVUZWTEVkQlFVYzdRVUZETDBNc1RVRkJTU3hKUVVGSkxFMUJRMDRzVDBGQlR5eEZRVUZGTzBGQlExZ3NVMEZCVHl4VFFVRlRMRTlCUVU4c1IwRkJSeXhKUVVGSkxFdEJRVXNzU1VGQlNTeEhRVUZITEVkQlFVY3NTVUZCU1N4TFFVRkxMRmRCUVZjc1MwRkJTenRCUVVGQk8wRkJVWGhGTEVWQlFVVXNVMEZCVXl4RlFVRkZMRXRCUVVzc1UwRkJWU3hIUVVGSE8wRkJRemRDTEZOQlFVOHNTMEZCU3l4SlFVRkpMRTlCUVU4N1FVRkJRVHRCUVZONlFpeEZRVUZGTEZGQlFWRXNWMEZCV1R0QlFVTndRaXhUUVVGUExGTkJRVk1zU1VGQlNTeExRVUZMTEZsQlFWa3NUMEZCVHl4TFFVRkxMRWxCUVVrc1IwRkJSenRCUVVGQk8wRkJVekZFTEVWQlFVVXNZMEZCWXl4RlFVRkZMRXRCUVVzc1UwRkJWU3hIUVVGSE8wRkJRMnhETEZOQlFVOHNTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRkJRVHRCUVZOMlFpeEZRVUZGTEhWQ1FVRjFRaXhGUVVGRkxFMUJRVTBzVTBGQlZTeEhRVUZITzBGQlF6VkRMRTFCUVVrc1NVRkJTU3hMUVVGTExFbEJRVWs3UVVGRGFrSXNVMEZCVHl4TFFVRkxMRXRCUVVzc1RVRkJUVHRCUVVGQk8wRkJOa0o2UWl4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEU5QlFVOHNWMEZCV1R0QlFVTjRReXhOUVVGSkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVsQlFVa3NTMEZEYUVJc1NVRkJTU3hOUVVOS0xFOUJRVThzUlVGQlJTeGhRVU5VTEUxQlFVMHNTVUZCU1N4TFFVRkxPMEZCUldwQ0xFMUJRVWtzUTBGQlF5eEZRVUZGTzBGQlFWa3NWMEZCVHl4SlFVRkpMRXRCUVVzc1JVRkJSU3hKUVVGSkxFbEJRVWtzU1VGQlNUdEJRVU5xUkN4TlFVRkpMRVZCUVVVN1FVRkJWU3hYUVVGUE8wRkJSWFpDTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzV1VGQldTeExRVUZMTEV0QlFVc3NTVUZCU1N4RlFVRkZMRWRCUVVjc1JVRkJSU3hSUVVGUk8wRkJRemxETEU5QlFVc3NWMEZCVnp0QlFVTm9RaXhSUVVGTkxFVkJRVVVzUlVGQlJUdEJRVTlXTEUxQlFVa3NUVUZCVFN4SlFVRkpPMEZCUTFvc1VVRkJTU3hMUVVGTExFdEJRVXNzVFVGQlRUdEJRVU53UWl4UlFVRkxMRXRCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWs3UVVGQlFTeFRRVU51UWp0QlFVTk1MRkZCUVVrN1FVRkRTaXhSUVVGSk8wRkJRVUU3UVVGSFRpeE5RVUZKTEdGQlFXRXNUVUZCVFN4SFFVRkhMRVZCUVVVc1RVRkJUU3hKUVVGSkxFbEJRVWtzUzBGQlN5eEpRVUZKTzBGQlIyNUVMRTFCUVVrc1UwRkRSaXhKUVVGSkxFZEJRMG9zUzBGQlN5eEpRVUZKTEV0QlFVczdRVUZEYUVJc1UwRkJUeXhQUVVGTk8wRkJRMWdzWTBGQlZTeEZRVUZGTEUxQlFVMDdRVUZEYkVJc1VVRkJTU3hKUVVGSkxFMUJRVTBzVVVGQlVTeE5RVUZOTEVkQlFVY3NUVUZCVFN4UlFVRlJMRTFCUVUwN1FVRkJRVHRCUVVkeVJDeFRRVUZQTEZOQlFWTXNSMEZCUnl4TFFVRkxMRmxCUVZrc1NVRkJTU3hMUVVGTExGZEJRVmNzU1VGQlNUdEJRVUZCTzBGQmEwTTVSQ3hGUVVGRkxHbENRVUZwUWl4RlFVRkZMRTlCUVU4c1YwRkJXVHRCUVVOMFF5eE5RVUZKTEVkQlFVY3NTVUZCU1N4SlFVRkpMRXRCUTJJc1NVRkJTU3hOUVVOS0xFOUJRVThzUlVGQlJUdEJRVVZZTEUxQlFVa3NRMEZCUXl4RlFVRkZMR05CUVdNc1JVRkJSVHRCUVVGVkxGZEJRVThzU1VGQlNTeExRVUZMTzBGQlJXcEVMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzUzBGQlN6dEJRVU5XTEU5QlFVc3NXVUZCV1N4TFFVRkxMRXRCUVVzc1NVRkJTU3hGUVVGRkxFZEJRVWNzUlVGQlJTeFJRVUZSTzBGQlF6bERMRTlCUVVzc1YwRkJWenRCUVVOb1FpeFJRVUZOTEVWQlFVVXNSVUZCUlR0QlFVVldMRTFCUVVrc1RVRkJUU3hIUVVGSE8wRkJRMWdzVVVGQlNTeGhRVUZoTEUxQlFVMHNSMEZCUnl4SFFVRkhMRWRCUVVjN1FVRkJRU3hUUVVNelFqdEJRVmRNTEZGQlFVa3NUVUZCVFN4TFFVRkxMRXRCUVVzN1FVRkRjRUlzVVVGQlNTeEpRVUZKTEV0QlFVc3NTMEZCU3l4SlFVRkpPMEZCUlhSQ0xGRkJRVWtzUlVGQlJTeE5RVUZOTEVsQlFVa3NVVUZCVVN4SFFVRkhPMEZCUXpOQ0xGRkJRVWtzWVVGQllTeE5RVUZOTEVkQlFVY3NSMEZCUnl4SFFVRkhPMEZCUjJoRExGRkJRVWtzVTBGRFJpeExRVUZMTEVsQlFVa3NTMEZCU3l4SlFVTmtMRTFCUVUwc1NVRkJTU3hMUVVGTExFdEJRMllzVFVGQlRTeEpRVUZKTEV0QlFVczdRVUZEYWtJc1YwRkJUeXhQUVVGTk8wRkJRMWdzWjBKQlFWVXNSVUZCUlN4TlFVRk5PMEZCUTJ4Q0xGVkJRVWtzUlVGQlJTeE5RVUZOTEVkQlFVY3NTMEZCU3l4UlFVRlJMRTFCUVUwc1NVRkJTU3hOUVVGTkxGTkJRVk1zUzBGQlN6dEJRVUZCTzBGQlFVRTdRVUZKT1VRc1QwRkJTeXhaUVVGWk8wRkJRMnBDTEU5QlFVc3NWMEZCVnp0QlFVVm9RaXhUUVVGUExGTkJRVk1zUjBGQlJ5eEpRVUZKTEVsQlFVazdRVUZCUVR0QlFXOUNOMElzUlVGQlJTeHZRa0ZCYjBJc1JVRkJSU3hQUVVGUExGZEJRVms3UVVGRGVrTXNUVUZCU1N4SlFVRkpMRWxCUTA0c1NVRkJTU3hOUVVOS0xFOUJRVThzUlVGQlJUdEJRVVZZTEUxQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVZrc1YwRkJUeXhKUVVGSkxFdEJRVXNzUlVGQlJUdEJRVU55UXl4TlFVRkpMRVZCUVVVN1FVRkJWU3hYUVVGUExFbEJRVWtzUzBGQlN6dEJRVVZvUXl4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExFdEJRVXM3UVVGRFZpeFBRVUZMTEZsQlFWa3NTMEZCU3p0QlFVTjBRaXhQUVVGTExGZEJRVmM3UVVGRmFFSXNVMEZCVHl4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxGRkJRVkVzUzBGQlN5eFpRVUZaTEVsQlFVa3NTMEZCU3l4WFFVRlhPMEZCUVVFN1FVRjFRbnBGTEVWQlFVVXNaMEpCUVdkQ0xFVkJRVVVzVDBGQlR5eFhRVUZaTzBGQlEzSkRMRTFCUVVrc1VVRkRSaXhKUVVGSkxFMUJRMG9zVDBGQlR5eEZRVUZGTEdGQlExUXNTVUZCU1N4RlFVRkZMRTFCUVUwc1NVRkJTU3hKUVVOb1FpeExRVUZMTEV0QlFVc3NWMEZEVml4TFFVRkxMRXRCUVVzN1FVRkZXaXhOUVVGSkxFMUJRVTBzU1VGQlNUdEJRVU5hTEZkQlFVOHNUVUZCVFN4SlFVVlVMRVZCUVVVc1ZVRkJWU3hOUVVGTkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVsQlFVa3NTMEZCU3l4TFFVVXpReXhKUVVGSkxFdEJRVXM3UVVGQlFUdEJRVWRtTEUxQlFVa3NSVUZCUlR0QlFVRlZMRmRCUVU4c1RVRkJUU3hOUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEUxQlFVMDdRVUZKY2tRc1QwRkJTeXhaUVVGWkxFdEJRVXM3UVVGRGRFSXNUMEZCU3l4WFFVRlhPMEZCUldoQ0xFMUJRVWtzUlVGQlJUdEJRVU5PTEZkQlFWTXNUVUZCVFN4TlFVRk5MRXRCUVVzc1IwRkJSeXhKUVVGSkxFMUJRVTA3UVVGRmRrTXNUMEZCU3l4WlFVRlpPMEZCUTJwQ0xFOUJRVXNzVjBGQlZ6dEJRVVZvUWl4VFFVRlBMRTlCUVU4c1RVRkJUVHRCUVVGQk8wRkJkVUowUWl4RlFVRkZMREJDUVVFd1FpeEZRVUZGTEZGQlFWRXNWMEZCV1R0QlFVTm9SQ3hOUVVGSkxFbEJRVWtzU1VGRFRpeEpRVUZKTEUxQlEwb3NUMEZCVHl4RlFVRkZPMEZCUlZnc1RVRkJTU3hGUVVGRkxFbEJRVWs3UVVGQlNTeFhRVUZQTEVsQlFVa3NTMEZCU3l4RlFVRkZMRWRCUVVjc1MwRkJTeXhKUVVGSk8wRkJRelZETEUxQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVZrc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRmJrTXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eFpRVUZaTEV0QlFVc3NTMEZCU3l4SlFVRkpMRXRCUVVzc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeFJRVUZSTzBGQlEzaEVMRTlCUVVzc1YwRkJWenRCUVVOb1FpeGhRVUZYTzBGQlJWZ3NUVUZCU1N4RlFVRkZMRTFCUVUwc1IwRkJSeXhOUVVGTkxFZEJRVWNzVDBGQlR5eExRVUZMTzBGQlJYQkRMR0ZCUVZjN1FVRkRXQ3hQUVVGTExGbEJRVms3UVVGRGFrSXNUMEZCU3l4WFFVRlhPMEZCUldoQ0xGTkJRVThzUlVGQlJUdEJRVUZCTzBGQmIwSllMRVZCUVVVc2QwSkJRWGRDTEVWQlFVVXNVVUZCVVN4WFFVRlpPMEZCUXpsRExFMUJRVWtzU1VGQlNTeEpRVU5PTEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVN1FVRkZXQ3hOUVVGSkxFTkJRVU1zUlVGQlJTeGpRVUZqTEVWQlFVVTdRVUZCVlN4WFFVRlBMRWxCUVVrc1MwRkJTenRCUVVWcVJDeFBRVUZMTEV0QlFVczdRVUZEVml4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExGbEJRVmtzUzBGQlN5eEpRVUZKTEV0QlFVc3NTVUZCU1N4TFFVRkxMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzVVVGQlVUdEJRVU0xUkN4UFFVRkxMRmRCUVZjN1FVRkRhRUlzWVVGQlZ6dEJRVVZZTEUxQlFVa3NSVUZCUlN4TlFVRk5MRWRCUVVjc1MwRkJTeXhIUVVGSExFOUJRVThzUzBGQlN6dEJRVVZ1UXl4aFFVRlhPMEZCUTFnc1QwRkJTeXhaUVVGWk8wRkJRMnBDTEU5QlFVc3NWMEZCVnp0QlFVVm9RaXhUUVVGUExFVkJRVVU3UVVGQlFUdEJRWFZDV0N4RlFVRkZMREpDUVVFeVFpeEZRVUZGTEZGQlFWRXNWMEZCV1R0QlFVTnFSQ3hOUVVGSkxFbEJRVWtzU1VGQlNTeExRVUZMTEV0QlEyWXNTVUZCU1N4TlFVTktMRTlCUVU4c1JVRkJSVHRCUVVWWUxFMUJRVWtzUTBGQlF5eEZRVUZGTzBGQlFWa3NWMEZCVHl4SlFVRkpMRXRCUVVzN1FVRkRia01zVFVGQlNTeEZRVUZGTEV0QlFVczdRVUZCUnl4WFFVRlBMRWxCUVVrc1MwRkJTeXhGUVVGRkxFMUJRVTBzUjBGQlJ5eExRVUZMTEVWQlFVVXNTVUZCU1N4SlFVRkpMRVZCUVVVc1YwRkJWeXhKUVVGSk8wRkJSWHBGTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1MwRkJTenRCUVVOV0xGRkJRVTBzUlVGQlJUdEJRVVZTTEUxQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzc1RVRkJUU3hKUVVGSkxFTkJRVU1zUlVGQlJTeEpRVUZKTzBGQlFVY3NWMEZCVHl4VFFVRlRMRWxCUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNUdEJRVVV6UlN4UFFVRkxMRmxCUVZrc1RVRkJUU3hOUVVGTkxFVkJRVVU3UVVGRkwwSXNUVUZCU1N4UFFVRlBMRVZCUVVVc1MwRkJTeXhKUVVGSkxFbEJRVWtzUzBGQlN5eEhRVUZITEUxQlFVMHNTVUZCU1N4TlFVRk5MRWxCUVVrN1FVRkZkRVFzVDBGQlN5eFpRVUZaTEV0QlFVczdRVUZEZEVJc1QwRkJTeXhYUVVGWE8wRkJSV2hDTEUxQlFVa3NSVUZCUlR0QlFVVk9MRTlCUVVzc1dVRkJXVHRCUVVOcVFpeFBRVUZMTEZkQlFWYzdRVUZGYUVJc1UwRkJUeXhGUVVGRkxFMUJRVTA3UVVGQlFUdEJRWGxDYWtJc1JVRkJSU3hqUVVGakxFVkJRVVVzVDBGQlR5eFhRVUZaTzBGQlEyNURMRTFCUVVrc1VVRkJVU3hIUVVOV0xFbEJRVWtzU1VGRFNpeEpRVUZKTEUxQlEwb3NUMEZCVHl4RlFVRkZPMEZCUlZnc1RVRkJTU3hGUVVGRk8wRkJRVlVzVjBGQlR5eEpRVUZKTEV0QlFVczdRVUZGYUVNc1RVRkJTU3hGUVVGRkxFMUJRVTBzU1VGQlNUdEJRVU5vUWl4UFFVRkxMRXRCUVVzN1FVRkRWaXhQUVVGTExFdEJRVXM3UVVGRlZpeE5RVUZKTEUxQlFVMHNTVUZCU1R0QlFVZGFMRkZCUVVrc1RVRkJUU3hIUVVGSE8wRkJRMWdzWlVGQlV5eE5RVUZOTEUxQlFVMHNTMEZCU3l4SFFVRkhMRWxCUVVrc1RVRkJUVHRCUVVOMlF5eGhRVUZQTEVsQlFVa3NSVUZCUlR0QlFVTmlMR0ZCUVU4N1FVRkJRVHRCUVVsVUxGZEJRVThzU1VGQlNTeExRVUZMTzBGQlFVRTdRVUZMYkVJc1QwRkJTeXhaUVVGWkxFdEJRVXM3UVVGRGRFSXNUMEZCU3l4WFFVRlhPMEZCUldoQ0xFMUJRVWtzUlVGQlJTeEpRVUZKTEVsQlFVa3NTMEZCU3l4SFFVRkhMRTFCUVUwc1JVRkJSU3hOUVVGTkxFbEJRVWtzVDBGQlR5eExRVUZMTEVsQlFVazdRVUZGZUVRc1QwRkJTeXhaUVVGWk8wRkJRMnBDTEU5QlFVc3NWMEZCVnp0QlFVVm9RaXhUUVVGUExFVkJRVVVzVFVGQlRUdEJRVUZCTzBGQmMwSnFRaXhGUVVGRkxHbENRVUZwUWl4RlFVRkZMRTlCUVU4c1YwRkJXVHRCUVVOMFF5eE5RVUZKTEVkQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjc1NVRkJTU3hIUVVGSExFZEJRVWNzUzBGQlN5eEpRVU0zUWl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRkxHRkJRMVFzUzBGQlN5eExRVUZMTEZkQlExWXNTMEZCU3l4TFFVRkxPMEZCUlZvc1RVRkJTU3hEUVVGRExFVkJRVVVzV1VGQldUdEJRVU5xUWl4UlFVRkpMRU5CUVVNc1JVRkJSVHRCUVVGSExHRkJRVThzU1VGQlNTeExRVUZMTzBGQlF6RkNMRkZCUVVrc1MwRkJTeXhMUVVGTExHTkJRV003UVVGRE1VSXNWVUZCU1N4TlFVRk5MRTFCUVUwc1MwRkJTeXhIUVVGSExFbEJRVWtzVFVGQlRUdEJRVU5zUXl4UlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVOU0xHRkJRVTg3UVVGQlFUdEJRVUZCTEdGQlJVRXNSVUZCUlN4VlFVRlZPMEZCUTNKQ0xGZEJRVThzU1VGQlNTeExRVUZMTzBGQlFVRXNZVUZEVUN4RlFVRkZMRTFCUVUwc1IwRkJSeXhOUVVGTkxFdEJRVXNzUzBGQlN5eGpRVUZqTzBGQlEyeEVMRkZCUVVrc1RVRkJUU3hOUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEUxQlFVMDdRVUZEYkVNc1RVRkJSU3hKUVVGSkxFVkJRVVU3UVVGRFVpeFhRVUZQTzBGQlFVRTdRVUZIVkN4UFFVRkxMRmxCUVZrc1RVRkJUU3hMUVVGTE8wRkJRelZDTEU5QlFVc3NWMEZCVnp0QlFWRm9RaXhOUVVGSkxFdEJRVXNzU1VGQlNTeEpRVUZKTEUxQlFVMHNWMEZCVnl4SlFVRkpPMEZCUlhSRExFOUJRVXNzU1VGQlNTeEhRVUZITEVkQlFVY3NSVUZCUlR0QlFVRkhMRkZCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzVFVGQlRTeEhRVUZITEV0QlFVc3NSMEZCUnl4UFFVRlBMRXRCUVVzN1FVRkZOMFFzWVVGQlZ6dEJRVVZZTEUxQlFVa3NTMEZCU3l4TFFVRkxMRTFCUVUwN1FVRkRjRUlzVFVGQlNUdEJRVU5LTEU5QlFVc3NSVUZCUlN4TlFVRk5PMEZCUTJJc1RVRkJTU3hKUVVGSkxFdEJRVXM3UVVGRFlpeFBRVUZMTzBGQlIwd3NVMEZCVHl4TlFVRk5MRTFCUVVzN1FVRkRhRUlzVTBGQlN5eEhRVUZITEUxQlFVMDdRVUZEWkN4UlFVRkpMRVZCUVVVc1RVRkJUU3hIUVVGSExFbEJRVWtzUzBGQlN6dEJRVVY0UWl4VFFVRkxMRWRCUVVjc1RVRkJUVHRCUVVOa0xGRkJRVWtzUlVGQlJTeExRVUZMTEVkQlFVY3NTVUZCU1N4TFFVRkxPMEZCUlhaQ0xGRkJRVWtzUlVGQlJTeEZRVUZGTEU5QlFVODdRVUZCVVN4WFFVRkxMRWxCUVVrc1IwRkJSeXhGUVVGRkxFVkJRVVVzVDBGQlR5eEZRVUZGTEVWQlFVVXNUVUZCVFR0QlFVRkxPMEZCUVVFN1FVRkhMMFFzVFVGQlNUdEJRVUZITEZGQlFVa3NSVUZCUlN4TlFVRk5MRXRCUVUwc1NVRkJTVHRCUVVVM1FpeGhRVUZYTzBGQlJWZ3NVMEZCVHl4VFFVRlRMRWRCUVVjc1MwRkJTeXhaUVVGWkxFbEJRVWtzUzBGQlN5eFhRVUZYTEVsQlFVazdRVUZCUVR0QlFWRTVSQ3hGUVVGRkxGZEJRVmNzVjBGQldUdEJRVU4yUWl4VFFVRlBMRU5CUVVNc1EwRkJReXhMUVVGTE8wRkJRVUU3UVVGUmFFSXNSVUZCUlN4WlFVRlpMRVZCUVVVc1VVRkJVU3hYUVVGWk8wRkJRMnhETEZOQlFVOHNRMEZCUXl4RFFVRkRMRXRCUVVzc1MwRkJTeXhWUVVGVkxFdEJRVXNzU1VGQlNTeFpRVUZaTEV0QlFVc3NSVUZCUlN4VFFVRlRPMEZCUVVFN1FVRlJjRVVzUlVGQlJTeFJRVUZSTEZkQlFWazdRVUZEY0VJc1UwRkJUeXhEUVVGRExFdEJRVXM3UVVGQlFUdEJRVkZtTEVWQlFVVXNZVUZCWVN4RlFVRkZMRkZCUVZFc1YwRkJXVHRCUVVOdVF5eFRRVUZQTEV0QlFVc3NTVUZCU1R0QlFVRkJPMEZCVVd4Q0xFVkJRVVVzWVVGQllTeEZRVUZGTEZGQlFWRXNWMEZCV1R0QlFVTnVReXhUUVVGUExFdEJRVXNzU1VGQlNUdEJRVUZCTzBGQlVXeENMRVZCUVVVc1UwRkJVeXhYUVVGWk8wRkJRM0pDTEZOQlFVOHNRMEZCUXl4RFFVRkRMRXRCUVVzc1MwRkJTeXhMUVVGTExFVkJRVVVzVDBGQlR6dEJRVUZCTzBGQlVXNURMRVZCUVVVc1YwRkJWeXhGUVVGRkxFdEJRVXNzVTBGQlZTeEhRVUZITzBGQlF5OUNMRk5CUVU4c1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGQlFUdEJRVkYyUWl4RlFVRkZMRzlDUVVGdlFpeEZRVUZGTEUxQlFVMHNVMEZCVlN4SFFVRkhPMEZCUTNwRExGTkJRVThzUzBGQlN5eEpRVUZKTEV0QlFVczdRVUZCUVR0QlFXdERka0lzUlVGQlJTeFpRVUZaTEVWQlFVVXNUVUZCVFN4VFFVRlZMRTFCUVUwN1FVRkRjRU1zVFVGQlNTeFZRVUZWTEVkQlFVY3NZVUZCWVN4SFFVRkhMRXRCUVVzc1MwRkJTeXhKUVVGSkxFZEJRemRETEUxQlFVMHNUVUZEVGl4UFFVRlBMRWxCUVVrc1lVRkRXQ3hMUVVGTExFdEJRVXNzVjBGRFZpeExRVUZMTEV0QlFVc3NWVUZEVml4UlFVRlJPMEZCUjFZc1RVRkJTU3hSUVVGUkxFMUJRVTA3UVVGRGFFSXNWMEZCVHl4SlFVRkpMRXRCUVVzN1FVRkRhRUlzWlVGQlZ6dEJRVUZCTEZOQlEwNDdRVUZEVEN4WFFVRlBMRWxCUVVrc1MwRkJTenRCUVVOb1FpeFJRVUZKTEV0QlFVczdRVUZIVkN4UlFVRkpMRXRCUVVzc1NVRkJTU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVWQlFVVXNUVUZCVFN4TFFVRkxMRWRCUVVjN1FVRkJTU3hoUVVGUExFbEJRVWtzUzBGQlN6dEJRVVUzUkN4bFFVRlhMRXRCUVVzc1IwRkJSenRCUVVGQk8wRkJSM0pDTEUxQlFVa3NTVUZCU1R0QlFVZFNMRTFCUVVrc1NVRkJTU3hKUVVGSkxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlN4TlFVRk5MRWxCUVVrc1IwRkJSeXhKUVVGSk8wRkJRM3BETEZkQlFVOHNTVUZCU1N4TFFVRkxMRXRCUVVzc1EwRkJReXhGUVVGRkxFdEJRVXNzUzBGQlN5eEpRVUZKTEVsQlFVa3NTMEZCU3l4SlFVRkpMRTFCUVUwc1NVRkJTU3hKUVVGSkxFbEJRVWs3UVVGQlFUdEJRVXQyUlN4TlFVRkpMRlZCUVZVN1FVRkRXaXhSUVVGSkxFVkJRVVVzVTBGQlV5eEhRVUZITzBGQlEyaENMRmxCUVUwN1FVRkJRU3hYUVVORU8wRkJRMHdzVjBGQlN5eEpRVUZKTEVWQlFVVXNTVUZCU1N4SlFVRkpMRTlCUVU4N1FVRkJTU3hoUVVGTE8wRkJRMjVETEZsQlFVMHNUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkphRUlzWVVGQlZ6dEJRVU5ZTEU5QlFVc3NTMEZCU3p0QlFVTldMRkZCUVUwc2FVSkJRV2xDTEV0QlFVczdRVUZETlVJc1owSkJRV01zVjBGQlZ5eFJRVUZSTEUxQlFVMHNTMEZCU3l4TlFVRk5MR2xDUVVGcFFpeE5RVUZOTzBGQlIzcEZMRTFCUVVrc1QwRkJUeXhMUVVGTExHRkJRV0VzU1VGQlNUdEJRV2RDYWtNc1RVRkJTU3h2UWtGQmIwSXNSVUZCUlN4SFFVRkhMRWxCUVVrc1NVRkJTU3hMUVVGTE8wRkJSWGhETEU5QlFVYzdRVUZEUkN4WlFVRk5PMEZCUTA0c1dVRkJUU3hwUWtGQmFVSXNTMEZCU3p0QlFVTTFRaXh2UWtGQll5eFhRVUZYTEZGQlFWRXNUVUZCVFN4TFFVRkxMRTFCUVUwc2FVSkJRV2xDTEUxQlFVMDdRVUZEZWtVc1ZVRkJTU3hQUVVGUExFdEJRVXNzWVVGQllTeEpRVUZKTzBGQlJXcERMRlZCUVVrc1EwRkJReXhMUVVGTE8wRkJSMUlzV1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4SFFVRkhMRTFCUVUwc1NVRkJTU3hIUVVGSExFbEJRVWtzVFVGQlRTeExRVUZMTEUxQlFVMDdRVUZEZWtRc1kwRkJTU3hUUVVGVExFZEJRVWNzUzBGQlN5eEhRVUZITzBGQlFVRTdRVUZITVVJN1FVRkJRVHRCUVVGQkxHRkJSVXNzYjBKQlFXOUNMRVZCUVVVc1IwRkJSeXhMUVVGTExFbEJRVWs3UVVGQlFUdEJRVWMzUXl4aFFVRlhPMEZCUlZnc1UwRkJUeXhUUVVGVExFZEJRVWNzU1VGQlNUdEJRVUZCTzBGQmFVUjZRaXhGUVVGRkxGRkJRVkVzUlVGQlJTeE5RVUZOTEZOQlFWVXNSMEZCUnp0QlFVTTNRaXhOUVVGSkxFZEJRVWNzUjBGQlJ5eEhRVUZITEVkQlFVY3NSMEZCUnl4TFFVRkxMRWxCUVVrc1NVRkJTU3hKUVVGSkxFbEJRVWtzVFVGQlRTeEpRVU0xUXl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRk8wRkJSVmdzVFVGQlNTeEpRVUZKTEV0QlFVczdRVUZIWWl4TlFVRkpMRU5CUVVNc1JVRkJSU3hMUVVGTExFTkJRVU1zUlVGQlJTeEhRVUZITzBGQlIyaENMRkZCUVVrc1EwRkJReXhGUVVGRkxFdEJRVXNzUTBGQlF5eEZRVUZGTzBGQlFVY3NWVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkJRU3hoUVVkMFFpeEZRVUZGTzBGQlFVY3NVVUZCUlN4SlFVRkpMRU5CUVVNc1JVRkJSVHRCUVVGQk8wRkJTMnhDTEZWQlFVa3NTVUZCU1N4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRkxFMUJRVTBzUlVGQlJTeEpRVUZKTEVsQlFVazdRVUZGTTBNc1YwRkJUenRCUVVGQk8wRkJTVlFzVFVGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlN4SFFVRkhPMEZCUTJRc1RVRkJSU3hKUVVGSkxFTkJRVU1zUlVGQlJUdEJRVU5VTEZkQlFVOHNSVUZCUlN4TFFVRkxPMEZCUVVFN1FVRkhhRUlzVDBGQlN5eEZRVUZGTzBGQlExQXNUMEZCU3l4RlFVRkZPMEZCUTFBc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eExRVUZMTzBGQlIxWXNUVUZCU1N4RFFVRkRMRWRCUVVjc1RVRkJUU3hEUVVGRExFZEJRVWNzU1VGQlNUdEJRVWR3UWl4UlFVRkpMRWRCUVVjN1FVRkJTU3hSUVVGRkxFbEJRVWtzUTBGQlF5eEZRVUZGTzBGQlFVRXNZVUZIV0N4SFFVRkhPMEZCUVVrc1ZVRkJTU3hKUVVGSkxFdEJRVXM3UVVGQlFUdEJRVWw0UWl4aFFVRlBMRWxCUVVrc1MwRkJTeXhQUVVGUExFbEJRVWtzUzBGQlN6dEJRVVZ5UXl4WFFVRlBMRmRCUVZjc1UwRkJVeXhIUVVGSExFbEJRVWtzVFVGQlRUdEJRVUZCTzBGQlRURkRMRTFCUVVrc1ZVRkJWU3hGUVVGRkxFbEJRVWs3UVVGRGNFSXNUMEZCU3l4VlFVRlZMRVZCUVVVc1NVRkJTVHRCUVVWeVFpeFBRVUZMTEVkQlFVYzdRVUZEVWl4TlFVRkpMRXRCUVVzN1FVRkhWQ3hOUVVGSkxFZEJRVWM3UVVGRFRDeFhRVUZQTEVsQlFVazdRVUZGV0N4UlFVRkpMRTFCUVUwN1FVRkRVaXhWUVVGSk8wRkJRMG9zVlVGQlNTeERRVUZETzBGQlEwd3NXVUZCVFN4SFFVRkhPMEZCUVVFc1YwRkRTanRCUVVOTUxGVkJRVWs3UVVGRFNpeFZRVUZKTzBGQlEwb3NXVUZCVFN4SFFVRkhPMEZCUVVFN1FVRk5XQ3hSUVVGSkxFdEJRVXNzU1VGQlNTeExRVUZMTEV0QlFVc3NTMEZCU3l4WFFVRlhMRTlCUVU4N1FVRkZPVU1zVVVGQlNTeEpRVUZKTEVkQlFVYzdRVUZEVkN4VlFVRkpPMEZCUTBvc1VVRkJSU3hUUVVGVE8wRkJRVUU3UVVGSllpeE5RVUZGTzBGQlEwWXNVMEZCU3l4SlFVRkpMRWRCUVVjN1FVRkJUU3hSUVVGRkxFdEJRVXM3UVVGRGVrSXNUVUZCUlR0QlFVRkJMRk5CUjBjN1FVRkpUQ3hSUVVGSkxFZEJRVWM3UVVGRFVDeFZRVUZOTEVkQlFVYzdRVUZEVkN4WFFVRlBMRWxCUVVrN1FVRkRXQ3hSUVVGSk8wRkJRVTBzV1VGQlRUdEJRVVZvUWl4VFFVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxFdEJRVXNzUzBGQlN6dEJRVU40UWl4VlFVRkpMRWRCUVVjc1RVRkJUU3hIUVVGSExFbEJRVWs3UVVGRGJFSXNaVUZCVHl4SFFVRkhMRXRCUVVzc1IwRkJSenRCUVVOc1FqdEJRVUZCTzBGQlFVRTdRVUZKU2l4UlFVRkpPMEZCUVVFN1FVRkhUaXhOUVVGSkxFMUJRVTA3UVVGRFVpeFJRVUZKTzBGQlEwb3NVMEZCU3p0QlFVTk1MRk5CUVVzN1FVRkRUQ3hOUVVGRkxFbEJRVWtzUTBGQlF5eEZRVUZGTzBGQlFVRTdRVUZIV0N4UlFVRk5MRWRCUVVjN1FVRkpWQ3hQUVVGTExFbEJRVWtzUjBGQlJ5eFRRVUZUTEV0QlFVc3NTVUZCU1N4SFFVRkhMRVZCUVVVN1FVRkJSeXhQUVVGSExGTkJRVk03UVVGSGJFUXNUMEZCU3l4SlFVRkpMRWRCUVVjc1VVRkJVU3hKUVVGSkxFdEJRVWs3UVVGRk1VSXNVVUZCU1N4SFFVRkhMRVZCUVVVc1MwRkJTeXhIUVVGSExFbEJRVWs3UVVGRGJrSXNWMEZCU3l4SlFVRkpMRWRCUVVjc1MwRkJTeXhIUVVGSExFVkJRVVVzVDBGQlR6dEJRVUZKTEZkQlFVY3NTMEZCU3l4UFFVRlBPMEZCUTJoRUxGRkJRVVVzUjBGQlJ6dEJRVU5NTEZOQlFVY3NUVUZCVFR0QlFVRkJPMEZCUjFnc1QwRkJSeXhOUVVGTkxFZEJRVWM3UVVGQlFUdEJRVWxrTEZOQlFVOHNSMEZCUnl4RlFVRkZMRk5CUVZNN1FVRkJTU3hQUVVGSE8wRkJSelZDTEZOQlFVOHNSMEZCUnl4UFFVRlBMRWRCUVVjc1IwRkJSenRCUVVGVExFMUJRVVU3UVVGSGJFTXNUVUZCU1N4RFFVRkRMRWRCUVVjN1FVRkJTU3hYUVVGUExFbEJRVWtzUzBGQlN5eFBRVUZQTEVsQlFVa3NTMEZCU3p0QlFVVTFReXhKUVVGRkxFbEJRVWs3UVVGRFRpeEpRVUZGTEVsQlFVa3NhMEpCUVd0Q0xFbEJRVWs3UVVGRk5VSXNVMEZCVHl4WFFVRlhMRk5CUVZNc1IwRkJSeXhKUVVGSkxFMUJRVTA3UVVGQlFUdEJRVFJDTVVNc1JVRkJSU3hUUVVGVExFVkJRVVVzVFVGQlRTeFRRVUZWTEVkQlFVYzdRVUZET1VJc1RVRkJTU3hIUVVOR0xFbEJRVWtzVFVGRFNpeFBRVUZQTEVWQlFVVTdRVUZGV0N4TlFVRkpMRWxCUVVrc1MwRkJTenRCUVVkaUxFMUJRVWtzUTBGQlF5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hMUVVGTExFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlFVa3NWMEZCVHl4SlFVRkpMRXRCUVVzN1FVRkhjRVFzVFVGQlNTeERRVUZETEVWQlFVVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxFVkJRVVVzU1VGQlNUdEJRVU14UWl4WFFVRlBMRk5CUVZNc1NVRkJTU3hMUVVGTExFbEJRVWtzUzBGQlN5eFhRVUZYTEV0QlFVczdRVUZCUVR0QlFVbHdSQ3hoUVVGWE8wRkJSVmdzVFVGQlNTeExRVUZMTEZWQlFWVXNSMEZCUnp0QlFVbHdRaXhSUVVGSkxFOUJRVThzUjBGQlJ5eEZRVUZGTEU5QlFVOHNSMEZCUnl4SFFVRkhPMEZCUXpkQ0xFMUJRVVVzUzBGQlN5eEZRVUZGTzBGQlFVRXNVMEZEU2p0QlFVTk1MRkZCUVVrc1QwRkJUeXhIUVVGSExFZEJRVWNzUjBGQlJ5eExRVUZMTEZGQlFWRTdRVUZCUVR0QlFVZHVReXhOUVVGSkxFVkJRVVVzVFVGQlRUdEJRVVZhTEdGQlFWYzdRVUZGV0N4VFFVRlBMRVZCUVVVc1RVRkJUVHRCUVVGQk8wRkJWV3BDTEVWQlFVVXNjVUpCUVhGQ0xFVkJRVVVzVFVGQlRTeFhRVUZaTzBGQlEzcERMRk5CUVU4c2JVSkJRVzFDTzBGQlFVRTdRVUZUTlVJc1JVRkJSU3h0UWtGQmJVSXNSVUZCUlN4TFFVRkxMRmRCUVZrN1FVRkRkRU1zVTBGQlR5eHBRa0ZCYVVJN1FVRkJRVHRCUVZNeFFpeEZRVUZGTEZWQlFWVXNSVUZCUlN4TlFVRk5MRmRCUVZrN1FVRkRPVUlzVFVGQlNTeEpRVUZKTEVsQlFVa3NTMEZCU3l4WlFVRlpPMEZCUXpkQ0xFbEJRVVVzU1VGQlNTeERRVUZETEVWQlFVVTdRVUZEVkN4VFFVRlBMRk5CUVZNN1FVRkJRVHRCUVhsQ2JFSXNSVUZCUlN4UFFVRlBMRVZCUVVVc1RVRkJUU3hUUVVGVkxFZEJRVWM3UVVGRE5VSXNUVUZCU1N4UFFVRlBMRWRCUVVjc1IwRkJSeXhIUVVGSExFZEJRVWNzUzBGQlN5eEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVTjBReXhKUVVGSkxFMUJRMG9zVDBGQlR5eEZRVUZGTzBGQlJWZ3NUVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkhZaXhOUVVGSkxFTkJRVU1zUlVGQlJTeExRVUZMTEVOQlFVTXNSVUZCUlN4SFFVRkhPMEZCUjJoQ0xGRkJRVWtzUTBGQlF5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RlFVRkZPMEZCUVVjc1ZVRkJTU3hKUVVGSkxFdEJRVXM3UVVGQlFTeGhRVTEwUWl4RFFVRkRMRVZCUVVVN1FVRkJSeXhWUVVGSkxFbEJRVWtzUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlN4TlFVRk5MRVZCUVVVc1NVRkJTU3hKUVVGSk8wRkJSWEpFTEZkQlFVODdRVUZCUVR0QlFVbFVMRTFCUVVrc1JVRkJSU3hMUVVGTExFVkJRVVVzUjBGQlJ6dEJRVU5rTEUxQlFVVXNTVUZCU1N4RFFVRkRMRVZCUVVVN1FVRkRWQ3hYUVVGUExFVkJRVVVzVFVGQlRUdEJRVUZCTzBGQlIycENMRTlCUVVzc1JVRkJSVHRCUVVOUUxFOUJRVXNzUlVGQlJUdEJRVU5RTEU5QlFVc3NTMEZCU3p0QlFVTldMRTlCUVVzc1MwRkJTenRCUVVkV0xFMUJRVWtzUTBGQlF5eEhRVUZITEUxQlFVMHNRMEZCUXl4SFFVRkhMRWxCUVVrN1FVRkpjRUlzVVVGQlNTeERRVUZETEVkQlFVYzdRVUZCU1N4VlFVRkpMRWxCUVVrc1MwRkJTenRCUVVWNlFpeFhRVUZQTEZkQlFWY3NVMEZCVXl4SFFVRkhMRWxCUVVrc1RVRkJUVHRCUVVGQk8wRkJUVEZETEUxQlFVa3NWVUZCVlN4RlFVRkZMRWxCUVVrN1FVRkRjRUlzVFVGQlNTeFZRVUZWTEVWQlFVVXNTVUZCU1R0QlFVVndRaXhQUVVGTExFZEJRVWM3UVVGRFVpeE5RVUZKTEVsQlFVazdRVUZIVWl4TlFVRkpMRWRCUVVjN1FVRkZUQ3hSUVVGSkxFbEJRVWtzUjBGQlJ6dEJRVU5VTEZWQlFVazdRVUZEU2l4VlFVRkpMRU5CUVVNN1FVRkRUQ3haUVVGTkxFZEJRVWM3UVVGQlFTeFhRVU5LTzBGQlEwd3NWVUZCU1R0QlFVTktMRlZCUVVrN1FVRkRTaXhaUVVGTkxFZEJRVWM3UVVGQlFUdEJRVWxZTEZGQlFVa3NTMEZCU3l4TFFVRkxMRXRCUVVzN1FVRkRia0lzVlVGQlRTeEpRVUZKTEUxQlFVMHNTVUZCU1N4SlFVRkpMRTFCUVUwN1FVRkZPVUlzVVVGQlNTeEpRVUZKTEV0QlFVczdRVUZEV0N4VlFVRkpPMEZCUTBvc1VVRkJSU3hUUVVGVE8wRkJRVUU3UVVGSllpeE5RVUZGTzBGQlEwWXNWMEZCVHp0QlFVRk5MRkZCUVVVc1MwRkJTenRCUVVOd1FpeE5RVUZGTzBGQlFVRTdRVUZIU2l4UlFVRk5MRWRCUVVjN1FVRkRWQ3hOUVVGSkxFZEJRVWM3UVVGSFVDeE5RVUZKTEUxQlFVMHNTVUZCU1N4SFFVRkhPMEZCUTJZc1VVRkJTVHRCUVVOS0xGRkJRVWs3UVVGRFNpeFRRVUZMTzBGQlEwd3NVMEZCU3p0QlFVRkJPMEZCU1ZBc1QwRkJTeXhSUVVGUkxFZEJRVWNzUzBGQlNUdEJRVU5zUWl4WlFVRlRMRWxCUVVjc1JVRkJSU3hMUVVGTExFZEJRVWNzUzBGQlN5eEhRVUZITEV0QlFVc3NVMEZCVXl4UFFVRlBPMEZCUTI1RUxFOUJRVWNzVFVGQlRUdEJRVUZCTzBGQlIxZ3NUVUZCU1N4UFFVRlBPMEZCUTFRc1QwRkJSeXhSUVVGUk8wRkJRMWdzVFVGQlJUdEJRVUZCTzBGQlMwb3NUMEZCU3l4TlFVRk5MRWRCUVVjc1VVRkJVU3hIUVVGSExFVkJRVVVzVVVGQlVUdEJRVUZKTEU5QlFVYzdRVUZGTVVNc1NVRkJSU3hKUVVGSk8wRkJRMDRzU1VGQlJTeEpRVUZKTEd0Q1FVRnJRaXhKUVVGSk8wRkJSVFZDTEZOQlFVOHNWMEZCVnl4VFFVRlRMRWRCUVVjc1NVRkJTU3hOUVVGTk8wRkJRVUU3UVVGVk1VTXNSVUZCUlN4WlFVRlpMRVZCUVVVc1MwRkJTeXhUUVVGVkxFZEJRVWM3UVVGRGFFTXNUVUZCU1N4SFFVTkdMRWxCUVVrN1FVRkZUaXhOUVVGSkxFMUJRVTBzVlVGQlZTeE5RVUZOTEVOQlFVTXNRMEZCUXl4TFFVRkxMRTFCUVUwc1MwRkJTeXhOUVVGTk8wRkJRVWNzVlVGQlRTeE5RVUZOTEd0Q1FVRnJRanRCUVVWdVJpeE5RVUZKTEVWQlFVVXNSMEZCUnp0QlFVTlFMRkZCUVVrc1lVRkJZU3hGUVVGRk8wRkJRMjVDTEZGQlFVa3NTMEZCU3l4RlFVRkZMRWxCUVVrc1NVRkJTVHRCUVVGSExGVkJRVWtzUlVGQlJTeEpRVUZKTzBGQlFVRXNVMEZETTBJN1FVRkRUQ3hSUVVGSk8wRkJRVUU3UVVGSFRpeFRRVUZQTzBGQlFVRTdRVUZUVkN4RlFVRkZMRkZCUVZFc1YwRkJXVHRCUVVOd1FpeE5RVUZKTEVsQlFVa3NUVUZEVGl4UFFVRlBMRVZCUVVVN1FVRkZXQ3hUUVVGUExGTkJRVk1zU1VGQlNTeExRVUZMTEVsQlFVa3NSVUZCUlN4SlFVRkpMRWRCUVVjc1MwRkJTenRCUVVGQk8wRkJiVUkzUXl4RlFVRkZMRTlCUVU4c1JVRkJSU3hOUVVGTkxGZEJRVms3UVVGRE0wSXNUVUZCU1N4SlFVRkpMRWxCUTA0c1NVRkJTU3hOUVVOS0xFOUJRVThzUlVGQlJUdEJRVVZZTEUxQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVZrc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRGJrTXNUVUZCU1N4RlFVRkZPMEZCUVZVc1YwRkJUeXhKUVVGSkxFdEJRVXM3UVVGRmFFTXNUMEZCU3l4TFFVRkxPMEZCUTFZc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eFpRVUZaTEV0QlFVc3NTMEZCU3l4SlFVRkpMRVZCUVVVc1IwRkJSeXhGUVVGRkxGRkJRVkU3UVVGRE9VTXNUMEZCU3l4WFFVRlhPMEZCUldoQ0xFMUJRVWtzUzBGQlN5eE5RVUZOTEdsQ1FVRnBRaXhOUVVGTk8wRkJSWFJETEU5QlFVc3NXVUZCV1R0QlFVTnFRaXhQUVVGTExGZEJRVmM3UVVGRmFFSXNVMEZCVHl4VFFVRlRMRmRCUVZjc1NVRkJTU3hGUVVGRkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVsQlFVazdRVUZCUVR0QlFXZENkRVFzUlVGQlJTeGhRVUZoTEVWQlFVVXNUMEZCVHl4WFFVRlpPMEZCUTJ4RExFMUJRVWtzUjBGQlJ5eEhRVUZITEVsQlFVa3NSMEZCUnl4TFFVRkxMRWRCUTNCQ0xFbEJRVWtzVFVGRFNpeEpRVUZKTEVWQlFVVXNSMEZEVGl4SlFVRkpMRVZCUVVVc1IwRkRUaXhKUVVGSkxFVkJRVVVzUjBGRFRpeFBRVUZQTEVWQlFVVTdRVUZIV0N4TlFVRkpMRTFCUVUwc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTEVsQlFVazdRVUZETVVJc1YwRkJUeXhKUVVGSkxFdEJRVXNzUTBGQlF5eExRVUZMTEVsQlFVa3NTMEZCVFN4RlFVRkRMRXRCUVVzc1JVRkJSU3hOUVVGTkxFMUJRVTBzU1VGQlNTeEpRVUZKTEVsQlFVazdRVUZCUVR0QlFVZHNSU3hoUVVGWE8wRkJSMWdzVFVGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXp0QlFVbG1MRTFCUVVrc1MwRkJTeXhMUVVGTExFdEJRVXNzU1VGQlNTeEhRVUZITzBGQlEzaENMRkZCUVVrc1pVRkJaVHRCUVVWdVFpeFJRVUZMTEVkQlFVVXNVMEZCVXl4TFFVRkxMRXRCUVVzN1FVRkJSeXhYUVVGTE8wRkJRMnhETEZGQlFVa3NTMEZCU3l4TFFVRkxPMEZCUTJRc1VVRkJTU3hWUVVGWExFdEJRVWtzUzBGQlN5eExRVUZOTEV0QlFVa3NTMEZCU3l4SlFVRkpPMEZCUlRORExGRkJRVWtzUzBGQlN5eEpRVUZKTEVkQlFVYzdRVUZEWkN4VlFVRkpMRTlCUVU4N1FVRkJRU3hYUVVOT08wRkJRMHdzVlVGQlNTeEZRVUZGTzBGQlEwNHNWVUZCU1N4RlFVRkZMRTFCUVUwc1IwRkJSeXhGUVVGRkxGRkJRVkVzVDBGQlR5eExRVUZMTzBGQlFVRTdRVUZIZGtNc1VVRkJTU3hKUVVGSkxFdEJRVXM3UVVGQlFTeFRRVU5TTzBGQlEwd3NVVUZCU1N4SlFVRkpMRXRCUVVzc1JVRkJSVHRCUVVGQk8wRkJSMnBDTEU5QlFVMHNTMEZCU1N4TFFVRkxMR0ZCUVdFN1FVRkhOVUlzWVVGQlV6dEJRVU5RTEZGQlFVazdRVUZEU2l4UlFVRkpMRVZCUVVVc1MwRkJTeXhQUVVGUExFZEJRVWNzUjBGQlJ5eExRVUZMTEVkQlFVY3NTVUZCU1N4TlFVRk5PMEZCUnpGRExGRkJRVWtzWlVGQlpTeEZRVUZGTEVkQlFVY3NUVUZCVFN4SFFVRkhMRkZCUVZNc1MwRkJTU3hsUVVGbExFVkJRVVVzU1VGQlNTeE5RVUZOTEVkQlFVY3NTMEZCU3p0QlFVTXZSU3hWUVVGSkxFVkJRVVVzVFVGQlRTeExRVUZMTEVkQlFVY3NTMEZCU3p0QlFVbDZRaXhWUVVGSkxFdEJRVXNzVlVGQlZTeERRVUZETEU5QlFVOHNTMEZCU3l4UlFVRlJPMEZCU1hSRExGbEJRVWtzUTBGQlF5eExRVUZMTzBGQlExSXNiVUpCUVZNc1IwRkJSeXhKUVVGSkxFZEJRVWM3UVVGRmJrSXNZMEZCU1N4RlFVRkZMRTFCUVUwc1IwRkJSeXhIUVVGSExFbEJRVWs3UVVGRGNFSXNaMEpCUVVrN1FVRkRTanRCUVVGQk8wRkJRVUU3UVVGSlNpeGpRVUZOTzBGQlEwNHNZMEZCVFR0QlFVRkJMR0ZCUTBRN1FVRkpUQ3haUVVGSkxFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RlFVRkZMRTFCUVUwc1RVRkJUU3hGUVVGRkxFOUJRVThzVFVGQlRTeExRVUZMTzBGQlJ6ZERMRzFDUVVGVExFZEJRVWNzU1VGQlNTeEhRVUZITzBGQlEyNUNMR05CUVVrc1EwRkJReXhGUVVGRkxFMUJRVTBzUjBGQlJ5eEhRVUZITzBGQlFVRTdRVUZIY2tJN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGTFRpeGhRVUZYTzBGQlJWZ3NVMEZCVHl4VFFVRlRMRWRCUVVjc1IwRkJSeXhMUVVGTExGVkJRVlU3UVVGQlFUdEJRV2xDZGtNc1JVRkJSU3hWUVVGVkxFVkJRVVVzVFVGQlRTeFhRVUZaTzBGQlF6bENMRTFCUVVrc1NVRkJTU3hKUVVOT0xFbEJRVWtzVFVGRFNpeFBRVUZQTEVWQlFVVTdRVUZGV0N4TlFVRkpMRU5CUVVNc1JVRkJSVHRCUVVGWkxGZEJRVThzU1VGQlNTeExRVUZMTzBGQlEyNURMRTFCUVVrc1JVRkJSVHRCUVVGVkxGZEJRVThzU1VGQlNTeExRVUZMTzBGQlJXaERMRTlCUVVzc1MwRkJTenRCUVVOV0xFOUJRVXNzUzBGQlN6dEJRVU5XTEU5QlFVc3NXVUZCV1N4TFFVRkxPMEZCUTNSQ0xFOUJRVXNzVjBGQlZ6dEJRVVZvUWl4TlFVRkpMRVZCUVVVN1FVRkRUaXhKUVVGRkxFbEJRVWs3UVVGRFRpeE5RVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRXRCUVVzc1IwRkJSeXhOUVVGTkxFVkJRVVVzVFVGQlRTeEpRVUZKTEZGQlFWRXNTMEZCU3l4SlFVRkpPMEZCUlRkRUxFOUJRVXNzV1VGQldUdEJRVU5xUWl4UFFVRkxMRmRCUVZjN1FVRkZhRUlzVTBGQlR5eFRRVUZUTEZsQlFWa3NTMEZCU3l4WlFVRlpMRWxCUVVrc1JVRkJSU3hSUVVGUkxFZEJRVWNzU1VGQlNTeEpRVUZKTzBGQlFVRTdRVUY1UW5oRkxFVkJRVVVzVVVGQlVTeEZRVUZGTEUxQlFVMHNVMEZCVlN4SFFVRkhPMEZCUXpkQ0xFMUJRVWtzVDBGQlR5eEhRVUZITEVkQlFVY3NSMEZCUnl4SFFVRkhMRWxCUVVrc1IwRkJSeXhMUVVGTExFdEJRMnBETEVsQlFVa3NUVUZEU2l4UFFVRlBMRVZCUVVVc1lVRkRWQ3hMUVVGTExFVkJRVVVzUjBGRFVDeExRVUZOTEV0QlFVa3NTVUZCU1N4TFFVRkxMRWxCUVVrN1FVRkZla0lzU1VGQlJTeExRVUZMTEVWQlFVVTdRVUZIVkN4TlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRWxCUVVrN1FVRkZiRU1zVjBGQlR5eEpRVUZKTEV0QlFVc3NRMEZCUXl4RlFVRkZMRXRCUVVzc1RVRkJUU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEUxQlFVMHNUVUZCVFN4RFFVRkRMRWRCUVVjc1RVRkJUU3hEUVVGRExFdEJTVFZFTEUxQlNVRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzU1VGQlNTeEZRVUZGTEVsQlFVazdRVUZCUVR0QlFVZHVReXhOUVVGSkxGVkJRVlVzUlVGQlJTeEpRVUZKTEZsQlFWa3NWVUZCVlN4RlFVRkZMRWxCUVVrN1FVRkRhRVFzVVVGQlRTeEhRVUZITzBGQlExUXNVVUZCVFN4SFFVRkhPMEZCUjFRc1RVRkJTU3hOUVVGTkxFdEJRVXM3UVVGRFlpeFJRVUZKTzBGQlEwb3NVMEZCU3p0QlFVTk1MRk5CUVVzN1FVRkRUQ3hUUVVGTE8wRkJRMHdzVlVGQlRUdEJRVU5PTEZWQlFVMDdRVUZCUVR0QlFVbFNMRTFCUVVrN1FVRkRTaXhQUVVGTExFMUJRVTA3UVVGRFdDeFBRVUZMTEVsQlFVa3NTVUZCU1R0QlFVRk5MRTFCUVVVc1MwRkJTenRCUVVjeFFpeFBRVUZMTEVsQlFVa3NTMEZCU3l4RlFVRkZMRXRCUVVzc1MwRkJTVHRCUVVOMlFpeFpRVUZSTzBGQlExSXNVMEZCU3l4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFdEJRVWs3UVVGRGVFSXNWVUZCU1N4RlFVRkZMRXRCUVVzc1IwRkJSeXhMUVVGTExFZEJRVWNzU1VGQlNTeEpRVUZKTEV0QlFVczdRVUZEYmtNc1VVRkJSU3hQUVVGUExFbEJRVWtzVDBGQlR6dEJRVU53UWl4alFVRlJMRWxCUVVrc1QwRkJUenRCUVVGQk8wRkJSM0pDTEUxQlFVVXNTMEZCVFN4SFFVRkZMRXRCUVVzc1UwRkJVeXhQUVVGUE8wRkJRVUU3UVVGSmFrTXNVMEZCVHl4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVGTkxFMUJRVVU3UVVGRmNFSXNUVUZCU1R0QlFVRlBMRTFCUVVVN1FVRkJRVHRCUVVOU0xFMUJRVVU3UVVGRlVDeEpRVUZGTEVsQlFVazdRVUZEVGl4SlFVRkZMRWxCUVVrc2EwSkJRV3RDTEVkQlFVYzdRVUZGTTBJc1UwRkJUeXhYUVVGWExGTkJRVk1zUjBGQlJ5eExRVUZMTEZkQlFWY3NTMEZCU3l4WlFVRlpPMEZCUVVFN1FVRmpha1VzUlVGQlJTeFhRVUZYTEZOQlFWVXNTVUZCU1N4SlFVRkpPMEZCUXpkQ0xGTkJRVThzWlVGQlpTeE5RVUZOTEVkQlFVY3NTVUZCU1R0QlFVRkJPMEZCWTNKRExFVkJRVVVzYTBKQlFXdENMRVZCUVVVc1QwRkJUeXhUUVVGVkxFbEJRVWtzU1VGQlNUdEJRVU0zUXl4TlFVRkpMRWxCUVVrc1RVRkRUaXhQUVVGUExFVkJRVVU3UVVGRldDeE5RVUZKTEVsQlFVa3NTMEZCU3p0QlFVTmlMRTFCUVVrc1QwRkJUenRCUVVGUkxGZEJRVTg3UVVGRk1VSXNZVUZCVnl4SlFVRkpMRWRCUVVjN1FVRkZiRUlzVFVGQlNTeFBRVUZQTzBGQlFWRXNVMEZCU3l4TFFVRkxPMEZCUVVFN1FVRkRlRUlzWlVGQlZ5eEpRVUZKTEVkQlFVYzdRVUZGZGtJc1UwRkJUeXhUUVVGVExFZEJRVWNzUzBGQlN5eEZRVUZGTEVsQlFVa3NSMEZCUnp0QlFVRkJPMEZCV1c1RExFVkJRVVVzWjBKQlFXZENMRk5CUVZVc1NVRkJTU3hKUVVGSk8wRkJRMnhETEUxQlFVa3NTMEZEUml4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRk8wRkJSVmdzVFVGQlNTeFBRVUZQTEZGQlFWRTdRVUZEYWtJc1ZVRkJUU3hsUVVGbExFZEJRVWM3UVVGQlFTeFRRVU51UWp0QlFVTk1MR1ZCUVZjc1NVRkJTU3hIUVVGSE8wRkJSV3hDTEZGQlFVa3NUMEZCVHp0QlFVRlJMRmRCUVVzc1MwRkJTenRCUVVGQk8wRkJRM2hDTEdsQ1FVRlhMRWxCUVVrc1IwRkJSenRCUVVWMlFpeFJRVUZKTEZOQlFWTXNTVUZCU1N4TFFVRkxMRWxCUVVrc1MwRkJTeXhIUVVGSE8wRkJRMnhETEZWQlFVMHNaVUZCWlN4SFFVRkhMRTFCUVUwc1MwRkJTenRCUVVGQk8wRkJSM0pETEZOQlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1JVRkJSU3hYUVVGWExFMUJRVTBzVFVGQlRUdEJRVUZCTzBGQmIwSm9SQ3hGUVVGRkxGVkJRVlVzVTBGQlZTeEpRVUZKTEVsQlFVazdRVUZETlVJc1RVRkJTU3hMUVVGTExFZEJRMUFzU1VGQlNTeE5RVU5LTEU5QlFVOHNSVUZCUlR0QlFVVllMRTFCUVVrc1QwRkJUeXhSUVVGUk8wRkJRMnBDTEZWQlFVMHNaVUZCWlR0QlFVRkJMRk5CUTJoQ08wRkJRMHdzWlVGQlZ5eEpRVUZKTEVkQlFVYzdRVUZGYkVJc1VVRkJTU3hQUVVGUE8wRkJRVkVzVjBGQlN5eExRVUZMTzBGQlFVRTdRVUZEZUVJc2FVSkJRVmNzU1VGQlNTeEhRVUZITzBGQlJYWkNMRkZCUVVrc1UwRkJVeXhKUVVGSkxFdEJRVXNzU1VGQlNTeExRVUZMTEVWQlFVVXNTVUZCU1N4SFFVRkhPMEZCUTNoRExGVkJRVTBzWlVGQlpTeEhRVUZITEU5QlFVOHNTMEZCU3l4RlFVRkZMRWxCUVVrN1FVRkJRVHRCUVVzMVF5eFRRVUZQTEVWQlFVVXNWMEZCVnl4RFFVRkRMRVZCUVVVc1YwRkJWeXhOUVVGTkxFMUJRVTA3UVVGQlFUdEJRV1ZvUkN4RlFVRkZMR0ZCUVdFc1UwRkJWU3hOUVVGTk8wRkJRemRDTEUxQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1NVRkJTU3hIUVVGSExFZEJRVWNzUjBGQlJ5eEpRVUZKTEVsQlFVa3NTVUZCU1N4SFFVRkhMRWRCUTNwRExFbEJRVWtzVFVGRFNpeExRVUZMTEVWQlFVVXNSMEZEVUN4UFFVRlBMRVZCUVVVN1FVRkZXQ3hOUVVGSkxFTkJRVU03UVVGQlNTeFhRVUZQTEVsQlFVa3NTMEZCU3p0QlFVVjZRaXhQUVVGTExFdEJRVXNzU1VGQlNTeExRVUZMTzBGQlEyNUNMRTlCUVVzc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGRmJrSXNUVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRZaXhOUVVGSkxFVkJRVVVzU1VGQlNTeGhRVUZoTEUxQlFVMHNSVUZCUlN4SlFVRkpPMEZCUTI1RExFMUJRVWtzU1VGQlNUdEJRVU5TTEVsQlFVVXNSVUZCUlN4TFFVRkxMRkZCUVZFc1NVRkJTU3hKUVVGSkxFbEJRVWtzVjBGQlZ5eEpRVUZKTzBGQlJUVkRMRTFCUVVrc1VVRkJVU3hOUVVGTk8wRkJSMmhDTEZkQlFVOHNTVUZCU1N4SlFVRkpMRWxCUVVrN1FVRkJRU3hUUVVOa08wRkJRMHdzVVVGQlNTeEpRVUZKTEV0QlFVczdRVUZEWWl4UlFVRkpMRU5CUVVNc1JVRkJSU3hYUVVGWExFVkJRVVVzUjBGQlJ6dEJRVUZMTEZsQlFVMHNUVUZCVFN4clFrRkJhMEk3UVVGRE1VUXNWMEZCVHl4RlFVRkZMRWRCUVVjc1MwRkJUU3hKUVVGSkxFbEJRVWtzU1VGQlNTeExRVUZOTzBGQlFVRTdRVUZIZEVNc1lVRkJWenRCUVVOWUxFMUJRVWtzU1VGQlNTeExRVUZMTEdWQlFXVTdRVUZETlVJc1QwRkJTeXhMUVVGTE8wRkJRMVlzVDBGQlN5eFpRVUZaTEVsQlFVa3NSMEZCUnl4VFFVRlRMRmRCUVZjN1FVRkZOVU1zWVVGQlZUdEJRVU5TTEZGQlFVa3NUMEZCVHl4SFFVRkhMRWRCUVVjc1IwRkJSeXhIUVVGSE8wRkJRM1pDTEZOQlFVc3NSMEZCUnl4TFFVRkxMRVZCUVVVc1RVRkJUVHRCUVVOeVFpeFJRVUZKTEVkQlFVY3NTVUZCU1N4VFFVRlRPMEZCUVVjN1FVRkRka0lzVTBGQlN6dEJRVU5NTEZOQlFVczdRVUZEVEN4VFFVRkxPMEZCUTB3c1UwRkJTeXhIUVVGSExFdEJRVXNzUlVGQlJTeE5RVUZOTzBGQlEzSkNMRk5CUVVzN1FVRkRUQ3hUUVVGTE8wRkJRMHdzVVVGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlN4TlFVRk5PMEZCUTNCQ0xGRkJRVWs3UVVGQlFUdEJRVWRPTEU5QlFVc3NUMEZCVHl4TFFVRkxMRTFCUVUwc1MwRkJTeXhKUVVGSkxFZEJRVWNzUjBGQlJ6dEJRVU4wUXl4UFFVRkxMRWRCUVVjc1MwRkJTeXhIUVVGSExFMUJRVTA3UVVGRGRFSXNUMEZCU3l4SFFVRkhMRXRCUVVzc1IwRkJSeXhOUVVGTk8wRkJRM1JDTEV0QlFVY3NTVUZCU1N4SFFVRkhMRWxCUVVrc1JVRkJSVHRCUVVkb1FpeE5RVUZKTEU5QlFVOHNTVUZCU1N4SlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFZEJRVWNzVFVGQlRTeEpRVUZKTEU5QlFVOHNTVUZCU1N4SlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFZEJRVWNzVTBGQlV5eEpRVU0zUlN4RFFVRkRMRWxCUVVrc1RVRkJUU3hEUVVGRExFbEJRVWs3UVVGRmRFSXNUMEZCU3l4WlFVRlpPMEZCUTJwQ0xHRkJRVmM3UVVGRldDeFRRVUZQTzBGQlFVRTdRVUZqVkN4RlFVRkZMR2RDUVVGblFpeEZRVUZGTEZGQlFWRXNVMEZCVlN4SlFVRkpMRWxCUVVrN1FVRkROVU1zVTBGQlR5eGxRVUZsTEUxQlFVMHNTVUZCU1N4SlFVRkpPMEZCUVVFN1FVRnZRblJETEVWQlFVVXNXVUZCV1N4VFFVRlZMRWRCUVVjc1NVRkJTVHRCUVVNM1FpeE5RVUZKTEVsQlFVa3NUVUZEVGl4UFFVRlBMRVZCUVVVN1FVRkZXQ3hOUVVGSkxFbEJRVWtzUzBGQlN6dEJRVVZpTEUxQlFVa3NTMEZCU3l4TlFVRk5PMEZCUjJJc1VVRkJTU3hEUVVGRExFVkJRVVU3UVVGQlJ5eGhRVUZQTzBGQlJXcENMRkZCUVVrc1NVRkJTU3hMUVVGTE8wRkJRMklzVTBGQlN5eExRVUZMTzBGQlFVRXNVMEZEVER0QlFVTk1MRkZCUVVrc1NVRkJTU3hMUVVGTE8wRkJRMklzVVVGQlNTeFBRVUZQTEZGQlFWRTdRVUZEYWtJc1YwRkJTeXhMUVVGTE8wRkJRVUVzVjBGRFREdEJRVU5NTEdsQ1FVRlhMRWxCUVVrc1IwRkJSenRCUVVGQk8wRkJTWEJDTEZGQlFVa3NRMEZCUXl4RlFVRkZPMEZCUVVjc1lVRkJUeXhGUVVGRkxFbEJRVWtzU1VGQlNUdEJRVWN6UWl4UlFVRkpMRU5CUVVNc1JVRkJSU3hIUVVGSE8wRkJRMUlzVlVGQlNTeEZRVUZGTzBGQlFVY3NWVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRha0lzWVVGQlR6dEJRVUZCTzBGQlFVRTdRVUZMV0N4TlFVRkpMRVZCUVVVc1JVRkJSU3hKUVVGSk8wRkJRMVlzWlVGQlZ6dEJRVU5ZTEZGQlFVa3NUMEZCVHl4SFFVRkhMRWRCUVVjc1IwRkJSeXhKUVVGSkxFZEJRVWNzVFVGQlRUdEJRVU5xUXl4bFFVRlhPMEZCUTFnc1lVRkJVenRCUVVGQkxGTkJSMG83UVVGRFRDeE5RVUZGTEVsQlFVa3NSVUZCUlR0QlFVTlNMRkZCUVVrN1FVRkJRVHRCUVVkT0xGTkJRVTg3UVVGQlFUdEJRVk5VTEVWQlFVVXNWMEZCVnl4WFFVRlpPMEZCUTNaQ0xGTkJRVThzUTBGQlF6dEJRVUZCTzBGQlkxWXNSVUZCUlN4VlFVRlZMRk5CUVZVc1NVRkJTU3hKUVVGSk8wRkJRelZDTEZOQlFVOHNaVUZCWlN4TlFVRk5MRWRCUVVjc1NVRkJTVHRCUVVGQk8wRkJLME55UXl4RlFVRkZMRlZCUVZVc1JVRkJSU3hOUVVGTkxGTkJRVlVzUjBGQlJ6dEJRVU12UWl4TlFVRkpMRWRCUVVjc1IwRkJSeXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVU51UWl4SlFVRkpMRTFCUTBvc1QwRkJUeXhGUVVGRkxHRkJRMVFzUzBGQlN5eERRVUZGTEV0QlFVa3NTVUZCU1N4TFFVRkxPMEZCUjNSQ0xFMUJRVWtzUTBGQlF5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxFVkJRVVVzVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVRkpMRmRCUVU4c1NVRkJTU3hMUVVGTExGRkJRVkVzUTBGQlF5eEhRVUZITzBGQlJYQkZMRTFCUVVrc1NVRkJTU3hMUVVGTE8wRkJSV0lzVFVGQlNTeEZRVUZGTEVkQlFVYzdRVUZCU1N4WFFVRlBPMEZCUlhCQ0xFOUJRVXNzUzBGQlN6dEJRVU5XTEU5QlFVc3NTMEZCU3p0QlFVVldMRTFCUVVrc1JVRkJSU3hIUVVGSE8wRkJRVWtzVjBGQlR5eFRRVUZUTEVkQlFVY3NTVUZCU1R0QlFVZHdReXhOUVVGSkxGVkJRVlVzUlVGQlJTeEpRVUZKTzBGQlIzQkNMRTFCUVVrc1MwRkJTeXhGUVVGRkxFVkJRVVVzVTBGQlV5eExRVUZOTEV0QlFVa3NTMEZCU3l4SlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGUExHdENRVUZyUWp0QlFVTjBSU3hSUVVGSkxFOUJRVThzVFVGQlRTeEhRVUZITEVkQlFVYzdRVUZEZGtJc1YwRkJUeXhGUVVGRkxFbEJRVWtzU1VGQlNTeEpRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpMRXRCUVVzc1UwRkJVeXhIUVVGSExFbEJRVWs3UVVGQlFUdEJRVWQ0UkN4TlFVRkpMRVZCUVVVN1FVRkhUaXhOUVVGSkxFbEJRVWtzUjBGQlJ6dEJRVWRVTEZGQlFVa3NTVUZCU1N4RlFVRkZMRVZCUVVVc1UwRkJVenRCUVVGSExHRkJRVThzU1VGQlNTeExRVUZMTzBGQlIzaERMRkZCUVVzc1IwRkJSU3hGUVVGRkxFdEJRVXNzVFVGQlRUdEJRVUZITEZWQlFVazdRVUZITTBJc1VVRkJTU3hGUVVGRkxFdEJRVXNzUzBGQlN5eEZRVUZGTEVWQlFVVXNUVUZCVFN4TFFVRkxMRVZCUVVVc1JVRkJSU3hWUVVGVkxFZEJRVWM3UVVGRE9VTXNVVUZCUlN4SlFVRkpPMEZCUTA0c1lVRkJUenRCUVVGQk8wRkJRVUU3UVVGUldDeE5RVUZKTEZGQlFWRXNRMEZCUXl4SFFVRkhPMEZCUTJoQ0xFMUJRVWtzUzBGQlN5eExRVUZMTEVOQlFVTXNVMEZCVXl4TFFVTndRaXhWUVVGVkxFdEJRVTBzVFVGQlN5eEpRVUZKTEU5QlFVOHNaVUZCWlN4RlFVRkZMRTFCUVUwc1MwRkJTeXhQUVVGUExFVkJRVVVzU1VGQlNTeE5RVU42UlN4SlFVRkpMRXRCUVVzc1NVRkJTU3hKUVVGSk8wRkJTM0pDTEUxQlFVa3NTVUZCU1N4TFFVRkxMRTlCUVU4c1MwRkJTeXhKUVVGSkxFdEJRVXNzVDBGQlR6dEJRVUZITEZkQlFVOHNTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hKUVVGSkxFbEJRVWs3UVVGRk5VVXNZVUZCVnp0QlFVTllMRTlCUVVzc1YwRkJWeXhGUVVGRkxFbEJRVWs3UVVGTmRFSXNUVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTeXhMUVVGSkxFbEJRVWs3UVVGSE1VSXNUVUZCU1N4dFFrRkJiVUlzUlVGQlJTeE5RVUZOTEdsQ1FVRnBRaXhIUVVGSExFdEJRVXNzUzBGQlN6dEJRVWMzUkN4TlFVRkpMRVZCUVVVc1IwRkJSenRCUVVkUUxGRkJRVWtzVTBGQlV5eEhRVUZITEV0QlFVc3NSMEZCUnp0QlFVbDRRaXhSUVVGSkxHOUNRVUZ2UWl4RlFVRkZMRWRCUVVjc1NVRkJTU3hMUVVGTE8wRkJRM0JETEZWQlFVa3NTMEZCU3p0QlFVZFVMRlZCUVVrc1UwRkJVeXh0UWtGQmJVSXNSVUZCUlN4TlFVRk5MR2xDUVVGcFFpeEhRVUZITEVsQlFVa3NTMEZCU3l4SlFVRkpMRWxCUVVrc1IwRkJSenRCUVVkb1JpeFZRVUZKTEVOQlFVTXNaVUZCWlN4RlFVRkZMRWRCUVVjc1RVRkJUU3hMUVVGTExFZEJRVWNzUzBGQlN5eE5RVUZOTEV0QlFVc3NUVUZCVFR0QlFVTXpSQ3haUVVGSkxGTkJRVk1zUjBGQlJ5eExRVUZMTEVkQlFVYzdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkxPVUlzU1VGQlJTeEpRVUZKTzBGQlEwNHNZVUZCVnp0QlFVTllMRTlCUVVzc1YwRkJWenRCUVVWb1FpeFRRVUZQTEZOQlFWTXNSMEZCUnl4SlFVRkpPMEZCUVVFN1FVRmxla0lzUlVGQlJTeGpRVUZqTEZOQlFWVXNTVUZCU1N4SlFVRkpPMEZCUTJoRExFMUJRVWtzUzBGRFJpeEpRVUZKTEUxQlEwb3NUMEZCVHl4RlFVRkZPMEZCUlZnc1RVRkJTU3hQUVVGUExGRkJRVkU3UVVGRGFrSXNWVUZCVFN4bFFVRmxMRWRCUVVjc1JVRkJSU3hMUVVGTExFdEJRVXNzV1VGQldTeEZRVUZGTEV0QlFVc3NTMEZCU3p0QlFVRkJMRk5CUTNaRU8wRkJRMHdzWlVGQlZ5eEpRVUZKTEVkQlFVYzdRVUZGYkVJc1VVRkJTU3hQUVVGUE8wRkJRVkVzVjBGQlN5eExRVUZMTzBGQlFVRTdRVUZEZUVJc2FVSkJRVmNzU1VGQlNTeEhRVUZITzBGQlJYWkNMRkZCUVVrc1UwRkJVeXhKUVVGSkxFdEJRVXNzU1VGQlNTeEpRVUZKTzBGQlF6bENMRlZCUVUwc1pVRkJaU3hIUVVGSExFMUJRVTBzUlVGQlJTeExRVUZMTEVWQlFVVXNTMEZCU3l4TFFVRkxMRlZCUVZVN1FVRkJRVHRCUVVjM1JDeFRRVUZQTEVWQlFVVXNWMEZCVnl4RFFVRkRMRVZCUVVVc1YwRkJWeXhOUVVGTkxFMUJRVTA3UVVGQlFUdEJRV3RDYUVRc1JVRkJSU3h6UWtGQmMwSXNSVUZCUlN4UFFVRlBMRk5CUVZVc1NVRkJTU3hKUVVGSk8wRkJRMnBFTEUxQlFVa3NTVUZCU1N4TlFVTk9MRTlCUVU4c1JVRkJSVHRCUVVWWUxFMUJRVWtzVDBGQlR5eFJRVUZSTzBGQlEycENMRk5CUVVzc1MwRkJTenRCUVVOV0xGTkJRVXNzUzBGQlN6dEJRVUZCTEZOQlEwdzdRVUZEVEN4bFFVRlhMRWxCUVVrc1IwRkJSenRCUVVWc1FpeFJRVUZKTEU5QlFVODdRVUZCVVN4WFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVONFFpeHBRa0ZCVnl4SlFVRkpMRWRCUVVjN1FVRkJRVHRCUVVkNlFpeFRRVUZQTEZOQlFWTXNTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTVHRCUVVGQk8wRkJWMjVETEVWQlFVVXNWMEZCVnl4WFFVRlpPMEZCUTNaQ0xFMUJRVWtzU1VGQlNTeE5RVU5PTEU5QlFVOHNSVUZCUlN4aFFVTlVMRTFCUVUwc1pVRkJaU3hIUVVGSExFVkJRVVVzUzBGQlN5eExRVUZMTEZsQlFWa3NSVUZCUlN4TFFVRkxMRXRCUVVzN1FVRkZPVVFzVTBGQlR5eEZRVUZGTEZkQlFWY3NRMEZCUXl4RlFVRkZMRmRCUVZjc1RVRkJUU3hOUVVGTk8wRkJRVUU3UVVGUmFFUXNSVUZCUlN4WlFVRlpMRVZCUVVVc1VVRkJVU3hYUVVGWk8wRkJRMnhETEZOQlFVOHNVMEZCVXl4SlFVRkpMRXRCUVVzc1dVRkJXU3hQUVVGUExFdEJRVXNzU1VGQlNTeEhRVUZITzBGQlFVRTdRVUZUTVVRc1JVRkJSU3hWUVVGVkxFVkJRVVVzVTBGQlV5eFhRVUZaTzBGQlEycERMRTFCUVVrc1NVRkJTU3hOUVVOT0xFOUJRVThzUlVGQlJTeGhRVU5VTEUxQlFVMHNaVUZCWlN4SFFVRkhMRVZCUVVVc1MwRkJTeXhMUVVGTExGbEJRVmtzUlVGQlJTeExRVUZMTEV0QlFVczdRVUZGT1VRc1UwRkJUeXhGUVVGRkxGVkJRVlVzVFVGQlRTeE5RVUZOTzBGQlFVRTdRVUZwUldwRExIZENRVUYzUWl4SFFVRkhPMEZCUTNwQ0xFMUJRVWtzUjBGQlJ5eEhRVUZITEVsQlExSXNhMEpCUVd0Q0xFVkJRVVVzVTBGQlV5eEhRVU0zUWl4TlFVRk5MRWxCUTA0c1NVRkJTU3hGUVVGRk8wRkJSVklzVFVGQlNTeHJRa0ZCYTBJc1IwRkJSenRCUVVOMlFpeFhRVUZQTzBGQlExQXNVMEZCU3l4SlFVRkpMRWRCUVVjc1NVRkJTU3hwUWtGQmFVSXNTMEZCU3p0QlFVTndReXhYUVVGTExFVkJRVVVzUzBGQlN6dEJRVU5hTEZWQlFVa3NWMEZCVnl4SFFVRkhPMEZCUTJ4Q0xGVkJRVWs3UVVGQlJ5eGxRVUZQTEdOQlFXTTdRVUZETlVJc1lVRkJUenRCUVVGQk8wRkJSMVFzVVVGQlNTeEZRVUZGTzBGQlEwNHNVMEZCU3l4SlFVRkpPMEZCUTFRc1VVRkJTU3hYUVVGWExFZEJRVWM3UVVGRGJFSXNVVUZCU1R0QlFVRkhMR0ZCUVU4c1kwRkJZenRCUVVGQkxHRkJRMjVDTEUxQlFVMHNSMEZCUnp0QlFVTnNRaXhYUVVGUE8wRkJRVUU3UVVGSlZDeFRRVUZQTEVsQlFVa3NUMEZCVHp0QlFVRkpMRk5CUVVzN1FVRkZNMElzVTBGQlR5eE5RVUZOTzBGQlFVRTdRVUZKWml4dlFrRkJiMElzUjBGQlJ5eE5RVUZMTEUxQlFVczdRVUZETDBJc1RVRkJTU3hOUVVGTkxFTkJRVU1zUTBGQlF5eExRVUZMTEVsQlFVa3NVVUZCVHl4SlFVRkpMRTFCUVVzN1FVRkRia01zVlVGQlRTeE5RVUZOTEd0Q1FVRnJRanRCUVVGQk8wRkJRVUU3UVVGVmJFTXNOa0pCUVRaQ0xFZEJRVWNzUjBGQlJ5eEpRVUZKTEZkQlFWYzdRVUZEYUVRc1RVRkJTU3hKUVVGSkxFZEJRVWNzUjBGQlJ6dEJRVWRrTEU5QlFVc3NTVUZCU1N4RlFVRkZMRWxCUVVrc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGQlNTeE5RVUZGTzBGQlIyNURMRTFCUVVrc1JVRkJSU3hKUVVGSkxFZEJRVWM3UVVGRFdDeFRRVUZMTzBGQlEwd3NVMEZCU3p0QlFVRkJMRk5CUTBFN1FVRkRUQ3hUUVVGTExFdEJRVXNzUzBGQlRTeExRVUZKTEV0QlFVczdRVUZEZWtJc1UwRkJTenRCUVVGQk8wRkJUVkFzVFVGQlNTeFJRVUZSTEVsQlFVa3NWMEZCVnp0QlFVTXpRaXhQUVVGTExFVkJRVVVzVFVGQlRTeEpRVUZKTzBGQlJXcENMRTFCUVVrc1lVRkJZU3hOUVVGTk8wRkJRM0pDTEZGQlFVa3NTVUZCU1N4SFFVRkhPMEZCUTFRc1ZVRkJTU3hMUVVGTE8wRkJRVWNzWVVGQlN5eExRVUZMTEUxQlFVMDdRVUZCUVN4bFFVTnVRaXhMUVVGTE8wRkJRVWNzWVVGQlN5eExRVUZMTEV0QlFVczdRVUZEYUVNc1ZVRkJTU3hMUVVGTExFdEJRVXNzVFVGQlRTeFRRVUZUTEV0QlFVc3NTMEZCU3l4TlFVRk5MRk5CUVZNc1RVRkJUU3hQUVVGVExFMUJRVTA3UVVGQlFTeFhRVU4wUlR0QlFVTk1MRlZCUVVzc1RVRkJTeXhMUVVGTExFdEJRVXNzUzBGQlN5eExRVUZMTEV0QlFVc3NTMEZCU3l4TFFVRkxMRXRCUVVzc1NVRkJTU3hOUVVOdVJDeEhRVUZGTEV0QlFVc3NTMEZCU3l4SlFVRkpMRTFCUVUwc1RVRkJUU3hSUVVGUkxFbEJRVWtzU1VGQlNTeExRVUZMTEV0QlF5OURMRTlCUVUwc1NVRkJTU3hMUVVGTExFMUJRVTBzVFVGQlR5eEhRVUZGTEV0QlFVc3NTMEZCU3l4SlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVGQk8wRkJRVUVzVTBGRk1VUTdRVUZEVEN4UlFVRkpMRWxCUVVrc1IwRkJSenRCUVVOVUxGVkJRVWtzUzBGQlN6dEJRVUZITEdGQlFVc3NTMEZCU3l4TlFVRlBPMEZCUVVFc1pVRkRjRUlzUzBGQlN6dEJRVUZITEdGQlFVc3NTMEZCU3l4TlFVRk5PMEZCUVVFc1pVRkRlRUlzUzBGQlN6dEJRVUZITEdGQlFVc3NTMEZCU3l4TFFVRkxPMEZCUTJoRExGVkJRVXNzWTBGQllTeExRVUZMTEUxQlFVMHNUVUZCVFN4UlFVRlJMRU5CUVVNc1lVRkJZU3hMUVVGTExFdEJRVXNzVFVGQlRUdEJRVUZCTEZkQlEzQkZPMEZCUTB3c1ZVRkJUU3hsUVVGaExFdEJRVXNzVFVGQlRTeExRVUZMTEV0QlFVc3NTMEZEZGtNc1EwRkJReXhoUVVGaExFdEJRVXNzUzBGQlRTeExRVUZMTEV0QlFVc3NTVUZCU1N4TlFVTnlReXhIUVVGRkxFdEJRVXNzUzBGQlN5eEpRVUZKTEUxQlFVOHNUVUZCVFN4UlFVRlJMRWxCUVVrc1NVRkJTU3hMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVWw2UkN4VFFVRlBPMEZCUVVFN1FVRlBWQ3h4UWtGQmNVSXNTMEZCU3l4UlFVRlJMRk5CUVZNN1FVRkRla01zVFVGQlNTeEhRVU5HTEUxQlFVMHNRMEZCUXl4SlFVTlFMRTFCUTBFc1NVRkJTU3hIUVVOS0xFOUJRVThzU1VGQlNUdEJRVVZpTEZOQlFVOHNTVUZCU1N4UlFVRlBPMEZCUTJoQ0xGTkJRVXNzVDBGQlR5eEpRVUZKTEZGQlFWRTdRVUZCVXl4VlFVRkpMRk5CUVZNN1FVRkRPVU1zVVVGQlNTeE5RVUZOTEZOQlFWTXNVVUZCVVN4SlFVRkpMRTlCUVU4N1FVRkRkRU1zVTBGQlN5eEpRVUZKTEVkQlFVY3NTVUZCU1N4SlFVRkpMRkZCUVZFc1MwRkJTenRCUVVNdlFpeFZRVUZKTEVsQlFVa3NTMEZCU3l4VlFVRlZMRWRCUVVjN1FVRkRlRUlzV1VGQlNTeEpRVUZKTEVsQlFVa3NUMEZCVHp0QlFVRlJMR05CUVVrc1NVRkJTU3hMUVVGTE8wRkJRM2hETEZsQlFVa3NTVUZCU1N4TlFVRk5MRWxCUVVrc1MwRkJTeXhWUVVGVk8wRkJRMnBETEZsQlFVa3NUVUZCVFR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVV0b1FpeFRRVUZQTEVsQlFVazdRVUZCUVR0QlFWTmlMR2RDUVVGblFpeE5RVUZOTEVkQlFVYzdRVUZEZGtJc1RVRkJTU3hIUVVGSExFZEJRMHdzVFVGQlRTeEZRVUZGTEVWQlFVVTdRVUZOV2l4TlFVRkpMRTFCUVUwc1NVRkJTVHRCUVVOYUxGRkJRVWtzUzBGQlN5eExRVUZMTEUxQlFVMDdRVUZEY0VJc1VVRkJTeXhMUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTzBGQlFVRXNVMEZEYmtJN1FVRkRUQ3hSUVVGSk8wRkJRMG9zVVVGQlNUdEJRVUZCTzBGQlIwNHNUMEZCU3l4aFFVRmhPMEZCUld4Q0xFMUJRVWtzWVVGQllTeE5RVUZOTEVkQlFVY3NSVUZCUlN4TlFVRk5MRWxCUVVrc1NVRkJTU3hMUVVGTE8wRkJSeTlETEZkQlFWTXNTVUZCU1N4SFFVRkhMRTlCUVUwN1FVRkRjRUlzVVVGQlNTeFJRVUZSTEVWQlFVVXNUVUZCVFR0QlFVTndRaXhSUVVGSkxFMUJRVTBzVFVGQlRTeFBRVUZQTEUxQlFVMHNUMEZCVHl4TlFVRk5MRWRCUVVjc1MwRkJTenRCUVVGQk8wRkJSM0JFTEU5QlFVc3NZVUZCWVR0QlFVVnNRaXhUUVVGUE8wRkJRVUU3UVVGUFZDeEpRVUZKTEZOQlFWVXNWMEZCV1R0QlFVZDRRaXd5UWtGQmVVSXNSMEZCUnl4SFFVRkhMRTFCUVUwN1FVRkRia01zVVVGQlNTeE5RVU5HTEZGQlFWRXNSMEZEVWl4SlFVRkpMRVZCUVVVN1FVRkZVaXhUUVVGTExFbEJRVWtzUlVGQlJTeFRRVUZUTEU5QlFVMDdRVUZEZUVJc1lVRkJUeXhGUVVGRkxFdEJRVXNzU1VGQlNUdEJRVU5zUWl4UlFVRkZMRXRCUVVzc1QwRkJUeXhQUVVGUE8wRkJRM0pDTEdOQlFWRXNUMEZCVHl4UFFVRlBPMEZCUVVFN1FVRkhlRUlzVVVGQlNUdEJRVUZQTEZGQlFVVXNVVUZCVVR0QlFVVnlRaXhYUVVGUE8wRkJRVUU3UVVGSFZDeHRRa0ZCYVVJc1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNUdEJRVU0zUWl4UlFVRkpMRWRCUVVjN1FVRkZVQ3hSUVVGSkxFMUJRVTBzU1VGQlNUdEJRVU5hTEZWQlFVa3NTMEZCU3l4TFFVRkxMRWxCUVVrN1FVRkJRU3hYUVVOaU8wRkJRMHdzVjBGQlN5eEpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1MwRkJTenRCUVVNelFpeFpRVUZKTEVWQlFVVXNUVUZCVFN4RlFVRkZMRWxCUVVrN1FVRkRhRUlzWTBGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRWxCUVVrN1FVRkRkRUk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZMVGl4WFFVRlBPMEZCUVVFN1FVRkhWQ3h2UWtGQmEwSXNSMEZCUnl4SFFVRkhMRWxCUVVrc1RVRkJUVHRCUVVOb1F5eFJRVUZKTEVsQlFVazdRVUZIVWl4WFFVRlBMRkZCUVU4N1FVRkRXaXhSUVVGRkxFOUJRVTg3UVVGRFZDeFZRVUZKTEVWQlFVVXNUVUZCVFN4RlFVRkZMRTFCUVUwc1NVRkJTVHRCUVVONFFpeFJRVUZGTEUxQlFVMHNTVUZCU1N4UFFVRlBMRVZCUVVVc1RVRkJUU3hGUVVGRk8wRkJRVUU3UVVGSkwwSXNWMEZCVHl4RFFVRkRMRVZCUVVVc1RVRkJUU3hGUVVGRkxGTkJRVk03UVVGQlNTeFJRVUZGTzBGQlFVRTdRVUZIYmtNc1UwRkJUeXhUUVVGVkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVsQlFVa3NTVUZCU1N4TlFVRk5PMEZCUTNaRExGRkJRVWtzUzBGQlN5eEhRVUZITEVkQlFVY3NSMEZCUnl4VFFVRlRMRTFCUVUwc1RVRkJUU3hQUVVGUExFZEJRVWNzU1VGQlNTeExRVUZMTEUxQlFVMHNUVUZCVFN4SlFVRkpMRWRCUVVjc1NVRkJTU3hKUVVGSkxFdEJRMjVHTEVsQlFVa3NTVUZEU2l4UFFVRlBMRVZCUVVVc1lVRkRWQ3hSUVVGUExFVkJRVVVzUzBGQlN5eEZRVUZGTEVsQlFVa3NTVUZCU1N4SlFVTjRRaXhMUVVGTExFVkJRVVVzUjBGRFVDeExRVUZMTEVWQlFVVTdRVUZIVkN4UlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRWxCUVVrN1FVRkZiRU1zWVVGQlR5eEpRVUZKTEV0QlExUXNRMEZCUXl4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxFdEJRVTBzVFVGQlN5eE5RVUZOTEVkQlFVY3NUVUZCVFN4SFFVRkhMRXRCUVVzc1EwRkJReXhOUVVGTkxFMUJSM0JFTEUxQlFVMHNSMEZCUnl4TlFVRk5MRXRCUVVzc1EwRkJReXhMUVVGTExGRkJRVThzU1VGQlNTeFJRVUZQTzBGQlFVRTdRVUZIYUVRc1VVRkJTU3hOUVVGTk8wRkJRMUlzWjBKQlFWVTdRVUZEVml4VlFVRkpMRVZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRVUVzVjBGRFVEdEJRVU5NTEdGQlFVODdRVUZEVUN4blFrRkJWVHRCUVVOV0xGVkJRVWtzVlVGQlZTeEZRVUZGTEVsQlFVa3NWMEZCVnl4VlFVRlZMRVZCUVVVc1NVRkJTVHRCUVVGQk8wRkJSMnBFTEZOQlFVc3NSMEZCUnp0QlFVTlNMRk5CUVVzc1IwRkJSenRCUVVOU0xGRkJRVWtzU1VGQlNTeExRVUZMTzBGQlEySXNVMEZCU3l4RlFVRkZMRWxCUVVrN1FVRkpXQ3hUUVVGTExFbEJRVWtzUjBGQlJ5eEhRVUZITEUxQlFVOHNTVUZCUnl4TlFVRk5MRWxCUVVrN1FVRkJTVHRCUVVWMlF5eFJRVUZKTEVkQlFVY3NTMEZCVFN4SlFVRkhMRTFCUVUwN1FVRkJTVHRCUVVVeFFpeFJRVUZKTEUxQlFVMHNUVUZCVFR0QlFVTmtMRmRCUVVzc1MwRkJTeXhMUVVGTE8wRkJRMllzVjBGQlN5eExRVUZMTzBGQlFVRXNaVUZEUkN4SlFVRkpPMEZCUTJJc1YwRkJTeXhMUVVGTkxFZEJRVVVzU1VGQlNTeEZRVUZGTEV0QlFVczdRVUZCUVN4WFFVTnVRanRCUVVOTUxGZEJRVXM3UVVGQlFUdEJRVWRRTEZGQlFVa3NTMEZCU3l4SFFVRkhPMEZCUTFZc1UwRkJSeXhMUVVGTE8wRkJRMUlzWVVGQlR6dEJRVUZCTEZkQlEwWTdRVUZIVEN4WFFVRkxMRXRCUVVzc1ZVRkJWU3hKUVVGSk8wRkJRM2hDTEZWQlFVazdRVUZIU2l4VlFVRkpMRTFCUVUwc1IwRkJSenRCUVVOWUxGbEJRVWs3UVVGRFNpeGhRVUZMTEVkQlFVYzdRVUZEVWp0QlFVZEJMR1ZCUVZFc1MwRkJTU3hOUVVGTkxFMUJRVTBzVFVGQlRTeExRVUZMTzBGQlEycERMR05CUVVrc1NVRkJTU3hQUVVGUkxFbEJRVWNzVFVGQlRUdEJRVU42UWl4aFFVRkhMRXRCUVVzc1NVRkJTU3hMUVVGTE8wRkJRMnBDTEdOQlFVa3NTVUZCU1N4TFFVRkxPMEZCUVVFN1FVRkhaaXhsUVVGUExFdEJRVXNzU1VGQlNUdEJRVUZCTEdGQlIxZzdRVUZIVEN4WlFVRkpMRTlCUVZFc1NVRkJSeXhMUVVGTExFdEJRVXM3UVVGRmVrSXNXVUZCU1N4SlFVRkpMRWRCUVVjN1FVRkRWQ3hsUVVGTExHZENRVUZuUWl4SlFVRkpMRWRCUVVjN1FVRkROVUlzWlVGQlN5eG5Ra0ZCWjBJc1NVRkJTU3hIUVVGSE8wRkJRelZDTEdWQlFVc3NSMEZCUnp0QlFVTlNMR1ZCUVVzc1IwRkJSenRCUVVGQk8wRkJSMVlzWVVGQlN6dEJRVU5NTEdOQlFVMHNSMEZCUnl4TlFVRk5MRWRCUVVjN1FVRkRiRUlzWlVGQlR5eEpRVUZKTzBGQlIxZ3NaVUZCVHl4UFFVRlBPMEZCUVVzc1kwRkJTU3hWUVVGVk8wRkJSV3BETEdGQlFVc3NSMEZCUnp0QlFVTlNMRmRCUVVjc1VVRkJVVHRCUVVOWUxHTkJRVTBzUjBGQlJ6dEJRVVZVTEZsQlFVa3NSMEZCUnl4TlFVRk5MRTlCUVU4N1FVRkJSeXhaUVVGRk8wRkJSWHBDTEZkQlFVYzdRVUZEUkN4alFVRkpPMEZCUjBvc1owSkJRVTBzVVVGQlVTeEpRVUZKTEV0QlFVc3NTVUZCU1R0QlFVY3pRaXhqUVVGSkxFMUJRVTBzUjBGQlJ6dEJRVWRZTEcxQ1FVRlBMRWxCUVVrN1FVRkRXQ3huUWtGQlNTeE5RVUZOTzBGQlFVMHNjVUpCUVU4c1QwRkJUeXhQUVVGUkxFdEJRVWtzVFVGQlRUdEJRVWRvUkN4blFrRkJTU3hQUVVGUExFMUJRVTA3UVVGVmFrSXNaMEpCUVVrc1NVRkJTU3hIUVVGSE8wRkJRMVFzYTBKQlFVa3NTMEZCU3p0QlFVRk5MRzlDUVVGSkxFOUJRVTg3UVVGSE1VSXNjVUpCUVU4c1owSkJRV2RDTEVsQlFVa3NSMEZCUnp0QlFVTTVRaXh6UWtGQlVTeExRVUZMTzBGQlEySXNjVUpCUVU4c1NVRkJTVHRCUVVkWUxHOUNRVUZOTEZGQlFWRXNUVUZCVFN4TFFVRkxMRTlCUVU4N1FVRkhhRU1zYTBKQlFVa3NUMEZCVHl4SFFVRkhPMEZCUTFvN1FVRkhRU3g1UWtGQlV5eE5RVUZOTEV0QlFVc3NVVUZCVVN4TFFVRkxMRWxCUVVrc1QwRkJUenRCUVVGQk8wRkJRVUVzYlVKQlJYcERPMEZCUzB3c2EwSkJRVWtzUzBGQlN6dEJRVUZITEhOQ1FVRk5MRWxCUVVrN1FVRkRkRUlzY1VKQlFVOHNSMEZCUnp0QlFVRkJPMEZCUjFvc2IwSkJRVkVzUzBGQlN6dEJRVU5pTEdkQ1FVRkpMRkZCUVZFN1FVRkJUU3h0UWtGQlN5eFJRVUZSTzBGQlJ5OUNMSEZDUVVGVExFdEJRVXNzVFVGQlRTeE5RVUZOTzBGQlJ6RkNMR2RDUVVGSkxFOUJRVThzU1VGQlNUdEJRVU5pTEhGQ1FVRlBMRWxCUVVrN1FVRkhXQ3h2UWtGQlRTeFJRVUZSTEVsQlFVa3NTMEZCU3l4SlFVRkpPMEZCUnpOQ0xHdENRVUZKTEUxQlFVMHNSMEZCUnp0QlFVTllPMEZCUjBFc2VVSkJRVk1zUzBGQlN5eExRVUZMTEU5QlFVOHNTMEZCU3l4SlFVRkpMRTFCUVUwN1FVRkJRVHRCUVVGQk8wRkJTVGRETEcxQ1FVRlBMRWxCUVVrN1FVRkJRU3h4UWtGRFJpeFJRVUZSTEVkQlFVYzdRVUZEY0VJN1FVRkRRU3hyUWtGQlRTeERRVUZETzBGQlFVRTdRVUZKVkN4aFFVRkhMRTlCUVU4N1FVRkhWaXhqUVVGSkxFOUJRVThzU1VGQlNTeEpRVUZKTzBGQlEycENMR2RDUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTzBGQlFVRXNhVUpCUTI1Q08wRkJRMHdzYTBKQlFVMHNRMEZCUXl4SFFVRkhPMEZCUTFZc2JVSkJRVTg3UVVGQlFUdEJRVUZCTEdsQ1FVZEVMRkZCUVU4c1RVRkJUU3hKUVVGSkxFOUJRVThzVjBGQlZ6dEJRVVUzUXl4bFFVRlBMRWxCUVVrc1QwRkJUenRCUVVGQk8wRkJTWEJDTEZWQlFVa3NRMEZCUXl4SFFVRkhPMEZCUVVrc1YwRkJSenRCUVVGQk8wRkJTV3BDTEZGQlFVa3NWMEZCVnl4SFFVRkhPMEZCUTJoQ0xGRkJRVVVzU1VGQlNUdEJRVU5PTEdkQ1FVRlZPMEZCUVVFc1YwRkRURHRCUVVkTUxGZEJRVXNzU1VGQlNTeEhRVUZITEVsQlFVa3NSMEZCUnl4SlFVRkpMRXRCUVVzc1NVRkJTU3hMUVVGTE8wRkJRVWs3UVVGRGVrTXNVVUZCUlN4SlFVRkpMRWxCUVVrc1NVRkJTU3hWUVVGVk8wRkJSWGhDTEdWQlFWTXNSMEZCUnl4TFFVRkxMRXRCUVVzc1JVRkJSU3hKUVVGSkxFbEJRVWtzU1VGQlNTeEpRVUZKTzBGQlFVRTdRVUZITVVNc1YwRkJUenRCUVVGQk8wRkJRVUU3UVVGVFZpeHJRa0ZCYTBJc1IwRkJSeXhKUVVGSkxFbEJRVWtzWVVGQllUdEJRVU42UXl4TlFVRkpMRkZCUVZFc1IwRkJSeXhIUVVGSExFZEJRVWNzU1VGQlNTeFRRVUZUTEVkQlFVY3NTVUZCU1N4TFFVTjJReXhQUVVGUExFVkJRVVU3UVVGSFdEdEJRVUZMTEZGQlFVa3NUVUZCVFN4TlFVRk5PMEZCUTI1Q0xGZEJRVXNzUlVGQlJUdEJRVWRRTEZWQlFVa3NRMEZCUXp0QlFVRkpMR1ZCUVU4N1FVRlhhRUlzVjBGQlN5eFRRVUZUTEVkQlFVY3NTVUZCU1N4SFFVRkhMRWxCUVVrc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGQlNUdEJRVU01UXl4VlFVRkpMRXRCUVVzN1FVRkhWQ3hWUVVGSkxFbEJRVWtzUjBGQlJ6dEJRVU5VTEdGQlFVczdRVUZEVEN4WlFVRkpPMEZCUTBvc1dVRkJTU3hIUVVGSExFMUJRVTA3UVVGSFlpeGhRVUZMTEVsQlFVa3NVVUZCVVN4SlFVRkpMRk5CUVZNc1NVRkJTU3hMUVVGTExFdEJRVXM3UVVGQlFTeGhRVU4yUXp0QlFVTk1MR05CUVUwc1MwRkJTeXhMUVVGTkxFdEJRVWtzUzBGQlN6dEJRVU14UWl4WlFVRkpMRWRCUVVjN1FVRkRVQ3haUVVGSkxFOUJRVThzUjBGQlJ6dEJRVU5hTEdOQlFVa3NZVUZCWVR0QlFVZG1MRzFDUVVGUExFOUJRVTg3UVVGQlRTeHBRa0ZCUnl4TFFVRkxPMEZCUXpWQ0xHZENRVUZKTEV0QlFVczdRVUZEVkN4eFFrRkJVenRCUVVOVUxHbENRVUZMTzBGQlEwd3NaMEpCUVVrc1NVRkJTU3hYUVVGWE8wRkJRVUVzYVVKQlEyUTdRVUZEVER0QlFVRkJPMEZCUVVFc1pVRkZSenRCUVVOTUxHTkJRVWtzU1VGQlNTeEhRVUZITzBGQlIxZ3NaVUZCU3l4VFFVRlRMRWRCUVVjc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGQlNUdEJRVWR1UXl4bFFVRkxPMEZCU1V3c1kwRkJTU3hKUVVGSkxGZEJRVmM3UVVGSGJrSXNaVUZCU3l4SlFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSkxGRkJRVkVzU1VGQlNTeFRRVUZUTEVsQlFVa3NTMEZCU3l4TFFVRkxPMEZCUVVFN1FVRkJRVHRCUVVzMVJDeHZRa0ZCWXl4bFFVRmxMRXRCUVVzc1MwRkRhRU1zUjBGQlJ5eE5RVUZOTEU5QlFVOHNWVUZCVnl4TFFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSkxGRkJRVkVzU1VGQlNTeFRRVUZUTEVsQlFVazdRVUZOZEVVc1owSkJRVlVzUzBGQlN5eEpRVU5XTEU5QlFVMHNaMEpCUVdsQ0xFOUJRVTBzUzBGQlN5eE5RVUZQTEVkQlFVVXNTVUZCU1N4SlFVRkpMRWxCUVVrc1RVRkRlRVFzUzBGQlN5eExRVUZMTEUxQlFVMHNTMEZCVFN4UFFVRk5MRXRCUVVzc1pVRkJaU3hOUVVGTkxFdEJSM0JFTEV0QlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTU3hSUVVGUkxFbEJRVWtzVTBGQlV5eExRVUZMTEVsQlFVa3NSMEZCUnl4TlFVRk5MRTFCUVUwc1MwRkJUU3hMUVVOMlJTeE5RVUZQTEVkQlFVVXNTVUZCU1N4SlFVRkpMRWxCUVVrN1FVRkZNMElzVlVGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXl4SFFVRkhMRWxCUVVrN1FVRkRjRUlzVjBGQlJ5eFRRVUZUTzBGQlExb3NXVUZCU1N4VFFVRlRPMEZCUjFnc1owSkJRVTBzUlVGQlJTeEpRVUZKTzBGQlIxb3NZVUZCUnl4TFFVRkxMRkZCUVZFc1NVRkJTeXhaUVVGWExFdEJRVXNzV1VGQldUdEJRVU5xUkN4WlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTk8wRkJRVUVzWlVGRFVqdEJRVWRNTEdGQlFVY3NTMEZCU3l4RlFVRkZMRWxCUVVrN1FVRkJRVHRCUVVkb1FpeGxRVUZQTzBGQlFVRTdRVUZKVkN4VlFVRkpMRXRCUVVzc1IwRkJSenRCUVVOV0xGZEJRVWNzVTBGQlV6dEJRVU5hTEZsQlFVazdRVUZEU2p0QlFVRkJMR0ZCUTBzN1FVRkRUQ3hYUVVGSExGTkJRVk1zVFVGQlRUdEJRVU5zUWl4WlFVRkpMRkZCUVZFc1NVRkJTU3hYUVVGWE8wRkJTVE5DTEZkQlFVY3NUMEZCVHl4SlFVRkpMRWxCUVVzc1MwRkJTU3hSUVVGUkxFbEJRVWtzVTBGQlV5eExRVUZMTEZGQlFWRXNTVUZCU1N4TFFVRkxMRXRCUVVzc1NVRkJTVHRCUVVGQk8wRkJSemRGTEZWQlFVa3NVMEZCVXp0QlFVTllMRzFDUVVGVE8wRkJSMUFzWTBGQlNTeFBRVUZQTEVkQlFVYzdRVUZIV2l4cFFrRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVUZITEVsQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRkJTVHRCUVVONlF5eG5Ra0ZCU1N4SFFVRkhMRTFCUVUwN1FVRkRZaXhwUWtGQlN5eEpRVUZKTEVkQlFVY3NTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRkJTVHRCUVVjNVFpeG5Ra0ZCU1N4TFFVRkxMRWRCUVVjN1FVRkRWaXhuUWtGQlJUdEJRVU5HTEd0Q1FVRkpMRWRCUVVjc1RVRkJUVHRCUVVGTkxHMUNRVUZITEV0QlFVczdRVUZCUVR0QlFVYzNRanRCUVVGQkxHbENRVU5MTzBGQlEwd3NaVUZCUnl4UlFVRlJPMEZCUTFnc1owSkJRVWtzUjBGQlJ5eFJRVUZSTzBGQlFVMDdRVUZEY2tJc1pVRkJSeXhUUVVGVE8wRkJRMW9zWjBKQlFVazdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRk5WaXhYUVVGTExFbEJRVWtzUjBGQlJ5eFJRVUZSTEVkQlFVY3NSVUZCUlN4UFFVRlBPMEZCUVVrc1YwRkJSenRCUVVGQk8wRkJSM3BETEUxQlFVa3NWVUZCVlR0QlFVZGFMRkZCUVVrc1JVRkJSU3hKUVVGSkxFdEJRVXNzVFVGQlRUdEJRVWR1UWl4UlFVRkZMRWxCUVVrN1FVRkRUaXhSUVVGRkxFbEJRVWs3UVVGQlFTeGxRVWRITEVWQlFVVXNTVUZCU1N4TFFVRkxMRTFCUVUwN1FVRkhNVUlzVVVGQlJTeEpRVUZKTzBGQlEwNHNVVUZCUlN4SlFVRkpMRU5CUVVNN1FVRkJRVHRCUVVGQk8wRkJTMWdzVTBGQlR6dEJRVUZCTzBGQlNWUXNkMEpCUVhkQ0xFZEJRVWNzVDBGQlR5eEpRVUZKTzBGQlEzQkRMRTFCUVVrc1EwRkJReXhGUVVGRk8wRkJRVmtzVjBGQlR5eHJRa0ZCYTBJN1FVRkROVU1zVFVGQlNTeEhRVU5HTEVsQlFVa3NSVUZCUlN4SFFVTk9MRTFCUVUwc1pVRkJaU3hGUVVGRkxFbEJRM1pDTEUxQlFVMHNTVUZCU1R0QlFVVmFMRTFCUVVrc1QwRkJUenRCUVVOVUxGRkJRVWtzVFVGQlR5eExRVUZKTEV0QlFVc3NUMEZCVHl4SFFVRkhPMEZCUXpWQ0xGbEJRVTBzU1VGQlNTeFBRVUZQTEV0QlFVc3NUVUZCVFN4SlFVRkpMRTFCUVUwc1MwRkJTeXhqUVVGak8wRkJRVUVzWlVGRGFFUXNUVUZCVFN4SFFVRkhPMEZCUTJ4Q0xGbEJRVTBzU1VGQlNTeFBRVUZQTEV0QlFVc3NUVUZCVFN4SlFVRkpMRTFCUVUwN1FVRkJRVHRCUVVkNFF5eFZRVUZOTEUxQlFVOHNSMEZCUlN4SlFVRkpMRWxCUVVrc1RVRkJUU3hSUVVGUkxFVkJRVVU3UVVGQlFTeGhRVU01UWl4SlFVRkpMRWRCUVVjN1FVRkRhRUlzVlVGQlRTeFBRVUZQTEdOQlFXTXNRMEZCUXl4SlFVRkpMRXRCUVVzN1FVRkRja01zVVVGQlNTeE5RVUZQTEV0QlFVa3NTMEZCU3l4UFFVRlBPMEZCUVVjc1lVRkJUeXhqUVVGak8wRkJRVUVzWVVGRE1VTXNTMEZCU3l4TFFVRkxPMEZCUTI1Q0xGZEJRVThzWTBGQll5eEpRVUZKTEVsQlFVazdRVUZETjBJc1VVRkJTU3hOUVVGUExFdEJRVWtzUzBGQlN5eEpRVUZKTEV0QlFVczdRVUZCUnl4WlFVRk5MRTFCUVUwc1RVRkJUU3hqUVVGak8wRkJRVUVzVTBGRE0wUTdRVUZEVEN4UlFVRkxMRXRCUVVrc1NVRkJTU3hMUVVGTE8wRkJRVXNzV1VGQlRTeEpRVUZKTEUxQlFVMHNSMEZCUnl4TFFVRkxMRTFCUVUwc1NVRkJTU3hOUVVGTk8wRkJReTlFTEZGQlFVa3NUVUZCVHl4TFFVRkpMRXRCUVVzc1QwRkJUeXhIUVVGSE8wRkJRelZDTEZWQlFVa3NTVUZCU1N4TlFVRk5PMEZCUVVzc1pVRkJUenRCUVVNeFFpeGhRVUZQTEdOQlFXTTdRVUZCUVR0QlFVRkJPMEZCU1hwQ0xGTkJRVTg3UVVGQlFUdEJRVXRVTERKQ1FVRXlRaXhSUVVGUkxFZEJRVWM3UVVGRGNFTXNUVUZCU1N4SlFVRkpMRTlCUVU4N1FVRkhaaXhQUVVGTkxFdEJRVXNzVlVGQlZTeExRVUZMTEVsQlFVa3NTMEZCU3p0QlFVRkpPMEZCUTNaRExGTkJRVTg3UVVGQlFUdEJRVWxVTEdsQ1FVRnBRaXhOUVVGTkxFbEJRVWtzU1VGQlNUdEJRVU0zUWl4TlFVRkpMRXRCUVVzc1owSkJRV2RDTzBGQlIzWkNMR1ZCUVZjN1FVRkRXQ3hSUVVGSk8wRkJRVWtzVjBGQlN5eFpRVUZaTzBGQlEzcENMRlZCUVUwc1RVRkJUVHRCUVVGQk8wRkJSV1FzVTBGQlR5eFRRVUZUTEVsQlFVa3NTMEZCU3l4UFFVRlBMRWxCUVVrc1IwRkJSenRCUVVGQk8wRkJTWHBETEdWQlFXVXNUVUZCVFN4SlFVRkpMRWxCUVVrN1FVRkRNMElzVFVGQlNTeExRVUZMTzBGQlFXTXNWVUZCVFN4TlFVRk5PMEZCUTI1RExGTkJRVThzVTBGQlV5eEpRVUZKTEV0QlFVc3NTMEZCU3l4SlFVRkpMRWxCUVVrN1FVRkJRVHRCUVVsNFF5eHpRa0ZCYzBJc1VVRkJVVHRCUVVNMVFpeE5RVUZKTEVsQlFVa3NUMEZCVHl4VFFVRlRMRWRCUTNSQ0xFMUJRVTBzU1VGQlNTeFhRVUZYTzBGQlJYWkNMRTFCUVVrc1QwRkJUenRCUVVkWUxFMUJRVWtzUjBGQlJ6dEJRVWRNTEZkQlFVOHNTVUZCU1N4TlFVRk5MRWRCUVVjc1MwRkJTenRCUVVGSk8wRkJSemRDTEZOQlFVc3NTVUZCU1N4UFFVRlBMRWxCUVVrc1MwRkJTeXhKUVVGSkxFdEJRVXM3UVVGQlNUdEJRVUZCTzBGQlIzaERMRk5CUVU4N1FVRkJRVHRCUVVsVUxIVkNRVUYxUWl4SFFVRkhPMEZCUTNoQ0xFMUJRVWtzUzBGQlN6dEJRVU5VTEZOQlFVODdRVUZCVFN4VlFVRk5PMEZCUTI1Q0xGTkJRVTg3UVVGQlFUdEJRVmRVTEdkQ1FVRm5RaXhOUVVGTkxFZEJRVWNzUjBGQlJ5eEpRVUZKTzBGQlF6bENMRTFCUVVrc1lVRkRSaXhKUVVGSkxFbEJRVWtzUzBGQlN5eEpRVWxpTEVsQlFVa3NTMEZCU3l4TFFVRkxMRXRCUVVzc1YwRkJWenRCUVVWb1F5eGhRVUZYTzBGQlJWZ3NZVUZCVXp0QlFVTlFMRkZCUVVrc1NVRkJTU3hIUVVGSE8wRkJRMVFzVlVGQlNTeEZRVUZGTEUxQlFVMDdRVUZEV2l4VlFVRkpMRk5CUVZNc1JVRkJSU3hIUVVGSE8wRkJRVWtzYzBKQlFXTTdRVUZCUVR0QlFVZDBReXhSUVVGSkxGVkJRVlVzU1VGQlNUdEJRVU5zUWl4UlFVRkpMRTFCUVUwc1IwRkJSenRCUVVkWUxGVkJRVWtzUlVGQlJTeEZRVUZGTEZOQlFWTTdRVUZEYWtJc1ZVRkJTU3hsUVVGbExFVkJRVVVzUlVGQlJTeFBRVUZQTzBGQlFVY3NWVUZCUlN4RlFVRkZMRVZCUVVVN1FVRkRka003UVVGQlFUdEJRVWRHTEZGQlFVa3NSVUZCUlN4TlFVRk5PMEZCUTFvc1lVRkJVeXhGUVVGRkxFZEJRVWM3UVVGQlFUdEJRVWRvUWl4aFFVRlhPMEZCUlZnc1UwRkJUenRCUVVGQk8wRkJTVlFzWlVGQlpTeEhRVUZITzBGQlEyaENMRk5CUVU4c1JVRkJSU3hGUVVGRkxFVkJRVVVzUlVGQlJTeFRRVUZUTEV0QlFVczdRVUZCUVR0QlFVOHZRaXhyUWtGQmEwSXNUVUZCVFN4TlFVRk5MRTFCUVUwN1FVRkRiRU1zVFVGQlNTeEhRVU5HTEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1MwRkRiRUlzU1VGQlNUdEJRVVZPTEZOQlFVOHNSVUZCUlN4SlFVRkpMRXRCUVVzc1ZVRkJVenRCUVVONlFpeFJRVUZKTEVsQlFVa3NTMEZCU3l4TFFVRkxPMEZCUTJ4Q0xGRkJRVWtzUTBGQlF5eEZRVUZGTEVkQlFVYzdRVUZEVWl4VlFVRkpPMEZCUTBvN1FVRkJRU3hsUVVOVExFVkJRVVVzVFVGQlRTeEpRVUZKTzBGQlEzSkNMRlZCUVVrN1FVRkJRVHRCUVVGQk8wRkJTVklzVTBGQlR6dEJRVUZCTzBGQmJVTlVMRFJDUVVFMFFpeEhRVUZITEVsQlFVazdRVUZEYWtNc1RVRkJTU3hoUVVGaExFOUJRVThzUjBGQlJ5eE5RVUZMTEV0QlFVc3NSMEZCUnl4TFFVTjBReXhOUVVGTkxFZEJRMDRzU1VGQlNTeEhRVU5LTEVsQlFVa3NSMEZEU2l4UFFVRlBMRVZCUVVVc1lVRkRWQ3hMUVVGTExFdEJRVXNzVlVGRFZpeExRVUZMTEV0QlFVczdRVUZIV2l4TlFVRkpMRU5CUVVNc1JVRkJSU3hMUVVGTExFTkJRVU1zUlVGQlJTeEZRVUZGTEUxQlFVMHNSVUZCUlN4SlFVRkpMRWxCUVVrN1FVRkZMMElzVjBGQlR5eEpRVUZKTEV0QlFVc3NSVUZCUlN4SlFVTmtMRU5CUVVNc1JVRkJSU3hGUVVGRkxFdEJRVXNzU1VGQlNTeEZRVUZGTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkRhRU1zUlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSk8wRkJRVUU3UVVGSGJFTXNUVUZCU1N4TlFVRk5MRTFCUVUwN1FVRkRaQ3hsUVVGWE8wRkJRMWdzVlVGQlRUdEJRVUZCTEZOQlEwUTdRVUZEVEN4VlFVRk5PMEZCUVVFN1FVRkhVaXhOUVVGSkxFbEJRVWtzUzBGQlN6dEJRVWRpTEZOQlFVOHNSVUZCUlN4SlFVRkpMRWxCUVVrN1FVRkhaaXhSUVVGSkxFVkJRVVVzVFVGQlRUdEJRVU5hTEZOQlFVczdRVUZCUVR0QlFVdFFMRlZCUVZFc1MwRkJTeXhKUVVGSkxGRkJRVkVzUjBGQlJ5eE5RVUZOTEV0QlFVc3NUMEZCVHl4SlFVRkpMRWxCUVVrN1FVRkRkRVFzVTBGQlR6dEJRVU5RTEdkQ1FVRmpMRTlCUVUwc1RVRkJUU3hKUVVGSkxFdEJRVXM3UVVGRGJrTXNUMEZCU3l4WlFVRlpPMEZCUldwQ0xHRkJRVk03UVVGRFVDeFhRVUZOTEZOQlFWTXNTMEZCU1N4TlFVRk5MRWxCUVVrc1MwRkJTenRCUVVOc1F5eHJRa0ZCWXl4WlFVRlpMRTFCUVUwc1JVRkJSVHRCUVVOc1F5eFJRVUZKTEVsQlFVa3NTMEZCU3l4UFFVRlBMRTFCUVVzc1lVRkJZU3hMUVVGTE8wRkJSVE5ETEZGQlFVa3NaVUZCWlN4RlFVRkZMRWRCUVVjc1RVRkJUU3hIUVVGSExGTkJRVk1zWlVGQlpTeEpRVUZKTEVkQlFVY3NUVUZCVFN4SFFVRkhMRTFCUVUwN1FVRkROMFVzVlVGQlNUdEJRVU5LTEdGQlFVODdRVUZCU3l4alFVRk5MRk5CUVZNc1NVRkJTU3hOUVVGTkxFMUJRVTBzUzBGQlN6dEJRVTlvUkN4VlFVRkpMRTFCUVUwc1RVRkJUVHRCUVVWa0xGbEJRVWtzVFVGQlRTeExRVUZMTEc5Q1FVRnZRaXhKUVVGSkxFZEJRVWNzVFVGQlRTeFBRVUZQTEVsQlFVa3NUVUZCVFR0QlFVTXZSQ3hsUVVGTExGbEJRVmtzVDBGQlR6dEJRVU40UWl4M1FrRkJZeXhQUVVGTkxFbEJRVWtzU1VGQlNTeExRVUZMTzBGQlEycERMR05CUVVrN1FVRkRTanRCUVVGQkxHVkJRMHM3UVVGRFRDeHBRa0ZCVHl4VFFVRlRMRXRCUVVzc1MwRkJTeXhaUVVGWkxFbEJRVWtzU1VGQlNTeFhRVUZYTzBGQlFVRTdRVUZCUVN4aFFVVjBSRHRCUVVOTUxHRkJRVXNzV1VGQldUdEJRVU5xUWl4bFFVRlBPMEZCUVVFN1FVRkJRVHRCUVVsWUxGVkJRVTA3UVVGQlFUdEJRVUZCTzBGQmIwSldMREJDUVVFd1FpeEhRVUZITEVsQlFVazdRVUZETDBJc1RVRkJTU3hIUVVGSExFbEJRVWtzWVVGQllTeEhRVUZITEZkQlFWY3NTMEZCU3l4TFFVRkxMRWRCUVVjc1MwRkJTeXhKUVVGSkxFbEJRekZFTEVsQlFVa3NSMEZEU2l4UlFVRlJMRWxCUTFJc1NVRkJTU3hIUVVOS0xFdEJRVXNzUlVGQlJTeEhRVU5RTEU5QlFVOHNSVUZCUlN4aFFVTlVMRXRCUVVzc1MwRkJTeXhWUVVOV0xFdEJRVXNzUzBGQlN6dEJRVWRhTEUxQlFVa3NSVUZCUlN4SlFVRkpMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNSVUZCUlN4TFFVRkxMRWRCUVVjc1RVRkJUU3hMUVVGTExFZEJRVWNzVlVGQlZTeEhRVUZITzBGQlEzQkZMRmRCUVU4c1NVRkJTU3hMUVVGTExFMUJRVTBzUTBGQlF5eEhRVUZITEV0QlFVc3NTMEZCU3l4SlFVRkpMRVZCUVVVc1MwRkJTeXhKUVVGSkxFMUJRVTBzUzBGQlN5eEpRVUZKTzBGQlFVRTdRVUZIY0VVc1RVRkJTU3hOUVVGTkxFMUJRVTA3UVVGRFpDeGxRVUZYTzBGQlExZ3NWVUZCVFR0QlFVRkJMRk5CUTBRN1FVRkRUQ3hWUVVGTk8wRkJRVUU3UVVGSFVpeFBRVUZMTEZsQlFWa3NUMEZCVHp0QlFVTjRRaXhOUVVGSkxHVkJRV1U3UVVGRGJrSXNUMEZCU3l4RlFVRkZMRTlCUVU4N1FVRkZaQ3hOUVVGSkxFdEJRVXNzU1VGQlNTeEpRVUZKTEVWQlFVVXNTMEZCU3l4UFFVRlJPMEZCWVRsQ0xGZEJRVThzUzBGQlN5eExRVUZMTEUxQlFVMHNTMEZCU3l4TlFVRk5MRXRCUVVzc1JVRkJSU3hQUVVGUExFdEJRVXNzUjBGQlJ6dEJRVU4wUkN4VlFVRkpMRVZCUVVVc1RVRkJUVHRCUVVOYUxGVkJRVWtzWlVGQlpTeEZRVUZGTzBGQlEzSkNMRmRCUVVzc1JVRkJSU3hQUVVGUE8wRkJRMlE3UVVGQlFUdEJRVWRHTEZGQlFVa3NSVUZCUlR0QlFVVk9MRkZCUVVrc1MwRkJTeXhIUVVGSE8wRkJRMVlzVlVGQlNTeEpRVUZKTEV0QlFVc3NUMEZCVHp0QlFVTndRanRCUVVGQkxGZEJRMHM3UVVGRFRDeFZRVUZKTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTFCUVUwc1JVRkJSU3hOUVVGTk8wRkJRVUU3UVVGQlFTeFRRVVUzUWp0QlFVdE1MRkZCUVVrc1VVRkJVU3hOUVVGTkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEUxQlFVMHNTVUZCU1R0QlFVTjZReXhSUVVGSkxHbENRVUZwUWl4SlFVRkpMRXRCUVVzc1MwRkJTeXhOUVVGTkxFVkJRVVVzVFVGQlRTeExRVUZMTEUxQlFVMHNUMEZCVHl4TFFVRkxPMEZCUTNoRkxGTkJRVXNzV1VGQldUdEJRVVZxUWl4WFFVRlBMRTFCUVUwc1QwRkJUeXhUUVVGVExFZEJRVWNzU1VGQlNTeEpRVUZKTEZkQlFWY3NVVUZCVVR0QlFVRkJPMEZCU1RkRUxFOUJRVXM3UVVGTFRDeFJRVUZOTEZsQlFWa3NTVUZCU1N4UFFVRlBMRVZCUVVVc1RVRkJUU3hKUVVGSkxFVkJRVVVzUzBGQlN5eEpRVUZKTEV0QlFVczdRVUZEZWtRc1QwRkJTeXhUUVVGVExFVkJRVVVzVFVGQlRTeEpRVUZKTEV0QlFVczdRVUZETDBJc1owSkJRV003UVVGRlpDeGhRVUZUTzBGQlExQXNaMEpCUVZrc1UwRkJVeXhWUVVGVkxFMUJRVTBzUzBGQlN5eExRVUZMTzBGQlF5OURMRkZCUVVrc1NVRkJTU3hMUVVGTExFOUJRVThzVjBGQlZ5eEpRVUZKTEV0QlFVc3NZMEZCWXl4TFFVRkxPMEZCUlRORUxGRkJRVWtzWlVGQlpTeEZRVUZGTEVkQlFVY3NUVUZCVFN4SFFVRkhMRk5CUVZNc1pVRkJaU3hKUVVGSkxFZEJRVWNzVFVGQlRTeEhRVUZITEUxQlFVMDdRVUZETjBVc1dVRkJUU3hKUVVGSkxFMUJRVTA3UVVGSmFFSXNWVUZCU1N4TlFVRk5PMEZCUVVjc1kwRkJUU3hKUVVGSkxFdEJRVXNzVVVGQlVTeE5RVUZOTEUxQlFVMHNSMEZCUnl4SlFVRkpMRTFCUVUwc1NVRkJTVHRCUVVOcVJTeFpRVUZOTEU5QlFVOHNTMEZCU3l4SlFVRkpMRXRCUVVzc1NVRkJTU3hMUVVGTE8wRkJVWEJETEZWQlFVa3NUVUZCVFN4TlFVRk5PMEZCUTJRc1dVRkJTU3h2UWtGQmIwSXNTVUZCU1N4SFFVRkhMRTFCUVUwc1QwRkJUeXhKUVVGSkxFMUJRVTA3UVVGRGNFUXNaVUZCU3l4WlFVRlpMRTlCUVU4N1FVRkRlRUlzWTBGQlNTeFpRVUZaTEVsQlFVa3NUMEZCVHl4SFFVRkhMRTFCUVUwc1NVRkJTU3hIUVVGSExFdEJRVXNzU1VGQlNTeExRVUZMTzBGQlEzcEVMR1ZCUVVzc1UwRkJVeXhGUVVGRkxFMUJRVTBzU1VGQlNTeExRVUZMTzBGQlF5OUNMSGRDUVVGakxFMUJRVTA3UVVGQlFTeGxRVU5tTzBGQlEwd3NhVUpCUVU4c1UwRkJVeXhMUVVGTExFdEJRVXNzV1VGQldTeEpRVUZKTEVsQlFVa3NWMEZCVnp0QlFVRkJPMEZCUVVFc1lVRkZkRVE3UVVGRFRDeGhRVUZMTEZsQlFWazdRVUZEYWtJc1pVRkJUenRCUVVGQk8wRkJRVUU3UVVGSldDeFZRVUZOTzBGQlEwNHNiVUpCUVdVN1FVRkJRVHRCUVVGQk8wRkJUVzVDTERKQ1FVRXlRaXhIUVVGSE8wRkJSVFZDTEZOQlFVOHNUMEZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSU3hKUVVGSk8wRkJRVUU3UVVGUE5VSXNjMEpCUVhOQ0xFZEJRVWNzUzBGQlN6dEJRVU0xUWl4TlFVRkpMRWRCUVVjc1IwRkJSenRCUVVkV0xFMUJRVXNzUzBGQlNTeEpRVUZKTEZGQlFWRXNVVUZCVVR0QlFVRkpMRlZCUVUwc1NVRkJTU3hSUVVGUkxFdEJRVXM3UVVGSGVFUXNUVUZCU3l4TFFVRkpMRWxCUVVrc1QwRkJUeXhUUVVGVExFZEJRVWM3UVVGSE9VSXNVVUZCU1N4SlFVRkpPMEZCUVVjc1ZVRkJTVHRCUVVObUxGTkJRVXNzUTBGQlF5eEpRVUZKTEUxQlFVMHNTVUZCU1R0QlFVTndRaXhWUVVGTkxFbEJRVWtzVlVGQlZTeEhRVUZITzBGQlFVRXNZVUZEWkN4SlFVRkpMRWRCUVVjN1FVRkhhRUlzVVVGQlNTeEpRVUZKTzBGQlFVRTdRVUZKVml4UFFVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxGZEJRVmNzVDBGQlR5eEpRVUZKTzBGQlFVazdRVUZITVVNc1QwRkJTeXhOUVVGTkxFbEJRVWtzVVVGQlVTeEpRVUZKTEZkQlFWY3NUVUZCVFN4UFFVRlBMRWxCUVVrc1JVRkJSVHRCUVVGSk8wRkJRemRFTEZGQlFVMHNTVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkZia0lzVFVGQlNTeExRVUZMTzBGQlExQXNWMEZCVHp0QlFVTlFMRTFCUVVVc1NVRkJTU3hKUVVGSkxFbEJRVWtzU1VGQlNUdEJRVU5zUWl4TlFVRkZMRWxCUVVrN1FVRk5UaXhSUVVGTExFdEJRVWtzUzBGQlN6dEJRVU5rTEZGQlFVa3NTVUZCU1R0QlFVRkhMRmRCUVVzN1FVRkZhRUlzVVVGQlNTeEpRVUZKTEV0QlFVczdRVUZEV0N4VlFVRkpPMEZCUVVjc1ZVRkJSU3hGUVVGRkxFdEJRVXNzUTBGQlF5eEpRVUZKTEUxQlFVMHNSMEZCUnp0QlFVTTVRaXhYUVVGTExFOUJRVThzVlVGQlZTeEpRVUZKTzBGQlFVMHNWVUZCUlN4RlFVRkZMRXRCUVVzc1EwRkJReXhKUVVGSkxFMUJRVTBzUjBGQlJ5eExRVUZMTzBGQlF6VkVMRmxCUVUwc1NVRkJTU3hOUVVGTk8wRkJRMmhDTEZWQlFVa3NWMEZCVnl4SlFVRkpPMEZCUVVFc1YwRkRaRHRCUVVOTUxGZEJRVXM3UVVGQlFUdEJRVWRRTEZkQlFVODdRVUZCVFN4aFFVRlBPMEZCUTNCQ0xFMUJRVVVzUlVGQlJTeExRVUZMTEVOQlFVTTdRVUZGVml4UlFVRkpMRlZCUVZVN1FVRkhXaXhWUVVGSkxFVkJRVVVzU1VGQlNTeEZRVUZGTEZsQlFWa3NUVUZCVFR0QlFVYzFRaXhWUVVGRkxFbEJRVWs3UVVGRFRpeFZRVUZGTEVsQlFVazdRVUZCUVN4cFFrRkhSeXhGUVVGRkxFbEJRVWtzUlVGQlJTeFpRVUZaTEUxQlFVMDdRVUZIYmtNc1ZVRkJSU3hKUVVGSk8wRkJRMDRzVlVGQlJTeEpRVUZKTEVOQlFVTTdRVUZCUVR0QlFVRkJPMEZCUVVFc1UwRkpUanRCUVVkTUxFMUJRVVVzU1VGQlNUdEJRVU5PTEUxQlFVVXNTVUZCU1N4RFFVRkRPMEZCUVVFN1FVRkhWQ3hUUVVGUE8wRkJRVUU3UVVGUFZDeHZRa0ZCYjBJc1IwRkJSeXhMUVVGTE8wRkJRekZDTEUxQlFVa3NUVUZCVFN4TlFVRk5MRk5CUVZNc1IwRkJSeXhUUVVGVExFdEJRVXNzUjBGQlJ5eEpRVUZKTzBGQlJXcEVMRTFCUVVrc1VVRkJVU3hqUVVGakxGRkJRVkVzVDBGQlR6dEJRVU4yUXl4UlFVRkpMRU5CUVVNc1EwRkJRenRCUVVGTExGRkJRVVVzU1VGQlNUdEJRVU5xUWl4TlFVRkZMRWxCUVVrN1FVRkRUaXhOUVVGRkxFbEJRVWs3UVVGRFRpeFhRVUZQTzBGQlFVRTdRVUZIVkN4TlFVRkpMRTFCUVUwc1MwRkJTeXhOUVVGUE8wRkJRM0JDTEZkQlFVODdRVUZEVUN4VlFVRk5MRWxCUVVrN1FVRkJRU3hoUVVORUxGTkJRVk1zUzBGQlN5eE5RVUZQTzBGQlF6bENMRmRCUVU4N1FVRkJRU3hoUVVORkxGRkJRVkVzUzBGQlN5eE5RVUZQTzBGQlF6ZENMRmRCUVU4N1FVRkJRU3hUUVVOR08wRkJRMHdzVlVGQlRTeE5RVUZOTEd0Q1FVRnJRanRCUVVGQk8wRkJTV2hETEUxQlFVa3NTVUZCU1N4UFFVRlBPMEZCUldZc1RVRkJTU3hKUVVGSkxFZEJRVWM3UVVGRFZDeFJRVUZKTEVOQlFVTXNTVUZCU1N4TlFVRk5MRWxCUVVrN1FVRkRia0lzVlVGQlRTeEpRVUZKTEZWQlFWVXNSMEZCUnp0QlFVRkJMRk5CUTJ4Q08wRkJRMHdzVlVGQlRTeEpRVUZKTEUxQlFVMDdRVUZCUVR0QlFVdHNRaXhOUVVGSkxFbEJRVWtzVVVGQlVUdEJRVU5vUWl4WlFVRlZMRXRCUVVzN1FVRkRaaXhUUVVGUExFVkJRVVU3UVVGRlZDeE5RVUZKTEZOQlFWTTdRVUZEV0N4VlFVRk5MRWxCUVVrc1VVRkJVU3hMUVVGTE8wRkJRM1pDTEZWQlFVMHNTVUZCU1R0QlFVTldMRkZCUVVrc1RVRkJUVHRCUVVkV0xHTkJRVlVzVDBGQlR5eE5RVUZOTEVsQlFVa3NTMEZCU3l4UFFVRlBMRWRCUVVjc1NVRkJTVHRCUVVGQk8wRkJSMmhFTEU5QlFVc3NXVUZCV1N4TFFVRkxMRTFCUVUwN1FVRkROVUlzVDBGQlN5eEhRVUZITEZOQlFWTTdRVUZIYWtJc1QwRkJTeXhKUVVGSkxFbEJRVWtzUjBGQlJ5eFBRVUZQTEVkQlFVY3NSVUZCUlR0QlFVRkhMRTlCUVVjN1FVRkRiRU1zVFVGQlNTeEpRVUZKTzBGQlFVY3NWMEZCVHl4SlFVRkpMRXRCUVVzc1JVRkJSU3hKUVVGSk8wRkJRMnBETEVsQlFVVXNTVUZCU1N4clFrRkJhMElzU1VGQlNUdEJRVU0xUWl4SlFVRkZMRWxCUVVrN1FVRkRUaXhoUVVGWE8wRkJVVmdzVFVGQlNUdEJRVUZUTEZGQlFVa3NUMEZCVHl4SFFVRkhMRk5CUVZNc1RVRkJUVHRCUVVjeFF5eE5RVUZKTzBGQlFVY3NVVUZCU1N4RlFVRkZMRTFCUVUwc1MwRkJTeXhKUVVGSkxFdEJRVXNzUzBGQlN5eFJRVUZSTEVkQlFVY3NTMEZCU3l4UlFVRlJMRWxCUVVrc1IwRkJSenRCUVVOeVJTeGhRVUZYTzBGQlJWZ3NVMEZCVHp0QlFVRkJPMEZCVTFRc1kwRkJZeXhOUVVGTkxFZEJRVWM3UVVGRGNrSXNUVUZCU1N4SFFVTkdMRTFCUVUwc1JVRkJSU3hGUVVGRk8wRkJSVm9zVFVGQlNTeE5RVUZOTzBGQlFVY3NWMEZCVHl4aFFVRmhMRTFCUVUwc1IwRkJSeXhIUVVGSE8wRkJUemRETEUxQlFVa3NUVUZCVFN4TFFVRkxMRXRCUVVzN1FVRkRjRUlzVFVGQlNTeEpRVUZKTEV0QlFVc3NTMEZCU3l4SlFVRkpPMEZCUlhSQ0xFMUJRVWtzUlVGQlJTeE5RVUZOTEVsQlFVa3NVVUZCVVN4SFFVRkhPMEZCUXpOQ0xFMUJRVWtzWVVGQllTeE5RVUZOTEVkQlFVY3NSMEZCUnp0QlFVYzNRaXhOUVVGSkxGRkJRMFlzUzBGQlN5eEpRVUZKTEV0QlFVc3NTVUZEWkN4TlFVRk5MRWxCUVVrc1MwRkJTeXhMUVVObUxFMUJRVTBzU1VGQlNTeExRVUZMTzBGQlEycENMRk5CUVU4c1QwRkJUVHRCUVVOWUxHRkJRVk1zUlVGQlJTeE5RVUZOTzBGQlEycENMRkZCUVVrc1JVRkJSU3hOUVVGTkxFZEJRVWNzUzBGQlN5eFBRVUZQTEUxQlFVMHNTVUZCU1N4TlFVRk5MRkZCUVZFc1RVRkJUVHRCUVVGQk8wRkJSek5FTEZOQlFVODdRVUZCUVR0QlFVdFVMSE5DUVVGelFpeE5RVUZOTEVkQlFVY3NSMEZCUnl4SFFVRkhMR05CUVdNN1FVRkRha1FzVFVGQlNTeEhRVUZITEVkQlFVY3NSMEZCUnl4SlFVTllMRWxCUVVrc1IwRkRTaXhMUVVGTExFdEJRVXNzVjBGRFZpeEpRVUZKTEV0QlFVc3NTMEZCU3l4TFFVRkxPMEZCUlhKQ0xHRkJRVmM3UVVGRFdDeFBRVUZMTEVWQlFVVXNUVUZCVFR0QlFVTmlMRTFCUVVrc1NVRkJTU3hMUVVGTE8wRkJSV0lzWVVGQlV6dEJRVU5RTEZGQlFVa3NUMEZCVHl4RlFVRkZMRTFCUVUwc1MwRkJTeXhKUVVGSkxFdEJRVXNzVFVGQlRTeE5RVUZOTEVsQlFVazdRVUZEYWtRc1VVRkJTU3hsUVVGbExFVkJRVVVzUzBGQlN5eExRVUZMTEVWQlFVVXNUVUZCVFR0QlFVTjJReXhSUVVGSkxFOUJRVThzUlVGQlJTeE5RVUZOTEV0QlFVc3NTVUZCU1N4TFFVRkxMRTFCUVUwc1RVRkJUU3hKUVVGSk8wRkJRMnBFTEZGQlFVa3NSVUZCUlN4TFFVRkxPMEZCUlZnc1VVRkJTU3hGUVVGRkxFVkJRVVVzVDBGQlR5eFJRVUZSTzBGQlEzSkNMRmRCUVVzc1NVRkJTU3hIUVVGSExFVkJRVVVzUlVGQlJTeFBRVUZQTEVWQlFVVXNSVUZCUlN4TlFVRk5PMEZCUVVzN1FVRkRkRU1zVlVGQlNTeExRVUZMTzBGQlFVazdRVUZCUVR0QlFVZG1MRkZCUVVrN1FVRkRTaXhSUVVGSk8wRkJRMG9zVVVGQlNUdEJRVU5LTEZGQlFVazdRVUZEU2p0QlFVRkJPMEZCUjBZc1lVRkJWenRCUVVOWUxFbEJRVVVzUlVGQlJTeFRRVUZUTEVsQlFVazdRVUZGYWtJc1UwRkJUenRCUVVGQk8wRkJTMVFzYVVKQlFXbENMRWRCUVVjc1IwRkJSenRCUVVOeVFpeE5RVUZKTEVsQlFVazdRVUZEVWl4VFFVRlBMRVZCUVVVN1FVRkJSeXhUUVVGTE8wRkJRMnBDTEZOQlFVODdRVUZCUVR0QlFVdFVMREJDUVVFd1FpeE5RVUZOTEVkQlFVYzdRVUZEYWtNc1RVRkJTU3hIUVVOR0xGRkJRVkVzUlVGQlJTeEpRVUZKTEVkQlEyUXNTMEZCU3l4TlFVRk5MRTFCUVUwc1MwRkJTeXhYUVVGWExFbEJRMnBETEZOQlFWTXNSMEZCUnl4TlFVRk5PMEZCUlhCQ0xFMUJRVWtzUlVGQlJUdEJRVVZPTEUxQlFVa3NSVUZCUlN4SlFVRkpMRk5CUVZNN1FVRkRha0lzWlVGQlZ5eFJRVUZSTEVsQlFVazdRVUZEZGtJc1YwRkJUenRCUVVGQk8wRkJSMVFzVFVGQlNTeEZRVUZGTEZOQlFWTTdRVUZGWml4TlFVRkpMRVZCUVVVc1ZVRkJWVHRCUVVOa0xHVkJRVmNzVVVGQlVTeEpRVUZKTzBGQlFVRXNVMEZEYkVJN1FVRkRUQ3hSUVVGSkxFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMDdRVUZIY0VJc1VVRkJTU3hGUVVGRkxFbEJRVWtzVTBGQlV6dEJRVU5xUWl4cFFrRkJWeXhOUVVGTkxFdEJRVTBzVVVGQlVTeEpRVUZKTEVsQlFVMHNVVUZCVVN4SlFVRkpPMEZCUTNKRUxHRkJRVTg3UVVGQlFUdEJRVWRVTEdWQlFWY3NUVUZCVFN4TFFVRk5MRkZCUVZFc1NVRkJTU3hKUVVGTkxGRkJRVkVzU1VGQlNUdEJRVUZCTzBGQlIzWkVMRk5CUVU4c1JVRkJSU3hOUVVGTkxFbEJRVWs3UVVGQlFUdEJRVk55UWl4M1FrRkJkMElzUjBGQlJ5eFRRVUZUTEVsQlFVa3NTVUZCU1R0QlFVTXhReXhOUVVGSkxFMUJRVTBzUjBGQlJ5eEhRVUZITEVkQlFVY3NTMEZCU3l4VFFVRlRMRXRCUVVzc1NVRkJTU3hIUVVONFF5eFBRVUZQTEVWQlFVVXNZVUZEVkN4UlFVRlJMRTlCUVU4N1FVRkZha0lzVFVGQlNTeFBRVUZQTzBGQlExUXNaVUZCVnl4SlFVRkpMRWRCUVVjN1FVRkRiRUlzVVVGQlNTeFBRVUZQTzBGQlFWRXNWMEZCU3l4TFFVRkxPMEZCUVVFN1FVRkRlRUlzYVVKQlFWY3NTVUZCU1N4SFFVRkhPMEZCUVVFc1UwRkRiRUk3UVVGRFRDeFRRVUZMTEV0QlFVczdRVUZEVml4VFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVkYUxFMUJRVWtzUTBGQlF5eEZRVUZGTEZsQlFWazdRVUZEYWtJc1ZVRkJUU3hyUWtGQmEwSTdRVUZCUVN4VFFVTnVRanRCUVVOTUxGVkJRVTBzWlVGQlpUdEJRVU55UWl4UlFVRkpMRWxCUVVrc1VVRkJVVHRCUVU5b1FpeFJRVUZKTEU5QlFVODdRVUZEVkN4aFFVRlBPMEZCUTFBc1ZVRkJTU3hYUVVGWExFbEJRVWs3UVVGRGFrSXNZVUZCU3l4TFFVRkxMRWxCUVVrN1FVRkJRU3hwUWtGRFRDeFhRVUZYTEVkQlFVYzdRVUZEZGtJc1lVRkJTeXhMUVVGTExFbEJRVWs3UVVGQlFUdEJRVUZCTEZkQlJWZzdRVUZEVEN4aFFVRlBPMEZCUVVFN1FVRlBWQ3hSUVVGSkxFdEJRVXNzUjBGQlJ6dEJRVU5XTEZsQlFVMHNTVUZCU1N4UlFVRlJMRXRCUVVzN1FVRkRka0lzVlVGQlNTeEpRVUZKTEV0QlFVczdRVUZEWWl4UlFVRkZMRWxCUVVrc1NVRkJTU3hUUVVGVE8wRkJRMjVDTEZGQlFVVXNTVUZCU1N4WlFVRlpMR1ZCUVdVc1NVRkJTU3hKUVVGSk8wRkJRM3BETEZGQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVN1FVRkJRVHRCUVVkYUxGTkJRVXNzV1VGQldTeExRVUZMTEVsQlFVazdRVUZETVVJc1VVRkJTU3hOUVVGTkxFZEJRVWM3UVVGSFlpeFhRVUZQTEVkQlFVY3NSVUZCUlN4UlFVRlJPMEZCUVVrc1UwRkJSenRCUVVVelFpeFJRVUZKTEVOQlFVTXNSMEZCUnl4SlFVRkpPMEZCUTFZc1dVRkJUU3hSUVVGUkxGTkJRVk03UVVGQlFTeFhRVU5zUWp0QlFVTk1MRlZCUVVrc1NVRkJTU3hIUVVGSE8wRkJRMVE3UVVGQlFTeGhRVU5MTzBGQlEwd3NXVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRZaXhWUVVGRkxFbEJRVWs3UVVGRFRpeFZRVUZGTEVsQlFVazdRVUZEVGl4WlFVRkpMRTlCUVU4c1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNTeEhRVUZITzBGQlF6VkNMR0ZCUVVzc1JVRkJSVHRCUVVOUUxGbEJRVWtzUlVGQlJUdEJRVU5PTEd0Q1FVRlZPMEZCUVVFN1FVRkpXaXhWUVVGSkxFZEJRVWM3UVVGRFVDeFZRVUZKTEU5QlFVODdRVUZEV0N4blFrRkJWU3hYUVVGWExFZEJRVWNzUzBGQlN5eFBRVUZQTzBGQlJYQkRMR2RDUVVGVkxFdEJRVXNzU1VGRFZpeFBRVUZOTEZWQlFWVXNXVUZCWVN4UlFVRlBMRXRCUVVzc1QwRkJVU3hIUVVGRkxFbEJRVWtzU1VGQlNTeEpRVUZKTEUxQlEyaEZMRWxCUVVrc1MwRkJTeXhOUVVGTkxFdEJRVTBzVVVGQlR5eExRVUZMTEZkQlFWY3NUMEZCVHl4TFFVRkxMRWRCUVVjc1MwRkJTeXhMUVVGTExFdEJRM0pGTEU5QlFWRXNSMEZCUlN4SlFVRkpMRWxCUVVrc1NVRkJTVHRCUVVVeFFpeFRRVUZITEZOQlFWTTdRVUZGV2l4VlFVRkpMRk5CUVZNN1FVRkhXQ3hsUVVGUExFVkJRVVVzUjBGQlJ5eEZRVUZGTEUxQlFVMHNUMEZCVHl4TFFVRkpPMEZCUXpkQ0xHRkJRVWNzVFVGQlRUdEJRVU5VTEdOQlFVa3NRMEZCUXl4SlFVRkpPMEZCUTFBc1kwRkJSVHRCUVVOR0xHVkJRVWNzVVVGQlVUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVMXFRaXhYUVVGTExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTXNSMEZCUnl4TlFVRk5MRWxCUVVrc1JVRkJSVHRCUVVGSk8wRkJSekZETEZkQlFVc3NTVUZCU1N4SFFVRkhMRTFCUVUwc1NVRkJTU3hKUVVGSkxFdEJRVXM3UVVGQlN5eGxRVUZQTEZOQlFWTXNUMEZCVHl4SFFVRkhPMEZCUnpsRUxGVkJRVWtzVDBGQlR6dEJRVU5VTEZsQlFVa3NUVUZCVFN4SFFVRkhPMEZCUTFnc1kwRkJTU3hYUVVGWExFMUJRVTBzVjBGQlZ5eEhRVUZITzBGQlEycERMR2RDUVVGSkxGZEJRVmNzUzBGQlN5eEpRVUZKTzBGQlEzaENMR2xDUVVGTExFVkJRVVVzUzBGQlN5eE5RVUZOTEVkQlFVYzdRVUZCVHl4eFFrRkJUenRCUVVOdVF5eHBRa0ZCU3l4WlFVRlpMRXRCUVVzc1RVRkJUVHRCUVVNMVFpeHBRa0ZCU3l4TlFVRk5MRWRCUVVjc1VVRkJVU3hEUVVGRExFZEJRVWNzVFVGQlRTeEpRVUZKTEVWQlFVVTdRVUZCU1R0QlFVY3hReXhwUWtGQlN5eEpRVUZKTEVkQlFVY3NUVUZCVFN4TlFVRk5MRWxCUVVrc1MwRkJTenRCUVVGTExIRkNRVUZQTEZOQlFWTXNUMEZCVHl4SFFVRkhPMEZCUVVFc2FVSkJRek5FTzBGQlEwd3NhMEpCUVUwc1NVRkJTU3hQUVVGUExFdEJRVXNzVFVGQlRTeEpRVUZKTEUxQlFVMDdRVUZCUVR0QlFVRkJPMEZCU1RGRExHTkJRVThzVFVGQlR5eExRVUZKTEVsQlFVa3NUVUZCVFN4UlFVRlJPMEZCUVVFc2FVSkJRek5DTEVsQlFVa3NSMEZCUnp0QlFVTm9RaXhsUVVGUExFVkJRVVU3UVVGQlNTeG5Ra0ZCVFN4TlFVRk5PMEZCUTNwQ0xHTkJRVTBzVDBGQlR6dEJRVUZCTEdGQlExSTdRVUZEVEN4WlFVRkpMRVZCUVVVc1NVRkJTVHRCUVVGTExHVkJRVXNzUzBGQlN5eExRVUZMTzBGQlFVOHNiVUpCUVU4N1FVRkJRU3hwUWtGRGJrTXNTVUZCU1R0QlFVRkxMR2RDUVVGTkxFbEJRVWtzVFVGQlRTeEhRVUZITEV0QlFVc3NUVUZCVFN4SlFVRkpMRTFCUVUwN1FVRkJRVHRCUVVGQk8wRkJTVGxFTEZWQlFVOHNXVUZCVnl4TFFVRkxMRTlCUVU4c1YwRkJWeXhKUVVGSkxFOUJRVThzVjBGQlZ5eEpRVUZKTEU5QlFVOHNUVUZCVFR0QlFVRkJPMEZCUjJ4R0xGTkJRVThzUlVGQlJTeEpRVUZKTEVsQlFVa3NUVUZCVFN4TlFVRk5PMEZCUVVFN1FVRkxMMElzYTBKQlFXdENMRXRCUVVzc1MwRkJTenRCUVVNeFFpeE5RVUZKTEVsQlFVa3NVMEZCVXl4TFFVRkxPMEZCUTNCQ0xGRkJRVWtzVTBGQlV6dEJRVU5pTEZkQlFVODdRVUZCUVR0QlFVRkJPMEZCZVVSWUxHRkJRV0VzUjBGQlJ6dEJRVU5rTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVZWeVFpeGpRVUZqTEVkQlFVYzdRVUZEWml4VFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSE8wRkJRVUU3UVVGWGNrSXNaVUZCWlN4SFFVRkhPMEZCUTJoQ0xGTkJRVThzU1VGQlNTeExRVUZMTEVkQlFVYzdRVUZCUVR0QlFWbHlRaXhoUVVGaExFZEJRVWNzUjBGQlJ6dEJRVU5xUWl4VFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSExFdEJRVXM3UVVGQlFUdEJRVmN4UWl4alFVRmpMRWRCUVVjN1FVRkRaaXhUUVVGUExFbEJRVWtzUzBGQlN5eEhRVUZITzBGQlFVRTdRVUZYY2tJc1pVRkJaU3hIUVVGSE8wRkJRMmhDTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVZkeVFpeGpRVUZqTEVkQlFVYzdRVUZEWml4VFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSE8wRkJRVUU3UVVGWGNrSXNaVUZCWlN4SFFVRkhPMEZCUTJoQ0xGTkJRVThzU1VGQlNTeExRVUZMTEVkQlFVYzdRVUZCUVR0QlFUWkNja0lzWlVGQlpTeEhRVUZITEVkQlFVYzdRVUZEYmtJc1RVRkJTU3hKUVVGSkxFdEJRVXM3UVVGRFlpeE5RVUZKTEVsQlFVa3NTMEZCU3p0QlFVTmlMRTFCUVVrc1IwRkRSaXhMUVVGTExFdEJRVXNzVjBGRFZpeExRVUZMTEV0QlFVc3NWVUZEVml4TlFVRk5MRXRCUVVzN1FVRkhZaXhOUVVGSkxFTkJRVU1zUlVGQlJTeExRVUZMTEVOQlFVTXNSVUZCUlN4SFFVRkhPMEZCUTJoQ0xGRkJRVWtzU1VGQlNTeExRVUZMTzBGQlFVRXNZVUZIU2l4RFFVRkRMRVZCUVVVc1MwRkJTeXhEUVVGRExFVkJRVVVzUjBGQlJ6dEJRVU4yUWl4UlFVRkpMRTFCUVUwc1RVRkJUU3hMUVVGTExFZEJRVWNzVFVGQlRTeEZRVUZGTEVsQlFVa3NTVUZCU1N4UFFVRlBPMEZCUXk5RExFMUJRVVVzU1VGQlNTeEZRVUZGTzBGQlFVRXNZVUZIUXl4RFFVRkRMRVZCUVVVc1MwRkJTeXhGUVVGRkxGVkJRVlU3UVVGRE4wSXNVVUZCU1N4RlFVRkZMRWxCUVVrc1NVRkJTU3hOUVVGTkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVsQlFVa3NTMEZCU3p0QlFVTTNReXhOUVVGRkxFbEJRVWtzUlVGQlJUdEJRVUZCTEdGQlIwTXNRMEZCUXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hWUVVGVk8wRkJRemRDTEZGQlFVa3NUVUZCVFN4TlFVRk5MRXRCUVVzc1IwRkJSeXhOUVVGTk8wRkJRemxDTEUxQlFVVXNTVUZCU1N4RlFVRkZPMEZCUVVFc1lVRkhReXhGUVVGRkxFbEJRVWtzUjBGQlJ6dEJRVU5zUWl4VFFVRkxMRmxCUVZrN1FVRkRha0lzVTBGQlN5eFhRVUZYTzBGQlEyaENMRkZCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUjBGQlJ5eEhRVUZITEV0QlFVczdRVUZEYUVNc1VVRkJTU3hOUVVGTkxFMUJRVTBzUzBGQlN6dEJRVU55UWl4VFFVRkxMRmxCUVZrN1FVRkRha0lzVTBGQlN5eFhRVUZYTzBGQlEyaENMRkZCUVVrc1JVRkJSU3hKUVVGSkxFbEJRVWtzUlVGQlJTeE5RVUZOTEV0QlFVc3NSVUZCUlN4TFFVRkxPMEZCUVVFc1UwRkROMEk3UVVGRFRDeFJRVUZKTEV0QlFVc3NTMEZCU3l4UFFVRlBMRWRCUVVjc1IwRkJSeXhMUVVGTE8wRkJRVUU3UVVGSGJFTXNVMEZCVHp0QlFVRkJPMEZCVjFRc1kwRkJZeXhIUVVGSE8wRkJRMllzVTBGQlR5eEpRVUZKTEV0QlFVc3NSMEZCUnp0QlFVRkJPMEZCVlhKQ0xHTkJRV01zUjBGQlJ6dEJRVU5tTEZOQlFVOHNVMEZCVXl4SlFVRkpMRWxCUVVrc1MwRkJTeXhKUVVGSkxFVkJRVVVzU1VGQlNTeEhRVUZITzBGQlFVRTdRVUZ6UWpWRExHZENRVUZuUWl4TFFVRkxPMEZCUTI1Q0xFMUJRVWtzUTBGQlF5eFBRVUZQTEU5QlFVOHNVVUZCVVR0QlFVRlZMRlZCUVUwc1RVRkJUU3hsUVVGbE8wRkJRMmhGTEUxQlFVa3NSMEZCUnl4SFFVRkhMRWRCUTFJc1kwRkJZeXhKUVVGSkxHRkJRV0VzVFVGREwwSXNTMEZCU3p0QlFVRkJMRWxCUTBnN1FVRkJRU3hKUVVGaE8wRkJRVUVzU1VGQlJ6dEJRVUZCTEVsQlEyaENPMEZCUVVFc1NVRkJXVHRCUVVGQkxFbEJRVWM3UVVGQlFTeEpRVU5tTzBGQlFVRXNTVUZCV1N4RFFVRkRPMEZCUVVFc1NVRkJWenRCUVVGQkxFbEJRM2hDTzBGQlFVRXNTVUZCV1R0QlFVRkJMRWxCUVVjN1FVRkJRU3hKUVVObU8wRkJRVUVzU1VGQlVUdEJRVUZCTEVsQlFVYzdRVUZCUVN4SlFVTllPMEZCUVVFc1NVRkJVU3hEUVVGRE8wRkJRVUVzU1VGQlZ6dEJRVUZCTEVsQlEzQkNPMEZCUVVFc1NVRkJWVHRCUVVGQkxFbEJRVWM3UVVGQlFUdEJRVWRxUWl4UFFVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxFZEJRVWNzVVVGQlVTeExRVUZMTEVkQlFVYzdRVUZEYWtNc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNUdEJRVUZoTEZkQlFVc3NTMEZCU3l4VFFVRlRPMEZCUXk5RExGRkJRVXNzUzBGQlNTeEpRVUZKTEZGQlFWRXNVVUZCVVR0QlFVTXpRaXhWUVVGSkxGVkJRVlVzVDBGQlR5eExRVUZMTEV0QlFVc3NSMEZCUnl4SlFVRkpMRTFCUVUwc1MwRkJTeXhIUVVGSExFbEJRVWs3UVVGQlNTeGhRVUZMTEV0QlFVczdRVUZCUVR0QlFVTnFSU3hqUVVGTkxFMUJRVTBzYTBKQlFXdENMRWxCUVVrc1QwRkJUenRCUVVGQk8wRkJRVUU3UVVGSmJFUXNUVUZCU1N4SlFVRkpMRlZCUVZVN1FVRkJZU3hUUVVGTExFdEJRVXNzVTBGQlV6dEJRVU5zUkN4TlFVRkxMRXRCUVVrc1NVRkJTU3hSUVVGUkxGRkJRVkU3UVVGRE0wSXNVVUZCU1N4TlFVRk5MRkZCUVZFc1RVRkJUU3hUUVVGVExFMUJRVTBzUzBGQlN5eE5RVUZOTEVkQlFVYzdRVUZEYmtRc1ZVRkJTU3hIUVVGSE8wRkJRMHdzV1VGQlNTeFBRVUZQTEZWQlFWVXNaVUZCWlN4VlFVTnFReXhSUVVGUExHMUNRVUZ0UWl4UFFVRlBMR05CUVdNN1FVRkRhRVFzWlVGQlN5eExRVUZMTzBGQlFVRXNaVUZEVER0QlFVTk1MR2RDUVVGTkxFMUJRVTA3UVVGQlFUdEJRVUZCTEdGQlJWUTdRVUZEVEN4aFFVRkxMRXRCUVVzN1FVRkJRVHRCUVVGQkxGZEJSVkE3UVVGRFRDeFpRVUZOTEUxQlFVMHNhMEpCUVd0Q0xFbEJRVWtzVDBGQlR6dEJRVUZCTzBGQlFVRTdRVUZKTjBNc1UwRkJUenRCUVVGQk8wRkJWMVFzWVVGQllTeEhRVUZITzBGQlEyUXNVMEZCVHl4SlFVRkpMRXRCUVVzc1IwRkJSenRCUVVGQk8wRkJWM0pDTEdOQlFXTXNSMEZCUnp0QlFVTm1MRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWM3UVVGQlFUdEJRVk55UWl4bFFVRmxMRXRCUVVzN1FVRkRiRUlzVFVGQlNTeEhRVUZITEVkQlFVYzdRVUZUVml4dlFrRkJhVUlzUjBGQlJ6dEJRVU5zUWl4UlFVRkpMRWRCUVVjc1NVRkJSeXhIUVVOU0xFbEJRVWs3UVVGSFRpeFJRVUZKTEVOQlFVVXNZMEZCWVR0QlFVRlZMR0ZCUVU4c1NVRkJTU3hUUVVGUk8wRkJTV2hFTEUxQlFVVXNZMEZCWXp0QlFVZG9RaXhSUVVGSkxHRkJRV0VzVlVGQlV6dEJRVU40UWl4UlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVWU0xGVkJRVWtzVlVGQlZUdEJRVU5hTEZsQlFVa3NRMEZCUXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hKUVVGSkxGTkJRVkVzVFVGQlRUdEJRVWM1UWl4WlFVRkZMRWxCUVVrN1FVRkRUaXhaUVVGRkxFbEJRVWs3UVVGQlFTeHRRa0ZEUnl4RlFVRkZMRWxCUVVrc1UwRkJVU3hOUVVGTk8wRkJSemRDTEZsQlFVVXNTVUZCU1R0QlFVTk9MRmxCUVVVc1NVRkJTU3hEUVVGRE8wRkJRVUVzWlVGRFJqdEJRVU5NTEZsQlFVVXNTVUZCU1N4RlFVRkZPMEZCUTFJc1dVRkJSU3hKUVVGSkxFVkJRVVVzUlVGQlJUdEJRVUZCTzBGQlFVRXNZVUZGVUR0QlFVTk1MRlZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRMUlzVlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVc1ZVRkJWU3hGUVVGRk8wRkJRVUU3UVVGSE9VSTdRVUZCUVR0QlFVZEdMRkZCUVVrc1QwRkJUenRCUVVWWUxGRkJRVWtzVFVGQlRTeFZRVUZWTzBGQlEyeENMRlZCUVVrc1RVRkJUU3hIUVVGSE8wRkJRMWdzVlVGQlJTeEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVRkpMRXRCUVVzN1FVRkRka0lzVlVGQlJTeEpRVUZKTzBGQlEwNHNWVUZCUlN4SlFVRkpMRU5CUVVNN1FVRkRVRHRCUVVGQk8wRkJSMFlzVlVGQlNTeEpRVUZKTEVkQlFVYzdRVUZEVkN4WlFVRkpMRU5CUVVNN1FVRkRUQ3hWUVVGRkxFbEJRVWs3UVVGQlFTeGhRVU5FTzBGQlEwd3NWVUZCUlN4SlFVRkpPMEZCUVVFN1FVRkpVaXhWUVVGSkxFMUJRVTBzUTBGQlF5eERRVUZETEV0QlFVc3NTVUZCU1N4TFFVRkxPMEZCUTNoQ0xHRkJRVXNzU1VGQlNTeEhRVUZITEV0QlFVa3NSMEZCUnl4TlFVRkxMRWxCUVVrc1RVRkJTenRCUVVGSk8wRkJSWEpETEZsQlFVa3NWVUZCVlR0QlFVTmFMR05CUVVrc1NVRkJTU3hUUVVGUkxFMUJRVTA3UVVGRGNFSXNZMEZCUlN4SlFVRkpPMEZCUTA0c1kwRkJSU3hKUVVGSk8wRkJRVUVzY1VKQlEwY3NTVUZCU1N4VFFVRlJMRTFCUVUwN1FVRkRNMElzWTBGQlJTeEpRVUZKTzBGQlEwNHNZMEZCUlN4SlFVRkpMRU5CUVVNN1FVRkJRU3hwUWtGRFJqdEJRVU5NTEdOQlFVVXNTVUZCU1R0QlFVTk9MR05CUVVVc1NVRkJTU3hEUVVGRE8wRkJRVUU3UVVGQlFTeGxRVVZLTzBGQlEwd3NXVUZCUlN4SlFVRkpPMEZCUTA0c1dVRkJSU3hKUVVGSkxFTkJRVU03UVVGQlFUdEJRVWRVTzBGQlFVRXNhVUpCUjFNc1NVRkJTU3hOUVVGTkxFZEJRVWM3UVVGRGRFSXNXVUZCU1N4RFFVRkRPMEZCUVVjc1dVRkJSU3hKUVVGSk8wRkJRMlFzVlVGQlJTeEpRVUZKTzBGQlEwNHNWVUZCUlN4SlFVRkpPMEZCUTA0N1FVRkJRVHRCUVVkR0xHRkJRVThzWVVGQllTeEhRVUZITEVWQlFVVTdRVUZCUVN4bFFVVm9RaXhOUVVGTkxGVkJRVlU3UVVGRGVrSXNXVUZCVFN4TlFVRk5MR3RDUVVGclFqdEJRVUZCTzBGQlNXaERMRkZCUVVzc1RVRkJTU3hGUVVGRkxGZEJRVmNzVVVGQlVTeEpRVUZKTzBGQlEyaERMRlZCUVVrc1JVRkJSU3hOUVVGTk8wRkJRMW9zVVVGQlJTeEpRVUZKTzBGQlFVRXNWMEZEUkR0QlFVVk1MRlZCUVVrc1QwRkJUVHRCUVVGSkxGbEJRVWtzUlVGQlJTeE5RVUZOTzBGQlF6RkNMRkZCUVVVc1NVRkJTVHRCUVVGQk8wRkJSMUlzVjBGQlR5eFZRVUZWTEV0QlFVc3NTMEZCU3l4aFFVRmhMRWRCUVVjc1MwRkJTeXhYUVVGWExFZEJRVWM3UVVGQlFUdEJRVWRvUlN4WFFVRlJMRmxCUVZrN1FVRkZjRUlzVjBGQlVTeFhRVUZYTzBGQlEyNUNMRmRCUVZFc1lVRkJZVHRCUVVOeVFpeFhRVUZSTEdGQlFXRTdRVUZEY2tJc1YwRkJVU3hqUVVGak8wRkJRM1JDTEZkQlFWRXNaMEpCUVdkQ08wRkJRM2hDTEZkQlFWRXNhMEpCUVd0Q08wRkJRekZDTEZkQlFWRXNhMEpCUVd0Q08wRkJRekZDTEZkQlFWRXNhMEpCUVd0Q08wRkJRekZDTEZkQlFWRXNiVUpCUVcxQ08wRkJRek5DTEZkQlFWRXNVMEZCVXp0QlFVVnFRaXhYUVVGUkxGTkJRVk1zVTBGQlVTeE5RVUZOTzBGQlF5OUNMRmRCUVZFc1VVRkJVVHRCUVVOb1FpeFhRVUZSTEZsQlFWazdRVUZGY0VJc1YwRkJVU3hOUVVGTk8wRkJRMlFzVjBGQlVTeFBRVUZQTzBGQlEyWXNWMEZCVVN4UlFVRlJPMEZCUTJoQ0xGZEJRVkVzVFVGQlRUdEJRVU5rTEZkQlFWRXNUMEZCVHp0QlFVTm1MRmRCUVZFc1VVRkJVVHRCUVVOb1FpeFhRVUZSTEU5QlFVODdRVUZEWml4WFFVRlJMRkZCUVZFN1FVRkRhRUlzVjBGQlVTeFJRVUZSTzBGQlEyaENMRmRCUVZFc1QwRkJUenRCUVVObUxGZEJRVkVzVDBGQlR6dEJRVU5tTEZkQlFWRXNUVUZCVFR0QlFVTmtMRmRCUVZFc1QwRkJUenRCUVVObUxGZEJRVkVzVFVGQlRUdEJRVU5rTEZkQlFWRXNUVUZCVFR0QlFVTmtMRmRCUVZFc1VVRkJVVHRCUVVOb1FpeFhRVUZSTEZGQlFWRTdRVUZEYUVJc1YwRkJVU3hMUVVGTE8wRkJRMklzVjBGQlVTeE5RVUZOTzBGQlEyUXNWMEZCVVN4UlFVRlJPMEZCUTJoQ0xGZEJRVkVzVDBGQlR6dEJRVU5tTEZkQlFWRXNUVUZCVFR0QlFVTmtMRmRCUVZFc1RVRkJUVHRCUVVOa0xGZEJRVkVzVFVGQlRUdEJRVU5rTEZkQlFWRXNUVUZCVFR0QlFVTmtMRmRCUVZFc1RVRkJUVHRCUVVOa0xGZEJRVkVzVTBGQlV6dEJRVU5xUWl4WFFVRlJMRkZCUVZFN1FVRkRhRUlzVjBGQlVTeFBRVUZQTzBGQlEyWXNWMEZCVVN4TlFVRk5PMEZCUTJRc1YwRkJVU3hQUVVGUE8wRkJRMllzVjBGQlVTeFBRVUZQTzBGQlEyWXNWMEZCVVN4TlFVRk5PMEZCUTJRc1YwRkJVU3hOUVVGTk8wRkJRMlFzVjBGQlVTeFBRVUZQTzBGQlEyWXNWMEZCVVN4UlFVRlJPMEZCUldoQ0xFMUJRVWtzVVVGQlVUdEJRVUZSTEZWQlFVMDdRVUZETVVJc1RVRkJTU3hMUVVGTE8wRkJRMUFzVVVGQlNTeEpRVUZKTEdGQlFXRXNUVUZCVFR0QlFVTjZRaXhYUVVGTExFTkJRVU1zWVVGQllTeFpRVUZaTEZsQlFWa3NXVUZCV1N4UlFVRlJMRkZCUVZFc1ZVRkJWVHRCUVVOcVJpeFhRVUZMTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWRCUVVjN1FVRkJVeXhaUVVGSkxFTkJRVU1zU1VGQlNTeGxRVUZsTEVsQlFVa3NSMEZCUnp0QlFVRlBMR05CUVVrc1MwRkJTeXhMUVVGTE8wRkJRVUU3UVVGQlFUdEJRVWx3Uml4WFFVRlJMRTlCUVU4N1FVRkZaaXhUUVVGUE8wRkJRVUU3UVVGWlZDeGhRVUZoTEVkQlFVY3NSMEZCUnp0QlFVTnFRaXhUUVVGUExFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVazdRVUZCUVR0QlFWZDZRaXhoUVVGaExFZEJRVWM3UVVGRFpDeFRRVUZQTEVsQlFVa3NTMEZCU3l4SFFVRkhPMEZCUVVFN1FVRlZja0lzWlVGQlpTeEhRVUZITzBGQlEyaENMRk5CUVU4c1UwRkJVeXhKUVVGSkxFbEJRVWtzUzBGQlN5eEpRVUZKTEVWQlFVVXNTVUZCU1N4SFFVRkhPMEZCUVVFN1FVRmhOVU1zYVVKQlFXbENPMEZCUTJZc1RVRkJTU3hIUVVGSExFZEJRMHdzU1VGQlNTeEpRVUZKTEV0QlFVczdRVUZGWml4aFFVRlhPMEZCUlZnc1QwRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeFZRVUZWTEZWQlFWTTdRVUZEYWtNc1VVRkJTU3hKUVVGSkxFdEJRVXNzVlVGQlZUdEJRVU4yUWl4UlFVRkpMRU5CUVVNc1JVRkJSU3hIUVVGSE8wRkJRMUlzVlVGQlNTeEZRVUZGTEVkQlFVYzdRVUZEVUN4dFFrRkJWenRCUVVOWUxHVkJRVThzU1VGQlNTeExRVUZMTEVsQlFVazdRVUZCUVR0QlFVVjBRaXhWUVVGSk8wRkJRVUVzWlVGRFN5eEZRVUZGTEVkQlFVYzdRVUZEWkN4VlFVRkpMRVZCUVVVc1MwRkJTeXhGUVVGRkxFMUJRVTA3UVVGQlFUdEJRVUZCTzBGQlNYWkNMR0ZCUVZjN1FVRkZXQ3hUUVVGUExFVkJRVVU3UVVGQlFUdEJRVk5ZTERKQ1FVRXlRaXhMUVVGTE8wRkJRemxDTEZOQlFVOHNaVUZCWlN4WFFVRlhMRTlCUVU4c1NVRkJTU3hUUVVGVExITkNRVUZ6UWp0QlFVRkJPMEZCVnpkRkxGbEJRVmtzUjBGQlJ6dEJRVU5pTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVdOeVFpeGhRVUZoTEVkQlFVY3NSMEZCUnp0QlFVTnFRaXhUUVVGUExFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVazdRVUZCUVR0QlFWZDZRaXhqUVVGakxFZEJRVWM3UVVGRFppeFRRVUZQTEVsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrN1FVRkJRVHRCUVZkNlFpeGxRVUZsTEVkQlFVYzdRVUZEYUVJc1UwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTzBGQlFVRTdRVUZWZWtJc1pVRkJaVHRCUVVOaUxGTkJRVThzVTBGQlV5eE5RVUZOTEZkQlFWYzdRVUZCUVR0QlFWVnVReXhsUVVGbE8wRkJRMklzVTBGQlR5eFRRVUZUTEUxQlFVMHNWMEZCVnp0QlFVRkJPMEZCV1c1RExHRkJRV0VzUjBGQlJ5eEhRVUZITzBGQlEycENMRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNUdEJRVUZCTzBGQldYcENMR0ZCUVdFc1IwRkJSeXhIUVVGSE8wRkJRMnBDTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTVHRCUVVGQk8wRkJXWHBDTEdGQlFXRXNSMEZCUnl4SFFVRkhPMEZCUTJwQ0xGTkJRVThzU1VGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1R0QlFVRkJPMEZCV1hwQ0xHZENRVUZuUWl4SlFVRkpPMEZCUTJ4Q0xFMUJRVWtzUjBGQlJ5eEhRVUZITEVkQlFVY3NSMEZEV0N4SlFVRkpMRWRCUTBvc1NVRkJTU3hKUVVGSkxFdEJRVXNzU1VGRFlpeExRVUZMTzBGQlJWQXNUVUZCU1N4UFFVRlBPMEZCUVZFc1UwRkJTeXhMUVVGTE8wRkJRVUU3UVVGRGVFSXNaVUZCVnl4SlFVRkpMRWRCUVVjN1FVRkZka0lzVFVGQlNTeExRVUZMTEV0QlFVc3NTMEZCU3p0QlFVVnVRaXhOUVVGSkxFTkJRVU1zUzBGQlN5eFJRVUZSTzBGQlEyaENMRmRCUVU4c1NVRkJTVHRCUVVGSkxGTkJRVWNzVDBGQlR5eExRVUZMTEZkQlFWY3NUVUZCVFR0QlFVRkJMR0ZCUjNSRExFOUJRVThzYVVKQlFXbENPMEZCUTJwRExGRkJRVWtzVDBGQlR5eG5Ra0ZCWjBJc1NVRkJTU3haUVVGWk8wRkJSVE5ETEZkQlFVOHNTVUZCU1N4TFFVRkpPMEZCUTJJc1ZVRkJTU3hGUVVGRk8wRkJTVTRzVlVGQlNTeExRVUZMTEU5QlFWRTdRVUZEWml4VlFVRkZMRXRCUVVzc1QwRkJUeXhuUWtGQlowSXNTVUZCU1N4WlFVRlpMRWxCUVVrN1FVRkJRU3hoUVVNM1F6dEJRVWxNTEZkQlFVY3NUMEZCVHl4SlFVRkpPMEZCUVVFN1FVRkJRVHRCUVVGQkxHRkJTMVFzVDBGQlR5eGhRVUZoTzBGQlJ6ZENMRkZCUVVrc1QwRkJUeXhaUVVGWkxFdEJRVXM3UVVGRk5VSXNWMEZCVHl4SlFVRkpMRXRCUVVrN1FVRkhZaXhWUVVGSkxFVkJRVVVzUzBGQlRTeEhRVUZGTEVsQlFVa3NUVUZCVFN4TFFVRk5MRWRCUVVVc1NVRkJTU3hOUVVGTkxFMUJRVkVzU1VGQlJTeEpRVUZKTEV0QlFVc3NVVUZCVXp0QlFVZDBSU3hWUVVGSkxFdEJRVXNzVDBGQlVUdEJRVU5tTEdWQlFVOHNXVUZCV1N4SFFVRkhMRXRCUVVzc1IwRkJSenRCUVVGQkxHRkJRM3BDTzBGQlNVd3NWMEZCUnl4TFFVRkxMRWxCUVVrN1FVRkRXaXhoUVVGTE8wRkJRVUU3UVVGQlFUdEJRVWxVTEZGQlFVa3NTVUZCU1R0QlFVRkJMRk5CUTBnN1FVRkRUQ3hWUVVGTkxFMUJRVTA3UVVGQlFUdEJRVWRrTEUxQlFVa3NSMEZCUnl4RlFVRkZPMEZCUTFRc1VVRkJUVHRCUVVkT0xFMUJRVWtzUzBGQlN5eEpRVUZKTzBGQlExZ3NVVUZCU1N4UlFVRlJMRWxCUVVrc1YwRkJWenRCUVVNelFpeFBRVUZITEV0QlFVMHNTMEZCU1N4SlFVRkpMRXRCUVVzN1FVRkJRVHRCUVVsNFFpeFRRVUZQTEVkQlFVY3NUMEZCVHl4SFFVRkhPMEZCUVVzc1QwRkJSenRCUVVjMVFpeE5RVUZKTEVsQlFVa3NSMEZCUnp0QlFVTlVMRkZCUVVrN1FVRkRTaXhUUVVGTExFTkJRVU03UVVGQlFTeFRRVU5FTzBGQlEwd3NVVUZCU1R0QlFVZEtMRmRCUVU4c1IwRkJSeXhQUVVGUExFZEJRVWNzUzBGQlN6dEJRVUZWTEZOQlFVYzdRVUZIZEVNc1UwRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVUZITEVsQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzN1FVRkJTVHRCUVVkNlF5eFJRVUZKTEVsQlFVazdRVUZCVlN4WFFVRkxMRmRCUVZjN1FVRkJRVHRCUVVkd1F5eEpRVUZGTEVsQlFVazdRVUZEVGl4SlFVRkZMRWxCUVVrN1FVRkZUaXhUUVVGUE8wRkJRVUU3UVVGWlZDeGxRVUZsTEVkQlFVYzdRVUZEYUVJc1UwRkJUeXhUUVVGVExFbEJRVWtzU1VGQlNTeExRVUZMTEVsQlFVa3NSVUZCUlN4SlFVRkpMRWRCUVVjc1MwRkJTenRCUVVGQk8wRkJaV3BFTEdOQlFXTXNSMEZCUnp0QlFVTm1MRTFCUVVrc1NVRkJTU3hMUVVGTE8wRkJRMklzVTBGQlR5eEZRVUZGTEVsQlFVc3NSVUZCUlN4RlFVRkZMRXRCUVVzc1JVRkJSU3hKUVVGSkxFbEJRVWtzUlVGQlJTeEpRVUZMTEVWQlFVVXNTMEZCU3p0QlFVRkJPMEZCVjJwRUxHRkJRV0VzUjBGQlJ6dEJRVU5rTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkJRVHRCUVZkeVFpeGpRVUZqTEVkQlFVYzdRVUZEWml4VFFVRlBMRWxCUVVrc1MwRkJTeXhIUVVGSE8wRkJRVUU3UVVGWGNrSXNZMEZCWXl4SFFVRkhPMEZCUTJZc1UwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ6dEJRVUZCTzBGQldYSkNMR0ZCUVdFc1IwRkJSeXhIUVVGSE8wRkJRMnBDTEZOQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTVHRCUVVGQk8wRkJWM3BDTEdGQlFXRXNSMEZCUnp0QlFVTmtMRk5CUVU4c1NVRkJTU3hMUVVGTExFZEJRVWM3UVVGQlFUdEJRVmR5UWl4alFVRmpMRWRCUVVjN1FVRkRaaXhUUVVGUExFbEJRVWtzUzBGQlN5eEhRVUZITzBGQlFVRTdRVUZWY2tJc1pVRkJaU3hIUVVGSE8wRkJRMmhDTEZOQlFVOHNVMEZCVXl4SlFVRkpMRWxCUVVrc1MwRkJTeXhKUVVGSkxFVkJRVVVzU1VGQlNTeEhRVUZITzBGQlFVRTdRVUZKTlVNc1JVRkJSU3hQUVVGUExFbEJRVWtzYVVOQlFXbERMRVZCUVVVN1FVRkRhRVFzUlVGQlJTeFBRVUZQTEdWQlFXVTdRVUZIYWtJc1YwRkJTU3hWUVVGVkxFMUJRVTA3UVVGSE0wSXNUMEZCVHl4SlFVRkpMRkZCUVZFN1FVRkRia0lzUzBGQlN5eEpRVUZKTEZGQlFWRTdRVUZGYWtJc1pVRkJaVHNpTEFvZ0lDSnVZVzFsY3lJNklGdGRDbjBLXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFLFVBQVUsR0FBRyxHQUFHLEVBQUUsUUFBUSxHQUFHLGtCQUFrQixFQUFFLElBQUksR0FBRyxvZ0NBQW9nQyxFQUFFLEVBQUUsR0FBRyxvZ0NBQW9nQyxFQUFFLFFBQVEsR0FBRztBQUMxbUUsRUFBRSxTQUFTLEVBQUUsRUFBRTtBQUNmLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDYixFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ1gsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2QsRUFBRSxRQUFRLEVBQUUsRUFBRTtBQUNkLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUztBQUNsQixFQUFFLElBQUksRUFBRSxTQUFTO0FBQ2pCLEVBQUUsTUFBTSxFQUFFLEtBQUs7QUFDZixDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEdBQUcsSUFBSSxFQUFFLFlBQVksR0FBRyxpQkFBaUIsRUFBRSxlQUFlLEdBQUcsWUFBWSxHQUFHLG9CQUFvQixFQUFFLHNCQUFzQixHQUFHLFlBQVksR0FBRywwQkFBMEIsRUFBRSxpQkFBaUIsR0FBRyxZQUFZLEdBQUcsb0JBQW9CLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxHQUFHLDRDQUE0QyxFQUFFLEtBQUssR0FBRyx3REFBd0QsRUFBRSxPQUFPLEdBQUcsK0NBQStDLEVBQUUsU0FBUyxHQUFHLG9DQUFvQyxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsR0FBRyxnQkFBZ0IsRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQy9xQixDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsV0FBVztBQUNyQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3BCLEVBQUUsT0FBTyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsRUFBRTtBQUNuQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ2xCLElBQUksT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckYsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDZixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2xCLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDbEIsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxH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R0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFDLEdBQUcsTUFBTTtBQUNULElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsSUFBSSxJQUFJLE9BQU8sRUFBRSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxRSxJQUFJLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDbEIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDdEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNyQixFQUFF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QUMsQ0FBQztBQUNyQixNQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDcEIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pFLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDdEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNyQixFQUFFLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFDRixDQUFDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsV0FBVztBQUN2QyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3RyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDckIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDWixNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksWUFBWSxFQUFFO0FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEIsTUFBTSxPQUFPLENBQUMsQ0FBQztBQUNmLEtBQUs7QUFDTCxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDekIsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxZQUFZLEVBQUU7QUFDdEQsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLElBQUksT0FBTyxDQUFDLENBQUM7QUFDYixHQUFHO0FBQ0gsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDcEIsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0MsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEVBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUNuQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUNoQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDUixFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNULEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUk7QUFDckIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDO0FBQ3pCLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVB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RSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUNyRixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM5QixJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkUsR0FBRztBQUNILEVBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUNuQixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDNUIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNmLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRCxJQUFJLElBQUksQ0FB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LEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDN0MsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUNuQixJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDaEIsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDdEIsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNyQixFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUMzQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDckIsRUFBRSxPQUFPLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlFLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsRUFBRTtBQUM5QixFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2IsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RDLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMvRyxHQUFHO0FBQ0gsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7QUFDNUQsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNsQixFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2xCLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFO0FBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNaLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNYLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNiLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNkLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLEdBQUc7QUFDSCxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDVCxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNsQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUk7QUFDNUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUk7QUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUM1QixNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUMzQixLQUFLO0FBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxD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LENBQUMsQ0FBQztBQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLEdBQUc7QUFDSCxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0csRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN0QixFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbEIsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQztBQUNGLENBQUMsQ0FBQyxh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akIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztBQUNoQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQixHQUFHO0FBQ0gsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDMUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUssSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3hDLE1BQU0s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QUFDLENBQUM7QUFDcEUsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNLFdBQVcsR0FBRyxXQUFXLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNySCxNQUFNLE9BQU8sR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLFdBQVcsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxXQUFXLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdlAsTUFBTSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDNUIsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFRLElBQUksT0FBTyxFQUFFO0FBQ3JCLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hC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QyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUNuQixHQUFHO0FBQ0gsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQztBQUNMLEVBQUUsS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHO0FBQzlELElBQUksQ0FBQztBQUNMLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLEVBQUUsSUFBSSxHQUFHLEVBQUU7QUFDWCxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDO0FBQzNCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNiLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQztBQUNwQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtBQUNqQixNQUFNLElBQUksQ0FBQztBQUNYLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMsR0FBRyxHQUFHO0FBQ25DLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMvQyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ2hDLEtBQUssTUFBTTtBQUNYLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNmLEtBQUs7QUFDTCxJQUFJLE9BQU8sQ0FBQyxFQUFFO0FBQ2QsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDO0FBQ2pCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLElBQUksUUFBUSxFQUFFO0FBQ2xCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3BDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNsQixPQUFPLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHLE1BQU07QUFDVCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxHQUFHO0FBQ0gsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFO0FBQzVCLEVBQUUsSUFBSSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN0RCxFQUFFLElBQUksR0FBRyxLQUFLLFVBQVUsSUFBSSxHQUFHLEtBQUssS0FBSyxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRztBQUNiLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZixJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM1QixHQUFHLE1BQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNiLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsR0FBRyxNQUFNO0FBQ1QsSUFBSSxNQUFNLEtBQUssQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNILEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsTUFBTTtBQUNULElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsR0FBRztBQUNILEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsRUFBRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQ3ZCLEVBQUUsSUFBSSxPQUFPLEVBQUU7QUFDZixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JELEdBQUc7QUFDSCxFQUFFLEVBQUUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNyQixFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMvQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUs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O0FBQ25CLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxXQUFXO0FBQ2IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEQsSUFBSSxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQzNCLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDMUMsUUFBUSxDQUFDO0FBQ1QsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakIsUUFBUSxNQUFNO0FBQ2QsS0FBSztBQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksQ0FBQyxHQUFH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LEdBQUcsR0FBRyxDQUFDO0FBQ3JCLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNILENBQUM7QUFDRCxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDaEIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFDRCxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDakIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFDRCxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDbEIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLENBQUM7QUFDRCxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDckIsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvRCxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDekQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsR0FBRyxNQUFNLElBQUksQ0FBQyxD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LFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLEVBQUUsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDekIsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN6QixFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLEVBQUUsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbkIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLEVBQUUsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDdkIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDM0IsRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN6QixFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckIsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNyQixFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDekIsRUFBRSxJQUFJLEdBQUcsS0FBSyxLQUFLLENBQUM7QUFDcEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsRUFBRSxJQUFJLEdBQUcsRUFBRTtBQUNYLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtBQUMvQixNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU07QUFDL0IsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLEVBQUUsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBQ0QsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2xCLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFDRCxTQUFTLEtBQUssR0FBRztBQUNqQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsRUFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ25CLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJO0FBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNkLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2YsUUFBUSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQVEsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0IsT0FBTztBQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFD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RSxFQUFFLENBQUMsSUFBSSxFQUFFO0FBQzNDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDVixJQUFJLElBQUksQ0FBQyxHQUFHLFFBQVE7QUFDcEIsTUFBTSxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN4QixHQUFHO0FBQ0gsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsQixFQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7QUFDbkQsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNoQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkIsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ2pCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2xCLEVBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN6RCxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUN4QixJQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3JDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixFQUFFLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDOzs7OyJ9
