import {nextStep} from './utils/index';

function buildStep(pa, model, nextSteps) {
    const baseUrl = `${model.getConfiguration('collectDomain')}/${model.getConfiguration('path')}`;
    const queryString = `?s=${model.getConfiguration('site')}${model.visitorId ? '&idclient=' + model.visitorId : ''}`;
    model.build.url = baseUrl + queryString;
    model.build.data = {events: model.events};
    nextStep(pa, model, nextSteps);
}

export {buildStep};
