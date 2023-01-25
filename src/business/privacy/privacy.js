function Privacy(pa) {
    this.modeEnum = {
        OPTOUT: (() => {
            return pa.getConfiguration('isLegacyPrivacy') ? 'optout' : 'opt-out';
        })()
    }
    this.call = function (method, ...paramsArray) {
        const privacy = pa.getConfiguration('isLegacyPrivacy') ? 'privacy' : 'consent';
        return pa[privacy][method].apply(pa[privacy], paramsArray);
    }
}

export {
    Privacy
};
