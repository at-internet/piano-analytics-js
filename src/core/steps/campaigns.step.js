import {nextStep} from './utils/index';

function _getQueryStringParameters(prefix, str, destPrefix) {
    const campaign = {};
    const regex = new RegExp('[&#?]{1}([^&=#?]*)=([^&#]*)?', 'g');
    let match = regex.exec(str);
    while (match !== null) {
        if (match[1].indexOf(prefix) === 0) {
            campaign[destPrefix + match[1].substring(prefix.length)] = window.decodeURIComponent(match[2]);
        }
        match = regex.exec(str);
    }
    return campaign;
}

function _addCampaignParams(pa, model, href, prefix, destPrefix) {
    const campaignParams = _getQueryStringParameters(prefix, href, destPrefix);
    let found = false;
    for (const param in campaignParams) {
        if (Object.prototype.hasOwnProperty.call(campaignParams, param) && !model.properties[param]) {
            model.setProperty(param, campaignParams[param], {persistent: true});
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
