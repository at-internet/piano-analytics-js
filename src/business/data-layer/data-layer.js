/**
 * @license
 * Piano Browser SDK-DataLayer@2.6.1.
 * Copyright 2010-2022 Piano Software Inc.
 */
/******************************************************************************
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
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var createBaseParam = function (defaultValue, cookieName) {
    if (cookieName === void 0) { cookieName = '_pctx'; }
    return ({
        cookieName: cookieName,
        readonly: false,
        init: function (valueFromCookie) { var _a; return (_a = valueFromCookie !== null && valueFromCookie !== void 0 ? valueFromCookie : defaultValue) !== null && _a !== void 0 ? _a : null; },
        refresh: function (prevValue) { return prevValue; },
        update: function (prevValue) { return prevValue; },
        set: function (newValue) { return newValue; },
        get: function (value) { return value; }
    });
};
var createStaticParam = function (defaultValue) { return (__assign(__assign({}, createBaseParam(defaultValue)), { cookieName: null })); };

var userState = createBaseParam('anon');

/**
 * cx.js backwards compatible function.
 * @returns {string} - random string compatible with cx.js library.
 */
var randomStringCxCompatible = function () {
    var randomString = new Date().getTime().toString(36);
    while (randomString.length < 16) {
        randomString += Math.round(Math.random() * 2147483647).toString(36);
    }
    return randomString.substr(0, 16);
};

var isNotEmpty = function (val) { return val !== null && val !== undefined; };
var filterObjectValues = function (obj, filter) {
    if (!obj) {
        return obj;
    }
    // Else add to the map
    return Object.keys(obj)
        .filter(function (k) { return filter(obj[k]); })
        .reduce(function (a, k) {
            var _a;
            return (__assign(__assign({}, a), (_a = {}, _a[k] = obj[k], _a)));
        }, {});
};
var combineCookieConfig = function (params, cookieWrappers) { return ({
    fields: Object.keys(params).reduce(function (res, paramName) {
        var cookieName = params[paramName].cookieName;
        if (cookieName !== null) {
            res[paramName] = cookieName;
        }
        return res;
    }, {}),
    cookieByName: cookieWrappers
}); };
var stringSet = function () {
    var data = {};
    return {
        add: function (value) {
            data[value] = true;
        },
        values: function () {
            return Object.keys(data);
        }
    };
};
var validateObj = function (obj, mapFilter) {
    if (typeof obj !== 'object') {
        return obj;
    }
    return Object.keys(obj).reduce(function (r, k) {
        var val = obj[k];
        var validate = mapFilter[k];
        var value = validate && validate(val);
        if (value !== undefined) {
            r[k] = value;
        }
        return r;
    }, {});
};
var toBoolean = function (val) { return val === 'true' || val === true; };
var memo = function (fn, checkDeps) {
    var prevDeps = NaN;
    var prevValue = NaN;
    var prevRes;
    return function (a) {
        var curDeps = checkDeps === null || checkDeps === void 0 ? void 0 : checkDeps();
        if (a !== prevValue || prevDeps !== curDeps) {
            prevDeps = curDeps;
            prevValue = a;
            prevRes = fn(a);
        }
        return prevRes;
    };
};
var onMemo = function (fn) {
    var prevRes;
    return function (onChange) {
        var res = fn();
        if (res !== prevRes) {
            prevRes = res;
            onChange(res);
        }
    };
};
var tryFn = function (resolve, reject) {
    try {
        return resolve();
    }
    catch (e) {
        return reject ? tryFn(reject) : null;
    }
};
var parseJSON = function (data, useBase64) {
    if (useBase64 === void 0) { useBase64 = false; }
    return (tryFn(function () { return JSON.parse(data); }, function () { return (useBase64 ? JSON.parse(window.atob(data)) : null); }) || null);
};
var toJSON = function (data, useBase64) {
    if (useBase64 === void 0) { useBase64 = false; }
    var str = JSON.stringify(data);
    return tryFn(function () { return (useBase64 ? window.btoa(str) : str); }) || str;
};

var removeCxUsers = function (allUsers) {
    return filterObjectValues(allUsers, function (val) { return val.type !== 'CX'; });
};
var users = __assign(__assign({}, createBaseParam(null)), { init: function (valueFromCookie) { return removeCxUsers(valueFromCookie || null); }, refresh: removeCxUsers, set: function (value, prev) {
        // if new value is a null then rewrite this parameter
        if (value === null) {
            return null;
        }
        // Else add to the map
        return filterObjectValues(__assign(__assign({}, prev), value), function (val) { return val !== null; });
    } });

var GLOBAL_CONFIG_NAME = 'pdl';
// @ts-ignore
var getGlobalConfig$1 = function () { return window[GLOBAL_CONFIG_NAME] || {}; };

var generateInitProtectedValue = function (_prev, changeConfig) {
    changeConfig({
        protect: true // protect rewriting after init (page loading)
    });
    return getGlobalConfig$1().pageViewId || randomStringCxCompatible();
};
var generateAnewProtectedValue = function (_prev, changeConfig) {
    changeConfig({
        protect: true // protect rewriting after init (page loading)
    });
    return randomStringCxCompatible();
};
var pageViewId = __assign(__assign({}, createStaticParam()), { init: generateInitProtectedValue, refresh: generateAnewProtectedValue, update: generateAnewProtectedValue, set: function (value, _prevValue, changeConfig) {
        changeConfig({
            protect: true // protect rewriting after change
        });
        return value;
    } });

var browserId = __assign(__assign({}, createBaseParam(null, '_pcid')), { init: function (_cookieInitValue, changeConfig) {
        changeConfig({
            protect: true
        });
        // Get the value from cookie. If there is no data, then generate a new random string
        return _cookieInitValue || randomStringCxCompatible();
    },
    // Need to update value - generate a new value
    update: function (_prev, changeConfig) {
        changeConfig({
            protect: true
        });
        return randomStringCxCompatible();
    },
    // Need to set a specific value
    set: function (value, _prev, changeConfig) {
        changeConfig({
            protect: true
        });
        return value;
    } });

var RESERVED_PRODUCT = 'DL';
var PRODUCTS = ['PA', 'DMP', 'COMPOSER', 'ID', 'VX', 'ESP', 'Social Flow', RESERVED_PRODUCT].map(function (name, id) { return ({
    name: name,
    id: id
}); });
var PRODUCTS_MAP = PRODUCTS.reduce(function (res, _a, index) {
    var _b;
    var name = _a.name;
    return (__assign(__assign({}, res), (_b = {}, _b[name] = index, _b[name.toLowerCase()] = index, _b)));
}, {});

var modes = ['opt-in', 'opt-out', 'essential'];
var actions = ['include', 'exclude', 'obfuscate'];
var oneOf = function (name, value) { return "\"".concat(name, "\" should be one of ").concat(value.join(', ')); };
// tslint:disable-next-line no-empty
var emptyFn = function () { };
var addPrefix = function (prefix, log) {
    return function (val) {
        return log(prefix + val);
    };
};
var toProduct = function (product, log) {
    if (log === void 0) { log = emptyFn; }
    var index = PRODUCTS_MAP[product.toLowerCase()];
    if (index !== undefined) {
        return PRODUCTS[index].name;
    }
    log("\"".concat(product, "\" is not found"));
    return null;
};
var toMode = function (mode) {
    return modes.includes(mode) ? mode : null;
};
var validateModifier = function (modifier, log) {
    if (log === void 0) { log = emptyFn; }
    var source = modifier.source;
    var newPatches = modifier.patches || [];
    if (!toMode(source)) {
        log(oneOf('source', modes));
        source = 'opt-in';
    }
    if (!Array.isArray(newPatches)) {
        log('"patches" should be an array');
        newPatches = [];
    }
    newPatches = newPatches.reduce(function (res, patch, i) {
        if (typeof patch !== 'object' || Array.isArray(patch)) {
            log("patch[".concat(i, "]: should be type of {action, item, with?}"));
            return res;
        }
        var action = patch.action, item = patch.item;
        if (!actions.includes(action)) {
            log("patch[".concat(i, "]: ") + oneOf('action', actions));
            return res;
        }
        if (!item || typeof item !== 'object' || !item.key || !item.type) {
            log("patch[".concat(i, "]: \"item\" should be type of {key, type}"));
            return res;
        }
        res.push(patch);
        return res;
    }, []);
    return {
        source: source,
        patches: newPatches
    };
};
var validateConsent = function (consent, log) {
    if (log === void 0) { log = emptyFn; }
    if (!consent) {
        return null;
    }
    var result = {};
    if (consent.products) {
        if (!Array.isArray(consent.products)) {
            log('consent.products: should be an array');
        }
        else {
            result.products = consent.products.reduce(function (res, product) {
                var validProduct = toProduct(product, addPrefix('consent.products: ', log));
                if (validProduct) {
                    res.push(validProduct);
                }
                return res;
            }, []);
        }
    }
    if (consent.defaultPreset) {
        result.defaultPreset = Object.keys(consent.defaultPreset).reduce(function (res, productKey) {
            var product = toProduct(productKey, addPrefix('consent.defaultPreset: ', log));
            var mode = toMode(consent.defaultPreset[productKey]);
            if (!mode) {
                log('consent.defaultPreset: ' + oneOf(productKey, modes));
            }
            if (product && mode) {
                res[product] = mode;
            }
            return res;
        }, {});
    }
    return result;
};
var validateConsentMemo = memo(validateConsent);
var validateMigration = function (migration, log) {
    if (log === void 0) { log = emptyFn; }
    return Object.keys(migration || {}).reduce(function (res, propName) {
        var data = migration === null || migration === void 0 ? void 0 : migration[propName];
        var product = toProduct((data === null || data === void 0 ? void 0 : data.source) || '', log);
        res[propName] = __assign(__assign({}, data), { source: product });
        return res;
    }, {});
};

var modeIdMap = ['opt-in', 'essential', 'opt-out'].reduce(function (res, mode, index) {
    var _a;
    return (__assign(__assign({}, res), (_a = {}, _a[index] = mode, _a)));
}, {});
// opt-in - 0
// essential - 1
// opt-out - 2
/*!
| \#  | name/product                                                              | PA        | DMP     | COMPOSER  | ID        | VX        | ESP     | Social Flow |
| --- | -------------------------------------------------------------------------- | --------- | ------- | --------- | --------- | --------- | ------- | ----------- |
| 0   | Default (not consent selected)                                             | opt-in    | opt-in  | opt-in    | opt-in    | opt-in    | opt-in  | opt-in      |
| 1   | Audience measurement                                                       | opt-in    | opt-in  | opt-out   | opt-out   | opt-out   | opt-out | opt-out     |
| 2   | Audience measurement (Exempted)                                            | essential | opt-out | opt-out   | opt-out   | opt-out   | opt-out | opt-out     |
| 3   | Content performance measurement                                            | opt-in    | opt-out | opt-in    | opt-out   | opt-out   | opt-out | opt-in      |
| 4   | Content performance measurement (Exempted)                                 | essential | opt-out | opt-out   | opt-out   | opt-out   | opt-out | essential   |
| 5   | Personalized content profile creation                                      | opt-out   | opt-in  | opt-in    | opt-out   | opt-out   | opt-out | opt-out     |
| 6   | Personalized ads profile creation                                          | opt-out   | opt-in  | opt-out   | opt-out   | opt-out   | opt-out | opt-out     |
| 7   | Ads performance measurement                                                | opt-out   | opt-out | opt-out   | opt-out   | opt-out   | opt-out | opt-in      |
| 8   | User experience personalization (registration, subscription, newsletter)   | opt-out   | opt-out | opt-in    | opt-in    | opt-in    | opt-in  | opt-out     |
| 9   | Subscription (Exempted)                                                    | opt-out   | opt-out | essential | opt-out   | essential | opt-out | opt-out     |
| 10  | Registration (Exempted)                                                    | opt-out   | opt-out | essential | essential | opt-out   | opt-out | opt-out     |
*/
var PRESETS_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 0],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [0, 2, 0, 2, 2, 2, 0, 0],
    [1, 2, 2, 2, 2, 2, 1, 1],
    [2, 0, 0, 2, 2, 2, 2, 0],
    [2, 0, 2, 2, 2, 2, 2, 0],
    [2, 2, 2, 2, 2, 2, 0, 2],
    [2, 2, 0, 0, 0, 0, 2, 0],
    [2, 2, 1, 2, 1, 2, 2, 1],
    [2, 2, 1, 1, 2, 2, 2, 1] // 10
];
var convertIndexModes = function (modes) {
    return modes.reduce(function (res, modeIndex, productId) {
        var _a;
        return (__assign(__assign({}, res), (_a = {}, _a[productId] = { mode: modeIdMap[modeIndex] }, _a)));
    }, {});
};
var PRESETS = PRESETS_TABLE.map(function (modes, id) { return ({
    id: id,
    preset: convertIndexModes(modes)
}); });
var onChangeConfigPresets = onMemo(function () { var _a; return (_a = validateConsentMemo(getGlobalConfig$1().consent)) === null || _a === void 0 ? void 0 : _a.defaultPreset; });
var getPresets = (function () {
    var result = PRESETS;
    return function () {
        onChangeConfigPresets(function (defaultPreset) {
            result = __spreadArray([], PRESETS, true);
            if (defaultPreset) {
                result[0] = {
                    id: 0,
                    preset: __assign({}, result[0].preset)
                };
                Object.keys(defaultPreset).forEach(function (name) {
                    var mode = defaultPreset[name];
                    var productId = PRODUCTS_MAP[name];
                    result[0].preset[productId] = { mode: mode };
                });
            }
        });
        return result;
    };
})();
var getDefaultPreset = function () { return getPresets()[0].preset; };

var isConsentMode = function (mode) { return ['opt-in', 'essential', 'opt-out', 'custom'].includes(mode); };
// @ts-ignore
var getGlobalConfigModifiers = function () { return getGlobalConfig$1().consent_modifiers || null; };
var getRequireConsent = function () { return !!getGlobalConfig$1().requireConsent; };
var setPresets = function (presetIndexes) {
    var currentPreset = null;
    presetIndexes.forEach(function (presetIndex) {
        var preset = PRESETS_TABLE[presetIndex];
        if (!currentPreset && preset) {
            currentPreset = preset;
            return;
        }
        if (!currentPreset || !preset) {
            return;
        }
        currentPreset = currentPreset.map(function (indexMode, productIndex) {
            if (preset[productIndex] === undefined) {
                return indexMode;
            }
            return Math.min(indexMode, preset[productIndex]);
        });
    });
    return currentPreset && convertIndexModes(currentPreset);
};
var convertToConsent = function (val) {
    return Object.keys(val).reduce(function (res, key) {
        var _a;
        // @ts-ignore
        var config = val[key];
        var numberKey = Number(key);
        if (Number.isNaN(numberKey)) {
            numberKey = PRODUCTS_MAP[key.toLowerCase()];
            if (numberKey === undefined) {
                return res;
            }
        }
        if (!isConsentMode(config.mode)) {
            return res;
        }
        return __assign(__assign({}, res), (_a = {}, _a[numberKey] = {
            mode: config.mode
        }, _a));
    }, null);
};
var onChangeConfigProducts = onMemo(function () { var _a; return (_a = validateConsentMemo(getGlobalConfig$1().consent)) === null || _a === void 0 ? void 0 : _a.products; });
var getProducts = (function () {
    var result = PRODUCTS;
    return function () {
        onChangeConfigProducts(function (config) {
            if (config) {
                result = PRODUCTS.filter(function (product) {
                    return config.includes(product.name) || product.name === RESERVED_PRODUCT;
                });
            }
            else {
                result = PRODUCTS;
            }
        });
        return result;
    };
})();
var filterByProduct = function (value) {
    return getProducts().reduce(function (res, product) {
        res[product.id] = value[product.id] || getDefaultPreset()[product.id];
        return res;
    }, {});
};
var consent = __assign(__assign({}, createBaseParam(null, '_pprv')), { init: function (valueFromCookie) {
        return getRequireConsent() && valueFromCookie
            ? filterByProduct(__assign(__assign({}, getDefaultPreset()), valueFromCookie))
            : null;
    }, set: function (val, prevVal) {
        var _a;
        if (!getRequireConsent()) {
            return null;
        }
        if (val === null || val === undefined) {
            return prevVal;
        }
        var newConsent;
        if (typeof val === 'number') {
            newConsent = ((_a = getPresets()[val]) === null || _a === void 0 ? void 0 : _a.preset) || null;
        }
        else if (Array.isArray(val)) {
            newConsent = setPresets(val);
        }
        else {
            newConsent = convertToConsent(val);
        }
        return newConsent
            ? filterByProduct(__assign(__assign({}, prevVal), newConsent))
            : prevVal;
    }, get: memo(function (value) {
        return value &&
            Object.keys(value).reduce(function (res, key) {
                var _a;
                var productName = PRODUCTS[Number(key)].name;
                var config = __assign({}, value[Number(key)]);
                if (config.mode === 'custom') {
                    config.modifier = ((_a = getGlobalConfigModifiers()) === null || _a === void 0 ? void 0 : _a[productName]) || null;
                }
                res[productName] = config;
                return res;
            }, {});
    }, function () { return getGlobalConfigModifiers(); }) });
var consentPresets = __assign(__assign({}, createStaticParam()), { init: getPresets, set: getPresets });
var products = __assign(__assign({}, createStaticParam()), { init: getProducts, set: getProducts });
var consentModifiers = __assign(__assign({}, createStaticParam(null)), { readonly: true, set: function () { return null; },
    // @ts-ignore
    get: getGlobalConfigModifiers });

var toDate = function (val) {
    var timeStamp = Number(val);
    if (!Number.isNaN(timeStamp)) {
        return timeStamp;
    }
    return String(val);
};
var toArrayString = function (val) {
    return Array.isArray(val) ? val : val.split(',').map(function (s) { return s.trim().replace(/^['"](.+)['"]$/, '$1'); });
};
var asIs = function (val) { return val; };
var Validators = {
    id: asIs,
    type: asIs,
    zone: asIs,
    createdAt: toDate,
    modifiedAt: toDate,
    authors: toArrayString,
    section: asIs,
    tags: toArrayString,
    keywords: toArrayString,
    title: asIs,
    description: asIs,
    isNative: toBoolean
};
var isAll = function (take) { return take === 'all'; };
var isFirst = function (take) { return take === 'first'; };
var isLast = function (take) { return take === 'last'; };
function query(selector, take) {
    if (selector === void 0) { selector = 'meta'; }
    if (isFirst(take)) {
        return document.querySelector(selector);
    }
    var els = document.querySelectorAll(selector);
    return isLast(take) ? els[els.length - 1] : Array.from(els);
}
var queryMetasMemo = (function () {
    var res = null;
    var refresh = function () {
        res = query() || null;
        if (res) {
            setTimeout(function () {
                res = null;
            }, 0);
        }
    };
    return {
        refresh: refresh,
        find: function (attrs, hasContent) {
            if (hasContent === void 0) { hasContent = false; }
            return res
                ? res.reduce(function (obj, el) {
                    for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                        var attr = attrs_1[_i];
                        var name_1 = ((attr === 'name' ? el.name : el.getAttribute(attr)) || '').trim().toLowerCase();
                        var content = el.content;
                        if (!name_1 || (hasContent && !content)) {
                            continue;
                        }
                        if (!obj[name_1]) {
                            obj[name_1] = [];
                        }
                        obj[name_1].push(el);
                        break;
                    }
                    return obj;
                }, {})
                : null;
        }
    };
})();
var readMetaValue = function (config) {
    var metaContent = function (meta) { return meta.content; };
    var getContent = config.getContent || metaContent;
    var readSpecificSelector = function () {
        var el = query(config.selector, config.take || 'first');
        return (el && getContent(el)) || null;
    };
    var readFromMeta = function () {
        var metas = queryMetasMemo.find(config.attr || ['name'], config.hasContent);
        var names = config.names || [];
        var single = !isAll(config.take);
        var last = isLast(config.take);
        if (!metas) {
            return null;
        }
        var _loop_1 = function (name_2) {
            var result = [];
            var elements = metas[name_2];
            if (elements) {
                if (single) {
                    var index = last ? elements.length - 1 : 0;
                    var meta = elements[index];
                    return { value: getContent(meta) || '' };
                }
                elements.forEach(function (el) {
                    result = result.concat(getContent(el) || '');
                });
            }
            if (result.length) {
                return { value: result };
            }
        };
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_2 = names_1[_i];
            var state_1 = _loop_1(name_2);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    };
    return (config.selector ? readSpecificSelector() : readFromMeta());
};
var readMetaValues = function (configs) {
    for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
        var conf = configs_1[_i];
        var val = readMetaValue(conf);
        if (val) {
            return val;
        }
    }
};
var append = function (data, name, config) {
    var validate = Validators[name];
    var exist = Boolean(data[name]);
    var readValue = typeof config === 'function'
        ? config
        : function () { return (Array.isArray(config) ? readMetaValues(config) : readMetaValue(config)); };
    if (!exist && validate) {
        var value = readValue();
        var validatedValue = value && validate(value);
        if (validatedValue) {
            data[name] = validatedValue;
        }
    }
};

// <meta property="" content="">
var property = function (val) { return ({
    attr: ['property'],
    names: [val]
}); };
var name = function (val) { return ({
    names: [val]
}); };
var appendLegacyComposer = function (prevValue) {
    // og:description & og:title will be parsed from crawler
    // 'keywords' & 'news_keywords' will be parsed from crawler
    append(prevValue, 'type', property('og:type'));
    append(prevValue, 'section', name('section'));
    append(prevValue, 'id', name('id'));
    append(prevValue, 'authors', name('author'));
};

var monthNames = {
    januar: '01',
    january: '01',
    jan: '01',
    februar: '02',
    february: '02',
    feb: '02',
    mars: '03',
    march: '03',
    mar: '03',
    april: '04',
    apr: '04',
    mai: '05',
    may: '05',
    juni: '06',
    june: '06',
    jun: '06',
    juli: '07',
    july: '07',
    jul: '07',
    august: '08',
    aug: '08',
    september: '09',
    sept: '09',
    sep: '09',
    oktober: '10',
    october: '10',
    okt: '10',
    oct: '10',
    november: '11',
    nov: '11',
    desember: '12',
    december: '12',
    dec: '12',
    des: '12'
};
var dateFormatRegex = function (input) {
    var format = input
        .replace(/DAY/g, '(0?[1-9]|[12][0-9]|3[01])')
        .replace(/MONTHLONG/g, '(' + Object.keys(monthNames).join('|') + ')')
        .replace(/MONTH/g, '(0?[1-9]|1[012])')
        .replace(/YEAR2/g, '([0-9][0-9])')
        .replace(/YEAR/g, '(197[1-9]|19[8-9][0-9]|20[0-9][0-9])')
        .replace(/TIME/g, '([0-9][0-9]):([0-9][0-9]):([0-9][0-9])(?:\\.[0-9][0-9][0-9])?([zZ]|[+-][0-9][0-9](?::?[0-9][0-9])?)?');
    var order = input.replace(/.*?([YMD])(EAR|ONTH|AY).*?/g, '$1').substring(0, 3); // "YMD", "DMY" or "MDY".
    return [new RegExp(format), order];
};
var dateFormats = (function () {
    return [
        '\\bDAY\\.MONTH\\.YEAR\\b',
        '\\bDAY\\.?\\s{0,3}MONTHLONG\\.?\\s{1,3}YEAR\\b',
        '\\bYEAR-MONTH-DAY(?:[tT]|\\b)',
        '\\bMONTHLONG\\.?\\s{0,3}DAY(?:st|nd|rd|th)?,?\\s{1,3}YEAR\\b',
        '\\bDAY(?:st|nd|rd|th|\\.)?\\s{0,3}MONTHLONG\\.?,?\\s{1,3}YEAR\\b',
        '\\bYEAR[/年]MONTH[/月]DAY(?=\\b|日)',
        '\\bDAY\\.MONTH\\.YEAR2\\b',
        '\\bDAY/MONTH/YEAR\\b'
    ].map(dateFormatRegex);
})();
var dateTimeRegex = dateFormatRegex('YEAR-MONTH-DAY[tT]TIME')[0];
var int = function (val) { return (val && parseInt(val, 10)) || 0; };
function dateToISO(year, month, day, hour, minute, second, zone) {
    var then = new Date(Date.UTC(int(year), int(month) - 1, int(day), int(hour), int(minute), int(second)));
    var zoneMatch = (zone || '').match(/^([+-][0-9][0-9])(?::?([0-9][0-9])?)$/);
    if (zoneMatch) {
        then = new Date(then.getTime() - Number(zoneMatch[1]) * 3600000 - (Number(zoneMatch[2]) || 0) * 60000);
    }
    var msPerDay = 1000 * 24 * 60 * 60;
    var diff = Date.now() - then.getTime();
    return diff > 0 || -diff < 2 * msPerDay ? then.toISOString() : null;
}
function anyDateToISODate(date) {
    date = date.toLowerCase();
    var fullMatch = date.match(dateTimeRegex);
    if (fullMatch) {
        return dateToISO(fullMatch[1], fullMatch[2], fullMatch[3], fullMatch[4], fullMatch[5], fullMatch[6], fullMatch[7]);
    }
    for (var _i = 0, dateFormats_1 = dateFormats; _i < dateFormats_1.length; _i++) {
        var format = dateFormats_1[_i];
        var match = date.match(format[0]);
        if (match) {
            match =
                format[1] === 'DMY'
                    ? ['', match[3], match[2], match[1]]
                    : format[1] === 'MDY'
                        ? ['', match[3], match[1], match[2]]
                        : match;
            var year = match[1].length === 2 ? (int(match[1]) < 60 ? '20' : '19') + match[1] : match[1];
            var month = match[2].length <= 2 ? match[2] : monthNames[match[2]];
            return dateToISO(year, month, match[3]);
        }
    }
}

var clearContent = function (str) {
    return str
        .replace(/<\/?[^>?]*\/?>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};
function authorNormalization(author) {
    if (author === void 0) { author = ''; }
    return clearContent(author.replace(/,(?=\s*(jr|sr)(\.?)\b)/g, ' '));
}
function splitAuthors(authors) {
    if (authors === void 0) { authors = ''; }
    var parsedAuthors = authors
        .replace(/\n+/, ';')
        .replace(/(\<|&lt;)br(\>|&gt;)/, ';')
        .replace(/\b(and|und|og)\b/g, ';');
    return authorNormalization(parsedAuthors).split(/[,;]/);
}
var getContentAuthors = function (el) {
    var separator = el.getAttribute('data-separator');
    var content = el.content;
    return separator ? authorNormalization(content).split(separator) : splitAuthors(content);
};

var takeLast = function (config) { return (__assign(__assign({}, config), { take: 'last' })); };
var hasContentAndLast = function (config) { return (__assign(__assign({}, config), { take: 'last', hasContent: true, getContent: function (el) { return clearContent(el.content || ''); } })); };
// cxenseinternal-publishtime
var publishTimeConfig = [
    takeLast({
        attr: ['name', 'property', 'itemprop'],
        names: [
            'cxenseparse:publishtime',
            'cxenseparse:recs:publishtime',
            'article:published_time',
            'date',
            'dc.date',
            'dc.date.created',
            'dc.terms.issued',
            'pub_date',
            'article.published',
            'datepublished',
            'og:article:published_time'
        ]
    }),
    takeLast({
        selector: 'time.published[datetime],time[pubdate][datetime]',
        getContent: function (el) { return el.getAttribute('datetime'); }
    }),
    takeLast({
        selector: 'time[datetime]',
        getContent: function (el) { return el.getAttribute('datetime'); }
    })
];
// cxenseinternal-modifiedtime
var modifiedTimeConfig = {
    selector: 'meta[property="article:modified_time"]' // take first
};
// cxenseinternal-author
var authorConfig = [
    {
        attr: ['property', 'name'],
        names: [
            // combine the data from all attributes
            'cxenseparse:author',
            'og:article:author',
            'article:author',
            'og:book:author',
            'book:author',
            'author',
            'dc.creator',
            'article.author'
        ],
        take: 'all',
        getContent: getContentAuthors
    }
];
// cxenseinternal-keywords
var keywordsConfig = [
    hasContentAndLast({
        names: ['cxenseparse:keywords']
    }),
    hasContentAndLast({
        attr: ['property', 'name'],
        names: ['news_keywords']
    }),
    hasContentAndLast({
        names: ['keywords']
    })
];
// cxenseinternal-description
var descriptionConfig = [
    hasContentAndLast({
        names: ['cxenseparse:description']
    }),
    hasContentAndLast({
        attr: ['property'],
        names: ['og:description']
    }),
    hasContentAndLast({
        names: ['description']
    })
];
// cxenseinternal-title
var internalTitle = [
    {
        names: ['cxenseparse:title']
    },
    takeLast({
        attr: ['property', 'name'],
        names: ['og:title']
    })
];
var appendLegacyCrawler = function (data) {
    append(data, 'createdAt', function () {
        var publishTime = readMetaValues(publishTimeConfig);
        return publishTime ? anyDateToISODate(publishTime.toLowerCase()) : null;
    });
    append(data, 'modifiedAt', modifiedTimeConfig);
    append(data, 'authors', authorConfig);
    append(data, 'keywords', function () {
        var keywords = readMetaValues(keywordsConfig); // check length 1024
        return keywords && keywords.length <= 1024 ? keywords : null;
    });
    append(data, 'title', internalTitle);
    append(data, 'description', descriptionConfig);
};

// read <meta property="content:*" content="*">
var readMetaElements = function () {
    var data = Array.from(document.querySelectorAll('meta[property^=content]')).reduce(function (res, meta) {
        var _a;
        var type = (_a = meta === null || meta === void 0 ? void 0 : meta.getAttribute('property')) === null || _a === void 0 ? void 0 : _a.split(':').pop();
        var validate = Validators[type];
        if (validate && meta) {
            res[type] = validate((meta === null || meta === void 0 ? void 0 : meta.getAttribute('content')) || '');
        }
        return res;
    }, {});
    queryMetasMemo.refresh();
    appendLegacyComposer(data);
    appendLegacyCrawler(data);
    return data;
};
var content = __assign(__assign({}, createStaticParam(null)), { init: function () { return readMetaElements(); }, set: function (value, prevValue) {
        if (value === null) {
            return {};
        }
        return filterObjectValues(__assign(__assign({}, prevValue), value), function (val) { return val !== undefined && val !== null; });
    } });

var PropertiesMap = {
    pageViewId: pageViewId,
    browserId: browserId,
    users: users,
    userStatus: userState,
    siteId: createBaseParam(),
    consent: consent,
    consentPresets: consentPresets,
    products: products,
    consentModifiers: consentModifiers,
    content: content
};

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

var domainExceptions = ['pantheon.io', 'go-vip.net', 'go-vip.co'];
var DEFAULT_COOKIE_OPTIONS = {
    path: '/',
    expires: 395,
    samesite: 'lax',
    secure: window.location.protocol === 'https:',
    domain: cookie.getTopLevelDomain(domainExceptions)
};

var createDateByExpires = function (expires) {
    var date = new Date();
    if (expires instanceof Date) {
        date = expires;
    }
    else if (typeof expires === "number") {
        date.setDate(date.getDate() + expires);
    }
    else {
        return null;
    }
    return date;
};
var expirationName = '_t';
var initFixedUtils = function (rawData, _a) {
    var cookieName = _a.cookieName, encode = _a.encode, decode = _a.decode;
    var fixedMode = false;
    var fixedExpirationDate = null;
    var _onChangeCb = null;
    (function () {
        var _a;
        var expiration = (_a = decode(rawData || '')) === null || _a === void 0 ? void 0 : _a[expirationName];
        if (expiration) {
            try {
                fixedExpirationDate = new Date(parseInt(String(expiration), 36));
                fixedMode = !!fixedExpirationDate;
                // tslint:disable-next-line no-empty
            }
            catch (e) { }
        }
    })();
    var getFixedExpiration = function (options) {
        fixedExpirationDate = fixedExpirationDate || createDateByExpires(options.expires);
        return fixedExpirationDate;
    };
    var encodeData = function (data, options) {
        if (fixedMode) {
            fixedExpirationDate = getFixedExpiration(options);
            if (fixedExpirationDate) {
                data[expirationName] = fixedExpirationDate.getTime().toString(36);
            }
        }
        return encode(data);
    };
    var decodeData = function (data) {
        var result = decode(data);
        if (result === null || result === void 0 ? void 0 : result[cookieName]) {
            delete result[cookieName];
        }
        return result;
    };
    var bindOptions = function (options) {
        if (fixedMode) {
            fixedExpirationDate = getFixedExpiration(options);
            if (fixedExpirationDate) {
                return __assign(__assign({}, options), { expires: fixedExpirationDate });
            }
        }
        return options;
    };
    return {
        get fixedMode() {
            return fixedMode;
        },
        onChange: function (cb) {
            _onChangeCb = cb;
        },
        setFixedMode: function (val) {
            var prevFixedMode = fixedMode;
            fixedMode = val;
            if (fixedMode !== prevFixedMode) {
                fixedExpirationDate = null;
                _onChangeCb === null || _onChangeCb === void 0 ? void 0 : _onChangeCb(fixedMode);
            }
        },
        bindOptions: bindOptions,
        decode: decodeData,
        encode: encodeData,
    };
};

var createCookieEncoder = function (cookieName, consent, useBase64) {
    if (consent === void 0) { consent = 'optional'; }
    if (useBase64 === void 0) { useBase64 = false; }
    return ({
        cookieName: cookieName,
        consent: consent,
        encode: function (data) { return toJSON(data, useBase64); },
        decode: function (data) { return parseJSON(data, true); }
    });
};
var createCookieWrapper = function (encoder) {
    var cookieName = encoder.cookieName, consent = encoder.consent;
    var cookieInitialData = cookie.get(cookieName);
    var cookieEnabled = !!cookieInitialData;
    var fixedUtils = initFixedUtils(cookieInitialData, encoder);
    var expirationIsUpdated = fixedUtils.fixedMode;
    var lazy = cookieEnabled;
    var obfuscatedValue = null;
    var boundedCookieOptions = __assign({}, DEFAULT_COOKIE_OPTIONS);
    var cachedData = null;
    var isEnabled = function () { return cookieEnabled && lazy; };
    var setCookie = function (options) {
        var newOptions = getOptions(options);
        var cookieString = obfuscatedValue || (cachedData ? fixedUtils.encode(cachedData, newOptions) : '');
        // recheck cookie if no value
        // rare case
        if (!cookieString) {
            var raw = cookie.get(cookieName);
            var decodedData = fixedUtils.decode(raw || '');
            cookieString = decodedData ? fixedUtils.encode(decodedData, newOptions) : '';
        }
        if (cookieString) {
            expirationIsUpdated = true;
            cookie.set(cookieName, cookieString, fixedUtils.bindOptions(newOptions));
        }
    };
    var getOptions = function (options) { return (__assign(__assign({}, boundedCookieOptions), filterObjectValues(options || {}, isNotEmpty))); };
    var get = function () {
        return fixedUtils.decode(cookie.get(cookieName) || '');
    };
    var set = function (value, options) {
        cachedData = value;
        if (!isEnabled()) {
            return;
        }
        setCookie(options);
    };
    var remove = function (options) {
        cookie.remove(cookieName, getOptions(options));
    };
    var checkAndCreateCookie = function (enable, lazyActive) {
        var nowEnabled = enable && lazyActive;
        // turn on
        if (!isEnabled() && nowEnabled) {
            setCookie();
        }
        // turn off
        if (isEnabled() && !nowEnabled) {
            remove();
        }
        // just update expiration
        if (isEnabled() && nowEnabled && !expirationIsUpdated) {
            setCookie();
        }
        // save
        cookieEnabled = enable;
        lazy = lazyActive;
    };
    var lazyAction = function () {
        checkAndCreateCookie(cookieEnabled, true);
    };
    var setCookieOptions = function (options) {
        boundedCookieOptions = getOptions(options);
        if (isEnabled()) {
            setCookie();
        }
    };
    var setCookieEnabled = function (enabled, _obfuscatedValue) {
        if (_obfuscatedValue === void 0) { _obfuscatedValue = null; }
        obfuscatedValue = enabled ? _obfuscatedValue : null;
        checkAndCreateCookie(enabled, lazy);
    };
    var setFixedMode = function (val) {
        fixedUtils.setFixedMode(val);
    };
    fixedUtils.onChange(function () {
        if (isEnabled()) {
            expirationIsUpdated = false;
            setCookie();
        }
    });
    return {
        get cookieName() {
            return cookieName;
        },
        get cookieEnabled() {
            return isEnabled();
        },
        get consent() {
            return consent;
        },
        set: set,
        get: get,
        remove: remove,
        setCookieOptions: setCookieOptions,
        setCookieEnabled: setCookieEnabled,
        lazyActive: lazyAction,
        setFixedMode: setFixedMode,
    };
};
var createCookieWrappers = function (cookieEncoders) {
    return Object.keys(cookieEncoders).reduce(function (res, cookieName) {
        res[cookieName] = createCookieWrapper(cookieEncoders[cookieName]);
        return res;
    }, {});
};

var lzString = {exports: {}};

(function (module) {
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
    var LZString = (function() {

// private property
        var f = String.fromCharCode;
        var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
        var baseReverseDic = {};

        function getBaseValue(alphabet, character) {
            if (!baseReverseDic[alphabet]) {
                baseReverseDic[alphabet] = {};
                for (var i=0 ; i<alphabet.length ; i++) {
                    baseReverseDic[alphabet][alphabet.charAt(i)] = i;
                }
            }
            return baseReverseDic[alphabet][character];
        }

        var LZString = {
            compressToBase64 : function (input) {
                if (input == null) return "";
                var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
                switch (res.length % 4) { // To produce valid Base64
                    default: // When could this happen ?
                    case 0 : return res;
                    case 1 : return res+"===";
                    case 2 : return res+"==";
                    case 3 : return res+"=";
                }
            },

            decompressFromBase64 : function (input) {
                if (input == null) return "";
                if (input == "") return null;
                return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
            },

            compressToUTF16 : function (input) {
                if (input == null) return "";
                return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
            },

            decompressFromUTF16: function (compressed) {
                if (compressed == null) return "";
                if (compressed == "") return null;
                return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
            },

            //compress into uint8array (UCS-2 big endian format)
            compressToUint8Array: function (uncompressed) {
                var compressed = LZString.compress(uncompressed);
                var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

                for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
                    var current_value = compressed.charCodeAt(i);
                    buf[i*2] = current_value >>> 8;
                    buf[i*2+1] = current_value % 256;
                }
                return buf;
            },

            //decompress from uint8array (UCS-2 big endian format)
            decompressFromUint8Array:function (compressed) {
                if (compressed===null || compressed===undefined){
                    return LZString.decompress(compressed);
                } else {
                    var buf=new Array(compressed.length/2); // 2 bytes per character
                    for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
                        buf[i]=compressed[i*2]*256+compressed[i*2+1];
                    }

                    var result = [];
                    buf.forEach(function (c) {
                        result.push(f(c));
                    });
                    return LZString.decompress(result.join(''));

                }

            },


            //compress into a string that is already URI encoded
            compressToEncodedURIComponent: function (input) {
                if (input == null) return "";
                return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
            },

            //decompress from an output of compressToEncodedURIComponent
            decompressFromEncodedURIComponent:function (input) {
                if (input == null) return "";
                if (input == "") return null;
                input = input.replace(/ /g, "+");
                return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
            },

            compress: function (uncompressed) {
                return LZString._compress(uncompressed, 16, function(a){return f(a);});
            },
            _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
                if (uncompressed == null) return "";
                var i, value,
                    context_dictionary= {},
                    context_dictionaryToCreate= {},
                    context_c="",
                    context_wc="",
                    context_w="",
                    context_enlargeIn= 2, // Compensate for the first entry which should not count
                    context_dictSize= 3,
                    context_numBits= 2,
                    context_data=[],
                    context_data_val=0,
                    context_data_position=0,
                    ii;

                for (ii = 0; ii < uncompressed.length; ii += 1) {
                    context_c = uncompressed.charAt(ii);
                    if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
                        context_dictionary[context_c] = context_dictSize++;
                        context_dictionaryToCreate[context_c] = true;
                    }

                    context_wc = context_w + context_c;
                    if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
                        context_w = context_wc;
                    } else {
                        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                            if (context_w.charCodeAt(0)<256) {
                                for (i=0 ; i<context_numBits ; i++) {
                                    context_data_val = (context_data_val << 1);
                                    if (context_data_position == bitsPerChar-1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                }
                                value = context_w.charCodeAt(0);
                                for (i=0 ; i<8 ; i++) {
                                    context_data_val = (context_data_val << 1) | (value&1);
                                    if (context_data_position == bitsPerChar-1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            } else {
                                value = 1;
                                for (i=0 ; i<context_numBits ; i++) {
                                    context_data_val = (context_data_val << 1) | value;
                                    if (context_data_position ==bitsPerChar-1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = 0;
                                }
                                value = context_w.charCodeAt(0);
                                for (i=0 ; i<16 ; i++) {
                                    context_data_val = (context_data_val << 1) | (value&1);
                                    if (context_data_position == bitsPerChar-1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn == 0) {
                                context_enlargeIn = Math.pow(2, context_numBits);
                                context_numBits++;
                            }
                            delete context_dictionaryToCreate[context_w];
                        } else {
                            value = context_dictionary[context_w];
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }


                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        // Add wc to the dictionary.
                        context_dictionary[context_wc] = context_dictSize++;
                        context_w = String(context_c);
                    }
                }

                // Output the code for w.
                if (context_w !== "") {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                        if (context_w.charCodeAt(0)<256) {
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i=0 ; i<8 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        } else {
                            value = 1;
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i=0 ; i<16 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    } else {
                        value = context_dictionary[context_w];
                        for (i=0 ; i<context_numBits ; i++) {
                            context_data_val = (context_data_val << 1) | (value&1);
                            if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }


                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                }

                // Mark the end of the stream
                value = 2;
                for (i=0 ; i<context_numBits ; i++) {
                    context_data_val = (context_data_val << 1) | (value&1);
                    if (context_data_position == bitsPerChar-1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }

                // Flush the last char
                while (true) {
                    context_data_val = (context_data_val << 1);
                    if (context_data_position == bitsPerChar-1) {
                        context_data.push(getCharFromInt(context_data_val));
                        break;
                    }
                    else context_data_position++;
                }
                return context_data.join('');
            },

            decompress: function (compressed) {
                if (compressed == null) return "";
                if (compressed == "") return null;
                return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
            },

            _decompress: function (length, resetValue, getNextValue) {
                var dictionary = [],
                    enlargeIn = 4,
                    dictSize = 4,
                    numBits = 3,
                    entry = "",
                    result = [],
                    i,
                    w,
                    bits, resb, maxpower, power,
                    c,
                    data = {val:getNextValue(0), position:resetValue, index:1};

                for (i = 0; i < 3; i += 1) {
                    dictionary[i] = i;
                }

                bits = 0;
                maxpower = Math.pow(2,2);
                power=1;
                while (power!=maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb>0 ? 1 : 0) * power;
                    power <<= 1;
                }

                switch (bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2,8);
                        power=1;
                        while (power!=maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb>0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        c = f(bits);
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2,16);
                        power=1;
                        while (power!=maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb>0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        c = f(bits);
                        break;
                    case 2:
                        return "";
                }
                dictionary[3] = c;
                w = c;
                result.push(c);
                while (true) {
                    if (data.index > length) {
                        return "";
                    }

                    bits = 0;
                    maxpower = Math.pow(2,numBits);
                    power=1;
                    while (power!=maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb>0 ? 1 : 0) * power;
                        power <<= 1;
                    }

                    switch (c = bits) {
                        case 0:
                            bits = 0;
                            maxpower = Math.pow(2,8);
                            power=1;
                            while (power!=maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++);
                                }
                                bits |= (resb>0 ? 1 : 0) * power;
                                power <<= 1;
                            }

                            dictionary[dictSize++] = f(bits);
                            c = dictSize-1;
                            enlargeIn--;
                            break;
                        case 1:
                            bits = 0;
                            maxpower = Math.pow(2,16);
                            power=1;
                            while (power!=maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++);
                                }
                                bits |= (resb>0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            dictionary[dictSize++] = f(bits);
                            c = dictSize-1;
                            enlargeIn--;
                            break;
                        case 2:
                            return result.join('');
                    }

                    if (enlargeIn == 0) {
                        enlargeIn = Math.pow(2, numBits);
                        numBits++;
                    }

                    if (dictionary[c]) {
                        entry = dictionary[c];
                    } else {
                        if (c === dictSize) {
                            entry = w + w.charAt(0);
                        } else {
                            return null;
                        }
                    }
                    result.push(entry);

                    // Add w+entry[0] to the dictionary.
                    dictionary[dictSize++] = w + entry.charAt(0);
                    enlargeIn--;

                    w = entry;

                    if (enlargeIn == 0) {
                        enlargeIn = Math.pow(2, numBits);
                        numBits++;
                    }

                }
            }
        };
        return LZString;
    })();

    if( module != null ) {
        module.exports = LZString;
    }
}(lzString));

var ECompressType;
(function (ECompressType) {
    ECompressType["URI"] = "URI";
    ECompressType["COM"] = "COM";
    ECompressType["B64"] = "B64";
})(ECompressType || (ECompressType = {}));
var CompressFuncByType = {
    URI: {
        prefix: '{u}',
        compress: lzString.exports.compressToEncodedURIComponent,
        decompress: lzString.exports.decompressFromEncodedURIComponent
    },
    COM: {
        prefix: '{c}',
        compress: lzString.exports.compress,
        decompress: lzString.exports.decompress
    },
    B64: {
        prefix: '{b}',
        compress: lzString.exports.compressToBase64,
        decompress: lzString.exports.decompressFromBase64
    }
};
var CompressFuncByPrefix = Object.keys(CompressFuncByType).reduce(function (res, key) {
    res[CompressFuncByType[key].prefix] = CompressFuncByType[key];
    return res;
}, {});
var compress = function (data, type) {
    if (type === void 0) { type = ECompressType.URI; }
    var inputString = JSON.stringify(data);
    var compressString = CompressFuncByType[type].compress(inputString);
    return CompressFuncByType[type].prefix + compressString;
};
var decompress = function (data) {
    var prefix = data.slice(0, 3);
    var decompressString = data.slice(3);
    if (!CompressFuncByPrefix[prefix]) {
        return null;
    }
    var decompressedString = CompressFuncByPrefix[prefix].decompress(decompressString);
    if (!decompressedString) {
        return null;
    }
    try {
        return JSON.parse(decompressedString);
    }
    catch (e) {
        return null;
    }
};

// closed encoded cookie
var _pctx = {
    cookieName: '_pctx',
    consent: 'mandatory',
    encode: compress,
    decode: function (dataString) {
        var data = decompress(dataString || '');
        if (typeof data !== 'object') {
            return null;
        }
        return data;
    }
};

var useJSONPprv = function () { var _a, _b; return !!((_b = (_a = getGlobalConfig$1().cookies) === null || _a === void 0 ? void 0 : _a._pprv) === null || _b === void 0 ? void 0 : _b.jsonOnly); };
var createCookieEncoders = function () { return ({
    _pprv: createCookieEncoder('_pprv', 'mandatory', !useJSONPprv()),
    _pcid: createCookieEncoder('_pcid', 'essential'),
    _pctx: _pctx
}); };
var cookieEncoders = createCookieEncoders();
var cookieWrappers = createCookieWrappers(cookieEncoders);

var createCookieAssociation = function () {
    var cookieWrapperMap = null;
    var registerConfig = function (config) {
        cookieWrapperMap = {
            fields: __assign(__assign({}, config.fields), (cookieWrapperMap && cookieWrapperMap.fields)),
            cookieByName: __assign(__assign({}, config.cookieByName), (cookieWrapperMap && cookieWrapperMap.cookieByName))
        };
        return cookieWrapperMap.cookieByName;
    };
    var get = function () {
        var result = {};
        if (cookieWrapperMap) {
            Object.keys(cookieWrapperMap.cookieByName).forEach(function (key) {
                result = __assign(__assign({}, result), cookieWrapperMap === null || cookieWrapperMap === void 0 ? void 0 : cookieWrapperMap.cookieByName[key].get());
            });
        }
        return result;
    };
    var set = function (data, prevData) {
        if (prevData === void 0) { prevData = null; }
        var groupedData = {};
        // separate data by cookie name
        Object.keys(data).forEach(function (fieldName) {
            var fieldValue = data[fieldName];
            var cookieWrapperName = cookieWrapperMap === null || cookieWrapperMap === void 0 ? void 0 : cookieWrapperMap.fields[fieldName];
            if (cookieWrapperName) {
                if (!groupedData[cookieWrapperName]) {
                    groupedData[cookieWrapperName] = {
                        wrapper: cookieWrapperMap === null || cookieWrapperMap === void 0 ? void 0 : cookieWrapperMap.cookieByName[cookieWrapperName],
                        wrapperData: {},
                        needUpdate: false
                    };
                }
                groupedData[cookieWrapperName].wrapperData[fieldName] = fieldValue;
                if (!prevData || (!groupedData[cookieWrapperName].needUpdate && fieldValue !== prevData[fieldName])) {
                    groupedData[cookieWrapperName].needUpdate = true;
                }
            }
        });
        Object.keys(groupedData).forEach(function (key) {
            var _a = groupedData[key], wrapper = _a.wrapper, wrapperData = _a.wrapperData, needUpdate = _a.needUpdate;
            if (needUpdate) {
                wrapper.set(wrapperData);
            }
        });
    };
    return {
        registerConfig: registerConfig,
        get registeredCookiesWrapper() {
            return (cookieWrapperMap === null || cookieWrapperMap === void 0 ? void 0 : cookieWrapperMap.cookieByName) || null;
        },
        get: get,
        set: set
    };
};

var shallowEqual = function (obj, obj2) {
    if (obj === obj2) {
        return true;
    }
    if (!obj || !obj2) {
        return null;
    }
    var keys1 = Object.keys(obj);
    var keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    return !keys1.some(function (key) {
        var val1 = obj[key];
        var val2 = obj2[key];
        return val1 !== val2;
    });
};
var emptyObjectData = {};
var getConnection = function () {
    var cookieAssociation = createCookieAssociation();
    var initCookieData = {};
    var cachedData = null;
    var connections = new Map();
    var protectedKeys = new Map();
    var updateListeners = [];
    var addListener = function (key, cb) {
        updateListeners.push([key, cb]);
    };
    var removeListener = function (key) {
        updateListeners = updateListeners.filter(function (item) { return item[0] !== key; });
    };
    var updateData = function (_, data) {
        var rejectedData = {};
        var newData = {};
        Object.keys(data).forEach(function (key) {
            if (protectedKeys.has(key)) {
                rejectedData[key] = (cachedData === null || cachedData === void 0 ? void 0 : cachedData[key]) || null;
            }
            else {
                newData[key] = data[key];
            }
        });
        var oldCachedData = cachedData || initCookieData;
        var newCachedData = __assign(__assign({}, cachedData), newData);
        if (!shallowEqual(newCachedData, oldCachedData)) {
            cookieAssociation.set(newCachedData, oldCachedData);
            cachedData = newCachedData;
            updateListeners.forEach(function (_a) {
                var cb = _a[1];
                return cb(newData);
            });
        }
        return Object.keys(rejectedData).length > 0 ? rejectedData : null;
    };
    var setProtection = function (connectKey, data, force) {
        if (force === void 0) { force = false; }
        var rejectKeys = [];
        Object.keys(data).forEach(function (key) {
            var value = data[key];
            var actionIsPermitted = !protectedKeys.has(key) || protectedKeys.get(key) === connectKey || force;
            if (value && actionIsPermitted) {
                protectedKeys.set(key, connectKey);
            }
            else if (!value && actionIsPermitted) {
                protectedKeys.delete(key);
            }
            else {
                rejectKeys.push(key);
            }
        });
        return rejectKeys.length > 0 ? rejectKeys : null;
    };
    return function (name, currentCookieConfig) {
        var connectionKey = randomStringCxCompatible();
        connections.set(connectionKey, name);
        if (currentCookieConfig) {
            cookieAssociation.registerConfig(currentCookieConfig);
        }
        initCookieData = __assign(__assign({}, cookieAssociation.get()), initCookieData);
        return {
            getInitCookieData: function () { return initCookieData; },
            getCachedData: function () { return cachedData || emptyObjectData; },
            setProtectionData: function (value) {
                return setProtection(connectionKey, value);
            },
            setProtectionDataUnsafe: function (value) {
                return setProtection(connectionKey, value, true);
            },
            updateData: function (data) {
                return updateData(connectionKey, data);
            },
            onUpdateData: function (cb) {
                addListener(connectionKey, cb);
            },
            terminate: function () {
                removeListener(connectionKey);
                connections.delete(connectionKey);
            },
            // TODO to support legacy version
            setCookieOptions: function () { return null; },
            // TODO to support legacy version
            setCookieEnabled: function () { return null; },
            get registeredCookiesWrapper() {
                return cookieAssociation.registeredCookiesWrapper;
            }
        };
    };
};
// define global object in window to communicate
var CONNECTION_NAME_OBJ = '__pctx_connection__';
var KEY = 'uvm42pas28m';
var GENERATE_NEW_CONNECTION = 'mrlqf5trgho';
var connect = function (name, cookiesMap) {
    var connection = getConnection();
    // @ts-ignore
    try {
        // Protect from redefine and reading func
        Object.defineProperty(window, CONNECTION_NAME_OBJ, {
            configurable: false,
            set: function (cb) {
                var key = cb();
                if (key === KEY) {
                    cb(connection);
                    // TODO Warning! Use this key only for testing and debug
                }
                else if (key === GENERATE_NEW_CONNECTION) {
                    connection = getConnection();
                }
            }
        });
        // tslint:disable-next-line no-empty
    }
    catch (e) { }
    // Get common connect function
    // @ts-ignore
    window[CONNECTION_NAME_OBJ] = function (val) {
        if (val) {
            connection = val;
        }
        return KEY;
    };
    return connection(name, cookiesMap);
};

var isMask = function (str) { return str.includes('*'); };
var createMask = function (name, value) { return [
    new RegExp('^' + name.replace(/\*/g, '.*') + '$'),
    value
]; };
var itemsToMask = function (items) {
    return Object.keys(items)
        .filter(isMask)
        .map(function (i) { return createMask(i, items[i]); });
};
var getByMask = function (name, masks) {
    for (var _i = 0, masks_1 = masks; _i < masks_1.length; _i++) {
        var mask = masks_1[_i];
        if (mask[0].test(name)) {
            return mask[1];
        }
    }
    return null;
};

var getConsentModifier = function (itemType, modifierNoStrict, log) {
    var modifier = modifierNoStrict && validateModifier(modifierNoStrict, log);
    if (!modifier) {
        return null;
    }
    var masks = [];
    var keys = {};
    for (var _i = 0, _a = modifier.patches; _i < _a.length; _i++) {
        var patch = _a[_i];
        var action = patch.action, _b = patch.with, data = _b === void 0 ? null : _b, item = patch.item;
        if (item.type === itemType) {
            var modifierResult = {
                action: action,
                data: data
            };
            keys[item.key] = modifierResult;
            if (isMask(item.key)) {
                masks.push(createMask(item.key, modifierResult));
            }
        }
    }
    var _getModifier = function (name) { return keys[name] || getByMask(name, masks); };
    return {
        source: modifier.source,
        getModifier: _getModifier
    };
};
var checkMode = function (mode, config) {
    switch (mode) {
        case 'opt-in':
            return true;
        case 'essential':
            return config === 'essential' || config === 'mandatory';
        case 'opt-out':
            return config === 'mandatory';
        default:
            // TODO util debug console
            return true;
    }
};
var checkAction = function (action) {
    switch (action) {
        case 'include':
            return true;
        case 'exclude':
            return false;
        case 'obfuscate':
            return true;
    }
};
var getData = function (action, data) { return (action === 'obfuscate' ? data : null); };
var createCheckConsentWrapper = function (config) {
    var items = Object.assign({}, config.items);
    var masks = itemsToMask(items);
    var getConfigByName = function (name) { return items[name] || getByMask(name, masks) || 'optional'; };
    function checkConsent(name, consentValue) {
        var requireConsent = getGlobalConfig$1().requireConsent;
        var isSingle = !Array.isArray(name);
        var names = isSingle ? [name] : name;
        var result = (function () {
            var getDefaultResult = function () {
                return names.map(function (cName) { return ({
                    name: cName,
                    allowed: !requireConsent
                }); });
            };
            var consent = consentValue || config.getConsent();
            if (!consent) {
                return getDefaultResult();
            }
            if (consent.mode === 'custom') {
                var consentModifier_1 = getConsentModifier(config.type, consent.modifier, config.log);
                if (!consentModifier_1) {
                    return getDefaultResult();
                }
                var source_1 = consentModifier_1.source;
                return names.map(function (itemName) {
                    var modifier = consentModifier_1.getModifier(itemName);
                    var data = getData(modifier === null || modifier === void 0 ? void 0 : modifier.action, modifier === null || modifier === void 0 ? void 0 : modifier.data);
                    var item = {
                        name: itemName,
                        allowed: (modifier === null || modifier === void 0 ? void 0 : modifier.action) ? checkAction(modifier.action) : checkMode(source_1, getConfigByName(itemName))
                    };
                    if (data !== null) {
                        item.data = data;
                    }
                    return item;
                });
            }
            return names.map(function (i) { return ({
                name: i,
                allowed: checkMode(consent.mode, getConfigByName(i))
            }); });
        })();
        return isSingle ? result[0] : result;
    }
    return checkConsent;
};

var checkConsent$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createCheckConsentWrapper: createCheckConsentWrapper,
    createMask: createMask,
    getByMask: getByMask,
    isMask: isMask,
    itemsToMask: itemsToMask
});

// simple local storage reader
// Full version: @sdk-piano/storage
var localStorageGet = function (name) {
    var getItem = function (key) { return tryFn(function () { return window.localStorage.getItem(key); }); };
    var value = getItem(name);
    var ttl = tryFn(function () { return parseInt(parseJSON(getItem('_ls_ttl'))[name], 36); });
    return ttl && ttl <= Date.now() ? null : value;
};

var validateBrowserId = function (val) {
    var length = val && val.length;
    return length === 16 || length === 36 ? val : null;
};
var getMigrationValue = (function () {
    var cookies = {
        pa_vid: function (data) { return validateBrowserId(parseJSON(data || '', true) || data); },
        atuserid: function (data) { var _a; return validateBrowserId(((_a = parseJSON(data || '', true)) === null || _a === void 0 ? void 0 : _a.val) || ''); }
    };
    return function (names) {
        var _loop_1 = function (name_1) {
            try {
                var data = (function () {
                    if (name_1.ls) {
                        return localStorageGet(name_1.ls) || null;
                    }
                    var raw = cookie.get(name_1);
                    return cookies[name_1] && raw ? cookies[name_1](raw) : raw;
                })();
                if (data) {
                    return { value: data };
                }
                // tslint:disable-next-line no-empty
            }
            catch (e) { }
        };
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var state_1 = _loop_1(name_1);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    };
})();
var defaultMigration = [{ ls: '_cX_P' }, 'cX_P'];
var migrationMaps = {
    PA: {
        browserId: __spreadArray(['pa_vid', 'atuserid'], defaultMigration, true)
    },
    DMP: {
        browserId: defaultMigration
    }
};
var DEFAULT_MIGRATION = {
    browserId: { source: 'DMP' }
};
var migrate = function (_private) {
    var _a;
    var migrationData = __assign(__assign({}, DEFAULT_MIGRATION), validateMigration((_a = getGlobalConfig$1()) === null || _a === void 0 ? void 0 : _a.migration));
    Object.keys(migrationData).forEach(function (propName) {
        var _a, _b;
        var param = _private.params.get(propName);
        var isDefault = migrationData[propName] === DEFAULT_MIGRATION[propName];
        var product = (_a = migrationData[propName]) === null || _a === void 0 ? void 0 : _a.source;
        var configs = (product && ((_b = migrationMaps[product]) === null || _b === void 0 ? void 0 : _b[propName])) || [];
        if (param && configs.length) {
            var migrationValue = getMigrationValue(configs);
            if (migrationValue) {
                param.readonly = false;
                _private.updateValues(propName, migrationValue, true); // force update from migrated value
                param.readonly = !isDefault; // prohibit overwriting value
            }
        }
    });
};

var UPDATE_VALUE = '@@Data-layer/update_value';
var REFRESH_VALUE = '@@Data-layer/refresh_value';
var REFRESH_LOCKED_KEY = '@@Data-layer/refresh_locked_key';
var getGlobalConfig = function () {
    // @ts-ignore
    var config = __assign({}, window[GLOBAL_CONFIG_NAME]);
    var validateCookieOption = function (cookieOptions) {
        return validateObj(cookieOptions, {
            path: String,
            domain: String,
            secure: toBoolean,
            expires: function (val) { return (val instanceof Date ? val : Number(val)); },
            samesite: function (val) {
                if (typeof val === 'string') {
                    return val;
                }
                return toBoolean(val);
            },
        });
    };
    if (config === null || config === void 0 ? void 0 : config.cookies) {
        config.cookies = Object.keys(config.cookies).reduce(function (res, cookieName) {
            res[cookieName] = validateCookieOption(config.cookies[cookieName]);
            return res;
        }, {});
    }
    if (config === null || config === void 0 ? void 0 : config.cookieDefault) {
        config.cookieDefault = validateCookieOption(config.cookieDefault);
    }
    return config;
};
var DataLayer = function (paramsArgs, cookiesArgs, onInit) {
    var cookieConfig = combineCookieConfig(paramsArgs, cookiesArgs);
    var syncConnection = connect('data-layer', cookieConfig);
    // Local cached values. They always sync with cookies and other Storages
    var cachedValue;
    var ready = false;
    var listenersByNames = new Map();
    var listenersCommon = new Set();
    var params = new Map();
    var getConnection = function () {
        if (!syncConnection) {
            throw new Error("DataLayer can't be connected");
        }
        return syncConnection;
    };
    var getCookieWrappers = function (cb) {
        var cookieWrappers = getConnection().registeredCookiesWrapper;
        if (cookieWrappers) {
            cb(cookieWrappers);
        }
    };
    var setCookieEnabled = function (cookiesEnabled) {
        getCookieWrappers(function (cookieWrappers) {
            var cookieNames = Object.keys(cookiesEnabled);
            if (cookieNames.length) {
                cookieNames.forEach(function (cookieName) {
                    var wrapper = cookieWrappers[cookieName];
                    if (wrapper) {
                        wrapper.setCookieEnabled(cookiesEnabled[cookieName]);
                    }
                });
            }
            else {
                Object.keys(cookieWrappers).forEach(function (key) {
                    cookieWrappers[key].setCookieEnabled(cookiesEnabled);
                });
            }
        });
    };
    var resolveCookieLazyAction = function (cookieNames) {
        getCookieWrappers(function (cookieWrappers) {
            cookieNames.forEach(function (cookieName) {
                var wrapper = cookieWrappers[cookieName];
                if (wrapper) {
                    wrapper.lazyActive();
                }
            });
        });
    };
    var getCookieEnabled = function () {
        var result = null;
        getCookieWrappers(function (cookieWrappers) {
            result = Object.keys(cookieWrappers).reduce(function (res, key) {
                res[cookieWrappers[key].cookieName] = cookieWrappers[key].cookieEnabled;
                return res;
            }, {});
        });
        return result;
    };
    // Init global options
    var initConfig = function (config) {
        var globalConfig = __assign(__assign({}, config), getGlobalConfig());
        var cookieOptions = globalConfig.cookieDefault;
        // set cookie options on each cookie wrapper
        getCookieWrappers(function (cookieWrappers) {
            Object.keys(cookieWrappers).forEach(function (key) {
                var _a, _b, _c, _d;
                var cookieName = cookieWrappers[key].cookieName;
                var options = (_a = globalConfig.cookies) === null || _a === void 0 ? void 0 : _a[cookieName];
                var fixedMode = ((_b = globalConfig.cookies) === null || _b === void 0 ? void 0 : _b.storageMode) === 'fixed';
                (_d = (_c = cookieWrappers[key]).setFixedMode) === null || _d === void 0 ? void 0 : _d.call(_c, fixedMode); // backwards compatibility with DL2.5.1
                if (cookieOptions || options) {
                    cookieWrappers[key].setCookieOptions(__assign(__assign({}, cookieOptions), options));
                }
            });
        });
    };
    var createConfigParameters = function () {
        var configs = {};
        var getValuesByPropName = function (propName) {
            return Object.keys(configs).reduce(function (res, key) {
                var config = configs[key];
                if (config[propName] !== undefined) {
                    res[key] = config[propName];
                }
                return res;
            }, {});
        };
        var updateProtection = function () {
            var keys = getValuesByPropName('protect');
            if (Object.keys(keys).length > 0) {
                getConnection().setProtectionData(keys);
            }
        };
        var updateProtectionUnsafe = function () {
            var keys = getValuesByPropName('protectUnsafe');
            if (Object.keys(keys).length > 0) {
                getConnection().setProtectionDataUnsafe(keys);
            }
        };
        return {
            add: function (key, config) {
                configs[key] = config;
            },
            call: function () {
                updateProtection();
                updateProtectionUnsafe();
            }
        };
    };
    var normalizeCachedValue = function (cachedValues, cb) {
        return Object.keys(cachedValues).reduce(function (result, paramName) {
            var param = params.get(paramName);
            var value = cachedValues[paramName];
            if (param) {
                result[paramName] = cb ? cb(param, value) : param.get(value);
            }
            return result;
        }, {});
    };
    var _getPrivateContext = function () { return ({
        params: params,
        getConnection: getConnection,
        addChangeListener: addChangeListener,
        get: get,
        updateValues: updateValues
    }); };
    var init = function (options) {
        if (options === void 0) { options = {}; }
        if (ready) {
            return;
        }
        if (!syncConnection) {
            syncConnection = connect('data-layer', cookieConfig);
        }
        initConfig(options);
        ready = true;
        Object.keys(paramsArgs).forEach(function (key) {
            var param = paramsArgs[key];
            listenersByNames.set(key, new Set());
            params.set(key, param);
        });
        var needToUpdateCookie = false;
        var initCookieData = getConnection().getInitCookieData();
        var cachedData = getConnection().getCachedData();
        var configToChange = createConfigParameters();
        var initData = Object.keys(paramsArgs).reduce(function (res, key) {
            var _key = key;
            var param = paramsArgs[key];
            res[key] =
                (cachedData === null || cachedData === void 0 ? void 0 : cachedData[_key]) ||
                param.init(initCookieData === null || initCookieData === void 0 ? void 0 : initCookieData[_key], function (config) {
                    configToChange.add(_key, config);
                });
            if (!(cachedData === null || cachedData === void 0 ? void 0 : cachedData[_key])) {
                needToUpdateCookie = true;
            }
            return res;
        }, {});
        cachedValue = initData;
        // In the case of different versions, syncConnection may not have some data, so we must initialize them and save
        if (needToUpdateCookie) {
            getConnection().updateData(initData);
        }
        configToChange.call();
        getConnection().onUpdateData(function (data) { return onUpdateData(data); });
        onInit === null || onInit === void 0 ? void 0 : onInit(_getPrivateContext());
    };
    var onUpdateData = function (data) {
        var cachedValueWasUpdated = false;
        Object.keys(data).forEach(function (key) {
            var _a;
            var _key = key;
            var param = params.get(_key);
            if (param) {
                var value_1 = data[_key];
                var prevValue = cachedValue[_key];
                if (prevValue !== value_1) {
                    cachedValue[_key] = value_1;
                    cachedValueWasUpdated = true;
                    // todo set logs in debug mode
                    (_a = listenersByNames.get(_key)) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(param.get(value_1)); });
                }
            }
        });
        if (cachedValueWasUpdated) {
            listenersCommon.forEach(function (cb) { return cb(normalizeCachedValue(cachedValue)); });
        }
    };
    var updateValues = function (arg1, arg2, force) {
        var _a;
        if (force === void 0) { force = false; }
        var data = arg1;
        var cookiesActions = stringSet();
        if (typeof arg1 === 'string') {
            data = (_a = {}, _a[arg1] = arg2, _a);
        }
        var configsToResetProtection = createConfigParameters();
        var configsToChange = createConfigParameters();
        data = Object.keys(data).reduce(function (res, key) {
            var value = data[key];
            var param = params.get(key);
            var keyString = key;
            if (param === null || param === void 0 ? void 0 : param.readonly) {
                return res;
            }
            if (param && param.cookieName) {
                cookiesActions.add(param.cookieName);
            }
            if (!param || value === cachedValue[key]) {
                return res;
            }
            if (value === REFRESH_VALUE) {
                res[key] = param.refresh(cachedValue[key], function (config) {
                    // change parameter config after updating
                    configsToChange.add(keyString, config);
                });
                // If value was updated
                if (res[key] !== cachedValue[key]) {
                    // So we need to reset protection for parameter
                    configsToResetProtection.add(keyString, { protectUnsafe: false });
                }
                return res;
            }
            if (value === UPDATE_VALUE) {
                res[key] = param.update(cachedValue[key], function (config) {
                    configsToChange.add(keyString, config);
                });
                return res;
            }
            res[key] = param.set(value, cachedValue[key], function (config) {
                configsToChange.add(keyString, config);
            });
            return res;
        }, {});
        resolveCookieLazyAction(cookiesActions.values());
        // reset protection
        configsToResetProtection.call();
        var rejectedData = getConnection().updateData(data);
        if (rejectedData && force) {
            // reset protection for rejected data
            var unprotectKeys = Object.keys(rejectedData).reduce(function (res, key) {
                var _a;
                return (__assign(__assign({}, res), (_a = {}, _a[key] = false, _a)));
            }, {});
            getConnection().setProtectionDataUnsafe(unprotectKeys);
            getConnection().updateData(data);
        }
        // Update configs of params
        configsToChange.call();
        return rejectedData && normalizeCachedValue(rejectedData);
    };
    function get(arg1) {
        var _a;
        var cookiesActions = stringSet();
        var isSingleValue = typeof arg1 === 'string';
        var result;
        // all data
        if (arg1 === undefined) {
            result = cachedValue;
        }
        else if (isSingleValue) {
            result = (_a = {}, _a[arg1] = cachedValue[arg1], _a);
        }
        else {
            // specific values
            result = arg1.reduce(function (res, key) {
                if (params.has(key)) {
                    res[key] = cachedValue[key];
                }
                return res;
            }, {});
        }
        result = normalizeCachedValue(result, function (param, value) {
            if (param.cookieName) {
                cookiesActions.add(param.cookieName);
            }
            return param.get(value);
        });
        resolveCookieLazyAction(cookiesActions.values());
        return isSingleValue ? result[arg1] : result;
    }
    function set(arg1, arg2) {
        return updateValues(arg1, arg2, false);
    }
    function setUnsafe(arg1, arg2) {
        updateValues(arg1, arg2, true);
    }
    var updateSafeUnsafe = function (arg1, unsafe) {
        if (unsafe === void 0) { unsafe = false; }
        var names = arg1;
        if (!Array.isArray(arg1)) {
            names = [arg1];
        }
        return updateValues(names.reduce(function (res, name) {
            res[name] = UPDATE_VALUE;
            return res;
        }, {}), undefined, unsafe);
    };
    var update = function (arg1) {
        return updateSafeUnsafe(arg1);
    };
    var updateUnsafe = function (arg1) {
        return updateSafeUnsafe(arg1, true);
    };
    var protectPrivate = function (arg1, arg2, force) {
        var _a;
        if (force === void 0) { force = false; }
        var protectMethod = force ? getConnection().setProtectionDataUnsafe : getConnection().setProtectionData;
        var values = arg1;
        if (typeof arg1 === 'string') {
            values = (_a = {}, _a[arg1] = arg2, _a);
        }
        // @ts-ignore
        return protectMethod(values);
    };
    function protect(arg1, arg2) {
        return protectPrivate(arg1, arg2);
    }
    function protectUnsafe(arg1, arg2) {
        return protectPrivate(arg1, arg2, true);
    }
    function addChangeListener(arg1, arg2) {
        var _a;
        if (typeof arg1 === 'string') {
            (_a = listenersByNames.get(arg1)) === null || _a === void 0 ? void 0 : _a.add(arg2);
            return;
        }
        listenersCommon.add(arg1);
    }
    var removeChangeListener = function (cb) {
        listenersCommon.delete(cb);
        listenersByNames.forEach(function (listeners) { return listeners.delete(cb); });
    };
    var refresh = function () {
        var _a;
        if (getConnection().setProtectionData((_a = {},
            _a[REFRESH_LOCKED_KEY] = true,
            _a))) {
            return false;
        }
        var paramKeys = [];
        params.forEach(function (_v, key) { return paramKeys.push(key); });
        var refreshData = paramKeys.reduce(function (res, key) {
            res[key] = REFRESH_VALUE;
            return res;
        }, {});
        updateValues(refreshData);
        return true;
    };
    var terminate = function () {
        syncConnection === null || syncConnection === void 0 ? void 0 : syncConnection.terminate();
        listenersByNames.clear();
        listenersCommon.clear();
        syncConnection = null;
        ready = false;
    };
    var updateMigration = function () {
        if (ready) {
            // @ts-ignore
            migrate(_getPrivateContext());
        }
    };
    return {
        init: init,
        set: set,
        get: get,
        update: update,
        refresh: refresh,
        protect: protect,
        addChangeListener: addChangeListener,
        removeChangeListener: removeChangeListener,
        terminate: terminate,
        setUnsafe: setUnsafe,
        protectUnsafe: protectUnsafe,
        updateUnsafe: updateUnsafe,
        setCookieEnabled: setCookieEnabled,
        updateMigration: updateMigration,
        get cookieEnabled() {
            return getCookieEnabled();
        },
        get isReady() {
            return ready;
        },
        utils: {
            validateModifier: validateModifier,
            validateConsent: validateConsent,
            checkConsent: checkConsent$1
        }
    };
};

var getCookieProhibition = function () { return ({
    _pprv: !getGlobalConfig$1().requireConsent
}); };
var checkConsent = function (_private) {
    var items = Object.keys(cookieEncoders).reduce(function (res, cookieName) {
        res[cookieName] = cookieEncoders[cookieName].consent;
        return res;
    }, {});
    var getConsent = function (data) { var _a; return data || ((_a = _private.get('consent')) === null || _a === void 0 ? void 0 : _a.DL) || null; };
    var check = createCheckConsentWrapper({
        items: items,
        type: 'cookie',
        getConsent: getConsent
    });
    var prevValueConsent = getConsent();
    var checkCookieWrappers = function (con) {
        var _a;
        var prohibition = getCookieProhibition();
        var cookieWrapperMap = (_a = _private.getConnection()) === null || _a === void 0 ? void 0 : _a.registeredCookiesWrapper;
        if (cookieWrapperMap) {
            var names = Object.keys(cookieWrapperMap).map(function (key) { return cookieWrapperMap[key].cookieName; });
            check(names, con).forEach(function (_a) {
                var name = _a.name, allowed = _a.allowed, data = _a.data;
                var cookieName = name;
                var cookieAllowed = allowed && !prohibition[cookieName];
                cookieWrapperMap[cookieName].setCookieEnabled(cookieAllowed, data || null);
            });
        }
    };
    _private.addChangeListener('consent', function (data) {
        var newValue = (data === null || data === void 0 ? void 0 : data.DL) || null;
        if ((prevValueConsent === null || prevValueConsent === void 0 ? void 0 : prevValueConsent.mode) !== (newValue === null || newValue === void 0 ? void 0 : newValue.mode)) {
            prevValueConsent = newValue;
            checkCookieWrappers(newValue);
        }
    });
    checkCookieWrappers(prevValueConsent);
};

var onDataLayerInit = function (_private) {
    checkConsent(_private);
    migrate(_private);
};

var dataLayer = DataLayer(PropertiesMap, cookieWrappers, onDataLayerInit);

export { dataLayer, dataLayer as default };