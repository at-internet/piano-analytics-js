"use strict";
import { localStorage } from "@piano-sdk/storage";
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
var createCheckConsentWrapper = function createCheckConsentWrapper(dataLayer, config) {
    return dataLayer.utils.checkConsent.createCheckConsentWrapper(config);
};
var itemsToNames = function itemsToNames(dataLayer, items, getNames) {
    var utils = dataLayer.utils.checkConsent;
    var masks = utils.itemsToMask(items);
    var keys = Object.keys(items).filter(function (key) {
        return !utils.isMask(key);
    });
    return getNames().filter(function (name) {
        return keys.includes(name) || utils.getByMask(name, masks);
    });
};
var createBaseConsentStorage = function createBaseConsentStorage(storage2, itemType, config) {
    var getConsent = createConsentWrapper(config);
    var checkProperty = createCheckConsentWrapper(config.dataLayer, {
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
        (_a = checkProperty(itemsToNames(config.dataLayer, config.items, storage2.getNames), consent2)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
            if (!item.allowed) {
                storage2.remove(item.name);
            } else if (item.data) {
                storage2.set(item.name, item.data);
            }
        });
    };
    var set = function set(name, value, options) {
        var _a;
        var consent2 = checkProperty(name);
        if (consent2 === null || consent2 === void 0 ? void 0 : consent2.allowed) {
            var newValue = (_a = consent2.data) !== null && _a !== void 0 ? _a : value;
            var args = options ? [name, newValue, options] : [name, newValue];
            storage2.set.apply(null, args);
        }
    };
    _init();
    return Object.assign({}, storage2, {
        set: set,
        check: checkProperty
    });
};
var createTTLChecker = function createTTLChecker(dataLayer) {
    var name = localStorage.__protected__.ttlName;
    var config = {
        dataLayer: dataLayer,
        productName: "DL"
    };
    var check = function () {
        var _a;
        var checker = createCheckConsentWrapper(config.dataLayer, {
            items: (_a = {}, _a[name] = "mandatory", _a),
            type: "localStorage",
            getConsent: createConsentWrapper(config)
        });
        return function () {
            var result = checker(name);
            return result.allowed && !result.data;
        };
    }();
    var allowed = true;
    var updateMemoValue = function updateMemoValue() {
        allowed = check();
        if (!allowed) {
            localStorage.remove(name);
        }
    };
    onDlChangeConsent(config, updateMemoValue);
    updateMemoValue();
    return function () {
        return allowed;
    };
};
var createLocalStorage = function createLocalStorage(config) {
    var checkTTL = createTTLChecker(config.dataLayer);
    var lsConsent = createBaseConsentStorage(localStorage, "localStorage", config);
    var set = function set(name, value, options) {
        var newOptions = options;
        if ((options === null || options === void 0 ? void 0 : options.expires) && !checkTTL()) {
            newOptions = Object.assign({}, options);
            delete newOptions.expires;
        }
        return lsConsent.set(name, value, newOptions);
    };
    return Object.assign({}, lsConsent, {
        set: set
    });
};
import { cookie } from "@piano-sdk/storage";
var ITEM_TYPE = "cookie";
var createCookie = function createCookie(config) {
    var consentUtils = config.dataLayer.utils.checkConsent;
    var getConsent = createConsentWrapper(config);
    var cookieOptionsByCookie = {};
    var cookieOptionsByMasks = [];
    var items = {};
    var cookieOptions = {};
    (function () {
        Object.keys(config.items).forEach(function (itemName) {
            var option = config.items[itemName];
            if (option.type) {
                var _a = option,
                    type = _a.type,
                    domain = _a.domain,
                    path = _a.path;
                var options = {};
                items[itemName] = type;
                if (domain) {
                    options.domain = domain;
                }
                if (path) {
                    options.path = path;
                }
                if (consentUtils.isMask(itemName)) {
                    cookieOptionsByMasks.push(consentUtils.createMask(itemName, options));
                } else {
                    cookieOptionsByCookie[itemName] = options;
                }
            } else {
                items[itemName] = option;
            }
        });
    })();
    var checkProperty = createCheckConsentWrapper(config.dataLayer, {
        items: items,
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
        (_a = checkProperty(itemsToNames(config.dataLayer, items, cookie.getNames), consent2)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
            var getOptions = function getOptions() {
                return cookieOptionsByCookie[item.name] || consentUtils.getByMask(item.name, cookieOptionsByMasks) || cookieOptions;
            };
            if (!item.allowed) {
                cookie.remove(item.name, getOptions());
            } else if (item.data) {
                cookie.set(item.name, item.data, getOptions());
            }
        });
    };
    _init();
    var set = function set(name, value, options, limitValue) {
        var _a;
        var consent2 = checkProperty(name);
        if (consent2 === null || consent2 === void 0 ? void 0 : consent2.allowed) {
            cookie.set(name, (_a = consent2.data) !== null && _a !== void 0 ? _a : value, options, limitValue);
        }
    };
    return Object.assign({}, cookie, {
        check: checkProperty,
        set: set
    });
};
import { sessionStorage } from "@piano-sdk/storage";
var createSessionStorage = function createSessionStorage(config) {
    return createBaseConsentStorage(sessionStorage, "sessionStorage", config);
};
var createBasePropertyWrapper = function createBasePropertyWrapper(itemType, config) {
    return {
        check: createCheckConsentWrapper(config.dataLayer, {
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
import * as storage from "@piano-sdk/storage";
var consent = {
    createLocalStorage: createLocalStorage,
    createProperty: createProperty,
    createCookie: createCookie,
    createSessionStorage: createSessionStorage,
    createEvent: createEvent
};
export { consent, storage };
