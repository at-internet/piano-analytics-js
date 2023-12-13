/**
 * @license
 * Piano Browser SDK-DataLayer@2.9.5.
 * Copyright 2010-2022 Piano Software Inc.
 */
import { cookie } from '@piano-sdk/storage';

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

var keys = function (v) { return (v ? Object.keys(v) : []); };
var isArray = function (v) { return Array.isArray(v); };
var isEmpty = function (val) { return val === null || val === undefined; };
var isNotEmpty = function (val) { return !isEmpty(val); };
var isObject = function (val) { return typeof val === 'object'; };
var isString = function (val) { return typeof val === 'string'; };
var isNumber = function (val) { return typeof val === 'number'; };

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

var filterObjectValues = function (obj, filter) {
    if (!obj) {
        return obj;
    }
    // Else add to the map
    return keys(obj)
        .filter(function (k) { return filter(obj[k]); })
        .reduce(function (a, k) {
            var _a;
            return (__assign(__assign({}, a), (_a = {}, _a[k] = obj[k], _a)));
        }, {});
};
var combineCookieConfig = function (params, cookieWrappers) { return ({
    fields: keys(params).reduce(function (res, paramName) {
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
            return keys(data);
        }
    };
};
var validateObj = function (obj, mapFilter) {
    if (!isObject(obj)) {
        return obj;
    }
    return keys(obj).reduce(function (r, k) {
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
var shallowEqual = function (obj, obj2) {
    if (obj === obj2) {
        return true;
    }
    if (!obj || !obj2) {
        return null;
    }
    var keys1 = keys(obj);
    var keys2 = keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    return !keys1.some(function (key) {
        var val1 = obj[key];
        var val2 = obj2[key];
        return val1 !== val2;
    });
};

var removeCxUsers = function (allUsers) {
    return filterObjectValues(allUsers, function (val) { return (val === null || val === void 0 ? void 0 : val.type) !== 'CX'; });
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
var PRODUCTS_LIST = ['PA', 'DMP', 'COMPOSER', 'ID', 'VX', 'ESP', 'SOCIAL_FLOW', RESERVED_PRODUCT];
var PRODUCTS = PRODUCTS_LIST.map(function (name, id) { return ({
    name: name,
    id: id
}); });
var PRODUCTS_MAP = PRODUCTS.reduce(function (res, _a, index) {
    var _b;
    var name = _a.name;
    return (__assign(__assign({}, res), (_b = {}, _b[name] = index, _b[name.toLowerCase()] = index, _b)));
}, {});
// support legacy value
PRODUCTS_MAP['social flow'] = PRODUCTS_MAP.SOCIAL_FLOW;
PRODUCTS_MAP['Social Flow'] = PRODUCTS_MAP.SOCIAL_FLOW;
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
var filterByProduct = function (value, prevValue, updateConfig) {
    var newData = getProducts().reduce(function (res, product) {
        var pid = product.id;
        res[pid] = updateConfig(value === null || value === void 0 ? void 0 : value[pid], prevValue === null || prevValue === void 0 ? void 0 : prevValue[pid], pid);
        return res;
    }, {});
    if (shallowEqual(newData, prevValue)) {
        return prevValue;
    }
    return newData;
};
var getPid = function (key) {
    var pid = Number(key);
    if (Number.isNaN(pid)) {
        var product = PRODUCTS_MAP[key.toLowerCase()];
        return product !== null && product !== void 0 ? product : null;
    }
    return pid < PRODUCTS.length ? pid : null;
};
var fillProductNameReduce = function (dataObj, reduce) {
    return keys(dataObj).reduce(function (res, productId) {
        var productName = PRODUCTS[Number(productId)].name;
        var value = dataObj[productId];
        res[productName] = reduce ? reduce(value, productName) : value;
        return res;
    }, {});
};

var OPT_IN_MODE = 'opt-in';
var ESSENTIAL_MODE = 'essential';
var OPT_OUT_MODE = 'opt-out';
var CUSTOM_MODE = 'custom';
var modeListBase = [OPT_IN_MODE, ESSENTIAL_MODE, OPT_OUT_MODE];
var modesList = modeListBase.concat(CUSTOM_MODE);
var modeIdMap = modesList.reduce(function (res, mode, index) {
    var _a;
    return (__assign(__assign({}, res), (_a = {}, _a[index] = mode, _a)));
}, {});
var priorityList = [OPT_IN_MODE, CUSTOM_MODE, ESSENTIAL_MODE, OPT_OUT_MODE];
var getStrictMode = function (mode1, mode2) {
    var index1 = priorityList.indexOf(mode1);
    var index2 = priorityList.indexOf(mode2);
    return priorityList[Math.max(index1, index2)];
};
var isConsentMode = function (mode) { return modesList.includes(mode); };
var isConsentBaseMode = function (mode) { return modeListBase.includes(mode); };

var purposeByProduct = {
    AD: ['DMP', 'SOCIAL_FLOW'],
    CP: ['COMPOSER'],
    AM: ['PA'],
    PR: ['ESP', 'VX', 'ID'],
    DL: ['DL']
};
var initialPurposeMap = keys(purposeByProduct).reduce(function (res, purpose) {
    purposeByProduct[purpose].forEach(function (product) {
        var productId = PRODUCTS_MAP[product];
        res[productId] = purpose;
    });
    return res;
}, {});
var onChangeConfigPurpose = onMemo(function () { var _a; return (_a = validateConsentMemo(getGlobalConfig$1().consent)) === null || _a === void 0 ? void 0 : _a.defaultPurposes; });
var getDefaultPurposes = (function () {
    var result = __assign({}, initialPurposeMap);
    return function () {
        onChangeConfigPurpose(function (defaultPurpose) {
            result = __assign({}, initialPurposeMap);
            if (defaultPurpose) {
                keys(defaultPurpose).forEach(function (productName) {
                    var _a;
                    var productId = PRODUCTS_MAP[productName];
                    result[productId] = (_a = defaultPurpose[productName]) === null || _a === void 0 ? void 0 : _a.substring(0, 32);
                });
            }
        });
        return result;
    };
})();
var filterByProductPurposes = function (value, prevValue) {
    return filterByProduct(value, prevValue, function (config, prevConfig, pid) { return config || prevConfig || getDefaultPurposes()[pid]; });
};
var convertToPurposes = function (val) {
    return keys(val).reduce(function (res, key) {
        var pid = getPid(key);
        var purpose = toPurpose(val[key]);
        if (pid === null) {
            return res;
        }
        if (purpose === RESERVED_PURPOSE || pid === PRODUCTS_MAP[RESERVED_PRODUCT]) {
            return res;
        }
        if (purpose) {
            res[pid] = purpose;
        }
        return res;
    }, {});
};
var purposes = __assign(__assign({}, createBaseParam(null, '_pprv')), { init: function (valueFromCookie) {
        return isRequireConsentV2() ? filterByProductPurposes(valueFromCookie || null, null) : null;
    }, set: function (val, prevVal) {
        if (!isRequireConsentV2()) {
            return null;
        }
        if (val === null || val === undefined) {
            return prevVal;
        }
        return filterByProductPurposes(convertToPurposes(val), prevVal);
    } });

var getGlobalConfigModifiers = function () { return getGlobalConfig$1().consent_modifiers || null; };
var getRequireConsent = function () { return !!getGlobalConfig$1().requireConsent; };
var isRequireConsentV2 = function () { return getGlobalConfig$1().requireConsent === 'v2'; };
var isInvalidCustomMode = function (mode, product) { var _a; return mode === CUSTOM_MODE && !((_a = getGlobalConfigModifiers()) === null || _a === void 0 ? void 0 : _a[product]); };
var RESERVED_PURPOSE = 'DL';
var purposesMap = [
    'AD',
    'AM',
    'CP',
    'PR',
    RESERVED_PURPOSE
].reduce(function (res, i) {
    var _a;
    return (__assign(__assign({}, res), (_a = {}, _a[i] = i, _a[i.toLowerCase()] = i, _a)));
}, {});
var toBasePurpose = function (purpose) { return purposesMap[(purpose === null || purpose === void 0 ? void 0 : purpose.toLowerCase()) || ''] || null; };
var toPurpose = function (purpose) {
    return toBasePurpose(purpose) || (purpose === null || purpose === void 0 ? void 0 : purpose.substring(0, 32));
};
var productsString = function (products, single, plural) {
    return "".concat(products.join(', '), " ").concat(products.length > 1 ? plural : single);
};
var consentV2IsDisabled = 'Consent v2 is disabled';
var errorDlReserved = 'the "DL" purpose is reserved';
var errorDlProductReserved = function (purpose) { return "\"".concat(purpose, "\" can not be applied for the dl product"); };
var modeIsUnknown = function (mode) { return "".concat(mode, " is unknown consent mode"); };
var productsDoesntHaveModifier = function (products) {
    return productsString(products, 'does', 'do') + "n't have modifier in the pdl. Custom mode can't be applied";
};
var unknownPurpose = "Unknown purpose. Provide a product or define within pdl config";
var unknownProducts = function (products) {
    return 'Custom purpose: ' + productsString(products, 'is', 'are') + ' unknown';
};
function setExtendedConsent(purposes, consent, modeOrType, mode, products) {
    var error = function (msg) { return ({
        error: msg
    }); };
    var getConsentsByProducts = function (modeLocal, purposeLocal, productsLocal) {
        var invalidProducts = [];
        if (!isConsentMode(modeLocal)) {
            return error(modeIsUnknown(modeLocal));
        }
        var newConsent = getProducts().reduce(function (res, _a) {
            var id = _a.id, name = _a.name;
            if (!purposeLocal || (purposes === null || purposes === void 0 ? void 0 : purposes[id]) === purposeLocal || (productsLocal === null || productsLocal === void 0 ? void 0 : productsLocal.includes(id))) {
                if (isInvalidCustomMode(modeLocal, name)) {
                    invalidProducts.push(name);
                }
                else {
                    res[id] = { mode: modeLocal };
                }
            }
            return res;
        }, {});
        if (invalidProducts.length) {
            return error(productsDoesntHaveModifier(invalidProducts));
        }
        if (!Object.keys(newConsent).length) {
            return null;
        }
        return {
            consent: newConsent
        };
    };
    var setAllModes = function (modeLocal) { return getConsentsByProducts(modeLocal); };
    var setByPurpose = function (modeLocal, purposeRaw) {
        var purpose = toPurpose(purposeRaw);
        if (!purposesMap[purpose] && !Object.values(purposes || {}).includes(purpose)) {
            return error(unknownPurpose);
        }
        return getConsentsByProducts(modeLocal, purpose);
    };
    var setByPurposeAndProduct = function (modelLocal, purposeRaw, productsRaw) {
        var purpose = toPurpose(purposeRaw);
        var productArrayRaw = isArray(productsRaw) ? productsRaw : [productsRaw];
        var pids = productArrayRaw.map(getPid).filter(isNotEmpty);
        if (!pids.length) {
            if (!toBasePurpose(purposeRaw)) {
                return error(unknownProducts(productArrayRaw));
            }
            return setByPurpose(modelLocal, purposeRaw);
        }
        if (purpose !== RESERVED_PURPOSE && pids.includes(PRODUCTS_MAP.DL)) {
            return {
                error: errorDlProductReserved(purpose)
            };
        }
        if (purpose === RESERVED_PURPOSE && pids.some(function (product) { return product !== PRODUCTS_MAP.DL; })) {
            return error(errorDlReserved);
        }
        var consentResult = getConsentsByProducts(modelLocal, purpose, pids);
        if (consentResult === null || consentResult === void 0 ? void 0 : consentResult.error) {
            return consentResult;
        }
        var newPurposes = pids.reduce(function (res, productId) {
            res[productId] = purpose;
            return res;
        }, {});
        return {
            consent: (consentResult === null || consentResult === void 0 ? void 0 : consentResult.consent) || null,
            purposes: newPurposes
        };
    };
    if (!isRequireConsentV2()) {
        return error(consentV2IsDisabled);
    }
    if (products) {
        return setByPurposeAndProduct(mode, modeOrType, products);
    }
    else if (mode) {
        return setByPurpose(mode, modeOrType);
    }
    else {
        return setAllModes(modeOrType);
    }
}
var getExtendedConsent = function (consent, purposes) {
    if (!consent) {
        return null;
    }
    var purposesLocal = purposes || initialPurposeMap;
    var purposesNames = fillProductNameReduce(purposesLocal);
    return getProducts().reduce(function (res, _a) {
        var _b;
        var productName = _a.name;
        var purpose = purposesNames[productName];
        var productMode = ((_b = consent[productName]) === null || _b === void 0 ? void 0 : _b.mode) || OPT_IN_MODE;
        if (!res[purpose]) {
            res[purpose] = {
                mode: productMode,
                products: [productName]
            };
        }
        else {
            res[purpose].mode = getStrictMode(res[purpose].mode, productMode);
            res[purpose].products.push(productName);
        }
        return res;
    }, {});
};
var getNotAcquiredConsent = function () {
    return isRequireConsentV2()
        ? keys(purposeByProduct).reduce(function (res, purpose) {
            res[purpose] = {
                mode: 'not-acquired',
                products: purposeByProduct[purpose]
            };
            return res;
        }, {})
        : null;
};

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
    return isConsentBaseMode(mode) ? mode : null;
};
var validateModifier = function (modifier, log) {
    if (log === void 0) { log = emptyFn; }
    var source = modifier.source;
    var newPatches = modifier.patches || [];
    if (!toMode(source)) {
        log(oneOf('source', modeListBase));
        source = OPT_IN_MODE;
    }
    if (!isArray(newPatches)) {
        log('"patches" should be an array');
        newPatches = [];
    }
    newPatches = newPatches.reduce(function (res, patch, i) {
        if (!isObject(patch) || isArray(patch)) {
            log("patch[".concat(i, "]: should be type of {action, item, with?}"));
            return res;
        }
        var action = patch.action, item = patch.item;
        if (!actions.includes(action)) {
            log("patch[".concat(i, "]: ") + oneOf('action', actions));
            return res;
        }
        if (!item || !isObject(item) || !item.key || !item.type) {
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
var validateConsent$1 = function (consent, log) {
    if (log === void 0) { log = emptyFn; }
    if (!consent) {
        return null;
    }
    var result = {};
    if (consent.products) {
        if (!isArray(consent.products)) {
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
        result.defaultPreset = keys(consent.defaultPreset).reduce(function (res, productKey) {
            var product = toProduct(productKey, addPrefix('consent.defaultPreset: ', log));
            var mode = toMode(consent.defaultPreset[productKey]);
            if (!mode) {
                log('consent.defaultPreset: ' + oneOf(productKey, modeListBase));
            }
            if (product && mode) {
                res[product] = mode;
            }
            return res;
        }, {});
    }
    var purposes = consent.defaultPurposes;
    if (purposes) {
        result.defaultPurposes = keys(purposes).reduce(function (res, productKey) {
            var purposeLog = addPrefix('consent.defaultPurposes: ', log);
            var product = toProduct(productKey, purposeLog);
            var rawPurpose = purposes[productKey];
            var purpose = toPurpose(rawPurpose);
            if (purpose === RESERVED_PURPOSE || product === RESERVED_PRODUCT) {
                purposeLog("\"".concat(productKey, ": ").concat(rawPurpose, "\" - invalid config"));
            }
            else if (product && purpose) {
                res[product] = purpose;
            }
            return res;
        }, {});
    }
    return result;
};
var validateConsentMemo = memo(validateConsent$1);
var validateMigration = function (migration, log) {
    if (log === void 0) { log = emptyFn; }
    return keys(migration || {}).reduce(function (res, propName) {
        var data = migration === null || migration === void 0 ? void 0 : migration[propName];
        var product = toProduct((data === null || data === void 0 ? void 0 : data.source) || '', log);
        res[propName] = __assign(__assign({}, data), { source: product });
        return res;
    }, {});
};

// opt-in - 0
// essential - 1
// opt-out - 2
// custom - 3
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
            result = PRESETS.slice();
            if (defaultPreset) {
                result[0] = {
                    id: 0,
                    preset: __assign({}, result[0].preset)
                };
                keys(defaultPreset).forEach(function (name) {
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
var getCalculatedPreset = function (presetIndexes) {
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
            return Math.min(indexMode, preset[productIndex]);
        });
    });
    return currentPreset && convertIndexModes(currentPreset);
};

// @ts-ignore
var convertToConsent = function (val) {
    return keys(val).reduce(function (res, key) {
        var config = val[key];
        var pid = getPid(key);
        if (pid === null) {
            return res;
        }
        var mode = isConsentMode(config.mode) ? config.mode : null;
        if (mode) {
            if (!res) {
                res = {};
            }
            res[pid] = { mode: mode };
        }
        return res;
    }, null);
};
var filterByProductConsent = function (value, prevValue) {
    return filterByProduct(value, prevValue, function (config, prevConfig, pid) {
        var mode = (config === null || config === void 0 ? void 0 : config.mode) || (prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.mode) || getDefaultPreset()[pid].mode;
        if (mode !== (prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.mode)) {
            return {
                mode: mode
            };
        }
        return prevConfig;
    });
};
var consent = __assign(__assign({}, createBaseParam(null, '_pprv')), { init: function (valueFromCookie) {
        return getRequireConsent() && valueFromCookie ? filterByProductConsent(valueFromCookie, null) : null;
    }, set: function (val, prevVal) {
        var _a;
        if (!getRequireConsent()) {
            return null;
        }
        if (val === null || val === undefined) {
            return prevVal;
        }
        var newConsent;
        if (isNumber(val)) {
            // deprecated value
            newConsent = ((_a = getPresets()[val]) === null || _a === void 0 ? void 0 : _a.preset) || null;
        }
        else if (isArray(val)) {
            // deprecated value
            newConsent = getCalculatedPreset(val);
        }
        else {
            newConsent = convertToConsent(val);
        }
        return newConsent ? filterByProductConsent(newConsent, prevVal) : prevVal;
    }, get: memo(function (value) {
        return value &&
            fillProductNameReduce(value, function (config, productName) {
                var _a;
                var newConfig = __assign({}, config);
                if (newConfig.mode === CUSTOM_MODE) {
                    newConfig.modifier = ((_a = getGlobalConfigModifiers()) === null || _a === void 0 ? void 0 : _a[productName]) || null;
                }
                return newConfig;
            });
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
    return isArray(val) ? val : val.split(',').map(function (s) { return s.trim().replace(/^['"](.+)['"]$/, '$1'); });
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
    var readValue = typeof config === 'function' ? config : function () { return (isArray(config) ? readMetaValues(config) : readMetaValue(config)); };
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
        .replace(/MONTHLONG/g, '(' + keys(monthNames).join('|') + ')')
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
var content = __assign(__assign({}, createStaticParam(null)), { init: function () { return readMetaElements(); }, refresh: function (prevValue) {
        var newValue = readMetaElements();
        if (prevValue === null || prevValue === void 0 ? void 0 : prevValue._fixed_) {
            prevValue === null || prevValue === void 0 ? void 0 : prevValue._fixed_.forEach(function (fieldName) {
                delete newValue[fieldName];
            });
        }
        return __assign(__assign({}, prevValue), newValue);
    }, set: function (value, prevValue) {
        if (value === null) {
            return {};
        }
        var fixedSet = new Set(prevValue && prevValue._fixed_);
        var proceedValue = function (filter, forEachCb) {
            keys(filterObjectValues(value, filter)).forEach(forEachCb);
        };
        proceedValue(isNotEmpty, function (val) { fixedSet.add(val); });
        proceedValue(isEmpty, function (val) { fixedSet.delete(val); });
        return filterObjectValues(__assign(__assign(__assign({}, prevValue), value), { _fixed_: Array.from(fixedSet.values()) }), isNotEmpty);
    }, get: memo(function (value) {
        var getValue = __assign({}, value);
        delete getValue._fixed_;
        return value && getValue;
    }) });

var userSegments = __assign(__assign({}, createBaseParam(null, '_pcus')), { init: function (valueFromCookie) {
        if (valueFromCookie === void 0) { valueFromCookie = null; }
        return valueFromCookie && filterObjectValues(valueFromCookie, function (val) { return isObject(val) && Array.isArray(val.segments); });
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
    purposes: purposes,
    content: content,
    userSegments: userSegments
};

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
    else if (typeof expires === 'number') {
        date.setDate(date.getDate() + expires);
    }
    else {
        return null;
    }
    return date;
};
var dateToString = function (date) { return date.getTime().toString(36); };
var stringToDate = function (date) { return (date ? tryFn(function () { return new Date(parseInt(date, 36)); }) : null); };
var expirationName = '_t';
var initFixedUtils = function (rawData, _a) {
    var encode = _a.encode, decode = _a.decode;
    var fixedMode = false;
    var fixedExpirationDate = null;
    var fixedCreationDate = null;
    var _onChangeCb = null;
    (function () {
        var _a;
        var expiration = (_a = decode(rawData || '')) === null || _a === void 0 ? void 0 : _a[expirationName];
        if (expiration) {
            var splitData = expiration.split('|');
            // for backward compatibility, the first value is expiration
            fixedExpirationDate = stringToDate(splitData[0]);
            fixedCreationDate = stringToDate(splitData[1]);
            fixedMode = !!fixedExpirationDate;
        }
    })();
    var getFixedExpiration = function (options) {
        fixedExpirationDate = fixedExpirationDate || createDateByExpires(options.expires);
        return fixedExpirationDate;
    };
    var getFixedCreation = function () {
        fixedCreationDate = fixedCreationDate || new Date();
        return fixedCreationDate;
    };
    var encodeData = function (data, options) {
        if (fixedMode) {
            fixedExpirationDate = getFixedExpiration(options);
            if (fixedExpirationDate) {
                data[expirationName] = dateToString(fixedExpirationDate) + '|' + dateToString(getFixedCreation());
            }
        }
        else {
            delete data[expirationName];
        }
        return encode(data);
    };
    var decodeData = function (data) {
        var result = decode(data);
        if (result === null || result === void 0 ? void 0 : result[expirationName]) {
            delete result[expirationName];
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
        get fixedAt() {
            return fixedMode ? [fixedCreationDate, fixedExpirationDate] : null;
        },
        onChange: function (cb) {
            _onChangeCb = cb;
        },
        setMode: function (val) {
            var prevFixedMode = fixedMode;
            fixedMode = val;
            if (fixedMode !== prevFixedMode) {
                fixedExpirationDate = null;
                fixedCreationDate = null;
                _onChangeCb === null || _onChangeCb === void 0 ? void 0 : _onChangeCb(fixedMode);
            }
        },
        bindOptions: bindOptions,
        decode: decodeData,
        encode: encodeData
    };
};

var ESSENTIAL_CONFIG = 'essential';
var OPTIONAL_CONFIG = 'optional';
var MANDATORY_CONFIG = 'mandatory';

var createCookieEncoder = function (cookieName, consent, useBase64) {
    if (consent === void 0) { consent = OPTIONAL_CONFIG; }
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
    var cookieCreated = cookieEnabled;
    var fixedUtils = initFixedUtils(cookieInitialData, encoder);
    var expirationIsUpdated = !!fixedUtils.fixedAt;
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
            cookieCreated = true;
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
        if (!isEnabled()) {
            return;
        }
        if (cookieCreated) {
            cookie.remove(cookieName, getOptions(options));
        }
        cookieCreated = false;
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
        fixedUtils.setMode(val);
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
        get fixedAt() {
            return fixedUtils.fixedAt;
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
        setFixedMode: setFixedMode
    };
};
var createCookieWrappers = function (cookieEncoders) {
    return keys(cookieEncoders).reduce(function (res, cookieName) {
        res[cookieName] = createCookieWrapper(cookieEncoders[cookieName]);
        return res;
    }, {});
};

// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
// private property
/* tslint:disable */
var f = String.fromCharCode;
var keyStrUriSafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';
var baseReverseDic = {};

function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    var i,
        value,
        context_dictionary = {},
        context_dictionaryToCreate = {},
        context_c = '',
        context_wc = '',
        context_w = '',
        context_enlargeIn = 2, // Compensate for the first entry which should not count
        context_dictSize = 3,
        context_numBits = 2,
        context_data = [],
        context_data_val = 0,
        context_data_position = 0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
        }

        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
        } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = context_data_val << 1;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
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
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
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
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
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
    if (context_w !== '') {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } else {
                        context_data_position++;
                    }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
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
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | value;
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } else {
                        context_data_position++;
                    }
                    value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
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
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
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
    for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position == bitsPerChar - 1) {
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
        context_data_val = context_data_val << 1;
        if (context_data_position == bitsPerChar - 1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
        } else context_data_position++;
    }
    return context_data.join('');
}

function _decompress(length, resetValue, getNextValue) {
    var dictionary = [],
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = '',
        result = [],
        i,
        w,
        bits,
        resb,
        maxpower,
        power,
        c,
        data = { val: getNextValue(0), position: resetValue, index: 1 };

    for (i = 0; i < 3; i += 1) {
        dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
    }

    switch ((bits)) {
        case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            c = f(bits);
            break;
        case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            c = f(bits);
            break;
        case 2:
            return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
        if (data.index > length) {
            return '';
        }

        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }

        switch ((c = bits)) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }

                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
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

function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (var i = 0; i < alphabet.length; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
    }
    return baseReverseDic[alphabet][character];
}

//compress into a string that is already URI encoded
function compressToEncodedURIComponent(input) {
    if (input == null) return '';
    return _compress(input, 6, function (a) {
        return keyStrUriSafe.charAt(a);
    });
}

//decompress from an output of compressToEncodedURIComponent
function decompressFromEncodedURIComponent(input) {
    if (input == null) return '';
    if (input == '') return null;
    input = input.replace(/ /g, '+');
    return _decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrUriSafe, input.charAt(index));
    });
}

var ECompressType;
(function (ECompressType) {
    ECompressType["URI"] = "URI";
})(ECompressType || (ECompressType = {}));
var CompressFuncByType = {
    URI: {
        prefix: '{u}',
        compress: compressToEncodedURIComponent,
        decompress: decompressFromEncodedURIComponent
    }
};
var CompressFuncByPrefix = keys(CompressFuncByType).reduce(function (res, key) {
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
    consent: MANDATORY_CONFIG,
    encode: compress,
    decode: function (dataString) {
        var data = decompress(dataString || '');
        if (!isObject(data)) {
            return null;
        }
        return data;
    }
};

var useJSONPprv = function () { var _a, _b; return !!((_b = (_a = getGlobalConfig$1().cookies) === null || _a === void 0 ? void 0 : _a._pprv) === null || _b === void 0 ? void 0 : _b.jsonOnly); };
var createCookieEncoders = function () { return ({
    _pprv: createCookieEncoder('_pprv', MANDATORY_CONFIG, !useJSONPprv()),
    _pcid: createCookieEncoder('_pcid', ESSENTIAL_CONFIG),
    _pcus: createCookieEncoder('_pcus', OPTIONAL_CONFIG, true),
    _pctx: _pctx
}); };
var cookieEncoders = createCookieEncoders();
var cookieWrappers = createCookieWrappers(cookieEncoders);

var createCookieAssociation = function () {
    var fields = null;
    var cookieByName = null;
    var registerConfig = function (config) {
        fields = __assign(__assign({}, config.fields), fields);
        cookieByName = __assign(__assign({}, config.cookieByName), cookieByName);
        return cookieByName;
    };
    var get = function () {
        var result = {};
        if (cookieByName) {
            keys(cookieByName).forEach(function (key) {
                result = __assign(__assign({}, result), cookieByName[key].get());
            });
        }
        return result;
    };
    var set = function (data, prevData) {
        if (prevData === void 0) { prevData = null; }
        var groupedData = {};
        // separate data by cookie name
        keys(data).forEach(function (fieldName) {
            var fieldValue = data[fieldName];
            var cookieWrapperName = fields === null || fields === void 0 ? void 0 : fields[fieldName];
            if (cookieWrapperName) {
                if (!groupedData[cookieWrapperName]) {
                    groupedData[cookieWrapperName] = {
                        wrapper: cookieByName === null || cookieByName === void 0 ? void 0 : cookieByName[cookieWrapperName],
                        data: {},
                        update: false,
                        remove: true,
                    };
                }
                groupedData[cookieWrapperName].data[fieldName] = fieldValue;
                groupedData[cookieWrapperName].remove = groupedData[cookieWrapperName].remove && fieldValue === null;
                if (!prevData || (!groupedData[cookieWrapperName].update && fieldValue !== prevData[fieldName])) {
                    groupedData[cookieWrapperName].update = true;
                }
            }
        });
        keys(groupedData).forEach(function (key) {
            var _a = groupedData[key], wrapper = _a.wrapper, update = _a.update, remove = _a.remove;
            if (remove) {
                wrapper.remove();
            }
            if (update && !remove) {
                wrapper.set(groupedData[key].data);
            }
        });
    };
    return {
        register: registerConfig,
        get wrappers() {
            return cookieByName;
        },
        get: get,
        set: set
    };
};

// define global object in window to communicate
var CONNECTION_NAME_OBJ = '__pctx_connection__';
var KEY = 'uvm42pas28m';

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
        keys(data).forEach(function (key) {
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
        return keys(rejectedData).length > 0 ? rejectedData : null;
    };
    var setProtection = function (connectKey, data, force) {
        if (force === void 0) { force = false; }
        var rejectKeys = [];
        keys(data).forEach(function (key) {
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
            cookieAssociation.register(currentCookieConfig);
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
                return cookieAssociation.wrappers;
            }
        };
    };
};
// define global object in window to communicate
var GENERATE_NEW_CONNECTION = 'mrlqf5trgho';
var createConnectFn = function (configurable) {
    if (configurable === void 0) { configurable = false; }
    return function (name, cookiesMap) {
        var connection = getConnection();
        // @ts-ignore
        try {
            // Protect from redefine and reading func
            Object.defineProperty(window, CONNECTION_NAME_OBJ, {
                configurable: configurable,
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
};
var connect = createConnectFn();

var isMask = function (str) { return str.includes('*'); };
var createMask = function (name, value) { return [
    new RegExp('^' + name.replace(/\*/g, '.*') + '$'),
    value
]; };
var itemsToMask = function (items) {
    return keys(items)
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
        case OPT_IN_MODE:
            return true;
        case ESSENTIAL_MODE:
            return config === ESSENTIAL_CONFIG || config === MANDATORY_CONFIG;
        case OPT_OUT_MODE:
            return config === MANDATORY_CONFIG;
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
    var getConfigByName = function (name) { return items[name] || getByMask(name, masks) || OPTIONAL_CONFIG; };
    function checkConsent(name, consentValue) {
        var requireConsent = getGlobalConfig$1().requireConsent;
        var isSingle = !isArray(name);
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
            if (consent.mode === CUSTOM_MODE) {
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
        browserId: ['pa_vid', 'atuserid'].concat(defaultMigration)
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
    keys(migrationData).forEach(function (propName) {
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

var PREFIX = '@@Data-layer/';
var UPDATE_VALUE = PREFIX + 'update_value';
var REFRESH_VALUE = PREFIX + 'refresh_value';
var REFRESH_LOCKED_KEY = PREFIX + 'refresh_locked_key';
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
                if (isString(val)) {
                    return val;
                }
                return toBoolean(val);
            }
        });
    };
    if (config === null || config === void 0 ? void 0 : config.cookies) {
        config.cookies = keys(config.cookies).reduce(function (res, cookieName) {
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
            var cookieNames = keys(cookiesEnabled);
            if (cookieNames.length) {
                cookieNames.forEach(function (cookieName) {
                    var wrapper = cookieWrappers[cookieName];
                    if (wrapper) {
                        wrapper.setCookieEnabled(cookiesEnabled[cookieName]);
                    }
                });
            }
            else {
                keys(cookieWrappers).forEach(function (key) {
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
    var getCookieConfig = function () {
        var result = null;
        getCookieWrappers(function (cookieWrappers) {
            result = keys(cookieWrappers).reduce(function (res, key) {
                var enabled = cookieWrappers[key].cookieEnabled;
                var fixedAt = cookieWrappers[key].fixedAt || null;
                var cookieName = cookieWrappers[key].cookieName;
                res[cookieName] = enabled
                    ? {
                        enabled: enabled,
                        fixedAt: fixedAt
                    }
                    : null;
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
            keys(cookieWrappers).forEach(function (key) {
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
            return keys(configs).reduce(function (res, key) {
                var config = configs[key];
                if (config[propName] !== undefined) {
                    res[key] = config[propName];
                }
                return res;
            }, {});
        };
        var updateProtection = function () {
            var values = getValuesByPropName('protect');
            if (keys(values).length > 0) {
                getConnection().setProtectionData(values);
            }
        };
        var updateProtectionUnsafe = function () {
            var values = getValuesByPropName('protectUnsafe');
            if (keys(values).length > 0) {
                getConnection().setProtectionDataUnsafe(values);
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
        return keys(cachedValues).reduce(function (result, paramName) {
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
        keys(paramsArgs).forEach(function (key) {
            var param = paramsArgs[key];
            listenersByNames.set(key, new Set());
            params.set(key, param);
        });
        var needToUpdateCookie = false;
        var initCookieData = getConnection().getInitCookieData();
        var cachedData = getConnection().getCachedData();
        var configToChange = createConfigParameters();
        var initData = keys(paramsArgs).reduce(function (res, key) {
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
        keys(data).forEach(function (key) {
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
        if (isString(arg1)) {
            data = (_a = {}, _a[arg1] = arg2, _a);
        }
        var configsToResetProtection = createConfigParameters();
        var configsToChange = createConfigParameters();
        data = keys(data).reduce(function (res, key) {
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
            var unprotectKeys = keys(rejectedData).reduce(function (res, key) {
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
        var isSingleValue = isString(arg1);
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
        if (!isArray(arg1)) {
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
        if (isString(arg1)) {
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
        if (isString(arg1)) {
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
        cachedValue = {};
    };
    var updateMigration = function () {
        if (ready) {
            // @ts-ignore
            migrate(_getPrivateContext());
        }
    };
    function setConsent(arg1, arg2, arg3) {
        // @ts-ignore
        var consent = get('consent');
        // @ts-ignore
        var purposes = get('purposes');
        var result = setExtendedConsent(purposes, consent, arg1, arg2, arg3);
        if (!result) {
            return null;
        }
        if (result.error) {
            return result.error;
        }
        set({
            // @ts-ignore
            consent: result.consent,
            purposes: result.purposes
        });
        return null;
    }
    var getConsent = function () {
        // @ts-ignore
        var _a = get(['consent', 'purposes']), consent = _a.consent, purposes = _a.purposes;
        return getExtendedConsent(consent, purposes);
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
        updateMigration: updateMigration,
        get isReady() {
            return ready;
        },
        utils: {
            validateModifier: validateModifier,
            validateConsent: validateConsent$1,
            checkConsent: checkConsent$1,
            setConsent: setConsent,
            getConsent: getConsent,
            notAcquiredConsent: getNotAcquiredConsent()
        },
        get cookies() {
            return getCookieConfig();
        },
        // deprecated methods
        get cookieEnabled() {
            return getCookieConfig();
        },
        setUnsafe: setUnsafe,
        protectUnsafe: protectUnsafe,
        updateUnsafe: updateUnsafe,
        setCookieEnabled: setCookieEnabled
    };
};

var isPAConsentOnly = function (con) {
    var _a, _b;
    var conf = getGlobalConfig$1();
    var products = ((_a = conf.consent) === null || _a === void 0 ? void 0 : _a.products) || [];
    var paOnly = products.length === 1 && products[0] === 'PA';
    var isOptOut = ((_b = con === null || con === void 0 ? void 0 : con.PA) === null || _b === void 0 ? void 0 : _b.mode) === 'opt-out';
    return !!conf.requireConsent && paOnly && isOptOut;
};
var getCookieProhibition = function (con) {
    var prohibitForPaProducts = isPAConsentOnly(con);
    return {
        _pprv: !getGlobalConfig$1().requireConsent,
        _pctx: prohibitForPaProducts,
        _pcid: prohibitForPaProducts,
        _pcus: prohibitForPaProducts,
    };
};
var checkConsent = function (_private) {
    var _a;
    var items = keys(cookieEncoders).reduce(function (res, cookieName) {
        res[cookieName] = cookieEncoders[cookieName].consent;
        return res;
    }, {});
    var getConsent = function (data) { var _a; return data || ((_a = _private.get('consent')) === null || _a === void 0 ? void 0 : _a.DL) || null; };
    var check = createCheckConsentWrapper({
        items: items,
        type: 'cookie',
        getConsent: getConsent
    });
    var prevValueDlConsent = getConsent();
    var prevValuePAConsent = ((_a = _private.get('consent')) === null || _a === void 0 ? void 0 : _a.PA) || null;
    var checkCookieWrappers = function (con, allConsents) {
        var _a;
        var prohibition = getCookieProhibition(allConsents);
        var cookieWrapperMap = (_a = _private.getConnection()) === null || _a === void 0 ? void 0 : _a.registeredCookiesWrapper;
        if (cookieWrapperMap) {
            var names = keys(cookieWrapperMap).map(function (key) { return cookieWrapperMap[key].cookieName; });
            check(names, con).forEach(function (_a) {
                var name = _a.name, allowed = _a.allowed, data = _a.data;
                var cookieName = name;
                var cookieAllowed = allowed && !prohibition[cookieName];
                cookieWrapperMap[cookieName].setCookieEnabled(cookieAllowed, data || null);
            });
        }
    };
    _private.addChangeListener('consent', function (data) {
        var newDLValue = (data === null || data === void 0 ? void 0 : data.DL) || null;
        var newPAValue = (data === null || data === void 0 ? void 0 : data.PA) || null;
        if ((prevValueDlConsent === null || prevValueDlConsent === void 0 ? void 0 : prevValueDlConsent.mode) !== (newDLValue === null || newDLValue === void 0 ? void 0 : newDLValue.mode) || (prevValuePAConsent === null || prevValuePAConsent === void 0 ? void 0 : prevValuePAConsent.mode) !== (newPAValue === null || newPAValue === void 0 ? void 0 : newPAValue.mode)) {
            prevValueDlConsent = newDLValue;
            prevValuePAConsent = newPAValue;
            checkCookieWrappers(newDLValue, data);
        }
    });
    checkCookieWrappers(prevValueDlConsent, _private.get('consent'));
};

var log = function (product, mode, type) {
    var prefix = type === 1 ? 'can not be' : 'was';
    // tslint:disable-next-line
    console.warn("[DL]: Consent v2: the \"".concat(product, "\" has a conflicted consent mode, ") + "mode ".concat(prefix, " changed to \"").concat(mode, "\""));
};
var validateConsent = function (_private) {
    var timer = null;
    var customInvalidProducts = {};
    var validate = function (consent) {
        var currentConsent = getExtendedConsent(consent, _private.get('purposes'));
        if (currentConsent && consent) {
            var needUpdate_1 = false;
            var newConsent = keys(currentConsent).reduce(function (res, key) {
                var newMode = currentConsent[key].mode;
                currentConsent[key].products.forEach(function (productName) {
                    var _a;
                    if (newMode !== ((_a = consent[productName]) === null || _a === void 0 ? void 0 : _a.mode)) {
                        if (isInvalidCustomMode(newMode, productName)) {
                            if (!customInvalidProducts[productName]) {
                                customInvalidProducts[productName] = true;
                                log(productName, newMode, 1);
                            }
                        }
                        else {
                            res[productName] = { mode: newMode };
                            needUpdate_1 = true;
                            log(productName, newMode, 2);
                        }
                    }
                });
                return res;
            }, {});
            if (needUpdate_1) {
                _private.updateValues({ consent: newConsent });
            }
        }
    };
    _private.addChangeListener('consent', function (consent) {
        if (isRequireConsentV2()) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () {
                validate(consent);
                timer = null;
            }, 200);
        }
    });
    if (isRequireConsentV2()) {
        validate(_private.get('consent'));
    }
};

var onDataLayerInit = function (_private) {
    checkConsent(_private);
    migrate(_private);
    validateConsent(_private);
};

var dataLayer = DataLayer(PropertiesMap, cookieWrappers, onDataLayerInit);

export { dataLayer, dataLayer as default };
