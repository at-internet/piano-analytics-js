import {dataLayer} from './ext/data-layer/data-layer';

function VisitorId(pa) {
    this.value = null;
    pa.getVisitorId = (function (callback) {
        let forcedValue = this.value;
        let result = null;
        if (BUILD_BROWSER) {
            result = _processCallbackIfPresent(forcedValue || dataLayer.get('browserId'), callback);
        } else {
            pa._storage.getItem(pa.getConfiguration('storageVisitor'), (function (storedValue) {
                result = _processCallbackIfPresent(forcedValue || storedValue, callback);
            }).bind(pa));
        }
        if (typeof callback === 'undefined') {
            return result;
        }
    }).bind(this);
    pa.setVisitorId = (function (value) {
        this.value = value;
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (pa.getConfiguration('storageLifetimeVisitor') * 24 * 60 * 60 * 1000));
        pa._privacy.call('setItem', pa.getConfiguration('storageVisitor'), value, expirationDate, function () {
            if (BUILD_BROWSER) {
                dataLayer.updateMigration();
            }
        });
    }).bind(this);
}

function _processCallbackIfPresent(value, cb) {
    if (cb) {
        cb(value);
    }
    return value;
}

export {
    VisitorId
};
