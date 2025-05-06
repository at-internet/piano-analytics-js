import {nextStep} from './utils/index';
import {getQueryStringParameters} from '../../utils/index';



function _addCampaignParams(pa, model, href, prefix, destPrefix) {
    const campaignParams = getQueryStringParameters(prefix, href, destPrefix);
    let found = false;
    for (const param in campaignParams) {
        if (Object.prototype.hasOwnProperty.call(campaignParams, param) && !model.properties[param]) {
            model.addEventsProperty(param, campaignParams[param], {persistent: true});
        }
        found = true;
    }
    return found;
}

function campaignsStep(pa, model, nextSteps) {
    if (BUILD_BROWSER) {
        const href = document.location.href;
        const prefixes = model.getConfiguration('campaignPrefix');
        for (const prefix of prefixes) {
            const found = _addCampaignParams(pa, model, href, prefix, 'src_');
            if (found) {
                break;
            }
        }
        if (model.getConfiguration('enableUTMTracking')) {
            _addCampaignParams(pa, model, href, 'utm_', 'utm_');
        }
    }
    nextStep(pa, model, nextSteps);
}

export {campaignsStep};
