const uuid = function uuid() {
    const _cryptoObj = BUILD_BROWSER ? window.crypto || window.msCrypto : null; // IE11
    function _v4() {
        try {
            if (_cryptoObj !== null && typeof _cryptoObj === 'object') {
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                    return (c ^ _cryptoObj.getRandomValues(new Uint32Array(1))[0] & 15 >> c / 4).toString(16);
                });
            }
        } catch (e) {
            console.error(e);
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    return {
        v4: _v4
    };
}();


export {uuid};
