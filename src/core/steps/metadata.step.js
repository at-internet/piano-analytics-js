import {nextStep} from './utils/index';
import {dataLayer} from '../../business/data-layer/data-layer';

function _parseLanguage(language, separators) {
    for (const separator of separators) {
        if (language.indexOf(separator) > -1) {
            const splitted = language.split(separator);
            return [splitted[0], splitted.slice(1).join(separator)];
        }
    }
    return ['', ''];
}

function _camelToSnake(string) {
    return string.replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + '_' + m[1];
    }).toLowerCase();
}

function metadataStep(pa, model, nextSteps) {
    model.setProperty('event_collection_platform', BUILD_BROWSER ? 'js' : 'js-browserless');
    model.setProperty('event_collection_version', model.getConfiguration('version'));
    const date = new Date();
    model.setProperty('device_timestamp_utc', date.getTime());
    model.setProperty('device_local_hour', date.getTime());
    model.setProperty('device_hour', date.getHours());

    if (BUILD_BROWSER) {
        const content = dataLayer.get('content');
        for (const prop in content) {
            if (Object.prototype.hasOwnProperty.call(content, prop)) {
                const MAP_PA_DL = {
                    'createdAt': 'content_publication_date',
                    'tags': 'tags_array'
                };
                if (prop === 'createdAt' || prop === 'tags') {
                    model.setProperty(MAP_PA_DL[prop], content[prop]);
                } else {
                    model.setProperty(_camelToSnake(`content_${prop}`), content[prop]);
                }
            }
        }

        model.setProperty('has_access', dataLayer.get('userStatus'));
        model.setProperty('pageview_id', dataLayer.get('pageViewId'));
        model.setProperty('device_screen_width', window.screen.width);
        model.setProperty('device_screen_height', window.screen.height);
        model.setProperty('device_display_width',
            window.innerWidth ||
            document.documentElement && document.documentElement.clientWidth ?
                document.documentElement.clientWidth : ''
        );
        model.setProperty('device_display_height',
            window.innerHeight ||
            document.documentElement && document.documentElement.clientHeight ?
                document.documentElement.clientHeight : ''
        );
        const language = window.navigator ? (window.navigator.language || window.navigator.userLanguage) : '';
        const languageSplitted = _parseLanguage(language, ['-', '_']);
        model.setProperty('browser_language', languageSplitted[0]);
        model.setProperty('browser_language_local', languageSplitted[1]);
        model.setProperty('previous_url', document.referrer || '');
        if(document.title){
            model.setProperty('page_title_html', document.title);
        }
        const eventUrlWithQueryString = model.getConfiguration('addEventURL').toString() === 'true';
        if (eventUrlWithQueryString || (model.getConfiguration('addEventURL') === 'withoutQS')) {
            model.setProperty('page_url', eventUrlWithQueryString ? window.location.href.split('#')[0] : `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
        }
        try {
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
                .then(function (ua) {
                    function _isDefined(variable) {
                        return typeof variable !== 'undefined';
                    }

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
                            if (_isDefined(properties[i].metric)) {
                                model.setProperty(properties[i].property, ua[properties[i].metric]);
                            }
                        }
                    }
                })
                .finally(function () {
                    nextStep(pa, model, nextSteps);
                });
        } catch (e) {
            nextStep(pa, model, nextSteps);
        }
    } else {
        nextStep(pa, model, nextSteps);
    }
}

export default metadataStep;
