import {nextStep} from './utils/index';

function onBeforeSendStep(pa, model, nextSteps) {
    function next(forceBreak) {
        nextStep(pa, model, nextSteps, forceBreak);
    }

    if (model.options && model.options.onBeforeSend) {
        model.options.onBeforeSend(pa, model, next);
    } else {
        next();
    }
}

export default onBeforeSendStep;
