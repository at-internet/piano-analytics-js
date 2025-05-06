function configOverride(pa) {
    try {
        const config = JSON.parse(document.currentScript.dataset.config);
        _checkAndOverrides(pa, config);
    } catch (e) {
        /* empty */
    }
    window._pac = window._pac || {privacy: []};
    _checkAndOverrides(pa, window._pac);
}

function _checkAndOverrides(pa, customConfigurations) {
    for (const config in customConfigurations) {
        if (Object.prototype.hasOwnProperty.call(customConfigurations, config) && config !== 'privacy') {
            pa.setConfiguration(config, customConfigurations[config]);
        }
    }
}

export {
    configOverride
};
