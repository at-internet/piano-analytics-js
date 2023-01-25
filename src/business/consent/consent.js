"use strict";

var __defProp = Object.defineProperty;

var __export = function __export(target, all) {
    for (var name in all) {
        __defProp(target, name, {
            get: all[name],
            enumerable: true
        });
    }
};

var dist_exports = {};

__export(dist_exports, {
    cookie: function cookie() {
        return _cookie2;
    },
    localStorage: function localStorage() {
        return _localStorage;
    },
    sessionStorage: function sessionStorage() {
        return _sessionStorage;
    }
});

var randomStr = function randomStr2() {
    var date = new Date().getTime().toString(36);
    var prefix = Math.round(Math.random() * 2147483647).toString(36);
    return date + prefix;
};

var byteCount = function byteCount2(str) {
    return encodeURI(str).split(/%(?:u[\dA-F]{2})?[\dA-F]{2}|./).length - 1;
};

var expiresToDate = function expiresToDate2(expires) {
    var date = new Date();

    var increaseDays = function increaseDays2(days2) {
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

var decode = function decode2(s) {
    var res = s.replace(/\+/g, " ").replace(/^\s+|\s+$/g, "");
    return decodeURIComponent(res);
};

var decodeValue = function decodeValue2(s) {
    if (s.indexOf('"') === 0) {
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }

    return decode(s);
};

var _cookie2 = function () {
    var _generateCookieString = function _generateCookieString2(name, value, _a) {
        var _b = _a === void 0 ? {} : _a,
            path = _b.path,
            domain = _b.domain,
            expires = _b.expires,
            secure = _b.secure,
            samesite = _b.samesite,
            raw = _b.raw;

        return (raw ? name : encodeURIComponent(name)) + "=" + (raw ? name : encodeURIComponent(value)) + (expires ? "; expires=".concat(expiresToDate(expires).toUTCString()) : "") + (path ? "; path=".concat(path) : "") + (domain ? "; domain=".concat(domain) : "") + (secure ? "; secure" : "") + (samesite ? typeof samesite === "boolean" ? "; sameSite" : "; sameSite=".concat(samesite) : "");
    };

    var setCookie = function setCookie2(name, value, cookieOptions, limitValue) {
        if (limitValue !== void 0 && byteCount(value) > limitValue) {
            return;
        }

        document.cookie = _generateCookieString(name, value, cookieOptions);
    };

    var parseCookie = function parseCookie2(cb) {
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
            if (name && cookieName === name) {
                result = decodeValue(cookieValue);
                return true;
            }

            cookies[cookieName] = decodeValue(cookieValue);
        });

        if (name) {
            return result;
        }

        return cookies;
    }

    var getNames = function getNames2() {
        var result = [];
        parseCookie(function (cookieName) {
            result.push(cookieName);
        });
        return result;
    };

    var removeCookie = function removeCookie2(name, cookieOptions) {
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

            for (var i = 0; i < domainParts.length; i++) {
                try {
                    var candidate = domainParts.slice(-(i + 1)).join(".");

                    if (!domainExceptions.includes(candidate)) {
                        setCookie(testName, testValue, {
                            expires: 1,
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

var _localStorage = function () {
    var TTL_NAME_ITEMS = "_ls_ttl";

    var _checkTTl = function _checkTTl2(ttl) {
        return ttl ? ttl > Date.now() : true;
    };

    var _parseTTLValues = function _parseTTLValues2() {
        var value = window.localStorage.getItem(TTL_NAME_ITEMS);

        if (value) {
            try {
                var obj = JSON.parse(value);
                return obj;
            } catch (e) {}
        }

        return {};
    };

    var _setTTLValues = function _setTTLValues2(ttlValues) {
        window.localStorage.setItem(TTL_NAME_ITEMS, JSON.stringify(ttlValues));
    };

    var _saveTTLValues = function _saveTTLValues2(name, expires) {
        var ttlValues = _parseTTLValues() || {};

        if (expires === void 0) {
            delete ttlValues[name];

            _setTTLValues(ttlValues);

            return true;
        }

        var expiresTime = expiresToDate(expires).getTime();

        if (expiresTime > Date.now()) {
            ttlValues[name] = expiresTime.toString(36);

            _setTTLValues(ttlValues);

            return true;
        }

        return false;
    };

    var _checkTTLValues = function _checkTTLValues2() {
        var ttls = _parseTTLValues() || {};
        var ttlsUpdated = {};
        Object.keys(ttls).forEach(function (key) {
            var expire = ttls[key] ? parseInt(ttls[key], 36) : null;

            if (!_checkTTl(expire)) {
                window.localStorage.removeItem(key);
            } else {
                ttlsUpdated[key] = ttls[key];
            }
        });

        if (JSON.stringify(ttls) !== JSON.stringify(ttlsUpdated)) {
            _setTTLValues(ttlsUpdated);
        }
    };

    var _get = function _get2(key) {
        var _a;

        _checkTTLValues();

        return (_a = window.localStorage.getItem(key)) !== null && _a !== void 0 ? _a : null;
    };

    var _getNames = function _getNames2() {
        return Object.keys(window.localStorage);
    };

    var _set = function _set2(key, value, options) {
        if (options === void 0) {
            options = {};
        }

        if (_saveTTLValues(key, options.expires)) {
            window.localStorage.setItem(key, value);
        }
    };

    var _remove = function _remove2(key) {
        window.localStorage.removeItem(key);
    };

    _checkTTLValues();

    return {
        get: _get,
        set: _set,
        getNames: _getNames,
        remove: _remove,
        expires: _checkTTLValues
    };
}();

var _sessionStorage = function () {
    var _get = function _get2(key) {
        return window.sessionStorage.getItem(key);
    };

    var _set = function _set2(key, value) {
        return window.sessionStorage.setItem(key, value);
    };

    var _remove = function _remove2(key) {
        window.sessionStorage.removeItem(key);
    };

    var _getNames = function _getNames2() {
        return Object.keys(window.localStorage);
    };

    return {
        get: _get,
        set: _set,
        getNames: _getNames,
        remove: _remove
    };
}();

var createConsentWrapper = function createConsentWrapper(config) {
    return function () {
        var consent2 = config.dataLayer.get("consent");
        return consent2 && consent2[config.productName] || null;
    };
};

var onDlChangeConsent = function onDlChangeConsent(config, cb) {
    var prevValue = null;

    var _onChangeHandler = function _onChangeHandler(data) {
        var consent2 = (data === null || data === void 0 ? void 0 : data[config.productName]) || null;

        if (consent2 !== prevValue) {
            prevValue = consent2;
            cb(consent2);
        }
    };

    config.dataLayer.addChangeListener("consent", _onChangeHandler);
    return function () {
        config.dataLayer.removeChangeListener(_onChangeHandler);
    };
};

var isMask = function isMask(str) {
    return str.includes("*");
};

var createMask = function createMask(name, value) {
    return [new RegExp("^" + name.replace(/\*/g, ".*") + "$"), value];
};

var itemsToMask = function itemsToMask(items) {
    return Object.keys(items).filter(isMask).map(function (i) {
        return createMask(i, items[i]);
    });
};

var getByMask = function getByMask(name, masks) {
    for (var i = 0; i < masks.length; i++) {
        if (masks[i][0].test(name)) {
            return masks[i][1];
        }
    }

    return null;
};

var getConsentModifier = function getConsentModifier(itemType, modifier) {
    if (!modifier) {
        return null;
    }

    var masks = [];
    var keys = {};

    for (var i = 0; i < modifier.patches.length; i++) {
        var _a = modifier.patches[i],
            action = _a.action,
            _b = _a.with,
            data = _b === void 0 ? null : _b,
            item = _a.item;

        if (item.type === itemType) {
            var modifier_1 = {
                action: action,
                data: data
            };
            keys[item.key] = modifier_1;

            if (isMask(item.key)) {
                masks.push(createMask(item.key, modifier_1));
            }
        }
    }

    var _getModifier = function _getModifier(name) {
        return keys[name] || getByMask(name, masks);
    };

    return {
        source: modifier.source,
        getModifier: _getModifier
    };
};

var checkMode = function checkMode(mode, config) {
    switch (mode) {
        case "opt-in":
            return true;

        case "essential":
            return config === "essential" || config === "mandatory";

        case "opt-out":
            return config === "mandatory";

        default:
            return true;
    }
};

var checkAction = function checkAction(action) {
    switch (action) {
        case "include":
            return true;

        case "exclude":
            return false;

        case "obfuscate":
            return true;
    }
};

var getData = function getData(action, data) {
    return action === "obfuscate" ? data : null;
};

var createCheckConsentWrapper = function createCheckConsentWrapper(config) {
    var items = Object.assign({}, config.items);
    var masks = itemsToMask(items);

    var getConfigByName = function getConfigByName(name) {
        return items[name] || getByMask(name, masks) || "optional";
    };

    function checkConsent(name, consentValue) {
        var isSingle = !Array.isArray(name);
        var names = isSingle ? [name] : name;

        var result = function () {
            var getDefaultResult = function getDefaultResult() {
                return names.map(function (name2) {
                    return {
                        name: name2,
                        allowed: true
                    };
                });
            };

            var consent2 = consentValue || config.getConsent();

            if (!consent2) {
                return getDefaultResult();
            }

            if (consent2.mode === "custom") {
                var consentModifier_1 = getConsentModifier(config.type, consent2.modifier);

                if (!consentModifier_1) {
                    return getDefaultResult();
                }

                var source_1 = consentModifier_1.source;
                return names.map(function (name2) {
                    var modifier = consentModifier_1.getModifier(name2);
                    var data = getData(modifier === null || modifier === void 0 ? void 0 : modifier.action, modifier === null || modifier === void 0 ? void 0 : modifier.data);
                    var item = {
                        name: name2,
                        allowed: (modifier === null || modifier === void 0 ? void 0 : modifier.action) ? checkAction(modifier.action) : checkMode(source_1, getConfigByName(name2))
                    };

                    if (data !== null) {
                        item.data = data;
                    }

                    return item;
                });
            }

            return names.map(function (name2) {
                return {
                    name: name2,
                    allowed: checkMode(consent2.mode, getConfigByName(name2))
                };
            });
        }();

        return isSingle ? result[0] : result;
    }

    return checkConsent;
};

var itemsToNames = function itemsToNames(items, getNames) {
    var masks = itemsToMask(items);
    var keys = Object.keys(items);

    if (masks.length) {
        return getNames().filter(function (name) {
            return getByMask(name, masks);
        }).concat(keys.filter(function (key) {
            return !isMask(key);
        }));
    }

    return keys;
};

var createBaseConsentStorage = function createBaseConsentStorage(storage, itemType, config) {
    var getConsent = createConsentWrapper(config);
    var checkProperty = createCheckConsentWrapper({
        items: config.items,
        type: itemType,
        getConsent: getConsent
    });

    var _init = function _init() {
        var removeOnInit = config.checkConsentOnInit === void 0 ? config.enableAutoRemove : false;

        if (config.enableAutoRemove) {
            onDlChangeConsent(config, onChangeConsentMode);
        }

        if (removeOnInit) {
            onChangeConsentMode(getConsent());
        }
    };

    var onChangeConsentMode = function onChangeConsentMode(consent2) {
        var _a;

        (_a = checkProperty(itemsToNames(config.items, storage.getNames), consent2)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
            if (!item.allowed) {
                storage.remove(item.name);
            }
        });
    };

    var set = function set(name, value, options) {
        var consent2 = checkProperty(name);

        if (consent2 === null || consent2 === void 0 ? void 0 : consent2.allowed) {
            var args = options ? [name, value, options] : [name, value];
            storage.set.apply(null, args);
        }
    };

    _init();

    return Object.assign({}, storage, {
        set: set,
        check: checkProperty
    });
};

var createLocalStorage = function createLocalStorage(config) {
    return createBaseConsentStorage(_localStorage, "localStorage", config);
};

var ITEM_TYPE = "cookie";

var createCookie = function createCookie(config) {
    var getConsent = createConsentWrapper(config);
    var cookieOptions = {};
    var checkProperty = createCheckConsentWrapper({
        items: config.items,
        type: ITEM_TYPE,
        getConsent: getConsent
    });

    var _init = function _init() {
        var removeOnInit = !!(config.checkConsentOnInit === void 0 ? config.enableAutoRemove : false);

        if (config.enableAutoRemove) {
            cookieOptions = config.enableAutoRemove;
            onDlChangeConsent(config, onChangeConsentMode);
        }

        if (removeOnInit) {
            onChangeConsentMode(getConsent());
        }
    };

    var onChangeConsentMode = function onChangeConsentMode(consent2) {
        var _a;

        (_a = checkProperty(itemsToNames(config.items, _cookie2.getNames), consent2)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
            if (!item.allowed) {
                _cookie2.remove(item.name, cookieOptions);
            }
        });
    };

    var set = function set(name, value, options, limitValue) {
        var _a;

        var consent2 = checkProperty(name);

        if (consent2 === null || consent2 === void 0 ? void 0 : consent2.allowed) {
            _cookie2.set(name, (_a = consent2.data) !== null && _a !== void 0 ? _a : value, options, limitValue);
        }
    };

    _init();

    return Object.assign({}, _cookie2, {
        check: checkProperty,
        set: set
    });
};

var createSessionStorage = function createSessionStorage(config) {
    return createBaseConsentStorage(_sessionStorage, "sessionStorage", config);
};

var createBasePropertyWrapper = function createBasePropertyWrapper(itemType, config) {
    return {
        check: createCheckConsentWrapper({
            items: config.items,
            type: itemType,
            getConsent: createConsentWrapper(config)
        })
    };
};

var createProperty = function createProperty(config) {
    return createBasePropertyWrapper("property", config);
};

var createEvent = function createEvent(config) {
    return createBasePropertyWrapper("event", config);
};

var consent = {
    createLocalStorage: createLocalStorage,
    createProperty: createProperty,
    createCookie: createCookie,
    createSessionStorage: createSessionStorage,
    createEvent: createEvent
};
export { consent, dist_exports as storage };
