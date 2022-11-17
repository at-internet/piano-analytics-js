import {cloneObject} from '../utils/index';

function Configuration(data) {
    const _configuration = data;

    function setConfiguration(key, value) {
        if(value === null || value === '' || value === undefined){
            return;
        }
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

    function deleteProperty(property) {
        delete _configuration[property];
    }

    return {
        setConfiguration: setConfiguration,
        setConfigurations: setConfigurations,
        getConfiguration: getConfiguration,
        cloneData: cloneData,
        deleteProperty: deleteProperty,
    };
}

export default Configuration;
