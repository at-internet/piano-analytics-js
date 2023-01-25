import {preloadTagging} from '../preload';
import {cloneObject} from '../../utils/index';

function AtPrivacy(pa) {
    const config = pa.getConfiguration('privacy');
    this.currentMode = '';
    this.modes = config.modes;
    this._storageKeys = Object.assign(config.legacyKeys, config.storageKeys);

    this.init = function () {
        if (pa.getConfiguration('isLegacyPrivacy')) {
            if (BUILD_BROWSER) {
                window._pac = window._pac || {privacy: []};
                preloadTagging(this, window._pac.privacy);
            }
            pa._storage.getItem(config.storageKey, (function (storedMode) {
                this.setMode((storedMode && this.modes[storedMode]) ? storedMode : pa.getConfiguration('privacyDefaultMode'));
            }).bind(this));
        }
    };

    this.setMode = function (mode) {
        if (mode === this.currentMode || !this.modes[mode]) {
            return;
        }
        this.currentMode = mode;
        pa._storage.getItem(config.storageKey, (function (storedMode) {
            if (mode === 'optout' || mode === 'no-consent' || mode === 'no-storage') {
                pa.setConfiguration('visitorId', this.modes[mode].visitorId);
            } else if (pa.getConfiguration('visitorId') === 'OPT-OUT' || pa.getConfiguration('visitorId') === 'no-consent' || pa.getConfiguration('visitorId') === 'no-storage') {
                pa.cfg.deleteProperty('visitorId');
            }
            this.filterProps(pa._properties);
            this.filterKeys();

            if (storedMode !== mode) {
                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (pa.getConfiguration('storageLifetimePrivacy') * 24 * 60 * 60 * 1000));
                this.setItem(config.storageKey, mode, expirationDate);
            }
        }).bind(this));
    };
    this.createMode = function (modeName, consentValue) {
        if (!this.modes[modeName]) {
            const newMode = cloneObject(this.modes['exempt']);
            newMode.name = modeName;
            newMode.properties.include['visitor_privacy_mode'] = modeName;
            newMode.properties.include['visitor_privacy_consent'] = consentValue;
            this.modes[modeName] = newMode;
        }
    };
    this.getMode = function () {
        return this.currentMode;
    };

    const _addElements = (function (properties, modes, events, isBlacklisting, isForStorage, isForEvent) {
        let _modes = ['*'];
        let _events = ['*'];
        let propertyType = 'properties';
        const listType = isBlacklisting ? 'forbidden' : 'allowed';
        if (modes) {
            _modes = typeof modes === 'string' ? [modes] : modes;
        }
        if (events) {
            _events = typeof events === 'string' ? [events] : events;
        }
        if (isForStorage) {
            propertyType = 'storage';
        }
        if (isForEvent) {
            propertyType = 'events';
        }
        for (let i = 0; i < _modes.length; i++) {
            if (typeof this.modes[_modes[i]] === 'undefined') {
                continue;
            }
            const _mode = this.modes[_modes[i]];
            for (let j = 0; j < _events.length; j++) {
                const itemList = _mode[propertyType][listType];
                if (typeof itemList[_events[j]] === 'undefined' && !isForStorage && !isForEvent) {
                    itemList[_events[j]] = {};
                }
                for (let k = 0; k < properties.length; k++) {
                    if (isForStorage || isForEvent) {
                        itemList[properties[k]] = true;
                    } else {
                        itemList[_events[j]][properties[k]] = true;
                    }
                }
            }
        }
    }).bind(this);
    this.include = {
        properties: function (propsArray, modes, events) {
            _addElements(propsArray, modes, events);
        },
        property: function (prop, modes, events) {
            _addElements([prop], modes, events);
        },
        storageKeys: function (keysArray, modes) {
            _addElements(keysArray, modes, null, false, true);
        },
        storageKey: function (key, modes) {
            _addElements([key], modes, null, false, true);
        },
        events: function (eventsNames, modes) {
            _addElements(eventsNames, modes, null, false, false, true);
        },
        event: function (eventName, modes) {
            _addElements([eventName], modes, null, false, false, true);
        }
    };
    this.exclude = {
        properties: function (propsArray, modes, events) {
            _addElements(propsArray, modes, events, true);
        },
        property: function (prop, modes, events) {
            _addElements([prop], modes, events, true);
        },
        storageKeys: function (keysArray, modes) {
            _addElements(keysArray, modes, null, true, true);
        },
        storageKey: function (key, modes) {
            _addElements([key], modes, null, true, true);
        },
        events: function (eventNames, modes) {
            _addElements(eventNames, modes, null, true, false, true);
        },
        event: function (eventName, modes) {
            _addElements([eventName], modes, null, true, false, true);
        }
    };

    /* Events Authorizations methods */
    const _modeHasEvent = function (modeEvents, event) {
        if (modeEvents[event]) {
            return true;
        } else {
            for (const evt in modeEvents) {
                if (Object.prototype.hasOwnProperty.call(modeEvents, evt)) {
                    if (evt.charAt(evt.length - 1) === '*' && event.indexOf(evt.substring(0, evt.length - 1)) === 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    const _checkModesForEvent = function (typeList, modes, currentMode, event) {
        const isKeyInCurrentMode = _modeHasEvent(modes[currentMode].events[typeList], event);
        const isKeyInWildcardMode = _modeHasEvent(modes['*'].events[typeList], event);
        return isKeyInCurrentMode || isKeyInWildcardMode;
    };
    this.isEventAllowed = function (event) {
        const isEventBlacklisted = _checkModesForEvent('forbidden', this.modes, this.currentMode, event);
        const isEventWhitelisted = _checkModesForEvent('allowed', this.modes, this.currentMode, event);
        return isEventBlacklisted ? false : isEventWhitelisted;
    };

    /* Properties Authorizations methods */
    const _checkPropertyWithEvent = function (mode, typeList, property, event) {
        const modeEventList = mode[typeList];
        if (
            (modeEventList[event] && modeEventList[event][property]) ||
            modeEventList['*'][property]
        ) {
            return true;
        }
        for (const evt in modeEventList) {
            if (Object.prototype.hasOwnProperty.call(modeEventList, evt) &&
                (evt.charAt(evt.length - 1) === '*' && event.indexOf(evt.substring(0, evt.length - 1)) === 0) ||
                evt === event) {
                for (const prop in modeEventList[evt]) {
                    if (Object.prototype.hasOwnProperty.call(modeEventList[evt], prop)) {
                        if ((prop.charAt(prop.length - 1) === '*' && property.indexOf(prop.substring(0, prop.length - 1)) === 0) || property === prop) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    const _checkPropertyWithoutEvent = function (mode, typeList, property) {
        if (typeList === 'forbidden') {
            if (mode[typeList]['*'][property]) {
                return true;
            }
        }
        for (const evt in mode[typeList]) {
            if (Object.prototype.hasOwnProperty.call(mode[typeList], evt)) {
                if (mode[typeList][evt][property]) {
                    return true;
                } else {
                    for (const prop in mode[typeList][evt]) {
                        if (prop.charAt(prop.length - 1) === '*' && property.indexOf(prop.substring(0, prop.length - 1)) === 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    const _checkModesListForProperty = function (typeList, modes, currentMode, property, event) {
        let isPropertyInCurrentMode;
        let isPropertyInWildcardMode;
        if (event) {
            isPropertyInCurrentMode = _checkPropertyWithEvent(modes[currentMode].properties, typeList, property, event);
            isPropertyInWildcardMode = _checkPropertyWithEvent(modes['*'].properties, typeList, property, event);
        } else {
            isPropertyInCurrentMode = _checkPropertyWithoutEvent(modes[currentMode].properties, typeList, property);
            isPropertyInWildcardMode = _checkPropertyWithoutEvent(modes['*'].properties, typeList, property);
        }
        return isPropertyInCurrentMode || isPropertyInWildcardMode;
    };
    this.isPropAllowed = function (propertyName, event) {
        const isPropertyBlacklisted = _checkModesListForProperty('forbidden', this.modes, this.currentMode, propertyName, event);
        const isPropertyWhitelisted = _checkModesListForProperty('allowed', this.modes, this.currentMode, propertyName, event);
        return isPropertyBlacklisted ? false : isPropertyWhitelisted;
    };

    /* Storage keys Authorizations methods */
    const _modeListHasKey = function (mode, typeList, key) {
        const modeListProperties = mode[typeList];
        if (modeListProperties[key]) {
            return true;
        }
        for (const prop in modeListProperties) {
            if (Object.prototype.hasOwnProperty.call(modeListProperties, prop)) {
                if (prop.charAt(prop.length - 1) === '*' && key.indexOf(prop.substring(0, prop.length - 1)) === 0) {
                    return true;
                }
            }
        }
        return false;
    };
    const _checkModesListForKey = function (typeList, modes, currentMode, key) {
        const isKeyInCurrentMode = _modeListHasKey(modes[currentMode].storage, typeList, key);
        const isKeyInWildcardMode = _modeListHasKey(modes['*'].storage, typeList, key);
        return isKeyInCurrentMode || isKeyInWildcardMode;
    };
    this.isKeyAllowed = function (key) {
        const isKeyBlacklisted = _checkModesListForKey('forbidden', this.modes, this.currentMode, key);
        const isKeyWhitelisted = _checkModesListForKey('allowed', this.modes, this.currentMode, key);
        return isKeyBlacklisted ? false : isKeyWhitelisted;
    };

    /* storage global method to use */
    this.setItem = function (key, value, expiration, callback) {
        if (this.isKeyAllowed(key)) {
            pa._storage.setItem(key, value, expiration, callback);
        } else {
            callback && callback();
        }
    };

    /* filters */
    this.filterProps = function (properties, event) {
        for (const prop in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, prop) && !this.isPropAllowed(prop, event ? event : undefined)) {
                delete properties[prop];
            }
        }
    };
    this.filterKeys = function () {
        for (const key in this._storageKeys) {
            if (Object.prototype.hasOwnProperty.call(this._storageKeys, key) && !this.isKeyAllowed(key)) {
                pa._storage.deleteItem(key);
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
    this.getModeMetadata = function () {
        return this.modes[this.getMode()].properties.include;
    };

    this.init();
}

export {
    AtPrivacy
};
