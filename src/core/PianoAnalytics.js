import Config from '../config';
import Configuration from './configuration';
import PianoAnalyticsQueue from './queue';
import Model from './model';
import {
    buildStep, campaignsStep, metadataStep, onBeforeBuildStep, onBeforeSendStep, privacyStep,
    propertiesStep, sendStep, userStep, visitorStep
} from './steps/index';
import {Storage} from '../storage/storage';
import {AtPrivacy, DlPrivacy, Privacy} from '../business/privacy/index';
import {User} from '../business/user';
import {cloneObject} from '../utils/index';
import {preloadTagging} from '../business/preload';
import {AVInsights} from '../business/avinsights';
import {dataLayer} from '../business/ext/data-layer/data-layer';

function PianoAnalytics(configuration) {
    _initConfig(this, configuration);
    this._storage = new Storage(this);
    this._queue = new PianoAnalyticsQueue(this);
    this._properties = {};
    this._sendEvent = _sendEvent;
    _initPrivacy(this);
    this.user = new User(this);
    AVInsights(this);
    if (BUILD_BROWSER) {
        _runAsyncTagging(this);
    }
}

function _initConfig(pa, configuration) {
    pa.cfg = new Configuration(cloneObject(configuration) || Config);
    pa.setConfiguration = pa.cfg.setConfiguration;
    pa.setConfigurations = pa.cfg.setConfigurations;
    pa.getConfiguration = pa.cfg.getConfiguration;
    if (BUILD_BROWSER) {
        // overriding configurations tagging
        window._pac = window._pac || {privacy: []};
        for (const config in window._pac) {
            if (Object.prototype.hasOwnProperty.call(window._pac, config) && config !== 'privacy') {
                pa.setConfiguration(config, window._pac[config]);
            }
        }
    }
}

function _initPrivacy(pa) {
    pa.setConfiguration('isLegacyPrivacy', true);
    if (BUILD_BROWSER) {
        if (typeof window.pdl === 'undefined') {
            window.pdl = {
                migration: {
                    browserId: {
                        source: 'PA'
                    }
                },
                cookies: {
                    storageMode: 'fixed'
                }
            };
        } else if (window.pdl && window.pdl.requireConsent) {
            pa.setConfiguration('isLegacyPrivacy', false);
        }
        dataLayer.init({
            cookieDefault: {
                domain: pa.getConfiguration('cookieDomain'),
                secure: pa.getConfiguration('cookieSecure'),
                path: pa.getConfiguration('cookiePath'),
                samesite: pa.getConfiguration('cookieSameSite')
            },
            cookies: {
                _pcid: {
                    expires: pa.getConfiguration('storageLifetimeVisitor')
                }
            }
        });
    }
    // public privacy api (deprecated for browser tagging)
    pa.privacy = new AtPrivacy(pa);
    if (BUILD_BROWSER) {
        // public consent api (new browser tagging for privacy)
        pa.consent = new DlPrivacy(pa);
    }
    // apis wrapper for internal use
    pa._privacy = new Privacy(pa);
}

function _runAsyncTagging(pa) {
    const asyncName = pa.getConfiguration('queueVarName');
    window[asyncName] = window[asyncName] || [];
    preloadTagging(pa, window[asyncName], true, asyncName);
}

function _sendEvent(events, options) {
    const steps = [
        privacyStep,
        visitorStep,
        userStep,
        campaignsStep,
        metadataStep,
        propertiesStep,
        onBeforeBuildStep,
        buildStep,
        onBeforeSendStep,
        sendStep
    ];
    for (let i = 0; i < events.length; i++) {
        const eventFormatted = {name: '', data: {}};
        if (typeof events[i] === 'string') {
            eventFormatted.name = events[i];
        } else if (typeof events[i].data === 'undefined') {
            eventFormatted.name = events[i].name;
        } else {
            continue;
        }
        events[i] = eventFormatted;
    }
    const data = {events: events, options: options};
    if (steps.length > 0 && typeof steps[0] === 'function') {
        const clonedConfig = new Configuration(this.cfg.cloneData());
        steps[0](this, new Model(this, data, clonedConfig), steps.slice(1));
    }
}

function _processCallbackIfPresent(value, cb) {
    if (cb) {
        cb(value);
    }
    return value;
}

PianoAnalytics.prototype.setProperty = function (property, value, options) {
    if (this._privacy.call('isPropAllowed', property)) {
        this._properties[property] = {
            value: value,
            options: options || {}
        };
    }
};
PianoAnalytics.prototype.setProperties = function (properties, options) {
    for (const prop in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, prop)) {
            this.setProperty(prop, properties[prop], options);
        }
    }
};
PianoAnalytics.prototype.deleteProperty = function (propertyName) {
    delete this._properties[propertyName];
};
PianoAnalytics.prototype.sendEvent = function (eventName, eventData, options) {
    this._queue.push(['_sendEvent', [{name: eventName, data: eventData}], options]);
};
PianoAnalytics.prototype.sendEvents = function (events, options) {
    this._queue.push(['_sendEvent', events, options]);
};
PianoAnalytics.prototype.getVisitorId = function (callback) {
    let forcedValue = this.getConfiguration('visitorId') || null;
    let result = null;
    if (BUILD_BROWSER) {
        result = _processCallbackIfPresent(forcedValue || dataLayer.get('browserId'), callback);
    } else {
        this._storage.getItem(this.getConfiguration('storageVisitor'), (function (storedValue) {
            result = _processCallbackIfPresent(forcedValue || storedValue, callback);
        }).bind(this));
    }
    if (typeof callback === 'undefined') {
        return result;
    }
};
PianoAnalytics.prototype.setVisitorId = function (value) {
    this.setConfiguration('visitorId', value);
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (this.getConfiguration('storageLifetimeVisitor') * 24 * 60 * 60 * 1000));
    this._privacy.call('setItem', this.getConfiguration('storageVisitor'), value, expirationDate, function () {
        if (BUILD_BROWSER) {
            dataLayer.updateMigration();
        }
    });
};
PianoAnalytics.prototype.setUser = function (id, category, enableStorage) {
    this.user.setUser(id, category, enableStorage);
};
PianoAnalytics.prototype.getUser = function (callback) {
    this.user.getUser(callback);
};
PianoAnalytics.prototype.deleteUser = function () {
    this.user.deleteUser();
};
PianoAnalytics.prototype.PA = PianoAnalytics;

if (BUILD_BROWSER) {
    PianoAnalytics.prototype.refresh = function () {
        dataLayer.refresh();
    };
    PianoAnalytics.prototype.setContentProperty = function (name, value) {
        const MAP_PA_DL = {
            'content_publication_date': 'createdAt',
            'tags_array': 'tags'
        };
        const temp = {};
        if (name === 'content_publication_date' || name === 'tags_array') {
            temp[MAP_PA_DL[name]] = value;
        } else {
            temp[name] = value;
        }
        dataLayer.set('content', temp);
    };
    PianoAnalytics.prototype.setContentProperties = function (content) {
        for (const prop in content) {
            if (Object.prototype.hasOwnProperty.call(content, prop)) {
                this.setContentProperty(prop, content[prop]);
            }
        }
    };
}

export default PianoAnalytics;
