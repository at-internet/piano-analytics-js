import {cloneObject} from '../utils/index';

function Model(pa, data, config) {
    this.properties = cloneObject(pa._properties);
    this.addEventsProperty = function (name, value) {
        if (pa._privacy.call('isPropAllowed', name)) {
            for (const event of this.events) {
                if (this.isPropertyAbsentForEvent(name, event)) {
                    event.data[name] = value;
                }
            }
        }
    };

    this.hasProperty = function (name) {
        return Object.prototype.hasOwnProperty.call(this.properties, name);
    };
    this.getConfiguration = config.getConfiguration;
    this.setConfiguration = config.setConfiguration;
    this.options = data.options || {};
    this.visitorId = null;
    this.build = {
        url: '',
        data: {}
    };
    this.events = data.events || [];
    this.isPropertyAbsentForEvent = function (name, event) {
        if (typeof event.data[name] !== 'undefined') {
            return false;
        } else if (this.hasProperty(name)) {
            if (typeof this.properties[name].options.events !== 'undefined') {
                const propertyEventsOption = this.properties[name].options.events;
                for (const eventAllowed of propertyEventsOption) {
                    if (
                        event.name === eventAllowed ||
                        (eventAllowed.charAt(eventAllowed.length - 1) === '*' && event.name.indexOf(eventAllowed.substring(0, eventAllowed.length - 1)) === 0)
                    ) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return true;
    };
}

export default Model;
