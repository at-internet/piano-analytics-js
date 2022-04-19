import {cloneObject} from '../utils/index';

function Model(pa, data, config) {
    this.properties = cloneObject(pa.properties);
    this.setProperty = function (name, value, options) {
        if (pa.privacy.isPropAllowed(name)) {
            this.properties[name] = {
                value: value,
                options: options || {}
            };
        }
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
