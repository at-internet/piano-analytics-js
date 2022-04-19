import {nextStep} from './utils/index';

function onBeforeBuildStep(pa, model, nextSteps) {
    function next(forceBreak) {
        nextStep(pa, model, nextSteps, forceBreak);
    }

    if (model.options && model.options.onBeforeBuild) {
        model.options.onBeforeBuild(pa, model, next);
    } else {
        next();
    }
}

export default onBeforeBuildStep;
