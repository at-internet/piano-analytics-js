import {onPageView} from '../page-management';
import {checkPageView, pages} from './pages';
import {searches} from './searches';
import {downloads} from './downloads';

let config = false;

function initInstantTracking(pa) {
    const config = pa.getConfiguration('instantTracking');
    if (pa.getConfiguration('instantTracking') !== false) {
        onPageView(instantTracking.bind(pa));
    }
    if (config === true || (config && config.downloads)) {
        downloads(pa);
    }
}

function instantTracking(isFirstPage) {
    config = this.getConfiguration('instantTracking');
    const isPageView = checkPageView(isFirstPage, config.pages);
    if ((config === true || (config && config.pages)) && isPageView) {
        pages(this);
    }
    if (config === true || (config && config.searches === true)) {
        searches(this);
    }
}

export {
    initInstantTracking
};
