import {nextStep} from './utils/index';
import {dataLayer} from '../../business/ext/data-layer/data-layer';

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
    model.addEventsProperty('event_collection_platform', BUILD_BROWSER ? 'js' : 'js-browserless');
    model.addEventsProperty('event_collection_version', model.getConfiguration('version'));
    const date = new Date();
    model.addEventsProperty('device_timestamp_utc', date.getTime());
    model.addEventsProperty('device_local_hour', date.getTime());
    model.addEventsProperty('device_hour', date.getHours());

    if (BUILD_BROWSER) {
        const manualConfig = 'isManualPageRefresh',
            pageviewidProp = 'pageview_id',
            notFirstPageConfig = '_isNotFirstPageView';
        for (const event of model.events) {
            if (event.name === 'page.display') {
                if (pa.getConfiguration(manualConfig) === null && pa.getConfiguration(notFirstPageConfig)) {
                    pa.setConfiguration(manualConfig, false);
                }

                if (pa.getConfiguration('enableAutomaticPageRefresh') && pa.getConfiguration(manualConfig) === false && pa.getConfiguration(notFirstPageConfig)) {
                    dataLayer.refresh();
                }
                if (!pa.getConfiguration(notFirstPageConfig)) {
                    pa.setConfiguration(notFirstPageConfig, true);
                }

            }
            if (pa._privacy.call('isPropAllowed', pageviewidProp) && model.isPropertyAbsentForEvent(pageviewidProp, event)) {
                event.data[pageviewidProp] = dataLayer.get('pageViewId');
            }
        }

        try {
            const cookieCreationDate = new Date((new Date(dataLayer.cookies._pcid.fixedAt[0])).setUTCHours(0, 0, 0, 0)).toISOString();
            model.addEventsProperty('cookie_creation_date', cookieCreationDate);
        } catch (e) { /* empty */
        }
        const content = dataLayer.get('content');
        for (const propContent in content) {
            if (Object.prototype.hasOwnProperty.call(content, propContent)) {
                const MAP_PA_DL = {
                    'createdAt': 'content_publication_date',
                    'tags': 'tags_array'
                };
                const propFinalName = (propContent === 'createdAt' || propContent === 'tags') ? MAP_PA_DL[propContent] : _camelToSnake(`content_${propContent}`);
                model.addEventsProperty(propFinalName, content[propContent]);
            }
        }

        model.addEventsProperty('has_access', dataLayer.get('userStatus'));
        model.addEventsProperty('device_screen_width', window.screen.width);
        model.addEventsProperty('device_screen_height', window.screen.height);
        model.addEventsProperty('device_display_width',
            window.innerWidth ||
            document.documentElement && document.documentElement.clientWidth ?
                document.documentElement.clientWidth : ''
        );
        model.addEventsProperty('device_display_height',
            window.innerHeight ||
            document.documentElement && document.documentElement.clientHeight ?
                document.documentElement.clientHeight : ''
        );
        const language = window.navigator ? (window.navigator.language || window.navigator.userLanguage) : '';
        const languageSplitted = _parseLanguage(language, ['-', '_']);
        model.addEventsProperty('browser_language', languageSplitted[0]);
        model.addEventsProperty('browser_language_local', languageSplitted[1]);
        model.addEventsProperty('previous_url', document.referrer || '');
        if (document.title) {
            model.addEventsProperty('page_title_html', document.title);
        }
        const eventUrlWithQueryString = model.getConfiguration('addEventURL').toString() === 'true';
        if (eventUrlWithQueryString || (model.getConfiguration('addEventURL') === 'withoutQS')) {
            model.addEventsProperty('event_url_full', eventUrlWithQueryString ? window.location.href.split('#')[0] : `${window.location.protocol}//${window.location.host}${window.location.pathname}`);
        }

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
                        nextStep(pa, model, nextSteps);
                    });
            } else {
                const ua = {
                    'brands': window.navigator.userAgentData.brands,
                    'platform': window.navigator.userAgentData.platform,
                    'mobile': window.navigator.userAgentData.mobile
                };
                _addUserAgentMetadata(model, ua);
                nextStep(pa, model, nextSteps);
            }
        } catch (e) {
            nextStep(pa, model, nextSteps);
        }
    } else {
        nextStep(pa, model, nextSteps);
    }
}

function _isDefined(variable) {
    return typeof variable !== 'undefined';
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

export {metadataStep};
