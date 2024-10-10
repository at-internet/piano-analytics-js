import Config from '../config';
import Configuration from './configuration';
import PianoAnalyticsQueue from './queue';
import Model from './model';
import {
    buildStep, campaignsStep, metadataStep, onBeforeBuildStep, onBeforeSendStep, privacyStep,
    propertiesStep, sendStep, userStep, visitorStep
} from './steps/index';
import {Storage} from '../storage/storage';
import {User} from '../business/user';
import {cloneObject} from '../utils/index';
import {preloadTagging} from '../business/preload';
import {AVInsights} from '../business/avinsights';
import {VisitorId} from '../business/visitor-id';
import {initPageViewId} from '../business/pageview-id';
import {initContentProperties} from '../business/content-properties';
import {initPrivacy} from '../business/privacy/privacy';

function PianoAnalytics(configuration) {
    _initConfig(this, configuration);
    this._storage = new Storage(this);
    this._queue = new PianoAnalyticsQueue(this);
    this._properties = {};
    this._sendEvent = _sendEvent;
    this._setProperty = _setProperty;
    this._deleteProperty = _deleteProperty;
    this._visitorId = new VisitorId(this);
    initPrivacy(this);
    this.user = new User(this);
    AVInsights(this);
    if (BUILD_BROWSER) {
        initPageViewId(this);
        initContentProperties(this);
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
    const data = {events: cloneObject(events), options: cloneObject(options)};
    if (steps.length > 0 && typeof steps[0] === 'function') {
        const clonedConfig = new Configuration(this.cfg.cloneData());
        steps[0](this, new Model(this, data, clonedConfig), steps.slice(1));
    }
}

function _setProperty(pa, property, value, options) {
    if (pa._privacy.call('isPropAllowed', property)) {
        pa._properties[property] = {
            value: value,
            options: options || {}
        };
    }
    pa._queue.next();
}

function _deleteProperty(pa, property) {
    delete pa._properties[property];
    pa._queue.next();
}

PianoAnalytics.prototype.setProperty = function (property, value, options) {
    this._queue.push(['_setProperty', this, property, value, options]);
};
PianoAnalytics.prototype.setProperties = function (properties, options) {
    for (const prop in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, prop)) {
            this.setProperty(prop, properties[prop], options);
        }
    }
};
PianoAnalytics.prototype.deleteProperty = function (propertyName) {
    this._queue.push(['_deleteProperty', this, propertyName]);
};
PianoAnalytics.prototype.sendEvent = function (eventName, eventData, options) {
    this._queue.push(['_sendEvent', [{name: eventName, data: eventData}], options]);
};
PianoAnalytics.prototype.sendEvents = function (events, options) {
    this._queue.push(['_sendEvent', events, options]);
};
PianoAnalytics.prototype.PA = PianoAnalytics;

export default PianoAnalytics;
