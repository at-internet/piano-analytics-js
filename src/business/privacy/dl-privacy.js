import {consent} from '../consent/consent';
import {dataLayer} from '../data-layer/data-layer';
import {getConsentItems} from './dl-privacy-configuration';

function DlPrivacy(pa) {
    this.storageKeys = [
        'pa_vid',
        'pa_user',
        'pa_privacy',
        'atuserid'
    ];
    this.propertyConsent = {};
    this.eventConsent = {};
    this.storageConsent = {};
    this.consentItems = {
        propertyItems: {},
        eventItems: {},
        cookieItems: {}
    };
    this.modeMetadata = {
        'opt-in': {
            'visitor_privacy_consent': true,
            'visitor_privacy_mode': 'optin'
        },
        'opt-out': {
            'visitor_privacy_consent': false,
            'visitor_privacy_mode': 'optout'
        },
        'essential': {
            'visitor_privacy_consent': false,
            'visitor_privacy_mode': 'exempt'
        },
        'custom': {
            'visitor_privacy_consent': false,
            'visitor_privacy_mode': 'custom'
        }
    };

    this.init = function () {
        this.consentItems = getConsentItems();
        this.propertyConsent = consent.createProperty({
            dataLayer,
            productName: 'PA',
            items: this.consentItems.propertyItems
        });
        this.eventConsent = consent.createEvent({
            dataLayer,
            productName: 'PA',
            items: this.consentItems.eventItems
        });
        this.storageConsent = consent.createCookie({
            dataLayer,
            productName: 'PA',
            items: this.consentItems.cookieItems
        });
        if(!pa.getConfiguration('isLegacyPrivacy')){
            this.filterKeys();
        }
    };

    /* public */
    this.setMode = function (mode) {
        _switchToDl();
        dataLayer.set('consent', {
            PA: {mode: mode}
        });
        this.filterKeys();
    };
    this.setPresets = function (presets) {
        _switchToDl();
        dataLayer.set('consent', presets);
        this.filterKeys();
    };
    this.getMode = function () {
        _switchToDl();
        let consent = 'opt-in';
        const dlConsent = dataLayer.get('consent');
        if (dlConsent && dlConsent['PA'] && dlConsent['PA'].mode) {
            consent = dataLayer.get('consent')['PA'].mode;
        } else if (dlConsent === null) {
            if (window.pdl.consent && window.pdl.consent.defaultPreset) {
                dataLayer.set('consent', 0);
            } else {
                this.setMode(consent);
            }
        }
        return consent;
    };
    this.setCustomModeMetadata = function (consentValue, modeName) {
        _switchToDl();
        this.modeMetadata['custom'].visitor_privacy_mode = modeName || 'custom';
        this.modeMetadata['custom'].visitor_privacy_consent = consentValue;
    };

    /* internal use */
    this.getModeMetadata = function () {
        return this.modeMetadata[this.getMode()] || {};
    };
    this.getConsentItems = function () {
        return this.consentItems;
    };
    this.isPropAllowed = (function (propertyName) {
        return this.propertyConsent.check(propertyName).allowed;
    }).bind(this);
    this.isEventAllowed = (function (eventName) {
        return this.eventConsent.check(eventName).allowed;
    }).bind(this);
    this.isKeyAllowed = (function (storageKey) {
        return this.storageConsent.check(storageKey).allowed;
    }).bind(this);

    this.filterProps = function (properties) {
        for (const prop in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, prop) && !this.isPropAllowed(prop)) {
                delete properties[prop];
            }
        }
    };
    this.filterEvents = function (events) {
        for (let i = events.length - 1; i >= 0; i--) {
            if (!this.isEventAllowed(events[i].name)) {
                events.splice(i, 1);
            }
        }
    };
    this.filterKeys = function () {
        for (const key of this.storageKeys) {
            if (!this.isKeyAllowed(key)) {
                pa._storage.deleteItem(key);
            }
        }
    };

    this.setItem = function (key, value, expiration, callback) {
        if (this.isKeyAllowed(key)) {
            pa._storage.setItem(key, value, expiration, callback);
        } else {
            callback && callback();
        }
    };

    function _switchToDl() {
        if (pa.getConfiguration('isLegacyPrivacy')) {
            pa.setConfiguration('isLegacyPrivacy', false);
            this.filterKeys();
        }
    }

    this.dl = dataLayer;

    this.init();
}

export {
    DlPrivacy
};
