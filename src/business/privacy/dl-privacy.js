import {consent} from '../ext/consent/consent';
import {dataLayer} from '../ext/data-layer/data-layer';
import {getConsentItems} from './dl-privacy-configuration';

function DlPrivacy(pa) {
    const DEFAULT_MODE = pa.getConfiguration('consentDefaultMode') || 'opt-in';
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
            'visitor_privacy_mode': pa.getConfiguration('enableExtendedOptout') === true ? 'extended-optout' : 'optout'
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
    const isConsentv2 = function () {
        return window.pdl.requireConsent === 'v2';
    };

    this.isPAConsentDisabled = function () {
        const _consent = dataLayer.get('consent');
        return !(_consent && _consent['PA']);
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
        if (!pa._privacy.isLegacyPrivacy) {
            this.initMode();
            this.filterKeys();
        }
    };
    this.initMode = function () {
        if (dataLayer.get('consent') === null) {
            if (window.pdl.consent && window.pdl.consent.defaultPreset) {
                dataLayer.set('consent', 0);
            } else {
                this.setMode(DEFAULT_MODE);
            }
        }
    };
    /* public */
    this.setMode = function (mode) {
        dataLayer.set('consent', {
            PA: {mode: mode}
        });
        this.filterKeys();
    };
    this.setPresets = function (presets) {
        dataLayer.set('consent', presets);
        this.filterKeys();
    };
    this.getMode = function () {
        let consent = DEFAULT_MODE;
        const dlConsent = dataLayer.get('consent');
        if (dlConsent && dlConsent['PA'] && dlConsent['PA'].mode) {
            consent = dataLayer.get('consent')['PA'].mode;
        }
        return consent;
    };
    this.setCustomModeMetadata = function (consentValue, modeName) {
        this.modeMetadata['custom'].visitor_privacy_mode = modeName || 'custom';
        this.modeMetadata['custom'].visitor_privacy_consent = consentValue;
    };
    this.setAllPurposes = function (mode) {
        if (isConsentv2()) {
            return dataLayer.utils.setConsent(mode);
        }
    };
    this.setByPurpose = function (purpose, mode, products) {
        if (isConsentv2()) {
            dataLayer.utils.setConsent(purpose, mode, products);
        }
    };
    this.getByPurpose = function () {
        return dataLayer.utils.getConsent();
    };

    /* internal use */
    this.getModeMetadata = function () {
        return this.modeMetadata[this.getMode()] || {};
    };
    this.getConsentItems = function () {
        return this.consentItems;
    };
    this.isPropAllowed = (function (propertyName) {
        if (this.isPAConsentDisabled() || (pa.getConfiguration('enableExtendedOptout') === true && this.getMode() === 'opt-out')) {
            return true;
        }
        return this.propertyConsent.check(propertyName).allowed;
    }).bind(this);
    this.isEventAllowed = (function (eventName) {
        if (this.isPAConsentDisabled() || (pa.getConfiguration('enableExtendedOptout') === true && this.getMode() === 'opt-out')) {
            return true;
        }
        return this.eventConsent.check(eventName).allowed;
    }).bind(this);
    this.isKeyAllowed = (function (storageKey) {
        return this.isPAConsentDisabled() ? true : this.storageConsent.check(storageKey).allowed;
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

    this.dl = dataLayer;

    this.init();
}

export {
    DlPrivacy
};
