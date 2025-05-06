import {getPageUrl} from '../page-management';

let previousPageUrl = new URL(window.location.href);
const Rule = {
    'all': 0,
    'queryString': 1,
    'path': 2
};

function pages(pa) {
    // this is to have proper metadata by being at the end of the browser event loop
    // see https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
    setTimeout(function(){
        pa.sendEvent('page.display', {'event_collection_auto': true});
    },100);
}

function checkPageView(isFirstPage, pageConfig) {
    if (isFirstPage) {
        return true;
    }
    const pageUrl = getPageUrl();
    const detectionRule = Rule[(pageConfig && typeof pageConfig.urlDetection === 'string' ? pageConfig.urlDetection : 'all')] || 0;
    let url = `${pageUrl.protocol}//${pageUrl.host}${pageUrl.pathname}${detectionRule < 2 ? pageUrl.search : ''}${detectionRule < 1 ? pageUrl.hash : ''}`;
    let previousUrl = `${previousPageUrl.protocol}//${previousPageUrl.host}${previousPageUrl.pathname}${detectionRule < 2 ? previousPageUrl.search : ''}${detectionRule < 1 ? previousPageUrl.hash : ''}`;
    if (previousUrl !== url) {
        previousPageUrl = new URL(pageUrl.href);
        return true;
    } else {
        return false;
    }
}

export {
    pages,
    checkPageView
};
