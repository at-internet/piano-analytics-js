import dataLayer from './ext/data-layer/data-layer';

let pageviewidProp = 'pageview_id';
let isManualPageRefresh = null;
let isNotFirstPageView = false;

function processPageViewId(pa, model) {
    for (const event of model.events) {
        if (event.name === 'page.display') {
            if (isManualPageRefresh === null && isNotFirstPageView) {
                isManualPageRefresh = false;
            }
            if (pa.getConfiguration('enableAutomaticPageRefresh') && isManualPageRefresh === false && isNotFirstPageView) {
                dataLayer.refresh();
            }
            if (!isNotFirstPageView) {
                isNotFirstPageView = true;
            }
        }
        if (pa._privacy.call('isPropAllowed', pageviewidProp) && model.isPropertyAbsentForEvent(pageviewidProp, event)) {
            event.data[pageviewidProp] = dataLayer.get('pageViewId');
        }
    }
}

function initPageViewId(pa) {
    pa.refresh = function () {
        if (isManualPageRefresh === null) {
            isManualPageRefresh = true;
        }
        if (isManualPageRefresh) {
            dataLayer.refresh();
        }
    };
}


export {
    processPageViewId,
    initPageViewId
};
