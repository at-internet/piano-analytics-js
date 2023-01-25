(function (exports) {
    exports.Url = function () {
        return {
            getQueryStringValue: function (variable, chaine) {
                let str = '', posDebut, posFin;
                posDebut = Math.max(chaine.indexOf('&' + variable + '='), chaine.indexOf('?' + variable + '='));
                if (posDebut !== -1) {
                    str = chaine.substring(posDebut + ('&' + variable + '=').length);
                    posFin = (str.indexOf('&') === -1) ? str.length : str.indexOf('&');
                    return str.substring(0, posFin);
                }
                return undefined;
            }
        };
    }();

    let cloneObject = function (original) {
        if (typeof original !== 'object' || original === null || original instanceof Date) {
            return original;
        }
        let copy = new original.constructor;
        for (let i in original) {
            if (Object.prototype.hasOwnProperty.call(original, i)) {
                copy[i] = Utility.cloneObject(original[i]);
            }
        }
        return copy;
    };
    exports.cloneObject = cloneObject;

    let clearStorage = function (pa_instance) {
        const storageKeys = Object.assign(pa_instance.getConfiguration('privacy').legacyKeys, pa_instance.getConfiguration('privacy').storageKeys);
        for (let key in storageKeys) {
            if (Object.prototype.hasOwnProperty.call(storageKeys, key)) {
                pa_instance._storage.deleteItem(key);
            }
        }
    };
    exports.clearStorage = clearStorage;
})(typeof global === 'undefined' ? window['Utility'] = {} : global['Utility'] = {});
