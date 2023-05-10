import {nextStep} from './utils/index';

function buildStep(pa, model, nextSteps) {
    const collectDomain = model.getConfiguration('collectDomain');
    const defaultProtocol = (collectDomain.startsWith('https://') || collectDomain.startsWith('http://')) ? '' : 'https://';
    const baseUrl = `${defaultProtocol}${collectDomain}/${model.getConfiguration('path')}`;
    const queryString = `?s=${model.getConfiguration('site')}${model.visitorId ? '&idclient=' + model.visitorId : ''}`;
    model.build.url = baseUrl + queryString;
    model.build.data = {events: model.events};
    nextStep(pa, model, nextSteps);
}

export {buildStep};
