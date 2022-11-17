import {encoding} from '../utils/index';

const localVariable = {};

function LocalVariable(pa) {
    this.setItem = function (name, data, expiration, callback) {
        const formattedData = JSON.stringify({
            data: data,
            expires: expiration ? expiration.getTime() : 0,
        });
        localVariable[name] = pa.getConfiguration('encodeStorageBase64') ? encoding.base64.encode(formattedData) : formattedData;
        callback && callback();
    };
    this.getItem = function (name, callback) {
        let data = null;
        if (typeof localVariable[name] !== 'undefined') {
            let dataStored;
            try {
                dataStored = JSON.parse(localVariable[name]);
            } catch (e) {
                dataStored = JSON.parse(encoding.base64.decode(localVariable[name]));
            }
            if (dataStored.expires === 0 || (new Date().getTime() < dataStored.expires)) {
                data = dataStored.data;
                callback && callback(data);
            } else if (new Date().getTime() > dataStored.expires) {
                this.deleteItem(name, function () {
                    callback && callback(data);
                });
            }
        } else {
            callback && callback(data);
        }
    };
    this.deleteItem = function (name, callback) {
        delete localVariable[name];
        callback && callback();
    };
}

export {LocalVariable};
