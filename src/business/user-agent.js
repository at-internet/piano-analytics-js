function getUserAgent(pa, model) {
    return new Promise((resolve) => {
        try {
            if (pa.getConfiguration('allowHighEntropyClientHints')) {
                window.navigator.userAgentData.getHighEntropyValues([
                    'architecture',
                    'bitness',
                    'brands',
                    'mobile',
                    'model',
                    'platform',
                    'platformVersion',
                    'uaFullVersion',
                    'fullVersionList'
                ])
                    .then(function (userAgentData) {
                        _addUserAgentMetadata(model, userAgentData);
                    })
                    .finally(function () {
                        resolve();
                    });
            } else {
                const ua = {
                    'brands': window.navigator.userAgentData.brands,
                    'platform': window.navigator.userAgentData.platform,
                    'mobile': window.navigator.userAgentData.mobile
                };
                _addUserAgentMetadata(model, ua);
                resolve();
            }
        } catch (e) {
            resolve();
        }
    });
}

function _addUserAgentMetadata(model, ua) {
    const properties = [
        {
            metric: 'brands',
            property: 'ch_ua'
        },
        {
            metric: 'architecture',
            property: 'ch_ua_arch'
        },
        {
            metric: 'bitness',
            property: 'ch_ua_bitness'
        },
        {
            metric: 'fullVersionList',
            property: 'ch_ua_full_version_list'
        },
        {
            metric: 'mobile',
            property: 'ch_ua_mobile'
        },
        {
            metric: 'model',
            property: 'ch_ua_model'
        },
        {
            metric: 'platform',
            property: 'ch_ua_platform'
        },
        {
            metric: 'platformVersion',
            property: 'ch_ua_platform_version'
        },
        {
            metric: 'uaFullVersion',
            property: 'ch_ua_full_version'
        }
    ];
    if (_isDefined(ua)) {
        for (let i = 0; i < properties.length; i++) {
            if (_isDefined(ua[properties[i].metric])) {
                model.addEventsProperty(properties[i].property, ua[properties[i].metric]);
            }
        }
    }
}

function _isDefined(variable) {
    return typeof variable !== 'undefined';
}

export {
    getUserAgent
};
