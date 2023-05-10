import {cloneObject} from '../utils/index';

function Model(pa, data, config) {
    this.properties = cloneObject(pa._properties);
    this.setProperty = function (name, value, options) {
        if (pa._privacy.call('isPropAllowed', name)) {
            this.properties[name] = {
                value: value,
                options: options || {}
            };
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
}

export default Model;
