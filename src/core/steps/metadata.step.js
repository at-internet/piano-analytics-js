import {nextStep} from './utils/index';
import {dataLayer} from '../../business/ext/data-layer/data-layer';
import {processPageViewId} from '../../business/pageview-id';
import {processContentProperties} from '../../business/content-properties';
import {getUserAgent} from '../../business/user-agent';

function metadataStep(pa, model, nextSteps) {
    model.addEventsProperty('event_collection_platform', BUILD_BROWSER ? 'js' : 'js-browserless');
    model.addEventsProperty('event_collection_version', model.getConfiguration('version'));
    const date = new Date();
    model.addEventsProperty('device_timestamp_utc', date.getTime());
    model.addEventsProperty('device_local_hour', date.getTime());
    model.addEventsProperty('device_hour', date.getHours());
    if (BUILD_BROWSER) {
        processPageViewId(pa, model);
        processContentProperties(model);
        try {
            const cookieCreationDate = new Date((new Date(dataLayer.cookies._pcid.fixedAt[0])).setUTCHours(0, 0, 0, 0)).toISOString();
            model.addEventsProperty('cookie_creation_date', cookieCreationDate);
        } catch (e) {
            /* empty */
        }
        model.addEventsProperty('has_access', dataLayer.get('userStatus'));
        model.addEventsProperty('device_screen_width', window.screen.width);
        model.addEventsProperty('device_screen_height', window.screen.height);
        model.addEventsProperty('device_display_width', _getInnerOrClientSize('Width'));
        model.addEventsProperty('device_display_height', _getInnerOrClientSize('Height'));
        const languageSplitted = _parseLanguage(['-', '_']);
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
        getUserAgent(pa, model).finally(() => {
            nextStep(pa, model, nextSteps);
        });
    } else {
        nextStep(pa, model, nextSteps);
    }
}

function _parseLanguage(separators) {
    const language = window.navigator ? (window.navigator.language || window.navigator.userLanguage) : '';
    for (const separator of separators) {
        if (language.indexOf(separator) > -1) {
            const splitted = language.split(separator);
            return [splitted[0], splitted.slice(1).join(separator)];
        }
    }
    return ['', ''];
}

function _getInnerOrClientSize(side) {
    return (window[`inner${side}`] || document.documentElement && document.documentElement[`client${side}`] ? document.documentElement[`client${side}`] : '');
}


export {metadataStep};
