import {getQueryStringParameters} from '../../utils/index';
import {getPageUrl} from '../page-management';

function searches(pa) {
    const keywords_list = ['q', 's', 'search', 'query', 'keyword'];
    const queryStringParams = getQueryStringParameters('', getPageUrl(), '');
    for (const keyword of keywords_list) {
        for (const qs_keyword in queryStringParams) {
            if (Object.prototype.hasOwnProperty.call(queryStringParams, qs_keyword) && keyword === qs_keyword && queryStringParams[qs_keyword] !== '') {
                // this is to have proper metadata by being at the end of the browser event loop
                // see https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
                setTimeout(function(){
                    pa.sendEvent('internal_search_result.display', {
                        'event_collection_auto': true,
                        'ise_keyword': queryStringParams[qs_keyword]
                    });
                }, 100);
                return;
            }
        }
    }
}

export {searches};
