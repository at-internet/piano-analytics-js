import {nextStep} from './utils/index';
import {http} from '../../utils/index';

function sendStep(pa, model, nextSteps) {
    if ((pa.privacy.getMode() !== 'optout' || (pa.privacy.getMode() === 'optout' && model.getConfiguration('sendEventWhenOptout'))) &&
        model.build.data.events.length > 0) {
        http.post(model.build.url, JSON.stringify(model.build.data));
    }
    nextStep(pa, model, nextSteps);
}

export default sendStep;
