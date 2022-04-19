import {cloneObject} from '../utils/index';

function Configuration(data) {
    const _configuration = data;

    function setConfiguration(key, value) {
        _configuration[key] = value;
    }

    function setConfigurations(customConfigurations) {
        for (const key in customConfigurations) {
            if (Object.prototype.hasOwnProperty.call(customConfigurations, key)) {
                setConfiguration(key, customConfigurations[key]);
            }
        }
    }

    function getConfiguration(key) {
        if (typeof _configuration[key] !== 'undefined') {
            return cloneObject(_configuration[key]);
        }
        return null;
    }

    function cloneData() {
        return cloneObject(_configuration);
    }

    return {
        setConfiguration: setConfiguration,
        setConfigurations: setConfigurations,
        getConfiguration: getConfiguration,
        cloneData: cloneData
    };
}

export default Configuration;
