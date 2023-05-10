"use strict";

var randomStr = function randomStr() {
  var date = new Date().getTime().toString(36);
  var prefix = Math.round(Math.random() * 2147483647).toString(36);
  return date + prefix;
};

var byteCount = function byteCount(str) {
  return encodeURI(str).split(/%(?:u[\dA-F]{2})?[\dA-F]{2}|./).length - 1;
};

var expiresToDate = function expiresToDate(expires) {
  var date = new Date();

  var increaseDays = function increaseDays(days2) {
    if (days2) {
      date.setDate(date.getDate() + days2);
    }
  };

  if (expires instanceof Date) {
    date = expires;
  } else if (typeof expires === "number") {
    increaseDays(expires);
  } else {
    var _a = expires,
        days = _a.days,
        minutes = _a.minutes;
    increaseDays(days);

    if (minutes) {
      date.setMinutes(date.getMinutes() + minutes);
    }
  }

  return date;
};

var decode = function decode(s) {
  var res = s.replace(/\+/g, " ").replace(/^\s+|\s+$/g, "");

  try {
    return decodeURIComponent(res);
  } catch (e) {
    return res;
  }
};

var decodeValue = function decodeValue(s) {
  if (s.indexOf('"') === 0) {
    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }

  return decode(s);
};

var cookie = function () {
  var _generateCookieString = function _generateCookieString(name, value, _a) {
    var _b = _a === void 0 ? {} : _a,
        path = _b.path,
        domain = _b.domain,
        expires = _b.expires,
        secure = _b.secure,
        samesite = _b.samesite,
        raw = _b.raw;

    return (raw ? name : encodeURIComponent(name)) + "=" + (raw ? value : encodeURIComponent(value)) + (expires ? "; expires=".concat(expiresToDate(expires).toUTCString()) : "") + (path ? "; path=".concat(path) : "") + (domain ? "; domain=".concat(domain) : "") + (secure ? "; secure" : "") + (samesite ? typeof samesite === "boolean" ? "; sameSite" : "; sameSite=".concat(samesite) : "");
  };

  var setCookie = function setCookie(name, value, cookieOptions, limitValue) {
    if (value === void 0 || limitValue !== void 0 && byteCount(value) > limitValue) {
      return;
    }

    document.cookie = _generateCookieString(name, value, cookieOptions);
  };

  var parseCookie = function parseCookie(cb) {
    var allCookies = document.cookie.split(";");

    for (var i = 0; i < allCookies.length; i++) {
      var _cookie = allCookies[i].split("=");

      var cookieName = decode(_cookie[0]);
      var cookieValue = _cookie[1] || "";

      if (cb(cookieName, cookieValue)) {
        return void 0;
      }
    }
  };

  function getCookie(name) {
    var result = null;
    var cookies = {};
    parseCookie(function (cookieName, cookieValue) {
      if (name) {
        if (cookieName === name) {
          result = decodeValue(cookieValue);
          return true;
        }
      } else {
        cookies[cookieName] = decodeValue(cookieValue);
      }
    });

    if (name) {
      return result;
    }

    return cookies;
  }

  var getNames = function getNames() {
    var result = [];
    parseCookie(function (cookieName) {
      result.push(cookieName);
    });
    return result;
  };

  var removeCookie = function removeCookie(name, cookieOptions) {
    setCookie(name, "", Object.assign({}, cookieOptions, {
      expires: -1
    }));
  };

  var getTopLevelDomain = function () {
    var testName = "_cookie_test";
    return function (domainExceptions) {
      if (domainExceptions === void 0) {
        domainExceptions = [];
      }

      var domainParts = window.location.hostname.split(".");
      var testValue = randomStr();
      var expires = new Date();
      expires.setSeconds(expires.getSeconds() + 30);

      for (var i = 0; i < domainParts.length; i++) {
        try {
          var candidate = domainParts.slice(-(i + 1)).join(".");

          if (!domainExceptions.includes(candidate)) {
            setCookie(testName, testValue, {
              expires: expires,
              path: "/",
              domain: candidate
            });
            var allowed = getCookie(testName) === testValue;
            removeCookie(testName, {
              path: "/",
              domain: candidate
            });

            if (allowed) {
              return candidate;
            }
          }
        } catch (e) {}
      }
    };
  }();

  return {
    set: setCookie,
    get: getCookie,
    getNames: getNames,
    remove: removeCookie,
    getTopLevelDomain: getTopLevelDomain,
    __private__: {
      _generateCookieString: _generateCookieString
    }
  };
}();

var localStorage = function () {
  var TTL_NAME_ITEMS = "_ls_ttl";

  var _checkTTl = function _checkTTl(ttl) {
    return ttl ? ttl > Date.now() : true;
  };

  var _parseTTLValues = function _parseTTLValues() {
    try {
      var value = window.localStorage.getItem(TTL_NAME_ITEMS);

      if (value) {
        var obj = JSON.parse(value);
        return obj;
      }

      return null;
    } catch (e) {
      return null;
    }
  };

  var _setTTLValues = function _setTTLValues(ttlValues) {
    try {
      if (Object.keys(ttlValues).length) {
        window.localStorage.setItem(TTL_NAME_ITEMS, JSON.stringify(ttlValues));
      } else {
        window.localStorage.removeItem(TTL_NAME_ITEMS);
      }
    } catch (e) {}
  };

  var _saveTTLValues = function _saveTTLValues(name, expires) {
    var ttlValues = _parseTTLValues();

    if (expires === void 0) {
      if (ttlValues === null || ttlValues === void 0 ? void 0 : ttlValues[name]) {
        delete ttlValues[name];

        _setTTLValues(ttlValues);
      }

      return true;
    }

    var expiresTime = expiresToDate(expires).getTime();

    if (expiresTime > Date.now()) {
      ttlValues = ttlValues || {};
      ttlValues[name] = expiresTime.toString(36);

      _setTTLValues(ttlValues);

      return true;
    }

    return false;
  };

  var _checkTTLValues = function _checkTTLValues() {
    var names = _getNames();

    var ttls = _parseTTLValues();

    var ttlsUpdated = {};

    if (!ttls) {
      return;
    }

    Object.keys(ttls).forEach(function (key) {
      if (names.includes(key)) {
        var expire = ttls[key] ? parseInt(ttls[key], 36) : null;

        if (!_checkTTl(expire)) {
          try {
            window.localStorage.removeItem(key);
          } catch (e) {}
        } else {
          ttlsUpdated[key] = ttls[key];
        }
      }
    });

    if (JSON.stringify(ttls) !== JSON.stringify(ttlsUpdated)) {
      _setTTLValues(ttlsUpdated);
    }
  };

  var _get = function _get(key) {
    var _a;

    _checkTTLValues();

    try {
      return (_a = window.localStorage.getItem(key)) !== null && _a !== void 0 ? _a : null;
    } catch (e) {
      return null;
    }
  };

  var _getNames = function _getNames() {
    try {
      return Object.keys(window.localStorage);
    } catch (e) {
      return [];
    }
  };

  var _set = function _set(key, value, options) {
    if (options === void 0) {
      options = {};
    }

    if (_saveTTLValues(key, options.expires)) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {}
    }
  };

  var _remove = function _remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {}

    _checkTTLValues();
  };

  _checkTTLValues();

  return {
    get: _get,
    set: _set,
    getNames: _getNames,
    remove: _remove,
    expires: _checkTTLValues,
    __protected__: {
      get ttlName() {
        return TTL_NAME_ITEMS;
      }

    }
  };
}();

var sessionStorage = function () {
  var _get = function _get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  };

  var _set = function _set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (e) {}
  };

  var _remove = function _remove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (e) {}
  };

  var _getNames = function _getNames() {
    try {
      return Object.keys(window.sessionStorage);
    } catch (e) {
      return [];
    }
  };

  return {
    get: _get,
    set: _set,
    getNames: _getNames,
    remove: _remove
  };
}();

export { cookie, localStorage, sessionStorage };